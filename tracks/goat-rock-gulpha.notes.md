# Goat Rock & Gulpha Gorge (`goat-rock-gulpha`) — course notes

Ouachita Cup, national park. Spec `tracks/goat-rock-gulpha.spec.json`, route `tracks/goat-rock-gulpha.route.json`,
baked `data/tracks/goat-rock-gulpha.json`. Roads and trails © OpenStreetMap contributors (ODbL); elevation USGS 3DEP.

## What I chose, and why

No road joins Goat Rock to Gulpha Gorge (`research/geo/road-survey.md`: 8,973 m by road through downtown, 1,275 m by
trail). Worse for a loop, every trail route from North Mountain to the campground funnels through the same 600 m of the
Gulpha Gorge Trail (junction with the Goat Rock Trail → Oertel Trail junction → Sunset Trail junction → campground), so
a short loop would have to drive that stretch twice in opposite directions. The route tool can only follow OSM ways,
so a fictional link could not be drawn either.

The course is therefore a **compressed real loop** (6,982 m → 1,050 m) in which the footpath sections are **game course**
(racing on real trails): down from North Mountain past Goat Rock by the Goat Rock and Gulpha Gorge trails, through the
campground, and back up the east flank of Hot Springs Mountain by town streets and trails. It is the shortest loop the
survey graph allows that reaches both Goat Rock and the campground without reusing a way (checked with a shortest-path
search that excludes the Gulpha Gorge Trail: 4.7 km from the campground back to the North Mountain Loop).

## Roads and trails, in driving order

| # | Way (OSM name) | Real m | Game m | Type |
|---|---|---|---|---|
| 1 | North Mountain Drive (12803331, 12803330) | 544 | 55 | park road; start/finish on the straight above the Pagoda, the 135 m before the line pinned at true scale |
| 2 | connector (unnamed, 250875473) | 174 | 19 | park road |
| 3 | North Mountain Loop, east side (12801681, one-way) | 282 | 27 | park road |
| 4 | Goat Rock Trail (626283168) | 1,550 | 224 | footpath — **game course**; passes the 62 m spur to the Goat Rock overlook |
| 5 | Gulpha Gorge Trail (626283164) | 706 | 120 | footpath — **game course**; drops into the gorge and crosses Gulpha Creek (ford) |
| 6 | Gulpha Gorge Campground lanes (unnamed: 12797546, 517972533) | 452 | 26 | campground road |
| 7 | Gorge Road (12816000, 1076712300, 1076712299) | 410 | 50 | park road; bridge over Gulpha Creek by the picnic grounds (ford in game) |
| 8 | East Grand Avenue + a 108 m ramp (motorway_link) | 668 | 107 | town (US 70) |
| 9 | Coy Street | 264 | 45 | town residential |
| 10 | footpath (982266799), Oertel Trail, Short Cut Trail, Hot Springs Mountain Trail | 1,360 | 214 | footpaths — **game course** |
| 11 | Hot Springs Mountain Drive, lower climb end (12800909) → Pagoda | 144 | 8 | park road |
| 12 | North Mountain Drive (12803331) back to the line | 428 | 154 | park road |

Road legs routed with `road1` (one-ways legal: the North Mountain Loop and the campground lanes are one-way), trail legs
with `any`. Total footpath share: 3,616 m of 6,982 m (52%) real, 558 m of 1,050 m game.

## Facts used (with sources)

- Goat Rock Overlook on North Mountain looks over the Zigzag Mountains (the springs' recharge zone) and Indian (Silver)
  Mountain with its novaculite — NPS "Scenic Drives & Overlooks", via `research/town-content.md` §4.
- Gulpha Gorge Campground: 40 sites along Gulpha Creek — NPS, via `town-content.md` §4.
- Goat Rock overlook (OSM node 4465433144, 268 m), campground footprint, Gulpha Creek, Gorge Road bridges, trail
  network and the "no road between them" finding — `research/geo/road-survey.md` (loop checks, link checks, POIs) and
  `research/geo/anchors.json`.

## Honest distortions

- **Compression** (route meta): ks = 0.100, kt = 0.317, kv = 0.082; pinned 135 m. The real loop is 6.6× the lap, so the
  shape is impressionistic: the campground lanes shrink to ≈ 26 m and the Goat Rock Trail's long northern bend to a few
  S-bends. Smoothing σ = 80 m (trail zigzags simplified), route minimum radius 17 m (baked 15 m).
- **Elevation**: real 157–322 m (165 m of relief); game ≈ 13 m (kv 0.082, grades capped at 14%).
- **Footpaths raced as 11 m dirt roads** (Goat Rock, Gulpha Gorge, Oertel, Short Cut and Hot Springs Mountain trails):
  game course. The town leg (East Grand Ave, Coy St) is real but is the price of closing the loop.
- **Fords**: the Gulpha Gorge Trail really crosses Gulpha Creek (footpath crossing); Gorge Road crosses it on a
  bridge, raced as a ford (game). The campers' water-blaster crowd zone is game.
- **Width**: one-lane roads and trails widened to 11–12 m; East Grand Ave narrowed to 14 m.
- **Limits**: `limType: auto` resolves to soft limits everywhere (kv too small for the auto thresholds; see report).
- Shares the Pagoda corner and North Mountain Drive with `hs-mountain`.

## Anchors for landmark models later

Models `goat-rock`, `hs-tower` and `pagoda` exist in `art-src/models.json`; the spec has no `landmarks` per the brief.

| Landmark | Anchor / lat, lon | Game s / d | Ready-to-paste landmark |
|---|---|---|---|
| Goat Rock overlook (novaculite) | `goat-rock-overlook` (34.527262, -93.039179) | 267 / +8 (right) | `{"id":"goat-rock","model":"goat-rock","anchor":"goat-rock-overlook","street":"Goat Rock Trail"}` |
| North Mountain summit | `north-mountain-summit` | 91 / −84 (left) | (marker) |
| Gulpha Gorge Campground | `gulpha-gorge-campground` (34.524285, -93.036588) | 455 / −16 (left) | tents, picnic tables, fire rings |
| Gulpha Gorge Picnic Grounds | OSM (34.5219, -93.0360) | 479 / +65 (right) | picnic shelter |
| The Pagoda | `pagoda` | 896 / 0 | `{"id":"pagoda","model":"pagoda","anchor":"pagoda"}` |
| Hot Springs Mountain Tower | `hot-springs-mountain-tower` | 890 / −63 (left, skyline) | `{"id":"tower","model":"hs-tower","anchor":"hot-springs-mountain-tower"}` |
