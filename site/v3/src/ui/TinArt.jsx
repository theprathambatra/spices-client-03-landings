// Tiny SVG tin illustration used in the catalogue, cart and previews.
export default function TinArt({ color = '#C9A24B', label = '', seal, className = '' }) {
  const id = 'g' + color.replace('#', '')
  return (
    <svg viewBox="0 0 120 150" className={className} role="img" aria-label={label || 'Kesari tin'}>
      <defs>
        <linearGradient id={id + 'l'} x1="0" x2="1">
          <stop offset="0" stopColor="#8f6a2a" />
          <stop offset="0.3" stopColor="#f0d28a" />
          <stop offset="0.55" stopColor="#c9a24b" />
          <stop offset="1" stopColor="#7a5a22" />
        </linearGradient>
        <linearGradient id={id + 'b'} x1="0" x2="1">
          <stop offset="0" stopColor="#0c0907" />
          <stop offset="0.35" stopColor="#2a211a" />
          <stop offset="0.6" stopColor="#14100c" />
          <stop offset="1" stopColor="#070504" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="141" rx="42" ry="5" fill="#000" opacity="0.5" />
      <path d="M20 40 H100 V132 Q100 140 92 140 H28 Q20 140 20 132 Z" fill={`url(#${id}b)`} stroke="#3a2d1f" strokeWidth="0.8" />
      <rect x="20" y="112" width="80" height="5" fill={color} opacity="0.9" />
      <rect x="44" y="58" width="32" height="1.4" fill="#C9A24B" opacity="0.8" />
      <rect x="36" y="68" width="48" height="3" rx="1.5" fill="#EFE6D4" opacity="0.8" />
      <rect x="46" y="78" width="28" height="2" rx="1" fill="#C9A24B" opacity="0.5" />
      <circle cx="60" cy="97" r="4.5" fill={color} />
      <rect x="15" y="22" width="90" height="22" rx="5" fill={`url(#${id}l)`} />
      <rect x="15" y="22" width="90" height="4" rx="2" fill="#fff" opacity="0.28" />
      <rect x="52" y="14" width="16" height="9" rx="4" fill={`url(#${id}l)`} />
    </svg>
  )
}
