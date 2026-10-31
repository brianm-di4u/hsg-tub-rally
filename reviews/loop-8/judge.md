# Judge: loop 8, high tier

## Verdict
**Continue. Judged total: 66.5 / 100**, before the tally's A/B rule. Five categories are below their gates: materials, scenery, lighting, animation and readability. Characters, UI, typography, mobile and authenticity meet theirs. The measured gates pass (perf: 52 checked, none failed; IP: clean; fidelity: null).

The close-up toys are strong, and the four reviewers agree on that. Three things hold the game back:
- **Horizon.** It is a terraced wall printed with tree decals, and its far tiers render brighter than the sky in nearly every frame.
- **Landmark facades.** They carry blurry painted window panels.
- **Game feel.** Two of this loop's logged animation changes, the 4° impact dip and the rising slide steam, do not show in the strips. I checked this by measurement.

## Checks on the inputs
- **Totals.** Each reviewer's JSON scores add up to the total in its prose:
  - Critic A: 66.0
  - Critic B: 66.5
  - Prosecutor: 62.0 (critic mean 66.25)
  - Advocate: 69.0
- **Gate claims.** Both critics' statements about which categories miss their gates match their JSON.
- **Spread.** The critics are never more than 0.5 apart in any category. The prosecutor and the advocate are exactly 1.0 apart in characters, materials, animation and readability, and 0.5 apart elsewhere, so no category passes the "more than 1.0" trigger. I still opened the close-ups and strips behind those four categories and rule on them below.
- **A/B void.** None. I spot-checked `ab/crop-R03-player-rear`, `ab/high-desktop-R04` and `ab/strip-R15`. Both sides show the same high-tier moment. The only difference is in R15: the change list documents that its strip now starts one tick after the hit, not two. That affects one of the three animation pairs, and both critics called animation a tie anyway. Disagreement alone is not grounds for a void, so no `abWeight` is set.
- **Not a calibration loop.** Calibration runs every third loop, and loop 8 isn't one.

