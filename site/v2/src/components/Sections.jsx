import { useEffect, useRef, useState } from 'react'
import { BRAND, byId, catalogue, combos, hampers, inr, defaultSize, FREE_SHIP } from '../brand'
import { useCart } from '../cart'
import { Reveal, CountUp } from './Reveal'
import JarArt from './JarArt'
import Stamp from './Stamp'
import { Stars, Heart } from './Bits'
import { Arrow } from './Hero'
import Sizzle from './Sizzle'
import { Logo } from './Header'

export function Trust() {
  const items = [
    ['FSSAI certified', 'Lic. no. 21524099000123', <path key="a" d="M5 12.5 10 17l9-10" />],
    ['Lab tested', 'Every batch, every time', <path key="b" d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />],
    ['No fillers', 'No preservatives, no colour', <path key="c" d="M6 6l12 12M18 6 6 18" />],
    ['Cash on delivery', 'Pay at your doorstep', <path key="d" d="M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5" />],
    ['Easy returns', '7 days, no questions', <path key="e" d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4" />],
    ['Secure payments', 'UPI · Cards · Net banking', <path key="f" d="M6 11V8a6 6 0 0 1 12 0v3M5 11h14v9H5z" />],
  ]
  return (
    <section className="trust" aria-label="Why shop with us">
      <ul className="wrap">
        {items.map(([t, s, d], i) => (
          <Reveal as="li" key={t} delay={i * 0.05}>
            <span className="ti"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg></span>
            <span><b>{t}</b><small>{s}</small></span>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

export function Feature() {
  const c = useCart()
  const p = byId.kesar
  return (
    <section className="feature">
      <div className="wrap feat-grid">
        <Reveal className="feat-img" style={{ background: '#E8DAC4' }}>
          <JarArt p={p} uid="feat" />
          <Stamp top="★" mid="of the month" ring="JAR OF THE MONTH · PAMPORE · DAWN HARVEST · " className="stamp-sm" />
        </Reveal>
        <div>
          <Reveal className="eyebrow"><span className="eb-line" />Jar of the month · Kesar</Reveal>
          <Reveal as="h2" className="display h2" delay={0.05}>GOLD, <em>by the gram.</em></Reveal>
          <Reveal as="p" className="lede" delay={0.1}>Mongra saffron is the reddest, rarest part of the crocus: three threads per flower, picked before sunrise in Pampore. One pinch turns a litre of milk into festival.</Reveal>
          <Reveal as="ul" className="ticks" delay={0.15}>
            {['Highest crocin grade (ISO 3632 Cat. I)', 'Deep red, zero yellow style', 'Lab report with every tin', 'Resealable, light-proof glass'].map((t) => <li key={t}>{t}</li>)}
          </Reveal>
          <Reveal className="cta-row" delay={0.2}>
            <button className="btn btn-saf" onClick={() => c.add('kesar')}>Add kesar — {inr(p.price)} <Arrow /></button>
            <button className="btn btn-ghost" onClick={() => c.setQv('kesar')}>Quick look</button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Combos() {
  const c = useCart()
  return (
    <section className="combos" id="combos">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <div className="eyebrow dark"><span className="eb-line" />Combos &amp; bundles</div>
            <Reveal as="h2" className="display h2 ink">BETTER <em>together.</em></Reveal>
          </div>
          <Reveal as="p" className="sec-p" delay={0.1}>Pre-packed sets for the dishes you actually cook. Every combo costs less than its jars bought one by one.</Reveal>
        </div>
        <div className="combo-grid">
          {combos.map((b, i) => (
            <Reveal key={b.id} className="combo" delay={i * 0.07} style={{ '--t': b.tint }}>
              <div className="combo-top">
                <span className="save-tag">Save {inr(b.mrp - b.price)}</span>
                <div className="combo-jars">{b.items.slice(0, 4).map((k) => <span key={k} style={{ background: byId[k].tint }}><i style={{ background: byId[k].fill }} /></span>)}{b.items.length > 4 && <span className="more-j">+{b.items.length - 4}</span>}</div>
              </div>
              <h3>{b.name}</h3><em>{b.hi}</em>
              <p>{b.items.map((k) => byId[k].name).join(' · ')}</p>
              <div className="combo-price"><b>{inr(b.price)}</b><s>{inr(b.mrp)}</s><i>{Math.round((1 - b.price / b.mrp) * 100)}% off</i></div>
              <div className="combo-act"><button className="btn btn-red" onClick={() => c.add(b.id, undefined, 1, true)}>Add set</button><button className="btn-link" onClick={() => c.setQv(b.id)}>Details</button></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  { n: '01', t: 'Heat the ghee', hi: 'garam, not smoking', d: 'A tablespoon of ghee, medium flame. Drop in one seed — if it dances, you are ready. If it screams, wait.', pid: 'jeera', col: ['#8F6D3B', '#B08C50', '#F2B230'] },
  { n: '02', t: 'Bloom the seeds', hi: 'listen for the pop', d: 'Jeera first, then rai. Thirty seconds of crackle releases oils you cannot buy in a bottle. Add a pinch of hing, stand back.', pid: 'rai', col: ['#33231a', '#5C4029', '#E4501C'] },
  { n: '03', t: 'Pour it over', hi: 'the tadka lands', d: 'Tip the sizzle onto dal, curd or khichdi and cover for a breath. Haldi and mirch go in before, never after.', pid: 'haldi', col: ['#E0A210', '#C0392B', '#F2B230'] },
]
export function Tadka() {
  const c = useCart()
  return (
    <section className="ritual" id="ritual">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <div className="eyebrow dark"><span className="eb-line" />Recipes · 3 steps · 90 seconds</div>
            <Reveal as="h2" className="display h2 ink">THE <em>tadka</em> RITUAL.</Reveal>
          </div>
          <Reveal as="p" className="sec-p" delay={0.1}>Nani was right: the flavour is in the first minute. Three steps, one pan, no shortcuts.</Reveal>
        </div>
        <div className="steps">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} className="step" delay={i * 0.1}>
              <Sizzle colors={s.col} />
              <span className="step-n">{s.n}</span>
              <h3>{s.t}</h3><em>{s.hi}</em>
              <p>{s.d}</p>
              <button className="btn-link" onClick={() => c.setQv(s.pid)}>Shop {byId[s.pid].hi.toLowerCase()} <Arrow /></button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Story() {
  return (
    <section className="story" id="story">
      <div className="wrap story-grid">
        <div>
          <Reveal className="eyebrow"><span className="eb-line" />Our story · est. 2019, Indore</Reveal>
          <Reveal as="h2" className="display h2" delay={0.05}>NANI’S TIN, <em>now at your door.</em></Reveal>
          <Reveal as="p" className="lede" delay={0.1}>{BRAND} began with a dented steel dabba and one complaint: why does supermarket jeera smell like cardboard? We went to the farms ourselves — Unjha for jeera, Idukki for elaichi, Pampore for kesar — and started grinding in batches of 40 kilos, so nothing sits on a shelf long enough to forget what it was.</Reveal>
          <Reveal className="origin-chips" delay={0.15}>
            {[['Meghalaya', 'haldi'], ['Kashmir', 'mirch & kesar'], ['Kerala', 'pepper & elaichi'], ['Rajasthan', 'jeera & rai'], ['Gujarat', 'saunf']].map(([a, b]) => <span key={a}><b>{a}</b>{b}</span>)}
          </Reveal>
        </div>
        <Reveal className="stats" delay={0.1}>
          <div><b><CountUp to={23} /></b><span>partner farms</span></div>
          <div><b><CountUp to={48} suffix=" hrs" /></b><span>grind to packed</span></div>
          <div><b><CountUp to={41200} suffix="+" /></b><span>kitchens served</span></div>
          <div><b><CountUp to={0} /></b><span>fillers. Not one.</span></div>
        </Reveal>
      </div>
    </section>
  )
}

const REVIEWS = [
  ['Meenakshi R.', 'Pune', 5, 'Lakadong Haldi', 'My mother-in-law tasted the dal and asked which shop. I said “online”. She said “impossible”. Fresh, vivid, no bitterness.'],
  ['Arjun S.', 'Bengaluru', 5, 'Heirloom Garam Masala', 'Opened the tin and the whole flat smelled like Eid. Finally a garam masala that is not just pepper and sadness.'],
  ['Farah K.', 'Hyderabad', 4, 'Biryani Masala', 'Dum biryani for twelve and nobody asked for the recipe — they asked for the link. Packing could be a touch tighter.'],
  ['Gurpreet B.', 'Ludhiana', 5, 'Kashmiri Mirch', 'The colour is unreal and the heat is polite. My butter chicken has never looked this good.'],
  ['Divya N.', 'Chennai', 5, 'Mongra Kesar', 'Three threads in warm milk and the whole glass turned gold. Worth every rupee.'],
  ['Rohit M.', 'Delhi', 4, 'Chai Masala', 'Cutting chai at 6 am, every day. The elaichi is doing most of the work and I respect that.'],
]
export function Reviews() {
  const dist = [[5, 82], [4, 13], [3, 3], [2, 1], [1, 1]]
  return (
    <section className="reviews" id="reviews">
      <div className="wrap">
        <div className="rev-head">
          <div>
            <div className="eyebrow dark"><span className="eb-line" />Kitchen reports</div>
            <Reveal as="h2" className="display h2 ink">LOVED IN <em>41,000</em> KITCHENS.</Reveal>
          </div>
          <Reveal className="rev-score" delay={0.1}>
            <div className="big"><b><CountUp to={4.8} dec={1} /></b><Stars r={4.8} /><small>from 12,480 verified reviews</small></div>
            <ul>{dist.map(([s, v]) => <li key={s}><span>{s}★</span><i><u style={{ '--w': v + '%' }} /></i><em>{v}%</em></li>)}</ul>
          </Reveal>
        </div>
        <div className="rev-grid">
          {REVIEWS.map(([n, city, r, prod, t], i) => (
            <Reveal as="figure" className="rev" key={n} delay={(i % 3) * 0.08}>
              <Stars r={r} />
              <blockquote>“{t}”</blockquote>
              <figcaption><b>{n}</b> · {city}<span className="vb">✓ Verified buyer</span><small>Bought: {prod}</small></figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Gifting() {
  const c = useCart()
  return (
    <section className="gifting" id="gifting">
      <div className="wrap gift-grid">
        <div>
          <Reveal className="eyebrow dark"><span className="eb-line" />Diwali · Shaadi · Corporate</Reveal>
          <Reveal as="h2" className="display h2 ink" delay={0.05}>GIFT THE <em>whole</em> KITCHEN.</Reveal>
          <Reveal as="p" className="lede ink" delay={0.1}>A steel dabba, seven katoris, hand-packed and tied with a handwritten card. The gift everyone actually uses — and keeps.</Reveal>
          <div className="hampers">
            {hampers.map((h, i) => (
              <Reveal key={h.id} className="hamper" delay={0.12 + i * 0.07}>
                <div><b>{h.name}</b><small>{h.notes}</small></div>
                <div className="hp-r"><span><b>{inr(h.price)}</b><s>{inr(h.mrp)}</s></span><button className="btn btn-dark sm" onClick={() => c.add(h.id, undefined, 1, true)}>Add</button></div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="gift-art" aria-hidden="true">
          <svg viewBox="0 0 300 300"><circle cx="150" cy="150" r="140" fill="#C62A1F" /><circle cx="150" cy="150" r="122" fill="#d8d9d3" stroke="#2A1710" strokeWidth="5" />
            {[[150, 150], ...[0, 1, 2, 3, 4, 5].map((i) => [150 + 62 * Math.sin((i / 6) * 6.283 + 0.52), 150 + 62 * Math.cos((i / 6) * 6.283 + 0.52)])].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="29" fill="#aab0b0" stroke="#2A1710" strokeWidth="3" /><circle cx={x} cy={y} r="22" fill={['#E4501C', '#D9A00F', '#A8201A', '#8F6D3B', '#33231a', '#B09A52', '#5A3017'][i]} /></g>)}
          </svg>
        </Reveal>
      </div>
    </section>
  )
}

export function Newsletter() {
  const [ok, setOk] = useState(false)
  return (
    <section className="club">
      <div className="wrap club-in">
        <div><Reveal as="h2" className="display h2 ink">JOIN THE <em>dabba club.</em></Reveal><Reveal as="p" className="sec-p" delay={0.08}>Fresh-batch alerts, one recipe a week and 10% off your first order with code <b>FIRST10</b>. Zero spam, we promise on nani’s name.</Reveal></div>
        <Reveal as="form" delay={0.12} className="club-form" onSubmit={(e) => { e.preventDefault(); setOk(true) }}>
          {ok ? <p className="ok">Welcome to the club. Check your inbox — FIRST10 is waiting.</p> : <><label className="sr" htmlFor="nl">Email</label><input id="nl" type="email" required placeholder="you@kitchen.in" /><button className="btn btn-red">Join</button></>}
        </Reveal>
      </div>
    </section>
  )
}

const pay = ['UPI', 'VISA', 'Mastercard', 'RuPay', 'GPay', 'PhonePe', 'COD']
export function Footer() {
  return (
    <footer className="foot">
      <div className="awning rev-aw" />
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <Logo />
          <p className="tag"><em>Spices that remember where they came from.</em></p>
          <p>Packed by {BRAND} Foods Pvt. Ltd.<br />Plot 14, Sector C, Sanwer Road, Indore 452015<br />FSSAI Lic. 21524099000123</p>
          <p><a href="https://wa.me/910000000000">WhatsApp: +91 00000 00000</a><br /><a href="mailto:namaste@kesari.example">namaste@kesari.example</a></p>
          <div className="social"><a href="#top">Instagram</a><a href="#top">YouTube</a><a href="#top">Facebook</a></div>
        </div>
        <nav aria-label="Shop"><h4>Shop</h4><a href="#pantry">All spices</a><a href="#pantry">Whole</a><a href="#pantry">Ground</a><a href="#pantry">Blends</a><a href="#combos">Combos</a><a href="#gifting">Gifting</a></nav>
        <nav aria-label="Help"><h4>Help</h4><a href="#top">Shipping</a><a href="#top">Returns &amp; refunds</a><a href="#top">FAQ</a><a href="#top">Track order</a><a href="#top">Contact us</a></nav>
        <nav aria-label="Company"><h4>Company</h4><a href="#story">Our story</a><a href="#ritual">Recipes</a><a href="#reviews">Reviews</a><a href="#top">Wholesale</a></nav>
        <div className="foot-news"><h4>Pay your way</h4><ul className="payicons">{pay.map((p) => <li key={p}>{p}</li>)}</ul><p className="free">Free shipping above {inr(FREE_SHIP)} · COD pan-India</p></div>
      </div>
      <div className="wrap legal"><span>© 2026 {BRAND} Foods. Made in India with a mortar and a stubborn streak.</span><span><a href="#top">Privacy</a> · <a href="#top">Terms</a> · <a href="#top">Refund policy</a></span></div>
      <p className="wrap caution">Allergen note: packed in a facility that also handles mustard, sesame and tree nuts.</p>
    </footer>
  )
}
