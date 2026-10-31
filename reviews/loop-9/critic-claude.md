# Critic A (critic-claude), loop 9, high tier

## Verdict
Spa City Tub Rally now looks like a coherent, cheerful brick-toy racer. The figures are original and expressive, the HUD and menus share one brick style, and the Row's landmarks can be named. It still falls short of the shipped benchmarks in the same places. The world is boxes with brick textures in front of pale stepped hill cut-outs, not built geometry. The light is a clean sun with soft shadow maps but no occlusion, no bounce and no light from lamps at dusk. The effects are soft spheres, not brick parts. In a pack, the four pushers hide the tubs they push. This loop's A/B pairs show real progress in feedback (R15 now has a flash, a call-out and a splash), in the player marker (one gold ring), in the far hills (a darker foothill row and no white ledges) and in phone layouts. One claimed fix does not appear in the captures: the tie-dye/antenna crew's tub, which I take to be the Out-of-Towners', still has a purple body, and it sits beside the Velvet Mob's purple tub in `high/desktop/R07`. Total 68/100. Five gates fail: materials, scenery, lighting, animation and readability are all at 6.5.

## Scores

**Characters: 7.0.** The figures read at once as original plastic toys. They have bevelled square heads, block torsos and mitten hands. Their printed faces show expression: the captain screams, the crew grin, and the tie-dye crew scowl (`crops/high/R02-preview-captain`, `crops/high/R04-kart_3`). The uniforms are printed: reflective bands and X straps on the firefighters, a hydrant badge, tie-dye swirls, the Velvet Mob's "H" (`crops/high/R03-player-rear`, `high/desktop/R07`). Headgear tells the teams apart at chase distance: helmets, cowboy hats, towel turbans, antenna boppers, bowlers, gator hats with studs, ranger hats (`high/desktop/R04`, `R11`, `R13`, `R19`). The chassis are studded plates on bevelled wheels with hubcaps (`crops/high/R03-kart_1`). Short of 8 against `drive-4`:
- The backs of heads are blank flesh blocks with no hair or helmet-strap print (`crops/high/R02-preview-rear`).
- Faces are two dots and a mouth.
- The tub shell is one smooth moulding with a decal stripe, not a build of brick parts.
- Hands sink into tub rims (`crops/high/R04-kart_3`).

**Materials: 6.5.**
- Strengths: helmets and tubs carry a glossy highlight that follows the curves (`crops/high/R03-player-rear`, `crops/high/R02-preview`). Grass is a studded baseplate (`high/desktop/R09`, `R10`, `R19`). The tub water is clear, tinted plastic (`crops/high/R02-preview-captain`).
- Facades are flat brick textures on box walls. There are no brick edges, no seams and no bevel highlights (zoom of `high/desktop/R13`, right building).
- The tree "plates" have no studs and look like extruded slabs (`high/desktop/R10`).
- Roads are a plain grey tile grid with no wear.

Against `worlds-1` (7), every surface there is a part: roof tiles, fence pieces, studs. Here only the ground and the chassis are. Nothing translucent glows.

**Scenery: 6.5.** It reads as a brick town. It has a baseplate lawn, a tile road, brick facades with striped awnings, plate trees, globe lamps, and fenced crowds of block figures (`high/desktop/R04`, `R14`). Each course has a set piece: a pale novaculite brick outcrop (`R09`), the Gulpha ford in blue tile (`R19`), a red-brick circle (`R17`).

Two problems hold it below the `worlds-1` and `worlds-4` bar:
- **Far hill rings:** these are flat, low-contrast stepped cut-outs with grey tree silhouettes. The pale faces in `high/desktop/R13` average (168,181,189), against sky of (196,218,233) on the same rows. That is about 86% of the sky value, close to the capped maximum, and they read as cardboard flats.
- **Repeated downtown blocks:** the two-storey brick blocks share one window module and one awning (`R13`, the right side of `R03` and `R04`).

The new foothill row does help (`ab/high-desktop-R06`).

