# Advocate, loop 9, high tier

All capture paths are relative to `screenshots/review-loop-9/`. Measurements were taken on the full-size PNGs. L is
Rec. 709 luma (0–255). Strip frames are 480×300 tiles.

## Position
Both critics land on 68/100, and most of their deductions survive the captures:
- the far hill rings read as painted flats;
- crevice occlusion is missing;
- the steam is made of beads;
- the Out-of-Towners' tub is still purple, so a logged fix did not render.

Three things do not survive:
- **Critic A's factual errors.** Four of Critic A's claims are contradicted by measurement: "no camera kick", "the dusk
  lamps light nothing", "the tree plates have no studs" and "the facades have no seams". Two of those claims drive Critic
  A's lighting and animation scores.
- **Codex's double counting.** Three of Codex's gaps re-count defects that Critic A already filed (hill rings, steam,
  occlusion), and Codex gives them larger gains.
- **Wrong anchor.** Several deductions grade against the 9 anchor, not the 7 anchor: brick-part effects, recovery
  phrasing and mould seams.

I propose 69.5. Each change is no more than half a point from the critic mean:

| Category | Mean | Change | Proposed |
|---|---|---|---|
| Scenery | 6.25 | +0.25 | 6.5 |
| Materials | 6.5 | +0.5 | 7.0 |
| Animation | 6.5 | +0.5 | 7.0 |
| Readability | 6.75 | +0.25 | 7.0 |
| Authenticity | 7.25 | +0.25 | 7.5 |

The other five categories stay at the mean.

