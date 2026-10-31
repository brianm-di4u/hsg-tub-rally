# Prosecutor: loop 10, high tier

## Summary
I opened every high-tier desktop frame (R01–R19), all 10 high-tier close-ups, the three high-tier strips, every phone frame in both orientations, and the A/B pairs the critics relied on. I measured with PIL crops in my own scratch folder. Both critics set their 7s against the anchors too loosely, and four defects in the captures went unnoticed:
- **R14 slide leaves the road:** in `strips/high/R14` the power slide carries the tub onto the pavement and against a lamp post, and nothing reacts.
- **Stretched studs on smooth slopes:** the creek bank in `high/desktop/R19` and the slope in `high/desktop/R08` are smooth surfaces with the stud texture stretched across them.
- **Tapered brick texture:** the Goat Rock blocks are tapered prisms carrying a brick-course texture.
- **Solid steam:** the steam is now opaque marbles.

The countdown fix also only landed on desktop: on both phone orientations the countdown still sits over the play.

I propose 64.0/100, against a critic mean of 67.25. I accept the critics' mean for scenery and lighting. In lighting, one of Codex's supporting observations is false and should not be used to argue the score up.

## Category by category

### Characters: critics 7 / 7, mean 7.0, proposed **6.5**
- **The tub misses two named parts of the 7 anchor.** The anchor asks for "studs on hats and tubs" and "tubs built from recognisable brick parts". Every kart close-up shows the tub as one smooth moulded bathtub shell, with no stud and no seam between rim and body: `crops/high/R02-preview`, `crops/high/R03-player`, `crops/high/R03-kart_1`, `crops/high/R03-kart_5`, `crops/high/R04-kart_3`.
  - Only the raised stripe tile, the gold claw feet, the wheels and the chassis plate are brick parts.
  - Correction to Critic A: the chassis does carry low octagonal studs, below the tub's right side in `crops/high/R03-player` and along the left edge in `crops/high/R04-kart_3`. The shell is the problem, not the chassis.
- **The fumble close-up does not hold up.** In `crops/high/R15-player` the flash washes out the whole kart, not only the helmets. Median colours against `crops/high/R03-player`:

  | Part | R03-player | R15-player |
  |---|---|---|
  | Tub body | (91,32,27) | (243,185,180) |
  | Tyres | (25,28,30) | (176,178,178) |
  | Black uniform torsos | (26,30,31) | about (181,185,186) |

  The coat prints fade to pale lines. Frames 1–2 of `strips/high/R15` show the same.
- **"All 12 teams distinct" is unproven.** Only 10 teams appear in the captures; Silks & Stirrups and Tub Ninjas never do.
- **Credit:** the faces, uniform prints, studded helmets and mitten hands are good (`crops/high/R02-preview-captain`). That is why I stop at 6.5.

