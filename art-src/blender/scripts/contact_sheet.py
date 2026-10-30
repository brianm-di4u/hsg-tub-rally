"""Contact sheet of the 320x240 street views of the Row landmarks.

Run (from the repo root, after the landmark scripts have rendered):
    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup
        --python art-src/blender/scripts/contact_sheet.py

Reads  art-src/blender/renders/<name>_street_320.png (north to south)
Writes art-src/blender/renders/row-sheet.png (5 x 2 cells, labelled)
Uses Blender's image API and bundled numpy only (no PIL needed).

Options (after --): --suffix _check_rear  (any 640x480 preview, halved)
                    --out <path.png>
"""
import os
import sys

import bpy
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
RENDERS = os.path.join(os.path.dirname(HERE), 'renders')
# Arlington closes the north vista, then the Row north -> south, Admin last
NAMES = ['arlington', 'superior', 'hale', 'maurice', 'fordyce',
         'quapaw', 'ozark', 'buckstaff', 'lamar', 'admin']
CW, CH, LAB, COLS = 320, 240, 20, 5

# 5x7 bitmap glyphs (rows top to bottom) for the label letters
G = {
    'A': '01110 10001 10001 11111 10001 10001 10001', 'B': '11110 10001 10001 11110 10001 10001 11110',
    'C': '01111 10000 10000 10000 10000 10000 01111', 'D': '11110 10001 10001 10001 10001 10001 11110',
    'E': '11111 10000 10000 11110 10000 10000 11111', 'F': '11111 10000 10000 11110 10000 10000 10000',
    'G': '01111 10000 10000 10011 10001 10001 01111', 'H': '10001 10001 10001 11111 10001 10001 10001',
    'I': '01110 00100 00100 00100 00100 00100 01110', 'K': '10001 10010 10100 11000 10100 10010 10001',
    'L': '10000 10000 10000 10000 10000 10000 11111', 'M': '10001 11011 10101 10101 10001 10001 10001',
    'N': '10001 11001 10101 10011 10001 10001 10001', 'O': '01110 10001 10001 10001 10001 10001 01110',
    'P': '11110 10001 10001 11110 10000 10000 10000', 'Q': '01110 10001 10001 10001 10101 10010 01101',
    'R': '11110 10001 10001 11110 10100 10010 10001', 'S': '01111 10000 10000 01110 00001 00001 11110',
    'T': '11111 00100 00100 00100 00100 00100 00100', 'U': '10001 10001 10001 10001 10001 10001 01110',
    'W': '10001 10001 10001 10101 10101 11011 10001', 'Y': '10001 10001 01010 00100 00100 00100 00100',
    'Z': '11111 00001 00010 00100 01000 10000 11111', ' ': '00000 00000 00000 00000 00000 00000 00000',
}


def label(img, text, x0, y0, scale=2, col=(0.95, 0.95, 0.95)):
    """Draw text into img (H x W x 4, top-down rows) at pixel (x0, y0)."""
    x = x0
    for ch in text.upper():
        rows = G.get(ch, G[' ']).split()
        for r, bits in enumerate(rows):
            for c, b in enumerate(bits):
                if b == '1':
                    yy, xx = y0 + r * scale, x + c * scale
                    img[yy:yy + scale, xx:xx + scale, :3] = col
        x += 6 * scale


def main():
    args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    suffix = args[args.index('--suffix') + 1] if '--suffix' in args else '_street_320'
    out_path = (args[args.index('--out') + 1] if '--out' in args
                else os.path.join(RENDERS, 'row-sheet.png'))
    rows = (len(NAMES) + COLS - 1) // COLS
    W, H = CW * COLS, (CH + LAB) * rows
    sheet = np.zeros((H, W, 4), dtype=np.float32)
    sheet[..., :3] = 0.12
    sheet[..., 3] = 1.0
    for i, n in enumerate(NAMES):
        path = os.path.join(RENDERS, n + suffix + '.png')
        cx, cy = (i % COLS) * CW, (i // COLS) * (CH + LAB)
        if os.path.exists(path):
            im = bpy.data.images.load(path)
            w, h = im.size
            px = np.array(im.pixels[:], dtype=np.float32).reshape(h, w, 4)[::-1]   # top-down
            while w > CW:                                  # halve larger previews
                px, w, h = px[::2, ::2], w // 2, h // 2
            sheet[cy:cy + h, cx:cx + w, :] = px[:CH, :CW, :]
            sheet[cy:cy + h, cx:cx + w, 3] = 1.0
            bpy.data.images.remove(im)
        else:
            print('missing', path)
        label(sheet, n, cx + 6, cy + CH + 3)
    out = bpy.data.images.new('row_sheet', W, H, alpha=False)
    out.pixels[:] = sheet[::-1].ravel()
    out.filepath_raw = out_path
    out.file_format = 'PNG'
    out.save()
    print('@@SHEET', out.filepath_raw, W, H)


main()
