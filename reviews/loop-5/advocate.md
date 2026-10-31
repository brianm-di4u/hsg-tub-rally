# Advocate: loop 5, high tier

Paths are relative to `screenshots/review-loop-5/`. Pixel values are sRGB read from the PNGs. "Luma" is 0.299R + 0.587G + 0.114B.

## Summary
Both critics read this build accurately in most places, and I concede most of their claims. The backdrops are flat, facades are textures on flat walls, the sunset is underexposed, the phone HUD tiles collide and the landscape team select hides its preview. Neither critic's total is badly off. But five claims fail when tested against the captures, and four of them feed gaps:

1. Tree canopies are not stud-less. The canopy tops are studded in `high/desktop/R05` and `high/desktop/R09`.
2. Water does leave the tub, with the gallon count dropping, in all three strips.
3. The slide spray does shift in colour as it charges.
4. The player ring in `high/desktop/R19` is outlined and doesn't vanish.
5. The "smear at rest" in `crops/high/R04-player` belongs to a moving tub.

Four gaps also come in pairs between the critics: ridges, slide effects, sunset fill and the tub banding. Their gains shouldn't be counted twice. I propose small upward corrections only where the evidence the critics missed bears on an anchor: scenery to 6.5, animation to 6.5 and authenticity to 7.0. Everything else I hold at the critics' mean. **Proposed total: 67.0** against a critic mean of 66.25.

## Category by category

### Characters: critics 7.0 / 7.0, proposed 7.0
- **Concede:** the bare tan backs of the heads (`crops/high/R03-player-rear`).
- **Concede, measured:** the interior-wall streaks. In `crops/high/R02-preview-captain`, along y 470–510 and x 210–330, the white interior wall rises and falls by 5–10 luma levels about every 20 px (for example 174 → 163 → 171 → 159). The same ripple shows faintly through the water. It is real, but only this 2.2 m-wide close-up resolves it.
- **Partial rebut of Codex** ("bowl resembles one moulded shell"): in `crops/high/R02-preview` the bowl is one part, but the tub still reads as an assembly. It has a separate rim ring, a raised stripe tile with its own edge, gold claw feet, a dark base plate and capped wheels. One large moulded part on a plate is normal for a brick toy.
- **Credit:**
  - Printed faces with expression and printed uniforms (`crops/high/R02-preview`, `crops/high/R04-kart_3`).
  - Studs on the hats: the right figure in `crops/high/R04-player`, the left figure in `crops/high/R15-player`.
  - Visible blue water with the duck (`crops/high/R02-preview-captain`, `crops/high/R04-player`).
  - Teams distinct at chase distance (`high/desktop/R12`, `high/desktop/R13`).
- **Rebut G-road-ghost-smear** (Critic A, filed under characters):
  - `crops/high/R04-player` is the pack-racing moment. The timer reads 0:07.00 in `high/desktop/R04`, so dust behind a moving wheel is correct, not "at rest".
  - The countdown puff in `crops/high/R03-kart_5` is real: luma 111 at (820,650) against 29–54 around it. It renders as banded streaks. That is a particle-polish note, not a character-asset defect.
- **IP:** I concede Critic A's note. The `high/desktop/R13` spectator (x 0–140, y 320–500) has a square head, a brown hair cap, a cyan tee and dark trousers. The same crowd template (square head, hair cap, plain tee) recurs at the left edge of frame 1 of `strips/high/R15`. Nothing looks like a minifigure or LEGO branding.
- **Score:** 7.0, at the anchor.

### Materials: critics 6.5 / 6.5, proposed 6.5
- **Concede:**
  - Facades are brick textures on flat walls (`high/desktop/R05`, `high/desktop/R13`).
  - Canopy edges are hard slabs with no bevel highlight (`high/desktop/R10`).
  - The ridges are flat colour (`high/desktop/R12`).
  - Roofs and walls show much weaker plastic response than the figures (Codex, `high/desktop/R05`).
