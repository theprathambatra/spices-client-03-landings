import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { products } from './data'
import { petalBurst } from './petals'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)
export const byId = Object.fromEntries(products.map((p) => [p.id, p]))
export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

export const FREE_SHIP = 499
export const SHIP_FEE = 49
export const COUPONS = {
  FIRST10: { pct: 10, label: '10% off your first order' },
  FESTIVE15: { pct: 15, min: 999, label: '15% off orders above ₹999' },
}

export function sizesFor(p) {
  const g = parseFloat(p.weight)
  if (g <= 1) return [{ label: '1g', mult: 1 }, { label: '2g', mult: 1.9 }, { label: '5g', mult: 4.4 }]
  const r = (x) => Math.round(x / 5) * 5
  return [{ label: r(g / 2) + 'g', mult: 0.55 }, { label: g + 'g', mult: 1 }, { label: r(g * 2.5) + 'g', mult: 2.2 }]
}
export const priceFor = (p, size) => {
  const s = sizesFor(p).find((x) => x.label === size) || sizesFor(p)[1] || sizesFor(p)[0]
  return { price: Math.round(p.price * s.mult), mrp: Math.round(p.mrp * s.mult) }
}
export const badgeFor = (p, i) => (p.best ? 'Bestseller' : p.cat === 'rare' ? 'Rare harvest' : p.reviews < 260 ? 'New' : i % 9 === 4 ? 'Low stock' : null)

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export function StoreProvider({ children }) {
  const [lines, setLines] = useState(() => load('kesari-v4-cart', {}))
  const [wish, setWish] = useState(() => load('kesari-v4-wish', []))
  const [coupon, setCoupon] = useState(() => load('kesari-v4-coupon', null))
  const [drawer, setDrawer] = useState(null) // 'cart' | 'menu' | 'search' | 'checkout'
  const [quick, setQuick] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => save('kesari-v4-cart', lines), [lines])
  useEffect(() => save('kesari-v4-wish', wish), [wish])
  useEffect(() => save('kesari-v4-coupon', coupon), [coupon])
  useEffect(() => {
    const lock = !!(drawer || quick)
    document.documentElement.classList.toggle('locked', lock)
    window.__lenis?.[lock ? 'stop' : 'start']?.()
    const esc = (e) => { if (e.key === 'Escape') { setQuick(null); setDrawer(null) } }
    addEventListener('keydown', esc)
    return () => removeEventListener('keydown', esc)
  }, [drawer, quick])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t) }, [toast])

  const burst = (ev) => {
    const t = ev?.currentTarget || ev?.target
    if (t?.getBoundingClientRect) { const r = t.getBoundingClientRect(); petalBurst(r.left + r.width / 2, r.top + r.height / 2) }
    else petalBurst(innerWidth - 80, 60)
  }
  // item: {key,id,name,size,price,mrp,sub,color,kind}
  const add = useCallback((item, qty = 1, ev, open = false) => {
    setLines((l) => ({ ...l, [item.key]: { ...item, qty: (l[item.key]?.qty || 0) + qty } }))
    burst(ev)
    if (open) setDrawer('cart')
    else setToast(`${item.name} added to cart`)
  }, [])
  const setQty = useCallback((key, q) => setLines((l) => { const n = { ...l }; if (q <= 0) delete n[key]; else n[key] = { ...n[key], qty: q }; return n }), [])
  const toggleWish = useCallback((id) => setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])), [])

  const value = useMemo(() => {
    const list = Object.values(lines)
    const subtotal = list.reduce((a, b) => a + b.qty * b.price, 0)
    const mrpTotal = list.reduce((a, b) => a + b.qty * (b.mrp || b.price), 0)
    const c = coupon && COUPONS[coupon]
    const couponOk = c && (!c.min || subtotal >= c.min)
    const discount = couponOk ? Math.round((subtotal * c.pct) / 100) : 0
    const after = subtotal - discount
    const shipping = list.length === 0 || after >= FREE_SHIP ? 0 : SHIP_FEE
    return {
      list, lines, add, setQty, count: list.reduce((a, b) => a + b.qty, 0), subtotal, mrpTotal, discount, shipping,
      total: after + shipping, coupon, couponOk, couponInfo: c,
      applyCoupon: (code) => { const k = code.trim().toUpperCase(); if (COUPONS[k]) { setCoupon(k); return true } return false },
      clearCoupon: () => setCoupon(null),
      clearCart: () => setLines({}),
      wish, toggleWish, drawer, setDrawer, quick, setQuick, toast, setToast,
    }
  }, [lines, wish, coupon, drawer, quick, toast, add, setQty, toggleWish])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const productKey = (p, size) => `${p.id}|${size}`
export function productItem(p, size) {
  const sz = size || sizesFor(p).find((s) => s.mult === 1)?.label || p.weight
  const { price, mrp } = priceFor(p, sz)
  return { key: productKey(p, sz), id: p.id, name: p.name, size: sz, price, mrp, color: p.color, kind: 'product' }
}
export function bundleItem(b) {
  return { key: 'bundle|' + b.id, id: b.id, name: b.name, size: b.sub || 'Gift box', price: b.price, mrp: b.mrp, color: b.color, kind: 'bundle' }
}
