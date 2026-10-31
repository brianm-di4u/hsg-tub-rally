# Advocate: loop 10, high tier

Paths are relative to `screenshots/review-loop-10/`. Measurements come from crops and pixel reads of the PNGs. Luminance is Rec. 709, 0–255.

## Summary
The two critics agree closely: 67.5 and 67. On the core picture they are mostly right:
- the ford is blue floor tile;
- the dusk lamps don't glow;
- the particles are beads;
- the fumble flash bleaches the team colours;
- the landscape countdown covers the grid.

Several of the points behind the 6.5s, though, are false in the named captures:
- The tub chassis does have studs.
- The storefronts do have framed windows with sills.
- The "blank signboard" is a tree.
- The Arlington does show new occlusion in the A/B pair.
- The fumble camera does move.
- The R08 bank is already stepped plates.

Codex's "pools of streetlight" at dusk don't exist either, and I concede that against the build.

I propose **70.0/100**, raising five categories by 0.25–0.5 and holding the other five at the critics' mean. Animation, UI and authenticity stay where the critics put them.

## Facts the critics got plainly wrong
1. **Critic A: "The chassis plates in `crops/high/R03-player` show no top studs."**
   - In that crop at 5×, two dark cylindrical studs sit on the chassis top plate beside the right claw foot (about x 700–760, y 505–540).
   - `crops/high/R04-kart_3` shows a row of four or more dark studs on the plate in front of the teal tub (about x 500–600, y 500–540).
   - `crops/high/R03-kart_1` shows the same row (x 480–600, y 500–540).
2. **Critic A: "Every building is a flat box wearing a brick texture, with window quads inset and no sills, frames, ledges or bevels."**
   - The storefront windows in the background of `crops/high/R03-player` and in `high/desktop/R13` have raised light-grey surrounds and sills, with a lit top edge and a shaded underside. Each floor has a belt course and corner pilasters.
   - The Fordyce in `high/desktop/R05` has white ledges that cast shadows down the wall, a protruding stoop with steps, and a toothed awning.
   - The Arlington towers in `high/desktop/R06` have stepped cornices at two levels, plus a red cornice band under the wing roofs.
   - The claim holds only for the painted-facade windows: the Arlington's main blocks and the painted arches in `high/desktop/R04` and `high/desktop/R16`.
3. **Critic A: "The switchback signboard is blank (`high/desktop/R08`)."**
   - The object top left is an autumn broadleaf tree: tan stacked canopy slabs at mixed yaw on a dark-brown trunk.
   - It is built the same way as the orange trees in `high/desktop/R12` (left edge and right of centre), `high/desktop/R09` and `high/desktop/R19`.
   - No signboard exists there, so the evidence for a blank sign is void. That it reads as planks does support Critic A's own G-tree-slab-yaw (see below).
4. **Critic A: "the camera is static across `strips/high/R15` frames 1–3."**
   - Between frame 1 (0:04.02) and frame 2 (0:04.18) the view shifts.
   - On the 483×302 frame tiles, the best-fit background offset is 9 px vertically. It cuts the mean difference from 32.5 to 20.3, and the ring and the left tree move relative to each other.
   - Frames 4→5 shift a further 3 px. Whether this reads as a deliberate kick is arguable, but the camera is not static.
5. **Critic A: "The R05/R06 A/B heat maps show only window-glint differences."**
   - In `ab/high-desktop-R06`, B is darker than A by 4.9–6.3 levels in a band at the base of the central block (panel x 300–380, y 278–286).
   - The difference is exactly 0 on the wall above (y 260–264) and on the deck below (y 290–298).
   - The same soft darkening runs under the tower cornices, along the base of the left tower, along the arcade base and between the conifer tiers.
   - Across the whole panel, no pixel of B is more than 4 levels brighter than A. Only R05's map is glints only.
6. **Codex: `high/desktop/R07` has "useful pools of streetlight."**
   - At 4× around the nearest right-hand lamp base (x 880–1080, y 380–500), the sidewalk is uniformly sun-lit orange, with no brighter patch.
   - The globes are plain cream spheres with no halo. Critic A is right here, and I concede it against the build.
