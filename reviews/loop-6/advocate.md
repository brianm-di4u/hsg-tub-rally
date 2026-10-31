# Advocate, loop 6: Spa City Tub Rally, high tier

Paths are relative to `screenshots/review-loop-6/`. Pixel measurements come from crops and luma counts I made in my own temp folder (luma = 0.2126R + 0.7152G + 0.0722B; "centre" = the middle half of the frame, as Critic A used).

## Verdict
The two critics agree closely (66 and 65.5), and most of what they say holds up. The world's surfaces trail the figures. The horizon rings look like walls from the landmark cameras. Nothing in the captures shows ambient occlusion or camera kick. But several of the claims that carry the most weight are wrong on the captures:
- The dusk lamps do throw light pools.
- The tree canopies do have shaded studs and specular glints.
- The figures do show part breaks at the neck, hip and legs.
- The "stair-stepped steam smear" is a shadow-map artefact. It shows up on a stationary grid at the countdown.
- Rival tubs are visible in the pack frames Critic A says hide them.
- About a third of the "murk" counted at dusk and sunset is the player's own dark-uniformed team and its contact shadow.

Codex ignores the measured phone frame rate. It also says chase views hide the differences between teams, yet `high/desktop/R03` and `high/desktop/R12` show seven distinct crews between them. Because the critics' means fall on quarter points, I can only move each score by the half-point grid. I propose +0.25 in nine categories and hold UI. Total 68.0 (critic mean 65.75). Nine gaps lose severity, one gets its cause corrected, and the two overlapping pairs share their gains.

## Facts a critic got plainly wrong
1. **Critic A, lighting: "the street lamps light nothing on the ground" / "no light pools on the sidewalk or road" (`high/desktop/R07`).** The right sidewalk has light pools. I sampled 5×5 patches along the curb side of the paving, from the far lamp base to the near one:
   - Near the far lamp (793,362): luma 183.7.
   - Midway (843,390): 101.1.
   - Near the next lamp (918,430): 187.4.

   `low/desktop/R07` has the same rise and fall (180.0 → 97.8 → 185.6), and that tier draws no shadows, so the falloff is lamp light, not shadow. Codex describes these as "useful pools of lamplight", correctly.
2. **Critic A, materials: tree canopies have "no studs, bevels or specular" (`high/desktop/R04`, `high/desktop/R11`).** Seen from above, the canopy top faces are studded plates with shaded studs and small specular glints (`high/desktop/R05`, the trees in front of the Fordyce; `high/desktop/R09`, the big conifer on the right). R04 and R11 are eye-level chase views, so they see only the side and bottom faces. The part that holds is "no bevels": the plate edges are sharp.
3. **Critic A, characters: "no part seams … at the neck, shoulder or hip".**
   - `crops/high/R02-preview`, right-hand crew member: a separate hip block with a lit edge between torso and legs, a split between the legs, and separate boots.
   - `crops/high/R02-preview-captain`: a neck post and a collar plate between head and torso, and the arm is a separate bevelled block with a cuff.

   The claim about mould lines holds.
4. **Critic A, cause of `G-steam-smear`: "the stepped grey smear … is the wheel trail at close range".**
   - It appears in `crops/high/R03-kart_5` and `crops/high/R03-player`. R03 is the countdown ("READY", 0:00.00 in `high/desktop/R03`), and nothing is moving.
   - It is absent from `crops/low/R03-kart_5` and `crops/low/R04-player`. The low tier draws no shadows, and there the ground under the chassis is uniform grey.

   The band sits inside the chassis shadow and steps in square texels, which is shadow-map aliasing seen through a close camera. It is a lighting artefact (WS1), not a steam effect (WS3).
5. **Critic A, readability: "In every pack frame … the rival tubs are hidden behind their four-figure crews".**
   - The zoom of `high/desktop/R04` (x 470–760, y 290–480) shows three rival tubs with their rims and captains: the cowboys' brown tub, the pink tub and the white tub.
   - `high/desktop/R12` shows the orange team's tub with its green flag and the pink tub ahead of it.
   - `high/mobile/R07` shows the pink tub and the tie-dye team's purple tub.

   Tubs merge only from the third row of the pack back.
