# Prosecutor: loop 2 (high tier)

## Summary of the charges
The critics agree on the big items: dither, painted boxes, no AO, broken phone team select, flat particles. But in nine categories they scored above what the captures support, and both missed two systematic defects.

1. **The new barriers are built wrong everywhere on the Row.** The blue posts stand in a line along the curb. The white rails do not join them: they run across the sidewalk at roughly right angles to the post line. So they pass through spectators and lamp posts and stick out over the asphalt by 170 to 210 px (`high/desktop/R13`, `high/desktop/R15`, `high/desktop/R05`, `high/desktop/R03`, `high/desktop/R04`, `high/desktop/R01`). Critic A saw only the ends in R15 and the clipping in R14, and put it down to collision. It is a placement bug in the new set dressing, and it shows in every Row frame.
2. **The player marker labels the wrong tub.** On the phone and on desktop, the floating cone projects onto the rival directly ahead, not onto the player (`high/mobile/R03`, `high/mobile/R04`, `high/desktop/R04`). Critic A called the marker "instant in every race frame". The captures contradict that.

The critics' mean total is 62.5. **My proposed total is 57.5 / 100. Verdict: continue.**

Coordinates are in the capture's own pixels: 1280×800 for desktop, 1560×1688 for portrait at 2×, and 1688×780 for landscape at 2×. "L" is Rec.709 luminance (0–255).

## Category by category

### Characters: critics 6.5 / 7.0, mean 6.75. Proposed 6.5
- **Codex's 7 rests on two anchor clauses Codex itself concedes are not met.** One is "tubs built from recognisable brick parts": Codex says "the tub shell remains largely one smooth bowl". The other is "all 12 teams distinct at chase distance": Codex says it is "not established".
- **At chase distance, team identity comes only from colour and hat.** In race frames every crew shows the same crossed-X back print. In `high/desktop/R04` (zoomed x470–720, y310–470), the two rival teams directly ahead both wear white shirts with yellow X backs. One wears cowboy hats and the other white caps, and nothing else separates them. `high/desktop/R03` (x0–520, y330–560) shows the same. This matches the 5 anchor ("team identity from colour and hat"), not the 7 anchor's "every team a character" at 9.
- **The prints are soft at 2×.** In `crops/high/R03-player-rear`, the edges of the back-print strokes ramp over 8–16 px. Along y=600, L goes 99→86→75→40→31 across x744–760, and the second stroke goes 33→60→74→87→100 across x792–808. That reads as a magnified texture, not a crisp print.
- **The rim studs are visibly faceted.** In `crops/high/R02-preview-captain` (x180–360, y400–540, viewed at 3×), the stud silhouettes are roughly octagonal and their tops are the same flat yellow as the rim.
- **I confirm Critic A's rim-light silvering** of the raised leg in `crops/high/R04-kart_3` (x330–440, y440–580).
- **What I accept.** The faces are expressive and varied: smile, open-mouthed surprise and scowl in `crops/high/R03-kart_1`. I found no gaps or z-fighting. That is why I don't go lower than 6.5.

### Materials: critics 6.0 / 6.0, mean 6.0. Proposed 5.5
- **Close to the camera, the facades are magnified painted textures.** In `crops/high/R03-kart_5` (x0–420, y0–300), window frames and brick courses are blurred, right beside the crisp figures. This is the 5 anchor's "textures from a different style than the models".
- **The Arlington windows are a layering bug, not a "scatter".** Two window systems overlap out of register: a painted window texture, and separate navy panels offset from it that half-cover the painted frames (`high/desktop/R06`, x520–820, y280–480).
- **The road meshes show black hairline seams** that neither critic reported:
  - In `high/desktop/R08` (x700–1280, y380–800), the centreline carries on as a dark line past the yellow dashes, and a second seam crosses the lane.
  - In `high/desktop/R13` (x760–1280, y380–640), two seams cross the junction.
- **The horizon is a blurred, photo-like painted strip**, not brick: `high/desktop/R06` (x0–360, y340–520) and `high/desktop/R17` (x1020–1280, y240–330).
- **Some pine variants are tan or beige**, which reads as sand, off any green palette: `high/desktop/R06` (x270–310, y460–530, and the stack at the bottom left) and `high/desktop/R10` (x780–830, y130–300).
- **What I accept.** Figures and tubs read as glossy plastic (`crops/high/R02-preview`), and landmark walls carry brick courses (`high/desktop/R05`). Against `worlds-1` (7), too many surfaces are still painted card, so 5.5.

