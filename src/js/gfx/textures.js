// Texture library: Codex-painted textures from asset packs (base64 data URIs, so file:// works) with procedural
// canvas fallbacks drawn in code. Everything is N64-sized (32–128 px) and sampled bilinear in gamma space.
import { texFromCanvas, texFromImage } from './n64mat.js';
import { makeRng } from '../rng.js';

const cache = {};
let packImages = {};

// Decode every texture in the loaded packs (window.TR_PACKS) into Image objects. Resolves when all are ready.
export async function loadPackTextures(names = null) {
  const packs = window.TR_PACKS || {};
  const jobs = [];
  for (const [pname, pack] of Object.entries(packs)) {
    if (names && !names.includes(pname)) continue;
    for (const [name, t] of Object.entries(pack.tex || {})) {
      if (packImages[name]) continue;
      const img = new Image();
      img.src = t.uri;
      packImages[name] = img;
      jobs.push(img.decode().catch(() => { delete packImages[name]; }));
    }
  }
  await Promise.all(jobs);
}

export function hasArt(name) { return !!packImages[name] && !(window.__ART_OFF); }

export function tex(name, opts = {}) {
  const key = name + (opts.repeat === false ? ':c' : '');
  if (cache[key]) return cache[key];
  let t;
  if (hasArt(name)) t = texFromImage(packImages[name], opts);
  else t = texFromCanvas(PROC[name] ? PROC[name]() : PROC.checker(), opts);
  cache[key] = t;
  return t;
}

function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function noiseFill(g, w, h, base, amp, seed) {
  const r = makeRng(seed), d = g.getImageData(0, 0, w, h), p = d.data;
  for (let i = 0; i < w * h; i++) {
    const n = (r.next() - 0.5) * amp;
    p[i * 4] = Math.max(0, Math.min(255, base[0] + n)); p[i * 4 + 1] = Math.max(0, Math.min(255, base[1] + n)); p[i * 4 + 2] = Math.max(0, Math.min(255, base[2] + n)); p[i * 4 + 3] = 255;
  }
  g.putImageData(d, 0, 0);
}

