# Critic brief: loop 3

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
844×390@2× phone landscape. Root: `games/Cart Racing/screenshots/review-loop-3/`.

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
| R09 | Goat Rock overlook from the Goat Rock Trail | scenery, authenticity | `high/desktop/R09`, `low/desktop/R09` | — | — |
| R10 | West Mountain summit road | lighting, scenery | `high/desktop/R10`, `low/desktop/R10` | — | — |
| R11 | Sunset Ridge at sunset | lighting, scenery | `high/desktop/R11`, `low/desktop/R11` | — | — |
| R12 | Whittington Valley around the park | scenery, readability | `high/desktop/R12`, `low/desktop/R12` | — | — |
| R13 | Bridge Street Bash downtown | authenticity, scenery | `high/desktop/R13`, `low/desktop/R13` | — | — |
| R14 | Power slide charging hot steam | animation, materials | `high/desktop/R14`, `low/desktop/R14` | — | `strips/high/R14`, `strips/low/R14` |
| R15 | Fumble: the crew circles the tub | animation, characters | `high/desktop/R15`, `low/desktop/R15` | `crops/high/R15-player`, `crops/low/R15-player` | `strips/high/R15`, `strips/low/R15` |
| R16 | Judge stop on the Row (Rules of the Row heat) | authenticity, animation | `high/desktop/R16`, `low/desktop/R16` | — | `strips/high/R16`, `strips/low/R16` |
| R17 | Water Fight at Hill Wheatley Plaza | scenery, readability | `high/desktop/R17`, `high/mobile/R17`, `high/landscape/R17`, `low/desktop/R17`, `low/mobile/R17`, `low/landscape/R17` | — | — |
| R18 | Race results | ui, typography | `high/desktop/R18`, `high/mobile/R18`, `high/landscape/R18`, `low/desktop/R18`, `low/mobile/R18`, `low/landscape/R18` | — | — |
| R19 | Gulpha Creek ford on the Gulpha Gorge Trail | scenery, authenticity | `high/desktop/R19`, `low/desktop/R19` | — | — |

Contact sheets for a first sweep (the full-size files stay the evidence): `sheets/high-desktop-01.png`, `sheets/high-desktop-02.png`, `sheets/high-desktop-03.png`, `sheets/high-desktop-04.png`, `sheets/high-desktop-closeups-01.png`, `sheets/high-desktop-closeups-02.png`, `sheets/high-landscape-01.png`, `sheets/high-mobile-01.png`, `sheets/low-desktop-01.png`, `sheets/low-desktop-02.png`, `sheets/low-desktop-03.png`, `sheets/low-desktop-04.png`, `sheets/low-desktop-closeups-01.png`, `sheets/low-desktop-closeups-02.png`, `sheets/low-landscape-01.png`, `sheets/low-mobile-01.png`.


- **Frames** (`<tier>/<viewport>/Rxx.png`): the game as the player sees it, with the HUD.
- **Close-ups** (`crops/<tier>/…`): the same frozen moment through a close camera on one target, at native
  resolution and 2× pixels. They show asset quality.
- **Strips** (`strips/<tier>/Rxx.png`): 8 consecutive moments a few sim ticks apart. **Judge animation from these.**

Score the **high** tier on desktop. Use the phone frames for `mobile` and `readability`.

