import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { byId, getSizes, defaultSize, FREE_SHIP, SHIP_FEE, COUPONS, catalogue } from './brand'

const Ctx = createContext(null)
export const useCart = () => useContext(Ctx)

const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* private mode */ } }
export const lineKey = (id, label) => `${id}|${label}`

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => load('kesari-v2-cart', {})) // key -> qty
  const [wish, setWish] = useState(() => load('kesari-v2-wish', []))
  const [coupon, setCoupon] = useState(() => load('kesari-v2-coupon', null))
  const [drawer, setDrawer] = useState(false)
  const [search, setSearch] = useState(false)
  const [menu, setMenu] = useState(false)
  const [qv, setQv] = useState(null)
  const [checkout, setCheckout] = useState(null) // null | 'form' | 'done'
  const [toast, setToast] = useState(null)
  const timer = useRef()

  useEffect(() => save('kesari-v2-cart', items), [items])
  useEffect(() => save('kesari-v2-wish', wish), [wish])
  useEffect(() => save('kesari-v2-coupon', coupon), [coupon])

  const flash = useCallback((msg) => { setToast({ msg, k: Math.random() }); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 2400) }, [])

  const add = useCallback((id, label, q = 1, open = false) => {
    const p = byId[id]; if (!p) return
    const l = label || defaultSize(p).label
    const k = lineKey(id, l)
    setItems((s) => ({ ...s, [k]: (s[k] || 0) + q }))
    flash(`Added ${p.name} · ${l}`)
    if (open) setDrawer(true)
  }, [flash])
  const setQty = useCallback((k, q) => setItems((s) => { const n = { ...s }; if (q <= 0) delete n[k]; else n[k] = q; return n }), [])
  const toggleWish = useCallback((id) => setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])), [])
  const applyCoupon = useCallback((code) => {
    const c = code.trim().toUpperCase()
    if (COUPONS[c]) { setCoupon(c); return { ok: true, msg: COUPONS[c].label + ' applied' } }
    return { ok: false, msg: 'That code is not valid. Try FIRST10.' }
  }, [])

  const overlay = drawer || search || menu || !!qv || !!checkout
  const closeAll = useCallback(() => { setDrawer(false); setSearch(false); setMenu(false); setQv(null); setCheckout((c) => (c === 'done' ? null : c === 'form' ? null : c)) }, [])
  useEffect(() => {
    if (!overlay) return
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    window.__lenis?.stop()
    const onKey = (e) => { if (e.key === 'Escape') closeAll() }
    window.addEventListener('keydown', onKey)
    return () => { root.style.overflow = prev; window.__lenis?.start(); window.removeEventListener('keydown', onKey) }
  }, [overlay, closeAll])

  const value = useMemo(() => {
    const lines = Object.entries(items).map(([k, q]) => {
      const [id, label] = k.split('|')
      const p = byId[id]
      if (!p) return null
      const size = getSizes(p).find((s) => s.label === label) || defaultSize(p)
      return { k, p, size, q }
    }).filter(Boolean)
    const count = lines.reduce((a, l) => a + l.q, 0)
    const subtotal = lines.reduce((a, l) => a + l.q * l.size.price, 0)
    const mrpTotal = lines.reduce((a, l) => a + l.q * l.size.mrp, 0)
    const cp = coupon && COUPONS[coupon]
    const discount = cp ? Math.min(subtotal, cp.pct ? Math.round(subtotal * cp.pct / 100) : cp.flat) : 0
    const after = subtotal - discount
    const shipping = count === 0 || after >= FREE_SHIP ? 0 : SHIP_FEE
    const total = after + shipping
    const qtyOf = (id, label) => items[lineKey(id, label)] || 0
    return { items, lines, count, subtotal, mrpTotal, discount, after, shipping, total, coupon, setCoupon, applyCoupon, add, setQty, wish, toggleWish, qtyOf,
      drawer, setDrawer, search, setSearch, menu, setMenu, qv, setQv, checkout, setCheckout, toast, flash, closeAll,
      clear: () => setItems({}) }
  }, [items, coupon, add, setQty, wish, toggleWish, applyCoupon, drawer, search, menu, qv, checkout, toast, flash, closeAll])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export { catalogue }
