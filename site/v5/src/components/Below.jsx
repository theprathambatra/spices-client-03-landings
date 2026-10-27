import { useEffect, useState } from 'react'
import { BRAND, FREE_SHIP } from '../data'
import { KitGrid } from './Shop'
import { Scramble, CountUp, Magnetic, Pack, useCart } from './ui'
import { inr } from '../lib/util'

export function Stats() {
  return (
    <section className="stats">
      <div className="wrap stats-grid mono">
        {[[28, 0, '', 'Single-origin specimens'], [112, 0, '', 'Farms on the ledger'], [7.8, 1, '%', 'Curcumin, Lakadong lot 09'], [40, 0, ' kg', 'Max grind batch size']].map(([n, d, s, l]) => (
          <div key={l}><strong><CountUp to={n} decimals={d} suffix={s} /></strong><span>{l}</span></div>
        ))}
      </div>
    </section>
  )
}

export function Kits() {
  return (
    <section className="sec kits" id="kits">
      <div className="wrap">
        <header className="sec-head">
          <p className="eyebrow mono"><i className="dot" /> 06 / Combos &amp; gifting</p>
          <h2><Scramble text="Experiments," /> <em>pre-assembled.</em></h2>
          <p className="lede">Bundle prices beat buying the pouches one by one. Gift-ready box, handwritten lab card on request.</p>
        </header>
        <KitGrid />
      </div>
    </section>
  )
}

