# Whittington Valley (`whittington-valley`) — course notes

Bathhouse Cup, downtown edge. Spec `tracks/whittington-valley.spec.json`, route `tracks/whittington-valley.route.json`,
baked `data/tracks/whittington-valley.json`. Streets © OpenStreetMap contributors (ODbL); elevation USGS 3DEP.

## Streets, in driving order (counter-clockwise around Whittington Park)

| # | Street | Real m (route) | Game m | Notes |
|---|---|---|---|---|
| 1 | Whittington Avenue, eastbound carriageway (OSM 286815112, 1422561499) | ≈ 1,040 | ≈ 380 | start line near the West Mountain Drive entrance (Brook Drive), heading east and downhill toward town |
| 2 | U-turn into the westbound carriageway at the east end of the median (OSM 1422561498) | ≈ 80 | ≈ 45 | real one-way link; a hairpin in the game |
| 3 | Whittington Avenue, westbound carriageway (OSM 1422561495, 12809350) | ≈ 1,070 | ≈ 400 | climbs west along the median park; past Tiny Town (374) |
| 4 | Woodfin Street (top end) and the parking-lot service roads (OSM 838044153, 839257232/233, 878212245/244, 839257230) | ≈ 335 | ≈ 165 | through the Weyerhaeuser lot on the old Whittington Park ballpark site, one-way in the driven direction |
| 5 | Whittington Avenue, undivided section past the Alligator Farm, back into the eastbound carriageway | ≈ 105 + | (in 1) | |

Routed with profile `road1` (oneway respected everywhere). Real lap 2,553.9 m → game 1,000 m.

## Facts used (with sources)

- Whittington Ave runs about 1.1 mi west from the Y up the Whittington valley to the Arkansas Alligator Farm (847)
  and the Ban Johnson field site (870); valley floor ≈ 693 ft — `research/town-content.md` §4;
  `C:\Video Game Projects\research\bathhouse-row-layout.md` §7; `baseball-spring-training.md`.
- Whittington Park ballpark opened 1894, was renamed Ban Johnson Park in 1935; today it is a Weyerhaeuser asphalt
  parking lot with a home-plate marker in its north-west corner (Wikipedia, RoadsideAmerica via
  `baseball-spring-training.md`). The lap drives through that lot.
- The park was directly across the avenue from the Alligator Farm; Babe Ruth's March 17, 1918 home run (estimated
  573 ft, not certain) landed in the farm — `baseball-spring-training.md` (hedged there; use hedged).
- The district lies between West Mountain and Sugarloaf Mountain (EoA via `baseball-spring-training.md`).
- "Whittington Park" is also the NPS/city greenway along Whittington Creek (iron fence, stone gate pillars, 1910
  concrete bridges) — NPS via `baseball-spring-training.md`. OSM maps the "Whittington Park" park polygons in the
  median between the two carriageways (34.51647, -93.06261 and 34.51583, -93.06863), so the lap circles it.
- A "Whittington Park Speedway" ran in the valley from 1947 — single source, hedged (`town-content.md` §4); not used
  in game text.

## Honest distortions

- **Compression** (route meta): straights ks = 0.355, turns kt = 0.596, elevation kv = 0.616 (climb 10.4 m in game);
  no pinned stretches. Each 1 km carriageway becomes about 400 m, and the median shrinks from 40–90 m to about 43 m
  between centrelines (limit bands stay ≥ 17 m apart, so no cutting across).
- **The Y is not on the lap.** The lap starts about 0.6 km west of the Y. A loop from the Y needs a second road
  back into it, and the only ones are Cedar Street (already Park Avenue Nights' return) or Pine Street (which joins
  Whittington Ave 100 m west of the Y, so that 100 m would be driven both ways and the road edges would overlap).
  The valley's own dual carriageway gives a real loop with no reuse.
- **Game course**: the Weyerhaeuser parking-lot service roads (a private lot, not a public street) are raced. The
  lot's right-angle aisles are smoothed into one ≥ 18 m-radius bend.
- **Widths**: each carriageway is one lane (~6 m) in reality, 13 m in game; the lot aisles 14 m.
- **Whittington Creek splash lane** (refill on the median side of the westbound carriageway) is game styling; the
  creek runs through the median park, but not onto the road.
- Only two OSM buildings fall near the lap (the valley is mostly unmapped houses and woods); trees stand in for the
  rest.

## Anchors for landmark models later

No models exist for these yet. Game s is metres from the start line; side is from the driver's seat.

| Landmark | lat, lon | Game s / side | Confidence |
|---|---|---|---|
| Whittington Park / Ban Johnson Park home-plate marker (Baseball Trail marker #8) | 34.515862, -93.074292 | s ≈ 682, right, 47 m (north edge of the lot) | confirmed (Waymarking, Trail site via `baseball-spring-training.md`) |
| Arkansas Alligator Farm (847 Whittington Ave) | ≈ 34.5150, -93.0732 | s ≈ 715–760, right (south side of the avenue, opposite the lot exit) | **approximate**: not in OSM; "directly across the street" from the ballpark; needs a geocode |
| Whittington Park Historic District (NRHP point) | 34.51662, -93.06577 | s ≈ 372, right, 31 m | NRHP list |
| Tiny Town (374 Whittington Ave) | 34.516852, -93.062318 | s ≈ 257, right, 14 m | OSM attraction |
| West Mountain Drive entrance | 34.515771, -93.066187 | s ≈ 989, left (at the start straight) | `bathhouse-row-layout.md` / survey |
| Median greenway (Whittington Park, 1910 concrete bridges) | 34.51647, -93.06261 / 34.51583, -93.06863 | inside the loop (left on both carriageways) | OSM park polygons; bridge positions not mapped |
