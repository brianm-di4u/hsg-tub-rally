# Judge ruling: loop 5, high tier

Paths are relative to `screenshots/review-loop-5/`. I measured pixels with PIL on the PNGs. Luma is 0.299R + 0.587G + 0.114B. Contrast ratios use WCAG relative luminance.

## Summary
**Verdict: continue.** My final total is **66.0**. Six categories are still below their gate of 7: materials, scenery, lighting, animation, readability and mobile. Characters, UI and typography sit at the gate. Authenticity (6.5) passes its gate of 6.

**Arithmetic checks**
- **Critic A:** the JSON sums to 66.0. The prose states no total, and its per-category scores match the JSON.
- **Critic B (Codex):** the JSON sums to 66.0, but the prose says "Total: 66.5/100". Its per-category prose scores match the JSON (7, 6.5, 6, 6.5, 6, 7, 7, 6.5, 6.5, 7), so the stated total is an addition error. The JSON stands.
- **Prosecutor:** 62.5 in the JSON, 62.5 in the prose.
- **Advocate:** 67.0 in the JSON, 67.0 in the prose.
- **Both of the last two** quote a critic mean of 66.25. That is wrong: their own per-category means sum to 66.0, so they probably carried Codex's total over.
- **Range:** every prosecutor and advocate proposal is within ±1 of the critic mean.

**Disagreements.** No category has the critics more than 1.0 apart; the largest gap is 0.5, on scenery and authenticity. The prosecutor and advocate are exactly 1.0 apart on animation, and I opened all three strips to settle it.

**A/B validity.** I checked four pairs: `ab/high-desktop-R04`, `ab/high-desktop-R05`, `ab/high-desktop-R11` and `ab/crop-R02-preview-captain`.
- One half of each matches this loop's High capture to within a mean absolute difference of 1.0–1.4 levels, after resizing.
- Neither half is closer to the Low capture (12–43 levels away) than to the High one.
- So no pair set is shown to be invalid, and I set no `abWeight` void.

## Category rulings

### Characters: 7.0 (all four said 7.0)
**What I checked**
- `crops/high/R02-preview-captain`: printed shouting and grinning faces, the hydrant badge, and a deep-blue water sheet with the duck floating in it.
- `crops/high/R15-player`: two moulded studs on the helmet and mitten fists.
- `crops/high/R03-kart_1`: the printed Trail Shredders uniform.
- `crops/high/R03-player-rear`: bare tan backs of heads.

**Disputes**
- **Interior-wall ripple (`R02-preview-captain`): real, close-up only.** Along y 480–500, x 200–340, luma steps by 5–10 levels (for example 161→170→158 and 165→154).
- **Grey smear "at rest" (Critic A): right for R03, wrong for R04.**
  - `crops/high/R03-kart_5` is the countdown (timer 0:00.00, READY). Banded grey streaks sit under the chassis: luma 111 at (820,650), against a nearby median of 65–70. That is a particle defect, not an asset defect.
  - `crops/high/R04-player` is mid-race (0:07.00), so its dust is correct. The advocate is right on this half.
- **Card through the wrist (prosecutor): not score-moving.** At 2.5× in `crops/high/R02-preview-rear`, the card reads as gripped, with slight interpenetration at the cuff.
- **"Bowl is one moulded shell" (Codex): the advocate is right.** In `crops/high/R02-preview` the rim ring, raised stripe tile, claw feet and base plate read as an assembly.

**Score.** It holds the 7 anchor. The bare rear heads and the close-up ripples keep it off 7.5.

### Materials: 6.5 (critics 6.5 / 6.5, prosecutor 6.0, advocate 6.5)
**Disputes**
- **Canopy studs: Critic A was wrong.** He said the canopies have "no studs or highlights". At 2–2.5× zoom, the canopy tops carry shaded studs with specular specks in `high/desktop/R05` (600–860, 590–800) and `high/desktop/R09` (820–1240, 360–620). The advocate is right.
- **Canopy sides: the prosecutor is right.** In `high/desktop/R10`, the patch at 1140–1260, 290–320 is flat: luma 78–79, minimum 68.5, with no edge highlight.

**Conceded on all sides.** The facades are textures on flat walls (`high/desktop/R05`, `R13`), and the ridges are flat colour.

**Credit.** The hero assets read as convincing ABS plastic (`crops/high/R02-preview-captain`, `crops/high/R15-player`).

