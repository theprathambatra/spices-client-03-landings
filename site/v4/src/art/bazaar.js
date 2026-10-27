// Procedural paper-cut layers for the Bazaar Diorama. Everything is drawn on 2D canvases in a
// logical space that is 1000 units tall; width follows the viewport aspect.
export const C = {
  night: '#120F3E', indigo: '#1E1B5E', marigold: '#F7A614', rani: '#D81B76', emerald: '#0E7A57',
  vermilion: '#D9381E', ivory: '#FFF6E5', gold: '#D4A017', teal: '#0D8E9B', plum: '#5B1A6B',
}

export const LAYERS = [
  { id: 'sky', z: -60 }, { id: 'hills', z: -50 }, { id: 'city', z: -40 }, { id: 'facade', z: -28 },
  { id: 'street', z: -18 }, { id: 'stalls', z: -11 }, { id: 'lanterns', z: -4 }, { id: 'frame', z: 2 },
]
export const INTERIOR_Z = -30.2

export function lanternSpots(Wl) {
  const s = Math.min(Wl / 2, 760)
  const c = Wl / 2
  return [
    { x: c - s * 0.62, y: 300, col: '#FFB347' }, { x: c - s * 0.22, y: 215, col: '#FF8A3D' },
    { x: c + s * 0.2, y: 250, col: '#FFC857' }, { x: c + s * 0.6, y: 330, col: '#FF7B54' },
    { x: c - s * 0.4, y: 520, col: '#FFC857' }, { x: c + s * 0.42, y: 540, col: '#FFB347' },
  ]
}

const rnd = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

function paper(ctx, s = 1) {
  ctx.shadowColor = 'rgba(8,4,40,0.55)'
  ctx.shadowBlur = 16 * s
  ctx.shadowOffsetY = 7 * s
}
const noShadow = (ctx) => { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0 }

function arch(ctx, x, y, w, h) {
  // pointed mughal arch, base centre (x,y), height h
  ctx.beginPath()
  ctx.moveTo(x - w / 2, y)
  ctx.lineTo(x - w / 2, y - h * 0.55)
  ctx.bezierCurveTo(x - w / 2, y - h * 0.82, x - w * 0.18, y - h * 0.9, x, y - h)
  ctx.bezierCurveTo(x + w * 0.18, y - h * 0.9, x + w / 2, y - h * 0.82, x + w / 2, y - h * 0.55)
  ctx.lineTo(x + w / 2, y)
  ctx.closePath()
}

function dome(ctx, x, by, r, fill, trim) {
  ctx.fillStyle = fill
  ctx.beginPath()
  ctx.moveTo(x - r * 0.78, by)
  ctx.bezierCurveTo(x - r * 1.35, by - r * 0.45, x - r * 0.95, by - r * 1.25, x, by - r * 2.0)
  ctx.bezierCurveTo(x + r * 0.95, by - r * 1.25, x + r * 1.35, by - r * 0.45, x + r * 0.78, by)
  ctx.closePath(); ctx.fill()
  // finial
  ctx.fillStyle = trim || C.gold
  ctx.fillRect(x - r * 0.04, by - r * 2.45, r * 0.08, r * 0.5)
  ctx.beginPath(); ctx.arc(x, by - r * 2.2, r * 0.13, 0, 7); ctx.fill()
  ctx.beginPath(); ctx.arc(x, by - r * 2.5, r * 0.07, 0, 7); ctx.fill()
  // base band
  ctx.fillRect(x - r * 0.9, by - r * 0.1, r * 1.8, r * 0.14)
}

function kangura(ctx, x0, x1, y, s, fill) {
  ctx.fillStyle = fill
  for (let x = x0; x < x1; x += s * 1.6) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s * 0.8, y - s * 1.1); ctx.lineTo(x + s * 1.6, y); ctx.closePath(); ctx.fill()
  }
}

function minaret(ctx, x, by, w, h, fill, trim) {
  ctx.fillStyle = fill
  ctx.beginPath(); ctx.moveTo(x - w / 2, by); ctx.lineTo(x - w * 0.36, by - h); ctx.lineTo(x + w * 0.36, by - h); ctx.lineTo(x + w / 2, by); ctx.fill()
  ctx.fillStyle = trim
  for (let i = 1; i < 4; i++) ctx.fillRect(x - w * 0.55, by - (h * i) / 4, w * 1.1, h * 0.025)
  ctx.fillRect(x - w * 0.62, by - h, w * 1.24, h * 0.04)
  dome(ctx, x, by - h, w * 0.5, fill, trim)
}

function chhatri(ctx, x, by, s, fill, trim) {
  ctx.fillStyle = fill
  ctx.fillRect(x - s * 0.62, by - s * 0.14, s * 1.24, s * 0.14)
  for (const dx of [-0.5, -0.17, 0.17, 0.5]) ctx.fillRect(x + dx * s - s * 0.04, by - s * 0.8, s * 0.08, s * 0.7)
  ctx.fillRect(x - s * 0.62, by - s * 0.9, s * 1.24, s * 0.1)
  dome(ctx, x, by - s * 0.9, s * 0.5, fill, trim)
}

function star8(ctx, x, y, r, fill) {
  ctx.fillStyle = fill
  ctx.beginPath()
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2, rr = i % 2 ? r * 0.55 : r
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr)
  }
  ctx.closePath(); ctx.fill()
}