6. **Critic A: R11 is one of the "interchangeable conifer roads with no set piece".** `high/desktop/R11` has a lattice steel observation tower above the trees (x ≈ 430–480, y 0–120). R10 is also distinct: it is the only course on a terracotta tile road with grout seams (`high/desktop/R10`).
7. **Codex, scenery: R09's trees are "sparse".** `high/desktop/R09` is a dense mixed stand: dozens of conifers, light-green broadleaf crowns and orange autumn crowns on the left, plus flower clusters at the base of the rock. "Repeated" is fair. "Sparse" is not.
8. **Codex, mobile: "Static captures cannot establish … frame rate."** The loop brief measures it. The swiftshader software-GL phone floor holds a minimum of 50 fps on the low tier, and 144 fps on gpu low mobile with 4× CPU throttle. The anchor's "phone proxy holds 30 fps" is met on that evidence.
9. **Minor (Critic A): the desktop team select "uses less than half the screen width".** The panel spans x ≈ 15–657 of 1280 (50%) in `high/desktop/R02`.

## Category by category

**Characters (critics 7.0 / 6.5, mean 6.75). I propose 7.0.**
- Concede (Critic A): the held towel is a flat card that intersects the fist (`crops/high/R02-preview-rear`), and the firefighter helmets carry no studs (`crops/high/R02-preview`).
- Rebut (Critic A): the part seams are there (fact 3).
- Rebut (Codex), "shared body construction … tubs lack separate toy parts": a shared body is how brick figures are built, and the benchmark `drive-4` uses one too. The tubs are assemblies:
  - a rolled rim in a contrasting colour, a side tile, and claw-foot connectors;
  - a dark chassis plate with shaded studs, separate axles, and tyres with hubcaps and a hub stud (`crops/high/R02-preview`, `crops/high/R03-kart_1`, `crops/high/R04-kart_3`).
  A bathtub that is one moulded shell is exactly what a toy bathtub part is.
- Rebut (Codex), "chase views also conceal much of the character differentiation": `high/desktop/R03` shows firefighters, cowboys, the pink team, the white turban team and the navy overalls team. `high/desktop/R12` shows the tie-dye antenna team and the orange X-strap team, each identifiable at chase distance.
- Faces are expressive (shouting, grinning, scowling) and hold up at 2× (`crops/high/R02-preview-captain`, `crops/high/R04-kart_3`).
- On the 7 anchor this misses only the hat studs and one clipping prop.

**Materials (critics 6.0 / 6.5, mean 6.25). I propose 6.5.**
- Concede:
  - The road asphalt is a tone-varied checker with no seams (`high/desktop/R04`, zoom of the lower right).
  - The roofs are flat-shaded (`high/desktop/R05`).
  - The windows are opaque blue panes with painted glare streaks (`high/desktop/R13`).
  - The brick on the facades is texture.
- Rebut:
  - The canopies are studded plates with glints (fact 2).
  - The window surrounds, sills, lintels and string courses are modelled and shaded geometry (`high/desktop/R05`, the Fordyce zoom; `high/desktop/R13`, frames with depth).
  - The stone wall bricks on the high tier have relief and dark grout, compared with the flatter `low/desktop/R04`.
  - Shaded studs near the camera are everywhere the anchor asks for them: the white studded plate across the road at the judge line (`high/desktop/R16`), the grass baseplate verges (`high/desktop/R08`, `high/desktop/R11`) and the chassis plates.
  - The "smear" is not a material problem (fact 4).
- For calibration, the materials-7 benchmark `worlds-1` also has a seamless grey road and plain-walled houses. I see no case for 6.0.

**Scenery (critics 6.5 / 6.0, mean 6.25). I propose 6.5.**
- Concede:
  - Codex is right that the horizon rings read as sheer vertical faces from the landmark cameras (`high/desktop/R06`, left; `high/desktop/R05`, top right).
  - The storefront modules repeat in `high/desktop/R03`.
  - The plaza is mostly an open floor (`high/desktop/R17`).