### Scenery: critics 6.0 / 6.0, mean 6.0. Proposed 5.5
- **The new barrier dressing is broken in every Row capture.** The posts line the curb, but the rails cross the sidewalk, skewer spectators and lamp posts, and end in mid-air over the road:
  - `high/desktop/R05` (x0–420, y520–800): the rails cut across the post line and end past the white edge line.
  - `high/desktop/R03` (x840–1280, y330–600): horizontal rails run through spectators' torsos.
  - `high/desktop/R04` (x860–1280, y300–420): same as R03.
  - `high/desktop/R01` (x820–1280, y330–760): rails run through the crowd beside the lamp post.
  - `high/desktop/R13`: a rail at y480–488 runs from about x200 to x430 (L 120 against asphalt at 92). At y500 the curb line sits at x255–265, so roughly 170 px of rail hangs over the road.
  - `high/desktop/R15`: two rails at y590–670 run to x≈615, about 200 px past the edge line at x≈405, and end next to the player's crew.

  This is set dressing that is new this loop, and it makes the Row look unassembled.
- **The pine tops float.** In `high/desktop/R08`, along x722–730, the top brick ends at y≈66, open sky (167,204,233) shows from y67 to y77, and the next tier starts at y78. The left pine in `high/desktop/R06` shows the same.
- **The world edge shows:**
  - In `high/desktop/R06`, a pale band (L 183) separates the grass (L 144) from the backdrop hills (L 141).
  - In `strips/high/R14` frames 5–8, the commercial blocks stand on flat, empty green that runs to that band.
- **What I accept.** Brick trees, the brick crowd and the studded baseplate are a real gain over painted cards. But "the world reads as brick-built" needs props that are assembled correctly, so 5.5.

### Lighting: critics 6.0 / 5.5, mean 5.75. Proposed 5.5
- **I agree there is no AO and that the dusk lamps don't light the road** (`high/desktop/R07`).
- **The crew's feet are not grounded at close range.** In `crops/high/R03-kart_5`, the road just in front of the crew's toes (x985–1050, y702–714) is L 88.5, against L 91.6 on open road: 3% darker, so no contact shadow. In `crops/high/R04-player`, under the foot (x900–960, y640–655) is L 84.9 against 91.6.
- **The haze does not match the sky**, so the 7 anchor's "haze matched to the sky" fails. The band in `high/desktop/R06` (x40–200, y440–470) is (156,190,182). That is greener and brighter than the hills behind it (92,151,181) and differs from the sky (144,201,245). `high/desktop/R08` shows the same band at the right.
- **Verdict.** Codex's 5.5 fits. Real cast shadows and a distinct dusk palette lift it above the 5 anchor, but every 7 clause except "deliberate palette" fails.

### Animation and feel: critics 6.0 / 6.0, mean 6.0. Proposed 5.5
- **The R14 "power slide" ends in a hit that nothing reacts to.** In `strips/high/R14`, by frames 7–8 the crew straddle and then cross the curb line onto the sidewalk, and a rail passes through them in frame 8. The rail, the spectators and the camera do not react.
- **The particles hide the action instead of selling it:**
  - In `strips/high/R15` frames 3–6, flat cyan discs cover the whole player tub and captain.
  - In `strips/high/R14` frames 3–8, the dust is opaque beige discs left lying on the road.
- **The marker distorts when the tub yaws.** In `strips/high/R14` frames 3–8, the flat marker billboard skews into a sideways triangle.
- **As Critic A found:** there is no steam during the hot-steam charge, no camera kick and no water slosh.
- **What I accept.** The circle in `strips/high/R15` and `strips/high/R16` has correct rigid toy articulation. That meets one of the 7 anchor's three clauses; the other two fail, so 5.5.

### UI / HUD: critics 6.5 / 6.0, mean 6.25. Proposed 5.5
- **Team select is not usable in either phone orientation** (both critics):
  - `high/landscape/R02` shows no Choose and no Back.
  - `high/mobile/R02` clips Choose and has no Back.

  "Functional" is in doubt: from what is on screen, a landscape player cannot confirm a team.
