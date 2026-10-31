# Prosecutor: loop 4, High tier

Capture paths are relative to `screenshots/review-loop-4/`. I opened every High desktop frame, every High close-up, all three High strips, the phone frames and several A/B pairs. Where a charge depends on detail I zoomed in or measured pixels with PIL. Luminance is Rec. 709 on 0–255.

## Summary
The critics agree on the figures, which are the best thing in the game, and both found the flat ridge walls and the clipped landscape team select. Codex was generous in four places: characters, readability and authenticity at 7, and materials at 6.5. Each of those 7s ticks the headline clause of the anchor and skips clauses that the captures show failing:
- Tubs are not built from brick parts, and neither hats nor tub bodies carry studs.
- The Arlington never closes the street vista in a race frame.
- Near canopies still cover an eighth to a sixth of four race frames.
- No clear part reads as transparent.

Claude's numbers are closer, but they also leave out evidence. A quarter of each day frame has no surface texture at all. The camera does not move by more than 2 px during a fumble. The steam charge is shown only as a text banner. Pine canopies in R09 cut through each other. My proposals total 59.5. The critics average 64.5.

## Category by category (critic mean, then my proposal)

**Characters: Claude 6.5, Codex 7, mean 6.75. Proposed 6.0.** The figures do read as original plastic toys, with printed faces and printed uniforms (`crops/high/R03-player`, `crops/high/R04-kart_3`, and four different back prints in `high/desktop/R04`, `R08`, `R10`, `R13`). The 7 anchor asks for more than that, and three of its clauses fail:
- *Studs on hats and tubs.* Fire helmets have a comb and a badge, the antenna caps have balls, and cowboy and ranger hats are plain (`crops/high/R03-player-rear`, `crops/high/R04-kart_3`, `high/desktop/R10`, `high/desktop/R19`). Every tub body is a smooth shell with a painted stripe (red in `crops/high/R03-player`, purple in `crops/high/R04-kart_3`, orange in `crops/high/R03-kart_1`). Only the chassis plate has studs.
- *Tubs built from recognisable brick parts.* No seam, plate or tile breaks up any tub shell. Codex concedes "largely continuous shells" and still scores 7.
- *Close-ups hold up.* In `crops/high/R02-preview-captain` the water is a pale-blue triangular shard next to the duck, and the rest of the interior is empty grey. High close-ups carry 10 px banding that Low does not. On `crops/high/R03-kart_5` the 10 px spectral peak is 6.7× the median, against 2.8× on `crops/low/R03-kart_5`. The column-mean amplitude at that period is 0.88 levels against 0.14. On the captain crop's tub interior the residual reaches 9.85 levels at a 10 px period. To be fair, the banding is not measurable at play size (the `high/desktop/R04` road gives 0.01). It is a close-up defect, which is exactly what this clause tests.
- *All 12 teams distinct at chase distance* is unproven. Codex says so himself. Three teams wear green uniforms and differ mainly by hat: Trail Shredders (`high/desktop/R08`), the green team in `high/desktop/R17` and the sage ranger crew in `high/desktop/R19`. That is the anchor-5 wording ("team identity from colour and hat").
- In `high/desktop/R17` and `R19` the captain's held soap sits at head height and merges into the hat silhouette.

A 7 with three anchor clauses failing is too high. Against `drive-4` (9.5) there are no seams or mould lines.

**Materials: Claude 6.0, Codex 6.5, mean 6.25. Proposed 5.5.** The plastic read stops at the figures, tubs, awnings and studded verges (`high/desktop/R10`, left verge). The world around them reads as lit card:
- *Texture-free area.* I counted non-sky pixels whose 9×9 neighbourhood varies by less than 0.75 grey levels. They make up 26.7 % of `high/desktop/R05`, 23.9 % of `R06`, 24.3 % of `R12` and 23.5 % of `R04`. One unlit RGB value, (63,94,69), alone covers 17.7 % of `R05`.
- *Clear parts.* The anchor names clear parts that read as transparent plastic, and none do:
  - Every window is the same opaque flat navy with no frame recess or glazing highlight. In `high/desktop/R06`, (640,400) is (26,40,52), (880,300) is (29,42,54) and (600,700) is (24,37,46).
  - The tub water is a flat shard (`crops/high/R02-preview-captain`).
  - The creek ford reads as grey stone (`high/desktop/R19`).
