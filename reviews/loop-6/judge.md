# Judge ruling, loop 6: Spa City Tub Rally (high tier)

## Summary
**Verdict: continue. Judged total 66.0/100, before the tally's A/B rule.** Five categories are below the gate of 7: materials (6.0), scenery (6.5), lighting (6.5), animation (6.0) and readability (6.5). Every measured gate passes:
- perf passes 52 of 52 checks; the lowest proxy is SwiftShader, low tier, phone, at 49.9 fps.
- fidelity is null.
- ip passes, and I confirm it below.

For trend only, the last judged total in `HISTORY.md` was 65.5.

**The four reviews.** Each JSON block sums to the total its prose states:

| Review | Stated total | JSON sum |
|---|---|---|
| Critic A | 66 | 66.0 |
| Codex | 65.5 | 65.5 |
| Prosecutor | 62.0 | 62.0 |
| Advocate | 68.0 | 68.0 |

The critic means the prosecutor quotes are correct and total 65.75. The prosecutor's and the advocate's proposals stay within ±1 of those means.

**No mandatory disputes.** No category has critics more than 1.0 apart, or a prosecutor and advocate more than 1.0 apart. Materials and readability are exactly 1.0 apart, so I checked those anyway.

**A/B pairs.** No void. I spot-checked three pairs against the captures and all are valid:
- In `ab/crop-R03-kart_5`, both panels show the stepped band under the chassis. That band appears only on the high tier (it is absent from `crops/low/R03-kart_5`), so both panels are high tier.
- `ab/high-desktop-R11` and `ab/high-landscape-R02` show the same moment at the named viewport.

Critic disagreement on animation and authenticity is not grounds for a void.

**Calibration.** `calibration.jpg` is a tabletop diorama. It has micro-bevels everywhere, glowing translucent blue tiles with reflections, soft studio light with depth of field, and bounce colour. On the anchors alone I score it materials 9.5 and lighting 9.0.

Measurements below are in each capture's own pixels. I took them with my own crop and luma scripts (luma = 0.2126R + 0.7152G + 0.0722B; "centre" means the middle half of the frame in each dimension).

## Factual disputes, settled on the captures
1. **Firefighter helmet studs: the prosecutor is right.** In the zoom of `crops/high/R15-player`, each helmet carries two round studs on top: the left figure at about x 20–230, y 220–340, and the right figure too. Critic A's "helmets have no studs" and the advocate's concession of it are wrong.
2. **Part breaks: the advocate is right.** `crops/high/R02-preview-captain` shows a neck post between head and torso, and separate bevelled arm blocks with cuffs. `crops/high/R02-preview` shows a separate hip block and split legs on the right-hand crew member. Critic A's "no seams at the neck, shoulder or hip" is wrong. His point about mould lines stands.
3. **Held props: Critic A and the prosecutor are right.** In `crops/high/R02-preview-rear` the towel is a flat white card through the fist. In `crops/high/R04-player` the pink soap sinks into the fist.
4. **Tree canopies.** The canopy tops are studded plates with small specular glints (zoom of `high/desktop/R05`, x 590–880, y 580–800). Critic A's "no studs or specular" is wrong for the tops. The edges are sharp and the side faces matte, and the sides are all the chase camera sees (`high/desktop/R04`). So the advocate's narrowed version of the claim stands.
5. **Dusk lamp pools: the advocate and Codex are right, and the prosecutor's limit is also right.** I get the advocate's 5×5 patch values exactly on `high/desktop/R07`: 183.7 at (793,362), 101.1 at (843,390) and 187.4 at (918,430). `low/desktop/R07` gives 180.0, 97.8 and 185.6. Warm pools sit at the lamp bases on the right sidewalk. The road and the left sidewalk get none (zoom x 0–560, y 280–640). Critic A's "the lamps light nothing" is wrong.
6. **Dusk and sunset dark share.** Critic A's figures are correct:

   | Frame | Centre below luma 40 | Centre mean |
   |---|---|---|
   | `high/desktop/R07` | 21.9% | 67.4 (frame mean 71.5) |
   | `high/desktop/R11` | 13.7% | — |
   | `high/mobile/R07` | 20.5% | — |

   The advocate's share inside the player-kart box also checks out: 30.1% of R07's dark centre pixels and 33.8% of R11's. But his "15.3% / 9.1% excluding that box" keeps the excluded area in the denominator. With the box removed from both numerator and denominator, the share is **18.7% in R07 and 10.6% in R11**. R11 does not pass the "<10%" test.
