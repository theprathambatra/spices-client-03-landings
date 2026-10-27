import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { products, BUNDLES, CATEGORIES, FREE_SHIP, SHIP_FEE, rupee, sizesOf, sizeLabel, priceFor, grams, desc, bySlug } from '../brand.js'
import { PouchSVG, SpiceGlyph, Star, Arrow, CartIcon } from '../Icons.jsx'
import { Reveal } from '../util.jsx'
import { useStore, useModal } from './cart.jsx'

export const HeartIcon = ({ on, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-5.2-9.6-10.1C1.3 7.4 3.4 4.5 6.5 4.5c2 0 3.6 1.1 4.5 2.7h2c.9-1.6 2.5-2.7 4.5-2.7 3.100 0 5.200 2.900 4.100 6.400C20 15.800 12 21 12 21z" fill={on ? '#E03A2F' : 'none'} stroke="#1A1208" strokeWidth="2.2" strokeLinejoin="round" /></svg>
)
export const Stars = ({ v, size = 14 }) => <span className="stars" role="img" aria-label={`${v} out of 5`}>{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={size} empty={v < n - 0.4} />)}</span>

export function Stepper({ qty, onDec, onInc, label }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button onClick={onDec} aria-label="Decrease quantity">&minus;</button>
      <b aria-live="polite">{qty}</b>
      <button onClick={onInc} aria-label="Increase quantity">+</button>
    </div>
  )
}

export const ProductCard = memo(function ProductCard({ p, i = 0 }) {
  const st = useStore()
  const sizes = sizesOf(p)
  const [sz, setSz] = useState(grams(p))
  const { price, mrp } = priceFor(p, sz)
  const qty = st.qtyOf(p.id, sz)
  const wished = st.s.wish.includes(p.id)
  return (
    <Reveal as="article" className="pcard" i={i % 4} style={{ '--c': p.color }}>
      <div className="pimg">
        <button className="pimg-btn" onClick={() => st.open('quick', p.id)} aria-label={`Quick view ${p.name}`}>
          <PouchSVG sku={p} className="pouch" />
          <span className="qv">Quick view</span>
        </button>
        {p.badge && <span className={`pbadge ${p.cat === 'rare' ? 'rare' : ''}`}>{p.badge}</span>}
        {!p.badge && p.isNew && <span className="pbadge new">New</span>}
        {p.low && <span className="plow">Only few left</span>}
        <button className="heart" onClick={() => st.toggleWish(p.id)} aria-pressed={wished} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}><HeartIcon on={wished} /></button>
      </div>
      <div className="pbody">
        <h3><button onClick={() => st.open('quick', p.id)}>{p.name}</button></h3>
        <div className="hi">{p.origin}</div>
        <div className="sizes" role="radiogroup" aria-label={`${p.name} pack size`}>
          {sizes.map((g) => <button key={g} role="radio" aria-checked={g === sz} className={`sz ${g === sz ? 'on' : ''}`} onClick={() => setSz(g)}>{sizeLabel(g)}</button>)}
        </div>
        <div className="price"><b>{rupee(price)}</b><s>{rupee(mrp)}</s></div>
        {qty === 0
          ? <button className="add" onClick={() => st.add(p.id, sz)}><CartIcon size={18} /> Add to cart</button>
          : <Stepper qty={qty} label={`${p.name} quantity`} onDec={() => st.inc(`${p.id}@${sz}`, -1)} onInc={() => st.inc(`${p.id}@${sz}`, 1)} />}
      </div>
    </Reveal>
  )
})

/* ------------------------------------------------------------- shop */
const PILLS = [['all', 'All'], ['whole', 'Whole'], ['ground', 'Ground'], ['blends', 'Blends'], ['chai', 'Chai & Milk'], ['salts', 'Salts'], ['rare', 'Premium'], ['fire', 'Fire Zone']]
const SORTS = [['pop', 'Popular'], ['lo', 'Price: low to high'], ['hi', 'Price: high to low'], ['new', 'New arrivals']]

