// origin-clean.ojff generator
// Design grid matches origin.ojff exactly:
//   baseline 5 | x-height 26 | cap/ascender 36.5 | descender -5.5 | box x 5..25
// Only emits ops whitelisted by canFontText (core.fractch): w line cont dot.
const fs = require("fs");

const W = +(process.env.WEIGHT || 3.6);      // stroke weight (origin.ojff used 5.53)
const SEG = 18;                               // degrees per arc segment
const FACE = process.env.FACE || "Fonts/origin.ttf";  // prebuilt face loadFontOJFF installs
const L = 5.5, R = 24.5, CX = 15;
const BL = 5, XH = 26, CT = 36.5, DS = -5.5;
const CM = 20.75;                             // cap middle
const rd = v => Math.round(v * 100) / 100;

// --- path builder -----------------------------------------------------------
class P {
  constructor() { this.subs = []; this.cur = null; }
  m(x, y) { this.cur = [[x, y]]; this.subs.push(this.cur); return this; }
  l(x, y) { this.cur.push([x, y]); return this; }
  // elliptical arc, a0->a1 in degrees, 0deg = +x, 90deg = +y
  a(cx, cy, rx, ry, a0, a1) {
    const n = Math.max(2, Math.round(Math.abs(a1 - a0) / SEG));
    for (let i = 0; i <= n; i++) {
      const t = (a0 + (a1 - a0) * i / n) * Math.PI / 180;
      const p = [cx + rx * Math.cos(t), cy + ry * Math.sin(t)];
      if (!this.cur) { this.cur = [p]; this.subs.push(this.cur); }
      else this.cur.push(p);
    }
    return this;
  }
  ma(cx, cy, rx, ry, a0, a1) { this.cur = null; return this.a(cx, cy, rx, ry, a0, a1); }
  ell(cx, cy, rx, ry) { return this.ma(cx, cy, rx, ry, 0, 360); }
  dot(x, y) { return this.m(x, y).l(x, y + 0.4); }
  out() {
    const t = ["w " + W];
    for (const s of this.subs) {
      t.push("line", rd(s[0][0]), rd(s[0][1]), rd(s[1][0]), rd(s[1][1]));
      for (let i = 2; i < s.length; i++) t.push("cont", rd(s[i][0]), rd(s[i][1]));
    }
    return t.join(" ");
  }
}
const g = fn => { const p = new P(); fn(p); return p.out(); };
const G = {};
const def = (ch, fn) => { G[ch] = g(fn); };

// --- uppercase --------------------------------------------------------------
def("A", p => { p.m(L, BL).l(CX, CT).l(R, BL); p.m(8.06, 13.5).l(21.94, 13.5); });
def("B", p => { p.m(L, BL).l(L, CT); p.ma(L, 28.63, 16.5, 7.87, 90, -90); p.ma(L, 12.88, 17.5, 7.87, 90, -90); });
def("C", p => p.ma(CX, CM, 9.5, 15.75, 50, 310));
def("D", p => { p.m(L, BL).l(L, CT); p.ma(L, CM, 19, 15.75, 90, -90); });
def("E", p => { p.m(L, BL).l(L, CT); p.m(L, CT).l(R, CT); p.m(L, CM).l(22, CM); p.m(L, BL).l(R, BL); });
def("F", p => { p.m(L, BL).l(L, CT); p.m(L, CT).l(R, CT); p.m(L, CM).l(22, CM); });
def("G", p => { p.ma(CX, CM, 9.5, 15.75, 50, 340).l(23.93, CM).l(16.5, CM); });
def("H", p => { p.m(L, BL).l(L, CT); p.m(R, BL).l(R, CT); p.m(L, CM).l(R, CM); });
def("I", p => { p.m(CX, BL).l(CX, CT); p.m(8.5, CT).l(21.5, CT); p.m(8.5, BL).l(21.5, BL); });
def("J", p => p.m(20, CT).l(20, 12).a(12.5, 12, 7.5, 7, 0, -180));
def("K", p => { p.m(L, BL).l(L, CT); p.m(R, CT).l(L, 19); p.m(L, 19).l(R, BL); });
def("L", p => p.m(L, CT).l(L, BL).l(R, BL));
def("M", p => p.m(L, BL).l(L, CT).l(CX, 20).l(R, CT).l(R, BL));
def("N", p => p.m(L, BL).l(L, CT).l(R, BL).l(R, CT));
def("O", p => p.ell(CX, CM, 9.5, 15.75));
def("P", p => { p.m(L, BL).l(L, CT); p.ma(L, 29.25, 17, 7.25, 90, -90); });
def("Q", p => { p.ell(CX, CM, 9.5, 15.75); p.m(17, 11).l(24, 3.5); });
def("R", p => { p.m(L, BL).l(L, CT); p.ma(L, 29.25, 17, 7.25, 90, -90); p.m(L, 22).l(R, BL); });
def("S", p => { p.ma(CX, 28.5, 9.5, 7.75, 30, 250).l(18.25, 20.5).a(CX, 13, 9.5, 8, 70, -150); });
def("T", p => { p.m(L, CT).l(R, CT); p.m(CX, CT).l(CX, BL); });
def("U", p => p.m(L, CT).l(L, 13).a(CX, 13, 9.5, 8, 180, 360).l(R, CT));
def("V", p => p.m(L, CT).l(CX, BL).l(R, CT));
def("W", p => p.m(L, CT).l(9.8, BL).l(CX, 24).l(20.2, BL).l(R, CT));
def("X", p => { p.m(L, CT).l(R, BL); p.m(R, CT).l(L, BL); });
def("Y", p => { p.m(L, CT).l(CX, CM).l(R, CT); p.m(CX, CM).l(CX, BL); });
def("Z", p => p.m(L, CT).l(R, CT).l(L, BL).l(R, BL));

