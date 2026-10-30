"""Shared parts for the Bathhouse Row landmark scripts (superior, hale,
maurice, quapaw, ozark, buckstaff, lamar, admin, arlington).

Builds on common.py. Kept in its own module so that common.py, and with it
fordyce.py's output, stays byte-identical. Everything here is deterministic
(no randomness, fixed iteration order).

  palette  - Row-wide hexes from research/visual-style-guide.md
             ("Material color swatches (est.)") and the derived shades used by
             every Row script (each derivation explained below)
  walls    - body() box mass with optional bands, win_row() rows of flat
             window panels, seg_arch_uv() segmental arch outline,
             sym_outline() symmetric curvilinear parapet outline
  roofs    - pent() sloping tile pent roof with fascia/soffit/cheeks,
             hip_frustum() truncated hip (flat top) with fascia/soffit,
             pyramid() 4-sided cap
  solids   - ngon_prism() vertical n-gon prism, column() shaft + base +
             capital, finial(), dome() ellipsoidal dome with zig-zag
             (chevron) per-triangle colouring
  pipeline - finish(): budget check, GLB export, .blend save, report and
             the standard previews (street 640/320, aerial, --checks)
"""
import math

from common import *                                # noqa: F401,F403

FT = 0.3048
Z_SKIRT = -0.5                     # below-grade skirt (README convention)

# ---------------------------------------------------------------- palette
# visual-style-guide.md, "Material color swatches (est.)" -- all estimates.
C_STUCCO = hexc('#F3EFE6')    # white stucco (Ozark, Maurice, Hale, Lamar)
C_CREAM = hexc('#E6D7B5')     # cream brick / painted tile body
C_TILE = hexc('#A9432C')      # red clay tile
C_TILE_SH = hexc('#7E2F1F')   # red tile shadow course
C_IRON = hexc('#1F2A24')      # wrought iron
C_COBALT = hexc('#2B4C9B')    # stained-glass cobalt
C_MORTAR = hexc('#CDBF9F')    # mortar
C_MARBLE = hexc('#F2EFE8')    # marble
C_BRASS = hexc('#C9A23F')     # brass lettering
C_COPPER = hexc('#B87333')    # copper (new)
C_VERD = hexc('#5E9C8C')      # verdigris
C_GREEN = hexc('#4E7D5B')     # Maurice green tile / Superior medallions
C_RBRICK = hexc('#B5654A')    # restored / pilaster red brick
# Derived (documented):
# plain (not stained) window glass reads as a dark blue-grey from the street:
# 55 % cobalt + 45 % wrought iron, sRGB lerp.
C_WINDOW = mix(C_COBALT, C_IRON, 0.45)
# flat built-up / roll roofing: mortar x 0.62, the same derivation as fordyce.py
C_FLATROOF = shade(C_MORTAR, 0.62)
# shaded undersides (eave soffits, porch ceilings): base colour x 0.70
SOFFIT_K = 0.70

GROUND = (0.45, 0.52, 0.36)        # preview ground plane (as fordyce.py)


def order_mats(wall_col, roof_col, trim_col, glass_col=C_WINDOW):
    """The four material slots, in the README order, vertex-colour driven."""
    return {
        'wall': mat('wall', wall_col, rough=0.9, spec=0.2, vcol=True),
        'roof': mat('roof', roof_col, rough=0.8, spec=0.25, vcol=True),
        'trim': mat('trim', trim_col, rough=0.85, spec=0.2, vcol=True),
        'glass': mat('glass', glass_col, rough=0.3, spec=0.5, vcol=True),
    }


# ---------------------------------------------------------------- walls
def front_frame(y):
    """Street-facing wall plane at depth y (faces Blender -Y), u = x."""
    return Frame((0.0, y), (1.0, y))


def south_frame(x):
    """+X (south) end wall at x, u = y."""
    return Frame((x, 0.0), (x, 1.0))


def north_frame(x):
    """-X (north) end wall at x, u = -y."""
    return Frame((x, 0.0), (x, -1.0))


def rear_frame(y):
    """Back wall at depth y (faces +Y), u = -x."""
    return Frame((0.0, y), (-1.0, y))


def body(mb, x0, x1, y0, y1, z0, z1, mat='wall', col=C_STUCCO, skip=('-z',),
         top_mat='roof', top_col=None, mats=None, cols=None):
    """Box mass: four walls plus a flat top (roof slot unless overridden).
    skip uses cbox keys ('-x' '+x' '-y' '+y' '-z' '+z')."""
    m = {'+z': top_mat}
    c = {'+z': top_col if top_col is not None else C_FLATROOF}
    m.update(mats or {})
    c.update(cols or {})
    cbox(mb, (x0, y0, z0), (x1, y1, z1), mat, col, skip=skip, mats=m, cols=c)


