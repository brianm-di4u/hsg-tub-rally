# Spa City Tub Rally: town content and sources

Every real place, fact, name, colour and story the game uses, with its source. Fictional content (teams,
captains, emblems, item names, course links) is marked **fictional** or **game course**. Corpus paths are
relative to `C:\Video Game Projects\research\` (the shared Hot Springs research corpus); copies of the files a
fact comes from are not needed in this repo, because every fact below carries its own source.

Research date: 2026-10-30. "Current" means the status the source gave on that date.

## 1. The real event: World Championship Running of the Tubs

| Fact | Source |
|---|---|
| Full name "Stueart Pennington World Championship Running of the Tubs"; spelled "Stueart" by the official site and the 2026 rules, "Steuart" in some coverage (open spelling conflict, see §7) | 2026 Official Rules PDF; runningofthetubs.org/about; Visit Hot Springs 2021 press release |
| First run 2006; named for downtown businessman Stueart Pennington, whose idea the city carried out after his death | runningofthetubs.org/about; audited trivia bank `games/trivia/data/questions.json` hs-0378–hs-0380 |
| A tribute to the city's historic motto "We Bathe the World" | runningofthetubs.org home and about |
| Organized by Visit Hot Springs (contact hscvb@hotsprings.org); free, family-friendly; every June | runningofthetubs.org FAQ, about, schedule |
| Teams push bathtubs on wheels down Central Avenue in front of Bathhouse Row | 2026 Official Rules (intro) |
| 2016 route: from the front of the Arlington to the crosswalk at the Exchange Street Parking Plaza | Sentinel-Record, 2016-06-05 (hotsr.com "Battle of the Badges and more entertains at tub races") |
| Divisions: **Traditional** (cast-iron tub), **Modified** (fiberglass or plastic tub), **Stock** (Visit Hot Springs provides the tub; nonprofits, government and church groups only) | 2026 Official Rules, "Divisions" |
| Five-person team: a Captain who rides in the tub, plus a Bath Towel, Bath Mat, Soap and Loofah Mitt Attendant (rule 5) | 2026 Official Rules |
| No motors: the four attendants power the tub the whole way (rule 4) | 2026 Official Rules |
| Tub at least 48 × 24 in; wheels ≤ 30 in on axles ≤ 44 in wide; no casters (rules 2–3) | 2026 Official Rules |
| Every member keeps one hand on the tub; if anyone lets go, stop and all attendants change positions (rule 6) | 2026 Official Rules |
| Attendants hold their item the whole race; a dropped item means stop, retrieve it, and the team makes one full circle around the tub (rule 7) | 2026 Official Rules |
| Cross the line with soap, mat, mitt and towel or be disqualified (rule 8) | 2026 Official Rules |
| Tub starts full and must have at least 10 gallons at the finish (rule 9) | 2026 Official Rules |
| Pushers wear a head covering and suspenders (rule 10); costumes required (rule 11) | 2026 Official Rules |
| A flag or pennant on a pole of at least 3 ft (rule 16) | 2026 Official Rules |
| Extra points for bribing the judges (rule 17); head starts at the judges' whim (rule 18) | 2026 Official Rules |
| At least one rubber duck in the tub at all times (rule 19) | 2026 Official Rules |
| Tubs are judged Friday at Hill Wheatley Plaza ("605 Central Ave" in the rules; see §7); Saturday: Parade of Tubs, then the races | 2026 Official Rules (rule 20, schedule); runningofthetubs.org/schedule |
| Obstacle stops: judges halt teams and set tasks; 2016 stops were "Ring Around the Tub", "Bath Toss" and "Road Kill"; reported tasks include jumping jacks, push-ups and yodeling | Sentinel-Record 2016; KATV 2026-05-15 preview |
| Blue feather flags mark spots near an obstacle stop | runningofthetubs.org FAQ |
| Spectators line the street with water blasters (balloons not allowed); downtown businesses set out refill buckets on both sides of the street | runningofthetubs.org FAQ and about |
| Battle of the Badge: fire, police and (since 2025) sheriff's teams; it runs without stops | runningofthetubs.org about; Sentinel-Record 2016; KATV 2024 |
| Roller-derby skaters have served as referees (2025) | runningofthetubs.org news, 2025-06-02 |
| Awards seen: division cups, Most Original, Most Spirit(ed), Best Overall, a fan award ("Tubtastic Fan Award") | Sentinel-Record 2016; KATV 2024; Visit Hot Springs 2021 |
| Team themes reported (examples): firefighters and police, a ninja tub, a shark tub, a spa's "Bubbly Brothers", a hotel's "Wild Wild Tub", a park employees' "All Steamed Up", an out-of-state team from Austin, a mountain-bike trail group, a flamingo-costumed judge | Sentinel-Record 2016; Visit Hot Springs 2021 press release; KATV 2026 |

**Brand and people rules.** The event name appears only in factual text and the credits card ("Inspired by…
Not affiliated."). No event logo, sponsor names or decals. No real team, business or person is a character.

## 2. How the game uses the rules (game rules, labelled as such in How to Play)

| Real rule | Game mechanic |
|---|---|
| Captain rides and steers; 4 attendants push (rules 4–5) | Every tub has a captain and four running attendants; pushing is the throttle |
| Tub starts full; ≥ 10 gal at the finish (rule 9) | Water gauge with the 10-gallon line; Clean Finish bonus point (no disqualification in Grand Prix; disqualification only in Rules of the Row) |
| Hold your item; drop it → stop, circle the tub (rule 7) | Item hits make an attendant fumble: stop and run once around the tub (~1.4 s) |
| Let go → stop and change positions (rule 6) | Hard wall hits cause a short "grip slip" while attendants swap |
| Keep all four items (rule 8) | HUD item pips; Clean Finish needs all four |
| Head covering and suspenders (rule 10) | Every attendant model wears a hat and suspenders |
| Flag on a 3 ft pole; a rubber duck (rules 16, 19) | Every tub model carries both |
| Bribes and head starts (rules 17–18) | Bath tickets spent in a judge stand's bribe lane for a Head Start boost; ties broken by bribes |
| Refill buckets and water blasters (FAQ) | Crowd zones and bucket zones refill water |
| Obstacle stops and feather flags | Rules of the Row: quick-time judge stops at blue flags |
| Divisions | The three tub classes with different handling |

## 3. Teams (all fictional)

Twelve fictional teams, each inspired by a *kind* of entry reported above. Names, captains, colours and emblems
are invented; none depicts a real department, business or person.

| Team | Division | Inspired by |
|---|---|---|
| Engine Six Soakers | Traditional | fire-department teams (Battle of the Badge) |
| Lather & Linen | Traditional | spa and soap-shop teams |
| The Velvet Mob | Traditional | 1930s costume themes (a nod to the gangster-era history in `gangster-era-and-gambling.md`; no weapons) |
| Gator Gang | Traditional | animal-costume tubs; the Arkansas Alligator Farm (est. 1902) is a Whittington Ave landmark (`other-attractions.md`) |
| Bubble Patrol | Modified | police teams |
| Trail Shredders | Modified | the mountain-bike trail group entry |
| The Out-of-Towners | Modified | the out-of-state team from Texas |
| Silks & Stirrups | Modified | horse-racing season themes (no track named) |
| Steam Rangers | Stock | park-employee entries (generic flat hats, no NPS insignia) |
| Suds Posse | Stock | sheriff's teams |
| Flamingo Flock | Stock | flamingo costumes |
| Tub Ninjas | Stock | the ninja-tub entry |

## 4. Courses

All courses follow real streets from OpenStreetMap (© OpenStreetMap contributors, ODbL) and USGS 3DEP elevation
(public domain), compressed to laps of 45–60 s. See `research/geo/SOURCES.md` and each track's
"honest distortions" note. Game-only links are labelled **game course**.

**Bathhouse Row (downtown)**
- Central Avenue in front of Bathhouse Row; Row order north→south: Superior (329), Hale (341), Maurice (359; 355 in some sources), Fordyce (369), Quapaw (413), Ozark (425; 491 in some sources), Buckstaff (509), Lamar (515); Administration Building at 101 Reserve (`bathhouse-row-layout.md`, HABS AR-28, NHL nomination).
- Central Ave runs due north from Reserve St, bends about 7° at the Fordyce and 11° at the Hale/Superior, and is ≈ 1,705 ft from Reserve to Fountain; street ≈ 608 ft above sea level (`bathhouse-row-layout.md`, `geography-lakes-mountains.md`).
- The Arlington (239 Central) closes the north vista; twin-tower Spanish Colonial Revival (`downtown-and-landmarks.md`, `visual-style-guide.md`).
- Street furniture: magnolias about 25 ft apart, dark-green lamp posts with five white globes, bronze eagles on limestone pylons at the main entrance (`visual-style-guide.md`).
- Grand Promenade: brick walk behind the Row, ≈ 0.5 mi, 3.7% grade, 18 ft wide since 1956 (`bathhouse-row-layout.md`). Racing on it is **game course**.
- Display Spring behind the Maurice; Thermal Water Cascade on Arlington Lawn (`bathhouse-row-layout.md`).
- Fordyce model: HABS frontage 101 ft wall-to-wall, eaves 39–40 ft, end gables to 49 ft, seven bays; colours from the style guide (art-src/blender/README.md).

**Park Avenue Nights** — Park Ave runs ≈ 5,000 ft north then northeast from the Arlington "Y" (`bathhouse-row-layout.md` §7); the Vapors (315 Park, 1960) is a gangster-era landmark (`gangster-era-and-gambling.md`). Neon is game styling.

**Whittington Valley** — Whittington Ave runs ≈ 1.1 mi west from the Y to the Alligator Farm (847) and the Ban Johnson field site (870); valley floor ≈ 693 ft; a "Whittington Park Speedway" ran there from 1947 (single source, hedged) (`bathhouse-row-layout.md`, `baseball-spring-training.md`).

**Bridge Street Bash** — Bridge St runs east–west from Central to Malvern; its length is famously "98 ft 11 in" but the OSM centreline is ≈ 179 ft (shown hedged); St. Patrick's parade on Bridge St since 2004; Malvern Ave runs SE past the Pleasant Street district; Hot Springs Creek runs in a culvert under Central and emerges near 34.5073, −93.0520 (`bathhouse-row-layout.md`, `culture-events-food.md`). Racing in the culvert is **game course**.

**Hot Springs Mountain Drive** — begins at the end of Fountain Street; built as a carriage road in the 1880s; switchbacks climb to a picnic area, the Pagoda (J. G. Horn, 1911) and the Hot Springs Mountain Tower; the tower deck is 216 ft above the mountain, 1,256 ft above sea level; the original 1877 wooden tower was rebuilt in steel in 1982 (NPS "Scenic Drives & Overlooks", home.nps.gov/hosp/planyourvisit/scenic-overlooks.htm). Tower ground ≈ 1,036 ft (USGS EPQS, `geography-lakes-mountains.md`).

**Goat Rock & Gulpha Gorge** — Goat Rock Overlook on North Mountain looks over the Zigzag Mountains (the springs' recharge zone) with Indian (Silver) Mountain and its novaculite (NPS scenic overlooks page); Gulpha Gorge Campground has 40 sites along Gulpha Creek (NPS).

**West Mountain Summit** — West Mountain Drive has entrances on Prospect Ave and Whittington Ave and climbs to the Summit Loop's three overlooks: views of Bathhouse Row and the former Army-Navy Hospital; a 1924 trail shelter with picnic tables; and the summit view south to the Trap Mountains and Lake Hamilton with a novaculite outcrop (NPS scenic overlooks page).

**Sunset Ridge** — Music Mountain is the park's high point, 1,405 ft (NPS) or 1,418 ft (SummitPost), at the west end of the Sunset Trail, the park's longest trail; the Sugarloaf section between Black Snake Rd and Cedar Glades Rd includes Balanced Rock, a novaculite outcrop (NPS Sunset Trail page, nps.gov/hosp/planyourvisit/sunset-trail.htm).

**Battle arena: Hill Wheatley Plaza** — downtown plaza where tubs are judged on Friday (2026 rules); it has a thermal-water jug fountain (hotspringsguides.com listing; NPS "Getting Around" places RV/bus parking there).

## 5. Colours and palettes

From `shared/design/tokens.css` and `research/visual-style-guide.md` (all hexes there are estimates):
`lake-life` (modern downtown: lake #1E4E79, restored brick #B5654A, sunset #F2A541, redbud #B5568F, dogwood #F6F3EC),
`gilded-spa` (Row: cream brick #E6D7B5, red clay tile #A9432C, Maurice green #4E7D5B), `ouachita-forest` and
`nps-rustic` (mountains: pines #1F3324/#2F4A2C, novaculite #EDEAE2), `thermal-water` (steam, tufa #9A968C),
`deco-neon` (Park Avenue Nights). Team colours are fictional.

## 6. Facts shown to players

Track cards and loading tips use only (a) items from the audited bank `games/trivia/data/questions.json` with
`confidence: confirmed`, cited by id, or (b) the sourced facts in §1 and §4. `tools/check-facts.mjs` (M4) checks
every shown fact id against the bank. Sensitive history (segregation, the 1967 shutdown, violence) is never used
as game flavour.

## 7. Conflicts and hedges

| Topic | Values | Handling |
|---|---|---|
| Namesake spelling | Stueart (official rules, site) / Steuart (some coverage) | Use "Stueart" only on the credits card |
| Hill Wheatley Plaza address | 605 Central (2026 rules) / 629 Central (Visit Hot Springs visitor center) | Say "Hill Wheatley Plaza, one block south of the Row"; no number |
| Bridge Street length | 98 ft 11 in (famous claim) / ≈ 179 ft (OSM centreline) | Sign reads "famously the shortest street"; card shows both |
| Music Mountain elevation | 1,405 ft (NPS) / 1,418 ft (SummitPost) | Card uses the NPS value |
| Maurice and Ozark numbers | 359/355 and 425/491 | Not shown in game |
| 2020 race | moved to July 11 / "no 2020 races" in a 2026 release | Not shown in game |
| Organizer | Visit Hot Springs (official site); not Rotary (no source) | Credits say Visit Hot Springs |

## 8. Honest distortions (shown in each track's info panel)

Course lengths are compressed to fit 45–60 s laps (factor printed per track); elevation is scaled where a real
grade would be undrivable; hairpins are widened to a 14 m minimum radius; game-course links (Grand Promenade
racing, the creek culvert, return roads that don't exist) are labelled. Building positions keep their order
and side of the street; generic buildings are stand-ins.
