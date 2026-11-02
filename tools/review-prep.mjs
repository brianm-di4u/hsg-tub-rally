#!/usr/bin/env node
// Writes the briefs for review loop N from the templates in reviews/briefs/ (adapted from
// games/football/tools/review-prep.mjs, Hot Springs Games, MIT): the capture index (from shots.json), the A/B pair
// list, this loop's CHANGES.md (facts only), the measured gates (perf.json, gates.json). No scores go into any brief.
//
//   node tools/review-prep.mjs <N> [--tier=high] [--shots=review-loop-N]
//
// Output: reviews/loop-N/brief.md (both critics), brief-advocate.md, brief-prosecutor.md, brief-judge.md, and
// calibration.jpg every third loop (a benchmark image the judge scores blind, to catch drift).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Benchmark screenshots (git-ignored): the workspace's shared reference/benchmarks/racing/, else benchmarks/ here.
const BENCH = [path.resolve(GAME, '..', '..', 'reference', 'benchmarks', 'racing'), BENCH].find((d) => fs.existsSync(d)) || BENCH;
const REL = 'repos/hsg-tub-rally';
const args = process.argv.slice(2);
const N = +args.find((a) => /^\d+$/.test(a));
if (!(N >= 0)) { console.error('usage: review-prep.mjs <N> [--tier=high] [--shots=review-loop-N]'); process.exit(2); }
const opt = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const TIER = opt('tier', 'high'), SHOTS = opt('shots', `review-loop-${N}`);
const loopDir = path.join(GAME, 'reviews', `loop-${N}`);
fs.mkdirSync(loopDir, { recursive: true });
const read = (f, d = '') => { try { return fs.readFileSync(f, 'utf8'); } catch { return d; } };