- *Asphalt.* The new "fine grain" shows near the camera as soft square cells with no seams. Along row y=740 of `high/desktop/R04` (x 820–1120) the cells are 145, 83 and 72 px wide, with single 6–8-level steps (luminance 90→98). It reads as a blurred voxel checker, neither asphalt grain nor brick tile. Compare the properly seamed tile trail in `R10`.
- *Roofs and canopies.* The Arlington's lower roof is a flat grey slab with no tiles or studs (`high/desktop/R06`, around (500,590), (72,82,81)). Tree plates are matte with no edge highlight (`high/desktop/R12`).

Most of what fills the frame matches the 5 anchor ("surfaces read as painted card"), and the 7-quality figures lift it half a point. That is below `worlds-1` (7).

**Scenery: Claude 6.5, Codex 6.0, mean 6.25. Proposed 6.0.** I accept the critics' points: ridge walls, interchangeable forest roads (R08, R10, R11) and repeated shopfront modules. I add three:
- In `high/desktop/R09` the big pine at right has canopy plates tilted at mixed angles that pierce one another, and a grey rail runs straight through the canopy (crop x 780–1280, y 280–700).
- In `high/desktop/R17` the plaza has no centrepiece in frame. The fountain this loop added is not visible, and a near-white stepped ridge fills the space behind the lone brick block at left.
- The same two-storey brick module with striped awnings stands on Central Avenue (`R03`, `R04`), Park Avenue (`R07`), Bridge Street (`R13`) and the plaza (`R17`).

Claude's 6.5 rests on props (shrubs, a maple) that do not offset these. Against `worlds-1` (7.5), the world is not yet "brick-built" beyond the street edge.

**Lighting: Claude 6.0, Codex 6.5, mean 6.25. Proposed 6.0.** Contact shadows and AO under the feet are real (`high/desktop/R17` at 4×: the soft occlusion under the boots and tub). The 7 anchor also asks for haze matched to the sky and a deliberate palette for day, dusk and sunset:
- *Haze.* The near ridge in `high/desktop/R05` is (63,94,69) against a sky of (165,205,235). That is luminance 86 against 199 with a hard edge and no haze ramp.
- *Sunset.* `high/desktop/R11` differs from day only by tint. Sky luminance is 139 at the zenith and 146 at the horizon, a ratio of 1.05, with no sun and no glow. That matches the anchor-5 wording.
- *Dusk.* The lamp globes in `high/desktop/R07` are flat cream discs with no halo or bloom (zoom x 480–1000, y 180–320).
- *Hero landmark.* In `high/desktop/R06` the Arlington's facade planes face different directions yet sit within 7 levels of each other: main block 81, right wing 82, tower fronts 80 and 87. Meanwhile the lawn in front is mean (90,149,97). The game's largest landmark gets no key-light modelling in its own hero shot.

Codex's 6.5 is generous. Below `worlds-4`.

**Animation: Claude 6.0, Codex 6.5, mean 6.25. Proposed 5.5.** `strips/high/R15` and `strips/high/R16` show the crew circling the tub with correct rigid-limb articulation. That is the first clause of the 7 anchor, and it holds. The other two clauses fail:
- *Camera kick.* There is none. In `strips/high/R15`, a fumble (a hit), the ridge-top row at three fixed columns moves at most 2 px across all eight frames (52/73/75 → 50/71/74 → 52/73/76).
- *Steam charge.* The charge is communicated by text, not effects. "WARM STEAM" in `high/desktop/R19` and "HOT STEAM!" in `high/desktop/R17` are banners, with a few blue beads behind the tub. `strips/high/R14`, the capture named for the hot-steam charge, shows neither a banner nor steam: yaw and beads only.
- *Water slosh.* None visible. The tub interior is hidden behind the crew in every R14 frame. The "2.5× tilt" from this loop's changes does not reach the screen.
- *Hit reaction.* In frames 7–8 of `strips/high/R14` a lamp post stands inside the tub's ring with no reaction.

