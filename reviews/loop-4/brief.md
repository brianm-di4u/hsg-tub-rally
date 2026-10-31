# Critic brief: loop 4

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
844×390@2× phone landscape. Root: `games/Cart Racing/screenshots/review-loop-4/`.

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
83 pairs in `screenshots/review-loop-4/ab/`. Each image shows the same moment from two builds, **A** on the left and **B** on the right. One of them is this loop's build and the other is the previous one; which is which is hidden from you, and A is the same build in every pair. Files: `ab/crop-R02-preview-captain`, `ab/crop-R02-preview-rear`, `ab/crop-R02-preview`, `ab/crop-R03-kart_1`, `ab/crop-R03-kart_5`, `ab/crop-R03-player-rear`, `ab/crop-R03-player`, `ab/crop-R04-kart_3`, `ab/crop-R04-player`, `ab/crop-R15-player`, `ab/high-desktop-R01`, `ab/high-desktop-R02`, `ab/high-desktop-R03`, `ab/high-desktop-R04`, `ab/high-desktop-R05`, `ab/high-desktop-R06`, `ab/high-desktop-R07`, `ab/high-desktop-R08`, `ab/high-desktop-R09`, `ab/high-desktop-R10`, `ab/high-desktop-R11`, `ab/high-desktop-R12`, `ab/high-desktop-R13`, `ab/high-desktop-R14`, `ab/high-desktop-R15`, `ab/high-desktop-R16`, `ab/high-desktop-R17`, `ab/high-desktop-R18`, `ab/high-desktop-R19`, `ab/high-landscape-R01`, `ab/high-landscape-R02`, `ab/high-landscape-R03`, `ab/high-landscape-R04`, `ab/high-landscape-R07`, `ab/high-landscape-R08`, `ab/high-landscape-R17`, `ab/high-landscape-R18`, `ab/high-mobile-R01`, `ab/high-mobile-R02`, `ab/high-mobile-R03`, `ab/high-mobile-R04`, `ab/high-mobile-R07`, `ab/high-mobile-R08`, `ab/high-mobile-R17`, `ab/high-mobile-R18`, `ab/low-desktop-R01`, `ab/low-desktop-R02`, `ab/low-desktop-R03`, `ab/low-desktop-R04`, `ab/low-desktop-R05`, `ab/low-desktop-R06`, `ab/low-desktop-R07`, `ab/low-desktop-R08`, `ab/low-desktop-R09`, `ab/low-desktop-R10`, `ab/low-desktop-R11`, `ab/low-desktop-R12`, `ab/low-desktop-R13`, `ab/low-desktop-R14`, `ab/low-desktop-R15`, `ab/low-desktop-R16`, `ab/low-desktop-R17`, `ab/low-desktop-R18`, `ab/low-desktop-R19`, `ab/low-landscape-R01`, `ab/low-landscape-R02`, `ab/low-landscape-R03`, `ab/low-landscape-R04`, `ab/low-landscape-R07`, `ab/low-landscape-R08`, `ab/low-landscape-R17`, `ab/low-landscape-R18`, `ab/low-mobile-R01`, `ab/low-mobile-R02`, `ab/low-mobile-R03`, `ab/low-mobile-R04`, `ab/low-mobile-R07`, `ab/low-mobile-R08`, `ab/low-mobile-R17`, `ab/low-mobile-R18`, `ab/strip-R14`, `ab/strip-R15`, `ab/strip-R16`.

For each of the 10 categories, say which build is better on the evidence of the pairs that bear on it — `A`, `B`
or `tie` — with a confidence (0–1) and the pairs you used. Call a tie when the difference is within what you'd
expect from noise. Judge each category on its own; don't let one big change colour the rest.

## What changed this loop (facts only)
# Loop 4: changes (facts only)

## Lighting
- High has screen-space ambient occlusion. The scene renders into a multisampled target with a depth texture.
  Occlusion is estimated at half resolution from 8 samples within 0.8 m, then blurred with depth-aware weights.
  It darkens crevices, wall feet, the ground under tubs and figures, and window recesses. It fades out from about
  40 m to 70 m and leaves the sky alone. Medium and Low have no AO pass. On High it costs about 0.3 ms per frame on
  the RTX 5060 at 1280×800.

## Scenery
- The horizon is brick-built. Three rings of long, low ridges with silhouettes stepped in 6 m plates, each column
  topped by a lighter plate edge, are tinted toward the horizon haze with distance. They replace the painted ridge
  panorama and the pale fog band under it, and they reach below the ground, so no band shows where the terrain
  ends.
- Two more tree shapes: a narrower, taller spruce in the pine stands and a maple of offset canopy clusters among the
  oaks, some in autumn orange. About a third of each stand is the new shape, chosen by position.
