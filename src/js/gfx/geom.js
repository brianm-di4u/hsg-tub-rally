// A tiny vertex-colour triangle builder for N64-style low-poly meshes (world chunks, props, placeholder tubs).
// Pattern after hsg-theme-park/src/js/gfx/geo.js (Hot Springs Games, MIT): accumulate flat-shaded triangles
// with per-vertex colour, uv and an optional rigid-part index, then upload once.

export function hex(h) {
  const n = parseInt(h.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
export const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
export const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

export class Geo {
  constructor() { this.p = []; this.n = []; this.c = []; this.uv = []; this.part = []; this.curPart = 0; this.light = null; }
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
    });
    return this;
  }
  // quad a b c d counter-clockwise seen from the front
  quad(a, b, c, d, col, uv, cols) {
    const u = uv || [[0, 0], [1, 0], [1, 1], [0, 1]];
    const cc = cols || [col, col, col, col];
    this.tri(a, b, c, cc[0], u[0], u[1], u[2], cc[1], cc[2]);
    this.tri(a, c, d, cc[0], u[0], u[2], u[3], cc[2], cc[3]);
    return this;
  }
  // axis-aligned box from min to max (with optional colour per face: [top, side, bottom])
  box(min, max, col, opts = {}) {
    const [x0, y0, z0] = min, [x1, y1, z1] = max;
    const top = opts.top || col, side = opts.side || col, bot = opts.bottom || col;
    const front = opts.front || side;
    this.quad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], top);
    if (!opts.noBottom) this.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], bot);
    this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], front); // +z
    this.quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], side); // -z
    this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], side); // +x
    this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], side); // -x
    return this;
  }
  // transformed box: centre c, half sizes h, rotation about y (yaw) and x (pitch)
  obox(c, h, col, yaw = 0, opts = {}) {
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const T = (x, y, z) => [c[0] + x * cy + z * sy, c[1] + y, c[2] - x * sy + z * cy];
    const [hx, hy, hz] = h;
    const P = [T(-hx, -hy, -hz), T(hx, -hy, -hz), T(hx, -hy, hz), T(-hx, -hy, hz), T(-hx, hy, -hz), T(hx, hy, -hz), T(hx, hy, hz), T(-hx, hy, hz)];
    const top = opts.top || col, side = opts.side || col;
    this.quad(P[7], P[6], P[5], P[4], top);
    if (!opts.noBottom) this.quad(P[0], P[1], P[2], P[3], opts.bottom || col);
    this.quad(P[3], P[2], P[6], P[7], opts.front || side);
    this.quad(P[1], P[0], P[4], P[5], side);
    this.quad(P[2], P[1], P[5], P[6], side);
    this.quad(P[0], P[3], P[7], P[4], side);
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
  get count() { return this.p.length / 3; }
  build(THREE, { parts = false } = {}) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    if (parts) g.setAttribute('aPart', new THREE.Float32BufferAttribute(this.part, 1));
    g.computeBoundingSphere();
    return g;
  }
}
