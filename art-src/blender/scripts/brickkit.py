"""Brick standards, primitive builders and glossy ABS plastic for the brick-toy look.

Phase 1 of the brick-toy campaign (notes: research/brick-style.md). Scripts do
    sys.path.insert(0, <absolute path of art-src/blender/scripts>)
    from brickkit import *
and build each rigid part with a Part plus the primitive helpers below. Like common.py there is no
randomness, so the same knobs always give the same vertices.

Standards
---------
Real toy bricks, from the LDraw ratios (1 LDU = 0.4 mm): stud pitch 8 mm, brick 9.6 mm, plate 3.2 mm,
stud 4.8 mm across and 1.7 mm high, 1.2 mm walls, 0.1 mm of play on each side of a brick.

Game scale: PITCH = 0.28 m, so K = 0.035 m per toy millimetre (35x) and 1 LDU = 0.014 m:
    brick 0.336 m, plate 0.112 m, stud 0.168 m across x 0.0595 m high, edge bevel 0.0105 m.
A crew figure is 5 bricks (15 plates) = 1.68 m tall.

The plan asked for "a ~1.8 m figure = 5 bricks, pitch ~0.36 m, plate ~0.144 m". Those numbers disagree:
5 bricks of 1.8 m make the brick 0.36 m (pitch 0.30 m, plate 0.12 m), while a 0.36 m pitch makes
5 bricks 2.16 m. Neither fits the game. In src/js/gfx/karts3d.js an attendant is 1.51 m to the top of
the head and 1.66 m to the top of the helmet, and the tub shell is 0.84 m wide and 1.72 m long. A 0.28 m
pitch makes the tub exactly 3 x 6 studs (0.84 x 1.68 m) and the helmeted figure 5 bricks (1.68 m), so
every game placement (ATT_POS, wheel hubs, rim height) stays as it is.

Knobs
-----
Every builder takes a Knobs object, so one script can emit the Gold Master and its LOD chain:
    bevel_segs  segments on every edge bevel (0 = hard edge; 1 = a chamfer shaded round)
    stud_segs   sides on a stud
    studs       'geo' (real studs) or 'none' (left to a shader or dropped at distance)
    round_segs  sides on round bricks, wheels and other turned shapes
    curve_segs  segments on large roundings (heads, hands, domes)
    edge        edge-bevel width in metres

Normals
-------
Each face carries a class: FLAT (its own normal), a smooth group (> 0; averaged inside the group) or
BEVEL (takes the normal of the flat or smooth face it touches, else blends with its neighbours). This
is "harden normals" done by hand: flat faces stay flat and bevels catch a rounded highlight, even with
one segment. The result is written as custom corner normals, which the glTF exporter keeps.
"""
import bpy
import bmesh
import math
import os
import sys

from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)
sys.dont_write_bytecode = True               # no __pycache__ next to the scripts
from common import (hexc, lin, srgb, mix, shade, reset, save_blend, export_glb,  # noqa: E402,F401
                    descendants, ROOT, EXPORT_DIR, RENDER_DIR)

GAME = os.path.dirname(os.path.dirname(ROOT))            # games/Cart Racing

# ---------------------------------------------------------------- standards
REAL_MM = {'pitch': 8.0, 'brick': 9.6, 'plate': 3.2, 'stud_d': 4.8, 'stud_h': 1.7,
           'wall': 1.2, 'play': 0.1, 'edge': 0.3, 'stud_edge': 0.2, 'groove': 0.4}
PITCH = 0.28                                  # metres between stud centres
K = PITCH / REAL_MM['pitch']                  # metres per toy millimetre (0.035)
LDU = 0.4 * K                                 # metres per LDraw unit (0.014)
BRICK = REAL_MM['brick'] * K                  # 0.336
PLATE = REAL_MM['plate'] * K                  # 0.112
STUD_D = REAL_MM['stud_d'] * K                # 0.168
STUD_R = STUD_D / 2                           # 0.084
STUD_H = REAL_MM['stud_h'] * K                # 0.0595
WALL = REAL_MM['wall'] * K                    # 0.042
GAP = REAL_MM['play'] * K                     # 0.0035 on each side
EDGE = REAL_MM['edge'] * K                    # 0.0105 default edge bevel
STUD_EDGE = REAL_MM['stud_edge'] * K          # 0.007
GROOVE = REAL_MM['groove'] * K                # 0.014 tile groove height and depth
SINK = 0.002                                  # studs start this far below the surface they sit on

