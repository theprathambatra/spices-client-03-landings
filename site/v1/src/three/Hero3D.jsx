import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import { Physics, useRapier } from '@react-three/rapier'
import * as THREE from 'three'
import { chilliGeo, pepperGeo, cardamomGeo, aniseGeo, turmericGeo, pouchSurface } from './geoms.js'
import { makeFrontTexture, makeBackTexture, makeBlobTexture } from './labels.js'

const TAU = Math.PI * 2
const rand = (a, b) => a + Math.random() * (b - a)
const dummy = new THREE.Object3D()

/* ------------------------------------------------------------------ layout */
function useLayout() {
  const { viewport } = useThree()
  return useMemo(() => {
    const vw = viewport.width, vh = viewport.height
    const mobile = vw < 8
    const floorTop = -vh / 2 + (mobile ? 0.18 : 0.26)
    const sc = mobile ? 0.57 : 1
    const cx = mobile ? 0 : Math.min(vw / 2 - 3.7, 2.4)
    const slots = mobile
      ? [[-1.13, 0.9, -0.1, 0], [0, 1.02, 0, 0.35], [1.13, 0.9, 0.1, 0]]
      : [[-2.72, 0.84, -0.12, -0.15], [-0.93, 1.0, -0.04, 0.35], [0.93, 1.0, 0.04, 0.35], [2.72, 0.84, 0.12, -0.15]]
    return { vw, vh, mobile, floorTop, sc, cx, slots }
  }, [viewport.width, viewport.height])
}

/* ------------------------------------------------------------------ pouch */
const PW = 1.9, PH = 3.4

function spring(s, target, k, c, dt) {
  const steps = Math.max(1, Math.ceil(dt / 0.016))
  const h = dt / steps
  for (let i = 0; i < steps; i++) {
    s.v += ((target - s.x) * k - s.v * c) * h
    s.x += s.v * h
  }
}

