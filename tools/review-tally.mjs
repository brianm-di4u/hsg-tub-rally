#!/usr/bin/env node
// Closes review loop N (adapted from games/football/tools/review-tally.mjs, Hot Springs Games, MIT). Validates the
// JSON block that ends each review (reviews/schema.json), applies the A/B rule, writes scores.json and gaps.json,
// updates reviews/HISTORY.md, applies the stop rule (reviews/PROTOCOL.md) and prints the backlog for the next loop.
//
// Differences from football, from its lessons:
// - A/B rule: a category's score may move from the last loop only in the direction both blind critics' A/B verdicts
//   agree on (this build better → may rise; worse → may fall); otherwise it holds. Single-score noise can't move it.
// - Plateau: stop after 3 loops in a row without a new best total by ≥ 1.0 (not "no category rose").
// - Backlog: the best large (L) gap always gets a reserved slot, plus 8 effort points for the rest.
//
//   node tools/review-tally.mjs <N> [--validate]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const N = +args.find((a) => /^\d+$/.test(a));
if (!(N >= 0)) { console.error('usage: review-tally.mjs <N> [--validate]'); process.exit(2); }
const REV = path.join(GAME, 'reviews'), loopDir = path.join(REV, `loop-${N}`);
const CATS = ['characters', 'materials', 'scenery', 'lighting', 'animation', 'ui', 'typography', 'readability', 'mobile', 'authenticity'];
const GATE = Object.fromEntries(CATS.map((c) => [c, c === 'authenticity' ? 6 : 7]));
const MEASURED = ['perf', 'fidelity', 'ip'];
const WS = ['WS1', 'WS2', 'WS3', 'WS4', 'WS5', 'WS6', 'WS7'];
const COST = { S: 1, M: 2, L: 4 }, CAPACITY = 8, STALLS = 3, CAP = 12, BEST_STEP = 1.0;

function block(file) {
  const t = fs.readFileSync(file, 'utf8');
  const all = [...t.matchAll(/```json\s*([\s\S]*?)```/g)];
  if (!all.length) throw new Error(`${path.basename(file)}: no json block`);
  return JSON.parse(all[all.length - 1][1]);
}
function check(j, role, errs) {
  if (j.loop !== N) errs.push(`${role}: loop ${j.loop} != ${N}`);
  for (const c of CATS) {
    const s = j.scores && j.scores[c];
    if (!s) { errs.push(`${role}: missing score ${c}`); continue; }
    if (!(s.score >= 1 && s.score <= 10) || Math.round(s.score * 2) !== s.score * 2) errs.push(`${role}: ${c} score ${s.score} not in 1..10 by 0.5`);
    if (['critic-claude', 'critic-codex', 'judge'].includes(role) && (!Array.isArray(s.evidence) || s.evidence.length < 2)) errs.push(`${role}: ${c} has fewer than 2 cited captures`);
  }
  if (N > 0 && role.startsWith('critic')) for (const c of CATS) {
    const v = j.ab && j.ab[c];
    if (!v || !['A', 'B', 'tie'].includes(v.winner)) errs.push(`${role}: ab.${c} missing or not A/B/tie`);
  }
  for (const g of j.gaps || []) {
    if (!/^G-[a-z0-9-]+$/.test(g.id || '')) errs.push(`${role}: bad gap id ${g.id}`);
    if (!CATS.includes(g.category)) errs.push(`${role}: gap ${g.id} bad category ${g.category}`);
    if (!COST[g.effort]) errs.push(`${role}: gap ${g.id} bad effort ${g.effort}`);
    if (!WS.includes(g.workstream)) errs.push(`${role}: gap ${g.id} bad workstream ${g.workstream}`);
  }
}

const files = { 'critic-claude': 'critic-claude.md', 'critic-codex': 'critic-codex.md', prosecutor: 'prosecutor.md', advocate: 'advocate.md', judge: 'judge.md' };
const got = {}, errs = [];
for (const [role, f] of Object.entries(files)) {
  const p = path.join(loopDir, f);
  if (!fs.existsSync(p)) { if (args.includes('--validate') && !role.startsWith('critic')) continue; errs.push(`missing ${f}`); continue; }
  try { got[role] = block(p); check(got[role], role, errs); } catch (e) { errs.push(String(e.message)); }
}
if (errs.length) { console.error(`✗ loop ${N}:\n  ${errs.join('\n  ')}`); process.exit(1); }
if (args.includes('--validate')) { console.log(`✓ loop ${N}: ${Object.keys(got).join(', ')} valid`); process.exit(0); }

