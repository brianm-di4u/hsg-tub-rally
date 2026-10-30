# Real-geography sources for Tub Rally

Everything under `art-src/geo/raw/` is downloaded by `node tools/geo/fetch.mjs` (git-ignored; skip-if-present, `--force`
refetches, `--only=osm,dem,copy,gnis` limits the steps). `art-src/geo/raw/manifest.json` records, per file, the byte size,
SHA-256, fetch time, the exact request and (for DEMs) the extent and pixel size read back from the file.
`node tools/geo/survey.mjs` turns the raw data into `research/geo/road-survey.md` / `.json`, `research/geo/anchors.json`
and the preview maps in `art-src/geo/previews/`. All fetched **2026-10-30** (UTC 05:39–05:42) unless noted.

## Credits the game must carry

- **Map data © OpenStreetMap contributors**, available under the Open Database License (ODbL 1.0),
  <https://www.openstreetmap.org/copyright>. Attribution is required wherever OSM-derived roads, buildings or
  points are shown (credits screen and any map/minimap). Track splines and 3D levels built from OSM are a
  "Produced Work" (attribution only). If we ever publish a *derived database* (for example the road graph or
  `road-survey.json` on its own), that database must itself be offered under ODbL.
- **Elevation: U.S. Geological Survey, 3D Elevation Program (3DEP).** U.S. federal work, public domain; credit
  is courteous, not required.
- **Place names: USGS Geographic Names Information System (GNIS).** Public domain.

## Datasets

| File | Source | Licence | Bbox (lon/lat, WGS84) | Resolution | Size |
|---|---|---|---|---|---|
| `osm-roads.json` | Overpass API, query A below | ODbL 1.0 | query 34.490,−93.135 → 34.550,−92.985 (S,W,N,E) | OSM vertices (survey: 12–77 m mean spacing per road) | 3.4 MB, 3,832 ways |
| `osm-pois.json` | Overpass API, query B | ODbL 1.0 | same | points / areas | 101 KB (27 nodes, 41 ways, 3 relations) |
| `osm-buildings.json` | Overpass API, query C | ODbL 1.0 | 34.500,−93.065 → 34.525,−93.045 | footprints | 286 KB (9 nodes, 346 ways) |
| `dem-east.tif` | 3DEP exportImage (fetched here) | public domain | −93.040, 34.500 → −92.985, 34.548 | 2.0e‑5° = 1.836 m E‑W × 2.219 m N‑S; 2750 × 2400 px | 27.4 MB |
| `dem-west.tif` | 3DEP exportImage (fetched here) | public domain | −93.135, 34.488 → −93.075, 34.535 | 2.0e‑5° = 1.836 × 2.219 m; 3000 × 2350 px | 29.9 MB |
| `dem-downtown.tif` | copy of `games/trivia/art-src/geo/raw/dem-downtown.tif` (3DEP, fetched 2026-10-28) | public domain | **actual** −93.080, 34.4909375 → −93.025, 34.5390625 (requested 34.495–34.535, see gotchas) | 2.2917e‑5° = 2.104 m E‑W × 2.542 m N‑S; 2400 × 2100 px | 21.2 MB |
| `dem-region.tif` | copy of `games/trivia/art-src/geo/raw/dem-region.tif` (3DEP, fetched 2026-10-28) | public domain | actual −93.300, 34.379375 → −92.850, 34.660625 (requested 34.38–34.66) | 2.8125e‑4° = 25.8 × 31.2 m; 1600 × 1000 px | 6.8 MB |
| `gnis.json` | USGS GNIS map service, layers 5 (Landforms) and 7 (Other Hydrographic Features) | public domain | −93.135, 34.490 → −92.985, 34.550 | points | 5 KB (7 + 10 features) |

DEM elevation ranges (metres, NAVD88): east 117.7–362.8, west 120.1–432.9, downtown 131.3–387.8, region 40.7–431.6.
No NaN/noData pixels in any tile.

### OpenStreetMap (Overpass API)

Endpoint `https://overpass-api.de/api/interpreter` (POST `data=<query>`), mirror fallback
`https://overpass.kumi.systems/api/interpreter` (not needed this time). User-Agent
`HotSpringsGames-TubRally/0.1 (open-source game; contact via github.com/brianm-di4u)`. One request at a time, 10 s
between queries, exponential backoff on 429/5xx (honouring `Retry-After`), and a response whose `remark` reports a
runtime error is treated as a failure. OSM database state (`osm3s.timestamp_osm_base`): 2026-10-30T05:38:34Z,
05:39:37Z, 05:40:42Z.

