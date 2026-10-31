# Critic brief: loop 7

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
844×390@2× phone landscape. Root: `games/Cart Racing/screenshots/review-loop-7/`.

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
83 pairs in `screenshots/review-loop-7/ab/`. Each image shows the same moment from two builds, **A** on the left and **B** on the right. One of them is this loop's build and the other is the previous one; which is which is hidden from you, and A is the same build in every pair. Files: `ab/crop-R02-preview-captain`, `ab/crop-R02-preview-rear`, `ab/crop-R02-preview`, `ab/crop-R03-kart_1`, `ab/crop-R03-kart_5`, `ab/crop-R03-player-rear`, `ab/crop-R03-player`, `ab/crop-R04-kart_3`, `ab/crop-R04-player`, `ab/crop-R15-player`, `ab/high-desktop-R01`, `ab/high-desktop-R02`, `ab/high-desktop-R03`, `ab/high-desktop-R04`, `ab/high-desktop-R05`, `ab/high-desktop-R06`, `ab/high-desktop-R07`, `ab/high-desktop-R08`, `ab/high-desktop-R09`, `ab/high-desktop-R10`, `ab/high-desktop-R11`, `ab/high-desktop-R12`, `ab/high-desktop-R13`, `ab/high-desktop-R14`, `ab/high-desktop-R15`, `ab/high-desktop-R16`, `ab/high-desktop-R17`, `ab/high-desktop-R18`, `ab/high-desktop-R19`, `ab/high-landscape-R01`, `ab/high-landscape-R02`, `ab/high-landscape-R03`, `ab/high-landscape-R04`, `ab/high-landscape-R07`, `ab/high-landscape-R08`, `ab/high-landscape-R17`, `ab/high-landscape-R18`, `ab/high-mobile-R01`, `ab/high-mobile-R02`, `ab/high-mobile-R03`, `ab/high-mobile-R04`, `ab/high-mobile-R07`, `ab/high-mobile-R08`, `ab/high-mobile-R17`, `ab/high-mobile-R18`, `ab/low-desktop-R01`, `ab/low-desktop-R02`, `ab/low-desktop-R03`, `ab/low-desktop-R04`, `ab/low-desktop-R05`, `ab/low-desktop-R06`, `ab/low-desktop-R07`, `ab/low-desktop-R08`, `ab/low-desktop-R09`, `ab/low-desktop-R10`, `ab/low-desktop-R11`, `ab/low-desktop-R12`, `ab/low-desktop-R13`, `ab/low-desktop-R14`, `ab/low-desktop-R15`, `ab/low-desktop-R16`, `ab/low-desktop-R17`, `ab/low-desktop-R18`, `ab/low-desktop-R19`, `ab/low-landscape-R01`, `ab/low-landscape-R02`, `ab/low-landscape-R03`, `ab/low-landscape-R04`, `ab/low-landscape-R07`, `ab/low-landscape-R08`, `ab/low-landscape-R17`, `ab/low-landscape-R18`, `ab/low-mobile-R01`, `ab/low-mobile-R02`, `ab/low-mobile-R03`, `ab/low-mobile-R04`, `ab/low-mobile-R07`, `ab/low-mobile-R08`, `ab/low-mobile-R17`, `ab/low-mobile-R18`, `ab/strip-R14`, `ab/strip-R15`, `ab/strip-R16`.

For each of the 10 categories, say which build is better on the evidence of the pairs that bear on it — `A`, `B`
or `tie` — with a confidence (0–1) and the pairs you used. Call a tie when the difference is within what you'd
expect from noise. Judge each category on its own; don't let one big change colour the rest.

## What changed this loop (facts only)
# Loop 7: changes (facts only)

## Scenery
- The horizon rings are rebuilt as runs of overlapping rounded hills (14–20 per ring, plus the Hot Springs Mountain
  peak behind the Row) instead of long sinusoidal ridges. Valleys drop low enough for the farther ring to show
  through. Heights still step in whole 6 m plates and 2° columns.
- Each column is lit by where it faces: the sun side of a hill is brighter, and rings that face the sun are
  backlit.
- The shader covers every hill face in rows of stepped three-tier conifer crowns, each with a lit and a shaded half
  and its own size. They thin out toward the lit ridge lip, and the foot of each hill hazes out. Crowns are fainter
  on hazier rings.
- The silhouette carries a ragged tree line of one or two crowns of varying width and height per column, in place
  of evenly spaced crowns.
