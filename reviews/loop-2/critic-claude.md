# Critic A (critic-claude): loop 2, high tier

## Verdict
This loop is a real step toward a brick-toy world. Brick-built trees and brick spectators replace the painted cards, the crew backs now carry printed suspenders, and the tub rim and push bars are fixed. Side by side with the previous build, the world finally reads as one toy set (`ab/high-desktop-R04`, `ab/high-desktop-R06`, `ab/high-desktop-R09`). It is still well short of `worlds-1`, and three new or remaining defects cost the most. First, the screen-door dither on near trees and near rivals throws large patches of speckle noise across the frame: in `high/desktop/R11` the right third has 11.6× the pixel-to-pixel noise of the canopy on the left, and the same noise covers the lower-left of `strips/high/R16` frames 4–8. Second, the world surfaces are still painted boxes: plain asphalt roads, painted commercial fronts, and Arlington windows scattered like noise. There is no ambient occlusion, and dusk turns the pack to mud. Third, the new phone-landscape team-select layout pushes Choose and Back off-screen, and phone portrait clips Choose and hides Back. Figures and tubs hold up well at 2× and pass the IP check. Only authenticity clears its gate. **Total 63.0 / 100. Verdict: continue.**

## Scores (high tier, desktop; phone frames for mobile and readability)

### Characters: 6.5
- Close-ups hold up at 2×. In `crops/high/R02-preview` the faces are crisp printed faces with expression: a scowling captain, smiling crew. Caps carry studs and badge prints, uniforms carry suspender and badge prints, and the tub rim is studded and sits on a studded grey chassis plate with push bars. I saw no gaps or z-fighting in `crops/high/R02-preview`, `crops/high/R03-kart_5`, `crops/high/R04-kart_3` or `crops/high/R15-player`.
- From behind, the new back print helps. `crops/high/R03-player-rear` shows crossed suspenders in team yellow (110,109,31 on a 26,33,32 torso), so the chase-view crew is no longer a black slab. Teams separate by hat silhouette at chase distance (red caps, campaign hats, top hats, antenna bands, police caps, chef hats in `high/desktop/R04`, `high/desktop/R12`, `high/desktop/R07`).
- What holds it below 7:
  - The backs of the heads are bare skin blocks with no hair or print. Luminance across the head back only spans 77–97 in `crops/high/R03-player-rear`.
  - The figures show no part seams or mould lines.
  - The tub body is a smooth bowl, not recognisable brick parts, and the wheels are plain discs with no tread.
  - The four pushers on a team are identical clones.
  - The new rim light washes a dark-green raised leg to silver in `crops/high/R04-kart_3`: the front face averages (120,122,122) against (45,53,40) for the same leg in shade.
  - Two near-white teams, Lather & Linen and Steam Rangers, both show yellow X backs in the `high/desktop/R04` pack and are told apart only by their hats.
- Against `drive-4` (9.5) this is far off, and against `worlds-1` figures (6.5) it is level to slightly ahead.

### Materials: 6.0
- Figures and tubs read as glossy plastic. The tub in `crops/high/R02-preview` has a specular hot spot that clips to (255,255,220), and studs are shaded on the rims and chassis.
- Landmark walls now show running-bond courses with mortar lines (zoomed on the Fordyce in `high/desktop/R05`), and the grass baseplate studs read clearly in `high/desktop/R08` and `high/desktop/R11`.
- Against `worlds-1` (7), the rest of the world is still painted card:
  - The commercial blocks are printed textures on boxes (`high/desktop/R13`, `high/desktop/R04` right side).
  - Arlington windows are an irregular scatter of flat navy rectangles that reads like a texture glitch (`high/desktop/R06`, centre of the main wing).
  - Roads are plain asphalt, not tile.
  - Tree canopies are near-uniform flat green with no bevel highlights. The mid canopy in `high/desktop/R04` has a standard deviation of only 4–5 levels, and studs show only at close range (`high/desktop/R05` foreground tree).
  - No part reads as clear or translucent except the flat cyan water.
  - The dither speckle on near trees (`high/desktop/R11`, `high/desktop/R18`) looks like a rendering fault, not a material.

