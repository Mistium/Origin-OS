// Lucide -> ICN converter for originOS named icons.
// Usage: node lucide2icn.mjs <lucide-icons-dir> <origin-os-icons-dir>

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const LUCIDE = process.argv[2]
const ICONS = process.argv[3]

// Lucide draws on a 24 unit grid but keeps its content inside the middle 20x20,
// which is exactly the ICN box (-10..10, y up). So the content area maps 1:1 and
// every icon lands at the same standard size.
const SCALE = 1
// Standard stroke for every named icon. Lucide's own weight is 2, but originOS draws
// icons small (window buttons are 0.6), where 2 reads as a hairline, so the set keeps
// originOS's established weight. One number moves the whole library.
const STROKE = 3
const FLATNESS = 0.45 // max segment length in Lucide units when flattening curves
const COLLINEAR = 0.012 // drop a point this close to the line through its neighbours

const r2 = v => {
  const n = Math.round(v * 100) / 100
  return Object.is(n, -0) ? 0 : n
}
const TX = x => r2((x - 12) * SCALE)
const TY = y => r2((12 - y) * SCALE)

/* ---------- SVG path parsing ---------- */

const LETTERS = 'MmZzLlHhVvCcSsQqTtAa'

function parsePath (d) {
  const s = String(d)
  const n = s.length
  let i = 0
  const skip = () => { while (i < n && ' ,\t\r\n'.includes(s[i])) i++ }
  const num = () => {
    skip()
    const start = i
    if (s[i] === '-' || s[i] === '+') i++
    while (i < n && s[i] >= '0' && s[i] <= '9') i++
    if (s[i] === '.') { i++; while (i < n && s[i] >= '0' && s[i] <= '9') i++ }
    if (s[i] === 'e' || s[i] === 'E') {
      i++
      if (s[i] === '-' || s[i] === '+') i++
      while (i < n && s[i] >= '0' && s[i] <= '9') i++
    }
    return parseFloat(s.slice(start, i))
  }
  // Arc flags may be packed without separators ("a2 2 0 0 1-2 2"), so read one char.
  const flag = () => { skip(); return s[i++] === '1' ? 1 : 0 }

  const out = []
  let cmd = null
  while (i < n) {
    skip()
    if (i >= n) break
    if (LETTERS.includes(s[i])) { cmd = s[i]; i++ } else if (cmd === 'M') cmd = 'L'
    else if (cmd === 'm') cmd = 'l'
    else if (cmd === null) break
    const k = cmd.toUpperCase()
    const a = []
    if (k === 'Z') { /* no args */ } else if (k === 'H' || k === 'V') a.push(num())
    else if (k === 'M' || k === 'L' || k === 'T') a.push(num(), num())
    else if (k === 'S' || k === 'Q') a.push(num(), num(), num(), num())
    else if (k === 'C') for (let j = 0; j < 6; j++) a.push(num())
    else if (k === 'A') a.push(num(), num(), num(), flag(), flag(), num(), num())
    out.push([cmd, a])
  }
  return out
}

/* ---------- flattening ---------- */

function cubic (p, x0, y0, x1, y1, x2, y2, x3, y3) {
  const len = Math.hypot(x1 - x0, y1 - y0) + Math.hypot(x2 - x1, y2 - y1) + Math.hypot(x3 - x2, y3 - y2)
  const steps = Math.max(1, Math.min(32, Math.ceil(len / FLATNESS)))
  for (let k = 1; k <= steps; k++) {
    const t = k / steps
    const u = 1 - t
    p(
      u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
      u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3
    )
  }
}

