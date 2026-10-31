// Sky: a vertex-coloured gradient dome plus rings of brick-stepped ridges (the Ouachita horizon) that follow the
// camera position, so they always sit at the horizon. Drawn first with depth writes off.
import { hex } from './geom.js';

export function buildSky(THREE, env = {}) {
  const group = new THREE.Group();
  group.name = 'sky';
  const [top, bot] = env.sky || ['#7FB6E0', '#D9ECF5'];
  const T = hex(top), B = hex(bot), F = hex(env.fogColor || bot);
  // dome
  const R = 400, seg = 16, rings = 6;
  const pos = [], col = [];
  for (let j = 0; j < rings; j++) {
    const a0 = (j / rings) * (Math.PI / 2), a1 = ((j + 1) / rings) * (Math.PI / 2);
    for (let i = 0; i < seg; i++) {
      const b0 = (i / seg) * Math.PI * 2, b1 = ((i + 1) / seg) * Math.PI * 2;
      const P = (a, b) => [Math.cos(a) * Math.sin(b) * R, Math.sin(a) * R * 0.6 - 20, Math.cos(a) * Math.cos(b) * R];
      const C = (a) => { const t = Math.pow(a / (Math.PI / 2), 0.7); return [B[0] + (T[0] - B[0]) * t, B[1] + (T[1] - B[1]) * t, B[2] + (T[2] - B[2]) * t]; };
      const q = [P(a0, b0), P(a1, b1), P(a1, b0), P(a0, b0), P(a0, b1), P(a1, b1)];
      const qc = [C(a0), C(a1), C(a1), C(a0), C(a0), C(a1)];
      q.forEach((p) => pos.push(...p)); qc.forEach((c) => col.push(...c));
    }
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  dg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  // the gradient, plus a glow toward the sun along the horizon and a soft sun disc (strong at dusk and sunset, a faint
  // haze by day)
  const low = env.time === 'dusk' || env.time === 'sunset';
  const sd = env.sun || [0.35, 0.8, 0.45], sl = Math.hypot(sd[0], sd[2]) || 1;
  const dome = new THREE.Mesh(dg, new THREE.ShaderMaterial({
    uniforms: { uSun: { value: new THREE.Vector3(sd[0] / sl, Math.max(0.16, Math.min(0.3, sd[1] * 0.5)), sd[2] / sl).normalize() },
      uGlow: { value: new THREE.Color(low ? (env.time === 'dusk' ? '#FFB27A' : '#FFD08A') : '#FFF6E0') }, uGlowAmt: { value: low ? 1.0 : 0.25 }, uDisc: { value: low ? 1 : 0 } },
    vertexShader: 'attribute vec3 color; varying vec3 vC; varying vec3 vDir; void main() { vC = color; vDir = normalize(position + vec3(0.0, 20.0, 0.0)); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform vec3 uSun; uniform vec3 uGlow; uniform float uGlowAmt; uniform float uDisc; varying vec3 vC; varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir); float toward = max(dot(d, uSun), 0.0);
        float band = exp(-max(d.y, 0.0) * 2.6);
        vec3 c = mix(vC, uGlow, clamp(uGlowAmt * band * (0.6 + 0.4 * pow(toward, 3.0)), 0.0, 1.0));
        c = mix(c, vec3(1.0, 0.96, 0.85), uDisc * smoothstep(0.9975, 0.999, toward));
        gl_FragColor = vec4(c, 1.0);
      }`,
    side: THREE.BackSide, depthWrite: false }));
  dome.renderOrder = -10;
  group.add(dome);
  // the Ouachita horizon, brick-built: three rings of rounded forested hills, each a run of overlapping humps
  // (not one long wall), stepped in whole plates (6 m) and 2° columns, with valleys low enough for the farther ring
  // to show through. A column's flank is lit by where it faces (the sun side of a hump brighter, the rings toward
  // the sun backlit), and the shader covers every slope in stepped conifer crowns, rows of them up to a ragged
  // tree line on the silhouette, hazier toward each hill's foot. They reach below the ground so no band shows where
  // the terrain ends.
  const ridgeCols = env.ridges || ['#7F9AB0', '#5F7F6E', '#40604A'], seed = env.ridgeSeed || 3;
  const LAYERS = [[352, 0.6, 14, 58], [334, 0.42, 8, 46], [316, 0.24, 4, 36]]; // radius, haze, valley floor, hump height
  const rpos = [], rcol = [], rinf = [], N = (env.boards ?? 1) < 1 ? 120 : 180, STEP = 6, BOT = -60; // Low: 3° columns
  const sunXZ = [sd[0] / sl, sd[2] / sl];
  const rnd = (i, k) => (((i * 2654435761) ^ (k * 2246822519)) >>> 0) / 4294967296;
  LAYERS.forEach(([R2, haze, floor, hump], li) => {
    const c0 = hex(ridgeCols[li]), c = [0, 1, 2].map((k) => c0[k] + (B[k] - c0[k]) * haze), lip = c.map((v) => Math.min(1, v * 1.12 + 0.03));
    // humps: 14–20 per ring at seeded azimuths, each a rounded cap of its own width and height; a ring is the
    // highest hump over each column, so neighbours overlap into saddles and valleys
    const humps = [], nh = 14 + Math.floor(rnd(seed, li + 1) * 7);
    for (let k = 0; k < nh; k++) humps.push([((k + 0.15 + rnd(seed * 31 + k, li) * 0.7) / nh) * Math.PI * 2, 0.12 + rnd(k, seed + li * 7) * 0.22, hump * (0.45 + 0.55 * rnd(k * 3 + 1, seed + li))]);
    // env.peaks: [azimuth, half-width (rad), height (m)] mountains that rise above the rest (the nearer rings most)
    for (const [az, w, ht] of env.peaks || []) humps.push([az, w * 0.8, hump * 0.4 + ht * [0.55, 0.8, 1][li]]);
    const height = (a) => {
      let h = floor;
      for (const [az, w, ht] of humps) { const d = Math.atan2(Math.sin(a - az), Math.cos(a - az)) / w; if (Math.abs(d) < 1) h = Math.max(h, floor + ht * Math.pow(1 - d * d, 0.75)); }
      return h + 2.5 * Math.sin(a * 23 + li * 1.7 + seed);
    };
    const tops = [];
    for (let i = 0; i < N; i++) tops.push(Math.max(STEP, Math.round(height(((i + 0.5) / N) * Math.PI * 2) / STEP) * STEP));
    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2, am = (a0 + a1) / 2, h = tops[i];
      const P = (a, y, r = R2) => [Math.sin(a) * r, y, Math.cos(a) * r];
      // light by the hump's slope across the column (its flank faces along the ring) and by the ring facing the sun
      const slope = (tops[(i + 1) % N] - tops[(i + N - 1) % N]) / (2 * R2 * (Math.PI * 2 / N));
      const tx = Math.cos(am), tz = -Math.sin(am), side = -Math.max(-1, Math.min(1, slope * 2.5)) * (tx * sunXZ[0] + tz * sunXZ[1]);
      const front = -(Math.sin(am) * sunXZ[0] + Math.cos(am) * sunXZ[1]);
      const t = (0.94 + 0.12 * rnd(i, li + 11)) * (1 + 0.16 * side + 0.08 * front), col = c.map((v) => Math.min(1, v * t));
      const foot = col.map((v, k) => v * 0.8 + B[k] * 0.2 * haze);
      // u: metres along the ring (the crowns' grid); y: height; z: the column's top (crowns fill below it), -1 for
      // tree-line crowns, -2 for a terrace's lit top
      const quad = (b0, b1, y0, y1, c0q, c1q, top, r = R2) => { const cs = [c0q, c1q, c0q, c0q, c1q, c1q]; [[b0, y0], [b1, y1], [b1, y0], [b0, y0], [b0, y1], [b1, y1]].forEach(([b, y], k) => { rpos.push(...P(b, y, r)); rcol.push(...cs[k]); rinf.push(b * R2, y, top, haze); }); };
      const tread = (y, rA, rB, cq) => [[a0, rA], [a1, rB], [a1, rA], [a0, rA], [a0, rB], [a1, rB]].forEach(([b, r]) => { rpos.push(...P(b, y, r)); rcol.push(...cq); rinf.push(b * R2, y, -2, haze); });
      // a tall hill steps back in three terraces (summit furthest): the elevated landmark cameras look down onto
      // their lit tops, so a hillside reads as stepped slopes rather than one sheer face. Drawn far to near.
      // (each lower riser ends in a lit lip under its terrace, so the steps read from the low chase camera too)
      const y1 = Math.round(h * 0.42 / STEP) * STEP, y2 = Math.round(h * 0.72 / STEP) * STEP, D = 28, ledge = col.map((v) => Math.min(1, v * 1.28 + 0.03));
      if (h >= 30 && y1 > 0 && y2 > y1) {
        quad(a0, a1, y2 - 2, h - 1.2, col, col, h);
        quad(a0, a1, h - 1.2, h, lip, lip, h);
        tread(y2, R2 - D, R2, ledge);
        quad(a0, a1, y1 - 2, y2 - 1.6, col, col, h, R2 - D);
        quad(a0, a1, y2 - 1.6, y2, lip, lip, h, R2 - D);
        tread(y1, R2 - 2 * D, R2 - D, ledge);
        quad(a0, a1, BOT, y1 - 1.6, foot, col, h, R2 - 2 * D);
        quad(a0, a1, y1 - 1.6, y1, lip, lip, h, R2 - 2 * D);
      } else {
        quad(a0, a1, BOT, Math.max(BOT + 1, h - 14), foot, col, h);
        quad(a0, a1, Math.max(BOT + 1, h - 14), h - 1.2, col, col, h);
        quad(a0, a1, h - 1.2, h, lip, lip, h);
      }
      // a ragged tree line: one or two crowns of their own width and height standing on most columns
      const trees = col.map((v) => v * 0.8);
      for (let k = 0; k < 2; k++) {
        const r = rnd(i * 2 + k, li + 5);
        if (r > 0.82) continue;
        const ta = a0 + (a1 - a0) * (0.15 + 0.7 * rnd(i * 5 + k, li + 9)), tw = (2.5 + r * 4) / R2, th = 4 + r * 6;
        quad(ta - tw, ta + tw, h - 0.5, h + th * 0.4, trees, trees, -1, R2 - 0.5);
        quad(ta - tw * 0.62, ta + tw * 0.62, h + th * 0.4, h + th * 0.75, trees, trees, -1, R2 - 0.5);
        quad(ta - tw * 0.28, ta + tw * 0.28, h + th * 0.75, h + th, trees, trees, -1, R2 - 0.5);
      }
    }
  });
  const rg = new THREE.BufferGeometry();
  rg.setAttribute('position', new THREE.Float32BufferAttribute(rpos, 3));
  rg.setAttribute('color', new THREE.Float32BufferAttribute(rcol, 3));
  rg.setAttribute('aInfo', new THREE.Float32BufferAttribute(rinf, 4));
  const ridges = new THREE.Mesh(rg, new THREE.ShaderMaterial({
    uniforms: { uHaze: { value: new THREE.Color(...B) }, uSunSide: { value: 1 } },
    vertexShader: 'attribute vec3 color; attribute vec4 aInfo; varying vec3 vC; varying vec4 vI; void main() { vC = color; vI = aInfo; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    // forested slopes: rows of stepped conifer crowns (7 m apart, 6 m rows, alternate rows offset), each a shade
    // darker than the slope with a lit and a shaded half, thinning toward the bare upper lip; the foot hazes out
    fragmentShader: `uniform vec3 uHaze; varying vec3 vC; varying vec4 vI;
      float h21(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
      void main() {
        vec3 c = vC;
        if (vI.z > 0.0) {
          float depth = vI.z - vI.y, row = floor(vI.y / 6.0), fy = fract(vI.y / 6.0);
          float cw = 5.5 + 3.5 * h21(vec2(row, 3.7)); // each row's own spacing (5.5-9 m)
          float cu = vI.x / cw + row * 0.37, fu = fract(cu), id = h21(vec2(floor(cu), row)), id2 = h21(vec2(row, floor(cu)) + 7.0);
          // each crown sits off-centre in its cell, and the stand thins into clearings along the ring, so the
          // slope doesn't read as a printed grid
          float jit = (h21(vec2(floor(cu) * 1.7, row * 3.1)) - 0.5) * 0.36;
          float hw = (0.36 - 0.11 * floor(fy * 3.0)) * (0.7 + 0.3 * id2), dx = abs(fu - 0.5 - jit), aa = fwidth(cu) * 0.75 + 1e-4;
          float stand = 0.45 + 0.55 * smoothstep(-0.35, 0.45, sin(vI.x * 0.021 + row * 0.35) * sin(vI.x * 0.0071 + 1.3));
          float crown = (1.0 - smoothstep(hw - aa, hw + aa, dx)) * step(id, 0.82 * stand * smoothstep(2.0, 5.0, depth));
          // the hazier the ring, the fainter its crowns (a far ring stays a soft blue-green, not snow-flecked)
          float k = 1.0 - 0.6 * vI.w;
          c *= mix(1.0, (fu < 0.5 ? 0.86 : 0.74) * (0.94 + 0.12 * id2), crown * k);
          c = mix(c, uHaze, clamp((depth - 10.0) / 70.0, 0.0, 1.0) * 0.3);
        }
        gl_FragColor = vec4(c, 1.0);
      }`,
    side: THREE.DoubleSide, depthWrite: false }));
  ridges.renderOrder = -9;
  group.add(ridges);
  group.userData.follow = true;
  return group;
}
