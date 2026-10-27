import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { byId, priceFor, FREE_SHIP } from '../data'

const Ctx = createContext(null)
export const useCart = () => useContext(Ctx)
const KEY = 'kesari-lab-v1'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} } }
export const SHIP_FEE = 49
export const COUPONS = { FIRST10: 10, ASSAY10: 10, LABDROP: 15 }

export function CartProvider({ children }) {
  const init = useMemo(load, [])
  const [lines, setLines] = useState(init.lines || {}) // key id|size -> qty
  const [wish, setWish] = useState(init.wish || [])
  const [coupon, setCoupon] = useState(init.coupon || '')
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [quick, setQuick] = useState(null)
  const [checkout, setCheckout] = useState(false)
  const [cmp, setCmp] = useState([])
  const [cmpOpen, setCmpOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ lines, wish, coupon })) } catch { /* private mode */ } }, [lines, wish, coupon])

  const anyOpen = open || searchOpen || !!quick || checkout || cmpOpen
  useEffect(() => {
    document.documentElement.classList.toggle('locked', anyOpen)
    const k = (e) => { if (e.key === 'Escape') { setOpen(false); setSearchOpen(false); setQuick(null); setCheckout(false); setCmpOpen(false) } }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [anyOpen])

  const flash = useCallback((m) => { setToast(m); clearTimeout(flash.t); flash.t = setTimeout(() => setToast(''), 1800) }, [])
  const key = (id, size) => id + '|' + size
  const defSize = (id) => byId[id].wt
  const add = useCallback((id, size, n = 1, openCart = false) => {
    size = size || defSize(id)
    setLines((l) => ({ ...l, [key(id, size)]: (l[key(id, size)] || 0) + n }))
    flash('+ ' + byId[id].name + ' · ' + size)
    if (openCart) setOpen(true)
  }, [flash])
  const setQty = useCallback((id, size, q) => setLines((l) => { const n = { ...l }; q <= 0 ? delete n[key(id, size)] : (n[key(id, size)] = q); return n }), [])
  const qtyOf = (id, size) => lines[key(id, size)] || 0
  const toggleWish = useCallback((id) => setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])), [])
  const toggleCmp = useCallback((id) => setCmp((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? [...c.slice(1), id] : [...c, id])), [])

  const value = useMemo(() => {
    const items = Object.entries(lines).map(([k, q]) => { const [id, size] = k.split('|'); const p = byId[id]; return { k, p, size, q, unit: priceFor(p, size).price } }).filter((l) => l.p)
    const sub = items.reduce((a, l) => a + l.unit * l.q, 0)
    const pct = COUPONS[coupon] || 0
    const discount = Math.round((sub * pct) / 100)
    const after = sub - discount
    const ship = !items.length || after >= FREE_SHIP ? 0 : SHIP_FEE
    return {
      items, sub, pct, discount, ship, total: after + ship, after, count: items.reduce((a, l) => a + l.q, 0),
      add, setQty, qtyOf, wish, toggleWish, coupon, setCoupon, open, setOpen, searchOpen, setSearchOpen, quick, setQuick, checkout, setCheckout,
      cmp, toggleCmp, cmpOpen, openCmp: () => setCmpOpen(true), closeCmp: () => setCmpOpen(false), toast, flash,
      clear: () => { setLines({}); setCoupon('') },
    }
    // eslint-disable-next-line
  }, [lines, wish, coupon, open, searchOpen, quick, checkout, cmp, cmpOpen, toast, add, setQty, toggleWish, toggleCmp, flash])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
