# Advocate: loop 1, tier high

## Summary
Both critics are mostly right about where this build stands. The tubs and crews read as original plastic toys up close, but the world around them doesn't yet. I concede these defects in full:
- Painted tree and crowd sprites magnified near the camera (`high/desktop/R08`, `R10`, `R11`, `R18`).
- Painted facades.
- No slide spray or steam in any frame of `strips/high/R14`, in either tier.
- No judge figure at the judge stop.
- Blank torso backs.
- The phone team-select screen hides its tub.

Where the critics go wrong or too far:
1. **Glare.** Critic A says large planes "blow out to white" (`R17`, `R13`) and builds half a gap on it. Measured, the R17 plaza floor peaks at 171/255 (67%) and the R13 asphalt's 99th percentile is 174/255 (68%). A's own test for that gap (no R17 floor pixel above 95%) already passes.
2. **Hat teams.** A's "two campaign-hat teams" is wrong. In `high/desktop/R09` the white-shirt team wears dark-brown cowboy hats with creased crowns. The Steam Rangers wear tan flat-brim campaign hats over grey-blue shirts.
3. **Broken rim.** The broken tub rim appears only in the overhead `crops/high/R02-preview-captain`. The same tub shows a continuous lip with seated studs in `high/desktop/R02` and in three other close-ups.
4. **Typography.** A docks typography for the landscape timer overlap. The brief scores typography on desktop, where nothing is clipped, and A already charges that defect to mobile.
5. **Frame rate.** Critic B says screenshots can't establish frame rate. The brief's measured table gives the phone proxy a 66 fps minimum.
6. **Player marker.** A's player-marker gap isn't supported by its own benchmark. `drive-3` doesn't mark the player's car either; the chase framing does that job, and it does it here too.

Proposed total: **63.0** (critics 58.5 and 62.5, mean 60.5).

Method: I opened every frame, close-up and strip cited below at full size. Zoomed crops and luminance measurements were made from the captures in a temporary scratch folder, since removed. Benchmarks opened: `worlds-1`, `worlds-4`, `drive-3`, `drive-4`.

## Categories

### Characters: A 6.0, B 6.5 (mean 6.25), proposed 6.5
**Concede:**
- **Blank backs.** The torso backs are plain black slabs (`crops/high/R02-preview-rear`, `crops/high/R03-player-rear`). B is right that the chase camera mostly sees backs (`high/desktop/R04`, `R10`).
- **The R02 captain close-up is broken.** In `crops/high/R02-preview-captain` the rim breaks into sawtooth yellow triangles and the studs float as loose octagons above the lip.
- **Faceted tyre outlines** in `crops/high/R02-preview` (minor).
- **No mould lines.** The prints are basic next to `drive-4`.

**Rebut:**
- **The rim defect is confined to one overhead camera.** The same Engine Six tub has a continuous yellow lip with seated studs at turntable distance (`high/desktop/R02`) and in `crops/high/R03-player`, `crops/high/R04-player` and `crops/high/R15-player`. The other rims are clean: gold (`crops/high/R03-kart_5`), dark (`crops/high/R03-kart_1`) and teal-studded (`crops/high/R04-kart_3`). One of the 10 close-ups fails.
- **"No part seams anywhere" (A) is overstated.** The figures are separate bevelled torso, hip, arm and leg blocks, and their joints read as seams: the hip band and leg split in `crops/high/R03-player-rear`, and the hip line under the printed belt in `crops/high/R03-kart_1`. What's missing is mould lines, which belong to the 9 anchor.
- **The two hat teams are not "near-identical campaign-hat teams" (A).** This is plainly wrong. In `high/desktop/R09` the centre team (Steam Rangers) has tan flat-brim campaign hats, grey-blue shirts and an olive tub. The bottom-right team has dark-brown cowboy hats with creased crowns, white shirts and a bronze tub.

**Anchor 7 check:**
- **Met:**
  - Bevelled parts.
  - Printed faces with four expressions (`crops/high/R03-kart_1`, `R03-kart_5`, `R04-kart_3`).
  - Printed suspenders, collar and badge.
  - Studs on hats (chef-hat studs in `R03-kart_5`, beret stud in `R03-kart_1`) and on every tub rim and chassis plate.
  - Tubs built from recognisable parts: studded plate, hubbed tyres, two-piece duck.
  - Teams distinct at chase distance (`high/desktop/R12`: pink-antenna team against green-beret team).
