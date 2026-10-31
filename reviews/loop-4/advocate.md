# Advocate: loop 4, High tier

Capture paths are relative to `screenshots/review-loop-4/`. "Mean" is the mean of the two critics' scores.

## Position in one paragraph
I concede most of the large defects both critics found:
- The near ridge ring is one flat colour.
- The new horizon took the glow band out of dusk and sunset.
- The "10" tile is clipped on every viewport.
- The fourth row of the landscape team grid is cut off.
- The water triangle and the High-only stripes spoil the hero close-up.
- The creek ford reads as stone.

I push back in four places:
1. Several claims are plainly wrong about named captures (listed below).
2. Both critics missed visible evidence. The slide-charge tiers are on screen (`WARM STEAM`, `HOT STEAM!`). The Medical Arts Building is on Central Avenue. The brief gives measured phone performance.
3. Critic A charges the same ridge defect to materials, scenery and lighting, and Codex blames its shape when the problem is flat shading.
4. The occlusion stripes appear only in the 2× close-ups. At play size the same pass visibly grounds the tubs, and nobody credited that.

My proposed total is 66.5, against a critic mean of 64.5 (Critic A 63.5, Codex 65.5). Every proposed score is within +0.25 to +0.5 of the mean.

## Facts the critics got plainly wrong
1. **Critic A: "At dusk the ridge is a navy cut-out", "a single navy (35,37,64) wall against a salmon sky" (`high/desktop/R07`).** The navy ring covers 1.1 % of the frame and sits only behind the town centre (x 175–1098). A second ring, tinted toward the dusk sky, is (172,106,93) with lit plate edges of (211,132,117). It covers 4.4 % of the frame across the right half (x 660–1279). So the dusk horizon has two value layers, not one wall.
2. **Critic A: "No visible 'hot steam' charge … no colour tiers" and Codex: "slide charging lacks … visual progression".** That is true of `strips/high/R14` alone. The charge tiers are on screen elsewhere: `WARM STEAM` in `high/desktop/R19`, and `HOT STEAM!` in `high/desktop/R17`, `high/mobile/R17` and `high/landscape/R17`.
3. **Critic A: "the faces are simple two-dot prints".** `crops/high/R04-kart_3` has angled scowling brows and open shouting mouths. `crops/high/R02-preview-captain` has a shocked open mouth with a tongue, and `crops/high/R03-kart_5` has open smiles. The eyes are dots, but the faces are not two-dot prints.
4. **Critic A: "the rest of the interior is empty grey, so the tub reads as empty".**
   - The interior in `crops/high/R02-preview-captain` is cyan-tinted, not neutral: (78,94,92) to (106,128,125), with G and B 15–20 levels above R.
   - `crops/high/R15-player` shows a blue water sheet in the tub, mean (78,104,108).
   - The triangle is real. "Empty" is not.
5. **Critic A: "R08, R10 and R11 are interchangeable pine-lined mountain roads".** They differ:
   - `high/desktop/R10` is a terracotta brick-tile road.
   - `high/desktop/R08` is grey asphalt with a yellow centre line and a stone retaining wall.
   - `high/desktop/R11` is a dusk-palette road with a lattice tower on the ridge.
6. **Critic A: Hill Wheatley Plaza is "an empty brick disc", with the fountain "not in frame".** That is true of `high/desktop/R17`. But the radial brick paving, the stone balustrade and the crowd are there. The fountain's studded stone basin, with blue-topped blocks, is in frame at the left edge of `high/landscape/R17`.
7. **Codex (mobile): "static captures do not establish … device performance".** The brief's measured table answers this.
   - The 4× CPU phone proxies hold 198 and 139 fps minimum, with worst p95 frame times of 7.9 and 11.3 ms.
   - Only the pessimistic software floor (swiftshader) is near the line: 53 fps minimum, worst p95 36.3 ms.
   - Codex dropped the rubric's own 30 fps criterion from the mobile score.

## Category by category

