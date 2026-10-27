import { useRef, useState } from 'react'
import gsap from 'gsap'
import { occasions } from '../data'
import { byId, useStore, bundleItem, inr } from '../store'
import { SectionHead } from './Ornaments'
import Pack from './Pack'

function Hamper({ o }) {
  const c = o.color
  const motif = {
    kalash: <g><path d="M-18 8 Q-26 -14 -10 -20 L10 -20 Q26 -14 18 8 Z" fill="#D4A017" /><rect x="-12" y="-27" width="24" height="8" rx="3" fill="#B8860B" /><circle cy="-38" r="12" fill="#2E8B3E" /><path d="M-4 -52 l4 -10 4 10" stroke="#2E8B3E" strokeWidth="3" fill="none" /></g>,
    diya: <g><path d="M-30 4 Q0 28 30 4 Q0 12 -30 4Z" fill="#D4A017" /><path d="M-24 4 Q0 -4 24 4" stroke="#B8860B" strokeWidth="3" fill="none" /><path d="M0 -4 Q-12 -22 0 -42 Q12 -22 0 -4Z" fill="#FF7A1A" /><path d="M0 -8 Q-5 -20 0 -30 Q5 -20 0 -8Z" fill="#FFE27A" /></g>,
    crescent: <g><path d="M12 -44 A26 26 0 1 0 12 8 A20 20 0 1 1 12 -44Z" fill="#F7E7B3" /><path d="M24 -26 l3 7 7 .4 -5.5 4.5 2 7 -6.5 -4 -6.5 4 2 -7 -5.5 -4.5 7 -.4z" fill="#F7E7B3" /></g>,
    pot: <g><path d="M-26 -6 Q-30 20 0 20 Q30 20 26 -6Z" fill="#E8590C" /><rect x="-28" y="-14" width="56" height="9" rx="4" fill="#C84A08" /><path d="M-18 -16 Q-22 -32 -10 -30 Q-6 -42 6 -34 Q20 -34 14 -16Z" fill="#FFF6E5" /><path d="M-6 -16 V-34 M8 -16 V-34" stroke="#D9381E" strokeWidth="2" /><path d="M32 -10 L44 -50 M40 -10 L52 -48" stroke="#2E8B3E" strokeWidth="4" strokeLinecap="round" /></g>,
    pookalam: <g>{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <ellipse key={i} cy="-20" rx="7" ry="16" fill={['#FFD166', '#FF8C1A', '#F7A614', '#D81B76'][i % 4]} transform={`rotate(${i * 45})`} />)}<circle r="9" fill="#FFF6E5" /><circle r="4" fill={c} /></g>,
  }[o.motif]
  return (
    <svg viewBox="-80 -90 160 150" className="hamper-art" aria-hidden="true">
      <ellipse cy="52" rx="64" ry="7" fill="rgba(0,0,0,.25)" />
      <path d="M-60 -14 H60 V48 H-60Z" fill={c} />
      <path d="M-60 -14 H60 V-4 H-60Z" fill="rgba(0,0,0,.2)" />
      <path d="M-66 -26 H66 V-12 H-66Z" fill="#FFF6E5" />
      <path d="M-66 -26 H66" stroke="#D4A017" strokeWidth="2" />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${-54 + i * 10} 48 l5 -12 l5 12z`} fill="rgba(255,246,229,.5)" />)}
      <rect x="-5" y="-26" width="10" height="74" fill="#D4A017" opacity=".85" />
      <g transform="translate(0 -52)">{motif}</g>
    </svg>
  )
}

export default function Occasions() {
  const [i, setI] = useState(0)
  const o = occasions[i]
  const panel = useRef(null)
  const { add } = useStore()
  const go = (n) => {
    if (n === i) return
    const el = panel.current
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setI(n)
    gsap.timeline()
      .to(el.querySelector('.curtain-l'), { xPercent: 0, duration: 0.35, ease: 'power3.in' }, 0)
      .to(el.querySelector('.curtain-r'), { xPercent: 0, duration: 0.35, ease: 'power3.in', onComplete: () => setI(n) }, 0)
      .to([el.querySelector('.curtain-l')], { xPercent: -101, duration: 0.55, ease: 'power3.out', delay: 0.05 })
      .to([el.querySelector('.curtain-r')], { xPercent: 101, duration: 0.55, ease: 'power3.out' }, '<')
  }
  const total = o.items.reduce((a, id) => a + byId[id].price, 0)
  const b = { id: o.id, name: o.title, sub: 'Gift hamper', price: o.price, mrp: o.mrp, color: o.color }
  return (
    <section className="section occasions" id="occasions">
      <SectionHead light eyebrow="Rasoi Darbar" title="A hamper for every festival" hi="त्योहारों के तोहफ़े">Pick the occasion; we pick the spices, the box and the blessing card.</SectionHead>
      <div className="otabs" role="tablist" aria-label="Occasions">
        {occasions.map((x, n) => (
          <button key={x.id} role="tab" aria-selected={n === i} className={n === i ? 'on' : ''} style={{ '--oc': x.color }} onClick={() => go(n)}>
            <span lang="hi">{x.hi}</span>{x.label}
          </button>
        ))}
      </div>
      <div className="opanel" ref={panel} style={{ '--oc': o.color, '--oi': o.ink }} role="tabpanel">
        <div className="curtain curtain-l" /><div className="curtain curtain-r" />
        <div className="o-art"><Hamper o={o} /><div className="o-pattern" aria-hidden="true" /></div>
        <div className="o-copy">
          <p className="eyebrow">{o.label} · {o.hi}</p>
          <h3>{o.title}</h3>
          <p className="o-tag">{o.tagline}</p>
          <p>{o.copy}</p>
          <ul className="o-items">
            {o.items.map((id) => <li key={id}><div><Pack p={byId[id]} /></div><span>{byId[id].name}</span></li>)}
          </ul>
          <div className="o-buy">
            <div className="pricerow big"><strong>{inr(o.price)}</strong><s>{inr(total)}</s><em>save {inr(total - o.price)}</em></div>
            <button className="btn btn-gold big" onClick={(e) => add(bundleItem(b), 1, e, true)}>Add hamper to cart</button>
          </div>
        </div>
      </div>
    </section>
  )
}