function lantern(ctx, x, y, s, col) {
  ctx.save(); ctx.translate(x, y)
  paper(ctx, 0.5)
  ctx.strokeStyle = C.gold; ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(0, -s * 2.2); ctx.lineTo(0, -s * 0.9); ctx.stroke()
  ctx.fillStyle = C.gold; ctx.fillRect(-s * 0.35, -s * 1.05, s * 0.7, s * 0.2)
  noShadow(ctx)
  // body
  const g = ctx.createRadialGradient(0, 0, 2, 0, 0, s)
  g.addColorStop(0, '#FFF3C4'); g.addColorStop(0.55, col); g.addColorStop(1, C.vermilion)
  ctx.fillStyle = g
  ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.85); ctx.bezierCurveTo(-s * 1.1, -s * 0.5, -s * 1.1, s * 0.5, -s * 0.3, s * 0.85)
  ctx.lineTo(s * 0.3, s * 0.85); ctx.bezierCurveTo(s * 1.1, s * 0.5, s * 1.1, -s * 0.5, s * 0.3, -s * 0.85); ctx.closePath(); ctx.fill()
  ctx.strokeStyle = 'rgba(120,30,10,.55)'; ctx.lineWidth = 2
  for (const k of [0.35, 0.7]) { ctx.beginPath(); ctx.ellipse(0, 0, s * k, s * 0.85, 0, 0, 7); ctx.stroke() }
  ctx.fillStyle = C.gold; ctx.fillRect(-s * 0.32, s * 0.82, s * 0.64, s * 0.14)
  ctx.strokeStyle = C.gold; ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(0, s * 0.95); ctx.lineTo(0, s * 1.5); ctx.stroke()
  ctx.fillStyle = C.rani; ctx.beginPath(); ctx.arc(0, s * 1.55, s * 0.12, 0, 7); ctx.fill()
  ctx.restore()
}

function marigoldString(ctx, x0, y0, x1, y1, sag, size) {
  const n = Math.max(8, Math.floor(Math.hypot(x1 - x0, y1 - y0) / (size * 1.5)))
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag
    ctx.fillStyle = i % 3 === 2 ? '#FF7A1A' : i % 3 === 1 ? '#FFB627' : '#F7A614'
    ctx.beginPath(); ctx.arc(x, y, size, 0, 7); ctx.fill()
    ctx.fillStyle = 'rgba(160,60,0,.45)'; ctx.beginPath(); ctx.arc(x, y, size * 0.4, 0, 7); ctx.fill()
  }
}

function bunting(ctx, x0, y0, x1, y1, sag, size, cols) {
  const n = Math.floor(Math.hypot(x1 - x0, y1 - y0) / (size * 1.25))
  ctx.strokeStyle = 'rgba(255,230,180,.8)'; ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let i = 0; i <= 30; i++) { const t = i / 30; ctx.lineTo(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag) }
  ctx.stroke()
  for (let i = 1; i < n; i++) {
    const t = i / n
    const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag
    ctx.fillStyle = cols[i % cols.length]
    ctx.beginPath(); ctx.moveTo(x - size * 0.5, y); ctx.lineTo(x + size * 0.5, y); ctx.lineTo(x, y + size * 1.1); ctx.closePath(); ctx.fill()
  }
}

function jharokha(ctx, x, y, w, h, body, glass, trim) {
  // projecting balcony window with cusped arch + chhatri on top
  paper(ctx, 0.6)
  ctx.fillStyle = body; ctx.fillRect(x - w * 0.62, y, w * 1.24, h * 0.12)
  ctx.fillRect(x - w * 0.5, y - h * 0.82, w, h * 0.9)
  noShadow(ctx)
  ctx.fillStyle = trim
  arch(ctx, x, y - h * 0.04, w * 0.74, h * 0.76); ctx.fill()
  ctx.fillStyle = glass
  arch(ctx, x, y - h * 0.08, w * 0.58, h * 0.64); ctx.fill()
  ctx.fillStyle = trim
  ctx.fillRect(x - w * 0.04, y - h * 0.7, w * 0.08, h * 0.6)
  ctx.fillRect(x - w * 0.29, y - h * 0.4, w * 0.58, h * 0.04)
  chhatri(ctx, x, y - h * 0.82, w * 0.62, body, C.gold)
}

function jaaliPattern(ctx, x, y, w, h, col) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip()
  ctx.strokeStyle = col; ctx.lineWidth = 2
  const s = 18
  for (let i = -h; i < w + h; i += s) {
    ctx.beginPath(); ctx.moveTo(x + i, y); ctx.lineTo(x + i + h, y + h); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(x + i + h, y); ctx.lineTo(x + i, y + h); ctx.stroke()
  }
  ctx.restore()
}

function base(W, H, scale = 1) {
  const cv = document.createElement('canvas')
  cv.width = Math.round(W * scale); cv.height = Math.round(H * scale)
  const ctx = cv.getContext('2d')
  const u = cv.height / 1000
  ctx.scale(u, u)
  return { cv, ctx, Wl: cv.width / u, c: cv.width / u / 2 }
}

