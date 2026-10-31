# Loop 8: changes (facts only)

## Scenery
- **Judge stops:** each judge booth has a navy sign board standing on its roof across the booth, facing up and down
  the road. It spells JUDGE on both faces in white 1×1 plates (a 3×5 brick font). The booth gets a blue feather flag
  and two red bands round its white body. For each race, spectators within 6 m and trees within 5 m of a judge booth
  are removed, so the judges stand in clear view.
- **Horizon:**
  - Hills 30 m or taller step back in three terraces (28 m deep), with the summit furthest away. Each terrace has a
    lit top and a lit lip on the riser below it.
  - The conifer crowns on the hill faces vary their spacing from row to row (5.5–9 m), sit off-centre in their cells
    and thin into clearings along the ring.
  - Low uses 3° columns (was 2°).
- **Goat Rock:** the outcrop is now stacked long plates with studded tops instead of a masonry brick-course
  texture.
- **Landmarks with painted facades** keep only their sloped glass (roof lanterns, skylights). Their upright
  modelled panes are gone; these stood in front of the painted windows and were offset from them.

## Materials
- **Pitched roofs** (landmark and bathhouse roofs) are laid in brick-high tile rows with lit lips. Only near-flat
  roofs take studs.
- **Lawns:** baseplates keep a moulded groove every 16 studs (4.48 m), and each plate gets its own shade, so lawns
  keep their build at mid distance.
- **Creek ford:** more opaque and bluer. White edge lines run along both road edges across it.
- **Particles** (steam, spray, splashes) are translucent beads with a glassy rim (about 50% opaque at the centre,
  85% at the rim). Before, they were opaque.

## Lighting
- **Dusk and sunset crews:**
  - The fill is raised to 0.32 (was 0.22) and the sky rim to 0.6 (was 0.35).
  - Rival rings are brighter (90% opacity, was 60%) and wider at dusk.
- **Dusk lamp pools** are centred 3 m out from each lamp toward the road.
- **Park Avenue (dusk):** ambient raised to 0.64 (was 0.42) and key light to 0.55 (was 0.45).
- **Sun shadows:**
  - On world surfaces the depth bias grows on faces turned edge-on to the sun.
  - Crews use a looser bias, because they cast from their far model, whose blocks stand a few centimetres proud of
    the rounded near parts. This removes the hatching on the backs of heads, and the chassis still casts.
- **High-tier ambient occlusion** fades out within 2.5–5 m of the camera. This removes the banding on a tub's curved
  inner wall in close-ups.

## Animation and feel
- **Impacts** dip the camera by up to about 4°. The dip eases out with the shake, plus a smaller ring. Before, the
  kick was a ring of about 1.5°.
- **Slide steam** rises at about 1.6 m/s or more and trails back from the tub. Boost steam swells faster (2.6× per
  second).

## UI and mobile
- **HUD tiles** carry the menus' stud row along their top edge.
- **Phone landscape:** event banners sit below the item tile (they covered its lower edge).
- **Ticket count:** a count of one reads "1 TICKET".
- **Phone portrait team select** keeps a 16 px margin above the bottom edge (plus the safe area).

## Review harness
- **R15** (fumble): the strip starts one tick after the hit, so frame 1 is the impact (it started two ticks after).
