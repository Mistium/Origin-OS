// Build a .ttf from an .ojff using the EXACT OJFFToTTF the runtime uses,
// extracted live from origin/main/osl/core.fractch (no reimplementation).
const fs = require("fs");
const CORE = process.env.FRACTCH || "/Users/sophie/origin-fractch/origin/main/osl/core.fractch";

const src = fs.readFileSync(CORE, "utf8").split("\n");
const line = src.find(l => l.includes("window.OJFFToTTF = (function ()"));
if (!line) throw new Error("OJFFToTTF not found in core.fractch");
const lit = line.slice(line.indexOf('"'), line.lastIndexOf('"') + 1);
const code = JSON.parse(lit);                       // unescape the fractch js"" string

const window = {};
new Function("window", code)(window);
if (typeof window.OJFFToTTF !== "function") throw new Error("extraction failed");

const [, , ojffPath, outPath, name] = process.argv;
const data = JSON.parse(fs.readFileSync(ojffPath, "utf8"));
const res = window.OJFFToTTF(data, name || "origin");
fs.writeFileSync(outPath, Buffer.from(res.ttf));
console.log(outPath, "->", res.glyphs, "glyphs,", res.ttf.length, "bytes, skipped:", res.skipped.length ? res.skipped : "none");
