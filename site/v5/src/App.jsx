import { lazy, Suspense, useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Cursor, useCart } from './components/ui'
import { CartProvider } from './store/cart'
import Hero from './components/Hero'
import { Announce, Nav, Trust } from './components/Content'
import { Bestsellers, CompareDrawer, CartDrawer, QuickView, SearchOverlay, Checkout } from './components/Shop'
const Below = lazy(() => import('./components/Below.jsx'))
import { reduced } from './lib/util'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [below, setBelow] = useState(false)
  useEffect(() => { const id = setTimeout(() => setBelow(true), 900); return () => clearTimeout(id) }, [])
  useEffect(() => {
    if (reduced()) return
    const lenis = new Lenis({ lerp: 0.12 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    const obs = new MutationObserver(() => (document.documentElement.classList.contains('locked') ? lenis.stop() : lenis.start()))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => { obs.disconnect(); gsap.ticker.remove(tick); lenis.destroy() }
  }, [])
  return (
    <CartProvider>
      <Cursor />
      <Announce />
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Bestsellers />
        {below ? <Suspense fallback={<div style={{ minHeight: 9000 }} />}><Below /></Suspense> : <div style={{ minHeight: 9000 }} />}
      </main>
      <QuickView />
      <SearchOverlay />
      <CompareDrawer />
      <CartDrawer />
      <Checkout />
      <Toast />
    </CartProvider>
  )
}

function Toast() {
  const { toast } = useCart()
  return <div className={'toast mono' + (toast ? ' on' : '')} role="status">{toast}</div>
}