function arcTo (p, x0, y0, rx, ry, rot, large, sweep, x, y) {
  if (rx === 0 || ry === 0) { p(x, y); return }
  rx = Math.abs(rx); ry = Math.abs(ry)
  const phi = rot * Math.PI / 180
  const cos = Math.cos(phi)
  const sin = Math.sin(phi)
  const dx2 = (x0 - x) / 2
  const dy2 = (y0 - y) / 2
  const x1 = cos * dx2 + sin * dy2
  const y1 = -sin * dx2 + cos * dy2
  let lam = (x1 * x1) / (rx * rx) + (y1 * y1) / (ry * ry)
  if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s }
  const sign = large === sweep ? -1 : 1
  let num = rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1
  const den = rx * rx * y1 * y1 + ry * ry * x1 * x1
  if (num < 0) num = 0
  const co = sign * Math.sqrt(num / den || 0)
  const cx1 = co * rx * y1 / ry
  const cy1 = -co * ry * x1 / rx
  const cx = cos * cx1 - sin * cy1 + (x0 + x) / 2
  const cy = sin * cx1 + cos * cy1 + (y0 + y) / 2
  const ang = (ux, uy, vx, vy) => {
    const d = Math.hypot(ux, uy) * Math.hypot(vx, vy)
    let c = d === 0 ? 1 : (ux * vx + uy * vy) / d
    c = Math.min(1, Math.max(-1, c))
    const a = Math.acos(c)
    return ux * vy - uy * vx < 0 ? -a : a
  }
  const t1 = ang(1, 0, (x1 - cx1) / rx, (y1 - cy1) / ry)
  let dt = ang((x1 - cx1) / rx, (y1 - cy1) / ry, (-x1 - cx1) / rx, (-y1 - cy1) / ry)
  if (!sweep && dt > 0) dt -= 2 * Math.PI
  if (sweep && dt < 0) dt += 2 * Math.PI
  const steps = Math.max(2, Math.min(64, Math.ceil(Math.abs(dt) * Math.max(rx, ry) / FLATNESS)))
  for (let k = 1; k <= steps; k++) {
    const t = t1 + dt * (k / steps)
    const ex = Math.cos(t) * rx
    const ey = Math.sin(t) * ry
    p(cos * ex - sin * ey + cx, sin * ex + cos * ey + cy)
  }
}

// Turn path commands into subpaths of points in Lucide coordinates.
function pathToSubpaths (d) {
  const subs = []
  let cur = null
  let cx = 0; let cy = 0; let sx = 0; let sy = 0
  let pcx = null; let pcy = null; let pqx = null; let pqy = null
  const push = (x, y) => {
    if (!cur) return
    const last = cur.pts[cur.pts.length - 1]
    if (last && Math.abs(last[0] - x) < 1e-9 && Math.abs(last[1] - y) < 1e-9) { cx = x; cy = y; return }
    cur.pts.push([x, y]); cx = x; cy = y
  }
  const open = (x, y) => { cur = { pts: [[x, y]], closed: false }; subs.push(cur); cx = sx = x; cy = sy = y }

  for (const [cmd, a] of parsePath(d)) {
    const k = cmd.toUpperCase()
    const rel = cmd !== k
    const ox = rel ? cx : 0
    const oy = rel ? cy : 0
    if (k === 'M') { open(a[0] + ox, a[1] + oy); pcx = pqx = null; continue }
    if (k === 'Z') { if (cur) { cur.closed = true; cx = sx; cy = sy }; pcx = pqx = null; continue }
    if (!cur) open(cx, cy)
    if (k === 'L') { push(a[0] + ox, a[1] + oy); pcx = pqx = null } else if (k === 'H') { push(a[0] + ox, cy); pcx = pqx = null } else if (k === 'V') { push(cx, a[0] + oy); pcx = pqx = null } else if (k === 'C') {
      const x1 = a[0] + ox; const y1 = a[1] + oy; const x2 = a[2] + ox; const y2 = a[3] + oy
      const x3 = a[4] + ox; const y3 = a[5] + oy
      cubic(push, cx, cy, x1, y1, x2, y2, x3, y3)
      pcx = x2; pcy = y2; pqx = null
    } else if (k === 'S') {
      const x1 = pcx === null ? cx : 2 * cx - pcx
      const y1 = pcy === null ? cy : 2 * cy - pcy
      const x2 = a[0] + ox; const y2 = a[1] + oy; const x3 = a[2] + ox; const y3 = a[3] + oy
      cubic(push, cx, cy, x1, y1, x2, y2, x3, y3)
      pcx = x2; pcy = y2; pqx = null
    } else if (k === 'Q') {
      const qx = a[0] + ox; const qy = a[1] + oy; const x3 = a[2] + ox; const y3 = a[3] + oy
      cubic(push, cx, cy, cx + 2 / 3 * (qx - cx), cy + 2 / 3 * (qy - cy), x3 + 2 / 3 * (qx - x3), y3 + 2 / 3 * (qy - y3), x3, y3)
      pqx = qx; pqy = qy; pcx = null
    } else if (k === 'T') {
      const qx = pqx === null ? cx : 2 * cx - pqx
      const qy = pqy === null ? cy : 2 * cy - pqy
      const x3 = a[0] + ox; const y3 = a[1] + oy
      cubic(push, cx, cy, cx + 2 / 3 * (qx - cx), cy + 2 / 3 * (qy - cy), x3 + 2 / 3 * (qx - x3), y3 + 2 / 3 * (qy - y3), x3, y3)
      pqx = qx; pqy = qy; pcx = null
    } else if (k === 'A') {
      arcTo(push, cx, cy, a[0], a[1], a[2], a[3], a[4], a[5] + ox, a[6] + oy)
      pcx = pqx = null
    }
  }
  return subs.filter(s => s.pts.length > 0)
}

