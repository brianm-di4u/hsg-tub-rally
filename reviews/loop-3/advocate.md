# Advocate: loop 3, high tier

Capture paths are relative to `games/Cart Racing/screenshots/review-loop-3/`. Pixel coordinates are in the file's own
pixels (desktop 1280×800; phone files at 2×). Measurements come from short PIL crops and patch statistics I ran on the
captures.

## Summary
Both critics total 64.5, so the mean is 64.5. I propose **67.5**. Most of the critics' calls hold up, and I concede
them:
- the faceted tub rim and static water in close-up;
- the textureless asphalt;
- the matte foliage and the opaque ford;
- missing AO under cornices, and lamp-pool clipping at dusk;
- no camera kick and no visible water tilt;
- the R06 world-edge band and the R09 pine field;
- the landscape team-select overlap;
- R19 as a real readability failure.

Several deductions rest on things that are visibly wrong in the captures:
- The asphalt has a specular lobe.
- Shaded surfaces carry a green ground bounce.
- The hands are thumbed mitten fists, not blocks.
- Two of the hat sets carry top studs.
- The judge stop has a studded stop line and a referee-striped judge.
- Slide beads emit at the wheels in every frame from 2 on.
- The landmark lawns are well under Critic A's own 20% threshold in R05 and R06.
- The Arlington's olive cast is a lighting effect, not its material.

Two procedural points also change scores:
- **UI and typography were docked mostly for phone frames.** The brief says to score the high tier on desktop and to
  use phone frames for mobile and readability.
- **Every `ab/crop-*` pair is a Low-tier capture,** which both critics' character A/B notes miss.

## Category by category

### Characters: critics 7.0 / 7.0, mean 7.0. Proposed 7.0
- **Concede: the tub rim is faceted at 2×.** `crops/high/R02-preview-captain` shows straight rim segments.
- **Concede: the water is a flat pale quad.** (125,187,191) is confirmed in that crop.
- **Rebut, Critic A is plainly wrong that "the hands are plain blocks".** `crops/high/R02-preview-captain` shows
  rounded, bevelled mitten fists with a separate thumb lobe, at about (400–560, 250–340) and (680–760, 260–330).
- **Rebut, "hats carry no studs" is partly wrong.**
  - The orange caps in `crops/high/R03-kart_1` carry a round top stud, at about (325,185) and (612,110).
  - The towel turbans in `crops/high/R03-kart_5` carry a round white top cap, at about (660,80) and (945,150).
  - Only the fire helmets have a raised crown block instead.
- **Rebut Codex's "simple chassis".** The chassis is a studded plate with bevel-lit studs (`crops/high/R03-kart_1`,
  about (480–600, 495–550)), plus hubbed, bolted wheels and claw feet (`crops/high/R03-kart_5`) or a skirt.
- **Rebut Codex's "dense similar silhouettes" at chase distance.** A 3× crop of the `high/desktop/R04` pack (480–720,
  280–470) separates at least six teams by hat silhouette: cowboy hats, towel turbans, flamingo heads, police caps,
  tie-dye antennae and fire helmets.
- **Verdict.** All of anchor 7 is visible, and part of the anchor-9 list too (eight expressions, every team a character,
  printed front and back). The 2× tub facets and static water are exactly the "holds up at 2×" failure, so I hold 7.0
  rather than push higher.

### Materials: critics 6.0 / 6.0, mean 6.0. Proposed 6.5
- **Concede: the asphalt has no grain or tile.** Patch σ is ≤0.5 at `high/desktop/R04` (820–1000, 600–700) and 0.0 at
  `R07` (700–1000, 640–740).
- **Rebut, Critic A is plainly wrong that the asphalt has "no seam, specular or tile".** It has a broad
  view-dependent gloss lobe:
  - `high/desktop/R04` brightens from (86,93,98) at (900,650) to (143,146,146) at (260,790).
  - `high/desktop/R13` rises from (95,101,105) at (1100,450) to (151,153,152) at (800,760).
  - This meets the second half of Critic A's own G-flat-asphalt test ("a visible sun highlight on the road in day
    frames").
- **Partial rebut: the bricks aren't flat paint.**
  - A vertical profile through `high/desktop/R03` at x=1240 shows a lit lip and top edge on every course: the face reads
    93, the edges 99–102 and the mortar 83–85.
  - That is baked, not dynamic, but each brick does show a lit top edge, which is Critic A's own test.
