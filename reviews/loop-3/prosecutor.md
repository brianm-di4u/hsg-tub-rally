# Prosecutor (loop 3, high tier)

All capture paths are relative to `games/Cart Racing/screenshots/review-loop-3/`. Pixel coordinates are in the file's own pixels (phone frames are 2×, so device px ÷ 2 = CSS px). The critic means are: characters 7.0, materials 6.0, scenery 6.0, lighting 6.0, animation 6.25, ui 6.5, typography 6.5, readability 6.5, mobile 6.5 and authenticity 6.75, for a total of 64.5.

## Summary
The critics looked closely at the crews and at the obvious world gaps: flat asphalt, empty lawns, ghosted trees and the tiled ford. Then they scored as if those were the only problems. These frames show several defects that neither critic reported:
- **The player ring sinks into the road on every non-flat course.** It shows as a left crescent in R08, R10 and R12. Critic A cited R08 as a success.
- **In R14 the power slide carries the tub onto the sidewalk and through a lamp post, with no reaction.**
- **R07 has an unlit stripe**, one RGB value across 2,304 pixels.
- **In landscape, the place readout collides with the minimap.**
- **The crowd lining every race frame is anchor-3 "boxy people"** with blank faces.
- **Hot Springs Mountain is missing behind Bathhouse Row.**
- Smaller defects: a crack in the terrain, a clipped panel stud, and a water-line numeral 5.5 CSS px tall.

The critics already noted several anchor-7 failures and then scored as if they didn't count:
- hats with no studs (characters);
- text clipped behind buttons (ui and typography, whose anchor says "nothing clipped");
- the 8-tub pack merging into one mass (readability).

I argue every category down by 0.5 to 0.75, each charge backed by a capture, for a proposed **58.5/100**.

## Category by category

### Characters: 7.0 → **6.5** (gate ≥7)
I accept that the crews are now the best thing in the build. `crops/high/R02-preview`, `crops/high/R03-kart_1` and `crops/high/R03-kart_5` show printed faces, printed uniforms, team hats and hubbed wheels. But anchor 7 is a checklist, and three items on it fail:
- **"Studs on hats and tubs": hats have none.** The fire helmet has a comb and a shield print, and no stud anywhere (`crops/high/R02-preview`, helmet at x 570–780, y 50–250). The turbans, antenna bands, gator heads and top hats are the same (`crops/high/R03-kart_5`, `crops/high/R04-kart_3`). Critic A noted this and gave 7 anyway.
- **"Close-ups hold up": the tub doesn't.** The rim is a hard 8-sided polygon (`crops/high/R02-preview-captain`, rim corners at roughly x 205, 300, 815). Left of the duck, the tub interior is a flat grey-teal (101,122,120), σ ≈ 3.4/4.1/4.1 over x 260–400, y 440–520. It reads as grey plastic, not bath water. The only blue in that tub is a small tilted card, 53 px wide at y 360, beside a rim about 615 px across.
- **The figures that share every race frame with the crews are not toys.** The spectators along the barriers are unbevelled boxes with blank skin-tone heads: no eyes, no mouth, no print, no seams (`crops/high/R03-kart_5`, x 60–460, y 250–380; `crops/high/R03-kart_1`, x 900–1180, y 250–360). That is anchor 3 ("primitive boxes, no faces or prints") standing directly next to anchor-7 crews.
- At chase distance at dusk the teams stop separating. In `high/mobile/R07` and `high/desktop/R07` the five tubs behind the player read as one pink, teal and purple mass. Anchor 7 asks for "all 12 teams distinct at chase distance".

