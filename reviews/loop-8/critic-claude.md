# Critic A (critic-claude): loop 8, high tier

## Verdict
This is a coherent, glossy brick-toy kart racer, and its figures and tubs hold up in close-up: printed faces with expression, printed uniforms, a glossy cast tub, translucent bath water and a glossy duck. The Arlington and the Fordyce are recognisable. The world around them is still mostly textured boxes and flat backdrops. The facades are flat walls with painted brick and painted windows. The mountain ring is the same pale wall of triangle decals on every course, and its fogged far tiers float as white ghosts against the sky. The Gulpha Creek ford reads as blue paving. Game feel is the weakest area. In the strips the fumble gives no visible camera kick (the horizon moves at most 3 px of 302), and the slide steam is a few bead clusters lying on the road, not rising. The HUD now shares the menus' stud language and both phone layouts are framed on purpose, but the desktop HUD labels are tiny (a 5 px cap height). On the A/B pairs, **A** is better in every category but animation, which is a tie. Side A has no hatching on the backs of heads, no banding on the tub's inner wall, no glass panes offset from the painted windows, a judge booth you can see, a brighter dusk, a landscape banner that no longer covers the item tile, and "1 TICKET". **Total: 66.0 / 100.** Characters, UI, mobile and authenticity clear their gates. Materials, scenery, lighting, animation, typography and readability do not.

## Scores

### Characters: 7.0
- **Faces, prints and tub:** `crops/high/R02-preview-captain` shows the captain's printed open-mouth face and a buttoned yellow coat printed with a hydrant badge and reflective bands. The tub is glossy red with a yellow rolled rim and a yellow stripe print. The water is translucent, so the captain's lower torso shows through it, and the duck is glossy.
- **Crew backs:** `crops/high/R02-preview-rear` and `crops/high/R03-player-rear` show printed X-suspenders and hi-vis bands, bevelled arm blocks and red helmets with a specular highlight. The backs of the heads are clean, with no shadow hatching.
- **Team identity at chase distance:** Teams are distinct by colour and headgear in `high/desktop/R07` (purple "H" crew, tie-dye crew, pink crew), `high/desktop/R12` (orange crew with X-straps beside the tie-dye crew) and `high/desktop/R13` (white-and-pale-blue sailor crew).
- **Against `drive-4` (9.5):**
  - No part seams between head, torso, hips and legs.
  - The legs are plain rectangular blocks.
  - The firefighter helmets carry no studs.
  - The duck's silhouette is visibly faceted in `crops/high/R02-preview-captain`.

These figures are well above the `worlds-1` figures (6.5). They meet the 7 anchor, apart from studs on hats and visible seams.

### Materials: 6.5
- **What works:**
  - ABS on figures and tubs is convincing: a rim highlight follows the tub's roll (`crops/high/R02-preview-captain`) and helmet highlights follow the bevels (`crops/high/R03-player-rear`).
  - Clear parts read as transparent (the water).
  - Lawns are studded baseplates (the green slope in `high/desktop/R08`, the lawn in `high/desktop/R09`).
  - Roads are tile grids with a different shade per tile.
  - Goat Rock now reads as stacked plates with studded tops (`high/desktop/R09`).
- **What doesn't:**
  - Every building is a flat wall carrying a brick texture with painted windows: the Fordyce in `high/desktop/R05` and the Arlington's more than 100 window decals in `high/desktop/R06`.
  - Tree crowns are smooth slabs with no studs (`high/desktop/R10`, `high/desktop/R11`).
  - The ford in `high/desktop/R19` is an opaque flat blue tile plane with no ripple, no specular highlight and no depth.
  - The hill ring is a milky flat plane.

`worlds-1` (7) models its geometry everywhere; here only the actors and the ground do.

