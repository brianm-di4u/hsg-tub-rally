# Critic A (critic-claude): loop 10, high tier

## Verdict
Spa City Tub Rally reads as a coherent, playable brick-toy racer. On characters, UI, typography, mobile and authenticity it now matches or slightly beats the LEGO Worlds bar (`worlds-1`). On materials, scenery, lighting, animation and readability it is still half a point below it. The figures are the best asset: square-headed crews with printed faces, printed uniforms and studded helmets that hold up at 2× (`crops/high/R02-preview-captain`). The world is what keeps it from looking like a photographed toy:
- Facades are flat textured boxes with inset window quads.
- The Gulpha Creek ford is a blue tiled plane.
- The far hills are layered flat cards.
- The dusk streetlamps don't glow.
- Ambient occlusion is still hard to find at landmark scale.
- Every effect particle is the same shaded sphere.

The total is 67.5/100. Five gated categories fall short of 7: materials, scenery, lighting, animation and readability. In the A/B set, **B** is better in nine of ten categories, and lighting is a tie:
- the call-outs and the countdown sit clear of the vanishing point;
- the Out-of-Towners tub matches its card;
- the Hale's arches are no longer covered by floating panes;
- conifers no longer grow through broadleaf crowns;
- the steam reads neutral instead of tan.

## Scores (high tier, desktop unless noted)

### Characters: 7.0
- **For:** `crops/high/R02-preview-captain` at native 1280×800 holds up:
  - The captain has a printed open-mouth face and a printed coat with zip, hydrant badge and reflective bands.
  - The helmets have a shield badge and studs on top.
  - The water sheet cuts the torso cleanly, with no gaps or z-fighting.
- **Distinct teams:** `crops/high/R03-kart_5` (white tub with teal band, soft-serve swirl hats) and `crops/high/R04-kart_3` (tie-dye prints, antenna caps, teal tub with purple rim that now matches the teal card swatch) are clearly different teams. At chase distance the teams separate by print and hat: the Velvet Mob's H print (`high/desktop/R07`), tie-dye (`high/desktop/R11`), all-white Lather & Linen (`high/desktop/R13`), green Gator Gang (`high/desktop/R17`) and khaki ranger hats (`high/desktop/R19`).
- **Against:**
  - The tub is one smooth glossy shell with no part seams, studs or recognisable brick parts. The chassis plates in `crops/high/R03-player` show no top studs.
  - The fumble flash bleaches the whole crew. In `crops/high/R15-player` the helmets measure (237,185,177), against red (124,57,58) in `crops/high/R03-player`, so for a frame the team colours are gone.
- **Benchmark:** clearly above `worlds-1` (6.5) and far from `drive-4` (9.5) for print density, seams and mould lines. This is the gate, not more.

### Materials: 6.5
- **For:**
  - The studded baseplate grass has shaded studs (`high/desktop/R08`, lower-left slope).
  - The road tiles have seams.
  - Tubs and helmets carry glossy speculars that follow the rim (`crops/high/R02-preview-captain`).
  - Tree canopies are stacked plates with micro-studs (`high/desktop/R09`).
  - Window glass is now a soft glint.
- **Against:**
  - Every building is a flat box wearing a brick texture, with window quads inset and no sills, frames, ledges or bevels to catch light (`high/desktop/R06` Arlington; the left facade of `high/desktop/R04`).
  - The Fordyce's painted tile art reads as a decal on a flat wall (`high/desktop/R05`).
  - Roofs are flat red slabs.
  - The ford's water is a flat blue grid (`high/desktop/R19`).
  - There is no surface wear anywhere.
- **Benchmark:** below `worlds-1` (7), where roofs, fences and studs are geometry.

### Scenery: 6.5
- **For:**
  - One brick vocabulary across all 19 shots: baseplate grass, tile roads, brick walls, stacked-plate trees, stepped hills.
  - Each course has a set piece: the Row's striped awnings (`high/desktop/R04`), the Arlington (`high/desktop/R06`), the Goat Rock outcrop (`high/desktop/R09`), the radial brick plaza (`high/desktop/R17`), the studded white stop line at the judge (`strips/high/R16`).
  - Trees no longer interpenetrate (`high/desktop/R09`).
