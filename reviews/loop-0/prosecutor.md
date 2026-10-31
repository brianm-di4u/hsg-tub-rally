<!-- Transcribed by the developer from the prosecutor's returned message (its transcript file was empty). The JSON block is verbatim; the prose is shortened to its charges. -->
# Prosecutor brief: loop 0 (high tier)

Opened all 18 high-tier desktop frames, all 16 phone frames, all 10 high-tier close-ups, all 3 high-tier strips and
`low/desktop/R11`; numbers were measured from the PNGs with a read-only script.

Four patterns of over-generosity: anchor-3 clauses present but uncounted (primitive boxes and balls, noisy textures
with no material read, world and characters clash); measurable failures described softly (no crew contact shadow;
sprites ignore the sunset grade; Steer control about 2:1 contrast); frames unopened (mobile R02 has no preview either;
landscape READY hides the grid; a low-tier sky defect); anchor-7 checklists failing outright for typography and UI.

| Category | Claude | Codex | Mean | Proposed |
|---|---|---|---|---|
| characters | 4.0 | 3.5 | 3.75 | 3.5 |
| materials | 4.5 | 3.5 | 4.0 | 3.5 |
| scenery | 4.5 | 4.5 | 4.5 | 4.0 |
| lighting | 4.5 | 4.5 | 4.5 | 4.0 |
| animation | 4.0 | 4.5 | 4.25 | 3.5 |
| ui | 5.5 | 5.5 | 5.5 | 5.0 |
| typography | 5.5 | 6.0 | 5.75 | 5.0 |
| readability | 5.5 | 5.5 | 5.5 | 5.0 |
| mobile | 4.5 | 3.5 | 4.0 | 3.5 |
| authenticity | 6.0 | 6.0 | 6.0 | 6.0 (accept) |
| total | 48.5 | 47.0 | 47.75 | 43.0 |

Key charges: two cowboy-hat teams (Steam Rangers, Suds Posse) read as one team at chase distance (`high/desktop/R09`);
crew contact shadow measured absent (luma 64 under feet vs 62 open road, `crops/high/R04-player`); sunset sprites
ungraded (R11 tree RGB 84,114,32 vs noon 79,116,43); R14 and R16 strips at anchor 3; three unrelated callout styles;
Steer pill 1.9–2.3:1 contrast; landscape HUD about 25% of the frame; a flat salmon disc fills the sky in
`low/desktop/R11`. IP: clean.

