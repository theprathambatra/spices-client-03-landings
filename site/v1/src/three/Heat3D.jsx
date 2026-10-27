import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { chilliGeo } from './geoms.js'

const TAU = Math.PI * 2
const dummy = new THREE.Object3D()
const C0 = new THREE.Color('#5BC043'), C1 = new THREE.Color('#FFC21A'), C2 = new THREE.Color('#FF7A1A'), C3 = new THREE.Color('#E0201A'), C4 = new THREE.Color('#9B0A22')
function heatColor(h, out) {
  if (h < 0.33) return out.copy(C0).lerp(C1, h / 0.33)
  if (h < 0.55) return out.copy(C1).lerp(C2, (h - 0.33) / 0.22)
  if (h < 0.8) return out.copy(C2).lerp(C3, (h - 0.55) / 0.25)
  return out.copy(C3).lerp(C4, (h - 0.8) / 0.2)
}

const FLAMES = 46
function Scene({ heat, mobile }) {
  const chilli = useRef()
  const body = useRef()
  const flames = useRef()
  const glow = useRef()
  const parts = useMemo(() => chilliGeo('#ffffff', '#2FA36B', true), [])
  const stemMat = useMemo(() => new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.4 }), [])
  const flameGeo = useMemo(() => new THREE.LatheGeometry([[0.001, 0], [0.12, 0.05], [0.18, 0.2], [0.14, 0.38], [0.07, 0.56], [0.001, 0.78]].map(([x, y]) => new THREE.Vector2(x, y)), 10), [])
  const data = useMemo(() => Array.from({ length: mobile ? 40 : FLAMES }, () => ({ a: Math.random() * TAU, r: 0.2 + Math.random() * 0.9, ph: Math.random(), sp: 0.6 + Math.random() * 0.9, s: 0.5 + Math.random() * 0.8 })), [mobile])
  const col = useMemo(() => new THREE.Color(), [])
  const h = useRef(0)
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.15, emissive: new THREE.Color('#5BC043'), emissiveIntensity: 0.1 }), [])

  useFrame((state, dt) => {
    dt = Math.min(dt, 0.05)
    const t = state.clock.elapsedTime
    h.current = THREE.MathUtils.damp(h.current, heat.current, 6, dt)
    const k = h.current
    heatColor(k, col)
    // chilli: tint, tremble, swell
    mat.color.copy(col)
    mat.emissive.copy(col); mat.emissiveIntensity = 0.08 + k * 0.7
    const shake = k * k * 0.07
    chilli.current.position.set(Math.sin(t * 47) * shake, Math.sin(t * 53) * shake * 0.6 + Math.sin(t * 1.3) * 0.08, 0)
    chilli.current.rotation.set(state.pointer.y * -0.25, state.pointer.x * 0.5 + Math.sin(t * 0.8) * 0.15, 0.25 + Math.sin(t * 1.2) * 0.04 + Math.sin(t * 40) * shake * 0.6)
    chilli.current.scale.setScalar(2.2 + k * 0.55 + Math.sin(t * (4 + k * 10)) * 0.03 * k)
    // glow
    glow.current.material.color.copy(col)
    glow.current.material.opacity = 0.08 + k * 0.55
    glow.current.scale.setScalar(5 + k * 3 + Math.sin(t * 6) * 0.15 * k)
    // flames
    const n = data.length
    const active = Math.floor(k * n * 1.05)
    const m = flames.current
    for (let i = 0; i < n; i++) {
      const d = data[i]
      if (i >= active) { dummy.scale.setScalar(0.0001); dummy.position.set(0, 0, 0); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); continue }
      const life = (t * (0.5 + k * 1.1) * d.sp + d.ph) % 1
      const rr = d.r * (1 - life * 0.5)
      dummy.position.set(Math.cos(d.a + life * 1.4) * rr * 1.1, -1.2 + life * (2.4 + k * 1.0), Math.sin(d.a) * 0.3 - 0.4)
      dummy.rotation.set(0, 0, Math.sin(t * 6 + i) * 0.25)
      const s = d.s * (0.35 + k * 0.55) * Math.sin(Math.min(1, life) * Math.PI) * 0.9
      dummy.scale.set(s, s * (1 + k), s)
      dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix)
      // yellow core -> red tips as life increases
      col.set('#FFE066').lerp(new THREE.Color(k > 0.6 ? '#FF3B1F' : '#FF8A1A'), life)
      m.setColorAt(i, col)
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })

  return (
    <>
      <ambientLight intensity={1.3} />
      <directionalLight position={[3, 5, 6]} intensity={2.6} />
      <pointLight position={[0, -1, 2]} intensity={6} color="#ff7a1a" distance={10} />
      <mesh ref={glow} position={[0, 0, -1.5]}>
        <circleGeometry args={[1, 40]} />
        <meshBasicMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <instancedMesh ref={flames} args={[flameGeo, undefined, data.length]} frustumCulled={false}>
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <group ref={chilli}>
        <mesh ref={body} geometry={parts.body} material={mat} />
        <mesh geometry={parts.stem} material={stemMat} />
      </group>
    </>
  )
}

export default function Heat3D({ heat, active, mobile, onReady }) {
  return (
    <Canvas className="heat-canvas" flat dpr={[1, mobile ? 1.25 : 1.5]} frameloop={active ? 'always' : 'never'} camera={{ position: [0, 0, 8], fov: 38 }} gl={{ alpha: true, antialias: false, stencil: false }} onCreated={onReady} aria-hidden="true">
      <Scene heat={heat} mobile={mobile} />
    </Canvas>
  )
}