def banded_box(mb, x0, x1, y0, y1, spec, faces=('-y', '+x', '-x', '+y')):
    """Vertical faces of a box split into horizontal bands:
    spec = [(z0, z1, mat, col)]."""
    sides = {'-y': ((x0, y0), (x1, y0), (0, -1, 0)),
             '+x': ((x1, y0), (x1, y1), (1, 0, 0)),
             '+y': ((x1, y1), (x0, y1), (0, 1, 0)),
             '-x': ((x0, y1), (x0, y0), (-1, 0, 0))}
    for k in faces:
        a, b, out = sides[k]
        bands(mb, a, b, out, spec)


def win_row(mb, fr, us, w, v0, v1, col=C_WINDOW, arch=0, d=0.08, dark=0.55,
            surround=None, s_pad=0.18, s_col=None, s_mat='trim'):
    """A row of flat window panels at the u positions `us`. Optional
    surround: a slightly larger trim panel behind each window."""
    for u in us:
        if surround:
            if arch:
                uv = arch_uv(u, w + 2 * s_pad, v0 - s_pad, v1 + s_pad, arch)
            else:
                uv = [(u - w / 2 - s_pad, v0 - s_pad), (u + w / 2 + s_pad, v0 - s_pad),
                      (u + w / 2 + s_pad, v1 + s_pad), (u - w / 2 - s_pad, v1 + s_pad)]
            wpoly(mb, fr, uv, s_mat, s_col or surround, d * 0.5)
        window(mb, fr, u, w, v0, v1, col, arch=arch, d=d, dark=dark)


def spaced(n, pitch, c=0.0):
    """n positions at `pitch` centred on c."""
    return [c + (i - (n - 1) / 2.0) * pitch for i in range(n)]


def seg_arch_uv(uc, w, v0, v1, rise, segs=3):
    """Segmental-arch opening (CCW): springs at v1 - rise, crown at v1."""
    r = w / 2.0
    vs = v1 - rise
    pts = [(uc - r, v0), (uc + r, v0)]
    for k in range(segs + 1):
        t = k / segs                                   # right -> left
        x = r - 2 * r * t
        pts.append((uc + x, vs + rise * (1 - (x / r) ** 2)))
    return pts


def sym_outline(uc, hw, v0, half, crown):
    """Symmetric parapet outline from a half profile [(frac_of_hw, v)],
    listed from the outer shoulder inward; crown = top centre v."""
    return ([(uc - hw, v0), (uc + hw, v0)] +
            [(uc + f * hw, v) for f, v in half] + [(uc, crown)] +
            [(uc - f * hw, v) for f, v in reversed(half)])


# ---------------------------------------------------------------- roofs
def pent(mb, x0, x1, y_wall, y_edge, z_wall, z_edge, col=C_TILE,
         col_fascia=C_TILE_SH, fascia=0.18, col_soffit=None, cheeks=True,
         mat='roof', mat_fascia='roof', mat_soffit='trim'):
    """Sloping pent roof along X, from the wall line (y_wall, z_wall) down to
    the eave (y_edge, z_edge). Works for either facing (y_edge < y_wall faces
    the street). Fascia under the eave, soffit back to the wall, triangular
    end cheeks."""
    sgn = -1.0 if y_edge < y_wall else 1.0
    mb.poly([(x0, y_edge, z_edge), (x1, y_edge, z_edge), (x1, y_wall, z_wall),
             (x0, y_wall, z_wall)], mat, col, out=(0, sgn, 1))
    zf = z_edge - fascia
    if fascia:
        vquad(mb, (x0, y_edge), (x1, y_edge), zf, z_edge, mat_fascia, col_fascia, (0, sgn, 0))
    cs = col_soffit or shade(col_fascia, SOFFIT_K)
    mb.poly([(x0, y_edge, zf), (x1, y_edge, zf), (x1, y_wall, zf), (x0, y_wall, zf)],
            mat_soffit, cs, out=(0, 0, -1))
    if cheeks:
        for x, s in ((x0, -1), (x1, 1)):
            mb.poly([(x, y_edge, zf), (x, y_wall, zf), (x, y_wall, z_wall), (x, y_edge, z_edge)],
                    mat_fascia, col_fascia, out=(s, 0, 0))


