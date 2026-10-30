# Hot Springs Mountain Drive (`hs-mountain`) — course notes

Ouachita Cup, national park. Spec `tracks/hs-mountain.spec.json`, route `tracks/hs-mountain.route.json`, baked
`data/tracks/hs-mountain.json`. Roads © OpenStreetMap contributors (ODbL); elevation USGS 3DEP.

## Roads, in driving order

| # | Road (OSM name) | Real m | Game m | Notes |
|---|---|---|---|---|
| 1 | Fountain Street, top end (way 12810305) | 44 | 5 | Start/finish line at node 117167223, 40 m before the junction where the drive leaves Fountain St (node 117072272, "the end of Fountain Street"). The 141 m of Fountain St before the line is pinned at true scale (grid straight). |
| 2 | Hot Springs Mountain Drive, lower climb (unnamed in OSM: ways 250875470, 12800909; one-way) | 2,248 | 503 | Leaves Fountain St through the turnaround loop at the top of the street, runs south along the hillside, then climbs the seven switchbacks east to the Peak Trail junction and the Pagoda. |
| 3 | North Mountain Drive (ways 12803332, 12803331, 12803330) | 994 | 163 | Past the Tower and over the summit (the summit spur, one-way), then north-east along the ridge to the Fountain St / North Mountain Loop junction. |
| 4 | Fountain Street, upper (way 250875465; one-way down) | 1,179 | 379 | The zigzags below North Mountain, then the long straight back down to the start. |

Routed with profile `road1` (all one-ways in their legal direction; this is the real one-way scenic loop). Real lap
4,465 m → game 1,050 m. The North Mountain Loop is not used: it hangs off a 128 m two-way connector that would have to
be driven twice (it is used by `goat-rock-gulpha` instead).

## Facts used (with sources)

- The drive begins at the end of Fountain Street, was built as a carriage road in the 1880s, and its switchbacks climb
  to a picnic area, the Pagoda (J. G. Horn, 1911) and the Hot Springs Mountain Tower — NPS "Scenic Drives &
  Overlooks" (home.nps.gov/hosp/planyourvisit/scenic-overlooks.htm), via `research/town-content.md` §4.
- Tower: deck 216 ft above the mountain, 1,256 ft above sea level; the 1877 wooden tower was rebuilt in steel in 1982 —
  same NPS page, `town-content.md` §4. Tower ground ≈ 1,036 ft (USGS EPQS, `geography-lakes-mountains.md` via
  `town-content.md` §4); the DEM at the OSM footprint gives 314.8 m (1,033 ft) (`research/geo/anchors.json`).
- Road geometry, one-way tags, the 5.8 km scenic loop and the "lower climb is unnamed in OSM" note —
  `research/geo/road-survey.md` (Loop checks; per-road detail).
- Thermal spring below Tufa Terrace (OSM node 11247323163, 34.515844, -93.052314), 35 m west of the first leg —
  `road-survey.md`, POIs. It names the first refill zone.

## Honest distortions

- **Compression** (route meta): straights ks = 0.085, turns kt = 0.291, elevation kv = 0.163; pinned 141 m (Fountain St
  start straight). The real loop is 4.3× longer than the game lap, so the switchback legs shrink to a few metres and
  the seven hairpins become a serpentine of alternating 180° bends, the Fountain zigzags a run of S-bends.
- **Smoothing**: the route is smoothed with σ = 40 m before compression. This erases the little 360° turnaround loop at
  the top of Fountain Street (driven as a gentle S-bend) and softens the upper Fountain zigzags.
- **Hairpins** widened to a 17 m route minimum radius (baked minimum 13.5 m; the real hairpins are ≈ 10 m).
- **Elevation**: real climb 204 → 317 m (113 m); game climb ≈ 17.5 m (kv 0.163, capped so no grade exceeds 14%).
- **Width**: one-lane park roads widened to 12 m.
- **Water**: the spring is real but sits beside the road; the full-width "runoff across the drive" refill and the
  "Fountain Street water buckets" refill are game.
- **Limits**: `limType: auto` everywhere, but with kv = 0.16 the DEM cross-sections are flattened to ±1 m at 14 m, so
  auto resolves to soft limits along the whole lap (no rock walls or rails are drawn; see the report).
- No buildings, no game-course links.

## Anchors for landmark models later

Models `hs-tower` and `pagoda` now exist in `art-src/models.json` (pack `mountain`), but per the brief the spec has no
`landmarks` yet. Game s is metres from the start line; d is signed metres (right of travel +) from the real centreline.

| Landmark | Anchor / lat, lon | Game s / d | Ready-to-paste landmark |
|---|---|---|---|
| Hot Springs Mountain Tower | `hot-springs-mountain-tower` (34.517274, -93.046218) | 517 / −28 (left) | `{"id":"tower","model":"hs-tower","anchor":"hot-springs-mountain-tower","street":"North Mountain Drive"}` |
| The Pagoda (overlook) | `pagoda` (34.516555, -93.046020, approx) | 505 / +8 (right) | `{"id":"pagoda","model":"pagoda","anchor":"pagoda"}` |
| Hot Springs Mountain summit | `hot-springs-mountain-summit` | 522 / 0 | (marker only) |
| Picnic area shelter | OSM way 1352083242 (34.519036, -93.046803) | off course: 120 m west of the drive near s ≈ 500; it is on the named Hot Springs Mountain Drive (see `sunset-ridge`) | — |
| Thermal spring below Tufa Terrace | node 11247323163 | 76 / +34 | spring prop / steam |
