# Brick-toy style: references, Gold Master and LOD notes

Phase 1 of the brick-toy campaign (2026-10-30). This covers the reference study, the brick standards in
`art-src/blender/scripts/brickkit.py`, the Gold Master figure and tub built by `goldmaster.py`, and the
first Codex print pilot. It feeds Phase 4 (the LOD chain and the fidelity metric).

| What | Where |
|---|---|
| Reference downloads (git-ignored, never shipped) | `reference-samples/` and its `MANIFEST.md` |
| Brick standards, builders, plastic, studio | `art-src/blender/scripts/brickkit.py` |
| LDraw reader and reference renders | `art-src/blender/scripts/ldraw_ref.py` |
| Gold Master build, prints, renders, LOD probe | `art-src/blender/scripts/goldmaster.py` |
| Saved scene (figure, items, tub, posed crew, studio) | `art-src/blender/goldmaster.blend` |
| Exports | `art-src/blender/export/goldmaster-figure.glb`, `goldmaster-tub.glb`, `goldmaster-stats.json`, `goldmaster-lodprobe.json` |
| Renders (git-ignored) | `art-src/blender/renders/goldmaster/` |
| Codex prints and prompts (PNGs git-ignored) | `art-src/tex/brick/` with `PROMPTS-prints.md`, `PROMPTS-concept.md` |

Re-run from the game folder (Blender 5.2, `-b --factory-startup --python <script> -- …`):
`goldmaster.py` (full build and renders, about 6 min on the RTX 5060), `-- --no-render`, `-- --preview`,
`-- --only figure,tub,crew,fidelity`, `-- --probe LOD0,LOD1,LOD2,LOD3`, and
`ldraw_ref.py -- --lib reference-samples/ldraw/extracted/ldraw`. Two `--no-render` runs give byte-identical GLBs.

## 1. Brick standards

LDraw ratios (1 LDU = 0.4 mm): stud pitch 8 mm, brick 9.6 mm, plate 3.2 mm, stud 4.8 mm across and 1.7 mm
high, 1.2 mm walls, 0.1 mm of play per side. Game scale: **pitch 0.28 m**, so 35x and 1 LDU = 0.014 m.

| | Toy (mm) | Game (m) |
|---|---|---|
| Stud pitch | 8.0 | 0.280 |
| Brick | 9.6 | 0.336 |
| Plate | 3.2 | 0.112 |
| Stud diameter x height | 4.8 x 1.7 | 0.168 x 0.0595 |
| Wall, play per side | 1.2, 0.1 | 0.042, 0.0035 |
| Edge bevel (Gold Master) | 0.3 | 0.0105 |
| Crew figure, 5 bricks (15 plates) | 48 | 1.68 |

**Why 0.28 and not the plan's 0.36.** The plan's numbers disagree with each other: "a 1.8 m figure is 5
bricks" makes the brick 0.36 m (pitch 0.30, plate 0.12), while "pitch 0.36, plate 0.144" makes 5 bricks
2.16 m. Neither fits the game. `karts3d.js` has an attendant 1.51 m to the top of the head and 1.66 m to
the top of the helmet, and a tub shell 0.84 m wide and 1.72 m long. At 0.28 m the tub is exactly 3 x 6
studs (0.84 x 1.68 m) and the helmeted figure is 5 bricks, so ATT_POS, the wheel hubs and the rim height all
stay where they are.

## 2. What the references show

Renders: `ldraw_parts.png` (LDraw 3005, 3004, 3003, 3022, 3070b, 3062b at high-resolution primitives),
`ldraw_vs_brickkit.png` (LDraw beside our builds), `ldraw_studs.png` (LDraw raw, LDraw with a bevel
modifier, brickkit). Kenney packs were measured with Blender's glTF importer; their preview sheets were
viewed but not re-rendered.

**Plastic.**
- Glossy ABS reads right at roughness about 0.17 with IOR 1.54: broad soft highlights from big softboxes
  on flat faces, thin bright lines on bevels and stud rims. A large dim softbox behind the camera is what
  gives flat faces (torso fronts, tub sides) their sheen; without it dark plastic looks matte.
