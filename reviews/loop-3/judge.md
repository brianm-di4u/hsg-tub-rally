# Judge ruling: loop 3 (high tier)

Capture paths are relative to `games/Cart Racing/screenshots/review-loop-3/`. Pixel coordinates are in each file's own pixels. I opened every capture cited here. Numbers come from short PIL crops and patch statistics in my own temp folder. I did not read the game source, `ab-key.json` or any file outside the brief's inputs, and I edited nothing in the game folder.

## Verdict
**Continue. 63.5/100**, before the tally's A/B rule.
- Characters (7.0) and authenticity (6.5) meet their gates. The other eight categories don't.
- Measured gates: perf passes (52 checked, none failed), fidelity was not measured, and IP passes; my own IP check is also clean.

The High-tier crews are now real toys, and both critics were right to put them at the gate. The points are in the world around them:
- environment surfaces that read as flat paint;
- ghosted near-camera trees and rivals;
- a dusk frame with a dead-flat road and an unshaded emissive stripe;
- a player ring that sinks into cambered roads;
- a phone team-select screen that overlaps itself.

Most of the prosecutor's new findings held up when I measured them. So did several of the advocate's corrections to Critic A. They largely cancel. My total ends 0.5 under the critic mean:
- Animation drops 0.25 for the lamp-post clip that gets no reaction.
- Authenticity drops 0.25 for the missing mountain behind the Row and the sea-like vista.

The critic mean is 64.0, not the 64.5 the prosecutor and advocate quote. Critic B's JSON scores sum to 63.5, though its prose says 64.5.

| Category | Critic A | Critic B | Prosecutor | Advocate | **Judge** | Gate |
|---|---|---|---|---|---|---|
| Characters | 7.0 | 7.0 | 6.5 | 7.0 | **7.0** | ≥7 met |
| Materials | 6.0 | 6.0 | 5.5 | 6.5 | **6.0** | ≥7 |
| Scenery | 6.0 | 6.0 | 5.5 | 6.5 | **6.0** | ≥7 |
| Lighting | 6.0 | 6.0 | 5.5 | 6.5 | **6.0** | ≥7 |
| Animation | 6.5 | 6.0 | 5.5 | 6.5 | **6.0** | ≥7 |
| UI / HUD | 6.5 | 6.5 | 6.0 | 7.0 | **6.5** | ≥7 |
| Typography | 6.5 | 6.5 | 6.0 | 7.0 | **6.5** | ≥7 |
| Readability | 6.5 | 6.5 | 6.0 | 6.5 | **6.5** | ≥7 |
| Mobile | 7.0 | 6.0 | 6.0 | 7.0 | **6.5** | ≥7 |
| Authenticity | 6.5 | 7.0 | 6.0 | 7.0 | **6.5** | ≥6 met |
| **Total** | 64.5 | 63.5 | 58.5 | 67.5 | **63.5** | |

No pair of reviewers is more than 1.0 apart in any category. The widest gap is exactly 1.0: mobile between the critics, and eight categories between the prosecutor and advocate. I still checked every disputed claim, and each ruling says who was right.

## Rulings by category

### Characters: 7.0 (gate met)
**Anchor 7 holds on High.**
- Printed faces with expressions: a shocked captain and a grinning pusher (`crops/high/R02-preview`).
- Printed uniforms front and back (`crops/high/R02-preview-rear`, `crops/high/R03-player-rear`).
- Moulded studs on the chassis plate with bevel highlights. A 3× zoom of `crops/high/R03-kart_1` (440–720, 470–600) shows them clearly.
- Hubbed, bolted wheels, claw feet or skirts, a duck and a flag.
- Teams separate at chase distance. A 3× zoom of the `high/desktop/R04` pack (480–720, 280–470) separates six teams by hat: cowboy hats, towel turbans, flamingo pink, police caps, tie-dye antennae and fire helmets.

**Disputes**
- **Hands:** the advocate is right and Critic A is wrong. `crops/high/R02-preview-captain` shows mitten fists with a thumb lobe, not plain blocks.
- **Hat studs:** split.
  - The orange caps carry one round crown knob (2× zoom of `crops/high/R03-kart_1`, 260–720, 160–260), and so do the turbans (`crops/high/R03-kart_5`).
  - The fire helmets and top hats carry none.
  - The anchor item is half met.
- **Tub:** Critic A and the prosecutor are right.
  - The rim is an 8-sided polygon at 2×.
  - The bath reads as a grey-teal plane: (101,122,120), σ ≈ 4 over 260–400 × 440–520 in `crops/high/R02-preview-captain`, with only a small pale-blue quad beside the duck.
  - Codex's "simple chassis" is wrong: it is a studded plate.
- **Crowd:** the prosecutor is right that the spectators are blank boxes. A 2× zoom of `crops/high/R03-kart_5` (40–470, 240–390) shows no eyes, mouth or print. They aren't the "figures and tubs" this category scores, so I count them under scenery.
- **Dusk pack:** the prosecutor overstated "teams stop separating". A 2× zoom of `high/desktop/R07` (500–800, 300–620) separates four teams: purple top hats (the player), pink flamingos, tie-dye antennae and green camo.

**Why not higher:** the faceted rim and the weak water fail "holds up at 2×", and half the hats have no stud.

