import { useEffect, useState } from 'react'
import { BRAND, FREE_SHIP } from './data'
import { useStore, rupee } from './store'
import { scrollToTarget } from './ui/SmoothScroll'

const links = [
  ['Shop', '#shop'],
  ['Collection', '#collection'],
  ['Gifting', '#gifting'],
  ['Our Story', '#origins'],
]
const Ico = ({ d, ...p }) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}><path d={d} /></svg>

export default function Header() {
  const { count, wish, setPanel, say } = useStore()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 60)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  const go = (e, h) => { e.preventDefault(); setPanel(null); scrollToTarget(h) }
  return (
    <header className={`hdr ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="announce">
        <span>Free shipping above {rupee(FREE_SHIP)}<span className="sm-only"> · COD</span></span><i aria-hidden="true" className="hide-sm" />
        <span className="hide-sm">Cash on delivery available</span><i aria-hidden="true" className="hide-sm" />
        <span className="hide-sm">Harvest 2026 has landed: Pampore saffron, Lot 26</span>
      </div>
      <nav className="nav" aria-label="Primary">
        <button className="ibtn nav__menu" onClick={() => setPanel('menu')} aria-label="Open menu"><span /><span /></button>
        <ul className="nav__links">
          {links.map(([t, h]) => (<li key={h}><a href={h} onClick={(e) => go(e, h)}>{t}</a></li>))}
        </ul>
        <a href="#top" className="logo" onClick={(e) => go(e, 0)} aria-label={`${BRAND}, home`}>{BRAND}</a>
        <div className="nav__r">
          <button className="ibtn" onClick={() => setPanel('search')} aria-label="Search"><Ico d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4" /></button>
          <button className="ibtn hide-sm" onClick={() => say('Accounts open with the first harvest letter.')} aria-label="Account"><Ico d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></button>
          <button className="ibtn hide-sm" onClick={() => say(wish.length ? `${wish.length} saved to your wishlist` : 'Tap a heart to save a spice')} aria-label={`Wishlist, ${wish.length}`}>
            <Ico d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.9a4.3 4.3 0 0 1 7.5 2.6c0 5.4-7.5 10-7.5 10Z" />{wish.length > 0 && <sup>{wish.length}</sup>}
          </button>
          <button className="nav__cart" onClick={() => setPanel('cart')} aria-label={`Cart, ${count} items`}>
            <Ico d="M5 8h14l-1 12H6L5 8ZM9 8V6a3 3 0 0 1 6 0v2" /><b key={count}>{count}</b>
          </button>
        </div>
      </nav>
    </header>
  )
}
