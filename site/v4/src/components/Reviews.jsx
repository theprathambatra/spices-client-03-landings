import { reviews } from '../data'
import { SectionHead, Stars } from './Ornaments'

const DIST = [[5, 82], [4, 13], [3, 3], [2, 1], [1, 1]]
export default function Reviews() {
  return (
    <section className="section reviews" id="reviews">
      <SectionHead eyebrow="Kind words" title="Invitations to the table" hi="आपका स्वागत है">Real reviews from verified buyers, printed as wedding cards.</SectionHead>
      <div className="rev-sum">
        <div className="rev-score"><b>4.8</b><Stars value={5} size={20} /><span>from 14,200+ verified reviews</span></div>
        <ul className="rev-dist" aria-label="Star distribution">
          {DIST.map(([s, p]) => <li key={s}><span>{s}★</span><div><i style={{ width: p + '%' }} /></div><em>{p}%</em></li>)}
        </ul>
      </div>
      <div className="rev-row">
        {reviews.map((r, i) => (
          <article key={r.name} className="invite" style={{ '--tilt': ((i % 3) - 1) * 0.6 + 'deg' }}>
            <div className="invite-in">
              <p className="inv-top" lang="hi">॥ श्री गणेशाय नमः ॥</p>
              <p className="inv-pre">With great delight, we share</p>
              <Stars value={r.stars} size={18} />
              <blockquote>“{r.line}”</blockquote>
              <p className="inv-who"><b>{r.name}</b>, {r.city}</p>
              <p className="inv-prod"><span className="vb">✔ Verified buyer</span> · {r.product}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
