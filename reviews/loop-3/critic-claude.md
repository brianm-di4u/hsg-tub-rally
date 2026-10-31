# Critic A (critic-claude): loop 3, high tier

## Verdict
The crews and tubs have finally crossed into "plastic brick toy" territory. In `crops/high/R02-preview`, `crops/high/R03-kart_1` and `crops/high/R03-kart_5` the figures have printed faces with real expressions, printed turnout coats and towel turbans, team hats, studded chassis plates, hubbed and bolted wheels, claw feet or skirts, ducks and flags. They are the best thing in the build and they now clear the characters gate. The world they race through has not kept up. The asphalt is one flat colour: I measured a standard deviation of 0.0 to 0.5 per channel over a road patch in `high/desktop/R04` and `R07`. Building walls are flat boxes with a painted running-bond texture. Landmark lawns are empty baseplate. Near-camera trees still cover 30 to 45% of some frames as large translucent green slabs (`R11`, `R19`). Day lighting is a flat sun with no crevice AO or bounce. The HUD and menus are tidy and now brick-themed, but they sit on an 8-bit pixel display face that doesn't belong to a glossy toy world. **Total 64.5/100.** Characters, mobile and authenticity meet their gates. Materials, scenery, lighting, animation, UI, typography and readability do not.

## Scores

**Characters: 7.0** (gate ≥7, met)
Every rule in the anchor-7 list is now visible. `crops/high/R02-preview` shows a shocked captain and a grinning pusher with printed coats (buttons, hydrant badge, reflective tape), fire helmets with shield prints, a rounded duck and a flag. `crops/high/R02-preview-rear` shows back prints (yellow X straps over reflective bands) and clean shoulder and hip seams. `crops/high/R03-kart_1` shows a studded chassis plate with hubbed, bolted wheels and an orange skirt, and the gator-head team hats. `crops/high/R03-kart_5` shows towel turbans and claw feet. At chase distance the teams separate by hat silhouette as well as by colour: `high/desktop/R04` and `R07` show fire helmets, campaign hats, turbans, top hats with "H" prints, tie-dye with antennae, flamingo pink and the gator heads. What keeps it at 7 and well short of `drive-4` (9.5):
- The tub is visibly low-poly in close-up. The rim is an octagon with hard facets (`crops/high/R02-preview-captain`).
- The bath water is a flat, static, pale plane: (125,187,191) at (620,380) in that crop.
- Hats carry no studs.
- The hands are plain blocks.

**Materials: 6.0** (gate ≥7, not met)
The figures are convincing ABS: helmet and tub highlights follow the bevels (`crops/high/R02-preview-captain`). The baseplate grass has shaded studs that read well up close (`high/desktop/R08`, bottom left). Everything else is weaker than `worlds-1`:
- **Asphalt.** The road is a single flat colour. Patch σ is 0.5/0.3/0.3 at `high/desktop/R04` (820–1000, 600–700) and 0.0/0.0/0.0 at `R07` (700–1000, 640–740). There is no seam, specular or tile, so it reads as card.
- **Brick walls.** Commercial walls are flat planes with a painted brick texture. The bricks don't catch light individually (`high/desktop/R13`, right building). Only the window frames, string courses and quoins are modelled.
- **Trees.** The pine and oak slabs are matte, with no bevel highlight (`high/desktop/R10`).
- **Clear parts.** The ford in `high/desktop/R19` is opaque blue tiles, not trans-clear plastic. The only parts that read as translucent are the iridescent bubble pickups.

**Scenery: 6.0** (gate ≥7, not met)
The world is clearly brick-themed: studded baseplate, tile mountain roads (`high/desktop/R10`), a radial brick plaza (`R17`), stacked-plate pines, and brick commercial blocks with striped awnings (`R13`, `R14`). It does not have the density of `worlds-1` or `drive-1`.
- `high/desktop/R05` and `R06` stand landmarks on wide empty lawns.
- `R06` shows a pale world-edge band between the green ground and the backdrop hills at about x 0–340, y 400–500.
- `R09` is a field of near-identical pines.
- The same brick-block module repeats on every downtown course (`R04`, `R13`, `R14`, `R16`).
- Faded near-camera trees fill the right ~40% of `R11` and the right half of `R19` as murky translucent slabs.