7. **Codex: `high/desktop/R08` has a "conspicuously smooth bank" that should be "replaced with stepped plate construction."**
   - At 1.5× (x 0–560, y 380–800), the parallel lines are the lit edges of thin stepped plates, green on the grass side and grey on the road side. The bank is already stepped plates; the steps are just shallow.

Overstated, though not absent:
- **Critic A: the player's tub is "largely hidden" (`high/desktop/R04`).** The red tub's rear face, rim and translucent water are unobstructed between the two rear crew (about x 610–674, y 460–548).
- **Critic A: the contact shadow is "hidden under the yellow ring."** In `high/desktop/R17` the tub and crew shadow falls left out of the ring across the brick. In `high/desktop/R10` the shadows fall right of the crew.
- **Codex: the flash "erases printed detail."** In `crops/high/R15-player` the face, smile, hydrant badge, coat seams and reflective bands all stay legible. What the flash erases is the team colour.
- **Codex: "very similar expressions."** The faces vary:
  - angry brows and a shout (`crops/high/R04-kart_3`);
  - a toothy grin against an open-mouthed shout (`crops/high/R03-kart_5`);
  - a calm smile against a startled O (`crops/high/R03-kart_1`).

## Category by category

### Characters: critics 7 / 7 → propose 7.5
- **Concede:**
  - In `crops/high/R15-player` the flash turns the helmets pastel, (237,185,177) against red (124,57,58) in `crops/high/R03-player`.
  - The tub bowl is one smooth shell with a printed stripe, not a brick build.
- **Rebut:** the tubs are assembled parts.
  - A separate yellow rim and separate claw-foot parts (each a round base plus claws) sit on a two-layer dark chassis carrying stud rows.
  - The hubs carry 8 bolt nubs, and a lip seam runs round the bowl's base (`crops/high/R03-player`, `crops/high/R02-preview`, `crops/high/R04-kart_3`).
- **Rebut:** the tub water is transparent. In `crops/high/R02-preview-captain` you can see the captain's zip toggles, reflective band and the lower edge of his torso through the blue-tinted water.
- **Team identity:** every team has its own hat build and its own print:
  - fire helmets with two crown studs and a shield;
  - antenna caps;
  - soft-serve swirl hats;
  - orange helmets;
  - tie-dye, H print and gator scale prints.
- Against the anchors, the 7 anchor is met in full, and two 9-anchor traits are present (printed detail; every team a character). I put it at 7.5, not 8, because of the flash and the bowl.

### Materials: 6.5 / 6.5 → propose 7.0
- **Concede:**
  - The ford is opaque blue tile (`high/desktop/R19`).
  - Landmark glass is opaque blue with a glint (`high/desktop/R05` ground floor).
  - The landmark main-block windows are painted or flat quads (`high/desktop/R06`).
  - The roofs are slabs, and there is no wear (wear is a 9-anchor trait).
- **Rebut:** see facts 1 and 2. Storefront frames and sills, the Fordyce ledges with cast shadows, and the Arlington cornices are geometry that catches light (`high/desktop/R13`, `high/desktop/R05`, `high/desktop/R06`).
- **The worlds-1 7 anchor asks for:**
  - highlights that follow bevels: present on helmets, tubs and rims in `crops/high/R02-preview-captain`;
  - shaded studs near the camera: present on the baseplate (`high/desktop/R08`, `high/desktop/R11` bottom right) and on the outcrop tops (`high/desktop/R09`);
  - seams between bricks and plates: present on the brick walls, road tiles and outcrop courses;
  - clear parts that read as transparent plastic: the tub water (`crops/high/R02-preview-captain`).
- What keeps this from 7.5 is the landmark windows and the ford.

### Scenery: 6.5 / 6.5 → propose 7.0
- **Concede:**
  - The ford reads as tile (`high/desktop/R19`).
  - The R10 and R19 trails are terracotta plaza tile.
  - The far rings are flat cards that repeat.
  - The near autumn canopy in `high/desktop/R08` reads as planks.
- **Rebut:**
  - The R08 bank is stepped plates (fact 7).
  - R09 also uses tan sand plates around the outcrop, not only terracotta.
  - Near trees come in at least four builds: tiered conifers, dark slab broadleaf, light-green broadleaf and orange autumn (`high/desktop/R09`, `high/desktop/R12`).
  - The far rings already stack about five haze-graded layers (`high/desktop/R09` top band).
