# Loop 9: changes (facts only)

## Animation and feel
- **Impact jolt:** the camera dip on impacts now reaches up to ~5.6° (was ~4°).
- **Shake timing:** camera shake and FOV punch decay on the frame's elapsed time, so a frozen review clock holds them
  like every other effect.
- **Slide steam:** leaves the rear wheels with a small outward push, drifts back and climbs at ~1.3–2.1 m/s. It
  swells 2.2× per second and lives 0.6–0.8 s.
- **Effect trails:** when a frame covers several 60 Hz ticks (a long frame, or a motion-strip step), the particles
  emitted in it are spread back along the tub's path and pre-aged, so they lay a trail instead of one clump.
- **Hot steam:** warm white (was orange beads), in both the boost trail and the release burst.
- **Hairpin camera:** in a tight turn the chase camera rises by up to 0.9 m and tucks in by up to 0.3 m.

## Readability
- **Player marker:** the player's arrow and ring are one fixed gold (#FFC92E) for every team. They were the team's
  flag colour, so a rival's ring could outshine the player's.
- **Rival rings:** washed 40% toward grey and slightly thinner.
- **Tub colours:** the Out-of-Towners ride a teal tub with purple trim. Their purple tub matched the Velvet Mob's.

## Scenery and lighting
- **Foothill ring:** a fourth, nearest horizon ring of low rolling foothills (296 m out, up to ~16 m high) stands in
  front of the three mountain rings, so the hills rise from the land in steps.
- **Hill brightness:** no hill face, lip or ledge renders brighter than 86% of the horizon sky colour. Hazed far
  ledges no longer show as white ghosts.
- **Wall bases:** placed buildings darken more, and over more height, where they meet the ground (to 50% at the base,
  over 1.8 m; was 60% over 1.3 m).
- **Brick relief:** fades out sooner with distance (less sparkle on distant facades).
- **Landmark glazing:**
  - Landmarks with painted facades keep their ground-floor shop windows again. Loop 8 had removed them with the
    upper-floor panes, leaving blank brick bays under the Fordyce's marquee.
  - The Quapaw, whose facade art paints its ground-floor arches too, keeps no upright panes.

## UI and mobile
- **Desktop HUD:** tiles grow 15% on desktop-sized windows. The ticket label is 12 px.
- **HUD studs:** the item orb and the item tray sit below their tiles' stud rows.
- **Portrait team select:** keeps 28 px (plus the safe area) below its panel. The panel's frame hangs ~12 px below
  its box, so the logged 16 px left only ~4 px.
- **Landscape team select:** cards are a 3-column grid of names only (the division shows in the details beside
  them). Names never break at their hyphens, and "locked" sits on its own line.
- **Locked labels:** a locked team's label sits on its own line everywhere (no orphaned "· locked").
- **Phone results:** keep the team swatches, keep each value on one line and show a clean finish as a green check
  mark.

## Review harness
- **Test hits:** a test hit (`act('hit')`) now delivers its events to the frame as a sim step would (call-out, flash,
  camera shake, particles). Before, R15's fumble showed no feedback, because the hit happened outside a step.
