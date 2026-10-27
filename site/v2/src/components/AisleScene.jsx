import { useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import { useState } from 'react'
import Prewarm from './Prewarm'
import * as THREE from 'three'
import { aisleState, aisleFocus, aisleHover, useStore } from '../store'
import { V2 } from './steel'
import { makeLabel, makeWood, makeWall, makeSpeckle, makeGlow } from './labels'

const { damp } = THREE.MathUtils
const SP = 1.85

const glassProfile = V2([[0.001, 0], [0.5, 0], [0.6, 0.05], [0.645, 0.2], [0.645, 1.28], [0.6, 1.4], [0.47, 1.5], [0.45, 1.6], [0.45, 1.7]])
const fillProfile = V2([[0.001, 0.05], [0.56, 0.05], [0.6, 0.2], [0.6, 1.1], [0.55, 1.2], [0.4, 1.28], [0.2, 1.32], [0.001, 1.34]])
const lidProfile = V2([[0.001, 1.66], [0.5, 1.66], [0.52, 1.7], [0.52, 1.86], [0.5, 1.9], [0.4, 1.92], [0.001, 1.92]])

function Jar({ p, i, shared, mobile }) {
  const g = useRef(), addT = useRef(-10)
  const x = i * SP
  const sc = [1, 1.12, 0.94, 1.06][i % 4]
  const rotY = ((i * 37) % 11 - 5) * 0.04
  const label = useMemo(() => makeLabel(p), [p])
  const fill = useMemo(() => new THREE.MeshStandardMaterial({ color: p.fill, map: shared.speckle, roughness: 1 }), [p, shared])
  useEffect(() => () => { label.dispose(); fill.dispose() }, [label, fill])
  const hover = useStore(aisleHover)
  useFrame((s, dt) => {
    const t = s.clock.elapsedTime
    const d = Math.abs(x - aisleState.camX)
    const bump = Math.exp(-(d * d) / 1.4)
    const amp = bump * Math.min(1, aisleState.vel * 0.55)
    const hop = Math.sin(Math.PI * Math.min(1, Math.max(0, (t - addT.current) / 0.7))) * 0.28
    g.current.rotation.z = Math.sin(t * 34 + i * 1.7) * 0.014 * amp
    g.current.rotation.x = Math.sin(t * 29 + i * 2.3) * 0.008 * amp
    g.current.position.y = damp(g.current.position.y, (hover === i ? 0.1 : 0) + hop + Math.abs(Math.sin(t * 41 + i)) * 0.012 * amp, 10, dt)
  })
  return (
    <group position={[x, 0, 0]}>
      <group
        ref={g}
        scale={sc}
        rotation={[0, rotY, 0]}
        onPointerOver={(e) => { e.stopPropagation(); aisleHover.set(i); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { aisleHover.set(-1); document.body.style.cursor = '' }}
        onClick={(e) => { e.stopPropagation(); aisleState.added = i; aisleState.onAdd?.(i) }}
        userData={{ i }}
      >
        <JarAddClock addT={addT} i={i} />
        <mesh material={shared.glass}><latheGeometry args={[glassProfile, 40]} /></mesh>
        <mesh material={fill}><latheGeometry args={[fillProfile, 40]} /></mesh>
        <mesh material={shared.lid}><latheGeometry args={[lidProfile, 40]} /></mesh>
        <mesh position={[0, 1.665, 0]} rotation={[Math.PI / 2, 0, 0]} material={shared.brass}><torusGeometry args={[0.47, 0.02, 6, 40]} /></mesh>
        <mesh position={[0, 0.5, 0]} rotation={[0, -1.0, 0]}>
          <cylinderGeometry args={[0.658, 0.658, 0.78, 24, 1, true, 0, 2.0]} />
          <meshStandardMaterial map={label} roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

// listens for add events targeting this jar to start its hop clock
function JarAddClock({ addT, i }) {
  useFrame((s) => { if (aisleState.added === i) { addT.current = s.clock.elapsedTime; aisleState.added = -1 } })
  return null
}

function Rig({ count, reduced, mobile }) {
  const pS = useRef(0)
  const glow = useRef()
  useFrame((state, dt) => {
    dt = Math.min(dt, 0.05)
    const target = reduced ? aisleState.manual ?? aisleState.p : aisleState.p
    const prev = pS.current
    pS.current = damp(pS.current, target, 6, dt)
    const total = (count - 1) * SP
    const camX = -0.15 + pS.current * (total + 0.3)
    const vel = Math.abs(pS.current - prev) / Math.max(dt, 1e-4) * (total) * 0.25
    aisleState.vel = damp(aisleState.vel || 0, vel, 8, dt)
    aisleState.camX = camX
    const asp = state.size.width / state.size.height
    const W = mobile || asp < 0.9 ? 4.6 : 8.6
    const z = W / (2 * Math.tan(THREE.MathUtils.degToRad(17.5)) * asp)
    state.camera.position.set(camX, 1.15, z)
    state.camera.lookAt(camX, 1.0, 0)
    if (glow.current) glow.current.position.x = camX
    // nearest jar
    const near = Math.min(count - 1, Math.max(0, Math.round(camX / SP)))
    aisleFocus.set(near)
  })
  return (
    <mesh ref={glow} position={[0, 1.3, -1.1]}>
      <planeGeometry args={[9, 6]} />
      <meshBasicMaterial map={useMemo(() => makeGlow(), [])} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

function Scene({ products, mobile, reduced }) {
  const shared = useMemo(() => {
    const glass = new THREE.MeshPhysicalMaterial({ color: '#fff4e0', transparent: true, opacity: 0.2, roughness: 0.04, metalness: 0, envMapIntensity: 1.8, side: THREE.FrontSide, depthWrite: false, specularIntensity: 1, clearcoat: 0 })
    return {
      glass,
      lid: new THREE.MeshPhysicalMaterial({ color: '#6a3a22', roughness: 0.4, metalness: 0.1, clearcoat: 0.6, clearcoatRoughness: 0.35 }),
      brass: new THREE.MeshStandardMaterial({ color: '#c8932f', metalness: 1, roughness: 0.35 }),
      speckle: makeSpeckle(),
      wood: makeWood(1024, 256), wall: makeWall(),
    }
  }, [mobile])
  const n = products.length
  const W = (n - 1) * SP + 14
  const cx = ((n - 1) * SP) / 2
  const wood = useMemo(() => { const t = shared.wood; t.wrapS = THREE.RepeatWrapping; t.repeat.set(W / 4, 1); return t }, [shared, W])
  const wall = useMemo(() => { const t = shared.wall; t.repeat.set(W / 3, 2); return t }, [shared, W])
  const top = useMemo(() => Array.from({ length: Math.ceil(W / 1.3) }, (_, i) => ({ i, h: 0.8 + ((i * 53) % 7) * 0.08, c: ['#8E3B22', '#C99A2E', '#5C6B33', '#7A4A2A', '#A6422A'][i % 5] })), [W])
  return (
    <>
      <Rig count={n} reduced={reduced} mobile={mobile} />
      {/* back wall */}
      <mesh position={[cx, 2, -1.3]}><planeGeometry args={[W, 8]} /><meshStandardMaterial map={wall} roughness={0.95} /></mesh>
      {/* shelves */}
      <mesh position={[cx, -0.12, -0.2]}><boxGeometry args={[W, 0.24, 1.9]} /><meshStandardMaterial map={wood} roughness={0.7} /></mesh>
      <mesh position={[cx, -0.65, -0.4]}><boxGeometry args={[W, 0.9, 1.5]} /><meshStandardMaterial color="#2a160d" roughness={0.9} /></mesh>
      <mesh position={[cx, 2.62, -0.45]}><boxGeometry args={[W, 0.16, 1.2]} /><meshStandardMaterial map={wood} roughness={0.7} /></mesh>
      {/* upper shelf: little tins for depth */}
      {top.map((t) => (
        <group key={t.i} position={[t.i * 1.3 - 3, 2.7, -0.55]}>
          <mesh position={[0, t.h / 2, 0]}><cylinderGeometry args={[0.38, 0.38, t.h, 20]} /><meshStandardMaterial color={t.c} roughness={0.55} metalness={0.15} /></mesh>
          <mesh position={[0, t.h + 0.04, 0]}><cylinderGeometry args={[0.4, 0.4, 0.08, 20]} /><meshStandardMaterial color="#d8c9a8" metalness={0.8} roughness={0.35} /></mesh>
          <mesh position={[0, t.h * 0.5, 0]}><cylinderGeometry args={[0.392, 0.392, 0.22, 20]} /><meshStandardMaterial color="#e9d6a8" roughness={0.9} /></mesh>
        </group>
      ))}
      {products.map((p, i) => <Jar key={p.id} p={p} i={i} shared={shared} mobile={mobile} />)}
    </>
  )
}

export default function AisleScene({ products, mobile, reduced, visible }) {
  const [dpr, setDpr] = useState(mobile ? 1.1 : 1.25)
  const [ready, setReady] = useState(false)
  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop={!ready ? 'never' : visible ? 'always' : 'demand'}
      camera={{ fov: 35, position: [0, 1.2, 6], near: 0.5, far: 60 }}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <Prewarm onReady={() => setReady(true)} />
      <color attach="background" args={['#241109']} />
      <ambientLight intensity={0.5} color="#ffd8a8" />
      <spotLight position={[0, 5, 5]} angle={0.9} penumbra={1} intensity={90} color="#ffe2b0" distance={25} />
      <directionalLight position={[-4, 4, 3]} intensity={0.9} color="#ffcf91" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={4} color="#fff0d2" position={[0, 5, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 5, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#ffc47a" position={[-5, 1.5, 3]} rotation={[0, Math.PI / 2, 0]} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#ffe2b8" position={[5, 1.5, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[0, 1, 6]} scale={[8, 3, 1]} />
      </Environment>
      <Scene products={products} mobile={mobile} reduced={reduced} />
    </Canvas>
  )
}