// Drop points that sit on the straight line between their neighbours.
function simplify (pts) {
  if (pts.length < 3) return pts
  const out = [pts[0]]
  for (let i = 1; i < pts.length - 1; i++) {
    const a = out[out.length - 1]
    const b = pts[i]
    const c = pts[i + 1]
    const dx = c[0] - a[0]
    const dy = c[1] - a[1]
    const len = Math.hypot(dx, dy)
    const dev = len === 0
      ? Math.hypot(b[0] - a[0], b[1] - a[1])
      : Math.abs((b[0] - a[0]) * dy - (b[1] - a[1]) * dx) / len
    if (dev > COLLINEAR) out.push(b)
  }
  out.push(pts[pts.length - 1])
  return out
}

/* ---------- element -> subpaths ---------- */

function roundedRect (x, y, w, h, rx, ry) {
  rx = Math.min(Math.abs(rx || 0), w / 2)
  ry = Math.min(Math.abs(ry == null ? rx : ry), h / 2)
  if (rx < 0.01 || ry < 0.01) {
    return [{ pts: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], closed: true }]
  }
  const pts = []
  const p = (px, py) => {
    const last = pts[pts.length - 1]
    if (last && Math.abs(last[0] - px) < 1e-9 && Math.abs(last[1] - py) < 1e-9) return
    pts.push([px, py])
  }
  const corner = (ccx, ccy, a0, a1) => {
    const steps = Math.max(2, Math.ceil(Math.abs(a1 - a0) * Math.max(rx, ry) / FLATNESS))
    for (let k = 0; k <= steps; k++) {
      const t = a0 + (a1 - a0) * (k / steps)
      p(ccx + Math.cos(t) * rx, ccy + Math.sin(t) * ry)
    }
  }
  p(x + rx, y)
  p(x + w - rx, y)
  corner(x + w - rx, y + ry, -Math.PI / 2, 0)
  p(x + w, y + h - ry)
  corner(x + w - rx, y + h - ry, 0, Math.PI / 2)
  p(x + rx, y + h)
  corner(x + rx, y + h - ry, Math.PI / 2, Math.PI)
  p(x, y + ry)
  corner(x + rx, y + ry, Math.PI, Math.PI * 1.5)
  return [{ pts, closed: true }]
}

function ellipseSub (cx, cy, rx, ry) {
  const pts = []
  const steps = Math.max(12, Math.min(72, Math.ceil(2 * Math.PI * Math.max(rx, ry) / FLATNESS)))
  for (let k = 0; k < steps; k++) {
    const t = (k / steps) * 2 * Math.PI
    pts.push([cx + Math.cos(t) * rx, cy + Math.sin(t) * ry])
  }
  return [{ pts, closed: true }]
}

const numAttr = (v, d = 0) => { const n = parseFloat(v); return Number.isFinite(n) ? n : d }