const histPath = path.join(REV, 'history.json');
const hist = fs.existsSync(histPath) ? JSON.parse(fs.readFileSync(histPath, 'utf8')) : { loops: [] };
const J = got.judge, prev = hist.loops.filter((l) => l.loop < N).sort((a, b) => b.loop - a.loop)[0];

// A/B: decode each critic's verdict per category to new / old / tie
const key = JSON.parse((() => { try { return fs.readFileSync(path.join(loopDir, 'ab-key.json'), 'utf8'); } catch { return 'null'; } })());
const decode = (w) => (w === 'tie' || !key ? 'tie' : w === key.newSide ? 'new' : 'old');
const abv = {}, held = [];
const judged = Object.fromEntries(CATS.map((c) => [c, J.scores[c].score]));
const scores = { ...judged };
for (const c of CATS) {
  if (!prev || !key) continue;
  const v = ['critic-claude', 'critic-codex'].map((r) => decode(got[r].ab[c].winner));
  abv[c] = v;
  const agree = v[0] === v[1] ? v[0] : 'split';
  const p = prev.scores[c];
  if (judged[c] > p && agree !== 'new') { scores[c] = p; held.push(`${c} ${judged[c]}→${p} (A/B ${v.join('/')})`); }
  if (judged[c] < p && agree !== 'old') { scores[c] = p; held.push(`${c} ${judged[c]}→${p} (A/B ${v.join('/')})`); }
}
const total = CATS.reduce((s, c) => s + scores[c], 0);
const gatesJ = JSON.parse((() => { try { return fs.readFileSync(path.join(loopDir, 'gates.json'), 'utf8'); } catch { return '{}'; } })());
const measured = Object.fromEntries(MEASURED.map((m) => [m, gatesJ[m] && typeof gatesJ[m] === 'object' ? !!gatesJ[m].pass : gatesJ[m] ?? null]));
const best = prev ? Math.max(prev.best ?? prev.total, prev.total) : -Infinity;
const newBest = total >= best + BEST_STEP || !prev;
const stalls = newBest ? 0 : (prev.stalls || 0) + 1;
const pass = CATS.every((c) => scores[c] >= GATE[c]) && MEASURED.every((m) => measured[m] === true);
const verdict = pass ? 'stop-pass' : stalls >= STALLS ? 'stop-stagnant' : N >= CAP ? 'stop-cap' : 'continue';
const critics = Object.fromEntries(['critic-claude', 'critic-codex', 'prosecutor', 'advocate'].filter((r) => got[r]).map((r) => [r, Object.fromEntries(CATS.map((c) => [c, got[r].scores[c].score]))]));
const entry = { loop: N, scores, judged, total, best: Math.max(best, total), stalls, verdict, held, ab: abv, measured, critics, calibration: J.calibration || null, date: new Date().toISOString().slice(0, 10) };
hist.loops = [...hist.loops.filter((l) => l.loop !== N), entry].sort((a, b) => a.loop - b.loop);
fs.writeFileSync(histPath, JSON.stringify(hist, null, 2) + '\n');

// backlog: judge gaps by priority; regressions first; the best L gap gets the reserved big-lever slot
const weight = (c) => (scores[c] < GATE[c] ? 1.5 : scores[c] >= GATE[c] + 1 ? 0.3 : 1);
const gaps = (J.gaps || []).map((g) => ({ ...g, priority: +(g.expectedGain * weight(g.category) / COST[g.effort]).toFixed(3) }));
if (prev) for (const c of CATS) if (prev.scores[c] - scores[c] >= 0.5) gaps.push({ id: `G-regression-${c}`, category: c, expectedGain: prev.scores[c] - scores[c], severity: 5, effort: 'S', workstream: 'WS7', fix: `Find and undo what lowered ${c} since loop ${prev.loop}`, priority: 99 });
gaps.sort((a, b) => b.priority - a.priority);
const lever = gaps.filter((g) => g.effort === 'L').sort((a, b) => b.expectedGain * weight(b.category) - a.expectedGain * weight(a.category))[0];
if (lever) lever.bigLever = true;
let room = CAPACITY;
for (const g of gaps) { if (g.bigLever) { g.selected = true; continue; } g.selected = room - COST[g.effort] >= 0; if (g.selected) room -= COST[g.effort]; }
fs.writeFileSync(path.join(loopDir, 'scores.json'), JSON.stringify({ loop: N, scores, judged, total, best: entry.best, held, ab: abv, measured, critics, gates: GATE, verdict }, null, 2) + '\n');
fs.writeFileSync(path.join(loopDir, 'gaps.json'), JSON.stringify(gaps, null, 2) + '\n');

