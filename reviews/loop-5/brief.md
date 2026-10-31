# Critic brief: loop 5

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
844×390@2× phone landscape. Root: `games/Cart Racing/screenshots/review-loop-5/`.

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
83 pairs in `screenshots/review-loop-5/ab/`. Each image shows the same moment from two builds, **A** on the left and **B** on the right. One of them is this loop's build and the other is the previous one; which is which is hidden from you, and A is the same build in every pair. Files: `ab/crop-R02-preview-captain`, `ab/crop-R02-preview-rear`, `ab/crop-R02-preview`, `ab/crop-R03-kart_1`, `ab/crop-R03-kart_5`, `ab/crop-R03-player-rear`, `ab/crop-R03-player`, `ab/crop-R04-kart_3`, `ab/crop-R04-player`, `ab/crop-R15-player`, `ab/high-desktop-R01`, `ab/high-desktop-R02`, `ab/high-desktop-R03`, `ab/high-desktop-R04`, `ab/high-desktop-R05`, `ab/high-desktop-R06`, `ab/high-desktop-R07`, `ab/high-desktop-R08`, `ab/high-desktop-R09`, `ab/high-desktop-R10`, `ab/high-desktop-R11`, `ab/high-desktop-R12`, `ab/high-desktop-R13`, `ab/high-desktop-R14`, `ab/high-desktop-R15`, `ab/high-desktop-R16`, `ab/high-desktop-R17`, `ab/high-desktop-R18`, `ab/high-desktop-R19`, `ab/high-landscape-R01`, `ab/high-landscape-R02`, `ab/high-landscape-R03`, `ab/high-landscape-R04`, `ab/high-landscape-R07`, `ab/high-landscape-R08`, `ab/high-landscape-R17`, `ab/high-landscape-R18`, `ab/high-mobile-R01`, `ab/high-mobile-R02`, `ab/high-mobile-R03`, `ab/high-mobile-R04`, `ab/high-mobile-R07`, `ab/high-mobile-R08`, `ab/high-mobile-R17`, `ab/high-mobile-R18`, `ab/low-desktop-R01`, `ab/low-desktop-R02`, `ab/low-desktop-R03`, `ab/low-desktop-R04`, `ab/low-desktop-R05`, `ab/low-desktop-R06`, `ab/low-desktop-R07`, `ab/low-desktop-R08`, `ab/low-desktop-R09`, `ab/low-desktop-R10`, `ab/low-desktop-R11`, `ab/low-desktop-R12`, `ab/low-desktop-R13`, `ab/low-desktop-R14`, `ab/low-desktop-R15`, `ab/low-desktop-R16`, `ab/low-desktop-R17`, `ab/low-desktop-R18`, `ab/low-desktop-R19`, `ab/low-landscape-R01`, `ab/low-landscape-R02`, `ab/low-landscape-R03`, `ab/low-landscape-R04`, `ab/low-landscape-R07`, `ab/low-landscape-R08`, `ab/low-landscape-R17`, `ab/low-landscape-R18`, `ab/low-mobile-R01`, `ab/low-mobile-R02`, `ab/low-mobile-R03`, `ab/low-mobile-R04`, `ab/low-mobile-R07`, `ab/low-mobile-R08`, `ab/low-mobile-R17`, `ab/low-mobile-R18`, `ab/strip-R14`, `ab/strip-R15`, `ab/strip-R16`.

For each of the 10 categories, say which build is better on the evidence of the pairs that bear on it — `A`, `B`
or `tie` — with a confidence (0–1) and the pairs you used. Call a tie when the difference is within what you'd
expect from noise. Judge each category on its own; don't let one big change colour the rest.

## What changed this loop (facts only)
# Loop 5: changes (facts only)

## UI
- The race readouts sit on bevelled tiles matching the water gauge: lap and time top left, place top right, and the
  item checklist under the gauge. Before, the text floated on the scene with only an outline.

