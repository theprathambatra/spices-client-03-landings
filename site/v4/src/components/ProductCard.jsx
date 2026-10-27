import { useState } from 'react'
import { useStore, sizesFor, priceFor, productItem, inr, badgeFor } from '../store'
import Pack from './Pack'
import { Stars } from './Ornaments'

export function Heart({ id }) {
  const { wish, toggleWish } = useStore()
  const on = wish.includes(id)
  return (
    <button className={'heart' + (on ? ' on' : '')} aria-pressed={on} aria-label={on ? 'Remove from wishlist' : 'Add to wishlist'} onClick={(e) => { e.stopPropagation(); toggleWish(id) }}>
      <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
    </button>
  )
}

export function AddControl({ p, size, qty = 1, big }) {
  const { add, lines, setQty } = useStore()
  const item = productItem(p, size)
  const inCart = lines[item.key]?.qty || 0
  if (inCart) {
    return (
      <div className={'stepper' + (big ? ' big' : '')} role="group" aria-label={`Quantity of ${p.name}`}>
        <button aria-label="Decrease" onClick={() => setQty(item.key, inCart - 1)}>−</button>
        <output>{inCart}</output>
        <button aria-label="Increase" onClick={(e) => add(item, 1, e)}>+</button>
      </div>
    )
  }
  return <button className={'btn btn-add' + (big ? ' big' : '')} onClick={(e) => add(item, qty, e)}>Add to cart</button>
}

export default function ProductCard({ p, i = 0 }) {
  const sizes = sizesFor(p)
  const [size, setSize] = useState(sizes.find((s) => s.mult === 1)?.label || sizes[0].label)
  const { setQuick } = useStore()
  const { price, mrp } = priceFor(p, size)
  const off = Math.round((1 - price / mrp) * 100)
  const badge = badgeFor(p, i)
  return (
    <article className="pcard" style={{ '--pc': p.color }}>
      <div className="pcard-top">
        <span className="pcard-arch" aria-hidden="true" />
        {badge && <span className={'badge b-' + badge.split(' ')[0].toLowerCase()}>{badge}</span>}
        <Heart id={p.id} />
        <button className="pcard-visual" onClick={() => setQuick(p.id)} aria-label={`Quick view ${p.name}`}>
          <Pack p={p} motif={i} />
          <span className="qv-hint">Quick view</span>
        </button>
      </div>
      <div className="pcard-body">
        <p className="origin"><span lang="hi">{p.hi}</span> · {p.origin}</p>
        <h3 onClick={() => setQuick(p.id)}>{p.name}</h3>
        <p className="pstory">{p.story}</p>
        <div className="rate"><Stars value={p.rating} /> <b>{p.rating}</b> <span>({p.reviews.toLocaleString('en-IN')})</span></div>
        <div className="chips" role="radiogroup" aria-label="Pack size">
          {sizes.map((s) => (
            <button key={s.label} role="radio" aria-checked={size === s.label} className={'chip' + (size === s.label ? ' on' : '')} onClick={() => setSize(s.label)}>{s.label}</button>
          ))}
        </div>
        <div className="pricerow">
          <strong>{inr(price)}</strong><s>{inr(mrp)}</s><em>{off}% off</em>
        </div>
        <AddControl p={p} size={size} />
      </div>
    </article>
  )
}
