# Loop 1: changes (facts only)

## Rendering
- Default picture is now native resolution (device pixels, capped per tier: High and Medium 2×, Low 0.85×). The old
  240-line picture remains as a "Retro 240p" setting.
- Every world surface, landmark, prop and tub uses a new per-pixel plastic material: hemisphere ambient (sky above,
  ground below), sun diffuse, Blinn-Phong specular and a Fresnel sky reflection; colours snap to a toy-brick palette.
- Surface patterns drawn in the shader: studs on upward ground faces (0.4 m pitch), road plates and sidewalks as tiles
  with moulded seams, running-bond brick courses on walls and over the painted facades.
- Sun shadow map on Medium (1024) and High (2048) with filtered edges: buildings, walls, props, landmarks and tubs
  cast; everything receives. Low has no shadow map and a lighter shader (no sky reflection).

## Characters and tubs (first brick version, built in code)
- Figures: rounded-cube heads with printed faces (four expressions), box torsos with printed team uniforms (collar,
  suspenders, belt, badge), block arms with mitten hands, block legs and feet; all parts bevelled.
- The 12 hat styles rebuilt as bevelled parts; firefighter, police and jockey hats carry a stud.
- Tub: one moulded bowl with a studded rim, a studded chassis plate, claw feet or skirt, tyred wheels with hubs,
  see-through water, a two-piece duck. A simpler far version is used beyond 22–45 m (by tier).
- Steam Rangers recoloured (grey shirts, tan campaign hats).

## Animation and effects
- At judge stops the crew act out the task: they run around the tub for "Ring Around the Tub", do jumping jacks and
  push-ups for those tasks, and wave during the yodel.
- Power slides throw wheel spray while charging, then steam that grows and warms with each charge stage.
- Particle emitters now emit per 60 Hz tick of elapsed time.

## Lighting and sky
- Dusk and sunset courses: lamp globes glow and each lamp casts a warm pool on the ground.
- A soft feathered contact shadow sits under each tub and its crew (replacing the hard octagon).
- The painted ridge panorama fades out over its top band into the sky dome. On Low the sky is scaled inside the
  shorter far plane.

## Scenery
- Side terrain stops before it reaches another stretch of the same road (the R08 hairpin).

## UI
- Team select frames the turning tub on the right half of the screen.
- Phone landscape (short screens): title and menu side by side, compact team and results panels, controls in the
  bottom corners.
- Pixel numerals use an open zero; the title subtitle has an outline instead of an offset shadow; "1 lap" singular.
- The race HUD and touch controls are hidden under results and standings.
- The Steer pill is filled and outlined with arrows.

## Not changed this loop
- Trees and crowds are still painted sprites. Buildings and landmarks keep their geometry (only the material
  changed). HUD panel and callout styling is unchanged.

## Capture rig
- R02's captain close-up camera was re-aimed (it sat inside the tub wall). R05/R06 landmark frames hide the HUD.
- R14's setup was fixed: the old one pressed hop and steer on the same tick, so the tub never slid (in loop 0 too).
  It now steers first, then hops, so loop 1's R14 shows a real slide; its loop-0 pair shows the non-sliding moment.
