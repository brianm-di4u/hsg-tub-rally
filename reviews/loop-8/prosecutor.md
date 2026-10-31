# Prosecutor: loop 8, high tier

## Summary
The critics agree on the big picture: the close-up toys are strong and the world around them is weaker. I accept that. Where they were too generous is in giving full credit to anchor items the captures don't show:
- **Animation:** two of this loop's claimed animation changes don't appear in the strips. The impact dip should be about 4°; the R15 horizon moves at most 4 px. Slide steam should rise at 1.6 m/s or more; in R14 it never leaves the road.
- **Readability:** the player marker loses to a rival's ring in R11, and the arrow sits over rival crews in the phone frames.
- **Lighting:** the far hill tiers are measurably brighter than the sky, which breaks "haze matched to the sky".
- **Characters:** every team rides the same smooth tub shell, with no studs on it.

I opened every high-tier frame, close-up, strip and phone frame, and measured pixels where a charge depends on detail. All coordinates are in each image's own pixels.

**Critic mean 66.25. My proposal: 62.0.**

| Category | Critic A | Critic B | Mean | Proposed |
|---|---|---|---|---|
| characters | 7.0 | 7.0 | 7.0 | **6.5** |
| materials | 6.5 | 6.5 | 6.5 | **6.0** |
| scenery | 6.5 | 6.0 | 6.25 | **6.0** |
| lighting | 6.5 | 6.5 | 6.5 | **6.0** |
| animation | 6.0 | 6.5 | 6.25 | **5.5** |
| ui | 7.0 | 7.0 | 7.0 | **6.5** |
| typography | 6.5 | 6.5 | 6.5 | 6.5 (accepted) |
| readability | 6.5 | 7.0 | 6.75 | **6.0** |
| mobile | 7.0 | 6.5 | 6.75 | **6.5** |
| authenticity | 6.5 | 7.0 | 6.75 | **6.5** |

## Category by category

### Characters: 7.0 → 6.5
The 7 anchor asks for "studs on hats and tubs, tubs built from recognisable brick parts; all 12 teams distinct at chase distance". Both critics noted shortfalls here and still scored the full anchor.

- **One tub shell for every team.**
  - `crops/high/R02-preview` (red), `crops/high/R03-kart_1` (orange), `crops/high/R03-kart_5` (white) and `crops/high/R04-kart_3` (purple) all show the same smooth, seamless clawfoot shell.
  - Only the body colour, the rim colour and one rectangular stripe decal change.
  - The shell has no studs, no plate lines and no brick parts. The only studs on a tub are the small dark knobs on the chassis plate (`crops/high/R03-kart_1`, x≈480–560, y≈495–540).
- **Two teams share a purple tub.** The Velvet Mob (`high/desktop/R07`) and the tie-dye team (`crops/high/R04-kart_3`, `high/desktop/R12`) both ride purple tubs. In `high/desktop/R07` the two purple tubs are side by side at x≈600–760, y≈380–560, and their crews merge.
- **12 teams not shown.** Across every capture I can find about 10 teams. "All 12 teams distinct at chase distance" is not established by the evidence.
- **Low-poly prop.** A faceted beige polyhedron (probably the loofah) hangs beside the Gator Gang tub (`high/desktop/R17`, x≈725–760, y≈505–540; also `high/mobile/R17`). At chase distance it reads as an untextured rock.
- **Concession.** I don't adopt Critic A's "helmets carry no studs". `crops/high/R15-player` shows two studs on the crown of the left firefighter's helmet, and `crops/high/R02-preview-captain` shows the same pair on the right-hand helmets. The faces, prints and close-up quality are as good as the critics say.

### Materials: 6.5 → 6.0
The critics credited the actors (fairly) and then averaged in a world that sits closer to the 5 anchor ("surfaces read as painted card … textures from a different style than the models").

