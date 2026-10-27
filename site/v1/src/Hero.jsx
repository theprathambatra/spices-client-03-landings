import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { products, bySlug, rupee, grams } from './brand.js'
import { DoodleArrow, Arrow, PouchSVG } from './Icons.jsx'
import { Boundary, reducedMotion, supportsWebGL } from './util.jsx'
import { useStore } from './store/cart.jsx'

const Hero3D = lazy(() => import('./three/Hero3D.jsx'))
const HERO_IDS = ['kashmiri-chilli', 'lakadong-haldi', 'green-elaichi', 'tellicherry']

function darker(hex, k = 0.16) {
  const n = parseInt(hex.slice(1), 16)
  const c = (v) => Math.max(0, Math.round(v * (1 - k)))
  return `rgb(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)})`
}

export default function Hero({ motionPaused = false }) {
  const st = useStore()
  const skus = useMemo(() => HERO_IDS.map((id) => bySlug[id]), [])
  const [active, setActive] = useState(null)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(true)
  const [go3d, setGo3d] = useState(false)
  const [failed3d, setFailed3d] = useState(false)
  const [can3d] = useState(supportsWebGL)
  const root = useRef()
  const reduced = reducedMotion() || motionPaused
  const showFallback = !can3d || reduced || failed3d || !ready
  const sku = active !== null ? skus[active] : null
  const base = sku ? sku.color : '#E03A2F'

  useEffect(() => {
    if (!can3d || reduced) return
    const idle = (fn, t) => ('requestIdleCallback' in window) ? requestIdleCallback(fn, { timeout: t }) : setTimeout(fn, 200)
    // stagger the heavy startup work into separate tasks: wasm first, then the 3D chunk
    const t = idle(() => { import('@dimforge/rapier3d-compat').then((m) => (m.default || m).init?.()).catch(() => {}).finally(() => idle(() => setGo3d(true), 400)) }, 500)
    return () => ('cancelIdleCallback' in window ? cancelIdleCallback(t) : clearTimeout(t))
  }, [can3d, reduced])
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { setVisible(e.isIntersecting); root.current?.classList.toggle('off', !e.isIntersecting) }, { threshold: 0 })
    io.observe(root.current)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.hero h1 .ln', { yPercent: 14, rotate: -2, duration: 0.55, ease: 'power2.out', stagger: 0.07 })
      gsap.from('.hero-note', { y: 14, duration: 0.45, ease: 'power2.out', delay: 0.12 })
      gsap.from('.cta-row', { y: 12, duration: 0.45, ease: 'power2.out', delay: 0.2, clearProps: 'all' })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className={`hero ${sku ? 'popped' : ''} ${showFallback ? 'has-fallback' : ''}`} ref={root} style={{ '--ray-a': base, '--ray-b': darker(base) }} aria-label="Kesari spices">
      <div className="sunburst" aria-hidden="true" />
      <div className="wrap hero-in">
        <h1><span className="ln">Turn up</span><span className="ln">the</span><span className="ln slab">Masala</span></h1>
        <p className="hero-note">Small-batch Indian spices, <b>ground the week you order</b>, not the year before. Go on, poke a pouch.</p>
        <div className="cta-row">
          <a className="btn btn-yellow" href="#shop">Shop spices <Arrow /></a>
          <a className="btn" href="#heat">Pick your heat</a>
        </div>
        <div className="hero-strip" aria-label="Bestsellers">
          {['kashmiri-chilli', 'lakadong-haldi', 'garam-masala'].map((id) => { const p = bySlug[id]; return (
            <button key={id} onClick={() => st.add(p.id, grams(p))} aria-label={`Add ${p.name} for ${rupee(p.price)}`}><PouchSVG sku={p} /><span>{p.name.split(' ').slice(-2).join(' ')}<b>{rupee(p.price)} +</b></span></button>
          ) })}
        </div>
      </div>
      <div className={`hero-fallback ${showFallback ? 'visible' : ''}`} aria-hidden={!showFallback}>
        {skus.map((p, i) => <button key={p.id} className={`hero-fallback-pouch pouch-${i + 1}`} onClick={() => st.open('quick', p.id)} tabIndex={showFallback ? 0 : -1} aria-label={`View ${p.name}`}>
          <PouchSVG sku={p} /><span>{p.name}</span>
        </button>)}
      </div>
      {go3d && can3d && !reduced && !failed3d && (
        <Boundary onError={() => setFailed3d(true)}><Suspense fallback={null}>
          <Hero3DWrap skus={skus} visible={visible && !motionPaused} reduced={reduced} onReady={() => setReady(true)} ready={ready} onPop={setActive} />
        </Suspense></Boundary>
      )}
      <span className="hero-tag t1 slap-static" style={{ '--r': '6deg', transform: 'rotate(6deg)' }}>100% real spices</span>
      <span className="hero-tag t2" style={{ transform: 'rotate(-5deg)' }}>ground this week</span>
      {can3d && ready && !failed3d && !reduced && <div className={`hero-hint ${active !== null ? 'off' : ''}`} aria-hidden="true">Poke a pouch!<DoodleArrow /></div>}
      <div className="stamp" aria-hidden="true">
        <div className="stamp-in">
          <svg viewBox="0 0 120 120"><defs><path id="cp" d="M60 60m-48 0a48 48 0 1 1 96 0a48 48 0 1 1 -96 0" /></defs><circle cx="60" cy="60" r="58" fill="#1A1208" /><text fontFamily="Bowlby One" fontSize="9.5" fill="#FFF3DC" letterSpacing="1.3"><textPath href="#cp">FRESH GROUND • SMALL BATCH • NO FILLERS •</textPath></text></svg>
        </div>
        <div className="stamp-core">FSSAI<br />LAB<br />TESTED</div>
      </div>
      {sku && (
        <div className="pop-card show" key={sku.id} role="status">
          <div>
            <small>you popped</small>
            <strong>{sku.name}</strong>
            <span className="n">{sku.notes}</span>
          </div>
          <button className="btn btn-sm btn-ink" onClick={() => st.add(sku.id, grams(sku))}>Add {rupee(sku.price)}</button>
        </div>
      )}
    </section>
  )
}

function Hero3DWrap({ skus, visible, reduced, onReady, ready, onPop }) {
  return <HeroCanvas {...{ skus, visible, reduced, onReady, ready, onPop }} />
}

function HeroCanvas({ skus, visible, reduced, onReady, ready, onPop }) {
  // class toggle on the canvas for fade-in
  const cls = useRef(null)
  useEffect(() => {
    const el = document.querySelector('.hero-canvas')
    if (el) el.classList.toggle('on', ready)
  }, [ready])
  return <Hero3D skus={skus} visible={visible} reduced={reduced} onReady={onReady} onPop={onPop} />
}
