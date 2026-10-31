# Advocate: loop 7, high tier

Paths are relative to `screenshots/review-loop-7/`. I measured luminance (Rec.709 Y) and mean absolute gradient
(horizontal/vertical, 0–255 scale) on crops of the full-size PNGs, and I read the A/B pairs side by side. Critic means
per category are characters 7.0, materials 6.5, scenery 6.5, lighting 6.5, animation 6.5, ui 7.25, typography 7.0,
readability 6.5, mobile 7.0 and authenticity 7.0.

## Summary
Both critics are right about the horizon. In the elevated landmark views it is a regular wall of triangle crowns on
near-vertical faces (`high/desktop/R06` left third, `high/desktop/R05` right half). They are also right that Goat
Rock is masonry-skinned, that the Gulpha Creek ford no longer reads as water (a regression this loop), that steam
puffs are small sphere clumps, and that the landscape "HOT STEAM!" banner sits on the item tile. Several of the
reasons that pulled scores down are wrong, though:
- Near lawns keep their studs.
- The vertical streaks are in the tub's enamel shell, and they are identical in the other build. They don't come
  from the new water.
- The dusk lamp pool does reach across the lane.
- The dusk pack isn't "one dark mass". Rival crews sit at about 2:1 against the road on both viewports.
- Water visibly spills during the slide at chase distance.
- The HUD is context-aware and animated.
- The figures do have a separate hip piece.

I propose +0.5 on characters, materials, animation and readability, and +0.25 on UI. I hold scenery, lighting,
typography, mobile and authenticity.

## Category by category

**Characters (critics 7.0 / 7.0, propose 7.5).**
- *Rebut, plainly wrong (Claude): "Arms and legs are plain single blocks with no shoulder or hip piece."* In
  `crops/high/R03-player-rear` the left firefighter has a separate hip block with seam lines above two split legs.
  `crops/high/R15-player` shows the same hip band on the walking figure.
- *Rebut, partly (Codex): "the tub remains a largely uninterrupted bowl."* The bowl is one moulding, as a clawfoot
  tub is. In `crops/high/R02-preview` it sits on a studded black chassis plate with gold claw feet, hubbed wheels and
  a printed side tile, so the build reads as parts.
- The 9 anchor's "every team a character, expressive faces" is partly met:
  - angry printed brows and antennae (`crops/high/R04-kart_3`);
  - a shouting captain and grinning crew (`crops/high/R02-preview-captain`);
  - towel turbans with Y-trim uniforms (`crops/high/R03-kart_5`);
  - pinstriped "H" bowlers and tie-dye at dusk (`high/desktop/R07`).
- `high/desktop/R03` separates six teams at chase distance.
- *Concede:* the faint vertical enamel streaks (`crops/high/R03-kart_5` white body, inner wall in
  `crops/high/R02-preview-captain`). Faces are far simpler than `drive-4`, and the spectators are a lower-tier
  figure. Those keep it at 7.5, not 8.

**Materials (6.5 / 6.5, propose 7.0).**
- *Rebut, plainly wrong (Claude): "Large lawns lose their studs and render as flat green."*
  - The foreground lawn in `high/desktop/R05` (x 900–1050, y 640–700) shows shaded studs, gradient 3.41 h / 6.07 v.
  - The roadside lawn in `high/desktop/R12` shows studs with specular glints, 3.12 / 5.91. That is above the studded
    `high/desktop/R08` bank Claude uses as the reference (1.59 / 3.10).
  - Only the elevated `high/desktop/R06` view loses them, where a stud is sub-pixel. On its foreground lawn I measure
    0.52 / 1.04, and I couldn't reproduce Claude's 0.27.
