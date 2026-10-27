import { useEffect, useRef, useState } from 'react'
import { reducedMotion } from '../store'

// 2D "spice bloom": seeds pop out of hot oil with sparks and steam whenever the card enters view / is hovered
export default function Sizzle({ colors }) {
  const box = useRef()
  const [on, setOn] = useState(false)
  const [shot, setShot] = useState(0)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setShot((n) => n + 1), 350); io.disconnect() } }, { threshold: 0.6 })
    io.observe(box.current)
    return () => io.disconnect()
  }, [])
  useEffect(() => { if (!shot) return; setOn(true); const t = setTimeout(() => setOn(false), 2600); return () => clearTimeout(t) }, [shot])
  return <div ref={box} className="sizzle" onMouseEnter={() => setShot((n) => n + 1)}>{on && <SizzleCanvas key={shot} colors={colors} />}</div>
}

function SizzleCanvas({ colors }) {
  const ref = useRef()
  const fire = useRef(() => {})
  useEffect(() => {
    const cv = ref.current, g = cv.getContext('2d')
    let parts = [], raf, last = 0, running = false
    const size = () => { const r = cv.getBoundingClientRect(); const d = Math.min(devicePixelRatio, 2); cv.width = r.width * d; cv.height = r.height * d; g.setTransform(d, 0, 0, d, 0, 0) }
    size()
    const tick = (t) => {
      const dt = Math.min(0.04, (t - last) / 1000 || 0.016); last = t
      const r = cv.getBoundingClientRect()
      g.clearRect(0, 0, r.width, r.height)
      parts = parts.filter((p) => p.life > 0)
      for (const p of parts) {
        p.life -= dt; p.vy += p.gy * dt; p.x += p.vx * dt; p.y += p.vy * dt
        const a = Math.max(0, Math.min(1, p.life / p.max))
        g.globalAlpha = p.kind === 'steam' ? a * 0.2 : a
        g.fillStyle = p.c
        g.beginPath()
        if (p.kind === 'seed') g.ellipse(p.x, p.y, p.r * 1.4, p.r, p.vx * 0.01, 0, 6.283)
        else g.arc(p.x, p.y, p.kind === 'steam' ? p.r * (2 - a) : p.r, 0, 6.283)
        g.fill()
      }
      g.globalAlpha = 1
      if (parts.length) raf = requestAnimationFrame(tick); else running = false
    }
    fire.current = () => {
      if (reducedMotion()) return
      const r = cv.getBoundingClientRect(), ox = r.width * 0.72, oy = r.height * 0.7
      for (let i = 0; i < 56; i++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.9, v = 140 + Math.random() * 260; parts.push({ kind: 'seed', x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, gy: 520, r: 3 + Math.random() * 3, c: colors[i % 2], life: 1.5 + Math.random() * 0.7, max: 1.8 }) }
      for (let i = 0; i < 26; i++) { const a = Math.random() * 6.283, v = 30 + Math.random() * 120; parts.push({ kind: 'spark', x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, gy: 260, r: 1 + Math.random() * 1.4, c: colors[2], life: 0.5 + Math.random() * 0.6, max: 1 }) }
      for (let i = 0; i < 7; i++) parts.push({ kind: 'steam', x: ox + (Math.random() - 0.5) * 30, y: oy - 6, vx: (Math.random() - 0.5) * 14, vy: -26 - Math.random() * 26, gy: -4, r: 14 + Math.random() * 10, c: '#b88a5a', life: 2.2, max: 2.2 })
      if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(tick) }
    }
    fire.current()
    const ro = new ResizeObserver(size); ro.observe(cv)
    return () => { ro.disconnect(); cancelAnimationFrame(raf) }
  }, [colors])
  return <canvas ref={ref} style={{ width: '100%', height: '100%' }} aria-hidden="true" />
}