export function Shop() {
  const st = useStore()
  const { cat, purpose, query } = st.ui
  const [sort, setSort] = useState('pop')
  const [all, setAll] = useState(false)
  const [visibleCount, setVisibleCount] = useState(12)
  const list = useMemo(() => {
    let l = products.filter((p) => cat === 'all' ? true : cat === 'fire' ? p.heat >= 3 : cat === 'wish' ? st.s.wish.includes(p.id) : p.cat === cat)
    if (query) { const t = query.toLowerCase(); l = l.filter((p) => [p.name, p.hindi, p.origin, p.notes, p.cat, ...(p.purposes || [])].join(' ').toLowerCase().includes(t)) }
    if (purpose) l = l.filter((p) => p.purposes?.includes(purpose))
    const cmp = { pop: (a, b) => b.reviews - a.reviews, lo: (a, b) => a.price - b.price, hi: (a, b) => b.price - a.price, new: (a, b) => (b.isNew - a.isNew) || (b.order - a.order) }[sort]
    return [...l].sort(cmp)
  }, [cat, purpose, query, sort, st.s.wish])
  const catalogOpen = all || cat !== 'all' || !!purpose || !!query
  const title = !catalogOpen ? 'Our best sellers' : query ? `Results: ${query}` : cat === 'all' ? 'Shop all spices' : cat === 'wish' ? 'Your wishlist' : cat === 'fire' ? 'Fire zone' : (PILLS.find(([id]) => id === cat)?.[1] || 'Spices')
  const shown = catalogOpen ? list.slice(0, visibleCount) : list.slice(0, 4)
  return (
    <section className="section shop" id="shop" aria-labelledby="shop-t" style={{ paddingTop: 'clamp(44px,6vw,80px)' }}>
      <div className="wrap">
        <div className="sec-head" style={{ marginBottom: 28 }}>
          <Reveal as="span" kind="slap" rot={-4} className="kicker">fresh ground, loudly</Reveal>
          <h2 className="title" id="shop-t" tabIndex="-1">{title}</h2>
          {!catalogOpen && <p>Four kitchen favourites. Choose a pack, or explore the full shelf.</p>}
        </div>
        {catalogOpen && <div className="shop-top">
          <div className="pills" role="group" aria-label="Filter by category">
            {PILLS.map(([id, l]) => <button key={id} className="pill" aria-pressed={cat === id} onClick={() => { st.open('cat', id); st.open('query', ''); setAll(true); setVisibleCount(12) }}>{l}</button>)}
            <a className="pill" href="#gifting">Combos</a>
            {st.s.wish.length > 0 && <button className="pill" aria-pressed={cat === 'wish'} onClick={() => st.open('cat', 'wish')}>Wishlist ({st.s.wish.length})</button>}
          </div>
          <div className="toolbar">
            <p aria-live="polite"><b>{list.length}</b> {list.length === 1 ? 'spice' : 'spices'}{query && <> matching <b>&ldquo;{query}&rdquo;</b> <button className="chip clr" onClick={() => st.open('query', '')}>clear &times;</button></>}{purpose && <> for <b>{purpose}</b> <button className="chip clr" onClick={() => st.open('purpose', null)}>clear &times;</button></>}</p>
            <label className="sort">Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value)}>{SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            </label>
          </div>
        </div>}
        {list.length === 0 ? <p className="empty">Nothing here yet. Poke the heart on a pouch to save it!</p> : (
          <div className="grid">{shown.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>
        )}
        {!catalogOpen && <div className="more"><button className="btn btn-yellow" onClick={() => { setAll(true); setVisibleCount(12); requestAnimationFrame(() => document.getElementById('shop-t')?.focus()) }}>Browse all {list.length} spices <Arrow /></button></div>}
        {catalogOpen && list.length > visibleCount && <div className="more"><button className="btn btn-yellow" onClick={() => setVisibleCount((n) => n + 12)}>Show more spices</button></div>}
        {catalogOpen && <div className="shop-back"><button onClick={() => { st.open('cat', 'all'); st.open('purpose', null); st.open('query', ''); setAll(false); setVisibleCount(12) }}>Back to best sellers</button></div>}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- quick view */
export function QuickView() {
  const st = useStore()
  const id = st.ui.quick
  const p = id ? bySlug[id] : null
  const close = () => st.open('quick', null)
  useModal(!!p, close)
  const [sz, setSz] = useState(0)
  const [q, setQ] = useState(1)
  useEffect(() => { if (p) { setSz(grams(p)); setQ(1) } }, [id]) // eslint-disable-line
  const ref = useRef()
  useEffect(() => { if (p) ref.current?.focus() }, [p])
  if (!p) return null
  const sizes = sizesOf(p)
  const { price, mrp, off } = priceFor(p, sz || grams(p))
  const g = sz || grams(p)
  const buy = (now) => { st.add(p.id, g, q, { open: !now }); if (now) { close(); st.open('checkout', true) } else close() }
  return (
    <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="qv-modal" role="dialog" aria-modal="true" aria-label={p.name} style={{ '--c': p.color }}>
        <button className="x qv-x" ref={ref} onClick={close} aria-label="Close quick view">&times;</button>
        <div className="qv-art"><PouchSVG sku={p} className="qv-pouch" /></div>
        <div className="qv-info">
          <span className="chip" style={{ background: p.color, color: '#1A1208' }}>{p.cat === 'rare' ? 'Premium' : p.cat}</span>
          <h2>{p.name}</h2>
          <div className="hi">{p.hindi} &middot; from {p.origin}</div>
          <div className="rate"><Stars v={p.rating} /><span>{p.rating} &middot; {p.reviews.toLocaleString('en-IN')} reviews &middot; <b className="ver">Verified buyers</b></span></div>
          <p className="qv-desc">{desc(p)}</p>
          <div className="notes">{p.notes.split(',').map((n) => <span key={n} className="chip">{n.trim()}</span>)}</div>
          <dl className="qv-facts">
            <div><dt>Net quantity</dt><dd>{sizeLabel(g)}</dd></div>
            <div><dt>Listed origin</dt><dd>{p.origin}</dd></div>
            <div><dt>Storage</dt><dd>Keep sealed in a cool, dry place.</dd></div>
          </dl>
          <p className="qv-pending">Ingredient, allergen, and batch details still need verified product data.</p>
          <div className="qv-heat">Heat <span>{[0, 1, 2, 3].map((n) => <SpiceGlyph key={n} k="flame" size={22} className={n < p.heat ? '' : 'dim'} />)}</span> <small>{['Zero fire', 'Gentle', 'Medium', 'Hot', 'Very hot'][p.heat]}</small></div>
          <div className="sizes lg" role="radiogroup" aria-label="Pack size">{sizes.map((s) => <button key={s} role="radio" aria-checked={s === g} className={`sz ${s === g ? 'on' : ''}`} onClick={() => setSz(s)}>{sizeLabel(s)}</button>)}</div>
          <div className="price lg"><b>{rupee(price * q)}</b><s>{rupee(mrp * q)}</s><span className="off">{off}% off</span></div>
          <div className="qv-row">
            <Stepper qty={q} label="Quantity" onDec={() => setQ(Math.max(1, q - 1))} onInc={() => setQ(q + 1)} />
            <button className="btn btn-yellow" onClick={() => buy(false)}><CartIcon size={20} /> Add to cart</button>
            <button className="btn btn-ink" onClick={() => buy(true)}>Buy now</button>
          </div>
          <p className="qv-fine">Free shipping above {rupee(FREE_SHIP)} &middot; COD available &middot; 7-day easy returns</p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- search */
export function SearchOverlay() {
  const st = useStore()
  const open = st.ui.search
  const close = () => st.open('search', false)
  useModal(open, close)
  const [q, setQ] = useState('')
  const inp = useRef()
  useEffect(() => { if (open) { setQ(''); setTimeout(() => inp.current?.focus(), 60) } }, [open])
  const res = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    const score = (p) => {
      let sc = 0
      if (p.name.toLowerCase().startsWith(t)) sc += 6
      else if (p.name.toLowerCase().split(' ').some((w) => w.startsWith(t))) sc += 5
      else if (p.name.toLowerCase().includes(t)) sc += 4
      if (p.hindi.includes(t)) sc += 4
      if ([p.cat, ...(p.purposes || [])].some((x) => x.includes(t))) sc += 2
      if ((p.origin + ' ' + p.notes).toLowerCase().includes(t)) sc += 1
      return sc
    }
    return products.map((p) => [score(p), p]).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0] || b[1].reviews - a[1].reviews).map(([, p]) => p)
  }, [q])
  if (!open) return null
  return (
    <div className="modal-bg top" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="Search spices">
        <div className="search-row">
          <input ref={inp} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search haldi, jeera, biryani, chai..." aria-label="Search products" />
          <button className="x" onClick={close} aria-label="Close search">&times;</button>
        </div>
        {!q && <div className="sugg"><span className="kicker">people are poking at</span>{['haldi', 'chai', 'biryani', 'pepper', 'chilli', 'saffron', 'chaat'].map((s) => <button key={s} className="pill" onClick={() => setQ(s)}>{s}</button>)}</div>}
        {q && res.length === 0 && <p className="empty">No spice called &ldquo;{q}&rdquo;. Try &ldquo;masala&rdquo;?</p>}
        <ul className="results">
          {res.slice(0, 5).map((p) => (
            <li key={p.id} style={{ '--c': p.color }}>
              <button className="r-open" onClick={() => { close(); st.open('quick', p.id) }}>
                <span className="th"><PouchSVG sku={p} /></span>
                <span><b>{p.name}</b><small>{p.hindi} &middot; {p.origin}</small></span>
              </button>
              <span className="r-price">{rupee(p.price)}</span>
              <button className="btn btn-sm btn-yellow" onClick={() => st.add(p.id, grams(p), 1, { open: false })}>Add</button>
            </li>
          ))}
        </ul>
        {res.length > 5 && <button className="btn btn-ink view-all" onClick={() => { close(); st.open('cat', 'all'); st.open('purpose', null); st.open('query', q.trim()); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }}>View all {res.length} results</button>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- cart drawer + checkout */
export function CartDrawer() {
  const st = useStore()
  const open = st.ui.cart
  const close = () => st.open('cart', false)
  useModal(open, close)
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const need = Math.max(0, FREE_SHIP - (st.subtotal - st.discount))
  const pct = Math.min(100, ((st.subtotal - st.discount) / FREE_SHIP) * 100)
  return (
    <>
      <div className={`scrim ${open ? 'open' : ''}`} onClick={close} />
      <aside className={`drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Your cart" aria-hidden={!open} inert={!open} data-lenis-prevent>
        <div className="drawer-h"><h2>Your dabba ({st.count})</h2><button className="x" onClick={close} aria-label="Close cart">&times;</button></div>
        <div className="ship">
          {st.count === 0 ? 'Free shipping on orders above ' + rupee(FREE_SHIP) : need > 0 ? <>Add <b>{rupee(need)}</b> more for <b>free shipping</b></> : <>You unlocked <b>free shipping</b>. Masala-tov!</>}
          <div className="bar"><i style={{ width: pct + '%' }} /></div>
        </div>
        <div className="lines">
          {st.lines.length === 0 && <p className="empty">Your cart is emptier than a Sunday-night dabba.<br /><button className="btn btn-yellow" style={{ marginTop: 18 }} onClick={() => { close(); location.hash = 'shop' }}>Go shop</button></p>}
          {st.lines.map((l) => (
            <div className="line" key={l.key} style={{ '--c': l.color }}>
              <div className="th">{l.kind === 'product' ? <PouchSVG sku={l.p} /> : <SpiceGlyph k="gift" size={50} />}</div>
              <div>
                <h4>{l.name}</h4>
                <small>{l.sub} &middot; {rupee(l.price)}</small><br />
                <Stepper qty={l.qty} label={`${l.name} quantity`} onDec={() => st.inc(l.key, -1)} onInc={() => st.inc(l.key, 1)} />
              </div>
              <div className="lt"><b>{rupee(l.price * l.qty)}</b><button onClick={() => st.remove(l.key)} aria-label={`Remove ${l.name}`}>Remove</button></div>
            </div>
          ))}
        </div>
        {st.lines.length > 0 && (
          <div className="drawer-f">
            {st.couponCode ? (
              <div className="coupon ok"><span><b>{st.couponCode}</b> applied: {st.coupon.label}</span><button onClick={st.removeCoupon}>Remove</button></div>
            ) : (
              <form className="coupon" onSubmit={(e) => { e.preventDefault(); setErr(st.applyCoupon(code)); }}>
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code (try FIRST10)" aria-label="Coupon code" />
                <button className="btn btn-sm btn-yellow" type="submit">Apply</button>
              </form>
            )}
            {err && !st.couponCode && <p className="cerr" role="alert">{err}</p>}
            <dl className="tot">
              <div><dt>Subtotal</dt><dd>{rupee(st.subtotal)}</dd></div>
              {st.discount > 0 && <div className="disc"><dt>Discount</dt><dd>&minus;{rupee(st.discount)}</dd></div>}
              <div><dt>Shipping</dt><dd>{st.shipping === 0 ? 'FREE' : rupee(st.shipping)}</dd></div>
              <div className="grand"><dt>Total</dt><dd>{rupee(st.total)}</dd></div>
            </dl>
            <button className="btn btn-red" onClick={() => { close(); st.open('checkout', true) }}>Checkout <Arrow /></button>
            <p className="qv-fine">UPI &middot; Cards &middot; Netbanking &middot; Cash on delivery</p>
          </div>
        )}
      </aside>
    </>
  )
}

export function Checkout() {
  const st = useStore()
  const open = st.ui.checkout
  const close = () => st.open('checkout', false)
  useModal(open, close)
  const [done, setDone] = useState(null)
  const [pay, setPay] = useState('upi')
  useEffect(() => { if (open) setDone(null) }, [open])
  if (!open) return null
  if (done) return (
    <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="qv-modal done" role="dialog" aria-modal="true" aria-label="Order placed">
        <button className="x qv-x" onClick={close} aria-label="Close">&times;</button>
        <div className="done-in"><SpiceGlyph k="chilli" size={120} /><h2>Order placed!</h2><p className="kicker">#{done}</p><p>Your spices are being ground right now. We will WhatsApp you the tracking link. (This is a demo checkout, nothing was charged.)</p><button className="btn btn-yellow" onClick={close}>Keep shopping</button></div>
      </div>
    </div>
  )
  return (
    <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <form className="qv-modal co" role="dialog" aria-modal="true" aria-label="Checkout" onSubmit={(e) => { e.preventDefault(); setDone('KS' + Math.floor(100000 + Math.random() * 899999)); st.clear() }}>
        <button type="button" className="x qv-x" onClick={close} aria-label="Close checkout">&times;</button>
        <div className="co-form">
          <h2>Checkout</h2>
          <div className="f2"><label>Name<input required autoComplete="name" /></label><label>Phone<input required inputMode="tel" autoComplete="tel" /></label></div>
          <label>Address<input required autoComplete="street-address" /></label>
          <div className="f2"><label>Pincode<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} /></label><label>City<input required autoComplete="address-level2" /></label></div>
          <fieldset><legend>Payment</legend>
            {[['upi', 'UPI (GPay, PhonePe)'], ['card', 'Credit / Debit card'], ['cod', 'Cash on delivery']].map(([v, l]) => <label key={v} className={`radio ${pay === v ? 'on' : ''}`}><input type="radio" name="pay" checked={pay === v} onChange={() => setPay(v)} />{l}</label>)}
          </fieldset>
        </div>
        <div className="co-sum">
          <h3>Order summary</h3>
          {st.lines.map((l) => <div key={l.key} className="sl"><span>{l.qty} &times; {l.name} <small>{l.sub}</small></span><b>{rupee(l.price * l.qty)}</b></div>)}
          <div className="sl"><span>Shipping</span><b>{st.shipping ? rupee(st.shipping) : 'FREE'}</b></div>
          {st.discount > 0 && <div className="sl"><span>Coupon {st.couponCode}</span><b>&minus;{rupee(st.discount)}</b></div>}
          <div className="sl grand"><span>Total</span><b>{rupee(st.total)}</b></div>
          <button className="btn btn-red" type="submit" disabled={st.lines.length === 0}>Place order {pay === 'cod' ? '(pay on delivery)' : ''}</button>
        </div>
      </form>
    </div>
  )
}

export function Toast() {
  const st = useStore()
  return <div className={`toast ${st.toast && !st.ui.cart ? 'show' : ''}`} role="status" aria-live="polite">{st.toast || ' '}</div>
}
