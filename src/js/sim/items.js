// Items, soap-bubble pickups, bath tickets and judge stands (all original, bath-themed; no item targets the
// leader). Pure sim: projectiles move on the same track surface as the tubs; hits call fumble() (real rule 7:
// an attendant drops their item and the team circles the tub).
import { fumble } from './kart.js';
import { addWater, removeWater } from './water.js';
import { LIMIT } from './track.js';

export const ITEMS = {
  duck: { name: 'Rubber Duck', kind: 'shot' },
  soap: { name: 'Bar of Soap', kind: 'shot' },
  bomb: { name: 'Bath Bomb', kind: 'trap' },
  loofah: { name: 'Loofah Shield', kind: 'guard' },
  towel: { name: 'Towel Snap', kind: 'melee' },
  jet: { name: 'Thermal Jet', kind: 'boost' },
  jet3: { name: 'Triple Thermal Jet', kind: 'boost', uses: 3 },
  blaster: { name: 'Water Blaster', kind: 'spray' },
  bubble: { name: 'Bubble Bath', kind: 'guard' },
  hose: { name: 'Fire Hose', kind: 'boost' },
};

// odds by place (1st … 8th): the front gets defensive items, the back gets catch-up items
export const ODDS = [
  { bomb: 32, soap: 34, loofah: 14, towel: 20 },
  { bomb: 18, soap: 26, loofah: 10, towel: 14, duck: 18, jet: 10, blaster: 4 },
  { bomb: 12, soap: 18, loofah: 7, towel: 12, duck: 24, jet: 14, blaster: 11, jet3: 2 },
  { bomb: 8, soap: 14, loofah: 5, towel: 10, duck: 26, jet: 16, blaster: 14, jet3: 6, bubble: 2 },
  { bomb: 4, soap: 8, loofah: 6, towel: 8, duck: 22, jet: 16, blaster: 16, jet3: 12, bubble: 6, hose: 2 },
  { bomb: 2, soap: 6, loofah: 4, towel: 6, duck: 20, jet: 14, blaster: 16, jet3: 16, bubble: 10, hose: 6 },
  { soap: 4, towel: 4, duck: 18, jet: 10, blaster: 14, jet3: 20, bubble: 16, hose: 14 },
  { duck: 16, jet: 8, blaster: 12, jet3: 22, bubble: 20, hose: 22 },
];

const ROW_FRACS = [0.13, 0.38, 0.6, 0.84];
const TICKET_FRACS = [0.27, 0.52, 0.74];
const BUBBLE_RESPAWN = 1.6, TICKET_RESPAWN = 10, MAX_TICKETS = 10, BRIBE_COST = 3;

export function makeItemState(track, opts = {}) {
  const st = { bubbles: [], tickets: [], live: [], nextId: 1, judges: [] };
  if (!track || opts.noItems) return st;
  const L = track.length;
  const rows = (track.zones || []).filter((z) => z.type === 'items').map((z) => (z.s0 + z.s1) / 2);
  const rowS = rows.length ? rows : ROW_FRACS.map((f) => f * L);
  for (const s of rowS) {
    const c = track.at(s), w = Math.min(c.wl, c.wr) - 1.6;
    for (let k = 0; k < 4; k++) {
      const d = -w + (2 * w * k) / 3;
      const p = track.point(s, d);
      st.bubbles.push({ id: st.nextId++, s, d, x: p.x, y: p.y + 1.1, z: p.z, on: true, t: 0 });
    }
  }
  for (const f of TICKET_FRACS) {
    const s0 = f * L;
    for (let k = 0; k < 3; k++) {
      const s = s0 + k * 5, c = track.at(s);
      const line = track.a.line ? track.a.line[c.i] : 0;
      const d = Math.max(-c.wl + 1.5, Math.min(c.wr - 1.5, line + (line > 0 ? -4 : 4)));
      const p = track.point(s, d);
      st.tickets.push({ id: st.nextId++, s, d, x: p.x, y: p.y + 0.9, z: p.z, on: true, t: 0 });
    }
  }
  // one judge stand per lap with a bribe lane on the right edge (blue feather flags mark it)
  const jz = (track.zones || []).filter((z) => z.type === 'judge');
  const js = jz.length ? jz.map((z) => ({ s: (z.s0 + z.s1) / 2, side: z.d0 != null && z.d0 < 0 ? -1 : 1 })) : [{ s: 0.46 * L, side: 1 }];
  for (const j of js) {
    const c = track.at(j.s), w = j.side > 0 ? c.wr : c.wl;
    st.judges.push({ s: j.s, side: j.side, d0: j.side > 0 ? w - 4.5 : -w + 0.5, d1: j.side > 0 ? w - 0.5 : -w + 4.5, len: 14 });
  }
  return st;
}