- **Against:**
  - The far rings are flat layered silhouettes with triangle-tree crenellation (top bands of `high/desktop/R09` and `high/desktop/R06`).
  - Every trail is the same terracotta plaza tile (`high/desktop/R09`, `high/desktop/R10`, `high/desktop/R19`).
  - The Gulpha Creek ford reads as blue floor tile (`high/desktop/R19`).
  - Near canopies are slabs at random yaw that look ragged rather than built (left side of `high/desktop/R11`, `high/desktop/R10`).
  - The same tree and storefront kits repeat (`high/desktop/R13`, `high/desktop/R14`).
- **Benchmark:** below `worlds-1` (7.5) for density and `drive-1` (9) for layering.

### Lighting: 6.5
- **For:**
  - Day, dusk and sunset each have a palette: orange dusk with long raking shadows (`high/desktop/R07`), a peach sunset (`high/desktop/R11`), a clear day (`high/desktop/R04`).
  - Soft directional tree shadows cross the road (`high/desktop/R08`, `high/desktop/R10`).
  - The haze on the far rings matches the sky (`high/desktop/R09`).
- **Against:**
  - At dusk the lamp globes are plain white, with no glow, bloom or light pool, and the shop windows are dark (`high/desktop/R07`).
  - No occlusion darkening is visible where walls meet the ground (the arcade base in `high/desktop/R06`, the Row wall in `high/desktop/R04`).
  - The R05/R06 A/B heat maps show only window-glint differences, so the AO change does not show at landmark scale.
  - There is no bounce colour.
  - The player's contact shadow is hidden under the yellow ring.
- **Benchmark:** the low end of `worlds-4` (6.5–7.5), nowhere near `bj-3`.

### Animation and feel: 6.5
- **For:**
  - `strips/high/R15`: a white hit flash, then four crew sprint a circle around the tub with limbs swinging at the joints while blue spray leaves the tub (frames 2–6).
  - `strips/high/R16`: the crew circle at the judge stand while the progress bar fills.
  - `strips/high/R14`: the crew push-run, a drift arc appears under the tub, steam and spray trail behind, and the camera swings with the slide (frames 5–8).
- **Against:**
  - Every particle is the same shaded sphere, so steam, spray and splash read as beads, not brick-built effects (`strips/high/R14` frames 2–8, `strips/high/R15` frames 3–6).
  - No strip frame shows legible water slosh from the chase camera.
  - The fumble has no anticipation, squash or camera kick: the camera is static across `strips/high/R15` frames 1–3.
  - Nothing pops off and snaps back.
- **Benchmark:** below the effects in `drive-3` (8.5).

### UI / HUD: 7.0
- **For:**
  - One consistent style: navy plates with a stud rail, pixel numerals, a bathtub water gauge with a 10-gallon line, an item legend and a minimap (`high/desktop/R04`).
  - The menus use brick-shaped buttons with studs (`high/desktop/R01`).
  - The results table has CLEAN tags (`high/desktop/R18`).
  - The call-outs now sit under the top row, clear of the road ("WARM STEAM" at about y 125–190 in `high/desktop/R19`; the task panel in `high/desktop/R16`).
  - Nothing overlaps on desktop.
- **Against:**
  - The empty item slot is a grey sphere placeholder (`high/desktop/R04`).
  - The HUD is static.
  - The legend labels are tiny.
  - The arcade pixel "8TH" doesn't belong to a plastic-toy world.
- **Benchmark:** below `drive-3` (8.5).

### Typography: 7.0
- **For:**
  - A clear scale: a pixel display face for titles, LAP, position and READY, and a humanist sans for the UI (`high/desktop/R01`, `high/desktop/R18`).
  - The numerals read at a glance ("0:07.00" and "8TH" in `high/desktop/R04`).
  - The selected card's division label is now dark on its light fill. Its darkest pixel measures luminance 30 against a (76,143,168) fill (`high/mobile/R02`).
  - Nothing is clipped on desktop.