- **Menus are inconsistent across viewports:**
  - The portrait results drop the team colour swatches that desktop and landscape show (`high/mobile/R18` against `high/desktop/R18` and `high/landscape/R18`), and they stack "25 gal" over "CLEAN" in every row.
  - The Steer label sits inside the pad in landscape (`high/landscape/R04`) but below it in portrait (`high/mobile/R04`).
- **READY overlaps the marker** in `high/desktop/R03`, as Critic A found.
- **Verdict.** This is the 5 anchor's "functional but … inconsistent", with one screen below functional, so 5.5.

### Typography: critics 6.5 / 6.5, mean 6.5. Proposed 6.0
- **"Nothing clipped" fails twice:**
  - In `high/landscape/R02`, the Handling and Water rows are cut by the panel edge.
  - In `high/mobile/R02`, the Choose label sits in a clipped button.
- **Text wraps badly in several places:**
  - Portrait team cards break across 3–4 lines, for example "Silks & / Stirrups / Modified · / locked" in `high/mobile/R02`.
  - "Engine Six Soakers (you)" breaks onto two lines in `high/mobile/R18`.
  - The landscape title footer leaves "business shown." alone on a second line (`high/landscape/R01`), even though balanced wrapping was a change this loop.
- **The locked-card sub-labels have low contrast** (`high/desktop/R02`), as Critic A found.

### Readability: critics 6.5 / 6.5, mean 6.5. Proposed 6.0
- **The player marker points at the rival:**
  - In `high/mobile/R03`, the yellow cone (x357–425, y707–777) sits between the four pushers of the white rival tub, centred over that tub. The player's red-cap tub (y≈850–1150) has nothing above it.
  - `high/mobile/R04` shows the same (cone at x360–420, y730–790, on the white rival).
  - In `high/desktop/R04`, the cone's tip at (640,357) touches the rival captain's white cap (x642–660, y350–372). The player's captain's hat (y410–443) is about 55 px lower.

  Codex's "ambiguous association" understates this; Critic A's "instant" is wrong.
- **The rails cross the road edge into the lane** (`high/desktop/R13`, `high/desktop/R15`), so the road edge, which the 7 anchor says must be "obvious", is cut by barrier geometry.
- **Spray hides the player's tub** in `strips/high/R15` frames 3–6.
- **The dither is wider than one frame.** Noise in near canopies, measured as mean |Δx| of L:
  - 12.9 in `high/desktop/R15` (x0–140, y190–330).
  - 14.0 in `high/desktop/R09` (tree trunk, x1080–1150, y300–520).
  - 7.6 in `high/desktop/R16` (x10–250, y90–430).

  Undithered canopy measures 0.44–0.51 (`high/desktop/R04` x230–400, y210–320; `high/desktop/R14` x100–230, y220–330). That is 15–30× the noise, in at least six of the 15 race frames: R04, R08, R09, R11, R15 and R16.

### Mobile: critics 6.5 / 5.5, mean 6.0. Proposed 5.5
- **Team select is not framed on purpose in either orientation** (`high/landscape/R02`, `high/mobile/R02`).
- **The marker misattribution is worst in portrait** (`high/mobile/R03`, `high/mobile/R04`, `high/mobile/R07`).
- **On the Low tier, which phones run, the crews float.** In `low/mobile/R04`, the only grounding is a soft blob under the chassis (x355–460, y1050–1075, L 62.3 against 90.8 on open road). Crews, trees and the crowd cast no shadow, so the eight pushers in the foreground hover on the asphalt.
- **What I accept.** The controls never cover the tub (`high/mobile/R04`, `high/landscape/R04`), and software GL holds 56 fps. Critic A's 6.5 ignores that no team-select layout is framed on purpose, so 5.5.

### Authenticity: critics 6.5 / 7.0, mean 6.75. Proposed 6.0
- **The 7 anchor needs the Arlington to close the vista and the mountains to read as the Ouachitas. Both fail:**
  - In `high/desktop/R04` (zoomed x540–760, y230–320), Central Avenue ends at the road edge, open sky and a flat blue band that reads as a lake or the sea.
  - The mountains are a blurred blue strip above a pale band (`high/desktop/R06`, `high/desktop/R17`).
  - `high/desktop/R08`, billed as the Hot Springs Mountain Drive switchbacks, shows no mountainside past the road, only that band.
