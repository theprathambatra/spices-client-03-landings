import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useInView, isCoarse, prefersReduced } from './useInViewFlag'

const R = 1.46 // ring radius for the six outer katoris
const TAU = Math.PI * 2

/* ---------- procedural textures ---------- */
function engravedTexture() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#808080'; g.fillRect(0, 0, 1024, 512)
  const line = (y, w, v) => { g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(0, y, 1024, w) }
  // bands (v along profile: top surface occupies ~0.05..0.5)
  for (const [y, w, v] of [[40, 3, 230], [48, 3, 30], [96, 2, 230], [102, 2, 30], [150, 6, 220], [166, 3, 40], [190, 2, 230], [200, 2, 40], [226, 8, 235], [246, 3, 30]]) line(y, w, v)
  // diamond petals around rim region
  for (let i = 0; i < 48; i++) {
    const x = (i + 0.5) * (1024 / 48)
    g.fillStyle = '#e8e8e8'
    g.beginPath(); g.moveTo(x, 110); g.lineTo(x + 12, 128); g.lineTo(x, 146); g.lineTo(x - 12, 128); g.fill()
    g.fillStyle = '#202020'
    g.beginPath(); g.arc(x, 128, 3, 0, 7); g.fill()
    g.fillStyle = '#d8d8d8'
    g.beginPath(); g.arc(x, 66, 3.2, 0, 7); g.fill()
    g.beginPath(); g.moveTo(x - 10, 214); g.quadraticCurveTo(x, 190, x + 10, 214); g.fill()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = THREE.RepeatWrapping; t.anisotropy = 4
  return t
}

function grainTexture(hex) {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d')
  g.fillStyle = hex; g.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 700; i++) {
    const l = Math.random()
    g.fillStyle = l > 0.5 ? `rgba(255,240,200,${Math.random() * 0.22})` : `rgba(0,0,0,${Math.random() * 0.3})`
    g.fillRect(Math.random() * 128, Math.random() * 128, 1 + Math.random() * 2, 1 + Math.random() * 2)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

function tableTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 768
  const g = c.getContext('2d'); g.scale(0.75, 0.75); g.translate(512, 512)
  const rg = g.createRadialGradient(0, 0, 40, 0, 0, 512)
  rg.addColorStop(0, '#3a1260'); rg.addColorStop(0.7, '#25104f'); rg.addColorStop(1, '#150a38')
  g.fillStyle = rg; g.fillRect(-512, -512, 1024, 1024)
  g.strokeStyle = 'rgba(247,166,20,.55)'
  for (const [r, w, d] of [[500, 4, []], [470, 1.5, [4, 8]], [330, 2, []], [300, 1.5, [2, 7]], [200, 2, []]]) { g.lineWidth = w; g.setLineDash(d); g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke() }
  g.setLineDash([])
  for (let ring = 0; ring < 3; ring++) {
    const n = [16, 24, 32][ring], r0 = [260, 360, 430][ring], len = [60, 46, 36][ring]
    for (let i = 0; i < n; i++) {
      g.save(); g.rotate((i / n) * TAU); g.translate(0, -r0)
      g.fillStyle = ['#D81B76', '#F7A614', '#0D8E9B'][ring]
      g.globalAlpha = 0.55
      g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(len * 0.5, -len * 0.5, 0, -len); g.quadraticCurveTo(-len * 0.5, -len * 0.5, 0, 0); g.fill()
      g.restore()
    }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4
  return t
}

function softDot() {
  const c = document.createElement('canvas'); c.width = c.height = 64
  const g = c.getContext('2d'); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = r; g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

/* ---------- geometry ---------- */
function plateGeometry() {
  const pts = [[0, 0.0], [1.7, 0.0], [2.0, 0.015], [2.2, 0.07], [2.36, 0.19], [2.45, 0.31], [2.5, 0.395], [2.48, 0.44], [2.43, 0.43], [2.41, 0.38], [2.35, 0.26], [2.2, 0.09], [1.95, -0.01], [1.5, -0.04], [0, -0.04]]
  const curve = new THREE.SplineCurve(pts.map(([x, y]) => new THREE.Vector2(x, y)))
  const g = new THREE.LatheGeometry(curve.getPoints(48), 72)
  return g
}
function katoriGeometry() {
  const pts = [[0, 0.015], [0.32, 0.015], [0.5, 0.1], [0.62, 0.27], [0.67, 0.42], [0.66, 0.46], [0.62, 0.45], [0.6, 0.38], [0.52, 0.2], [0.34, 0.09], [0, 0.085]]
  const curve = new THREE.SplineCurve(pts.map(([x, y]) => new THREE.Vector2(x, y)))
  return new THREE.LatheGeometry(curve.getPoints(24), 32)
}
function moundGeometry(seed) {
  const g = new THREE.SphereGeometry(0.58, 24, 12, 0, TAU, 0, Math.PI / 2)
  g.scale(1, 0.62, 1)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i)
    const n = Math.sin(x * 9 + seed) * Math.cos(z * 8 - seed) * 0.018 + Math.sin(x * 21 + z * 17 + seed) * 0.007
    p.setY(i, y + (y > 0.01 ? n : 0) )
  }
  g.computeVertexNormals()
  return g
}