- **Plainly wrong (Critic A):** "Tree canopies are untextured slabs with hard edges and no studs or highlights (`R09`, `R10`)."
  - In `high/desktop/R09`, the near conifer (x 820–1240, y 360–620) has rows of shaded studs with specular specks on every plate top.
  - In `high/desktop/R05`, the near broadleaf canopy (x 600–860, y 590–800) is studded the same way.
  - In `high/desktop/R10` the camera sits below the canopy tops, so their studs can't show. Only the plain plate sides face the camera.
  - So the stud half of G-trees-no-brick-detail is already built. Only the edge highlight remains.
- **Interior banding** (Codex G-surface): real (measured above), but it is the same defect as Critic A's G-tub-interior-streaks. At chase distance (`high/desktop/R04`) the tub interior can't be resolved at all.
- **Score:** 6.5. The near-camera studs, the 4×4 tonal plates and the terraced lips are worth crediting, but the facades and backdrops hold this below `worlds-1`.

### Scenery: critics 6.5 / 6.0 (mean 6.25), proposed 6.5
- **Concede:** the backdrop ridges and Hot Springs Mountain are flat stepped planes.
  - In `high/desktop/R05` the mountain wall reads luma 71–89 across 580 px, with steps of only 1–2 levels between columns.
  - In `high/desktop/R12` the pale ridge columns run at luma 185–204, 2–3 levels apart. That is technically per-column shading, but it can't be seen.
  - Bridge Street (`high/desktop/R13`) is generic, and the awning runs repeat (`high/desktop/R04`).
- **Plainly wrong (Codex):** "lacks … varied vegetation".
  - `high/desktop/R09` mixes tiered conifers with light-green broadleaf trees (x 0–80, y 180–245), an orange autumn tree (x 220–280, y 187–230), red and pink flowers (around (735,690) and (1010,770)) and grey rocks.
  - `high/desktop/R12` mixes broadleaf trees, conifers, orange autumn trees (x 545–590, y 270–300), shrubs and a rock outcrop (x 1090–1230, y 385–470).
  - `high/desktop/R13` has autumn-orange trees.
  - Critic A's "one conifer model everywhere" is overstated for the same reason. The conifer is one model, but it is not the only tree.
- **Rebut Codex** ("no convincing terrain transitions"): the terraced banks are exactly that. See `high/desktop/R08` (x 230–540, y 400–640: grooved plates stepping up the bank) and the right bank of `high/desktop/R19`. Critic A credits them.
- **Partial concession on Goat Rock** (`high/desktop/R09`): tapered blocks with a running-bond texture do read as masonry. Brick-built rock is still the `drive-5` idiom, so the fix is in the shapes, not the idea.
- **Credit:** each course has its own set dressing:
  - the switchback retaining wall (`R08`)
  - the rock cluster (`R09`)
  - the terracotta summit road (`R10`)
  - the radial-paved plaza arena (`R17`)
  - the ford (`R19`)
- **Score:** 6.5. Codex's 6.0 rests partly on the vegetation claim, which the captures contradict.

### Lighting: critics 6.5 / 6.5, proposed 6.5
- **Concede R11, measured:** in `high/desktop/R11`, 40% of the central frame (15–85% width, 15–95% height) is below luma 40. The mean luma is 54, against 169 for `worlds-4`. The near-right canopy (900–1000, 200–280) averages (22,33,19).
- **Rebut the cause Critic A blames** ("no warm key"): `R11` does have a low warm key.
  - The sunlit far road (560–620, 320–360) averages (118,108,96), luma 110.
  - The left bank is sunlit at (65,95,46), with lit studs.
  - The near road at (47,36,33) sits in long conifer shadow.
  - So G-sunset-key-light's own test ("sunlit road luma ≥ 80") already passes and would let the real defect through. The defect is fill and exposure in shadow, which is Codex's G-shadow-fill.
- **Rebut double counting:**
  - "Flat backdrop planes take no light variation" is the scenery ridge gap again.
  - "Nothing approaches `bj-1`..`bj-3`" and "bounce in `bj-3`" measure against the 9 anchor, not the 7.
