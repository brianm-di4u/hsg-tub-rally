# Critic brief: loop 9

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
844×390@2× phone landscape. Root: `games/Cart Racing/screenshots/review-loop-9/`.

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
83 pairs in `screenshots/review-loop-9/ab/`. Each image shows the same moment from two builds, **A** on the left and **B** on the right. One of them is this loop's build and the other is the previous one; which is which is hidden from you, and A is the same build in every pair. Files: `ab/crop-R02-preview-captain`, `ab/crop-R02-preview-rear`, `ab/crop-R02-preview`, `ab/crop-R03-kart_1`, `ab/crop-R03-kart_5`, `ab/crop-R03-player-rear`, `ab/crop-R03-player`, `ab/crop-R04-kart_3`, `ab/crop-R04-player`, `ab/crop-R15-player`, `ab/high-desktop-R01`, `ab/high-desktop-R02`, `ab/high-desktop-R03`, `ab/high-desktop-R04`, `ab/high-desktop-R05`, `ab/high-desktop-R06`, `ab/high-desktop-R07`, `ab/high-desktop-R08`, `ab/high-desktop-R09`, `ab/high-desktop-R10`, `ab/high-desktop-R11`, `ab/high-desktop-R12`, `ab/high-desktop-R13`, `ab/high-desktop-R14`, `ab/high-desktop-R15`, `ab/high-desktop-R16`, `ab/high-desktop-R17`, `ab/high-desktop-R18`, `ab/high-desktop-R19`, `ab/high-landscape-R01`, `ab/high-landscape-R02`, `ab/high-landscape-R03`, `ab/high-landscape-R04`, `ab/high-landscape-R07`, `ab/high-landscape-R08`, `ab/high-landscape-R17`, `ab/high-landscape-R18`, `ab/high-mobile-R01`, `ab/high-mobile-R02`, `ab/high-mobile-R03`, `ab/high-mobile-R04`, `ab/high-mobile-R07`, `ab/high-mobile-R08`, `ab/high-mobile-R17`, `ab/high-mobile-R18`, `ab/low-desktop-R01`, `ab/low-desktop-R02`, `ab/low-desktop-R03`, `ab/low-desktop-R04`, `ab/low-desktop-R05`, `ab/low-desktop-R06`, `ab/low-desktop-R07`, `ab/low-desktop-R08`, `ab/low-desktop-R09`, `ab/low-desktop-R10`, `ab/low-desktop-R11`, `ab/low-desktop-R12`, `ab/low-desktop-R13`, `ab/low-desktop-R14`, `ab/low-desktop-R15`, `ab/low-desktop-R16`, `ab/low-desktop-R17`, `ab/low-desktop-R18`, `ab/low-desktop-R19`, `ab/low-landscape-R01`, `ab/low-landscape-R02`, `ab/low-landscape-R03`, `ab/low-landscape-R04`, `ab/low-landscape-R07`, `ab/low-landscape-R08`, `ab/low-landscape-R17`, `ab/low-landscape-R18`, `ab/low-mobile-R01`, `ab/low-mobile-R02`, `ab/low-mobile-R03`, `ab/low-mobile-R04`, `ab/low-mobile-R07`, `ab/low-mobile-R08`, `ab/low-mobile-R17`, `ab/low-mobile-R18`, `ab/strip-R14`, `ab/strip-R15`, `ab/strip-R16`.

For each of the 10 categories, say which build is better on the evidence of the pairs that bear on it — `A`, `B`
or `tie` — with a confidence (0–1) and the pairs you used. Call a tie when the difference is within what you'd
expect from noise. Judge each category on its own; don't let one big change colour the rest.

## What changed this loop (facts only)
# Loop 9: changes (facts only)

## Animation and feel
- **Impact jolt:** the camera dip on impacts now reaches up to ~5.6° (was ~4°).
- **Shake timing:** camera shake and FOV punch decay on the frame's elapsed time, so a frozen review clock holds them
  like every other effect.
