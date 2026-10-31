# Judge ruling: loop 2 (high tier)

Capture paths are relative to `games/Cart Racing/screenshots/review-loop-2/`. "L" is Rec. 709 luminance (0–255), measured with PIL on the full-size PNGs in my own scratch folder. Portrait frames are 780×1688 (390@2×), not 1560×1688 as the prosecutor wrote. His portrait coordinates still land on the content he describes, so none of his findings change.

## Verdict
**Continue. Judged total 61.5 / 100** (Critic A 63.0, Critic B 62.0, prosecutor 57.5, advocate 64.0). This loop's main gains are the brick trees and brick crowd replacing the painted cards, the suspender back print, and the fixed tub rim with push bars. Four new faults cut into those gains, and I verified all four in the captures:
- The screen-door dither on near trees and rivals.
- Barrier rails that ignore their posts and run out over the road.
- A player cone that sits on the rival ahead in packed frames.
- A phone team select that loses its action buttons.

Only authenticity (6.5, gate ≥ 6) meets its gate. Measured gates: perf passes, fidelity is not measured, and IP is clean (my ruling is below).

No category had critics more than 1.0 apart, or prosecutor and advocate more than 1.0 apart. The widest splits were exactly 1.0: mobile between the critics, and ui, mobile and authenticity between the prosecutor and advocate. I opened the cited captures for every category anyway and settled each factual dispute below.

## Factual disputes settled
| Claim | Ruling | What I checked |
|---|---|---|
| Critic A: the player cone makes the player's tub "instant in every race frame" | **Wrong.** Prosecutor right, and Codex's "ambiguous" understates it. | In a 2× zoom of `high/desktop/R04` (x440–780, y280–620), the cone's tip touches the white-capped rival captain ahead. The player's red caps are about 55 px lower. In `high/mobile/R04` the cone (y≈730–790) sits over the white rival, and the player's hats are at y≈880. `high/desktop/R03` has the same problem, plus READY drawn across the cone. Where the pack is spread out the cone works: `high/desktop/R13` puts it directly above the player. |
| Prosecutor: barrier rails run across the sidewalk, through spectators, and out over the road | **Confirmed.** Neither critic saw it. | In a 1.6× zoom of `high/desktop/R13` (x0–520, y300–620), the rails cut through the blue posts at an angle, run through a spectator, and end about 170 px past the curb over the asphalt. The same fault shows in `high/desktop/R01`, `R03`, `R05`, `R07`, `R15` and `strips/high/R14` frame 3. |
| Prosecutor: pine tops float | **Confirmed.** | In `high/desktop/R08`, column x726 is sky (167,204,233) from y68 to y76, between the top bricks and the next tier. A 2.5× zoom shows three disconnected blocks at the top. |
| Dither noise (A, prosecutor, advocate) | **Confirmed and widespread.** | Mean \|Δx\| of L: 11.4 in `high/desktop/R11` (x950–1250, y150–400) against 0.86 for the left canopy; 12.9 in `high/desktop/R15` (x0–140, y190–330); 7.7 in `R08` (x0–250, y60–250); 7.6 in `R16` (x10–250, y90–430); 5.1 in `R04` (x0–180, y100–380). Undithered canopy in `R04` measures 0.44. |
| Critic A: the dithered rival covers "the water gauge" | **Wrong.** Advocate right. | `strips/high/R16` frame 6 at 2×: the gauge is drawn on top and reads "39 GAL". The rival is still a noisy ghost over the lower-left quarter of the frame. |
| Critic A: "the four pushers are identical clones" | **Wrong on faces.** Advocate right. | `crops/high/R02-preview-captain` shows a scowling captain, two different closed smiles and an open grin. Bodies match within a team, which is correct. |
| Critic A: "no part seams" | **Partly wrong.** | `crops/high/R03-player-rear`: torso, hips, legs, arms and head are separate bevelled blocks with dark joins. There are no mould lines. |
| Prosecutor: the back prints are soft at 2× | **Confirmed.** | In `crops/high/R03-player-rear` the X edges are visibly blurred next to crisp geometry edges. The head backs are bare skin blocks. |
| Critic A: "roads are plain asphalt" | **Half right.** | City roads are plain asphalt. Mountain roads are tiles (`high/desktop/R09`, `R10`) and the plaza is brick paving (`R17`). The advocate treats the dark lines in `R08` and `R13` as "panel seams", and that is wrong. A 1.3× zoom of `R13` (x760–1280, y380–640) shows a hairline that continues the yellow dash past its end and crosses a second line at the junction. These are mesh seams, so the prosecutor is right. |
| Prosecutor: the Arlington windows are two misregistered layers | **Confirmed.** | A 3× zoom of `high/desktop/R06` (x540–800, y300–480) shows painted framed windows, with separate navy panels offset over them that half-cover the frames. |
| Prosecutor: the horizon haze does not match the sky | **Confirmed.** | In `high/desktop/R06`, the band (x40–200, y440–470) is L 183 (156,191,183). That is brighter than both the hills above (L 150) and the grass below (L 144), and greener than the sky. The hills are a blurred photographic strip. |
| Critic A: the wall-base darkening "is not measurable" | **Wrong.** Advocate right. | On the Fordyce's right wall in `high/desktop/R05` (columns x1000, x1020, x1040), the 26 px above the grass line have a median L of 100.9–101.7, against 110.5–111.4 above. That is about 9% darker: subtle, but there. |
| Prosecutor: the crew's feet have no contact shadow | **Confirmed.** | In `crops/high/R03-kart_5`, L is 88.5 just in front of the toes against 91.6 on open road. At 3× the boots sit on clean asphalt. The tub's sun shadow does ground the chassis: 51.0 under the tub against 91.8 on lit road in `high/desktop/R04`. |
| Cause of the silvered leg (A says rim light; the advocate says specular as well) | **Advocate right.** | In `crops/high/R04-kart_3` the raised dark-green leg face averages (124,128,126) over x340–400, y460–520. At 2.5× it carries tree-shadow mottling, so a sun-lit specular or reflection term drives it, not only the sky rim. Cap both. |
| Prosecutor: spray "covers the whole tub and captain" in `strips/high/R15` frames 3–6 | **Overstated.** | In frame 4 at 2×, the discs cover the tub body, but the captain's hat and face stay visible. |
| Prosecutor: the marker skews when the tub yaws | **Confirmed.** | In `strips/high/R14` frames 3–8 it becomes a sideways triangle, offset from the tub. |
| Phone team select (all four reviewers) | **Confirmed regression.** | `high/landscape/R02` shows no Choose and no Back, and the Handling and Water rows are cut. `high/mobile/R02` clips Choose and has no Back. Side A of `ab/high-landscape-R02` and `ab/high-mobile-R02` fits both buttons. |
| Prosecutor: portrait results drop the team swatches | **Confirmed, minor.** | `high/mobile/R18` has no swatches, and each water cell stacks "gal" over "CLEAN". `high/desktop/R18` has swatches. |

