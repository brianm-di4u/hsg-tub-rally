# Spa City Tub Rally: product requirements

## 1. Vision
An original, N64-era kart racer where the karts are bathtubs on wheels from Hot Springs' World Championship
Running of the Tubs and the courses are the town's real downtown streets and national-park mountain roads.
Fast, funny, readable at 240 lines, finished in a sitting, and full of true local detail.

**Pillars**
1. **Feels like 1997.** Low-poly, vertex-coloured, soft 240-line picture, chunky HUD, sequenced synth music.
2. **The real race, turned into a game.** Captain steers, four attendants push, water must last, dropped items mean circling the tub.
3. **Real Hot Springs.** Courses follow real streets and elevation; landmarks are recognizable; every fact is sourced.
4. **Pick up and play.** Keyboard, gamepad or touch; assists; 2–4 minute races.

**Players**: casual and nostalgic players on desktop browsers (primary) and phones (secondary); Hot Springs locals
and visitors; ages 8+.

## 2. Modes
| Mode | Summary |
|---|---|
| Grand Prix | Pick a cup (4 courses) and a speed class; 8 tubs; points per race; trophy and unlocks |
| Quick Race | One course, any class, 8 tubs |
| Time Trial | Solo against the clock and your saved pose ghost (and a staff ghost) |
| Water Fight (battle) | Hill Wheatley Plaza arena; drain rivals' tubs; last tub with water wins |
| Rules of the Row | The real format: straight run down Central, division bracket heats, judge stops, keep 10 gal and all four items or be disqualified, awards ceremony |

## 3. Rules (game rules)
- **Race**: 3 laps (Grand Prix, Quick Race); start from a 2-wide grid behind the line; countdown READY, SET, SCRUB!; a push timed in the last 0.45 s gives a start boost; a push held from READY is a false start (short stumble).
- **Laps** count only after passing ≥ 85% of the checkpoints in order. Backing over the line un-counts a lap.
- **Water**: tubs start full (Traditional 42, Modified 34, Stock 38 gal). Slosh physics spill water in hard turns, slides, landings and wall hits; item hits and bumps spill more. Refills: crowd blasters (slow), refill buckets and fountains (fast), creek fords (fast). Below 0.01 gal the tub is "Bone dry": −6% top speed.
- **Clean Finish**: finish with ≥ 10 gal and all four attendant items → +1 point.
- **Fumble**: an item hit (or big bump) makes one attendant drop their item; the tub stops ~1.4 s while the team circles it; the item is recovered afterwards.
- **Grip slip**: a wall hit faster than 9 m/s → 0.55 s of reduced push while attendants swap.
- **Power slide**: hop with steer held at > 8 m/s; hold to charge Warm (0.85 s) then Hot (1.9 s); release for a 0.65 s / 1.25 s steam boost.
- **Items** (soap-bubble pickups; odds by position): Rubber Duck, Bar of Soap, Bath Bomb, Loofah Shield, Towel Snap, Thermal Jet (×1/×3), Water Blaster, Bubble Bath, Fire Hose. No item targets the leader.
- **Bath tickets**: collect up to 10; a judge stand's bribe lane takes 3 for a Head Start boost; ties broken by tickets spent.
- **Points**: 10-8-6-5-4-3-2-1 (+1 Clean Finish). Cup trophy: gold/silver/bronze for 1st–3rd overall.
- **Speed classes**: Splash, Soak, Scald (AI and top speed); Reflection Pool (mirror) unlocks after both cups on Soak.

## 4. Hot Springs content map
| Where | Content | Source |
|---|---|---|
| Courses (8) | Bathhouse Row; Park Avenue Nights; Whittington Valley; Bridge Street Bash; Hot Springs Mountain Drive; Goat Rock & Gulpha Gorge; West Mountain Summit; Sunset Ridge | `research/town-content.md` §4 |
| Arena | Hill Wheatley Plaza with its thermal jug fountain | §4 |
| Teams (12, fictional) | archetypes from real entries | §3 |
| Rules of the Row | real rules 4–19, obstacle names, blue flags, Battle of the Badge, awards | §1 |
| Loading tips, track cards, Trophy Room | sourced facts and audited trivia ids | §6 |
| Credits | event credit (not affiliated), OSM/USGS credits, palettes | §1, §5 |

## 5. Screens and flow
Boot → Title (attract flyover) → Mode select → Team select (Hill Wheatley Plaza turntable, stats bars) → Class
→ Cup/Course select (postcard cards with a fact) → Loading (tip) → Race (countdown) → Results → (Grand Prix:
standings → next course … → trophy podium) → Title. Pause from the race. Settings and How to Play from Title and
Pause. Rules of the Row adds division pick, bracket view, judge stops and the awards ceremony.

## 6. Art direction
- Render target 240 lines (Authentic), 480 (Crisp) or native; CSS bilinear upscale; MSAA on Medium+.
- World: unlit vertex colours with baked sun, 32–64 px textures (Codex-painted, 5-bit per channel with dither), linear fog; karts Gouraud-lit; billboard trees and crowds; painted horizon ring.
- Palettes from `shared/design/tokens.css` (§5 of town-content). Each team has a high-contrast tub colour and a distinctive hat silhouette so tubs read at 20 px.
- HUD and titles in an original 5×7 pixel font; menus in bold rounded system fonts with chunky gradient buttons.

