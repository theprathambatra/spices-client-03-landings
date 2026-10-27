import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SPICES, byId, inr, HINDI_NAMES } from '../brand'
import { heroState, heroActive, useStore, interacted, reducedMotion, isMobile, useInView } from '../store'
import { useCart } from '../cart'
import Marquee from './Marquee'
import Stamp from './Stamp'
import GLBoundary, { DabbaPoster } from './GLBoundary'

gsap.registerPlugin(ScrollTrigger)
const DabbaScene = lazy(() => import('./DabbaScene'))

export default function Hero() {
  const root = useRef(), stage = useRef()
  const active = useStore(heroActive)
  const cart = useCart()
  const visible = useInView(root, '100px')
  const [mount, setMount] = useState(false)
  const reduced = reducedMotion(), mobile = isMobile()
  const sp = active >= 0 ? SPICES[active] : null
  const prod = sp ? byId[sp.pid] : null

  useEffect(() => { const id = requestAnimationFrame(() => setMount(true)); return () => cancelAnimationFrame(id) }, [])

  useLayoutEffect(() => {
    if (reduced) { heroState.p = 0.9; root.current.style.setProperty('--p', 0.9); return }
    const hdr = () => document.querySelector('header.site')?.offsetHeight || 0
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: () => `top top+=${hdr()}`,
      end: () => `+=${Math.round(window.innerHeight * (mobile ? 1.15 : 1.3))}`,
      pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: (self) => {
        heroState.p = self.progress
        const v = self.progress.toFixed(2); if (root.current.__v !== v) { root.current.__v = v; root.current.style.setProperty('--p', v) }
        if (self.progress < 0.2 && heroActive.get() >= 0) heroActive.set(-1)
      },
    })
    return () => st.kill()
  }, [reduced, mobile])

  // gentle auto-tour of the katoris until the visitor takes over
  useEffect(() => {
    if (reduced) return
    let i = 0
    const id = setInterval(() => {
      if (interacted.v || heroState.p < 0.9) return
      heroActive.set(i % 7); i++
    }, 3200)
    return () => clearInterval(id)
  }, [reduced])

  const pick = (i) => { interacted.v = true; heroActive.set(i) }
  const head = sp ? sp.head : ['OPEN THE', 'dabba.']

  return (
    <section className="hero" ref={root} aria-label="Hero">
      <div className="hero-inner wrap">
        <div className="hero-copy">
          <div className="eyebrow" key={'e' + active}>
            <span className="eb-line" />
            {sp ? `Katori 0${active + 1} / 07 · ${sp.where}` : 'Stone-ground in Indore · 100% fresh'}
          </div>
          <h1 className="display" aria-live="polite">
            <span className="swap" key={'a' + active}>{head[0]}</span>
            <span className="swap d2" key={'b' + active}><em>{head[1]}</em>{sp && <span className="dev">{sp.dev}</span>}</span>
          </h1>
          <p className="lede swap d3" key={'p' + active}>
            {sp ? sp.line : 'Seven spices, one steel tin, zero shortcuts. The kirana-counter classic your nani swore by, stone-ground every Tuesday and sealed before the aroma escapes.'}
          </p>
          <div className="cta-row swap d4" key={'c' + active}>
            {sp ? (
              <>
                <a className="btn btn-red" href="#pantry">Shop {sp.hi} — {inr(prod.price)} <Arrow /></a>
                <button className="btn btn-ghost" onClick={() => cart.add(prod.id)}>Add {prod.weight}</button>
              </>
            ) : (
              <>
                <a className="btn btn-red" href="#pantry">Shop the pantry <Arrow /></a>
                <a className="btn btn-ghost" href="#gifting">Send a gift box</a>
              </>
            )}
          </div>
          <div className="facts">
            <span><b>26</b> pantry staples</span><span><b>50g–250g</b> resealable tins</span><span><b>Zero</b> fillers</span>
          </div>
          <div className="chips" role="group" aria-label="Pick a spice from the dabba">
            {SPICES.map((s, i) => (
              <button key={s.key} className={'chip' + (active === i ? ' on' : '')} onClick={() => pick(i)} aria-pressed={active === i}>
                <i style={{ background: ['#D9A00F', '#A8201A', '#8F6D3B', '#33231a', '#B09A52', '#5A3017', '#E4501C'][i] }} />{s.hi}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-stage" ref={stage}>
          <div className="arch"><div className="arch-stripes" /></div>
          <div className="canvas-wrap">
            <GLBoundary fallback={<DabbaPoster />}>{mount && <Suspense fallback={null}><DabbaScene reduced={reduced} mobile={mobile} visible={visible} /></Suspense>}</GLBoundary>
          </div>
          <Stamp top="100%" mid="ground fresh" />
          <div className="pricecard">
            <small>{sp ? sp.en.toUpperCase() : 'THE MASALA DABBA'}</small>
            <span>From <b>{inr(sp ? prod.price : 1299)}</b> <s>{inr(sp ? prod.mrp : 1799)}</s></span>
          </div>
          <div className="scrollcue" aria-hidden="true"><span>Scroll to lift the lid</span><i /></div>
          <div className="hint" aria-hidden="true">Hover or tap a katori</div>
        </div>
      </div>
      <div className="hero-band">
        <div className="awning" />
        <Marquee items={HINDI_NAMES.map((n) => n.toUpperCase())} dur={46} />
      </div>
    </section>
  )
}

export const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
