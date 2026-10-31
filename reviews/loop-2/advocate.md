# Advocate: loop 2, high tier

Capture paths are relative to `games/Cart Racing/screenshots/review-loop-2/`. Measurements are Rec. 709 luminance (0–255) on the full-size PNGs, taken with PIL crops in my own scratch folder.

## Summary
The two critics are within a point of each other (Critic A 63.0, Critic B (Codex) 62.0), and most of their deductions are visible in the captures. I concede these:
- There is no AO. CHANGES confirms there is no AO pass.
- The commercial blocks are painted boxes, and the Arlington's windows are a scatter.
- Screen-door dither on near trees.
- Flat disc particles and no camera kick.
- Judges hidden behind the booth.
- A real phone team-select regression. The previous build fits both buttons (`ab/high-mobile-R02`, `ab/high-landscape-R02`, side A).

I push back in five places:
1. Several of Critic A's facts are wrong. The pushers are not face clones, the figures do have part seams, not every road is plain asphalt, the wall-base darkening is measurable, and the dithered rival does not cover the water gauge.
2. Critic A's dusk "mud" test (crew/road ratio ≥ 2.0) is mis-specified for black-uniformed teams. In R07 the crew's heads are 2.7× road luminance, against 1.1× in daylight R04.
3. The single R02 phone defect is charged in three categories (mobile, ui, typography). Critic B grades it severity 5 and +1.5 for a layout fix the previous build already had.
4. Critic B's lighting 5.5 sits on the 5 anchor ("blob shadows; dusk and day differ only by tint"), which the captures plainly exceed.
5. Both critics under-credit the characters and the authenticity cues in the close-ups and on the Row.

**Proposed total: 64.0.**

| Category | Critic A | Critic B | Mean | Advocate |
|---|---|---|---|---|
| characters | 6.5 | 7 | 6.75 | **7.0** |
| materials | 6 | 6 | 6.0 | 6.0 |
| scenery | 6 | 6 | 6.0 | 6.0 |
| lighting | 6 | 5.5 | 5.75 | **6.0** |
| animation | 6 | 6 | 6.0 | 6.0 |
| ui | 6.5 | 6 | 6.25 | **6.5** |
| typography | 6.5 | 6.5 | 6.5 | 6.5 |
| readability | 6.5 | 6.5 | 6.5 | 6.5 |
| mobile | 6.5 | 5.5 | 6.0 | **6.5** |
| authenticity | 6.5 | 7 | 6.75 | **7.0** |

## Category by category

### Characters: 7.0 (mean 6.75)
**Concede:**
- The backs of the heads are bare skin blocks (`crops/high/R03-player-rear`).
- There are no mould lines.
- The tub body is one smooth bowl, and the wheels are plain discs (`crops/high/R02-preview`).
- The new rim or specular sheen silvers the raised dark-green leg in `crops/high/R04-kart_3`. I measure (100,105,104) on the lit face against (51,62,51) on the shaded leg.

**Rebut, Critic A, "the four pushers on a team are identical clones": plainly wrong on faces.**
- `crops/high/R02-preview-captain` shows four different printed faces on one team:
  - a scowling captain;
  - a closed smile (left);
  - a closed smile with raised brows (centre right);
  - an open grin with teeth (far right).
- All carry blush prints. Bodies and uniforms match, as a team's should.

**Rebut, Critic A, "the figures show no part seams": wrong.**
- At 2× in `crops/high/R03-player-rear`, the torso and hip are separate bevelled blocks. A dark seam runs between them (crop x590–860, y≈690–720), and each block catches its own edge highlight. Arms, hands, head and neck are separate parts, with gaps at the shoulders.
- What is missing is mould lines, not seams.

**Rebut, Critic A, "two near-white teams … told apart only by their hats": overstated.**
- Steam Rangers have dark-brown campaign hats on a yellow tub (`high/desktop/R03` left group, `high/desktop/R09` lower right).
- Lather & Linen have white chef caps on a pale-mint tub with a light-blue captain (`high/desktop/R13`).
- They differ in hat silhouette, hat value (dark against white) and tub colour.

**Evidence the critics underweighted:**
- At least nine distinct hat and shirt sets read at chase distance:
  - red fire caps (`high/desktop/R04`)
  - top hats (`high/desktop/R07`)
  - teal antenna bands (`high/desktop/R12`, `crops/high/R04-kart_3`)
  - police caps (`high/desktop/R11`)
  - chef caps (`high/desktop/R13`)
  - campaign hats (`high/desktop/R09`)
  - orange caps on green shirts (`high/desktop/R12` left)
  - pink crews (`high/desktop/R07`)
  - green caps (`high/desktop/R17`)
