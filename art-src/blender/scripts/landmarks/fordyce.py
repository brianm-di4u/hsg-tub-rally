"""Fordyce Bathhouse (1914-15, Mann & Stern), 369 Central Ave, Bathhouse Row,
Hot Springs, Arkansas -- low-poly landmark pilot, early-N64 look.

Run (from the repo root, one line):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/landmarks/fordyce.py -- [--no-render] [--checks]

Outputs: art-src/blender/export/fordyce.glb, art-src/blender/fordyce.blend,
         art-src/blender/renders/fordyce_*.png (git-ignored)

Conventions (shared by every landmark script; see art-src/blender/README.md):
  metres; authored Z-up in Blender, exported Y-up (glTF).
  Origin = front-centre of the building at street-facing grade, on the main
  front wall line (here: the face of the two end pavilions).
  X runs along the street frontage. +X = south along Central Ave, -X = north.
  The facade faces the street: Blender -Y == glTF +Z. Projections (eaves,
  porch, steps, marquee) sit at glTF z > 0; the building body at z < 0.
  The base skirt continues 0.5 m below grade for uneven terrain.

FACTS USED (research/ in the workspace root):
  bathhouse-row-layout.md table, row 4 (HABS AR-28-D, measured +/-1-2 ft):
    frontage 101 ft wall-to-wall, 110 ft at the eaves (Fordyce sheet)
    OSM bounding rectangle 104 x 94 ft (porch and rear wings included)
    3 stories + basement
    end-pavilion eaves ~39-40 ft, hip peaks ~45 ft, centre parapet ~45-46 ft,
    corner piers ~49 ft, set-back penthouse and skylight ~57 ft
  bathhouse-row-and-springs.md / visual-style-guide.md, Fordyce sections:
    cream first story (enamel brick, rusticated terra cotta), upper two
    stories light-yellow pressed brick with dark-brown lozenge (diamond) bond;
    Batesville limestone foundation and porch; two low red-tile hipped end
    pavilions with a flat centre; set-back hipped skylight/penthouse;
    Spanish curvilinear parapets on the north and south end walls (one with a
    quatrefoil vent); stained glass and copper marquee with a Greek-motif
    parapet (reads dark verdigris/bronze in 1984); seven bays; arched
    3rd-floor openings under a terra cotta frieze; ivory terra cotta window
    surrounds.
  Hexes: visual-style-guide.md Fordyce + material swatches (all "est." there).
  Shape check: HABS colour photo 570630c (Fordyce from the NW, 1984), local
  copy games/mahjong/benchmarks/ref/habs-fordyce-facade-nw.jpg -- red tile
  only on the pavilions, dark centre roof edge, north gable just behind the
  pavilion roof, ivory surround strips, marquee across the five centre bays.

ESTIMATES (not in the research; picked from the 1984 HABS photo
hhh.ar0035.color.570630c proportions or plausible values):
  main-block depth 84 ft (OSM 94 ft minus ~10 ft front porch)
  limestone base 3.5 ft; cream ground storey to 20 ft; frieze from 36 ft
  pavilion width 17 ft (corner pier + one bay), projection 2 ft, depth 25 ft
  centre pent rises to 45 ft (HABS centre parapet 45-46 ft; 45 keeps it
  tucked under the 45 ft hip peaks) and reaches 3.2 m behind the centre wall
  curvilinear gables 10 m wide, centred 14 m back (just behind the pavilion
  roof, as in the photo), crown 49 ft
  penthouse 10 x 8 m, set back 6 m, walls to ~50.5 ft, glazed hip to 57 ft
  porch 1.07 m high, 2.6 m deep; marquee 19.6 m wide, 3.05 m deep,
  4.75-5.30 m above grade; window sizes; lozenge coverage 35 %
"""
import os
import sys

sys.dont_write_bytecode = True                      # no __pycache__ in art-src
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # art-src/blender/scripts
from common import *                                # noqa: E402,F401,F403

NAME = 'fordyce'
FT = 0.3048
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
TRI_BUDGET = 900

