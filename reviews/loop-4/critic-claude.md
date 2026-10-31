# Critic A (critic-claude): loop 4, High tier

## Verdict
Spa City Tub Rally now reads as a stylised brick-toy racer. The figures are its strongest asset: printed faces with expression, printed team uniforms, glossy bevelled parts, and twelve crews that read as different teams. The world around them still looks like a low-poly town that has been given brick textures, not a world built from bricks. The new brick-stepped ridge rings are drawn as flat, unlit, single-colour fills. One RGB value, (63,94,69), covers 17.9 % of `high/desktop/R05` and 12.3 % of `high/desktop/R06`. At dusk the ridge is a navy cut-out against a flat salmon sky (`high/desktop/R07`). Terrain banks and the creek ford have no material read. On High, smooth surfaces show a measurable vertical striping in every close-up. In the hero close-up the bath water is a pale-blue triangular shard poking through the duck (`crops/high/R02-preview-captain`). Feedback during slides and fumbles is limited to round blue beads, with no camera kick and no visible steam charge (`strips/high/R14`, `strips/high/R15`). The HUD and menus are consistent and readable. Two clipping bugs remain: the water gauge's "10" tile is cut in half on all three viewports, and the fourth row of the landscape team grid is cut off. Nothing reaches the 7 gate yet. Characters is closest.

## Scores (High, desktop; phones for mobile and readability)

**Characters: 6.5.** On the figures alone I would give 7. In `crops/high/R04-kart_3` the Out-of-Towners have scowling printed faces, tie-dye prints and antenna caps. In `crops/high/R03-kart_5` Lather & Linen have swirl hats, smiles, a cream tub with a gold rim and a studded chassis. `crops/high/R03-player-rear` shows firefighter helmets with the rear brim, X-suspender back prints and reflective bands. In `crops/high/R02-preview-captain` the captain has a shocked open-mouth print and the crew member on the right a big grin. The rolled tub rim is smooth, with no facets. All teams visible at chase distance are distinct (`high/desktop/R03`, `high/desktop/R12`, `high/desktop/R11`). The close-ups do not fully hold up:
- In `crops/high/R02-preview-captain` the water is a flat translucent blue triangle sticking out on both sides of the duck. The rest of the interior is empty grey, so the tub reads as empty in `crops/high/R02-preview` and `crops/high/R03-player` too.
- The same captain crop shows periodic vertical striping on the tub interior: column-mean residual amplitude 2.79 grey levels at a 10 px period. On Low crops it is 0.5.
- There are no studs on hats or on the tub body. Only the chassis carries studs.

Against `drive-4` (9.5) the parts lack seams and mould lines, and the faces are simple two-dot prints. Against the `worlds-1` figures (6.5) this is ahead at close range.

**Materials: 6.0.** Figures, tubs and the duck have convincing plastic sheen with highlights that follow bevels (`crops/high/R03-kart_1`, `crops/high/R04-player`). Studs show on grass verges (`high/desktop/R11`, `high/desktop/R12`), awning tiles (`high/desktop/R03`) and the judge stop line (`high/desktop/R16`). Large areas have no material read at all:
- The ridge rings are single flat RGB fills with no lighting. In a 550×100 patch of `high/desktop/R05` ridge, 48,217 of 55,000 pixels are exactly (63,94,69). A 330×200 patch of `high/desktop/R06` contains only 6 distinct colours.
- Terrain banks are flat untextured green. The bank fills the lower-right third of `high/desktop/R19`, and the shoulder wedge in `high/desktop/R08` is plain grey.
- Building bricks are a texture on flat walls: the lit top edges are painted on, with no relief (`high/desktop/R05` wall at 3× zoom).
- The Gulpha Creek ford averages (138,140,137), a neutral grey, and reads as flagstone, not clear water (`high/desktop/R19`).
- High shows the vertical striping described under Characters (`crops/high/R02-preview-rear`: amplitude 1.41 levels at a 10 px period).

Below `worlds-1` (7), where every surface is a recognisable brick part.

