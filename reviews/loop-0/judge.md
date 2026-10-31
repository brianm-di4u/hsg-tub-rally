# Judge ruling: loop 0 (high tier)

**Total 48.0 / 100. Verdict: continue.** Only authenticity (6.0) meets its gate. The other nine sit 1.5–3.0 points below 7.
For comparison: critic mean 47.75 (Claude 48.5, Codex 47.0), prosecutor 43.0, advocate 51.0. This is the pre-campaign
N64-era build, and every reviewer agrees on that. The disputes are about how far below anchor 5 it sits, plus a handful of
misread captures, which I settled by opening the frames myself (zoomed, and pixel-sampled where a number decides it).
Capture paths are relative to `games/Cart Racing/screenshots/review-loop-0/`.

## Disputed facts: what the captures show
| Claim | Checked | Ruling |
|---|---|---|
| Rival crewman clips inside the purple tub (Claude) | `crops/high/R04-kart_3`, zoomed 2× | **Advocate right.** The navy-capped figures are drawn behind the teal-crowned pusher and the yellow captain. Their fists rest on a white, blue-banded rim, which belongs to the adjacent Bubble Patrol tub (its duck and grey wheel sit at the right). The occlusion order is consistent, so nothing clips. Dropped as clipping evidence; the tubs do run nearly touching. |
| Captain buried behind the rim (Claude) | `crops/high/R02-preview` vs `crops/high/R02-preview-captain` | **Advocate right.** In R02-preview the captain's head and cap clear the rim. The R02-preview-captain camera sits inside the tub wall, so this is a capture-rig artifact and the seat fix is dropped. The captain is faceless in both. |
| Water sloshes in R16 (advocate) vs "no visible slosh" (Claude) | `strips/high/R16`, tub tiled at 8×, cyan line fitted per frame | **Advocate right on the fact, wrong on the detail.** The water ring is level in frames 1–3 and 6–8. In frame 4 it tilts diagonally across the captain, and more steeply in frame 5 (fitted slope 0.01 → 0.12 → 0.23 → 0.01), while the tub stands still. That is one tilt event in one direction, not "one way, then the other, then again". In `strips/high/R14` the water band also goes diagonal in frames 4–7, partly confounded by camera roll. |
| Warm shopfront glow at dusk in R07 (advocate) | `high/desktop/R07` sampled | **Both partly right.** The band along the left shopfronts measures luma 135 against a facade of 27–36 and a road of 31 (the day road is 86), so it ignores the dusk grade and works as a warm glow element. The windows above it are dark and the lamp globes are unlit grey (luma 104 vs sky 98), so Claude's "no lit windows, no light pools" stands. |
| Plaza is empty (Claude) | `high/desktop/R17` vs `high/landscape/R17` | **Advocate right on the fact.** Landscape shows a centrepiece at the left edge: a grey stone drum with blue-topped blocks on a raised brick ring. The desktop frame leaves it out, so Claude described the desktop frame accurately. |
| Results table is serif (Codex) | `high/desktop/R18`, zoomed 2.5× | **Advocate right.** The table is a humanist sans, the same family as the buttons. |
| SCRUB! callout sits on the landmark (Claude) | `high/desktop/R05`, `R06` at 0:00.02 | **Advocate right.** These are race-start frames shot from a landmark camera, and the GO callout belongs at screen centre. It is not a placement defect. |
| Steam exists in the build (advocate) | `high/desktop/R17`, zoomed 3× | **True, but it is a small lilac item puff behind the captain's head under HOT STEAM!.** It does not appear in the power-slide strip, so it earns no slide-feedback credit. |
| No crew contact shadow (prosecutor) | `crops/high/R04-player`, `crops/high/R15-player` sampled | **Prosecutor right.** Luma under the crew's feet is 65 against 62 (R04) and 65 against 64 (R15) on open road, while the tub octagon measures 41 and 45. |
| Two cowboy-hat teams read as one (prosecutor) | `high/desktop/R09` | **Prosecutor right on the hats.** The player and the bottom-right rival wear identical brown cowboy hats and pale shirts with braces. The rival's light-blue tub is partly visible, so "tubs hidden" overstates it. |
| Flat salmon sun disc on low tier (prosecutor) | `low/desktop/R11` | **Confirmed.** A giant unblended semicircle fills the sky. It is low tier only, so no high-tier score moves. |