- **Concede: the foliage is matte Lambert slabs** (`high/desktop/R10` crop 900–1280, 60–320).
- **Concede: the ford is opaque** (`high/desktop/R19`).
- **Rebut Codex's "masonry-like" Goat Rock as a materials fault.** Brick-coursed wedges are how a brick-built rock
  reads (`high/desktop/R09`), and the benchmark `drive-5` shows brick-built rock formations.
- **What anchor 7 (`worlds-1`) asks, and what is there:**
  - Consistent brick palette: yes.
  - Shaded studs near the camera: yes (`high/desktop/R08` bottom left).
  - Seams on tile roads and paving: yes (`R10`, `R17`).
  - Bevel highlights on figures and tubs: yes.
  - Bevel highlights on foliage and walls: no.
  - Clear parts: only the bubble pickups.

  That is 6.5, not 6.

### Scenery: critics 6.0 / 6.0, mean 6.0. Proposed 6.5
- **Concede: the R06 world-edge band.** `high/desktop/R06` reads (179,204,210) at (250,430).
- **Concede: R09 is a field of near-identical pines.**
- **Rebut "R05, R06 and R09 are mostly bare baseplate".** A sunlit-lawn mask (G>115, G−R>50, G−B>40) gives these
  fractions:

  | Frame | Sunlit lawn |
  |---|---|
  | `high/desktop/R05` | 11.5% |
  | `high/desktop/R06` | 7.9% |
  | `high/desktop/R09` | 20.8% |

  R05 is full of sidewalk, crowd, lamps, rails and trees. Only R09 reaches Critic A's own 20% threshold.
- **Partial rebut: "the same brick-block module repeats on every downtown course".** The form repeats, but the brick
  and awning colours change:

  | Frame | Brick | Awnings |
  |---|---|---|
  | `R04` | red and tan | purple and blue |
  | `R13` | red | orange-white |
  | `R14` | buff | purple |
  | `R16` | red | red-white |
  | `R17` | tan, and red | red, and blue |

- **The anchor-7 list is visible:**
  - studded baseplate (`R08`, `R12`);
  - tile and brick roads (`R10`, `R17`, `R19`);
  - brick buildings with modelled frames, string courses and quoins (`R13`);
  - stacked-plate pines and blocky oaks in two greens (`R08`, `R12`);
  - recognisable landmarks (`R05`, `R06`, `R14`);
  - set pieces that differ by course: `R08` switchbacks with a retaining wall, `R11` ridge tower, `R17` radial plaza,
    `R19` ford.
- **Verdict.** What holds it under 7 is density, the R06 seam and R09. 6.5.

### Lighting: critics 6.0 / 6.0, mean 6.0. Proposed 6.5
- **Concede: no AO under cornices.** `high/desktop/R13` at x=700 is flat at 55–66 from y=84 to 136, directly under the
  cornice.
- **Concede: the dusk lamp pools clip and stop short of the near lane.** `high/desktop/R07` reads (255,182,128) at
  (950,460), and the near road is a uniform (55,41,43).
- **Rebut, Critic A is plainly wrong that "there is no green bounce from the baseplate".** `high/desktop/R09` shows a
  hemisphere fill with a green ground term:
  - Lit white rock reads (223,230,228) at (540,430).
  - Shaded, ground-facing faces read (99,120,112) at (520,470) and (102,124,117) at (690,600). Green exceeds red by
    about 21, a teal-green cast.
  - Sky-facing shade reads (121,144,156) at (800,580), bluer.
- **Rebut "no crevice AO" as an absolute.** Landmark walls darken where they meet the ground: `high/desktop/R05` at
  x=1020 falls from 103 at y=640 to 75 at y=680 (−27%).
- **Anchor-7 elements present:**
  - Contact shadows ground every tub, including the new pusher shadows (`R03`, `R12`).
  - Haze matches the sky (`R04`, `R10`).
  - Dusk (`R07`) and sunset (`R11`) each have a deliberate palette.
- **Verdict.** Missing: crevice AO on buildings, and lamp tone-mapping. 6.5.

### Animation: critics 6.5 / 6.0, mean 6.25. Proposed 6.5
- **Concede: no camera kick or FOV punch in any strip.**
- **Concede: no visible tilt of the water surface.**
- **Rebut, Critic A is plainly wrong that "from frame 3 on, the beads sit as detached clusters … far from the
  wheels".**
  - A 2× crop of every `strips/high/R14` frame (120–360, 110–300 per tile) shows beads leaving the tub's rear wheels in
    frames 2–8.
  - The bottom-of-frame clusters are the older trail, which the change log describes ("trails behind the tub").
  - In frames 7–8 beads also sit at rim height over the tub, while the HUD gauge drops 41→41→41→41→41→40→39→39 GAL. The
    slide visibly spills water; it just doesn't tilt the surface.