- **Against the anchors:** the 7 anchor (baseplate ground, tile roads, brick buildings, trees and props, recognisable landmarks, a set piece per course) matches Critic A's own "For" list. The "repetition" and "layering" objections belong to the 9 anchor.

### Lighting: 6.5 / 6.5 → propose 7.0
- **Concede:**
  - At dusk the lamps don't glow and the shop windows stay dark (`high/desktop/R07`).
  - There is no bounce colour.
  - The occlusion is subtle: Critic A's ≥10% test is not met.
- **Rebut:** occlusion is present at landmark scale.
  - High against low `R06`: the band just above the left tower's base (x 440–520, y 548–560) is up to 10.7 levels (8%) darker on high, while the wall above differs by 0–2 levels.
  - It also shows in the A/B pair (fact 5).
  - Under figures and posts, the high-minus-low map of `high/desktop/R07` darkens a halo round every tub and crew, and the base of every fence post. Contact darkening shows under each post at 4×.
- **Rebut:** grounding works. Tub shadows leave the ring (`high/desktop/R17`, `high/desktop/R10`).
- **Rebut:** the R09 tree shadows that Codex calls harsh are soft-edged daylight shadows at 1.6× (tan plates, x 0–640, y 220–560).
- **Against the anchors:** day (`high/desktop/R04`), dusk (`high/desktop/R07`) and sunset (`high/desktop/R11`) each have a deliberate palette, with haze matched to the sky (`high/desktop/R09`). That is the worlds-4 7 anchor.

### Animation: 6.5 / 6.5 → hold 6.5
- **Concede:**
  - The particles are white and blue shaded spheres (`strips/high/R14` frames 5–8 at 2×).
  - The slosh itself isn't legible from the chase camera. What `strips/high/R15` frames 2–5 show is a burst of blue spray leaving the tub, not a tilted surface.
  - Nothing pops off.
- **Rebut** fact 4, plus three things the critics underweight:
  - The drift arc under the tub changes from blue to white as the charge builds (`strips/high/R14` frames 5–8).
  - The camera yaws about 20 px per frame through the slide.
  - In R15 the crew sprint the circle with a mat in hand.
- The rubric's "water visibly sloshes" is still unproven, so I hold 6.5.

### UI: 7 / 7 → hold 7.0
- **Rebut the cause of the "grey sphere placeholder":** it is the empty item bubble. The same sphere holds the ×3 soap item in `high/desktop/R17` and matches the iridescent pickup bubbles (`high/desktop/R10`, `high/desktop/R17`).
- **Rebut "the HUD is static":** it changes with the mode:
  - "8 LEFT" and a circular arena minimap in Water Fight (`high/desktop/R17`);
  - "SEMIFINAL" and a task panel with a progress bar (`high/desktop/R16`);
  - check marks instead of CLEAN tags in the portrait results (`high/mobile/R18`).
- **Concede** the small legend labels and the heavy panels. I hold 7.

### Typography: 7 / 6.5 → propose 7.0
- **Rebut Codex's "secondary type undersized" (`high/desktop/R18`):**
  - The RESULTS heading is 42 px tall, the subtitle 15 px (with a descender) and the row caps 11 px, a deliberate 4:1 display-to-body scale with standard-size body text.
  - At phone scale, the landscape results rows have 18-device-px caps, about 13 CSS px type (`high/landscape/R18`). The description copy is about 14 CSS px (`high/landscape/R02`).
- **Concede:**
  - On desktop, the division labels are 8 px tall and the team names 10 px (`high/desktop/R02`).
  - The landscape "locked" label is about 13 device px tall.
  - "(you)" wraps in portrait (`high/mobile/R18`). It wraps rather than clips.
- The 7 anchor (clear scale, numerals at a glance, nothing clipped) is met.

### Readability: 6.5 / 7 → propose 7.0
- **Concede:**
  - In `high/landscape/R03`, READY sits over the grid ahead.
  - Packs bunch (`high/desktop/R07`, `high/desktop/R08`).
