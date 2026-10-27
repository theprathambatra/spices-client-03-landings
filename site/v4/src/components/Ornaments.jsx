import { useRef, useEffect, useId } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

let moIO
const watch = (el) => {
  if (!moIO) moIO = new IntersectionObserver((es) => es.forEach((e) => { e.target.style.animationPlayState = e.isIntersecting ? 'running' : 'paused' }), { rootMargin: '50px' })
  moIO.observe(el); return () => moIO.unobserve(el)
}
export function Mandala({ className = '', size = 520, spin = 90, petals = 16, colors = ['#D4A017', '#D81B76', '#0D8E9B'] }) {
  const ref = useRef(null)
  useEffect(() => (ref.current ? watch(ref.current) : undefined), [])
  const rings = []
  const mk = (n, r, len, w, col, key, op = 1) => {
    for (let i = 0; i < n; i++) {
      rings.push(<ellipse key={key + i} cx="0" cy={-r} rx={w} ry={len} fill={col} opacity={op} transform={`rotate(${(i / n) * 360})`} />)
    }
  }
  mk(petals * 2, 232, 26, 8, colors[2], 'a', 0.9)
  mk(petals, 196, 50, 16, colors[1], 'b', 0.85)
  mk(petals, 150, 38, 12, colors[0], 'c', 0.9)
  mk(petals / 2, 100, 40, 14, colors[1], 'd', 0.8)
  mk(petals, 70, 18, 7, colors[0], 'e', 1)
  return (
    <svg ref={ref} className={'mandala ' + className} width={size} height={size} viewBox="-260 -260 520 520" aria-hidden="true" style={spin ? { animationDuration: spin + 's' } : { animation: 'none' }}>
      <circle r="255" fill="none" stroke={colors[0]} strokeWidth="1.2" strokeDasharray="2 7" />
      <circle r="246" fill="none" stroke={colors[0]} strokeWidth="2" opacity=".7" />
      {rings}
      <circle r="38" fill={colors[0]} />
      <circle r="26" fill="none" stroke="#1E1B5E" strokeWidth="3" />
      <circle r="10" fill="#D81B76" />
    </svg>
  )
}

// Self-drawing pattern border. kind: 'vine' | 'scallop' | 'diamond'
export function PatternBorder({ kind = 'scallop', color = '#D4A017', color2 = '#D81B76', className = '', flip = false }) {
  const ref = useRef(null)
  const id = useId()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const paths = el.querySelectorAll('.draw')
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { gsap.set(paths, { strokeDashoffset: 0 }); return }
    const ctx = gsap.context(() => {
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 })
      gsap.to(paths, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', stagger: 0.25, scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
      gsap.from(el.querySelectorAll('.pop'), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.02, delay: 0.5, ease: 'back.out(2)', scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
    }, el)
    return () => ctx.revert()
  }, [])
  const N = 40, S = 40
  let d1 = '', d2 = '', dots = []
  if (kind === 'scallop') {
    for (let i = 0; i < N; i++) { const x = i * S; d1 += `M${x},30 a20,20 0 0 1 ${S},0 `; d2 += `M${x + 8},30 a12,12 0 0 1 ${S - 16},0 ` ; dots.push(<circle key={i} className="pop" cx={x + 20} cy={14} r="3" fill={color2} />) }
    d1 += `M0,30 H${N * S}`
  } else if (kind === 'diamond') {
    d1 = `M0,20 H${N * S} M0,40 H${N * S}`
    for (let i = 0; i < N; i++) { const x = i * S; d2 += `M${x},30 l20,-14 l20,14 l-20,14 z `; dots.push(<circle key={i} className="pop" cx={x + 20} cy={30} r="3.4" fill={color2} />) }
  } else {
    for (let i = 0; i < N; i++) { const x = i * S; d1 += `M${x},30 c10,-26 22,26 ${S / 2},0 s10,-26 ${S / 2},0 `; d2 += `M${x + 10},30 c4,-12 14,-12 10,-2 `; dots.push(<circle key={i} className="pop" cx={x + 20} cy={14} r="3.2" fill={color2} />) }
  }
  return (
    <div ref={ref} className={'pborder ' + className} aria-hidden="true">
      <svg viewBox={`0 0 ${N * S} 60`} preserveAspectRatio="xMidYMid slice" style={flip ? { transform: 'scaleY(-1)' } : null}>
        <path className="draw" pathLength="1" d={d1} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
        <path className="draw" pathLength="1" d={d2} fill="none" stroke={color2} strokeWidth="2" strokeLinecap="round" />
        {dots}
      </svg>
    </div>
  )
}

export function Lotus({ size = 28, color = '#D4A017' }) {
  return (
    <svg width={size} height={size} viewBox="-20 -20 40 40" aria-hidden="true">
      {[-60, -30, 0, 30, 60].map((a) => <ellipse key={a} cx="0" cy="-9" rx="5" ry="11" fill={color} opacity={a === 0 ? 1 : 0.75} transform={`rotate(${a})`} />)}
      <circle r="4" fill="#D81B76" />
    </svg>
  )
}

export function Stars({ value = 5, size = 14 }) {
  return (
    <span className="stars" aria-label={`${value} out of 5`} style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((i) => <span key={i} className={i <= Math.round(value) ? 'on' : ''}>★</span>)}
    </span>
  )
}

export function SectionHead({ eyebrow, title, children, hi, light, align = 'center' }) {
  return (
    <header className={'sechead ' + (light ? 'light ' : '') + align}>
      <div className="sechead-mandala"><Mandala size={420} spin={0} colors={light ? ['#F7A614', '#D81B76', '#0D8E9B'] : ['#D4A017', '#D81B76', '#0D8E9B']} /></div>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {hi && <p className="hi" lang="hi">{hi}</p>}
      {children && <p className="lead">{children}</p>}
    </header>
  )
}
