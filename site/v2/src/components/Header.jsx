import { useEffect, useState, useRef } from 'react'
import { BRAND, FREE_SHIP, inr, catalogue } from '../brand'
import { useCart } from '../cart'
import JarArt from './JarArt'
import { Stars, sizeOf, SizeChips as SizeChipsLazy, PriceRow as PriceLazy, Stepper as StepperLazy } from './Bits'
import { defaultSize } from '../brand'

export function Logo() {
  return (
    <a href="#top" className="logo" aria-label={BRAND + ' home'}>
      <span className="logo-aw" />
      <span className="logo-t">{BRAND.toUpperCase()}</span>
    </a>
  )
}

const I = {
  search: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" /><path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="4" stroke="currentColor" strokeWidth="2" /><path d="M4.5 20c.8-4 4-5.5 7.5-5.5s6.7 1.5 7.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  heart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 20.5s-8-4.6-8-10.4A4.6 4.6 0 0 1 12 7.4a4.6 4.6 0 0 1 8 2.7c0 5.8-8 10.4-8 10.4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>,
  bag: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 8h14l-1 12H6L5 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="2" /></svg>,
}

const LINKS = [['Shop', '#pantry'], ['Categories', '#pantry'], ['Combos', '#combos'], ['Gifting', '#gifting'], ['Recipes', '#ritual'], ['About', '#story']]

export default function Header() {
  const c = useCart()
  const [bump, setBump] = useState(false)
  useEffect(() => { if (!c.count) return; setBump(true); const t = setTimeout(() => setBump(false), 700); return () => clearTimeout(t) }, [c.count])
  return (
    <header className="site" id="top">
      <div className="bar"><span>Free shipping above {inr(FREE_SHIP)}</span><i className="bar-dot" /><span>Cash on delivery available</span><i className="bar-dot hide-s" /><span className="hide-s">No preservatives. Ever.</span></div>
      <nav className="nav wrap" aria-label="Main">
        <Logo />
        <ul className="links">{LINKS.map(([t, h]) => <li key={t}><a href={h}>{t}</a></li>)}</ul>
        <div className="nav-r">
          <button className="ic" onClick={() => c.setSearch('search')} aria-label="Search spices">{I.search}</button>
          <button className="ic hide-s" onClick={() => c.flash('Accounts open with the real store — guest checkout works today.')} aria-label="Account">{I.user}</button>
          <button className="ic hide-s" onClick={() => c.setSearch('wish')} aria-label={`Wishlist, ${c.wish.length} saved`}>{I.heart}{c.wish.length > 0 && <sup>{c.wish.length}</sup>}</button>
          <button className={'cartpill' + (bump ? ' bump' : '')} onClick={() => c.setDrawer(true)} aria-label={`Open cart, ${c.count} items`}>{I.bag}<span>Cart ({c.count})</span></button>
          <button className="burger" onClick={() => c.setMenu(true)} aria-label="Open menu"><i /><i /><i /></button>
        </div>
      </nav>
    </header>
  )
}

export function MobileMenu() {
  const c = useCart()
  return (
    <div className={'menu-ov' + (c.menu ? ' on' : '')} aria-hidden={!c.menu}>
      <div className="menu-top"><Logo /><button className="ic" onClick={() => c.setMenu(false)} aria-label="Close menu">✕</button></div>
      <ul>{LINKS.map(([t, h], i) => <li key={t} style={{ '--i': i }}><a href={h} onClick={() => c.setMenu(false)}>{t}<em>→</em></a></li>)}</ul>
      <div className="menu-foot"><button className="btn btn-saf" onClick={() => { c.setMenu(false); c.setSearch('wish') }}>Wishlist ({c.wish.length})</button><p>Free shipping above {inr(FREE_SHIP)} · COD available</p></div>
    </div>
  )
}