/* ---------- LAYER 0: SKY ---------- */
function drawSky(W, H, q) {
  const { cv, ctx, Wl, c } = base(W, H, q)
  const g = ctx.createLinearGradient(0, 0, 0, 1000)
  g.addColorStop(0, '#0f0c38'); g.addColorStop(0.35, '#2b1a6e'); g.addColorStop(0.62, '#8a1f78'); g.addColorStop(0.8, '#ec5a4a'); g.addColorStop(1, '#ffb347')
  ctx.fillStyle = g; ctx.fillRect(0, 0, Wl, 1000)
  // sun mandala
  const sy = 560, sx = c
  ctx.save(); ctx.translate(sx, sy)
  for (let i = 0; i < 36; i++) {
    ctx.rotate((Math.PI * 2) / 36)
    ctx.fillStyle = i % 2 ? 'rgba(255,200,90,.16)' : 'rgba(255,120,120,.10)'
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-30, -1400); ctx.lineTo(30, -1400); ctx.closePath(); ctx.fill()
  }
  ctx.restore()
  const sg = ctx.createRadialGradient(sx, sy, 20, sx, sy, 230)
  sg.addColorStop(0, '#fff1b8'); sg.addColorStop(0.5, '#ffc857'); sg.addColorStop(1, '#ff8a3d')
  ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, 190, 0, 7); ctx.fill()
  ctx.strokeStyle = 'rgba(255,240,200,.7)'; ctx.lineWidth = 4
  for (const r of [215, 245]) { ctx.setLineDash([2, 14]); ctx.beginPath(); ctx.arc(sx, sy, r, 0, 7); ctx.stroke() }
  ctx.setLineDash([])
  // stars
  const r = rnd(7)
  for (let i = 0; i < 90; i++) {
    const x = r() * Wl, y = r() * 480
    ctx.fillStyle = `rgba(255,236,190,${0.35 + r() * 0.6})`
    star8(ctx, x, y, 2 + r() * 4, ctx.fillStyle)
  }
  // paper clouds
  paper(ctx, 0.8)
  for (let i = 0; i < 7; i++) {
    const x = r() * Wl, y = 180 + r() * 360, w = 160 + r() * 200
    ctx.fillStyle = i % 2 ? 'rgba(255,170,150,.55)' : 'rgba(190,120,220,.5)'
    ctx.beginPath()
    ctx.moveTo(x - w, y)
    for (let k = 0; k < 5; k++) ctx.arc(x - w + (w * 2 * (k + 0.5)) / 5, y, (w * 2) / 10 + (k % 2 ? 10 : 0), Math.PI, 0)
    ctx.fill()
  }
  return cv
}

/* ---------- LAYER 1: FAR HILLS + FORT ---------- */
function drawHills(W, H, q) {
  const { cv, ctx, Wl, c } = base(W, H, q)
  paper(ctx, 1.2)
  ctx.fillStyle = '#6a3d99'
  ctx.beginPath(); ctx.moveTo(0, 1000)
  for (let x = 0; x <= Wl; x += 20) ctx.lineTo(x, 640 - Math.sin(x / 190) * 55 - Math.sin(x / 83) * 22)
  ctx.lineTo(Wl, 1000); ctx.fill()
  // fort wall
  ctx.fillStyle = '#56308a'
  const fy = 640, fx0 = c - Math.min(Wl / 2, 900), fx1 = c + Math.min(Wl / 2, 900)
  ctx.fillRect(fx0, fy, fx1 - fx0, 360)
  kangura(ctx, fx0, fx1, fy, 14, '#56308a')
  for (const dx of [-0.9, -0.45, 0.45, 0.9]) {
    const x = c + dx * Math.min(Wl / 2, 700)
    ctx.fillRect(x - 36, fy - 80, 72, 90); kangura(ctx, x - 40, x + 40, fy - 80, 12, '#56308a')
    dome(ctx, x, fy - 80, 26, '#56308a', '#8a60c0')
  }
  return cv
}

/* ---------- LAYER 2: CITY OF DOMES ---------- */
function drawCity(W, H, q) {
  const { cv, ctx, Wl, c } = base(W, H, q)
  paper(ctx, 1.2)
  const base_y = 700
  ctx.fillStyle = '#a02173'
  ctx.fillRect(0, base_y, Wl, 400)
  const r = rnd(11)
  const s = Math.min(Wl / 2, 900)
  const items = [-0.95, -0.7, -0.45, -0.22, 0.22, 0.47, 0.72, 0.95]
  items.forEach((f, i) => {
    const x = c + f * s
    const w = 100 + r() * 70
    ctx.fillStyle = i % 2 ? '#b8277c' : '#8b1b6f'
    ctx.fillRect(x - w / 2, base_y - 90 - r() * 60, w, 160)
    if (i % 3 === 0) minaret(ctx, x + w * 0.7, base_y, 34, 280 + r() * 60, '#c42f84', C.gold)
    dome(ctx, x, base_y - 90, 36 + r() * 22, i % 2 ? '#0D8E9B' : '#e0397f', C.gold)
  })
  // big central dome
  ctx.fillStyle = '#c42f84'; ctx.fillRect(c - 160, base_y - 150, 320, 220)
  dome(ctx, c, base_y - 150, 110, '#0D8E9B', C.gold)
  minaret(ctx, c - 210, base_y, 44, 380, '#e0397f', C.gold)
  minaret(ctx, c + 210, base_y, 44, 380, '#e0397f', C.gold)
  noShadow(ctx)
  // glowing windows
  ctx.fillStyle = 'rgba(255,200,90,.9)'
  for (let i = 0; i < 70; i++) {
    const x = r() * Wl, y = base_y - 60 + r() * 200
    ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.fill()
  }
  return cv
}

