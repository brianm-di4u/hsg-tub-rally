# Loop 2: changes (facts only)

## Scenery
- Trees are brick-built and instanced: oak, magnolia (with white flowers) and pine, as stacked bricks and plates
  with studded tops on a brown trunk, each with its own green, size and turn. They replace the painted tree cards.
  A tree that stands close to the road keeps its height but has a narrower canopy, so it no longer reaches over the
  road. Trees thin out with a dither pattern within about 9 m of the camera.
- Spectators are small brick figures, instanced: each has its own shirt and skin colour, and about half cheer with
  swinging arms. They stand behind white-railed barriers on blue posts. They replace the painted crowd cards.
- Trees, spectators and barriers cast sun shadows. Spectators cast them on High only.
- Judge stops: two brick judges in black-and-white striped shirts, holding clipboards, stand in front of each judge
  booth. The blue feather flags have a white stripe down the outer edge and across the top.
- The mountain ford and dirt stretches are now tan tiles instead of grey studded plate.

## Materials and lighting
- Wall patterns can be combined: landmark walls and trim show running-bond brick courses, and flat roof tops show
  studs. Studs now appear only on upward faces, and brick courses only on walls.
- Brick seams now also darken the surface colour (before, they darkened only the ambient light). They keep a
  minimum width at distance, so they stay visible on far buildings.
- Building walls darken over the bottom 1.2 m, where they meet the ground.
- Road, terrain and sidewalk normals are smoothed across shallow folds. Before, every triangle had its own normal.
- Figures and tubs get a rim light from the sky colour at grazing angles.

## Characters and tubs
- Torso backs are printed with crossed suspenders in the team accent colour.
- Tub rim: the top faces had been culled when seen from above, and are fixed. The rim has an inner wall, and its
  studs sit on its top.
- Tubs have push bars: one across the back and one along each side, on posts at hand height. The crew stand at the
  bars, and when they circle the tub they are evenly spaced.
- A small inverted cone in the team's flag colour floats above the player's tub.
- A rival tub that is closer to the chase camera than the player's tub, within 4.5 m, thins out with a dither
  pattern.

## UI
- The title subtitle's leftover drop shadow is removed. The logo's drop shadow now applies to the logo art only.
- Subtitles wrap into balanced lines.
- HUD item labels (Towel, Bath, Soap, Loofah) are 13 px, up from 11 px.
- Phone landscape: the water gauge sits below the lap and time block, and the minimap sits top right under the
  place badge.
- Phone portrait team select: the team panel docks at the bottom, and the turning tub is framed above it.
- The touch Steer pad is 140×50 CSS px.

## Performance
- In the sun-shadow pass, tubs draw their simpler far model. On Medium, spectators cast no shadow. Measured on the
  Medium Row scene, this cut the triangle count from 407k to 278k.

## Not changed this loop
- HUD panels, buttons and callouts keep the navy-and-orange styling. There is no ambient-occlusion pass.
- Commercial blocks still have painted fronts on plain boxes.
- The crews are still built in code, not from the Blender LOD chain.

## Capture rig
- In the loop-0 and loop-1 captures, effects never ran in motion strips: the paused test clock gave the effects
  system zero elapsed time. Effects now advance with the capture clock. So the R14/R17 spray and steam missing from
  earlier strips was a capture fault; in real play they rendered.