- **Hill ring is textured boxes.** In `high/desktop/R06` (x 0–330, y 240–520) the hill ring is flat, pale-green boxes printed with tree-triangle decals. A painted texture on a box is exactly the style clash the 5 anchor describes.
- **Facade sparkle.** The Fordyce front in `high/desktop/R05` is a painted brick texture with painted windows and ornament panels. It also shows about 60 isolated specular sparkle pixels along the brick bevels in x 400–1080, y 310–690. For example, (880, 366) has luminance 222 against about 105 in its 8 neighbours, and (986, 370) has 235 against about 133. In motion these will shimmer.
- **Boost steam reads as fruit.** In `high/desktop/R17` (x≈605–665, y≈535–570) and `high/mobile/R17`, the "HOT STEAM!" particles are a tight clump of orange spheres packed against the stern. They read as fruit or marbles, not vapour.
- **Already noted by the critics, and correct:** the ford is a flat, opaque blue tile plane (`high/desktop/R19`), and the crown slabs are smooth (`high/desktop/R10`, `high/desktop/R11`).

`worlds-1` (7) has no painted-card surfaces like these. 6.0 sits between "actors at 7" and "world at 5".

### Scenery: 6.25 → 6.0
- **Far tiers brighter than the sky.** The ghost tiers are not an R06-only quirk. They sit at the end of every Central Avenue frame: `high/desktop/R03`, `R04`, `R12`, `R13`, `R14`, `R15` and `R16`.
  - In `high/desktop/R04`, the box x 540–860, y 120–200 has 2,817 pixels more than 8 levels brighter than the sky.
  - The peak is (225, 252, 255) at (771, 193), against a sky mean of (182, 215, 236).
  - The far terrace faces render as a near-white wall with grey tree silhouettes floating above the real hills.
- **No foothills.** In `high/desktop/R06` the "mountain" rises as a vertical wall straight off the Arlington's lawn (x 0–330, y 240–520). There is no foothill and no ground transition.
- **Repeated conifers.** In `high/desktop/R09`, dozens of copies of one slab conifer surround Goat Rock.
- **Empty plaza.** In `high/desktop/R17` the plaza is a bare oval of radial tiles inside a low wall, with nothing in it.
- The critics' points on repeated awnings and cloned crowds stand.

Critic B's 6.0 is the better-evidenced score. The 7 anchor's "each course has its own set pieces" holds only for R05, R06, R09 and R19.

### Lighting: 6.5 → 6.0
The 7 anchor (`worlds-4`) requires "haze matched to the sky", and that is measurably not met.

- **Haze brighter than the sky.** The R04 measurement above shows the haze is brighter than the sky behind it, not converging on it. The same applies to `high/desktop/R06` and `high/desktop/R13`.
- **Halo in the close-ups.**
  - In `crops/high/R04-player`, the road just right of the crew's legs averages luminance 114.9 (box x 1000–1100, y 580–660).
  - The open road elsewhere in the frame averages 87–90 (boxes x 200–320, y 460–540 and x 1180–1270, y 700–790).
  - That makes a fuzzy, streaky halo about 28% brighter than the road. The same halo is in `crops/high/R03-kart_5` (x≈880–1010, y≈560–680).
  - It is present in both builds of `ab/crop-R04-player`, so it is a standing defect, not a regression.
- **Shapeless tree shadows.** In `high/desktop/R08` and `high/mobile/R08` (y≈1150–1420), the tree shadows on the road are shapeless soft blotches. They show none of the stepped slab edges the trees have.
- Critic A's points stand: there is no sun or rim light in R11, and there is little occlusion at wall bases in R05 and R13.

### Animation and feel: 6.25 → 5.5
The 7 anchor needs hits that read through camera kick, slides and boosts that read through particles, and visible water slosh. Only the crew circling clears it.

