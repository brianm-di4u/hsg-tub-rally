#!/usr/bin/env node
// Par ghosts (S3-04): one staff run per course, driven by the game's own autoplay driver, written to
// assets/par-ghosts.js as data (a classic script the game loads when Time Trial opens, so the first race does not
// carry it). Re-run after any change to the physics or the Scald class, then rebuild:
//
//   node tools/par-ghosts.mjs [--seeds 8] [--skill 1.04] [--check]
//
// The run is a three-lap Time Trial on Scald with Engine Six (the reference tub), the fastest of N seeds
// (the seed only moves the driver's lane). The pose is sampled every PAR_STEP_MS and stored as three Int16
// arrays (x and z in decimetres from a whole-metre origin, yaw in milliradians): about 6 KB a course.
// --check re-runs the drivers and reports how far the stored par times have drifted, without writing.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Track } from '../src/js/sim/track.js';
import { makeRace, stepRace, DT } from '../src/js/sim/race.js';
import { TRACKS } from '../src/js/data/tracks.js';
import { packPar, PAR_STEP_MS } from '../src/js/sim/ghost.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
const SEEDS = +arg('seeds', 8), SKILL = +arg('skill', 1.04), CHECK = process.argv.includes('--check');
const TEAM = 'engine-six', CLASS = 'scald', LAPS = 3;
const STEP_TICKS = Math.round(PAR_STEP_MS / 1000 / DT);

function drive(tr, seed) {
  const race = makeRace(tr, { laps: LAPS, classId: CLASS, player: TEAM, seed, mode: 'timetrial', noItems: true, count: 1, autoplay: true });
  race.drivers[race.player].skill = SKILL;
  const k = race.karts[race.player], samples = [];
  let n = 0;
  for (let i = 0; i < 60 * 400 && race.phase !== 'done'; i++) {
    stepRace(race, tr, [], DT);
    if (race.phase === 'race' && !k.finished && n++ % STEP_TICKS === 0) samples.push({ x: k.x, z: k.z, yaw: k.yaw });
  }
  if (!k.finished) return null;
  samples.push({ x: k.x, z: k.z, yaw: k.yaw }); // the finish pose, at the finish time
  const laps = k.lapTimes;
  // the stored lap is the best of laps 2 and 3, as a player's Time Trial record is (a standing start slows lap 1)
  const lap = Math.min(...laps.slice(1));
  return { total: k.finishT, lap, laps, samples };
}

const out = {};
const outPath = path.join(ROOT, 'assets', 'par-ghosts.js');
for (const t of TRACKS) {
  const f = path.join(ROOT, 'data', 'tracks', t.id + '.json');
  if (t.arena || !fs.existsSync(f)) continue;
  const tr = new Track(JSON.parse(fs.readFileSync(f, 'utf8')));
  let best = null;
  for (let s = 0; s < SEEDS; s++) {
    const r = drive(tr, 100 + s);
    if (r && (!best || r.total < best.total)) best = r;
  }
  if (!best) { console.error('no finish on ' + t.id); process.exit(1); }
  out[t.id] = packPar(best.samples, { team: TEAM, total: +best.total.toFixed(3), lap: +best.lap.toFixed(3) });
  console.log(`${t.id.padEnd(20)} ${best.total.toFixed(2)} s  best lap ${best.lap.toFixed(2)}  laps ${best.laps.map((v) => v.toFixed(1)).join(' / ')}  ${best.samples.length} samples`);
}
if (CHECK) {
  await import(new URL('file:///' + outPath.replace(/\\/g, '/')));
  const PAR = globalThis.TR_PAR;
  let worst = 0;
  for (const [id, p] of Object.entries(out)) { const d = Math.abs(p.total - PAR[id].total); worst = Math.max(worst, d); console.log(`${id.padEnd(20)} stored ${PAR[id].total.toFixed(2)} now ${p.total.toFixed(2)} drift ${d.toFixed(2)} s`); }
  console.log('worst drift ' + worst.toFixed(2) + ' s');
} else {
  const body = Object.entries(out).map(([id, p]) => `  '${id}': ${JSON.stringify(p)},`).join('\n');
  fs.writeFileSync(outPath, `// Par ghosts: one staff run per course from the game's own autoplay driver (tools/par-ghosts.mjs wrote this file).
// A classic script (also importable in Node): the game loads it when Time Trial opens. Medal times derive from it, see src/js/sim/medals.js.
globalThis.TR_PAR = {
${body}
};
`);
  console.log('wrote ' + outPath);
}
