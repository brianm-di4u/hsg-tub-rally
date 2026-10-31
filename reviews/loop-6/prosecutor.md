# Prosecutor, loop 6: Spa City Tub Rally (high tier)

## Summary
The critics' means total 65.75. I propose 62.0. Both critics scored the racers and the menus fairly, but they gave the world, the effects and the phone layout more credit than the anchors allow. Four things drive my reductions:
- **No transparent parts.** No surface outside the figures and tubs reads as plastic, and nothing anywhere reads as clear: the windows, the tub water, the ford and the bubbles are all opaque.
- **Feedback is missing.** The "power slide charging hot steam" moment shows no charge cue at all. The slide strip ends with the tub mounting the sidewalk beside a lamp post with no reaction. The steam is solid beads.
- **The HUD tiles still collide on phones.** This loop's change list says the landscape minimap now sits clear of the place tile. The pixels say it still overlaps by about 6 device px.
- **Rival tubs are unreadable in packs.** The pack frames show crews, not tubs.

Some critic claims were wrong in the developer's favour, and I don't use them:
- The firefighter helmets do carry two studs each (`crops/high/R15-player`, helmet tops).
- The canopy tops in `high/desktop/R05` are studded.
- `high/desktop/R07` does have faint warm pools on the right sidewalk (visible after a contrast stretch).

The critic means per category: characters 6.75, materials 6.25, scenery 6.25, lighting 6.25, animation 6.25, ui 7.0, typography 6.75, readability 6.75, mobile 6.75, authenticity 6.75.

Method: I opened every high desktop, phone and landscape frame, every high close-up, the three high strips (enlarged frame by frame) and the low phone frames. I measured in my own scratch folder, and pixel coordinates are in the capture's own pixels.

## Characters: 6.5 (mean 6.75)
The 7 anchor asks for bevelled parts with seams, studs on hats and tubs, tubs built from recognisable brick parts, and close-ups that hold up.
- **Met.** The printed faces and uniforms are crisp and expressive (`crops/high/R02-preview-captain`, `crops/high/R04-kart_3`). The helmets have studs (`crops/high/R15-player`). The hands are mitten fists with a thumb nub. These would justify a 7 by themselves.
- **No seams.** There are no part seams at the neck, shoulder or hip (`crops/high/R02-preview-rear`).
- **Held items aren't gripped.** The towel is a flat white card passing through the fist (`crops/high/R02-preview-rear`, x≈455–545, y≈430–600). The pink soap sinks into the fist instead of being held (`crops/high/R04-player`, x≈830–880, y≈420–460).
- **One-piece tub shells.** Every tub shell is a smooth moulding with a painted stripe (`crops/high/R02-preview`, `crops/high/R03-kart_1`, `crops/high/R04-kart_3`). Only the chassis plates and wheels read as parts.
- **Smear in the close-ups.** The close-ups carry a stair-stepped grey smear behind the wheels (`crops/high/R03-kart_5`, x≈700–960, y≈560–720, enlarged 3×), so they do not "hold up".
- **Spectators are a lower-grade figure.** They appear in nearly every race frame as matte, unbevelled block people with box arms ending in stubs and no sheen (`high/desktop/R15`, enlarged x 60–250, y 400–640). That is the 5 anchor's "boxy people" sharing the frame with the toys.

This is below the 7 line, not on it.

## Materials: 5.5 (mean 6.25)
Codex's 6.5 rests on the hats, the duck and the tub rims, which are only the racers. The 7 anchor (`worlds-1`) wants plastic across the world and "clear parts that read as transparent plastic". The 5 anchor names "surfaces read as painted card… textures from a different style than the models". Most of each frame is the 5 description.
- **No surface reads as clear, anywhere.**
  - The windows are opaque blue panels with one painted diagonal glint (`high/desktop/R13`; the arched windows in `crops/high/R04-kart_3`, x≈1060–1225, y≈90–275).
  - The tub water is a flat opaque blue plane (`crops/high/R02-preview-captain`).
  - The Gulpha Creek ford is opaque blue tiles flush with the path (`high/desktop/R19`, x≈430–960, y≈320–440).
  - The pickup bubbles are opaque pastel discs (`high/desktop/R17`, x≈1095–1200, y≈390–490).