**Scenery: 6.5.** The town is coherent:
- Brick-textured shopfronts with striped studded awnings.
- Crowds with printed faces behind railings (`high/desktop/R03`).
- A recognisable Fordyce (`high/desktop/R05`) and Arlington (`high/desktop/R06`).
- Stacked-plate spruces and offset-cluster maples, including an autumn orange one (`high/desktop/R12`).
- Verge shrubs and studded rocks (`high/desktop/R12`).
- Goat Rock as white studded boulders.

The horizon has the opposite problem. The brick-stepped ridges have the right silhouette, but as flat walls they read as cardboard flats. The near ring is dark and heavy: 17.9 % of `high/desktop/R05` is one colour, and it blocks the sky. The far ring in `high/desktop/R12` is a pale paper band, (188,206,195) against a sky of (188,216,228). `high/desktop/R08`, `high/desktop/R10` and `high/desktop/R11` are interchangeable pine-lined mountain roads. Hill Wheatley Plaza in `high/desktop/R17` is an empty brick disc, and the new fountain centrepiece is not in frame. Below `worlds-1` (7.5) and well below `drive-1` (9).

**Lighting: 6.0.** On High the scene is grounded:
- Tubs get contact shadows and a ring, and figures get soft darkening at the feet (`high/desktop/R03`; 3× zoom of the left rival crew).
- Tree shadows fall across the road (`high/desktop/R08`).
- Dusk lamp pools no longer clip: the sidewalk in `high/desktop/R07` peaks at 204 of 255, 99th percentile 190.

The atmosphere is weak:
- Skies are plain gradients.
- The ridge rings carry no gradient or sun response. In `high/desktop/R07` the dusk ridge is a single navy (35,37,64) wall against a salmon (157,95,86) sky.
- The sunset in `high/desktop/R11` is a dull peach fade, from (163,122,122) at the top to (206,150,112) at the horizon, with no sun, glow or bloom.
- Day frames have no aerial perspective inside a ring.
- The High-only striping looks like a render-pass artefact.

`worlds-4` (6.5–7.5) has a sun disc, haze and glow, and this has none of them.

**Animation: 6.0.** In `strips/high/R15` the crew push-runs and circles the tub with rigid limbs swinging at the joints, the correct toy articulation. Positions change visibly from frame to frame, and splash beads ring the tub. In `strips/high/R16` the crew circles at the judge line while the progress bar fills. In `strips/high/R14` spray beads come off the rear wheels as the tub yaws. Missing:
- No camera kick or roll in any strip.
- No visible "hot steam" charge in R14, despite the capture's name: no steam puffs, colour tiers or sparks.
- No anticipation or follow-through.
- No visible water slosh at play size.
- In frame 8 of R14 the tub slides onto the sidewalk with a lamp post standing inside its ring, with no hit reaction.
- The beads in R15 frames 3–6 are large opaque spheres that cover the tub rather than splashing.

`drive-3` effects sit at 8.5.

**UI / HUD: 6.5.** The hierarchy is clear: lap and time top-left, place top-right, item bubble and coin count top-centre, water gauge bottom-left, minimap bottom-right (`high/desktop/R04`, `high/desktop/R14`). Menus share one brick-button style with even stud rows (`high/desktop/R01`, `high/desktop/R02`, `high/desktop/R18`). Defects:
- The 10-gallon tile is clipped by the gauge edge. On row y=711 of `high/desktop/R04` the dark tile runs from x=142, the "0" glyph's right stroke sits on x=159, and the road shows at x=160, so half the "0" is cut. The same happens in `high/mobile/R04` and `high/landscape/R04`.
- The item legend (Towel/Bath/Soap/Loofah) is about 10 px type.
- Results is a static table over a blurred street, with no podium or crew (`high/desktop/R18`).

Short of `drive-3` and `drive-2` (8.5).

**Typography: 6.5.** The chunky pixel display face for LAP, place, READY, RESULTS and CHOOSE YOUR TEAM and the rounded sans for body text form a clear scale, and the numerals read at a glance (`high/desktop/R04`, `high/mobile/R04`, `high/desktop/R18`). Text is clipped in two places: the "10" glyph above, and "Stock ·" and the fourth row of team cards in `high/landscape/R02`. The legend labels are small on desktop (`high/desktop/R14`). The pixel face reads more as retro-voxel than brick-toy, but it is consistent.