// HISTORY.md
const cap = (c) => c[0].toUpperCase() + c.slice(1);
const head = `| Loop | ${CATS.map(cap).join(' | ')} | Total | Δ | Best | Stalls | Perf | Fidelity | IP | Verdict |\n|${'---|'.repeat(CATS.length + 9)}\n`;
const mark = (v) => (v === true ? '✓' : v === false ? '✗' : '—');
const rows = hist.loops.map((l, i) => {
  const p = hist.loops[i - 1];
  const d = p ? (l.total - p.total >= 0 ? '+' : '') + (l.total - p.total).toFixed(1) : '—';
  return `| ${l.loop} | ${CATS.map((c) => `${l.scores[c]}${l.scores[c] >= GATE[c] ? ' ✓' : ''}`).join(' | ')} | ${l.total.toFixed(1)} | ${d} | ${(l.best ?? l.total).toFixed(1)} | ${l.stalls} | ${mark(l.measured?.perf)} | ${mark(l.measured?.fidelity)} | ${mark(l.measured?.ip)} | ${l.verdict} |`;
}).join('\n');
const roles = ['critic-claude', 'critic-codex', 'prosecutor', 'advocate'];
const crit = hist.loops.map((l) => `| ${l.loop} | ${roles.map((r) => (l.critics[r] ? CATS.map((c) => l.critics[r][c]).join(' / ') : '—')).join(' | ')} |`).join('\n');
const abRows = hist.loops.filter((l) => l.ab && Object.keys(l.ab).length).map((l) => `| ${l.loop} | ${CATS.map((c) => (l.ab[c] ? l.ab[c].join('/') : '—')).join(' | ')} | ${l.held.length ? l.held.join('; ') : '—'} |`).join('\n');
fs.writeFileSync(path.join(REV, 'HISTORY.md'), `# Review history (judged scores after the A/B rule)\n\nGenerated by tools/review-tally.mjs. Gates: ${CATS.map((c) => `${c} ≥ ${GATE[c]}`).join(', ')}, plus the measured gates (perf, fidelity, IP). ✓ means met.\n\n${head}${rows}\n\n` +
  (abRows ? `## Blind A/B verdicts (Critic A / Critic B: new = this loop's build looked better)\n\n| Loop | ${CATS.map(cap).join(' | ')} | Held by the A/B rule |\n|${'---|'.repeat(CATS.length + 2)}\n${abRows}\n\n` : '') +
  `## Reviewer spread (${CATS.join(' / ')})\n\n| Loop | Critic A (Claude) | Critic B (Codex) | Prosecutor | Advocate |\n|---|---|---|---|---|\n${crit}\n` +
  (hist.loops.some((l) => l.calibration) ? `\n## Calibration (blind benchmark scored by the judge)\n\n${hist.loops.filter((l) => l.calibration).map((l) => `- loop ${l.loop}: ${JSON.stringify(l.calibration)}`).join('\n')}\n` : ''));

console.log(`loop ${N}: ${CATS.map((c) => `${c} ${scores[c]}`).join(', ')} · total ${total.toFixed(1)}${prev ? ` (${total - prev.total >= 0 ? '+' : ''}${(total - prev.total).toFixed(1)})` : ''} · best ${entry.best.toFixed(1)} · stalls ${stalls} → ${verdict}`);
if (held.length) console.log(`held by the A/B rule: ${held.join('; ')}`);
console.log(`measured gates: ${MEASURED.map((m) => `${m} ${mark(measured[m])}`).join(', ')}`);
console.log(`\nbacklog (big lever + ${CAPACITY} points):`);
for (const g of gaps.slice(0, 14)) console.log(`  ${g.bigLever ? '★' : g.selected ? '▶' : ' '} ${g.priority.toFixed(2).padStart(5)}  ${g.workstream.padEnd(4)} ${g.effort} ${g.id}: ${g.fix.slice(0, 110)}`);
