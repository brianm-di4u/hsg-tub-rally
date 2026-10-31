# Judge ruling, loop 7: Spa City Tub Rally (high tier)

## Summary
**Verdict: continue. Judged total 67.5/100, before the tally's A/B rule.** Five categories are below the gate of 7: materials (6.5), scenery (6.5), lighting (6.5), animation (6.5) and readability (6.5). Every measured gate passes:
- **perf:** 52 of 52 checks pass. The lowest proxy is SwiftShader, low tier, phone, at 51 fps.
- **fidelity:** null.
- **ip:** passes. I confirm it below.

For trend only, the last judged total in `HISTORY.md` was 66.5.

**Method.** I opened every high-desktop frame, the phone frames I cite, the close-ups and the three high strips. I zoomed regions 2–3× with PIL and measured Rec.709 luma (Y), mean RGB and mean absolute luma gradient (h/v, 0–255 scale) on the full-size PNGs. Strip frames are 480×300 at 0.375 scale, with 4 px separators.

**The four reviews.**

| Review | Stated total | JSON sum | Check |
|---|---|---|---|
| Critic A (Claude) | none stated | 67.5 | each prose category score matches its JSON |
| Critic B (Codex) | none stated | 68.0 | each prose category score matches its JSON |
| Prosecutor | 66.0 (critic mean 67.75) | 66.0 | the mean is (67.5 + 68.0) / 2 |
| Advocate | +2.25 over the 67.75 mean | 70.0 | 67.75 + 4 × 0.5 + 0.25 = 70.0 |

Neither critic's prose states a total, so there is no stated figure to reconcile. All ten per-category scores in each critique match its JSON, and the JSON sums are as shown. The prosecutor's and the advocate's proposals stay within ±1 of the critic means.

**No mandatory disputes.** The critics are at most 0.5 apart (UI). The prosecutor and advocate are exactly 1.0 apart on materials, animation and UI, and closer elsewhere, so none is more than 1.0 apart. I still checked every factual dispute against the captures. The rulings are under each category.

**A/B pairs: valid, no void.** I compared both panels of all 83 pairs, downscaled, against this loop's captures at the named tier and at the other tier:
- In every pair, one panel reproduces this loop's same-tier capture, at a mean absolute difference of 0.42–2.62 levels. That is resampling noise.
- The other panel is also nearer the named tier than the other tier in every pair. For example, the crop pairs are 2.8–16.7 levels from `crops/high` against 13.7–27.5 from `crops/low`.

So no pair is the wrong tier or the wrong build. The loop 3 rig bug has not recurred. No `abWeight` is set.

## Categories

**Characters: 7.0** (critics 7.0 / 7.0, prosecutor 7.0, advocate 7.5)
- The 7 anchor is met, on these close-ups:
  - printed expressive faces: shouting captain, grinning crew (`crops/high/R02-preview`, `crops/high/R02-preview-captain`);
  - printed team uniforms: hydrant badge, Y-trim and tie-dye (`crops/high/R03-kart_5`, `crops/high/R04-kart_3`);
  - studded black chassis plates, claw feet and hubbed wheels on the tubs;
  - six or more teams distinct at chase distance (`high/desktop/R03`, `high/desktop/R12`).
- **Hip piece: the advocate is right, and Claude is wrong.** At 2× in `crops/high/R03-player-rear` and `crops/high/R15-player`, a separate bevelled hip block with seam lines sits over split legs and separate feet. Claude's other point holds: the arms are single blocks with no shoulder part.
- **Head hatching: the prosecutor is right.** At 3× in `crops/high/R03-player-rear` (x 560–880, y 180–420), diagonal hatching crosses the back of the centre pusher's head. In `ab/crop-R03-player-rear`, one panel is hatched and the other is smooth. I charge it under lighting.
- **Enamel streaks: the advocate is right.** The streaks are in the tub's enamel shell, not the water. The inner-wall gradient in the two panels of `ab/crop-R02-preview-captain` is 3.16/1.57 against 3.14/1.60, so the streaks are identical in both builds.
- **Hidden captain face: the prosecutor overstates it.** In `crops/high/R15-player` the captain is turned toward the flag, which is a pose. The left pusher's printed smile still carries the shot.

It is not 7.5. Close-ups don't hold at 2×: the head hatching and enamel streaks show, faces are dot eyes and a mouth (far from `drive-4`), and spectators are a lower tier of figure. **7.0.**

**Materials: 6.5** (6.5 / 6.5, prosecutor 6.0, advocate 7.0)
- **Lawn studs: both are partly right.**
  - Near lawns are studded: in `high/desktop/R05` (x 900–1050, y 640–700) the gradient is 3.43 h / 6.04 v, and on the `high/desktop/R12` roadside lawn 3.26 / 6.20. Both are above the studded `high/desktop/R08` bank at 1.62 / 3.22. The advocate is right that "large lawns lose their studs" is too broad.
  - Mid-distance lawns go flat: 0.19 / 0.83 on the R05 lawn behind the Fordyce (x 1080–1270, y 560–680), and 0.64 / 1.37 on the R06 foreground lawn (x 0–120, y 600–780).
  - I can't reproduce Claude's 0.27, but his defect stands for the landmark views.