## Factual disputes I settled
I measured these in the captures (my crops are in the scratch folder `j8`; coordinates are in each image's own pixels).

| Claim | Who | Ruling |
|---|---|---|
| TICKETS has a 5 px cap height (`high/desktop/R04`) | Critic A | **Wrong.** Bright rows run 55–62, so the cap height is 8 px. The prosecutor and the advocate are right. |
| Helmets carry no studs | Critic A | **Wrong.** At 4× there are two plain studs on the crown (`crops/high/R02-preview-captain` x≈460–560, y≈25–60; `crops/high/R15-player`). |
| No part seams; legs are plain blocks | Critic A | **Wrong.** There is a separate hip block, split legs with their own hi-vis bands, and separate boots (`crops/high/R02-preview-captain` x≈900–1180; `crops/high/R02-preview-rear`). |
| Tree crowns are smooth slabs with no studs | Critic A | **Wrong for near crowns.** At 3×, `high/desktop/R05` (x 600–880, y 580–780) shows studded, bevelled crown plates with glints. R10 and R11 look up at the crowns, so their tops can't be seen. |
| No visible water slosh in any strip | Critic A | **Partly wrong.** Translucent blue beads burst over the rim in frames 3–7 of `strips/high/R15`, and the gauge drops from 37 to 36 GAL. The water surface itself never tilts. |
| Ghost tiers at x≈450–520, y≈130–220 in `high/desktop/R06` | Critic A | **Wrong place.** That spot is the Arlington's left belfry. The pale tiers sit at x≈370–440, y≈230–310 and x≈910–1040, y≈240–310, as the advocate says. |
| Far tiers are brighter than the sky (`high/desktop/R04`) | Prosecutor | **Confirmed.** In x 540–860, y 120–200, 2,795 px are more than 8 levels above the sky mean. The peak is (225, 252, 255) at (771, 193), against a sky of about (190, 219, 237) at the same height. `ab/high-desktop-R04` shows the same pale tiers on both sides, so this is a standing defect, not a regression. |
| No impact kick in R15 | Critic A, prosecutor (advocate concedes) | **Confirmed.** Cross-correlating the far band (x 150–330, y 30–110 of each 480×300 frame) gives at most 1 px of vertical shift across all 8 frames, and the sky edge moves at most 3 px. Frames are about 0.17 s apart. |
| Slide steam doesn't rise (`strips/high/R14`) | Critic A, prosecutor | **Confirmed.** At 2×, frames 3–8 show small bead clusters at ring level behind the tub. They are detached from the wheels, never rise above the rim and don't grow. |
| The slide ends in a lamp post | Prosecutor | **Confirmed.** In frame 8 of `strips/high/R14`, the post stands inside the player's ring and draws over the right-hand crewman. |
| The player marker loses to a rival in `high/desktop/R11` | Prosecutor | **Confirmed.** At 2×, the player's ring is white, the tie-dye rival's ring is saturated yellow, and the white arrow points into the pink rival's tub ahead. |
| Bright halo beside the legs in `crops/high/R04-player` | Prosecutor | **Confirmed.** The box at x 1000–1100, y 580–660 averages 114.8, against 87.0–92.0 on the open road. It is a streaky grey smear, visible only in the close-up. |
| Two teams share a purple tub | Prosecutor | **Confirmed** (`high/desktop/R07`, 2.5× zoom: the Velvet Mob and the tie-dye team). The crews themselves stay distinct. |
| Sunset has a warm horizon glow | Advocate | **Confirmed.** In `high/desktop/R11` at x=700, the sky goes from (188, 146, 127) at y=5 to (230, 181, 128) at y=200. There is no sun disc. |
| The portrait team-select margin is 4 CSS px, not the logged 16 px | All | **Confirmed.** In `high/mobile/R02` the shadow plate ends at row 1679, and the background runs from 1680 to 1687. |
| `high/mobile/R18` "wraps 25 gal / CLEAN" | Critic A | **Overstated.** Every row stacks the value over its chip the same way, aligned and unclipped. |

## Rulings by category

### Characters: 7.0
The advocate wins the seams, studs and team-identity facts:
- The hip piece, split legs, boots and helmet studs are all in `crops/high/R02-preview-captain` and `crops/high/R02-preview-rear`.
- I count 11 distinct crews across the race frames.

The prosecutor wins the tub facts:
- One smooth cast shell serves every team, with only the body colour, rim colour and one stripe decal changing (`crops/high/R03-kart_1`, `crops/high/R04-kart_3`).
- The shell has no studs. The only studs on a tub are on the chassis plate.
- Two teams ride purple tubs (`high/desktop/R07`).
- A faceted, untextured prop (the loofah) hangs by the tub in `high/desktop/R17`.

Faces are printed and expressive, uniforms are printed, close-ups are clean, and the old head hatching is gone (`crops/high/R15-player`). That meets the 7 anchor's figure items. The tubs fall short of "studs on tubs" and "built from recognisable brick parts", so the 9-anchor credit the advocate asks for isn't earned. **7.0**, confidence 0.65.

### Materials: 6.5
- **Actors.** ABS on figures and tubs follows the bevels, and the water reads as clear (`crops/high/R02-preview-captain`).
- **World, what works.** There are shaded studs near the camera: studded crowns in `high/desktop/R05`, studded baseplates in `high/desktop/R08` and `high/desktop/R09`. Goat Rock reads as stacked plates (`high/desktop/R09`).
- **What pulls it down.** These traits sit in the 5 anchor:
  - At 4× (`high/desktop/R05` x 840–1090, y 330–480), the Fordyce's window and ornament panels are blurry painted textures set on crisp bevelled brick. That is a style mismatch.
  - The hill ring is a set of flat boxes printed with tree triangles (`high/desktop/R04`, `high/desktop/R06`).
  - The ford is opaque blue paving (`high/desktop/R19`).
  - The "HOT STEAM!" boost is a clump of opaque orange spheres (`high/desktop/R17`).

The advocate's 7 rests on rebutting two of Critic A's four "doesn't" points, which is correct. The facade panels and the decal ring remain. **6.5**, confidence 0.6.

### Scenery: 6.5
The playable world reads as brick-built: baseplate lawns, tile roads, brick buildings, plate trees and figure crowds. Courses differ. `high/desktop/R12` has at least four crown types, which rebuts Critic B's "repeated conifer silhouettes". Each course doesn't fully get its own set pieces, though:
- R12, R13 and the empty plaza in `high/desktop/R17` are generic.
- The horizon is the same terraced decal wall on every course.
- The horizon's far tiers glow brighter than the sky in R01, R03, R04, R06, R12, R13, R14 and R17 (measured above).
- In `high/desktop/R06` the hill rises as a vertical wall straight off the Arlington's lawn (x 0–330, y 240–520).

That is between the 5 and 7 anchors, nearer 7. **6.5**, confidence 0.6.

### Lighting: 6.5
Met:
- A soft key with soft-edged tree shadows on the Fordyce wall (`high/desktop/R05`).
- A contact disc under every tub.
- Deliberate dusk and sunset palettes, with lamp pools at dusk (`high/desktop/R07`) and a warm sky gradient at sunset (`high/desktop/R11`, measured).

Not met:
- "Haze matched to the sky": the far tiers are measurably brighter than the sky (`high/desktop/R04`).
- Crevice occlusion is faint. At x=1000 in `high/desktop/R05` the wall darkens only from about 165 to about 140 in the last ~10 px before the lawn.
- There is no sun disc or rim light at sunset.
- Tree shadows on the road are shapeless blotches (`high/desktop/R08`).
- There is a bright smear in the close-up (`crops/high/R04-player`).

The prosecutor's 6.0 overweights the haze. The advocate's 6.5 concedes the right items. **6.5**, confidence 0.6.

### Animation and feel: 6.0
- **Crews.** The crew push-runs and circles the tub convincingly with rigid swinging limbs (`strips/high/R16`, `strips/high/R15`). This is the strongest part.
- **Hits.** Hits read through the bead burst over the rim and the crew scatter (`strips/high/R15`, frames 3–7), but there is no camera kick (≤1 px, measured).
- **Slides.** The slide reads through the charge arc, but its steam never rises (`strips/high/R14`), and frame 8 drives the tub into a lamp post.
- **Boosts.** The boost is an orange clump (`high/desktop/R17`).
- **Water surface.** It never tilts.

The 7 anchor asks for hits that read with camera kick, slides and boosts that read with particles, and visible slosh. Only part of that is on screen, and two of this loop's logged changes don't show. That puts it above "weak feedback" (5) but short of 7. The prosecutor's 5.5 ignores the good crew motion and the hit particles. The advocate's 6.5 credits a kick-less hit too generously. **6.0**, confidence 0.65. Both critics called the A/B a tie, so the tally will hold the previous score.

### UI / HUD: 7.0
- **Consistent style.** Menus, HUD and results share one brick style: stud-row plates and brick buttons (`high/desktop/R01`, `high/desktop/R02`, `high/desktop/R04`).
- **Clear hierarchy.** The HUD reads clearly in `high/desktop/R04`.
- **Small defects, at 3–4×:**
  - The empty item orb's top edge covers the third stud of its tile (`high/desktop/R04`).
  - The tray icons sit inside the tray's stud row.
- **Event banners.** They sit centrally over the far road: 340×125 px (4% of the frame) in `high/desktop/R16`, and 390×130 device px in `high/landscape/R17`. They are clear of the tub and the near road, which is a genre-normal placement but intrusive for the whole event.

These are minor against the 7 anchor. **7.0**, confidence 0.6.

### Typography: 7.0
- **Scale.** The display and UI faces form a clear scale. LAP numerals are about 21 px tall and "8TH" reads at a glance (`high/desktop/R04`). Results are aligned and unclipped (`high/mobile/R18`).
- **Small labels are legible.** Desktop secondary labels are small but readable: TICKETS has an 8 px cap height and the tray labels about 10 px (measured). Critic A's 5 px figure was a mismeasurement and carried part of both critics' 6.5.
- **The one real defect.** `high/landscape/R02` hyphen-breaks "The Out- / of- / Towners", and the locked cards run to four lines, though nothing is clipped.

The anchor's three tests (clear scale, numerals at a glance, nothing clipped) are met. **7.0**, confidence 0.55.

### Readability: 6.5
What reads well:
- Pickups, the judge stop and road edges all read (`high/desktop/R16`, `high/desktop/R11`, `high/desktop/R10`).
- At 3× the pack does separate by hat and crew (`high/desktop/R04`), as the advocate says.

What doesn't:
- In dense packs the crews hide the tub bodies and rings (`high/desktop/R07`, `high/desktop/R08`, `high/mobile/R07`).
- The player marker is inconsistent, because rings take the team colour. In `high/desktop/R11` a rival's yellow ring outshines the player's white one, and the arrow sits over the rival ahead (confirmed at 2×). In `high/mobile/R08` the arrow sits inside the tie-dye crew.
- The ford reads as paving (`high/desktop/R19`).

"Every tub … in every frame" isn't met. Critic B's 7 rests on `high/mobile/R04`, and the prosecutor's 6.0 overweights two frames. **6.5**, confidence 0.6.

### Mobile: 7.0
- **Controls.** The thumb controls never cover the tub. In portrait they sit below y≈1420 of 1688, with the tub at y≈880–1100 (`high/mobile/R07`, `high/mobile/R08`). In landscape the tub is centred and clear (`high/landscape/R04`, `high/landscape/R17`).
- **Banner.** The landscape banner now sits below the item tile.
- **Performance.** The phone proxy holds 30 fps or more (SwiftShader minimum 50).
- **Shortfalls:**
  - The landscape team select is cramped (`high/landscape/R02`).
  - The portrait team select has a 4 CSS px margin (`high/mobile/R02`).
  - The landscape HUD column takes about 20% of the width.

The anchor is met with polish missing. **7.0**, confidence 0.6.

### Authenticity: 6.5
The bathhouses and the race read:
- The Arlington closes the vista (`high/desktop/R06`).
- The Fordyce reads well (`high/desktop/R05`), and the Quapaw dome shows in `high/desktop/R14` (x≈380–430, y≈140–200).
- The real race shows: the JUDGE booth with striped judges (`high/desktop/R16`), plus the duck, the flags and the gauge's water line.

Short of the anchor:
- One of the 7 anchor's four items fails: the mountains are the same terraced decal wall everywhere, not Ouachita ridgelines (`high/desktop/R06`, `high/desktop/R12`).
- Bridge Street (`high/desktop/R13`) and the plaza (`high/desktop/R17`) are generic.

That clears the ≥6 gate but sits short of 7. **6.5**, confidence 0.6.

## IP
**Clean. No characters gap.** All four reviewers report clean, and I checked:
- **Figures.** Heads are rounded boxes, torsos are straight-sided rectangles, and hands are fist blocks with a thumb bump (`crops/high/R02-preview-captain`, `crops/high/R15-player`). The hip piece and split legs exist, but with box heads and fist hands the silhouette is not a minifigure.
- **Studs.** Helmet studs are plain at 4×.
- **JUDGE sign.** It uses a generic white-plate brick font (`high/desktop/R16`, 3×).
- **Branding.** No LEGO name or logo appears in any frame or menu. The title carries a no-affiliation note (`high/desktop/R01`).

## Ranked gaps (top 12)
Duplicates are merged and wrong causes fixed. The ranking is by expected gain × weight ÷ effort, with weight 1.5 for categories below their gate. **Big lever: `G-ridgeline-horizon`.** The horizon is the main thing holding scenery back, it shows in nearly every frame, and it also costs authenticity, materials and lighting.

| # | Id | Category | Effort | Gain | Merges |
|---|---|---|---|---|---|
| 1 | G-impact-camera-kick | animation | S | +0.5 | A's kick gap, the advocate's "check the trigger first" |
| 2 | G-steam-plume | animation | S | +0.5 | G-slide-steam-rise (A), the steam part of G-action-effects (B), G-boost-steam-read (prosecutor) |
| 3 | G-horizon-haze-clamp | lighting | S | +0.5 | G-horizon-ghost-tiers (A), G-horizon-haze-over-sky (prosecutor), the haze part of G-light-depth (B) |
| 4 | G-player-marker-salience | readability | S | +0.4 | prosecutor |
| 5 | G-wall-base-occlusion | lighting | S | +0.3 | the occlusion part of G-light-depth (B) |
| 6 | G-landscape-team-cards | mobile | S | +0.3 | G-landscape-team-cards (A), G-phone-density (B), G-portrait-select-margin (prosecutor) |
| 7 | G-ford-water | materials | M | +0.3 | A, advocate |
| 8 | G-sunset-sun-and-rim | lighting | M | +0.3 | A (gain cut: the horizon glow exists) |
| 9 | G-pack-separation | readability | M | +0.3 | A (tubs already carry flags) |
| 10 | G-event-banner-placement | ui | S | +0.2 | prosecutor |
| 11 | G-ridgeline-horizon (**big lever**) | scenery | L | +0.5 | G-environment (B), G-mountain-ridgelines (prosecutor) |
| 12 | G-facade-relief | materials | L | +0.4 | G-facade-relief (A), G-facades (B), G-facade-specular-sparkle (prosecutor) |

**Dropped or below the cut:**
- **Wrong premise:**
  - G-figure-part-seams: the hip piece, split legs, boots and helmet studs already exist.
  - G-hud-label-size: the caps measure 8–10 px, not 5 px.
- **Low gain:**
  - G-crowd-clones: awnings and outfits already vary.
  - G-tub-water-slosh: rim spill exists; only the surface tilt is missing.
- **Valid but below the cut:**
  - G-tub-shell-build (characters, at the gate): confirmed.
  - G-slide-prop-clip: confirmed in R14 frame 8.
  - G-closeup-road-halo: confirmed at 114.8 against 87–92, but close-up only.
  - G-item-orb-stud-clash and G-hud-tray-stud-row: confirmed, cosmetic.

### Gap details
1. **G-impact-camera-kick** (animation, WS3, S, severity 4, +0.5)
   - **Defect.** Neither build shows the logged ~4° dip (`ab/strip-R15`).
   - **Fix.** First confirm that the fumble/impact path calls the dip. Then apply the pitch dip at full strength within 1–2 sim ticks of contact, easing out over about 0.4 s, and add a 3–5° FOV punch. Keep it stateless.
   - **Test.** In `strips/high/R15`, the far band (x 150–330, y 30–110 of each 480×300 frame) shifts at least 10 px vertically between frame 1 and frame 2 or 3. Now: at most 1 px, and the sky edge at most 3 px.
2. **G-steam-plume** (animation, WS3, S, severity 3, +0.5)
   - **Fix.**
     - Emit slide steam at the rear wheel contact points, with visible upward speed (the logged ≥1.6 m/s), 2× growth over life and alpha fading to 0.
     - Render boost steam as white beads with a warm tint in a trailing plume, not a clump of opaque orange spheres at the stern.
   - **Test.**
     - In R14 frames 5–8, the puffs sit above the tub-rim line and link back to the wheels.
     - In R17, boost particles span at least 3× the stern width and fade at the tail.
3. **G-horizon-haze-clamp** (lighting, WS1, S, severity 3, +0.5)
   - **Defect.** The far terrace faces render brighter than the sky.
   - **Fix.** Fog the hill ring toward the sky's horizon colour, and clamp it so no ring pixel exceeds the sky luminance in its row. Remove the lit top and lip highlight from the farthest terrace.
   - **Test.**
     - In `high/desktop/R04` x 540–860, y 120–200, no pixel is more than 8 levels above the row's sky. Now 2,795 px are, with a peak of (225, 252, 255) at (771, 193).
     - There are no pale blocks at `high/desktop/R06` x 370–440, y 230–310 or x 910–1040, y 240–310, nor at `high/desktop/R03` x 540–760, y 130–220.
4. **G-player-marker-salience** (readability, WS6, S, severity 3, +0.4)
   - **Fix.**
     - Give the player its own ring style: thicker, with a dark outline, in one fixed colour whatever the team.
     - Make rival rings thinner and desaturated.
     - Raise the arrow so it never overlaps another crew, and give it a short drop line to the player's tub.
   - **Test.**
     - In `high/desktop/R11`, the player's ring is the most saturated ring on screen.
     - In `high/mobile/R08` and `high/mobile/R07`, the arrow overlaps no rival crew.
5. **G-wall-base-occlusion** (lighting, WS1, S, severity 2, +0.3)
   - **Fix.** Add a soft dark gradient decal about 0.5 m tall, darkening about 35% at the contact line, along every building, wall and booth base where it meets the ground. Or bake vertex AO into the landmark meshes.
   - **Test.** At x=1000 in `high/desktop/R05`, the last 30 px of wall above the lawn darken by at least 25%. Now: about 15% over about 10 px.
6. **G-landscape-team-cards** (mobile, WS6, S, severity 2, +0.3)
   - **Fix.**
     - In landscape, never hyphen-break team names: shrink to fit, with at most 2 lines.
     - Put the division and lock state on one icon row.
     - Narrow the preview.
     - In portrait, apply the logged 16 px bottom margin to the outer frame, including its shadow plate.
   - **Test.**
     - Every card in `high/landscape/R02` has at most 2 text lines, and "The Out-of-Towners" has no hyphen break.
     - `high/mobile/R02` has at least 32 device px below the shadow plate. Now: 8.
7. **G-ford-water** (materials, WS1, M, severity 3, +0.3)
   - **Fix.** Make the ford a translucent water plate (about 60% opaque) with scrolling specular ripples and a splash wake under crossing tubs. Keep the new edge lines.
   - **Test.** In `high/desktop/R19`, the tile grid under the water is visibly softened, a highlight band shows, and a splash appears under the crossing rival.
8. **G-sunset-sun-and-rim** (lighting, WS1, M, severity 2, +0.3)
   - **Fix.** Add a sun disc and a stateless glow in the sky dome along the key direction, and a warm rim term on foliage and figures at sunset and dusk.
   - **Test.** In `high/desktop/R11` a sun or sun glow is in frame, and crowns facing the sun show a lit edge at least 1.5× the luminance of the crown interior.
9. **G-pack-separation** (readability, WS2, M, severity 2, +0.3)
   - **Fix.**
     - Scale the existing tub flags with distance so each stays at least 12 px tall at 1280×800.
     - Give rival rings a dark outline.
     - In packs, raise the chase camera about 0.5 m.
   - **Test.** Every rival tub can be counted, by flag or ring, in `high/desktop/R07` and `high/desktop/R08`.
10. **G-event-banner-placement** (ui, WS6, S, severity 2, +0.2)
    - **Fix.** After 1 s, collapse event banners to a slim ribbon (at most 60 px tall on desktop) docked under the item tile.
    - **Test.** From frame 3 of `strips/high/R16`, and in R19 and `high/landscape/R17`, the banner doesn't overlap the road between the horizon and the player's tub.
11. **G-ridgeline-horizon** (scenery, WS4, L, severity 4, +0.5, **big lever**)
    - **Fix.**
      - Replace the near-vertical terraced decal wall with long, rounded Ouachita-like ridgelines built from stepped sloped plates.
      - Add foothill steps grading down to the playable ground.
      - Use modelled conifer clusters only on the near ridge.
      - Give each course its own ridge silhouette.
    - **Test.**
      - In `high/desktop/R06`, the lawn rises to the hills through at least two foothill steps, with no face taller than 60 px. Now a wall stands at x 0–330, y 240–520.
      - Unlabelled R06, R09, R12 and R17 horizons can be told apart.
    - **Also helps** authenticity, materials and lighting.
12. **G-facade-relief** (materials, WS4, L, severity 3, +0.4)
    - **Fix.**
      - On the Fordyce, the Arlington and the Row bathhouses, replace the blurry painted window and ornament panels with openings recessed one plate behind the wall, modelled tile surrounds, and printed ornament tiles at the brick texture's resolution.
      - Keep the existing sills, marquee and plinth.
      - Add specular anti-aliasing on the bevel normals.
    - **Test.**
      - Recessed openings are visible from the R05 and R06 cameras, and no painted window panel remains on those facades.
      - The isolated sparkles at (880, 366) and (986, 370) in R05 are gone.

```json
{
  "loop": 8,
  "role": "judge",
  "tier": "high",
  "verdict": "continue",
  "scores": {
    "characters": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "crops/high/R02-preview-captain", "note": "printed expressive faces and uniforms; separate hip block, split legs, boots; two plain studs per helmet at 4x (Critic A's no-seams/no-studs claims are wrong); duck outline slightly faceted" },
      { "shot": "crops/high/R02-preview-rear", "note": "hip piece and split legs with seams; clean head backs" },
      { "shot": "crops/high/R15-player", "note": "close-up holds up; tub is a smooth cast shell" },
      { "shot": "crops/high/R03-kart_1", "note": "same seamless tub shell for every team, studs only on the chassis plate" },
      { "shot": "crops/high/R04-kart_3", "note": "tie-dye team on a purple tub" },
      { "shot": "high/desktop/R07", "note": "two purple tubs side by side (Velvet Mob, tie-dye) at 2.5x; crews still distinct; 11 distinct crews across the race frames" }
    ] },
    "materials": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "crops/high/R02-preview-captain", "note": "ABS highlights follow bevels; clear water" },
      { "shot": "high/desktop/R05", "note": "studded, bevelled near crowns at 3x (x600-880,y580-780); Fordyce window/ornament panels are blurry painted textures on crisp brick at 4x (x840-1090,y330-480)" },
      { "shot": "high/desktop/R09", "note": "plate-stack Goat Rock with studded tops; studded baseplates" },
      { "shot": "high/desktop/R04", "note": "hill ring is flat boxes printed with tree triangles" },
      { "shot": "high/desktop/R19", "note": "ford is opaque blue paving" },
      { "shot": "high/desktop/R17", "note": "HOT STEAM boost is a clump of opaque orange spheres" }
    ] },
    "scenery": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R04", "note": "far tiers brighter than sky: 2795 px >8 levels above sky in x540-860,y120-200; peak (225,252,255) at (771,193); same in ab pair B side" },
      { "shot": "high/desktop/R06", "note": "hill rises as a vertical decal wall off the Arlington lawn (x0-330,y240-520); ghost tiers at x370-440,y230-310 and x910-1040,y240-310 (not the belfry)" },
      { "shot": "high/desktop/R12", "note": "four crown types and rock clusters: varied planting" },
      { "shot": "high/desktop/R17", "note": "empty radial-tile plaza" },
      { "shot": "high/desktop/R03", "note": "ghost tiers behind READY at x540-760,y130-220" }
    ] },
    "lighting": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R04", "note": "haze brighter than the sky (fails 'haze matched to the sky')" },
      { "shot": "high/desktop/R07", "note": "deliberate dusk palette with lamp pools" },
      { "shot": "high/desktop/R11", "note": "warm sky gradient (188,146,127)->(230,181,128) at x=700; no sun disc or rim; dark crown slabs" },
      { "shot": "high/desktop/R05", "note": "soft tree shadow on wall; wall base darkens only ~165->~140 in last ~10 px" },
      { "shot": "crops/high/R04-player", "note": "bright streak beside legs 114.8 vs 87-92 open road" },
      { "shot": "high/desktop/R08", "note": "tree shadows on road are shapeless blotches" }
    ] },
    "animation": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "strips/high/R15", "note": "far band shifts <=1 px across 8 frames (cross-correlation), sky edge <=3 px: no camera kick; beads burst over the rim frames 3-7, gauge 37->36" },
      { "shot": "strips/high/R14", "note": "steam beads stay at ring level behind the tub, never rise or grow (2x zoom); frame 8 lamp post inside the ring, drawn over a crewman" },
      { "shot": "strips/high/R16", "note": "crew circles the tub with rigid swinging limbs, convincing" },
      { "shot": "high/desktop/R17", "note": "boost reads as an orange clump" }
    ] },
    "ui": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R04", "note": "clear hierarchy, stud rows match menus; item orb covers third stud, tray icons sit in the stud row (3-4x zoom)" },
      { "shot": "high/desktop/R16", "note": "event banner 340x125 px (4% of frame) over the far road for the whole event" },
      { "shot": "high/desktop/R01", "note": "brick-button title menu consistent with HUD" },
      { "shot": "high/desktop/R02", "note": "consistent team-select panel" },
      { "shot": "high/landscape/R17", "note": "banner below the item tile" }
    ] },
    "typography": { "score": 7.0, "confidence": 0.55, "evidence": [
      { "shot": "high/desktop/R04", "note": "TICKETS cap height 8 px (rows 55-62, not 5); tray labels ~10 px; LAP numerals ~21 px" },
      { "shot": "high/mobile/R18", "note": "aligned value-over-chip cells, unclipped" },
      { "shot": "high/landscape/R02", "note": "'The Out- / of- / Towners' hyphen-broken; locked cards four lines, unclipped" },
      { "shot": "high/desktop/R02", "note": "card names ~10 px cap, status ~8 px: small but legible" }
    ] },
    "readability": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R11", "note": "player ring white while tie-dye rival ring is saturated yellow; white arrow points into the pink rival's tub ahead (2x)" },
      { "shot": "high/mobile/R08", "note": "arrow inside the tie-dye crew silhouette" },
      { "shot": "high/desktop/R07", "note": "dense pack hides tub bodies and rings" },
      { "shot": "high/desktop/R04", "note": "at 3x the pack separates by hat and tub" },
      { "shot": "high/desktop/R16", "note": "JUDGE booth reads at once" },
      { "shot": "high/desktop/R19", "note": "ford reads as paving" }
    ] },
    "mobile": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "high/mobile/R07", "note": "controls below y~1420 of 1688; tub at y~880-1100, never covered" },
      { "shot": "high/mobile/R08", "note": "deliberate portrait framing" },
      { "shot": "high/landscape/R17", "note": "tub centred and clear; banner below the item tile" },
      { "shot": "high/landscape/R04", "note": "tub centred; left HUD column ~20% of width" },
      { "shot": "high/landscape/R02", "note": "cramped cards with hyphen breaks" },
      { "shot": "high/mobile/R02", "note": "shadow plate ends row 1679 of 1688: 4 CSS px margin, not the logged 16" }
    ] },
    "authenticity": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R06", "note": "Arlington twin towers close the vista; mountains are a terraced decal wall, not Ouachita ridgelines" },
      { "shot": "high/desktop/R05", "note": "Fordyce recognisable" },
      { "shot": "high/desktop/R14", "note": "Quapaw tiled dome at x~380-430,y~140-200" },
      { "shot": "high/desktop/R16", "note": "JUDGE booth with striped judges, flag, duck, gauge water line" },
      { "shot": "high/desktop/R13", "note": "Bridge Street generic" },
      { "shot": "high/desktop/R17", "note": "plaza generic" }
    ] }
  },
  "ip": { "clean": true, "notes": "Checked: rounded-box heads, straight rectangular torsos, fist-block hands with thumb bump (crops/high/R02-preview-captain, crops/high/R15-player); plain helmet studs at 4x; JUDGE sign in a generic white-plate font (high/desktop/R16, 3x); no LEGO name or logo in any frame or menu. No characters gap." },
  "gaps": [
    { "id": "G-impact-camera-kick", "category": "animation", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R15", "ab/strip-R15"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Neither build shows the logged ~4 deg dip: first confirm the fumble/impact path calls it, then apply the pitch dip at full strength within 1-2 sim ticks of contact, easing out over ~0.4 s, plus a 3-5 deg FOV punch (stateless). Test: in strips/high/R15 the far band (x150-330, y30-110 of each 480x300 frame) shifts >=10 px vertically between frame 1 and frame 2 or 3 (now <=1 px; sky edge <=3 px)." },
    { "id": "G-steam-plume", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R14", "high/desktop/R17", "high/mobile/R17"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Merges G-slide-steam-rise, G-action-effects (steam) and G-boost-steam-read. Emit slide steam at the rear wheel contact points with visible upward speed (the logged >=1.6 m/s), 2x growth over life and alpha fading to 0; render boost steam as white beads with a warm tint in a trailing plume, not a clump of opaque orange spheres at the stern. Test: R14 frames 5-8 puffs sit above the tub-rim line and link back to the wheels; R17 boost particles span >=3x the stern width and fade at the tail." },
    { "id": "G-horizon-haze-clamp", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R04", "high/desktop/R06", "high/desktop/R03", "ab/high-desktop-R04"], "benchmark": "worlds/worlds-4.jpg", "fix": "Merges G-horizon-ghost-tiers and G-horizon-haze-over-sky. Fog the hill ring toward the sky's horizon colour and clamp so no ring pixel exceeds the sky luminance in its row; remove the lit top/lip highlight on the farthest terrace. Test: in high/desktop/R04 x540-860, y120-200 no pixel is more than 8 levels above the row's sky (now 2795 px; peak (225,252,255) at (771,193)); no pale blocks at R06 x370-440,y230-310 and x910-1040,y240-310, or R03 x540-760,y130-220." },
    { "id": "G-player-marker-salience", "category": "readability", "expectedGain": 0.4, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R11", "high/mobile/R08", "high/mobile/R07"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Player-only ring style (thicker, dark outline, one fixed colour regardless of team) with thinner desaturated rival rings; raise the arrow so it never overlaps another crew and add a short drop line to the player's tub. Test: in R11 the player's ring is the most saturated ring on screen (now a rival's yellow ring outshines the player's white ring); in mobile R08 and R07 the arrow overlaps no rival crew." },
    { "id": "G-wall-base-occlusion", "category": "lighting", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R05", "high/desktop/R13"], "benchmark": "builders-journey/bj-3.jpg", "fix": "Add a soft dark gradient decal (~0.5 m tall, ~35% darkening at the contact line) along every building, wall and booth base where it meets the ground, or bake vertex AO into landmark meshes. Test: at x=1000 in high/desktop/R05 the last 30 px of wall above the lawn darken >=25% (now ~15% over ~10 px)." },
    { "id": "G-landscape-team-cards", "category": "mobile", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R02", "high/mobile/R02"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Merges G-phone-density and G-portrait-select-margin. In landscape never hyphen-break team names (shrink to fit, max 2 lines), put division and lock state on one icon row, narrow the preview; in portrait apply the logged 16 px bottom margin to the outer frame including its shadow plate. Test: every card in high/landscape/R02 is <=2 text lines and 'The Out-of-Towners' has no hyphen break; high/mobile/R02 has >=32 device px below the shadow plate (now 8)." },
    { "id": "G-ford-water", "category": "materials", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R19"], "benchmark": "builders-journey/bj-2.jpg", "fix": "Make the ford a translucent water plate (~60% opaque) with scrolling specular ripples and a splash wake under crossing tubs; keep the new edge lines. Test: in R19 the tile grid under the water is visibly softened, a highlight band shows, and a splash appears under the crossing rival." },
    { "id": "G-sunset-sun-and-rim", "category": "lighting", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R11"], "benchmark": "worlds/worlds-4.jpg", "fix": "Horizon glow already exists; add a sun disc with a stateless glow in the sky dome along the key direction and a warm rim term on foliage and figures at sunset and dusk. Test: sun or sun glow in frame in R11, and crowns facing it show a lit edge >=1.5x the crown interior luminance." },
    { "id": "G-pack-separation", "category": "readability", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["high/desktop/R07", "high/desktop/R08", "high/mobile/R07"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Tubs already fly flags: scale them with distance so each stays >=12 px tall at 1280x800, give rival rings a dark outline, and raise the chase camera ~0.5 m in packs. Test: every rival tub countable (flag or ring) in R07 and R08." },
    { "id": "G-event-banner-placement", "category": "ui", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R16", "strips/high/R16", "high/desktop/R19", "high/landscape/R17"], "benchmark": "2k-drive/drive-3.jpg", "fix": "After 1 s collapse event banners to a slim ribbon (<=60 px tall on desktop) docked under the item tile. Test: from frame 3 of strips/high/R16, and in R19 and high/landscape/R17, the banner does not overlap the road between the horizon and the player's tub (now 340x125 px centred at x470-810, y178-300 in R16)." },
    { "id": "G-ridgeline-horizon", "category": "scenery", "expectedGain": 0.5, "severity": 4, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R06", "high/desktop/R09", "high/desktop/R12", "high/desktop/R17", "high/desktop/R04"], "benchmark": "2k-drive/drive-5.jpg", "fix": "BIG LEVER (scenery; also authenticity, materials, lighting). Merges G-environment and G-mountain-ridgelines. Replace the near-vertical terraced decal wall with long rounded Ouachita-like ridgelines built from stepped sloped plates, foothill steps grading down to the playable ground, modelled conifer clusters only on the near ridge, and a different ridge silhouette per course. Test: in high/desktop/R06 the lawn rises to the hills through at least two foothill steps with no face taller than 60 px (now a wall at x0-330, y240-520); unlabelled R06, R09, R12 and R17 horizons can be told apart." },
    { "id": "G-facade-relief", "category": "materials", "expectedGain": 0.4, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06", "crops/high/R04-kart_3"], "benchmark": "worlds/worlds-1.jpg", "fix": "Merges G-facade-relief, G-facades and G-facade-specular-sparkle. On the Fordyce, the Arlington and the Row bathhouses replace the blurry painted window/ornament panels with openings recessed one plate behind the wall, modelled tile surrounds and printed ornament tiles at the brick texture's resolution; keep the existing sills, marquee and plinth; add specular anti-aliasing on bevel normals. Test: recessed openings visible from the R05 and R06 cameras, no painted window panel left on those facades, and the isolated sparkles at (880,366) and (986,370) in R05 gone." }
  ]
}
```