Query A, roads and water (`osm-roads.json`):
```
[out:json][timeout:120][bbox:34.490,-93.135,34.550,-92.985];
( way["highway"]; way["waterway"]; way["tunnel"="culvert"]; );
out geom;
```
Query B, points of interest (`osm-pois.json`); the last six clauses are extras for the anchor list:
```
[out:json][timeout:120][bbox:34.490,-93.135,34.550,-92.985];
( nwr["amenity"="fountain"]; nwr["natural"="spring"]; nwr["tourism"="viewpoint"]; nwr["man_made"="tower"];
  nwr["historic"]; nwr["tourism"="attraction"]; nwr["leisure"="park"];
  nwr["natural"~"^(peak|rock|stone|cliff|saddle|ridge)$"]; nwr["tourism"~"^(camp_site|picnic_site)$"];
  nwr["amenity"="shelter"]; nwr["place"="square"];
  nwr["name"~"Pagoda|Balanced Rock|Music Mountain|Wheatley|Gulpha|Goat Rock|Overlook|Exchange Street",i]; );
out geom;
```
Query C, downtown buildings (`osm-buildings.json`); parking areas added to find the 128 Exchange St deck:
```
[out:json][timeout:120][bbox:34.500,-93.065,34.525,-93.045];
( nwr["building"]; nwr["amenity"="parking"]; );
out geom;
```

OSM notes and gotchas:
- `out geom` returns **whole ways**, not clipped to the bbox (Park Ave runs on to 34.58 N, Central Ave to 34.47 N).
  The survey clips its statistics to the bbox and reports the full length separately.
- Ways carry both `nodes` (ids, used for topology/junctions) and `geometry` (coordinates).
- Most roads are 2000s TIGER imports (`tiger:*` tags, `tiger:reviewed=no` on many): vertex spacing is coarse on
  the mountain drives (named Hot Springs Mountain Drive: 77 m mean, 202 m max; Park Ave max chord 463 m) and
  `lanes`/`surface`/`maxspeed` are mostly missing. Expect to smooth and hand-adjust splines against the DEM.
- **The lower Hot Springs Mountain Drive is unnamed in OSM**: ways 250875470 (from Fountain St at 34.5186, −93.0492,
  south behind the Row) and 12800909 (switchbacks up to the tower), both `oneway=yes` uphill. Only the summit
  return leg (way 12806757) carries the name. `survey.mjs` lists them by id and warns if they change.
- **West Mountain Summit Drive** exists only as `name_1` on two West Mountain Drive ways (12808452, 12808471).
- Name spellings in OSM: "Blacksnake Road" (not Black Snake), "Cedarglade Road" (not Cedar Glades).
- OSM has **no** Pagoda, no Music Mountain peak, no Hill Wheatley Plaza and no named West Mountain overlooks;
  see `anchors.json` for how each was placed.

### USGS 3DEP DEM

Service `https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/exportImage` (3DEP Bare
Earth DEM dynamic service: a best-available mosaic of 3DEP sources, 1 m lidar where it exists, native pixel 1 m in
Web Mercator; service limit 8000 × 8000 px). Request pattern copied from `repos/hsg-theme-park/tools/geo/fetch.mjs`:
```
exportImage?bbox=W,S,E,N&bboxSR=4326&imageSR=4326&size=W_px,H_px&format=tiff&pixelType=F32&noData=
           &compression=None&interpolation=RSP_BilinearInterpolation&f=image
```
- `dem-east.tif`: bbox −93.04,34.5,−92.985,34.548, size 2750,2400. `dem-west.tif`: bbox −93.135,34.488,−93.075,34.535,
  size 3000,2350. Both came back with exactly the requested extent (checked from the GeoTIFF tags).
- Output is a classic little-endian GeoTIFF, single band float32, **tiled 128 × 128** (edge tiles padded),
  uncompressed, with ModelPixelScale (33550), ModelTiepoint (33922) and GeoKeys (34735; PixelIsArea, EPSG:4326).
  `tools/geo/geo-lib.mjs` `readTiff()` reads tiles and strips and returns the extent from those tags.
- Vertical units metres, NAVD88. Bare earth: buildings and trees are absent, and **bridges read as dips** (the DEM
  is the ground under them), so grades are computed with `bridge=*` ways excluded.

DEM gotchas:
1. **The service widens the extent to keep pixels square in degrees.** The trivia `dem-downtown.tif` asked for
   34.495–34.535 at 2400 × 2100 px and received 34.4909375–34.5390625 (0.048125°, not 0.040°). Mapping rows onto the
   requested box, as `games/trivia/tools/map/geo_raster.py` does, misplaces samples by up to about 50 m north–south:
   the tower reads 308.7 m instead of 315.9 m. Always take the extent from the GeoTIFF tags (the `Dem` class does) or
   request a size whose aspect matches the bbox in degrees (`fetch.mjs` uses 2.0e‑5° on both axes).
