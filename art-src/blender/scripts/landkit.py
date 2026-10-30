"""Shared parts for the mountain and downtown landmark scripts:
pack `mountain` (hs-tower, pagoda, wm-shelter, balanced-rock, goat-rock) and
pack `downtown` (medical-arts, army-navy, vapors).

Builds on common.py and rowkit.py, which are NOT changed (so the Row GLBs stay
byte-identical). Everything here is deterministic: there is no `random`
module; the rock jitter comes from a fixed integer hash (hj), so every run
produces the same vertices and the same GLB bytes.

  palette  - hexes from research/visual-style-guide.md (all estimates there),
             plus the derived shades used by these scripts (each explained)
  rock     - hj() fixed hash, hull() convex-hull block with per-face
             novaculite colours, slab() tilted bedding block, boulder()
             rounded block, nova_cols() face colour picker
  lattice  - leg() tapered square leg, strut() two-sided flat member
  timber   - log() n-sided log between two points with end-grain caps
  walls    - grid() window grid (Arlington technique: one glass strip per
             column plus spandrel bands laid over it), fan_uv() Deco fan
"""
import math

from common import *                                # noqa: F401,F403
from rowkit import *                                # noqa: F401,F403

# ---------------------------------------------------------------- palette
# visual-style-guide.md -- every hex there is an estimate ("hex est.").
# P1 ouachita-forest
C_NOVA = hexc('#EDEAE2')       # novaculite white
C_ROSE = hexc('#C99A92')       # novaculite rose
C_SHALE = hexc('#2B2A27')      # shale charcoal
# P9 nps-rustic
C_STONE = hexc('#8C877C')      # native stone (also the tower recipe's steel gray)
C_LOG = hexc('#5B4632')        # log
C_SHINGLE = hexc('#8B4A33')    # redwood shingle
C_RCREAM = hexc('#EDE3C8')     # nps-rustic cream (sign letters)
# P5 deco-neon / Medical Arts swatches
C_LIME = hexc('#D8CFBD')       # Medical Arts limestone
C_BRONZE = hexc('#7C5A2E')     # bronze grille
C_GOLD = hexc('#D4AF37')       # Deco gold highlight
# P7 motor-hotel (general mid-century knowledge, not sourced to Hot Springs)
C_MC_TURQ = hexc('#3FBFB5')    # turquoise
C_MC_CORAL = hexc('#F26B5B')   # coral
C_MC_CONC = hexc('#D9D4CA')    # poured concrete
C_MC_ASPH = hexc('#222222')    # asphalt

# Derived (documented):
# light-grey novaculite ("often white or light gray", AR Archeological
# Survey via geography-lakes-mountains.md): white, sRGB lerp 18 % to shale
C_NOVA_GREY = mix(C_NOVA, C_SHALE, 0.18)
# pink streaks ("also pink, red, tan"): white, sRGB lerp 55 % to rose
C_NOVA_PINK = mix(C_NOVA, C_ROSE, 0.55)
# shaded undersides (README: the only baked darkening allowed): grey x 0.62
C_NOVA_UNDER = shade(C_NOVA_GREY, 0.62)
# end grain of a cut log reads paler than its bark: log, lerp 40 % to cream
C_LOGEND = mix(C_LOG, C_RCREAM, 0.40)


# ---------------------------------------------------------------- rock
def hj(i, k=0):
    """Fixed integer hash -> [-1, 1). A deterministic stand-in for noise
    (no random module, no seed state)."""
    x = ((i + 1) * 73856093) ^ ((k + 7) * 19349663) ^ 0x5BD1E995
    x &= 0xFFFFFFFF
    x = ((x ^ (x >> 15)) * 2246822519) & 0xFFFFFFFF
    x = ((x ^ (x >> 13)) * 3266489917) & 0xFFFFFFFF
    x ^= x >> 16
    return x / 2147483648.0 - 1.0


