import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { products, priceFor, rupee, sizesOf } from './brand.js'
import { magicProducts } from './magicProducts.js'
import { Arrow, CartIcon, PouchSVG, Sparkle } from './Icons.jsx'
import { useStore, useModal } from './store/cart.jsx'
import { Boundary, supportsWebGL } from './util.jsx'
import './magic-store.css'

const StoreScene = lazy(() => import('./three/StoreScene.jsx'))
const shelves = [
  { id: 'seeds', label: 'Seeds & dry fruits', short: 'Seeds', items: magicProducts.filter((p) => p.section === 'seeds'), color: '#FFC21A' },
  { id: 'powdered', label: 'Powdered spices', short: 'Powdered', items: products.filter((p) => p.cat === 'ground'), color: '#F7BFD0' },
  { id: 'whole', label: 'Whole spices', short: 'Whole', items: products.filter((p) => p.cat === 'whole'), color: '#9BE8E0' },
  { id: 'seasoning', label: 'Seasoning & herbs', short: 'Seasoning', items: products.filter((p) => !['ground', 'whole'].includes(p.cat)), color: '#F2A68E' },
  { id: 'makhana', label: 'Makhana', short: 'Makhana', items: magicProducts.filter((p) => p.section === 'makhana'), color: '#E8C479' },
]
const allItems = shelves.flatMap((s) => s.items)
const byId = Object.fromEntries(allItems.map((p) => [p.id, p]))
const sizes = (p) => p.sizes || sizesOf(p)

function FloorPlan({ onShelf, onCashier, onExit }) {
  return <div className="magic-floorplan">
    <div className="magic-map-grid">
      <button className="magic-map-zone seeds" onClick={() => onShelf('seeds')}>
        <span className="magic-map-icon">✦</span><strong>Seeds & dry fruits</strong><small>22 pouches across four shelves</small>
      </button>
      <div className="magic-map-middle"><div className="magic-map-table" /><div className="magic-map-table" /><span>THE WALKWAY</span></div>
      <button className="magic-map-zone spices" onClick={() => onShelf('powdered')}>
        <span className="magic-map-icon">✳</span><strong>Spices</strong><small>Powdered · Whole · Seasoning & herbs</small>
      </button>
      <button className="magic-map-zone makhana" onClick={() => onShelf('makhana')}><strong>Makhana</strong><small>100g & 200g</small></button>
      <button className="magic-map-zone cashier" onClick={onCashier}><strong>Meet the cashier</strong><small>Add your finds to the dabba</small></button>
    </div>
    <p>The 3D walkaround is unavailable on this device. Every shelf and the cashier are still open here.</p>
    <button className="magic-map-exit" onClick={onExit}>Through the door to the main site ↗</button>
  </div>
}

function MovementPad({ controls }) {
  const press = (key) => (e) => { e.preventDefault(); e.currentTarget.setPointerCapture?.(e.pointerId); controls.current[key] = true }
  const release = (key) => () => { controls.current[key] = false }
  return <div className="magic-move" aria-label="Walk controls">
    <button className="up" aria-label="Walk forward" onPointerDown={press('forward')} onPointerUp={release('forward')} onPointerCancel={release('forward')} onLostPointerCapture={release('forward')}>↑</button>
    <button className="left" aria-label="Walk left" onPointerDown={press('left')} onPointerUp={release('left')} onPointerCancel={release('left')} onLostPointerCapture={release('left')}>←</button>
    <button className="down" aria-label="Walk backward" onPointerDown={press('back')} onPointerUp={release('back')} onPointerCancel={release('back')} onLostPointerCapture={release('back')}>↓</button>
    <button className="right" aria-label="Walk right" onPointerDown={press('right')} onPointerUp={release('right')} onPointerCancel={release('right')} onLostPointerCapture={release('right')}>→</button>
  </div>
}

