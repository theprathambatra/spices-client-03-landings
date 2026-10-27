import { useEffect, useRef, useState } from 'react'
import { products, heroSkus, chapters, voices, reviews, BRAND } from './data'
import { useStore, rupee } from './store'
import { Lines, Rise, useIn } from './ui/Lines'
import TinArt from './ui/TinArt'
import { Stars } from './ProductCard'

/* ---------- Bundles ---------- */
const bundles = [
  { id: 'b-chai', name: 'The Winter Chai Kit', note: 'Cardamom, chai masala, true cinnamon, cloves', ids: ['green-cardamom', 'chai-masala', 'ceylon-cinnamon', 'clove'], price: 899 },
  { id: 'b-curry', name: 'The Everyday Curry Four', note: 'Turmeric, chilli, coriander, cumin. Dal solved.', ids: ['lakadong-turmeric', 'kashmiri-chilli', 'coriander', 'rajasthani-cumin'], price: 699 },
  { id: 'b-royal', name: 'The Saffron Reserve', note: 'Mongra saffron, cardamom, nutmeg, garam masala', ids: ['mongra-saffron', 'green-cardamom', 'nutmeg-mace', 'heirloom-garam-masala'], price: 1749 },
]
export function Bundles() {
  const { addRaw } = useStore()
  return (
    <section className="bundles" id="bundles">
      <p className="label">Combos</p>
      <Lines as="h2" className="h2" lines={['Sets, priced', <>like <em>apologies.</em></>]} />
      <div className="bundles__grid">
        {bundles.map((b, i) => {
          const items = b.ids.map((id) => products.find((p) => p.id === id))
          const sum = items.reduce((a, p) => a + p.price, 0)
          return (
            <Rise key={b.id} as="article" className="bundle" delay={i * 0.15}>
              <div className="bundle__tins">{items.map((p) => <span key={p.id}><TinArt color={p.color} /></span>)}</div>
              <h3>{b.name}</h3>
              <p>{b.note}</p>
              <p className="bundle__p"><b>{rupee(b.price)}</b> <s>{rupee(sum)}</s> <em>Save {rupee(sum - b.price)}</em></p>
              <button className="btn btn--ghost btn--sm" onClick={() => addRaw({ key: b.id + '|set', id: b.id, size: 'Set of 4', name: b.name, price: b.price, mrp: sum, color: items[0].color })}>Add the set</button>
            </Rise>
          )
        })}
      </div>
    </section>
  )
}