7. **The stepped grey "smear": the advocate is right about the cause.** It appears in `crops/high/R03-kart_5` (x≈700–960, y≈560–720) during the countdown: `high/desktop/R03` reads "READY" at 0:00.00, so nothing is moving. It is absent from `crops/low/R03-kart_5`, and the low tier draws no shadows. At 2.5× zoom it is a band lighter than its surroundings, stepping in square texels inside the dark chassis shadow. That makes it shadow-map aliasing (WS1), not a steam trail (WS3).
8. **Rival tubs in the pack: the advocate is right for the front rows.** The 3× zoom of `high/desktop/R04` (x 460–780, y 280–480) shows the cowboys' brown barrel, the pink tub and the white tub with their rims. The third row back merges into crews. Critic A's "every pack frame" is overstated. In `high/mobile/R07`, the pink and tie-dye tubs read at dusk.
9. **Landscape minimap: the prosecutor is right that it overlaps, and the overlap is larger than he says.**
   - In `high/landscape/R17` at x=1450, the place tile's fill, bevel and outline run down to y=195. At x=1600, the minimap tile's outline starts at y=184. That is a **12 device px (6 CSS px) overlap**, and the 3× zoom shows the minimap cutting off the place tile's bottom border.
   - The advocate's "abuts with no gap" is wrong.
   - This loop's change note says the minimap "sits lower, clear of the place tile". The pixels contradict it.
   - The water tile touches the LAP tile with no gap.
   - In portrait, the item orb overlaps the place tile (`high/mobile/R04`, `high/mobile/R17`).
10. **Slide feedback.**
    - The prosecutor is right that `high/desktop/R14`, "charging hot steam", shows no charge cue at the tub (zoom x 470–790, y 360–660).
    - The advocate is right that the curb contact in `strips/high/R14` frames 7–8 throws a burst of blue water spheres, and the gauge drops 41 → 39 GAL. The prosecutor's "no reaction" is wrong.
    - Neither of them is wrong that there is no hop and no camera kick.
11. **Smaller claims.**
    - The desktop key-strip type is about 12–13 px: cap height is about 9 px, rows 772–781 of `high/desktop/R04`. "About 10 px" (Critic A, prosecutor) is an underestimate.
    - The desktop team-select panel spans about 50% of the width (`high/desktop/R02`), as the advocate says.
    - Codex's "sparse" trees in `high/desktop/R09` is wrong: the stand is dense but repeated.
    - Codex's "static captures cannot establish frame rate" is wrong: `perf.json` measures the phone floor at 49.9 fps minimum.
    - The prosecutor's 3.26:1 contrast for the locked labels replicates. Those are disabled controls, though, and contrast rules exempt disabled controls, so I don't count it.
    - The lattice tower in `high/desktop/R11` exists, but the near conifer hides most of it (zoom x 380–560, y 0–160). It is not yet a set piece from that camera.
    - From the race camera, the end of Central Avenue is a hill wall with stepped crowns, not the Arlington (zoom of `high/desktop/R04`, x 520–820, y 180–320). The Arlington closes the vista only in the `R06` flyover.

## Rulings by category

**Characters: 7.0** (critics 7.0 and 6.5; prosecutor 6.5; advocate 7.0). This meets the 7 anchor.
- The racers read as original plastic brick toys:
  - printed, expressive faces that hold at 2× (`crops/high/R02-preview-captain`);
  - part breaks at the neck, arms and hips (dispute 2);
  - studded helmets (`crops/high/R15-player`).
- Codex's "tubs lack separate parts" is overruled. `crops/high/R02-preview` shows a rolled rim, claw-foot connectors, a studded chassis plate and hubcapped wheels.
- The teams are distinct at chase distance (`high/desktop/R03`, `high/desktop/R04`, `high/desktop/R12`).
- What keeps it off 7.5:
  - props pass through the fists (`crops/high/R02-preview-rear`, `crops/high/R04-player`);
  - no mould lines.
- The stepped band in the close-ups is a lighting fault (dispute 7), not an asset fault.
- The spectators are lower-grade matte block people (`high/desktop/R15`), but crowds belong to scenery.

**Materials: 6.0** (6.0 and 6.5; prosecutor 5.5; advocate 6.5). Critic A's number is right, though his reasoning about the trees was partly wrong.
- **What reads as plastic:** the racers, the studded verges with shaded studs (`high/desktop/R08`, `high/desktop/R10`, `high/desktop/R11`), the studded canopy tops (`high/desktop/R05`), the bevelled stone-wall bricks (`high/desktop/R04`) and the studded judge plate (`high/desktop/R16`). These keep it above the prosecutor's 5.5.
- **What doesn't:**
  - The 7 anchor asks for clear parts, and nothing in any capture reads as clear:
    - the window panes are opaque with a painted glint (`high/desktop/R13`);
    - the tub water is an opaque plane (`crops/high/R02-preview-captain`);
    - the Gulpha ford is opaque blue tile (`high/desktop/R19`).
  - The facades are brick images on flat walls, and the roofs are flat-shaded (`high/desktop/R05`, `high/desktop/R06`).
  - The landmark lawns are flat noise with no studs (zoom of `high/desktop/R06`, x 0–360, y 400–680).
- Against `worlds-1` (7), where the ground, roofs and windscreens are all parts, this is a full point short.

**Scenery: 6.5** (6.5 and 6.0; prosecutor 6.0; advocate 6.5).
- **For:**
  - Central Avenue is dense and coherent: tiled sidewalks, awnings, fences, crowds and lamp posts (`high/desktop/R03`, `high/desktop/R04`).
  - The courses differ: Goat Rock in a dense mixed stand (`high/desktop/R09`), the terracotta trail (`high/desktop/R10`), the ford (`high/desktop/R19`).