### Materials: 6.0 → **5.5** (gate ≥7)
The figures are glossy ABS. Away from the camera, though, the world is "lit colour that reads as painted card" (anchor 5):
- **Baseplate lawns go flat a few metres out.** The `high/desktop/R05` lawn at x 1150–1270, y 620–700 is a single (81,165,89), σ 0.5/0.4/0.8, with no stud pattern at all. Studs read only right at the camera (`high/desktop/R08` bottom left).
- **Roofs are untextured slabs.** The lower Arlington roof in `high/desktop/R06` (x 460–560, y 560–600) is a flat (73,83,82), σ ≈ 3, with no tiles, plates or studs, and the slab covers about 15% of the frame.
- **Rock is textured as masonry.** Goat Rock in `high/desktop/R09` is a set of white obelisks with a running-bond brick texture. That is natural stone printed as wall bricks, not rock built from slope bricks. Critic B called it "masonry-like" but did not deduct for it.
- **Asphalt at dusk has exactly two values.** In `high/desktop/R07`, every sample on the road lanes at rows 560–700 is either lit (55,41,43)/(56,42,43) or shadowed (36–38,23–24,22–23). There's no gloss, no tile and no gradient.
- **There is an unlit material.** It is the R07 stripe described under Lighting.
- Both critics already cited the opaque ford tiles (`high/desktop/R19`).

### Scenery: 6.0 → **5.5** (gate ≥7)
- **World and characters clash.** Anchor 3 names exactly this. The barrier crowds in every street frame (`high/desktop/R03`, `R04`, `R13`, `R14`; zoomed in `crops/high/R03-kart_5`) are a cruder style than the crews: flat-colour shirts, blank faces, no bevels.
- **There is a hole in the ground.** `high/desktop/R09` has 78 sky-coloured pixels (153,188,222) at x 186–207, y 317–322, in the middle of the grass: a crack in the terrain mesh. The same frame is a field of identical pines on flat tan and green polygons.
- **The near-camera foliage problem is wider than R11 and R19.** In `high/desktop/R08`, a faded tree fills the top-left (about x 0–550, y 0–300). In `high/desktop/R10`, a ghosted pine covers x 0–420, y 0–470, and the guard rail shows through it.
- The world-edge band in `high/desktop/R06` (Critic A) is real: a pale strip of (164,190,191) at x 0–340, y 400–500 between the lawn and the hills. `high/desktop/R05` has a similar pale slab running off the right edge at x 1070–1280, y 520–570.
- The commercial block module repeats in `R04`, `R13`, `R14` and `R16`, and the landmark lawns are empty (`R05`, `R06`).

### Lighting: 6.0 → **5.5** (gate ≥7)
- **There is a full-bright stripe at dusk.** In `high/desktop/R07`, a stripe along the left facade (x 0–479, y 252–281, 2,304 px) is a single RGB value: (255,225,79). It is identical in every pixel, so it has no shading, no fog with distance and no falloff. The same stripe shows in `high/landscape/R07` (1,903 px, x 242–899). It reads as a rendering glitch, not a lit sign.
- **The lamp pools don't reach the lanes.** The brief says the pools now "reach the near lane", and Critic B praised "lamp pools reaching the roadway". In `high/desktop/R07`, the warm pools appear only on the right sidewalk, clipping at (255,205,177) at x 940, y 460 and (255,182,128) at x 950, y 460. Every road-lane sample from row 560 to row 700 is the flat lit or shadow value given above.
- **There is no ambient occlusion anywhere.** Neither critic found any under cornices, in window reveals, at building corners or under the lower Arlington wing (`high/desktop/R05`, `R06`, `R13`). The anchor-7 haze "matched to the sky" fails at the `R06` world edge.
- Above anchor 5: real cast shadows, deliberate dusk and sunset palettes, and pusher contact shadows. Below anchor 7: no AO, clipped pools, an unlit band. 5.5 fits.

### Animation and feel: 6.25 → **5.5** (gate ≥7)
- **The tub slides through street furniture with no reaction.** In `strips/high/R14`, frames 6–8, the "power slide charging hot steam" carries the tub over the curb onto the brick sidewalk. In frames 7 and 8 the base of a lamp post stands **inside the player's ring**, with the pole rising between the right-hand pushers (frame 8 at about x 1620–1760, y 420–560 of the strip). There is no hit splash, no stagger, no camera kick and no stop. Anchor 7 requires that "hits ... read with particles and camera kick".
- **The slide spray is detached from the tub.** In frames 3–6 of `strips/high/R14`, the bead clusters sit 60–100 px below the tub, spawned in the empty road between the camera and the tub. Both critics saw this.
- **The splash is oversized.** In `strips/high/R15`, frames 3–5, the fumble splash is a dome of about 25 beads, each about two-thirds the width of a figure's head, which hides the tub and captain completely. "Fewer, smaller particles" still reads as foam balloons.
- The water never moves in any strip. There is no anticipation and no follow-through. The crew circling in `strips/high/R15` and `strips/high/R16` is the one thing that works.

