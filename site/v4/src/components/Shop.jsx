import { useMemo, useState } from 'react'
import { products, CATS } from '../data'
import ProductCard from './ProductCard'
import { SectionHead, PatternBorder } from './Ornaments'

const SORTS = [
  { id: 'pop', label: 'Popular' }, { id: 'lo', label: 'Price: low to high' }, { id: 'hi', label: 'Price: high to low' }, { id: 'new', label: 'New arrivals' },
]
export default function Shop() {
  const [cat, setCat] = useState('all')
  const [sort, setSort] = useState('pop')
  const [more, setMore] = useState(false)
  const list = useMemo(() => {
    let l = products.filter((p) => cat === 'all' || p.cat === cat)
    if (sort === 'pop') l = [...l].sort((a, b) => b.reviews - a.reviews)
    if (sort === 'lo') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'hi') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'new') l = [...l].sort((a, b) => a.reviews - b.reviews)
    return l
  }, [cat, sort])
  const shown = more ? list : list.slice(0, 8)
  return (
    <section id="shop" className="section shop">
      <PatternBorder kind="scallop" />
      <SectionHead eyebrow="The spice shelf" title="Shop the Darbar" hi="मसालों का दरबार">
        Twenty-eight spices, each with a village, a harvest date and an opinion. Sort, filter, fill the thali.
      </SectionHead>
      <div className="shop-bar">
        <div className="pills" role="tablist" aria-label="Categories">
          {CATS.map((c) => (
            <button key={c.id} role="tab" aria-selected={cat === c.id} className={'pill' + (cat === c.id ? ' on' : '')} onClick={() => { setCat(c.id); setMore(false) }}>{c.label}</button>
          ))}
        </div>
        <div className="sortbox">
          <span className="count">{list.length} spices</span>
          <label>Sort <select value={sort} onChange={(e) => setSort(e.target.value)}>{SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select></label>
        </div>
      </div>
      <div className="pgrid">
        {shown.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
      </div>
      {list.length > 8 && (
        <div className="center"><button className="btn btn-ghost" onClick={() => setMore((m) => !m)}>{more ? 'Show fewer' : `Show all ${list.length} spices`}</button></div>
      )}
    </section>
  )
}