- **No impact kick.** In `strips/high/R15`, the sky edge at x=320 sits at rows 78, 78, 80, 79, 80, 82, 82 and 81 across the 8 frames, each 302 px tall. That is at most 4 px, and frame 1 (the impact frame) shows no reaction at all. This loop claims a 4° impact dip. 4° is about 1/15 of a normal 60° vertical field, so roughly 20 px should be visible. The change does not show.
- **Steam stays on the road.** The timer in `strips/high/R14` runs from 0:03.02 to 0:03.95, so the frames are 0.13 s apart. At the claimed rise of 1.6 m/s or more, a puff 0.4 s old should stand about 0.65 m up, roughly a figure's height. In every frame from 3 to 8, every steam bead sits on the asphalt below the ring's rear edge, and none reaches the tub rim. Again, the claimed change does not show.
- **Slide ends in a lamp post.** In frame 8 of `strips/high/R14`, the slide carries the tub onto the sidewalk. The player's ring encloses a lamp-post base, and the post stands flush against the right-hand crew member and draws over him. There is no collision response.
- **No slosh.** The water stays flat in all three strips.
- **Boost reads as an object.** The boost in `high/desktop/R17` is a static clump of orange spheres.
- **Credit:** `strips/high/R16`, where the crew circle the tub convincingly, and the bead burst in frames 3–5 of `strips/high/R15`.

This is "weak feedback" (the 5 anchor) on top of good articulation, so 5.5 rather than 6.0–6.5.

### UI / HUD: 7.0 → 6.5
The 7 anchor says "nothing overlapping".

- **Item orb.** The item orb covers studs 2–3 of its tile (`high/desktop/R04`; Critic A saw this and still scored 7).
- **Item tray.** On the tray, the four item icons sit inside the stud row, with studs showing between Towel, Bath, Soap and Loofah (`high/desktop/R04`, x 10–220, y 748–790).
- **Event banners over the road.** The banners sit centred over the vanishing point:
  - `high/desktop/R16`: x 470–810, y 178–300, for the whole event (all 8 frames of `strips/high/R16`).
  - `high/desktop/R19`: x 530–750, y 240–305.
  - `high/desktop/R17` and `high/landscape/R17`.
- **Small desktop tiles.** The desktop tiles are small for 1280×800.

The style is consistent and the results screen is clean (`high/desktop/R18`), so this is 6.5, not lower.

### Typography: 6.5 (accepted)
The critics' charges stand: the hyphen-broken "The Out- / of- / Towners" in `high/landscape/R02`, the wrapped "25 gal / CLEAN" in `high/mobile/R18`, and small HUD labels.

One correction for the judge: I measure the TICKETS label in `high/desktop/R04` at 8 bright rows (55–62), not Critic A's 5 px. The tray labels measure 10–11 rows. They are small, but the numerals read and nothing is clipped. I don't argue this category down.

### Readability: 6.75 → 6.0
The 7 anchor says "every tub … reads in every frame on both viewports … the player's tub stands out".

- **Player marker loses to a rival (`high/desktop/R11`).** Rings take the team colour.
  - The player's crew (navy overalls) gets a white ring and a white arrow.
  - The tie-dye rival beside it (x≈390–540, y≈420–570) carries the bright yellow ring that marks the player in other frames.
  - The white arrow (x≈600–640, y≈365–395) sits over the pink rival's tub directly ahead.
  - Critic A's "the player's tub stands out with its yellow ring" is false here, and in `high/desktop/R08`, where the player's ring is green.
- **Arrow over rival crews on phones.**
  - In `high/mobile/R08`, the arrow (≈390, 815) sits inside the tie-dye crew's silhouette, while the player's orange tub is at y≈890–1100.
  - In `high/mobile/R07`, the arrow sits between the pink and tie-dye crews.
- **Banners over the road ahead.** The event banners cover the road ahead (R16, R19 and `high/landscape/R17`; see UI).
- **Already noted by the critics:** the mid-distance pack blobs (`high/desktop/R04`, `high/desktop/R08`) and the ford reading as paving (`high/desktop/R19`).
- **Concession:** the dusk player ring in `high/desktop/R07` contrasts fine (ring (209, 187, 118) against road (81, 59, 55)).

