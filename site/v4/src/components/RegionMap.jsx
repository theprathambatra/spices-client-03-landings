import { useMemo, useState } from 'react'
import { regions, indiaOutline } from '../data'
import { SectionHead } from './Ornaments'

const proj = ([lon, lat]) => [(lon - 67) * 15.2, (38.5 - lat) * 16.6]

export default function RegionMap() {
  const [sel, setSel] = useState('malabar')
  const d = useMemo(() => 'M' + indiaOutline.map((pt) => proj(pt).map((n) => n.toFixed(1)).join(',')).join('L') + 'Z', [])
  const r = regions.find((x) => x.id === sel)
  return (
    <section className="section regions" id="regions">
      <SectionHead eyebrow="Origins" title="Six regions, six spice kingdoms" hi="छह रियासतें">Every spice has an address. Tap a kingdom to see what grows there.</SectionHead>
      <div className="regions-grid">
        <div className="map-wrap">
          <svg viewBox="-10 -10 470 580" className="india" role="img" aria-label="Illustrated map of India with six spice regions">
            <defs>
              <pattern id="blockp" width="22" height="22" patternUnits="userSpaceOnUse">
                <rect width="22" height="22" fill="#FFE9B8" />
                <path d="M11 3 l6 8 -6 8 -6 -8z" fill="none" stroke="#D4A017" strokeWidth="1.1" />
                <circle cx="11" cy="11" r="1.6" fill="#D81B76" />
              </pattern>
            </defs>
            <path d={d} transform="translate(4 8)" fill="#1E1B5E" opacity=".25" />
            <path d={d} fill="url(#blockp)" stroke="#1E1B5E" strokeWidth="3" strokeLinejoin="round" />
            <path d={d} fill="none" stroke="#D4A017" strokeWidth="1.2" strokeDasharray="2 6" transform="scale(.985) translate(3 5)" />
            {regions.map((g) => {
              const [x, y] = proj(g.lonlat)
              const on = g.id === sel
              return (
                <g key={g.id} className={'pin' + (on ? ' on' : '')} transform={`translate(${x} ${y})`} tabIndex={0} role="button" aria-label={g.name} aria-pressed={on}
                  onClick={() => setSel(g.id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(g.id)}>
                  <circle r="26" fill={g.hue} opacity=".18" className="halo" />
                  <circle r="13" fill={g.hue} stroke="#FFF6E5" strokeWidth="3" />
                  <path d="M0 -6 l2 4 4 .5 -3 3 .8 4 -3.8 -2 -3.8 2 .8 -4 -3 -3 4 -.5z" fill="#FFF6E5" transform="scale(.9)" />
                  <text y="34" textAnchor="middle" className="pin-l">{g.name}</text>
                </g>
              )
            })}
          </svg>
        </div>
        <div className="region-card" key={r.id} style={{ '--rc': r.hue }}>
          <p className="eyebrow">{r.name}</p>
          <h3>{r.title}</h3>
          <p>{r.line}</p>
          <ul>{r.spices.map((s) => <li key={s}>{s}</li>)}</ul>
          <a className="btn btn-solid" href="#shop">Shop {r.name} spices</a>
        </div>
        <ol className="region-list">
          {regions.map((g, i) => <li key={g.id}><button className={g.id === sel ? 'on' : ''} onClick={() => setSel(g.id)} style={{ '--rc': g.hue }}><b>{i + 1}</b>{g.name}</button></li>)}
        </ol>
      </div>
    </section>
  )
}