## Category rulings
**Characters 4.0** (critics 4.0 / 3.5; prosecutor 3.5; advocate 4.5)
- Scores between anchors 3 and 5, a notch below the advocate. Figures are faceless faceted-sphere heads on box torsos with cube hands, and the wheels are 8-sided pie-wedge prisms (`crops/high/R03-player`).
- Team identity comes from colour, hat, tub, wheel and flag together (`crops/high/R03-kart_1`, `crops/high/R03-kart_5`). That lifts it clear of anchor 3.
- The close-ups do not hold up. Two crew pairs share one space on both sides of `crops/high/R15-player`, and Steam Rangers and Suds Posse are indistinguishable by hat (`high/desktop/R09`).
- The prosecutor's 3.5 leaned on two close-up failures that turned out to be wrong (kart_3 clipping, buried captain). The advocate's 4.5 ignores the confusable teams.

**Materials 4.0** (4.5 / 3.5; prosecutor 3.5; advocate 4.5)
- The models read at anchor 5: lit facet shading with no specular, bevel, stud or seam (`crops/high/R02-preview`, `crops/high/R04-player`). The advocate is right that this is not "flat unlit".
- The textures read at anchor 3. Asphalt in `crops/high/R04-player` is low-texel smear, and the water is an opaque cyan plane with nothing transparent (`crops/high/R15-player`). The painted crowd sprites are a different style from the models (`crops/high/R03-kart_5`).
- The blotchy Arlington in `high/desktop/R06` comes from the 384×240 render, not the texture. The native-resolution `crops/high/R03-kart_1` holds its window rows, so the advocate is right on the cause. It is still what players see, though, so it counts.

**Scenery 4.5** (4.5 / 4.5; prosecutor 4.0; advocate 4.5)
- This is anchor 5 word for word: a coherent low-poly town, not brick-built, with sprite trees and crowds (`high/desktop/R04`, `high/desktop/R12` with its identical oak row).
- Against it: the grass slab across the road (`high/desktop/R08`, `high/mobile/R08`) and the world-versus-figure style clash the prosecutor names (`crops/high/R03-kart_5`).
- Offsetting that: each course has its own palette and set pieces (`high/desktop/R05`, `R06`, `R09`, `R10`, the brick plaza of `high/landscape/R17`). That keeps it at 4.5 rather than the prosecutor's 4.0.

**Lighting 4.5** (4.5 / 4.5; prosecutor 4.0; advocate 4.5)
- Anchor 5 elements are present: a directional key, fog, and a hard octagon blob under each tub.
- The crew have no contact shadow at all (measured above, `crops/high/R04-player`).
- `high/desktop/R07` has a hard seam between the flat upper sky and the cloud band (Codex right) and unlit lamp globes. It does have one deliberate warm dusk accent (the shopfront band).
- In `high/desktop/R11` the sunset stays in the sky. The foreground trees measure 58,85,32 against 72,90,44 at noon in `R10`, so they get darker but no warmer.
- The prosecutor's sprite-grade point is right, but the dusk accent balances it, so I hold 4.5.

**Animation 4.5** (4.0 / 4.5; prosecutor 3.5 vs advocate 5.0, a disagreement over 1.0)
- **Neither side is right.** Run cycles exist: stride poses change through `strips/high/R14` and `strips/high/R15`. Water sloshes (R16 frames 4–5, R14 frames 4–7) and the gauge spills from 41 to 39 GAL in R14. The crew really do circle the tub in `strips/high/R15`. So the prosecutor's "anchor 3" for R14 and R16 is wrong.
- Feedback is near-absent, though. R14's "charging hot steam" slide shows no steam, spark, skid mark or FOV kick in any of its 8 frames. In `strips/high/R16` the crew hold push formation for all 8 frames under a banner saying they circle the tub. A rival also passes through the camera's near plane in frames 3–8.
- The advocate's steam credit belongs to an item in R17, not to slide feedback.
- Net: anchor 5 (run cycles, weak feedback), with slosh and circling credit offset by the R16 mismatch. The critic mean is closest.