- **Rebut Codex's "slide feedback consists largely of separated clusters".** It overstates the gap for the same reason.
- **Fumble and judge stop read well.**
  - `strips/high/R15` shows the crew running a full circuit with rigid swinging limbs, and a bead splash that bursts in
    frames 2–7 and clears by frame 8.
  - `crops/high/R15-player` shows the captain's "hold on" pose with both arms raised.
  - The slide-charge tiers also read: "WARM STEAM" in `high/desktop/R19`, "HOT STEAM!" in `high/desktop/R17`.
- **Verdict.** Toy articulation and particles: yes. Camera kick and slosh: no. 6.5.

### UI / HUD: critics 6.5 / 6.5, mean 6.5. Proposed 7.0
- **Concede on phones.** In `high/landscape/R02` the pinned buttons cut into the "Captain:" line, and the Top
  speed/Push bars sit under them. In `high/mobile/R02` the heading overlaps the stud row.
- **Rebut the scope.** The brief says "score the high tier on desktop; use the phone frames for mobile and readability".
  Both critics' overlap deductions come from phone frames, and they belong in `mobile`.
- **On desktop, anchor 7 is met:**
  - `high/desktop/R02` shows the full description and all four stat rows (Top speed, Handling, Push, Water), with
    Choose and Back clear of any text.
  - `high/desktop/R01` has a consistent stud-topped 1×4 brick menu with a red Grand Prix brick.
  - `high/desktop/R18` is a stud-row plate with an aligned table and a highlighted player row.
  - `high/desktop/R04` has a clear HUD hierarchy: lap and time, place, item bubble, ticket tile, tub-shaped water gauge
    with a 10-gal line, item checklist and map. Nothing overlaps.
- **What stays below 9:** the HUD is static, and the pixel readouts sit on the scene rather than on tiles.

### Typography: critics 6.5 / 6.5, mean 6.5. Proposed 7.0
- **Same scope point.** The clipped text (`high/landscape/R02`), the dense cards (`high/mobile/R02`) and the small
  labels (`high/mobile/R04`) are all phone evidence.
- **On desktop, the anchor-7 tests pass:**
  - A clear display/UI scale (`high/desktop/R01`, `R18`).
  - Numerals read at a glance (`R18` times, gallons and points; the HUD timer).
  - Nothing is clipped (`high/desktop/R02`, `R18`).
