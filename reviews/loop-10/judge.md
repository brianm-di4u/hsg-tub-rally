# Judge: loop 10, high tier

Paths are relative to `screenshots/review-loop-10/`. I opened every capture cited below and measured with PIL crops in my own scratch folder. Luminance is Rec. 709, 0–255.

## Summary
- **Total: 67.5/100.** Characters 7, materials 6.5, scenery 6.5, lighting 6.5, animation 6.5, UI 7, typography 7, readability 6.5, mobile 7, authenticity 7.
- **Verdict: `continue`.** Five gated categories are below 7: materials, scenery, lighting, animation and readability.
- **Measured gates:** perf passed 52/52 on the third, idle run. Fidelity is null. IP passed.
- **No category moves.** This loop's changes are real, but each one is polish inside an anchor band; none of them crosses an anchor. All ten scores equal last loop's.
- **Plateau:** the total matches the best total (67.5). Applying the plateau rule is the tally's job, not mine.

### Score sums
| Reviewer | JSON sum | Prose total | Agrees? |
|---|---|---|---|
| Critic A | 67.5 | 67.5 | yes |
| Critic B (Codex) | 67.0 | 67/100 | yes |
| Prosecutor | 64.0 | 64.0 | yes |
| Advocate | 70.0 | 70.0 | yes, but see below |

The advocate's prose says it raises "five categories" and holds "the other five". Its JSON actually raises seven and holds three (animation, UI, authenticity).

No category has critics more than 1.0 apart, or a prosecutor–advocate gap above 1.0. I still checked every factual dispute that bears on a score.

### A/B
- **No `abWeight` void.** In `ab/high-desktop-R06` the two halves have the same camera and tier. B differs from A only in junction bands, and nowhere is B more than 4 levels brighter, so the pair is a valid like-for-like comparison.
- The critics disagree only on authenticity (B against tie). Disagreement alone is not grounds for a void.
- **Lighting:** both critics called it a tie. The advocate argues for B, and my measurement supports the darkening it cites: B is 4.8–5.8 levels darker at the central-block and left-tower bases and 0.0 on the wall above. The A/B verdicts belong to the critics, though, and my lighting score equals last loop's, so the point is moot.

## Factual disputes settled

