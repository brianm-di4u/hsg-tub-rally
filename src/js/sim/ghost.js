// Pose ghosts for Time Trial: the player's tub pose every 3 ticks (20 Hz), quantized (5 cm, 1/1000 rad) and
// stored as base64 Int32 arrays. Poses (not inputs) so a ghost still plays after a physics tweak.
export const GHOST_EVERY = 3;

export function makeRecorder() { return { t: [], x: [], z: [], y: [], yaw: [], tick: 0 }; }

export function record(rec, k, raceTime) {
  if (rec.tick++ % GHOST_EVERY) return;
  rec.t.push(Math.round(raceTime * 1000)); rec.x.push(Math.round(k.x * 20)); rec.z.push(Math.round(k.z * 20));
  rec.y.push(Math.round(k.y * 20)); rec.yaw.push(Math.round(k.yaw * 1000));
}

const toB64 = (arr) => {
  const a = Int32Array.from(arr), u = new Uint8Array(a.buffer);
  let s = ''; for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]);
  return typeof btoa === 'function' ? btoa(s) : Buffer.from(u).toString('base64');
};
const fromB64 = (b) => {
  const s = typeof atob === 'function' ? atob(b) : Buffer.from(b, 'base64').toString('binary');
  const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
  return new Int32Array(u.buffer);
};

export function packGhost(rec, meta) {
  return { v: 1, ...meta, n: rec.t.length, t: toB64(rec.t), x: toB64(rec.x), z: toB64(rec.z), y: toB64(rec.y), yaw: toB64(rec.yaw) };
}

export function unpackGhost(g) {
  return { ...g, T: fromB64(g.t), X: fromB64(g.x), Z: fromB64(g.z), Y: fromB64(g.y), YAW: fromB64(g.yaw) };
}

// pose at race time t (seconds), interpolated; null before the start or after the end
export function ghostPose(G, t) {
  const ms = t * 1000, T = G.T;
  if (!T.length || ms < T[0] || ms > T[T.length - 1]) return null;
  let lo = 0, hi = T.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (T[m] <= ms) lo = m; else hi = m; }
  const f = (ms - T[lo]) / Math.max(1, T[hi] - T[lo]);
  let dy = G.YAW[hi] - G.YAW[lo]; const y0 = G.YAW[lo] / 1000;
  let dyaw = dy / 1000; dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw));
  return { x: (G.X[lo] + (G.X[hi] - G.X[lo]) * f) / 20, z: (G.Z[lo] + (G.Z[hi] - G.Z[lo]) * f) / 20, y: (G.Y[lo] + (G.Y[hi] - G.Y[lo]) * f) / 20, yaw: y0 + dyaw * f };
}