- Rebut:
  - Each course carries some set dressing:
    - Goat Rock in `high/desktop/R09`;
    - the lattice tower in `high/desktop/R11`;
    - the terracotta trail in `high/desktop/R10`;
    - the creek ford with its blue tile water in `high/desktop/R19`;
    - the stone retaining wall and studded embankment in `high/desktop/R08`.
  - The forest is dense (fact 7).
  - From the race camera the rings are a thin band behind the skyline (`high/desktop/R04`, `high/desktop/R12`), not the composition-dominating wall they are in the flyovers.
  - The plaza in R17 is the Water Fight arena, and an open floor is how kart-battle arenas work.

**Lighting (critics 6.0 / 6.5, mean 6.25). I propose 6.5.**
- Concede: I find no AO at the base of the wall, under the canopies or between the crew (`high/desktop/R04`, zoom of the wall), and no bounce colour. Critic A's luma counts are correct: I get 21.9% below luma 40 in the `high/desktop/R07` centre and 13.7% in `high/desktop/R11`.
- Rebut the reading of those counts:
  - The dark pixels include the player's own team, which wears black and purple in R07 and navy overalls in R11, and that kart's contact shadow, which the anchor requires.
  - Inside the player-kart box, (525,395)–(750,600) in R07 and (530,430)–(750,600) in R11, sit 30.1% and 33.8% of the centre's dark pixels respectively.
  - Excluding that box, the share falls to 15.3% in R07 and 9.1% in R11. R11 would pass Critic A's own "<10%" test.
  - In `high/mobile/R07` the player kart holds 42.8% of the dark centre pixels.
  - The lamps do pool light (fact 1).
- The anchor items that are present:
  - a soft key light with crisp cast shadows (`high/desktop/R19`, `high/desktop/R16`);
  - contact shadows under every tub (`high/desktop/R03`, `high/desktop/R13`);
  - haze graded toward the sky (the warm vista in `high/desktop/R11`, x 600–760, y 180–300; the rings in `high/desktop/R05`);
  - deliberate day, dusk and sunset palettes (`high/desktop/R04`, `high/desktop/R07`, `high/desktop/R11`).
- Only AO and bounce stand between this and the 7 anchor.

**Animation and feel (critics 6.5 / 6.0, mean 6.25). I propose 6.5.**
- Concede: the eight strip frames show no camera kick, and the water plane stays level through the fumble (`crops/high/R15-player`, `strips/high/R15`). I see no push-off anticipation beat in `strips/high/R14`.
- Rebut, in part: the "water visibly sloshes" clause is half-met in a brick-toy idiom.
  - Water leaves the tub as blue spheres in frames 2–6 of `strips/high/R15`, and as a burst when the tub hits the fence in frame 8 of `strips/high/R14`.
  - The gauge drops with each spill: 41 → 39 GAL in R14, 37 → 36 GAL in R15.
- Other effects read with particles: slide puffs in frames 3–8 of R14, boost steam in `high/desktop/R19` (white) and `high/desktop/R17` (orange), and circling crews with swinging toy limbs in `strips/high/R15` and `strips/high/R16`.
- Codex's "sparse, bead-like" describes the puff style, not missing feedback.

**UI / HUD (critics 7.0 / 7.0). I hold 7.0.**
- Concede:
  - The counter beside the item orb has no label (`high/desktop/R04`).
  - In portrait the orb rim tucks under the place tile (`high/mobile/R04`).
  - In landscape the minimap tile and the water tile butt their neighbours with no gap. Sampling column x = 1600 of `high/landscape/R04`, the minimap rim starts right after the place tile's border (y 184–189 → 190); at x = 130, the water tile's rim starts right after the lap tile's border.
- What both critics missed: the HUD is context-aware.
  - The lap tile becomes "SEMIFINAL" in `high/desktop/R16` and "8 LEFT" in `high/desktop/R17`.
  - The minimap becomes a round arena radar with rival dots in R17.
  - The item orb shows the held item with a "×3" badge in R17.
  - The key strip greys out "Bath" with a hatched icon after the fumble in `high/desktop/R15`, so it is live status, not static clutter.
- This offsets the small overlaps. 7.0 stands.