| # | Claim | Who said it | Ruling | Evidence |
|---|---|---|---|---|
| 1 | The chassis has no top studs | Critic A | **Wrong** (prosecutor and advocate right) | `crops/high/R03-player` at 3×: dark octagonal studs on the chassis plate right of the bowl. `crops/high/R04-kart_3`: a row of 4+ studs in front of the teal tub. `crops/high/R15-player`: a grey stud row under the bowl. A lip seam also runs around the bowl's base. The bowl itself is still one smooth shell. |
| 2 | Every building is a flat box with inset quads and no sills | Critic A | **Wrong for storefronts and the Fordyce, right for landmark blocks** | `crops/high/R03-player` at 2.5×: storefront windows have proud light-grey surrounds and sills, a belt course and a corner pilaster. The same kit is in `high/desktop/R13` and `high/desktop/R03`. `high/desktop/R05`: the Fordyce's white ledges cast shadows, and the stoop and toothed awning are geometry. The Arlington's main blocks (`high/desktop/R06`) and the painted-facade windows (background of `crops/high/R04-kart_3`) are flat. |
| 3 | The R08 signboard is blank | Critic A | **Void: the object is a tree** (advocate right) | `high/desktop/R08` at 1.6×: tan slabs at mixed yaw on one dark trunk. The same build is the autumn tree in `high/desktop/R19` (x 380–470, y 200–280), `high/desktop/R13` and `high/desktop/R09`. That a critic read it as a sign is itself a defect: the canopy is wood-tan. |
| 4 | The R15 fumble camera is static (A: frames 1–3; prosecutor: all 8) | Critic A, prosecutor | **Both wrong** (advocate right) | Best-fit background shift on the left tree and fence in `strips/high/R15`: 12–13 px between frames 1→2 and 2→3, with residuals well above the 4.2 or less of frames 5–8, so it is not a pure pan. Frames 5→8 are static (shift 0–1 px). The camera moves, but there is no kick. |
| 5 | R05/R06 A/B differences are only window glints | Critic A | **Wrong for R06** | `ab/high-desktop-R06`: B is darker by 5.8 levels at the central-block base, 4.8 at the left-tower base and 0.0 on the wall and deck. R05's differences are glints only. |
| 6 | The Arlington shows no AO | Prosecutor | **AO is present but faint** | `high/desktop/R06` against `low/desktop/R06`: the tower-base bands are 6.7 and 5.9 levels darker on high (about 5%). Mid-walls differ by 2 levels or less, and the arcade base by +0.5. To the eye it is nearly invisible, and Critic A's 10% test is not met. |
| 7 | "Useful pools of streetlight" at dusk | Codex | **False, struck** (prosecutor and advocate right) | `high/desktop/R07`: globe maximum (255,237,184). Sky beside the globe measures 80.7 against 91.4 sixty px out, so there is no halo. Paving at the lamp base is 176 against 166 between lamps (+6%, no pool). Windows are dark. |
| 8 | The R08/R19 banks: a stretched stud texture (prosecutor), a smooth bank (Codex), or already stepped plates (advocate) | Prosecutor, Codex, advocate | **None fully right** | Luminance profiles across the lines show flat treads (constant 66–125), a thin bright edge (91–154) and a 4–6 px darker ramp, on both tiers (`low/desktop/R19` too). So the lines are built-in edges, not stretched studs. The stud ovals on the R19 crest sit on the flat top and match its foreshortening. The treads are tilted, though, with different brightness per strip, no studs and no risers, so both banks read as ribbed ramps rather than stacked plates. |
| 9 | Goat Rock is tapered prisms with brick courses and triangulation splits | Prosecutor | **Confirmed** | `high/desktop/R09` at 2×: running-bond courses on tapering faces. Diagonal light/dark splits run across the tall centre spire and the right-hand block. |
| 10 | Steam is opaque marbles | Prosecutor | **Confirmed** | `high/desktop/R19` steam at 6×: opaque white shaded spheres with grey rims where they overlap. The same in `high/desktop/R17`. |
| 11 | The R14 slide leaves the road with no reaction | Prosecutor | **Confirmed** | `strips/high/R14` frames 7–8 at 2×: the ring is on the paving, a lamp post stands on its right edge, the crowd fence is behind it, and nothing reacts. |
| 12 | The fumble flash erases prints | Codex | **Prints survive, team colour does not** (advocate right) | `crops/high/R15-player`: the face, hydrant badge and reflective bands stay legible. Median tub body (90,32,27)→(238,184,179), helmet (92,39,39)→(248,194,195), tyre (29,33,34)→(176,178,178). HSV saturation drops from 0.70 to 0.25. |
| 13 | Phone countdown | Prosecutor (portrait on the vanishing point), advocate (portrait clears the grid) | **Both factually right; landscape is the real problem** | Landscape: READY's orange core spans x 584–1069, y 280–351, with the glyphs about y 215–365, over the karts ahead (`high/landscape/R03`). Portrait: the core is y 470–517 and the glyphs end about y 530, just above the road's far end (about y 535). The grid starts about y 590 (`high/mobile/R03`), so portrait covers only the far vista. |
| 14 | Portrait results baseline offset | Prosecutor | **Confirmed** | `high/mobile/R18`: the water digits sit 4 device px below the time and points digits in rows 1–7 (row 1: 725–741 against 721–737), and 2 px below in row 8. |
| 15 | Landscape HUD covers about 25% of the frame | Prosecutor | **Overstated** | `high/landscape/R04`: the plates' bounding boxes are about 18% of the frame, about 25% with the touch controls. The left stack does run from y 22 to about 447 (55% of the height). |
| 16 | The player's tub is largely hidden or a sliver | Critic A, prosecutor | **Overstated** | `high/desktop/R04`: the red bowl is visible between the rear crew (about x 610–670, y 470–545). The ring and arrow still do most of the work. |
| 17 | The empty item sphere is a placeholder | Critic A | **Wrong cause** | `high/desktop/R17`: the same bubble holds the ×3 item, so it is the slot's empty state. |
| 18 | Contact shadow hidden by the ring | Critic A | **Wrong** | The shadows fall outside the ring in `high/desktop/R17` (left) and `high/desktop/R10` (right). |

## Category rulings

### Characters: 7.0
- Critics 7/7. Prosecutor 6.5, advocate 7.5.
- **For the 7 anchor:**
  - Printed expressive faces and printed uniforms hold up at native size (`crops/high/R02-preview-captain`).
  - Hats are studded.
  - The tubs are partly built from parts: a studded chassis (dispute 1), claw feet, bolted hubs and a stripe tile.
  - The tub water is transparent: the captain's torso shows through it.
  - Teams separate by print, hat and colour, and the teal Out-of-Towners tub now matches its card (`crops/high/R04-kart_3`).
- **Against:**
  - The bowl is a seamless shell.
  - The fumble flash bleaches the whole kart (dispute 12, `crops/high/R15-player`). The prints survive, so this is a transient effect that costs readability more than asset quality.
- **The prosecutor's 6.5** leans on the bowl and the flash. The bowl alone doesn't break the anchor once the chassis studs are counted.
- **The advocate's 7.5** needs the 9-anchor traits (part seams and mould lines everywhere), and these are absent.
- 7.0.

