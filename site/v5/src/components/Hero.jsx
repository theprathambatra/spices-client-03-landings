import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { heroStates, BRAND } from '../data'
import { Scramble, Magnetic } from './ui'
import { useInView } from '../lib/util'
import GLBoundary from './GLBoundary'

gsap.registerPlugin(ScrollTrigger)
const ParticlePantry = lazy(() => import('../three/ParticlePantry'))

const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

function FallbackNote({ onMount }) {
  useEffect(() => { onMount() }, []) // eslint-disable-line
  return <div className="gl-fallback mono">WEBGL UNAVAILABLE · STATIC SPECIMEN</div>
}

export default function Hero() {
  const wrap = useRef(null)
  const stageRef = useRef(0)
  const bar = useRef(null)
  const [idx, setIdx] = useState(0)
  const [ready, setReady] = useState(false)
  const [vis, inView] = useInView({ rootMargin: '100px' })
  const [go, setGo] = useState(false)
  useEffect(() => { const id = setTimeout(() => setGo(true), 350); return () => clearTimeout(id) }, [])
  const idxRef = useRef(0)

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: wrap.current, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: (self) => {
        const q = Math.min(1, Math.max(0, (self.progress - 0.04) / 0.92)) * 3
        const i = Math.min(2, Math.floor(q))
        stageRef.current = q >= 3 ? 3 : i + ss(0.28, 0.82, q - i)
        bar.current && (bar.current.style.transform = `scaleX(${self.progress})`)
        const n = Math.round(stageRef.current)
        if (n !== idxRef.current) { idxRef.current = n; setIdx(n) }
      },
    })
  }, { scope: wrap })

  const s = heroStates[idx]
  const jump = (i) => {
    const el = wrap.current
    const total = el.offsetHeight - window.innerHeight
    const p = 0.04 + 0.92 * (i / 3)
    window.scrollTo({ top: el.offsetTop + total * p, behavior: 'smooth' })
  }

  return (
    <section className="hero" ref={wrap} id="top">
      <div className="hero-stick" ref={vis}>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-canvas">
          <GLBoundary fallback={<FallbackNote onMount={() => setReady(true)} />}>
            <Suspense fallback={null}>
              {go && <ParticlePantry stageRef={stageRef} active={inView} onReady={() => setReady(true)} />}
            </Suspense>
          </GLBoundary>
        </div>
        <div className={'hero-load mono' + (ready ? ' done' : '')}><span>ASSAYING PARTICLES</span><i /></div>

        <div className="hud hud-top mono">
          <span><b>SPECIMEN {s.no}</b> / 04</span>
          <span className="hide-sm">{s.spec[2][2]}</span>
          <span>LOT <Scramble text={s.spec[3][1]} trigger="key" duration={420} /></span>
        </div>

        <div className="hero-copy">
          <p className="eyebrow mono"><i className="dot" /> Single-origin Indian spices / assayed per batch</p>
          <h1>Every spice,<br />resolved to <em>the particle.</em></h1>
          <p className="lede">Lab numbers on every pouch: curcumin, piperine, SHU. Grown by named farms, ground in 40 kg batches, shipped within the week.</p>
          <div className="cta-row">
            <Magnetic><a className="btn btn-lime" href="#index">Shop the index <span>→</span></a></Magnetic>
            <Magnetic><a className="btn btn-ghost" href="#compound">Read a lab sheet</a></Magnetic>
          </div>
        </div>

        <aside className="spec-card glass mono" aria-live="polite">
          <div className="spec-head">
            <span>{s.no}/04</span>
            <Scramble as="strong" text={s.name.toUpperCase()} trigger="key" duration={380} />
          </div>
          <p className="latin">{s.latin}</p>
          <dl>
            {s.spec.map(([k, v, u]) => (
              <div key={k}><dt>{k}</dt><dd><Scramble text={v} trigger="key" duration={460} /> <small>{u}</small></dd></div>
            ))}
          </dl>
          <p className="tip">Move = repel &nbsp;·&nbsp; Click = shockwave</p>
        </aside>

        <div className="hud hud-bottom mono">
          <div className="steps">
            {heroStates.map((h, i) => (
              <button key={h.key} className={i === idx ? 'on' : ''} onClick={() => jump(i)} aria-label={'Show ' + h.name}>
                <i />{h.no}<span className="hide-sm"> {h.key}</span>
              </button>
            ))}
          </div>
          <div className="prog"><i ref={bar} /></div>
          <span className="scroll-cue">SCROLL TO MORPH ↓</span>
        </div>
        <div className="sr-only">{BRAND} spice particle hero: chilli, turmeric, cardamom and star anise.</div>
      </div>
    </section>
  )
}