- **Texture and geometry from different styles.** Goat Rock puts a brick-course texture on smooth prisms (`high/desktop/R09`).
- **Untextured horizon.** The horizon rings are flat, untextured planes (`high/desktop/R09`, x 640–1280, y 0–200).
- **Landmark lawns aren't baseplates.** They are flat noise textures with no studs (`high/desktop/R06`, x 0–300, y 420–620; `high/desktop/R05`, x 880–1280, y 400–640). The studded verge in `high/desktop/R08` exists only beside the road.
- **Trees are matte.** They are matte green with no specular (`high/desktop/R16`, canopy x 160–430, y 80–330). Their tops are studded in `R05`, which I credit.
- **The wheel smear** (`crops/high/R04-player`, `crops/high/R03-kart_5`) is a render artefact on the most-viewed asset.

The racers lift this above 5, and nothing else does.

## Scenery: 6.0 (mean 6.25)
I accept Codex's reading over Critic A's.
- **The mountains are walls.** In six frames they are vertical, flat-topped walls with a row of stepped triangles on top: `high/desktop/R09` (enlarged x 640–1280, y 0–200), `high/desktop/R12` (left), `high/desktop/R06` (a flat green slab, x 0–440, y 200–500), `R05`, `R17` and `R19`.
- **The buildings are textured boxes**, not brick builds (`high/desktop/R13`).
- **Course set pieces are missing.** The plaza is an empty disc (`high/desktop/R17`). The judge booth is a featureless white box under a red slab (`high/desktop/R16`, x 240–430, y 310–470). The ford is blue paving (`high/desktop/R19`).
- **Near-camera trees still fill the frame**, despite this loop's 1.3 m step-aside:
  - `high/desktop/R11`: the right conifer covers x≈780–1280 from the top edge to y≈590, about a quarter of the frame.
  - `high/desktop/R10`: the left canopy covers x 0–430, y 0–470.
  - `high/desktop/R19`: the right canopy covers x≈700–1280, y 0–330.

The tile roads, studded verges, awnings, crowds, Fordyce and Arlington keep this off 5.

## Lighting: 6.0 (mean 6.25)
Against the 7 anchor (AO in crevices and under figures, contact shadows that ground every tub, a deliberate dusk palette):
- **Dusk is still murky.** In `high/desktop/R07`, 21.9% of the central half is below luma 40 (mean 67.4), and the phone frame `high/mobile/R07` is 20.5%. Codex's "useful pools of lamplight" is half true: after a contrast stretch there are faint warm pools on the right sidewalk, but the road where the pack runs gets none.
- **Sunset darkens the trees.** In `high/desktop/R11`, 13.7% of the centre is below luma 40, and the near trees go brown-black.
- **No AO.** There is none at the wall base or under the canopies (`high/desktop/R04`, x 0–520, y 330–620), and no contact darkening at the spectators' feet (`high/desktop/R03`, x 900–1280, y 330–480).
- **Shadows don't match their casters.** The tree shadows on the road are rounded, blurred blobs that do not follow the stepped tiers of the conifers casting them (`high/desktop/R08`, x 700–1280, y 380–800; `high/mobile/R08`, bottom third). Critic A called the `R19` plaza shadows "crisp", but enlarged (x 150–450, y 520–700) they are soft and wobbly.
- **Credit:** the hazed horizon rings and the clear day key light.

## Animation and feel: 6.0 (mean 6.25)
The 7 anchor has three parts. The crew circle convincingly with toy articulation (`strips/high/R15`, `strips/high/R16`), and I credit that. The other two parts fail:
- **Slides and boosts lack readable feedback.**
  - The single frame that names the moment, `high/desktop/R14` ("power slide charging hot steam"), shows no charge cue at the tub: no glow, sparks or steam (enlarged x 480–780, y 350–660).
  - In `strips/high/R14`, frames 3–8, the slide "steam" is tight clusters of 5–7 opaque grey spheres. Their size doesn't change from frame to frame, and they sit on the road up to a tub-width from the wheels.
  - In frames 7–8 the tub crosses the curb onto the sidewalk beside a lamp post and carries on with no bump, crew stumble or camera response.
  - Hot steam is a stack of solid, glossy orange balls behind the tub (`high/desktop/R17`, x≈610–670, y≈540–575; `high/mobile/R17`). Warm steam is the same in white (`high/desktop/R19`).