### Materials: 6.5
- Critics 6.5/6.5. Prosecutor 6.0, advocate 7.0.
- **The advocate's corrections are right:** storefront surrounds and sills and the Fordyce ledges are real relief (dispute 2, `crops/high/R03-player`, `high/desktop/R05`). The figures and tubs read as ABS, and the tub water reads as clear plastic (`crops/high/R02-preview-captain`).
- **The prosecutor's new defects are also real:**
  - Goat Rock's brick-textured tapered prisms with triangulation splits (`high/desktop/R09`).
  - Opaque marble steam (`high/desktop/R19`).
  - Ribbed, stud-less ramp banks (`high/desktop/R19`, `high/desktop/R08`; the stretched-stud detail is not shown, see dispute 8).
- **Uncontested:** the opaque blue-tile ford, flat landmark window quads (`high/desktop/R06`), and opaque blue ground-floor panes (`high/desktop/R05`).
- The worlds-1 7 bar needs the world, not only the figures, to read as plastic parts. The two sets of findings cancel, so 6.5.

### Scenery: 6.5
- Critics 6.5/6.5. Prosecutor 6.5, advocate 7.0.
- **Credit:**
  - One brick vocabulary across every course.
  - Trees no longer interpenetrate (`high/desktop/R09`).
  - A set piece per course: the plaza in `high/desktop/R17`, the judge stop in `high/desktop/R16`.
- **The advocate's 7 needs the "brick-built world" clause to hold, and it holds only near the road:**
  - The far rings are the same flat crenellated cards on every course (`high/desktop/R09`, `high/desktop/R06`, `high/desktop/R19`, `high/desktop/R04`).
  - The trails are plaza tile (`high/desktop/R10`).
  - The ford is tile (`high/desktop/R19`).
  - The storefront kit repeats unchanged on Bridge Street (`high/desktop/R13`, `high/desktop/R03`).
  - The autumn tree reads as a plank sign (`high/desktop/R08`).
  - A stray railing cuts the Arlington shot (`high/desktop/R06`, bottom right).
- 6.5.

### Lighting: 6.5
- Critics 6.5/6.5. Prosecutor 6.5, advocate 7.0.
- **Credit:**
  - Three deliberate palettes (`high/desktop/R07`, `high/desktop/R11`, `high/desktop/R04`).
  - Soft cast shadows (`high/desktop/R10`).
  - Contact shadows that leave the ring (`high/desktop/R17`).
  - Haze matched to the sky.
- **AO:** now measurable at landmark scale, about 5% at the tower bases (dispute 6), but too faint to read as occlusion.
- **Dusk:** no light from the lamps or windows (dispute 7). The worlds-4 bar asks dusk to have a deliberate palette, and a dusk street with unlit globes falls short of it.
- Codex's "pools" evidence is struck. The advocate's measured AO is real but too small to carry 7.
- 6.5.

### Animation and feel: 6.5
- Critics 6.5/6.5. Prosecutor 6.0, advocate 6.5.
- **Clause 1 is met.** The crew push-run and circle the tub with articulated limbs (`strips/high/R15`, `strips/high/R16`).
- **Clause 2 is partly met:**
  - The drift arc changes colour with charge, and particles trail the slide (`strips/high/R14`).
  - The fumble has a flash and a spray burst, and the camera moves in frames 1–4 (dispute 4).
  - But there is no kick, the particles are marbles, and the slide runs onto the pavement against a lamp post with no reaction (dispute 11).
- **Clause 3 is not legible.** At 5× in `strips/high/R16` frames 2 and 4, the water reads level or is hidden by spray.
- The feedback isn't "weak" (5), so the prosecutor's 6.0 is too low. 6.5.

### UI / HUD: 7.0
- Critics 7/7. Prosecutor 6.5, advocate 7.0.
- **For:**
  - One stud-plate style with brick buttons (`high/desktop/R01`, `high/desktop/R18`).
  - Mode-aware plates: "8 LEFT" and an arena map in `high/desktop/R17`, SEMIFINAL and a task panel in `high/desktop/R16`.
  - Call-outs now sit under the top row on desktop (`high/desktop/R19`, `high/desktop/R16`).
  - The item slot is an empty-state bubble, not a placeholder (dispute 17).
- **Against:** the prosecutor's overlap points are real but phone-only: the landscape countdown, the heavy landscape plates, and the landscape team select dropping its labels (`high/landscape/R03`, `high/landscape/R04`, `high/landscape/R02`). I score them under readability and mobile rather than twice.
- 7.0.