/* katori layout: index 0-5 outer, 6 centre */
const katoriPos = (i) => (i === 6 ? [0, 0, 0] : [Math.sin((i / 6) * TAU) * R, 0, Math.cos((i / 6) * TAU) * R])
const katoriAngle = (i) => (i === 6 ? 0 : (i / 6) * TAU)

function Pile({ item, seed, mobile }) {
  const tex = useMemo(() => grainTexture(item.pileColor || item.color), [item])
  const geo = useMemo(() => moundGeometry(seed), [seed])
  const inst = useRef()
  const whole = item.whole
  const n = mobile ? 40 : 64
  useEffect(() => {
    if (!whole || !inst.current) return
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), pos = new THREE.Vector3(), e = new THREE.Euler()
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU, r = Math.sqrt(Math.random()) * 0.5
      const y = Math.sqrt(Math.max(0, 1 - (r / 0.58) ** 2)) * 0.36 * 0.9 + 0.02
      pos.set(Math.cos(a) * r, y, Math.sin(a) * r)
      e.set(Math.random() * 3, Math.random() * 3, Math.random() * 3); q.setFromEuler(e)
      const sc = item.pod ? 1 : 0.8 + Math.random() * 0.4
      s.set(sc, sc * (item.pod ? 1.4 : 1), sc)
      m.compose(pos, q, s); inst.current.setMatrixAt(i, m)
    }
    inst.current.instanceMatrix.needsUpdate = true
  }, [whole, n, item])
  return (
    <group position={[0, 0.07, 0]}>
      <mesh geometry={geo}>
        <meshStandardMaterial map={tex} bumpMap={tex} bumpScale={1.2} roughness={1} metalness={0} color={whole ? '#3a2a20' : '#ffffff'} />
      </mesh>
      {whole && (
        <instancedMesh ref={inst} args={[undefined, undefined, n]}>
          {item.pod ? <capsuleGeometry args={[0.032, 0.05, 4, 8]} /> : <sphereGeometry args={[item.seedSize || 0.04, 10, 8]} />}
          <meshStandardMaterial color={item.color} roughness={item.pod ? 0.6 : 0.5} metalness={0} />
        </instancedMesh>
      )}
    </group>
  )
}