// --- lowercase --------------------------------------------------------------
const XM = 15.5, XR = 10.5;                   // x-height centre / radius
def("a", p => { p.ma(13.8, 19.8, 8.3, 6.2, 180, 15); p.m(22, XH).l(22, BL); p.ell(13.75, 11, 8.25, 6); });
def("b", p => { p.m(L, CT).l(L, BL); p.ell(CX, XM, 9.5, XR); });
def("c", p => p.ma(CX, XM, 9.5, XR, 55, 305));
def("d", p => { p.m(R, CT).l(R, BL); p.ell(CX, XM, 9.5, XR); });
def("e", p => { p.m(5.6, 16.2).l(24.3, 16.2); p.ma(CX, XM, 9.5, XR, 4, 315); });
def("f", p => { p.m(13.5, BL).l(13.5, 31).a(18.5, 31, 5, 5.5, 180, 90); p.m(6, XH).l(21, XH); });
def("g", p => { p.ell(14, XM, 8.5, XR); p.m(22.5, XH).l(22.5, 0).a(15.5, 0, 7, 5.5, 0, -180); });
def("h", p => { p.m(L, CT).l(L, BL); p.ma(CX, XM, 9.5, XR, 180, 0).l(R, BL); });
def("i", p => { p.m(CX, BL).l(CX, XH); p.m(CX, 31.8).l(CX, 33); p.m(9, BL).l(21, BL); });
def("j", p => { p.m(17, XH).l(17, 0).a(11, 0, 6, 5.5, 0, -180); p.m(17, 31.8).l(17, 33); });
def("k", p => { p.m(L, CT).l(L, BL); p.m(23, XH).l(L, 13); p.m(12, 17.83).l(24, BL); });
def("l", p => p.m(11, CT).l(11, 10).a(16, 10, 5, 5, 180, 270).l(19.5, BL));
def("m", p => { p.m(L, XH).l(L, BL); p.ma(10.25, 18, 4.75, 8, 180, 0).l(CX, BL); p.ma(19.75, 18, 4.75, 8, 180, 0).l(R, BL); });
def("n", p => { p.m(L, XH).l(L, BL); p.ma(CX, XM, 9.5, XR, 180, 0).l(R, BL); });
def("o", p => p.ell(CX, XM, 9.5, XR));
def("p", p => { p.m(L, XH).l(L, DS); p.ell(CX, XM, 9.5, XR); });
def("q", p => { p.m(R, XH).l(R, DS); p.ell(CX, XM, 9.5, XR); });
def("r", p => { p.m(L, XH).l(L, BL); p.ma(14, 18.5, 8.5, 7.5, 180, 20); });
def("s", p => { p.ma(CX, 20.6, 8.5, 5.4, 30, 250).l(18.2, 15.3).a(CX, 10.4, 8.5, 5.4, 70, -150); });
def("t", p => { p.m(12.5, 33).l(12.5, 9.5).a(17.5, 9.5, 5, 4.5, 180, 270).l(21, BL); p.m(L, XH).l(20, XH); });
def("u", p => p.m(L, XH).l(L, XM).a(CX, XM, 9.5, XR, 180, 360).l(R, XH));
def("v", p => p.m(L, XH).l(CX, BL).l(R, XH));
def("w", p => p.m(L, XH).l(9.8, BL).l(CX, 19).l(20.2, BL).l(R, XH));
def("x", p => { p.m(L, XH).l(R, BL); p.m(R, XH).l(L, BL); });
def("y", p => { p.m(L, XH).l(14.2, 7.5); p.m(R, XH).l(9, DS); });
def("z", p => p.m(L, XH).l(R, XH).l(L, BL).l(R, BL));