### Materials: 6.0
The figures, tubs and chassis studs are convincing ABS. Away from them, surfaces fall short of the reference town frame I scored 7 in calibration.

**Disputes**
- **Asphalt specular:** the advocate is right and Critic A is wrong.
  - Along y = 700 in `high/desktop/R04`, the road brightens from (86,93,98) at x 900 to (120,125,126) at x 400. That is a broad gloss lobe.
  - The 820–1000 × 600–700 patch still has σ 0.5 and only 6 distinct colours, so the missing grain and seams remain a fair charge.
- **Brick walls:** the advocate is partly right.
  - A 4× zoom of `high/desktop/R03` (1060–1280, 80–260) shows a baked light lip and dark mortar on every course.
  - It is still flat texture that doesn't respond to the light. A 3× zoom of the `high/desktop/R13` cornice reads as paint.
- **Far baseplate and roofs:** the prosecutor is right.
  - The `high/desktop/R05` lawn at 1150–1270 × 620–700 is a single (81,165,89), σ 0.5/0.4/0.8, with no stud pattern.
  - The lower Arlington roof in `high/desktop/R06` (460–560 × 560–600) is a (73,83,82) slab, σ ≈ 3.
- **Ford:** everyone agrees it is opaque blue tiles (`high/desktop/R19`).
- **Goat Rock:** I side with the advocate that brick-coursed rock is a legitimate brick-built read. This point is minor either way.

**Score:** the advocate's gloss finding and the prosecutor's far-surface findings offset each other, so the critics' 6.0 stands.

### Scenery: 6.0
**Anchor-7 items present**
- Studded baseplate and tile mountain roads (`high/desktop/R10`).
- Brick blocks with modelled frames, string courses and quoins (`high/desktop/R13`).
- The radial plaza (`high/desktop/R17`).
- Recognisable landmarks (`high/desktop/R05`, `R06`, `R14`).

**Against**
- **World edge:** confirmed. `high/desktop/R06` has a pale band, (179,204,210) at (250,430), between the lawn and the hills.
- **Terrain crack:** confirmed.
  - `high/desktop/R09` has 78 sky-coloured pixels, (153,188,222), at x 186–207, y 317–322. An 8× zoom shows a triangular hole in the grass.
  - The same frame is a flat field of near-identical pines.
- **Crowd clash:** blank-faced boxes stand beside toy crews in every street frame (`crops/high/R03-kart_5`, `crops/high/R03-kart_1`). This is a small case of the anchor-3 "world and characters clash".
- **Ghosted near trees:**
  - About 40% of `high/desktop/R11`, on the right.
  - The top-left of `high/desktop/R08`: a zoom shows the canopy translucent, with the trunk visible through it.
  - The prosecutor's `R10` case doesn't hold. The rail passes in front of the trunk there, which is normal occlusion.
- **Empty plaza:** the `R17` plaza is large and bare.

**Where the advocate is right:** R05 isn't "mostly bare lawn", since crowd, lamps, rails and trees fill it. Brick and awning colours also vary across the downtown frames. Neither lifts the score to 6.5.

### Lighting: 6.0
**Present**
- Sun shadows and the new pusher contact shadows ground every tub (`high/desktop/R03`, `R12`).
- Dusk and sunset have deliberate palettes (`high/desktop/R07`, `R11`).

**Disputes**
- **Bounce:** the advocate is right and Critic A is wrong. In `high/desktop/R09`, ground-facing shade on the rock reads (101,122,114), with green ~21 above red. Sky-facing shade reads (121,144,156). That is a hemisphere fill with a green ground term.
- **Ground AO on landmarks:** the advocate is right. In `high/desktop/R05` at x = 1020, the wall falls from ~100 at y 650 to 71 at y 680.
- **Crevice AO:** everyone is right that there is none. The `R13` cornice zoom shows no darkening under the cornice or in the window reveals.
- **R07 stripe:** the prosecutor is right, and I measured it exactly. 2,304 pixels at x 0–479, y 252–281 all read (255,225,79): no shading, fog or falloff. The stripe also appears in `high/landscape/R07`.
- **R07 lamp pools:** the prosecutor is right.
  - The pools sit on the sidewalks, and the near road (700–1000 × 640–740) is one value, (55,41,43).
  - 39,123 of the 56,000 pixels in 600–1000 × 560–700 are that exact colour.
- **Arlington colour:** the advocate has the cause right.
  - It reads buff in sun: (161,157,128), hue 53°, in `crops/high/R03-kart_1`.
  - It reads olive in shade: (93,103,82), hue 89°, in `high/desktop/R06`.
  - The green ground term is too strong. That is a lighting fault, not a material one.

**Score:** I scored the calibration frame 6.5 for lighting. The day frames here come close to it. R07's dead road, clipped pools and unlit stripe, plus the missing crevice AO, keep this a step below.

### Animation and feel: 6.0
**What works**
- In `strips/high/R15` and `strips/high/R16`, the crew circles the tub with rigid limbs swinging at the joints. That is the right toy articulation.
- `crops/high/R15-player` shows the captain's arms-up "hold on" pose.

