// Tub dynamics: a 2D rigid body (x, z, yaw; forward/lateral speed) plus a separate vertical channel, queried
// against the baked track surface. Deterministic: fixed dt, no wall-clock, no Math.random.
// Pushing follows the real rules' spirit: four attendants push, the captain steers (rules 4–5).
import { GAL_KG, kartStats } from '../data/teams.js';
import { makeWater, stepWater, jolt, addWater } from './water.js';
import { LIMIT } from './track.js';

export const G = 22; // arcade gravity for airtime (m/s²)
const A0 = 8.6; // push acceleration at rest for the reference mass (m/s²)
const M0 = 85 + 80 + 38 * GAL_KG; // a full Stock tub with captain
const HOP_V = 3.4;
const WARM_T = 0.85, HOT_T = 1.9; // power-slide charge thresholds (s)

export const SURF_CAP = { road: 1, curb: 0.93, gravel: 0.66, grass: 0.58, water: 0.7 };

export function makeKart(id, teamId, classId, pose, opts = {}) {
  const stats = kartStats(teamId, classId, opts.mods);
  return {
    id, team: teamId, human: !!opts.human, stats,
    x: pose.x, z: pose.z, y: pose.y, vy: 0, vyG: 0, yaw: pose.yaw, vf: 0, vl: 0, yawRate: 0,
    air: false, airT: 0, steer: 0, drift: 0, driftT: 0, charge: 0, stage: 0, boostT: 0, boostKind: '',
    state: 'run', stateT: 0, water: makeWater(stats.capGal),
    items: { towel: true, mat: true, soap: true, loofah: true }, dropped: null, held: null, heldN: 0, tickets: 0,
    s: pose.s ?? 0, d: 0, lap: 0, cpNext: 0, progress: 0, place: 0, finished: false, finishT: 0, lapTimes: [],
    lapStart: 0, safeS: pose.s ?? 0, offT: 0, wallT: 0, surfType: 'road', shield: 0, bubbleT: 0, hoseT: 0, sprayT: 0, bribes: 0,
    runPhase: 0, lastHop: false, events: [], stats_: { hits: 0, fumbles: 0, walls: 0, offroad: 0, drifts: 0, boosts: 0 },
  };
}

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// One fixed step. `inp` = {steer -1..1 (right +), push 0..1, brake bool, hop bool}. Returns nothing; mutates k.
export function stepKart(k, inp, track, dt, env = {}) {
  const st = k.stats, w = k.water;
  k.events.length = 0;
  const surf = track.surface(k.x, k.z, k.s);
  k.s = surf.s; k.d = surf.d; k.surfType = surf.type;
  const mass = st.tubKg + w.gal * GAL_KG;
  const massF = Math.pow(M0 / mass, 0.55);
  const fx = Math.sin(k.yaw), fz = Math.cos(k.yaw), rx = -fz, rz = fx;
  const v0x = fx * k.vf + rx * k.vl, v0z = fz * k.vf + rz * k.vl;

  // --- state timers (fumble circle, grip swap, rescue)
  if (k.state !== 'run' && k.state !== 'finished') {
    k.stateT -= dt;
    if (k.stateT <= 0) {
      if (k.state === 'rescue') respawn(k, track);
      k.state = 'run';
      if (k.dropped) { k.items[k.dropped] = true; k.dropped = null; }
    }
  }
  if (k.state === 'rescue') { k.vf = 0; k.vl = 0; return; }

  // --- caps and forces
  let cap = st.vTop * (SURF_CAP[surf.type] ?? 1) * (env.capMul ?? 1);
  if (surf.type === 'curb' || surf.type === 'grass' || surf.type === 'gravel' || surf.type === 'water') k.offT += dt; else k.offT = 0;
  if (k.bubbleT > 0) { cap = st.vTop * 1.05; k.bubbleT -= dt; }
  if (w.gal <= 0.01) cap *= 0.94; // bone dry: attendants slip on a dry tub
  let push = k.state === 'run' && !k.finished ? clamp(inp.push, 0, 1) : 0;
  if (k.state === 'swap') push *= 0.35;
  if (k.boostT > 0) { cap *= 1.32; k.boostT -= dt; push = Math.max(push, 1); }
  if (k.hoseT > 0) { cap *= 1.42; k.hoseT -= dt; push = 1; }
  const grounded = !k.air;

  if (grounded) {
    const vRel = k.vf / cap;
    if (push > 0 && k.vf < cap) k.vf += A0 * st.push * massF * push * Math.max(0, 1 - Math.pow(Math.max(0, vRel), 1.6)) * dt * (k.boostT > 0 || k.hoseT > 0 ? 1.8 : 1);
    if (k.vf > cap) k.vf = Math.max(cap, k.vf - (surf.type === 'road' ? 5 : 11) * dt);
    if (inp.brake) {
      if (k.vf > 0.5) k.vf -= 15 * dt;
      else if (k.state === 'run') k.vf = Math.max(-5.5, k.vf - 6 * dt);
    }
    // rolling resistance and drag
    const drag = (0.45 + 0.0065 * k.vf * k.vf) * (push > 0 ? 0.4 : 1);
    if (k.vf > 0) k.vf = Math.max(0, k.vf - drag * dt); else if (k.vf < 0) k.vf = Math.min(0, k.vf + drag * dt);
    if (k.state === 'circle') k.vf *= Math.max(0, 1 - 4.5 * dt);
    // gravity along the slope: grade along the heading
    const c = surf.c, along = fx * c.tx + fz * c.tz;
    const grade = track.grade[c.i] * along;
    k.vf -= 9.81 * grade * 0.75 * dt;
  }

  // --- steering and power slide
  const want = clamp(inp.steer, -1, 1);
  k.steer += (want - k.steer) * Math.min(1, dt * 11);
  const spd = Math.abs(k.vf);
  const vFac = clamp(spd / 5, 0, 1) * (1 - 0.32 * clamp((spd - 12) / 12, 0, 1));
  let yawTarget = -k.steer * 2.25 * st.turn * vFac * Math.pow(M0 / mass, 0.22);
  if (k.vf < 0) yawTarget = -yawTarget;

  const hopPress = inp.hop && !k.lastHop;
  k.lastHop = !!inp.hop;
  if (hopPress && grounded && k.state === 'run') {
    k.vy = HOP_V; k.air = true; k.airT = 0;
    if (Math.abs(k.steer) > 0.25 && k.vf > 8) { k.drift = Math.sign(k.steer); k.driftT = 0; k.charge = 0; k.stage = 0; k.stats_.drifts++; }
  }
  if (k.drift) {
    const dir = k.drift;
    const s = clamp(k.steer * dir, -1, 1); // -1 = widen, +1 = tighten
    yawTarget = -dir * (1.25 + 0.95 * s) * st.turn * vFac;
    if (grounded) {
      k.driftT += dt;
      k.charge += dt * (0.7 + 0.5 * Math.max(0, s));
      const ns = k.charge >= HOT_T ? 2 : k.charge >= WARM_T ? 1 : 0;
      if (ns > k.stage) { k.stage = ns; k.events.push({ type: 'charge', stage: ns }); }
    }
    const release = !inp.hop || k.vf < 6 || k.state !== 'run' || (grounded && k.steer * dir < -0.85 && k.driftT > 0.3);
    if (release) {
      if (k.stage > 0 && k.state === 'run') {
        k.boostT = Math.max(k.boostT, k.stage === 2 ? 1.25 : 0.65);
        k.boostKind = k.stage === 2 ? 'hot' : 'warm';
        k.stats_.boosts++;
        k.events.push({ type: 'boost', kind: k.boostKind });
      }
      k.drift = 0; k.charge = 0; k.stage = 0;
    }
  }
  k.yawRate += (yawTarget - k.yawRate) * Math.min(1, dt * (grounded ? 9 : 2.5));
  if (k.state === 'circle') k.yawRate *= 0.5;
  k.yaw += k.yawRate * dt;

  // lateral slip: grips back to zero; in a slide it is pushed outward
  if (k.drift) {
    const target = -k.drift * 0.24 * k.vf;
    k.vl += (target - k.vl) * Math.min(1, dt * 4);
  } else {
    const grip = (grounded ? 9 : 1.2) * st.grip * (surf.type === 'road' ? 1 : 0.75);
    k.vl *= Math.max(0, 1 - grip * dt);
  }

  // --- integrate position
  const nfx = Math.sin(k.yaw), nfz = Math.cos(k.yaw), nrx = -nfz, nrz = nfx;
  let vx = nfx * k.vf + nrx * k.vl, vz = nfz * k.vf + nrz * k.vl;
  k.x += vx * dt; k.z += vz * dt;

  // --- limits: walls, rails, soft boundaries, drops
  const s2 = track.surface(k.x, k.z, k.s);
  const lim = s2.lim;
  if (s2.ad > lim) {
    const side = Math.sign(s2.d) || 1;
    if (s2.limType === LIMIT.DROP && k.bubbleT <= 0) {
      if (s2.ad > lim + 1.5) { fall(k, track); return; }
    } else {
      const p = track.point(s2.s, side * lim);
      k.x = p.x; k.z = p.z;
      const c = s2.c, tnx = -c.tz * side, tnz = c.tx * side; // outward normal
      let vn = vx * tnx + vz * tnz;
      let vt = vx * c.tx + vz * c.tz;
      if (vn > 0) {
        const soft = s2.limType === LIMIT.SOFT;
        if (!soft && vn > 5.5) {
          k.stats_.walls++; k.wallT = 0.4;
          k.events.push({ type: 'wall', v: vn });
          jolt(w, 0, side * vn, 0.08 * vn);
          if (vn > 9 && k.state === 'run') { k.state = 'swap'; k.stateT = 0.55; k.events.push({ type: 'swap' }); }
        }
        vn = soft ? 0 : -vn * 0.3;
        vt *= soft ? 0.985 : 0.93;
        vx = c.tx * vt + tnx * vn; vz = c.tz * vt + tnz * vn;
        k.vf = vx * nfx + vz * nfz;
        k.vl = vx * nrx + vz * nrz;
        // nose turns along the wall a little
        const tyaw = Math.atan2(c.tx * Math.sign(vt || 1), c.tz * Math.sign(vt || 1));
        let dy = tyaw - k.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
        k.yaw += dy * Math.min(1, dt * 3);
      }
    }
  }
  k.wallT = Math.max(0, k.wallT - dt);

  // --- vertical channel
  const s3 = track.surface(k.x, k.z, s2.s);
  k.s = s3.s; k.d = s3.d;
  const h = s3.h;
  if (k.air) {
    k.vy -= G * dt; k.y += k.vy * dt; k.airT += dt;
    if (k.y <= h) {
      const impact = -k.vy;
      k.y = h; k.air = false; k.vyG = 0; k.vy = 0;
      if (impact > 5.5) {
        k.events.push({ type: 'land', v: impact });
        jolt(w, 0, 0, 0.05 * (impact - 5.5) * (impact - 5.5) * st.slosh);
      }
    }
  } else {
    const vyg = (h - k.y) / dt;
    if (vyg - k.vyG < -G * dt * 1.15 && k.vf > 10) {
      k.air = true; k.airT = 0; k.vy = k.vyG; k.y += k.vy * dt;
    } else { k.y = h; k.vyG = vyg; }
  }

  // --- water: acceleration in the tub's frame (the velocity change already includes the turn's centripetal part)
  const ax = (vx - v0x) / dt, az = (vz - v0z) / dt;
  let aF = ax * nfx + az * nfz, aR = ax * nrx + az * nrz;
  if (!grounded) { aF *= 0.2; aR *= 0.2; }
  aF = clamp(aF, -40, 40); aR = clamp(aR, -40, 40);
  stepWater(w, aF, aR, st, dt);

  // refill zones and crowds
  if (!k.out) for (const zn of track.zonesAt(k.s, k.d)) {
    if (zn.type === 'refill') addWater(w, (zn.rate || 6) * dt);
    else if (zn.type === 'crowd') addWater(w, (zn.rate || 0.6) * dt);
    else if (zn.type === 'ford') { addWater(w, (zn.rate || 9) * dt); }
  }
  if (k.state === 'run' && !k.finished) k.runPhase += dt * (2.2 + Math.abs(k.vf) * 0.45);
  if (k.state === 'circle') k.runPhase += dt * 9;
  if (k.state === 'run' && s3.ad < s3.lim - 1.5 && s3.type !== 'water') k.safeS = k.s;
}