const REVIEWS = [
  ['Aarti M.', 'Pune', 'Lakadong Turmeric', 'I put a spoon in warm milk and it turned the colour of a Tuesday sunrise. My mother-in-law asked for the lot number.', 5],
  ['Rahul S.', 'Bengaluru', 'Heirloom Garam Masala', 'Opened the pouch and the whole flat smelled like Dilli winter. Never buying a branded packet again.', 5],
  ['Farah K.', 'Hyderabad', 'Kashmiri Chilli', 'Colour of a fire engine, heat of a polite handshake. Exactly what the spec sheet said, which is rare.', 5],
  ['Dev P.', 'Mumbai', 'Green Cardamom', 'Pods are fat, oily and loud. One in chai and the kettle is basically a perfume counter.', 4],
  ['Meera N.', 'Chennai', 'Tellicherry Pepper', 'I scanned the QR out of curiosity and ended up reading about the Wayanad farmer for ten minutes.', 5],
  ['Kabir A.', 'Delhi', 'Mongra Saffron', 'One gram, 12 servings of kheer, zero regrets. The crocin number is on the box, nobody else does this.', 5],
]
export function Reviews() {
  return (
    <section className="sec dark reviews" id="reviews">
      <div className="wrap">
        <header className="sec-head row-head">
          <div>
            <p className="eyebrow mono"><i className="dot" /> 07 / Field reports</p>
            <h2><Scramble text="4.8 average." /> <em>Peer-reviewed by kitchens.</em></h2>
          </div>
          <div className="rating mono"><strong><CountUp to={4.8} decimals={1} /></strong>
            <div className="dist">{[[5, 82], [4, 13], [3, 3], [2, 1], [1, 1]].map(([n, v]) => <div key={n}><span>{n}★</span><i><b style={{ width: v + '%' }} /></i><span>{v}%</span></div>)}<small>21,400 verified orders</small></div></div>
        </header>
        <div className="rev-grid">
          {REVIEWS.map(([n, c, p, t, s]) => (
            <figure key={n} className="rev glass-d">
              <div className="mono rev-top"><span>{'★'.repeat(s)}{'☆'.repeat(5 - s)}</span><span>✓ VERIFIED BUYER</span></div>
              <blockquote>{t}</blockquote>
              <figcaption className="mono"><b>{n}</b>, {c}<br /><small>re: {p}</small></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

const NOTES = [
  ['LAB NOTE 014', 'Why your turmeric tastes of nothing', 'A 6-minute experiment with a kitchen scale, a torch and three different "turmerics".', '6 min'],
  ['LAB NOTE 015', 'Tadka timing, measured', 'We put a thermocouple in the ghee. Cumin has a 14-second window. Here is the chart.', '9 min'],
  ['LAB NOTE 016', 'The cardamom grading table, explained', 'What 8 mm+ means, why the pod colour lies, and how to buy the right one in Idukki.', '5 min'],
]
export function LabNotes() {
  return (
    <section className="sec notes" id="notes">
      <div className="wrap">
        <header className="sec-head">
          <p className="eyebrow mono"><i className="dot" /> 08 / Lab notes</p>
          <h2><Scramble text="Recipes," /> <em>written as experiments.</em></h2>
        </header>
        <div className="note-list">
          {NOTES.map(([id, t, d, m], i) => (
            <a href="#notes" key={id} className="note">
              <span className="mono id">{id}</span>
              <h3>{t}</h3>
              <p>{d}</p>
              <span className="mono min">{m} →</span>
              <i className="note-art" style={{ '--h': i * 70 }} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Monthly() {
  const [left, setLeft] = useState(0)
  useEffect(() => {
    const end = new Date(); end.setDate(end.getDate() + 9); end.setHours(18, 0, 0, 0)
    const f = () => setLeft(Math.max(0, end - Date.now()))
    f(); const t = setInterval(f, 1000); return () => clearInterval(t)
  }, [])
  const d = Math.floor(left / 864e5), h = Math.floor(left / 36e5) % 24, m = Math.floor(left / 6e4) % 60, s = Math.floor(left / 1e3) % 60
  const z = (n) => String(n).padStart(2, '0')
  const { add } = useCart()
  return (
    <section className="monthly" id="monthly">
      <div className="wrap monthly-grid">
        <div>
          <p className="eyebrow mono"><i className="dot lime" /> 09 / Monthly Compound</p>
          <h2>One new single-origin lot.<br /><em>Every month. Gone when it's gone.</em></h2>
          <p className="lede">Subscribe and get the month's limited specimen plus a lab card, delivered on the 5th. Skip or cancel with one click.</p>
          <div className="cta-row"><Magnetic><button className="btn btn-lime" onClick={() => add('bhut-jolokia')}>Subscribe · {inr(399)}/mo</button></Magnetic></div>
        </div>
        <div className="drop glass mono">
          <small>NEXT DROP LOCKS IN</small>
          <div className="clock">{[[d, 'D'], [h, 'H'], [m, 'M'], [s, 'S']].map(([v, l]) => <div key={l}><b>{z(v)}</b><span>{l}</span></div>)}</div>
          <div className="drop-meta"><div><small>LOT</small><b>KS-2412-BJK</b></div><div><small>STOCK</small><b>212 / 600</b></div></div>
          <div className="stock"><i style={{ width: '35%' }} /></div>
        </div>
      </div>
    </section>
  )
}

export function Newsletter() {
  const [ok, setOk] = useState(false)
  const [email, setEmail] = useState('')
  return (
    <section className="news" id="news">
      <div className="wrap news-grid">
        <h2>Get the lab report <em>before the drop.</em></h2>
        {ok ? <p className="mono ok">LOGGED. Check {email} for a welcome code: <b>ASSAY10</b></p> : (
          <form className="news-form mono" onSubmit={(e) => { e.preventDefault(); email.includes('@') && setOk(true) }}>
            <label htmlFor="em" className="sr-only">Email</label>
            <input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@kitchen.in" />
            <button className="btn btn-dark">Subscribe →</button>
          </form>
        )}
        <p className="mono dim sm">10% off first order. One email a fortnight. Zero chutney-related spam.</p>
      </div>
    </section>
  )
}

export function Footer() {
  const pay = ['UPI', 'VISA', 'MASTERCARD', 'RUPAY', 'COD']
  return (
    <footer className="foot mono">
      <div className="wrap foot-grid">
        <div className="foot-brand"><b>{BRAND.toUpperCase()}/LAB</b><p>Single-origin Indian spices, assayed per batch. Kochi, Kerala.</p><p className="dim">FSSAI 10024052000123 · GSTIN 32AAAAA0000A1Z5</p>
          <p className="soc"><a href="#top">Instagram</a><a href="#top">YouTube</a><a href="#top">WhatsApp</a></p></div>
        <div><h4>Shop</h4><a href="#shop">All spices</a><a href="#best">Bestsellers</a><a href="#kits">Combos &amp; gifting</a><a href="#monthly">Monthly Compound</a></div>
        <div><h4>Help</h4><a href="#top">Shipping</a><a href="#top">Returns &amp; refunds</a><a href="#top">FAQ</a><a href="#top">Track order</a></div>
        <div><h4>Contact</h4><a href="#top">WhatsApp +91 98470 00000</a><a href="#top">hello@kesari.lab</a><a href="#trace">Batch trace</a><a href="#notes">Lab notes</a></div>
      </div>
      <div className="wrap pay"><span>WE ACCEPT</span>{pay.map((p) => <b key={p}>{p}</b>)}</div>
      <div className="wrap foot-bottom"><span>© 2026 {BRAND} Lab.</span><span><a href="#top">Privacy</a> · <a href="#top">Terms</a> · <a href="#top">Refund policy</a></span></div>
      <div className="foot-giant" aria-hidden="true">{BRAND.toUpperCase()}</div>
    </footer>
  )
}

import { JarSection, Compound, HeatRadar, Trace } from './Lab'
import { Catalogue } from './Shop'

export default function Below() {
  return (
    <>
      <Catalogue />
      <JarSection />
      <Compound />
      <HeatRadar />
      <Trace />
      <Kits />
      <Reviews />
      <LabNotes />
      <Monthly />
      <Newsletter />
      <Footer />
    </>
  )
}