- **Most courses can't be told apart:**
  - `high/desktop/R09` has no Goat Rock and no ford (Critic A).
  - `high/desktop/R13`, Bridge Street, is a generic junction with a red-brick box.
  - `high/desktop/R10`, `high/desktop/R11` and `high/desktop/R12` are interchangeable tree corridors.
- **The judges are hidden behind the feather flag**, which is a flat rectangular board (`high/desktop/R16`, x250–430, y260–600).
- **What I accept.** The Row's bathhouses, the Arlington's towers in R06 and the race ritual all read. 6.0 still clears the ≥6 gate.

## IP check
**Clean.** Heads are rounded cubes on a short neck, and hands are rounded blocks (`crops/high/R02-preview-captain`, x300–420, y220–320, at 3×). Torsos are straight-sided boxes. Studs carry no lettering at 3× (`crops/high/R02-preview-captain`, x180–360, y400–540). No LEGO name or logo appears in `high/desktop/R01`, `high/desktop/R18` or the team select. The title footer names the real Running of the Tubs and states that the game is not affiliated with it. That is not a LEGO mark.

## New gaps (missed by both critics, or sharpened with new evidence)
1. **G-barrier-rail-orientation** (scenery and readability; WS5; severity 4; effort S; +0.5 scenery, +0.25 readability).
   - Fix: set each rail segment's yaw from the vector between consecutive posts, keep rails on the sidewalk side of the curb, and add end posts.
   - Test: in R03, R05, R13 and R15, every rail ends at a blue post, no rail pixel lies on the road side of the curb line, and no rail passes through a spectator or a lamp post.
2. **G-marker-on-rival** (readability and mobile; WS6; severity 3; effort S; +0.5 readability, +0.25 mobile).
   - Fix: anchor the marker about 0.3 m above the captain's hat and shrink it with distance. Alternatively, replace it with a team-colour ground ring or an outline under the player's tub. If the marker's screen box overlaps a rival's, drop it to hat height.
   - Test: in `high/mobile/R03`, `high/mobile/R04` and `high/desktop/R04`, the marker's tip is within 20 CSS px of the player captain's hat and its box overlaps no rival crew.
3. **G-ouachita-backdrop-vista** (authenticity and scenery; WS4; severity 3; effort M; +0.5 authenticity, +0.25 scenery).
   - Fix: replace the painted panorama and pale band with two or three layers of brick-built green ridgelines (stepped plates), with fog set to the horizon sky colour. Extend the terrain to meet them, and close the Central Avenue vista with the Arlington.
   - Test: no band brighter than both its neighbours in R06 or R08, and the Arlington visible at the end of the road in R04.
4. **G-arlington-window-registration** (materials; WS4; severity 2; effort S; +0.25 materials).
   - Fix: snap the navy window panels to the texture's window grid, or remove the painted windows under them.
   - Test: in R06, each panel covers exactly one painted window, with no painted frame showing beside a panel.
5. **G-road-mesh-seams** (materials; WS4; severity 2; effort S; +0.25 materials).
   - Fix: weld the road-strip vertices at the centreline, exclude roads from the seam-darkening term, and merge or offset the overlapping junction meshes.
   - Test: in R08 and R13, no dark line more than 15 L below the road and longer than 20 px outside the painted markings.
6. **G-pine-floating-tiers** (scenery; WS5; severity 2; effort S; +0.25 scenery).
   - Fix: run a 1×1 brick core through the full height of each pine, with no vertical gap between tiers.
   - Test: in R08, the column at x722–730 shows no sky pixels between tiers.
7. **G-low-tier-crew-grounding** (mobile; WS7; severity 3; effort S; +0.25 mobile, +0.25 readability).
   - Fix: add a soft contact-blob decal under each figure and tree on Low, instanced in one draw call.
   - Test: in `low/mobile/R04`, the road under each pusher's feet is at most 0.8× the open-road L.
