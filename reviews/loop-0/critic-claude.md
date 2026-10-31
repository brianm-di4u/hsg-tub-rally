<!-- Transcribed by the developer from the critic's returned message (its transcript file was empty). Scores, evidence and the JSON block are verbatim; the prose "Ranked gaps" list is shortened (the full fixes are in the JSON). -->

**Verdict.** This is a tidy N64-style kart racer. It is nowhere near a brick-toy game. Everything is drawn at 384×240 and stretched to 1280×800, so the whole frame is soft. Characters are faceless, faceted-ball heads on box bodies. Wheels are octagons with pie-wedge decals. Nothing has a plastic sheen, a stud, a seam or a bevel. The world is painted low-poly, with tree and crowd sprites in a cartoon style that clashes with the boxy figures. Light is a directional key, fog and hard octagonal blob shadows, and the crew have no shadows of their own. The strongest areas are authenticity (Arlington, the Quapaw dome, the Medical Arts tower, water line, ducks, flags) and a consistent, readable menu and HUD system. Phone portrait works. Phone landscape clips three menus. Animation feedback is close to nil: the power slide has no steam, sparks or camera kick, and the "Ring around the tub" crew never moves. Against `worlds-1`, the closest target, every brick-world category sits 2.5–3 points short.

## Scores (high tier, desktop; phone frames for mobile and readability)

**Characters: 4.0.**
- `crops/high/R03-player` and `crops/high/R04-player`: heads are low-poly faceted spheres with no eyes, mouth or print. Hands are plain cubes. Uniforms are two flat stripe bars on a box torso.
- `crops/high/R03-kart_5` and `crops/high/R04-kart_3`: teams differ by colour and hat (red caps, white pointed hats, teal antenna crowns, cowboy hats, top hat). That is better than anchor 3, but the figures read as "boxy people", not toys.
- Tubs are flared octagonal buckets with a flat pink inside. Wheels are 8-sided prisms with pie-wedge texture, and gold cubes are stuck on the chassis.
- The close-ups do not hold up:
  - `crops/high/R15-player`: two crew on the left occupy the same space.
  - `crops/high/R04-kart_3`: a rival's blue-capped crewman pokes up inside the purple tub.
  - `crops/high/R02-preview-captain`: the camera ends up behind the rim and duck. The captain shows only the back of a head and a fist.
- Benchmark `drive-4` (printed face, uniform print, glossy helmet) is about 5 points away.

**Materials: 4.5.**
- `crops/high/R03-player` and `crops/high/R02-preview`: lit flat colour, facet shading only. No specular, no bevel highlight, no studs, no seams anywhere. The tub water is a flat cyan sliver.
- `high/desktop/R06`: the 384×240 upscale turns the Arlington's brick facade into blotchy dot noise. `high/desktop/R05`: same on the Fordyce.
- Road asphalt is a noisy grey texture with no material read.
- `crops/high/R15-player`: the shadow is a hard-edged dark octagon.
- Crowd sprites (`crops/high/R03-kart_5`) are a painted cartoon style unrelated to the models.
- This is anchor 5 with anchor-3 texture noise. Against `worlds-1` (studded baseplate, tile road) and `bj-1` (micro-bevels, translucent parts) there is no plastic read at all.

**Scenery: 4.5.**
- A coherent low-poly town that is not brick-built. Trees and crowds are flat sprites (`high/desktop/R04`, `high/desktop/R10`).
- `high/desktop/R08` (also `high/mobile/R08`): a grass terrain slab cuts straight across the road behind the player's tub.
- `high/desktop/R12`: identical oak sprites repeat in a line.
- `high/desktop/R17`: Hill Wheatley Plaza is an empty brick oval with two distant facades.
- `high/desktop/R10` and `high/desktop/R08`: tree billboards are pixel-edged with pale smears inside the canopies.
- `high/desktop/R06`: the world ends in a flat green plane with a pale band at the horizon.
- Below `worlds-1` and far below `drive-1`.

**Lighting: 4.5.**
- One directional key and fog. Tubs get blob shadows; the crew get none (`crops/high/R04-player` and `crops/high/R15-player`: crew feet float on bare asphalt). No ambient occlusion anywhere.
- `high/desktop/R07` (dusk): a sky gradient plus a darker tint. The streetlamps are unlit, with no light pools and no lit windows.
- `high/desktop/R11` (sunset): pink only shows in the sky gap. Trees and grass stay noon-green, with no warm rim light.
- Compared with `worlds-4` (backlit haze) and `worlds-2` (firelight and dusk ambient), this is anchor 5 minus the crew shadows.