## 7. Audio direction
WebAudio synthesis only. No motor: four sets of running feet + wheel rumble pitched by speed + water slosh;
quacks, steam hiss, towel snap, judge whistle, crowd cheers; original sequenced tunes (ragtime piano and tuba
downtown, neon swing for Park Avenue, banjo/fiddle bluegrass on the mountains). Quiet by default, mutable.

## 8. Accessibility
Keyboard-only play and menus; remappable keys; gamepad; auto-push and steer assist; text contrast ≥ 4.5:1;
every cue uses shape + label (item icons, patterned water gauge, item pips with labels); `prefers-reduced-motion`
cuts camera shake, FOV kick and flashes; HUD scale setting; captions for call-outs via an aria-live region.

## 9. Mobile and touch
Portrait and landscape; left-half drag steering, Push/Brake/Hop/Item buttons ≥ 64 px; auto-push default on touch;
HUD rearranged in portrait; phones default to Low detail and Authentic resolution.

## 10. Performance budgets
60 fps on a mid-range laptop (frame task time < 4 ms desktop, < 16 ms at 4× CPU throttle); ≤ 120 draw calls and
≤ 60k triangles desktop, ≤ 80 / 30k phone; index.html ≤ 700 KB (cap 2 MB); first race ≤ 2 MB total download;
whole game ≤ 5 MB; interactive (title) in ≤ 2 s.

## 11. Save/load
`localStorage` key `hsg-tub-rally-v1` (try/catch, in-memory fallback): settings, unlocks, best laps and race
times per course, ghosts, cup results, stats.

## 12. Acceptance criteria
**Core**
- AC1 The game boots to the title screen with zero console errors and zero network requests, over http and file://.
- AC2 Authentic mode renders 240 lines (short side) and upscales to fill the window; Crisp and Native modes work.
- AC3 A race runs countdown → 3 laps → results; laps need ≥ 85% of checkpoints in order.
- AC4 Fixed 60 Hz simulation; the same seed and inputs give the same state hash in Node and in the browser.
- AC5 Push, brake, steer, hop, power slide with Warm/Hot stages and boosts behave as in §3.
- AC6 Water spills from slosh, landings, walls and hits; refills from crowds, buckets, fountains and fords; the HUD gauge shows gallons and the 10-gal line.
- AC7 An item hit makes an attendant drop an item and the team circles the stopped tub; the HUD pip shows it.
- AC8 Clean Finish (+1 point) requires ≥ 10 gal and all four items.
- AC9 Walls stop and deflect the tub; drops trigger a referee tow back; off-road slows.
- AC10 Seven AI tubs race competently on every course; all finish; difficulty classes differ in pace.
**Items and tickets**
- AC11 All nine items work as described; item odds depend on position; none targets the leader.
- AC12 Bath tickets collect (max 10) and buy a Head Start boost at judge stands.
**Content**
- AC13 Eight courses built from real street data, each with its honest-distortion note, landmarks and fact card.
- AC14 Bathhouse Row shows the eight bathhouses in the correct north→south order.
- AC15 Twelve fictional teams across three divisions with distinct handling; four unlock through cups.
- AC16 Grand Prix: two cups, standings, trophies, unlocks; Quick Race; Time Trial with ghost; Water Fight arena; Rules of the Row with bracket, judge stops, disqualification rules and awards.
**Presentation**
- AC17 Title, team select, course select, results, pause, settings, How to Play, credits screens; keyboard/gamepad navigable.
- AC18 Synth music per course style and sound effects; sound/music toggles; quiet by default.
- AC19 Touch controls in portrait and landscape; no horizontal overflow; touch targets ≥ 44 px.
- AC20 Reduced motion respected; text contrast ≥ 4.5:1 on all menus and HUD text.
**Quality**
- AC21 Budgets in §10 met (measured with `t.frameCost`, draw/triangle counters, file sizes).
- AC22 Saves persist settings, unlocks, best times and ghosts; the game works with storage blocked.
- AC23 Every fact shown to players is sourced (check-facts passes); credits show the event and data credits.
- AC24 Originality checklist (§14) holds.

## 13. Out of scope
Online multiplayer and split-screen (single player only, by decision); real team or business names, logos or
sponsor decals; real people as characters; voice acting; user-made tracks; leaderboards over the network.

## 14. Originality checklist
- [ ] No name, character, item, item box, track layout, UI layout, sound or music from any commercial kart racer.
- [ ] Pickups are soap bubbles; items are bath-themed with original behaviour; no first-place seeker.
- [ ] Slide boost stages are "Warm"/"Hot" steam (no copied spark colour sequence); speed classes are Splash/Soak/Scald.
- [ ] Rescue is by roller-derby referees on skates (from the real event), not a floating helper.
- [ ] Cups are named for the town ("Bathhouse Cup", "Ouachita Cup"); trophies are golden faucets.
- [ ] Courses follow real Hot Springs streets, not invented fantasy layouts.
