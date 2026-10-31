# Prosecutor brief: loop 9, high tier

## Summary
Both critics landed on 68/100. The captures support **63.5**. The critics missed one regression that this loop introduced, and they let three anchor clauses pass that the frames show failing.

- **The regression (missed by both critics).** This loop's "keep ground-floor shop windows" change put flat grey panes on the Row landmark at the judge stop. The panes float over the painted arches and do not line up with them (`high/desktop/R16`; A has no panes, B does, in `ab/high-desktop-R16`). Both critics gave scenery and authenticity to B in the A/B on the strength of the restored Fordyce windows, and neither opened this frame closely.
- **The power-slide strip ends badly.** The tub leaves the asphalt, mounts the pavement, and has a lamp post standing inside its ring. Nothing reacts (`strips/high/R14` frames 7–8, the same in both builds).
- **Tree canopies pass through each other** in two frames (`R08`, `R10`).
- **The far mountain rings read as snow.** They render as grey-white cliffs, not the forested Ouachitas. Critic B still scored authenticity above the 7 anchor.
- **The close-ups do not hold up.** Held props pass through the fists, and the tubs are smooth shells with no studs and no brick parts. Those are two explicit anchor-7 clauses for characters.

I accept UI and mobile at the critics' mean.

## Category by category

**Characters: critics 7 / 7, mean 7.0. Proposed: 6.5.**
Anchor 7 requires "studs on hats and tubs, tubs built from recognisable brick parts" and "close-ups hold up". Both clauses fail in the close-ups.
- `crops/high/R02-preview-captain`: the right pusher's pink soap bar is buried in his fist. The brown fist shows through the bar's lower half.
- `crops/high/R02-preview-rear`: the left pusher holds a plain white bevelled slab (the towel) that his fist punches through. The firefighter helmets are smooth, with a ridge and no studs, and the head backs are blank.
- `crops/high/R04-kart_3`: the push hands hover in front of the rim instead of gripping it.
- Every tub (`crops/high/R02-preview`, `crops/high/R03-kart_1`, `crops/high/R03-kart_5`, `crops/high/R04-kart_3`) is one smooth bathtub moulding with a decal stripe and no studs. Only the chassis plate is brick-built.
- Team identity at chase distance is weaker than the critics allow. The tie-dye antenna crew's tub body is purple (Critic A measured (86,50,120)), while that team's swatch is teal (47,179,166) with yellow (245,213,71) trim (`high/desktop/R02`, measured on the Out-of-Towners card). The tub is identical in A and B (`ab/crop-R04-kart_3`), so the change note's teal tub is not in the captures.
- The loofah item beside the tub in `high/desktop/R17` is a faceted, low-poly polyhedron, not a brick part.

The faces and printed uniforms are good. That alone is not a 7.

**Materials: critics 6.5 / 6.5, mean 6.5. Proposed: 6.0.**
- `high/desktop/R16`: the Row building's painted ground-floor arches are blurred, with soft orange halos. Flat grey upright panes sit over them, misregistered: the pane at about x 187–230, y 309–382 covers the right half of the painted arch at x 156–215 and runs onto bare brick.
- `high/desktop/R06`: the Arlington wings are a brick texture on box walls, with uniform window decals and flat red roof planes. No bevel or edge highlight appears anywhere on the building.
- `strips/high/R14`: the steam particles are opaque, shaded grey spheres with dark undersides. They read as ball bearings, not vapour.
- `high/desktop/R17`: the hot steam is a clump of tan translucent discs, mean (169,143,118). The loofah is a faceted polyhedron, a modelling style the brick world does not use elsewhere.
- `high/desktop/R10`: the tree plates have no studs.

Against `worlds-1` (7, every surface a part), the plastic read stops at the figures, the tubs and the baseplate.

**Scenery: critics 6.5 / 6, mean 6.25. Proposed: 6.0.**
- `high/desktop/R08`: a tan plank canopy and a conifer's green tiers occupy the same space at the top left (about x 130–430, y 0–250).
- `high/desktop/R10`: on the right, dark conifer plates pierce a light-green deciduous canopy (about x 950–1100, y 150–330).
- `high/desktop/R16`: the Row landmark regression described under materials.
- `high/desktop/R09`: about two dozen copies of one tiered conifer surround the outcrop, and the far ring behind them is grey-white stepped cliffs.
- `high/desktop/R17`: the Water Fight is a bare brick disc with a low wall and one building on each side.

Critic B's 6 is the better-supported of the two critic scores. The interpenetration and the regression justify the half point below the mean.