### Scenery: 6.0
- The world now reads as brick-built:
  - The trees are stacked plates on trunks. Pines are tiered (`high/desktop/R08`, `high/desktop/R10`), oaks are slabbed (`high/desktop/R12`), and the magnolias carry a few white 1×1 flowers (`high/desktop/R05`).
  - The crowd is brick figures behind white rails on blue posts (`high/desktop/R04`, `high/desktop/R14`).
  - Lamps, retaining walls and booths are all built of bricks.
- This is a clear cohesion gain over the painted cards (`ab/high-desktop-R04`).
- Against `worlds-1` (7.5) and `worlds-4` it is sparse and repetitive:
  - Huge flat studless-looking grass fields surround the Fordyce and the Arlington (`high/desktop/R05` right, `high/desktop/R06` left).
  - A pale grey band separates the terrain from the far hills in `high/desktop/R06`, so the world edge shows.
  - The Water Fight plaza in `high/desktop/R17` is an empty red-brick disc ringed by two box buildings.
  - The mountain courses are the same tiered pine repeated along a tile road (`high/desktop/R09`, `high/desktop/R10`, `high/desktop/R11`).
  - `high/desktop/R09` is billed as Goat Rock and the Gulpha Gorge ford, but it shows neither a rock outcrop nor any water.

### Lighting: 6.0
- Sun shadows now come from trees, crowd and barriers (tree shadows over the sidewalk in `high/desktop/R04`, big canopy shadows across the tiles in `high/desktop/R09`).
- The tub is grounded: luminance is 50.7 under the tub against 91.7 on lit road in `high/desktop/R04`. Dusk and sunset have their own palettes: a pink sky, warm lamp globes and a warm sidewalk in `high/desktop/R07`, and a pink horizon in `high/desktop/R11`.
- Against `worlds-4` (7.5) it misses the bar:
  - There is no AO anywhere: crevices, wall bases, under figures and in tree canopies are all clean.
  - Vertical walls are uniformly flat-lit (`high/desktop/R05`, `high/desktop/R06`).
  - The wall-base darkening is not measurable: the lower wall in `high/desktop/R05` averages L 98.8 against 92.5 for the mid wall.
  - Dusk turns the pack to mud. In `high/desktop/R07` road L is 44.2, the crew 61.8 and the tub 50.1, and in `high/desktop/R11` the road is 36.4. No lamp pools reach the road.
  - Nothing looks like a photographed toy.

### Animation and game feel: 6.0
- In `strips/high/R15` the crew push-run and circle the tub with rigid limbs swinging at the joints, which is the right toy articulation. They are evenly spaced around the tub, the captain throws his arms up, and blue splash discs spray.
- In `strips/high/R14` the tub yaws into the slide with beige dust puffs, and blue spray appears in frames 6–8.
- In `strips/high/R16` the crew circle at the judge stop.
- Against the 7 anchor and `drive-3` effects:
  - The particles are flat single-colour discs, not brick pieces.
  - No camera kick is visible in R14.
  - The "hot steam" charge has no visible steam at all in R14. In `high/desktop/R17`, "HOT STEAM!" shows only a small lilac puff behind the captain.
  - Tub water never sloshes.
  - In `strips/high/R14` frame 8, the sidewalk barrier rail passes straight through the crew and tub with no collision response.
  - Nothing shows anticipation or follow-through.

### UI / HUD: 6.5
- On desktop the hierarchy is clear and the style consistent: place top-right, lap and time top-left, item and coins top-centre, water gauge bottom-left, minimap bottom-right (`high/desktop/R04`, `high/desktop/R12`). Item labels are larger and readable. Callouts are clean (`high/desktop/R16` "RING AROUND THE TUB!" with a progress bar). Results and team select are tidy, with team swatches (`high/desktop/R18`, `high/desktop/R02`).
- Against `drive-3` (8.5):
  - The navy-and-orange panels have nothing of the brick world in them: no stud or plate framing.
  - The countdown READY overlaps the player's cone marker in `high/desktop/R03`.
  - The menus are not consistent across viewports. Landscape team select loses its Choose and Back buttons (`high/landscape/R02`), and portrait loses Back (`high/mobile/R02`).