- **No camera kick and no slosh.** No camera kick appears in any of the 24 strip frames. The water plane stays level through the fumble (`strips/high/R15`).

"Weak feedback" (the 5 anchor) describes the slide better than "reads with particles and camera kick" (the 7 anchor).

## UI / HUD: 6.5 (mean 7.0)
The 7 anchor says "nothing overlapping" and "one style". Both are broken in the captures.
- **Landscape overlap, contrary to this loop's change note.**
  - In `high/landscape/R17` at x=1600, the minimap's outline occupies y 184–189. At x=1450 (outside the minimap), the place tile's bottom bevel runs to y 189 and its outline to y 195. So the minimap is drawn about 6 device px over the place tile.
  - `high/landscape/R04` shows the same rows.
  - The water tile abuts the LAP tile with zero gap: at x=150 in `high/landscape/R17`, the LAP outline ends at y 175 and the water tile rim starts at y 176.
- **Portrait overlap.** The item orb overlaps the place tile by about 5 px (`high/mobile/R04` at x=578, where the tile fill stops at y 127 instead of 132). It is a larger, more visible overlap in `high/mobile/R17`.
- **The touch controls are a second style.** The four buttons are flat rounded rectangles in unrelated colours, and the steer pad is translucent: the sidewalk tiles show through it in `high/landscape/R04`. The menus use studded brick buttons (`high/desktop/R01`, `high/mobile/R02`).
- **Unexplained elements.** The desktop item orb floats unframed, and the yellow "▮ 0" counter and the Towel/Bath/Soap/Loofah strip are unlabelled (`high/desktop/R04`).

## Typography: 6.5 (mean 6.75)
- **Awkward breaks.** `high/landscape/R02` breaks "The Out- / of- / Towners" over three lines and orphans "· locked" on its own line under Gator Gang.
- **Low-contrast locked labels.** They measure 3.26:1 ((120,150,174) on (26,68,106), `high/mobile/R02`), below 4.5:1 for small text.
- **Small labels.** The desktop key-strip labels are about 10 px (`high/desktop/R04`).
- **Misaligned results rows.** At 390 px the WATER column stacks "25 gal" above the CLEAN badge, so it no longer aligns with the TIME figures in the same row, and the player's team name wraps (`high/mobile/R18`).
- **Credit:** the numerals read well in the pixel face.

## Readability: 6.0 (mean 6.75)
Codex's 7.0 conflicts with the anchor's "every tub… and judge stop reads in every frame".
- **Rival tubs hide behind crews.** At native size, the rival tubs ahead of the player are covered by their four-figure crews. Only the cowboys' barrel shows a shell (`high/desktop/R04`, x≈530–560, y≈390–440). `high/desktop/R12` and `high/desktop/R11` are the same.
- **The dusk pack is a dark mass** on the phone (`high/mobile/R07`).
- **Big occluders.** A single near conifer covers about a quarter of `high/desktop/R11`.
- **The judge is hard to find.** The striped judge stands behind a maroon spectator, and the booth carries no sign (`high/desktop/R16`, x 200–620, y 280–500).
- **The slide gives no visual cue** (`high/desktop/R14`).
- **Credit:** the player's ring and arrow stand out in every frame, and the road edges are clear.

## Mobile: 6.5 (mean 6.75)
- **Met:** the thumbs never cover the tub in `high/mobile/R04` or `high/landscape/R04`, and the swiftshader floor (50 fps) clears 30.
- **Little clear view in portrait.** The top HUD stack ends at about y 395, and the minimap starts at about y 1220, so only about 49% of the 1688 px height is clear full-width view (`high/mobile/R04`).
- **Landscape stacking.** The HUD tiles collide (see UI, `high/landscape/R17`), and a rival crew peeks out from under the water tile at the left edge.
- **Cramped landscape team cards** (`high/landscape/R02`, broken names).

