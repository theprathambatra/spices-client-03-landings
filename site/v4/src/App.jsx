import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { StoreProvider, useStore } from './store'
import Header, { SearchOverlay } from './components/Header'
import Hero from './components/Hero'
import Trust from './components/Trust'
import Shop from './components/Shop'
import ThaliSection from './components/ThaliSection'
import RegionMap from './components/RegionMap'
import Occasions from './components/Occasions'
import Bundles from './components/Bundles'
import Story from './components/Story'
import Recipes from './components/Recipes'
import Reviews from './components/Reviews'
import Footer, { Newsletter } from './components/Footer'
import QuickView from './components/QuickView'
import CartDrawer, { Checkout } from './components/CartDrawer'
import { Mandala } from './components/Ornaments'
import { BRAND } from './data'
gsap.registerPlugin(ScrollTrigger)

function Curtain() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.remove(); return }
    const tl = gsap.timeline({ delay: 0.55, onComplete: () => el.remove() })
    tl.to(el.querySelector('.cur-mark'), { opacity: 0, scale: 1.2, duration: 0.45 })
      .to(el.querySelector('.cur-l'), { xPercent: -100, duration: 1.1, ease: 'power3.inOut' }, 0.35)
      .to(el.querySelector('.cur-r'), { xPercent: 100, duration: 1.1, ease: 'power3.inOut' }, 0.35)
    return () => tl.kill()
  }, [])
  return (
    <div ref={ref} className="curtain-intro" aria-hidden="true">
      <div className="cur-l" /><div className="cur-r" />
      <div className="cur-mark"><Mandala size={220} spin={30} colors={['#F7A614', '#D81B76', '#0D8E9B']} /><b>{BRAND}</b></div>
    </div>
  )
}

function Toast() {
  const { toast, setDrawer } = useStore()
  return <div className={'toast' + (toast ? ' on' : '')} role="status" aria-live="polite">{toast && <><span>{toast}</span><button onClick={() => setDrawer('cart')}>View cart</button></>}</div>
}

function Smooth() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1 })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); window.__lenis = null }
  }, [])
  return null
}

export default function App() {
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(onLoad)
    const setH = () => document.documentElement.style.setProperty('--head-h', (document.querySelector('.site-head')?.offsetHeight || 102) + 'px')
    setH(); addEventListener('resize', setH)
    // hash links with lenis
    const click = (e) => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return
      const id = a.getAttribute('href').slice(1); if (!id || id === 'top') return
      const t = document.getElementById(id); if (!t) return
      e.preventDefault()
      const off = -(document.querySelector('.nav')?.offsetHeight || 0) + 4
      if (window.__lenis) window.__lenis.scrollTo(t, { offset: off, duration: 1.4 }); else t.scrollIntoView({ behavior: 'smooth' })
    }
    document.addEventListener('click', click)
    return () => { document.removeEventListener('click', click); removeEventListener('resize', setH) }
  }, [])
  return (
    <StoreProvider>
      <Smooth />
      <Curtain />
      <Header />
      <main>
        <Hero />
        <Trust />
        <Shop />
        <ThaliSection />
        <RegionMap />
        <Occasions />
        <Bundles />
        <Story />
        <Recipes />
        <Reviews />
        <Newsletter />
      </main>
      <Footer />
      <SearchOverlay />
      <QuickView />
      <CartDrawer />
      <Checkout />
      <Toast />
    </StoreProvider>
  )
}
