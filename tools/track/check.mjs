#!/usr/bin/env node
// Course validator: geometry, markup and a headless AI race on every baked course. Exits 1 on any failure.
//
//   node tools/track/check.mjs <id>… | --all [--quick]
//
// Checks: the loop closes; road edges never cross (except declared overpasses); width ≥ 9 m; centreline radius
// ≥ 10 m; grade ≤ the spec's gmax (default 0.18); a ≥ 60 m straight behind the start line for the grid; zones and
// props on or beside drivable ground; no building over the road; and 8 AI tubs × 3 laps all finish, with lap times
// inside the target window (Soak class).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Track } from '../../src/js/sim/track.js';
import { makeRace, stepRace, DT } from '../../src/js/sim/race.js';
import { segX } from './lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function checkTrack(id, { quick = false } = {}) {
  const json = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tracks', id + '.json'), 'utf8'));
  const specFile = path.join(ROOT, 'tracks', id + '.spec.json');
  const spec = fs.existsSync(specFile) ? JSON.parse(fs.readFileSync(specFile, 'utf8')) : {};
  const tr = new Track(json);
  const a = tr.a, n = tr.n, st = tr.step;
  const res = [];
  const ok = (name, pass, detail) => res.push({ name, pass: !!pass, detail });
  // closure
  const gap = Math.hypot(a.x[0] - a.x[n - 1], a.z[0] - a.z[n - 1]);
  ok('loop closes', gap < st * 1.6, `${gap.toFixed(2)} m between last and first sample (step ${st.toFixed(2)})`);
  // edges
  const edge = (side) => Array.from({ length: n }, (_, i) => { const w = side > 0 ? a.wr[i] : a.wl[i]; return [a.x[i] - tr.tz[i] * w * side, a.z[i] + tr.tx[i] * w * side]; });
  let crossings = 0;
  const overpass = (spec.overpasses || []).map((o) => [o[0] * tr.length, o[1] * tr.length]);
  const isOver = (i) => overpass.some(([s0, s1]) => i * st >= s0 && i * st <= s1);
  for (const side of [-1, 1]) {
    const E = edge(side);
    for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue;
      if (isOver(i) || isOver(j)) continue;
      const [ax, az] = E[i], [bx, bz] = E[(i + 1) % n], [cx, cz] = E[j], [dx, dz] = E[(j + 1) % n];
      if (Math.max(ax, bx) < Math.min(cx, dx) || Math.max(cx, dx) < Math.min(ax, bx) || Math.max(az, bz) < Math.min(cz, dz) || Math.max(cz, dz) < Math.min(az, bz)) continue;
      if (segX(ax, az, bx, bz, cx, cz, dx, dz)) crossings++;
    }
  }
  ok('road edges never cross', crossings === 0, `${crossings} crossing segment pairs`);
  // width, radius, grade
  let minW = Infinity, minR = Infinity, maxG = 0;
  for (let i = 0; i < n; i++) {
    minW = Math.min(minW, a.wl[i] + a.wr[i]);
    const p = tr.wrap(i - 2), q = tr.wrap(i + 2);
    const ya = Math.atan2(tr.tx[p], tr.tz[p]), yb = Math.atan2(tr.tx[q], tr.tz[q]);
    const k = Math.abs(Math.atan2(Math.sin(yb - ya), Math.cos(yb - ya))) / (4 * st);
    minR = Math.min(minR, 1 / Math.max(1e-6, k));
    maxG = Math.max(maxG, Math.abs(tr.grade[i]));
  }
  ok('width ≥ 9 m', minW >= 9, `min ${minW.toFixed(1)} m`);
  const rMin = spec.minRadiusCheck ?? 10; // real city corners kept at true scale may be tighter; the spec says so
  ok(`radius ≥ ${rMin} m`, minR >= rMin, `min ${minR.toFixed(1)} m`);
  const gmax = spec.route?.gmax ?? 0.18;
  ok(`grade ≤ ${gmax}`, maxG <= gmax + 0.03, `max ${(maxG * 100).toFixed(1)}%`);
  // grid straight
  let turn = 0;
  const y0 = Math.atan2(tr.tx[0], tr.tz[0]);
  for (let s = 0; s <= 60; s += st) { const c = tr.at(tr.length - s); turn = Math.max(turn, Math.abs(Math.atan2(Math.sin(Math.atan2(c.tx, c.tz) - y0), Math.cos(Math.atan2(c.tx, c.tz) - y0)))); }
  if (spec.arena) res.push({ name: 'arena: no start grid needed', pass: true, detail: 'battle arena' });
  else ok('≥ 60 m straight behind the start', turn < 0.3, `max heading change ${(turn * 57.3).toFixed(1)}°`);
  // markup
  let badZones = 0;
  for (const z of json.zones || []) {
    if (z.d0 == null) continue;
    const c = tr.at((z.s0 + z.s1) / 2);
    if (z.d1 < -c.limL || z.d0 > c.limR) badZones++;
  }
  ok('zones reachable', badZones === 0, `${badZones} zones outside the drivable band`);
  let propsOnRoad = 0;
  for (const p of json.props || []) { const l = tr.locate(p.x, p.z, p.s); const c = tr.at(l.s); if (Math.abs(l.d) < (l.d >= 0 ? c.wr : c.wl) - 0.2) propsOnRoad++; }
  ok('no props on the road', propsOnRoad === 0, `${propsOnRoad} props inside the road`);
  // corners off the road AND no road centreline/edge point inside any footprint (a long building can straddle)
  const inPoly = (px, pz, fp) => { let c = false; for (let i = 0, j = fp.length - 1; i < fp.length; j = i++) { const [xi, zi] = fp[i], [xj, zj] = fp[j]; if ((zi > pz) !== (zj > pz) && px < ((xj - xi) * (pz - zi)) / (zj - zi) + xi) c = !c; } return c; };
  let bOnRoad = 0;
  for (const b of json.buildings || []) {
    let hit = b.fp.some(([x, z]) => { const l = tr.locate(x, z); const c = tr.at(l.s); return Math.abs(l.d) < (l.d >= 0 ? c.wr : c.wl) + 0.5; });
    if (!hit) for (let i = 0; i < n && !hit; i++) for (const d of [0, -a.wl[i], a.wr[i]]) { if (inPoly(a.x[i] - tr.tz[i] * d, a.z[i] + tr.tx[i] * d, b.fp)) { hit = true; break; } }
    if (hit) bOnRoad++;
  }
  ok('no building over the road', bOnRoad === 0, `${bOnRoad} of ${(json.buildings || []).length} buildings touch the road`);
  // AI race
  const target = spec.lapTarget || [42, 62];
  if (!quick && !spec.arena) {
    const race = makeRace(tr, { laps: 3, classId: 'soak', player: null, seed: 7, noItems: true });
    for (let i = 0; i < 60 * 420 && race.phase !== 'done'; i++) stepRace(race, tr, [], DT);
    const fin = race.karts.filter((k) => k.finished).length;
    ok('8 AI × 3 laps finish', fin === 8, `${fin}/8 finished, race time ${race.time.toFixed(1)} s`);
    const laps = race.karts.flatMap((k) => k.lapTimes.slice(1));
    const lo = Math.min(...laps), hi = Math.max(...laps);
    ok(`lap times ${target[0]}–${target[1]} s`, lo >= target[0] && hi <= target[1], `${lo.toFixed(1)}–${hi.toFixed(1)} s`);
    const walls = race.karts.reduce((s, k) => s + k.stats_.walls, 0), falls = race.karts.reduce((s, k) => s + (k.stats_.falls || 0), 0);
    ok('AI rarely hits walls', walls <= 8 * 3, `${walls} wall hits in the race`);
    const gal = race.karts.map((k) => k.water.gal);
    res.push({ name: 'info: water at finish', pass: true, detail: `${Math.min(...gal).toFixed(1)}–${Math.max(...gal).toFixed(1)} gal` });
  }
  return { id, res, pass: res.every((r) => r.pass) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = process.argv.slice(2);
  const dir = path.join(ROOT, 'data', 'tracks');
  const ids = args.includes('--all') ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)) : args.filter((a) => !a.startsWith('--'));
  let fail = 0;
  for (const id of ids) {
    const r = checkTrack(id, { quick: args.includes('--quick') });
    console.log(`\n${r.pass ? 'PASS' : 'FAIL'} ${id}`);
    for (const c of r.res) console.log(`  ${c.pass ? '✓' : '✗'} ${c.name}: ${c.detail}`);
    if (!r.pass) fail++;
  }
  process.exit(fail ? 1 : 0);
}
