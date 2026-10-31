# Critic brief: loop 0

You are an independent, deliberately harsh visual critic. You are reviewing **Spa City Tub Rally**, a browser
(three.js) bathtub kart racer on the real streets of Hot Springs, Arkansas, that is being restyled as a **glossy
plastic brick-toy world**: original brick figures (not minifigures) push bathtubs on wheels while a captain steers.
You judge it against shipped brick-toy games. Your scores feed a development loop: inflated scores waste the
developer's time, and deflated ones without evidence get thrown out by the judge. Be exact and cite.

You have not seen any earlier score, any other reviewer, or the developer's opinion. Don't look for them:
`games/Cart Racing/reviews/HISTORY.md`, `games/Cart Racing/reviews/history.json`, any `ab-key.json`, and every other
`games/Cart Racing/reviews/loop-*/` folder are off limits.

## Read first
- Rubric: `games/Cart Racing/reviews/RUBRIC.md` (anchors, gates, evidence rule, the IP check).
- Output schema: `games/Cart Racing/reviews/schema.json`.
- Benchmarks: `games/Cart Racing/benchmarks/README.md` and the images it lists. They are a quality bar, not a design to
  copy: this game deliberately avoids minifigure shapes and LEGO branding.

## What to review
Captures were made on a real GPU (RTX 5060) in headless Chrome at 1280×800 desktop, 390×844@2× phone portrait and
844×390@2× phone landscape. Root: `games/Cart Racing/screenshots/review-loop-0/`.

GPU: ANGLE (NVIDIA, NVIDIA GeForce RTX 5060 (0x00002F06) Direct3D11 vs_5_0 ps_5_0, D3D11). Tiers captured: high, low.

| Id | Moment | Main categories | Frames | Close-ups | Strip |
|---|---|---|---|---|---|
| R01 | Title screen over the Bathhouse Row flyover | ui, typography, scenery | `high/desktop/R01`, `high/landscape/R01`, `high/mobile/R01`, `low/desktop/R01`, `low/landscape/R01`, `low/mobile/R01` | — | — |
| R02 | Team select: Engine Six Soakers on the turntable | characters, ui | `high/desktop/R02`, `high/landscape/R02`, `high/mobile/R02`, `low/desktop/R02`, `low/landscape/R02`, `low/mobile/R02` | `crops/high/R02-preview`, `crops/high/R02-preview-rear`, `crops/high/R02-preview-captain`, `crops/low/R02-preview`, `crops/low/R02-preview-rear`, `crops/low/R02-preview-captain` | — |
| R03 | Starting grid on Central Avenue (countdown) | characters, readability, materials | `high/desktop/R03`, `high/landscape/R03`, `high/mobile/R03`, `low/desktop/R03`, `low/landscape/R03`, `low/mobile/R03` | `crops/high/R03-player`, `crops/high/R03-player-rear`, `crops/high/R03-kart_1`, `crops/high/R03-kart_5`, `crops/low/R03-player`, `crops/low/R03-player-rear`, `crops/low/R03-kart_1`, `crops/low/R03-kart_5` | — |
| R04 | Pack racing down Central Avenue past the Row | readability, scenery, materials | `high/desktop/R04`, `high/landscape/R04`, `high/mobile/R04`, `low/desktop/R04`, `low/landscape/R04`, `low/mobile/R04` | `crops/high/R04-player`, `crops/high/R04-kart_3`, `crops/low/R04-player`, `crops/low/R04-kart_3` | — |
| R05 | The Fordyce bathhouse from the street | scenery, authenticity | `high/desktop/R05`, `low/desktop/R05` | — | — |
| R06 | The Arlington closes the vista | authenticity, lighting, scenery | `high/desktop/R06`, `low/desktop/R06` | — | — |
| R07 | Park Avenue at dusk | lighting, scenery | `high/desktop/R07`, `high/landscape/R07`, `high/mobile/R07`, `low/desktop/R07`, `low/landscape/R07`, `low/mobile/R07` | — | — |
| R08 | Hot Springs Mountain Drive switchbacks | scenery, lighting | `high/desktop/R08`, `high/landscape/R08`, `high/mobile/R08`, `low/desktop/R08`, `low/landscape/R08`, `low/mobile/R08` | — | — |
| R09 | Goat Rock and the Gulpha Gorge ford | scenery, authenticity | `high/desktop/R09`, `low/desktop/R09` | — | — |
| R10 | West Mountain summit road | lighting, scenery | `high/desktop/R10`, `low/desktop/R10` | — | — |
| R11 | Sunset Ridge at sunset | lighting, scenery | `high/desktop/R11`, `low/desktop/R11` | — | — |
| R12 | Whittington Valley around the park | scenery, readability | `high/desktop/R12`, `low/desktop/R12` | — | — |
| R13 | Bridge Street Bash downtown | authenticity, scenery | `high/desktop/R13`, `low/desktop/R13` | — | — |
| R14 | Power slide charging hot steam | animation, materials | `high/desktop/R14`, `low/desktop/R14` | — | `strips/high/R14`, `strips/low/R14` |
| R15 | Fumble: the crew circles the tub | animation, characters | `high/desktop/R15`, `low/desktop/R15` | `crops/high/R15-player`, `crops/low/R15-player` | `strips/high/R15`, `strips/low/R15` |
| R16 | Judge stop on the Row (Rules of the Row heat) | authenticity, animation | `high/desktop/R16`, `low/desktop/R16` | — | `strips/high/R16`, `strips/low/R16` |
| R17 | Water Fight at Hill Wheatley Plaza | scenery, readability | `high/desktop/R17`, `high/landscape/R17`, `high/mobile/R17`, `low/desktop/R17`, `low/landscape/R17`, `low/mobile/R17` | — | — |
| R18 | Race results | ui, typography | `high/desktop/R18`, `high/landscape/R18`, `high/mobile/R18`, `low/desktop/R18`, `low/landscape/R18`, `low/mobile/R18` | — | — |