- **Against:**
  - There are three faces (pixel display, bold sans call-outs, UI sans), and the pixel face works against the glossy plastic look.
  - Desktop team-card labels and the item legend run at about 9–11 px (`high/desktop/R02`).
  - "Engine Six Soakers (you)" wraps to two lines in the portrait results (`high/mobile/R18`).

### Readability: 6.5
- **For:**
  - The player is marked by a yellow ring and arrow in every race frame.
  - The road edge is white and the centre dashes yellow.
  - The Out-of-Towners' teal tub no longer reads as a second purple Velvet Mob tub (`high/desktop/R07`, `high/desktop/R11`).
  - Pickups are large iridescent bubbles (`high/desktop/R10`, `high/desktop/R17`).
- **Against:**
  - In `high/landscape/R03` the READY countdown covers about x 573–1113 and y 213–367 of the 1688×780 frame. That sits over the vanishing point and the entire grid ahead, ending about 60 px above the player's helmets.
  - Packs merge into one mass of figures (`high/desktop/R07`, `high/desktop/R11`).
  - The chase camera shows mostly crew backs, so the player's own tub is largely hidden (`high/desktop/R04`).
- **Benchmark:** far from `drive-3` (9).

### Mobile: 7.0
- **For:**
  - The thumb controls (Steer pill bottom-left; Item, Hop, Brake and Push bottom-right) never touch the tub in either orientation (`high/mobile/R04`, `high/mobile/R07`, `high/mobile/R17`, `high/landscape/R04`, `high/landscape/R08`, `high/landscape/R17`).
  - The portrait team select now shows the whole tub, wheels and crew feet above the panel (`high/mobile/R02`).
  - The phone proxies hold 30 fps easily: swiftshader low mobile at 52 fps minimum, 4× CPU at 216–308 fps.
- **Against:**
  - The stacked portrait top HUD ends at about y = 400 of 1688 (24% of the screen), and the player tub is small (`high/mobile/R04`).
  - The landscape team cards drop the division label, and Back sits orphaned under Choose (`high/landscape/R02`).
  - The landscape countdown covers the grid (`high/landscape/R03`).

### Authenticity: 7.0
- **For:**
  - The Arlington's twin towers, red roof and arcade close the vista (`high/desktop/R06`).
  - The Fordyce shows painted tile bands and a canopy (`high/desktop/R05`).
  - The Hale's arched windows at the judge stop are clean (`high/desktop/R16`).
  - The Quapaw dome sits on the Row (background of `high/desktop/R14`).
  - A lattice tower rises above Sunset Ridge (`high/desktop/R11`).
  - The real race shows: water gallons, duck, flag, the JUDGE stand, tickets.
- **Against:**
  - The mountains read as generic stepped conifer hills, not Ouachita ridgelines (`high/desktop/R09`).
  - The switchback signboard is blank (`high/desktop/R08`).
  - The Gulpha Creek ford looks like a tiled plaza (`high/desktop/R19`).
  - Nothing marks Bridge Street as Bridge Street (`high/desktop/R13`).

## A/B (A = left, B = right)
- **Characters, B (0.65):**
  - In `ab/crop-R04-kart_3`, B's Out-of-Towners tub is teal with a purple rim and hub, matching the crew's teal caps and the teal card swatch. A's purple tub reads as a second Velvet Mob.
  - `ab/high-desktop-R11` shows the same tub change.
  - `ab/crop-R15-player` and the other crops are identical poses or noise.
- **Materials, B (0.65):**
  - A's windows carry a hard diagonal stripe, B's a soft glint (`ab/high-desktop-R05`, `ab/high-desktop-R06` at 4×).
  - A has grey panes floating over the Hale's painted arches; B is clean (`ab/high-desktop-R16`).
  - A's steam puff is tan, (188,165,143), on the red brick; B's is neutral, (182,176,169) (`ab/high-desktop-R17`).
