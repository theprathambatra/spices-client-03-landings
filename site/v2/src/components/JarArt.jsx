import { BRAND } from '../brand'

function lines(name) {
  const w = name.toUpperCase().split(' ')
  if (w.length === 1) return [w[0]]
  let best = null
  for (let k = 1; k < w.length; k++) {
    const l = [w.slice(0, k).join(' '), w.slice(k).join(' ')]
    const m = Math.max(l[0].length, l[1].length)
    if (!best || m < best.m) best = { l, m }
  }
  return best.l
}

// SVG illustration of a glass kirana jar with a paper label (no photos needed)
export default function JarArt({ p, className = '', uid }) {
  const id = 'j' + (uid || p.id)
  const ls = lines(p.name)
  const fs = Math.min(ls.length === 1 ? 30 : 22, 98 / (Math.max(...ls.map((l) => l.length)) * 0.45))
  return (
    <svg className={'jarart ' + className} viewBox="0 0 200 270" role="img" aria-label={p.name + ' jar'}>
      <defs>
        <clipPath id={id + 'c'}><path d="M34 70 Q34 56 48 54 L152 54 Q166 56 166 70 L168 236 Q168 254 150 254 L50 254 Q32 254 32 236 Z" /></clipPath>
        <linearGradient id={id + 'g'} x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".18" stopColor="#fff" stopOpacity="0" /><stop offset=".85" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".2" /></linearGradient>
      </defs>
      <ellipse cx="100" cy="259" rx="70" ry="6" fill="#2A1710" opacity=".18" />
      <rect x="52" y="12" width="96" height="36" rx="6" fill="#6a3a22" />
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={58 + i * 14} y="14" width="2" height="32" fill="#4c2514" opacity=".6" />)}
      <rect x="48" y="44" width="104" height="12" rx="3" fill="#7d4a2e" />
      <path d="M34 70 Q34 56 48 54 L152 54 Q166 56 166 70 L168 236 Q168 254 150 254 L50 254 Q32 254 32 236 Z" fill="#fff" opacity=".5" />
      <g clipPath={`url(#${id}c)`}>
        <path d="M30 86 Q100 70 170 86 L170 260 L30 260 Z" fill={p.fill} />
        <g fill="#fff" opacity=".12">{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={36 + ((i * 47) % 128)} cy={92 + ((i * 29) % 156)} r={1 + (i % 3) * 0.6} />)}</g>
        <g fill="#000" opacity=".1">{Array.from({ length: 9 }, (_, i) => <circle key={i} cx={40 + ((i * 61) % 120)} cy={100 + ((i * 37) % 140)} r={1 + (i % 2)} />)}</g>
        <rect x="30" y="50" width="140" height="210" fill={`url(#${id}g)`} />
      </g>
      <rect x="44" y="112" width="112" height="112" rx="3" fill="#F3E8D6" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={44 + i * 14} y="112" width="14" height="9" fill={i % 2 ? '#F2B230' : '#C62A1F'} />)}
      <rect x="68" y="128" width="64" height="15" fill="#C62A1F" />
      <text x="100" y="139.5" textAnchor="middle" fontFamily="Anton" fontSize="11" fill="#FBF4E8" letterSpacing=".6">{BRAND.toUpperCase()}</text>
      {ls.map((l, i) => <text key={i} x="100" y={(ls.length === 1 ? 176 : 164) + i * (fs + 1)} textAnchor="middle" fontFamily="Anton" fontSize={fs} fill="#2A1710">{l}</text>)}
      <text x="100" y={ls.length === 1 ? 200 : 168 + fs * 2 + 5} textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="16" fill="#C0392B">{p.hi}</text>
      <rect x="44" y="210" width="112" height="14" fill={p.fill} />
      <text x="100" y="220" textAnchor="middle" fontFamily="DM Sans" fontWeight="700" fontSize="7.5" fill="#FBF4E8" letterSpacing=".8">{p.weight.toUpperCase()} · GROUND FRESH</text>
      <path d="M40 74 L44 232" stroke="#fff" strokeWidth="3" opacity=".5" strokeLinecap="round" />
    </svg>
  )
}
