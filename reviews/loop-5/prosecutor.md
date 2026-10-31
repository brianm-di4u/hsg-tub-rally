# Prosecutor: loop 5, high tier

## Summary
Both critics described the same weaknesses I found: flat backdrop walls, slab trees, weak slide effects and phone HUD collisions. Even so, they scored several categories at or above anchors that these flaws break. Five things they didn't open or measure push the scores lower:
- The "HOT STEAM!" and "WARM STEAM" callouts appear over a tub with almost no steam (`R17`, `R19`).
- At the end of the slide strip the tub has climbed the kerb, and a lamp post stands inside its ring (`strips/high/R14` frame 8).
- The minimap overlaps the place tile in all four landscape race frames.
- The nearest ridge is as dark as trees 50 m away, and the next ring is as bright as the sky (`R05`, `R06`, `R17`).
- A rival tub's ring and splash beads draw with no tub at the bottom of `R19`, on both tiers.

I accept characters (7.0) and readability (6.5). I argue the other eight down by 0.25 to 0.5. My proposed total is **62.5**; the critics' mean is 66.25.

Critic means: characters 7.0, materials 6.5, scenery 6.25, lighting 6.5, animation 6.0, ui 7.0, typography 7.0, readability 6.5, mobile 6.5, authenticity 6.75.

Pixel values below come from the PNGs, measured with PIL. Coordinates are in the file's own pixels.

## Category by category

**Characters: accept 7.0.**
- **What holds up.** The faces, printed uniforms and two-stud helmets hold up at close range (`crops/high/R15-player`, `crops/high/R02-preview-captain`).
- **Why it's only at the floor of 7:**
  - The chase camera mostly shows bare tan backs of heads (`crops/high/R03-player-rear`).
  - A blocky, stepped grey band lifts the road under the chassis while the tub is at rest (`crops/high/R03-kart_5`, around 780–900, 580–700).
  - The flat card a crew member holds passes through his wrist (`crops/high/R02-preview-rear`, around 460–540, 430–600).
- **New finding: Trail Shredders' colours don't match.**
  - Its team-select swatch is orange (`high/desktop/R02`, at 205–230, 290).
  - Its ring, flag and tub stripe are lime green under an orange crew (`high/desktop/R08` ring; `crops/high/R03-kart_1` flag and stripe).
  - Meanwhile Gator Gang, the green team, runs on a cream ring (`high/desktop/R17`).
- **Teams I couldn't check.** Silks & Stirrups and Tub Ninjas never appear in a race capture, and the R18 table lists 8 teams. So "all 12 distinct at chase distance" is unverified, not failed.
- **Verdict.** None of this is enough on its own to drop below the gate, so I accept 7.0.

**Materials: 6.5 → 6.0.**
- **The anchors.** Anchor 7 asks for ABS highlights that follow bevels and seams between parts. Anchor 5 is "surfaces read as painted card…; no specular; textures from a different style than the models".
- **Only the hero assets reach 7:**
  - The tub's face runs luma 57–181, with a real highlight (`crops/high/R02-preview`, 430–700, 380–520).
  - Near baseplate studs are shaded (`high/desktop/R08`, bottom left).
- **Most of every frame reads at 5:**
  - A near canopy face is luma 68–79 across 120×30 px: no highlight, studs, bevel or seam (`high/desktop/R10`, 1140–1260, 290–320).
  - Goat Rock is a brick texture wrapped on angled blocks (`high/desktop/R09`).
  - The Fordyce's diamond pattern and brick are painted textures on flat walls under flat-colour roofs (`high/desktop/R05`). That pixel-pattern texture is a different style from the glossy figures.
  - The backdrop planes are untextured flat colour (`high/desktop/R06`).
- **Verdict.** Weighted by area, that is closer to 6 than 6.5.

