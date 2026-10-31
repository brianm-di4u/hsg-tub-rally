# Judge ruling: loop 9, high tier

All capture paths are relative to `screenshots/review-loop-9/`. I took every measurement on the full-size PNGs, using my own crops in a scratch folder. L is Rec. 709 luma (0–255). Strip tiles are 480×300.

## Verdict
**Continue. Judged total 67.5/100.** Five categories are below their gate: materials, scenery, lighting, animation and readability, all at 6.5. The measured perf gate also failed. The developer attributes that failure to machine load. I can't verify that from the captures, and it blocks `stop-pass` on its own whatever the cause.

This loop's real gains don't lift any category across a half-point boundary:
- the fixed gold player marker;
- hit feedback with a genuine camera kick;
- clean phone results and a clean landscape team select;
- a darker foothill row.

At the same time, three new defects appear in the captures:
- **Misregistered panes.** Flat panes sit over the painted arches on the Row landmark at the judge stop (`high/desktop/R16`).
- **The teal tub did not render.** The Out-of-Towners' tub is still purple.
- **The slide crashes through scenery.** The R14 slide still ends on the pavement in a lamp post, with no reaction.

Trend only: on `HISTORY.md`, 67.5 matches the best total so far, so it is not a new best.

## Housekeeping checks
- **Sums.**
  - Critic A (critic-claude): the prose says "Total 68/100", but its JSON sums to **67.5** (7 + 6.5 + 6.5 + 6.5 + 6.5 + 7 + 7 + 6.5 + 7 + 7). The prose overstates the total by 0.5; the JSON scores are internally consistent.
  - Critic B (critic-codex): the JSON sums to 68, matching its prose.
  - Prosecutor: 63.5, matching.
  - Advocate: 69.5, matching. Every proposed correction stays within ±1 of the critic mean.
- **A/B validity.** I checked every one of the 83 pairs against this loop's captures, measuring mean absolute difference (MAD). One half of each pair matches this loop's capture of the same tier and view.
  - High-tier frames match the high captures far better than the low ones: R08 15.1 vs 35.8, R19 18.9 vs 36.3.
  - The close-up pairs show the high tier, not low: MAD 11.9–16.4 against the high crops vs 21.5–27.6 against the low.
  - The pairs are valid, so there is **no `abWeight` void**. The critics' disagreements alone are not grounds for one.
- **Spreads.** No category has a critic spread above 1.0, and none has a prosecutor–advocate spread above 1.0. Four categories sit exactly at 1.0: materials, animation, readability and authenticity. I settled their factual disputes below anyway.

