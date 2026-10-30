#!/usr/bin/env node
// Track compiler: tracks/<id>.spec.json → data/tracks/<id>.json (the runtime format read by src/js/sim/track.js).
//
//   node tools/track/bake.mjs <id> [<id>…] | --all
//
// A spec gives the centreline either as hand-placed control points (`points`, metres, [x, z, y]) or as a routed
// polyline written by tools/track/route.mjs (`polyline`: real streets already compressed, with DEM elevation).
// Shared stages: resampling, widths, banking, limits, verges, cross-section terrain, racing line, speed profile,
// checkpoints, zones, props and buildings. Real-data stages (per-street attributes, DEM terrain, OSM buildings,
// anchored landmarks and zones) live in real.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { catmullClosed, resampleClosed, gaussSmooth, frames, racingLine, speedProfile, enc, keyed } from './lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const LIMIT = { wall: 0, rail: 1, drop: 2, soft: 3 };
const VERGE = { none: 0, curb: 1, grass: 2, gravel: 3, water: 4 };
const SURF = { asphalt: 0, brick: 1, concrete: 2, dirt: 3, ford: 4, bridge: 5 };
const XS_OFF = [2, 6, 14, 30, 60];
const SIDEWALK = 4.5;

function hash(i, s = 0) { let h = (i * 374761393 + s * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

export async function bakeSpec(spec) {
  const step = spec.step || 2;
  const real = spec.polyline ? await import('./real.mjs') : null;
  // 1. centreline
  let poly;
  if (spec.points) poly = catmullClosed(spec.points, 32);
  else if (spec.polyline) poly = JSON.parse(fs.readFileSync(path.join(ROOT, spec.polyline), 'utf8')).points;
  else throw new Error('spec needs points or polyline');
  const R0 = resampleClosed(poly, step);
  let { x, z, y, n } = R0;
  const st = R0.step;
  const R = real ? real.loadRoute(spec) : null;
  const anchors = real ? real.loadAnchors() : {};
  // where the start line sits: a fraction of the lap, or the course point nearest an anchor
  let startS = (spec.start?.at ?? 0) * n * st;
  if (R && spec.start?.anchor) {
    const a = anchors[spec.start.anchor];
    const q = (await import('../geo/geo-lib.mjs')).project(a.lon, a.lat);
    const nr = R.nearest(q.x, q.z);
    startS = nr.e.sg + nr.a + (spec.start.offset || 0);
  }
  const off = ((Math.round(startS / st) % n) + n) % n;
  startS = off * st;
  if (off) {
    const rot = (a) => Float64Array.from({ length: n }, (_, i) => a[(i + off) % n]);
    x = rot(x); z = rot(z); y = rot(y);
  }
  y = gaussSmooth(y, (spec.ySmooth ?? 12) / st);
  const fr = frames(x, z, st);
  const L = n * st;
  // 2. widths, limits, verges, surface: keyframes at fractions of the lap, or by street name
  let W, limExtra, tl, tr, vl, vr, surf, names = null;
  if (R && spec.byName) {
    const A = real.attrsByName(n, st, R, startS, spec.byName);
    names = A.names;
    W = A.width; limExtra = A.lim;
    const pickV = (i, k, map, def) => map[A.pick(i)[k] ?? def];
    tl = Float64Array.from({ length: n }, (_, i) => pickV(i, 'limType', LIMIT, 'wall'));
    tr = Float64Array.from({ length: n }, (_, i) => pickV(i, 'limTypeR', LIMIT, A.pick(i).limType || 'wall'));
    vl = Float64Array.from({ length: n }, (_, i) => pickV(i, 'verge', VERGE, 'curb'));
    vr = Float64Array.from({ length: n }, (_, i) => pickV(i, 'vergeR', VERGE, A.pick(i).verge || 'curb'));
    surf = Float64Array.from({ length: n }, (_, i) => pickV(i, 'surface', SURF, 'asphalt'));
  } else {
    W = keyed(n, spec.width, 14);
    limExtra = keyed(n, spec.limL, 6);
    tl = keyed(n, (spec.limTypeL || []).map((k) => ({ ...k, v: LIMIT[k.v], step: true })), LIMIT[spec.limTypeDefault || 'wall']);
    tr = keyed(n, (spec.limTypeR || []).map((k) => ({ ...k, v: LIMIT[k.v], step: true })), LIMIT[spec.limTypeDefault || 'wall']);
    vl = keyed(n, (spec.vergeL || []).map((k) => ({ ...k, v: VERGE[k.v], step: true })), VERGE[spec.vergeDefault || 'curb']);
    vr = keyed(n, (spec.vergeR || []).map((k) => ({ ...k, v: VERGE[k.v], step: true })), VERGE[spec.vergeDefault || 'curb']);
    surf = keyed(n, (spec.surface || []).map((k) => ({ ...k, v: SURF[k.v], step: true })), SURF[spec.surfaceDefault || 'asphalt']);
  }
  const offs = keyed(n, spec.offset, 0);
  let wl = W.map((w, i) => w / 2 - offs[i]), wr = W.map((w, i) => w / 2 + offs[i]);
  // the inside of a tight corner may not reach past 80% of the radius, or its edge would fold over itself
  {
    const kk = gaussSmooth(fr.k, 3 / st);
    const capL = new Float64Array(n).fill(1e9), capR = new Float64Array(n).fill(1e9);
    for (let i = 0; i < n; i++) { const r = 1 / Math.max(1e-6, Math.abs(fr.k[i])); if (kk[i] > 0) capL[i] = 0.7 * r; else capR[i] = 0.7 * r; }
    // erode (min over ±8 m) so the cap covers the whole corner, then smooth lightly
    const erode = (c) => Float64Array.from(c, (_, i) => { let m = 50; for (let k = -4; k <= 4; k++) m = Math.min(m, c[(i + k + n) % n]); return m; });
    const sl = gaussSmooth(erode(capL), 1.5), sr = gaussSmooth(erode(capR), 1.5);
    wl = wl.map((w, i) => Math.max(4.5, Math.min(w, sl[i])));
    wr = wr.map((w, i) => Math.max(4.5, Math.min(w, sr[i])));
  }
  const limR0 = R ? limExtra : keyed(n, spec.limR, 6);
  const limL = limExtra.map((v, i) => wl[i] + v), limR = limR0.map((v, i) => wr[i] + v);
  // 3. racing line and speed profile
  const line = racingLine(x, z, wl, wr, spec.lineMargin ?? 2);
  const { v: vmax, k: kap } = speedProfile(x, z, line, st, spec.speed || {});
  // 4. banking from curvature at profile speed (cap 12°), smoothed
  const bankScale = spec.bankScale ?? 0.35;
  let bank = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const sgn = Math.sign(fr.k[i]); // + = left turn → the right (outer) edge rises, i.e. bank > 0
    const b = bankScale * Math.atan((vmax[i] * vmax[i] * Math.abs(fr.k[i])) / 9.81);
    bank[i] = sgn * Math.min(b, (12 * Math.PI) / 180);
  }
  bank = gaussSmooth(bank, 10 / st);
  // 5. cross-section terrain beyond each road edge, relative to the centreline height (decimetres)
  const xs = new Int16Array(n * 2 * XS_OFF.length);
  const terr = spec.terrain || { kind: 'flat' };
  const demFn = R && terr.kind === 'dem' ? real.demTerrain(n, st, R, startS, (i, sgn) => (sgn > 0 ? wr[i] : wl[i])) : null;
  for (let i = 0; i < n; i++) {
    for (let side = 0; side < 2; side++) {
      for (let m = 0; m < XS_OFF.length; m++) {
        const o = XS_OFF[m];
        let h = 0;
        const t = terr[side === 1 ? 'R' : 'L'] || terr;
        if (t.kind === 'hills' || t.kind === 'slope') {
          const rise = keyed(n, t.rise, t.riseDefault ?? 0)[i];
          h = rise * (o / 60) + (t.kind === 'hills' ? Math.sin(i * 0.05 + o * 0.11 + side * 2.1) * 1.2 * Math.min(1, o / 20) : 0);
        } else if (demFn) h = demFn(i, side, o);
        if (o <= 2) h = Math.max(Math.min(h, 1.2), 0.15); // curb/sidewalk band stays near road level
        xs[(i * 2 + side) * XS_OFF.length + m] = Math.round(Math.max(-3000, Math.min(3000, h * 10)));
      }
    }
  }
  // smooth the terrain along the course (the DEM is noisy beside a compressed road)
  for (let side = 0; side < 2; side++) for (let m = 1; m < XS_OFF.length; m++) {
    const col = Float64Array.from({ length: n }, (_, i) => xs[(i * 2 + side) * XS_OFF.length + m]);
    const sm = gaussSmooth(col, 3);
    for (let i = 0; i < n; i++) xs[(i * 2 + side) * XS_OFF.length + m] = Math.round(sm[i]);
  }
  // 6. checkpoints, zones and props
  const nCp = spec.checkpoints ?? 16;
  const cps = Array.from({ length: nCp - 1 }, (_, k) => Math.round(((k + 1) * n) / nCp));
  const frame = (s) => {
    const u = ((s % L) + L) % L / st, i = Math.floor(u) % n, j = (i + 1) % n, f = u - Math.floor(u);
    const tx = fr.tx[i] + (fr.tx[j] - fr.tx[i]) * f, tz = fr.tz[i] + (fr.tz[j] - fr.tz[i]) * f, l = Math.hypot(tx, tz) || 1;
    return { x: x[i] + (x[j] - x[i]) * f, z: z[i] + (z[j] - z[i]) * f, y: y[i] + (y[j] - y[i]) * f, tx: tx / l, tz: tz / l, i };
  };
  const ptAtS = (s, d) => { const c = frame(s); return { x: c.x - c.tz * d, z: c.z + c.tx * d, y: c.y, yaw: Math.atan2(c.tx, c.tz), i: c.i }; };
  const ptAt = (f, d) => ptAtS(f * L, d);
  const runsOf = (name) => {
    const out = []; let a = -1;
    for (let i = 0; i <= n; i++) { const on = i < n && names && names[i] === name; if (on && a < 0) a = i; if (!on && a >= 0) { out.push([a * st, (i - 1) * st]); a = -1; } }
    return out;
  };
  const zones = [];
  for (const zn of spec.zones || []) {
    if (zn.at) zones.push({ type: zn.type, s0: zn.at[0] * L, s1: zn.at[1] * L, d0: zn.d ? zn.d[0] : null, d1: zn.d ? zn.d[1] : null, rate: zn.rate, label: zn.label });
    else if (zn.on && names) for (const [s0, s1] of runsOf(zn.on)) zones.push({ type: zn.type, s0, s1, d0: zn.d ? zn.d[0] : null, d1: zn.d ? zn.d[1] : null, rate: zn.rate, label: zn.label });
    else if (zn.anchor && R) {
      const a = anchors[zn.anchor];
      const { project } = await import('../geo/geo-lib.mjs');
      const q = project(a.lon, a.lat), nr = R.nearest(q.x, q.z);
      const s = (((nr.e.sg + nr.a - startS) % L) + L) % L, side = Math.sign(nr.d) || 1, i = Math.floor(s / st) % n;
      const w = side > 0 ? wr[i] : wl[i];
      zones.push({ type: zn.type, s0: s - (zn.len || 20) / 2, s1: s + (zn.len || 20) / 2, d0: side > 0 ? w - 5 : -w - 1, d1: side > 0 ? w + 1 : -w + 5, rate: zn.rate, label: zn.label, anchor: zn.anchor });
    }
  }
  const props = [];
  const addRow = (p, s0, s1) => {
    for (let s = s0; s <= s1 + 1e-6; s += p.every) for (const side of p.sides || [p.side || 1]) {
      const i = Math.floor((((s % L) + L) % L) / st) % n;
      const edge = side > 0 ? wr[i] : wl[i];
      const d = side * (edge + (p.d ?? 2));
      const q = ptAtS(s, d);
      props.push({ type: p.type, x: +q.x.toFixed(2), z: +q.z.toFixed(2), yaw: +(q.yaw + (p.yaw || 0)).toFixed(3), side, s: +s.toFixed(1), d: +d.toFixed(2), sc: p.scale ? +(p.scale[0] + hash(props.length) * (p.scale[1] - p.scale[0])).toFixed(2) : 1 });
    }
  };
  for (const p of spec.props || []) {
    if (p.every) addRow(p, (p.from ?? 0) * L, (p.to ?? 1) * L);
    else { const q = ptAt(p.at, p.d || 0); props.push({ type: p.type, x: +q.x.toFixed(2), z: +q.z.toFixed(2), yaw: +(q.yaw + (p.yaw || 0)).toFixed(3), s: +(p.at * L).toFixed(1), d: p.d || 0, sc: p.sc || 1, id: p.id }); }
  }
  for (const p of spec.propsByName || []) if (names) for (const [s0, s1] of runsOf(p.on)) addRow(p, s0 + 4, s1 - 4);
  // 7. buildings: generated rows (gray box) or OSM footprints (real courses)
  const buildings = [];
  for (const row of spec.buildingRows || []) {
    let f = row.from, idx = 0;
    while (f < row.to) {
      const wM = row.widths ? row.widths[idx % row.widths.length] : 10 + hash(idx, 7) * (row.wRand ?? 8);
      const f1 = Math.min(row.to, f + wM / L);
      const i0 = Math.floor(f * n) % n, i1 = Math.floor(f1 * n) % n, side = row.side;
      const e0 = (side > 0 ? wr[i0] : wl[i0]) + row.setback, e1 = (side > 0 ? wr[i1] : wl[i1]) + row.setback;
      const a = ptAt(f, side * e0), b = ptAt(f1, side * e1), c = ptAt(f1, side * (e1 + row.depth)), d = ptAt(f, side * (e0 + row.depth));
      const h = row.heights ? row.heights[idx % row.heights.length] : row.h[0] + hash(idx, 3) * (row.h[1] - row.h[0]);
      const fp = side > 0 ? [a, d, c, b] : [a, b, c, d];
      buildings.push({ fp: fp.map((p) => [+p.x.toFixed(2), +p.z.toFixed(2)]), base: +(Math.min(y[i0], y[i1]) - 0.5).toFixed(2), h: +h.toFixed(1), style: row.styles ? row.styles[idx % row.styles.length] : row.style || 'store', front: side > 0 ? 3 : 0, name: row.names ? row.names[idx] : undefined });
      f = f1 + (row.gap ?? 0) / L; idx++;
    }
  }
  const landmarks = [];
  const locateBaked = (px, pz) => {
    let bi = 0, bd = Infinity;
    for (let i = 0; i < n; i++) { const dd = (x[i] - px) ** 2 + (z[i] - pz) ** 2; if (dd < bd) { bd = dd; bi = i; } }
    return { i: bi, d: (px - x[bi]) * -fr.tz[bi] + (pz - z[bi]) * fr.tx[bi] };
  };
  if (R) {
    const { project } = await import('../geo/geo-lib.mjs');
    for (const lm of spec.landmarks || []) {
      const a = lm.lonlat ? { lon: lm.lonlat[0], lat: lm.lonlat[1] } : anchors[lm.anchor];
      if (!a) { console.warn('missing anchor', lm.anchor); continue; }
      const q = project(a.lon, a.lat), nr = R.nearest(q.x, q.z, lm.street || spec.rowStreet);
      const s = (((nr.e.sg + nr.a - startS) % L) + L) % L;
      landmarks.push({ ...lm, s: +s.toFixed(1), d: +nr.d.toFixed(2), side: Math.sign(nr.d) || 1 });
    }
    if (spec.buildings?.source === 'osm') {
      const skipAnchors = (spec.landmarks || []).map((lm) => (lm.lonlat ? { lon: lm.lonlat[0], lat: lm.lonlat[1] } : anchors[lm.anchor])).filter(Boolean);
      const game = (sg, d) => { const s = sg - startS, c = frame(s); return { x: c.x - c.tz * d, z: c.z + c.tx * d, h: Math.atan2(c.tx, c.tz), y: c.y }; };
      const clearOf = (fp) => {
        // every corner must sit beyond the road edge + sidewalk + 0.8 m; push outward (≤ 16 m) or give up
        let worst = 0, dir = null;
        for (const [px, pz] of fp) {
          const l = locateBaked(px, pz), side = Math.sign(l.d) || 1, i = l.i;
          const need = (side > 0 ? wr[i] : wl[i]) + ((side > 0 ? vr[i] : vl[i]) === VERGE.curb ? SIDEWALK : 1.5) + 0.8;
          const deficit = need - Math.abs(l.d);
          if (deficit > worst) { worst = deficit; dir = { x: -fr.tz[i] * side, z: fr.tx[i] * side }; }
        }
        if (worst <= 0) return fp;
        if (worst > 16) return null;
        const moved = fp.map(([px, pz]) => [px + dir.x * (worst + 0.3), pz + dir.z * (worst + 0.3)]);
        for (const [px, pz] of moved) { const l = locateBaked(px, pz), i = l.i; if (Math.abs(l.d) < (Math.sign(l.d) > 0 ? wr[i] : wl[i]) + 2) return null; }
        return moved;
      };
      const osm = real.osmBuildings(spec, R, game, { skipAnchors, clearOf, style: spec.buildings.style });
      for (const b of osm) {
        // the street the building belongs to (its nearest real street, mapped to the course), not just the
        // nearest bit of course: a bathhouse sits between Central and the Promenade but fronts Central
        const l = { i: Math.round(((((b.s - startS) % L) + L) % L) / st) % n };
        // front edge: the one whose outward normal points most toward the road
        let front = 0, bestDot = -Infinity;
        for (let e = 0; e < b.fp.length; e++) {
          const [ax, az] = b.fp[e], [bx, bz] = b.fp[(e + 1) % b.fp.length];
          const ex = bx - ax, ez = bz - az, el = Math.hypot(ex, ez) || 1;
          const nx = -ez / el, nz = ex / el; // right of the edge = outward for our winding
          const mx = (ax + bx) / 2, mz = (az + bz) / 2, tx = x[l.i] - mx, tz = z[l.i] - mz, tl2 = Math.hypot(tx, tz) || 1;
          const dot = (nx * tx + nz * tz) / tl2 * Math.min(1, el / 6);
          if (dot > bestDot) { bestDot = dot; front = e; }
        }
        buildings.push({ fp: b.fp, base: +(y[l.i] - 0.6).toFixed(2), h: b.h, style: b.style, front, name: b.name || undefined });
      }
    }
  }
  // the Row's order along the course (for tests): anchors sorted by game s
  let rowOrder;
  if (R && spec.rowAnchors) {
    const { project } = await import('../geo/geo-lib.mjs');
    rowOrder = spec.rowAnchors.map((id) => { const a = anchors[id], q = project(a.lon, a.lat), nr = R.nearest(q.x, q.z, spec.rowStreet); return { id, s: +((((nr.e.sg + nr.a - startS) % L) + L) % L).toFixed(1), d: +nr.d.toFixed(1) }; });
  }
  const json = {
    id: spec.id, name: spec.name, cup: spec.cup || null, v: 1, step: +st.toFixed(5), n, closed: true, length: +L.toFixed(2),
    laps: spec.laps ?? 3,
    arr: {
      x: enc(x), z: enc(z), y: enc(y), bank: enc(bank), wl: enc(wl), wr: enc(wr), limL: enc(limL), limR: enc(limR),
      tl: enc(tl, 'u8'), tr: enc(tr, 'u8'), vl: enc(vl, 'u8'), vr: enc(vr, 'u8'), surf: enc(surf, 'u8'),
      line: enc(line), vmax: enc(vmax), xs: enc(xs, 'i16'),
    },
    xsOff: XS_OFF, cps, start: { i: 0 }, zones, props, buildings, rowOrder,
    landmarks: R ? landmarks : spec.landmarks || [], env: spec.env || {},
    meta: { ...(spec.meta || {}), bakedFrom: spec.points ? 'points' : spec.polyline, route: R ? R.r.meta : undefined, note: spec.note },
    stats: { length: +L.toFixed(1), minRadius: +(1 / Math.max(...kap)).toFixed(1), climb: +(Math.max(...y) - Math.min(...y)).toFixed(1), buildings: buildings.length, props: props.length },
  };
  return json;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = process.argv.slice(2);
  const specDir = path.join(ROOT, 'tracks');
  const ids = args.includes('--all') ? fs.readdirSync(specDir).filter((f) => f.endsWith('.spec.json')).map((f) => f.replace('.spec.json', '')) : args;
  if (!ids.length) { console.error('usage: node tools/track/bake.mjs <id>… | --all'); process.exit(2); }
  fs.mkdirSync(path.join(ROOT, 'data', 'tracks'), { recursive: true });
  for (const id of ids) {
    const spec = JSON.parse(fs.readFileSync(path.join(specDir, id + '.spec.json'), 'utf8'));
    const json = await bakeSpec(spec);
    const out = path.join(ROOT, 'data', 'tracks', id + '.json');
    fs.writeFileSync(out, JSON.stringify(json));
    console.log(id, `${json.stats.length} m`, `min radius ${json.stats.minRadius} m`, `climb ${json.stats.climb} m`, `buildings ${json.stats.buildings}`, `props ${json.stats.props}`, `${(fs.statSync(out).size / 1024).toFixed(1)} KB`);
  }
}