- **Scenery, B (0.75):**
  - In A, conifers grow through broadleaf crowns (centre of `ab/high-desktop-R09`, right of `ab/high-desktop-R08`, `ab/high-desktop-R10`). B separates the trees.
  - The Hale panes are gone in B (`ab/high-desktop-R16`).
  - `ab/high-landscape-R08` and `ab/high-mobile-R08` show the same tree change.
- **Lighting, tie (0.55):**
  - The R05/R06 heat maps show no occlusion difference, only the glints.
  - B's darker mid-distance crowns add some depth in `ab/high-desktop-R09`. The band's luminance standard deviation is 51.7 in B and 58.3 in A, so B's band is actually flatter. That is within noise.
- **Animation, B (0.6):**
  - B's particles are brighter and more opaque. The particle pixels that differ average about (148,162,170) in B against (124,137,145) in A, across seven of the eight frames of `ab/strip-R14`.
  - B's steam is neutral (`ab/high-desktop-R17`).
  - `ab/strip-R15` differs mainly in crew positions; I see no slosh difference.
- **UI, B (0.8):**
  - In A the call-outs and countdown sit over the vanishing point and the pack: READY in `ab/high-desktop-R03`, the fumble call-out in `ab/strip-R15`, the task panel in `ab/high-desktop-R16`, WARM STEAM in `ab/high-desktop-R19`. B tucks them under the top HUD row.
  - B's selected-card label is legible (`ab/high-mobile-R02`).
  - B's locked cards are less dim (locked title luminance 209 against 255 unlocked) but still carry the "locked" label.
- **Typography, B (0.6):** the selected card's "Traditional" label in A is pale on teal, with luminance never below 129 on the fill (`ab/high-mobile-R02`, `ab/high-desktop-R02`). B prints it dark, with luminance down to 30.
- **Readability, B (0.75):** B keeps READY off the grid (`ab/high-desktop-R03`), the call-outs off the road (`ab/high-desktop-R19`, `ab/strip-R15`), and the teal Out-of-Towners distinct from the purple Velvet Mob (`ab/crop-R04-kart_3`, `ab/high-desktop-R11`).
- **Mobile, B (0.7):**
  - In A the panel cuts the portrait team-select preview's wheels and crew feet; in B everything sits above it (`ab/high-mobile-R02`, `ab/low-mobile-R02`).
  - The landscape pairs are identical (`ab/high-landscape-R03` diff 0.27, `ab/high-landscape-R04` diff 0.26).
- **Authenticity, B (0.55):** the Hale's painted arches are clean in B (`ab/high-desktop-R16`). Everything else is equal.

## IP check
Clean, nothing resembles a minifigure:
- **Heads:** rounded cubes, not cylinders.
- **Torsos:** straight boxes, not trapezoids.
- **Hands:** mitten blocks with a thumb, not C-clips (`crops/high/R02-preview-captain`).

The hip-and-two-legs layout is generic block-figure construction. No LEGO name or logo appears anywhere. The studded menu buttons and plate rails are generic brick motifs.

## Ranked gaps
1. **G-facade-relief** (materials, WS4, sev 3, L, +0.5)
   - Problem: landmark and storefront facades are flat boxes with brick texture and inset window quads (`high/desktop/R06`, `high/desktop/R04`, `high/desktop/R05`).
   - Fix: build window surrounds as 1×2 plate and tile geometry standing 0.08 studs proud with a bevel normal, a 1×1 plate cornice per floor, and slope-brick roof edges.
   - Test: in R06, each sunlit window sill is at least 15 luminance brighter than the wall beside it.
2. **G-landscape-countdown** (readability, WS6, sev 3, S, +0.5)
   - Problem: in `high/landscape/R03`, READY covers the vanishing point and the grid.
   - Fix: on phone landscape, scale the countdown to 50% and place its top at 92 CSS px, as the task panel already is.
   - Test: no countdown pixel below 33% of the frame height in landscape R03.
3. **G-dusk-lamps** (lighting, WS1, sev 3, M, +0.5)
   - Problem: the dusk lamps and shop windows are unlit (`high/desktop/R07`).
   - Fix: make the lamp globes emissive with bloom, add a baked light decal on the sidewalk under each lamp, and give the shop windows a warm emissive on the dusk and sunset courses.
   - Test: in R07 the sidewalk under the nearest lamp is at least 20% brighter than the sidewalk between lamps.
