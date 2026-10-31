# Loop 5: changes (facts only)

## UI
- The race readouts sit on bevelled tiles matching the water gauge: lap and time top left, place top right, and the
  item checklist under the gauge. Before, the text floated on the scene with only an outline.

## Lighting
- The daytime ground term of the ambient light is a muted green (#7E866A, was #6F8F4E), so shaded buff and white
  walls no longer turn olive.
- The place tile stays hidden until places are known, so it doesn't sit empty during the countdown.

## Materials
- Baseplate studs come in 4×4-stud plates, each a shade lighter or darker, so grass and studded roofs keep a pattern
  at distances where single studs are too small to draw.

## Animation and feel
- Slide-boost release kicks the field of view: 4° for warm steam, 6° for hot steam, gone in about a quarter
  second, with a light camera shake. An item hit kicks 3° with a stronger shake. Bumping another tub shakes the
  camera lightly. Reduced-motion settings turn off the kick and the shake.

## Scenery
- Horizon ridges: each 6 m column is its own plate, a shade lighter or darker, and darker and hazier toward its foot.
  The two nearer rings carry a darker tree-line band under the lit lip.
- Hot Springs Mountain behind the Row is a broad 70 m summit with two lower shoulders (38 m and 44 m), not one
  110 m bulge.

## Lighting
- Ambient occlusion (High) rotates its sample kernel in a 4×4 ordered pattern and blurs over exactly that 4×4
  period, so it leaves no residual stripes. Its depth bias grows with distance, so curved parts no longer occlude
  themselves. Strength is 0.75, down from 0.85.

## UI
- Phone landscape team select: the teams are a 4 × 3 grid of shorter cards, so all twelve fit beside the details,
  stats and buttons.

## Characters
- Bath water shows. The exported water sheet faces downward, so seen from above most of it was culled and every
  tub read as empty. The sheet now renders double-sided. It is a deeper blue (#3F9FD8, was a pale cyan), 86%
  opaque (was 72%), with a moderate gloss (0.55, was 0.95), so it no longer mirrors the sky white. It is narrowed to
  92% so the tilted sheet stays inside the rim, and it tilts 1.3× the slosh state (was 2×).
- The crew packer re-winds any triangle whose winding disagrees with its normals (12 triangles in the export).

## Scenery and materials
- Slopes steeper than baseplate are terraced plates: a groove and a lit lip every plate of rise, each plate a shade
  apart. Before, banks and road shoulders were a flat colour.
- The creek ford is a deeper, more opaque blue again (#2E86D0 at 70%), so it reads as water rather than flagstone.
- Near trees step aside about 1.5 m sooner.

## UI
- The 10-gallon tile sits inside the gauge, so it is no longer cut off at the gauge's right edge.

## Lighting
- Ambient occlusion (High) uses a 0.4 m radius (was 0.8). At 0.8 m it reached across the tub's curved interior, so
  each flat facet occluded differently and drew vertical stripes. The crew models already carry baked AO. Building
  crevices still darken.
- The sky dome glows toward the horizon, strongest in the sun's direction. Dusk and sunset get an amber glow and a
  soft sun disc; day gets a faint warm haze. In the R07 and R11 review views the sun is off-camera, so only the
  wider glow shows: lower sky is 1.09× (R07) and 1.18× (R11) the brightness of the top of the frame.
- Street furniture (lamp posts, benches, booths) fades out within about 4 m of the camera, as near trees do.
- Tree stands are thinned where two canopies would pierce each other: a tree is dropped if its trunk is closer to a
  kept tree than 62% of their combined canopy radii.

## More (after the loop-4 ruling)
- Bathhouse Row's sun is lower and from the other side: (-0.35, 0.55, -0.76), was (0.35, 0.82, 0.45). The
  Arlington's and the bathhouses' street fronts now face the sun, so facade planes separate.
- Windows (landmark glass and the facade kit) carry a sky sheen that brightens toward the top of each storey,
  plus a diagonal reflection streak.
- Rival tubs get a slim team-colour ring at 60% opacity; the player's ring stays bold and outlined.
- Slide spray follows the charge itself rather than only the tier: water blue, warming to white steam by the warm
  tier and to orange by the hot tier, growing and rising as it charges.
- The camera rolls up to 2.5° into a power slide (off under reduced motion).
- The fumble splash is smaller, paler and shorter-lived: 8 beads (was 12).
- Menu focus is drawn as a ring under the studs instead of an outline through them. Portrait team select leaves
  room for the panel's stud row above its title.
- Crew models (re-exported from Blender):
  - The water sheet faces up at every LOD.
  - Every hat carries 1–4 moulded studs (never on heads).
  - The tub's team stripe is a raised tile with seams, and seam lines separate the bowl from its base plate and
    rim ring.
  - Trail Shredders wear orange instead of green, so no two teams share a green torso.
  - The baked AO on tub interiors is smoothed.
  - Budgets hold: LOD1 figure at most 2,680 triangles, LOD1 tub at most 10,980.