- **Against:**
  - The horizon rings are sheer, crenellated walls from every landmark camera (`high/desktop/R05`, `high/desktop/R06`, `high/desktop/R09`), and they end the race vista (dispute 11).
  - The buildings are textured boxes (`high/desktop/R13`).
  - Hill Wheatley Plaza is a bare disc (`high/desktop/R17`).
  - Near trees fill large parts of the mountain frames: foliage and trunk pixels make up about 28% of `high/desktop/R11`, 17% of `R10` and 16% of `R19` in the near-tree boxes.
- This is not yet `worlds-1` (7).

**Lighting: 6.5** (6.0 and 6.5; prosecutor 6.0; advocate 6.5).
- **Present from the 7 anchor:**
  - a clear key light with cast shadows (`high/desktop/R16`, `high/desktop/R19`);
  - contact shadows under every tub (`high/desktop/R03`);
  - haze graded toward the sky (`high/desktop/R05`, `high/desktop/R11`);
  - three distinct day, dusk and sunset palettes;
  - lamp pools at dusk (dispute 5).
- Critic A's 6.0 leaned on the false "no light pools" claim.
- **Missing:**
  - AO. Nothing darkens at the wall base, the trunk bases or under the canopies (zoom of `high/desktop/R04`, x 0–520, y 300–520).
  - Shadow fidelity. The tree shadows on the road are rounded blobs that ignore the stepped tiers (`high/desktop/R08`, x 680–1280, y 380–800).
  - A lighter dusk. 18.7% of the `R07` centre is still below luma 40 even without the player's kart.

**Animation and feel: 6.0** (6.5 and 6.0; prosecutor 6.0; advocate 6.5).
- **Credit:**
  - The crews circle the tub convincingly with toy-limb swings (`strips/high/R15`, `strips/high/R16`).
  - Spills read as water spheres with a gauge drop (R15: 37 → 36 GAL; R16: 40 → 39 GAL).
  - Boosts now trail steam (`high/desktop/R17`, `high/desktop/R19`).
- **Missing:** two of the three 7-anchor clauses:
  - No strip frame shows camera kick.
  - The tub water plane stays level through the fumble (`strips/high/R15`, `crops/high/R15-player`).
- **The slide reads weakly:**
  - There is no charge cue (`high/desktop/R14`).
  - The steam is tight clusters of 5–7 opaque spheres that keep their size and sit up to a tub-width from the wheels (`strips/high/R14`, frames 3–8, enlarged).
  - The curb hit gives a splash but no hop or camera response (frames 7–8).

**UI / HUD: 7.0** (both critics 7.0; prosecutor 6.5; advocate 7.0). The brief scores the high tier on desktop, and the desktop HUD meets the 7 anchor:
- one slate-tile style for the lap, place, water and minimap readouts, with nothing overlapping (`high/desktop/R04`);
- consistent studded menus (`high/desktop/R01`, `high/desktop/R18`).

The advocate is right that the HUD is context-aware:
- "SEMIFINAL" in `high/desktop/R16`;
- "8 LEFT" and a round radar in `high/desktop/R17`;
- the greyed, hatched Bath icon after the fumble in `high/desktop/R15`.

Still weak: the orb's counter has no label, and the orb floats unframed (`high/desktop/R04`). The phone tile collisions (dispute 9) are real, and I count them under mobile.

**Typography: 7.0** (7.0 and 6.5; prosecutor 6.5; advocate 7.0). The pixel display face and the rounded sans form a clear scale (`high/desktop/R01`, `high/mobile/R01`). "0:07.00" and "8TH" read at a glance at 390 px (`high/mobile/R04`). Nothing is clipped, including the results table at 390 px (`high/mobile/R18`).

The flaws are real but local:
- "The Out- / of- / Towners" breaks over three lines, and "· locked" is orphaned (`high/landscape/R02`).
- The "25 gal" figure stacks above its CLEAN badge in `high/mobile/R18`.
- The desktop sub-labels are small.

**Readability: 6.5** (6.5 and 7.0; prosecutor 6.0; advocate 7.0).
- **For:**
  - The player's tub always stands out with a ring and an arrow (`high/desktop/R04`, `high/mobile/R04`, `high/desktop/R13`).
  - The road edges are clear (`high/mobile/R08`).
  - The front-row rival tubs read (dispute 8).
- **Against the anchor's "every tub … in every frame":**
  - The third row of the pack back merges into crews (`high/desktop/R04`, `high/desktop/R12`).
  - The judge stands half-hidden behind a maroon spectator, and the booth has no sign (zoom of `high/desktop/R16`, x 220–560, y 300–500).
  - The slide has no visual cue (`high/desktop/R14`).
  - Near trees take up to about a quarter of the mountain frames (`high/desktop/R11`).

