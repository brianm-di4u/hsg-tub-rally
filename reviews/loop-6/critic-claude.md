# Critic A (critic-claude), loop 6: Spa City Tub Rally, high tier

## Verdict
The figures and tubs are now good brick toys. Glossy moulded helmets, crisp printed faces and uniforms, shaded chassis studs and hubcapped wheels hold up at 2× (`crops/high/R02-preview-captain`, `crops/high/R04-kart_3`), and the menus and HUD share one slate-and-brick style. The world around them does not match that finish. Trees are matte green slabs with no studs, bevels or specular (`high/desktop/R04`). Buildings are brick textures on flat boxes, with opaque blue windows that each carry one diagonal stripe (`high/desktop/R13`). The road is plain grey tiles. Dusk and sunset are still murky: 21.9% of the central frame in `high/desktop/R07` is below luma 40, and the street lamps light nothing on the ground. Packs dissolve into a mass of crew bodies in which you cannot pick out individual tubs (`high/desktop/R04`, `high/desktop/R11`). Motion has good particle content (water spheres, steam puffs, crews circling the tub) but no camera kick and no visible water slosh. Close-ups also show a stair-stepped grey smear behind the wheels (`crops/high/R04-player`, `crops/high/R03-kart_5`). On the high desktop tier I score it 66/100. Five categories reach their gate (characters, ui, typography, mobile, authenticity) and five do not (materials, scenery, lighting, animation, readability).

## Scores (high tier, desktop; phone frames for mobile and readability)

**Characters: 7.0.** The figures are original and read as plastic toys. They have square heads with rounded edges, printed faces with real expression (the captain shouting in `crops/high/R02-preview-captain`, angry brows on the antenna-cap team in `crops/high/R04-kart_3`) and printed uniforms (firefighter X-straps with reflective bands and a hydrant badge, the tie-dye team, the gold-piped white team in `crops/high/R03-kart_5`). The tubs are built from parts: a dark chassis plate with shaded studs, chunky tyres with hubcaps, a coloured tub with a rim, a flag and a duck (zoom of `crops/high/R03-kart_1`). Teams are distinct at chase distance (`high/desktop/R04`, `high/mobile/R04`). Against `drive-4` (9.5) there are no part seams or mould lines at the neck, shoulder or hip. The firefighter helmets have no studs. The towel in `crops/high/R02-preview-rear` is a flat white card that passes through the fist instead of being gripped. This sits at the 7 anchor, not above it.

**Materials: 6.0.** The figures, helmets and tubs are convincing ABS. Highlights follow the helmet brim and tub rim (`crops/high/R02-preview-captain`), the chassis studs are shaded (`crops/high/R03-kart_1`) and the grass baseplate has real shaded studs (`high/desktop/R08`, bottom-left). Everything else reads as painted card:
- Tree canopies are flat two-tone slabs with no studs, bevels or specular (`high/desktop/R04`, left; `high/desktop/R11`, right).
- Facades are brick images on flat walls, and the windows are opaque blue panels with one painted diagonal stripe, not clear parts (`high/desktop/R13`, `high/desktop/R05`).
- Road tiles are matte with no seams.
- Behind the wheels in `crops/high/R04-player` and `crops/high/R03-kart_5`, a grey, translucent, stair-stepped smear looks like a rendering artefact, not a plastic effect.

It falls short of `worlds-1` (7), where every surface is plastic.

**Scenery: 6.5.** The world is blocky and cohesive. It has stepped conifers, studded verges, tiled sidewalks, fence rails, striped awnings and lamp posts, plus dense crowds along Central Avenue (`high/desktop/R03`, `high/desktop/R04`). The horizon ridges carry stepped tree crowns and fade into haze (`high/desktop/R05`, `high/desktop/R09`). Goat Rock is built from brick-textured prisms (`high/desktop/R09`). Against `worlds-1` and `worlds-4`:
- The buildings are boxes with a texture, not brick builds.
- The storefront modules repeat identically down the right side of `high/desktop/R03`.
- Hill Wheatley Plaza is an almost empty brick-textured disc (`high/desktop/R17`).
- The mountain courses `high/desktop/R08`, `R10`, `R11` and `R12` are interchangeable conifer roads with no set piece.