### UI / HUD: 6.5 → **6.0** (gate ≥7)
Anchor 7 says "nothing overlapping". These captures overlap or clip:
- **Place and minimap collide in landscape.** In `high/landscape/R07`, the minimap's outlined path runs into the foot of the "T" of "8TH" at about x 1580–1610, y 140–146, then passes 1–5 px under the "8" and the "H" down to y 155. In `high/landscape/R04`, the minimap stroke begins at y 142, directly under the "T" stem, touching its outline. Neither critic saw this.
- `high/landscape/R02`: the button studs sit on the "Captain:" line, and the stat rows run off the bottom of the panel (both critics).
- `high/mobile/R02`: the heading sits on the stud row, and the button bar covers "Handling" (both critics).
- **The phone team select crops its own subject.** In `high/mobile/R02`, the panel's top edge (y ≈ 590) slices through the preview tub's wheels and chassis, so the one screen built to show off the team hides half the tub.
- **The panel parts don't fit.** In `high/desktop/R02`, the rightmost stud of the panel's stud row is cut off by the panel border (stud at x ≈ 635–652, y 115–135). In `high/desktop/R01`, the white focus ring around Grand Prix runs straight across the bases of all four studs (x 470–800, y 330–338), so the studs look pasted on top of the outline.
- The HUD is static, with no animation and no context awareness.

### Typography: 6.5 → **6.0** (gate ≥7)
- **The race's key numeral is tiny.** The "10" that labels the water line is 8 px tall on desktop (`high/desktop/R04`, rows 706–713) and 11 device px, about 5.5 CSS px, on the phone (`high/mobile/R04`, rows 197–207). That is the rule the whole race turns on, and it doesn't "read at a glance".
- The item labels are 16 device px from ascender to baseline, about 8 CSS px (`high/mobile/R04`, rows 298–313).
- **"Nothing clipped" fails.** Text is clipped in `high/landscape/R02` ("Captain:" line under the studs) and `high/mobile/R02` ("Handling" under the bar). The display numeral "8TH" collides with the minimap in `high/landscape/R07`. Both critics recorded the clipping and still gave 6.5.
- The 8-bit outlined display face and the rounded UI sans form a clear scale (`high/desktop/R01`, `R18`). That is worth 6, not 6.5, with those failures.

### Readability: 6.5 → **6.0** (gate ≥7)
- **The player ring is buried on slopes.** On flat Central Avenue the ring is symmetric: in `high/desktop/R04`, 1,132 ring pixels lie left of the tub's centre line and 1,131 right; in `high/desktop/R03`, 1,935 and 1,907. Off the flat it sinks into the road:
  - `high/desktop/R08`: 1,158 left, 169 right (87% left).
  - `high/desktop/R10`: 960 left, 0 right (100% left).
  - `high/desktop/R12`: 961 left, 76 right (93% left).
  - `high/mobile/R08`: 1,886 left, 241 right (89% left).

  On every mountain and park course the player's main marker is a left crescent. Critic A listed R08 among the frames where the ring makes the player "obvious".
- **Faded rivals hide the player.** In `strips/high/R16`, frames 4–8, a faded rival crew covers the lower-left third of the frame and stands in front of the player's ring during the judge stop.
- **The ring matches the road paint.** In R03, Engine Six's ring (233,187,49) is road-paint yellow, next to the yellow centre dashes (233,211,81). Only the black outline separates them.
- The critics' own charges stand: `high/desktop/R19` (foreground slabs and beads), `high/desktop/R11` (ghost tree) and the packs merging in `high/desktop/R07`, `high/mobile/R07` and `R12`.

