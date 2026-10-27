export default function Stamp({ top = '100%', mid = 'fresh', ring = 'GROUND FRESH · SMALL BATCH · ', className = '' }) {
  return (
    <div className={`stamp ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="stamp-ring">
        <defs><path id="sp" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" /></defs>
        <text fontSize="9" fill="#FBF4E8" fontFamily="DM Sans" fontWeight="700"><textPath href="#sp" textLength="288" lengthAdjust="spacing">{ring}</textPath></text>
      </svg>
      <div className="stamp-core"><b>{top}</b><em>{mid}</em></div>
    </div>
  )
}
