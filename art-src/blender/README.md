# Blender landmark models (early-N64 look)

Procedural, re-runnable Blender scripts that build the kart game's real-world
landmarks as low-poly, vertex-coloured glTF models. The look is 1996–98
Nintendo 64: low triangle counts, flat vertex-coloured faces, small tiling
textures, and silhouettes you can read at 320×240.

```
art-src/blender/
  scripts/common.py              shared helpers (adapted from hsg-fishing, MIT)
  scripts/rowkit.py              Row palette, parts and the export/preview pipeline
  scripts/contact_sheet.py       labelled 5 x 2 sheet of the 320x240 street views
  scripts/landmarks/<name>.py    one script per landmark
  export/<name>.glb              game asset (Y-up)
  <name>.blend                   saved scene, for inspection
  renders/<name>_*.png           previews (git-ignored)
  renders/row-sheet.png          contact sheet (git-ignored)
```

## Running a script

From the repo root (`C:\Video Game Projects\games\Cart Racing`). Quote the paths, because they contain spaces.

PowerShell:

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b --factory-startup `
  --python "art-src/blender/scripts/landmarks/fordyce.py" -- [--no-render] [--checks]
```

Git Bash:

```bash
"/c/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup \
  --python art-src/blender/scripts/landmarks/fordyce.py -- [--no-render] [--checks]
```

- `--no-render`: build, export and save only.
- `--checks`: also renders an orthographic front elevation (to compare with the HABS drawing) and a rear 3/4 view (to look for holes).
- The script prints `@@TRIS`, `@@REPORT` and `@@FILES` lines. It stops with an error if the triangle budget is exceeded.
- Every run starts from factory settings and uses no randomness, so the output is the same each time (same GLB bytes).

## Conventions for every landmark script

| Topic | Rule |
|---|---|
| Units | Metres. Convert source feet with `FT = 0.3048` and keep the feet figure in a comment. |
| Axes | Author Z-up in Blender. Export Y-up (`export_yup=True`). Blender `(x, y, z)` becomes glTF `(x, z, -y)`. |
| Origin | Front-centre of the building, at street-facing grade, on the main front wall line (the frontmost full-height wall plane). |
| Frontage | X runs along the street frontage. On Bathhouse Row, **+X = south** along Central Ave (street numbers rise southward) and -X = north. |
| Facing | The facade faces the street: **glTF +Z** (Blender -Y). Projections in front of the wall line (eaves, porches, steps, marquees) have glTF z > 0. The body extends to glTF z < 0. |
| Grade | Ground level is y = 0. Walls carry on 0.5 m below grade as a skirt, so the model can sit on uneven or sloped terrain. |
| Object | One mesh object, named after the building, with no parent and an identity transform. No lights, cameras or animation in the GLB. |
| Shading | Flat (no smooth groups). Every face has its own vertices, so its colour stays flat. |
| Vertex colours | The `Col` attribute (BYTE_COLOR, point domain), exported as `COLOR_0` through the material's Color Attribute node (`export_vertex_color='MATERIAL'`). Colours are albedo. The only baked accents are a top-light/bottom-dark gradient on glass and darker soffits and undersides. |
| Palette | Hexes come from `research/visual-style-guide.md` (all estimates there). Any derived shade (`shade()`, `mix()`) is named and explained in the script. |
| Material slots | Exactly `wall`, `roof`, `trim` and `glass`, in that order (drop a slot only if it is unused). `wall` is the main facade masonry that a tiling texture will cover. `trim` is cornices, bands, surrounds, base, porch, canopies and soffits. `glass` is windows, doors, skylights and vents. |
| UVs | `box_uv(obj, unit=4.0)`: world-space box projection, **1 UV unit = 4 m**, on every face. On walls, u runs left-to-right as seen from outside (never mirrored) and v runs up. On roofs and floors, u = x and v = y. A 64×64 texture therefore gives 16 px/m. |
| Windows | Flat inset panels, not per-brick or per-mullion detail. Use 2 triangles per rectangle or 4 for a 3-segment arch, offset 5–12 cm off the wall. Depth-buffer safe to about 300 m. |
| Budget | Each landmark sets `TRI_BUDGET` (Fordyce: 900) and the script enforces it. |
| Facts | A docstring at the top lists the facts used (with the research file and the source they cite) and every estimate. Never invent a dimension silently. |
| Previews | 640×480 renders: a 3/4 street view at 1.6 m eye height and an elevated view, flat lighting (one sun plus grey ambient), sky-blue background, temporary ground plane. Also a 320×240 copy of the street view to judge readability at N64 resolution. Look at all of them before calling a model done. |