Critic B's 7 rests on `high/mobile/R04` alone. The anchor asks for every frame.

### Mobile: 6.75 → 6.5
- **Team-select margin not delivered.** This loop claims the portrait team select keeps a 16 px margin above the bottom edge. In `high/mobile/R02`, the panel's dark outline runs to device row 1679 and the background starts at row 1680 of 1688. That is a 4 CSS px margin.
- **Cramped landscape team select.** In `high/landscape/R02` the cards run to four lines ("Flamingo / Flock / Stock · / locked", touching the card base).
- **Landscape view boxed in.** In landscape the view ahead is boxed:
  - The left HUD column takes x 20–335 of 1688 (20%).
  - The 8TH tile and minimap fill the top-right corner down to y≈360 of 780.
  - The HOT STEAM banner covers 390×130 device px over the road (`high/landscape/R17`, x 650–1040, y 210–340).
- **Credit:** the thumb controls never cover the tub in either orientation (`high/mobile/R03`, `high/landscape/R04`).

### Authenticity: 6.75 → 6.5
- **Mountains.** One of the four 7-anchor items is "the mountains read as the Ouachitas", and it fails. The same terraced wall of tree decals stands behind `high/desktop/R06` (rising vertically off the lawn), `R09`, `R12` and `R17`. The Ouachitas' long rounded ridgelines are never suggested.
- **Generic courses.** `high/desktop/R12`, `R13` and `R17` carry no identifying feature.
- **The Row screened by trees.** In race view down the Row (`high/desktop/R04`, x 190–600, y 200–440), the bathhouses are screened by a continuous row of identical plate trees.
- **Credit:**
  - The Arlington (`high/desktop/R06`) and the Fordyce (`high/desktop/R05`) are recognisable.
  - The tiled dome in `high/desktop/R14` (x≈380–430, y≈140–200) reads as the Quapaw.
  - The judge booth, duck and flag (`high/desktop/R16`) show the real race.

Critic B's 7 overlooks the mountain failure.

## IP check
**Clean.**
- **Heads:** rounded boxes, not cylinders (`crops/high/R02-preview-captain`, `crops/high/R15-player`).
- **Torsos:** straight-sided rectangles, not trapezoids.
- **Hands:** rounded fist blocks with a thumb bump, not C-shapes (`crops/high/R02-preview-captain`, x≈370–470, y≈240–330).
- **Hip piece:** it exists, but with box heads and fist hands the silhouette is not a minifigure.
- **No marks:** the stud tops are plain. The chest badge is a fire hydrant with no lettering (checked at 8×). No LEGO name or logo appears in any frame or menu.

## Gaps the critics missed
These are in addition to Critic A's G-impact-camera-kick and G-slide-steam-rise. The R15 and R14 measurements above strengthen both: the claimed fixes don't show in the strips.

1. **G-player-marker-salience** (readability, severity 3, effort S, WS6, +0.5)
   - **Defect:** team-coloured rings let a rival's ring outshine the player's (`high/desktop/R11`), and the arrow floats inside rival silhouettes (`high/mobile/R07`, `high/mobile/R08`).
   - **Fix:** a player-only ring style (thicker, dark outline, slow pulse, one fixed player colour) with thinner, desaturated rival rings. Raise the arrow and give it a short drop line to the player's tub.
   - **Test:** in R11 and mobile R08, the player's ring is the most saturated ring on screen, and the arrow overlaps no other crew.
2. **G-horizon-haze-over-sky** (lighting, severity 3, effort S, WS1, +0.3)
   - **Defect:** the far terrace faces render brighter than the sky (`high/desktop/R04`: 2,817 px more than 8 levels above the sky mean in x 540–860, y 120–200; peak (225, 252, 255)).
   - **Fix:** blend fog toward the sky's horizon colour and clamp it there, with no additive brightening on the farthest terrace.
   - **Test:** no pixel in that box exceeds the luminance of the sky in the same row.