**Lighting: 6.5.**
- **Shadows:** a soft key light casts tree shadows on the road (`high/desktop/R08`, `R19`), and the tubs sit on dark contact patches (`R14`).
- **Palettes:** dusk and sunset are deliberate: `R07` is amber and brown, `R11` is pink-orange with cool haze.
- **Missing occlusion:** there is no ambient occlusion in crevices or under figures (`crops/high/R03-kart_1`: the space under the chassis is flat grey).
- **Dusk lamps light nothing:** in `high/desktop/R07` the globes are lit at (230,214,166), but the road at the centre of the frame measures (63,45,40), with no lamp pool or warm bounce.
- **Daylight is a flat even fill:** `R05`, `R06`.

That is `worlds-4` territory in palette, not in light quality. It is far from `bj-*` or `sw-1`.

**Animation and feel: 6.5.**
- `strips/high/R15`: frame 1 flashes the crew, frame 2 fades it, and frames 3 to 6 throw blue water beads. The crew run on visibly different paths around the tub, with legs swinging at the hips. The call-out reads "Dropped the mat! Circle the tub!".
- `strips/high/R16`: the crew circle at the judge booth while a progress bar fills.
- `strips/high/R14`: steam puffs and a blue charge arc appear from frame 3 and trail behind the tub.

Below 7:
- No camera kick shows in any strip.
- The water in the tubs never sloshes.
- The effects are generic soft spheres, not brick parts.
- The "hot steam" in `high/desktop/R17` is a tan clump at (215,178,141) on the red brick, which reads as a bread loaf behind the tub.
- The hit flash bleaches the whole crew to white and pink (`crops/high/R15-player`).

`drive-3` (8.5 for effects) has streaking trails and a speed read. This game has puffs.

**UI / HUD: 7.0.**
- **HUD:** one family of studded navy tiles. Lap and time sit top left, the item orb and tickets top centre, the place large at top right, the water gauge and item tray bottom left, and the minimap bottom right (`high/desktop/R04`). Nothing overlaps the play area.
- **Menus:** the brick-tab buttons are consistent across the title, team select and results screens (`high/desktop/R01`, `R02`, `R18`).
- **Short of `drive-2` and `drive-3`:** the HUD is static and not context-aware, and the item tray's four labels sit at the same weight as everything else.

**Typography: 7.0.** The pixel display face (title, RESULTS, READY, LAP, 8TH) over a humanist sans makes a clear two-level scale. Numerals read at a glance (`high/desktop/R04`, `high/mobile/R04`). Results values stay on one line on the phone (`high/mobile/R18`). I checked the water-line "10" badge at the pixel level: it is not clipped, but its right edge merges into the tub's dark outline.

Contrast is weak in two labels on `high/mobile/R02`:
- The selected card's division label measures 2.4:1, (195,211,223) on (76,143,168).
- The "locked" labels measure 2.8:1, (106,138,164) on (26,68,106).

**Readability: 6.5.** The gold ring and arrow make the player stand out on every road colour (`high/desktop/R12`, `R13`, `R17`, `high/mobile/R04`). The bubble pickups stand out (`R10`, `R11`), the road edges are white-lined (`R08`, `R14`), and the judge booth reads (`R16`). Three things hold it down:
- **Pushers hide the tubs.** In the chase view the four pushers hide most of each tub. In `R10` only the top of the barrel shows between the two rear pushers. In the pack in `R04` and `R12`, tubs disappear into a wall of figures, so the crews have to carry the team read.
- **Two purple tubs still sit side by side.** In `high/desktop/R07`, the Velvet Mob's tub at (70,38,77) runs right beside the tie-dye crew's tub at (154,65,173). The tie-dye tub's body is still purple, (86,50,120) in `crops/high/R04-kart_3`, with a teal rim. Meanwhile the Out-of-Towners' team-select swatch is teal, (47,179,166) in `high/desktop/R02`.
- **Rival rings are faint.** They are now thin enough to vanish on light asphalt (`R13`).