// --- digits -----------------------------------------------------------------
def("0", p => { p.ell(CX, CM, 9.5, 15.75); p.m(10.5, 13.5).l(19.5, 28); });
def("1", p => { p.m(8, 30).l(CX, CT).l(CX, BL); p.m(7, BL).l(23, BL); });
def("2", p => p.ma(CX, 28.5, 9.5, 8, 190, -20).l(L, BL).l(R, BL));
def("3", p => p.ma(14.9, 28.6, 9.4, 7.9, 170, -80).a(14.8, 12.9, 9.5, 7.9, 80, -170));
def("4", p => p.m(19, BL).l(19, CT).l(L, 14.5).l(R, 14.5));
def("5", p => p.m(23, CT).l(7, CT).l(6.7, 23.4).l(12.85, 23.26).a(14.5, 14.2, 9.5, 9.2, 100, -160));
def("6", p => { p.ma(CX, CM, 9.5, 15.75, 62, 200); p.ell(CX, 12.4, 9.5, 7.4); });
def("7", p => p.m(L, CT).l(R, CT).l(10.5, BL));
def("8", p => { p.ell(CX, 29, 8.2, 7.5); p.ell(CX, 12.6, 9.5, 7.6); });
def("9", p => { p.ell(CX, 29.1, 9.5, 7.4); p.ma(CX, CM, 9.5, 15.75, 20, -110); });

// --- punctuation & symbols --------------------------------------------------
def("!", p => { p.m(CX, CT).l(CX, 12.5); p.dot(CX, BL); });
def('"', p => { p.m(11.5, CT).l(11.5, 29); p.m(18.5, CT).l(18.5, 29); });
def("#", p => { p.m(11, 34).l(9, 8); p.m(19, 34).l(17, 8); p.m(6, 26.5).l(23, 26.5); p.m(7, 15.5).l(24, 15.5); });
def("$", p => { p.ma(CX, 28.5, 8.5, 7, 30, 250).l(17.9, 20.5).a(CX, 13, 8.5, 7.2, 70, -150); p.m(CX, 39).l(CX, 2.5); });
def("%", p => { p.ell(9.5, 30.5, 4.5, 4.5); p.ell(20.5, 11, 4.5, 4.5); p.m(6, 7).l(24, 34.5); });
def("&", p => p.m(24, 13).l(9.04, 25.82).a(13.3, 28.8, 5.2, 5.2, 215, -35).l(7.56, 13.66).a(13.8, 12.6, 6.3, 7.6, 172, 330));
def("'", p => p.m(CX, CT).l(CX, 29.5));
def("(", p => p.ma(31.5, 18.5, 22, 24.9, 124.6, 235.4));
def(")", p => p.ma(-1.5, 18.5, 22, 24.9, 55.4, -55.4));
def("*", p => { p.m(CX, 36).l(CX, 24); p.m(9.8, 33).l(20.2, 27); p.m(9.8, 27).l(20.2, 33); });
def("+", p => { p.m(CX, 29.5).l(CX, 12); p.m(6.5, CM).l(23.5, CM); });
def(",", p => p.m(16, 7).l(11.5, -1.5));
def("-", p => p.m(6, CM).l(24, CM));
def(".", p => p.dot(CX, BL));
def("/", p => p.m(6, 2).l(24, 39));
def(":", p => { p.dot(CX, 22); p.dot(CX, 7.5); });
def(";", p => { p.dot(CX, 22); p.m(16, 7).l(11.5, -1.5); });
def("<", p => p.m(23, 32).l(7, CM).l(23, 9.5));
def("=", p => { p.m(6.5, 25.5).l(23.5, 25.5); p.m(6.5, 16).l(23.5, 16); });
def(">", p => p.m(7, 32).l(23, CM).l(7, 9.5));
def("?", p => { p.ma(CX, 30, 8, 6.5, 195, -35).l(CX, 19).l(CX, 13); p.dot(CX, BL); });
def("@", p => { p.ma(CX, CM, 9.5, 14, -50, 240); p.ell(14.3, 18.8, 3.6, 4.6); p.m(17.9, 20.5).l(17.9, 15).l(21, 16.5); });
def("[", p => p.m(21, 39).l(10, 39).l(10, -2).l(21, -2));
def("\\", p => p.m(6, 39).l(24, 2));
def("]", p => p.m(9, 39).l(20, 39).l(20, -2).l(9, -2));
def("^", p => p.m(7, 28).l(CX, CT).l(23, 28));
def("_", p => p.m(5, 0).l(25, 0));
def("`", p => p.m(11, CT).l(17, 31));
def("{", p => p.m(21, 39).l(16, 36).l(16, 23).l(11, 18.5).l(16, 14).l(16, 1).l(21, -2));
def("|", p => p.m(CX, 39).l(CX, -2));
def("}", p => p.m(9, 39).l(14, 36).l(14, 23).l(19, 18.5).l(14, 14).l(14, 1).l(9, -2));
def("~", p => p.ma(10.25, 19.5, 4.75, 3.6, 180, 0).a(19.75, 19.5, 4.75, 3.6, 180, 360));

