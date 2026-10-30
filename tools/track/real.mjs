// Real-data stages of the track compiler (used by bake.mjs when a spec has a routed "polyline"):
// per-street attributes, DEM terrain beside the road, OSM building footprints moved onto the compressed course,
// and anchored landmarks/zones. Every placement maps a real point to (real s, lateral d) on the real street line,
// then to (game s, same d) on the compressed course, so buildings keep their side of the street, their order,
// their setback, true shape and size.
import fs from 'node:fs';
import path from 'node:path';
import { RAW, ROOT, project, unproject, loadDefaultDem } from '../geo/geo-lib.mjs';
import { gaussSmooth } from './lib.mjs';

let DEM = null;
const dem = () => (DEM ||= loadDefaultDem());

// A hand-drawn course in the real map frame (arena): real and game coordinates are the same.
export function routeFromLine(x, z, st, name = '') {
  const n = x.length, D = dem(), map = [];
  for (let i = 0; i < n; i++) {
    const p = (i - 1 + n) % n, q = (i + 1) % n, h = Math.atan2(x[q] - x[p], z[q] - z[p]);
    const { lon, lat } = unproject(x[i], z[i]);
    map.push({ sr: i * st, sg: i * st, x: x[i], z: z[i], h, y: D.sample(lon, lat), name });
  }
  return { meta: { length: n * st, kv: 1, realLength: n * st, ks: 1, kt: 1 }, map };
}

export function loadRoute(spec, pre) {
  const r = pre || JSON.parse(fs.readFileSync(path.join(ROOT, spec.polyline), 'utf8'));
  const map = r.map, L = r.meta.length;
  // real info at game arc length sg (wraps); linear interpolation between map entries
  const at = (sg) => {
    sg = ((sg % L) + L) % L;
    let lo = 0, hi = map.length - 1;
    if (sg >= map[hi].sg) { const a = map[hi], b = map[0]; const span = L - a.sg; const t = span > 0 ? (sg - a.sg) / span : 0; return lerpEntry(a, b, t); }
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (map[m].sg <= sg) lo = m; else hi = m; }
    const a = map[lo], b = map[hi], t = (sg - a.sg) / Math.max(1e-6, b.sg - a.sg);
    return lerpEntry(a, b, t);
  };
  // nearest real entry to a projected point → {e, d (signed, right +), a (along)}
  const nearest = (px, pz, on) => {
    let best = null, bd = Infinity;
    for (const e of map) { if (on && e.name !== on) continue; const dd = (e.x - px) ** 2 + (e.z - pz) ** 2; if (dd < bd) { bd = dd; best = e; } }
    if (!best) return nearest(px, pz);
    const tx = Math.sin(best.h), tz = Math.cos(best.h), rx = -tz, rz = tx;
    return { e: best, d: (px - best.x) * rx + (pz - best.z) * rz, a: (px - best.x) * tx + (pz - best.z) * tz, dist: Math.sqrt(bd) };
  };
  return { r, map, L, at, nearest, kv: r.meta.kv };
}
function lerpEntry(a, b, t) {
  let dh = b.h - a.h; while (dh > Math.PI) dh -= 2 * Math.PI; while (dh < -Math.PI) dh += 2 * Math.PI;
  return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t, h: a.h + dh * t, y: a.y + (b.y - a.y) * t, name: t < 0.5 ? a.name : b.name, sg: a.sg + (b.sg - a.sg) * t };
}

// per-sample attributes from the street name ("byName": {name: {width, surface, verge, lim, limType}, "*": {…}})
export function attrsByName(n, st, R, startS, byName) {
  const names = [];
  for (let i = 0; i < n; i++) names.push(R.at(i * st + startS).name || '');
  const pick = (i) => byName[names[i]] || byName['*'] || {};
  const width = gaussSmooth(Array.from({ length: n }, (_, i) => pick(i).width ?? 12), 5 / st);
  const lim = gaussSmooth(Array.from({ length: n }, (_, i) => pick(i).lim ?? 5), 4 / st);
  return { names, width, lim, pick };
}

// DEM cross-sections: terrain at real lateral offsets beside the real street, relative to the real centre
// elevation, scaled like the course (kv). Returns a function (i, side, off) → metres.
export function demTerrain(n, st, R, startS, widthAt) {
  const D = dem();
  return (i, side, off) => {
    const e = R.at(i * st + startS);
    const rx = -Math.cos(e.h), rz = Math.sin(e.h), sgn = side === 1 ? 1 : -1;
    const w = widthAt(i, sgn);
    const px = e.x + rx * sgn * (w + off), pz = e.z + rz * sgn * (w + off);
    const { lon, lat } = unproject(px, pz);
    const h = D.sample(lon, lat);
    if (!Number.isFinite(h)) return 0;
    return (h - e.y) * R.kv;
  };
}