- **Water streaks: Codex's cause is wrong** (see characters). The tub water is clear and shows the captain's torso through it (`crops/high/R02-preview-captain`).
- **Row glazing: the prosecutor's new charge is confirmed.** At 2–2.5× in `crops/high/R04-kart_3` (x 780–1280, y 60–320), `high/desktop/R04` (x 0–260, y 80–440) and `high/desktop/R16` (x 0–470, y 80–480):
  - three-segment chamfered panes stand as flat slabs half a bay off the facade texture's own painted mullioned windows, which show beside them;
  - in R16 the painted surrounds are smeared orange and blue bands.

  This is the window half of last loop's facade work, still unresolved.
- **Judge stand: confirmed as a blank box.** Its face (x 255–345, y 350–460) is RGB (209,212,204), with σY 7.8.
- **Ford: confirmed, and a regression.**
  - In `high/desktop/R19` the ford reads as paving. It is RGB (145,140,138) at x 460–560, y 340–380 (B−R −7) and (127,137,147) at x 560–660, y 330–370 (B−R +20), and the bed's tile pattern shows through.
  - In `ab/high-desktop-R19`, the panel that matches this loop is greyer at the same spot (B−R −9) than the other (+14).
  - Codex's "blue rectangular surface" is wrong.
- Opaque glossy ball effects (`high/desktop/R17`, `high/desktop/R19`) and Goat Rock's running-bond masonry skin (`high/desktop/R09`) are confirmed.

The figure and tub plastic, the near studs and the new brick relief (`high/desktop/R05`) are at `worlds-1`'s 7. The environment surfaces are not, so this is not 7.0. It is not 6.0 either, because the 7 anchor's near items are genuinely met. **6.5.**

**Scenery: 6.5** (all 6.5)
- **Horizon: improved, but still wallpaper.** The rebuilt hills beat the other panel's flat pale walls (`ab/high-desktop-R06`).
  - At 2× the left third of `high/desktop/R06` (x 0–440, y 230–500) is a near-vertical face of identical stepped triangles.
  - Row-wise autocorrelation over x 0–400, y 330–470 peaks at lag 19–23 px (r 0.22–0.44), a regular grid. `high/desktop/R05` (right half) is the same.
- **R08 corner: Codex is wrong.** In `high/desktop/R08` the corner (x 700–1280) and the pack are clear. The canopy sits over the wall and sky.
- **Tree assemblies: Codex is wrong.** Broadleaf, autumn and conifer assemblies already exist (`high/desktop/R12`, `high/desktop/R09`).
- **Prosecutor's points: confirmed.**
  - merged conifer tiers (`high/desktop/R09`, x 820–1210);
  - the R13 lamp post across the left edge;
  - the blank judge stand;
  - the ribbed, non-brick ford bank (`high/desktop/R19`).

**6.5.**

**Lighting: 6.5** (all 6.5)
- **Dusk pools: Claude's cause is wrong in fact, but the defect is real.** In `high/desktop/R07` the left lamp pool crosses the edge line into the left lane at Y 112.7 (x 60–250, y 420–470), as the advocate measured. But the centre lane under the pack stays dark at Y 46.4–48.2 (x 380–500 and x 760–900, y 560–620). The player's black-crew torsos read 67–80 and its purple tub 39.0.
- **Sunset: no rim light.** In `high/desktop/R11` the crew torsos read 63.7–66.9 against road 47.4, about 1.4:1.
- **Head hatching: a new regression** on curved figure parts (characters above).
- **Credit:**
  - contact shadows under chassis (`crops/high/R02-preview`, `high/desktop/R13`);
  - a clean key light (`high/desktop/R10`);
  - three deliberate palettes (R10 day, R07 dusk, R11 sunset).

AO in crevices is still faint. **6.5.**

**Animation: 6.5** (6.5 / 6.5, prosecutor 6.0, advocate 7.0). Judged from the strips:
- **Water slosh: the advocate is right; Claude and Codex understate it.** In `strips/high/R14` the gauge reads 41 GAL in frames 1–5, 40 in frame 6 and 39 in frames 7–8, and blue drops spill from the tub in frames 7–8. In `strips/high/R15` a ring of drops bursts out in frames 2–7.
- **Steam: the prosecutor is right in effect.** In `strips/high/R14` frames 3–8 the white clumps stay parked at frame-local ≈ (172–175, 240–257) behind the rear wheels. They show no visible rise, trail or growth, so the promised "swell as they rise" doesn't read.
- **Lamp post: the prosecutor is right.** In `strips/high/R14` frame 8 (3× zoom), the tub is over the kerb and a lamp post stands inside the crew footprint at the ring's right edge, among the pushers. The strip ends there, so a later hit reaction can't be seen.
- **Camera kick: unverified, so I give no credit.**
  - In `strips/high/R15`, frame 1 (0:04.03) already shows the crew off the tub, so the impact comes before the strip starts. The advocate is right about why.
  - I reproduce Claude's measurement: the best-fit vertical shift between consecutive frames is 0 or −1 px.
  - The two panels of `ab/strip-R15` have the same inter-frame residuals (10.5/9.4/6.5/6.1/5.0/5.5/5.3 against 10.2/9.1/6.5/5.6/4.9/5.3/5.3), so any new kick isn't visible in the captured frames.