// Hit by an item or a hard shove: an attendant drops their item → stop and circle the tub (real rule 7).
export function fumble(k, rng, gal = 3) {
  if (k.state === 'rescue' || k.finished) return false;
  if (k.bubbleT > 0) return false;
  if (k.shield > 0) { k.shield--; if (k.shield === 0 && k.held === 'loofah') { k.held = null; k.heldN = 0; } k.events.push({ type: 'blocked' }); return false; }
  const held = Object.keys(k.items).filter((id) => k.items[id]);
  const pick = held.length ? held[rng ? rng.int(held.length) : 0] : null;
  if (pick) { k.items[pick] = false; k.dropped = pick; }
  k.state = 'circle'; k.stateT = 1.4; k.drift = 0; k.charge = 0; k.boostT = 0;
  k.stats_.hits++; k.stats_.fumbles++;
  jolt(k.water, 0, 0, gal);
  k.events.push({ type: 'fumble', item: pick });
  return true;
}

function fall(k, track) {
  k.stats_.falls = (k.stats_.falls || 0) + 1;
  k.state = 'rescue'; k.stateT = 2.2; k.drift = 0; k.boostT = 0; k.air = false;
  jolt(k.water, 0, 0, k.water.gal * 0.18);
  k.events.push({ type: 'fall' });
}

