# Critic brief: loop 2

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
844×390@2× phone landscape. Root: `games/Cart Racing/screenshots/review-loop-2/`.

GPU: ANGLE (NVIDIA, NVIDIA GeForce RTX 5060 (0x00002F06) Direct3D11 vs_5_0 ps_5_0, D3D11). Tiers captured: high, low.

| Id | Moment | Main categories | Frames | Close-ups | Strip |
|---|---|---|---|---|---|
| R01 | Title screen over the Bathhouse Row flyover | ui, typography, scenery | `high/desktop/R01`, `high/mobile/R01`, `high/landscape/R01`, `low/desktop/R01`, `low/mobile/R01`, `low/landscape/R01` | — | — |
| R02 | Team select: Engine Six Soakers on the turntable | characters, ui | `high/desktop/R02`, `high/mobile/R02`, `high/landscape/R02`, `low/desktop/R02`, `low/mobile/R02`, `low/landscape/R02` | `crops/high/R02-preview`, `crops/high/R02-preview-rear`, `crops/high/R02-preview-captain`, `crops/low/R02-preview`, `crops/low/R02-preview-rear`, `crops/low/R02-preview-captain` | — |
| R03 | Starting grid on Central Avenue (countdown) | characters, readability, materials | `high/desktop/R03`, `high/mobile/R03`, `high/landscape/R03`, `low/desktop/R03`, `low/mobile/R03`, `low/landscape/R03` | `crops/high/R03-player`, `crops/high/R03-player-rear`, `crops/high/R03-kart_1`, `crops/high/R03-kart_5`, `crops/low/R03-player`, `crops/low/R03-player-rear`, `crops/low/R03-kart_1`, `crops/low/R03-kart_5` | — |
| R04 | Pack racing down Central Avenue past the Row | readability, scenery, materials | `high/desktop/R04`, `high/mobile/R04`, `high/landscape/R04`, `low/desktop/R04`, `low/mobile/R04`, `low/landscape/R04` | `crops/high/R04-player`, `crops/high/R04-kart_3`, `crops/low/R04-player`, `crops/low/R04-kart_3` | — |
| R05 | The Fordyce bathhouse from the street | scenery, authenticity | `high/desktop/R05`, `low/desktop/R05` | — | — |
| R06 | The Arlington closes the vista | authenticity, lighting, scenery | `high/desktop/R06`, `low/desktop/R06` | — | — |
| R07 | Park Avenue at dusk | lighting, scenery | `high/desktop/R07`, `high/mobile/R07`, `high/landscape/R07`, `low/desktop/R07`, `low/mobile/R07`, `low/landscape/R07` | — | — |
| R08 | Hot Springs Mountain Drive switchbacks | scenery, lighting | `high/desktop/R08`, `high/mobile/R08`, `high/landscape/R08`, `low/desktop/R08`, `low/mobile/R08`, `low/landscape/R08` | — | — |
| R09 | Goat Rock and the Gulpha Gorge ford | scenery, authenticity | `high/desktop/R09`, `low/desktop/R09` | — | — |
| R10 | West Mountain summit road | lighting, scenery | `high/desktop/R10`, `low/desktop/R10` | — | — |
| R11 | Sunset Ridge at sunset | lighting, scenery | `high/desktop/R11`, `low/desktop/R11` | — | — |
| R12 | Whittington Valley around the park | scenery, readability | `high/desktop/R12`, `low/desktop/R12` | — | — |
| R13 | Bridge Street Bash downtown | authenticity, scenery | `high/desktop/R13`, `low/desktop/R13` | — | — |
| R14 | Power slide charging hot steam | animation, materials | `high/desktop/R14`, `low/desktop/R14` | — | `strips/high/R14`, `strips/low/R14` |
| R15 | Fumble: the crew circles the tub | animation, characters | `high/desktop/R15`, `low/desktop/R15` | `crops/high/R15-player`, `crops/low/R15-player` | `strips/high/R15`, `strips/low/R15` |
| R16 | Judge stop on the Row (Rules of the Row heat) | authenticity, animation | `high/desktop/R16`, `low/desktop/R16` | — | `strips/high/R16`, `strips/low/R16` |
| R17 | Water Fight at Hill Wheatley Plaza | scenery, readability | `high/desktop/R17`, `high/mobile/R17`, `high/landscape/R17`, `low/desktop/R17`, `low/mobile/R17`, `low/landscape/R17` | — | — |
| R18 | Race results | ui, typography | `high/desktop/R18`, `high/mobile/R18`, `high/landscape/R18`, `low/desktop/R18`, `low/mobile/R18`, `low/landscape/R18` | — | — |

