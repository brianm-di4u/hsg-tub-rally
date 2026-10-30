// Low-poly street furniture built in code and merged into the static world chunks. Billboard kinds (trees,
// crowds) are drawn by trackmesh.js as instanced quads instead.
// Research: Bathhouse Row lamp posts are dark green with five white globes; magnolias stand about 25 ft apart
// (research/visual-style-guide.md "Street furniture"). Feather flags mark obstacle stops (runningofthetubs.org FAQ).
import { hex, mul } from './geom.js';

export const PROP_KIND = { pine: 'board', oak: 'board', magnolia: 'board', crowd: 'board' };

const GREEN = hex('#2F4A3A'), GLOBE = hex('#F4F1E6'), STEEL = hex('#A9B0B6'), BLUE = hex('#2E6FD0');

export function buildProp(type, g, p, yaw, sc = 1) {
  const [x, y, z] = p;
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const T = (lx, ly, lz) => [x + (lx * cy + lz * sy) * sc, y + ly * sc, z + (-lx * sy + lz * cy) * sc];
  switch (type) {
    case 'lamp': {
      g.cyl([x, y, z], 0.16 * sc, 0.09 * sc, 4.2 * sc, 5, GREEN);
      g.box([x - 0.6 * sc, y + 4.1 * sc, z - 0.05 * sc], [x + 0.6 * sc, y + 4.2 * sc, z + 0.05 * sc], GREEN);
      g.box([x - 0.05 * sc, y + 4.1 * sc, z - 0.6 * sc], [x + 0.05 * sc, y + 4.2 * sc, z + 0.6 * sc], GREEN);
      for (const [dx, dz, dy] of [[0, 0, 4.75], [0.6, 0, 4.4], [-0.6, 0, 4.4], [0, 0.6, 4.4], [0, -0.6, 4.4]]) g.ball([x + dx * sc, y + dy * sc, z + dz * sc], 0.24 * sc, GLOBE, 5, 3);
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
