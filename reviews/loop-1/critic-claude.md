# Critic A (critic-claude): loop 1, tier high

## Verdict
This build has moved from a low-poly N64 town to an early brick toy, but only where the camera is close to a tub. Native resolution, studded baseplate verges, tile seams, a real sun shadow map, and figures with printed faces and bevelled parts make the crews and tubs read as plastic toys in the close-ups (`crops/high/R03-kart_1`, `crops/high/R03-kart_5`). Everything else is the old town with a new shader. The facades are painted boxes, and the trees and crowds are painted sprites that turn into smeared, stair-stepped cut-outs whenever they come near the camera (`high/desktop/R08`, `R11`, `R14`). The changelog promises slide spray and steam, but none of it shows in `strips/high/R14`. Crews pass through each other, and the judge stop has no judge. The HUD behaves well on desktop, but it is styled as a retro pixel and web UI rather than a brick world, and in phone landscape the timer collides with the water gauge. No category reaches its gate of 7. Total 58.5/100.

## Scores (high tier, desktop; phone frames for mobile and readability)

### Characters: 6.0
- **Works:** `crops/high/R02-preview`, `crops/high/R03-kart_1`, `crops/high/R03-kart_5` and `crops/high/R04-kart_3` show rounded-cube heads with four printed expressions (frown, smile, grin, "o"). The uniforms are printed on the front (suspenders, badge, collar V), the hands are mitten blocks, and every part is bevelled. Each tub is a bowl with a studded rim, a studded grey chassis plate, tyred wheels, a two-piece duck and a flag. Hat shapes (antennae, chef toque, beret bun, firefighter cap, campaign hat) separate the teams at chase distance (`high/desktop/R12`, `high/desktop/R04`).
- **The hero tub fails close-up:** in `crops/high/R02-preview-captain` the yellow rim breaks into a sawtooth of flat triangles. The rim studs float as loose octagonal discs above and outside the lip, and the water is a flat cyan slab.
- **Backs and seams:** in `crops/high/R02-preview-rear` and `crops/high/R03-player-rear` the torso backs are blank black slabs. There are no part seams or mould lines anywhere, and the tyre silhouettes are visibly faceted (`crops/high/R02-preview`).
- **Two near-identical teams:** the grey-shirt/tan-hat team and the white-shirt/brown-hat team both wear campaign hats and are hard to tell apart (`high/desktop/R09`, `high/desktop/R03` left).
- **Benchmarks:** about level with `worlds-1` (6.5 for characters) and far from `drive-4` (9.5): no print detail beyond the basics, no gloss gradient across the faces.

### Materials: 5.5
- **Works:** the studs are shaded on the green slope in `high/desktop/R08` and on the verges in `R10` and `R12`. Road plate seams and sidewalk tiles show in `R04`. Specular highlights follow the bevels on the tub bowls (`crops/high/R03-kart_5`, `crops/high/R03-kart_1`).
- **Facades:** they are still painted textures. The Fordyce in `high/desktop/R05` is flat, and the Arlington's window grid in `high/desktop/R06` reads as noise. The promised brick courses can't be read at play distance (`high/desktop/R13`).
- **Sprites clash with the models:** the tree and crowd sprites are low-resolution paintings with stair-stepped alpha (`high/desktop/R11`: the right 40% of the frame is a smeared canopy). This is word for word the anchor-5 clause "textures from a different style than the models".
- **Glare on large planes:** large flat planes blow out to white, with sheen streaks on the asphalt in `high/desktop/R13` and a hotspot at the bottom right of the plaza in `high/desktop/R17`.
- **Benchmark:** against `worlds-1` (7), where studs, bricks and fences are geometry everywhere, the studs here exist only on the ground.

### Scenery: 5.5
- **Works:** the ground is now baseplate and the roads are tiles (`high/desktop/R08`, `R10`, `R12`, `R04`), and the landmarks are recognisable (`R05`, `R06`).
- **Buildings:** they are boxes with painted fronts. The plaza buildings in `high/desktop/R17` look like thin, tilted cards around an empty terracotta floor.
- **Trees and crowds:** they are painted sprites that dominate any frame where they are close (`high/desktop/R08` left third, `R11` right 40%, `R18` left).
- **Mountain roads:** in `high/desktop/R09` and `R10` they are grey studded baseplate, so the road reads as an unbuilt plate.
- **Benchmarks:** this is close to the anchor-5 text ("a coherent low-poly town that isn't built from bricks; trees and crowds are flat sprites"), plus two of the 7-anchor items (baseplate ground, tile roads). It is far from `drive-1` and `worlds-1`, where props, fences and foliage are brick-built.

