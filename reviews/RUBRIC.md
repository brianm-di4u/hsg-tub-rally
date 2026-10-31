# Visual review rubric v2: Spa City Tub Rally (brick-toy look)

Replaces the N64-era rubric (`RUBRIC-n64.md`) from loop 0 of the brick campaign. The target is a **glossy plastic
brick-toy world in a browser**: original brick figures pushing bathtubs through Hot Springs, Arkansas, built from
bevelled bricks, plates, tiles and studs, lit like a photographed toy, playable on phones. Score against the
benchmarks in `benchmarks/README.md` (shipped brick-toy games), not against what a browser game "usually" looks like.

Each review scores 10 categories from 1 to 10 in 0.5 steps (maximum 100). Score only what is in the captures. Cite
at least 2 captures per category; `animation` must cite a motion strip and `characters` at least one close-up.

| Category | key | Gate |
|---|---|---|
| Characters (figures and tubs) | `characters` | ≥ 7 |
| Materials (plastic, studs, seams, palette) | `materials` | ≥ 7 |
| Scenery (brick-world cohesion) | `scenery` | ≥ 7 |
| Lighting and atmosphere | `lighting` | ≥ 7 |
| Animation and game feel (strips first) | `animation` | ≥ 7 |
| UI / HUD | `ui` | ≥ 7 |
| Typography | `typography` | ≥ 7 |
| Readability (tubs, items, road, edges) | `readability` | ≥ 7 |
| Mobile (portrait and landscape at 390 px) | `mobile` | ≥ 7 |
| Authenticity (Hot Springs, the real race) | `authenticity` | ≥ 6 |

Measured gates, recorded by the developer in `loop-N/gates.json` and not scored by reviewers:
- **perf**: every device proxy within `tools/perf-budgets.json` (see `PERF.md`).
- **fidelity**: each in-game figure LOD within its pixel-error budget against the Gold Master renders.
- **ip**: no minifigure silhouette (cylinder head, C-shaped hands, trapezoid torso), no LEGO name or logo anywhere.
  Reviewers report anything that looks like either as a gap in `characters` with severity 5.

## Anchors
- **Characters.** 3: primitive boxes and balls, no faces or prints; teams differ only by colour. 5: consistent
  blocky figures and tubs in flat colours; team identity from colour and hat; they read as "boxy people", not toys.
  7: figures read at once as original plastic brick toys: bevelled parts with seams, printed faces with expression,
  printed team uniforms, studs on hats and tubs, tubs built from recognisable brick parts; all 12 teams distinct at
  chase distance; close-ups hold up (no gaps, z-fighting or smeared prints). 9: `drive-4`, `sw-2`: printed detail,
  part seams and mould lines, expressive faces, every team a character; holds up at 2× close-up.
- **Materials.** 3: flat unlit colour, or noisy textures with no material read. 5: lit colour, but surfaces read as
  painted card or clay; no specular; textures from a different style than the models. 7 (`worlds-1`): convincing
  ABS plastic: highlights that follow bevels, a consistent palette of real brick colours, shaded studs near the
  camera, seams between bricks and plates, clear parts that read as transparent plastic. 9 (`bj-1`..`bj-4`):
  micro-bevels catch light everywhere, subtle surface wear, translucent parts glow; every surface is a real toy.
- **Scenery.** 3: untextured blocks; world and characters clash. 5: a coherent low-poly town that isn't built from
  bricks; trees and crowds are flat sprites. 7 (`worlds-1`, `worlds-4`): the world reads as brick-built: baseplate
  ground, tile roads, brick buildings, trees and props; landmarks still recognisable; each course has its own set
  pieces. 9 (`drive-1`, `drive-5`): dense, layered brick worlds, distinct biomes, hero set pieces, no visible
  repetition.
- **Lighting.** 3: flat, no shadows or occlusion. 5: a directional light and fog, blob shadows; dusk and day differ
  only by tint. 7 (`worlds-4`): a soft key light, ambient occlusion in crevices and under figures, contact shadows
  that ground every tub, haze matched to the sky, day, dusk and sunset each with a deliberate palette. 9 (`bj-1`..
  `bj-3`, `sw-1`): studio-quality light, soft shadows, bounce colour; the scene looks like a photographed toy.
- **Animation and feel.** 3: sliding, rigid, no feedback. 5: run cycles and wheel spin, weak feedback. 7: the crew
  push-runs and circles the tub convincingly with toy articulation (rigid limbs swinging at joints are correct for
  this look); slides, boosts, hits and splashes read with particles and camera kick; water visibly sloshes. 9: every
  action has anticipation and follow-through; brick-built effects (parts popping off and snapping back).
- **UI / HUD.** 5: functional but cluttered or inconsistent. 7 (`drive-3`): a clear HUD hierarchy (place, lap,
  time, water, items) in one style that belongs to the brick world; menus consistent; nothing overlapping. 9: an
  animated, context-aware HUD integrated with the theme.
- **Typography.** 5: readable, mixed scales. 7: the display and UI faces form a clear scale; numerals read at a
  glance; nothing clipped. 9: type with character that still reads at 390 px.
- **Readability.** 5: tubs blend into the road; items hard to spot. 7: every tub, item, pickup and judge stop reads
  in every frame on both viewports; the road edge and racing line are obvious; the player's tub stands out. 9
  (`drive-3`): instant reads at speed, even in the busiest pack.
- **Mobile.** 5: works but cramped. 7: thumb controls never cover the tub; portrait and landscape both framed on
  purpose; the phone proxy holds 30 fps. 9: feels designed for the phone first.
- **Authenticity.** 5: a generic town. 7: the Row reads as the Row (the bathhouses recognisable in brick form), the
  Arlington closes the vista, the mountains read as the Ouachitas; the real race shows (water line, items, duck,
  flag, judges). 9: a local would name every course from a screenshot.