- **Credit:**
  - Soft-edged tree shadows across the road (`high/desktop/R08`).
  - Dusk lamp pools and a pink gradient sky (`high/desktop/R07`).
  - Buff fronts separating from the sky (`high/desktop/R06`).
  - A contact shadow under the base (`crops/high/R02-preview`).
  - Ridges hazed to the sky colour (`high/desktop/R12`).
- **Score:** 6.5. The other clauses of the 7 anchor are met, but I won't argue past a sunset frame this dark.

### Animation and feel: critics 6.0 / 6.0, proposed 6.5
The critics missed evidence in all three strips.
- **`strips/high/R15`:**
  - In frame 2 the beads are bunched just above the tub rim, rising out of the water.
  - They spread in frames 3–4, fall in 5–6 and have settled by frame 8.
  - The gauge drops from 37 to 36 GAL at frame 3.
  - That is the "surface eruption … followed by settling" Codex asks for in G-effects. Codex's "without a strong visible connection to the water surface" is plainly wrong for frame 2.
- **`strips/high/R16`:**
  - In frame 4 a splash throws blue beads, a pale ripple ring and a dark wet patch onto the road. The ring is still visible in frames 5–7.
  - Beads also sit on the tub's water surface in frame 4, and the gauge drops from 40 to 39 GAL at frame 5.
  - Neither critic mentions this splash.
- **`strips/high/R14`:** the spray colour shifts measurably as it charges (average of the bright spray pixels, road area only):

  | Frame | Average spray colour (RGB) |
  |---|---|
  | 3 | (188,213,228) |
  | 4 | (189,209,222) |
  | 5 | (194,210,221) |
  | 6 | (198,210,219) |
  | 7 | (204,214,222) |
  | 8 | (213,219,224) |

  - R−B rises from −40 to −11: a blue-to-white charge progression. Codex says it has "no clear charge progression".
  - In frames 7–8, blue water beads ring the tub, and the gauge falls from 41 to 40 to 39 GAL.
  - Critic A's "No water slosh shows in any strip" is therefore wrong in substance: water visibly leaves the tub in all three strips. What can't be seen is a tilting surface.
- **Concede:**
  - The `R14` clumps sit 20–45 px below the tub ring, detached from the wheels.
  - No orange appears anywhere. `high/desktop/R17` shows a "HOT STEAM!" banner with no orange particles; the only orange pixels near the tub belong to the duck.
  - FOV kick and shake can't be verified in stills.
- **Score:** 6.5. On the 7 anchor, the circling (`R15`, `R16`) and the splashes with particles are met, the slide feedback is weak, and the slosh is only half shown (spill yes, tilt no).

### UI / HUD: critics 7.0 / 7.0, proposed 7.0
- **Concede:**
  - The gauge tile is a translucent grey box with no dark outline. It is clearest at the top left of `high/mobile/R17`.
  - The teal callout banners are a separate style (`high/desktop/R19` "WARM STEAM", `high/desktop/R17` "HOT STEAM!").
- **Minor rebut of Codex** ("water and required-item details occupy comparatively small tiles"): on desktop the gauge tile (about 145×90 px) and the checklist (about 210×45 px) are larger than the empty item orb (about 60 px) (`high/desktop/R04`).
- **Credit:** clear tile hierarchy (`high/desktop/R04`); brick-panel menus with stud rows and stud-topped buttons (`high/desktop/R01`, `R02`, `R18`).
- **Score:** 7.0.

### Typography: critics 7.0 / 7.0, proposed 7.0
- **Concede:**
  - The "x3" item count is about 6 CSS px tall and clipped by the orb edge (`high/mobile/R17`).
  - The landscape cards wrap awkwardly: "Silks & Stirrups / Modified · / locked" runs to four lines (`high/landscape/R02`).
- **Credit:** a clear display and sans scale (`high/desktop/R01`, `high/desktop/R18`).
- **Score:** 7.0.