function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let md = 0, mi = -1;
    const [ax, az] = pts[a], [bx, bz] = pts[b], L = Math.hypot(bx - ax, bz - az) || 1;
    for (let i = a + 1; i < b; i++) { const d = Math.abs((bx - ax) * (az - pts[i][1]) - (ax - pts[i][0]) * (bz - az)) / L; if (d > md) { md = d; mi = i; } }
    if (md > tol) { keep[mi] = 1; stack.push([a, mi], [mi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const area = (fp) => { let s = 0; for (let i = 0; i < fp.length; i++) { const [x1, z1] = fp[i], [x2, z2] = fp[(i + 1) % fp.length]; s += x1 * z2 - x2 * z1; } return s / 2; };

// OSM footprints → game footprints. game(s, d) → {x, z, h(heading)} gives the compressed frame.
export function osmBuildings(spec, R, game, opts) {
  const cfg = spec.buildings || {};
  const j = JSON.parse(fs.readFileSync(path.join(RAW, 'osm-buildings.json'), 'utf8'));
  const skipPts = (opts.skipAnchors || []).map((a) => project(a.lon, a.lat));
  const out = [];
  const placed = [];
  const cand = [];
  for (const el of j.elements) {
    if (el.type !== 'way' || !el.geometry || !el.tags || !el.tags.building) continue;
    if (opts.skipIds && opts.skipIds.has(el.id)) continue;
    let pts = el.geometry.filter(Boolean).map((p) => { const q = project(p.lon, p.lat); return [q.x, q.z]; });
    if (pts.length > 2 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) pts.pop();
    if (pts.length < 3) continue;
    // simplify the ring in two halves split at the corner farthest from the first (a closed ring has no chord)
    let far = 0, fd = -1;
    pts.forEach((p, i) => { const d = (p[0] - pts[0][0]) ** 2 + (p[1] - pts[0][1]) ** 2; if (d > fd) { fd = d; far = i; } });
    pts = [...simplify(pts.slice(0, far + 1), 0.8).slice(0, -1), ...simplify([...pts.slice(far), pts[0]], 0.8).slice(0, -1)];
    if (pts.length < 3) continue;
    const A = Math.abs(area(pts));
    if (A < 25 || (opts.maxArea && A > opts.maxArea)) continue;
    const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cz = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    if (skipPts.some((q) => Math.hypot(q.x - cx, q.z - cz) < (cfg.skipNearAnchors ?? 20))) continue;
    const nr = R.nearest(cx, cz, /bath/i.test(el.tags.name || '') ? cfg.rowStreet : undefined);
    if (Math.abs(nr.d) > (cfg.maxDist ?? 75) || nr.dist > (cfg.maxDist ?? 75) + 30) continue;
    cand.push({ el, pts, A, cx, cz, nr });
  }
  // big and named first, so they win overlap fights
  cand.sort((a, b) => (b.el.tags.name ? 1e6 : 0) + b.A - ((a.el.tags.name ? 1e6 : 0) + a.A));
  const why = { cand: cand.length, clear: 0, overlap: 0, placed: 0 };
  for (const c of cand) {
    const { el, pts, cx, cz, nr } = c;
    const sg = nr.e.sg + nr.a;
    const g = game(sg, nr.d);
    if (!g) continue;
    const dth = g.h - nr.e.h, cs = Math.cos(dth), sn = Math.sin(dth);
    // rotate about the centroid by the heading change, then move to the game position
    let fp = pts.map(([x, z]) => { const dx = x - cx, dz = z - cz; return [g.x + dx * cs + dz * sn, g.z - dx * sn + dz * cs]; });
    if (area(fp) > 0) fp.reverse(); // negative signed area in x-east/z-south: each edge's right side is outside
    // keep clear of the road: push outward until every corner is beyond the edge + margin
    const clear = opts.clearOf(fp, nr.d);
    if (clear == null) { why.clear++; continue; }
    fp = clear;
    const r = Math.sqrt(c.A / Math.PI) * 0.8;
    const gcx = fp.reduce((s, p) => s + p[0], 0) / fp.length, gcz = fp.reduce((s, p) => s + p[1], 0) / fp.length;
    if (placed.some((p) => Math.hypot(p.x - gcx, p.z - gcz) < (p.r + r) * 0.85)) { why.overlap++; continue; }
    why.placed++;
    placed.push({ x: gcx, z: gcz, r });
    const t = el.tags;
    let h = parseFloat(t.height) || (parseFloat(t['building:levels']) ? parseFloat(t['building:levels']) * 3.7 + 1.5 : 0);
    if (!h) h = c.A > 900 ? 13 : c.A > 300 ? 10 : 7.5;
    const name = t.name || '';
    out.push({ fp: fp.map(([x, z]) => [+x.toFixed(2), +z.toFixed(2)]), h: +h.toFixed(1), name, style: /bath/i.test(name) ? 'bathhouse' : opts.style || 'store', d: nr.d, s: sg });
  }
  if (opts.log !== false) console.log('  buildings:', JSON.stringify(why));
  return out;
}

export function loadAnchors() {
  const a = JSON.parse(fs.readFileSync(path.join(ROOT, 'research', 'geo', 'anchors.json'), 'utf8'));
  return Object.fromEntries((a.anchors || a).map((x) => [x.id, x]));
}