## Factual disputes settled
| Claim | Who | Ruling | Evidence |
|---|---|---|---|
| "No camera kick in any strip" | Critic A | **Wrong** (advocate and Codex right) | `strips/high/R15`: the ring's lower edge is at y 221 in frame 1, 239 in frame 2 and 247–255 in frames 3–8. The skyline at x 160/200/280/320 is at y 63/49/57/65 in frame 1 and 76–79/60/77/78 later. The camera jolts on the hit and settles over two frames. |
| "Dusk lamps light nothing" vs "useful pools of lamplight" | A vs Codex/advocate | **Critic A right in substance**; the advocate's numbers are real but don't show pools | `high/desktop/R07`. Sampled along the left curb, 25 px inside the edge line, the road L rises to 160–173 at x≈190–250, between the lamps. It falls to **67–77 right beside the lamp at x≈350**. `low/desktop/R07` has the same profile. The bright curbside asphalt is sun-and-shadow patterning, not light from the lamps. The prosecutor's monotonic row at y=650 is real but was taken nearer the camera than any lamp. |
| "Tree plates have no studs" | Critic A | **Wrong** | `high/desktop/R05` zoom (x 600–880, y 580–760): rows of shaded studs on every near tree-plate top. R10 shows only the undersides. |
| Facades have "no seams, no bevel highlights" | Critic A | **Half wrong** | `high/desktop/R13` and `high/desktop/R05` zooms show running-bond mortar seams, per-brick relief shading and projecting frames and sills. Corner bevel highlights are indeed absent, and the roofs are flat planes (`high/desktop/R06`). |
| "Faces are two dots and a mouth" | Critic A | **Wrong** | `crops/high/R04-kart_3`: angled printed brows. `crops/high/R02-preview-captain`: eye highlights, teeth and tongue. |
| "Space under the chassis is flat grey" | Critic A | **Wrong** | `crops/high/R03-kart_1`: the road under the chassis is (34,39,42), against (82,92,99) on open road, about 0.45×. The kart is grounded. Crevice AO is still absent. |
| Out-of-Towners' tub still purple | A, prosecutor, advocate | **Confirmed** | `crops/high/R04-kart_3` body (93,63,107), hue 281°, and (67,42,97), 267°; rim (85,139,139), 180°. The `high/desktop/R02` swatch shows a teal body (47,179,166) with a yellow rim. The antenna and tie-dye crew is the player in `high/desktop/R12`, still on a purple tub. `ab/crop-R04-kart_3` is identical on both sides, so the logged teal tub never rendered. |
| R16 panes misregistered (new) | Prosecutor | **Confirmed** | `high/desktop/R16` zoom: flat grey panes float over the blurred painted arches and bare brick. One side of `ab/high-desktop-R16` has none. |
| R14 slide ends on the pavement in a lamp post | Prosecutor | **Confirmed** | `strips/high/R14` frames 7–8: the tub is on the sidewalk tiles against the crowd fence, with the lamp post rising at the ring. There is no reaction, and the road ahead is out of frame. `ab/strip-R14` shows the same in both builds. |
| Tree interpenetration | Prosecutor | **Confirmed** | `high/desktop/R10` (x 880–1200, y 80–380): dark conifer plates poke through the light-green broadleaf canopy. `high/desktop/R08` (x 100–480, y 0–280): tan plank canopy interleaved with conifer tiers. |
| Held props clip the fists | Prosecutor | **Confirmed, minor** | `crops/high/R02-preview-captain`: the soap bar's lower face cuts into the fist. `crops/high/R02-preview-rear`: the fist overlaps the towel slab. |
| The R15 circle is "two alternating poses" | Prosecutor | **Measurement right, interpretation wrong** | My crew-region MAD is 9.1 for frames 5–7 and 8.0 for 6–8, against 10.9–16.0 for other pairs. But the crew member holding the light-blue towel moves front (frame 3) → right-back (frame 6) → left-back (frame 8), about 45° per step. Four identical figures at 90° spacing repeat their layout every two steps. The crew does progress around the tub. |
| The far rings "read as snow"; the haze is "grey, not sky hue" | Prosecutor | **Overstated** | Far-ring faces: `high/desktop/R09` (171,190,198), hue 198°, saturation 0.14; `high/desktop/R17` (164,183,194), 202°, 0.15. The sky is about 204°, saturation 0.19. The hue matches the sky and only the saturation is lower. The middle rings are green and treed. The real fault is low value contrast: the rings look like flat cardboard. |
| "Only the top of the barrel shows" (R10) | Critic A | **Overstated** | `high/desktop/R10` zoom: the barrel body shows between the pushers. `high/desktop/R04`: the red tub shows too. Tubs further ahead in a pack are hidden. |
| Hot steam reads tan | A, prosecutor, advocate | **Confirmed** | `high/desktop/R17` (615–645, 570–600) is (162,142,117): a translucent disc clump picking up the red brick. |
| Phone results baseline | Prosecutor | **Confirmed** | `high/mobile/R18`: digit tops are at 721/773/825 for time and 725/777/829 for water. "(you)" wraps out to the left of the name column. |

## Category rulings
- **Characters: 7.0.** The 7 anchor is met.
  - Strengths:
    - Original block figures with expressive printed faces (`crops/high/R02-preview-captain`, `crops/high/R04-kart_3`).
    - Printed uniforms: X straps, hydrant badge, tie-dye, gator dots.
    - Studded chassis, plus division-specific tubs: clawfoot and barrel (`high/desktop/R10`).
    - All teams distinct at chase distance by costume and headgear (`high/desktop/R12`).
  - Deductions, which keep it from rising:
    - The tubs are single smooth mouldings.
    - The firefighter helmets have no studs.
    - The head backs are blank (`crops/high/R02-preview-rear`).
    - Props clip the fists slightly.
  - The prosecutor's 6.5 overweights two small clips; the advocate and both critics are right.