**Lighting: critics 6.5 / 6.5, mean 6.5. Proposed: 6.0.**
Two anchor-7 clauses fail: "ambient occlusion in crevices and under figures" and "haze matched to the sky".
- `crops/high/R03-kart_1`: there is no occlusion under the chassis or the tub.
- `high/desktop/R06`: no darkening where the Arlington's arcade meets its terrace.
- `high/desktop/R07`: Critic B claims "useful pools of lamplight". The capture contradicts this. Across the road at y=650, brightness rises monotonically from (61,43,44) at x=200 to (112,81,68) at x=1050, with no local peak anywhere near a lamp. The globes are lit, but nothing beneath them is.
- `high/desktop/R09`, `high/desktop/R17`: the far-ring faces measure (171,190,198) at R09 box (1000,30)-(1060,60) and (164,183,194) at R17 box (215,125)-(260,150), against sky (192,219,236). The haze goes to an unsaturated grey (saturation about 0.14 against the sky's 0.19), not to the sky's hue.
- `crops/high/R03-kart_5`: under each shoe the contact shadow is a hard black slab offset to one side.

I concede the soft tree shadows (`R08`, `R19`) and the deliberate dusk and sunset palettes (`R07`, `R11`). That earns more than 5 but less than 6.5.

**Animation and feel: critics 6.5 / 6.5, mean 6.5. Proposed: 6.0.**
- `strips/high/R14` frames 7–8: the slide carries the tub over the white edge line and up the kerb. In frame 8 the tub is on the pavement against the crowd fence, with a lamp post rising from inside the gold ring between the rear crew. There is no bump, no stop, no flash and no call-out, and the camera has swung to face the storefronts. `ab/strip-R14` shows the same ending in both builds.
- The R14 "steam" is the hard grey spheres described under materials. They scatter up to a tub-length away and show no visible softening.
- `strips/high/R15`: after the frame-1 flash, frames 5 and 7, and frames 6 and 8, show nearly the same crew layout. In the crew region the mean absolute difference is 19.0 and 18.9 for those pairs, against 26–34 for the other frames. So at this cadence the circle reads as two alternating poses, not progress around the tub.
- In `strips/high/R15` frames 3–8 the tub water stays level. The only water motion is detached blue beads, so the "water visibly sloshes" clause fails.
- `strips/high/R16`: the two judges stand behind the booth in the same pose in all eight frames.
- `high/desktop/R17`: the "hot steam" is a tan lump behind the tub.

In fairness to the game, Critic A says no camera kick appears in any strip. R15 frames 1 to 2 do show a camera displacement, as Critic B noted. That doesn't rescue the slide or the effects.

**UI / HUD: critics 7 / 7, mean 7.0. Accepted: 7.0.**
The hierarchy and the single studded-tile style hold (`high/desktop/R04`, `high/desktop/R18`). There are weaknesses, not enough to go below 7:
- The empty item orb is as large as the place tile in 17 of the 18 race frames.
- `high/desktop/R18` shows a CLEAN pill on all 8 rows, which tells the player nothing, and the desktop keeps pills while the phone uses check marks.

**Typography: critics 7 / 7, mean 7.0. Proposed: 6.5.**
- `high/mobile/R18`: in every row the water digits sit 4 device px (2 CSS px) below the time digits. Digit tops are at y 725/777/829 against 721/773/825.
- On the same screen, the player's wrapped "(you)" starts at x 126, 25 px left of the name column at x 151, under the swatch.
- `high/mobile/R02`: the selected card's division label is 2.4:1 (Critic A's measurement, which I reproduced), and the locked labels are 2.8:1.
- `high/landscape/R01`: the disclaimer leaves "business shown." alone on its own line.

None of these is clipping. But the screen whose job is numbers has a broken baseline, and the selected-state label fails basic contrast. Both critics noted the contrast and still gave 7; I give 6.5.

**Readability: critics 6.5 / 7, mean 6.75. Proposed: 6.0.**
Anchor 7 says "every tub ... reads in every frame on both viewports; the road edge and racing line are obvious".
- `high/desktop/R07` and `high/mobile/R07`: the player's purple Velvet Mob tub runs directly behind the tie-dye crew's purple tub. The same purple tub is beside the player in `high/desktop/R11`, and the tub is unchanged in both builds (`ab/crop-R04-kart_3`).
- `strips/high/R14` frame 8: the road ahead is out of frame.
- `high/desktop/R16`: the call-out panel (x 468–812, y 177–302) covers the end of the street.
- `high/desktop/R19`: "WARM STEAM" covers the trail beyond the ford, which Critic B already found hard to follow.
- `high/desktop/R15`: the "Dropped the mat!" banner lies across the pack ahead.
- `high/desktop/R04`, `high/desktop/R12`: tubs in the pack disappear behind their crews.

