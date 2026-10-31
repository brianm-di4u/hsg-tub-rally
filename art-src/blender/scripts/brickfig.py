"""Brick crew figures for the game: body parts, the 12 team hats and the held items, at three detail levels.

Phase 4 of the brick-toy campaign (notes: research/brick-style.md). The Gold Master (goldmaster.py) is the
look; this module rebuilds it with brickkit knobs plus a `detail` level, so one code path makes every LOD:
    full      every shape (bevels, studs, comb ribs, thumbs, reflective bands as geometry), prints by UV
    no-micro  plain blocks with a chamfered head that keeps the printed face; bands and suspenders become
              vertex-colour rows read off the team's prints; no studs, thumbs, soles, ribs or tassels
    blocks    one box per part; the hip is the bottom row of the torso box; an arm's hand is its end face

Coordinates are Blender's (Z up). The figure stands on z = 0 facing -Y; its left is +X (the kart's left).
Every builder authors in these figure coordinates and takes a matrix B that poses or scales the shape.
Hats are original designs, one silhouette per team; none uses lettering or a brand mark.
"""
import bpy
import bmesh
import math
import os
import re
import sys

from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)
sys.dont_write_bytecode = True               # no __pycache__ next to the scripts
from brickkit import *  # noqa: E402,F401,F403
from brickkit import (_new_bm, _cls, bm_cap, bm_loft, bm_sweep, bm_lathe, bm_rbox, bm_cyl, bm_sphere,  # noqa: E402
                      bm_tube, bm_stud, FLAT, BEVEL)

I4 = Matrix.Identity(4)

# ---------------------------------------------------------------- figure dimensions (from goldmaster.py)
HIP_Z, WAIST_Z, NECK_Z = 0.58, 0.66, 1.20
HEAD_C, HEAD = (0.0, 0.0, 1.37), (0.30, 0.27, 0.28)
HEAD_TOP = HEAD_C[2] + HEAD[2] / 2          # 1.51
SH_X, SH_Z, WRIST_Z = 0.255, 1.13, 0.84
LEG_X = 0.095
GRIP = (SH_X, -0.005, 0.775)
TORSO = (0.40, 0.24)                         # width, depth; height NECK_Z - WAIST_Z


def read_game(rel):
    with open(os.path.join(GAME, rel), encoding='utf-8') as f:
        return f.read()


def teams():
    """The 12 teams from src/js/data/teams.js, in file order."""
    src = read_game('src/js/data/teams.js')
    out = []
    for m in re.finditer(r"\{ id: '([^']+)', name: '([^']*)', div: '(\w+)'.*?colors: \{([^}]*)\}.*?emblem: '(\w+)', "
                         r"hat: '([^']+)'", src, re.S):
        cols = {k: v.upper() for k, v in re.findall(r"(\w+): '(#[0-9A-Fa-f]{6})'", m.group(4))}
        out.append(dict(id=m.group(1), name=m.group(2), div=m.group(3), colors=cols, emblem=m.group(5),
                        hat=m.group(6)))
    return out


def item_colours():
    src = read_game('src/js/gfx/karts3d.js')
    blk = re.search(r'const ITEM_COL = \{([^}]*)\}', src).group(1)
    return {k: v.upper() for k, v in re.findall(r"(\w+): '(#[0-9A-Fa-f]{6})'", blk)}


ITEMS = ['towel', 'mat', 'soap', 'loofah']   # att0..att3 (karts3d.js ITEM_ORDER)

# Costume details the team data does not carry (original, chosen per archetype). sRGB hex.
#   pants, boots: leg colours (the pants and shoe slots); cuffs/legbands/spats/boottop: team trim nodes
#   reflective-style bands as geometry at full detail and as colour rows below it.
_LIME, _SILVER = '#CFE23A', '#C9CDD2'
TEAM_STYLE = {
    'engine-six': dict(pants='#3A3F4A', boots='#1D1D22', cuffs=[(0.885, 0.04, _LIME), (0.885, 0.013, _SILVER)],
                       legbands=[(0.27, 0.042, _LIME), (0.27, 0.014, _SILVER)]),
    'lather-linen': dict(pants='#E7E0D2', boots='#8FC9D6', cuffs=[(0.875, 0.03, '#C9A24A')]),
    'velvet-mob': dict(pants='#2B2B33', boots='#1D1D22', spats='#D2CFC4', cuffs=[(0.86, 0.025, '#D2CFC4')]),
    'gator-gang': dict(pants='#3E7B3A', boots='#2F5E2C'),
    'bubble-patrol': dict(pants='#1D2C55', boots='#1D1D22', legbands=[(0.36, 0.03, '#E8ECF2')]),
    'trail-shredders': dict(pants='#2C3A2E', boots='#F07F22', legbands=[(0.36, 0.03, '#F07F22')]),
    'out-of-towners': dict(pants='#3A5A8C', boots='#6B4226'),
    'silks-stirrups': dict(pants='#E2E2DC', boots='#1D1D22', boottop='#C9A06B',
                           cuffs=[(0.95, 0.04, '#2FA84F'), (1.04, 0.04, '#2FA84F')]),
    'steam-rangers': dict(pants='#4E6136', boots='#5A3B22'),
    'suds-posse': dict(pants='#3A5A8C', boots='#5A3B22', legbands=[(0.20, 0.06, '#8A5A2E')]),
    'flamingo-flock': dict(pants='#F28DB2', boots='#E86A8E'),
    'tub-ninjas': dict(pants='#2E2E38', boots='#1D1D22', cuffs=[(0.86, 0.03, '#D33A3A')]),
}