function kartMass(k) { return k.stats.tubKg + k.water.gal * 3.785; }
const near = (a, b, r) => (a.x - b.x) ** 2 + (a.z - b.z) ** 2 < r * r && Math.abs(a.y - b.y) < 2.5;

export function rollItem(rng, place) {
  const t = ODDS[Math.max(0, Math.min(7, place - 1))];
  return rng.weighted(Object.entries(t));
}

export function stepItems(race, track, inputs, dt) {
  const S = race.items, rng = race.rng.items, karts = race.karts;
  if (race.phase !== 'race') return;
  // pickups
  for (const b of S.bubbles) {
    if (!b.on) { b.t -= dt; if (b.t <= 0) b.on = true; continue; }
    for (const k of karts) {
      if (k.state === 'rescue' || !near(k, b, 1.9)) continue;
      b.on = false; b.t = BUBBLE_RESPAWN;
      if (!k.held) { k.held = rollItem(rng, k.place || 8); k.heldN = ITEMS[k.held].uses || 1; k.events.push({ type: 'pickup', item: k.held }); }
      break;
    }
  }
  for (const tk of S.tickets) {
    if (!tk.on) { tk.t -= dt; if (tk.t <= 0) tk.on = true; continue; }
    for (const k of karts) {
      if (k.state === 'rescue' || !near(k, tk, 1.7)) continue;
      tk.on = false; tk.t = TICKET_RESPAWN;
      if (k.tickets < MAX_TICKETS) { k.tickets++; k.events.push({ type: 'ticket', n: k.tickets }); }
      break;
    }
  }
  // judge stands: drive through the bribe lane with 3 tickets for a Head Start boost (real rules 17–18)
  for (const j of S.judges) {
    for (const k of karts) {
      const ds = track.ds(j.s, k.s);
      if (ds < -j.len / 2 || ds > j.len / 2 || k.d < j.d0 || k.d > j.d1) { if (k._judge === j) k._judge = null; continue; }
      if (k._judge === j) continue;
      k._judge = j;
      if (k.tickets >= BRIBE_COST && k.state === 'run') {
        k.tickets -= BRIBE_COST; k.bribes = (k.bribes || 0) + 1;
        k.boostT = Math.max(k.boostT, 1.5); k.boostKind = 'headstart';
        k.events.push({ type: 'bribe' });
      }
    }
  }
  // using items
  karts.forEach((k, i) => {
    if (!k.held || k.state === 'rescue' || k.finished) return;
    const drv = race.drivers[i];
    let use = false, back = false;
    if (drv) ({ use, back } = aiItem(race, track, k, drv, dt));
    else { const inp = inputs[i] || {}; use = !!inp.item; back = !!(inp.brake || inp.back); }
    if (use) useItem(race, track, k, back);
  });
  // live objects
  for (const o of S.live) stepObject(race, track, o, dt);
  S.live = S.live.filter((o) => !o.dead);
  // shields and sprays tick down
  for (const k of karts) {
    if (k.sprayT > 0) {
      k.sprayT -= dt;
      const fx = Math.sin(k.yaw), fz = Math.cos(k.yaw);
      for (const o of karts) {
        if (o === k || o.state === 'rescue') continue;
        const dx = o.x - k.x, dz = o.z - k.z, along = dx * fx + dz * fz, side = Math.abs(dx * -fz + dz * fx);
        if (along > 0.5 && along < 13 && side < 1.2 + along * 0.45 && o.bubbleT <= 0) {
          const g = removeWater(o.water, 4.5 * dt);
          addWater(k.water, g * 0.35);
          if (!o._sprayed) { o._sprayed = true; o.events.push({ type: 'sprayed' }); }
        } else o._sprayed = false;
      }
    }
    if (k.hoseT > 0) {
      for (const o of karts) {
        if (o === k || o.state === 'rescue' || !near(k, o, 2.6)) continue;
        const dx = o.x - k.x, dz = o.z - k.z, l = Math.hypot(dx, dz) || 1;
        o.vl += ((dx / l) * -Math.cos(o.yaw) + (dz / l) * Math.sin(o.yaw)) * 8 * dt * 10;
        removeWater(o.water, 1.5 * dt);
      }
    }
  }
}