**Disputes in `strips/high/R14`** (2.4× zooms of frames 2–4 and 6–8)
- **Spray origin:** the advocate is right. Beads leave the rear-left wheel in frames 2–4.
- **Spray read:** the critics are right about how it reads. From frame 3 on, two compact clusters hang in the near road 60–100 px below the tub and stay there, so the spray looks detached.
- **Lamp post:** the prosecutor is right, and no one else saw it. In frames 7–8 the slide carries the tub over the curb, and a lamp post's base sits inside the player's ring with the pole rising between the pushers. There is no splash, stagger or camera kick.
- **Spill:** the advocate is right that beads rise over the rim in frames 7–8 while the gauge drops 41 → 39 GAL. The water surface itself never tilts.

**`strips/high/R15` splash:** the prosecutor overstated it. The bead dome hides the tub body in frames 3–5, but the captain's helmet and torso stay visible.

**Score:** there is no camera kick in any strip, no boost read and no anticipation. The prop clip is a hit that doesn't read. 6.0, under the critic mean of 6.25.

### UI / HUD: 6.5
**Scope**
- I agree with the advocate that the brief puts phone frames under mobile and readability, so I charge phone-only overlaps mainly to mobile.
- They are the same UI code, though, so they carry a little weight here.

**Desktop**
- The HUD hierarchy is clear (`high/desktop/R04`).
- Menus are now consistent bricks (`high/desktop/R01`, `R02`, `R18`).
- `high/desktop/R02` shows the full description, all four stat bars, and Choose and Back clear of text.

**Against on desktop**
- LAP, time and place are 8-bit outlined text floating on the scene next to a bevelled gauge tile, so the HUD is not yet "one style that belongs to the brick world".
- The prosecutor's polish findings are confirmed:
  - The last panel stud is cut by the border (6× zoom of `high/desktop/R02`, 540–670 × 100–160).
  - The Grand Prix focus ring runs under the stud bases (`high/desktop/R01`).

**Against on phones**
- The prosecutor is right that the minimap path touches the foot of "8TH" (3× zooms of `high/landscape/R07` and `high/landscape/R04`, 1440–1688 × 20–260).
- Buttons cover text in `high/landscape/R02`.

### Typography: 6.5
- **Scale:** the pixel display face over a bold rounded sans forms a clear scale (`high/desktop/R01`, `R18`). Numerals read at a glance, with one exception.
- **The exception is the race's key number.** The water-line "10" is:
  - 8 px tall on desktop (4× zoom of `high/desktop/R04`, 0–220 × 650–800);
  - about 11 device px (5.5 CSS px) on the phone, where it also spills past the gauge tile's edge (`high/mobile/R04`).
- **Clipping:** text is clipped behind the buttons in `high/landscape/R02`.
- **Where the advocate is right:**
  - The 8-bit face is a style choice, not an anchor-7 failure.
  - The 1.6:1 fill contrast is carried by the outline.
  - The phone item labels are small but legible.

### Readability: 6.5
**Ring sinking:** the prosecutor is right. Critic A was wrong to cite R08 as a success. My counts of ring-coloured pixels on each side of the tub's centre:

| Frame | Left of centre | Right of centre |
|---|---|---|
| `high/desktop/R03` (flat) | 1,935 | 1,907 |
| `high/desktop/R08` | 1,153 | 163 |
| `high/desktop/R10` | 960 | 0 |

On cambered curves the ring is a left crescent. The floating marker still locates the player, so the read is degraded, not lost.

**Failures**
- `high/desktop/R19` fails outright. A translucent foreground slab, a ghosted rival crew and two bead clusters cover the player and most of the ring.
- In frames 4, 7 and 8 of `strips/high/R16`, a half-faded white rival crew stands directly in front of the player's crew. The player stays locatable, as the advocate says, but the frame is cluttered, as the prosecutor says.

**Where the advocate is right**
- The R11 ghost tree sits right of the road's edge line, off the road.
- The R07 pack separates at 2×.
- A full-width studded white stop line marks the judge stop in `high/desktop/R16` (y ≈ 585–615).

These roughly cancel the new ring finding, so readability stays at 6.5.

### Mobile: 6.5
**Race frames meet anchor 7**
- Controls never cover the tub in portrait (`high/mobile/R04`, `R07`). The tub ends near y 1120 of 1688, and the controls start near y 1425.
- The same holds in landscape (`high/landscape/R04`, `R07`).
- The title layouts are deliberate (`high/landscape/R01`, `high/mobile/R01`).
- The swiftshader low-mobile floor averages 63 fps. Its p95 is 35 ms, so the worst 5% of frames dip under 30 fps. The GPU rows are far above that, and the perf gate passes.

**Team select is not framed on purpose on phones**
- `high/mobile/R02`:
  - the heading sits on the stud row;
  - the panel top (y ≈ 590) cuts off the preview tub's wheels;
  - Handling fades under the button plate, and Water is off-screen.
- `high/landscape/R02`: the buttons cover the "Captain:" line, and the stat rows run off the panel.
- The landscape place readout also touches the minimap, and the water-line label is 5.5 CSS px.

**Ruling:** Critic A's 7 ignores the menus, and Codex's 6 underweights the race framing.

### Authenticity: 6.5 (gate met)
**Present**
- The Row, with red roofs and the dome (`high/desktop/R14`, `R03`).
- The Fordyce's patterned facade (`high/desktop/R05`).
- The Arlington's towers closing the vista (`high/desktop/R06`).
- The race furniture: water gauge with a 10-gal line, towel/bath/soap/loofah checklist, and a duck and flag on every tub (`high/desktop/R04`).
- The judge stop, with its task sign and stop line (`high/desktop/R16`).