- **Failed:** one close-up, and the backs.

This is already above `worlds-1` (6.5). 6.5 is A's 6.0 corrected for the hat error and the single-view rim.

### Materials: A 5.5, B 6.0 (mean 5.75), proposed 6.0
**Concede:**
- **Painted facades.** The Fordyce pattern in `high/desktop/R05` is a texture, the Arlington window grid in `R06` reads as noise, and no brick courses can be read at play distance in `R13`.
- **The sprites clash with the models** (`R08`, `R11`, `R18`). That is the 5-anchor clause word for word, and it caps this score.

**Rebut:**
- **"Large flat planes blow out to white" (A; `R13`, `R17`) is plainly wrong on measurement.**
  - In `high/desktop/R17`, the plaza floor between rows 560–800 and columns 760–1110 (HUD excluded) peaks at luminance 171/255. Across the whole floor, only 6 pixels exceed 235, and all of them are gold studs on the tub.
  - In `high/desktop/R13`, the asphalt at x 700–1280, y 330–800 has a 99th percentile of 174/255. Its only 10 pixels above 242 are on the white kerb line.
  - What R13 does show is lighter grey wedges with hard edges along mesh triangle boundaries. That is a faceting artifact, not overbright specular: a real defect, but a different one.
- **Studs as "ring-like stamped marks" (B; `R08`) is only partly true.** On the shaded green and grey faces at the bottom left of `high/desktop/R08`, each stud has a lit upper rim and a shadowed lower side, and reads as raised. Only in the sunlit band do the studs flatten to outlines. The bigger flaw on that slope is the hard triangle facets in the terrain's tone.
- **"Studs only on the ground" (A) is too broad.** It holds for the world, but studs are on every tub rim and chassis plate and on several hats (`crops/high/R03-kart_5`, `R03-kart_1`, `R04-kart_3`).
- **Neither critic credits the clear parts.** The tub water is see-through pale cyan, with the bowl interior visible through it (`crops/high/R02-preview-captain`, `high/desktop/R09`). That is a 7-anchor clause.

**Anchor 7 items visible:**
- Highlights that follow bevels (shoulders and heads in `crops/high/R02-preview-rear`, the bowl in `R03-kart_5`).
- Shaded studs near the camera (`R08`, `R10`, `R12`).
- Plate and tile seams (`R04` road plates, `R17` plaza tiles, `R12`).
- Clear parts.
- A brick-colour palette.

The sprites and facades hold it to 6.0.

### Scenery: A 5.5, B 5.0 (mean 5.25), proposed 5.5
**Concede:**
- Sprites near the camera (`R08`, `R10`, `R11`, `R18`).
- Painted boxes: the commercial blocks in `R13`, and the card-like plaza buildings in `R17`.
- Grey studded plate used as the mountain road (`R09`, `R10`).
- Bare terrain beside the Arlington, with fan-shaped shading (`R06`).
- Repeated crowd cards (`R05`, and the crowd rows in `strips/high/R14`).

**Rebut B's 5.0.** B scores exactly at the anchor-5 text, but two 7-anchor items are plainly visible:
- **Studded baseplate ground:** `high/desktop/R08`, `R12` and the R05 lawn.
- **Tile roads and sidewalks with moulded seams:** `R04`, `R12`, `R17`.

Each course also has set pieces:
- The Fordyce marquee (`R05`).
- The Arlington (`R06`).
- A lattice tower on the ridge (`R11`).
- A brick-course retaining wall on the switchback (`R08`).
- The plaza fountain (left edge of `high/landscape/R17`).

B's "flat architectural shell" is also overstated. `high/desktop/R05` has modelled window surrounds with sills and a projecting marquee with a zigzag valance.

### Lighting: A 6.0, B 6.0 (mean 6.0), proposed 6.5
**Concede:**
- No ambient occlusion at building bases (`R05`, `R13`) or at crew and tub joints.
- Dark crews lose limb separation at dusk (`high/desktop/R07`, `high/mobile/R07`).
- The R06 facade is evenly lit.
- The haze is thin at the far end of `R04`.

