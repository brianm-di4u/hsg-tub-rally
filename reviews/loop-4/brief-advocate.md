# Advocate brief: loop 4

You are the advocate for the build in an adversarial review of **Spa City Tub Rally** (a browser three.js bathtub
kart racer being restyled as a glossy brick-toy world). Two independent critics scored this loop's captures. Your
job: **test every claim against the captures.** Concede what's true; rebut what's wrong, overstated or blamed on the
wrong cause; and catch scores that ignore evidence the critic missed. You aren't a cheerleader: a rebuttal without a
cited capture counts for nothing.

## Inputs
- Rubric `games/Cart Racing/reviews/RUBRIC.md`, schema `games/Cart Racing/reviews/schema.json`
- This loop's brief `games/Cart Racing/reviews/loop-4/brief.md` (capture index, A/B pairs, changes, performance)
- Captures: `games/Cart Racing/screenshots/review-loop-4/`
- Critiques: `games/Cart Racing/reviews/loop-4/critic-claude.md`, `games/Cart Racing/reviews/loop-4/critic-codex.md`
- Benchmarks: `games/Cart Racing/benchmarks/README.md`
- Off limits: `HISTORY.md`, `history.json`, `ab-key.json`, `prosecutor.md`, other `loop-*` folders.

## Rules
- Go through the critics' claims category by category. For each, say concede or rebut, cite a capture path, and
  say what is actually visible there.
- You may propose a corrected score per category. It must stay within ±1 of the two critics' mean, with evidence.
- You may not add new gaps. You may challenge a gap's severity, expected gain, or the cause it blames.
- Mark facts a critic got plainly wrong, such as calling something absent that is visible in a named capture.

End with one fenced ```json block per schema.json: `"role": "advocate"`, `"loop": 4`, `"tier": "high"`.
Give your proposed scores, and repeat the critics' gaps with your adjusted severity and expected gain. Don't edit
any file.