// Procedural fallbacks (also used for surfaces not yet painted)
export const PROC = {
  checker() { const c = canvas(32, 32), g = c.getContext('2d'); for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { g.fillStyle = (x + y) % 2 ? '#bbb' : '#888'; g.fillRect(x * 8, y * 8, 8, 8); } return c; },
  asphalt() { const c = canvas(64, 64), g = c.getContext('2d'); noiseFill(g, 64, 64, [92, 92, 96], 34, 1); return c; },
  brick() {
    const c = canvas(64, 64), g = c.getContext('2d'); g.fillStyle = '#7a4a38'; g.fillRect(0, 0, 64, 64);
    const r = makeRng(5);
    for (let y = 0; y < 8; y++) for (let x = -1; x < 5; x++) { const v = 150 + r.int(40); g.fillStyle = `rgb(${v},${70 + r.int(20)},${50 + r.int(14)})`; g.fillRect(x * 16 + (y % 2) * 8 + 1, y * 8 + 1, 14, 6); }
    return c;
  },
  concrete() { const c = canvas(64, 64), g = c.getContext('2d'); noiseFill(g, 64, 64, [176, 172, 160], 22, 2); g.strokeStyle = 'rgba(0,0,0,0.18)'; g.strokeRect(0.5, 0.5, 63, 63); return c; },
  grass() {
    const c = canvas(64, 64), g = c.getContext('2d'); noiseFill(g, 64, 64, [118, 150, 74], 40, 3);
    const r = makeRng(9); for (let i = 0; i < 90; i++) { g.fillStyle = r.chance(0.5) ? 'rgba(60,96,40,0.6)' : 'rgba(170,196,96,0.5)'; g.fillRect(r.int(64), r.int(64), 1 + r.int(2), 2 + r.int(3)); }
    return c;
  },
  dirt() { const c = canvas(64, 64), g = c.getContext('2d'); noiseFill(g, 64, 64, [150, 116, 82], 40, 4); return c; },
  rock() {
    const c = canvas(64, 64), g = c.getContext('2d'); noiseFill(g, 64, 64, [150, 146, 136], 46, 6);
    const r = makeRng(12); g.strokeStyle = 'rgba(60,56,50,0.5)'; for (let i = 0; i < 14; i++) { g.beginPath(); const x = r.int(64), y = r.int(64); g.moveTo(x, y); g.lineTo(x + r.range(-14, 14), y + r.range(2, 12)); g.stroke(); }
    return c;
  },
  'fordyce-bay'() {
    const c = canvas(64, 64), g = c.getContext('2d'); g.fillStyle = '#E9D29A'; g.fillRect(0, 0, 64, 64);
    g.fillStyle = '#B8573A'; g.fillRect(0, 0, 64, 7); g.fillRect(0, 58, 64, 6);
    g.fillStyle = '#5B3A26'; for (const [x, y] of [[10, 22], [54, 22], [10, 44], [54, 44]]) { g.beginPath(); g.moveTo(x, y - 6); g.lineTo(x + 6, y); g.lineTo(x, y + 6); g.lineTo(x - 6, y); g.closePath(); g.fill(); }
    g.fillStyle = '#26303A'; g.fillRect(24, 16, 16, 38); g.beginPath(); g.arc(32, 16, 8, Math.PI, 0); g.fill();
    return c;
  },
  storefront() {
    // two-storey brick commercial front: upper windows, cornice, ground-floor glass and an awning band
    const c = canvas(64, 64), g = c.getContext('2d');
    g.fillStyle = '#9C5B43'; g.fillRect(0, 0, 64, 64);
    g.fillStyle = '#D8CDB6'; g.fillRect(0, 0, 64, 5);
    g.fillStyle = '#2B3440'; for (const x of [6, 26, 46]) g.fillRect(x, 10, 12, 16);
    g.fillStyle = '#D8CDB6'; for (const x of [6, 26, 46]) g.fillRect(x - 1, 26, 14, 2);
    g.fillStyle = '#3A4A58'; g.fillRect(4, 40, 56, 20);
    g.fillStyle = '#C9DCE4'; g.fillRect(6, 42, 24, 16); g.fillRect(34, 42, 24, 16);
    g.fillStyle = '#2E7D6E'; g.fillRect(0, 33, 64, 6);
    g.fillStyle = '#E8E0CC'; for (let x = 0; x < 64; x += 8) g.fillRect(x, 33, 4, 6);
    return c;
  },
  pine() {
    const c = canvas(32, 64), g = c.getContext('2d');
    g.fillStyle = '#6B4227'; g.fillRect(14, 40, 4, 24);
    for (let i = 0; i < 5; i++) { const y = 6 + i * 9, w = 6 + i * 2.6; g.fillStyle = i % 2 ? '#2F4A2C' : '#24402A'; g.beginPath(); g.moveTo(16, y - 6); g.lineTo(16 + w, y + 9); g.lineTo(16 - w, y + 9); g.closePath(); g.fill(); }
    return c;
  },
  oak() { return PROC.magnolia(); },
  magnolia() {
    const c = canvas(32, 64), g = c.getContext('2d'), r = makeRng(21);
    g.fillStyle = '#5A3E2A'; g.fillRect(14, 44, 4, 20);
    g.fillStyle = '#244A2E'; g.beginPath(); g.ellipse(16, 30, 14, 22, 0, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 60; i++) { g.fillStyle = r.chance(0.5) ? '#2F6038' : '#1B3A24'; g.fillRect(4 + r.int(24), 10 + r.int(40), 3, 2); }
    for (let i = 0; i < 9; i++) { g.fillStyle = '#F6F3EC'; g.fillRect(6 + r.int(20), 12 + r.int(34), 2, 2); }
    return c;
  },
  crowd() {
    const c = canvas(128, 64), g = c.getContext('2d'), r = makeRng(33);
    const shirts = ['#E84E8A', '#3FA8C0', '#F5D547', '#7DBB3C', '#F07F22', '#9B4DCA'];
    for (let i = 0; i < 6; i++) {
      const x = 8 + i * 20;
      g.fillStyle = shirts[i]; g.fillRect(x, 30, 12, 18);
      g.fillStyle = ['#E0AA80', '#8D5A3B', '#C68C5D', '#F1C9A5'][r.int(4)]; g.fillRect(x + 2, 20, 8, 9);
      g.fillStyle = '#3A6FD8'; g.fillRect(x - 2, 26 - (i % 2) * 6, 8, 3);
    }
    g.fillStyle = '#B7BEC6'; g.fillRect(0, 44, 128, 3); g.fillRect(0, 56, 128, 2);
    for (let x = 2; x < 128; x += 9) g.fillRect(x, 44, 2, 20);
    return c;
  },
  bubble() {
    const c = canvas(32, 32), g = c.getContext('2d');
    const gr = g.createRadialGradient(12, 11, 2, 16, 16, 15);
    gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(0.35, 'rgba(190,240,255,0.55)'); gr.addColorStop(0.8, 'rgba(240,170,255,0.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(16, 16, 15, 0, Math.PI * 2); g.fill();
    return c;
  },
};

// A painted-looking horizon ring: layered ridges (Ouachita bands) on a transparent canvas, tiled around 360°.
export function horizonCanvas(cols = ['#6F8FA6', '#5C7D6A', '#3F5E45'], seed = 2) {
  const W = 512, H = 128, c = canvas(W, H), g = c.getContext('2d'), r = makeRng(seed);
  cols.forEach((col, layer) => {
    const base = 70 + layer * 18, amp = 26 - layer * 6, freq = [3, 5, 8][layer] || 6;
    const ph = r.range(0, 6.28), ph2 = r.range(0, 6.28);
    g.fillStyle = col; g.beginPath(); g.moveTo(0, H);
    for (let x = 0; x <= W; x += 4) {
      const u = (x / W) * Math.PI * 2;
      const y = base - amp * (0.6 * Math.sin(u * freq + ph) + 0.3 * Math.sin(u * freq * 2.3 + ph2) + 0.15 * Math.sin(u * 17 + layer));
      g.lineTo(x, y);
    }
    g.lineTo(W, H); g.closePath(); g.fill();
  });
  return c;
}
