# Judge ruling: loop 4 (high tier)

Capture paths are relative to `games/Cart Racing/screenshots/review-loop-4/`. Pixel coordinates are in each file's own pixels, and luminance is Rec. 709 on 0–255. I opened every capture cited here. All numbers come from short PIL crops, patch statistics and column-mean residuals that I ran in my own scratch folder.
- I did not read the game source or `ab-key.json`, and I edited nothing in the game folder.
- `HISTORY.md` was used for trend only.
- I opened `reviews/loop-3/judge.md` only to copy the established JSON field name (`bigLever`), not its scores.

## Verdict
**Continue. 63.5/100** before the tally's A/B rule.
- Authenticity (6.5) meets its gate (≥ 6). The other nine categories are below 7.
- Measured gates: perf passes (52 checked, none failed), fidelity is not measured yet, and IP passes. My own IP check is also clean.

The crews are still the best thing on screen. This loop added two close-up defects to them:
- a High-only 10 px banding from the new occlusion pass;
- a water sheet that now tilts through the tub wall.

The new brick-stepped horizon has the right silhouette. Its faces, though, are a single unlit colour that fills 12–18 % of the landmark frames. Slides and fumbles still have no camera beat and no in-world steam. Two clips survive in the UI: the "10" tile and the fourth row of the landscape team grid.

| Category | Critic A | Critic B | Prosecutor | Advocate | **Judge** | Gate |
|---|---|---|---|---|---|---|
| Characters | 6.5 | 7.0 | 6.0 | 7.0 | **6.5** | ≥ 7 |
| Materials | 6.0 | 6.5 | 5.5 | 6.5 | **6.0** | ≥ 7 |
| Scenery | 6.5 | 6.0 | 6.0 | 6.5 | **6.5** | ≥ 7 |
| Lighting | 6.0 | 6.5 | 6.0 | 6.5 | **6.0** | ≥ 7 |
| Animation | 6.0 | 6.5 | 5.5 | 6.5 | **6.0** | ≥ 7 |
| UI / HUD | 6.5 | 6.5 | 6.0 | 6.5 | **6.5** | ≥ 7 |
| Typography | 6.5 | 6.5 | 6.5 | 6.5 | **6.5** | ≥ 7 |
| Readability | 6.5 | 7.0 | 6.0 | 7.0 | **6.5** | ≥ 7 |
| Mobile | 6.5 | 6.0 | 6.0 | 6.5 | **6.5** | ≥ 7 |
| Authenticity | 6.5 | 7.0 | 6.0 | 7.0 | **6.5** | ≥ 6 met |
| **Total** | 63.5 | 65.5 | 59.5 | 66.5 | **63.5** | |

## Arithmetic, thresholds and the A/B pairs
**Sums.**
- Critic A's JSON sums to 63.5. Its prose states no total, and the prosecutor and advocate both quote 63.5, which agrees.
- Critic B's prose says 65.5, and its JSON sums to 65.5.
- The prosecutor's 59.5 and the advocate's 66.5 match their JSON.
- The critic mean of 64.5 is quoted correctly by both.
- Every prosecutor and advocate score is within ±1 of the critic mean.

**Thresholds.**
- No category has critics more than 1.0 apart; the largest gap is 0.5.
- The prosecutor and advocate are exactly 1.0 apart in five categories (characters, materials, animation, readability and authenticity), so none is over the threshold.
- I still checked close-ups or strips for all five.

**A/B pairs: valid, no void.**
- I split 12 pairs into halves and compared each half (mean absolute difference, after downscaling) with both loops' High and Low captures:
  - four close-ups: R02-preview-captain, R03-player, R04-kart_3 and R15-player;
  - three strips: R14, R15 and R16;
  - five frames: desktop R07, R11 and R19, mobile R02 and landscape R02.
- Every half matched one loop's High capture: MAD 1.0–1.5 for close-ups, 2.0–2.4 for strips and 2.1–4.4 for frames. Against every Low capture the MAD was 6.2–44.
- So the loop-3 rig bug is fixed, and the close-up and strip pairs show High against High.
- The critics split on materials (A against B) and lighting (B against tie). That is a disagreement, not a measured fault in the pairs, so the A/B rule stands for all ten categories.

## Category rulings

### Characters: 6.5
I checked `crops/high/R02-preview-captain`, `crops/low/R02-preview-captain`, `crops/high/R15-player`, `crops/high/R04-kart_3` and `crops/high/R03-player`. I also checked a montage of the player crews in R03, R07, R08, R10, R11, R12, R13, R17 and R19.