**Mobile: 7.0** (7.0 and 6.5; prosecutor 6.5; advocate 7.0). The anchor's three tests pass:
- **Thumbs never cover the tub.** In `high/mobile/R04` the ring ends at about y 1115, and the controls start at about y 1425 of 1688. In `high/landscape/R04` the controls sit in the corners.
- **Both orientations are framed on purpose.** In portrait the HUD is at the top, the tub in the middle and the controls at the bottom. In landscape the team select shows the whole preview tub (`high/landscape/R02`).
- **The phone floor holds 30 fps.** The minimum is 49.9 fps (`perf.json`).

The measured tile collisions (dispute 9) and the cramped landscape cards are polish defects at the 7 line, not below it. They are the cheapest fix in the backlog.

**Authenticity: 6.5** (6.5 and 7.0; prosecutor 6.5; advocate 7.0). The gate is 6, so this passes.
- **The Row reads as the Row:**
  - the Fordyce's patterned facade, red roof and skylight (`high/desktop/R05`);
  - the Arlington's twin towers (`high/desktop/R06`);
  - the tiled dome from the race camera (`high/desktop/R14`).
- **The race shows:** gallon gauge, ducks, flags, judge stop and CLEAN results (`high/desktop/R16`, `high/mobile/R18`).
- **What keeps it off 7:**
  - The 7 anchor wants mountains that read as the Ouachitas; they read as walls (`high/desktop/R09`, `high/desktop/R06`).
  - The Arlington doesn't close the race-camera vista (dispute 11).
  - Gulpha Creek is blue paving (`high/desktop/R19`).
  - `R08`, `R10` and `R12` are not nameable.

## IP check
Clean. I confirm the gate.
- **Racers.** Rounded-cuboid heads on a neck post, box torsos, and mitten fists with a thumb (`crops/high/R02-preview-captain`, `crops/high/R15-player`). This is not the minifigure combination.
- **Studs and logos.** The studs are plain, with no lettering. I found no LEGO name or logo in any capture.
- **Spectators.** They wear caps in their shirt colour (zooms of `high/desktop/R03`, x 940–1280, y 330–470, and `high/desktop/R15`, x 0–300, y 380–640). I found no figure with brown hair and a cyan shirt. One spectator in R03 wears a dark royal-blue shirt and cap (sampled (20,58,120) and (21,76,161)). With a cap instead of hair and a darker blue, it does not resemble the character the change note refers to.

No reviewer reported an IP hit.

## Ranked gaps
Ranked by expected gain ÷ effort (S = 1, M = 2, L = 4).

**Merges and corrections:**
- **Merged:**
  - `G-facade-relief-glass` (A) + `G-surface-consistency` (Codex) → `G-facade-relief`.
  - `G-slosh-kick` (A) + `G-action-feedback` (Codex) + the impact half of `G-slide-cue-impact` (prosecutor) → `G-camera-kick-slosh`.
  - `G-steam-beads` + the charge half of `G-slide-cue-impact` → `G-slide-steam-feedback`.
  - `G-hud-orb-tile` + `G-hud-tile-collisions` → `G-hud-tile-collisions`.
  - `G-steam-smear` + `G-shadow-fidelity` → `G-shadow-texels`.
- **Causes corrected:**
  - The steam smear is shadow aliasing (WS1).
  - The dusk lamp pools already exist; what's missing is light on the road.
  - The tree canopies need edge bevels only.
  - Part breaks already exist, so the character gap is the grip only.
  - Codex's `G-part-construction` is overruled (see Characters).

| # | Gap | Category | Effort | Gain |
|---|---|---|---|---|
| 1 | `G-dusk-road-light` | lighting | S | +0.3 |
| 2 | `G-shadow-texels` | lighting | S | +0.3 |
| 3 | `G-near-tree-cull` | readability | S | +0.3 |
| 4 | `G-hud-tile-collisions` | mobile | S | +0.3 |
| 5 | `G-slide-steam-feedback` | animation | M | +0.5 |
| 6 | `G-camera-kick-slosh` | animation | M | +0.5 |
| 7 | `G-clear-parts` | materials | M | +0.5 |
| 8 | `G-ambient-occlusion` | lighting | M | +0.5 |
| 9 | `G-horizon-slopes` | scenery | M | +0.5 |
| 10 | `G-canopy-bevels` | materials | S | +0.2 |
| 11 | `G-judge-booth` | readability | S | +0.2 |
| 12 | `G-facade-relief` (**big lever**) | materials | L | +0.8 |

1. **`G-dusk-road-light`** (lighting, WS1, S, +0.3)
   - Problem: the lamp pools reach only the right sidewalk, and the road and left sidewalk stay dark (`high/desktop/R07`, `high/mobile/R07`).
   - Fix: put a warm additive ellipse decal (about 6 × 4 m, fading to zero at the rim) under every dusk lamp, reaching into the near lane, and lift the dusk hemisphere ground colour.
   - Test: the R07 centre has ≤ 12% of pixels below luma 40 with the player-kart box (525,395)–(750,600) removed from numerator and denominator (18.7% now), and the road shows a lit ellipse with peak luma ≥ 90 beside at least two lamps.
