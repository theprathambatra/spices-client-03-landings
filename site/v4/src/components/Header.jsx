import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore, inr, sizesFor, byId } from '../store'
import { BRAND, BRAND_HI, products, CATS } from '../data'
import Pack from './Pack'
import { Lotus } from './Ornaments'

const NAV = [['Shop', '#shop'], ['Categories', '#shop'], ['Gifting', '#occasions'], ['Recipes', '#recipes'], ['About', '#story']]

const Ic = {
  search: <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M16 16l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  user: <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M4 21c1-5 15-5 16 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  heart: <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>,
  bag: <svg viewBox="0 0 24 24" width="20" height="20"><path d="M5 8h14l-1 12H6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="2" /></svg>,
}

export function Wordmark({ light }) {
  return (
    <a className={'logo' + (light ? ' light' : '')} href="#top" aria-label={BRAND + ' home'}>
      <Lotus size={30} color="#F7A614" />
      <span className="logo-t">{BRAND}<small lang="hi">{BRAND_HI}</small></span>
    </a>
  )
}

export default function Header() {
  const s = useStore()
  const menu = s.drawer === 'menu'
  return (
    <header className="site-head" id="top">
      <div className="ann" role="region" aria-label="Offers">
        <div className="ann-track">
          {[0, 1].map((k) => (
            <div className="ann-set" key={k} aria-hidden={k === 1}>
              <span>Free shipping above ₹499</span><i>❖</i><span>Cash on delivery available</span><i>❖</i><span>Use FIRST10 for 10% off</span><i>❖</i><span>FSSAI certified · lab tested every batch</span><i>❖</i>
              <span>Free shipping above ₹499</span><i>❖</i><span>Cash on delivery available</span><i>❖</i><span>Use FIRST10 for 10% off</span><i>❖</i><span>FSSAI certified · lab tested every batch</span><i>❖</i>
            </div>
          ))}
        </div>
      </div>
      <nav className="nav" aria-label="Main">
        <button className="icon burger" aria-label="Open menu" onClick={() => s.setDrawer('menu')}><svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
        <Wordmark />
        <ul className="nav-links">{NAV.map(([l, h]) => <li key={l}><a href={h}>{l}</a></li>)}</ul>
        <div className="nav-actions">
          <button className="icon" aria-label="Search" onClick={() => s.setDrawer('search')}>{Ic.search}</button>
          <button className="icon hide-sm" aria-label="Account">{Ic.user}</button>
          <a className="icon hide-sm wishlink" aria-label={`Wishlist (${s.wish.length})`} href="#shop">{Ic.heart}{s.wish.length > 0 && <span className="cnt">{s.wish.length}</span>}</a>
          <button className="icon cartbtn" aria-label={`Cart, ${s.count} items`} onClick={() => s.setDrawer('cart')}>{Ic.bag}<span className="cnt" key={s.count}>{s.count}</span></button>
        </div>
      </nav>
      <div className={'scrim' + (menu ? ' on' : '')} onClick={() => s.setDrawer(null)} />
      <aside className={'drawer menu' + (menu ? ' on' : '')} inert={!menu} aria-label="Menu">
        <header><Wordmark light /><button className="x" onClick={() => s.setDrawer(null)} aria-label="Close menu">×</button></header>
        <ul>{NAV.map(([l, h]) => <li key={l}><a href={h} onClick={() => s.setDrawer(null)}>{l}</a></li>)}</ul>
        <p className="muted">Free shipping above ₹499 · COD available</p>
      </aside>
    </header>
  )
}

export function SearchOverlay() {
  const s = useStore()
  const [q, setQ] = useState('')
  const inp = useRef(null)
  const open = s.drawer === 'search'
  useEffect(() => { if (open) setTimeout(() => inp.current?.focus(), 50); else setQ('') }, [open])
  const res = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return products.filter((p) => p.best)
    return products.filter((p) => (p.name + ' ' + p.origin + ' ' + p.notes + ' ' + p.cat + ' ' + p.hi).toLowerCase().includes(t))
  }, [q])
  if (!open) return null
  return (
    <div className="search" role="dialog" aria-modal="true" aria-label="Search">
      <div className="search-in">
        <div className="search-bar">
          {Ic.search}
          <input ref={inp} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search spices…" aria-label="Search products" />
          <button className="x" onClick={() => s.setDrawer(null)} aria-label="Close search">×</button>
        </div>
        <p className="muted">{q ? `${res.length} result${res.length === 1 ? '' : 's'}` : 'Popular right now'}</p>
        <div className="search-res">
          {res.slice(0, 8).map((p) => (
            <button key={p.id} className="sr" onClick={() => { s.setDrawer(null); s.setQuick(p.id) }}>
              <div className="sr-pack"><Pack p={p} /></div>
              <div><h4>{p.name}</h4><p>{p.origin} · {p.weight}</p><strong>{inr(p.price)}</strong></div>
            </button>
          ))}
          {res.length === 0 && <p className="empty">Nothing by that name. Try “pepper”, “Kerala” or “chai”.</p>}
        </div>
      </div>
    </div>
  )
}