**What reaches the 7 bar:**
- **Faces.** The advocate is right that these are not "two-dot prints": `crops/high/R04-kart_3` has angled brows and shouting mouths, and the captain has an open mouth with a tongue.
- **Teams.** Nine player crews are clearly different at chase distance.
- **The three greens.** The prosecutor's three green teams differ in more than hat:
  - R08: lime with X-straps and an orange tub;
  - R17: dark green with a scale print and a green tub;
  - R19: sage with Y-straps and ranger hats.
  They are the weakest pairing, but this is not the anchor-5 case.

**What fails:**
- **Water sheet.** It pokes out as a blue triangle on both sides of the duck, on High and Low alike. The advocate is right that the tier is not the cause. In `crops/high/R15-player` the water is a small patch far below the rim at 37 gal. So the tub is not "empty" (advocate right), but it does not read as a full tub either (Critic A right).
- **Banding, High only.**
  - On the interior box (250,420)–(450,520) of `crops/high/R02-preview-captain` the column-mean residual is σ 3.02 levels, with a 9.9 px period and a spectral peak 58× the median.
  - The same box on Low gives σ 0.06 and no peak.
  - At play size it vanishes: σ 0.08 on the `high/desktop/R03` tub body (Low 0.10) and 0.17 on the R16 booth.
  - So it is a close-up defect only, which is exactly what the anchor's "close-ups hold up" clause tests.
- **Studs and parts.** Hats and tub bodies carry no studs. The tub is a smooth shell with a painted stripe sitting on a studded chassis (`crops/high/R15-player`, `crops/high/R04-kart_3`).

**Ruling:** Critic A and the prosecutor are closer. Codex's 7 skips three of the anchor's clauses.

### Materials: 6.0
**What fails:**
- **The ridge fill.** One unlit RGB value, (63,94,69), covers 17.9 % of `high/desktop/R05`, 12.3 % of `high/desktop/R06` and 6.1 % of `high/desktop/R04`.
- **Texture-free area.** Non-sky pixels whose 9×9 neighbourhood varies by less than 0.75 levels make up 27.2 % of R05, 24.2 % of R06 and 23.5 % of R04. That reproduces the prosecutor's figures to within 0.5 points.
- **Windows.** All are the same opaque navy: (26,40,52), (29,42,54) and (24,37,46) in R06.
- **The ford.** It averages (136,131,124), a warm grey that reads as paving (`high/desktop/R19`).
- **Shoulders.** The R08 shoulder wedge is plain grey.

**What holds up:**
- The figures, tubs and duck show highlights that follow the bevels (`crops/high/R02-preview`, `crops/high/R04-kart_3`).
- Baseplate studs show across `high/desktop/R09`, on the R11 and R12 verges and on the R05 lawn. The advocate is right here.
- The pickups read as translucent (`high/desktop/R17`).

**Ruling:**
- I don't charge the banding here, because it doesn't reach play size.
- The prosecutor is right that no clear part except the pickups reads as transparent.
- 6.0, as Critic A gave. The 6.5s overlook a quarter of each landmark frame having no surface at all. The prosecutor's 5.5 ignores how well the figures, tubs, verges and pickups read at play size.

### Scenery: 6.5
**What holds up:**
- Studded baseplate ground and tile roads (`high/desktop/R10`, R19).
- Three tree shapes, including an autumn maple, plus shrubs, rocks and flowers (`high/desktop/R12`).
- Goat Rock's boulders (`high/desktop/R09`).
- A recognisable Fordyce (R05) and Arlington (R06).

**What fails:**
- **The near ridge ring** is a dark flat wall over R05 and R06.
  - The advocate's correction holds: the silhouettes are already stepped plates with lighter plate edges (R05 far ring).
  - The defect is shading and value, not shape, so Codex's L rebuild names the wrong cause.
- **R09 tree clash.** The big pine's canopy plates tilt and pierce one another, and a grey rail runs through the canopy at about x 1100–1240, y 545–575. The prosecutor is right.
- **The plaza.** `high/desktop/R17` has no centrepiece. The fountain basin's edge shows only at the left edge of `high/landscape/R17`, so the advocate is right on that fact, but the jug centrepiece is in no frame.
- **Repetition.** The same two-storey awning module repeats across R03, R04, R07, R13 and R17.
- **Mountain courses.** They differ in surface (R10 terracotta tile, R08 asphalt with a stone wall, R11 dusk with a tower), so the advocate is right that they are not interchangeable. None has a hero set piece.