FLAT, BEVEL = 0, -1


class Knobs:
    def __init__(self, bevel_segs=3, stud_segs=32, studs='geo', round_segs=48, curve_segs=8, edge=EDGE):
        self.bevel_segs, self.stud_segs, self.studs = bevel_segs, stud_segs, studs
        self.round_segs, self.curve_segs, self.edge = round_segs, curve_segs, edge

    def asdict(self):
        return dict(bevel_segs=self.bevel_segs, stud_segs=self.stud_segs, studs=self.studs,
                    round_segs=self.round_segs, curve_segs=self.curve_segs, edge=round(self.edge, 5))


GM = Knobs(bevel_segs=4, stud_segs=48, round_segs=64, curve_segs=10)   # Gold Master: no budget

# Starting points for the Phase 4 LOD chain (the plan's table), probed by goldmaster.py --probe. The final
# levels come from the measured budgets in tools/perf-budgets.json and the fidelity metric.
LOD_PROBES = {
    'LOD0': Knobs(bevel_segs=2, stud_segs=16, round_segs=24, curve_segs=4),               # team select ~400 px
    'LOD1': Knobs(bevel_segs=1, stud_segs=8, round_segs=12, curve_segs=2),                # chase ~55 px
    'LOD2': Knobs(bevel_segs=1, stud_segs=6, studs='none', round_segs=8, curve_segs=1),   # pack ~20 px
    'LOD3': Knobs(bevel_segs=0, stud_segs=6, studs='none', round_segs=6, curve_segs=0),   # distant
}


def standards():
    return dict(pitch=PITCH, k_m_per_toy_mm=K, ldu=LDU, brick=round(BRICK, 4), plate=round(PLATE, 4),
                stud_d=round(STUD_D, 4), stud_h=round(STUD_H, 4), wall=round(WALL, 4), gap=round(GAP, 4),
                edge=round(EDGE, 4), figure_height=round(5 * BRICK, 3), real_mm=REAL_MM)


# ---------------------------------------------------------------- bmesh primitives
# Each returns a fresh bmesh with an int face layer 'ncls'; Part.add copies it in with a matrix.
def _new_bm():
    bm = bmesh.new()
    bm.faces.layers.int.new('ncls')
    return bm


def _cls(bm):
    return bm.faces.layers.int['ncls']


def bm_rbox(size, r=EDGE, segs=3):
    """Box centred on the origin, every edge bevelled with radius r (a rounded cube when r is large)."""
    bm = _new_bm()
    c = _cls(bm)
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
    for f in bm.faces:
        f[c] = FLAT
    if r > 0 and segs > 0:
        res = bmesh.ops.bevel(bm, geom=list(bm.edges), offset=r, offset_type='OFFSET', segments=segs,
                              profile=0.5, affect='EDGES', clamp_overlap=True)
        for f in res['faces']:
            f[c] = BEVEL
    return bm


def _ring(bm, n, fn):
    return [bm.verts.new(fn(2 * math.pi * k / n)) for k in range(n)]


def bm_loft(rings, group=1, closed=True, flip=False, bm=None):
    """Quads between rings of equal length (lists of points). Returns (bm, vertex rings)."""
    bm = bm or _new_bm()
    c = _cls(bm)
    vr = [[bm.verts.new(Vector(p)) for p in r] for r in rings]
    n = len(rings[0])
    for i in range(len(vr) - 1):
        A, B = vr[i], vr[i + 1]
        for k in range(n if closed else n - 1):
            k2 = (k + 1) % n
            q = [A[k], A[k2], B[k2], B[k]]
            f = bm.faces.new(list(reversed(q)) if flip else q)
            f[c] = group
    return bm, vr


def bm_cap(bm, ring, up=True, cls=FLAT):
    """n-gon over a vertex ring; up=True when the ring runs counter-clockwise seen from the outside."""
    f = bm.faces.new(ring if up else list(reversed(ring)))
    f[_cls(bm)] = cls
    return f


def _bevel_edges(bm, edges, r, segs):
    if r <= 0 or segs <= 0 or not edges:
        return
    res = bmesh.ops.bevel(bm, geom=edges, offset=r, offset_type='OFFSET', segments=segs, profile=0.5,
                          affect='EDGES', clamp_overlap=True)
    c = _cls(bm)
    for f in res['faces']:
        f[c] = BEVEL