### Materials: critics 6.5 / 6.5, mean 6.5, proposed **6.0**
Neither critic mentions the following:
- **Stretched studs on the creek bank.** In `high/desktop/R19` (right half, x 740–1280, y 380–800) the creek bank is a smooth curved surface carrying the baseplate texture. The studs stretch into long ovals, and thin parallel seam lines follow the curve. The same smooth, lined slope appears at the lower left of `high/desktop/R08`. This is a texture on a slope, not plates.
- **Brick courses on tapering faces.** The Goat Rock blocks in `high/desktop/R09` are tapered prisms with a running-bond brick texture on their sloped faces; real bricks cannot taper. Several faces also show a diagonal shading split along the triangulation (the centre block's top, the right-hand block at x 760–850).
- **Solid steam.** The steam in `high/desktop/R17` (x 600–680, y 560–615) and `high/desktop/R19` is opaque, hard-edged shaded spheres. At 8× zoom the spheres show dark rims where they overlap, so they read as cotton balls or marbles, not vapour. This loop raised their opacity to 82–95%, which makes them more solid.

The critics' own points still stand: flat facades with inset window quads (`high/desktop/R06`), opaque blue ground-floor panes (`high/desktop/R05`), a blue tile ford (`high/desktop/R19`), and no wear anywhere.

The 7 anchor (`worlds-1`) wants a consistent ABS read with seams between bricks and plates. Here the figures and tubs read as plastic, but large parts of the world are textures on smooth shapes: banks, rocks, facades and effects. That is halfway between "painted card" (5) and 7.

### Scenery: critics 6.5 / 6.5, mean 6.5, **accept 6.5**
The world is consistently brick-built and each course has a set piece, so 6.5 is fair. Defects to note (they support the gaps, not a lower score):
- **Repeated building kit:** the same red-brick three-storey block, with the same window grid and beige frames, appears in `high/desktop/R03` (right), `high/desktop/R07` (left) and `high/desktop/R13` (right).
- **Lofted bank:** the R19 bank described under materials.
- **Stray foreground railing:** a tan railing cuts the bottom-right corner of the Arlington shot (`high/desktop/R06`, x 900–1280, y 650–800).

### Lighting: critics 6.5 / 6.5, mean 6.5, **accept 6.5, with Codex's R07 evidence struck**
- **No streetlight pools in R07.** Codex credits `high/desktop/R07` with "useful pools of streetlight". The capture does not support this:
  - The lamp globes are flat cream; the brightest pixel is (255,237,184).
  - The sky just right of the near right-hand globes measures luminance 91.3, against 93.1 sixty pixels further away, so there is no halo or bloom.
  - The paving shows no lit pool under the lamp bases.
  - The shop windows are dark.
- **No visible AO at the Arlington arcade.** In `high/desktop/R06` the arcade wall (x 478–500) holds luminance 180–182 all the way down to y 702 and falls only at the ground edge (y 708–714). This loop moved the AO fade to 90–150 m so the landmark cameras would see it, yet no occlusion gradient shows.

The remaining credit is enough for 6.5 and no more: real soft cast shadows (`high/desktop/R10`), three deliberate palettes (`high/desktop/R07`, `high/desktop/R11`), and haze matched to the sky. If the advocate argues lighting up, the R07 "pools" observation should not count.

### Animation and feel: critics 6.5 / 6.5, mean 6.5, proposed **6.0**
The 7 anchor has three clauses. Only the first is met.

1. **The crew push-run and circle the tub: met.** The crew circle with limbs swinging at the joints in `strips/high/R15` and `strips/high/R16`.
2. **Slides, boosts, hits and splashes read with particles and camera kick: not met.**
   - In `strips/high/R14` frames 6–8 (0:03.68 to 0:03.95), the slide carries the tub over the road edge and onto the pavement.
   - By frame 8 the top half of the player ring sits on the paving, and a lamp post stands on the ring's right edge, flush against the right-hand pushers.
   - Nothing reacts: no bump, no impact particles, no camera kick, and the crew's pose is unchanged. Critic A's "camera swings with the slide" is the camera following the tub off the road.
   - In `strips/high/R15` the camera is identical across all 8 frames after the fumble.
   - The particles are opaque marbles (frames 3–6).
3. **Water visibly sloshes: not met.** None of the 24 high-tier strip frames shows a tilted water surface, despite this loop driving the slosh 2.5× harder.
   - In `strips/high/R16` frames 2 and 6, zoomed 4×, the water sheet is level.
   - In `strips/high/R15` frames 3–6 the spray hides it.

The `drive-3` effects bar (8.5) is far off. One clause out of three puts this at 6.0.

### UI / HUD: critics 7 / 7, mean 7.0, proposed **6.5**
- **The countdown still overlaps the play on phones (anchor: "nothing overlapping").** This loop moved the call-outs under the top HUD only on desktop-sized windows.
  - In `high/landscape/R03`, READY covers about x 573–1113, y 213–367 of 1688×780: the grid ahead.
  - In `high/mobile/R03`, READY spans about y 425–530 of 1688, sitting on the road's vanishing point at about y 535.
- **The top-centre slot is wasted.** The most prominent HUD slot shows an empty grey sphere in 12 of the 13 desktop race frames (every one except `high/desktop/R17`). On `high/landscape/R04` that plate is about 290×170 device px, as large as the place plate.
- **The landscape HUD is oversized.** On `high/landscape/R04` the left stack runs from y 22 to y 447, 55% of the height, and the plates cover about 25% of the frame.
- **The menus differ by viewport.** The landscape team select drops the division labels and leaves Back alone under Choose (`high/landscape/R02`).
- **Credit:** the navy stud plates and brick buttons are consistent (`high/desktop/R01`, `high/desktop/R18`), and nothing overlaps on desktop.

The anchor bar is `drive-3` (7) and `drive-2` (8.5).

### Typography: critics 7 / 6.5, mean 6.75, proposed **6.5**
- **Baseline offset in the portrait results.** In `high/mobile/R18` the water column's digits sit 4 device px (2 CSS px) below the time and points digits on every row. In row 1 the time occupies y 721–737, the water y 725–741 and the points y 721–737, and the same offset repeats in rows 2–8. Desktop (`high/desktop/R18`) is aligned to the pixel, so this is a portrait-only layout fault.
- **Wrapping and splits:**
  - "Engine Six Soakers (you)" wraps to two lines in `high/mobile/R18`.
  - "Inspired / by:" is split across lines in `high/landscape/R02`.
- **Small labels:** the desktop card labels are about 10–11 px (`high/desktop/R02`).
- **Too many faces:** pixel display, bold call-out sans and UI sans.
- **Credit:** the numerals read at a glance, and the dark selected-card label is fixed.

### Readability: critics 6.5 / 7, mean 6.75, proposed **6.5**
- **The fumble flash recolours the player's team.** In `high/desktop/R15`, `crops/high/R15-player` and frame 1 of `strips/high/R15`, the Engine Six crew get pink helmets (237,185,177) and pale grey-white uniforms. Those are the Flamingo Flock and Lather & Linen palettes, so in that moment the player's own team does not read.
- **The player's kart is buried at the end of the slide.** In `strips/high/R14` frame 8 the tub is off the road, and the crew are covered by spray marbles and the white drift arc.
- **Phone countdowns** cover the grid and the vanishing point (`high/landscape/R03`, `high/mobile/R03`).
- **The player's tub is barely visible.** In `high/desktop/R04` it is a red sliver between two crew backs; the ring and arrow do all the work.
- **Distant pickups are tiny:** 8–10 px dots at the far end of `high/desktop/R04`.
- **Credit:** the ring and arrow, the road edge lines, and the near pickups (`high/desktop/R10`).

### Mobile: critics 7 / 6.5, mean 6.75, proposed **6.5**
The 7 anchor asks for portrait and landscape "both framed on purpose".
- **Landscape HUD:** the plates cover about 25% of `high/landscape/R04`, and the left stack takes 55% of the height.
- **Portrait HUD:** the top HUD ends at about y 405 of 1688 (24%) in `high/mobile/R04`.
- **Countdown:** on both phone orientations READY lands on the play (`high/landscape/R03`, `high/mobile/R03`).
- **Landscape team select:** the division labels are dropped (`high/landscape/R02`).
- **Portrait results:** the baseline offset and the wrap in `high/mobile/R18`.
- **Credit:** the thumb controls never touch the tub (`high/mobile/R04`, `high/mobile/R17`, `high/landscape/R04`). The portrait team select now frames the whole tub (`high/mobile/R02`). The swiftshader phone floor is 52 fps.

### Authenticity: critics 7 / 7, mean 7.0, proposed **6.5**
- **The mountains are not the Ouachitas.** Every course has the same backdrop: pale stepped cards with triangle-tree crenellation (`high/desktop/R04`, `high/desktop/R06`, `high/desktop/R09`, `high/desktop/R17`, `high/desktop/R19`). Both critics wrote that the hills are generic and still gave 7.
- **The Arlington closes the vista only from a staged camera.** It does so only in the high flyover of `high/desktop/R06`.
  - In the Central Avenue race frames (`high/desktop/R03`, `high/desktop/R04`, `high/desktop/R14`, `high/desktop/R15`, `high/desktop/R16`) the street ends in hill cards.
  - Its towers appear only behind the grid (background of `crops/high/R03-kart_1`).
- **Bridge Street is unmarked.** `high/desktop/R13` uses the same red-brick kit and orange awnings as Central Avenue (`high/desktop/R03`, right side).
- **The Gulpha Creek ford is not wet.** In `high/desktop/R19` it is blue tile, and an AI tub rolls across it dry, with no splash and its wheels on top of the surface.
- **Credit:** the Arlington silhouette, the Fordyce tile bands, the Hale's arches, the JUDGE stand, the duck, the flag and the water gauge.

## IP check: clean
My own crops show no minifigure silhouette:
- **Heads:** rounded cubes, with a single stud on the cap at most (front-facing Trail Shredders pusher in `crops/high/R03-kart_1`).
- **Torsos:** straight-sided boxes with vertical sides (front-facing firefighter in `crops/high/R02-preview`).
- **Hands:** mitten fists with a thumb.

No cylinder head, trapezoid torso or C-hand appears. No LEGO name or logo appears on the studs at close-up range or in any UI screen (`high/desktop/R01`, `high/desktop/R02`, `high/desktop/R18`).

## Gaps the critics missed
1. **G-slide-kerb-contact** (animation, WS3, severity 3, effort M, +0.3)
   - Problem: in `strips/high/R14` frames 6–8 the slide puts the tub on the pavement against a lamp post with no reaction.
   - Fix: add road-edge and street-furniture colliders. On contact, apply a lateral bounce, a 3-frame camera shake and a 6–10 particle burst at the contact point.
   - Test: in the R14 strip the ring's centre never crosses the road-edge line, or a reaction is visible within 2 frames of contact.
2. **G-steam-soft-particles** (materials, WS3, severity 3, effort S, +0.3)
   - Problem: the steam is opaque lit spheres with dark rims where they overlap (`high/desktop/R17`, `high/desktop/R19`).
   - Fix: render steam as soft billboard puffs. Fade alpha radially to 0 at the edge, depth-fade them, scale them 1–2.5× over their life and fade alpha from 0.8 to 0.
   - Test: at 8× zoom no dark rim appears where puffs overlap, and the edge pixels are within 20 luminance of the background.
3. **G-bank-plates** (materials, WS4, severity 3, effort M, +0.3)
   - Problem: the creek bank and slopes are smooth lofted surfaces with stretched studs (`high/desktop/R19`, `high/desktop/R08`).
   - Fix: build banks as terraced one-plate steps or slope bricks. Where a smooth slope must stay, map the studs triplanar in world space and drop them on faces steeper than 20°.
   - Test: no stud on the R19 bank is more than 1.5× wider than tall.
4. **G-rock-parts** (materials, WS4, severity 2, effort M, +0.2)
   - Problem: Goat Rock is tapered prisms with brick courses and triangle shading splits (`high/desktop/R09`).
   - Fix: rebuild it from slope bricks and stacked plates with flat per-face normals, and keep brick courses on vertical faces only.
   - Test: no diagonal shading split on any face in R09.
5. **G-phone-countdown** (ui, WS6, severity 2, effort S, +0.3)
   - Problem: the countdown lands on the play on both phone orientations (`high/mobile/R03`, `high/landscape/R03`).
   - Fix: extend Critic A's landscape fix to portrait. Scale the countdown to 60% and place its bottom above 28% of the screen height, under the stacked HUD.
   - Test: no countdown pixel within 40 device px of the vanishing point in portrait R03.
6. **G-landscape-hud-area** (mobile, WS6, severity 2, effort M, +0.3)
   - Problem: the landscape HUD covers about 25% of the frame, and the left stack takes 55% of the height (`high/landscape/R04`).
   - Fix: on phone landscape, merge lap/time and water into one top-left plate, show the item legend on a long-press of Item, and cap the place and item plates at 120×64 CSS px.
   - Test: HUD at or under 15% of the frame area and the left stack at or under 35% of the height in landscape R04.
7. **G-ford-wet** (authenticity, WS3, severity 2, effort S, +0.2)
   - Problem: tubs cross the Gulpha ford dry (`high/desktop/R19`).
   - Fix: inside the ford volume, sink the wheels 0.15 m, emit spray at each wheel, draw ripple rings and slow the tub by 15%.
   - Test: in R19 a tub inside the water shows spray and ripples, with its hubs partly submerged.
8. **G-results-baseline** (typography, WS6, severity 1, effort S, +0.1)
   - Problem: the water column sits 4 device px low on every row of the portrait results (`high/mobile/R18`).
   - Fix: align the cells on the baseline, and give the check icon its own fixed-height inline box with `vertical-align: middle` so it cannot push the line box.
   - Test: the digit tops of the time and water columns match within 1 px on all rows.

```json
{
  "loop": 10,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "characters": { "score": 6.5, "confidence": 0.55, "evidence": [
      { "shot": "crops/high/R03-player", "note": "tub is one smooth shell with no studs or rim/body seam; the anchor's 'studs on tubs' and 'tubs built from recognisable brick parts' are missing (the chassis does carry studs)" },
      { "shot": "crops/high/R04-kart_3", "note": "same seamless shell on the Out-of-Towners tub; only stripe tile, feet, wheels and chassis are parts" },
      { "shot": "crops/high/R15-player", "note": "flash bleaches the whole kart: tub (91,32,27) to (243,185,180), tyres (25,28,30) to (176,178,178), torsos (26,30,31) to about (181,185,186); prints fade" },
      { "shot": "crops/high/R02-preview-captain", "note": "credit: printed faces, coat print, studded helmets hold up" }
    ] },
    "materials": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R19", "note": "creek bank is a smooth lofted surface with studs stretched into ovals and parallel seam lines; ford is opaque blue tile; steam is opaque marbles" },
      { "shot": "high/desktop/R09", "note": "Goat Rock: brick courses projected on tapered prisms, diagonal triangle shading splits on several faces" },
      { "shot": "high/desktop/R17", "note": "hot steam at 8x is hard-edged opaque spheres with dark rims at overlaps" },
      { "shot": "high/desktop/R06", "note": "flat textured facades with inset window quads" },
      { "shot": "crops/high/R02-preview-captain", "note": "credit: tub and helmet plastic reads as ABS" }
    ] },
    "scenery": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "high/desktop/R13", "note": "same red-brick three-storey kit as high/desktop/R03 and R07; Bridge Street indistinct" },
      { "shot": "high/desktop/R19", "note": "lofted bank and tile ford" },
      { "shot": "high/desktop/R06", "note": "stray tan railing cuts the bottom-right of the landmark shot" },
      { "shot": "high/desktop/R17", "note": "credit: radial brick plaza set piece" }
    ] },
    "lighting": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R07", "note": "no streetlight pools: flat cream globes (255,237,184), sky beside globes 91.3 vs 93.1 sixty px away, no halo, dark shop windows; strike Codex's 'pools' evidence" },
      { "shot": "high/desktop/R06", "note": "arcade wall luminance 180-182 down to y 702, drop only at the ground edge: no visible AO after the AO-distance change" },
      { "shot": "high/desktop/R10", "note": "credit: soft directional tree shadows" },
      { "shot": "high/desktop/R11", "note": "credit: deliberate sunset palette" }
    ] },
    "animation": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "strips/high/R14", "note": "frames 6-8: slide carries the tub onto the pavement; by frame 8 a lamp post stands on the ring edge against the pushers; no bump, particles or camera kick" },
      { "shot": "strips/high/R15", "note": "camera identical across all 8 frames; 2-frame bleach flash; spray is opaque marbles; no slosh visible" },
      { "shot": "strips/high/R16", "note": "credit: crew circle with swinging limbs; water sheet level in frames 2 and 6 at 4x zoom" }
    ] },
    "ui": { "score": 6.5, "confidence": 0.5, "evidence": [
      { "shot": "high/landscape/R03", "note": "READY covers about x 573-1113, y 213-367: the grid; the call-out fix only landed on desktop" },
      { "shot": "high/mobile/R03", "note": "READY about y 425-530 of 1688, on the vanishing point (about y 535)" },
      { "shot": "high/landscape/R04", "note": "HUD plates about 25% of frame, left stack y 22-447 (55% of height); item plate as large as place plate" },
      { "shot": "high/desktop/R04", "note": "empty grey item sphere in the top-centre slot (12 of 13 desktop race frames)" },
      { "shot": "high/desktop/R18", "note": "credit: consistent stud plates and brick buttons" }
    ] },
    "typography": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/mobile/R18", "note": "water digits 4 device px below time and points on every row (row 1: 725-741 vs 721-737); '(you)' wraps" },
      { "shot": "high/desktop/R18", "note": "desktop columns align, so the portrait offset is a layout fault" },
      { "shot": "high/landscape/R02", "note": "'Inspired / by:' split across lines; dense body copy" },
      { "shot": "high/desktop/R02", "note": "card labels about 10-11 px" }
    ] },
    "readability": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R15", "note": "fumble flash recolours the player's crew into pink and white (Flamingo Flock / Lather & Linen palettes)" },
      { "shot": "strips/high/R14", "note": "frame 8: tub off road, crew buried in spray marbles and drift arc" },
      { "shot": "high/landscape/R03", "note": "READY covers the grid" },
      { "shot": "high/desktop/R04", "note": "player tub a red sliver between crew backs; far pickups 8-10 px dots" },
      { "shot": "high/mobile/R04", "note": "credit: ring, arrow and road edges read" }
    ] },
    "mobile": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/landscape/R04", "note": "HUD about 25% of frame, left stack 55% of height" },
      { "shot": "high/mobile/R04", "note": "top HUD ends at y about 405 of 1688 (24%); controls clear the tub" },
      { "shot": "high/mobile/R03", "note": "countdown on the vanishing point" },
      { "shot": "high/landscape/R02", "note": "division labels dropped; Back orphaned" },
      { "shot": "high/mobile/R02", "note": "credit: whole tub framed above the panel" }
    ] },
    "authenticity": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R09", "note": "generic stepped card hills with triangle-tree crenellation, same backdrop on every course; not Ouachita ridgelines" },
      { "shot": "high/desktop/R04", "note": "Central Avenue race view ends in hill cards; the Arlington never closes the vista in race frames (R03, R04, R14-R16)" },
      { "shot": "high/desktop/R06", "note": "credit: Arlington twin towers, but only from a staged flyover" },
      { "shot": "high/desktop/R13", "note": "Bridge Street is the Central Avenue kit with nothing to mark it" },
      { "shot": "high/desktop/R19", "note": "Gulpha ford is blue tile crossed dry" }
    ] }
  },
  "ip": { "clean": true, "notes": "Own check: rounded-cube heads with at most one cap stud (crops/high/R03-kart_1), straight-sided box torsos (crops/high/R02-preview), mitten fists with a thumb. No cylinder head, trapezoid torso or C-hand. No LEGO name or logo on studs or UI (R01, R02, R18)." },
  "gaps": [
    { "id": "G-slide-kerb-contact", "category": "animation", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14"], "benchmark": "drive-3", "fix": "Add road-edge and street-furniture colliders; on contact apply a lateral bounce, a 3-frame camera shake and a 6-10 particle burst. Test: in the R14 strip the ring centre never crosses the road edge, or a reaction shows within 2 frames of contact." },
    { "id": "G-steam-soft-particles", "category": "materials", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS3", "evidence": ["high/desktop/R17", "high/desktop/R19", "strips/high/R14"], "benchmark": "drive-3", "fix": "Render steam as soft billboard puffs (radial alpha to 0 at the edge, depth fade, scale 1-2.5x and alpha 0.8 to 0 over life) instead of opaque lit spheres. Test: at 8x no dark rim at overlaps; edge pixels within 20 luminance of the background." },
    { "id": "G-bank-plates", "category": "materials", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R19", "high/desktop/R08"], "benchmark": "worlds-1", "fix": "Build creek banks and cut slopes as terraced one-plate steps or slope bricks; where a smooth slope stays, map studs triplanar in world space and drop them on faces steeper than 20 degrees. Test: no stud on the R19 bank more than 1.5x wider than tall." },
    { "id": "G-rock-parts", "category": "materials", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R09"], "benchmark": "drive-5", "fix": "Rebuild Goat Rock from slope bricks and stacked plates with flat per-face normals; keep brick courses on vertical faces only. Test: no diagonal shading split on any face in R09." },
    { "id": "G-phone-countdown", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R03", "high/landscape/R03"], "fix": "Extend the desktop call-out placement to phones: in portrait, scale the countdown to 60% and keep its bottom above 28% of the height, under the stacked HUD; in landscape, apply Critic A's G-landscape-countdown. Test: no countdown pixel within 40 device px of the vanishing point in portrait R03." },
    { "id": "G-landscape-hud-area", "category": "mobile", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/landscape/R04", "high/landscape/R03"], "benchmark": "drive-3", "fix": "On phone landscape merge lap/time and water into one top-left plate, show the item legend on a long-press of Item, and cap the place and item plates at 120x64 CSS px. Test: HUD at most 15% of frame area and left stack at most 35% of height in landscape R04." },
    { "id": "G-ford-wet", "category": "authenticity", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["high/desktop/R19"], "benchmark": "drive-1", "fix": "Inside the ford volume sink wheels 0.15 m, emit spray at each wheel, draw ripple rings and slow the tub 15%. Test: in R19 a tub in the water shows spray and ripples with its hubs partly submerged." },
    { "id": "G-results-baseline", "category": "typography", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R18"], "fix": "Align results cells on the baseline and give the check icon its own fixed-height inline box with vertical-align: middle so it cannot push the line box. Test: time and water digit tops match within 1 px on every portrait row." }
  ]
}
```