**Scenery: 6.25 → 6.0.**
- **What works.** Baseplate ground, tile roads, terraced banks (`R08`, `R19`) and kerbside props near the road do read as brick-built.
- **The skyline breaks it:**
  - The left third of `high/desktop/R06` is a sheer green wall, (56,84,62) at luma 73. That is darker than the foreground trees and grass, at luma 82–97.
  - Pale stepped walls fill the skyline in `R09`, `R12` and `R17`.
- **Near-camera slab canopies swamp race frames.** One dark canopy covers about 24% of `high/desktop/R11` (right side, 740–1280, 0–620), about 14% of `R19` and about 12% of `R08`. That's despite the change log's "near trees step aside sooner".
- **New finding: the crowd uses a second, clashing figure style.** Every spectator is a matte cuboid-head figure with a flat hair cap and no gloss or studs (`high/desktop/R13` left edge, `high/desktop/R15` left, `high/desktop/R16` at the booth). It doesn't match the rounded, glossy crew. Anchor 3 is "world and characters clash", and this is a partial case of it.

**Lighting: 6.5 → 6.0.**
- **The anchor.** Anchor 7 needs "haze matched to the sky". It isn't.
- **The nearest ridge gets no haze:**
  - In `high/desktop/R05` the ridge behind the Row is (60,90,66), luma 79, at 400–560, 220–260.
  - That is as dark as a tree about 50 m away (1120–1160, 380–400; luma 74), against a sky of luma 204.
  - In `high/desktop/R06` the cliff (luma 73) is darker than the foreground (82–97).
- **The next ring jumps almost to sky brightness:**
  - In `high/desktop/R17` it is (191,212,224), luma 207, the same luma as the sky beside it (182,214,236).
  - In `high/desktop/R12` it is (140,169,144).
- **Result.** Haze comes in two steps, not a gradient, and the backdrops read as a dark wall in front of white walls.
- **Sunset.** The critics already showed that `R11` is underlit (road about (49,37,34)). On top of that, about a quarter of the frame is near-black canopy.
- **Credit.** Dusk in `R07` is deliberate and the Row facades separate in `R06`. That keeps lighting at 6, not lower.

**Animation and feel: 6.0 → 5.5.**
- **The credit.** The circling in `strips/high/R15` and `strips/high/R16` is convincing.
- **The anchor.** Anchor 7 also needs "slides, boosts, hits and splashes read with particles and camera kick; water visibly sloshes". Two of those three fail, and the evidence goes past the strip the critics leaned on.
- **Hot steam shows no steam.** In `high/desktop/R17` the "HOT STEAM!" callout is on screen.
  - Only 32 of 128,000 px in a 400×320 box round the tub (440–840, 360–680) have an orange hue (15–45°, saturation > 0.55, value > 0.7).
  - The only particles are lilac pearl spheres, (198,180,215), at the tub's front.
- **Warm steam is about ten dots.** In `high/desktop/R19` the "WARM STEAM" callout sits over roughly ten lilac and blue dots of 2–4 px near the rear wheels (530–670, 575–610). Both critics missed this.
- **The slide strip:**
  - `strips/high/R14` frames 3–8 show two clumps of 8–10 opaque white spheres. They rest on the road one to two tub-widths from the wheels and never turn orange.
  - By frame 8 the tub has climbed onto the pavement, and the lamp post stands inside the player's ring in front of the right-hand crew figure.
  - The slide ends in a clip, not a read.
- **No slosh.** No water movement shows in any strip.
- **Verdict.** This is anchor 5: "run cycles…, weak feedback".

**UI / HUD: 7.0 → 6.5.**
- **The anchor.** Anchor 7 says "in one style… nothing overlapping". Critic A pushed every overlap into mobile, but the UI anchor names overlap itself.
- **Overlaps:**
  - In portrait the lap tile is drawn about 25 px over the top of the gauge, and the item orb about 9 px over the place tile, in every race frame (`high/mobile/R04`, `high/mobile/R17`).
  - In landscape the minimap overlaps the place tile by about 20 px in all four race frames (`high/landscape/R04`, `R07`, `R08`, `R17`).
