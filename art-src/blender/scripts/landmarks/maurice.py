"""Maurice Bathhouse (1911-12, George Gleim Jr.; remodelled 1915 by Mann & Stern),
359 Central Ave (conflict: 355), Bathhouse Row, Hot Springs, Arkansas --
low-poly landmark, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/maurice.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/maurice.glb, art-src/blender/maurice.blend,
         art-src/blender/renders/maurice_*.png (git-ignored)

Conventions: see art-src/blender/README.md and fordyce.py. Origin = front-centre
at grade on the main three-storey front wall; the one-storey five-arch sun
porch projects in front of it (glTF z > 0). +X = south.

FACTS USED (research/ in the workspace root):
  bathhouse-row-layout.md table, row 3 (HABS AR-28 / AR-28-C, measured):
    frontage 89 ft (trivia) / ~91-92 ft (mahjong); OSM 94 x 110 ft
    3 stories + basement; 1-story 5-arch sun porch
    wing eaves ~36 ft; central glazed roof ~48 ft; penthouse ~56 ft
  visual-style-guide.md / bathhouse-row-and-springs.md, Maurice sections:
    stucco "inset with decorative colored tiles"; visible roof sections green
    tile, reading very dark green in 1984; hipped tile roofs on the end
    wings and a hipped, metal-framed glazed skylight roof over the centre
    (HABS); ochre and blue tile panels in the second-floor band [observed
    1984]; five-bay arched sun porch with "THE MAURICE" sign; "enormous
    rectangular openings on the third floor" (NHL).
  Hexes: stucco #F3EFE6, green tile #4E7D5B, sea-glass ramp #1F5F6B ->
    #7FC8B8 (visual-style-guide.md Maurice); tile-panel ochre #C8963E and
    blue #2B4C9B (guide swatches for the Row's ochre and cobalt tile).
  Shape check (not copied): HABS colour photos 570886c / 570888c (mahjong
    ref habs-maurice-facade.jpg; trivia photo-refs/maurice/) -- the green
    hipped eave wraps the whole perimeter with a flat top, the glazed hip
    rises over the centre five bays.

ESTIMATES:
  frontage 91 ft (inside both HABS readings); body depth 96 ft (OSM 110 ft
  minus a 14 ft sun porch)
  perimeter green hip: 3.5 ft overhang, rises from 36 ft to 41 ft with a
  2.6 m inset, flat built-up roof inside (HABS "glazed tile & built-up")
  glazed centre hip 14.8 x 10.8 m, eave 41.5 ft, ridge 48 ft (HABS)
  penthouse 4 x 4 m, set back 16 m, top 56 ft (HABS height)
  sun porch 63 ft wide, 14 ft deep, parapet 18 ft, sign parapet 19.5 ft;
  storey bands and window sizes
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403
from rowkit import *                                # noqa: E402,F401,F403

NAME = 'maurice'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 900

# ---------------------------------------------------------------- palette
C_WALL = C_STUCCO
C_SEA_D = hexc('#1F5F6B')          # sea-glass ramp, dark end
C_SEA_L = hexc('#7FC8B8')          # sea-glass ramp, light end
C_OCHRE = hexc('#C8963E')          # tile inset panels
C_BLUE = C_COBALT                  # tile inset panels
C_BAND = shade(C_STUCCO, 0.88)     # derived: string courses / porch cornice in shade
C_SIGN = shade(C_IRON, 1.6)        # derived: dark "THE MAURICE" sign board
C_FRAME = C_IRON                   # dark window frames and skylight frame
C_SOFFIT = shade(C_GREEN, 0.45)    # derived: eave underside, the dark green band seen from the street [obs. 1984]

# ---------------------------------------------------------------- dimensions (m)
W = 91 * FT                        # 27.74 frontage                 [HABS 89 / 91-92]
HW = W / 2
D = 96 * FT                        # 29.26 body depth               [est]
OVH = 3.5 * FT                     # 1.07 eave overhang             [est]
Z_BASE = 3 * FT                    # 0.91 raised ground floor       [est]
Z_SC = 7.30                        # string course (2nd/3rd floor)  [est]
Z_EAVE = 36 * FT                   # 10.97 wing eaves               [HABS ~36]
Z_HTOP = 41 * FT                   # 12.50 flat top of the green hip [est]
Z_GL0 = 41.5 * FT                  # 12.65 glazed hip eave          [est]
Z_GL1 = 48 * FT                    # 14.63 glazed hip ridge         [HABS ~48]
Z_PH = 56 * FT                     # 17.07 penthouse                [HABS ~56]
PW = 63 * FT                       # 19.20 sun-porch width          [est]
PD = 14 * FT                       # 4.27 sun-porch depth           [est]
Z_PTOP = 18 * FT                   # 5.49 porch parapet             [est]
Z_PSIGN = 19.5 * FT                # 5.94 sign parapet              [est]
CX = 7.4                           # half-width of the glazed centre [est]

FRONT = front_frame(0.0)
PFRONT = front_frame(-PD)
SOUTH = south_frame(HW)
NORTH = north_frame(-HW)
REAR = rear_frame(D)


def walls(mb):
    spec = [(Z_SKIRT, Z_BASE, 'trim', C_BAND), (Z_BASE, Z_SC, 'wall', C_WALL),
            (Z_SC + 0.3, Z_EAVE, 'wall', C_WALL)]
    banded_box(mb, -HW, HW, 0.0, D, spec)
    # projecting string course between the 2nd and 3rd floors
    cbox(mb, (-HW - 0.22, -0.22, Z_SC), (HW + 0.22, D + 0.22, Z_SC + 0.3), 'trim', C_BAND,
         skip=('+z',), cols={'-z': shade(C_BAND, 0.6)})
    mb.poly([(-HW - 0.22, -0.22, Z_SC + 0.3), (HW + 0.22, -0.22, Z_SC + 0.3),
             (HW + 0.22, D + 0.22, Z_SC + 0.3), (-HW - 0.22, D + 0.22, Z_SC + 0.3)],
            'trim', shade(C_BAND, 0.9), out=(0, 0, 1))


def roofs(mb):
    hip_frustum(mb, -HW - OVH, HW + OVH, -OVH, D + OVH, Z_EAVE, Z_HTOP, 2.6, 'roof', C_GREEN,
                fascia=0.42, col_fascia=shade(C_GREEN, 0.6), col_soffit=C_SOFFIT,
                top_col=C_FLATROOF)
    # hipped, metal-framed glazed skylight over the centre five bays
    hip_roof(mb, -CX, CX, 1.0, 11.8, Z_GL0, Z_GL1, 'glass', vgrad(C_SEA_L, C_SEA_D, Z_GL0, Z_GL1),
             fascia=0.35, col_fascia=C_FRAME, mat_fascia='trim', col_soffit=C_FRAME,
             mat_soffit='trim')
    # low curb walls under the glazed roof (fill the gap to the flat top)
    for a, b, out in (((-CX, 1.0), (CX, 1.0), (0, -1, 0)), ((CX, 1.0), (CX, 11.8), (1, 0, 0)),
                      ((-CX, 11.8), (-CX, 1.0), (-1, 0, 0))):
        vquad(mb, a, b, Z_HTOP - 0.9, Z_GL0 - 0.35, 'wall', C_WALL, out)
    # set-back penthouse
    body(mb, -2.0, 2.0, 16.0, 20.0, Z_HTOP - 0.1, Z_PH, 'wall', C_WALL)


def front(mb):
    # 2nd-floor band above the porch roof: small windows and tile insets
    xs = spaced(8, 2.3)
    for i, x in enumerate(xs):
        window(mb, FRONT, x, 0.95, 5.95, 6.85, C_WINDOW, d=0.08)
    for x in (-CX - 0.55, CX + 0.55):
        wrect(mb, FRONT, x - 0.25, x + 0.25, 5.90, 6.95, 'trim', C_OCHRE, 0.06)
    for s in (-1, 1):                         # end wings: windows on 3 floors + tiles
        for k, x in enumerate((s * 9.2, s * 12.0)):
            window(mb, FRONT, x, 1.0, 5.85, 6.95, C_WINDOW, d=0.08)
            window(mb, FRONT, x, 1.0, 8.25, 9.35, C_WINDOW, d=0.08)
            if abs(x) > PW / 2:
                window(mb, FRONT, x, 1.0, 1.9, 3.6, C_WINDOW, d=0.08)
        for x in (s * 10.6, s * 13.1):
            wrect(mb, FRONT, x - 0.32, x + 0.32, 5.85, 6.95, 'trim',
                  C_BLUE if abs(x) > 12 else C_OCHRE, 0.06)
    # "enormous rectangular openings" on the 3rd floor of the centre
    for x in spaced(5, 2.95):
        wrect(mb, FRONT, x - 1.28, x + 1.28, 7.75, 10.45, 'trim', C_FRAME, 0.04)
        window(mb, FRONT, x, 2.25, 7.85, 10.35, C_WINDOW, d=0.08, dark=0.6)


def porch(mb):
    y0 = -PD
    hx = PW / 2
    spec = [(Z_SKIRT, Z_BASE, 'trim', C_BAND), (Z_BASE, Z_PTOP - 0.7, 'wall', C_WALL),
            (Z_PTOP - 0.7, Z_PTOP - 0.45, 'trim', C_BAND), (Z_PTOP - 0.45, Z_PTOP, 'wall', C_WALL)]
    banded_box(mb, -hx, hx, y0, 0.0, spec, faces=('-y', '+x', '-x'))
    mb.poly([(-hx, y0, Z_PTOP), (hx, y0, Z_PTOP), (hx, 0, Z_PTOP), (-hx, 0, Z_PTOP)],
            'roof', C_FLATROOF, out=(0, 0, 1))
    # raised sign parapet
    fbox(mb, PFRONT, -2.1, 2.1, Z_PTOP, Z_PSIGN, -0.3, 0.0, 'wall', C_WALL,
         skip=('bottom',), cols={'top': C_BAND})
    wrect(mb, PFRONT, -1.25, 1.25, Z_PTOP - 0.40, Z_PTOP + 0.20, 'trim', C_SIGN, 0.04)
    # five arches with dark sun-parlour glazing
    for x in spaced(5, PW / 5):
        window(mb, PFRONT, x, 2.9, Z_BASE + 0.1, 4.45, C_WINDOW, arch=4, d=0.08, dark=0.5)
    for x, s in ((hx, 1), (-hx, -1)):
        fr = south_frame(x) if s > 0 else north_frame(x)
        window(mb, fr, s * (-PD / 2), 2.3, Z_BASE + 0.1, 4.2, C_WINDOW, arch=3, d=0.08, dark=0.5)
    # steps
    cbox(mb, (-1.9, y0 - 1.4, Z_SKIRT), (1.9, y0, Z_BASE * 0.6), 'trim', C_BAND, skip=('+y', '-z'))


def sides(mb):
    for fr, s in ((SOUTH, 1), (NORTH, -1)):
        for y in (3.5, 8.0, 12.5, 17.0, 21.5, 26.0):
            u = s * y
            window(mb, fr, u, 1.0, 8.25, 9.35, C_WINDOW, d=0.08)
            window(mb, fr, u, 1.0, 5.85, 6.95, C_WINDOW, d=0.08)
            window(mb, fr, u, 1.6, 1.9, 3.6, C_WINDOW, d=0.08)
        for y in (5.75, 14.75, 23.75):
            wrect(mb, fr, s * y - 0.9, s * y + 0.9, 5.95, 6.85, 'trim', C_BLUE, 0.06)
    for x in (-11.0, -5.5, 0.0, 5.5, 11.0):
        window(mb, REAR, -x, 1.0, 8.25, 9.35, C_WINDOW, d=0.06)
        window(mb, REAR, -x, 1.0, 5.85, 6.95, C_WINDOW, d=0.06)


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = order_mats(C_WALL, C_GREEN, C_BAND)
    mb = MB()
    walls(mb)
    roofs(mb)
    front(mb)
    porch(mb)
    sides(mb)
    o = mb.build('Maurice', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    street = dict(cam_loc=(-HW - 22.0, -25.0, 1.6), target=(-1.0, 8.0, 6.5), lens=28.0)
    finish(NAME, o, TRI_BUDGET, ARGS, street,
           aerial=dict(cam_loc=(-32.0, -42.0, 28.0), target=(0.0, 10.0, 6.0), lens=35.0),
           elev=dict(cam_loc=(0.0, -80.0, 8.5), target=(0.0, 0.0, 8.5), ortho_scale=36.0),
           rear=dict(cam_loc=(30.0, 66.0, 24.0), target=(0.0, 12.0, 6.0), lens=35.0))


main()