### Readability: critics 6.5 / 6.5, proposed 6.5
- **Plainly wrong (Critic A):** "the Steam Rangers' tan ring nearly vanishes on the sunlit tan path in `high/desktop/R19`".
  - The ring near the tub is (163–192, 138–162, 88–103).
  - A 3–4 px dark outline at (55–59, 46–50, 37–39) bounds it on both sides.
  - The path next to it lies in the tub's shadow at (90,74,55), not the sunlit (177,125,81) the critic quotes.
  - Contrast ratios: ring against the adjacent path 2.6–3.5:1; ring against its own outline 3.9:1; outline against sunlit path 3.6:1.
  - The player-only marker triangle with its black outline also sits above the tub. The ring doesn't vanish.
- **Rebut Codex** ("ford resembles another tiled driving surface"): in `high/desktop/R19` the ford is a driving surface; the Engine Six tub is driving through it (x 730–820, y 340–410). Its tile-like look is a materials note, not a hazard misread.
- **Concede pack occlusion at distance:** the far column in `high/desktop/R04` and the centre of `high/desktop/R07`. Near rivals do separate, each with its own slim ring (`high/desktop/R03`; the orange crew left of the player in `high/desktop/R12`; `high/desktop/R13`).
- **Score:** 6.5.

### Mobile: critics 6.5 / 6.5, proposed 6.5
- **Concede every overlap:**
  - The lap tile sits over the top of the gauge, and the item orb over the bottom of the place tile (`high/mobile/R04`, `high/mobile/R17`).
  - The radar or minimap cuts into the place tile (`high/landscape/R17`, `high/landscape/R04`).
- **Concede Codex's point, which Critic A missed:** `high/landscape/R02` hides the preview. Only a sliver of one firefighter shows right of the panel (x ≈ 1280–1360).
- **Credit:**
  - The controls never cover the tub (`high/mobile/R04`, `high/landscape/R04`).
  - Portrait team select shows the whole crew and tub above the panel (`high/mobile/R02`).
  - The results fit (`high/landscape/R18`).
  - The measured phone floor is 55 fps min on SwiftShader and 241 fps min with 4× CPU throttling.
- **Score:** 6.5.

### Authenticity: critics 6.5 / 7.0 (mean 6.75), proposed 7.0
- **Credit:**
  - The Fordyce, with its patterned upper storeys and skylight (`high/desktop/R05`).
  - The Arlington's twin cupola towers closing the vista (`high/desktop/R06`).
  - A tiled-dome bathhouse on Central (`high/desktop/R03` at x 385–440, y 195–240).
  - The judge-stop heat (`strips/high/R16`).
  - The 10-gallon line on the gauge and the Towel/Bath/Soap/Loofah checklist (`high/desktop/R04`).
  - Results scored by water and "CLEAN" (`high/desktop/R18`).
  - The title credit to the June running of the tubs on Central Avenue (`high/desktop/R01`).
- **Missed by both critics:** a lattice steel tower rises behind the trees at the top centre of `high/desktop/R11` (x ≈ 430–470, y 0–120). Its shape matches the Hot Springs Mountain observation tower, a real local landmark.
- **Concede:**
  - The mountains are bare walls that don't read as the Ouachitas (`high/desktop/R05`, `high/desktop/R06`).
  - Bridge Street is generic (`high/desktop/R13`).
  - The natural courses lean on their labels (`high/desktop/R09`).
- **Score:** 7.0. Three of the four clauses in the 7 anchor are met, and the race clause is met in full.

## Facts a critic got plainly wrong
| Critic | Claim | What the capture shows |
|---|---|---|
| A | Canopies have "no studs or highlights" (materials, G-trees-no-brick-detail) | Shaded, specular studs on canopy tops in `high/desktop/R09` (x 820–1240, y 360–620) and `high/desktop/R05` (x 600–860, y 590–800) |
| A | "No water slosh shows in any strip" | Beads leave the water and the gauge drops in `strips/high/R15` (frame 2, 37→36), `strips/high/R16` (frame 4, 40→39) and `strips/high/R14` (frames 7–8, 41→39); only the surface tilt is unseen |
| A | The R19 player ring "nearly vanishes" | The ring is outlined, 2.6–3.5:1 against the adjacent path and 3.9:1 against its outline |
| A | The grey smear in `crops/high/R04-player` is "at rest" | R04 is pack racing at 0:07.00, so the tub is moving |
| A | "One conifer model everywhere" | Broadleaf and autumn trees in `high/desktop/R09`, `R12`, `R13` and `R05` |
| Codex | The fumble splash has no "strong visible connection to the water surface" | Frame 2 of `strips/high/R15` shows beads rising out of the tub above the rim |
| Codex | The slide spray has no "clear charge progression" | Spray colour moves from (188,213,228) to (213,219,224) over frames 3–8 of `strips/high/R14` |
| Codex | The scenery "lacks … varied vegetation" | Five kinds of plant and rock in `high/desktop/R09` and `high/desktop/R12` |