Contact sheets for a first sweep (the full-size files stay the evidence): `sheets/high-desktop-01.png`, `sheets/high-desktop-02.png`, `sheets/high-desktop-03.png`, `sheets/high-desktop-closeups-01.png`, `sheets/high-desktop-closeups-02.png`, `sheets/high-landscape-01.png`, `sheets/high-mobile-01.png`, `sheets/low-desktop-01.png`, `sheets/low-desktop-02.png`, `sheets/low-desktop-03.png`, `sheets/low-desktop-closeups-01.png`, `sheets/low-desktop-closeups-02.png`, `sheets/low-landscape-01.png`, `sheets/low-mobile-01.png`.


- **Frames** (`<tier>/<viewport>/Rxx.png`): the game as the player sees it, with the HUD.
- **Close-ups** (`crops/<tier>/…`): the same frozen moment through a close camera on one target, at native
  resolution and 2× pixels. They show asset quality.
- **Strips** (`strips/<tier>/Rxx.png`): 8 consecutive moments a few sim ticks apart. **Judge animation from these.**

Score the **high** tier on desktop. Use the phone frames for `mobile` and `readability`.

## A/B comparison
81 pairs in `screenshots/review-loop-2/ab/`. Each image shows the same moment from two builds, **A** on the left and **B** on the right. One of them is this loop's build and the other is the previous one; which is which is hidden from you, and A is the same build in every pair. Files: `ab/crop-R02-preview-captain`, `ab/crop-R02-preview-rear`, `ab/crop-R02-preview`, `ab/crop-R03-kart_1`, `ab/crop-R03-kart_5`, `ab/crop-R03-player-rear`, `ab/crop-R03-player`, `ab/crop-R04-kart_3`, `ab/crop-R04-player`, `ab/crop-R15-player`, `ab/high-desktop-R01`, `ab/high-desktop-R02`, `ab/high-desktop-R03`, `ab/high-desktop-R04`, `ab/high-desktop-R05`, `ab/high-desktop-R06`, `ab/high-desktop-R07`, `ab/high-desktop-R08`, `ab/high-desktop-R09`, `ab/high-desktop-R10`, `ab/high-desktop-R11`, `ab/high-desktop-R12`, `ab/high-desktop-R13`, `ab/high-desktop-R14`, `ab/high-desktop-R15`, `ab/high-desktop-R16`, `ab/high-desktop-R17`, `ab/high-desktop-R18`, `ab/high-landscape-R01`, `ab/high-landscape-R02`, `ab/high-landscape-R03`, `ab/high-landscape-R04`, `ab/high-landscape-R07`, `ab/high-landscape-R08`, `ab/high-landscape-R17`, `ab/high-landscape-R18`, `ab/high-mobile-R01`, `ab/high-mobile-R02`, `ab/high-mobile-R03`, `ab/high-mobile-R04`, `ab/high-mobile-R07`, `ab/high-mobile-R08`, `ab/high-mobile-R17`, `ab/high-mobile-R18`, `ab/low-desktop-R01`, `ab/low-desktop-R02`, `ab/low-desktop-R03`, `ab/low-desktop-R04`, `ab/low-desktop-R05`, `ab/low-desktop-R06`, `ab/low-desktop-R07`, `ab/low-desktop-R08`, `ab/low-desktop-R09`, `ab/low-desktop-R10`, `ab/low-desktop-R11`, `ab/low-desktop-R12`, `ab/low-desktop-R13`, `ab/low-desktop-R14`, `ab/low-desktop-R15`, `ab/low-desktop-R16`, `ab/low-desktop-R17`, `ab/low-desktop-R18`, `ab/low-landscape-R01`, `ab/low-landscape-R02`, `ab/low-landscape-R03`, `ab/low-landscape-R04`, `ab/low-landscape-R07`, `ab/low-landscape-R08`, `ab/low-landscape-R17`, `ab/low-landscape-R18`, `ab/low-mobile-R01`, `ab/low-mobile-R02`, `ab/low-mobile-R03`, `ab/low-mobile-R04`, `ab/low-mobile-R07`, `ab/low-mobile-R08`, `ab/low-mobile-R17`, `ab/low-mobile-R18`, `ab/strip-R14`, `ab/strip-R15`, `ab/strip-R16`.

For each of the 10 categories, say which build is better on the evidence of the pairs that bear on it — `A`, `B`
or `tie` — with a confidence (0–1) and the pairs you used. Call a tie when the difference is within what you'd
expect from noise. Judge each category on its own; don't let one big change colour the rest.

