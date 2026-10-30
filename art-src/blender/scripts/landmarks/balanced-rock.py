"""Balanced Rock, on the Sugarloaf ridge (Sunset Trail, Sugarloaf Mountain
section), Hot Springs National Park, Arkansas -- a novaculite outcrop with a
perched boulder; low-poly landmark, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/balanced-rock.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/balanced-rock.glb, art-src/blender/balanced-rock.blend,
         art-src/blender/renders/balanced-rock_*.png (git-ignored)

Conventions: see art-src/blender/README.md. A rock has no wall line:
ORIGIN = front-centre of the outcrop at grade (the foot of its trail-side
face), that face toward glTF +Z (Blender -Y); the mass runs back to glTF
z < 0. Blocks go 0.5 m below grade (the README skirt) so the model sits on
the sloping ridge. Material slots: wall = rock faces (a tiling novaculite
texture can go here later), trim = the shaded undersides; no roof, no glass.

FACTS USED:
  games/Cart Racing/research/town-content.md section 4 (NPS Sunset Trail
    page, nps.gov/hosp/planyourvisit/sunset-trail.htm): the Sugarloaf
    section between Black Snake Rd and Cedar Glades Rd includes Balanced
    Rock, a novaculite outcrop.
  geography-lakes-mountains.md "Novaculite" and visual-style-guide.md
    (ancient era): novaculite is a dense, hard, recrystallized chert, white
    to grayish-black (often white or light gray; also pink, red, tan),
    conchoidal fracture, resists erosion and forms prominent ridges; look
    [inferred]: "white and pink novaculite outcrops as pale angular ridges".
  Task brief: an outcrop with a perched boulder; novaculite #EDEAE2.

PALETTE (visual-style-guide.md P1 ouachita-forest, hex est.): novaculite
  white #EDEAE2; derived in landkit.py: light grey (white 18 % toward
  shale #2B2A27), pink (white 55 % toward rose #C99A92), shaded undersides
  (grey x 0.62). Facets pick white / grey / pink by a fixed hash; tops are
  always white.

ESTIMATES (the research gives no size or shape):
  outcrop about 10 m along the trail x 6 m deep, angular blocks 0.7-2.3 m
  high leaning slightly back (steep bedding), kept low round the pedestal
  so the neck shows
  pedestal 2.0 x 1.8 m at the base narrowing to about 1.0 x 1.0 m at 3.0 m
  perched boulder about 4.4 x 3.4 x 2.9 m resting on one contact point on
  the pedestal top, overhanging toward the trail; top at about 5.9 m; only
  its most downward faces (normal z < -0.7) get the shaded underside
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403
from landkit import *                               # noqa: E402,F401,F403

NAME = 'balanced-rock'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 300

# blocks: (cx, cy, w, d, h, yaw, lean, taper, apex)           all [est]
BLOCKS = [
    (-3.5, 1.4, 2.6, 2.4, 2.2, 12.0, (0.3, 0.3), (0.6, 0.7), (0.2, 0.0, 0.6)),
    (-1.9, 3.1, 2.4, 2.8, 2.3, -8.0, (0.1, 0.4), (0.65, 0.6), None),
    (2.5, 2.7, 2.6, 2.6, 2.0, 20.0, (-0.2, 0.3), (0.6, 0.65), (-0.3, 0.1, 0.5)),
    (4.1, 1.6, 2.0, 2.2, 1.5, -15.0, (0.0, 0.3), (0.7, 0.7), None),
    (-2.6, 4.9, 3.0, 2.0, 1.5, 6.0, (0.0, 0.2), (0.7, 0.7), (0.4, 0.0, 0.3)),
    (1.0, 4.9, 3.4, 2.2, 1.9, -4.0, (0.0, 0.3), (0.7, 0.7), None),
    (4.6, 0.3, 1.4, 1.4, 0.9, 30.0, (0.0, 0.0), (0.7, 0.7), None),
    (-4.7, 0.4, 1.3, 1.2, 0.7, -20.0, (0.0, 0.0), (0.7, 0.7), None),
]
PED = (0.4, 1.4, 2.0, 1.8, 3.0, 5.0, (0.1, -0.1), (0.5, 0.55), None)
Z_PED = 3.0
BOULDER_C = (0.65, 1.15, Z_PED + 1.35)
BOULDER_R = (2.2, 1.7, 1.45)
CONTACT = (0.45, 1.3, Z_PED - 0.05)


def build():
    reset()
    mats = order_mats(C_NOVA, C_NOVA, C_NOVA_UNDER)
    mb = MB()
    for i, (cx, cy, w, d, h, yaw, lean, taper, apex) in enumerate(BLOCKS):
        slab(mb, cx, cy, w, d, h, seed=11 + i, yaw=yaw, lean=lean, taper=taper, apex=apex)
    cx, cy, w, d, h, yaw, lean, taper, apex = PED
    slab(mb, cx, cy, w, d, h, seed=7, yaw=yaw, lean=lean, taper=taper, apex=apex, jit=0.05)
    boulder(mb, BOULDER_C, BOULDER_R, seed=3, n_lon=7, lats=(-45.0, -5.0, 35.0), jit=0.13,
            yaw=10.0, bottom=CONTACT, colfn=nova_cols(3, under=-0.7))
    o = mb.build('BalancedRock', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    street = dict(cam_loc=(-11.0, -15.0, 1.6), target=(0.0, 2.5, 2.4), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-14.0, -19.0, 13.0), target=(0.0, 2.5, 1.8), lens=35.0),
           elev=dict(cam_loc=(0.0, -60.0, 3.0), target=(0.0, 0.0, 3.0), ortho_scale=13.0),
           rear=dict(cam_loc=(12.0, 18.0, 7.0), target=(0.0, 2.5, 2.2), lens=35.0))


main()