### Characters: Critic A 6.5, Codex 7, mean 6.75 → **propose 7.0**
**Concede:**
- `crops/high/R02-preview-captain`: the tilted water sheet shows as a blue triangle on both sides of the duck. The same triangle is in `crops/low/R02-preview-captain`, so the cause is the sheet itself, not the tier.
- High close-ups have vertical stripes, about 10 px apart, on the tub interior (`crops/high/R02-preview-captain`) and on faces (`crops/high/R02-preview-rear`). Low has none (`crops/low/R02-preview-captain`).
- Hats and tub bodies carry no studs. Only the chassis plates do (`crops/high/R04-kart_3`).

These are the two "close-ups hold up" failures and one anchor detail.

**Rebut:**
- The prints are better than Critic A's "two-dot" description (fact 3 above).
- On team distinctness, Codex hedged ("without establishing that every team remains distinct"), but the captures settle it. At chase distance there are nine clearly different crews as the player tub:
  - `high/desktop/R03`: red helmets with X-straps.
  - `high/desktop/R07`: black suits with H prints and a purple tub.
  - `high/desktop/R08`: green X-strap shirts.
  - `high/desktop/R10`: cowboy hats with suspenders.
  - `high/desktop/R11`: blue overalls.
  - `high/desktop/R12`: tie-dye with antenna caps.
  - `high/desktop/R13`: white swirl hats.
  - `high/desktop/R17`: green scale print.
  - `high/desktop/R19`: ranger hats.
- More distinct rival crews appear: pink in `R07` and `R11`, blue in `R14`.
- The rolled rim is smooth in every close-up. The tubs sit on studded chassis plates with hubbed wheels.

The figures exceed the 7 anchor on prints, uniforms and team identity, and the two close-up defects are small in area and S effort. 7.0 is within the band.

### Materials: Critic A 6.0, Codex 6.5, mean 6.25 → **propose 6.5**
**Concede:**
- The near ridge ring is one flat colour, (63,94,69), over 17.9 % of `high/desktop/R05`. I re-measured this.
- Terrain banks are flat: the lower right of `high/desktop/R19` is about (82,96,68), and the `high/desktop/R08` shoulder is plain grey.
- Wall bricks are a texture with painted top edges.
- The creek ford averages about (132,130,125) and reads as paving (`high/desktop/R19`).

**Rebut:**
- **Triple counting.** Critic A docks the same ridge fill in materials (`R05`, `R06`), in scenery (G-ridge-flat-fill) and in lighting ("ridge rings carry no gradient"). It is one defect with one fix.
- **The stripes do not reach play size.**
  - On the flat face of the judge booth in `high/desktop/R16`, the column-mean residual is 0.16 grey levels, below what the eye can see.
  - On the player tub in `high/desktop/R03` it is 0.87 on High against 1.8 on Low, so High is not stripier at play size.
  - So the stripes belong to the close-up (characters) problem, not to the play-size materials read.
- **Studs near the camera.** Baseplate studs are visible:
  - on the `R05` lawn at lower right;
  - on the `R08` verge at lower left;
  - on the `R12` verge at right;
  - across the whole of `high/desktop/R09`.
- **Plastic and translucency.** The pickups are glossy and translucent (`high/desktop/R10`, `high/desktop/R17`). Figures, tubs and the duck show highlights that follow the bevels (`crops/high/R02-preview`, `crops/high/R04-kart_3`).

### Scenery: Critic A 6.5, Codex 6, mean 6.25 → **propose 6.5**
**Concede:**
- The near ring is the largest single flaw in `R05` and `R06`.
- The shopfront runs and the evenly spaced crowds repeat (`high/desktop/R04`).

**Rebut:**
- **What Codex calls "broad empty green surfaces" in `R05` is studded baseplate.** That is exactly what the 7 anchor asks for ("baseplate ground").
- **Codex blames the ridge's shape, but the shape is already brick-built.** Each ring already has 6 m stepped columns with lighter plate edges: (229,254,255) at the top of the `R05` far ring, and (230,251,237) in `R12`. The defect is the unshaded face colour and how dark and high the near ring is. A stepped mountain behind the Row is also true to place, which Critic A credits under authenticity.
- **Set pieces the critics passed over:**
  - Goat Rock as white brick-built boulders on a studded baseplate (`high/desktop/R09`).
  - Maples, an autumn tree, shrubs, flowers and studded rocks in Whittington (`high/desktop/R12`).
  - The radial brick plaza (`high/desktop/R17`).
  - A terracotta tile road on West Mountain (`high/desktop/R10`).