### Typography: 6.5
- A pixel display face (title, place, LAP, READY, RESULTS) over a clean sans for the UI forms a clear scale (`high/desktop/R01`, `high/desktop/R18`). Numerals read at a glance on desktop. The title subtitle now breaks into two balanced lines with no stray shadow (`high/mobile/R01`, `ab/high-desktop-R01`).
- What holds it below 7:
  - In `high/landscape/R02` the "Handling" and "Water" rows are clipped by the panel's bottom edge.
  - In `high/mobile/R02` the Choose button is cut off at its lower edge.
  - The dim grey sub-labels on locked team cards are low-contrast on navy (`high/desktop/R02`).
  - The pixel face has character but is arcade-retro rather than brick.

### Readability: 6.5
- The new floating cone makes the player's tub instant in every race frame (`high/desktop/R04`, `high/desktop/R07`, `high/desktop/R13`, `high/mobile/R04`). Road edges and centre dashes are strong, and the bubble pickups glow clearly (`high/desktop/R10`, `high/desktop/R11`, `high/mobile/R17`).
- Against the 7 bar of "every tub, item, judge stop in every frame":
  - Dither speckle covers large areas: the right third of `high/desktop/R11`, and the dithered rival over the lower-left 40% of `strips/high/R16` frames 4–8, including the water gauge.
  - The dusk pack is low-contrast (`high/desktop/R07`, `high/mobile/R07`).
  - Of the two judges at the R16 booth, only one is visible, as a sliver about 25 px wide behind the booth's own flag panel (`high/desktop/R16`, x≈228–252). No clipboard shows.

### Mobile: 6.5
- Portrait race frames are framed on purpose. The HUD takes the top 19%, the controls the bottom 17%, and the tub sits in the middle third with no thumb overlap (`high/mobile/R04`, `high/mobile/R17`). The Steer pad measures 138×47 CSS px.
- Landscape moves the minimap off the road to the top-right under the place badge (`high/landscape/R04`, `high/landscape/R17`). The perf table shows swiftshader low mobile holding 56 fps.
- Two problems:
  - The new landscape team select is not framed on purpose. The panel cuts off mid stat row, and both action buttons are off-screen (`high/landscape/R02`, `ab/high-landscape-R02`).
  - Portrait team select now frames the tub (good), but the tub's wheels are cut by the panel, the Choose button is clipped and Back is gone (`high/mobile/R02`).

### Authenticity: 6.5
- The Row reads as the Row. In `high/desktop/R14` and `high/desktop/R15` you see the domed bathhouse, red tile roofs, a tree-lined promenade on a stone wall, and commercial blocks with awnings opposite. The Fordyce has its patterned upper storey (`high/desktop/R05`). The Arlington's twin towers are recognisable (`high/desktop/R06`).
- The real race shows: gallon water line, ducks, team flags, judge booths and the Rules of the Row heat (`high/desktop/R16`).
- What holds it below 7:
  - The Arlington does not close the vista in race frames: the end of Central Avenue is open sky and hills in `high/desktop/R04`.
  - Goat Rock and the ford are missing from `high/desktop/R09`.
  - The Water Fight plaza (`high/desktop/R17`) has no identifying feature.
  - The judges are effectively hidden.

## IP check
**Clean.** Heads are rounded cubes, not cylinders. Torsos are straight-sided boxes, not trapezoids, and hands are rectangular blocks, not C-shapes (`crops/high/R02-preview`, `crops/high/R15-player`, `crops/high/R04-kart_3`). Studs are plain, with no lettering, and there is no LEGO name or logo in any frame, menu or results screen.

## Ranked gaps
1. **G-dither-speckle** (readability, also materials; WS1; severity 4; effort M; expected +0.5 readability, +0.5 materials).
   - Problem: near-tree and near-rival screen-door dither turns large screen areas into per-pixel noise. In `high/desktop/R11`, mean |Δx| luminance is 11.79 in the region x950–1250, y150–400 against 1.02 for the left canopy. The same noise shows in `strips/high/R16` frames 4–8, `high/desktop/R18` and `high/desktop/R04`.
   - Fix: use a stable 4×4 Bayer pattern resolved by MSAA alpha-to-coverage or a half-res blur, or fade with real alpha and a depth pre-pass. Keep trees out of the camera's 9 m corridor along the racing line. Fade near rivals only over the player's tub silhouette, not their whole mesh.
   - Test: mean |Δx| in that R11 region is 3.0 or less, with no speckle over the HUD in R16.
