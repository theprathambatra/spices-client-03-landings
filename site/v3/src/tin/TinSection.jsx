import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { heroSkus } from '../data'
import { tin } from '../scroll'
import { useStore, rupee, products } from '../store'
import Boundary from '../ui/Boundary'
import { useInView, useIsMobile, useReducedMotion } from '../hooks'
import { scrollToTarget } from '../ui/SmoothScroll'

gsap.registerPlugin(ScrollTrigger)
const TinScene = lazy(() => import('./TinScene.jsx'))

const clamp = (x) => Math.min(1, Math.max(0, x))
const ease = (t) => t * t * (3 - 2 * t)
const N = heroSkus.length
const GOLD = '#C9A24B'

function Heat({ n }) {
  return (
    <span className="heat" aria-label={`Heat ${n} of 5`}>
      {[0, 1, 2, 3, 4].map((i) => <i key={i} className={i < n ? 'on' : ''} />)}
    </span>
  )
}

export default function TinSection() {
  const wrap = useRef(null)
  const [stage, inView] = useInView('200px')
  const [near, setNear] = useState(false)
  const [idx, setIdx] = useState(0)
  const [added, setAdded] = useState(false)
  const mobile = useIsMobile()
  const reduced = useReducedMotion()
  const { addLine } = useStore()
  const idxRef = useRef(0)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '1200px 0px' })
    io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  const setSku = (i, pulse = true) => {
    const s = heroSkus[i]
    idxRef.current = i
    tin.idx = i
    tin.tColA.set(s.a)
    tin.tColB.set(s.b)
    setIdx(i)
    wrap.current?.style.setProperty('--accent', s.accent)
    if (pulse) {
      tin.pulse = 1
      tin.spinning = true
      gsap.to(tin, { yaw: tin.yaw + Math.PI * 2, duration: 2.2, ease: 'power3.inOut', overwrite: false, onComplete: () => { tin.spinning = false } })
    }
  }

  useEffect(() => {
    tin.tColA.set(heroSkus[0].a); tin.colA.set(heroSkus[0].a)
    tin.tColB.set(heroSkus[0].b); tin.colB.set(heroSkus[0].b)
    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress
        tin.progress = p
        const opening = ease(clamp(p / 0.09))
        const closing = p > 0.965 ? ease((p - 0.965) / 0.035) * 0.55 : 0
        tin.open = reduced ? 0.8 : Math.max(0, opening - closing)
        const i = Math.min(N - 1, Math.floor(p * N))
        if (i !== idxRef.current) setSku(i, !reduced)
      },
      onToggle: (self) => {
        if (!self.isActive) {
          const y = window.scrollY
          if (y < wrap.current.offsetTop + 10) { tin.open = 0 }
                  } else {
                  }
      },
    })
    return () => st.kill()
    // eslint-disable-next-line
  }, [reduced])

  const jump = (i) => {
    const top = wrap.current.offsetTop
    const h = wrap.current.offsetHeight - window.innerHeight
    scrollToTarget(top + h * ((i + 0.5) / N), { duration: 2.2 })
  }
  const s = heroSkus[idx]
  const buy = () => {
    addLine(products.find((p) => p.id === s.id), s.weight, 1, true)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <section className="tin" id="collection" ref={wrap} style={{ '--n': N }}>
      <div className="tin__stage" ref={stage}>
        <div className="tin__glow" aria-hidden="true" />
        <div className="tin__canvas">
          {near && (
            <Boundary><Suspense fallback={null}>
              <TinScene active={inView} mobile={mobile} reduced={reduced} />
            </Suspense></Boundary>
          )}
        </div>

        <header className="tin__head">
          <p className="label">The Collection</p>
          <p className="tin__count">
            <span className="num">{String(idx + 1).padStart(2, '0')}</span>
            <span className="tin__slash" /> <span className="num dim">{String(N).padStart(2, '0')}</span>
          </p>
        </header>

        <div className="tin__copy">
          {heroSkus.map((k, i) => (
            <article key={k.id} className={`sku ${i === idx ? 'is-on' : ''}`} aria-hidden={i !== idx}>
              <p className="label sku__native"><span><span style={{ '--i': 0 }}>{k.native}</span></span></p>
              <h2 className="sku__name">
                {k.name.split(' ').reduce((rows, w, j, a) => {
                  // split into two masked lines for rhythm
                  const mid = Math.ceil(a.length / 2)
                  const r = j < mid ? 0 : 1
                  rows[r] = (rows[r] ? rows[r] + ' ' : '') + w
                  return rows
                }, []).map((line, j) => (
                  <span className="ml" key={j}><span style={{ '--i': j + 1 }}>{j === 1 || k.name.split(' ').length === 1 ? <em>{line}</em> : line}</span></span>
                ))}
              </h2>
              <p className="sku__line"><span className="ml"><span style={{ '--i': 3 }}>{k.line}</span></span></p>
              <dl className="notes">
                <div style={{ '--i': 4 }}><dt>Aroma</dt><dd>{k.aroma}</dd></div>
                <div style={{ '--i': 5 }}><dt>Heat</dt><dd><Heat n={k.heat} /><small>{k.heatLabel}</small></dd></div>
                <div style={{ '--i': 6 }}><dt>Origin</dt><dd>{k.origin}</dd></div>
                <div style={{ '--i': 7 }}><dt>Pairing</dt><dd>{k.pairing}</dd></div>
              </dl>
              <div className="sku__buy" style={{ '--i': 8 }}>
                <div className="price">
                  <b>{rupee(k.price)}</b> <s>{rupee(k.mrp)}</s> <small>/ {k.weight}</small>
                </div>
                <button className="btn btn--accent" onClick={buy} tabIndex={i === idx ? 0 : -1} data-hot>
                  {added && i === idx ? 'In your vault' : 'Add to vault'}
                </button>
              </div>
            </article>
          ))}
        </div>

        <nav className="tin__rail" aria-label="Choose a spice">
          {heroSkus.map((k, i) => (
            <button key={k.id} className={i === idx ? 'is-on' : ''} onClick={() => jump(i)} style={{ '--c': k.accent }} aria-label={k.name}>
              <i /><span>{k.name.split(' ').slice(-1)[0]}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  )
}
