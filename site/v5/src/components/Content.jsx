import { useEffect, useState } from 'react'
import { BRAND, FREE_SHIP } from '../data'
import { KitGrid } from './Shop'
import { Scramble, CountUp, Magnetic, Pack, useCart } from './ui'
import { inr } from '../lib/util'

export function Announce() {
  const items = ['FREE SHIPPING ABOVE ' + inr(FREE_SHIP), 'COD AVAILABLE', 'USE FIRST10 FOR 10% OFF', 'FSSAI LIC. 10024052000123', 'NABL LAB-TESTED EVERY BATCH']
  return (
    <div className="announce mono" role="region" aria-label="Announcements">
      <div className="announce-track">{[...items, ...items, ...items].map((t, i) => <span key={i}>{t}<i>■</i></span>)}</div>
    </div>
  )
}

export function Nav() {
  const { count, setOpen, setSearchOpen, wish } = useCart()
  const [m, setM] = useState(false)
  const links = [['Shop', '#shop'], ['Categories', '#best'], ['Gifting', '#kits'], ['Recipes', '#notes'], ['About', '#trace']]
  return (
    <header className="nav mono">
      <button className="burger" onClick={() => setM(!m)} aria-label="Menu" aria-expanded={m}><i /><i /></button>
      <a href="#top" className="logo" aria-label={BRAND + ' Lab home'}><span className="logo-mark" />{BRAND.toUpperCase()}<b>/LAB</b></a>
      <nav className={m ? 'open' : ''} aria-label="Primary">
        {links.map(([l, h]) => <a key={l} href={h} onClick={() => setM(false)}>{l}</a>)}
        <a href="#specimen" className="nav-extra" onClick={() => setM(false)}>Specimen jar</a>
        <a href="#compound" className="nav-extra" onClick={() => setM(false)}>Compound sheets</a>
      </nav>
      <div className="nav-r">
        <button className="ibtn" onClick={() => setSearchOpen(true)} aria-label="Search products"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 5 5" /></svg><span className="hide-sm">SEARCH</span></button>
        <a className="ibtn hide-sm" href="#news" aria-label="Account"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-5 15-5 16 0" /></svg></a>
        <a className="ibtn hide-sm" href="#shop" aria-label={'Wishlist, ' + wish.length + ' items'}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" /></svg><span className="badge">{wish.length}</span></a>
        <button className="cart-btn" onClick={() => setOpen(true)} aria-label={'Open cart, ' + count + ' items'}>CART <span className="badge">[{String(count).padStart(2, '0')}]</span></button>
      </div>
    </header>
  )
}

export function Trust() {
  const items = ['FSSAI CERTIFIED', 'LAB TESTED', 'NO FILLERS / PRESERVATIVES', 'COD AVAILABLE', 'EASY 7-DAY RETURNS', 'SECURE UPI + CARDS', 'N₂ FLUSHED']
  return (
    <div className="trust mono" aria-label="Quality assurances">
      <div className="trust-track">{[...items, ...items, ...items, ...items].map((t, i) => <span key={i}>{t}</span>)}</div>
    </div>
  )
}