def _ring_edges(ring):
    n = len(ring)
    out = []
    for k in range(n):
        e = ring[k].link_edges
        for ed in e:
            if ed.other_vert(ring[k]) is ring[(k + 1) % n]:
                out.append(ed)
                break
    return out


def bm_cyl(r, h, segs, cap0=True, cap1=True, b0=0.0, b1=0.0, bsegs=3, r1=None):
    """Cylinder (or cone frustum with r1) along +Z from 0 to h; caps flat, side one smooth group, rims
    rounded with radius b0 / b1 in bsegs steps. The roundings are built as profile arcs rather than with
    bmesh.ops.bevel: two bevel calls on one bmesh came out in a different order from run to run."""
    r1 = r if r1 is None else r1
    bm = _new_bm()
    c = _cls(bm)
    prof = []                                   # (radius, z, class of the band that ends here)
    if cap0 and b0 > 0 and bsegs > 0:
        for k in range(bsegs + 1):
            a = -math.pi / 2 + math.pi / 2 * k / bsegs
            prof.append((r - b0 + b0 * math.cos(a), b0 + b0 * math.sin(a), BEVEL))
    else:
        prof.append((r, 0.0, None))
    if cap1 and b1 > 0 and bsegs > 0:
        for k in range(bsegs + 1):
            a = math.pi / 2 * k / bsegs
            prof.append((r1 - b1 + b1 * math.cos(a), h - b1 + b1 * math.sin(a), 1 if k == 0 else BEVEL))
    else:
        prof.append((r1, h, 1))
    rows = [_ring(bm, segs, lambda a, rr=rr, z=z: (rr * math.cos(a), rr * math.sin(a), z)) for rr, z, _ in prof]
    for i in range(len(rows) - 1):
        A, B = rows[i], rows[i + 1]
        for k in range(segs):
            k2 = (k + 1) % segs
            bm.faces.new([A[k], A[k2], B[k2], B[k]])[c] = prof[i + 1][2]
    if cap1:
        bm_cap(bm, rows[-1], True)
    if cap0:
        bm_cap(bm, rows[0], False)
    return bm


def bm_tube(r_out, r_in, h, segs, b=0.0, bsegs=3, floor=None):
    """Hollow cylinder: outer wall, top annulus, inner wall down to `floor` (depth below the top)."""
    bm = _new_bm()
    c = _cls(bm)
    ob = _ring(bm, segs, lambda a: (r_out * math.cos(a), r_out * math.sin(a), 0.0))
    ot = _ring(bm, segs, lambda a: (r_out * math.cos(a), r_out * math.sin(a), h))
    it = _ring(bm, segs, lambda a: (r_in * math.cos(a), r_in * math.sin(a), h))
    d = h if floor is None else floor
    ib = _ring(bm, segs, lambda a: (r_in * math.cos(a), r_in * math.sin(a), h - d))
    for k in range(segs):
        k2 = (k + 1) % segs
        bm.faces.new([ob[k], ob[k2], ot[k2], ot[k]])[c] = 1
        bm.faces.new([ot[k], ot[k2], it[k2], it[k]])[c] = FLAT
        bm.faces.new([it[k], it[k2], ib[k2], ib[k]])[c] = 2
    bm_cap(bm, ib, True)
    if b:
        _bevel_edges(bm, _ring_edges(ot) + _ring_edges(it), b, bsegs)
    return bm


def bm_sphere(r, segs, rings, sz=1.0, top_only=False):
    """UV sphere (one smooth group) centred on the origin; sz scales Z; top_only = upper half, open."""
    bm = _new_bm()
    c = _cls(bm)
    n_r = rings // 2 if top_only else rings
    pole = bm.verts.new((0, 0, r * sz))
    rows = []
    for j in range(1, n_r + (1 if top_only else 0)):
        t = math.pi * j / rings
        rows.append(_ring(bm, segs, lambda a, t=t: (r * math.sin(t) * math.cos(a), r * math.sin(t) * math.sin(a),
                                                    r * sz * math.cos(t))))
    for k in range(segs):
        bm.faces.new([pole, rows[0][k], rows[0][(k + 1) % segs]])[c] = 1
    for j in range(len(rows) - 1):
        A, B = rows[j], rows[j + 1]
        for k in range(segs):
            k2 = (k + 1) % segs
            bm.faces.new([A[k], B[k], B[k2], A[k2]])[c] = 1
    if not top_only:
        bp = bm.verts.new((0, 0, -r * sz))
        L = rows[-1]
        for k in range(segs):
            bm.faces.new([L[k], bp, L[(k + 1) % segs]])[c] = 1
    return bm


