import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ReactLenis, useLenis } from 'lenis/react'
import { BRAND, FREE_SHIP } from './brand.js'
import { CartIcon, Sparkle } from './Icons.jsx'
import { reducedMotion } from './util.jsx'
import { StoreProvider, useStore, useModal } from './store/cart.jsx'
import { Shop, QuickView, SearchOverlay, CartDrawer, Checkout, Toast, HeartIcon } from './store/ui.jsx'
import Hero from './Hero.jsx'
import MagicStore from './MagicStore.jsx'
import { Trust, Browse, Heat, Farm, Recipes, Gifting, Reviews, Retail, Newsletter, Signoff, Footer } from './Sections.jsx'

const LINKS = [['Shop', '#shop'], ['Categories', '#browse'], ['Magic Store', null], ['Recipes', '#recipes'], ['About', '#farm']]

const SearchIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-5 5-7 8-7s7 2 8 7" /></svg>
const MotionIcon = ({ paused }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{paused ? <path d="M7 4v16l13-8z" /> : <><rect x="5" y="4" width="5" height="16" rx="1" /><rect x="14" y="4" width="5" height="16" rx="1" /></>}</svg>

function Header({ paused, setPaused, onMagic }) {
  const st = useStore()
  const cc = useRef()
  useEffect(() => { if (st.bump && cc.current && !reducedMotion() && !paused) gsap.fromTo(cc.current, { scale: 1.9, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(3)' }) }, [st.bump, paused])
  const menu = st.ui.menu
  const navRef = useRef()
  const burger = useRef()
  const closeMenu = () => { st.open('menu', false); burger.current?.focus() }
  useModal(menu, closeMenu)
  useEffect(() => { if (menu) navRef.current?.querySelector('a')?.focus() }, [menu])
  const trap = (e) => {
    if (!menu || e.key !== 'Tab') return
    const f = [burger.current, ...navRef.current.querySelectorAll('a, button')]
    const i = f.indexOf(document.activeElement)
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus() } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus() }
  }
  return (
    <>
      <div className="announce"><div className="wrap announce-in"><span>Free shipping above &#8377;{FREE_SHIP}</span><span>Code FIRST10 for 10% off</span></div></div>
      <header className="nav" onKeyDown={trap}>
        <div className="wrap nav-in">
          <a className="logo" href="#top" aria-label={`${BRAND} home`}><span>{BRAND.toUpperCase()}<b>SPICES</b></span></a>
          <nav className="nav-links" aria-label="Main">{LINKS.map(([l, h]) => h ? <a key={l} href={h}>{l}</a> : <button key={l} className="magic-nav" onClick={onMagic}><Sparkle size={16} />{l}</button>)}</nav>
          <span className="nav-sp" />
          <button className="icon-btn" onClick={() => st.open('search', true)} aria-label="Search"><SearchIcon /></button>
          <button className="icon-btn motion-btn" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play animations' : 'Pause animations'} aria-pressed={paused} title={paused ? 'Play animations' : 'Pause animations'}><MotionIcon paused={paused} /></button>
          <button className="icon-btn hide-s" onClick={() => st.say('Sign-in is a demo here. Welcome anyway!')} aria-label="Account"><UserIcon /></button>
          <button className="icon-btn hide-s" onClick={() => { st.open('cat', st.s.wish.length ? 'wish' : 'all'); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); if (!st.s.wish.length) st.say('Tap the heart on any pouch to save it') }} aria-label={`Wishlist, ${st.s.wish.length} saved`}>
            <HeartIcon on={st.s.wish.length > 0} />{st.s.wish.length > 0 && <i className="dot">{st.s.wish.length}</i>}
          </button>
          <button className="cart-btn" onClick={() => st.open('cart', true)} aria-label={`Open cart, ${st.count} items`}>
            <CartIcon /> <span className="cart-label">Cart</span><span className="cart-count" ref={cc}>{st.count}</span>
          </button>
          <button className="burger" ref={burger} onClick={() => st.open('menu', !menu)} aria-label="Menu" aria-expanded={menu}><span /><span /><span /></button>
        </div>
        <nav ref={navRef} className={`mnav ${menu ? 'open' : ''}`} aria-label="Mobile" inert={!menu}>{LINKS.map(([l, h]) => h ? <a key={l} href={h} onClick={() => st.open('menu', false)}>{l}</a> : <button key={l} className="magic-nav" onClick={() => { st.open('menu', false); onMagic() }}><Sparkle size={18} />{l}</button>)}</nav>
      </header>
    </>
  )
}

function LenisGate({ magicOpen }) {
  const st = useStore()
  const lenis = useLenis()
  const locked = st.ui.cart || st.ui.quick || st.ui.search || st.ui.checkout || magicOpen
  useEffect(() => { if (!lenis) return; locked ? lenis.stop() : lenis.start() }, [lenis, locked])
  return null
}

export default function App() {
  const reduced = reducedMotion()
  const [paused, setPaused] = useState(reduced)
  const [magicOpen, setMagicOpen] = useState(() => window.location.hash === '#magic-store')
  const previousHash = useRef('#top')
  const openMagic = () => {
    previousHash.current = window.location.hash && window.location.hash !== '#magic-store' ? window.location.hash : '#top'
    window.history.pushState(null, '', '#magic-store')
    setMagicOpen(true)
  }
  const closeMagic = () => {
    window.history.replaceState(null, '', previousHash.current)
    setMagicOpen(false)
  }
  useEffect(() => {
    const sync = () => setMagicOpen(window.location.hash === '#magic-store')
    window.addEventListener('popstate', sync); window.addEventListener('hashchange', sync)
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync) }
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('motion-paused', paused)
    return () => document.documentElement.classList.remove('motion-paused')
  }, [paused])
  useEffect(() => {
    const behind = ['.announce', '.nav', 'main', '.foot'].map((selector) => document.querySelector(selector)).filter(Boolean)
    behind.forEach((element) => { element.inert = magicOpen })
    return () => behind.forEach((element) => { element.inert = false })
  }, [magicOpen])
  return (
    <StoreProvider>
      <ReactLenis root options={{ lerp: 0.12, smoothWheel: !reduced && !paused, anchors: true }} />
      <LenisGate magicOpen={magicOpen} />
      <div id="top" />
      <Header paused={paused} setPaused={setPaused} onMagic={openMagic} />
      <main>
        <Hero motionPaused={paused} />
        <Trust />
        <Shop />
        <Browse />
        <Heat motionPaused={paused} />
        <Farm />
        <Recipes />
        <Gifting />
        <Reviews />
        <Retail />
        <Newsletter />
        <Signoff />
      </main>
      <Footer />
      <MagicStore open={magicOpen} onClose={closeMagic} motionPaused={paused} />
      <SearchOverlay />
      <QuickView />
      <CartDrawer />
      <Checkout />
      <Toast />
    </StoreProvider>
  )
}