/* ---------- LAYER 3: FACADE with doorway ---------- */
export const DOOR = { w: 128, h: 200 } // logical, for camera maths
export const GROUND_Y = 800
function drawFacade(W, H, q) {
  const { cv, ctx, Wl, c } = base(W, H, q)
  const gy = GROUND_Y
  const half = Math.min(Wl / 2, 900)
  paper(ctx, 1.2)
  // wings
  const stone = '#F2C98A', stoneDk = '#D99A4E', pink = '#E0397F'
  const x0 = c - half - 40, bw = half * 2 + 80
  ctx.fillStyle = stone; ctx.fillRect(x0, 480, bw, gy - 480)
  noShadow(ctx)
  // bands
  ctx.fillStyle = stoneDk; ctx.fillRect(x0, 470, bw, 20); ctx.fillRect(x0, gy - 40, bw, 40)
  ctx.fillStyle = pink; ctx.fillRect(x0, 548, bw, 12)
  kangura(ctx, x0, x0 + bw, 470, 16, stone)
  // rows of jharokha windows
  const cols = Math.max(2, Math.floor(half / 150))
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < cols; i++) {
      const x = c + side * (190 + i * 170 + (side * 40))
      if (Math.abs(x - c) > half + 20) continue
      jharokha(ctx, x, 700, 96, 150, stone, '#3a1670', C.gold)
      paper(ctx, 0.6)
      ctx.fillStyle = i % 2 ? C.teal : C.rani
      ctx.fillRect(x - 36, 584, 72, 8)
      // small glowing arch windows upper row
      ctx.fillStyle = '#FFC857'
      arch(ctx, x, 580, 46, 70); ctx.fill()
      ctx.fillStyle = C.vermilion; arch(ctx, x, 580, 28, 48); ctx.fill()
      noShadow(ctx)
    }
  }
  // corner chhatris
  paper(ctx, 0.8)
  for (const dx of [-1, 1]) chhatri(ctx, c + dx * (half - 30), 470, 90, stone, C.gold)
  // central gate (iwan)
  const gw = 330, gh = 470
  ctx.fillStyle = stone; ctx.fillRect(c - gw / 2 - 30, 360, gw + 60, gy - 360)
  noShadow(ctx)
  ctx.fillStyle = stoneDk; ctx.fillRect(c - gw / 2 - 30, 360, gw + 60, 16)
  kangura(ctx, c - gw / 2 - 30, c + gw / 2 + 30, 360, 14, stone)
  paper(ctx, 0.8)
  chhatri(ctx, c, 346, 120, stone, C.gold)
  for (const dx of [-1, 1]) minaret(ctx, c + dx * (gw / 2 + 50), 360, 34, 150, stone, C.gold)
  noShadow(ctx)
  // arch frames (outer rani pink, gold line)
  ctx.fillStyle = pink; arch(ctx, c, gy, gw, gh); ctx.fill()
  ctx.fillStyle = C.gold; arch(ctx, c, gy, gw - 24, gh - 22); ctx.fill()
  ctx.fillStyle = C.indigo; arch(ctx, c, gy, gw - 44, gh - 40); ctx.fill()
  // jaali top of iwan
  ctx.save(); arch(ctx, c, gy, gw - 44, gh - 40); ctx.clip()
  jaaliPattern(ctx, c - 200, gy - gh, 400, 150, 'rgba(255,200,90,.55)')
  ctx.restore()
  // star motifs on the spandrels
  star8(ctx, c - gw / 2 + 10, gy - gh * 0.55, 20, C.teal)
  star8(ctx, c + gw / 2 - 10, gy - gh * 0.55, 20, C.teal)
  star8(ctx, c, gy - gh - 14, 14, C.gold)
  // doorway: punch transparent hole
  ctx.globalCompositeOperation = 'destination-out'
  const dw = DOOR.w + 10, dh = DOOR.h + 10
  arch(ctx, c, gy, dw, dh); ctx.fill()
  ctx.globalCompositeOperation = 'source-over'
  // door frame trim over the hole edge
  ctx.strokeStyle = C.gold; ctx.lineWidth = 5; arch(ctx, c, gy, dw + 8, dh + 8); ctx.stroke()
  ctx.strokeStyle = C.marigold; ctx.lineWidth = 2; ctx.setLineDash([2, 8]); arch(ctx, c, gy, dw + 22, dh + 20); ctx.stroke(); ctx.setLineDash([])
  // steps & ground
  ctx.fillStyle = '#7b2d8e'
  ctx.fillRect(0, gy, Wl, 400)
  ctx.fillStyle = '#e0397f'; ctx.fillRect(0, gy, Wl, 10)
  // cobble dots
  const r = rnd(5)
  ctx.fillStyle = 'rgba(255,200,90,.35)'
  for (let i = 0; i < 160; i++) { ctx.beginPath(); ctx.ellipse(r() * Wl, gy + 20 + r() * 180, 7, 3, 0, 0, 7); ctx.fill() }
  return cv
}

