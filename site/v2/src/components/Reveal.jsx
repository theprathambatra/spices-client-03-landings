import { useEffect, useRef, useState } from 'react'
import { reducedMotion } from '../store'

export function Reveal({ as: T = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef()
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (reducedMotion()) { setOn(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return <T ref={ref} className={`rv ${on ? 'in' : ''} ${className}`} style={{ '--d': delay + 's' }} {...rest}>{children}</T>
}

export function CountUp({ to, dur = 1800, prefix = '', suffix = '', dec = 0 }) {
  const ref = useRef()
  const fmt = (v) => prefix + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-IN')) + suffix
  useEffect(() => {
    if (reducedMotion()) { ref.current.textContent = fmt(to); return }
    ref.current.textContent = fmt(0)
    let raf
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (t) => { const k = Math.min(1, (t - t0) / dur); ref.current.textContent = fmt(to * (1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(tick) }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(ref.current)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to, dur])
  return <span ref={ref}>{fmt(to)}</span>
}