class Ctx:
    """One figure's build settings: knobs, detail level, colours and print cells."""

    def __init__(self, kn, detail, team, captain=False, prints=None, face=None, rows=None, mats=None):
        self.kn, self.detail, self.team, self.captain = kn, detail, team, captain
        c = dict(team['colors'])
        self.col = c
        st = TEAM_STYLE.get(team['id'], {})
        self.style = st
        self.shirt = c['cap'] if captain else c['shirt']
        self.pants = st.get('pants', '#3A3F4A')
        self.boots = st.get('boots', '#1D1D22')
        self.gloves = c['skin']                 # hands share the skin slot (one hand mesh for every team)
        self.prints = prints          # {'front': uvfn, 'back': uvfn, 'face': uvfn} for full detail, or None
        self.rows = rows              # {'front': [(t0, t1, hex)], 'back': [...], 'side': [...]} below full
        self.face = face
        self.mats = mats

    @property
    def full(self):
        return self.detail == 'full'

    @property
    def blocks(self):
        return self.detail == 'blocks'

    @property
    def micro(self):
        """The smallest details (teeth, nostrils, spring coils) only at the top level (LOD0)."""
        return self.detail == 'full' and self.kn.bevel_segs >= 2

    @property
    def tiny(self):
        """Sides for very small spheres (eyes, nostrils, bubbles)."""
        return max(6, self.kn.round_segs // 2)


# ---------------------------------------------------------------- primitive helpers
def rb(p, c, size, at, mat, M=None, r=None, round_=False):
    """Rounded box. full: bevelled with the knobs; no-micro: a one-step chamfer when round_ else sharp;
    blocks: sharp."""
    kn = c.kn
    if c.detail == 'full':
        r = kn.edge if r is None else r
        if r > 2 * kn.edge:
            segs = kn.curve_segs
        else:                                   # thin trim (bands, cuffs, soles, teeth) gets one chamfer step
            segs = kn.bevel_segs if min(size) >= 0.03 else min(1, kn.bevel_segs)
    elif c.detail == 'no-micro' and round_:
        r, segs = min(r if r is not None else kn.edge, 0.05), 1
    else:
        r, segs = 0.0, 0
    p.add(bm_rbox(size, r, segs), (M or I4) @ T(*at), mat)


_BOX_FACES = {
    '-x': ((0, 3, 7, 4), (-1, 0, 0)), '+x': ((1, 5, 6, 2), (1, 0, 0)),
    '-y': ((0, 4, 5, 1), (0, -1, 0)), '+y': ((3, 2, 6, 7), (0, 1, 0)),
    '-z': ((0, 1, 2, 3), (0, 0, -1)), '+z': ((4, 7, 6, 5), (0, 0, 1)),
}


def bx(p, size, at, mat, M=None, skip=(), mats=None, rows=None):
    """Sharp box built face by face. mats: per-face material keys; rows: {side: [(t0, t1, key)]} splits a
    vertical side into horizontal bands (t from 0 at the bottom to 1 at the top). skip: faces left out."""
    sx, sy, sz = size[0] / 2, size[1] / 2, size[2] / 2
    P = [Vector((x, y, z)) for z in (-sz, sz) for y in (-sy, sy) for x in (-sx, sx)]
    P = [P[0], P[1], P[3], P[2], P[4], P[5], P[7], P[6]]       # 0..3 bottom ccw, 4..7 top
    M = (M or I4) @ T(*at)
    for key, (idx, _n) in _BOX_FACES.items():
        if key in skip:
            continue
        q = [P[i] for i in idx]
        bands = (rows or {}).get(key)
        if bands and key[1] != 'z':
            # q: two bottom corners then two top corners in some order; split by height
            lo = [v for v in q if v.z < 0]
            hi = [v for v in q if v.z > 0]
            order = [q.index(lo[0]), q.index(lo[1])]
            a, b = q[order[0]], q[order[1]]
            for t0, t1, key2 in bands:
                z0, z1 = -sz + 2 * sz * t0, -sz + 2 * sz * t1
                pts = [Vector((a.x, a.y, z0)), Vector((b.x, b.y, z0)), Vector((b.x, b.y, z1)), Vector((a.x, a.y, z1))]
                _quad(p, pts, key2, M, _n)
        else:
            _quad(p, q, (mats or {}).get(key, mat), M, _n)


def _quad(p, pts, mat, M, out):
    bm = _new_bm()
    vs = [bm.verts.new(v) for v in pts]
    f = bm.faces.new(vs)
    f.normal_update()
    if f.normal.dot(Vector(out)) < 0:
        f.normal_flip()
    f[_cls(bm)] = FLAT
    p.add(bm, M, mat)


def cyl_(p, c, r, h, M, mat, b0=None, b1=None, cap0=True, cap1=True, r1=None, segs=None):
    kn = c.kn
    if c.detail == 'full':
        s = segs or kn.round_segs
        e0 = kn.edge if b0 is None else b0
        e1 = kn.edge if b1 is None else b1
        p.add(bm_cyl(r, h, s, cap0, cap1, e0 if kn.bevel_segs else 0, e1 if kn.bevel_segs else 0, kn.bevel_segs, r1),
              M, mat)
    else:
        s = max(4, min(segs or kn.round_segs, kn.round_segs))
        p.add(bm_cyl(r, h, s, cap0, cap1, 0, 0, 0, r1), M, mat)


def sph(p, c, r, M, mat, top_only=False, segs=None):
    s = segs or c.kn.round_segs
    if not c.full:
        s = max(6, min(s, c.kn.round_segs))
    p.add(bm_sphere(r, s, max(4, s // 2), 1.0, top_only), M, mat)


def stud_(p, c, M, mat):
    if c.full and c.kn.studs == 'geo':
        p.add(bm_stud(c.kn), M, mat)


def plate(p, outline, t, M, mat):
    """Extrude a CCW outline [(x, y)] by t along +Z (cap n-gons flat, sides one flat face each)."""
    bm = _new_bm()
    cl = _cls(bm)
    lo = [bm.verts.new((x, y, 0.0)) for x, y in outline]
    hi = [bm.verts.new((x, y, t)) for x, y in outline]
    n = len(outline)
    bm_cap(bm, hi, True)
    bm_cap(bm, lo, False)
    for k in range(n):
        k2 = (k + 1) % n
        bm.faces.new([lo[k], lo[k2], hi[k2], hi[k]])[cl] = FLAT
    p.add(bm, M, mat, recalc=True)


def half_ellipse(w, d, n):
    """Front half-ellipse outline (visors and peaks): straight back edge on y = 0, bulging to -Y by d."""
    pts = [(w / 2 * math.cos(math.pi * k / n), -d * math.sin(math.pi * k / n)) for k in range(n + 1)]
    return list(reversed(pts))


def brim(p, c, ax, ay, cy, z, t, mat, zfn=None, M=None, rounded=True):
    """Ellipse slab centred on (0, cy) with its mid-plane at z; zfn(x, y) bends it (drops, curls). full:
    rounded edge; otherwise a sharp slab with an inner ring so bends stay smooth."""
    kn = c.kn
    zfn = zfn or (lambda x, y: 0.0)
    n = kn.round_segs if c.full else max(8, kn.round_segs)

    def ring(s, b):
        rad, dz = b
        pts = []
        for k in range(n):
            a = 2 * math.pi * k / n
            ex, ey = ax * math.cos(a), ay * math.sin(a)
            nx, ny = math.cos(a) / ax, math.sin(a) / ay
            nl = math.hypot(nx, ny)
            px, py = ex * s + nx / nl * rad, cy + ey * s + ny / nl * rad
            pts.append((px, py, z + zfn(px, py) + dz))
        return pts
    if c.full and rounded:
        ss = (0.06, 0.35, 0.6, 0.8, 0.93) if kn.curve_segs >= 8 else (0.06, 0.6, 0.93)
        nr = max(2, kn.bevel_segs * 2)
        prof = [(sv, (0, t / 2)) for sv in ss]
        for k in range(nr + 1):
            a = math.pi / 2 - math.pi * k / nr
            prof.append((1.0, (t / 2 * math.cos(a), t / 2 * math.sin(a))))
        prof += [(sv, (0, -t / 2)) for sv in reversed(ss)]
    else:
        prof = [(0.5, (0, t / 2)), (1.0, (0, t / 2)), (1.0, (0, -t / 2)), (0.5, (0, -t / 2))]
    bm = bm_sweep(prof, ring, sharp=None)
    if not (c.full and rounded):                # sharp slab: flat top and bottom, smooth side band
        cl = _cls(bm)
        for i, f in enumerate(bm.faces):
            f[cl] = 2 if i // n == 1 else FLAT
    vs = list(bm.verts)
    bm_cap(bm, vs[:n], True)
    bm_cap(bm, vs[-n:], False)
    p.add(bm, M, mat, recalc=True)


def ellipse_frustum(p, c, rings, mat, M=None, cap_top=True, matfn=None):
    """Sweep of ellipse rings [(ax, ay, cy, z)], capped on top; one smooth group (or flat sides below full)."""
    n = c.kn.round_segs if c.full else max(6, min(8, c.kn.round_segs))

    def ring(i, _z):
        ax, ay, cy, z = rings[int(i)]
        return [(ax * math.cos(2 * math.pi * k / n), cy + ay * math.sin(2 * math.pi * k / n), z) for k in range(n)]
    bm = bm_sweep([(float(i), r[3]) for i, r in enumerate(rings)], ring, sharp=None)
    if cap_top:
        vs = list(bm.verts)
        bm_cap(bm, vs[-n:], True)
    p.add(bm, M, matfn or mat, recalc=False)


def ellipsoid_rib(p, c, rx, ry, rz, centre, x, th0, th1, w, h, mat, M=None, steps=None):
    """A rib running over an ellipsoid (centre, radii) along the line x = const, from angle th0 to th1
    (0 = front -Y, pi = back), w wide and h proud."""
    cx, cy, cz = centre
    steps = steps or max(3, c.kn.curve_segs * 2)
    k = max(0.0, 1.0 - (x / rx) ** 2)
    ry2, rz2 = ry * math.sqrt(k), rz * math.sqrt(k)
    rings = []
    nsec = max(2, c.kn.bevel_segs * 3) if c.full else 2
    for i in range(steps + 1):
        th = th0 + (th1 - th0) * i / steps
        py, pz = cy - ry2 * math.cos(th), cz + rz2 * math.sin(th)
        ny, nz = -math.cos(th) / max(ry2, 1e-6), math.sin(th) / max(rz2, 1e-6)
        nl = math.hypot(ny, nz)
        ny, nz = ny / nl, nz / nl
        sec = []
        for j in range(nsec + 1):
            a = math.pi * j / nsec
            ww, hh = w / 2 * math.cos(a), h * math.sin(a)
            sec.append((x + ww, py + ny * (hh - 0.006), pz + nz * (hh - 0.006)))
        rings.append(sec)
    bm, vr = bm_loft(rings, group=1, closed=True)
    bm_cap(bm, vr[0], True)
    bm_cap(bm, vr[-1], False)
    p.add(bm, M, mat, recalc=True)


def shade_hex(h, k):
    if not h.startswith('#'):                     # a colour slot (shared geometry): AO does the shading
        return h
    r, g, b = hexc(h)
    return '#%02X%02X%02X' % tuple(int(round(max(0.0, min(1.0, v * k)) * 255)) for v in (r, g, b))


# ---------------------------------------------------------------- hats (one original silhouette per team)
HT = HEAD_TOP


def hat_helmet(p, c, M):
    """Firefighter helmet: rounded-box crown, long sloping rear brim, front shield, comb, crown stud."""
    hat, trim = c.col['hat'], c.col['trim']
    if c.blocks:
        bx(p, (0.34, 0.33, 0.17), (0, 0.01, 1.505), hat, M, skip=('-z',))
        bx(p, (0.44, 0.50, 0.02), (0, 0.07, 1.425), hat, M)
        return
    cw, cd, cz0, cz1, cr, yc = 0.35, 0.34, 1.38, 1.60, 0.07, 0.01
    rb(p, c, (cw, cd, cz1 - cz0), (0, yc, (cz0 + cz1) / 2), hat, M, r=cr, round_=True)
    brim(p, c, 0.235, 0.26, 0.075, 1.428, 0.022, hat, lambda x, y: -0.32 * max(0.0, y - 0.11), M)
    rb(p, c, (0.14, 0.024, 0.10), (0, 0, 0), trim, M @ T(0, yc - cd / 2 - 0.010, 1.497) @ R(7, 'X'), r=0.01)
    if c.full:
        rb(p, c, (0.11, 0.01, 0.074), (0, 0, 0), hat, M @ T(0, yc - cd / 2 - 0.023, 1.498) @ R(7, 'X'), r=0.006)
        _helmet_comb(p, c, M, hat, cw, cd, cz1, cr, yc)
        stud_(p, c, M @ T(0, yc, cz1), hat)


def _helmet_comb(p, c, M, hat, cw, cd, cz1, cr, yc):
    kn = c.kn
    steps = max(1, kn.curve_segs)

    def path(z0, y_end):
        hy = cd / 2
        pts = [(yc - hy, z0 + (cz1 - cr - z0) * i / steps, -1.0, 0.0) for i in range(steps + 1)]
        for i in range(1, kn.curve_segs * 2):
            a = math.pi - math.pi / 2 * i / (kn.curve_segs * 2)
            pts.append((yc - hy + cr + cr * math.cos(a), cz1 - cr + cr * math.sin(a), math.cos(a), math.sin(a)))
        pts += [(yc - hy + cr + (y_end - (yc - hy + cr)) * i / steps, cz1, 0.0, 1.0) for i in range(steps + 1)]
        return pts
    nsec = max(2, kn.bevel_segs * 3)
    for back in (False, True):
        pth = path(1.44 if not back else 1.425, yc - STUD_R - 0.004)
        if back:
            pth = [(2 * yc - y, z, -ny, nz) for y, z, ny, nz in pth]
        rings = []
        for y, z, ny, nz in pth:
            rings.append([(0.021 * math.cos(math.pi * j / nsec), y + ny * (0.024 * math.sin(math.pi * j / nsec) - 0.006),
                           z + nz * (0.024 * math.sin(math.pi * j / nsec) - 0.006)) for j in range(nsec + 1)])
        bm, vr = bm_loft(rings, group=1, closed=True)
        bm_cap(bm, vr[0], True)
        bm_cap(bm, vr[-1], False)
        p.add(bm, M, hat, recalc=True)


def hat_turban(p, c, M):
    """Spa turban: three stacked wrapped rolls, a gold brooch with a coloured stone, a stud on the crown."""
    cloth, gold, stone = c.col['hat'], c.col['trim'], c.col['cap']
    if c.blocks:
        bx(p, (0.36, 0.34, 0.10), (0, 0.01, 1.45), cloth, M, skip=('-z',))
        bx(p, (0.28, 0.27, 0.09), (0, 0.0, 1.535), cloth, M, skip=('-z',))
        return
    rolls = [(0.188, 0.175, 0.01, 1.41, 0.08, -5), (0.172, 0.16, -0.005, 1.48, 0.075, 6), (0.14, 0.13, 0.008, 1.545, 0.07, -4)]
    for ax, ay, cy, z, t, tilt in (rolls if c.full else rolls[:2]):
        brim(p, c, ax, ay, 0.0, 0.0, t, cloth, None, M @ T(0, cy, z) @ R(tilt, 'X'), rounded=True)
    if c.full:
        sph(p, c, 1.0, M @ T(0, 0.008, 1.575) @ S(0.105, 0.098, 0.05), cloth, top_only=True)
    rb(p, c, (0.07, 0.03, 0.08), (0, -0.185, 1.465), gold, M, r=0.012)
    if c.full:
        sph(p, c, 0.022, M @ T(0, -0.202, 1.468), stone, segs=max(8, c.kn.round_segs // 2))
        stud_(p, c, M @ T(0, 0.008, 1.62), cloth)
    else:
        bx(p, (0.20, 0.19, 0.06), (0, 0.0, 1.545), cloth, M, skip=('-z',))


def hat_fedora(p, c, M):
    """1930s fedora: low crown with a front crease, gold band, snap brim (down at the front, up at the back)."""
    hat, band, dark = c.col['hat'], c.col['trim'], shade_hex(c.col['hat'], 0.6)
    if c.blocks:
        bx(p, (0.26, 0.28, 0.15), (0, 0.01, 1.515), hat, M, skip=('-z',))
        bx(p, (0.44, 0.46, 0.016), (0, 0.0, 1.437), hat, M)
        return
    rb(p, c, (0.27, 0.29, 0.16), (0, 0.01, 1.515), hat, M, r=0.06, round_=True)
    rb(p, c, (0.276, 0.296, 0.035), (0, 0.01, 1.455), band, M, r=0.01)
    brim(p, c, 0.235, 0.245, 0.01, 1.437, 0.016, hat,
         lambda x, y: -0.30 * max(0.0, -y - 0.08) + 0.20 * max(0.0, y - 0.12), M)
    if c.full:
        rb(p, c, (0.026, 0.12, 0.012), (0, -0.065, 1.592), dark, M, r=0.005)
        stud_(p, c, M @ T(0, 0.07, 1.595), hat)


def hat_snout(p, c, M):
    """Gator hood: rounded hood, a long snout over the face with teeth and nostrils, eye bumps, back scutes."""
    hood, teeth, dark = c.col['hat'], c.col['trim'], '#1D1D22'
    eye = shade_hex(c.col['hat'], 1.15)
    if c.blocks:
        bx(p, (0.34, 0.32, 0.18), (0, 0.01, 1.50), hood, M, skip=('-z',))
        bx(p, (0.21, 0.30, 0.085), (0, -0.27, 1.445), hood, M)
        return
    rb(p, c, (0.34, 0.32, 0.18), (0, 0.01, 1.50), hood, M, r=0.07, round_=True)
    rb(p, c, (0.21, 0.30, 0.085), (0, -0.27, 1.445), hood, M, r=0.035, round_=True)
    if c.full:
        for s in (1, -1):
            if c.micro:
                for i in range(5):
                    y = -0.385 + 0.055 * i
                    rb(p, c, (0.022, 0.022, 0.022), (0, 0, 0), teeth, M @ T(s * 0.094, y, 1.403) @ R(45, 'Y'), r=0.004)
                sph(p, c, 0.012, M @ T(s * 0.035, -0.418, 1.474), dark, segs=c.tiny)
            sph(p, c, 0.05, M @ T(s * 0.08, -0.06, 1.585), eye, top_only=True)
            sph(p, c, 0.018, M @ T(s * 0.08, -0.103, 1.606), dark, segs=c.tiny)
        for i, (y, z) in enumerate(((0.165, 1.555), (0.172, 1.505), (0.168, 1.455))):
            rb(p, c, (0.03, 0.04, 0.03), (0, y, z), shade_hex(hood, 0.75), M, r=0.008)
        stud_(p, c, M @ T(0, 0.07, 1.59), hood)
    else:
        for s in (1, -1):
            bx(p, (0.07, 0.07, 0.05), (s * 0.08, -0.06, 1.60), eye, M, skip=('-z',))


def _star(r_out, r_in, n=5):
    return [((r_out if k % 2 == 0 else r_in) * math.cos(math.pi / 2 + math.pi * k / n),
             (r_out if k % 2 == 0 else r_in) * math.sin(math.pi / 2 + math.pi * k / n)) for k in range(2 * n)]


def hat_peaked(p, c, M):
    """Police cap: band with a light stripe, a crown flaring to a flat top, a glossy black visor, a star badge."""
    hat, stripe, visor, gold = c.col['hat'], c.col['trim'], '#1D1D22', '#E2B33C'
    if c.blocks:
        bx(p, (0.36, 0.34, 0.13), (0, 0.0, 1.475), hat, M, skip=('-z',))
        bx(p, (0.24, 0.11, 0.014), (0, -0.20, 1.42), visor, M)
        return
    rb(p, c, (0.31, 0.29, 0.065), (0, 0.0, 1.445), hat, M, r=0.015)
    ellipse_frustum(p, c, [(0.150, 0.140, 0.0, 1.47), (0.19, 0.18, 0.01, 1.535), (0.19, 0.18, 0.01, 1.555)], hat, M)
    rb(p, c, (0.316, 0.296, 0.02), (0, 0.0, 1.432), stripe, M, r=0.006)
    plate(p, half_ellipse(0.26, 0.12, 12 if c.full else 6), 0.014, M @ T(0, -0.135, 1.412) @ R(14, 'X'), visor)
    if c.full:
        plate(p, _star(0.03, 0.013), 0.008, M @ T(0, -0.16, 1.49) @ R(90, 'X'), gold)
        stud_(p, c, M @ T(0, 0.01, 1.555), hat)
    else:
        bx(p, (0.05, 0.01, 0.05), (0, -0.166, 1.49), gold, M)


def hat_bike(p, c, M):
    """Mountain-bike helmet: long teardrop shell, a dark centre stripe and vents, a short visor."""
    shell, stripe = c.col['hat'], c.col['trim']
    if c.blocks:
        bx(p, (0.36, 0.46, 0.14), (0, 0.04, 1.47), shell, M, skip=('-z',))
        bx(p, (0.20, 0.07, 0.014), (0, -0.22, 1.43), shell, M)
        return
    rx, ry, rz, ctr = 0.18, 0.24, 0.16, (0, 0.04, 1.40)
    sph(p, c, 1.0, M @ T(*ctr) @ S(rx, ry, rz), shell, top_only=True)
    ellipsoid_rib(p, c, rx, ry, rz, ctr, 0.0, 0.25, 2.9, 0.045, 0.012, stripe, M)
    if c.full:
        for x in (0.085, -0.085):
            ellipsoid_rib(p, c, rx, ry, rz, ctr, x, 0.6, 2.4, 0.022, 0.01, stripe, M)
        stud_(p, c, M @ T(0, 0.04, 1.552), shell)
    plate(p, half_ellipse(0.22, 0.07, 10 if c.full else 5), 0.012, M @ T(0, -0.19, 1.425) @ R(-12, 'X'), shell)


def hat_antenna(p, c, M):
    """Visitor's antenna cap: a skullcap with two springy stalks ending in balls."""
    cap, ball = c.col['hat'], c.col['cap']
    if c.blocks:
        bx(p, (0.32, 0.29, 0.085), (0, 0.0, 1.505), cap, M, skip=('-z',))
        for s in (1, -1):
            bx(p, (0.06, 0.06, 0.28), (s * 0.10, 0.0, 1.68), ball, M, skip=('-z',),
               mats={'+z': ball, '-x': cap, '+x': cap, '-y': cap, '+y': cap})
        return
    rb(p, c, (0.32, 0.29, 0.085), (0, 0.0, 1.505), cap, M, r=0.035, round_=True)
    for s in (1, -1):
        base = M @ T(s * 0.075, 0.0, 1.54) @ R(s * 18, 'Y')
        cyl_(p, c, 0.012, 0.22, base, cap, b0=0.0, b1=0.0, cap0=False, segs=8 if c.full else 4)
        if c.full:
            if c.micro:
                for i in range(3):
                    loop = [(0.0045 * math.cos(2 * math.pi * k / 6), 0.02 + 0.0045 * math.sin(2 * math.pi * k / 6))
                            for k in range(6)]
                    p.add(bm_lathe(loop, 10, axis='Z', closed=True), base @ T(0, 0, 0.06 + 0.035 * i), ball, recalc=True)
            sph(p, c, 0.045, base @ T(0, 0, 0.245), ball)
        else:
            bx(p, (0.08, 0.08, 0.08), (0, 0, 0.245), ball, base)
    if c.full:
        stud_(p, c, M @ T(0, 0.0, 1.5475), cap)


def hat_jockey(p, c, M):
    """Jockey cap: quartered silk dome in two colours, a short peak, a stud for the top button."""
    a, b = c.col['hat'], c.col['trim']
    quarters = (lambda q, n: a if q.x * q.y >= 0 else b)
    if c.blocks:
        bx(p, (0.35, 0.33, 0.12), (0, 0.0, 1.48), a, M, skip=('-z',), mats={'+z': b, '-x': b, '+x': b})
        bx(p, (0.18, 0.08, 0.012), (0, -0.20, 1.43), a, M)
        return
    sph(p, c, 1.0, M @ T(0, 0.005, 1.425) @ S(0.172, 0.162, 0.125), quarters, top_only=True)
    plate(p, half_ellipse(0.20, 0.08, 10 if c.full else 5), 0.012, M @ T(0, -0.14, 1.428) @ R(10, 'X'), a)
    if c.full:
        stud_(p, c, M @ T(0, 0.005, 1.545), b)
        if c.kn.studs != 'geo':
            rb(p, c, (0.05, 0.05, 0.03), (0, 0.005, 1.555), b, M)
    else:
        bx(p, (0.05, 0.05, 0.03), (0, 0.005, 1.56), b, M, skip=('-z',))


def hat_campaign(p, c, M):
    """Ranger campaign hat: wide flat brim, a peaked crown pinched in four dents, a dark band."""
    hat, band = c.col['hat'], '#5A3B22'
    if c.blocks:
        bx(p, (0.50, 0.50, 0.016), (0, 0.0, 1.44), hat, M)
        _pyramid(p, 0.145, 0.06, 1.448, 1.60, hat, M)
        return
    brim(p, c, 0.275, 0.27, 0.0, 1.44, 0.016, hat, None, M)
    if c.full:
        n = c.kn.round_segs
        rings = []
        steps = max(3, c.kn.curve_segs * 2)
        for i in range(steps + 1):
            t = i / steps
            rr = 0.145 * (1 - 0.45 * t ** 1.3)
            kk = 0.22 * t
            z = 1.448 + 0.15 * t
            rings.append([(rr * (1 - kk * (0.5 + 0.5 * math.cos(4 * (2 * math.pi * k / n)))) * math.cos(2 * math.pi * k / n),
                           rr * (1 - kk * (0.5 + 0.5 * math.cos(4 * (2 * math.pi * k / n)))) * math.sin(2 * math.pi * k / n),
                           z) for k in range(n)])
        bm, vr = bm_loft(rings, group=1, closed=True)
        bm_cap(bm, vr[-1], True)
        p.add(bm, M, hat)
        bnd = [(0.149 * math.cos(2 * math.pi * k / n), 0.149 * math.sin(2 * math.pi * k / n)) for k in range(n)]
        plate(p, bnd, 0.03, M @ T(0, 0, 1.446), band)
        stud_(p, c, M @ T(0, 0, 1.598), hat)
    else:
        _pyramid(p, 0.145, 0.06, 1.448, 1.60, hat, M)


def _pyramid(p, r0, r1, z0, z1, mat, M):
    """Square frustum turned 45 degrees (a pinched four-dent crown at low detail)."""
    bm = _new_bm()
    cl = _cls(bm)
    lo = [bm.verts.new((r0 * math.cos(math.pi / 2 * k), r0 * math.sin(math.pi / 2 * k), z0)) for k in range(4)]
    hi = [bm.verts.new((r1 * math.cos(math.pi / 2 * k), r1 * math.sin(math.pi / 2 * k), z1)) for k in range(4)]
    for k in range(4):
        bm.faces.new([lo[k], lo[(k + 1) % 4], hi[(k + 1) % 4], hi[k]])[cl] = FLAT
    bm_cap(bm, hi, True)
    p.add(bm, M, mat, recalc=False)


def hat_cowboy(p, c, M):
    """Posse cowboy hat: tall creased crown, gold band, wide brim curled up at the sides."""
    hat, band, dark = c.col['hat'], c.col['trim'], shade_hex(c.col['hat'], 0.6)
    curl = (lambda x, y: 0.10 * (abs(x) / 0.30) ** 2.5 - 0.02 * max(0.0, -y - 0.10) / 0.17)
    if c.blocks:
        bx(p, (0.25, 0.30, 0.18), (0, 0.01, 1.53), hat, M, skip=('-z',))
        _curled_brim(p, 0.30, 0.27, 1.445, 0.018, 0.10, hat, M)
        return
    rb(p, c, (0.25, 0.30, 0.18), (0, 0.01, 1.53), hat, M, r=0.07, round_=True)
    if c.full:
        rb(p, c, (0.256, 0.306, 0.03), (0, 0.01, 1.455), band, M, r=0.008)
        rb(p, c, (0.026, 0.16, 0.012), (0, -0.02, 1.617), dark, M, r=0.005)
        stud_(p, c, M @ T(0, 0.095, 1.62), hat)
    brim(p, c, 0.30, 0.27, 0.0, 1.445, 0.018, hat, curl, M)


def _curled_brim(p, ax, ay, z, t, up, mat, M):
    """Blocks cowboy brim: a flat centre panel and two side flaps turned up."""
    xs = (-ax, -ax * 0.45, ax * 0.45, ax)
    zs = (z + up, z, z, z + up)
    bm = _new_bm()
    cl = _cls(bm)
    top = [[bm.verts.new((xs[i], y, zs[i] + t / 2)) for y in (-ay, ay)] for i in range(4)]
    bot = [[bm.verts.new((xs[i], y, zs[i] - t / 2)) for y in (-ay, ay)] for i in range(4)]
    for i in range(3):
        bm.faces.new([top[i][0], top[i + 1][0], top[i + 1][1], top[i][1]])[cl] = FLAT
        bm.faces.new([bot[i][1], bot[i + 1][1], bot[i + 1][0], bot[i][0]])[cl] = FLAT
        bm.faces.new([bot[i][0], bot[i + 1][0], top[i + 1][0], top[i][0]])[cl] = FLAT
        bm.faces.new([top[i][1], top[i + 1][1], bot[i + 1][1], bot[i][1]])[cl] = FLAT
    bm.faces.new([bot[0][1], bot[0][0], top[0][0], top[0][1]])[cl] = FLAT
    bm.faces.new([bot[3][0], bot[3][1], top[3][1], top[3][0]])[cl] = FLAT
    p.add(bm, M, mat, recalc=True)


def hat_beak(p, c, M):
    """Flamingo hood: rounded pink hood, a pale beak bending down to a black tip, a crest feather."""
    hood, pale, tip = c.col['hat'], '#EBD3C8', '#2B2B33'
    if c.blocks:
        bx(p, (0.33, 0.31, 0.17), (0, 0.01, 1.505), hood, M, skip=('-z',))
        bx(p, (0.10, 0.24, 0.07), (0, -0.25, 1.43), pale, M, mats={'-y': tip})
        return
    rb(p, c, (0.33, 0.31, 0.17), (0, 0.01, 1.505), hood, M, r=0.075, round_=True)
    rb(p, c, (0.10, 0.17, 0.075), (0, -0.215, 1.44), pale, M, r=0.03, round_=True)
    rb(p, c, (0.075, 0.11, 0.06), (0, 0, 0), tip, M @ T(0, -0.315, 1.405) @ R(35, 'X'), r=0.022, round_=True)
    if c.full:
        rb(p, c, (0.03, 0.12, 0.02), (0, 0, 0), shade_hex(hood, 0.8), M @ T(0, 0.10, 1.595) @ R(-20, 'X'), r=0.008)
        for s in (1, -1):
            sph(p, c, 0.018, M @ T(s * 0.105, -0.142, 1.53), tip, segs=c.tiny)
        stud_(p, c, M @ T(0, -0.03, 1.59), hood)


def hat_headband(p, c, M):
    """Ninja headband: a band round the head, a metal brow plate, and a round knot with a stud at the back."""
    band, metal = c.col['hat'], '#A9ADB2'
    if c.blocks:
        bx(p, (0.316, 0.286, 0.055), (0, 0.0, 1.4275), band, M, skip=('-z', '+z'))
        bx(p, (0.08, 0.025, 0.17), (0, 0.16, 1.35), band, M)
        return
    if c.full:
        hx, hy, r = HEAD[0] / 2, HEAD[1] / 2, 0.07
        n = max(2, c.kn.curve_segs)
        cont = []
        for cx, cy, a0 in ((hx - r, hy - r, 0), (-hx + r, hy - r, 90), (-hx + r, -hy + r, 180), (hx - r, -hy + r, 270)):
            for k in range(n + 1):
                a = math.radians(a0 + 90 * k / n)
                cont.append((cx, cy, math.cos(a), math.sin(a)))

        def ring(d, z):
            return [(cx + (r + d) * nx, cy + (r + d) * ny, z) for cx, cy, nx, ny in cont]
        bm = bm_sweep([(0.0, 1.40), (0.012, 1.40), (0.012, 1.455), (0.0, 1.455)], ring, closed=True, sharp=35)
        p.add(bm, M, band, recalc=True)
        rb(p, c, (0.11, 0.012, 0.045), (0, -HEAD[1] / 2 - 0.013, 1.4275), metal, M, r=0.004)
        knot = M @ T(0, HEAD[1] / 2 + 0.008, 1.4275) @ R(-90, 'X')
        cyl_(p, c, STUD_R + 0.008, 0.035, knot, band, b0=0.0, b1=0.006)
        stud_(p, c, knot @ T(0, 0, 0.035), band)
        for s in (1, -1):
            rb(p, c, (0.04, 0.012, 0.17), (0, 0, 0), band,
               M @ T(s * 0.035, HEAD[1] / 2 + 0.03, 1.34) @ R(s * 12, 'Y') @ R(-18, 'X'), r=0.004)
    else:
        bx(p, (0.316, 0.286, 0.055), (0, 0.0, 1.4275), band, M, skip=('-z', '+z'))
        bx(p, (0.11, 0.008, 0.045), (0, -0.148, 1.4275), metal, M, skip=('+y',))
        bx(p, (0.08, 0.025, 0.17), (0, 0.16, 1.35), band, M)


HATS = {'helmet': hat_helmet, 'turban': hat_turban, 'fedora': hat_fedora, 'snout': hat_snout,
        'peaked': hat_peaked, 'bike-helmet': hat_bike, 'antenna': hat_antenna, 'jockey': hat_jockey,
        'flat-brim': hat_campaign, 'cowboy': hat_cowboy, 'beak': hat_beak, 'headband': hat_headband}


# ---------------------------------------------------------------- body parts
# Each builder makes one exported node (or part of one). Shared nodes (identical for every team but for
# colour) take a Ctx whose colours are slot tokens ('slot:skin'); team nodes (hats, trims, low-LOD torsos)
# take the team's colours.
def neck(p, c, M=I4):
    if c.full:
        cyl_(p, c, 0.062, 0.05, M @ T(0, 0, NECK_Z - 0.015), c.col['skin'], b0=0.0, b1=0.006)


def head(p, c, M=I4):
    """Rounded-cube head (chamfered in no-micro) with the printed face; no neck, no hat."""
    skin = c.col['skin']
    if c.blocks:
        bx(p, HEAD, HEAD_C, skin, M, skip=('-z',))
        return
    rb(p, c, HEAD, HEAD_C, skin, M, r=0.07, round_=True)
    if c.prints and c.prints.get('face') and c.face:
        hz0 = HEAD_C[2] - HEAD[2] / 2
        uv = c.prints['face']
        p.project('print_face', lambda q, n: n.y < -0.35 and q.z > hz0 + 0.004,
                  lambda q: uv((q.x + HEAD[0] / 2) / HEAD[0], (q.z - hz0) / HEAD[2]))
    elif c.detail == 'no-micro':
        for s in (1, -1):                                           # two eye dots when there is no print
            bx(p, (0.03, 0.004, 0.045), (s * 0.055, -HEAD[1] / 2 - 0.002, 1.40), 'black', M, skip=('+y',))


def hat(p, c, M=I4):
    HATS[c.team['hat']](p, c, M)


def torso(p, c, M=I4, with_hip=False):
    """Torso box (and, in blocks, the hip as its bottom row)."""
    w, d = TORSO
    tz0, tz1 = WAIST_Z, NECK_Z
    shirt = c.shirt
    if c.full:
        rb(p, c, (w, d, tz1 - tz0), (0, 0, (tz0 + tz1) / 2), shirt, M, r=0.02)
        rb(p, c, (0.24, 0.17, 0.05), (0, 0, tz1 - 0.005), shirt, M, r=0.02)
        if c.prints:
            fr, bk = c.prints['front'], c.prints['back']
            p.project('print_front', lambda q, n: n.y < -0.5 and tz0 + 0.004 < q.z < tz1 - 0.03,
                      lambda q: fr((q.x + w / 2) / w, (q.z - tz0) / (tz1 - tz0)))
            p.project('print_back', lambda q, n: n.y > 0.5 and tz0 + 0.004 < q.z < tz1 - 0.03,
                      lambda q: bk((w / 2 - q.x) / w, (q.z - tz0) / (tz1 - tz0)))
            p.project('print_front', lambda q, n: abs(n.x) > 0.5 and tz0 + 0.004 < q.z < tz1 - 0.03,
                      lambda q: fr(0.01 + 0.08 * (q.y + d / 2) / d, (q.z - tz0) / (tz1 - tz0)))
        return
    rows = c.rows or {}
    if with_hip:
        z0, hip_t = HIP_Z, (WAIST_Z - HIP_Z) / (tz1 - HIP_Z)
        rw = {k: [(0.0, hip_t, c.pants)] + [(hip_t + t0 * (1 - hip_t), hip_t + t1 * (1 - hip_t), col)
                                           for t0, t1, col in v] for k, v in _row_sides(rows, shirt).items()}
        bx(p, (w, d, tz1 - z0), (0, 0, (z0 + tz1) / 2), shirt, M, skip=('-z',), rows=rw)
    else:
        bx(p, (w, d, tz1 - tz0), (0, 0, (tz0 + tz1) / 2), shirt, M, skip=('-z',), rows=_row_sides(rows, shirt))


def _row_sides(rows, shirt):
    fr = rows.get('front') or [(0.0, 1.0, shirt)]
    return {'-y': fr, '+y': rows.get('back') or fr, '-x': rows.get('side') or fr, '+x': rows.get('side') or fr}


def hip(p, c, M=I4):
    if c.blocks:
        return
    rb(p, c, (0.38, 0.22, WAIST_Z - HIP_Z), (0, 0, (HIP_Z + WAIST_Z) / 2), c.pants, M, r=0.012)


def leg(p, c, side, M=I4):
    x = side * LEG_X
    if c.blocks:
        bt = 0.12 / HIP_Z
        bx(p, (0.165, 0.17, HIP_Z), (x, 0, HIP_Z / 2), c.pants, M, skip=('+z', '-z'),
           rows={k: [(0.0, bt, c.boots), (bt, 1.0, c.pants)] for k in ('-x', '+x', '-y', '+y')})
        return
    if c.full:
        rb(p, c, (0.165, 0.17, HIP_Z - 0.12), (x, 0, (HIP_Z + 0.12) / 2), c.pants, M, r=0.014)
        cyl_(p, c, 0.085, 0.165, M @ T(x - 0.0825, 0, HIP_Z) @ R(90, 'Y'), c.pants, b0=0.008, b1=0.008,
             segs=max(8, c.kn.round_segs // 2))
        rb(p, c, (0.178, 0.205, 0.12), (x, -0.0175, 0.06), c.boots, M, r=0.026)
        rb(p, c, (0.182, 0.209, 0.022), (x, -0.0175, 0.011), 'charcoal', M, r=0.008)
        return
    bx(p, (0.165, 0.17, HIP_Z - 0.12), (x, 0, (HIP_Z + 0.12) / 2), c.pants, M, skip=('+z', '-z'))
    bx(p, (0.178, 0.205, 0.12), (x, -0.0175, 0.06), c.boots, M)


def leg_trim(p, c, side, M=I4):
    """Team-only leg details at full detail (reflective bands, spats, boot tops). Returns True if any."""
    x, st, any_ = side * LEG_X, c.style, False
    if not c.full:
        return False
    if st.get('boottop'):
        rb(p, c, (0.172, 0.177, 0.05), (x, 0, 0.145), st['boottop'], M, r=0.006)
        any_ = True
    if st.get('spats'):
        rb(p, c, (0.181, 0.207, 0.05), (x, -0.017, 0.1), st['spats'], M, r=0.008)
        any_ = True
    for z, h, col in st.get('legbands', []):
        rb(p, c, (0.171 + (0.0015 if h < 0.02 else 0), 0.176 + (0.0015 if h < 0.02 else 0), h), (x, 0, z), col, M,
           r=min(0.005, h / 3))
        any_ = True
    return any_


def arm(p, c, side, M=I4):
    """Block arm hanging from the shoulder (pivot (side * SH_X, 0, SH_Z)); at blocks, its end face is the hand."""
    x = side * SH_X
    if c.blocks:
        bx(p, (0.10, 0.12, SH_Z + 0.06 - 0.71), (x, -0.005, (SH_Z + 0.06 + 0.71) / 2), c.shirt, M,
           mats={'-z': c.gloves})
        return
    if c.full:
        rb(p, c, (0.10, 0.12, SH_Z - WRIST_Z), (x, 0, (SH_Z + WRIST_Z) / 2), c.shirt, M, r=0.016)
        cyl_(p, c, 0.06, 0.10, M @ T(x - 0.05, 0, SH_Z) @ R(90, 'Y'), c.shirt, b0=0.012, b1=0.012,
             segs=max(8, c.kn.round_segs // 2))
    else:
        bx(p, (0.10, 0.12, SH_Z + 0.06 - WRIST_Z), (x, 0, (SH_Z + 0.06 + WRIST_Z) / 2), c.shirt, M, skip=())


def arm_trim(p, c, side, M=I4):
    """Team-only sleeve cuffs at full detail. Returns True if any."""
    x = side * SH_X
    if not c.full or not c.style.get('cuffs'):
        return False
    for z, h, col in c.style['cuffs']:
        dd = 0.0065 if h >= 0.02 else 0.0075
        rb(p, c, (0.10 + dd, 0.12 + dd, h), (x, 0, z), col, M, r=min(0.005, h / 3))
    return True


def hand(p, c, side, M=I4):
    x = side * SH_X
    if c.blocks:
        return
    if c.full:
        cyl_(p, c, 0.038, 0.03, M @ T(x, 0, WRIST_Z - 0.02), c.gloves, b0=0.0, b1=0.0)
        rb(p, c, (0.10, 0.13, 0.13), (x, -0.005, 0.775), c.gloves, M, r=0.04, round_=True)
        rb(p, c, (0.046, 0.06, 0.08), (0, 0, 0), c.gloves,
           M @ T(x - side * 0.036, -0.068, 0.795) @ R(-18, 'X') @ R(side * 12, 'Z'), r=0.021, round_=True)
    else:
        bx(p, (0.10, 0.13, 0.13), (x, -0.005, 0.775), c.gloves, M)


def item(p, c, which, M=I4, item_col=None):
    """Held item, gripped in the left mitten at GRIP (towel, mat, soap, loofah)."""
    ic = item_col or {}
    gx, gy, gz = GRIP
    col = ic.get(which, '#CCCCCC')
    if c.blocks or c.detail == 'no-micro':
        sizes = {'towel': ((0.045, 0.17, 0.38), (gx, gy, gz - 0.165)), 'mat': ((0.03, 0.30, 0.37), (gx, gy, gz - 0.16)),
                 'soap': ((0.10, 0.15, 0.07), (gx, gy - 0.08, gz - 0.015)),
                 'loofah': ((0.13, 0.15, 0.19), (gx, gy - 0.06, gz - 0.02))}
        size, at = sizes[which]
        rows = None
        if which == 'towel' and not c.blocks:
            r0 = (0.035 / 0.38, 0.075 / 0.38)
            rows = {k: [(0.0, r0[0], col), (r0[0], r0[1], c.col['tub']), (r0[1], 1.0, col)] for k in ('-x', '+x', '-y', '+y')}
        bx(p, size, at, col, M, skip=('+z',) if which in ('towel', 'mat') else (), rows=rows)
        return
    kn = c.kn
    if which == 'towel':
        rb(p, c, (0.045, 0.17, 0.38), (gx, gy, gz - 0.165), col, M, r=0.016)
        for z in (gz - 0.30, gz - 0.27):
            rb(p, c, (0.0475, 0.1725, 0.016), (gx, gy, z), c.col['tub'], M, r=0.004)
        rb(p, c, (0.05, 0.175, 0.026), (gx, gy, gz - 0.342), col, M, r=0.01)
    elif which == 'mat':
        rb(p, c, (0.03, 0.30, 0.37), (gx, gy, gz - 0.16), col, M, r=0.01)
        nrib = 6 if kn.bevel_segs >= 2 else 4
        for i in range(nrib):
            rb(p, c, (0.038, 0.27, 0.018), (gx, gy, gz - 0.03 - 0.33 / nrib * i), col, M, r=0.007)
        ntas = 9 if kn.bevel_segs >= 2 else 5
        for i in range(ntas):
            y = gy - 0.13 + 0.26 * i / (ntas - 1)
            cyl_(p, c, 0.008, 0.035, M @ T(gx, y, gz - 0.345 - 0.035), 'enamel', segs=max(4, kn.round_segs // 4),
                 b0=0.003, b1=0.0)
    elif which == 'soap':
        rb(p, c, (0.10, 0.15, 0.07), (gx, gy - 0.08, gz - 0.015), col, M, r=0.026)
        rb(p, c, (0.056, 0.092, 0.014), (gx, gy - 0.08, gz + 0.017), col, M, r=0.0065)
        for (dx, dy, r) in ((0.012, -0.11, 0.019), (-0.02, -0.06, 0.014), (0.022, -0.04, 0.011)):
            sph(p, c, r, M @ T(gx + dx, gy + dy, gz + 0.022 + r * 0.7), 'water', segs=c.tiny)
    elif which == 'loofah':
        bm = bm_sphere(1.0, kn.round_segs, max(6, kn.round_segs // 2))
        for v in bm.verts:
            dd = v.co.normalized()
            u = math.atan2(dd.y, dd.x)
            w = math.acos(max(-1.0, min(1.0, dd.z)))
            v.co = dd * (1.0 + 0.05 * math.sin(14 * u) * math.sin(12 * w))
        p.add(bm, M @ T(gx, gy - 0.06, gz - 0.02) @ S(0.068, 0.078, 0.095), col)
        nl = max(4, kn.round_segs // 4)
        loop = [(0.006 * math.cos(2 * math.pi * k / nl), 0.026 + 0.006 * math.sin(2 * math.pi * k / nl)) for k in range(nl)]
        p.add(bm_lathe(loop, max(6, kn.round_segs // 2), axis='X', closed=True), M @ T(gx, gy - 0.06, gz + 0.085),
              'enamel', recalc=True)


# ---------------------------------------------------------------- poses (figure coordinates)
def about(pivot, Rm):
    return T(*pivot) @ Rm @ T(*(-v for v in pivot))


def push_pose(side, arm_deg=-78.0, splay=6.0, wrist=25.0):
    """Arm and hand matrices for the pushing pose (arms reaching forward to the rim)."""
    sh = (side * SH_X, 0.0, SH_Z)
    A = about(sh, R(arm_deg, 'X') @ R(-side * splay, 'Y'))
    H = A @ about((side * SH_X, 0.0, WRIST_Z), R(wrist, 'X'))
    return A, H