- **At least four visual styles in one HUD:**
  - Opaque slate tiles with an outline (lap, place, checklist).
  - A translucent gauge box with no outline; the brick building and awning show through it in `high/landscape/R17`.
  - A minimap that is a bare line or circle with no tile at all (`high/desktop/R04` at 1165–1225, 648–780; `high/desktop/R17`).
  - A glass orb.
- **Two callout styles:** teal bars (`R17`, `R19`) and a studded brick panel (`R16`).
- **Credit.** The desktop hierarchy and the menus (`R01`, `R02`, `R18`) hold this at 6.5.

**Typography: 7.0 → 6.5.** This is my weakest charge.
- **The anchor.** Anchor 7 says "numerals read at a glance; nothing clipped".
- **The item count fails it.** The "x3" item count is the only in-race count besides place, time and gallons.
  - On desktop it is about 8 px tall and crosses the orb's outline (`high/desktop/R17`, around 613–628, 50–58).
  - In portrait it is about 6.5 CSS px, and the "3" merges into the outline (`high/mobile/R17`).
- **Card labels are crowded.** Team-card separators wrap to orphan lines ("Traditional · / locked", "· locked") in `high/mobile/R02` and `high/landscape/R02`.
- **Locked labels are faint.** Locked-card labels are about 8 px at 3.2:1 contrast (`high/desktop/R02`, "Stock · locked").

**Readability: accept 6.5.**
- **Already counted.** The critics counted the pack occlusion (`R04`, `R07`, `R12`).
- **New finding: a ring with no tub.**
  - At the bottom of `high/desktop/R19` a gold rival ring, (176,148,64), with blue splash beads arcs across 360–700, 745–785.
  - There's no tub or crew attached. The same arc appears in `low/desktop/R19`.
- **New finding: the judge is hard to see.** The judge is a crowd-style figure in a striped shirt, half hidden behind a spectator, beside a blank white booth (`high/desktop/R16`). The stop reads mainly through the studded line and the banner.
- **Verdict.** These are real but small, so I accept 6.5.

**Mobile: 6.5 → 6.0.**
- **Passes:**
  - The thumb controls never cover the tub.
  - SwiftShader holds 55 fps.
- **Fails: "framed on purpose".**
  - The tiles collide in every race frame in both orientations (the counts are under UI).
  - The landscape team select shows only an ~80 px sliver of crew at 1280–1360 beside the panel. The turntable is the screen's subject and it is hidden (`high/landscape/R02`).
- **Verdict.** This is anchor 5's "works but cramped", lifted a little by the good portrait team select (`high/mobile/R02`).

**Authenticity: 6.75 → 6.5.**
- **Credit.** The Fordyce (`R05`), the Arlington (`R06`), the domed bathhouse (`R14`) and the race kit (gallons, checklist, ducks, flags) are real credit.
- **The mountains don't read as the Ouachitas:**
  - The nearest ring is a sheer cliff (`R06`).
  - The outer rings are pale stepped walls that read as snowfields or mesas (`R09`, `R12`, `R17`).
- **Goat Rock** is brick masonry towers (`R09`).
- **The judge**, the one race ritual tied to a person, is a background crowd figure (`R16`).
- **Bridge Street** (`R13`) is a generic wide avenue.
- **Verdict.** I agree with Critic A's 6.5 over Codex's 7.

## IP check
**Clean for LEGO.**
- Heads are rounded boxes, hands are round fists, and torsos are straight boxes (`crops/high/R15-player`, `crops/high/R03-player-rear`).
- Helmet studs are generic.
- Stud tops are plain, with no logo (`high/desktop/R08`, near bank).
- No LEGO name appears anywhere.