**Rebut:**
- **The hotspot and white-glare claims are wrong** (measurements under Materials). A cited them as lighting defects too.
- **Most 7-anchor clauses are visible:**
  - A soft key light from the shadow map, with filtered edges (`R03`, `R04`, `R13` long crew shadows, `R14`).
  - Contact shadows grounding every tub in every race frame (`R03`, `R04`, `R12`, `R17`).
  - Deliberate palettes: day blue in `R04`; rose dusk in `R07` with glowing globes and warm pools on the sidewalk; pink sunset in `R11`, with haze matched to the sky at the vanishing point.

Only crevice occlusion is wholly absent. That makes it 6.5, still below the sun glow of `worlds-4`.

### Animation: A 5.5, B 5.5 (mean 5.5), proposed 5.5
**Concede:**
- **No slide effects.** No spray, steam or charge colour appears in any frame of `strips/high/R14`. I zoomed every frame, checked `strips/low/R14` and zoomed the tub in `high/desktop/R14`: nothing in either tier.
- **Pose glitch.** One crew figure tips nearly horizontal in R14 frames 2–4.
- **No camera kick, and no water slosh.**
- **Crew clipping in `strips/high/R15`.** Frames 2, 6 and 7 show two same-team figures with equal-size heads fused side by side. `crops/high/R15-player` and frame 1 of `strips/high/R16` show the same kind of overlap.

**Rebut:**
- **A rival crew "runs straight through the player's crew" in `strips/high/R16` frames 4–8 (A).** The strip doesn't show that. The white rival figures are visibly larger, so nearer the camera, than the black crew they overlap. That is occlusion by a tub passing on the camera side, not interpenetration.

**Credit:**
- In `strips/high/R15` frames 4 and 8, the crew are spaced around the tub with limbs swinging at the joints, which is the 7-anchor articulation clause.
- In `strips/high/R16` the crew circle the tub while the bar fills.
- `high/desktop/R15` greys out the lost Bath item.

Half of anchor 7 is missing, so 5.5 stands.

### UI / HUD: A 6.0, B 6.5 (mean 6.25), proposed 6.5
**Concede:**
- Generic navy and orange web styling rather than brick, against `drive-2` (`R04`, `R18`, `R02`).
- Item labels about 10 px (bottom-left of `R04`).
- The gauge's "10" touches the panel edge.

**Rebut B's "no strong visual relationship between water, inventory and the central item slot".** In `high/desktop/R04` the water gauge and the Towel/Bath/Soap/Loofah inventory are stacked as one group at the bottom left. Only the active item slot sits top-centre, beside the coins.

**Anchor 7:**
- Clear hierarchy: met (A agrees).
- Consistent menus: met (`R01`, `R02` and `R18` share panel and button styling).
- Nothing overlapping on desktop: met (`R04`, `R16`, `R17`).
- Belongs to the brick world: not met.

### Typography: A 6.0, B 7.0 (mean 6.5), proposed 7.0
The brief says to score the high tier on desktop and use the phone frames for mobile and readability. A's largest typography deduction, the timer overprinted in `high/landscape/R04` and `R17`, is a phone defect A already charges under mobile, so it is counted twice.

On desktop:
- The two-face scale is clear (`R01`, `R18`).
- The open-zero numerals read at a glance (`R04` "0:07.00", the `R18` times).
- Nothing is clipped: the team copy wraps cleanly in `R02`, and `R04`, the R16 callout and `R18` are all clean.

**Concede:** the orphaned "Arkansas" on `R01` (and "Hot / Springs" in `high/landscape/R01`), and the ~10 px labels.

**Rebut:** "the 8-bit face clashes with the plastic world" is a theme preference that the 7 anchor doesn't ask for. A itself credits the scale.

### Readability: A 6.0, B 6.5 (mean 6.25), proposed 6.5
**Concede:**
- The pack ahead merges into backs and hats (`R04`).
- Dark crew at dusk (`R07`, `high/mobile/R07`).
- The sprite tree covers about 40% of `R11`.
- A rival is half cut off at the right edge of `R09`, under the minimap.
- The judge stop is marked only by a board and a line (`R16`).

**Rebut:**
- **"No player marker" (A).** `drive-3`, the readability-9 benchmark, has no marker on the player's car either. In every race frame the chase framing makes the player's tub the largest, centred object (`high/desktop/R04`, `R12`, `high/mobile/R04`, `high/mobile/R08`).
- **"Trees and overlapping crews hide much of the approaching bend" (B; `high/mobile/R08`).** The whole bend is traced by the white edge line and the yellow centre dashes across the right half of the frame. The trees sit above the horizon, off the road, and the pack is in the left lane.