- Skin tone varies by team (`crops/high/R04-kart_3` against `crops/high/R02-preview`).
- The rubber duck, studded rim, studded chassis plate, round corner bricks, push bars and flag are all brick parts.
- The water is translucent: the rim's inner wall shows through it in `crops/high/R02-preview-captain`.
- No gaps or z-fighting appear at 2×.

Against the 7 anchor, everything is met except "tubs built from recognisable brick parts", and that is met for everything but the bowl. Critic B's 7 is better supported than Critic A's 6.5.

### Materials: 6.0 (mean 6.0)
**Concede:**
- The commercial blocks are painted fronts on boxes (`high/desktop/R13`). CHANGES says so.
- The Arlington windows are an irregular scatter (`high/desktop/R06`).
- The canopy side faces are flat green with no bevel highlight (`high/desktop/R12`).
- The dither speckle reads as a render fault. I reproduce Critic A's figure: mean |Δx| is 11.4 in R11 x950–1250, y150–400.
- Critic B's "oversized studs" is partly supported. In `high/desktop/R12`, the grass studs beside the crew are about 1.3–1.5× the tub-rim studs at the same depth.

**Rebut, Critic A, "Roads are plain asphalt, not tile": wrong as a blanket statement.**
- `high/desktop/R09` and `high/desktop/R10` are terracotta tile roads with seams.
- `high/desktop/R17` is radial brick paving.
- `high/desktop/R08` and `high/desktop/R13` show dark panel seams across the asphalt.
- The rubric's own 7 anchor `worlds-1` has a smooth, seamless grey road with painted lines. A plain road surface is not a deduction against 7.

**Partial rebut, "no part reads as clear except the flat cyan water":** the water is not flat. The inner rim wall shows through it (`crops/high/R02-preview-captain`).

**Credit:**
- Specular follows the bevels on the hats, studs and duck (`crops/high/R02-preview-captain`).
- Studs on the magnolia and oak tops carry stud-top glints (`high/desktop/R05` foreground trees).
- Running-bond courses show on the landmarks (`high/desktop/R05`).

These do not reach `worlds-1` across the whole world, so 6.0 stands.

### Scenery: 6.0 (mean 6.0)
**Concede:**
- Mountain pine corridors repeat (`high/desktop/R08`, `high/desktop/R10`, `high/desktop/R11`).
- The grass fields go studless at distance (`high/desktop/R05` right, `high/desktop/R06` left).
- A pale band separates the terrain from the hills (`high/desktop/R06`).
- R09 shows no Goat Rock and no ford water.

**Partial rebut, Critic A's R17 "empty red-brick disc ringed by two box buildings":** the arena also has a perimeter wall with rails, lamps and a spectator line (`high/desktop/R17`). The open interior suits a battle arena. Its lack of identity is real.

**Partial rebut, Critic B's "repeated floating plate stacks":** three species exist:
- magnolias with white 1×1 flowers (`high/desktop/R05`);
- slab oaks (`high/desktop/R12`);
- tiered pines (`high/desktop/R08`).

Repetition is a mountain-course problem, not a whole-world one. 6.0 is fair.

### Lighting: 6.0 (mean 5.75)
**Concede:**
- No AO anywhere.
- Facades are flat-lit (`high/desktop/R06`).
- No lamp pool reaches the road at dusk (`high/desktop/R07`). Only the sidewalk under the nearest left lamp warms.
- The sunset pack is murky. The RMS deviation of the player-pack box from the road is 22 in `high/desktop/R11`, against 50 in `high/desktop/R04`.

**Rebut, Critic B's 5.5:** the 5 anchor is "a directional light and fog, blob shadows; dusk and day differ only by tint". The captures beat every clause:
- Shadows are real articulated cast shadows, not blobs. Legs and push bars are readable in the tub shadow in `high/desktop/R13`, and tree canopies cast on the tiles in `high/desktop/R09`.
- The tub is grounded. Under the tub measures 53 against 85 on lit road in `high/desktop/R04`.
- Dusk has emissive lamp globes and lit shop-front strips on the left block, not just a tint (`high/desktop/R07`).
- Sunset has its own pink horizon (`high/desktop/R11`).
- A 6, halfway to `worlds-4`, which needs AO, fits better.

