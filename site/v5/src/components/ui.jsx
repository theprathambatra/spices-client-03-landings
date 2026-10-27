import { useEffect, useRef, useState } from 'react'
import { useInView, reduced } from '../lib/util'

export { useCart } from '../store/cart'

const GLYPHS = 'ABCDEFGHJKLMNPRSTUVXYZ0123456789#%/<>+'
export function Scramble({ text, as: Tag = 'span', trigger = 'view', duration = 520, className = '', delay = 0, ...rest }) {
  const [ref, inView] = useInView({ rootMargin: '0px 0px -8% 0px' }, true)
  const [out, setOut] = useState(text)
  const raf = useRef(0)
  const run = () => {
    if (reduced()) return setOut(text)
    cancelAnimationFrame(raf.current)
    const t0 = performance.now() + delay
    const tick = (now) => {
      const p = Math.min(1, Math.max(0, (now - t0) / duration))
      let s = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        s += ch === ' ' || ch === '\n' ? ch : p * text.length > i + 0.5 ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      setOut(p < 1 ? s : text)
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }
  useEffect(() => { if (trigger === 'key') run(); return () => cancelAnimationFrame(raf.current) }, [text]) // eslint-disable-line
  useEffect(() => { if (trigger === 'view' && inView) run() }, [inView]) // eslint-disable-line
  return (
    <Tag ref={ref} className={className} aria-label={text} onMouseEnter={trigger === 'hover' ? run : undefined} {...rest}>
      <span aria-hidden="true">{out}</span>
    </Tag>
  )
}

export function CountUp({ to, decimals = 0, dur = 1100, prefix = '', suffix = '' }) {
  const [ref, inView] = useInView({}, true)
  const [v, setV] = useState(reduced() ? to : 0)
  useEffect(() => {
    if (!inView || reduced()) { if (reduced()) setV(to); return }
    let raf; const t0 = performance.now(), from = 0
    const tick = (n) => { const p = Math.min(1, (n - t0) / dur); setV(from + (to - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, dur])
  return <span ref={ref}>{prefix}{v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>
}

export function Magnetic({ children, strength = 0.28, className = '' }) {
  const ref = useRef(null)
  const onMove = (e) => {
    if (reduced()) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`
  }
  const onLeave = () => { ref.current.style.transform = '' }
  return <span ref={ref} className={'mag ' + className} onMouseMove={onMove} onMouseLeave={onLeave}>{children}</span>
}

export function Cursor() {
  const ref = useRef(null)
  const lab = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const move = (e) => {
      ref.current.style.opacity = 1
      ref.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      lab.current.textContent = `${String(Math.round(e.clientX)).padStart(4, '0')}:${String(Math.round(e.clientY)).padStart(4, '0')}`
      const hot = e.target.closest?.('a,button,input,select,label,[data-hot]')
      ref.current.classList.toggle('hot', !!hot)
    }
    window.addEventListener('pointermove', move)
    return () => { window.removeEventListener('pointermove', move); document.documentElement.classList.remove('has-cursor') }
  }, [])
  return (
    <div className="cursor" ref={ref} aria-hidden="true" style={{ opacity: 0 }}>
      <i className="cx h" /><i className="cx v" /><i className="cring" />
      <b ref={lab} className="clab">0000:0000</b>
    </div>
  )
}

function lines(name) {
  const out = []; let cur = ''
  for (const w of name.split(' ')) { if ((cur + ' ' + w).trim().length > 12 && cur) { out.push(cur); cur = w } else cur = (cur + ' ' + w).trim() }
  out.push(cur); return out.slice(0, 3)
}
// stand-up pouch drawn in SVG
export function Pack({ p, w = 120, className = '' }) {
  const id = 'g' + p.id
  return (
    <svg className={'pack ' + className} viewBox="0 0 120 160" width={w} role="img" aria-label={p.name + ' pouch'}>
      <defs>
        <linearGradient id={id} x1="0" x2="1"><stop offset="0" stopColor="#000" stopOpacity=".28" /><stop offset=".35" stopColor="#fff" stopOpacity=".18" /><stop offset="1" stopColor="#000" stopOpacity=".3" /></linearGradient>
      </defs>
      <path d="M14 14 L106 14 L110 150 Q60 158 10 150 Z" fill={p.color} />
      <path d="M14 14 L106 14 L110 150 Q60 158 10 150 Z" fill={`url(#${id})`} />
      <path d="M14 14 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 H14Z" fill={p.color} opacity=".7" />
      <rect x="22" y="44" width="76" height="82" fill="#EEF0EA" />
      <rect x="22" y="44" width="76" height="8" fill="#0F1113" />
      <text x="28" y="49.6" fontSize="5" fill="#C6FF3D" fontFamily="JetBrains Mono" fontWeight="700">KESARI/LAB</text>
      {lines(p.name).map((l, i) => <text key={i} x="28" y={68 + i * 11} fontSize="9.6" fill="#0F1113" fontFamily="Space Grotesk" fontWeight="700">{l}</text>)}
      <text x="28" y="104" fontSize="5.4" fill="#6B7177" fontFamily="JetBrains Mono">{p.origin.toUpperCase().slice(0, 18)}</text>
      <text x="28" y="112" fontSize="5.4" fill="#6B7177" fontFamily="JetBrains Mono">{p.sku} · {p.wt}</text>
      <rect x="28" y="116" width="64" height="3" fill={p.color} />
    </svg>
  )
}

export function Radar({ series, size = 280, labels, scale = 10 }) {
  const n = labels.length, c = size / 2, R = size / 2 - 38
  const pt = (i, v) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return [c + Math.cos(a) * R * (v / scale), c + Math.sin(a) * R * (v / scale)] }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="radar" role="img" aria-label="Flavour radar chart">
      {[0.2, 0.4, 0.6, 0.8, 1].map((k) => (
        <polygon key={k} points={labels.map((_, i) => pt(i, k * scale).join(',')).join(' ')} fill="none" stroke="currentColor" strokeOpacity={k === 1 ? 0.5 : 0.18} strokeWidth="1" />
      ))}
      {labels.map((l, i) => {
        const [x, y] = pt(i, scale), [lx, ly] = pt(i, scale * 1.2)
        return <g key={l}><line x1={c} y1={c} x2={x} y2={y} stroke="currentColor" strokeOpacity=".18" /><text x={lx} y={ly} fontSize="9.5" textAnchor="middle" dominantBaseline="middle" fontFamily="JetBrains Mono" fill="currentColor">{l.toUpperCase()}</text></g>
      })}
      {series.map((s, k) => (
        <g key={s.id || k}>
          <polygon points={s.values.map((v, i) => pt(i, v).join(',')).join(' ')} fill={s.color} fillOpacity=".22" stroke={s.color} strokeWidth="2" style={{ transition: 'all .4s cubic-bezier(.2,.7,.2,1)' }} />
          {s.values.map((v, i) => { const [x, y] = pt(i, v); return <rect key={i} x={x - 2.5} y={y - 2.5} width="5" height="5" fill={s.color} /> })}
        </g>
      ))}
    </svg>
  )
}