**Lighting: 6.0.**
- What works: day frames have a clear key light with crisp cast shadows (the tree shadows on the plaza in `high/desktop/R19`, the booth shadow in `high/desktop/R16`), and the horizon rings now haze toward the sky colour (`high/desktop/R05`).
- Dusk (`high/desktop/R07`): 21.9% of the central frame is below luma 40 and the frame mean is 71.5. The globe lamps glow, but there are no light pools on the sidewalk or road.
- Sunset (`high/desktop/R11`): 13.7% of the centre is below luma 40, and the trees and pack turn brown-black.
- AO and fill: there is no visible ambient occlusion where the walls meet the ground, under the tree canopies or between the crew figures (`high/desktop/R04`). Fill light is flat, with no bounce colour.

It is below `worlds-4` (7). There is nothing of the photographed-toy light in `bj-1`.

**Animation and feel: 6.5.**
- Fumble, `strips/high/R15`: the crew run around the tub with toy-limb swings, and blue water spheres burst out and settle over frames 3–8.
- Judge stop, `strips/high/R16`: the crew circle the tub while the "RING AROUND THE TUB!" bar fills.
- Power slide, `strips/high/R14`: the slide throws white puff clusters and blue droplets. A boost trails steam puffs (`high/desktop/R19`, white; `high/mobile/R17`, orange).
- Missing for the 7 anchor: none of the 8 strip frames shows camera kick or squash, and the water plane inside the tub stays flat and level through the fumble in `strips/high/R15` (no slosh).
- The stepped grey smear noted under Materials is the wheel trail at close range.

The effects are below `drive-3` (8.5).

**UI / HUD: 7.0.** There is one style throughout. The lap, place, water gauge and minimap sit on matching slate tiles. The menus use stud-row headers and orange brick buttons (`high/desktop/R01`, `high/desktop/R02`), the results table is clean (`high/desktop/R18`), and callouts are slate plates (`high/desktop/R16`, `high/desktop/R17`). The hierarchy is clear: the place readout is the largest element, top-right.

Weak points against `drive-3`:
- The item orb floats unframed in the sky at top centre, and the "▮ 0" counter beside it has no label (`high/desktop/R04`).
- The bottom-left key strip ("Towel Bath Soap Loofah") uses roughly 10 px labels on desktop and adds clutter without explaining itself.
- The desktop team select uses less than half the screen width, with about 10 px sub-labels (`high/desktop/R02`).

**Typography: 7.0.** The pixel display face (gradient fill, dark outline) is used for the title, place, lap, READY and RESULTS. A rounded sans is used for body text. Together they form a clear scale (`high/desktop/R01`, `high/mobile/R01`, `high/mobile/R18`). The numerals in "0:07.00" and "8TH" read at a glance at 390 px (`high/mobile/R04`), and the results table at 390 px is legible with nothing clipped (`high/mobile/R18`). The "×3" item badge is white on a dark badge and readable (`high/mobile/R17`). Against this, the desktop key strip and the team-select sub-labels are small (about 10 px), and the locked-team labels are low-contrast grey on blue (`high/desktop/R02`). The 8-bit face also sits a little oddly against the glossy toy look.

**Readability: 6.5.** The player's tub always stands out: a thick yellow ring plus a yellow arrow marker (`high/desktop/R04`, `high/mobile/R04`). Road edges are bright white lines, and the bubble pickups read as pale spheres (`high/desktop/R10`, `high/desktop/R11`). The judge stop has a booth and a sign (`high/desktop/R16`). In every pack frame, though, the rival tubs are hidden behind their four-figure crews, so you read crowds, not tubs (`high/desktop/R04`, `high/desktop/R12`, `high/mobile/R04`). At dusk the pack is a dark mass (`high/desktop/R07`, `high/mobile/R07`). This is below the anchor "every tub reads in every frame" and well below `drive-3` (9).