function respawn(k, track) {
  const s = track.wrapS(k.safeS - 6);
  const c = track.at(s);
  const line = track.a.line ? track.a.line[c.i] : 0;
  const p = track.point(s, line);
  k.x = p.x; k.z = p.z; k.y = p.y; k.vy = 0; k.vyG = 0; k.air = false;
  k.yaw = Math.atan2(c.tx, c.tz); k.vf = 4; k.vl = 0; k.yawRate = 0; k.s = s;
}

// Kart-to-kart contact: each tub is a pair of circles along its axis. Mass-weighted impulses.
export function collideKarts(karts, dt) {
  const R = 0.95, OFF = 0.7, n = karts.length;
  const circ = (k, sgn) => ({ x: k.x + Math.sin(k.yaw) * OFF * sgn, z: k.z + Math.cos(k.yaw) * OFF * sgn });
  for (let i = 0; i < n; i++) {
    const a = karts[i];
    if (a.state === 'rescue') continue;
    for (let j = i + 1; j < n; j++) {
      const b = karts[j];
      if (b.state === 'rescue' || Math.abs(a.y - b.y) > 1.6) continue;
      if ((a.x - b.x) ** 2 + (a.z - b.z) ** 2 > 16) continue;
      for (const sa of [-1, 1]) for (const sb of [-1, 1]) {
        const p = circ(a, sa), q = circ(b, sb);
        let dx = q.x - p.x, dz = q.z - p.z;
        const dist = Math.hypot(dx, dz);
        if (dist >= 2 * R || dist < 1e-6) continue;
        dx /= dist; dz /= dist;
        const ma = a.stats.tubKg + a.water.gal * GAL_KG, mb = b.stats.tubKg + b.water.gal * GAL_KG;
        const pen = 2 * R - dist, wa = mb / (ma + mb), wb = ma / (ma + mb);
        a.x -= dx * pen * wa; a.z -= dz * pen * wa; b.x += dx * pen * wb; b.z += dz * pen * wb;
        const va = worldVel(a), vb = worldVel(b);
        const rel = (vb.x - va.x) * dx + (vb.z - va.z) * dz;
        if (rel < 0) {
          const jimp = -(1 + 0.45) * rel / (1 / ma + 1 / mb);
          setWorldVel(a, va.x - (jimp / ma) * dx, va.z - (jimp / ma) * dz);
          setWorldVel(b, vb.x + (jimp / mb) * dx, vb.z + (jimp / mb) * dz);
          if (-rel > 4) {
            jolt(a.water, 0, 0, 0.04 * -rel * (mb / ma)); jolt(b.water, 0, 0, 0.04 * -rel * (ma / mb));
            a.events.push({ type: 'bump', v: -rel }); b.events.push({ type: 'bump', v: -rel });
          }
        }
      }
    }
  }
}
function worldVel(k) {
  const fx = Math.sin(k.yaw), fz = Math.cos(k.yaw);
  return { x: fx * k.vf - fz * k.vl, z: fz * k.vf + fx * k.vl };
}
function setWorldVel(k, x, z) {
  const fx = Math.sin(k.yaw), fz = Math.cos(k.yaw);
  k.vf = x * fx + z * fz;
  k.vl = -x * fz + z * fx;
}
