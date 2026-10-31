# Loop 7: changes (facts only)

## Scenery
- The horizon rings are rebuilt as runs of overlapping rounded hills (14–20 per ring, plus the Hot Springs Mountain
  peak behind the Row) instead of long sinusoidal ridges. Valleys drop low enough for the farther ring to show
  through. Heights still step in whole 6 m plates and 2° columns.
- Each column is lit by where it faces: the sun side of a hill is brighter, and rings that face the sun are
  backlit.
- The shader covers every hill face in rows of stepped three-tier conifer crowns, each with a lit and a shaded half
  and its own size. They thin out toward the lit ridge lip, and the foot of each hill hazes out. Crowns are fainter
  on hazier rings.
- The silhouette carries a ragged tree line of one or two crowns of varying width and height per column, in place
  of evenly spaced crowns.
- Haze: far ring 60% (was 78%), middle 42% (was 55%), near 24% (was 30%).
- Trees step aside when their canopy is within about 8 m of the camera (was about 6 m). They also clear from a cone
  around the camera-to-tub sightline that widens about 12° each side (was a fixed-width corridor).

## Materials
- **Moulded edges (Medium and High):** every box-built part (tree canopy plates and trunks, building trim, cornices,
  quoins, props, rocks, rails, spectators, judge stands) rounds off over its last 3–10 cm. Its normal tilts outward,
  so edges catch the sun and sky like moulded plastic. This is done in the shader from per-face coordinates and adds
  no triangles. It fades out where the bevel would be under a pixel wide.
- **Brick relief:** each brick on brick walls tilts its normal at its edges (up at its top, down at its foot, along
  the wall at its ends), so the courses respond to the sun.
- **Clear water:** tub water and the creek ford are now see-through when viewed from above and mirror the sky at a
  glancing angle, with drifting ripple glints near the camera. The crew's legs show through the tub water.
- **Glass:** window panes mirror more sky at a glancing angle. On the commercial blocks each pane is shaded along its
  top and sides as if set back behind its frame.

## Lighting
- Sun shadows: the shadow depth range is tightened to 240 m (was 359 m) and the depth bias cut from about 43 cm to
  about 6 cm. Low parts such as a tub's chassis now cast shadows. This removes the stepped light band that showed
  inside the chassis shadow in close-ups.
- Dusk lamp pools are wider (8.5 m radius, was 6.5 m) and brighter at the centre, reaching across the near lane. The
  dusk ground fill is lighter (#4A4556, was #3E3A4A).
- High-tier ambient occlusion widens with distance (the radius grows about 4% per metre from the camera) and is a
  little stronger (0.85, was 0.75). Close-ups keep the tight radius.

## Animation and feel
- Pushers lean into acceleration (a push-off or a boost) and straighten as the tub slows. Before, lean followed speed
  only.
- The tub water sloshes: a damped spring driven by the tub's acceleration and turning tilts it on top of the
  sim's slosh tilt (up to about 16°) and keeps it rocking after a push, a stop or a turn. A small wave rides on it
  while it moves.
- Steam puffs swell as they rise (about 1.7× over a boost puff's life). Every particle shrinks away over its last
  quarter instead of vanishing.
- Slide charge: an arc outside the player's ring fills from the tail toward the nose on both sides as a power slide
  charges. It is water blue, warms to white at the warm tier and turns orange at the hot tier.
- Impacts (hits, fumbles, wall and fence hits, hard landings) also kick the camera's pitch by up to about 1.5°,
  ringing down with the existing shake.

## UI and mobile
- The item bubble and the ticket count sit together on one slate tile like the other readouts. The count carries a
  "TICKETS" label.
- HUD tiles keep at least an 8 px gutter. Phone portrait: the item tile sits below the place tile (it overlapped it
  by 10 px). Phone landscape: the water gauge sits below the lap tile (it overlapped by 4 px) and the minimap below
  the place tile (it overlapped by 6 px). Measured gaps are now 10 px in each case.