2. **`G-shadow-texels`** (lighting, WS1, S, +0.3)
   - Problem: a stepped light band sits in the chassis shadow (`crops/high/R03-kart_5`, `crops/high/R04-player`), and the stepped conifers cast blob shadows on the road (`high/desktop/R08`).
   - Fix: on high, fit the directional shadow frustum tightly to the chase area (and to the target for close-up cameras), use a 4096 map or a near cascade, and set the normal bias.
   - Test: no stepped band in `crops/high/R03-kart_5`, and the tier edges show in the R08 road shadows.
3. **`G-near-tree-cull`** (readability, WS5, S, +0.3; also helps scenery)
   - Problem: a single near tree fills about 28% of `high/desktop/R11`, 17% of `R10` and 16% of `R19`.
   - Fix: dither-fade or cull tree instances within 8 m of the camera or inside a 25° cone around the camera-to-tub line, and widen the setback on the mountain courses.
   - Test: no single tree covers more than 8% of R08, R10, R11 or R19.
4. **`G-hud-tile-collisions`** (mobile, WS6, S, +0.3)
   - Problem: in landscape the minimap overlaps the place tile by 12 device px, and the water tile touches the LAP tile (`high/landscape/R17`, `high/landscape/R04`). In portrait the orb overlaps the place tile (`high/mobile/R04`, `high/mobile/R17`). The orb's counter has no label.
   - Fix: lay out the corner tiles in flex columns with a gutter of at least 8 CSS px, give the orb its own slot, and label the counter.
   - Test: a DOM bounding-rect check at 390×844 and 844×390 reports zero intersections between HUD tiles.
5. **`G-slide-steam-feedback`** (animation, WS3, M, +0.5)
   - Problem: no charge cue (`high/desktop/R14`), and the steam is fixed-size opaque sphere clusters detached from the wheels (`strips/high/R14` frames 3–8, `high/desktop/R17`, `high/desktop/R19`).
   - Fix: add a tier-coloured glow and spark burst at the rear wheels while a slide charges. Spawn soft, alpha-faded puffs at the rear-wheel contact that grow 2–3× and fade out over about 0.5 s.
   - Test: the R14 frame shows a cue within 40 px of the rear wheels, and in the strip a puff's radius rises while its opacity falls.
6. **`G-camera-kick-slosh`** (animation, WS3, M, +0.5)
   - Problem: no camera kick in any strip frame, no hop or stumble at the curb hit (`strips/high/R14` frames 7–8), and the water plane stays level (`strips/high/R15`, `crops/high/R15-player`).
   - Fix: add a 100–150 ms camera shake (at least 4 px at 1280×800) on a fumble, a curb or fence hit, and a slide release. Tilt the water plane up to about 10° against acceleration with a damped spring and a small wave. Play a crew stumble on curb contact.
   - Test: the hit frame shows a camera offset, and the water angle differs between frames 2 and 5 of R15.
7. **`G-clear-parts`** (materials, WS1, M, +0.5)
   - Problem: nothing is clear. The panes, the tub water, the Gulpha ford and the bubbles are opaque (`high/desktop/R13`, `crops/high/R02-preview-captain`, `high/desktop/R19`, `high/desktop/R17`).
   - Fix: one shared translucent-plastic material (opacity 0.5–0.7, Fresnel rim, sky reflection) for panes, tub water and the ford, with stones on the ford bed.
   - Test: stones visible under the ford in R19, the tub floor visible through the water in the captain close-up, and the R13 panes show a sky gradient instead of a stripe.
8. **`G-ambient-occlusion`** (lighting, WS1, M, +0.5)
   - Problem: no AO at the wall base, the trunk bases, under the canopies or at spectators' feet (`high/desktop/R04`, `high/desktop/R03`).
   - Fix: stateless SSAO on high (the protocol allows it: no temporal history), or baked vertex AO on walls, kerbs, trunks and spectator feet.
   - Test: in R04, sidewalk luma within 10 px of the wall base is at least 15% below the luma 40 px away.
9. **`G-horizon-slopes`** (scenery, WS4, M, +0.5; also helps authenticity)
   - Problem: the rings are sheer, flat-topped walls with stepped crowns (`high/desktop/R05`, `high/desktop/R06`, `high/desktop/R09`), and they end the Central Avenue vista (`high/desktop/R04`).
   - Fix: replace each ring's vertical face with 3–4 receding setbacks of sloped plates, each step carrying the tree line, so the profile rises at 45° or less.
   - Test: from the R05, R06 and R09 cameras, no continuous vertical ring face is taller than 60 px, and the ridges read as stepped wooded hills.
10. **`G-canopy-bevels`** (materials, WS5, S, +0.2)
    - Problem: the canopy tops are already studded (`high/desktop/R05`), but the plate edges are sharp and the side faces matte, which is all the chase camera sees (`high/desktop/R04`, `high/desktop/R12`).
    - Fix: bevel the plate edges (2–3%) and give the canopies the figures' gloss.
    - Test: an R04 canopy crop shows edge highlights at least 30 luma brighter than the face.
