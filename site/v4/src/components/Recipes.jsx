import { states } from '../data'
import { SectionHead } from './Ornaments'

export default function Recipes() {
  const row = (arr, rev) => (
    <div className={'marq' + (rev ? ' rev' : '')}>
      <div className="marq-track">
        {[0, 1].map((k) => <div className="marq-set" key={k} aria-hidden={k === 1}>{arr.map(([s, d], i) => (
          <a href="#shop" key={s + k} className="rcard" style={{ '--rc': ['#D81B76', '#0D8E9B', '#F7A614', '#0E7A57', '#D9381E'][i % 5] }}><small>{s}</small><b>{d}</b></a>
        ))}</div>)}
      </div>
    </div>
  )
  return (
    <section className="section recipes" id="recipes">
      <SectionHead eyebrow="Recipes" title="Recipes from 28 states" hi="अट्ठाईस राज्य, अट्ठाईस स्वाद">One country, twenty-eight ways to say “pass the masala”. Tap a dish to shop its spices.</SectionHead>
      {row(states.slice(0, 14))}
      {row(states.slice(14), true)}
    </section>
  )
}
