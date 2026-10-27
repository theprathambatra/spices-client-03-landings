import { useEffect, useRef, useState } from 'react'

export const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
export const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const inr = (n) => '₹' + n.toLocaleString('en-IN')

export function useInView(opts = { rootMargin: '0px' }, once = false) {
  const ref = useRef(null)
  const [inView, set] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      set(e.isIntersecting)
      if (e.isIntersecting && once) io.disconnect()
    }, opts)
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line
  }, [])
  return [ref, inView]
}