/* ---------- LAYER 4: STREET: elephant + peacocks ---------- */
function drawElephant(ctx, x, gy, s, flip) {
  ctx.save(); ctx.translate(x, gy); ctx.scale(flip ? -s : s, s)
  const skin = '#6c78a8', skinDk = '#4c5688'
  paper(ctx, 1.3)
  // far legs
  ctx.fillStyle = skinDk
  for (const lx of [-92, 62]) { ctx.beginPath(); ctx.roundRect(lx, -140, 46, 140, 14); ctx.fill() }
  // tail
  ctx.strokeStyle = skinDk; ctx.lineWidth = 9; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(-135, -200); ctx.quadraticCurveTo(-170, -150, -150, -90); ctx.stroke()
  // body
  ctx.fillStyle = skin
  ctx.beginPath(); ctx.ellipse(0, -185, 150, 105, 0, 0, 7); ctx.fill()
  // near legs
  for (const lx of [-60, 100]) { ctx.beginPath(); ctx.roundRect(lx, -140, 50, 140, 16); ctx.fill() }
  ctx.fillStyle = C.gold
  for (const lx of [-60, 100]) ctx.fillRect(lx - 2, -30, 54, 12)
  // head
  ctx.beginPath(); ctx.ellipse(158, -222, 74, 82, 0.1, 0, 7); ctx.fill()
  // ear
  ctx.fillStyle = skinDk
  ctx.beginPath(); ctx.ellipse(108, -218, 42, 66, 0.18, 0, 7); ctx.fill()
  ctx.fillStyle = '#d68aa6'
  ctx.beginPath(); ctx.ellipse(112, -215, 24, 46, 0.18, 0, 7); ctx.fill()
  // trunk
  ctx.strokeStyle = skin; ctx.lineCap = 'round'; ctx.lineWidth = 50
  ctx.beginPath(); ctx.moveTo(196, -222); ctx.bezierCurveTo(250, -190, 262, -100, 232, -52); ctx.stroke()
  ctx.lineWidth = 32
  ctx.beginPath(); ctx.moveTo(232, -52); ctx.bezierCurveTo(222, -22, 240, -10, 266, -26); ctx.stroke()
  // trunk rings
  ctx.strokeStyle = skinDk; ctx.lineWidth = 3
  for (let i = 0; i < 5; i++) { const t = 0.2 + i * 0.14; ctx.beginPath(); ctx.arc(205 + t * 40, -190 + t * 110, 22 - i * 2, 2.6, 4.8); ctx.stroke() }
  // tusk
  ctx.strokeStyle = C.ivory; ctx.lineWidth = 12
  ctx.beginPath(); ctx.moveTo(192, -190); ctx.quadraticCurveTo(250, -170, 262, -208); ctx.stroke()
  noShadow(ctx)
  // eye
  ctx.fillStyle = C.night; ctx.beginPath(); ctx.arc(178, -245, 6, 0, 7); ctx.fill()
  // face paint
  ctx.fillStyle = C.rani
  ctx.beginPath(); ctx.moveTo(150, -290); ctx.lineTo(202, -258); ctx.lineTo(180, -190); ctx.lineTo(140, -220); ctx.closePath(); ctx.fill()
  ctx.fillStyle = C.gold; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(160 + i * 6, -265 + i * 14, 4, 0, 7); ctx.fill() }
  ctx.fillStyle = C.teal; ctx.beginPath(); ctx.arc(168, -280, 10, 0, 7); ctx.fill()
  // blanket
  ctx.fillStyle = C.rani
  ctx.beginPath(); ctx.moveTo(-100, -270); ctx.lineTo(112, -285); ctx.lineTo(112, -140)
  for (let i = 0; i < 9; i++) ctx.lineTo(112 - i * 25 - 12, -140 + (i % 2 ? 0 : 22))
  ctx.lineTo(-112, -140); ctx.closePath(); ctx.fill()
  ctx.strokeStyle = C.gold; ctx.lineWidth = 5; ctx.stroke()
  for (let i = 0; i < 6; i++) { star8(ctx, -80 + i * 36, -208, 12, i % 2 ? C.marigold : C.ivory) }
  ctx.fillStyle = C.teal; ctx.fillRect(-100, -262, 212, 12)
  // howdah
  ctx.fillStyle = C.vermilion; ctx.fillRect(-60, -330, 130, 56)
  ctx.fillStyle = C.gold; ctx.fillRect(-66, -278, 142, 10); ctx.fillRect(-66, -336, 142, 8)
  for (const px of [-56, 62]) ctx.fillRect(px, -400, 8, 66)
  ctx.fillStyle = C.vermilion; ctx.fillRect(-66, -408, 148, 12)
  dome(ctx, 8, -408, 38, C.vermilion, C.gold)
  ctx.fillStyle = C.ivory; star8(ctx, 4, -302, 14, C.ivory)
  ctx.restore()
}

