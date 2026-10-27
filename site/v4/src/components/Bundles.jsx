import { useState } from 'react'
import { products } from '../data'
import { byId, useStore, bundleItem, inr } from '../store'
import { SectionHead, PatternBorder } from './Ornaments'
import Pack from './Pack'

const COMBOS = [
  { id: 'chai-trio', name: 'The Chai Wallah Trio', ids: ['chai-masala', 'green-cardamom', 'ceylon-cinnamon'], price: 749, color: '#8B5A2B', line: 'Three jars between you and a better 4pm.' },
  { id: 'curry-starter', name: 'The Curry Starter Kit', ids: ['lakadong-turmeric', 'kashmiri-chilli', 'cumin', 'coriander'], price: 799, color: '#E3A21A', line: 'The four spices that run every Indian kitchen.' },
  { id: 'biryani-night', name: 'Biryani Night Box', ids: ['biryani-masala', 'mongra-saffron', 'black-cardamom', 'star-anise'], price: 1499, color: '#9A5B2E', line: 'Dum, dough seal, drama.' },
  { id: 'chaat-club', name: 'The Chaat Club', ids: ['chaat-masala', 'kala-namak', 'amchur', 'ajwain'], price: 449, color: '#B88A3E', line: 'Street-side flavour, zero queue.' },
]
export { COMBOS }

export default function Bundles() {
  const { add } = useStore()
  return (
    <section className="section bundles" id="bundles">
      <SectionHead eyebrow="Combos" title="Better together, cheaper together" hi="जोड़ी कमाल की">Bundles priced below the sum of their jars.</SectionHead>
      <div className="bgrid">
        {COMBOS.map((c) => {
          const sum = c.ids.reduce((a, id) => a + byId[id].price, 0)
          const item = { id: c.id, name: c.name, sub: `${c.ids.length} jars`, price: c.price, mrp: sum, color: c.color }
          return (
            <article key={c.id} className="bcard" style={{ '--bc': c.color }}>
              <div className="bpacks">{c.ids.map((id, i) => <div key={id} style={{ '--i': i, '--n': c.ids.length }}><Pack p={byId[id]} motif={i} /></div>)}</div>
              <h3>{c.name}</h3>
              <p>{c.line}</p>
              <div className="pricerow"><strong>{inr(c.price)}</strong><s>{inr(sum)}</s><em>save {inr(sum - c.price)}</em></div>
              <button className="btn btn-add" onClick={(e) => add(bundleItem(item), 1, e, true)}>Add combo</button>
            </article>
          )
        })}
      </div>
      <Builder />
    </section>
  )
}

function Builder() {
  const [pick, setPick] = useState([])
  const { add } = useStore()
  const pool = ['garam-masala', 'kashmiri-chilli', 'lakadong-turmeric', 'green-cardamom', 'cumin', 'chaat-masala', 'tellicherry-pepper', 'chai-masala'].map((id) => byId[id])
  const toggle = (id) => setPick((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < 4 ? [...p, id] : p))
  const sum = pick.reduce((a, id) => a + byId[id].price, 0)
  const price = Math.round(sum * 0.88)
  return (
    <div className="builder">
      <PatternBorder kind="diamond" />
      <div className="b-head"><h3>Build your own darbar box</h3><p>Choose any 4 jars, save 12%, we add the box and the blessing.</p></div>
      <div className="b-pool">
        {pool.map((p) => (
          <button key={p.id} className={pick.includes(p.id) ? 'on' : ''} aria-pressed={pick.includes(p.id)} onClick={() => toggle(p.id)}>
            <Pack p={p} /><span>{p.name}</span><b>{inr(p.price)}</b>
          </button>
        ))}
      </div>
      <div className="b-box">
        <div className="b-slots">{[0, 1, 2, 3].map((i) => <div key={i} className={'slot' + (pick[i] ? ' full' : '')}>{pick[i] ? <Pack p={byId[pick[i]]} /> : <span>{i + 1}</span>}</div>)}</div>
        <div>
          <p>{pick.length}/4 chosen</p>
          <div className="pricerow big"><strong>{pick.length ? inr(price) : '—'}</strong>{pick.length > 0 && <><s>{inr(sum)}</s><em>save 12%</em></>}</div>
          <button className="btn btn-gold big" disabled={pick.length < 4} onClick={(e) => { add(bundleItem({ id: 'custom-' + pick.join('-'), name: 'Custom darbar box', sub: '4 jars', price, mrp: sum, color: '#D81B76' }), 1, e, true); setPick([]) }}>{pick.length < 4 ? `Pick ${4 - pick.length} more` : 'Add box to cart'}</button>
        </div>
      </div>
    </div>
  )
}
