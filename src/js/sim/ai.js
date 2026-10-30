// AI drivers: pure pursuit to a look-ahead point on the baked racing line plus a personal lane offset,
// speed from the baked speed profile, power slides into long tight turns, refill-seeking when low on water.
// Difficulty (class) sets top-speed fraction, line noise and aggression; rubber-banding is small and visible
// in the data (CLASSES.rubber) and fades out over the last 30% of the race.
import { CLASSES } from '../data/teams.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function makeDriver(k, classId, rng, skill = 1) {
  const c = CLASSES[classId] || CLASSES.soak;
  return {
    cls: c, skill: clamp(skill, 0.85, 1.05), lane: rng.range(-1.6, 1.6), lanePhase: rng.range(0, 6.28),
    noise: c.noise * rng.range(0.7, 1.3), hold: 0, drifting: false, t: 0, seed: rng.int(1e9),
    itemDelay: rng.range(0.6, 2.4),
  };
}

// heading change of the racing line over [s, s+len] (radians, signed: + = left)
function turnAhead(track, s, len) {
  const a = track.at(s), b = track.at(s + len);
  const ya = Math.atan2(a.tx, a.tz), yb = Math.atan2(b.tx, b.tz);
  return Math.atan2(Math.sin(yb - ya), Math.cos(yb - ya));
}

export function driveAI(k, drv, track, ctx, dt) {
  drv.t += dt;
  const inp = { steer: 0, push: 1, brake: false, hop: false, item: false, back: false };
  if (k.finished) { inp.push = 0.35; }
  const v = Math.max(0, k.vf);
  const look = 5 + 0.42 * v;
  const sT = k.s + look;
  const cT = track.at(sT);
  const line = track.a.line ? track.a.line[cT.i] : 0;
  const tight = Math.abs(turnAhead(track, k.s + 4, 30));
  let lane = drv.lane * (1 - clamp(tight / 0.9, 0, 0.8)) + Math.sin(drv.t * 0.7 + drv.lanePhase) * 0.6 * drv.noise;
  // seek refill water when low and a refill lies ahead
  if (k.water.gal < k.water.cap * (0.6 - 0.2 * drv.cls.aggro)) {
    for (const zn of track.zones) {
      if (zn.type !== 'refill' && zn.type !== 'ford') continue;
      const ahead = track.ds(k.s, zn.s0);
      if (ahead > 0 && ahead < 90 && zn.d0 != null) { lane = (zn.d0 + zn.d1) / 2 - line; break; }
    }
  }
  const half = Math.min(cT.wl, cT.wr) - 1.4;
  const dT = clamp(line + lane, -cT.wl + 1.4, cT.wr - 1.4) + (half < 0 ? 0 : 0);
  const p = track.point(sT, dT);
  const fx = Math.sin(k.yaw), fz = Math.cos(k.yaw), rx = -fz, rz = fx;
  const ex = p.x - k.x, ez = p.z - k.z;
  const lf = ex * fx + ez * fz, lr = ex * rx + ez * rz;
  const err = Math.atan2(lr, Math.max(0.5, lf));
  inp.steer = clamp(err * 2.7, -1, 1);

  // speed target: the baked profile, the minimum over the next stretch
  let vt = Infinity;
  if (track.a.vmax) {
    for (let ds = 0; ds <= look * 1.6; ds += 4) vt = Math.min(vt, track.a.vmax[track.at(k.s + ds).i]);
  }
  const capMul = ctx.capMul ?? 1;
  vt = vt * drv.cls.ai * drv.skill * capMul;
  if (v > vt + 2.5) { inp.push = 0; inp.brake = v > vt + 4.5; } else if (v > vt) inp.push = 0.3;

  // power slide through long tight turns
  const turn = turnAhead(track, k.s + 2, 26);
  if (!drv.drifting && Math.abs(turn) > 0.55 && v > 12.5 && !k.air && k.state === 'run' && drv.cls.aggro > 0.3 && k.water.gal > k.water.cap * 0.3) {
    drv.drifting = true; drv.hold = 0;
  }
  if (drv.drifting) {
    drv.hold += dt;
    inp.hop = true;
    if (k.drift) inp.steer = clamp(inp.steer * 1.2, -1, 1);
    if ((drv.hold > 0.4 && Math.abs(turnAhead(track, k.s + 2, 16)) < 0.2) || drv.hold > 3 || k.state !== 'run') { drv.drifting = false; inp.hop = false; }
  }
  return inp;
}