**Lighting: 6.0** (gate ≥7, not met)
Dusk and sunset now have deliberate palettes: a pink-violet sky, warm lamp pools and filled crews (`high/desktop/R07`, `R11`). Sun shadows ground the crews, and the new pusher contact shadows help (`R03`, `R12`). Against `worlds-4` and `bj-1`, the day frames are a flat key light:
- There is no crevice AO under cornices, in window reveals or at building corners (`R13`, `R05`).
- There is no green bounce from the baseplate.
- The `R07` lamp pools clip: sidewalk pixels hit (255,182,128) at x 950, y 460, while the near road is a dead-flat (55,41,43).
- The haze is fine.

**Animation: 6.5** (gate ≥7, not met)
- `strips/high/R15`: the crew clearly runs a circuit around the tub with swinging rigid limbs. The bead splash bursts and clears over the 8 frames. This is correct toy articulation.
- `strips/high/R16`: the same circling at the judge stop, while a faded rival passes.
- `strips/high/R14`: the slide yaws the tub and splays a pusher's legs, and spray appears as pale-blue plastic beads. From frame 3 on, though, the beads sit as detached clusters in the bottom ~20% of each frame, far from the wheels. They read as floating marbles, not spray.

Two things are missing. The bath water never tilts or sloshes in any strip. There is no visible boost or camera kick, and no anticipation or follow-through. Against the `drive-3` effects (8.5) this is short of 7.

**UI / HUD: 6.5** (gate ≥7, not met)
The hierarchy is clear (`high/desktop/R04`):
- Lap and time top left, place top right, item slot and ticket count top centre.
- A tub-shaped water gauge with the item checklist bottom left, and the map bottom right.

Menus are now consistent brick parts. Buttons have studs, Grand Prix is a red 1×4 brick, and panels have stud rows (`high/desktop/R01`, `R02`, `R18`). Against `drive-3` and `drive-2`:
- The HUD is static, and its pixel numerals clash with the bevelled tiles.
- The "CHOOSE YOUR TEAM" heading sits on top of the stud row (`high/mobile/R02`).
- In `high/landscape/R02`, the pinned button bar half-covers the "Captain:" line, and the Top speed/Push bars show underneath it.

**Typography: 6.5** (gate ≥7, not met)
The scale is clear. The pixel display face is used for the logo, "LAP", place and "READY"/"RESULTS", with a bold rounded sans for UI and body text (`high/desktop/R01`, `R18`). Numerals read at a glance.
- The display face is 8-bit arcade, not toy, so it fights the glossy brick look.
- The HUD's white fill on a pale sky measures 1.6:1 (R03, (255,255,255) on (171,209,236)). It relies entirely on the dark outline (10.4:1).
- The item labels "Towel/Bath/Soap/Loofah" are about 8–9 CSS px tall on the phone (`high/mobile/R04`, rows ~297–314 at 2×).
- Text is clipped behind the pinned buttons in `high/landscape/R02`.

**Readability: 6.5** (gate ≥7, not met)
The team-coloured, black-outlined ring makes the player's tub obvious in every race frame (`high/desktop/R03`, `R08`, `R13`, `high/mobile/R04`). Bubble pickups read (`R10`, `R17`), and road edges have white lines.
- `high/desktop/R19` is the worst frame. The player's tub is partly behind translucent foreground geometry and two bead clusters, and its ring is mostly hidden.
- `R11` loses its right 40% to a ghosted tree.
- The 8-tub pack in `R07` and `R12` merges into one colour mass.
- The judge stop in `R16` reads only through the HUD sign. The booth itself is a plain white box.