- Grass verges carry brick shrubs, flower clusters in six colours and studded grey rocks, scattered 2–12 m past the
  road edge on gentle ground. Low has half as many. Each kind is one instanced draw.
- Hill Wheatley Plaza's fountain is a centrepiece, about 7 m tall: a studded stone basin of clear water around a
  pedestal, with a giant brick stoneware jug (blue band, handle) pouring a stream into the basin.

- On Bathhouse Row a wide brick-stepped mountain, Hot Springs Mountain, rises in the ridge ring behind the bathhouses.
- Spectators have printed faces: two eyes and a smile.

## Materials
- Asphalt has a fine, low-contrast grain of 0.3 m flecks, which fades out with distance. It has no seams. Its gloss
  rose from 0.15 to 0.32, so the sun shows a sheen on it.
- Each brick in a wall has a lit top edge, like a bevel catching the light.
- The creek-ford sheet is clearer: alpha 0.5 instead of 0.78, in a lighter blue, so the creek bed shows through it.
- At dusk the warm lamp pools are dimmer at their centre and no longer clip to white on the sidewalk.
- The neon shop bands at dusk shade from darker at the bottom to brighter at the top, instead of one flat colour.

## Readability
- Near trees are hidden whole instead of half-faded. Each tree is hidden all but at once when its canopy comes within
  about 3 m of the camera, or when it stands in the sightline from the camera to the player's tub. The fade takes
  each tree's own size into account.
- A rival tub in the sightline from the camera to the player's tub, closer than the player, is hidden over a short
  band instead of drawn at 75% fade. Its bath water hides with it.

## Effects
- Slide spray fans sideways off the rear wheels instead of drifting back toward the camera. It has more, slightly
  smaller beads with a shorter life. Boost puffs are smaller and slower.
- Particles shrink to nothing within about 3 m of the camera, and their maximum on-screen size is smaller.
- The bath-water sheet tilts 2.5× as far with the slosh state, so the tilt shows at play size.

## UI
- The 10-gallon mark on the water gauge sits on its own dark tile, in 14 px type (up from 11 px).
- Phone landscape: the minimap sits lower and is slightly smaller, so it no longer touches the place readout.
- Panel stud rows space their studs to fit the panel, so no stud is cut by the border.
- Phone portrait team select frames the whole preview tub above the panel.
- Phone team select fits without scrolling. In portrait the stats sit in two columns above the pinned buttons. In
  landscape the panel has two columns: the team grid on the left, and the details, stats and both buttons on the
  right.

## Characters
- The tub rim is a smooth rolled lip: the detailed tub (LOD1) has 16–24 radial segments with smooth normals, up to
  10,860 triangles per tub (from 8,216).
- The simpler crew model (LOD2), drawn for rival tubs on Low, carries the printed faces.
- Crew packs: the print atlas moved into its own pack (assets/crew-prints.js, 118 KB). The geometry pack is 301 KB.
- The contact shadow, and the player's ring on it, lie on the road's slope under the tub. On cambered or banked
  roads they used to sink into the road on one side.
- The player's own tub and the team-select preview use the detailed crew model (LOD1) on every tier, including Low.
  On Low the other tubs keep LOD2.

## Capture rig
- The A/B close-up and strip pairs had no tier in their file names, so the Low-tier pairs overwrote the High-tier
  ones: loop 3's `ab/crop-*` and `ab/strip-*` pairs all showed Low. From loop 4 they come from High, the tier that is
  scored.

## Performance (measured; vsync off)
| Proxy · tier · viewport | min fps | worst p95 (ms) | worst task (ms) | calls | triangles |
|---|---|---|---|---|---|
| gpu · low · desktop | 1307 | 1.2 | 0.7 | 104 | 102k |
| gpu · low · mobile | 1495 | 1.1 | 0.7 | 97 | 100k |
| gpu · medium · desktop | 1074 | 1.5 | 0.9 | 144 | 364k |
| gpu · medium · mobile | 1329 | 1.1 | 0.7 | 137 | 362k |
| gpu · high · desktop | 1234 | 1.2 | 0.8 | 161 | 468k |
| gpu · high · mobile | 1223 | 1.3 | 0.8 | 154 | 466k |
| gpu · low · mobile · 4× CPU | 198 | 7.9 | 1.2 | 97 | 100k |
| gpu · medium · mobile · 4× CPU | 139 | 11.3 | 1.7 | 137 | 362k |
| swiftshader · low · mobile | 53 | 36.3 | 1.7 | 97 | 100k |

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
   `"loop": 4`, `"tier": "high"`, `ab` (from loop 1 on) and `ip`.

Don't edit any file. Reply with the review only.