**Disputes**
- **Mountain:** the prosecutor is right.
  - A 4× zoom of `high/desktop/R14` (560–860, 240–320) shows Central Avenue ending in a flat blue band that reads as sea.
  - `R03`, `R04` and `R14` show only sky behind the Row, with no Hot Springs Mountain.
  - The mountain frames (`R09`, `R10`) do show hazy blue ridges.
- **Judges:** the advocate is partly right. A 3× zoom of `high/desktop/R16` (120–460, 290–500) shows a referee-striped judge, but mostly hidden behind a blank-faced figure, next to a plain box under a floating red slab roof.

**Against:** Goat Rock stands on flat ground (`high/desktop/R09`), and the ford is a tiled pool (`high/desktop/R19`).

## The A/B pairs: tier check and weight
**The advocate's finding is correct.** I compared every `ab/crop-*` panel with this loop's close-ups at the same size:

| | MAD vs `crops/low/*` | MAD vs `crops/high/*` |
|---|---|---|
| **B** panel, all 10 crop pairs | 0.40–0.71 | 14.3–27.6 |
| **A** panel, all 10 crop pairs | 11.8–51.7 | 19.6–50.9 |

Two conclusions follow:
- **B** is this loop's build at the **Low** tier, and **A** is a different build (presumably the previous one at the same tier).
- The high-tier frame pairs are this loop's High captures on the B side (`ab/high-desktop-R03` B vs `high/desktop/R03`: MAD 1.3).

So no close-up pair shows the High tier, which is the tier being scored.

**What each critic's verdict is worth**
- **Critic B's "A" for characters (0.65)** is a correct reading of the Low tier. In `ab/crop-R02-preview` and `ab/crop-R02-preview-captain`, the old build's crews have printed expressions (a frowning captain, smiling pushers) and a badge print. This loop's Low LOD2 crews have dot eyes only, octagonal wheels and a box duck (`crops/low/R02-preview`). That is a real Low-tier regression, but it says nothing about the High tier.
- **Critic A's "B" for characters (0.9)** rests on a reversed reading of those same pairs ("A has plain boxes … B adds printed faces"). Critic A also identified B as this loop's build before judging, so its verdicts weren't blind.
- **My own reading** of the High chase-distance pairs (`ab/high-desktop-R03`, `ab/high-desktop-R04`): B is modestly better, with shaped fire helmets with brims, reflective trim bands and the ring. Because I also know which side is new, this reading isn't blind either.

**Ruling: the characters A/B verdicts should carry no weight this loop.**
- Treat them as void, not as a split that holds the score.
- If the tally can't void a category, read any hold as a Low-tier finding, not as evidence that the High crews regressed.
- In the other categories, blind Critic B agrees with Critic A (B wins, or a tie for typography), so those outcomes stand at full weight.

**Process fixes for the next loop**
- Capture the `ab/crop-*` pairs at the scored tier, or label each pair's tier.
- Stop critics unblinding the pairs by matching them pixel for pixel against the current captures.

**Low-tier fix:** gap G-low-near-lod-prints below restores printed faces on Low.

## IP check: clean
I checked the silhouette against the three gate features:
- **Heads** are rounded cubes, not cylinders (`crops/high/R03-player-rear`, `crops/high/R02-preview`).
- **Torsos** are straight-sided boxes, not trapezoids (`crops/high/R03-player-rear`).
- **Hands** are mitten fists with a thumb lobe, not C-hands (`crops/high/R02-preview-captain`, `crops/high/R15-player`).

There is no LEGO name or logo on the title, team select, HUD, results or signage (`high/desktop/R01`, `R02`, `R18`). The title footer disclaims any affiliation.

The prosecutor's watch item, a hip block over two rectangular legs, is not a gate feature. Nobody reported a real hit.

## Calibration
**Scores:** materials **7**, lighting **6.5**.

**Disclosure:** `calibration.jpg` is recognisably the `worlds-1` benchmark. The rubric names that frame as the materials-7 anchor, so this check is not fully blind for me.

**Materials, on what's in the frame:**
- glossy cars;
- shaded studs across the near and mid baseplate;
- brick walls with course bevels;
- clear windscreens and transparent fountain water;
- no micro-bevels or wear.

**Lighting, on what's in the frame:**
- a crisp sun with soft ambient light;
- some AO at fence bases and under eaves;
- hazy hills;
- flat shaded walls, no bounce colour, not studio quality.

Both scores sit on the anchors, so there is no drift.

## Ranked gaps (top 12)
**How I ranked them**
- Rank is expected gain ÷ effort (S = 1, M = 2, L = 4), with ties broken by severity.
- Expected gain counts only where it moves a category toward its gate. Characters and authenticity already meet theirs, so their gaps are discounted.
- The one exception is G-low-near-lod-prints: it protects the characters gate under the A/B rule.
- Gains overlap, so don't sum them.

