// Source: kit-local hooks replacing registry helpers — useOutsideClick (repos/aceternity-ui/use-outside-click.tsx), useClickOutside (repos/motion-primitives/hooks/useClickOutside.tsx), useMeasure (stand-in for react-use-measure) | License: MIT / Aceternity free licence (see sources)
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/** Calls `handler(event)` on mousedown/touchstart outside `ref.current`. */
export function useOutsideClick(ref, handler) {
  const saved = useRef(handler)
  saved.current = handler
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return
      saved.current(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref])
}

/**
 * Returns [ref, { width, height }] tracked with ResizeObserver (border-box), like react-use-measure.
 * `ref` is a CALLBACK ref on purpose: components such as SlidingNumber swap the measured element
 * (span -> motion.span) after the first measurement, and the new node must be observed in its place.
 * Readings from a detached node (0x0) are ignored so the swap cannot reset bounds.
 */
export function useMeasure() {
  const [el, setEl] = useState(null)
  const [bounds, setBounds] = useState({ width: 0, height: 0 })
  useLayoutEffect(() => {
    if (!el) return
    const update = () => {
      if (!el.isConnected) return
      const r = el.getBoundingClientRect()
      setBounds((b) => (b.width === r.width && b.height === r.height ? b : { width: r.width, height: r.height }))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [el])
  return [setEl, bounds]
}

/** True when the user asked the OS for reduced motion (SSR-safe, live-updating). */
export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduce(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduce
}