- **Credit:**
  - convincing rigid-limb circling (`strips/high/R15`, `strips/high/R16`);
  - the lean into the slide;
  - the charge arc, blue in frames 3–5 and white in frames 6–8.

The 7 anchor's "camera kick" isn't shown, the effects are opaque balls, and one slide ends in a prop. **6.5.**

**UI: 7.0** (7.0 / 7.5, prosecutor 6.5, advocate 7.5)
- **Context-aware HUD: the advocate is right, and Claude is wrong.**
  - SEMIFINAL replaces LAP, and a bar fills (`high/desktop/R16`, `strips/high/R16`).
  - 8 LEFT and an arena radar appear (`high/desktop/R17`).
  - The used Bath item is greyed in the legend (`high/desktop/R15`, 3× zoom).
- **Landscape banner overlap: the prosecutor's size is right, and Claude understates it.** In `high/landscape/R17` I sampled x 720, 850 and 975:
  - the banner outline is at y 141–144;
  - the tile body shows through the semi-transparent banner from y 153 to 174, at (18–20, 29–34, 43–52) against banner-only (42,59,76) at x 1010;
  - the tile edge is at y ≈ 177.

  That is an overlap of about 35 device px (≈ 17 CSS px). The other panel of `ab/high-landscape-R17` has clear space, so this is a regression from the taller tile.
- **Also confirmed:**
  - "1 TICKETS" (`high/desktop/R17`);
  - portrait results drop the team swatches, stack gal over CLEAN and wrap the player's name (`high/mobile/R18` against `high/desktop/R18`);
  - plain slate HUD tiles against studded menus (`high/desktop/R03` against `high/desktop/R01`).
- The judge panel over the road in R16 shows during a stop. It is not an overlap with HUD or tub.

Codex's 7.5 cites only menus. The prosecutor's 6.5 over-weights one transient overlap in one of three viewports. **7.0.**

**Typography: 7.0** (all 7.0)
- The display face and UI face form a clear scale (`high/desktop/R01`, `high/desktop/R18`), and the numerals read at 390 px (`high/mobile/R07`).
- **TICKETS label: 8 px cap height on desktop** (rows 55–62 in `high/desktop/R17`), so the advocate's figure is right, not Claude's 7. It is 16 px on the phone (`high/mobile/R17`).
- **Orphaned bullets: confirmed.** "Traditional / · locked" and "Stock · / locked" in `high/mobile/R02`.
- "Steer" straddles the pad rim in landscape (`high/landscape/R04`, `high/landscape/R17`).
- **Small phone text: Codex overstates it.** The supporting copy in `high/mobile/R02` is legible secondary size.

**7.0.**

**Readability: 6.5** (6.5 / 6.5, prosecutor 6.5, advocate 7.0)
- **Dusk pack: Claude's "one dark mass" is wrong.** In `high/desktop/R07` the pink pusher reads Y 116.8 and the tie-dye pusher 107.2, against the lane at 46–48 (≈ 2.3:1), and `high/mobile/R07` separates the same way. The player's own black crew and purple tub are the darkest objects, but the cream ring and pointer flag them.
- **R04 pack: the advocate is right.** At 2.5× in `high/desktop/R04` the cowboys' barrel tub, the pink tub and the white tub all show. The prosecutor's "two of seven" undercounts. The prosecutor is partly right on the marker: it sits over the player's captain but visually lands on the white tub ahead.
- **Still failing the 7 anchor:**
  - in the `high/desktop/R08` hairpin queue (2× zoom) the rival tubs are hidden behind their crews, which only colour separates;
  - `high/desktop/R19` has no route edge across the plaza and ford (the prosecutor is right).

Those two clauses ("every tub… in every frame", "the road edge… obvious") still fail. **6.5.**

**Mobile: 7.0** (all 7.0)
- The controls never cover the tub (`high/mobile/R04`, `high/mobile/R07`, `high/mobile/R17`, `high/landscape/R04`, `high/landscape/R17`).
- The SwiftShader phone floor holds 51 fps.
- **Team panel: confirmed flush.** In `high/mobile/R02` it is flush to the bottom edge, with its base border at y 1682–1686 of 1688.
- The landscape banner overlap is charged under UI.

**7.0.**

**Authenticity: 7.0** (all 7.0)
- **What reads:**
  - the Arlington closes the vista (`high/desktop/R06`);
  - the Fordyce and the Row read (`high/desktop/R05`, `high/desktop/R14`);
  - the forested rings now read as the Ouachitas;
  - the duck, flag, gauge, judges and Rules of the Row show (`high/desktop/R16`).
