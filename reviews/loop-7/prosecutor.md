# Prosecutor: loop 7 (high tier)

## Charge sheet
The critic means are: characters 7.0, materials 6.5, scenery 6.5, lighting 6.5, animation 6.5, UI 7.25, typography 7.0, readability 6.5, mobile 7.0 and authenticity 7.0, a total of 67.75. I argue three categories down: **materials**, **animation** and **UI**. Each charge rests on defects that neither critic recorded or that one of them understated. I accept the other seven at the mean. For those seven I list what I found, so the judge can see they were checked and that none of them should go up. My proposed total is **66.0**.

Measurements: coordinates are in each capture's own pixels. Frame-local strip coordinates assume 483×302 per frame. Crops were zoomed 2–4× with nearest-neighbour scaling.

## Categories

**Characters: accept 7.0.** The 7 anchor holds. The faces and uniforms are printed, the helmets carry studs and the tubs have claw feet. Teams differ by hat and print: antennae in `crops/high/R04-kart_3`, towel turbans in `crops/high/R03-kart_5`, and the cowboys, turbans, antennae and helmets at chase distance in `high/desktop/R03`. I found three close-up flaws the critics didn't record. None of them breaks the anchor:
- **Diagonal hatching on the back of a head.** In `crops/high/R03-player-rear` (centre pusher, x≈600–800, y≈230–330, at 4×) a band of diagonal hatching crosses the back of the head. The B side of `ab/crop-R03-player-rear` is smooth. I charge this under lighting.
- **Faceted water edge.** In `crops/high/R02-preview-captain` the tub water ends in a visibly faceted polygon, with straight segments along its left edge at 2×. It sits against the brushed-steel streaks on the inner wall that both critics saw.
- **Hidden captain face.** In `crops/high/R15-player` the captain's face is buried under his helmet brim during the fumble, so the shot loses its one expressive face.

Keep 7.0. Don't raise it.

**Materials: 6.5 → 6.0.** The critics scored the figure plastic, the lawns, Goat Rock and the ford. They missed the glazing on the Row, the game's signature street:
- **Panes stand off the facade.** In `high/desktop/R04` (x 0–150, y 260–410) two arched panes stand as flat blue-grey slabs in front of the bathhouse facade. Their mean RGB is (77,92,106) and (72,90,110). The facade texture's own painted dark arched windows show beside and above them.
- **Panes are out of register with the painted windows.** `crops/high/R04-kart_3` (x 900–1230, y 90–290) shows this clearly. Each pane is a three-segment chamfered "arch", offset from its painted opening, and the dark painted window shows past the pane's right and lower edges. `high/desktop/R18` (left facade) and `high/desktop/R16` (x 0–260, y 80–450) repeat it: two window systems sit half a bay out of register, 3D panes over painted mullioned windows. In R16 the painted surrounds are also smeared into blurred orange and blue bands.
- **Against the anchor.** The 7 anchor asks for "clear parts that read as transparent plastic". These panes read as grey tombstones.
- **The judge stand is a blank box.** In `high/desktop/R16` the judge stand is an untextured white box. Its face is mean RGB (209,213,205) with σ≈6 over a 90×110 px patch: no seams, no studs and no bevel highlight.
- **Effects are opaque shaded balls.**
  - `high/desktop/R17` "hot steam" is a clump of glossy orange spheres (x 615–653, y 542–564).
  - `high/desktop/R19` "warm steam" is white spheres.
  - The fumble splash in `strips/high/R15` is a halo of identical opaque blue beads.
  - None of these reads as steam, water or trans-clear plastic.
- **The critics' own list still stands:** the flat Arlington lawn (R06), masonry-textured Goat Rock (R09), the ford reading as grey paving (R19) and the painted horizon.

`worlds-1` sets the 7: every surface there is a coherent toy part. This is 6.0.