That is "framed", not yet "framed on purpose".

## Authenticity: 6.5 (mean 6.75)
- **Credit:** the Row and the Arlington pass (`high/desktop/R05`, `high/desktop/R06`), and the race's paraphernalia is all there (gauge, ducks, flags, CLEAN results in `high/desktop/R18`).
- **The mountains don't read as the Ouachitas.** They read as crenellated walls (`high/desktop/R09`, `high/desktop/R06`).
- **Goat Rock is a mound on flat ground.** It is a heap of white brick-textured prisms on a flat lawn with no overlook or vista (`high/desktop/R09`).
- **The judges are barely visible** (`high/desktop/R16`).
- **Gulpha Creek reads as blue paving** (`high/desktop/R19`).
- **The other courses are unnameable** (`high/desktop/R08`, `R10`, `R11`, `R12`).

I round down rather than cut further.

## IP check
Clean.
- **Racers.** They have rounded-cuboid heads, not cylinders (`crops/high/R02-preview-captain`), straight-sided box torsos, not trapezoids (`crops/high/R02-preview-rear`), and mitten fists with a thumb nub, not C-hands (`crops/high/R02-preview-captain`, enlarged x 360–800, y 220–380).
- **Studs and logos.** The helmet studs (`crops/high/R15-player`), the canopy studs (`high/desktop/R05`) and the menu button studs are plain, with no lettering. I found no LEGO name or logo anywhere.
- **Spectators.** They are capped block people (`high/desktop/R15`, `high/desktop/R16`). I found no brown-hair, cyan-shirt figure.

## Gaps the critics missed
1. **G-hud-tile-collisions** (ui; WS6; severity 2; effort S; gain +0.5 ui, +0.3 mobile)
   - Problem: the landscape minimap is drawn about 6 px over the place tile, the water tile abuts the LAP tile with no gap, and the portrait orb overlaps the place tile (`high/landscape/R17`, `high/landscape/R04`, `high/mobile/R17`, `high/mobile/R04`).
   - Fix: lay the HUD out in flex columns with a gutter of at least 8 CSS px, and give the orb its own slot.
   - Test: a DOM bounding-rect check at 390×844 and 844×390 reports zero intersections.
2. **G-steam-beads** (animation; WS3; severity 3; effort S; gain +0.5)
   - Problem: the steam is clusters of opaque, specular spheres that neither grow nor fade, and they sit detached from the wheels (`strips/high/R14` frames 3–8, `high/desktop/R17`, `high/desktop/R19`).
   - Fix: spawn soft, alpha-faded puffs at the wheel contact that grow 2–3× and fade out over about 0.5 s.
   - Test: in the strips, the puff radius rises and the opacity falls across consecutive frames.
3. **G-slide-cue-impact** (animation; WS3; severity 3; effort M; gain +0.5)
   - Problem: there is no charge cue during the slide (`high/desktop/R14`), and the tub mounts the curb beside a lamp post with no response (`strips/high/R14` frames 7–8).
   - Fix: add a tier-coloured glow and sparks at the rear wheels while charging. On a curb or obstacle hit, add a tub hop, a crew stumble and a 100–150 ms camera shake.
   - Test: the R14 frame shows the cue, and a curb contact in a strip shows the bounce and a camera offset.
4. **G-near-tree-cull** (readability; WS5; severity 3; effort S; gain +0.5 readability, +0.3 scenery)
   - Problem: single near trees cover 20–25% of the chase frames (`high/desktop/R11`, `R10`, `R19`) and sit behind the LAP tile (`high/desktop/R08`, `high/mobile/R08`).
   - Fix: fade or cull tree instances inside a cone around the camera-to-tub sightline, and widen the tree setback on mountain courses.
   - Test: no single tree covers more than 8% of R08, R10, R11 or R19.
5. **G-clear-parts** (materials; WS1; severity 3; effort M; gain +0.5)
   - Problem: nothing reads as transparent: not the windows, the tub water, the ford or the bubbles (`high/desktop/R13`, `crops/high/R02-preview-captain`, `high/desktop/R19`, `high/desktop/R17`).
   - Fix: add a shared translucent plastic material with Fresnel and sky reflection for glass and water, and let the ford show its bed.
   - Test: the stones under the ford are visible in R19, and the windows reflect the sky in R13.