export default function MagicStore({ open, onClose, onExitToSite, motionPaused }) {
  const st = useStore()
  const [webgl] = useState(supportsWebGL)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const [shelf, setShelf] = useState('seeds')
  const [catalog, setCatalog] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [size, setSize] = useState(200)
  const [cashier, setCashier] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [cashierSays, setCashierSays] = useState('Welcome in! Tap a pouch, then I can add it to your dabba.')
  const [jump, setJump] = useState(null)
  const controls = useRef({ forward: false, back: false, left: false, right: false, teleport: null })
  const look = useRef({ yaw: 0, pitch: 0 })
  const drag = useRef(null)
  const selected = selectedId ? byId[selectedId] : null
  const currentShelf = shelves.find((s) => s.id === shelf)
  const canWalk = webgl && !failed
  useModal(open, onClose)

  useEffect(() => { if (open) document.querySelector('.magic-exit')?.focus() }, [open])

  useEffect(() => {
    if (!open) return
    const map = { w: 'forward', ArrowUp: 'forward', s: 'back', ArrowDown: 'back', a: 'left', ArrowLeft: 'left', d: 'right', ArrowRight: 'right' }
    const setKey = (e, value) => {
      if (e.target instanceof Element && e.target.closest('input, textarea, select')) return
      const key = map[e.key]
      if (key) { e.preventDefault(); controls.current[key] = value }
    }
    const down = (e) => setKey(e, true)
    const up = (e) => setKey(e, false)
    const blur = () => { ['forward', 'back', 'left', 'right'].forEach((k) => { controls.current[k] = false }) }
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', blur)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', blur); blur(); document.body.style.cursor = '' }
  }, [open])

  const visit = (id) => {
    setShelf(id); setJump({ key: id, n: Date.now() }); setSelectedId(null); setCatalog(false); setCashier(false)
  }
  const browse = (id = shelf) => { setShelf(id); setCatalog(true); setSelectedId(null); setCashier(false) }
  const pick = (id, preferredSize) => {
    const p = byId[id]
    if (!p) return
    setShelf(shelves.find((s) => s.items.some((item) => item.id === id))?.id || 'seeds')
    setSelectedId(id); setSize(sizes(p).includes(preferredSize) ? preferredSize : sizes(p)[0]); setQuantity(1); setCashier(false); setCatalog(false)
  }
  const meetCashier = () => {
    if (selected) setCashierSays(`Great choice! I can add ${selected.name} (${size}g) to your dabba.`)
    setCashier(true); setCatalog(false); setJump({ key: 'cashier', n: Date.now() })
  }
  const addAtCashier = () => {
    if (!selected) return
    st.add(selected.id, size, quantity, { open: false, silent: true })
    setCashierSays(`Done! ${quantity} × ${selected.name} (${size}g) is in your dabba.`)
    setQuantity(1)
  }
  const pointerDown = (e) => { if (e.target.tagName !== 'CANVAS') return; drag.current = [e.clientX, e.clientY] }
  const pointerMove = (e) => {
    if (!drag.current) return
    const [x, y] = drag.current
    look.current.yaw -= (e.clientX - x) * .004
    look.current.pitch = Math.max(-.45, Math.min(.45, look.current.pitch - (e.clientY - y) * .003))
    drag.current = [e.clientX, e.clientY]
  }
  const stopDrag = () => { drag.current = null }
  const trapFocus = (e) => {
    if (e.key !== 'Tab') return
    const focusables = [...e.currentTarget.querySelectorAll('button')].filter((el) => !el.disabled && el.getClientRects().length)
    if (!focusables.length) return
    const first = focusables[0], last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }

  if (!open) return null
  return <div className="magic-store" role="dialog" aria-modal="true" aria-label="Kesari Magic Store" data-lenis-prevent onKeyDown={trapFocus}>
    <div className="magic-topbar">
      <div className="magic-brand"><span className="magic-brand-mark"><Sparkle size={18} /></span><div><b>THE MAGIC STORE</b><small>KESARI · WALK IN, PICK UP, TURN UP</small></div></div>
      <div className="magic-top-actions">
        <button className="magic-cart-btn" onClick={() => st.open('cart', true)}><CartIcon size={19} /> Dabba <b>{st.count}</b></button>
        <button className="magic-exit" onClick={onClose} aria-label="Leave magic store">Leave store <span aria-hidden="true">×</span></button>
      </div>
    </div>

    <div className="magic-stage" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={stopDrag} onPointerCancel={stopDrag} onPointerLeave={stopDrag}>
      {canWalk ? <Boundary onError={() => setFailed(true)}><Suspense fallback={<div className="magic-loading">Opening the store…</div>}>
        <StoreScene controls={controls} look={look} jump={jump} onPick={pick} onCashier={meetCashier} onExit={onExitToSite} selectedId={selectedId} paused={motionPaused} onReady={() => setReady(true)} />
      </Suspense></Boundary> : <FloorPlan onShelf={browse} onCashier={meetCashier} onExit={onExitToSite} />}
      {canWalk && !ready && <div className="magic-loading">Opening the store…</div>}
      <div className="magic-top-hud">
        <div className="magic-shelf-nav" aria-label="Store sections">
          {shelves.map((s) => <button key={s.id} className={shelf === s.id ? 'on' : ''} onClick={() => canWalk ? visit(s.id) : browse(s.id)}>{s.short}</button>)}
          <button className="magic-cashier-chip" onClick={meetCashier}>Cashier</button>
        </div>
        <button className="magic-browse" onClick={() => browse()}>Browse every shelf <span>{allItems.length}</span></button>
      </div>
      {canWalk && <><MovementPad controls={controls} /><div className="magic-instructions">WASD / arrows to walk · drag to look · tap a pouch or the cashier</div></>}
      {!selected && !catalog && !cashier && <div className="magic-welcome"><Sparkle size={18} /><span>{canWalk ? 'Take a walk. Every pouch on the shelves opens.' : 'Choose a zone to browse every pouch.'}</span></div>}
    </div>

    {catalog && <aside className="magic-panel magic-catalog" aria-label="Browse store shelves">
      <div className="magic-panel-head"><div><small>THE SHELVES</small><h2>Browse the store</h2></div><button onClick={() => setCatalog(false)} aria-label="Close shelf browser">×</button></div>
      <div className="magic-tabs" role="tablist" aria-label="Shelf category">{shelves.map((s) => <button key={s.id} role="tab" aria-selected={shelf === s.id} onClick={() => setShelf(s.id)}>{s.short} <span>{s.items.length}</span></button>)}</div>
      <div className="magic-catalog-list" role="tabpanel" aria-label={currentShelf.label}>
        <p>{currentShelf.label} · {currentShelf.items.length} products</p>
        {currentShelf.items.map((p) => <button key={p.id} className="magic-list-item" onClick={() => pick(p.id)}><span className="magic-thumb" style={{ background: p.color }}><PouchSVG sku={p} /></span><span><b>{p.name}</b><small>{sizes(p).map((g) => `${g}g`).join(' · ')}</small></span><Arrow size={16} /></button>)}
      </div>
      <p className="magic-demo-note">Showroom prices are illustrative. Confirm selling prices before launch.</p>
    </aside>}

    {selected && !cashier && <aside className="magic-panel magic-product" aria-label={`${selected.name} details`}>
      <div className="magic-panel-head"><div><small>ON THE {selected.section === 'seeds' ? 'SEEDS' : selected.section === 'makhana' ? 'MAKHANA' : 'SPICES'} SHELF</small><h2>{selected.name}</h2></div><button onClick={() => setSelectedId(null)} aria-label="Close product details">×</button></div>
      <div className="magic-product-art" style={{ background: selected.color }}><PouchSVG sku={{ ...selected, weight: `${size}g` }} /></div>
      <p className="magic-product-copy">Pick your pack, then ask the cashier to add it to your dabba.</p>
      <div className="magic-size-list" role="group" aria-label={`${selected.name} pack size`}>{sizes(selected).map((g) => <button key={g} className={size === g ? 'on' : ''} aria-pressed={size === g} onClick={() => setSize(g)}>{g}g</button>)}</div>
      <div className="magic-product-price"><strong>{rupee(priceFor(selected, size).price)}</strong><small>Demo price</small></div>
      <button className="magic-primary" onClick={meetCashier}>Ask cashier to add <Arrow size={18} /></button>
      <button className="magic-text-button" onClick={() => browse(shelf)}>Browse more on this shelf</button>
    </aside>}

    {cashier && <aside className="magic-panel magic-cashier" aria-label="Cashier">
      <div className="magic-panel-head"><div><small>AT THE COUNTER</small><h2>Meet your cashier</h2></div><button onClick={() => setCashier(false)} aria-label="Close cashier">×</button></div>
      <div className="magic-cashier-face" aria-hidden="true"><span>☺</span><b>KESARI</b></div>
      <p className="magic-speech" role="status">“{cashierSays}”</p>
      {selected ? <div className="magic-counter-item"><b>{selected.name}</b><span>{size}g · {rupee(priceFor(selected, size).price)}</span><div className="magic-counter-qty" aria-label="Quantity"><button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button><strong>{quantity}</strong><button onClick={() => setQuantity((q) => Math.min(9, q + 1))} aria-label="Increase quantity">+</button></div><button className="magic-primary" onClick={addAtCashier}>Cashier, add to dabba <Arrow size={18} /></button></div> : <button className="magic-primary" onClick={() => browse()}>Choose a product <Arrow size={18} /></button>}
      <div className="magic-counter-total"><span>In your dabba</span><strong>{st.count} {st.count === 1 ? 'item' : 'items'} · {rupee(st.subtotal)}</strong></div>
      <button className="magic-secondary" onClick={() => st.open('cart', true)}>Open cart <CartIcon size={17} /></button>
      <p className="magic-demo-note">The store and checkout are demos. Nothing is charged.</p>
    </aside>}
  </div>
}