- *Rebut, wrong cause (Codex): "the water has conspicuous vertical streaking."* In `ab/crop-R02-preview-captain` the
  streaks are on the white enamel inner wall, and they are the same in both builds: wall gradient 4.27 / 5.25 in A
  against 4.17 / 5.23 in B. B's water is opaque and still has them. Inside A's water they are a faint show-through of
  the wall (1.23 / 1.29 against B's 0.84 / 0.82). The water itself is clear, with soft ripple glints, and the
  captain's legs show through. So this is the tub shell (Claude's G-tub-enamel-streaks), not the water.
- The 7 anchor (`worlds-1`) is met item by item:
  - bevel-following highlights on helmets, duck and tub rims (`crops/high/R02-preview-captain`);
  - shaded studs near the camera (R05, R08, R09, R12);
  - brick courses with edge relief and bevelled sills on the Fordyce (`high/desktop/R05`, 2× crop);
  - clear tub water;
  - glass mirroring sky.
- *Concede:*
  - Goat Rock's tapered solids carry a running-bond texture and read as masonry (`high/desktop/R09`).
  - The R05 roofs are flat matte planes.
  - The ford reads as pale paving (below).

  These are specific assets, not a failure of the material system, so I propose 7.0.

**Scenery (6.5 / 6.5, hold 6.5).**
- *Concede:* the hill rings in the landmark cameras are walls of identical stepped triangles on near-vertical faces
  (`high/desktop/R06` x 0–440, y 230–500 at 2×; `high/desktop/R05` right half; `high/desktop/R03` sky band at 3×). This
  is the biggest scenery defect.
- *Rebut, partly (Codex, R08): "foreground branches compete with the corner ahead".* In `high/desktop/R08` the corner
  from x 700 to 1280 and the pack are unobstructed. The top-left canopy sits over the stone wall and sky. A
  trunk only grazes the far left of the queue. `ab/high-desktop-R08` shows B with a larger, darker canopy, so this
  loop improved it.
- *Rebut, plainly wrong (Codex gap fix): "Add several broadleaf and conifer assemblies".* They already exist:
  - `high/desktop/R12` shows dark stepped conifers, light-green broadleaf and orange autumn trees;
  - `high/desktop/R09` shows conifers of several heights plus broadleaf and orange trees.
- Course identity is strong: the Row (R04, R14), forest and Goat Rock (R09), the tiled summit road (R10), the park
  (R12), downtown brick (R13), the plaza (R17) and the ford (R19). The horizon keeps it at 6.5.

**Lighting (6.5 / 6.5, hold 6.5; 7.0 arguable).**
- *Rebut, plainly wrong (Claude): "the lamp pools land on the sidewalk, not the lane."* In `high/desktop/R07` the
  left lamp pool runs past the white edge line across the left lane. The lane under the pool (x 60–250, y 420–470)
  reads Y 112.7, against 45.6 on the unlit lane near the player. The player is between pools at that tick.
- *Rebut, wrong cause:* Claude's crew-to-road ratio (57.6 to 46.5) is measured on the black-uniformed Velvet Mob.
  The rival crews sit at 1.9–2.1:1 (below).
- *Rebut, mis-anchored:* "no bounce colour" and "nothing reads as a photographed toy" are 9-anchor features
  (`bj-1`..`bj-3`). Codex likewise benchmarks against `bj-1`.
- The 7-anchor items are present:
  - contact shadows that ground the tubs (`high/desktop/R13` under the player's tub Y 84.7 against open road 143.6;
    `crops/high/R02-preview`);
  - haze matched to the sky (purple at dusk in R07, peach in R11, blue by day);
  - three deliberate palettes (R10, R07, R11).
- *Concede:* AO in crevices is faint. Sunset figures get little warm rim: in `high/desktop/R11` the crew reads Y 58
  against road 46. The R06 elevations are flat (Codex). Those two 7-anchor shortfalls justify holding 6.5. The
  dusk-lane gap should shrink.

