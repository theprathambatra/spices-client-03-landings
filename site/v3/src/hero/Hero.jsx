import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Boundary from '../ui/Boundary'
import { Lines } from '../ui/Lines'
import { hero } from '../scroll'
import { useInView, useIsMobile, useReducedMotion } from '../hooks'
import { scrollToTarget } from '../ui/SmoothScroll'

gsap.registerPlugin(ScrollTrigger)
const NebulaScene = lazy(() => import('./NebulaScene.jsx'))

const clamp = (x) => Math.min(1, Math.max(0, x))
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t) }

export default function Hero({ ready }) {
  const wrap = useRef(null)
  const copy = useRef(null)
  const cap = useRef(null)
  const hint = useRef(null)
  const [vis, inView] = useInView('0px')
  const [mount, setMount] = useState(false)
  const [shown, setShown] = useState(false)
  const mobile = useIsMobile()
  const reduced = useReducedMotion()

  useEffect(() => {
    const id = (window.requestIdleCallback ? window.requestIdleCallback(() => setMount(true)) : setTimeout(() => setMount(true), 50))
    return () => (window.cancelIdleCallback || clearTimeout)(id)
  }, [])

  useEffect(() => {
    if (reduced) { hero.p = 0; return }
    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const r = self.progress
        // gather -> hold -> disperse
        hero.p = Math.min(sm(0.14, 0.58, r), 1 - sm(0.82, 0.98, r))
        const c = copy.current, k = cap.current, h = hint.current
        if (c) { const o = 1 - sm(0.04, 0.26, r); c.style.opacity = o; c.style.transform = `translate3d(0,${-(1 - o) * 40}px,0)`; c.style.visibility = o < 0.01 ? 'hidden' : 'visible' }
        if (k) { const o = sm(0.5, 0.64, r) * (1 - sm(0.8, 0.9, r)); k.style.opacity = o; k.style.transform = `translate3d(0,${(1 - o) * 24}px,0)` }
        if (h) h.style.opacity = 1 - sm(0, 0.08, r)
      },
    })
    return () => st.kill()
  }, [reduced])

  return (
    <section className="hero" ref={wrap} id="top">
      <div className="hero__stage" ref={vis}>
        <div className="hero__bg" aria-hidden="true" />
        <div className={`hero__canvas ${shown ? 'is-on' : ''}`}>
          {mount && (
            <Boundary><Suspense fallback={null}>
              <NebulaScene active={inView} mobile={mobile} reduced={reduced} onReady={() => setShown(true)} />
              <Ready onReady={() => setShown(true)} />
            </Suspense></Boundary>
          )}
        </div>
        <div className="hero__rays" aria-hidden="true" />
        <div className="hero__copy" ref={copy}>
          <p className="label hero__eyebrow">
            <span className={`ml-inline ${ready ? 'in' : ''}`}>Single-origin · Harvest 2026 · Lot 26</span>
          </p>
          <Lines
            as="h1"
            className="hero__h1"
            force={ready}
            delay={0.25}
            lines={['Three threads', <>from one <em>crocus.</em></>, 'Everything else follows.']}
          />
          <div className={`hero__sub rise ${ready ? 'in' : ''}`} style={{ '--d': '1.5s' }}>
            <p>
              Kesari is a candle-lit vault of single-origin Indian spices: saffron first, then
              twenty-five others worth the trouble. Picked at dawn, ground in small batches, sealed in gold.
            </p>
            <div className="hero__cta">
              <button className="btn btn--gold" onClick={() => scrollToTarget('#collection')} data-hot>Enter the vault</button>
              <button className="btn btn--ghost" onClick={() => scrollToTarget('#catalogue')} data-hot>Shop all 26</button>
            </div>
          </div>
        </div>
        <div className="hero__cap" ref={cap} aria-hidden="true">
          <p className="label">Pampore · Kodagu · Lakadong · Idukki · Guntur</p>
          <p className="hero__cap-sm">Six thousand threads. One name.</p>
        </div>
        <div className="hero__hint label" ref={hint}>
          <span className="hero__line" /> Move your light · Scroll to gather the threads
        </div>
      </div>
    </section>
  )
}

// Fades the canvas in after the first frames have rendered
function Ready({ onReady }) {
  useEffect(() => {
    const t = setTimeout(onReady, 600)
    return () => clearTimeout(t)
  }, [onReady])
  return null
}
