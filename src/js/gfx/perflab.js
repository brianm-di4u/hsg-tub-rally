// Perf lab (test only, reviews/PERF.md): synthetic brick crews at chosen detail levels, swapped into a live race so
// the cost of figure complexity can be measured on every device proxy (tools/perf-gpu.mjs --scenes=lab). The
// geometry uses the real part layout of karts3d.js (one draw per tub, rigid parts animated on the palette) and the
// real brick material, so its cost per triangle is what the Blender figures will cost.
import { Geo, hex, mul } from './geom.js';
import { worldMat } from './brickmat.js';

// detail levels: bevel steps per rounded box, segments per stud
export const LAB_LEVELS = [
  { seg: 0, stud: 0 }, { seg: 1, stud: 8 }, { seg: 2, stud: 12 }, { seg: 3, stud: 16 }, { seg: 5, stud: 24 }, { seg: 8, stud: 48 },
];
const BODY = 0, WHEEL = [1, 2, 3, 4], FLAG = 5, DUCK = 6, CAP_T = 7, CAP_H = 8, CAP_LA = 9, CAP_RA = 10, WATER = 23;
const ATT = [[11, 12, 13], [14, 15, 16], [17, 18, 19], [20, 21, 22]];

// one brick figure: torso part (body, head, hat with stud, arms, mitten hands, item), two legs; L = detail level
function figure(g, L, parts, col) {
  const { seg, stud } = L, r = 0.035, skin = hex('#F2CD37'), pants = hex('#2B2E33');
  g.setPart(parts[0]);
  g.rbox([-0.2, 0.0, -0.12], [0.2, 0.52, 0.12], col, r, seg);
  g.rbox([-0.15, 0.56, -0.13], [0.15, 0.86, 0.13], skin, r * 1.6, seg);
  g.rbox([-0.17, 0.87, -0.15], [0.17, 0.99, 0.15], col, r, seg);
  if (stud) g.stud([0, 0.99, 0], 0.07, 0.04, stud, col);
  for (const s of [-1, 1]) {
    g.rbox([0.2 * s - (s > 0 ? 0 : 0.09), 0.3, -0.05], [0.2 * s + (s > 0 ? 0.09 : 0), 0.42, 0.42], col, r * 0.6, seg);
    g.rbox([0.2 * s - (s > 0 ? -0.005 : 0.095), 0.28, 0.42], [0.2 * s + (s > 0 ? 0.095 : 0.005), 0.42, 0.52], skin, r * 0.8, seg);
  }
  g.rbox([0.24, 0.42, 0.42], [0.36, 0.49, 0.52], hex('#E4ADC8'), r * 0.5, seg);
  for (let s = 0; s < 2; s++) {
    g.setPart(parts[1 + s]);
    const x0 = s === 0 ? 0.02 : -0.18;
    g.rbox([x0, -0.55, -0.08], [x0 + 0.16, 0, 0.08], pants, r, seg);
    g.rbox([x0 - 0.01, -0.62, -0.06], [x0 + 0.17, -0.55, 0.16], pants, r * 0.6, seg);
  }
}

export function labKartGeo(THREE, level) {
  const L = LAB_LEVELS[level], g = new Geo(), red = hex('#C91A09'), white = hex('#F4F4F4'), grey = hex('#6C6E68');
  g.setPart(BODY);
  g.rbox([-0.5, 0.26, -0.75], [0.5, 0.36, 0.75], grey, 0.03, L.seg);
  g.rbox([-0.42, 0.42, -0.86], [0.42, 1.02, 0.86], white, 0.12, L.seg + 1);
  g.rbox([-0.46, 0.98, -0.9], [0.46, 1.06, 0.9], red, 0.03, L.seg);
  if (L.stud) for (let i = 0; i < 8; i++) for (const s of [-1, 1]) g.stud([0.4 * s, 1.06, -0.7 + i * 0.2], 0.06, 0.035, L.stud, red);
  WHEEL.forEach((p) => { g.setPart(p); g.rbox([-0.07, -0.3, -0.3], [0.07, 0.3, 0.3], grey, 0.1, L.seg + 1); });
  g.setPart(FLAG); g.rbox([-0.02, 0, -0.02], [0.02, 1.25, 0.02], white, 0.01, Math.min(1, L.seg)); g.rbox([-0.01, 0.85, -0.55], [0.01, 1.2, 0], red, 0.005, Math.min(1, L.seg));
  g.setPart(DUCK); g.rbox([-0.08, 0, -0.09], [0.08, 0.15, 0.09], hex('#F2CD37'), 0.05, L.seg + 1);
  g.setPart(CAP_T); g.rbox([-0.2, 0, -0.13], [0.2, 0.45, 0.13], red, 0.035, L.seg);
  g.setPart(CAP_H); g.rbox([-0.15, 0, -0.13], [0.15, 0.3, 0.13], hex('#F2CD37'), 0.05, L.seg); g.rbox([-0.17, 0.3, -0.15], [0.17, 0.42, 0.15], red, 0.03, L.seg);
  if (L.stud) g.stud([0, 0.42, 0], 0.07, 0.04, L.stud, red);
  for (const p of [CAP_LA, CAP_RA]) { g.setPart(p); g.rbox([-0.045, -0.04, 0], [0.045, 0.05, 0.45], red, 0.02, L.seg); }
  ATT.forEach((parts) => figure(g, L, parts, red));
  g.setPart(WATER); g.rbox([-0.36, -0.01, -0.77], [0.36, 0.01, 0.77], hex('#5A93DB'), 0.01, 0);
  return g.build(THREE, { parts: true });
}

// a cheering brick crowd along both sidewalks: one instanced draw per crowd
export function labCrowd(THREE, track, count, level) {
  const L = LAB_LEVELS[level], g = new Geo(), col = hex('#0055BF');
  figure(g, L, [0, 0, 0], col);
  const geo = g.build(THREE);
  const mat = worldMat({ gloss: 0.6 });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1), up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < count; i++) {
    const side = i % 2 ? 1 : -1, at = ((Math.floor(i / 2) * 0.9) % track.length);
    const c = track.at(at), d = side * ((side > 0 ? c.wr : c.wl) + 2.2 + (i % 6) * 0.35);
    const p = track.point(at, d);
    q.setFromAxisAngle(up, Math.atan2(c.tx, c.tz) + (side > 0 ? -Math.PI / 2 : Math.PI / 2));
    m.compose(new THREE.Vector3(p.x, track.heightAt(c, d) + 0.62, p.z), q, s);
    mesh.setMatrixAt(i, m);
  }
  mesh.frustumCulled = false;
  mesh.name = 'lab-crowd';
  return { mesh, tris: (geo.attributes.position.count / 3) * count };
}

export function labStats(THREE) {
  return LAB_LEVELS.map((L, i) => {
    const kg = labKartGeo(THREE, i), fg = new Geo(); figure(fg, L, [0, 0, 0], [1, 1, 1]);
    const out = { level: i, ...L, tubTris: kg.attributes.position.count / 3, figureTris: fg.count / 3 };
    kg.dispose();
    return out;
  });
}