**Animation (6.5 / 6.5, propose 7.0).**
- *Rebut, plainly wrong (Claude): "The slosh is visible only as a tilted tub in `crops/high/R04-player`".* Also
  *Codex: "water motion is not prominent at chase distance".*
  - In `strips/high/R14` frames 6–8, blue water drops spill from the tub during the slide, and the gauge falls 41 →
    40 → 39 GAL (frames 1–5 read 41).
  - In `strips/high/R15` frames 2–7, a ring of water drops bursts out and the gauge falls 37 → 36.
- *Rebut, wrong cause (Claude): "no camera kick is visible".* In `strips/high/R15` the crew has already left the tub
  in frame 1 (0:04.03, the same moment as `high/desktop/R15`), so the fumble impact comes before the strip starts.
  I measure a vertical offset of only −2 to +2 px between frames (strip scale 0.377), which agrees with Claude. But a
  strip that starts after the impact can't show whether the kick exists.
- On the 7 anchor:
  - The crew circles with rigid swinging limbs (R15, R16).
  - The slide reads through lean, tub angle and the new charge arc, which is blue in frames 3–5 and white in
    frames 6–8 (`strips/high/R14`).
  - Hits and splashes read with particles.
  - Water visibly sloshes.
- *Concede:* the steam puffs are small white sphere clumps that read as bubbles (`strips/high/R14`,
  `high/desktop/R19`). Nothing pops off and snaps back, which is a 9-anchor feature.

**UI (7.0 / 7.5, propose 7.5).**
- *Rebut, plainly wrong (Claude): "Nothing is animated or context-aware in the frames."*
  - `high/desktop/R16` swaps LAP for "SEMIFINAL" and shows a "RING AROUND THE TUB!" panel. Its progress bar fills
    from 3 to 74 px of orange across `strips/high/R16`.
  - `high/desktop/R17` swaps LAP for "8 LEFT" and the minimap for an arena radar.
  - `high/desktop/R15` greys out the used "Bath" item in the legend.
  - `high/desktop/R19` raises a "WARM STEAM" meter banner.
- That is the context-aware part of the 9 anchor. With the unified item and tickets tile and the studded menus and
  results board (`high/desktop/R01`, `high/desktop/R02`, `high/desktop/R18`), Codex's 7.5 is supported.
- *Concede (Claude):*
  - The "HOT STEAM!" banner covers the item tile's lower edge in `high/landscape/R17`, so "nothing overlapping"
    fails once, in one viewport.
  - The HUD tiles are plain slate, without studs.

  Those keep it from 8.

**Typography (7.0 / 7.0, hold 7.0).**
- *Concede (Claude):* the "TICKETS" label is 8 px cap height on desktop (`high/desktop/R17`). The "CLEAN" chips are
  small (`high/desktop/R18`). "Steer" straddles the pad rim in landscape (`high/landscape/R17`).
- *Rebut, overstated (Codex): "secondary phone text requires too much scrutiny".*
  - The team description lines in `high/mobile/R02` are 22 device px tall from ascender to descender at 2×, about
    13 CSS px type.
  - The results rows in `high/landscape/R18` are 18 device px to the ascender top ("Suds Posse"), about 13 CSS px.
  - The "CLEAN" chips are crisp dark-on-green text (4× crop).

  This is normal secondary size on a phone, not a defect worth +0.5.

**Readability (6.5 / 6.5, propose 7.0).**
- *Rebut, plainly wrong (Claude): "the 8-tub pack is one dark mass".*
  - In `high/desktop/R07`, the pink crew reads Y 97.8 and the tie-dye crew Y 86.1, against road Y 45.6–51.0. That is
    already past Claude's own target of 1.6:1.
  - On the phone (`high/mobile/R07`) the figures are pink 99.8 and tie-dye 83.5 against road 45.2–52.9. The cowboys
    and green teams ahead also separate.
  - Only the player's black-uniformed crew is near road value (54.0), and its cream ring and pointer flag it.
- *Rebut, overstated (Claude): "R04 rival tubs merge into a column of heads".* At 2.5× in `high/desktop/R04`, the
  cowboys' barrel tub, the towel team's white tub and the pink tub all show their bodies, and the item bubbles ahead
  pop.
