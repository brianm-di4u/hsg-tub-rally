# Judge ruling: loop 1, tier high

**Verdict: continue. Judged total 58.0/100** (critics 58.5 and 62.5; prosecutor 54.0; advocate 63.0; loop 0 judged 48.0, for trend only). The tubs and crews now read as original plastic toys, and the ground is baseplate with tile roads. The world around them is still painted cards and flat walls. No feedback effect renders, and the phone layouts still have collisions. Authenticity meets its gate of 6; the other nine categories are below 7. The A/B rule and the measured gates are applied after this ruling.

All capture paths are relative to `screenshots/review-loop-1/`. I opened every capture cited below at full size. Pixel figures are my own measurements from the PNGs (luminance = Rec. 709 weights, 0–255).

## Disputes settled
- **R17/R13 "white blowout" (Critic A): fact error. The advocate is right.** With the HUD, the bubble pickup and the tub masked out, the `high/desktop/R17` plaza floor peaks at 171. Every pixel above 200 lies on the cream kerb line at y 340–420, and no floor pixel exceeds 235. On `high/desktop/R13` the asphalt (x 700–1280, y 330–800) has a p99 of 174. What R13 does show is faceting: luminance steps of 13–14 along triangle edges (row 560 jumps 149→135 and 127→114). I drop the specular-clamp half of A's gap and keep the faceting as a materials defect.
- **R09 hats (Critic A): fact error. The advocate is right.** At 2× on `high/desktop/R09`, the white-shirt team wears dark-brown cowboy hats with a creased crown and curled side brims. The Steam Rangers wear tan flat-brim hats with grey shirts. Shirt, hat colour and hat shape all differ. The recolour sub-fix is dropped.
- **Rivals "passing through" the player's crew, `strips/high/R16` frames 4–8: not shown. The advocate is right.** I zoomed frames 4, 5, 7 and 8. In frame 7 the white rival's feet sit clearly lower in the frame than the black crew's, and its head is larger, so it stands between the camera and the tub. That is occlusion, not interpenetration. The prosecutor's readability charge partly survives: in frames 5–7 that rival covers part of the player's tub, but the captain and the bowl stay visible.
- **Fordyce flat wall: confirmed. The prosecutor is right.** In `high/desktop/R05`, all 7,112 px of the patch at x 1005–1060, y 520–646 share one RGB value, (100, 115, 94). This is the plain ground-floor wall: no courses, no gradient. The advocate is also right that the upper storeys have modelled window surrounds and a marquee with a zigzag valance. The judge booth in `high/desktop/R16` is likewise a bare grey box under a blank blue board.
- **Subtitle ghost: confirmed. The prosecutor is right; Critic A's "clean outlined subtitle" is wrong.** In `high/mobile/R01`, a blurred dark copy sits under both subtitle lines and is plainly visible at 3×. `high/desktop/R01` shows the same ghost under line 1 (behind "Arkansas"), and "Arkansas" is orphaned.
- **Landscape timer clipping: confirmed.** In `high/landscape/R03`, `R04` and `R17` the translucent water-gauge panel overprints the lower half of the timer digits. The brief scores typography on desktop, so I charge this to mobile, which accepts the advocate's double-count point. Typography lands at 6.0 on the desktop ghost, orphan and label size alone.
- **Landscape minimap: split.** In `high/landscape/R03` its top loop sits between the rear pushers' feet, inside the tub-and-crew box (prosecutor). In `high/landscape/R04` there is a clear gap below the chassis (advocate).
- **Swiftshader p95 34.2 ms against "holds 30 fps": not a contradiction, but a marginal tail.** Only the Row scene on the software floor exceeds the 33.3 ms of a 30 fps frame at p95 (34.2; p50 15.4; p99 51.2). Mountain sits at 33.3, dusk at 33.2 and battle at 25.0. The realistic phone proxies (GPU with 4× CPU throttle) have a p95 of 7.9–16.1 ms, and the measured perf gate passed. The 30 fps clause is met. The "66 fps minimum" cited by A and the advocate is a scene average, not a frame minimum, and the Row's 51 ms p99 on the floor device is worth watching under WS7. No deduction.
- **Pushers' hands: confirmed. The prosecutor is right.** In `crops/high/R03-kart_1` the nearest pusher's mittens hang at x ≈ 180–240, while the bowl starts near x 480. In `crops/high/R03-player` the right-side crew's hands float beside the tub.
- **Captain rim: real, but confined to one view.** `crops/high/R02-preview-captain` shows splayed flat triangles and octagon studs floating off the lip. `crops/high/R03-player` and `crops/high/R15-player` show a continuous rim with seated studs (advocate).
- **Tree shadows: confirmed. The prosecutor is right.** The large tree in `high/desktop/R12` and the sidewalk tree in `high/desktop/R04` cast nothing, while every tub casts a filtered shadow.
- **Player marker: the advocate is right.** It isn't an anchor requirement, and `drive-3` has none. The chase framing makes the player's tub the largest centred object (`high/desktop/R04`, `high/mobile/R04`). Only the dusk separation problem stands.