**Score.** The prosecutor's area-weighting points the right way. But his "most of every frame reads at 5" ignores the studded canopies, the studded baseplates and the terraced bank plates (`high/desktop/R08`), which now cover most of the ground near the road. Below `worlds-1`, but not by a full point.

### Scenery: 6.5 (A 6.5, Codex 6.0, prosecutor 6.0, advocate 6.5)
**Disputes**
- **Vegetation variety: the advocate is right.**
  - `high/desktop/R09` shows broadleaf trees at the left edge, an orange autumn tree (220–280, 187–230), and red and pink flowers.
  - `high/desktop/R12` mixes broadleaf trees, conifers, autumn trees, shrubs and rocks.
  - Codex's "lacks varied vegetation" is wrong. Critic A's "one conifer model everywhere" is overstated, though that one conifer does repeat dozens of times in R09.
- **The ridge walls are as bad as the prosecutor says.**
  - The left third of `high/desktop/R06` (20–200, 300–420) is (56,84,62), luma 73. The grass in front of it is luma 111. A distant wall darker than the foreground reads as a sheer cliff.
  - The outer ring in `high/desktop/R05` (luma 207) is brighter than the sky (201).
- **Near-canopy coverage reproduces.** Green-pixel share is about 24% of `high/desktop/R11`, 15% of `R19` and 12% of `R08`.
- **The crowd kit does clash with the glossy crews** (`high/desktop/R13`).
- **The terraced banks are real terrain transitions** (`high/desktop/R08`).

**Score.** Near the road, the 7 anchor is met: baseplate ground, tile roads, brick buildings, trees and props. The backdrops, the near-camera slabs and the crowd kit hold it at 6.5. Codex's 6.0 rested partly on the contradicted vegetation claim. The prosecutor's 6.0 counts the haze, which I score under lighting.

### Lighting: 6.5 (critics 6.5 / 6.5, prosecutor 6.0, advocate 6.5)
**Haze: the prosecutor is right, measured.**
- In `high/desktop/R05` the nearest ridge (400–560, 220–260) is luma 78.5. A tree about 50 m away is luma 74, and the sky is 201. The ridge has no aerial haze.
- In R05 the outer ring is 207, brighter than the sky. In `high/desktop/R17` a ring at 200–280, 160–220 is 215 against a sky of 207.
- So "haze matched to the sky" fails. The advocate's "ridges hazed to the sky colour" only describes outer rings, and those overshoot the sky.

**Sunset (`high/desktop/R11`).**
- 43% of the central frame is below luma 40, which reproduces the advocate's 40%. The near-right canopy is (22,33,19), luma 28.
- The advocate's "sunlit far road luma 110" is inflated. His box (560–620, 320–360) contains two item orbs (95th-percentile luma 216). Clean far-road patches (620–660, 300–320) have a median luma of 84.
- So a weak warm key does exist. The main defect is fill and exposure: his diagnosis stands, his number doesn't.

**Credits verified**
- Dusk lamp pools in `high/desktop/R07` (17% below luma 40).
- Buff Row fronts in `high/desktop/R06`.
- The contact shadow in `crops/high/R02-preview`.
- Soft tree shadows in `high/desktop/R08`.

**Score.** Two clauses of the 7 anchor fail measurably (haze and sunset) and the rest are met, which puts it at 6.5, not 6.0.

### Animation and feel: 6.0 (critics 6.0 / 6.0, prosecutor 5.5, advocate 6.5)
**The advocate is right about spill.**
- `strips/high/R15`: in frame 2 the beads bunch above the tub rim, and the gauge drops 37→36 at frame 3.
- `strips/high/R16`: frame 4 has a splash with a ripple ring and a wet patch that last to frame 7, and the gauge drops 40→39.
- `strips/high/R14`: the gauge goes 41→40→39 at frames 6–7.
- Spray colour shifts measurably: R−B goes from −42 at frame 3 to −13 at frame 8.
- So Critic A's "no water slosh in any strip" is wrong for spill. A tilting water surface is still not visible.

**The prosecutor is right about the slide.**
- No R14 frame has orange spray. The 20–147 orange-hue pixels in each frame all lie on the player ring, at frame-local y 201–238.
- `high/desktop/R17` shows "HOT STEAM!" with 32 orange pixels in a 400×320 box round the tub, none of them steam.
- `high/desktop/R19` shows "WARM STEAM" over about ten 2–4 px dots.
- In R14 frame 8 the tub has climbed the pavement, with a lamp post inside its ring.

