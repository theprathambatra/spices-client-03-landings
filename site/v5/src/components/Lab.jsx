import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { products, byId, sheets, AXES, BRAND } from '../data'
import { Scramble, CountUp, Radar, Magnetic, useCart } from './ui'
import { useInView, inr } from '../lib/util'
import GLBoundary from './GLBoundary'

const RefractionJar = lazy(() => import('../three/RefractionJar'))

const JAR_IDS = ['kashmiri-chilli', 'lakadong-turmeric', 'green-cardamom', 'kashmiri-saffron', 'tellicherry-pepper', 'star-anise']
const PIG = { 'kashmiri-chilli': ['Capsanthin', 'carotenoid / red'], 'lakadong-turmeric': ['Curcumin', 'diarylheptanoid / yellow'], 'green-cardamom': ['Chlorophyll', 'tetrapyrrole / green'], 'kashmiri-saffron': ['Crocin', 'apocarotenoid / amber'], 'tellicherry-pepper': ['Melanoidin', 'polymer / black'], 'star-anise': ['Tannin', 'polyphenol / umber'] }

export function JarSection() {
  const [ref, inView] = useInView({ rootMargin: '80px' })
  const [nearRef, nearIO] = useInView({ rootMargin: '700px' }, true)
  const [idle, setIdle] = useState(false)
  useEffect(() => { const id = setTimeout(() => setIdle(true), 1600); return () => clearTimeout(id) }, [])
  const near = nearIO || idle
  const [sel, setSel] = useState(JAR_IDS[1])
  const { add } = useCart()
  const p = byId[sel]
  const lot = sheets.find((s) => s.id === sel)?.lot || 'KS-2412-' + p.sku.slice(-3)
  const spice = useMemo(() => ({ name: p.name, origin: p.origin, color: p.color, lot, spec: p.wt + ' · ' + p.sku }), [p, lot])
  const hex = p.color.toUpperCase()
  return (
    <div ref={nearRef}>
    <section className="jar" id="specimen" ref={ref}>
      <div className="jar-canvas" aria-hidden="true">
        {near && <GLBoundary><Suspense fallback={null}><RefractionJar spice={spice} active={inView} /></Suspense></GLBoundary>}
      </div>
      <div className="wrap jar-ui">
        <div className="jar-left">
          <p className="eyebrow mono"><i className="dot" /> Specimen jar / live dye field</p>
          <h2><Scramble text="Stir the" /><br /><Scramble text="pigment." delay={120} /></h2>
          <p className="lede">Drag your cursor through the field. The jar bends the light, and the dye is the spice's real pigment. Pick a specimen to change the dye.</p>
          <div className="chips mono" role="radiogroup" aria-label="Choose specimen">
            {JAR_IDS.map((id) => (
              <button key={id} role="radio" aria-checked={sel === id} className={'chip' + (sel === id ? ' on' : '')} onClick={() => setSel(id)}>
                <i style={{ background: byId[id].color }} />{byId[id].name}
              </button>
            ))}
          </div>
        </div>
        <div className="jar-card glass mono">
          <div className="row"><span>SPECIMEN</span><b>{p.sku}</b></div>
          <div className="row"><span>PIGMENT</span><b><Scramble text={PIG[sel][0].toUpperCase()} trigger="key" duration={350} /></b></div>
          <div className="row"><span>CLASS</span><b>{PIG[sel][1]}</b></div>
          <div className="row"><span>DYE</span><b><i className="sw" style={{ background: p.color }} /> {hex}</b></div>
          <div className="row"><span>ORIGIN</span><b>{p.origin}</b></div>
          <div className="jar-buy">
            <span className="price">{inr(p.price)} <small>/ {p.wt}</small></span>
            <button className="btn btn-dark" onClick={() => add(p.id)}>Add to cart +</button>
          </div>
        </div>
        <p className="mono jar-hint">↖ MOVE CURSOR / TOUCH TO STIR</p>
      </div>
    </section>
    </div>
  )
}

