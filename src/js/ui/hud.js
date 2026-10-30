// Race HUD (DOM at full resolution over the low-res 3D canvas): position badge, lap and time, the water gauge
// with the 10-gallon line (real rule 9), the four attendant items (rule 8), the item bubble, bath tickets,
// a street-shaped minimap, the countdown and short call-outs. Everything redraws only when its value changes.
import { pixelText } from './pixelfont.js';
import { MIN_FINISH_GAL } from '../sim/water.js';
import { TEAM_BY_ID } from '../data/teams.js';
import { TASKS } from '../sim/rules-real.js';

const ORD = ['', '1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH'];
const PLACE_FILL = [null, ['#FFF6C8', '#F2C230'], ['#F4F6FA', '#A9B4C2'], ['#FFE1C4', '#C8783C']];
const ITEM_ICONS = { towel: '#F4F1EA', mat: '#3FA8C0', soap: '#F7B6CE', loofah: '#D9B77A' };
const ITEM_NAMES = { towel: 'Towel', mat: 'Bath mat', soap: 'Soap', loofah: 'Loofah mitt' };

export function fmtTime(t) {
  if (t == null || !isFinite(t)) return '-:--.--';
  t = Math.max(0, t);
  const m = Math.floor(t / 60), s = t - m * 60;
  return `${m}:${s < 10 ? '0' : ''}${s.toFixed(2)}`;
}