### Lighting: 6.0
- **Works:** soft-edged sun shadows ground every tub and crew (`high/desktop/R03`, `R04`, `R13`, `R14`). In the dusk frame `high/desktop/R07` the lamp globes glow and cast warm pools on the sidewalk. `R11` has a pink sunset haze. Day, dusk and sunset palettes are distinct.
- **No ambient occlusion:** there is none at building bases (`R05`, `R13`), at crew-to-tub contacts, or under awnings.
- **Haze:** it is thin; the far end of `R04` has little aerial perspective.
- **Dusk crew:** in `R07` the player's dark crew sits on a dark road with no rim or bounce light.
- **Specular hotspot:** the plaza floor in `R17` blows out to white.
- **Benchmarks:** below `worlds-4` (sun glow and atmosphere) and far from the studio falloff of `bj-3`.

### Animation and feel: 5.5
- **Works:** in `strips/high/R15` the crew run a circuit around the tub with rigid leg and arm swings, which reads clearly and is correct for a toy. In `strips/high/R16` they circle the tub at the judge stop while the progress bar fills.
- **Power slide:** in `strips/high/R14` the tub yaws and skids into the curb, but none of the 8 frames shows wheel spray, steam or a charge-stage colour. A zoom on the tub in `high/desktop/R14` shows nothing either. There is no camera kick, and one crew figure swings almost horizontal in frames 2–4.
- **Clipping:** crew members pass through each other in `strips/high/R15` frames 2, 6 and 7. In `strips/high/R16` frames 4–8 a rival crew in white runs straight through the player's crew.
- **No water slosh** appears in any capture.
- **Benchmark:** far below `drive-3`, where every effect is readable.

### UI / HUD: 6.0
- **Works:** the hierarchy in `high/desktop/R04` is clear (lap and time top-left, item and coins top-centre, place top-right, water and items bottom-left, minimap bottom-right), and nothing overlaps on desktop. The judge callout in `R16` is clear. In `R18` the results are clean and the race HUD is correctly hidden. `R02` now frames the tub on the right. The `R01` menu is consistent.
- **Theme:** navy panels, orange web buttons and pixel numerals read as a generic arcade or web UI, not part of the brick world (compare `drive-2` and `drive-3`).
- **Small text:** the item labels are about 9–10 px at 1280 (`R04` bottom-left).
- **Water gauge:** its "10" tick collides with the panel edge.

### Typography: 6.0
- **Works:** the pixel display face (title, READY, LAP, place) and the rounded sans for the UI form a clear two-face scale (`high/desktop/R01`, `R18`). The open zeros make the timer read cleanly (`R04` "0:07.00"), and "1 lap" is now singular.
- **Subtitle:** on desktop `R01` it leaves "Arkansas" alone on the second line.
- **Small item labels** on desktop.
- **Clipped timer in landscape:** the water-gauge panel overprints the timer digits (`high/landscape/R04`, `high/landscape/R17`).
- **Style clash:** the 8-bit face is at odds with the glossy plastic world.

### Readability: 6.0
- **Works:** road edges and lane lines are obvious and shadows make the tubs pop (`high/desktop/R03`, `R04`, `R12`). The iridescent soap-bubble pickups read in every frame they appear (`R10`, `R11`, `R17`). On portrait the player's tub sits clear of the controls (`high/mobile/R04`).
- **No player marker** in packs (`R04`, `R12`).
- **Dusk:** dark crew on dark asphalt (`R07`).
- **Foreground trees:** in `R11` a sprite tree covers about 40% of the frame.
- **Frame edge:** in `R09` a rival alongside is half cut off by the edge of the frame and runs under the minimap.
- **Judge stop:** it is marked only by a blue board and a white line (`R16`); no judge figure.