**Ruling:** 6.5, with Critic A and the advocate. The 6.0s weight the ridge, which I count once, as shading, in the big-lever gap.

### Lighting: 6.0
**What holds up:**
- **The occlusion pass grounds the tubs.**
  - Under the player tub in `high/desktop/R03` the mean is 29.7, against 56.3 in `low/desktop/R03`. Open road is equal (93.5 against 90.6).
  - That reproduces the advocate's measurement.
- **The dusk frame has layers.**
  - In `high/desktop/R07` the navy band sits only behind the town centre, about 1–1.6 % of the frame.
  - The salmon ring (172,106,93) covers 4.4 % at x 661–1279, with lit plate edges.
  - So the advocate is right, and Critic A's "navy wall" overstates it.
- **Lamp pools** no longer clip.

**What fails:**
- **The sunset (`high/desktop/R11`)** has no sun, glow or bloom. On column x=650 the sky runs from (161,121,122) at the top to (197,145,114) at y=200, a luminance ratio of about 1.19. That is a tint, set against the sun disc and haze in `worlds-4`.
- **The Arlington is unmodelled (`high/desktop/R06`).**
  - On wall pixels only (windows excluded): main front 101.7, right wing 101.5, tower fronts 100.8 and 102.8, tower sides 99.1 and 103.2.
  - Planes facing different ways sit within 4 levels of each other, so the key light does nothing for the hero landmark.
- **No haze on the near ring.** It sits at 85.6 hard against a sky of 197.

**Ruling:** 6.0, with Critic A and the prosecutor. Codex and the advocate credit the occlusion, which is real, but skip the anchor's sunset-palette and haze clauses.

### Animation: 6.0
I checked `strips/high/R14`, `strips/high/R15` and `strips/high/R16`.

**What holds up:**
- The crew circles the tub with rigid, jointed limbs (R15, R16), and the progress bar fills while they do (R16).
- The crew leans as the tub slides out (R14, frames 7–8).
- The charge tiers exist as HUD banners: `WARM STEAM` in `high/desktop/R19` and `HOT STEAM!` in `high/desktop/R17`. The advocate is right on that fact.

**What fails:**
- **No camera kick.** At three fixed columns the ridge-top row moves at most 3 px (strip scale) across all eight frames of R15, and at most 2 px in R16.
- **No hit reaction.** At 2× zoom of R14 frame 8, a lamp post passes through the crew inside the ring.
- **Opaque splash.** In R15 frame 4 the fumble beads are opaque spheres heaped over the tub.
- **No steam or slosh in R14.** It shows no in-world steam, and the crew hides any water slosh.

The banners are HUD text, not the "particles and camera kick" the 7 anchor names.

**Ruling:** 6.0, as Critic A gave. The prosecutor's 5.5 ignores that the circling is already 7-grade. Codex and the advocate lean too hard on the banners and the gauge draining.

### UI / HUD: 6.5
**What holds up:** The race HUD hierarchy is clear (`high/desktop/R04`), and the menus are consistent (R01, R02, R18).

**What fails:**
- **The "10" tile.**
  - On row y=711 of R04 the tile starts at x=142, and the "0"'s left stroke is at x=154–157.
  - Only the first column of its right stroke shows, at x=159; road shows at x=160.
  - So half the "0" is cut, as Critic A said, and the same happens on both phone viewports.
- **Landscape team select (`high/landscape/R02`).** The fourth row of cards is cut, and the preview tub is cut at the panel edge. Meanwhile about 260 device px of the right column stays empty between the Water bar and the buttons. The prosecutor is right about the space, and it is larger than his 150.
- **Focus ring.** On the title, the white ring runs through the Grand Prix studs' bases (2.5× crop of R01). The prosecutor is right, though it is minor.
- **A new finding.** In `high/mobile/R02` the "CHOOSE YOUR TEAM" title sits on the panel's stud row, and studs peek out between the letters.
- **HUD style.** The race HUD panels are plain dark rounded rectangles, as the prosecutor said.

The advocate is right that a podium is a 9-anchor item.

**Ruling:** 6.5. The prosecutor's 6.0 makes too much of small overlaps.

### Typography: 6.5
Unanimous.
- The pixel display face and the rounded sans form a clear scale, and the numerals read at a glance (`high/desktop/R04`, `high/desktop/R18`).
- The two clips hold it at 6.5: the "10" glyph and the fourth-row labels in `high/landscape/R02` ("Stock ·").

