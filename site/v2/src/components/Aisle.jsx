import { lazy, Suspense, useLayoutEffect, useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { products, inr } from '../brand'
import { aisleState, aisleFocus, aisleHover, useStore, useInView, useFontsReady, reducedMotion, isMobile } from '../store'
import { useCart } from '../cart'
import { Arrow } from './Hero'
import GLBoundary from './GLBoundary'
import JarArt from './JarArt'

gsap.registerPlugin(ScrollTrigger)
const AisleScene = lazy(() => import('./AisleScene'))
const ids = ['haldi', 'kashmiri-mirch', 'jeera', 'kali-mirch', 'elaichi', 'kesar', 'garam-masala', 'dhania', 'rai', 'dalchini', 'hing', 'chai-masala']
const jars = ids.map((id) => products.find((p) => p.id === id))

export default function Aisle() {
  const root = useRef(), bar = useRef()
  const near = useInView(root, '80% 0px 80% 0px')
  const visible = useInView(root, '0px')
  const fonts = useFontsReady()
  const focus = useStore(aisleFocus)
  const hover = useStore(aisleHover)
  const cart = useCart()
  const reduced = reducedMotion(), mobile = isMobile()
  const [mounted, setMounted] = useState(false)
  const [flash, setFlash] = useState(0)
  useEffect(() => { if (near) { setMounted(true); return } const t = setTimeout(() => setMounted(true), 2500); return () => clearTimeout(t) }, [near])
  const shown = jars[hover >= 0 ? hover : focus]

  useEffect(() => {
    aisleState.onAdd = (i) => { cart.add(jars[i].id); setFlash((f) => f + 1) }
    return () => { aisleState.onAdd = null }
  })

  useLayoutEffect(() => {
    aisleState.p = 0
    if (reduced) return
    const hdr = () => document.querySelector('header.site')?.offsetHeight || 0
    const st = ScrollTrigger.create({
      trigger: root.current, start: () => `top top+=${hdr()}`, end: () => `+=${Math.round(window.innerHeight * 3.2)}`,
      pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: (s) => { aisleState.p = s.progress; if (bar.current) bar.current.style.transform = `scaleX(${s.progress})` },
    })
    return () => st.kill()
  }, [reduced])

  const step = (d) => {
    if (reduced) { aisleState.manual = Math.min(1, Math.max(0, (aisleFocus.get() + d) / (jars.length - 1))); if (bar.current) bar.current.style.transform = `scaleX(${aisleState.manual})` ; return }
    const st = ScrollTrigger.getAll().find((s) => s.trigger === root.current)
    if (!st) return
    const target = st.start + ((aisleFocus.get() + d) / (jars.length - 1)) * (st.end - st.start)
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <section className="aisle" id="aisle" ref={root} aria-label="The Kirana Aisle">
      <div className="aisle-canvas">
        <GLBoundary fallback={<div className="aisle-fallback">{jars.map((j) => <button key={j.id} onClick={() => cart.add(j.id)}><JarArt p={j} uid={'f' + j.id} /></button>)}</div>}>{mounted && fonts && <Suspense fallback={null}><AisleScene products={jars} mobile={mobile} reduced={reduced} visible={visible} /></Suspense>}</GLBoundary>
      </div>
      <div className="aisle-veil" />
      <div className="aisle-head wrap">
        <div className="eyebrow light"><span className="eb-line" />Aisle no. 1 · bestsellers</div>
        <h2 className="display h2">WALK THE <em>aisle.</em></h2>
        <p>Scroll to stroll past twelve of our favourite jars. Tap one to drop it in your dabba.</p>
      </div>
      <div className="aisle-card" key={shown.id}>
        <small>Jar {String(jars.indexOf(shown) + 1).padStart(2, '0')} / {jars.length}</small>
        <h3>{shown.name}</h3>
        <em>{shown.hi}</em>
        <p>{shown.notes}</p>
        <div className="ac-row">
          <span className="price"><b>{inr(shown.price)}</b> <s>{inr(shown.mrp)}</s> <i>{shown.weight}</i></span>
          <button className="btn btn-saf sm" onClick={() => { cart.add(shown.id); setFlash((f) => f + 1) }}>Add <Arrow /></button>
        </div>
      </div>
      <div className="aisle-ctrl wrap">
        <button className="round-btn" onClick={() => step(-1)} aria-label="Previous jar">←</button>
        <div className="aisle-track"><i ref={bar} /></div>
        <button className="round-btn" onClick={() => step(1)} aria-label="Next jar">→</button>
      </div>
      <div className="aisle-hint" aria-hidden="true">Click a jar to add it</div>
    </section>
  )
}