2. **G-painted-boxes** (materials, also scenery; WS4; severity 4; effort L; expected +0.5 materials, +0.5 scenery).
   - Problem: commercial blocks and the Arlington are textures on boxes, the Arlington windows read as random noise, and roads are plain asphalt.
   - Fix: build an instanced facade kit with brick window frames, sills, slope-brick awnings and transparent panes. Give the Arlington a regular window grid. Add tile seams on the road (2×N tile pattern, with studs on shoulders only).
   - Test: R06 window pattern regular. R13 facades show relief and shadowed recesses.
   - Benchmark: `worlds-1`.
3. **G-no-ao-dusk-murk** (lighting, also readability; WS1; severity 4; effort M; expected +1.0 lighting, +0.25 readability).
   - Problem: there is no AO, and dusk and sunset crush the pack (crew L 61.8 on road L 44.2 in `high/desktop/R07`).
   - Fix: add half-res GTAO/SSAO on High and a baked or vertex AO on Low. Lamp point lights should pool on the road at dusk. Add a warm lantern on each tub and a hemisphere fill raised about 30% at dusk.
   - Test: R07 crew/road luminance ratio of 2.0 or more, and visible dark crevices at wall bases and under the tub.
   - Benchmark: `worlds-4`.
4. **G-team-select-mobile** (mobile, also ui and typography; WS6; severity 4; effort S; expected +0.5 mobile, +0.25 ui, +0.25 typography).
   - Problem: in landscape, Choose and Back are off-screen and the stat rows are clipped. In portrait, Choose is clipped and Back is missing.
   - Fix: make the actions a sticky footer and let only the team grid scroll. In landscape, put the grid on the left and details plus buttons on the right.
   - Test: at 844×390 and 390×844, both buttons sit fully inside the viewport with no clipped text.
5. **G-course-set-pieces** (authenticity, also scenery; WS4; severity 3; effort M; expected +0.5 authenticity, +0.25 scenery).
   - Problem: `high/desktop/R09` has no Goat Rock and no ford water, `high/desktop/R17` has an empty plaza, and the mountain courses are identical pine corridors.
   - Fix: build a stepped grey-slope Goat Rock outcrop at the roadside and a translucent blue tile ford strip with spray. Give Hill Wheatley Plaza a fountain, benches, trees and a crowd. Add one hero prop per mountain course.
   - Test: each listed landmark is visible in its capture.
6. **G-flat-particles** (animation; WS3; severity 3; effort M; expected +0.5 animation).
   - Problem: dust and spray are flat discs, there is no steam in the hot-steam charge (`strips/high/R14`), and there is no camera kick or water slosh.
   - Fix: replace the discs with 1×1 round-plate and stud particles that tumble with gravity. Add white steam plates rising from the tub while it charges. Add an FOV kick of +4° and 80 ms of shake on slide release and hits, and tilt the tub-water plane with lateral acceleration.
   - Test: steam visible in R14 frames 3–8, and the water plane tilted in at least 3 frames.
7. **G-figure-detail** (characters; WS2; severity 3; effort M; expected +0.5 characters).
   - Problem: the heads are bare from behind, there are no part seams, the tub is a smooth bowl, the wheels are plain, and the pushers are clones.
   - Fix: add a hair or hat-back print per team, and dark seam lines at the neck, waist and hips. Give the tub body a stacked-brick or curved-slope construction with seams and the wheels a tread. Vary the four pushers' skin, hair and face.
   - Test: `crops/high/R03-player-rear` shows hair on the backs of the heads and visible seams.
   - Benchmark: `drive-4`.
8. **G-rim-blowout** (materials, also characters; WS1; severity 2; effort S; expected +0.25 materials).
   - Problem: the new rim light washes a dark-green leg face to (120,122,122) in `crops/high/R04-kart_3`.
   - Fix: multiply the rim term by albedo and cap it at about 0.25.
   - Test: that face stays within 1.6× the luminance of the shaded leg.