## Category rulings

**Characters: 6.5** (A 6.5, B 7, P 6.5, Adv 7)
- The close-ups hold up well. `crops/high/R02-preview-captain` and `crops/high/R02-preview` show varied printed faces, studded rim and chassis, push bars, a glossy duck and translucent water. I found no gaps and no z-fighting.
- Two 7-anchor clauses fail:
  - The tub body is a smooth bowl on plain disc wheels (`crops/high/R03-kart_5`), not recognisable brick parts.
  - The back print is soft at 2× and the head backs are bare (`crops/high/R03-player-rear`).
- At chase distance every team wears the same X back print. Teams separate by hat. In the zoom of `high/desktop/R04`, the two white-shirt teams ahead differ only by brown campaign hats against white caps. That is distinct, but thin.
- The rim and specular silvering of dark parts in `crops/high/R04-kart_3` is a further blemish.
- A and the prosecutor have the better-supported score. Codex itself conceded the bowl.

**Materials: 6.0** (A 6, B 6, P 5.5, Adv 6)
- Figures and tubs read as ABS plastic. Specular follows the bevels and the water is translucent (`crops/high/R02-preview-captain`). Landmarks carry running-bond courses (`high/desktop/R05`).
- The world around them is still painted card:
  - Magnified, blurred facade textures sit beside crisp figures (`crops/high/R03-kart_5`).
  - The Arlington's window layers are misregistered (`high/desktop/R06`).
  - Mesh hairlines cross the roads (`high/desktop/R13`, `high/desktop/R08`).
  - Some pine tiers are tan, off the green palette (`high/desktop/R06`, `high/desktop/R09`).
  - The dither speckle reads as a render fault (`high/desktop/R11`).