// Returns { circles: [...], subpaths: [...] }; circles stay native so ICN draws real arcs.
function elementToGeometry (tag, attr) {
  if (tag === 'circle') {
    return { circles: [[numAttr(attr.cx), numAttr(attr.cy), numAttr(attr.r)]], subpaths: [] }
  }
  if (tag === 'ellipse') {
    const rx = numAttr(attr.rx); const ry = numAttr(attr.ry)
    if (Math.abs(rx - ry) < 0.01) return { circles: [[numAttr(attr.cx), numAttr(attr.cy), rx]], subpaths: [] }
    return { circles: [], subpaths: ellipseSub(numAttr(attr.cx), numAttr(attr.cy), rx, ry) }
  }
  if (tag === 'rect') {
    return { circles: [], subpaths: roundedRect(numAttr(attr.x), numAttr(attr.y), numAttr(attr.width), numAttr(attr.height), numAttr(attr.rx), attr.ry == null ? null : numAttr(attr.ry)) }
  }
  if (tag === 'line') {
    return { circles: [], subpaths: [{ pts: [[numAttr(attr.x1), numAttr(attr.y1)], [numAttr(attr.x2), numAttr(attr.y2)]], closed: false }] }
  }
  if (tag === 'polyline' || tag === 'polygon') {
    const nums = String(attr.points || '').trim().split(/[\s,]+/).map(Number).filter(Number.isFinite)
    const pts = []
    for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]])
    return { circles: [], subpaths: pts.length ? [{ pts, closed: tag === 'polygon' }] : [] }
  }
  if (tag === 'path') return { circles: [], subpaths: pathToSubpaths(attr.d || '') }
  return { circles: [], subpaths: [] }
}

/* ---------- filled variants ---------- */

const area = pts => {
  let a = 0
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]; const q = pts[(i + 1) % pts.length]
    a += p[0] * q[1] - q[0] * p[1]
  }
  return a / 2
}

/* ---------- emit ICN ---------- */

// Lucide often returns a path to its start point without an explicit Z.
function isClosed (sub) {
  if (sub.closed) return true
  const p = sub.pts
  return p.length > 2 && Math.hypot(p[0][0] - p[p.length - 1][0], p[0][1] - p[p.length - 1][1]) < 0.05
}

function strokeSub (out, sub) {
  let pts = simplify(sub.pts)
  if (isClosed(sub) && pts.length > 2) pts = pts.concat([pts[0]])
  if (pts.length === 1) { out.push(`dot ${TX(pts[0][0])} ${TY(pts[0][1])}`); return }
  if (pts.length < 2) return
  out.push(`line ${TX(pts[0][0])} ${TY(pts[0][1])} ${TX(pts[1][0])} ${TY(pts[1][1])}`)
  for (let i = 2; i < pts.length; i++) out.push(`cont ${TX(pts[i][0])} ${TY(pts[i][1])}`)
}

function emit (geoms, { filled = false } = {}) {
  const out = [`w ${r2(STROKE)}`]
  const circles = geoms.flatMap(g => g.circles)
  const subs = geoms.flatMap(g => g.subpaths)
  let fillTarget = null

  if (filled) {
    // Fill every closed outline, so multi-cell icons keep their cells.
    let closed = subs.filter(s => isClosed(s) && s.pts.length >= 3)
    // Icons drawn as open strokes (headphones, store) still read best filled,
    // so fall back to the largest outline; SVG closes it implicitly.
    if (!closed.length && subs.length) {
      let big = null
      for (const s of subs) {
        if (s.pts.length < 3) continue
        const a = Math.abs(area(s.pts))
        if (!big || a > big.a) big = { a, s }
      }
      if (big) closed = [big.s]
    }
    if (closed.length) {
      fillTarget = new Set(closed)
      out.push('fill 1')
      for (const s of closed) strokeSub(out, s)
      out.push('fill 0')
    } else {
      // Nothing but a circle: fill it as a path so every icon keeps one stroke width.
      let big = null
      for (const c of circles) if (!big || c[2] > big[2]) big = c
      if (big) {
        const disc = ellipseSub(big[0], big[1], big[2], big[2])[0]
        circles.splice(circles.indexOf(big), 1)
        fillTarget = new Set([disc])
        out.push('fill 1')
        strokeSub(out, disc)
        out.push('fill 0')
      }
    }
  }

  for (const [cx, cy, r] of circles) {
    // cutcircle sweeps twice its arc argument, so 180 is a full circle.
    out.push(`cutcircle ${TX(cx)} ${TY(cy)} ${r2(r * SCALE)} 0 180`)
  }
  for (const sub of subs) {
    if (fillTarget && fillTarget.has(sub)) continue
    strokeSub(out, sub)
  }
  return out.join(' ')
}

