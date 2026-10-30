#!/usr/bin/env node
// Balance tool: runs the real sim headless (no browser) for many seeded races and checks the results against
// tools/balance-targets.json. Exits 1 on any miss. Pattern after games/basketball/tools/balance.mjs.
//
//   node tools/balance.mjs [--track bathhouse-row|all] [--class soak] [--races 60] [--items on|off] [--json]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Track } from '../src/js/sim/track.js';
import { makeRace, stepRace, DT } from '../src/js/sim/race.js';
import { TEAMS } from '../src/js/data/teams.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
const T = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'balance-targets.json'), 'utf8'));
const trackArg = arg('track', 'all'), cls = arg('class', 'soak'), N = +arg('races', 40), items = arg('items', 'on') !== 'off';
const dir = path.join(ROOT, 'data', 'tracks');
const isArena = (id) => { const f = path.join(ROOT, 'tracks', id + '.spec.json'); return fs.existsSync(f) && JSON.parse(fs.readFileSync(f, 'utf8')).arena; };
const ids = trackArg === 'all' ? fs.readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'graybox.json').map((f) => f.slice(0, -5)).filter((id) => !isArena(id)) : [trackArg];
const allWins = { traditional: 0, modified: 0, stock: 0 };
let allRaces = 0;
const inR = (v, [a, b]) => v >= a && v <= b;
let fails = 0;
const report = {};
for (const id of ids) {
  const json = JSON.parse(fs.readFileSync(path.join(dir, id + '.json'), 'utf8'));
  const spec = fs.existsSync(path.join(ROOT, 'tracks', id + '.spec.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'tracks', id + '.spec.json'), 'utf8')) : {};
  const tr = new Track(json);
  const laps = [], spreads = [], waterFrac = [], hits = [], fumbles = [], wins = { traditional: 0, modified: 0, stock: 0 }, clean = [];
  let under10 = 0, finishers = 0, walls = 0, falls = 0, off = 0;
  const uses = {};
  for (let r = 0; r < N; r++) {
    // rotate the 12 teams through the 8 grid slots so every division gets equal starts
    const rivals = TEAMS.map((t) => t.id);
    const race = makeRace(tr, { laps: 3, classId: cls, player: null, seed: 1000 + r, noItems: !items, rivals });
    let h = 0;
    for (let i = 0; i < 60 * 400 && race.phase !== 'done'; i++) {
      stepRace(race, tr, [], DT);
      for (const k of race.karts) for (const e of k.events) { if (e.type === 'hit' && !e.blocked) h++; if (e.type === 'use') uses[e.item] = (uses[e.item] || 0) + 1; }
    }
    hits.push(h);
    const res = race.results;
    spreads.push(res[res.length - 1].time - res[0].time);
    wins[TEAMS.find((t) => t.id === res[0].team).div]++;
    allWins[TEAMS.find((t) => t.id === res[0].team).div]++; allRaces++;
    for (const k of race.karts) {
      laps.push(...k.lapTimes.slice(1));
      if (!k.finished) continue;
      finishers++;
      waterFrac.push(k.water.gal / k.water.cap);
      if (k.water.gal < 10) under10++;
      fumbles.push(k.stats_.fumbles); walls += k.stats_.walls; falls += k.stats_.falls || 0; off += k.stats_.offroad || 0;
      clean.push(k.clean ? 1 : 0);
    }
  }
  const mean = (a) => a.reduce((s, v) => s + v, 0) / Math.max(1, a.length);
  const sd = (a) => { const m = mean(a); return Math.sqrt(mean(a.map((v) => (v - m) ** 2))); };
  const lapW = spec.lapTarget || [42, 62];
  const rows = [
    ['lap time mean (s)', mean(laps), lapW, `sd ${sd(laps).toFixed(1)}, min ${Math.min(...laps).toFixed(1)}, max ${Math.max(...laps).toFixed(1)}`],
    ['1st→8th spread (s)', mean(spreads), T.spreadSec],
    ['water at finish (frac)', mean(waterFrac), T.waterFinishFrac],
    ['finishers under 10 gal', under10 / Math.max(1, finishers), T.under10Share],
    ['clean finishes', mean(clean), T.cleanShare],
    ...(items ? [['hits per race', mean(hits), T.hitsPerRace], ['fumbles per kart', mean(fumbles), T.fumblesPerKart]] : []),
    // with several courses, division balance is judged on the total (below); one course alone is too noisy
    ...Object.entries(wins).map(([d, w]) => [`win share ${d}`, w / N, ids.length > 1 ? [0, 1] : T.divisionWinShare]),
  ];
  console.log(`\n${id} · ${cls} · ${N} races · items ${items ? 'on' : 'off'}`);
  for (const [name, v, range, extra] of rows) {
    const ok = inR(v, range);
    if (!ok) fails++;
    console.log(`  ${ok ? '✓' : '✗'} ${name.padEnd(24)} ${v.toFixed(3).padStart(8)}  target ${range[0]}–${range[1]}${extra ? '  · ' + extra : ''}`);
  }
  console.log(`  · walls ${walls}, falls ${falls}, item uses ${JSON.stringify(uses)}`);
  report[id] = Object.fromEntries(rows.map(([n, v]) => [n, +v.toFixed(3)]));
}
if (ids.length > 1) {
  console.log(`
all courses · ${allRaces} races`);
  for (const [d, w] of Object.entries(allWins)) { const v = w / allRaces, ok = inR(v, T.divisionWinShare); if (!ok) fails++; console.log(`  ${ok ? '✓' : '✗'} win share ${d.padEnd(12)} ${v.toFixed(3)}  target ${T.divisionWinShare.join('–')}`); }
}
fs.mkdirSync(path.join(ROOT, 'tools', 'out'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'tools', 'out', 'balance.json'), JSON.stringify({ cls, N, items, report }, null, 1));
process.exit(fails ? 1 : 0);