**Score.** The circling and the splashes meet the 7 anchor. The slide and boost feedback is weak and contradicts its own callouts, and slosh is half shown.

### UI / HUD: 7.0 (critics 7 / 7, prosecutor 6.5, advocate 7)
- **Overlaps.** The prosecutor's case rests on the phone overlaps. The critic brief scores UI on desktop and gives the phone frames to mobile. On desktop nothing overlaps (`high/desktop/R04`, `R17`), so I count the overlaps once, under mobile.
- **Style split: verified.**
  - At 3× in `high/desktop/R04`, the gauge tile is translucent grey with no dark outline, while the checklist and lap tiles have one.
  - The minimap is a bare line.
  - The teal callouts (`R17`, `R19`) differ from the studded slate banner in `R16`.
- **Menus:** consistent and brick-built (`high/desktop/R01`, `R02`, `R18`).

**Score.** At the anchor, with a polish gap.

### Typography: 7.0 (critics 7 / 7, prosecutor 6.5, advocate 7)
- **Item count: verified.** On desktop, "x3" is about 8 px tall at 613–628, 50–58, and its "3" touches the orb rim. In `high/mobile/R17` the "3" merges into the rim.
- **Card wraps: verified** ("Traditional · / locked" in `high/landscape/R02` and `high/mobile/R02`).
- **What holds.** The display and UI faces form a clear scale (`high/desktop/R01`, `R18`), and the main numerals read at a glance ("8TH", "0:07.00" in `R04`).

**Score.** One small clipped count doesn't sink the anchor. The prosecutor rightly called this his weakest charge.

### Readability: 6.5 (all four said 6.5)
- **Player ring in R19: Critic A was wrong.** He said it "nearly vanishes". A scan across the ring at x 612 and 640 in `high/desktop/R19` gives:
  - ring (192,162,103), dark outline (60,51,41), adjacent path in the tub's shadow (96,78,57);
  - ring against path about 3.3:1.

  The advocate is right.
- **Orphan ring: verified** at the bottom of `high/desktop/R19` and `low/desktop/R19`. A gold arc and beads draw with no tub.
- **Pack merge at distance: verified** (`high/desktop/R04`, `R07`).
- **Trail Shredders colour key: verified.** The swatch is (240,127,34) in `high/landscape/R02`, but the ring is (114,170,56) in `high/desktop/R08`.

### Mobile: 6.5 (critics 6.5 / 6.5, prosecutor 6.0, advocate 6.5)
**Framing problems verified**
- **Portrait:** the lap tile covers the top ~30 device px (~15 CSS px) of the gauge, and the item orb overlaps the bottom of the place tile (`high/mobile/R04`, `R17`).
- **Landscape race frames:** the map crosses the place tile in R04, R07 and R17, and touches it in R08. The prosecutor's "all four" is slightly overstated.
- **Landscape team select:** it shows only a sliver of the crew at x ≈ 1280–1360 and hides the tub (`high/landscape/R02`).

**What passes**
- The controls never cover the tub (`high/mobile/R04`, `high/landscape/R04`).
- The phone proxies hold: 241 fps minimum with 4× CPU throttling, 54.7 fps minimum on SwiftShader.
- Portrait team select is framed with care (`high/mobile/R02`).

**Score.** Two of the anchor's three clauses are met. Framing fails in both orientations, but the solid perf and control placement keep it at 6.5, not 6.0.

### Authenticity: 6.5 (A 6.5, Codex 7, prosecutor 6.5, advocate 7)
**Credits verified**
- The Fordyce (`high/desktop/R05`) and the Arlington (`high/desktop/R06`).
- The domed bathhouse on Central (`high/desktop/R03`, 385–440, 195–240).
- The race kit: gauge and checklist (`R04`), judge stop (`R16`), water and CLEAN in the results (`R18`).

**The advocate's lattice tower in R11 is real.** At about 430–470, 0–120 in `high/desktop/R11`, a lattice steel tower is visible but mostly hidden behind conifers.

**Against**
- The mountains don't read as the Ouachitas: a sheer cliff in `R06`, and pale walls brighter than the sky in `R05` and `R17`.
- Goat Rock reads as brick masonry towers (`R09`).
- Bridge Street is generic (`R13`).
- The judge is a background crowd figure (`R16`).

**Score.** The mountain clause of the 7 anchor fails in most frames, so 6.5. The gate (6) is met.

