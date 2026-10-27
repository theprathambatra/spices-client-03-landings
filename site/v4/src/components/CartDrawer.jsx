import { useState } from 'react'
import { useStore, inr, FREE_SHIP, COUPONS, byId } from '../store'
import Pack from './Pack'

function Thumb({ l }) {
  const p = byId[l.id]
  return <div className="line-thumb" style={{ background: l.color + '33' }}>{p ? <Pack p={p} /> : <span className="bundle-ic">❖</span>}</div>
}

export default function CartDrawer() {
  const s = useStore()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const open = s.drawer === 'cart'
  const need = Math.max(0, FREE_SHIP - (s.subtotal - s.discount))
  const pct = Math.min(100, ((s.subtotal - s.discount) / FREE_SHIP) * 100)
  return (
    <>
      <div className={'scrim' + (open ? ' on' : '')} onClick={() => s.setDrawer(null)} />
      <aside className={'drawer cart' + (open ? ' on' : '')} aria-hidden={!open} aria-label="Shopping cart" inert={!open}>
        <header>
          <h2>Your thali <small>({s.count})</small></h2>
          <button className="x" onClick={() => s.setDrawer(null)} aria-label="Close cart">×</button>
        </header>
        <div className="ship">
          <p>{need > 0 ? <>Add <b>{inr(need)}</b> more for <b>free shipping</b></> : <>You’ve unlocked <b>free shipping</b> 🎉</>}</p>
          <div className="bar"><i style={{ width: pct + '%' }} /><span style={{ left: pct + '%' }} aria-hidden="true">❀</span></div>
        </div>
        <div className="lines">
          {s.list.length === 0 && (
            <div className="empty"><p className="hi" lang="hi">थाली खाली है</p><p>Your thali is empty. Even the elephant is judging.</p><button className="btn btn-solid" onClick={() => { s.setDrawer(null); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }}>Fill it up</button></div>
          )}
          {s.list.map((l) => (
            <div className="line" key={l.key}>
              <Thumb l={l} />
              <div className="line-info">
                <h3>{l.name}</h3>
                <p>{l.size}{l.mrp > l.price && <> · <span className="save">save {inr((l.mrp - l.price) * l.qty)}</span></>}</p>
                <div className="stepper sm"><button aria-label="Decrease" onClick={() => s.setQty(l.key, l.qty - 1)}>−</button><output>{l.qty}</output><button aria-label="Increase" onClick={() => s.setQty(l.key, l.qty + 1)}>+</button></div>
              </div>
              <div className="line-price"><strong>{inr(l.price * l.qty)}</strong><button className="rm" onClick={() => s.setQty(l.key, 0)}>Remove</button></div>
            </div>
          ))}
        </div>
        {s.list.length > 0 && (
          <footer>
            <form className="coupon" onSubmit={(e) => { e.preventDefault(); const ok = s.applyCoupon(code); setMsg(ok ? 'Coupon applied' : 'That code is not valid. Try FIRST10'); setCode('') }}>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code (try FIRST10)" aria-label="Coupon code" />
              <button className="btn btn-ghost">Apply</button>
            </form>
            {(msg || s.coupon) && <p className={'cmsg' + (s.coupon && s.couponOk ? ' ok' : '')}>
              {s.coupon ? (s.couponOk ? `${s.coupon}: ${COUPONS[s.coupon].label}` : `${s.coupon} needs ${inr(COUPONS[s.coupon].min)}+`) : msg}
              {s.coupon && <button onClick={() => { s.clearCoupon(); setMsg('') }}>remove</button>}
            </p>}
            <dl className="totals">
              <div><dt>Subtotal</dt><dd>{inr(s.subtotal)}</dd></div>
              {s.discount > 0 && <div className="disc"><dt>Coupon</dt><dd>−{inr(s.discount)}</dd></div>}
              <div><dt>Shipping</dt><dd>{s.shipping ? inr(s.shipping) : 'Free'}</dd></div>
              <div className="grand"><dt>Total</dt><dd>{inr(s.total)}</dd></div>
            </dl>
            <button className="btn btn-solid big wide" onClick={() => s.setDrawer('checkout')}>Checkout · {inr(s.total)}</button>
            <p className="pay">UPI · Cards · NetBanking · COD · 7-day easy returns</p>
          </footer>
        )}
      </aside>
    </>
  )
}

export function Checkout() {
  const s = useStore()
  const [done, setDone] = useState(false)
  const open = s.drawer === 'checkout'
  if (!open) return null
  return (
    <div className="modal-wrap" onClick={() => s.setDrawer(null)}>
      <div className="modal checkout" role="dialog" aria-modal="true" aria-label="Checkout" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={() => { s.setDrawer(null); setDone(false) }} aria-label="Close">×</button>
        {done ? (
          <div className="thanks"><p className="hi" lang="hi">धन्यवाद</p><h3>Your darbar is on its way.</h3><p>Order confirmed (this is a demo). We’ll message you on WhatsApp when it leaves our Indore kitchen.</p><button className="btn btn-solid" onClick={() => { s.clearCart(); s.setDrawer(null); setDone(false) }}>Continue shopping</button></div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setDone(true) }}>
            <h3>Almost there</h3>
            <p className="muted">{s.count} items · {inr(s.total)}{s.shipping === 0 ? ' · free shipping' : ''}</p>
            <label>Full name<input required autoComplete="name" /></label>
            <label>Mobile (WhatsApp)<input required inputMode="tel" pattern="[0-9]{10}" placeholder="10-digit number" autoComplete="tel" /></label>
            <label>Pincode<input required inputMode="numeric" pattern="[0-9]{6}" placeholder="6 digits" autoComplete="postal-code" /></label>
            <label>Address<textarea required rows="2" autoComplete="street-address" /></label>
            <fieldset><legend>Payment</legend>
              {['UPI (GPay, PhonePe, Paytm)', 'Card / NetBanking', 'Cash on delivery (+₹30)'].map((m, i) => <label className="radio" key={m}><input type="radio" name="pay" defaultChecked={i === 0} /> {m}</label>)}
            </fieldset>
            <button className="btn btn-solid big wide">Place order · {inr(s.total)}</button>
          </form>
        )}
      </div>
    </div>
  )
}
