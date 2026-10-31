# Critic A (critic-claude): loop 7 review, high tier

## Verdict
Spa City Tub Rally now reads as a toy world in its best frames. The racers are original, expressive brick figures with printed uniforms. They push tubs built from recognisable parts, and the HUD and menus share one slate-and-stud style that holds up on phones. The weak areas are the environment and the light. The horizon is still a regular wallpaper of triangle "crowns" on cliff-sided columns. Large lawns lose their studs and render as flat green. Goat Rock's boulders are skinned with a masonry-wall texture. The Gulpha Creek ford is see-through and reads as grey paving, not water. The dusk lamp pools light the sidewalk rather than the lane, so the pack turns to mush at Park Avenue. In the strips the slide, fumble and judge-stop actions read, but the effects are small sphere clusters with no measurable camera kick. Against `worlds-1` the figures and UI are at the bar, while materials, scenery, lighting, animation and readability sit half a point under it. The A/B pairs favour **A** clearly on scenery, UI and mobile and moderately on lighting, readability and animation. Characters and typography are a tie.

## Scores

**Characters: 7.0.** The close-ups hold up. In `crops/high/R02-preview-captain` the captain has a printed open-mouth shout, a printed zip and hydrant badge on the jacket, and hi-vis cuffs. The crew have printed grins, two studs on each helmet and a framed badge. The tub has a gold rim, gold claw feet on a studded black chassis plate, and hubbed wheels. `crops/high/R04-kart_3` (tie-dye team with antennae, angry printed brows) and `crops/high/R03-kart_5` (towel-turban team, white enamel tub) show that teams are characters, not recolours. At chase distance in `high/desktop/R03`, `high/desktop/R07` and `high/desktop/R12`, the firefighters, tie-dye, cowboys, white towels and pink team separate at a glance. This meets the 7 anchor. It is held below 7.5 by three things:
- Faint vertical streaking on the tub enamel. On the inner wall band of `crops/high/R02-preview-captain`, horizontal gradient energy is 2.28 against 1.64 vertical, and the white body in `crops/high/R03-kart_5` shows visible banding.
- Arms and legs are plain single blocks with no shoulder or hip piece.
- Faces are dot eyes and a mouth only, far from the printed detail and visor sheen of `drive-4`.

Spectators (`high/desktop/R03` right sidewalk, `high/desktop/R18`) are a much lower tier of figure.

**Materials: 6.5.** Good: helmets, ducks and tubs show plastic specular that follows the bevels (`crops/high/R03-player`, `crops/high/R15-player`). Near slopes carry readable studs (`high/desktop/R08` left bank, `high/desktop/R10`). Brick courses show on facades (`high/desktop/R05`), and tub water now has ripple glints and shows the captain's torso through it (`crops/high/R02-preview-captain`). Against `worlds-1` (7), where every lawn is a shaded studded baseplate, it falls short in four places:
- The Arlington lawn in `high/desktop/R06` is flat colour even in the foreground. Mean horizontal luminance gradient there is 0.27, against 1.49 on the studded bank in `high/desktop/R08`.
- Goat Rock (`high/desktop/R09`) is wedge solids wrapped in a white masonry brick-wall texture, so it reads as stone walls, not slope bricks.
- The ford in `high/desktop/R19` is see-through to a grey bed. Mean RGB is (132,138,143), essentially neutral, so it reads as a paved square.
- The horizon hills are a painted triangle pattern, not plastic.

**Scenery: 6.5.** Every course has its own set: the Row with bathhouses and Central Avenue's brick commercial blocks and awnings (`high/desktop/R04`, `high/desktop/R14`), conifer forest and Goat Rock (`high/desktop/R09`), the tiled summit road (`high/desktop/R10`), the Whittington park (`high/desktop/R12`), the brick plaza (`high/desktop/R17`) and the ford (`high/desktop/R19`). The rebuilt horizon is a real improvement: overlapping forested hills with valleys and depth (`high/desktop/R05`, `high/desktop/R17`). Zoomed, though, it is a grid of identical stepped triangles on vertical cliff faces (`high/desktop/R03` sky band, 3× crop). In `high/desktop/R06` the left third of the frame is one uninterrupted triangle wall above a featureless lawn. The R19 embankment is a smooth ribbed facet slope that is not brick-built. Open areas are sparsely propped compared with `worlds-1` (7.5), and nowhere near the density of `drive-1`.