export class Hud {
  constructor(root) {
    this.root = root;
    root.innerHTML = `
      <div class="hud-tl"><canvas class="hud-lap" aria-hidden="true"></canvas><div class="hud-time" aria-hidden="true"><canvas class="hud-timec"></canvas></div></div>
      <div class="hud-tr"><canvas class="hud-place" aria-hidden="true"></canvas></div>
      <div class="hud-item" aria-hidden="true"><div class="bubble"><canvas class="item-icon" width="48" height="48"></canvas></div><div class="tickets"><span class="tk-ico"></span><b class="tk-n">0</b></div></div>
      <div class="hud-bl"><canvas class="hud-water" width="150" height="96" aria-hidden="true"></canvas><div class="hud-pips" aria-hidden="true"></div></div>
      <canvas class="hud-map" width="150" height="150" aria-hidden="true"></canvas>
      <div class="hud-center"><canvas class="hud-count" aria-hidden="true"></canvas><div class="hud-call" role="status" aria-live="polite"></div></div>
      <div class="hud-task" role="status" aria-live="assertive"><b class="t-name"></b><span class="t-how"></span><canvas class="t-meter" width="220" height="26" aria-hidden="true"></canvas></div>
      <div class="sr-only" aria-live="polite" id="hud-sr"></div>`;
    const q = (s) => root.querySelector(s);
    this.el = { lap: q('.hud-lap'), time: q('.hud-time'), timeC: q('.hud-timec'), place: q('.hud-place'), water: q('.hud-water'), pips: q('.hud-pips'), map: q('.hud-map'), count: q('.hud-count'), call: q('.hud-call'), icon: q('.item-icon'), tk: q('.tk-n'), sr: q('#hud-sr'), item: q('.hud-item'), task: q('.hud-task'), tname: q('.t-name'), thow: q('.t-how'), tmeter: q('.t-meter') };
    this.el.pips.innerHTML = Object.keys(ITEM_ICONS).map((k) => `<span class="pip pip-${k}" title="${ITEM_NAMES[k]}"><i></i><em>${ITEM_NAMES[k].split(' ')[0]}</em></span>`).join('');
    this.last = {};
    this.callT = 0;
    this.mapCache = null;
  }
  setTrack(track) {
    // minimap: project the centreline into the canvas, north up
    const a = track.a, n = track.n;
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (let i = 0; i < n; i++) { x0 = Math.min(x0, a.x[i]); x1 = Math.max(x1, a.x[i]); z0 = Math.min(z0, a.z[i]); z1 = Math.max(z1, a.z[i]); }
    const W = 150, pad = 12, k = Math.min((W - pad * 2) / (x1 - x0 || 1), (W - pad * 2) / (z1 - z0 || 1));
    const ox = (W - (x1 - x0) * k) / 2, oz = (W - (z1 - z0) * k) / 2;
    this.mapT = (x, z) => [ox + (x - x0) * k, oz + (z - z0) * k];
    const c = document.createElement('canvas'); c.width = W; c.height = W;
    const g = c.getContext('2d');
    g.lineJoin = 'round'; g.lineCap = 'round';
    const path = () => { g.beginPath(); for (let i = 0; i <= n; i++) { const [px, pz] = this.mapT(a.x[i % n], a.z[i % n]); i ? g.lineTo(px, pz) : g.moveTo(px, pz); } };
    path(); g.strokeStyle = 'rgba(20,24,40,0.85)'; g.lineWidth = 9; g.stroke();
    path(); g.strokeStyle = '#F4F1EA'; g.lineWidth = 4; g.stroke();
    const [sx, sz] = this.mapT(a.x[0], a.z[0]);
    g.fillStyle = '#C8322A'; g.fillRect(sx - 4, sz - 4, 8, 8);
    this.mapCache = c;
  }
  flash(text, kind = '', secs = 1.4) {
    this.el.call.textContent = text;
    this.el.call.className = 'hud-call show ' + kind;
    this.callT = secs;
    this.el.sr.textContent = text;
  }
  update(race, track, me, dt) {
    const L = this.last, el = this.el;
    // countdown / go
    const ct = race.phase === 'countdown' ? (race.time + 3.2 < 1.1 ? 'READY' : race.time + 3.2 < 2.2 ? 'SET' : '') : race.time < 0.9 ? 'SCRUB!' : '';
    if (ct !== L.ct) {
      L.ct = ct;
      if (ct) pixelText(ct, { scale: window.innerWidth < 600 ? 6 : 9, canvas: el.count, fill: ct === 'SCRUB!' ? ['#E9FBFF', '#3FA8C0'] : ['#FFF6C8', '#F2A541'] });
      el.count.style.display = ct ? 'block' : 'none';
      if (ct) el.sr.textContent = ct;
    }
    if (!me) return;
    // lap
    const lap = Math.max(1, Math.min(race.laps, me.lap || 1));
    const lapTxt = race.row ? race.row.label.toUpperCase() : race.battle ? `${race.karts.filter((k) => !k.out).length} LEFT` : `LAP ${lap}/${race.laps}`;
    if (lapTxt !== L.lap) { L.lap = lapTxt; pixelText(lapTxt, { scale: 3, canvas: el.lap, fill: ['#FFFFFF', '#BFD7EA'] }); }
    const t = race.battle ? Math.max(0, race.battle.secs - Math.max(0, race.time)) : race.phase === 'countdown' ? 0 : me.finished ? me.finishT : race.time;
    const tt = fmtTime(t);
    if (tt !== L.tt) { L.tt = tt; pixelText(tt, { scale: 3, canvas: el.timeC, fill: ['#FFFFFF', '#BFD7EA'] }); el.time.setAttribute('aria-label', tt); }
    // place
    if (me.place !== L.place) {
      L.place = me.place;
      pixelText(ORD[me.place] || '', { scale: 7, canvas: el.place, fill: PLACE_FILL[me.place] || ['#FFFFFF', '#9FB3C8'] });
    }
    // water gauge
    const gal = Math.round(me.water.gal * 2) / 2;
    if (gal !== L.gal || me.water.cap !== L.cap) { L.gal = gal; L.cap = me.water.cap; this.drawWater(me.water); }
    // attendant items
    const held = Object.entries(me.items).map(([k, v]) => (v ? 1 : 0)).join('');
    if (held !== L.held) {
      L.held = held;
      Object.entries(me.items).forEach(([k, v]) => el.pips.querySelector('.pip-' + k).classList.toggle('lost', !v));
    }
    // held item and tickets
    const itemKey = (me.held || '') + ':' + (me.heldN || 0);
    if (itemKey !== L.item) { L.item = itemKey; this.drawItem(me.held, me.heldN); }
    if (me.tickets !== L.tk) { L.tk = me.tickets; el.tk.textContent = me.tickets; }
    // minimap with every tub (rivals as dots, you as an arrow)
    this.drawMap(race, me);
    // Rules of the Row: the judges' task prompt and its meter
    const tk = race.phase === 'done' ? null : me.task;
    const tkey = tk ? tk.id : '';
    if (tkey !== L.task) {
      L.task = tkey;
      el.task.classList.toggle('show', !!tk);
      if (tk) { el.tname.textContent = TASKS[tk.id].name.toUpperCase() + '!'; el.thow.textContent = TASKS[tk.id].how; el.sr.textContent = TASKS[tk.id].name + ': ' + TASKS[tk.id].how; }
    }
    if (tk) this.drawTask(tk);
    // call-outs
    if (this.callT > 0) { this.callT -= dt; if (this.callT <= 0) el.call.className = 'hud-call'; }
  }
  drawTask(tk) {
    const c = this.el.tmeter, g = c.getContext('2d'), W = c.width, H = c.height, def = TASKS[tk.id];
    g.clearRect(0, 0, W, H);
    g.fillStyle = 'rgba(16,20,34,0.8)'; g.fillRect(0, 0, W, H);
    let f = 0;
    if (def.kind === 'mash' || def.kind === 'alt') f = tk.n / def.need;
    else if (def.kind === 'hold') f = tk.hold / def.secs;
    else if (def.kind === 'auto') f = tk.t / def.secs;
    if (def.kind === 'timing') {
      g.fillStyle = '#3FA8C0'; g.fillRect(W * 0.4, 2, W * 0.2, H - 4); // the tub
      g.fillStyle = '#F7B6CE'; g.fillRect(W * tk.marker - 6, 3, 12, H - 6); // the soap
      g.strokeStyle = '#2A1A10'; g.lineWidth = 2; g.strokeRect(W * tk.marker - 6, 3, 12, H - 6);
    } else {
      g.fillStyle = '#F2A541'; g.fillRect(2, 2, (W - 4) * Math.min(1, f), H - 4);
    }
    g.strokeStyle = '#FFF6C8'; g.lineWidth = 2; g.strokeRect(1, 1, W - 2, H - 2);
  }
  drawWater(w) {
    const c = this.el.water, g = c.getContext('2d'), W = c.width, H = c.height;
    g.clearRect(0, 0, W, H);
    const fill = w.cap ? w.gal / w.cap : 0;
    // tub silhouette (side view): rim, bowl, claw feet
    const x0 = 12, x1 = W - 12, top = 18, bot = 70;
    g.fillStyle = 'rgba(16,20,34,0.72)'; roundRect(g, 2, 2, W - 4, H - 4, 12); g.fill();
    g.save();
    g.beginPath(); g.moveTo(x0, top); g.lineTo(x1, top); g.quadraticCurveTo(x1 - 4, bot, x1 - 26, bot); g.lineTo(x0 + 26, bot); g.quadraticCurveTo(x0 + 4, bot, x0, top); g.closePath();
    g.fillStyle = '#E9E4DA'; g.fill();
    g.clip();
    const wy = bot - (bot - top) * fill;
    g.fillStyle = fill < MIN_FINISH_GAL / w.cap ? '#E2574C' : '#3FA8C0';
    g.fillRect(0, wy, W, H);
    // stripes on the water (pattern cue, not colour alone)
    g.fillStyle = 'rgba(255,255,255,0.28)'; for (let x = -20; x < W; x += 12) { g.beginPath(); g.moveTo(x, wy); g.lineTo(x + 6, wy); g.lineTo(x + 6 - 30, bot + 10); g.lineTo(x - 30, bot + 10); g.fill(); }
    // 10-gallon line
    const ly = bot - (bot - top) * (MIN_FINISH_GAL / w.cap);
    g.restore();
    g.strokeStyle = '#2A1A10'; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, top); g.lineTo(x1, top); g.quadraticCurveTo(x1 - 4, bot, x1 - 26, bot); g.lineTo(x0 + 26, bot); g.quadraticCurveTo(x0 + 4, bot, x0, top); g.stroke();
    g.setLineDash([5, 3]); g.strokeStyle = '#FFF6C8'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0 + 4, ly); g.lineTo(x1 - 4, ly); g.stroke(); g.setLineDash([]);
    g.fillStyle = '#FFF6C8'; g.font = 'bold 11px system-ui, sans-serif'; g.fillText('10', x1 - 2, ly + 4);
    for (const fx of [x0 + 22, x1 - 22]) { g.fillStyle = '#C9A24A'; g.fillRect(fx - 4, bot, 8, 7); }
    g.fillStyle = '#FFFFFF'; g.font = 'bold 15px system-ui, sans-serif'; g.textAlign = 'center';
    g.fillText(`${w.gal.toFixed(0)} GAL`, W / 2, H - 6); g.textAlign = 'left';
  }
  drawItem(id, n) {
    const g = this.el.icon.getContext('2d');
    g.clearRect(0, 0, 48, 48);
    this.el.item.classList.toggle('has', !!id);
    if (!id) return;
    drawItemIcon(g, id, 24, 24, 18);
    if (n > 1) { g.fillStyle = '#2A1A10'; g.font = 'bold 14px system-ui'; g.fillText('×' + n, 30, 44); }
  }
  drawMap(race, me) {
    if (!this.mapCache) return;
    const c = this.el.map, g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    g.drawImage(this.mapCache, 0, 0);
    for (const k of race.karts) {
      if (k === me) continue;
      const [x, z] = this.mapT(k.x, k.z);
      g.fillStyle = TEAM_BY_ID[k.team].colors.tub; g.strokeStyle = '#111'; g.lineWidth = 1.5;
      g.beginPath(); g.arc(x, z, 4, 0, Math.PI * 2); g.fill(); g.stroke();
    }
    const [x, z] = this.mapT(me.x, me.z);
    g.save(); g.translate(x, z); g.rotate(Math.atan2(Math.cos(me.yaw), Math.sin(me.yaw)) + Math.PI / 2);
    g.fillStyle = '#FFF6C8'; g.strokeStyle = '#2A1A10'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(0, -8); g.lineTo(6, 6); g.lineTo(-6, 6); g.closePath(); g.fill(); g.stroke();
    g.restore();
  }
}

