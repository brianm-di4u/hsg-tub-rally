// Chase camera on critically damped springs (pattern after hsg-property-game/src/js/board3d.js `damp`,
// Hot Springs Games, MIT). Sits behind and above the tub, looks a little ahead along the heading, swings out
// in slides, pulls back with speed and boosts, and can look backward.

export function damp(cur, target, lambda, dt) { return target + (cur - target) * Math.exp(-lambda * dt); }
function dampAngle(cur, target, lambda, dt) {
  let d = target - cur; d = Math.atan2(Math.sin(d), Math.cos(d));
  return target - d * Math.exp(-lambda * dt);
}

export class ChaseCam {
  constructor(cam) {
    this.cam = cam;
    this.yaw = 0; this.x = 0; this.y = 5; this.z = 0; this.dist = 6.2; this.height = 2.5; this.fovKick = 0;
    this.shake = 0; this.init = false; this.mode = 'chase';
  }
  snap() { this.init = false; }
  update(k, pose, dt, opts = {}) {
    const back = opts.lookBack ? -1 : 1;
    const v = Math.abs(k.vf);
    const targetYaw = pose.yaw + (k.drift ? k.drift * 0.28 : 0) + (back < 0 ? Math.PI : 0);
    const portrait = opts.portrait ? 1 : 0;
    const dist = 6.3 + Math.min(1.5, v * 0.06) + (k.boostT > 0 ? 0.8 : 0) + portrait * 1.6;
    const height = 2.9 + Math.min(0.6, v * 0.02) + portrait * 1.6;
    const snapped = !this.init;
    if (snapped) { this.yaw = targetYaw; this.dist = dist; this.height = height; this.x = pose.x; this.y = pose.y; this.z = pose.z; this.liftY = undefined; this.init = true; }
    this.yaw = dampAngle(this.yaw, targetYaw, opts.lookBack ? 30 : 5.5, dt);
    this.dist = damp(this.dist, dist, 3, dt);
    this.height = damp(this.height, height, 3, dt);
    this.x = damp(this.x, pose.x, 20, dt); this.z = damp(this.z, pose.z, 20, dt);
    this.y = damp(this.y, pose.y, k.air ? 4 : 10, dt);
    const fx = Math.sin(this.yaw), fz = Math.cos(this.yaw);
    let cx = this.x - fx * this.dist, cz = this.z - fz * this.dist, cy = this.y + this.height;
    // keep the camera above the ground under it, and the line of sight to the tub clear of rising terrain
    if (opts.groundAt) {
      const g = opts.groundAt(cx, cz); if (g != null && cy < g + 1.2) cy = g + 1.2;
      const ty = this.y + 1.2;
      for (const f of [0.25, 0.5, 0.75]) {
        const px = cx + (this.x - cx) * f, pz = cz + (this.z - cz) * f, gh = opts.groundAt(px, pz);
        const lineY = cy + (ty - cy) * f;
        if (gh != null && gh + 0.9 > lineY) cy += (gh + 0.9 - lineY) / (1 - f);
      }
      this.liftY = damp(this.liftY ?? cy, cy, 8, dt); cy = Math.max(cy, this.liftY);
    }
    this.shake = Math.max(0, this.shake - dt * 3);
    const sh = opts.reducedMotion ? 0 : this.shake;
    const t = opts.time || 0;
    this.cam.position.set(cx + Math.sin(t * 47) * sh * 0.15, cy + Math.sin(t * 61) * sh * 0.12, cz);
    const look = 6 + portrait * 2;
    this.cam.lookAt(this.x + fx * look, this.y + 0.9 - portrait * 1.6, this.z + fz * look);
    const fovT = (opts.baseFov || 62) + (k.boostT > 0 && !opts.reducedMotion ? 7 : 0) + Math.min(6, v * 0.18);
    this.fovKick = snapped ? fovT : damp(this.fovKick, fovT, 4, dt);
    if (Math.abs(this.cam.fov - this.fovKick) > 0.05) { this.cam.fov = this.fovKick; this.cam.updateProjectionMatrix(); }
  }
}
