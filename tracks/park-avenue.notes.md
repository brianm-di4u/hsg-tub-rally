# Park Avenue Nights (`park-avenue`) — course notes

Bathhouse Cup, downtown. Spec `tracks/park-avenue.spec.json`, route `tracks/park-avenue.route.json`, baked
`data/tracks/park-avenue.json`. Streets © OpenStreetMap contributors (ODbL); elevation USGS 3DEP.

## Streets, in driving order (counter-clockwise)

| # | Street | Real m (route) | Game m | Notes |
|---|---|---|---|---|
| 1 | Park Avenue, north from the Y | ≈ 430 | ≈ 268 | 3-lane primary; the Velda Rose → Vapors block is pinned at true scale (231 m). Start line here, between the Velda Rose (218) and the Vapors (315). |
| 2 | Glade Street | ≈ 60–76 | ≈ 46 | short link west off Park Ave to Amber St |
| 3 | Amber Street | ≈ 616 | ≈ 318 | residential street along the hillside, heading west |
| 4 | Cedar Street | ≈ 648 | ≈ 315 | residential, back down south-east to the Y |
| 5 | The Y (Whittington Ave → Central Ave → Park Ave links) | ≈ 165 | ≈ 50 | hairpin through the Central/Park/Whittington junction, past the fountain at the Y |

Routed with profile `road1` (oneway respected; the Y's links are taken in their legal direction). Real lap
1,936.7 m → game 1,000 m. Per-street figures come from the route map's street labels, which lag the true junctions
by a few metres.

## Facts used (with sources)

- Park Ave runs about 5,000 ft north, then north-east, from the Arlington "Y" — `research/town-content.md` §4;
  `C:\Video Game Projects\research\bathhouse-row-layout.md` §7.
- The Vapors, 315 Park Ave: built 1959–60 by Dane Harris with Owney Madden (and Harry Hastings), opened 1960 —
  `research/gangster-era-and-gambling.md` (EOA "Vapors"); `town-content.md` §4. (Per `town-content.md` §6 the club's
  violent history is not used as game flavour.)
- Velda Rose Tower Motor Hotel, 218 Park Ave (listing gives 217), 1960 or 1963 (conflict), NRHP 2024, 34.5210,
  -93.0555 — `research/downtown-and-landmarks.md`.
- Motor courts line 311–1011 Park Ave — `bathhouse-row-layout.md` §7.
- Neon and the dusk sky are game styling — `town-content.md` §4.
- A fountain stands at the Y (OSM node 11666000281, 34.518631, -93.055930) — `research/geo/road-survey.md`, POIs.
  It feeds the refill lane ("Fountain at the Y").

## Honest distortions

- **Compression** (route meta): straights ks = 0.366, turns kt = 0.605, elevation kv = 0.687 (real max grade over the
  compressed distance was 17.5%; the game caps it at 12%). Pinned: 231 m of Park Ave at true scale.
- **Widths**: Park Ave 17 m (3 lanes); Amber, Glade and Cedar Streets are narrow residential streets widened to 12 m.
- **The Y** is squeezed into one 150° hairpin (minimum radius 11 m); in reality it is a small triangle of one-way links.
- **Return road**: there is no road back from upper Park Ave to the Y except Cedar Street (or Pine Street, which
  meets Whittington Ave 100 m west of the Y); the loop uses Glade/Amber/Cedar, all real streets in real order. No
  game-course links.
- **Buildings**: OSM footprints moved onto the compressed course, keeping their side, order and setback; none are
  named here, so they are generic stand-ins. Two footprints poke slightly into the run-off band (≤ 25 m²), none
  over the road.
- **Vapors position is approximate** (see anchors).

## Anchors for landmark models later

None of these has a model in `art-src/models.json` yet, so the spec has no `landmarks`. Game s is metres from the
start line along the lap; side is from the driver's seat.

| Landmark | lat, lon | Game s / side | Confidence |
|---|---|---|---|
| The Vapors (315 Park Ave) | 34.52153, -93.05451 | s ≈ 65, right, 52 m off the line | **approximate**: the largest east-side OSM footprint in the 300 block (odd numbers are on the east side, Velda Rose 218 is opposite); not geocoded |
| Velda Rose Tower (218 Park Ave) | 34.5210, -93.0555 | s ≈ 977 (just before the line), left, 12 m | NRHP list (via `downtown-and-landmarks.md`) |
| Fountain at the Y | 34.518631, -93.055930 | s ≈ 826, left, 7 m | OSM node |
| Saint Mary of the Springs church (100 Central Ave) | 34.518185, -93.056329 | s ≈ 810, right, 37 m | OSM building |
| The Arlington (`arlington` anchor, model exists) | 34.516933, -93.052907 | not on this lap (≈ 340 m down Central from the Y) | could be a skyline prop at the hairpin |
| Hot Springs Creek culvert head under Park Ave | 34.52243, -93.05527 | s ≈ 101, left, 57 m | OSM (`bathhouse-row-layout.md` §6) |