- *Rebut (Codex, `high/mobile/R04`): "compress teams into overlapping upright figures".* In that frame, four rival
  crews (cowboys, pink, towel turbans, blue) sit in separate positions.
- *Concede (Codex):* in the `high/desktop/R08` hairpin queue, the rival tubs are hidden behind their crews. Teams
  still separate by colour (2.5× crop).
- Item bubbles (R10, R11, R17), road-edge lines and the judge stop (R16) all read. That is enough for 7.0.

**Mobile (7.0 / 7.0, hold 7.0).**
- Concede Claude's three points:
  - the banner collision in `high/landscape/R17`;
  - the team panel flush to the bottom edge in `high/mobile/R02`;
  - the heavy top HUD in portrait, about 24% of the height in `high/mobile/R07`.
- The tub stays clear of the controls in every phone frame (`high/mobile/R04`, `high/landscape/R04`,
  `high/landscape/R08`). SwiftShader holds 51 fps minimum. Nothing in either critique is wrong here.

**Authenticity (7.0 / 7.0, hold 7.0).**
- Agree. The Arlington (`high/desktop/R06`) and the Fordyce (`high/desktop/R05`) read at once, and the judges, duck,
  flag and Rules of the Row show (`high/desktop/R16`).
- The critics contradict each other on the ford: Claude calls it "grey paving", Codex a "blue rectangular surface".
  I measure mid-ford RGB (128,139,150), B−R 22, which is pale blue-grey paving. In `ab/high-desktop-R19` the other
  build was bluer (B−R 43 against 18 in the pair), so this loop's clear-water change made it worse. Concede.

## Facts the critics got plainly wrong
1. Claude: no hip piece. A hip block and split legs are visible in `crops/high/R03-player-rear` and
   `crops/high/R15-player`.
2. Claude: large lawns lose their studs. Studs are visible in `high/desktop/R05` (foreground) and `high/desktop/R12`.
3. Claude: dusk pools miss the lane. The left pool lights the left lane in `high/desktop/R07` (Y 112.7 against 45.6).
4. Claude: the dusk pack is one dark mass. Rival crews read at about 2:1 against the road in `high/desktop/R07` and
   `high/mobile/R07`.
5. Claude: slosh only visible as a tilted tub. Codex: water motion not prominent at chase distance. Both are
   contradicted by the spill and gauge drop in `strips/high/R14` frames 6–8 and the burst in `strips/high/R15`.
6. Claude: the HUD is neither animated nor context-aware. See SEMIFINAL and the filling bar in `high/desktop/R16` and
   `strips/high/R16`, 8 LEFT and the radar in `high/desktop/R17`, and the greyed Bath item in `high/desktop/R15`.
7. Codex: streaky water. The streaks are in the enamel wall and identical in the other build
   (`ab/crop-R02-preview-captain`).
8. Codex: R08 branches obstruct the corner. The corner is clear in `high/desktop/R08`.
9. Codex: needs several broadleaf and conifer assemblies. They exist in `high/desktop/R12` and `high/desktop/R09`.

## Gap adjustments
- **Unchanged:** G-horizon-wallpaper (3, +0.5), G-ford-reads-as-paving (3, +0.3; a regression),
  G-landscape-banner-collision (2, +0.25) and G-portrait-bottom-safe-area (2, +0.2).
- **G-tub-enamel-streaks:** kept at severity 2. Expected gain goes to +0.25, because it is also the real cause of
  Codex's water-streak complaint.