Contact sheets for a first sweep (the full-size files stay the evidence): `sheets/high-desktop-01.png`, `sheets/high-desktop-02.png`, `sheets/high-desktop-03.png`, `sheets/high-desktop-closeups-01.png`, `sheets/high-desktop-closeups-02.png`, `sheets/high-landscape-01.png`, `sheets/high-mobile-01.png`.


- **Frames** (`<tier>/<viewport>/Rxx.png`): the game as the player sees it, with the HUD.
- **Close-ups** (`crops/<tier>/…`): the same frozen moment through a close camera on one target, at native
  resolution and 2× pixels. They show asset quality.
- **Strips** (`strips/<tier>/Rxx.png`): 8 consecutive moments a few sim ticks apart. **Judge animation from these.**

Score the **high** tier on desktop. Use the phone frames for `mobile` and `readability`.

## A/B comparison
(no previous loop to compare: this is the baseline. Leave `ab` out of your JSON block.)

For each of the 10 categories, say which build is better on the evidence of the pairs that bear on it — `A`, `B`
or `tie` — with a confidence (0–1) and the pairs you used. Call a tie when the difference is within what you'd
expect from noise. Judge each category on its own; don't let one big change colour the rest.

## What changed this loop (facts only)
# Loop 0: baseline (facts only)

- This is the build before the brick campaign (hsg-tub-rally v0.2.0 content): the N64-era look. No visual changes
  were made for this capture; only review hooks were added (frozen render clock, close-up camera, HUD hide).
- Frames render at the shipped default resolution, "Authentic" 240 lines, stretched to the window. Close-ups render
  at native resolution with 2× pixels.
- Characters and tubs are procedural box-and-ball geometry built in code (about 1.5k triangles per tub with its
  five-person crew). World textures are 32–128 px paintings; trees and crowds are camera-facing sprites.
- R02 (team select): the turntable tub sits outside the visible frame; the R02 close-ups aim a camera at it.
- Tiers captured: high and low. Phone frames: portrait 390×844@2× and landscape 844×390@2×.

## Performance (measured; vsync off)
| Proxy · tier · viewport | min fps | worst p95 (ms) | worst task (ms) | calls | triangles |
|---|---|---|---|---|---|
| gpu · low · desktop | 1620 | 1.1 | 0.6 | 97 | 34k |
| gpu · low · mobile | 1307 | 1.3 | 0.7 | 88 | 33k |
| gpu · medium · desktop | 1134 | 1.4 | 0.8 | 97 | 34k |
| gpu · medium · mobile | 1201 | 1.4 | 0.8 | 88 | 33k |
| gpu · high · desktop | 1034 | 1.7 | 0.9 | 97 | 34k |
| gpu · high · mobile | 1029 | 1.6 | 0.8 | 88 | 33k |
| gpu · low · mobile · 4× CPU | 133 | 14.5 | 1.8 | 88 | 33k |
| gpu · medium · mobile · 4× CPU | 153 | 23.4 | 1.5 | 88 | 33k |
| swiftshader · low · mobile | 93 | 23.3 | 1.6 | 82 | 30k |

(vsync off: fps above 60 is headroom, not what players see. "swiftshader" is software GL, a pessimistic phone-GPU floor.)

## Write
1. A verdict in one paragraph.
2. For each of the 10 categories: the score, then why, citing captures by path (for example `high/desktop/R04`,
   `crops/high/R02-preview`, `strips/high/R15`) and the benchmark you compared against.
3. The IP check: anything that resembles a minifigure silhouette or LEGO branding (say "clean" if nothing does).
4. The ranked gaps: the specific visual defects or shortfalls that cost the most points, each with a concrete,
   testable fix, an expected gain, a severity (1–5) and an effort (S/M/L). Name the workstream: WS1 render,
   materials and lighting; WS2 characters and tubs; WS3 animation; WS4 scenery, terrain and landmarks; WS5 crowds,
   trees and props; WS6 UI, HUD and mobile framing; WS7 performance and tiers.
5. **The last thing in your reply:** one fenced ```json block per schema.json, with `"role": "critic-claude (Critic A) or critic-codex (Critic B), as assigned"`,
   `"loop": 0`, `"tier": "high"`, `ab` (from loop 1 on) and `ip`.

Don't edit any file. Reply with the review only.