2. **Trailer with `format=bip`.** `games/block-puzzle/research/backdrop-notes.md` found that BIP output carries a
   21,600-byte trailer after the W×H floats; reading by file length misaligned the raster by several rows. The TIFF
   output used here has no trailer (file size = header + tiles × 65,536 bytes), and `readTiff()` reads exactly W×H
   values from the tile/strip offsets anyway.
3. Degree-square pixels are not metre-square: 2.0e‑5° is 1.84 m east–west but 2.22 m north–south at 34.52° N.

Coverage: the 2 m tiles cover the race roads except the strip north of 34.535–34.539 west of −93.040, south of
34.488–34.491, and Park Ave beyond 34.548 N; there `Dem` falls back to the ~28 m `dem-region.tif`
(the per-road DEM tile counts are in the survey).

Sanity checks (bilinear, finest tile):

| Point | DEM | Expected | Tile |
|---|---|---|---|
| Hot Springs Mountain Tower ground, 34.51723, −93.04611 | 315.9 m = 1,036 ft | ≈ 316 m / 1,036 ft (USGS EPQS 1 m lidar, block-puzzle notes) | dem-downtown |
| Central Ave in front of the Fordyce, 34.51373, −93.05375 | 185.1 m = 607 ft | ≈ 185 m / 608 ft | dem-downtown |
| West Mountain (GNIS 58856) summit | 432.3 m = 1,418 ft | OSM ele 433; SummitPost 1,418 ft | dem-west |
| Tile seams (downtown vs east at −93.035/−93.030; downtown vs west at −93.078/−93.077) | agree within 0.1 m | — | — |

### USGS GNIS

`https://carto.nationalmap.gov/arcgis/rest/services/geonames/MapServer/{5,7}/query` with an envelope query over the
survey bbox, `outSR=4326`. Layer 5 (Landforms) gives the summits of Hot Springs, North, West and Sugarloaf mountains,
plus Music Mountain and Indian Mountain as **Ridges** (two points each, no summit) and The Gorge as a Valley.
Layer 7 adds springs and small reservoirs (Whittington Spring, Big Chalybeate Spring, …). Cultural features
(campgrounds, overlooks, towers) are no longer in GNIS.

### Other references used for the anchors (not downloaded)

- NPS, *Scenic Drives & Overlooks*, <https://home.nps.gov/hosp/planyourvisit/scenic-overlooks.htm>: the Hot Springs
  Mountain drive "starts at the end of Fountain Street", climbs to a picnic area, the Pagoda overlook and the tower,
  and returns by North Mountain Loop; West Mountain Drive has entrances on Prospect and Whittington avenues and leads
  to the Summit Loop with the Lower, Picnic and Loop overlooks; Goat Rock overlook is on North Mountain; Balanced
  Rock overlook is on the Sugarloaf ridge, reached by the Sunset Trail.
- NPS Public POIs (`https://mapservices.nps.gov/arcgis/rest/services/NationalDatasets/NPS_Public_POIs_Geographic/FeatureServer/0`):
  queried once to cross-check; only 12 unnamed HOSP points (campground 34.524357, −93.036041; picnic area by the
  tower 34.515777, −93.047974; visitor center at the Fordyce).
- Hot Springs Guides, *Hill Wheatley Plaza Jug Fountain*,
  <https://www.hotspringsguides.com/hot-springs/hill-wheatley-plaza-jug-fountain-hot-arkansas>: 629 Central Ave,
  fountain "directly in front of the city visitor center". Its GPS (34.5014, −93.0551) contradicts the address and
  was not used.
- Corpus cross-checks: `research/bathhouse-row-layout.md` (bathhouse centroids, culvert), `games/trivia/research/geo-anchors.json`,
  `games/block-puzzle/research/backdrop-notes.md`.

## Local metric frame

`tools/geo/geo-lib.mjs` `project(lon, lat) → {x, z}` and `unproject(x, z)`: equirectangular about the Bathhouse Row
reference point **lon −93.0536, lat 34.5139** (the NRHP district point 34.513889, −93.053611, rounded; the origin of
`research/bathhouse-row-layout.md`). x = metres east; **z = metres south**, so −z is north in a right-handed Y-up
three.js world. Metres per degree are the WGS84 values at lat0: 110,931.7 m per degree of latitude and
91,824.7 m per degree of longitude. Over the 14 × 7 km race area the flat-frame error is under 0.1%.