**Animation and feel: 4.0.**
- `strips/high/R14` (power slide): the tub yaws and skids into the curb. The crew stay locked in formation. No steam plume, sparks, skid marks or camera kick in any of the 8 frames, even though the moment is "charging hot steam".
- `strips/high/R15` (fumble): the crew do reposition around the tub frame to frame. It works, but it is stiff and has no anticipation or effects.
- `strips/high/R16` (judge stop): the crew stay in push positions in all 8 frames while the banner says the team circles the tub and the bar fills. A rival tub also slides through the near plane at bottom-left, over the water gauge, in frames 3–8. `strips/low/R16` is identical.
- No visible water slosh.
- `drive-3` (boost trails, sparks) is the bar.

**UI / HUD: 5.5.**
- One consistent system: blue panels, orange gradient buttons, pixel display numerals (`high/desktop/R01`, `high/desktop/R02`, `high/desktop/R18`).
- The race HUD hierarchy (lap, time, water gauge, item, ducks, place, minimap) is clear in `high/desktop/R04`.
- Team select (`high/desktop/R02`) shows no tub at all; the turntable sits outside the frame.
- `high/desktop/R05` and `high/desktop/R06`: the "SCRUB!" callout sits right on top of the landmark.
- `high/desktop/R18`: the results screen leaves the race HUD visible behind it (LAP 1/1, 8TH, gauge) and says "1 laps".
- The Towel/Bath/Soap/Loofah row has no counts or explanation.
- The look is a generic web card, not brick-themed (compare `drive-2` and `drive-3`).

**Typography: 5.5.**
- The pixel display face plus the rounded sans form a clear scale with character (`high/desktop/R01`, `high/mobile/R18`).
- The HUD zero has a centre dot, so it reads as 8 at HUD size: "0:00.00" in `high/desktop/R03` and "1:01.00" in `high/mobile/R18`.
- The title subtitle's heavy offset shadow prints a ghost duplicate line (`high/desktop/R01`, `high/mobile/R01`).
- `high/landscape/R01`: the logo is clipped off the top of the screen.
- Legend labels are about 10 px at desktop.

**Readability: 5.5.**
- Good: saturated crews on a dark road, and centred chase cam, so the player's tub is usually obvious. Item orbs glow (`high/desktop/R10`, `high/desktop/R11`, `high/desktop/R17`). Paved roads have clear white edge lines.
- Bad:
  - The pack ahead melts into confetti (`high/desktop/R04`, `high/landscape/R07`).
  - Rival crews interpenetrate the player's crew (`high/desktop/R12`, `high/desktop/R11`).
  - The road edge disappears into the same-colour dirt verge on the left of `high/desktop/R09`.
  - `high/mobile/R08`: the grass slab crosses the road.
  - The judge stop is a white box and a blue flag with no judge (`high/desktop/R16`).
- Far from `drive-3`.

**Mobile: 4.5.**
- Portrait is framed on purpose. Thumb controls sit at the bottom and never cover the tub (`high/mobile/R04`, `high/mobile/R17`). Performance is ample (SwiftShader low/mobile minimum 93 fps).
- Landscape is broken in three places:
  - `high/landscape/R01`: the title logo is off-screen and the menu is cut after "How to Play".
  - `high/landscape/R02`: the team panel hides the stats and the Choose/Back buttons.
  - `high/landscape/R18`: the results hide the player's own row 8 and both buttons.
- Landscape controls sit high (Item/Hop/Brake/Push at y≈165–440 of 780). The Steer pill floats mid-left over the scene. The buttons cover an item orb in `high/landscape/R17`.

**Authenticity: 6.0.**
- `high/desktop/R06`: the Arlington is recognisable (twin domed towers, red tile roof) and closes the vista in `crops/high/R03-kart_1`.
- The Quapaw's tiled dome shows in `high/desktop/R14` and `crops/high/R02-preview-rear`. The Medical Arts tower appears in `crops/high/R03-player`. Central Avenue crowds and barriers are there.
- Race furniture is right: water gauge with the 10-gallon line, rubber ducks, captain flags, five-person crews.
- Missing:
  - `high/desktop/R09`: no Goat Rock and no ford.
  - `high/desktop/R13`: Bridge Street is a generic brick block.
  - `high/desktop/R17`: the plaza is generic.
  - The Ouachitas are a flat blue backdrop strip.
  - `high/desktop/R16`: no judges.
  - Nothing is in brick form.

## IP check
Clean. Heads are faceted spheres, not cylinders. Hands are cubes, not C-shapes. Torsos are rectangular boxes, not trapezoids (`crops/high/R03-player-rear`). There is no LEGO name, logo or stud motif in any capture, menu or HUD.

