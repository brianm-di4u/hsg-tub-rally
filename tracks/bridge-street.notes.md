# Bridge Street Bash (`bridge-street`) — course notes

Bathhouse Cup, downtown south end. Spec `tracks/bridge-street.spec.json`, route `tracks/bridge-street.route.json`,
baked `data/tracks/bridge-street.json`. Streets © OpenStreetMap contributors (ODbL); elevation USGS 3DEP.

## Streets, in driving order (clockwise)

| # | Street | Real m (route) | Game m | Notes |
|---|---|---|---|---|
| 1 | Central Avenue, south from Reserve St / Interior Court | ≈ 250 | ≈ 180 | start line at Hill Wheatley Plaza; Reserve → plaza pinned at true scale |
| 2 | Bridge Street, Central → Malvern | 54 | ≈ 54 | **true scale** (OSM way 12805886) |
| 3 | Malvern Avenue, south-east toward the Pleasant Street district | ≈ 367 | ≈ 109 | |
| 4 | Creek Street | 87 | ≈ 87 | true scale (two right-angle corners) |
| 5 | Broadway Terrace, north-west past the Hot Springs Creek outfall | ≈ 200 | ≈ 125 | |
| 6 | Market Street, around the Transportation Depot (pinned) and west across Central | ≈ 440 | ≈ 190 | crosses Central at grade |
| 7 | Quapaw Avenue, north | ≈ 160 | ≈ 93 | |
| 8 | Prospect Avenue, north-east | ≈ 145 | ≈ 71 | |
| 9 | Exchange Street, north (Prospect → Interior Court) | ≈ 98 | ≈ 65 | |
| 10 | Interior Court, east to Central | 78 | ≈ 50 | |

Routed with profile `road1` (oneway respected). Real lap 1,864.5 m → game 1,020 m.

## Facts used (with sources)

- Bridge Street runs east–west from Central to the start of Malvern Ave; its length is famously "98 ft 11 in", while
  the OSM centreline is ≈ 179 ft (54 m) — show both, sign reads "famously the shortest street" —
  `research/town-content.md` §4 and §7; `C:\Video Game Projects\research\bathhouse-row-layout.md` §7.
- The World's Shortest St. Patrick's Day Parade has run on Bridge Street since 2004 — `town-content.md` §4;
  `research/culture-events-food.md`. Hence the crowd, flags and the biggest spectator-blaster rate on Bridge St.
- Malvern Ave runs south-east past the Pleasant Street district — `town-content.md` §4; Pleasant Street HD
  ("Black Broadway"), NRHP 2003 — `research/downtown-and-landmarks.md`.
- Hot Springs Creek runs in a culvert under Central and comes into the open near 34.5073, -93.0520 (beside Broadway
  Terrace) — `town-content.md` §4; `bathhouse-row-layout.md` §6. Used for the "creek outfall" refill lane.
- Tubs are judged on Friday at Hill Wheatley Plaza, which has a thermal-water jug fountain — `town-content.md` §1
  and §4 (2026 rules; hotspringsguides listing). Address conflict 605 vs 629 Central: say "one block south of the
  Row", no number (`town-content.md` §7). Start line and refill lane are here.
- The 2016 race finished at the crosswalk at the Exchange Street Parking Plaza — `town-content.md` §1
  (Sentinel-Record, 2016-06-05). The lap runs up Exchange Street; see distortions for why the plaza block itself
  is not on the lap.

## Honest distortions

- **Compression** (route meta): straights ks = 0.275, turns kt = 0.524, elevation kv = 0.439. Pinned at true scale
  (436 m): Central Ave from Reserve St to Hill Wheatley Plaza (start straight), Bridge Street, Creek Street, and the
  Market Street bend around the Transportation Depot. Malvern Avenue is the most compressed street (367 m → ~109 m).
- **Widths**: Central 18 m, Bridge and Malvern 15 m, Creek 14 m, Exchange/Prospect/Interior Court 13 m, others 12 m.
- **Exchange Street Parking Plaza is ~130 m north of the lap.** An earlier version ran all of Exchange Street,
  Mountain Street and Central past the Row so the start could sit on the 2016 finish crosswalk; compressed, the
  block between Exchange and Central became too narrow and six real footprints (Gangster Museum, Duck Tours and
  others) ended up straddling the road. The current lap turns onto Interior Court instead. (The checker did not
  catch the overlap; see the report.)
- **Market Street return**: the lap drives Market St west across Central and comes back north on Quapaw Ave and
  Prospect Ave, rather than a block of Central northbound, which would squeeze a multi-storey garage onto the road.
- **Creek outfall refill** is game styling: the creek leaves its culvert beside Broadway Terrace, not on it.
- Buildings: 32 OSM footprints moved onto the compressed course (side, order and setback kept); checked by polygon
  interior, none over the road or the run-off band.

## Anchors for landmark models later

No models exist for these yet (`art-src/models.json` holds only the Row, the Admin Building and the Arlington).
Game s is metres from the start line; side is from the driver's seat.

| Landmark | lat, lon | Game s / side | Confidence |
|---|---|---|---|
| Hill Wheatley Plaza (`hill-wheatley-plaza` anchor) | 34.510600, -93.053726 | s ≈ 0, left, 27 m | approx (anchors.json) |
| Bridge Street sign / midpoint | 34.509449, -93.053737 | s ≈ 71–100 | OSM way midpoint |
| Malco Theatre (817 Central) | 34.508967, -93.054236 (NRHP) vs 34.510556, -93.054167 (Wikipedia) | s ≈ 45, right, 52 m (NRHP point) | **coordinate conflict** (`bathhouse-row-layout.md` §7) |
| Hot Springs Creek outfall | 34.507257, -93.052004 | s ≈ 338, left, 11 m | OSM-derived |
| Transportation Depot | ≈ 34.50747, -93.05271 | s ≈ 398, left, 29 m | OSM building centroid |
| Woodmen of Union Building (501 Malvern) | 34.506944, -93.049444 | s ≈ 207, left, ~90 m (just past the Creek St corner) | NRHP list |
| Exchange Street Parking Plaza (`exchange-street-parking-plaza` anchor) | 34.512750, -93.055013 | off the lap, ~130 m north of the Interior Court corner (s ≈ 860) | OSM footprint centroid |
