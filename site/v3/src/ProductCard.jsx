import { useState } from 'react'
import { useStore, rupee, sizesFor, priceFor, off } from './store'
import TinArt from './ui/TinArt'

export const Stars = ({ r }) => (
  <span className="stars" aria-label={`${r} out of 5`}>
    {[0, 1, 2, 3, 4].map((i) => <i key={i} className={r >= i + 0.75 ? 'f' : r >= i + 0.25 ? 'h' : ''} />)}
  </span>
)

export const Heart = ({ id }) => {
  const { wish, toggleWish } = useStore()
  const on = wish.includes(id)
  return (
    <button className={`heart ${on ? 'is-on' : ''}`} onClick={(e) => { e.stopPropagation(); toggleWish(id) }} aria-pressed={on} aria-label={on ? 'Remove from wishlist' : 'Add to wishlist'}>
      <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.9a4.3 4.3 0 0 1 7.5 2.6c0 5.4-7.5 10-7.5 10Z" /></svg>
    </button>
  )
}

export function Purchase({ p, size, setSize, qty = 1, big = false }) {
  const { qtyOf, setLine, addLine } = useStore()
  const inCart = qtyOf(p.id, size)
  const { price, mrp } = priceFor(p, size)
  return (
    <>
      <div className="chips" role="radiogroup" aria-label="Size">
        {sizesFor(p).map(([s]) => (
          <button key={s} role="radio" aria-checked={s === size} className={s === size ? 'is-on' : ''} onClick={() => setSize(s)}>{s}</button>
        ))}
      </div>
      <div className="pc__buy">
        <div className="pc__price">
          <b>{rupee(price)}</b> <s>{rupee(mrp)}</s> <em>{off(p)}% off</em>
        </div>
        {inCart > 0 ? (
          <div className="qty qty--lg" role="group" aria-label="Quantity in cart">
            <button onClick={() => setLine(p, size, inCart - 1)} aria-label="Decrease">−</button>
            <span>{inCart}</span>
            <button onClick={() => setLine(p, size, inCart + 1)} aria-label="Increase">+</button>
          </div>
        ) : (
          <button className="btn btn--gold btn--sm" onClick={() => addLine(p, size, qty, true)}>Add to cart</button>
        )}
      </div>
    </>
  )
}

export default function ProductCard({ p, index = 0 }) {
  const { setQuick } = useStore()
  const [size, setSize] = useState(p.weight)
  return (
    <article className="pc" style={{ '--c': p.color, '--i': index }}>
      <div className="pc__vis" onClick={() => setQuick(p.id)} role="button" tabIndex={0} aria-label={`Quick view ${p.name}`} onKeyDown={(e) => e.key === 'Enter' && setQuick(p.id)}>
        <span className="pc__glow" />
        <TinArt color={p.color} label={p.name} />
        {p.tag && <span className="badge">{p.tag}</span>}
        {p.stock && <span className="badge badge--low">Only {p.stock} left</span>}
        <span className="pc__qv label">Quick view</span>
      </div>
      <Heart id={p.id} />
      <div className="pc__body">
        <p className="pc__origin label">{p.origin} · {p.native}</p>
        <h3 onClick={() => setQuick(p.id)}>{p.name}</h3>
        <p className="pc__rate"><Stars r={p.rating} /> <span>{p.rating} ({p.reviews.toLocaleString('en-IN')})</span></p>
        <Purchase p={p} size={size} setSize={setSize} />
      </div>
    </article>
  )
}