export function SearchOverlay() {
  const c = useCart()
  const [q, setQ] = useState('')
  const inp = useRef()
  const mode = c.search
  useEffect(() => { if (mode) { setQ(''); setTimeout(() => inp.current?.focus(), 60) } }, [mode])
  const term = q.trim().toLowerCase()
  const res = mode === 'wish' ? catalogue.filter((p) => c.wish.includes(p.id))
    : term ? catalogue.filter((p) => (p.name + ' ' + p.hi + ' ' + p.origin + ' ' + p.cat + ' ' + p.notes).toLowerCase().includes(term))
    : catalogue.filter((p) => p.badge === 'Bestseller').slice(0, 6)
  return (
    <div className={'search-ov' + (mode ? ' on' : '')} aria-hidden={!mode} role="dialog" aria-label="Search">
      <div className="search-bg" onClick={c.closeAll} />
      <div className="search-box">
        <div className="search-top">
          {mode === 'wish' ? <h3>Saved <em>jars</em></h3> : (
            <label><span className="sr">Search spices</span>{I.search}<input ref={inp} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search haldi, biryani, chai, Kashmir…" /></label>
          )}
          <button className="ic" onClick={c.closeAll} aria-label="Close search">✕</button>
        </div>
        <p className="search-meta">{mode === 'wish' ? `${res.length} saved` : term ? `${res.length} result${res.length === 1 ? '' : 's'}` : 'Popular right now'}</p>
        <ul className="search-res">
          {res.length === 0 && <li className="empty">{mode === 'wish' ? 'Tap the heart on any jar to save it here.' : 'Nothing matches. Try “jeera”, “chai” or “Kerala”.'}</li>}
          {res.map((p) => {
            const s = defaultSize(p)
            return (
              <li key={p.id}>
                <button className="sr-open" onClick={() => { c.setSearch(false); c.setQv(p.id) }}>
                  <span className="sr-img" style={{ background: p.tint }}><JarArt p={p} uid={'s' + p.id} /></span>
                  <span className="sr-t"><b>{p.name}</b><em>{p.hi} · {p.origin}</em><Stars r={p.rating} n={p.reviews} /></span>
                  <span className="sr-p"><b>{inr(s.price)}</b><s>{inr(s.mrp)}</s></span>
                </button>
                <button className="btn btn-red sm" onClick={() => c.add(p.id, s.label)}>Add</button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export function QuickView() {
  const c = useCart()
  const p = c.qv && catalogue.find((x) => x.id === c.qv)
  const [label, setLabel] = useState(null)
  const [qty, setQty] = useState(1)
  useEffect(() => { if (p) { setLabel(defaultSize(p).label); setQty(1) } }, [p])
  if (!p) return <div className="qv-ov" aria-hidden="true" />
  const size = sizeOf(p, label || defaultSize(p).label)
  return (
    <div className="qv-ov on" role="dialog" aria-modal="true" aria-label={p.name}>
      <div className="qv-bg" onClick={c.closeAll} />
      <div className="qv">
        <button className="qv-x" onClick={c.closeAll} aria-label="Close quick view">✕</button>
        <div className="qv-img" style={{ background: p.tint }}>
          <span className="badge">{p.badge || (p.isNew ? 'New' : `SAVE ${Math.round((1 - p.price / p.mrp) * 100)}%`)}</span>
          <JarArt p={p} uid={'q' + p.id} />
        </div>
        <div className="qv-body">
          <div className="eyebrow dark"><span className="eb-line" />{p.origin} · {p.cat}</div>
          <h2 className="display">{p.name.toUpperCase()}</h2>
          <em className="qv-hi">{p.hi}</em>
          <Stars r={p.rating} n={p.reviews} />
          <p className="qv-desc">{p.desc}</p>
          <div className="qv-notes">{p.notes.split(' · ').map((n) => <span key={n}>{n}</span>)}{p.low && <span className="low">Only a few tins left</span>}</div>
          {p.items && <p className="qv-inc"><b>Inside:</b> {p.items.map((i) => catalogue.find((x) => x.id === i).name).join(' · ')}</p>}
          <div className="qv-label">Pack size</div>
          <SizeChipsLazy p={p} value={size.label} onChange={setLabel} />
          <div className="qv-price"><PriceLazy size={size} /><small>Inclusive of all taxes</small></div>
          <div className="qv-actions">
            <StepperLazy q={qty} onChange={(n) => setQty(Math.max(1, n))} />
            <button className="btn btn-red" onClick={() => { c.add(p.id, size.label, qty); c.setQv(null); c.setDrawer(true) }}>Add to cart · {inr(size.price * qty)}</button>
          </div>
          <button className="btn btn-dark wide" onClick={() => { c.add(p.id, size.label, qty); c.setQv(null); c.setCheckout('form') }}>Buy now</button>
          <ul className="qv-trust"><li>FSSAI certified</li><li>Lab tested</li><li>COD available</li><li>Easy 7-day returns</li></ul>
        </div>
      </div>
    </div>
  )
}