def bm_sweep(prof, ring_fn, closed=False, sharp=35.0):
    """Sweep a 2D profile [(a, b), ...] through ring_fn(a, b) -> list of points (all the same length),
    or a single point for a pole. A new smooth group starts wherever the profile turns by more than
    `sharp` degrees, so steps stay crisp and curves stay smooth. Winding follows the profile; callers
    with closed shells pass recalc=True to Part.add."""
    bm = _new_bm()
    c = _cls(bm)
    rows = []
    for a, b in prof:
        r = ring_fn(a, b)
        if isinstance(r, (list, tuple)) and len(r) and not isinstance(r[0], (int, float)):
            rows.append([bm.verts.new(Vector(q)) for q in r])
        else:
            rows.append(bm.verts.new(Vector(r)))
    segs = len(prof) if closed else len(prof) - 1
    g, prev = 1, None
    for i in range(segs):
        j = (i + 1) % len(prof)
        if sharp is not None:
            d = Vector((prof[j][0] - prof[i][0], prof[j][1] - prof[i][1]))
            if prev is not None and d.length > 1e-12 and prev.length > 1e-12:
                if math.degrees(prev.angle(d)) > sharp:
                    g += 1
            if d.length > 1e-12:
                prev = d
        A, B = rows[i], rows[j]
        if isinstance(A, list) and isinstance(B, list):
            n = len(A)
            for k in range(n):
                bm.faces.new([A[k], A[(k + 1) % n], B[(k + 1) % n], B[k]])[c] = g
        elif isinstance(A, list):
            n = len(A)
            for k in range(n):
                bm.faces.new([A[k], A[(k + 1) % n], B])[c] = g
        elif isinstance(B, list):
            n = len(B)
            for k in range(n):
                bm.faces.new([A, B[(k + 1) % n], B[k]])[c] = g
    return bm


def bm_lathe(prof, segs, axis='Z', closed=False, sharp=35.0):
    """Surface of revolution of [(a, r)] around `axis` (a runs along the axis); r = 0 makes a pole."""
    def ring(a, r):
        if r < 1e-9:
            return (a, 0.0, 0.0) if axis == 'X' else (0.0, 0.0, a)
        pts = []
        for k in range(segs):
            t = 2 * math.pi * k / segs
            pts.append((a, r * math.cos(t), r * math.sin(t)) if axis == 'X' else (r * math.cos(t), r * math.sin(t), a))
        return pts
    return bm_sweep(prof, ring, closed, sharp)


def bm_stud(kn, hollow=False):
    """One stud with its base SINK below z = 0 (so no crack shows where it meets the surface)."""
    h = STUD_H + SINK
    if hollow:
        bm = bm_tube(STUD_R, 1.6 * K, h, kn.stud_segs, b=STUD_EDGE * 0.7, bsegs=kn.bevel_segs, floor=h * 0.8)
    else:
        bm = bm_cyl(STUD_R, h, kn.stud_segs, cap0=False, b1=STUD_EDGE, bsegs=kn.bevel_segs)
    bmesh.ops.translate(bm, vec=(0, 0, -SINK), verts=bm.verts)
    return bm


# ---------------------------------------------------------------- Part
def T(x=0.0, y=0.0, z=0.0):
    return Matrix.Translation((x, y, z))


def R(deg, axis='Z'):
    return Matrix.Rotation(math.radians(deg), 4, axis)


def S(x, y=None, z=None):
    y = x if y is None else y
    z = x if z is None else z
    return Matrix.Diagonal((x, y, z, 1.0))