### Typography: 7.0
- Critics 7/6.5. Prosecutor 6.5, advocate 7.0.
- **The anchor holds:** a clear display-to-UI scale (42 px heading, 15 px subtitle, 11 px rows in `high/desktop/R18`), numerals readable at a glance (`high/desktop/R04`), and nothing clipped.
- **Real but polish-level faults:**
  - The portrait water column sits 2 CSS px low (`high/mobile/R18`).
  - "(you)" wraps.
  - "Inspired / by:" splits (`high/landscape/R02`).
  - Desktop division labels have about 8 px caps (`high/desktop/R02`).
- 7.0.

### Readability: 6.5
- Critics 6.5/7. Prosecutor 6.5, advocate 7.0.
- **For:**
  - The ring and arrow mark the player in every race frame.
  - Road edges are clear (`high/mobile/R04`).
  - The teal and purple tubs now separate (`high/desktop/R12`, `crops/high/R04-kart_3`).
  - Near pickups are big (`high/desktop/R10`).
  - The player's bowl is visible (dispute 16).
- **The 7 anchor says "every frame on both viewports", and three captures break it:**
  - `high/landscape/R03`: READY over the karts ahead.
  - `high/desktop/R15` with `crops/high/R15-player`: the player's crew turns Flamingo-pink and white.
  - `strips/high/R14` frame 8: the player buried under marble spray and the drift arc.
- Packs merge in `high/desktop/R07` and `high/desktop/R08`.
- Codex's 7 rests on the desktop and portrait frames only. 6.5.

### Mobile: 7.0
- Critics 7/6.5. Prosecutor 6.5, advocate 7.0.
- **For:**
  - The thumb controls never touch the tub in either orientation (`high/mobile/R04`, `high/landscape/R04`, `high/landscape/R17`).
  - The portrait team select now frames the whole tub (`high/mobile/R02`).
  - The portrait HUD covers sky only: the plates end at about y 400 and the road starts at about y 545.
  - The software-GL phone floor holds 52 fps.
- **Against, on the landscape side:**
  - A heavy HUD (about 18% plates, a 55%-high left stack).
  - The countdown over the grid.
  - Cards without division labels, with Back alone under Choose (`high/landscape/R02`).
- The landscape side is clumsy but deliberately framed. 7.0, with landscape the weak side.

### Authenticity: 7.0
- Critics 7/7. Prosecutor 6.5, advocate 7.0.
- **For:**
  - The Row reads: the Fordyce tile bands in `high/desktop/R05`, the Hale's clean arches and the JUDGE stand in `high/desktop/R16`, the Quapaw dome.
  - The Arlington's twin towers in `high/desktop/R06`.
  - The real race shows: water gallons, duck, flag, judges.
- **Against (prosecutor right on these):**
  - The mountains are generic cards, not Ouachita ridgelines (`high/desktop/R09`).
  - In race frames the street ends in hills, not the Arlington (`high/desktop/R03`, `high/desktop/R04`).
  - Bridge Street is the Central Avenue kit (`high/desktop/R13`).
  - The R08 sign evidence is void (dispute 3).
- Three of four anchor clauses hold, well above the 6 gate. 7.0.

## IP: clean
All four reviewers report clean, and my own check agrees:
- **Heads:** rounded cubes, at most one cap stud (`crops/high/R03-kart_1`).
- **Torsos:** straight boxes (`crops/high/R02-preview`).
- **Hands:** mitten fists with a thumb (`crops/high/R02-preview-captain`).

There is no cylinder head, trapezoid torso or C-hand. No LEGO name or logo appears on studs or UI (`high/desktop/R01`, `high/desktop/R02`, `high/desktop/R18`). No characters gap.

## Ranked gaps (top 12)
Ranked by expected gain × weight ÷ effort. Five categories are below gate.

1. **G-phone-countdown** (readability, WS6, sev 3, S, +0.4)
   - Merges Critic A's G-landscape-countdown and the prosecutor's G-phone-countdown.
   - Problem: READY sits over the karts ahead in landscape and over the vanishing point in portrait.
   - Fix: apply the desktop call-out rule to phones.
     - Landscape: scale the countdown to 50% and anchor its top at 92 CSS px.
     - Portrait: keep its bottom 20 CSS px or more above the road's far end.
   - Test:
     - In `high/landscape/R03`, no countdown pixel below y 275 of 780.
     - In `high/mobile/R03`, the bottom is at least 40 device px above y 535.
2. **G-fumble-flash-bleach** (readability, WS3, sev 3, S, +0.3)
   - Problem: the flash bleaches the whole kart and crew (dispute 12).
   - Fix: replace the full-body whitening with a 2-frame additive rim/fresnel flash or white outline that keeps the albedo.
   - Test: in `crops/high/R15-player`, the tub body and helmets keep HSV saturation of 0.5 or more (now 0.25) and a hue within 10° of the team colour.