function Pouch({ sku, index, layout, ptr, onPop, blob, reduced }) {
  const [sx, sc0, rz0, z0] = layout.slots[index]
  const s = sc0 * layout.sc
  const group = useRef()
  const inner = useRef()
  const st = useRef({ ry: { x: 0, v: 0 }, rx: { x: 0, v: 0 }, lift: { x: 0, v: 0 }, spin: { x: 0, v: 0 }, hov: { x: 0, v: 0 }, sq: { x: 0, v: 0 }, spinT: 0, hovered: false })
  const front = useMemo(() => makeFrontTexture(sku), [sku])
  const back = useMemo(() => makeBackTexture(sku), [sku])
  const geo = useMemo(() => pouchSurface(PW, PH, 0.36), [])
  useEffect(() => () => { front.dispose(); back.dispose(); geo.dispose() }, [front, back, geo])
  const x = layout.cx + sx * (layout.mobile ? 1 : 1)

  useFrame((state, dt) => {
    dt = Math.min(dt, 0.05)
    const q = st.current
    const t = state.clock.elapsedTime
    const px = ptr.current.active ? ptr.current.x : x + Math.sin(t * 0.6 + index) * 1.5
    const py = ptr.current.active ? ptr.current.y : 0
    const dx = THREE.MathUtils.clamp((px - x) * 0.14, -0.55, 0.55)
    const dy = THREE.MathUtils.clamp((py - (layout.floorTop + 1.5)) * 0.05, -0.2, 0.2)
    spring(q.ry, dx, 60, 7, dt)
    spring(q.rx, -dy, 60, 7, dt)
    spring(q.hov, q.hovered ? 1 : 0, 150, 11, dt)
    spring(q.spin, q.spinT, 55, 6.5, dt)
    spring(q.sq, 0, 220, 9, dt)
    const g = group.current
    g.rotation.set(q.rx.x, q.ry.x + q.spin.x, rz0 + Math.sin(t * 2 + index * 1.7) * 0.012 + Math.sin(t * 22) * 0.05 * q.hov.x)
    g.position.y = 0.02 + q.hov.x * 0.22
    const sq = q.sq.x
    g.scale.set(s * (1 + q.hov.x * 0.05 - sq * 0.25), s * (1 + q.hov.x * 0.05 + sq * 0.3), s * (1 + q.hov.x * 0.05))
  })

  const pop = (e) => {
    e.stopPropagation()
    const q = st.current
    if (reduced) { onPop(index, [x, layout.floorTop + 1.6 * s]); return }
    q.spinT += TAU
    q.sq.x = -0.7 // squash then spring back
    q.sq.v = 4
    onPop(index, [x, layout.floorTop + 1.7 * s])
  }

  return (
    <group position={[x, layout.floorTop, z0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} scale={[PW * s * 1.45, PW * s * 0.9, 1]} renderOrder={-1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={blob} transparent depthWrite={false} />
      </mesh>
      <group ref={group} position={[0, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); st.current.hovered = true; e.target?.setPointerCapture; document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { st.current.hovered = false; document.body.style.cursor = '' }}
        onClick={pop}>
        <group ref={inner} position={[0, PH / 2, 0]}>
          <mesh geometry={geo}>
            <meshPhysicalMaterial map={front} roughness={0.34} clearcoat={0.7} clearcoatRoughness={0.25} />
          </mesh>
          <mesh geometry={geo} rotation={[0, Math.PI, 0]}>
            <meshStandardMaterial map={back} roughness={0.45} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ spice shower */
function buildTypes(m) {
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.3, metalness: 0.05, envMapIntensity: 1.1 })
  return [
    { k: 'chilli', share: 0.26, geo: chilliGeo(), size: [0.8, 1.2], col: (s) => ({ type: 'capsule', a: 0.34 * s * m, b: 0.1 * s * m }) },
    { k: 'pepper', share: 0.24, geo: pepperGeo(), size: [0.8, 1.25], col: (s) => ({ type: 'ball', a: 0.11 * s * m }) },
    { k: 'cardamom', share: 0.18, geo: cardamomGeo(), size: [0.85, 1.2], col: (s) => ({ type: 'capsule', a: 0.1 * s * m, b: 0.085 * s * m }) },
    { k: 'anise', share: 0.14, geo: aniseGeo(), size: [0.8, 1.15], col: (s) => ({ type: 'cyl', a: 0.04 * s * m, b: 0.18 * s * m }) },
    { k: 'turmeric', share: 0.18, geo: turmericGeo(), size: [0.8, 1.25], col: (s) => ({ type: 'capsule', a: 0.12 * s * m, b: 0.11 * s * m }) },
  ].map((t) => ({ ...t, mat }))
}

function SpiceShower({ count, layout, ptr, api, reduced }) {
  const { world, rapier } = useRapier()
  const meshes = useRef([])
  const types = useMemo(() => buildTypes(layout.mobile ? 0.82 : 1), [layout.mobile])
  const sim = useRef({ bodies: [], spoon: null, idx: 0, acc: 0, released: 0 })

  useEffect(() => () => { types[0].mat.dispose(); types.forEach((t) => t.geo.dispose()) }, [types])

  useEffect(() => {
    const R = rapier
    const created = []
    const mk = (desc, cdesc) => { const b = world.createRigidBody(desc); if (cdesc) world.createCollider(cdesc, b); created.push(b); return b }
    const { vw, vh, floorTop } = layout
    const depth = layout.mobile ? 1.2 : 1.6
    // static world
    mk(R.RigidBodyDesc.fixed().setTranslation(0, floorTop - 0.5, 0), R.ColliderDesc.cuboid(vw, 0.5, depth).setFriction(0.9))
    mk(R.RigidBodyDesc.fixed().setTranslation(-vw / 2 - 0.5, 0, 0), R.ColliderDesc.cuboid(0.5, vh * 3, depth))
    mk(R.RigidBodyDesc.fixed().setTranslation(vw / 2 + 0.5, 0, 0), R.ColliderDesc.cuboid(0.5, vh * 3, depth))
    mk(R.RigidBodyDesc.fixed().setTranslation(0, 0, -depth / 2 - 0.2), R.ColliderDesc.cuboid(vw, vh * 3, 0.2))
    mk(R.RigidBodyDesc.fixed().setTranslation(0, 0, depth / 2 + 0.2), R.ColliderDesc.cuboid(vw, vh * 3, 0.2))
    // pouch bodies (static)
    layout.slots.forEach(([sx, sc0, rz], i) => {
      if (layout.mobile && i > 2) return
      const s = sc0 * layout.sc
      const half = [PW * s * 0.46, PH * s * 0.5, 0.35]
      const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), rz)
      // rotate about pouch base
      const cx = layout.cx + sx, cy = floorTop + half[1]
      const off = new THREE.Vector3(0, half[1], 0).applyQuaternion(q)
      mk(R.RigidBodyDesc.fixed().setTranslation(cx + off.x, floorTop + off.y, 0).setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }), R.ColliderDesc.cuboid(half[0], half[1], half[2]).setFriction(0.5).setRestitution(0.2))
    })
    // spoon
    const spoon = mk(R.RigidBodyDesc.kinematicPositionBased().setTranslation(0, -200, 0), R.ColliderDesc.ball(layout.mobile ? 0.5 : 0.62).setRestitution(0.6))
    // spices
    const S = sim.current
    S.bodies = []
    const counts = types.map((t) => Math.round(count * t.share))
    types.forEach((t, ti) => {
      for (let i = 0; i < counts[ti]; i++) {
        const sc = rand(t.size[0], t.size[1])
        const c = t.col(sc)
        const desc = R.RigidBodyDesc.dynamic().setTranslation((ti * 40 + i) % 90 - 45, -300 - i * 0.6, 0).setLinearDamping(0.12).setAngularDamping(0.35).setGravityScale(0)
        const body = world.createRigidBody(desc)
        let cd
        if (c.type === 'capsule') cd = R.ColliderDesc.capsule(c.a, c.b)
        else if (c.type === 'ball') cd = R.ColliderDesc.ball(c.a)
        else cd = R.ColliderDesc.cylinder(c.a, c.b)
        world.createCollider(cd.setRestitution(0.28).setFriction(0.7).setDensity(1), body)
        created.push(body)
        S.bodies.push({ body, ti, i, sc, asleep: false, still: 0 })
      }
    })
    S.spoon = spoon
    S.idx = 0; S.acc = 0
    // instanced meshes
    types.forEach((t, ti) => {
      const m = meshes.current[ti]
      if (!m) return
      const c = new THREE.Color()
      for (let i = 0; i < counts[ti]; i++) { c.setScalar(rand(0.82, 1)); m.setColorAt(i, c) }
      if (m.instanceColor) m.instanceColor.needsUpdate = true
      m.count = counts[ti]
    })
    const release = (b, y) => {
      const x = rand(-vw / 2 + 0.4, vw / 2 - 0.4)
      b.body.setGravityScale(1, true)
      b.body.setTranslation({ x, y: y ?? vh / 2 + rand(0.6, 2.5), z: rand(-depth / 2 + 0.3, depth / 2 - 0.3) }, true)
      b.body.setLinvel({ x: rand(-0.6, 0.6), y: rand(-2, -0.5), z: 0 }, true)
      b.body.setAngvel({ x: rand(-4, 4), y: rand(-4, 4), z: rand(-4, 4) }, true)
      const r = new THREE.Quaternion().setFromEuler(new THREE.Euler(rand(0, TAU), rand(0, TAU), rand(0, TAU)))
      b.body.setRotation({ x: r.x, y: r.y, z: r.z, w: r.w }, true)
    }
    S.release = release
    // first frame already feels alive: a third of the spices start in mid-air / already landed
    const pre = Math.floor(S.bodies.length * (reduced ? 1 : 0.35))
    const order = [...S.bodies.keys()].sort(() => Math.random() - 0.5)
    for (let k = 0; k < pre; k++) release(S.bodies[order[k]], rand(floorTop + 0.5, vh / 2 + 1))
    S.idx = pre
    S.order = order
    S.released = pre
    if (reduced) {
      for (let k = 0; k < 420; k++) world.step()
      S.bodies.forEach((b) => b.body.sleep())
      S.dirty = true
    }
    // shockwave API for pouch pops
    api.current.shock = (x, y, power = 1) => {
      for (const b of S.bodies) {
        const p = b.body.translation()
        if (p.y < -100) continue
        const dx = p.x - x, dy = p.y - y
        const d = Math.hypot(dx, dy) + 0.001
        if (d < 3.2) {
          const f = (1 - d / 3.2) * 3.2 * power
          b.body.applyImpulse({ x: (dx / d) * f * 0.5, y: (dy / d) * f * 0.5 + f * 0.8, z: rand(-0.2, 0.2) }, true)
        }
      }
    }
    return () => { created.forEach((b) => { try { world.removeRigidBody(b) } catch (e) { /* world gone */ } }) }
  }, [world, rapier, layout, count, types, reduced, api])

  useFrame((_, dt) => {
    const S = sim.current
    if (!S.spoon) return
    dt = Math.min(dt, 0.05)
    // spoon follows the cursor
    const p = ptr.current
    if (p.active && !reduced) S.spoon.setNextKinematicTranslation({ x: p.x, y: p.y, z: 0 })
    else S.spoon.setNextKinematicTranslation({ x: 0, y: -200, z: 0 })
    // keep the shower going
    if (!reduced) {
      S.acc += dt * (S.released < S.bodies.length ? 22 : 1.6)
      while (S.acc >= 1) {
        S.acc -= 1
        const b = S.bodies[S.order[S.idx % S.order.length]]
        S.idx++; S.released++
        S.release(b)
      }
    }
    // push transforms (only bodies that are awake)
    if (reduced && !S.dirty) return
    let touched = false
    for (const b of S.bodies) {
      const m = meshes.current[b.ti]
      if (!m) continue
      const sl = b.body.isSleeping()
      if (sl && b.asleep && !S.dirty) continue
      b.asleep = sl
      const t = b.body.translation(), r = b.body.rotation()
      dummy.position.set(t.x, t.y, t.z)
      dummy.quaternion.set(r.x, r.y, r.z, r.w)
      dummy.scale.setScalar(b.sc * (layout.mobile ? 0.82 : 1))
      dummy.updateMatrix()
      m.setMatrixAt(b.i, dummy.matrix)
      m.userData.dirty = true
      touched = true
    }
    if (touched || S.dirty) meshes.current.forEach((m) => { if (m && m.userData.dirty) { m.instanceMatrix.needsUpdate = true; m.userData.dirty = false } })
    S.dirty = false
  })

  return (
    <>
      {types.map((t, i) => (
        <instancedMesh key={t.k} ref={(el) => (meshes.current[i] = el)} args={[t.geo, t.mat, Math.round(count * t.share)]} frustumCulled={false} />
      ))}
    </>
  )
}