# ---------------------------------------------------------------- palette
# visual-style-guide.md, Fordyce "Hexes (est.)" and material swatches.
C_CREAM = hexc('#E6D7B5')     # cream first-story enamel brick / ivory terra cotta
C_YBRICK = hexc('#E3CF94')    # light-yellow pressed brick (field)
C_DIAMOND = hexc('#6E4B2F')   # dark brown diamond brick
C_TC = hexc('#C46A3E')        # terra cotta
C_LIME = hexc('#CFC6B2')      # Batesville limestone
C_TILE = hexc('#A9432C')      # red clay tile
C_TILE_SH = hexc('#7E2F1F')   # red tile shadow course
C_VERD = hexc('#5E9C8C')      # verdigris (aged copper marquee)
C_COPPER = hexc('#B87333')    # copper
C_COBALT = hexc('#2B4C9B')    # stained-glass cobalt (window glass)
C_AMBER = hexc('#D9A23A')     # amber glass (marquee roof glass)
C_SEA_M = hexc('#2A9D8F')     # sea-glass ramp (skylight)
C_SEA_L = hexc('#7FC8B8')
C_MORTAR = hexc('#CDBF9F')    # mortar
C_LEAD = hexc('#2A2A2A')      # lead came (vent openings)
# Derived (documented): the lozenge diaper averaged at distance (35 % dark
# brick, plain sRGB average as a gamma-space mip of the pattern would give)
# -- the golden buff of the 1984 photo. The 64x64 facade texture replaces
# this later.
C_LOZENGE = mix(C_YBRICK, C_DIAMOND, 0.35)
C_FLATROOF = shade(C_MORTAR, 0.62)                  # built-up roofing, derived
# The centre roof edge reads dark grey in the 1984 photo, red tile only on the
# pavilions [observed]; hex derived from mortar so the twin red hips stand out.
C_ROOF_DARK = shade(C_MORTAR, 0.42)
C_SOFFIT = shade(C_TC, 0.70)                        # shaded terra cotta eave soffit
C_MARQ = shade(C_VERD, 0.70)                        # dark verdigris/bronze marquee
C_GLASS = shade(C_COBALT, 0.80)

# ---------------------------------------------------------------- dimensions (m)
W = 101 * FT                    # 30.78 wall-to-wall          [HABS AR-28-D]
HW = W / 2
OVH = (110 - 101) / 2 * FT      # 1.37 eave overhang (110 ft at eaves) [HABS]
D = 84 * FT                     # 25.60 main block depth      [est]
PW = 17 * FT                    # 5.18 pavilion width         [est]
PROJ = 2 * FT                   # 0.61 pavilion projection    [est]
PD = 25 * FT                    # 7.62 pavilion depth         [est]
CX = HW - PW                    # 10.21 half-width of the centre block
BAY = 2 * CX / 5                # 4.08 centre bay pitch (7 bays = 1 + 5 + 1)
PAV_X = CX + BAY / 2            # 12.25 pavilion window axis

Z_SKIRT = -0.5                  # below-grade skirt
Z_BASE = 3.5 * FT               # 1.07 limestone base / porch floor [est]
Z_GF = 20 * FT                  # 6.10 top of cream ground storey   [est]
Z_FRIEZE = 36 * FT              # 10.97 frieze bottom               [est]
Z_SOFFIT = 39 * FT              # 11.89 eave soffit                 [HABS 39-40]
Z_WALL = 12.10                  # wall top / flat roof (hidden under eaves)
Z_EAVE = 40 * FT                # 12.19 tile starts                 [HABS 39-40]
Z_HIP = 45 * FT                 # 13.72 hip peaks / pent top        [HABS]
Z_GABLE = 49 * FT               # 14.94 curvilinear parapet crown   [HABS "piers"]
Z_PH_WALL = 50.5 * FT           # 15.39 penthouse wall top          [est]
Z_PH_TOP = 57 * FT              # 17.37 penthouse/skylight peak     [HABS]

PENT_Y = PROJ + 3.2             # pent top line, behind the centre wall [est]
GY = 14.0                       # gable centre (depth from the front)   [est]
GHW = 5.0                       # gable half-width                      [est]
PH_X, PH_Y0, PH_Y1 = 5.0, 6.0, 14.0   # penthouse half-width and depth  [est]

MX = CX - 0.40                  # marquee half-width (spans the 5 centre bays)
M_DEPTH = 10 * FT               # 3.05 marquee projection from the centre wall
M_Z0, M_Z1 = 4.75, 5.30         # marquee underside / top
PX = CX - 0.25                  # porch half-width
P_FRONT = PROJ - 2.6            # porch front edge (y)

# Window panels (offsets off the wall plane, metres)
D_SURR, D_GLASS = 0.05, 0.10