/* ---------- standard size ---------- */

// Lucide sizes icons optically, so a cross sits well inside the box while a circle
// fills it. originOS expects every named icon to occupy the same box, so scale each
// one uniformly (aspect kept, stroke weight untouched) until it reaches the edge.
const ARITY = {
  w: 1, c: 1, fill: 1, scale: 1, back: 0, cont: 2, dot: 2, move: 2, line: 4,
  rect: 4, square: 4, tri: 6, curve: 6, cutcircle: 5, ellipse: 5, icn: 4, ricn: 4,
  image: 2, pimg: 5
}
// Which args of each op are lengths that must scale with the icon.
const COORDS = {
  line: [0, 1, 2, 3], cont: [0, 1], dot: [0, 1], move: [0, 1], tri: [0, 1, 2, 3, 4, 5],
  curve: [0, 1, 2, 3, 4, 5], rect: [0, 1, 2, 3], square: [0, 1, 2, 3],
  cutcircle: [0, 1, 2], ellipse: [0, 1, 2]
}

function walk (icn, visit) {
  const t = icn.split(' ')
  let i = 0
  let w = STROKE
  while (i < t.length) {
    const op = t[i]
    const n = ARITY[op]
    if (n === undefined) { i++; continue }
    const args = t.slice(i + 1, i + 1 + n)
    if (op === 'w') w = parseFloat(args[0]) || 0
    visit(op, args, w, i + 1)
    i += 1 + n
  }
  return t
}

function standardise (icn) {
  let ext = 0
  walk(icn, (op, args, w) => {
    const c = COORDS[op]
    if (!c) return
    const v = args.map(Number)
    if (op === 'dot') {
      ext = Math.max(ext, Math.abs(v[0]) + w / 2, Math.abs(v[1]) + w / 2)
    } else if (op === 'rect' || op === 'square') {
      ext = Math.max(ext, Math.abs(v[0]) + Math.abs(v[2]), Math.abs(v[1]) + Math.abs(v[3]))
    } else if (op === 'cutcircle' || op === 'ellipse') {
      ext = Math.max(ext, Math.abs(v[0]) + Math.abs(v[2]), Math.abs(v[1]) + Math.abs(v[2]))
    } else {
      for (const j of c) ext = Math.max(ext, Math.abs(v[j]))
    }
  })
  if (!(ext > 0)) return icn
  const k = Math.min(2, Math.max(0.5, 10 / ext))
  if (Math.abs(k - 1) < 0.01) return icn
  const out = icn.split(' ')
  walk(icn, (op, args, w, at) => {
    const c = COORDS[op]
    if (!c) return
    for (const j of c) out[at + j] = String(r2(Number(args[j]) * k))
  })
  return out.join(' ')
}

/* ---------- lucide loading ---------- */