- **The mountain courses are not interchangeable** (fact 5 above).

This meets most of the 7 anchor apart from the horizon, and 6.5 stands.

### Lighting: Critic A 6.0, Codex 6.5, mean 6.25 → **propose 6.5**
**Concede:**
- `high/desktop/R11` is a peach fade with no sun disc, glow or bloom.
- In `ab/high-desktop-R07` and `ab/high-desktop-R11` the other build has a glowing horizon band, so the new rings lost it. That is a regression, and `worlds-4` sets a higher bar.

**Rebut:**
- **The new occlusion pass grounds the tubs at play size, and no critic credited this measurably.** Under the player tub between the crew in `R03`, High is 33.0 against Low's 55.7 mean luminance. Open road away from the tub is equal (93.0 against 89.9). Compare `high/desktop/R03` with `low/desktop/R03`.
- **The dusk palette is deliberate.** Codex agrees: "deliberate warm dusk palette".
- **There is haze between rings.** The rings step toward the sky colour with distance, which is the anchor's "haze matched to the sky":
  - `high/desktop/R09`: (24,67,41), then (124,151,138), then (184,206,215).
  - `high/desktop/R12`: the far ring (188,206,195) against a sky of (188,216,228), which Critic A counted against it.
  - `high/desktop/R07`: navy, then salmon (fact 1 above).
- **Lamp pools no longer clip.** Both critics agree.

Short of 7 for the missing sun glow. 6.5, not 6.0.

### Animation: Critic A 6.0, Codex 6.5, mean 6.25 → **propose 6.5**
**Concede:**
- No camera roll, kick or shake shows in any strip. The horizon is level in every frame of `strips/high/R14` and `strips/high/R15`.
- `strips/high/R14` frame 8 has a lamp post inside the tub's ring with no hit reaction.
- The fumble beads in `strips/high/R15` frames 3–6 crowd the tub.

**Rebut:**
- **The charge progression exists and is visible** (fact 2 above).
- **Water consequences read in every strip:**
  - The gauge drains 41 → 39 gal across `strips/high/R14`.
  - It drains 37 → 36 gal in `strips/high/R15`.
  - It drains 40 → 39 gal in `strips/high/R16`.
- **The crew leans** with rigid, jointed limbs as the tub slides out in `strips/high/R14` frames 7–8.
- **The rule ritual reads.** `strips/high/R16` shows "RING AROUND THE TUB!" with a progress bar that fills while the crew circles the tub. Codex accepts this.

The 7 anchor still needs camera kick, so 6.5.

### UI / HUD: 6.5 and 6.5, mean 6.5 → **6.5 (concede)**
- I confirm the clip on row y=711 of `high/desktop/R04`: the "0" stroke sits at x=159, and road shows at x=160.
- The fourth row in `high/landscape/R02` is cut.
- The menus share brick-shaped buttons with studs and stud rows (`high/desktop/R01`, `high/desktop/R18`).

One note on severity. A podium (G-results-static) is a 9-anchor nicety. It is not what holds UI under 7; the clips are.

### Typography: 6.5 and 6.5, mean 6.5 → **6.5 (concede)**
I concede the clipped "10", and the clipped "Stock ·" in `high/landscape/R02`.

**Rebut Codex's "uneven reading scale":**
- In `high/desktop/R04` the type falls into three tiers: the large pixel place readout, medium LAP and time, and small labels. That is the "clear scale" the 7 anchor asks for.
- The legend glyphs are 10 px tall (rows 777–786) with an outline, and they stay readable.

### Readability: Critic A 6.5, Codex 7, mean 6.75 → **propose 7.0**
**Concede:**
- In `high/desktop/R19` the sage crew stands on tan pavers with low contrast.
- The judges themselves are weak in `high/desktop/R16`.