**Mobile: 7.0** (gate ≥7, met)
- Portrait (`high/mobile/R04`, `R07`, `R17`): the HUD stacks at the top and the controls sit at the bottom. The tub's bottom edge is at about y 590 of 844 and the controls start at about y 715, so they never cover it.
- Landscape (`high/landscape/R03`, `R07`): the steer pill and the four action buttons stay in the bottom corners, clear of the tub.
- Team select now shows both Choose and Back in both orientations.
- The swiftshader phone floor is 63 fps (brief).

Against this: landscape team select (`high/landscape/R02`) shows only one line of description, clipped, and the phone item labels are tiny.

**Authenticity: 6.5** (gate ≥6, met)
- Central Avenue reads correctly: Bathhouse Row on one side, with red tile roofs and the Quapaw-style dome (`high/desktop/R14`, `R03`), and brick commercial blocks with awnings on the other.
- The Arlington's twin towers close the vista (`R06`).
- The race shows its real rules: the water gauge with a 10-gallon line, the towel/bath mat/soap/loofah checklist, the duck and flag on every tub, and a judge stop (`R16`).
- Goat Rock is a white novaculite-like outcrop (`R09`), which is the right idea, but it stands in a flat pine field rather than on an overlook.
- The Gulpha Creek ford (`R19`) reads as a blue tiled pool.
- The Arlington is olive-grey rather than its buff brick.

## IP check
**Clean.** No LEGO name or logo appears anywhere I saw, including the title, menus, HUD, results and signage. The figures have rounded box heads (not cylinders), rectangular torsos (not trapezoids) and block fists (not C-hands) (`crops/high/R02-preview`, `crops/high/R03-kart_5`). Two minor notes, neither of which I count as a violation:
- The fire helmet with a shield print is a generic firefighter motif.
- The dot-eye printed faces are a common toy convention.

## Ranked gaps
1. **G-near-camera-foliage** (readability, WS5; severity 4, effort M, expected gain +0.5)
   - Problem: faded trees still cover 30–45% of the frame as translucent slabs (`high/desktop/R11`, `R19`, `R04`, `R16`).
   - Fix: hide (opacity 0) any tree instance whose bounds enter the camera-to-player corridor or come within ~6 m of the camera, rather than half-fading it. Or keep tree placement out of that corridor.
   - Test: no race frame has more than 10% of its pixels covered by foliage with alpha below 1.
2. **G-flat-asphalt** (materials, WS1; severity 3, effort M, +0.5)
   - Problem: the asphalt σ is at most 0.5 (`R04`, `R07`).
   - Fix: give the road ABS gloss (a sun and sky specular lobe) and low-contrast large-plate tiling or a subtle grain.
   - Test: σ ≥ 3 over the same `R04` patch, and a visible sun highlight on the road in day frames.
3. **G-painted-brick-walls** (materials, WS1/WS4; severity 3, effort L, +0.5)
   - Problem: brick walls are a flat texture (`R13`, `R05`).
   - Fix: add a per-brick bevel normal map, so every brick edge catches the key light, plus a recessed mortar AO term. On High, use instanced brick courses on the nearest facades.
   - Test: in a `R13` close-up, individual bricks show a lit top edge.
4. **G-day-ao-bounce** (lighting, WS1; severity 3, effort M, +0.5)
   - Fix: add SSAO or baked AO to cornices, window reveals, building corners and eaves. Add a ground-coloured hemisphere bounce. Tone-map the lamp pools so they stop clipping (`R07` hits R=255).
   - Test: corner and eave pixels at least 15% darker than the open wall in `R13`, and no lamp pixel at 255.
5. **G-water-slosh** (animation, WS3; severity 3, effort M, +0.5)
   - Problem: the bath water is a static flat plane (`crops/high/R02-preview-captain`, `strips/high/R14`, `strips/high/R15`).
   - Fix: tilt the water plane with lateral acceleration, and spill a few beads over the rim on hard slides and fumbles.
   - Test: the water angle visibly changes across the R14 frames.