```json
{
  "loop": 0,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "characters": { "score": 3.5, "confidence": 0.8, "evidence": [
      { "shot": "crops/high/R03-player", "note": "Geometry is the anchor-3 text: featureless faceted spheres, cube hands, box torsos; duck is yellow lumps; wheels are 8-sided pie-wedge prisms with no tyre." },
      { "shot": "high/desktop/R09", "note": "Player (brown cowboy hats, tan shirts ~RGB 170,148,110) beside a rival in brown cowboy hats, cream shirts (~200,190,155); tubs hidden, so the two teams read as one. Fails 'all 12 teams distinct at chase distance'." },
      { "shot": "strips/high/R15", "note": "Crew pile into each other on the tub's front-right corner in frames 2 and 6; crops/high/R15-player confirms two crew sharing one space." },
      { "shot": "crops/high/R04-kart_3", "note": "Rival cap inside the purple tub; held props float at cube hands; close-up integrity fails in 3 of 10 close-ups." },
      { "shot": "crops/high/R02-preview", "note": "Named captain is a blank sphere under a cap; never shows a face in any close-up (vs 2k-drive/drive-4.jpg)." }
    ] },
    "materials": { "score": 3.5, "confidence": 0.75, "evidence": [
      { "shot": "crops/high/R04-player", "note": "Bottom 40% is smeared, magnified asphalt noise at far lower texel density than the geometry: anchor-3 'noisy textures with no material read'." },
      { "shot": "crops/high/R15-player", "note": "Water is an opaque flat cyan polygon with one white line; nothing transparent anywhere (anchor 7 needs clear parts)." },
      { "shot": "crops/high/R04-kart_3", "note": "Bathhouse window is a featureless navy arch about 170x190 px; flat colour void." },
      { "shot": "crops/high/R02-preview", "note": "Pink tub wall is one flat tone across about 350 px; no specular or falloff (vs worlds/worlds-1.jpg)." },
      { "shot": "high/desktop/R17", "note": "Pickup orb is a pixel-stepped glow blob." }
    ] },
    "scenery": { "score": 4.0, "confidence": 0.7, "evidence": [
      { "shot": "crops/high/R03-kart_5", "note": "Painted cartoon children with faces beside faceless box figures: anchor-3 'world and characters clash'." },
      { "shot": "high/desktop/R07", "note": "Right-edge spectator stands slightly further away than the player's tub yet is drawn about 25% taller than the crew." },
      { "shot": "high/desktop/R16", "note": "Judge stop is an untextured white box with a red strip (anchor-3 'untextured blocks'); lamp heads are plain cubes in R13 and R01." },
      { "shot": "high/mobile/R08", "note": "Grass slab spans full width behind the player's crew at chest height; the tub looks parked on a lawn." },
      { "shot": "high/desktop/R06", "note": "World ends in a flat green plane and a pale band; R08, R09 and R10 horizons read as open water." }
    ] },
    "lighting": { "score": 4.0, "confidence": 0.75, "evidence": [
      { "shot": "crops/high/R04-player", "note": "Measured luma 64 under the crewman's feet vs 62 open road (tub octagon 41): figures have no contact shadow at all." },
      { "shot": "crops/high/R15-player", "note": "65 under feet vs 65 open road; only the tub gets a hard octagon shadow." },
      { "shot": "high/desktop/R11", "note": "Sunset foreground tree averages RGB 84,114,32 vs 79,116,43 at noon (R10), while the road darkens 66 to 43: sprites ignore the grade." },
      { "shot": "high/desktop/R07", "note": "Hard sky seam across the top third; lamp heads unlit at dusk (vs worlds/worlds-4.jpg)." }
    ] },
    "animation": { "score": 3.5, "confidence": 0.75, "evidence": [
      { "shot": "strips/high/R14", "note": "Tub yaws and slides to the right curb and barrier by frame 8; zero steam, spray or skid marks in 8 frames of 'charging hot steam'; camera rolls but never recentres. Anchor 3." },
      { "shot": "strips/high/R16", "note": "Crew still (frame-to-frame change near the crew falls to 10 and 9 grey levels, frames 6-8) while the banner says they circle; only motion is a rival at near-camera range." },
      { "shot": "strips/high/R15", "note": "Fumble drains the gauge 37 to 36 GAL with no splash or slosh; crew overlap in frames 2 and 6 (vs 2k-drive/drive-3.jpg effects)." }
    ] },
    "ui": { "score": 5.0, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R16", "note": "Three unrelated callout styles: framed blue banner here, pixel-gradient READY/SCRUB! in R03/R05, teal pill HOT STEAM! in R17." },
      { "shot": "high/landscape/R03", "note": "READY covers the whole grid ahead; the gauge covers a rival tub." },
      { "shot": "high/mobile/R18", "note": "Results panel over the live HUD and the dimmed Item/Hop/Brake/Push buttons; panel edge butts the legend." },
      { "shot": "high/mobile/R02", "note": "No team preview on portrait either; text cards only (vs 2k-drive/drive-2.jpg)." },
      { "shot": "high/desktop/R09", "note": "Item slot icon is an abstract three-loop glyph with a ~8 px '2'; R17 'x3' sits on the bubble rim." }
    ] },
    "typography": { "score": 5.0, "confidence": 0.75, "evidence": [
      { "shot": "high/mobile/R04", "note": "Zero glyph has interior marks (pixel-inspected in high/desktop/R03); '0:07.00' reads as '8:87.88'. Fails 'numerals at a glance'." },
      { "shot": "high/landscape/R02", "note": "Panel cut off below the team heading; R01 logo and R18 row 8 plus buttons also clipped. Fails 'nothing clipped'." },
      { "shot": "high/desktop/R01", "note": "Ghost-offset shadow doubles the subtitle on all three viewports; 'Arkansas' orphaned on its own line." }
    ] },
    "readability": { "score": 5.0, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R12", "note": "Orange rival's tub lost inside the player's crew; packs show crews, never tubs." },
      { "shot": "high/mobile/R07", "note": "Player's black crew on near-black dusk road; rival ahead overlaps the player's crew vertically." },
      { "shot": "high/desktop/R09", "note": "Bottom-right rival crew and captain fuse into one blob with no tub shape." },
      { "shot": "high/mobile/R04", "note": "Scene rendered at 240x519 (shots.json): crew about 9 render px wide; Steer control about 2:1 contrast against the road (vs 2k-drive/drive-3.jpg)." }
    ] },
    "mobile": { "score": 3.5, "confidence": 0.75, "evidence": [
      { "shot": "high/landscape/R18", "note": "Row 8 and both actions off-screen; with R01 and R02, landscape menus fail in 3 of 3 captures: not 'works'." },
      { "shot": "high/mobile/R17", "note": "Steer pill contrast 1.90:1 (2.08 in R04, 2.30 in R07), below the 3:1 minimum for a control." },
      { "shot": "high/landscape/R17", "note": "Persistent HUD covers about 25% of the frame by bounding box (portrait about 18%); Brake hides an item orb." },
      { "shot": "high/mobile/R02", "note": "Portrait team select shows no team or tub." }
    ] },
    "authenticity": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R06", "note": "Arlington recognisable; accept 6. Nothing in brick form; flat plane and pale band where Ouachita ridges should be." },
      { "shot": "high/desktop/R05", "note": "Lawn and open sky beside the Fordyce; no Hot Springs Mountain rising behind the Row." },
      { "shot": "high/desktop/R16", "note": "No judges at the judge stop; R09, R10, R12, R13 and R17 generic. Caps the score at 6." }
    ] }
  },
  "ip": { "clean": true, "notes": "Faceted sphere heads, cube hands, rectangular torsos (crops/high/R03-player-rear); crowd are cartoon children; no LEGO name, logo or stud motif in menus, HUD or scenes." },
  "gaps": [
    { "id": "G-crew-integrity", "category": "characters", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R15-player", "strips/high/R15", "crops/high/R04-kart_3"], "fix": "Crew separation constraint (min 0.35 m between figures, rival crew excluded from other tubs' volume); held props snapped to a hand socket with a grip pose. Test: no overlapping figures in crops/high/R15-player, strips/high/R15 frames 2 and 6, crops/high/R04-kart_3." },
    { "id": "G-team-silhouettes", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["high/desktop/R09", "high/desktop/R18"], "benchmark": "2k-drive/drive-4.jpg", "fix": "Give each of the 12 teams a unique hat silhouette plus a two-colour torso pair; Steam Rangers and Suds Posse must not share a hat. Test: a chase-distance sheet of all 12 teams with names hidden, each identified by a reviewer." },
    { "id": "G-sprite-grade", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R11", "high/desktop/R10"], "benchmark": "worlds/worlds-4.jpg", "fix": "Feed sprite and billboard materials the same light, tint and fog uniforms as meshes. Test: mean foreground-tree colour in R11 shifts at least 20% toward the sunset key relative to R10." },
    { "id": "G-steer-contrast", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R04", "high/mobile/R07", "high/mobile/R17"], "fix": "Filled Steer pill with chevrons and a dark outline. Test: at least 3:1 contrast against the road behind it in portrait R04, R07 and R17 (now 2.08, 2.30, 1.90)." },
    { "id": "G-landscape-hud-scale", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R17", "high/landscape/R03"], "fix": "Scale gauge, minimap, place and buttons by viewport height in landscape. Test: persistent HUD at most 15% of the 844x390 frame by bounding box; no HUD element over the road band or a rival tub in R03 or R17." },
    { "id": "G-callout-system", "category": "ui", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R16", "high/desktop/R17", "high/landscape/R03"], "benchmark": "2k-drive/drive-3.jpg", "fix": "One callout component (single style for READY, SCRUB!, HOT STEAM!, judge banners) anchored in the upper band. Test: READY does not overlap any tub in landscape R03." },
    { "id": "G-row-backdrop", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06", "high/desktop/R08"], "fix": "Tree-covered Hot Springs Mountain slope directly behind the Row and layered Ouachita ridgelines replacing the pale water-like horizon band. Test: R05 and R06 show a ridge behind the buildings; no pale band in R06, R08, R09 or R10." },
    { "id": "G-low-tier-sun-disc", "category": "lighting", "expectedGain": 0, "severity": 3, "effort": "S", "workstream": "WS7", "evidence": ["low/desktop/R11"], "fix": "Low tier R11 shows a giant flat salmon semicircle filling the sky (sun or sky-dome sprite unblended); the high tier hides it behind trees. Blend or fog the disc the same way on both tiers. Test: no flat disc edge in low/desktop/R11. Low tier (phones) only; no high-tier score gain." }
  ]
}
```
