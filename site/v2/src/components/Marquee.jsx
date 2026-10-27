export default function Marquee({ items, dur = 48, className = '' }) {
  const row = (k) => (
    <ul className="mq-row" aria-hidden={k > 0 ? 'true' : undefined} key={k}>
      {items.map((t, i) => (
        <li key={i}><span>{t}</span><i>/</i></li>
      ))}
    </ul>
  )
  return (
    <div className={`marquee ${className}`} style={{ '--dur': dur + 's' }}>
      <div className="mq-track">{row(0)}{row(1)}</div>
    </div>
  )
}