**Mobile: 7.0.**
- Portrait (`high/mobile/R04`, `high/mobile/R17`): the thumb controls occupy the bottom quarter and never reach the tub (the ring bottom is at about y = 1120 and the controls start at about y = 1425 of 1688). The minimap tile sits clear on the right.
- Landscape (`high/landscape/R04`): the controls sit in the corners and the tub is centred. The team select fits, with the whole preview tub to the right of a panel that ends at about x = 1075 of 1688 (`high/landscape/R02`).
- Performance: the swiftshader phone floor holds 50 fps minimum, which clears the 30 fps bar.
- Costs: the portrait top HUD stack fills the top 24% of the screen (to about y = 400 of 1688). The item orb butts against the place tile with no gap: its rim tucks about 5 device px under the tile (measured in `high/mobile/R04`).

**Authenticity: 6.5.**
- The Row: the Fordyce has its tan, patterned facade, red roof and teal skylight (`high/desktop/R05`), and the Arlington's twin towers close the vista (`high/desktop/R06`).
- The real race: gallon water gauges, ducks, flags, judge stops with a Rules-of-the-Row heat, CLEAN water results and a water fight at the plaza (`high/desktop/R16`, `high/desktop/R18`, `high/desktop/R17`).
- The ridges read as wooded hills (`high/desktop/R09`).
- But a local could not name `high/desktop/R08`, `R10`, `R11` or `R12` from the frame. Bridge Street (`high/desktop/R13`) is one generic brick block, and the plaza has no identifying features.

## IP check
Clean. The figures have square, edge-rounded heads (not cylinders), rectangular box torsos (not trapezoids) and mitten fists with a thumb (not C-hands) (`crops/high/R02-preview-captain`, `crops/high/R15-player`). I found no LEGO name or logo in any capture. The spectators now wear brimmed caps (`high/desktop/R03` zoom: green cap, green shirt; `high/desktop/R15`: purple cap), and I found no square-head, brown-hair, cyan-shirt figure. The red firefighter helmet (crest, brim, front shield) follows real-world helmet design, not a copied toy part.

