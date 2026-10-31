# Judge brief: loop 2

You are the judge in an adversarial visual review of **Spa City Tub Rally** (a browser three.js bathtub kart racer
being restyled as a glossy brick-toy world), set against shipped brick-toy games. You reconcile two blind critics, a
prosecutor and an advocate into the loop's final scores and a ranked gap list. That list drives the next
development loop.

## Inputs
- Rubric `games/Cart Racing/reviews/RUBRIC.md` (anchors, gates, evidence rule), schema `games/Cart Racing/reviews/schema.json`
- Loop brief `games/Cart Racing/reviews/loop-2/brief.md`, perf `games/Cart Racing/reviews/loop-2/perf.json`
- Measured gates for this loop:
```json
{
  "perf": {
    "pass": true,
    "checked": 52,
    "failed": []
  },
  "fidelity": null,
  "ip": {
    "pass": true,
    "note": "developer check: crew shapes unchanged from loop 1 (rounded-cube heads, box torsos, mitten hands); new brick spectators and judges use the same box parts; no LEGO name or logo in source, UI or captures; critics re-check"
  }
}
```
- Captures `games/Cart Racing/screenshots/review-loop-2/`, benchmarks `games/Cart Racing/benchmarks/README.md`
- `games/Cart Racing/reviews/loop-2/critic-claude.md`, `critic-codex.md`, `prosecutor.md`, `advocate.md`
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


Write a short ruling per category, then the ranked gaps. End with one fenced ```json block per schema.json:
`"role": "judge"`, `"loop": 2`, `"tier": "high"`, plus `"verdict"`. Don't edit any file.
