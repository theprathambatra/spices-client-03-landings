import { useRef, useMemo, useLayoutEffect, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, ContactShadows, PerformanceMonitor } from '@react-three/drei'
import { useState } from 'react'
import Prewarm from './Prewarm'
import * as THREE from 'three'
import { heroState, heroActive, interacted, useStore } from '../store'
import { makeBrushed, V2, noise2 } from './steel'

const { damp, clamp, smoothstep } = THREE.MathUtils
const ease = (t) => t * t * (3 - 2 * t)
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const remap = (p, a, b) => clamp((p - a) / (b - a), 0, 1)

// --- spice pile definitions (colour + grain behaviour), order matches SPICES in brand.js
const PILES = [
  { color: '#D9A00F', H: 0.36, amp: 0.012, g: { kind: 'sphere', s: 0.012, n: 170, c: '#F2B72C', v: 0.18 } }, // haldi
  { color: '#A8201A', H: 0.32, amp: 0.016, g: { kind: 'flake', s: 0.03, n: 120, c: '#CC3320', v: 0.2 } }, // mirch
  { color: '#8F6D3B', H: 0.3, amp: 0.02, g: { kind: 'seed', s: 0.05, n: 280, c: '#B08C50', v: 0.22 } }, // jeera
  { color: '#33231a', H: 0.31, amp: 0.012, g: { kind: 'sphere', s: 0.021, n: 320, c: '#5C4029', v: 0.25 } }, // rai
  { color: '#B09A52', H: 0.3, amp: 0.016, g: { kind: 'dsphere', s: 0.034, n: 200, c: '#CDB66E', v: 0.2 } }, // dhania
  { color: '#5A3017', H: 0.34, amp: 0.014, g: { kind: 'sphere', s: 0.014, n: 170, c: '#7E4727', v: 0.25 } }, // garam
  { color: '#7A210E', H: 0.28, amp: 0.012, g: { kind: 'thread', s: 0.11, n: 190, c: '#E4501C', v: 0.15 } }, // kesar
]
// ring positions (index 0..5) + centre (6)
const R = 0.88
const POS = [0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; return [Math.sin(a) * R, Math.cos(a) * R] }).concat([[0, 0]])
const KR = 0.405 // katori rim radius

function heightAt(x, z, H, amp, seed) {
  const rho = Math.min(1, Math.hypot(x, z) / (KR - 0.02))
  const base = H * Math.pow(Math.max(0, 1 - rho * rho), 0.72) - 0.05 * Math.pow(rho, 8)
  return base + amp * noise2(x * 1, z * 1, seed) * (1 - rho * rho * rho)
}

function makePile(cfg, seed) {
  const rings = 14, segs = 40, Rr = KR - 0.02
  const pos = [], col = [], idx = []
  const c = new THREE.Color(cfg.color), t = new THREE.Color()
  const push = (x, z) => {
    const y = heightAt(x, z, cfg.H, cfg.amp, seed)
    pos.push(x, y, z)
    t.copy(c).offsetHSL(0, 0, noise2(x * 3, z * 3, seed + 4) * 0.035)
    col.push(t.r, t.g, t.b)
  }
  push(0, 0)
  for (let r = 1; r <= rings; r++) for (let s = 0; s < segs; s++) { const a = (s / segs) * Math.PI * 2; push(Math.cos(a) * Rr * (r / rings), Math.sin(a) * Rr * (r / rings)) }
  const v = (r, s) => (r === 0 ? 0 : 1 + (r - 1) * segs + (s % segs))
  for (let s = 0; s < segs; s++) idx.push(0, v(1, s + 1), v(1, s))
  for (let r = 1; r < rings; r++) for (let s = 0; s < segs; s++) { const a = v(r, s), b = v(r, s + 1), d = v(r + 1, s), e = v(r + 1, s + 1); idx.push(a, b, d, b, e, d) }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.setIndex(idx); g.computeVertexNormals()
  return g
}