export function Compound() {
  const [i, setI] = useState(0)
  const sh = sheets[i], p = byId[sh.id]
  return (
    <section className="sec compound" id="compound">
      <div className="wrap">
        <header className="sec-head">
          <p className="eyebrow mono"><i className="dot" /> 02 / Compound sheet</p>
          <h2><Scramble text="The numbers are" /> <em>on the pouch.</em></h2>
          <p className="lede">Every batch is assayed at an NABL-accredited lab in Kochi. Here is what that looks like, no adjectives.</p>
        </header>
        <div className="tabs mono" role="tablist">
          {sheets.map((s, k) => (
            <button key={s.id} role="tab" aria-selected={k === i} className={k === i ? 'on' : ''} onClick={() => setI(k)}>{byId[s.id].name}</button>
          ))}
        </div>
        <div className="sheet">
          <div className="sheet-side mono">
            <div className="sheet-id">
              <small>COMPOUND SHEET</small>
              <strong><Scramble text={p.name.toUpperCase()} trigger="key" duration={380} /></strong>
              <span>{p.vern}</span>
            </div>
            <dl>
              <div><dt>LOT</dt><dd>{sh.lot}</dd></div>
              <div><dt>HARVEST</dt><dd>{sh.harvest}</dd></div>
              <div><dt>ORIGIN</dt><dd>{p.origin}</dd></div>
              <div><dt>PACKED</dt><dd>{p.wt} · N2 flushed</dd></div>
            </dl>
            <Qr seed={sh.lot} />
            <small className="qr-cap">SCAN → FARM + FULL COA (PDF)</small>
          </div>
          <table className="spec-table mono">
            <thead><tr><th>Parameter</th><th className="num">Result</th><th>Unit</th><th>Level</th></tr></thead>
            <tbody>
              {sh.rows.map(([name, val, unit, max]) => (
                <tr key={name + sh.id}>
                  <td>{name}</td>
                  <td className="num"><b><CountUp key={sh.id + name} to={val} decimals={val % 1 ? (val < 1 ? 2 : 1) : 0} dur={700} /></b></td>
                  <td className="unit">{unit}</td>
                  <td className="lvl"><i><b style={{ width: Math.max(2, Math.min(100, (val / max) * 100)) + '%', background: p.color }} /></i></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mono foot-note">* Indicative values from the latest retained batch. Bars show result against the upper reference limit for the parameter.</p>
      </div>
    </section>
  )
}

function Qr({ seed }) {
  const cells = useMemo(() => {
    let h = 2166136261
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
    const out = []
    for (let y = 0; y < 17; y++) for (let x = 0; x < 17; x++) {
      const finder = (x < 6 && y < 6) || (x > 10 && y < 6) || (x < 6 && y > 10)
      h = Math.imul(h ^ (x * 31 + y * 17), 16777619) >>> 0
      if (!finder && (h >> 7) % 2) out.push([x, y])
    }
    return out
  }, [seed])
  const f = (x, y) => <g key={x + '' + y}><rect x={x} y={y} width="6" height="6" /><rect x={x + 1} y={y + 1} width="4" height="4" fill="#EEF0EA" /><rect x={x + 2} y={y + 2} width="2" height="2" /></g>
  return (
    <svg viewBox="0 0 17 17" className="qr" aria-label="Batch QR code" shapeRendering="crispEdges">
      <rect width="17" height="17" fill="#EEF0EA" />
      <g fill="#0F1113">{f(0, 0)}{f(11, 0)}{f(0, 11)}{cells.map(([x, y]) => <rect key={x + '-' + y} x={x} y={y} width="1" height="1" />)}</g>
    </svg>
  )
}

// SHU scale (log) + flavour radar
const SHU_MARKS = [
  ['Bell pepper', 0], ['Kashmiri', 2000], ['Byadgi', 15000], ['Guntur', 35000], ['Habanero', 300000], ['Bhut Jolokia', 1000000], ['Pepper spray', 3000000],
]
export function HeatRadar() {
  const [a, setA] = useState('green-cardamom')
  const [b, setB] = useState('tellicherry-pepper')
  const [hover, setHover] = useState(null)
  const pa = byId[a], pb = byId[b]
  const x = (v) => (v <= 0 ? 0 : Math.min(100, (Math.log10(v + 1) / Math.log10(3200000)) * 100))
  return (
    <section className="sec dark heat" id="radar">
      <div className="wrap">
        <header className="sec-head">
          <p className="eyebrow mono"><i className="dot" /> 03 / Heat scale &amp; flavour radar</p>
          <h2><Scramble text="Heat is a number." /> <em>Flavour is a shape.</em></h2>
        </header>
        <div className="heat-grid">
          <div className="scale glass-d">
            <div className="scale-head mono"><span>SCOVILLE HEAT UNITS (LOG)</span><span>{hover ? hover[0].toUpperCase() + ' · ' + hover[1].toLocaleString('en-IN') + ' SHU' : 'HOVER A MARKER'}</span></div>
            <div className="scale-bar">
              <i className="fill" style={{ width: x(Math.max(pa.shu, pb.shu, 2000)) + '%' }} />
              {SHU_MARKS.map(([n, v]) => (
                <button key={n} className="mark mono" style={{ left: x(v) + '%' }} onMouseEnter={() => setHover([n, v])} onFocus={() => setHover([n, v])} onMouseLeave={() => setHover(null)}>
                  <i /><span>{n}</span>
                </button>
              ))}
            </div>
            <ul className="mono shu-list">
              {products.filter((p) => p.shu).map((p) => (
                <li key={p.id}><span>{p.name}</span><b><CountUp to={p.shu} /> <small>SHU</small></b><i><u style={{ width: x(p.shu) + '%', background: p.color }} /></i></li>
              ))}
            </ul>
          </div>
          <div className="radar-box glass-d">
            <div className="mono radar-pick">
              <label>A <select value={a} onChange={(e) => setA(e.target.value)}>{products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
              <label>B <select value={b} onChange={(e) => setB(e.target.value)}>{products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
            </div>
            <Radar size={340} labels={AXES} series={[{ id: 'a', values: pa.radar, color: '#C6FF3D' }, { id: 'b', values: pb.radar, color: '#FF3B1F' }]} />
            <div className="mono legend"><span><i style={{ background: '#C6FF3D' }} />{pa.name}</span><span><i style={{ background: '#FF3B1F' }} />{pb.name}</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Traceability
const BATCHES = {
  'KS-2409-LKD': { spice: 'Lakadong Turmeric', farm: 'Pyrdiwah Growers Collective', place: 'Jaintia Hills, Meghalaya', lat: 25.35, lon: 92.21, farmers: 38, curcumin: '7.8%', grown: 'Feb 2026', ground: '04 Mar 2026', lab: 'Eurofins Kochi · #KL-88213' },
  'KS-2410-GCD': { spice: 'Green Cardamom', farm: 'Vandanmedu Estate Co-op', place: 'Idukki, Kerala', lat: 9.85, lon: 77.1, farmers: 21, curcumin: '1,8-cineole 36%', grown: 'Oct 2025', ground: '19 Nov 2025', lab: 'SGS Kochi · #KL-87120' },
  'KS-2409-KCH': { spice: 'Kashmiri Chilli', farm: 'Budgam Chilli Growers', place: 'Budgam, Kashmir', lat: 34.02, lon: 74.79, farmers: 44, curcumin: '2,000 SHU', grown: 'Nov 2025', ground: '12 Dec 2025', lab: 'Eurofins Kochi · #KL-86441' },
}
export function Trace() {
  const [code, setCode] = useState('KS-2409-LKD')
  const [typed, setTyped] = useState('KS-2409-LKD')
  const b = BATCHES[code]
  const px = ((b.lon - 68) / (98 - 68)) * 100, py = (1 - (b.lat - 6) / (37 - 6)) * 100
  const scan = (e) => { e.preventDefault(); const k = typed.trim().toUpperCase(); if (BATCHES[k]) setCode(k) }
  return (
    <section className="sec trace" id="trace">
      <div className="wrap">
        <header className="sec-head">
          <p className="eyebrow mono"><i className="dot" /> 05 / Traceability</p>
          <h2><Scramble text="Scan the batch." /> <em>Meet the farm.</em></h2>
          <p className="lede">Every pouch carries a lot code. Type one in (try the three below) and see where it grew, who grew it and what the lab found.</p>
        </header>
        <div className="trace-grid">
          <div>
            <form onSubmit={scan} className="scanner mono">
              <label htmlFor="lot">LOT CODE</label>
              <input id="lot" value={typed} onChange={(e) => setTyped(e.target.value)} spellCheck="false" />
              <button className="btn btn-dark">Scan ⌕</button>
            </form>
            <div className="chips mono">
              {Object.keys(BATCHES).map((k) => <button key={k} className={'chip' + (k === code ? ' on' : '')} onClick={() => { setCode(k); setTyped(k) }}>{k}</button>)}
            </div>
            <dl className="trace-dl mono">
              <div><dt>SPICE</dt><dd>{b.spice}</dd></div>
              <div><dt>FARM</dt><dd>{b.farm}</dd></div>
              <div><dt>PLACE</dt><dd>{b.place}</dd></div>
              <div><dt>FARMERS</dt><dd><CountUp key={code} to={b.farmers} dur={600} /> households</dd></div>
              <div><dt>KEY ASSAY</dt><dd>{b.curcumin}</dd></div>
              <div><dt>HARVEST → GRIND</dt><dd>{b.grown} → {b.ground}</dd></div>
              <div><dt>LAB REPORT</dt><dd>{b.lab}</dd></div>
            </dl>
          </div>
          <div className="map" aria-label={'Map position ' + b.lat + ' N ' + b.lon + ' E'}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="map-grid">
              {Array.from({ length: 11 }, (_, k) => <line key={'v' + k} x1={k * 10} y1="0" x2={k * 10} y2="100" />)}
              {Array.from({ length: 11 }, (_, k) => <line key={'h' + k} x1="0" y1={k * 10} x2="100" y2={k * 10} />)}
            </svg>
            <IndiaDots />
            <div className="pin" style={{ left: px + '%', top: py + '%' }}><i /><span className="mono">{b.lat.toFixed(2)}°N {b.lon.toFixed(2)}°E</span></div>
            <small className="mono map-cap">WGS84 · FARM GATE COORDINATES</small>
          </div>
        </div>
      </div>
    </section>
  )
}

// dotted outline of India from a coarse polygon
const POLY = [[68.2,23.7],[70,21],[72.8,19],[73.5,15.5],[75,12],[76.3,8.1],[77.5,8.1],[78.3,9.2],[80.3,13.3],[80.2,15.8],[82.5,17],[85,19.8],[87,21.5],[89,22],[88.8,26],[92,26.8],[95,27.5],[96.7,28],[96,29.4],[93,28.5],[91.5,27.8],[88.5,27.5],[84,28.7],[81,30.2],[79,32.6],[78.5,35.6],[76,36.5],[74.5,35.5],[73.8,34.3],[74.6,32.5],[74,31],[71,28],[69.5,25.5]]
function inside(x, y) { let c = false; for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) { const [xi, yi] = POLY[i], [xj, yj] = POLY[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c } return c }
function IndiaDots() {
  const dots = useMemo(() => { const o = []; for (let gx = 68; gx <= 98; gx += 0.75) for (let gy = 6; gy <= 37; gy += 0.75) if (inside(gx, gy)) o.push([((gx - 68) / 30) * 100, (1 - (gy - 6) / 31) * 100]); return o }, [])
  return <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="map-dots">{dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.38" />)}</svg>
}
