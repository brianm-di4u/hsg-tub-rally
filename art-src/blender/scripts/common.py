"""Shared helpers for the procedural low-poly kart-racing models.

Adapted from hsg-fishing (repos/hsg-fishing/art-src/blender/scripts/common.py),
MIT License, Copyright (c) 2026 Hot Springs Games contributors.

Additions for the landmark set (early-N64 look, see art-src/blender/README.md):
  colour  - hexc(), mix(), mix_lin(), shade()
  mesh    - MB.poly() per-face-coloured polygon with auto-orientation,
            MB.build(order=...) fixed material-slot order
  walls   - Frame (vertical wall plane), wpoly/wrect, vquad, bands,
            arch_uv() + window() flat inset panels, fbox() wall-mounted box,
            cbox() per-face box, outline_prism() (shaped parapets),
            star_uv() (quatrefoils / rosettes)
  roofs   - hip_roof() with fascia and soffit
  uv      - box_uv() world-space box projection (1 UV unit = N metres)
  io      - export_glb(texcoords=True), render_cam() fixed eye-point preview,
            tri_count_by_material()

Every model script does:
    import sys, os
    sys.path.insert(0, <absolute path of art-src/blender/scripts>)
    from common import *
and is run with:
    blender -b --factory-startup --python art-src/blender/scripts/<...>.py -- [args]
"""
import bpy
import bmesh
import math
import os
import random
from mathutils import Vector, Matrix, noise

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)                      # art-src/blender
EXPORT_DIR = os.path.join(ROOT, 'export')
RENDER_DIR = os.path.join(ROOT, 'renders')
for _d in (EXPORT_DIR, RENDER_DIR):
    os.makedirs(_d, exist_ok=True)

SKY = (0.62, 0.77, 0.93)
ZUP = Vector((0.0, 0.0, 1.0))


# ---------------------------------------------------------------- colour
def hexc(h):
    """'#RRGGBB' -> (r, g, b) sRGB floats 0-1."""
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4))


def lin(c):
    """sRGB (0-1) -> linear, for Principled inputs."""
    def f(v):
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return tuple(f(v) for v in c[:3])


def srgb(c):
    """linear -> sRGB (0-1)."""
    def f(v):
        v = max(0.0, min(1.0, v))
        return v * 12.92 if v <= 0.0031308 else 1.055 * v ** (1 / 2.4) - 0.055
    return tuple(f(v) for v in c[:3])


def mix(a, b, t):
    """Straight sRGB lerp (for gradients)."""
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


def mix_lin(a, b, t):
    """Area-weighted mix in linear light: what a fine a/b pattern with
    coverage t of b averages to when seen from far away."""
    la, lb = lin(a), lin(b)
    return srgb(tuple(la[i] + (lb[i] - la[i]) * t for i in range(3)))


def shade(c, k):
    return tuple(max(0.0, min(1.0, v * k)) for v in c[:3])


# ---------------------------------------------------------------- scene
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.unit_settings.system = 'METRIC'
    sc.unit_settings.scale_length = 1.0
    bpy.context.preferences.filepaths.save_version = 0   # no .blend1 backups


def _principled(m):
    if m.node_tree is None:
        try:
            m.use_nodes = True
        except Exception:
            pass
    for n in m.node_tree.nodes:
        if n.type == 'BSDF_PRINCIPLED':
            return n
    out = m.node_tree.nodes.get('Material Output') or m.node_tree.nodes.new('ShaderNodeOutputMaterial')
    b = m.node_tree.nodes.new('ShaderNodeBsdfPrincipled')
    m.node_tree.links.new(b.outputs[0], out.inputs[0])
    return b