/* ------------------------------------------------------------------ confetti */
const CONF = 72
function Confetti({ api, reduced }) {
  const refs = useRef([])
  const geos = useMemo(() => [chilliGeo(), cardamomGeo(), aniseGeo()], [])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0 }), [])
  const parts = useRef(Array.from({ length: CONF }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Euler(), w: new THREE.Vector3(), t: 99, life: 2, s: 1 })))
  const counts = [24, 24, 24]
  const col = useMemo(() => new THREE.Color(), [])

  useEffect(() => {
    api.current.burst = (pos, colors) => {
      if (reduced) return
      parts.current.forEach((q, i) => {
        q.p.set(pos[0] + rand(-0.4, 0.4), pos[1] + rand(-0.2, 0.4), rand(0.2, 0.8))
        const a = rand(0, TAU), sp = rand(3, 10)
        q.v.set(Math.cos(a) * sp, Math.abs(Math.sin(a)) * sp * 0.9 + rand(2, 6), rand(1, 5))
        q.w.set(rand(-9, 9), rand(-9, 9), rand(-9, 9))
        q.r.set(rand(0, TAU), rand(0, TAU), rand(0, TAU))
        q.t = 0; q.life = rand(1.4, 2.4); q.s = rand(0.7, 1.4)
        const m = refs.current[i % 3]
        col.set(colors[i % colors.length])
        m.setColorAt(Math.floor(i / 3), col)
        if (m.instanceColor) m.instanceColor.needsUpdate = true
      })
    }
    return () => { geos.forEach((g) => g.dispose()); mat.dispose() }
  }, [api, geos, mat, reduced, col])

  useFrame((_, dt) => {
    dt = Math.min(dt, 0.05)
    const c = [0, 0, 0]
    parts.current.forEach((q, i) => {
      const m = refs.current[i % 3]
      if (!m) return
      let sc = 0
      if (q.t < q.life) {
        q.t += dt
        q.v.y -= 16 * dt
        q.v.multiplyScalar(1 - dt * 0.35)
        q.p.addScaledVector(q.v, dt)
        q.r.x += q.w.x * dt; q.r.y += q.w.y * dt; q.r.z += q.w.z * dt
        const k = q.t / q.life
        const pop = Math.min(1, q.t / 0.14)
        sc = q.s * (1 + 0.45 * Math.sin(pop * Math.PI)) * pop * Math.min(1, (1 - k) * 3.5)
      }
      dummy.position.copy(q.p); dummy.rotation.copy(q.r); dummy.scale.setScalar(Math.max(0.0001, sc) * 0.85)
      dummy.updateMatrix()
      m.setMatrixAt(c[i % 3]++, dummy.matrix)
    })
    refs.current.forEach((m) => m && (m.instanceMatrix.needsUpdate = true))
  })

  return (
    <>
      {geos.map((g, i) => (
        <instancedMesh key={i} ref={(el) => (refs.current[i] = el)} args={[g, mat, counts[i]]} frustumCulled={false} />
      ))}
    </>
  )
}

