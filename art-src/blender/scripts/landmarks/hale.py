"""Hale Bathhouse (1892-93, George and Fremont Orff; Mann & Stern remodel 1914
or 1919; Mission facade 1939-40 by Thompson, Sanders & Ginocchio), 341 Central
Ave, Bathhouse Row, Hot Springs, Arkansas -- low-poly landmark, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/hale.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/hale.glb, art-src/blender/hale.blend,
         art-src/blender/renders/hale_*.png (git-ignored)

Conventions: see art-src/blender/README.md and fordyce.py. Origin = front-centre
at grade on the main two-storey front wall, behind the one-storey porch
(porch, pent roof and bell gable sit at glTF z > 0). +X = south.

FACTS USED (research/ in the workspace root):
  bathhouse-row-layout.md table, row 2 (HABS AR-28 / AR-28-B, measured):
    frontage 116 ft (trivia) vs ~123-127 ft (mahjong) -- conflict; OSM
    123 x 81 ft. 2 stories under the hip roof (NHL "two and one half")
    eaves ~23 ft; hip ridge ~37-38 ft; "HALE" bell gable on the porch ~15 ft
  visual-style-guide.md / bathhouse-row-and-springs.md, Hale sections:
    "a great-hipped roof of red tile" on all four sides; brick stuccoed over
    1939; double-curved name parapet / Spanish bell gable sitting LOW on the
    one-storey porch over the door (HABS), porch with a tile pent roof;
    the main hip has a second hip at the south end and two ventilator cowls;
    12 arched second-floor windows; wrought-iron grilles on the two windows
    beside the door. 1984 photo: white stucco, orange-red tile, rust-red trim.
  Hexes: stucco #F3EFE6, red tile #A9432C / shadow course #7E2F1F,
    wrought iron #1F2A24 (visual-style-guide.md Hale).
  Shape check (not copied): HABS colour photo 571935c (mahjong ref
    habs-hale-facade.jpg) and Highsmith 2020 (trivia photo-refs/hale/).

ESTIMATES:
  frontage 123 ft: the mahjong HABS elevation reading (123-127) agrees with
  OSM's 123 ft; the trivia streetscape reading (116 ft) is the outlier
  main block depth 60 ft; porch 10 ft deep, full width, wall top 11 ft,
  pent rising to 13.1 ft at the main wall; eave overhang 3 ft
  bell gable 5 m wide, crown 16 ft (HABS ~15 +-1-2; the 1984 photo puts the
  crown just above the second-floor sills)
  "second hip at the south end" modelled as a lower hip-roofed rear wing
  (12 x 6 m, ridge 33 ft) at the south end -- position and size estimated
  ventilator cowls: 0.9 m hexagonal drums near the ridge ends
  window sizes and spacing (12 upper windows as six pairs)
  rust-red trim -> soffits in the shadow-course hex x 0.8
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403

NAME = 'hale'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 900

# ---------------------------------------------------------------- palette
C_WALL = C_STUCCO
C_RUST = shade(C_TILE_SH, 0.80)    # derived: rust-red trim / soffits [observed 1984]
C_BASE = shade(C_STUCCO, 0.86)     # derived: water-table band
C_PLAQUE = shade(C_STUCCO, 0.80)   # derived: raised "HALE" plaque reads as a shadowed panel

# ---------------------------------------------------------------- dimensions (m)
W = 123 * FT                       # 37.49 frontage                 [HABS mahjong / OSM]
HW = W / 2
D = 60 * FT                        # 18.29 main block depth         [est]
OVH = 3 * FT                       # 0.91 eave overhang             [est]
Z_EAVE = 23 * FT                   # 7.01 tile eave                 [HABS ~23]
Z_RIDGE = 37.5 * FT                # 11.43 hip ridge                [HABS ~37-38]
PD = 10 * FT                       # 3.05 porch depth               [est]
Z_PWALL = 11 * FT                  # 3.35 porch wall top            [est]
Z_PENT = 13.1 * FT                 # 3.99 pent at the main wall     [est]
Z_GABLE = 16 * FT                  # 4.88 bell-gable crown          [HABS ~15]
GHW = 2.5                          # bell-gable half-width          [est]
SW_X0, SW_Y1 = HW - 12.0, D + 6.0  # south rear wing                [est]
Z_SW_RIDGE = 33 * FT               # 10.06                          [est]

FRONT = front_frame(0.0)
PFRONT = front_frame(-PD)
SOUTH = south_frame(HW)
NORTH = north_frame(-HW)
REAR = rear_frame(D)

SPEC = [(Z_SKIRT, 0.55, 'trim', C_BASE), (0.55, Z_EAVE, 'wall', C_WALL)]


def walls(mb):
    bands(mb, (-HW, 0.0), (HW, 0.0), (0, -1, 0), [(Z_PENT - 0.1, Z_EAVE, 'wall', C_WALL)])
    banded_box(mb, -HW, HW, 0.0, D, SPEC, faces=('+x', '-x', '+y'))
    # south rear wing ("second hip")
    banded_box(mb, SW_X0, HW, D, SW_Y1, SPEC, faces=('+x', '+y', '-x'))


def roofs(mb):
    hip_roof(mb, -HW - OVH, HW + OVH, -OVH, D + OVH, Z_EAVE, Z_RIDGE, 'roof', C_TILE,
             fascia=0.25, col_fascia=C_TILE_SH, col_soffit=C_RUST, mat_soffit='trim')
    hip_roof(mb, SW_X0 - OVH, HW + OVH, D + OVH, SW_Y1 + OVH, Z_EAVE, Z_SW_RIDGE, 'roof',
             C_TILE, fascia=0.25, col_fascia=C_TILE_SH, col_soffit=C_RUST, mat_soffit='trim')
    # two ventilator cowls near the ridge ends
    r0 = (D + 2 * OVH) / 2
    for x in (-HW - OVH + r0 + 1.5, HW + OVH - r0 - 1.5):
        ngon_prism(mb, x, D / 2, 0.45, Z_RIDGE - 0.3, Z_RIDGE + 0.75, 6, 'roof', C_TILE,
                   top_col=C_TILE_SH)


def upper_windows(mb):
    pairs = spaced(6, W / 6)
    for c in pairs:
        for k in (-1, 1):
            window(mb, FRONT, c + k * 1.0, 1.25, 4.55, 6.35, C_WINDOW, arch=3, d=0.08)
            wpoly(mb, FRONT, [(c + k * 1.0 - 0.8, 4.40), (c + k * 1.0 + 0.8, 4.40),
                              (c + k * 1.0 + 0.8, 4.52), (c + k * 1.0 - 0.8, 4.52)],
                  'trim', C_BASE, 0.05)
    for fr, s in ((SOUTH, 1), (NORTH, -1)):
        for y in (3.0, 7.5, 12.0, 16.0):
            window(mb, fr, s * y, 1.2, 4.55, 6.35, C_WINDOW, arch=3, d=0.08)
            window(mb, fr, s * y, 1.5, 1.0, 3.0, C_WINDOW, arch=3, d=0.08)
    for x in (-15.0, -9.0, -3.0, 3.0, 9.0):
        window(mb, REAR, -x, 1.2, 4.55, 6.35, C_WINDOW, d=0.06)
        window(mb, REAR, -x, 1.3, 1.2, 3.0, C_WINDOW, d=0.06)


def porch(mb):
    y0 = -PD
    pspec = [(Z_SKIRT, 0.55, 'trim', C_BASE), (0.55, Z_PWALL, 'wall', C_WALL)]
    banded_box(mb, -HW, HW, y0, 0.0, pspec, faces=('-y', '+x', '-x'))
    # tile pent, broken by the bell gable over the door
    ye = y0 - 0.45
    for xa, xb in ((-HW - 0.45, -GHW), (GHW, HW + 0.45)):
        pent(mb, xa, xb, 0.0, ye, Z_PENT, Z_PWALL + 0.08, C_TILE, C_TILE_SH, fascia=0.16,
             col_soffit=C_RUST)
    # bell gable: double-curved parapet in the porch front plane
    half = [(1.0, 0.70), (0.80, 0.80), (0.64, 1.10), (0.46, 1.40), (0.22, 1.50)]
    outline = [(u, Z_PWALL + v) for u, v in sym_outline(0.0, GHW, 0.0, half, Z_GABLE - Z_PWALL)]
    outline_prism(mb, PFRONT, outline, 0.45, 'wall', C_WALL, 'trim', C_BASE, skip_edges=(0,))
    wrect(mb, PFRONT, -1.05, 1.05, 3.62, 4.05, 'trim', C_PLAQUE, 0.04)
    # entrance and the two iron-grilled windows
    window(mb, PFRONT, 0.0, 2.1, 0.55, 3.05, C_IRON, d=0.08, dark=0.7)
    for s in (-1, 1):
        window(mb, PFRONT, s * 2.35, 1.0, 1.15, 2.55, C_WINDOW, d=0.06)
        wrect(mb, PFRONT, s * 2.35 - 0.6, s * 2.35 + 0.6, 1.05, 2.70, 'glass', C_IRON, 0.10)
        for k in range(4):
            u = s * (5.0 + k * 3.45)
            window(mb, PFRONT, u, 2.1, 0.80, 2.95, C_WINDOW, arch=3, d=0.08)
    for fr, s in ((SOUTH, 1), (NORTH, -1)):
        window(mb, fr, s * (-PD / 2), 1.7, 0.80, 2.95, C_WINDOW, arch=3, d=0.08)
    # steps
    cbox(mb, (-1.6, y0 - 1.1, Z_SKIRT), (1.6, y0, 0.30), 'trim', C_BASE, skip=('+y', '-z'))


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_WALL, C_TILE, C_BASE)
    mb = MB()
    walls(mb)
    roofs(mb)
    upper_windows(mb)
    porch(mb)
    o = mb.build('Hale', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    street = dict(cam_loc=(-HW - 22.0, -26.0, 1.6), target=(-2.0, 6.0, 5.0), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-36.0, -44.0, 26.0), target=(0.0, 9.0, 4.0), lens=35.0),
           elev=dict(cam_loc=(0.0, -80.0, 6.0), target=(0.0, 0.0, 6.0), ortho_scale=44.0),
           rear=dict(cam_loc=(34.0, 60.0, 22.0), target=(0.0, 10.0, 4.0), lens=35.0))


main()
