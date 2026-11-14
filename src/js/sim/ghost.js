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

// Par ghosts (S3-04): the staff run for a course, stored compactly because there is one per course in the page.
// Uniform samples every PAR_STEP_MS (the last one at the finish time), x and z in decimetres from a whole-metre
// origin, yaw in milliradians, all Int16. unpackPar gives the same shape as unpackGhost, so ghostPose reads either.
export const PAR_STEP_MS = 200;
const toB64s = (arr) => {
  const u = new Uint8Array(Int16Array.from(arr).buffer);
  let s = ''; for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]);
  return typeof btoa === 'function' ? btoa(s) : Buffer.from(u).toString('base64');
};
const fromB64s = (b) => {
  const s = typeof atob === 'function' ? atob(b) : Buffer.from(b, 'base64').toString('binary');
  const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
  return new Int16Array(u.buffer);
};
export function packPar(samples, meta) {
  const ox = Math.round(samples.reduce((a, p) => a + p.x, 0) / samples.length), oz = Math.round(samples.reduce((a, p) => a + p.z, 0) / samples.length);
  const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  return { ...meta, ox, oz, n: samples.length, x: toB64s(samples.map((p) => Math.round((p.x - ox) * 10))), z: toB64s(samples.map((p) => Math.round((p.z - oz) * 10))), yaw: toB64s(samples.map((p) => Math.round(wrap(p.yaw) * 1000))) };
}
// `heightAt(x, z, hint)` gives the road height under a pose (the par ghost carries no height of its own).
export function unpackPar(p, heightAt) {
  const x = fromB64s(p.x), z = fromB64s(p.z), yaw = fromB64s(p.yaw), n = Math.min(p.n, x.length, z.length, yaw.length);
  const T = new Int32Array(n), X = new Int32Array(n), Z = new Int32Array(n), Y = new Int32Array(n), YAW = new Int32Array(n);
  let hint = 0;
  for (let i = 0; i < n; i++) {
    const wx = p.ox + x[i] / 10, wz = p.oz + z[i] / 10;
    T[i] = i === n - 1 ? Math.round(p.total * 1000) : i * PAR_STEP_MS;
    X[i] = Math.round(wx * 20); Z[i] = Math.round(wz * 20); YAW[i] = yaw[i];
    const h = heightAt(wx, wz, hint);
    hint = h.s; Y[i] = Math.round(h.h * 20);
  }
  return { v: 1, team: p.team, total: p.total, n, T, X, Z, Y, YAW };
}
