<!-- Transcribed by the developer from the advocate's returned message (its transcript file was empty). The JSON block is verbatim; the prose is shortened to its rulings. -->
# Advocate brief: loop 0 (high tier)

**Verdict.** Both critics have the overall picture right: this is the pre-campaign N64-era build, not a brick-toy
game. I concede the three core gaps (brick figures, plastic material, brick world) and most named defects. I disagree
where (1) both critics missed visible effects (water slosh in `strips/high/R16` frames 4–8 and `strips/high/R14`;
steam over the tub in `high/desktop/R17`); (2) defects are blamed on the wrong cause (facade noise is the 384×240
upscale, the SCRUB! callout is a race-start capture artifact, the buried captain in `R02-preview-captain` is a
close-up camera artifact); (3) Codex scored characters, materials and mobile below anchors the captures match and
left out the measured performance table; (4) a few plain misreads (FACT ERROR below). Proposed total 51.0 against a
critic mean of 47.75.

## Rulings
- **Characters 4.5** (mean 3.75): identity from colour *and* hat, uniform, tub, wheel and flag matches anchor 5
  (`crops/high/R03-kart_1`, `R03-kart_5`, `R04-kart_3`); −0.5 for fused crew (`strips/high/R15` f1, 2, 6, 7).
  FACT ERROR (Claude): the navy-capped figures in `crops/high/R04-kart_3` belong to the Bubble Patrol tub behind, not
  clipping into the purple tub. The captain-seat fix targets a camera artifact (`crops/high/R02-preview` shows the head clear of the rim).
- **Materials 4.5** (mean 4.0): the crops are lit facet shading (anchor 5, not anchor 3); the R06 noise is
  render-resolution (`crops/high/R03-kart_1` shows the same facade clean at native resolution).
- **Scenery 4.5**: conceded (not brick-built, sprites, R08 slab, R12 repetition). FACT ERROR (Claude, partial): the
  plaza has a centrepiece, visible in `high/landscape/R17`.
- **Lighting 4.5**: conceded blob shadows, no crew shadows or AO, unlit globes, sky seam. FACT ERROR (Claude,
  partial): `high/desktop/R07` shows a warm glowing band along the ground-floor shopfronts at dusk.
- **Animation 5.0** (mean 4.25): FACT ERROR (both): water sloshes in `strips/high/R16` f4–8 and tilts mid-slide in
  `strips/high/R14` (gauge 41→39 GAL). Circling with jointed strides exists in `strips/high/R15`; steam exists in
  `high/desktop/R17`. Conceded: R14 lacks steam/skids/FOV kick; R16 crew hold push formation.
- **UI 6.0**: one consistent system; SCRUB! is a capture artifact; the HUD under results is dimmed; the item row
  shows live state (`high/desktop/R15`). Conceded: R02 has no tub, "1 laps", not brick-themed.
- **Typography 6.0**: FACT ERROR (Codex): `high/desktop/R18` table is the same rounded sans, not serif; two faces form
  a clear scale. Conceded: slashed zero reads near 8, subtitle ghost shadow, landscape logo clip.
- **Readability 5.5**: kept.
- **Mobile 4.5** (mean 4.0): portrait fits fully (`high/mobile/R01`, `R02`, `R18`); controls never cover the tub;
  measured perf meets 30 fps. Conceded: three landscape menus overflow.
- **Authenticity 6.0**: kept.
- **IP**: clean, agreed.

