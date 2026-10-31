// Builds the static world for a baked track: road, lane paint, curbs and sidewalks, terrain cross-sections,
// barriers and rails, building blocks, merged props and instanced billboards. Geometry is split into chunks
// along the track (≈120 m) per material so the frustum culls what's behind the camera.
// Brick look: every surface is lit per pixel as plastic (brickmat.js); road plates and sidewalks are tiles with
// moulded seams, the ground is a studded baseplate, walls are running-bond bricks, colours snap to the toy palette.
import { Geo, hex, mul, mix } from './geom.js';
import { billboardMat } from './n64mat.js';
import { worldMat, PAL, snapPal } from './brickmat.js';
import { tex, hasArt } from './textures.js';
import { VERGE, LIMIT } from '../sim/track.js';
import { buildProp, PROP_KIND } from './props.js';
import { buildBrickFlora, buildGroundDressing } from './bricktrees.js';

const CHUNK = 60; // samples per chunk
const SURF_TEX = ['asphalt', 'brick', 'concrete', 'dirt', 'dirt', 'concrete'];
// road surfaces as toy plates: colour, tile size (m) and pattern; dirt reads as a studded tan plate
const SURF = {
  asphalt: { col: '#55585A', tile: 8.96, pattern: 'grain', gloss: 0.32 }, // a fine grain, no seams (plate seams read as cracks across the lanes)
  brick: { col: PAL.reddishBrown, tile: 0.56, pattern: 'tiles', gloss: 0.2 }, // 2 × 2 tiles
  concrete: { col: PAL.lightGrey, tile: 1.12, pattern: 'tiles', gloss: 0.2 }, // 4 × 4 tiles
  dirt: { col: '#B97A4A', tile: 1.12, pattern: 'tiles', gloss: 0.2 }, // Ouachita clay: smooth tiles, studs stay off the road
};
const SURF_TINT = [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1], [0.8, 0.9, 1], [0.95, 0.95, 0.95]];