6. **G-empty-landmark-lawns** (scenery, WS4; severity 3, effort M, +0.5)
   - Problem: `R05`, `R06` and `R09` are mostly bare baseplate, and `R06` shows a pale world-edge band.
   - Fix: extend the terrain into brick-built rolling hills and tree belts up to the backdrop. Add brick hedges, fountains, benches, the Grand Promenade wall and path tiles to the landmark grounds.
   - Test: no flat, empty baseplate area over 20% of a landmark frame, and no visible ground-to-sky seam.
7. **G-slide-spray** (animation, WS3; severity 2, effort S, +0.3)
   - Problem: the R14 beads are detached clusters at the bottom of the frame.
   - Fix: emit from the rear-wheel contact points with velocity-inherited arcs, a shorter life and size falloff. Add a small camera FOV kick and speed lines when the hot-steam charge fires.
   - Test: beads in R14 sit within one tub-length of the wheels.
8. **G-ford-water** (authenticity, WS4; severity 2, effort M, +0.3)
   - Problem: the `R19` ford is opaque blue tiles.
   - Fix: use translucent trans-clear-blue tiles over a visible creek bed, scrolling glints, and a bead splash when a tub crosses.
   - Test: the stones or creek bed are visible through the water in R19.
9. **G-hud-typeface** (typography, WS6; severity 2, effort S, +0.5)
   - Fix: replace the 8-bit pixel display face with a chunky rounded brick-style face, or put the LAP, time and place readouts on bevelled tiles. Raise the phone item labels to at least 11 CSS px.
   - Test: HUD text fill contrast ≥ 3:1 against its own tile.
10. **G-landscape-teamselect** (mobile, WS6; severity 2, effort S, +0.3)
    - Problem: in `high/landscape/R02`, description text and stat bars sit under the pinned buttons, and the "Handling" row is cut in `high/mobile/R02`.
    - Fix: end the scroll area above the button plate with a solid background and fade. In landscape, put the description and stats in a column beside the turntable.
    - Test: no text intersects the button bar.
11. **G-judge-booth** (authenticity, WS5; severity 2, effort S, +0.3)
    - Problem: the `R16` booth is a plain white box with a red slab roof, and its judges look like the crowd.
    - Fix: build the booth from brick parts with a printed "JUDGES" sign and striped canopy. Give the judges blazers or referee stripes and clipboards.
12. **G-tub-faceting** (characters, WS2; severity 2, effort S, +0.3)
    - Problem: the tub rim and body facets show at 2× (`crops/high/R02-preview-captain`).
    - Fix: raise LOD1 radial segments to 16–24 with smooth normals, and add a thin rolled-rim bevel.
    - Test: no straight facet edge longer than 20 px on the rim in that crop.

## A/B
B is pixel-identical to this loop's captures (mean absolute difference ≤1.3 against `high/desktop/R03` and `R07`, and ≤0.7 against the `crops/low` set). That makes B this loop's build. I worked that out from captures I was given, not from any forbidden file, and I judged each category on what the images show.

| Category | Winner | Confidence | Pairs |
|---|---|---|---|
| Characters | B | 0.9 | `crop-R02-preview`, `crop-R02-preview-captain`, `crop-R03-player`, `crop-R03-kart_5`, `high-desktop-R03`, `high-desktop-R08` |
| Materials | B | 0.7 | `high-desktop-R04`, `high-desktop-R13`, `high-desktop-R06`, `crop-R02-preview-captain` |
| Scenery | B | 0.7 | `high-desktop-R04`, `high-desktop-R10`, `high-desktop-R13`, `high-desktop-R14` |
| Lighting | B | 0.55 | `high-desktop-R07`, `high-desktop-R11`, `high-desktop-R12` |
| Animation | B | 0.6 | `strip-R14`, `strip-R15`, `strip-R16` |
| UI | B | 0.75 | `high-desktop-R02`, `high-desktop-R18`, `high-mobile-R01`, `high-landscape-R01`, `high-desktop-R16` |
| Typography | tie | 0.6 | `high-desktop-R01`, `high-desktop-R18`, `high-landscape-R01` |
| Readability | B | 0.75 | `high-desktop-R03`, `high-desktop-R08`, `high-desktop-R11`, `high-desktop-R13`, `high-mobile-R04` |
| Mobile | B | 0.75 | `high-mobile-R02`, `high-landscape-R02`, `high-landscape-R01`, `high-mobile-R04` |
| Authenticity | B | 0.55 | `high-desktop-R16`, `high-desktop-R06`, `high-desktop-R14` |