**Merged duplicates**
- G-near-camera-foliage and G-foreground-fading are now G-near-camera-ghosting.
- G-mobile-footer, G-landscape-teamselect and G-phone-preview-framing are now G-phone-teamselect-layout.
- G-water-slosh, G-slide-spray, G-action-feedback and G-prop-collision-feedback are now G-action-feedback.
- G-painted-brick-walls, G-plastic-response and the material half of G-ford-water are now G-env-plastic-response.
- G-flat-asphalt, G-far-baseplate-flat and the flat roofs are now G-ground-surface-detail.
- G-empty-landmark-lawns, G-terrain-crack and the R06 world-edge band are now G-landmark-grounds-and-seams.
- G-hud-typeface, G-water-line-label, G-landscape-place-minimap and G-panel-stud-fit are now G-hud-tiles-and-numerals.

**Corrected causes**
- **Asphalt:** the gloss lobe already exists; only the grain and seams are missing.
- **Lighting:** the bounce already exists and is too green. The missing piece is crevice AO.
- **Slide spray:** it already emits at the wheels. The problems are long-lived trail clusters and no camera kick.
- **HUD typeface:** the 8-bit face is a style choice. The real problems are the 8 px / 5.5 CSS px key numeral and readouts that don't sit on tiles.
- **Arlington colour:** the olive cast is the shade fill, not the material.
- **R16 clutter:** the cause is a ghosted rival, not foliage.

| # | Gap | Category | WS | Sev | Effort | Gain |
|---|---|---|---|---|---|---|
| 1 | G-low-near-lod-prints | characters | WS7 | 3 | S | +0.3 |
| 2 | G-ring-terrain-conform | readability | WS1 | 3 | S | +0.3 |
| 3 | G-dusk-emissive-and-pools | lighting | WS1 | 3 | S | +0.3 |
| 4 | G-hud-tiles-and-numerals | ui | WS6 | 2 | S | +0.3 |
| 5 | G-near-camera-ghosting | readability | WS5 | 4 | M | +0.5 |
| 6 | **G-env-plastic-response (big lever)** | materials | WS1 | 4 | L | +1.0 |
| 7 | G-phone-teamselect-layout | mobile | WS6 | 3 | M | +0.5 |
| 8 | G-action-feedback | animation | WS3 | 3 | M | +0.5 |
| 9 | G-crevice-ao-and-shade-fill | lighting | WS1 | 3 | M | +0.5 |
| 10 | G-ground-surface-detail | materials | WS1 | 3 | M | +0.5 |
| 11 | G-crowd-toy-figures | scenery | WS5 | 3 | M | +0.5 |
| 12 | G-landmark-grounds-and-seams | scenery | WS4 | 3 | M | +0.5 |

**Big lever:** G-env-plastic-response.
- It is the main thing holding materials at 6: only the figures read as ABS, and walls, foliage, rock and water read as painted card.
- Brick walls, foliage, rock and the ford also carry scenery's toy read.

**Next in line, outside the 12:**
- G-row-mountain-backdrop (authenticity, WS4, M): Hot Springs Mountain behind the Row, and ridges in place of R14's sea-like band.
- G-tub-and-hat-detail (characters, WS2, S): 16–24 rim segments and a moulded crown stud on every hat.
- G-judge-booth (authenticity, WS5, S).
- G-tree-variety (scenery, WS5, L): break up R09's pine field.
- G-ford-creek-context (authenticity, WS4, M).