**Scenery: accept 6.5.** The rebuilt hill rings are a real gain (`ab/high-desktop-R05`, `ab/high-desktop-R06`). The rest of the world still falls short of 7:
- **Untextured prop.** The R16 judge stand is a white box, not a brick-built prop.
- **Near canopies fill the frame.** In `high/desktop/R10` near canopies fill about a quarter of the frame, despite the new 8 m step-aside. A green and brown colour mask over x 0–430 and 880–1280, y 0–480 gives ≈26%. `high/desktop/R19` comes to ≈20%.
- **Merged conifers.** In `high/desktop/R09` (x 820–1210, y 160–620) the tiers of three neighbouring conifers run through each other into one heap.
- **Prop clipping the camera.** In `high/desktop/R13` a lamp post fills the left edge (x 0–190, y 70–600).

These sit alongside the triangle wallpaper both critics found. Hold 6.5.

**Lighting: accept 6.5.** Critic A's dusk evidence stands: the R07 lane stays dark while the lamp pools land on the sidewalk. This loop adds one regression the critics missed:
- **New artefact on figures.** Curved figure parts now show the hatching described under characters (`crops/high/R03-player-rear`; the B side of `ab/crop-R03-player-rear` is clean). That is the classic signature of the shadow depth bias cut from about 43 cm to 6 cm.
- **The trade.** The bias cut did remove the stepped band beside the chassis (`ab/crop-R03-kart_5`), but it brought this artefact onto the figures.

On its own it isn't enough to go below 6.5, but lighting shouldn't rise until it is fixed.

**Animation: 6.5 → 6.0.** Judged from the strips:
- **The steam doesn't rise (`strips/high/R14`).** In frames 3–6 (0:03.28–0:03.68) the two white clumps hold the same frame-local positions within 4 px: centroids (174–177, 247–256) and (269–275, 261–271). Their top edges sink, from y 241 to 247 on the left and from 255 to 260 on the right. The change list promises puffs that "swell as they rise". The strip shows two clumps of white balls parked on the asphalt at the rear wheels, which never rise or trail.
- **The tub ends up inside a lamp post (`strips/high/R14` frame 8, 0:03.95).** The slide carries the tub over the kerb onto the sidewalk. A lamp post stands inside the crew: it is drawn in front of the right-rear pusher and its base sits on the player's ring. There is no hit reaction and no stop. In frame 7 the leaning crew collapse into a heap of near-horizontal bodies over the tub.
- **The fumble (`strips/high/R15`).** The splash is opaque beads. Critic A measured ±1 px of vertical shift, so the camera kick doesn't show. The captain is inert.
- **Credit (`strips/high/R16`).** The circuit around the tub reads well.

The 7 anchor needs slides and hits that read with particles and camera kick, and water that visibly sloshes. Here the kick doesn't show and no strip shows a slosh. The particles are opaque balls that ignore the promised rise, and a slide ends inside a lamp post. That is 6.0.

**UI: 7.25 → 6.5.**
- **Banner overlaps the item tile (`high/landscape/R17`).** The "HOT STEAM!" banner overlaps the item tile.
  - **Measurement.** I sampled x 720, 850 and 975. The banner's top edge is at y≈142. The tile's darker body, (18–20, 29–34, 43–52), shows through the semi-transparent banner from y 155 to 173, against banner-only (42,59,76) at x 1010. The tile edge ends at y≈176.
  - **Size.** That is about 34 device px (≈17 CSS px), about a fifth of the tile's height, and the banner butts against the item bubble.
  - **Regression.** The B side of `ab/high-landscape-R17` had clearance, so the new, taller item-plus-tickets tile caused this.
  - **Against the brief and anchor.** It contradicts the loop's "at least an 8 px gutter" claim and the anchor's "nothing overlapping". Critic A called it a covered bevel; critic B (7.5) didn't cite it.