BAND_FULL = [(Z_SKIRT, Z_BASE, 'trim', C_LIME),
             (Z_BASE, Z_GF, 'trim', C_CREAM),
             (Z_GF, Z_FRIEZE, 'wall', C_LOZENGE),
             (Z_FRIEZE, Z_WALL, 'trim', C_CREAM)]

# Wall frames: u runs left->right seen from outside; see Frame in common.py.
FRONT = Frame((0, 0), (1, 0))            # pavilion fronts, y = 0, u = x
CENTRE = Frame((0, PROJ), (1, PROJ))     # recessed centre wall, u = x
SOUTH = Frame((HW, 0), (HW, 1))          # +x end wall, u = y
NORTH = Frame((-HW, 0), (-HW, -1))       # -x end wall, u = -y
REAR = Frame((0, D), (-1, D))            # back wall, u = -x


# ---------------------------------------------------------------- parts
def walls(mb):
    # pavilion fronts and their short returns to the recessed centre
    for s in (-1, 1):
        a, b = sorted([(s * HW, 0.0), (s * CX, 0.0)])
        bands(mb, a, b, (0, -1, 0), BAND_FULL)
        bands(mb, (s * CX, 0.0), (s * CX, PROJ), (-s, 0, 0), BAND_FULL)
    # centre wall (its base is hidden by the porch deck)
    bands(mb, (-CX, PROJ), (CX, PROJ), (0, -1, 0), BAND_FULL[1:])
    # end walls (the brick runs straight up into the curvilinear gable, so
    # the frieze band is interrupted under it) and back
    for s in (-1, 1):
        bands(mb, (s * HW, 0.0), (s * HW, D), (s, 0, 0), BAND_FULL[:3])
        g0, g1 = GY - GHW, GY + GHW
        for y0, y1, m, c in ((0.0, g0, 'trim', C_CREAM), (g0, g1, 'wall', C_LOZENGE),
                             (g1, D, 'trim', C_CREAM)):
            vquad(mb, (s * HW, y0), (s * HW, y1), Z_FRIEZE, Z_WALL, m, c, (s, 0, 0))
    bands(mb, (-HW, D), (HW, D), (0, 1, 0), BAND_FULL)


def bay(mb, fr, u):
    """One upper-storey bay: ivory terra cotta surround strip running up into
    the frieze, 2nd-floor window, balcony at the 3rd-floor sill, arched
    3rd-floor window."""
    wrect(mb, fr, u - 1.0, u + 1.0, Z_GF + 0.25, Z_FRIEZE, 'trim', C_CREAM, D_SURR)
    window(mb, fr, u, 1.15, 6.75, 8.55, C_GLASS, d=D_GLASS)
    fbox(mb, fr, u - 0.95, u + 0.95, 8.80, 9.30, D_SURR, D_SURR + 0.50, 'trim', C_CREAM,
         cols={'bottom': shade(C_CREAM, 0.70), 'top': shade(C_CREAM, 0.92)})
    window(mb, fr, u, 1.15, 9.50, 10.75, C_GLASS, arch=3, d=D_GLASS)


def front(mb):
    for k in range(-2, 3):                       # five centre bays
        bay(mb, CENTRE, k * BAY)
        # open entrance porch: tall dark doors/windows behind the marquee
        window(mb, CENTRE, k * BAY, 2.4, Z_BASE, 4.55, C_GLASS, d=0.06, dark=0.5)
    for s in (-1, 1):                            # pavilion bays
        bay(mb, FRONT, s * PAV_X)
        window(mb, FRONT, s * PAV_X, 1.5, 2.0, 4.6, C_GLASS, d=0.06)


def porch_and_marquee(mb):
    cbox(mb, (-PX, P_FRONT, Z_SKIRT), (PX, PROJ, Z_BASE), 'trim', C_LIME,
         skip=('+y', '-z'), cols={'+z': shade(C_LIME, 0.92)})
    cbox(mb, (-2.4, P_FRONT - 0.9, Z_SKIRT), (2.4, P_FRONT, 0.55), 'trim', C_LIME,
         skip=('+y', '-z'))
    # stained glass and copper marquee: verdigris box, amber glass roof
    fbox(mb, CENTRE, -MX, MX, M_Z0, M_Z1, 0.0, M_DEPTH, 'trim', C_MARQ,
         mats={'top': 'glass'},
         cols={'top': C_AMBER, 'bottom': shade(C_MARQ, 0.6)})
    # Greek-motif parapet as a sawtooth cresting (tall/short alternating)
    yf = PROJ - M_DEPTH + 0.04
    n = 22
    for i in range(n):
        x0 = -MX + 2 * MX * i / n
        x1 = -MX + 2 * MX * (i + 1) / n
        h = 0.50 if i % 2 == 0 else 0.30
        mb.poly([(x0, yf, M_Z1), (x1, yf, M_Z1), ((x0 + x1) / 2, yf, M_Z1 + h)],
                'trim', C_MARQ, out=(0, -1, 0))
    for s in (-1, 1):
        xs = s * (MX - 0.04)
        for i in range(3):
            y0 = PROJ - M_DEPTH * i / 3
            y1 = PROJ - M_DEPTH * (i + 1) / 3
            h = 0.50 if i % 2 == 0 else 0.30
            mb.poly([(xs, y0, M_Z1), (xs, y1, M_Z1), (xs, (y0 + y1) / 2, M_Z1 + h)],
                    'trim', C_MARQ, out=(s, 0, 0))