**Readability: 6.5.** The player tub stands out with its coloured ring and marker. Pickups glow (`high/desktop/R10`, `high/desktop/R17`), and road edges are crisp white lines (`high/desktop/R04`, `high/mobile/R03`). Problems:
- Near tree canopies still cover big parts of the frame: at least 16.5 % in `high/desktop/R11` (right side above y=400 alone), 12.7 % in `high/desktop/R08` (top-left) and 16.7 % in `high/desktop/R19` (top-right).
- Packs stack into one file, so rival tubs merge behind the player's crew (`high/desktop/R10`, `high/mobile/R07`).
- In `high/desktop/R19` the sage crew and tan ring sit on tan pavers beside a green bank, which is low contrast.
- In `high/desktop/R16` the judge is a small striped figure beside a grey booth and does not read as a judge stop. The studded stop line does read.

`drive-3` (9) is far off.

**Mobile: 6.5.** Portrait is framed on purpose: the tub sits mid-screen and the thumb controls are well below it in every portrait race frame (`high/mobile/R03`, `high/mobile/R07`, `high/mobile/R08`). Portrait team select fits without scrolling, with the preview tub fully above the panel and all four stats in two columns (`high/mobile/R02`). In landscape the controls stay at the edges (`high/landscape/R04`). Proxy performance passes (swiftshader low mobile min 53 fps). Short of 7 because:
- The landscape team grid's fourth row (Suds Posse, Flamingo Flock, Tub Ninjas) is cut off by the panel bottom (`high/landscape/R02`).
- The "10" tile is clipped on both phone viewports.
- The legend text is tiny.

**Authenticity: 6.5.** Bathhouse Row reads as the Row:
- The Fordyce and Arlington are recognisable, and the Quapaw-style mosaic dome appears (`high/desktop/R05`, `high/desktop/R06`, `high/desktop/R14`).
- Hot Springs Mountain rises in brick steps behind the Row (`high/desktop/R01`, `high/desktop/R04`).
- A lattice observation tower tops the ridge in `high/desktop/R11`.
- The race identity shows: water gauge in gallons, Towel/Bath/Soap/Loofah items, duck, flag, judge-stop event (`high/desktop/R16`) and the CLEAN water check on results (`high/desktop/R18`).

Shortfalls:
- The Gulpha Creek ford reads as a stone pad, not a creek (`high/desktop/R19`).
- The mountain courses are generic (`high/desktop/R08`, `high/desktop/R10`).
- Bridge Street (`high/desktop/R13`) has nothing a local would name.
- The judges are anonymous.

## IP check
Clean. Heads are rounded square blocks with printed faces, not cylinders with studs. Hands are block fists, not C-shaped clips. Torsos are near-rectangular boxes. No LEGO name or logo appears anywhere. The studded brick buttons and panel stud rows are generic brick motifs.