- **Panel over the road.** In `high/desktop/R16` the "RING AROUND THE TUB!" panel (about x 468–812, y 177–302) sits over the road ahead in all eight frames of `strips/high/R16`.
- **Style split.** The menus are studded panels with brick buttons (`high/desktop/R01`, `high/desktop/R02`, `high/desktop/R18`). The race HUD is plain slate tiles (`high/desktop/R03`). The anchor asks for one style that belongs to the brick world.
- **Results differ across viewports.** `high/mobile/R18` drops the team colour swatches shown in `high/desktop/R18` and `high/landscape/R18`. It stacks "25 gal" over "CLEAN" in every row and wraps "Engine Six Soakers (you)".
- **Copy error.** R17 reads "1 TICKETS" in all three viewports.

Critic B's 7.5 rests on menus only (`high/mobile/R02`, `high/landscape/R18`). This is 6.5.

**Typography: accept 7.0.** The display face and the UI face form a clear scale, and numerals read at a glance ("8TH" at 4× in `high/desktop/R04`; `high/mobile/R07`). Nothing is clipped. The small flaws:
- "1 TICKETS" in `high/desktop/R17`.
- A TICKETS cap height of about 7 px on desktop.
- Two-line cells in `high/mobile/R18`.
- Orphaned bullets in `high/mobile/R02`: "Traditional / · locked" on Gator Gang, "Modified · / locked" on Silks & Stirrups.

Keep 7.0.

**Readability: accept 6.5.** The critics' dusk and pack evidence stands (`high/desktop/R07`, `high/mobile/R07`). Two more things keep it from rising:
- **No route edge at the ford.** `high/desktop/R19` has no edge line. The terracotta plaza runs into a grey slab of ford with hard straight edges, beside a smooth ribbed bank, so the racing line isn't obvious.
- **Hidden tubs and an ambiguous marker.** In `high/desktop/R04` the bodies of only two of the seven rivals' tubs show (the pink and white ones). The player's marker triangle sits on the white turban team's tub ahead.

The player's ring, the items and the judge banner stay clear, so 6.5 holds.

**Mobile: accept 7.0.** The controls never cover the tub (`high/mobile/R04`, `high/landscape/R08`), and the SwiftShader phone floor holds 51 fps. The landscape banner collision is charged under UI, not counted twice here. In `high/mobile/R02` the team panel runs to the very bottom edge with no margin (critic A). Keep 7.0.

**Authenticity: accept 7.0.** The 7 clauses are met:
- The Arlington closes the vista (`high/desktop/R06`).
- The Row reads, with patterned bathhouses and the tiled dome (`high/desktop/R05`, `high/desktop/R14`).
- The ridges read as forested Ouachitas.
- The race props show: duck, flag, water gauge and Rules of the Row.

Three courses add nothing local, and I log them as gaps rather than cut the score:
- **R13.** `high/desktop/R13` "Bridge Street Bash downtown" is a generic intersection of brick commercial blocks with striped awnings. Nothing identifies Bridge Street.
- **R16 judges.** In `high/desktop/R16` the judges are spectator-tier figures standing half-hidden behind the blank white box.
- **R09.** `high/desktop/R09` "Goat Rock overlook" has no overlook. The camera looks into forest, and the outcrop is masonry.

## IP check
Clean.
- **Heads.** They are wide rounded blocks, not cylinders, with no top stud. They sit on a short round neck disc (`crops/high/R02-preview-captain`, 2×). The neck disc and the printed bean-eye face are the closest this design comes to minifigure convention, but the silhouette doesn't match.
- **Hands.** They are rounded fists closed around their props, not C-clips: the baton in `crops/high/R15-player`, the soap in `crops/high/R04-player`.
- **Torsos.** They are straight-sided boxes.
- **Marks.** I found no LEGO name, logo or stud lettering in any frame, menu or results board.