## A/B comparison
81 pairs in `screenshots/review-loop-3/ab/`. Each image shows the same moment from two builds, **A** on the left and **B** on the right. One of them is this loop's build and the other is the previous one; which is which is hidden from you, and A is the same build in every pair. Files: `ab/crop-R02-preview-captain`, `ab/crop-R02-preview-rear`, `ab/crop-R02-preview`, `ab/crop-R03-kart_1`, `ab/crop-R03-kart_5`, `ab/crop-R03-player-rear`, `ab/crop-R03-player`, `ab/crop-R04-kart_3`, `ab/crop-R04-player`, `ab/crop-R15-player`, `ab/high-desktop-R01`, `ab/high-desktop-R02`, `ab/high-desktop-R03`, `ab/high-desktop-R04`, `ab/high-desktop-R05`, `ab/high-desktop-R06`, `ab/high-desktop-R07`, `ab/high-desktop-R08`, `ab/high-desktop-R09`, `ab/high-desktop-R10`, `ab/high-desktop-R11`, `ab/high-desktop-R12`, `ab/high-desktop-R13`, `ab/high-desktop-R14`, `ab/high-desktop-R15`, `ab/high-desktop-R16`, `ab/high-desktop-R17`, `ab/high-desktop-R18`, `ab/high-landscape-R01`, `ab/high-landscape-R02`, `ab/high-landscape-R03`, `ab/high-landscape-R04`, `ab/high-landscape-R07`, `ab/high-landscape-R08`, `ab/high-landscape-R17`, `ab/high-landscape-R18`, `ab/high-mobile-R01`, `ab/high-mobile-R02`, `ab/high-mobile-R03`, `ab/high-mobile-R04`, `ab/high-mobile-R07`, `ab/high-mobile-R08`, `ab/high-mobile-R17`, `ab/high-mobile-R18`, `ab/low-desktop-R01`, `ab/low-desktop-R02`, `ab/low-desktop-R03`, `ab/low-desktop-R04`, `ab/low-desktop-R05`, `ab/low-desktop-R06`, `ab/low-desktop-R07`, `ab/low-desktop-R08`, `ab/low-desktop-R09`, `ab/low-desktop-R10`, `ab/low-desktop-R11`, `ab/low-desktop-R12`, `ab/low-desktop-R13`, `ab/low-desktop-R14`, `ab/low-desktop-R15`, `ab/low-desktop-R16`, `ab/low-desktop-R17`, `ab/low-desktop-R18`, `ab/low-landscape-R01`, `ab/low-landscape-R02`, `ab/low-landscape-R03`, `ab/low-landscape-R04`, `ab/low-landscape-R07`, `ab/low-landscape-R08`, `ab/low-landscape-R17`, `ab/low-landscape-R18`, `ab/low-mobile-R01`, `ab/low-mobile-R02`, `ab/low-mobile-R03`, `ab/low-mobile-R04`, `ab/low-mobile-R07`, `ab/low-mobile-R08`, `ab/low-mobile-R17`, `ab/low-mobile-R18`, `ab/strip-R14`, `ab/strip-R15`, `ab/strip-R16`.

For each of the 10 categories, say which build is better on the evidence of the pairs that bear on it — `A`, `B`
or `tie` — with a confidence (0–1) and the pairs you used. Call a tie when the difference is within what you'd
expect from noise. Judge each category on its own; don't let one big change colour the rest.

## What changed this loop (facts only)
# Loop 3: changes (facts only)

## Characters and tubs
- The tubs and crews are now built in Blender rather than in code. They are made from the Gold Master figure and tub,
  exported as LODs, and assembled per team in the game from one shared geometry pack (`assets/crew.js`, 389 KB).
  - Each team has its own hats, for example fire helmets, gator heads, flamingo heads, antenna bands, top hats and
    campaign hats.
  - Each team also has its own printed uniforms front and back, and trim parts on the arms and legs.
  - Every figure has a printed face, from eight expressions.
  - The parts have real bevels and moulded studs, and baked ambient occlusion in their vertex colours.
  - Tubs have hubbed wheels, a studded chassis and either feet or a skirt by division, plus a duck and a flag.
- Medium and High draw LOD1 near the camera and LOD2 for far tubs, beyond 24 m on Medium and 40 m on High. Low
  draws LOD2 near and LOD3 beyond 22 m. Sun shadows use the far model. The crews built in code remain as a fallback when the pack can't load.
- The side attendants stand at ±0.86 m, turned in by 20°.
- A rival close to the chase camera, and closer to it than the player's tub, now fades smoothly with MSAA (alpha to
  coverage) on Medium and High, and with an ordered 4×4 dither on Low. Before, it used per-pixel random noise.
- The rim light is tinted by the part colour and capped. At dusk and sunset the crews get a fill light.
- The player's tub is marked by a ring in its team colour, outlined in black, on the road around it. The floating
  marker is smaller, sits just over the captain's hat, stays upright when the tub leans or slides, and is hidden
  during the countdown.