function spawn(S, o) { o.id = S.nextId++; o.t = 0; S.live.push(o); return o; }

export function useItem(race, track, k, back = false) {
  const S = race.items, item = k.held;
  const fx = Math.sin(k.yaw), fz = Math.cos(k.yaw);
  const ev = { type: 'use', item };
  switch (item) {
    case 'duck': {
      // paddles along the racing line to the next racer ahead (never the leader specifically)
      const ahead = race.karts.filter((o) => o !== k && !o.finished && o.place === k.place - 1)[0] || null;
      spawn(S, { type: 'duck', owner: k.id, target: ahead ? ahead.id : -1, s: k.s + 2.5, d: k.d, x: k.x + fx * 2.5, z: k.z + fz * 2.5, y: k.y + 0.4, v: Math.max(30, k.vf + 12), ttl: 12 });
      break;
    }
    case 'soap': {
      const dir = back ? -1 : 1, v = back ? 6 : Math.max(28, k.vf + 12);
      spawn(S, { type: 'soap', owner: k.id, x: k.x + fx * 2.4 * dir, z: k.z + fz * 2.4 * dir, y: k.y + 0.3, vx: fx * v * dir, vz: fz * v * dir, s: k.s, bounces: 0, ttl: back ? 25 : 7 });
      break;
    }
    case 'bomb': {
      if (back) spawn(S, { type: 'slick', owner: k.id, x: k.x - fx * 2.6, z: k.z - fz * 2.6, y: k.y, s: k.s, ttl: 22, arm: 0.3 });
      else spawn(S, { type: 'bombArc', owner: k.id, x: k.x, z: k.z, y: k.y + 1, vx: fx * (k.vf + 14), vz: fz * (k.vf + 14), vy: 6, s: k.s, ttl: 3 });
      break;
    }
    case 'loofah':
      if (k.shield > 0) { // fling one loofah forward
        k.shield--;
        spawn(S, { type: 'soap', owner: k.id, x: k.x + fx * 2.4, z: k.z + fz * 2.4, y: k.y + 0.4, vx: fx * (k.vf + 10), vz: fz * (k.vf + 10), s: k.s, bounces: 2, ttl: 4, loofah: true });
        if (k.shield > 0) { ev.keep = true; }
      } else { k.shield = 3; ev.keep = true; k.heldN = 3; }
      break;
    case 'towel': {
      for (const o of race.karts) {
        if (o === k || !near(k, o, 3.6)) continue;
        const side = Math.sign((o.x - k.x) * -fz + (o.z - k.z) * fx) || 1;
        o.vl += side * 6;
        fumble(o, race.rng.items, 2);
      }
      for (const o of S.live) if ((o.type === 'soap' || o.type === 'duck') && (o.x - k.x) ** 2 + (o.z - k.z) ** 2 < 20) o.dead = true;
      ev.snap = true;
      break;
    }
    case 'jet': case 'jet3':
      k.boostT = Math.max(k.boostT, 1.5); k.boostKind = 'jet';
      break;
    case 'blaster': k.sprayT = 1.6; break;
    case 'bubble': k.bubbleT = 3.2; break;
    case 'hose': k.hoseT = 3.6; addWater(k.water, 12); break;
    default: break;
  }
  k.events.push(ev);
  if (item === 'loofah') { if (!ev.keep) k.held = null; return; }
  k.heldN = Math.max(0, (k.heldN || 1) - 1);
  if (k.heldN <= 0) k.held = null;
}

function hitKart(race, o, k, gal) {
  if (k.bubbleT > 0 || k.out) return false;
  const did = fumble(k, race.rng.items, gal * (race.hitMul || 1));
  o.dead = true;
  k.events.push({ type: 'hit', by: o.type, owner: o.owner, blocked: !did });
  const owner = race.karts[o.owner];
  if (owner && did) owner.events.push({ type: 'scored', on: k.id, by: o.type });
  return did;
}