## IP ruling
**LEGO: clean.**
- Heads are rounded cuboids, hands are mitten fists and torsos are straight (`crops/high/R15-player`, `crops/high/R03-player-rear`, `crops/high/R02-preview-rear`).
- Studs appear on helmets only, and stud tops are plain.
- There is no LEGO name or logo in `R01`, `R02` or `R18`.
- So there is no severity-5 characters gap.

**Outside the gate: a real likeness to Minecraft's default character.** It shows on the `high/desktop/R13` spectator (left edge, about x 0–140, y 320–500) and in `strips/high/R15` frame 1:
- square tan head
- flat brown hair cap
- cyan tee
- dark trousers

The gate as written covers LEGO and minifigures only, so this isn't a gate hit. It is still a third-party likeness, so I filed it as G-crowd-kit-restyle at severity 4 and effort S, and recommend doing it this loop whatever its rank.

## Ranked gaps
I ranked by gain × weight ÷ effort cost, using the protocol's weights. I break ties by severity.

1. **G-phone-hud-dock** (mobile, WS6, S, severity 3, +0.5)
   - **Problem.** HUD tiles collide in every phone race frame.
   - **Fix.** In portrait, stack the lap tile, gauge and checklist in one column with 8 CSS px gaps, and move the orb and coin chip to a row below the place tile. In landscape, dock the map at least 8 CSS px below the place tile.
   - **Test.** No two HUD bounding boxes intersect in `high/mobile/R04`, `R07`, `R08`, `R17` or `high/landscape/R04`, `R07`, `R08`, `R17`.
2. **G-near-camera-fade** (readability, WS1, S, severity 3, +0.5)
   - **Problem.** Near canopies aren't faded the way trunks and street furniture are, and a faded tub's ring and particles still draw.
   - **Fix.** Fade canopies in the chase near volume. Fade a tub's ring and particles together with its tub.
   - **Test.** No single canopy covers more than 8% of `high/desktop/R08`, `R11` or `R19` (now about 12%, 24% and 15%). No ring arc without its tub in `high/desktop/R19` or `low/desktop/R19`.
3. **G-backdrop-haze-ramp** (lighting, WS1, S, severity 3, +0.5)
   - **Fix.** Apply per-ring distance fog, and clamp the farthest ring below sky luma.
   - **Test.** In R05 and R06, the nearest ridge is at least 1.25× the mid-distance tree luma (now 78.5 against 74) and at most 0.85× the sky. Each further ring is lighter than the one in front of it and darker than the sky (now 207 against a 201 sky in R05, 215 against 207 in R17).
4. **G-sunset-fill** (lighting, WS1, S, severity 3, +0.5)
   - **Fix.** Raise the sunset preset's sky fill and add a warm rim or fill light on figures and canopies, leaving dusk untouched. This merges Critic A's key-light gap and Codex's shadow-fill gap. The key-light test (sunlit road luma ≥ 80) already passes at about 84, so I replaced it.
   - **Test.** At most 15% of R11's central frame is below luma 40 (now 43%). The near-right canopy is at least luma 45 (now 28). Clean sunlit road is at least luma 95 (now about 84). R07 still has at least 10% below luma 40 (now 17%).
5. **G-crowd-kit-restyle** (scenery, WS5, S, severity 4, +0.25)
   - **Fix.** Give spectators and the judge the crew's glossy plastic material and printed faces. Add three or more hair and hat variants made from crew parts. Ban the cyan tee + brown hair cap + dark trousers combination.
   - **Test.** Crowd heads in R13 and R15 show a specular highlight, and no crowd figure in any capture uses that combination.
6. **G-steam-charge-fx** (animation, WS3, M, severity 4, +0.5)
   - **Fix.** Emit puffs from the rear wheel contacts, growing with charge: blue-white at the start (already there), white at warm, orange at hot. Fire the WARM and HOT callouts only together with that visual and a release burst.
   - **Test.**
     - In `strips/high/R14` frames 5–8, no spray clump is more than 10 px from a wheel.
     - `high/desktop/R17` has at least 1,500 orange pixels (hue 15–45°, saturation > 0.55, value > 0.7) within 150 px of the rear wheels (now 32, none from spray).
     - `high/desktop/R19` has at least 800 soft-white pixels within 120 px of the wheels.