def ends_and_rear(mb):
    for fr, sgn in ((SOUTH, 1), (NORTH, -1)):
        uc = sgn * GY
        bay(mb, fr, uc)                          # arched window under the gable
        for y in (20.6, 23.6):
            u = sgn * y
            window(mb, fr, u, 1.0, 6.9, 8.5, C_GLASS)
            window(mb, fr, u, 1.0, 9.4, 10.6, C_GLASS)
        for y in (GY, 20.6, 23.6):
            window(mb, fr, sgn * y, 1.2, 2.2, 4.2, C_GLASS)
    for x in (-12.8, -7.7, -2.6, 2.6, 7.7, 12.8):
        window(mb, REAR, -x, 1.1, 6.9, 8.5, C_GLASS)
        window(mb, REAR, -x, 1.1, 9.4, 10.6, C_GLASS)
    for x in (-11.0, -4.0, 4.0, 11.0):
        window(mb, REAR, -x, 1.2, 2.2, 4.2, C_GLASS)


# Half profile of the curvilinear parapet, traced from the HABS photo: low
# shoulder ledge, concave-convex "ear", small step, round crown.
# (fraction of the half-width, metres above the wall top)
_GHALF = [(1.0, 0.75), (0.85, 0.75), (0.74, 1.0), (0.67, 1.55), (0.60, 1.95),
          (0.49, 2.05), (0.38, 2.5), (0.20, 2.75)]
GABLE = ([(-GHW, 0.0), (GHW, 0.0)] + [(f * GHW, v) for f, v in _GHALF] +
         [(0.0, Z_GABLE - Z_WALL)] + [(-f * GHW, v) for f, v in reversed(_GHALF)])


def gables(mb):
    """Spanish curvilinear parapets on the north and south end walls, lozenge
    brick with an ivory coping, quatrefoil vent."""
    for fr, sgn in ((SOUTH, 1), (NORTH, -1)):
        uc = sgn * GY
        outline_prism(mb, fr, [(uc + u, Z_WALL + v) for u, v in GABLE], 0.35,
                      'wall', C_LOZENGE, 'trim', C_CREAM, skip_edges=(0,))
        vc = Z_WALL + 1.45
        wpoly(mb, fr, star_uv(uc, vc, 0.62, 0.62, 4, math.pi / 8), 'trim', C_CREAM, 0.04)
        wpoly(mb, fr, star_uv(uc, vc, 0.48, 0.30, 4), 'glass', C_LEAD, 0.08)