## Gaps the critics missed
1. **G-row-glazing-registration** (materials, WS4; severity 3, effort M, gain +0.4)
   - Defect: the 3D panes on the Row bathhouses stand proud of the facade, out of register with the facade texture's painted windows (`high/desktop/R04`, `crops/high/R04-kart_3`, `high/desktop/R16`, `high/desktop/R18`).
   - Fix: remove the painted openings wherever geometry panes exist, or snap the panes to them. Set panes no more than 2 cm proud inside a moulded frame, and give them true round arches (at least 8 segments).
   - Test: no painted window edge is visible within 4 px of any pane in those four captures.
2. **G-landscape-banner-overlap** (UI, WS6; severity 3, effort S, gain +0.3). Supersedes the size given in critic A's G-landscape-banner-collision.
   - Defect: the event banner covers the item tile from y≈142 to y≈176 in `high/landscape/R17`.
   - Fix: lay out transient banners against the current item tile's bottom edge plus at least 8 CSS px, and add banners to the automated HUD rectangle-overlap check in all three viewports.
3. **G-steam-never-rises** (animation, WS3; severity 3, effort S, gain +0.3)
   - Defect: in `strips/high/R14` frames 3–6 the steam clumps hold their screen position within 4 px, and their tops sink 5–6 px.
   - Fix: emit the puffs in world space with an upward velocity of at least 1 m/s, so they trail behind the tub and grow 1.7× as promised.
   - Test: across frames 3–6 the cluster tops climb at least 15 px at strip scale.
4. **G-slide-prop-clip** (animation, WS3; severity 3, effort M, gain +0.25)
   - Defect: in `strips/high/R14` frame 8 the tub mounts the kerb and a lamp post ends up inside the crew.
   - Fix: collide the tub-and-crew footprint with street furniture and play the wall-hit reaction.
   - Test: no prop base lies inside the player's ring in any R14 frame.
5. **G-character-shadow-acne** (lighting, WS1; severity 2, effort S, gain +0.2)
   - Defect: diagonal hatching on the back of a head in `crops/high/R03-player-rear`, absent on the B side of `ab/crop-R03-player-rear`.
   - Fix: add a normal-offset or slope-scaled bias of 1–2 shadow texels for skinned and figure meshes. Keep the 6 cm bias for chassis contact.
   - Test: no diagonal banding at 4× on the R03-player-rear head, and no stair-step band beside the chassis in `crops/high/R03-kart_5`.
6. **G-opaque-effects** (materials, WS3; severity 2, effort M, gain +0.25)
   - Defect: the steam and splash are opaque glossy balls (`high/desktop/R17`, `high/desktop/R19`, `strips/high/R15`).
   - Fix: switch to translucent trans-clear parts at alpha 0.4–0.6 with a soft rim.
   - Test: the road is at least 30% visible through the puffs in a crop of R17.
7. **G-judge-stand-blank-box** (authenticity, WS5; severity 2, effort S, gain +0.2)
   - Defect: the judge stand in `high/desktop/R16` is a white box with σ≈6, and the judges stand half-hidden behind it.
   - Fix: build the stand from bricks and tiles with a printed judges' sign and a table, and put the judges in front, facing the lane.
   - Test: every judge's face is visible in R16, and the stand shows seams or studs on every face.
8. **G-bridge-street-identity** (authenticity, WS4; severity 2, effort M, gain +0.2)
   - Defect: `high/desktop/R13` is a generic downtown corner.
   - Fix: stage Bridge Street's short block between Central Avenue and Broadway, with its street sign and parade dressing for the Bash.
   - Test: a reviewer can name the course from R13 alone.
9. **G-ford-route-edge** (readability, WS4; severity 2, effort S, gain +0.2)
   - Defect: `high/desktop/R19` shows no route edge across the plaza and ford.
   - Fix: add a kerb or white tile edge line along the route, and a sloped brick bank at the ford's sides.
   - Test: the route edge is continuous from the tub to the ford in R19.