- **"The 8-bit face fights the toy look" is a style preference.** It isn't an anchor-7 criterion.
- **The 1.6:1 white-fill figure ignores the 10.4:1 outline that carries the glyph** (Critic A's own measurement).
- **Measurement correction on phone labels.** In `high/mobile/R04` the cap height of "Bath" and "Loofah" is 15 px at 2×
  (7.5 CSS px), and the x-height is 11 px (5.5 CSS px). That implies a font size of about 10.5–11 CSS px. Critic A's
  "8–9 CSS px" measures glyph height, not size. They are small but legible.

### Readability: critics 6.5 / 6.5, mean 6.5. Proposed 6.5
- **Concede: `high/desktop/R19` fails "every tub in every frame".** A translucent foreground slab and a ghosted rival
  cover the lower right and lower left, and the ring shows only its right arc.
- **Partial rebut on R11.** The ghost tree in `R11` sits wholly right of the white edge line: x=740, y=560 reads
  (222,225,231). The road, pack and pickups stay unobstructed.
- **Rebut the R04 and R16 foliage evidence.** Their faded trees cover about 6–7% of the frame (R04 x 0–193, y 67–413;
  R16 x 0–206, y 85–410), over the sidewalk and building side and away from the road.
- **Rebut "the pack in R07 merges into one colour mass".** A 2× crop of `high/desktop/R07` (500–800, 300–620) separates
  four teams by palette and hat: purple-black top hats (player), pink flamingos, tie-dye antennae and green camo.
- **Rebut, plainly wrong that "the judge stop reads only through the HUD sign".**
  - A full-width studded white stop line crosses the road in `high/desktop/R16` (y≈585–615) and in frames 1–3 of
    `strips/high/R16`.
  - A transverse white line marks the box ahead (y≈400).
- **Verdict.** R19 is a real failure, so 6.5 stands.

### Mobile: critics 7.0 / 6.0, mean 6.5. Proposed 7.0
- **Anchor 7 is met in every race frame.**
  - Portrait `high/mobile/R07`: the tub ring ends at y≈1120 of 1688, the steer pill starts at y≈1450 and the action
    buttons at y≈1425.
  - Landscape `high/landscape/R04`: the tub sits at x 745–945, y 390–610, the steer pill at x 285–560, y 645–745, and the
    action cluster at x 1390–1665, y 540–760.
  - Both orientations are framed on purpose. The landscape title grid (`high/landscape/R01`) and portrait HUD stack are
    deliberate.
  - The phone proxy holds 30 fps: the swiftshader floor is 63 fps (brief).
- **Rebut Codex's "screenshots cannot verify frame rate".** It ignores the measured table in the brief.
- **Concede: the landscape team-select overlap and the faded Handling row are real.**
  - Choose and Back are both visible in both orientations (`high/mobile/R02`, `high/landscape/R02`).
  - The overlap is a menu-polish flaw, not a failure of the anchor-7 criteria.

### Authenticity: critics 6.5 / 7.0, mean 6.75. Proposed 7.0
- **Concede: Goat Rock stands on level ground** (`high/desktop/R09`).
- **Concede: the ford reads as a tiled pool** (`high/desktop/R19`).
- **Rebut the cause of "the Arlington is olive-grey rather than buff".**
  - The same building reads buff in `crops/high/R03-kart_1`: (165,159,131), hue 49°.
  - In `high/desktop/R06`, the camera faces its shaded side under the green ground fill described under Lighting:
    (90,100,79), hue 89°.
  - It is a lighting effect, not a wrong material.
- **Partial rebut of the judge-booth complaint.** A 3× crop of `high/desktop/R16` (200–560, 290–500) shows a judge in
  black-and-white referee stripes holding a brown-framed tile at chest height, read as a clipboard, apart from the
  crowd. The booth itself is a plain white box with a red slab roof; I concede that.
- **Anchor 7 is visible:**
  - The Row with red roofs and the dome (`R14`, `R03`).
  - The Arlington's towers (`R06`).
  - The water line, item checklist, duck and flag (`R04`).
  - Judges and the stop (`R16`).
  - The race's own framing on the title screen (`R01` footer).
  - Hazed blue ridges for the Ouachitas (`R10`, `R09` horizon).

## Facts a critic got plainly wrong
1. Critic A: the asphalt has "no seam, specular or tile". A gloss lobe is visible in `high/desktop/R04` and `R13`; see
   Materials for the values.
2. Critic A: "there is no green bounce from the baseplate". `high/desktop/R09` shaded rock reads (99,120,112), against
   (121,144,156) on sky-facing faces.
3. Critic A: "the hands are plain blocks". They are thumbed mitten fists (`crops/high/R02-preview-captain`).
4. Critic A: "hats carry no studs". The orange caps and turbans carry top studs (`crops/high/R03-kart_1`, `R03-kart_5`).
5. Critic A: "the judge stop reads only through the HUD sign". A studded stop line crosses the road (`high/desktop/R16`,
   `strips/high/R16` frames 1–3).
6. Critic A: R14 beads "from frame 3 on … far from the wheels". Beads sit at the rear wheels in frames 2–8
   (`strips/high/R14`).
7. Critic A: R05 and R06 "mostly bare baseplate". The sunlit lawn is 11.5% and 7.9%.
8. Critic A's A/B characters note: "A has plain boxes … B adds printed faces". In `ab/crop-R02-preview` and
   `ab/crop-R02-preview-captain` it is **A** that has the printed expressive faces.
9. Both critics: the `ab/crop-*` pairs are **Low tier**.
   - B's panels match `crops/low/*` at a mean absolute difference of 0.65–1.01, against 14.4–27.1 for `crops/high/*`.
   - I measured this on `crop-R02-preview`, `-captain`, `R03-player-rear`, `R03-kart_5` and `R15-player`.
   - Codex's characters "A" verdict is therefore a true reading of the Low tier's LOD2 near crews, which do lose face
     detail against last loop.
   - It says nothing about the high tier under review. The high-tier pair `ab/high-desktop-R03` matches this loop's
     `high/desktop/R03` on the B side (MAD 1.59).

## Gaps, adjusted
I add no gaps. Two pairs are the same defect counted twice:
- G-mobile-footer and G-landscape-teamselect;
- G-near-camera-foliage and G-foreground-fading.

The judge shouldn't sum their gains.

| Gap | Critic | Severity | Gain | Reason |
|---|---|---|---|---|
| G-near-camera-foliage | A | 4 → 4 | 0.5 → 0.5 | R19 is real. Drop R04 and R16 as evidence (about 6–7%, off-road). The R11 ghost is off-road. |
| G-flat-asphalt | A | 3 → 2 | 0.5 → 0.3 | The gloss lobe already exists, so half the test is met. Only grain or tile is missing. |
| G-painted-brick-walls | A | 3 → 2 | 0.5 → 0.3 | The texture already has a lit top edge per course. The residual is dynamic response and depth. |
| G-day-ao-bounce | A | 3 → 3 | 0.5 → 0.5 | The cause is half wrong: bounce exists and landmark walls have ground AO. Cornice and reveal AO and the lamp clipping remain. |
| G-water-slosh | A | 3 → 3 | 0.5 → 0.5 | There is no tilt. A spill read already exists (R14 frames 7–8 beads at the rim, 41→39 GAL). |
| G-empty-landmark-lawns | A | 3 → 2 | 0.5 → 0.3 | Only R09 exceeds 20%. The R06 seam is real. |
| G-slide-spray | A | 2 → 2 | 0.3 → 0.2 | Emission is at the wheels. The camera kick is the real gap. |
| G-ford-water | A | 2 → 2 | 0.3 → 0.3 | Conceded. |
| G-hud-typeface | A | 2 → 1 | 0.5 → 0.2 | The face is a style preference. The outline gives 10.4:1. Labels are about 10.5–11 px. |
| G-landscape-teamselect | A | 2 → 2 | 0.3 → 0.3 | Conceded. Same defect as G-mobile-footer. |
| G-judge-booth | A | 2 → 1 | 0.3 → 0.2 | Referee-striped judge with a clipboard and a studded stop line exist. Only the booth box is plain. |
| G-tub-faceting | A | 2 → 2 | 0.3 → 0.3 | Conceded. |
| G-mobile-footer | Codex | 4 → 3 | 1.0 → 0.5 | A menu-only flaw. Race framing meets anchor 7, and both buttons are visible. |
| G-plastic-response | Codex | 4 → 3 | 1.0 → 0.5 | The asphalt gloss, stud bevels and brick edges are present. Foliage and the ford are the residual. |
| G-tree-repetition | Codex | 4 → 3 | 1.0 → 0.5 | R08, R10 and R12 mix two species in two greens. R09 is the repetitive frame. |
| G-light-shaping | Codex | 3 → 3 | 1.0 → 0.5 | Sky and ground fill and contact shadows already exist. Local occlusion is the residual. |
| G-action-feedback | Codex | 3 → 3 | 1.0 → 0.5 | Beads emit at the wheels, the fumble has distinct poses, and the charge tiers read. Camera kick and slosh are the residual. |
| G-landmark-context | Codex | 3 → 2 | 0.5 → 0.3 | Grey stepping stones are already on the R19 bank (x≈835–1010, y≈365–420). Goat Rock on flat ground is real. |
| G-foreground-fading | Codex | 3 → 3 | 0.5 → 0.3 | In `strips/high/R16` the player stays readable in all 8 frames. R19 is shared with G-near-camera-foliage. |

## IP check
Clean. I agree with both critics: rounded box heads, straight torsos, thumbed mitten fists, and no LEGO name or logo in
any capture.

```json
{
  "loop": 3,
  "role": "advocate",
  "tier": "high",
  "scores": {
    "characters": {
      "score": 7.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "crops/high/R02-preview-captain", "note": "Concede faceted rim and flat pale water quad. Hands are bevelled mitten fists with a separate thumb lobe, not plain blocks."},
        {"shot": "crops/high/R03-kart_1", "note": "Orange caps carry a round top stud; studded chassis plate with bevel-lit studs (480-600,495-550), hubbed bolted wheels."},
        {"shot": "crops/high/R03-kart_5", "note": "Towel turbans with round top cap; claw feet; expressive printed faces."},
        {"shot": "high/desktop/R04", "note": "3x crop of the pack separates at least six teams by hat silhouette at chase distance."}
      ]
    },
    "materials": {
      "score": 6.5,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Asphalt has no grain (patch sigma <=0.5) but a gloss lobe: (86,93,98) at (900,650) rising to (143,146,146) at (260,790)."},
        {"shot": "high/desktop/R13", "note": "Road lobe (95,101,105) to (151,153,152) at (800,760)."},
        {"shot": "high/desktop/R03", "note": "Brick texture carries a lit top edge per course: face 93, edges 99-102, mortar 83-85 at x=1240."},
        {"shot": "high/desktop/R08", "note": "Shaded baseplate studs near camera."},
        {"shot": "high/desktop/R19", "note": "Concede: ford is opaque blue tiles."},
        {"shot": "high/desktop/R10", "note": "Concede: matte foliage slabs; tile road seams read."}
      ]
    },
    "scenery": {
      "score": 6.5,
      "confidence": 0.5,
      "evidence": [
        {"shot": "high/desktop/R05", "note": "Sunlit lawn only 11.5% of frame; sidewalk, crowd, lamps, rails, trees fill the foreground."},
        {"shot": "high/desktop/R06", "note": "Lawn 7.9%; concede pale world-edge band (179,204,210) at (250,430)."},
        {"shot": "high/desktop/R09", "note": "Concede: pine field, lawn 20.8%."},
        {"shot": "high/desktop/R13", "note": "Brick blocks with modelled frames, string courses, quoins; brick and awning colours vary across R04/R13/R14/R16/R17."},
        {"shot": "high/desktop/R17", "note": "Radial brick plaza set piece."}
      ]
    },
    "lighting": {
      "score": 6.5,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R09", "note": "Green ground bounce: shaded rock (99,120,112) vs sky-facing (121,144,156) vs lit (223,230,228)."},
        {"shot": "high/desktop/R05", "note": "Landmark wall ground AO: 103 at y=640 to 75 at y=680 (x=1020)."},
        {"shot": "high/desktop/R13", "note": "Concede: no AO under the cornice (flat 55-66 from y=84 to 136 at x=700)."},
        {"shot": "high/desktop/R07", "note": "Deliberate dusk palette; concede lamp pool clips (255,182,128) and near road flat (55,41,43)."},
        {"shot": "high/desktop/R03", "note": "Sun and pusher contact shadows ground every tub."}
      ]
    },
    "animation": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "strips/high/R14", "note": "Beads emit at the rear wheels in frames 2-8; bottom clusters are the trail; frames 7-8 beads at rim height while gauge drops 41 to 39 GAL. No camera kick, no visible water tilt."},
        {"shot": "strips/high/R15", "note": "Crew runs a full circuit with rigid swinging limbs; splash bursts frames 2-7, clears by 8."},
        {"shot": "crops/high/R15-player", "note": "Captain's arms-raised hold-on pose during the fumble."},
        {"shot": "high/desktop/R17", "note": "HOT STEAM! callout; WARM STEAM in R19: slide-charge tiers read."}
      ]
    },
    "ui": {
      "score": 7.0,
      "confidence": 0.5,
      "evidence": [
        {"shot": "high/desktop/R02", "note": "Desktop team select: full description, all four stat rows, Choose/Back clear of text."},
        {"shot": "high/desktop/R01", "note": "Consistent stud-topped brick menu, red Grand Prix brick."},
        {"shot": "high/desktop/R18", "note": "Stud-row plate, aligned table, highlighted player row."},
        {"shot": "high/desktop/R04", "note": "Clear HUD hierarchy, nothing overlapping. Phone overlaps (landscape/mobile R02) belong to mobile per the brief."}
      ]
    },
    "typography": {
      "score": 7.0,
      "confidence": 0.5,
      "evidence": [
        {"shot": "high/desktop/R18", "note": "Clear display/UI scale; numerals read at a glance."},
        {"shot": "high/desktop/R02", "note": "Nothing clipped on desktop."},
        {"shot": "high/desktop/R01", "note": "Pixel display face over bold sans: a clear scale; the face is a style choice, not an anchor-7 failure."},
        {"shot": "high/mobile/R04", "note": "Phone labels: cap height 15 px at 2x (7.5 CSS px), font about 10.5-11 CSS px; small but legible."}
      ]
    },
    "readability": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R19", "note": "Concede: translucent foreground slab and ghosted rival; ring mostly hidden."},
        {"shot": "high/desktop/R11", "note": "Ghost tree sits right of the white edge line (222,225,231 at x=740,y=560); road and pack unobstructed."},
        {"shot": "high/desktop/R07", "note": "2x crop separates four teams in the pack by palette and hat."},
        {"shot": "high/desktop/R16", "note": "Full-width studded stop line (y 585-615) marks the judge stop beyond the HUD sign."},
        {"shot": "high/mobile/R04", "note": "Team-colour ring makes the player obvious on the phone."}
      ]
    },
    "mobile": {
      "score": 7.0,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/mobile/R07", "note": "Tub ring ends y~1120/1688; controls start y~1425-1450: never cover the tub."},
        {"shot": "high/landscape/R04", "note": "Tub x745-945,y390-610; steer pill and action cluster in the corners, clear."},
        {"shot": "high/landscape/R01", "note": "Purposeful landscape title grid."},
        {"shot": "high/landscape/R02", "note": "Concede: pinned buttons overlap the Captain line, stats under the bar. Choose and Back visible in both orientations."}
      ]
    },
    "authenticity": {
      "score": 7.0,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R06", "note": "Arlington's twin towers; olive cast is shade lighting (90,100,79)."},
        {"shot": "crops/high/R03-kart_1", "note": "Same Arlington reads buff (165,159,131) in sun."},
        {"shot": "high/desktop/R16", "note": "Judge in referee stripes with a clipboard tile; studded stop line; booth box plain (conceded)."},
        {"shot": "high/desktop/R04", "note": "Water gauge with 10-gal line, towel/bath/soap/loofah checklist, duck and flag on every tub."},
        {"shot": "high/desktop/R14", "note": "The Row with red roofs and the dome."},
        {"shot": "high/desktop/R19", "note": "Concede: ford reads as a tiled pool; stepping stones on the bank."}
      ]
    }
  },
  "ip": {"clean": true, "notes": "Agree with both critics: rounded box heads, straight torsos, thumbed mitten fists; no LEGO name or logo."},
  "gaps": [
    {"id": "G-near-camera-foliage", "category": "readability", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R19", "high/desktop/R11"], "benchmark": "drive-3", "fix": "Hide (opacity 0) any tree whose bounds enter the camera-to-player corridor or come within ~6 m of the camera, or keep placement out of that corridor. Test: no race frame has more than 10% of pixels covered by foliage with alpha below 1.", "note": "R04 and R16 dropped as evidence (about 6-7% of frame, off-road). Overlaps G-foreground-fading; don't sum."},
    {"id": "G-flat-asphalt", "category": "materials", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R04", "high/desktop/R07"], "benchmark": "worlds-1", "fix": "Add low-contrast large-plate tiling or subtle grain to asphalt. Test: sigma at least 3 over the R04 (820-1000,600-700) patch.", "note": "The gloss lobe already exists (R04, R13), so the specular half of the original test is met."},
    {"id": "G-painted-brick-walls", "category": "materials", "expectedGain": 0.3, "severity": 2, "effort": "L", "workstream": "WS1", "evidence": ["high/desktop/R13", "high/desktop/R05"], "benchmark": "worlds-1", "fix": "Add a per-brick bevel normal map and mortar AO so brick edges respond to the key light; instanced courses on the nearest High facades.", "note": "Texture already carries a baked lit top edge per course (R03 x=1240: 93 face, 99-102 edge, 83-85 mortar)."},
    {"id": "G-day-ao-bounce", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R13", "high/desktop/R07"], "benchmark": "worlds-4", "fix": "Add SSAO or baked AO to cornices, window reveals, building corners and eaves; tone-map the dusk lamp pools. Test: eave and corner pixels at least 15% darker than open wall in R13; no lamp-pool pixel at 255.", "note": "Cause half wrong: green ground bounce exists (R09) and landmark walls have ground AO (R05)."},
    {"id": "G-water-slosh", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["crops/high/R02-preview-captain", "strips/high/R14", "strips/high/R15"], "benchmark": "drive-3", "fix": "Tilt the bath-water plane with lateral acceleration. Test: the water angle visibly changes across the R14 frames.", "note": "A spill read already exists: R14 frames 7-8 beads at rim height while the gauge drops 41 to 39 GAL."},
    {"id": "G-empty-landmark-lawns", "category": "scenery", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R06"], "benchmark": "drive-1", "fix": "Dress landmark grounds (hedges, paths, benches, fountains) and extend terrain to the backdrop. Test: no empty baseplate area over 20% of a landmark frame and no ground-to-sky seam in R06.", "note": "Sunlit lawn is 11.5% (R05) and 7.9% (R06); only R09 (20.8%) exceeds the test. R06 seam is real."},
    {"id": "G-slide-spray", "category": "animation", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R14"], "benchmark": "drive-3", "fix": "Shorten bead life and add size falloff so the trail stays near the tub; add a small FOV kick and speed lines when hot steam fires.", "note": "Beads already emit at the rear wheels in frames 2-8; the missing camera kick is the real gap."},
    {"id": "G-ford-water", "category": "authenticity", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R19"], "benchmark": "bj-2", "fix": "Make ford tiles translucent trans-clear blue over a visible creek bed with glints and a crossing splash. Test: bed or stones visible through the water in R19.", "note": "Conceded."},
    {"id": "G-hud-typeface", "category": "typography", "expectedGain": 0.2, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R03", "high/mobile/R04"], "benchmark": "drive-3", "fix": "Optionally set LAP, time and place readouts on bevelled tiles; raise phone item labels to 12 CSS px.", "note": "Pixel face is a style preference, not an anchor-7 failure; the outline gives 10.4:1; labels are already about 10.5-11 CSS px."},
    {"id": "G-landscape-teamselect", "category": "mobile", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R02", "high/mobile/R02"], "benchmark": "drive-2", "fix": "End the scroll area above the pinned button plate with a solid background and fade; in landscape put description and stats beside the turntable. Test: no text intersects the button bar.", "note": "Conceded. Same defect as G-mobile-footer; don't sum."},
    {"id": "G-judge-booth", "category": "authenticity", "expectedGain": 0.2, "severity": 1, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R16"], "benchmark": "worlds-1", "fix": "Build the booth from brick parts with a printed JUDGES sign and striped canopy.", "note": "A referee-striped judge with a clipboard tile and a studded stop line already exist; only the booth box is plain."},
    {"id": "G-tub-faceting", "category": "characters", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R02-preview-captain", "crops/high/R03-kart_1"], "benchmark": "drive-4", "fix": "Raise LOD1 tub radial segments to 16-24 with smooth normals and a rolled-rim bevel. Test: no straight rim facet longer than 20 px in crops/high/R02-preview-captain.", "note": "Conceded."},
    {"id": "G-mobile-footer", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["high/mobile/R02", "high/landscape/R02"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Reserve a separate footer row and bounded scrolling content area so every stat and the full description are reachable above the footer at both phone sizes.", "note": "Menu-only flaw: race framing meets anchor 7 in both orientations and Choose/Back are visible. Duplicate of G-landscape-teamselect."},
    {"id": "G-plastic-response", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS1", "evidence": ["high/desktop/R10", "high/desktop/R19"], "benchmark": "worlds/worlds-1.jpg; builders-journey/bj-3.jpg", "fix": "Add bevel-catching highlights to foliage and near architectural parts; make ford tiles visibly transparent over a readable bed.", "note": "Asphalt gloss, stud bevels and brick top edges already exist; crops/high/R02-preview shows the figures, which both critics call convincing ABS."},
    {"id": "G-tree-repetition", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS5", "evidence": ["high/desktop/R09"], "benchmark": "worlds/worlds-1.jpg", "fix": "Add more toy-tree silhouettes with varied height and spacing, plus shrubs and ground props, so mountain views lose repeated rows of identical crowns.", "note": "R08, R10 and R12 already mix pines and oaks in two greens; R09 is the repetitive frame."},
    {"id": "G-light-shaping", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R13", "high/desktop/R07"], "benchmark": "worlds/worlds-1.jpg; worlds/worlds-4.jpg", "fix": "Add local occlusion at assembled parts (cornices, reveals, corners) and preserve foliage layering in day and dusk captures.", "note": "Sky and ground fill (R09) and contact shadows (R03, R12) already exist."},
    {"id": "G-action-feedback", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Add a camera kick on slide release and hits, and visible water slosh; demonstrate in new eight-frame strips.", "note": "Beads emit at the wheels in R14 frames 2-8; the fumble has distinct poses (crops/high/R15-player); charge tiers read (R17, R19)."},
    {"id": "G-landmark-context", "category": "authenticity", "expectedGain": 0.3, "severity": 2, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R19"], "benchmark": "2k-drive/drive-5.jpg", "fix": "Set Goat Rock on a layered ridge edge; cut the ford into a visible creek channel with banks.", "note": "Grey stepping stones already sit on the R19 bank (x~835-1010, y~365-420)."},
    {"id": "G-foreground-fading", "category": "readability", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R19", "strips/high/R16"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Reduce faded tree and rival overlap with the immediate player view; keep the player silhouette and ford entrance readable through each fade.", "note": "In strips/high/R16 the player tub, crew and ring stay readable in all 8 frames; R19 is shared with G-near-camera-foliage; don't sum."}
  ]
}
```