**Lighting: 6.5.** The day frames have a clean key light, readable tree and building shadows (`high/desktop/R08`, `high/desktop/R10`), dark contact shadows under the chassis (`crops/high/R02-preview`), and haze on the hill rings that matches the sky. Dusk and sunset have their own palettes (`high/desktop/R07`, `high/desktop/R11`). It falls short of `worlds-4` (7) in three ways:
- At dusk the racing lane stays dark while the lamp pools land on the sidewalk. In `high/desktop/R07` the player crew and tub region averages L 57.6 against 46.5 on the near road, while the sidewalk pool reads 136.6. The pack is a low-contrast clump.
- Sunset (`high/desktop/R11`) is mostly a peach sky over dark trees, with no warm rim on the figures (crew region L 59.1).
- There is no bounce colour, and AO is only faintly visible in crevices. Nothing reads as a photographed toy.

**Animation: 6.5.** In `strips/high/R15` the crew breaks off and runs around the tub with swinging rigid limbs (correct for this look) while water spheres burst out of the tub. In `strips/high/R16` the circuit continues while the judge's progress bar fills. In `strips/high/R14` the crew leans into the slide, puffs appear by frame 3, and the new charge arc fills blue and then white. Against the 7 anchor and `drive-3` (8.5), three things are missing:
- I measured the vertical scene shift across the fumble frames of `strips/high/R15` at ±1 px at strip scale, so no camera kick is visible on the hit.
- Slide "steam" is small clumps of white spheres that read as bubbles, not plumes (`strips/high/R14`, `high/desktop/R19` "WARM STEAM").
- Nothing pops off and snaps back. The slosh is visible only as a tilted tub in `crops/high/R04-player`.

**UI: 7.0.** The hierarchy is clear: lap and time top-left, place large top-right, the item plus "TICKETS" on one slate tile top-centre, water gauge and item legend bottom-left, minimap bottom-right (`high/desktop/R03`, `high/desktop/R17`). Menus share studded buttons and stud-topped panels (`high/desktop/R01`, `high/desktop/R02`, `high/desktop/R18`). Against `drive-3` and `drive-2` (8.5) it falls short in three ways:
- The HUD tiles are plain slate rectangles with no brick cue, unlike the menus.
- Nothing is animated or context-aware in the frames.
- In `high/landscape/R17` the "HOT STEAM!" banner collides with the item tile. The tile body ends at y≈139, a dark edge sits at 142–145 and the banner rim starts at 148, so the tile's bottom bevel is covered.

**Typography: 7.0.** The pixel display face (logo, LAP, time, place, READY, CHOOSE YOUR TEAM, RESULTS) and the rounded sans UI face form a clear scale (`high/desktop/R01`, `high/desktop/R18`). Numerals read instantly at 390 px (`high/mobile/R07`: "0:06.00", "8TH"). It stays at 7 because of three small items:
- The new "TICKETS" label is about 7 px cap height on desktop (`high/desktop/R17`, 4× crop).
- The "CLEAN" chips in `high/desktop/R18` are similarly tiny.
- "Steer" sits inside the top rim of the pad in landscape (`high/landscape/R17`) but below it in portrait (`high/mobile/R07`).

The pixel face is more arcade than brick, though it suits the stepped hills.

**Readability: 6.5.** The player ring and triangle marker make the player's tub stand out in every day frame (`high/desktop/R04`, `high/desktop/R13`). Road edges have white lines, item bubbles pop against the road (`high/desktop/R10`, `high/desktop/R17`), and the judge stop is unmistakable (`high/desktop/R16`). It fails the "every tub, every frame" clause at dusk. In `high/desktop/R07` and `high/mobile/R07` the 8-tub pack is one dark mass, with crew and road differing by only about 11 L. In the busy pack of `high/desktop/R04` the rival tubs merge into a column of heads. That is below `drive-3` (9).

**Mobile: 7.0.** Portrait and landscape are both framed on purpose. The tub sits mid-frame and clear of the steer pad and the Item/Hop/Brake/Push cluster (`high/mobile/R04`, `high/landscape/R04`, `high/landscape/R08`). The HUD gutters are fixed in this build (`ab/high-mobile-R04`, `ab/high-landscape-R04`). The phone proxy holds 51 fps minimum on SwiftShader. It stays at 7 for three reasons:
- In landscape the left HUD column covers y 22–435 of 780 (`high/landscape/R17`), and the transient banner collides with the item tile.
- The team-select panel in `high/mobile/R02` runs flush to the bottom edge: its border ends at y 1684–1687 of 1688, with no safe-area margin.
- Portrait spends roughly a quarter of its height on the top HUD.

