// Marigold petal burst on a fixed 2D canvas overlay (no WebGL context used).
let canvas, ctx, parts = [], raf = 0, last = 0
const COLORS = ['#F7A614', '#FFB627', '#FF8C1A', '#E8590C', '#FFD166', '#D81B76']

function ensure() {
  if (canvas) return
  canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, { position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 120 })
  document.body.appendChild(canvas)
  ctx = canvas.getContext('2d')
  const fit = () => { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio }
  fit(); addEventListener('resize', fit)
}

function tick(t) {
  const dt = Math.min(0.033, (t - last) / 1000 || 0.016); last = t
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
  ctx.clearRect(0, 0, innerWidth, innerHeight)
  parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40)
  for (const p of parts) {
    p.life -= dt
    p.vy += 620 * dt; p.vx *= 1 - 1.4 * dt; p.vy *= 1 - 0.9 * dt
    p.x += p.vx * dt + Math.sin(p.life * 6 + p.ph) * 24 * dt
    p.y += p.vy * dt
    p.rot += p.vr * dt
    ctx.save()
    ctx.translate(p.x, p.y); ctx.rotate(p.rot)
    ctx.scale(1, Math.abs(Math.cos(p.life * 5 + p.ph)) * 0.6 + 0.4)
    ctx.globalAlpha = Math.min(1, p.life * 2)
    ctx.fillStyle = p.c
    ctx.beginPath()
    ctx.moveTo(0, -p.s)
    ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.5, p.s * 0.7, p.s * 0.8, 0, p.s)
    ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.8, -p.s * 0.9, -p.s * 0.5, 0, -p.s)
    ctx.fill()
    ctx.restore()
  }
  if (parts.length) raf = requestAnimationFrame(tick)
  else { raf = 0; ctx.clearRect(0, 0, innerWidth, innerHeight) }
}

export function petalBurst(x, y, n = 44) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) n = 8
  ensure()
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, sp = 140 + Math.random() * 420
    parts.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 260, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 12,
      s: 5 + Math.random() * 7, life: 1.4 + Math.random() * 1.2, c: COLORS[(Math.random() * COLORS.length) | 0], ph: Math.random() * 6,
    })
  }
  if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick) }
}
