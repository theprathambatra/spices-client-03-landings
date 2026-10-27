import { useEffect, useRef } from 'react'
import { ReactLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null
export function scrollToTarget(target, opts = {}) {
  if (lenisInstance) lenisInstance.scrollTo(target, { duration: 1.8, easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), ...opts })
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (typeof el === 'number') window.scrollTo({ top: el, behavior: 'smooth' })
    else el?.scrollIntoView({ behavior: 'smooth' })
  }
}

export default function SmoothScroll({ children }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const update = (time) => ref.current?.lenis?.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    const lenis = ref.current?.lenis
    lenisInstance = lenis || null
    lenis?.on('scroll', ScrollTrigger.update)
    return () => {
      gsap.ticker.remove(update)
      lenis?.off('scroll', ScrollTrigger.update)
      lenisInstance = null
    }
  }, [reduced])
  if (reduced) return children
  return (
    <ReactLenis root ref={ref} options={{ autoRaf: false, lerp: 0.075, wheelMultiplier: 0.9, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}

export const setScrollLocked = (b) => { if (b) lenisInstance?.stop(); else lenisInstance?.start() }
