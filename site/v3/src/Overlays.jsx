import { useEffect, useMemo, useRef, useState } from 'react'
import { products, heroSkus, BRAND } from './data'
import { useStore, rupee, priceFor, sizesFor, off } from './store'
import { scrollToTarget, setScrollLocked } from './ui/SmoothScroll'
import TinArt from './ui/TinArt'
import { Stars, Heart, Purchase } from './ProductCard'

function useModal(open, close) {
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', k)
    document.documentElement.classList.add('locked')
    setScrollLocked(true)
    return () => { window.removeEventListener('keydown', k); document.documentElement.classList.remove('locked'); setScrollLocked(false) }
  }, [open, close])
}

function Scrim({ open, onClose }) {
  return <div className={`scrim ${open ? 'is-open' : ''}`} onClick={onClose} />
}

/* ---------------- Cart ---------------- */
export function CartDrawer() {
  const s = useStore()
  const { lines, count, subtotal, discount, shipping, total, toFree, freePct, coupon, setCoupon, setQtyKey, panel, setPanel, say } = s
  const open = panel === 'cart'
  const close = () => setPanel(null)
  useModal(open, close)
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const apply = (e) => {
    e.preventDefault()
    if (code.trim().toUpperCase() === 'FIRST10') { setCoupon('FIRST10'); setErr(''); say('FIRST10 applied. Ten percent, gladly.') }
    else setErr('That code is not in the vault. Try FIRST10.')
  }
  const ref = useRef(null)
  useEffect(() => { if (open) ref.current?.focus() }, [open])
  return (
    <>
      <Scrim open={open} onClose={close} />
      <aside className={`drawer ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Cart" aria-hidden={!open} data-lenis-prevent>
        <div className="drawer__top">
          <h3 className="drawer__title">Your vault <small>({count})</small></h3>
          <button ref={ref} className="label link" onClick={close}>Close</button>
        </div>
        <div className="ship">
          <p>{toFree > 0 ? <>Add <b>{rupee(toFree)}</b> more for free shipping</> : <>You have unlocked free shipping.</>}</p>
          <div className="ship__bar"><i style={{ width: freePct + '%' }} /></div>
        </div>
        <ul className="drawer__list">
          {lines.length === 0 && (
            <li className="drawer__empty">
              <p>Nothing in the vault yet. The saffron is lonely.</p>
              <button className="btn btn--ghost btn--sm" onClick={() => { close(); scrollToTarget('#shop') }}>Browse the spices</button>
            </li>
          )}
          {lines.map((it) => (
            <li key={it.key}>
              <div className="drawer__art"><TinArt color={it.color} /></div>
              <div>
                <h4>{it.name}</h4>
                <p>{it.size} · {rupee(it.price)}</p>
                <div className="qty">
                  <button onClick={() => setQtyKey(it.key, it.qty - 1)} aria-label="Decrease">−</button>
                  <span>{it.qty}</span>
                  <button onClick={() => setQtyKey(it.key, it.qty + 1)} aria-label="Increase">+</button>
                  <button className="link label rm" onClick={() => setQtyKey(it.key, 0)}>Remove</button>
                </div>
              </div>
              <b>{rupee(it.price * it.qty)}</b>
            </li>
          ))}
        </ul>
        {lines.length > 0 && (
          <div className="drawer__foot">
            {coupon ? (
              <p className="coupon-on"><span className="label">Code {coupon}</span> <button className="link label" onClick={() => setCoupon('')}>Remove</button></p>
            ) : (
              <form className="coupon" onSubmit={apply}>
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" />
                <button className="label">Apply</button>
              </form>
            )}
            {err && <p className="err">{err}</p>}
            <dl className="sum">
              <div><dt>Subtotal</dt><dd>{rupee(subtotal)}</dd></div>
              {discount > 0 && <div><dt>Discount</dt><dd>− {rupee(discount)}</dd></div>}
              <div><dt>Shipping</dt><dd>{shipping ? rupee(shipping) : 'Free'}</dd></div>
              <div className="sum__t"><dt>Total</dt><dd>{rupee(total)}</dd></div>
            </dl>
            <button className="btn btn--gold btn--full" onClick={() => setPanel('checkout')}>Checkout</button>
            <p className="pay label">UPI · Cards · COD · Secure</p>
          </div>
        )}
      </aside>
    </>
  )
}

export function Checkout() {
  const { panel, setPanel, total, count, clear, say } = useStore()
  const open = panel === 'checkout'
  const [done, setDone] = useState(false)
  const close = () => { setPanel(null); setTimeout(() => setDone(false), 400) }
  useModal(open, close)
  const submit = (e) => { e.preventDefault(); setDone(true); clear() }
  return (
    <>
      <Scrim open={open} onClose={close} />
      <div className={`modal modal--sm ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Checkout" aria-hidden={!open}>
        <button className="modal__x label link" onClick={close}>Close</button>
        {done ? (
          <div className="done">
            <p className="label">Order confirmed</p>
            <h3>Thank you. Your tins are being wrapped.</h3>
            <p>A WhatsApp confirmation is on its way. Delivery in 3 to 5 days.</p>
            <button className="btn btn--gold" onClick={close}>Keep browsing</button>
          </div>
        ) : (
          <form onSubmit={submit} className="co">
            <p className="label">Checkout · demo</p>
            <h3>Where should we send it?</h3>
            <input required placeholder="Full name" aria-label="Full name" />
            <input required type="tel" placeholder="Mobile (for WhatsApp updates)" aria-label="Mobile" />
            <input required placeholder="Address and PIN code" aria-label="Address" />
            <div className="co__pay" role="radiogroup" aria-label="Payment">
              {['UPI', 'Card', 'Cash on delivery'].map((m, i) => (
                <label key={m}><input type="radio" name="pay" defaultChecked={i === 0} /><span>{m}</span></label>
              ))}
            </div>
            <button className="btn btn--gold btn--full">Place order · {rupee(total)} ({count})</button>
          </form>
        )}
      </div>
    </>
  )
}

/* ---------------- Quick view ---------------- */
export function QuickView() {
  const { quick, setQuick, qtyOf, addLine, setPanel, wish } = useStore()
  const p = products.find((x) => x.id === quick)
  const hero = heroSkus.find((x) => x.id === quick)
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  useEffect(() => { if (p) { setSize(p.weight); setQty(1) } }, [quick]) // eslint-disable-line
  const close = () => setQuick(null)
  useModal(!!p, close)
  const open = !!p
  const buyNow = () => { addLine(p, size, qty, false); setQuick(null); setPanel('checkout') }
  return (
    <>
      <Scrim open={open} onClose={close} />
      <div className={`modal ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label={p ? p.name : 'Quick view'} aria-hidden={!open} data-lenis-prevent>
        <button className="modal__x label link" onClick={close}>Close</button>
        {p && (
          <div className="qv" style={{ '--c': p.color }}>
            <div className="qv__vis"><span className="pc__glow" /><TinArt color={p.color} label={p.name} />{p.tag && <span className="badge">{p.tag}</span>}</div>
            <div className="qv__info">
              <p className="label">{p.origin} · {p.native}</p>
              <h3>{p.name}</h3>
              <p className="pc__rate"><Stars r={p.rating} /> <span>{p.rating} · {p.reviews.toLocaleString('en-IN')} reviews</span> <span className="verified">Verified buyers</span></p>
              <p className="qv__desc">{hero ? hero.line : `${p.notes}.`} Ground in small batches, sealed the same week, stamped with the harvest date. No fillers, no colour, no shortcuts.</p>
              <dl className="notes notes--sm">
                <div><dt>Notes</dt><dd>{hero?.aroma || p.notes}</dd></div>
                <div><dt>Origin</dt><dd>{p.origin}</dd></div>
                <div><dt>Heat</dt><dd>{p.heat} of 5</dd></div>
                <div><dt>Pairs with</dt><dd>{hero?.pairing || 'Dals, sabzis, rice, and the last two minutes of a tadka'}</dd></div>
              </dl>
              <div className="chips" role="radiogroup" aria-label="Size">
                {sizesFor(p).map(([s]) => (<button key={s} role="radio" aria-checked={s === size} className={s === size ? 'is-on' : ''} onClick={() => setSize(s)}>{s}</button>))}
              </div>
              <div className="pc__price pc__price--lg">
                <b>{rupee(priceFor(p, size || p.weight).price * qty)}</b> <s>{rupee(priceFor(p, size || p.weight).mrp * qty)}</s> <em>{off(p)}% off</em>
              </div>
              <div className="qv__act">
                <div className="qty qty--lg">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button><span>{qty}</span><button onClick={() => setQty(qty + 1)} aria-label="Increase">+</button>
                </div>
                <button className="btn btn--gold" onClick={() => { addLine(p, size, qty, false); setQuick(null); setPanel('cart') }}>Add to cart</button>
                <button className="btn btn--ghost" onClick={buyNow}>Buy now</button>
                <Heart id={p.id} />
              </div>
              <p className="label dim">{qtyOf(p.id, size) > 0 ? `${qtyOf(p.id, size)} already in your cart · ` : ''}COD available · Easy 7-day returns</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/* ---------------- Search ---------------- */
export function Search() {
  const { panel, setPanel, setQuick } = useStore()
  const open = panel === 'search'
  const [q, setQ] = useState('')
  const input = useRef(null)
  const close = () => setPanel(null)
  useModal(open, close)
  useEffect(() => { if (open) setTimeout(() => input.current?.focus(), 200) }, [open])
  const res = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return products.filter((p) => p.tag === 'Bestseller').slice(0, 6)
    return products.filter((p) => (p.name + p.native + p.cat + p.origin + p.notes).toLowerCase().includes(t))
  }, [q])
  return (
    <div className={`search ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Search" aria-hidden={!open} data-lenis-prevent>
      <div className="search__in">
        <button className="modal__x label link" onClick={close}>Close</button>
        <label className="label" htmlFor="q">Search the vault</label>
        <input id="q" ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Saffron, pepper, kerala, smoky…" autoComplete="off" />
        <p className="label dim">{q ? `${res.length} result${res.length === 1 ? '' : 's'}` : 'Popular right now'}</p>
        <ul className="search__list">
          {res.map((p) => (
            <li key={p.id}>
              <button onClick={() => { close(); setQuick(p.id) }}>
                <span className="search__art"><TinArt color={p.color} /></span>
                <span><b>{p.name}</b><small>{p.origin} · {p.notes}</small></span>
                <span className="search__p">{rupee(p.price)}</span>
              </button>
            </li>
          ))}
          {res.length === 0 && <li className="drawer__empty">Nothing matches. Try “pepper” or “Kerala”.</li>}
        </ul>
      </div>
    </div>
  )
}

/* ---------------- Mobile menu ---------------- */
export function Menu() {
  const { panel, setPanel } = useStore()
  const open = panel === 'menu'
  const close = () => setPanel(null)
  useModal(open, close)
  const go = (e, h) => { e.preventDefault(); close(); setTimeout(() => scrollToTarget(h), 100) }
  return (
    <div className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open} role="dialog" aria-modal="true" aria-label="Menu">
      <button className="menu__x label link" onClick={close}>Close</button>
      <ul>
        {[['Shop', '#shop'], ['Collection', '#collection'], ['Gifting', '#gifting'], ['Our Story', '#origins'], ['Help', '#footer']].map(([t, h], i) => (
          <li key={h} style={{ '--i': i }}><a href={h} onClick={(e) => go(e, h)}>{t}</a></li>
        ))}
      </ul>
      <p className="label dim">{BRAND} · Free shipping above ₹499 · COD</p>
    </div>
  )
}

export function Toast() {
  const { toast } = useStore()
  return <div className={`toast ${toast ? 'is-on' : ''}`} role="status" aria-live="polite">{toast}</div>
}