The gold player marker is a real win. Critic B's 7, however, rests on one phone frame.

**Mobile: critics 7 / 7, mean 7.0. Accepted: 7.0.**
The thumb controls never cover the tub (`high/mobile/R04`, `high/landscape/R04`, `high/landscape/R08`), and the software-GL floor holds 51 fps. Problems that stay short of the anchor:
- The portrait team-select panel's top edge (about y 510) cuts off the preview kart's wheels and chassis (`high/mobile/R02`).
- The landscape HUD column takes 57% of the height (`high/landscape/R04`).
- "READY" spans x 575–1110, y 215–360 over the karts ahead of the player (`high/landscape/R03`).

**Authenticity: critics 7 / 7.5, mean 7.25. Proposed: 6.5.**
Anchor 7 has four clauses, and one fails outright: "the mountains read as the Ouachitas".
- The far rings are pale, grey-blue stepped cliffs with grey tree cut-outs (`high/desktop/R09`, `high/desktop/R17`, `high/desktop/R04`; values under lighting). They read as snow-capped rock, not low, forested ridges.
- `high/desktop/R13`: Bridge Street is generic brick downtown (Critic A agrees).
- The one Row frame shot at street level during a race, `high/desktop/R16`, now has misregistered panes on its bathhouse.
- The Fordyce (`high/desktop/R05`), the Arlington (`high/desktop/R06`) and the race ritual (`strips/high/R16`, duck, water line, flags) are real strengths.

Critic B's 7.5 sits above an anchor whose mountain clause the captures fail.

## IP check
**Clean.** I checked the close-ups myself:
- The heads are bevelled cubes (`crops/high/R02-preview-rear`), not cylinders.
- The hands are rounded mitten fists, not C-clips (`crops/high/R02-preview-captain`, `crops/high/R04-kart_3`).
- The torsos are straight-sided boxes, and the arms are straight box limbs.
- The chassis and baseplate studs are plain discs with no lettering (`crops/high/R04-kart_3`, `high/desktop/R09`).
- No LEGO name or logo appears in any frame, menu or results screen.

## Gaps the critics missed
1. **G-row-panes-misregistered** (scenery, WS4, severity 3, effort S, gain +0.25). Ground-floor panes float over the painted arches on the R16 Row landmark. This is new this loop (`ab/high-desktop-R16`).
2. **G-slide-kerb-lamppost** (animation, WS3, severity 3, effort M, gain +0.5). The R14 slide mounts the pavement into a lamp post with no response, and the camera loses the road.
3. **G-tree-interpenetration** (scenery, WS5, severity 2, effort S, gain +0.25). Tree canopies pass through each other (`R08`, `R10`).
4. **G-prop-grip-clipping** (characters, WS2, severity 2, effort M, gain +0.25). Soap and towel props pass through the fists, and push hands miss the rim.
5. **G-far-ring-icy-hue** (authenticity, WS4, severity 3, effort S, gain +0.5). The far rings haze to grey-white and read as snow, not forest.
6. **G-callout-over-horizon** (readability, WS6, severity 2, effort S, gain +0.25). Call-outs sit on the road's vanishing point.
7. **G-faceted-item-props** (materials, WS5, severity 2, effort S, gain +0.25). The loofah is a faceted low-poly polyhedron.
8. **G-results-baseline** (typography, WS6, severity 1, effort S, gain +0.25). The phone results' water column drops 2 CSS px, and "(you)" wraps outdented.

I also endorse two critic gaps. Critic A's G-oot-tub-still-purple is confirmed in both builds. Critic A's G-generic-sphere-fx and Critic B's G-steam-followthrough are the same defect seen from two angles.