## Ranked gaps
1. **G-world-plastic-trees** (materials; WS5; severity 3; effort M; expected gain +0.5 materials, +0.5 scenery). Tree canopies are matte two-tone slabs (`high/desktop/R04`, `high/desktop/R11`). Rebuild them as stacked bevelled plates with stud tops, using the same glossy material as the figures. Test: in an `R04` crop, the canopy shows specular highlights along its edges and studs on its top faces.
2. **G-facade-relief-glass** (materials/scenery; WS4; severity 3; effort L; expected gain +0.5 materials). Facades are flat brick images, and the windows are opaque blue with a painted stripe (`high/desktop/R13`, `high/desktop/R05`). Add brick-seam normal or bevel relief, recessed panes with a translucent glass material that reflects the sky, and stud rows on the cornices. Test: in the `R13` close view, the windows show depth and the brick courses catch light.
3. **G-dusk-light-pools** (lighting; WS1; severity 3; effort S; expected gain +0.5). In `high/desktop/R07`, 21.9% of the centre is below luma 40 and the lamps light nothing. Add light pools or decals under each lamp, and raise the dusk hemisphere fill. Test: under 10% of the R07 centre below luma 40, and visible lit ellipses on the sidewalk.
4. **G-ambient-occlusion** (lighting; WS1; severity 3; effort M; expected gain +0.5). There is no darkening at the wall–sidewalk junctions, under canopies or between crew figures (`high/desktop/R04`). Add SSAO on high, or baked AO on static props. Test: a visible gradient at the base of the stone wall in R04.
5. **G-pack-tub-read** (readability; WS1/WS6; severity 3; effort M; expected gain +0.5). Rival tubs vanish behind their crews in packs (`high/desktop/R04`, `high/desktop/R12`, `high/mobile/R04`). Add a team-coloured rim light or outline on the tub shell, or raise the chase camera's pitch a few degrees. Test: every rival tub shell is visible in R04 and R07.
6. **G-steam-smear** (animation/materials; WS3; severity 3; effort S; expected gain +0.3). A stair-stepped grey translucent band trails the wheels (`crops/high/R04-player`, `crops/high/R03-kart_5`). Replace it with round puff meshes, or soft depth-faded sprites. Test: the close-up crop has no stepped band.
7. **G-slosh-kick** (animation; WS3; severity 3; effort M; expected gain +0.5). The water plane stays flat through the fumble (`strips/high/R15`), and none of the 8 strip frames shows camera kick. Tilt and wave the water plane with acceleration, and add a short camera shake on a fumble or slide release. Test: the water surface angle changes between `strips/high/R15` frames.
8. **G-course-set-pieces** (authenticity/scenery; WS4; severity 2; effort L; expected gain +0.5). `high/desktop/R08`, `R10`, `R11` and `R12` are interchangeable. Give each course a brick-built landmark in frame (for example a tower, an overlook railing or the park gate). Test: each frame contains a unique hero prop.
9. **G-hud-orb-tile** (ui; WS6; severity 2; effort S; expected gain +0.3). The item orb floats unframed, and its "▮ 0" counter has no label (`high/desktop/R04`). Seat the orb and counter on a slate tile and label the counter. Raise the desktop key labels from about 10 px to at least 13 px. Test: no unframed HUD element remains in R04.
10. **G-plaza-props** (scenery; WS4; severity 2; effort M; expected gain +0.3). Hill Wheatley Plaza is a bare brick disc (`high/desktop/R17`). Add fountains, planters and benches as brick builds.
11. **G-part-seams-grip** (characters; WS2; severity 2; effort M; expected gain +0.3). There are no seams at the neck, shoulder or hip, and the held towel passes through the fist (`crops/high/R02-preview-rear`). Add seam grooves and a C-free gripping hand pose. Test: the 2× close-up shows the seams and no intersection.

## A/B (judged on what each pair shows; mean absolute difference per pair computed over the matched panels)
- **characters: tie (0.7).** In `crop-R02-preview`, `crop-R02-preview-captain`, `crop-R03-kart_1`, `crop-R03-kart_5` and `crop-R04-kart_3`, the mean difference is 0.2–1.7/255 and at most 3.1% of pixels change. `crop-R04-player` and `crop-R15-player` differ only in pose and timing.
- **materials: tie (0.6).** Same pairs. I see no surface change.
- **scenery: A (0.75).** In `high-desktop-R09`, `high-desktop-R05`, `high-desktop-R19` and `high-mobile-R04`, A's ridges carry a stepped conifer tree line and graded haze. B's ridges are bare, with a dark olive near ring.
- **lighting: A (0.8).** In `high-desktop-R11`, A's mean luma is 68.6 against B's 57.3, and A is warmer and less murky. In `low-desktop-R11` the figures are 96.3 against 89.5. In `high-desktop-R05` and `high-desktop-R09`, the haze gradient sits better with the sky in A.
- **animation: A (0.55).** `high-desktop-R19` and `high-desktop-R17` show steam puffs trailing the tub in A (white and orange) and none in B. The strips (`strip-R14`, `strip-R15`, `strip-R16`) are otherwise near-identical.
- **ui: A (0.8).**
  - Minimap: A puts it on a slate tile, where B has a bare outline (`high-desktop-R08`, `high-desktop-R11`, `high-desktop-R12`, `high-desktop-R17`).
  - Item count: A has a "×3" badge where B has a faint dark "x3" (`high-desktop-R17`).
  - Callouts: A uses a consistent slate plate where B uses a teal bar (`high-desktop-R19`).