The pickups read in every frame they appear in (`R10`, `R11`, `R17`), and the road edges are obvious throughout.

### Mobile: A 6.0, B 6.0 (mean 6.0), proposed 6.5
**Concede:**
- **Team select hides the tub.** `high/mobile/R02` covers it completely. `high/landscape/R02` shows only a wheel, one crew figure and the captain's head, with no bowl.
- **The landscape timer is overprinted by the gauge** (`high/landscape/R03`, `R04`, `R08`, `R17`).
- **The Steer pill is small,** about 70×22 CSS px.

**Rebut:**
- **The minimap is not "directly under the tub" (A).** It sits beside the tub without covering it: `high/landscape/R04` leaves a clear gap below the chassis, and in `high/landscape/R03` its tip only touches the crew's feet.
- **The landscape buttons are not "small" (B).** Item, Hop, Brake and Push are about 128×100 device px, about 64×50 CSS px at 2× (`high/landscape/R04`), above the 44 px touch guideline.
- **"Screenshots cannot establish frame rate" (B).** The brief measures swiftshader · low · mobile at a 66 fps minimum, and gpu · medium · mobile · 4× CPU at 138. The 30 fps clause is met.

**Anchor 7:**
- The controls never cover the tub in any race frame (`high/mobile/R04`, `R07`, `R08`, `R17`; `high/landscape/R03`, `R04`, `R08`, `R17`).
- Both orientations are framed on purpose for the title, race and results (`high/landscape/R01`, `high/landscape/R18`, `high/mobile/R18`), but not for team select.
- The phone proxy holds 30 fps.

### Authenticity: A 6.0, B 7.0 (mean 6.5), proposed 6.5
**Concede:**
- No judges (`R16`).
- The Arlington's window grid is noise (`R06`).
- No ford water or Goat Rock (`R09`).
- `R13` is a generic corner.
- The bathhouses are painted, not brick-built.

**Rebut B's "mountain courses are considerably more generic", in part:**
- `R11` puts a lattice observation tower on the ridge.
- `R08` shows the blue ridge panorama, pines and a stone retaining wall.