class Part:
    """One rigid part: primitives copied into a single bmesh, authored in world coordinates."""

    def __init__(self, name):
        self.name = name
        self.bm = bmesh.new()
        self.cls = self.bm.faces.layers.int.new('ncls')
        self.uv = self.bm.loops.layers.uv.new('UVMap')
        self.slots = []
        self.groups = 0

    def slot(self, key):
        if key not in self.slots:
            self.slots.append(key)
        return self.slots.index(key)

    def add(self, src, M=None, mat='default', recalc=False):
        """Copy bmesh `src` (freed afterwards) through matrix M. mat: key, or fn(centre, normal) -> key,
        both in world space. recalc=True makes a closed shell's normals point outward first."""
        if recalc:
            bmesh.ops.recalc_face_normals(src, faces=src.faces[:])
        scls = src.faces.layers.int.get('ncls')
        M = M or Matrix.Identity(4)
        flip = M.determinant() < 0
        vm = {v: self.bm.verts.new(M @ v.co) for v in src.verts}
        gm = {}
        N3 = M.to_3x3().inverted_safe().transposed()
        for f in src.faces:
            vs = [vm[v] for v in f.verts]
            nf = self.bm.faces.new(list(reversed(vs)) if flip else vs)
            c = f[scls] if scls else FLAT
            if c > 0:
                if c not in gm:
                    self.groups += 1
                    gm[c] = self.groups
                c = gm[c]
            nf[self.cls] = c
            if callable(mat):
                key = mat(M @ f.calc_center_median(), (N3 @ f.normal).normalized())
            else:
                key = mat
            nf.material_index = self.slot(key)
            nf.smooth = True
        src.free()
        return self

    def project(self, mat, sel, uv):
        """Planar print: faces where sel(centre, normal) is true get material `mat` and UVs uv(point)."""
        for f in self.bm.faces:
            f.normal_update()
            if sel(f.calc_center_median(), f.normal):
                f.material_index = self.slot(mat)
                for lp in f.loops:
                    lp[self.uv].uv = uv(lp.vert.co)
        return self

    def build(self, mats, pivot=(0, 0, 0), parent=None, coll=None, parent_pivot=None):
        """Mesh object with its origin at `pivot` (world). With a parent, the object is parented and placed
        at pivot - parent_pivot (rest pose has no rotation)."""
        pv = Vector(pivot)
        bmesh.ops.translate(self.bm, vec=-pv, verts=self.bm.verts)
        me = bpy.data.meshes.new(self.name)
        self.bm.to_mesh(me)
        self.bm.free()
        for k in self.slots:
            me.materials.append(mats[k] if isinstance(mats, dict) else mats(k))
        _set_normals(me)
        me.attributes.remove(me.attributes['ncls'])
        me.update()
        o = bpy.data.objects.new(self.name, me)
        (coll or bpy.context.scene.collection).objects.link(o)
        if parent is not None:
            o.parent = parent
            o.location = pv - Vector(parent_pivot if parent_pivot is not None else (0, 0, 0))
        else:
            o.location = pv
        return o


def _set_normals(me):
    att = me.attributes['ncls']
    n = len(me.polygons)
    cls = [0] * n
    att.data.foreach_get('value', cls)
    pn = [p.normal.copy() for p in me.polygons]
    vf = [[] for _ in range(len(me.vertices))]
    for p in me.polygons:
        for v in p.vertices:
            vf[v].append(p.index)
    lv = [0] * len(me.loops)
    me.loops.foreach_get('vertex_index', lv)
    out = [None] * len(me.loops)
    cache = {}
    for p in me.polygons:
        c = cls[p.index]
        for li in p.loop_indices:
            v = lv[li]
            if c == FLAT:
                out[li] = pn[p.index]
                continue
            key = (v, c if c > 0 else BEVEL)
            nrm = cache.get(key)
            if nrm is None:
                adj = vf[v]
                if c > 0:
                    sel = [q for q in adj if cls[q] == c]
                else:
                    sel = [q for q in adj if cls[q] == FLAT] or [q for q in adj if cls[q] > 0] or adj
                s = Vector()
                for q in sel:
                    s += pn[q]
                nrm = s.normalized() if s.length > 1e-12 else pn[p.index]
                cache[key] = nrm
            out[li] = nrm
    me.normals_split_custom_set([tuple(v) for v in out])


# ---------------------------------------------------------------- brick builders
def _grid(nx, ny):
    return [((i - (nx - 1) / 2) * PITCH, (j - (ny - 1) / 2) * PITCH) for j in range(ny) for i in range(nx)]


def studs(p, kn, nx, ny, M, mat, hollow=False):
    """Grid of studs on the plane z = 0 of M, centred on its origin."""
    if kn.studs != 'geo':
        return p
    for x, y in _grid(nx, ny):
        p.add(bm_stud(kn, hollow), M @ T(x, y, 0), mat)
    return p