**Applying the facade texture later.** In glTF, `COLOR_0` multiplies the base-colour texture. The `wall` vertex colour is the *average* colour of the brick pattern, so a full-colour 64×64 texture would come out darker. When a texture is assigned, either turn off vertex colours for the `wall` material in the engine (three.js: `material.vertexColors = false`), or author the texture as a detail map centred on mid-grey.

## common.py helpers

The original hsg-fishing helpers are kept: `MB`, `box`, `prism`, `tube`, `loft`, `blob`, `export_glb`, `render` and `report`. Added for landmarks:

- **Colour:** `hexc()`, `mix()`, `mix_lin()` (linear-light area average), `shade()` and `srgb()`.
- **Per-face colour:** `MB.poly(pts, mat, col, out=)`. It gives each face its own vertices, auto-orients the face toward an `out` hint (Newell normal, so concave faces work), and accepts a colour callable for gradients. Also `vgrad()`, `cbox()` (box with a colour per face and optional face skipping) and `MB.build(order=[...])` for a fixed material-slot order.
- **Walls:** `Frame` (a vertical wall plane built from a 2D segment: `p(u, v, d)`, where counter-clockwise points face outward), `wpoly`, `wrect`, `vquad` and `bands` (horizontal colour bands).
- **Windows and arches:** `arch_uv()`, `window()` (rectangular or round-arched flat panel with a glass gradient), `fbox()` (a box mounted on a wall: balconies, canopies) and `star_uv()` (quatrefoils, rosettes).
- **Shaped parapets:** `outline_prism()` extrudes any concave outline into a wall (Spanish curvilinear gables), with a separate coping material on the edges.
- **Roofs:** `hip_roof()` builds an equal-slope hip with fascia and soffit, in about 16 triangles.
- **UV and IO:** `box_uv()`, `export_glb(texcoords=True)`, `render_cam()` (a fixed eye-point preview that cleans up after itself), and `tri_count_by_material()`.

## Fordyce Bathhouse (`landmarks/fordyce.py`)

1914–15, Mann & Stern, 369 Central Ave. It was the first bathhouse on the Row to close (1962) and has been the NPS visitor centre since 1989.

- **Triangles: 590 of 900** (trim 310, glass 148, wall 98, roof 34). The GLB is 57 KB.
- **Bounding box:** 33.5 m along X (eaves) × 17.4 m high × 28.5 m deep. That is 25.6 m of body behind the wall line plus 2.9 m of porch, steps and eaves in front.

### Dimensions

