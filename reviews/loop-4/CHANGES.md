# Loop 4: changes (facts only)

## Lighting
- High has screen-space ambient occlusion. The scene renders into a multisampled target with a depth texture.
  Occlusion is estimated at half resolution from 8 samples within 0.8 m, then blurred with depth-aware weights.
  It darkens crevices, wall feet, the ground under tubs and figures, and window recesses. It fades out from about
  40 m to 70 m and leaves the sky alone. Medium and Low have no AO pass. On High it costs about 0.3 ms per frame on
  the RTX 5060 at 1280×800.

## Scenery
- The horizon is brick-built. Three rings of long, low ridges with silhouettes stepped in 6 m plates, each column
  topped by a lighter plate edge, are tinted toward the horizon haze with distance. They replace the painted ridge
  panorama and the pale fog band under it, and they reach below the ground, so no band shows where the terrain
  ends.
- Two more tree shapes: a narrower, taller spruce in the pine stands and a maple of offset canopy clusters among the
  oaks, some in autumn orange. About a third of each stand is the new shape, chosen by position.
- Grass verges carry brick shrubs, flower clusters in six colours and studded grey rocks, scattered 2–12 m past the
  road edge on gentle ground. Low has half as many. Each kind is one instanced draw.
- Hill Wheatley Plaza's fountain is a centrepiece, about 7 m tall: a studded stone basin of clear water around a
  pedestal, with a giant brick stoneware jug (blue band, handle) pouring a stream into the basin.

- On Bathhouse Row a wide brick-stepped mountain, Hot Springs Mountain, rises in the ridge ring behind the bathhouses.
- Spectators have printed faces: two eyes and a smile.

## Materials
- Asphalt has a fine, low-contrast grain of 0.3 m flecks, which fades out with distance. It has no seams. Its gloss
  rose from 0.15 to 0.32, so the sun shows a sheen on it.
- Each brick in a wall has a lit top edge, like a bevel catching the light.
- The creek-ford sheet is clearer: alpha 0.5 instead of 0.78, in a lighter blue, so the creek bed shows through it.
- At dusk the warm lamp pools are dimmer at their centre and no longer clip to white on the sidewalk.
- The neon shop bands at dusk shade from darker at the bottom to brighter at the top, instead of one flat colour.

## Readability
- Near trees are hidden whole instead of half-faded. Each tree is hidden all but at once when its canopy comes within
  about 3 m of the camera, or when it stands in the sightline from the camera to the player's tub. The fade takes
  each tree's own size into account.
- A rival tub in the sightline from the camera to the player's tub, closer than the player, is hidden over a short
  band instead of drawn at 75% fade. Its bath water hides with it.

## Effects
- Slide spray fans sideways off the rear wheels instead of drifting back toward the camera. It has more, slightly
  smaller beads with a shorter life. Boost puffs are smaller and slower.
- Particles shrink to nothing within about 3 m of the camera, and their maximum on-screen size is smaller.
- The bath-water sheet tilts 2.5× as far with the slosh state, so the tilt shows at play size.

## UI
- The 10-gallon mark on the water gauge sits on its own dark tile, in 14 px type (up from 11 px).
- Phone landscape: the minimap sits lower and is slightly smaller, so it no longer touches the place readout.
- Panel stud rows space their studs to fit the panel, so no stud is cut by the border.
- Phone portrait team select frames the whole preview tub above the panel.
- Phone team select fits without scrolling. In portrait the stats sit in two columns above the pinned buttons. In
  landscape the panel has two columns: the team grid on the left, and the details, stats and both buttons on the
  right.

## Characters
- The tub rim is a smooth rolled lip: the detailed tub (LOD1) has 16–24 radial segments with smooth normals, up to
  10,860 triangles per tub (from 8,216).
- The simpler crew model (LOD2), drawn for rival tubs on Low, carries the printed faces.
- Crew packs: the print atlas moved into its own pack (assets/crew-prints.js, 118 KB). The geometry pack is 301 KB.
- The contact shadow, and the player's ring on it, lie on the road's slope under the tub. On cambered or banked
  roads they used to sink into the road on one side.
- The player's own tub and the team-select preview use the detailed crew model (LOD1) on every tier, including Low.
  On Low the other tubs keep LOD2.

## Capture rig
- The A/B close-up and strip pairs had no tier in their file names, so the Low-tier pairs overwrote the High-tier
  ones: loop 3's `ab/crop-*` and `ab/strip-*` pairs all showed Low. From loop 4 they come from High, the tier that is
  scored.