def brick(p, kn, nx, ny, plates=3, M=None, mat='red', top=True):
    """nx x ny brick, `plates` plates high, bottom centre at the origin of M. top=False: no studs."""
    M = M or Matrix.Identity(4)
    w, l, h = nx * PITCH - 2 * GAP, ny * PITCH - 2 * GAP, plates * PLATE
    p.add(bm_rbox((w, l, h), kn.edge, kn.bevel_segs), M @ T(0, 0, h / 2), mat)
    if top:
        studs(p, kn, nx, ny, M @ T(0, 0, h), mat)
    return p


def plate(p, kn, nx, ny, M=None, mat='red'):
    return brick(p, kn, nx, ny, 1, M, mat)


def tile(p, kn, nx, ny, M=None, mat='red'):
    """Plate with no studs and the groove round the bottom edge."""
    M = M or Matrix.Identity(4)
    w, l = nx * PITCH - 2 * GAP, ny * PITCH - 2 * GAP
    hb = PLATE - GROOVE
    p.add(bm_rbox((w, l, hb), kn.edge, kn.bevel_segs), M @ T(0, 0, GROOVE + hb / 2), mat)
    p.add(bm_rbox((w - 2 * GROOVE, l - 2 * GROOVE, GROOVE + kn.edge), kn.edge * 0.5, max(1, kn.bevel_segs - 1)),
          M @ T(0, 0, (GROOVE + kn.edge) / 2), mat)
    return p


def round_brick(p, kn, M=None, mat='red', plates=3):
    """1 x 1 round brick: full-width drum on a narrower foot, hollow stud on top (LDraw 3062b ratios)."""
    M = M or Matrix.Identity(4)
    h = plates * PLATE
    foot = 5 * LDU
    p.add(bm_cyl(PITCH / 2 - GAP, h - foot, kn.round_segs, b0=kn.edge, b1=kn.edge, bsegs=kn.bevel_segs),
          M @ T(0, 0, foot), mat)
    p.add(bm_cyl(8 * LDU, foot + kn.edge, kn.round_segs, cap1=False, b0=kn.edge * 0.6, bsegs=kn.bevel_segs),
          M, mat)
    if kn.studs == 'geo':
        p.add(bm_stud(kn, hollow=True), M @ T(0, 0, h), mat)
    return p


def rbox(p, kn, size, at, r=None, M=None, mat='red', segs=None):
    """Rounded box centred at `at` (in the frame of M). r defaults to the edge bevel."""
    M = M or Matrix.Identity(4)
    r = kn.edge if r is None else r
    segs = (kn.bevel_segs if r <= 2 * kn.edge else kn.curve_segs) if segs is None else segs
    return p.add(bm_rbox(size, r, segs), M @ T(*at), mat)


def cyl(p, kn, r, h, M=None, mat='red', segs=None, b0=None, b1=None, cap0=True, cap1=True, r1=None):
    """Cylinder along +Z of M from 0 to h, edge bevels on both rims by default."""
    M = M or Matrix.Identity(4)
    b0 = kn.edge if b0 is None else b0
    b1 = kn.edge if b1 is None else b1
    return p.add(bm_cyl(r, h, segs or kn.round_segs, cap0, cap1, b0, b1, kn.bevel_segs, r1), M, mat)


