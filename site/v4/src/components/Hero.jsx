import { lazy, Suspense, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { hero } from '../three/scrollState'
import { Mandala } from './Ornaments'
import { BRAND } from '../data'
import GLBoundary from '../three/GLBoundary'
const BazaarDiorama = lazy(() => import('../three/BazaarDiorama'))
gsap.registerPlugin(ScrollTrigger, useGSAP)

function Frame() {
  return (
    <div className="hframe" aria-hidden="true">
      <svg className="hframe-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="jaali" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="scale(1.6)">
            <path d="M0 0L3 3M3 0L0 3" stroke="#D4A017" strokeWidth=".16" opacity=".6" />
            <circle cx="1.5" cy="1.5" r=".26" fill="#F7A614" />
          </pattern>
        </defs>
        <path fillRule="evenodd" fill="#1E1B5E" d="M0 0H100V100H0Z M2.4 100V32C2.4 17 28 14.5 50 4.2C72 14.5 97.6 17 97.6 32V100Z" />
        <path fillRule="evenodd" fill="url(#jaali)" d="M0 0H100V100H0Z M2.4 100V32C2.4 17 28 14.5 50 4.2C72 14.5 97.6 17 97.6 32V100Z" />
        <path fill="none" stroke="#D4A017" strokeWidth="3" vectorEffect="non-scaling-stroke" d="M2.4 100V32C2.4 17 28 14.5 50 4.2C72 14.5 97.6 17 97.6 32V100" />
        <path fill="none" stroke="#D81B76" strokeWidth="1.2" strokeDasharray="1 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" d="M2.4 100V32C2.4 17 28 14.5 50 4.2C72 14.5 97.6 17 97.6 32V100" />
      </svg>
      <svg className="toran" width="100%" height="46">
        <defs>
          <pattern id="toranp" width="46" height="46" patternUnits="userSpaceOnUse">
            <path d="M0 0H46" stroke="#0E7A57" strokeWidth="2" />
            <path d="M23 2 L33 22 L23 20 L13 22Z" fill="#0E7A57" />
            <circle cx="23" cy="30" r="8" fill="#F7A614" /><circle cx="23" cy="30" r="3.4" fill="#D9381E" />
            <circle cx="23" cy="42" r="5" fill="#FF8C1A" />
          </pattern>
        </defs>
        <rect width="100%" height="46" fill="url(#toranp)" />
      </svg>
    </div>
  )
}

export default function Hero() {
  const root = useRef(null), intro = useRef(null), copy = useRef(null), cue = useRef(null)
  useGSAP(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { gsap.set(copy.current, { autoAlpha: 1 }); gsap.set(intro.current, { autoAlpha: 0 }); return }
    gsap.set(copy.current, { autoAlpha: 0 })
    const items = copy.current.querySelectorAll('.rv')
    ScrollTrigger.create({
      trigger: root.current, start: 'top top+=' + (document.querySelector('.site-head')?.offsetHeight || 0), end: '+=150%', pin: true, scrub: true, anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress
        hero.p = p
        const a = Math.max(0, 1 - p * 5)
        intro.current.style.opacity = a; intro.current.style.transform = `translateY(${(1 - a) * -30}px)`; intro.current.style.pointerEvents = a < 0.2 ? 'none' : ''
        const c = Math.min(1, Math.max(0, (p - 0.66) / 0.24))
        copy.current.style.visibility = c > 0 ? 'visible' : 'hidden'
        copy.current.style.opacity = c
        copy.current.style.pointerEvents = c > 0.5 ? 'auto' : 'none'
        items.forEach((el, i) => { const t = Math.min(1, Math.max(0, c * 1.6 - i * 0.18)); el.style.opacity = t; el.style.transform = `translateY(${(1 - t) * 40}px)` })
        cue.current.style.opacity = a
      },
    })
  }, { scope: root })
  return (
    <section ref={root} className="hero" id="hero" aria-label="Kesari bazaar">
      <div className="hero-sky" />
      <GLBoundary><Suspense fallback={null}><BazaarDiorama className="hero-canvas" /></Suspense></GLBoundary>
      <Frame />
      <div ref={intro} className="hero-intro">
        <p className="kick">Single-origin Indian spices · ground fresh in small batches</p>
        <p className="intro-t">Step into the <em>{BRAND}</em> bazaar</p>
        <div className="intro-cta">
          <a className="btn btn-gold" href="#shop">Shop bestsellers</a>
          <a className="btn btn-ghost-l" href="#occasions">Festive hampers</a>
        </div>
      </div>
      <div ref={cue} className="scroll-cue" aria-hidden="true"><span>Scroll to walk in</span><i /></div>
      <div ref={copy} className="hero-copy">
        <div className="hero-mandala"><Mandala size={640} spin={160} colors={['#F7A614', '#D81B76', '#0D8E9B']} /></div>
        <p className="kick rv">Welcome to the shop · स्वागतम्</p>
        <h1 className="rv">Spices fit<br />for a <em>darbar.</em></h1>
        <p className="sub rv">Saffron from Pampore, pepper from Tellicherry, turmeric from the Jaintia hills. Every pouch lab-tested, small-batch and ready for the festival of your choice.</p>
        <div className="intro-cta rv">
          <a className="btn btn-gold big" href="#shop">Shop the spice shelf</a>
          <a className="btn btn-ghost-l big" href="#occasions">Gift a hamper</a>
        </div>
      </div>
    </section>
  )
}