### Scenery: 6.5
- **What works:** The courses read as brick-built, with tile roads, studded lawns, plate trees and brick figures in the crowd, and they differ from each other: the Row (`high/desktop/R04`), the switchbacks (`high/desktop/R08`), Goat Rock (`high/desktop/R09`), the terracotta summit road (`high/desktop/R10`), the plaza (`high/desktop/R17`) and the trail ford (`high/desktop/R19`).
- **Visible repetition:**
  - The fence lines are rows of near-identical yellow-green spectators (`strips/high/R14`, frames 7–8).
  - Identical striped awnings march down both sides of Central Avenue (`high/desktop/R04`, `high/desktop/R14`).
  - The horizon is the same pale-green terraced wall on every course (`high/desktop/R06`, `high/desktop/R09`, `high/desktop/R12`).
- **Ghost tiers:** The farthest fogged tiers show as translucent white tree silhouettes above the nearer hills, at x≈450–520, y≈130–220 in `high/desktop/R06` and across the top right of `high/desktop/R04`.

This is short of `worlds-1` (7.5), and well short of `drive-1` and `drive-5` (9).

### Lighting: 6.5
- **What works:**
  - Tree shadows fall across the road in `high/desktop/R08`, and every tub casts a shadow.
  - Shading in the close-ups is soft and free of banding (the tub's inner wall in `crops/high/R02-preview-captain`).
  - Dusk in `high/desktop/R07` has a deliberate pink-orange sky, with lamp pools on the asphalt near the pack.
  - Sunset in `high/desktop/R11` has its own orange palette.
- **What doesn't:**
  - `high/desktop/R11` has no sun disc, glow or warm rim on the foliage, and its crowns sit as uniform dark slabs. Compare `worlds-4` (7), where the sun blooms through the arch.
  - Day frames are evenly lit, with almost no occlusion where walls meet the ground (the base of the Fordyce in `high/desktop/R05`, the street front in `high/desktop/R13`).
  - Haze turns the far hills to milk rather than to the sky's blue.

This is not yet a photographed toy (`bj-1`..`bj-3`).

### Animation and feel: 6.0
- **What works:**
  - In `strips/high/R16` the crew circle the tub with rigid swinging legs, changing position convincingly from frame to frame.
  - In `strips/high/R15` the crew scatter on the fumble, and blue water beads spray around the tub in frames 3–5.
  - In `strips/high/R14` a charge arc round the tub's ring turns from blue to white, which is good feedback.
- **No visible impact kick:** In `strips/high/R15` the sky edge, measured at x 280–400, sits at 75, 75, 76, 75, 78, 77, 78 and 78 px across the 8 frames, each 302 px tall. That is at most 3 px of camera motion through the hit.
- **Slide steam doesn't rise:** In `strips/high/R14` the steam is small white bead clusters lying on the road 40–60 px behind and beside the tub. They don't rise between frames 3 and 8, and they're detached from the wheels.
- **No slosh:** There is no visible water slosh in any strip.

The 7 anchor asks for hits that read through camera kick. `drive-3` effects sit at 8.5.

### UI / HUD: 7.0
- **What works:**
  - Menus, HUD and results share one style: navy plates with stud rows, brick-shaped buttons with studs on top, and pixel display numerals (`high/desktop/R01`, `high/desktop/R02`, `high/desktop/R18`).
  - The HUD hierarchy is clear in `high/desktop/R04`: lap and time top left, item and tickets top centre, place top right, water and item tray bottom left, minimap bottom right.
  - The "RING AROUND THE TUB!" banner with its progress bar reads well (`high/desktop/R16`).
- **What doesn't:**
  - On desktop the HUD is small for 1280×800 and pushed into the corners.
  - The empty item orb cuts across the new stud row on the item tile (`high/desktop/R04`, x≈450–520, y≈5–30).
  - The labels are tiny (see Typography).

This is short of `drive-3` (8.5).

### Typography: 6.5
- **What works:** The pixel display face (title, READY, 8TH, RESULTS) and the rounded sans form a clear scale, and the numerals read at a glance (`high/desktop/R03`, `high/desktop/R18`).
- **Too small on desktop:**
  - The TICKETS label in `high/desktop/R04` has a 5 px cap height (bright rows 55–59).
  - The tray labels (Towel, Bath, Soap, Loofah) are about the same size.
  - The status lines on the team cards are about 9 px (`high/desktop/R02`).
- **Bad wraps on phones:**
  - In `high/landscape/R02`, "The Out- / of- / Towners" breaks over three lines and the locked cards run to four lines, touching the card bottoms.
  - In portrait results, every row wraps "25 gal / CLEAN" (`high/mobile/R18`).

### Readability: 6.5
- **What works:**
  - The player's tub stands out with its yellow ring and triangle (`high/desktop/R03`, `high/desktop/R14`, `high/desktop/R17`).
  - Bubble pickups pop against the road (`high/desktop/R10`, `high/desktop/R17`).
  - Road edges are crisp white lines, and the JUDGE sign now reads at once (`high/desktop/R16`).
  - On phones the player's tub is large and clear (`high/mobile/R03`, `high/mobile/R07`).
- **What doesn't:**
  - At mid distance the pack merges into one mass of figures in which individual tubs and rival rings can't be separated (`high/desktop/R04`, `high/desktop/R07`, `high/desktop/R08`, `high/mobile/R07`).
  - The creek ford in `high/desktop/R19` reads as paving, not water.

This is well short of `drive-3` (9).

### Mobile: 7.0
- **Portrait:** In `high/mobile/R03`, `high/mobile/R07` and `high/mobile/R17`, the HUD stacks in two top columns and the thumb controls sit in the bottom fifth. The tub sits mid-screen and is never covered.
- **Landscape:** In `high/landscape/R04` and `high/landscape/R17` the HUD runs down the left and the buttons sit on the right, with the tub centred. The "HOT STEAM!" banner now sits below the item tile without covering it.
- **Team select:** The portrait team select in `high/mobile/R02` works. The panel's outer frame ends at device row 1679 of 1688, a margin of 4 CSS px above the bottom edge.
- **Performance:** The phone proxy holds 30 fps or more (SwiftShader minimum 50 fps).
- **Shortfalls:**
  - The landscape team select is cramped (`high/landscape/R02`).
  - The landscape left HUD column takes about 20% of the width.

### Authenticity: 6.5
- **What works:**
  - The Arlington's twin towers and red roofs close the vista and are instantly recognisable (`high/desktop/R06`).
  - The Fordyce's tiled roof, patterned bands and green marquee read well (`high/desktop/R05`).
  - Goat Rock reads as white novaculite spires (`high/desktop/R09`).
  - The real race shows: a judge booth with the JUDGE sign (`high/desktop/R16`), the duck, the flag and the water gauge.
- **What doesn't:**
  - The mountains are a generic terraced ring, identical on every course, not the Ouachitas (`high/desktop/R06`, `high/desktop/R12`).
  - Bridge Street (`high/desktop/R13`) shows nothing that identifies it.
  - Hill Wheatley Plaza (`high/desktop/R17`) is a generic red-brick oval.

## IP check
**Clean.** The figures have rounded-box heads (not cylinders), straight rectangular torsos (not trapezoids) and mitten-block hands (not C-shaped). See `crops/high/R02-preview-captain`, `crops/high/R02-preview-rear` and `crops/high/R15-player`. No LEGO name, logo or stud lettering appears anywhere.

## A/B (A on the left of every pair)
- **Characters: A (0.65).** `crop-R03-player-rear`, `crop-R02-preview-rear`: B has dark, blotchy shadow hatching on the back of the central crew head; A's heads are clean.
- **Materials: A (0.70).**
  - In `high-desktop-R09` and `low-desktop-R09`, A's Goat Rock is stacked plates with studded tops; B's is smooth blocks with a masonry texture.
  - In `crop-R02-preview-captain`, B has vertical banding on the tub's inner wall; A is clean.
- **Scenery: A (0.75).**
  - In `high-desktop-R05` and `high-desktop-R04`, B has large blue glass panes standing in front of the painted windows and offset from them; A doesn't.
  - In `high-desktop-R16`, B's plain booth hides behind a tree; A's booth stands in the clear.
  - The horizon change in `high-desktop-R06` is roughly neutral.
- **Lighting: A (0.65).**
  - `high-desktop-R07`: the road reads (70, 51, 51) in A against (55, 41, 42) in B, and A has lamp pools.
  - `high-desktop-R11`: the crew region's 90th-percentile luminance is 118 in A against 102 in B.
  - A also has no AO banding (`crop-R02-preview-captain`) and no hatching on the heads (`crop-R03-player-rear`).
- **Animation: tie (0.60).** `strip-R14`, `strip-R15`, `strip-R16`: the motion is the same in both. The horizon tracks match within 1 px, so neither shows a visible dip. B's splash beads are a little more prominent.
- **UI: A (0.75).**
  - In `high-desktop-R04` and `high-desktop-R17`, A's tiles carry a stud row and B's don't.
  - In `high-landscape-R17` and `low-landscape-R17`, A's banner sits below the item tile; B's covers its lower edge.
- **Typography: A (0.65).** `high-desktop-R17`, `high-mobile-R17`, `high-landscape-R17`: A reads "1 TICKET", B reads "1 TICKETS".
- **Readability: A (0.70).**
  - In `high-desktop-R16`, A's judge booth with its JUDGE sign stands in clear view; B's is blocked by a tree.
  - A's dusk and sunset crews are brighter (`high-desktop-R07`, `high-mobile-R07`, `high-desktop-R11`).
- **Mobile: A (0.70).**
  - In `high-landscape-R17` the banner no longer covers the item tile.
  - In `high-mobile-R02`, B's panel frame runs to the last row of the image; A's ends 7 px above it.
  - In `high-mobile-R07`, A's dusk is more readable.
- **Authenticity: A (0.70).** `high-desktop-R16` (judge in clear view), `high-desktop-R05` (the painted facade isn't doubled by offset panes), `high-desktop-R09` (the plate-built Goat Rock).

## Ranked gaps

1. **G-impact-camera-kick** (animation, severity 4, effort S, WS3, expected gain +0.5)
   - **Defect:** No visible kick on the fumble. In `strips/high/R15` the horizon moves at most 3 px of 302 across the hit.
   - **Fix:** Apply the pitch dip at full strength within 1–2 ticks of the impact, add a 3–5° FOV punch, and pop one or two loose parts off the tub that snap back.
   - **Test:** In the `R15` strip, the horizon in frame 2 or 3 sits at least 12 px from frame 1.
2. **G-slide-steam-rise** (animation, severity 3, effort S, WS3, expected gain +0.5)
   - **Defect:** The slide steam in `strips/high/R14` is bead clusters lying on the road, detached from the wheels.
   - **Fix:** Emit from the rear wheel contact points, rise at least 0.5 m and grow 2× over the particle's life, and add a continuous trail.
   - **Test:** In the `R14` strip, the puffs in frames 5–8 sit above the tub's rim line and connect back to the wheels.
3. **G-facade-relief** (scenery, severity 3, effort L, WS4, expected gain +0.5)
   - **Defect:** The bathhouse and downtown facades are flat textured walls with painted windows (`high/desktop/R05`, `high/desktop/R06`, `high/desktop/R13`).
   - **Fix:** Recess windows by one plate, add sills and lintels as modelled tiles, add bevelled corner columns and a modelled cornice.
   - **Test:** At least three depth steps are visible on the Fordyce front in `R05`.
4. **G-pack-separation** (readability, severity 3, effort M, WS2, expected gain +0.5)
   - **Defect:** At mid distance the pack is one blob (`high/desktop/R04`, `high/desktop/R07`, `high/desktop/R08`).
   - **Fix:** Give each tub a tall team-colour pennant whose scale grows with distance, and draw rival rings with a darker outline.
   - **Test:** Each of the 8 tubs can be counted in `R04`.
5. **G-sunset-sun-and-rim** (lighting, severity 3, effort M, WS1, expected gain +0.5)
   - **Defect:** `high/desktop/R11` has no sun or glow, and its crowns are flat and dark.
   - **Fix:** Add a sun disc with bloom in the sky dome along the key direction, a warm rim term on foliage and figures, and fog tinted toward the sun.
   - **Benchmark:** `worlds-4`.
6. **G-hud-label-size** (typography, severity 2, effort S, WS6, expected gain +0.5)
   - **Defect:** TICKETS and the tray labels have a cap height of about 5 px at 1280×800 (`high/desktop/R04`).
   - **Fix:** Clamp HUD scale to the viewport so desktop labels are at least 11 CSS px, and grow the tiles by about 1.4× on desktop.
7. **G-ford-water** (materials, severity 3, effort M, WS1, expected gain +0.3)
   - **Defect:** The ford in `high/desktop/R19` reads as blue paving.
   - **Fix:** Use a translucent water plate (about 60% opaque) with scrolling specular ripples, and a wake of splash beads under any tub crossing it.
   - **Test:** The tile grid under the water is visibly softened, and a splash appears under the crossing rival.
8. **G-horizon-ghost-tiers** (scenery, severity 2, effort S, WS4, expected gain +0.3)
   - **Defect:** The far hill tiers show as translucent white silhouettes above the nearer hills (`high/desktop/R06`, x≈450–520, y≈130–220).
   - **Fix:** Cap fog on the farthest terrace so it stays at least 15% darker than the sky behind it, or drop that terrace.
9. **G-crowd-clones** (scenery, severity 2, effort M, WS5, expected gain +0.3)
   - **Defect:** The fence lines are rows of identical spectators (`strips/high/R14`, frames 7–8), and the awnings repeat (`high/desktop/R04`).
   - **Fix:** Randomise shirt colour, hat and pose per spectator from at least 8 variants, and vary awning colour per storefront.
10. **G-figure-part-seams** (characters, severity 2, effort M, WS2, expected gain +0.3)
    - **Defect:** Bodies have no visible part seams, the legs are plain boxes, and the helmets have no studs (`crops/high/R02-preview-rear`).
    - **Fix:** Add a hip piece with a 1–2 mm dark seam groove, split the legs, and add a stud or knob to each hat top.
    - **Benchmark:** `drive-4`.
11. **G-landscape-team-cards** (mobile, severity 2, effort S, WS6, expected gain +0.3)
    - **Defect:** The `high/landscape/R02` cards wrap to three or four lines.
    - **Fix:** In landscape, put the division and lock state in one icon row, never hyphen-break team names, and use a 3-column grid with the preview narrowed.
12. **G-tub-water-slosh** (animation, severity 2, effort M, WS3, expected gain +0.3)
    - **Defect:** The water surface stays flat through the slide and the fumble (`strips/high/R14`, `strips/high/R15`).
    - **Fix:** Tilt and wave the water plane against the tub's acceleration, and spill beads over the rim on hard hits.
13. **G-item-orb-stud-clash** (ui, severity 1, effort S, WS6, expected gain +0.1)
    - **Defect:** The empty item orb overlaps the stud row on the item tile (`high/desktop/R04`).
    - **Fix:** Inset the orb below the stud row.

```json
{
  "loop": 8,
  "role": "critic-claude",
  "tier": "high",
  "scores": {
    "characters": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "crops/high/R02-preview-captain", "note": "printed expressive face, printed coat with hydrant badge, glossy tub, translucent water, glossy (faceted) duck" },
      { "shot": "crops/high/R02-preview-rear", "note": "printed X-straps and hi-vis bands, bevelled arms, clean head backs; no part seams, legs plain boxes, helmets without studs" },
      { "shot": "crops/high/R03-player-rear", "note": "helmet highlights follow bevels, no hatching" },
      { "shot": "high/desktop/R07", "note": "teams distinct by colour/headgear at chase distance" },
      { "shot": "high/desktop/R13", "note": "sailor crew distinct" }
    ] },
    "materials": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "crops/high/R02-preview-captain", "note": "convincing ABS highlights, clear water" },
      { "shot": "high/desktop/R09", "note": "studded lawn, plate-stack Goat Rock with studded tops" },
      { "shot": "high/desktop/R06", "note": "flat walls with brick texture and painted window decals" },
      { "shot": "high/desktop/R19", "note": "ford is an opaque flat blue tile plane" },
      { "shot": "high/desktop/R11", "note": "tree crowns are smooth slabs, no studs" }
    ] },
    "scenery": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R04", "note": "tile road, plate trees, brick crowds; awnings repeat identically" },
      { "shot": "high/desktop/R08", "note": "distinct mountain course with studded slopes" },
      { "shot": "high/desktop/R06", "note": "same terraced horizon ring; translucent ghost tiers at x~450-520,y~130-220" },
      { "shot": "strips/high/R14", "note": "fence line of near-identical spectators (frames 7-8)" },
      { "shot": "high/desktop/R05", "note": "facades are flat textured boxes" }
    ] },
    "lighting": { "score": 6.5, "confidence": 0.55, "evidence": [
      { "shot": "high/desktop/R07", "note": "deliberate pink-orange dusk with lamp pools on the road" },
      { "shot": "high/desktop/R08", "note": "tree shadows across road, tubs grounded" },
      { "shot": "high/desktop/R11", "note": "sunset with no sun disc/glow or warm rim; flat dark crowns (vs worlds-4)" },
      { "shot": "crops/high/R02-preview-captain", "note": "soft shading, no AO banding" },
      { "shot": "high/desktop/R05", "note": "little occlusion where walls meet ground" }
    ] },
    "animation": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "strips/high/R16", "note": "crew circles tub with rigid swinging legs, convincing" },
      { "shot": "strips/high/R15", "note": "splash beads frames 3-5; horizon moves only 75->78 px of 302 across the hit, no visible kick" },
      { "shot": "strips/high/R14", "note": "charge arc good; steam is bead clusters on the road that do not rise, detached from wheels; no water slosh" }
    ] },
    "ui": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R04", "note": "clear hierarchy, stud rows on tiles; small HUD in corners; item orb overlaps stud row" },
      { "shot": "high/desktop/R02", "note": "brick-styled menu consistent with HUD" },
      { "shot": "high/desktop/R16", "note": "event banner with progress bar reads well" },
      { "shot": "high/desktop/R18", "note": "clean results table" }
    ] },
    "typography": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R04", "note": "TICKETS label 5 px cap height; tray labels similar" },
      { "shot": "high/desktop/R18", "note": "display/UI scale clear, numerals read" },
      { "shot": "high/landscape/R02", "note": "'The Out- / of- / Towners' breaks over 3 lines; locked cards 4 lines" },
      { "shot": "high/mobile/R18", "note": "every row wraps '25 gal / CLEAN'" }
    ] },
    "readability": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R16", "note": "JUDGE sign reads at once" },
      { "shot": "high/desktop/R17", "note": "player ring/marker and bubble pickups pop" },
      { "shot": "high/desktop/R04", "note": "mid-distance pack merges into one mass" },
      { "shot": "high/desktop/R07", "note": "dusk pack is a single blob, rival rings invisible" },
      { "shot": "high/mobile/R03", "note": "player tub large and clear on phone" }
    ] },
    "mobile": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "high/mobile/R03", "note": "controls in bottom fifth, tub mid-screen, never covered" },
      { "shot": "high/mobile/R17", "note": "two-column top HUD, deliberate framing" },
      { "shot": "high/landscape/R17", "note": "banner below item tile, tub centred" },
      { "shot": "high/landscape/R02", "note": "landscape team select cramped" },
      { "shot": "high/mobile/R02", "note": "panel frame ends 4 CSS px above bottom" }
    ] },
    "authenticity": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R06", "note": "Arlington twin towers close the vista, recognisable" },
      { "shot": "high/desktop/R05", "note": "Fordyce roof, bands and marquee recognisable" },
      { "shot": "high/desktop/R16", "note": "judge booth with JUDGE sign, duck, flag, water gauge" },
      { "shot": "high/desktop/R12", "note": "generic terraced ring, not the Ouachitas" },
      { "shot": "high/desktop/R13", "note": "Bridge Street has no identifying feature" }
    ] }
  },
  "ab": {
    "characters": { "winner": "A", "confidence": 0.65, "pairs": ["crop-R03-player-rear", "crop-R02-preview-rear"], "note": "B shows dark hatching on the back of the central crew head; A clean" },
    "materials": { "winner": "A", "confidence": 0.7, "pairs": ["high-desktop-R09", "low-desktop-R09", "crop-R02-preview-captain"], "note": "A Goat Rock is plate stacks with studded tops vs B masonry texture; B has vertical banding on the tub inner wall" },
    "scenery": { "winner": "A", "confidence": 0.75, "pairs": ["high-desktop-R05", "high-desktop-R04", "high-desktop-R16", "high-desktop-R06"], "note": "B has blue panes offset from painted windows and a tree hiding the judge booth; horizon change roughly neutral" },
    "lighting": { "winner": "A", "confidence": 0.65, "pairs": ["high-desktop-R07", "high-desktop-R11", "crop-R02-preview-captain", "crop-R03-player-rear"], "note": "A dusk road (70,51,51) vs B (55,41,42); R11 crew p90 luminance 118 vs 102; A has no AO banding or head hatching" },
    "animation": { "winner": "tie", "confidence": 0.6, "pairs": ["strip-R14", "strip-R15", "strip-R16"], "note": "same motion; horizon tracks within 1 px; splash beads slightly more prominent in B" },
    "ui": { "winner": "A", "confidence": 0.75, "pairs": ["high-desktop-R04", "high-desktop-R17", "high-landscape-R17", "low-landscape-R17"], "note": "A tiles carry stud rows; A banner sits below the item tile while B's covers it" },
    "typography": { "winner": "A", "confidence": 0.65, "pairs": ["high-desktop-R17", "high-mobile-R17", "high-landscape-R17"], "note": "A '1 TICKET' vs B '1 TICKETS'" },
    "readability": { "winner": "A", "confidence": 0.7, "pairs": ["high-desktop-R16", "high-desktop-R07", "high-mobile-R07", "high-desktop-R11"], "note": "A judge booth in clear view; brighter dusk/sunset crews" },
    "mobile": { "winner": "A", "confidence": 0.7, "pairs": ["high-landscape-R17", "high-mobile-R02", "high-mobile-R07"], "note": "A banner clears the item tile; B team-select panel runs to the bottom edge, A leaves a margin" },
    "authenticity": { "winner": "A", "confidence": 0.7, "pairs": ["high-desktop-R16", "high-desktop-R05", "high-desktop-R09"], "note": "judge stop visible; facade not doubled by offset panes; brick-built Goat Rock" }
  },
  "ip": { "clean": true, "notes": "Rounded-box heads, rectangular torsos, mitten-block hands; no LEGO name or logo seen (crops/high/R02-preview-captain, crops/high/R02-preview-rear, crops/high/R15-player)." },
  "gaps": [
    { "id": "G-impact-camera-kick", "category": "animation", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R15"], "benchmark": "drive-3", "fix": "Apply the impact pitch dip at full strength within 1-2 ticks plus a 3-5 degree FOV punch, and pop 1-2 loose tub parts that snap back. Test: in the R15 strip the horizon in frame 2 or 3 sits at least 12 px from frame 1 (now at most 3 px of 302)." },
    { "id": "G-slide-steam-rise", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R14"], "benchmark": "drive-3", "fix": "Emit slide steam from the rear wheel contact points, rise at least 0.5 m and grow 2x over life, with a continuous trail. Test: R14 frames 5-8 show puffs above the tub rim line, connected to the wheels." },
    { "id": "G-facade-relief", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06", "high/desktop/R13"], "benchmark": "worlds-1", "fix": "Recess windows one plate, add modelled tile sills and lintels, bevelled corner columns and a modelled cornice. Test: at least three depth steps visible on the Fordyce front in R05." },
    { "id": "G-pack-separation", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["high/desktop/R04", "high/desktop/R07", "high/desktop/R08"], "benchmark": "drive-3", "fix": "Give each tub a tall team-colour pennant scaled up with distance and draw rival rings with a dark outline. Test: all 8 tubs countable in R04." },
    { "id": "G-sunset-sun-and-rim", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R11"], "benchmark": "worlds-4", "fix": "Add a sun disc with bloom in the sky dome along the key direction, a warm rim term on foliage and figures, and sun-tinted fog. Test: sun or glow visible in R11 and crowns show a lit edge." },
    { "id": "G-hud-label-size", "category": "typography", "expectedGain": 0.5, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/desktop/R02"], "benchmark": "drive-3", "fix": "Clamp HUD scale to the viewport so desktop labels are at least 11 CSS px (TICKETS is now 5 px cap height) and grow tiles about 1.4x on desktop." },
    { "id": "G-ford-water", "category": "materials", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R19"], "benchmark": "bj-2", "fix": "Make the ford a translucent water plate (about 60% opaque) with scrolling specular ripples and a splash wake under tubs crossing it. Test: tile grid softened under the water, splash under the crossing rival in R19." },
    { "id": "G-horizon-ghost-tiers", "category": "scenery", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R06", "high/desktop/R04"], "fix": "Cap fog on the farthest hill terrace so it stays at least 15% darker than the sky behind it (or drop it). Test: no translucent white tree silhouettes above the near hills at x~450-520, y~130-220 in R06." },
    { "id": "G-crowd-clones", "category": "scenery", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS5", "evidence": ["strips/high/R14", "high/desktop/R04"], "benchmark": "drive-1", "fix": "Randomise spectator shirt colour, hat and pose from at least 8 variants and vary awning colours per storefront. Test: no two adjacent spectators identical in R14 frames 7-8." },
    { "id": "G-figure-part-seams", "category": "characters", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R02-preview-rear", "crops/high/R02-preview-captain"], "benchmark": "drive-4", "fix": "Add a hip piece with a 1-2 mm dark seam groove, split legs, and a stud or knob on each hat top. Test: seams visible at the waist and hips in the R02 close-ups." },
    { "id": "G-landscape-team-cards", "category": "mobile", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R02"], "fix": "In landscape, render division and lock state as one icon row, never hyphen-break team names, and use a 3-column grid with a narrower preview. Test: every card at most 2 text lines." },
    { "id": "G-tub-water-slosh", "category": "animation", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15"], "fix": "Tilt and wave the tub water plane against acceleration and spill beads over the rim on hard hits. Test: water surface visibly tilted in R14 frames 4-6." },
    { "id": "G-item-orb-stud-clash", "category": "ui", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04"], "fix": "Inset the item orb below the tile's stud row so it no longer cuts across studs 2-3." }
  ]
}
```
