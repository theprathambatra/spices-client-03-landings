import { useId } from 'react'
import { BRAND } from '../data'

const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16)
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + amt * (amt > 0 ? 255 - v : v))))
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(f).map((v) => v.toString(16).padStart(2, '0')).join('')
}
const split = (name) => {
  const w = name.split(' ')
  if (w.length === 1) return [name, '']
  const mid = Math.ceil(w.length / 2)
  return [w.slice(0, mid).join(' '), w.slice(mid).join(' ')]
}

const fs = (t) => Math.min(15.5, 84 / Math.max(1, t.length * 0.56))
export default function Pack({ p, motif = 0, className = '' }) {
  const id = useId().replace(/:/g, '')
  const c = p.color, dk = shade(c, -0.35), lt = shade(c, 0.35)
  const [l1, l2] = split(p.name)
  return (
    <svg className={'pack ' + className} viewBox="0 0 200 250" role="img" aria-label={`${p.name} pack`}>
      <defs>
        <linearGradient id={'g' + id} x1="0" x2="1"><stop offset="0" stopColor={dk} /><stop offset=".3" stopColor={c} /><stop offset=".7" stopColor={c} /><stop offset="1" stopColor={dk} /></linearGradient>
        <clipPath id={'c' + id}><path d="M34 34 Q100 22 166 34 L176 222 Q100 234 24 222 Z" /></clipPath>
      </defs>
      <ellipse cx="100" cy="238" rx="72" ry="8" fill="rgba(10,4,40,.28)" />
      <path d="M34 34 Q100 22 166 34 L176 222 Q100 234 24 222 Z" fill={`url(#g${id})`} />
      <g clipPath={`url(#c${id})`}>
        <path d="M30 26 h140 v14 h-140z" fill={dk} opacity=".55" />
        {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${34 + i * 10} 30 v10`} stroke={dk} strokeWidth="2" opacity=".5" />)}
        {/* border motif rows */}
        {Array.from({ length: 7 }).map((_, i) => (motif % 2 ? <circle key={i} cx={36 + i * 21} cy="215" r="5" fill={lt} opacity=".8" /> : <path key={i} d={`M${28 + i * 24} 222 l12 -14 l12 14z`} fill={lt} opacity=".8" />))}
        <path d="M30 56 h140" stroke="#F7E7B3" strokeWidth="1.5" strokeDasharray="2 5" opacity=".9" />
        {/* label arch */}
        <path d="M54 190 V104 Q54 70 100 62 Q146 70 146 104 V190 Z" fill="#FFF6E5" />
        <path d="M60 184 V106 Q60 76 100 69 Q140 76 140 106 V184 Z" fill="none" stroke={c} strokeWidth="1.6" />
        <g transform="translate(100 96)" fill={c}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <ellipse key={a} cx="0" cy="-9" rx="3.4" ry="8" transform={`rotate(${a})`} opacity=".9" />)}
          <circle r="4" fill="#D4A017" />
        </g>
        <text x="100" y="140" textAnchor="middle" fontFamily="'Rozha One', serif" fontSize={fs(l1)} fill="#1E1B5E">{l1}</text>
        <text x="100" y="157" textAnchor="middle" fontFamily="'Rozha One', serif" fontSize={fs(l2)} fill="#1E1B5E">{l2}</text>
        <text x="100" y="173" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontStyle="italic" fontWeight="600" fontSize="10.5" fill={dk}>{p.origin}</text>
        <text x="100" y="185" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="5.4" letterSpacing="1.6" fill="#1E1B5E">{BRAND.toUpperCase()} · {p.weight}</text>
      </g>
      <path d="M34 34 Q100 22 166 34 L176 222 Q100 234 24 222 Z" fill="none" stroke="rgba(255,255,255,.2)" />
      <path d="M44 40 Q42 130 36 218" stroke="rgba(255,255,255,.22)" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  )
}
export { shade }