- The prosecutor's facts are right, but the chase view is dominated by convincing plastic figures and tubs, so 6.0 rather than 5.5.

**Scenery: 6.0** (A 6, B 6, P 5.5, Adv 6)
- Brick trees in three species, a brick crowd, the studded baseplate and coursed landmarks lift the world well clear of the 5 anchor (`high/desktop/R05`, `high/desktop/R12`).
- It falls short of 7 on:
  - The broken rail dressing in every Row frame (`high/desktop/R13`, `high/desktop/R15`).
  - Floating pine tiers (`high/desktop/R08`).
  - The bright horizon band and empty fields (`high/desktop/R06`).
  - Painted-box commercial blocks (`high/desktop/R13`).
  - No per-course set pieces (`high/desktop/R09`, `high/desktop/R17`).
- The prosecutor was right on every fact. I hold 6.0 because the cohesion gain is just as visible.

**Lighting: 6.0** (A 6, B 5.5, P 5.5, Adv 6)
- The captures beat the 5 anchor:
  - Real articulated cast shadows from figures, trees and the crowd (`high/desktop/R13`, `high/desktop/R09`).
  - A grounded tub chassis (51.0 against 91.8 in `high/desktop/R04`).
  - Deliberate dusk and sunset palettes, with emissive lamps and lit shop strips (`high/desktop/R07`, `high/desktop/R11`).
- Most 7 clauses fail:
  - There is no AO.
  - The feet have no contact shadow (`crops/high/R03-kart_5`).
  - The haze is brighter than both its neighbours (`high/desktop/R06`).
  - No lamp pools reach the road: the dusk road is L 44 in `R07` and the sunset road L 37 in `R11`.
- The advocate is right that 5.5 sits too close to the 5 anchor.

**Animation and feel: 6.0** (all 6, except P 5.5)
- `strips/high/R15` and `strips/high/R16` show even circling with rigid joint swing, the correct toy articulation.
- `strips/high/R14` falls short:
  - Opaque, flat beige and blue discs.
  - No steam during the hot-steam charge.
  - No camera kick.
  - The marker skews.
  - In frame 8 a rail passes through the crew with no reaction.
- The tub water never sloshes.
- One of the three 7 clauses is met. I accept the advocate's point that the strips now show what the game renders.

**UI / HUD: 6.0** (A 6.5, B 6, P 5.5, Adv 6.5)
- The desktop HUD hierarchy is clear and consistent (`high/desktop/R04`), and results are tidy (`high/desktop/R18`).
- But:
  - Menus are not consistent across viewports. The team-select actions are missing in `high/landscape/R02` and clipped in `high/mobile/R02`, and `high/mobile/R18` drops the swatches.
  - READY overlaps the cone in `high/desktop/R03`.
  - The panels carry nothing of the brick world.
- That fails two of the 7 anchor's three clauses. Codex is closest.

**Typography: 6.5** (A 6.5, B 6.5, P 6, Adv 6.5)
- The pixel display face over a clean sans forms a clear scale, and numerals read at a glance (`high/desktop/R01`, `high/desktop/R18`, `high/mobile/R04`).
- "Nothing clipped" fails on the same team-select layout (`high/landscape/R02`, `high/mobile/R02`). The labels stay legible.
- The orphaned "business shown." line in `high/landscape/R01` is minor. The clipping is already charged under mobile and ui, so I hold 6.5.

**Readability: 6.0** (A 6.5, B 6.5, P 6, Adv 6.5)
- I score below both critics because the verified evidence contradicts Critic A's premise:
  - The cone lands on the rival ahead in `high/desktop/R04`, `high/desktop/R03`, `high/mobile/R04` and `high/mobile/R03`.
  - Dither noise of 5–13 \|Δx\| (against 0.44 undithered) covers parts of `R04`, `R08`, `R11`, `R15` and `R16`.
  - Rails break the road edge in `high/desktop/R13` and `high/desktop/R15`.
  - The judges are hidden (`high/desktop/R16`).
- Road edges and pickups do read well (`high/desktop/R10`, `high/mobile/R17`), and the player's tub is always the nearest centred tub, so not lower.