## What changed this loop (facts only)
# Loop 2: changes (facts only)

## Scenery
- Trees are brick-built and instanced: oak, magnolia (with white flowers) and pine, as stacked bricks and plates
  with studded tops on a brown trunk, each with its own green, size and turn. They replace the painted tree cards.
  A tree that stands close to the road keeps its height but has a narrower canopy, so it no longer reaches over the
  road. Trees thin out with a dither pattern within about 9 m of the camera.
- Spectators are small brick figures, instanced: each has its own shirt and skin colour, and about half cheer with
  swinging arms. They stand behind white-railed barriers on blue posts. They replace the painted crowd cards.
- Trees, spectators and barriers cast sun shadows. Spectators cast them on High only.
- Judge stops: two brick judges in black-and-white striped shirts, holding clipboards, stand in front of each judge
  booth. The blue feather flags have a white stripe down the outer edge and across the top.
- The mountain ford and dirt stretches are now tan tiles instead of grey studded plate.

## Materials and lighting
- Wall patterns can be combined: landmark walls and trim show running-bond brick courses, and flat roof tops show
  studs. Studs now appear only on upward faces, and brick courses only on walls.
- Brick seams now also darken the surface colour (before, they darkened only the ambient light). They keep a
  minimum width at distance, so they stay visible on far buildings.
- Building walls darken over the bottom 1.2 m, where they meet the ground.
- Road, terrain and sidewalk normals are smoothed across shallow folds. Before, every triangle had its own normal.
- Figures and tubs get a rim light from the sky colour at grazing angles.

## Characters and tubs
- Torso backs are printed with crossed suspenders in the team accent colour.
- Tub rim: the top faces had been culled when seen from above, and are fixed. The rim has an inner wall, and its
  studs sit on its top.
- Tubs have push bars: one across the back and one along each side, on posts at hand height. The crew stand at the
  bars, and when they circle the tub they are evenly spaced.
- A small inverted cone in the team's flag colour floats above the player's tub.
- A rival tub that is closer to the chase camera than the player's tub, within 4.5 m, thins out with a dither
  pattern.

## UI
- The title subtitle's leftover drop shadow is removed. The logo's drop shadow now applies to the logo art only.
- Subtitles wrap into balanced lines.
- HUD item labels (Towel, Bath, Soap, Loofah) are 13 px, up from 11 px.
- Phone landscape: the water gauge sits below the lap and time block, and the minimap sits top right under the
  place badge.
- Phone portrait team select: the team panel docks at the bottom, and the turning tub is framed above it.
- The touch Steer pad is 140×50 CSS px.

## Performance
- In the sun-shadow pass, tubs draw their simpler far model. On Medium, spectators cast no shadow. Measured on the
  Medium Row scene, this cut the triangle count from 407k to 278k.

## Not changed this loop
- HUD panels, buttons and callouts keep the navy-and-orange styling. There is no ambient-occlusion pass.
- Commercial blocks still have painted fronts on plain boxes.
- The crews are still built in code, not from the Blender LOD chain.

## Capture rig
- In the loop-0 and loop-1 captures, effects never ran in motion strips: the paused test clock gave the effects
  system zero elapsed time. Effects now advance with the capture clock. So the R14/R17 spray and steam missing from
  earlier strips was a capture fault; in real play they rendered.

## Performance (measured; vsync off)
| Proxy · tier · viewport | min fps | worst p95 (ms) | worst task (ms) | calls | triangles |
|---|---|---|---|---|---|
| gpu · low · desktop | 1972 | 0.9 | 0.5 | 97 | 78k |
| gpu · low · mobile | 1944 | 0.9 | 0.5 | 90 | 76k |
| gpu · medium · desktop | 1336 | 1.2 | 0.7 | 132 | 322k |
| gpu · medium · mobile | 1142 | 1.3 | 0.8 | 124 | 304k |
| gpu · high · desktop | 1066 | 1.4 | 0.9 | 145 | 530k |
| gpu · high · mobile | 1118 | 1.3 | 0.9 | 138 | 528k |
| gpu · low · mobile · 4× CPU | 164 | 9.0 | 1.4 | 90 | 76k |
| gpu · medium · mobile · 4× CPU | 186 | 13.4 | 1.5 | 124 | 304k |
| swiftshader · low · mobile | 56 | 35.2 | 1.6 | 89 | 75k |

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
   `"loop": 2`, `"tier": "high"`, `ab` (from loop 1 on) and `ip`.

Don't edit any file. Reply with the review only.