## Ranked gaps
1. **G-ridge-flat-fill** (scenery, WS4, severity 4, M, +0.5): the ridge rings are unlit single-colour fills that wall off the sky. Fix: light the stepped faces from the sun, add a vertical gradient toward haze at each ring's base, jitter value ±4 % per 6 m column, and lighten the nearest ring so the sky shows. Test: no single RGB value covers more than 2 % of any day frame (now 17.9 % in `high/desktop/R05`).
2. **G-dusk-sunset-sky** (lighting, WS1, severity 4, M, +0.5): dusk and sunset are flat fills behind a navy wall. Fix: a sun disc and horizon glow band on the sky dome, brick-plate clouds lit from the sun side, ridges tinted toward the glow colour with distance, and a small bloom on lamp heads. Test: in R07 and R11 the horizon band is at least 1.3× the zenith's luminance and the sun or glow is visible.
3. **G-slide-fumble-feedback** (animation, WS3, severity 4, M, +1.0): slides and fumbles have beads only. Fix: brick steam puffs at the rear wheels that change colour per charge tier, a 2–3° camera roll into the slide, an FOV kick on release, a 0.15 s camera shake on fumble, and smaller, sparser translucent splash beads. Test: `strips/high/R14` shows a charge-colour change across frames 1→8, and the strips show a visible horizon offset.
4. **G-high-ao-striping** (materials, WS1, severity 3, S, +0.5): periodic vertical stripes on smooth surfaces at High only. Fix: use an interleaved per-pixel rotated noise kernel, blur in both axes, and upsample depth-aware bilinear. Test: column-mean residual amplitude below 0.7 grey levels on `crops/high/R02-preview-captain` (now 2.79).
5. **G-tub-water-sheet** (characters, WS2, severity 3, S, +0.5): the tilted water sheet pokes through as a triangle and the interior reads as empty. Fix: clip the sheet to the inner-rim profile at fill height, raise its opacity and saturation toward (90,160,200), and add a meniscus highlight. Test: no water pixels outside the inner rim in the R02 and R03 close-ups, and water covers at least 70 % of the visible interior at full gauge.
6. **G-near-canopy-cover** (readability, WS5, severity 3, M, +0.5): near canopies cover 12–17 % of race frames. Fix: also hide any tree within 8 m whose screen bounds overlap the top 40 % of the frame over the road, or keep tree placement at least 4 m off the road edge on mountain courses. Test: no single tree covers more than 5 % of any race frame (R08, R11, R19).
7. **G-landscape-team-grid-clip** (mobile, WS6, severity 3, S, +0.5): the fourth row of cards is cut off. Fix: a 4-column grid or shorter cards so the 12 cards fit in 3 rows at 844×390. Test: every card is fully visible in `high/landscape/R02`.
8. **G-flat-terrain-banks** (materials, WS4, severity 3, M, +0.5): slopes and shoulders are flat untextured fills. Fix: studded baseplate or stepped-plate material on slopes, with a lit plate edge every 0.4 m of rise. Test: the R19 lower-right and R08 shoulder show studs or plate steps.
9. **G-gauge-10-clipped** (typography, WS6, severity 2, S, +0.5): the "10" tile is clipped at the gauge edge. Fix: move the tile inside the panel or allow overflow with 4 px right padding. Test: at least 3 px of dark tile on both sides of the glyphs on desktop, portrait and landscape.
10. **G-creek-ford-reads-stone** (authenticity, WS1, severity 2, S, +0.5): the ford is grey stone. Fix: tint it toward (90,140,170), add a scrolling ripple highlight and white foam plates at the banks and wheels. Test: mean colour over the ford is blue-dominant (B more than R+15) in `high/desktop/R19`.
11. **G-forest-courses-interchangeable** (scenery, WS4, severity 3, L, +0.5): R08, R10 and R11 are the same pine road. Fix: one hero set piece per course, for example the Mountain Tower at the switchbacks, a city-view overlook rail on West Mountain, and a sunset-facing rock cut. Test: each course frame contains a unique landmark.
12. **G-judge-stop-weak** (readability, WS5, severity 2, S, +0.3): the judge stop reads only through its stop line. Fix: two striped-shirt judges with clipboard and flag at the line, and a bright "JUDGES" banner on the booth. Test: the judges are identifiable in `high/desktop/R16` and the mobile frames.
13. **G-results-static** (ui, WS6, severity 2, M, +0.5): results is a plain table. Fix: put the top-3 crews on a brick podium behind the panel, with an animated row reveal. Test: R18 shows the podium crews.