- **Rebut:**
  - The tub is visible behind the crew (overstatements above).
  - The countdown problem is one viewport only. On desktop, READY sits over sky under the top HUD (`high/desktop/R03`). In portrait it ends above the road's far end with the whole grid visible below (`high/mobile/R03`).
  - The teal Out-of-Towners tub now separates from the purple Velvet Mob tub (`high/desktop/R12`, `crops/high/R04-kart_3`).

### Mobile: 7 / 6.5 → propose 7.0
- **Rebut the severity of "the upper HUD consumes the view":**
  - In `high/mobile/R04` the navy HUD panels end at y 400 of 1688. The asphalt at the road's far end starts at about y 545 on the centre column, and the pack at about y 600. The HUD covers only sky and hills.
- **Rebut "physically small" results:** the landscape results type is about 13 CSS px (see typography).
- **For:**
  - The controls stay clear of the tub in both orientations (`high/mobile/R04`, `high/landscape/R03`, `high/landscape/R17`).
  - Portrait team select frames the whole tub (`high/mobile/R02`).
  - Portrait title buttons are restacked at full width (`high/mobile/R01`).
  - Swiftshader low mobile holds 52 fps minimum.
- **Concede:** the landscape countdown, and the missing division labels on landscape cards. The selected team's division is still printed in the detail panel (`high/landscape/R02`).

### Authenticity: 7 / 7 → hold 7.0
- **Concede:**
  - The hills read as generic stepped conifers (`high/desktop/R09`).
  - The ford and Bridge Street are unmarked (`high/desktop/R19`, `high/desktop/R13`).
- **Rebut the R08 signboard** (fact 3).
- **For:**
  - The title credits the World Championship Running of the Tubs on Central Avenue (`high/desktop/R01`).
  - The Arlington's twin towers are there (`high/desktop/R06`).
  - The JUDGE stand sits on the Row (`high/desktop/R16`).

## A/B note
Both critics called lighting a tie. On the measured R06 junction band (fact 5), the evidence leans **B**: B is darker only at junctions and in crevices, and never brighter. That is the loop's ambient-occlusion change becoming visible at the landmark camera. It is small (about 5 levels), so B with low confidence (about 0.6) is the fair call, not a tie at 0.55–0.7. I don't dispute the critics' other verdicts.

## Gap adjustments
- **Critic A:**
  - G-facade-relief: severity 3 → 2, gain 0.5 → 0.3. Limit it to the painted landmark facades (fact 2).
  - G-landscape-countdown: 3 → 2, gain 0.3. One viewport and the countdown only.
  - G-dusk-lamps: unchanged.
  - G-water-and-trails: gain 0.5 → 0.4. R09 already uses tan plates.
  - G-brick-particles: unchanged in severity, but drop the "static camera" premise.
  - G-ao-junctions: gain 0.3 → 0.2. AO exists; this is a strength tune.
  - G-tub-brick-parts: 3 → 2, gain 0.4 → 0.2. The studs already exist; the seam and side tile remain.
  - G-far-ring-relief: gain 0.3 → 0.2. The layers already exist.
  - G-landscape-team-select: 2 → 1, gain 0.1.
  - G-portrait-hud-height: 2 → 1, gain 0.1. The HUD covers sky only.
  - G-fumble-flash-bleach: unchanged.
  - G-signage: gain 0.3 → 0.2. The R08 evidence is void.
  - G-tree-slab-yaw: unchanged. The R08 misread supports it.
  - G-empty-item-slot: gain 0.2 → 0.1. The cause is not a placeholder.
- **Codex:**
  - G-environment-repetition: 4 → 3, gain 1.0 → 0.5. The bank is already stepped, and the trees come in several builds.
  - G-surface-depth: 4 → 3, gain 1.0 → 0.5. It overlaps G-facade-relief, and the relief partly exists.
  - G-light-grounding: 3 → 2, gain 0.5 → 0.3. AO and cast shadows are present.
  - G-action-effects: gain 0.5 → 0.3. It overlaps G-brick-particles, and the prints survive the flash.
  - G-phone-text: 3 → 2, gain 0.5 → 0.3. The type is 13–14 CSS px.
  - G-tub-assembly: gain 0.5 → 0.2. It overlaps G-tub-brick-parts.

