# West Mountain Summit (`west-mountain`) — course notes

Ouachita Cup, national park. Spec `tracks/west-mountain.spec.json`, route `tracks/west-mountain.route.json`, baked
`data/tracks/west-mountain.json`. Roads and trails © OpenStreetMap contributors (ODbL); elevation USGS 3DEP.

## Roads, in driving order (from the start line)

| # | Way (OSM name) | Real m | Game m | Notes |
|---|---|---|---|---|
| 1 | West Mountain Drive, summit ridge (12808452) and the end loop (12808471) | 108 | 30 | Start/finish on the ridge straight just before the Trap Mountains / Lake Hamilton overlook |
| 2 | Sunset Trail, its last 240 m (517966979) | 240 | 77 | footpath — **game course**; the trail's east end is at the summit end loop |
| 3 | Mountain Top Trail (250875468) | 924 | 223 | footpath — **game course**; descends south-east to Prospect Avenue |
| 4 | Prospect Avenue | 10 | 12 | the Prospect Avenue entrance |
| 5 | West Mountain Drive (12808452): the climb north-east, past the Whittington-leg junction and the two Row-view overlooks, the switchback at the north-east end, then south-west along the summit ridge | 2,654 | 658 | two-way park road |

Real lap 3,936 m → game 1,000 m. Routed with profile `any` (West Mountain Drive is two-way; waypoints pin the
route to the drive and the two trails).

**Why the trails.** The summit part of West Mountain Drive (from the junction with the Whittington leg, 12808467, up the
climb, round the switchback and along the ridge to the end loop) is a dead-end lollipop: by road it can only be left the
way it was entered (the survey's "Summit Loop spur" reuses 1.7 km). The Sunset Trail and Mountain Top Trail are the
only other ways off the summit, and the Mountain Top Trail comes out on Prospect Avenue 25 m from the drive's Prospect
entrance, which closes the loop without driving anything twice. The Whittington Avenue entrance (12808467, 2.7 km) is
not on the lap: a loop through both entrances and the summit would need ≈ 3.4 km of town streets (Whittington Ave,
Central Ave, Prospect Ave).

## Facts used (with sources)

- West Mountain Drive has entrances on Prospect Ave and Whittington Ave and climbs to the Summit Loop's three
  overlooks: views of Bathhouse Row and the former Army-Navy Hospital; a 1924 trail shelter with picnic tables; and the
  summit view south to the Trap Mountains and Lake Hamilton with a novaculite outcrop — NPS "Scenic Drives &
  Overlooks", via `research/town-content.md` §4.
- Way topology, the 6.9 km West Mountain loop, the summit spur reuse, trail junctions — `research/geo/road-survey.md`.
- Overlook positions: OSM viewpoints 5999161833 / 5999161832 (`westmtn-viewpoint-1`, `-2`) and the approximate summit
  overlook `westmtn-loop-overlook` — `research/geo/anchors.json`.

## Honest distortions

- **Compression** (route meta): ks = 0.185, kt = 0.430, kv = 0.146; nothing pinned. The 2.65 km of drive (climb, switchback, ridge)
  shrink to 658 m; the switchback stays a 180° turn. Smoothing σ = 45 m simplifies the Mountain
  Top Trail's footpath zigzags into S-bends. Route minimum radius 17 m (baked 14.6 m).
- **Elevation**: real 215–335 m (120 m); game ≈ 17 m (kv 0.146, grades capped at 15%; the steep Mountain Top Trail
  descent sets the cap).
- **Footpaths raced as 11 m dirt roads** (Sunset Trail, Mountain Top Trail): game course.
- **Water**: both refills ("Summit picnic-shelter water barrels", "Prospect Avenue entrance buckets") are game.
- **Width**: the one-lane drive widened to 12 m.
- **Limits**: `limType: auto` resolves to soft limits everywhere (kv too small for the auto thresholds; see report).
- The 1924 shelter is not in OSM; its position along the ridge is unknown (placed in notes only as "on the ridge
  between the Row-view overlooks and the summit overlook").

## Anchors for landmark models later

Model `wm-shelter` exists in `art-src/models.json`; the spec has no `landmarks` per the brief. Game s is metres from
the start line; d is signed metres (right of travel +).

| Landmark | Anchor / lat, lon | Game s / d | Ready-to-paste landmark |
|---|---|---|---|
| Summit overlook: Trap Mountains / Lake Hamilton, novaculite outcrop | `westmtn-loop-overlook` (approx) | 7 / +31 (right) | novaculite outcrop + rail |
| Row-view overlook 1 (Bathhouse Row, former Army-Navy Hospital) | `westmtn-viewpoint-1` | 698 / +19 (right) | overlook wall |
| Overlook 2 | `westmtn-viewpoint-2` | 649 / −17 (left) | overlook wall |
| 1924 trail shelter (picnic tables) | not in OSM; somewhere on the ridge, s ≈ 750–990 | — | `{"id":"shelter","model":"wm-shelter","lonlat":[<lon>,<lat>]}` once located |
| Prospect Avenue entrance | 34.50476, -93.06593 | 350 / 0 | entrance sign |
| Whittington-leg junction | 34.51010, -93.06048 | 572 / 0 | sign "to Whittington Ave" |
