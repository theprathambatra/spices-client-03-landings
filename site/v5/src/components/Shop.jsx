import { useEffect, useMemo, useRef, useState } from 'react'
import { products, byId, kinds, AXES, FREE_SHIP, sizesFor, priceFor, KITS } from '../data'
import { Scramble, Pack, Radar, Magnetic, useCart } from './ui'
import { inr } from '../lib/util'

const off = (p, m) => Math.round(((m - p) / m) * 100)

export function Heart({ id }) {
  const { wish, toggleWish } = useCart()
  const on = wish.includes(id)
  return (
    <button className={'heart' + (on ? ' on' : '')} onClick={(e) => { e.stopPropagation(); toggleWish(id) }} aria-pressed={on} aria-label={(on ? 'Remove from' : 'Add to') + ' wishlist'}>
      <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" /></svg>
    </button>
  )
}

export function Stepper({ q, onChange, label }) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button onClick={() => onChange(q - 1)} aria-label="Decrease quantity">−</button>
      <span aria-live="polite">{q}</span>
      <button onClick={() => onChange(q + 1)} aria-label="Increase quantity">+</button>
    </div>
  )
}

export function ProductCard({ p, i = 0 }) {
  const { add, qtyOf, setQty, setQuick } = useCart()
  const sizes = sizesFor(p)
  const [size, setSize] = useState(p.wt)
  const { price, mrp } = priceFor(p, size)
  const q = qtyOf(p.id, size)
  const badge = p.stock < 10 ? 'Low stock' : p.tag || (p.isNew ? 'New' : '')
  return (
    <article className="pcard">
      <div className="pcard-top mono"><span>{p.sku}</span><Heart id={p.id} /></div>
      <button className="pcard-art" style={{ '--c': p.color }} onClick={() => setQuick(p.id)} aria-label={'Quick view ' + p.name}>
        <Pack p={p} w={160} /><i className="bcard-glow" />
        {badge && <em className={'badge-tag ' + badge.toLowerCase().replace(' ', '-')}>{badge}</em>}
        <span className="qv mono">QUICK VIEW +</span>
      </button>
      <h3 onClick={() => setQuick(p.id)}>{p.name}</h3>
      <p className="mono sm dim">{p.vern} · {p.origin}</p>
      <p className="mono sm stars">★ {p.rating} <span className="dim">({p.reviews.toLocaleString('en-IN')})</span></p>
      <div className="sizes mono" role="radiogroup" aria-label="Size">
        {sizes.map((s) => <button key={s} role="radio" aria-checked={size === s} className={size === s ? 'on' : ''} onClick={() => setSize(s)}>{s}</button>)}
      </div>
      <div className="pcard-foot">
        <div className="price mono"><b>{inr(price)}</b> <s>{inr(mrp)}</s> <em className="pct">{off(price, mrp)}% off</em></div>
        {q > 0 ? <Stepper q={q} onChange={(n) => setQty(p.id, size, n)} label={'Quantity of ' + p.name} /> : <button className="btn btn-dark btn-sm" onClick={() => add(p.id, size)}>Add +</button>}
      </div>
    </article>
  )
}

