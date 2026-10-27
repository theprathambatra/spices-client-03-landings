import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CartProvider } from './cart'
import { reducedMotion } from './store'
import Header, { MobileMenu, SearchOverlay, QuickView } from './components/Header'
import CartDrawer from './components/CartDrawer'
import Hero from './components/Hero'
import Pantry from './components/Pantry'
import Aisle from './components/Aisle'
import { Trust, Feature, Combos, Tadka, Story, Reviews, Gifting, Newsletter, Footer } from './components/Sections'

gsap.registerPlugin(ScrollTrigger)

function useStage() {
  const [n, setN] = useState(0)
  useEffect(() => {
    let id, dead = false
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 120))
    const next = (k) => { if (dead) return; setN(k); if (k < 7) id = setTimeout(() => idle(() => next(k + 1)), 160); else setTimeout(() => ScrollTrigger.refresh(), 100) }
    id = setTimeout(() => idle(() => next(1)), 350)
    return () => { dead = true; clearTimeout(id) }
  }, [])
  return n
}

export default function App() {
  const stage = useStage()
  useEffect(() => {
    let lenis, tick
    if (!reducedMotion()) {
      lenis = new Lenis({ lerp: 0.12, smoothWheel: true })
      window.__lenis = lenis
      lenis.on('scroll', ScrollTrigger.update)
      tick = (t) => lenis.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 1200)
    document.fonts?.ready.then(refresh)
    return () => { window.removeEventListener('load', refresh); clearTimeout(t); if (tick) gsap.ticker.remove(tick); lenis?.destroy(); window.__lenis = null }
  }, [])
  return (
    <CartProvider>
      <Header />
      <main>
        <Hero />
        {stage >= 1 && <Trust />}
        {stage >= 2 && <Pantry />}
        {stage >= 3 && <><Feature /><Combos /></>}
        {stage >= 4 && <Aisle />}
        {stage >= 5 && <><Tadka /><Story /></>}
        {stage >= 6 && <Reviews />}
        {stage >= 7 && <><Gifting /><Newsletter /></>}
      </main>
      {stage >= 7 && <Footer />}
      <MobileMenu />
      <SearchOverlay />
      <QuickView />
      <CartDrawer />
    </CartProvider>
  )
}