The 5 anchor reads "run cycles and wheel spin, weak feedback", and the feedback here is weak. The circling ritual earns the extra half point. `drive-3` effects sit at 8.5.

**UI / HUD: Claude 6.5, Codex 6.5, mean 6.5. Proposed 6.0.** The critics found the clipped "10" tile and the landscape grid. Three things they did not count:
- *HUD style.* The in-race HUD has no brick language. The gauge and coin counter are flat dark rounded rectangles and the item slot is a plain glass sphere (`high/desktop/R04`, `high/desktop/R13`). The menus, in contrast, use studded brick buttons (`high/desktop/R01`, `high/desktop/R02`). The 7 anchor asks for "one style that belongs to the brick world".
- *Title focus ring.* On `high/desktop/R01` the white focus ring of the Grand Prix button runs through the bases of its four studs (2.5× crop x 380–900, y 260–400). That is one more overlap on the title screen.
- *Landscape preview.* `high/landscape/R02` cuts the preview tub at the panel edge. Meanwhile about 150 device px of the right column stays empty between the Water bar and the buttons, while the grid's fourth row is clipped.

"Nothing overlapping" fails in three places across three viewports. That is closer to the 5 anchor's "inconsistent" than the critics allow.

**Typography: Claude 6.5, Codex 6.5, mean 6.5. Accept 6.5.** Both critics already counted the clipped "10" glyph (`high/desktop/R04`, `high/mobile/R17`) and the clipped landscape team names (`high/landscape/R02`). My only addition is minor: in `high/desktop/R13` the white "LAP 1/3" and timer glyphs sit over a pale lamp globe with no backing panel, readable only through a 1–2 px outline. That is not enough to move the score.

**Readability: Claude 6.5, Codex 7, mean 6.75. Proposed 6.0.** The 7 anchor says "every tub, item, pickup and judge stop reads in every frame". Four counts against it:
- *Near trees.* I measured near canopy and trunk cover at 17.5 % of `high/desktop/R11`, 16.3 % of `R19` and 13.2 % of `R08`. The critics did not count `high/desktop/R16`, the judge stop: a near tree covers 11.5 % of that frame, excluding ridge pixels, right beside the stop. This loop's tree-hiding change does not reach these trees.
- *Near lamp posts.* They are never hidden. In `high/desktop/R13` a post and its globes fill the top-left corner and run down to about y=600.
- *Pack merging.* In `high/mobile/R07` the Out-of-Towners tub directly ahead overlaps the player's captain, and the rival tubs in the pack are visible only as crews. `high/desktop/R07` and `R12` look the same.
- *Judge stop.* The stop line reads, but the judge does not (`high/desktop/R16`).

The player's ring and marker are excellent everywhere, which is why this is 6, not 5. Codex's 7 needs "every … in every frame", and the captures do not show that.

**Mobile: Claude 6.5, Codex 6.0, mean 6.25. Proposed 6.0.** The thumb controls never cover the tub in any portrait or landscape race frame (`high/mobile/R03`, `R04`, `R07`, `R08`, `R17`; `high/landscape/R04`, `R07`, `R08`, `R17`), and portrait team select is fixed (`high/mobile/R02`). Two things hold it at 6.0:
- *Landscape team select.* It is still broken in a core flow. Three of twelve cards are cut, and the preview tub sits half behind the panel (`high/landscape/R02`).
- *Unproven frame rate.* The 30 fps claim is unproven for the scored tier on a phone. The 4×-CPU proxy runs cover Low and Medium only.

I side with Codex.