## Facts a critic got plainly wrong
1. **Critic A: "No camera kick shows in any strip."** It is wrong for `strips/high/R15`.
   - The far skyline sits 10–12 px higher in frame 1 than in frames 3–8. At x = 160/200/280/320 it is at y =
     62/48/48/65 in frame 1, and at 73–75/59/59–60/76–77 in frames 3–8.
   - Frame 2 is partway back (70/59/58/75).
   - The gold ring's lower edge is at y = 220 in frame 1, against 246–254 later.
   - So the camera jolts on the hit frame and settles over two frames. Codex saw this correctly ("camera
     displacement").
2. **Critic A: "the dusk lamps light nothing" (`high/desktop/R07`).** A row at y = 440 shows bright asphalt along both
   curbs, under the lamp rows:

   | Part of the y = 440 row | x | L |
   |---|---|---|
   | Left curb | 120–240 | 151–173 |
   | Mid-road | 440–560 | 88–94 |
   | Right curb | 800–880 | 167–181 |

   - The curbside asphalt is 1.6–1.9× the mid-road at the same depth. That passes Critic A's own test: asphalt near a
     lamp at least 25% brighter than mid-road.
   - `low/desktop/R07` shows the same profile, so this is not noise.
   - Critic A's sample (63,45,40) is mid-road, between the pools. Codex read the same frame as having "useful pools of
     lamplight".
   - I can't prove from a still that the lamps, rather than the low sun, light these pools. But "nothing" is not what
     the frame shows.
3. **Critic A: "The tree 'plates' have no studs."** A zoom of `high/desktop/R05` (x 600–880, y 580–800) shows rows of
   studs on every top face of the near tree plates. In `high/desktop/R10`, Critic A's own evidence, the camera is below
   the near canopies and sees only their undersides and edges, where no stud would show.
4. **Critic A: the facades have "no brick edges, no seams and no bevel highlights" (zoom of `high/desktop/R13`).**
   - The zoom of R13 (x 570–1000, y 0–300) shows running-bond mortar seams, and each brick is lighter at the top edge
     and darker at the bottom (relief shading).
   - Window frames project from the wall, and stone string courses run in relief.
   - In `high/desktop/R05` the Fordyce's projecting window sills cast crisp shadows down the relief brick.
   - Bevel highlights on the building corners are indeed missing; the rest of the claim is not true.
5. **Critic A: "Nothing translucent glows."** The bubble pickup in `high/desktop/R17` (x ≈ 1100–1200, y = 460) reads at
   (201–255, 197–255, 255): an iridescent, glowing translucent sphere. The pickups in R10 and R11 match it, the tub
   water in `crops/high/R02-preview-captain` is clear, and the globes in R07 glow.
6. **Critic A: "the space under the chassis is flat grey" (`crops/high/R03-kart_1`).**
   - The road under the chassis is (39,48,53) to (40,50,57), against (77,86,91) on open road to the left. That is about
     half, so the kart is grounded.
   - It is probably the cast shadow rather than true occlusion, which is the real gap; see Lighting below.
7. **Critic A: "Faces are two dots and a mouth."**
   - `crops/high/R04-kart_3`: the tie-dye crew have angled printed brows and open mouths with teeth.
   - `crops/high/R02-preview-captain`: the captain's eyes carry highlights, and the open mouth shows teeth and tongue.
8. **Critic A: portrait team select "fit[s] with margins" (`high/mobile/R02`).** This one cuts against the build. The
   panel's top edge (y ≈ 510) cuts off the bottom half of the preview's front wheel and the crew's feet. Codex is right
   on this.

## Category by category

**Characters: hold at 7.0** (mean 7.0).
- Concede:
  - The heads under the firefighter helmets have blank backs (`crops/high/R02-preview-rear`).
  - The tub shell is one moulding.
  - A pusher's fist meets the rim with little clearance (`crops/high/R04-kart_3`).
- Rebut, on Critic A's faces: see fact 7.
- Rebut, on Codex's G-tub-construction:
  - Tub construction already differs by division. The Traditional cast-iron tub stands on gold claw feet on a studded
    plate chassis, with bevelled wheels and bolted hubcaps (`crops/high/R02-preview`, `crops/high/R03-kart_1`).
  - The cowboy crew push a wooden barrel, not a bathtub. It reads at chase distance in `high/desktop/R10`, and beside
    the red tub in `high/mobile/R04`.
  - Torso backs are printed: X straps and reflective bands on the firefighters (`crops/high/R02-preview-rear`), scale
    dots and spine print on the gators (`high/desktop/R17`).
- What separates this from the 9 anchor (`drive-4`): mould seams and part lines. The 7 anchor (printed faces with
  expression, printed uniforms, studded hats, all teams distinct at chase distance) is met.

**Materials: propose 7.0** (mean 6.5).
- The 7 anchor (`worlds-1`) and the captures:
  - **Highlights following bevels.** Helmets, tub rims and the duck (`crops/high/R02-preview-captain`).
  - **A real-brick palette.**
  - **Shaded studs near the camera.** Tree-plate tops in R05 (fact 3), the baseplate grass in `high/desktop/R09` and
    `high/desktop/R10`, and the chassis studs in `crops/high/R03-kart_1`.
  - **Seams between parts.** Mortar seams and relief in R13 and R05 (fact 4), and plate courses on the Goat Rock slabs
    in R09.
  - **Clear parts.** The tub water and the pickup bubbles (fact 5).
- Look at `worlds-1` itself: its white house walls are flat surfaces with brick lines. R05 and R13 are not
  categorically flatter, and R05 adds projecting sills and a zig-zag awning trim.
- Concede, from Codex:
  - The Gulpha ford in `high/desktop/R19` is opaque blue tile with no clarity or depth. That is real, and the worst
    surface in the set.
  - The ground-floor glazing in `high/desktop/R05` uses diagonal streak bands.
- Concede, from Critic A: building corners lack bevel highlights, and roads show no wear.
- These are local shortfalls against a set that otherwise meets the 7 checklist.

**Scenery: propose 6.5** (mean 6.25).
- Concede the far rings:
  - In `high/desktop/R05` the right hill reads as a pale stepped wall with stamped tree triangles. Critic A's 86%-of-sky
    measurement in R13 is right.
  - The two-storey downtown modules repeat (`high/desktop/R13`, right side of `high/desktop/R04`).
- Rebut Codex's 6.0. The 7 anchor (studded baseplate, tile roads, brick buildings, trees and props, recognisable
  landmarks, a set piece per course) is met element by element:
  - studded baseplate in R09, R10 and R19;
  - terracotta tile path in R10, brick plaza in R17, studded crossing tile in R16;
  - landmarks: Fordyce in R05, Arlington in R06, Quapaw dome in R14;
  - set pieces: Goat Rock in R09, the ford in R19, the plaza in R17, the switchback retaining wall in R08.