### Mobile: 6.0
- **Works:** in portrait the HUD is at the top, the controls at the bottom, and the tub is centred and never covered (`high/mobile/R04`, `high/mobile/R17`). The landscape title with menu side by side works (`high/landscape/R01`), and the landscape results are compact (`high/landscape/R18`). The phone proxy holds 30 fps (swiftshader, low, mobile: 66 fps minimum).
- **Landscape overlaps:** the timer overlaps the water gauge (`high/landscape/R04`, `high/landscape/R17`), and the minimap sits bottom-centre, directly under the tub in the play area.
- **Team select hides the tub:** on portrait the panel covers the whole screen and the tub is invisible (`high/mobile/R02`). On landscape it covers about 70% and the tub is cropped to a shoulder (`high/landscape/R02`).

### Authenticity: 6.0
- **Works:**
  - The Arlington's twin towers are recognisable (`high/desktop/R06`), and the Fordyce keeps its colours and patterning (`R05`).
  - The real race shows: duck, flag, water gauge and the towel, bath, soap and loofah items on every tub (`R04`), plus the Rules of the Row task callout (`R16`).
  - The pines and blue ridge in `R08` read as the Ouachitas, and `R11` has a lattice tower on the ridge.
- **No judges** at the judge stop (`strips/high/R16`).
- **Arlington windows:** the grid is noise, not its regular bays (`R06`).
- **Vista:** in `R04` the Central Avenue view doesn't end on the Arlington.
- **Gulpha Gorge:** `R09` shows no water at the ford and no readable Goat Rock.
- **Bridge Street:** `R13` is a generic corner.

## IP check
Clean. Heads are rounded cubes, not cylinders. Hands are mitten blocks, not C-shapes. Torsos are straight boxes, not trapezoids (`crops/high/R02-preview`, `crops/high/R03-kart_5`). No stud carries lettering, and there is no LEGO name or logo in any frame, menu or results screen.

## A/B verdicts
A is better in all 10 categories:
- **Characters:** printed faces, bevels and studded tubs against B's faceless flat boxes and pinwheel wheels.
- **Materials:** shaded studs and tiles against a blurred noise texture.
- **Lighting:** a real shadow map and lamp pools in `ab/high-desktop-R07`.
- **UI and mobile:** the layout fits in landscape for R01, R02 and R18, while B's menus and results run off-screen and B leaves the HUD and controls visible under results.
- **Animation:** A's crew circle the tub in `ab/strip-R16`, while B's stand in formation.
- **Typography:** open zeros, a clean outlined subtitle (B shows a doubled ghost shadow in `ab/high-mobile-R01`), and "1 lap" against "1 laps".
- **Scenery and authenticity:** these are the closest calls. B's orange dirt mountain roads in `ab/high-desktop-R09` and `R10`, and its red brick sidewalks, carry more local surface identity than A's grey studded plates, but B is blurred throughout.

## Ranked gaps
1. **G-sprite-foliage-crowds** (WS5, scenery, severity 4, effort L, +1.0)
   - **Defect:** the painted tree and crowd sprites are blurry and stair-stepped near the camera (`high/desktop/R11`, `R08`, `R14`, `R18`).
   - **Fix:** replace the trees with 3–4 brick-built instanced trees (round-brick trunks, stacked plate and slope canopies). Replace the crowds with instanced low-poly brick figures that reuse the crew parts, with 2 LODs.
   - **Interim fix:** stop drawing sprites within 15 m of the camera and use alpha-to-coverage.
   - **Test:** no sprite texel is magnified above 1:1 in `R08` or `R11`.
2. **G-facade-geometry** (WS4, scenery, severity 4, effort L, +0.75)
   - **Defect:** facades are painted boxes (`R05`, `R13`, `R17`).
   - **Fix:** model inset window frames, sill and cornice plates, and sloped awnings as separate bevelled parts. Make the brick courses readable at 10 m. Give the plaza buildings real depth.
   - **Test:** `R13` shows window reveals casting shadow.
3. **G-slide-effects-missing** (WS3, animation, severity 4, effort S, +0.75)
   - **Defect:** no spray, steam or charge colour appears in any frame of `strips/high/R14`.
   - **Fix:** check that the emitters spawn in the capture rig and that the particles aren't culled. Make the puffs at least 20 px at 1280, behind the rear wheels, tinted by charge stage. Add a short FOV kick of about +3° on release.
   - **Test:** frames 3–8 of `strips/high/R14` show particles.