function Steam({ mobile, reduced }) {
  const per = mobile ? 3 : 4
  const total = per * 7
  const tex = useMemo(softDot, [])
  const ref = useRef()
  const st = useMemo(() => Array.from({ length: total }, (_, i) => ({ k: Math.floor(i / per), t: Math.random(), sp: 0.22 + Math.random() * 0.18, ph: Math.random() * 6 })), [total, per])
  const pos = useMemo(() => new Float32Array(total * 3), [total])
  const col = useMemo(() => new Float32Array(total * 3), [total])
  useFrame((s, dt) => {
    if (reduced) return
    const t = s.clock.elapsedTime
    for (let i = 0; i < total; i++) {
      const p = st[i]
      p.t += dt * p.sp; if (p.t > 1) p.t -= 1
      const kp = katoriPos(p.k)
      pos[i * 3] = kp[0] + Math.sin(t * 1.2 + p.ph + p.t * 4) * 0.08 * p.t
      pos[i * 3 + 1] = 0.45 + p.t * 0.95
      pos[i * 3 + 2] = kp[2] + Math.cos(t * 1.0 + p.ph) * 0.07 * p.t
      const a = Math.sin(p.t * Math.PI) * 0.34
      col[i * 3] = a; col[i * 3 + 1] = a * 0.95; col[i * 3 + 2] = a * 0.85
    }
    const g = ref.current.geometry
    g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true
  })
  return (
    <points ref={ref} frustumCulled={false} renderOrder={5}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial map={tex} size={0.55} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  )
}

function Rig({ items, selected, onSelect, reduced, mobile }) {
  const { gl, camera, size } = useThree()
  const plate = useRef()
  const spin = useRef({ rot: 0.3, vel: reduced ? 0 : 0.22, drag: false, lastX: 0, lastT: 0, moved: 0 })
  const look = useRef(new THREE.Vector3(0, 0.2, 0))
  const camT = useRef(new THREE.Vector3())
  const lookT = useRef(new THREE.Vector3())
  const plateGeo = useMemo(plateGeometry, [])
  const katGeo = useMemo(katoriGeometry, [])
  const bump = useMemo(engravedTexture, [])
  const table = useMemo(tableTexture, [])
  const selRef = useRef(selected); selRef.current = selected

  useEffect(() => {
    const el = gl.domElement, S = spin.current
    const down = (e) => { S.drag = true; S.lastX = e.clientX; S.lastT = performance.now(); S.moved = 0; S.vel = 0; try { el.setPointerCapture(e.pointerId) } catch {} }
    const move = (e) => {
      if (!S.drag) return
      const now = performance.now(), dx = e.clientX - S.lastX
      S.moved += Math.abs(dx)
      if (S.moved > 6 && selRef.current != null) onSelect(null)
      const d = dx * 0.0085
      S.rot += d
      S.vel = d / Math.max(0.008, (now - S.lastT) / 1000) * 0.6 + S.vel * 0.4
      S.lastX = e.clientX; S.lastT = now
    }
    const up = () => { S.drag = false; if (Math.abs(S.vel) > 8) S.vel = Math.sign(S.vel) * 8 }
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('pointerleave', up)
    return () => {
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); el.removeEventListener('pointerleave', up)
    }
  }, [gl, onSelect])

  useFrame((s, dt) => {
    const S = spin.current
    const sel = selRef.current
    const portrait = size.width / size.height < 0.9
    if (sel != null) {
      // rotate selected katori to the front, shortest way
      const target = sel === 6 ? S.rot : -katoriAngle(sel)
      let d = ((target - S.rot + Math.PI) % TAU + TAU) % TAU - Math.PI
      S.rot += d * Math.min(1, dt * 4); S.vel = 0
      if (sel === 6) { camT.current.set(0, portrait ? 3.1 : 2.7, portrait ? 3.4 : 2.5); lookT.current.set(portrait ? 0 : 0.5, portrait ? -0.3 : 0.2, 0) }
      else { camT.current.set(0, portrait ? 3.5 : 2.2, portrait ? 5.8 : 4.0); lookT.current.set(portrait ? 0 : 0.55, portrait ? 0.0 : 0.3, 1.2) }
    } else {
      if (!S.drag) {
        S.rot += S.vel * dt
        const idle = reduced ? 0 : 0.18
        S.vel += (idle - S.vel) * (1 - Math.exp(-dt * 0.9)) // inertia decays toward lazy idle spin
      }
      camT.current.set(0, portrait ? 7.4 : 5.6, portrait ? 9.8 : 7.0); lookT.current.set(0, 0.1, 0)
    }
    plate.current.rotation.y = S.rot
    const k = 1 - Math.exp(-dt * 3.2)
    camera.position.lerp(camT.current, k)
    look.current.lerp(lookT.current, k)
    camera.lookAt(look.current)
  })

  return (
    <>
      <group ref={plate}>
        <mesh geometry={plateGeo}>
          <meshStandardMaterial color="#d9a437" metalness={1} roughness={0.3} bumpMap={bump} bumpScale={2.2} roughnessMap={bump} envMapIntensity={1.6} side={THREE.DoubleSide} />
        </mesh>
        {items.map((it, i) => {
          const [x, , z] = katoriPos(i)
          return (
            <group
              key={it.id} position={[x, 0.005, z]}
              onClick={(e) => { e.stopPropagation(); if (e.delta < 6) onSelect(i) }}
              onPointerOver={() => (document.body.style.cursor = 'pointer')}
              onPointerOut={() => (document.body.style.cursor = '')}
            >
              <mesh geometry={katGeo}>
                <meshStandardMaterial color={i % 2 ? '#c9953a' : '#e0b04a'} metalness={1} roughness={0.22} envMapIntensity={1.7} side={THREE.DoubleSide} />
              </mesh>
              <Pile item={it} seed={i * 3.1} mobile={mobile} />
              {selected === i && (
                <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]}>
                  <ringGeometry args={[0.72, 0.78, 64]} />
                  <meshBasicMaterial color="#F7A614" toneMapped={false} />
                </mesh>
              )}
            </group>
          )
        })}
        <Steam mobile={mobile} reduced={reduced} />
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.06, 0]}>
        <circleGeometry args={[4.9, 64]} />
        <meshStandardMaterial map={table} roughness={0.85} metalness={0} />
      </mesh>
      <ContactShadows position={[0, -0.055, 0]} opacity={0.65} scale={8} blur={2.4} far={1.6} resolution={256} frames={1} color="#0a0420" />
    </>
  )
}