8. **G-spray-occlusion** (animation; WS3; severity 2; effort S; +0.25 animation).
   - Fix: make the splash particles smaller and semi-transparent, emit them away from the camera, and cap their screen coverage over the player's tub at about 30%.
   - Test: the captain's hat is visible in every frame of `strips/high/R15` frames 3–6.
9. **G-print-and-stud-resolution** (characters; WS2; severity 2; effort S; +0.25 characters).
   - Fix: bake the torso prints at 512 px or more per face, or as SDF decals, and give LOD0 studs 16 or more segments with a top-edge bevel.
   - Test: in `crops/high/R03-player-rear`, the print edge ramp is 4 px or less at 2×, and the stud silhouettes in `crops/high/R02-preview-captain` show no visible facets.
10. **G-mobile-results-consistency** (ui; WS6; severity 1; effort S; +0.25 ui).
    - Fix: keep the team swatches in portrait results, use a compact CLEAN badge so the water cell stays on one line, and put the Steer label in the same place in both orientations.
    - Test: `high/mobile/R18` shows swatches with no two-line water cells.

```json
{
  "loop": 2,
  "role": "prosecutor",
  "tier": "high",
  "verdict": "continue",
  "scores": {
    "characters": {
      "score": 6.5,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "two rival teams ahead both white shirts with yellow X backs (x470-720,y310-470); identity from hat and colour only (5-anchor wording)" },
        { "shot": "crops/high/R03-player-rear", "note": "back print edges ramp over 8-16 px at 2x (L 99-86-75-40-31 across x744-760, y600): soft, not crisp print" },
        { "shot": "crops/high/R02-preview-captain", "note": "rim studs roughly octagonal at 3x, tops same flat yellow as rim (x180-360,y400-540)" },
        { "shot": "crops/high/R04-kart_3", "note": "raised leg silvered by rim light (x330-440,y440-580); tub is one smooth bowl, which Codex concedes" },
        { "shot": "crops/high/R03-kart_1", "note": "faces expressive and varied, no gaps or z-fighting: why not lower" }
      ]
    },
    "materials": {
      "score": 5.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "crops/high/R03-kart_5", "note": "near facade is a blurred magnified painted texture beside crisp figures (x0-420,y0-300)" },
        { "shot": "high/desktop/R06", "note": "two misregistered window systems: navy panels offset over painted windows (x520-820,y280-480); blurred painted horizon strip (x0-360,y340-520)" },
        { "shot": "high/desktop/R08", "note": "black hairline mesh seams along the centreline and across the lane (x700-1280,y380-800)" },
        { "shot": "high/desktop/R13", "note": "two seams crossing the junction asphalt (x760-1280,y380-640)" },
        { "shot": "high/desktop/R10", "note": "tan/beige pine variant off palette (x780-830,y130-300)" }
      ]
    },
    "scenery": {
      "score": 5.5,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/desktop/R13", "note": "rail at y480-488 runs from about x200 to x430; curb line at x255-265 at y500: ~170 px of rail over the road, no end post" },
        { "shot": "high/desktop/R15", "note": "two rails at y590-670 end in mid-air at x~615, ~200 px past the edge line, beside the player's crew" },
        { "shot": "high/desktop/R05", "note": "rails cross the curb-side post line at an angle, through spectators and the lamp post, ending over the road" },
        { "shot": "high/desktop/R03", "note": "horizontal rails run through spectators' torsos (x840-1280,y330-600)" },
        { "shot": "high/desktop/R08", "note": "pine top floats: sky (167,204,233) at x722-730,y67-77 between the top brick and the next tier" },
        { "shot": "strips/high/R14", "note": "frames 5-8: blocks stand on flat empty green running to a pale horizon band" }
      ]
    },
    "lighting": {
      "score": 5.5,
      "confidence": 0.6,
      "evidence": [
        { "shot": "crops/high/R03-kart_5", "note": "road just in front of the crew's toes L 88.5 vs 91.6 open road: no contact shadow" },
        { "shot": "crops/high/R04-player", "note": "under the foot L 84.9 vs 91.6 open road" },
        { "shot": "high/desktop/R06", "note": "horizon haze band (156,190,182) brighter and greener than hills (92,151,181), unlike sky (144,201,245)" },
        { "shot": "high/desktop/R07", "note": "deliberate dusk palette, but lamps light no road pools; no AO anywhere" }
      ]
    },
    "animation": {
      "score": 5.5,
      "confidence": 0.6,
      "evidence": [
        { "shot": "strips/high/R14", "note": "frames 7-8 crew cross the curb onto the sidewalk; rail through the crew in frame 8; no reaction from rail, crowd or camera; marker skews sideways frames 3-8; opaque beige dust discs" },
        { "shot": "strips/high/R15", "note": "frames 3-6 flat cyan discs cover the whole tub and captain; crew circle with correct toy articulation" },
        { "shot": "strips/high/R16", "note": "circle reads; no slosh, no camera kick, no anticipation" }
      ]
    },
    "ui": {
      "score": 5.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/landscape/R02", "note": "no Choose or Back visible: team cannot be confirmed from what is on screen" },
        { "shot": "high/mobile/R02", "note": "Choose clipped, Back absent" },
        { "shot": "high/mobile/R18", "note": "portrait results drop the team swatches shown in high/desktop/R18 and high/landscape/R18; water cells stack 'gal' over 'CLEAN'" },
        { "shot": "high/landscape/R04", "note": "Steer label inside the pad, but below it in high/mobile/R04: inconsistent" },
        { "shot": "high/desktop/R03", "note": "READY overlaps the marker" }
      ]
    },
    "typography": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/landscape/R02", "note": "Handling and Water rows clipped by the panel edge" },
        { "shot": "high/mobile/R02", "note": "Choose label in a clipped button; team cards wrap to 3-4 lines ('Silks & / Stirrups / Modified · / locked')" },
        { "shot": "high/mobile/R18", "note": "'Engine Six Soakers (you)' breaks onto two lines" },
        { "shot": "high/landscape/R01", "note": "footer leaves 'business shown.' as an orphan line despite the balanced-wrap change" }
      ]
    },
    "readability": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        { "shot": "high/mobile/R03", "note": "cone (x357-425,y707-777) sits between the white rival's pushers over its tub; player's tub (y~850-1150) unmarked" },
        { "shot": "high/mobile/R04", "note": "cone (x360-420,y730-790) on the white rival tub ahead" },
        { "shot": "high/desktop/R04", "note": "cone tip (640,357) touches the rival captain's cap (x642-660,y350-372); player's hat ~55 px lower" },
        { "shot": "high/desktop/R13", "note": "barrier rails cross the road edge into the lane" },
        { "shot": "high/desktop/R15", "note": "dither |dx| 12.9 at x0-140,y190-330 vs 0.44-0.51 undithered canopy; rails across the edge line" },
        { "shot": "strips/high/R15", "note": "frames 3-6 spray hides the player's tub" }
      ]
    },
    "mobile": {
      "score": 5.5,
      "confidence": 0.65,
      "evidence": [
        { "shot": "high/landscape/R02", "note": "team select cut off: stat rows clipped, both buttons off-screen" },
        { "shot": "high/mobile/R02", "note": "Choose clipped, Back absent, tub wheels cut by the panel" },
        { "shot": "high/mobile/R03", "note": "player marker sits on the rival tub in portrait" },
        { "shot": "low/mobile/R04", "note": "Low (phone tier): only a chassis blob shadow (L 62.3 vs 90.8); crews cast nothing and float" },
        { "shot": "high/mobile/R04", "note": "controls never cover the tub: why not lower" }
      ]
    },
    "authenticity": {
      "score": 6.0,
      "confidence": 0.6,
      "evidence": [
        { "shot": "high/desktop/R04", "note": "Central Avenue vista ends at open sky and a flat blue band reading as water, not the Arlington (x540-760,y230-320)" },
        { "shot": "high/desktop/R06", "note": "Arlington towers read, but the 'Ouachitas' are a blurred blue strip over a pale band" },
        { "shot": "high/desktop/R08", "note": "billed mountain switchbacks show no mountainside, only the band" },
        { "shot": "high/desktop/R13", "note": "Bridge Street is a generic junction with a red-brick box" },
        { "shot": "high/desktop/R16", "note": "race ritual present; judges hidden behind a flat rectangular flag board (x250-430,y260-600)" }
      ]
    }
  },
  "ip": {
    "clean": true,
    "notes": "Rounded-cube heads on a short neck, rounded block hands (crops/high/R02-preview-captain), straight box torsos; studs plain at 3x; no LEGO name or logo in R01, R02 or R18. The footer names the real event with a non-affiliation note."
  },
  "gaps": [
    { "id": "G-barrier-rail-orientation", "category": "scenery", "expectedGain": 0.75, "severity": 4, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R13", "high/desktop/R15", "high/desktop/R05", "high/desktop/R03", "high/desktop/R04", "high/desktop/R01"], "fix": "Set each rail segment's yaw from the vector between consecutive posts, keep rails on the sidewalk side of the curb, add end posts. Test: in R03, R05, R13 and R15 every rail ends at a post, no rail pixel lies road-side of the curb line, and no rail intersects a spectator or lamp post. Gain split +0.5 scenery, +0.25 readability." },
    { "id": "G-marker-on-rival", "category": "readability", "expectedGain": 0.75, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R03", "high/mobile/R04", "high/desktop/R04"], "fix": "Anchor the marker ~0.3 m above the captain's hat and shrink it with distance (or use a team-colour ground ring or outline under the player's tub); drop it to hat height when its screen box overlaps a rival. Test: in mobile R03 and R04 and desktop R04 the tip is within 20 CSS px of the player captain's hat and overlaps no rival crew. Gain split +0.5 readability, +0.25 mobile." },
    { "id": "G-ouachita-backdrop-vista", "category": "authenticity", "expectedGain": 0.75, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R04", "high/desktop/R06", "high/desktop/R08", "high/desktop/R17"], "fix": "Replace the painted panorama and pale band with 2-3 layers of brick-built green ridgelines (stepped plates), fog set to the horizon sky colour, terrain extended to meet them; close the Central Avenue vista with the Arlington. Test: no band brighter than both neighbours in R06 or R08; Arlington at the end of the road in R04. Gain split +0.5 authenticity, +0.25 scenery." },
    { "id": "G-arlington-window-registration", "category": "materials", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R06"], "fix": "Snap the navy window panels to the texture's window grid, or remove the painted windows beneath them. Test: in R06 each panel covers exactly one painted window, with no painted frame beside a panel." },
    { "id": "G-road-mesh-seams", "category": "materials", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R08", "high/desktop/R13"], "fix": "Weld road-strip vertices at the centreline, exclude roads from the seam-darkening term, and merge or offset overlapping junction meshes. Test: in R08 and R13 no dark line more than 15 L below the road and longer than 20 px outside the painted markings." },
    { "id": "G-pine-floating-tiers", "category": "scenery", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R08", "high/desktop/R06"], "fix": "Run a 1x1 brick core through the full height of each pine, with no vertical gap between tiers. Test: in R08 the column at x722-730 shows no sky between tiers (now sky at y67-77)." },
    { "id": "G-low-tier-crew-grounding", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS7", "evidence": ["low/mobile/R04"], "fix": "On Low, add an instanced soft contact-blob decal under every figure and tree (one draw call). Test: in low/mobile/R04 the road under each pusher's feet is at most 0.8x the open-road L. Gain split +0.25 mobile, +0.25 readability." },
    { "id": "G-spray-occlusion", "category": "animation", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R15", "strips/high/R14"], "fix": "Smaller, semi-transparent splash particles emitted away from the camera, with their screen coverage over the player's tub capped at ~30%. Test: the captain's hat is visible in strips/high/R15 frames 3-6." },
    { "id": "G-print-and-stud-resolution", "category": "characters", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R03-player-rear", "crops/high/R02-preview-captain"], "benchmark": "drive-4", "fix": "Bake torso prints at 512 px or more per face (or SDF decals); give LOD0 studs 16+ segments with a top-edge bevel. Test: print edge ramp 4 px or less at 2x in R03-player-rear; no visible stud facets in R02-preview-captain." },
    { "id": "G-mobile-results-consistency", "category": "ui", "expectedGain": 0.25, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R18", "high/desktop/R18", "high/mobile/R04", "high/landscape/R04"], "fix": "Keep the team swatches in portrait results, use a compact CLEAN badge so water cells stay on one line, and place the Steer label the same way in both orientations. Test: high/mobile/R18 shows swatches and no two-line water cells." }
  ]
}
```