/* ------------------------------------------------------------------ pointer -> spoon */
function PointerTracker({ ptr, layout }) {
  const el = useThree((s) => s.gl.domElement)
  useEffect(() => {
    let off
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1)
      ptr.current.x = (nx * layout.vw) / 2
      ptr.current.y = (ny * layout.vh) / 2
      ptr.current.active = true
      clearTimeout(off)
      if (e.pointerType === 'touch') off = setTimeout(() => (ptr.current.active = false), 450)
    }
    const leave = () => { ptr.current.active = false }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerdown', move)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('pointercancel', leave)
    return () => { clearTimeout(off); el.removeEventListener('pointermove', move); el.removeEventListener('pointerdown', move); el.removeEventListener('pointerleave', leave); el.removeEventListener('pointercancel', leave) }
  }, [el, layout, ptr])
  return null
}

/* ------------------------------------------------------------------ scene */
function Scene({ skus, onPop, reduced, count, ptr, paused }) {
  const layout = useLayout()
  const api = useRef({})
  const blob = useMemo(() => makeBlobTexture(), [])
  const handlePop = (i, pos) => {
    const sku = skus[i]
    api.current.shock?.(pos[0], pos[1] - 0.2, 1)
    api.current.burst?.(pos, [sku.color, '#FFC21A', '#FFF3DC', '#FF8FB1', '#2FA36B', '#2BA8E0'])
    onPop(i)
  }
  const n = layout.mobile ? 3 : skus.length
  return (
    <>
      <ambientLight intensity={0.75} />
      <hemisphereLight args={['#fff4dc', '#b05a2a', 0.5]} />
      <directionalLight position={[4, 6, 7]} intensity={1.7} color="#fff0d2" />
      <directionalLight position={[-6, 2, 4]} intensity={0.8} color="#ffd0b0" />
      <Environment resolution={128} frames={1} background={false}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 5]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={2} position={[-6, 1, 2]} scale={[3, 6, 1]} color="#ffdcb0" />
        <Lightformer form="rect" intensity={2} position={[6, 1, 2]} scale={[3, 6, 1]} color="#ffffff" />
      </Environment>
      <PointerTracker ptr={ptr} layout={layout} />
      <Physics gravity={[0, -16, 0]} timeStep={1 / 60} paused={!!paused}>
        <SpiceShower count={count} layout={layout} ptr={ptr} api={api} reduced={reduced} />
      </Physics>
      <Confetti api={api} reduced={reduced} />
      {skus.slice(0, n).map((sku, i) => (
        <Pouch key={sku.id} sku={sku} index={i} layout={layout} ptr={ptr} onPop={handlePop} blob={blob} reduced={reduced} />
      ))}
    </>
  )
}

export default function Hero3D({ skus, onPop, onReady, visible, reduced }) {
  const [dpr, setDpr] = useState(1)
  const ptr = useRef({ x: 0, y: 0, active: false })
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
  const count = mobile ? 38 : 104
  return (
    <Canvas
      className="hero-canvas"
      dpr={[1, (mobile ? 1.25 : 1.5) * (dpr ? 1 : 0.8)]}
      flat
      frameloop={visible && !reduced ? 'always' : 'demand'}
      gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance', stencil: false }}
      camera={{ position: [0, 0, 12], fov: 35 }}
      onCreated={() => onReady?.()}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(0)} onIncline={() => setDpr(1)} />
      <Suspense fallback={null}>
        <Scene skus={skus} onPop={onPop} reduced={reduced} count={count} ptr={ptr} paused={!visible} />
      </Suspense>
    </Canvas>
  )
}
