# Loop 3: changes (facts only)

## Characters and tubs
- The tubs and crews are now built in Blender rather than in code. They are made from the Gold Master figure and tub,
  exported as LODs, and assembled per team in the game from one shared geometry pack (`assets/crew.js`, 389 KB).
  - Each team has its own hats, for example fire helmets, gator heads, flamingo heads, antenna bands, top hats and
    campaign hats.
  - Each team also has its own printed uniforms front and back, and trim parts on the arms and legs.
  - Every figure has a printed face, from eight expressions.
  - The parts have real bevels and moulded studs, and baked ambient occlusion in their vertex colours.
  - Tubs have hubbed wheels, a studded chassis and either feet or a skirt by division, plus a duck and a flag.
- Medium and High draw LOD1 near the camera and LOD2 for far tubs, beyond 24 m on Medium and 40 m on High. Low
  draws LOD2 near and LOD3 beyond 22 m. Sun shadows use the far model. The crews built in code remain as a fallback when the pack can't load.
- The side attendants stand at ±0.86 m, turned in by 20°.
- A rival close to the chase camera, and closer to it than the player's tub, now fades smoothly with MSAA (alpha to
  coverage) on Medium and High, and with an ordered 4×4 dither on Low. Before, it used per-pixel random noise.
- The rim light is tinted by the part colour and capped. At dusk and sunset the crews get a fill light.
- The player's tub is marked by a ring in its team colour, outlined in black, on the road around it. The floating
  marker is smaller, sits just over the captain's hat, stays upright when the tub leans or slides, and is hidden
  during the countdown.
- Each pusher has a soft contact shadow on the road under its feet. All the tubs' pushers share one instanced draw.

## Scenery and materials
- Trees near the camera fade the same way as rivals: smoothly with MSAA, with an ordered dither on Low.
- Crowd-barrier rails ran across the sidewalk at right angles to their posts. They now run along the posts, at the
  curb.
- Pine trunks run up through every tier, so the tiers no longer float.
- On Medium and High, commercial blocks are built from parts instead of painted fronts on boxes.
  - Walls are running-bond brick in one of five brick colours.
  - The shop storey has wide windows with a centre mullion under striped slope awnings.
  - Each upper storey has a framed window per bay: dark glass behind a projecting sill, lintel and jambs.
  - Every wall has a cornice at the roof line, a string course at each storey and a quoin at each corner.

  Low keeps the painted fronts.
- Other procedural buildings (plain bathhouse blocks) get the same cornice, string courses and quoins in light
  trim bricks.
- The Arlington no longer has a painted facade under its modelled windows. Its walls are plain brick, so only its
  own window grid shows.
- Asphalt roads no longer show plate seams. Mountain tile roads and brick paving keep theirs.
- Pine greens no longer include a tan-olive shade.
- At dusk, the warm light pools under lamps are larger (6.5 m across, up from 4.2 m) and brighter, so they reach
  the near lane.
- Landmark walls darken over the bottom 1.3 m, where they meet the ground.
- Creek fords render as a shallow sheet of clear blue tiles across the road, with studded grey stepping stones along
  both banks. Before this loop, fords had no visual.
- Judge booths now face the road, so the judges stand in front of them. The flag that stood before each booth is
  gone; the one after it remains.

## Effects
- Particles are shaded as glossy plastic beads, with a highlight and a darker rim, instead of flat discs. Their size
  on screen is capped near the camera.
- Slide spray is water-coloured and trails behind the tub.
- The splash when a tub is hit or fumbles has fewer, smaller particles.

## UI
- Menu buttons are 1×4 bricks with four studs on top (two on the short buttons in a row). Grand Prix is a larger red
  brick. On landscape screens the title menu has Grand Prix across the top and the other modes in two columns.
- Panels are plates with a row of studs along the top. Cards, chips, the ticket counter, callouts and the
  judge-task sign are bevelled tiles.
- Team select: the Choose and Back buttons stay pinned to the bottom of the panel while the team list scrolls. On
  phones both are visible in portrait and landscape.

## Capture rig
- R09 is now a landmark view of Goat Rock with the HUD hidden. It used to be a race frame on the Goat Rock course
  that showed neither Goat Rock nor the ford. Its A/B pair compares different views.
- New R19 is a race frame at the first Gulpha Creek ford. It has no loop-2 pair.