11. **`G-judge-booth`** (readability, WS4, S, +0.2; also helps authenticity)
    - Problem: the booth is a blank white box, and the judge stands half-hidden behind a spectator (`high/desktop/R16`, `strips/high/R16`).
    - Fix: a brick booth with a JUDGE sign and a flag, with the judge standing in front of the crowd line facing the road.
    - Test: R16 shows the judge's full figure and a readable sign.
12. **`G-facade-relief`** (materials, WS4, L, +0.8 across materials and scenery). **Big lever.** This is the main thing holding materials back, because facades and roofs are the largest surfaces in most race frames.
    - Problem: the Row and downtown facades are brick images on flat walls, with flat-shaded roofs (`high/desktop/R13`, `high/desktop/R05`, `high/desktop/R06`).
    - Fix: on the near LOD, add brick-course relief (bevelled courses, or a normal map with grout depth). Recess the panes 0.2–0.3 m behind the modelled surrounds, using `G-clear-parts`' material. Build the roofs from tiled plates with bevel highlights.
    - Test: in R13 the brick courses show lit and shadowed edges and the window reveals cast shadows; the R05 roofs show tile rows.

**Dropped below the top 12:**
- the held-prop grip (characters, S, +0.2);
- studded baseplate lawns (materials, M, +0.3);
- tub rim lights for the deep pack (readability, M, +0.3);
- course set pieces (authenticity, L);
- plaza props;
- the touch-control style;
- the landscape team-card wrap;
- spectator finish;
- forest variety.