3. **G-ao-strength** (lighting, WS1, sev 2, S, +0.3)
   - Merges Critic A's G-ao-junctions and Codex's G-light-grounding.
   - The cause is fixed: AO exists, at about 5%.
   - Fix: double the high-tier SSAO intensity in the 40–150 m range and scale its radius with distance (about 1.5 m at 100 m), capped at 25% darkening.
   - Test:
     - The band above each Arlington tower base in `high/desktop/R06` is at least 13 levels (10%) darker than in `low/desktop/R06` (now 5.9–6.7).
     - Mid-walls differ by 3 levels or less.
4. **G-dusk-lamps** (lighting, WS1, sev 3, M, +0.5)
   - Problem: unlit globes, no pools, dark windows (dispute 7).
   - Fix, on the dusk and sunset courses:
     - emissive globes with a stateless halo sprite;
     - a warm radial light decal (about 3 m) on the paving under each lamp;
     - warm emissive shop glass.
   - Test in `high/desktop/R07`:
     - the paving under the nearest lamp is at least 20% brighter than midway between lamps (now +6%);
     - the sky within 15 px of a globe is at least 10 levels brighter than 60 px away (now 10.7 darker).
5. **G-brick-particles** (animation, WS3, sev 3, M, +0.5)
   - Merges Critic A's G-brick-particles, Codex's G-action-effects and the prosecutor's G-steam-soft-particles.
   - Problem: steam and spray are opaque shaded spheres with dark rims at overlaps.
   - Fix: replace them with translucent brick parts, sorted with no depth write and no outline.
     - Steam: trans-clear 1×1 round plates and 2×2 round tiles at alpha 0.5–0.7, growing 1–2× and fading over life.
     - Spray: trans-light-blue round plates tumbling on an outward arc.
   - Test:
     - At 6× on the `high/desktop/R19` steam, no overlap edge is more than 15 levels darker than both particle interiors, and the background shows through.
     - The `strips/high/R14` spray forms an outward arc in 4 or more frames.
6. **G-water-and-trails** (scenery, WS4, sev 3, M, +0.5)
   - Merges Critic A's G-water-and-trails and the prosecutor's G-ford-wet.
   - Ford fix:
     - a trans-blue water sheet over a visible submerged plate bed, with fresnel sky reflection and a white round-plate foam edge on both banks;
     - inside the ford volume, sink the wheels 0.15 m and spray at each wheel.
   - Trail fix: tan and brown dirt plates with scattered 1×1 rocks on the R10 and R19 trails. R09 already uses sand plates.
   - Test:
     - The ford's luminance standard deviation is 12 or more in `high/desktop/R19`, with the bed visible.
     - The trail's median hue differs from the plaza tile by 15° or more in `high/desktop/R10`.
7. **G-slosh-legible** (animation, WS3, sev 3, M, +0.4)
   - Problem: the anchor clause "water visibly sloshes" fails in all 24 high strip frames, even after this loop's 2.5× drive.
   - Fix: make the slosh read from the chase camera:
     - a light foam line where the water meets the bowl wall;
     - water climbing 0.12 m or more up the outer wall in turns and fumbles;
     - one or two trans-blue droplets spilling over the rim at peak tilt;
     - a 3-frame FOV +5° kick on fumbles and hits.
   - Test:
     - In a 2× crop of `strips/high/R14`, the water line tilts 8° or more against the rim in 3 or more frames.
     - In `strips/high/R15`, frames 1–3 show the FOV kick.
8. **G-autumn-canopy** (scenery, WS5, sev 2, S, +0.2)
   - Merges Critic A's G-tree-slab-yaw and the R08 part of G-signage.
   - Problem: the autumn canopies are wood-tan (hue 34–38° against trunk 19°), so a tree in `high/desktop/R08` was read as a blank sign. The near slabs at random yaw look ragged (`high/desktop/R11`, `high/desktop/R10`).
   - Fix: use saturated brick orange and yellow for autumn canopies, and snap slab yaw to multiples of 45° in whole-stud sizes.
   - Test: the lit canopy HSV saturation in R08 is 0.6 or more (now about 0.4).
9. **G-slide-kerb-contact** (animation, WS3, sev 3, M, +0.3)
   - Problem: dispute 11, the slide runs onto the pavement with no reaction.
   - Fix: add road-edge kerb and street-furniture colliders. On contact, apply a lateral bounce, a 3-frame camera shake and a 6–10 piece brick burst at the contact point.
   - Test: in `strips/high/R14` the ring centre never crosses the road-edge line, or a reaction shows within 2 frames.
10. **G-landmark-windows** (materials, WS4, sev 3, M, +0.3)
    - Merges Critic A's G-facade-relief with its cause fixed, and the glazing half of Codex's G-surface-depth.
    - The storefront kit and the Fordyce already have relief. Only the landmark blocks lack it.
    - Fix:
      - instance the storefront window-surround and sill part on the Arlington main blocks and over the painted windows of the painted-facade landmarks;
      - give ground-floor panes a dark interior behind trans glass.
    - Test: in `high/desktop/R06`, each sunlit sill is at least 15 levels above the wall beside it.