6. **G-lawn-baseplate** (materials; WS4; severity 2; effort M; gain +0.3)
   - Problem: the landmark lawns are flat noise textures without studs (`high/desktop/R05`, `high/desktop/R06`).
   - Fix: use the studded baseplate material on all open lawns, with a stud normal-map LOD at distance.
   - Test: studs are visible in the R05 lower-right and R06 lower-left lawns.
7. **G-judge-booth** (authenticity; WS4; severity 2; effort S; gain +0.3 authenticity, +0.2 readability)
   - Problem: the booth is a blank white box, and the judge is hidden behind a spectator (`high/desktop/R16`).
   - Fix: build a brick booth with a "JUDGE" sign and a flag, and place the judge in front of the crowd line, facing the road.
   - Test: R16 shows the judge's full figure and a readable sign.
8. **G-spectator-finish** (characters; WS5; severity 2; effort M; gain +0.3)
   - Problem: the spectators are matte and unbevelled, with stub arms (`high/desktop/R15`, `high/desktop/R16`).
   - Fix: give them the racers' bevelled glossy material and mitten hands, with a distance LOD.
   - Test: edge highlights and hands are visible on the R15 spectators.
9. **G-shadow-fidelity** (lighting; WS1; severity 2; effort M; gain +0.3)
   - Problem: the road shadows are rounded blobs that do not follow the stepped tree tiers (`high/desktop/R08`, `high/mobile/R08`).
   - Fix: tighten the near shadow cascade and its resolution on high.
   - Test: the stepped tier edges are visible in the R08 road shadows.
10. **G-touch-control-style** (ui; WS6; severity 2; effort S; gain +0.3)
    - Problem: the flat coloured buttons and the translucent steer pad don't match the studded brick buttons in the menus (`high/mobile/R04`, `high/landscape/R04`, `high/mobile/R02`).
    - Fix: restyle the controls as opaque brick buttons with stud rows in the HUD palette.
    - Test: the controls share the menu buttons' border, stud row and fill.

