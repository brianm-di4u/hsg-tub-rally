// Shared geometry helpers for the track compiler (tools/track/bake.mjs) and checker. Zero dependencies.
// Conventions match src/js/sim/track.js: metres, x east, z south, y up; d > 0 is right of travel.

export const TAU = Math.PI * 2;

// centripetal Catmull-Rom through closed control points [[x,z,y?],…] → dense polyline
export function catmullClosed(pts, perSeg = 24, alpha = 0.5) {
  const n = pts.length, out = [];
  const P = (i) => pts[((i % n) + n) % n];
  const tj = (ti, a, b) => ti + Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-6, alpha);
  for (let i = 0; i < n; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const t0 = 0, t1 = tj(t0, p0, p1), t2 = tj(t1, p1, p2), t3 = tj(t2, p2, p3);
    for (let k = 0; k < perSeg; k++) {
      const t = t1 + ((t2 - t1) * k) / perSeg;
      const dim = Math.max(p1.length, 2);
      const q = [];
      for (let c = 0; c < dim; c++) {
        const v0 = p0[c] ?? 0, v1 = p1[c] ?? 0, v2 = p2[c] ?? 0, v3 = p3[c] ?? 0;
        const A1 = ((t1 - t) / (t1 - t0)) * v0 + ((t - t0) / (t1 - t0)) * v1;
        const A2 = ((t2 - t) / (t2 - t1)) * v1 + ((t - t1) / (t2 - t1)) * v2;
        const A3 = ((t3 - t) / (t3 - t2)) * v2 + ((t - t2) / (t3 - t2)) * v3;
        const B1 = ((t2 - t) / (t2 - t0)) * A1 + ((t - t0) / (t2 - t0)) * A2;
        const B2 = ((t3 - t) / (t3 - t1)) * A2 + ((t - t1) / (t3 - t1)) * A3;
        q.push(((t2 - t) / (t2 - t1)) * B1 + ((t - t1) / (t2 - t1)) * B2);
      }
      out.push(q);
    }
  }
  return out;
}

// resample a closed polyline to uniform spacing `step`; returns {x,z,y,n,length}
export function resampleClosed(poly, step) {
  const n = poly.length, cum = [0];
  for (let i = 1; i <= n; i++) {
    const a = poly[i - 1], b = poly[i % n];
    cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const total = cum[n];
  const m = Math.max(8, Math.round(total / step));
  const st = total / m;
  const x = new Float64Array(m), z = new Float64Array(m), y = new Float64Array(m);
  let j = 0;
  for (let i = 0; i < m; i++) {
    const s = i * st;
    while (j < n - 1 && cum[j + 1] < s) j++;
    const a = poly[j], b = poly[(j + 1) % n];
    const f = (s - cum[j]) / Math.max(1e-9, cum[j + 1] - cum[j]);
    x[i] = a[0] + (b[0] - a[0]) * f;
    z[i] = a[1] + (b[1] - a[1]) * f;
    y[i] = (a[2] ?? 0) + ((b[2] ?? 0) - (a[2] ?? 0)) * f;
  }
  return { x, z, y, n: m, step: st, length: total };
}

export function gaussSmooth(arr, sigma, closed = true) {
  if (sigma <= 0) return Float64Array.from(arr);
  const n = arr.length, r = Math.ceil(sigma * 3), w = [];
  let sum = 0;
  for (let k = -r; k <= r; k++) { const v = Math.exp(-(k * k) / (2 * sigma * sigma)); w.push(v); sum += v; }
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let acc = 0;
    for (let k = -r; k <= r; k++) {
      let j = i + k;
      if (closed) j = ((j % n) + n) % n; else j = Math.max(0, Math.min(n - 1, j));
      acc += arr[j] * w[k + r];
    }
    out[i] = acc / sum;
  }
  return out;
}

// unit tangents and signed curvature (1/m, + = left turn) for a closed sampled line
export function frames(x, z, step) {
  const n = x.length, tx = new Float64Array(n), tz = new Float64Array(n), k = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const p = (i - 1 + n) % n, q = (i + 1) % n;
    const dx = x[q] - x[p], dz = z[q] - z[p], l = Math.hypot(dx, dz) || 1;
    tx[i] = dx / l; tz[i] = dz / l;
  }
  for (let i = 0; i < n; i++) {
    const p = (i - 1 + n) % n, q = (i + 1) % n;
    const ya = Math.atan2(tx[p], tz[p]), yb = Math.atan2(tx[q], tz[q]);
    k[i] = Math.atan2(Math.sin(yb - ya), Math.cos(yb - ya)) / (2 * step);
  }
  return { tx, tz, k };
}

