import { farmers } from '../data'
import { SectionHead, PatternBorder, Mandala } from './Ornaments'

function Portrait({ f }) {
  return (
    <svg viewBox="0 0 200 240" className="portrait" role="img" aria-label={`Portrait of ${f.name}`}>
      <rect width="200" height="240" fill="#FFF6E5" />
      <circle cx="100" cy="120" r="92" fill="none" stroke="#D4A017" strokeWidth="1.5" strokeDasharray="2 6" />
      <path d="M30 240 Q40 170 100 165 Q160 170 170 240Z" fill="#1E1B5E" />
      <path d="M78 165 L100 195 L122 165Z" fill="#FFF6E5" />
      <rect x="88" y="140" width="24" height="30" fill={f.skin} />
      <ellipse cx="100" cy="112" rx="38" ry="46" fill={f.skin} />
      {f.beard && <path d="M64 118 Q66 168 100 170 Q134 168 136 118 Q126 146 100 146 Q74 146 64 118Z" fill="#3a2a20" />}
      <path d="M84 128 Q100 136 116 128" stroke="#3a2a20" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M62 100 Q60 56 100 52 Q140 56 138 100 Q120 78 100 80 Q80 78 62 100Z" fill={f.turban} />
      <path d="M58 98 Q100 64 142 98 Q100 88 58 98Z" fill="rgba(0,0,0,.18)" />
      <path d="M70 62 Q100 40 134 66" stroke="rgba(255,255,255,.35)" strokeWidth="4" fill="none" />
      <circle cx="100" cy="64" r="6" fill="#D4A017" />
      <circle cx="84" cy="108" r="3.4" fill="#1E1B5E" /><circle cx="116" cy="108" r="3.4" fill="#1E1B5E" />
      <path d="M76 98 Q84 94 92 98M108 98 Q116 94 124 98" stroke="#3a2a20" strokeWidth="3" fill="none" />
      <circle cx="100" cy="92" r="2.4" fill="#D81B76" />
    </svg>
  )
}

export default function Story() {
  return (
    <section className="story" id="story">
      <PatternBorder kind="vine" color="#F7A614" color2="#FFF6E5" />
      <div className="story-in">
        <SectionHead light eyebrow="Our story" title="Farmers first. Names on the pouch." hi="किसान, पहले">
          We buy directly from 340 family farms across eleven states, pay above mandi rates, and print the farmer’s name on every batch. Block-print on the label. Honesty in the jar.
        </SectionHead>
        <div className="farmers">
          {farmers.map((f, i) => (
            <figure key={f.name} className="farmer" style={{ '--d': i }}>
              <div className="fr-arch"><Portrait f={f} /></div>
              <figcaption>
                <b>{f.name}</b><em>{f.place} · {f.crop}</em>
                <p>“{f.line}”</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <ul className="story-stats">
          <li><b>340</b><span>partner farms</span></li><li><b>28</b><span>days field-to-pouch</span></li><li><b>0</b><span>fillers, colours, preservatives</span></li><li><b>100%</b><span>batches lab-tested</span></li>
        </ul>
      </div>
      <PatternBorder kind="scallop" color="#F7A614" color2="#FFF6E5" flip />
    </section>
  )
}