What decided each one:
- **Characters:** A has plain boxes with X straps and a blocky duck. B adds printed faces and uniforms, team hats, a rounded duck and hubbed wheels.
- **Materials:** A's commercial fronts are painted and noisy. B builds them from brick with modelled frames, cornices and quoins, and the bevelled glossy tub, duck and helmets beat A's flat boxes.
- **Scenery:** A's R04 crowd rail juts across the sidewalk, B's runs along the curb. A's R10 has a tan-olive pine, B's does not. B's commercial blocks are built from parts.
- **Lighting:** B's dusk crews carry fill light and the pushers have contact shadows. Otherwise the two are close.
- **Animation:** A's slide spray is grey-white smoke puffs. B's is water-coloured plastic beads, with a smaller, cleaner fumble splash. The motion itself is otherwise similar.
- **UI:** B has stud-topped brick buttons, a red Grand Prix brick, stud-row panels and a studded judge-task sign. A has flat pill buttons.
- **Typography:** both use the same faces and the same scale.
- **Readability:** B has the team-colour player ring. A's near trees show per-pixel sparkle noise (R11 right, R04 left), B's fade smoothly.
- **Mobile:** in A the Choose button is cut and Back is missing on portrait team select, and landscape team select shows no buttons at all. B shows both in both orientations and has a purposeful landscape title grid.
- **Authenticity:** B's judge booth faces the road with the judges in front. B's Arlington is a cleaner window grid without the busy painted facade. The R09 pair shows different views and is excluded.