## Ranked gaps
1. **G-brick-figures** (characters, WS2, severity 5, effort L, about +2.5). Rebuild the crew and captain as original brick figures: separate bevelled head, torso, arms and legs with visible seam lines; printed faces and team uniforms, studded hats; no cylinder head, C-hand or trapezoid torso; seat the captain so the head clears the rim.
2. **G-abs-material** (materials, WS1, 5, L, +2.0). A plastic material on all brick parts, bevel normals on every edge, studs on top faces within 15 m, a fixed palette of real brick colours.
3. **G-brick-world** (scenery, WS4, 5, L, +2.0). Studded baseplate ground, tile roads with seams, buildings with visible brick courses, brick-built trees and props in place of painted billboards.
4. **G-render-res** (materials and readability, WS1/WS7, 4, S, +1.0). Native or about 0.75× DPR default on the high tier; keep "Authentic 240" as an option.
5. **G-lighting-ao** (lighting, WS1, 4, M, +1.5). AO plus soft contact shadows; dusk lamp pools and lit windows; warm sunset rim light; fog matched to the sky.
6. **G-slide-feedback** (animation, WS3, 4, M, +1.0). Steam plume growing with charge, skid marks, crew scramble, FOV kick on release.
7. **G-ring-around** (animation and authenticity, WS3, 4, M, +0.5 each). Crew loop the tub in time with the bar; a judge figure at the stop; no rival clipping the near plane.
8. **G-landscape-overflow** (mobile, WS6, 5, S, +1.0). Fit panels to the viewport height or use a two-column landscape layout.
9. **G-landscape-controls** (mobile, WS6, 3, S, +0.5). Buttons and Steer anchored to the bottom corners; item orbs kept clear.
10. **G-team-preview** (UI, WS6, 4, S, +0.5). Frame the turntable tub on the right on desktop and landscape, above the grid in portrait.
11. **G-hud-theme** (UI, WS6, 3, M, +1.0). Brick-plate HUD panels and tile buttons; hide the race HUD under results; callouts off centre; "1 laps"; label the legend.
12. **G-numeral-glyph** (typography, WS6, 3, S, +0.5). Open zero in HUD numerals; 1–2 px outline instead of the ghost-offset subtitle shadow.
13. **G-terrain-road-intrusion** (readability, WS4, 4, S, +0.5). No grass inside the road in R08.
14. **G-pack-separation** (readability, WS2, 3, M, +0.5). Crew separation, a player marker ring, rim light or outline on rivals.
15. **G-course-landmarks** (authenticity, WS4, 3, M, +0.5). Goat Rock, a ford with splash, Bridge Street signage, a plaza fountain, layered Ouachita ridgelines.
16. **G-crowd-trees** (scenery, WS5, 3, M, +0.5). Crowds and trees from brick models or imposters in one style, with variation.