def hip_frustum(mb, x0, x1, y0, y1, z_eave, z_top, inset, mat='roof', col=C_TILE,
                fascia=0.25, col_fascia=None, mat_fascia=None, col_soffit=None,
                mat_soffit='trim', top=True, top_col=None, top_mat=None):
    """Truncated hip: four sloping trapezoids from the eave rectangle up to a
    flat top inset by `inset`, plus fascia band and soffit. ~18 tris."""
    xa, xb, ya, yb = x0 + inset, x1 - inset, y0 + inset, y1 - inset
    c = Vector(((x0 + x1) / 2, (y0 + y1) / 2, z_eave))
    quads = [[(x0, y0, z_eave), (x1, y0, z_eave), (xb, ya, z_top), (xa, ya, z_top)],
             [(x1, y0, z_eave), (x1, y1, z_eave), (xb, yb, z_top), (xb, ya, z_top)],
             [(x1, y1, z_eave), (x0, y1, z_eave), (xa, yb, z_top), (xb, yb, z_top)],
             [(x0, y1, z_eave), (x0, y0, z_eave), (xa, ya, z_top), (xa, yb, z_top)]]
    for q in quads:
        pts = [Vector(p) for p in q]
        cen = sum(pts, Vector()) / 4
        mb.poly(pts, mat, col, out=(cen - c) + Vector((0, 0, 0.01)))
    if top:
        mb.poly([(xa, ya, z_top), (xb, ya, z_top), (xb, yb, z_top), (xa, yb, z_top)],
                top_mat or mat, top_col or col, out=(0, 0, 1))
    if fascia:
        zf = z_eave - fascia
        cf = col_fascia or shade(col, 0.6)
        mf = mat_fascia or mat
        for a, b, out in (((x0, y0), (x1, y0), (0, -1, 0)), ((x1, y0), (x1, y1), (1, 0, 0)),
                          ((x1, y1), (x0, y1), (0, 1, 0)), ((x0, y1), (x0, y0), (-1, 0, 0))):
            vquad(mb, a, b, zf, z_eave, mf, cf, out)
        mb.poly([(x0, y0, zf), (x1, y0, zf), (x1, y1, zf), (x0, y1, zf)],
                mat_soffit, col_soffit or shade(col, 0.45), out=(0, 0, -1))