const shotDir = path.join(GAME, 'screenshots', SHOTS);
const idx = JSON.parse(read(path.join(shotDir, 'shots.json'), 'null'));
if (!idx) { console.error(`no screenshots/${SHOTS}/shots.json: run tools/shots-gpu.mjs first`); process.exit(1); }
const byId = {};
for (const s of idx.shots) (byId[s.id] = byId[s.id] || { title: s.title, cats: s.cats, rows: [] }).rows.push(s);
let index = `GPU: ${idx.gpu ? idx.gpu.renderer : 'unknown'}. Tiers captured: ${idx.tiers.join(', ')}.\n\n| Id | Moment | Main categories | Frames | Close-ups | Strip |\n|---|---|---|---|---|---|\n`;
for (const [id, s] of Object.entries(byId)) {
  const frames = s.rows.map((r) => `\`${r.file.replace(/\.png$/, '')}\``).join(', ');
  const crops = [...new Set(s.rows.flatMap((r) => r.crops.map((c) => `\`${c.file.replace(/\.png$/, '')}\``)))].join(', ') || '—';
  const strips = [...new Set(s.rows.filter((r) => r.strip).map((r) => `\`${r.strip.replace(/\.png$/, '')}\``))].join(', ') || '—';
  index += `| ${id} | ${s.title} | ${s.cats.join(', ')} | ${frames} | ${crops} | ${strips} |\n`;
}
const sheets = fs.existsSync(path.join(shotDir, 'sheets')) ? fs.readdirSync(path.join(shotDir, 'sheets')).filter((f) => f.endsWith('.png')) : [];
if (sheets.length) index += `\nContact sheets for a first sweep (the full-size files stay the evidence): ${sheets.map((f) => `\`sheets/${f}\``).join(', ')}.\n`;

const abFiles = fs.existsSync(path.join(shotDir, 'ab')) ? fs.readdirSync(path.join(shotDir, 'ab')).filter((f) => f.endsWith('.png')).sort() : [];
const ab = abFiles.length
  ? `${abFiles.length} pairs in \`screenshots/${SHOTS}/ab/\`. Each image shows the same moment from two builds, **A** on the left and **B** on the right. One of them is this loop's build and the other is the previous one; which is which is hidden from you, and A is the same build in every pair. Files: ${abFiles.map((f) => `\`ab/${f.replace(/\.png$/, '')}\``).join(', ')}.`
  : '(no previous loop to compare: this is the baseline. Leave `ab` out of your JSON block.)';

const changes = read(path.join(loopDir, 'CHANGES.md'), '(none recorded)').trim();
let perf = '(not measured)';
const pj = JSON.parse(read(path.join(loopDir, 'perf.json'), 'null'));
if (pj) {
  const g = {};
  for (const r of pj.rows) { const k = `${r.label} · ${r.tier} · ${r.viewport}${r.throttle > 1 ? ` · ${r.throttle}× CPU` : ''}`; (g[k] = g[k] || []).push(r); }
  perf = '| Proxy · tier · viewport | min fps | worst p95 (ms) | worst task (ms) | calls | triangles |\n|---|---|---|---|---|---|\n' +
    Object.entries(g).map(([k, rs]) => `| ${k} | ${Math.min(...rs.map((r) => r.fps)).toFixed(0)} | ${Math.max(...rs.map((r) => r.p95)).toFixed(1)} | ${Math.max(...rs.map((r) => r.taskMs)).toFixed(1)} | ${Math.max(...rs.map((r) => r.calls))} | ${(Math.max(...rs.map((r) => r.tris)) / 1000).toFixed(0)}k |`).join('\n') +
    '\n\n(vsync off: fps above 60 is headroom, not what players see. "swiftshader" is software GL, a pessimistic phone-GPU floor.)';
}
const gates = read(path.join(loopDir, 'gates.json'), '').trim();

const fill = (tpl, extra = {}) => tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => ({ LOOP: N, SHOTS, TIER, GAME: REL, INDEX: index, AB: ab, CHANGES: changes, PERF: perf,
  GATES: gates ? '```json\n' + gates + '\n```' : '(not recorded)', ROLE: 'critic-claude (Critic A) or critic-codex (Critic B), as assigned', DRIFT: '', ...extra })[k] ?? m);
const briefs = path.join(GAME, 'reviews', 'briefs');
fs.writeFileSync(path.join(loopDir, 'brief.md'), fill(read(path.join(briefs, 'critic.md'))));
fs.writeFileSync(path.join(loopDir, 'brief-advocate.md'), fill(read(path.join(briefs, 'advocate.md'))));
fs.writeFileSync(path.join(loopDir, 'brief-prosecutor.md'), fill(read(path.join(briefs, 'prosecutor.md'))));
let drift = '';
if (N > 0 && N % 3 === 0) {
  const bench = fs.existsSync(BENCH) ? fs.readdirSync(BENCH).filter((f) => /^calib-.*\.jpe?g$/.test(f)).sort() : [];
  if (bench.length) {
    const pick = bench[(N / 3 - 1) % bench.length];
    fs.copyFileSync(path.join(BENCH, pick), path.join(loopDir, 'calibration.jpg'));
    fs.writeFileSync(path.join(loopDir, '.calibration'), pick + '\n');
    drift = `- **Calibration:** also open \`${REL}/reviews/loop-${N}/calibration.jpg\`, an unlabeled reference frame. Score its \`materials\` and \`lighting\` on the rubric anchors alone, and add \`"calibration": {"materials": x, "lighting": y}\` to your JSON block.`;
  }
}
fs.writeFileSync(path.join(loopDir, 'brief-judge.md'), fill(read(path.join(briefs, 'judge.md')), { DRIFT: drift }));
console.log(`reviews/loop-${N}/: brief.md, brief-advocate.md, brief-prosecutor.md, brief-judge.md${drift ? ', calibration.jpg' : ''} (${Object.keys(byId).length} moments, ${abFiles.length} A/B pairs, tier ${TIER})`);