```json
{
  "loop": 6,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "characters": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "crops/high/R02-preview-rear", "note": "no seams at neck/shoulder/hip; towel is a flat card passing through the fist (x~455-545, y~430-600)" },
        { "shot": "crops/high/R04-player", "note": "soap sinks into the fist rather than being gripped (x~830-880, y~420-460); grey stair-stepped smear behind the right wheel" },
        { "shot": "crops/high/R03-kart_5", "note": "stair-stepped grey smear behind the wheel (x~700-960, y~560-720): close-up does not hold up" },
        { "shot": "crops/high/R02-preview", "note": "tub shell is one smooth moulding with a painted stripe; only the chassis reads as parts" },
        { "shot": "crops/high/R15-player", "note": "credit: helmets do carry two studs; printed faces crisp" },
        { "shot": "high/desktop/R15", "note": "spectators are matte unbevelled block people with stub arms beside glossy racers" }
      ]
    },
    "materials": {
      "score": 5.5,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R13", "note": "windows opaque blue with a painted diagonal glint; facades flat textures" },
        { "shot": "high/desktop/R19", "note": "Gulpha Creek ford is opaque blue tiles flush with the path: no clear part anywhere" },
        { "shot": "crops/high/R02-preview-captain", "note": "racers are convincing ABS, but tub water is a flat opaque plane" },
        { "shot": "high/desktop/R09", "note": "Goat Rock is a brick texture on smooth prisms; horizon rings untextured flat planes" },
        { "shot": "high/desktop/R06", "note": "landmark lawn is flat noise texture with no studs (x 0-300, y 420-620)" },
        { "shot": "crops/high/R03-kart_5", "note": "grey stair-stepped smear behind the wheels" }
      ]
    },
    "scenery": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R09", "note": "horizon is vertical flat-topped walls with stepped triangles (x 640-1280, y 0-200)" },
        { "shot": "high/desktop/R06", "note": "mountain is a flat green slab (x 0-440, y 200-500); lawn flat" },
        { "shot": "high/desktop/R11", "note": "one near conifer covers x~780-1280 from the top edge to y~590, about a quarter of the frame" },
        { "shot": "high/desktop/R16", "note": "judge booth is a featureless white box under a red slab" },
        { "shot": "high/desktop/R17", "note": "plaza is an empty disc" }
      ]
    },
    "lighting": {
      "score": 6.0,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/desktop/R07", "note": "21.9% of the central half below luma 40; faint lamp pools on the right sidewalk only, none on the road" },
        { "shot": "high/mobile/R07", "note": "20.5% of the centre below luma 40; pack is a dark mass" },
        { "shot": "high/desktop/R11", "note": "13.7% of the centre below luma 40; near trees brown-black" },
        { "shot": "high/desktop/R08", "note": "road shadows are rounded blurred blobs that do not follow the stepped conifer tiers" },
        { "shot": "high/desktop/R04", "note": "no AO at the wall base or under the canopies" }
      ]
    },
    "animation": {
      "score": 6.0,
      "confidence": 0.65,
      "evidence": [
        { "shot": "strips/high/R14", "note": "frames 3-8: steam is opaque grey bead clusters, constant size, detached from the wheels; frames 7-8: tub mounts the sidewalk by a lamp post with no reaction; no camera kick" },
        { "shot": "high/desktop/R14", "note": "the 'charging hot steam' moment shows no charge cue at the tub" },
        { "shot": "strips/high/R15", "note": "credit: crew circle with toy articulation; water spheres are opaque balls; water plane stays level" },
        { "shot": "strips/high/R16", "note": "credit: circling reads; no camera response" },
        { "shot": "high/desktop/R17", "note": "hot steam is a stack of solid glossy orange balls" }
      ]
    },
    "ui": {
      "score": 6.5,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/landscape/R17", "note": "minimap outline at y 184-189 over the place tile's bevel (x=1600 vs x=1450): about 6 device px overlap, contrary to the change note; water tile abuts the LAP tile with 0 px gap" },
        { "shot": "high/landscape/R04", "note": "same minimap/place overlap; translucent steer pad shows the sidewalk through it" },
        { "shot": "high/mobile/R04", "note": "item orb overlaps the place tile by ~5 px; touch buttons are flat coloured rectangles, not the menu's brick buttons" },
        { "shot": "high/desktop/R04", "note": "unframed item orb; unlabelled yellow counter and Towel/Bath/Soap/Loofah strip" },
        { "shot": "high/desktop/R18", "note": "credit: clean results panel" }
      ]
    },
    "typography": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/landscape/R02", "note": "'The Out- / of- / Towners' over three lines; '· locked' orphaned" },
        { "shot": "high/mobile/R02", "note": "locked sub-labels 3.26:1 contrast, below 4.5:1" },
        { "shot": "high/mobile/R18", "note": "WATER stacks '25 gal' over CLEAN, misaligned with TIME; team name wraps" },
        { "shot": "high/desktop/R04", "note": "~10 px key-strip labels; numerals read well (credit)" }
      ]
    },
    "readability": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "rival tubs covered by their crews; only the cowboys' barrel shows a shell (x~530-560, y~390-440)" },
        { "shot": "high/mobile/R07", "note": "dusk pack is a dark mass" },
        { "shot": "high/desktop/R11", "note": "a single near conifer covers about a quarter of the frame" },
        { "shot": "high/desktop/R16", "note": "striped judge hidden behind a maroon spectator; booth carries no sign" },
        { "shot": "high/desktop/R14", "note": "power slide has no visual cue" },
        { "shot": "high/mobile/R04", "note": "credit: player ring and arrow stand out" }
      ]
    },
    "mobile": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/mobile/R04", "note": "HUD stack ends ~y 395, minimap from ~y 1220: ~49% clear full-width view; thumbs clear the tub (credit)" },
        { "shot": "high/landscape/R17", "note": "HUD tiles collide; a rival crew peeks out from under the water tile at the left edge" },
        { "shot": "high/landscape/R02", "note": "cramped team cards with broken names; preview tub now fully visible (credit)" }
      ]
    },
    "authenticity": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R05", "note": "credit: Fordyce recognisable" },
        { "shot": "high/desktop/R06", "note": "credit: Arlington closes the vista; but the mountain behind it is a flat wall" },
        { "shot": "high/desktop/R09", "note": "Goat Rock is a mound of white brick-textured prisms on flat lawn, no overlook; ridges read as walls" },
        { "shot": "high/desktop/R16", "note": "judges barely visible" },
        { "shot": "high/desktop/R19", "note": "Gulpha Creek reads as blue paving" }
      ]
    }
  },
  "ip": {
    "clean": true,
    "notes": "Rounded-cuboid heads, straight box torsos, mitten fists with a thumb nub; helmet, canopy and button studs are plain; no LEGO name or logo; spectators are capped block people, no brown-hair cyan-shirt figure."
  },
  "gaps": [
    { "id": "G-hud-tile-collisions", "category": "ui", "expectedGain": 0.5, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R17", "high/landscape/R04", "high/mobile/R17", "high/mobile/R04"], "benchmark": "drive-3", "fix": "Lay out the HUD tiles in flex columns with a gutter of at least 8 CSS px and give the item orb its own slot; test: a DOM bounding-rect check at 390x844 and 844x390 reports zero intersections." },
    { "id": "G-steam-beads", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R14", "high/desktop/R17", "high/desktop/R19"], "benchmark": "drive-3", "fix": "Replace the opaque sphere clusters with soft alpha-faded puffs spawned at the wheel contact that grow 2-3x and fade over ~0.5 s; test: puff radius rises and opacity falls across consecutive strip frames." },
    { "id": "G-slide-cue-impact", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["high/desktop/R14", "strips/high/R14"], "benchmark": "drive-3", "fix": "Add a tier-coloured glow and sparks at the rear wheels while charging, and a curb/obstacle hit response (tub hop, crew stumble, 100-150 ms camera shake); test: the R14 frame shows the cue, and a curb contact in a strip shows the bounce and a camera offset." },
    { "id": "G-near-tree-cull", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R11", "high/desktop/R10", "high/desktop/R19", "high/desktop/R08", "high/mobile/R08"], "benchmark": "drive-3", "fix": "Fade or cull tree instances inside a cone around the camera-to-tub sightline and widen the tree setback on mountain courses; test: no single tree covers more than 8% of R08, R10, R11 or R19." },
    { "id": "G-clear-parts", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R13", "crops/high/R02-preview-captain", "high/desktop/R19", "high/desktop/R17"], "benchmark": "worlds-1", "fix": "Add a shared translucent plastic material with Fresnel and sky reflection for windows and water, and let the ford show its bed; test: the stones under the ford are visible in R19 and the windows reflect the sky in R13." },
    { "id": "G-lawn-baseplate", "category": "materials", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06"], "benchmark": "worlds-1", "fix": "Use the studded baseplate material on all open lawns, with a stud normal-map LOD at distance; test: studs visible in the R05 lower-right and R06 lower-left lawns." },
    { "id": "G-judge-booth", "category": "authenticity", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R16", "strips/high/R16"], "benchmark": "worlds-1", "fix": "Build a brick judge booth with a JUDGE sign and flag, and place the judge in front of the crowd line facing the road; test: R16 shows the judge's full figure and a readable sign." },
    { "id": "G-spectator-finish", "category": "characters", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R15", "high/desktop/R16"], "benchmark": "worlds-1", "fix": "Give spectators the racers' bevelled glossy material and mitten hands with a distance LOD; test: edge highlights and hands visible on the R15 spectators." },
    { "id": "G-shadow-fidelity", "category": "lighting", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R08", "high/mobile/R08"], "benchmark": "worlds-4", "fix": "Tighten the near shadow cascade and raise its resolution on high; test: stepped tier edges visible in the R08 road shadows." },
    { "id": "G-touch-control-style", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R04", "high/landscape/R04", "high/mobile/R02"], "benchmark": "drive-2", "fix": "Restyle the touch buttons and steer pad as opaque brick buttons with stud rows in the HUD palette; test: the controls share the menu buttons' border, stud row and fill." }
  ]
}
```