11. **G-terrain-parts** (materials, WS4, sev 2, M, +0.3)
    - Merges the prosecutor's G-rock-parts and G-bank-plates, with the bank cause fixed: these are ribbed ramps, not stretched studs.
    - Fix:
      - rebuild Goat Rock from slope bricks and stacked plates with flat normals, with brick courses only on vertical faces;
      - terrace the banks with risers at least one plate high and studs on the treads.
    - Test:
      - No diagonal shading split on any rock face in `high/desktop/R09`.
      - On the `high/desktop/R19` bank, the risers differ from the treads by 20 levels or more, and the treads carry studs.
12. **G-ridgeline-rings** (scenery, WS4, sev 3, L, +0.5): **this loop's big lever.**
    - Merges Critic A's G-far-ring-relief and Codex's G-environment-repetition.
    - Problem: the same flat card backdrop, with triangle-tree crenellation, closes every course (`high/desktop/R09`, `high/desktop/R06`, `high/desktop/R04`, `high/desktop/R19`). It is the main thing holding scenery below worlds-1. It is also the failing "Ouachitas" clause in authenticity, and it flattens the haze layering.
    - Fix: 3–4 depth layers of stepped brick terrain (plates and slope bricks with tree clusters), with per-course silhouettes that follow the real ridgelines (Hot Springs, North, West and Sugarloaf mountains, and the long Ouachita ridges).
    - Test:
      - No card edge or repeated crenellation in R09 or R06.
      - The R09 and R19 skylines overlap by less than 70%.

**Below the cut**, valid but lower priority:
- **G-landscape-team-select** (mobile, S): the division labels, Back on the Choose row, and the "Inspired by:" split.
- **G-landscape-hud-area** (mobile, M).
- **G-results-baseline** (typography, S): the 4 device px offset.
- **G-tub-bowl-parts** (characters, M): a rim seam and a side tile. The chassis studs already exist.
- **G-signage** (authenticity, S): Bridge Street and Gulpha markers.
- **The R06 stray railing.**
- **The empty item bubble's styling.**