- **Materials: 6.5.**
  - Strengths:
    - The figure, tub and duck plastic is convincing, and the tub water is clear (`crops/high/R02-preview-captain`).
    - Studs show on the baseplate and on near tree-plate tops, and the brick facades have seams and relief (`high/desktop/R05` zoom).
    - The bubble pickups are iridescent (`high/desktop/R17`).
  - Against `worlds-1` (7), where roofs are slope bricks and fences are parts:
    - The buildings here are textured boxes with flat roof planes and no corner bevels (`high/desktop/R06`).
    - The ford is opaque blue tile (`high/desktop/R19`).
    - The Fordyce glazing uses diagonal streak bands (`high/desktop/R05`).
    - The loofah is a faceted polyhedron (`high/desktop/R17`).
  - The advocate's 7 rests on rebuttals that are true but don't cover the buildings or the water. The prosecutor's 6.0 leans on the steam, which is an effect rather than a material.
- **Scenery: 6.5.**
  - Strengths: a coherent brick town with baseplate, tile roads, lamps and crowds (`high/desktop/R04`), and course set pieces (`high/desktop/R09`, `high/desktop/R19`, `high/desktop/R17`).
  - Held below 7 by:
    - cardboard-flat far rings (`high/desktop/R09`);
    - a repeated downtown module (`high/desktop/R13`);
    - confirmed tree interpenetration (`high/desktop/R08`, `high/desktop/R10`);
    - the new pane misregistration on the Row (`high/desktop/R16`), which offsets the Fordyce fix.
  - Critic A (6.5) is closer than Critic B (6.0). Codex's "repeated conifers" ignores the mixed species in R09 and R12.
- **Lighting: 6.5.**
  - Strengths:
    - Soft key-light shadows (`high/desktop/R19`, `high/desktop/R08`).
    - Grounded tubs: the road under the chassis is about 0.45× open road (`crops/high/R03-kart_1`).
    - Deliberate dusk and sunset palettes (`high/desktop/R07`, `high/desktop/R11`).
    - Haze on the sky's hue.
  - Missing from the 7 anchor:
    - crevice and foundation AO (`high/desktop/R06`, `high/desktop/R09`);
    - lamp pools at dusk (see the table above).
  - Daylight on the Arlington is flat. The prosecutor's haze clause fails on measurement, so 6.0 is too low; occlusion keeps it from 7.
- **Animation: 6.5.**
  - Strengths:
    - Hits now read: flash, call-out, splash beads and a measured camera kick (`strips/high/R15`).
    - The crew genuinely circle the tub (`strips/high/R15`, `strips/high/R16`).
    - The R14 charge arc grows.
  - Missing from the 7 anchor:
    - Water never sloshes.
    - The slide steam is grey beads (`strips/high/R14`).
    - The hot steam turns tan on brick (`high/desktop/R17`).
    - The slide ends on the pavement inside a lamp post with no response (`strips/high/R14` frames 7–8).
  - The advocate's 7 needs slosh and a clean slide. The prosecutor's 6.0 rests partly on the two-pose reading, which I rejected.
- **UI / HUD: 7.0.** All four agree.
  - One studded-tile family with a clear hierarchy across HUD, title and results (`high/desktop/R04`, `high/desktop/R18`, `high/mobile/R18`).
  - Weaknesses: the empty item orb is as large as the place tile, and the desktop CLEAN pills differ from the phone check marks.
- **Typography: 7.0.**
  - The two-level display-plus-sans scale holds; numerals read and nothing is clipped (`high/desktop/R18`, `high/mobile/R18`).
  - Confirmed polish misses, none of them anchor failures:
    - the phone water column sits 4 device px low;
    - "(you)" is outdented;
    - the selected card's label is about 2.4:1 (`high/mobile/R02`).
  - The prosecutor's 6.5 is not justified on the anchor.