- Reds wash to salmon as soon as the exposure is too high. The renders use the **Khronos PBR Neutral** view
  transform at exposure -1.3, which keeps the palette saturated. It matches three.js `NeutralToneMapping`,
  so the game can use the same curve.
- A 3 % subsurface term is invisible at every game size; leave it out of `brickmat.js`.
- The Kenney packs are flat-shaded with a single palette texture (`colormap.png`) and no specular. They read
  as matte toys; the glossy look needs per-pixel specular, which is the plan's Phase 3.

**Bevels.**
- LDraw parts are nominal geometry with perfectly sharp edges, and the files are polygon soup (T-junctions,
  unwelded primitives). A Bevel modifier with harden normals streaks on them, so it is used without harden
  normals; the result is only slightly rounder than the raw part. **LDraw is the ceiling for proportions and
  stud detail, not for bevels.** Our own clean geometry with hand-hardened normals catches a continuous
  highlight line on every edge (right-hand brick in `ldraw_studs.png`).
- A 0.3 toy-mm radius (1.05 cm) is 2.5 px on a 400 px figure and under half a pixel at 55 px.
- One chamfer segment with hardened normals already shades like a round bevel. That is the cheapest bevel
  level: 2 extra triangles per edge.
- Kenney Brick Kit ships every brick in none/bevel/round x hq/lq variants, a ready-made precedent for knobs.
  A 2 x 2 brick is 12 triangles at none-lq (no studs), 20 at none-hq, 100 at bevel-lq and 172 at bevel-hq or
  round-hq.

**Studs.**
- LDraw ships stud primitives at three resolutions: `p/8` (8 sides), `p` (16) and `p/48` (48). `stud.dat` is
  plain; logo studs (`stud-logo*.dat`) were never used.
- The Gold Master stud has 48 sides and a 4-step rounded top edge: about 526 triangles. 16 sides with 2 steps
  is about 110, and 8 sides with 1 step about 38.
- A stud reads as a bright rim highlight plus a shadow crescent. Below about 6 px it becomes a dot; below
  about 2 px it disappears (see section 5).

**Prints (Codex `$imagegen` pilot, gpt-image-2).**
- The face sheet (8 expressions) and the front and back torso prints are clean flat pad-print art.
- The concept turnaround reads as an original block figure, not a minifig; it added silver suspender
  buckles that were not asked for.