```json
{
  "loop": 0,
  "role": "advocate",
  "tier": "high",
  "scores": {
    "characters": { "score": 4.5, "confidence": 0.6, "evidence": [
      { "shot": "crops/high/R04-kart_3", "note": "Teal antenna crowns, pink uniforms with teal braces, purple tub, teal wheels: identity from colour AND hat (anchor 5). The navy-capped figures belong to the Bubble Patrol tub alongside (its rim and duck visible at right), not clipping inside the purple tub." },
      { "shot": "crops/high/R03-kart_1", "note": "Orange hard hats, lime uniforms, orange tub, green-white wheels, green flag: hat, uniform, tub, wheel and flag all vary per team." },
      { "shot": "crops/high/R03-kart_5", "note": "White peaked hats, white tub, gold wheels, pale-blue flag; faceless faceted heads and cube hands as both critics say." },
      { "shot": "crops/high/R02-preview", "note": "Captain's head and cap clear the rim at the same moment R02-preview-captain looks buried: that one is a camera artifact, not a seating defect." },
      { "shot": "strips/high/R15", "note": "Crew pairs fuse into one double-width figure in frames 1, 2, 6, 7: a real close-up defect (−0.5)." }
    ] },
    "materials": { "score": 4.5, "confidence": 0.65, "evidence": [
      { "shot": "crops/high/R04-player", "note": "Lit facet shading (light tops, mid sides, dark undersides) on tub, chassis, wheels: anchor 5 'lit colour, no specular', not anchor 3 'flat unlit'." },
      { "shot": "crops/high/R03-kart_1", "note": "At native resolution the Arlington facade is a clean window grid with painted brick courses; the R06 blotch is a render-resolution artifact." },
      { "shot": "high/desktop/R06", "note": "384x240 upscale turns the same facade into blotchy noise: what players see by default (−0.5)." },
      { "shot": "crops/high/R02-preview-captain", "note": "Broad matte tub wall and rim; no bevel highlight, studs or seams (conceded)." }
    ] },
    "scenery": { "score": 4.5, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R08", "note": "Grass slab crosses the road; sprite pines (conceded)." },
      { "shot": "high/desktop/R12", "note": "Same oak sprite repeated along the road (conceded)." },
      { "shot": "high/landscape/R17", "note": "The plaza has a centrepiece (round stone plinth with blue-topped blocks on a raised brick ring), framed out on desktop: not 'empty'." },
      { "shot": "high/desktop/R05", "note": "Distinct Fordyce facade and awning; each course has its own environment and palette." }
    ] },
    "lighting": { "score": 4.5, "confidence": 0.7, "evidence": [
      { "shot": "crops/high/R04-player", "note": "Hard octagonal blob shadow under the tub, none under the crew, no AO (conceded)." },
      { "shot": "high/desktop/R07", "note": "Warm glowing band along the left shopfronts at dusk (absent by day in R04), but lamp globes unlit and a hard sky-band seam." },
      { "shot": "high/desktop/R11", "note": "Sunset only in the sky; foliage stays green (conceded)." }
    ] },
    "animation": { "score": 5.0, "confidence": 0.65, "evidence": [
      { "shot": "strips/high/R16", "note": "Tub still on the line in frames 4-8 while the cyan water surface rocks (tilts one way in f4, the other in f5, again in f7, near level in f8): visible slosh both critics missed. Crew stay in push formation under the 'circles the tub' banner (conceded)." },
      { "shot": "strips/high/R15", "note": "Crew run around the tub and swap sides frame to frame with jointed stride poses and items in hand: the anchor-7 circling behaviour, stiff." },
      { "shot": "strips/high/R14", "note": "Stride poses change (f3, f5, f6), water line tilts mid-slide, gauge drops 41 to 39 GAL; no steam, sparks, skid marks or FOV kick (conceded)." },
      { "shot": "high/desktop/R17", "note": "Lilac steam cloud over the tub under the HOT STEAM! callout: the steam effect exists in the build." }
    ] },
    "ui": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R04", "note": "Clean HUD hierarchy; water gauge (~146x92 px) is larger than the 8TH badge (~125x60 px), so 'disproportionately small' is overstated." },
      { "shot": "high/desktop/R15", "note": "Bath icon greys out after the fumble: the item row shows live state and each icon is named." },
      { "shot": "high/desktop/R03", "note": "READY sits where SCRUB! sits in R05/R06; those are race-start frames (0:00.02) with the camera moved to the landmark, not a callout placement defect." },
      { "shot": "high/desktop/R02", "note": "No tub preview: half the screen is empty street (conceded)." },
      { "shot": "high/desktop/R18", "note": "Consistent panel, button and heading system; HUD dimmed under the modal; '1 laps' bug (conceded)." }
    ] },
    "typography": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R18", "note": "Table text is the same rounded sans as the buttons, not serif: the system is two faces (pixel display + rounded sans), the clear scale anchor 7 asks for." },
      { "shot": "high/mobile/R18", "note": "Slashed HUD zero in '1:01.00' reads close to the 8 in '8TH' (conceded in substance)." },
      { "shot": "high/desktop/R01", "note": "Subtitle offset shadow prints a ghost line (conceded); title and labels otherwise read well." }
    ] },
    "readability": { "score": 5.5, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R10", "note": "Item orbs glow; player tub centred and distinct; anchor-5 'items hard to spot' doesn't apply." },
      { "shot": "high/desktop/R12", "note": "A lime Trail Shredders crewman stands between the player's pink crew; the pack merges (conceded)." },
      { "shot": "high/mobile/R08", "note": "Grass slab crosses the road (conceded)." },
      { "shot": "high/landscape/R17", "note": "Brake button covers an item orb; the tub itself stays clear." }
    ] },
    "mobile": { "score": 4.5, "confidence": 0.65, "evidence": [
      { "shot": "high/mobile/R02", "note": "Portrait team select fits fully, including stats and both buttons." },
      { "shot": "high/mobile/R18", "note": "Portrait results show all 8 rows and both buttons; R01 portrait shows the whole menu." },
      { "shot": "high/landscape/R02", "note": "Landscape cuts the stats and Choose/Back; R01 and R18 landscape also overflow (conceded)." },
      { "shot": "high/landscape/R17", "note": "Controls sit high and cover an orb but never the tub; the measured perf table (SwiftShader low/mobile min 93 fps) meets the 30 fps criterion Codex left uncredited." }
    ] },
    "authenticity": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R05", "note": "Fordyce facade and marquee awning recognisable." },
      { "shot": "crops/high/R03-kart_1", "note": "The Arlington's twin towers close Central Avenue." },
      { "shot": "high/desktop/R09", "note": "No Goat Rock and no ford (conceded)." },
      { "shot": "high/desktop/R16", "note": "Stop booth and flag, no judge figure (conceded)." }
    ] }
  },
  "ip": { "clean": true, "notes": "Agree with both critics: faceted heads, cube hands, rectangular torsos; no LEGO name or logo." },
  "gaps": [
    { "id": "G-brick-figures", "category": "characters", "expectedGain": 2.5, "severity": 5, "effort": "L", "workstream": "WS2", "evidence": ["crops/high/R03-player", "crops/high/R15-player", "strips/high/R15"], "benchmark": "drive-4", "fix": "Original brick figures with bevelled parts, seam lines, printed faces and team uniforms, studded hats; no cylinder head, C-hand or trapezoid torso. Resolve crew interpenetration (strips/high/R15). Drop the captain-seat item: crops/high/R02-preview shows the head clear of the rim; re-aim the R02-preview-captain camera instead." },
    { "id": "G-original-toys", "category": "characters", "expectedGain": 2.5, "severity": 5, "effort": "L", "workstream": "WS2", "evidence": ["crops/high/R02-preview", "crops/high/R03-player-rear"], "benchmark": "drive-4; sw-3", "fix": "Same work as G-brick-figures; count once. Articulated original parts, face prints, team graphics, assembled bevelled tubs; verify teams stay distinct at chase distance." },
    { "id": "G-abs-material", "category": "materials", "expectedGain": 2.0, "severity": 5, "effort": "L", "workstream": "WS1", "evidence": ["crops/high/R02-preview-captain", "crops/high/R04-player"], "benchmark": "worlds-1", "fix": "Plastic material (roughness 0.25-0.35, clearcoat), bevel normals, studs on top faces within 15 m, fixed brick palette. Test: highlights trace bevels in crops/high/R04-player." },
    { "id": "G-plastic-response", "category": "materials", "expectedGain": 2.0, "severity": 5, "effort": "L", "workstream": "WS1", "evidence": ["crops/high/R03-player", "crops/high/R02-preview-captain"], "benchmark": "worlds-1; bj-3", "fix": "Overlaps G-abs-material; count once. Specular, bevel highlights, seams, clearer water (the water already sloshes: strips/high/R16). Gain cut from +3: the baseline is lit colour (anchor 5), not anchor 3." },
    { "id": "G-brick-world", "category": "scenery", "expectedGain": 2.0, "severity": 5, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R04", "high/desktop/R12", "high/desktop/R08"], "benchmark": "worlds-1", "fix": "Studded baseplate ground, tile roads with seams, buildings with modelled brick courses, brick-built trees and props. Frame the existing plaza centrepiece (high/landscape/R17) in R17." },
    { "id": "G-world-construction", "category": "scenery", "expectedGain": 1.0, "severity": 4, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06"], "benchmark": "worlds-1; drive-5", "fix": "Rebuild the R05/R06 landmark facades from brick, plate, tile and trim modules. Gain cut from +2: this covers two facades, not the ground, roads or trees; the rest is G-brick-world." },
    { "id": "G-lighting-ao", "category": "lighting", "expectedGain": 1.5, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["crops/high/R04-player", "high/desktop/R07", "high/desktop/R11"], "benchmark": "worlds-4", "fix": "AO plus soft contact shadows under every figure and tub; lit lamp globes and light pools at dusk (the warm shopfront band in R07 already exists); warm sunset rim light; fog matched to the sky." },
    { "id": "G-grounding-and-sky", "category": "lighting", "expectedGain": 1.5, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["crops/high/R04-player", "high/desktop/R07", "high/desktop/R11"], "benchmark": "worlds-4; bj-1", "fix": "Overlaps G-lighting-ao; count once. Contact shadows and crevice occlusion; remove the hard seam between the upper sky and the cloud band in R07." },
    { "id": "G-render-res", "category": "materials", "expectedGain": 1.0, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R06", "crops/high/R03-kart_1"], "fix": "Native or ~0.75x DPR default on high; keep 'Authentic 240' as an option. This is the real cause of the R06 facade noise and the pixel-stepped canopies (compare native-resolution crops/high/R03-kart_1); also helps readability." },
    { "id": "G-scene-resolution", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R04", "high/mobile/R04"], "benchmark": "drive-3", "fix": "Same fix as G-render-res; count once. Lowered: the pack merge comes mostly from crew interpenetration and tight spacing (high/desktop/R12, strips/high/R15), which resolution won't fix." },
    { "id": "G-slide-feedback", "category": "animation", "expectedGain": 1.0, "severity": 4, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "high/desktop/R17"], "benchmark": "drive-3", "fix": "Surface the existing steam puff (high/desktop/R17) during slide charge, growing with charge; add skid marks and an FOV kick on release. Test: steam in at least 6 of 8 frames of strips/high/R14." },
    { "id": "G-action-feedback", "category": "animation", "expectedGain": 1.5, "severity": 4, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R16"], "benchmark": "drive-3", "fix": "Overlaps G-slide-feedback and G-ring-around; count once. Cut from +2: the water already sloshes (strips/high/R16 frames 4-8) and the circling behaviour exists (strips/high/R15)." },
    { "id": "G-ring-around", "category": "animation", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R16", "strips/high/R15"], "fix": "Trigger the circling behaviour already in strips/high/R15 at judge stops, timed to the progress bar; add a judge figure; keep rival tubs out of the camera's near plane." },
    { "id": "G-landscape-overflow", "category": "mobile", "expectedGain": 1.5, "severity": 5, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R01", "high/landscape/R02", "high/landscape/R18"], "benchmark": "drive-2", "fix": "Both critics listed this ID (Claude +1.0, Codex +2.5); set to +1.5. Size panels to 100dvh with internal scroll or use a two-column landscape layout. Test: logo, Choose/Back, results row 8 and buttons visible at 844x390." },
    { "id": "G-landscape-controls", "category": "mobile", "expectedGain": 0.5, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R17", "high/landscape/R04"], "fix": "Anchor Item/Hop/Brake/Push bottom-right and Steer bottom-left; keep the side band clear of orbs. Severity lowered: the controls never cover the tub in any landscape frame." },
    { "id": "G-hud-theme", "category": "ui", "expectedGain": 1.0, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/desktop/R18"], "benchmark": "drive-3", "fix": "Brick-plate HUD panels and tile buttons; fix '1 laps'. Drop the 'callouts off centre' item (SCRUB! in R05/R06 is a race-start capture; READY in R03 sits in the same place) and 'hide HUD under results' (already dimmed)." },
    { "id": "G-team-preview", "category": "ui", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R02", "high/mobile/R02"], "fix": "Frame the turntable tub in the empty right half on desktop and landscape, and above the grid in portrait. Severity lowered: all selection data and both buttons are present." },
    { "id": "G-team-showcase", "category": "ui", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R02", "high/mobile/R02"], "benchmark": "drive-2", "fix": "Same defect as G-team-preview; count once." },
    { "id": "G-numeral-glyph", "category": "typography", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R18", "high/desktop/R01"], "fix": "Open zero (no slash) in the HUD pixel face so it can't be read as the 8 in '8TH'; replace the subtitle's offset shadow with a 1-2 px outline." },
    { "id": "G-terrain-road-intrusion", "category": "readability", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R08", "high/mobile/R08"], "fix": "Clamp terrain below the road surface across road width plus shoulder. Test: no grass inside the road in R08 on all viewports." },
    { "id": "G-road-intersection", "category": "readability", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R08", "high/mobile/R08"], "benchmark": "worlds-1", "fix": "Same defect as G-terrain-road-intrusion; count once." },
    { "id": "G-pack-separation", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["high/desktop/R12", "strips/high/R15", "high/landscape/R07"], "benchmark": "drive-3", "fix": "Crew-to-crew separation within and between tubs, a player marker ring, rim light on rivals. Drop the crops/high/R04-kart_3 evidence: it shows the adjacent Bubble Patrol tub behind, not clipping." },
    { "id": "G-course-landmarks", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R13", "high/desktop/R16"], "fix": "Goat Rock and a ford with splash, Bridge Street signage, layered Ouachita ridgelines; bring the existing plaza centrepiece (high/landscape/R17) into the desktop R17 view rather than adding a new one." },
    { "id": "G-course-identity", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R10", "high/desktop/R12"], "benchmark": "drive-5", "fix": "Same defect as G-course-landmarks; count once." },
    { "id": "G-crowd-trees", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R12", "high/desktop/R10", "crops/high/R03-kart_5"], "fix": "Brick-model or imposter crowds and trees in one style with variation; remove the pale canopy smears. The pixel-stepped edges are mostly the upscale (G-render-res)." },
    { "id": "G-sprite-repetition", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS5", "evidence": ["high/desktop/R10", "high/desktop/R12", "high/desktop/R04"], "benchmark": "worlds-1", "fix": "Same defect as G-crowd-trees; count once." }
  ]
}
```