```json
{
  "loop": 3,
  "role": "critic-claude",
  "tier": "high",
  "scores": {
    "characters": {
      "score": 7.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "crops/high/R02-preview", "note": "Printed faces (shocked captain, grinning pusher), printed turnout coats with buttons/badge/reflective tape, shield fire helmets, rounded duck, flag."},
        {"shot": "crops/high/R02-preview-rear", "note": "Back prints: yellow X straps over reflective bands; clean head/torso/arm seams."},
        {"shot": "crops/high/R03-kart_1", "note": "Studded chassis plate, hubbed bolted wheels, skirt, gator-head hats."},
        {"shot": "crops/high/R03-kart_5", "note": "Towel turbans, claw feet; distinct team identity."},
        {"shot": "crops/high/R02-preview-captain", "note": "Weakness: octagonal faceted tub rim, flat static water (125,187,191), plain block hands, no studs on hats."},
        {"shot": "high/desktop/R04", "note": "Teams separate by hat silhouette at chase distance."}
      ]
    },
    "materials": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "crops/high/R02-preview-captain", "note": "Figures and tub are convincing glossy ABS with bevel highlights."},
        {"shot": "high/desktop/R08", "note": "Shaded baseplate studs read near camera."},
        {"shot": "high/desktop/R04", "note": "Asphalt is a flat colour: patch sigma 0.5/0.3/0.3 at (820-1000,600-700)."},
        {"shot": "high/desktop/R07", "note": "Asphalt sigma 0.0 at (700-1000,640-740); reads as card."},
        {"shot": "high/desktop/R13", "note": "Brick walls are a painted texture on flat planes; only frames, string courses and quoins are modelled."},
        {"shot": "high/desktop/R19", "note": "Ford is opaque blue tiles, not trans-clear plastic."}
      ]
    },
    "scenery": {
      "score": 6.0,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R10", "note": "Tile mountain road, stacked-plate pines, studded verge: clearly brick-themed."},
        {"shot": "high/desktop/R13", "note": "Brick commercial blocks with awnings; same module repeats across R04/R14/R16."},
        {"shot": "high/desktop/R06", "note": "Arlington on an empty lawn; pale world-edge band at x 0-340, y 400-500."},
        {"shot": "high/desktop/R05", "note": "Fordyce stands on a wide bare baseplate lawn."},
        {"shot": "high/desktop/R09", "note": "Field of near-identical pines around Goat Rock."},
        {"shot": "high/desktop/R11", "note": "Faded near-camera tree fills the right ~40% of the frame."}
      ]
    },
    "lighting": {
      "score": 6.0,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R07", "note": "Deliberate dusk palette and crew fill; lamp pools clip to (255,182,128), near road a flat (55,41,43)."},
        {"shot": "high/desktop/R11", "note": "Sunset palette is good; under-tree areas go murky."},
        {"shot": "high/desktop/R13", "note": "Day key light is flat, with no crevice AO under cornices or in window reveals and no bounce."},
        {"shot": "high/desktop/R03", "note": "Sun shadows and contact shadows ground the crews."}
      ]
    },
    "animation": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "strips/high/R15", "note": "Crew runs a circuit around the tub with swinging rigid limbs; bead splash bursts and clears."},
        {"shot": "strips/high/R16", "note": "Circling at the judge stop reads; a faded rival passes."},
        {"shot": "strips/high/R14", "note": "Slide yaws the tub and splays the crew; beads sit as detached clusters in the bottom ~20% of frames 3-8; no visible slosh or camera kick."}
      ]
    },
    "ui": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Clear HUD hierarchy: lap/time, place, item slot, water gauge with checklist, map."},
        {"shot": "high/desktop/R01", "note": "Stud-topped 1x4 brick buttons, red Grand Prix brick."},
        {"shot": "high/desktop/R18", "note": "Stud-row plate panel, consistent table."},
        {"shot": "high/landscape/R02", "note": "Pinned buttons half-cover the 'Captain:' line; stat bars show under the button bar."},
        {"shot": "high/mobile/R02", "note": "Heading sits on top of the stud row."}
      ]
    },
    "typography": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R01", "note": "Pixel display face plus bold sans form a clear scale; the 8-bit face fights the toy look."},
        {"shot": "high/desktop/R03", "note": "HUD white fill on pale sky is 1.6:1, carried by the outline (10.4:1)."},
        {"shot": "high/mobile/R04", "note": "Item labels about 8-9 CSS px tall."},
        {"shot": "high/landscape/R02", "note": "Description text clipped behind the button bar."}
      ]
    },
    "readability": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R03", "note": "Team-colour outlined ring makes the player's tub obvious."},
        {"shot": "high/mobile/R04", "note": "Ring reads on the phone too."},
        {"shot": "high/desktop/R19", "note": "Player's tub partly behind translucent foreground geometry and bead clusters; ring mostly hidden."},
        {"shot": "high/desktop/R11", "note": "Right 40% lost to a ghosted tree."},
        {"shot": "high/desktop/R07", "note": "Pack merges into one colour mass."},
        {"shot": "high/desktop/R16", "note": "Judge stop reads via the HUD sign; the booth is a plain box."}
      ]
    },
    "mobile": {
      "score": 7.0,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/mobile/R04", "note": "HUD stacked top, controls bottom; tub's bottom edge at y~590/844, controls start at y~715."},
        {"shot": "high/landscape/R03", "note": "Steer pill and action buttons in the corners, clear of the tub."},
        {"shot": "high/mobile/R02", "note": "Choose and Back both visible; 'Handling' row cut."},
        {"shot": "high/landscape/R02", "note": "Only one clipped description line visible in landscape team select."}
      ]
    },
    "authenticity": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R14", "note": "Central Avenue: Row with red roofs and the dome on one side, commercial blocks opposite."},
        {"shot": "high/desktop/R06", "note": "Arlington twin towers close the vista; colour olive-grey, not buff."},
        {"shot": "high/desktop/R16", "note": "Judge stop with Ring Around the Tub task; booth generic."},
        {"shot": "high/desktop/R04", "note": "Water gauge with 10-gal line, towel/bath/soap/loofah checklist, duck and flag on every tub."},
        {"shot": "high/desktop/R19", "note": "Gulpha Creek ford reads as a blue tiled pool."},
        {"shot": "high/desktop/R09", "note": "White novaculite-like Goat Rock, but in a flat field."}
      ]
    }
  },
  "ab": {
    "characters": {"winner": "B", "confidence": 0.9, "pairs": ["crop-R02-preview", "crop-R02-preview-captain", "crop-R03-player", "crop-R03-kart_5", "high-desktop-R03", "high-desktop-R08"], "note": "B adds printed faces and uniforms, team hats, rounded duck, hubbed wheels; A is plain boxes with X straps."},
    "materials": {"winner": "B", "confidence": 0.7, "pairs": ["high-desktop-R04", "high-desktop-R13", "high-desktop-R06", "crop-R02-preview-captain"], "note": "B builds commercial fronts from brick with modelled frames; A's painted fronts are noisy; B's glossy bevelled parts beat A's flat boxes."},
    "scenery": {"winner": "B", "confidence": 0.7, "pairs": ["high-desktop-R04", "high-desktop-R10", "high-desktop-R13", "high-desktop-R14"], "note": "A's R04 rail juts across the sidewalk; A's R10 has a tan-olive pine; B's blocks are built from parts."},
    "lighting": {"winner": "B", "confidence": 0.55, "pairs": ["high-desktop-R07", "high-desktop-R11", "high-desktop-R12"], "note": "B crews carry dusk fill and pushers have contact shadows; otherwise close."},
    "animation": {"winner": "B", "confidence": 0.6, "pairs": ["strip-R14", "strip-R15", "strip-R16"], "note": "B spray is water-coloured beads vs A's grey smoke puffs; B fumble splash is smaller and cleaner; motion otherwise similar."},
    "ui": {"winner": "B", "confidence": 0.75, "pairs": ["high-desktop-R02", "high-desktop-R18", "high-mobile-R01", "high-landscape-R01", "high-desktop-R16"], "note": "B has stud-topped brick buttons, stud-row panels and a studded judge-task sign; A has flat pills."},
    "typography": {"winner": "tie", "confidence": 0.6, "pairs": ["high-desktop-R01", "high-desktop-R18", "high-landscape-R01"], "note": "Same faces and scale."},
    "readability": {"winner": "B", "confidence": 0.75, "pairs": ["high-desktop-R03", "high-desktop-R08", "high-desktop-R11", "high-desktop-R13", "high-mobile-R04"], "note": "B adds the team-colour player ring; A's near trees sparkle with per-pixel noise, B's fade smoothly."},
    "mobile": {"winner": "B", "confidence": 0.75, "pairs": ["high-mobile-R02", "high-landscape-R02", "high-landscape-R01", "high-mobile-R04"], "note": "A cuts Choose and loses Back on portrait and shows no buttons in landscape; B shows both in both orientations."},
    "authenticity": {"winner": "B", "confidence": 0.55, "pairs": ["high-desktop-R16", "high-desktop-R06", "high-desktop-R14"], "note": "B's judge booth faces the road with judges in front; B's Arlington is a cleaner window grid. R09 pair shows different views and is excluded."}
  },
  "ip": {"clean": true, "notes": "No LEGO name or logo seen. Rounded box heads, rectangular torsos and block fists: no cylinder head, trapezoid torso or C-hands. The shield-print fire helmet and dot-eye faces are generic conventions."},
  "gaps": [
    {"id": "G-near-camera-foliage", "category": "readability", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R11", "high/desktop/R19", "high/desktop/R04", "high/desktop/R16"], "benchmark": "drive-3", "fix": "Hide (opacity 0) any tree whose bounds enter the camera-to-player corridor or come within ~6 m of the camera, instead of half-fading it, or keep tree placement out of that corridor. Test: no race frame has more than 10% of pixels covered by foliage with alpha below 1."},
    {"id": "G-flat-asphalt", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R04", "high/desktop/R07"], "benchmark": "worlds-1", "fix": "Give asphalt ABS gloss (sun and sky specular lobe) plus low-contrast large-plate tiling or a subtle grain. Test: sigma at least 3 over the R04 (820-1000,600-700) patch and a visible sun highlight on the road in day frames."},
    {"id": "G-painted-brick-walls", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS1", "evidence": ["high/desktop/R13", "high/desktop/R05"], "benchmark": "worlds-1", "fix": "Add a per-brick bevel normal map so each brick edge catches the key light, plus mortar AO; on High use instanced brick courses on the nearest facades. Test: individual bricks show a lit top edge in an R13 close-up."},
    {"id": "G-day-ao-bounce", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R13", "high/desktop/R05", "high/desktop/R07"], "benchmark": "worlds-4", "fix": "Add SSAO or baked AO to cornices, window reveals, building corners and eaves; add a ground-colour hemisphere bounce; tone-map the lamp pools. Test: eave and corner pixels at least 15% darker than the open wall in R13, and no lamp-pool pixel at 255."},
    {"id": "G-water-slosh", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["crops/high/R02-preview-captain", "strips/high/R14", "strips/high/R15"], "benchmark": "drive-3", "fix": "Tilt the bath-water plane with lateral acceleration and spill a few beads over the rim on hard slides and fumbles. Test: the water angle visibly changes across the R14 frames."},
    {"id": "G-empty-landmark-lawns", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06", "high/desktop/R09"], "benchmark": "drive-1", "fix": "Extend terrain into brick-built rolling hills and tree belts up to the backdrop; add brick hedges, fountains, benches, the Grand Promenade wall and path tiles to the landmark grounds. Test: no flat empty baseplate area over 20% of a landmark frame and no visible ground-to-sky seam in R06."},
    {"id": "G-slide-spray", "category": "animation", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R14"], "benchmark": "drive-3", "fix": "Emit slide beads from the rear-wheel contact points with velocity-inherited arcs, a shorter life and size falloff; add a small camera FOV kick and speed lines when hot steam fires. Test: R14 beads stay within one tub-length of the wheels."},
    {"id": "G-ford-water", "category": "authenticity", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R19"], "benchmark": "bj-2", "fix": "Make the ford translucent trans-clear-blue tiles over a visible creek bed, with scrolling glints and a bead splash when a tub crosses. Test: the stones or creek bed are visible through the water in R19."},
    {"id": "G-hud-typeface", "category": "typography", "expectedGain": 0.5, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R03", "high/mobile/R04", "high/desktop/R01"], "benchmark": "drive-3", "fix": "Replace the 8-bit pixel display face with a chunky rounded brick-style face, or set the LAP, time and place readouts on bevelled tiles; raise phone item labels to at least 11 CSS px. Test: HUD text fill contrast at least 3:1 against its tile."},
    {"id": "G-landscape-teamselect", "category": "mobile", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R02", "high/mobile/R02"], "benchmark": "drive-2", "fix": "End the scroll area above the pinned button plate with a solid background and fade; in landscape put the description and stats in a column beside the turntable. Test: no text intersects the button bar."},
    {"id": "G-judge-booth", "category": "authenticity", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R16", "strips/high/R16"], "benchmark": "worlds-1", "fix": "Build the judge booth from brick parts with a printed JUDGES sign and striped canopy; give the judges blazers or referee stripes and clipboards so they don't look like the crowd."},
    {"id": "G-tub-faceting", "category": "characters", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R02-preview-captain", "crops/high/R03-kart_1"], "benchmark": "drive-4", "fix": "Raise LOD1 tub radial segments to 16-24 with smooth normals and add a thin rolled-rim bevel. Test: no straight facet edge longer than 20 px on the rim in crops/high/R02-preview-captain."}
  ]
}
```