### Readability: 6.5
**What holds up:**
- The player's ring and marker read in every race frame (`high/desktop/R03`, `high/desktop/R13`, `high/mobile/R07`, `high/landscape/R17`).
- The white road edges are crisp.
- The pickups glow (R10, R11, R17).

**What fails:**
- **Pack merging.** In `high/mobile/R07` the rival tubs ahead show only as crews, and the Out-of-Towners crew overlaps the player's captain. `high/desktop/R12` looks the same.
- **The judges** at R16 are generic figures beside a plain box (3× zoom). Only the stop line and the banner read.

**Rulings on the disputes:**
- **Canopies.** The advocate is right that in R08, R11 and R19 they cover sky, verge and tree line, not road, tubs or pickups, so I count them as framing only.
- **Timing.** The advocate is also right that every pack frame was taken at 0:06.00–0:07.00. But every race opens this way, so the frames still count.

**Ruling:** 6.5. Codex and the advocate skip the anchor's "every tub … in every frame". The prosecutor counts the canopies too heavily.

### Mobile: 6.5
**What holds up:**
- Portrait race frames are framed on purpose (`high/mobile/R03`, `R04`, `R07`, `R08`, `R17`). The thumb controls never reach the tub: in `high/mobile/R07` the ring ends near y=1120 and the controls start near y=1425.
- In landscape the controls stay in the corners (`high/landscape/R04`, `R17`).
- Portrait team select fits, with the whole preview tub shown (`high/mobile/R02`).

**What fails:** The landscape team select is clipped (`high/landscape/R02`), and the "10" tile is clipped on both phone viewports.

**Performance.** The brief's table gives a SwiftShader floor of 53 fps minimum, and the 4× CPU phone proxies hold 198 and 139 fps minimum. High was not throttle-tested on a phone (the prosecutor is right), but the measured perf gate passes.

**Ruling:** 6.5, with Critic A and the advocate.

### Authenticity: 6.5 (gate met)
**What holds up:**
- The Row reads: the Fordyce (R05), the Quapaw dome (R03, R14) and Hot Springs Mountain behind the Row (R01, R04).
- The Medical Arts Building's setback tower stands at the head of Central Avenue in `crops/high/R03-player` (right side). The advocate is right, and both critics missed it.
- The race shows: the gallons gauge, a duck and flag on every tub, the ring-around-the-tub rule (R16) and the CLEAN check (R18).

**What fails:**
- **The vista.** The Arlington does not close the Central Avenue vista. In R03 and R04 the street ends in generic shopfronts and the ridge, and the Arlington appears only in its staged shot (R06). The prosecutor is right.
- **Other courses.** The ford reads as paving (R19), Goat Rock has no overlook (R09), the plaza fountain is out of frame (R17), the judges are anonymous (R16) and Bridge Street is generic (R13).

**Ruling:** 6.5, as Critic A gave.

### IP
**Clean.** Nobody reported a hit, and I re-checked:
- Heads are rounded cuboids with printed faces and no top stud (`crops/high/R02-preview-captain`, `crops/high/R03-player`).
- Torsos are straight-sided, and hands are mitten fists (`crops/high/R15-player`).
- There is no LEGO name or logo in R01, R02 or R18.
- Studs proposed for hats (G-tub-parts-and-hat-studs) must go on the hats, never on the heads.

## Ranked gaps (top 12)
**How I ranked them:** expected gain ÷ effort (S = 1, M = 2, L = 4), with ties broken by severity. Gains overlap across categories, so don't sum them.

**Merged:**
- **G-action-feedback:** G-slide-fumble-feedback, G-action-feedback and the R14 lamp-post clip.
- **G-landscape-team-select:** G-landscape-team-grid-clip, G-landscape-selection and the landscape half of G-hud-scale.
- **G-hud-overlaps:** G-gauge-10-clipped, the focus-ring half of G-hud-brick-style and the mobile title over the studs.
- **G-ao-closeup-banding:** G-high-ao-striping and the banded half of G-surface-consistency.
- **G-world-surface-pass:** G-ridge-flat-fill, G-ridge-walls, G-flat-terrain-banks, G-clear-parts-opaque, G-creek-ford-reads-stone and the rest of G-surface-consistency.
- **G-near-occluders:** G-near-canopy-cover and G-near-props-unhidden.
- **G-judge-figures:** G-judge-stop-weak and the anonymous judges under authenticity.
- **G-tub-parts-and-hat-studs:** from G-tub-brick-parts.

