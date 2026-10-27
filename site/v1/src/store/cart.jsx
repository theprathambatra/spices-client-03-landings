import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { products, BUNDLES, bySlug, grams, priceFor, COUPONS, FREE_SHIP, SHIP_FEE } from '../brand.js'

const KEY = 'kesari-store-v1'
const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

function load() {
  try { const r = JSON.parse(localStorage.getItem(KEY)); if (r && Array.isArray(r.items)) return r } catch (e) { /* ignore */ }
  return { items: [], wish: [], coupon: null }
}

function reducer(s, a) {
  switch (a.type) {
    case 'add': {
      const k = a.key
      const ex = s.items.find((i) => i.key === k)
      const items = ex ? s.items.map((i) => (i.key === k ? { ...i, qty: i.qty + (a.qty || 1) } : i)) : [...s.items, { key: k, id: a.id, size: a.size, qty: a.qty || 1 }]
      return { ...s, items }
    }
    case 'qty': {
      const items = s.items.map((i) => (i.key === a.key ? { ...i, qty: i.qty + a.d } : i)).filter((i) => i.qty > 0)
      return { ...s, items }
    }
    case 'remove': return { ...s, items: s.items.filter((i) => i.key !== a.key) }
    case 'wish': return { ...s, wish: s.wish.includes(a.id) ? s.wish.filter((w) => w !== a.id) : [...s.wish, a.id] }
    case 'coupon': return { ...s, coupon: a.code }
    case 'clear': return { ...s, items: [], coupon: null }
    default: return s
  }
}

export function lineOf(i) {
  if (i.id.startsWith('bundle:')) {
    const b = BUNDLES.find((x) => 'bundle:' + x.id === i.id)
    return { key: i.key, kind: 'bundle', name: b.name, sub: b.sub, price: b.price, mrp: b.mrp, color: b.color, qty: i.qty, bundle: b }
  }
  const p = bySlug[i.id]
  const { price, mrp } = priceFor(p, i.size)
  return { key: i.key, kind: 'product', name: p.name, sub: (i.size >= 1000 ? i.size / 1000 + 'kg' : i.size + 'g'), price, mrp, color: p.color, qty: i.qty, p }
}

export function StoreProvider({ children }) {
  const [s, dispatch] = useReducer(reducer, undefined, load)
  const [ui, setUi] = useState({ cart: false, search: false, quick: null, menu: false, checkout: false, cat: 'all', purpose: null, query: '' })
  const [toast, setToast] = useState('')
  const [bump, setBump] = useState(0)
  const tt = useRef()

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (e) { /* ignore */ } }, [s])

  const say = useCallback((m) => { setToast(m); clearTimeout(tt.current); tt.current = setTimeout(() => setToast(''), 2200) }, [])

  const lines = useMemo(() => s.items.map(lineOf), [s.items])
  const count = lines.reduce((a, l) => a + l.qty, 0)
  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0)
  const cp = s.coupon ? COUPONS[s.coupon] : null
  const discount = cp ? (cp.pct ? Math.round(subtotal * cp.pct / 100) : subtotal >= (cp.min || 0) ? cp.flat : 0) : 0
  const after = subtotal - discount
  const shipping = count === 0 ? 0 : after >= FREE_SHIP ? 0 : SHIP_FEE
  const total = after + shipping

  const api = useMemo(() => ({
    s, ui, setUi, toast, say, bump, lines, count, subtotal, discount, shipping, total, coupon: cp, couponCode: s.coupon,
    qtyOf: (id, size) => s.items.find((i) => i.key === `${id}@${size}`)?.qty || 0,
    add: (id, size, qty = 1, { open = true, silent = false } = {}) => {
      dispatch({ type: 'add', key: `${id}@${size}`, id, size, qty })
      setBump((b) => b + 1)
      const name = id.startsWith('bundle:') ? BUNDLES.find((b) => 'bundle:' + b.id === id)?.name : bySlug[id]?.name
      if (!silent) say(`Added ${name}`)
      if (open) setUi((u) => ({ ...u, cart: true }))
    },
    inc: (key, d) => dispatch({ type: 'qty', key, d }),
    remove: (key) => dispatch({ type: 'remove', key }),
    toggleWish: (id) => { dispatch({ type: 'wish', id }); say(s.wish.includes(id) ? 'Removed from wishlist' : 'Saved to wishlist') },
    applyCoupon: (code) => {
      const c = code.trim().toUpperCase()
      if (!COUPONS[c]) return 'That code does not exist. Try FIRST10.'
      if (COUPONS[c].min && subtotal < COUPONS[c].min) return `Needs a basket of ₹${COUPONS[c].min}+`
      dispatch({ type: 'coupon', code: c }); return ''
    },
    removeCoupon: () => dispatch({ type: 'coupon', code: null }),
    clear: () => dispatch({ type: 'clear' }),
    open: (k, v = true) => setUi((u) => ({ ...u, [k]: v })),
  }), [s, ui, toast, bump, lines, count, subtotal, discount, shipping, total, cp, say])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

// Esc to close + body scroll lock
export function useModal(open, onClose) {
  useEffect(() => {
    if (!open) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => { document.documentElement.style.overflow = prev; window.removeEventListener('keydown', k) }
  }, [open, onClose])
}
