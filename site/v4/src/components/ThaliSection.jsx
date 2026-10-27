import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { byId, useStore, sizesFor, priceFor, productItem, inr } from '../store'
import { SectionHead } from './Ornaments'
import GLBoundary from '../three/GLBoundary'
import Pack from './Pack'
import { AddControl } from './ProductCard'
const BrassThali = lazy(() => import('../three/BrassThali'))

// seven katoris: six around, one in the middle
const SPEC = [
  ['kashmiri-chilli', { pileColor: '#B3261E' }],
  ['lakadong-turmeric', { pileColor: '#E3A21A' }],
  ['tellicherry-pepper', { whole: true, color: '#1d1714', seedSize: 0.042, pileColor: '#2b2420' }],
  ['green-cardamom', { whole: true, pod: true, color: '#8aa83f', pileColor: '#6d8a2e' }],
  ['cumin', { whole: true, color: '#9a7a45', seedSize: 0.03, pileColor: '#7b5e33' }],
  ['coriander', { pileColor: '#B59A4A' }],
  ['garam-masala', { pileColor: '#7a3d1b' }],
]
const items = SPEC.map(([id, x]) => ({ ...byId[id], ...x }))

export default function ThaliSection() {
  const [sel, setSel] = useState(null)
  const onSelect = useCallback((i) => setSel(i), [])
  const p = sel != null ? items[sel] : null
  const stage = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect() } }, { rootMargin: '1500px' })
    io.observe(stage.current)
    return () => io.disconnect()
  }, [])
  return (
    <section className="thali-sec" id="thali">
      <SectionHead light eyebrow="The brass thali" title="Seven katoris. One lazy susan." hi="पीतल की थाली">
        Spin it like the dining table at your nani’s. Tap a bowl to lean in.
      </SectionHead>
      <div className="thali-stage" ref={stage}>
        {near && <GLBoundary fallback={<div className="thali-loading">3D thali needs WebGL. Use the list below to browse the seven spices.</div>}>
          <Suspense fallback={<div className="thali-loading">Polishing the brass…</div>}>
            <BrassThali className="thali-canvas" items={items} selected={sel} onSelect={onSelect} />
          </Suspense>
        </GLBoundary>}
        <p className="thali-hint" aria-hidden="true">{sel == null ? '← drag to spin · tap a katori →' : ''}</p>
        {p && <ThaliCard key={p.id} p={p} onClose={() => setSel(null)} />}
      </div>
      <ul className="thali-legend" aria-label="Spices on the thali">
        {items.map((it, i) => (
          <li key={it.id}><button className={sel === i ? 'on' : ''} onClick={() => setSel(sel === i ? null : i)}><i style={{ background: it.pileColor || it.color }} />{it.name}</button></li>
        ))}
      </ul>
    </section>
  )
}

function ThaliCard({ p, onClose }) {
  const sizes = sizesFor(p)
  const [size, setSize] = useState(sizes.find((s) => s.mult === 1)?.label)
  const { price, mrp } = priceFor(p, size)
  const { setQuick } = useStore()
  return (
    <div className="thali-card" style={{ '--pc': p.color }} role="region" aria-label={p.name}>
      <button className="x" onClick={onClose} aria-label="Close">×</button>
      <div className="tc-pack"><Pack p={p} /></div>
      <div>
        <p className="origin"><span lang="hi">{p.hi}</span> · {p.origin}</p>
        <h3>{p.name}</h3>
        <p className="tc-notes">{p.notes}</p>
        <div className="chips">{sizes.map((s) => <button key={s.label} className={'chip' + (size === s.label ? ' on' : '')} onClick={() => setSize(s.label)}>{s.label}</button>)}</div>
        <div className="pricerow"><strong>{inr(price)}</strong><s>{inr(mrp)}</s></div>
        <div className="tc-actions"><AddControl p={p} size={size} /><button className="link" onClick={() => setQuick(p.id)}>Details</button></div>
      </div>
    </div>
  )
}