**Corrected causes:**
- **Ridge.** The silhouette is already stepped plates. The fault is unshaded single-colour faces and the near ring's dark value and height, so it needs shading work inside the lever, not an L landform rebuild.
- **Water triangle.** The more strongly tilted sheet pierces the inner wall. It appears on Low too, so it is neither the tier nor the occlusion pass.
- **Banding.** It is a High-only artefact of the new occlusion pass and shows only in close-ups (σ 3.02 against 0.06 on Low).
- **Steam charge.** The progression exists as HUD banners. What's missing is the in-world effect and a camera beat.
- **Near canopies.** No tub, pickup or road edge is hidden, so the gain is lowered to +0.2.

| # | Gap | Category | WS | Sev | Effort | Gain |
|---|---|---|---|---|---|---|
| 1 | G-action-feedback | animation | WS3 | 4 | M | +1.0 |
| 2 | G-landscape-team-select | mobile | WS6 | 3 | S | +0.5 |
| 3 | G-hud-overlaps | ui | WS6 | 2 | S | +0.5 |
| 4 | G-tub-water-sheet | characters | WS2 | 3 | S | +0.3 |
| 5 | G-ao-closeup-banding | characters | WS1 | 3 | S | +0.3 |
| 6 | G-hero-facade-modelling | lighting | WS1 | 3 | S | +0.3 |
| 7 | G-judge-figures | readability | WS5 | 2 | S | +0.3 |
| 8 | **G-world-surface-pass (big lever)** | materials | WS1 | 4 | L | +1.0 |
| 9 | G-dusk-sunset-sky | lighting | WS1 | 3 | M | +0.5 |
| 10 | G-tub-parts-and-hat-studs | characters | WS2 | 3 | M | +0.5 |
| 11 | G-pack-tub-separation | readability | WS2 | 3 | M | +0.5 |
| 12 | G-near-occluders | readability | WS5 | 2 | S | +0.2 |

**Big lever: G-world-surface-pass.**
- It is the main thing holding materials at 6: a quarter of each landmark frame has no surface read, and no window, water or ford reads as a clear part.
- It also carries scenery's main defect, the flat near ridge, and lighting's missing haze on the near ring.

**Next in line, outside the 12:**
- G-hud-brick-style (ui, WS6, M, +0.3): a stud rim and tile bevel on the gauge, coin and item panels.
- G-course-set-pieces (scenery, WS4, L, +0.5): one hero set piece per mountain course, the Goat Rock overlook view and the plaza fountain in frame. It is not flagged, because it is not the main thing holding scenery back.
- G-arlington-vista (authenticity, WS4, M, +0.3).
- G-canopy-intersections (scenery, WS5, S, +0.2): R09.
- G-asphalt-cells (materials, WS1, S, +0.2).
- G-green-teams (characters, WS2, S, +0.2).
- G-results-podium (ui, WS6, M, +0.2).