- **Readability: 6.5.**
  - Strengths:
    - The gold marker isolates the player on every surface and on both phone viewports (`high/mobile/R04`, `high/desktop/R13`).
    - Pickups glow and road edges are lined.
    - The tub body shows between the pushers (`high/desktop/R10`).
  - The "every frame" clause still fails:
    - The Out-of-Towners' tub is purple beside the Velvet Mob's (`high/desktop/R07`), and it is the player's tub in `high/desktop/R12`.
    - The route beyond the ford is hidden by trees, with the WARM STEAM banner over the vanishing point (`high/desktop/R19`).
    - The road leaves the frame after the slide (`strips/high/R14` frame 8).
    - Pack tubs ahead are hidden behind their crews (`high/desktop/R04`).
  - Critic A (6.5) is right. Critic B's 7 rests on one phone frame, and the advocate's crew-hiding rebuttal holds only for the near tub.
- **Mobile: 7.0.** All four agree.
  - The controls never cover the tub in either orientation (`high/mobile/R04`, `high/landscape/R04`), and the phone results are clean (`high/mobile/R18`).
  - Faults:
    - The portrait team-select panel cuts the preview's wheels and feet at y≈510 (`high/mobile/R02`). Critic A missed this; the advocate conceded it.
    - The landscape left column covers 57% of the height, but only over the sidewalk.
- **Authenticity: 7.0.** The gate is 6, so it is met.
  - Strengths:
    - The Fordyce marquee and shop windows (`high/desktop/R05`).
    - The Arlington's twin towers (`high/desktop/R06`).
    - The Quapaw dome (`high/desktop/R14`).
    - The race ritual (`strips/high/R16`).
  - Held at 7 by:
    - generic stepped ridges for the Ouachitas (`high/desktop/R09`);
    - a generic Bridge Street (`high/desktop/R13`);
    - the R16 pane regression on the Row.
  - The prosecutor's "snow" reading fails on measurement. Codex's and the advocate's 7.5 overlook the R16 regression and the generic mountains.

## IP check
**Clean**, and I agree with all four reviewers:
- the heads are bevelled cubes (`crops/high/R02-preview-rear`);
- the hands are rounded mitten fists (`crops/high/R02-preview-captain`);
- the torsos are straight-sided boxes;
- no LEGO name or logo appears in any frame, menu or results screen.

The two-block legs are generic. The developer's IP gate stands.

## Calibration (`reviews/loop-9/calibration.jpg`, scored on the anchors alone)
- **Materials 8.5.** The vehicles are unmistakably brick parts, with plastic sheen, visible studs and seams, and bevels catching light. The terrain, rock, grass and water are stylised-real rather than toy, so "every surface is a real toy" (9) isn't met.
- **Lighting 8.5.** Bright sun with soft shadows and grounded contact under the truck, plus occlusion, bounce colour and aerial haze. It reads as a high-end game rather than a photographed toy, so it falls just short of 9.

## Ranked gaps (top 12, by expected gain ÷ effort; ties go to below-gate categories)
**Merged:**
- Critic A's hill rings, the prosecutor's icy hue and the ring half of Codex's terrain assembly became **G-far-rings-flat**.
- Critic A's flat facades became **G-box-buildings**.
- Codex's contact light and the AO half of Critic A's AO-and-lamp-pools gap became **G-ao-crevices**.
- The lamp half of that gap became **G-dusk-lamp-pools**.
- The steam gaps split into **G-hot-steam-blend** and **G-water-slosh**, the anchor clause.

**Causes fixed:**
- Tree studs and mortar seams already exist.
- The camera kick already exists.
- The "icy" rings are a value-contrast problem, not a hue problem.
- The R15 "two poses" is rotational symmetry.
- Crew-hides-tub is overstated, so it was cut.

1. **G-oot-tub-teal** (readability, WS2, sev 3, S, +0.25). The logged teal tub never rendered. The body is purple (hue 257–281°) with a teal rim (180°), against a teal-body, yellow-rim swatch.
   - Fix: apply teal (47,179,166) to the Out-of-Towners' tub body material, with yellow trim to match the swatch.
   - Test: the body hue in `crops/high/R04-kart_3` is 165–185°, and the player's tub in `high/desktop/R12` is teal.
