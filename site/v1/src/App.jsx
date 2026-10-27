import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ReactLenis, useLenis } from 'lenis/react'
import { BRAND, FREE_SHIP } from './brand.js'
import { Sparkle, CartIcon } from './Icons.jsx'
import { Marquee, reducedMotion } from './util.jsx'
import { StoreProvider, useStore, useModal } from './store/cart.jsx'
import { Shop, QuickView, SearchOverlay, CartDrawer, Checkout, Toast, HeartIcon } from './store/ui.jsx'
import Hero from './Hero.jsx'
import { Trust, Browse, Heat, Farm, Recipes, Gifting, Reviews, Retail, Newsletter, Signoff, Footer } from './Sections.jsx'

const LINKS = [['Shop', '#shop'], ['Categories', '#browse'], ['Gifting', '#gifting'], ['Recipes', '#recipes'], ['About', '#farm']]

const SearchIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-5 5-7 8-7s7 2 8 7" /></svg>

function Header() {
  const st = useStore()
  const cc = useRef()
  useEffect(() => { if (st.bump && cc.current && !reducedMotion()) gsap.fromTo(cc.current, { scale: 1.9, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(3)' }) }, [st.bump])
  const menu = st.ui.menu
  const navRef = useRef()
  const burger = useRef()
  const closeMenu = () => { st.open('menu', false); burger.current?.focus() }
  useModal(menu, closeMenu)
  useEffect(() => { if (menu) navRef.current?.querySelector('a')?.focus() }, [menu])
  const trap = (e) => {
    if (!menu || e.key !== 'Tab') return
    const f = [burger.current, ...navRef.current.querySelectorAll('a')]
    const i = f.indexOf(document.activeElement)
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus() } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus() }
  }
  return (
    <>
      <div className="announce">
        <Marquee dur={40}>
          {[0, 1, 2].map((i) => (
            <span className="marquee-item" key={i}>
              <span>Free shipping above &#8377;{FREE_SHIP}</span><Sparkle size={14} /><span>Cash on delivery available</span><Sparkle size={14} /><span>Ground this week, not last year</span><Sparkle size={14} /><span>Code FIRST10 for 10% off</span><Sparkle size={14} />
            </span>
          ))}
        </Marquee>
      </div>
      <header className="nav" onKeyDown={trap}>
        <div className="wrap nav-in">
          <a className="logo" href="#top" aria-label={`${BRAND} home`}><span>{BRAND.toUpperCase()}<b>SPICES</b></span></a>
          <nav className="nav-links" aria-label="Main">{LINKS.map(([l, h]) => <a key={l} href={h}>{l}</a>)}</nav>
          <span className="nav-sp" />
          <button className="icon-btn" onClick={() => st.open('search', true)} aria-label="Search"><SearchIcon /></button>
          <button className="icon-btn hide-s" onClick={() => st.say('Sign-in is a demo here. Welcome anyway!')} aria-label="Account"><UserIcon /></button>
          <button className="icon-btn hide-s" onClick={() => { st.open('cat', st.s.wish.length ? 'wish' : 'all'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); if (!st.s.wish.length) st.say('Tap the heart on any pouch to save it') }} aria-label={`Wishlist, ${st.s.wish.length} saved`}>
            <HeartIcon on={st.s.wish.length > 0} />{st.s.wish.length > 0 && <i className="dot">{st.s.wish.length}</i>}
          </button>
          <button className="cart-btn" onClick={() => st.open('cart', true)} aria-label={`Open cart, ${st.count} items`}>
            <CartIcon /> <span className="cart-label">Cart</span><span className="cart-count" ref={cc}>{st.count}</span>
          </button>
          <button className="burger" ref={burger} onClick={() => st.open('menu', !menu)} aria-label="Menu" aria-expanded={menu}><span /><span /><span /></button>
        </div>
        <nav ref={navRef} className={`mnav ${menu ? 'open' : ''}`} aria-label="Mobile" inert={!menu}>{LINKS.map(([l, h]) => <a key={l} href={h} onClick={() => st.open('menu', false)}>{l}</a>)}</nav>
      </header>
    </>
  )
}

function LenisGate() {
  const st = useStore()
  const lenis = useLenis()
  const locked = st.ui.cart || st.ui.quick || st.ui.search || st.ui.checkout
  useEffect(() => { if (!lenis) return; locked ? lenis.stop() : lenis.start() }, [lenis, locked])
  return null
}

const CLAIMS = ['Hand-ground. Zero fillers.', 'Fresh batch every week', 'Single-origin, farm named', 'Lab tested, FSSAI certified', 'Made loud, never bland']

export default function App() {
  const reduced = reducedMotion()
  return (
    <StoreProvider>
      <ReactLenis root options={{ lerp: 0.12, smoothWheel: !reduced, anchors: true }} />
      <LenisGate />
      <div id="top" />
      <Header />
      <main>
        <Hero />
        <div className="claims">
          <Marquee dur={38}>
            {[0, 1].map((k) => <span className="marquee-item" key={k}>{CLAIMS.map((c) => <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 26 }}>{c}<Sparkle size={26} color="#FFC21A" /></span>)}</span>)}
          </Marquee>
        </div>
        <Trust />
        <Shop />
        <Browse />
        <Heat />
        <Farm />
        <Recipes />
        <Gifting />
        <Reviews />
        <Retail />
        <Newsletter />
        <Signoff />
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