### Mobile: 6.5 → **6.0** (gate ≥7)
I accept that the thumb controls never cover the tub in any race frame (`high/mobile/R04`, `R07`, `R08`, `R17`; `high/landscape/R03`, `R04`, `R07`, `R08`, `R17`). But anchor 7 also asks that "portrait and landscape both [be] framed on purpose", and they aren't:
- In landscape, the place readout and the minimap collide (`high/landscape/R07`, `R04`).
- Portrait team select crops the preview tub (`high/mobile/R02`).
- Landscape team select shows no stats and clips its description (`high/landscape/R02`).
- The water-line numeral is 5.5 CSS px and the item labels are 8 CSS px (`high/mobile/R04`).

Critic A's 7 doesn't survive the landscape HUD collision.

### Authenticity: 6.75 → **6.0** (gate ≥6)
- **Hot Springs Mountain is missing.** The real Bathhouse Row sits at the foot of a wooded mountain that rises directly behind it. In `high/desktop/R03`, `R04` and `R14` the sky above the Row's roofs is empty from x 0 to 500.
- **The Central Avenue vista ends in water.** In `high/desktop/R14` the road ends at a flat blue band (x 660–760, y ≈ 276–297) whose top edge rises less than 2 px across 100 px. It reads as an open-water horizon, not as Ouachita ridges. Anchor 7 requires that "the mountains read as the Ouachitas".
- Goat Rock is a cluster of brick-textured obelisks in a flat pine field, not an overlook (`high/desktop/R09`).
- The ford is a tiled pool (`high/desktop/R19`).
- The judge booth is a plain white box, and its judges look like the crowd (`high/desktop/R16`).
- The Arlington is olive-grey (`high/desktop/R06`).

Critic B's 7 ignores the mountain rule entirely. The Row, the dome, the Arlington's towers and the race furniture (gauge, checklist, duck, flag) earn a pass at the gate, and no more.

## IP check: clean
- **Heads** are rounded cubes, not cylinders (`crops/high/R02-preview-rear`, `crops/high/R03-player-rear`).
- **Torsos** are straight-sided boxes, not trapezoids (`crops/high/R03-player-rear`).
- **Hands** are rounded mitts with a thumb lump, not C-hands (`crops/high/R02-preview-captain`, fists at x 400–520 and 680–790, y 240–390; `crops/high/R03-kart_1`, x 420–500, y 300–390).
- **Marks:** no LEGO name or logo appears on the title, team select, HUD, results or signage (`high/desktop/R01`, `R02`, `R18`).
- **Watch item, not a violation:** the hip block with two rectangular legs and a stepped foot is minifig-adjacent, but it is not one of the three silhouette features the gate defines.

## Gaps the critics missed
1. **G-ring-terrain-conform** (readability, WS1; severity 3, effort S, +0.3)
   - Problem: the ring sinks into sloped and crowned roads (R08, R10, R12, mobile R08).
   - Fix: sample road height under each ring vertex, or draw it as a projected decal with a depth bias after the road.
   - Test: the ring's left/right pixel split is within 60/40 in R08, R10 and R12.
2. **G-prop-collision-feedback** (animation, WS3; severity 3, effort M, +0.3)
   - Problem: in R14 frames 7–8 a lamp post stands inside the player's ring, with no reaction.
   - Fix: collide tubs with posts, barriers and the curb, and on contact fire the hit splash, a crew stagger and a camera kick.
   - Test: in a re-shot R14 no static prop is inside the ring in any frame, and a contact frame shows the hit effects.
3. **G-unlit-facade-stripe** (lighting, WS1; severity 3, effort S, +0.3)
   - Problem: the R07 stripe is one RGB value, (255,225,79), over 2,304 px.
   - Fix: give it a lit material with fog and distance falloff, or cap its emissive.
   - Test: the stripe pixels in R07 take at least 20 distinct values, with max R < 250.
4. **G-landscape-place-minimap** (ui, WS6; severity 3, effort S, +0.3)
   - Problem: the minimap path runs into the foot of "8TH" in `high/landscape/R07`.
   - Fix: give the landscape minimap its own box with its top at least 12 px below the place readout's bounds, or shrink the place readout on short viewports.
   - Test: no minimap pixel within 8 px of the place glyph box in any landscape race frame.
