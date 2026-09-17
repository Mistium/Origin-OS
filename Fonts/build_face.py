#!/usr/bin/env python3
"""Build Fonts/origin.ttf: the system face originOS installs as @font-face.

Source Code Pro supplies the Latin/punctuation glyphs; anything it lacks
(braille, the PUA icon block, odd symbols) is copied from the ojff-derived
font so `canFontText` can keep every string on the fast TTF path.

The result must satisfy two contracts from origin/main/osl/core.fractch:
  * every advance is exactly unitsPerEm - fontText() sets
    letterSpacing = charSpacing - size and assumes a 1em cell.
  * glyphs sit on the ojff baseline (y=5 in a 30-unit em -> 166.67 upm)
    with the ojff cap height (31.5 units -> 1050 upm), so swapping the face
    does not move a single line of existing UI.

    python3 Fonts/build_face.py Fonts/origin.ttf
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import DecomposingRecordingPen

UPM = 1000
SOURCE_EM = 30.0          # ojff em, see OJFFToTTF in core.fractch
OJFF_BASELINE = 5.0       # ojff y of the baseline
OJFF_CAP = 36.5           # ojff y of cap height / ascender

SCALE_EM = UPM / SOURCE_EM
TARGET_CAP = (OJFF_CAP - OJFF_BASELINE) * SCALE_EM      # 1050
TARGET_BASELINE = OJFF_BASELINE * SCALE_EM              # 166.67


def transformed(font, scale, dx, dy):
    """Rescale every glyph, decomposing composites, and monospace the advances."""
    gs = font.getGlyphSet()
    glyf, hmtx = font["glyf"], font["hmtx"]
    tr = (scale, 0, 0, scale, dx, dy)
    # Build every glyph before writing any back: composites decompose against
    # the live glyf table, so transforming in place double-scales anything
    # whose components were already rewritten (1/2, 3/4, the approx sign).
    built = {}
    for name in font.getGlyphOrder():
        rec = DecomposingRecordingPen(gs)
        gs[name].draw(rec)
        pen = TTGlyphPen(None)
        rec.replay(TransformPen(pen, tr))
        built[name] = pen.glyph()
    for name, glyph in built.items():
        glyf[name] = glyph
        glyph.recalcBounds(glyf)
        hmtx[name] = (UPM, glyph.xMin if glyph.numberOfContours else 0)
    return font


def main(out, scp_path, ojff_ttf_path, weight=400.0):
    scp = instantiateVariableFont(TTFont(scp_path), {"wght": weight}, inplace=True)

    cap = scp["OS/2"].sCapHeight
    scale = TARGET_CAP / cap
    adv = scp["hmtx"][scp.getBestCmap()[ord("H")]][0]        # 600, uniform
    dx = (UPM - adv * scale) / 2.0                           # centre in the 1em cell
    transformed(scp, scale, dx, TARGET_BASELINE)

    # Vertical metrics copied from the ojff face so line boxes are unchanged.
    scp["hhea"].ascent, scp["hhea"].descent, scp["hhea"].lineGap = 1400, -200, 0
    os2 = scp["OS/2"]
    os2.sTypoAscender, os2.sTypoDescender, os2.sTypoLineGap = 1400, -200, 0
    os2.usWinAscent, os2.usWinDescent = 1600, 200
    os2.sCapHeight = int(round(TARGET_CAP + TARGET_BASELINE))
    os2.sxHeight = int(round(os2.sxHeight * scale + TARGET_BASELINE))

    # Fill the gaps from the stroke font: braille, PUA icons, stray symbols.
    oj = TTFont(ojff_ttf_path)
    have, want = scp.getBestCmap(), oj.getBestCmap()
    missing = sorted(cp for cp in want if cp not in have)
    order = scp.getGlyphOrder()
    for cp in missing:
        src = want[cp]
        name = "ojff%04X" % cp
        scp["glyf"].glyphs[name] = oj["glyf"][src]
        scp["hmtx"].metrics[name] = (UPM, oj["hmtx"][src][1])
        order.append(name)
        for table in scp["cmap"].tables:
            if cp > 0xFFFF and table.format != 12:
                continue          # format 4 is BMP-only; the PUA icons live in plane 15
            table.cmap[cp] = name
    scp.setGlyphOrder(order)
    scp["maxp"].numGlyphs = len(order)

    scp.save(out)
    print("%s  scale %.4f  dx %.1f  dy %.1f  +%d glyphs from ojff (%s)"
          % (out, scale, dx, TARGET_BASELINE, len(missing),
             "".join(chr(c) for c in missing[:6]) + "..." if missing else "none"))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "Fonts/origin.ttf",
         sys.argv[2] if len(sys.argv) > 2 else "Fonts/src/SourceCodePro.ttf",
         sys.argv[3] if len(sys.argv) > 3 else "Fonts/src/origin-ojff.ttf")