- **Slide steam:** leaves the rear wheels with a small outward push, drifts back and climbs at ~1.3–2.1 m/s. It
  swells 2.2× per second and lives 0.6–0.8 s.
- **Effect trails:** when a frame covers several 60 Hz ticks (a long frame, or a motion-strip step), the particles
  emitted in it are spread back along the tub's path and pre-aged, so they lay a trail instead of one clump.
- **Hot steam:** warm white (was orange beads), in both the boost trail and the release burst.
- **Hairpin camera:** in a tight turn the chase camera rises by up to 0.9 m and tucks in by up to 0.3 m.

## Readability
- **Player marker:** the player's arrow and ring are one fixed gold (#FFC92E) for every team. They were the team's
  flag colour, so a rival's ring could outshine the player's.
- **Rival rings:** washed 40% toward grey and slightly thinner.
- **Tub colours:** the Out-of-Towners ride a teal tub with purple trim. Their purple tub matched the Velvet Mob's.

## Scenery and lighting
- **Foothill ring:** a fourth, nearest horizon ring of low rolling foothills (296 m out, up to ~16 m high) stands in
  front of the three mountain rings, so the hills rise from the land in steps.
- **Hill brightness:** no hill face, lip or ledge renders brighter than 86% of the horizon sky colour. Hazed far
  ledges no longer show as white ghosts.
- **Wall bases:** placed buildings darken more, and over more height, where they meet the ground (to 50% at the base,
  over 1.8 m; was 60% over 1.3 m).
- **Brick relief:** fades out sooner with distance (less sparkle on distant facades).
- **Landmark glazing:**
  - Landmarks with painted facades keep their ground-floor shop windows again. Loop 8 had removed them with the
    upper-floor panes, leaving blank brick bays under the Fordyce's marquee.
  - The Quapaw, whose facade art paints its ground-floor arches too, keeps no upright panes.

## UI and mobile
- **Desktop HUD:** tiles grow 15% on desktop-sized windows. The ticket label is 12 px.
- **HUD studs:** the item orb and the item tray sit below their tiles' stud rows.
- **Portrait team select:** keeps 28 px (plus the safe area) below its panel. The panel's frame hangs ~12 px below
  its box, so the logged 16 px left only ~4 px.
- **Landscape team select:** cards are a 3-column grid of names only (the division shows in the details beside
  them). Names never break at their hyphens, and "locked" sits on its own line.
- **Locked labels:** a locked team's label sits on its own line everywhere (no orphaned "· locked").
- **Phone results:** keep the team swatches, keep each value on one line and show a clean finish as a green check
  mark.

## Review harness
- **Test hits:** a test hit (`act('hit')`) now delivers its events to the frame as a sim step would (call-out, flash,
  camera shake, particles). Before, R15's fumble showed no feedback, because the hit happened outside a step.

## Performance (measured; vsync off)
| Proxy · tier · viewport | min fps | worst p95 (ms) | worst task (ms) | calls | triangles |
|---|---|---|---|---|---|
| gpu · low · desktop | 1130 | 1.3 | 0.9 | 106 | 112k |
| gpu · low · mobile | 1162 | 1.2 | 0.8 | 101 | 110k |
| gpu · medium · desktop | 812 | 1.8 | 1.2 | 159 | 391k |
| gpu · medium · mobile | 829 | 1.7 | 1.2 | 154 | 389k |
| gpu · high · desktop | 753 | 2.0 | 1.3 | 178 | 499k |
| gpu · high · mobile | 765 | 1.9 | 1.3 | 171 | 497k |
| gpu · low · mobile · 4× CPU | 179 | 8.7 | 1.3 | 101 | 110k |
| gpu · medium · mobile · 4× CPU | 137 | 11.1 | 1.7 | 154 | 389k |
| swiftshader · low · mobile | 51 | 45.1 | 1.8 | 101 | 109k |

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
   `"loop": 9`, `"tier": "high"`, `ab` (from loop 1 on) and `ip`.

Don't edit any file. Reply with the review only.