- **What holds it at 7:**
  - the ford regressed to grey paving (`high/desktop/R19`);
  - Bridge Street is a generic corner (`high/desktop/R13`);
  - the Goat Rock view has no overlook and a masonry outcrop (`high/desktop/R09`).

**7.0.**

## IP check
Clean. All four reviewers reported clean, and I confirm it:
- **Heads:** wide rounded blocks on a short neck, not cylinders (`crops/high/R02-preview`, front view).
- **Torsos:** straight-sided boxes (`crops/high/R03-player-rear`).
- **Hands:** rounded fists closed on props, not C-clips (`crops/high/R15-player`, baton).
- **Marks:** no LEGO name or logo in the title, menus, HUD or results (`high/desktop/R01`, `high/desktop/R02`, `high/desktop/R18`).

The neck stub, hip block and dot-eye print are generic block-figure features, not the three silhouette tests.

## Ranked gaps
Merges and overrules:
- **Horizon.** `G-horizon-wallpaper` and Codex's `G-mountain-walls` are merged into `G-horizon-terraces`. The shipped rebuild already added overlapping hills, and what remains is face steepness and crown regularity, so the gain is +0.5, not +1.0.
- **Effects.** `G-camera-kick-and-effects`, `G-action-follow-through`, `G-steam-never-rises` and `G-opaque-effects` become two gaps:
  - `G-fx-translucent-steam`, for the effects;
  - `G-impact-kick-capture`. The kick is unverified because the R15 strip starts after the impact.
- **Dusk light.** `G-dusk-lane-light` and `G-dusk-pack-separation` are merged into `G-dusk-figure-light`, with the cause corrected: the near pool already reaches the left lane, but the centre lane and unrimmed figures stay dark.
- **Lawns.** `G-flat-lawns` is narrowed to mid-distance lawns (`G-far-lawn-studs`). Near lawns are studded.
- **Material consistency.** In Codex's `G-material-consistency`, the water half is overruled (the streaks are the enamel shell, identical in both builds). The facade half becomes `G-row-glazing-registration`.
- **Pack separation.** Codex's `G-pack-separation` is narrowed to the R08 hairpin (`G-hairpin-pack-camera`). R04 and `high/mobile/R04` separate.
- **Overruled:**
  - Codex's `G-forest-repetition`: the assemblies exist and the R08 corner is clear;
  - Codex's `G-phone-secondary-type`: the text is legible.

| # | Gap | Category | Effort | Gain |
|---|---|---|---|---|
| 1 | `G-landscape-banner-overlap` | ui | S | +0.3 |
| 2 | `G-ford-reads-as-paving` | materials | S | +0.3 |
| 3 | `G-fx-translucent-steam` | animation | M | +0.5 |
| 4 | `G-impact-kick-capture` | animation | S | +0.25 |
| 5 | `G-figure-shadow-acne` | lighting | S | +0.2 |
| 6 | `G-far-lawn-studs` | materials | S | +0.2 |
| 7 | `G-ford-route-edge` | readability | S | +0.2 |
| 8 | `G-judge-stand-brick` | scenery | S | +0.2 |
| 9 | `G-dusk-figure-light` | lighting | M | +0.4 |
| 10 | `G-row-glazing-registration` | materials | M | +0.4 |
| 11 | `G-hairpin-pack-camera` | readability | M | +0.3 |
| 12 | `G-horizon-terraces` (**big lever**) | scenery | L | +0.5 |

1. **`G-landscape-banner-overlap`** (ui, WS6, S, +0.3; a regression)
   - Problem: the event banner covers the item tile from y≈141 to y≈177 device px in `high/landscape/R17`.
   - Fix: place transient banners at the tile's measured bottom edge plus at least 8 CSS px, add banners to the automated HUD-rectangle overlap check in all three viewports, and label a count of 1 as "1 TICKET".
   - Test: in landscape R17 the banner top is at y ≥ 193 device px with no tile pixels under it, and R17 reads "1 TICKET" in all viewports.
2. **`G-ford-reads-as-paving`** (materials, WS1, S, +0.3; a regression; also helps authenticity)
   - Fix: give the ford water a teal depth tint that hides the bed tiles, a stronger Fresnel at the chase angle, a white edge foam line and ripple rings around wading tubs.
   - Test: the R19 ford's mean B−R is at least 30 (now −7 to +20 at x 460–660, y 330–400), and no tile seams show through it.
3. **`G-fx-translucent-steam`** (animation, WS3, M, +0.5; also helps materials)
   - Fix: replace the opaque glossy ball clusters with translucent trans-clear parts (alpha 0.4–0.6, soft rim). Emit steam in world space with at least 1 m/s upward velocity, trailing behind the tub and growing 1.7×. Spill and splash become translucent blue round plates on arcs.
   - Test:
     - in `strips/high/R14` frames 3–6 the puff tops climb at least 15 px at strip scale (now pinned at ≈ (172–175, 240–257));
     - the road shows at least 30% through the R17 puffs (x 615–653, y 542–564).
