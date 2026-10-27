import { useEffect, useRef, useState } from 'react'

export function useInView(opts = { rootMargin: '0px 0px -8% 0px' }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, opts)
    io.observe(el)
    return () => io.disconnect()
  }, [seen]) // eslint-disable-line
  return [ref, seen]
}

// slap = sticker rotation slam, rise = springy rise
export function Reveal({ as: Tag = 'div', kind = 'rise', rot, i = 0, className = '', style, children, ...rest }) {
  const [ref, seen] = useInView()
  const st = { ...style, ...(rot !== undefined ? { '--r': rot + 'deg' } : {}), '--i': i }
  return <Tag ref={ref} className={`${kind} ${seen ? 'in' : ''} ${className}`} style={st} {...rest}>{children}</Tag>
}

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const supportsWebGL = () => {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch { return false }
}

export function Marquee({ children, className = '', rev = false, dur, accessible = false }) {
  return (
    <div className={`marquee ${rev ? 'rev' : ''} ${className}`} style={dur ? { '--dur': dur + 's' } : undefined} aria-hidden={accessible ? undefined : true}>
      <div className="marquee-track">{children}</div>
      <div className="marquee-track" aria-hidden="true">{children}</div>
    </div>
  )
}

import { Component } from 'react'
// keeps the page shoppable if WebGL is unavailable
export class Boundary extends Component {
  state = { bad: false }
  static getDerivedStateFromError() { return { bad: true } }
  componentDidCatch(e) { console.warn('3D disabled:', e?.message); this.props.onError?.() }
  render() { return this.state.bad ? (this.props.fallback ?? null) : this.props.children }
}