- Rebut "repeated conifers" as a single asset. R09 mixes tall and short conifers in two greens with a light-green
  broadleaf and an orange autumn tree on the left. `high/desktop/R12` mixes broadleaf, conifer and autumn trees.
- On "upright masonry blocks" in R09: Goat Rock is a novaculite outcrop, and pale, angular, upright slabs are how it
  should read. Critic A names it as the set piece.
- Concede the A/B: the darker foothill row helps (`ab/high-desktop-R06`), but the far rings remain the main drag.

**Lighting: hold at 6.5** (mean 6.5).
- Concede the decisive 7-anchor miss: there is no visible crevice or under-ledge occlusion. See the Goat Rock slabs in
  `high/desktop/R09` and the Arlington front faces in `high/desktop/R06`, which are evenly front-lit at L ≈ 155–178.
- Rebut Critic A's lamp claim (fact 2) and "flat grey" under the chassis (fact 6).
- Rebut "daylight is a flat even fill" for `high/desktop/R05`: sills cast crisp shadows and trees cast shadows on the
  lawn.
- Even R06 is not flat in shadow terms:
  - the Arlington's side faces sit at L ≈ 77 against L ≈ 155–178 for its front faces;
  - the entrance terrace roof is L 182–194 where lit and L 102–117 in the wing's shadow.
- The dusk palette in R07 and the sunset palette in R11 are deliberate.
- Net: a high 6.5 that occlusion alone keeps from 7.

**Animation: propose 7.0** (mean 6.5).
- Against the 7 anchor:
  - **The crew push-run and circle with toy articulation.** In `strips/high/R15` frames 3–8, the four crew take
    different paths, with legs swinging at the hips. In `strips/high/R16` the poses change frame to frame and the
    progress bar fills.
  - **Hits read with particles and camera kick.** R15 frame 1 has the flash, the call-out and the kick (fact 1).
    Frames 3–6 throw water beads.
  - **Slides read.** In `strips/high/R14` a charge arc grows from blue (frames 3–5) to white (frames 7–8), and steam
    trails behind the tub.
- The only 7-anchor item not shown is water slosh.
- Concede:
  - The steam is round beads (R14 frames 3–8).
  - The hot steam behind the tub in `high/desktop/R17` blends to tan on red brick, (188,153,120) at (630,585). It
    looks semi-transparent, so it picks up the ground colour.