**Rebut:**
- **The near canopies cover sky and verge, not road.**
  - In `high/desktop/R08` the top-left canopy covers sky and the wall top.
  - In `high/desktop/R11` the right canopy covers the verge; the road edge, pack and three pickups stay clear.
  - In `high/desktop/R19` the top-right canopy covers the tree line; the ford and the rival tub stay visible.
  - Area alone is not a readability failure under the anchor (tubs, items, road edge, player tub).
- **The packs are bunched because of when they were captured.** Every pack shot is taken 6–7 s after the start: `R04`, `R07`, `R08`, `R10`, `R11`, `R12` and `R13` all show a timer of 0:06.00 to 0:07.00. "Stacks into one file" describes the grid still bunched up, not steady-state racing.
- **What reads on every viewport:**
  - The player's ring and marker in every race frame (`high/mobile/R04`, `high/mobile/R17`, `high/landscape/R04`).
  - White road edges.
  - Glowing pickups.
  - A studded judge line plus banner (`high/desktop/R16`).

### Mobile: Critic A 6.5, Codex 6, mean 6.25 → **propose 6.5**
**Concede:**
- `high/landscape/R02` cuts the bottom of the fourth row and the left edge of the preview tub at about x=1105.
- The "10" tile is clipped on both phone viewports.

**Rebut:**
- **The fourth-row card names are all still readable** (Suds Posse, Flamingo Flock, Tub Ninjas). Only their division and lock lines are cut.
- **Thumb controls never reach the tub:**
  - In `high/mobile/R04` the tub sits at y 850–1120 and the controls start at y≥1420.
  - The same holds in `high/mobile/R17`.
  - In landscape the controls stay in the corners (`high/landscape/R04`, `high/landscape/R17`).
- **The phone layouts are designed, not shrunk.** Portrait has a title layout (`high/mobile/R01`) and results (`high/mobile/R18`); landscape has a two-column title (`high/landscape/R01`).
- **Performance** (fact 7 above).

### Authenticity: Critic A 6.5, Codex 7, mean 6.75 → **propose 7.0**
**Concede:**
- The ford reads as stone (`high/desktop/R19`).
- The judges are anonymous.
- Bridge Street (`high/desktop/R13`) has no named landmark.

**Rebut. Neither critic noticed these:**
- The Art Deco setback tower of the Medical Arts Building stands at the head of Central Avenue in `crops/high/R03-player`.
- `high/desktop/R14` shows, in one frame:
  - the Quapaw mosaic dome;
  - the Fordyce diamond prints;
  - the hillside tower building;
  - Hot Springs Mountain behind the Row.

Add the Arlington's twin towers (`high/desktop/R06`), Goat Rock in white stone (`high/desktop/R09`) and a tower on the ridge (`high/desktop/R11`). The race elements are all there:
- the water line on the gauge;
- the duck and flag on every tub;
- the ring-around-the-tub rule (`high/desktop/R16`);
- the CLEAN water check (`high/desktop/R18`);
- the title's credit to the Central Avenue race (`high/desktop/R01`).

That meets the 7 anchor.

## IP
I agree with both critics: clean. Heads are rounded square blocks, hands are block fists and torsos are boxes (`crops/high/R02-preview`, `crops/high/R15-player`). There is no LEGO name or logo.

## Gaps: my adjustments
Three pairs below are the same defect, and the judge should count each only once:
- G-ridge-flat-fill and G-ridge-walls.
- G-slide-fumble-feedback and G-action-feedback.
- G-landscape-team-grid-clip and G-landscape-selection.

G-surface-consistency overlaps G-high-ao-striping.

**Conceded unchanged:**
- G-ridge-flat-fill
- G-tub-water-sheet
- G-landscape-team-grid-clip
- G-flat-terrain-banks
- G-gauge-10-clipped

**Lowered:**