**Outside the gate.** The crowd figure in `high/desktop/R13` (left edge) and `high/desktop/R15` (left) still reads as Minecraft's default character: square tan head, flat brown hair cap, cyan tee, dark legs. Every crowd figure uses this kit, so I've filed it as a scenery gap.

## Gaps the critics missed
1. **G-steam-tier-visual** (animation, WS3, severity 4, effort M, +0.5).
   - **Problem.** The steam callouts fire with no matching visual (`R17`, `R19`).
   - **Fix.** Drive puff size, opacity and colour from the charge, and emit from the rear wheel contacts.
   - **Test.** In `high/desktop/R17`, at least 1,500 px of orange (hue 15–45°, saturation > 0.55, value > 0.7) within 150 px of the rear wheels. In `high/desktop/R19`, at least 800 px of soft white puffs within 120 px of the wheels.
2. **G-backdrop-haze-ramp** (lighting, WS1, severity 3, effort S, +0.5).
   - **Fix.** Apply distance fog to each ridge ring so its value rises steadily from the nearest trees toward the sky.
   - **Test.** In `R05` and `R06`, nearest-ridge luma is at least 1.25× the mid-distance tree luma and at most 0.85× the sky. Each further ring is lighter than the one in front of it.
3. **G-minimap-tile-dock** (ui, WS6, severity 3, effort S, +0.5).
   - **Fix.** Put the minimap on an opaque slate tile like the lap tile, and dock it at least 8 px below the place tile. Make the gauge tile opaque with the same outline.
   - **Test.** In `high/landscape/R04`, `R07`, `R08` and `R17`, the map's box doesn't intersect the place tile, and no scene pixels show through the gauge.
4. **G-orphan-ring-near-camera** (readability, WS1, severity 3, effort S, +0.25).
   - **Fix.** Fade a tub's ring and particles together with its crew and tub, or don't fade tubs inside the chase volume.
   - **Test.** No ring arc without its tub in `high/desktop/R19` or `low/desktop/R19`.
5. **G-crowd-kit-style** (scenery, WS5, severity 3, effort M, +0.25).
   - **Fix.** Build spectators and judges from the crew kit at a low LOD (rounded glossy head, printed face, studded hair or hat), and vary the palette away from cyan tee, brown hair and dark legs.
   - **Test.** Crowd heads in `R13` and `R15` show a specular highlight, and none use the cyan, brown and dark combination.
6. **G-near-canopy-cull** (scenery, WS5, severity 3, effort S, +0.25).
   - **Fix.** Fade or offset canopies that enter the chase camera's near volume, not just trunks.
   - **Test.** No single canopy covers more than 8% of `R08`, `R11` or `R19` (now about 12%, 24% and 14%).
7. **G-slide-kerb-clip** (animation, WS3, severity 2, effort M, +0.25).
   - **Problem.** The sliding tub mounts the pavement, and a lamp post ends up inside its ring (`strips/high/R14` frames 7–8).
   - **Fix.** Collide tubs with kerbs and lamp posts.
   - **Test.** No prop mesh inside the player ring in any `R14` strip frame.
8. **G-team-colour-key** (readability, WS2, severity 2, effort S, +0.25).
   - **Fix.** Give each team one colour key across the swatch, ring, flag and stripe. Trail Shredders: orange swatch, green ring.
   - **Test.** For every team, the ring hue is within 20° of the team-select swatch hue.
9. **G-item-count-badge** (typography, WS6, severity 2, effort S, +0.25).
   - **Fix.** Move the item count to its own dark badge outside the orb.
   - **Test.** The count is at least 12 CSS px tall and doesn't overlap the orb outline at 1280, 390 and 844 px.
10. **G-judge-booth** (authenticity, WS5, severity 2, effort M, +0.25).
    - **Fix.** Seat a brick-kit judge in the booth, facing the road, with a printed sash or placard.
    - **Test.** In `strips/high/R16` the judge is fully visible and at least 40 px tall in at least 6 of 8 frames.
