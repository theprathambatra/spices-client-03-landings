import { useState } from 'react'
import { Wordmark } from './Header'
import { PatternBorder, Mandala } from './Ornaments'
import { BRAND } from '../data'

export function Newsletter() {
  const [ok, setOk] = useState(false)
  return (
    <section className="nimantran" id="newsletter">
      <div className="card">
        <div className="card-corner tl" /><div className="card-corner tr" /><div className="card-corner bl" /><div className="card-corner br" />
        <div className="nim-mandala"><Mandala size={380} spin={0} colors={['#D4A017', '#D81B76', '#0D8E9B']} /></div>
        <p className="inv-top" lang="hi">॥ निमंत्रण ॥</p>
        <h2>You are cordially invited</h2>
        <p>to the {BRAND} inner circle. Festival drops, first dibs on rare harvests, and one recipe a week that your family will pretend they invented.</p>
        {ok ? <p className="nim-ok">Shukriya! Check your inbox for ₹100 off your first order (FIRST10).</p> : (
          <form onSubmit={(e) => { e.preventDefault(); setOk(true) }}>
            <input type="email" required placeholder="your@email.com" aria-label="Email address" />
            <button className="btn btn-solid">RSVP</button>
          </form>
        )}
        <small>No spam. Only saffron-grade gossip, twice a month.</small>
      </div>
    </section>
  )
}

const PAY = ['UPI', 'VISA', 'MC', 'RuPay', 'COD', 'NetBank']
export function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill="#F7A614">
        {/* taj-like */}
        <rect x="470" y="130" width="260" height="90" /><path d="M530 130 Q600 20 670 130Z" /><rect x="598" y="40" width="4" height="24" /><circle cx="600" cy="38" r="5" />
        {[440, 760].map((x) => <g key={x}><rect x={x} y="70" width="16" height="150" /><path d={`M${x - 3} 70 Q${x + 8} 48 ${x + 19} 70Z`} /></g>)}
        <path d="M480 130 q0 -34 24 -36 q24 2 24 36z" /><path d="M672 130 q0 -34 24 -36 q24 2 24 36z" />
        {/* hawa mahal */}
        <rect x="90" y="110" width="230" height="110" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${100 + i * 44} 110 l16 -40 l16 40z`} />)}
        {[0, 1, 2].map((i) => <rect key={i} x={120 + i * 70} y="50" width="40" height="30" />)}
        {/* red fort */}
        <rect x="860" y="140" width="290" height="80" />
        {Array.from({ length: 20 }).map((_, i) => <path key={i} d={`M${860 + i * 14.5} 140 l7 -14 l7 14z`} />)}
        {[880, 1000, 1130].map((x) => <g key={x}><rect x={x - 14} y="100" width="28" height="44" /><path d={`M${x - 16} 100 q16 -40 32 0z`} /></g>)}
        {/* india gate */}
        <rect x="330" y="120" width="90" height="100" /><path d="M350 220 V170 q25 -40 50 0 V220Z" fill="#1E1B5E" />
      </g>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="foot" id="footer">
      <div className="foot-sky"><Skyline /><p className="foot-sign">{BRAND} <span>about you</span> <i>♥</i></p></div>
      <PatternBorder kind="diamond" color="#F7A614" color2="#FFF6E5" />
      <div className="foot-in">
        <div className="foot-brand">
          <Wordmark light />
          <p>Single-origin Indian spices from farmers we know by name. Ground fresh in small batches in Indore.</p>
          <div className="soc">{['Instagram', 'YouTube', 'WhatsApp', 'Facebook'].map((s) => <a key={s} href="#footer" aria-label={s}>{s.slice(0, 2)}</a>)}</div>
        </div>
        <nav aria-label="Shop"><h4>Shop</h4><a href="#shop">All spices</a><a href="#shop">Blends</a><a href="#bundles">Combos</a><a href="#occasions">Gifting</a><a href="#recipes">Recipes</a></nav>
        <nav aria-label="Help"><h4>Help</h4><a href="#footer">Shipping</a><a href="#footer">Returns & refunds</a><a href="#footer">FAQ</a><a href="#footer">Track order</a><a href="#footer">Bulk & weddings</a></nav>
        <nav aria-label="Contact"><h4>Contact</h4><a href="#footer">WhatsApp · +91 98765 43210</a><a href="#footer">hello@kesari.example</a><span>Mon–Sat, 10am–7pm IST</span><span>FSSAI Lic. 10020021001234</span></nav>
      </div>
      <div className="foot-bar">
        <ul className="pay">{PAY.map((p) => <li key={p}>{p}</li>)}</ul>
        <p>© 2026 {BRAND} Spice Co. · <a href="#footer">Privacy</a> · <a href="#footer">Terms</a> · <a href="#footer">Refund policy</a></p>
      </div>
    </footer>
  )
}
