# Prosecutor brief: loop 1, tier high

Capture paths are relative to `games/Cart Racing/screenshots/review-loop-1/`. Pixel figures come from reading the PNGs directly (RGB values, luminance 0–255, and coordinates in the frame's own pixels).

## Summary
The two critics' means add up to **60.25**. I propose **54.0**. Both critics scored the close-ups and the changelog. The race frames show three things they underweighted:
- **What the camera actually sees.** Every race frame shows blank backs, flat walls, shadowless sprite trees and cartoon-human crowds.
- **Measurable failures they missed.** The Fordyce end wall is a single RGB value. The trees cast no shadow. At dusk the player's crew has the same luminance as the road. The timer is clipped in every landscape race frame, and the subtitle ghost is still there.
- **Effects that never appear.** A "HOT STEAM!" callout shows almost no steam, and a power slide ends inside the crowd barrier with no collision response.

Codex's 7s in typography and authenticity break an anchor clause by name. The other charges are smaller.

| Category | Claude | Codex | Mean | Proposed |
|---|---|---|---|---|
| characters | 6.0 | 6.5 | 6.25 | **5.5** |
| materials | 5.5 | 6.0 | 5.75 | **5.0** |
| scenery | 5.5 | 5.0 | 5.25 | **4.5** |
| lighting | 6.0 | 6.0 | 6.0 | **5.5** |
| animation | 5.5 | 5.5 | 5.5 | **5.0** |
| ui | 6.0 | 6.5 | 6.25 | **6.0** |
| typography | 6.0 | 7.0 | 6.5 | **5.5** |
| readability | 6.0 | 6.5 | 6.25 | **5.5** |
| mobile | 6.0 | 6.0 | 6.0 | **5.5** |
| authenticity | 6.0 | 7.0 | 6.5 | **6.0** |
| **Total** | 58.5 | 62.5 | 60.25 | **54.0** |

## Characters: mean 6.25, proposed 5.5
**Accepted:** the printed faces in four expressions, front-printed uniforms and bevelled parts are real (`crops/high/R03-kart_5`, `crops/high/R04-player`).

**Charges:**
1. **The pushers don't touch what they push (missed by both critics).**
   - In `crops/high/R03-kart_1`, the nearest Gator Gang pusher's mitten hands hang in the air at about x 180–235. That is a full body width (about 250 px) left of the bowl, whose rim starts near x 480. No handle exists at that height: the green side bar sits at mid-bowl, at x 480–610.
   - In `crops/high/R02-preview` and `crops/high/R03-kart_5` the hands stop short of the rim corner with nothing to grip.
   - The 7 anchor requires close-ups that "hold up"; a crew miming a push in mid-air does not.
2. **The view the player gets is the 5 anchor, word for word.**
   - Every race frame shows crews from behind (`high/desktop/R03`, `R04`, `R07`, `R08`, `R12`).
   - `crops/high/R03-player-rear` and `crops/high/R02-preview-rear` show those backs are blank slabs with a belt block.
   - At chase distance, team identity is "colour and hat" (the 5-anchor wording). Engine Six (black, red caps) and The Velvet Mob (black, black top hats; `high/desktop/R07`) differ only by hat, and at dusk the top hats are black on black on a dark road. Add Critic A's two campaign-hat teams (`high/desktop/R09`, `R03`). "All 12 teams distinct at chase distance" fails.
3. **The hero close-up is broken** (both critics noted it, neither scored it as a 7-anchor failure).
   - In `crops/high/R02-preview-captain`, octagonal rim studs float up to a stud width outside the lip (around x 190–340, y 420–540), and the rim is a sawtooth.
   - The captain's arms are one horizontal slab that runs out over the rim (also in `crops/high/R03-kart_5`).
   - Tyres are visibly faceted (front wheel in `crops/high/R03-kart_5`), and there are no part seams anywhere.

**Proposed 5.5:** close-up integrity, seams and team distinctness all fail at 7, and the in-race read is the 5 anchor. Codex's 6.5 cites no evidence that would lift it above Critic A.

## Materials: mean 5.75, proposed 5.0
**Accepted:** bevel highlights on figures and tub bowls read as plastic (`crops/high/R02-preview-rear`, `crops/high/R03-kart_5`).

**Charges:**
1. **The hero landmark's wall is flat colour.** On the Fordyce's end wall in `high/desktop/R05` (x 1005–1060, y 520–646), all 6,930 pixels have exactly one RGB value, (100, 115, 94).
   - There are no running-bond courses, although the changelog says they are drawn over facades.
   - There is no specular or Fresnel gradient and no texture.
   - This matches the 3 anchor ("flat unlit colour") on the most important building in the game.
2. **The judge booth is a bare grey box with a red slab on top** (`high/desktop/R16`, around x 245–420, y 320–470). Half its pixels in a 40×110 patch are one colour (108, 131, 123). It has no bricks, studs or seams, and it sits beside the racing line at the event's signature moment (`strips/high/R16`).
3. **The studs are shading, not parts.**
   - The crest of the studded slope in `high/desktop/R08` is a clean straight line.
   - The road/verge edges in `high/desktop/R09` and `R10` are clean straight lines too; no stud ever breaks a silhouette.
   - In `worlds-1` (anchor 7), every plate edge is notched by studs.
4. **The crowds are not just "sprites"; they are a different kind of figure.** They are painted cartoon humans (skin, hair, swimwear) magnified into blurs about 150 px tall at frame edges (`high/desktop/R07` right, `R13` left, `R14` right). They are the 5-anchor clause "textures from a different style than the models" in its strongest form.
5. **The clear part fails.** The water is a flat cyan slab with a hard polygon edge (`crops/high/R02-preview-captain`), so "clear parts read as transparent plastic" fails.

**Proposed 5.0:** the plastic read covers only the tubs and crews, about a tenth of a typical frame (`high/desktop/R04`). Roads, walls, facades, trees and crowds read as paint.

## Scenery: mean 5.25, proposed 4.5
**Accepted:** baseplate verges, tile roads, and a recognisable Arlington and Fordyce.

**Charges:** traits from the 3 anchor ("untextured blocks; world and characters clash") are present, and the critics scored as if they weren't.
1. **World and characters clash.** Brick figures race past painted cartoon humans in every street frame (`high/desktop/R03`, `R04`, `R07`, `R13`, `R14`, `R16`, `R17`): two incompatible kinds of people in one shot.
2. **Untextured blocks:** the judge booth in `high/desktop/R16` and the flat Fordyce end wall in `high/desktop/R05` (charges 1–2 under Materials).
3. **The terrain shows its edges** (`high/desktop/R06`, left side).
   - A pale grey band sits between the lawn and the ridge panorama, unblended. At x = 60, rows 440–480 run from RGB (181, 210, 222) to (146, 174, 176).
   - Hard-edged darker-green arcs sweep across the lawn, with luminance steps of about 30 at x ≈ 30 and x ≈ 200 on row 640.
4. **The mountain courses are interchangeable.** `high/desktop/R08`, `R09` and `R10` all show a grey road, green studded verges and the same pine and oak cards; `R10` repeats one pine card down both verges. The 7-anchor clause "each course has its own set pieces" fails, and `R09` (Goat Rock and Gulpha Gorge) shows neither rock nor ford.
5. **The sprites are blown up, not just flat.** The right 40% of `high/desktop/R11` and the top corners of `R08` and `R09` are stair-stepped blocks of blurred texels.

**Proposed 4.5:** the frames hold more anchor-3 traits than anchor-7 ones. Baseplate ground and tile roads are the only 7-anchor items present.

## Lighting: mean 6.0, proposed 5.5
**Accepted:** a real shadow map, warm lamp pools at dusk (`high/desktop/R07`), and a distinct sunset palette (`high/desktop/R11`).

**Charges:**
1. **Trees cast no shadow (missed by both critics).**
   - In `high/desktop/R12`, the grass around and to the shadow side of the large right-hand tree stays at luminance 118–143 at every sampled point, while the tubs' shadows take the road from 91 down to 40–62.
   - The tree beside the road in `high/desktop/R04` and `R15`, and the lawn trees in `R05`, show no shadow either.
   - The biggest objects in most frames float while the tubs are grounded.
2. **There is no ambient occlusion anywhere** (both critics): not at building bases (`high/desktop/R05`, `R13`), and not at figure-to-tub contacts.
3. **The dusk palette erases the player.** In `high/desktop/R07` the player's crew has mean luminance 46.6 against the road's 45.6, a 1:1 ratio. The day equivalent in `high/desktop/R03` is 64.9 against 84.3. There is no rim or fill light.
4. **The haze isn't matched to the sky:** see the pale band at the horizon in `high/desktop/R06`.
5. **No ambient or bounce variation:** the single-value Fordyce wall in `high/desktop/R05` shows none.

**Proposed 5.5:** above the 5 anchor (a shadow map, and dusk differs by more than tint), but three of the 7 anchor's four light-quality clauses fail: AO, haze, and grounding for everything rather than only the tubs.

## Animation and feel: mean 5.5, proposed 5.0
**Accepted:** the push-run and the circling crew read with correct toy articulation (`strips/high/R15`, `strips/high/R16`).

**Charges:**
1. **The power slide ends in the crowd** (`strips/high/R14`). There is no spray or steam in any of the 8 frames (both critics). In frames 7–8 the tub crosses the edge line and the sidewalk and stops in the crowd barrier, with its crew drawn over the barrier sprites. There is no bump, debris, splash or camera shake. In frames 2–4 one pusher is dragged almost horizontal.
2. **The callout has no effect behind it.** In `high/desktop/R17`, "HOT STEAM!" fires, but the only steam in the frame is one lilac puff about 30 px across at the captain's head (about x 612–640, y 415–445). The same holds in `high/mobile/R17`.
3. **The fumble produces no water.** `strips/high/R15` shows no splash, no spill and no camera reaction, and the crew interpenetrate in frames 1, 6 and 7.
4. **Rivals pass through the player's crew** (`strips/high/R16`, frames 4–8).
5. **Nothing sloshes:** the water is a static flat slab in every close-up.

**Proposed 5.0:** the 5 anchor is "run cycles, weak feedback". Here feedback is nearly absent, and the one big event in the strips ends in a collision-free clip into scenery.

## UI / HUD: mean 6.25, proposed 6.0
**Accepted:** a clear desktop hierarchy with no desktop overlaps (`high/desktop/R04`), and clean results with the race HUD hidden (`high/desktop/R18`).

**Charges against Codex's 6.5:** the 7 anchor requires "one style that belongs to the brick world".
- Navy web panels and orange pill buttons (`high/desktop/R01`, `R02`, `R18`) don't meet it.
- The title menu is eight identical orange buttons, so Grand Prix carries the same weight as Credits (`high/desktop/R01`).
- On the selected team card, the secondary text "Traditional" measures about 2.3:1 against its teal highlight (`high/desktop/R02`).
- Item labels are about 9–10 px at 1280 (`high/desktop/R04`).
- The item slot is a translucent bubble with scenery showing through it (`high/mobile/R08`, `high/landscape/R08`).

**Proposed 6.0.**

## Typography: mean 6.5, proposed 5.5
**Charges:**
1. **Clipping, which the 7 anchor forbids ("nothing clipped").** The water-gauge panel covers the lower half of the timer in every landscape race frame: `high/landscape/R03`, `R04`, `R07`, `R08` and `R17`, five of five. Codex's 7 never mentions it; Critic A cited two of the five.
2. **The subtitle ghost is still present.** Critic A credits this build with a clean outlined subtitle.
   - In `high/mobile/R01`, a blurred dark copy sits about 12 device px below each subtitle line; rows 472–482 under line 2 are mid-dark across the whole text width.
   - `high/landscape/R01` shows the same.
   - `high/desktop/R01` has a softer band at rows 246–251 under "Arkansas", which is also orphaned on its own line.
3. **Mixed scales on the HUD:** a pixel "8TH" about 55 px tall beside item labels about 9 px tall (`high/desktop/R04`). This is the 5 anchor's "mixed scales".
4. **More orphans:** "line." sits alone in the team description (`high/landscape/R02`).

**Proposed 5.5:** the results screen is good, but the type players read at speed is clipped on phones and mixed in scale.

## Readability: mean 6.25, proposed 5.5
**Charges:**
1. **The player's tub can disappear.** In frames 5–7 of `strips/high/R16`, a rival tub passes between the camera and the player and hides most of the player's tub, and in frame 7 its crew slides under the water-gauge panel. The 7 anchor requires that "the player's tub stands out" in every frame.
2. **At dusk the tub blends into the road** (the 5 anchor, literally): crew luminance equals road luminance in `high/desktop/R07` (figures above), and `high/mobile/R07` matches.
3. **There is no player marker** (Critic A): in `high/desktop/R04` and `R12` the player is one of a dozen backs.
4. **Foreground sprites take over the view:** the right 40% of `high/desktop/R11`, and the trees in `high/mobile/R08` that hide the approaching bend.
5. **The judge stop doesn't read as a judge stop:** it is a bare grey box and a blank blue board (`high/desktop/R16`).

**Proposed 5.5.**

## Mobile: mean 6.0, proposed 5.5
**Accepted:** in portrait, the controls never cover the tub (`high/mobile/R04`, `high/mobile/R17`), and the results fit (`high/mobile/R18`).

**Charges:**
1. **Landscape is not framed on purpose.**
   - The timer sits under the gauge in 5 of 5 race frames.
   - The minimap's top loop sits inside the tub's screen box, between the rear pushers' legs (`high/landscape/R03`, rows about 604–636).
   - The item labels print over crowd sprites (`high/landscape/R07`).
2. **Team select hides its subject** in both orientations (`high/mobile/R02`, `high/landscape/R02`; both critics).
3. **The steering control is the smallest control on screen.** It measures about 143×48 device px, or about 72×24 CSS px, in both `high/mobile/R04` and `high/landscape/R04`, against action buttons of about 70×55 CSS px. The captures can't show its hit area, but the drawn control is about half the 44 px touch guideline.
4. **"Holds 30 fps" is not shown.** The loop brief's own table gives swiftshader · low · mobile a worst p95 of 34.2 ms, which is over the 33.3 ms of a 30 fps frame. Critic A read only the 66 fps minimum.

**Proposed 5.5.**

## Authenticity: mean 6.5, proposed 6.0
**Accepted:**
- The Arlington silhouette (`high/desktop/R06`) and the Fordyce colours (`high/desktop/R05`).
- A domed bathhouse on the Row (`high/desktop/R03`, `R14`).
- Crowds with water pistols.
- The duck, flag, water gauge and items, and the Rules of the Row task (`high/desktop/R16`).

**Charges against Codex's 7:** most of the 7 anchor's clauses fail.
- The bathhouses are not "in brick form": the Fordyce end wall is a single flat colour.
- The Arlington doesn't close the Central Avenue vista; `high/desktop/R04` ends in low blocks and the ridge.
- There are no judges (`strips/high/R16`).
- The mountain courses carry no local identity. `high/desktop/R09` is grey studded plate like `R10` and every street, with no ford water and no Goat Rock.
- Bridge Street is a generic corner (`high/desktop/R13`).

**Proposed 6.0.**

## IP check
Clean. Heads are rounded cubes, hands are block mittens, and torsos are straight boxes (`crops/high/R02-preview`, `crops/high/R03-player-rear`). Stud tops are blank, and no frame or menu carries a LEGO name or logo.

## Gaps the critics missed
1. **G-crew-hand-contact** (characters, WS2, severity 3, effort M, gain +0.5)
   - **Evidence:** in `crops/high/R03-kart_1` the pushers' hands are in mid-air; also `crops/high/R02-preview`.
   - **Fix:** add a push bar at the crew's hand height on both sides and the back of every tub, and pose or IK each pusher's hands onto it.
   - **Test:** in every R02–R04 crop, each pusher's hand box intersects the bar or rim.
2. **G-flat-landmark-walls** (materials, WS1, severity 3, effort S, gain +0.5)
   - **Evidence:** the Fordyce end wall is one RGB value over 6,930 px (`high/desktop/R05`); the judge booth is near-flat grey (`high/desktop/R16`).
   - **Fix:** apply the running-bond shader at a readable scale to landmark and prop walls, plus a vertical ambient gradient.
   - **Test:** every 50×50 px wall patch in R05, R13 and R16 has at least 20 distinct colours, and the courses read at the R05 distance.
3. **G-tree-shadows** (lighting, WS5, severity 3, effort S, gain +0.5)
   - **Evidence:** in `high/desktop/R12` the grass under the canopy is unshadowed; also `high/desktop/R04` and `R15`.
   - **Fix:** make the tree cards alpha-tested shadow casters, or add a soft canopy shadow decal.
   - **Test:** in R12, the ground on the tree's shadow side drops at least 20% in luminance.
4. **G-slide-off-road-response** (animation, WS3, severity 3, effort M, gain +0.5)
   - **Evidence:** in `strips/high/R14` the tub ends in the crowd barrier and one pusher goes near-horizontal.
   - **Fix:** add curb and barrier collision with a bounce, a splash and brick-chip particles, plus a 2–4 px camera shake for 150 ms. Keep crew figures within ±30° of upright during slides.
   - **Test:** in the R14 strip, no crew member tilts past 30° and the tub never crosses the barrier line.
5. **G-chase-cam-occlusion** (readability, WS3, severity 3, effort S, gain +0.5)
   - **Evidence:** in frames 5–7 of `strips/high/R16`, a rival hides the player's tub.
   - **Fix:** dither-fade any rival figure between the camera and the player's tub, or raise the camera pitch when a rival is within 4 m behind.
   - **Test:** every R16 strip frame shows at least 70% of the player tub's screen box.
6. **G-judge-stop-set** (scenery, WS4, severity 2, effort S, gain +0.25)
   - **Evidence:** the judge booth is a bare grey box and the board is blank (`high/desktop/R16`, `strips/high/R16`).
   - **Fix:** build the judges' stand from bricks, tiles and a printed sign (task icon and "Judge stop").
   - **Test:** the R16 booth shows brick courses and a printed sign. This complements Critic A's G-judges-missing.
7. **G-mountain-course-identity** (authenticity, WS4, severity 3, effort M, gain +0.5)
   - **Evidence:** `high/desktop/R08`, `R09` and `R10` are interchangeable.
   - **Fix:** add tan and reddish-brown dirt colours to the toy palette for the Gulpha Gorge road. Give each mountain course one set piece: a Goat Rock outcrop of slope bricks, ford water tiles across the road at R09, and the summit tower at R10.
   - **Test:** R08, R09 and R10 each show a distinct ground palette and a set piece.
8. **G-subtitle-ghost** (typography, WS6, severity 2, effort S, gain +0.25)
   - **Evidence:** the blurred offset copy under each subtitle line in `high/mobile/R01`, `high/landscape/R01` and `high/desktop/R01`.
   - **Fix:** remove the residual text-shadow (keep only the stroke, via paint-order) and balance the wrap.
   - **Test:** the rows below each subtitle line stay within 5 luminance of the background.
9. **G-steer-affordance** (mobile, WS6, severity 2, effort S, gain +0.25)
   - **Evidence:** the steer pill is about 72×24 CSS px (`high/mobile/R04`, `high/landscape/R04`).
   - **Fix:** a steering pad of at least 140×56 CSS px, or a full-height drag zone over the left third with a visible thumb.
   - **Test:** the drawn steering affordance is at least 48 CSS px tall in both phone frames.

```json
{
  "role": "prosecutor",
  "loop": 1,
  "tier": "high",
  "scores": {
    "characters": {
      "score": 5.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "crops/high/R03-kart_1", "note": "Nearest pusher's mitten hands hang in mid-air about 250 px left of the bowl; no handle at hand height"},
        {"shot": "crops/high/R02-preview-captain", "note": "Rim sawtooth; octagonal studs float up to a stud width outside the lip; captain's arm slab runs out over the rim; water a flat slab"},
        {"shot": "crops/high/R03-player-rear", "note": "Blank torso backs, the view every race frame shows; no part seams"},
        {"shot": "high/desktop/R07", "note": "Velvet Mob and Engine Six both black-bodied; only the hat differs, black-on-black at dusk"},
        {"shot": "crops/high/R03-kart_5", "note": "Faceted front tyre; captain's arm crosses the rim"}
      ]
    },
    "materials": {
      "score": 5.0,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R05", "note": "Fordyce end wall (x 1005-1060, y 520-646): all 6,930 px one RGB value (100,115,94); no brick courses, no specular gradient"},
        {"shot": "high/desktop/R16", "note": "Judge booth is a bare grey box with a red slab; half of a 40x110 patch is one colour"},
        {"shot": "high/desktop/R08", "note": "Studs are shading on a flat slope; the slope crest is a clean line with no stud silhouette"},
        {"shot": "high/desktop/R07", "note": "Crowd is painted cartoon humans magnified to ~150 px blurs; a different style from the models"},
        {"shot": "crops/high/R02-preview-captain", "note": "Water reads as an opaque flat cyan slab, not clear plastic"}
      ]
    },
    "scenery": {
      "score": 4.5,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R06", "note": "Pale unblended band between lawn and ridge (RGB 181,210,222 to 146,174,176); hard-edged darker-green arcs across the lawn"},
        {"shot": "high/desktop/R16", "note": "Untextured grey booth at the judge stop"},
        {"shot": "high/desktop/R14", "note": "Brick figures beside blurred cartoon-human crowd cards: world and characters clash"},
        {"shot": "high/desktop/R10", "note": "Same pine card repeated down both verges; course interchangeable with R08 and R09"},
        {"shot": "high/desktop/R11", "note": "Right 40% is a stair-stepped, blurred tree card"}
      ]
    },
    "lighting": {
      "score": 5.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R12", "note": "Grass around the big tree stays at luminance 118-143; tub shadows take the road from 91 to 40-62; trees cast nothing"},
        {"shot": "high/desktop/R07", "note": "Player crew mean luminance 46.6 vs road 45.6 at dusk; no rim or fill"},
        {"shot": "high/desktop/R05", "note": "No AO at building bases; the end wall is a single flat value"},
        {"shot": "high/desktop/R06", "note": "Horizon band not matched to the sky haze"}
      ]
    },
    "animation": {
      "score": 5.0,
      "confidence": 0.6,
      "evidence": [
        {"shot": "strips/high/R14", "note": "No spray or steam in 8 frames; frames 7-8 the tub ends in the crowd barrier with no collision response; one pusher near-horizontal in frames 2-4"},
        {"shot": "high/desktop/R17", "note": "HOT STEAM! callout with one ~30 px lilac puff as the only steam"},
        {"shot": "strips/high/R15", "note": "Fumble: no splash or spill, no camera reaction; crew interpenetrate in frames 1, 6, 7"},
        {"shot": "strips/high/R16", "note": "Rival crew passes through the player's crew in frames 4-8"}
      ]
    },
    "ui": {
      "score": 6.0,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Clear hierarchy and no desktop overlap; item labels ~9-10 px; navy web panels not of the brick world"},
        {"shot": "high/desktop/R01", "note": "Eight identical orange buttons; Grand Prix weighted the same as Credits"},
        {"shot": "high/desktop/R02", "note": "Selected card's 'Traditional' about 2.3:1 against teal"},
        {"shot": "high/mobile/R08", "note": "Translucent item slot shows the tree through it"}
      ]
    },
    "typography": {
      "score": 5.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/landscape/R04", "note": "Timer's lower half covered by the water-gauge panel; the same in landscape R03, R07, R08, R17 (5 of 5)"},
        {"shot": "high/mobile/R01", "note": "Blurred dark copy ~12 device px under each subtitle line (rows 472-482 under line 2)"},
        {"shot": "high/desktop/R01", "note": "'Arkansas' orphaned; soft ghost band at rows 246-251"},
        {"shot": "high/desktop/R04", "note": "~55 px pixel '8TH' vs ~9 px item labels: mixed scales"}
      ]
    },
    "readability": {
      "score": 5.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "strips/high/R16", "note": "Frames 5-7: a rival passes between the camera and the player and hides most of the player's tub"},
        {"shot": "high/desktop/R07", "note": "Crew luminance equals road luminance at dusk"},
        {"shot": "high/mobile/R07", "note": "Dark crew on a dark road in portrait"},
        {"shot": "high/desktop/R11", "note": "A foreground tree card covers ~40% of the view"},
        {"shot": "high/desktop/R04", "note": "No player marker; the player is one of a dozen backs"}
      ]
    },
    "mobile": {
      "score": 5.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/landscape/R03", "note": "Minimap inside the tub's screen box between the rear pushers' legs; timer clipped"},
        {"shot": "high/landscape/R07", "note": "Item labels print over crowd sprites; timer clipped"},
        {"shot": "high/mobile/R02", "note": "Team select hides the tub entirely"},
        {"shot": "high/mobile/R04", "note": "Steer pill ~72x24 CSS px, the smallest control; tub clear of the controls"}
      ]
    },
    "authenticity": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R06", "note": "Arlington silhouette recognisable"},
        {"shot": "high/desktop/R04", "note": "Central Avenue vista ends in low blocks and ridge, not the Arlington"},
        {"shot": "high/desktop/R05", "note": "Fordyce recognisable by colour but not built in brick (flat end wall)"},
        {"shot": "high/desktop/R09", "note": "Gulpha Gorge: grey studded plate like every road; no ford water, no Goat Rock"},
        {"shot": "strips/high/R16", "note": "Rules of the Row task shown; no judges"}
      ]
    }
  },
  "ip": {"clean": true, "notes": "Rounded-cube heads, block mitten hands and straight box torsos; blank stud tops; no LEGO name or logo in any frame or menu."},
  "gaps": [
    {"id": "G-crew-hand-contact", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R03-kart_1", "crops/high/R02-preview", "crops/high/R03-kart_5"], "benchmark": "2k-drive/drive-4.jpg", "fix": "Add a push bar at crew hand height on both sides and the back of every tub, and pose or IK each pusher's hands onto it. Test: in every R02-R04 crop each pusher's hand box intersects the bar or rim."},
    {"id": "G-flat-landmark-walls", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R05", "high/desktop/R16", "high/desktop/R13"], "benchmark": "worlds/worlds-1.jpg", "fix": "Apply the running-bond brick shader at a readable scale to landmark and prop walls, plus a vertical ambient gradient. Test: every 50x50 px wall patch in R05, R13 and R16 has at least 20 distinct colours, and the courses read at the R05 distance."},
    {"id": "G-tree-shadows", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R12", "high/desktop/R04", "high/desktop/R15"], "benchmark": "worlds/worlds-1.jpg", "fix": "Make tree cards alpha-tested shadow casters, or add a soft canopy shadow decal. Test: in R12 the ground on the big tree's shadow side drops at least 20% in luminance."},
    {"id": "G-slide-off-road-response", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Add curb and barrier collision with a bounce, a splash and brick-chip particles, plus a 2-4 px camera shake for 150 ms; keep crew figures within +/-30 degrees of upright during slides. Test: in the R14 strip no crew member tilts past 30 degrees and the tub never crosses the barrier line."},
    {"id": "G-chase-cam-occlusion", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R16"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Dither-fade any rival figure between the camera and the player's tub, or raise the camera pitch when a rival is within 4 m behind. Test: every R16 strip frame shows at least 70% of the player tub's screen box."},
    {"id": "G-judge-stop-set", "category": "scenery", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R16", "strips/high/R16"], "fix": "Replace the bare grey booth and blank blue board with a brick-built judges' stand: bricks, tiles and a printed sign with the task icon and 'Judge stop'. Test: the R16 booth shows brick courses and a printed sign."},
    {"id": "G-mountain-course-identity", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R08", "high/desktop/R09", "high/desktop/R10"], "benchmark": "2k-drive/drive-5.jpg", "fix": "Add tan and reddish-brown dirt colours to the toy palette for the Gulpha Gorge road, and give each mountain course one set piece: a Goat Rock outcrop of slope bricks and ford water tiles across the road at R09, the summit tower at R10. Test: R08, R09 and R10 each show a distinct ground palette and a set piece."},
    {"id": "G-subtitle-ghost", "category": "typography", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R01", "high/landscape/R01", "high/desktop/R01"], "fix": "Remove the residual blurred text-shadow under the title subtitle (keep only the stroke via paint-order) and balance the wrap. Test: the rows below each subtitle line in high/mobile/R01 stay within 5 luminance of the background."},
    {"id": "G-steer-affordance", "category": "mobile", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R04", "high/landscape/R04"], "fix": "Make the steering control a pad of at least 140x56 CSS px, or a full-height drag zone over the left third with a visible thumb, matching the action buttons' visual weight. Test: the drawn steering affordance is at least 48 CSS px tall in both phone frames."}
  ]
}
```