## Gaps with adjusted severity and gain
| Gap (critic) | Critic sev / gain | Adjusted sev / gain | Why |
|---|---|---|---|
| G-backdrop-ridges-flat (A) | 4 / +0.5 | 4 / +0.5 | Concede |
| G-terrain (Codex) | 4 / +1 | 3 / +0.5 | Ridge part duplicates G-backdrop-ridges-flat; vegetation part contradicted by `R09` and `R12` |
| G-slide-steam-fx (A) | 4 / +0.5 | 3 / +0.5 | Spray is present and charges blue to white; detachment and no orange conceded |
| G-effects (Codex) | 4 / +1 | 3 / +0.5 | The fumble eruption and settle already show in `strips/high/R15`; slide part duplicates G-slide-steam-fx |
| G-water-slosh-visible (A) | 3 / +0.5 | 2 / +0.25 | Water already visibly spills in every strip; only the surface tilt is missing |
| G-trees-no-brick-detail (A) | 3 / +0.5 | 2 / +0.25 | Studs already present; only the edge highlight is missing |
| G-facade-brick-geometry (A) | 3 / +0.5 | 3 / +0.5 | Concede |
| G-surface (Codex) | 3 / +0.5 | 3 / +0.5 | Concede scenery response; banding part duplicates G-tub-interior-streaks |
| G-sunset-key-light (A) | 3 / +0.5 | 3 / +0.5, shared with G-shadow-fill | Cause is fill, not key; its test already passes and needs changing |
| G-shadow-fill (Codex) | 3 / +0.5 | 3 / +0.5, shared | Concede; the right diagnosis of R11 |
| G-phone-hud-overlap (A) | 3 / +0.5 | 3 / +0.5 | Concede |
| G-mobile-preview (Codex) | 3 / +0.5 | 3 / +0.5 | Concede |
| G-pack (Codex) | 3 / +0.5 | 3 / +0.5 | Concede at distance |
| G-player-ring-contrast (A) | 3 / +0.5 | 1 / +0 | Ring is outlined and reads; pack half is G-pack |
| G-course-hero-pieces (A) | 2 / +0.5 | 2 / +0.25 | Plaza arena, ford and Goat Rock exist; Bridge Street conceded |
| G-hud-style-unify (A) | 2 / +0.25 | 2 / +0.25 | Concede |
| G-tub-interior-streaks (A) | 2 / +0.25 | 2 / +0.25 | Concede; close-up only |
| G-road-ghost-smear (A) | 2 / +0.25 | 1 / +0 | Wrong category; R04 shows a moving tub |