5. **G-crowd-toy-figures** (scenery, WS5; severity 3, effort M, +0.5)
   - Problem: the spectators are blank-faced unbevelled boxes (`crops/high/R03-kart_5`, `crops/high/R03-kart_1`).
   - Fix: instance the crowd from the crew pack's LOD2/LOD3 parts, with printed faces, printed shirts and two or three cheer poses.
   - Test: crowd figures in the R03-kart_5 crop show printed eyes and a mouth, and bevel highlights.
6. **G-row-mountain-backdrop** (authenticity, WS4; severity 3, effort M, +0.5)
   - Problem: there is no Hot Springs Mountain behind the Row, and the Central Avenue vista ends in a flat blue band (R03, R04, R14).
   - Fix: build a forested, brick-built slope rising behind the Row, and layered ridge silhouettes on the backdrop.
   - Test: at least 50% of the skyline above the Row's roofs (x 0–500 in R03, R04, R14) is terrain or trees, and the R14 horizon shows ridge relief of at least 8 px.
7. **G-phone-preview-framing** (mobile, WS6; severity 2, effort S, +0.3)
   - Problem: the panel cuts the preview tub's wheels in `high/mobile/R02`.
   - Fix: frame the turntable camera so the whole tub sits above the panel.
   - Test: the bottom of the preview tub's wheels is at least 20 px above the panel's top edge.
8. **G-water-line-label** (typography, WS6; severity 2, effort S, +0.2)
   - Problem: the "10" water-line label is 5.5 CSS px on the phone and 8 px on desktop (`high/mobile/R04`, `high/desktop/R04`).
   - Fix: set it at 11 CSS px or larger on a tile, or fold it into the gauge readout ("41 / 10 GAL").
   - Test: cap height of at least 11 CSS px on the phone.
9. **G-far-baseplate-flat** (materials, WS1; severity 2, effort M, +0.3)
   - Problem: the R05 lawn has σ 0.5, and the R06 roof slab has σ about 3 with no tiles.
   - Fix: use a mip-aware stud normal/AO texture so the studs survive at distance, and add plate seams or tiles on roofs.
   - Test: σ ≥ 3 with a visible stud pattern over R05 (x 1150–1270, y 620–700).
10. **G-panel-stud-fit** (ui, WS6; severity 1, effort S, +0.1)
    - Problem: the last stud is clipped in `high/desktop/R02`, and the focus ring bisects the Grand Prix studs in `high/desktop/R01`.
    - Fix: derive the stud count from the panel width with equal end margins, and draw the focus ring outside the stud tops.
    - Test: every stud lies wholly inside its panel outline.
11. **G-terrain-crack** (scenery, WS4; severity 1, effort S, +0.1)
    - Problem: sky shows through the ground in `high/desktop/R09` at x 186–207, y 317–322.
    - Fix: weld the terrain seams or add skirts.
    - Test: no sky-coloured pixel below the horizon in R09.