**UI / HUD 5.5** (5.5 / 5.5; prosecutor 5.0; advocate 6.0)
- For: one consistent system with a clear race hierarchy (`high/desktop/R04`), and an item row that shows live state (the Bath icon greys out in `high/desktop/R15`).
- Charges I dropped: SCRUB! over the landmark (a capture artifact) and the HUD under results, which is dimmed and acceptable.
- Charges that stand:
  - No team or tub preview on desktop or portrait (`high/desktop/R02`, `high/mobile/R02`).
  - "1 laps" (`high/desktop/R18`).
  - Three unrelated callout styles: pixel-gradient READY/SCRUB!, a teal pill HOT STEAM! in `R17`, a framed blue banner in `high/desktop/R16`. The prosecutor is right here.
  - Nothing belongs to a brick world, which anchor 7 requires.

**Typography 5.5** (5.5 / 6.0; prosecutor 5.0; advocate 6.0)
- The pixel display face plus the humanist sans form a clear two-face scale with character (`high/mobile/R01`, `high/desktop/R18`). Codex's "serif" was a misread.
- The HUD zeros carry an interior slash, so "0:00.00" (`high/desktop/R03`, zoomed 5×) and "1:01.00" (`high/mobile/R18`) read as 8s next to "8TH". That fails "numerals read at a glance".
- The subtitle's offset shadow prints a ghost duplicate line (`high/desktop/R01`, `high/mobile/R01`).
- I charge landscape clipping to mobile so it is not counted twice.

**Readability 5.5** (5.5 / 5.5; prosecutor 5.0; advocate 5.5)
- For: the player's tub is centred and distinct, item orbs glow (`high/desktop/R10`, `high/desktop/R17`), and paved roads have strong edge lines (`high/mobile/R04`).
- Against:
  - Packs fuse. A lime crewman stands inside the player's crew in `high/desktop/R12`, and Out-of-Towners interleave with Bubble Patrol in `high/desktop/R11`.
  - The grass slab crosses the road in `high/mobile/R08`.
  - The dirt verge matches the road in `high/desktop/R09`.
  - The black crew sit on a near-black road in `high/mobile/R07`.
  - The judge stop has no judge (`high/desktop/R16`).
- Items and the player's tub do read, so the prosecutor's 5.0 isn't warranted.

**Mobile 4.0** (4.5 / 3.5; prosecutor 3.5; advocate 4.5)
- Portrait is designed for the phone: `high/mobile/R01`, `R02` and `R18` fit complete, and the controls stay below the tub (`high/mobile/R04`).
- The phone proxies hold 30 fps: SwiftShader low/mobile minimum 93 fps, and 133 fps minimum under 4× CPU throttle. Codex was wrong to leave this uncredited.
- Landscape hides primary actions in all three menus (`high/landscape/R01`, `R02`, `R18`). That is a blocker, not "cramped", so Claude and the advocate are too generous.
- In landscape the controls sit high, and Brake covers an orb (`high/landscape/R17`). The Steer pill is faint over the road (`high/mobile/R04`).

**Authenticity 6.0** (all four at 6.0, accepted)
- For:
  - The Arlington closes Central Avenue (`crops/high/R03-kart_1`, `high/desktop/R06`).
  - The Fordyce facade and awning read (`high/desktop/R05`).
  - The Medical Arts tower appears (`crops/high/R03-player`).
  - The water line, ducks, flags and five-person crews are all there.
- Missing:
  - No judges (`high/desktop/R16`).
  - No Goat Rock or ford (`high/desktop/R09`).
  - Bridge Street is generic (`high/desktop/R13`).
  - A pale band stands where Ouachita ridges should be.
  - Nothing is in brick form.
- Meets its gate.