**Authenticity: 7.0.** The Arlington closes the vista and is unmistakable: twin towers, green domes, red roofs, arcaded base (`high/desktop/R06`). The Fordyce reads, with its patterned upper storeys, green canopy and glass roof lantern (`high/desktop/R05`). The Row and Central Avenue commercial blocks read as Hot Springs (`high/desktop/R04`, `high/desktop/R14`). The real race shows in the rubber duck, flag, water gauge, judges and Rules of the Row (`high/desktop/R16`, `crops/high/R02-preview-captain`), and the forested rings now read as the Ouachitas. Two things hold it back:
- The Gulpha Creek ford reads as a paved square, not a creek (`high/desktop/R19`).
- Goat Rock's brick-wall texture undercuts the novaculite outcrop (`high/desktop/R09`).

## IP check
Clean. The heads are rounded cubes on a short neck, not cylinders. The hands are rounded mitten blocks, not C-shaped (`crops/high/R02-preview-captain`, `crops/high/R15-player`). The torsos are straight-sided boxes, not trapezoids (`crops/high/R03-player-rear`). I found no LEGO name, logo or stud lettering in any frame or menu. Studs on buttons and helmets are generic.

## A/B comparison
- **Scenery: A, 0.9.** A has layered forested hills, where B has flat pale walls (`ab/high-desktop-R02`, `ab/high-desktop-R05`, `ab/high-desktop-R06`, `ab/high-desktop-R09`, `ab/high-desktop-R12`, `ab/low-desktop-R06`).
- **UI: A, 0.8.** A's item and tickets share one tile. B has a floating bubble plus a chip, and in portrait the bubble overlaps the place tile (`ab/high-desktop-R03`, `ab/high-mobile-R04`).
- **Mobile: A, 0.85.** B's water gauge overlaps the lap tile, and its minimap overlaps the place tile (`ab/high-landscape-R04`, `ab/low-landscape-R04`, `ab/high-mobile-R04`).
- **Lighting: A, 0.7.** A has darker chassis shadows and no stair-step band on the road beside the tubs, which B shows (`ab/crop-R03-kart_5`, `ab/crop-R04-player`, `ab/crop-R02-preview`). A's road is brighter at dusk: panel mean L 76.9 against 73.4 (`ab/high-desktop-R07`).
- **Readability: A, 0.65.** In B, near canopies intrude on the frame edge (`ab/high-desktop-R04`, `ab/high-desktop-R11`, `ab/high-desktop-R19`).
- **Animation: A, 0.65.** A has the slide-charge arc (`ab/strip-R14`) and a lean and slosh pose (`ab/crop-R04-player`). R15 and R16 are a tie.
- **Materials: A, 0.6.** A has ripple glints and see-through water (`ab/crop-R02-preview-captain`). B's ford reads more like water (`ab/high-desktop-R19`).
- **Authenticity: A, 0.6.** A's forested Ouachita ridges are better, but its ford is worse (`ab/high-desktop-R06`, `ab/high-desktop-R19`).
- **Characters: tie, 0.6.** The models are identical.
- **Typography: tie, 0.55.**

## Ranked gaps
1. **G-dusk-lane-light** (lighting, WS1; severity 4, effort M, gain +0.5)
   - Defect: at dusk the lamp pools land on the sidewalk, not the lane. In `high/desktop/R07` the crew region averages L 57.6 against 46.5 on the road.
   - Fix: offset the pools toward the lane, or add a warm fill and rim on karts at dusk and sunset. Target crew-to-road luminance ≥ 1.6:1 in R07 and R11.
2. **G-dusk-pack-separation** (readability, WS1; severity 4, effort S, gain +0.5)
   - Defect: the pack is a single dark mass in `high/desktop/R07` and `high/mobile/R07`.
   - Fix: give each tub's ring a low emissive at dusk and a team-coloured rim term on figures. Every tub in R07 should be separable at 390 px.
3. **G-horizon-wallpaper** (scenery, WS4; severity 3, effort M, gain +0.5)
   - Defect: the hill rings are a regular grid of identical triangles on cliff-sided columns (`high/desktop/R03`, `high/desktop/R06`).
   - Fix: randomise crown scale and offset per row, break the vertical faces with sloped plate steps, and put real instanced conifers on the near ring. No identical crown pattern should repeat within 150 px at 1280 wide.