4. **G-water-and-trails** (scenery, WS4, sev 3, M, +0.5)
   - Problem: the ford is blue floor tile, and every trail is terracotta plaza tile (`high/desktop/R19`, `high/desktop/R09`, `high/desktop/R10`).
   - Fix: give the water a transparent blue material with sky reflection, a scrolling normal and a white 1×1 round-plate foam edge. Build trails from tan and brown dirt plates scattered with 1×1 rocks.
   - Test: in R19 the water shows specular variation (luminance standard deviation of at least 12) and the trail hue differs from the plaza tile.
5. **G-brick-particles** (animation, WS3, sev 3, M, +0.5)
   - Problem: all effects are identical shaded spheres, and slosh is not legible (`strips/high/R14`, `strips/high/R15`).
   - Fix: emit tumbling transparent 1×1 round plates and studs at 0.5–1.5× size variation. On a fumble, add a 3-frame camera kick (FOV +6°) and pop a helmet or accessory off and snap it back. Raise the camera 0.3 m during slides and fumbles so the water surface shows.
   - Test: in the R15 strip the water's tilt is visible in at least 3 frames.
6. **G-ao-junctions** (lighting, WS1, sev 2, M, +0.3)
   - Problem: no visible occlusion where walls meet the ground at landmark scale (`high/desktop/R06`, `high/desktop/R04`).
   - Fix: scale the SSAO radius with distance (about 1.5 m at 100 m) and raise its intensity.
   - Test: in R06, a luminance drop of at least 10% within 0.5 m of the arcade's base.
7. **G-tub-brick-parts** (characters, WS2, sev 3, L, +0.4)
   - Problem: the tub is a seamless shell and the chassis has no studs (`crops/high/R03-player`, `crops/high/R02-preview`).
   - Fix: add a seam line where the rim meets the body, a stud row on the chassis top plates, and a printed team tile on the tub's side.
   - Test: the seam and studs are visible in the 2× close-up.
8. **G-far-ring-relief** (scenery, WS4, sev 2, M, +0.3)
   - Problem: the far hills are flat layered cards (`high/desktop/R09`, `high/desktop/R06`).
   - Fix: replace them with stepped brick terrain in 3–4 depth layers whose silhouettes follow the real ridgelines.
   - Test: no card edge visible in R09.
9. **G-landscape-team-select** (mobile, WS6, sev 2, S, +0.3)
   - Problem: the landscape cards drop the division label and Back is orphaned (`high/landscape/R02`).
   - Fix: show the division label at 11 px minimum and put Back in the same row as Choose.
10. **G-portrait-hud-height** (mobile, WS6, sev 2, M, +0.3)
    - Problem: the stacked top HUD fills 24% of the portrait screen (`high/mobile/R04`).
    - Fix: merge the water gauge and item legend into one row, or move the legend to the bottom-left above Steer.
    - Test: the HUD ends above 16% of the height.
11. **G-fumble-flash-bleach** (characters, WS3, sev 2, S, +0.2)
    - Problem: the whole crew whitens to pastel (`crops/high/R15-player` helmet at (237,185,177); `strips/high/R15` frame 1).
    - Fix: flash a rim or outline instead, keeping albedo at 70% or more of the team colour.
12. **G-signage** (authenticity, WS4, sev 2, S, +0.3)
    - Problem: the switchback signboard is blank (`high/desktop/R08`), and Bridge Street and the ford are unmarked (`high/desktop/R13`, `high/desktop/R19`).
    - Fix: add printed tile signs.
13. **G-tree-slab-yaw** (scenery, WS5, sev 2, S, +0.2)
    - Problem: near canopies are randomly yawed slabs that look ragged (`high/desktop/R11`, `high/desktop/R10`).
    - Fix: snap slab yaw to 0°, 45° or 90° and size the plates in whole studs.