4. **`G-impact-kick-capture`** (animation, WS3, S, +0.25)
   - Fix: re-time the R15 capture so that strip frame 1 is the fumble's impact tick (frame 1 at 0:04.03 now shows the crew already off the tub). If the kick still doesn't read, raise it to 3° with about 150 ms decay.
   - Test: the horizon shifts at least 4 px at strip scale between frames 1 and 2 (now 0 to −1 px).
5. **`G-figure-shadow-acne`** (lighting, WS1, S, +0.2; a regression)
   - Fix: use a normal-offset or slope-scaled shadow bias of 1–2 texels on figure and tub meshes, and keep the 6 cm constant bias for chassis contact.
   - Test: no diagonal hatching at 3× on the head at x 600–800, y 230–330 in `crops/high/R03-player-rear`, and no stair-step band returns beside the chassis in `crops/high/R03-kart_5`.
6. **`G-far-lawn-studs`** (materials, WS1, S, +0.2)
   - Fix: carry stud relief, or a baseplate-seam grid with a stud-tint mip, out to about 60 m.
   - Test: the luma gradient on the R06 lawn (x 0–120, y 600–780; now 0.64/1.37) and the R05 back lawn (x 1080–1270, y 560–680; now 0.19/0.83) reaches the R08 studded bank's 1.62/3.22.
7. **`G-ford-route-edge`** (readability, WS4, S, +0.2)
   - Fix: run a white tile edge line or kerb along both sides of the route across the Gulpha plaza and ford, and replace the ribbed bank with stepped slope bricks.
   - Test: in R19 the route edge is continuous from the player's tub to the far side of the ford.
8. **`G-judge-stand-brick`** (scenery, WS5, S, +0.2; also helps authenticity)
   - Fix: build the judge stand from bricks and tiles with a printed judges' sign and a table, with the judges in front of it facing the lane.
   - Test: the R16 stand face shows seams or studs (now σY 7.8 over x 255–345, y 350–460), and every judge's face is visible.
9. **`G-dusk-figure-light`** (lighting, WS1, M, +0.4; also helps readability)
   - Fix: space the dusk lamps or widen their falloff so the centre lane between posts is lit, and add a warm rim and fill term on figures and tubs at dusk and sunset.
   - Test:
     - in R07 the centre lane at x 380–500, y 560–620 reads Y ≥ 70 (now 46.4);
     - the player's crew torsos reach at least 2:1 against the lane (now 67–80 against 46–48) and its tub at least 1.5:1 (now 39);
     - in R11 the crew reaches at least 1.6:1 (now 64–67 against 47).
10. **`G-row-glazing-registration`** (materials, WS4, M, +0.4)
    - Fix: remove the painted window openings from Row facade textures wherever geometry panes exist, or snap the panes to them. Set panes at most 2 cm proud inside a moulded frame, with true round arches of at least 8 segments.
    - Test: no painted window edge within 4 px of any pane in `high/desktop/R04`, `crops/high/R04-kart_3`, `high/desktop/R16` and `high/desktop/R18`.
11. **`G-hairpin-pack-camera`** (readability, WS6, M, +0.3)
    - Fix: in tight corners, raise the chase camera 0.5–1 m and pitch it down about 5°, or extend the look-ahead, so rival tub bodies show above the crews ahead.
    - Test: in R08 at least four rival tub bodies are visible (now only one tub is partly visible; the rest show crews and wheels).
12. **`G-horizon-terraces`** (scenery, WS4, L, +0.5) **Big lever.** This is the main thing holding scenery back: the wallpaper horizon shows in most frames (R01, R03–R07, R09, R13, R14, R17).
    - Fix: terrace the hill rings into receding plate tiers that each carry a tree line, so no face is near-vertical. Put instanced three-tier conifer geometry on the near ring, with random scale (±25%), rotation and offset. Keep shader crowns only on the far ring, with per-crown jitter. Stay within the perf budgets.
    - Test:
      - in R06 (x 0–440, y 230–500) and R05 (right half), no continuous face runs taller than 60 px without a lit ledge;
      - the row-wise luma autocorrelation over R06 x 0–400, y 330–470 stays at or below 0.2 for lags of 15–30 px (now 0.22–0.44 at lag 19–23).

**Below the cut** (valid, but lower gain for the effort or already at the gate):
- **Goat Rock** (`G-masonry-rocks`, M, +0.3): rebuild it from slope and wedge bricks.
- **Lamp-post clip** (`G-slide-prop-clip`, M, +0.25): collide the crew footprint with street furniture (`strips/high/R14` frame 8).
- **Tub enamel streaks** (characters, S, +0.2).
- **HUD brick cue** (ui, S, +0.2).
- **Portrait team panel** (mobile, S, +0.2): add a bottom safe-area margin.
- **Portrait results swatches and one-line rows** (ui, S, +0.15).
- **Orphaned "· locked" bullets** (typography, S, +0.05): use a non-breaking separator.
- **Bridge Street identity** (authenticity, M, +0.2).
- **Pack-marker overlap** (readability, S, +0.1): the pointer lands on the tub ahead in R04 and R08.
- **Faceted water edge** (characters, S, +0.1).