| Gap | Change | Why |
|---|---|---|
| G-ridge-walls | +1.0 → +0.5 | Wrong cause: the silhouette is already stepped plates. |
| G-dusk-sunset-sky | 4 → 3 | Only the sunset (`R11`) lacks a deliberate palette. |
| G-slide-fumble-feedback | 4/+1.0 → 3/+0.5 | The charge tiers and water-loss feedback already exist. |
| G-action-feedback | cause | The charge progression already exists; the missing piece is in-world tier effects and a camera beat. |
| G-high-ao-striping | 3/+0.5 → 2/+0.3 | Close-ups only. |
| G-surface-consistency | 3/+0.5 → 2/+0.3 | Half of it is the same stripes. |
| G-near-canopy-cover | 3/+0.5 → 2/+0.3 | No tub, pickup or road edge is covered. |
| G-landscape-selection | 4/+1.0 → 3/+0.5 | The names are readable; it duplicates Critic A's gap. |
| G-creek-ford-reads-stone | +0.5 → +0.3 | One course. |
| G-forest-courses-interchangeable | 3/+0.5 → 2/+0.3 | The courses are not interchangeable (fact 5 above). |
| G-judge-stop-weak | 2/+0.3 → 1/+0.2 | The stop reads through the line and the banner. |
| G-results-static | 2/+0.5 → 1/+0.2 | A 9-anchor feature. |
| G-repeated-dressing | 3/+0.5 → 2/+0.3 | Building height, colour and awnings vary; only crowd spacing is uniform. |
| G-hud-scale | 3/+0.5 → 2/+0.3 | The scale is a deliberate hierarchy, and the landscape stacking duplicates G-landscape-selection. |