function drawPeacock(ctx, x, gy, s, flip) {
  ctx.save(); ctx.translate(x, gy); ctx.scale(flip ? -s : s, s)
  paper(ctx, 0.8)
  // tail fan
  for (let i = 0; i < 17; i++) {
    const a = -Math.PI * 0.95 + (i / 16) * Math.PI * 0.9
    ctx.save(); ctx.translate(-18, -52); ctx.rotate(a + Math.PI / 2 - 0.1)
    const L = 120 + (i % 2) * 14
    ctx.fillStyle = i % 2 ? '#0E7A57' : '#0b6b5c'
    ctx.beginPath(); ctx.ellipse(0, -L * 0.55, 13, L * 0.6, 0, 0, 7); ctx.fill()
    ctx.fillStyle = C.gold; ctx.beginPath(); ctx.ellipse(0, -L * 1.05, 10, 14, 0, 0, 7); ctx.fill()
    ctx.fillStyle = C.teal; ctx.beginPath(); ctx.ellipse(0, -L * 1.05, 6.5, 9.5, 0, 0, 7); ctx.fill()
    ctx.fillStyle = C.indigo; ctx.beginPath(); ctx.ellipse(0, -L * 1.05, 3, 4.6, 0, 0, 7); ctx.fill()
    ctx.restore()
  }
  // legs
  ctx.strokeStyle = '#5a4630'; ctx.lineWidth = 5
  ctx.beginPath(); ctx.moveTo(-4, -22); ctx.lineTo(-6, 0); ctx.moveTo(10, -22); ctx.lineTo(12, 0); ctx.stroke()
  // body
  ctx.fillStyle = '#0D8E9B'; ctx.beginPath(); ctx.ellipse(0, -50, 40, 28, -0.3, 0, 7); ctx.fill()
  ctx.strokeStyle = '#0D8E9B'; ctx.lineWidth = 15; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(24, -60); ctx.quadraticCurveTo(46, -84, 40, -118); ctx.stroke()
  ctx.fillStyle = '#0a6f80'; ctx.beginPath(); ctx.arc(42, -124, 11, 0, 7); ctx.fill()
  noShadow(ctx)
  ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(52, -126); ctx.lineTo(64, -121); ctx.lineTo(52, -118); ctx.fill()
  ctx.strokeStyle = C.indigo; ctx.lineWidth = 2
  for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(41, -134); ctx.lineTo(39 + i * 9, -150); ctx.stroke(); ctx.fillStyle = C.teal; ctx.beginPath(); ctx.arc(39 + i * 9, -151, 3, 0, 7); ctx.fill() }
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(45, -126, 2.5, 0, 7); ctx.fill()
  ctx.restore()
}

function drawStreet(W, H, q) {
  const { cv, ctx, Wl, c } = base(W, H, q)
  const gy = 880
  const s = Math.min(Wl / 2, 760)
  // side buildings framing the lane
  paper(ctx, 1.4)
  for (const side of [-1, 1]) {
    const bx = c + side * (s * 0.86)
    ctx.fillStyle = side < 0 ? '#E0397F' : '#0D8E9B'
    ctx.fillRect(bx - (side < 0 ? 380 : 0), 360, 380, gy - 360)
    noShadow(ctx)
    const ox = bx - (side < 0 ? 380 : 0)
    ctx.fillStyle = C.gold; ctx.fillRect(ox, 360, 380, 14)
    kangura(ctx, ox, ox + 380, 360, 16, side < 0 ? '#E0397F' : '#0D8E9B')
    for (let i = 0; i < 2; i++) jharokha(ctx, ox + 100 + i * 180, 640, 100, 160, '#F2C98A', '#2a1260', C.gold)
    paper(ctx, 1.4)
    chhatri(ctx, ox + (side < 0 ? 340 : 40), 360, 80, '#F2C98A', C.gold)
  }
  noShadow(ctx)
  // ground strip
  paper(ctx, 1.4)
  ctx.fillStyle = '#c0392b'; ctx.fillRect(0, gy, Wl, 200)
  noShadow(ctx)
  ctx.fillStyle = C.gold; ctx.fillRect(0, gy, Wl, 8)
  // rangoli on ground
  ctx.save(); ctx.translate(c, gy + 60); ctx.scale(1, 0.22)
  for (let i = 0; i < 5; i++) { ctx.strokeStyle = ['#FFF6E5', '#F7A614', '#D81B76', '#0D8E9B', '#FFF6E5'][i]; ctx.lineWidth = 6; ctx.setLineDash([3, 12]); ctx.beginPath(); ctx.arc(0, 0, 120 - i * 20, 0, 7); ctx.stroke() }
  ctx.restore(); ctx.setLineDash([])
  // elephant left, peacocks right
  drawElephant(ctx, c - s * 0.5, gy + 30, Math.min(1.05, s / 820 + 0.45), false)
  drawPeacock(ctx, c + s * 0.42, gy + 40, 1.5, true)
  drawPeacock(ctx, c + s * 0.64, gy + 40, 1.2, true)
  return cv
}

/* ---------- LAYER 5: STALLS ---------- */
function sack(ctx, x, y, w, h, col, spice) {
  paper(ctx, 0.6)
  // spice mound
  ctx.fillStyle = spice
  ctx.beginPath(); ctx.moveTo(x - w * 0.46, y - h * 0.86); ctx.quadraticCurveTo(x, y - h * 1.45, x + w * 0.46, y - h * 0.86); ctx.fill()
  ctx.fillStyle = col
  ctx.beginPath(); ctx.moveTo(x - w * 0.5, y); ctx.quadraticCurveTo(x - w * 0.62, y - h * 0.5, x - w * 0.46, y - h * 0.9)
  ctx.lineTo(x + w * 0.46, y - h * 0.9); ctx.quadraticCurveTo(x + w * 0.62, y - h * 0.5, x + w * 0.5, y); ctx.closePath(); ctx.fill()
  noShadow(ctx)
  ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(x - w * 0.48, y - h * 0.94, w * 0.96, h * 0.1)
  ctx.fillStyle = 'rgba(255,246,229,.9)'
  star8(ctx, x, y - h * 0.45, w * 0.17, ctx.fillStyle)
}