2. **G-row-panes-misregistered** (scenery, WS4, sev 3, S, +0.25; regression). Flat panes float over the painted arches at the R16 Row landmark.
   - Fix: skip upright panes on any facade whose art paints its ground floor (as for the Quapaw), or snap the panes to a per-landmark bay list.
   - Test: in `high/desktop/R16`, no pane overlaps bare brick or a painted arch outline.
3. **G-hot-steam-blend** (animation, WS3, sev 2, S, +0.25). The hot steam reads as a tan blob, (162,142,117), on red brick.
   - Fix: give hot-steam particles an additive or opaque warm-white material (no alpha blend that takes the ground colour).
   - Test: the R17 steam region's mean L is at least 200, with RGB channels within 20 of each other.
4. **G-dusk-lamp-pools** (lighting, WS1, sev 2, S, +0.25). The lamps cast no pools. The road beside the R07 lamp at x≈350 is L 67–77.
   - Fix: on dusk and sunset courses, add a warm additive ellipse decal (r≈3 m) under each lamp.
   - Test: along the R07 left curb, road L within 2 m of each lamp base is at least 1.25× the road L midway between lamps.
5. **G-callout-dock** (readability, WS6, sev 2, S, +0.25). Call-outs cover the vanishing point (`high/desktop/R15`, `R16`, `R19`).
   - Fix: dock call-outs under the place tile or in the lower third, and fade them to 60% after 0.5 s.
   - Test: no call-out rectangle overlaps the central 30% of the width within 60 px of the horizon in R15, R16, R17 or R19.
6. **G-tree-spacing** (scenery, WS5, sev 2, S, +0.25). Canopies interpenetrate in R08 and R10.
   - Fix: enforce a minimum spacing equal to the sum of the canopy radii across species.
   - Test: no plate of one tree passes through another's canopy in `high/desktop/R08` or `high/desktop/R10`.
7. **G-water-slosh** (animation, WS3, sev 3, M, +0.5). Tub water stays level through slides and hits.
   - Fix: tilt and bob the water plane, with spring damping, from longitudinal and lateral acceleration and from hits.
   - Test: the waterline angle differs by at least 5° between frames 1 and 5 of `strips/high/R14`, and by at least 5° between frames 1 and 3 of R15.
8. **G-slide-kerb-lamppost** (animation, WS3, sev 3, M, +0.5). The slide mounts the pavement into a lamp post with no reaction, and the camera loses the road.
   - Fix: give kerbs and posts a collision response: bump or stop, camera kick, call-out.
   - Fix: clamp chase-camera yaw lag.
   - Test: in `strips/high/R14`, the ring never overlaps pavement or a post, and frame 8 shows the road centreline.
9. **G-ao-crevices** (lighting, WS1, sev 3, M, +0.5). There is no occlusion at foundations, under ledges or between slabs.
   - Fix: add SSAO on high, or baked vertex AO on placed buildings and rock assemblies.
   - Test: the band where the arcade meets the terrace in `high/desktop/R06` is at least 20% darker than the facade 2 m above, and the slab crevices in `high/desktop/R09` are at least 25% darker than the adjacent lit faces.
10. **G-far-rings-flat** (scenery, WS4, sev 3, M, +0.5). The far rings are flat, low-contrast stepped cut-outs, (171,190,198) in R09.
    - Fix: give each ring lit tops and shadowed risers, and darker tree silhouettes; keep the haze on the sky's hue.
    - Test: the face-to-riser L ratio is at least 1.15, and the tree silhouettes are at least 12% darker than the faces in `high/desktop/R09` and `high/desktop/R13`.
11. **G-ford-glazing** (materials, WS1, sev 3, M, +0.5). The ford is opaque blue tile (`high/desktop/R19`), and the Fordyce shop glazing uses diagonal streak bands (`high/desktop/R05`).
    - Fix: make the ford a translucent tinted surface over a visible studded creek bed.
    - Fix: replace the streak bands with a vertical sky-to-ground gradient and bevelled frames.
    - Test: the creek-bed studs are visible through the water in R19.