7. **G-horizon-ridges: BIG LEVER** (scenery, WS4, L, severity 4, +1.0)
   - **Why it's the lever.** The flat ridge walls are the main thing holding back both scenery and the authenticity mountain clause.
   - **Fix.** Replace the flat stepped column walls with three depth bands of brick-built ridges: overlapping, rounded ridgelines of stepped plates, with instanced low-LOD tree crowns. Cap the near band's height, and reshape the face of Hot Springs Mountain.
   - **Test.** In R05, R06, R09, R12 and R17:
     - no uniform ridge run is longer than 60 px horizontally;
     - at least 3 tree crowns show per 100 px of ridge;
     - no vertical ridge face is taller than 15% of the frame.

     Haze is excluded from this test; it belongs to gap 3.
8. **G-landscape-select-preview** (mobile, WS6, M, severity 3, +0.5)
   - **Fix.** At 844×390, narrow the panel to at most 60% of the width, or shift the turntable camera.
   - **Test.** The full tub and every crew figure are visible outside the panel in `high/landscape/R02`.
9. **G-scenery-bevels** (materials, WS4, M, severity 3, +0.5)
   - **Fix.** Add an edge-highlight or chamfer to canopy plate edges, facade corners, storey ledges and roof edges, plus a light brick bevel normal map. The canopy studs already exist; this merges the edge half of G-trees-no-brick-detail with G-facade-brick-geometry and G-surface.
   - **Test.** Near canopy sides in R10 vary by at least 15 luma along a lit edge (now 78–79, flat). Facade corners in R05 and R13 show a lit bevel line.
10. **G-pack-separation** (readability, WS6, M, severity 3, +0.5)
    - **Fix.** Float a small, unoutlined team-colour pip over each rival captain within 60 m.
    - **Test.** At least 5 rival tubs are individually marked in `high/desktop/R04` and `R07`.
11. **G-team-colour-key** (readability, WS2, S, severity 2, +0.25)
    - **Fix.** Use one key colour per team across the swatch, ring, flag and stripe. Trail Shredders' swatch is (240,127,34) but its ring is (114,170,56).
    - **Test.** Every team's ring hue is within 20° of its swatch hue.
12. **G-hud-tile-unify** (ui, WS6, S, severity 2, +0.25)
    - **Fix.**
      - Give the gauge tile the slate fill, outline and bevel of the other tiles.
      - Tile the desktop minimap.
      - Restyle the teal callouts as studded slate plates like the R16 banner.
      - Put the item count on its own badge.
    - **Test.**
      - One tile style across R04, R16, R17 and R19.
      - The count is at least 12 CSS px and clear of the orb rim at 1280, 390 and 844 px.

**Below the cut**
- **Still open, not ranked this loop**
  - G-tub-interior-streaks (characters, S): a 5–10 luma ripple, close-up only.
  - G-slide-kerb-clip (animation, M): R14 frame 8.
  - The water-surface tilt half of G-water-slosh-visible (animation, M).
  - The Bridge Street hero piece (authenticity, M).
  - Seating the judge in the booth (authenticity, M).
  - Reshaping Goat Rock (scenery, M).
  - Countdown dust banding in `crops/high/R03-kart_5` (effects polish, S).
  - Card-label wraps (typography, S).
- **Dropped**
  - G-player-ring-contrast: contradicted, the ring has an outline and reads at 3.3:1.
  - G-road-ghost-smear as filed: wrong category; R04 shows a moving tub.
  - The vegetation half of G-terrain: contradicted by R09 and R12.