// minimum-curvature racing line as lateral offsets d within [-wl+m, wr-m] (elastic band, multi-scale)
export function racingLine(x, z, wl, wr, margin = 1.8, iters = 400) {
  const n = x.length;
  const { tx, tz } = frames(x, z, 1);
  const d = new Float64Array(n);
  for (const span of [12, 6, 3, 1]) {
    for (let it = 0; it < iters / 4; it++) {
      for (let i = 0; i < n; i++) {
        const a = (i - span + n) % n, b = (i + span) % n;
        const px = (x[a] + -tz[a] * d[a] + x[b] + -tz[b] * d[b]) / 2;
        const pz = (z[a] + tx[a] * d[a] + z[b] + tx[b] * d[b]) / 2;
        const rx = -tz[i], rz = tx[i];
        const target = (px - x[i]) * rx + (pz - z[i]) * rz;
        let v = d[i] + (target - d[i]) * 0.6;
        const lo = -wl[i] + margin, hi = wr[i] - margin;
        d[i] = lo > hi ? (lo + hi) / 2 : Math.max(lo, Math.min(hi, v));
      }
    }
  }
  return gaussSmooth(d, 2);
}

// speed profile along the racing line: lateral-accel limit, then forward (accel) and backward (brake) passes
export function speedProfile(x, z, d, step, { aLat = 22, aAcc = 7, aBrake = 14, vTop = 26 } = {}) {
  const n = x.length;
  const { tx, tz } = frames(x, z, step);
  const lx = new Float64Array(n), lz = new Float64Array(n);
  for (let i = 0; i < n; i++) { lx[i] = x[i] - tz[i] * d[i]; lz[i] = z[i] + tx[i] * d[i]; }
  const { k } = frames(lx, lz, step);
  const ks = gaussSmooth(k.map(Math.abs), 2);
  const v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.min(vTop, Math.sqrt(aLat / Math.max(1e-5, ks[i])));
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < n; i++) { const p = (i - 1 + n) % n; v[i] = Math.min(v[i], Math.sqrt(v[p] * v[p] + 2 * aAcc * step)); }
    for (let i = n - 1; i >= 0; i--) { const q = (i + 1) % n; v[i] = Math.min(v[i], Math.sqrt(v[q] * v[q] + 2 * aBrake * step)); }
  }
  return { v, k: ks };
}

// base64 typed-array encoding for the baked JSON
export function enc(arr, t = 'f32') {
  const T = { f32: Float32Array, i16: Int16Array, u8: Uint8Array, i8: Int8Array, u16: Uint16Array }[t];
  const typed = arr instanceof T ? arr : T.from(arr);
  return { t, b64: Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength).toString('base64') };
}

// keyframes [{at: fraction 0..1, v}] → per-sample value (linear, wraps)
export function keyed(n, keys, def) {
  const out = new Float64Array(n);
  if (!keys || !keys.length) { out.fill(def); return out; }
  const ks = keys.slice().sort((a, b) => a.at - b.at);
  for (let i = 0; i < n; i++) {
    const f = i / n;
    let a = ks[ks.length - 1], b = ks[0], fa = a.at - 1, fb = b.at;
    for (let j = 0; j < ks.length; j++) {
      if (ks[j].at <= f) { a = ks[j]; fa = a.at; b = ks[(j + 1) % ks.length]; fb = j + 1 < ks.length ? b.at : b.at + 1; }
    }
    if (f < ks[0].at) { a = ks[ks.length - 1]; fa = a.at - 1; b = ks[0]; fb = b.at; }
    const t = fb > fa ? (f - fa) / (fb - fa) : 0;
    out[i] = a.step ? a.v : a.v + (b.v - a.v) * t;
  }
  return out;
}

// do two segments (a,b) and (c,d) properly intersect?
export function segX(ax, az, bx, bz, cx, cz, dx, dz) {
  const o = (px, pz, qx, qz, rx, rz) => Math.sign((qx - px) * (rz - pz) - (qz - pz) * (rx - px));
  return o(ax, az, bx, bz, cx, cz) !== o(ax, az, bx, bz, dx, dz) && o(cx, cz, dx, dz, ax, az) !== o(cx, cz, dx, dz, bx, bz);
}