**Typography (critics 7.0 / 6.5, mean 6.75). I propose 7.0.**
- Concede (Codex): in `high/landscape/R02`, "The Out- / of- / Towners" breaks over three lines with two hyphen breaks, and "Gator Gang · Traditional · locked" stacks into four lines.
- Rebut: the anchor asks for a clear scale, numerals that read at a glance and nothing clipped, and all three hold.
  - Nothing is clipped in R02 at any viewport.
  - Portrait team select wraps cleanly to two lines (`high/mobile/R02`).
  - The results at 390 px are crisp, with aligned columns (`high/mobile/R18`).
  - "0:07.00" and "8TH" read instantly (`high/mobile/R04`).
  - The display face and the sans form a clear scale (`high/desktop/R01`).
- The flaw is one viewport's card wrapping, not the type system.

**Readability (critics 6.5 / 7.0, mean 6.75). I propose 7.0.**
- Concede: from the third row of the pack back, crews merge (`high/desktop/R04`, far pack), and Codex is right that the pale pickup spheres say "pickup" more clearly than "which item".
- Rebut Critic A's "every pack frame" (fact 5) and "the pack becomes a dark mass at dusk": in `high/mobile/R07` the pink and tie-dye tubs read clearly, and the dark mass is the player's own black-uniformed team, marked by its pale ring.
- Other evidence:
  - The player's kart always stands out with a team-coloured ring and arrow: yellow in R04, green in R08, cyan in R13, white in R11.
  - The road edges are bright white (`high/mobile/R08`).
  - The judge stop is a booth plus a studded line plus a panel (`high/desktop/R16`).
  - Rivals carry their team colour as a ring on the road (`high/desktop/R13`).

**Mobile (critics 7.0 / 6.5, mean 6.75). I propose 7.0.**
- The anchor's three tests all pass:
  - Thumb controls never reach the tub. In `high/mobile/R04` the ring's bottom is at about y = 1115 and the Item button's top at about y = 1425 of 1688; landscape controls sit in the corners (`high/landscape/R04`).
  - Both orientations are framed on purpose: portrait team select (`high/mobile/R02`), and landscape with the whole tub visible beside a narrower panel (`high/landscape/R02`).
  - The phone proxy holds 30 fps (fact 8).
- Rebut Codex's "large upper region": the top-left stack reaches y ≈ 395 (23%) only in the left column, over sky, while the tub sits at mid-screen (y ≈ 840–1110).
- Concede: the zero-gap tiles in landscape (see UI) and the cramped landscape team cards.

**Authenticity (critics 6.5 / 7.0, mean 6.75). I propose 7.0.**
- The Row reads as the Row:
  - from the landmark cameras, the Fordyce's patterned facade, red roof and skylight (`high/desktop/R05`), and the Arlington's twin towers (`high/desktop/R06`);
  - from the race camera, the tiled bathhouse dome and the patterned facade along the Row (`high/desktop/R14`, `high/desktop/R15`).
- The real race shows: the gallon water line with its 10-gallon mark, ducks, flags, the judge stop and Rules-of-the-Row heat (`high/desktop/R16`), CLEAN-water results (`high/mobile/R18`), and the title's reference to the real event held each June on Central Avenue (`high/desktop/R01`).
- Concede: no local would name R08, R10 or R12 from the frame, and Codex is right that the ridges look like walls more than the Ouachitas. That is the gap between 7 and 9, not a reason to go below 7.

## IP
I concur with both critics: clean. The heads are square with rounded edges, the torsos are boxes, and the hands are mitten fists. I saw no LEGO name or logo, and the spectators wear capped heads (`high/desktop/R03`, `high/desktop/R15`).

## Gaps: adjustments
- **Duplicates.** `G-facade-relief-glass` (A) and `G-surface-consistency` (Codex) describe one fix, as do `G-slosh-kick` (A) and `G-action-feedback` (Codex). I split each pair's gain so the materials and animation gains are not counted twice.
- **`G-steam-smear` has the wrong cause.** I move it to lighting/WS1 (fact 4). Its fix becomes higher shadow-map resolution, or a tighter shadow frustum and softer filtering for close cameras. Test: no stepped band in `crops/high/R03-kart_5`.
- **`G-dusk-light-pools` has a false premise.** The lamps already pool light (fact 1). What is left is extending the pools onto the road and the shaded left sidewalk. Its test should exclude the player kart, because the black-uniformed team alone supplies 30% of the dark centre pixels.
- **`G-world-plastic-trees`** narrows to bevelling the canopy plate edges, since the studs and glints are already there.
- **`G-pack-tub-read`** narrows to the third row of the pack back.
- **`G-part-construction`** drops to severity 2 (see Characters).
- **`G-part-seams-grip`** narrows to the grip.
- **`G-surface-consistency`** drops to severity 3: the window surrounds and the awning on the Fordyce are already modelled, so what remains is the roofs and the ornament.
- **`G-horizon`** drops to severity 3: the ring faces are real but dominate only the flyover cameras, and this loop's tree lines and haze already moved them (both critics give scenery to A in the A/B).
- **`G-forest-variety`** drops to severity 2: R09 and R12 already mix conifer, broadleaf, autumn and shrub forms.
- **`G-mobile-density`** narrows to landscape card wrapping.
- **`G-ambient-occlusion`** stands as written.

