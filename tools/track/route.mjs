#!/usr/bin/env node
// Real streets → a raceable lap. Routes a spec's waypoints on the OSM graph, samples USGS 3DEP elevation, then
// compresses the course to its target length while keeping street order, turn angles and pinned stretches:
//
//   1. route via waypoints (tools/track/osm.mjs)            4. straights scale by ks, turns by kt (≥ min radius),
//   2. project, resample every 1 m, smooth the heading         pinned stretches stay 1:1; ks is solved by bisection
//   3. DEM elevation (smoothed)                             5. rebuild from headings, close the gap over straights
//                                                           6. scale elevation so no grade exceeds gmax
//
// Writes tracks/<id>.route.json: {points:[[x,z,y]…] (game metres), map:[{sr, sg, x, z, h}] (real ↔ game, every
// 2 m), meta:{realLength, length, ks, kt, kv, legs…}}. bake.mjs reads it via the spec's "polyline".
//
//   node tools/track/route.mjs <id> [<id>…]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { routeVia } from './osm.mjs';
import { project, loadDefaultDem } from '../geo/geo-lib.mjs';
import { gaussSmooth } from './lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function resample1(xs, zs, step = 1) {
  const cum = [0];
  for (let i = 1; i < xs.length; i++) cum.push(cum[i - 1] + Math.hypot(xs[i] - xs[i - 1], zs[i] - zs[i - 1]));
  const L = cum[cum.length - 1], n = Math.max(2, Math.round(L / step));
  const x = new Float64Array(n), z = new Float64Array(n), src = new Float64Array(n);
  let j = 0;
  for (let i = 0; i < n; i++) {
    const s = (i * L) / n;
    while (j < cum.length - 2 && cum[j + 1] < s) j++;
    const f = (s - cum[j]) / Math.max(1e-9, cum[j + 1] - cum[j]);
    x[i] = xs[j] + (xs[j + 1] - xs[j]) * f; z[i] = zs[j] + (zs[j + 1] - zs[j]) * f; src[i] = j + f;
  }
  return { x, z, n, L, ds: L / n, src };
}

