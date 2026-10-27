import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { FREE_SHIP, SHIP_FEE, products } from './data'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)
export const useCart = useStore
export const rupee = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

// size chips: [label, price multiplier]
export function sizesFor(p) {
  if (p.weight === '1g') return [['1g', 1], ['2g', 1.9], ['5g', 4.5]]
  const m = p.weight.match(/^(\d+)(g)$/)
  const b = +m[1]
  const r = (x) => Math.max(5, Math.round(x / 5) * 5)
  return [[`${r(b * 0.5)}g`, 0.55], [p.weight, 1], [`${r(b * 2.5)}g`, 2.3]]
}
export const priceFor = (p, size) => {
  const s = sizesFor(p).find((x) => x[0] === size) || [0, 1]
  return { price: Math.round(p.price * s[1]), mrp: Math.round(p.mrp * s[1]) }
}
export const off = (p) => Math.round((1 - p.price / p.mrp) * 100)

// Ignore stored values of the wrong shape (all variations share the localhost origin)
const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v != null && typeof v === typeof d && Array.isArray(v) === Array.isArray(d) ? v : d } catch { return d } }
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export function StoreProvider({ children }) {
  const [lines, setLines] = useState(() => read('kesari-v3-cart', [])) // {key,id,size,qty,name,price,mrp,color}
  const [wish, setWish] = useState(() => read('kesari-v3-wish', []))
  const [coupon, setCoupon] = useState(() => read('kesari-v3-coupon', ''))
  const [panel, setPanel] = useState(null) // 'cart' | 'search' | 'menu' | 'checkout' | null
  const [quick, setQuick] = useState(null) // product id
  const [toast, setToast] = useState('')
  useEffect(() => write('kesari-v3-cart', lines), [lines])
  useEffect(() => write('kesari-v3-wish', wish), [wish])
  useEffect(() => write('kesari-v3-coupon', coupon), [coupon])

  const say = useCallback((m) => { setToast(m); clearTimeout(say.t); say.t = setTimeout(() => setToast(''), 2600) }, [])

  const setLine = useCallback((p, size, qty, extra = {}) => {
    const key = p.id + '|' + size
    const { price, mrp } = priceFor(p, size)
    setLines((ls) => {
      const rest = ls.filter((l) => l.key !== key)
      if (qty <= 0) return rest
      const prev = ls.find((l) => l.key === key)
      const nl = { key, id: p.id, size, qty, name: p.name, price, mrp, color: p.color, ...extra }
      return prev ? ls.map((l) => (l.key === key ? nl : l)) : [...ls, nl]
    })
  }, [])
  const qtyOf = useCallback((id, size) => lines.find((l) => l.key === id + '|' + size)?.qty || 0, [lines])
  const addLine = useCallback((p, size, n = 1, open = true) => {
    setLine(p, size, qtyOf(p.id, size) + n)
    if (open) setPanel('cart')
  }, [setLine, qtyOf])
  const addRaw = useCallback((l, open = true) => {
    setLines((ls) => {
      const prev = ls.find((x) => x.key === l.key)
      return prev ? ls.map((x) => (x.key === l.key ? { ...x, qty: x.qty + (l.qty || 1) } : x)) : [...ls, { qty: 1, ...l }]
    })
    if (open) setPanel('cart')
  }, [])
  const setQtyKey = useCallback((key, qty) => setLines((ls) => (qty <= 0 ? ls.filter((l) => l.key !== key) : ls.map((l) => (l.key === key ? { ...l, qty } : l)))), [])
  const toggleWish = useCallback((id) => setWish((w) => { const on = w.includes(id); say(on ? 'Removed from wishlist' : 'Saved to your wishlist'); return on ? w.filter((x) => x !== id) : [...w, id] }), [say])

  const value = useMemo(() => {
    const count = lines.reduce((a, b) => a + b.qty, 0)
    const subtotal = lines.reduce((a, b) => a + b.qty * b.price, 0)
    const discount = coupon === 'FIRST10' ? Math.round(subtotal * 0.1) : 0
    const after = subtotal - discount
    const shipping = count === 0 || after >= FREE_SHIP ? 0 : SHIP_FEE
    return {
      lines, count, subtotal, discount, shipping, total: after + shipping, toFree: Math.max(0, FREE_SHIP - after), freePct: Math.min(100, (after / FREE_SHIP) * 100),
      coupon, setCoupon, wish, toggleWish, panel, setPanel, quick, setQuick, toast, say,
      setLine, qtyOf, addLine, addRaw, setQtyKey, clear: () => { setLines([]); setCoupon('') },
    }
  }, [lines, coupon, wish, panel, quick, toast, say, setLine, qtyOf, addLine, addRaw, setQtyKey, toggleWish])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export { products }
