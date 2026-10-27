import { useEffect, useRef, useState } from 'react'
import { useStore, sizesFor, priceFor, productItem, inr, byId } from '../store'
import Pack from './Pack'
import { Stars } from './Ornaments'
import { Heart } from './ProductCard'

export default function QuickView() {
  const { quick, setQuick, add, setDrawer } = useStore()
  const p = quick && byId[quick]
  const [size, setSize] = useState(null)
  const [qty, setQty] = useState(1)
  const ref = useRef(null)
  useEffect(() => { if (p) { setSize(sizesFor(p).find((s) => s.mult === 1)?.label || sizesFor(p)[0].label); setQty(1); setTimeout(() => ref.current?.focus(), 30) } }, [quick])
  if (!p) return null
  const sizes = sizesFor(p)
  const { price, mrp } = priceFor(p, size || sizes[0].label)
  const item = productItem(p, size)
  const heat = '🌶'.repeat(0)
  return (
    <div className="modal-wrap" onClick={() => setQuick(null)}>
      <div className="modal qv" role="dialog" aria-modal="true" aria-label={p.name} onClick={(e) => e.stopPropagation()} style={{ '--pc': p.color }}>
        <button ref={ref} className="x" aria-label="Close" onClick={() => setQuick(null)}>×</button>
        <div className="qv-visual"><Pack p={p} /><Heart id={p.id} /></div>
        <div className="qv-info">
          <p className="origin"><span lang="hi">{p.hi}</span> · {p.origin}</p>
          <h3>{p.name}</h3>
          <div className="rate"><Stars value={p.rating} size={16} /> <b>{p.rating}</b> <span>{p.reviews.toLocaleString('en-IN')} verified reviews</span></div>
          <p className="qv-story">{p.story} {p.notes}.</p>
          <dl className="qv-facts">
            <div><dt>Tasting notes</dt><dd>{p.notes}</dd></div>
            <div><dt>Origin</dt><dd>{p.origin}</dd></div>
            <div><dt>Heat</dt><dd><span className="heat" aria-label={`Heat ${p.heat} of 5`}>{[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= p.heat ? 'on' : ''} />)}</span></dd></div>
          </dl>
          <div className="pricerow big"><strong>{inr(price * qty)}</strong><s>{inr(mrp * qty)}</s><em>{Math.round((1 - price / mrp) * 100)}% off</em></div>
          <div className="chips">
            {sizes.map((s) => <button key={s.label} className={'chip' + (size === s.label ? ' on' : '')} onClick={() => setSize(s.label)}>{s.label}</button>)}
          </div>
          <div className="qv-actions">
            <div className="stepper big"><button aria-label="Decrease" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><output>{qty}</output><button aria-label="Increase" onClick={() => setQty(qty + 1)}>+</button></div>
            <button className="btn btn-add big" onClick={(e) => { add(item, qty, e, false); }}>Add to cart</button>
            <button className="btn btn-solid big" onClick={(e) => { add(item, qty, e); setQuick(null); setDrawer('checkout') }}>Buy now</button>
          </div>
          <p className="qv-note">Ground in small batches · Lab tested · Free shipping above ₹499 · COD available</p>
        </div>
      </div>
    </div>
  )
}