```json
{
  "loop": 5,
  "role": "advocate",
  "tier": "high",
  "scores": {
    "characters": {"score": 7.0, "confidence": 0.75, "evidence": [
      {"shot": "crops/high/R02-preview", "note": "tub reads as an assembly: rim ring, raised stripe tile, claw feet, base plate, capped wheels; printed faces with expression"},
      {"shot": "crops/high/R02-preview-captain", "note": "blue water with duck; interior-wall ripple of 5-10 luma at ~20 px period is real but only visible at this close-up"},
      {"shot": "crops/high/R04-player", "note": "hat studs and water visible; the grey wheel dust belongs to a moving tub (R04 timer 0:07.00), not a smear at rest"},
      {"shot": "crops/high/R03-player-rear", "note": "printed uniform backs; bare tan rear heads conceded"},
      {"shot": "high/desktop/R12", "note": "orange, tie-dye and pink teams distinct at chase distance"}]},
    "materials": {"score": 6.5, "confidence": 0.7, "evidence": [
      {"shot": "high/desktop/R09", "note": "near conifer plate tops carry shaded, specular studs (x 820-1240, y 360-620), contrary to critic A"},
      {"shot": "high/desktop/R05", "note": "studded broadleaf canopy tops and 4x4 tonal baseplate; facades are flat brick textures (conceded)"},
      {"shot": "high/desktop/R10", "note": "canopy sides hard-edged with no bevel highlight; camera is below the canopy tops"},
      {"shot": "crops/high/R15-player", "note": "ABS sheen following helmet and rim curvature"}]},
    "scenery": {"score": 6.5, "confidence": 0.65, "evidence": [
      {"shot": "high/desktop/R09", "note": "conifers, broadleaf, orange autumn tree, red and pink flowers, rocks: vegetation varies"},
      {"shot": "high/desktop/R12", "note": "broadleaf, conifer, autumn trees, shrubs, rock outcrop; pale ridge columns only 2-3 luma apart (conceded)"},
      {"shot": "high/desktop/R08", "note": "terraced bank and retaining wall: brick-built terrain transition"},
      {"shot": "high/desktop/R05", "note": "Hot Springs Mountain a flat green wall, luma 71-89 (conceded)"},
      {"shot": "high/desktop/R13", "note": "Bridge Street generic (conceded)"}]},
    "lighting": {"score": 6.5, "confidence": 0.7, "evidence": [
      {"shot": "high/desktop/R11", "note": "40% of central frame below luma 40, mean 54 vs worlds-4 169; but a warm key exists: sunlit far road (118,108,96), lit left bank"},
      {"shot": "high/desktop/R07", "note": "dusk lamp pools and pink gradient sky"},
      {"shot": "high/desktop/R08", "note": "soft-edged tree shadows across the road"},
      {"shot": "high/desktop/R06", "note": "facades lit buff and separated from the sky"},
      {"shot": "crops/high/R02-preview", "note": "contact shadow under the base plate"}]},
    "animation": {"score": 6.5, "confidence": 0.6, "evidence": [
      {"shot": "strips/high/R15", "note": "beads rise out of the tub above the rim in frame 2, spread, fall and settle by frame 8; gauge 37->36 GAL"},
      {"shot": "strips/high/R16", "note": "crew circles while the bar fills; frame 4 splash with ripple ring and wet patch persisting to frame 7; gauge 40->39 GAL"},
      {"shot": "strips/high/R14", "note": "spray shifts from (188,213,228) to (213,219,224) over frames 3-8; clumps detached from the wheels, no orange (conceded); gauge 41->39 GAL"},
      {"shot": "high/desktop/R17", "note": "HOT STEAM! banner with no orange spray around the tub (conceded)"}]},
    "ui": {"score": 7.0, "confidence": 0.7, "evidence": [
      {"shot": "high/desktop/R04", "note": "clear tile hierarchy; gauge tile lacks the outline (conceded)"},
      {"shot": "high/desktop/R02", "note": "brick-panel menu with stud row and stud-topped buttons"},
      {"shot": "high/desktop/R18", "note": "clean results panel with player row"},
      {"shot": "high/desktop/R19", "note": "teal callout banner is a separate style (conceded)"}]},
    "typography": {"score": 7.0, "confidence": 0.7, "evidence": [
      {"shot": "high/desktop/R01", "note": "pixel display face plus rounded sans form a clear scale"},
      {"shot": "high/desktop/R18", "note": "results table and headings readable"},
      {"shot": "high/mobile/R17", "note": "x3 count about 6 CSS px and clipped by the orb (conceded)"},
      {"shot": "high/landscape/R02", "note": "awkward four-line card wraps (conceded)"}]},
    "readability": {"score": 6.5, "confidence": 0.65, "evidence": [
      {"shot": "high/desktop/R19", "note": "player ring outlined: ring (163-192,138-162,88-103), outline (55-59,46-50,37-39), path in tub shadow (90,74,55); 2.6-3.5:1"},
      {"shot": "high/desktop/R04", "note": "far pack column merges (conceded); near rivals separate"},
      {"shot": "high/desktop/R12", "note": "near rivals separate with their own slim rings"},
      {"shot": "high/mobile/R04", "note": "player tub and road edges readable on phone"}]},
    "mobile": {"score": 6.5, "confidence": 0.75, "evidence": [
      {"shot": "high/mobile/R04", "note": "lap tile over gauge, orb over place tile (conceded); controls clear of the tub"},
      {"shot": "high/landscape/R17", "note": "radar circle cuts into the place tile (conceded)"},
      {"shot": "high/landscape/R02", "note": "all 12 cards fit but the preview is hidden behind the panel (conceded)"},
      {"shot": "high/mobile/R02", "note": "portrait team select shows the full crew and tub above the panel"}]},
    "authenticity": {"score": 7.0, "confidence": 0.6, "evidence": [
      {"shot": "high/desktop/R05", "note": "Fordyce recognisable: patterned storeys, arched windows, skylight"},
      {"shot": "high/desktop/R06", "note": "Arlington twin cupola towers close the vista; mountain a bare wall (conceded)"},
      {"shot": "strips/high/R16", "note": "judge-stop heat with its progress banner"},
      {"shot": "high/desktop/R18", "note": "results scored by water gallons and CLEAN, as in the real race"},
      {"shot": "high/desktop/R11", "note": "lattice tower behind the trees at top centre, shaped like the Hot Springs Mountain observation tower; missed by both critics"},
      {"shot": "high/desktop/R13", "note": "Bridge Street generic (conceded)"}]}
  },
  "ip": {"clean": true, "notes": "No minifigure silhouette or LEGO branding. Critic A's non-LEGO note stands: the high/desktop/R13 spectator (square head, brown hair cap, cyan tee) resembles Minecraft's default character, and the same crowd template recurs in strips/high/R15 frame 1."},
  "gaps": [
    {"id": "G-backdrop-ridges-flat", "category": "scenery", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06", "high/desktop/R12"], "benchmark": "worlds-4, drive-1", "fix": "Conceded. Cover Hot Springs Mountain and the horizon rings with instanced low-LOD brick tree crowns and studded plate tops in 2-3 depth bands. Test: in R05 and R12 no uniform ridge run longer than 60 px, at least 3 crowns per 100 px of ridge."},
    {"id": "G-terrain", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R09"], "benchmark": "2k-drive/drive-5.jpg", "fix": "The ridge part duplicates G-backdrop-ridges-flat (gains do not stack). The vegetation part is contradicted by R09 and R12. Keep only reshaping Goat Rock from brick-textured tapered blocks into stepped, interlocking brick-built forms."},
    {"id": "G-slide-steam-fx", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "high/desktop/R17"], "benchmark": "drive-3", "fix": "Spray already shifts blue to white over R14 frames 3-8. Anchor the puffs to the rear wheel contacts, and make the hot tier visibly orange (R17 shows HOT STEAM! with no orange). Test: confirm the strip reaches the hot tier, then frames 5-8 show orange-tinted particles touching the rear wheels."},
    {"id": "G-effects", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Fumble eruption and settle already show (R15 frames 2-8). The remaining slide-spray part duplicates G-slide-steam-fx (gains do not stack)."},
    {"id": "G-water-slosh-visible", "category": "animation", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15", "strips/high/R16"], "benchmark": "drive-3", "fix": "Water already visibly spills, with gauge drops, in all three strips. Remaining: make the surface tilt readable during slides. Test: in an R14 close-up the water plane tilts at least 8 degrees relative to the rim in at least 2 frames."},
    {"id": "G-trees-no-brick-detail", "category": "materials", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R09", "high/desktop/R05", "high/desktop/R10"], "benchmark": "worlds-1", "fix": "Canopy studs already exist (R05, R09). Remaining: a bevel or edge-highlight on canopy plate edges and per-plate shade variation. Test: near canopy edges in R10 show a lit edge."},
    {"id": "G-facade-brick-geometry", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R13"], "benchmark": "worlds-1", "fix": "Conceded. Add bevelled corner quoins, studded storey ledges and a brick bevel normal map. Test: corners in R05 and R13 show a lit bevel highlight."},
    {"id": "G-surface", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R05", "crops/high/R02-preview-captain"], "benchmark": "worlds/worlds-1.jpg", "fix": "Conceded for scenery: tune roughness and specular on roofs and wall trim so they catch highlights at review distance. The interior-banding part duplicates G-tub-interior-streaks (gains do not stack)."},
    {"id": "G-sunset-key-light", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R11"], "benchmark": "worlds-4", "fix": "Cause re-attributed: a warm low key exists (sunlit far road luma 110). The deficit is shadow fill and exposure, shared with G-shadow-fill (gains do not stack). Change the test: at most 15% of R11's central frame below luma 40 (now 40%), with near canopy layers separable."},
    {"id": "G-shadow-fill", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R11", "high/desktop/R07"], "benchmark": "worlds/worlds-4.jpg", "fix": "Conceded; the correct diagnosis of R11. Raise the sky fill and add warm edge light so near canopy layers separate (near-right canopy now averages (22,33,19)) while dusk contrast is kept."},
    {"id": "G-phone-hud-overlap", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R04", "high/mobile/R17", "high/landscape/R04", "high/landscape/R17"], "benchmark": "drive-3", "fix": "Conceded. Stack the lap tile, gauge and checklist with fixed gaps; move the orb clear of the place tile; move the landscape radar or minimap clear of the place tile. Test: no two HUD tile boxes intersect at 390x844 and 844x390."},
    {"id": "G-mobile-preview", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["high/landscape/R02", "high/mobile/R04"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Conceded (missed by critic A). Reserve a visible turntable region beside the 12 cards at 844x390. The portrait-tile part duplicates G-phone-hud-overlap."},
    {"id": "G-pack", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/desktop/R07", "high/mobile/R04"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Conceded for the far pack; near rivals already separate (R03, R12, R13). Raise the chase camera or lift rival markers so consecutive tubs keep separate cues."},
    {"id": "G-player-ring-contrast", "category": "readability", "expectedGain": 0, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R19"], "benchmark": "drive-3", "fix": "Evidence contradicted: the ring already has a fixed dark outline and measures 2.6-3.5:1 against the adjacent shadowed path, 3.9:1 against its outline. Optional: widen the outline by 1 px so the ring itself reaches 3:1 everywhere. The pack half is G-pack."},
    {"id": "G-course-hero-pieces", "category": "authenticity", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R13", "high/desktop/R17"], "benchmark": "drive-5", "fix": "Bridge Street conceded; R17's radial-paved arena, the R19 ford and R09's Goat Rock already give their courses a set piece. Build a reference-matched piece for Bridge Street first."},
    {"id": "G-hud-style-unify", "category": "ui", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/desktop/R19", "high/mobile/R17"], "benchmark": "drive-3", "fix": "Conceded. Give the gauge tile the slate bevel and dark outline of the lap and place tiles; restyle the teal callouts as slate plates with a stud row."},
    {"id": "G-tub-interior-streaks", "category": "characters", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R02-preview-captain"], "benchmark": "drive-4", "fix": "Conceded: a 5-10 luma ripple at about a 20 px period on the interior wall (x 210-330, y 470-510). Smooth the bowl's interior normals and re-bake its AO. Test: no periodic luma oscillation above 3 levels along the wall at 2x."},
    {"id": "G-road-ghost-smear", "category": "characters", "expectedGain": 0, "severity": 1, "effort": "S", "workstream": "WS1", "evidence": ["crops/high/R03-kart_5", "crops/high/R04-player"], "benchmark": "drive-4", "fix": "Wrong category: the dust is a particle effect, and R04 is a moving tub. Only the R03 countdown puff stands, as effects polish: draw it as soft round puffs instead of banded streaks, or gate it off below walking speed."}
  ]
}
```
