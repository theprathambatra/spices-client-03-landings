import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { BRAND, CATEGORIES, PURPOSES, BUNDLES, REVIEWS, ORIGINS, products, bySlug, rupee, grams, priceFor, FREE_SHIP, brand } from './brand.js'
import { SpiceGlyph, Sparkle, Star, Arrow, PouchSVG } from './Icons.jsx'
import { Reveal, Marquee, useInView, reducedMotion, supportsWebGL, Boundary } from './util.jsx'
import { useStore } from './store/cart.jsx'
import { Stars } from './store/ui.jsx'

const Heat3D = lazy(() => import('./three/Heat3D.jsx'))

const goShop = () => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })

/* ---------------------------------------------------------- trust strip */
const TRUST = [
  ['FSSAI certified', 'Lic. 10020051000000', 'bowl'],
  ['No fillers', 'No colour, no preservatives', 'chilli'],
  ['Cash on delivery', 'Pay at your doorstep', 'gift'],
]
export function Trust() {
  return (
    <section className="trust" aria-label="Why shop with us">
      <div className="wrap trust-in">
        {TRUST.map(([t, s, g], i) => (
          <Reveal key={t} i={i} className="tr"><SpiceGlyph k={g} size={40} /><div><b>{t}</b><small>{s}</small></div></Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- browse */
export function Browse() {
  const st = useStore()
  const pick = (id) => {
    if (id === 'gift') return document.getElementById('gifting')?.scrollIntoView({ behavior: 'smooth' })
    st.open('cat', id); st.open('purpose', null); st.open('query', ''); goShop()
  }
  return (
    <section className="section" id="browse" aria-labelledby="browse-t">
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="span" kind="slap" rot={3} className="kicker">pick your flavour</Reveal>
          <h2 className="title" id="browse-t">Shop by category</h2>
        </div>
        <div className="cats">
          {CATEGORIES.map((c, i) => (
            <Reveal as="button" key={c.id} className="cat" i={i} style={{ '--c': c.color, '--gr': `${(i % 2 ? 1 : -1) * 12}deg` }} onClick={() => pick(c.id)} aria-label={`Shop ${c.label}`}>
              <h3>{c.label}</h3><span>{c.sub}</span>
              <SpiceGlyph k={c.icon} className="glyph" size={200} />
              <i className="arr"><Arrow size={18} /></i>
            </Reveal>
          ))}
        </div>
        <div className="sec-head" style={{ marginTop: 'clamp(56px,8vw,110px)' }}>
          <Reveal as="span" kind="slap" rot={-3} className="kicker">what are you cooking tonight?</Reveal>
          <h2 className="title">Shop by dish</h2>
        </div>
        <div className="purpose">
          {PURPOSES.map((p, i) => (
            <Reveal as="button" key={p.id} i={i} className="pur" style={{ '--c': p.color }} onClick={() => { st.open('cat', 'all'); st.open('purpose', p.id); goShop() }}>
              <span className="disc"><SpiceGlyph k={['bowl', 'cardamom', 'chai', 'chilli', 'flame', 'salt', 'mango'][i]} /></span>{p.label}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- heat */
const LEVELS = [
  { n: 'Mild', q: 'Namaste, very gentle', s: '0 - 1,000 SHU', c: '#5BC043', glow: '#5BC04355', h: 0, tag: 'Nani-approved' },
  { n: 'Medium', q: 'Sweating, but smiling', s: '2,000 - 10,000 SHU', c: '#FFC21A', glow: '#FFC21A55', h: 2, tag: 'Dhaba energy' },
  { n: 'Hot', q: 'Ordering a lassi', s: '15,000 - 50,000 SHU', c: '#FF7A1A', glow: '#FF7A1A66', h: 3, tag: 'Guntur dreams' },
  { n: 'Inferno', q: 'Calling mummy', s: '80,000+ SHU', c: '#E0201A', glow: '#E0201A77', h: 4, tag: 'Fire brigade' },
]
export function Heat({ motionPaused = false }) {
  const st = useStore()
  const [val, setVal] = useState(18)
  const [can3d] = useState(supportsWebGL)
  const [failed3d, setFailed3d] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)
  const heat = useRef(0.18)
  const [stageRef, seen] = useInView({ rootMargin: '200px' })
  const [active, setActive] = useState(false)
  useEffect(() => {
    const el = stageRef.current
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '100px' })
    io.observe(el)
    return () => io.disconnect()
  }, [stageRef])
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
  const lv = LEVELS[Math.min(3, Math.floor(val / 25))]
  const picks = useMemo(() => {
    const want = lv.h
    let l = products.filter((p) => (want === 0 ? p.heat === 0 : want === 4 ? p.heat >= 3 : p.heat === want))
    return l.sort((a, b) => b.reviews - a.reviews).slice(0, 3)
  }, [lv.h])
  const onChange = (e) => { const v = +e.target.value; setVal(v); heat.current = v / 100 }
  const showFallback = !can3d || reducedMotion() || motionPaused || failed3d || !canvasReady
  return (
    <section className="section heat" id="heat" style={{ '--hc': lv.c, '--glow': lv.glow }} aria-labelledby="heat-t">
      <div className="wrap">
        <div className="heat-grid">
          <div>
            <Reveal as="span" kind="slap" rot={-3} className="kicker" style={{ color: 'var(--yellow)' }}>spice-o-meter 3000</Reveal>
            <h2 className="title" id="heat-t" style={{ marginTop: 10 }}>How much <em>fire</em> can you take?</h2>
            <p className="lead">Drag the slider. Watch the chilli lose its cool. We will point you to the masalas that match your courage.</p>
            <div className="meter">
              <div className="meter-label"><strong>{lv.n}</strong><small>{lv.q}</small></div>
              <input className="range" type="range" min="0" max="100" value={val} onChange={onChange} aria-label="Heat level" aria-valuetext={`${lv.n}: ${lv.q}`} />
              <div className="ticks" aria-hidden="true"><span>Mild</span><span>Medium</span><span>Hot</span><span>Inferno</span></div>
              <span className="chip scov" style={{ background: lv.c, color: '#1A1208' }}>{lv.s}</span>
            </div>
          </div>
          <div className={`heat-stage ${showFallback ? 'with-fallback' : ''}`} ref={stageRef}>
            <span className="corner">{lv.tag}</span>
            <div className="heat-fallback" aria-hidden="true">
              <svg viewBox="0 0 100 100"><path d="M30 24c10-6 26-4 34 6 8 10 6 30-6 46-8 10-24 18-36 16 14-8 22-18 22-34 0-10-8-14-14-34z" fill="var(--hc)" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" /><path d="M30 24c-2-8 2-12 6-14 2 6 6 8 12 10-2 6-10 8-18 4z" fill="#2FA36B" stroke="var(--ink)" strokeWidth="4" /><path d="M52 34c4 6 4 16 0 24" fill="none" stroke="var(--cream)" strokeWidth="4" strokeLinecap="round" /></svg>
              <strong>{lv.n}</strong><span>Slide to find your spice match</span>
            </div>
            {seen && can3d && !reducedMotion() && !failed3d && <Boundary onError={() => setFailed3d(true)}><Suspense fallback={null}><Heat3D heat={heat} active={active && !motionPaused} mobile={mobile} onReady={() => setCanvasReady(true)} /></Suspense></Boundary>}
          </div>
        </div>
        <div className="heat-picks">
          <h3>Your heat match</h3>
          <div className="picks">
            {picks.map((p) => (
              <div className="pick" key={p.id} style={{ '--c': p.color }}>
                <div className="pt"><PouchSVG sku={p} /></div>
                <div><h4>{p.name}</h4><small>{p.notes}</small><b>{rupee(p.price)}</b></div>
                <button className="btn btn-sm btn-yellow" onClick={() => st.add(p.id, grams(p))}>Add</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- farms */
const STEPS = [['1', 'Pluck', 'Hand-picked at peak, in season only'], ['2', 'Sun-dry', 'Slow, on rooftops and woven mats'], ['3', 'Stone-grind', 'Small batches, cool, aromas intact'], ['4', 'Seal', 'Zip pouch, same week, to your door']]
export function Farm() {
  return (
    <section className="section farm" id="farm" aria-labelledby="farm-t">
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="span" kind="slap" rot={-4} className="kicker" style={{ color: 'var(--yellow)' }}>meet the farms</Reveal>
          <h2 className="title" id="farm-t">From farm to tadka in 21 days</h2>
          <p>We buy directly from five regions and tell you exactly where every pouch came from. Because &ldquo;Product of India&rdquo; is not an address.</p>
        </div>
        <div className="postcards">
          {ORIGINS.map((o, i) => (
            <Reveal key={o.n} className="pc" i={i} style={{ transform: `rotate(${[-2.5, 2, -1.5, 2.5, -2][i]}deg)` }}>
              <div className="art" style={{ '--c': o.color }}><span className="num">{o.n}</span><SpiceGlyph k={['pepper', 'chilli', 'turmeric', 'saffron', 'cardamom'][i]} size={120} /></div>
              <h3>{o.place}</h3><div className="sp">{o.spice}</div><p>{o.fact}</p>
            </Reveal>
          ))}
        </div>
        <div className="steps">
          {STEPS.map(([n, t, d], i) => <Reveal key={n} className="step" i={i}><b>{n}</b><div><h4>{t}</h4><p>{d}</p></div></Reveal>)}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- recipes */
const RECIPES = [
  { t: 'Dal tadka in 15', time: '15 min', ids: ['lakadong-haldi', 'jeera-whole', 'hing', 'dhaniya'], c: '#FFC21A', g: 'bowl', d: 'A quick tadka for cooked dal.', pantry: '2 cups cooked dal, ghee, garlic, salt', steps: ['Warm the cooked dal with ½ tsp turmeric, salt, and enough water to loosen it.', 'Heat 1 tbsp ghee. Let 1 tsp jeera crackle, then add a pinch of hing and chopped garlic.', 'Stir in ½ tsp dhaniya, pour over the dal, and simmer for 2 minutes.'] },
  { t: 'Kadak masala chai', time: '8 min', ids: ['kadak-chai', 'green-elaichi', 'dalchini'], c: '#2BA8E0', g: 'chai', d: 'A bold pot of chai for two.', pantry: '2 cups water, 1 cup milk, 2 tsp tea leaves, sugar to taste', steps: ['Crush 2 cardamom pods. Simmer them with a small cinnamon piece and ¼ tsp chai masala in the water.', 'Add tea leaves and boil for 2 minutes. Pour in milk and sweeten to taste.', 'Simmer for 2 more minutes, then strain into cups.'] },
  { t: 'Dum biryani night', time: '90 min', ids: ['biryani-masala', 'tellicherry', 'laung', 'mongra-saffron'], c: '#6B2D8B', g: 'saffron', d: 'Layer, seal, and let the spices do their work.', pantry: '1 cup basmati rice, vegetables or protein, yogurt, onion, milk, salt', steps: ['Soak the rice for 20 minutes. Parboil it with cloves and salt, then drain.', 'Cook onion and your vegetables or protein with yogurt, biryani masala, and a little pepper until nearly done.', 'Layer the rice and filling. Add saffron soaked in warm milk, cover tightly, cook on low for 20–25 minutes, and rest for 10.'] },
]
function RecipeCard({ r, i }) {
  const st = useStore()
  const items = useMemo(() => r.ids.map((id) => bySlug[id]), [r])
  const [selected, setSelected] = useState(r.ids)
  const chosen = items.filter((p) => selected.includes(p.id))
  const total = chosen.reduce((a, p) => a + p.price, 0)
  const toggle = (id) => setSelected((ids) => ids.includes(id) ? ids.filter((v) => v !== id) : [...ids, id])
  return (
    <Reveal as="article" className="recipe" i={i} style={{ '--c': r.c }}>
      <div className="r-art"><SpiceGlyph k={r.g} size={130} /><span className="chip">{r.time}</span></div>
      <h3>{r.t}</h3><p>{r.d}</p>
      <details className="recipe-method"><summary>View cooking method</summary><div><p><strong>From your kitchen:</strong> {r.pantry}</p><ol>{r.steps.map((step) => <li key={step}>{step}</li>)}</ol></div></details>
      <fieldset className="recipe-select"><legend>Choose the spices you need</legend><div>{items.map((p) => <label key={p.id}><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} />{p.name}</label>)}</div></fieldset>
      <button className="btn btn-sm btn-yellow" disabled={!chosen.length} onClick={() => { chosen.forEach((p) => st.add(p.id, grams(p), 1, { open: false, silent: true })); st.say(`Added ${chosen.length} spices`); st.open('cart', true) }}>Add {chosen.length} selected &middot; {rupee(total)}</button>
    </Reveal>
  )
}
export function Recipes() {
  return (
    <section className="section" id="recipes" aria-labelledby="rec-t">
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="span" kind="slap" rot={3} className="kicker">cook it tonight</Reveal>
          <h2 className="title" id="rec-t">Recipes, with a shopping list</h2>
        </div>
        <div className="recipes">
          {RECIPES.map((r, i) => <RecipeCard key={r.t} r={r} i={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- bundles */
export function Gifting() {
  const st = useStore()
  return (
    <section className="section gift" id="gifting" aria-labelledby="gift-t">
      <div className="zig" aria-hidden="true" />
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="span" kind="slap" rot={-3} className="kicker">combos and gifting</Reveal>
          <h2 className="title" id="gift-t">Bundles that <em>save</em> you money</h2>
          <p>Wedding favours, Diwali dabbas, or just a very good Tuesday. Gift-wrapped, with a handwritten note.</p>
        </div>
        <div className="bundles">
          {BUNDLES.map((b, i) => {
            const items = b.items.map((id) => bySlug[id])
            const sum = items.reduce((a, p) => a + p.price, 0)
            return (
              <Reveal key={b.id} className="bun" i={i} style={{ '--c': b.color }}>
                <Reveal as="span" kind="slap" rot={7} className="tag">{b.id === 'tadka-kit' ? `Save ${rupee(Math.max(sum, b.mrp) - b.price)}` : b.tag}</Reveal>
                <div className="stack" aria-hidden="true">
                  {items.slice(0, 3).map((p, k) => <PouchSVG key={p.id} sku={p} className="" />).map((el, k) => <div key={k} style={{ position: 'absolute', bottom: -8, left: `${8 + k * 28}%`, width: '34%', transform: `rotate(${(k - 1) * 8}deg)`, zIndex: k === 1 ? 2 : 1 }}>{el}</div>)}
                </div>
                <h3>{b.name}</h3>
                <p>{b.sub}</p>
                <ul className="inc">{items.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
                <div className="row">
                  <div className="price"><b>{rupee(b.price)}</b><s>{rupee(sum > b.mrp ? sum : b.mrp)}</s><span className="off">Save {rupee(Math.max(sum, b.mrp) - b.price)}</span></div>
                  <button className="btn btn-sm btn-ink" onClick={() => st.add('bundle:' + b.id, 0)}>Add combo</button>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- reviews */
const DIST = [[5, 88], [4, 8], [3, 2], [2, 1], [1, 1]]
export function Reviews() {
  return (
    <section className="section reviews" id="reviews" aria-labelledby="rev-t">
      <div className="wrap">
        <div className="sec-head">
          <Reveal as="span" kind="slap" rot={4} className="kicker" style={{ color: 'var(--cream)' }}>happy tongues</Reveal>
          <h2 className="title" id="rev-t">Loved by 18,000 kitchens</h2>
        </div>
        <div className="rev-sum">
          <div className="big"><b>4.8</b><Stars v={4.8} size={22} /><span>18,420 verified reviews</span></div>
          <ul className="dist">{DIST.map(([n, p]) => <li key={n}><span>{n}</span><Star size={14} /><i><u style={{ width: p + '%' }} /></i><em>{p}%</em></li>)}</ul>
        </div>
      </div>
      <Marquee className="bubbles" dur={80} accessible>
        {REVIEWS.map((r, i) => (
          <article className="bubble" key={i}>
            <Stars v={5} size={16} />
            <h3>{r.t}</h3>
            <p>{r.b}</p>
            <footer><b>{r.n}, {r.c}</b><span>Verified buyer</span></footer>
          </article>
        ))}
      </Marquee>
    </section>
  )
}

export function Retail() {
  return (
    <section className="retail">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <Reveal as="span" kind="slap" rot={-3} className="kicker">also find us on</Reveal>
        <div className="retail-row">{['Amazon', 'Flipkart', 'Blinkit', 'Zepto', 'BigBasket', 'Swiggy Instamart'].map((n) => <span key={n}>{n}</span>)}</div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- newsletter */
export function Newsletter() {
  const [done, setDone] = useState(false)
  return (
    <section className="section newsl" id="club">
      <div className="wrap newsl-in">
        <div>
          <Reveal as="span" kind="slap" rot={-3} className="kicker">the masala club</Reveal>
          <h2 className="title" style={{ marginTop: 10 }}>Get <em>10% off</em> and one terrible dad joke a week</h2>
          {done ? <p className="thanks">You are in! Use FIRST10 at checkout.</p> : (
            <form onSubmit={(e) => { e.preventDefault(); setDone(true) }}>
              <input type="email" required placeholder="you@tadka.in" aria-label="Email address" />
              <button className="btn btn-ink" type="submit">Join the club</button>
            </form>
          )}
        </div>
        <ul className="perks">
          <li><b>01</b> New batches before anyone else</li>
          <li><b>02</b> Recipes from actual grandmothers</li>
          <li><b>03</b> Birthday gift pouch, on us</li>
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- sign-off */
function Skyline() {
  const ink = { stroke: '#1A1208', strokeWidth: 4, strokeLinejoin: 'round' }
  return (
    <svg viewBox="0 0 1200 330" aria-hidden="true">
      <circle cx="1040" cy="90" r="54" fill="#FFC21A" {...ink} />
      <g {...ink}>
        {/* hawa mahal */}
        <g transform="translate(40 0)"><path d="M0 330V230h40v-40h40v-40h60v40h40v40h40v100z" fill="#F7BFD0" />{[[30,250],[90,250],[150,250],[100,200],[60,206],[130,206],[100,164]].map(([x,y],i)=><path key={i} d={`M${x} ${y+22}v-12a8 8 0 0116 0v12z`} fill="#FFF3DC" strokeWidth="3" />)}</g>
        {/* charminar */}
        <g transform="translate(300 0)"><rect x="10" y="150" width="30" height="180" fill="#FFC21A" /><rect x="130" y="150" width="30" height="180" fill="#FFC21A" /><rect x="40" y="215" width="90" height="115" fill="#FF8A6B" /><path d="M54 330v-50a31 31 0 0162 0v50z" fill="#FFF3DC" /><path d="M10 150l15-34 15 34zM130 150l15-34 15 34z" fill="#E03A2F" /><circle cx="25" cy="112" r="6" fill="#E03A2F" /><circle cx="145" cy="112" r="6" fill="#E03A2F" /></g>
        {/* taj */}
        <g transform="translate(540 0)"><rect x="0" y="120" width="26" height="210" fill="#FFF3DC" /><rect x="214" y="120" width="26" height="210" fill="#FFF3DC" /><path d="M-4 120h34l-17-34zM210 120h34l-17-34z" fill="#2BA8E0" /><rect x="34" y="230" width="172" height="100" fill="#FFF3DC" /><path d="M60 230c0-70 30-90 60-120 30 30 60 50 60 120z" fill="#C9C0F0" /><path d="M120 110V70" strokeLinecap="round" /><circle cx="120" cy="64" r="6" fill="#FFC21A" /><path d="M96 330v-54a24 24 0 0148 0v54z" fill="#6B2D8B" /></g>
        {/* india gate */}
        <g transform="translate(830 0)"><rect x="0" y="170" width="120" height="160" fill="#FFC21A" /><rect x="-8" y="156" width="136" height="18" fill="#E8501A" /><path d="M30 330v-90a30 30 0 0160 0v90z" fill="#FFF3DC" /></g>
        {/* gopuram */}
        <g transform="translate(1000 0)"><path d="M0 330V290h130v40zM12 290V250h106v40zM26 250V214h78v36zM40 214V184h50v30zM54 184V160h22v24z" fill="#2FA36B" />{[290,250,214].map((y,i)=><path key={i} d={`M10 ${y}h110`} strokeWidth="3" />)}<circle cx="65" cy="152" r="8" fill="#FFC21A" /></g>
      </g>
      <path d="M0 322h1200" stroke="#1A1208" strokeWidth="6" />
    </svg>
  )
}
export function Signoff() {
  return (
    <section className="signoff" aria-label="Sign-off">
      <div className="wrap signoff-content">
        <span className="signoff-kicker">one last pinch</span>
        <h2><span>{BRAND}</span><span>about you <span className="h" aria-hidden="true">&hearts;</span></span></h2>
        <p>Good food brings us together. Find a little more flavour for your next meal.</p>
        <a className="btn btn-yellow" href="#shop">Shop the spices <Arrow size={20} /></a>
      </div>
      <div className="sky sky-wrap"><Skyline /></div>
    </section>
  )
}

/* ---------------------------------------------------------- footer */
export function Footer() {
  return (
    <footer className="foot" id="about">
      <div className="wrap">
        <div className="foot-top">
          <div><span className="foot-eyebrow">Keep the good food coming</span><div className="fbig">{BRAND}<em>.</em></div></div>
          <a className="foot-top-link" href="#top">Back to top <span aria-hidden="true">&uarr;</span></a>
        </div>
        <div className="foot-grid">
          <div className="foot-intro">
            <p>{brand.tagline}</p>
            <span>For every pinch that makes dinner yours.</span>
          </div>
          <nav aria-label="Footer shop"><h3>Shop</h3><ul><li><a href="#shop">Best sellers</a></li><li><a href="#browse">All categories</a></li><li><a href="#gifting">Combos & gifting</a></li></ul></nav>
          <nav aria-label="Footer explore"><h3>Explore</h3><ul><li><a href="#heat">Find your heat</a></li><li><a href="#farm">Meet the farms</a></li><li><a href="#club">Masala Club</a></li></ul></nav>
          <div className="foot-feature">
            <span aria-hidden="true"><SpiceGlyph k="bowl" size={42} /></span>
            <h3>Cook up something good</h3>
            <p>Choose a recipe, then build your spice list.</p>
            <a href="#recipes">Explore recipes <Arrow size={18} /></a>
          </div>
        </div>
        <div className="foot-bot"><span>&copy; 2026 {BRAND} Spices. All rights reserved.</span><span>Made for more delicious days.</span></div>
      </div>
    </footer>
  )
}