```json
{
  "loop": 5,
  "role": "judge",
  "tier": "high",
  "verdict": "continue",
  "scores": {
    "characters": {"score": 7.0, "confidence": 0.8, "evidence": [
      {"shot": "crops/high/R02-preview-captain", "note": "printed expressive faces, hydrant badge, deep-blue water with duck; interior wall ripple 5-10 luma (y 480-500, x 200-340), close-up only"},
      {"shot": "crops/high/R15-player", "note": "moulded helmet studs, mitten fists, straight torsos"},
      {"shot": "crops/high/R03-player-rear", "note": "bare tan backs of heads keep it off 7.5"},
      {"shot": "crops/high/R03-kart_5", "note": "banded dust under chassis at countdown (luma 111 at 820,650 vs ~65-70 around): particle defect, not asset"},
      {"shot": "crops/high/R02-preview", "note": "tub reads as assembly: rim ring, stripe tile, claw feet, base plate"}]},
    "materials": {"score": 6.5, "confidence": 0.7, "evidence": [
      {"shot": "high/desktop/R05", "note": "canopy tops studded with specular specks at 600-860, 590-800 (critic A wrong); facades flat textures"},
      {"shot": "high/desktop/R09", "note": "studded conifer plate tops at 820-1240, 360-620; Goat Rock brick texture on tapered blocks"},
      {"shot": "high/desktop/R10", "note": "canopy side flat luma 78-79 over 1140-1260, 290-320: no edge highlight"},
      {"shot": "crops/high/R15-player", "note": "hero ABS sheen follows helmet and rim curvature"},
      {"shot": "high/desktop/R08", "note": "terraced bank plates and studded baseplate near camera"}]},
    "scenery": {"score": 6.5, "confidence": 0.7, "evidence": [
      {"shot": "high/desktop/R06", "note": "left-third ridge (56,84,62) luma 73, darker than foreground grass luma 111: sheer wall"},
      {"shot": "high/desktop/R09", "note": "broadleaf, autumn tree, flowers, rocks: vegetation varies (Codex wrong); one conifer model repeats"},
      {"shot": "high/desktop/R11", "note": "near canopy covers ~24% of frame (R19 ~15%, R08 ~12%)"},
      {"shot": "high/desktop/R13", "note": "matte cuboid crowd kit clashes with glossy crews"},
      {"shot": "high/desktop/R08", "note": "terraced banks are real brick-built terrain transitions"},
      {"shot": "high/desktop/R04", "note": "road, baseplate, buildings, lamps, fences read brick-built"}]},
    "lighting": {"score": 6.5, "confidence": 0.7, "evidence": [
      {"shot": "high/desktop/R05", "note": "nearest ridge luma 78.5 vs tree ~74, sky 201; outer ring 207 brighter than sky: haze ramp broken"},
      {"shot": "high/desktop/R17", "note": "ring luma 215 vs sky 207"},
      {"shot": "high/desktop/R11", "note": "43% of central frame below luma 40; near canopy luma 28; clean far road median luma ~84 (advocate's 110 included two item orbs)"},
      {"shot": "high/desktop/R07", "note": "deliberate dusk: lamp pools, 17% below luma 40"},
      {"shot": "high/desktop/R06", "note": "buff Row fronts separate from the sky"},
      {"shot": "crops/high/R02-preview", "note": "contact shadow under the base plate"}]},
    "animation": {"score": 6.0, "confidence": 0.7, "evidence": [
      {"shot": "strips/high/R15", "note": "crew circles; beads rise above the rim in frame 2; gauge 37->36"},
      {"shot": "strips/high/R16", "note": "circling with progress fill; frame 4 splash, ripple ring and wet patch to frame 7; gauge 40->39"},
      {"shot": "strips/high/R14", "note": "spray R-B -42 -> -13 (blue to white) but detached clumps, no orange (orange px only on the ring); frame 8 tub on pavement with lamp post inside ring"},
      {"shot": "high/desktop/R17", "note": "HOT STEAM! with 32 orange px in 400x320 round the tub, none from steam"},
      {"shot": "high/desktop/R19", "note": "WARM STEAM over ~10 dots of 2-4 px"}]},
    "ui": {"score": 7.0, "confidence": 0.65, "evidence": [
      {"shot": "high/desktop/R04", "note": "clear tile hierarchy, nothing overlaps on desktop; gauge tile translucent without the dark outline"},
      {"shot": "high/desktop/R16", "note": "studded slate banner vs teal callouts in R17/R19: two callout styles"},
      {"shot": "high/desktop/R02", "note": "brick-panel menu with stud row and stud-topped buttons"},
      {"shot": "high/desktop/R18", "note": "consistent results panel"}]},
    "typography": {"score": 7.0, "confidence": 0.65, "evidence": [
      {"shot": "high/desktop/R01", "note": "pixel display face and rounded sans form a clear scale"},
      {"shot": "high/desktop/R04", "note": "8TH and 0:07.00 read at a glance"},
      {"shot": "high/desktop/R17", "note": "x3 count ~8 px at 613-628, 50-58, touching the orb rim"},
      {"shot": "high/landscape/R02", "note": "orphaned 'Traditional · / locked' wraps"}]},
    "readability": {"score": 6.5, "confidence": 0.7, "evidence": [
      {"shot": "high/desktop/R19", "note": "player ring (192,162,103) with dark outline (60,51,41) on shadowed path (96,78,57), ~3.3:1 (critic A wrong); orphan rival ring with beads and no tub at bottom (also low/desktop/R19)"},
      {"shot": "high/desktop/R07", "note": "far pack merges into one mass"},
      {"shot": "high/desktop/R08", "note": "Trail Shredders ring (114,170,56) vs orange swatch (240,127,34) in team select"},
      {"shot": "high/desktop/R10", "note": "item orbs and road edges obvious"},
      {"shot": "high/mobile/R04", "note": "player tub and road edges readable on phone"}]},
    "mobile": {"score": 6.5, "confidence": 0.7, "evidence": [
      {"shot": "high/mobile/R04", "note": "lap tile covers ~15 CSS px of the gauge top; orb overlaps the place tile; controls clear of the tub"},
      {"shot": "high/landscape/R17", "note": "radar crosses the place tile (also R04, R07; R08 touches)"},
      {"shot": "high/landscape/R02", "note": "all 12 cards fit but the tub is hidden; crew sliver at x ~1280-1360"},
      {"shot": "high/mobile/R02", "note": "portrait team select framed with crew and tub above the panel"}]},
    "authenticity": {"score": 6.5, "confidence": 0.65, "evidence": [
      {"shot": "high/desktop/R05", "note": "Fordyce recognisable; outer ridge pale wall brighter than the sky"},
      {"shot": "high/desktop/R06", "note": "Arlington twin towers close the vista; mountain a sheer cliff, not the Ouachitas"},
      {"shot": "high/desktop/R11", "note": "lattice steel tower at ~430-470, 0-120 behind conifers, mostly hidden"},
      {"shot": "high/desktop/R16", "note": "judge stop reads via banner and studded line; judge is a background figure"},
      {"shot": "high/desktop/R09", "note": "Goat Rock reads as brick masonry towers"},
      {"shot": "high/desktop/R13", "note": "Bridge Street generic"}]}
  },
  "ip": {"clean": true, "notes": "LEGO clean: rounded-cuboid heads, mitten fists, straight torsos (crops/high/R15-player, crops/high/R03-player-rear, crops/high/R02-preview-rear); studs on helmets only; no LEGO name or logo in R01, R02, R18. Outside the gate: the high/desktop/R13 spectator and strips/high/R15 frame 1 (square tan head, flat brown hair cap, cyan tee, dark trousers) read as Minecraft's default character; filed as G-crowd-kit-restyle, do this loop."},
  "gaps": [
    {"id": "G-phone-hud-dock", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R04", "high/mobile/R17", "high/landscape/R04", "high/landscape/R07", "high/landscape/R17"], "benchmark": "drive-3", "fix": "Portrait: stack lap tile, gauge and checklist in one column with 8 CSS px gaps (gauge below the lap tile, not under it) and move the item orb and coin chip to a row below the place tile. Landscape: dock the map at least 8 CSS px below the place tile. Test: no two HUD bounding boxes intersect in high/mobile/R04, R07, R08, R17 or high/landscape/R04, R07, R08, R17."},
    {"id": "G-near-camera-fade", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R11", "high/desktop/R19", "high/desktop/R08", "low/desktop/R19"], "benchmark": "drive-3", "fix": "Fade or offset tree canopies (not just trunks) inside the chase camera's near volume, and fade a tub's ring and particles together with its body. Test: no single canopy covers more than 8% of high/desktop/R08, R11 or R19 (now ~12%, ~24%, ~15%), and no ring arc without its tub in high/desktop/R19 or low/desktop/R19."},
    {"id": "G-backdrop-haze-ramp", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R05", "high/desktop/R06", "high/desktop/R17"], "benchmark": "worlds-4", "fix": "Apply per-ring distance fog so each horizon ring sits between the ground in front and the sky, and clamp the farthest ring below sky luma. Test: in R05 and R06 nearest-ridge luma is at least 1.25x the mid-distance tree luma (now 78.5 vs 74) and at most 0.85x the sky; each further ring is lighter than the one in front and darker than the sky (now 207 vs 201 in R05, 215 vs 207 in R17)."},
    {"id": "G-sunset-fill", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R11", "high/desktop/R07"], "benchmark": "worlds-4", "fix": "At the sunset preset raise the hemisphere sky term and add a warm low rim or fill on figures and canopies (about +0.5 EV in shadow), leaving dusk unchanged. Test: in high/desktop/R11 at most 15% of the central frame (15-85% width, 15-95% height) below luma 40 (now 43%), near-right canopy at 900-1000, 200-280 at least luma 45 (now 28), clean sunlit road at least luma 95 (now ~84); high/desktop/R07 keeps at least 10% below luma 40 (now 17%)."},
    {"id": "G-crowd-kit-restyle", "category": "scenery", "expectedGain": 0.25, "severity": 4, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R13", "strips/high/R15", "high/desktop/R16"], "benchmark": "worlds-1", "fix": "Give spectators and the judge the crew's glossy plastic material and printed-face style, add three or more hair and hat variants from crew parts, and ban the cyan tee + flat brown hair cap + dark trousers combination (reads as Minecraft's default character). Test: crowd heads in high/desktop/R13 and R15 show a specular highlight, and no crowd figure in any capture uses that combination."},
    {"id": "G-steam-charge-fx", "category": "animation", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "high/desktop/R17", "high/desktop/R19"], "benchmark": "drive-3", "fix": "Emit slide puffs from the rear wheel contacts, growing in size and opacity with charge: blue-white at charge start (already present), white at warm, orange at hot. Fire the WARM/HOT callouts only together with that visual, plus a release burst. Test: strips/high/R14 frames 5-8 have no spray clump more than 10 px from a wheel; high/desktop/R17 has at least 1,500 orange px (hue 15-45 deg, s>0.55, v>0.7) within 150 px of the rear wheels (now 32, none from spray); high/desktop/R19 has at least 800 soft-white px within 120 px of the wheels."},
    {"id": "G-horizon-ridges", "category": "scenery", "expectedGain": 1.0, "severity": 4, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06", "high/desktop/R09", "high/desktop/R12", "high/desktop/R17"], "benchmark": "drive-1, drive-5, worlds-4", "fix": "BIG LEVER. Replace the flat stepped column walls with three depth bands of brick-built Ouachita ridges: overlapping rounded ridgelines of stepped plates with instanced low-LOD tree crowns and a darker tree-line band. Cap the near band's height so it never forms a sheer cliff (R06 left third), and reshape Hot Springs Mountain's face. Test (geometry only; haze is G-backdrop-haze-ramp): in R05, R06, R09, R12 and R17 no uniform ridge run longer than 60 px horizontally, at least 3 tree crowns per 100 px of ridge, and no vertical ridge face taller than 15% of the frame height."},
    {"id": "G-landscape-select-preview", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["high/landscape/R02"], "benchmark": "drive-2", "fix": "At 844x390 narrow the team panel to at most 60% of the width or shift the turntable camera so the crew and tub sit in the free area. Test: in high/landscape/R02 the full tub and every crew figure are visible outside the panel (now an ~80 px sliver at x 1280-1360)."},
    {"id": "G-scenery-bevels", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R10", "high/desktop/R05", "high/desktop/R13"], "benchmark": "worlds-1", "fix": "Canopy studs already exist (R05, R09). Add an edge-highlight term or a one-plate chamfer to canopy plate edges, facade corners, storey ledges and roof edges, plus a light brick bevel normal map on facades. Test: near canopy sides in high/desktop/R10 vary by at least 15 luma along a lit edge (now flat 78-79 at 1140-1260, 290-320); facade corners in R05 and R13 show a lit bevel line."},
    {"id": "G-pack-separation", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/desktop/R07", "high/mobile/R04"], "benchmark": "drive-3", "fix": "Float a small, unoutlined team-colour pip above each rival captain within 60 m (smaller than the player's marker), so tubs in a single-file pack keep separate cues. Test: in high/desktop/R04 and R07 at least 5 rival tubs are individually marked."},
    {"id": "G-team-colour-key", "category": "readability", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["high/desktop/R08", "high/landscape/R02", "crops/high/R03-kart_1"], "benchmark": "drive-3", "fix": "Use one key colour per team across the team-select swatch, ring, flag and tub stripe (Trail Shredders: swatch (240,127,34), ring and stripe (114,170,56)). Test: every team's ring hue is within 20 deg of its swatch hue."},
    {"id": "G-hud-tile-unify", "category": "ui", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/desktop/R16", "high/desktop/R17", "high/desktop/R19", "high/mobile/R17"], "benchmark": "drive-3", "fix": "Give the gauge tile the slate fill, dark outline and bevel of the lap and place tiles; put the desktop minimap on a matching tile; restyle the teal WARM/HOT callouts as studded slate plates like the R16 banner; move the item count to its own badge outside the orb. Test: one tile style across R04, R16, R17 and R19; the item count is at least 12 CSS px and does not overlap the orb outline at 1280, 390 and 844 px."}
  ]
}
```