def sphere(p, kn, r, M=None, mat='red', sz=1.0, top_only=False, segs=None):
    M = M or Matrix.Identity(4)
    s = segs or kn.round_segs
    return p.add(bm_sphere(r, s, max(6, s // 2), sz, top_only), M, mat)


# ---------------------------------------------------------------- materials
# Generic colour names only; values are sRGB. Team colours come from src/js/data/teams.js.
PALETTE = {
    'red': '#C8322A', 'yellow': '#F2C230', 'white': '#F4F4F0', 'off_white': '#F4F1EA', 'black': '#1D1D22',
    'charcoal': '#2A2D34', 'slate': '#3A3F4A', 'iron': '#3B3B42', 'dark_grey': '#5B5E64',
    'light_grey': '#A9ADB2', 'silver': '#C9CDD2', 'tan': '#D9B77A', 'teal': '#3FA8C0', 'pink': '#F7B6CE',
    'duck': '#F5D547', 'beak': '#F07F22', 'enamel': '#F7F5EF', 'lime': '#CFE23A', 'blue': '#2B4D9B',
    'green': '#3E7B3A', 'orange': '#F07F22', 'water': '#7CCBE8', 'backdrop': '#B7BBC1',
}

KINDS = {
    # roughness, specular IOR level, IOR, coat, subsurface weight, metallic
    'abs': (0.17, 0.5, 1.54, 0.0, 0.03, 0.0),
    'abs_matte': (0.42, 0.45, 1.54, 0.0, 0.0, 0.0),
    'rubber': (0.68, 0.3, 1.5, 0.0, 0.0, 0.0),
    'metal': (0.28, 0.5, 1.5, 0.0, 0.0, 1.0),
    'enamel': (0.08, 0.5, 1.52, 0.6, 0.02, 0.0),
    'reflective': (0.3, 0.6, 1.5, 0.0, 0.0, 0.35),
    'water': (0.04, 0.5, 1.33, 0.0, 0.0, 0.0),
    'studio': (0.85, 0.2, 1.5, 0.0, 0.0, 0.0),
}


def plastic(name, rgb, kind='abs', image=None):
    """Principled material that the glTF exporter maps cleanly: plain values, plus an optional
    base-colour image (decals are pre-composited onto the part colour, so no mix nodes are needed)."""
    m = bpy.data.materials.get(name)
    if m is not None:
        return m
    rough, spec, ior, coat, sss, metal = KINDS[kind]
    m = bpy.data.materials.new(name)
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    b = [n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    col = hexc(rgb) if isinstance(rgb, str) else tuple(rgb)
    b.inputs['Base Color'].default_value = (*lin(col), 1.0)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    b.inputs['Specular IOR Level'].default_value = spec
    b.inputs['IOR'].default_value = ior
    if coat:
        b.inputs['Coat Weight'].default_value = coat
        b.inputs['Coat Roughness'].default_value = 0.04
    if sss:
        b.inputs['Subsurface Weight'].default_value = sss
        b.inputs['Subsurface Radius'].default_value = (1.0, 0.45, 0.25)
        b.inputs['Subsurface Scale'].default_value = 0.012
    if kind == 'water':
        # thin wall: a single sheet of translucent light-blue toy plastic, part diffuse so it stays bright
        # in the tub's shadow
        b.inputs['Transmission Weight'].default_value = 0.55
        b.inputs['Thin Wall'].default_value = True
    if image:
        tex = nt.nodes.new('ShaderNodeTexImage')
        tex.image = bpy.data.images.load(image, check_existing=True)
        tex.interpolation = 'Cubic'
        tex.extension = 'EXTEND'
        nt.links.new(tex.outputs['Color'], b.inputs['Base Color'])
    m.diffuse_color = (*lin(col), 1.0)
    return m


class Mats(dict):
    """key -> material, created on first use from PALETTE (or a '#RRGGBB' key) and a kind suffix:
    'red', 'red/rubber', '#C8322A/abs'."""

    def __missing__(self, key):
        name, _, kind = key.partition('/')
        rgb = name if name.startswith('#') else PALETTE[name]
        m = plastic('%s_%s' % (name.lstrip('#'), kind or 'abs'), rgb, kind or 'abs')
        self[key] = m
        return m


# ---------------------------------------------------------------- stats
def tris(o):
    dg = bpy.context.evaluated_depsgraph_get()
    e = o.evaluated_get(dg)
    me = e.to_mesh()
    me.calc_loop_triangles()
    n = len(me.loop_triangles)
    e.to_mesh_clear()
    return n


# ---------------------------------------------------------------- studio and Cycles
def cycles(samples=384, res=(1024, 1024), transparent=False, seed=0):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    prefs = bpy.context.preferences.addons['cycles'].preferences
    dev = 'CPU'
    for t in ('OPTIX', 'CUDA'):
        try:
            prefs.compute_device_type = t
            prefs.get_devices()
            gpus = [d for d in prefs.devices if d.type == t]
            if gpus:
                for d in prefs.devices:
                    d.use = d.type == t
                dev = 'GPU'
                break
        except Exception:
            continue
    sc.cycles.device = dev
    sc.cycles.samples = samples
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.006
    sc.cycles.seed = seed
    sc.cycles.use_denoising = True
    try:
        sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    except Exception:
        pass
    sc.cycles.max_bounces = 10
    sc.cycles.transmission_bounces = 8
    sc.cycles.glossy_bounces = 6
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.cycles.blur_glossy = 0.5
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = transparent
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA' if transparent else 'RGB'
    sc.render.image_settings.color_depth = '8'
    sc.view_settings.view_transform = 'Khronos PBR Neutral'
    sc.view_settings.look = 'None'
    sc.view_settings.exposure = -1.3
    sc.view_settings.gamma = 1.0
    return dev


def studio(coll, floor_r=7.0, cove_r=2.2, wall_h=7.0, segs=96, color='backdrop', world=0.32):
    """Round infinity cove (floor dish curving up into a cylinder wall) so the camera can orbit, plus a
    soft grey world. Returns the backdrop object."""
    mats = Mats()
    bm = _new_bm()
    prof = [(0.0, 0.0), (floor_r * 0.5, 0.0), (floor_r, 0.0)]
    for k in range(1, 9):
        a = math.pi / 2 * k / 8
        prof.append((floor_r + cove_r * math.sin(a), cove_r * (1 - math.cos(a))))
    prof.append((floor_r + cove_r, wall_h))
    rings = []
    for d, z in prof[1:]:
        rings.append([(d * math.cos(2 * math.pi * k / segs), d * math.sin(2 * math.pi * k / segs), z)
                      for k in range(segs)])
    bm, vr = bm_loft(rings, group=1, bm=bm, flip=True)
    centre = bm.verts.new((0, 0, 0))
    c = _cls(bm)
    for k in range(segs):
        bm.faces.new([centre, vr[0][k], vr[0][(k + 1) % segs]])[c] = 1
    p = Part('backdrop')
    p.add(bm, None, color + '/studio')
    o = p.build(mats, coll=coll)
    w = bpy.data.worlds.new('studio_world')
    bpy.context.scene.world = w
    try:
        w.use_nodes = True
    except Exception:
        pass
    bg = [n for n in w.node_tree.nodes if n.type == 'BACKGROUND'][0]
    bg.inputs[0].default_value = (world, world, world, 1.0)
    bg.inputs[1].default_value = 1.0
    return o


def area(coll, name, loc, target, size, energy, color=(1.0, 1.0, 1.0), parent=None, shape='RECTANGLE', size_y=None):
    ld = bpy.data.lights.new(name, 'AREA')
    ld.shape = shape
    ld.size = size
    if size_y:
        ld.size_y = size_y
    ld.energy = energy
    ld.color = color
    o = bpy.data.objects.new(name, ld)
    coll.objects.link(o)
    o.location = Vector(loc)
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    if parent:
        o.parent = parent
    return o


def camera(coll, name='cam', lens=85.0, ortho=None, parent=None):
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    cd.clip_start = 0.05
    cd.clip_end = 100.0
    cd.sensor_fit = 'VERTICAL'
    if ortho:
        cd.type = 'ORTHO'
        cd.ortho_scale = ortho
    o = bpy.data.objects.new(name, cd)
    coll.objects.link(o)
    if parent:
        o.parent = parent
    bpy.context.scene.camera = o
    return o


def look(o, loc, target):
    o.location = Vector(loc)
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()


def render_to(path):
    sc = bpy.context.scene
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
    return path


def _to_lin(a):
    import numpy as np
    return np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)


def _to_srgb(a):
    import numpy as np
    a = np.clip(a, 0.0, 1.0)
    return np.where(a <= 0.0031308, a * 12.92, 1.055 * a ** (1 / 2.4) - 0.055)


def box_down(src, dst, f):
    """Box-filter an RGBA sRGB PNG down by f x f in linear light with premultiplied alpha
    (the 16x supersample is a 4x4 box)."""
    import numpy as np
    img = bpy.data.images.load(src)
    w, h = img.size
    a = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(a)
    a = a.reshape(h, w, 4).astype(np.float64)
    bpy.data.images.remove(img)
    rgb = _to_lin(a[..., :3]) * a[..., 3:4]
    al = a[..., 3:4]
    W, H = w // f, h // f
    rgb = rgb[:H * f, :W * f].reshape(H, f, W, f, 3).mean(axis=(1, 3))
    al = al[:H * f, :W * f].reshape(H, f, W, f, 1).mean(axis=(1, 3))
    out = np.concatenate([_to_srgb(np.where(al > 1e-6, rgb / np.maximum(al, 1e-6), 0.0)), al], axis=2)
    o = bpy.data.images.new('box_down', W, H, alpha=True)
    o.pixels.foreach_set(out.astype(np.float32).ravel())
    o.filepath_raw = dst
    o.file_format = 'PNG'
    o.save()
    bpy.data.images.remove(o)
    return dst