10. **G-portrait-results-consistency** (UI, WS6; severity 2, effort S, gain +0.15)
    - Defect: `high/mobile/R18` drops the team swatches and splits rows over two lines.
    - Fix: keep the swatches, and replace the CLEAN chip with a check icon in a narrow column.
    - Test: every row fits on one line at 390 CSS px.
11. **G-water-disc-facets** (characters, WS2; severity 1, effort S, gain +0.1)
    - Defect: the faceted water edge in `crops/high/R02-preview-captain`.
    - Fix: tessellate the water disc to at least 48 segments, or mask it with the tub's inner profile.
    - Test: no straight facet longer than 6 px at 2×.
12. **G-tickets-plural** (typography, WS6; severity 1, effort S, gain +0.05)
    - Defect: "1 TICKETS" in `high/desktop/R17`, `high/mobile/R17` and `high/landscape/R17`.
    - Fix: label singular and plural correctly.

```json
{
  "loop": 7,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "characters": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "crops/high/R02-preview-captain", "note": "printed faces/uniforms hold; tub water edge is a visibly faceted polygon at 2x against a brushed-steel-streaked inner wall" },
      { "shot": "crops/high/R03-player-rear", "note": "diagonal hatching on back of centre pusher's head (x~600-800, y~230-330 at 4x); absent on B side of ab/crop-R03-player-rear" },
      { "shot": "crops/high/R15-player", "note": "captain's face buried under helmet brim during fumble" },
      { "shot": "crops/high/R04-kart_3", "note": "antenna team distinct, printed angry brows" },
      { "shot": "high/desktop/R03", "note": "teams separable by hat and print at chase distance" } ] },
    "materials": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R04", "note": "two arched panes stand as flat blue-grey slabs (mean RGB 77,92,106 / 72,90,110) in front of the bathhouse facade, painted windows visible beside them" },
      { "shot": "crops/high/R04-kart_3", "note": "3-segment chamfered panes offset from painted openings; painted window shows past each pane's edge" },
      { "shot": "high/desktop/R16", "note": "judge stand untextured white box, face RGB (209,213,205) sigma~6; facade panes half a bay out of register, smeared window surrounds" },
      { "shot": "high/desktop/R18", "note": "3D panes and painted mullioned windows side by side on the Row facade" },
      { "shot": "high/desktop/R17", "note": "hot steam = opaque glossy orange spheres (x 615-653, y 542-564)" },
      { "shot": "high/desktop/R19", "note": "ford reads as grey paving; warm steam = opaque white balls" },
      { "shot": "high/desktop/R09", "note": "Goat Rock wedges wrapped in tilted brick-course texture" } ] },
    "scenery": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R06", "note": "rebuilt forested rings a real gain, but left third is triangle wallpaper over flat lawn" },
      { "shot": "high/desktop/R10", "note": "near canopies fill ~26% of frame (colour mask over x 0-430/880-1280, y 0-480) despite the 8 m step-aside" },
      { "shot": "high/desktop/R09", "note": "tiers of three neighbouring conifers interpenetrate into one heap (x 820-1210, y 160-620)" },
      { "shot": "high/desktop/R16", "note": "judge stand is a plain white box, not a brick-built prop" },
      { "shot": "high/desktop/R13", "note": "lamp post fills left edge x 0-190" } ] },
    "lighting": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R07", "note": "dusk lane dark, pools land on sidewalk (critic A's numbers stand)" },
      { "shot": "high/desktop/R11", "note": "sunset without warm rim on figures" },
      { "shot": "crops/high/R03-player-rear", "note": "new diagonal shadow-acne hatching on curved figure parts, consistent with the 43->6 cm bias cut" },
      { "shot": "ab/crop-R03-player-rear", "note": "B side head smooth; A side hatched" },
      { "shot": "high/desktop/R10", "note": "clean key light and tree shadows on the tile road (credit)" } ] },
    "animation": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "strips/high/R14", "note": "frames 3-6: steam clumps pinned within 4 px at frame-local (174-177,247-256) and (269-275,261-271); tops sink 241->247 and 255->260, never rise; frame 8: tub over the kerb with a lamp post inside the crew, no hit reaction; frame 7: crew collapse into a near-horizontal heap" },
      { "shot": "strips/high/R15", "note": "splash = identical opaque blue beads; no visible camera kick (critic A: +/-1 px); captain inert" },
      { "shot": "strips/high/R16", "note": "circuit around the tub reads (credit)" },
      { "shot": "high/desktop/R17", "note": "hot steam is a static clump of opaque orange balls behind the tub" } ] },
    "ui": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "high/landscape/R17", "note": "HOT STEAM banner top y~142 overlaps item tile to its edge at y~176 (~34 device px, ~1/5 of tile), butting the item bubble; contradicts the 8 px gutter claim" },
      { "shot": "ab/high-landscape-R17", "note": "B side had clearance: regression from the taller item+tickets tile" },
      { "shot": "high/desktop/R16", "note": "judge-stop panel (x~468-812, y~177-302) over the road ahead in all eight strip frames" },
      { "shot": "high/desktop/R03", "note": "race HUD plain slate tiles vs studded menus in R01/R02/R18" },
      { "shot": "high/mobile/R18", "note": "drops team swatches shown on desktop/landscape; gal/CLEAN stacked; player name wraps" },
      { "shot": "high/desktop/R17", "note": "'1 TICKETS'" } ] },
    "typography": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R04", "note": "pixel place numerals read at a glance" },
      { "shot": "high/desktop/R17", "note": "'1 TICKETS' plural error; TICKETS ~7 px cap height" },
      { "shot": "high/mobile/R18", "note": "two-line water cells, wrapped player name" },
      { "shot": "high/mobile/R02", "note": "orphaned bullets: 'Traditional / · locked', 'Modified · / locked'; nothing clipped" } ] },
    "readability": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R07", "note": "dusk pack one dark mass (critic A)" },
      { "shot": "high/mobile/R07", "note": "same on the phone" },
      { "shot": "high/desktop/R19", "note": "no route edge across terracotta plaza; ford is a hard-edged grey slab; racing line not obvious" },
      { "shot": "high/desktop/R04", "note": "bodies of only two of seven rivals' tubs show (pink, white); player marker sits on the white tub ahead" },
      { "shot": "high/desktop/R10", "note": "player ring and item bubbles read clearly (credit)" } ] },
    "mobile": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/mobile/R04", "note": "controls clear of tub" },
      { "shot": "high/landscape/R08", "note": "controls clear of tub; framed on purpose" },
      { "shot": "high/landscape/R17", "note": "banner/item tile collision (charged under ui)" },
      { "shot": "high/mobile/R02", "note": "team panel runs to the bottom edge, no margin" } ] },
    "authenticity": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R06", "note": "Arlington closes the vista" },
      { "shot": "high/desktop/R05", "note": "Fordyce reads; forested ridges" },
      { "shot": "high/desktop/R13", "note": "Bridge Street Bash is a generic brick corner, nothing identifies Bridge Street" },
      { "shot": "high/desktop/R16", "note": "judges are spectator-tier figures half-hidden behind a blank white box" },
      { "shot": "high/desktop/R09", "note": "'overlook' has no vista; outcrop is masonry" } ] }
  },
  "ip": { "clean": true, "notes": "Heads are wide rounded blocks on a short round neck disc (closest approach to minifig convention, but no cylinder head or top stud); hands are rounded fists closed around props, not C-clips (crops/high/R15-player baton, crops/high/R04-player soap); straight-sided box torsos; no LEGO name, logo or stud lettering anywhere." },
  "gaps": [
    { "id": "G-row-glazing-registration", "category": "materials", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R04", "crops/high/R04-kart_3", "high/desktop/R16", "high/desktop/R18"], "benchmark": "worlds-1", "fix": "Remove painted window openings from Row facade textures wherever geometry panes exist (or snap panes to them); panes no more than 2 cm proud inside a moulded frame, true round arches (at least 8 segments). Test: no painted window edge visible within 4 px of any pane in R04, R16, R18 and crops/high/R04-kart_3." },
    { "id": "G-landscape-banner-overlap", "category": "ui", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R17", "ab/high-landscape-R17"], "benchmark": "drive-3", "fix": "Lay out transient banners against the current item tile's bottom edge plus at least 8 CSS px (banner top now y~142, tile edge y~176 device px) and include banners in the automated HUD rectangle-overlap check for all three viewports." },
    { "id": "G-steam-never-rises", "category": "animation", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R14"], "benchmark": "drive-3", "fix": "Emit steam puffs in world space with upward velocity of at least 1 m/s so they trail behind the tub and swell 1.7x. Test: across strips/high/R14 frames 3-6, cluster tops climb at least 15 px at strip scale (now pinned within 4 px and sinking 5-6 px)." },
    { "id": "G-slide-prop-clip", "category": "animation", "expectedGain": 0.25, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14"], "benchmark": "drive-3", "fix": "Collide the tub-plus-crew footprint with street furniture (lamp posts, fences, kerbs) and play the wall-hit reaction with camera kick. Test: no prop base inside the player's ring in any R14 strip frame (frame 8 now has a lamp post inside the crew)." },
    { "id": "G-character-shadow-acne", "category": "lighting", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["crops/high/R03-player-rear", "ab/crop-R03-player-rear"], "benchmark": "bj-1", "fix": "Add a normal-offset or slope-scaled shadow bias of 1-2 texels for figure meshes while keeping the 6 cm bias for chassis contact. Test: no diagonal banding at 4x on the R03-player-rear head and no stair-step band beside the chassis in crops/high/R03-kart_5." },
    { "id": "G-opaque-effects", "category": "materials", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["high/desktop/R17", "high/desktop/R19", "strips/high/R15"], "benchmark": "bj-3", "fix": "Render steam and splash as translucent trans-clear parts (alpha 0.4-0.6, soft rim) instead of opaque glossy spheres. Test: road at least 30% visible through the puffs in a crop of R17 around x 615-653, y 542-564." },
    { "id": "G-judge-stand-blank-box", "category": "authenticity", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R16"], "benchmark": "worlds-1", "fix": "Build the judge stand from bricks and tiles with a printed judges' sign and a table; place the judges in front, facing the lane. Test: every judge's face visible in R16 and the stand shows seams or studs on every face (now sigma~6 flat white)." },
    { "id": "G-bridge-street-identity", "category": "authenticity", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R13"], "benchmark": "drive-5", "fix": "Stage Bridge Street's short block between Central Avenue and Broadway with its street sign and parade dressing for the Bash. Test: a reviewer names the course from R13 alone." },
    { "id": "G-ford-route-edge", "category": "readability", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R19"], "benchmark": "drive-3", "fix": "Add a kerb or white tile edge line along the route across the plaza and a sloped brick bank at the ford's sides. Test: route edge continuous from the tub to the ford in R19." },
    { "id": "G-portrait-results-consistency", "category": "ui", "expectedGain": 0.15, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R18", "high/desktop/R18"], "benchmark": "drive-2", "fix": "Keep team swatches in portrait and replace the CLEAN chip with a check icon in a narrow column. Test: every results row on one line at 390 CSS px." },
    { "id": "G-water-disc-facets", "category": "characters", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R02-preview-captain"], "benchmark": "drive-4", "fix": "Tessellate the tub water disc to at least 48 segments or mask it with the tub's inner profile. Test: no straight facet longer than 6 px at 2x on the water edge." },
    { "id": "G-tickets-plural", "category": "typography", "expectedGain": 0.05, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R17", "high/mobile/R17", "high/landscape/R17"], "fix": "Label 1 as TICKET and other counts as TICKETS. Test: R17 shows '1 TICKET'." }
  ]
}
```