## Category rulings
- **Characters: 6.0.** The figures read at once as original brick toys: bevelled parts, four printed expressions, front-printed uniforms, studded hats, rims and chassis, and a two-piece duck (`crops/high/R03-kart_5`, `crops/high/R03-player`). Teams are distinct at chase distance (`high/desktop/R09`, `R12`). Three 7-anchor clauses fail. Close-ups don't hold up: the captain rim, mitten hands that touch nothing (`crops/high/R03-kart_1`), and two crew figures fused together in `crops/high/R15-player`. The uniforms are printed only on the front, while every race frame shows the blank backs (`crops/high/R03-player-rear`). The critics differ by 0.5. The advocate's hat correction and the prosecutor's hand finding cancel out.
- **Materials: 5.5.** Bevel highlights read as ABS plastic on figures and tubs (`crops/high/R02-preview-rear`). Studs read as raised on shaded faces (`high/desktop/R08` lower left, `R12` right verge), and road plate and sidewalk tile seams show (`R04`). Against that, the landmark ground floor is a single flat colour (`R05`), the judge booth is bare (`R16`), the asphalt is faceted (`R13`), and the painted sprites are "textures from a different style than the models" (`R11`, `R07` crowd). The water is pale and only semi-clear (`crops/high/R02-preview-captain`). Of the prosecutor's 5.0 and the advocate's 6.0, the measurements cut against each: the flat wall is real, and so is the absence of blowout.
- **Scenery: 5.0.** Baseplate ground and tile roads are two 7-anchor items (`high/desktop/R08`, `R12`). The rest sits at the 5 anchor or below. Trees and crowds are blurred painted cards, the crowds are cartoon humans beside brick figures (`R08`, `R11`, `R14`), and buildings are boxes with painted fronts (`R13`, `R17`). The mountain courses are interchangeable (`R08`, `R09`, `R10`, with R10 repeating one pine card down both verges). There is an unblended band and fan-shaped arcs beside the Arlington (`R06`). Codex's 5.0 stands; A's 5.5 didn't weigh the crowd clash or the sameness of the mountain courses.
- **Lighting: 6.0.** A soft filtered key light grounds every tub (`high/desktop/R03`, `R13`). Dusk has glowing globes and warm pools (`R07`), and sunset has a deliberate pink palette (`R11`). There is no AO anywhere (`R05`, `R13`), trees cast no shadow (`R12`, `R04`), the dark crew merges with the road at dusk (`R07`), and the R06 horizon band doesn't match the haze. Three of five 7-anchor clauses are met. The advocate's 6.5 rested partly on rebutting the glare charge (correct) but ignored the tree shadows; the prosecutor's 5.5 counts the haze and AO twice.
- **Animation: 5.5.** The crew push-run and circle the tub with correct rigid-joint swing (`strips/high/R15`, `strips/high/R16`). Feedback is absent. No spray or steam appears in any frame of `strips/high/R14` (I checked all 8 at 3×), and "HOT STEAM!" in `high/desktop/R17` produces one ~30 px puff. In R14 the tub rolls onto the sidewalk with no curb response while a pusher tilts far past upright, and own-crew figures fuse in R15 frames 1, 2, 6 and 7. The R16 pass-through charge is withdrawn, so the prosecutor's 5.0 loses its fourth leg.
- **UI: 6.0.** On desktop the hierarchy is clear and the menus are consistent (`high/desktop/R04`, `R18`, `R02`). But the defining 7 clause, "one style that belongs to the brick world", fails: these are navy web panels with orange pills. Item labels are about 9–10 px, the gauge's "10" tick hits the panel edge, the selected card's subtext has low contrast, and Grand Prix carries the same weight as Credits (`R01`).
- **Typography: 6.0.** There is a clear pixel-display and rounded-sans scale, and the open-zero numerals read at a glance (`high/desktop/R04`, `R18`). On desktop alone, the ghosted and orphaned subtitle (`high/desktop/R01`) and the ~9–10 px labels fail "nothing clipped" and "a clear scale" in spirit. The prosecutor and the advocate differ by 1.5. Having checked `high/mobile/R01` and `high/desktop/R01`, I find the prosecutor closer: the ghost is on every viewport. Codex's and the advocate's 7.0 rest on a clean subtitle that isn't there.
- **Readability: 6.0.** Road edges and lane lines are obvious, the bubble pickups read (`high/desktop/R10`, `R17`), and the player's tub is the centred, largest object (`high/mobile/R04`). It fails "every frame": the dusk crew merges with the road (`high/desktop/R07`, `high/mobile/R07`), a foreground card covers ~40% of `R11`, the judge stop reads as a grey box and a blank board (`R16`), and a rival covers part of the player's tub in `strips/high/R16` frames 5–7.
- **Mobile: 6.0.** Portrait race frames are framed on purpose, and the controls never cover the tub (`high/mobile/R04`, `R17`). The landscape title and results fit, and the 30 fps clause is met (see above). The landscape timer is clipped in every race frame (`high/landscape/R03`, `R04`, `R17`), and the minimap intrudes into the crew box in `high/landscape/R03`. Team select hides the tub in both orientations (`high/mobile/R02`, `high/landscape/R02`). The drawn Steer pill is about 72×24 CSS px.
- **Authenticity: 6.0 (gate met).** The Arlington's twin towers (`high/desktop/R06`), the Fordyce's colours and marquee (`R05`) and a domed bathhouse on the Row (`R14`) are recognisable. The real race shows in the duck, flag, water line, items, squirt-gun crowds and the Rules of the Row task (`R16`). Against that, there are no judges, the Central Avenue vista ends in low blocks rather than the Arlington (`R04`), the Gulpha ford and Goat Rock are absent (`R09`), Bridge Street is generic (`R13`), and the bathhouses are painted rather than brick-built. Codex's 7.0 ignores the missing judges, which the anchor names.