14. **G-empty-item-slot** (ui, WS6, sev 1, S, +0.2)
    - Problem: the empty slot is a grey sphere placeholder (`high/desktop/R04`).
    - Fix: show a brick tile with a "?" stud print.

```json
{
  "loop": 10,
  "role": "critic-claude",
  "tier": "high",
  "scores": {
    "characters": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "crops/high/R02-preview-captain", "note": "printed faces, coat print, helmet badge and studs; clean at native res, no gaps or z-fighting" },
      { "shot": "crops/high/R04-kart_3", "note": "tie-dye prints, antenna caps; teal tub with purple rim matches the card" },
      { "shot": "crops/high/R03-kart_5", "note": "distinct team: white tub, swirl hats" },
      { "shot": "high/desktop/R07", "note": "Velvet Mob H print distinct at chase distance" },
      { "shot": "crops/high/R15-player", "note": "fumble flash bleaches helmets to (237,185,177) vs red (124,57,58) in R03-player" },
      { "shot": "crops/high/R03-player", "note": "tub is a seamless shell; chassis plates show no studs" }
    ] },
    "materials": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R08", "note": "studded baseplate grass with shaded studs" },
      { "shot": "crops/high/R02-preview-captain", "note": "glossy tub and helmet speculars" },
      { "shot": "high/desktop/R06", "note": "facades are flat textured boxes with inset window quads; no sills, ledges or bevels" },
      { "shot": "high/desktop/R05", "note": "painted facade art reads as a decal" },
      { "shot": "high/desktop/R19", "note": "ford water is a flat blue grid" }
    ] },
    "scenery": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R09", "note": "trees no longer interpenetrate; far rings are flat layered cards" },
      { "shot": "high/desktop/R17", "note": "radial brick plaza set piece" },
      { "shot": "high/desktop/R19", "note": "trail is the same terracotta plaza tile; water reads as tile" },
      { "shot": "high/desktop/R11", "note": "randomly yawed canopy slabs look ragged" },
      { "shot": "strips/high/R16", "note": "studded stop line at the judge" }
    ] },
    "lighting": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R07", "note": "deliberate dusk palette, but lamps unlit, no glow or pools" },
      { "shot": "high/desktop/R11", "note": "sunset palette" },
      { "shot": "high/desktop/R06", "note": "no visible occlusion at wall and ground junctions" },
      { "shot": "high/desktop/R10", "note": "soft directional tree shadows" }
    ] },
    "animation": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "strips/high/R15", "note": "hit flash, then the crew sprint a circle with limbs swinging; spray leaves the tub; static camera, no kick" },
      { "shot": "strips/high/R14", "note": "push-run, drift arc, steam; every particle is the same sphere; slosh not legible" },
      { "shot": "strips/high/R16", "note": "crew circle the tub at the judge; progress bar fills" }
    ] },
    "ui": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R04", "note": "consistent stud-rail plates, gauge, legend, minimap; item slot is a grey sphere placeholder" },
      { "shot": "high/desktop/R01", "note": "brick-shaped menu buttons with studs" },
      { "shot": "high/desktop/R19", "note": "call-out under the top row, clear of the road" },
      { "shot": "high/desktop/R18", "note": "clean results table" }
    ] },
    "typography": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R04", "note": "numerals read at a glance" },
      { "shot": "high/mobile/R02", "note": "selected label dark (lum 30) on the (76,143,168) fill" },
      { "shot": "high/desktop/R02", "note": "card labels about 9-11 px" },
      { "shot": "high/mobile/R18", "note": "'(you)' row wraps" }
    ] },
    "readability": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "high/landscape/R03", "note": "READY covers x 573-1113, y 213-367 of 1688x780: the vanishing point and the whole grid" },
      { "shot": "high/desktop/R07", "note": "pack merges into a mass of figures; teal and purple tubs now distinct" },
      { "shot": "high/desktop/R04", "note": "chase camera hides most of the player's tub behind the crew" },
      { "shot": "high/desktop/R10", "note": "pickups read clearly" }
    ] },
    "mobile": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "high/mobile/R04", "note": "controls clear of the tub; stacked HUD ends at y 400 of 1688 (24%)" },
      { "shot": "high/mobile/R02", "note": "whole tub, wheels and feet above the panel" },
      { "shot": "high/landscape/R02", "note": "division labels dropped; Back orphaned" },
      { "shot": "high/landscape/R17", "note": "controls clear of the tub" }
    ] },
    "authenticity": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R06", "note": "Arlington twin towers close the vista" },
      { "shot": "high/desktop/R05", "note": "Fordyce painted tile bands and canopy" },
      { "shot": "high/desktop/R16", "note": "Hale arches clean at the judge stop; JUDGE stand" },
      { "shot": "high/desktop/R08", "note": "blank signboard; generic stepped hills" },
      { "shot": "high/desktop/R19", "note": "ford reads as a tiled plaza" }
    ] }
  },
  "ab": {
    "characters": { "winner": "B", "confidence": 0.65, "pairs": ["ab/crop-R04-kart_3", "ab/high-desktop-R11", "ab/crop-R15-player"], "note": "B's Out-of-Towners tub is teal with a purple rim, matching crew and card; A's purple tub reads as a second Velvet Mob" },
    "materials": { "winner": "B", "confidence": 0.65, "pairs": ["ab/high-desktop-R05", "ab/high-desktop-R06", "ab/high-desktop-R16", "ab/high-desktop-R17"], "note": "soft glint vs hard stripe; no floating panes on the Hale; steam (182,176,169) vs tan (188,165,143)" },
    "scenery": { "winner": "B", "confidence": 0.75, "pairs": ["ab/high-desktop-R08", "ab/high-desktop-R09", "ab/high-desktop-R10", "ab/high-desktop-R16", "ab/high-landscape-R08", "ab/high-mobile-R08"], "note": "A has conifers growing through broadleaf crowns and panes over the Hale arches" },
    "lighting": { "winner": "tie", "confidence": 0.55, "pairs": ["ab/high-desktop-R05", "ab/high-desktop-R06", "ab/high-desktop-R09"], "note": "no AO difference visible in the R05/R06 heat maps; darker far crowns in B are within noise" },
    "animation": { "winner": "B", "confidence": 0.6, "pairs": ["ab/strip-R14", "ab/high-desktop-R17", "ab/strip-R15"], "note": "B particles about 25 levels brighter and more opaque; neutral steam; slosh not distinguishable" },
    "ui": { "winner": "B", "confidence": 0.8, "pairs": ["ab/high-desktop-R03", "ab/strip-R15", "ab/high-desktop-R16", "ab/high-desktop-R19", "ab/high-mobile-R02"], "note": "B's countdown, call-outs and task panel sit under the top HUD row instead of over the vanishing point" },
    "typography": { "winner": "B", "confidence": 0.6, "pairs": ["ab/high-mobile-R02", "ab/high-desktop-R02"], "note": "selected division label: A min lum 129 on the teal fill, B min lum 30" },
    "readability": { "winner": "B", "confidence": 0.75, "pairs": ["ab/high-desktop-R03", "ab/high-desktop-R19", "ab/strip-R15", "ab/crop-R04-kart_3", "ab/high-desktop-R11"], "note": "READY and call-outs off the grid; teal and purple teams distinct" },
    "mobile": { "winner": "B", "confidence": 0.7, "pairs": ["ab/high-mobile-R02", "ab/low-mobile-R02", "ab/high-landscape-R03", "ab/high-landscape-R04"], "note": "A's portrait preview has wheels and feet cut by the panel; landscape pairs identical" },
    "authenticity": { "winner": "B", "confidence": 0.55, "pairs": ["ab/high-desktop-R16"], "note": "Hale painted arches clean in B" }
  },
  "ip": { "clean": true, "notes": "Heads are rounded cubes, torsos straight boxes, hands mitten blocks with a thumb; no cylinder heads, trapezoid torsos or C-hands. No LEGO name or logo; studded buttons and plate rails are generic brick motifs." },
  "gaps": [
    { "id": "G-facade-relief", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R06", "high/desktop/R04", "high/desktop/R05"], "benchmark": "worlds-1", "fix": "Build window surrounds as 1x2 plate and tile geometry 0.08 studs proud with bevel normals, a 1x1 plate cornice per floor and slope-brick roof edges. Test: in R06 each sunlit sill is 15+ luminance above the wall." },
    { "id": "G-landscape-countdown", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R03"], "benchmark": "drive-3", "fix": "On phone landscape scale the countdown to 50% and place its top at 92 CSS px like the task panel. Test: no countdown pixel below 33% of frame height in landscape R03." },
    { "id": "G-dusk-lamps", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R07"], "benchmark": "worlds-2", "fix": "Emissive lamp globes with bloom, a baked light decal under each lamp, warm emissive shop windows on the dusk and sunset courses. Test: sidewalk under the nearest lamp 20%+ brighter than between lamps in R07." },
    { "id": "G-water-and-trails", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R19", "high/desktop/R09", "high/desktop/R10"], "benchmark": "drive-1", "fix": "Transparent blue water with sky reflection, scrolling normal and a white 1x1 round-plate foam edge; trails as tan and brown dirt plates with scattered 1x1 rocks, not plaza tile. Test: water luminance std >= 12 in R19 and trail hue distinct from the plaza tile." },
    { "id": "G-brick-particles", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15"], "benchmark": "drive-3", "fix": "Tumbling transparent 1x1 round plates and studs at 0.5-1.5x size; on a fumble a 3-frame FOV +6 degree kick and one helmet or accessory popping off and snapping back; raise the camera 0.3 m in slides and fumbles so the water's tilt is visible in 3+ R15 frames." },
    { "id": "G-ao-junctions", "category": "lighting", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R06", "high/desktop/R04"], "benchmark": "worlds-4", "fix": "Scale the SSAO radius with distance (about 1.5 m at 100 m) and raise its intensity. Test: 10%+ luminance drop within 0.5 m of the arcade base in R06." },
    { "id": "G-tub-brick-parts", "category": "characters", "expectedGain": 0.4, "severity": 3, "effort": "L", "workstream": "WS2", "evidence": ["crops/high/R03-player", "crops/high/R02-preview"], "benchmark": "drive-4", "fix": "Add a part seam where the rim meets the body, a stud row on the chassis top plates and a printed team tile on the tub side, all visible in the 2x close-up." },
    { "id": "G-far-ring-relief", "category": "scenery", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R06"], "benchmark": "worlds-3", "fix": "Replace the flat card rings with stepped brick terrain in 3-4 depth layers following the real ridgelines. Test: no card edge visible in R09." },
    { "id": "G-landscape-team-select", "category": "mobile", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R02"], "fix": "Show the division label on landscape cards at 11 px minimum and put Back in the same row as Choose." },
    { "id": "G-portrait-hud-height", "category": "mobile", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/mobile/R04", "high/mobile/R07"], "fix": "Merge the water gauge and item legend into one row, or move the legend bottom-left above Steer, so the top HUD ends above 16% of the height (now 24%)." },
    { "id": "G-fumble-flash-bleach", "category": "characters", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["crops/high/R15-player", "strips/high/R15"], "fix": "Replace the full-body whitening with a rim or outline flash, keeping albedo at 70%+ of the team colour." },
    { "id": "G-signage", "category": "authenticity", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R08", "high/desktop/R13", "high/desktop/R19"], "benchmark": "drive-5", "fix": "Printed tile signs: the Hot Springs Mountain Drive sign on the blank switchback board, a Bridge Street sign, a Gulpha Gorge marker at the ford." },
    { "id": "G-tree-slab-yaw", "category": "scenery", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R11", "high/desktop/R10"], "benchmark": "worlds-1", "fix": "Snap canopy slab yaw to 0, 45 or 90 degrees and size plates in whole studs so near trees read as built, not ragged." },
    { "id": "G-empty-item-slot", "category": "ui", "expectedGain": 0.2, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04"], "benchmark": "drive-3", "fix": "Replace the grey placeholder sphere with an empty-state brick tile with a '?' stud print." }
  ]
}
```