- Haze: far ring 60% (was 78%), middle 42% (was 55%), near 24% (was 30%).
- Trees step aside when their canopy is within about 8 m of the camera (was about 6 m). They also clear from a cone
  around the camera-to-tub sightline that widens about 12° each side (was a fixed-width corridor).

## Materials
- **Moulded edges (Medium and High):** every box-built part (tree canopy plates and trunks, building trim, cornices,
  quoins, props, rocks, rails, spectators, judge stands) rounds off over its last 3–10 cm. Its normal tilts outward,
  so edges catch the sun and sky like moulded plastic. This is done in the shader from per-face coordinates and adds
  no triangles. It fades out where the bevel would be under a pixel wide.
- **Brick relief:** each brick on brick walls tilts its normal at its edges (up at its top, down at its foot, along
  the wall at its ends), so the courses respond to the sun.
- **Clear water:** tub water and the creek ford are now see-through when viewed from above and mirror the sky at a
  glancing angle, with drifting ripple glints near the camera. The crew's legs show through the tub water.
- **Glass:** window panes mirror more sky at a glancing angle. On the commercial blocks each pane is shaded along its
  top and sides as if set back behind its frame.

## Lighting
- Sun shadows: the shadow depth range is tightened to 240 m (was 359 m) and the depth bias cut from about 43 cm to
  about 6 cm. Low parts such as a tub's chassis now cast shadows. This removes the stepped light band that showed
  inside the chassis shadow in close-ups.
- Dusk lamp pools are wider (8.5 m radius, was 6.5 m) and brighter at the centre, reaching across the near lane. The
  dusk ground fill is lighter (#4A4556, was #3E3A4A).
- High-tier ambient occlusion widens with distance (the radius grows about 4% per metre from the camera) and is a
  little stronger (0.85, was 0.75). Close-ups keep the tight radius.

## Animation and feel
- Pushers lean into acceleration (a push-off or a boost) and straighten as the tub slows. Before, lean followed speed
  only.
- The tub water sloshes: a damped spring driven by the tub's acceleration and turning tilts it on top of the
  sim's slosh tilt (up to about 16°) and keeps it rocking after a push, a stop or a turn. A small wave rides on it
  while it moves.
- Steam puffs swell as they rise (about 1.7× over a boost puff's life). Every particle shrinks away over its last
  quarter instead of vanishing.
- Slide charge: an arc outside the player's ring fills from the tail toward the nose on both sides as a power slide
  charges. It is water blue, warms to white at the warm tier and turns orange at the hot tier.
- Impacts (hits, fumbles, wall and fence hits, hard landings) also kick the camera's pitch by up to about 1.5°,
  ringing down with the existing shake.

## UI and mobile
- The item bubble and the ticket count sit together on one slate tile like the other readouts. The count carries a
  "TICKETS" label.
- HUD tiles keep at least an 8 px gutter. Phone portrait: the item tile sits below the place tile (it overlapped it
  by 10 px). Phone landscape: the water gauge sits below the lap tile (it overlapped by 4 px) and the minimap below
  the place tile (it overlapped by 6 px). Measured gaps are now 10 px in each case.

## Performance (measured; vsync off)
| Proxy · tier · viewport | min fps | worst p95 (ms) | worst task (ms) | calls | triangles |
|---|---|---|---|---|---|
| gpu · low · desktop | 1719 | 1.0 | 0.6 | 107 | 111k |
| gpu · low · mobile | 1340 | 1.6 | 0.7 | 102 | 109k |
| gpu · medium · desktop | 1079 | 1.9 | 0.8 | 161 | 385k |
| gpu · medium · mobile | 1306 | 1.2 | 0.7 | 156 | 383k |
| gpu · high · desktop | 1223 | 1.3 | 0.8 | 180 | 493k |
| gpu · high · mobile | 1298 | 1.1 | 0.7 | 173 | 491k |
| gpu · low · mobile · 4× CPU | 254 | 5.5 | 0.9 | 102 | 109k |
| gpu · medium · mobile · 4× CPU | 175 | 7.6 | 1.4 | 156 | 383k |
| swiftshader · low · mobile | 51 | 34.5 | 1.8 | 102 | 109k |

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
   `"loop": 7`, `"tier": "high"`, `ab` (from loop 1 on) and `ip`.

Don't edit any file. Reply with the review only.