4. **G-ao-and-highlights** (WS1, lighting, severity 3, effort M, +0.75)
   - **Defect:** there is no occlusion anywhere, and the large planes blow out to white (`R13` road sheen, `R17` hotspot).
   - **Fix:** add SSAO or baked vertex AO on buildings and figure joints, and clamp Fresnel and specular on large ground planes.
   - **Test:** building bases and tub undersides darken, and no `R17` floor pixel exceeds 95% luminance.
5. **G-crew-separation** (WS3, animation, severity 3, effort M, +0.5)
   - **Defect:** figures pass through each other (`strips/high/R15` frames 2, 6, 7; `strips/high/R16` frames 4–8).
   - **Fix:** offset the circling crew by 360/n degrees on a radius wider than two body widths, and add separation steering between crews of different tubs.
   - **Test:** no two figures overlap in any strip frame.
6. **G-tub-rim-closeup** (WS2, characters, severity 3, effort S, +0.5)
   - **Defect:** the rim breaks into a sawtooth and its studs float (`crops/high/R02-preview-captain`).
   - **Fix:** build the rim as one bevelled lathe ring and seat the studs on its top normal. Bevel the water edge.
   - **Test:** that crop shows a continuous lip with every stud touching it.
7. **G-figure-backs-seams** (WS2, characters, severity 3, effort M, +0.5)
   - **Defect:** the torso backs are blank and there are no part seams (`crops/high/R02-preview-rear`, `crops/high/R03-player-rear`).
   - **Fix:** print the backs (crossed suspenders, team number), add a darker seam line at the head/torso/hip/leg joints, and use 16+ segments on the tyres.
8. **G-landscape-hud-overlap** (WS6, mobile, severity 3, effort S, +0.5)
   - **Defect:** the timer overlaps the gauge, and the minimap sits under the tub (`high/landscape/R04`, `high/landscape/R17`).
   - **Fix:** leave an 8 px gap between the timer and the gauge, and move the minimap to the top right, under the place indicator.
   - **Test:** no two HUD bounding boxes intersect, and none falls inside the tub's screen box.
9. **G-team-select-phone** (WS6, mobile, severity 3, effort M, +0.5)
   - **Defect:** the tub can't be seen on phone team select (`high/mobile/R02`, `high/landscape/R02`).
   - **Fix:** in portrait, put a tub preview in the top 35% above a scrolling 3×4 grid. In landscape, split grid and preview 55/45.
   - **Test:** the whole tub is visible in both captures.
10. **G-judges-missing** (WS4, authenticity, severity 3, effort M, +0.5)
    - **Defect:** there is no judge at the judge stop (`strips/high/R16`).
    - **Fix:** place 1–2 brick judges in striped shirts with clipboards at every stop, with a check gesture when the task completes.
11. **G-player-marker** (WS6, readability, severity 3, effort S, +0.5)
    - **Defect:** the player's tub merges into the pack and is dark at dusk (`R04`, `R07`, `R12`).
    - **Fix:** add a team-colour pennant or chevron above the player's tub and a rim light on the player's crew at dusk.
    - **Also:** recolour one of the two campaign-hat teams (`R09`).
12. **G-hud-brick-theme** (WS6, ui, severity 2, effort M, +0.5)
    - **Defect:** the HUD reads as a web or arcade UI (`R04`, `R18`).
    - **Fix:** style the panels as bevelled tiles with a stud row and the buttons as 1×4 bricks. Make item labels at least 12 px at 1280.
13. **G-type-polish** (WS6, typography, severity 2, effort S, +0.5)
    - **Defects:** the desktop subtitle on `R01` breaks badly, and the 8-bit face clashes with the plastic world.
    - **Fix:** use text-wrap: balance on the subtitle, and swap the 8-bit display face for a heavy rounded face with a printed or embossed treatment. Keep the open-zero numerals.
14. **G-studded-roads** (WS4, scenery, severity 2, effort S, +0.25)
    - **Defect:** the mountain roads are studded baseplate (`R09`, `R10`).
    - **Fix:** use smooth tiles on all drivable surfaces, with tan or orange dirt tiles for gravel and the ford, and keep studs off-road. Show water at the Gulpha ford.