def nova_cols(seed, pink=0.55, grey=-0.45, under=-0.3):
    """Face colour picker for novaculite: undersides (normal z < under)
    shaded (trim slot), tops white, sides mostly white with hashed
    light-grey and pink facets."""
    def f(n, i):
        if n.z < under:
            return 'trim', C_NOVA_UNDER
        if n.z > 0.65:
            return 'wall', C_NOVA
        t = hj(seed, 1000 + i)
        if t > pink:
            return 'wall', C_NOVA_PINK
        if t < grey:
            return 'wall', C_NOVA_GREY
        return 'wall', C_NOVA
    return f


def hull(mb, pts, colfn):
    """Convex hull of pts as flat triangles, each with its own colour from
    colfn(normal, face_index) -> (material, colour). Returns the tri count."""
    bm = bmesh.new()
    vs = [bm.verts.new(Vector(p)) for p in pts]
    bmesh.ops.convex_hull(bm, input=vs, use_existing_faces=False)
    c = sum((Vector(p) for p in pts), Vector()) / len(pts)
    n_tri = 0
    for i, f in enumerate(list(bm.faces)):
        P = [v.co.copy() for v in f.verts]
        tris = [P] if len(P) == 3 else [[P[0], P[k], P[k + 1]] for k in range(1, len(P) - 1)]
        for tri in tris:
            fc = sum(tri, Vector()) / 3
            nrm = newell(tri).normalized()
            if nrm.dot(fc - c) < 0:
                nrm = -nrm
            m, col = colfn(nrm, i)
            mb.poly(tri, m, col, out=fc - c)
            n_tri += 1
    bm.free()
    return n_tri


def slab(mb, cx, cy, w, d, h, seed, yaw=0.0, lean=(0.0, 0.0), taper=(0.7, 0.7),
         apex=None, z0=Z_SKIRT, jit=0.10, colfn=None):
    """Tilted bedding block: a w x d footprint (below grade at z0) rising to
    a smaller, shifted top at h (lean = top offset, local metres), turned by
    yaw (degrees). apex=(x, y, dz) adds a peak point above the top. Corners
    are jittered by the fixed hash -> about 12-14 triangles."""
    ca, sa = math.cos(math.radians(yaw)), math.sin(math.radians(yaw))

    def P(x, y, z):
        return (cx + x * ca - y * sa, cy + x * sa + y * ca, z)
    loc = []
    for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
        loc.append((sx * w / 2, sy * d / 2, z0, False))
    for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
        loc.append((sx * w / 2 * taper[0] + lean[0], sy * d / 2 * taper[1] + lean[1], h, True))
    if apex:
        loc.append((apex[0] + lean[0], apex[1] + lean[1], h + apex[2], True))
    pts = []
    for k, (x, y, z, top) in enumerate(loc):
        x += hj(seed, 3 * k) * jit * w
        y += hj(seed, 3 * k + 1) * jit * d
        if top:
            z += hj(seed, 3 * k + 2) * jit * h
        pts.append(P(x, y, z))
    return hull(mb, pts, colfn or nova_cols(seed))


def boulder(mb, c, r, seed, n_lon=6, lats=(-50.0, -10.0, 30.0), jit=0.12, yaw=0.0,
            colfn=None, bottom=None):
    """Rounded block: an ellipsoid sampled at a few latitude rings plus the
    poles, radii jittered by the fixed hash. bottom=(x, y, z) replaces the
    lower pole (a contact point to perch on)."""
    cx, cy, cz = c
    pts = []
    k = 0
    for li, la in enumerate(lats):
        for j in range(n_lon):
            a = math.radians(yaw) + 2 * math.pi * (j + 0.5 * (li % 2)) / n_lon
            s = 1.0 + hj(seed, k) * jit
            k += 1
            cl, sl = math.cos(math.radians(la)), math.sin(math.radians(la))
            pts.append((cx + r[0] * cl * math.cos(a) * s, cy + r[1] * cl * math.sin(a) * s,
                        cz + r[2] * sl * s))
    pts.append((cx + hj(seed, 90) * jit * r[0], cy + hj(seed, 91) * jit * r[1],
                cz + r[2] * (1.0 + hj(seed, 92) * jit * 0.5)))
    pts.append(bottom if bottom else (cx, cy, cz - r[2]))
    return hull(mb, pts, colfn or nova_cols(seed))