**Mobile: 7.0.**
- **Portrait:** the tub sits in the middle third and the thumb controls stay in the bottom fifth without covering it (`high/mobile/R04`, `R17`). Portrait team select and results fit with margins (`high/mobile/R02`, `R18`).
- **Landscape:** it keeps the tub clear of the steer pad and buttons (`high/landscape/R03`, `R04`, `R08`).
- **Performance:** the software-GL floor holds 51 fps.
- **Landscape HUD is heavy:** the left HUD column runs from y=25 to y=445 of 780 (57% of the height), and the top tiles take 24%, so the screen feels boxed in (`high/landscape/R04`).
- **Title in portrait:** the menu covers the whole flyover (`high/mobile/R01`).

**Authenticity: 7.0.**
- **The Row:** the Fordyce has its marquee and ground-floor shop windows (`high/desktop/R05`). The Quapaw dome shows down Central (`R14`, `R15`).
- **The Arlington:** its twin towers and red roofs close the vista (`R06`, and the end of the street in `crops/high/R03-kart_1`).
- **The race:** the water line (10-gal mark), ducks, flags, judges and towel, bath, soap and loofah items are all present (`R04`, `R16`).
- **Mountains:** the Ouachitas read only as generic stepped forest.
- **Bridge Street:** `R13` is generic brick downtown.

## IP check
Clean.
- The heads are square blocks, not cylinders.
- The hands are rounded mitten fists, not C-clips (`crops/high/R02-preview-captain`).
- The torsos are straight-sided boxes, not trapezoids (`crops/high/R02-preview-rear`).
- No LEGO name or logo appears in any frame.
- The closest shared feature is the generic two-block legs under a hip block. It is not distinctive enough to flag.

## Ranked gaps
1. **G-hill-rings-cardboard** (scenery, WS4, severity 3, effort M, gain +0.5). The far rings are pale, flat stepped slabs at about 86% of sky luminance with painted tree silhouettes (`high/desktop/R13`, `R01`, `R04`). Fix: build the middle and far rings from stepped brick terraces with lit tops and shadowed risers, at least 15% value contrast between faces. Push the haze toward sky hue rather than toward white. Test: in `R13`, the far-ring face/riser luminance ratio is at least 1.15.
2. **G-crew-hides-tub** (readability, WS2/WS6, severity 3, effort M, gain +0.5). At chase distance the four pushers cover most of the tub (`high/desktop/R10`, `R08`, `R12`). Fix: spread the pushers 0.25 m wider, or drop the chase camera's look-at so the tub body and rim show between them, and add a team-colour band to the chassis skirt. Test: at least 30% of the player tub's silhouette pixels are tub colour in `R10`.
3. **G-oot-tub-still-purple** (readability, WS2, severity 3, effort S, gain +0.25). The tie-dye crew's tub body is purple, (86,50,120) in `crops/high/R04-kart_3`, beside the Velvet Mob's in `high/desktop/R07`. Its team-select swatch is teal, (47,179,166) in `high/desktop/R02`. Fix: apply teal to the tub body material, not the rim. Test: the R04-kart_3 body hue is 170–180°.
4. **G-no-ao-no-lamp-pools** (lighting, WS1, severity 3, effort M, gain +0.5). There is no crevice or under-figure occlusion (`crops/high/R03-kart_1`), and the dusk lamps light nothing (`high/desktop/R07`: road (63,45,40) under globes at (230,214,166)). Fix: on high, add SSAO or baked AO on placed buildings and under chassis. At dusk, add warm light pools or decals under each lamp. Test: in `R07`, the asphalt within 2 m of a lamp is at least 25% brighter than the mid-road.
5. **G-flat-facades** (materials, WS1/WS4, severity 3, effort L, gain +0.5). The brick is texture-only on flat walls, and the trees are studless slabs (`high/desktop/R13`, `R10`). Fix: add bevelled corner and lintel parts with specular edges and a normal map with mortar seams. Put studs on tree-plate tops and roof edges near the camera. Test: a highlight runs along the building edges in the `R13` zoom.
6. **G-generic-sphere-fx** (animation, WS3, severity 3, effort M, gain +0.5). The splash and steam are soft spheres (`strips/high/R15` frames 3–6, `strips/high/R14`), and the hot steam reads tan on red brick (`high/desktop/R17`: (215,178,141)). There is no camera kick and no slosh. Fix: use 1×1 round-plate and stud particles that tumble. Make hot steam additive white with a streak trail. Animate the water-surface tilt on accelerate and turn. Test: the water plane tilts across `strips/high/R14`.
7. **G-weak-label-contrast** (typography, WS6, severity 2, effort S, gain +0.25). The selected card's division label is 2.4:1 and "locked" is 2.8:1 (`high/mobile/R02`). Fix: darken the selected card fill or brighten the label to reach at least 4.5:1, and raise "locked" to at least 3:1.
8. **G-landscape-hud-weight** (mobile, WS6, severity 2, effort S, gain +0.25). The left HUD column covers 57% of the landscape height (`high/landscape/R04`). Fix: scale the landscape tiles by 0.8 and merge the water gauge and item tray into one tile. Test: the left column ends above 45% of the height.
9. **G-repeat-storefronts** (scenery, WS4, severity 2, effort M, gain +0.25). The downtown blocks repeat one module (`high/desktop/R13`, `R03`). Fix: add three or four facade variants (cornice, window rhythm, colour), and never place the same variant twice in a row.
10. **G-blank-head-backs** (characters, WS2, severity 2, effort M, gain +0.25). The backs of heads and helmets are blank (`crops/high/R02-preview-rear`). Fix: print hair or helmet straps on the backs, add a mould seam on the torso sides, and give the faces brows and cheek prints.