function stepObject(race, track, o, dt) {
  o.t += dt; o.ttl -= dt;
  if (o.ttl <= 0) { o.dead = true; return; }
  const karts = race.karts;
  if (o.type === 'duck') {
    const tgt = o.target >= 0 ? karts[o.target] : null;
    o.s = track.wrapS(o.s + o.v * dt);
    const c = track.at(o.s);
    const want = tgt && !tgt.finished && tgt.state !== 'rescue' ? tgt.d : (track.a.line ? track.a.line[c.i] : 0);
    o.d += Math.max(-10 * dt, Math.min(10 * dt, want - o.d));
    const p = track.point(o.s, o.d);
    o.x = p.x; o.z = p.z; o.y = p.y + 0.4;
    for (const k of karts) {
      if (k.id === o.owner && o.t < 0.6) continue;
      if (near(o, k, 1.8)) { hitKart(race, o, k, 4); return; }
    }
    return;
  }
  if (o.type === 'soap') {
    o.x += o.vx * dt; o.z += o.vz * dt;
    const sf = track.surface(o.x, o.z, o.s);
    o.s = sf.s; o.y = sf.h + 0.25;
    if (sf.ad > sf.lim) {
      if (sf.limType === LIMIT.DROP || sf.limType === LIMIT.SOFT || o.bounces >= 4) { o.dead = true; return; }
      const side = Math.sign(sf.d) || 1, c = sf.c, nx = -c.tz * side, nz = c.tx * side;
      const vn = o.vx * nx + o.vz * nz;
      if (vn > 0) { o.vx -= 2 * vn * nx; o.vz -= 2 * vn * nz; o.bounces++; }
      const p = track.point(sf.s, side * (sf.lim - 0.2)); o.x = p.x; o.z = p.z;
    }
    const sp = Math.hypot(o.vx, o.vz);
    if (sp > 1) { const k2 = Math.max(0, 1 - 0.15 * dt); o.vx *= k2; o.vz *= k2; }
    for (const k of karts) {
      if (k.id === o.owner && o.t < 0.5) continue;
      if (near(o, k, 1.6)) { hitKart(race, o, k, 3.5); return; }
    }
    return;
  }
  if (o.type === 'bombArc') {
    o.vy -= 22 * dt; o.x += o.vx * dt; o.z += o.vz * dt; o.y += o.vy * dt;
    const sf = track.surface(o.x, o.z, o.s); o.s = sf.s;
    if (o.y <= sf.h) { o.type = 'slick'; o.y = sf.h; o.ttl = 22; o.arm = 0; }
    return;
  }
  if (o.type === 'slick') {
    o.arm = Math.max(0, (o.arm || 0) - dt);
    if (o.arm > 0) return;
    for (const k of karts) {
      if (near(o, k, 2.0)) { hitKart(race, o, k, 3.5); k.yawRate += 4; return; }
    }
  }
}

// AI item decisions: simple, situational, a little random (difficulty sets aggression)
function aiItem(race, track, k, drv, dt) {
  drv.itemDelay -= dt;
  if (drv.itemDelay > 0) return { use: false, back: false };
  const aggro = drv.cls.aggro, item = k.held, karts = race.karts;
  const fx = Math.sin(k.yaw), fz = Math.cos(k.yaw);
  const rel = (o) => { const dx = o.x - k.x, dz = o.z - k.z; return { along: dx * fx + dz * fz, side: dx * -fz + dz * fx }; };
  const ahead = karts.filter((o) => o !== k && o.state !== 'rescue').map((o) => ({ o, ...rel(o) })).filter((r) => r.along > 0);
  const behind = karts.filter((o) => o !== k && o.state !== 'rescue').map((o) => ({ o, ...rel(o) })).filter((r) => r.along < 0);
  const go = (back = false) => { drv.itemDelay = 0.8 + race.rng.ai.next() * 2; return { use: true, back }; };
  switch (item) {
    case 'duck': if (k.place > 1) return go(); break;
    case 'soap':
      if (ahead.some((r) => r.along < 35 && Math.abs(r.side) < 2.5) && race.rng.ai.next() < aggro) return go(false);
      if (behind.some((r) => r.along > -18)) return go(true);
      break;
    case 'bomb': if (behind.some((r) => r.along > -22) || drv.t % 9 < dt) return go(true); break;
    case 'loofah': if (k.shield > 0 ? ahead.some((r) => r.along < 25 && Math.abs(r.side) < 2.5) : behind.some((r) => r.along > -30)) return go(); break;
    case 'towel': if (karts.some((o) => o !== k && near(k, o, 3.2))) return go(); break;
    case 'jet': case 'jet3': { const vm = track.a.vmax; if (!vm || vm[track.at(k.s + 30).i] > 18) return go(); break; }
    case 'blaster': if (ahead.some((r) => r.along < 11 && Math.abs(r.side) < 4)) return go(); break;
    case 'bubble': if (k.water.gal < k.water.cap * 0.35 || race.rng.ai.next() < 0.004) return go(); break;
    case 'hose': return go();
    default: break;
  }
  return { use: false, back: false };
}