9. **G-judges-hidden** (authenticity, also readability; WS5; severity 2; effort S; expected +0.25 authenticity, +0.25 readability).
   - Problem: the judges stand behind the booth's flag panel in `high/desktop/R16`.
   - Fix: stand both judges on the road side of the booth, facing traffic, with clipboards raised. Put the feather flag behind or beside them.
   - Test: both judges fully visible in the R16 frame.
10. **G-barrier-clip** (animation; WS5; severity 2; effort S; expected +0.25 animation).
    - Problem: the rail passes through the tub and crew in `strips/high/R14` frame 8, and the near rails in `high/desktop/R15` end in mid-air without posts.
    - Fix: give the barriers rail colliders that push the tub back, and add end posts.
11. **G-brick-hud** (ui; WS6; severity 2; effort M; expected +0.5 ui).
    - Problem: the HUD panels have no brick identity, and READY overlaps the player cone in `high/desktop/R03`.
    - Fix: frame the HUD panels as studded plates with bevel highlights, and hide the cone during the countdown or move READY above y=200.
    - Benchmark: `drive-3`.
12. **G-world-edge** (scenery; WS4; severity 2; effort M; expected +0.25 scenery).
    - Problem: a pale band shows between the terrain and the hills in `high/desktop/R06`, and the fields are empty.
    - Fix: extend a terrain skirt to the horizon with brick foothills, match the fog to the sky, and scatter instanced shrubs and fences on the open grass.

## A/B (A = left, B = right)
- **Characters: B** (0.85). B adds the back suspender print, a proper rim with an inner wall, push bars, and evenly spaced crew. A's crew backs are plain black. Pairs: `ab/crop-R03-player-rear`, `ab/crop-R02-preview-captain`, `ab/crop-R15-player`.
- **Materials: B** (0.6). B's brick courses, tile ford and brick trees are stylistically consistent, where A's painted trees clash. B's dither speckle is the cost. Pairs: `ab/high-desktop-R05`, `ab/high-desktop-R06`, `ab/high-desktop-R09`, `ab/high-desktop-R11`.
- **Scenery: B** (0.85). Brick trees and a brick crowd replace painted cards. Pairs: `ab/high-desktop-R04`, `ab/high-desktop-R06`, `ab/high-desktop-R07`, `ab/high-desktop-R13`.
- **Lighting: B** (0.6). B has tree, crowd and barrier shadows and similar sky palettes. Pairs: `ab/high-desktop-R04`, `ab/high-desktop-R09`, `ab/high-desktop-R13`, `ab/high-desktop-R07`.
- **Animation: B** (0.65). The crew spread evenly around the tub. Part of the particle gain is the capture-clock fix, not the game. Pairs: `ab/strip-R15`, `ab/strip-R16`, `ab/strip-R14`.
- **UI: B** (0.55). B has balanced subtitle lines, larger item labels and the minimap off the road, but the landscape team-select buttons are lost. Pairs: `ab/high-desktop-R01`, `ab/high-desktop-R04`, `ab/high-landscape-R17`, `ab/high-landscape-R02`.
- **Typography: B** (0.55). B's subtitle lines are balanced, but its landscape stat rows are clipped. Pairs: `ab/high-desktop-R01`, `ab/high-mobile-R01`, `ab/high-landscape-R02`.
- **Readability: B** (0.75). The player cone outweighs the new dither noise. Pairs: `ab/high-desktop-R04`, `ab/high-desktop-R07`, `ab/high-desktop-R13`, `ab/high-desktop-R11`.
- **Mobile: B** (0.55). The minimap moved off the road in landscape and the portrait tub is framed, against the lost team-select actions. Pairs: `ab/high-landscape-R04`, `ab/high-landscape-R17`, `ab/high-mobile-R02`, `ab/high-landscape-R02`.
- **Authenticity: B** (0.6). B has judges at the booths, brick magnolias on the Row and a Bridge Street barrier. Pairs: `ab/high-desktop-R16`, `ab/high-desktop-R05`, `ab/high-desktop-R13`.