## A/B
- **characters: A (0.65).** A's rolled rim is smooth. B's rim is visibly faceted into flat segments in every close-up (`ab/crop-R03-player`, `ab/crop-R02-preview-captain`, `ab/crop-R15-player`, `ab/crop-R03-kart_5`). A does show fine vertical striping on tub sides: mean |Δx| 0.36–0.59 versus 0.03–0.10 in B on `ab/crop-R03-kart_1`. B's water patches read slightly bluer.
- **materials: B (0.5).** B's surfaces are clean. A has the striping (`ab/crop-R03-kart_1`, `ab/crop-R02-preview-captain`). B's creek ford reads as water, mean (80,111,124), against A's greyer (99,110,109) (`ab/high-desktop-R19`). A's flat ridge fills replace B's richer backdrop (`ab/high-desktop-R05`). Brick walls look alike (`ab/high-desktop-R05`).
- **scenery: A (0.6).** A's stepped ridges and verge shrubs, flowers and rocks keep the world brick-built (`ab/high-desktop-R09`, `ab/high-desktop-R12`, `ab/high-desktop-R01`). B's painted panorama is prettier but off-style (`ab/high-desktop-R05`, `ab/high-desktop-R06`).
- **lighting: B (0.55).** B's painted dusk and sunset skies with glow and clouds beat A's flat navy and salmon walls (`ab/high-desktop-R07`, `ab/high-desktop-R11`, `ab/high-mobile-R07`). A has occlusion darkening around figures, awnings and wall feet: an A−B difference map of `ab/high-desktop-R03` darkens the area below the horizon by about 5 levels. A's lamp pools no longer clip, with the sidewalk peaking at 203 against B's 237 (`ab/high-desktop-R07`).
- **animation: tie (0.4).** Crew motion is the same in both. A's slide spray fans off the wheels a little more cleanly, and B's beads are larger, but the difference is small (`ab/strip-R14`, `ab/strip-R15`, `ab/strip-R16`).
- **ui: A (0.75).** A's phone team select fits both orientations. B cuts off the Handling row and the captain line behind the buttons (`ab/high-mobile-R02`, `ab/high-landscape-R02`). A's landscape minimap clears the place readout (`ab/high-landscape-R04`). A's "10" tile is clipped where B's is just tiny (`ab/high-mobile-R04`).
- **typography: A (0.6).** B clips stat and detail text on phones, while A's larger "10" is itself clipped (`ab/high-mobile-R02`, `ab/high-landscape-R02`, `ab/high-mobile-R04`).
- **readability: A (0.55).** In B a half-faded rival tub drifts across the player's tub through frames 4–8 of `ab/strip-R16`, while A stays clean. B's half-faded canopies show more road edge in `ab/high-desktop-R11` and `ab/high-desktop-R08`.
- **mobile: A (0.75).** `ab/high-mobile-R02`, `ab/high-landscape-R02`, `ab/high-landscape-R04`.
- **authenticity: A (0.6).** Hot Springs Mountain rises behind Bathhouse Row in A, which is true to place. B shows open sky (`ab/high-desktop-R01`, `ab/high-desktop-R04`, `ab/high-desktop-R14`). B's creek reads better (`ab/high-desktop-R19`).