11. **G-card-label-wrap** (typography, WS6, severity 1, effort S, +0.1).
    - **Fix.** Replace "· locked" with a lock icon and raise the locked labels' contrast.
    - **Test.** No card line starts or ends with "·" at 390 or 844 px, and locked labels are at least 4.5:1.

```json
{
  "loop": 5,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "characters": {"score": 7.0, "confidence": 0.6, "evidence": [
      {"shot": "crops/high/R15-player", "note": "accept: printed faces, uniforms, two-stud helmets hold up close"},
      {"shot": "crops/high/R03-player-rear", "note": "bare tan backs of heads are what the chase camera mostly shows"},
      {"shot": "crops/high/R03-kart_5", "note": "blocky stepped grey band lifts the road under the chassis at rest (780-900, 580-700)"},
      {"shot": "crops/high/R02-preview-rear", "note": "held card passes through the wrist (460-540, 430-600)"},
      {"shot": "high/desktop/R08", "note": "Trail Shredders ring lime green under orange crew; swatch in high/desktop/R02 is orange"}]},
    "materials": {"score": 6.0, "confidence": 0.5, "evidence": [
      {"shot": "high/desktop/R10", "note": "near canopy face luma 68-79 over 120x30 px (1140-1260, 290-320): no highlight, stud or bevel"},
      {"shot": "crops/high/R02-preview", "note": "tub face luma 57-181: plastic read limited to hero assets"},
      {"shot": "high/desktop/R09", "note": "Goat Rock is a brick texture on angled blocks"},
      {"shot": "high/desktop/R05", "note": "Fordyce pattern and brick painted on flat walls, flat-colour roofs; texture style differs from the glossy figures"},
      {"shot": "high/desktop/R08", "note": "credit: shaded studs near camera, terraced bank seams"}]},
    "scenery": {"score": 6.0, "confidence": 0.55, "evidence": [
      {"shot": "high/desktop/R06", "note": "left third a sheer flat wall (56,84,62), darker than the foreground"},
      {"shot": "high/desktop/R11", "note": "one near slab canopy covers ~24% of the frame; R19 ~14%, R08 ~12%"},
      {"shot": "high/desktop/R13", "note": "crowd is a matte cuboid-head figure kit that clashes with the glossy crews"},
      {"shot": "high/desktop/R17", "note": "pale stepped walls fill the skyline"},
      {"shot": "high/desktop/R04", "note": "credit: baseplate, tile road, props read brick-built near the road"}]},
    "lighting": {"score": 6.0, "confidence": 0.5, "evidence": [
      {"shot": "high/desktop/R05", "note": "nearest ridge (60,90,66) luma 79 ~ tree 50 m away luma 74; sky luma 204: no haze ramp"},
      {"shot": "high/desktop/R06", "note": "cliff luma 73 darker than foreground 82-97"},
      {"shot": "high/desktop/R17", "note": "next ring (191,212,224) luma 207 equals the sky: two-step haze"},
      {"shot": "high/desktop/R11", "note": "sunset underlit; ~24% of frame near-black canopy"},
      {"shot": "high/desktop/R07", "note": "credit: deliberate dusk palette and lamp pools"}]},
    "animation": {"score": 5.5, "confidence": 0.6, "evidence": [
      {"shot": "strips/high/R14", "note": "frames 3-8: opaque white sphere clumps 1-2 tub-widths from the wheels, never orange; frame 8 the tub is on the pavement with a lamp post inside its ring"},
      {"shot": "high/desktop/R17", "note": "HOT STEAM! callout; 32 of 128,000 px orange-hued in the box round the tub; only lilac pearls (198,180,215)"},
      {"shot": "high/desktop/R19", "note": "WARM STEAM callout over ~10 lilac/blue dots of 2-4 px"},
      {"shot": "strips/high/R15", "note": "credit: crew circling reads"},
      {"shot": "strips/high/R16", "note": "credit: circling with progress fill; no slosh visible in any strip"}]},
    "ui": {"score": 6.5, "confidence": 0.6, "evidence": [
      {"shot": "high/mobile/R04", "note": "lap tile ~25 px over the gauge; orb ~9 px over the place tile (all portrait race frames)"},
      {"shot": "high/landscape/R17", "note": "minimap ~20 px over the place tile (also R04, R07, R08); gauge tile translucent, scene shows through"},
      {"shot": "high/desktop/R04", "note": "minimap a bare line with no tile; gauge lacks outline: four HUD styles"},
      {"shot": "high/desktop/R16", "note": "brick-panel callout vs teal callouts in R17/R19"},
      {"shot": "high/desktop/R18", "note": "credit: consistent menu panels"}]},
    "typography": {"score": 6.5, "confidence": 0.45, "evidence": [
      {"shot": "high/desktop/R17", "note": "x3 item count ~8 px, crosses the orb outline (613-628, 50-58)"},
      {"shot": "high/mobile/R17", "note": "x3 ~6.5 CSS px, the 3 merges into the outline"},
      {"shot": "high/landscape/R02", "note": "orphaned separator lines ('Modified ·' / 'locked')"},
      {"shot": "high/desktop/R02", "note": "locked labels ~8 px at 3.2:1"},
      {"shot": "high/desktop/R18", "note": "credit: clear display/table scale"}]},
    "readability": {"score": 6.5, "confidence": 0.6, "evidence": [
      {"shot": "high/desktop/R19", "note": "gold rival ring (176,148,64) with splash beads at 360-700, 745-785 and no tub; same in low/desktop/R19"},
      {"shot": "high/desktop/R07", "note": "pack crews hide rival tubs"},
      {"shot": "high/desktop/R16", "note": "judge is a half-hidden crowd figure by a blank booth; stop reads via studded line and banner"},
      {"shot": "high/desktop/R10", "note": "credit: item orbs and road edges obvious"}]},
    "mobile": {"score": 6.0, "confidence": 0.55, "evidence": [
      {"shot": "high/mobile/R17", "note": "tile collisions in every portrait race frame"},
      {"shot": "high/landscape/R08", "note": "minimap over place tile; same in R04, R07, R17"},
      {"shot": "high/landscape/R02", "note": "turntable preview hidden: ~80 px sliver of crew at 1280-1360"},
      {"shot": "high/mobile/R02", "note": "credit: portrait team select framed well; controls never cover the tub"}]},
    "authenticity": {"score": 6.5, "confidence": 0.55, "evidence": [
      {"shot": "high/desktop/R06", "note": "Arlington recognisable; mountain is a sheer flat cliff, not the Ouachitas"},
      {"shot": "high/desktop/R09", "note": "Goat Rock reads as masonry towers; pale stepped walls on the skyline"},
      {"shot": "high/desktop/R16", "note": "judge ritual carried by a background crowd figure"},
      {"shot": "high/desktop/R05", "note": "credit: Fordyce recognisable"}]}
  },
  "ip": {"clean": true, "notes": "Rounded box heads, round fists, straight torsos; generic helmet studs; plain stud tops; no LEGO name or logo. Outside the gate: crowd figures in high/desktop/R13 and R15 read as Minecraft's default character (filed as G-crowd-kit-style)."},
  "gaps": [
    {"id": "G-steam-tier-visual", "category": "animation", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS3", "evidence": ["high/desktop/R17", "high/desktop/R19", "strips/high/R14"], "benchmark": "drive-3", "fix": "Drive puff size, opacity and colour from the charge and emit from the rear wheel contacts. Test: in high/desktop/R17 at least 1,500 px of orange (hue 15-45 deg, s>0.55, v>0.7) within 150 px of the rear wheels; in high/desktop/R19 at least 800 px of soft white puffs within 120 px of the wheels."},
    {"id": "G-backdrop-haze-ramp", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R05", "high/desktop/R06", "high/desktop/R17"], "benchmark": "worlds-4", "fix": "Apply distance fog to each ridge ring so value rises steadily toward the sky. Test: in R05 and R06 nearest-ridge luma is at least 1.25x the mid-distance tree luma and at most 0.85x the sky; each further ring is lighter than the one in front."},
    {"id": "G-minimap-tile-dock", "category": "ui", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R04", "high/landscape/R07", "high/landscape/R08", "high/landscape/R17", "high/desktop/R04"], "benchmark": "drive-3", "fix": "Put the minimap on an opaque slate tile with the lap tile's outline and bevel, docked at least 8 px below the place tile; make the gauge tile opaque with the same outline. Test: in the four landscape race frames the map box does not intersect the place tile, and no scene pixels show through the gauge."},
    {"id": "G-orphan-ring-near-camera", "category": "readability", "expectedGain": 0.25, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R19", "low/desktop/R19"], "benchmark": "drive-3", "fix": "Fade a tub's ring and particles together with its crew and tub, or don't fade tubs inside the chase volume. Test: no ring arc without its tub in high/desktop/R19 or low/desktop/R19."},
    {"id": "G-crowd-kit-style", "category": "scenery", "expectedGain": 0.25, "severity": 3, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R13", "high/desktop/R15", "high/desktop/R16"], "benchmark": "worlds-1", "fix": "Build spectators and judges from the crew kit at low LOD (rounded glossy head, printed face, studded hair or hat) and vary the palette away from cyan tee, brown hair and dark legs. Test: crowd heads in R13 and R15 show a specular highlight, and none use the cyan/brown/dark combination."},
    {"id": "G-near-canopy-cull", "category": "scenery", "expectedGain": 0.25, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R11", "high/desktop/R19", "high/desktop/R08"], "benchmark": "drive-1", "fix": "Fade or offset canopies, not just trunks, that enter the chase camera's near volume. Test: no single canopy covers more than 8% of R08, R11 or R19 (now about 12%, 24% and 14%)."},
    {"id": "G-slide-kerb-clip", "category": "animation", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14"], "benchmark": "drive-3", "fix": "Collide tubs with kerbs and lamp posts so a slide can't end with street furniture inside the crew circle. Test: no prop mesh inside the player ring in any R14 strip frame."},
    {"id": "G-team-colour-key", "category": "readability", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["high/desktop/R02", "high/desktop/R08", "crops/high/R03-kart_1", "high/desktop/R17"], "benchmark": "drive-3", "fix": "Give each team one colour key across the team-select swatch, ring, flag and tub stripe (Trail Shredders: orange swatch, green ring). Test: for every team, ring hue is within 20 deg of the swatch hue."},
    {"id": "G-item-count-badge", "category": "typography", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R17", "high/mobile/R17", "high/landscape/R17"], "benchmark": "drive-3", "fix": "Move the item count to its own dark badge outside the orb. Test: the count is at least 12 CSS px tall and doesn't overlap the orb outline at 1280, 390 and 844 px."},
    {"id": "G-judge-booth", "category": "authenticity", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS5", "evidence": ["high/desktop/R16", "strips/high/R16"], "benchmark": "drive-5", "fix": "Seat a brick-kit judge in the booth, facing the road, with a printed sash or placard. Test: in strips/high/R16 the judge is fully visible and at least 40 px tall in at least 6 of 8 frames."},
    {"id": "G-card-label-wrap", "category": "typography", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R02", "high/mobile/R02", "high/desktop/R02"], "benchmark": "drive-2", "fix": "Replace '· locked' with a lock icon and raise locked-label contrast. Test: no card line starts or ends with a separator at 390 or 844 px, and locked labels are at least 4.5:1."}
  ]
}
```