| Item | Value | Source |
|---|---|---|
| Frontage, wall to wall | 101 ft = 30.78 m | HABS AR-28-D Fordyce sheet, in `bathhouse-row-layout.md` |
| Width at the eaves | 110 ft, so a 1.37 m overhang each side | same |
| End-pavilion eaves | 39–40 ft (soffit 11.89 m, tile edge 12.19 m) | same |
| Hip peaks | 45 ft = 13.72 m | same |
| Centre parapet | 45–46 ft, modelled at 45 ft so the centre pent stays under the hips | same, rounded down |
| "Corner piers" | 49 ft = 14.94 m, modelled as the crowns of the curvilinear end gables, which appear as piers in elevation | same, plus the "curvilinear parapets on the end walls" note |
| Set-back penthouse and skylight | 57 ft = 17.37 m | same |
| Stories, bays | 3 + basement; 7 bays (1 + 5 + 1) | layout table; style guide |
| Main-block depth | 84 ft = 25.6 m (OSM's 94 ft bounding box minus about 10 ft of porch) | **estimate** |
| Limestone base | 3.5 ft | **estimate** |
| Cream ground storey | up to 20 ft, scaled from HABS photo 570630c | **estimate** |
| Frieze | from 36 ft | **estimate** |
| Pavilions | 17 ft wide, 2 ft projection, 25 ft deep | **estimate** |
| Gables | 10 m wide, centred 14 m back; profile traced from the photo | **estimate** |
| Penthouse | 10 × 8 m, set back 6 m, walls to about 50.5 ft, glazed hip roof | **estimate** |
| Porch | 1.07 m high, 2.6 m deep | **estimate** |
| Marquee | 19.6 m × 3.05 m, 4.75–5.30 m up, sawtooth "Greek-motif" cresting | **estimate** |
| Window sizes | various | **estimate** |

### Colours

All hexes are from `visual-style-guide.md`:

- cream ground storey and ivory terra cotta: `#E6D7B5`
- Batesville limestone: `#CFC6B2`
- red tile on the pavilion hips: `#A9432C`, with fascia `#7E2F1F`
- terra cotta (shaded, eave soffit): `#C46A3E`
- verdigris marquee (shaded): `#5E9C8C`
- amber glass on the marquee roof: `#D9A23A`
- window glass: cobalt `#2B4C9B`
- skylight: sea glass `#7FC8B8` → `#2A9D8F`

The upper-storey brick is derived: 65 % light-yellow `#E3CF94` plus 35 % dark-brown diamond brick `#6E4B2F` (an sRGB average), giving `#BAA171`. That stands in for the lozenge diaper seen from a distance until the texture exists. The flat centre roof is a dark derived grey (mortar `#CDBF9F` × 0.42). The 1984 photo shows that roof edge dark, with red tile only on the pavilions.

### Readability at 320×240 (street view)

**Reads well:**
- the Spanish curvilinear end gable (the strongest cue, as in the HABS photo)
- the two-tone of a golden-buff upper block over a cream base
- the seven-bay rhythm of cream window strips
- the deep red-and-dark cornice line
- the verdigris marquee with sawtooth cresting over the dark porch openings
- the limestone base and steps

**Weak:**
- The twin low hipped pavilions. At 22° they are almost edge-on from 1.6 m, so they read clearly only from the elevated view and at a distance.
- Arched window heads, balconies and the quatrefoil vent blur into the strips.
- The lozenge diaper shows only as an average colour until the 64×64 texture is added.
- The glazed penthouse is only a small teal sliver above the roofline.

## Bathhouse Row set (`landmarks/<name>.py`)

The other eight bathhouses, the NPS Administration Building and the Arlington Hotel follow the Fordyce conventions. They share `scripts/rowkit.py` (Row palette, pent and truncated-hip roofs, n-gon prisms, columns, finials, a chevron-tiled dome, window rows, and `finish()`, which checks the budget, exports, saves and renders the previews). `common.py` is untouched, so `fordyce.glb` is unchanged.

Every script's docstring lists the facts it used (research file and cited source) and every estimate. Each was run twice with `--no-render`, and the GLBs were byte-identical.

Contact sheet: `"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b --factory-startup --python art-src/blender/scripts/contact_sheet.py` writes `renders/row-sheet.png` (Arlington, then the Row north to south, Admin last). `-- --suffix _check_rear --out <png>` makes the same sheet from any 640×480 preview.

All 10 models load from `assets/models-row.js` (676 KB; run `node tools/pack-models.mjs`).

| Model | Tris / budget | Frontage × height used | Sources | Main estimates |
|---|---|---|---|---|
| `superior` (329) | 400 / 900 | 88 ft × cornice 30.5 ft, chimney 40 ft | HABS AR-28-A via `bathhouse-row-layout.md`; NHL / style guide (green paterae over the pilasters, flat roof, sun porch) | depth 70 ft (L-wing not modelled); porch 12 ft deep, 16 ft high; 7 bays |
| `hale` (341) | 384 / 900 | 123 ft × eaves 23 ft, ridge 37.5 ft, bell gable 16 ft | HABS AR-28-B (mahjong reading, matches OSM 123 ft); style guide (great hip, low bell gable on the porch, 12 arched windows) | depth 60 ft; porch 10 ft; "second hip at the south end" drawn as a lower rear wing; cowls |
| `maurice` (359) | 339 / 900 | 91 ft × wing eaves 36 ft, glazed hip 48 ft, penthouse 56 ft | HABS AR-28-C; NHL green tile and tile insets; 1984 photo | perimeter green hip to 41 ft; glazed hip 14.8 × 10.8 m; sun porch 63 × 14 ft |
| `fordyce` (369) | 590 / 900 | 101 ft × 45–57 ft | pilot (see above) | — |
| `quapaw` (413) | 756 / 1100 | 183 ft × ridge 35 ft, dome 50 ft, lantern finial 59 ft; dome 23 ft wide | HABS AR-28-E; NHL chevron mosaic; 1984 dome colours from the style guide | pavilions 30 ft; second storey 12 m deep; drum height (dome springing 37.5 ft); entrance pavilion; 5 arches a side |
| `ozark` (425) | 428 / 900 | 107 ft × parapet 26 ft, tower caps 38 ft, finials 41 ft; towers 47 ft c-c | HABS AR-28-F; NHL three-tier towers | tiers at 27 / 31 / 35.5 ft (85 % steps, style-guide recipe); pavilions 30 ft wide, 13 ft proud |
| `buckstaff` (509) | 616 / 900 | 104 ft × pavilions 34.5 ft, attic 45.5 ft, penthouse 48 ft | HABS AR-28-G; NHL / HABS Doric colonnade, 7 bays, urns | columns 2.5 ft diameter, 5–27 ft; attic 20 m deep; rooftop sun porches not modelled |
| `lamar` (515) | 368 / 900 | 93 ft × parapet 31 ft, pediment 34 ft | HABS AR-28-H (five segmental arches, LAMAR pediment); NHL tile coping | porch 77 ft wide (scaled from the photo), 15 ft high; skylight; stack |
| `admin` (101 Reserve) | 182 / 700 | 47 ft (west side) × 80 ft long × eaves 27.5 ft, ridge 37.6 ft | HABS AR-28-I; NHL (hip, balconies, broken pediment) | bay positions scaled from the HABS photo; west side windows; fountains left out |
| `arlington` (239 Central) | 1018 / 2000 | ≈ 60 m base front, 136 m across the wings × eave 37.3 m, towers 54 m | `downtown-and-landmarks.md` (Mann & Stern 1924, twin towers, 2023–25 stucco stripped to brick, Room 824); style guide | **Everything dimensional is estimated:** the research has no height, storey count or frontage. Uses 3.2 m floors and 11 floors in the centre block (rows counted on the 2020 photo); wings fold back 35° |

**Decisions to know about**

- **Conflicting frontages.** For the Hale, the mahjong HABS reading (123–127 ft) agrees with OSM (123 ft), so 123 ft is used instead of the trivia 116 ft. Elsewhere a value inside both HABS readings is used.
- **Brick colours.**
  - Superior: HABS and the 2020 photo show red brick with cream trim, so the walls use the style guide's pilaster brick `#B5654A` and the trim `#E6D7B5`.
  - Buckstaff: the sources conflict (NHL cream, NPS taupe, 1984 photo tan/brown). It is modelled tan, using the style guide's `#B89A6A`, so the white colonnade separates from the walls.
  - Arlington: the 2023–25 renovation stripped the stucco to brick, and the research only gives the style guide's [inferred] buff `#E6D7B5`. The walls use that buff mixed 35 % toward tan `#B89A6A` (the 2020 photo already shows buff-tan brick), with `#E6D7B5` cream trim and verdigris dome caps.
- **Admin orientation.** The entrance faces Reserve Ave, but the model keeps the Row frame: the plain west side faces glTF +Z, the Reserve front faces +X, and the origin is on the west wall. That way it drops into the Row like the others.
- **Arlington frame.** The origin is at the front-centre of the tower-pavilion faces. +X is to the right of a viewer facing the hotel (the Fountain St side). The arcaded base and the stair project to +Z.
- **Arlington windows.** Its window grids are one glass strip per column with wall-coloured spandrel bands laid 4 cm over them. This looks the same as separate panels and costs about a fifth of the triangles.

**Readability at 320×240** (street views, `renders/row-sheet.png`)

**Reads well:**
- Arlington: twin towers with domed crowns, the recessed centre block, the wings and the arcaded base. It closes the vista from 95 m.
- Superior: red brick with cream double cornices and the sun porch.
- Hale: the big red hip.
- Quapaw: the chevron dome and lantern, finials, red pents and long arcade.
- Ozark: twin stepped towers with red caps.
- Buckstaff: the white Doric colonnade between tan pavilions.
- Admin: a red-hipped stucco block with balconies.

**Weaker:**
- Maurice reads mainly as a white box with a dark green eave line, big dark third-floor windows and the five-arch porch. The glazed hip and penthouse show only as slivers.
- Lamar is deliberately the plainest. Its stepped pediment barely shows, so it is identified by the red coping line and the broad arched porch.
- Quapaw's shell gables and Hale's bell gable are small.
- Text (names) and paterae become a few coloured pixels.