```json
{
  "loop": 9,
  "role": "critic-claude",
  "tier": "high",
  "scores": {
    "characters": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "crops/high/R02-preview-captain", "note": "original block figure, printed screaming face, printed turnout coat with hydrant badge, mitten hands" },
      { "shot": "crops/high/R02-preview-rear", "note": "backs of heads blank flesh blocks, no hair/strap print" },
      { "shot": "crops/high/R04-kart_3", "note": "expressive scowls and tie-dye prints; hands sink into tub rim" },
      { "shot": "high/desktop/R11", "note": "teams distinct at chase distance by headgear" } ] },
    "materials": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "crops/high/R03-player-rear", "note": "glossy highlights follow helmet curvature" },
      { "shot": "high/desktop/R13", "note": "facade brick is flat texture on box walls; no bevels or seams" },
      { "shot": "high/desktop/R10", "note": "studded baseplate grass, but tree plates studless slabs" } ] },
    "scenery": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R13", "note": "far ring pale flat faces (168,181,189) vs sky (196,218,233), about 86%; repeated brick block modules" },
      { "shot": "high/desktop/R09", "note": "Goat Rock brick outcrop set piece among plate trees" },
      { "shot": "high/desktop/R04", "note": "coherent brick town: baseplate, tile road, awnings, lamps, crowds" } ] },
    "lighting": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R07", "note": "deliberate dusk palette but lamps (230,214,166) cast no pools; road (63,45,40)" },
      { "shot": "high/desktop/R11", "note": "sunset palette with haze" },
      { "shot": "crops/high/R03-kart_1", "note": "no AO under chassis or in crevices" },
      { "shot": "high/desktop/R08", "note": "soft tree shadows on road" } ] },
    "animation": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "strips/high/R15", "note": "flash, splash beads, crew circles tub with swinging limbs; no camera kick visible" },
      { "shot": "strips/high/R16", "note": "crew circle at judge booth, progress bar" },
      { "shot": "strips/high/R14", "note": "steam puffs and charge arc trail from frame 3; spheres, not brick parts" },
      { "shot": "high/desktop/R17", "note": "hot steam reads tan (215,178,141) on red brick" } ] },
    "ui": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R04", "note": "clear HUD hierarchy in one studded-tile style" },
      { "shot": "high/desktop/R01", "note": "brick-tab menu buttons, consistent" },
      { "shot": "high/desktop/R18", "note": "results panel matches HUD style" } ] },
    "typography": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R04", "note": "pixel display face over humanist sans; numerals read at a glance" },
      { "shot": "high/mobile/R02", "note": "selected-card label 2.4:1 and locked label 2.8:1 contrast" },
      { "shot": "high/mobile/R18", "note": "values on one line" } ] },
    "readability": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R07", "note": "Velvet Mob purple tub beside the tie-dye crew's purple tub (154,65,173)" },
      { "shot": "crops/high/R04-kart_3", "note": "tie-dye crew tub body still purple (86,50,120) with teal rim" },
      { "shot": "high/desktop/R10", "note": "crew hide most of the player tub" },
      { "shot": "high/desktop/R13", "note": "gold player ring and arrow stand out; rival rings faint" } ] },
    "mobile": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/mobile/R04", "note": "thumb controls clear of the tub" },
      { "shot": "high/landscape/R04", "note": "left HUD column covers 57% of height" },
      { "shot": "high/mobile/R18", "note": "phone results framed with swatches and check marks" } ] },
    "authenticity": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R05", "note": "Fordyce marquee with ground-floor shop windows" },
      { "shot": "high/desktop/R06", "note": "Arlington twin towers and red roofs" },
      { "shot": "high/desktop/R16", "note": "judge booth, ring-around-the-tub rule" },
      { "shot": "high/desktop/R13", "note": "Bridge Street generic downtown" } ] }
  },
  "ab": {
    "characters": { "winner": "tie", "confidence": 0.6, "pairs": ["ab/crop-R02-preview", "ab/crop-R02-preview-captain", "ab/crop-R03-kart_1", "ab/crop-R03-kart_5", "ab/crop-R04-kart_3"], "note": "figure crops differ by under 2 mean levels; models identical" },
    "materials": { "winner": "tie", "confidence": 0.5, "pairs": ["ab/high-desktop-R05", "ab/high-desktop-R13", "ab/crop-R03-player"], "note": "no material difference visible beyond noise" },
    "scenery": { "winner": "B", "confidence": 0.65, "pairs": ["ab/high-desktop-R05", "ab/high-desktop-R06", "ab/high-desktop-R08"], "note": "B: Fordyce ground floor has shop windows instead of blank bays; darker foothill row in front of the mountain rings" },
    "lighting": { "winner": "B", "confidence": 0.55, "pairs": ["ab/high-desktop-R06", "ab/high-desktop-R09", "ab/high-desktop-R08"], "note": "A shows pale white ledge lines on far hills; B's hazed hills are darker and step down" },
    "animation": { "winner": "B", "confidence": 0.7, "pairs": ["ab/strip-R15", "ab/high-desktop-R15", "ab/crop-R15-player", "ab/strip-R14", "ab/high-desktop-R17"], "note": "B's fumble has flash, call-out and splash at frames 1-2; B's slide steam lays a longer trail; B's hot steam is white rather than orange beads" },
    "ui": { "winner": "B", "confidence": 0.7, "pairs": ["ab/high-mobile-R02", "ab/high-landscape-R02", "ab/high-mobile-R18", "ab/high-desktop-R03"], "note": "B: cleaner landscape team grid, phone results with swatches and one-line values, larger desktop tiles" },
    "typography": { "winner": "B", "confidence": 0.65, "pairs": ["ab/high-landscape-R02", "ab/high-mobile-R02", "ab/high-mobile-R18"], "note": "A breaks 'Out-of- Towners' at a hyphen and orphans '· locked'; A's phone results stack CLEAN pills under values" },
    "readability": { "winner": "B", "confidence": 0.75, "pairs": ["ab/high-desktop-R13", "ab/high-desktop-R17", "ab/crop-R04-player"], "note": "A's player ring takes the team colour (pale blue in R13, pale yellow in R17); B's gold ring stands out" },
    "mobile": { "winner": "B", "confidence": 0.7, "pairs": ["ab/high-mobile-R02", "ab/high-landscape-R02", "ab/high-mobile-R18", "ab/low-mobile-R18"], "note": "B's phone team select and results are framed and clean" },
    "authenticity": { "winner": "B", "confidence": 0.6, "pairs": ["ab/high-desktop-R05", "ab/low-desktop-R05"], "note": "B restores the Fordyce's ground-floor shop windows under the marquee" }
  },
  "ip": { "clean": true, "notes": "Square heads, mitten fists, straight box torsos; no LEGO name or logo. Two-block legs under a hip block are generic, not flagged." },
  "gaps": [
    { "id": "G-hill-rings-cardboard", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R13", "high/desktop/R01", "high/desktop/R04"], "benchmark": "worlds-4", "fix": "Build the middle and far rings as stepped brick terraces with lit tops and shadowed risers (at least 15% value contrast); haze toward sky hue, not white. Test: R13 far-ring face/riser luminance ratio at least 1.15." },
    { "id": "G-crew-hides-tub", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["high/desktop/R10", "high/desktop/R08", "high/desktop/R12"], "benchmark": "drive-3", "fix": "Spread the pushers 0.25 m wider or lower the chase look-at so the tub body and rim show; add a team-colour chassis band. Test: at least 30% of the player tub silhouette pixels are tub colour in R10." },
    { "id": "G-oot-tub-still-purple", "category": "readability", "expectedGain": 0.25, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R04-kart_3", "high/desktop/R07", "high/desktop/R02"], "fix": "Apply teal to the tie-dye crew's tub body material (currently purple (86,50,120) with a teal rim) to match its teal team swatch (47,179,166). Test: R04-kart_3 body hue 170-180 degrees." },
    { "id": "G-no-ao-no-lamp-pools", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R07", "crops/high/R03-kart_1"], "benchmark": "worlds-4", "fix": "Add SSAO or baked AO on high for buildings and under chassis; add warm light pools or decals under dusk lamps. Test: R07 asphalt within 2 m of a lamp at least 25% brighter than mid-road." },
    { "id": "G-flat-facades", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS1", "evidence": ["high/desktop/R13", "high/desktop/R10"], "benchmark": "worlds-1", "fix": "Add bevelled corner and lintel parts with specular edges and a mortar-seam normal map; put studs on tree-plate tops and roof edges near the camera." },
    { "id": "G-generic-sphere-fx", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R15", "strips/high/R14", "high/desktop/R17"], "benchmark": "drive-3", "fix": "Make splash and steam tumbling 1x1 round-plate or stud particles; make hot steam additive white with a streak trail (it reads tan (215,178,141) on red brick); animate water-surface tilt on accelerate and turn. Test: the water plane tilts across strips/high/R14." },
    { "id": "G-weak-label-contrast", "category": "typography", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R02"], "fix": "Raise the selected-card division label from 2.4:1 to at least 4.5:1 and the 'locked' labels from 2.8:1 to at least 3:1." },
    { "id": "G-landscape-hud-weight", "category": "mobile", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R04", "high/landscape/R08"], "fix": "Scale landscape HUD tiles by 0.8 and merge the water gauge and item tray; the left column should end above 45% of the height (now 57%)." },
    { "id": "G-repeat-storefronts", "category": "scenery", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R13", "high/desktop/R03"], "benchmark": "worlds-1", "fix": "Add three or four downtown facade variants (cornice, window rhythm, colour) and never place the same variant twice in a row." },
    { "id": "G-blank-head-backs", "category": "characters", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R02-preview-rear", "crops/high/R02-preview-captain"], "benchmark": "drive-4", "fix": "Print hair or helmet straps on head backs, add a torso-side mould seam, and add brow and cheek prints to faces." }
  ]
}
```
