// Where a hero landmark (Blender model) stands: beside the road at its baked (s, d), facade (+Z) facing the road.
// Shared by the game (main.js) and the course checker (tools/track/check.mjs). No DOM, no three.js.
//
// box: { depth, fwd } in model metres: how far the model reaches behind its origin (-min z) and in front of it
// (max z: an entrance stair or arcaded base standing proud of the front wall).
export function landmarkPose(track, lm, box) {
  const s = lm.s ?? lm.at * track.length, side = lm.side || Math.sign(lm.d) || 1, scale = lm.scale || 1;
  const c = track.at(s), edge = side > 0 ? c.wr : c.wl, lim = side > 0 ? c.limR : c.limL;
  // anchors are building centroids; the model's origin is its front wall, so step forward half its depth
  const front = lm.d != null ? Math.abs(lm.d) - box.depth / 2 : edge + (lm.setback ?? 10);
  // whatever stands proud of the front wall keeps minGap from the road edge and a metre beyond the limit wall,
  // so no tub can drive into it
  const d = side * Math.max(front, Math.max(edge + (lm.minGap ?? 6), lim + 1) + (box.fwd || 0) * scale);
  const p = track.point(s, d);
  const yaw = Math.atan2(side * c.tz, -side * c.tx) + (lm.yaw || 0);
  return { s, d, x: p.x, y: track.heightAt(c, side * edge) + (lm.dy || 0), z: p.z, yaw, scale };
}
