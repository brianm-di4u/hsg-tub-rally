"""Goat Rock, the novaculite outcrop at the Goat Rock Overlook on North
Mountain, Hot Springs National Park, Arkansas; low-poly landmark, early-N64
look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/goat-rock.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/goat-rock.glb, art-src/blender/goat-rock.blend,
         art-src/blender/renders/goat-rock_*.png (git-ignored)

Conventions: see art-src/blender/README.md. A rock has no wall line:
ORIGIN = front-centre of the outcrop at grade (the foot of the cliff face
that looks out over the view), that face toward glTF +Z (Blender -Y); the
mass steps down to grade behind it (glTF z < 0). Blocks go 0.5 m below
grade (the README skirt). Material slots: wall = rock faces, trim = shaded
undersides; no roof, no glass.

FACTS USED:
  games/Cart Racing/research/town-content.md section 4 (NPS Scenic Drives
    & Overlooks): Goat Rock Overlook on North Mountain looks over the
    Zigzag Mountains (the springs' recharge zone) with Indian (Silver)
    Mountain and its novaculite.
  geography-lakes-mountains.md: Goat Rock trail 1.1 mi, 886-1,067 ft, to an
    overlook on North Mountain; overlook point 34.527262, -93.039179 (OSM
    node 4465433144). Novaculite: dense, hard, white to grayish-black
    (often white or light gray, also pink), conchoidal fracture, forms
    prominent ridges; novaculite forms the ridges either side of the valley.
  visual-style-guide.md (ancient era look [inferred]): "white and pink
    novaculite outcrops as pale angular ridges"; icon 25: "jagged white
    zigzag ridge line".
  Task brief: the Goat Rock novaculite outcrop.

PALETTE: as balanced-rock.py (P1 novaculite white #EDEAE2 and the landkit
  derived grey, pink and shaded-underside shades). This outcrop uses a
  slightly greyer facet mix (grey threshold -0.25) so the two rocks differ.

ESTIMATES (the research gives no size or shape):
  outcrop about 17 m across x 10 m deep; a front row of five steep fins
  4.4-6.8 m high (the jagged cliff seen from below / along the trail), a
  middle row 3.0-4.6 m and a back row 1.2-2.2 m stepping down to grade,
  low flank blocks and three talus boulders at the foot of the face;
  beds lean back (steep dip) by 0.4-0.9 m
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403
from landkit import *                               # noqa: E402,F401,F403

NAME = 'goat-rock'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 300

# blocks: (cx, cy, w, d, h, yaw, lean, taper, apex)           all [est]
BLOCKS = [
    # front row: jagged fins
    (-6.0, 1.6, 3.0, 2.4, 4.4, 8.0, (0.2, 0.6), (0.55, 0.6), (0.3, 0.0, 0.9)),
    (-3.1, 1.3, 3.2, 2.6, 5.6, -6.0, (0.0, 0.8), (0.5, 0.6), (-0.2, 0.1, 1.2)),
    (0.0, 1.2, 3.4, 2.6, 6.2, 4.0, (0.1, 0.9), (0.5, 0.55), (0.3, 0.0, 1.0)),
    (3.2, 1.4, 3.0, 2.5, 5.2, -10.0, (-0.1, 0.7), (0.55, 0.6), (0.0, 0.2, 1.1)),
    (6.0, 1.7, 2.8, 2.4, 4.0, 14.0, (-0.2, 0.5), (0.6, 0.6), (-0.3, 0.0, 0.8)),
    # middle row
    (-4.6, 4.4, 3.8, 3.0, 3.4, 3.0, (0.0, 0.6), (0.65, 0.6), None),
    (-1.0, 4.6, 3.8, 3.2, 4.4, -3.0, (0.0, 0.7), (0.6, 0.6), (0.5, 0.0, 0.4)),
    (2.6, 4.5, 3.6, 3.0, 4.0, 6.0, (0.0, 0.6), (0.6, 0.6), None),
    (5.6, 4.6, 3.0, 2.8, 2.8, -8.0, (0.0, 0.5), (0.65, 0.6), None),
    # back row stepping down to grade
    (-3.0, 7.6, 4.4, 2.8, 1.8, 0.0, (0.0, 0.4), (0.7, 0.6), None),
    (1.4, 7.8, 4.6, 2.8, 2.2, 5.0, (0.0, 0.4), (0.7, 0.6), None),
    (5.0, 7.4, 3.0, 2.6, 1.2, -6.0, (0.0, 0.3), (0.7, 0.6), None),
    # flanks
    (-8.2, 3.6, 2.2, 3.0, 1.9, 20.0, (0.2, 0.3), (0.6, 0.6), None),
    (8.3, 3.8, 2.0, 2.8, 1.6, -18.0, (-0.2, 0.3), (0.6, 0.6), None),
]
TALUS = [((-4.6, -0.6, 0.35), (0.9, 0.7, 0.6)),
         ((1.8, -0.9, 0.25), (0.7, 0.6, 0.45)),
         ((5.0, -0.4, 0.3), (0.8, 0.6, 0.5))]


def build():
    reset()
    mats = order_mats(C_NOVA, C_NOVA, C_NOVA_UNDER)
    mb = MB()
    for i, (cx, cy, w, d, h, yaw, lean, taper, apex) in enumerate(BLOCKS):
        slab(mb, cx, cy, w, d, h, seed=41 + i, yaw=yaw, lean=lean, taper=taper, apex=apex,
             colfn=nova_cols(41 + i, grey=-0.25))
    for i, (c, r) in enumerate(TALUS):
        boulder(mb, c, r, seed=71 + i, n_lon=5, lats=(-30.0, 25.0), jit=0.15, yaw=17.0 * i,
                colfn=nova_cols(71 + i, grey=-0.25))
    o = mb.build('GoatRock', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    street = dict(cam_loc=(-17.0, -22.0, 1.6), target=(0.0, 3.5, 3.4), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-22.0, -30.0, 20.0), target=(0.0, 4.0, 2.5), lens=35.0),
           elev=dict(cam_loc=(0.0, -70.0, 3.5), target=(0.0, 0.0, 3.5), ortho_scale=21.0),
           rear=dict(cam_loc=(18.0, 26.0, 11.0), target=(0.0, 4.0, 2.5), lens=35.0))


main()