/* ---------- Process (4 chapters) ---------- */
const Plate = ({ n }) => {
  if (n === 0)
    return (
      <svg viewBox="0 0 300 360" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (<ellipse key={i} cx="150" cy="120" rx="22" ry="70" fill="#5a3a78" opacity="0.5" transform={`rotate(${i * 60} 150 190)`} />))}
        {[-18, 0, 18].map((x, i) => (<path key={i} className="thr" d={`M150 190 C ${150 + x * 0.3} 160 ${150 + x * 1.4} 150 ${150 + x * 2.2} 110`} stroke="#E2400F" strokeWidth="3" fill="none" strokeLinecap="round" style={{ '--i': i }} />))}
        <circle cx="150" cy="190" r="6" fill="#C9A24B" />
        <path d="M150 196 V330" stroke="#3d4a2a" strokeWidth="3" />
      </svg>
    )
  if (n === 1)
    return (
      <svg viewBox="0 0 300 360" aria-hidden="true">
        <g className="spin-slow" style={{ transformOrigin: '150px 130px' }}>
          {Array.from({ length: 24 }).map((_, i) => (<line key={i} x1="150" y1="60" x2="150" y2="40" stroke="#C9A24B" strokeWidth="1.5" opacity="0.7" transform={`rotate(${i * 15} 150 130)`} />))}
        </g>
        <circle cx="150" cy="130" r="40" fill="#E8862A" opacity="0.9" />
        {[230, 260, 290, 320].map((y, i) => (<rect key={y} x={40 + i * 6} y={y} width={220 - i * 12} height="14" rx="2" fill="#C98A0E" opacity={0.85 - i * 0.12} />))}
      </svg>
    )
  if (n === 2)
    return (
      <svg viewBox="0 0 300 360" aria-hidden="true">
        <ellipse cx="150" cy="250" rx="110" ry="34" fill="#2a2119" stroke="#C9A24B" strokeWidth="1" />
        <g className="spin-slow" style={{ transformOrigin: '150px 210px' }}>
          <ellipse cx="150" cy="210" rx="110" ry="34" fill="#3a2f24" stroke="#C9A24B" strokeWidth="1" />
          {Array.from({ length: 10 }).map((_, i) => (<line key={i} x1="150" y1="210" x2={150 + Math.cos((i / 10) * 6.283) * 100} y2={210 + Math.sin((i / 10) * 6.283) * 30} stroke="#C9A24B" strokeWidth="0.8" opacity="0.5" />))}
        </g>
        <circle cx="150" cy="210" r="5" fill="#C9A24B" />
        {Array.from({ length: 40 }).map((_, i) => (<circle key={i} cx={60 + ((i * 53) % 180)} cy={268 + ((i * 31) % 40)} r="1.6" fill="#F2A900" opacity="0.7" />))}
      </svg>
    )
  return (
    <svg viewBox="0 0 300 360" aria-hidden="true">
      <circle cx="150" cy="170" r="92" fill="#7A1F1A" />
      <circle cx="150" cy="170" r="76" fill="none" stroke="#e6b8a8" strokeWidth="1" opacity="0.5" />
      <text x="150" y="196" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="86" fill="#efd7c4">K</text>
      <g className="spin-slow" style={{ transformOrigin: '150px 170px' }}>
        <path id="ringp" d="M150 170 m-108 0 a108 108 0 1 1 216 0 a108 108 0 1 1 -216 0" fill="none" />
        <text fontFamily="Cinzel, serif" fontSize="11" letterSpacing="5" fill="#C9A24B"><textPath href="#ringp">LOT 26 · SEALED BY HAND · FSSAI · LAB TESTED · </textPath></text>
      </g>
    </svg>
  )
}
export function Process() {
  return (
    <section className="process" id="process">
      <p className="label">From field to tin</p>
      <Lines as="h2" className="h2" lines={['Four chapters,', <>no <em>shortcuts.</em></>]} />
      <ol>
        {chapters.map((c, i) => <Chapter key={c.t} c={c} i={i} />)}
      </ol>
    </section>
  )
}
function Chapter({ c, i }) {
  const ref = useRef(null)
  useIn(ref, { threshold: 0.3 })
  return (
    <li ref={ref} className={`chap ${i % 2 ? 'chap--r' : ''}`}>
      <div className="chap__plate"><Plate n={i} /></div>
      <div className="chap__txt">
        <span className="num chap__n">{c.n}</span>
        <h3>{c.t}</h3>
        <p>{c.d}</p>
        <p className="label dim">{c.meta}</p>
      </div>
    </li>
  )
}