function Grains({ cfg, seed, mobile }) {
  const ref = useRef()
  const { geo, count } = useMemo(() => {
    const k = cfg.g.kind
    let geo
    if (k === 'seed') { geo = new THREE.SphereGeometry(1, 7, 5); geo.scale(1, 0.38, 0.38) }
    else if (k === 'flake') { geo = new THREE.SphereGeometry(1, 6, 4); geo.scale(1, 0.18, 0.8) }
    else if (k === 'dsphere') { geo = new THREE.SphereGeometry(1, 7, 5); geo.scale(1, 0.8, 1) }
    else if (k === 'thread') { geo = new THREE.CylinderGeometry(0.0055, 0.0035, 1, 4); geo.rotateZ(Math.PI / 2) }
    else geo = new THREE.SphereGeometry(1, 6, 5)
    return { geo, count: Math.round(cfg.g.n * (mobile ? 0.2 : 0.45)) }
  }, [cfg, mobile])
  useLayoutEffect(() => {
    const m = ref.current, o = new THREE.Object3D(), c = new THREE.Color(), base = new THREE.Color(cfg.g.c)
    let rnd = seed * 9301 + 49297
    const rand = () => { rnd = (rnd * 9301 + 49297) % 233280; return rnd / 233280 }
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * (KR - 0.05)
      const x = Math.cos(a) * r, z = Math.sin(a) * r
      const y = heightAt(x, z, cfg.H, cfg.amp, seed) + cfg.g.s * 0.2
      o.position.set(x, y, z)
      o.rotation.set((rand() - 0.5) * 0.9, rand() * Math.PI * 2, (rand() - 0.5) * 0.9)
      const s = cfg.g.s * (0.7 + rand() * 0.6)
      o.scale.setScalar(cfg.g.kind === 'thread' ? s : s)
      o.updateMatrix(); m.setMatrixAt(i, o.matrix)
      c.copy(base).offsetHSL(0, (rand() - 0.5) * 0.08, (rand() - 0.5) * cfg.g.v)
      m.setColorAt(i, c)
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [cfg, count, seed])
  return (
    <instancedMesh ref={ref} args={[geo, undefined, count]} frustumCulled={false}>
      <meshStandardMaterial roughness={cfg.g.kind === 'thread' ? 0.45 : 0.9} metalness={0} emissive={cfg.g.kind === 'thread' ? '#5a1200' : '#000'} />
    </instancedMesh>
  )
}

const katoriProfile = V2([[0, 0], [0.15, 0], [0.2, 0.03], [0.3, 0.16], [0.395, 0.33], [0.425, 0.375], [0.425, 0.39], [0.4, 0.395], [0.385, 0.375], [0.29, 0.18], [0.14, 0.06], [0, 0.05]])
const bodyProfile = V2([[0, 0], [1.28, 0], [1.42, 0.05], [1.5, 0.18], [1.52, 0.4], [1.52, 0.8], [1.545, 0.83], [1.545, 0.87], [1.47, 0.875], [1.46, 0.82], [1.46, 0.14], [0.001, 0.14]])
const lidProfile = V2([[1.58, 0], [1.6, 0.03], [1.6, 0.12], [1.52, 0.3], [1.24, 0.5], [0.85, 0.62], [0.34, 0.69], [0.13, 0.71], [0.11, 0.8], [0.17, 0.9], [0.14, 0.99], [0.001, 1.0], [0.001, 0.8], [0.3, 0.66], [1.0, 0.52], [1.45, 0.26], [1.5, 0.02]])

function Katori({ i, mobile, mat }) {
  const cfg = PILES[i]
  const pile = useMemo(() => makePile(cfg, i * 3.7 + 1), [cfg, i])
  return (
    <>
      <mesh material={mat}><latheGeometry args={[katoriProfile, 32]} /></mesh>
      <mesh position={[0, 0.378, 0]} rotation={[Math.PI / 2, 0, 0]} material={mat}><torusGeometry args={[0.418, 0.016, 8, 48]} /></mesh>
      <group position={[0, 0.34, 0]} name="pile">
        <mesh geometry={pile}><meshStandardMaterial vertexColors roughness={1} side={THREE.DoubleSide} /></mesh>
        <Grains cfg={cfg} seed={i + 1} mobile={mobile} />
      </group>
    </>
  )
}

function Dabba({ reduced, mobile }) {
  const root = useRef(), lid = useRef(), halo = useRef([])
  const kat = useRef([]), piles = useRef([])
  const st = useRef({ p: 0, hl: new Array(7).fill(0), rise: new Array(7).fill(0), pt: { x: 0, y: 0 } })
  const steel = useMemo(() => {
    const m = makeBrushed()
    return new THREE.MeshPhysicalMaterial({ color: '#cfccc5', metalness: 1, roughness: 0.62, roughnessMap: m, clearcoat: 0.0, side: THREE.DoubleSide, envMapIntensity: 0.9 })
  }, [])
  useEffect(() => () => steel.dispose(), [steel])
  const active = useStore(heroActive)
  const haloMats = useMemo(() => Array.from({ length: 7 }, () => new THREE.MeshBasicMaterial({ color: '#F2B230', transparent: true, opacity: 0, depthWrite: false })), [])

  useFrame((state, dt) => {
    const s = st.current
    dt = Math.min(dt, 0.05)
    const target = reduced ? 0.9 : heroState.p
    s.p = damp(s.p, target, 5, dt)
    const p = s.p
    const t = state.clock.elapsedTime
    // pointer parallax
    s.pt.x = damp(s.pt.x, state.pointer.x, 3, dt); s.pt.y = damp(s.pt.y, state.pointer.y, 3, dt)

    // lid: lift, then slide away
    const l1 = ease(remap(p, 0.04, 0.26)), l2 = ease(remap(p, 0.2, 0.56))
    if (lid.current) {
      lid.current.position.set(l2 * 6.2, 0.82 + l1 * 1.5 + l2 * 2.4, l2 * -1.0)
      lid.current.rotation.set(l2 * 0.5, l2 * 0.6, -l2 * 0.9 + l1 * 0.05)
    }
    // katoris rise one by one
    for (let i = 0; i < 7; i++) {
      const g = kat.current[i]; if (!g) continue
      const r = easeOut(remap(p, 0.44 + i * 0.06, 0.44 + i * 0.06 + 0.2))
      s.rise[i] = r
      s.hl[i] = damp(s.hl[i], active === i ? 1 : 0, 6, dt)
      g.position.y = 0.2 + r * 0.3 + s.hl[i] * 0.16
      const pl = piles.current[i]; if (pl) { const k = 0.3 + 0.7 * r + s.hl[i] * 0.06; pl.scale.set(1 + s.hl[i] * 0.03, k, 1 + s.hl[i] * 0.03) }
      const h = halo.current[i]; if (h) h.material.opacity = s.hl[i] * 0.85
    }
    // whole tin: sway + scroll turn
    const sway = reduced ? 0 : Math.sin(t * 0.35) * 0.12
    root.current.rotation.y = -0.5 + p * 1.1 + sway + s.pt.x * 0.18
    root.current.position.y = -0.55 + p * 0.05
    // camera tilts down as the lid goes
    const e = THREE.MathUtils.degToRad(THREE.MathUtils.lerp(20, 60, ease(remap(p, 0.12, 0.7)))) + s.pt.y * 0.03
    const asp = state.size.width / state.size.height
    const fit = 2.9 / (Math.tan(THREE.MathUtils.degToRad(15)) * Math.max(asp, 0.2))
    const d = Math.max(THREE.MathUtils.lerp(10.2, 8.4, ease(remap(p, 0.1, 0.7))), fit * (mobile ? 1.02 : 0.92))
    const cam = state.camera
    cam.position.set(0, Math.sin(e) * d + 0.5, Math.cos(e) * d)
    cam.lookAt(0, 0.25 - p * 0.2, 0)
  })

  return (
    <group ref={root}>
      {/* body */}
      <mesh material={steel}><latheGeometry args={[bodyProfile, 64]} /></mesh>
      <mesh position={[0, 0.84, 0]} rotation={[Math.PI / 2, 0, 0]} material={steel}><torusGeometry args={[1.5, 0.028, 8, 64]} /></mesh>
      <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} material={steel}><torusGeometry args={[1.515, 0.014, 6, 64]} /></mesh>
      {/* katoris */}
      {POS.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <group ref={(el) => (kat.current[i] = el)} position={[0, 0.2, 0]}>
            <KatoriWrap i={i} mobile={mobile} steel={steel} pilesRef={piles} />
            <mesh ref={(el) => (halo.current[i] = el)} position={[0, 0.39, 0]} rotation={[Math.PI / 2, 0, 0]} material={haloMats[i]}><torusGeometry args={[0.45, 0.012, 6, 48]} /></mesh>
          </group>
        </group>
      ))}
      {/* the outer lid */}
      <group ref={lid} position={[0, 0.82, 0]}>
        <mesh material={steel}><latheGeometry args={[lidProfile, 64]} /></mesh>
        <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} material={steel}><torusGeometry args={[1.43, 0.012, 6, 64]} /></mesh>
      </group>
    </group>
  )
}