The real race is on screen in every race frame: the water line (the gauge's "10" mark), the towel, bath, soap and loofah, a duck and flag on every tub (`R04`, the close-ups), and the Rules of the Row task (`R16`). A's 6.0 underweights all this. B's 7.0 ignores the missing judges, which the anchor names.

## Facts plainly wrong
1. **A:** the R17 plaza floor "blows out to white". Its floor peaks at 171/255 (`high/desktop/R17`).
2. **A:** R13 has "glossy white sheen streaks". The asphalt's 99th percentile is 174/255, and the streaks are mid-grey triangle facets (`high/desktop/R13`).
3. **A:** the white-shirt team wears campaign hats. They are creased cowboy hats (`high/desktop/R09`).
4. **A:** "no part seams anywhere". The joints between separate bevelled parts are visible (`crops/high/R03-player-rear`).
5. **A:** a rival crew runs through the player's crew in `strips/high/R16`. The size difference shows occlusion.
6. **B:** screenshots can't establish frame rate. The brief's performance table measures it.
7. **B:** water, inventory and the item slot have no relationship. Water and inventory form one stacked group (`high/desktop/R04`).

## IP check
I agree with both critics: clean. Heads are rounded cubes, hands are mitten blocks and torsos are straight boxes (`crops/high/R02-preview`, `crops/high/R03-kart_5`). There is no LEGO name or logo in any capture.

## Gaps: adjusted severity and gain
Gains are per category and not additive across duplicates.

| Gap (critic) | Critic sev / gain | Advocate sev / gain | Why |
|---|---|---|---|
| G-sprite-foliage-crowds (A) | 4 / 1.0 | 4 / 1.0 | Concede (`R08`, `R10`, `R11`, `R18`). |
| G-facade-geometry (A) | 4 / 0.75 | 4 / 0.5 | `R05` already has modelled surrounds and a marquee. The real gap is brick courses and depth on the commercial blocks (`R13`, `R17`). Overlaps the sprite gap. |
| G-slide-effects-missing (A) | 4 / 0.75 | 4 / 0.75 | Concede: nothing in either tier of R14. |
| G-ao-and-highlights (A) | 3 / 0.75 | 3 / 0.5 | The occlusion half stands. The highlight half is wrong: R17 already passes A's own 95% test, and R13's streaks are mesh faceting (fix normals or tessellation), not specular strength. |
| G-crew-separation (A) | 3 / 0.5 | 3 / 0.25 | R15 own-crew fusion is real. The R16 rival claim isn't shown. |
| G-tub-rim-closeup (A) | 3 / 0.5 | 3 / 0.5 | Concede. It appears in one overhead close-up only. |
| G-figure-backs-seams (A) | 3 / 0.5 | 3 / 0.5 | Backs concede. "No seams" is overstated. |
| G-landscape-hud-overlap (A) | 3 / 0.5 | 3 / 0.5 | The timer overlap is real. The minimap doesn't cover the tub. |
| G-team-select-phone (A) | 3 / 0.5 | 3 / 0.5 | Concede. |
| G-judges-missing (A) | 3 / 0.5 | 3 / 0.5 | Concede. |
| G-player-marker (A) | 3 / 0.5 | 2 / 0.25 | `drive-3` has no player marker; chase framing does the job. The hat-recolour sub-fix rests on a wrong premise. Only the dusk rim light stands. |
| G-hud-brick-theme (A) | 2 / 0.5 | 2 / 0.5 | Concede. |
| G-type-polish (A) | 2 / 0.5 | 2 / 0.25 | The orphan fix is trivial. The face swap is taste. |
| G-studded-roads (A) | 2 / 0.25 | 2 / 0.25 | Concede. |
| G-sprite-world (B) | 5 / 1.5 | 4 / 1.0 | Duplicate of G-sprite-foliage-crowds. Severity 5 is reserved for IP-level issues, and sprites alone don't lift scenery to 7. |
| G-tub-rim (B) | 4 / 0.5 | 3 / 0.5 | It appears in one of the 10 close-ups and nowhere at play distance. |
| G-landmark-depth (B) | 4 / 1.0 | 4 / 0.5 | Duplicate of G-facade-geometry. |
| G-mobile-preview (B) | 4 / 1.0 | 3 / 0.5 | Duplicate of G-team-select-phone. It affects one menu screen, and the race frames meet the controls clause. |
| G-action-feedback (B) | 4 / 1.0 | 4 / 0.75 | Duplicate of G-slide-effects-missing. Nothing renders at all, so the cause is a missing render, not weak staging. |
| G-terrain-parts (B) | 3 / 0.5 | 2 / 0.25 | The studs read as raised on shaded faces. The visible flaw is triangle-faceted terrain tone. |
| G-dark-part-separation (B) | 3 / 0.5 | 3 / 0.25 | Real at dusk (`R07`). Overlaps G-ao-and-highlights. |
| G-hud-hierarchy (B) | 3 / 0.5 | 2 / 0.25 | Water and inventory are already grouped. Only the label size stands. |

```json
{
  "role": "advocate",
  "loop": 1,
  "tier": "high",
  "scores": {
    "characters": {
      "score": 6.5,
      "confidence": 0.7,
      "evidence": [
        {"shot": "crops/high/R03-kart_5", "note": "Printed faces with expression, printed uniform, studded chef hats, continuous gold rim with seated studs, studded chassis, two-piece duck"},
        {"shot": "crops/high/R03-player", "note": "Same Engine Six tub as the R02 captain crop: continuous yellow lip, studs seated; the sawtooth rim is confined to one overhead camera"},
        {"shot": "crops/high/R02-preview-captain", "note": "Conceded: rim breaks into flat triangles and studs float in this overhead close-up"},
        {"shot": "crops/high/R03-player-rear", "note": "Conceded: blank backs. Separate bevelled torso, hip and leg parts with visible joints, so 'no seams anywhere' is overstated"},
        {"shot": "high/desktop/R09", "note": "Steam Rangers (tan flat-brim campaign hats, grey-blue shirts) vs a white-shirt team in dark-brown creased cowboy hats; not near-identical"}
      ]
    },
    "materials": {
      "score": 6.0,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R08", "note": "Studs on shaded faces have a lit rim and shadowed side; the flaw is triangle-faceted terrain tone"},
        {"shot": "high/desktop/R17", "note": "Plaza floor peaks at 171/255 luminance; tile seams readable through the sheen; no white blowout"},
        {"shot": "high/desktop/R13", "note": "Asphalt p99 174/255; lighter grey wedges follow mesh triangles (faceting, not glare)"},
        {"shot": "crops/high/R02-preview-captain", "note": "See-through tub water: clear part reads as transparent"},
        {"shot": "high/desktop/R05", "note": "Conceded: patterned facade is a painted texture; brick courses not readable"},
        {"shot": "high/desktop/R11", "note": "Conceded: sprite trees in a different style from the models"}
      ]
    },
    "scenery": {
      "score": 5.5,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/desktop/R12", "note": "Studded baseplate verge and seamed tile road: two 7-anchor items B's 5.0 ignores"},
        {"shot": "high/desktop/R05", "note": "Modelled window surrounds with sills and a projecting marquee; painted facade pattern; repeated crowd cards"},
        {"shot": "high/desktop/R11", "note": "Lattice tower set piece on the ridge; conceded sprite tree covering the right of the frame"},
        {"shot": "high/desktop/R10", "note": "Conceded: mountain road is grey studded plate; sprite trees"}
      ]
    },
    "lighting": {
      "score": 6.5,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R07", "note": "Deliberate rose dusk palette; lamp globes glow with warm sidewalk pools; conceded dark crew loses separation"},
        {"shot": "high/desktop/R11", "note": "Pink sunset with haze matched to the sky at the vanishing point"},
        {"shot": "high/desktop/R13", "note": "Soft-edged shadow-map key light; long crew shadows ground the tubs; no white sheen (p99 68%)"},
        {"shot": "high/desktop/R17", "note": "Contact shadows ground the tub; floor max 67% luminance, A's hotspot claim wrong"},
        {"shot": "high/desktop/R05", "note": "Conceded: no occlusion at building bases"}
      ]
    },
    "animation": {
      "score": 5.5,
      "confidence": 0.7,
      "evidence": [
        {"shot": "strips/high/R14", "note": "Conceded: tub slides but no spray, steam or charge colour in any frame; confirmed in strips/low/R14"},
        {"shot": "strips/high/R15", "note": "Crew spaced around the tub with rigid joint swings (frames 4, 8); conceded same-team fusion in frames 2, 6, 7"},
        {"shot": "strips/high/R16", "note": "Crew circle while the bar fills; frames 4-8 white rivals are nearer the camera (larger), so occlusion, not pass-through"}
      ]
    },
    "ui": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Clear hierarchy; water gauge and inventory stacked as one group bottom-left; conceded ~10 px labels"},
        {"shot": "high/desktop/R18", "note": "Clean results, player row highlighted, HUD hidden; menus consistent with R01 and R02"},
        {"shot": "high/desktop/R02", "note": "Tub framed on the right; conceded generic navy and orange styling"}
      ]
    },
    "typography": {
      "score": 7.0,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R18", "note": "Clear display and UI scale; open-zero numerals in the times column"},
        {"shot": "high/desktop/R04", "note": "Timer '0:07.00' reads at a glance; nothing clipped on desktop"},
        {"shot": "high/desktop/R01", "note": "Conceded: subtitle orphans 'Arkansas'"},
        {"shot": "high/landscape/R04", "note": "Timer overprint is a phone defect already charged under mobile; the brief scores typography on desktop"}
      ]
    },
    "readability": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Player tub is the largest centred object (as in drive-3, which has no player marker); road edges obvious; conceded pack merges ahead"},
        {"shot": "high/mobile/R08", "note": "Bend fully traced by the edge line and yellow dashes; trees sit above the horizon off-road"},
        {"shot": "high/desktop/R10", "note": "Soap-bubble pickups read clearly"},
        {"shot": "high/desktop/R07", "note": "Conceded: dark crew on a dark road at dusk"}
      ]
    },
    "mobile": {
      "score": 6.5,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/mobile/R04", "note": "Controls never cover the tub; portrait framed on purpose"},
        {"shot": "high/landscape/R04", "note": "Buttons about 64x50 CSS px; minimap below the tub with a gap; conceded timer overprinted by the gauge"},
        {"shot": "high/landscape/R18", "note": "Compact landscape results fit"},
        {"shot": "high/mobile/R02", "note": "Conceded: team select hides the tub"},
        {"shot": "high/landscape/R02", "note": "Conceded: only a wheel, one crew figure and the captain's head visible"}
      ]
    },
    "authenticity": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R06", "note": "Arlington twin towers recognisable; conceded noisy window grid"},
        {"shot": "high/desktop/R05", "note": "Fordyce colours, pattern and marquee recognisable"},
        {"shot": "high/desktop/R11", "note": "Lattice tower on the ridge gives the mountain course a local landmark"},
        {"shot": "strips/high/R16", "note": "Rules of the Row task shown; conceded no judges"},
        {"shot": "high/desktop/R09", "note": "Conceded: no ford water or Goat Rock"}
      ]
    }
  },
  "ip": {"clean": true, "notes": "Agree with both critics: rounded-cube heads, mitten block hands, straight box torsos; no LEGO name or logo in any capture."},
  "gaps": [
    {"id": "G-sprite-foliage-crowds", "category": "scenery", "expectedGain": 1.0, "severity": 4, "effort": "L", "workstream": "WS5", "evidence": ["high/desktop/R11", "high/desktop/R08", "high/desktop/R10", "high/desktop/R18"], "benchmark": "worlds-1", "fix": "Replace the painted trees with instanced brick-built trees and the crowds with instanced brick figures that reuse the crew parts. Interim: no sprites within 15 m of the camera, and alpha-to-coverage. Test: no sprite texel magnified above 1:1 in R08 or R11.", "note": "Conceded as stated."},
    {"id": "G-facade-geometry", "category": "scenery", "expectedGain": 0.5, "severity": 4, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R13", "high/desktop/R17", "high/desktop/R05"], "benchmark": "worlds-1", "fix": "Give the commercial blocks (R13, R17) inset window frames, cornices, real depth and readable brick courses. R05 already has modelled surrounds and a marquee. Test: R13 window reveals cast shadow.", "note": "Gain cut: partly present on R05, and not additive with the sprite gap."},
    {"id": "G-slide-effects-missing", "category": "animation", "expectedGain": 0.75, "severity": 4, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/low/R14", "high/desktop/R14"], "benchmark": "drive-3", "fix": "Check that the slide spray and steam emitters spawn in the capture and are not culled. Puffs at least 20 px at 1280 behind the rear wheels, tinted by charge stage; +3 degree FOV kick on release. Test: R14 strip frames 3-8 show particles.", "note": "Conceded; nothing in either tier."},
    {"id": "G-ao-and-highlights", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R05", "high/desktop/R13"], "benchmark": "worlds-4", "fix": "Add SSAO or baked vertex AO on building bases and figure joints. Fix the R13 road streaks by smoothing normals or raising tessellation, not by clamping specular. The R17 'no floor pixel above 95%' test already passes (floor max 67%).", "note": "Occlusion conceded; the highlight blowout claim is factually wrong, and the R13 cause is mesh faceting."},
    {"id": "G-crew-separation", "category": "animation", "expectedGain": 0.25, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R15", "crops/high/R15-player"], "fix": "Offset the circling crew by 360/n degrees on a radius wider than two body widths. Test: no two same-team figures overlap in any R15 strip frame.", "note": "R15 own-crew fusion conceded; the R16 rival pass-through is occlusion (nearer, larger figures)."},
    {"id": "G-tub-rim-closeup", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R02-preview-captain"], "benchmark": "drive-4", "fix": "Build the rim as one bevelled lathe ring, seat the studs on its top normal and bevel the water edge. Test: the captain crop shows a continuous lip with every stud touching it.", "note": "Conceded; confined to the overhead camera (rim intact in R02 desktop, R03-player, R04-player, R15-player)."},
    {"id": "G-figure-backs-seams", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R02-preview-rear", "crops/high/R03-player-rear"], "benchmark": "drive-4", "fix": "Print the torso backs (crossed suspenders, team number); add mould-line detail; 16+ tyre segments.", "note": "Backs conceded; part seams already read at the joints."},
    {"id": "G-landscape-hud-overlap", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R04", "high/landscape/R17", "high/landscape/R03"], "fix": "Leave an 8 px gap between the timer and the water gauge. Optionally move the minimap off the bottom centre. Test: no two HUD bounding boxes intersect.", "note": "Timer overprint conceded; the minimap sits beside the tub without covering it."},
    {"id": "G-team-select-phone", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["high/mobile/R02", "high/landscape/R02"], "fix": "Portrait: tub preview in the top 35% above a scrolling grid. Landscape: grid and preview split 55/45. Test: the whole tub is visible in both captures.", "note": "Conceded."},
    {"id": "G-judges-missing", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["strips/high/R16", "high/desktop/R16"], "fix": "Place 1-2 brick judges with clipboards at each judge stop, with a check gesture when the task completes.", "note": "Conceded."},
    {"id": "G-player-marker", "category": "readability", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R07", "high/mobile/R07"], "benchmark": "drive-3", "fix": "Add a dusk rim light on the player's crew. Drop the campaign-hat recolour: R09 shows cowboy against campaign hats.", "note": "drive-3 has no player marker; chase framing makes the player's tub the largest centred object (R04, R12)."},
    {"id": "G-hud-brick-theme", "category": "ui", "expectedGain": 0.5, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/desktop/R18"], "benchmark": "drive-2", "fix": "Style the HUD panels as bevelled tiles with a stud row and the buttons as 1x4 bricks; item labels at least 12 px at 1280.", "note": "Conceded."},
    {"id": "G-type-polish", "category": "typography", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R01"], "fix": "Use text-wrap: balance on the subtitle. The display-face swap is optional taste.", "note": "Orphan conceded; the 7 anchor doesn't require a theme-matched face."},
    {"id": "G-studded-roads", "category": "scenery", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R10"], "fix": "Use smooth or dirt-coloured tiles on drivable surfaces, keep studs off-road, and show water at the Gulpha ford.", "note": "Conceded."},
    {"id": "G-sprite-world", "category": "scenery", "expectedGain": 1.0, "severity": 4, "effort": "L", "workstream": "WS5", "evidence": ["high/desktop/R04", "high/desktop/R08"], "benchmark": "worlds/worlds-1.jpg", "fix": "Replace foreground tree and crowd cards with dimensional toy assets. Verify R04/R08 have no enlarged painted silhouettes.", "note": "Duplicate of G-sprite-foliage-crowds; severity 5 is reserved for IP-level issues; sprites alone don't lift scenery to 7."},
    {"id": "G-tub-rim", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R02-preview-captain"], "benchmark": "2k-drive/drive-4.jpg", "fix": "Build a closed rim of consistent thickness with every stud seated. Verify the captain crop.", "note": "Duplicate of G-tub-rim-closeup; one close-up of 10, rim intact at play distance."},
    {"id": "G-landmark-depth", "category": "scenery", "expectedGain": 0.5, "severity": 4, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06"], "benchmark": "worlds/worlds-1.jpg", "fix": "Add dimensional window surrounds, cornices, roof courses and modular wall parts. Verify oblique views show depth.", "note": "Duplicate of G-facade-geometry; R05 already has surrounds and a marquee."},
    {"id": "G-mobile-preview", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["high/mobile/R02", "high/landscape/R02"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Reserve space for the whole selected tub and crew in both phone orientations.", "note": "Duplicate of G-team-select-phone; one menu screen."},
    {"id": "G-action-feedback", "category": "animation", "expectedGain": 0.75, "severity": 4, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/low/R14"], "benchmark": "2k-drive/drive-3.jpg", "fix": "First make the slide effects render at all (none appear in either tier); then stage spray, steam growth and release so they're distinguishable in the strip; add water response.", "note": "Duplicate of G-slide-effects-missing; the cause is a missing render, not weak staging."},
    {"id": "G-terrain-parts", "category": "materials", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R08"], "benchmark": "worlds/worlds-1.jpg", "fix": "Remove the triangle-faceted tone on terrain slopes (smooth normals, or discrete stepped plates) and keep stud scale consistent.", "note": "Studs read as raised on shaded faces; the visible flaw is facet tone."},
    {"id": "G-dark-part-separation", "category": "lighting", "expectedGain": 0.25, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/mobile/R07"], "benchmark": "builders-journey/bj-1.jpg", "fix": "Tune ambient fill and add a rim term so black uniforms keep separate limbs at dusk.", "note": "Real at dusk; overlaps G-ao-and-highlights."},
    {"id": "G-hud-hierarchy", "category": "ui", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R04"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Set a minimum label size (12 px at 1280).", "note": "Water and inventory are already one stacked group; only the label size stands."}
  ]
}
```
