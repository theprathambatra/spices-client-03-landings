import { useEffect, useMemo, useRef, useState } from 'react'
import { origins } from './data'
import { Lines, Rise, useIn } from './ui/Lines'

// crude outline of India (lon, lat), clockwise from the north-west
const INDIA = [
  [74.4, 37.0], [75.9, 36.6], [77.8, 35.5], [79.0, 34.4], [78.7, 32.6], [79.4, 31.2], [80.2, 30.3], [81.0, 30.2], [80.1, 28.8],
  [81.5, 28.3], [84.0, 27.4], [86.0, 26.6], [88.1, 26.4], [88.1, 27.9], [88.9, 27.3], [89.0, 26.6], [90.7, 26.8], [92.1, 26.9],
  [92.0, 27.9], [93.5, 28.6], [95.2, 29.3], [96.7, 28.4], [97.2, 27.7], [96.1, 27.2], [95.0, 26.1], [94.5, 25.0], [94.2, 23.9],
  [93.4, 22.9], [93.1, 22.2], [92.6, 22.9], [92.3, 23.7], [91.6, 24.0], [91.9, 24.6], [91.1, 25.2], [90.1, 25.2], [89.8, 25.9],
  [89.0, 26.0], [88.4, 25.3], [88.2, 24.5], [88.9, 23.6], [89.0, 22.4], [88.6, 21.6], [87.2, 21.5], [86.9, 20.6], [86.2, 19.9],
  [85.0, 19.3], [84.1, 18.3], [83.0, 17.2], [82.3, 16.6], [81.3, 15.9], [80.3, 15.0], [80.2, 13.3], [79.9, 11.9], [79.8, 10.4],
  [79.1, 10.3], [78.3, 9.1], [77.5, 8.1], [76.8, 8.5], [76.3, 9.6], [75.9, 11.2], [75.0, 12.6], [74.6, 13.9], [74.0, 15.1],
  [73.4, 16.9], [72.9, 18.7], [72.8, 20.3], [72.7, 21.5], [72.3, 21.1], [71.4, 20.9], [70.4, 20.9], [69.1, 22.2], [70.2, 22.9],
  [68.8, 23.3], [68.2, 23.7], [69.5, 24.3], [70.5, 24.4], [71.1, 24.4], [70.0, 25.6], [70.1, 26.5], [70.9, 27.8], [72.6, 28.9],
  [73.9, 29.9], [74.5, 31.0], [74.6, 32.3], [74.0, 33.2], [74.6, 34.4], [73.7, 35.3], [74.4, 37.0],
]
const W = 640, H = 690, LON0 = 67.2, LAT0 = 38.2, K = 19.4
const px = (lon, lat) => [(lon - LON0) * K * 0.96, (LAT0 - lat) * K]

function inside(lon, lat) {
  let c = false
  for (let i = 0, j = INDIA.length - 1; i < INDIA.length; j = i++) {
    const [xi, yi] = INDIA[i], [xj, yj] = INDIA[j]
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

export default function OriginMap() {
  const [active, setActive] = useState('pampore')
  const wrap = useRef(null)
  useIn(wrap, { threshold: 0.2 })
  const dots = useMemo(() => {
    const out = []
    const step = 0.6
    let row = 0
    for (let lat = 37.4; lat > 6.4; lat -= step * 0.9, row++) {
      for (let lon = 68 + (row % 2) * (step / 2); lon < 98; lon += step) {
        if (inside(lon, lat)) {
          const [x, y] = px(lon, lat)
          out.push([x, y, Math.random()])
        }
      }
    }
    return out
  }, [])
  const o = origins.find((x) => x.id === active)

  return (
    <section className="origins" id="origins" ref={wrap}>
      <div className="origins__txt">
        <p className="label">Where it begins</p>
        <Lines as="h2" className="h2" lines={['Five pins.', <>One <em>obsession.</em></>]} />
        <Rise as="p" className="lede">
          We buy where the spice is best, not where it is convenient. Each pin is a family we have paid, by name, for years.
        </Rise>
        <ul className="origins__list">
          {origins.map((p, i) => (
            <li key={p.id}>
              <button className={active === p.id ? 'is-on' : ''} onClick={() => setActive(p.id)} onMouseEnter={() => setActive(p.id)}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <b>{p.place}</b>
                <small>{p.state}</small>
              </button>
            </li>
          ))}
        </ul>
        <div className="origins__card" key={o.id}>
          <p className="label">{o.spice}</p>
          <p>{o.note}</p>
          <p className="label dim">Elevation {o.elev}</p>
        </div>
      </div>
      <div className="map" aria-hidden="false">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Map of India with five spice origins marked in gold">
          <g className="map__dots">
            {dots.map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={2.1} opacity={0.2 + r * 0.32} />
            ))}
          </g>
          {origins.map((p) => {
            const [x, y] = px(p.lon, p.lat)
            const on = p.id === active
            return (
              <g key={p.id} className={`pin ${on ? 'is-on' : ''}`} transform={`translate(${x} ${y})`} onClick={() => setActive(p.id)} onMouseEnter={() => setActive(p.id)} tabIndex={0} onFocus={() => setActive(p.id)}>
                <circle className="pin__ring" r="7" />
                <circle className="pin__ring pin__ring--2" r="7" />
                <circle className="pin__core" r="4.2" />
                <circle r="20" fill="transparent" />
                <text x={p.id === 'lakadong' || p.id === 'kodagu' ? -14 : 14} y="4" textAnchor={p.id === 'lakadong' || p.id === 'kodagu' ? 'end' : 'start'}>{p.place}</text>
              </g>
            )
          })}
        </svg>
      </div>
    </section>
  )
}