def mat(name, rgb=(1, 1, 1), rough=0.6, metal=0.0, coat=0.0, alpha=1.0,
        vcol=False, cull=True, spec=0.5):
    """Principled material from an sRGB colour. vcol=True drives Base Color
    from the 'Col' colour attribute (exported as COLOR_0)."""
    m = bpy.data.materials.new(name)
    try:
        m.use_nodes = True
    except Exception:
        pass
    b = _principled(m)
    b.inputs['Base Color'].default_value = (*lin(rgb), 1.0)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if 'Specular IOR Level' in b.inputs:
        b.inputs['Specular IOR Level'].default_value = spec
    if coat:
        b.inputs['Coat Weight'].default_value = coat
        b.inputs['Coat Roughness'].default_value = 0.08
    if alpha < 1.0:
        b.inputs['Alpha'].default_value = alpha
        try:
            m.surface_render_method = 'BLENDED'
        except Exception:
            pass
        try:
            m.blend_method = 'BLEND'
        except Exception:
            pass
    if vcol:
        n = m.node_tree.nodes.new('ShaderNodeVertexColor')
        n.layer_name = 'Col'
        m.node_tree.links.new(n.outputs['Color'], b.inputs['Base Color'])
    m.use_backface_culling = cull
    m.diffuse_color = (*lin(rgb), alpha)
    return m


# ---------------------------------------------------------------- mesh builder
def newell(pts):
    """Polygon normal (Newell's method; robust for concave polygons)."""
    n = Vector((0.0, 0.0, 0.0))
    k = len(pts)
    for i in range(k):
        a, b = pts[i], pts[(i + 1) % k]
        n.x += (a.y - b.y) * (a.z + b.z)
        n.y += (a.z - b.z) * (a.x + b.x)
        n.z += (a.x - b.x) * (a.y + b.y)
    return n


class MB:
    """Collects verts/faces with a material key and per-vertex colour."""

    def __init__(self):
        self.v, self.c, self.f, self.m, self.s = [], [], [], [], []

    def vert(self, p, c=None):
        self.v.append(Vector(p))
        self.c.append(tuple(c) if c is not None else (1.0, 1.0, 1.0))
        return len(self.v) - 1

    def face(self, ids, mat='default', smooth=True):
        self.f.append(list(ids))
        self.m.append(mat)
        self.s.append(smooth)

    def poly(self, pts, mat='default', col=(1.0, 1.0, 1.0), out=None, smooth=False):
        """Per-face coloured polygon with its own (unshared) vertices, so a
        flat colour per face survives the POINT-domain colour attribute.
        col: (r,g,b) or callable(world_point)->(r,g,b) for gradients.
        out: optional outward hint; the winding is flipped to face it."""
        pts = [Vector(p) for p in pts]
        if out is not None and newell(pts).dot(Vector(out)) < 0:
            pts.reverse()
        ids = [self.vert(p, col(p) if callable(col) else col) for p in pts]
        self.face(ids, mat, smooth)
        return ids

    def build(self, name, mats, sharp=None, vcol=False, merge=0.0,
              recalc=False, link=True, order=None):
        keys = [k for k in (order or []) if k in self.m]
        for k in self.m:
            if k not in keys:
                keys.append(k)
        me = bpy.data.meshes.new(name)
        me.from_pydata([tuple(v) for v in self.v], [], self.f)
        for k in keys:
            me.materials.append(mats[k])
        me.polygons.foreach_set('material_index', [keys.index(k) for k in self.m])
        me.polygons.foreach_set('use_smooth', self.s)
        if vcol:
            a = me.color_attributes.new('Col', 'BYTE_COLOR', 'POINT')
            for i, c in enumerate(self.c):
                a.data[i].color_srgb = (c[0], c[1], c[2], 1.0)
            me.color_attributes.active_color = a
            try:
                me.color_attributes.render_color_index = 0
            except Exception:
                pass
        if merge or recalc:
            bm = bmesh.new()
            bm.from_mesh(me)
            if merge:
                bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=merge)
                bmesh.ops.dissolve_degenerate(bm, edges=bm.edges[:], dist=merge * 0.5)
            if recalc:
                bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
            bm.to_mesh(me)
            bm.free()
        if sharp is not None:
            me.set_sharp_from_angle(angle=math.radians(sharp))
        me.validate()
        me.update()
        o = bpy.data.objects.new(name, me)
        if link:
            bpy.context.scene.collection.objects.link(o)
        return o


def xf(M, p):
    return M @ Vector(p) if M is not None else Vector(p)


def add_bm(mb, bm, M=None, mat='default', color=None, smooth=True):
    idx = {}
    for v in bm.verts:
        p = xf(M, v.co)
        idx[v] = mb.vert(p, color(p) if color else None)
    for f in bm.faces:
        mb.face([idx[v] for v in f.verts], mat, smooth)