function drawStalls(W, H, q) {
  const { cv, ctx, Wl, c } = base(W, H, q)
  const gy = 960
  const s = Math.min(Wl / 2, 760)
  const spices = ['#C0392B', '#E3A21A', '#7A9A3A', '#6B3A1E', '#B3261E', '#D8A94A']
  const awn = [C.vermilion, C.emerald, C.rani, C.teal, C.marigold]
  const stallXs = [-0.95, -0.52, 0.52, 0.95]
  stallXs.forEach((f, si) => {
    const x = c + f * s, w = 300
    paper(ctx, 1.2)
    // posts
    ctx.fillStyle = '#6b3b1d'
    ctx.fillRect(x - w / 2, 560, 14, gy - 560); ctx.fillRect(x + w / 2 - 14, 560, 14, gy - 560)
    // counter
    ctx.fillStyle = '#8b4a23'; ctx.fillRect(x - w / 2, gy - 150, w, 150)
    noShadow(ctx)
    ctx.fillStyle = C.gold; ctx.fillRect(x - w / 2, gy - 156, w, 10)
    jaaliPattern(ctx, x - w / 2 + 10, gy - 140, w - 20, 120, 'rgba(255,200,90,.35)')
    // awning with scallops
    paper(ctx, 1.2)
    ctx.fillStyle = awn[si % awn.length]
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 30, 560); ctx.lineTo(x + w / 2 + 30, 560); ctx.lineTo(x + w / 2 + 50, 640)
    const n = 8
    for (let i = 0; i < n; i++) ctx.arc(x + w / 2 + 50 - ((i + 0.5) * (w + 100)) / n, 640, (w + 100) / n / 2, 0, Math.PI)
    ctx.closePath(); ctx.fill()
    noShadow(ctx)
    ctx.fillStyle = 'rgba(255,246,229,.85)'
    for (let i = 0; i < n; i += 2) ctx.fillRect(x - w / 2 - 30 + (i * (w + 100)) / n + 8, 562, (w + 100) / n - 8, 78)
    // sacks on the counter
    for (let i = 0; i < 3; i++) sack(ctx, x - w / 2 + 62 + i * 88, gy - 150, 76, 82, ['#d9b26f', '#c8a05a', '#e0c08a'][i], spices[(si * 3 + i) % spices.length])
    // brass scale hanging
    ctx.strokeStyle = C.gold; ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(x, 640); ctx.lineTo(x, 700); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(x - 36, 704); ctx.lineTo(x + 36, 704); ctx.stroke()
    ctx.fillStyle = C.gold
    for (const dx of [-36, 36]) { ctx.beginPath(); ctx.arc(dx + x, 724, 15, 0, Math.PI); ctx.fill() }
  })
  // sacks on ground in the middle band
  const gsack = [[-0.2, 0], [0.12, 1], [-0.32, 2], [0.28, 3]]
  gsack.forEach(([f, i]) => sack(ctx, c + f * s, gy + 10, 120, 120, '#d9b26f', spices[(i * 2 + 1) % spices.length]))
  return cv
}

/* ---------- LAYER 6: LANTERNS & BUNTING ---------- */
function drawLanterns(W, H, q) {
  const { cv, ctx, Wl, c } = base(W, H, q)
  const s = Math.min(Wl / 2, 760)
  bunting(ctx, -30, 80, Wl + 30, 110, 120, 54, [C.rani, C.marigold, C.teal, C.vermilion, C.emerald])
  bunting(ctx, -30, 230, Wl + 30, 200, 90, 40, [C.marigold, C.rani, C.ivory, C.teal])
  for (const sp of lanternSpots(Wl)) {
    paper(ctx, 0.5)
    // string up to top
    ctx.strokeStyle = 'rgba(255,230,180,.8)'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(sp.x, 0); ctx.lineTo(sp.x, sp.y - 60); ctx.stroke()
    lantern(ctx, sp.x, sp.y, 52, sp.col)
  }
  // marigold garlands falling at sides
  paper(ctx, 0.5)
  for (const side of [-1, 1]) {
    marigoldString(ctx, c + side * s * 0.92, 0, c + side * s * 0.88, 640, 0, 17)
    marigoldString(ctx, c + side * s * 0.78, 0, c + side * s * 0.74, 520, 0, 14)
  }
  return cv
}

/* ---------- LAYER 7: FOREGROUND FRAME ---------- */
function drawFrame(W, H, q) {
  const { cv, ctx, Wl, c } = base(W, H, q)
  const s = Math.min(Wl / 2, 850)
  const openW = Math.min(Wl * 0.8, 1500)
  paper(ctx, 2)
  ctx.fillStyle = C.indigo
  ctx.fillRect(0, 0, Wl, 1000)
  noShadow(ctx)
  // opening with scalloped arch
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  const ox = c - openW / 2, oy = 960
  ctx.moveTo(ox, oy); ctx.lineTo(ox, 400)
  ctx.bezierCurveTo(ox, 160, c - openW * 0.2, 130, c, 20)
  ctx.bezierCurveTo(c + openW * 0.2, 130, c + openW / 2, 160, c + openW / 2, 400)
  ctx.lineTo(c + openW / 2, oy); ctx.closePath(); ctx.fill()
  ctx.globalCompositeOperation = 'source-over'
  // gold trim line following the arch
  ctx.strokeStyle = C.gold; ctx.lineWidth = 8
  ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, 400)
  ctx.bezierCurveTo(ox, 160, c - openW * 0.2, 130, c, 20)
  ctx.bezierCurveTo(c + openW * 0.2, 130, c + openW / 2, 160, c + openW / 2, 400)
  ctx.lineTo(c + openW / 2, oy); ctx.stroke()
  ctx.strokeStyle = C.marigold; ctx.lineWidth = 3; ctx.setLineDash([2, 10])
  ctx.stroke(); ctx.setLineDash([])
  // lattice on pillars
  jaaliPattern(ctx, 0, 0, ox - 12, 1000, 'rgba(212,160,23,.45)')
  jaaliPattern(ctx, c + openW / 2 + 12, 0, Wl - (c + openW / 2) - 12, 1000, 'rgba(212,160,23,.45)')
  // marigold swags on the arch
  marigoldString(ctx, ox + 20, 400, c, 60, 60, 13)
  marigoldString(ctx, c, 60, c + openW / 2 - 20, 400, 60, 13)
  // bottom base
  ctx.fillStyle = C.night; ctx.fillRect(0, 960, Wl, 40)
  return cv
}