```json
{
  "loop": 4,
  "role": "judge",
  "tier": "high",
  "verdict": "continue",
  "scores": {
    "characters": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        {"shot": "crops/high/R02-preview-captain", "note": "Expressive prints (open mouth with tongue), but the tilted water sheet pokes out as a triangle on both sides of the duck (also on crops/low/R02-preview-captain), and the interior box (250,420)-(450,520) has 10 px banding: column-mean residual sigma 3.02, period 9.9 px, peak 58x median, against 0.06 on Low."},
        {"shot": "crops/high/R04-kart_3", "note": "Angled brows and shouting mouths, tie-dye uniforms, antenna caps; tub is a smooth shell with a painted stripe; no studs on hats or tub body, only the chassis plate."},
        {"shot": "crops/high/R15-player", "note": "Water is a small low patch far below the rim at 37 gal: not empty, not a full tub."},
        {"shot": "high/desktop/R03", "note": "Nine player crews distinct at chase distance across R03/R07/R08/R10/R11/R12/R13/R17/R19; banding not measurable at play size (sigma 0.08 on the tub body)."}
      ]
    },
    "materials": {
      "score": 6.0,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R05", "note": "One unlit RGB (63,94,69) covers 17.9% of the frame; 27.2% of non-sky pixels have 9x9 sigma < 0.75; studded lawn at lower right."},
        {"shot": "high/desktop/R06", "note": "12.3% one ridge colour, 24.2% texture-free; windows a constant opaque navy (26,40,52)/(29,42,54)/(24,37,46)."},
        {"shot": "high/desktop/R19", "note": "Ford mean (136,131,124) reads as paving; flat bank lower right."},
        {"shot": "crops/high/R02-preview", "note": "Figures, tubs and duck carry bevel-following highlights: the plastic read is real at the figures."},
        {"shot": "high/desktop/R09", "note": "Studded baseplate across the frame."}
      ]
    },
    "scenery": {
      "score": 6.5,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R12", "note": "Three tree shapes incl. autumn maple, shrubs, studded rocks, studded verge."},
        {"shot": "high/desktop/R05", "note": "Fordyce recognisable; near ridge ring a flat dark wall over the landmark (stepped silhouette, unshaded faces)."},
        {"shot": "high/desktop/R09", "note": "Goat Rock boulders on baseplate; pine canopy plates pierce each other and a grey rail runs through the canopy at about x 1100-1240, y 545-575."},
        {"shot": "high/desktop/R17", "note": "Radial brick plaza with no centrepiece in frame; basin edge only at the left of high/landscape/R17."},
        {"shot": "high/desktop/R10", "note": "Terracotta tile road; mountain courses differ in surface but lack hero set pieces."}
      ]
    },
    "lighting": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R03", "note": "Occlusion grounds the tub: mean 29.7 under the player tub vs 56.3 on low/desktop/R03, open road 93.5 vs 90.6."},
        {"shot": "high/desktop/R11", "note": "Sunset sky (161,121,122) to (197,145,114) on x=650, ratio about 1.19; no sun, glow or bloom."},
        {"shot": "high/desktop/R06", "note": "Arlington wall-only luminance 99.1-103.2 across fronts, wings and tower sides: no key-light modelling; near ring 85.6 hard against sky 197."},
        {"shot": "high/desktop/R07", "note": "Deliberate dusk layering: navy band only about 1-1.6% behind the town centre, salmon ring (172,106,93) 4.4% with lit edges; pools unclipped; globes without halo."}
      ]
    },
    "animation": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        {"shot": "strips/high/R15", "note": "Crew circles with rigid jointed limbs; ridge-top row moves at most 3 px (strip scale) over 8 frames: no camera shake; frame 4 beads are opaque spheres heaped over the tub."},
        {"shot": "strips/high/R14", "note": "Crew leans in frames 7-8; no in-world steam; frame 8 a lamp post passes through the crew inside the ring with no reaction."},
        {"shot": "strips/high/R16", "note": "Ritual reads with the progress bar; ridge row moves at most 2 px."},
        {"shot": "high/desktop/R17", "note": "Charge tier only as a HOT STEAM! HUD banner (WARM STEAM in R19)."}
      ]
    },
    "ui": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Clear hierarchy; '10' tile clipped: on row y=711 the tile starts at x=142, the 0's right stroke shows only at x=159, road at x=160."},
        {"shot": "high/landscape/R02", "note": "Fourth card row and preview tub cut while about 260 device px of the right column stays empty."},
        {"shot": "high/desktop/R01", "note": "Consistent studded brick buttons; focus ring runs through the Grand Prix studs' bases."},
        {"shot": "high/desktop/R18", "note": "Clean, consistent results panel."}
      ]
    },
    "typography": {
      "score": 6.5,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/desktop/R18", "note": "Pixel display face over rounded sans: clear scale."},
        {"shot": "high/desktop/R04", "note": "Numerals read at a glance; '10' glyph clipped."},
        {"shot": "high/landscape/R02", "note": "Fourth-row labels ('Stock ·') clipped."}
      ]
    },
    "readability": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/mobile/R07", "note": "Rival tubs ahead show only as crews; the Out-of-Towners crew overlaps the player's captain; player ring and marker still read."},
        {"shot": "high/desktop/R16", "note": "Stop line and banner read; judges are generic figures beside a plain box."},
        {"shot": "high/desktop/R11", "note": "Near canopy fills the right side but covers verge, not road, pack or the three pickups."},
        {"shot": "high/desktop/R12", "note": "Pack stacks into one file at 0:06.00; road edges crisp."},
        {"shot": "high/desktop/R17", "note": "Pickup separates clearly from the plaza floor."}
      ]
    },
    "mobile": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/mobile/R02", "note": "Portrait team select fits with the whole preview tub, stats in two columns."},
        {"shot": "high/mobile/R07", "note": "Ring ends near y=1120, controls start near y=1425: thumbs never cover the tub."},
        {"shot": "high/landscape/R04", "note": "Controls in the corners, tub clear; '10' tile clipped."},
        {"shot": "high/landscape/R02", "note": "Fourth card row and preview tub cut."}
      ]
    },
    "authenticity": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "crops/high/R03-player", "note": "Medical Arts setback tower at the head of Central Avenue."},
        {"shot": "high/desktop/R14", "note": "Quapaw dome, Fordyce and Hot Springs Mountain behind the Row."},
        {"shot": "high/desktop/R04", "note": "Central Avenue vista ends in shopfronts and ridge: the Arlington does not close it."},
        {"shot": "high/desktop/R16", "note": "Ring-around-the-tub rule, duck and flag; judges anonymous."},
        {"shot": "high/desktop/R19", "note": "Gulpha Creek ford reads as paving."}
      ]
    }
  },
  "ip": {
    "clean": true,
    "notes": "Rounded-cuboid heads with printed faces and no top stud (crops/high/R02-preview-captain, crops/high/R03-player), straight torsos, mitten fists (crops/high/R15-player). No LEGO name or logo in R01, R02, R18. Nobody reported a hit. Studs proposed for hats must stay on hats, never on heads."
  },
  "gaps": [
    {"id": "G-action-feedback", "category": "animation", "expectedGain": 1.0, "severity": 4, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15", "high/desktop/R17", "high/desktop/R19"], "benchmark": "2k-drive/drive-3.jpg", "fix": "In-world steam puffs off the rear wheels during a slide, coloured per charge tier (warm white, then hot orange), with a burst on release; camera roll of 2-3 degrees into the slide, a 4-degree FOV kick for 0.3 s on release, and a 0.15 s shake on fumbles and prop hits; fumble beads translucent, half the size and half the count, life at most 0.4 s; lamp posts and rails push the tub out with a bump instead of passing through it. Test: tier-coloured puffs in at least 3 frames of strips/high/R14; the ridge-top row in strips/high/R15 moves at least 6 px (strip scale) in some frame (now at most 3); no lamp post inside the player's ring in any R14 frame (now frame 8); bead pixels under 30% of the tub's bounding box in R15 frames 3-6."},
    {"id": "G-landscape-team-select", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R02"], "benchmark": "2k-drive/drive-2.jpg", "fix": "At 844x390 lay the 12 cards out as 4 columns by 3 rows (name plus division, two lines at most), use the empty band between the Water bar and the buttons for the details, and narrow the panel or offset the preview so the whole tub sits right of the panel edge. Test: in high/landscape/R02 all 12 cards and their labels are fully inside the panel (no 'Stock ·' cut) and the preview tub's leftmost pixel is at least 8 px right of the panel edge. Also lifts ui and typography."},
    {"id": "G-hud-overlaps", "category": "ui", "expectedGain": 0.5, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/mobile/R04", "high/landscape/R04", "high/desktop/R01", "high/mobile/R02"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Put the 10-gallon tile inside the gauge panel (or widen the panel by the tile plus 4 px); draw focus rings outside the stud tops; keep panel titles off the stud row. Test: at least 3 px of dark tile on both sides of the '10' glyphs on desktop, portrait and landscape (now the 0's right stroke ends at x=159 with road at x=160 on R04 row y=711); no focus-ring pixel inside a stud in high/desktop/R01 and R18; no title glyph over a stud in high/mobile/R02. Also lifts typography."},
    {"id": "G-tub-water-sheet", "category": "characters", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R02-preview-captain", "crops/low/R02-preview-captain", "crops/high/R15-player"], "benchmark": "2k-drive/drive-4.jpg", "fix": "Clip the water sheet to the tub's inner-rim profile (stencil, or a sheet built from the inner cross-section at fill height), clamp the slosh tilt so no edge passes the inner wall, set the fill height from the gauge (full sits just under the lip), and give it a lighter, more saturated blue with a meniscus highlight at the rim. Test: no water pixels outside the inner rim in crops/high and crops/low R02-preview-captain (now a triangle each side of the duck); water covers at least 70% of the visible interior in crops/high/R15-player at 37 gal."},
    {"id": "G-ao-closeup-banding", "category": "characters", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["crops/high/R02-preview-captain", "crops/high/R02-preview-rear", "crops/high/R15-player"], "benchmark": "builders-journey/bj-1.jpg", "fix": "In the High occlusion pass use a per-pixel rotated kernel from a 4x4 interleaved noise tile, a separable depth-aware blur in both axes, and a depth-aware bilinear upsample from half resolution. Test: column-mean residual sigma below 0.7 levels on the box (250,420)-(450,520) of crops/high/R02-preview-captain (now 3.02 at a 9.9 px period; Low 0.06), while the under-tub mean in high/desktop/R03 stays at or below 40 (now 29.7)."},
    {"id": "G-hero-facade-modelling", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R06", "high/desktop/R05"], "benchmark": "worlds/worlds-4.jpg", "fix": "Set each course's key-light azimuth so it rakes the main landmark faces (at least 30 degrees off the camera-facing normal), raise the key-to-ambient ratio, or add a cool sky fill from above, so walls that face different ways separate. Test: in high/desktop/R06, wall-only luminance (windows excluded) differs by at least 15 levels between the Arlington's main front and its tower sides (now 101.7 against 99.1 and 103.2; all planes 99-103)."},
    {"id": "G-judge-figures", "category": "readability", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R16", "strips/high/R16"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Two judges in black-and-white striped shirts, with a clipboard and a raised flag, standing at the road-side end of the stop line in front of the booth, plus a JUDGES sign on the booth. Test: both judges at least 40 px tall and unobstructed in high/desktop/R16 and visible in all 8 frames of strips/high/R16. Also lifts authenticity."},
    {"id": "G-world-surface-pass", "category": "materials", "expectedGain": 1.0, "severity": 4, "effort": "L", "workstream": "WS1", "bigLever": true, "evidence": ["high/desktop/R05", "high/desktop/R06", "high/desktop/R04", "high/desktop/R08", "high/desktop/R19"], "benchmark": "worlds/worlds-1.jpg; builders-journey/bj-3.jpg", "fix": "Big lever. (a) Ridge rings: shade each stepped column face from the course sun, add a vertical gradient from the haze colour at the base and aerial perspective toward the sky, jitter value 4% per 6 m column, and lower or push back the near ring on the Row so sky shows above the Fordyce and the Arlington; the silhouette stays as is. (b) Banks and shoulders: studded baseplate or stepped plates with a lit edge every 0.4 m of rise. (c) Windows: glazing with a sky Fresnel term and a one-plate recess. (d) Gulpha ford: trans-clear blue tiles over a visible bed, with foam plates at the edges. Test: texture-free non-sky share (9x9 sigma < 0.75) below 12% in high/desktop/R04, R05 and R06 (now 23.5/27.2/24.2%); no single RGB value over 2% of any day frame (now 17.9% in R05, 12.3% in R06); window pixels in R06 span at least 20 luminance levels (sampled windows now 35-40); R19 ford mean B at least R+15 (now 136,131,124). Also lifts scenery and lighting."},
    {"id": "G-dusk-sunset-sky", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R11", "high/desktop/R07", "high/mobile/R07"], "benchmark": "worlds/worlds-4.jpg", "fix": "A sun disc and glow band on the sky dome for sunset and a horizon glow for dusk, far rings tinted toward the glow, brick-plate clouds lit from the sun side, and a small halo on lamp globes. Test: in high/desktop/R11 the sun or glow is in frame and the band within 40 px above the horizon is at least 1.3x the zenith luminance (now about 1.19 on x=650); lamp globes in R07 carry a halo at least 1.5x the globe radius."},
    {"id": "G-tub-parts-and-hat-studs", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R03-player", "crops/high/R04-kart_3", "crops/high/R15-player", "crops/high/R03-player-rear"], "benchmark": "2k-drive/drive-4.jpg", "fix": "Build the tub from visible parts: a studded plate ring under the rolled lip, the team stripe as a raised tile with seams, and exposed studs on the tail plate; put 1-4 studs on each hat crown (helmet comb base, caps, cowboy and ranger hats), never on heads. Test: at least 3 part seams on the tub body in crops/high/R03-player and crops/high/R04-kart_3; studs on every hat in high/desktop/R03; the IP silhouette check still passes."},
    {"id": "G-pack-tub-separation", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["high/mobile/R07", "high/desktop/R12", "high/desktop/R04"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Give each rival tub within 25 m a slim team-colour band on its lip (20% emissive) and a team-colour contact ring at 60% opacity and 0.8x the player's ring width, so tubs read through the crews ahead. Test: in high/mobile/R07 and high/desktop/R12 every rival tub within 25 m shows at least 15 px of ring or lip, and the player's ring stays the brightest ring in the frame."},
    {"id": "G-near-occluders", "category": "readability", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R11", "high/desktop/R16", "high/desktop/R13", "high/desktop/R19"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Extend the near-hide rule to lamp posts and street furniture within 4 m of the camera, and hide any tree within 8 m whose screen bounds would cover more than 5% of the frame. Test: no single tree or prop covers more than 5% of high/desktop/R11, R13, R16 or R19 (critics measured 16-17.5% canopy in R11 and R19, 11.5% in R16). Gain lowered: no tub, pickup or road edge is hidden today."}
  ]
}
```