// --- accents & cyrillic -----------------------------------------------------
const plus = (base, fn) => G[base] + " " + g(fn).replace(/^w [\d.]+ /, "");
const dots = y => p => { p.dot(10.5, y); p.dot(19.5, y); };
const acute = y => p => p.m(13, y).l(18, y + 4.5);
const grave = y => p => p.m(18, y).l(13, y + 4.5);
const circ = y => p => p.m(10.5, y).l(CX, y + 4.5).l(19.5, y);
const tilde = y => p => p.ma(11, y, 3.5, 2.6, 180, 0).a(19, y + 2.6, 4.5, 2.6, 180, 360);
const marks = [
  ["ä", "a", dots(31.5)], ["ö", "o", dots(31.5)], ["ü", "u", dots(31.5)],
  ["ë", "e", dots(31.5)], ["é", "e", acute(30.5)], ["è", "e", grave(30.5)],
  ["ê", "e", circ(31)], ["ñ", "n", tilde(30.5)], ["Ñ", "N", tilde(41)],
];
for (const m of marks) G[m[0]] = plus(m[1], m[2]);

const alias = {
  "А": "A", "В": "B", "Е": "E", "М": "M", "Н": "H",
  "О": "O", "Р": "P", "Т": "T", "Х": "X",
  "а": "a", "е": "e", "о": "o", "р": "p", "х": "x",
};
for (const k in alias) G[k] = G[alias[k]];
def("г", p => p.m(L, BL).l(L, XH).l(R, XH));
def("Г", p => p.m(L, BL).l(L, CT).l(R, CT));
def("п", p => p.m(L, BL).l(L, XH).l(R, XH).l(R, BL));
def("П", p => p.m(L, BL).l(L, CT).l(R, CT).l(R, BL));
def("и", p => p.m(L, XH).l(L, BL).l(R, XH).l(R, BL));
def("И", p => p.m(L, CT).l(L, BL).l(R, CT).l(R, BL));
def("м", p => p.m(L, BL).l(L, XH).l(CX, 14).l(R, XH).l(R, BL));
def("т", p => { p.m(L, XH).l(R, XH); p.m(CX, XH).l(CX, BL); });
def("в", p => { p.m(L, BL).l(L, XH); p.ma(L, 23.5, 15, 2.5, 90, -90); p.ma(L, 13, 16, 8, 90, -90); });
def("Я", p => { p.m(R, BL).l(R, CT); p.ma(R, 29.25, -17, 7.25, 90, -90); p.m(R, 22).l(L, BL); });

// --- merge over the original, keeping braille / icons / rare symbols --------
const src = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const out = {};
for (const k in src) {
  if (k in G) out[k] = G[k];                                   // redrawn
  else if (typeof src[k] !== "string") out[k] = { ...src[k], ttf: FACE };  // metadata header
  else out[k] = src[k].replace(/(^|\s)w 5\.53(\s|$)/g, "$1w " + W + "$2");  // kept, reweighted
}
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 2) + "\n");
console.error("redrawn " + Object.keys(G).length + " glyphs, kept " + (Object.keys(src).length - Object.keys(G).length) + ", weight " + W);