```json
{
  "loop": 3,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "characters": {
      "score": 6.5,
      "confidence": 0.55,
      "evidence": [
        {"shot": "crops/high/R02-preview", "note": "Fire helmet (x 570-780, y 50-250) has a comb and shield print but no stud; anchor 7 requires studs on hats. Same for turbans, antennae, top hats (crops/high/R03-kart_5, crops/high/R04-kart_3)."},
        {"shot": "crops/high/R02-preview-captain", "note": "Hard 8-sided tub rim; interior left of the duck is flat grey-teal (101,122,120), sigma ~4 over x 260-400, y 440-520, and reads as grey plastic, not water; the only blue is a 53 px tilted card."},
        {"shot": "crops/high/R03-kart_5", "note": "Spectators (x 60-460, y 250-380) are unbevelled boxes with blank faces and no prints: anchor-3 figures beside anchor-7 crews."},
        {"shot": "crops/high/R03-kart_1", "note": "Crowd at x 900-1180, y 250-360 likewise faceless; crews themselves are good (printed faces, uniforms, hubbed wheels)."},
        {"shot": "high/mobile/R07", "note": "At dusk chase distance the five tubs ahead merge into one pink/teal/purple mass; teams stop being distinct."}
      ]
    },
    "materials": {
      "score": 5.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R05", "note": "Baseplate lawn at x 1150-1270, y 620-700 is a single (81,165,89), sigma 0.5/0.4/0.8: no stud pattern beyond the near field."},
        {"shot": "high/desktop/R06", "note": "Lower Arlington roof (x 460-560, y 560-600) is an untextured (73,83,82) slab, sigma ~3, about 15% of the frame."},
        {"shot": "high/desktop/R09", "note": "Goat Rock is white obelisks printed with running-bond brick: natural rock rendered as masonry wall."},
        {"shot": "high/desktop/R07", "note": "Asphalt lanes rows 560-700 take only lit (55,41,43) or shadow (36-38,23-24,22-23); unlit stripe of one RGB value on the facade."},
        {"shot": "high/desktop/R19", "note": "Ford tiles opaque, not trans-clear (both critics)."},
        {"shot": "crops/high/R02-preview-captain", "note": "Figures and tub are convincing glossy ABS; the only area at anchor 7."}
      ]
    },
    "scenery": {
      "score": 5.5,
      "confidence": 0.55,
      "evidence": [
        {"shot": "crops/high/R03-kart_5", "note": "Barrier crowds are cruder blank-faced boxes than the crews; anchor 3 'world and characters clash'."},
        {"shot": "high/desktop/R09", "note": "Sky-coloured crack (153,188,222), 78 px at x 186-207, y 317-322, in the grass; field of identical pines on flat tan and green polygons."},
        {"shot": "high/desktop/R08", "note": "Faded near tree fills the top-left (about x 0-550, y 0-300)."},
        {"shot": "high/desktop/R10", "note": "Ghosted pine covers x 0-420, y 0-470 with the guard rail showing through."},
        {"shot": "high/desktop/R06", "note": "Pale world-edge band (164,190,191) at x 0-340, y 400-500; Arlington on an empty lawn."},
        {"shot": "high/desktop/R05", "note": "Empty flat lawn; pale slab running off the right edge at x 1070-1280, y 520-570."}
      ]
    },
    "lighting": {
      "score": 5.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/desktop/R07", "note": "Facade stripe x 0-479, y 252-281 is one RGB value (255,225,79) over 2,304 px: no shading, fog or falloff. Lamp pools clip at (255,205,177) on the right sidewalk and never reach the lanes: every lane sample rows 560-700 is flat lit or shadow value."},
        {"shot": "high/landscape/R07", "note": "Same unlit stripe, 1,903 px at x 242-899."},
        {"shot": "high/desktop/R13", "note": "Day key light with no AO under cornices, in window reveals or at corners."},
        {"shot": "high/desktop/R06", "note": "Haze not matched to sky: pale band between ground and hills; no occlusion under the lower wing."},
        {"shot": "high/desktop/R03", "note": "Credit: real cast shadows and pusher contact shadows."}
      ]
    },
    "animation": {
      "score": 5.5,
      "confidence": 0.6,
      "evidence": [
        {"shot": "strips/high/R14", "note": "Frames 6-8: the slide carries the tub onto the sidewalk; in frames 7-8 a lamp post's base is inside the player's ring (frame 8, about x 1620-1760, y 420-560) with no hit splash, stagger or camera kick. Frames 3-6: bead clusters 60-100 px below the tub, detached."},
        {"shot": "strips/high/R15", "note": "Crew circling reads; frames 3-5 the splash is a dome of ~25 beads, each ~2/3 a head wide, hiding tub and captain."},
        {"shot": "strips/high/R16", "note": "Circling at the judge stop works; water never tilts in any strip; no anticipation or follow-through."}
      ]
    },
    "ui": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/landscape/R07", "note": "Minimap path runs into the foot of the 'T' of '8TH' (x 1580-1610, y 140-146) and passes under the '8' and 'H' to y 155."},
        {"shot": "high/landscape/R04", "note": "Minimap stroke starts at y 142 directly under the 'T' stem, touching its outline."},
        {"shot": "high/mobile/R02", "note": "Panel top (y ~590) slices through the preview tub's wheels; heading on the stud row; button bar covers 'Handling'."},
        {"shot": "high/landscape/R02", "note": "Button studs sit on the 'Captain:' line; stat rows run off the panel."},
        {"shot": "high/desktop/R02", "note": "Rightmost panel stud cut off by the border (x ~635-652, y 115-135)."},
        {"shot": "high/desktop/R01", "note": "Grand Prix focus ring runs across the bases of all four studs (x 470-800, y 330-338)."}
      ]
    },
    "typography": {
      "score": 6.0,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/mobile/R04", "note": "Water-line '10' is 11 device px (~5.5 CSS px, rows 197-207); item labels ~8 CSS px (rows 298-313)."},
        {"shot": "high/desktop/R04", "note": "Water-line '10' is 8 px tall (rows 706-713)."},
        {"shot": "high/landscape/R07", "note": "Display numeral '8TH' collides with the minimap."},
        {"shot": "high/landscape/R02", "note": "'Captain:' line clipped under the button studs; anchor 7 says nothing clipped."},
        {"shot": "high/desktop/R18", "note": "Credit: clear scale between pixel display face and rounded sans; table aligned."}
      ]
    },
    "readability": {
      "score": 6.0,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R10", "note": "Player ring is a left crescent: 960 ring px left of the tub centre, 0 right."},
        {"shot": "high/desktop/R08", "note": "Ring 1,158 px left vs 169 right (87% left); Critic A cited this frame as a success."},
        {"shot": "high/desktop/R12", "note": "Ring 961 left vs 76 right (93% left); on flat R04 it is 1,132 vs 1,131."},
        {"shot": "high/mobile/R08", "note": "Ring 1,886 left vs 241 right on the phone."},
        {"shot": "strips/high/R16", "note": "Frames 4-8: a faded rival crew covers the lower-left third, in front of the player's ring."},
        {"shot": "high/desktop/R19", "note": "Foreground slabs and bead clusters hide the ring (both critics)."}
      ]
    },
    "mobile": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        {"shot": "high/landscape/R07", "note": "Place readout and minimap collide in landscape."},
        {"shot": "high/mobile/R02", "note": "Team select crops the preview tub at its wheels; 'Handling' under the button bar."},
        {"shot": "high/landscape/R02", "note": "No stats visible; description clipped by the buttons."},
        {"shot": "high/mobile/R04", "note": "Credit: controls clear of the tub; but water-line '10' ~5.5 CSS px, item labels ~8 CSS px."},
        {"shot": "high/landscape/R04", "note": "Controls clear of the tub; minimap touches the place glyphs."}
      ]
    },
    "authenticity": {
      "score": 6.0,
      "confidence": 0.55,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Empty sky above the Row from x 0 to 500: Hot Springs Mountain, which rises directly behind the real Row, is missing."},
        {"shot": "high/desktop/R14", "note": "Central Avenue vista ends in a flat blue band (x 660-760, y ~276-297, top edge rises <2 px across 100 px): reads as an open-water horizon, not Ouachita ridges. Row with dome correctly placed."},
        {"shot": "high/desktop/R09", "note": "Goat Rock is brick-textured obelisks in a flat pine field, not an overlook."},
        {"shot": "high/desktop/R19", "note": "Gulpha Creek ford is a tiled pool."},
        {"shot": "high/desktop/R16", "note": "Judge booth is a plain white box; judges look like the crowd."},
        {"shot": "high/desktop/R06", "note": "Arlington twin towers close the vista, but in olive-grey."}
      ]
    }
  },
  "ip": {
    "clean": true,
    "notes": "Rounded-cube heads (crops/high/R02-preview-rear), straight-sided torsos (crops/high/R03-player-rear), rounded mitt hands with a thumb lump (crops/high/R02-preview-captain, crops/high/R03-kart_1); no cylinder heads, C-hands or trapezoid torsos. No LEGO name or logo in R01, R02, R18 or signage. Watch item only: the hip block plus two rectangular legs with a stepped foot is minifig-adjacent but not a gate feature."
  },
  "gaps": [
    {"id": "G-ring-terrain-conform", "category": "readability", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R08", "high/desktop/R10", "high/desktop/R12", "high/mobile/R08"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Sample road height under each ring vertex, or draw the ring as a projected decal with depth bias after the road. Test: the ring's left/right pixel split is within 60/40 in R08, R10 and R12 (now 87/13, 100/0, 93/7)."},
    {"id": "G-prop-collision-feedback", "category": "animation", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Collide tubs with lamp posts, barriers and the curb; on contact fire the hit splash, a crew stagger and a camera kick. Test: in a re-shot R14 strip no static prop is inside the player's ring in any frame, and a contact frame shows the hit effects."},
    {"id": "G-unlit-facade-stripe", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/landscape/R07"], "benchmark": "worlds/worlds-4.jpg", "fix": "Give the R07 facade stripe a lit material with fog and distance falloff, or cap its emissive. Test: the stripe pixels in high/desktop/R07 take at least 20 distinct values, with max R < 250 (now one value, (255,225,79))."},
    {"id": "G-landscape-place-minimap", "category": "ui", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R07", "high/landscape/R04"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Give the landscape minimap its own box with its top at least 12 px below the place readout's bounds, or shrink the place readout on short viewports. Test: no minimap pixel within 8 px of the place glyph box in any landscape race frame."},
    {"id": "G-crowd-toy-figures", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS5", "evidence": ["crops/high/R03-kart_5", "crops/high/R03-kart_1", "high/desktop/R14"], "benchmark": "worlds/worlds-1.jpg", "fix": "Instance the spectators from the crew pack's LOD2/LOD3 parts, with printed faces, printed shirts and two or three cheer poses. Test: crowd figures in crops/high/R03-kart_5 show printed eyes and a mouth, and bevel highlights."},
    {"id": "G-row-mountain-backdrop", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R03", "high/desktop/R04", "high/desktop/R14"], "benchmark": "2k-drive/drive-5.jpg", "fix": "Build a forested, brick-built Hot Springs Mountain slope rising behind Bathhouse Row, and replace the flat blue horizon band with layered ridge silhouettes. Test: at least 50% of the skyline above the Row's roofs (x 0-500 in R03, R04, R14) is terrain or trees, and the R14 horizon shows ridge relief of at least 8 px."},
    {"id": "G-phone-preview-framing", "category": "mobile", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R02"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Frame the team-select turntable camera on phones so the whole tub sits above the panel. Test: in high/mobile/R02 the bottom of the preview tub's wheels is at least 20 px above the panel's top edge."},
    {"id": "G-water-line-label", "category": "typography", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R04", "high/desktop/R04"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Set the water-line '10' label at 11 CSS px or larger on a tile, or fold the target into the gauge readout ('41 / 10 GAL'). Test: cap height of at least 11 CSS px in high/mobile/R04 (now ~5.5)."},
    {"id": "G-far-baseplate-flat", "category": "materials", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R05", "high/desktop/R06"], "benchmark": "worlds/worlds-1.jpg", "fix": "Use a mip-aware stud normal/AO texture so studs read as a tone pattern at distance, and add plate seams or tiles to flat roofs. Test: sigma at least 3 with a visible stud pattern over high/desktop/R05 x 1150-1270, y 620-700 (now 0.5)."},
    {"id": "G-panel-stud-fit", "category": "ui", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R02", "high/desktop/R01"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Derive the stud count from the panel width with equal end margins, and draw the focus ring outside the stud tops. Test: every stud lies wholly inside its panel outline and no focus-ring pixel crosses a stud."},
    {"id": "G-terrain-crack", "category": "scenery", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R09"], "benchmark": "worlds/worlds-3.jpg", "fix": "Weld the terrain seams or add skirts. Test: no sky-coloured pixel below the horizon in high/desktop/R09 (now 78 px at x 186-207, y 317-322)."}
  ]
}
```