**Rebut, Critic A, "wall-base darkening is not measurable (98.8 vs 92.5)": wrong.**
- On the Fordyce's right wall in `high/desktop/R05` I located the grass line per column (y≈668–687).
- Brick-face luminance in the bottom 26 px is median 100.7, against 111.4, 109.4 and 109.4 in the bands above. That is about 9% darker: subtle but present.

**Rebut the cause in "dusk turns the pack to mud":**
- The player teams in R07 (Velvet Mob) and R11 (Bubble Patrol) wear black and navy.
- In R07 the crew heads measure 118 against the road's 44 (2.7×). The torso plus strap measures 86 (1.9×).
- In daylight R04 the same patches give heads 94 against road 85 (1.1×) and a torso of 63 (0.74×).
- A crew/road ratio ≥ 2.0 would fail for these teams at noon. The test measures the palette, not the light.
- The real dusk deficit is the missing road light and fill. That part I concede, and it is in G-no-ao-dusk-murk.

### Animation: 6.0 (mean 6.0)
**Concede:**
- The particles are flat discs (`strips/high/R14`, `strips/high/R15`).
- R14 shows no camera kick and no distinct steam. The frame 7–8 puffs are the same blue as the R15 splash.
- The water never sloshes.
- In `strips/high/R14` frame 8, the sidewalk rail passes through the tub.

**Credit:**
- In `strips/high/R15` the crew circle evenly, with rigid joint swing, which is the correct toy articulation, and the captain throws his arms up.

**Nuance on Critic B's capture-clock caveat:** it is right for the A/B, since particles rendered in real play before. For the absolute score the particles count, because the strips now show what the game renders.

6.0 stands.

### UI / HUD: 6.5 (mean 6.25)
**Concede:**
- READY overlaps the player cone (`high/desktop/R03`, cone y≈290–335 inside the READY glyph band y≈245–320).
- The panels have no brick identity.
- The phone team-select loses its actions (`high/landscape/R02`, `high/mobile/R02`).

**Rebut:** the R02 phone failure is a mobile-layout regression, and it is already the whole basis of both critics' mobile deductions.
- On desktop the HUD meets the 7 anchor's hierarchy: place, lap and time, item and coins, water, and minimap, in one style with no overlap (`high/desktop/R04`, `high/desktop/R12`).
- Desktop team select shows both buttons (`high/desktop/R02`).
- Results are tidy, with the player row highlighted (`high/desktop/R18`).
- Callouts are clean, with a progress bar (`high/desktop/R16`).

**Codex's "minimap crowds the place badge" in `high/landscape/R04`:** there is a gap of about 10 px and no overlap. Tight, not broken.

6.5 is the evidence-weighted score.

### Typography: 6.5 (mean 6.5)
**Concede:**
- The landscape stat rows are clipped (`high/landscape/R02`).
- The portrait Choose button is clipped at its bottom edge (`high/mobile/R02`). Its label "Choose Engine Six Soakers" is still fully legible: about 75% of the button height is on screen.

**Rebut minor points:**
- The locked-card sub-labels (`high/desktop/R02`) measure about 3.2:1 on navy. They are a deliberate disabled state, which contrast guidance exempts. This is not a type defect.
- "Arcade-retro rather than brick" is not a criterion at 7.
- Critic B's "frequent team-name wrapping" in `high/mobile/R02` produces balanced two-line names with no truncation.

6.5 stands.

### Readability: 6.5 (mean 6.5)
**Concede:**
- Only a sliver of one judge shows behind the booth panel (`high/desktop/R16`, x≈225–255). The judges also stay hidden in `strips/high/R16` frames 1–3.
- The dusk and sunset pack is low-contrast (`high/desktop/R11`).
- Critic B is right that the cone sits over the tub ahead in a dense pack. In `high/desktop/R04` its tip lands on the white-crew captain ahead. In `high/mobile/R04` it is at y≈755 on the rival, with the player tub at y≈950.

**Rebut, Critic A, the dithered rival "covers the lower-left 40% … including the water gauge": overstated.**
- The gauge is HUD drawn on top and reads "39 GAL" in `strips/high/R16` frame 6.
- In `ab/strip-R16`, the other build (A) has an opaque rival in the same place in frames 5–8. The dither lets the player's crew show through it, where before it hid them.
- In `high/desktop/R11` the speckle lies right of a crisp road edge (x≈760–800) and hides no tub or item.