```json
{
  "loop": 4,
  "role": "advocate",
  "tier": "high",
  "scores": {
    "characters": {
      "score": 7.0,
      "confidence": 0.55,
      "evidence": [
        {"shot": "crops/high/R04-kart_3", "note": "Angled scowl brows and open shouting mouths: not 'two-dot prints'; tie-dye uniforms, antenna caps, studded chassis plate"},
        {"shot": "crops/high/R03-kart_5", "note": "Swirl hats, open smiles, smooth gold rolled rim, hubbed wheels"},
        {"shot": "crops/high/R15-player", "note": "Blue water sheet visible in the tub, mean (78,104,108): tub does not read empty"},
        {"shot": "crops/high/R02-preview-captain", "note": "Conceded: blue water triangle either side of the duck, also on Low; ~10 px stripes on the interior (High only)"},
        {"shot": "high/desktop/R13", "note": "One of nine distinct player crews across R03/R07/R08/R10/R11/R12/R13/R17/R19 at chase distance"}
      ]
    },
    "materials": {
      "score": 6.5,
      "confidence": 0.5,
      "evidence": [
        {"shot": "high/desktop/R05", "note": "Conceded: near ridge one RGB (63,94,69) over 17.9%; but the lawn at lower right is studded baseplate; the ridge is also charged by Critic A to scenery and lighting"},
        {"shot": "high/desktop/R16", "note": "High stripe residual on the flat booth face is 0.16 grey levels at play size: the stripes are a close-up artefact"},
        {"shot": "high/desktop/R09", "note": "Studded baseplate and brick-built white rock across the frame"},
        {"shot": "crops/high/R02-preview", "note": "Highlights follow the bevels on helmets, rim and wheels"},
        {"shot": "high/desktop/R19", "note": "Conceded: ford ~(132,130,125) reads as paving; flat sage bank lower right"}
      ]
    },
    "scenery": {
      "score": 6.5,
      "confidence": 0.5,
      "evidence": [
        {"shot": "high/desktop/R09", "note": "Goat Rock as white brick-built boulders on studded baseplate: a hero set piece"},
        {"shot": "high/desktop/R12", "note": "Maples, autumn tree, shrubs, flowers, studded rocks"},
        {"shot": "high/desktop/R10", "note": "Terracotta brick-tile road: not interchangeable with R08 asphalt or R11 dusk"},
        {"shot": "high/landscape/R17", "note": "Fountain's studded stone basin in frame at the left edge"},
        {"shot": "high/desktop/R05", "note": "Conceded: the near ring is a flat dark fill; its silhouette already has stepped plates with lit edges"}
      ]
    },
    "lighting": {
      "score": 6.5,
      "confidence": 0.5,
      "evidence": [
        {"shot": "high/desktop/R03", "note": "Occlusion under the player tub: mean luminance 33.0 vs 55.7 on low/desktop/R03, open road equal (93.0 vs 89.9)"},
        {"shot": "high/desktop/R07", "note": "Navy ring is 1.1% of the frame; a salmon ring (172,106,93) with lit edges (211,132,117) covers 4.4%: deliberate dusk layering, lamp pools unclipped"},
        {"shot": "high/desktop/R09", "note": "Rings step toward the sky colour with distance: (24,67,41) -> (124,151,138) -> (184,206,215)"},
        {"shot": "high/desktop/R11", "note": "Conceded: sunset has no sun disc, glow or bloom"}
      ]
    },
    "animation": {
      "score": 6.5,
      "confidence": 0.5,
      "evidence": [
        {"shot": "strips/high/R14", "note": "Gauge drains 41->39 gal; crew leans in frames 7-8; conceded: no camera roll, lamp post inside the ring in frame 8"},
        {"shot": "strips/high/R15", "note": "Crew circles with jointed limbs; gauge 37->36 gal; conceded: beads crowd the tub in frames 3-6"},
        {"shot": "strips/high/R16", "note": "RING AROUND THE TUB! banner fills while the crew circles"},
        {"shot": "high/desktop/R19", "note": "WARM STEAM charge tier on screen"},
        {"shot": "high/desktop/R17", "note": "HOT STEAM! charge tier on screen: the progression the critics called missing"}
      ]
    },
    "ui": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Clear hierarchy; conceded: '10' glyph at x=159, road at x=160 on row y=711"},
        {"shot": "high/desktop/R01", "note": "Brick-shaped studded buttons: style belongs to the brick world"},
        {"shot": "high/landscape/R02", "note": "Conceded: fourth row cut"}
      ]
    },
    "typography": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Three-tier scale (place / lap-time / labels); legend glyphs 10 px tall, outlined, readable"},
        {"shot": "high/desktop/R18", "note": "Display heading and table text clearly separated"},
        {"shot": "high/landscape/R02", "note": "Conceded: 'Stock ·' clipped"}
      ]
    },
    "readability": {
      "score": 7.0,
      "confidence": 0.5,
      "evidence": [
        {"shot": "high/desktop/R11", "note": "Right canopy covers the verge; road edge, pack and three pickups clear"},
        {"shot": "high/desktop/R10", "note": "Pack bunched at 0:06.00 after the start; glowing pickups read"},
        {"shot": "high/mobile/R04", "note": "Player ring and marker, white road edges, forward view clear"},
        {"shot": "high/mobile/R17", "note": "Player and pickup read on the plaza"},
        {"shot": "high/desktop/R16", "note": "Studded stop line plus banner read; conceded: judges weak"},
        {"shot": "high/desktop/R19", "note": "Conceded: sage crew on tan pavers is low contrast"}
      ]
    },
    "mobile": {
      "score": 6.5,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/mobile/R04", "note": "Tub y 850-1120, controls start at y>=1420"},
        {"shot": "high/mobile/R02", "note": "Whole preview above the panel, stats in two columns, no scroll"},
        {"shot": "high/landscape/R17", "note": "Controls in the corners, tub centred"},
        {"shot": "high/landscape/R02", "note": "Conceded: fourth row and left of preview cut; names still readable"}
      ]
    },
    "authenticity": {
      "score": 7.0,
      "confidence": 0.5,
      "evidence": [
        {"shot": "crops/high/R03-player", "note": "Medical Arts Building setback tower at the head of Central Avenue (missed by both critics)"},
        {"shot": "high/desktop/R14", "note": "Quapaw mosaic dome, Fordyce prints, hillside tower, Hot Springs Mountain behind the Row"},
        {"shot": "high/desktop/R06", "note": "Arlington twin towers"},
        {"shot": "high/desktop/R16", "note": "Ring-around-the-tub rule with duck and flag on the tub"},
        {"shot": "high/desktop/R19", "note": "Conceded: the Gulpha Creek ford reads as stone"}
      ]
    }
  },
  "ip": {"clean": true, "notes": "Agree with both critics: rounded square heads, block fists, box torsos; no LEGO name or logo."},
  "gaps": [
    {"id": "G-ridge-flat-fill", "category": "scenery", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06", "high/desktop/R12"], "benchmark": "worlds-1", "fix": "Conceded as written. Light the stepped ridge faces from the sun, add a vertical gradient to haze at each ring's base, jitter value +/-4% per 6 m column, lighten the nearest ring so the sky shows. Test: no single RGB value covers more than 2% of any day frame (now 17.9% in R05). Same defect as G-ridge-walls; count once."},
    {"id": "G-ridge-walls", "category": "scenery", "expectedGain": 0.5, "severity": 4, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06"], "benchmark": "2k-drive/drive-1.jpg", "fix": "Cause challenged: the silhouettes are already stepped 6 m plates with lit top edges (R05 far ring (229,254,255)); the defect is unshaded face colour and the near ring's dark value, so shade the faces per G-ridge-flat-fill rather than rebuilding the landform, and keep Hot Springs Mountain behind the Row. Duplicate of G-ridge-flat-fill."},
    {"id": "G-dusk-sunset-sky", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R11", "high/desktop/R07"], "benchmark": "worlds-4", "fix": "Sun disc and horizon glow band on the sky dome, brick-plate clouds lit from the sun side, small bloom on lamp heads. R07 already layers a navy near ring under a salmon far ring with lit edges; the main target is R11. Test: in R07 and R11 the horizon band is at least 1.3x the zenith's luminance and the sun or glow is visible."},
    {"id": "G-slide-fumble-feedback", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15"], "benchmark": "drive-3", "fix": "Charge tiers already show as WARM STEAM / HOT STEAM! banners (R19, R17) and the gauge drains in every strip; add in-world steam puffs coloured per tier, a 2-3 degree camera roll into the slide, an FOV kick on release, a 0.15 s shake on fumble, smaller translucent splash beads. Test: R14 strip shows the tier colour in the effect itself and a visible horizon offset. Duplicate of G-action-feedback."},
    {"id": "G-action-feedback", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15"], "benchmark": "2k-drive/drive-3.jpg", "fix": "A readable charge progression already exists as HUD banners; add the missing in-world tier effect, a distinct release beat and clearer tub-water movement. Test: an unlabelled strip distinguishes charging, release and fumble. Duplicate of G-slide-fumble-feedback."},
    {"id": "G-high-ao-striping", "category": "materials", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["crops/high/R02-preview-captain", "crops/high/R02-preview-rear", "high/desktop/R16"], "benchmark": "bj-1", "fix": "Interleaved per-pixel rotated noise kernel for the High occlusion pass, blur in both axes, depth-aware bilinear upsample. Severity lowered: the residual is 0.16 grey levels on a flat face at play size (R16 booth), so only the 2x close-ups show it. Test: column-mean residual below 0.7 grey levels on crops/high/R02-preview-captain."},
    {"id": "G-surface-consistency", "category": "materials", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["crops/high/R02-preview", "high/desktop/R05"], "benchmark": "worlds/worlds-1.jpg; builders-journey/bj-3.jpg", "fix": "The banded half is G-high-ao-striping; the remainder is painted brick-edge trim on flat walls. Establish consistent bevel highlights and roughness across nearby architectural parts; verify in the existing close-up and landmark cameras."},
    {"id": "G-tub-water-sheet", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R02-preview-captain", "crops/low/R02-preview-captain", "crops/high/R15-player"], "benchmark": "drive-4", "fix": "Conceded for the triangle (High and Low). Clip the tilted sheet to the inner-rim profile at fill height, raise opacity and saturation, add a meniscus highlight. The interior is cyan-tinted and R15-player shows the water, so 'reads empty' is overstated. Test: no water pixels outside the inner rim in the R02 and R03 close-ups."},
    {"id": "G-near-canopy-cover", "category": "readability", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R11", "high/desktop/R08", "high/desktop/R19"], "benchmark": "drive-3", "fix": "Lowered: the canopies cover sky and verge; no tub, pickup or road edge is hidden in R08, R11 or R19. Keep mountain-course trees at least 4 m off the road edge. Test: no single tree covers more than 5% of any race frame."},
    {"id": "G-landscape-team-grid-clip", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R02"], "benchmark": "drive-2", "fix": "Conceded. 4-column grid or shorter cards so all 12 team cards fit at 844x390. Test: every card fully visible in high/landscape/R02. Same defect as G-landscape-selection."},
    {"id": "G-landscape-selection", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["high/landscape/R02"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Lowered from 4/+1.0: the fourth-row names stay readable and only their division lines and the preview's left edge are cut. Reduce card height and reserve a preview region; show twelve complete cards, four stats and both actions at 844x390. Duplicate of G-landscape-team-grid-clip."},
    {"id": "G-flat-terrain-banks", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R19", "high/desktop/R08"], "benchmark": "worlds-1", "fix": "Conceded. Studded baseplate or stepped-plate material on slopes and shoulders, with a lit plate edge every 0.4 m of rise. Test: the R19 lower-right bank and R08 shoulder show studs or plate steps."},
    {"id": "G-gauge-10-clipped", "category": "typography", "expectedGain": 0.5, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/mobile/R04", "high/landscape/R04"], "benchmark": "drive-3", "fix": "Conceded. Move the 10-gallon tile inside the gauge panel or allow overflow with 4 px right padding. Test: at least 3 px of dark tile on both sides of the glyphs on all three viewports."},
    {"id": "G-creek-ford-reads-stone", "category": "authenticity", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R19", "ab/high-desktop-R19"], "benchmark": "bj-3", "fix": "Conceded; gain lowered because the defect is limited to one course. Tint the ford toward (90,140,170), add a scrolling ripple highlight and white foam plates at banks and wheels. Test: mean ford colour blue-dominant (B more than R+15) in high/desktop/R19."},
    {"id": "G-forest-courses-interchangeable", "category": "scenery", "expectedGain": 0.3, "severity": 2, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R08", "high/desktop/R10", "high/desktop/R11"], "benchmark": "drive-1", "fix": "Lowered: R10 is a terracotta tile road, R08 grey asphalt with a stone wall, R11 a dusk road with a ridge tower. Still add one hero set piece per course (Mountain Tower at the switchbacks, overlook rail on West Mountain). Test: each course frame contains a unique landmark."},
    {"id": "G-judge-stop-weak", "category": "readability", "expectedGain": 0.2, "severity": 1, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R16", "strips/high/R16"], "benchmark": "drive-3", "fix": "Cause narrowed: the stop already reads through the studded line and the RING AROUND THE TUB! banner; only the judges are anonymous. Two striped-shirt judges with clipboard and flag at the line. Test: judges identifiable in high/desktop/R16."},
    {"id": "G-results-static", "category": "ui", "expectedGain": 0.2, "severity": 1, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R18", "high/mobile/R18"], "benchmark": "drive-2", "fix": "Lowered: an animated podium is a 9-anchor feature; UI is held under 7 by the clips, not by the results table. Top-3 crews on a brick podium behind the panel. Test: R18 shows the podium crews."},
    {"id": "G-repeated-dressing", "category": "scenery", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R04", "high/desktop/R07"], "benchmark": "worlds/worlds-1.jpg", "fix": "Lowered: building height, brick colour and awning colour already vary along R04; the uniform part is crowd spacing. Curated crowd clusters and gaps and distinctive corner props. Test: three successive street sections recognisable by silhouette."},
    {"id": "G-hud-scale", "category": "typography", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/landscape/R02"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Lowered: the large place readout against small labels is the intended hierarchy, legend glyphs are 10 px and outlined; the landscape name stacking belongs to G-landscape-selection. Set a 12 px minimum for secondary labels at display scale."}
  ]
}
```
