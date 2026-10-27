import { useState, useMemo } from 'react'
import { catalogue, categories, inCat, inr, defaultSize, getSizes } from '../brand'
import { useCart } from '../cart'
import JarArt from './JarArt'
import { Reveal } from './Reveal'
import { Stars, Heart, SizeChips, PriceRow, AddButton, sizeOf } from './Bits'

const Heat = ({ n }) => <span className="heat" aria-label={`Heat ${n} of 5`}>{Array.from({ length: 5 }, (_, i) => <i key={i} className={i < n ? 'on' : ''} />)}</span>

export function ProductCard({ p, i = 0 }) {
  const c = useCart()
  const [label, setLabel] = useState(defaultSize(p).label)
  const size = sizeOf(p, label)
  const badge = p.low ? 'Low stock' : p.isNew ? 'New' : p.badge
  return (
    <Reveal as="article" className="card" delay={(i % 4) * 0.07}>
      <div className="card-img" style={{ background: p.tint }} onClick={() => c.setQv(p.id)}>
        {badge && <span className={'badge' + (p.low ? ' low' : '')}>{badge}</span>}
        <Heart id={p.id} className="card-heart" />
        <JarArt p={p} />
        <span className="qv-peek">Quick view</span>
      </div>
      <div className="card-body">
        <h3><button onClick={() => c.setQv(p.id)}>{p.name}</button></h3>
        <em className="card-hi">{p.hi} · {p.origin}</em>
        <Stars r={p.rating} n={p.reviews} />
        <p className="card-notes">{p.notes}{p.heat > 0 && <> <Heat n={p.heat} /></>}</p>
        <SizeChips p={p} value={label} onChange={setLabel} />
        <div className="card-price"><PriceRow size={size} /></div>
        <AddButton p={p} label={label} />
      </div>
    </Reveal>
  )
}

const SORTS = [['pop', 'Popular'], ['lh', 'Price: low to high'], ['hl', 'Price: high to low'], ['new', 'New']]

export default function Pantry() {
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('pop')
  const [all, setAll] = useState(false)
  const list = useMemo(() => {
    const l = catalogue.filter((p) => inCat(p, cat))
    const pr = (p) => defaultSize(p).price
    if (sort === 'lh') l.sort((a, b) => pr(a) - pr(b))
    else if (sort === 'hl') l.sort((a, b) => pr(b) - pr(a))
    else if (sort === 'new') l.sort((a, b) => (b.isNew - a.isNew) || b.pop - a.pop)
    else l.sort((a, b) => b.pop - a.pop)
    return l
  }, [cat, sort])
  const shown = all ? list : list.slice(0, 8)
  return (
    <section className="pantry" id="pantry">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <div className="eyebrow dark"><span className="eb-line" />The pantry · {catalogue.length} jars &amp; sets</div>
            <Reveal as="h2" className="display h2 ink">THE MASALA <em>dabba</em>, SORTED.</Reveal>
          </div>
          <Reveal as="p" className="sec-p" delay={0.1}>Ground in small batches, dated on the label, priced like your local kirana — not a gourmet boutique.</Reveal>
        </div>
        <div className="toolbar">
          <div className="pills" role="tablist" aria-label="Filter spices">
            {categories.map((k) => (
              <button key={k} role="tab" aria-selected={cat === k} className={'pill' + (cat === k ? ' on' : '')} onClick={() => { setCat(k); setAll(false) }}>
                {k}<sup>{catalogue.filter((p) => inCat(p, k)).length}</sup>
              </button>
            ))}
          </div>
          <div className="sortbox">
            <span className="count" aria-live="polite">{list.length} products</span>
            <label><span className="sr">Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>{SORTS.map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select>
            </label>
          </div>
        </div>
        <div className="grid" key={cat + sort}>
          {shown.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
        </div>
        {!all && list.length > 8 && (
          <div className="more"><button className="btn btn-dark" onClick={() => setAll(true)}>Show all {list.length} products</button></div>
        )}
      </div>
    </section>
  )
}