```json
{
  "loop": 6,
  "role": "judge",
  "tier": "high",
  "scores": {
    "characters": {
      "score": 7.0,
      "confidence": 0.75,
      "evidence": [
        { "shot": "crops/high/R02-preview-captain", "note": "printed expressive face holds at 2x; neck post and separate cuffed arm blocks (part breaks present)" },
        { "shot": "crops/high/R15-player", "note": "each firefighter helmet carries two studs on top (zoom); Critic A and the advocate's concession were wrong" },
        { "shot": "crops/high/R02-preview", "note": "tub = rolled rim + claw-foot connectors + studded chassis plate + hubcapped wheels; hip block and split legs on the crew" },
        { "shot": "crops/high/R02-preview-rear", "note": "towel is a flat card passing through the fist; soap also sinks into the fist in crops/high/R04-player" },
        { "shot": "high/desktop/R03", "note": "firefighters, cowboys, pink, white and navy teams distinct at chase distance" }
      ]
    },
    "materials": {
      "score": 6.0,
      "confidence": 0.75,
      "evidence": [
        { "shot": "high/desktop/R13", "note": "facades are brick images on flat walls; window panes opaque blue with a painted glint" },
        { "shot": "high/desktop/R06", "note": "landmark lawn flat noise with no studs (zoom x 0-360, y 400-680); roofs flat-shaded" },
        { "shot": "high/desktop/R19", "note": "Gulpha ford is opaque blue tile: no clear part anywhere in the captures" },
        { "shot": "high/desktop/R05", "note": "canopy tops are studded plates with glints (zoom x 590-880, y 580-800), edges unbevelled" },
        { "shot": "crops/high/R02-preview-captain", "note": "racers convincing ABS; tub water an opaque plane" },
        { "shot": "high/desktop/R08", "note": "studded verge with shaded studs near the camera" }
      ]
    },
    "scenery": {
      "score": 6.5,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "dense coherent street: tiled sidewalk, awnings, fences, crowds; vista ends in a crenellated hill wall" },
        { "shot": "high/desktop/R09", "note": "Goat Rock prisms in a dense but repeated forest; horizon is a sheer wall" },
        { "shot": "high/desktop/R06", "note": "mountain ring a flat green wall beside the Arlington" },
        { "shot": "high/desktop/R13", "note": "buildings are textured boxes" },
        { "shot": "high/desktop/R11", "note": "near conifer fills about a quarter of the frame and hides the lattice tower" }
      ]
    },
    "lighting": {
      "score": 6.5,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R07", "note": "21.9% of the centre below luma 40 (18.7% with the player-kart box removed from numerator and denominator); lamp pools on the right sidewalk 184/101/187, none on the road" },
        { "shot": "high/desktop/R11", "note": "13.7% of the centre below luma 40 (10.6% excluding the player box); warm haze matched to the sky" },
        { "shot": "high/desktop/R04", "note": "no AO at the wall base, trunk bases or under canopies (zoom x 0-520, y 300-520)" },
        { "shot": "high/desktop/R08", "note": "road shadows are rounded blobs that ignore the stepped tree tiers" },
        { "shot": "high/desktop/R03", "note": "contact shadows ground every tub; clear key light" }
      ]
    },
    "animation": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "strips/high/R14", "note": "steam is fixed-size opaque sphere clusters off the wheels (frames 3-8); curb hit throws a water burst, gauge 41 to 39, but no hop or camera kick (frames 7-8)" },
        { "shot": "strips/high/R15", "note": "crew circle with toy-limb swings; water spheres burst out; water plane stays level; no camera kick" },
        { "shot": "strips/high/R16", "note": "crew circle while the task bar fills; spill spheres; gauge 40 to 39" },
        { "shot": "high/desktop/R14", "note": "the 'charging hot steam' frame shows no charge cue at the tub" },
        { "shot": "high/desktop/R17", "note": "boost trails orange steam balls" }
      ]
    },
    "ui": {
      "score": 7.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "lap, place, water and minimap on matching slate tiles, nothing overlapping on desktop; orb unframed, counter unlabelled" },
        { "shot": "high/desktop/R17", "note": "context-aware: 8 LEFT tile, round arena radar, x3 item badge, slate callout plate" },
        { "shot": "high/desktop/R16", "note": "SEMIFINAL tile and studded judge-task panel" },
        { "shot": "high/desktop/R18", "note": "clean results on a studded panel; menus consistent with high/desktop/R01" }
      ]
    },
    "typography": {
      "score": 7.0,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/mobile/R04", "note": "0:07.00 and 8TH read at a glance at 390 px" },
        { "shot": "high/mobile/R18", "note": "results legible at 390 px, nothing clipped; 25 gal stacks above its CLEAN badge" },
        { "shot": "high/desktop/R01", "note": "pixel display face and rounded sans form a clear scale" },
        { "shot": "high/landscape/R02", "note": "'The Out- / of- / Towners' breaks over three lines; locked label orphaned" }
      ]
    },
    "readability": {
      "score": 6.5,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "front-row rival tubs read (zoom x 460-780, y 280-480); third row back merges into crews; player ring and arrow stand out" },
        { "shot": "high/mobile/R07", "note": "pink and tie-dye rival tubs read at dusk; player ring clear" },
        { "shot": "high/desktop/R16", "note": "judge half hidden behind a maroon spectator; booth has no sign" },
        { "shot": "high/desktop/R11", "note": "near conifer fills about a quarter of the frame" },
        { "shot": "high/mobile/R08", "note": "road edges and player ring clear through the bend" }
      ]
    },
    "mobile": {
      "score": 7.0,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/mobile/R04", "note": "ring ends ~y 1115, controls start ~y 1425 of 1688; item orb overlaps the place tile" },
        { "shot": "high/landscape/R17", "note": "minimap tile overlaps the place tile by 12 device px (outline from y 184 at x=1600 vs place tile to y 195 at x=1450); water tile touches the LAP tile" },
        { "shot": "high/landscape/R04", "note": "controls in the corners, tub centred; same tile overlap" },
        { "shot": "high/landscape/R02", "note": "whole preview tub visible beside the narrower panel; cramped cards" }
      ]
    },
    "authenticity": {
      "score": 6.5,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R05", "note": "Fordyce patterned facade, red roof and skylight recognisable" },
        { "shot": "high/desktop/R06", "note": "Arlington twin towers, but only from the flyover; the ridge behind is a wall" },
        { "shot": "high/desktop/R16", "note": "judge stop, Rules of the Row heat, duck, flag, gallon gauge" },
        { "shot": "high/desktop/R09", "note": "ridges read as crenellated walls, not the Ouachitas" },
        { "shot": "high/desktop/R19", "note": "Gulpha Creek reads as blue paving" }
      ]
    }
  },
  "ip": {
    "clean": true,
    "notes": "Racers: rounded-cuboid heads on a neck post, box torsos, mitten fists with a thumb (crops/high/R02-preview-captain, crops/high/R15-player). Studs plain, no LEGO name or logo. Spectators wear shirt-coloured caps (zooms of high/desktop/R03 and R15); no brown-hair cyan-shirt figure; one dark royal-blue capped spectator in R03 does not resemble the referenced character."
  },
  "gaps": [
    { "id": "G-dusk-road-light", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/mobile/R07", "low/desktop/R07"], "benchmark": "worlds-4", "fix": "Lamp pools reach only the right sidewalk (luma 184/101/187 at (793,362), (843,390), (918,430)); add a warm additive ellipse decal (~6 x 4 m, fading to 0 at the rim) under every dusk lamp reaching into the near lane, and lift the dusk hemisphere ground colour. Test: R07 centre below luma 40 <= 12% with the player-kart box (525,395)-(750,600) removed from numerator and denominator (18.7% now), and a lit ellipse with peak luma >= 90 on the road beside at least two lamps." },
    { "id": "G-shadow-texels", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["crops/high/R03-kart_5", "crops/high/R04-player", "crops/low/R03-kart_5", "high/desktop/R08"], "benchmark": "drive-4", "fix": "The stepped light band inside the chassis shadow appears at the countdown (nothing moving) and is absent on the shadowless low tier, so it is shadow-map aliasing, not steam; the same coarse map turns stepped conifers into blob road shadows in R08. On high, fit the directional shadow frustum to the chase area (and to the target for close-up cameras), use a 4096 map or a near cascade, and set normal bias. Test: no stepped band in crops/high/R03-kart_5; stepped tier edges visible in the R08 road shadows." },
    { "id": "G-near-tree-cull", "category": "readability", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R11", "high/desktop/R10", "high/desktop/R19", "high/desktop/R08"], "benchmark": "drive-3", "fix": "Single near trees fill ~28% of R11, ~17% of R10 and ~16% of R19 (foliage and trunk pixels in the near-tree box). Dither-fade or cull tree instances within 8 m of the camera or inside a 25-degree cone around the camera-to-tub line, and widen the mountain-course setback. Test: no single tree covers more than 8% of R08, R10, R11 or R19." },
    { "id": "G-hud-tile-collisions", "category": "mobile", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R17", "high/landscape/R04", "high/mobile/R04", "high/mobile/R17"], "benchmark": "drive-3", "fix": "Landscape minimap overlaps the place tile by 12 device px (outline from y 184 at x=1600; place tile runs to y 195 at x=1450) despite the change note; water tile touches the LAP tile; portrait orb overlaps the place tile; orb counter unlabelled. Lay the corner tiles out in flex columns with a >= 8 CSS px gutter, give the orb its own slot and label its counter. Test: a DOM bounding-rect check at 390x844 and 844x390 reports zero intersections between HUD tiles." },
    { "id": "G-slide-steam-feedback", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["high/desktop/R14", "strips/high/R14", "high/desktop/R17", "high/desktop/R19"], "benchmark": "drive-3", "fix": "Add a tier-coloured glow and spark burst at the rear wheels while a slide charges, and replace the fixed-size opaque steam spheres with soft alpha-faded puffs spawned at the rear-wheel contact that grow 2-3x and fade out over ~0.5 s. Test: the R14 frame shows a cue within 40 px of the rear wheels; in strips/high/R14 a puff's radius rises and its opacity falls across consecutive frames." },
    { "id": "G-camera-kick-slosh", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R15", "strips/high/R14", "crops/high/R15-player"], "benchmark": "drive-3", "fix": "Add a 100-150 ms camera shake (>= 4 px at 1280x800) on fumble, curb or fence hit and slide release; tilt the tub water plane up to ~10 degrees against acceleration with a damped spring and a small wave; play a crew stumble on curb contact. Test: the hit frame in a strip shows a camera offset, and the water-plane angle differs between strips/high/R15 frames 2 and 5." },
    { "id": "G-clear-parts", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R13", "crops/high/R02-preview-captain", "high/desktop/R19", "high/desktop/R17"], "benchmark": "worlds-1", "fix": "Add one shared translucent-plastic material (opacity 0.5-0.7, Fresnel rim, sky-colour reflection) for window panes, tub water and the Gulpha ford, with stones on the ford bed. Test: stones visible under the ford in R19, the tub floor visible through the water in crops/high/R02-preview-captain, and R13 panes show a sky gradient instead of a painted stripe." },
    { "id": "G-ambient-occlusion", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R04", "high/desktop/R03"], "benchmark": "worlds-4", "fix": "Add stateless SSAO on high (no temporal history, as the protocol requires) or baked vertex AO on walls, kerbs, trunks and spectator feet. Test: in R04 the sidewalk luma within 10 px of the stone-wall base is >= 15% below the luma 40 px away." },
    { "id": "G-horizon-slopes", "category": "scenery", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06", "high/desktop/R09", "high/desktop/R04"], "benchmark": "drive-5", "fix": "Replace each horizon ring's vertical face with 3-4 receding setbacks of sloped plates, each step carrying the tree line, so the profile rises at <= 45 degrees (also helps the Ouachitas read for authenticity). Test: from the R05, R06 and R09 cameras no continuous vertical ring face is taller than 60 px, and the ridges read as stepped wooded hills." },
    { "id": "G-canopy-bevels", "category": "materials", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R04", "high/desktop/R12", "high/desktop/R05"], "benchmark": "worlds-1", "fix": "Canopy tops are already studded with glints; bevel the plate edges (2-3%) and give canopies the figures' gloss so the side views the chase camera sees catch the key light. Test: an R04 crop of the left canopies shows edge highlights >= 30 luma above the face." },
    { "id": "G-judge-booth", "category": "readability", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R16", "strips/high/R16"], "benchmark": "worlds-1", "fix": "Build the judge booth from bricks with a JUDGE sign and flag, and stand the judge in front of the crowd line facing the road (also helps authenticity). Test: R16 shows the judge's full figure and a readable sign." },
    { "id": "G-facade-relief", "category": "materials", "expectedGain": 0.8, "severity": 4, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R13", "high/desktop/R05", "high/desktop/R06"], "benchmark": "worlds-1", "fix": "BIG LEVER (materials and scenery). On the near LOD of Row and downtown buildings, add brick-course relief (bevelled courses or a normal map with grout depth), recess window panes 0.2-0.3 m behind the modelled surrounds using G-clear-parts' material, and build roofs from tiled plates with bevel highlights. Test: in R13 brick courses show lit and shadowed edges and window reveals cast visible shadows; the R05 roofs show tile rows." }
  ],
  "calibration": { "materials": 9.5, "lighting": 9.0 },
  "drift": false,
  "verdict": "continue"
}
```