- **G-mountain-walls:** severity 3, gain +0.5, effort M. It duplicates G-horizon-wallpaper. Its fix ("overlapping
  irregular terrain masses") describes what this loop shipped. Both critics prefer that build at 0.9 / 0.99
  confidence. What remains is face steepness and crown regularity.
- **Severity cut to 2 because the cause is wrong or overstated:**

  | Gap | Expected gain |
  |---|---|
  | G-dusk-lane-light | +0.25 |
  | G-dusk-pack-separation | +0.2 |
  | G-camera-kick-and-effects | +0.3 |
  | G-forest-repetition | +0.2 |
  | G-material-consistency | +0.3 (drop the water-streak half) |
  | G-pack-separation | +0.3 |
  | G-action-follow-through | +0.3 |

- **Severity cut to 1:**

  | Gap | Expected gain |
  |---|---|
  | G-flat-lawns (R06 only) | +0.1 |
  | G-phone-secondary-type | +0.2 |

- **Expected gain cut, severity unchanged:** G-masonry-rocks (one prop) to +0.2, and G-hud-brick-cue to +0.2.

```json
{
  "loop": 7,
  "role": "advocate",
  "tier": "high",
  "scores": {
    "characters": { "score": 7.5, "confidence": 0.55, "evidence": [
      { "shot": "crops/high/R03-player-rear", "note": "separate hip block with seam lines over split legs; contradicts 'no hip piece'" },
      { "shot": "crops/high/R04-kart_3", "note": "angry printed brows, antennae, tie-dye print: team as character" },
      { "shot": "crops/high/R02-preview", "note": "tub on studded chassis plate with claw feet, hubbed wheels, printed side tile" },
      { "shot": "high/desktop/R03", "note": "six teams separate at chase distance" },
      { "shot": "crops/high/R03-kart_5", "note": "concede: faint vertical enamel streaks on the white tub body" } ] },
    "materials": { "score": 7.0, "confidence": 0.5, "evidence": [
      { "shot": "high/desktop/R05", "note": "foreground lawn studded (grad 3.41 h / 6.07 v); brick courses with edge relief and bevelled sills" },
      { "shot": "high/desktop/R12", "note": "roadside lawn shows shaded studs with glints (3.12 / 5.91)" },
      { "shot": "ab/crop-R02-preview-captain", "note": "vertical streaks are on the enamel wall, identical in both builds (4.27/5.25 vs 4.17/5.23); water itself is clear" },
      { "shot": "high/desktop/R09", "note": "concede: Goat Rock wedges wear a running-bond masonry texture" },
      { "shot": "high/desktop/R19", "note": "concede: ford mid RGB (128,139,150) reads as pale paving" } ] },
    "scenery": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R06", "note": "concede: left third is a near-vertical wall of identical triangle crowns" },
      { "shot": "high/desktop/R05", "note": "concede: hill ring behind the Fordyce reads as a patterned wall" },
      { "shot": "high/desktop/R08", "note": "corner apex and pack unobstructed; canopy sits over the wall and sky" },
      { "shot": "high/desktop/R12", "note": "conifer, broadleaf and autumn tree assemblies already mixed" } ] },
    "lighting": { "score": 6.5, "confidence": 0.55, "evidence": [
      { "shot": "high/desktop/R07", "note": "left lamp pool lights the left lane (Y 112.7 vs 45.6 unlit); player sits between pools" },
      { "shot": "high/desktop/R13", "note": "contact shadow under the player's tub Y 84.7 vs open road 143.6" },
      { "shot": "high/desktop/R11", "note": "concede: little warm rim at sunset, crew Y 58 vs road 46" },
      { "shot": "high/desktop/R10", "note": "clean key light and tree shadows; day palette distinct from R07 dusk and R11 sunset" } ] },
    "animation": { "score": 7.0, "confidence": 0.5, "evidence": [
      { "shot": "strips/high/R14", "note": "lean, tub angle, charge arc blue (f3-5) then white (f6-8); water spills f6-8 as gauge falls 41-40-39" },
      { "shot": "strips/high/R15", "note": "crew circles with rigid limb swings; water-drop burst f2-7; fumble starts before f1 so the kick peak is not sampled (offset -2..+2 px at 0.377x)" },
      { "shot": "strips/high/R16", "note": "judge-stop circling with the progress bar filling" },
      { "shot": "crops/high/R04-player", "note": "tub and water tilt, captain lean" } ] },
    "ui": { "score": 7.5, "confidence": 0.55, "evidence": [
      { "shot": "high/desktop/R16", "note": "context-aware HUD: SEMIFINAL tile and judge panel; bar fills 3 to 74 px across strips/high/R16" },
      { "shot": "high/desktop/R17", "note": "8 LEFT tile and arena radar replace lap and minimap in Water Fight" },
      { "shot": "high/desktop/R18", "note": "studded results board and brick buttons consistent with menus" },
      { "shot": "high/landscape/R17", "note": "concede: HOT STEAM banner covers the item tile's lower edge" } ] },
    "typography": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/mobile/R02", "note": "description lines about 13 CSS px (22 device px at 2x); legible secondary size" },
      { "shot": "high/landscape/R18", "note": "results rows about 13 CSS px; CLEAN chips crisp at 4x" },
      { "shot": "high/desktop/R17", "note": "concede: TICKETS label 8 px cap height on desktop" },
      { "shot": "high/landscape/R17", "note": "concede: Steer label straddles the pad rim" } ] },
    "readability": { "score": 7.0, "confidence": 0.5, "evidence": [
      { "shot": "high/desktop/R07", "note": "dusk rivals separate: pink Y 97.8, tie-dye 86.1 vs road 45.6-51.0; player flagged by ring and pointer" },
      { "shot": "high/mobile/R07", "note": "same on phone: pink 99.8, tie-dye 83.5 vs road 45.2-52.9" },
      { "shot": "high/mobile/R04", "note": "four rival crews in separate positions; player ring clear" },
      { "shot": "high/desktop/R04", "note": "barrel, white and pink tubs visible in the pack at 2.5x; item bubbles pop" },
      { "shot": "high/desktop/R08", "note": "concede: hairpin queue hides rival tubs behind crews" } ] },
    "mobile": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/mobile/R04", "note": "tub mid-frame, clear of steer pad and button cluster" },
      { "shot": "high/landscape/R08", "note": "tub clear of controls; HUD gutters respected" },
      { "shot": "high/landscape/R17", "note": "concede: banner collides with item tile" },
      { "shot": "high/mobile/R02", "note": "concede: team panel flush to the bottom edge" } ] },
    "authenticity": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R06", "note": "Arlington twin towers and domes close the vista" },
      { "shot": "high/desktop/R05", "note": "Fordyce patterned storeys, canopy and lantern roof" },
      { "shot": "high/desktop/R16", "note": "judges, flag, duck, Rules of the Row" },
      { "shot": "ab/high-desktop-R19", "note": "concede: ford regressed from bluer B (B-R 43) to paving-grey A (B-R 18)" } ] }
  },
  "ip": { "clean": true, "notes": "Concur with both critics: rounded block heads, mitten hands, straight box torsos; no LEGO name or logo seen." },
  "gaps": [
    { "id": "G-dusk-lane-light", "category": "lighting", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/desktop/R11"], "benchmark": "worlds-4", "fix": "Pools already reach the near lane (left lane Y 112.7 vs 45.6 unlit in R07); close the dark stretch between pools with spacing or a soft lane fill and add a warm rim on figures at sunset (R11 crew Y 58 vs road 46)." },
    { "id": "G-dusk-pack-separation", "category": "readability", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/mobile/R07"], "benchmark": "drive-3", "fix": "Rivals already read at about 2:1 against the road; target dark-uniformed crews only (Velvet Mob Y 54 vs road 46) with a low dusk emissive on the ring and a team-coloured rim term." },
    { "id": "G-horizon-wallpaper", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R03", "high/desktop/R06"], "benchmark": "drive-1", "fix": "Randomise crown scale and offset per row, break cliff faces with sloped plate steps, use instanced conifers on the near ring; no identical crown pattern repeating within 150 px at 1280 wide." },
    { "id": "G-camera-kick-and-effects", "category": "animation", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R15", "strips/high/R14"], "benchmark": "drive-3", "fix": "Re-capture R15 with frame 1 on the impact tick before tuning the kick angle (the fumble starts before frame 1 now); make steam plumes larger, stud-shaped and growing; add a parts-pop on fumble." },
    { "id": "G-ford-reads-as-paving", "category": "materials", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R19", "ab/high-desktop-R19"], "benchmark": "bj-2", "fix": "Teal depth absorption, edge foam line, ripple rings around wading tubs, stronger fresnel at the chase-cam angle; ford mean B-R >= 30 (now about 18-22, the other build 43)." },
    { "id": "G-flat-lawns", "category": "materials", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R06"], "benchmark": "worlds-1", "fix": "Only the elevated R06 view loses studs (near lawns in R05 and R12 are studded); add baseplate seams or a stud-tile tint that survives at landmark-camera distance." },
    { "id": "G-masonry-rocks", "category": "materials", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R09"], "benchmark": "drive-5", "fix": "Rebuild Goat Rock from slope and wedge bricks with stud tops and plate steps instead of a brick-course texture." },
    { "id": "G-hud-brick-cue", "category": "ui", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R03", "high/desktop/R17"], "benchmark": "drive-3", "fix": "Stud row or brick-tile edge on HUD tiles to match the menus; animate the place tile on change." },
    { "id": "G-landscape-banner-collision", "category": "ui", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R17"], "benchmark": "drive-3", "fix": "Place transient event banners >= 8 px below the item tile (or in the lower-centre band) in landscape." },
    { "id": "G-portrait-bottom-safe-area", "category": "mobile", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R02"], "benchmark": "drive-2", "fix": "Pad the team-select panel by env(safe-area-inset-bottom) + 16 px; it now ends at y 1687 of 1688." },
    { "id": "G-tub-enamel-streaks", "category": "characters", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R02-preview-captain", "crops/high/R03-kart_5", "ab/crop-R02-preview-captain"], "benchmark": "drive-4", "fix": "Fix stretched UVs or normal map on the tub shell so enamel shades smoothly; this also removes the streaks that show through the clear water." },
    { "id": "G-mountain-walls", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06"], "benchmark": "2k-drive/drive-5.jpg", "fix": "Duplicate of G-horizon-wallpaper; overlapping hills already shipped, so reduce face steepness and crown regularity; verify neither landmark view is dominated by a continuous patterned wall." },
    { "id": "G-forest-repetition", "category": "scenery", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R08", "high/desktop/R19"], "benchmark": "worlds/worlds-1.jpg", "fix": "Several assemblies already exist (R09, R12); reduce near-camera canopy scale at frame edges and vary crown density; verify switchback apex and leading tubs stay unobstructed." },
    { "id": "G-material-consistency", "category": "materials", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R05"], "benchmark": "builders-journey/bj-3.jpg", "fix": "Give roofs, frames and trim readable part boundaries and edge response; the water-streak half belongs to G-tub-enamel-streaks (streaks identical in both builds)." },
    { "id": "G-pack-separation", "category": "readability", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R08"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Raise chase height or look-ahead in tight corners so rival tub footprints show in hairpin queues (R08); R04 and mobile R04 already separate." },
    { "id": "G-action-follow-through", "category": "animation", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Add push compression and release and expanding steam silhouettes; water response already reads (spill and gauge drop in R14 f6-8, burst in R15)." },
    { "id": "G-phone-secondary-type", "category": "typography", "expectedGain": 0.2, "severity": 1, "effort": "M", "workstream": "WS6", "evidence": ["high/mobile/R02", "high/landscape/R18"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Secondary text measures about 13 CSS px; shorten team descriptions rather than resize; verify essential labels at CSS viewport size without zoom." }
  ]
}
```
