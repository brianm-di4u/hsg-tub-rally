#!/usr/bin/env node
// Applies tools/perf-budgets.json to a loop's perf.json (tools/perf-gpu.mjs rows) and writes the measured perf gate
// into reviews/loop-N/gates.json. Device proxies and the reasoning behind each threshold: reviews/PERF.md.
//
//   node tools/perf-check.mjs <N>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const N = +process.argv[2];
if (!(N >= 0)) { console.error('usage: perf-check.mjs <N>'); process.exit(2); }
const B = JSON.parse(fs.readFileSync(path.join(GAME, 'tools', 'perf-budgets.json'), 'utf8'));
const loopDir = path.join(GAME, 'reviews', `loop-${N}`);
const rows = JSON.parse(fs.readFileSync(path.join(loopDir, 'perf.json'), 'utf8')).rows.filter((r) => !r.lab);
const G = B.gates, checks = [];
const pick = (f) => rows.filter((r) => (f.label == null || r.label === f.label) && (f.throttle == null || r.throttle === f.throttle) && (!f.viewport || r.viewport === f.viewport) && (!f.tier || r.tier === f.tier) && (!f.tiers || f.tiers.includes(r.tier)));
const add = (name, ok, detail, informational = false) => checks.push({ name, ok, detail, informational });

for (const r of pick(G.desktop)) add(`desktop ${r.tier} ${r.scene}`, r.p95 <= G.desktop.p95MaxMs && r.taskMs <= G.desktop.taskMaxMs, `p95 ${r.p95} ms (≤ ${G.desktop.p95MaxMs}), task ${r.taskMs} ms (≤ ${G.desktop.taskMaxMs})`);
for (const r of pick(G.phoneCpu)) add(`phone CPU 4× ${r.tier} ${r.scene}`, r.taskMs <= G.phoneCpu.taskMaxMs && r.fps >= G.phoneCpu.fpsMin, `task ${r.taskMs} ms (≤ ${G.phoneCpu.taskMaxMs}), ${r.fps} fps (≥ ${G.phoneCpu.fpsMin})`);
for (const s of G.gpuScale) for (const r of pick(s)) {
  const est = +((1000 / r.fps) * s.ratio).toFixed(1);
  add(`${s.name} ${r.scene}`, est <= s.maxMs, `est. ${est} ms from ${(1000 / r.fps).toFixed(2)} ms × ${s.ratio} (≤ ${s.maxMs})`, !!s.informational);
}
const base = JSON.parse(fs.readFileSync(path.join(GAME, G.floor.baseline), 'utf8')).rows;
for (const r of pick(G.floor)) {
  const b = base.find((x) => x.label === G.floor.label && x.tier === r.tier && x.viewport === r.viewport && x.scene === r.scene);
  if (!b) { add(`floor (SwiftShader) ${r.scene}`, r.fps >= G.floor.fpsMin && r.p95 <= G.floor.p95MaxMs, `${r.fps} fps, p95 ${r.p95} ms`); continue; }
  const ratio = +((1000 / r.fps) / (1000 / b.fps)).toFixed(2);
  // playability floor on the software-GL proxy; the ratio to the 240-line baseline is reported, not gated
  add(`floor (SwiftShader) ${r.scene}`, r.fps >= G.floor.fpsMin && r.p95 <= G.floor.p95MaxMs, `${r.fps} fps (≥ ${G.floor.fpsMin}), p95 ${r.p95} ms (≤ ${G.floor.p95MaxMs}); ${ratio}× the baseline frame time`);
}
for (const [tier, T] of Object.entries(B.tiers)) for (const r of rows.filter((x) => x.tier === tier && x.label === 'gpu' && x.throttle === 1)) {
  add(`budget ${tier} ${r.viewport} ${r.scene}`, r.tris <= T.sceneTris && r.calls <= T.draws, `${(r.tris / 1000).toFixed(0)}k tris (≤ ${T.sceneTris / 1000}k), ${r.calls} draws (≤ ${T.draws})`);
}
const hard = checks.filter((c) => !c.informational);
const pass = hard.length > 0 && hard.every((c) => c.ok);
for (const c of checks) console.log(`${c.ok ? '✓' : c.informational ? '·' : '✗'} ${c.name.padEnd(46)} ${c.detail}`);
const gp = path.join(loopDir, 'gates.json');
const gates = fs.existsSync(gp) ? JSON.parse(fs.readFileSync(gp, 'utf8')) : {};
gates.perf = { pass, checked: hard.length, failed: hard.filter((c) => !c.ok).map((c) => `${c.name}: ${c.detail}`) };
fs.writeFileSync(gp, JSON.stringify(gates, null, 2) + '\n');
console.log(`\nperf gate: ${pass ? 'PASS' : 'FAIL'} (${hard.filter((c) => c.ok).length}/${hard.length}) → reviews/loop-${N}/gates.json`);