def pyramid(mb, cx, cy, hx, hy, z0, z1, mat='roof', col=C_TILE, col_side=None):
    """Four-sided pyramid cap over the rectangle cx+-hx, cy+-hy (4 tris)."""
    t = (cx, cy, z1)
    P = [(cx - hx, cy - hy, z0), (cx + hx, cy - hy, z0), (cx + hx, cy + hy, z0), (cx - hx, cy + hy, z0)]
    for i in range(4):
        a, b = P[i], P[(i + 1) % 4]
        out = ((a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0.3)
        c = col if (col_side is None or i % 2 == 0) else col_side
        mb.poly([a, b, t], mat, c, out=out)


# ---------------------------------------------------------------- solids
def ngon_prism(mb, cx, cy, r, z0, z1, n, mat, col, top=True, top_mat=None, top_col=None,
               phase=None, col_fn=None):
    """Vertical regular n-gon prism (r = circumradius). col_fn(i) may give a
    per-side colour. Returns the ring of corner points at z1."""
    ph = (math.pi / n) if phase is None else phase
    P = [(cx + r * math.cos(ph + 2 * math.pi * i / n), cy + r * math.sin(ph + 2 * math.pi * i / n))
         for i in range(n)]
    for i in range(n):
        a, b = P[i], P[(i + 1) % n]
        out = ((a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0)
        mb.poly([(a[0], a[1], z0), (b[0], b[1], z0), (b[0], b[1], z1), (a[0], a[1], z1)],
                mat, col_fn(i) if col_fn else col, out=out)
    if top:
        mb.poly([(p[0], p[1], z1) for p in P], top_mat or mat,
                top_col if top_col is not None else col, out=(0, 0, 1))
    return [(p[0], p[1], z1) for p in P]


def column(mb, x, y, r, z0, z1, mat='trim', col=C_STUCCO, n=6, cap=0.18, base=0.18,
           cap_col=None):
    """Classical column: n-sided shaft plus square base and capital blocks
    (back faces skipped where the column meets a wall is not attempted)."""
    s = r * 1.35
    cc = cap_col or col
    cbox(mb, (x - s, y - s, z0), (x + s, y + s, z0 + base), mat, shade(col, 0.92), skip=('-z',))
    ngon_prism(mb, x, y, r, z0 + base, z1 - cap, n, mat, col, top=False)
    cbox(mb, (x - s, y - s, z1 - cap), (x + s, y + s, z1), mat, cc, skip=(),
         cols={'-z': shade(cc, 0.6)})


def finial(mb, x, y, z0, h, r, mat='trim', col=C_STUCCO, n=4):
    """Small finial: a squat n-gon pedestal and a pointed cap (2n + n tris)."""
    zm = z0 + h * 0.45
    ring = ngon_prism(mb, x, y, r, z0, zm, n, mat, col, top=False)
    t = (x, y, z0 + h)
    for i in range(n):
        a, b = ring[i], ring[(i + 1) % n]
        out = ((a[0] + b[0]) / 2 - x, (a[1] + b[1]) / 2 - y, 0.4)
        mb.poly([a, b, t], mat, shade(col, 0.9 if i % 2 else 1.0), out=out)


def dome(mb, cx, cy, r, z0, h, sides, ring_cols, mat='roof', zigzag=True, top_z=None,
         cell_col=None, phase=0.0, zig_from=0):
    """Ellipsoidal dome (radius r, height h above z0) in len(ring_cols)
    horizontal rings of `sides` segments. ring_cols[i] colours ring i.
    zigzag=True splits each quad so its upper triangle takes the colour of
    the ring above: alternating rings then meet in a zig-zag (chevron)
    line (rings below zig_from stay straight bands). cell_col(i, k) ->
    colour or None overrides single cells (panels).
    top_z: stop at this height (leaves a small opening for a lantern) --
    otherwise the dome closes with a fan. Returns the top ring."""
    nr = len(ring_cols)
    z_end = (top_z - z0) / h if top_z is not None else 1.0
    a_end = math.asin(min(1.0, z_end))
    rings = []
    for i in range(nr + 1):
        a = a_end * i / nr
        rr, zz = r * math.cos(a), z0 + h * math.sin(a)
        rings.append([(cx + rr * math.cos(phase + 2 * math.pi * k / sides),
                       cy + rr * math.sin(phase + 2 * math.pi * k / sides), zz)
                      for k in range(sides)])
    c = Vector((cx, cy, z0))
    for i in range(nr):
        A, B = rings[i], rings[i + 1]
        for k in range(sides):
            k2 = (k + 1) % sides
            col_lo = ring_cols[i]
            zig = zigzag and i >= zig_from and i + 1 < nr
            col_hi = ring_cols[i + 1] if zig else ring_cols[i]
            ov = cell_col(i, k) if cell_col else None
            if ov is not None:
                col_lo = col_hi = ov
            # alternate the split diagonal so the colour line runs up and
            # down (a true chevron) instead of a one-way sawtooth
            if k % 2 == 0:
                lo, hi = (A[k], A[k2], B[k2]), (A[k], B[k2], B[k])
            else:
                lo, hi = (A[k], A[k2], B[k]), (A[k2], B[k2], B[k])
            for tri, col in ((lo, col_lo), (hi, col_hi)):
                cen = sum((Vector(p) for p in tri), Vector()) / 3
                mb.poly(list(tri), mat, col, out=cen - c)
    if top_z is None:
        t = (cx, cy, z0 + h)
        R = rings[-1]
        for k in range(sides):
            mb.poly([R[k], R[(k + 1) % sides], t], mat, ring_cols[-1], out=(0, 0, 1))
    return rings[-1]


# ---------------------------------------------------------------- pipeline
def finish(name, o, budget, args, street, aerial, elev=None, rear=None):
    """Budget check, export, save, report and previews (fordyce.py order)."""
    tris = tri_count([o])
    by_mat = tri_count_by_material(o)
    print('@@TRIS %d %s' % (tris, by_mat))
    if tris > budget:
        raise SystemExit('triangle budget exceeded: %d > %d' % (tris, budget))
    glb = export_glb(name, [o], texcoords=True)
    blend = save_blend(name)
    report(name, [o], glb)
    print('@@FILES', glb, blend)
    if '--no-render' in args:
        return
    render_cam(name + '_street', res=(640, 480), ground=GROUND, **street)
    render_cam(name + '_aerial', res=(640, 480), ground=GROUND, **aerial)
    render_cam(name + '_street_320', res=(320, 240), ground=GROUND, **street)
    if '--checks' in args:
        if elev:
            render_cam(name + '_check_elev', res=(640, 480), ground=GROUND,
                       sun_rot=(60, 0, -10), **elev)
        if rear:
            render_cam(name + '_check_rear', res=(640, 480), ground=GROUND,
                       sun_rot=(50, 0, 160), **rear)
