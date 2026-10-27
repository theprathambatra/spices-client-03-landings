import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './hooks'

gsap.registerPlugin(ScrollTrigger)
const text = 'We do not sell masala. We keep it. In tins, in the dark, until the evening you finally cook the thing you have been meaning to.'

export default function Manifesto() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const words = ref.current.querySelectorAll('.w')
    const tween = gsap.fromTo(words, { opacity: 0.12 }, {
      opacity: 1, ease: 'none', stagger: 0.5,
      scrollTrigger: { trigger: ref.current, start: 'top 78%', end: 'bottom 45%', scrub: 1.2 },
    })
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [reduced])
  return (
    <section className="manifesto" ref={ref} aria-label="Manifesto">
      <p className="label">Manifesto</p>
      <p className="manifesto__t">
        {text.split(' ').map((w, i) => (
          <span key={i} className="w">{w} </span>
        ))}
      </p>
      <p className="manifesto__sig">Meher Kapoor, founder · Pampore, 2019</p>
    </section>
  )
}

export function Trust() {
  const items = ['FSSAI licensed', 'Lab-tested every lot', 'Harvest-dated tins', 'Paid above mandi price', 'Nitrogen-flushed', 'Ships in 48 hours', 'Free shipping over ₹999']
  const row = items.concat(items)
  return (
    <div className="trust" aria-label="Our promises">
      <div className="trust__track">
        {row.map((t, i) => (<span key={i}>{t}<i aria-hidden="true" /></span>))}
      </div>
    </div>
  )
}
