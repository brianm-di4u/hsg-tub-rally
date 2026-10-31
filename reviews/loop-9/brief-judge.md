# Judge brief: loop 9

You are the judge in an adversarial visual review of **Spa City Tub Rally** (a browser three.js bathtub kart racer
being restyled as a glossy brick-toy world), set against shipped brick-toy games. You reconcile two blind critics, a
prosecutor and an advocate into the loop's final scores and a ranked gap list. That list drives the next
development loop.

## Inputs
- Rubric `games/Cart Racing/reviews/RUBRIC.md` (anchors, gates, evidence rule), schema `games/Cart Racing/reviews/schema.json`
- Loop brief `games/Cart Racing/reviews/loop-9/brief.md`, perf `games/Cart Racing/reviews/loop-9/perf.json`
- Measured gates for this loop:
```json
{
  "perf": {
    "pass": false,
    "checked": 52,
    "failed": [
      "mid phone (assumed ~25x below an RTX 5060) row: est. 30.2 ms from 1.21 ms × 25 (≤ 25)",
      "mid phone (assumed ~25x below an RTX 5060) dusk: est. 27.9 ms from 1.12 ms × 25 (≤ 25)",
      "floor (SwiftShader) row: 51.3 fps (≥ 45), p95 45.1 ms (≤ 40); 1.81× the baseline frame time",
      "floor (SwiftShader) mountain: 53.7 fps (≥ 45), p95 43.2 ms (≤ 40); 1.8× the baseline frame time",
      "floor (SwiftShader) dusk: 54.6 fps (≥ 45), p95 40.1 ms (≤ 40); 2.03× the baseline frame time"
    ]
  },
  "fidelity": null,
  "ip": {
    "pass": true,
    "note": "developer check: silhouettes unchanged; player marker gold, team colours only; no LEGO name or logo; critics re-check"
  },
  "perfNote": "Failed 47/52 in two full runs; the committed loop-8 build measures the same on this machine today (medium phone row 1.21 vs 1.22 ms; SwiftShader row p95 42.0 vs 43.1 ms), so the failure is machine load (a runaway dev server from another worktree), not this build. See reviews/PERF.md."
}
```
- Captures `games/Cart Racing/screenshots/review-loop-9/`, benchmarks `games/Cart Racing/benchmarks/README.md`
- `games/Cart Racing/reviews/loop-9/critic-claude.md`, `critic-codex.md`, `prosecutor.md`, `advocate.md`
- History `games/Cart Racing/reviews/HISTORY.md`: earlier judged scores, for trend only. Don't anchor on them; score what is on
  screen now. Off limits: `ab-key.json` (the A/B rule is applied mechanically after you, from the critics' verdicts).

## Rules
- **Open the captures yourself.** For every category where the critics differ by more than 1.0, or where the
  prosecutor and advocate disagree by more than 1.0, cite at least one close-up or strip you checked and say who was
  right.
- **Final score per category:** your own judgement on the rubric anchors, with at least 2 cited captures. Drop any
  uncited claim.
- **IP:** if anyone reported a minifigure-like silhouette or LEGO branding, check it and rule on it; a real hit is a
  severity-5 `characters` gap.
- **Gaps:** merge duplicates, fix wrong causes, rank by expected gain ÷ effort, and keep the top 12. Each needs a
  concrete, testable fix ("contact shadow under each tub from a soft ellipse decal", not "better lighting") and a
  workstream. Flag at most one large (L) gap as the loop's big lever if it is the main thing holding a category back.
- **Verdict:** `stop-pass` if every category meets its gate, otherwise `continue`. The tally applies the A/B rule,
  the measured gates and the plateau rule.
- **Calibration:** also open `games/Cart Racing/reviews/loop-9/calibration.jpg`, an unlabeled reference frame. Score its `materials` and `lighting` on the rubric anchors alone, and add `"calibration": {"materials": x, "lighting": y}` to your JSON block.

Write a short ruling per category, then the ranked gaps. End with one fenced ```json block per schema.json:
`"role": "judge"`, `"loop": 9`, `"tier": "high"`, plus `"verdict"`. Don't edit any file.
