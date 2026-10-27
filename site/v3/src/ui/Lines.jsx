import { useEffect, useRef } from 'react'

// Masked line reveal: each line slides up out of a clipped slot, slowly.
export function useIn(ref, { threshold = 0.25, once = true, force = false } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (force) { el.classList.add('in'); return }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { el.classList.add('in'); if (once) io.disconnect() }
        else if (!once) el.classList.remove('in')
      },
      { threshold, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, once, force])
}

export function Lines({ lines, as: Tag = 'h2', className = '', force = false, delay = 0, threshold }) {
  const ref = useRef(null)
  useIn(ref, { force, threshold })
  return (
    <Tag ref={ref} className={`lines ${className}`} style={{ '--d': `${delay}s` }}>
      {lines.map((l, i) => (
        <span className="ml" key={i}>
          <span style={{ '--i': i }}>{l}</span>
        </span>
      ))}
    </Tag>
  )
}

// slow fade-rise for blocks
export function Rise({ children, as: Tag = 'div', className = '', delay = 0, ...rest }) {
  const ref = useRef(null)
  useIn(ref, { threshold: 0.15 })
  return (
    <Tag ref={ref} className={`rise ${className}`} style={{ '--d': `${delay}s` }} {...rest}>
      {children}
    </Tag>
  )
}