```json
{
  "loop": 9,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "characters": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "crops/high/R02-preview-captain", "note": "pusher's pink soap bar buried in his fist; the fist shows through the bar" },
      { "shot": "crops/high/R02-preview-rear", "note": "white towel slab pierced by the fist; helmets studless; head backs blank" },
      { "shot": "crops/high/R04-kart_3", "note": "push hands hover in front of the rim; tub is a smooth purple moulding with a decal stripe and no studs; the team swatch in high/desktop/R02 is teal (47,179,166) with yellow trim" },
      { "shot": "crops/high/R03-kart_5", "note": "white tub is one smooth shell; only the chassis plate is brick-built" },
      { "shot": "high/desktop/R17", "note": "loofah item is a faceted low-poly polyhedron, not a brick part" } ] },
    "materials": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R16", "note": "blurred painted arches with flat grey panes misregistered over them (pane x187-230 y309-382 over arch x156-215); absent in A of ab/high-desktop-R16" },
      { "shot": "high/desktop/R06", "note": "Arlington wings: brick texture on box walls, uniform window decals, no bevel or edge highlight" },
      { "shot": "strips/high/R14", "note": "steam is opaque shaded grey spheres with dark undersides: ball bearings, not vapour" },
      { "shot": "high/desktop/R17", "note": "hot steam is a tan disc clump, mean (169,143,118); loofah is faceted low-poly" },
      { "shot": "crops/high/R02-preview", "note": "concession: glossy helmet, tub and duck highlights are convincing plastic" } ] },
    "scenery": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R08", "note": "tan plank canopy and conifer tiers occupy the same space, top left" },
      { "shot": "high/desktop/R10", "note": "dark conifer plates pierce a light-green canopy at right" },
      { "shot": "high/desktop/R16", "note": "Row landmark: panes misregistered over painted arches, new this loop" },
      { "shot": "high/desktop/R09", "note": "about two dozen clones of one tiered conifer; grey-white far ring" },
      { "shot": "high/desktop/R17", "note": "Water Fight arena is a bare brick disc with a low wall" } ] },
    "lighting": { "score": 6.0, "confidence": 0.55, "evidence": [
      { "shot": "high/desktop/R07", "note": "road at y=650 brightens monotonically from (61,43,44) at x=200 to (112,81,68) at x=1050; no pool under any lamp" },
      { "shot": "crops/high/R03-kart_1", "note": "no occlusion under chassis or tub" },
      { "shot": "high/desktop/R09", "note": "far-ring face (171,190,198) vs sky (192,219,236): haze goes to unsaturated grey, not sky hue" },
      { "shot": "crops/high/R03-kart_5", "note": "contact shadows are hard black slabs offset under the shoes" },
      { "shot": "high/desktop/R19", "note": "concession: soft key-light tree shadows" } ] },
    "animation": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "strips/high/R14", "note": "frames 7-8: tub mounts the kerb; lamp post rises inside the ring with no bump, flash or call-out; camera ends facing storefronts (same in ab/strip-R14)" },
      { "shot": "strips/high/R15", "note": "frames 5/7 and 6/8 near-identical crew layout (diff 19.0/18.9 vs 26-34): circling reads as two alternating poses; water level, only beads move; concession: camera displacement frames 1-2" },
      { "shot": "strips/high/R16", "note": "judges static in all eight frames" },
      { "shot": "high/desktop/R17", "note": "hot steam is a tan lump behind the tub" } ] },
    "ui": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R04", "note": "accepted: clear hierarchy in one studded-tile style" },
      { "shot": "high/desktop/R18", "note": "CLEAN pill on all 8 rows carries no information; desktop pills vs phone check marks" } ] },
    "typography": { "score": 6.5, "confidence": 0.45, "evidence": [
      { "shot": "high/mobile/R18", "note": "water digits 4 device px below time digits in every row (tops 725/777/829 vs 721/773/825); '(you)' wraps at x126, 25 px left of the name column" },
      { "shot": "high/mobile/R02", "note": "selected card's division label 2.4:1; locked labels 2.8:1" },
      { "shot": "high/landscape/R01", "note": "disclaimer leaves 'business shown.' alone on its own line" } ] },
    "readability": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "high/desktop/R07", "note": "player's purple Velvet Mob tub directly behind the tie-dye crew's purple tub; same on high/mobile/R07" },
      { "shot": "high/desktop/R11", "note": "tie-dye purple tub beside the player again" },
      { "shot": "strips/high/R14", "note": "frame 8: road ahead out of frame after the slide" },
      { "shot": "high/desktop/R16", "note": "call-out panel x468-812 y177-302 covers the end of the street" },
      { "shot": "high/desktop/R19", "note": "WARM STEAM banner covers the trail beyond the ford" },
      { "shot": "high/desktop/R12", "note": "pack tubs hidden behind their crews" } ] },
    "mobile": { "score": 7.0, "confidence": 0.55, "evidence": [
      { "shot": "high/mobile/R04", "note": "accepted: controls clear of the tub" },
      { "shot": "high/mobile/R02", "note": "panel top edge cuts the preview kart's wheels and chassis" },
      { "shot": "high/landscape/R03", "note": "READY x575-1110 y215-360 covers the karts ahead" } ] },
    "authenticity": { "score": 6.5, "confidence": 0.55, "evidence": [
      { "shot": "high/desktop/R09", "note": "far rings are grey-white stepped cliffs: snow-capped rock, not the forested Ouachitas" },
      { "shot": "high/desktop/R17", "note": "far-ring face (164,183,194) vs sky (192,219,236), same icy read" },
      { "shot": "high/desktop/R16", "note": "Row bathhouse at the judge stop now has misregistered panes" },
      { "shot": "high/desktop/R13", "note": "Bridge Street generic downtown" },
      { "shot": "high/desktop/R06", "note": "concession: Arlington recognisable" } ] }
  },
  "ip": { "clean": true, "notes": "Bevelled cube heads, mitten fists, straight box torsos and box limbs; studs are plain discs; no LEGO name or logo in any frame or menu." },
  "gaps": [
    { "id": "G-row-panes-misregistered", "category": "scenery", "expectedGain": 0.25, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R16", "ab/high-desktop-R16"], "benchmark": "worlds-1", "fix": "For each landmark whose facade art paints its ground-floor openings, skip upright panes (as for the Quapaw) or snap every pane to a painted bay from a per-landmark bay list; raise that facade texture's resolution so arch outlines are crisp. Test: in high/desktop/R16 no pane overlaps a painted arch outline or bare brick (pane/bay IoU at least 0.9, or no panes)." },
    { "id": "G-slide-kerb-lamppost", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/high/R14", "ab/strip-R14"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Give kerbs and lamp posts a visible collision response (stop or bounce, camera kick, call-out, parts popping) and keep the slide capture path on asphalt; clamp chase-camera yaw lag so the road ahead stays in frame. Test: in strips/high/R14 the player's ring never overlaps pavement or a lamp post, and frame 8 shows the road centreline ahead." },
    { "id": "G-tree-interpenetration", "category": "scenery", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R08", "high/desktop/R10"], "benchmark": "worlds-1", "fix": "Place trees at a minimum spacing equal to the sum of their canopy radii (Poisson-disc per species), or merge close pairs into one built assembly. Test: in R08 and R10 no plate of one tree passes through another tree's canopy." },
    { "id": "G-prop-grip-clipping", "category": "characters", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["crops/high/R02-preview-captain", "crops/high/R02-preview-rear", "crops/high/R04-kart_3"], "benchmark": "2k-drive/drive-4.jpg", "fix": "Attach held props (soap, towel) to a grip socket between thumb and fingers with per-prop offsets; snap push hands to the tub rim per tub shape. Test: in the R02 close-ups no prop face intersects a hand, and in R04-kart_3 every push hand touches the rim with no visible gap." },
    { "id": "G-far-ring-icy-hue", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["high/desktop/R09", "high/desktop/R17", "high/desktop/R04"], "fix": "Haze the far rings toward a blue-green forest tone instead of grey-white, keeping their tree silhouettes darker than the faces. Test: the R09 box (1000,30)-(1060,60) and the R17 box (215,125)-(260,150) each have G at least B and saturation at least 0.20 (today (171,190,198) and (164,183,194), saturation about 0.14)." },
    { "id": "G-callout-over-horizon", "category": "readability", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["high/desktop/R16", "high/desktop/R19", "high/desktop/R15", "high/landscape/R17"], "benchmark": "2k-drive/drive-3.jpg", "fix": "Dock transient call-outs under the place tile or in the lower third beside the tub, and fade them to 60% after 0.5 s. Test: in R15, R16, R17 and R19 on every viewport, no call-out rectangle overlaps the central 30% of the width within 60 px of the horizon line." },
    { "id": "G-faceted-item-props", "category": "materials", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["high/desktop/R17", "high/mobile/R17"], "benchmark": "worlds-1", "fix": "Rebuild the loofah (and any other faceted item mesh) from bevelled brick parts, for example a 2x2 round brick with a sponge print, in the figures' plastic material. Test: the item beside the tub in R17 shows bevel highlights and no flat triangular facets." },
    { "id": "G-results-baseline", "category": "typography", "expectedGain": 0.25, "severity": 1, "effort": "S", "workstream": "WS6", "evidence": ["high/mobile/R18"], "fix": "Baseline-align the phone results cells (the water value sits 2 CSS px low) and keep a wrapped '(you)' inside the name cell, indented to the name's x (or use a marker icon). Test: in high/mobile/R18 the time and water digit tops align within 1 device px in every row, and the wrapped line starts at x 151." }
  ]
}
```
