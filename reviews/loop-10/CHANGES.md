# Loop 10: changes (facts only)

## Characters and readability
- **Out-of-Towners tub:** now teal with a purple rim in the race. The tubs and crews take their colours from the
  packed Blender palette, which still carried the old purple. The crew builder now takes each team's tub and trim
  colours from the team data. A rim exported in the trim colour follows the trim.
- **Call-outs and the judge-task panel:** on desktop-sized windows they sit just under the top HUD row (124 px and
  122 px from the top), clear of the road's vanishing point. Before, they were at 30% and 22% of the height. On phone
  landscape the task panel sits at 100 px.

## Scenery and materials
- **Ground-floor panes:** on painted-facade landmarks these are now kept only where the facade art leaves the ground
  floor plain, as checked in close views: the Fordyce, Superior, Ozark and Buckstaff. Every other painted facade
  keeps no upright panes. Before, only the Quapaw dropped them, so panes floated over the Hale's painted arches at the
  judge stop.
- **Tree spacing:** trees of every kind thin against each other, at 0.62 × the sum of their canopy radii. Before,
  each kind thinned only against its own kind, so conifers grew through broadleaf crowns.
- **Window glass:** a soft sky glint replaces the hard diagonal stripe.
- **Far-ring crowns:** these stay darker against their hazed faces. The crown shading on a ring now fades by 30% of
  the ring's haze, down from 60%.

## Lighting
- **High-tier ambient occlusion:** now fades out at 90–150 m from the camera. Before, it faded at 42–70 m, so the
  landmark cameras saw none.

## Animation and feel
- **Particles:** steam, spray and splash are 82–95% opaque, up from 50–85%. They keep their own colour instead of
  taking the ground's; hot steam had read tan on red brick.
- **Hot steam:** near-white, (1, 0.96, 0.92) in the boost trail and (1, 0.95, 0.9) in the release burst.
- **Tub water:** sloshes harder. The spring is driven 2.5× harder by acceleration and turning. The sheet's tilt
  reaches up to ~19° (was ~16°), and the sim's own slosh tilt is exaggerated 1.8× (was 1.3×). A fumble shoves the
  water hard as the crew jumps off to circle.

## UI and mobile
- **Team-card labels:**
  - The selected card's division label is dark on its light fill.
  - Locked cards are dimmed to 75% (was 55%), and their "locked" label is brighter.
- **Portrait team select:** the camera steps back further and aims lower, so the whole preview tub, wheels and crew
  feet included, sits above the panel.
