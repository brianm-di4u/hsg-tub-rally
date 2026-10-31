// Low-poly street furniture built in code and merged into the static world chunks. Billboard kinds (trees,
// crowds) are drawn by trackmesh.js as instanced quads instead.
// Research: Bathhouse Row lamp posts are dark green with five white globes; magnolias stand about 25 ft apart
// (research/visual-style-guide.md "Street furniture"). Feather flags mark obstacle stops (runningofthetubs.org FAQ).
import { hex, mul } from './geom.js';

export const PROP_KIND = { pine: 'board', oak: 'board', magnolia: 'board', crowd: 'board' };

const GREEN = hex('#2F4A3A'), GLOBE = hex('#F4F1E6'), STEEL = hex('#A9B0B6'), BLUE = hex('#2E6FD0');

// glow: optional second builder for parts that light up after dark (lamp globes), drawn unlit
export function buildProp(type, g, p, yaw, sc = 1, glow = null) {
  const [x, y, z] = p;
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const T = (lx, ly, lz) => [x + (lx * cy + lz * sy) * sc, y + ly * sc, z + (-lx * sy + lz * cy) * sc];
  switch (type) {
    case 'lamp': {
      g.cyl([x, y, z], 0.16 * sc, 0.09 * sc, 4.2 * sc, 5, GREEN);
      g.box([x - 0.6 * sc, y + 4.1 * sc, z - 0.05 * sc], [x + 0.6 * sc, y + 4.2 * sc, z + 0.05 * sc], GREEN);
      g.box([x - 0.05 * sc, y + 4.1 * sc, z - 0.6 * sc], [x + 0.05 * sc, y + 4.2 * sc, z + 0.6 * sc], GREEN);
      for (const [dx, dz, dy] of [[0, 0, 4.75], [0.6, 0, 4.4], [-0.6, 0, 4.4], [0, 0.6, 4.4], [0, -0.6, 4.4]]) (glow || g).ball([x + dx * sc, y + dy * sc, z + dz * sc], 0.24 * sc, glow ? [1, 0.93, 0.72] : GLOBE, 6, 4);
      break;
    }
    case 'bucket': {
      g.cyl([x, y, z], 0.32 * sc, 0.4 * sc, 0.6 * sc, 6, hex('#C9CED2'), { top: hex('#4FA9D8') });
      break;
    }
    case 'flag': { // blue feather flag on a pole (obstacle stop marker)
      g.cyl([x, y, z], 0.04, 0.04, 3.4, 4, STEEL);
      const a = T(0, 1.2, 0), b = T(0, 3.3, 0), c = T(0.75, 3.0, 0), d = T(0.6, 1.4, 0);
      g.quad(a, d, c, b, BLUE); g.quad(b, c, d, a, mul(BLUE, 0.8));
      // a white stripe down the outer edge and one across the top on both faces, so it reads as a flag, not a board
      const W = hex('#F4F4F4');
      for (const o of [0.012, -0.012]) {
        const e = T(0.44, 1.38, o), f = T(0.58, 3.06, o), c2 = T(0.75, 3.0, o), d2 = T(0.6, 1.4, o);
        const h = T(0, 2.95, o), k = T(0.71, 2.66, o), b2 = T(0, 3.3, o);
        g.quad(e, d2, c2, f, W); g.quad(f, c2, d2, e, W); g.quad(h, k, c2, b2, W); g.quad(b2, c2, k, h, W);
      }
      break;
    }
    case 'cone': {
      g.cyl([x, y, z], 0.28, 0.02, 0.75, 5, hex('#F07F22'));
      break;
    }
    case 'bench': {
      g.obox(T(0, 0.45, 0), [0.9 * sc, 0.05, 0.25], hex('#5B3A26'), yaw);
      g.obox(T(0, 0.75, -0.22), [0.9 * sc, 0.2, 0.04], hex('#5B3A26'), yaw);
      break;
    }
    case 'judge': { // judge stand: a small striped booth with a podium
      g.obox(T(0, 1.0, 0), [1.4, 1.0, 1.0], hex('#F4F1EA'), yaw, { top: hex('#C8322A') });
      g.obox(T(0, 2.5, 0), [1.6, 0.12, 1.2], hex('#C8322A'), yaw);
      for (const dx of [-1.4, 1.4]) g.cyl(T(dx, 0, 0.9), 0.06, 0.06, 2.5, 4, STEEL);
      // two brick judges in striped shirts with clipboards, standing in front of the booth facing the road
      for (const dx of [-0.85, 0.85]) {
        const J = (lx, ly, lz) => T(dx + lx, ly, 1.45 + lz), blk = hex('#2B2E33'), wht = hex('#F4F4F4'), skin = hex(dx < 0 ? '#E0AC7E' : '#8D5A3B');
        for (const lx of [-0.09, 0.09]) g.obox(J(lx, 0.29, 0), [0.075, 0.29, 0.08], blk, yaw);
        for (let k = 0; k < 4; k++) g.obox(J(0, 0.65 + k * 0.115, 0), [0.2, 0.0575, 0.12], k % 2 ? blk : wht, yaw);
        g.obox(J(0, 1.3, 0), [0.15, 0.15, 0.14], skin, yaw);
        g.obox(J(0, 1.47, 0), [0.16, 0.04, 0.15], blk, yaw);
        for (const lx of [-0.245, 0.245]) g.obox(J(lx, 0.88, 0.06), [0.045, 0.2, 0.06], wht, yaw);
        g.obox(J(0.2, 0.92, 0.2), [0.11, 0.14, 0.015], hex('#8A6A3A'), yaw);
        g.obox(J(0.2, 0.94, 0.215), [0.08, 0.1, 0.005], wht, yaw);
      }
      break;
    }
    case 'jug': { // the plaza's thermal-water jug fountain, the arena's centrepiece: a studded stone basin of clear
      // water around a pedestal, and on it a giant brick stoneware jug (blue band, handle) pouring into the basin
      const S = (v) => v * sc, stone = hex('#B9AE9A'), ware = hex('#D9C49A'), band = hex('#2E6FB0'), water = hex('#4FA9D8');
      g.cyl([x, y, z], S(4.4), S(4.2), S(0.6), 20, stone, { top: stone });
      g.cyl([x, y, z], S(3.9), S(3.9), S(0.5), 20, water, { top: water });
      g.cyl([x, y, z], S(1.0), S(0.85), S(2.0), 12, hex('#9A968C'));
      const jy = y + S(2.0);
      g.cyl([x, jy, z], S(1.25), S(1.5), S(1.0), 16, ware);
      g.cyl([x, jy + S(1.0), z], S(1.5), S(1.5), S(0.35), 16, band);
      g.cyl([x, jy + S(1.35), z], S(1.5), S(0.55), S(1.0), 16, ware);
      g.cyl([x, jy + S(2.35), z], S(0.45), S(0.45), S(0.6), 12, ware);
      g.cyl([x, jy + S(2.95), z], S(0.62), S(0.62), S(0.18), 12, band);
      // handle on one side, a stream from the lip on the other, falling into the basin
      // (T scales its offsets by sc; box half-sizes are scaled here)
      g.obox(T(1.75, 3.5, 0), [S(0.18), S(0.12), S(0.22)], ware, yaw);
      g.obox(T(1.9, 3.0, 0), [S(0.14), S(0.55), S(0.22)], ware, yaw);
      g.obox(T(1.6, 2.5, 0), [S(0.18), S(0.12), S(0.22)], ware, yaw);
      g.obox(T(-1.2, 5.0, 0), [S(0.58), S(0.1), S(0.16)], ware, yaw);
      g.obox(T(-1.75, 2.78, 0), [S(0.12), S(2.22), S(0.12)], water, yaw);
      break;
    }
    case 'eagle': { // eagle on a limestone pylon (Row main entrance)
      g.obox(T(0, 1.1, 0), [0.45, 1.1, 0.45], hex('#D9D2C2'), yaw);
      g.obox(T(0, 2.45, 0), [0.6, 0.25, 0.25], hex('#8A6A3A'), yaw);
      break;
    }
    default:
      g.box([x - 0.3, y, z - 0.3], [x + 0.3, y + 0.6, z + 0.3], hex('#FF00FF'));
  }
}