- All three prints came back on near-white (#FDFFFF), not transparent. A plain white key would also punch
  out the eye highlights and teeth. `goldmaster.py` keys faces by flood fill from the border (white inside the
  art stays) and torso prints globally (straps and bands enclose background).
- The face cells ignored the requested square layout (rows at y ≈ 280 and 750). One crop window, the union
  of all eight faces, is used for every expression, so the eyes sit in the same place on each.
- The torso front is 0.74 wide per unit of height, but the image is 2:3, so rows are cropped. The back
  print's bands sat at other heights and spacing, so its rows are resampled to line them up with the
  front's. The band-only left edge of the front print is projected round the torso sides so the bands wrap.
- **In a race the chase camera sees the attendants' backs.** The back print (the yellow X and the bands) is
  the team read at 55 px (`fidelity_chase_55px.png`); the face and the hydrant badge are not.

## 3. The Gold Master

**Figure (Engine Six Soakers firefighter), original and deliberately not a minifig.**
- Rounded-cube head (0.30 x 0.27 x 0.28 m, radius 0.07) with a flat printed face. Never a cylinder.
- Straight box torso (0.40 x 0.24 x 0.54 m) with a raised collar. Never a trapezoid.
- Block arms on round shoulder caps; mitten hands (rounded block plus thumb). Never C-hands.
- A hip block with a seam over two separate block legs with a gap between them. The leg tops are rounded
  on the hip axis inside the hip block, so legs swing without opening a gap.
- Boots stick out in front. The head is about 17 % of the height (a minifig's is about a quarter).
- One stud, on the helmet crown. The helmet is a rounded box (the head's design language) with a long
  sloping rear brim, a comb and a yellow front shield.

Proportions and placement come from `karts3d.js` (hip 0.58 vs the game's 0.64, torso top 1.20 vs 1.19,
head top 1.51 vs 1.51, helmet 1.66 vs 1.66). Every part is its own object with its origin on its joint, in a
hierarchy for rigid animation: `figure` → `hip` → `leg_l`, `leg_r`, `torso` → `head` → `hat`, and `torso` →
`arm_l`/`arm_r` → `hand_l`/`hand_r`, with `item` under `hand_l` (the left hand, as in the game). The GLB also
has an `items` root with `item_towel`, `item_mat`, `item_soap` and `item_loofah`, each with its origin at
the grip.

**Tub (Traditional division).**
- A cast-iron, double-ended roll-top shell: a stadium plan swept through one profile, with red outside, a
  white enamel inside, a yellow rolled rim and the team band on the straight sides.
- Four gold ball-and-claw feet, each on a stud of a 3 x 5 dark-grey studded chassis plate, with axle blocks
  and bosses.
- Toy wheels: a rubber tyre with two grooves, a grey hub, a yellow cap and lug bolts.
- A flag on a pole with clips, a rubber duck, and a translucent water sheet at 75 % fill.
- Parts and pivots as in the game: `body`, `wheel_fl`, `wheel_fr`, `wheel_rl`, `wheel_rr` (hubs at
  (±0.55, 0.3, ±0.6) game), `flag` (pole base), `duck`, `water` (centre of the sheet).

**Crew render.** The captain is the same figure in the `cap` colour at x 1.12 with the head x 1.25 (the
game's numbers), seated with the legs folded into the tub. The four attendants stand at ATT_POS holding the
four items, posed pushing. All of this is render-only and lives in the `.blend`.

**Renders** (`art-src/blender/renders/goldmaster/`, Cycles, 1024 px, neutral studio cove):
- `figure_turn_0…315.png` and `figure_hero.png`
- `tub_turn_*.png` and `tub_hero.png`
- `crew_turn_*.png` and `crew_hero.png` (rear 3/4, the chase side)
- `items.png`
- Fidelity references: `fidelity_{front34,chase}_{400,55,20}px.png`. Each is orthographic on a transparent
  film, rendered 4 x 4 larger (`*_4x.png`) and box-filtered in linear light; the figure spans exactly N rows.
  The camera numbers are in `goldmaster-stats.json` → `fidelity`.

## 4. Triangle counts (Gold Master, no budget)

| Figure part | Tris | | Tub part | Tris |
|---|---|---|---|---|
| `hat` | 6,922 | | `body` (shell, chassis, feet) | 47,538 |
| `leg_l`, `leg_r` | 3,928 each | | `wheel_*` | 13,108 each |
| `head` | 2,216 | | `duck` | 21,196 |
| `arm_l`, `arm_r` | 2,176 each | | `flag` | 8,800 |
| `hand_l`, `hand_r` | 2,004 each | | `water` | 586 |
| `torso` | 1,752 | | **tub total** | **130,552** |
| `item` (towel) | 1,200 | | | |
| `hip` | 300 | | | |
| **figure total** | **28,606** | | **crew scene (5 figures + items + tub)** | **286,470** |

The items are towel 1,200, mat 3,792, soap 3,336 and loofah 10,560. For scale, today's whole kart (tub,
captain and four attendants) is about 1.5k triangles.

## 5. What stays visible at 400, 55 and 20 px

Judged on the fidelity references (front 3/4 and chase).

| Detail | 400 px | 55 px | 20 px |
|---|---|---|---|
| Silhouette: helmet wider than the shoulders, long rear brim | yes | yes | yes, as a red cap |
| Face: brows, eye highlights, mouth | all | two dark eye pixels, no mouth | no (2 px of skin) |
| Torso: lime/silver bands, suspenders | yes, the silver stripe too | bands and suspenders as 1 px lines | one muddy lime/yellow row per band |
| Back X of the suspenders (chase view) | yes | **yes, the clearest team cue** | a yellow blob |
| Hydrant badge, clasps, collar print | yes | a red speck | no |
| Helmet shield, comb, crown stud | yes | shield as a yellow block; stud a 1 px bump | no |
| Bevel highlight lines | 2–3 px on every edge | soft edge lightening only | no |
| Mitten thumbs, gap between legs, hip seam | yes | gap about 1 px | no |
| Leg bands, black boots, white towel with stripes | yes | yes (stripe as one pixel) | colour rows; towel a white column |

**Game-scale note.** The plan's "chase ~55 px, pack ~20 px" match the old 240-line picture. In the native
picture (desktop 800 px tall, `camera.js` chase distance 6.3 m and height 2.9 m, FOV 62°) a 1.68 m figure is
about 1,118 / d px tall. The player's own crew at about 6 m is **about 185 px**, 55 px is a rival about 20 m
ahead, and 20 px one about 56 m ahead. On a phone in portrait (FOV 78°, camera 1.6 m further back) the own
crew is about 110 CSS px. The fidelity metric should take its sizes from the native-resolution captures, not
from these three numbers.

## 6. Stud rendering for WebGL (survey)

A stud is 0.168 m across. On the desktop chase camera it is 112 / d px wide (d in metres): 8 px at 14 m,
4 px at 28 m, 2 px at 56 m. On a phone in portrait at DPR 2 it is 175 / d device px.

1. **Geometry near (stud ≥ ~8 px).**
   - Part studs (the helmet's one, the chassis's 15) stay in the part mesh: about 38 tris each at 8 sides
     with one hardened chamfer.
   - Large studded areas (baseplates, roofs) use one three.js `InstancedMesh` per stud LOD, with a
     per-instance matrix and palette slot, rebuilt per grid chunk as the camera moves. Only studs inside the
     tier's `studRadius` are drawn: 10k studs at 38 tris is 380k triangles, so the radius is the real budget.
   - LDraw's 8/16/48-side primitives and Kenney's hq/lq bricks follow the same pattern.
2. **Shader studs at mid range (2–8 px).** Studded top faces get a procedural stud in the fragment shader:
   - Grid cell from local position (`fract(p.xz / pitch) - 0.5`) and the distance to the stud circle
     (radius 0.3 pitch), anti-aliased with `fwidth`.
   - A small height profile (flat top, rounded rim) turned into a normal with derivative bump mapping
     (`dFdx`/`dFdy`; Mikkelsen 2010, "Bump Mapping Unparametrized Surfaces on the GPU"). The result is a rim
     glint on the lit side, a darker crescent opposite and a faint AO ring.
   - WebGL2 has derivatives built in; WebGL1 needs `OES_standard_derivatives`. There is no texture fetch and
     no extra vertices, only a few dozen ALU ops on fragments with `normal.y > 0.9` and a studded flag.
   - The bump amplitude fades with stud size in pixels (from `fwidth`), so it never shimmers.
   - A tiled normal-map stud (with mips) is the texture alternative, but it costs pack bytes. Parallax
     occlusion mapping costs 8–16 fetches and buys nothing at 2–8 px.
3. **None far (stud < 2 px).** Flat plastic, but fold the shader's average (a slightly brighter top with an
   AO tint) into the base colour as it fades, so no band pops where studs stop.
4. **Transitions.** Distance bands with the plan's 10 % hysteresis. At the geometry→shader boundary a stud is
   about 8 px either way, so a short dithered fade (alpha-to-coverage with MSAA) hides the seam.

## 7. Recommended knobs for the LOD chain

`brickkit.Knobs` has `bevel_segs`, `stud_segs`, `studs` ('geo'/'none'), `round_segs`, `curve_segs` and
`edge`. `goldmaster.py --probe` builds the same figure and tub with each set in `brickkit.LOD_PROBES`
(`export/goldmaster-lodprobe.json`).

| Level (use) | bevel | studs | round | curve | Figure tris | Tub tris | 5-crew + tub |
|---|---|---|---|---|---|---|---|
| Gold Master | 4 | 48 geo | 64 | 10 | 28,606 | 130,552 | 286,470 |
| LOD0 (team select, podium; own crew close-ups) | 2 | 16 geo | 24 | 4 | 7,302 | 29,972 | 68,024 |
| LOD1 (own crew in chase, ~110–185 px) | 1 | 8 geo | 12 | 2 | 2,722 | 9,280 | 23,306 |
| LOD2 (rivals ~15–40 m) | 1 | none (shader) | 8 | 1 | 1,916 | 6,264 | 16,004 |
| LOD3 (rivals beyond ~40 m) | 0 | none | 6 | 0 | 644 | 3,926 | 7,392 |

What the probe says:
- **Knobs alone are not enough below LOD1.** At LOD2 and LOD3 the cost sits in micro-parts that still exist:
  - the hat's comb and brim (344 tris at LOD2);
  - the legs' boot soles and reflective bands;
  - the wheels' hubs and lug bolts (600 tris per wheel at LOD3);
  - the duck's separate spheres and the flag's clips.
- Phase 4's `brickfig.py` and `bricktub.py` need a **detail** knob as well: `full`, `no-micro` (bands, soles,
  stripes and clasps become vertex colour or print; drop lugs, comb, tassels and bubbles) and `blocks` (one
  box per part, as in Kenney Blocky Characters, which are 72 tris per character with everything in the
  texture and rigid node animation).
- Suggested targets until `perf-budgets.json` exists: LOD2 figure ≤ 400 and tub ≤ 1,200 (crew ≤ 3.2k);
  LOD3 figure ≤ 150 and tub ≤ 400 (crew about 1.1k, close to today's 1.5k kart).
- **Bevels:** 1 hardened segment is visually about as good as 2–4 from 55 px down; keep 2+ only at LOD0.
- **Curves:** head and hand roundings at `curve_segs` 2 are enough to 120 px; at 1 they read as chamfered
  blocks, which suits the brick look.
- **Prints per level:**
  - face decal about 128 px at LOD0 and 64 px at LOD1; a two-dot face (or none) at LOD2; none at LOD3;
  - torso prints 128 x 172 at LOD0 and 64 x 86 at LOD1; bands and suspenders as vertex-colour rows at LOD2
    and LOD3;
  - the back print gets the same or better resolution than the front, since it is what the race camera sees.
- **Studs per level:** geometry at LOD0 and LOD1 (8 sides with a chamfer at LOD1), shader at LOD2, none at LOD3.

## 8. Conflicts with the plan, and open issues

1. **Scale.** The plan's pitch 0.36 m conflicts with its own 1.8 m figure and with the game. The standard
   is now 0.28 m (section 1).
2. **Chase pixel heights.** 55 px and 20 px come from the 240-line picture. At native resolution the own
   crew is about 110–185 px (section 5), so the in-race crew needs LOD1, not LOD2.
3. **ImportLDraw.** The plan named the free ImportLDraw add-on; the brief said no third-party add-ons.
   `ldraw_ref.py` replaces it (line types 1/3/4, hi-res primitives, BFC ignored). Bevels on LDraw soup streak
   with harden normals, so LDraw sets the proportion and stud ceiling, while our builders set the bevel
   ceiling.
4. **Codex transparency.** The image tool returned opaque near-white for all three prints. LESSONS.md's
   `keyWhite` advice holds, but a naive white key destroys eye highlights and teeth. When `tools/tex.mjs`
   gains its no-dither brick mode, it needs a border-connected (flood) key for faces and a global key for
   uniform prints, as in `goldmaster.py`.
5. **Decals in the GLB.** Each print is pre-composited onto its part colour, so there is one material per
   print (fine for a reference). The game plan (palette uniforms plus a decal atlas) should instead pack the
   keyed alpha decals (`art-src/tex/brick/face_*.png`, `print_torso_*.png`).
6. **Tub interior.** The game tints the inside toward the tub colour; the Gold Master uses white enamel,
   which is truer to a real claw-foot tub. Worth a look in review.
7. **Side attendants.** ATT_POS puts attendants 3 and 4 at x ±1.04, about 0.6 m clear of the tub, so their
   arms cannot reach it. The crew render turns them 28° inward. The game may want them nearer (about ±0.8)
   when crew animation arrives.
8. **Pivot heights.** The hip pivot is 0.58 m (the game's torso origin is 0.64), because the brick hip block
   sits between the legs and the torso. Torso, head and helmet tops still match within 1 cm.
9. **Determinism.** Two `bmesh.ops.bevel` calls on one bmesh came out in a different order between runs.
   Cylinder roundings are built as profile arcs instead; boxes still use one bevel call, which is stable.
10. **IP check.** There is no cylinder head, no trapezoid torso, no C-hand, no lettering on studs and no
    brand word in files or images. The flag and helmet shield are blank (an emblem sticker sheet is a later
    item).

## 9. Phase 4: all twelve crews at four LODs (shared geometry plus per-team files)

Built by `art-src/blender/scripts/brickfig.py` (figure parts, the 12 hats, items, team trims), `bricktub.py`
(body, feet, skirt, wheels, flag, duck, water) and `brickcrew.py` (atlas, assembly, AO bake, export). Run from
the game folder:
`blender -b --factory-startup --python art-src/blender/scripts/brickcrew.py -- --atlas --build --table`
(about 1 min), then `-- --sheet` for the line-up and `-- --lodsheet team,team` for LOD comparisons. Two full
rebuilds were byte-identical across all 107 outputs (`export/crew/hashes.json`).

**Split for download size** (the runtime session's amendment). Everything that is the same for every team
except its colour is exported once per LOD; each team adds only what is truly its own.

- **`shared-lod<N>.glb`** has these nodes:
  - tub: `body`, `feet` (traditional) and `skirt` (modified and stock), `wheel_0..3`, `flag`, `duck`, `water`;
  - captain: `cap_head`, `cap_arm_l/r`, `cap_hand_l/r`;
  - per attendant: `att{i}_head`, `att{i}_arm_l/r`, `att{i}_hand_l/r`, `att{i}_item`, `att{i}_leg_l/r`;
  - LOD0–1 only: `cap_torso` and `att{i}_torso` (hip, torso and neck).
- **Shared vertex data.** `COLOR_0` is grey AO. `_SLOT` (a float scalar per vertex) indexes the slot list
  `tub, trim, flag, shirt, cap, hat, skin, pants, shoe, item, rim, enamel, tyre, hub, iron, duck, beak, black,
  water`. The last four slots are fixed colours the shared parts need.
- **Mesh sharing.** The four attendants share meshes (all but the items), and wheels 0/2 and 1/3 share a
  left and a right mesh. The LOD1 shared file has 52 nodes but only 26 meshes.
- **`<team>-lod<N>.glb`** has `cap_hat`, `att{i}_hat` (one mesh), the team's trims at LOD0–1, and at LOD2–3
  the torsos. COLOR_0 there is linear albedo x AO, with no `_SLOT`.
  - Trims are named `<owner>_trim`: Engine Six cuffs and reflective bands, Velvet Mob spats and cuffs, the
    jockeys' sleeve hoops and boot tops, and the leg bands of Bubble Patrol, Trail Shredders and Suds Posse.
  - Low-LOD torsos are per team because their colour rows come from the team's prints.
- **`<team>-lod<N>.json`** covers every node with `src` (shared or team), `part` (which of the runtime's 24
  animated parts it merges onto), the rest transform (pos, and rot in YXZ) and its triangles. It also holds:
  - `palette` (slot to sRGB hex) and `items` (each attendant's item and colour);
  - `body_variant` (`feet` or `skirt`);
  - `printOffset`, added to torso UVs, and per-figure `faces[].uvOffset`, added to head UVs. Both apply only
    where the UV is outside the empty corner, and only at LOD0–1.
  - The shared torsos point at the first team's cells and every shared head at the neutral face; each team's
    front and back cells sit side by side, so one offset serves both.
- **Pose.** Arms, hands and items are separate nodes. Their rest rotations hold the pose: attendants push
  with arms at -78°, splay 6° and wrists 25°; the captain's arms are at `rot.x` = -1.15. There are no hand
  nodes at LOD3, where a hand is its arm's end face.

**Sizes (raw float32, before the packer quantises).**

| LOD | Shared file | 12 team files together | Total |
|---|---|---|---|
| LOD0 | 946 KB | 947 KB | 1.9 MB |
| LOD1 | 354 KB | 398 KB | 0.75 MB |
| LOD2 | 79 KB | 294 KB | 0.37 MB |
| LOD3 | 51 KB | 167 KB | 0.22 MB |

The first export (one full mesh per team per LOD) was about 28 MB.

**Levels.**

| LOD | Knobs (bevel, studs, round, curve) | Detail | Prints | Budget figure / tub |
|---|---|---|---|---|
| LOD0 | 2, 16 geo, 24, 4 | full | atlas UVs | 7,200 / 30,000 |
| LOD1 | 1, 8 geo, 12, 2 | full (teeth, nostrils and spring coils dropped) | atlas UVs | 2,700 / 9,300 |
| LOD2 | 0, none, 8, 1 | no-micro (chamfered head and crowns, eye dots) | colour rows | 400 / 1,200 |
| LOD3 | 0, none, 6, 0 | blocks (hip is the torso's bottom row; a hand is its arm's end face) | colour rows | 150 / 400 |

**Triangles** (largest figure of the five, including hat, item and trims; tub with its feet or skirt):

| Team | LOD0 | LOD1 | LOD2 | LOD3 |
|---|---|---|---|---|
| `engine-six` (helmet, traditional) | 6,358 / 26,672 | 2,674 / 8,216 | 364 / 596 | 134 / 236 |
| `lather-linen` (turban, traditional) | 6,650 / 26,672 | 2,654 / 8,216 | 390 / 596 | 132 / 236 |
| `velvet-mob` (fedora, traditional) | 5,650 / 26,672 | 2,362 / 8,216 | 364 / 596 | 134 / 236 |
| `gator-gang` (snout hood, traditional) | 6,742 / 26,672 | 2,318 / 8,216 | 356 / 596 | 134 / 236 |
| `bubble-patrol` (police cap, modified) | 4,940 / 22,444 | 2,096 / 6,964 | 346 / 568 | 134 / 212 |
| `trail-shredders` (bike helmet, modified) | 5,256 / 22,444 | 2,074 / 6,964 | 312 / 568 | 134 / 212 |
| `out-of-towners` (antenna cap, modified) | 6,490 / 22,444 | 2,170 / 6,964 | 336 / 568 | 142 / 212 |
| `silks-stirrups` (jockey cap, modified) | 5,322 / 22,444 | 2,142 / 6,964 | 302 / 568 | 134 / 212 |
| `steam-rangers` (campaign hat, stock) | 5,392 / 22,444 | 2,140 / 6,964 | 318 / 568 | 134 / 212 |
| `suds-posse` (cowboy hat, stock) | 5,562 / 22,444 | 2,274 / 6,964 | 352 / 568 | **150** / 212 |
| `flamingo-flock` (beak hood, stock) | 5,554 / 22,444 | 2,218 / 6,964 | 380 / 568 | 134 / 212 |
| `tub-ninjas` (headband, stock) | 5,066 / 22,444 | 2,162 / 6,964 | 278 / 568 | 132 / 212 |
| Whole kart (5 figures + tub), range | 44.3k–57.7k | 16.1k–20.3k | 1.8k–2.4k | 824–914 |

The shared files hold 45,648 / 15,852 / 1,396 / 586 tris (both body variants included). Skirted tubs carry
the shared chassis studs under their skirt; that costs 1.7k at LOD0 and 0.6k at LOD1, within budget. Suds
Posse at LOD3 sits exactly on the 150 budget.

**Hats** (each original; one stud at full detail):

| Hat | Team | Design |
|---|---|---|
| helmet | Engine Six | rounded-box crown, long rear brim, shield |
| turban | Lather & Linen | three stacked wrapped rolls and a brooch |
| fedora | Velvet Mob | creased crown, gold band, snap brim |
| snout hood | Gator Gang | hood with a toothy snout, eye bumps and back scutes |
| police cap | Bubble Patrol | flared flat top, light stripe, black visor, star |
| bike helmet | Trail Shredders | teardrop shell, stripe and vents, visor |
| antenna cap | Out-of-Towners | skullcap with two sprung stalks and balls |
| jockey cap | Silks & Stirrups | quartered dome, peak, stud button |
| campaign hat | Steam Rangers | wide flat brim, four-dent peaked crown |
| cowboy hat | Suds Posse | tall creased crown, gold band, brim curled up at the sides |
| beak hood | Flamingo Flock | pink hood, pale beak with a bent black tip, crest |
| headband | Tub Ninjas | band, brow plate, a round knot at the back with a stud facing the chase camera |

**Atlas** (`prints.png`, 1024 x 1024, keyed alpha, glTF top-left origin):
- the top-left 16 x 16 px is transparent;
- the 8 shared face cells are 120 x 112 at y = 4;
- the 24 torso cells (front and back per team, side by side) are 164 x 221 in 4 rows of 6 from y = 124;
- every cell has a 2 px edge-extended gutter;
- unprinted corners use UV (8, 8) px.

The 22 new torso prints came from four Codex batches (`PROMPTS-batch1..4.md`), with the approved Engine Six
pilot as the style reference. Each team got a distinct back layout, because backs are what the race camera
sees: X, Y or H straps, a bow sash, spine ridges, pockets, tie-dye, diamonds, a pine, scallops or a moon. The
Tub Ninjas back was refused once by the image tool's safety filter and came through on a plainly worded
retry.

**Colour rows below LOD1.** Each row's split comes from the optimal piecewise fit of the print's mean colour,
so bands land on rows. Each row takes the print's **dominant** colour over the plastic, not the mean: the
mean turned tie-dye to grey and Engine Six's X-strapped coat to olive. Rows are per role (attendant shirt or
captain `cap` colour) and per side.

**AO.** 32 fixed cosine-weighted rays per vertex, 0.28 m long, strength 0.7, cast against the kart in rest pose
plus the ground. Each shared mesh is baked once, from its first user. The skirt is baked with the body and
without the feet; the feet are baked without the skirt.

**Line-ups.** `art-src/blender/renders/crew/lineup_lod1_rear.png` and `lineup_lod1_front.png` show all 12
crews with no names, coloured exactly as the runtime will: shared nodes from the palette by slot, team nodes
as exported, prints by offset. Every crew is distinguishable from both sides.

**IP checklist (re-run on all files, the atlas and the line-ups).**
- Heads are rounded cubes; there is no cylinder head.
- Torsos are straight boxes; there is no trapezoid.
- Hands are mittens with a thumb, or the arm's end face at LOD3; there are no C-hands.
- Legs are separate blocks under a hip seam.
- Studs are plain cylinders with no lettering.
- Prints have no text, letters, numbers or logos. Emblems are pictograms (hydrant, towel, spade, gator,
  star, wheel, saucer, horseshoe, pine, star badge, flamingo, moon).
- No brand word appears in any script, JSON, notes file or GLB (case-insensitive scan).

**Decisions and deviations.**
1. GLB node TRS carry the rest transforms as well as the sidecars; meshes are in pivot space. Pivots:
   - torso and legs at the hip; the captain's torso at the seat;
   - heads at the neck, hats at the crown, arms at the shoulder, hands at the wrist, items at the grip;
   - trims share their owner's pivot and rest transform.
2. `_SLOT` adds four fixed slots to the requested fifteen (`duck`, `beak`, `black`, `water`). Shared parts
   need those colours (duck, beak, eyes and soles, water and soap bubbles).
   - White details (mat tassels, the loofah cord) use `enamel`.
   - Axles, lug bolts and the flag pole use `hub`.
   - The skirt uses `tub` (AO darkens it).
3. Hands share the `skin` slot, so the gator, bike and ninja gloves were dropped.
   - Cuffs, leg bands, spats and boot tops are team trim nodes at LOD0–1 only. At LOD2–3 legs are plain
     pants and shoe.
4. The body always carries the studded chassis; feet and skirt are separate division variants.
5. The hip pivot is 0.58 m (the game used 0.64). The captain's seat is (0, 0.66, -0.1), with body x 1.12 and
   head x 1.25 baked into the captain meshes; the head top is at about 1.74 m, the rim at 1.04 m.
6. Attendants 2 and 3 stand at x ±0.86, z -0.72, turned 20° inward. Their hands are about 0.3 m short of
   the rim.
7. Captains reuse their team's torso prints over the `cap` colour.
8. The water sheet rests at 75 % fill (y 0.86); the runtime moves it with `0.5 + 0.48 * fill`.
9. Leg, boot and trim colours are not in `teams.js`; `brickfig.TEAM_STYLE` sets them per archetype. The pants
   and shoe colours reach the palette.