**Rebut the cone's weight:**
- The cone is colour-matched to the player's pennant: yellow on yellow in `high/desktop/R04`, cyan on cyan in `high/desktop/R13`.
- The player's tub is always the nearest, centred tub (`high/desktop/R04`, `high/desktop/R07`, `high/desktop/R08`, `high/desktop/R10`, `high/desktop/R12`, `high/desktop/R13`).

6.5 stands.

### Mobile: 6.5 (mean 6.0)
**Concede:** the team select regressed in both orientations.
- In landscape, Choose and Back are not visible (`high/landscape/R02`). The panel's own rounded bottom border is drawn at y≈758, so this looks like a clipped scroll region, but a still cannot prove it scrolls.
- In portrait, Back is gone and Choose is clipped (`high/mobile/R02`).
- The previous build fit everything (`ab/high-mobile-R02` A, `ab/high-landscape-R02` A).

**Rebut, Critic B's 5.5 ("works but cramped"):** the anchor fits none of the other 14 phone captures.
- Portrait and landscape race frames are framed on purpose (`high/mobile/R04`, `high/mobile/R07`, `high/mobile/R08`, `high/mobile/R17`, `high/landscape/R04`, `high/landscape/R17`).
- The controls never cover the tub.
- Title and results fit with every button in both orientations (`high/mobile/R01`, `high/mobile/R18`, `high/landscape/R01`, `high/landscape/R18`).
- The perf gate passes, and the software-GL phone floor holds 56 fps.

One screen with a small layout fix keeps this below 7 but not at 5.5.

### Authenticity: 7.0 (mean 6.75)
**Concede:**
- The Arlington does not close the race vista. The end of Central Avenue is open hills in `high/desktop/R04` and `high/desktop/R14`.
- R09 has no Goat Rock or ford.
- R17's plaza has no identity.
- The judges are hidden.

**Evidence missed by both critics:**
- The domed bathhouse on the Row has a coloured mosaic band on its drum under the dome (`high/desktop/R14`, around x 400–440, y 150–220), which reads as the Quapaw.
- The Fordyce has its patterned upper storey, with the Arlington's towers behind it (`high/desktop/R05`).
- White-flowered magnolias stand on the Row (`high/desktop/R05`).
- The title names the real event and its June date on Central Avenue (`high/desktop/R01`).
- The race elements are on screen:
  - the water line in gallons on every HUD;
  - Towel, Bath, Soap and Loofah items;
  - a duck and a flag on every tub (`crops/high/R02-preview-captain`);
  - the booth and the Rules of the Row heat (`high/desktop/R16`).

Most of the 7 anchor is met, so 7.0 is within range. It clears the ≥ 6 gate either way.

## Facts a critic got plainly wrong
1. Critic A, characters: "The four pushers on a team are identical clones." `crops/high/R02-preview-captain` shows three different crew faces plus the scowling captain.
2. Critic A, characters: "The figures show no part seams." `crops/high/R03-player-rear` shows the torso and hip seam and separate bevelled blocks.
3. Critic A, materials: "Roads are plain asphalt, not tile." `high/desktop/R09` and `high/desktop/R10` are tile, `high/desktop/R17` is brick paving, and `high/desktop/R08` and `high/desktop/R13` show panel seams.
4. Critic A, lighting: "The wall-base darkening is not measurable." The bottom 26 px median is 100.7 against 109–111 above, on the Fordyce wall in `high/desktop/R05`.
5. Critic A, readability: the dither covers "the water gauge". The gauge is drawn on top and reads "39 GAL" (`strips/high/R16` frame 6).
6. Critic B, gap severity: it rates G-mobile-selector at 5, the severity the rubric uses for IP-check findings. This is a UI layout regression with a known-good prior layout.

