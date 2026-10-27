import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { products, CATS } from './data'
import { useStore, rupee } from './store'
import { Lines, Rise } from './ui/Lines'
import TinArt from './ui/TinArt'
import ProductCard from './ProductCard'

const SORTS = [['pop', 'Popular'], ['new', 'New'], ['lo', 'Price: low to high'], ['hi', 'Price: high to low']]
const NEW_IDS = ['black-cardamom', 'hing', 'kashmiri-flakes', 'guntur-sannam', 'chai-masala']
const Heat = ({ n }) => (
  <span className="heat" aria-label={`Heat ${n} of 5`}>{[0, 1, 2, 3, 4].map((i) => <i key={i} className={i < n ? 'on' : ''} />)}</span>
)

export default function Shop({ id = 'shop' }) {
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('pop')
  const [view, setView] = useState('grid')
  const [hover, setHover] = useState(null)
  const { addLine } = useStore()
  const pv = useRef(null)

  const list = useMemo(() => {
    const l = products.filter((p) => cat === 'All' || p.cat === cat || (cat === 'Premium' && (p.tag === 'Grade I' || p.tag === 'Small lot')))
    const by = { pop: (a, b) => b.reviews - a.reviews, lo: (a, b) => a.price - b.price, hi: (a, b) => b.price - a.price, new: (a, b) => NEW_IDS.includes(b.id) - NEW_IDS.includes(a.id) }
    return [...l].sort(by[sort])
  }, [cat, sort])

  useEffect(() => {
    if (view !== 'index' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = pv.current
    const x = gsap.quickTo(el, 'x', { duration: 1.1, ease: 'expo.out' })
    const y = gsap.quickTo(el, 'y', { duration: 1.1, ease: 'expo.out' })
    const rot = gsap.quickTo(el, 'rotation', { duration: 1.4, ease: 'expo.out' })
    let lx = 0
    const move = (e) => { x(e.clientX + 36); y(e.clientY - 150); rot(Math.max(-6, Math.min(6, (e.clientX - lx) * 0.25))); lx = e.clientX }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [view])
  const hp = products.find((p) => p.id === hover)
  const cats = [...CATS.filter((c) => c !== 'Finishing'), 'Finishing']
  cats.splice(cats.indexOf('Blends') + 1, 0, 'Premium')

  return (
    <section className="cat" id={id}>
      <div className="cat__head">
        <div>
          <p className="label">Shop the Vault</p>
          <Lines as="h2" className="h2" lines={['Twenty-six reasons', <>to <em>stay in.</em></>]} />
        </div>
        <Rise className="cat__tools">
          <div className="cat__filters" role="tablist" aria-label="Filter by category">
            {cats.map((c) => (
              <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? 'is-on' : ''} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="cat__bar">
            <p className="label" aria-live="polite">{list.length} of {products.length} spices</p>
            <label className="sel">
              <span className="label">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>{SORTS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select>
            </label>
            <div className="seg" role="group" aria-label="View">
              <button className={view === 'grid' ? 'is-on' : ''} onClick={() => setView('grid')} aria-pressed={view === 'grid'}>Grid</button>
              <button className={view === 'index' ? 'is-on' : ''} onClick={() => setView('index')} aria-pressed={view === 'index'}>Index</button>
            </div>
          </div>
        </Rise>
      </div>

      {view === 'grid' ? (
        <div className="grid">{list.map((p, i) => <ProductCard key={p.id} p={p} index={i % 4} />)}</div>
      ) : (
        <>
          <ul className="cat__list" onMouseLeave={() => setHover(null)}>
            {list.map((p) => (
              <li key={p.id} className={hover === p.id ? 'is-hover' : hover ? 'is-dim' : ''} onMouseEnter={() => setHover(p.id)}>
                <span className="cat__no">{String(products.indexOf(p) + 1).padStart(2, '0')}</span>
                <span className="cat__name">
                  <span className="cat__thumb"><TinArt color={p.color} /></span>
                  <span><b>{p.name}</b><small>{p.native}{p.tag ? <em> · {p.tag}</em> : null}</small></span>
                </span>
                <span className="c-origin cat__origin">{p.origin}</span>
                <span className="c-heat"><Heat n={p.heat} /></span>
                <span className="c-w cat__w">{p.weight}</span>
                <span className="c-p cat__price">{rupee(p.price)}</span>
                <button className="cat__add" onClick={() => addLine(p, p.weight)} aria-label={`Add ${p.name} to cart`}><span>Add</span><i aria-hidden="true" /></button>
              </li>
            ))}
          </ul>
          <div ref={pv} className={`preview ${hp ? 'is-on' : ''}`} aria-hidden="true">
            <div className="preview__in">
              {hp && (
                <>
                  <div className="preview__art" style={{ '--c': hp.color }}><span className="preview__glow" /><TinArt color={hp.color} /></div>
                  <p className="label">{hp.origin}</p><h4>{hp.name}</h4><p>{hp.notes}</p>
                  <p className="preview__r"><span>★ {hp.rating}</span> <span>{hp.reviews.toLocaleString('en-IN')} reviews</span></p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export function Bestsellers() {
  const ids = ['lakadong-turmeric', 'kashmiri-chilli', 'green-cardamom', 'heirloom-garam-masala']
  const { setQuick } = useStore()
  return (
    <section className="best" id="bestsellers">
      <div className="best__head">
        <div>
          <p className="label">Bestsellers</p>
          <Lines as="h2" className="h2" lines={[<>What goes in the <em>kitchen</em> first</>]} />
        </div>
        <a className="link label" href="#shop" onClick={(e) => { e.preventDefault(); document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }) }}>Shop all 26</a>
      </div>
      <div className="grid grid--4">{ids.map((id, i) => <ProductCard key={id} p={products.find((p) => p.id === id)} index={i} />)}</div>
    </section>
  )
}