```json
{
  "role": "critic-claude",
  "loop": 1,
  "tier": "high",
  "scores": {
    "characters": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "crops/high/R03-kart_5", "note": "Rounded-cube heads, four printed expressions, front-printed uniforms, bevelled parts, studded rim and chassis, two-piece duck"},
        {"shot": "crops/high/R02-preview-captain", "note": "Rim breaks into a sawtooth of triangles; rim studs float off the lip; water is a flat slab"},
        {"shot": "crops/high/R03-player-rear", "note": "Torso backs blank; no part seams or mould lines"},
        {"shot": "high/desktop/R09", "note": "Two campaign-hat teams near-identical at chase distance"}
      ]
    },
    "materials": {
      "score": 5.5,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/desktop/R08", "note": "Shaded studs on the green slope; tile seams on the road"},
        {"shot": "high/desktop/R11", "note": "Sprite trees are smeared low-res paintings with stair-stepped alpha, a different style from the models"},
        {"shot": "high/desktop/R06", "note": "Arlington facade is a painted noise texture; no plastic or brick read"},
        {"shot": "high/desktop/R17", "note": "Plaza floor blows out to a white hotspot; card-like facades"}
      ]
    },
    "scenery": {
      "score": 5.5,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/desktop/R12", "note": "Baseplate verges and tile road; trees are painted sprites"},
        {"shot": "high/desktop/R17", "note": "Empty terracotta plaza ringed by thin tilted facade cards"},
        {"shot": "high/desktop/R10", "note": "Mountain road is a grey studded plate"},
        {"shot": "high/desktop/R13", "note": "Buildings are painted boxes, no brick geometry"}
      ]
    },
    "lighting": {
      "score": 6.0,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R07", "note": "Lamp globes glow with warm pools; dark crew on dark road, no rim light"},
        {"shot": "high/desktop/R04", "note": "Soft sun shadows ground the tubs; thin haze; no AO"},
        {"shot": "high/desktop/R11", "note": "Distinct pink sunset palette"},
        {"shot": "high/desktop/R13", "note": "Glossy white sheen streaks across the asphalt"}
      ]
    },
    "animation": {
      "score": 5.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "strips/high/R14", "note": "Tub slides into the curb; no spray, steam or charge colour in any frame; no camera kick"},
        {"shot": "strips/high/R15", "note": "Crew circle the tub with rigid toy limb swing; figures interpenetrate in frames 2, 6 and 7"},
        {"shot": "strips/high/R16", "note": "Crew circle at the judge stop; a rival crew runs through the player's crew in frames 4-8"}
      ]
    },
    "ui": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Clear HUD hierarchy with no overlap; item labels about 9-10 px"},
        {"shot": "high/desktop/R18", "note": "Clean results with the HUD hidden; generic navy and orange web styling"},
        {"shot": "high/desktop/R02", "note": "Team select frames the tub on the right"}
      ]
    },
    "typography": {
      "score": 6.0,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R01", "note": "Clear pixel display plus sans scale; subtitle leaves 'Arkansas' alone on line 2"},
        {"shot": "high/landscape/R04", "note": "Timer digits overprinted by the water-gauge panel"},
        {"shot": "high/desktop/R18", "note": "Results table legible; '1 lap' singular"}
      ]
    },
    "readability": {
      "score": 6.0,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Road edge and lane lines obvious; player tub has no marker in the pack"},
        {"shot": "high/desktop/R07", "note": "Dark crew on dark road at dusk"},
        {"shot": "high/mobile/R04", "note": "Tub sits clear of the controls; pickups read"},
        {"shot": "high/desktop/R16", "note": "Judge stop marked only by a board and a line; no judge figure"}
      ]
    },
    "mobile": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/mobile/R04", "note": "Portrait framed on purpose; thumb controls never cover the tub"},
        {"shot": "high/landscape/R17", "note": "Timer overlaps the gauge; minimap sits bottom-centre under the tub"},
        {"shot": "high/mobile/R02", "note": "Team-select panel covers the screen; tub invisible"},
        {"shot": "high/landscape/R02", "note": "Panel covers about 70%; tub cropped to a shoulder"}
      ]
    },
    "authenticity": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R06", "note": "Arlington twin towers recognisable; window grid is noise"},
        {"shot": "high/desktop/R05", "note": "Fordyce colours and patterning recognisable"},
        {"shot": "strips/high/R16", "note": "Rules of the Row task shown, but no judges"},
        {"shot": "high/desktop/R09", "note": "No ford water or readable Goat Rock"}
      ]
    }
  },
  "ab": {
    "characters": {"winner": "A", "confidence": 0.9, "pairs": ["ab/crop-R02-preview", "ab/crop-R02-preview-captain", "ab/crop-R03-kart_5", "ab/crop-R04-kart_3", "ab/crop-R04-player"], "note": "A has printed faces, bevelled parts, studded tubs and real tyres; B has faceless flat boxes and pinwheel wheels"},
    "materials": {"winner": "A", "confidence": 0.85, "pairs": ["ab/high-desktop-R08", "ab/high-desktop-R12", "ab/crop-R03-kart_1", "ab/high-desktop-R10"], "note": "A has shaded studs, tile seams and bevel highlights; B is a blurred noise texture"},
    "scenery": {"winner": "A", "confidence": 0.65, "pairs": ["ab/high-desktop-R08", "ab/high-desktop-R09", "ab/high-desktop-R10", "ab/high-desktop-R12", "ab/high-desktop-R17"], "note": "A reads more brick-built; B's orange dirt roads and brick sidewalks give more surface variety but are blurred"},
    "lighting": {"winner": "A", "confidence": 0.85, "pairs": ["ab/high-desktop-R07", "ab/high-desktop-R03", "ab/high-desktop-R13", "ab/high-desktop-R11"], "note": "A has a real shadow map, lamp globes and warm pools; B has flat light"},
    "animation": {"winner": "A", "confidence": 0.75, "pairs": ["ab/strip-R14", "ab/strip-R15", "ab/strip-R16"], "note": "A's crew circle the tub at the judge stop while B's stand in formation; A shows a real slide"},
    "ui": {"winner": "A", "confidence": 0.85, "pairs": ["ab/high-desktop-R02", "ab/high-desktop-R18", "ab/high-landscape-R01", "ab/high-landscape-R02", "ab/high-landscape-R18"], "note": "A frames the tub, hides the HUD under results and fits in landscape; B's menus and results run off-screen"},
    "typography": {"winner": "A", "confidence": 0.75, "pairs": ["ab/high-mobile-R01", "ab/high-mobile-R04", "ab/high-mobile-R18", "ab/high-desktop-R18"], "note": "A has open zeros, a clean outlined subtitle and '1 lap'; B has a doubled ghost shadow and '1 laps'"},
    "readability": {"winner": "A", "confidence": 0.8, "pairs": ["ab/high-desktop-R04", "ab/high-desktop-R12", "ab/high-mobile-R04", "ab/high-mobile-R08"], "note": "A is crisp and shadow-grounded; B's tubs blur into the road"},
    "mobile": {"winner": "A", "confidence": 0.85, "pairs": ["ab/high-mobile-R04", "ab/high-mobile-R08", "ab/high-landscape-R03", "ab/high-mobile-R18", "ab/high-landscape-R01"], "note": "A has the filled Steer pill, controls in the bottom corners and controls hidden under results; B stacks controls over the scene"},
    "authenticity": {"winner": "A", "confidence": 0.55, "pairs": ["ab/high-desktop-R05", "ab/high-desktop-R06", "ab/strip-R16", "ab/high-desktop-R09"], "note": "Same landmark geometry; A is sharper and acts out the judge task; B's dirt roads arguably more local"}
  },
  "ip": {"clean": true, "notes": "Rounded-cube heads, mitten block hands and straight box torsos; no minifigure silhouette; no LEGO name, logo or stud lettering in any capture."},
  "gaps": [
    {"id": "G-sprite-foliage-crowds", "category": "scenery", "expectedGain": 1.0, "severity": 4, "effort": "L", "workstream": "WS5", "evidence": ["high/desktop/R11", "high/desktop/R08", "high/desktop/R14", "high/desktop/R18"], "benchmark": "worlds-1", "fix": "Replace the painted trees with 3-4 instanced brick-built trees (round-brick trunks, stacked plate and slope canopies) and the crowds with instanced low-poly brick figures that reuse the crew parts, with 2 LODs. Interim: never draw sprites within 15 m of the camera, and use alpha-to-coverage. Test: no sprite texel is magnified above 1:1 in R08 or R11."},
    {"id": "G-facade-geometry", "category": "scenery", "expectedGain": 0.75, "severity": 4, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R13", "high/desktop/R05", "high/desktop/R17"], "benchmark": "worlds-1", "fix": "Model inset window frames, sill and cornice plates and sloped awnings as bevelled parts; make the brick courses readable at 10 m; give the plaza buildings real depth. Test: R13 window reveals cast shadow."},
    {"id": "G-slide-effects-missing", "category": "animation", "expectedGain": 0.75, "severity": 4, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R14", "high/desktop/R14"], "benchmark": "drive-3", "fix": "Check that the slide spray and steam emitters spawn in the capture and are not culled. Make the puffs at least 20 px at 1280 behind the rear wheels, tinted by charge stage, and add a short FOV kick of about +3 degrees on release. Test: R14 strip frames 3-8 show particles."},
    {"id": "G-ao-and-highlights", "category": "lighting", "expectedGain": 0.75, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R05", "high/desktop/R13", "high/desktop/R17"], "benchmark": "worlds-4", "fix": "Add SSAO or baked vertex AO on buildings and figure joints, and clamp Fresnel and specular on large ground planes. Test: building bases and tub undersides darken, and no R17 floor pixel exceeds 95% luminance."},
    {"id": "G-crew-separation", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R15", "strips/high/R16"], "fix": "Offset the circling crew by 360/n degrees on a radius wider than two body widths, and add separation steering between figures of different tubs. Test: no two figures overlap in any strip frame."},
    {"id": "G-tub-rim-closeup", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R02-preview-captain"], "benchmark": "drive-4", "fix": "Build the rim as one bevelled lathe ring, seat the studs on its top normal, and bevel the water edge. Test: the captain crop shows a continuous lip with every stud touching it."},
    {"id": "G-figure-backs-seams", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R02-preview-rear", "crops/high/R03-player-rear", "crops/high/R02-preview"], "benchmark": "drive-4", "fix": "Print the torso backs (crossed suspenders, team number), add a darker seam line at the head, torso, hip and leg joints, and use 16+ segments on the tyres."},
    {"id": "G-landscape-hud-overlap", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R04", "high/landscape/R17"], "fix": "Leave an 8 px gap between the timer and the water gauge, and move the minimap to the top right under the place indicator. Test: no two HUD bounding boxes intersect, and none falls inside the tub's screen box."},
    {"id": "G-team-select-phone", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["high/mobile/R02", "high/landscape/R02"], "fix": "Portrait: tub preview in the top 35% above a scrolling 3x4 grid. Landscape: grid and preview split 55/45. Test: the whole tub is visible in both captures."},
    {"id": "G-judges-missing", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["strips/high/R16", "high/desktop/R16"], "fix": "Place 1-2 brick judges in striped shirts with clipboards at each judge stop, with a check gesture when the task completes."},
    {"id": "G-player-marker", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/desktop/R07", "high/desktop/R09"], "benchmark": "drive-3", "fix": "Add a team-colour pennant or chevron above the player's tub and a rim light on the player's crew at dusk; recolour one of the two campaign-hat teams."},
    {"id": "G-hud-brick-theme", "category": "ui", "expectedGain": 0.5, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/desktop/R18"], "benchmark": "drive-2", "fix": "Style HUD panels as bevelled tiles with a stud row and buttons as 1x4 bricks; item labels at least 12 px at 1280."},
    {"id": "G-type-polish", "category": "typography", "expectedGain": 0.5, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R01", "high/desktop/R04"], "fix": "Use text-wrap: balance on the subtitle; swap the 8-bit display face for a heavy rounded face with a printed or embossed treatment; keep the open-zero numerals."},
    {"id": "G-studded-roads", "category": "scenery", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R10"], "fix": "Use smooth tiles on all drivable surfaces (tan or orange dirt tiles for gravel and the ford) and keep studs off-road; show water at the Gulpha ford."}
  ]
}
```