```json
{
  "loop": 0,
  "role": "critic-claude",
  "tier": "high",
  "scores": {
    "characters": { "score": 4.0, "confidence": 0.75, "evidence": [
      { "shot": "crops/high/R03-player", "note": "Faceless faceted-sphere heads, cube hands, box torsos with two stripe bars; octagonal pie-wedge wheels; no prints, seams or studs." },
      { "shot": "crops/high/R15-player", "note": "Two crew members interpenetrate on the left; crew cast no shadows." },
      { "shot": "crops/high/R04-kart_3", "note": "Team identity from colour plus hat only; a rival crewman clips up inside the purple tub." },
      { "shot": "crops/high/R02-preview-captain", "note": "Captain buried behind rim and duck; only the back of a head and a fist show." }
    ] },
    "materials": { "score": 4.5, "confidence": 0.7, "evidence": [
      { "shot": "crops/high/R02-preview", "note": "Lit flat colour with facet shading only; no specular, bevels, studs or seams; tub water is a flat cyan sliver." },
      { "shot": "high/desktop/R06", "note": "384x240 upscale turns the Arlington's brick texture into blotchy dot noise." },
      { "shot": "crops/high/R03-kart_5", "note": "Painted cartoon crowd sprites in a different style from the flat-shaded models; noisy asphalt." }
    ] },
    "scenery": { "score": 4.5, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R08", "note": "Grass terrain slab cuts across the road; flat sprite trees with pixel edges." },
      { "shot": "high/desktop/R12", "note": "Identical oak sprites repeated in a row; not brick-built." },
      { "shot": "high/desktop/R17", "note": "Hill Wheatley Plaza is an empty brick oval with two distant facades." },
      { "shot": "high/desktop/R04", "note": "Coherent low-poly town, painted textures, sprite crowds; nothing brick-built (vs worlds-1)." }
    ] },
    "lighting": { "score": 4.5, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R07", "note": "Dusk is a sky gradient plus tint; streetlamps unlit, no light pools or lit windows." },
      { "shot": "high/desktop/R11", "note": "Sunset only in the sky gap; trees and grass stay noon-green, no warm rim light." },
      { "shot": "crops/high/R04-player", "note": "Hard octagonal blob shadow under the tub; crew feet have no contact shadow; no AO." }
    ] },
    "animation": { "score": 4.0, "confidence": 0.7, "evidence": [
      { "shot": "strips/high/R14", "note": "Power slide: tub skids into the curb with the crew rigid in formation; no steam, sparks, skid marks or camera kick." },
      { "shot": "strips/high/R16", "note": "'Ring around the tub' bar fills while the crew stay static in push positions; a rival tub slides through the near plane." },
      { "shot": "strips/high/R15", "note": "Fumble: crew do reposition around the tub, but stiffly with no effects or anticipation." }
    ] },
    "ui": { "score": 5.5, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R02", "note": "Team select shows no tub; the turntable preview is off-frame." },
      { "shot": "high/desktop/R18", "note": "Results leave the race HUD visible behind the panel; '1 laps'." },
      { "shot": "high/desktop/R05", "note": "'SCRUB!' callout sits on top of the landmark at screen centre." },
      { "shot": "high/desktop/R04", "note": "Clear, consistent HUD hierarchy (lap, time, water, item, ducks, place, minimap), but generic web cards, not brick-themed (vs drive-3)." }
    ] },
    "typography": { "score": 5.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R03", "note": "Pixel-font zero has a centre dot: '0:00.00' reads as '8:88.88'." },
      { "shot": "high/mobile/R01", "note": "Subtitle's offset shadow prints a ghost duplicate line; display and UI faces otherwise form a clear scale." },
      { "shot": "high/landscape/R01", "note": "Title logo clipped off the top of the screen." }
    ] },
    "readability": { "score": 5.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R12", "note": "Rival green crew interpenetrates the player's crew; the pack forms one blob." },
      { "shot": "high/mobile/R08", "note": "Grass slab crosses the road behind the player's tub." },
      { "shot": "high/desktop/R09", "note": "Left road edge lost in a same-colour dirt verge." },
      { "shot": "high/desktop/R10", "note": "Item orbs glow and read clearly; player tub centred and distinct." }
    ] },
    "mobile": { "score": 4.5, "confidence": 0.75, "evidence": [
      { "shot": "high/landscape/R02", "note": "Team panel clipped: stats and Choose/Back buttons not visible." },
      { "shot": "high/landscape/R18", "note": "Results clipped: player's row 8 and both buttons missing." },
      { "shot": "high/landscape/R17", "note": "Controls sit high on the screen and cover an item orb; Steer pill floats mid-left." },
      { "shot": "high/mobile/R04", "note": "Portrait framed on purpose: bottom controls never cover the tub; HUD stacked at top." }
    ] },
    "authenticity": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R06", "note": "The Arlington is recognisable (twin domed towers, red tile roof)." },
      { "shot": "crops/high/R02-preview-rear", "note": "Quapaw's tiled dome and Central Avenue crowd barriers." },
      { "shot": "high/desktop/R09", "note": "No Goat Rock and no ford visible: a generic dirt road in pines." },
      { "shot": "high/desktop/R16", "note": "Judge stop is a white box and a blue flag with no judge; water line, ducks and flags present elsewhere." }
    ] }
  },
  "ip": { "clean": true, "notes": "Heads are faceted spheres (not cylinders), hands are cubes (not C-shapes), torsos are rectangular boxes (not trapezoids). No LEGO name, logo or stud motif in any capture, menu or HUD." },
  "gaps": [
    { "id": "G-brick-figures", "category": "characters", "expectedGain": 2.5, "severity": 5, "effort": "L", "workstream": "WS2", "evidence": ["crops/high/R03-player", "crops/high/R02-preview-captain", "crops/high/R15-player"], "benchmark": "drive-4", "fix": "Rebuild crew and captain as original brick figures: separate bevelled head, torso, arms and legs with seam lines; printed faces (eyes, brows, mouth) and printed team uniforms; studded hats; avoid cylinder heads, C-hands and trapezoid torsos. Raise the captain's seat so the head clears the rim. Test: faces visible on all 5 figures in crops/high/R03-player and on the captain in R02-preview-captain." },
    { "id": "G-abs-material", "category": "materials", "expectedGain": 2.0, "severity": 5, "effort": "L", "workstream": "WS1", "evidence": ["crops/high/R02-preview", "crops/high/R04-player"], "benchmark": "worlds-1", "fix": "Plastic material on all brick parts (roughness 0.25-0.35, specular or clearcoat), bevel normals on every edge, studs on top faces within 15 m of the camera, a fixed palette of real brick colours. Test: highlights trace the bevels in crops/high/R04-player." },
    { "id": "G-brick-world", "category": "scenery", "expectedGain": 2.0, "severity": 5, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R04", "high/desktop/R12", "high/desktop/R17"], "benchmark": "worlds-1", "fix": "Studded baseplate ground, tile roads with seams, buildings with visible brick courses, brick-built trees and props replacing painted billboards; give R17 plaza set pieces." },
    { "id": "G-lighting-ao", "category": "lighting", "expectedGain": 1.5, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/desktop/R11", "crops/high/R04-player"], "benchmark": "worlds-4", "fix": "Ambient occlusion plus soft contact shadows under every figure and tub (replace the hard octagon); dusk with lit lamp globes, light pools and lit windows; sunset with warm rim light and terrain tint; fog matched to the sky." },
    { "id": "G-render-res", "category": "materials", "expectedGain": 1.0, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R06", "high/desktop/R04"], "fix": "Make native or about 0.75x DPR the default on the high tier and keep 'Authentic 240' as an option. Test: gfx.w at least 960 on high/desktop in shots.json; also lifts readability." },
    { "id": "G-slide-feedback", "category": "animation", "expectedGain": 1.0, "severity": 4, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14"], "benchmark": "drive-3", "fix": "Steam plume that grows with charge, skid marks, crew lean and scramble, FOV kick on release. Test: steam visible in at least 6 of 8 frames of strips/high/R14." },
    { "id": "G-landscape-overflow", "category": "mobile", "expectedGain": 1.0, "severity": 5, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R01", "high/landscape/R02", "high/landscape/R18"], "fix": "Size menu panels to 100dvh with an internal scroll, or use a two-column landscape layout. Test: logo, Choose/Back buttons and results row 8 plus buttons visible at 844x390." },
    { "id": "G-hud-theme", "category": "ui", "expectedGain": 1.0, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R18", "high/desktop/R05", "high/desktop/R04"], "benchmark": "drive-3", "fix": "Brick-plate HUD panels and tile buttons; hide the race HUD under results; keep callouts off the centre of the screen; fix '1 laps'; label the Towel/Bath/Soap/Loofah legend with counts." },
    { "id": "G-ring-around", "category": "animation", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R16", "high/desktop/R16"], "fix": "Crew run a full loop around the tub in time with the progress bar; add a judge figure at the stop (also +0.5 authenticity); stop rival tubs clipping through the camera near plane." },
    { "id": "G-team-preview", "category": "ui", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R02", "high/mobile/R02"], "fix": "Frame the turntable tub on the right half on desktop and landscape, and above the grid in portrait. Test: the tub is visible in high/desktop/R02." },
    { "id": "G-numeral-glyph", "category": "typography", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R03", "high/mobile/R18", "high/mobile/R01"], "fix": "Open zero (no centre dot) in HUD numerals; replace the subtitle's ghost-offset shadow with a 1-2 px outline." },
    { "id": "G-landscape-controls", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R17", "high/landscape/R04"], "fix": "Anchor Item/Hop/Brake/Push to the bottom-right and Steer to the bottom-left; move the water gauge up; keep the centre band clear so item orbs are not hidden." },
    { "id": "G-terrain-road-intrusion", "category": "readability", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R08", "high/mobile/R08"], "fix": "Clamp terrain heights below the road surface across road width plus shoulder. Test: no grass pixels inside the road in R08." },
    { "id": "G-pack-separation", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["high/desktop/R12", "high/landscape/R07", "crops/high/R04-kart_3"], "benchmark": "drive-3", "fix": "Crew collision and separation between tubs, a team-colour player marker ring, rim light or outline on rivals so the pack does not merge." },
    { "id": "G-course-landmarks", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R13", "high/desktop/R17"], "fix": "Add the Goat Rock formation, a ford with splash, Bridge Street signage, a fountain on the plaza, and layered Ouachita ridgelines in place of the flat backdrop." },
    { "id": "G-crowd-trees", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R10", "high/desktop/R12", "crops/high/R03-kart_5"], "fix": "Render crowds and trees from brick models (instanced or imposters) in one style with variation; remove the pale canopy smears and the visible repetition." }
  ]
}
```