```json
{
  "loop": 10,
  "role": "judge",
  "tier": "high",
  "verdict": "continue",
  "scores": {
    "characters": { "score": 7.0, "confidence": 0.75, "evidence": [
      { "shot": "crops/high/R02-preview-captain", "note": "printed expressive faces, coat print, studded helmets hold up at native size; transparent tub water" },
      { "shot": "crops/high/R04-kart_3", "note": "chassis stud row present (Critic A wrong); teal tub with purple rim matches the card; distinct hats and prints" },
      { "shot": "crops/high/R03-player", "note": "chassis studs at 3x and a bowl-base lip seam; the bowl itself is a smooth shell" },
      { "shot": "crops/high/R15-player", "note": "flash bleaches the kart: tub (90,32,27) to (238,184,179), sat 0.70 to 0.25; prints stay legible" }
    ] },
    "materials": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "crops/high/R03-player", "note": "storefront windows have proud surrounds, sills, belt course and pilaster (Critic A's 'no sills' wrong)" },
      { "shot": "high/desktop/R06", "note": "Arlington main-block windows are flat quads; roofs are slabs" },
      { "shot": "high/desktop/R09", "note": "Goat Rock: brick courses on tapered prisms, diagonal triangulation splits" },
      { "shot": "high/desktop/R19", "note": "opaque blue-tile ford; steam at 6x is opaque spheres with grey rims; bank is a ribbed stud-less ramp" },
      { "shot": "high/desktop/R05", "note": "Fordyce ledges and stoop are real relief; ground-floor panes opaque blue" }
    ] },
    "scenery": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R09", "note": "trees separated; same flat crenellated card rings as every course" },
      { "shot": "high/desktop/R10", "note": "trail is terracotta plaza tile" },
      { "shot": "high/desktop/R08", "note": "top-left object is a wood-tan autumn tree misread as a sign" },
      { "shot": "high/desktop/R13", "note": "storefront kit repeats from Central Avenue (R03)" },
      { "shot": "high/desktop/R17", "note": "radial brick plaza set piece" }
    ] },
    "lighting": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R07", "note": "deliberate dusk palette but no halo (sky 80.7 beside globe vs 91.4 at 60 px), no pool (+6%), dark windows; Codex's 'pools' struck" },
      { "shot": "high/desktop/R06", "note": "vs low/desktop/R06: tower bases 5.9-6.7 levels darker (about 5%), mid-walls within 2: AO present but faint" },
      { "shot": "high/desktop/R17", "note": "contact shadow falls outside the ring" },
      { "shot": "high/desktop/R11", "note": "sunset palette with matched haze" }
    ] },
    "animation": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "strips/high/R15", "note": "crew circle with articulated limbs; camera moves frames 1-4, static 5-8, no kick; flash bleach" },
      { "shot": "strips/high/R14", "note": "drift arc and particle trail; frames 7-8 tub on the paving against a lamp post with no reaction; marble particles" },
      { "shot": "strips/high/R16", "note": "circling at the judge; water reads level at 5x in frames 2 and 4" }
    ] },
    "ui": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R17", "note": "mode-aware HUD (8 LEFT, arena map); item bubble holds x3, so the empty sphere is the empty state" },
      { "shot": "high/desktop/R16", "note": "task panel under the top row; SEMIFINAL plate" },
      { "shot": "high/desktop/R18", "note": "consistent stud plates and brick buttons" },
      { "shot": "high/landscape/R04", "note": "plates about 18% of frame (25% with controls); left stack 55% of height" }
    ] },
    "typography": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R18", "note": "clear display-to-UI scale; columns aligned" },
      { "shot": "high/mobile/R18", "note": "water digits 4 device px low on rows 1-7 (725-741 vs 721-737); '(you)' wraps" },
      { "shot": "high/landscape/R02", "note": "'Inspired / by:' split" },
      { "shot": "high/desktop/R04", "note": "numerals read at a glance" }
    ] },
    "readability": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "high/landscape/R03", "note": "READY core x 584-1069, y 280-351 (glyphs about y 215-365) over the karts ahead" },
      { "shot": "high/desktop/R15", "note": "fumble flash turns the player's crew pink and white" },
      { "shot": "strips/high/R14", "note": "frame 8: player buried under marble spray and drift arc" },
      { "shot": "high/desktop/R04", "note": "red bowl visible between rear crew (x 610-670); ring and arrow carry the read" },
      { "shot": "high/mobile/R04", "note": "ring, arrow, road edges and pickups clear" }
    ] },
    "mobile": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "high/mobile/R04", "note": "controls clear the tub; HUD ends about y 400, road starts about y 545" },
      { "shot": "high/mobile/R02", "note": "whole tub, wheels and feet above the panel" },
      { "shot": "high/landscape/R04", "note": "controls clear; heavy HUD" },
      { "shot": "high/landscape/R02", "note": "no division labels on cards; Back alone under Choose" }
    ] },
    "authenticity": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "high/desktop/R06", "note": "Arlington twin towers" },
      { "shot": "high/desktop/R16", "note": "Hale arches clean; JUDGE stand on the Row" },
      { "shot": "high/desktop/R05", "note": "Fordyce tile bands" },
      { "shot": "high/desktop/R09", "note": "generic card hills, not Ouachita ridgelines" },
      { "shot": "high/desktop/R13", "note": "Bridge Street is the Central Avenue kit" }
    ] }
  },
  "ip": { "clean": true, "notes": "Judge check: rounded-cube heads with at most one cap stud (crops/high/R03-kart_1), straight box torsos (crops/high/R02-preview), mitten fists with a thumb (crops/high/R02-preview-captain). No cylinder head, trapezoid torso or C-hand; no LEGO name or logo on studs or UI (R01, R02, R18)." },
  "gaps": [
    { "id": "G-phone-countdown", "category": "readability", "expectedGain": 0.4, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R03", "high/mobile/R03"], "benchmark": "drive-3", "fix": "Apply the desktop call-out rule to phones: in landscape scale the countdown to 50% and anchor its top at 92 CSS px; in portrait keep its bottom 20 CSS px or more above the road's far end. Test: no countdown pixel below y 275 of 780 in high/landscape/R03; in high/mobile/R03 its bottom is 40+ device px above y 535." },
    { "id": "G-fumble-flash-bleach", "category": "readability", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS3", "evidence": ["crops/high/R15-player", "high/desktop/R15", "strips/high/R15"], "fix": "Replace the full-body whitening with a 2-frame additive rim/fresnel flash or white outline that keeps albedo. Test: in crops/high/R15-player the tub body and helmets keep HSV saturation >= 0.5 (now 0.25) and hue within 10 degrees of the team colour." },
    { "id": "G-ao-strength", "category": "lighting", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R06", "low/desktop/R06", "ab/high-desktop-R06"], "benchmark": "worlds-4", "fix": "AO exists at about 5%: double the high-tier SSAO intensity in the 40-150 m range and scale its radius with distance (about 1.5 m at 100 m), capped at 25% darkening. Test: the band above each Arlington tower base in high/desktop/R06 is 13+ levels (10%) darker than in low/desktop/R06 (now 5.9-6.7), with mid-walls within 3." },
    { "id": "G-dusk-lamps", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/desktop/R11"], "benchmark": "worlds-2", "fix": "On dusk and sunset courses: emissive lamp globes with a stateless halo sprite, a warm radial light decal (about 3 m) on the paving under each lamp, warm emissive shop glass. Test in R07: paving under the nearest lamp 20%+ brighter than midway between lamps (now +6%); sky within 15 px of a globe 10+ levels brighter than 60 px away (now 10.7 darker)." },
    { "id": "G-brick-particles", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "high/desktop/R19", "high/desktop/R17"], "benchmark": "drive-3", "fix": "Replace the opaque shaded spheres with translucent brick parts, sorted with no depth write and no outline: steam as trans-clear 1x1 round plates and 2x2 round tiles at alpha 0.5-0.7 growing 1-2x and fading over life; spray as trans-light-blue round plates tumbling on an outward arc. Test: at 6x on the R19 steam no overlap edge is 15+ levels darker than both interiors and the background shows through; the R14 strip spray forms an outward arc in 4+ frames." },
    { "id": "G-water-and-trails", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R19", "high/desktop/R10"], "benchmark": "drive-1", "fix": "Ford: a trans-blue water sheet over a visible submerged plate bed, fresnel sky reflection and a white round-plate foam edge on both banks; inside the ford volume sink wheels 0.15 m and spray at each wheel. Trails on R10 and R19: tan and brown dirt plates with scattered 1x1 rocks (R09 already uses sand plates). Test: ford luminance std >= 12 in R19 with the bed visible; trail median hue differs from the plaza tile by 15+ degrees in R10." },
    { "id": "G-slosh-legible", "category": "animation", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R16", "strips/high/R14", "strips/high/R15"], "benchmark": "drive-3", "fix": "Make slosh read from the chase camera: a light foam line where water meets the bowl wall, water climbing 0.12 m+ up the outer wall in turns and fumbles, one or two trans-blue droplets spilling over the rim at peak tilt, and a 3-frame FOV +5 degree kick on fumbles and hits. Test: in a 2x crop of strips/high/R14 the water line tilts 8+ degrees against the rim in 3+ frames; strips/high/R15 frames 1-3 show the FOV kick." },
    { "id": "G-autumn-canopy", "category": "scenery", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R08", "high/desktop/R11", "high/desktop/R10"], "benchmark": "worlds-1", "fix": "Autumn canopies are wood-tan (hue 34-38 vs trunk 19) and the R08 tree was read as a blank sign: use saturated brick orange and yellow for autumn canopies and snap slab yaw to multiples of 45 degrees in whole-stud sizes. Test: lit canopy HSV saturation >= 0.6 in R08 (now about 0.4); slab yaws in R10 and R11 on 45-degree multiples." },
    { "id": "G-slide-kerb-contact", "category": "animation", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14"], "benchmark": "drive-3", "fix": "Add road-edge kerb and street-furniture colliders; on contact apply a lateral bounce, a 3-frame camera shake and a 6-10 piece brick burst. Test: in strips/high/R14 the ring centre never crosses the road-edge line, or a reaction shows within 2 frames (now frame 8 sits on the paving against a lamp post with no reaction)." },
    { "id": "G-landmark-windows", "category": "materials", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R06", "crops/high/R04-kart_3", "high/desktop/R05"], "benchmark": "worlds-1", "fix": "Storefronts and the Fordyce already have relief; only the landmark blocks lack it. Instance the storefront window-surround and sill part on the Arlington main blocks and over the painted windows of the painted-facade landmarks; give ground-floor panes a dark interior behind trans glass. Test: in high/desktop/R06 each sunlit sill is 15+ levels above the wall beside it." },
    { "id": "G-terrain-parts", "category": "materials", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R19", "high/desktop/R08"], "benchmark": "drive-5", "fix": "Rebuild Goat Rock from slope bricks and stacked plates with flat normals, with brick courses only on vertical faces; terrace the R19 and R08 banks (now ribbed, stud-less ramps) with risers at least one plate high and studs on the treads. Test: no diagonal shading split on any R09 rock face; on the R19 bank risers differ from treads by 20+ levels and treads carry studs." },
    { "id": "G-ridgeline-rings", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R06", "high/desktop/R04", "high/desktop/R19"], "benchmark": "worlds-1", "fix": "BIG LEVER for this loop. The same flat crenellated card backdrop closes every course; it is the main thing holding scenery below worlds-1 and the failing Ouachitas clause in authenticity. Replace it with 3-4 depth layers of stepped brick terrain (plates and slope bricks with tree clusters) whose per-course silhouettes follow the real ridgelines (Hot Springs, North, West and Sugarloaf mountains, the long Ouachita ridges). Test: no card edge or repeated crenellation in R09 or R06; R09 and R19 skylines overlap by less than 70%." }
  ]
}
```
