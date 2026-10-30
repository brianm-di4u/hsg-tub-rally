// Baked track runtime: decodes data/tracks/<id>.json and answers "where am I on the course?" for the sim.
// No DOM, no three.js: the Node tools (check, balance) import this file directly.
//
// World frame: metres, x east, z south (-z is north), y up. The centreline is sampled every `step` metres.
// Lateral offset d is positive to the RIGHT of the direction of travel (increasing s).
// Heading convention shared by sim and gfx: forward = (sin yaw, cos yaw) in (x, z); right = (-cos yaw, sin yaw).

export const LIMIT = { WALL: 0, RAIL: 1, DROP: 2, SOFT: 3 };
export const VERGE = { NONE: 0, CURB: 1, GRASS: 2, GRAVEL: 3, WATER: 4 };
export const SURF = { ASPHALT: 0, BRICK: 1, CONCRETE: 2, DIRT: 3, FORD: 4, BRIDGE: 5 };

function b64ToBytes(b64) {
  if (typeof atob === 'function') {
    const s = atob(b64), out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }
  return new Uint8Array(Buffer.from(b64, 'base64'));
}
const KINDS = { f32: Float32Array, i16: Int16Array, u8: Uint8Array, i8: Int8Array, u16: Uint16Array };
export function decodeArr(enc) {
  const bytes = b64ToBytes(enc.b64);
  const T = KINDS[enc.t];
  return new T(bytes.buffer, bytes.byteOffset, bytes.byteLength / T.BYTES_PER_ELEMENT);
}