def roofs(mb):
    fascia = Z_EAVE - Z_SOFFIT
    # twin low red-tile hipped end pavilions
    for s in (-1, 1):
        xa, xb = sorted([s * (HW + OVH), s * (CX - OVH)])
        hip_roof(mb, xa, xb, -OVH, PD + OVH, Z_EAVE, Z_HIP, 'roof', C_TILE,
                 fascia=fascia, col_fascia=C_TILE_SH, mat_fascia='roof',
                 col_soffit=C_SOFFIT, mat_soffit='trim')
    # flat centre: a tile pent from the deep front eave up to the parapet
    # line, flat roof behind it
    pr = HW - PW / 2              # runs into the pavilion hips (hidden ends)
    pi = CX - OVH                 # inner edge of the pavilion eaves
    yf = PROJ - OVH
    mb.poly([(-pr, yf, Z_EAVE), (pr, yf, Z_EAVE), (pr, PENT_Y, Z_HIP), (-pr, PENT_Y, Z_HIP)],
            'roof', C_ROOF_DARK, out=(0, -1, 1))
    vquad(mb, (-pi, yf), (pi, yf), Z_SOFFIT, Z_EAVE, 'roof', shade(C_ROOF_DARK, 0.75), (0, -1, 0))
    mb.poly([(-pi, yf, Z_SOFFIT), (pi, yf, Z_SOFFIT), (pi, PROJ, Z_SOFFIT), (-pi, PROJ, Z_SOFFIT)],
            'trim', C_SOFFIT, out=(0, 0, -1))
    vquad(mb, (-pr, PENT_Y), (pr, PENT_Y), Z_WALL, Z_HIP, 'wall', C_LOZENGE, (0, 1, 0))
    mb.poly([(-HW, 0, Z_WALL), (HW, 0, Z_WALL), (HW, D, Z_WALL), (-HW, D, Z_WALL)],
            'roof', C_FLATROOF, out=(0, 0, 1))
    # set-back penthouse with a glazed hipped skylight roof
    for a, b, out in (((-PH_X, PH_Y0), (PH_X, PH_Y0), (0, -1, 0)),
                      ((PH_X, PH_Y0), (PH_X, PH_Y1), (1, 0, 0)),
                      ((PH_X, PH_Y1), (-PH_X, PH_Y1), (0, 1, 0)),
                      ((-PH_X, PH_Y1), (-PH_X, PH_Y0), (-1, 0, 0))):
        vquad(mb, a, b, Z_WALL, Z_PH_WALL, 'wall', C_LOZENGE, out)
    o = 0.35
    hip_roof(mb, -PH_X - o, PH_X + o, PH_Y0 - o, PH_Y1 + o, Z_PH_WALL, Z_PH_TOP, 'glass',
             vgrad(C_SEA_L, C_SEA_M, Z_PH_WALL, Z_PH_TOP),
             fascia=0.25, col_fascia=C_MARQ, mat_fascia='trim',
             col_soffit=shade(C_MARQ, 0.6), mat_soffit='trim')


# ---------------------------------------------------------------- build
def build():
    reset()
    mats = {
        'wall': mat('wall', C_LOZENGE, rough=0.9, spec=0.2, vcol=True),
        'roof': mat('roof', C_TILE, rough=0.8, spec=0.25, vcol=True),
        'trim': mat('trim', C_CREAM, rough=0.85, spec=0.2, vcol=True),
        'glass': mat('glass', C_COBALT, rough=0.3, spec=0.5, vcol=True),
    }
    mb = MB()
    walls(mb)
    front(mb)
    porch_and_marquee(mb)
    ends_and_rear(mb)
    gables(mb)
    roofs(mb)
    o = mb.build('Fordyce', mats, vcol=True, order=['wall', 'roof', 'trim', 'glass'])
    box_uv(o, unit=4.0)
    return o


def main():
    o = build()
    tris = tri_count([o])
    by_mat = tri_count_by_material(o)
    print('@@TRIS %d %s' % (tris, by_mat))
    if tris > TRI_BUDGET:
        raise SystemExit('triangle budget exceeded: %d > %d' % (tris, TRI_BUDGET))
    glb = export_glb(NAME, [o], texcoords=True)
    blend = save_blend(NAME)
    report(NAME, [o], glb)
    print('@@FILES', glb, blend)
    if '--no-render' in ARGS:
        return
    ground = (0.45, 0.52, 0.36)
    # kart on Central Ave ~24 m out from the wall line, north of the building,
    # ~45 deg 3/4 view (same side as HABS photo 570630c)
    street = dict(cam_loc=(-38.0, -24.0, 1.6), target=(-2.0, 8.0, 7.5), lens=28.0)
    render_cam(NAME + '_street', res=(640, 480), ground=ground, **street)
    render_cam(NAME + '_aerial', (-34.0, -44.0, 28.0), (0.0, 9.0, 6.0), lens=35.0,
               res=(640, 480), ground=ground)
    render_cam(NAME + '_street_320', res=(320, 240), ground=ground, **street)
    if '--checks' in ARGS:     # orthographic front (compare with HABS) + rear
        render_cam(NAME + '_check_elev', (0.0, -80.0, 9.0), (0.0, 0.0, 9.0), res=(640, 480),
                   ground=ground, ortho_scale=40.0, sun_rot=(60, 0, -10))
        render_cam(NAME + '_check_rear', (30.0, 60.0, 22.0), (0.0, 10.0, 6.0), lens=35.0,
                   res=(640, 480), ground=ground, sun_rot=(50, 0, 160))


main()
