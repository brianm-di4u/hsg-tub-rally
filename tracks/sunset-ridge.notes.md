# Sunset Ridge (`sunset-ridge`) — course notes (fallback course)

Ouachita Cup, national park. Spec `tracks/sunset-ridge.spec.json`, route `tracks/sunset-ridge.route.json`, baked
`data/tracks/sunset-ridge.json`. Roads © OpenStreetMap contributors (ODbL); elevation USGS 3DEP.

## The fallback, and why

The brief's roads (Blacksnake Road, Cedarglade Road, Music Mountain Road around Sugarloaf) do not make a good 1 km
course:

- They only form loops of 13–17 km (`research/geo/road-survey.md`: Whittington → Black Snake → Turkey Trot → Cedar
  Glades → the Y is 16.9 km; Black Snake ↔ Music Mountain needs Bull Bayou Rd and Albert Pike, with 27% grades).
  Music Mountain Road is a dead end off Albert Pike Road.
- The shortest loop that reaches Sugarloaf and Balanced Rock is 9.7 km: the Sunset Trail's Sugarloaf section (a 4.1 km
  footpath, the only way past Balanced Rock, connected to roads only at its two ends) plus Cedarglade Rd 0.7 km,
  Cedar St and 4.1 km of Whittington Avenue. Black Snake Road appears for 8 m. Routed and compressed it came out at
  ks 0.084, kv 0.065 (a flat 1 km blob), so it was dropped.

So, as the brief allows, this is a fallback over Hot Springs Mountain. A long "Grand Tour" lap of the mountain is
already `hs-mountain` (Fountain Street, the switchbacks, the Tower, North Mountain Drive), and every bigger Hot Springs
Mountain loop either repeats those roads or needs the North Mountain Loop's two-way connector twice. The fallback is
therefore the **summit circuit** — the one Hot Springs Mountain loop `hs-mountain` does not use, and the only one that
drives the road OSM actually names "Hot Springs Mountain Drive" — raced at sunset, heading south-west into the setting
sun. A true one-lap "Grand Tour" (one long lap per race) cannot pass the checker, which always races 3 laps inside a
420 s cap with the spec's per-lap window (see report).

## Roads, in driving order

| # | Way (OSM name) | Real m | Game m | Notes |
|---|---|---|---|---|
| 1 | Hot Springs Mountain Drive (12806757, one-way) | 586 | 324 | Start/finish on its long straight; south-west along the west flank past the picnic area to the Peak Trail junction |
| 2 | lower climb end (unnamed, 12800909, one-way) | 228 | 144 | the last 225 m of the switchback road, up to the Pagoda |
| 3 | North Mountain Drive (12803332 summit spur, 12803331; one-way) | 706 | 378 | past the Tower, over the summit, north-east to the top of Hot Springs Mountain Drive |
| 4 | Hot Springs Mountain Drive (12806757) | 258 | 154 | back round to the line |

Routed with `road1` (the survey's 1,779 m "summit circuit", every one-way legal). Real lap 1,778 m → game 1,000 m.

## Facts used (with sources)

- Switchbacks climb to a picnic area, the Pagoda (J. G. Horn, 1911) and the Hot Springs Mountain Tower (deck 216 ft
  above the mountain, 1,256 ft ASL; steel tower of 1982 replacing the 1877 wooden one) — NPS "Scenic Drives &
  Overlooks", via `research/town-content.md` §4. Tower ground ≈ 1,036 ft (USGS EPQS).
- Summit circuit topology and one-way tags — `research/geo/road-survey.md` (Loop checks).
- Sunset Trail, Sugarloaf section with Balanced Rock (novaculite), Music Mountain 1,405 ft (NPS) — NPS Sunset Trail
  page via `town-content.md` §4; used only to explain the fallback.
- Sunset sky and lighting are game styling.

## Honest distortions

- **Compression** (route meta): ks = 0.504, kt = 0.710, kv = 0.522; nothing pinned. The shape is close to the real one
  (two parallel roads ≈ 100 m apart become ≈ 55 m apart). Smoothing σ = 20 m.
- **Elevation**: real 276–318 m (42 m); game ≈ 21 m (kv 0.522, grades capped at 12% so the heavy cast-iron tubs are not
  shut out of the win share on the climb to the Tower).
- **Width**: one-lane roads widened to 12 m.
- **Water**: "Picnic-area water spigot" and "Tower plaza water fountain" refills are game.
- **Limits**: with kv 0.52 `limType: auto` works here: 49% of the left edge is rock wall (uphill), 60% of the right edge
  guard rail (downhill), the rest soft.
- The track card blurb in `src/js/data/tracks.js` ("Sugarloaf ridge roads and Balanced Rock at sunset") no longer
  matches; it needs updating by whoever owns `src/`.
- Shares the Pagoda–Tower stretch with `hs-mountain` and `goat-rock-gulpha`.

## Anchors for landmark models later

Models `hs-tower` and `pagoda` exist (`balanced-rock` too, but Balanced Rock is not on this course); the spec has no
`landmarks` per the brief.

| Landmark | Anchor / lat, lon | Game s / d | Ready-to-paste landmark |
|---|---|---|---|
| Hot Springs Mountain Tower | `hot-springs-mountain-tower` | 496 / −28 (left) | `{"id":"tower","model":"hs-tower","anchor":"hot-springs-mountain-tower","street":"North Mountain Drive"}` |
| The Pagoda | `pagoda` (approx) | 457 / +8 (right) | `{"id":"pagoda","model":"pagoda","anchor":"pagoda"}` |
| Hot Springs Mountain summit | `hot-springs-mountain-summit` | 525 / 0 | (marker) |
| Picnic area shelter | OSM way 1352083242 (34.519036, -93.046803) | 123 / +93 (right) | picnic shelter + tables |
| Peak Trail junction (foot of the climb) | 34.51658, -93.04808 | 275 / 0 | trail sign |