export default function BrassThali({ items, selected, onSelect, className }) {
  const wrap = useRef(null)
  const inView = useInView(wrap, '150px')
  const reduced = useMemo(prefersReduced, [])
  const mobile = useMemo(() => isCoarse() || innerWidth < 760, [])
  return (
    <div ref={wrap} className={className} style={{ touchAction: 'pan-y' }}>
      <Canvas
        dpr={[1, mobile ? 1.25 : 1.5]}
        frameloop={reduced ? 'always' : inView ? 'always' : 'never'}
        camera={{ fov: 36, near: 0.1, far: 60, position: [0, 5, 6.2] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        aria-label="Interactive 3D brass thali with seven spice katoris. Drag to spin, tap a bowl to see the spice."
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[-3, 6, 4]} intensity={1.3} color="#ffe2b0" />
        <pointLight position={[0, 3.2, 0]} intensity={14} color="#ffb85c" distance={9} decay={1.6} />
                <Environment resolution={128} frames={1} environmentIntensity={0.9}>
          <color attach="background" args={['#1a0d3d']} />
          <Lightformer form="rect" intensity={5} color="#ffe0a8" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} />
          <Lightformer form="rect" intensity={3} color="#ffb070" position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
          <Lightformer form="rect" intensity={3} color="#9ff4ff" position={[6, 2, -3]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
          <Lightformer form="ring" intensity={4} color="#fff3d0" position={[0, 3, -7]} scale={5} />
          <Lightformer form="rect" intensity={2} color="#ff6aa8" position={[0, 1, 7]} rotation-y={Math.PI} scale={[10, 2, 1]} />
        </Environment>
        <Rig items={items} selected={selected} onSelect={onSelect} reduced={reduced} mobile={mobile} />
      </Canvas>
    </div>
  )
}