def box(mb, lo, hi, mat='default', M=None, smooth=False):
    x0, y0, z0 = lo
    x1, y1, z1 = hi
    P = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
         (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    i = [mb.vert(xf(M, p)) for p in P]
    for q in ((0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)):
        mb.face([i[k] for k in q], mat, smooth)


def cbox(mb, lo, hi, mat='default', col=(1, 1, 1), skip=(), mats=None, cols=None):
    """Axis-aligned box, one flat colour per face, unshared verts.
    Face keys: '-x' '+x' '-y' '+y' '-z' '+z'. skip: keys to omit.
    mats/cols: optional per-key overrides."""
    x0, y0, z0 = lo
    x1, y1, z1 = hi
    F = {
        '-x': ([(x0, y0, z0), (x0, y1, z0), (x0, y1, z1), (x0, y0, z1)], (-1, 0, 0)),
        '+x': ([(x1, y0, z0), (x1, y1, z0), (x1, y1, z1), (x1, y0, z1)], (1, 0, 0)),
        '-y': ([(x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1)], (0, -1, 0)),
        '+y': ([(x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)], (0, 1, 0)),
        '-z': ([(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0)], (0, 0, -1)),
        '+z': ([(x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)], (0, 0, 1)),
    }
    for k, (pts, out) in F.items():
        if k in skip:
            continue
        mb.poly(pts, (mats or {}).get(k, mat), (cols or {}).get(k, col), out=out)


def rbox(mb, size, bevel, M=None, mat='default', segments=1):
    """Bevelled box centred on the origin of M."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
    bmesh.ops.bevel(bm, geom=bm.verts[:] + bm.edges[:], offset=bevel,
                    segments=segments, affect='EDGES', profile=0.5)
    add_bm(mb, bm, M, mat)
    bm.free()


def prism(mb, poly, y0, y1, mat='default', M=None, side_mats=None, smooth=False):
    """Extrude a convex XZ polygon (CCW seen from -Y) between y0 and y1."""
    a = [mb.vert(xf(M, (x, y0, z))) for x, z in poly]
    b = [mb.vert(xf(M, (x, y1, z))) for x, z in poly]
    n = len(poly)
    mb.face(a, mat, smooth)
    mb.face(list(reversed(b)), mat, smooth)
    for k in range(n):
        k2 = (k + 1) % n
        mk = side_mats[k] if side_mats else mat
        mb.face([a[k], b[k], b[k2], a[k2]], mk, smooth)


def frames_along(pts):
    pts = [Vector(p) for p in pts]
    n = len(pts)
    T = []
    for i in range(n):
        if i == 0:
            t = pts[1] - pts[0]
        elif i == n - 1:
            t = pts[-1] - pts[-2]
        else:
            t = pts[i + 1] - pts[i - 1]
        T.append(t.normalized())
    up = Vector((0, 0, 1)) if abs(T[0].z) < 0.9 else Vector((1, 0, 0))
    N = T[0].cross(up).normalized()
    out = []
    for i in range(n):
        N = (N - T[i] * N.dot(T[i])).normalized()
        out.append((pts[i], T[i], N, T[i].cross(N)))
    return out


def tube(mb, pts, radii, sides, mat='default', cap0=False, cap1=False,
         tip=None, color=None, smooth=True, M=None, jitter=0.0, rng=None,
         phase=0.0):
    """Tapered tube along a polyline. tip=Vector closes the end with a cone."""
    rings = []
    for i, (p, T, N, B) in enumerate(frames_along(pts)):
        ring = []
        for k in range(sides):
            a = 2 * math.pi * k / sides + phase
            r = radii[i] * (1 + (rng.uniform(-jitter, jitter) if jitter else 0))
            q = xf(M, p + (N * math.cos(a) + B * math.sin(a)) * r)
            ring.append(mb.vert(q, color(q, i) if color else None))
        rings.append(ring)
    s = sides
    for i in range(len(rings) - 1):
        A, Bn = rings[i], rings[i + 1]
        for k in range(s):
            mb.face([A[k], A[(k + 1) % s], Bn[(k + 1) % s], Bn[k]], mat, smooth)
    if cap0:
        mb.face(list(reversed(rings[0])), mat, False)
    if tip is not None:
        q = xf(M, tip)
        t = mb.vert(q, color(q, len(rings)) if color else None)
        R = rings[-1]
        for k in range(s):
            mb.face([R[k], R[(k + 1) % s], t], mat, smooth)
    elif cap1:
        mb.face(rings[-1], mat, False)
    return rings


def loft(mb, rings_pts, matfn, closed=True, smooth=True, color=None):
    """Connect rings of equal length. matfn(i, k) -> material key."""
    rings = [[mb.vert(p, color(p) if color else None) for p in r] for r in rings_pts]
    n = len(rings[0])
    for i in range(len(rings) - 1):
        A, B = rings[i], rings[i + 1]
        for k in range(n if closed else n - 1):
            k2 = (k + 1) % n
            mb.face([A[k], A[k2], B[k2], B[k]], matfn(i, k), smooth)
    return rings


def blob(mb, center, radii, rng, subdiv=2, lump=0.18, freq=1.6,
         flat_bottom=0.0, rotz=0.0, color=None, mat='default'):
    """Lumpy icosphere mass (subdiv 2 = 80 tris)."""
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=subdiv, radius=1.0)
    off = Vector((rng.uniform(-50, 50), rng.uniform(-50, 50), rng.uniform(-50, 50)))
    cz, sz = math.cos(rotz), math.sin(rotz)
    c = Vector(center)
    idx = {}
    for v in bm.verts:
        d = v.co.normalized()
        s = 1.0 + lump * noise.noise(d * freq + off) * 1.6 + rng.uniform(-lump, lump) * 0.12
        p = Vector((d.x * radii[0], d.y * radii[1], d.z * radii[2])) * s
        if p.z < 0:
            p.z *= (1.0 - flat_bottom)
        p = Vector((p.x * cz - p.y * sz, p.x * sz + p.y * cz, p.z))
        w = c + p
        idx[v] = mb.vert(w, color(w, d) if color else None)
    for f in bm.faces:
        mb.face([idx[v] for v in f.verts], mat, True)
    bm.free()


# ---------------------------------------------------------------- walls
class Frame:
    """A vertical wall plane. Built from a base segment a->b (2D, metres)
    that runs left-to-right as seen from OUTSIDE the building.
    p(u, v, d): u = metres along a->b, v = world Z, d = metres outward.
    Polygons listed counter-clockwise in (u, v) face outward."""

    def __init__(self, a, b, z=0.0):
        a = Vector((a[0], a[1], z))
        b = Vector((b[0], b[1], z))
        self.O = a
        self.L = (b - a).length
        self.U = (b - a).normalized()
        self.N = self.U.cross(ZUP).normalized()

    def p(self, u, v, d=0.0):
        return self.O + self.U * u + ZUP * v + self.N * d


def wpoly(mb, fr, uv, mat, col, d=0.0):
    """Polygon on a wall frame from CCW (u, v) points, offset d outward."""
    return mb.poly([fr.p(u, v, d) for u, v in uv], mat, col)


def wrect(mb, fr, u0, u1, v0, v1, mat, col, d=0.0):
    return wpoly(mb, fr, [(u0, v0), (u1, v0), (u1, v1), (u0, v1)], mat, col, d)


def vquad(mb, a, b, z0, z1, mat, col, out):
    """Vertical quad over the 2D base segment a-b; out = outward hint."""
    (ax, ay), (bx, by) = a, b
    return mb.poly([(ax, ay, z0), (bx, by, z0), (bx, by, z1), (ax, ay, z1)],
                   mat, col, out=out)


def bands(mb, a, b, out, spec):
    """Horizontal colour bands on one vertical wall: spec = [(z0, z1, mat, col)]."""
    for z0, z1, m, c in spec:
        if z1 > z0:
            vquad(mb, a, b, z0, z1, m, c, out)


def arch_uv(uc, w, v0, v1, segs=3):
    """Round-arched opening (CCW): bottom v0, crown v1, semicircle in segs."""
    r = w / 2.0
    vs = v1 - r
    pts = [(uc - r, v0), (uc + r, v0)]
    for k in range(segs + 1):
        a = math.pi * k / segs
        pts.append((uc + r * math.cos(a), vs + r * math.sin(a)))
    return pts


def vgrad(c_top, c_bot, z0, z1):
    """Vertical colour gradient as a col callable for MB.poly."""
    def f(p):
        t = 0.0 if z1 == z0 else max(0.0, min(1.0, (p.z - z0) / (z1 - z0)))
        return mix(c_bot, c_top, t)
    return f


def window(mb, fr, uc, w, v0, v1, col, mat='glass', arch=0, d=0.06, dark=0.55):
    """Flat window panel floating d metres off the wall: one quad (2 tris),
    or a round-arched top with `arch` segments (arch+1 tris). Glass gets a
    top-light/bottom-dark gradient (classic N64 vertex-colour reflection)."""
    uv = arch_uv(uc, w, v0, v1, arch) if arch else \
        [(uc - w / 2, v0), (uc + w / 2, v0), (uc + w / 2, v1), (uc - w / 2, v1)]
    col_fn = vgrad(col, shade(col, dark), v0, v1) if dark != 1.0 else col
    return wpoly(mb, fr, uv, mat, col_fn, d)


def fbox(mb, fr, u0, u1, v0, v1, d0, d1, mat, col, skip=('back',), mats=None, cols=None):
    """Box sticking out of a wall frame (balconies, canopies, pier caps).
    Face keys: 'front' 'back' 'top' 'bottom' 'left' 'right'."""
    P = lambda u, v, d: fr.p(u, v, d)
    F = {
        'front': ([P(u0, v0, d1), P(u1, v0, d1), P(u1, v1, d1), P(u0, v1, d1)], fr.N),
        'back': ([P(u0, v0, d0), P(u1, v0, d0), P(u1, v1, d0), P(u0, v1, d0)], -fr.N),
        'top': ([P(u0, v1, d0), P(u1, v1, d0), P(u1, v1, d1), P(u0, v1, d1)], ZUP),
        'bottom': ([P(u0, v0, d0), P(u1, v0, d0), P(u1, v0, d1), P(u0, v0, d1)], -ZUP),
        'left': ([P(u0, v0, d0), P(u0, v0, d1), P(u0, v1, d1), P(u0, v1, d0)], -fr.U),
        'right': ([P(u1, v0, d0), P(u1, v0, d1), P(u1, v1, d1), P(u1, v1, d0)], fr.U),
    }
    for k, (pts, out) in F.items():
        if k in skip:
            continue
        mb.poly(pts, (mats or {}).get(k, mat), (cols or {}).get(k, col), out=out)


def outline_prism(mb, fr, uv, depth, mat_face, col_face, mat_edge, col_edge,
                  skip_edges=(), back=True):
    """Extrude a CCW (u, v) outline (may be concave) INTO the wall by depth.
    Front face lies in the wall plane; edge i joins uv[i] -> uv[i+1].
    Used for shaped (curvilinear) parapets and gables."""
    f = [fr.p(u, v, 0.0) for u, v in uv]
    b = [fr.p(u, v, -depth) for u, v in uv]
    mb.poly(f, mat_face, col_face)
    if back:
        mb.poly(list(reversed(b)), mat_face, col_face)
    n = len(uv)
    for i in range(n):
        if i in skip_edges:
            continue
        j = (i + 1) % n
        mb.poly([f[i], b[i], b[j], f[j]], mat_edge, col_edge)


def star_uv(uc, vc, r_out, r_in, n, phase=0.0):
    """CCW star/rosette outline with n lobes (n=4 -> quatrefoil-ish)."""
    pts = []
    for k in range(2 * n):
        a = phase + math.pi * k / n
        r = r_out if k % 2 == 0 else r_in
        pts.append((uc + r * math.cos(a), vc + r * math.sin(a)))
    return pts


# ---------------------------------------------------------------- roofs
def hip_roof(mb, x0, x1, y0, y1, z_eave, z_peak, mat='roof', col=(1, 0, 0),
             fascia=0.3, col_fascia=None, mat_fascia=None,
             soffit=True, col_soffit=None, mat_soffit=None, fascia_skip=()):
    """Hipped roof over the rectangle [x0,x1]x[y0,y1] (eave line, overhang
    included). Equal slopes; ridge along the long axis. Adds a vertical
    fascia band (keys '-x' '+x' '-y' '+y', fascia_skip omits) and a flat
    soffit underneath. ~16 tris."""
    xc, yc = (x0 + x1) / 2, (y0 + y1) / 2
    wx, wy = x1 - x0, y1 - y0
    c = Vector((xc, yc, z_eave))
    if wx <= wy:
        h = wx / 2
        r0, r1 = Vector((xc, y0 + h, z_peak)), Vector((xc, y1 - h, z_peak))
        faces = [[(x0, y0, z_eave), (x0, y1, z_eave), r1, r0],
                 [(x1, y0, z_eave), (x1, y1, z_eave), r1, r0],
                 [(x0, y0, z_eave), (x1, y0, z_eave), r0],
                 [(x0, y1, z_eave), (x1, y1, z_eave), r1]]
    else:
        h = wy / 2
        r0, r1 = Vector((x0 + h, yc, z_peak)), Vector((x1 - h, yc, z_peak))
        faces = [[(x0, y0, z_eave), (x1, y0, z_eave), r1, r0],
                 [(x0, y1, z_eave), (x1, y1, z_eave), r1, r0],
                 [(x0, y0, z_eave), (x0, y1, z_eave), r0],
                 [(x1, y0, z_eave), (x1, y1, z_eave), r1]]
    for f in faces:
        pts = [Vector(p) for p in f]
        if len(pts) == 4 and (pts[2] - pts[3]).length < 1e-5:
            pts = pts[:3]
        cen = sum(pts, Vector()) / len(pts)
        mb.poly(pts, mat, col, out=(cen - c) + Vector((0, 0, 0.01)))
    if fascia:
        zf = z_eave - fascia
        cf = col_fascia or shade(col, 0.6)
        mf = mat_fascia or mat
        sides = {'-x': ((x0, y1), (x0, y0), (-1, 0, 0)), '+x': ((x1, y0), (x1, y1), (1, 0, 0)),
                 '-y': ((x0, y0), (x1, y0), (0, -1, 0)), '+y': ((x1, y1), (x0, y1), (0, 1, 0))}
        for k, (a, b, out) in sides.items():
            if k not in fascia_skip:
                vquad(mb, a, b, zf, z_eave, mf, cf, out)
        if soffit:
            mb.poly([(x0, y0, zf), (x1, y0, zf), (x1, y1, zf), (x0, y1, zf)],
                    mat_soffit or mf, col_soffit or shade(col, 0.45), out=(0, 0, -1))


# ---------------------------------------------------------------- uv
def box_uv(obj, unit=4.0, name='UVMap'):
    """World-space box projection: 1 UV unit = `unit` metres. Walls use
    (along-wall, up) with u increasing left-to-right seen from outside, so a
    tiling facade texture is never mirrored; roofs/floors use (x, y)."""
    me = obj.data
    uvl = me.uv_layers.get(name) or me.uv_layers.new(name=name)
    M = obj.matrix_world
    for poly in me.polygons:
        n = poly.normal
        ax = max(range(3), key=lambda i: abs(n[i]))
        for li in poly.loop_indices:
            co = M @ me.vertices[me.loops[li].vertex_index].co
            if ax == 0:
                u, v = co.y * (1 if n.x > 0 else -1), co.z
            elif ax == 1:
                u, v = co.x * (-1 if n.y > 0 else 1), co.z
            else:
                u, v = co.x, co.y * (1 if n.z > 0 else -1)
            uvl.data[li].uv = (u / unit, v / unit)
    return uvl


# ---------------------------------------------------------------- stats / io
def tri_count(objs):
    dg = bpy.context.evaluated_depsgraph_get()
    n = 0
    for o in objs:
        if o.type != 'MESH':
            continue
        me = o.evaluated_get(dg).to_mesh()
        me.calc_loop_triangles()
        n += len(me.loop_triangles)
        o.evaluated_get(dg).to_mesh_clear()
    return n


def tri_count_by_material(obj):
    me = obj.data
    me.calc_loop_triangles()
    out = {}
    for t in me.loop_triangles:
        k = me.materials[t.material_index].name if me.materials else '-'
        out[k] = out.get(k, 0) + 1
    return out


def descendants(o):
    out = [o]
    for c in o.children:
        out += descendants(c)
    return out


def save_blend(name):
    path = os.path.join(ROOT, name + '.blend')
    bpy.ops.wm.save_as_mainfile(filepath=path, check_existing=False)
    return path


def export_glb(name, roots, texcoords=False):
    """GLB, Y-up, selection only, vertex colours via the material's Color
    Attribute node, no cameras/lights/animation."""
    path = os.path.join(EXPORT_DIR, name + '.glb')
    bpy.ops.object.select_all(action='DESELECT')
    for r in roots:
        for o in descendants(r):
            o.select_set(True)
    bpy.context.view_layer.objects.active = roots[0]
    kw = dict(filepath=path, export_format='GLB', export_apply=True,
              export_yup=True, use_selection=True, export_texcoords=texcoords,
              export_normals=True, export_materials='EXPORT',
              export_animations=False, export_vertex_color='MATERIAL',
              export_extras=False, export_cameras=False, export_lights=False)
    while True:
        try:
            bpy.ops.export_scene.gltf(**kw)
            break
        except TypeError as e:
            bad = [k for k in kw if k in str(e) and k != 'filepath']
            if not bad:
                raise
            kw.pop(bad[0])
    return path


def _set_eevee(sc):
    for eng in ('BLENDER_EEVEE', 'BLENDER_EEVEE_NEXT'):
        try:
            sc.render.engine = eng
            return
        except TypeError:
            continue


def _preview_world(ambient=0.55):
    """Sky-blue background for camera rays, neutral grey ambient for lighting."""
    sc = bpy.context.scene
    w = bpy.data.worlds.get('preview_sky') or bpy.data.worlds.new('preview_sky')
    try:
        w.use_nodes = True
    except Exception:
        pass
    nt = w.node_tree
    if nt is None:
        w.color = lin(SKY)
        sc.world = w
        return w
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputWorld')
    bg_cam = nt.nodes.new('ShaderNodeBackground')
    bg_cam.inputs[0].default_value = (*lin(SKY), 1.0)
    bg_cam.inputs[1].default_value = 1.0
    bg_amb = nt.nodes.new('ShaderNodeBackground')
    bg_amb.inputs[0].default_value = (1.0, 1.0, 1.0, 1.0)
    bg_amb.inputs[1].default_value = ambient
    lp = nt.nodes.new('ShaderNodeLightPath')
    mx = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Camera Ray'], mx.inputs[0])
    nt.links.new(bg_amb.outputs[0], mx.inputs[1])
    nt.links.new(bg_cam.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], out.inputs[0])
    sc.world = w
    return w


def render_cam(name, cam_loc, target, lens=35.0, res=(640, 480),
               sun_rot=(50, 0, -25), sun_energy=1.6, ambient=0.55,
               ground=None, samples=16, ortho_scale=None):
    """Preview render from a fixed eye point (e.g. kart/street eye level).
    Flat, simple lighting: one sun + uniform grey ambient, sky-blue
    background. ground=(r,g,b) adds a temporary ground plane. Every helper
    object is removed afterwards, so nothing leaks into saves/exports."""
    sc = bpy.context.scene
    bpy.context.view_layer.update()
    _set_eevee(sc)
    try:
        sc.eevee.taa_render_samples = samples
    except Exception:
        pass
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = False
    try:
        sc.view_settings.view_transform = 'Standard'
        sc.view_settings.look = 'None'
    except Exception:
        pass
    _preview_world(ambient)
    tmp = []
    cd = bpy.data.cameras.new('pcam')
    cd.lens = lens
    cd.clip_start = 0.1
    cd.clip_end = 2000
    if ortho_scale:
        cd.type = 'ORTHO'
        cd.ortho_scale = ortho_scale
    cam = bpy.data.objects.new('pcam', cd)
    sc.collection.objects.link(cam)
    cam.location = Vector(cam_loc)
    cam.rotation_euler = (Vector(target) - cam.location).to_track_quat('-Z', 'Y').to_euler()
    sc.camera = cam
    tmp.append(cam)

    ld = bpy.data.lights.new('psun', 'SUN')
    ld.energy = sun_energy
    ld.angle = math.radians(2)
    sun = bpy.data.objects.new('psun', ld)
    sun.rotation_euler = tuple(math.radians(a) for a in sun_rot)
    sc.collection.objects.link(sun)
    tmp.append(sun)

    if ground is not None:
        gm = bpy.data.meshes.new('pground')
        s = 600.0
        gm.from_pydata([(-s, -s, -0.02), (s, -s, -0.02), (s, s, -0.02), (-s, s, -0.02)], [], [(0, 1, 2, 3)])
        gmat = mat('pground_mat', ground, rough=1.0, spec=0.0)
        gm.materials.append(gmat)
        g = bpy.data.objects.new('pground', gm)
        sc.collection.objects.link(g)
        tmp.append(g)

    path = os.path.join(RENDER_DIR, name + '.png')
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
    for o in tmp:
        data = o.data
        bpy.data.objects.remove(o)
        if isinstance(data, bpy.types.Mesh):
            for m in list(data.materials):
                if m and m.users <= 1:
                    bpy.data.materials.remove(m)
            bpy.data.meshes.remove(data)
        elif isinstance(data, bpy.types.Camera):
            bpy.data.cameras.remove(data)
        elif isinstance(data, bpy.types.Light):
            bpy.data.lights.remove(data)
    return path


def render(name, objs, view=(1.0, -1.3, 0.55), lens=50, fill=1.0,
           target=None, sun_rot=(50, 0, 35)):
    """Auto-framed preview (hsg-fishing original)."""
    sc = bpy.context.scene
    bpy.context.view_layer.update()
    _set_eevee(sc)
    sc.render.resolution_x, sc.render.resolution_y = 800, 500
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = False
    try:
        sc.view_settings.view_transform = 'Standard'
    except Exception:
        pass
    w = bpy.data.worlds.get('preview_sky') or bpy.data.worlds.new('preview_sky')
    try:
        w.use_nodes = True
    except Exception:
        pass
    bg = [n for n in w.node_tree.nodes if n.type == 'BACKGROUND'][0]
    bg.inputs[0].default_value = (*lin(SKY), 1.0)
    bg.inputs[1].default_value = 0.9
    sc.world = w

    pts = [o.matrix_world @ Vector(c) for o in objs if o.type == 'MESH' for c in o.bound_box]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    c = Vector(target) if target else (mn + mx) / 2
    r = max((p - c).length for p in pts)

    cd = bpy.data.cameras.new('pcam')
    cd.lens = lens
    cd.clip_end = 1000
    cam = bpy.data.objects.new('pcam', cd)
    sc.collection.objects.link(cam)
    hfov = 2 * math.atan(cd.sensor_width / (2 * lens))
    vfov = 2 * math.atan(math.tan(hfov / 2) * 500 / 800)
    d = r / math.sin(vfov / 2) * fill
    v = Vector(view).normalized()
    cam.location = c + v * d
    cam.rotation_euler = (c - cam.location).to_track_quat('-Z', 'Y').to_euler()
    sc.camera = cam

    ld = bpy.data.lights.new('psun', 'SUN')
    ld.energy = 3.2
    ld.angle = math.radians(3)
    sun = bpy.data.objects.new('psun', ld)
    sun.rotation_euler = tuple(math.radians(a) for a in sun_rot)
    sc.collection.objects.link(sun)

    path = os.path.join(RENDER_DIR, name + '.png')
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(cam)
    bpy.data.objects.remove(sun)
    return path


def report(name, objs, glb):
    pts = [o.matrix_world @ Vector(c) for o in objs if o.type == 'MESH' for c in o.bound_box]
    dims = [max(p[i] for p in pts) - min(p[i] for p in pts) for i in range(3)]
    print('@@REPORT %s tris=%d size=%d objects=%s dims=%.2f x %.2f x %.2f zmin=%.2f' % (
        name, tri_count(objs), os.path.getsize(glb),
        ','.join(o.name for o in objs), dims[0], dims[1], dims[2],
        min(p.z for p in pts)))