## Gaps: adjusted severity and expected gain
| Gap (source) | Critic | Advocate | Why |
|---|---|---|---|
| G-dither-speckle (A) | sev 4, +1.0 | sev 4, **+0.75** | The defect is real. The readability share is small: R11 speckle is off-road, and in R16 the dither reveals the crew an opaque rival hid before (`ab/strip-R16`). Overlaps the dither half of G-forest-repetition. |
| G-painted-boxes (A) | sev 4, +1.0 | sev 4, **+0.75** | Concede the facades and the Arlington grid. Drop the road-seam part: `worlds-1` (7) has a seamless road, and R08, R09, R10 and R13 already show seams or tiles. Same work as G-building-depth; count once. |
| G-no-ao-dusk-murk (A) | sev 4, +1.25 | sev 4, **+1.0** | Concede AO and the dusk fill. Replace the crew/road ≥ 2.0 test, which black teams fail at noon, with the R11 pack-to-road RMS deviation going from 22 to 35 or more. Same work as G-contact-lighting; count once. |
| G-team-select-mobile (A) | sev 4, +1.0 | sev 4, +1.0 | Concede. Same defect as G-mobile-selector. |
| G-course-set-pieces (A) | sev 3, +0.75 | sev 3, +0.75 | Concede. Cause note: this loop changed the ford to tan tiles (CHANGES), so the fix is to restore water, not tiles. |
| G-flat-particles (A) | sev 3, +0.5 | sev 3, +0.5 | Concede. Overlaps G-action-feedback. |
| G-figure-detail (A) | sev 3, +0.5 | **sev 2, +0.25** | The "clones" and "no seams" parts are wrong (see above). What remains is bare head backs and shared skin within a team. |
| G-rim-blowout (A) | sev 2, +0.25 | sev 2, +0.25 | Concede the look. Challenge the cause: the bleached face carries tree-shadow mottling, and its shadowed blotches drop to the leg's base colour (≈37,45,50). That points to sun-lit specular on an up-facing face, so cap specular on dark albedo as well as rim. |
| G-judges-hidden (A) | sev 2, +0.5 | sev 2, +0.5 | Concede (`high/desktop/R16`, `strips/high/R16` frames 1–3). |
| G-barrier-clip (A) | sev 2, +0.25 | sev 2, +0.25 | Concede (`strips/high/R14` frame 8, `high/desktop/R15` rail end). |
| G-brick-hud (A) | sev 2, +0.5 | sev 2, +0.5 | Concede the READY/cone overlap and the plain panels. |
| G-world-edge (A) | sev 2, +0.25 | sev 2, +0.25 | Concede (`high/desktop/R06`). |
| G-mobile-selector (B) | sev 5, M, +1.5 | **sev 4, S, +1.0** | Concede the defect. Severity 5 is out of scale. Effort is S because the prior layout already fit both buttons (`ab/high-mobile-R02` A). The +1.5 also overlaps the ui and typography charges. |
| G-contact-lighting (B) | sev 4, +1.0 | sev 4, +1.0 | Concede. Tub contact shadow already exists (53 against 85 in R04); the gain is in crevice AO. |
| G-building-depth (B) | sev 4, +1.0 | sev 4, **+0.75** | Concede. The landmarks already carry coursing and patterned storeys (`high/desktop/R05`), so the gain is mostly on commercial blocks. Count once with G-painted-boxes. |
| G-forest-repetition (B) | sev 4, +0.5 | **sev 3**, +0.5 | Three species with flowers exist (R05, R12, R08). Repetition is confined to the mountain courses. The dither half duplicates G-dither-speckle. |
| G-action-feedback (B) | sev 3, +1.0 | sev 3, **+0.75** | Concede. Overlaps G-flat-particles; combined animation gain is no more than 1.0. |
| G-player-association (B) | sev 3, +0.5 | **sev 2, +0.25** | Concede the R04 and mobile R04 placement. The cone is colour-matched to the pennant, and the player is always the nearest centred tub. A cheap fix with a small gain. |
| G-tub-part-detail (B) | sev 3, +0.5 | sev 3, +0.5 | Concede: smooth bowl and plain wheels (`crops/high/R02-preview`). |

IP: **clean**. I agree with both critics. The heads are rounded cubes, the torsos straight boxes and the hands blocks (`crops/high/R02-preview-captain`, `crops/high/R04-kart_3`). The new judges and spectators use the same box parts (`high/desktop/R16`), and there is no LEGO name or logo.

