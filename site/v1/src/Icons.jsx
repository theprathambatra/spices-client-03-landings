import { useId } from 'react'
import { BRAND, inkOn } from './brand.js'

const INK = '#1A1208'
const S = { stroke: INK, strokeWidth: 4, strokeLinejoin: 'round', strokeLinecap: 'round' }

export function SpiceGlyph({ k, size = 100, className = '' }) {
  const p = { viewBox: '0 0 100 100', width: size, height: size, className, 'aria-hidden': true, focusable: false }
  switch (k) {
    case 'chilli':
      return (<svg {...p}><path d="M30 24c10-6 26-4 34 6 8 10 6 30-6 46-8 10-24 18-36 16 14-8 22-18 22-34 0-10-8-14-14-34z" fill="#E03A2F" {...S} /><path d="M30 24c-2-8 2-12 6-14 2 6 6 8 12 10-2 6-10 8-18 4z" fill="#2FA36B" {...S} /><path d="M52 34c4 6 4 16 0 24" fill="none" stroke="#FFF3DC" strokeWidth="4" strokeLinecap="round" opacity=".7" /></svg>)
    case 'turmeric':
      return (<svg {...p}><path d="M22 60c-4-14 6-30 22-34 18-4 36 6 34 22-2 14-18 24-36 26-10 1-18-4-20-14z" fill="#FFB000" {...S} /><path d="M40 34c4 6 4 20 0 34M56 30c4 8 4 24-2 40" fill="none" stroke={INK} strokeWidth="3" opacity=".5" strokeLinecap="round" /></svg>)
    case 'coriander':
      return (<svg {...p}><circle cx="50" cy="52" r="26" fill="#C8E27A" {...S} /><path d="M50 26v52M30 38c10 6 30 6 40 0M30 66c10-6 30-6 40 0" fill="none" stroke={INK} strokeWidth="3" /><path d="M50 14c-6 4-6 10 0 12 6-2 6-8 0-12z" fill="#2FA36B" {...S} /></svg>)
    case 'cumin':
      return (<svg {...p}><g fill="#C98A2B" {...S}><path d="M14 66c6-26 22-40 40-44-2 22-16 42-40 44z" /><path d="M46 80c4-20 20-34 38-36-2 18-14 34-38 36z" /></g><path d="M24 58c8-10 18-18 24-24M56 70c8-8 16-14 22-18" fill="none" stroke="#FFF3DC" strokeWidth="3" opacity=".7" strokeLinecap="round" /></svg>)
    case 'mango':
      return (<svg {...p}><path d="M24 40c8-14 34-18 48-6 14 14 6 40-14 48-18 6-38-8-34-42z" fill="#FFC21A" {...S} /><path d="M52 24c2-8 8-12 16-10-2 8-8 12-16 10z" fill="#2FA36B" {...S} /></svg>)
    case 'hing':
      return (<svg {...p}><path d="M26 40h48l6 40H20z" fill="#FF8FB1" {...S} /><rect x="30" y="22" width="40" height="18" rx="5" fill="#FFF3DC" {...S} /><circle cx="50" cy="62" r="11" fill="#FFF3DC" {...S} /></svg>)
    case 'pepper':
      return (<svg {...p}><g fill="#3a2218" {...S}><circle cx="36" cy="40" r="17" /><circle cx="64" cy="52" r="19" /><circle cx="42" cy="70" r="14" /></g><g fill="none" stroke="#FFF3DC" strokeWidth="3" strokeLinecap="round" opacity=".55"><path d="M28 36c2-4 6-6 10-6M56 46c2-3 6-5 10-5" /></g></svg>)
    case 'cardamom':
      return (<svg {...p}><path d="M50 8c20 14 24 46 0 84C26 54 30 22 50 8z" fill="#7FC23F" {...S} /><path d="M50 12v76M40 28c-6 18-6 32 0 48M60 28c6 18 6 32 0 48" fill="none" stroke={INK} strokeWidth="3" opacity=".45" /></svg>)
    case 'clove':
      return (<svg {...p}><path d="M50 40c-4 20-4 34 0 52 4-18 4-32 0-52z" fill="#7A3B1E" {...S} /><circle cx="50" cy="28" r="14" fill="#A33A1E" {...S} /><path d="M38 24l-8-6M62 24l8-6M50 14V6" stroke={INK} strokeWidth="4" strokeLinecap="round" /></svg>)
    case 'cinnamon':
      return (<svg {...p}><g {...S}><path d="M20 70L70 20l12 12L32 82z" fill="#D9742B" /><path d="M12 62L62 12l10 10L22 72z" fill="#B85A1E" /></g><ellipse cx="22" cy="72" rx="8" ry="5" transform="rotate(-45 22 72)" fill="#FFF3DC" stroke={INK} strokeWidth="3" /></svg>)
    case 'anise':
      return (<svg {...p}><path d="M50 8l9 24 24-9-9 24 24 9-24 9 9 24-24-9-9 24-9-24-24 9 9-24-24-9 24-9-9-24 24 9z" fill="#9A4F22" {...S} /><circle cx="50" cy="50" r="10" fill="#4A230F" {...S} /></svg>)
    case 'seeds':
      return (<svg {...p}><g fill="#E8B923" {...S}><circle cx="34" cy="38" r="12" /><circle cx="62" cy="34" r="10" /><circle cx="52" cy="62" r="13" /><circle cx="26" cy="68" r="9" /><circle cx="76" cy="62" r="8" /></g></svg>)
    case 'bowl':
      return (<svg {...p}><path d="M10 52h80c0 22-16 36-40 36S10 74 10 52z" fill="#E8A21A" {...S} /><path d="M18 52c4-18 20-26 32-26s28 8 32 26z" fill="#E03A2F" {...S} /><circle cx="40" cy="42" r="4" fill="#FFC21A" /><circle cx="58" cy="38" r="5" fill="#FFC21A" /></svg>)
    case 'chai':
      return (<svg {...p}><path d="M18 40h52v18c0 16-10 26-26 26S18 74 18 58z" fill="#FFF3DC" {...S} /><path d="M70 46h8c8 0 8 16 0 16h-8" fill="none" {...S} /><path d="M18 40h52v10H18z" fill="#B8651B" stroke={INK} strokeWidth="4" /><path d="M32 30c-4-6 4-8 0-14M48 30c-4-6 4-8 0-14" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" /></svg>)
    case 'salt':
      return (<svg {...p}><path d="M30 30h40l4 52H26z" fill="#9BE8E0" {...S} /><rect x="32" y="14" width="36" height="16" rx="6" fill="#FFF3DC" {...S} /><circle cx="42" cy="20" r="2" fill={INK} /><circle cx="50" cy="20" r="2" fill={INK} /><circle cx="58" cy="20" r="2" fill={INK} /></svg>)
    case 'saffron':
      return (<svg {...p}><path d="M50 90c-8-30-8-50-6-70M50 90c0-28 8-48 16-62M50 90c-14-24-24-40-34-48" fill="none" stroke="#E8301A" strokeWidth="7" strokeLinecap="round" /><circle cx="44" cy="18" r="6" fill="#FFC21A" {...S} /><circle cx="66" cy="26" r="6" fill="#FFC21A" {...S} /><circle cx="16" cy="40" r="6" fill="#FFC21A" {...S} /></svg>)
    case 'flame':
      return (<svg {...p}><path d="M50 8c6 18 26 28 26 52 0 18-12 30-26 30S24 78 24 60c0-12 8-18 12-28 4 8 6 10 10 12 0-14-2-24 4-36z" fill="#FF5A1F" {...S} /><path d="M50 52c4 10 12 14 12 26 0 8-6 12-12 12s-12-4-12-12c0-8 8-12 12-26z" fill="#FFC21A" {...S} /></svg>)
    case 'gift':
      return (<svg {...p}><rect x="14" y="38" width="72" height="50" rx="4" fill="#E03A2F" {...S} /><rect x="10" y="26" width="80" height="16" rx="4" fill="#FFC21A" {...S} /><path d="M50 26v62" stroke={INK} strokeWidth="4" /><path d="M50 26c-6-18-24-14-20-6 2 4 12 6 20 6zM50 26c6-18 24-14 20-6-2 4-12 6-20 6z" fill="#FFC21A" {...S} /></svg>)
    default:
      return (<svg {...p}><circle cx="50" cy="50" r="30" fill="#FFC21A" {...S} /></svg>)
  }
}

export function Sparkle({ size = 22, color = 'currentColor' }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12C7 11 11 7 12 0z" fill={color} /></svg>)
}
export function Star({ size = 16, fill = '#FFC21A', empty = false }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3 7 7.5.6-5.7 4.9 1.8 7.4L12 18l-6.6 3.9 1.8-7.4L1.5 9.6 9 9z" fill={empty ? 'rgba(26,18,8,.15)' : fill} stroke="#1A1208" strokeWidth="1.6" strokeLinejoin="round" /></svg>)
}
export function CartIcon({ size = 24 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 01-2 1.8H8.2a2 2 0 01-2-1.8L5 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>)
}
export function Arrow({ size = 20 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" /></svg>)
}
export function DoodleArrow({ className = '', color = '#FFF3DC' }) {
  return (
    <svg className={className} viewBox="0 0 160 110" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 11" aria-hidden="true">
      <path d="M6 14C60 -4 120 12 126 70" />
      <path d="M104 62l22 30 26-26" strokeDasharray="none" />
    </svg>
  )
}

// 2D flat pouch for cards (SVG)
export function PouchSVG({ sku, className = '' }) {
  const instanceId = useId()
  const ink = inkOn(sku.color)
  const words = sku.name.toUpperCase().split(' ')
  const lines = words.length > 2 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : words
  const fs = Math.max(...lines.map((l) => l.length)) > 9 ? 17 : 21
  const id = 'r' + instanceId.replace(/:/g, '') + sku.id
  return (
    <svg className={className} viewBox="0 0 200 270" aria-hidden="true">
      <ellipse cx="100" cy="258" rx="74" ry="9" fill="#1A1208" opacity=".22" />
      <path d="M24 30c0-6 4-10 10-10h132c6 0 10 4 10 10l10 214c0 8-6 14-14 14H28c-8 0-14-6-14-14z" fill={sku.color} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <clipPath id={id}><path d="M24 30c0-6 4-10 10-10h132c6 0 10 4 10 10l10 214c0 8-6 14-14 14H28c-8 0-14-6-14-14z" /></clipPath>
      <g clipPath={`url(#${id})`}>
        <g opacity=".14" fill="#fff">{Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M100 110L${100 + 260 * Math.cos((i / 12) * 6.283)} ${110 + 260 * Math.sin((i / 12) * 6.283)}L${100 + 260 * Math.cos(((i + 0.5) / 12) * 6.283)} ${110 + 260 * Math.sin(((i + 0.5) / 12) * 6.283)}z`} />)}</g>
        <rect x="0" y="14" width="200" height="28" fill="#000" opacity=".12" />
        {Array.from({ length: 20 }).map((_, i) => <rect key={i} x={6 + i * 10} y="14" width="4" height="28" fill="#000" opacity=".12" />)}
        <path d="M0 250c20-8 30 6 50 0s30-8 50 0 30 6 50 0 30-6 50 0v20H0z" fill="#000" opacity=".16" />
      </g>
      <path d="M24 30c0-6 4-10 10-10h132c6 0 10 4 10 10" fill="none" stroke={INK} strokeWidth="5" />
      <path d="M17 44h166" stroke={INK} strokeWidth="3" strokeDasharray="1 7" strokeLinecap="round" opacity=".6" />
      <circle cx="100" cy="90" r="34" fill="#FFF3DC" stroke={INK} strokeWidth="5" />
      <g transform="translate(75 63) scale(.5)"><SpiceGlyph k={sku.icon} size={100} /></g>
      <text x="100" y="152" textAnchor="middle" fontFamily='"Bowlby One", Impact, sans-serif' fontSize="12" fill={ink} opacity=".85">{BRAND.toUpperCase()}</text>
      {lines.map((l, i) => (
        <text key={i} x="100" y={(lines.length > 1 ? 176 : 184) + i * (fs + 3)} textAnchor="middle" fontFamily='"Bowlby One", Impact, sans-serif' fontSize={fs} fill={ink}>{l}</text>
      ))}
      <rect x="68" y="220" width="64" height="22" rx="11" fill="#FFF3DC" stroke={INK} strokeWidth="3.5" />
      <text x="100" y="236" textAnchor="middle" fontFamily='"Baloo 2", sans-serif' fontWeight="700" fontSize="15" fill={INK}>{sku.weight}</text>
    </svg>
  )
}