export class Track {
  constructor(json) {
    this.json = json;
    this.id = json.id;
    this.name = json.name;
    this.step = json.step;
    this.n = json.n;
    this.closed = json.closed !== false;
    this.length = this.closed ? this.n * this.step : (this.n - 1) * this.step;
    const a = {};
    for (const k of Object.keys(json.arr)) a[k] = decodeArr(json.arr[k]);
    this.a = a;
    this.xsOff = json.xsOff || [];
    this.nx = this.xsOff.length;
    // tangent (unit) and right vectors per sample
    const n = this.n, tx = new Float32Array(n), tz = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const p = this.wrap(i - 1), q = this.wrap(i + 1);
      let dx = a.x[q] - a.x[p], dz = a.z[q] - a.z[p];
      const l = Math.hypot(dx, dz) || 1;
      tx[i] = dx / l; tz[i] = dz / l;
    }
    this.tx = tx; this.tz = tz;
    // grade (dy/ds) per sample
    const gr = new Float32Array(n);
    for (let i = 0; i < n; i++) gr[i] = (a.y[this.wrap(i + 1)] - a.y[this.wrap(i - 1)]) / (2 * this.step);
    this.grade = gr;
    this.cps = json.cps || [];
    this.zones = (json.zones || []).map((z) => ({ ...z }));
    this.start = json.start || { i: 0 };
  }
  wrap(i) {
    const n = this.n;
    if (this.closed) return ((i % n) + n) % n;
    return i < 0 ? 0 : i >= n ? n - 1 : i;
  }
  wrapS(s) {
    const L = this.length;
    if (this.closed) return ((s % L) + L) % L;
    return s < 0 ? 0 : s > L ? L : s;
  }
  // signed distance along the loop from s0 to s1 in (-L/2, L/2]
  ds(s0, s1) {
    let d = s1 - s0;
    if (!this.closed) return d;
    const L = this.length;
    if (d > L / 2) d -= L; else if (d <= -L / 2) d += L;
    return d;
  }
  // centreline sample interpolation at arc length s → {x, z, y, tx, tz, bank, wl, wr, i, f}
  at(s) {
    s = this.wrapS(s);
    const u = s / this.step, i = Math.floor(u), f = u - i, j = this.wrap(i + 1), ii = this.wrap(i);
    const a = this.a, L = (k) => a[k][ii] + (a[k][j] - a[k][ii]) * f;
    let tx = this.tx[ii] + (this.tx[j] - this.tx[ii]) * f, tz = this.tz[ii] + (this.tz[j] - this.tz[ii]) * f;
    const tl = Math.hypot(tx, tz) || 1; tx /= tl; tz /= tl;
    return { x: L('x'), z: L('z'), y: L('y'), tx, tz, bank: L('bank'), wl: L('wl'), wr: L('wr'),
      limL: L('limL'), limR: L('limR'), i: ii, f };
  }
  // world point at (s, d) on the road surface
  point(s, d) {
    const c = this.at(s);
    const rx = -c.tz, rz = c.tx; // right = (-tz, tx) for forward (tx, tz)
    return { x: c.x + rx * d, z: c.z + rz * d, y: this.heightAt(c, d) };
  }
  // height at lateral d for a sample frame c (banked road, then cross-section terrain beyond the edge)
  heightAt(c, d) {
    const w = d >= 0 ? c.wr : c.wl, ad = Math.abs(d);
    const roadY = c.y + Math.sin(c.bank) * Math.min(ad, w) * (d >= 0 ? 1 : -1);
    if (ad <= w || !this.nx) return roadY;
    // cross-sections are stored relative to the centreline height, beyond the road edge
    const off = ad - w, xs = this.a.xs, nx = this.nx, side = d >= 0 ? 1 : 0;
    const row = (k) => (k * 2 + side) * nx;
    const sample = (k, idx) => xs[row(k) + idx] / 10;
    const lerpX = (k) => {
      const O = this.xsOff;
      if (off <= O[0]) return roadY + (sample(k, 0) + c.y - roadY) * (off / O[0]);
      for (let m = 1; m < nx; m++) {
        if (off <= O[m]) { const t = (off - O[m - 1]) / (O[m] - O[m - 1]); return c.y + sample(k, m - 1) + (sample(k, m) - sample(k, m - 1)) * t; }
      }
      return c.y + sample(k, nx - 1);
    };
    const j = this.wrap(c.i + 1);
    const h0 = lerpX(c.i), h1 = lerpX(j);
    return h0 + (h1 - h0) * c.f;
  }
  // nearest (s, d) for world (x, z). `hint` is a previous s; searches a window around it (global search if absent).
  locate(x, z, hint) {
    const a = this.a, n = this.n, step = this.step;
    let best = -1, bestD2 = Infinity;
    if (hint == null || !isFinite(hint)) {
      for (let i = 0; i < n; i += 2) {
        const dx = x - a.x[i], dz = z - a.z[i], d2 = dx * dx + dz * dz;
        if (d2 < bestD2) { bestD2 = d2; best = i; }
      }
    } else {
      const c = Math.round(this.wrapS(hint) / step), W = 40;
      for (let k = -W; k <= W; k++) {
        const i = this.wrap(c + k);
        const dx = x - a.x[i], dz = z - a.z[i], d2 = dx * dx + dz * dz;
        if (d2 < bestD2) { bestD2 = d2; best = i; }
      }
    }
    // refine on the two adjacent segments
    let bs = best * step, bd = 0, bdist = Infinity;
    for (const i0 of [this.wrap(best - 1), best]) {
      const i1 = this.wrap(i0 + 1);
      if (!this.closed && i1 === i0) continue;
      const ax = a.x[i0], az = a.z[i0], ex = a.x[i1] - ax, ez = a.z[i1] - az;
      const l2 = ex * ex + ez * ez || 1;
      let t = ((x - ax) * ex + (z - az) * ez) / l2;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const px = ax + ex * t, pz = az + ez * t, dx = x - px, dz = z - pz, dist = dx * dx + dz * dz;
      if (dist < bdist) {
        bdist = dist;
        bs = (i0 + t) * step;
        const l = Math.sqrt(l2), rx = -ez / l, rz = ex / l;
        bd = dx * rx + dz * rz;
      }
    }
    return { s: this.wrapS(bs), d: bd };
  }
  // full surface query for the sim
  surface(x, z, hint) {
    const { s, d } = this.locate(x, z, hint);
    const c = this.at(s);
    const h = this.heightAt(c, d);
    const ad = Math.abs(d), w = d >= 0 ? c.wr : c.wl, lim = d >= 0 ? c.limR : c.limL;
    const a = this.a, ii = c.i;
    const limType = d >= 0 ? a.tr[ii] : a.tl[ii];
    const verge = d >= 0 ? a.vr[ii] : a.vl[ii];
    const surf = a.surf ? a.surf[ii] : 0;
    let type = 'road';
    if (ad > w) type = verge === VERGE.CURB && ad < w + 4.5 ? 'curb' : verge === VERGE.WATER ? 'water' : verge === VERGE.GRAVEL ? 'gravel' : 'grass';
    return { s, d, c, h, ad, w, lim, limType, verge, surf, type };
  }
  // progress fraction of a sample index → checkpoint index
  cpIndex(s) {
    const cps = this.cps;
    if (!cps.length) return 0;
    let k = 0;
    for (let m = 0; m < cps.length; m++) if (cps[m] * this.step <= s) k = m;
    return k;
  }
  zonesAt(s, d) {
    const out = [];
    for (const zn of this.zones) {
      const inS = zn.s0 <= zn.s1 ? s >= zn.s0 && s <= zn.s1 : s >= zn.s0 || s <= zn.s1;
      if (inS && (zn.d0 == null || (d >= zn.d0 && d <= zn.d1))) out.push(zn);
    }
    return out;
  }
}