export function Bestsellers() {
  const list = products.filter((p) => p.tag === 'Bestseller').slice(0, 4)
  return (
    <section className="sec best" id="best">
      <div className="wrap">
        <header className="sec-head row-head">
          <div>
            <p className="eyebrow mono"><i className="dot" /> 01 / Bestsellers</p>
            <h2><Scramble text="Four compounds." /> <em>Forty thousand repeat orders.</em></h2>
          </div>
          <Magnetic><a href="#shop" className="btn btn-ghost-d">Shop all 28 →</a></Magnetic>
        </header>
        <div className="pgrid four">{list.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>
      </div>
    </section>
  )
}

const SORTS = [['pop', 'Popular'], ['lo', 'Price: low → high'], ['hi', 'Price: high → low'], ['new', 'New']]
const COLS = [['sku', 'SKU'], ['name', 'Name'], ['cat', 'Class'], ['origin', 'Origin'], ['shu', 'Heat'], ['rating', 'Rating'], ['price', 'Price']]

export function Catalogue() {
  const { add, cmp, toggleCmp, openCmp } = useCart()
  const [kind, setKind] = useState('All')
  const [sort, setSort] = useState('pop')
  const [view, setView] = useState('grid')
  const [tsort, setTsort] = useState({ k: 'sku', d: 1 })
  const [more, setMore] = useState(12)
  const [hover, setHover] = useState(null)
  const prev = useRef(null)

  const rows = useMemo(() => {
    let r = products.filter((p) => kind === 'All' || p.kind === kind)
    const by = { pop: (a, b) => b.reviews - a.reviews, lo: (a, b) => a.price - b.price, hi: (a, b) => b.price - a.price, new: (a, b) => (b.isNew - a.isNew) || b.reviews - a.reviews }
    r = r.slice().sort(view === 'table' ? (a, b) => (a[tsort.k] > b[tsort.k] ? 1 : a[tsort.k] < b[tsort.k] ? -1 : 0) * tsort.d : by[sort])
    return r
  }, [kind, sort, view, tsort])

  useEffect(() => {
    const m = (e) => { if (prev.current) prev.current.style.transform = `translate3d(${e.clientX + 24}px, ${e.clientY - 120}px, 0)` }
    window.addEventListener('pointermove', m)
    return () => window.removeEventListener('pointermove', m)
  }, [])
  const heat = (p) => (p.shu ? Math.min(5, Math.max(1, Math.round(Math.log10(p.shu) - 2))) : p.radar[0] > 3 ? 1 : 0)
  const shown = kind === 'Combos' ? [] : view === 'grid' ? rows.slice(0, more) : rows

  return (
    <section className="sec index" id="shop">
      <div className="wrap">
        <header className="sec-head row-head">
          <div>
            <p className="eyebrow mono"><i className="dot" /> 04 / Shop · product index</p>
            <h2><Scramble text="All 28 specimens." /> <em>Sort them. Fight them.</em></h2>
          </div>
        </header>
        <div className="toolbar mono">
          <div className="chips" role="tablist">{kinds.map((c) => <button key={c} role="tab" aria-selected={kind === c} className={'chip' + (kind === c ? ' on' : '')} onClick={() => { setKind(c); setMore(12) }}>{c}</button>)}</div>
          <div className="tool-r">
            <label className="sortsel">SORT <select value={sort} onChange={(e) => setSort(e.target.value)} disabled={view === 'table'}>{SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
            <div className="seg" role="group" aria-label="View"><button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')}>Grid</button><button className={view === 'table' ? 'on' : ''} onClick={() => setView('table')}>Index</button></div>
            <span className="count">{kind === 'Combos' ? KITS.length : rows.length} results</span>
          </div>
        </div>

        {kind === 'Combos' && <KitGrid />}
        {kind !== 'Combos' && view === 'grid' && (
          <>
            <div className="pgrid">{shown.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>
            {more < rows.length && <div className="more"><button className="btn btn-dark" onClick={() => setMore(more + 12)}>Load more ({rows.length - more}) +</button></div>}
          </>
        )}
        {kind !== 'Combos' && view === 'table' && (
          <>
            <div className="table-wrap" data-lenis-prevent-x>
              <table className="idx mono">
                <thead>
                  <tr>
                    <th aria-label="Compare" />
                    {COLS.map(([k, l]) => (
                      <th key={k} className={'c-' + k} aria-sort={tsort.k === k ? (tsort.d === 1 ? 'ascending' : 'descending') : 'none'}>
                        <button onClick={() => setTsort((s) => ({ k, d: s.k === k ? -s.d : 1 }))}>{l}<i>{tsort.k === k ? (tsort.d === 1 ? '↑' : '↓') : '↕'}</i></button>
                      </th>
                    ))}
                    <th aria-label="Add" />
                  </tr>
                </thead>
                <tbody>
                  {shown.map((p) => (
                    <tr key={p.id} onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)} className={cmp.includes(p.id) ? 'picked' : ''}>
                      <td><input type="checkbox" checked={cmp.includes(p.id)} onChange={() => toggleCmp(p.id)} aria-label={'Compare ' + p.name} /></td>
                      <td className="c-sku">{p.sku}</td>
                      <td className="c-name"><b>{p.name}</b><small>{p.vern}</small>{p.tag && <em className={'tag ' + p.tag.toLowerCase()}>{p.tag}</em>}</td>
                      <td className="c-cat">{p.cat}</td>
                      <td className="c-origin">{p.origin}</td>
                      <td className="c-shu"><span className="pips" title={p.shu ? p.shu.toLocaleString('en-IN') + ' SHU' : 'No capsaicin'}>{[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= heat(p) ? 'on' : ''} />)}</span></td>
                      <td className="c-rating">★ {p.rating}</td>
                      <td className="c-price"><b>{inr(p.price)}</b><small>{p.wt}</small></td>
                      <td className="c-add"><button className="add" onClick={() => add(p.id, p.wt)} aria-label={'Add ' + p.name + ' to cart'}>+</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="cmp-bar mono">
              <span>{cmp.length ? `${cmp.length}/3 selected` : 'Tick up to 3 rows to compare their flavour radar'}</span>
              <button className="btn btn-dark btn-sm" disabled={cmp.length < 2} onClick={openCmp}>Compare ({cmp.length}) →</button>
            </div>
          </>
        )}
      </div>
      <div className={'hover-prev' + (hover ? ' on' : '')} ref={prev} aria-hidden="true">
        {hover && (<><Pack p={hover} w={110} /><div className="mono"><b>{hover.name}</b><p>{hover.notes}</p><p className="dim">{hover.origin} · {hover.wt}</p></div></>)}
      </div>
    </section>
  )
}

export function KitGrid() {
  const { add } = useCart()
  return (
    <div className="kit-grid">
      {KITS.map((k) => {
        const kp = byId[k.id]
        return (
          <article key={k.id} className="kit">
            <div className="kit-top mono"><b>{k.n}</b><span className="save">SAVE {inr(k.mrp - k.price)} · {off(k.price, k.mrp)}%</span></div>
            <div className="kit-art">{k.ids.map((id, i) => <div key={id} style={{ transform: `translateX(${i * -18}px) rotate(${(i - 1.5) * 4}deg)`, zIndex: i }}><Pack p={byId[id]} w={88} /></div>)}</div>
            <h3>{k.name}</h3>
            <p>{k.note}</p>
            <ul className="mono">{k.ids.map((id) => <li key={id}>{byId[id].name} <span className="dim">{inr(byId[id].price)}</span></li>)}</ul>
            <div className="bcard-foot">
              <span className="price mono"><b>{inr(kp.price)}</b> <s>{inr(k.ids.reduce((a, i) => a + byId[i].price, 0))}</s></span>
              <button className="btn btn-dark btn-sm" onClick={() => add(k.id, kp.wt)}>Add kit +</button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export function QuickView() {
  const { quick, setQuick, add, setCheckout } = useCart()
  const p = quick ? byId[quick] : null
  const [size, setSize] = useState('')
  const [q, setQ] = useState(1)
  useEffect(() => { if (p) { setSize(p.wt); setQ(1) } }, [quick]) // eslint-disable-line
  const closeRef = useRef(null)
  useEffect(() => { if (p) closeRef.current?.focus() }, [p])
  const sizes = p ? sizesFor(p) : []
  const { price, mrp } = p && size ? priceFor(p, size) : { price: 0, mrp: 0 }
  return (
    <>
      <div className={'scrim' + (p ? ' on' : '')} onClick={() => setQuick(null)} />
      <div className={'qview glass-d' + (p ? ' open' : '')} role="dialog" aria-modal="true" aria-label={p ? p.name : 'Quick view'} aria-hidden={!p} data-lenis-prevent>
        {p && (
          <>
            <button ref={closeRef} className="qclose" onClick={() => setQuick(null)} aria-label="Close quick view">✕</button>
            <div className="qart" style={{ '--c': p.color }}>
              <Pack p={p} w={230} /><i className="bcard-glow" />
              <span className="mono qsku">{p.sku} / {p.cat}</span>
            </div>
            <div className="qbody mono">
              <p className="dim">{p.vern} · {p.origin}</p>
              <h3>{p.name}</h3>
              <p className="stars">★ {p.rating} <span className="dim">({p.reviews.toLocaleString('en-IN')} verified reviews)</span></p>
              <p className="qdesc">{p.desc}</p>
              <div className="qradar"><Radar size={210} labels={AXES} series={[{ id: p.id, values: p.radar, color: '#C6FF3D' }]} />
                <dl><div><dt>NOTES</dt><dd>{p.notes}</dd></div><div><dt>HEAT</dt><dd>{p.shu ? p.shu.toLocaleString('en-IN') + ' SHU' : 'none'}</dd></div><div><dt>ORIGIN</dt><dd>{p.origin}</dd></div></dl></div>
              <div className="sizes" role="radiogroup" aria-label="Size">{sizes.map((s) => <button key={s} role="radio" aria-checked={size === s} className={size === s ? 'on' : ''} onClick={() => setSize(s)}>{s}</button>)}</div>
              <div className="price big"><b>{inr(price)}</b> <s>{inr(mrp)}</s> <em className="pct">{off(price, mrp)}% off</em></div>
              <div className="qactions">
                <Stepper q={q} onChange={(n) => setQ(Math.max(1, n))} label="Quantity" />
                <button className="btn btn-lime" onClick={() => { add(p.id, size, q, true); setQuick(null) }}>Add to cart</button>
                <button className="btn btn-dark" onClick={() => { add(p.id, size, q); setQuick(null); setCheckout(true) }}>Buy now</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, setQuick } = useCart()
  const [q, setQ] = useState('')
  const ref = useRef(null)
  useEffect(() => { if (searchOpen) setTimeout(() => ref.current?.focus(), 50) }, [searchOpen])
  const res = useMemo(() => {
    const s = q.trim().toLowerCase()
    const all = Object.values(byId).filter((p) => !p.kit)
    return (s ? all.filter((p) => (p.name + p.origin + p.vern + p.notes + p.cat + p.kind).toLowerCase().includes(s)) : all.filter((p) => p.tag === 'Bestseller')).slice(0, 8)
  }, [q])
  return (
    <div className={'search-ov' + (searchOpen ? ' open' : '')} role="dialog" aria-modal="true" aria-label="Search" aria-hidden={!searchOpen} data-lenis-prevent>
      <div className="search-in">
        <div className="search-bar mono"><span>⌕</span><input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search turmeric, Kerala, smoky, chai…" aria-label="Search products" /><button onClick={() => setSearchOpen(false)} aria-label="Close search">ESC ✕</button></div>
        <p className="mono dim sm">{q ? res.length + ' results' : 'Bestsellers'}</p>
        <ul className="search-res">
          {res.map((p) => (
            <li key={p.id}><button onClick={() => { setSearchOpen(false); setQuick(p.id) }}>
              <Pack p={p} w={40} /><span><b>{p.name}</b><small className="mono">{p.vern} · {p.origin}</small></span><span className="mono">{inr(p.price)}</span>
            </button></li>
          ))}
          {!res.length && <li className="mono dim pad">Nothing in the lab matches “{q}”. Try “pepper” or “Kerala”.</li>}
        </ul>
      </div>
    </div>
  )
}

const CMP_COL = ['#C6FF3D', '#FF3B1F', '#6BB7FF']
export function CompareDrawer() {
  const { cmp, toggleCmp, cmpOpen, closeCmp, add } = useCart()
  const items = cmp.map((id) => byId[id])
  return (
    <div className={'drawer cmp glass-d' + (cmpOpen ? ' open' : '')} role="dialog" aria-label="Compare spices" aria-hidden={!cmpOpen} data-lenis-prevent>
      <div className="drawer-head mono"><b>COMPARE / FLAVOUR RADAR</b><button onClick={closeCmp} aria-label="Close compare">✕</button></div>
      {items.length < 2 ? <p className="mono dim pad">Select at least two products in the index view.</p> : (
        <div className="cmp-body">
          <Radar size={300} labels={AXES} series={items.map((p, i) => ({ id: p.id, values: p.radar, color: CMP_COL[i] }))} />
          <div className="cmp-cols">
            {items.map((p, i) => (
              <div key={p.id} className="cmp-col mono">
                <i style={{ background: CMP_COL[i] }} /><b>{p.name}</b>
                <dl>
                  <div><dt>Origin</dt><dd>{p.origin}</dd></div>
                  <div><dt>Heat</dt><dd>{p.shu ? p.shu.toLocaleString('en-IN') + ' SHU' : '—'}</dd></div>
                  <div><dt>Notes</dt><dd>{p.notes}</dd></div>
                  <div><dt>Price</dt><dd>{inr(p.price)} / {p.wt}</dd></div>
                </dl>
                <div className="cmp-actions"><button className="btn btn-dark btn-sm" onClick={() => add(p.id, p.wt)}>Add +</button><button className="link" onClick={() => toggleCmp(p.id)}>remove</button></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function CartDrawer() {
  const { items, open, setOpen, setQty, sub, discount, ship, total, count, coupon, setCoupon, after, setCheckout, pct } = useCart()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const left = FREE_SHIP - after
  const apply = (e) => {
    e.preventDefault()
    const c = code.trim().toUpperCase()
    if (['FIRST10', 'ASSAY10', 'LABDROP'].includes(c)) { setCoupon(c); setMsg('Applied ' + c); setCode('') } else setMsg('Code not recognised. Try FIRST10.')
  }
  return (
    <>
      <div className={'scrim' + (open ? ' on' : '')} onClick={() => setOpen(false)} />
      <aside className={'drawer cart glass-d' + (open ? ' open' : '')} role="dialog" aria-modal="true" aria-label="Cart" aria-hidden={!open} data-lenis-prevent>
        <div className="drawer-head mono"><b>CART [{String(count).padStart(2, '0')}]</b><button onClick={() => setOpen(false)} aria-label="Close cart">✕</button></div>
        <div className="ship mono">
          <p>{left <= 0 ? 'Free shipping unlocked.' : `Add ${inr(left)} more for free shipping`}</p>
          <div className="ship-bar"><i style={{ width: Math.min(100, (after / FREE_SHIP) * 100) + '%' }} /></div>
        </div>
        <ul className="lines">
          {items.length === 0 && <li className="mono dim pad">Cart is empty. The spices are not going to season themselves.</li>}
          {items.map(({ k, p, size, q, unit }) => (
            <li key={k}>
              <Pack p={p} w={52} />
              <div className="mono"><b>{p.name}</b><small>{p.sku} · {size}</small>
                <Stepper q={q} onChange={(n) => setQty(p.id, size, n)} label={'Quantity of ' + p.name} />
                <button className="link rm" onClick={() => setQty(p.id, size, 0)}>remove</button></div>
              <span className="mono">{inr(unit * q)}</span>
            </li>
          ))}
        </ul>
        <div className="cart-foot mono">
          <form className="coupon" onSubmit={apply}>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder={coupon ? coupon + ' applied' : 'COUPON (try FIRST10)'} aria-label="Coupon code" />
            <button className="btn btn-sm btn-lime">Apply</button>
          </form>
          {msg && <small className="cmsg">{msg}</small>}
          <div className="row"><span>Subtotal</span><b>{inr(sub)}</b></div>
          {pct > 0 && <div className="row lime"><span>Coupon {coupon} (−{pct}%)</span><b>−{inr(discount)}</b></div>}
          <div className="row"><span>Shipping</span><b>{ship ? inr(ship) : 'FREE'}</b></div>
          <div className="row tot"><span>Total</span><b>{inr(total)}</b></div>
          <button className="btn btn-lime btn-block" disabled={!items.length} onClick={() => { setOpen(false); setCheckout(true) }}>Checkout →</button>
          <small>UPI · Cards · COD available · Ships in 24h from Kochi</small>
        </div>
      </aside>
    </>
  )
}

export function Checkout() {
  const { checkout, setCheckout, total, items, clear, count } = useCart()
  const [step, setStep] = useState(0)
  useEffect(() => { if (checkout) setStep(0) }, [checkout])
  const done = (e) => { e.preventDefault(); setStep(1); clear() }
  return (
    <>
      <div className={'scrim' + (checkout ? ' on' : '')} onClick={() => setCheckout(false)} />
      <div className={'qview checkout glass-d' + (checkout ? ' open' : '')} role="dialog" aria-modal="true" aria-label="Checkout" aria-hidden={!checkout} data-lenis-prevent>
        <button className="qclose" onClick={() => setCheckout(false)} aria-label="Close checkout">✕</button>
        {step === 0 ? (
          <form className="qbody mono co-form" onSubmit={done}>
            <p className="dim">Step 1/1 · Delivery &amp; payment (demo)</p>
            <h3>Checkout · {inr(total)}</h3>
            <label>Name<input required defaultValue="" autoComplete="name" /></label>
            <label>Mobile (WhatsApp)<input required inputMode="tel" autoComplete="tel" /></label>
            <label>Pincode<input required inputMode="numeric" maxLength={6} autoComplete="postal-code" /></label>
            <label>Address<input required autoComplete="street-address" /></label>
            <fieldset><legend>Payment</legend>
              <label className="radio"><input type="radio" name="pay" defaultChecked /> UPI (GPay / PhonePe / Paytm)</label>
              <label className="radio"><input type="radio" name="pay" /> Card / Netbanking</label>
              <label className="radio"><input type="radio" name="pay" /> Cash on delivery (+₹30)</label></fieldset>
            <button className="btn btn-lime btn-block" disabled={!count && !total}>Place order · {inr(total)}</button>
          </form>
        ) : (
          <div className="qbody mono co-done"><p className="dim">ORDER LOGGED</p><h3>Batch confirmed.</h3><p>Order KL-{Math.floor(10000 + Math.random() * 89999)} is queued for grinding. A WhatsApp confirmation is on its way. (Mock checkout, nothing was charged.)</p><button className="btn btn-dark" onClick={() => setCheckout(false)}>Back to the lab</button></div>
        )}
      </div>
    </>
  )
}