**Authenticity: Claude 6.5, Codex 7, mean 6.75. Proposed 6.0.** The 7 anchor names "the Arlington closes the vista". It doesn't, in any race frame:
- *Vista.* Down Central Avenue the street ends in generic two-storey shopfronts and the green ridge (`high/desktop/R04` vista crop x 560–860, y 240–360; `high/desktop/R03`; `strips/high/R14`). The Arlington appears only in its staged aerial shot (`high/desktop/R06`).
- *Generic courses.* Goat Rock (`high/desktop/R09`) is white brick boulders in a closed pine stand with no overlook view, which is the feature locals know. Bridge Street (`high/desktop/R13`) is a wide curve past a generic three-storey block. Hill Wheatley Plaza (`high/desktop/R17`) shows no fountain. Gulpha Creek (`high/desktop/R19`) reads as a stone pad.
- *Judges.* They are anonymous (`high/desktop/R16`).

The Row itself is good: the Fordyce in `R05`, Hot Springs Mountain behind the Row in `R01` and `R04`, and the observation tower in `R11`. So this is 6, not 5. Codex's 7 skips the vista clause.

## IP check
**Clean.**
- *Heads.* Rounded cuboids with printed faces. No cylinder, no top stud (`crops/high/R03-player`, `crops/high/R02-preview-captain`).
- *Torsos.* Rectangular: shoulder width matches waist width in `crops/high/R03-player` (figure at x 780–1060).
- *Hands.* Rounded fists, not C-clips (`crops/high/R03-player-rear`).
- *Marks.* No LEGO name or logo appears in any frame, menu or results screen.

The fire helmet's front shield and back brim recall a generic toy firefighter helmet, but the rule lists silhouettes, not hats, so I do not flag it.

## Gaps the critics missed
1. **G-tub-brick-parts** (characters, WS2, severity 3, M, +0.5). Tub shells are smooth, and no hat or tub body carries a stud.
   - *Fix:* build each tub from visible parts: a studded rim plate ring, a separate raised tile for the team stripe with a seam, and exposed studs on the tail plate. Put 1–4 studs on top of every hat.
   - *Test:* `crops/high/R03-player` and `crops/high/R04-kart_3` show at least 3 part seams on the tub body, and every hat in `high/desktop/R03` shows studs.
2. **G-clear-parts-opaque** (materials, WS1, severity 3, M, +0.5). Windows are flat opaque navy. Water and creek don't read as clear.
   - *Fix:* a glass material with Fresnel reflection of the sky and a one-plate frame recess for windows; a water material with refraction tint and a highlight for the tub and the ford.
   - *Test:* window pixels in `high/desktop/R06` show at least a 20-level vertical gradient or a highlight (now a constant (26,40,52)).
3. **G-arlington-vista** (authenticity, WS4, severity 3, M, +0.5). The Arlington closes no street vista in race frames.
   - *Fix:* place the Arlington (a far LOD is enough) where Central Avenue bends at the north end of the Row, so its twin towers sit above the vanishing point from the grid. If the grid faces south, add a capture of the north-bound straight.
   - *Test:* both towers are visible above the road's vanishing point in R03/R04 or an equivalent race frame.
4. **G-hero-facade-modelling** (lighting, WS1, severity 3, S, +0.5). The Arlington's facade planes sit within 7 levels of each other in R06.
   - *Fix:* rotate the course's sun azimuth, or add a sky or fill light, so differently facing walls separate.
   - *Test:* in `high/desktop/R06`, adjacent facade planes differ by at least 15 luminance levels, and one plane reaches 120 or more.
5. **G-asphalt-cells** (materials, WS1, severity 2, S, +0.3). Near-camera asphalt shows 72–145 px flat cells.
   - *Fix:* shrink the fleck to 0.05 m or less with mip-aware fade, or make Central Avenue a tile road with seams like the R10 trail.
   - *Test:* along row y=740 of `high/desktop/R04` no flat run is wider than 20 px.
6. **G-near-props-unhidden** (readability, WS5, severity 2, S, +0.3). A near tree covers 11.5 % of the R16 judge-stop frame, and near lamp posts are never hidden (R13).
   - *Fix:* extend the near-hide rule to lamp posts and street furniture, and widen the tree rule to canopies within 6 m whose screen bounds overlap the top-left or top-right third.
   - *Test:* no single prop covers more than 5 % of `high/desktop/R16` or `R13`.