function hash(i, s = 0) { let h = (i * 374761393 + s * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

export function buildTrackWorld(THREE, track, env = {}) {
  const group = new THREE.Group();
  group.name = 'world';
  const n = track.n, step = track.step, a = track.a;
  const nChunks = Math.ceil(n / CHUNK);
  // material buckets: key → { mat, geos[chunk] }
  const buckets = {};
  const bucket = (key, makeMat) => {
    if (!buckets[key]) buckets[key] = { mat: makeMat(), geos: [] };
    return buckets[key];
  };
  const geoFor = (key, makeMat, chunk) => {
    const b = bucket(key, makeMat);
    if (!b.geos[chunk]) b.geos[chunk] = new Geo();
    return b.geos[chunk];
  };
  const frameAt = (i) => track.at(i * step);
  const P = (c, d, dy = 0) => [c.x - c.tz * d, track.heightAt(c, d) + dy, c.z + c.tx * d];
  const PF = (c, d, y) => [c.x - c.tz * d, y, c.z + c.tx * d];

  const pal = env.colors || {};
  const forest = env.groundTex === 'forest-floor';
  const grassCol = hex(snapPal(pal.grass || (forest ? PAL.darkGreen : PAL.green))), grassDark = hex(snapPal(pal.grassDark || (forest ? PAL.olive : PAL.darkGreen)));
  const rockCol = hex(snapPal(pal.rock || PAL.darkGrey)), sideCol = hex(snapPal(pal.sidewalk || PAL.tan));
  const curbCol = hex(snapPal(pal.curb || PAL.white)), wallCol = hex(snapPal(pal.wall || (env.wallTex === 'rock' ? PAL.darkGrey : PAL.lightGrey)));
  const mat = (o) => worldMat(o);
  // how far side terrain may reach before it lands on another stretch of this road (the bake only checks legs
  // more than 70 m away along the course, so the two legs of a tight hairpin could overlap): step outward from
  // the edge and stop short of the first point whose nearest road is elsewhere and within its width
  const safe = [new Float32Array(n).fill(-1), new Float32Array(n).fill(-1)];
  const safeReach = (i, side) => {
    const k = side > 0 ? 1 : 0;
    if (safe[k][i] >= 0) return safe[k][i];
    const c = frameAt(i), w = side > 0 ? c.wr : c.wl;
    let ok = 60;
    let prev = 0;
    for (const o of [1.5, 3, 5, 8, 12, 17, 24, 33, 45, 60]) {
      const p = track.point(i * step, side * (w + o)), L = track.locate(p.x, p.z);
      let ds = Math.abs(L.s - i * step); ds = Math.min(ds, track.length - ds);
      if (ds > 20) { const cc = track.at(L.s), ww = L.d >= 0 ? cc.wr : cc.wl; if (Math.abs(L.d) < ww + 3) { ok = prev; break; } }
      prev = o;
    }
    return (safe[k][i] = ok);
  };

  // verge dressing collected while the terrain is built (half as dense on Low)
  const dress = { shrub: [], flower: [], rock: [] }, dressEvery = (env.boards ?? 1) < 1 ? 4 : 2;
  for (let i = 0; i < n; i++) {
    const j = track.wrap(i + 1);
    if (!track.closed && j === i) break;
    const ch = Math.floor(i / CHUNK);
    const c0 = frameAt(i), c1 = j === 0 ? track.at(track.length - 1e-6) : frameAt(j);
    const s0 = i * step, s1 = s0 + step;
    // --- road: 4 lateral strips
    const sf = a.surf ? a.surf[i] : 0;
    const texName = SURF_TEX[sf] || 'asphalt', SF = SURF[texName];
    const uScale = sf === 1 ? 2.5 : 5; // metres per uv unit
    const road = geoFor('road:' + texName, () => mat({ pattern: SF.pattern, uvScale: uScale, tile: SF.tile, gloss: SF.gloss }), ch);
    const tint = SURF_TINT[sf] || [1, 1, 1], rc = hex(SF.col);
    const ds0 = [-c0.wl, -c0.wl / 2, 0, c0.wr / 2, c0.wr], ds1 = [-c1.wl, -c1.wl / 2, 0, c1.wr / 2, c1.wr];
    for (let k = 0; k < 4; k++) {
      const v = () => [rc[0] * tint[0], rc[1] * tint[1], rc[2] * tint[2]];
      road.quad(P(c0, ds0[k]), P(c0, ds0[k + 1]), P(c1, ds1[k + 1]), P(c1, ds1[k]), null,
        [[ds0[k] / uScale, s0 / uScale], [ds0[k + 1] / uScale, s0 / uScale], [ds1[k + 1] / uScale, s1 / uScale], [ds1[k] / uScale, s1 / uScale]],
        [v(1), v(2), v(3), v(4)]);
    }
    // --- lane paint on asphalt: dashed centre, solid edges
    if (sf === 0 && c0.wl + c0.wr > 9) {
      const paint = geoFor('paint', () => mat({ gloss: 0.6 }), ch);
      if (Math.floor(s0 / 4) % 2 === 0) {
        const yel = hex(PAL.yellow);
        paint.quad(P(c0, -0.12, 0.02), P(c0, 0.12, 0.02), P(c1, 0.12, 0.02), P(c1, -0.12, 0.02), yel);
      }
      const wht = hex(PAL.white);
      paint.quad(P(c0, -c0.wl + 0.4, 0.02), P(c0, -c0.wl + 0.6, 0.02), P(c1, -c1.wl + 0.6, 0.02), P(c1, -c1.wl + 0.4, 0.02), wht);
      paint.quad(P(c0, c0.wr - 0.6, 0.02), P(c0, c0.wr - 0.4, 0.02), P(c1, c1.wr - 0.4, 0.02), P(c1, c1.wr - 0.6, 0.02), wht);
    }
    // start line: checker band at s≈0
    if (i === 0 && !env.noStartLine) {
      const paint = geoFor('paint', () => mat({ gloss: 0.6 }), ch);
      const cells = 10;
      for (let q = 0; q < cells; q++) for (let r = 0; r < 2; r++) {
        const d0 = -c0.wl + ((c0.wl + c0.wr) * q) / cells, d1 = -c0.wl + ((c0.wl + c0.wr) * (q + 1)) / cells;
        const col = (q + r) % 2 ? hex(PAL.white) : hex(PAL.black);
        const cA = track.at(r * 1.0), cB = track.at(r * 1.0 + 1.0);
        paint.quad(P(cA, d0, 0.03), P(cA, d1, 0.03), P(cB, d1, 0.03), P(cB, d0, 0.03), col);
      }
    }
    // --- verges, terrain, limits per side
    for (const side of [-1, 1]) {
      const w0 = side > 0 ? c0.wr : c0.wl, w1 = side > 0 ? c1.wr : c1.wl;
      const verge = side > 0 ? a.vr[i] : a.vl[i];
      const lim0 = side > 0 ? c0.limR : c0.limL, lim1 = side > 0 ? c1.limR : c1.limL;
      const limType = side > 0 ? a.tr[i] : a.tl[i];
      const ord = (A, B, C, D, col, uv, cols) => (side > 0 ? geo.quad(A, B, C, D, col, uv, cols) : geo.quad(B, A, D, C, col, uv && [uv[1], uv[0], uv[3], uv[2]], cols && [cols[1], cols[0], cols[3], cols[2]]));
      let geo;
      let edge0 = w0, edge1 = w1;
      if (verge === VERGE.CURB) {
        // curb face then a flat sidewalk band 4.5 m wide
        const yr0 = track.heightAt(c0, side * w0), yr1 = track.heightAt(c1, side * w1);
        geo = geoFor('curb', () => mat({ gloss: 0.5 }), ch);
        ord(PF(c0, side * w0, yr0), PF(c0, side * w0, yr0 + 0.16), PF(c1, side * w1, yr1 + 0.16), PF(c1, side * w1, yr1), curbCol);
        geo = geoFor('sidewalk', () => mat({ pattern: 'tiles', uvScale: 2.5, tile: 0.56, gloss: 0.25 }), ch);
        const sw = 4.5;
        ord(PF(c0, side * w0, yr0 + 0.16), PF(c0, side * (w0 + sw), yr0 + 0.16), PF(c1, side * (w1 + sw), yr1 + 0.16), PF(c1, side * w1, yr1 + 0.16), null,
          [[0, s0 / 2.5], [sw / 2.5, s0 / 2.5], [sw / 2.5, s1 / 2.5], [0, s1 / 2.5]], [sideCol, sideCol, sideCol, sideCol]);
        edge0 = w0 + sw; edge1 = w1 + sw;
      }
      // terrain from the edge out to 60 m along the cross-section offsets
      const offs = [0, ...track.xsOff];
      const baked = a.reachL ? Math.min(side > 0 ? a.reachR[i] : a.reachL[i], side > 0 ? a.reachR[j] : a.reachL[j]) : 60;
      const reach = Math.min(baked, safeReach(i, side), safeReach(j, side));
      geo = geoFor('terrain', () => mat({ pattern: 'studs', gloss: 0.45 }), ch);
      for (let m = 0; m < offs.length - 1; m++) {
        const oA = Math.max(offs[m], 0), oB = Math.min(offs[m + 1], Math.max(reach, (verge === VERGE.CURB ? 4.6 : 2)));
        if (oB <= oA + 0.01) break;
        if (w0 + oB <= edge0 + 0.01) continue;
        const dA0 = side * Math.max(w0 + oA, edge0), dB0 = side * (w0 + oB), dA1 = side * Math.max(w1 + oA, edge1), dB1 = side * (w1 + oB);
        const yA0 = verge === VERGE.CURB && Math.abs(dA0) <= edge0 + 0.01 ? track.heightAt(c0, side * w0) + 0.16 : track.heightAt(c0, dA0);
        const yA1 = verge === VERGE.CURB && Math.abs(dA1) <= edge1 + 0.01 ? track.heightAt(c1, side * w1) + 0.16 : track.heightAt(c1, dA1);
        const yB0 = track.heightAt(c0, dB0), yB1 = track.heightAt(c1, dB1);
        const steep = Math.abs(yB0 - yA0) / Math.max(1, Math.abs(dB0 - dA0));
        // verge dressing on gentle grass a few metres past the edge: shrubs, flower clusters and rocks
        if (m === 0 && steep < 0.35 && reach > 6 && i % (dressEvery) === 0) {
          for (let r = 0; r < 2; r++) {
            const hh = hash(i * 4 + r * 2 + (side > 0 ? 1 : 0), 31), d = side * (Math.max(w0, edge0) + 1.8 + r * 4 + hh * Math.min(reach - 6, 6)), kind = hh < 0.5 ? 'shrub' : hh < 0.82 ? 'flower' : 'rock';
            dress[kind].push({ x: c0.x - c0.tz * d, y: track.heightAt(c0, d), z: c0.z + c0.tx * d, sc: kind === 'flower' ? 1.2 : 1.0 + hash(i * 2 + r, 33) * 0.9, yaw: hash(i * 2 + r, 35) * Math.PI * 2 });
          }
        }
        // whole-plate colour patches (no per-vertex noise: toy plates are one colour)
        const base = steep > 0.7 ? rockCol : hash(Math.floor(i / 6), m) < 0.22 ? grassDark : grassCol;
        const cA = base, cB = base;
        ord(PF(c0, dA0, yA0), PF(c0, dB0, yB0), PF(c1, dB1, yB1), PF(c1, dA1, yA1), null,
          [[dA0 / 8, s0 / 8], [dB0 / 8, s0 / 8], [dB1 / 8, s1 / 8], [dA1 / 8, s1 / 8]], [cA, cA, cB, cB]);
      }
      // limits: barrier walls (where no building sits right behind) or guard rails
      if (limType === LIMIT.WALL && !env.noWalls) {
        geo = geoFor('wall', () => mat({ pattern: 'bricks', uvScale: 3, tile: 1.12, gloss: 0.45 }), ch);
        const h = env.wallH ?? (env.wallTex === 'rock' ? 3.2 : 0.9);
        const yb0 = track.heightAt(c0, side * lim0) - 0.3, yb1 = track.heightAt(c1, side * lim1) - 0.3;
        const inner0 = side * (lim0 + 0.15), inner1 = side * (lim1 + 0.15), outer0 = side * (lim0 + 0.6), outer1 = side * (lim1 + 0.6);
        ord(PF(c1, inner1, yb1), PF(c0, inner0, yb0), PF(c0, inner0, yb0 + h + 0.3), PF(c1, inner1, yb1 + h + 0.3), wallCol, [[s1 / 3, 0], [s0 / 3, 0], [s0 / 3, 0.4], [s1 / 3, 0.4]]);
        ord(PF(c0, inner0, yb0 + h + 0.3), PF(c0, outer0, yb0 + h + 0.3), PF(c1, outer1, yb1 + h + 0.3), PF(c1, inner1, yb1 + h + 0.3), mul(wallCol, 1.08), [[0, 0], [0.2, 0], [0.2, 0.2], [0, 0.2]]);
      } else if (limType === LIMIT.RAIL) {
        geo = geoFor('rail', () => mat({ gloss: 0.7 }), ch);
        const y0 = track.heightAt(c0, side * lim0), y1 = track.heightAt(c1, side * lim1);
        const steel = hex(PAL.lightGrey);
        ord(PF(c1, side * (lim1 + 0.2), y1 + 0.5), PF(c0, side * (lim0 + 0.2), y0 + 0.5), PF(c0, side * (lim0 + 0.2), y0 + 0.85), PF(c1, side * (lim1 + 0.2), y1 + 0.85), steel);
        if (i % 2 === 0) {
          const pc = P(c0, side * (lim0 + 0.3));
          geo.box([pc[0] - 0.08, y0 - 0.2, pc[2] - 0.08], [pc[0] + 0.08, y0 + 0.8, pc[2] + 0.08], hex(PAL.reddishBrown));
        }
      }
    }
  }
  // --- buildings
  const NEON = ['#FF4FA3', '#4FE3FF', '#FFE14F', '#7CFF6B', '#FF8A3D'].map(hex);
  for (const b of track.json.buildings || []) {
    const ch = Math.floor(nearestSample(track, b.fp[0][0], b.fp[0][1]) / CHUNK);
    buildBlock(geoFor, ch, b, mat, env.kit);
    if (env.neon && b.style !== 'bathhouse') {
      // a glowing band across the front at shop-sign height (generic colour strips; no lettering or logos)
      const geo = geoFor('neon', () => worldMat({ emissive: true }), ch);
      const fi = b.front ?? 0, A = b.fp[fi], B = b.fp[(fi + 1) % b.fp.length];
      const len = Math.hypot(B[0] - A[0], B[1] - A[1]);
      if (len > 4) {
        const nx = -(B[1] - A[1]) / len * 0.08, nz = (B[0] - A[0]) / len * 0.08, y = b.base + 4.2, col = NEON[Math.floor(hash(Math.round(A[0] * 5 + A[1]), 4) * NEON.length)];
        const lo = mul(col, 0.62), hi = mul(col, 0.92);
        geo.quad([A[0] + nx, y, A[1] + nz], [B[0] + nx, y, B[1] + nz], [B[0] + nx, y + 0.45, B[1] + nz], [A[0] + nx, y + 0.45, A[1] + nz], null, null, [lo, lo, hi, hi]);
      }
    }
  }
  // --- props merged into chunks; billboards collected for instancing
  const boards = {}, night = env.time === 'dusk' || env.time === 'sunset', pools = [];
  for (const p of track.json.props || []) {
    const kind = PROP_KIND[p.type] || 'mesh';
    const sp = track.locate(p.x, p.z, p.s);
    const y = track.heightAt(track.at(sp.s), sp.d) + (Math.abs(sp.d) > track.at(sp.s).wl ? 0 : 0);
    if (kind === 'board') {
      if ((env.boards ?? 1) < 1 && hash(Math.round(p.x * 7 + p.z * 3), 9) > env.boards) continue; // Low tier thins the billboards
      (boards[p.type] ||= []).push({ x: p.x, y, z: p.z, sc: p.sc || 1, yaw: p.yaw });
    } else {
      const ch = Math.floor(sp.s / step / CHUNK);
      const glow = night && p.type === 'lamp' ? geoFor('glow', () => worldMat({ emissive: true, shadows: false }), ch) : null;
      buildProp(p.type, geoFor('props', () => mat({ gloss: 0.65 }), ch), [p.x, y, p.z], p.yaw, p.sc || 1, glow);
      if (glow) pools.push([p.x, y, p.z]);
    }
  }
  // creek fords (the sim's refill zones): a shallow sheet of clear blue tiles across the road and 1.5 m past each
  // edge, with studded grey stepping stones along both banks
  for (const zn of (track.zones || []).filter((z) => z.type === 'ford')) {
    const ch = Math.min(nChunks - 1, Math.floor(zn.s0 / step / CHUNK));
    const water = geoFor('ford', () => worldMat({ pattern: 'tiles', uvScale: 1, tile: 0.56, gloss: 0.95, transparent: true, alpha: 0.5, depthWrite: false }), ch);
    const rocks = geoFor('rocks', () => mat({ pattern: 'studs', gloss: 0.4 }), ch), blue = hex('#3D9BE0'), grey = hex(PAL.darkGrey);
    for (let s0 = zn.s0; s0 < zn.s1 - 0.01; s0 += 1) {
      const s1 = Math.min(zn.s1, s0 + 1), c0 = track.at(s0), c1 = track.at(s1), n = 6;
      const L0 = -(c0.wl + 1.5), R0 = c0.wr + 1.5, L1 = -(c1.wl + 1.5), R1 = c1.wr + 1.5;
      for (let k = 0; k < n; k++) {
        const a0 = L0 + ((R0 - L0) * k) / n, b0 = L0 + ((R0 - L0) * (k + 1)) / n, a1 = L1 + ((R1 - L1) * k) / n, b1 = L1 + ((R1 - L1) * (k + 1)) / n;
        water.quad(P(c0, a0, 0.08), P(c0, b0, 0.08), P(c1, b1, 0.08), P(c1, a1, 0.08), blue, [[a0, s0], [b0, s0], [b1, s1], [a1, s1]]);
      }
    }
    for (let s0 = zn.s0 - 2; s0 <= zn.s1 + 2; s0 += 2.2) for (const side of [-1, 1]) {
      const c = track.at(s0), d = side * ((side > 0 ? c.wr : c.wl) + 2.2 + hash(Math.round(s0 * 10), side + 3) * 1.2);
      const h = 0.25 + hash(Math.round(s0 * 10), side + 7) * 0.35, w = 0.35 + hash(Math.round(s0 * 10), side + 9) * 0.35, q = P(c, d, 0);
      rocks.obox([q[0], q[1] + h - 0.1, q[2]], [w, h, w * 0.8], grey, hash(Math.round(s0 * 10), side + 11) * Math.PI);
    }
  }
  // upload
  let tris = 0, draws = 0;
  for (const [key, b] of Object.entries(buckets)) {
    b.geos.forEach((g, ci) => {
      if (!g || !g.count) return;
      if (/^(road:|terrain|sidewalk)/.test(key)) g.smooth();
      const mesh = new THREE.Mesh(g.build(THREE), b.mat);
      mesh.name = `${key}#${ci}`;
      mesh.userData.caster = /^(bldg|kitwall|facade:|props|wall|rail|rocks)/.test(key);
      mesh.matrixAutoUpdate = false;
      group.add(mesh);
      tris += g.count / 3; draws++;
    });
  }
  if (pools.length) { const m = lightPools(THREE, pools, track); group.add(m); draws++; tris += pools.length * 2; }
  // trees and crowds: brick-built and instanced (the painted billboards remain only for kinds without a model)
  const flora = buildBrickFlora(THREE, boards, track, { fansPerBoard: env.boards < 1 ? 4 : 6 }).concat(buildGroundDressing(THREE, dress));
  flora.forEach((m) => { group.add(m.mesh); tris += m.tris; draws++; });
  const rest = Object.fromEntries(Object.entries(boards).filter(([k]) => !['oak', 'magnolia', 'pine', 'crowd'].includes(k)));
  const bb = buildBillboards(THREE, rest);
  bb.forEach((m) => { group.add(m.mesh); tris += m.count * 2; draws++; });
  group.userData = { tris, draws, chunks: nChunks };
  return group;
}

// warm light pools under the lamps after dark: additive soft discs laid on the ground
function lightPools(THREE, list) {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,214,140,0.5)'); gr.addColorStop(0.5, 'rgba(255,190,110,0.24)'); gr.addColorStop(1, 'rgba(255,170,90,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
  const pos = [], uv = [], R = 6.5; // wide enough to reach the near lane from the sidewalk
  for (const [px, py, pz] of list) {
    const y = py + 0.08, q = [[px - R, pz - R, 0, 0], [px + R, pz - R, 1, 0], [px + R, pz + R, 1, 1], [px - R, pz + R, 0, 1]];
    for (const k of [0, 2, 1, 0, 3, 2]) { pos.push(q[k][0], y, q[k][1]); uv.push(q[k][2], q[k][3]); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeBoundingSphere();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace;
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.name = 'lightpools'; m.renderOrder = 2;
  return m;
}

function nearestSample(track, x, z) { return Math.floor(track.locate(x, z).s / track.step); }

// Building: extruded footprint polygon (any number of corners, wound so each edge's right side is outside);
// the front edge (b.front) takes the facade texture. Roof: flat (ear-clipped) with a parapet colour, or a
// shallow hip on four-cornered bathhouses. With `kit` (Medium and High), commercial blocks are built instead of
// painted: brick walls, framed windows and striped shop awnings (buildFacadeKit).
function buildBlock(geoFor, ch, b, mat, kit) {
  const style = b.style || 'store';
  const facadeTex = facadeFor(b, style);
  if (kit && style !== 'bathhouse' && facadeTex.startsWith('store')) return buildFacadeKit(geoFor, ch, b, mat);
  // the facade painting reads as a printed brick wall: bond seams over the print
  const front = geoFor('facade:' + facadeTex, () => mat({ map: tex(facadeTex), pattern: 'bricks', uvScale: 5, tile: 1.12, patAmt: 0.55, gloss: 0.4 }), ch);
  const plain = geoFor('bldg', () => mat({ pattern: 'studs', gloss: 0.45 }), ch);
  const fp = b.fp, y0 = b.base, y1 = b.base + b.h, n = fp.length;
  const hsh = hash(Math.round(fp[0][0] * 7 + fp[0][1] * 13), 1);
  const painted = facadeTex !== 'storefront' && facadeTex !== 'fordyce-bay' || style === 'bathhouse';
  const wallC = hex(style === 'bathhouse' ? PAL.tan : hsh < 0.5 ? PAL.nougat : PAL.tan);
  const roofC = style === 'bathhouse' ? hex(PAL.reddishBrown) : hex(hsh < 0.5 ? PAL.darkGrey : PAL.lightGrey);
  const fi = b.front ?? 0;
  for (let e = 0; e < n; e++) {
    const A = fp[e], B = fp[(e + 1) % n];
    const len = Math.hypot(B[0] - A[0], B[1] - A[1]);
    const isFront = e === fi && len > 3;
    const uv = [[0, 0], [len / 5, 0], [len / 5, b.h / 5], [0, b.h / 5]];
    const base = painted ? [1, 1, 1] : mix([1, 1, 1], wallC, 0.35);
    // darker at the foot of the wall: occlusion where the building meets the ground
    const wc = isFront ? base : mul(base, 0.78), foot = mul(wc, 0.62), ym = Math.min(y1, y0 + 1.2), vm = (ym - y0) / 5;
    front.quad([A[0], y0, A[1]], [B[0], y0, B[1]], [B[0], ym, B[1]], [A[0], ym, A[1]], null, [[0, 0], [len / 5, 0], [len / 5, vm], [0, vm]], [foot, foot, wc, wc]);
    if (y1 > ym) front.quad([A[0], ym, A[1]], [B[0], ym, B[1]], [B[0], y1, B[1]], [A[0], y1, A[1]], wc, [[0, vm], [len / 5, vm], [len / 5, b.h / 5], [0, b.h / 5]]);
  }
  // relief in light trim bricks: a projecting cornice at the roof line, a string course at every storey (5 m, the
  // facade print's repeat) and a quoin at each corner, so the walls throw shadows and break their silhouette
  const trimC = hex(style === 'bathhouse' ? PAL.white : hsh < 0.5 ? PAL.tan : PAL.lightGrey);
  for (let e = 0; e < n; e++) {
    const A = fp[e], B = fp[(e + 1) % n], len = Math.hypot(B[0] - A[0], B[1] - A[1]);
    if (len < 3) continue;
    const dx = (B[0] - A[0]) / len, dz = (B[1] - A[1]) / len, nx = -dz, nz = dx, yaw = Math.atan2(-dz, dx);
    const band = (y, hh, p) => plain.obox([(A[0] + B[0]) / 2 + nx * p / 2, y, (A[1] + B[1]) / 2 + nz * p / 2], [len / 2 + p / 2, hh, p / 2], trimC, yaw);
    band(y1 - 0.22, 0.22, 0.42);
    for (let y = y0 + 5; y < y1 - 1.5; y += 5) band(y, 0.08, 0.16);
    plain.obox([A[0] + nx * 0.07 + dx * 0.3, (y0 + y1) / 2, A[1] + nz * 0.07 + dz * 0.3], [0.3, (y1 - y0) / 2, 0.07], trimC, yaw);
  }
  if (style === 'bathhouse' && n === 4) {
    const cx = fp.reduce((s, p) => s + p[0], 0) / 4, cz = fp.reduce((s, p) => s + p[1], 0) / 4;
    const peak = [cx, y1 + Math.min(4, b.h * 0.3), cz];
    for (let e = 0; e < 4; e++) { const A = fp[e], B = fp[(e + 1) % 4]; plain.tri([A[0], y1, A[1]], [B[0], y1, B[1]], peak, roofC); }
    return;
  }
  for (const [i, j, k] of earClip(fp)) plain.tri([fp[i][0], y1, fp[i][1]], [fp[k][0], y1, fp[k][1]], [fp[j][0], y1, fp[j][1]], roofC);
}

// A commercial block built from parts instead of a painted front: running-bond brick walls in one of five brick
// colours, a shop storey (4.2 m) of wide shop windows under striped slope awnings, and upper storeys (3.6 m) of
// framed windows. Every window is dark glass set back behind a projecting sill, lintel and jambs, so it reads
// recessed and throws a little shadow; the trim and glass skip the sun-shadow pass (walls, cornice and string
// courses cast).
const KIT_WALLS = ['#A3523A', '#82422A', '#B86B4B', '#D09168', '#E4CD9E'], KIT_AWN = ['#C91A09', '#237841', '#0055BF', '#FE8A18', '#81007B'];
function buildFacadeKit(geoFor, ch, b, mat) {
  const wall = geoFor('kitwall', () => mat({ pattern: 'bricks', uvScale: 1, tile: 1.12, patAmt: 0.85, gloss: 0.4 }), ch);
  const trim = geoFor('kittrim', () => mat({ pattern: 'studs', gloss: 0.5 }), ch);
  const glass = geoFor('kitglass', () => mat({ gloss: 0.95 }), ch);
  const plain = geoFor('bldg', () => mat({ pattern: 'studs', gloss: 0.45 }), ch);
  const fp = b.fp, y0 = b.base, y1 = b.base + b.h, n = fp.length, hsh = hash(Math.round(fp[0][0] * 7 + fp[0][1] * 13), 1);
  const wc = hex(KIT_WALLS[Math.floor(hsh * KIT_WALLS.length)]), trimC = hex(hsh < 0.5 ? PAL.tan : PAL.white);
  const awn = hex(KIT_AWN[Math.floor(hash(Math.round(fp[0][0] * 3), 5) * KIT_AWN.length)]), white = hex(PAL.white), under = mul(awn, 0.55);
  const glassC = hex('#22364A'), shopC = hex('#2E4A5E'), roofC = hex(hsh < 0.5 ? PAL.darkGrey : PAL.lightGrey);
  const shopTop = Math.min(y1 - 0.5, y0 + 4.2), storeys = [];
  for (let y = shopTop; y + 3.0 <= y1 - 0.6; y += 3.6) storeys.push(y);
  for (let e = 0; e < n; e++) {
    const A = fp[e], B = fp[(e + 1) % n], len = Math.hypot(B[0] - A[0], B[1] - A[1]);
    if (len < 0.01) continue;
    const dx = (B[0] - A[0]) / len, dz = (B[1] - A[1]) / len, nx = -dz, nz = dx, yaw = Math.atan2(-dz, dx);
    const P = (t, y, o) => [A[0] + dx * t + nx * o, y, A[1] + dz * t + nz * o];
    const box = (t, y, o, hx, hy, hz, col, g = trim) => g.obox(P(t, y, o), [hx, hy, hz], col, yaw);
    // wall, darker over its foot; u in metres along the wall for the brick bond
    const side = e === (b.front ?? 0) ? wc : mul(wc, 0.86), foot = mul(side, 0.62), ym = Math.min(y1, y0 + 1.2);
    wall.quad(P(0, y0, 0), P(len, y0, 0), P(len, ym, 0), P(0, ym, 0), null, [[0, 0], [len, 0], [len, 1], [0, 1]], [foot, foot, side, side]);
    if (y1 > ym) wall.quad(P(0, ym, 0), P(len, ym, 0), P(len, y1, 0), P(0, y1, 0), side, [[0, 0], [len, 0], [len, 1], [0, 1]]);
    if (len < 3) continue;
    const nb = Math.max(1, Math.floor((len - 1) / 3.2)), bw = len / nb;
    for (let k = 0; k < nb; k++) {
      const t = (k + 0.5) * bw;
      // shop storey: a wide window with a centre mullion under a striped slope awning
      if (shopTop - y0 >= 3) {
        const w = bw * 0.68, yb = y0 + 0.55, yt = y0 + 2.75;
        glass.quad(P(t - w / 2, yb, 0.03), P(t + w / 2, yb, 0.03), P(t + w / 2, yt, 0.03), P(t - w / 2, yt, 0.03), shopC);
        box(t, yb - 0.08, 0.1, w / 2 + 0.12, 0.08, 0.1, trimC);
        for (const s of [-1, 1]) box(t + s * (w / 2 + 0.06), (yb + yt) / 2, 0.06, 0.06, (yt - yb) / 2, 0.06, trimC);
        box(t, (yb + yt) / 2, 0.05, 0.035, (yt - yb) / 2, 0.035, trimC);
        const ya = y0 + 3.25, t0 = t - bw * 0.45, strips = 4;
        for (let i = 0; i < strips; i++) {
          const a = t0 + (bw * 0.9 * i) / strips, c = t0 + (bw * 0.9 * (i + 1)) / strips, col = i % 2 ? white : awn;
          trim.quad(P(a, ya, 0.02), P(a, ya - 0.45, 0.95), P(c, ya - 0.45, 0.95), P(c, ya, 0.02), col);
          trim.quad(P(c, ya, 0.02), P(c, ya - 0.45, 0.95), P(a, ya - 0.45, 0.95), P(a, ya, 0.02), under);
          trim.quad(P(a, ya - 0.68, 0.95), P(c, ya - 0.68, 0.95), P(c, ya - 0.45, 0.95), P(a, ya - 0.45, 0.95), col);
        }
      }
      // upper storeys: a framed window per bay
      for (const ys of storeys) {
        const w = Math.min(1.3, bw * 0.5), yb = ys + 0.75, yt = ys + 2.55;
        glass.quad(P(t - w / 2, yb, 0.03), P(t + w / 2, yb, 0.03), P(t + w / 2, yt, 0.03), P(t - w / 2, yt, 0.03), glassC);
        box(t, yb - 0.07, 0.11, w / 2 + 0.14, 0.07, 0.11, trimC);
        box(t, yt + 0.09, 0.07, w / 2 + 0.1, 0.09, 0.07, trimC);
        for (const s of [-1, 1]) box(t + s * (w / 2 + 0.05), (yb + yt) / 2, 0.05, 0.05, (yt - yb) / 2, 0.05, trimC);
      }
    }
    // cornice at the roof line, a string course over each storey, and a corner quoin (these cast)
    box(len / 2, y1 - 0.22, 0.21, len / 2 + 0.21, 0.22, 0.21, trimC, plain);
    for (const ys of [shopTop, ...storeys.slice(1)]) if (ys < y1 - 1) box(len / 2, ys, 0.08, len / 2 + 0.08, 0.08, 0.08, trimC, plain);
    box(0.3, (y0 + y1) / 2, 0.07, 0.3, (y1 - y0) / 2, 0.07, trimC, plain);
  }
  for (const [i, j, k] of earClip(fp)) plain.tri([fp[i][0], y1, fp[i][1]], [fp[k][0], y1, fp[k][1]], [fp[j][0], y1, fp[j][1]], roofC);
}

// facade texture by building name (the Row and the Arlington have their own paintings), else a storefront
const NAMED = [['superior', 'superior-bay'], ['hale', 'hale-bay'], ['maurice', 'maurice-bay'], ['fordyce', 'fordyce-bay'], ['quapaw', 'quapaw-bay'],
  ['ozark', 'ozark-bay'], ['buckstaff', 'buckstaff-bay'], ['lamar', 'lamar-bay'], ['administration', 'admin-bay'], ['arlington', 'arlington-bay']];
function facadeFor(b, style) {
  const nm = (b.name || '').toLowerCase();
  for (const [key, t] of NAMED) if (nm.includes(key) && hasArt(t)) return t;
  if (style === 'bathhouse') return 'fordyce-bay';
  const stores = ['store-a', 'store-b', 'store-c'].filter(hasArt);
  if (!stores.length) return 'storefront';
  return stores[Math.floor(hash(Math.round(b.fp[0][0] * 3 + b.fp[0][1] * 5), 2) * stores.length)];
}

// ear clipping for a simple polygon in (x, z); returns index triples
function earClip(fp) {
  const n = fp.length, idx = [...Array(n).keys()], out = [];
  let area = 0;
  for (let i = 0; i < n; i++) { const [x1, z1] = fp[i], [x2, z2] = fp[(i + 1) % n]; area += x1 * z2 - x2 * z1; }
  const sgn = Math.sign(area) || 1;
  const cross = (a, b, c) => ((fp[b][0] - fp[a][0]) * (fp[c][1] - fp[a][1]) - (fp[b][1] - fp[a][1]) * (fp[c][0] - fp[a][0])) * sgn;
  const inside = (p, a, b, c) => cross(a, b, p) >= 0 && cross(b, c, p) >= 0 && cross(c, a, p) >= 0;
  let guard = 0;
  while (idx.length > 3 && guard++ < 500) {
    let clipped = false;
    for (let k = 0; k < idx.length; k++) {
      const a = idx[(k + idx.length - 1) % idx.length], b = idx[k], c = idx[(k + 1) % idx.length];
      if (cross(a, b, c) <= 1e-9) continue;
      if (idx.some((p) => p !== a && p !== b && p !== c && inside(p, a, b, c))) continue;
      out.push([a, b, c]); idx.splice(k, 1); clipped = true; break;
    }
    if (!clipped) break;
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]]);
  return out;
}

const BOARD = {
  pine: { tex: 'pine', w: 5.5, h: 13, tint: [1, 1, 1], sway: 0.02 },
  oak: { tex: 'oak', w: 8, h: 8.5, tint: [1, 1, 1], sway: 0.02 },
  magnolia: { tex: 'oak', w: 5.2, h: 6.8, tint: [0.62, 0.78, 0.66], sway: 0.015 },
  crowd: { tex: 'crowd', w: 7.5, h: 3.4, tint: [1, 1, 1], sway: 0.05 },
};

function buildBillboards(THREE, boards) {
  const out = [];
  for (const [type, list] of Object.entries(boards)) {
    const B = BOARD[type];
    if (!B || !list.length) continue;
    const quad = new THREE.InstancedBufferGeometry();
    quad.setAttribute('position', new THREE.Float32BufferAttribute([-0.5, 0, 0, 0.5, 0, 0, 0.5, 1, 0, -0.5, 1, 0], 3));
    quad.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
    quad.setIndex([0, 1, 2, 0, 2, 3]);
    const pos = new Float32Array(list.length * 3), size = new Float32Array(list.length * 2), frame = new Float32Array(list.length * 4), tint = new Float32Array(list.length * 3);
    list.forEach((p, i) => {
      pos.set([p.x, p.y - 0.2, p.z], i * 3);
      size.set([B.w * p.sc, B.h * p.sc], i * 2);
      // half the instances mirrored, so rows of identical trees and crowds don't read as stamps
      frame.set(hash(i, 11) < 0.5 ? [1, 0, 0, 1] : [0, 0, 1, 1], i * 4);
      const v = 0.82 + 0.18 * hash(i, 5);
      tint.set([B.tint[0] * v, B.tint[1] * v, B.tint[2] * v], i * 3);
    });
    quad.setAttribute('iPos', new THREE.InstancedBufferAttribute(pos, 3));
    quad.setAttribute('iSize', new THREE.InstancedBufferAttribute(size, 2));
    quad.setAttribute('iFrame', new THREE.InstancedBufferAttribute(frame, 4));
    quad.setAttribute('iTint', new THREE.InstancedBufferAttribute(tint, 3));
    quad.instanceCount = list.length;
    const mat = billboardMat({ map: tex(B.tex, { repeat: false }), sway: B.sway, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(quad, mat);
    mesh.frustumCulled = false;
    mesh.name = 'boards:' + type;
    out.push({ mesh, count: list.length });
  }
  return out;
}
