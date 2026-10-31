# Visual review rubric: Spa City Tub Rally

Adapted from `games/football/reviews/RUBRIC.md` (Hot Springs Games). Each review scores 8 categories from 1 to
10 in 0.5 steps. The target is an **early Nintendo 64 kart racer (1996–98)**: low-poly, vertex-coloured, small
bilinear textures, fog, 240-line soft picture. Score against that era's best, not against modern games: a perfect
period look scores high even though it is "low detail". Score only what is in the captures; cite at least 2 per
category.

| Category | key | Gate |
|---|---|---|
| Art (models, textures, palette) | `art` | ≥ 7 |
| Atmosphere (sky, fog, light, time of day) | `lighting` | ≥ 7 |
| Animation and game feel (motion strips first) | `animation` | ≥ 7 |
| UI / HUD | `ui` | ≥ 7 |
| Typography | `typography` | ≥ 7 |
| Readability (tubs, items, road, landmarks at 240 lines) | `readability` | ≥ 7 |
| Mobile (portrait and landscape at 390 px) | `mobile` | ≥ 7 |
| Authenticity (Hot Springs, the real race, N64 era) | `authenticity` | ≥ 6 |

## Anchors
- **Art.** 3: untextured primitives, clashing colours. 5: consistent low-poly with flat colour; generic buildings. 7: a cohesive period look: chunky silhouettes, painted 64 px textures that tile cleanly, landmarks recognisable at a glance, varied props. 9: the best of the era: every course has a distinct palette and set pieces, no texture seams, character models with personality.
- **Atmosphere.** 3: flat grey, no fog. 5: gradient sky and linear fog. 7: a painted horizon of the right place, fog colour matched to the sky, baked sun that shapes the world, dusk and day courses that feel different. 9: weather or time-of-day touches, light that guides the eye.
- **Animation and feel.** 3: sliding, rigid, no feedback. 5: running cycles and wheel spin but weak feedback. 7: attendants run and circle the tub convincingly; power slides, boosts, hits and splashes read with particles, camera kick and sound; water visibly sloshes. 9: every action has anticipation and follow-through.
- **UI / HUD.** 5: functional but cluttered or inconsistent. 7: a clear period-style HUD (position, lap, time, water, items) with hierarchy, nothing overlapping, menus with a consistent chunky style. 9: animated, context-aware HUD with perfect spacing.
- **Typography.** 5: readable, mixed scales. 7: the pixel display font and the UI font form a clear scale; numerals read at a glance; nothing clipped.
- **Readability.** 5: tubs blend into the road, items hard to spot. 7: every tub, item, pickup and judge stop reads in every frame on both viewports; the racing line and walls are obvious.
- **Mobile.** 5: it works but is cramped. 7: thumb-friendly controls that never cover the tub; both orientations framed on purpose; ≥ 30 fps on the 4× CPU-throttle proxy.
- **Authenticity.** 5: a generic town. 7: the Row reads as the Row, the Arlington closes the vista, the mountains look like the Ouachitas, the real rules show (water line, items, duck, flag, judges). 9: a local would name every course from a screenshot.