3. **G-tub-shell-build** (characters, severity 3, effort M, WS2, +0.3)
   - **Defect:** every team uses the same smooth tub shell, varied only by colour, rim colour and one stripe decal, with no studs (`crops/high/R03-kart_1`, `crops/high/R03-kart_5`, `crops/high/R04-kart_3`). Two teams share purple (`high/desktop/R07`).
   - **Fix:** build the rim from studded curved plates, make the stripe a tile, add a team-specific stern or bow piece, and give no two teams the same body colour.
   - **Test:** studs visible on the tub in the R03 close-ups, and the R07 pack shows no two same-colour tubs.
4. **G-event-banner-placement** (ui, severity 2, effort S, WS6, +0.3)
   - **Defect:** event banners sit over the vanishing point for the whole event (`high/desktop/R16`, x 470–810, y 178–300; `high/desktop/R19`; `high/landscape/R17`).
   - **Fix:** dock banners under the item tile, at most 60 px tall on desktop, and collapse them to a slim ribbon after 1 s.
   - **Test:** the banner in R16, R17 and R19 doesn't overlap the road between the horizon and the player's tub.
5. **G-closeup-road-halo** (lighting, severity 2, effort M, WS1, +0.2)
   - **Defect:** a fuzzy bright halo beside the crew's legs (`crops/high/R04-player`: 114.9 against 87–90 on the open road; `crops/high/R03-kart_5`). It is present in both A/B builds.
   - **Fix:** check the AO fade and shadow penumbra filtering near the camera.
   - **Test:** road luminance outside cast shadows within 10% across the close-up.
6. **G-slide-prop-clip** (animation, severity 2, effort M, WS3, +0.2)
   - **Defect:** in frame 8 of `strips/high/R14`, the player's ring encloses a lamp-post base and the post stands flush against a crew member.
   - **Fix:** give crews and tubs collision with street furniture, with a bump reaction.
   - **Test:** no static prop inside the player's ring in any R14 frame.
7. **G-boost-steam-read** (animation, severity 2, effort S, WS3, +0.2)
   - **Defect:** "HOT STEAM!" renders as a tight clump of orange spheres at the stern (`high/desktop/R17`, `high/mobile/R17`). It reads as fruit, not vapour.
   - **Fix:** white beads with only a warm tint, spread into a trailing plume that grows and fades.
   - **Test:** in R17 the boost particles cover at least 3× the stern's width and fade to the background colour at the tail.
8. **G-mountain-ridgelines** (authenticity, severity 3, effort L, WS4, +0.3)
   - **Defect:** the same terraced wall on every course, rising vertically off the lawn behind the Arlington (`high/desktop/R06`, x 0–330, y 240–520).
   - **Fix:** long rounded ridgelines with foothill steps down to the playable ground, varied per course.
   - **Test:** R06 shows a sloped transition from lawn to hill, and unlabelled R06, R09, R12 and R17 horizons differ.
9. **G-portrait-select-margin** (mobile, severity 1, effort S, WS6, +0.1)
   - **Defect:** the claimed 16 px margin is 4 CSS px (`high/mobile/R02`: outline to device row 1679 of 1688).
   - **Fix:** apply the margin to the outer frame, including its shadow plate.
   - **Test:** at least 32 device px between the outline and the bottom edge.
10. **G-hud-tray-stud-row** (ui, severity 1, effort S, WS6, +0.1)
    - **Defect:** the tray icons sit inside the stud row (`high/desktop/R04`, x 10–220, y 748–790).
    - **Fix:** add 6 px of top padding to the tray, or drop the stud row on short tiles.
    - **Test:** no stud visible between the icons.