## Lighting
- The daytime ground term of the ambient light is a muted green (#7E866A, was #6F8F4E), so shaded buff and white
  walls no longer turn olive.
- The place tile stays hidden until places are known, so it doesn't sit empty during the countdown.

## Materials
- Baseplate studs come in 4×4-stud plates, each a shade lighter or darker, so grass and studded roofs keep a pattern
  at distances where single studs are too small to draw.

## Animation and feel
- Slide-boost release kicks the field of view: 4° for warm steam, 6° for hot steam, gone in about a quarter
  second, with a light camera shake. An item hit kicks 3° with a stronger shake. Bumping another tub shakes the
  camera lightly. Reduced-motion settings turn off the kick and the shake.

## Scenery
- Horizon ridges: each 6 m column is its own plate, a shade lighter or darker, and darker and hazier toward its foot.
  The two nearer rings carry a darker tree-line band under the lit lip.
- Hot Springs Mountain behind the Row is a broad 70 m summit with two lower shoulders (38 m and 44 m), not one
  110 m bulge.

## Lighting
- Ambient occlusion (High) rotates its sample kernel in a 4×4 ordered pattern and blurs over exactly that 4×4
  period, so it leaves no residual stripes. Its depth bias grows with distance, so curved parts no longer occlude
  themselves. Strength is 0.75, down from 0.85.

## UI
- Phone landscape team select: the teams are a 4 × 3 grid of shorter cards, so all twelve fit beside the details,
  stats and buttons.

## Characters
- Bath water shows. The exported water sheet faces downward, so seen from above most of it was culled and every
  tub read as empty. The sheet now renders double-sided. It is a deeper blue (#3F9FD8, was a pale cyan), 86%
  opaque (was 72%), with a moderate gloss (0.55, was 0.95), so it no longer mirrors the sky white. It is narrowed to
  92% so the tilted sheet stays inside the rim, and it tilts 1.3× the slosh state (was 2×).
- The crew packer re-winds any triangle whose winding disagrees with its normals (12 triangles in the export).

## Scenery and materials
- Slopes steeper than baseplate are terraced plates: a groove and a lit lip every plate of rise, each plate a shade
  apart. Before, banks and road shoulders were a flat colour.
- The creek ford is a deeper, more opaque blue again (#2E86D0 at 70%), so it reads as water rather than flagstone.
- Near trees step aside about 1.5 m sooner.

## UI
- The 10-gallon tile sits inside the gauge, so it is no longer cut off at the gauge's right edge.

## Lighting
- Ambient occlusion (High) uses a 0.4 m radius (was 0.8). At 0.8 m it reached across the tub's curved interior, so
  each flat facet occluded differently and drew vertical stripes. The crew models already carry baked AO. Building
  crevices still darken.
- The sky dome glows toward the horizon, strongest in the sun's direction. Dusk and sunset get an amber glow and a
  soft sun disc; day gets a faint warm haze. In the R07 and R11 review views the sun is off-camera, so only the
  wider glow shows: lower sky is 1.09× (R07) and 1.18× (R11) the brightness of the top of the frame.
- Street furniture (lamp posts, benches, booths) fades out within about 4 m of the camera, as near trees do.
- Tree stands are thinned where two canopies would pierce each other: a tree is dropped if its trunk is closer to a
  kept tree than 62% of their combined canopy radii.

## More (after the loop-4 ruling)
- Bathhouse Row's sun is lower and from the other side: (-0.35, 0.55, -0.76), was (0.35, 0.82, 0.45). The
  Arlington's and the bathhouses' street fronts now face the sun, so facade planes separate.
- Windows (landmark glass and the facade kit) carry a sky sheen that brightens toward the top of each storey,
  plus a diagonal reflection streak.
- Rival tubs get a slim team-colour ring at 60% opacity; the player's ring stays bold and outlined.
- Slide spray follows the charge itself rather than only the tier: water blue, warming to white steam by the warm
  tier and to orange by the hot tier, growing and rising as it charges.
- The camera rolls up to 2.5° into a power slide (off under reduced motion).
- The fumble splash is smaller, paler and shorter-lived: 8 beads (was 12).
- Menu focus is drawn as a ring under the studs instead of an outline through them. Portrait team select leaves
  room for the panel's stud row above its title.
- Crew models (re-exported from Blender):
  - The water sheet faces up at every LOD.
  - Every hat carries 1–4 moulded studs (never on heads).
  - The tub's team stripe is a raised tile with seams, and seam lines separate the bowl from its base plate and
    rim ring.
  - Trail Shredders wear orange instead of green, so no two teams share a green torso.
  - The baked AO on tub interiors is smoothed.
  - Budgets hold: LOD1 figure at most 2,680 triangles, LOD1 tub at most 10,980.

## Performance (measured; vsync off)
| Proxy · tier · viewport | min fps | worst p95 (ms) | worst task (ms) | calls | triangles |
|---|---|---|---|---|---|
| gpu · low · desktop | 1871 | 0.9 | 0.5 | 111 | 105k |
| gpu · low · mobile | 2103 | 0.8 | 0.5 | 104 | 103k |
| gpu · medium · desktop | 1312 | 1.1 | 0.7 | 165 | 376k |
| gpu · medium · mobile | 1409 | 1.1 | 0.7 | 158 | 374k |
| gpu · high · desktop | 1269 | 1.2 | 0.8 | 182 | 479k |
| gpu · high · mobile | 1328 | 1.1 | 0.7 | 175 | 477k |
| gpu · low · mobile · 4× CPU | 241 | 5.8 | 1.0 | 104 | 103k |
| gpu · medium · mobile · 4× CPU | 179 | 7.3 | 1.3 | 158 | 374k |
| swiftshader · low · mobile | 55 | 35.7 | 1.7 | 104 | 103k |

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
   `"loop": 5`, `"tier": "high"`, `ab` (from loop 1 on) and `ip`.

Don't edit any file. Reply with the review only.
