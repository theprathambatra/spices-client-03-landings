import { useCart } from '../cart'
import { getSizes, defaultSize, inr } from '../brand'

export const Stars = ({ r, n }) => (
  <span className="stars" aria-label={`${r} out of 5`}>
    <span className="st" style={{ '--w': (r / 5) * 100 + '%' }} aria-hidden="true">★★★★★</span>
    <b>{r.toFixed(1)}</b>{n != null && <small>({n.toLocaleString('en-IN')})</small>}
  </span>
)

export const Heart = ({ id, className = '' }) => {
  const c = useCart(); const on = c.wish.includes(id)
  return (
    <button className={`heart ${on ? 'on' : ''} ${className}`} onClick={(e) => { e.stopPropagation(); c.toggleWish(id) }} aria-pressed={on} aria-label={on ? 'Remove from wishlist' : 'Save to wishlist'}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-8-4.6-8-10.4A4.6 4.6 0 0 1 12 7.4a4.6 4.6 0 0 1 8 2.7c0 5.8-8 10.4-8 10.4Z" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
    </button>
  )
}

export const Stepper = ({ q, onChange, small }) => (
  <div className={'stepper' + (small ? ' sm' : '')} role="group" aria-label="Quantity">
    <button onClick={() => onChange(q - 1)} aria-label="Decrease quantity">−</button>
    <span aria-live="polite">{q}</span>
    <button onClick={() => onChange(q + 1)} aria-label="Increase quantity">+</button>
  </div>
)

export const SizeChips = ({ p, value, onChange }) => {
  const sizes = getSizes(p)
  if (sizes.length < 2) return <div className="chips-size"><span className="szc on static">{sizes[0].label}</span></div>
  return (
    <div className="chips-size" role="radiogroup" aria-label="Pack size">
      {sizes.map((s) => (
        <button key={s.label} role="radio" aria-checked={value === s.label} className={'szc' + (value === s.label ? ' on' : '')} onClick={(e) => { e.stopPropagation(); onChange(s.label) }}>{s.label}</button>
      ))}
    </div>
  )
}

export const PriceRow = ({ size }) => (
  <span className="pr-row"><b>{inr(size.price)}</b><s>{inr(size.mrp)}</s><i>{Math.round((1 - size.price / size.mrp) * 100)}% off</i></span>
)

export function AddButton({ p, label, className = '' }) {
  const c = useCart()
  const q = c.qtyOf(p.id, label)
  const key = `${p.id}|${label}`
  if (q > 0) return <Stepper q={q} onChange={(n) => c.setQty(key, n)} />
  return <button className={'btn btn-red add ' + className} onClick={() => c.add(p.id, label)}>Add to cart</button>
}

export const sizeOf = (p, label) => getSizes(p).find((s) => s.label === label) || defaultSize(p)
