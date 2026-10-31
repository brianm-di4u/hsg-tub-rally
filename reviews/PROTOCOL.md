# Adversarial review loop: protocol (brick campaign)

The brick-toy visual campaign runs as a loop: **build → gates → capture → blind critiques → prosecutor and
advocate → judge → tally → develop**. Adapted from `games/football/reviews/PROTOCOL.md` (Hot Springs Games), with
changes that answer why the football loop stalled near 50/80 (see "Changes from football"). `RUBRIC.md` defines the
scores, `schema.json` the output shape, `briefs/` the role prompts.

## Roles
| Role | Who | Sees | Must not see |
|---|---|---|---|
| Critic A | Claude subagent, `briefs/critic.md` | this loop's captures and A/B pairs, the rubric, the benchmarks, the loop brief | any prior score, `HISTORY.md`, `ab-key.json`, other `loop-*` folders, the other reviewers |
| Critic B | Codex (GPT-6.1 Sol) via the `codex:codex-rescue` subagent, `briefs/critic.md` + `briefs/codex-wrapper.md` | same as Critic A | same as Critic A |
| Prosecutor | Claude subagent, `briefs/prosecutor.md` | both critiques, the captures, `CHANGES.md` | `HISTORY.md`, `ab-key.json` |
| Advocate | Claude subagent, `briefs/advocate.md` | both critiques, the captures, `CHANGES.md` | `HISTORY.md`, `ab-key.json`, the prosecutor |
| Judge | Claude subagent, `briefs/judge.md` | everything above, plus `HISTORY.md` (trend only) and the perf and gate files | `ab-key.json` |

The developer (the main session) writes `CHANGES.md` (facts only), opens every capture before the review, and never
edits a reviewer's output.

## Blindness
- Critics run in parallel. Their outputs are held in the developer's scratch folder and copied to
  `loop-N/critic-claude.md` and `loop-N/critic-codex.md` only after both have returned. The prosecutor and the
  advocate run in parallel after that (neither sees the other), then the judge.
- Briefs carry no prior score and no developer opinion of quality.
- **A/B pairs** (`screenshots/review-loop-N/ab/`): every frame, close-up and strip beside the same capture from the
  previous loop. The new build is on the same side (A or B) for the whole loop, chosen by a seeded coin flip; the
  side is written only to `loop-N/ab-key.json`. Critics give one verdict per category: A, B or tie.
- Every third loop the judge also scores an unlabeled benchmark frame (`calibration.jpg`); more than 1 point off its
  anchor sets `"drift": true`.

## The loop (N = loop number)
1. `npm run build`, then `npm test -- --milestone final --gpu` and `--file-url`: all green.
2. Measured gates → `loop-N/gates.json` (`{"perf": {"pass": …}, "fidelity": {"pass": …}, "ip": {"pass": …}}`):
   `node tools/perf-gpu.mjs --out=reviews/loop-N/perf.json` (real GPU), again with `--throttle=4 --viewports=mobile
   --tiers=low,medium`, and with `--swiftshader --viewports=mobile --tiers=low`; check against
   `tools/perf-budgets.json`. Fidelity from `tools/fidelity.mjs` once the Gold Master exists (null before).
3. `node tools/shots-gpu.mjs review-loop-N --tiers=high,low --verify` (all problems fixed before review).
4. `node tools/review-sheets.mjs review-loop-N --ab=review-loop-<N-1> --loop=N` (contact sheets, A/B pairs).
5. The developer opens every capture and writes `loop-N/CHANGES.md`.
6. `node tools/review-prep.mjs N` writes the briefs.
7. Critics A and B in parallel → prosecutor and advocate in parallel → judge.
8. `node tools/review-tally.mjs N`: validates every JSON block, applies the A/B rule, writes `scores.json` and
   `gaps.json`, updates `HISTORY.md`, applies the stop rule, prints the backlog.
9. Develop the selected backlog; sync to `repos/hsg-tub-rally` and commit there on `brick-visuals` with
   `reviews/loop-N/` (PNGs stay git-ignored); then N+1.

## Scoring rules
- **A/B rule:** a category's score may differ from the last loop only in the direction both critics' A/B verdicts
  agree on (new build better → it may rise; worse → it may fall). Otherwise the tally holds the previous score and
  records it under "held".
- **Backlog:** priority = expectedGain × weight ÷ effort cost (weight 1.5 below the gate, 1.0 otherwise, 0.3 once
  1 above; cost S = 1, M = 2, L = 4). The best large (L) gap always takes a reserved **big-lever** slot; the rest
  fill 8 effort points. A category that falls by 0.5 or more forces a regression gap to the top.
- **Foundation loops 1–4** build the planned big systems (render foundation, characters and tubs, scenery, UI) on
  top of whatever the judge selects; from loop 5 the judge's backlog drives.

## Stop rule
- **Pass:** every category meets its gate and every measured gate passes.
- **Plateau:** 3 loops in a row without a new best total (at least 1.0 above the previous best).
- **Cap:** loop 12.
On stop: a campaign section in `REPORT.md` with the final scores, before/after sheets and the remaining gaps.

## Changes from football (its lessons)
| Football | Here |
|---|---|
| ±0.5 judge noise moved scores both ways every loop; forced regression gaps followed | the A/B rule |
| "Stagnant" only if no category rose, so it never fired | plateau on the best total |
| Large gaps (L = 4 of 8 points) were never picked | a reserved big-lever slot |
| The "phone" proxy throttled only the CPU | also a software-GL (SwiftShader) floor |
| Two critics, an advocate, a judge | adds a prosecutor so the advocate's push up is balanced |

## Effects allowed in the renderer
Only stateless effects (no TAA, no temporal accumulation or history buffers) so captures repeat exactly; captures
freeze the render clock with `__game.act('clock', ms)`, and particles only spawn while time moves.