## IP
**Clean.** The heads are rounded cubes, the hands are mitten blocks and the torsos are straight boxes (`crops/high/R03-player-rear`, `crops/high/R03-player`). Stud tops are blank, and no frame, menu or results screen shows a LEGO name or logo. No reviewer reported a hit.

## Ranked gaps (gain ÷ effort; S = 1, M = 2, L = 4)
1. **G-slide-effects-missing** (animation, WS3, S, sev 4, +0.75): slide spray and stage steam never render (R14 strips in both tiers, R17).
2. **G-phone-hud-layout** (mobile, WS6, S, sev 3, +0.5): the gauge overprints the timer, the minimap sits in the crew box, and the Steer pill is too small.
3. **G-subtitle-and-labels** (typography, WS6, S, sev 3, +0.5): the subtitle ghost and orphan, and the ~9–10 px inventory labels.
4. **G-tree-shadows** (lighting, WS5, S, sev 3, +0.5): trees cast nothing.
5. **G-flat-faceted-surfaces** (materials, WS1, S, sev 3, +0.5): the single-colour landmark wall, the bare booth, and faceted asphalt and lawn.
6. **G-figure-back-prints** (characters, WS2, S, sev 3, +0.5): blank torso backs, the view in every race frame.
7. **G-ao-dusk-separation** (lighting, WS1, M, sev 3, +0.5; readability +0.25): no AO, and the dark crew merges with the road at dusk.
8. **G-judge-stop** (readability, WS4, M, sev 3, +0.5; authenticity +0.5): no judges, a grey box and a blank board.
9. **G-sprite-foliage-crowds** (scenery, WS5, **L, the loop's big lever**, sev 4, +1.0; materials +0.5): painted tree cards and cartoon crowds. Scenery can't get past about 5.5 while they stay, and they cap materials at the 5-anchor clause. This is the single change that most moves the gated categories.
10. **G-team-select-phone** (mobile, WS6, M, sev 3, +0.5): the tub is invisible on phone team select.
11. **G-tub-closeup-integrity** (characters, WS2, M, sev 3, +0.5): the splayed rim with floating studs, and hands that touch nothing.
12. **G-hud-brick-theme** (ui, WS6, M, sev 2, +0.5): the generic web styling, which is UI's only blocking 7 clause.

Fixes and tests are in the JSON below.
- **Below the cut:**
  - Own-crew fusion while circling (WS3, M, +0.25).
  - Chase-camera occlusion by rivals (WS3, S, +0.25).
  - Curb and barrier response on slides, plus a ±30° crew tilt clamp (WS3, M, +0.25).
  - Mountain-course identity: dirt and ford tiles, Goat Rock, smooth drivable tiles instead of studded plate (WS4, M; authenticity already meets its gate).
  - Commercial-block facade depth (WS4, L).
- **Rejected:** the player marker (no benchmark basis), the specular clamp (no blowout measured), and the campaign-hat recolour (the teams are already distinct).

```json
{
  "role": "judge",
  "loop": 1,
  "tier": "high",
  "verdict": "continue",
  "scores": {
    "characters": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "crops/high/R03-kart_5", "note": "Bevelled parts, printed expressive faces, front-printed uniforms, studded hats, rim and chassis, two-piece duck: figures read as brick toys"},
        {"shot": "crops/high/R02-preview-captain", "note": "Close-up fails: rim splays into flat triangles, octagon studs float off the lip (confined to this overhead view; rim intact in crops/high/R03-player and R15-player)"},
        {"shot": "crops/high/R03-kart_1", "note": "Nearest pusher's mittens hang ~250 px from the bowl; nothing at hand height to push"},
        {"shot": "crops/high/R03-player-rear", "note": "Blank torso backs, the view in every race frame; part joints visible but no prints or mould lines"},
        {"shot": "high/desktop/R09", "note": "At 2x: cowboy hats (dark brown, creased crown) vs tan flat-brim campaign hats with different shirts; teams distinct, Critic A's claim wrong"}
      ]
    },
    "materials": {
      "score": 5.5,
      "confidence": 0.7,
      "evidence": [
        {"shot": "crops/high/R02-preview-rear", "note": "Highlights follow head and shoulder bevels: convincing ABS on figures"},
        {"shot": "high/desktop/R12", "note": "Studs on the verge read as raised with shaded sides; tile seams on the road"},
        {"shot": "high/desktop/R05", "note": "Fordyce ground-floor patch x1005-1060, y520-646: 7,112 px of one RGB (100,115,94); no courses or gradient"},
        {"shot": "high/desktop/R17", "note": "No blowout: masked floor peaks at luminance 171; Critic A's white-hotspot claim is a fact error"},
        {"shot": "high/desktop/R13", "note": "Asphalt p99 174 (no glare) but hard 13-14 luminance steps along triangle edges (faceting)"},
        {"shot": "high/desktop/R11", "note": "Painted, stair-stepped tree card: textures from a different style than the models"}
      ]
    },
    "scenery": {
      "score": 5.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/desktop/R08", "note": "Baseplate slope and tile road (7-anchor items) under magnified, blurred tree cards"},
        {"shot": "high/desktop/R14", "note": "Painted cartoon-human crowds beside brick figures: world and characters clash"},
        {"shot": "high/desktop/R10", "note": "One pine card repeated down both verges; interchangeable with R08 and R09"},
        {"shot": "high/desktop/R06", "note": "Arlington recognisable, but bare lawn with fan-shaped arcs and an unblended band below the ridge"},
        {"shot": "high/desktop/R17", "note": "Empty terracotta disk ringed by thin facade boxes"}
      ]
    },
    "lighting": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/desktop/R07", "note": "Deliberate dusk: glowing globes and warm pools; dark crew merges with the road"},
        {"shot": "high/desktop/R11", "note": "Distinct pink sunset palette"},
        {"shot": "high/desktop/R13", "note": "Soft filtered sun shadows ground every tub; no AO at building bases"},
        {"shot": "high/desktop/R12", "note": "The large tree casts no shadow on the lawn while the tubs cast strong ones"}
      ]
    },
    "animation": {
      "score": 5.5,
      "confidence": 0.7,
      "evidence": [
        {"shot": "strips/high/R14", "note": "All 8 frames at 3x: no spray, steam or charge colour; tub rolls onto the sidewalk with no curb response; one pusher tilts far past upright"},
        {"shot": "strips/high/R15", "note": "Crew circle the tub with correct rigid-joint swing; own-crew figures fuse in frames 1, 2, 6 and 7; no splash"},
        {"shot": "strips/high/R16", "note": "Crew circle while the bar fills; frames 4-8 show a nearer rival occluding, not passing through"},
        {"shot": "high/desktop/R17", "note": "HOT STEAM! callout with a single ~30 px puff"}
      ]
    },
    "ui": {
      "score": 6.0,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R04", "note": "Clear hierarchy, nothing overlapping on desktop; inventory labels ~9-10 px; gauge '10' tick touches the panel edge"},
        {"shot": "high/desktop/R18", "note": "Clean results with player row highlighted and race HUD hidden; generic navy and orange web styling"},
        {"shot": "high/desktop/R01", "note": "Eight equal orange buttons: Grand Prix weighted like Credits"}
      ]
    },
    "typography": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/desktop/R01", "note": "Subtitle ghost under line 1 and orphaned 'Arkansas' on desktop"},
        {"shot": "high/mobile/R01", "note": "Blurred dark offset copy under both subtitle lines: the ghost is still present"},
        {"shot": "high/desktop/R04", "note": "Open-zero timer reads at a glance; inventory labels ~9-10 px"},
        {"shot": "high/desktop/R18", "note": "Clear display and UI scale in the results table"}
      ]
    },
    "readability": {
      "score": 6.0,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/mobile/R04", "note": "Player tub centred and largest; road edges and pickups clear"},
        {"shot": "high/desktop/R07", "note": "Dark crew on a dark road at dusk"},
        {"shot": "high/desktop/R16", "note": "Judge stop reads as a grey box and a blank board; no judge"},
        {"shot": "strips/high/R16", "note": "Frames 5-7: a nearer rival covers part of the player's tub"},
        {"shot": "high/desktop/R11", "note": "Foreground tree card covers ~40% of the view"}
      ]
    },
    "mobile": {
      "score": 6.0,
      "confidence": 0.7,
      "evidence": [
        {"shot": "high/mobile/R04", "note": "Portrait framed on purpose; controls clear of the tub; Steer pill ~72x24 CSS px"},
        {"shot": "high/landscape/R04", "note": "Gauge panel overprints the lower half of the timer digits"},
        {"shot": "high/landscape/R03", "note": "Minimap's top loop sits between the rear pushers' feet; timer clipped"},
        {"shot": "high/mobile/R02", "note": "Team-select panel covers the screen; tub invisible"},
        {"shot": "high/landscape/R02", "note": "Panel covers most of the screen; only a wheel, one crew figure and the captain's head show"}
      ]
    },
    "authenticity": {
      "score": 6.0,
      "confidence": 0.65,
      "evidence": [
        {"shot": "high/desktop/R06", "note": "Arlington twin towers recognisable; window grid noisy"},
        {"shot": "high/desktop/R05", "note": "Fordyce colours, upper-storey surrounds and marquee recognisable; ground floor flat, not brick-built"},
        {"shot": "high/desktop/R04", "note": "Duck, flag, water line and items on every tub; vista ends in low blocks, not the Arlington"},
        {"shot": "strips/high/R16", "note": "Rules of the Row task acted out; no judges"},
        {"shot": "high/desktop/R09", "note": "No ford water or Goat Rock; grey studded plate like every road"}
      ]
    }
  },
  "ip": {"clean": true, "notes": "Rounded-cube heads, mitten block hands, straight box torsos (crops/high/R03-player-rear, crops/high/R03-player); blank stud tops; no LEGO name or logo in any frame, menu or results screen. No reviewer reported a hit."},
  "gaps": [
    {"id": "G-slide-effects-missing", "category": "animation", "expectedGain": 0.75, "severity": 4, "effort": "S", "workstream": "WS3", "evidence": ["strips/high/R14", "strips/low/R14", "high/desktop/R17"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Find why slide spray and stage steam never render (none in any of the 8 frames of either R14 strip; R17's HOT STEAM! shows one ~30 px puff): check that the emitters attach to the player tub's slide state on the capture path, aren't frustum- or size-culled, and aren't starved by the new per-tick emission. Then emit white spray puffs >= 20 px at 1280 behind each rear wheel while charging, steam that grows and changes tint with each charge stage, a release burst, and a +3 degree FOV kick decaying over 200 ms. Test: frames 3-8 of strips/high/R14 each show >= 6 particles >= 20 px near the rear wheels; R17 shows steam covering >= 60 px around the tub when the callout fires."},
    {"id": "G-phone-hud-layout", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/landscape/R03", "high/landscape/R04", "high/landscape/R17", "high/mobile/R04"], "fix": "In the short-screen layout, place the water-gauge panel >= 8 px below the timer's baseline; move the landscape minimap from bottom-centre to the right edge above the action buttons; draw the Steer control >= 48 CSS px tall. Test: in high/landscape R03/R04/R07/R08/R17 no two HUD boxes intersect and no HUD box intersects the player tub+crew screen box; Steer >= 48 CSS px tall in both phone orientations."},
    {"id": "G-subtitle-and-labels", "category": "typography", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R01", "high/desktop/R01", "high/desktop/R04"], "fix": "Remove the leftover offset text-shadow under the title subtitle (keep only the outline via paint-order: stroke fill), add text-wrap: balance, and raise the Towel/Bath/Soap/Loofah labels to >= 12 px at 1280. Test: the 16 device px below each subtitle line in high/mobile/R01 stay within 5 luminance of the background; the desktop subtitle breaks into two lines of similar length; label cap height >= 8 px in high/desktop/R04."},
    {"id": "G-tree-shadows", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R12", "high/desktop/R04"], "benchmark": "worlds/worlds-1.jpg", "fix": "Make tree cards shadow casters with an alpha-tested depth material (customDepthMaterial, alphaTest 0.5) on Medium/High, and a soft canopy-shaped shadow decal under each tree on Low. Test: in high/desktop/R12 the lawn on the shadow side of the large right-hand tree is >= 20% darker than open lawn."},
    {"id": "G-flat-faceted-surfaces", "category": "materials", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["high/desktop/R05", "high/desktop/R16", "high/desktop/R13", "high/desktop/R06"], "benchmark": "worlds/worlds-1.jpg", "fix": "Apply the running-bond course pattern plus a bottom-to-top ambient gradient to every untextured wall (the Fordyce ground floor is one RGB value, the R16 booth is bare grey), and recompute smooth vertex normals on road and terrain meshes to remove the hard-edged wedges on the R13 asphalt and the fan arcs on the R05/R06 lawns. Test: every 50x50 px wall patch in R05, R13 and R16 has >= 20 distinct colours; no luminance step > 8 across a triangle edge on the R13 asphalt."},
    {"id": "G-figure-back-prints", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["crops/high/R03-player-rear", "crops/high/R02-preview-rear", "high/desktop/R04"], "benchmark": "2k-drive/drive-4.jpg", "fix": "Print the torso backs (crossed suspender straps and a team number or emblem in the team accent colour) using the same code-drawn print path as the fronts. Test: each torso back in crops/high/R03-player-rear shows >= 2 printed elements, and the player crew's backs in high/desktop/R04 show the team accent colour."},
    {"id": "G-ao-dusk-separation", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["high/desktop/R05", "high/desktop/R13", "high/desktop/R07", "high/mobile/R07"], "benchmark": "worlds/worlds-4.jpg", "fix": "Add ambient occlusion on Medium/High (an SSAO/GTAO pass, or baked vertex AO at building bases, figure joints and the tub-chassis join) and a rim/fill term on figures for dusk and sunset palettes. No specular clamp is needed: the R17 floor peaks at 171/255. Test: building bases in R05 and R13 are >= 15% darker within 0.5 m of the ground than mid-wall; in high/desktop/R07 the player crew's mean luminance is >= 1.3x the road directly behind it."},
    {"id": "G-judge-stop", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["high/desktop/R16", "strips/high/R16"], "fix": "Replace the bare grey booth and blank blue board with a brick-built judges' stand (bricks, tiles, a printed sign with the task icon) and place 1-2 original brick judges (crew parts, striped-shirt print, clipboard) who turn to the tub and give a check gesture when the bar fills; also lifts authenticity (judges). Test: high/desktop/R16 and every strips/high/R16 frame show at least one judge figure and a printed sign; the booth passes the 20-colour wall test."},
    {"id": "G-sprite-foliage-crowds", "category": "scenery", "expectedGain": 1.0, "severity": 4, "effort": "L", "workstream": "WS5", "evidence": ["high/desktop/R08", "high/desktop/R11", "high/desktop/R10", "high/desktop/R14", "high/desktop/R07"], "benchmark": "worlds/worlds-1.jpg", "fix": "Big lever. Replace the painted tree cards with 3-4 instanced brick-built trees (round-brick trunks, stacked plate and slope canopies, 2 LODs) and the painted cartoon crowds with instanced brick spectators reusing the crew parts (2 LODs, wave and squirt-gun poses); also lifts materials. Interim on Low: never draw a sprite within 15 m of the camera. Test: no sprite texel magnified above 1:1 in R08, R10 or R11, and no painted human in R03, R04, R07, R13, R14, R16 or R17."},
    {"id": "G-team-select-phone", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["high/mobile/R02", "high/landscape/R02"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Portrait: show the turning tub in the top 35% of the screen above a scrolling 3x4 team grid with the confirm button pinned. Landscape: split grid and preview 55/45. Test: the whole tub, captain and crew are visible together with the confirm button in both captures."},
    {"id": "G-tub-closeup-integrity", "category": "characters", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R02-preview-captain", "crops/high/R03-kart_1", "crops/high/R03-player"], "benchmark": "2k-drive/drive-4.jpg", "fix": "Rebuild the rim as one closed bevelled lathe ring with studs seated on its top normal, and add a push bar at hand height on both sides and the back of each tub, with pusher hands posed or IK'd onto it. Test: crops/high/R02-preview-captain shows a continuous lip with every stud touching it; in every R02-R04 crop each pusher's hand box intersects the bar or rim."},
    {"id": "G-hud-brick-theme", "category": "ui", "expectedGain": 0.5, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["high/desktop/R04", "high/desktop/R18", "high/desktop/R01"], "benchmark": "2k-drive/drive-2.jpg", "fix": "Restyle HUD panels and menus as bevelled plastic tiles (light top-edge highlight, dark bottom bevel, a stud row on headers) and buttons as 1x4 bricks; make Grand Prix visibly primary over the other seven menu buttons; keep the open-zero numerals. Test: R01, R02, R04 and R18 share the tile style, and Grand Prix is larger or differently coloured than Credits."}
  ]
}
```