```json
{
  "loop": 10,
  "role": "advocate",
  "tier": "high",
  "scores": {
    "characters": { "score": 7.5, "confidence": 0.55, "evidence": [
      { "shot": "crops/high/R04-kart_3", "note": "row of 4+ dark studs on the chassis plate; separate purple rim and hub; angry printed faces" },
      { "shot": "crops/high/R03-player", "note": "chassis studs at 5x (x 700-760, y 505-540), separate claw-foot parts, 8-bolt hubs, base lip seam: Critic A's 'no top studs' is wrong" },
      { "shot": "crops/high/R02-preview-captain", "note": "captain's zip and reflective band visible through transparent tub water; printed hydrant badge" },
      { "shot": "crops/high/R03-kart_5", "note": "distinct swirl-hat team; varied expressions (grin vs shout)" },
      { "shot": "crops/high/R15-player", "note": "conceded: flash bleaches team colour, though face and coat prints stay legible" }
    ] },
    "materials": { "score": 7.0, "confidence": 0.5, "evidence": [
      { "shot": "crops/high/R03-player", "note": "background storefront windows have raised frames and sills with lit top edges; belt course and pilasters" },
      { "shot": "high/desktop/R05", "note": "Fordyce ledges cast shadows, stoop and toothed awning are geometry; conceded: opaque ground-floor glass" },
      { "shot": "high/desktop/R06", "note": "tower cornices at two levels; conceded: main-block windows are flat quads" },
      { "shot": "crops/high/R02-preview-captain", "note": "bevel-following speculars; transparent water reads as clear plastic" },
      { "shot": "high/desktop/R08", "note": "shaded baseplate studs; stepped-plate bank" },
      { "shot": "high/desktop/R19", "note": "conceded: ford is opaque blue tile" }
    ] },
    "scenery": { "score": 7.0, "confidence": 0.55, "evidence": [
      { "shot": "high/desktop/R09", "note": "outcrop with brick courses and studs, tan plates plus tile path, 4 tree builds, ~5 layered far rings" },
      { "shot": "high/desktop/R08", "note": "bank is stepped plates; top-left object is an autumn tree, not a blank sign" },
      { "shot": "high/desktop/R12", "note": "orange autumn trees of the same build as the R08 'sign'" },
      { "shot": "high/desktop/R17", "note": "radial brick plaza set piece" },
      { "shot": "high/desktop/R19", "note": "conceded: ford reads as tile; trail is plaza tile" }
    ] },
    "lighting": { "score": 7.0, "confidence": 0.5, "evidence": [
      { "shot": "high/desktop/R06", "note": "vs low/desktop/R06: up to 10.7 levels (8%) darker in the band above the left tower base, 0-2 elsewhere on the wall" },
      { "shot": "ab/high-desktop-R06", "note": "B darker by 4.9-6.3 levels at the central-block base and under cornices; never brighter" },
      { "shot": "high/desktop/R07", "note": "deliberate dusk palette; AO halos round the pack and fence posts vs low tier; conceded: unlit lamps, no light pools" },
      { "shot": "high/desktop/R17", "note": "tub and crew shadow falls out of the ring across the brick" },
      { "shot": "high/desktop/R11", "note": "sunset palette with matched haze" }
    ] },
    "animation": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "strips/high/R15", "note": "crew circle with limbs swinging; spray burst; camera shifts 9 px between frames 1 and 2 (not static); slosh surface not legible" },
      { "shot": "strips/high/R14", "note": "push-run, camera yaw about 20 px per frame, drift arc turns blue to white; particles are spheres" },
      { "shot": "strips/high/R16", "note": "circling at the judge with the progress bar filling" }
    ] },
    "ui": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R17", "note": "mode-aware HUD: 8 LEFT, arena minimap, item shown inside the bubble slot (x3)" },
      { "shot": "high/desktop/R16", "note": "SEMIFINAL plate and task panel with progress bar under the top row" },
      { "shot": "high/desktop/R04", "note": "one stud-rail plate style; empty item bubble; small legend labels" },
      { "shot": "high/mobile/R18", "note": "portrait results swap CLEAN tags for check marks" }
    ] },
    "typography": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R18", "note": "42 px heading, 15 px subtitle, 11 px row caps: a clear 4:1 scale" },
      { "shot": "high/landscape/R18", "note": "row caps 18 device px, about 13 CSS px type" },
      { "shot": "high/desktop/R02", "note": "conceded: division labels 8 px tall" },
      { "shot": "high/mobile/R18", "note": "'(you)' wraps but nothing clips" }
    ] },
    "readability": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R04", "note": "player's red tub unobstructed between the rear crew (x 610-674, y 460-548); ring and arrow" },
      { "shot": "high/desktop/R03", "note": "desktop READY sits over sky under the top HUD" },
      { "shot": "high/mobile/R03", "note": "portrait READY clears the grid" },
      { "shot": "high/landscape/R03", "note": "conceded: landscape READY covers the grid ahead" },
      { "shot": "high/desktop/R12", "note": "teal Out-of-Towners tub distinct" }
    ] },
    "mobile": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "high/mobile/R04", "note": "HUD panels end at y 400; the road's far end starts at y 545 and the pack at y 600: HUD covers sky only; controls clear of the tub" },
      { "shot": "high/mobile/R02", "note": "whole tub, wheels and feet above the panel" },
      { "shot": "high/landscape/R17", "note": "controls clear of the tub" },
      { "shot": "high/landscape/R02", "note": "conceded: no division labels on cards (shown in the detail panel)" }
    ] },
    "authenticity": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R06", "note": "Arlington twin towers close the vista" },
      { "shot": "high/desktop/R16", "note": "JUDGE stand on the Row; Hale arches clean" },
      { "shot": "high/desktop/R01", "note": "credits the World Championship Running of the Tubs on Central Avenue" },
      { "shot": "high/desktop/R08", "note": "no blank sign: the object is an autumn tree" },
      { "shot": "high/desktop/R19", "note": "conceded: ford unmarked; generic hills" }
    ] }
  },
  "ip": { "clean": true, "notes": "Agree with both critics: rounded-cube heads, straight box torsos, mitten hands; no LEGO name or logo." },
  "gaps": [
    { "id": "G-facade-relief", "category": "materials", "expectedGain": 0.3, "severity": 2, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R06", "high/desktop/R04", "high/desktop/R16"], "benchmark": "worlds-1", "fix": "Limit to painted-facade landmarks: window surrounds as plate and tile geometry, 0.08 studs proud, on the Arlington main blocks and the painted arches. Storefronts (R13, R03-player background) and the Fordyce ledges (R05) already have relief. Test: in R06 each sunlit sill is 15+ luminance above the wall." },
    { "id": "G-landscape-countdown", "category": "readability", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R03"], "benchmark": "drive-3", "fix": "On phone landscape, scale the countdown to 50% and put its top at 92 CSS px. Test: no countdown pixel below 33% of frame height. Desktop and portrait are already clear (R03)." },
    { "id": "G-dusk-lamps", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R07"], "benchmark": "worlds-2", "fix": "Emissive lamp globes with bloom, a light decal under each lamp, warm emissive shop windows on dusk and sunset courses. Test: sidewalk under the nearest lamp 20%+ brighter than between lamps in R07." },
    { "id": "G-water-and-trails", "category": "scenery", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R19", "high/desktop/R10"], "benchmark": "drive-1", "fix": "Transparent ford water with sky reflection, scrolling normal and a round-plate foam edge; dirt plates with scattered rocks on the R10/R19 trails (R09 already uses tan plates). Test: water luminance std >= 12 in R19." },
    { "id": "G-brick-particles", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15"], "benchmark": "drive-3", "fix": "Tumbling transparent round plates and studs at 0.5-1.5x size. Make the existing frame 1-2 camera shift read as a kick (FOV +6 degrees for 3 frames). Pop and snap back one accessory. Raise the camera 0.3 m in slides and fumbles so the water's tilt shows in 3+ R15 frames." },
    { "id": "G-ao-junctions", "category": "lighting", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R06", "ab/high-desktop-R06"], "benchmark": "worlds-4", "fix": "AO is present at about 5-8%; raise its intensity and scale the radius with distance. Test: 10%+ luminance drop within 0.5 m of the arcade base in R06." },
    { "id": "G-tub-brick-parts", "category": "characters", "expectedGain": 0.2, "severity": 2, "effort": "L", "workstream": "WS2", "evidence": ["crops/high/R03-player", "crops/high/R02-preview"], "benchmark": "drive-4", "fix": "The chassis studs already exist (R04-kart_3, R03-player). Add a part seam between the rim and the bowl and a printed team tile on the bowl's side, both visible in the 2x close-up." },
    { "id": "G-far-ring-relief", "category": "scenery", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R06"], "benchmark": "worlds-3", "fix": "The rings already stack about 5 layers. Give each layer stepped relief and real ridgeline silhouettes. Test: no flat card edge visible in R09." },
    { "id": "G-landscape-team-select", "category": "mobile", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R02"], "fix": "Show the division label on landscape cards at 11 px minimum (the selected division is already in the detail panel), and put Back in the same row as Choose." },
    { "id": "G-portrait-hud-height", "category": "mobile", "expectedGain": 0.1, "severity": 1, "effort": "M", "workstream": "WS6", "evidence": ["high/mobile/R04", "high/mobile/R07"], "fix": "Optional: merge the gauge and legend rows. The HUD (ends at y 400) already clears the road (from y 545) and the pack (from y 600). Test: HUD ends above 16% of the height." },
    { "id": "G-fumble-flash-bleach", "category": "characters", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["crops/high/R15-player", "strips/high/R15"], "fix": "Replace the full-body whitening with a rim or outline flash, keeping albedo at 70%+ of the team colour." },
    { "id": "G-signage", "category": "authenticity", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R13", "high/desktop/R19"], "benchmark": "drive-5", "fix": "Printed tile signs for Bridge Street and a Gulpha Gorge marker at the ford. The R08 'blank sign' is an autumn tree, so drop it." },
    { "id": "G-tree-slab-yaw", "category": "scenery", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R11", "high/desktop/R10", "high/desktop/R08"], "benchmark": "worlds-1", "fix": "Snap canopy slab yaw to 0, 45 or 90 degrees and size plates in whole studs. The near autumn canopy in R08 currently reads as wooden planks." },
    { "id": "G-empty-item-slot", "category": "ui", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/desktop/R17"], "benchmark": "drive-3", "fix": "The slot is the empty item bubble (it holds the x3 item in R17), not a placeholder. Optionally give the empty state the pickups' iridescence." },
    { "id": "G-environment-repetition", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R08"], "benchmark": "worlds/worlds-1.jpg", "fix": "Vary the distant forest silhouettes between mountain courses. The R08 bank is already stepped plates and the near trees already come in 4 builds, so deepen the step height rather than rebuilding. Verify the courses are distinguishable without HUD labels." },
    { "id": "G-surface-depth", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS1", "evidence": ["high/desktop/R05", "high/desktop/R19"], "benchmark": "worlds/worlds-1.jpg; builders-journey/bj-3.jpg", "fix": "Depth cues beneath the landmark glazing and the ford water. Facade cornices and ledges partly exist (R05, R06), and this overlaps G-facade-relief. Verify at the existing landmark cameras." },
    { "id": "G-light-grounding", "category": "lighting", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R06", "high/desktop/R09"], "benchmark": "builders-journey/bj-1.jpg; worlds/worlds-4.jpg", "fix": "Strengthen the existing AO and key/fill separation on large walls. Contact shadows already leave the ring (R17, R10)." },
    { "id": "G-action-effects", "category": "animation", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15"], "benchmark": "2k-drive/drive-3.jpg", "fix": "A directional steam plume and an outward splash arc; preserve team colour during the flash (the prints already survive it). This overlaps G-brick-particles." },
    { "id": "G-phone-text", "category": "mobile", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/landscape/R02", "high/landscape/R18"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Raise the landscape 'locked' label (about 13 device px tall) and the card labels to 11 CSS px minimum. The results rows (about 13 CSS px) and the description (about 14 CSS px) are acceptable." },
    { "id": "G-tub-assembly", "category": "characters", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R02-preview-rear", "crops/high/R04-kart_3"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Segmented rim and mounting brackets. The chassis stud rows, claw-foot parts and bolted hubs already exist. This overlaps G-tub-brick-parts." }
  ]
}
```