```json
{
  "loop": 6,
  "role": "advocate",
  "tier": "high",
  "scores": {
    "characters": {
      "score": 7.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "crops/high/R02-preview", "note": "separate hip block, split legs, boots; tub = rim + side tile + claw connectors + studded chassis plate + hubcapped wheels; helmets have no studs" },
        { "shot": "crops/high/R02-preview-captain", "note": "neck post and collar plate, separate bevelled arm with cuff; expressive printed face holds at 2x" },
        { "shot": "crops/high/R02-preview-rear", "note": "conceded: flat towel card intersects the fist" },
        { "shot": "high/desktop/R03", "note": "five distinct crews readable at chase distance" },
        { "shot": "high/desktop/R12", "note": "tie-dye antenna team and orange X-strap team distinct at chase distance" }
      ]
    },
    "materials": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/desktop/R05", "note": "canopy tops are studded plates with glints; window lintels and sills modelled; roofs flat-shaded (conceded)" },
        { "shot": "high/desktop/R09", "note": "studded canopy tops with specular glints on the near conifer" },
        { "shot": "high/desktop/R16", "note": "white studded plate across the road with shaded studs" },
        { "shot": "high/desktop/R13", "note": "conceded: opaque blue panes, brick as texture" },
        { "shot": "high/desktop/R04", "note": "conceded: seamless checker asphalt; sharp unbevelled canopy edges" }
      ]
    },
    "scenery": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R06", "note": "conceded: ring reads as a sheer wall from the flyover" },
        { "shot": "high/desktop/R11", "note": "lattice observation tower above the trees; graded haze" },
        { "shot": "high/desktop/R09", "note": "Goat Rock in a dense mixed stand of conifer, broadleaf and autumn crowns" },
        { "shot": "high/desktop/R10", "note": "distinct terracotta tile trail with grout seams" },
        { "shot": "high/desktop/R03", "note": "conceded: storefront modules repeat on the right" }
      ]
    },
    "lighting": {
      "score": 6.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/desktop/R07", "note": "lamp pools on the right sidewalk: luma 184 at a lamp base, 101 midway, 187 at the next; 30% of the dark centre pixels are the player's black-uniformed kart" },
        { "shot": "low/desktop/R07", "note": "same pooling without shadows (180 / 98 / 186), so it is lamp light" },
        { "shot": "high/desktop/R11", "note": "dark centre share 13.7% falls to 9.1% excluding the player kart box; warm haze matched to the sky" },
        { "shot": "high/desktop/R03", "note": "contact shadows under every tub" },
        { "shot": "high/desktop/R04", "note": "conceded: no AO at the wall base or between figures" }
      ]
    },
    "animation": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        { "shot": "strips/high/R15", "note": "crew circle with toy-limb swings; water spheres leave the tub in frames 2-6; gauge 37 to 36 GAL; no camera kick (conceded)" },
        { "shot": "strips/high/R14", "note": "slide puffs in frames 3-8; fence hit throws a water burst in frame 8; gauge 41 to 39 GAL" },
        { "shot": "strips/high/R16", "note": "crew circle the tub while the task bar fills" },
        { "shot": "crops/high/R15-player", "note": "conceded: water plane stays level during the fumble" }
      ]
    },
    "ui": {
      "score": 7.0,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/desktop/R17", "note": "context-aware: 8 LEFT tile, round arena radar with rival dots, x3 item badge" },
        { "shot": "high/desktop/R16", "note": "SEMIFINAL tile and judge-task panel with progress bar" },
        { "shot": "high/desktop/R15", "note": "key strip greys out Bath after the fumble: live status" },
        { "shot": "high/landscape/R04", "note": "conceded: minimap and water tiles butt their neighbours with no gap" },
        { "shot": "high/desktop/R04", "note": "conceded: counter next to the orb has no label" }
      ]
    },
    "typography": {
      "score": 7.0,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/mobile/R18", "note": "results crisp at 390 px with aligned columns; nothing clipped" },
        { "shot": "high/mobile/R04", "note": "0:07.00 and 8TH read at a glance" },
        { "shot": "high/mobile/R02", "note": "portrait team names wrap cleanly in two lines" },
        { "shot": "high/landscape/R02", "note": "conceded: The Out- / of- / Towners breaks over three lines" }
      ]
    },
    "readability": {
      "score": 7.0,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "zoom shows the cowboys' brown tub, the pink tub and the white tub in the first two rows; deep pack merges (conceded)" },
        { "shot": "high/desktop/R12", "note": "orange tub with its flag and the pink tub visible in the pack" },
        { "shot": "high/mobile/R07", "note": "pink and purple rival tubs read at dusk; the dark kart is the player's own black-uniformed team" },
        { "shot": "high/mobile/R08", "note": "player ring and white road edge clear through the bend" },
        { "shot": "high/desktop/R16", "note": "judge stop: booth, studded line, panel" }
      ]
    },
    "mobile": {
      "score": 7.0,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/mobile/R04", "note": "tub ring ends ~y=1115, controls start ~y=1425 of 1688; HUD stack over sky only; orb rim tucks under the place tile (conceded)" },
        { "shot": "high/landscape/R04", "note": "controls in the corners, tub centred; tiles touch with no gap (conceded)" },
        { "shot": "high/landscape/R02", "note": "whole preview tub visible beside the panel; cramped cards (conceded)" },
        { "shot": "high/mobile/R02", "note": "portrait team select framed on purpose" }
      ]
    },
    "authenticity": {
      "score": 7.0,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R05", "note": "Fordyce facade, red roof and skylight" },
        { "shot": "high/desktop/R06", "note": "Arlington twin towers" },
        { "shot": "high/desktop/R14", "note": "tiled bathhouse dome and patterned facade along the Row from the race camera" },
        { "shot": "high/desktop/R16", "note": "judge stop, Rules of the Row heat, duck, flag, water line" },
        { "shot": "high/desktop/R10", "note": "conceded: mountain road not nameable by a local" }
      ]
    }
  },
  "ip": { "clean": true, "notes": "Concur with both critics: rounded-edge square heads, box torsos, mitten fists; no LEGO name or logo; spectators wear caps." },
  "gaps": [
    { "id": "G-world-plastic-trees", "category": "materials", "expectedGain": 0.5, "severity": 2, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R04", "high/desktop/R05", "high/desktop/R09"], "benchmark": "worlds-1", "fix": "Canopy tops already carry shaded studs and glints (R05, R09); bevel the plate edges so eye-level chase views catch edge highlights; test: an R04 crop shows lit canopy edges." },
    { "id": "G-facade-relief-glass", "category": "materials", "expectedGain": 0.3, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R13", "high/desktop/R05"], "benchmark": "worlds-1", "fix": "Recess the panes with a glass material that reflects the sky and add brick-course relief to facades; window surrounds are already modelled. Shares its gain with G-surface-consistency; test: R13 windows show depth." },
    { "id": "G-dusk-light-pools", "category": "lighting", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R07", "low/desktop/R07"], "benchmark": "worlds-4", "fix": "Lamp pools already exist on the right sidewalk (luma 184/101/187); extend them onto the road and the shaded left sidewalk and lift the dusk fill; test the R07 centre below luma 40 excluding the player kart box." },
    { "id": "G-ambient-occlusion", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R04", "high/desktop/R16"], "benchmark": "worlds-4", "fix": "Add SSAO on the high tier or baked AO on static props; test: a visible darkening gradient at the base of the stone wall and under canopies in R04." },
    { "id": "G-pack-tub-read", "category": "readability", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R04", "high/desktop/R12", "high/mobile/R07"], "benchmark": "drive-3", "fix": "First two pack rows already show rival tubs; add a team-coloured rim light or outline on tub shells so the third row back reads; test: every rival tub shell within 40 m is visible in R04 and R07." },
    { "id": "G-steam-smear", "category": "lighting", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["crops/high/R03-kart_5", "crops/high/R04-player", "crops/low/R03-kart_5"], "benchmark": "drive-4", "fix": "Cause corrected: the band appears on a stationary grid at the countdown and is absent on the shadowless low tier, so it is shadow-map texel stepping under the chassis, not a wheel trail. Raise shadow resolution or tighten the shadow frustum and soften filtering for close cameras; test: crops/high/R03-kart_5 shows no stepped band." },
    { "id": "G-slosh-kick", "category": "animation", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R15", "crops/high/R15-player", "strips/high/R14"], "benchmark": "drive-3", "fix": "Splash spheres and gallon loss already show spills; tilt and wave the tub water plane with acceleration and add a short camera shake on fumble or slide release. Shares its gain with G-action-feedback; test: the water angle changes across strip frames." },
    { "id": "G-course-set-pieces", "category": "authenticity", "expectedGain": 0.3, "severity": 2, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R08", "high/desktop/R10", "high/desktop/R12"], "benchmark": "drive-5", "fix": "R11 already frames a lattice tower and R10 has a unique tile trail; give R08 and R12 a nameable brick-built landmark in the chase view; test: each frame contains a unique hero prop." },
    { "id": "G-hud-orb-tile", "category": "ui", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/mobile/R04"], "benchmark": "drive-3", "fix": "The counter already sits on a slate badge; label it, seat the orb so it clears the place tile in portrait, and raise the desktop key labels to at least 13 px; test: no HUD element overlaps or is unlabelled in R04." },
    { "id": "G-plaza-props", "category": "scenery", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R17"], "benchmark": "worlds-1", "fix": "Add a brick-built fountain, planters and benches around the edge of the Water Fight arena while keeping the floor open for play." },
    { "id": "G-part-seams-grip", "category": "characters", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R02-preview-rear", "crops/high/R02-preview"], "benchmark": "drive-4", "fix": "Part breaks at neck, hip and legs already show (R02-preview); narrow to a gripping hand pose so held props no longer intersect the fist; test: the 2x rear close-up shows no intersection." },
    { "id": "G-horizon", "category": "scenery", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["high/desktop/R05", "high/desktop/R06"], "benchmark": "2k-drive/drive-5.jpg", "fix": "Replace the continuous vertical ring faces with overlapping sloped brick terrain and irregular wooded ridgelines; the faces dominate only the flyover cameras, and this loop's tree line and haze already help; verify from the R05 and R06 cameras." },
    { "id": "G-part-construction", "category": "characters", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R02-preview", "crops/high/R03-kart_1", "crops/high/R04-kart_3"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Tubs already read as rim, side tile, claw connectors, studded chassis plate, axles and hubcapped wheels; at most add a visible clip or hinge joint between shell and chassis; verify at chase distance." },
    { "id": "G-surface-consistency", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS1", "evidence": ["high/desktop/R05", "high/desktop/R06"], "benchmark": "worlds/worlds-1.jpg; builders-journey/bj-3.jpg", "fix": "Give roofs and trim parts tiled or bevelled plastic response and sharpen ornament at viewing size; shares its gain with G-facade-relief-glass; verify consistent plastic shading across adjacent surfaces in R05." },
    { "id": "G-action-feedback", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/high/R15"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Add a push-off lean before slides and a readable recovery pose after the fumble; splash and puff particles already exist; demonstrate anticipation, action and settling in new strips." },
    { "id": "G-forest-variety", "category": "scenery", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R09", "high/desktop/R11"], "benchmark": "worlds/worlds-1.jpg", "fix": "Stands already mix conifer, broadleaf, autumn and shrub forms; add two or three more conifer crown builds to break the repeated tiers seen in R09; verify silhouette variety from the landmark camera." },
    { "id": "G-mobile-density", "category": "mobile", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/landscape/R02", "high/mobile/R08"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Narrow to landscape team select: widen the cards or shorten the team names so none breaks over three lines (The Out-of-Towners) and locked labels stay on two; the portrait HUD stack sits over sky and is not the problem." }
  ]
}
```