// wrapper adds pointer handlers + wires pile ref
function KatoriWrap({ i, mobile, steel, pilesRef }) {
  const g = useRef()
  useLayoutEffect(() => { pilesRef.current[i] = g.current?.children.find((c) => c.name === 'pile') }, [i, pilesRef])
  return (
    <group
      ref={g}
      onPointerOver={(e) => { if (heroState.p < 0.55) return; e.stopPropagation(); interacted.v = true; heroActive.set(i); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = '' }}
      onClick={(e) => { if (heroState.p < 0.55) return; e.stopPropagation(); interacted.v = true; heroActive.set(i) }}
    >
      <Katori i={i} mobile={mobile} mat={steel} />
    </group>
  )
}

export default function DabbaScene({ reduced, mobile, visible }) {
  const [dpr, setDpr] = useState(mobile ? 1.1 : 1.25)
  const [ready, setReady] = useState(false)
  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop={!ready ? 'never' : visible ? 'always' : 'demand'}
      camera={{ fov: 30, position: [0, 4, 10], near: 0.5, far: 60 }}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance', stencil: false }}
      style={{ touchAction: 'pan-y' }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <Prewarm onReady={() => setReady(true)} />
      <ambientLight intensity={0.35} color="#ffe9c8" />
      <directionalLight position={[3, 6, 4]} intensity={1.6} color="#fff0d8" />
      <directionalLight position={[-5, 3, -2]} intensity={0.5} color="#ffc27a" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={5} color="#fff1d6" position={[0, 6, 1]} rotation={[Math.PI / 2, 0, 0]} scale={[9, 6, 1]} />
        <Lightformer form="rect" intensity={3} color="#ffd9a0" position={[-6, 2, 2]} rotation={[0, Math.PI / 2, 0]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[6, 1.5, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#F2B230" position={[0, 1, -7]} scale={[14, 5, 1]} />
        <Lightformer form="ring" intensity={2} color="#fff5e6" position={[0, 3, 6]} scale={4} />
        <Lightformer form="rect" intensity={2.2} color="#ffcf8a" position={[0, -5, 1]} rotation={[-Math.PI / 2, 0, 0]} scale={[12, 12, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#fff0d8" position={[0, 0.5, 7]} scale={[10, 2.5, 1]} />
        <color attach="background" args={['#2A1710']} />
      </Environment>
      <Dabba reduced={reduced} mobile={mobile} />
      <ContactShadows position={[0, -0.56, 0]} opacity={0.4} blur={3} scale={6.5} far={2} color="#3b1d08" resolution={256} frames={1} />
    </Canvas>
  )
}