function loadLucide (name) {
  const file = join(LUCIDE, `${name}.mjs`)
  if (!existsSync(file)) throw new Error(`missing lucide icon: ${name}`)
  const src = readFileSync(file, 'utf8')
  const m = src.match(/=\s*(\[[\s\S]*?\]);\s*\n\s*export/)
  if (!m) throw new Error(`cannot parse lucide icon: ${name}`)
  // The data is a JS literal with unquoted keys; JSON needs them quoted.
  const json = m[1].replace(/([{,]\s*)([A-Za-z_$][\w$-]*)\s*:/g, '$1"$2":')
  return JSON.parse(json)
}

function convert (lucideName, opts = {}) {
  const els = loadLucide(lucideName)
  const geoms = els
    .filter(([, a]) => !(a && a.fill && a.fill !== 'none' && a.r != null && parseFloat(a.r) < 1))
    .map(([tag, a]) => elementToGeometry(tag, a || {}))
  return standardise(emit(geoms, opts))
}

/* ---------- battery ramp ---------- */

// Lucide's battery body with N of 4 bars, so originOS keeps five distinct levels.
function battery (level) {
  const body = elementToGeometry('rect', { x: '2', y: '6', width: '16', height: '12', rx: '2' })
  const geoms = [body, elementToGeometry('line', { x1: '22', y1: '10', x2: '22', y2: '14' })]
  for (let i = 0; i < level; i++) {
    const x = String(5.6 + i * 3.2)
    geoms.push(elementToGeometry('line', { x1: x, y1: '10', x2: x, y2: '14' }))
  }
  return standardise(emit(geoms))
}

/* ---------- name mapping ---------- */

const FILL = { filled: true }

// Geometry originOS wants kept from the old set; only the stroke is standardised.
const LITERAL = {
  maximise: 'line 0 10 -10 10 cont -10 0 line 0 -10 10 -10 cont 10 0'
}

const MAP = {
  // interface
  accounts: ['users'],
  add: ['plus'],
  apps: ['layout-grid'],
  'apps-full': ['layout-grid', FILL],
  battery_charging: ['battery-charging'],
  bin: ['trash-2'],
  book: ['book'],
  bookmark: ['bookmark'],
  'bookmark-full': ['bookmark', FILL],
  close: ['x'],
  cog: ['cog'],
  controller: ['gamepad-2'],
  copy: ['copy'],
  deny: ['ban'],
  desktops: ['monitor'],
  'dot-grid': ['grip'],
  download: ['download'],
  edit: ['pencil'],
  eye: ['eye'],
  favorites: ['star'],
  'favorites-full': ['star', FILL],
  file: ['file'],
  folder: ['folder'],
  grid: ['grid-2x2'],
  'grid-full': ['layout-grid', FILL],
  'grid-apps': ['grid-3x3'],
  'grid-apps-full': ['layout-grid', FILL],
  headphones: ['headphones'],
  'headphones-full': ['headphones', FILL],
  home: ['house'],
  'home-full': ['house', FILL],
  image: ['image'],
  info: ['info'],
  link: ['link'],
  locked: ['lock'],
  'locked-full': ['lock', FILL],
  'log-in': ['log-in'],
  'log-out': ['log-out'],
  mail: ['mail'],
  maximise: ['maximize-2'],
  message: ['message-square'],
  microphone: ['mic'],
  minimise: ['minimize-2'],
  minus: ['minus'],
  moon: ['moon'],
  multitasking: ['layers'],
  network: ['wifi'],
  notifications: ['bell'],
  open: ['external-link'],
  paste: ['clipboard-paste'],
  permissions: ['shield-check'],
  phone: ['phone'],
  pin: ['pin'],
  'pin-full': ['pin', FILL],
  power: ['power'],
  reload: ['rotate-cw'],
  rename: ['pencil-line'],
  save: ['save'],
  script: ['file-code'],
  'script-curly': ['braces'],
  search: ['search'],
  send: ['send'],
  settings: ['settings'],
  'settings-full': ['settings', FILL],
  share: ['share-2'],
  sort: ['arrow-up-down'],
  sound: ['volume-2'],
  store: ['store'],
  'store-full': ['store', FILL],
  sun: ['sun'],
  sync: ['refresh-cw'],
  tag: ['tag'],
  'tag-full': ['tag', FILL],
  tags: ['tags'],
  target: ['target'],
  thermometer: ['thermometer'],
  tick: ['check'],
  upload: ['upload'],
  zip: ['file-archive'],
  dice_1: ['dice-1'],
  dice_2: ['dice-2'],
  dice_3: ['dice-3'],
  dice_4: ['dice-4'],
  dice_5: ['dice-5'],
  dice_6: ['dice-6'],
  // miscellaneous
  'alarm-clock': ['alarm-clock'],
  atom: ['atom'],
  camera: ['camera'],
  circle: ['circle'],
  'circle-full': ['circle', FILL],
  clock: ['clock'],
  'controller-up': ['circle-arrow-up'],
  'controller-down': ['circle-arrow-down'],
  'controller-left': ['circle-arrow-left'],
  'controller-right': ['circle-arrow-right'],
  cube: ['box'],
  down: ['chevron-down'],
  'down-arrow': ['arrow-down'],
  eraser: ['eraser'],
  key: ['key'],
  left: ['chevron-left'],
  'left-arrow': ['arrow-left'],
  list: ['list'],
  menu: ['menu'],
  'menu-thin': ['menu'],
  more: ['ellipsis'],
  'more-vertical': ['ellipsis-vertical'],
  option: ['option'],
  pause: ['pause'],
  pen: ['pen'],
  play: ['play'],
  quaver: ['music'],
  right: ['chevron-right'],
  'right-arrow': ['arrow-right'],
  'square-full': ['square', FILL],
  stopwatch: ['timer'],
  timer: ['timer'],
  up: ['chevron-up'],
  'up-arrow': ['arrow-up'],
  'volume-1': ['volume-1'],
  'volume-max': ['volume-2'],
  'volume-mute': ['volume-x'],
  // added for the context menu
  scissors: ['scissors'],
  terminal: ['terminal'],
  'select-all': ['square-dashed'],
  clipboard: ['clipboard'],
  // system app tiles
  activity: ['activity'],
  brain: ['brain'],
  calculator: ['calculator'],
  code: ['code'],
  globe: ['globe'],
  'life-buoy': ['life-buoy'],
  radio: ['radio'],
  replace: ['replace'],
  rocket: ['rocket'],
  wallet: ['wallet'],
  split: ['columns-2']
}

/* ---------- run ---------- */

const generated = {}
for (const [name, [lucideName, opts]] of Object.entries(MAP)) {
  generated[name] = convert(lucideName, opts || {})
}
for (const [name, geom] of Object.entries(LITERAL)) {
  generated[name] = standardise(`w ${r2(STROKE)} ${geom}`)
}
for (let i = 0; i <= 4; i++) generated[`battery_${i}`] = battery(i)

const packs = ['interface', 'miscellaneous-icons', 'pride-flags', 'system-logos']
const merged = {}
const report = { replaced: [], kept: [] }

for (const pack of packs) {
  const file = join(ICONS, 'Packs', `${pack}.ojip`)
  if (!existsSync(file)) continue
  const doc = JSON.parse(readFileSync(file, 'utf8'))
  for (const name of Object.keys(doc.data)) {
    if (generated[name] !== undefined) {
      doc.data[name] = generated[name]
      report.replaced.push(name)
    } else {
      report.kept.push(name)
    }
  }
  writeFileSync(file, JSON.stringify(doc, null, 2) + '\n')
  Object.assign(merged, doc.data)
}

// Names with no home yet join the interface pack.
const interfaceFile = join(ICONS, 'Packs', 'interface.ojip')
const added = Object.keys(generated).filter(n => merged[n] === undefined)
if (added.length) {
  const doc = JSON.parse(readFileSync(interfaceFile, 'utf8'))
  for (const n of added) { doc.data[n] = generated[n]; merged[n] = generated[n] }
  const sorted = {}
  for (const k of Object.keys(doc.data).sort()) sorted[k] = doc.data[k]
  doc.data = sorted
  writeFileSync(interfaceFile, JSON.stringify(doc, null, 2) + '\n')
}

const allFile = join(ICONS, 'all-icons.json')
const all = JSON.parse(readFileSync(allFile, 'utf8'))
for (const name of Object.keys(merged)) all.data[name] = merged[name]
const allSorted = {}
for (const k of Object.keys(all.data).sort()) allSorted[k] = all.data[k]
all.data = allSorted
all.manifest.generated = new Date().toISOString()
writeFileSync(allFile, JSON.stringify(all, null, 2) + '\n')

console.log(`replaced ${new Set(report.replaced).size} icons`)
if (added.length) console.log(`added ${added.length}:`, added.join(', '))
console.log(`kept ${report.kept.length}:`, report.kept.join(', '))