**Mobile: 6.0** (A 6.5, B 5.5, P 5.5, Adv 6.5)
- The race frames meet the 7 anchor. Thumb controls never cover the tub, and portrait and landscape are framed on purpose (`high/mobile/R04`, `high/landscape/R04`, `high/landscape/R17`). Software GL holds 56 fps.
- The team select, a mandatory screen, fails in both orientations (`high/landscape/R02`, `high/mobile/R02`), and the cone misattribution is worst in portrait.
- Codex's 5.5 ignores the 14 good phone frames. A's 6.5 under-weights a screen the player must pass through.
- The prosecutor's point about Low-tier crews casting no shadow is true (`low/mobile/R04`) but minor, so I don't count it.

**Authenticity: 6.5** (A 6.5, B 7, P 6, Adv 7)
- The Row reads:
  - The domed bathhouse with its mosaic drum band, tile roofs and the promenade (`high/desktop/R14`).
  - The Fordyce's patterned storey (`high/desktop/R05`).
  - The Arlington's twin towers (`high/desktop/R06`).
- The race ritual is on screen (`high/desktop/R16`, `strips/high/R16`).
- Two named 7 clauses fail:
  - The Arlington does not close the Central Avenue vista (`high/desktop/R04`, `high/desktop/R14` end in open sky and a blue strip).
  - The mountains are a blurred photographic strip, not the Ouachitas (`high/desktop/R06`, zoomed).
- Goat Rock and the ford are absent (`high/desktop/R09`), and the judges are hidden. 6.5 clears the gate.

## IP
**Clean.** All four reviewers report clean, and I agree:
- `crops/high/R02-preview-captain` shows rounded-cube heads on short neck stubs, straight-sided box torsos and rounded block hands. There are no C-hands and no cylinder heads.
- At 2× in `high/desktop/R16` (the booth zoom), the new judge and spectators use the same box parts.
- There is no LEGO name or logo in `high/desktop/R01`, `high/desktop/R02`, `high/desktop/R18` or any race frame. The title footer names the real event with a non-affiliation note.

## Ranked gaps (top 12, by expected gain ÷ effort)
1. **G-team-select-mobile** (mobile + ui + typography; WS6; S; severity 4; +1.25)
   - Merges A's G-team-select-mobile and Codex's G-mobile-selector.
   - Severity is 4, not 5: this is a regression from a known-good layout, not an IP hit.
2. **G-barrier-rail-orientation** (scenery + readability; WS5; S; severity 4; +0.75)
   - Rails built from post-to-post vectors, plus the floating-pine and tan-pine fixes in the same prop pass.
   - Absorbs A's G-barrier-clip cause: this is a placement bug, not only collision.
3. **G-marker-on-rival** (readability + mobile; WS6; S; severity 3; +0.75)
   - Merges Codex's G-player-association, the READY overlap from G-brick-hud, and the R14 skew.
4. **G-no-ao-dusk-murk** (lighting + readability; WS1; M; severity 4; +1.25)
   - Merges Codex's G-contact-lighting.
   - Replaces A's crew/road ≥ 2.0 test, which black-uniformed teams fail at noon, with contact, lamp-pool and pack-contrast tests.
5. **G-dither-speckle** (readability + materials + scenery; WS1; M; severity 4; +1.0)
   - Absorbs the dither half of Codex's G-forest-repetition.
6. **G-judges-hidden** (authenticity + readability; WS5; S; severity 2; +0.5)
   - Includes replacing the flat flag board with a feather-flag shape.
7. **G-surface-registration** (materials; WS4; S; severity 2; +0.5)
   - The Arlington window layers plus the road mesh hairlines.
8. **G-ouachita-backdrop-vista** (authenticity + scenery + lighting; WS4; M; severity 3; +1.0)
   - Merges A's G-world-edge with the prosecutor's backdrop gap.
9. **G-course-set-pieces** (authenticity + scenery; WS4; M; severity 3; +0.75)
   - The ford gets water, not the tan tiles this loop added.
10. **G-action-feedback** (animation; WS3; M; severity 3; +0.75)
    - Merges G-flat-particles, G-action-feedback, G-spray-occlusion and the rail-contact response.
11. **G-figure-tub-detail** (characters; WS2; M; severity 3; +0.5)
    - Merges G-figure-detail, G-tub-part-detail, G-print-and-stud-resolution and G-rim-blowout.
    - Drops the wrong "clones" and "no seams" items.
