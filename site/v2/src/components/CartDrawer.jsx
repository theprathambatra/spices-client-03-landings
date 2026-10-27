import { useState } from 'react'
import { FREE_SHIP, SHIP_FEE, inr, COUPONS, catalogue, defaultSize } from '../brand'
import { useCart } from '../cart'
import JarArt from './JarArt'
import { Stepper } from './Bits'

export default function CartDrawer() {
  const c = useCart()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState(null)
  const left = Math.max(0, FREE_SHIP - c.after)
  const upsell = catalogue.filter((p) => !p.combo && !c.lines.some((l) => l.p.id === p.id)).slice(2, 5)
  return (
    <>
      <div className={'scrim' + (c.drawer ? ' on' : '')} onClick={c.closeAll} />
      <aside className={'drawer' + (c.drawer ? ' on' : '')} aria-hidden={!c.drawer} role="dialog" aria-label="Cart">
        <div className="dr-head"><h3>Your <em>dabba</em> <small>({c.count})</small></h3><button className="ic" onClick={c.closeAll} aria-label="Close cart">✕</button></div>
        <div className="ship">
          <p>{left > 0 ? <>Add <b>{inr(left)}</b> more for <b>free shipping</b></> : <><b>Free shipping unlocked.</b> Your dabba rides on us.</>}</p>
          <div className="ship-bar"><i style={{ width: Math.min(100, (c.after / FREE_SHIP) * 100) + '%' }} /></div>
        </div>
        <div className="dr-scroll">
          <ul className="dr-lines">
            {c.lines.length === 0 && <li className="empty">Your dabba is empty. Kitchens are not built on good intentions — pick a jar.</li>}
            {c.lines.map(({ k, p, size, q }) => (
              <li key={k}>
                <span className="sw" style={{ background: p.tint }}><JarArt p={p} uid={'d' + k} /></span>
                <div className="dl-t"><b>{p.name}</b><small>{size.label} · {inr(size.price)} each</small>
                  <Stepper small q={q} onChange={(n) => c.setQty(k, n)} />
                </div>
                <div className="dl-r"><span className="pr">{inr(size.price * q)}</span><button className="rm" onClick={() => c.setQty(k, 0)} aria-label={`Remove ${p.name}`}>Remove</button></div>
              </li>
            ))}
          </ul>
          {c.lines.length > 0 && upsell.length > 0 && (
            <div className="upsell"><h4>Forgot something?</h4>
              {upsell.map((p) => { const s = defaultSize(p); return (
                <div key={p.id} className="up"><span className="sw sm" style={{ background: p.tint }}><i style={{ background: p.fill }} /></span><span><b>{p.name}</b><small>{s.label} · {inr(s.price)}</small></span><button className="plus" onClick={() => c.add(p.id, s.label)} aria-label={`Add ${p.name}`}>+</button></div>
              ) })}
            </div>
          )}
        </div>
        <div className="dr-foot">
          <form className="coupon" onSubmit={(e) => { e.preventDefault(); if (code) setMsg(c.applyCoupon(code)) }}>
            {c.coupon ? (
              <div className="cp-on"><span><b>{c.coupon}</b> · {COUPONS[c.coupon].label}</span><button type="button" onClick={() => { c.setCoupon(null); setMsg(null); setCode('') }}>Remove</button></div>
            ) : (
              <><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code (try FIRST10)" aria-label="Coupon code" /><button className="btn btn-dark sm">Apply</button></>
            )}
          </form>
          {msg && !c.coupon && <p className={'cp-msg ' + (msg.ok ? 'ok' : 'bad')}>{msg.msg}</p>}
          <dl className="sum">
            <div><dt>Subtotal</dt><dd>{inr(c.subtotal)}</dd></div>
            {c.mrpTotal > c.subtotal && <div className="save"><dt>You save</dt><dd>{inr(c.mrpTotal - c.subtotal)}</dd></div>}
            {c.discount > 0 && <div className="save"><dt>Coupon</dt><dd>− {inr(c.discount)}</dd></div>}
            <div><dt>Shipping</dt><dd>{c.count === 0 ? '—' : c.shipping ? inr(SHIP_FEE) : 'Free'}</dd></div>
            <div className="tot"><dt>Total</dt><dd>{inr(c.total)}</dd></div>
          </dl>
          <button className="btn btn-red wide" disabled={!c.count} onClick={() => { c.setDrawer(false); c.setCheckout('form') }}>Checkout · {inr(c.total)}</button>
          <p className="dr-pay">UPI · Cards · Net banking · Cash on delivery</p>
        </div>
      </aside>
      <Checkout />
      <div className={'toast' + (c.toast ? ' on' : '')} role="status">{c.toast?.msg}</div>
    </>
  )
}

function Checkout() {
  const c = useCart()
  const [pay, setPay] = useState('upi')
  const [order] = useState(() => 'KS' + Math.floor(100000 + Math.random() * 899999))
  const open = !!c.checkout
  const done = c.checkout === 'done'
  return (
    <div className={'qv-ov co' + (open ? ' on' : '')} role="dialog" aria-modal="true" aria-label="Checkout" aria-hidden={!open}>
      <div className="qv-bg" onClick={c.closeAll} />
      <div className="co-box">
        <button className="qv-x" onClick={() => { if (done) c.clear(); c.closeAll() }} aria-label="Close checkout">✕</button>
        {done ? (
          <div className="co-done">
            <div className="stamp-ok">✓</div>
            <h2 className="display">ORDER <em>placed.</em></h2>
            <p>Shukriya! Order <b>{order}</b> is being ground and packed. We will WhatsApp you the tracking link.</p>
            <button className="btn btn-red" onClick={() => { c.clear(); c.closeAll() }}>Keep shopping</button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); c.setCheckout('done') }}>
            <h2 className="display">ALMOST <em>there.</em></h2>
            <p className="co-sub">{c.count} item{c.count === 1 ? '' : 's'} · {inr(c.total)} {c.shipping === 0 && '· free shipping'}</p>
            <div className="co-grid">
              <label>Full name<input required autoComplete="name" /></label>
              <label>Mobile<input required inputMode="tel" pattern="[0-9]{10}" placeholder="10-digit number" /></label>
              <label className="full">Address<input required autoComplete="street-address" /></label>
              <label>Pincode<input required inputMode="numeric" pattern="[0-9]{6}" /></label>
              <label>City<input required /></label>
            </div>
            <fieldset className="co-pay"><legend>Payment</legend>
              {[['upi', 'UPI'], ['card', 'Card'], ['cod', 'Cash on delivery']].map(([k, t]) => <label key={k} className={pay === k ? 'on' : ''}><input type="radio" name="pay" checked={pay === k} onChange={() => setPay(k)} />{t}</label>)}
            </fieldset>
            <button className="btn btn-red wide">{pay === 'cod' ? 'Place order (pay on delivery)' : `Pay ${inr(c.total)}`}</button>
            <p className="co-note">Demo checkout — no payment is taken.</p>
          </form>
        )}
      </div>
    </div>
  )
}
