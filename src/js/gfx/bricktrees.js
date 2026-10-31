// Brick-built trees and crowds, instanced (one draw per kind), replacing the painted billboards. Trees are stacks of
// plain bricks and plates (studs come from the material's stud pattern on their tops), each instance with its own
// green, scale and turn. Spectators are small brick figures behind a plastic barrier, each with its own shirt and
// skin colour; about half of them cheer (arms swung in the vertex shader, brickmat.js CHEER).
import { Geo, hex } from './geom.js';
import { worldMat, PAL } from './brickmat.js';

function hash(i, s = 0) { let h = (i * 374761393 + s * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
const MARK = [1, 1, 1], SKIN = [1, 0, 1]; // vertex colours the instance replaces (brickmat INST_SLOTS)
const Q = Math.PI / 4;

// tree models: [trunk boxes], then canopy layers [cx, cy, cz, half-width, half-height, turn]
const TREES = {
  oak: { trunk: [[0.28, 3.0]], layers: [[0, 3.3, 0, 1.9, 0.45, 0], [0, 4.1, 0, 2.5, 0.5, Q], [0.2, 4.95, -0.1, 2.3, 0.45, 0], [-0.1, 5.7, 0.1, 1.7, 0.4, Q], [0, 6.35, 0, 1.0, 0.35, 0]],
    greens: [PAL.green, PAL.brightGreen, '#3E8E3A', PAL.darkGreen] },
  magnolia: { trunk: [[0.2, 2.2]], layers: [[0, 2.4, 0, 1.4, 0.4, 0], [0, 3.1, 0, 1.8, 0.45, Q], [0, 3.85, 0, 1.5, 0.4, 0], [0, 4.5, 0, 0.9, 0.35, Q]],
    greens: [PAL.darkGreen, '#2E6B3A', '#1F5E37'], flowers: true },
  // a narrow, taller spruce mixed into the pine stands, and a maple of offset canopy clusters among the oaks
  spruce: { trunk: [[0.13, 12.6]], layers: [1.9, 1.75, 1.6, 1.45, 1.3, 1.1, 0.9, 0.7, 0.5].map((w, i) => [0, 2.0 + i * 1.2, 0, w, 0.36, i % 2 ? Q : 0]).concat([[0, 12.9, 0, 0.25, 0.4, 0]]),
    greens: ['#1D4F33', PAL.darkGreen, '#285E3A'] },
  maple: { trunk: [[0.26, 3.4]], layers: [[0, 3.6, 0, 1.6, 0.5, 0], [1.1, 4.3, 0.4, 1.2, 0.55, Q], [-1.0, 4.5, -0.5, 1.3, 0.55, 0], [0.2, 5.3, -0.9, 1.1, 0.5, Q], [-0.3, 5.6, 0.8, 1.0, 0.45, 0], [0.1, 6.3, 0, 0.9, 0.4, Q]],
    greens: ['#6EAA3C', PAL.brightGreen, '#8DB33F', '#C77B30'] },
  pine: { trunk: [[0.15, 11.6]], layers: [2.6, 2.3, 2.0, 1.65, 1.3, 0.95, 0.6].map((w, i) => [0, 2.3 + i * 1.35, 0, w, 0.32, i % 2 ? Q : 0]).concat([[0, 11.9, 0, 0.3, 0.45, 0]]),
    greens: [PAL.darkGreen, '#1F5E37', '#2C6A3F', '#3E7D44'] },
};

function treeGeo(THREE, kind) {
  const T = TREES[kind], g = new Geo(), bark = hex(PAL.reddishBrown);
  for (const [w, h] of T.trunk) g.box([-w, 0, -w], [w, h, w], bark);
  for (const [x, y, z, w, h, yaw] of T.layers) g.obox([x, y, z], [w, h, w], MARK, yaw);
  if (T.flowers) for (let i = 0; i < 9; i++) { const a = i * 2.4, r = 0.6 + (i % 3) * 0.45, y = 2.9 + (i % 4) * 0.45; g.box([Math.sin(a) * r - 0.12, y, Math.cos(a) * r - 0.12], [Math.sin(a) * r + 0.12, y + 0.24, Math.cos(a) * r + 0.12], hex(PAL.white)); }
  return g.build(THREE);
}

// a spectator facing +z, feet at y = 0: legs and hips, shirt torso, skin head with hair, arms (parts 1 and 2)
function fanGeo(THREE) {
  const g = new Geo(), pants = hex('#2B2E33'), hair = hex('#4A3426');
  g.setPart(0);
  g.box([-0.17, 0, -0.08], [-0.01, 0.55, 0.08], pants); g.box([0.01, 0, -0.08], [0.17, 0.55, 0.08], pants);
  g.box([-0.19, 0.55, -0.1], [0.19, 0.64, 0.1], pants);
  g.box([-0.2, 0.64, -0.12], [0.2, 1.1, 0.12], MARK);
  g.box([-0.07, 1.1, -0.06], [0.07, 1.15, 0.06], SKIN);
  g.box([-0.15, 1.15, -0.13], [0.15, 1.44, 0.13], SKIN);
  g.box([-0.16, 1.36, -0.15], [0.16, 1.5, 0.1], hair);
  // printed face on the front of the head: two eyes and a smile
  const ink = hex('#1E1B18');
  for (const ex of [-0.065, 0.065]) g.box([ex - 0.022, 1.29, 0.13], [ex + 0.022, 1.335, 0.136], ink);
  g.box([-0.06, 1.215, 0.13], [0.06, 1.235, 0.136], ink);
  for (const [part, sx] of [[1, 1], [2, -1]]) {
    g.setPart(part);
    const x0 = sx > 0 ? 0.2 : -0.29, x1 = sx > 0 ? 0.29 : -0.2;
    g.box([x0, 0.66, -0.055], [x1, 1.06, 0.055], MARK);
    g.box([x0 - 0.005, 0.56, -0.06], [x1 + 0.005, 0.68, 0.06], SKIN);
  }
  return g.build(THREE, { parts: true });
}

const SHIRTS = [PAL.red, PAL.blue, PAL.yellow, PAL.green, PAL.orange, PAL.white, PAL.azure, PAL.magenta, PAL.lime, PAL.mediumBlue, PAL.pink, PAL.tan];
const SKINS = ['#F1C9A5', '#E0AC7E', '#C68C5D', '#A86F4C', '#8D5A3B', '#6B4329'];

// verge dressing scattered by the track builder: brick shrubs (instance greens), flower clusters (instance colours)
// and studded grey rocks, one instanced draw per kind; items: { shrub: [{x,y,z,sc,yaw}], flower, rock }
function shrubGeo(THREE) {
  const g = new Geo();
  g.obox([0, 0.22, 0], [0.55, 0.22, 0.45], MARK, 0); g.obox([0.08, 0.6, -0.05], [0.4, 0.18, 0.34], MARK, Q); g.obox([-0.05, 0.86, 0.04], [0.22, 0.1, 0.2], MARK, 0);
  return g.build(THREE);
}
function flowerGeo(THREE) {
  const g = new Geo(), stem = hex(PAL.darkGreen);
  for (const [x, z, h] of [[0, 0, 0.42], [0.22, 0.12, 0.34], [-0.18, 0.16, 0.3], [0.06, -0.22, 0.36], [-0.2, -0.12, 0.26]]) {
    g.box([x - 0.025, 0, z - 0.025], [x + 0.025, h, z + 0.025], stem);
    g.box([x - 0.075, h, z - 0.075], [x + 0.075, h + 0.07, z + 0.075], MARK);
  }
  g.obox([0, 0.05, 0], [0.32, 0.05, 0.3], stem, 0);
  return g.build(THREE);
}
function rockGeo(THREE) {
  const g = new Geo(), c = hex(PAL.darkGrey), l = hex(PAL.lightGrey);
  g.obox([0, 0.25, 0], [0.6, 0.25, 0.45], c, 0); g.obox([0.15, 0.6, 0.05], [0.35, 0.15, 0.3], l, Q);
  return g.build(THREE);
}
const FLOWERS = [PAL.red, PAL.yellow, PAL.white, PAL.pink, PAL.orange, PAL.magenta];
export function buildGroundDressing(THREE, items) {
  const out = [], m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), v = new THREE.Vector3(), s = new THREE.Vector3(), col = new THREE.Color();
  for (const [kind, geoFn, colours] of [['shrub', shrubGeo, ['#2F7A3A', PAL.green, '#3E8E3A', PAL.darkGreen]], ['flower', flowerGeo, FLOWERS], ['rock', rockGeo, null]]) {
    const list = items[kind] || [];
    if (!list.length) continue;
    const geo = geoFn(THREE), mesh = new THREE.InstancedMesh(geo, worldMat({ pattern: 'studs', gloss: 0.5, instSlots: !!colours }), list.length);
    list.forEach((p, i) => {
      q.setFromAxisAngle(up, p.yaw);
      m4.compose(v.set(p.x, p.y - 0.04, p.z), q, s.set(p.sc, p.sc * (0.85 + 0.3 * hash(i, 13)), p.sc));
      mesh.setMatrixAt(i, m4);
      if (colours) mesh.setColorAt(i, col.set(colours[Math.floor(hash(i, 17) * colours.length)]));
    });
    mesh.name = 'dress:' + kind; mesh.userData.caster = kind !== 'flower';
    out.push({ mesh, count: list.length, tris: geo.attributes.position.count / 3 * list.length });
  }
  return out;
}

// boards: { pine: [{x,y,z,sc}], oak, magnolia, crowd }; returns [{ mesh, count }] like the billboards did
export function buildBrickFlora(THREE, boards, track, opts = {}) {
  const out = [], m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), v = new THREE.Vector3(), s = new THREE.Vector3(), col = new THREE.Color();
  // every third pine is a spruce and every third oak a maple (by position, so a course always looks the same)
  const split = (from, to) => { const keep = [], moved = []; for (const p of boards[from] || []) (hash(Math.round(p.x * 3 + p.z * 7), 41) < 0.34 ? moved : keep).push(p); return [keep, moved]; };
  const lists = { magnolia: boards.magnolia };
  [lists.oak, lists.maple] = split('oak');
  [lists.pine, lists.spruce] = split('pine');
  for (const kind of ['oak', 'maple', 'magnolia', 'pine', 'spruce']) {
    let list = lists[kind];
    if (!list || !list.length) continue;
    {
      const Tk = TREES[kind], r0 = Math.max(...Tk.layers.map(([x, , z, w]) => Math.hypot(x, z) + w)), kept = [];
      for (const p of list) { const r = r0 * (p.sc || 1); if (kept.every((o) => Math.hypot(o.x - p.x, o.z - p.z) > (r + r0 * (o.sc || 1)) * 0.62)) kept.push(p); }
      list = kept;
    }
    const geo = treeGeo(THREE, kind), T = TREES[kind];
    // canopy footprint radius at scale 1 (turned layers reach out to their corners)
    const reach = Math.max(...T.layers.map(([x, , z, w, , yaw]) => Math.hypot(x, z) + w * (yaw ? Math.SQRT2 : 1)));
    const mesh = new THREE.InstancedMesh(geo, worldMat({ pattern: 'studs', gloss: 0.5, instSlots: true, nearFade: true }), list.length);
    list.forEach((p, i) => {
      const sc = (p.sc || 1) * (0.85 + 0.3 * hash(i, 3));
      // the tree spots were laid out for flat painted cards: a canopy that would reach over the road keeps its height
      // but narrows to end just past the edge (to no less than 45% of its width)
      const L = track.locate(p.x, p.z), c = track.at(L.s), road = track.point(L.s, 0);
      const edge = Math.hypot(p.x - road.x, p.z - road.z) - Math.max(c.wl, c.wr);
      const sxz = Math.min(sc, Math.max(0.45 * sc, (edge + 0.6) / reach));
      q.setFromAxisAngle(up, hash(i, 7) * Math.PI * 2);
      m4.compose(v.set(p.x, p.y - 0.1, p.z), q, s.set(sxz, sc * (0.9 + 0.2 * hash(i, 5)), sxz));
      mesh.setMatrixAt(i, m4);
      mesh.setColorAt(i, col.set(T.greens[Math.floor(hash(i, 11) * T.greens.length)]));
    });
    mesh.name = 'flora:' + kind; mesh.userData.caster = true;
    out.push({ mesh, count: list.length, tris: geo.attributes.position.count / 3 * list.length });
  }
  // crowds: spectators along each board's width, facing the road, behind a barrier
  const crowd = boards.crowd || [];
  if (crowd.length) {
    const per = opts.fansPerBoard || 6, fans = [], barrier = new Geo(), white = hex(PAL.white), blue = hex(PAL.blue);
    crowd.forEach((p, b) => {
      const L = track.locate(p.x, p.z), road = track.point(L.s, 0);
      let dx = road.x - p.x, dz = road.z - p.z; const dl = Math.hypot(dx, dz) || 1; dx /= dl; dz /= dl;
      const tx = dz, tz = -dx, W = 7.5 * (p.sc || 1), yaw = Math.atan2(dx, dz);
      for (let k = 0; k < per; k++) {
        const u = (k + 0.5) / per - 0.5, back = (k % 2) * 0.55 + hash(b * 31 + k, 2) * 0.2;
        fans.push({ x: p.x + tx * u * W - dx * back, y: p.y, z: p.z + tz * u * W - dz * back, yaw: yaw + (hash(b * 31 + k, 4) - 0.5) * 0.5, i: b * 31 + k });
      }
      // barrier: two white rails on blue posts across the front of the board
      const fx = p.x + dx * 0.8, fz = p.z + dz * 0.8;
      // (obox's local x runs along the board when turned by the board's yaw, so the rails join the posts)
      barrier.obox([fx, p.y + 0.95, fz], [W / 2, 0.06, 0.05], white, yaw);
      barrier.obox([fx, p.y + 0.55, fz], [W / 2, 0.05, 0.05], white, yaw);
      for (let k = 0; k <= 3; k++) { const u = k / 3 - 0.5; barrier.obox([fx + tx * u * W, p.y + 0.5, fz + tz * u * W], [0.06, 0.5, 0.06], blue, yaw); }
    });
    const geo = fanGeo(THREE), n = fans.length;
    const skin = new Float32Array(n * 3), phase = new Float32Array(n);
    const mesh = new THREE.InstancedMesh(geo, worldMat({ gloss: 0.55, instSlots: true, cheer: true }), n);
    fans.forEach((f, i) => {
      q.setFromAxisAngle(up, f.yaw);
      m4.compose(v.set(f.x, f.y, f.z), q, s.set(1, 1, 1));
      mesh.setMatrixAt(i, m4);
      mesh.setColorAt(i, col.set(SHIRTS[Math.floor(hash(f.i, 13) * SHIRTS.length)]));
      col.set(SKINS[Math.floor(hash(f.i, 17) * SKINS.length)]); skin.set([col.r, col.g, col.b], i * 3);
      phase[i] = hash(f.i, 19) < 0.55 ? 0.5 + hash(f.i, 23) * 0.5 : hash(f.i, 29) * 0.49;
    });
    geo.setAttribute('iSkin', new THREE.InstancedBufferAttribute(skin, 3));
    geo.setAttribute('iPhase', new THREE.InstancedBufferAttribute(phase, 1));
    mesh.name = 'crowd'; mesh.userData.caster = true;
    out.push({ mesh, count: n, tris: geo.attributes.position.count / 3 * n });
    const bm = new THREE.Mesh(barrier.build(THREE), worldMat({ gloss: 0.7 }));
    bm.name = 'crowd-barriers'; bm.userData.caster = true; bm.matrixAutoUpdate = false;
    out.push({ mesh: bm, count: 1, tris: barrier.count / 3 });
  }
  return out;
}