12. **G-painted-boxes** (materials + scenery; WS4; L; severity 4; +1.0). **The loop's big lever.**
    - The painted commercial fronts are the largest surface area in every city frame and the main thing holding materials and scenery below 7.
    - Merges Codex's G-building-depth.

Dropped below the cut:
- Low-tier contact blobs (+0.25).
- Studded-plate HUD framing (+0.5 for M).
- Portrait results swatches (+0.25).

```json
{
  "loop": 2,
  "role": "judge",
  "tier": "high",
  "verdict": "continue",
  "scores": {
    "characters": {
      "score": 6.5,
      "confidence": 0.75,
      "evidence": [
        { "shot": "crops/high/R02-preview-captain", "note": "varied printed faces (scowl, two smiles, grin), studded rim, translucent water; no gaps or z-fighting; Critic A's 'clones' wrong" },
        { "shot": "crops/high/R03-player-rear", "note": "torso/hip/limb parts separate with joins (seams exist); X back print soft at 2x; head backs bare" },
        { "shot": "crops/high/R03-kart_5", "note": "tub body a smooth bowl on plain disc wheels, not brick parts" },
        { "shot": "crops/high/R04-kart_3", "note": "dark raised leg silvered to (124,128,126), with tree-shadow mottling" },
        { "shot": "high/desktop/R04", "note": "2x zoom: two white-shirt yellow-X teams ahead differ only by hat; every team shares the X back" }
      ]
    },
    "materials": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "crops/high/R02-preview-captain", "note": "ABS read on figures and tub: specular follows bevels, water translucent" },
        { "shot": "crops/high/R03-kart_5", "note": "magnified blurred painted facade beside crisp figures" },
        { "shot": "high/desktop/R06", "note": "3x zoom: navy window panels offset over painted windows (two layers out of register); tan pine tiers" },
        { "shot": "high/desktop/R13", "note": "mesh hairlines continue the centre dash and cross at the junction; painted-box commercial block" },
        { "shot": "high/desktop/R11", "note": "dither speckle |dx| 11.4 vs 0.86 undithered canopy" }
      ]
    },
    "scenery": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R05", "note": "brick magnolias and oaks, brick crowd, studded baseplate, coursed landmark" },
        { "shot": "high/desktop/R13", "note": "rails cross the posts at an angle, through a spectator, ~170 px over the asphalt" },
        { "shot": "high/desktop/R08", "note": "pine top floats: sky (167,204,233) at x726, y68-76 between tiers" },
        { "shot": "high/desktop/R06", "note": "horizon band L 183 brighter than hills (150) and grass (144); empty fields" },
        { "shot": "high/desktop/R17", "note": "plaza an empty brick disc with two box buildings" }
      ]
    },
    "lighting": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "tub sun shadow grounds the chassis: 51.0 under tub vs 91.8 lit road; no AO" },
        { "shot": "crops/high/R03-kart_5", "note": "no foot contact: 88.5 at the toes vs 91.6 open road" },
        { "shot": "high/desktop/R07", "note": "deliberate dusk palette with emissive lamps; road L 44, no lamp pools" },
        { "shot": "high/desktop/R06", "note": "haze (156,191,183) not matched to sky; flat-lit facades" },
        { "shot": "high/desktop/R05", "note": "wall base ~9% darker (median 101 vs 111): present but subtle" }
      ]
    },
    "animation": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "strips/high/R15", "note": "even circling, rigid joint swing; flat cyan discs cover tub body, captain still visible in frame 4" },
        { "shot": "strips/high/R14", "note": "opaque beige/blue discs, no steam, no camera kick, marker skews frames 3-8, rail through crew in frame 8" },
        { "shot": "strips/high/R16", "note": "circle ritual reads; no water slosh; rival dither ghost frames 4-8" }
      ]
    },
    "ui": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "clear place/lap/time/item/water/minimap hierarchy in one style, nothing brick-themed" },
        { "shot": "high/landscape/R02", "note": "team select has no Choose or Back on screen" },
        { "shot": "high/mobile/R02", "note": "Choose clipped, Back absent" },
        { "shot": "high/desktop/R03", "note": "READY drawn across the player cone" },
        { "shot": "high/mobile/R18", "note": "portrait results drop the team swatches shown in high/desktop/R18" }
      ]
    },
    "typography": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/desktop/R01", "note": "pixel display face over clean sans, clear scale, balanced subtitle" },
        { "shot": "high/mobile/R04", "note": "lap, time and place numerals read at a glance at 390 px" },
        { "shot": "high/landscape/R02", "note": "Handling and Water rows clipped by the panel edge" },
        { "shot": "high/landscape/R01", "note": "footer orphans 'business shown.'" }
      ]
    },
    "readability": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "2x zoom: cone tip on the white-capped rival captain; player's hats ~55 px lower" },
        { "shot": "high/mobile/R04", "note": "cone y~730-790 over the rival; player hats at y~880" },
        { "shot": "high/desktop/R15", "note": "dither |dx| 12.9 vs 0.44 undithered; rails across the edge line" },
        { "shot": "high/desktop/R16", "note": "one judge visible only as a sliver behind the booth board" },
        { "shot": "high/desktop/R10", "note": "road edges and glowing pickups read clearly" }
      ]
    },
    "mobile": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/mobile/R04", "note": "race frame framed on purpose; controls never cover the tub" },
        { "shot": "high/landscape/R17", "note": "minimap top right off the road; tub clear" },
        { "shot": "high/landscape/R02", "note": "mandatory team select: actions off-screen, stat rows clipped" },
        { "shot": "high/mobile/R02", "note": "Choose clipped, Back missing, tub wheels cut by the panel" },
        { "shot": "ab/high-landscape-R02", "note": "the other build fits both buttons: a layout regression" }
      ]
    },
    "authenticity": {
      "score": 6.5,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R14", "note": "the Row reads: domed bathhouse with mosaic drum band, tile roofs, promenade" },
        { "shot": "high/desktop/R06", "note": "Arlington twin towers read; 'Ouachitas' are a blurred photographic strip over a pale band" },
        { "shot": "high/desktop/R04", "note": "Central Avenue vista ends in open sky and a blue strip, not the Arlington" },
        { "shot": "high/desktop/R09", "note": "no Goat Rock, no ford water" },
        { "shot": "strips/high/R16", "note": "judge-stop ritual, booth and callout on screen; judges hidden" }
      ]
    }
  },
  "ip": {
    "clean": true,
    "notes": "All four reviewers report clean; confirmed. crops/high/R02-preview-captain: rounded-cube heads on neck stubs, straight box torsos, rounded block hands (no C-hands, no cylinder heads). high/desktop/R16 booth zoom: judges and spectators use the same box parts. No LEGO name or logo in R01, R02, R18 or race frames; the footer names the real event with a non-affiliation note."
  },
  "gaps": [
    {
      "id": "G-team-select-mobile",
      "category": "mobile",
      "expectedGain": 1.25,
      "severity": 4,
      "effort": "S",
      "workstream": "WS6",
      "evidence": ["high/landscape/R02", "high/mobile/R02", "ab/high-landscape-R02", "ab/high-mobile-R02"],
      "benchmark": "2k-drive/drive-3.jpg",
      "fix": "Make Choose and Back a fixed footer outside the panel's scroll region (flex column, footer flex: none, panel max-height 100dvh minus safe areas); landscape: two columns, the 4x3 team grid on the left, details, stats and both buttons on the right; portrait: cap the tub preview height so panel plus footer fit 844 px. Test: at 844x390 and 390x844, both buttons fully inside the viewport, Handling and Water rows unclipped, and the tub's wheels clear of the panel. Gain split +0.75 mobile, +0.25 ui, +0.25 typography. Merges G-mobile-selector; severity 4 (regression from a known-good layout)."
    },
    {
      "id": "G-barrier-rail-orientation",
      "category": "scenery",
      "expectedGain": 0.75,
      "severity": 4,
      "effort": "S",
      "workstream": "WS5",
      "evidence": ["high/desktop/R13", "high/desktop/R15", "high/desktop/R05", "high/desktop/R03", "high/desktop/R01", "strips/high/R14", "high/desktop/R08"],
      "fix": "Build each rail segment from consecutive post positions (yaw from the post-to-post vector, length equal to post spacing), keep runs at least 0.3 m on the sidewalk side of the curb, end every run on a post, and skip segments whose footprint hits a spectator or lamp. In the same prop pass, run a continuous 1x1 core through each pine's full height and replace the tan pine tint with a green. Test: in R01, R03, R05, R13 and R15 no rail pixel lies road-side of the curb line and every rail ends at a post; in R08, column x722-730 shows no sky between tiers. Gain split +0.5 scenery, +0.25 readability."
    },
    {
      "id": "G-marker-on-rival",
      "category": "readability",
      "expectedGain": 0.75,
      "severity": 3,
      "effort": "S",
      "workstream": "WS6",
      "evidence": ["high/desktop/R04", "high/mobile/R04", "high/mobile/R03", "high/desktop/R03", "strips/high/R14"],
      "fix": "Anchor the cone about 0.3 m above the player captain's hat, cap its on-screen width at 28 CSS px, keep it a camera-facing upright billboard (no yaw skew), and hide it during the countdown; if its screen box overlaps a rival crew, drop it to hat height or switch to a team-colour ground ring under the player's tub. Test: in desktop R03 and R04 and mobile R03 and R04 the tip is within 20 CSS px of the player captain's hat and overlaps no rival; in strips/high/R14 frames 3-8 it stays a symmetric upright triangle; no overlap with READY in R03. Gain split +0.5 readability, +0.25 mobile."
    },
    {
      "id": "G-no-ao-dusk-murk",
      "category": "lighting",
      "expectedGain": 1.25,
      "severity": 4,
      "effort": "M",
      "workstream": "WS1",
      "evidence": ["crops/high/R03-kart_5", "high/desktop/R07", "high/desktop/R11", "high/desktop/R06"],
      "benchmark": "worlds/worlds-4.jpg",
      "fix": "Half-res SSAO or GTAO on High and baked vertex AO on building bases and props on Medium and Low; a soft contact-shadow decal under each boot and wheel; at dusk and sunset, lamp light that pools on the road (point lights on High, projected light decals on Low) and about 30% more hemisphere fill. Test: road at the crew's toes in crops/high/R03-kart_5 at most 0.8x open road (now 88.5 vs 91.6); in R07 road within 3 m of a lit lamp at least 1.3x road between lamps; R11 pack-box RMS luminance deviation from road at least 35 (now about 22). These replace the crew/road >= 2.0 test, which black-uniformed teams fail at noon. Gain split +1.0 lighting, +0.25 readability. Merges G-contact-lighting."
    },
    {
      "id": "G-dither-speckle",
      "category": "readability",
      "expectedGain": 1.0,
      "severity": 4,
      "effort": "M",
      "workstream": "WS1",
      "evidence": ["high/desktop/R11", "high/desktop/R15", "high/desktop/R08", "high/desktop/R09", "strips/high/R16"],
      "fix": "Replace the per-pixel screen-door fade with alpha-to-coverage under MSAA (or a stable 4x4 Bayer pattern plus a 1-px blur on the faded layer), keep tree trunks at least 9 m from the racing line so canopies rarely enter the fade band, and fade rivals only where they overlap the player's tub. Test: mean |dx| of L at most 3.0 in R11 x950-1250,y150-400 (now 11.4), R15 x0-140,y190-330 (now 12.9) and R08 x0-250,y60-250 (now 7.7). Gain split +0.5 readability, +0.25 materials, +0.25 scenery."
    },
    {
      "id": "G-judges-hidden",
      "category": "authenticity",
      "expectedGain": 0.5,
      "severity": 2,
      "effort": "S",
      "workstream": "WS5",
      "evidence": ["high/desktop/R16", "strips/high/R16"],
      "fix": "Stand both striped judges on the road side of the booth, facing traffic, with clipboards raised, and replace the flat rectangular flag board with a feather-flag shape (curved top, tapered free edge) set beside them. Test: both judges fully visible, unoccluded by booth or flag, in high/desktop/R16 and strips/high/R16 frames 1-3. Gain split +0.25 authenticity, +0.25 readability."
    },
    {
      "id": "G-surface-registration",
      "category": "materials",
      "expectedGain": 0.5,
      "severity": 2,
      "effort": "S",
      "workstream": "WS4",
      "evidence": ["high/desktop/R06", "high/desktop/R13", "high/desktop/R08"],
      "fix": "Snap the Arlington's navy window panels to the painted window grid, or remove the painted windows under them; weld road-strip vertices at centrelines and junctions and exclude road meshes from the seam-darkening term. Test: in R06 each panel covers exactly one painted window with no painted frame beside it; in R08 and R13 no dark line more than 15 L below the road and longer than 20 px outside painted markings."
    },
    {
      "id": "G-ouachita-backdrop-vista",
      "category": "authenticity",
      "expectedGain": 1.0,
      "severity": 3,
      "effort": "M",
      "workstream": "WS4",
      "evidence": ["high/desktop/R06", "high/desktop/R04", "high/desktop/R14", "high/desktop/R08"],
      "fix": "Replace the blurred photographic panorama and pale band with 2-3 layers of brick-stepped green ridgelines, extend the terrain to meet them, and set the fog colour to the horizon sky; place the Arlington (or a far LOD of it) so it terminates the Central Avenue sightline. Test: in R06 no horizon band brighter than both neighbours (now L 183 vs 150 hills and 144 grass); the Arlington visible at the end of the road in R04 and R14. Gain split +0.5 authenticity, +0.25 scenery, +0.25 lighting. Merges G-world-edge."
    },
    {
      "id": "G-course-set-pieces",
      "category": "authenticity",
      "expectedGain": 0.75,
      "severity": 3,
      "effort": "M",
      "workstream": "WS4",
      "evidence": ["high/desktop/R09", "high/desktop/R17", "high/desktop/R13", "high/desktop/R10"],
      "fix": "R09: a stepped grey brick Goat Rock outcrop at the roadside and a translucent blue water ford across the road with spray (water, not the tan tiles added this loop); R17: a fountain centrepiece, benches and trees in Hill Wheatley Plaza; R13: one identifying Bridge Street feature; one hero prop per mountain course (R08, R10, R11, R12). Test: each named landmark visible in its capture. Gain split +0.5 authenticity, +0.25 scenery."
    },
    {
      "id": "G-action-feedback",
      "category": "animation",
      "expectedGain": 0.75,
      "severity": 3,
      "effort": "M",
      "workstream": "WS3",
      "evidence": ["strips/high/R14", "strips/high/R15", "high/desktop/R17"],
      "benchmark": "2k-drive/drive-3.jpg",
      "fix": "Replace flat discs with smaller, partly transparent 1x1 round-plate and stud particles that tumble under gravity, with screen coverage over the player's tub capped at about 30%; emit white steam plates while hot steam charges; +4 degree FOV kick and 80 ms shake on slide release and hits; tilt the tub-water plane with lateral acceleration; on rail contact, push the tub back instead of passing through. Test: steam visible in R14 frames 3-8, water plane tilted in at least 3 frames, captain visible in R15 frames 3-6, no rail through the tub or crew in R14 frame 8."
    },
    {
      "id": "G-figure-tub-detail",
      "category": "characters",
      "expectedGain": 0.5,
      "severity": 3,
      "effort": "M",
      "workstream": "WS2",
      "evidence": ["crops/high/R03-player-rear", "crops/high/R03-kart_5", "crops/high/R04-kart_3", "high/desktop/R04"],
      "benchmark": "2k-drive/drive-4.jpg",
      "fix": "Add a hair or hat-back print per team; re-bake torso prints at 512 px or more per face (or SDF decals); give each team its own back motif instead of the shared X; build the tub body from stacked curved-slope bricks with visible seams; add wheel tread and hub detail; cap specular and rim on dark albedo (the leg face is sun-specular, not only rim). Faces already vary and part joins already exist, so those are out of scope. Test: R03-player-rear shows head-back prints and print edges ramp 4 px or less at 2x; the R04-kart_3 raised leg is at most 1.6x the shaded leg's luminance (now (124,128,126))."
    },
    {
      "id": "G-painted-boxes",
      "category": "materials",
      "expectedGain": 1.0,
      "severity": 4,
      "effort": "L",
      "workstream": "WS4",
      "evidence": ["high/desktop/R13", "high/desktop/R04", "crops/high/R03-kart_5", "high/desktop/R17"],
      "benchmark": "worlds/worlds-1.jpg",
      "fix": "BIG LEVER for this loop. An instanced brick facade kit for commercial blocks (brick window frames with recessed transparent panes, sills, slope-brick awnings, pilasters and cornice plates) replacing painted fronts on boxes within about 80 m of the road; painted textures only as far LOD. Test: R04 and R13 facades show relief, with window recesses at least 15 L darker than the wall face, and crops/high/R03-kart_5 shows no magnified painted facade. Gain split +0.5 materials, +0.5 scenery. Merges G-building-depth."
    }
  ]
}
```