## IP
**Clean.** Heads are faceted spheres (not cylinders), hands are cubes (not C-shapes) and torsos are rectangular boxes (not
trapezoids) (`crops/high/R03-player-rear`, `crops/high/R02-preview`). There is no LEGO name or logo in the menus, HUD or
scenes (`high/desktop/R01`, `R02`, `R18`). No reviewer reported a hit. The risk arrives with the figure rebuild in
G-brick-figures, so re-run the IP gate on the new figures in loop 1.

## Ranked gaps (top 12, by expected gain ÷ effort; ties broken by severity)
**Big lever: G-brick-figures (#4).** The player's crew and tub fill the centre of every gameplay frame and every
close-up. Characters is the furthest category below its gate (with materials), and materials can only be proved on
bevelled, seamed, studded parts. Land WS1's plastic material (#5) on the new figure parts first, so the loop-1
close-ups test both at once.

1. **G-landscape-overflow** (mobile, WS6, S, sev 5, +1.0). Landscape panels must fit 844×390 (detail in the JSON). Also helps typography's "nothing clipped".
2. **G-render-res** (materials, WS1, S, sev 4, +1.0). Render the high tier at ≥960 px wide instead of "Authentic 240". This removes the R06 blotch, the stair-stepped canopies and some pack fusion (about +0.5 materials and +0.5 readability). Recheck perf.
3. **G-contact-shadows** (lighting, WS1, M, sev 4, +1.5). Soft tub and figure contact shadows, AO, emissive dusk lamps with pools, sprites graded like meshes, sky seam removed. Merges G-lighting-ao, G-grounding-and-sky and G-sprite-grade.
4. **G-brick-figures** (characters, WS2, L, sev 5, +2.5). **The big lever.** Original brick figures with printed faces, a unique hat per team, tubs built from brick parts, and a crew-separation constraint. Merges G-original-toys, G-crew-integrity, G-team-silhouettes and the crew half of G-pack-separation. The captain-seat item is dropped (camera artifact).
5. **G-abs-material** (materials, WS1, L, sev 5, +2.0). Plastic material, bevels, near studs, brick palette, transparent water. Merges G-plastic-response.
6. **G-brick-world** (scenery, WS4, L, sev 5, +2.0). Baseplate, tile roads, brick courses and dimensional windows on the landmarks, brick street furniture. Merges G-world-construction.
7. **G-terrain-road-intrusion** (readability, WS4, S, sev 4, +0.5). Clamp terrain under the R08 switchback. Merges G-road-intersection.
8. **G-ring-around** (animation, WS3, S, sev 4, +0.5). Reuse the existing fumble circling at judge stops and keep rivals out of the near plane. Merges the R16 half of G-action-feedback.
9. **G-slide-steam** (animation, WS3, M, sev 4, +1.0). Steam plume grows with charge, skid marks, FOV kick on release. Merges G-slide-feedback and the R14 half of G-action-feedback.
10. **G-numeral-glyph** (typography, WS6, S, sev 3, +0.5). Open zero in the HUD face; outline instead of the ghost shadow.
11. **G-team-preview** (ui, WS6, S, sev 3, +0.5). Frame the turntable tub in R02 on all viewports and re-aim the R02-preview-captain capture camera. Merges G-team-showcase.
12. **G-landscape-controls** (mobile, WS6, S, sev 3, +0.5). Bottom-corner controls, HUD scaled by viewport height, a filled Steer pill at ≥3:1 contrast. Merges G-steer-contrast and G-landscape-hud-scale.

**Next in line (outside the top 12):**
- G-hud-theme (ui, WS6, M, +1.0): brick-plate panels, one callout component (merges G-callout-system), fix "1 laps". Drop "callouts off centre" and "hide HUD under results".
- G-course-landmarks (authenticity, WS4, M, +0.5): a judge figure at stops, Goat Rock and a ford in R09, Hot Springs Mountain behind the Row, layered Ouachita ridges in place of the pale band. Merges G-course-identity and G-row-backdrop.
- G-crowd-trees (scenery, WS5, M, +0.5): one toy style for crowds and trees with variation. Merges G-sprite-repetition.
- G-low-tier-sun-disc (lighting, WS7, S, low tier only, +0 on high).

**Causes corrected:**
- The R06 facade noise is render resolution, not texture.
- The buried captain is the capture camera, not seating.
- R04-kart_3 shows no clipping.
- The SCRUB! placement is a race-start capture.
- Pack fusion is mostly crew interpenetration and tight spacing (fixed in #4), with resolution a secondary cause (#2).

**Process notes for the capture rig:**
- Re-aim the R02-preview-captain camera.
- Hide callouts in the R05/R06 landmark shots.
- Calibration frames were not scored. The judge brief does not ask for them this loop, and their anchors are printed in `benchmarks/README.md`, which I was told to read, so a blind score was not possible. `drift` is left unset.

```json
{
  "loop": 0,
  "role": "judge",
  "tier": "high",
  "scores": {
    "characters": { "score": 4.0, "confidence": 0.8, "evidence": [
      { "shot": "crops/high/R03-player", "note": "Faceless faceted-sphere heads, cube hands, box torsos with stripe bars; 8-sided pie-wedge wheels; no prints, seams or studs." },
      { "shot": "crops/high/R15-player", "note": "Two crew pairs share one space on both sides of the tub; captain faceless." },
      { "shot": "high/desktop/R09", "note": "Player and bottom-right rival wear identical brown cowboy hats and pale braced shirts: two teams not distinct at chase distance." },
      { "shot": "crops/high/R03-kart_1", "note": "Hat, uniform, tub, wheel and flag colour all vary per team (orange hard hats, lime shirts, orange tub): above anchor 3." },
      { "shot": "crops/high/R04-kart_3", "note": "Checked at 2x: navy-capped figures sit behind the purple tub in the adjacent Bubble Patrol tub; no clipping (advocate right)." }
    ] },
    "materials": { "score": 4.0, "confidence": 0.75, "evidence": [
      { "shot": "crops/high/R02-preview", "note": "Lit facet shading only: no specular, bevel highlight, studs or seams (anchor 5 for the models)." },
      { "shot": "crops/high/R04-player", "note": "Asphalt is low-texel smeared noise with no material read; tub wall one flat tone." },
      { "shot": "crops/high/R15-player", "note": "Water is an opaque flat cyan plane; nothing transparent anywhere." },
      { "shot": "high/desktop/R06", "note": "384x240 upscale turns the Arlington facade into blotchy noise; native crops/high/R03-kart_1 keeps the window rows, so the cause is render resolution." }
    ] },
    "scenery": { "score": 4.5, "confidence": 0.75, "evidence": [
      { "shot": "high/desktop/R04", "note": "Coherent low-poly town with painted facades and sprite crowds; nothing brick-built (anchor 5)." },
      { "shot": "high/desktop/R08", "note": "Grass terrain slab crosses the road behind the player; pale band on the horizon." },
      { "shot": "high/desktop/R12", "note": "Identical oak sprites repeated in a row." },
      { "shot": "crops/high/R03-kart_5", "note": "Painted cartoon children with faces beside faceless box figures: world and characters clash." },
      { "shot": "high/landscape/R17", "note": "Plaza has a stone-drum centrepiece on a raised brick ring, framed out of desktop R17 (advocate right on the fact)." }
    ] },
    "lighting": { "score": 4.5, "confidence": 0.75, "evidence": [
      { "shot": "crops/high/R04-player", "note": "Measured luma 65 under crew feet vs 62 open road vs 41 tub octagon: no crew contact shadow; tub shadow a hard octagon." },
      { "shot": "high/desktop/R07", "note": "Warm shopfront band (luma 135 vs facade 27-36) is a real dusk accent, but windows dark, lamp globes unlit, hard seam between upper sky and cloud band." },
      { "shot": "high/desktop/R11", "note": "Sunset only in the sky; foreground trees 58,85,32 vs 72,90,44 at noon in R10, so no warm shift." }
    ] },
    "animation": { "score": 4.5, "confidence": 0.7, "evidence": [
      { "shot": "strips/high/R16", "note": "Crew hold push formation all 8 frames under 'team circles the tub'; water ring tilts in f4-f5 (fit slope 0.01->0.12->0.23->0.01) with the tub still: real but brief slosh; rival passes the near plane f3-f8." },
      { "shot": "strips/high/R14", "note": "Stride poses change, water band tilts f4-f7, gauge spills 41->39; zero steam, sparks, skid marks or FOV kick during the charge slide." },
      { "shot": "strips/high/R15", "note": "Crew circle the tub with stride poses and items in hand; pairs merge in f2 and f6." },
      { "shot": "high/desktop/R17", "note": "Small lilac steam puff exists, but as an item effect, not slide feedback." }
    ] },
    "ui": { "score": 5.5, "confidence": 0.75, "evidence": [
      { "shot": "high/desktop/R04", "note": "Clear, consistent race HUD hierarchy (lap, time, water, item, ducks, place, minimap); generic web cards, not brick-themed (vs drive-3)." },
      { "shot": "high/desktop/R02", "note": "Team select shows no tub or crew; right half is empty street (high/mobile/R02 has no preview either)." },
      { "shot": "high/desktop/R18", "note": "Consistent results panel with dimmed HUD behind (acceptable); '1 laps' bug." },
      { "shot": "high/desktop/R16", "note": "Framed blue banner callout; with pixel READY/SCRUB! (R03/R05) and teal HOT STEAM! pill (R17), three unrelated callout styles." },
      { "shot": "high/desktop/R15", "note": "Bath icon greys out after use: item row shows live state." }
    ] },
    "typography": { "score": 5.5, "confidence": 0.75, "evidence": [
      { "shot": "high/desktop/R03", "note": "Zoomed 5x: HUD zeros carry an interior slash, so '0:00.00' reads as 8s; fails numerals-at-a-glance." },
      { "shot": "high/mobile/R18", "note": "'1:01.00' beside '8TH' reads as '1:81.88'; table is a humanist sans, not serif (Codex misread)." },
      { "shot": "high/desktop/R01", "note": "Pixel display title plus rounded sans form a clear two-face scale; subtitle offset shadow prints a ghost duplicate line." }
    ] },
    "readability": { "score": 5.5, "confidence": 0.75, "evidence": [
      { "shot": "high/desktop/R10", "note": "Item orbs glow and read; player tub centred and distinct." },
      { "shot": "high/desktop/R12", "note": "Lime rival crewman stands inside the player's pink crew; pack fuses into one blob." },
      { "shot": "high/mobile/R08", "note": "Grass slab crosses the road behind the player's tub." },
      { "shot": "high/desktop/R09", "note": "Left road edge lost in a same-colour dirt verge." },
      { "shot": "high/mobile/R07", "note": "Player's black crew on near-black dusk road; rival ahead overlaps vertically." }
    ] },
    "mobile": { "score": 4.0, "confidence": 0.8, "evidence": [
      { "shot": "high/mobile/R02", "note": "Portrait team select fits fully: grid, stats, Choose and Back." },
      { "shot": "high/mobile/R04", "note": "Controls stay below the tub; Steer pill is a faint outline with low contrast over the road." },
      { "shot": "high/landscape/R02", "note": "Stats and Choose/Back buttons off-screen; with R01 (logo, lower buttons) and R18 (row 8, both buttons) landscape menus fail 3 of 3." },
      { "shot": "high/landscape/R17", "note": "Controls sit high and Brake covers an item orb; Steer floats mid-left." }
    ] },
    "authenticity": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "crops/high/R03-kart_1", "note": "The Arlington's twin towers close Central Avenue." },
      { "shot": "high/desktop/R05", "note": "Fordyce facade and scalloped awning recognisable." },
      { "shot": "high/desktop/R16", "note": "Judge stop is a white box and blue flag with no judge." },
      { "shot": "high/desktop/R09", "note": "No Goat Rock and no ford: a generic dirt road in pines." }
    ] }
  },
  "ip": { "clean": true, "notes": "Faceted sphere heads (not cylinders), cube hands (not C-shapes), rectangular torsos (not trapezoids) in crops/high/R03-player-rear and crops/high/R02-preview; no LEGO name or logo in menus, HUD or scenes. No reviewer reported a hit. Re-run the IP gate on the rebuilt figures (G-brick-figures)." },
  "gaps": [
    { "id": "G-landscape-overflow", "category": "mobile", "expectedGain": 1.0, "severity": 5, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R01", "high/landscape/R02", "high/landscape/R18"], "benchmark": "2k-drive/drive-2.jpg", "fix": "In a max-height 500px landscape media query, cap menu panels at 100dvh minus safe areas with an internal scroll region, scale the title to fit, lay team select out as grid-left / details-and-buttons-right, and pin the results buttons below the table. Test at 844x390: high/landscape/R01 shows the full logo and Grand Prix through Credits; R02 shows stats plus Choose/Back; R18 shows row 8 plus both buttons, with no page scroll. Also clears typography's 'nothing clipped'." },
    { "id": "G-render-res", "category": "materials", "expectedGain": 1.0, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R06", "crops/high/R03-kart_1", "high/desktop/R08"], "fix": "Default the high tier to native resolution at about 0.75x DPR (gfx.w >= 960 on desktop, >= 585 on portrait) instead of 'Authentic 240'; keep Authentic 240 as an option and as the low-tier default. Test: shots.json gfx.w >= 960 for high/desktop; R06 Arlington windows read as rows with no blotch; R08/R10 canopy edges not stair-stepped; perf proxies still pass the loop-1 budgets. About +0.5 materials and +0.5 readability." },
    { "id": "G-contact-shadows", "category": "lighting", "expectedGain": 1.5, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["crops/high/R04-player", "crops/high/R15-player", "high/desktop/R07", "high/desktop/R11"], "benchmark": "worlds/worlds-4.jpg", "fix": "Replace the hard octagon with a soft radial shadow decal under each tub (feathered over at least 25% of its radius) and a soft ellipse under each figure's feet; add AO on figures and tubs (high tier); make dusk lamp globes emissive with a ground light-pool decal; feed sprite and billboard materials the same fog and light-tint uniforms as meshes; blend the cloud band into the upper sky. Test: luma under crew feet at least 15% below open road in crops/high/R04-player (now 65 vs 62); no hard polygon edge on the tub shadow; R07 globes brighter than the sky behind them; R11 foreground-tree mean shifts at least 20% toward the sunset key vs R10; no sky seam in R07 or R11." },
    { "id": "G-brick-figures", "category": "characters", "expectedGain": 2.5, "severity": 5, "effort": "L", "workstream": "WS2", "evidence": ["crops/high/R03-player", "crops/high/R15-player", "high/desktop/R09", "crops/high/R02-preview"], "benchmark": "2k-drive/drive-4.jpg", "fix": "Big lever. Rebuild crew and captain as original brick figures (no cylinder head, C-hand or trapezoid torso): bevelled head with a printed face (eyes, brows, mouth), separate torso, arms, hands and legs with seam lines, printed team uniforms, studded hats, and a unique hat silhouette per team (Steam Rangers and Suds Posse no longer share the brown cowboy hat). Build tubs from recognisable brick parts (plate chassis, hubbed wheels with tyres instead of pie-wedge octagons). Add a crew-placement constraint: at least 0.35 m between figures, no figure inside another tub's volume. Test: faces on all five figures in crops/high/R03-player and on the captain in crops/high/R02-preview; no overlapping figures in crops/high/R15-player or strips/high/R15 f2 and f6; a 12-team chase-distance sheet with names hidden identified correctly; IP gate re-run." },
    { "id": "G-abs-material", "category": "materials", "expectedGain": 2.0, "severity": 5, "effort": "L", "workstream": "WS1", "evidence": ["crops/high/R02-preview", "crops/high/R04-player", "crops/high/R15-player"], "benchmark": "worlds/worlds-1.jpg; builders-journey/bj-3.jpg", "fix": "One shared plastic material for brick parts (roughness 0.25-0.35, clearcoat 0.3-0.5, soft environment reflections), bevel normals on every part edge, studs on top faces within 15 m of the camera, a fixed palette of about 20 real brick colours, and tub water as a transparent surface (opacity 0.5-0.7). Land it on the new figure parts first. Test: highlights trace bevels in crops/high/R04-player and crops/high/R02-preview; the tub interior shows through the water in crops/high/R15-player." },
    { "id": "G-brick-world", "category": "scenery", "expectedGain": 2.0, "severity": 5, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R04", "high/desktop/R05", "high/desktop/R06", "high/desktop/R16"], "benchmark": "worlds/worlds-1.jpg; 2k-drive/drive-5.jpg", "fix": "Studded green baseplate ground, tile roads with plate seams and printed lane lines, landmark facades with modelled brick courses, dimensional window recesses and trim (keeping the Arlington, Fordyce and Quapaw silhouettes), and brick-built street furniture (lamp posts, barriers, judge booth). Test: studs visible on the ground within 15 m in R04 and R12; brick courses and window recesses on the R05 Fordyce and R06 Arlington; no untextured white box at the R16 judge stop." },
    { "id": "G-terrain-road-intrusion", "category": "readability", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R08", "high/mobile/R08"], "fix": "Clamp terrain heights to at least 5 cm below the road surface across road width plus a 1 m shoulder, and assert it in a per-course build check. Test: no grass pixels inside the road in R08 on desktop, portrait and landscape." },
    { "id": "G-ring-around", "category": "animation", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R16", "strips/high/R15"], "fix": "At judge stops, drive the crew with the circling routine already used for fumbles (strips/high/R15), one lap per progress-bar fill; keep rival tubs at least 3 m from a stopped player and out of the chase camera's near plane. Test: in strips/high/R16 every crew figure changes side of the tub at least once in 8 frames; no rival geometry in the bottom quarter of frames 3-8." },
    { "id": "G-slide-steam", "category": "animation", "expectedGain": 1.0, "severity": 4, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "high/desktop/R17"], "benchmark": "2k-drive/drive-3.jpg", "fix": "During a power slide, emit the existing steam puff (high/desktop/R17) from the tub, growing with charge level, plus skid-mark decals from the rear wheels; on release, a 6-8 degree FOV kick and a short steam burst. Test: steam visible in at least 6 of 8 frames of strips/high/R14; skid marks behind the tub in frames 4-8." },
    { "id": "G-numeral-glyph", "category": "typography", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R03", "high/mobile/R18", "high/desktop/R01"], "fix": "Redraw the HUD pixel face's 0 as an open oval with no slash or dot (keep 8 closed with a waist); replace the subtitle's offset shadow with a 1-2 px dark outline. Test: zeros in '0:00.00' (high/desktop/R03) and '1:01.00' (high/mobile/R18) have no interior marks; no duplicate subtitle line in high/desktop/R01 or high/mobile/R01." },
    { "id": "G-team-preview", "category": "ui", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R02", "high/mobile/R02", "crops/high/R02-preview-captain"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Move the team-select camera so the turntable tub and crew fill the empty right half on desktop and landscape and a band above the grid in portrait; re-aim the R02-preview-captain capture camera, which sits inside the tub wall. Test: the selected tub and all five figures fully visible in high/desktop/R02 and high/mobile/R02." },
    { "id": "G-landscape-controls", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R17", "high/landscape/R03", "high/mobile/R04"], "fix": "In landscape, anchor Item/Hop/Brake/Push to the bottom-right corner and Steer to the bottom-left; scale the gauge, minimap and place by viewport height; give the Steer pill a filled background with chevrons. Test: persistent HUD at most 15% of the 844x390 frame by bounding box; no control over an item orb in high/landscape/R17; Steer pill contrast at least 3:1 against the road in high/mobile/R04, R07 and R17." }
  ],
  "verdict": "continue"
}
```
