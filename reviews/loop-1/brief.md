# Critic brief: loop 1

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
844×390@2× phone landscape. Root: `games/Cart Racing/screenshots/review-loop-1/`.

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
47 pairs in `screenshots/review-loop-1/ab/`. Each image shows the same moment from two builds, **A** on the left and **B** on the right. One of them is this loop's build and the other is the previous one; which is which is hidden from you, and A is the same build in every pair. Files: `ab/crop-R02-preview-captain`, `ab/crop-R02-preview-rear`, `ab/crop-R02-preview`, `ab/crop-R03-kart_1`, `ab/crop-R03-kart_5`, `ab/crop-R03-player-rear`, `ab/crop-R03-player`, `ab/crop-R04-kart_3`, `ab/crop-R04-player`, `ab/crop-R15-player`, `ab/high-desktop-R01`, `ab/high-desktop-R02`, `ab/high-desktop-R03`, `ab/high-desktop-R04`, `ab/high-desktop-R05`, `ab/high-desktop-R06`, `ab/high-desktop-R07`, `ab/high-desktop-R08`, `ab/high-desktop-R09`, `ab/high-desktop-R10`, `ab/high-desktop-R11`, `ab/high-desktop-R12`, `ab/high-desktop-R13`, `ab/high-desktop-R14`, `ab/high-desktop-R15`, `ab/high-desktop-R16`, `ab/high-desktop-R17`, `ab/high-desktop-R18`, `ab/high-landscape-R01`, `ab/high-landscape-R02`, `ab/high-landscape-R03`, `ab/high-landscape-R04`, `ab/high-landscape-R07`, `ab/high-landscape-R08`, `ab/high-landscape-R17`, `ab/high-landscape-R18`, `ab/high-mobile-R01`, `ab/high-mobile-R02`, `ab/high-mobile-R03`, `ab/high-mobile-R04`, `ab/high-mobile-R07`, `ab/high-mobile-R08`, `ab/high-mobile-R17`, `ab/high-mobile-R18`, `ab/strip-R14`, `ab/strip-R15`, `ab/strip-R16`.

For each of the 10 categories, say which build is better on the evidence of the pairs that bear on it — `A`, `B`
or `tie` — with a confidence (0–1) and the pairs you used. Call a tie when the difference is within what you'd
expect from noise. Judge each category on its own; don't let one big change colour the rest.

## What changed this loop (facts only)
# Loop 1: changes (facts only)

## Rendering
- Default picture is now native resolution (device pixels, capped per tier: High and Medium 2×, Low 0.85×). The old
  240-line picture remains as a "Retro 240p" setting.
- Every world surface, landmark, prop and tub uses a new per-pixel plastic material: hemisphere ambient (sky above,
  ground below), sun diffuse, Blinn-Phong specular and a Fresnel sky reflection; colours snap to a toy-brick palette.
- Surface patterns drawn in the shader: studs on upward ground faces (0.4 m pitch), road plates and sidewalks as tiles
  with moulded seams, running-bond brick courses on walls and over the painted facades.
- Sun shadow map on Medium (1024) and High (2048) with filtered edges: buildings, walls, props, landmarks and tubs
  cast; everything receives. Low has no shadow map and a lighter shader (no sky reflection).

## Characters and tubs (first brick version, built in code)
- Figures: rounded-cube heads with printed faces (four expressions), box torsos with printed team uniforms (collar,
  suspenders, belt, badge), block arms with mitten hands, block legs and feet; all parts bevelled.
- The 12 hat styles rebuilt as bevelled parts; firefighter, police and jockey hats carry a stud.
- Tub: one moulded bowl with a studded rim, a studded chassis plate, claw feet or skirt, tyred wheels with hubs,
  see-through water, a two-piece duck. A simpler far version is used beyond 22–45 m (by tier).
- Steam Rangers recoloured (grey shirts, tan campaign hats).

## Animation and effects
- At judge stops the crew act out the task: they run around the tub for "Ring Around the Tub", do jumping jacks and
  push-ups for those tasks, and wave during the yodel.
- Power slides throw wheel spray while charging, then steam that grows and warms with each charge stage.
- Particle emitters now emit per 60 Hz tick of elapsed time.

## Lighting and sky
- Dusk and sunset courses: lamp globes glow and each lamp casts a warm pool on the ground.
- A soft feathered contact shadow sits under each tub and its crew (replacing the hard octagon).
- The painted ridge panorama fades out over its top band into the sky dome. On Low the sky is scaled inside the
  shorter far plane.

## Scenery
- Side terrain stops before it reaches another stretch of the same road (the R08 hairpin).

## UI
- Team select frames the turning tub on the right half of the screen.
- Phone landscape (short screens): title and menu side by side, compact team and results panels, controls in the
  bottom corners.
- Pixel numerals use an open zero; the title subtitle has an outline instead of an offset shadow; "1 lap" singular.
- The race HUD and touch controls are hidden under results and standings.
- The Steer pill is filled and outlined with arrows.

## Not changed this loop
- Trees and crowds are still painted sprites. Buildings and landmarks keep their geometry (only the material
  changed). HUD panel and callout styling is unchanged.

## Capture rig
- R02's captain close-up camera was re-aimed (it sat inside the tub wall). R05/R06 landmark frames hide the HUD.
- R14's setup was fixed: the old one pressed hop and steer on the same tick, so the tub never slid (in loop 0 too).
  It now steers first, then hops, so loop 1's R14 shows a real slide; its loop-0 pair shows the non-sliding moment.

## Performance (measured; vsync off)
| Proxy · tier · viewport | min fps | worst p95 (ms) | worst task (ms) | calls | triangles |
|---|---|---|---|---|---|
| swiftshader · low · mobile | 66 | 34.2 | 1.6 | 95 | 50k |
| gpu · low · desktop | 1273 | 1.3 | 0.8 | 105 | 52k |
| gpu · low · mobile | 1412 | 1.3 | 0.7 | 96 | 50k |
| gpu · medium · desktop | 941 | 2.0 | 0.9 | 141 | 344k |
| gpu · high · desktop | 954 | 1.9 | 1.0 | 147 | 644k |
| gpu · high · mobile | 878 | 1.9 | 1.1 | 137 | 642k |
| gpu · low · mobile · 4× CPU | 148 | 11.2 | 1.6 | 96 | 50k |
| gpu · medium · mobile · 4× CPU | 138 | 16.1 | 1.8 | 132 | 344k |
| gpu · medium · mobile | 1297 | 1.4 | 0.7 | 117 | 312k |

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
   `"loop": 1`, `"tier": "high"`, `ab` (from loop 1 on) and `ip`.

Don't edit any file. Reply with the review only.