# ---------------------------------------------------------------- lattice
def leg(mb, p0, p1, r0, r1, mat, col):
    """Tapered square-section leg (axis-aligned sections) from p0 (half-width
    r0) to p1 (half-width r1). Four sides, no caps: 8 tris."""
    q = ((-1, -1), (1, -1), (1, 1), (-1, 1))
    A = [Vector((p0[0] + sx * r0, p0[1] + sy * r0, p0[2])) for sx, sy in q]
    B = [Vector((p1[0] + sx * r1, p1[1] + sy * r1, p1[2])) for sx, sy in q]
    for i in range(4):
        j = (i + 1) % 4
        out = (A[i] + A[j]) / 2 - Vector(p0)
        out.z = 0.0
        mb.poly([A[i], A[j], B[j], B[i]], mat, col, out=out)


def strut(mb, a, b, w, nrm, mat, col, col_in=None, gap=0.03):
    """Flat lattice member of width w from a to b lying in the plane with
    normal nrm: an outer quad facing nrm and an inner quad facing -nrm
    (gap apart), so it shows from outside and through the lattice. 4 tris."""
    a, b, n = Vector(a), Vector(b), Vector(nrm).normalized()
    t = (b - a).normalized()
    s = t.cross(n).normalized() * (w / 2)
    o = n * (gap / 2)
    mb.poly([a - s + o, b - s + o, b + s + o, a + s + o], mat, col, out=n)
    mb.poly([a - s - o, b - s - o, b + s - o, a + s - o], mat, col_in or col, out=-n)


# ---------------------------------------------------------------- timber
def log(mb, a, b, r, n=4, mat='trim', col=C_LOG, end_col=C_LOGEND, caps=True, phase=None):
    """n-sided log from a to b (radius r) with flat end-grain caps.
    n=4 with the default phase sets the log on edge (a diamond section)."""
    a, b = Vector(a), Vector(b)
    t = (b - a).normalized()
    up = Vector((0, 0, 1)) if abs(t.z) < 0.9 else Vector((1, 0, 0))
    u = t.cross(up).normalized()
    v = u.cross(t).normalized()
    ph = (math.pi / 4 if n == 4 else 0.0) if phase is None else phase
    ring = [(u * math.cos(ph + 2 * math.pi * k / n) + v * math.sin(ph + 2 * math.pi * k / n)) * r
            for k in range(n)]
    A = [a + p for p in ring]
    B = [b + p for p in ring]
    for k in range(n):
        k2 = (k + 1) % n
        mb.poly([A[k], A[k2], B[k2], B[k]], mat, col, out=ring[k] + ring[k2])
    if caps:
        mb.poly(A, mat, end_col, out=-t)
        mb.poly(B, mat, end_col, out=t)


# ---------------------------------------------------------------- walls
def grid(mb, fr, u0, u1, us, fl, w=1.25, col=C_WINDOW, wall_col=C_STUCCO, d=0.07,
         dark=0.75, band_mat='wall'):
    """Window grid (arlington.py technique): one glass strip per column from
    the lowest sill to the highest head, then wall-coloured spandrel bands
    over the strips between floors. fl = [(sill, head)] per floor.
    Costs 2 tris per column + 2 per floor gap."""
    v0, v1 = fl[0][0], fl[-1][1]
    for u in us:
        window(mb, fr, u, w, v0, v1, col, d=d, dark=dark)
    for (a0, a1), (b0, b1) in zip(fl[:-1], fl[1:]):
        wrect(mb, fr, u0, u1, a1, b0, band_mat, wall_col, d + 0.04)


def floors(n, z0, h, sill=0.85, head=2.55):
    """(sill, head) pairs for n floors of height h starting at z0."""
    return [(z0 + i * h + sill, z0 + i * h + head) for i in range(n)]


def fan_uv(uc, vb, r, n):
    """Semicircular Deco fan (sunburst) of n rays above the point (uc, vb):
    a list of CCW triangles in (u, v)."""
    out = []
    for k in range(n):
        a0, a1 = math.pi * k / n, math.pi * (k + 1) / n
        out.append([(uc, vb), (uc + r * math.cos(a0), vb + r * math.sin(a0)),
                    (uc + r * math.cos(a1), vb + r * math.sin(a1))])
    return out