```json
{
  "loop": 7,
  "role": "judge",
  "tier": "high",
  "scores": {
    "characters": {
      "score": 7.0,
      "confidence": 0.75,
      "evidence": [
        { "shot": "crops/high/R02-preview-captain", "note": "printed shouting captain, hydrant badge, studded helmets; enamel streaks on the inner wall identical in both A/B panels (3.16/1.57 vs 3.14/1.60), so tub shell not water" },
        { "shot": "crops/high/R03-player-rear", "note": "separate bevelled hip block with seams over split legs (Claude's 'no hip piece' wrong); diagonal hatching on the centre head at 3x (x 560-880, y 180-420)" },
        { "shot": "crops/high/R15-player", "note": "hip block and feet confirmed; captain turned to the flag is pose, left pusher's printed smile carries the shot" },
        { "shot": "crops/high/R04-kart_3", "note": "antenna team with angry printed brows, tie-dye print" },
        { "shot": "high/desktop/R03", "note": "six or more teams distinct at chase distance; spectators a lower tier" }
      ]
    },
    "materials": {
      "score": 6.5,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R05", "note": "near lawn studded (grad 3.43 h / 6.04 v at x 900-1050, y 640-700), brick relief; back lawn flat (0.19/0.83 at x 1080-1270, y 560-680)" },
        { "shot": "high/desktop/R06", "note": "foreground lawn 0.64/1.37 at x 0-120, y 600-780 vs studded R08 bank 1.62/3.22" },
        { "shot": "crops/high/R04-kart_3", "note": "chamfered 3-segment panes half a bay off the painted mullioned windows (2x, x 780-1280, y 60-320)" },
        { "shot": "high/desktop/R16", "note": "judge stand face RGB (209,212,204), sigma-Y 7.8; smeared painted window surrounds" },
        { "shot": "high/desktop/R19", "note": "ford RGB (145,140,138)/(127,137,147), B-R -7..+20, bed tiles show through; greyer than the other panel of ab/high-desktop-R19" },
        { "shot": "high/desktop/R09", "note": "Goat Rock wedges in running-bond masonry texture" },
        { "shot": "high/desktop/R17", "note": "hot steam as opaque glossy orange balls" }
      ]
    },
    "scenery": {
      "score": 6.5,
      "confidence": 0.75,
      "evidence": [
        { "shot": "high/desktop/R06", "note": "left third (x 0-440, y 230-500) near-vertical wall of identical stepped triangles; row autocorrelation peak r 0.22-0.44 at lag 19-23 px" },
        { "shot": "ab/high-desktop-R06", "note": "hills clearly better than the other panel's flat pale walls" },
        { "shot": "high/desktop/R08", "note": "corner x 700-1280 and pack unobstructed (Codex wrong); canopy over wall and sky" },
        { "shot": "high/desktop/R12", "note": "broadleaf, autumn and conifer assemblies already mixed (Codex gap overruled)" },
        { "shot": "high/desktop/R09", "note": "merged conifer tiers x 820-1210" },
        { "shot": "high/desktop/R16", "note": "judge stand is a blank white box" }
      ]
    },
    "lighting": {
      "score": 6.5,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R07", "note": "left pool reaches the left lane (Y 112.7 at x 60-250, y 420-470); centre lane under the pack Y 46.4-48.2; player crew torsos 67-80, tub 39" },
        { "shot": "high/desktop/R11", "note": "sunset crew torsos 63.7-66.9 vs road 47.4, no warm rim" },
        { "shot": "crops/high/R03-player-rear", "note": "new diagonal hatching on the back of a head; one panel of ab/crop-R03-player-rear smooth" },
        { "shot": "crops/high/R02-preview", "note": "dark contact shadow under the chassis" },
        { "shot": "high/desktop/R10", "note": "clean key light and tree shadows; day palette distinct from R07 and R11" }
      ]
    },
    "animation": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "strips/high/R14", "note": "gauge 41 (f1-5), 40 (f6), 39 (f7-8) with blue drops spilling f7-8; steam clumps parked at frame-local ~(172-175, 240-257) f3-8, no rise; f8 lamp post inside the crew footprint; charge arc blue f3-5, white f6-8" },
        { "shot": "strips/high/R15", "note": "crew circles with rigid limb swings and a drop burst f2-7; frame 1 (0:04.03) already after impact; vertical shift 0/-1 px; residuals match the other panel of ab/strip-R15, kick unverified" },
        { "shot": "strips/high/R16", "note": "judge-stop circuit reads, progress bar fills" },
        { "shot": "high/desktop/R19", "note": "warm steam as opaque white balls" }
      ]
    },
    "ui": {
      "score": 7.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/landscape/R17", "note": "HOT STEAM banner outline y 141-144, tile body showing through to y 174, tile edge ~177: ~35 device px overlap; other panel of ab/high-landscape-R17 clear" },
        { "shot": "high/desktop/R16", "note": "context-aware: SEMIFINAL tile and judge panel, bar fills across strips/high/R16" },
        { "shot": "high/desktop/R17", "note": "8 LEFT and arena radar; '1 TICKETS'" },
        { "shot": "high/desktop/R15", "note": "used Bath item greyed in the legend (3x zoom)" },
        { "shot": "high/mobile/R18", "note": "drops team swatches, stacks gal/CLEAN, wraps the player name" },
        { "shot": "high/desktop/R03", "note": "clear hierarchy; HUD tiles plain slate vs studded menus in R01/R18" }
      ]
    },
    "typography": {
      "score": 7.0,
      "confidence": 0.75,
      "evidence": [
        { "shot": "high/desktop/R01", "note": "pixel display face and rounded UI face form a clear scale" },
        { "shot": "high/mobile/R07", "note": "LAP, time and place numerals read at 390 px" },
        { "shot": "high/desktop/R17", "note": "TICKETS cap height 8 px (rows 55-62); 16 px on high/mobile/R17" },
        { "shot": "high/mobile/R02", "note": "orphaned bullets 'Traditional / . locked', 'Stock . / locked'; secondary copy legible" },
        { "shot": "high/landscape/R04", "note": "Steer label straddles the pad rim" }
      ]
    },
    "readability": {
      "score": 6.5,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R07", "note": "rivals separate at dusk (pink Y 116.8, tie-dye 107.2 vs lane 46-48); player's dark crew flagged by ring" },
        { "shot": "high/mobile/R07", "note": "same separation on the phone" },
        { "shot": "high/desktop/R04", "note": "barrel, pink and white tubs visible at 2.5x; marker lands visually on the white tub ahead" },
        { "shot": "high/desktop/R08", "note": "hairpin queue hides rival tubs behind crews (2x zoom)" },
        { "shot": "high/desktop/R19", "note": "no route edge across plaza and ford" }
      ]
    },
    "mobile": {
      "score": 7.0,
      "confidence": 0.75,
      "evidence": [
        { "shot": "high/mobile/R04", "note": "tub mid-frame, clear of steer pad and buttons; rivals separate" },
        { "shot": "high/landscape/R04", "note": "controls in the corners, tub centred" },
        { "shot": "high/landscape/R17", "note": "banner/item tile overlap (charged under ui)" },
        { "shot": "high/mobile/R02", "note": "team panel base border at y 1682-1686 of 1688, no bottom margin" }
      ]
    },
    "authenticity": {
      "score": 7.0,
      "confidence": 0.75,
      "evidence": [
        { "shot": "high/desktop/R06", "note": "Arlington twin towers close the vista; forested ridges read as the Ouachitas" },
        { "shot": "high/desktop/R05", "note": "Fordyce patterned storeys, canopy and lantern roof" },
        { "shot": "high/desktop/R16", "note": "judges, duck, flag, gauge, Rules of the Row" },
        { "shot": "high/desktop/R19", "note": "ford regressed to grey paving" },
        { "shot": "high/desktop/R13", "note": "Bridge Street Bash a generic corner" }
      ]
    }
  },
  "ip": {
    "clean": true,
    "notes": "Heads are wide rounded blocks on a short neck, not cylinders (crops/high/R02-preview); straight-sided box torsos (crops/high/R03-player-rear); rounded fists on props, not C-clips (crops/high/R15-player); no LEGO name or logo in title, menus, HUD or results (high/desktop/R01, R02, R18)."
  },
  "gaps": [
    { "id": "G-landscape-banner-overlap", "category": "ui", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R17", "ab/high-landscape-R17", "high/desktop/R17"], "benchmark": "drive-3", "fix": "Regression: the event banner covers the item tile from y~141 to ~177 device px in landscape R17. Place transient banners at the tile's measured bottom edge plus >= 8 CSS px, add banners to the automated HUD-rectangle overlap check in all three viewports, and label a count of 1 '1 TICKET'. Test: in landscape R17 the banner top is at y >= 193 device px with no tile pixels under it; R17 reads '1 TICKET' in all viewports." },
    { "id": "G-ford-reads-as-paving", "category": "materials", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R19", "ab/high-desktop-R19"], "benchmark": "bj-2", "fix": "Regression: the clear-water change exposes the bed tiles. Give the ford a teal depth tint that hides the bed, a stronger Fresnel at the chase angle, a white edge foam line and ripple rings around wading tubs. Test: R19 ford mean B-R >= 30 (now -7 to +20 at x 460-660, y 330-400) and no tile seams visible through it." },
    { "id": "G-fx-translucent-steam", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "high/desktop/R17", "high/desktop/R19", "strips/high/R15"], "benchmark": "drive-3", "fix": "Replace the opaque glossy ball clusters with translucent trans-clear parts (alpha 0.4-0.6, soft rim): steam emitted in world space with >= 1 m/s upward velocity that trails behind the tub and grows 1.7x; spill and splash as translucent blue round plates on arcs. Test: in strips/high/R14 frames 3-6 the puff tops climb >= 15 px at strip scale (now pinned at ~(172-175, 240-257)); road >= 30% visible through the R17 puffs (x 615-653, y 542-564)." },
    { "id": "G-impact-kick-capture", "category": "animation", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R15", "ab/strip-R15"], "benchmark": "drive-3", "fix": "The R15 strip starts after the fumble impact (frame 1 at 0:04.03 shows the crew already off the tub), so the new pitch kick cannot be seen. Re-time the capture so strip frame 1 is the impact tick; if the kick still does not read, raise it to 3 degrees with ~150 ms decay. Test: horizon shift >= 4 px at strip scale between R15 frames 1 and 2 (now 0 to -1 px)." },
    { "id": "G-figure-shadow-acne", "category": "lighting", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["crops/high/R03-player-rear", "ab/crop-R03-player-rear", "crops/high/R03-kart_5"], "benchmark": "bj-1", "fix": "Regression: diagonal hatching on curved figure parts. Use a normal-offset or slope-scaled shadow bias of 1-2 texels on figure and tub meshes; keep the 6 cm constant bias for chassis contact. Test: no diagonal hatching at 3x on the head at x 600-800, y 230-330 of crops/high/R03-player-rear, and no stair-step band beside the chassis in crops/high/R03-kart_5." },
    { "id": "G-far-lawn-studs", "category": "materials", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R06", "high/desktop/R05", "high/desktop/R08"], "benchmark": "worlds-1", "fix": "Near lawns are studded; mid-distance lawns go flat. Carry stud relief, or a baseplate-seam grid with a stud-tint mip, out to ~60 m. Test: luma gradient on the R06 lawn (x 0-120, y 600-780; now 0.64 h / 1.37 v) and the R05 back lawn (x 1080-1270, y 560-680; now 0.19/0.83) reaches the R08 studded bank's 1.62/3.22." },
    { "id": "G-ford-route-edge", "category": "readability", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R19"], "benchmark": "drive-3", "fix": "Run a white tile edge line or kerb along both sides of the route across the Gulpha plaza and ford, and replace the ribbed bank with stepped slope bricks. Test: in R19 the route edge is continuous from the player's tub to the far side of the ford." },
    { "id": "G-judge-stand-brick", "category": "scenery", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R16", "strips/high/R16"], "benchmark": "worlds-1", "fix": "Build the judge stand from bricks and tiles with a printed judges' sign and a table, judges in front facing the lane (also helps authenticity). Test: the R16 stand face shows seams or studs (now sigma-Y 7.8 over x 255-345, y 350-460) and every judge's face is visible." },
    { "id": "G-dusk-figure-light", "category": "lighting", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/mobile/R07", "high/desktop/R11"], "benchmark": "worlds-4", "fix": "The near pool already reaches the left lane (Y 112.7); the centre lane under the pack and the figures stay dark. Space dusk lamps or widen their falloff so the centre lane between posts is lit, and add a warm rim/fill term on figures and tubs at dusk and sunset. Test: R07 centre lane at x 380-500, y 560-620 reads Y >= 70 (now 46.4); the player's crew torsos >= 2:1 against it (now 67-80 vs 46-48) and its tub >= 1.5:1 (now 39); R11 crew >= 1.6:1 (now 64-67 vs 47)." },
    { "id": "G-row-glazing-registration", "category": "materials", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["crops/high/R04-kart_3", "high/desktop/R04", "high/desktop/R16", "high/desktop/R18"], "benchmark": "worlds-1", "fix": "Geometry panes sit half a bay off the facade texture's painted mullioned windows. Remove painted openings wherever geometry panes exist (or snap the panes to them); panes at most 2 cm proud inside a moulded frame; true round arches of at least 8 segments. Test: no painted window edge within 4 px of any pane in R04, crops/high/R04-kart_3, R16 and R18." },
    { "id": "G-hairpin-pack-camera", "category": "readability", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R08"], "benchmark": "drive-3", "fix": "In tight corners raise the chase camera 0.5-1 m and pitch it down ~5 degrees, or extend look-ahead, so rival tub bodies show above the crews ahead. Test: at least four rival tub bodies visible in R08 (now one tub partly visible; the rest show crews and wheels)." },
    { "id": "G-horizon-terraces", "category": "scenery", "expectedGain": 0.5, "severity": 4, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R06", "high/desktop/R05", "high/desktop/R03", "high/desktop/R17"], "benchmark": "drive-5", "fix": "BIG LEVER (scenery; also helps authenticity). Terrace the hill rings into receding plate tiers that each carry a tree line, so no face is near-vertical; put instanced three-tier conifer geometry with random scale (+/-25%), rotation and offset on the near ring; keep shader crowns only on the far ring with per-crown jitter; stay within perf budgets. Test: in R06 (x 0-440, y 230-500) and R05 (right half) no continuous face runs taller than 60 px without a lit ledge, and row-wise luma autocorrelation over R06 x 0-400, y 330-470 is <= 0.2 at lags 15-30 px (now 0.22-0.44 at lag 19-23)." }
  ],
  "verdict": "continue"
}
```
