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
  const dome = new THREE.Mesh(dg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, depthWrite: false, fog: false }));
  dome.renderOrder = -10;
  group.add(dome);
  // the Ouachita horizon, brick-built: three rings of long, low ridges whose silhouettes step in whole plates
  // (6 m), each column topped by a lighter plate edge, tinted toward the horizon haze with distance. They reach
  // below the ground so no band shows where the terrain ends.
  const ridgeCols = env.ridges || ['#7F9AB0', '#5F7F6E', '#40604A'], seed = env.ridgeSeed || 3;
  const LAYERS = [[352, 0.62, 30, 64], [334, 0.32, 24, 48], [316, 0.0, 16, 34]]; // radius, haze, base height, swing
  const rpos = [], rcol = [], N = 180, STEP = 6, BOT = -60;
  LAYERS.forEach(([R2, haze, base, amp], li) => {
    const c0 = hex(ridgeCols[li]), c = [0, 1, 2].map((k) => c0[k] + (B[k] - c0[k]) * haze), lip = c.map((v) => Math.min(1, v * 1.18 + 0.03));
    const ph = [1.3, 2.9, 4.1].map((v) => v * (seed + li * 1.7));
    // env.peaks: [azimuth, half-width (rad), height (m)] mountains that rise above the ridges (the nearer rings most)
    const peak = (a) => (env.peaks || []).reduce((h, [az, w, ht]) => { const d = Math.atan2(Math.sin(a - az), Math.cos(a - az)); return h + ht * [0.45, 0.75, 1][li] * Math.exp(-((d / w) ** 2)); }, 0);
    const height = (a) => base + peak(a) + amp * (0.55 * Math.sin(a * 2 + ph[0]) + 0.3 * Math.sin(a * 5 + ph[1]) + 0.15 * Math.sin(a * 11 + ph[2]));
    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2;
      const h = Math.max(STEP, Math.round(height((a0 + a1) / 2) / STEP) * STEP);
      const P = (a, y) => [Math.sin(a) * R2, y, Math.cos(a) * R2];
      const quad = (y0, y1, col) => { for (const v of [P(a0, y0), P(a1, y1), P(a1, y0), P(a0, y0), P(a0, y1), P(a1, y1)]) { rpos.push(...v); rcol.push(...col); } };
      quad(BOT, h - 1.4, c);
      quad(h - 1.4, h, lip);
    }
  });
  const rg = new THREE.BufferGeometry();
  rg.setAttribute('position', new THREE.Float32BufferAttribute(rpos, 3));
  rg.setAttribute('color', new THREE.Float32BufferAttribute(rcol, 3));
  const ridges = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, depthWrite: false, fog: false }));
  ridges.renderOrder = -9;
  group.add(ridges);
  group.userData.follow = true;
  return group;
}