- **typography: A (0.6).** `high-desktop-R17` and `high-mobile-R17`: A's white "×3" on a dark badge reads, while B's dark "x3" dissolves into the orb.
- **readability: A (0.6).** In `strip-R16`, B frames 5–6 show a large ring arc on the road with no tub, and A has none. A's tiled minimap reads more clearly (`high-mobile-R04`).
- **mobile: A (0.85).**
  - Landscape team select (`high-landscape-R02`, `low-landscape-R02`): A's panel covers about 62% of the width and the whole tub shows. B's panel covers about 75% and the tub is cut off at the right edge.
  - Portrait (`high-mobile-R03`, `high-mobile-R04`, `high-mobile-R17`): A's water gauge has a clear gap below the lap tile, where B's is tucked under it.
- **authenticity: A (0.55).** `high-desktop-R09` and `high-desktop-R05`: A's wooded ridges read more like the Ouachitas.

```json
{
  "loop": 6,
  "role": "critic-claude",
  "tier": "high",
  "scores": {
    "characters": {
      "score": 7.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "crops/high/R02-preview-captain", "note": "printed shouting face, printed uniform with hydrant badge, glossy helmet and tub rim; holds at 2x" },
        { "shot": "crops/high/R04-kart_3", "note": "distinct team: antenna caps, tie-dye print, angry brows; studded chassis and hubcap wheels" },
        { "shot": "crops/high/R03-kart_1", "note": "shaded chassis studs, duck, flag; no part seams or mould lines anywhere" },
        { "shot": "crops/high/R02-preview-rear", "note": "held towel is a flat card passing through the fist" },
        { "shot": "high/desktop/R04", "note": "teams distinct at chase distance by uniform and hat" }
      ]
    },
    "materials": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "crops/high/R02-preview-captain", "note": "convincing ABS on figures and tub: highlights follow the bevels" },
        { "shot": "high/desktop/R08", "note": "grass baseplate has shaded studs" },
        { "shot": "high/desktop/R04", "note": "tree canopies are matte two-tone slabs: no studs, bevels or specular" },
        { "shot": "high/desktop/R13", "note": "facades are flat brick images; windows opaque blue with a painted diagonal stripe" },
        { "shot": "crops/high/R04-player", "note": "stair-stepped grey translucent smear behind the wheels" }
      ]
    },
    "scenery": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/desktop/R03", "note": "dense crowds, awnings, fences; storefront modules repeat identically on the right" },
        { "shot": "high/desktop/R09", "note": "Goat Rock built from brick prisms; ridges with stepped conifer tree line" },
        { "shot": "high/desktop/R17", "note": "Hill Wheatley Plaza is an almost empty brick-textured disc" },
        { "shot": "high/desktop/R12", "note": "mountain and park courses are interchangeable conifer roads with no set piece" }
      ]
    },
    "lighting": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R19", "note": "clear key light with crisp tree shadows on the plaza" },
        { "shot": "high/desktop/R07", "note": "21.9% of the centre below luma 40; lamps glow but cast no light pools" },
        { "shot": "high/desktop/R11", "note": "13.7% of the centre below luma 40; pack and trees go brown-black" },
        { "shot": "high/desktop/R04", "note": "no visible AO at wall/ground junctions, under canopies or between figures" },
        { "shot": "high/desktop/R05", "note": "horizon rings haze toward the sky colour" }
      ]
    },
    "animation": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "strips/high/R15", "note": "crew circle the tub with limb swings; water spheres burst and settle; tub water plane stays flat (no slosh)" },
        { "shot": "strips/high/R16", "note": "crew circle the tub at the judge stop while the progress bar fills" },
        { "shot": "strips/high/R14", "note": "slide throws puff clusters and droplets; no camera kick in any of the 8 frames" },
        { "shot": "high/desktop/R19", "note": "boost trails white steam puffs" }
      ]
    },
    "ui": {
      "score": 7.0,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "lap, place, water and minimap share slate tiles; item orb floats unframed with an unlabelled counter; ~10 px key strip" },
        { "shot": "high/desktop/R01", "note": "brick buttons with studs, consistent with the HUD" },
        { "shot": "high/desktop/R18", "note": "clean results table on a stud-row panel" },
        { "shot": "high/desktop/R02", "note": "team select uses under half the width; small sub-labels" }
      ]
    },
    "typography": {
      "score": 7.0,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/mobile/R01", "note": "pixel display face plus rounded sans form a clear scale at 390 px" },
        { "shot": "high/mobile/R18", "note": "results legible at 390 px, nothing clipped" },
        { "shot": "high/mobile/R17", "note": "white x3 badge readable" },
        { "shot": "high/desktop/R02", "note": "about 10 px sub-labels; low-contrast locked labels" }
      ]
    },
    "readability": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/mobile/R04", "note": "player ring and arrow stand out; rival tubs hidden behind their crews" },
        { "shot": "high/desktop/R07", "note": "pack becomes a dark mass at dusk" },
        { "shot": "high/desktop/R12", "note": "road edges bright; pack reads as a crowd, not as tubs" },
        { "shot": "high/desktop/R16", "note": "judge stop reads: booth plus sign" }
      ]
    },
    "mobile": {
      "score": 7.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/mobile/R04", "note": "controls start at ~y=1425 and the tub ring ends at ~y=1120; top HUD stack fills 24% of the height; orb rim tucks ~5 device px under the place tile" },
        { "shot": "high/landscape/R04", "note": "controls in the corners, tub centred, minimap tile clear" },
        { "shot": "high/landscape/R02", "note": "panel ends ~x=1075 of 1688; whole preview tub visible" },
        { "shot": "high/mobile/R02", "note": "portrait team select framed on purpose" }
      ]
    },
    "authenticity": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R05", "note": "Fordyce facade, roof and skylight recognisable" },
        { "shot": "high/desktop/R06", "note": "Arlington twin towers close the vista" },
        { "shot": "high/desktop/R16", "note": "judge stop, Rules of the Row heat" },
        { "shot": "high/desktop/R10", "note": "generic conifer road; not nameable by a local" }
      ]
    }
  },
  "ab": {
    "characters": { "winner": "tie", "confidence": 0.7, "pairs": ["crop-R02-preview", "crop-R02-preview-captain", "crop-R03-kart_1", "crop-R03-kart_5", "crop-R04-kart_3", "crop-R04-player", "crop-R15-player"], "note": "mean difference 0.2-1.7/255; player crops differ only in pose and timing" },
    "materials": { "winner": "tie", "confidence": 0.6, "pairs": ["crop-R03-kart_5", "crop-R02-preview", "crop-R03-player"], "note": "no surface change visible" },
    "scenery": { "winner": "A", "confidence": 0.75, "pairs": ["high-desktop-R09", "high-desktop-R05", "high-desktop-R19", "high-mobile-R04"], "note": "A ridges carry a stepped conifer tree line and graded haze; B ridges bare with a dark near ring" },
    "lighting": { "winner": "A", "confidence": 0.8, "pairs": ["high-desktop-R11", "low-desktop-R11", "high-desktop-R05", "high-desktop-R09"], "note": "R11 mean luma A 68.6 vs B 57.3; A warmer and less murky" },
    "animation": { "winner": "A", "confidence": 0.55, "pairs": ["high-desktop-R19", "high-desktop-R17", "strip-R14", "strip-R15", "strip-R16"], "note": "A trails steam puffs in R19 and R17; strips near-identical" },
    "ui": { "winner": "A", "confidence": 0.8, "pairs": ["high-desktop-R08", "high-desktop-R11", "high-desktop-R12", "high-desktop-R17", "high-desktop-R19"], "note": "A: minimap on a slate tile, x3 badge, slate callout plates; B: bare minimap outline, teal callout" },
    "typography": { "winner": "A", "confidence": 0.6, "pairs": ["high-desktop-R17", "high-mobile-R17"], "note": "A's white x3 on a dark badge reads; B's dark x3 dissolves into the orb" },
    "readability": { "winner": "A", "confidence": 0.6, "pairs": ["strip-R16", "high-mobile-R04", "high-desktop-R12"], "note": "B strip-R16 frames 5-6 show a ring arc with no tub; A minimap on a tile reads more clearly" },
    "mobile": { "winner": "A", "confidence": 0.85, "pairs": ["high-landscape-R02", "low-landscape-R02", "high-mobile-R03", "high-mobile-R04", "high-mobile-R17"], "note": "A landscape panel ~62% of width with the whole tub visible, B ~75% with the tub cut off; B water gauge tucked under the lap tile" },
    "authenticity": { "winner": "A", "confidence": 0.55, "pairs": ["high-desktop-R09", "high-desktop-R05"], "note": "A's wooded ridges read more like the Ouachitas" }
  },
  "ip": { "clean": true, "notes": "Square, edge-rounded heads, box torsos and mitten fists: no minifigure silhouette. No LEGO name or logo. Spectators wear caps; no square-head, brown-hair, cyan-shirt figure found." },
  "gaps": [
    { "id": "G-world-plastic-trees", "category": "materials", "expectedGain": 1.0, "severity": 3, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R04", "high/desktop/R11"], "benchmark": "worlds-1", "fix": "Rebuild the tree canopies as stacked bevelled plates with stud tops in the figures' glossy material; test: an R04 crop shows edge highlights and studs on the canopies." },
    { "id": "G-facade-relief-glass", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R13", "high/desktop/R05"], "benchmark": "worlds-1", "fix": "Add brick-seam normal or bevel relief, recessed translucent glass panes reflecting the sky, and stud rows on the cornices; test: R13 windows show depth and brick courses catch light." },
    { "id": "G-dusk-light-pools", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/mobile/R07"], "benchmark": "worlds-4", "fix": "Add light pools or decals under the lamps and raise the dusk hemisphere fill; test: under 10% of the R07 centre below luma 40, with visible lit ellipses on the sidewalk." },
    { "id": "G-ambient-occlusion", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R04", "high/desktop/R16"], "benchmark": "worlds-4", "fix": "Add SSAO on the high tier or baked AO on static props; test: a visible darkening gradient at the base of the stone wall and under canopies in R04." },
    { "id": "G-pack-tub-read", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R04", "high/desktop/R12", "high/mobile/R04", "high/desktop/R07"], "benchmark": "drive-3", "fix": "Add a team-coloured rim light or outline on the tub shells, or raise the chase camera's pitch; test: every rival tub shell is visible in R04 and R07." },
    { "id": "G-steam-smear", "category": "animation", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS3", "evidence": ["crops/high/R04-player", "crops/high/R03-kart_5"], "benchmark": "drive-3", "fix": "Replace the stepped grey trail with round puff meshes or soft depth-faded sprites; test: the close-up crop shows no stair-stepped band." },
    { "id": "G-slosh-kick", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R15", "strips/high/R14"], "benchmark": "drive-3", "fix": "Tilt and wave the tub water plane with acceleration, and add a short camera shake on a fumble or slide release; test: the water angle changes across strip frames." },
    { "id": "G-course-set-pieces", "category": "authenticity", "expectedGain": 0.5, "severity": 2, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R08", "high/desktop/R10", "high/desktop/R11", "high/desktop/R12"], "benchmark": "drive-5", "fix": "Give each mountain or park course a brick-built landmark in frame; test: each of these frames contains a unique hero prop." },
    { "id": "G-hud-orb-tile", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/mobile/R04"], "benchmark": "drive-3", "fix": "Seat the item orb and counter on a slate tile, label the counter, and raise the desktop key labels to at least 13 px; test: no unframed HUD element remains in R04." },
    { "id": "G-plaza-props", "category": "scenery", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R17"], "benchmark": "worlds-1", "fix": "Add a brick-built fountain, planters and benches to Hill Wheatley Plaza." },
    { "id": "G-part-seams-grip", "category": "characters", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R02-preview-rear", "crops/high/R02-preview-captain"], "benchmark": "drive-4", "fix": "Add seam grooves at the neck, shoulders and hips, and a gripping hand pose so held items no longer intersect the fist; test: the 2x close-up shows seams and no intersection." }
  ]
}
```