- Rebut "soft spheres, not brick parts" and "limited recovery phrasing": both grade against the 9 anchor ("brick-built
  effects", "anticipation and follow-through"), not the 7.
- The bleached crew in `crops/high/R15-player` is the hit flash frozen at its peak. In the strip it fades by frame 2.

**UI / HUD: hold at 7.0** (mean 7.0).
- One studded-tile family across HUD, title, team select and results (`high/desktop/R04`, `high/desktop/R01`,
  `high/desktop/R18`).
- Codex's "oversized empty orb" is true of the empty state. In `high/desktop/R17` the same orb carries the item
  ("×3" bubbles).

**Typography: hold at 7.0** (mean 7.0).
- I re-measured Critic A's contrasts in `high/mobile/R02` and agree:
  - selected-card division label: 2.36:1;
  - "locked": 2.75:1.
- The selected label is a real miss.
- The "locked" labels mark disabled cards, and dimming them is deliberate. WCAG 1.4.3 exempts inactive components.
  The locked team names still measure 4.36:1.
- Codex's "arcade identity" for the pixel display face is a taste call. The rubric's 9 anchor asks for "type with
  character".

**Readability: propose 7.0** (mean 6.75).
- Against the 7 anchor:
  - **Player.** The gold ring and arrow pick out the player on asphalt, tile and brick (`high/desktop/R10`, R13, R17)
    and on both phone viewports (`high/mobile/R04`, `high/landscape/R04`).
  - **Pickups.** The bubbles glow (R10, R11, R17).
  - **Judge stop.** The booth reads (R16).
  - **Edges.** The curbs are white-lined (R08, R11, R14).
- Concede, Out-of-Towners' tub:
  - It is purple in `crops/high/R04-kart_3`, and on both sides of `ab/crop-R04-kart_3`, so the logged teal tub did not
    render in either build.
  - It is still purple in R11, R12 and R13.
  - Their team swatch is teal (47,179,166) with yellow, in `high/desktop/R02`.
- Severity, though: beside the Velvet Mob in R07 the hues match (~289°), but the luminance differs about 1.9×,
  (70,38,77) against (154,65,173). The crews differ completely: black suits with a gold H against tie-dye and antennae.
- Rebut "pushers hide the tubs" as overstated. The tub body shows between the rear pushers:
  - red in `high/desktop/R03` and `high/mobile/R04`;
  - blue in `high/desktop/R11`;
  - purple in `high/desktop/R12`.
  Each kart reads as one unit with its own ring.
- Rebut "rival rings vanish" in R13: a 3× zoom (x 280–520, y 300–470) shows a thin yellow ring and a thin green ring,
  both visible. They are muted by design, so the gold one dominates.
- Partly concede Codex's R19: trees on the right hide the exit past the ford.

**Mobile: hold at 7.0** (mean 7.0).
- Concede, portrait team select: the panel crops the preview's wheels and feet (fact 8).
- Critic A's landscape figure is right: the left column runs y = 25–445 of 780. But it covers only the sidewalk and
  the Row's facade in `high/landscape/R04`. The tub, the road and the pack are clear, and so is the steer pad.
- The portrait top HUD in `high/mobile/R04` sits over sky and far hills.

**Authenticity: propose 7.5** (mean 7.25).
- The 7 anchor and the captures:
  - **The Row.** The Fordyce's marquee and shop windows are back (`high/desktop/R05`, `ab/high-desktop-R05`). The
    Quapaw's tiled dome shows down Central (`high/desktop/R14`).
  - **The Arlington.** Its twin towers close the vista (`high/desktop/R06`).
  - **The race.** The judge stop's "Ring around the tub!" (R16), the 10-gallon water line, ducks and flags.
  - **The event.** `high/desktop/R01` names the World Championship Running of the Tubs on Central Avenue.
- Against Codex's "generic rock" in R09: the white upright outcrop is Goat Rock's novaculite, which is a
  place-specific read.
- Concede: the Ouachitas are generic terraces (R05), and Bridge Street (R13) is generic downtown. That keeps it from 8.

## Gap adjustments
Critic A's gaps:
- **G-hill-rings-cardboard:** keep (severity 3, +0.5). It is the same backdrop as Codex's G-terrain-assembly.
- **G-crew-hides-tub:** 3 → 2, +0.5 → +0.25. The tub body shows in R03, R11, R12 and mobile R04.
- **G-oot-tub-still-purple:** 3 → 2, keep +0.25. The fix did not land, but luminance and crews separate the two
  teams.
- **G-no-ao-no-lamp-pools:** 3 → 2, +0.5 → +0.25. The lamp half already passes its own test (fact 2). The occlusion
  half duplicates G-contact-light.
- **G-flat-facades:** 3 → 2, +0.5 → +0.25. The stud and seam claims fail (facts 3 and 4); only the corner bevels
  remain.
- **G-generic-sphere-fx:** keep (severity 3, +0.5), minus the camera-kick claim.
- **G-weak-label-contrast:** keep (severity 2, +0.25), narrowed to the selected label.
- **G-landscape-hud-weight:** 2 → 1, keep +0.25. The measurement is right, but the column covers nothing in play.
- **G-repeat-storefronts:** keep (severity 2, +0.25).
- **G-blank-head-backs:** keep (severity 2, +0.25), minus the brows, which already exist.

Codex's gaps:
- **G-terrain-assembly:** 4 → 3, +1.0 → +0.25. Over the hill rings, only the rock and continuity work is new, and the
  rock shape is place-accurate.
- **G-environment-materials:** 4 → 3, +1.0 → +0.5. It covers two local surfaces, the ford and the glazing.
- **G-contact-light:** keep (severity 3, +0.5). This is the real lighting gap.
- **G-vegetation-repetition:** 3 → 2, +0.5 → +0.25. R09, R12 and R19 already mix silhouettes.
- **G-steam-followthrough:** 3 → 2, +0.5 → +0.25. The steam half duplicates G-generic-sphere-fx, and recovery
  phrasing is a 9-anchor item.
- **G-tub-construction:** 3 → 2, +0.5 → +0.25. Clawfoot tubs and barrels are already division-specific.
- **G-phone-density:** keep severity 2, +0.5 → +0.25. The R02 wheel crop is real; the R04 HUD sits over sky.

## IP check
I agree with both critics: clean. The heads are square, the hands are mitten fists, the torsos are straight boxes, and
there is no LEGO name or logo anywhere.

```json
{
  "loop": 9,
  "role": "advocate",
  "tier": "high",
  "scores": {
    "characters": { "score": 7.0, "confidence": 0.75, "evidence": [
      { "shot": "crops/high/R02-preview-captain", "note": "highlighted eyes, open mouth with teeth and tongue, printed coat with hydrant badge; clear tub water" },
      { "shot": "crops/high/R04-kart_3", "note": "angled printed brows contradict 'two dots and a mouth'; fist meets rim with little clearance (concede)" },
      { "shot": "crops/high/R02-preview-rear", "note": "blank head backs under helmets (concede); printed X straps and bands on torso backs" },
      { "shot": "high/desktop/R10", "note": "cowboy crew push a barrel, not a bathtub: division-specific construction already reads at chase distance" } ] },
    "materials": { "score": 7.0, "confidence": 0.55, "evidence": [
      { "shot": "high/desktop/R05", "note": "zoom: studs on every near tree-plate top; relief brick; projecting sills casting shadows" },
      { "shot": "high/desktop/R13", "note": "zoom: running-bond mortar seams, per-brick relief shading, projecting frames and string courses; corner bevels missing" },
      { "shot": "high/desktop/R17", "note": "bubble pickup glows (201-255,197-255,255): translucent part" },
      { "shot": "high/desktop/R19", "note": "ford is opaque flat blue tile (concede)" } ] },
    "scenery": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R05", "note": "far hill is a pale stepped wall with stamped tree triangles (concede)" },
      { "shot": "high/desktop/R09", "note": "Goat Rock novaculite set piece on studded baseplate; conifers in two greens, broadleaf and autumn trees" },
      { "shot": "high/desktop/R12", "note": "mixed broadleaf, conifer and autumn silhouettes" },
      { "shot": "high/desktop/R13", "note": "repeated two-storey module (concede)" } ] },
    "lighting": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R07", "note": "y=440: curbside asphalt L 151-181 vs mid-road L 88-94 (1.6-1.9x); same on low/desktop/R07" },
      { "shot": "crops/high/R03-kart_1", "note": "road under chassis (40,50,57) vs open road (77,86,91): grounded, but no crevice AO" },
      { "shot": "high/desktop/R06", "note": "front faces evenly lit L 155-178 (concede); side faces L 77; terrace roof L 182-194 lit vs 102-117 in shadow" },
      { "shot": "high/desktop/R11", "note": "deliberate sunset palette with haze" } ] },
    "animation": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "strips/high/R15", "note": "frame 1 skyline 10-12 px and ring 26-34 px higher than frames 3-8: camera kick decaying over two frames; flash, call-out, splash; crew circle on distinct paths" },
      { "shot": "strips/high/R16", "note": "pose changes every frame; progress bar fills" },
      { "shot": "strips/high/R14", "note": "charge arc blue to white; steam is round beads (concede); no slosh visible" },
      { "shot": "high/desktop/R17", "note": "hot steam blends tan (188,153,120) on red brick (concede)" } ] },
    "ui": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R04", "note": "clear hierarchy in one studded-tile family" },
      { "shot": "high/desktop/R17", "note": "item orb filled ('x3' bubbles) when holding an item" },
      { "shot": "high/desktop/R18", "note": "results panel matches the HUD style" } ] },
    "typography": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/mobile/R02", "note": "selected label 2.36:1 (concede); 'locked' 2.75:1 marks disabled cards; locked names 4.36:1" },
      { "shot": "high/desktop/R18", "note": "pixel display over sans: clear two-level scale" },
      { "shot": "high/landscape/R02", "note": "names intact, no hyphen breaks" } ] },
    "readability": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "high/mobile/R04", "note": "gold ring isolates the player; red tub visible between pushers" },
      { "shot": "high/desktop/R12", "note": "purple tub body visible between rear pushers" },
      { "shot": "high/desktop/R13", "note": "3x zoom: muted rival rings remain visible" },
      { "shot": "crops/high/R04-kart_3", "note": "Out-of-Towners tub still purple, both sides of ab/crop-R04-kart_3 (concede)" },
      { "shot": "high/desktop/R19", "note": "trees hide the exit past the ford (partial concede)" } ] },
    "mobile": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "high/mobile/R02", "note": "panel edge crops the preview's front wheel and the crew's feet (concede)" },
      { "shot": "high/landscape/R04", "note": "left column y=25-445 of 780 covers only sidewalk and facade; tub, road and pack clear" },
      { "shot": "high/mobile/R18", "note": "one-line values, swatches, check marks" } ] },
    "authenticity": { "score": 7.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R05", "note": "Fordyce marquee with ground-floor shop windows" },
      { "shot": "high/desktop/R14", "note": "Quapaw tiled dome down Central" },
      { "shot": "high/desktop/R09", "note": "Goat Rock as a pale upright novaculite outcrop" },
      { "shot": "high/desktop/R16", "note": "judge stop, 'Ring around the tub!'" },
      { "shot": "high/desktop/R13", "note": "Bridge Street generic downtown (concede)" } ] }
  },
  "ip": { "clean": true, "notes": "Agree with both critics: square heads, mitten fists, straight box torsos; no LEGO name or logo." },
  "gaps": [
    { "id": "G-hill-rings-cardboard", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R13", "high/desktop/R05", "high/desktop/R01"], "benchmark": "worlds-4", "fix": "Build the middle and far rings as stepped brick terraces with lit tops and shadowed risers (at least 15% value contrast); haze toward sky hue, not white. Test: R13 far-ring face/riser luminance ratio at least 1.15. Shares the backdrop with G-terrain-assembly; gains are not additive." },
    { "id": "G-crew-hides-tub", "category": "readability", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["high/desktop/R10", "high/desktop/R03", "high/desktop/R12"], "benchmark": "drive-3", "fix": "Spread the pushers 0.25 m wider or lower the chase look-at so more of the tub body shows. Tub colour already shows between pushers in R03, R11, R12 and mobile R04, so severity is lower. Test: at least 30% of the player tub silhouette pixels are tub colour in R10." },
    { "id": "G-oot-tub-still-purple", "category": "readability", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R04-kart_3", "ab/crop-R04-kart_3", "high/desktop/R07", "high/desktop/R02"], "fix": "Apply teal to the Out-of-Towners' tub body (still purple on both sides of ab/crop-R04-kart_3, and in R11 to R13) to match the teal swatch (47,179,166). Test: R04-kart_3 body hue 170-180 degrees. Severity 2: luminance (about 1.9x) and crews already separate them from the Velvet Mob." },
    { "id": "G-no-ao-no-lamp-pools", "category": "lighting", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["crops/high/R03-kart_1", "high/desktop/R07"], "benchmark": "worlds-4", "fix": "Keep the AO half only: SSAO or baked AO on high for building crevices and part joins. The lamp half already passes its own test (R07 curbside asphalt 1.6-1.9x mid-road). Overlaps G-contact-light." },
    { "id": "G-flat-facades", "category": "materials", "expectedGain": 0.25, "severity": 2, "effort": "L", "workstream": "WS1", "evidence": ["high/desktop/R13", "high/desktop/R05"], "benchmark": "worlds-1", "fix": "Add bevelled corner and lintel parts with specular edges. Drop the tree-stud and mortar-seam parts: studs already show on tree-plate tops (R05) and seams on the facades (R13 zoom). Test: a highlight runs along building corners in the R13 zoom." },
    { "id": "G-generic-sphere-fx", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15", "high/desktop/R17"], "benchmark": "drive-3", "fix": "Make hot steam opaque or additive white so it does not blend tan (188,153,120) on red brick; shape steam into swelling plumes; animate water-surface tilt. Camera kick already exists (R15 frame 1); remove that claim. Test: the water plane tilts across strips/high/R14." },
    { "id": "G-weak-label-contrast", "category": "typography", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R02"], "fix": "Raise the selected card's division label from 2.36:1 to at least 4.5:1. The 'locked' labels (2.75:1) mark disabled cards and need no change." },
    { "id": "G-landscape-hud-weight", "category": "mobile", "expectedGain": 0.25, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R04"], "fix": "Optional: scale the landscape tiles by 0.8 and merge the water gauge and item tray. The column covers only sidewalk and facade, not the tub or the road." },
    { "id": "G-repeat-storefronts", "category": "scenery", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R13", "high/desktop/R04"], "benchmark": "worlds-1", "fix": "Add three or four downtown facade variants (cornice, window rhythm, colour), and never place the same variant twice in a row." },
    { "id": "G-blank-head-backs", "category": "characters", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R02-preview-rear"], "benchmark": "drive-4", "fix": "Print hair or a helmet rear brim and straps on the backs of heads; add a torso-side mould seam. Brows are already printed (R04-kart_3)." },
    { "id": "G-terrain-assembly", "category": "scenery", "expectedGain": 0.25, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R09"], "benchmark": "worlds/worlds-1.jpg; 2k-drive/drive-5.jpg", "fix": "Only the increment over G-hill-rings-cardboard: continuous foreground-to-horizon terrain. Keep Goat Rock's pale, upright novaculite read; vary its slab silhouettes rather than lowering them." },
    { "id": "G-environment-materials", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS1", "evidence": ["high/desktop/R19", "high/desktop/R05"], "benchmark": "builders-journey/bj-3.jpg", "fix": "Give the Gulpha ford a clear tinted-plastic surface with depth (it is now opaque tile), and replace the diagonal glazing streaks with a coherent reflection. These are two local surfaces, so severity 3, not 4." },
    { "id": "G-contact-light", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R09", "high/desktop/R06"], "benchmark": "builders-journey/bj-1.jpg", "fix": "Add restrained contact shading between rock slabs, under ledges and at foundations. Verify in matching daylight captures. This is the one lighting gap the captures fully support." },
    { "id": "G-vegetation-repetition", "category": "scenery", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R09", "high/desktop/R19", "high/desktop/R12"], "benchmark": "worlds/worlds-1.jpg", "fix": "Vary the tiered conifer (branch count, offset and tilt). R09 and R12 already mix conifer, broadleaf and autumn silhouettes, so severity 2." },
    { "id": "G-steam-followthrough", "category": "animation", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Add a stumble-to-regrip transition after the circle. The steam half duplicates G-generic-sphere-fx, and recovery phrasing is a 9-anchor item." },
    { "id": "G-tub-construction", "category": "characters", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R02-preview", "high/desktop/R10"], "benchmark": "2k-drive/drive-4.jpg; skywalker/sw-3.jpg", "fix": "Add part joins and fittings to the tub shells. Division-specific construction already exists (clawfoot tubs, barrel tubs), so severity 2." },
    { "id": "G-phone-density", "category": "mobile", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/mobile/R02", "high/mobile/R04"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Frame the portrait team-select preview so its wheels and the crew's feet clear the panel edge (now cut at y about 510). The R04 top HUD sits over sky and far hills, so the gain is lower." }
  ]
}
```
