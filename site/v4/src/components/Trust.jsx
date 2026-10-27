const T = [
  ['FSSAI certified', 'Lic. no. 10020021001234', <path key="a" d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z M9 12l2 2 4-4" />],
  ['Lab tested', 'Every single batch', <path key="b" d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />],
  ['No fillers', 'No colour, no preservatives', <path key="c" d="M5 5l14 14M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />],
  ['Cash on delivery', 'Pay when it arrives', <path key="d" d="M3 7h18v10H3z M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />],
  ['7-day easy returns', 'No questions, no sulking', <path key="e" d="M4 12a8 8 0 1 1 3 6.3M4 18v-5h5" />],
  ['Secure payments', 'UPI · Cards · NetBanking', <path key="f" d="M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5z" />],
]
export default function Trust() {
  return (
    <section className="trust" aria-label="Why shop with us">
      <ul>{T.map(([a, b, ic]) => (
        <li key={a}><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{ic}</svg><div><b>{a}</b><span>{b}</span></div></li>
      ))}</ul>
    </section>
  )
}