/* ---------- Voices + reviews ---------- */
export function Voices() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI((x) => (x + 1) % voices.length), 8000)
    return () => clearInterval(t)
  }, [paused])
  const dist = [[5, 82], [4, 13], [3, 3], [2, 1], [1, 1]]
  return (
    <section className="voices" id="reviews" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <p className="label">In their words</p>
      <div className="voices__stage">
        {voices.map((v, k) => (
          <figure key={k} className={k === i ? 'is-on' : ''} aria-hidden={k !== i}>
            <blockquote>“{v.q}”</blockquote>
            <figcaption><b>{v.who}</b> <span>{v.role}</span></figcaption>
          </figure>
        ))}
      </div>
      <div className="voices__nav">
        {voices.map((_, k) => (<button key={k} className={k === i ? 'is-on' : ''} onClick={() => setI(k)} aria-label={`Quote ${k + 1}`}><i /></button>))}
      </div>

      <div className="rev">
        <div className="rev__sum">
          <p className="rev__big"><span className="num">4.8</span></p>
          <Stars r={4.8} />
          <p className="label">9,412 verified reviews</p>
          <ul className="dist">
            {dist.map(([s, p]) => (<li key={s}><span>{s}</span><i><b style={{ width: p + '%' }} /></i><span>{p}%</span></li>))}
          </ul>
        </div>
        <div className="rev__list">
          {reviews.map((r, k) => (
            <Rise as="article" key={k} delay={k * 0.12}>
              <Stars r={r.stars} />
              <p>{r.t}</p>
              <p className="label"><b>{r.n}</b>, {r.city} · <span className="verified">Verified buyer</span></p>
              <p className="label dim">{r.sku}</p>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Gifting vault builder ---------- */
export function Vault() {
  const [on, setOn] = useState(() => heroSkus.map(() => true))
  const { addRaw } = useStore()
  const n = on.filter(Boolean).length
  const sum = heroSkus.reduce((a, s, k) => a + (on[k] ? s.price : 0), 0)
  const price = n >= 3 ? Math.round(sum * 0.88) : sum
  return (
    <section className="vault" id="gifting">
      <div className="vault__txt">
        <p className="label">Gifting</p>
        <Lines as="h2" className="h2" lines={['The Vault,', <>a walnut <em>box</em>.</>]} />
        <Rise as="p" className="lede">
          A hand-finished walnut box, six lacquered tins, a card in your handwriting (or ours, but ours is worse). Tap a tin to take it out or put it back. Three or more gets 12% off.
        </Rise>
        <div className="vault__sum">
          <span className="label">{n} of 6 tins</span>
          <b>{rupee(price)}</b>
          {n >= 3 && <s>{rupee(sum)}</s>}
        </div>
        <button
          className="btn btn--gold"
          disabled={n === 0}
          onClick={() => addRaw({ key: `vault|${on.map(Number).join('')}`, id: 'vault', size: `${n} tins`, name: 'The Vault, walnut gift box', price, mrp: sum, color: '#C9A24B' })}
        >
          Add the vault to cart
        </button>
        <p className="label dim">Hand-lettered card included · Ships in 48 hours · COD available</p>
      </div>
      <div className="box" role="group" aria-label="Choose tins for the gift box">
        <div className="box__lid">
          <svg viewBox="0 0 520 360" className="box__svg">
            <defs>
              <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3b2314" /><stop offset="0.5" stopColor="#2a190e" /><stop offset="1" stopColor="#3d2616" /></linearGradient>
              <radialGradient id="goldt"><stop offset="0" stopColor="#f6dc9a" /><stop offset="0.7" stopColor="#c9a24b" /><stop offset="1" stopColor="#7a5a22" /></radialGradient>
            </defs>
            <rect x="4" y="4" width="512" height="352" rx="10" fill="url(#wood)" stroke="#5a3a22" />
            {Array.from({ length: 14 }).map((_, k) => (<path key={k} d={`M10 ${20 + k * 24} C 150 ${14 + k * 24 + (k % 3) * 5} 360 ${28 + k * 24} 510 ${18 + k * 24}`} stroke="#5a3a22" strokeWidth="0.6" fill="none" opacity="0.5" />))}
            <rect x="24" y="24" width="472" height="312" rx="6" fill="#120d09" stroke="#C9A24B" strokeOpacity="0.4" />
            {heroSkus.map((s, k) => {
              const cx = 100 + (k % 3) * 160, cy = 110 + Math.floor(k / 3) * 140
              return (
                <g key={s.id} className={`slot ${on[k] ? 'is-on' : ''}`} transform={`translate(${cx} ${cy})`} onClick={() => setOn((o) => o.map((v, j) => (j === k ? !v : v)))} tabIndex={0} role="switch" aria-checked={on[k]} aria-label={s.name} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOn((o) => o.map((v, j) => (j === k ? !v : v)))}>
                  <circle r="58" className="slot__well" />
                  <g className="slot__tin">
                    <circle r="50" fill="#14100c" />
                    <circle r="50" fill="none" stroke={s.accent} strokeWidth="3" />
                    <circle r="43" fill="url(#goldt)" />
                    <circle r="30" fill="none" stroke="#7a5a22" strokeWidth="1" opacity="0.7" />
                    <circle r="6" fill="#f6dc9a" />
                  </g>
                  <text y="76" textAnchor="middle">{s.name.split(' ').slice(-1)[0].toUpperCase()}</text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </section>
  )
}

/* ---------- Inner circle ---------- */
export function Inner() {
  const [done, setDone] = useState(false)
  const { say } = useStore()
  return (
    <section className="inner" id="inner">
      <p className="label">The Inner Circle</p>
      <Lines as="h2" className="h2" lines={['One letter per harvest.', <>Nothing <em>in between.</em></>]} />
      <Rise as="p" className="lede">First access to small lots (the black cardamom sells out in a day), recipes from our cooks, and 10% off your first tin with code FIRST10.</Rise>
      {done ? (
        <p className="inner__ok">You are on the list. The next letter lands with the saffron.</p>
      ) : (
        <form className="inner__form" onSubmit={(e) => { e.preventDefault(); setDone(true); say('Welcome to the Inner Circle') }}>
          <input type="email" required placeholder="your@email.com" aria-label="Email address" />
          <button className="btn btn--gold">Request an invitation</button>
        </form>
      )}
    </section>
  )
}

/* ---------- Footer ---------- */
export function Footer() {
  const { say } = useStore()
  const col = (t, items) => (
    <div>
      <h4 className="label">{t}</h4>
      <ul>{items.map(([x, h]) => (<li key={x}><a href={h || '#footer'} onClick={(e) => { if (!h) { e.preventDefault(); say(`${x}: coming with the real store`) } }}>{x}</a></li>))}</ul>
    </div>
  )
  return (
    <footer className="footer" id="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <p className="logo">{BRAND}</p>
          <p>Single-origin Indian spices, kept like jewels. Pampore, Kodagu, Lakadong and a few kitchens in between.</p>
          <p className="label">WhatsApp · +91 98765 43210<br />hello@kesari.example</p>
        </div>
        {col('Shop', [['All spices', '#shop'], ['Bestsellers', '#bestsellers'], ['Combos', '#bundles'], ['Gifting', '#gifting']])}
        {col('Help', [['Shipping'], ['Returns and refunds'], ['FAQ'], ['Track your order']])}
        {col('House', [['Our story', '#origins'], ['The process', '#process'], ['Reviews', '#reviews'], ['Wholesale']])}
      </div>
      <div className="trust trust--f">
        <ul>
          {['FSSAI licensed', 'Lab tested', 'No fillers or preservatives', 'Cash on delivery', '7-day easy returns', 'Secure payments'].map((t) => (<li key={t}>{t}</li>))}
        </ul>
      </div>
      <div className="footer__pay">
        {['UPI', 'VISA', 'Mastercard', 'RuPay', 'COD'].map((p) => (<span key={p}>{p}</span>))}
        <span className="grow" />
        <a href="https://instagram.com" onClick={(e) => e.preventDefault()}>Instagram</a>
        <a href="https://youtube.com" onClick={(e) => e.preventDefault()}>YouTube</a>
      </div>
      <p className="footer__word" aria-hidden="true">{BRAND.toUpperCase()}</p>
      <div className="footer__legal label">
        <span>© 2026 {BRAND} Foods Pvt Ltd · FSSAI Lic. 10026999000000</span>
        <span>Privacy · Terms · Refund policy</span>
      </div>
    </footer>
  )
}