11. **G-facade-specular-sparkle** (materials, severity 1, effort S, WS1, +0.1)
    - **Defect:** about 60 single-pixel specular sparkles on the Fordyce front (`high/desktop/R05`, for example (880, 366) at 222 against about 105 around it).
    - **Fix:** specular anti-aliasing (roughness widening by normal variance), or clamp the bevel specular at distance.
    - **Test:** fewer than 10 isolated pixels more than 45 levels above their neighbours in that region.

```json
{
  "loop": 8,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "characters": { "score": 6.5, "confidence": 0.55, "evidence": [
      { "shot": "crops/high/R03-kart_1", "note": "same smooth seamless tub shell as every team; studs only on the dark chassis plate (x~480-560, y~495-540), none on the tub" },
      { "shot": "crops/high/R03-kart_5", "note": "identical shell recoloured white; only rim colour and one stripe decal differ" },
      { "shot": "crops/high/R04-kart_3", "note": "tie-dye team on a purple tub, same body colour as the Velvet Mob" },
      { "shot": "high/desktop/R07", "note": "two purple tubs side by side (x~600-760, y~380-560), crews merge" },
      { "shot": "high/desktop/R17", "note": "faceted beige polyhedron beside the tub (x~725-760, y~505-540) reads as an untextured rock" },
      { "shot": "crops/high/R15-player", "note": "concession: helmet crowns carry two studs; faces and prints hold up" }
    ] },
    "materials": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R06", "note": "hill ring is flat pale-green boxes printed with tree-triangle decals (x 0-330, y 240-520): texture-on-box style clash" },
      { "shot": "high/desktop/R05", "note": "painted windows and ornament; ~60 isolated specular sparkle pixels, e.g. (880,366) 222 vs ~105 neighbours" },
      { "shot": "high/desktop/R17", "note": "HOT STEAM is a tight clump of orange spheres at the stern (x~605-665, y~535-570), reads as fruit" },
      { "shot": "high/desktop/R19", "note": "ford is a flat opaque blue tile plane" },
      { "shot": "crops/high/R02-preview-captain", "note": "actors' ABS and clear water are convincing (credited)" }
    ] },
    "scenery": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R04", "note": "far tiers brighter than sky: 2817 px >8 levels above sky mean in x540-860,y120-200; peak (225,252,255) at (771,193)" },
      { "shot": "high/desktop/R06", "note": "hill rises as a vertical wall straight off the Arlington lawn, no foothill" },
      { "shot": "high/desktop/R09", "note": "dozens of copies of one slab conifer" },
      { "shot": "high/desktop/R17", "note": "plaza is an empty radial-tile oval inside a low wall" },
      { "shot": "high/desktop/R14", "note": "same ghost tiers at the end of Central Avenue; repeated awnings" }
    ] },
    "lighting": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R04", "note": "haze exceeds the sky (peak 225,252,255 vs sky 182,215,236): fails 'haze matched to the sky'" },
      { "shot": "crops/high/R04-player", "note": "halo by crew legs: road 114.9 (x1000-1100,y580-660) vs 87-90 on open road; in both A/B builds" },
      { "shot": "crops/high/R03-kart_5", "note": "same bright streaky halo at x~880-1010, y~560-680" },
      { "shot": "high/mobile/R08", "note": "tree shadows on the road are shapeless blotches, no slab edges" },
      { "shot": "high/desktop/R11", "note": "sunset without sun, glow or rim (per Critic A)" }
    ] },
    "animation": { "score": 5.5, "confidence": 0.6, "evidence": [
      { "shot": "strips/high/R15", "note": "sky edge at x=320: rows 78,78,80,79,80,82,82,81 (<=4 px of 302); claimed 4 deg dip (~20 px) not visible; no reaction in impact frame 1" },
      { "shot": "strips/high/R14", "note": "frames 0.13 s apart; at claimed >=1.6 m/s rise puffs should stand ~0.65 m up, but every bead in frames 3-8 lies on the road below the ring's rear edge" },
      { "shot": "strips/high/R14", "note": "frame 8: ring encloses a lamp-post base, post flush against the right crew member; no collision response" },
      { "shot": "strips/high/R16", "note": "credit: crew circle the tub convincingly" },
      { "shot": "high/desktop/R17", "note": "boost is a static clump of orange spheres; no slosh in any strip" }
    ] },
    "ui": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R04", "note": "item orb covers studs 2-3; tray icons sit inside the stud row with studs between them (x10-220, y748-790)" },
      { "shot": "high/desktop/R16", "note": "event banner over the vanishing point (x470-810, y178-300) for the whole event" },
      { "shot": "strips/high/R16", "note": "banner persists in all 8 frames" },
      { "shot": "high/desktop/R19", "note": "WARM STEAM banner over the road ahead (x530-750, y240-305)" },
      { "shot": "high/desktop/R18", "note": "credit: consistent, clean results screen" }
    ] },
    "typography": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R04", "note": "TICKETS is 8 bright rows (55-62), not 5; tray labels 10-11 rows: small but legible" },
      { "shot": "high/landscape/R02", "note": "'The Out- / of- / Towners' hyphen-broken over 3 lines" },
      { "shot": "high/mobile/R18", "note": "'25 gal / CLEAN' wraps in every row" }
    ] },
    "readability": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R11", "note": "player ring white while the adjacent tie-dye rival carries the yellow ring; white arrow sits over the pink rival's tub" },
      { "shot": "high/mobile/R08", "note": "arrow (~390,815) inside the tie-dye crew silhouette; player's tub at y~890-1100" },
      { "shot": "high/mobile/R07", "note": "arrow between pink and tie-dye crews; pack merges" },
      { "shot": "high/desktop/R16", "note": "event banner covers the road ahead" },
      { "shot": "high/desktop/R19", "note": "ford reads as paving" },
      { "shot": "high/desktop/R07", "note": "concession: dusk ring contrast is fine (209,187,118 vs road 81,59,55)" }
    ] },
    "mobile": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/mobile/R02", "note": "claimed 16 px margin measures 4 CSS px (outline to device row 1679 of 1688)" },
      { "shot": "high/landscape/R02", "note": "cards wrap to 4 lines touching the card base" },
      { "shot": "high/landscape/R17", "note": "banner 390x130 device px over the road (x650-1040, y210-340); left HUD column 20% of width" },
      { "shot": "high/mobile/R03", "note": "credit: thumb controls clear of the tub" },
      { "shot": "high/landscape/R04", "note": "credit: tub centred, controls clear" }
    ] },
    "authenticity": { "score": 6.5, "confidence": 0.55, "evidence": [
      { "shot": "high/desktop/R06", "note": "Arlington recognisable, but the mountain is a vertical wall of tree decals, not Ouachita ridgelines" },
      { "shot": "high/desktop/R12", "note": "same terraced ring; nothing identifies Whittington Valley" },
      { "shot": "high/desktop/R13", "note": "Bridge Street generic" },
      { "shot": "high/desktop/R04", "note": "the Row's bathhouses screened by a continuous row of identical plate trees (x190-600, y200-440)" },
      { "shot": "high/desktop/R14", "note": "credit: tiled dome reads as the Quapaw (x~380-430, y~140-200)" },
      { "shot": "high/desktop/R16", "note": "credit: judge booth, duck and flag show the real race" }
    ] }
  },
  "ip": { "clean": true, "notes": "Box heads, straight rectangular torsos, fist-block hands with thumb bump (crops/high/R02-preview-captain, crops/high/R15-player). Plain stud tops; chest badge is a hydrant with no lettering; no LEGO name or logo in any frame or menu." },
  "gaps": [
    { "id": "G-player-marker-salience", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R11", "high/mobile/R08", "high/mobile/R07"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Player-only ring style (thicker, dark outline, slow pulse, one fixed player colour) with thinner desaturated rival rings; raise the arrow and add a drop line to the player's tub. Test: in R11 and mobile R08 the player's ring is the most saturated ring on screen and the arrow overlaps no other crew." },
    { "id": "G-horizon-haze-over-sky", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R04", "high/desktop/R06", "high/desktop/R13"], "benchmark": "worlds/worlds-4.jpg", "fix": "Blend fog toward the sky's horizon colour and clamp to it, with no additive brightening on the farthest terrace. Test: in R04 x540-860, y120-200 no pixel exceeds the luminance of the sky in the same row (now 2817 px exceed it by >8 levels)." },
    { "id": "G-tub-shell-build", "category": "characters", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R03-kart_1", "crops/high/R03-kart_5", "crops/high/R04-kart_3", "high/desktop/R07"], "benchmark": "2k-drive/drive-4.jpg", "fix": "Build the tub rim from studded curved plates, make the stripe a tile, add a team-specific stern or bow piece, and give no two teams the same body colour. Test: studs visible on the tub in the R03 close-ups; no two same-colour tubs in the R07 pack." },
    { "id": "G-event-banner-placement", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R16", "strips/high/R16", "high/desktop/R19", "high/landscape/R17"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Dock event banners under the item tile, at most 60 px tall on desktop, and collapse to a slim ribbon after 1 s. Test: in R16, R17 and R19 the banner doesn't overlap the road between the horizon and the player's tub." },
    { "id": "G-closeup-road-halo", "category": "lighting", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["crops/high/R04-player", "crops/high/R03-kart_5"], "fix": "Check the AO fade and shadow penumbra filtering near the camera; the road beside the crew's legs is ~28% brighter than the open road (114.9 vs 87-90). Test: road luminance outside cast shadows within 10% across the R04-player close-up." },
    { "id": "G-slide-prop-clip", "category": "animation", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14"], "fix": "Give crews and tubs collision with street furniture (lamp posts, fences), with a bump reaction. Test: no static prop inside the player's ring in any R14 frame (frame 8 now encloses a lamp-post base)." },
    { "id": "G-boost-steam-read", "category": "animation", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["high/desktop/R17", "high/mobile/R17"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Render hot steam as white beads with only a warm tint, spread into a trailing plume that grows and fades instead of a clump of orange spheres at the stern. Test: in R17 the boost particles cover at least 3x the stern width and fade to the background at the tail." },
    { "id": "G-mountain-ridgelines", "category": "authenticity", "expectedGain": 0.3, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R06", "high/desktop/R09", "high/desktop/R12", "high/desktop/R17"], "fix": "Replace the vertical terraced wall with long rounded Ouachita ridgelines and foothill steps down to the playable ground, varied per course. Test: R06 shows a sloped transition from lawn to hill, and unlabelled R06, R09, R12 and R17 horizons differ." },
    { "id": "G-portrait-select-margin", "category": "mobile", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R02"], "fix": "Apply the claimed 16 px bottom margin to the outer frame including its shadow plate (now 4 CSS px: outline to device row 1679 of 1688). Test: at least 32 device px between the outline and the bottom edge." },
    { "id": "G-hud-tray-stud-row", "category": "ui", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04"], "fix": "Add 6 px of top padding to the item tray (or drop the stud row on short tiles) so the icons don't sit inside the stud row. Test: no stud visible between Towel, Bath, Soap and Loofah." },
    { "id": "G-facade-specular-sparkle", "category": "materials", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R05"], "benchmark": "builders-journey/bj-3.jpg", "fix": "Add specular anti-aliasing (roughness widening by normal variance) or clamp the bevel specular at distance. Test: fewer than 10 isolated pixels more than 45 levels above their neighbours on the R05 Fordyce front (now ~60)." }
  ]
}
```