4. **G-camera-kick-and-effects** (animation, WS3; severity 3, effort M, gain +0.5)
   - Defect: the vertical shift across the `strips/high/R15` fumble is ±1 px (strip scale), and the steam puffs are small sphere clumps (`strips/high/R14`).
   - Fix: raise the impact pitch kick to 3–4° with roughly 150 ms decay. Make the steam plumes larger, stud-shaped and growing. Add a parts-pop effect on fumble, where hat or plate pieces fly off and snap back.
5. **G-ford-reads-as-paving** (materials, WS1; severity 3, effort S, gain +0.3)
   - Defect: the ford's mean RGB in `high/desktop/R19` is (132,138,143), neutral grey.
   - Fix: add depth absorption toward teal, an edge foam line and ripple rings around wading tubs, and stronger fresnel at the chase-cam angle. Target B − R ≥ 30 on the ford.
6. **G-flat-lawns** (materials, WS1; severity 3, effort S, gain +0.3)
   - Defect: the foreground lawn in `high/desktop/R06` has a gradient energy of 0.27, against 1.49 on the studded `high/desktop/R08` bank.
   - Fix: extend the stud normal or LOD distance, or add baseplate seams to big lawns, so studs read to about 60 m.
7. **G-masonry-rocks** (materials, WS4; severity 2, effort M, gain +0.3)
   - Defect: the Goat Rock boulders carry a brick-wall texture (`high/desktop/R09`).
   - Fix: rebuild the rocks from slope and wedge bricks with stud tops and plate steps, with no course texture.
8. **G-hud-brick-cue** (ui, WS6; severity 2, effort S, gain +0.3)
   - Defect: the HUD tiles are plain slate (`high/desktop/R03`), while the menus carry studs.
   - Fix: add a stud row or brick-tile edge to the HUD tiles and animate the place tile on change.
9. **G-landscape-banner-collision** (ui, WS6; severity 2, effort S, gain +0.25)
   - Defect: in `high/landscape/R17` the event banner covers the item tile's bottom bevel (y≈142).
   - Fix: place transient banners at least 8 px below the item tile, or in the lower-centre band.
10. **G-portrait-bottom-safe-area** (mobile, WS6; severity 2, effort S, gain +0.2)
    - Defect: the team-select panel in `high/mobile/R02` ends at y 1687 of 1688.
    - Fix: pad by env(safe-area-inset-bottom) + 16 px.
11. **G-tub-enamel-streaks** (characters, WS2; severity 2, effort S, gain +0.2)
    - Defect: vertical streaks on the tub's inner wall and the white body (`crops/high/R02-preview-captain`, `crops/high/R03-kart_5`).
    - Fix: fix the stretched UVs or normal map on the tub shell so the enamel shades smoothly in close-up.