7. **G-canopy-intersections** (scenery, WS5, severity 2, S, +0.3). In R09, pine canopy plates tilt at mixed angles and pierce each other, and a rail passes through a canopy.
   - *Fix:* keep plate tilt at 0°, enforce a minimum trunk spacing of at least the sum of canopy radii, and cull trees whose canopy intersects rails or rocks.
   - *Test:* no canopy–canopy or rail–canopy intersection in `high/desktop/R09`.
8. **G-hud-brick-style** (ui, WS6, severity 2, M, +0.3). The in-race HUD panels have no brick language, and the title focus ring cuts through the stud bases.
   - *Fix:* give the gauge, coin and item panels the menus' stud rim and tile bevel, and draw the focus ring outside the stud tops.
   - *Test:* the gauge panel in `high/desktop/R04` shows a stud row, and in `high/desktop/R01` the ring clears all four studs.
9. **G-green-teams** (characters, WS2, severity 2, S, +0.3). Three teams wear green uniforms and differ mainly by hat (R08, R17, R19).
   - *Fix:* move one of them to a different hue family, or give each a high-contrast secondary colour on the torso.
   - *Test:* the torso hues of any two teams differ by at least 40° in a pack frame.

```json
{
  "loop": 4,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "characters": {
      "score": 6.0,
      "confidence": 0.55,
      "evidence": [
        {"shot": "crops/high/R04-kart_3", "note": "Strong printed faces and uniform, but the purple tub is a smooth shell with a painted stripe; antenna caps carry no studs; only the chassis plate is studded"},
        {"shot": "crops/high/R03-player-rear", "note": "Fire helmets: comb and badge, no studs; good back prints"},
        {"shot": "crops/high/R02-preview-captain", "note": "Water is a pale-blue triangular shard beside the duck, interior empty grey; 10 px banding, residual 9.85 levels on the tub interior"},
        {"shot": "crops/high/R03-kart_5", "note": "10 px spectral peak 6.7x median vs 2.8x on Low; column-mean amplitude 0.88 vs 0.14 levels: close-up does not hold up"},
        {"shot": "high/desktop/R17", "note": "Third green-uniform team (with R08, R19); team identity from colour and hat; held soap merges into the captain's hat silhouette"}
      ]
    },
    "materials": {
      "score": 5.5,
      "confidence": 0.5,
      "evidence": [
        {"shot": "high/desktop/R05", "note": "26.7% of frame is texture-free non-sky (9x9 std < 0.75); one unlit RGB (63,94,69) covers 17.7%"},
        {"shot": "high/desktop/R06", "note": "23.9% texture-free; every window is opaque flat navy (26,40,52)/(29,42,54); lower roof a plain grey slab (72,82,81)"},
        {"shot": "high/desktop/R04", "note": "Asphalt near camera is soft square cells 145/83/72 px wide with one 6-8 level step each (row y=740), a blurred voxel checker"},
        {"shot": "crops/high/R02-preview-captain", "note": "Clear part (water) reads as a flat shard, not transparent plastic"},
        {"shot": "high/desktop/R19", "note": "Creek ford reads as grey stone, not clear water"},
        {"shot": "high/desktop/R10", "note": "Studded verge and seamed tile trail: the plastic read exists, but only at the road edge"}
      ]
    },
    "scenery": {
      "score": 6.0,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R09", "note": "Pine canopy plates tilted at mixed angles pierce each other; a grey rail passes through the canopy"},
        {"shot": "high/desktop/R17", "note": "No plaza centrepiece in frame; near-white stepped ridge wall behind a lone brick block"},
        {"shot": "high/desktop/R05", "note": "Dark flat ridge wall dominates the Fordyce"},
        {"shot": "high/desktop/R13", "note": "Same two-storey awning module as R03/R04/R07/R17; nothing specific to Bridge Street"},
        {"shot": "high/desktop/R12", "note": "Verge shrubs and maples help; far ridge a pale paper band"}
      ]
    },
    "lighting": {
      "score": 6.0,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R11", "note": "Sunset sky luminance 139 at zenith vs 146 at horizon (ratio 1.05), no sun or glow: differs from day by tint"},
        {"shot": "high/desktop/R06", "note": "Arlington facade planes facing different directions at luminance 80-87; no key-light modelling on the hero landmark"},
        {"shot": "high/desktop/R05", "note": "Near ridge luminance 86 hard against sky 199; no haze ramp"},
        {"shot": "high/desktop/R07", "note": "Lamp globes are flat cream discs with no halo; ridge flat navy (38,39,63)"},
        {"shot": "high/desktop/R17", "note": "Soft occlusion under boots and tub at 4x: contact grounding is real"}
      ]
    },
    "animation": {
      "score": 5.5,
      "confidence": 0.5,
      "evidence": [
        {"shot": "strips/high/R15", "note": "Crew circles with correct rigid-limb articulation; camera static: ridge-top row moves at most 2 px over all 8 frames of a fumble"},
        {"shot": "strips/high/R14", "note": "Named for the hot-steam charge but shows no steam and no banner, only yaw and blue beads; tub interior hidden so no slosh; lamp post inside the ring in frames 7-8 with no reaction"},
        {"shot": "strips/high/R16", "note": "Circling ritual reads; no anticipation or follow-through"},
        {"shot": "high/desktop/R19", "note": "Charge tier shown only as a 'WARM STEAM' text banner"},
        {"shot": "high/desktop/R17", "note": "'HOT STEAM!' is a text banner; no in-world steam effect"}
      ]
    },
    "ui": {
      "score": 6.0,
      "confidence": 0.45,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "HUD panels are flat dark rounded rectangles with no brick language; '10' tile cut at the gauge edge"},
        {"shot": "high/desktop/R01", "note": "Grand Prix focus ring runs through the bases of the button's studs"},
        {"shot": "high/landscape/R02", "note": "Fourth row of cards clipped and preview tub cut by the panel while about 150 px of the right column stays empty"},
        {"shot": "high/desktop/R18", "note": "Consistent brick-panel results, but a static table"}
      ]
    },
    "typography": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Clear display/body scale; '10' glyph clipped"},
        {"shot": "high/landscape/R02", "note": "Team names clipped and broken into 3-line stacks"},
        {"shot": "high/desktop/R13", "note": "Lap and timer glyphs over a pale lamp globe with no backing, held only by a 1-2 px outline (minor)"}
      ]
    },
    "readability": {
      "score": 6.0,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R16", "note": "Near tree covers 11.5% of the judge-stop frame; judge itself does not read"},
        {"shot": "high/desktop/R11", "note": "Near canopy covers 17.5% of frame"},
        {"shot": "high/desktop/R19", "note": "Near canopy 16.3%; sage crew on tan pavers"},
        {"shot": "high/desktop/R13", "note": "Near lamp post and globes fill the top-left down to about y=600; lamps are never hidden"},
        {"shot": "high/mobile/R07", "note": "Rival tub ahead overlaps the player's captain; pack tubs visible only as crews"},
        {"shot": "high/mobile/R04", "note": "Player ring and marker read well on phone"}
      ]
    },
    "mobile": {
      "score": 6.0,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/landscape/R02", "note": "Three of twelve cards cut and preview tub half behind the panel in a core flow"},
        {"shot": "high/mobile/R02", "note": "Portrait team select now fits with the full preview"},
        {"shot": "high/mobile/R08", "note": "Thumb controls clear of the tub"},
        {"shot": "high/landscape/R04", "note": "Controls at the edges, tub clear; minimap drawn over scenery without backing"}
      ]
    },
    "authenticity": {
      "score": 6.0,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Central Avenue vista ends in generic shopfronts and the ridge; the Arlington does not close it"},
        {"shot": "high/desktop/R03", "note": "Same: no Arlington at the end of the street from the grid"},
        {"shot": "high/desktop/R06", "note": "Arlington recognisable, but only in a staged aerial shot"},
        {"shot": "high/desktop/R09", "note": "Goat Rock is white boulders in a closed pine stand with no overlook view"},
        {"shot": "high/desktop/R17", "note": "Hill Wheatley Plaza shows no fountain or jug"},
        {"shot": "high/desktop/R05", "note": "Fordyce recognisable: the Row itself holds up"}
      ]
    }
  },
  "ip": {
    "clean": true,
    "notes": "Heads are rounded cuboids with printed faces and no top stud; torsos rectangular (shoulder width matches waist); hands are rounded fists, not C-clips; no LEGO name or logo in any frame, menu or results. The fire helmet's shield and brim recall a generic toy fire helmet but hats are not in the silhouette rule."
  },
  "gaps": [
    {"id": "G-tub-brick-parts", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R03-player", "crops/high/R04-kart_3", "crops/high/R03-player-rear"], "benchmark": "drive-4", "fix": "Build each tub from visible parts: studded rim plate ring, a separate raised tile for the team stripe with a seam, exposed studs on the tail plate; 1-4 studs on top of every hat. Test: at least 3 part seams on the tub body in crops/high/R03-player and R04-kart_3, studs on every hat in high/desktop/R03."},
    {"id": "G-clear-parts-opaque", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R06", "crops/high/R02-preview-captain", "high/desktop/R19"], "benchmark": "worlds-1", "fix": "Glass material with sky Fresnel reflection and a one-plate frame recess for windows; refractive tinted water with a highlight for tub water and the ford. Test: window pixels in high/desktop/R06 show at least a 20-level vertical gradient or highlight (now constant (26,40,52))."},
    {"id": "G-arlington-vista", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R04", "high/desktop/R03", "high/desktop/R06"], "fix": "Place the Arlington (far LOD is enough) where Central Avenue bends at the north end of the Row so its twin towers sit above the vanishing point from the grid; if the grid faces south, add a north-bound capture. Test: both towers visible above the road's vanishing point in R03/R04 or an equivalent race frame."},
    {"id": "G-hero-facade-modelling", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R06"], "benchmark": "worlds-4", "fix": "Rotate the course sun azimuth or add a sky/fill light so differently facing walls separate. Test: in high/desktop/R06 adjacent facade planes differ by at least 15 luminance levels and one plane reaches 120 or more (now 80-87 across all planes)."},
    {"id": "G-asphalt-cells", "category": "materials", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R04", "high/desktop/R02"], "benchmark": "worlds-1", "fix": "Shrink the asphalt fleck to 0.05 m or less with mip-aware fade, or make Central Avenue a seamed tile road like the R10 trail. Test: along row y=740 of high/desktop/R04 no flat run wider than 20 px (now 72-145 px)."},
    {"id": "G-near-props-unhidden", "category": "readability", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R16", "high/desktop/R13"], "benchmark": "drive-3", "fix": "Extend the near-hide rule to lamp posts and street furniture; widen the tree rule to canopies within 6 m whose screen bounds overlap the top-left or top-right third. Test: no single prop covers more than 5% of high/desktop/R16 (now 11.5%) or R13."},
    {"id": "G-canopy-intersections", "category": "scenery", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R09"], "benchmark": "worlds-1", "fix": "Keep canopy plate tilt at 0 degrees, enforce minimum trunk spacing of at least the sum of canopy radii, cull trees whose canopy intersects rails or rocks. Test: no canopy-canopy or rail-canopy intersection in high/desktop/R09."},
    {"id": "G-hud-brick-style", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/desktop/R01"], "benchmark": "drive-3", "fix": "Give the gauge, coin and item panels the menus' stud rim and tile bevel; draw the focus ring outside the stud tops. Test: the gauge panel in high/desktop/R04 shows a stud row, and in high/desktop/R01 the ring clears all four Grand Prix studs."},
    {"id": "G-green-teams", "category": "characters", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["high/desktop/R08", "high/desktop/R17", "high/desktop/R19"], "benchmark": "drive-4", "fix": "Move one of the three green-uniform teams to another hue family, or give each a high-contrast secondary torso colour. Test: torso hues of any two teams differ by at least 40 degrees in a pack frame."}
  ]
}
```