```json
{
  "loop": 4,
  "role": "critic-claude",
  "tier": "high",
  "scores": {
    "characters": {
      "score": 6.5,
      "confidence": 0.55,
      "evidence": [
        {"shot": "crops/high/R04-kart_3", "note": "Out-of-Towners: scowling printed faces, tie-dye prints, antenna caps; strong team identity"},
        {"shot": "crops/high/R03-kart_5", "note": "Lather & Linen: swirl hats, smiles, gold-rimmed cream tub, studded chassis"},
        {"shot": "crops/high/R02-preview-captain", "note": "Bath water is a blue triangular shard poking through the duck; interior empty grey; vertical striping amplitude 2.79 levels at 10 px period"},
        {"shot": "crops/high/R03-player-rear", "note": "Helmet rear brim, X-suspender back print, reflective bands hold up"},
        {"shot": "high/desktop/R03", "note": "Teams distinct at chase distance; no studs on hats or tub body"}
      ]
    },
    "materials": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R05", "note": "Ridge is a single unlit RGB (63,94,69) covering 17.9% of the frame; bricks are painted texture on flat walls"},
        {"shot": "high/desktop/R06", "note": "330x200 ridge patch has only 6 distinct colours"},
        {"shot": "high/desktop/R19", "note": "Creek ford mean (138,140,137) reads as grey flagstone; lower-right bank is an untextured green fill"},
        {"shot": "crops/high/R02-preview-rear", "note": "Plastic sheen good, but periodic vertical striping (1.41 levels, 10 px period) vs 0.5 on Low"},
        {"shot": "high/desktop/R12", "note": "Studded baseplate verges, studded rocks; tree plates flat matte"}
      ]
    },
    "scenery": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R05", "note": "Fordyce recognisable; dark ridge wall blocks the sky"},
        {"shot": "high/desktop/R12", "note": "Verge shrubs, rocks, autumn maple; far ridge a pale paper band (188,206,195) against sky (188,216,228)"},
        {"shot": "high/desktop/R17", "note": "Plaza is an empty brick disc; fountain centrepiece not in frame"},
        {"shot": "high/desktop/R10", "note": "Brick tile road and plate trees; interchangeable with R08 and R11"},
        {"shot": "high/desktop/R03", "note": "Coherent shopfronts, studded awnings, printed-face crowds"}
      ]
    },
    "lighting": {
      "score": 6.0,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R07", "note": "Dusk: flat navy ridge (35,37,64) against flat salmon sky; lamp pools peak 204/255, no clipping"},
        {"shot": "high/desktop/R11", "note": "Sunset is a dull peach fade, no sun, glow or bloom"},
        {"shot": "high/desktop/R03", "note": "Contact shadows, rings and soft foot darkening ground the tubs"},
        {"shot": "high/desktop/R08", "note": "Tree shadows on road; ridge flat with no aerial perspective"},
        {"shot": "crops/high/R02-preview-captain", "note": "High-only striping artefact on smooth surfaces"}
      ]
    },
    "animation": {
      "score": 6.0,
      "confidence": 0.5,
      "evidence": [
        {"shot": "strips/high/R15", "note": "Crew push-runs and circles the tub with rigid limbs swinging at joints; splash beads are large opaque spheres covering the tub; no camera shake"},
        {"shot": "strips/high/R14", "note": "Spray beads off rear wheels; no visible steam charge or colour tier, no camera roll; frame 8 tub slides onto sidewalk with a lamp post inside its ring"},
        {"shot": "strips/high/R16", "note": "Crew circles at the judge line while progress fills; no anticipation or follow-through"}
      ]
    },
    "ui": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Clear HUD hierarchy; '10' tile clipped by gauge edge (glyph at x=159, road at x=160 on row y=711)"},
        {"shot": "high/desktop/R02", "note": "Consistent brick-button style, even stud rows, readable team cards"},
        {"shot": "high/desktop/R18", "note": "Results is a static table, no podium or crews"},
        {"shot": "high/landscape/R02", "note": "Fourth row of team cards clipped by the panel bottom"}
      ]
    },
    "typography": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Pixel display face plus rounded sans form a clear scale; numerals read at a glance"},
        {"shot": "high/mobile/R04", "note": "'10' glyph cut at the tile edge on phone too"},
        {"shot": "high/landscape/R02", "note": "'Stock ·' and team-card labels clipped"},
        {"shot": "high/desktop/R14", "note": "Item legend labels about 10 px"}
      ]
    },
    "readability": {
      "score": 6.5,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R11", "note": "Opaque near canopy covers at least 16.5% of the frame on the right"},
        {"shot": "high/desktop/R08", "note": "Top-left canopy 12.7% of frame; pack in single file"},
        {"shot": "high/desktop/R19", "note": "Sage crew and tan ring on tan pavers; top-right canopy 16.7%"},
        {"shot": "high/desktop/R16", "note": "Stop line reads; judge is a small striped figure by a grey booth"},
        {"shot": "high/mobile/R03", "note": "Player tub, marker and road edges clear on phone"},
        {"shot": "high/mobile/R07", "note": "Dusk pack merges into one mass behind the player"}
      ]
    },
    "mobile": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/mobile/R02", "note": "Portrait team select fits, preview tub fully framed, stats in two columns"},
        {"shot": "high/landscape/R02", "note": "Fourth row of team grid cut off"},
        {"shot": "high/mobile/R08", "note": "Thumb controls well below the tub"},
        {"shot": "high/landscape/R04", "note": "Controls at the edges; '10' tile clipped; minimap clear of place readout"}
      ]
    },
    "authenticity": {
      "score": 6.5,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R01", "note": "Hot Springs Mountain rises behind the Row"},
        {"shot": "high/desktop/R06", "note": "Arlington twin towers recognisable"},
        {"shot": "high/desktop/R14", "note": "Mosaic dome bathhouse on the Row"},
        {"shot": "high/desktop/R19", "note": "Gulpha Creek ford reads as a stone pad, not a creek"},
        {"shot": "high/desktop/R18", "note": "Water gallons and CLEAN check show the real race rules"}
      ]
    }
  },
  "ab": {
    "characters": {"winner": "A", "confidence": 0.65, "pairs": ["ab/crop-R03-player", "ab/crop-R02-preview-captain", "ab/crop-R15-player", "ab/crop-R03-kart_5", "ab/crop-R03-kart_1"], "note": "A's rolled rim is smooth; B's rim is faceted in every close-up. A has faint vertical striping on tub sides (mean |dx| 0.36-0.59 vs 0.03-0.10)."},
    "materials": {"winner": "B", "confidence": 0.5, "pairs": ["ab/crop-R03-kart_1", "ab/crop-R02-preview-captain", "ab/high-desktop-R19", "ab/high-desktop-R05"], "note": "B surfaces are clean where A stripes; B's creek reads as water (80,111,124) against A's grey (99,110,109); A's ridge is a flat fill."},
    "scenery": {"winner": "A", "confidence": 0.6, "pairs": ["ab/high-desktop-R09", "ab/high-desktop-R12", "ab/high-desktop-R01", "ab/high-desktop-R05", "ab/high-desktop-R06"], "note": "A's stepped ridges and verge props keep the world brick-built; B's painted panorama is prettier but off-style."},
    "lighting": {"winner": "B", "confidence": 0.55, "pairs": ["ab/high-desktop-R07", "ab/high-desktop-R11", "ab/high-mobile-R07", "ab/high-desktop-R03"], "note": "B's dusk and sunset glow beats A's flat navy and salmon walls; A has visible occlusion around figures and non-clipping lamp pools (203 vs 237)."},
    "animation": {"winner": "tie", "confidence": 0.4, "pairs": ["ab/strip-R14", "ab/strip-R15", "ab/strip-R16"], "note": "Same crew motion; A's spray fans off the wheels slightly more cleanly; within noise."},
    "ui": {"winner": "A", "confidence": 0.75, "pairs": ["ab/high-mobile-R02", "ab/high-landscape-R02", "ab/high-landscape-R04", "ab/high-mobile-R04"], "note": "B clips stats and details behind the buttons on phones and its minimap touches the place readout; A's '10' tile is clipped."},
    "typography": {"winner": "A", "confidence": 0.6, "pairs": ["ab/high-mobile-R02", "ab/high-landscape-R02", "ab/high-mobile-R04"], "note": "B clips stat and detail text; A's larger '10' is itself clipped."},
    "readability": {"winner": "A", "confidence": 0.55, "pairs": ["ab/strip-R16", "ab/high-desktop-R11", "ab/high-desktop-R08", "ab/high-desktop-R19"], "note": "B draws a half-faded rival across the player's tub in R16 frames 4-8; B's half-faded canopies show more road edge in R11 and R08."},
    "mobile": {"winner": "A", "confidence": 0.75, "pairs": ["ab/high-mobile-R02", "ab/high-landscape-R02", "ab/high-landscape-R04"], "note": "A fits the phone team select in both orientations and moves the landscape minimap clear."},
    "authenticity": {"winner": "A", "confidence": 0.6, "pairs": ["ab/high-desktop-R01", "ab/high-desktop-R04", "ab/high-desktop-R14", "ab/high-desktop-R19"], "note": "A shows Hot Springs Mountain behind the Row; B shows open sky. B's creek reads better."}
  },
  "ip": {"clean": true, "notes": "Heads are rounded square blocks with printed faces, hands are block fists, torsos near-rectangular; no minifigure silhouette, no LEGO name or logo. Stud motifs on menu buttons are generic."},
  "gaps": [
    {"id": "G-ridge-flat-fill", "category": "scenery", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06", "high/desktop/R12"], "benchmark": "worlds-1", "fix": "Light the stepped ridge faces from the sun, add a vertical gradient to haze at each ring's base, jitter value +/-4% per 6 m column, lighten the nearest ring so the sky shows. Test: no single RGB value covers more than 2% of any day frame (now 17.9% in R05)."},
    {"id": "G-dusk-sunset-sky", "category": "lighting", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/desktop/R11"], "benchmark": "worlds-4", "fix": "Sky dome with sun disc and horizon glow band, brick-plate clouds lit from the sun side, ridges tinted toward the glow with distance, small bloom on lamp heads. Test: in R07 and R11 the horizon band is at least 1.3x the zenith's luminance and the sun or glow is visible."},
    {"id": "G-slide-fumble-feedback", "category": "animation", "expectedGain": 1.0, "severity": 4, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15"], "benchmark": "drive-3", "fix": "Brick steam puffs at the rear wheels that change colour per charge tier, 2-3 degree camera roll into the slide, FOV kick on release, 0.15 s camera shake on fumble, smaller and sparser translucent splash beads. Test: R14 strip shows a charge-colour change across frames 1-8 and the strips show a visible horizon offset."},
    {"id": "G-high-ao-striping", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["crops/high/R02-preview-captain", "crops/high/R02-preview-rear", "crops/high/R03-player"], "benchmark": "bj-1", "fix": "Interleaved per-pixel rotated noise kernel for the High occlusion pass, blur in both axes, depth-aware bilinear upsample. Test: column-mean residual amplitude below 0.7 grey levels on crops/high/R02-preview-captain (now 2.79)."},
    {"id": "G-tub-water-sheet", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R02-preview-captain", "crops/high/R02-preview", "crops/high/R03-player"], "benchmark": "drive-4", "fix": "Clip the tilted water sheet to the tub's inner-rim profile at fill height, raise its opacity and saturation toward (90,160,200), add a meniscus highlight. Test: no water pixels outside the inner rim in the R02 and R03 close-ups; water covers at least 70% of the visible interior at full gauge."},
    {"id": "G-near-canopy-cover", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R11", "high/desktop/R08", "high/desktop/R19"], "benchmark": "drive-3", "fix": "Also hide trees within 8 m whose screen bounds overlap the top 40% of the frame over the road, or keep mountain-course trees at least 4 m off the road edge. Test: no single tree covers more than 5% of any race frame."},
    {"id": "G-landscape-team-grid-clip", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R02"], "benchmark": "drive-2", "fix": "4-column grid or shorter cards so all 12 team cards fit in 3 rows at 844x390. Test: every card fully visible in high/landscape/R02."},
    {"id": "G-flat-terrain-banks", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R19", "high/desktop/R08"], "benchmark": "worlds-1", "fix": "Studded baseplate or stepped-plate material on slopes and shoulders, with a lit plate edge every 0.4 m of rise. Test: the R19 lower-right bank and R08 shoulder show studs or plate steps."},
    {"id": "G-gauge-10-clipped", "category": "typography", "expectedGain": 0.5, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/mobile/R04", "high/landscape/R04"], "benchmark": "drive-3", "fix": "Move the 10-gallon tile inside the gauge panel or allow overflow with 4 px right padding. Test: at least 3 px of dark tile on both sides of the glyphs on all three viewports."},
    {"id": "G-creek-ford-reads-stone", "category": "authenticity", "expectedGain": 0.5, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R19"], "benchmark": "bj-3", "fix": "Tint the ford toward (90,140,170), add a scrolling ripple highlight and white foam plates at the banks and wheels. Test: mean ford colour is blue-dominant (B more than R+15) in high/desktop/R19 (now 138,140,137)."},
    {"id": "G-forest-courses-interchangeable", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R08", "high/desktop/R10", "high/desktop/R11"], "benchmark": "drive-1", "fix": "One hero set piece per mountain course: Mountain Tower at the switchbacks, city-view overlook rail on West Mountain, sunset-facing rock cut on Sunset Ridge. Test: each course frame contains a unique landmark."},
    {"id": "G-judge-stop-weak", "category": "readability", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R16", "strips/high/R16"], "benchmark": "drive-3", "fix": "Two striped-shirt judges with clipboard and flag at the stop line, a bright JUDGES banner on the booth. Test: judges identifiable in high/desktop/R16 and phone frames."},
    {"id": "G-results-static", "category": "ui", "expectedGain": 0.5, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R18", "high/mobile/R18"], "benchmark": "drive-2", "fix": "Top-3 crews on a brick podium behind the results panel with an animated row reveal. Test: R18 shows the podium crews."}
  ]
}
```
