// A tiny vertex-colour triangle builder for N64-style low-poly meshes (world chunks, props, placeholder tubs).
// Pattern after hsg-theme-park/src/js/gfx/geo.js (Hot Springs Games, MIT): accumulate flat-shaded triangles
// with per-vertex colour, uv and an optional rigid-part index, then upload once. Box faces also record where each
// vertex sits on its face and the face's size (aEdge, metres), which the brick shader turns into moulded edges.

export function hex(h) {
  const n = parseInt(h.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
export const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
export const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

export class Geo {
  constructor() { this.p = []; this.n = []; this.c = []; this.uv = []; this.part = []; this.e = []; this.curPart = 0; this.light = null; this._ev = null; this._box = false; }
  // optional baked light: fn(normal) → multiplier, applied to vertex colours (unlit world materials)
  bake(fn) { this.light = fn; return this; }
  setPart(i) { this.curPart = i; return this; }
  tri(a, b, c, col, uva, uvb, uvc, colB, colC) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    const k = this.light ? this.light([nx, ny, nz]) : 1;
    const cs = [col, colB || col, colC || col];
    [a, b, c].forEach((p, i) => {
      this.p.push(p[0], p[1], p[2]); this.n.push(nx, ny, nz);
      this.c.push(cs[i][0] * k, cs[i][1] * k, cs[i][2] * k);
      const t = [uva, uvb, uvc][i] || [0, 0];
      this.uv.push(t[0], t[1]);
      this.part.push(this.curPart);
      const ev = this._ev;
      if (ev) this.e.push(ev[i][0], ev[i][1], ev[3][0], ev[3][1]); else this.e.push(0, 0, 0, 0);
    });
    return this;
  }
  // quad a b c d counter-clockwise seen from the front
  quad(a, b, c, d, col, uv, cols) {
    const u = uv || [[0, 0], [1, 0], [1, 1], [0, 1]];
    const cc = cols || [col, col, col, col];
    // box faces: position across the face in metres (a at 0, 0; b along u; d along v) plus the face size
    const W = this._box ? Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) : 0, H = this._box ? Math.hypot(d[0] - a[0], d[1] - a[1], d[2] - a[2]) : 0;
    if (this._box) this._ev = [[0, 0], [W, 0], [W, H], [W, H]];
    this.tri(a, b, c, cc[0], u[0], u[1], u[2], cc[1], cc[2]);
    if (this._box) this._ev = [[0, 0], [W, H], [0, H], [W, H]];
    this.tri(a, c, d, cc[0], u[0], u[2], u[3], cc[2], cc[3]);
    this._ev = null;
    return this;
  }
  // a quad that records its face coordinates like a box face (window panes: the shader recesses them)
  edgeQuad(a, b, c, d, col, uv, cols) { this._box = true; this.quad(a, b, c, d, col, uv, cols); this._box = false; return this; }
  // axis-aligned box from min to max (with optional colour per face: [top, side, bottom])
  box(min, max, col, opts = {}) {
    const [x0, y0, z0] = min, [x1, y1, z1] = max;
    const top = opts.top || col, side = opts.side || col, bot = opts.bottom || col;
    const front = opts.front || side;
    this._box = true;
    this.quad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], top);
    if (!opts.noBottom) this.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], bot);
    this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], front); // +z
    this.quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], side); // -z
    this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], side); // +x
    this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], side); // -x
    this._box = false;
    return this;
  }
  // transformed box: centre c, half sizes h, rotation about y (yaw) and x (pitch)
  obox(c, h, col, yaw = 0, opts = {}) {
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const T = (x, y, z) => [c[0] + x * cy + z * sy, c[1] + y, c[2] - x * sy + z * cy];
    const [hx, hy, hz] = h;
    const P = [T(-hx, -hy, -hz), T(hx, -hy, -hz), T(hx, -hy, hz), T(-hx, -hy, hz), T(-hx, hy, -hz), T(hx, hy, -hz), T(hx, hy, hz), T(-hx, hy, hz)];
    const top = opts.top || col, side = opts.side || col;
    this._box = true;
    this.quad(P[7], P[6], P[5], P[4], top);
    if (!opts.noBottom) this.quad(P[0], P[1], P[2], P[3], opts.bottom || col);
    this.quad(P[3], P[2], P[6], P[7], opts.front || side);
    this.quad(P[1], P[0], P[4], P[5], side);
    this.quad(P[2], P[1], P[5], P[6], side);
    this.quad(P[0], P[3], P[7], P[4], side);
    this._box = false;
    return this;
  }
  // cylinder (or cone/frustum) along +y, base centre c, radii r0 (bottom) r1 (top), segments
  cyl(c, r0, r1, h, seg, col, opts = {}) {
    const top = opts.top || col;
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * Math.PI * 2, a1 = ((i + 1) / seg) * Math.PI * 2;
      const p = (a, r, y) => [c[0] + Math.sin(a) * r, c[1] + y, c[2] + Math.cos(a) * r];
      this.quad(p(a0, r0, 0), p(a1, r0, 0), p(a1, r1, h), p(a0, r1, h), col);
      if (!opts.noCap && r1 > 0.001) this.tri(p(a0, r1, h), p(a1, r1, h), [c[0], c[1] + h, c[2]], top);
      if (opts.bottomCap) this.tri(p(a1, r0, 0), p(a0, r0, 0), [c[0], c[1], c[2]], col);
    }
    return this;
  }
  // low-poly ball (octahedron-ish UV sphere) centre c radius r
  ball(c, r, col, seg = 6, rings = 4, sy = 1) {
    for (let j = 0; j < rings; j++) {
      const t0 = (j / rings) * Math.PI, t1 = ((j + 1) / rings) * Math.PI;
      for (let i = 0; i < seg; i++) {
        const a0 = (i / seg) * Math.PI * 2, a1 = ((i + 1) / seg) * Math.PI * 2;
        const p = (t, a) => [c[0] + Math.sin(t) * Math.sin(a) * r, c[1] + Math.cos(t) * r * sy, c[2] + Math.sin(t) * Math.cos(a) * r];
        if (j === 0) this.tri(p(t0, a0), p(t1, a0), p(t1, a1), col);
        else if (j === rings - 1) this.tri(p(t0, a0), p(t1, a0), p(t0, a1), col);
        else this.quad(p(t0, a0), p(t1, a0), p(t1, a1), p(t0, a1), col);
      }
    }
    return this;
  }
  // triangle with given vertex normals (smooth shading: bevels and studs)
  triN(a, b, c, na, nb, nc, col, ua, ub, uc) {
    const k = this.light ? this.light(na) : 1;
    [[a, na, ua], [b, nb, ub], [c, nc, uc]].forEach(([p, n, t]) => {
      this.p.push(p[0], p[1], p[2]); this.n.push(n[0], n[1], n[2]);
      this.c.push(col[0] * k, col[1] * k, col[2] * k); this.uv.push(t ? t[0] : 0, t ? t[1] : 0); this.part.push(this.curPart); this.e.push(0, 0, 0, 0);
    });
    return this;
  }
  // rounded box (moulded plastic part): edges rounded with radius r in `seg` steps, smooth normals; seg 0 is a
  // plain box. Triangles: 12 × (2·seg + 1)². opts.print = [u0, v0, u1, v1] maps the +z face onto an atlas cell
  // (a printed face or uniform); every other vertex gets uv (0, 0), which the atlas keeps transparent.
  rbox(min, max, col, r = 0.02, seg = 2, opts = {}) {
    const c = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
    const h = [(max[0] - min[0]) / 2, (max[1] - min[1]) / 2, (max[2] - min[2]) / 2];
    if (!seg) r = 0;
    r = Math.min(r, h[0] * 0.95, h[1] * 0.95, h[2] * 0.95);
    // grid coordinates along one axis: the bevel swept in seg angle steps at each end, the flat middle between
    const axis = (hh) => {
      if (!seg) return [-hh, hh];
      const out = [];
      for (let i = 0; i <= seg; i++) out.push(-(hh - r) - r * Math.cos((i / seg) * Math.PI / 2));
      for (let i = seg; i >= 0; i--) out.push(hh - r + r * Math.cos((i / seg) * Math.PI / 2));
      return out;
    };
    const A = [axis(h[0]), axis(h[1]), axis(h[2])];
    const vert = (v) => {
      const q = [0, 1, 2].map((k) => Math.max(-(h[k] - r), Math.min(h[k] - r, v[k])));
      const d = [v[0] - q[0], v[1] - q[1], v[2] - q[2]], l = Math.hypot(d[0], d[1], d[2]);
      const n = l > 1e-6 ? [d[0] / l, d[1] / l, d[2] / l] : null;
      return { p: n ? [c[0] + q[0] + n[0] * r, c[1] + q[1] + n[1] * r, c[2] + q[2] + n[2] * r] : [c[0] + v[0], c[1] + v[1], c[2] + v[2]], n };
    };
    const top = opts.top || col;
    // faces: [normal axis, sign, u axis, v axis] wound counter-clockwise from outside
    for (const [ax, sg, ua, va] of [[0, 1, 1, 2], [0, -1, 2, 1], [1, 1, 2, 0], [1, -1, 0, 2], [2, 1, 0, 1], [2, -1, 1, 0]]) {
      if (opts.noBottom && ax === 1 && sg < 0) continue;
      const fn = [0, 0, 0]; fn[ax] = sg;
      const U = A[ua], V = A[va], fc = ax === 1 && sg > 0 ? top : col;
      for (let i = 0; i < U.length - 1; i++) for (let j = 0; j < V.length - 1; j++) {
        const P = (ii, jj) => { const v = [0, 0, 0]; v[ax] = sg * h[ax]; v[ua] = U[ii]; v[va] = V[jj]; const o = vert(v); return [o.p, o.n || fn]; };
        const [p00, n00] = P(i, j), [p10, n10] = P(i + 1, j), [p11, n11] = P(i + 1, j + 1), [p01, n01] = P(i, j + 1);
        const pr = opts.print && ax === 2 && sg > 0 ? opts.print : null, pb = opts.printBack && ax === 2 && sg < 0 ? opts.printBack : null;
        // front: u runs with +x; back (seen from behind): u runs with -x, so the print isn't mirrored
        const T = pr ? (ii, jj) => [pr[0] + (pr[2] - pr[0]) * (U[ii] + h[0]) / (2 * h[0]), pr[1] + (pr[3] - pr[1]) * (V[jj] + h[1]) / (2 * h[1])]
          : pb ? (ii, jj) => [pb[0] + (pb[2] - pb[0]) * (h[0] - V[jj]) / (2 * h[0]), pb[1] + (pb[3] - pb[1]) * (U[ii] + h[1]) / (2 * h[1])] : () => null;
        this.triN(p00, p10, p11, n00, n10, n11, fc, T(i, j), T(i + 1, j), T(i + 1, j + 1)); this.triN(p00, p11, p01, n00, n11, n01, fc, T(i, j), T(i + 1, j + 1), T(i, j + 1));
      }
    }
    return this;
  }
  // a stud: cylinder of radius r and height h on top of point c, with a rounded top edge; 5·seg triangles
  stud(c, r, h, seg, col) {
    const b = Math.min(r * 0.18, h * 0.5);
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * Math.PI * 2, a1 = ((i + 1) / seg) * Math.PI * 2;
      const P = (a, rr, y) => [c[0] + Math.sin(a) * rr, c[1] + y, c[2] + Math.cos(a) * rr];
      const N = (a, ny) => { const s = Math.sqrt(1 - ny * ny); return [Math.sin(a) * s, ny, Math.cos(a) * s]; };
      this.triN(P(a0, r, 0), P(a1, r, 0), P(a1, r, h - b), N(a0, 0), N(a1, 0), N(a1, 0), col);
      this.triN(P(a0, r, 0), P(a1, r, h - b), P(a0, r, h - b), N(a0, 0), N(a1, 0), N(a0, 0), col);
      this.triN(P(a0, r, h - b), P(a1, r, h - b), P(a1, r - b, h), N(a0, 0), N(a1, 0), N(a1, 0.85), col);
      this.triN(P(a0, r, h - b), P(a1, r - b, h), P(a0, r - b, h), N(a0, 0), N(a1, 0.85), N(a0, 0.85), col);
      this.triN(P(a0, r - b, h), P(a1, r - b, h), [c[0], c[1] + h, c[2]], [0, 1, 0], [0, 1, 0], [0, 1, 0], col);
    }
    return this;
  }
  // smooth cylinder along +y (side normals smooth, caps flat): base centre c, radius r, height h
  scyl(c, r, h, seg, col, opts = {}) {
    const top = opts.top || col, r1 = opts.r1 ?? r;
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * Math.PI * 2, a1 = ((i + 1) / seg) * Math.PI * 2;
      const P = (a, rr, y) => [c[0] + Math.sin(a) * rr, c[1] + y, c[2] + Math.cos(a) * rr], N = (a) => [Math.sin(a), 0, Math.cos(a)];
      this.triN(P(a0, r, 0), P(a1, r, 0), P(a1, r1, h), N(a0), N(a1), N(a1), col);
      this.triN(P(a0, r, 0), P(a1, r1, h), P(a0, r1, h), N(a0), N(a1), N(a0), col);
      if (!opts.noTop) this.triN(P(a0, r1, h), P(a1, r1, h), [c[0], c[1] + h, c[2]], [0, 1, 0], [0, 1, 0], [0, 1, 0], top);
      if (opts.bottom) this.triN(P(a1, r, 0), P(a0, r, 0), [c[0], c[1], c[2]], [0, -1, 0], [0, -1, 0], [0, -1, 0], col);
    }
    return this;
  }
  // the same cylinder lying along x (wheels): centre c, radius r, half-width hw
  xcyl(c, r, hw, seg, col, capCol) {
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * Math.PI * 2, a1 = ((i + 1) / seg) * Math.PI * 2;
      const P = (a, x) => [c[0] + x, c[1] + Math.sin(a) * r, c[2] + Math.cos(a) * r], N = (a) => [0, Math.sin(a), Math.cos(a)];
      this.triN(P(a0, -hw), P(a0, hw), P(a1, hw), N(a0), N(a0), N(a1), col);
      this.triN(P(a0, -hw), P(a1, hw), P(a1, -hw), N(a0), N(a1), N(a1), col);
      const cc = capCol || col;
      this.triN(P(a1, hw), P(a0, hw), [c[0] + hw, c[1], c[2]], [1, 0, 0], [1, 0, 0], [1, 0, 0], cc);
      this.triN(P(a0, -hw), P(a1, -hw), [c[0] - hw, c[1], c[2]], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], cc);
    }
    return this;
  }
  // average the normals of coincident vertices whose faces bend by less than `deg`: road and terrain ribbons are
  // emitted triangle by triangle with face normals, which shows every fold of the ground as a hard luminance step
  smooth(deg = 35) {
    const p = this.p, n = this.n, cos = Math.cos((deg * Math.PI) / 180), at = new Map(), out = n.slice();
    for (let i = 0; i < p.length; i += 3) {
      const k = Math.round(p[i] * 64) + ',' + Math.round(p[i + 1] * 64) + ',' + Math.round(p[i + 2] * 64);
      const l = at.get(k);
      if (l) l.push(i); else at.set(k, [i]);
    }
    for (const l of at.values()) {
      if (l.length < 2) continue;
      for (const i of l) {
        let x = 0, y = 0, z = 0;
        for (const j of l) if (n[i] * n[j] + n[i + 1] * n[j + 1] + n[i + 2] * n[j + 2] >= cos) { x += n[j]; y += n[j + 1]; z += n[j + 2]; }
        const d = Math.hypot(x, y, z) || 1;
        out[i] = x / d; out[i + 1] = y / d; out[i + 2] = z / d;
      }
    }
    this.n = out;
    return this;
  }
  get count() { return this.p.length / 3; }
  build(THREE, { parts = false } = {}) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    if (parts) g.setAttribute('aPart', new THREE.Float32BufferAttribute(this.part, 1));
    if (this.e.some((v) => v > 0)) g.setAttribute('aEdge', new THREE.Float32BufferAttribute(this.e, 4));
    g.computeBoundingSphere();
    return g;
  }
}