function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

// Item icons drawn in code (shape + colour, so they read without colour vision)
export function drawItemIcon(g, id, cx, cy, r) {
  g.save(); g.translate(cx, cy); g.lineWidth = 2; g.strokeStyle = '#2A1A10';
  const fillStroke = () => { g.fill(); g.stroke(); };
  switch (id) {
    case 'duck': g.fillStyle = '#F5D547'; g.beginPath(); g.ellipse(0, 4, r * 0.75, r * 0.5, 0, 0, Math.PI * 2); fillStroke(); g.beginPath(); g.arc(r * 0.3, -r * 0.35, r * 0.38, 0, Math.PI * 2); fillStroke(); g.fillStyle = '#F07F22'; g.beginPath(); g.moveTo(r * 0.62, -r * 0.4); g.lineTo(r, -r * 0.3); g.lineTo(r * 0.62, -r * 0.18); fillStroke(); g.fillStyle = '#111'; g.fillRect(r * 0.32, -r * 0.5, 3, 3); break;
    case 'soap': g.fillStyle = '#F7B6CE'; roundRect(g, -r * 0.8, -r * 0.45, r * 1.6, r * 0.9, 6); fillStroke(); g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(-r * 0.5, -r * 0.25, r * 0.6, 3); break;
    case 'bomb': g.fillStyle = '#9B4DCA'; g.beginPath(); g.arc(0, 2, r * 0.75, 0, Math.PI * 2); fillStroke(); g.fillStyle = '#F5D547'; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(Math.cos(i * 1.3) * r * 0.4, 2 + Math.sin(i * 1.3) * r * 0.4, 2.5, 0, Math.PI * 2); g.fill(); } break;
    case 'loofah': g.fillStyle = '#D9B77A'; for (let i = 0; i < 3; i++) { const a = i * 2.1 - 1.57; g.beginPath(); g.arc(Math.cos(a) * r * 0.45, Math.sin(a) * r * 0.45, r * 0.42, 0, Math.PI * 2); fillStroke(); } break;
    case 'towel': g.fillStyle = '#F4F1EA'; g.beginPath(); g.moveTo(-r, -r * 0.4); g.quadraticCurveTo(0, -r, r, -r * 0.2); g.lineTo(r * 0.6, r * 0.5); g.quadraticCurveTo(0, 0, -r * 0.8, r * 0.4); g.closePath(); fillStroke(); g.strokeStyle = '#C8322A'; g.beginPath(); g.moveTo(-r * 0.7, -r * 0.2); g.quadraticCurveTo(0, -r * 0.7, r * 0.75, -r * 0.05); g.stroke(); break;
    case 'jet': case 'jet3': g.fillStyle = '#E9FBFF'; for (let i = 0; i < (id === 'jet3' ? 3 : 1); i++) { const ox = (i - (id === 'jet3' ? 1 : 0)) * r * 0.55; g.beginPath(); g.moveTo(ox, -r); g.quadraticCurveTo(ox + r * 0.5, 0, ox, r); g.quadraticCurveTo(ox - r * 0.5, 0, ox, -r); fillStroke(); } break;
    case 'blaster': g.fillStyle = '#3FA8C0'; g.fillRect(-r * 0.9, -r * 0.35, r * 1.4, r * 0.55); g.strokeRect(-r * 0.9, -r * 0.35, r * 1.4, r * 0.55); g.fillStyle = '#F5D547'; g.fillRect(-r * 0.3, r * 0.2, r * 0.4, r * 0.55); g.strokeRect(-r * 0.3, r * 0.2, r * 0.4, r * 0.55); g.fillStyle = '#7FD3F0'; g.beginPath(); g.arc(r * 0.8, -r * 0.1, 4, 0, Math.PI * 2); g.fill(); break;
    case 'bubble': g.fillStyle = 'rgba(190,240,255,0.7)'; g.beginPath(); g.arc(0, 0, r * 0.9, 0, Math.PI * 2); fillStroke(); g.fillStyle = 'rgba(255,255,255,0.9)'; g.beginPath(); g.arc(-r * 0.35, -r * 0.35, r * 0.2, 0, Math.PI * 2); g.fill(); break;
    case 'hose': g.fillStyle = '#C8322A'; g.beginPath(); g.arc(0, 0, r * 0.8, 0, Math.PI * 2); fillStroke(); g.fillStyle = '#F2C230'; g.beginPath(); g.arc(0, 0, r * 0.35, 0, Math.PI * 2); fillStroke(); break;
    default: g.fillStyle = '#ccc'; g.fillRect(-r / 2, -r / 2, r, r);
  }
  g.restore();
}