- Each pusher has a soft contact shadow on the road under its feet. All the tubs' pushers share one instanced draw.

## Scenery and materials
- Trees near the camera fade the same way as rivals: smoothly with MSAA, with an ordered dither on Low.
- Crowd-barrier rails ran across the sidewalk at right angles to their posts. They now run along the posts, at the
  curb.
- Pine trunks run up through every tier, so the tiers no longer float.
- On Medium and High, commercial blocks are built from parts instead of painted fronts on boxes.
  - Walls are running-bond brick in one of five brick colours.
  - The shop storey has wide windows with a centre mullion under striped slope awnings.
  - Each upper storey has a framed window per bay: dark glass behind a projecting sill, lintel and jambs.
  - Every wall has a cornice at the roof line, a string course at each storey and a quoin at each corner.

  Low keeps the painted fronts.
- Other procedural buildings (plain bathhouse blocks) get the same cornice, string courses and quoins in light
  trim bricks.
- The Arlington no longer has a painted facade under its modelled windows. Its walls are plain brick, so only its
  own window grid shows.
- Asphalt roads no longer show plate seams. Mountain tile roads and brick paving keep theirs.
- Pine greens no longer include a tan-olive shade.
- At dusk, the warm light pools under lamps are larger (6.5 m across, up from 4.2 m) and brighter, so they reach
  the near lane.
- Landmark walls darken over the bottom 1.3 m, where they meet the ground.
- Creek fords render as a shallow sheet of clear blue tiles across the road, with studded grey stepping stones along
  both banks. Before this loop, fords had no visual.
- Judge booths now face the road, so the judges stand in front of them. The flag that stood before each booth is
  gone; the one after it remains.

## Effects
- Particles are shaded as glossy plastic beads, with a highlight and a darker rim, instead of flat discs. Their size
  on screen is capped near the camera.
- Slide spray is water-coloured and trails behind the tub.
- The splash when a tub is hit or fumbles has fewer, smaller particles.

## UI
- Menu buttons are 1×4 bricks with four studs on top (two on the short buttons in a row). Grand Prix is a larger red
  brick. On landscape screens the title menu has Grand Prix across the top and the other modes in two columns.
- Panels are plates with a row of studs along the top. Cards, chips, the ticket counter, callouts and the
  judge-task sign are bevelled tiles.
- Team select: the Choose and Back buttons stay pinned to the bottom of the panel while the team list scrolls. On
  phones both are visible in portrait and landscape.

## Capture rig
- R09 is now a landmark view of Goat Rock with the HUD hidden. It used to be a race frame on the Goat Rock course
  that showed neither Goat Rock nor the ford. Its A/B pair compares different views.
- New R19 is a race frame at the first Gulpha Creek ford. It has no loop-2 pair.

## Performance (measured; vsync off)
| Proxy · tier · viewport | min fps | worst p95 (ms) | worst task (ms) | calls | triangles |
|---|---|---|---|---|---|
| gpu · low · desktop | 1666 | 1.0 | 0.6 | 100 | 67k |
| gpu · low · mobile | 1884 | 0.8 | 0.5 | 93 | 65k |
| gpu · medium · desktop | 1319 | 1.2 | 0.7 | 137 | 310k |
| gpu · medium · mobile | 1408 | 1.2 | 0.7 | 129 | 308k |
| gpu · high · desktop | 1111 | 1.4 | 0.9 | 151 | 395k |
| gpu · high · mobile | 1482 | 1.1 | 0.7 | 144 | 393k |
| gpu · low · mobile · 4× CPU | 250 | 5.9 | 0.9 | 93 | 65k |
| gpu · medium · mobile · 4× CPU | 168 | 8.0 | 1.4 | 129 | 308k |
| swiftshader · low · mobile | 63 | 35.4 | 1.6 | 93 | 65k |

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
   `"loop": 3`, `"tier": "high"`, `ab` (from loop 1 on) and `ip`.

Don't edit any file. Reply with the review only.