12. **G-box-buildings** (materials, WS1, sev 3, L, +0.75). **This loop's big lever.** Box-wall buildings with flat roof planes and no corner bevels are the main thing holding materials below `worlds-1`.
    - Fix: rebuild the roofs from stepped slope-brick courses with ridge tiles (Arlington, Fordyce, downtown).
    - Fix: add bevelled corner quoins and lintel parts with specular edges, keeping the existing seam and relief textures.
    - Test: at least 6 roof courses with alternating light and dark edges show in `high/desktop/R06`, and a highlight runs along building corners in the `high/desktop/R13` zoom.

**Cut** (at-gate categories, or a lower ratio):
- **Typography polish:** the selected label at 2.4:1, the results baseline 2 CSS px low, the "(you)" indent.
- **Portrait team select:** the panel crops the preview.
- **Repeated storefronts.**
- **Characters:** blank head backs, tub part joins, prop grip.
- **Steam plume shape.**
- **Faceted loofah.**
- **Landscape HUD weight.**

```json
{
  "loop": 9,
  "role": "judge",
  "tier": "high",
  "verdict": "continue",
  "scores": {
    "characters": { "score": 7.0, "confidence": 0.75, "evidence": [
      { "shot": "crops/high/R02-preview-captain", "note": "eye highlights, teeth and tongue, printed coat with hydrant badge; soap bar's lower face cuts into the fist (minor)" },
      { "shot": "crops/high/R04-kart_3", "note": "angled printed brows; tub is one smooth moulding, body purple hue 267-281 deg with teal rim" },
      { "shot": "crops/high/R02-preview-rear", "note": "blank head backs; studless helmets; printed X straps and bands" },
      { "shot": "high/desktop/R12", "note": "teams distinct at chase distance by costume and headgear" } ] },
    "materials": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "crops/high/R02-preview-captain", "note": "convincing glossy plastic and clear tub water" },
      { "shot": "high/desktop/R05", "note": "zoom: studs on near tree-plate tops, mortar seams and relief brick; diagonal streak glazing" },
      { "shot": "high/desktop/R06", "note": "box walls with flat roof planes, no corner bevel highlights" },
      { "shot": "high/desktop/R19", "note": "ford is opaque flat blue tile" },
      { "shot": "high/desktop/R17", "note": "faceted low-poly loofah; iridescent bubble pickup" } ] },
    "scenery": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R04", "note": "coherent brick town: baseplate, tile road, lamps, crowds, landmarks" },
      { "shot": "high/desktop/R09", "note": "Goat Rock set piece; far ring flat pale stepped cut-out (171,190,198)" },
      { "shot": "high/desktop/R10", "note": "dark conifer plates pierce the light-green broadleaf canopy at x 880-1200, y 80-380" },
      { "shot": "high/desktop/R16", "note": "new: flat panes misregistered over painted arches and bare brick" },
      { "shot": "high/desktop/R13", "note": "repeated two-storey downtown module" } ] },
    "lighting": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R07", "note": "deliberate dusk palette; left-curb road L 160-173 between lamps but 67-77 beside the x~350 lamp: no lamp pools (same on low/desktop/R07)" },
      { "shot": "high/desktop/R11", "note": "deliberate sunset palette with haze" },
      { "shot": "crops/high/R03-kart_1", "note": "road under chassis (34,39,42) vs open road (82,92,99): grounded by cast shadow, no crevice AO" },
      { "shot": "high/desktop/R06", "note": "flat daylight, no AO where the arcade meets the terrace" },
      { "shot": "high/desktop/R09", "note": "far-ring haze hue 198 deg vs sky ~204 deg (matched), saturation 0.14 vs 0.19" } ] },
    "animation": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "strips/high/R15", "note": "camera kick: ring lower edge y 221 (f1), 239 (f2), 247-255 (f3-8); flash, call-out, splash; crew progresses ~45 deg per step (towel holder front, then right-back, then left-back)" },
      { "shot": "strips/high/R14", "note": "charge arc grows; steam is grey beads; frames 7-8 tub on the pavement at a lamp post with no reaction (same in ab/strip-R14)" },
      { "shot": "strips/high/R16", "note": "crew circle with swinging limbs, progress bar fills; judges static" },
      { "shot": "high/desktop/R17", "note": "hot steam a translucent tan clump (162,142,117) on red brick; tub water never sloshes" } ] },
    "ui": { "score": 7.0, "confidence": 0.75, "evidence": [
      { "shot": "high/desktop/R04", "note": "clear place/lap/time/water/item/map hierarchy in one studded-tile style; empty orb oversized" },
      { "shot": "high/desktop/R18", "note": "results match the HUD style; CLEAN pills on desktop vs check marks on phone" },
      { "shot": "high/mobile/R18", "note": "phone results clean with swatches and check marks" } ] },
    "typography": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R18", "note": "pixel display face over sans: clear two-level scale, numerals read" },
      { "shot": "high/mobile/R18", "note": "water digit tops 725/777/829 vs time 721/773/825 (4 device px low); '(you)' outdented" },
      { "shot": "high/mobile/R02", "note": "selected card division label about 2.4:1" } ] },
    "readability": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "high/mobile/R04", "note": "gold marker isolates the player; controls clear" },
      { "shot": "high/desktop/R10", "note": "barrel body visible between pushers (crew-hiding overstated for the near tub)" },
      { "shot": "high/desktop/R12", "note": "player is the antenna/tie-dye crew on a purple tub despite a teal swatch" },
      { "shot": "high/desktop/R07", "note": "Out-of-Towners' purple tub beside the Velvet Mob's purple tub" },
      { "shot": "high/desktop/R19", "note": "route past the ford hidden by trees; WARM STEAM banner on the vanishing point" },
      { "shot": "strips/high/R14", "note": "frame 8: road ahead out of frame" } ] },
    "mobile": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "high/mobile/R04", "note": "thumb controls clear of the tub; forward view kept" },
      { "shot": "high/landscape/R04", "note": "left column y 25-445 of 780 but only over sidewalk and facade" },
      { "shot": "high/mobile/R02", "note": "panel top at y~510 cuts the preview's wheels and feet" },
      { "shot": "high/mobile/R18", "note": "phone results framed, values on one line" } ] },
    "authenticity": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R05", "note": "Fordyce marquee with ground-floor shop windows" },
      { "shot": "high/desktop/R06", "note": "Arlington twin towers close the vista" },
      { "shot": "strips/high/R16", "note": "judge stop ritual, water line, duck, flags" },
      { "shot": "high/desktop/R09", "note": "Ouachitas are generic stepped ridges (not snow: hue matches sky)" },
      { "shot": "high/desktop/R16", "note": "Row landmark now has misregistered panes" },
      { "shot": "high/desktop/R13", "note": "Bridge Street generic downtown" } ] }
  },
  "ip": { "clean": true, "notes": "Checked crops/high/R02-preview-rear and crops/high/R02-preview-captain: bevelled cube heads, mitten fists, straight box torsos; generic two-block legs; no LEGO name or logo anywhere." },
  "calibration": { "materials": 8.5, "lighting": 8.5 },
  "gaps": [
    { "id": "G-oot-tub-teal", "category": "readability", "expectedGain": 0.25, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R04-kart_3", "ab/crop-R04-kart_3", "high/desktop/R12", "high/desktop/R07", "high/desktop/R02"], "benchmark": "drive-3", "fix": "The logged teal tub never rendered: the Out-of-Towners' body is purple (hue 257-281 deg) with a teal rim (180 deg), against a teal-body, yellow-rim swatch (47,179,166). Apply teal to the tub body material and yellow to the trim. Test: crops/high/R04-kart_3 body hue 165-185 deg; the player tub in high/desktop/R12 is teal." },
    { "id": "G-row-panes-misregistered", "category": "scenery", "expectedGain": 0.25, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R16", "ab/high-desktop-R16"], "benchmark": "worlds-1", "fix": "Regression: flat panes float over painted arches and bare brick on the R16 Row landmark. Skip upright panes on any landmark whose facade art paints its ground floor (as for the Quapaw), or snap panes to a per-landmark bay list. Test: in high/desktop/R16 no pane overlaps bare brick or a painted arch outline." },
    { "id": "G-hot-steam-blend", "category": "animation", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["high/desktop/R17"], "benchmark": "drive-3", "fix": "Give hot-steam particles an additive or opaque warm-white material so they stop taking the ground colour (now (162,142,117) on red brick). Test: the R17 steam region's mean L is at least 200 with RGB channels within 20 of each other." },
    { "id": "G-dusk-lamp-pools", "category": "lighting", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R07", "low/desktop/R07"], "benchmark": "worlds-4", "fix": "On dusk and sunset courses, add a warm additive ellipse decal (r about 3 m) under each lamp. Test: along the R07 left curb, road L within 2 m of each lamp base is at least 1.25x the road L midway between lamps (now 67-77 beside the x~350 lamp vs 160-173 between lamps)." },
    { "id": "G-callout-dock", "category": "readability", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R15", "high/desktop/R16", "high/desktop/R19"], "benchmark": "drive-3", "fix": "Dock transient call-outs under the place tile or in the lower third, and fade them to 60% after 0.5 s. Test: in R15, R16, R17 and R19 on every viewport, no call-out rectangle overlaps the central 30% of the width within 60 px of the horizon." },
    { "id": "G-tree-spacing", "category": "scenery", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R08", "high/desktop/R10"], "benchmark": "worlds-1", "fix": "Place trees at a minimum spacing equal to the sum of their canopy radii across species (Poisson-disc), or merge close pairs into one built assembly. Test: no plate of one tree passes through another tree's canopy in high/desktop/R08 or R10." },
    { "id": "G-water-slosh", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15"], "benchmark": "drive-3", "fix": "Tilt and bob each tub's water plane from longitudinal and lateral acceleration and from hits, with spring damping. Test: the waterline angle differs by at least 5 deg between frames 1 and 5 of strips/high/R14, and between frames 1 and 3 of R15." },
    { "id": "G-slide-kerb-lamppost", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "ab/strip-R14"], "benchmark": "drive-3", "fix": "Give kerbs and lamp posts a visible collision response (bump or stop, camera kick, call-out) and clamp chase-camera yaw lag so the road ahead stays in frame. Test: in strips/high/R14 the player's ring never overlaps pavement or a post, and frame 8 shows the road centreline." },
    { "id": "G-ao-crevices", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R06", "high/desktop/R09", "crops/high/R03-kart_1"], "benchmark": "builders-journey/bj-1.jpg", "fix": "SSAO on high, or baked vertex AO on placed buildings and rock assemblies (foundations, under ledges, between slabs). Test: the band where the Arlington's arcade meets the terrace in high/desktop/R06 is at least 20% darker than the facade 2 m above; Goat Rock slab crevices in R09 are at least 25% darker than the adjacent lit faces." },
    { "id": "G-far-rings-flat", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R13", "high/desktop/R17"], "benchmark": "worlds-4", "fix": "The far rings are flat, low-contrast stepped cut-outs ((171,190,198) in R09). The haze hue already matches the sky; the problem is value. Give each ring lit tops and shadowed risers, and darker tree silhouettes. Test: in R09 and R13, the far-ring face/riser L ratio is at least 1.15 and the tree silhouettes are at least 12% darker than their faces." },
    { "id": "G-ford-glazing", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R19", "high/desktop/R05"], "benchmark": "builders-journey/bj-3.jpg", "fix": "Make the Gulpha ford a translucent tinted surface over a visible studded creek bed (now opaque blue tile); replace the diagonal streak bands on the shop glazing with a vertical sky-to-ground gradient and bevelled frames. Test: creek-bed studs are visible through the water in high/desktop/R19, and no diagonal band crosses any R05 shop pane." },
    { "id": "G-box-buildings", "category": "materials", "expectedGain": 0.75, "severity": 3, "effort": "L", "workstream": "WS1", "evidence": ["high/desktop/R06", "high/desktop/R13", "high/desktop/R05"], "benchmark": "worlds-1", "fix": "BIG LEVER for this loop. Buildings are textured boxes with flat roof planes and no corner bevels; this is what holds materials below worlds-1. Rebuild the roofs from stepped slope-brick courses with ridge tiles (Arlington, Fordyce, downtown) and add bevelled corner quoins and lintel parts with specular edges; keep the existing seam and relief textures. Test: at least 6 roof courses with alternating light/dark edges show in high/desktop/R06, and a highlight runs along the building corners in the high/desktop/R13 zoom." }
  ]
}
```