/* ---------- INTERIOR (seen through the door) ---------- */
export function drawInterior(w = 1024, h = 1024) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h
  const ctx = cv.getContext('2d'); ctx.scale(w / 1000, h / 1000)
  const g = ctx.createLinearGradient(0, 0, 0, 1000)
  g.addColorStop(0, '#3b1255'); g.addColorStop(1, '#8a2150')
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1000, 1000)
  // wall pattern
  jaaliPattern(ctx, 0, 0, 1000, 1000, 'rgba(255,200,90,.1)')
  // glow
  const rg = ctx.createRadialGradient(500, 420, 20, 500, 420, 560)
  rg.addColorStop(0, 'rgba(255,200,90,.65)'); rg.addColorStop(1, 'rgba(255,200,90,0)')
  ctx.fillStyle = rg; ctx.fillRect(0, 0, 1000, 1000)
  // shelves
  const spices = ['#C0392B', '#E3A21A', '#7A9A3A', '#6B3A1E', '#B3261E', '#D8A94A', '#2B2420', '#C8461E']
  const r = rnd(21)
  for (let row = 0; row < 3; row++) {
    const y = 300 + row * 190
    ctx.fillStyle = '#5a2b12'; ctx.fillRect(40, y, 920, 18)
    ctx.fillStyle = C.gold; ctx.fillRect(40, y + 18, 920, 4)
    for (let i = 0; i < 9; i++) {
      const x = 80 + i * 98, h = 90 + r() * 20
      const col = spices[(i + row * 3) % spices.length]
      ctx.fillStyle = col
      ctx.beginPath(); ctx.roundRect(x, y - h, 66, h, 10); ctx.fill()
      ctx.fillStyle = C.gold; ctx.fillRect(x + 8, y - h - 12, 50, 14)
      ctx.fillStyle = C.ivory; ctx.beginPath(); ctx.roundRect(x + 10, y - h * 0.7, 46, h * 0.38, 4); ctx.fill()
      ctx.fillStyle = col; star8(ctx, x + 33, y - h * 0.5, 8, col)
    }
  }
  // hanging chillies strings
  for (const x of [120, 880]) {
    ctx.strokeStyle = '#3a1a0a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x, 320); ctx.stroke()
    for (let i = 0; i < 10; i++) { ctx.fillStyle = i % 3 ? '#C0261b' : '#E04a1b'; ctx.beginPath(); ctx.ellipse(x + (i % 2 ? 9 : -9), 60 + i * 26, 7, 17, i % 2 ? 0.3 : -0.3, 0, 7); ctx.fill() }
  }
  // hanging lamp
  ctx.strokeStyle = C.gold; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(500, 0); ctx.lineTo(500, 110); ctx.stroke()
  lantern(ctx, 500, 160, 54, '#FFC857')
  // counter
  ctx.fillStyle = '#6a2f10'; ctx.fillRect(0, 880, 1000, 120)
  ctx.fillStyle = C.gold; ctx.fillRect(0, 872, 1000, 12)
  // scale on counter
  ctx.strokeStyle = C.gold; ctx.lineWidth = 6
  ctx.beginPath(); ctx.moveTo(500, 880); ctx.lineTo(500, 770); ctx.moveTo(420, 780); ctx.lineTo(580, 780); ctx.stroke()
  ctx.fillStyle = C.gold; for (const x of [420, 580]) { ctx.beginPath(); ctx.arc(x, 820, 36, 0, Math.PI); ctx.fill() }
  // rangoli floor
  ctx.save(); ctx.translate(500, 940); ctx.scale(1, 0.3)
  for (let i = 0; i < 6; i++) { ctx.fillStyle = ['#FFF6E5', '#F7A614', '#D81B76', '#0D8E9B', '#FFF6E5', '#D9381E'][i]; ctx.beginPath(); ctx.arc(0, 0, 220 - i * 32, 0, 7); ctx.fill() }
  ctx.restore()
  return cv
}

const FN = { sky: drawSky, hills: drawHills, city: drawCity, facade: drawFacade, street: drawStreet, stalls: drawStalls, lanterns: drawLanterns, frame: drawFrame }
export function buildLayer(index, aspect, H) {
  const l = LAYERS[index]
  return { ...l, canvas: FN[l.id](Math.round(H * aspect), H, 1), aspect }
}