```json
{
  "loop": 2,
  "role": "critic-claude",
  "tier": "high",
  "scores": {
    "characters": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "crops/high/R02-preview", "note": "crisp printed faces with expression, studded caps and rim, push bars; no gaps or z-fighting at 2x" },
        { "shot": "crops/high/R03-player-rear", "note": "new crossed-suspender back print (110,109,31 on 26,33,32); head backs bare skin blocks, luminance 77-97" },
        { "shot": "crops/high/R04-kart_3", "note": "rim light washes the dark-green raised leg to (120,122,122) vs (45,53,40); tub is a smooth bowl, wheels plain discs" },
        { "shot": "high/desktop/R04", "note": "teams separate by hat silhouette at chase distance; two near-white teams both show yellow X backs" }
      ]
    },
    "materials": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        { "shot": "crops/high/R02-preview", "note": "glossy tub with clipped specular (255,255,220), shaded studs" },
        { "shot": "high/desktop/R05", "note": "running-bond courses with mortar on the Fordyce; tree canopies flat green, studs only up close" },
        { "shot": "high/desktop/R06", "note": "Arlington windows a random scatter of flat navy rectangles" },
        { "shot": "high/desktop/R13", "note": "commercial blocks are painted textures on boxes; plain asphalt road" },
        { "shot": "high/desktop/R11", "note": "dither speckle on near trees reads as a render fault" }
      ]
    },
    "scenery": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "brick trees, brick crowd behind rails, lamps: cohesive brick street" },
        { "shot": "high/desktop/R06", "note": "pale grey band between terrain and far hills; empty flat grass" },
        { "shot": "high/desktop/R09", "note": "billed Goat Rock and ford: no rock, no water, repeated pines" },
        { "shot": "high/desktop/R17", "note": "Water Fight plaza an empty brick disc between two box buildings" }
      ]
    },
    "lighting": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "tree, crowd and tub shadows; under-tub L 50.7 vs lit road 91.7; no AO" },
        { "shot": "high/desktop/R07", "note": "deliberate dusk palette, but road L 44.2, crew 61.8, tub 50.1: pack goes to mud; no lamp pools on road" },
        { "shot": "high/desktop/R11", "note": "pink sunset horizon, road L 36.4" },
        { "shot": "high/desktop/R05", "note": "flat-lit walls; base darkening not measurable (98.8 vs 92.5)" }
      ]
    },
    "animation": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        { "shot": "strips/high/R15", "note": "crew push-run and circle evenly with rigid joint swing; flat blue splash discs" },
        { "shot": "strips/high/R14", "note": "slide yaw with beige dust discs; no steam in a hot-steam charge; no camera kick; frame 8 rail passes through the tub" },
        { "shot": "strips/high/R16", "note": "crew circle at the judge stop; no water slosh" }
      ]
    },
    "ui": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "clear place/lap/time/item/water/minimap hierarchy, one navy-orange style, nothing brick-themed" },
        { "shot": "high/desktop/R03", "note": "READY overlaps the player cone marker" },
        { "shot": "high/desktop/R18", "note": "clean results table with team swatches" },
        { "shot": "high/landscape/R02", "note": "team-select Choose and Back off-screen" }
      ]
    },
    "typography": {
      "score": 6.5,
      "confidence": 0.55,
      "evidence": [
        { "shot": "high/desktop/R01", "note": "pixel display face over clean sans, clear scale; balanced subtitle" },
        { "shot": "high/desktop/R18", "note": "numerals read at a glance" },
        { "shot": "high/landscape/R02", "note": "Handling and Water rows clipped by the panel edge" },
        { "shot": "high/mobile/R02", "note": "Choose button clipped at its lower edge" }
      ]
    },
    "readability": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "player cone makes the tub instant; strong road edges" },
        { "shot": "high/desktop/R11", "note": "dither noise 11.79 vs 1.02 canopy over the right third" },
        { "shot": "strips/high/R16", "note": "dithered rival covers the lower-left 40% in frames 4-8, including the water gauge" },
        { "shot": "high/desktop/R16", "note": "one judge visible as a ~25 px sliver behind the booth panel" },
        { "shot": "high/mobile/R07", "note": "low-contrast dusk pack on phone" }
      ]
    },
    "mobile": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/mobile/R04", "note": "tub in the middle third, controls never cover it; steer pad 138x47 CSS px" },
        { "shot": "high/landscape/R17", "note": "minimap top-right under the place badge, road clear" },
        { "shot": "high/landscape/R02", "note": "team select not framed: stat rows clipped, both buttons off-screen" },
        { "shot": "high/mobile/R02", "note": "tub framed above the panel but wheels cut; Choose clipped, Back missing" }
      ]
    },
    "authenticity": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R14", "note": "the Row reads: domed bathhouse, tile roofs, promenade wall, awnings opposite" },
        { "shot": "high/desktop/R06", "note": "Arlington twin towers recognisable, but they do not close the race vista in R04" },
        { "shot": "high/desktop/R16", "note": "judge booth and Rules of the Row heat present; judges hidden" },
        { "shot": "high/desktop/R09", "note": "Goat Rock and ford absent" }
      ]
    }
  },
  "ab": {
    "characters": { "winner": "B", "confidence": 0.85, "pairs": ["ab/crop-R03-player-rear", "ab/crop-R02-preview-captain", "ab/crop-R15-player"], "note": "B adds the back suspender print, a rim inner wall, push bars and evenly spaced crew" },
    "materials": { "winner": "B", "confidence": 0.6, "pairs": ["ab/high-desktop-R05", "ab/high-desktop-R06", "ab/high-desktop-R09", "ab/high-desktop-R11"], "note": "brick courses and brick trees consistent with the figures; dither speckle is the cost" },
    "scenery": { "winner": "B", "confidence": 0.85, "pairs": ["ab/high-desktop-R04", "ab/high-desktop-R06", "ab/high-desktop-R07", "ab/high-desktop-R13"], "note": "brick trees and crowd replace painted cards" },
    "lighting": { "winner": "B", "confidence": 0.6, "pairs": ["ab/high-desktop-R04", "ab/high-desktop-R09", "ab/high-desktop-R13", "ab/high-desktop-R07"], "note": "tree, crowd and barrier sun shadows" },
    "animation": { "winner": "B", "confidence": 0.65, "pairs": ["ab/strip-R15", "ab/strip-R16", "ab/strip-R14"], "note": "crew spread evenly around the tub; part of the particle gain is the capture-clock fix" },
    "ui": { "winner": "B", "confidence": 0.55, "pairs": ["ab/high-desktop-R01", "ab/high-desktop-R04", "ab/high-landscape-R17", "ab/high-landscape-R02"], "note": "balanced subtitle, larger labels, minimap off the road; landscape team-select buttons lost" },
    "typography": { "winner": "B", "confidence": 0.55, "pairs": ["ab/high-desktop-R01", "ab/high-mobile-R01", "ab/high-landscape-R02"], "note": "balanced subtitle lines; landscape stat rows clipped" },
    "readability": { "winner": "B", "confidence": 0.75, "pairs": ["ab/high-desktop-R04", "ab/high-desktop-R07", "ab/high-desktop-R13", "ab/high-desktop-R11"], "note": "player cone outweighs the new dither noise" },
    "mobile": { "winner": "B", "confidence": 0.55, "pairs": ["ab/high-landscape-R04", "ab/high-landscape-R17", "ab/high-mobile-R02", "ab/high-landscape-R02"], "note": "minimap moved off the road and portrait tub framed, against lost team-select actions" },
    "authenticity": { "winner": "B", "confidence": 0.6, "pairs": ["ab/high-desktop-R16", "ab/high-desktop-R05", "ab/high-desktop-R13"], "note": "judges at the booths, brick Row trees" }
  },
  "ip": { "clean": true, "notes": "Rounded-cube heads, straight box torsos, rectangular block hands; plain studs; no LEGO name or logo anywhere." },
  "gaps": [
    { "id": "G-dither-speckle", "category": "readability", "expectedGain": 1.0, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R11", "strips/high/R16", "high/desktop/R18", "high/desktop/R04"], "fix": "Replace per-pixel screen-door fade with a stable Bayer pattern resolved by MSAA alpha-to-coverage (or real alpha with depth pre-pass); keep trees out of a 9 m camera corridor; fade near rivals only where they cover the player tub. Test: mean |dx| luminance in R11 x950-1250,y150-400 <= 3.0 (now 11.79). Gain split +0.5 readability, +0.5 materials." },
    { "id": "G-painted-boxes", "category": "materials", "expectedGain": 1.0, "severity": 4, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R13", "high/desktop/R06", "high/desktop/R04"], "benchmark": "worlds-1", "fix": "Instanced brick facade kit (window frames, sills, slope-brick awnings, transparent panes) for commercial blocks; regular window grid on the Arlington; tile seams on roads. Test: R06 windows regular, R13 facades show relief. Gain split +0.5 materials, +0.5 scenery." },
    { "id": "G-no-ao-dusk-murk", "category": "lighting", "expectedGain": 1.25, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/desktop/R11", "high/desktop/R05"], "benchmark": "worlds-4", "fix": "Half-res GTAO/SSAO on High, vertex AO on Low; lamp point lights pooling on the road at dusk, a lantern on each tub, hemisphere fill +30% at dusk. Test: R07 crew/road luminance ratio >= 2.0 (now 1.4). Gain split +1.0 lighting, +0.25 readability." },
    { "id": "G-team-select-mobile", "category": "mobile", "expectedGain": 1.0, "severity": 4, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R02", "high/mobile/R02", "ab/high-landscape-R02"], "fix": "Sticky action footer (Choose and Back) with only the team grid scrolling; landscape two-column layout (grid left, details and buttons right). Test: at 844x390 and 390x844 both buttons are fully in the viewport and no stat row is clipped. Gain split +0.5 mobile, +0.25 ui, +0.25 typography." },
    { "id": "G-course-set-pieces", "category": "authenticity", "expectedGain": 0.75, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R17", "high/desktop/R10"], "fix": "Brick Goat Rock outcrop (stepped grey slopes) and a translucent blue tile ford with spray in R09; fountain, benches, trees and crowd in Hill Wheatley Plaza; one hero prop per mountain course. Test: each landmark visible in its capture. Gain split +0.5 authenticity, +0.25 scenery." },
    { "id": "G-flat-particles", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15", "high/desktop/R17"], "benchmark": "drive-3", "fix": "Brick-piece particles (1x1 round plates and studs) with tumble and gravity; white steam plates rising from the tub while charging; FOV kick +4 degrees and 80 ms shake on slide release and hits; tilt the water plane with lateral acceleration. Test: steam visible in R14 frames 3-8, water tilted in at least 3 frames." },
    { "id": "G-figure-detail", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R03-player-rear", "crops/high/R02-preview", "crops/high/R04-kart_3"], "benchmark": "drive-4", "fix": "Hair or hat-back print per team, seam lines at neck, waist and hips, stacked-brick or curved-slope tub body with seams, wheel tread, varied skin, hair and faces across the four pushers. Test: R03-player-rear shows hair and seams." },
    { "id": "G-rim-blowout", "category": "materials", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["crops/high/R04-kart_3"], "fix": "Multiply the rim term by albedo and cap it at about 0.25 so dark parts keep their colour. Test: the raised-leg face stays within 1.6x the shaded leg luminance (now (120,122,122) vs (45,53,40))." },
    { "id": "G-judges-hidden", "category": "authenticity", "expectedGain": 0.5, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R16", "strips/high/R16"], "fix": "Stand both judges on the road side of the booth, facing traffic, with clipboards raised; flag behind or beside them. Test: both judges fully visible in R16. Gain split +0.25 authenticity, +0.25 readability." },
    { "id": "G-barrier-clip", "category": "animation", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["strips/high/R14", "high/desktop/R15"], "fix": "Rail colliders that push the tub back, and end posts on every rail run. Test: R14 frame 8 shows no rail through the tub or crew." },
    { "id": "G-brick-hud", "category": "ui", "expectedGain": 0.5, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/desktop/R03"], "benchmark": "drive-3", "fix": "Frame HUD panels as studded plates with bevel highlights; hide the player cone during the countdown or move READY above y=200. Test: no overlap in R03." },
    { "id": "G-world-edge", "category": "scenery", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R06", "high/desktop/R05"], "fix": "Terrain skirt to the horizon with brick foothills, fog matched to the sky, instanced shrubs and fences across open grass. Test: no pale band in R06." }
  ],
  "verdict": "continue"
}
```