```json
{
  "loop": 3,
  "role": "judge",
  "tier": "high",
  "scores": {
    "characters": {
      "score": 7.0,
      "confidence": 0.75,
      "evidence": [
        {"shot": "crops/high/R02-preview", "note": "Printed expressive faces (shocked captain, grinning pusher), printed coats, shaped fire helmets, duck, flag."},
        {"shot": "crops/high/R02-preview-captain", "note": "Mitten fists with thumb lobe (Critic A wrong on block hands). 8-sided rim at 2x; bath is grey-teal (101,122,120), sigma ~4 over 260-400 x 440-520, with only a small pale-blue quad."},
        {"shot": "crops/high/R03-kart_1", "note": "Studded chassis plate with bevel-lit studs; hubbed bolted wheels; orange caps carry one round crown knob."},
        {"shot": "crops/high/R03-kart_5", "note": "Turbans with round crown cap, claw feet; fire helmets and top hats carry no stud, so 'studs on hats' is half met."},
        {"shot": "high/desktop/R04", "note": "3x zoom of 480-720 x 280-470 separates six teams by hat at chase distance."},
        {"shot": "high/desktop/R07", "note": "2x zoom of 500-800 x 300-620 separates four teams at dusk; prosecutor's 'stop separating' overstated."}
      ]
    },
    "materials": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Road gloss lobe: y=700 brightens from (86,93,98) at x900 to (120,125,126) at x400 (advocate right); patch 820-1000 x 600-700 still sigma 0.5, 6 colours: no grain or seams."},
        {"shot": "high/desktop/R03", "note": "4x zoom 1060-1280 x 80-260: brick is a texture with a baked lip and mortar; bricks don't respond to light."},
        {"shot": "high/desktop/R05", "note": "Lawn 1150-1270 x 620-700 is one (81,165,89), sigma 0.5/0.4/0.8: studs vanish beyond the near field."},
        {"shot": "high/desktop/R06", "note": "Lower Arlington roof 460-560 x 560-600 is a flat (73,83,82) slab, sigma ~3."},
        {"shot": "crops/high/R03-kart_1", "note": "Figures, tub and chassis studs are convincing ABS with bevel highlights."},
        {"shot": "high/desktop/R19", "note": "Ford is opaque blue tiles, not trans-clear."}
      ]
    },
    "scenery": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/desktop/R13", "note": "Brick blocks with modelled frames, string courses, quoins; awnings."},
        {"shot": "high/desktop/R10", "note": "Tile mountain road, stacked-plate pines, studded verge; the rail in front of the near trunk is normal occlusion, not ghosting."},
        {"shot": "high/desktop/R06", "note": "Pale world-edge band (179,204,210) at (250,430) between lawn and hills."},
        {"shot": "high/desktop/R09", "note": "Terrain crack: 78 px of (153,188,222) at x186-207, y317-322; flat field of near-identical pines."},
        {"shot": "crops/high/R03-kart_5", "note": "Spectators are blank-faced unbevelled boxes beside toy crews (2x zoom 40-470 x 240-390)."},
        {"shot": "high/desktop/R08", "note": "Top-left canopy is translucent with the trunk visible through it."},
        {"shot": "high/desktop/R11", "note": "Ghosted tree covers the right ~40% of the frame."}
      ]
    },
    "lighting": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/desktop/R07", "note": "Facade stripe: 2,304 px all exactly (255,225,79) at x0-479, y252-281. Near road 700-1000 x 640-740 is one value (55,41,43); 39,123 of 56,000 px in 600-1000 x 560-700 share it. Pools stay on the sidewalks."},
        {"shot": "high/desktop/R09", "note": "Hemisphere fill exists: ground-facing shade (101,122,114) vs sky-facing (121,144,156); Critic A wrong on 'no bounce'."},
        {"shot": "high/desktop/R13", "note": "3x cornice zoom: no crevice AO under the cornice or in window reveals."},
        {"shot": "high/desktop/R06", "note": "Arlington shade reads olive (93,103,82), hue 89 deg, vs buff (161,157,128), hue 53 deg, in sun in crops/high/R03-kart_1: the ground fill is too green."},
        {"shot": "high/desktop/R03", "note": "Sun and pusher contact shadows ground every tub."},
        {"shot": "high/desktop/R11", "note": "Deliberate sunset palette."}
      ]
    },
    "animation": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "strips/high/R14", "note": "Frames 2-4: beads leave the rear-left wheel (advocate right). From frame 3: two clusters hang 60-100 px below the tub and read detached. Frames 7-8: tub over the curb with a lamp post inside the ring, no reaction. Water never tilts; no camera kick."},
        {"shot": "strips/high/R15", "note": "Crew circles with rigid swinging limbs; bead dome covers the tub body in frames 3-5, captain stays visible."},
        {"shot": "strips/high/R16", "note": "Circling at the judge stop reads."},
        {"shot": "crops/high/R15-player", "note": "Captain's arms-up hold-on pose."}
      ]
    },
    "ui": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Clear hierarchy; LAP/time/place are 8-bit text floating on the scene beside a bevelled gauge tile, so the HUD is not yet one brick style."},
        {"shot": "high/desktop/R02", "note": "Desktop team select clean: full description, four stat bars, Choose/Back clear. Last panel stud cut by the border (6x zoom 540-670 x 100-160)."},
        {"shot": "high/desktop/R01", "note": "Consistent stud-topped brick menu; focus ring runs under the Grand Prix stud bases."},
        {"shot": "high/desktop/R18", "note": "Stud-row plate, aligned table, highlighted player row."},
        {"shot": "high/landscape/R07", "note": "Minimap path touches the foot of '8TH' (3x zoom 1440-1688 x 20-260); weighted lightly here, mainly under mobile."},
        {"shot": "high/landscape/R02", "note": "Buttons cover the 'Captain:' line; charged mainly to mobile."}
      ]
    },
    "typography": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R18", "note": "Clear display/UI scale; numerals read at a glance."},
        {"shot": "high/desktop/R04", "note": "Water-line '10' is 8 px tall (4x zoom 0-220 x 650-800): the race's key numeral doesn't read at a glance."},
        {"shot": "high/mobile/R04", "note": "'10' is ~11 device px (~5.5 CSS px) and spills past the gauge tile; item labels small but legible."},
        {"shot": "high/landscape/R02", "note": "Description clipped behind the pinned buttons."},
        {"shot": "high/desktop/R01", "note": "The 8-bit display face is a style choice, not an anchor-7 failure."}
      ]
    },
    "readability": {
      "score": 6.5,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/desktop/R10", "note": "Ring sinks into the cambered road: 960 ring px left of tub centre, 0 right."},
        {"shot": "high/desktop/R08", "note": "Ring 1,153 left vs 163 right; Critic A wrong to cite it as a success."},
        {"shot": "high/desktop/R03", "note": "On flat road the ring is symmetric (1,935 / 1,907) and the player is obvious."},
        {"shot": "high/desktop/R19", "note": "Translucent foreground slab, ghosted rival and bead clusters cover the player and most of the ring."},
        {"shot": "strips/high/R16", "note": "Frames 4, 7, 8: half-faded rival crew stands in front of the player's crew; player still locatable."},
        {"shot": "high/desktop/R16", "note": "Full-width studded stop line (y~585-615) marks the judge stop."},
        {"shot": "high/desktop/R07", "note": "Pack separable at 2x."}
      ]
    },
    "mobile": {
      "score": 6.5,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/mobile/R07", "note": "Tub ends near y1120 of 1688; controls start near y1425; never covered."},
        {"shot": "high/landscape/R04", "note": "Steer pill and action cluster in the corners, clear of the tub; minimap touches the place glyphs."},
        {"shot": "high/mobile/R02", "note": "Heading on the stud row; panel top (y~590) cuts off the preview tub's wheels; Handling under the button plate, Water off-screen."},
        {"shot": "high/landscape/R02", "note": "Buttons cover the 'Captain:' line; stat rows run off the panel."},
        {"shot": "high/landscape/R01", "note": "Purposeful landscape title grid."}
      ]
    },
    "authenticity": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R14", "note": "The Row with red roofs and dome; 4x zoom 560-860 x 240-320 shows the vista ending in a flat blue band that reads as sea."},
        {"shot": "high/desktop/R04", "note": "Water gauge with 10-gal line, checklist, duck and flag; no Hot Springs Mountain behind the Row."},
        {"shot": "high/desktop/R06", "note": "Arlington towers close the vista."},
        {"shot": "high/desktop/R05", "note": "Fordyce's patterned facade recognisable."},
        {"shot": "high/desktop/R16", "note": "Judge task and stop line; 3x zoom 120-460 x 290-500 shows a referee-striped judge mostly hidden beside a plain box booth."},
        {"shot": "high/desktop/R09", "note": "Goat Rock on flat ground, not an overlook."}
      ]
    }
  },
  "ip": {
    "clean": true,
    "notes": "Rounded-cube heads, straight-sided torsos and thumbed mitten hands (crops/high/R03-player-rear, crops/high/R02-preview-captain, crops/high/R15-player): no cylinder head, trapezoid torso or C-hands. No LEGO name or logo in R01, R02, R18 or signage. Hip block over two legs is not a gate feature."
  },
  "abWeight": {
    "characters": 0,
    "others": 1,
    "note": "All 10 ab/crop-* B panels match crops/low (MAD 0.40-0.71) vs crops/high (14.3-27.6): the close-up pairs show the Low tier only. Critic B's 'A' is a valid Low-tier finding (LOD2 lost printed expressions) but not evidence about High. Critic A's 'B' rests on a reversed reading of the same pairs and on unblinding. Treat the characters A/B as void this loop, not as a split that holds the score."
  },
  "gaps": [
    {"id": "G-low-near-lod-prints", "category": "characters", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS7", "evidence": ["ab/crop-R02-preview", "ab/crop-R02-preview-captain", "crops/low/R02-preview", "crops/low/R03-kart_1"], "benchmark": "2k-drive/drive-4.jpg", "fix": "On Low, draw LOD1 for the player's crew and any crew within 8 m of the camera, or bake the eight face prints and the uniform front print into LOD2's texture. Test: crops/low/R02-preview and crops/low/R02-preview-captain show a printed mouth on every visible face and the uniform front print, and the Low phone perf rows stay inside budget. This protects the characters gate under the A/B rule, whose close-up pairs are Low tier."},
    {"id": "G-ring-terrain-conform", "category": "readability", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R08", "high/desktop/R10", "high/desktop/R12", "high/mobile/R08"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Sample road height under each ring vertex, or draw the ring as a projected decal with a depth bias after the road. Test: ring-pixel left/right split within 60/40 in high/desktop/R08, R10 and R12 (now 88/12, 100/0 and 93/7)."},
    {"id": "G-dusk-emissive-and-pools", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/landscape/R07"], "benchmark": "worlds/worlds-4.jpg", "fix": "Give the R07 facade stripe a lit, fogged material, or cap its emissive and apply fog. Tone-map lamp pools with a soft knee, and extend each pool across the near lane. Test in high/desktop/R07: stripe pixels take at least 20 distinct values with max R < 250 (now one value, (255,225,79)); no pool pixel at R = 255; road patch 700-1000 x 640-740 has sigma at least 3 (now 0.0)."},
    {"id": "G-hud-tiles-and-numerals", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/mobile/R04", "high/landscape/R07", "high/landscape/R04", "high/desktop/R02", "high/desktop/R01"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Put LAP/time, place and the item labels on bevelled HUD tiles that match the water-gauge tile. Draw the water-line label at 11 CSS px or more on phones and 12 px or more on desktop, inside the gauge tile, or fold it into the readout ('41 / 10 GAL'). In landscape, box the minimap with its top at least 12 px below the place glyphs. Derive the panel stud count from panel width and draw the focus ring outside the stud tops. Test: '10' cap height at least 11 CSS px in high/mobile/R04; no minimap pixel within 8 px of the place glyph box in high/landscape/R04 and R07; every stud wholly inside its panel outline in high/desktop/R02 and R18. Also lifts typography."},
    {"id": "G-near-camera-ghosting", "category": "readability", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R19", "strips/high/R16", "high/desktop/R11", "high/desktop/R08"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Replace half-fades with removal. Any tree whose bounds enter the camera-to-player corridor or come within 6 m of the camera fades to alpha 0 within 0.15 s, or isn't placed there. A rival between the camera and the player's tub fades fully out and is shown as a team-colour outline. Test: no frame of high/desktop R08, R11, R16, R19 or strips/high/R16 has more than 5% of its pixels covered by geometry at 0 < alpha < 1, and the player's ring is at least 80% visible in R19 and in every R16 strip frame."},
    {"id": "G-env-plastic-response", "category": "materials", "expectedGain": 1.0, "severity": 4, "effort": "L", "workstream": "WS1", "bigLever": true, "evidence": ["high/desktop/R13", "high/desktop/R03", "high/desktop/R10", "high/desktop/R19", "high/desktop/R09"], "benchmark": "worlds/worlds-1.jpg; builders-journey/bj-3.jpg", "fix": "Big lever. Give environment parts the figures' ABS response: a per-brick bevel normal map and mortar AO on brick walls, with instanced brick courses on the nearest High facades; bevel highlights on foliage plates and rock; a shared gloss lobe on walls and roofs; and trans-clear blue ford tiles over a visible creek bed. Test: in a crop of the high/desktop/R13 right building, each brick's top edge is at least 8 levels brighter than its face under the key light; foliage plate edges in high/desktop/R10 show a highlight at least 15 levels above the plate face; the creek bed or stepping stones are visible through the water in high/desktop/R19."},
    {"id": "G-phone-teamselect-layout", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["high/mobile/R02", "high/landscape/R02"], "benchmark": "2k-drive/drive-2.jpg", "fix": "End a bounded scroll region above a solid button plate. In landscape, put the description and stats in a column beside the turntable. In portrait, place the heading below the stud row and frame the turntable camera so the whole tub sits above the panel. Test: at 390x844 and 844x390 no text or stat bar intersects the button plate, the Water row is reachable, no heading glyph overlaps a stud, and the preview tub's wheels are at least 20 px above the panel top in high/mobile/R02."},
    {"id": "G-action-feedback", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15", "crops/high/R02-preview-captain"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Collide tubs with lamp posts, barriers and the curb. On contact, fire the hit splash, a crew stagger and a 0.15 s camera kick. Add an FOV kick when hot steam releases. Tilt a blue, translucent bath-water plane with lateral acceleration, and spill beads over the rim on hard slides. Cap slide-bead life so the spray stays within one tub-length of the wheels, and shrink fumble beads to at most half a head width. Test: a re-shot strips/high/R14 has no static prop inside the ring in any frame, a contact frame with hit effects, a water-surface angle change of at least 5 deg, and no bead more than one tub-length from the tub; strips/high/R15 keeps the captain's face visible in every frame."},
    {"id": "G-crevice-ao-and-shade-fill", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R13", "high/desktop/R06", "crops/high/R03-kart_1"], "benchmark": "worlds/worlds-4.jpg", "fix": "Add SSAO on High, or baked vertex AO on Medium and Low, under cornices, in window reveals, at building corners and under eaves. Desaturate the hemisphere ground term so shaded buff walls stay buff (the bounce already exists; it is too green). Test: in high/desktop/R13, pixels directly under the cornice and at corners are at least 15% darker than open wall; the Arlington's shaded facade in high/desktop/R06 is within 15 deg of its sunlit hue (now 89 deg vs 53 deg)."},
    {"id": "G-ground-surface-detail", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R04", "high/desktop/R05", "high/desktop/R06", "high/desktop/R07"], "benchmark": "worlds/worlds-1.jpg", "fix": "Add low-contrast large-plate seams or grain to the asphalt (the gloss lobe already exists). Use a mip-aware stud normal/AO texture so baseplate studs survive at distance. Add tile or plate seams to flat roofs. Test: sigma at least 3 over high/desktop/R04 820-1000 x 600-700 and over high/desktop/R05 1150-1270 x 620-700 (both now 0.5); the lower Arlington roof in high/desktop/R06 (460-560 x 560-600) shows seams with sigma at least 6 (now ~3)."},
    {"id": "G-crowd-toy-figures", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS5", "evidence": ["crops/high/R03-kart_5", "crops/high/R03-kart_1", "high/desktop/R16"], "benchmark": "worlds/worlds-1.jpg", "fix": "Instance the spectators and judges from the crew pack's LOD2/LOD3 parts, with printed faces, printed shirts and two or three cheer poses; give the judges referee stripes and clipboards that stay visible. Test: crowd figures in crops/high/R03-kart_5 show printed eyes, a mouth and bevel highlights, and the judge in high/desktop/R16 is unoccluded and distinct from the crowd."},
    {"id": "G-landmark-grounds-and-seams", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R06", "high/desktop/R09", "high/desktop/R17"], "benchmark": "2k-drive/drive-1.jpg", "fix": "Extend terrain to the backdrop so no pale band shows between ground and hills, and weld the R09 terrain crack. Dress the landmark grounds and the Hill Wheatley plaza with brick hedges, path tiles, benches and a fountain. Break up the R09 pine field with clearings and mixed species. Test: no sky-coloured pixel below the horizon in high/desktop/R09 (now 78); the high/desktop/R06 region x 0-340, y 400-500 shows only terrain or trees; no flat empty baseplate or paving over 20% of R06, R09 or R17."}
  ],
  "calibration": {"materials": 7, "lighting": 6.5},
  "drift": false,
  "verdict": "continue"
}
```