export function buildRoute(spec, dem) {
  const R = spec.route;
  const via = R.via.map((w) => ({ ...w }));
  const { pts, legs } = routeVia(via, R.profile || 'road1', { prefer: R.prefer ? new RegExp(R.prefer) : null, penalty: R.penalty || 3 });
  // project and drop repeats; the loop closes because the last waypoint equals the first
  let xs = [], zs = [], names = [];
  for (const p of pts) {
    const q = project(p.lon, p.lat);
    if (xs.length && Math.hypot(q.x - xs[xs.length - 1], q.z - zs[zs.length - 1]) < 0.3) continue;
    xs.push(q.x); zs.push(q.z); names.push(p.name || p.hw);
  }
  if (Math.hypot(xs[0] - xs[xs.length - 1], zs[0] - zs[zs.length - 1]) < 1) { xs.pop(); zs.pop(); names.pop(); }
  xs.push(xs[0]); zs.push(zs[0]); names.push(names[0]);
  const S = resample1(xs, zs, 1);
  const n = S.n, ds = S.ds;
  // smooth the real line a little (OSM chords) for headings, keep the raw line for mapping
  const sig = (R.smooth ?? 6) / ds;
  const sx = gaussSmooth(S.x, sig, true), sz = gaussSmooth(S.z, sig, true);
  const th = new Float64Array(n);
  for (let i = 0; i < n; i++) { const p = (i - 1 + n) % n, q = (i + 1) % n; th[i] = Math.atan2(sx[q] - sx[p], sz[q] - sz[p]); }
  // unwrap headings
  for (let i = 1; i < n; i++) { let d = th[i] - th[i - 1]; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; th[i] = th[i - 1] + d; }
  const kap = new Float64Array(n);
  for (let i = 0; i < n; i++) { const p = Math.max(0, i - 2), q = Math.min(n - 1, i + 2); kap[i] = (th[q] - th[p]) / ((q - p) * ds); }
  const kabs = gaussSmooth(Array.from(kap, Math.abs), 4 / ds, true);
  // elevation (real), smoothed
  let yr = new Float64Array(n);
  for (let i = 0; i < n; i++) { const { lon, lat } = unprojectXZ(S.x[i], S.z[i]); yr[i] = dem.sample(lon, lat); }
  for (let i = 0; i < n; i++) if (!Number.isFinite(yr[i])) yr[i] = i ? yr[i - 1] : 185;
  yr = gaussSmooth(yr, (R.ySmooth ?? 10) / ds, true);
  // pinned stretches (kept 1:1): nearest samples to each pin's endpoints
  const pinned = new Uint8Array(n);
  const nearestIdx = (lat, lon) => { const q = project(lon, lat); let b = 0, bd = Infinity; for (let i = 0; i < n; i++) { const d = (S.x[i] - q.x) ** 2 + (S.z[i] - q.z) ** 2; if (d < bd) { bd = d; b = i; } } return b; };
  for (const pin of R.pins || []) {
    const a = nearestIdx(pin.from[0], pin.from[1]), b = nearestIdx(pin.to[0], pin.to[1]);
    for (let i = a; i !== b; i = (i + 1) % n) pinned[i] = 1;
    pinned[b] = 1;
  }
  const minR = R.minRadius ?? 14, turnK = 1 / (R.turnRadius ?? 150);
  const factors = (ks) => {
    const kt = Math.min(1, Math.max(ks, Math.sqrt(ks)));
    const f = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      if (pinned[i]) { f[i] = 1; continue; }
      let v = kabs[i] > turnK ? kt : ks;
      v = Math.max(v, minR * kabs[i]); // a compressed turn must keep at least the minimum radius
      f[i] = v;
    }
    return { f, kt };
  };
  // closure by least squares: each unpinned sample's length changes along its own heading (no shear, headings
  // kept): δ_i = w_i (u_i · λ), with λ solving (Σ w u uᵀ) λ = −gap. Repeated with clamping so no sample shrinks
  // below 30% of its length. Straights carry most of the change, turns a little, pinned stretches none.
  const closeLoop = (f) => {
    const len = Float64Array.from(f, (v) => v * ds);
    for (let pass = 0; pass < 6; pass++) {
      let gxx = 0, gzz = 0;
      for (let i = 0; i < n; i++) { gxx += Math.sin(th[i]) * len[i]; gzz += Math.cos(th[i]) * len[i]; }
      if (Math.hypot(gxx, gzz) < 0.05) break;
      let a = 0, b = 0, c = 0;
      const w = new Float64Array(n);
      for (let i = 0; i < n; i++) {
        if (pinned[i] || len[i] <= 0.3 * f[i] * ds + 1e-9) continue;
        w[i] = (kabs[i] > turnK ? 0.15 : 1) * f[i] * ds;
        const ux = Math.sin(th[i]), uz = Math.cos(th[i]);
        a += w[i] * ux * ux; b += w[i] * ux * uz; c += w[i] * uz * uz;
      }
      const det = a * c - b * b;
      if (Math.abs(det) < 1e-9) break;
      const lx = (-gxx * c + gzz * b) / det, lz = (gxx * b - gzz * a) / det;
      for (let i = 0; i < n; i++) {
        if (!w[i]) continue;
        len[i] = Math.max(0.3 * f[i] * ds, len[i] + w[i] * (Math.sin(th[i]) * lx + Math.cos(th[i]) * lz));
      }
    }
    return len;
  };
  const target = R.targetLength ?? 950;
  let lo = 0.05, hi = 1.5, best = null;
  for (let it = 0; it < 40; it++) {
    const ks = (lo + hi) / 2, { f, kt } = factors(ks);
    const len = closeLoop(f);
    const L = len.reduce((a, v) => a + v, 0);
    best = { ks, kt, f, len, L };
    if (L > target) hi = ks; else lo = ks;
  }
  const { len, ks, kt } = best;
  const f = Float64Array.from(len, (v) => v / ds);
  // rebuild from headings
  const gx = new Float64Array(n + 1), gz = new Float64Array(n + 1), gs = new Float64Array(n + 1);
  for (let i = 0; i < n; i++) {
    gx[i + 1] = gx[i] + Math.sin(th[i]) * len[i]; gz[i + 1] = gz[i] + Math.cos(th[i]) * len[i]; gs[i + 1] = gs[i] + len[i];
  }
  const gapX = gx[n] - gx[0], gapZ = gz[n] - gz[0];
  // any tiny residual is spread linearly
  for (let i = 0; i <= n; i++) { const t = gs[i] / gs[n]; gx[i] -= gapX * t; gz[i] -= gapZ * t; }
  // anchor the game frame at the real start point and heading (so it overlays the map near the start)
  const ox = S.x[0], oz = S.z[0];
  for (let i = 0; i <= n; i++) { gx[i] += ox; gz[i] += oz; }
  // elevation: keep the real profile, scaled so no 20 m window is steeper than gmax
  const gmax = R.gmax ?? 0.12, y0 = yr[0];
  let maxG = 0;
  const W = Math.max(2, Math.round((R.gradeWindow ?? 30) / ds));
  for (let i = 0; i < n; i++) {
    const j = (i + W) % n;
    const dsGame = i + W <= n ? gs[i + W] - gs[i] : gs[n] - gs[i] + gs[i + W - n];
    maxG = Math.max(maxG, Math.abs(yr[j] - yr[i]) / Math.max(1, dsGame));
  }
  const kv = Math.min(1, gmax / Math.max(1e-6, maxG));
  const points = [];
  for (let i = 0; i < n; i++) points.push([+gx[i].toFixed(3), +gz[i].toFixed(3), +(y0 + (yr[i] - y0) * kv - y0).toFixed(3)]);
  const map = [];
  for (let i = 0; i < n; i += Math.max(1, Math.round(2 / ds))) map.push({ sr: +(i * ds).toFixed(1), sg: +gs[i].toFixed(2), x: +S.x[i].toFixed(2), z: +S.z[i].toFixed(2), h: +th[i].toFixed(4), y: +yr[i].toFixed(2), name: names[Math.min(names.length - 1, Math.round(S.src[i]))] });
  return {
    id: spec.id, points, map,
    meta: { realLength: +S.L.toFixed(1), length: +gs[n].toFixed(1), ks: +ks.toFixed(3), kt: +kt.toFixed(3), kv: +kv.toFixed(3), baseElevation: +y0.toFixed(2),
      realMaxGrade: +maxG.toFixed(3), pinnedM: +(pinned.reduce((a, v) => a + v, 0) * ds).toFixed(1), gap: [+gapX.toFixed(1), +gapZ.toFixed(1)], legs },
  };
}

function unprojectXZ(x, z) {
  // inverse of geo-lib project(): import lazily to keep one source of truth
  return UNPROJECT(x, z);
}
let UNPROJECT = null;

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const { unproject } = await import('../geo/geo-lib.mjs');
  UNPROJECT = (x, z) => unproject(x, z);
  const dem = loadDefaultDem();
  for (const id of process.argv.slice(2)) {
    const spec = JSON.parse(fs.readFileSync(path.join(ROOT, 'tracks', id + '.spec.json'), 'utf8'));
    const r = buildRoute(spec, dem);
    fs.writeFileSync(path.join(ROOT, 'tracks', id + '.route.json'), JSON.stringify(r));
    console.log(id, `real ${r.meta.realLength} m → game ${r.meta.length} m`, `ks ${r.meta.ks} kt ${r.meta.kt} kv ${r.meta.kv}`, `pinned ${r.meta.pinnedM} m`, `gap ${r.meta.gap}`);
    for (const l of r.meta.legs) console.log('   ', l.len.toFixed(0), 'm:', l.names);
  }
} else {
  const { unproject } = await import('../geo/geo-lib.mjs');
  UNPROJECT = (x, z) => unproject(x, z);
}
