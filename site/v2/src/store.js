import { useSyncExternalStore, useEffect, useState } from 'react'

function createStore(init) {
  let s = init
  const subs = new Set()
  return {
    get: () => s,
    set: (v) => { if (v !== s) { s = v; subs.forEach((f) => f()) } },
    sub: (f) => { subs.add(f); return () => subs.delete(f) },
  }
}
export const useStore = (store) => useSyncExternalStore(store.sub, store.get, store.get)

// mutable scroll bridges read inside useFrame (no React renders)
export const heroState = { p: 0 }
export const aisleState = { p: 0, camX: 0, vel: 0, added: -1 }
export const heroActive = createStore(-1)
export const aisleFocus = createStore(0)
export const aisleHover = createStore(-1)
export const interacted = { v: false }

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px), (pointer: coarse)').matches

export function useMedia(q) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const f = () => setM(mq.matches)
    f(); mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [q])
  return m
}

export function useInView(ref, margin = '0px') {
  const [v, setV] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { rootMargin: margin })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref, margin])
  return v
}

export function useFontsReady() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    let dead = false
    const go = async () => {
      try {
        await Promise.all([document.fonts.load('40px Anton'), document.fonts.load('italic 40px "Instrument Serif"'), document.fonts.load('600 20px "DM Sans"')])
      } catch { /* ignore */ }
      if (!dead) setOk(true)
    }
    go()
    return () => { dead = true }
  }, [])
  return ok
}