```json
{
  "loop": 7,
  "role": "critic-claude",
  "tier": "high",
  "scores": {
    "characters": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "crops/high/R02-preview-captain", "note": "printed shouting face, zip and hydrant print, studded helmets, claw-foot tub; faint vertical streaks on enamel inner wall (h-grad 2.28 vs v 1.64)" },
      { "shot": "crops/high/R04-kart_3", "note": "tie-dye team with antennae and angry printed brows: distinct character" },
      { "shot": "crops/high/R03-kart_5", "note": "towel-turban team; faint banding on white tub body" },
      { "shot": "high/desktop/R03", "note": "teams distinct at chase distance; spectators far simpler" } ] },
    "materials": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "crops/high/R03-player", "note": "plastic specular follows bevels on helmets, duck, tub" },
      { "shot": "high/desktop/R06", "note": "foreground lawn flat, gradient energy 0.27 vs 1.49 on studded R08 bank" },
      { "shot": "high/desktop/R09", "note": "Goat Rock boulders wrapped in masonry brick-wall texture" },
      { "shot": "high/desktop/R19", "note": "ford mean RGB (132,138,143): reads as grey paving, not water" },
      { "shot": "high/desktop/R08", "note": "near studded bank reads well" } ] },
    "scenery": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R05", "note": "layered forested hills behind the Fordyce; flat lawn" },
      { "shot": "high/desktop/R03", "note": "3x crop: identical stepped triangles on cliff-sided columns" },
      { "shot": "high/desktop/R06", "note": "left third is one uninterrupted triangle wall over featureless lawn" },
      { "shot": "high/desktop/R09", "note": "dense brick conifer forest, studded ground" },
      { "shot": "high/desktop/R19", "note": "smooth ribbed embankment, not brick-built" } ] },
    "lighting": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R07", "note": "crew region L 57.6 vs road 46.5; sidewalk lamp pool 136.6; lane stays dark" },
      { "shot": "high/desktop/R11", "note": "peach sky, dark trees, no warm rim on figures (crew L 59.1)" },
      { "shot": "high/desktop/R10", "note": "clean key light and tree shadows on the tile road" },
      { "shot": "crops/high/R02-preview", "note": "dark contact shadow under chassis" } ] },
    "animation": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "strips/high/R15", "note": "crew circles tub, water spheres burst; vertical scene shift only +/-1 px: no visible camera kick" },
      { "shot": "strips/high/R14", "note": "lean into slide, charge arc fills blue to white; puffs are small sphere clumps" },
      { "shot": "strips/high/R16", "note": "judge-stop circuit with progress bar reads" },
      { "shot": "crops/high/R04-player", "note": "tilted tub, only slosh read" } ] },
    "ui": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R03", "note": "clear hierarchy; item and tickets on one slate tile; HUD tiles lack brick cue" },
      { "shot": "high/desktop/R18", "note": "studded results board and brick buttons consistent with menus" },
      { "shot": "high/landscape/R17", "note": "HOT STEAM banner (rim from y 148) covers item tile bottom bevel (body ends y 139)" },
      { "shot": "high/desktop/R01", "note": "studded brick buttons, coherent title menu" } ] },
    "typography": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R01", "note": "pixel display face and sans UI face form a clear scale" },
      { "shot": "high/mobile/R07", "note": "LAP, time and place numerals read at 390 px" },
      { "shot": "high/desktop/R17", "note": "TICKETS label about 7 px cap height" },
      { "shot": "high/desktop/R18", "note": "CLEAN chips tiny" } ] },
    "readability": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R07", "note": "dusk pack is one dark mass; crew vs road about 11 L apart" },
      { "shot": "high/mobile/R07", "note": "same mush on the phone" },
      { "shot": "high/desktop/R17", "note": "item bubble and player ring read clearly" },
      { "shot": "high/desktop/R16", "note": "judge stop unmistakable" },
      { "shot": "high/desktop/R04", "note": "rival tubs merge into a column of heads" } ] },
    "mobile": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/mobile/R04", "note": "tub mid-frame, clear of controls; HUD gutters respected" },
      { "shot": "high/landscape/R08", "note": "controls clear of tub; left HUD column large" },
      { "shot": "high/landscape/R17", "note": "banner collides with item tile" },
      { "shot": "high/mobile/R02", "note": "team panel flush to bottom edge (border y 1684-1687 of 1688)" } ] },
    "authenticity": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R06", "note": "Arlington twin towers and domes close the vista" },
      { "shot": "high/desktop/R05", "note": "Fordyce patterned storeys, canopy and lantern roof; forested Ouachita ridges" },
      { "shot": "high/desktop/R16", "note": "judges, flag, duck, Rules of the Row" },
      { "shot": "high/desktop/R19", "note": "Gulpha Creek ford reads as a paved square" } ] }
  },
  "ab": {
    "characters": { "winner": "tie", "confidence": 0.6, "pairs": ["ab/crop-R03-kart_1", "ab/crop-R03-kart_5", "ab/crop-R03-player-rear", "ab/crop-R02-preview-captain"], "note": "identical figure and tub models" },
    "materials": { "winner": "A", "confidence": 0.6, "pairs": ["ab/crop-R02-preview-captain", "ab/crop-R02-preview", "ab/high-desktop-R19"], "note": "A water has ripple glints and see-through; B ford reads more like water" },
    "scenery": { "winner": "A", "confidence": 0.9, "pairs": ["ab/high-desktop-R02", "ab/high-desktop-R05", "ab/high-desktop-R06", "ab/high-desktop-R09", "ab/high-desktop-R12", "ab/high-desktop-R17", "ab/low-desktop-R06"], "note": "A layered forested hills vs B flat pale walls" },
    "lighting": { "winner": "A", "confidence": 0.7, "pairs": ["ab/crop-R03-kart_5", "ab/crop-R04-player", "ab/crop-R02-preview", "ab/high-desktop-R07", "ab/low-desktop-R07"], "note": "B shows stair-step light band beside tubs; A darker chassis shadow, brighter dusk road (L 76.9 vs 73.4)" },
    "animation": { "winner": "A", "confidence": 0.65, "pairs": ["ab/strip-R14", "ab/strip-R15", "ab/strip-R16", "ab/crop-R04-player"], "note": "A slide-charge arc and lean/slosh pose; R15/R16 tie" },
    "ui": { "winner": "A", "confidence": 0.8, "pairs": ["ab/high-desktop-R03", "ab/high-mobile-R04", "ab/high-landscape-R04"], "note": "A unified item+tickets tile; B floating bubble overlaps place tile" },
    "typography": { "winner": "tie", "confidence": 0.55, "pairs": ["ab/high-desktop-R18", "ab/high-landscape-R18", "ab/high-desktop-R03"] },
    "readability": { "winner": "A", "confidence": 0.65, "pairs": ["ab/high-desktop-R04", "ab/high-desktop-R11", "ab/high-desktop-R19"], "note": "B near canopies intrude on frame edges" },
    "mobile": { "winner": "A", "confidence": 0.85, "pairs": ["ab/high-mobile-R04", "ab/high-landscape-R04", "ab/low-landscape-R04"], "note": "B water gauge overlaps lap tile, minimap overlaps place tile, item bubble overlaps place tile" },
    "authenticity": { "winner": "A", "confidence": 0.6, "pairs": ["ab/high-desktop-R06", "ab/high-desktop-R05", "ab/high-desktop-R19"], "note": "A ridges read as Ouachitas; B ford reads more like a creek" }
  },
  "ip": { "clean": true, "notes": "Rounded-cube heads, mitten hands, straight-sided box torsos; no LEGO name or logo in any frame or menu." },
  "gaps": [
    { "id": "G-dusk-lane-light", "category": "lighting", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/desktop/R11"], "benchmark": "worlds-4", "fix": "Offset dusk lamp pools onto the lane or add a warm kart fill and rim at dusk and sunset; target crew-to-road luminance >= 1.6:1 in R07 and R11 (now 57.6 vs 46.5)." },
    { "id": "G-dusk-pack-separation", "category": "readability", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/mobile/R07"], "benchmark": "drive-3", "fix": "Low emissive on each tub ring at dusk plus a team-coloured rim term on figures; every tub in R07 separable at 390 px." },
    { "id": "G-horizon-wallpaper", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R03", "high/desktop/R06"], "benchmark": "drive-1", "fix": "Randomise crown scale and offset per row, break cliff faces with sloped plate steps, use instanced conifers on the near ring; no identical crown pattern repeating within 150 px at 1280 wide." },
    { "id": "G-camera-kick-and-effects", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R15", "strips/high/R14"], "benchmark": "drive-3", "fix": "Impact pitch kick 3-4 deg with ~150 ms decay (measured +/-1 px now); larger stud-shaped steam plumes that grow; parts-pop effect on fumble (hat or plate pieces fly off and snap back)." },
    { "id": "G-ford-reads-as-paving", "category": "materials", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R19"], "benchmark": "bj-2", "fix": "Teal depth absorption, edge foam line, ripple rings around wading tubs, stronger fresnel at the chase-cam angle; ford mean B-R >= 30 (now 11)." },
    { "id": "G-flat-lawns", "category": "materials", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R06", "high/desktop/R05"], "benchmark": "worlds-1", "fix": "Extend stud normal/LOD distance or add baseplate seams so studs read to ~60 m; R06 foreground gradient energy should approach the R08 bank (1.49, now 0.27)." },
    { "id": "G-masonry-rocks", "category": "materials", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R09"], "benchmark": "drive-5", "fix": "Rebuild Goat Rock from slope and wedge bricks with stud tops and plate steps instead of a brick-course texture." },
    { "id": "G-hud-brick-cue", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R03", "high/desktop/R17"], "benchmark": "drive-3", "fix": "Stud row or brick-tile edge on HUD tiles to match the menus; animate the place tile on change." },
    { "id": "G-landscape-banner-collision", "category": "ui", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R17"], "benchmark": "drive-3", "fix": "Place transient event banners >= 8 px below the item tile (or in the lower-centre band) in landscape." },
    { "id": "G-portrait-bottom-safe-area", "category": "mobile", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R02"], "benchmark": "drive-2", "fix": "Pad the team-select panel by env(safe-area-inset-bottom) + 16 px; it now ends at y 1687 of 1688." },
    { "id": "G-tub-enamel-streaks", "category": "characters", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R02-preview-captain", "crops/high/R03-kart_5"], "benchmark": "drive-4", "fix": "Fix stretched UVs or normal map on the tub shell so enamel shades smoothly in close-up (inner-wall h-gradient 2.28 vs v 1.64 now)." }
  ]
}
```