```json
{
  "loop": 2,
  "role": "advocate",
  "tier": "high",
  "scores": {
    "characters": {
      "score": 7.0,
      "confidence": 0.6,
      "evidence": [
        { "shot": "crops/high/R02-preview-captain", "note": "four distinct printed faces on one team (scowl, closed smile, raised-brow smile, open grin) with blush prints; translucent water shows the rim's inner wall; bevelled studs; duck" },
        { "shot": "crops/high/R03-player-rear", "note": "crossed-suspender back print; torso and hip are separate bevelled blocks with a visible seam; head backs bare (conceded)" },
        { "shot": "crops/high/R04-kart_3", "note": "different skin tone and teal antenna hats; raised-leg face silvered (100,105,104) vs (51,62,51) shaded (conceded)" },
        { "shot": "high/desktop/R13", "note": "Lather & Linen: white chef caps, pale-mint tub, light-blue captain; distinct from Steam Rangers' brown campaign hats and yellow tub in high/desktop/R03 and R09" },
        { "shot": "high/desktop/R07", "note": "top hats, pink crews and antenna crews separate at chase distance; at least nine hat/shirt sets across R03, R04, R07, R09, R11, R12, R13, R17" }
      ]
    },
    "materials": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "crops/high/R02-preview-captain", "note": "specular follows bevels on hats, studs and duck; water translucent, not flat" },
        { "shot": "high/desktop/R09", "note": "tile road with seams; Critic A's 'roads are plain asphalt' is wrong here, in R10 and R17, and R08/R13 show panel seams" },
        { "shot": "high/desktop/R13", "note": "commercial block is a painted front on a box (conceded)" },
        { "shot": "high/desktop/R06", "note": "Arlington window scatter (conceded)" },
        { "shot": "high/desktop/R11", "note": "dither speckle reproduced: mean |dx| 11.4 in x950-1250, y150-400 (conceded)" }
      ]
    },
    "scenery": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R05", "note": "magnolias with white flowers, studded tree tops, brick crowd behind rails, coursed landmark walls" },
        { "shot": "high/desktop/R12", "note": "slab oaks: a second species, so repetition is mountain-only" },
        { "shot": "high/desktop/R08", "note": "repeated tiered pines, giant near canopy (conceded)" },
        { "shot": "high/desktop/R06", "note": "pale band at the terrain edge, studless field at distance (conceded)" },
        { "shot": "high/desktop/R17", "note": "arena has a perimeter wall, rails, lamps and crowd but no identity (partly conceded)" }
      ]
    },
    "lighting": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R13", "note": "articulated cast shadows of legs and push bars, not blobs: above the 5 anchor" },
        { "shot": "high/desktop/R04", "note": "under-tub 53 vs lit road 85; tree and crowd shadows; no AO (conceded)" },
        { "shot": "high/desktop/R07", "note": "emissive lamp globes and lit shop strips; heads 118 vs road 44 (2.7x) vs 1.1x in daylight R04, so the 'mud' is palette plus missing road light" },
        { "shot": "high/desktop/R05", "note": "wall-base band median 100.7 vs 109-111 above: about 9% darker, measurable but subtle" },
        { "shot": "high/desktop/R11", "note": "sunset pack murky: pack-road RMS deviation 22 vs 50 in R04 (conceded)" }
      ]
    },
    "animation": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "strips/high/R15", "note": "even crew circling with rigid joint swing, captain arms up; flat blue splash discs" },
        { "shot": "strips/high/R14", "note": "slide yaw with dust discs; no kick, no distinct steam; frame 8 rail through the tub (conceded)" },
        { "shot": "strips/high/R16", "note": "crew circle at the stop; no water slosh" }
      ]
    },
    "ui": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "clear place/lap/time/item/water/minimap hierarchy, one style, no overlap" },
        { "shot": "high/desktop/R02", "note": "desktop team select complete with both buttons" },
        { "shot": "high/desktop/R18", "note": "tidy results with player row highlighted" },
        { "shot": "high/desktop/R03", "note": "READY overlaps the player cone (conceded)" },
        { "shot": "high/landscape/R02", "note": "phone team-select actions missing: charged in mobile, not repeated in full here" }
      ]
    },
    "typography": {
      "score": 6.5,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R01", "note": "pixel display face over clean sans, balanced subtitle" },
        { "shot": "high/mobile/R04", "note": "lap, time and place numerals read at a glance at 390 px" },
        { "shot": "high/landscape/R02", "note": "Handling and Water rows clipped (conceded)" },
        { "shot": "high/mobile/R02", "note": "Choose button clipped at its bottom edge, label still fully legible" }
      ]
    },
    "readability": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/desktop/R13", "note": "cyan cone matches the player's cyan pennant; road edges strong" },
        { "shot": "high/mobile/R04", "note": "cone sits over the rival ahead in a dense pack (conceded)" },
        { "shot": "strips/high/R16", "note": "dithered rival lets the player's crew show through; gauge reads 39 GAL in frame 6; ab/strip-R16 A had an opaque rival there" },
        { "shot": "high/desktop/R16", "note": "judges hidden behind the booth panel (conceded)" },
        { "shot": "high/desktop/R11", "note": "speckle off-road right of a crisp edge; dark sunset pack (conceded)" }
      ]
    },
    "mobile": {
      "score": 6.5,
      "confidence": 0.55,
      "evidence": [
        { "shot": "high/mobile/R04", "note": "race frame framed on purpose; controls never cover the tub" },
        { "shot": "high/landscape/R17", "note": "minimap top right off the road; tub clear" },
        { "shot": "high/mobile/R18", "note": "results fit with both buttons; title fits in high/mobile/R01 and high/landscape/R01" },
        { "shot": "high/landscape/R02", "note": "Choose and Back not visible; regression against ab/high-landscape-R02 A (conceded)" },
        { "shot": "high/mobile/R02", "note": "Back missing, Choose clipped; regression against ab/high-mobile-R02 A (conceded)" }
      ]
    },
    "authenticity": {
      "score": 7.0,
      "confidence": 0.55,
      "evidence": [
        { "shot": "high/desktop/R14", "note": "the Row reads: domed bathhouse with a coloured mosaic drum band (Quapaw), tile roofs, promenade wall, awnings opposite" },
        { "shot": "high/desktop/R05", "note": "Fordyce patterned upper storey, white-flowered magnolias, Arlington towers behind" },
        { "shot": "crops/high/R02-preview-captain", "note": "duck and flag on the tub; gallon water line on every HUD" },
        { "shot": "high/desktop/R16", "note": "judge booth and Rules of the Row heat; judges hidden (conceded)" },
        { "shot": "high/desktop/R04", "note": "Arlington does not close the race vista (conceded)" }
      ]
    }
  },
  "ip": { "clean": true, "notes": "Agree with both critics: rounded-cube heads, straight box torsos, block hands; judges and spectators use the same box parts; no LEGO name or logo." },
  "gaps": [
    { "id": "G-dither-speckle", "category": "readability", "expectedGain": 0.75, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R11", "strips/high/R16", "ab/strip-R16", "high/desktop/R18"], "fix": "Critic A's fix stands (stable dither resolved by alpha-to-coverage or real alpha with a depth pre-pass; keep trees out of the camera corridor). Gain lowered: R11 speckle is off-road, and the R16 rival dither reveals the crew an opaque rival hid before, so most of the gain is materials and scenery. Overlaps the dither half of G-forest-repetition." },
    { "id": "G-painted-boxes", "category": "materials", "expectedGain": 0.75, "severity": 4, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R13", "high/desktop/R06"], "benchmark": "worlds-1", "fix": "Instanced brick facade kit for commercial blocks and a regular Arlington window grid. Drop the road tile-seam part: worlds-1's road is seamless, and R08, R09, R10 and R13 already show seams or tiles. Same work as G-building-depth; count once." },
    { "id": "G-no-ao-dusk-murk", "category": "lighting", "expectedGain": 1.0, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R07", "high/desktop/R11", "high/desktop/R04"], "benchmark": "worlds-4", "fix": "AO on High (vertex AO on Low), lamp light reaching the road at dusk, more dusk fill. Replace the crew/road >= 2.0 test, which black-uniformed teams fail at noon (R04 torso 63 vs road 85), with an R11 pack-to-road RMS luminance deviation >= 35 (now 22) and visible crevice darkening. Same work as G-contact-lighting; count once." },
    { "id": "G-team-select-mobile", "category": "mobile", "expectedGain": 1.0, "severity": 4, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R02", "high/mobile/R02", "ab/high-mobile-R02", "ab/high-landscape-R02"], "fix": "Sticky Choose/Back footer with only the grid scrolling; landscape two-column. Test: both buttons fully in view at 844x390 and 390x844 with no clipped stat row. Same defect as G-mobile-selector; count once across mobile, ui and typography." },
    { "id": "G-course-set-pieces", "category": "authenticity", "expectedGain": 0.75, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R17"], "fix": "Goat Rock outcrop and a water ford in R09 (this loop replaced the ford with tan tiles, so restore water rather than tiles); an identifying feature in Hill Wheatley Plaza; a hero prop per mountain course." },
    { "id": "G-flat-particles", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15", "high/desktop/R17"], "benchmark": "drive-3", "fix": "Brick-piece particles, visible hot-steam plates while charging, FOV kick on slide release and hits, tilted water plane. Overlaps G-action-feedback; combined gain no more than 1.0." },
    { "id": "G-figure-detail", "category": "characters", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R03-player-rear", "crops/high/R02-preview-captain"], "benchmark": "drive-4", "fix": "Hair or hat-back print and per-pusher skin variation. The clone and no-seam parts of this gap are wrong: faces already vary (R02-preview-captain) and the torso/hip seam is visible (R03-player-rear)." },
    { "id": "G-rim-blowout", "category": "materials", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["crops/high/R04-kart_3"], "fix": "Cap specular as well as rim on dark albedo. The silvered face carries tree-shadow mottling, and its shadowed blotches return to about (37,45,50), which points to sun-lit specular rather than only the sky rim term. Test: the raised-leg face is within 1.6x the shaded leg." },
    { "id": "G-judges-hidden", "category": "authenticity", "expectedGain": 0.5, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R16", "strips/high/R16"], "fix": "Stand both judges on the road side of the booth with clipboards raised. Test: both visible in R16 and strip frames 1-3." },
    { "id": "G-barrier-clip", "category": "animation", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["strips/high/R14", "high/desktop/R15"], "fix": "Rail colliders and end posts. Test: no rail through the tub in R14 frame 8." },
    { "id": "G-brick-hud", "category": "ui", "expectedGain": 0.5, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/desktop/R03"], "benchmark": "drive-3", "fix": "Studded-plate HUD framing; hide the cone during the countdown or move READY. Test: no overlap in R03." },
    { "id": "G-world-edge", "category": "scenery", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R06"], "fix": "Terrain skirt to the horizon, fog matched to the sky, scattered props on open grass. Test: no pale band in R06." },
    { "id": "G-mobile-selector", "category": "mobile", "expectedGain": 1.0, "severity": 4, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R02", "high/landscape/R02", "ab/high-mobile-R02"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Visible action footer with independently scrolling details. Severity 5 is out of scale for a layout regression the previous build did not have, and effort is S. Gain 1.0 because this is the only failing phone screen of 16. Same defect as G-team-select-mobile; count once." },
    { "id": "G-contact-lighting", "category": "lighting", "expectedGain": 1.0, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R06", "crops/high/R02-preview"], "benchmark": "worlds/worlds-1.jpg", "fix": "Crevice and contact occlusion. Tub ground contact already exists (R04 under-tub 53 vs road 85), so target wheel wells, tub interior, under-hat and ledges. Same work as G-no-ao-dusk-murk; count once." },
    { "id": "G-building-depth", "category": "scenery", "expectedGain": 0.75, "severity": 4, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06", "high/desktop/R13"], "benchmark": "worlds/worlds-1.jpg", "fix": "Recessed windows, projecting trim, stepped roofs. Landmarks already have coursing and patterned storeys (R05), so the gain is mostly on commercial blocks (R13). Count once with G-painted-boxes." },
    { "id": "G-forest-repetition", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R08", "high/desktop/R10", "high/desktop/R11"], "benchmark": "2k-drive/drive-1.jpg", "fix": "Vary the mountain pines and scale down near-road canopies. Three species with flowers already exist (R05 magnolias, R12 oaks, R08 pines), so this is a mountain-course issue; the dither half duplicates G-dither-speckle." },
    { "id": "G-action-feedback", "category": "animation", "expectedGain": 0.75, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Shaped toy droplets, directional steam, water displacement, recovery poses. Overlaps G-flat-particles; combined animation gain no more than 1.0." },
    { "id": "G-player-association", "category": "readability", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/mobile/R04", "high/desktop/R13"], "fix": "Anchor the cone lower over the player captain. Conceded: it lands on the rival ahead in R04 and mobile R04. Severity and gain lowered because the cone is colour-matched to the player's pennant and the player is always the nearest centred tub." },
    { "id": "G-tub-part-detail", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R02-preview", "crops/high/R04-kart_3"], "benchmark": "2k-drive/drive-4.jpg", "fix": "Tub-body part boundaries, wheel and hub detail, team print motifs. Conceded as given." }
  ],
  "verdict": "continue"
}
```
