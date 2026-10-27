import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { buildLayer, drawInterior, lanternSpots, INTERIOR_Z, DOOR, GROUND_Y, LAYERS } from '../art/bazaar'
import { hero, pointer } from './scrollState'
import { useInView, isCoarse, prefersReduced } from './useInViewFlag'

const FOV = 38
const TAN = Math.tan((FOV * Math.PI) / 360)
const Z0 = 10
const CAM_END = -24.6
const OVER = 1.2
const planeH = (z) => 2 * TAN * (Z0 - z) * OVER
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d'); const r = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  r.addColorStop(0, 'rgba(255,230,160,1)'); r.addColorStop(0.25, 'rgba(255,170,70,.55)'); r.addColorStop(1, 'rgba(255,120,40,0)')
  g.fillStyle = r; g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}

function Scene({ reduced, mobile }) {
  const { size, camera, invalidate } = useThree()
  const aspect = Math.round(Math.min(2, Math.max(0.5, size.width / size.height)) * 4) / 4
  const [data, setData] = useState(null)
  const mats = useRef([])
  const lights = useRef([])
  const glows = useRef([])
  const dust = useRef()
  const sp = useRef(reduced ? 0.05 : 0)
  const glowTex = useMemo(glowTexture, [])

  useEffect(() => {
    // build textures one layer per task so no single long task blocks the main thread
    let alive = true, i = 0
    const H = mobile ? 440 : 600
    const made = []
    const mk = (c) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 2; return t }
    const step = () => {
      if (!alive) return
      if (i < LAYERS.length) {
        const l = buildLayer(i, aspect, H)
        made.push({ ...l, tex: mk(l.canvas) }); i++
        setData({ layers: made.slice(), it: null }); invalidate()
      } else {
        const it = mk(drawInterior(mobile ? 640 : 1024, mobile ? 640 : 1024))
        setData({ layers: made.slice(), it }); invalidate(); return
      }
      setTimeout(step, 90)
    }
    const id = setTimeout(step, 60)
    return () => { alive = false; clearTimeout(id); made.forEach((l) => l.tex.dispose()) }
  }, [aspect, mobile, invalidate])

  const dustPos = useMemo(() => {
    const n = mobile ? 30 : 60
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) { a[i * 3] = (Math.random() - 0.5) * 20; a[i * 3 + 1] = (Math.random() - 0.5) * 14; a[i * 3 + 2] = 6 - Math.random() * 32 }
    return a
  }, [mobile])

  const doorY = (0.5 - (GROUND_Y - DOOR.h / 2) / 1000) * planeH(-28)
  const lanternZ = LAYERS.find((l) => l.id === 'lanterns').z
  const lanternH = planeH(lanternZ)
  const lanternW = lanternH * aspect
  const spotW = useMemo(
    () => lanternSpots(aspect * 1000).map((s) => [(s.x / (aspect * 1000) - 0.5) * lanternW, (0.5 - s.y / 1000) * lanternH, s.col]),
    [aspect, lanternW, lanternH],
  )
  const lightCount = 2
  const glowCount = mobile ? 4 : 6

  useFrame((state, dt) => {
    if (!data) return
    const t = state.clock.elapsedTime
    if (!reduced) {
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3)
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3)
      sp.current += (hero.p - sp.current) * Math.min(1, dt * 4.5)
    }
    const p = sp.current
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
    const k = p * 0.3 + e * 0.7
    const z = Z0 + (CAM_END - Z0) * k
    const y = doorY * smooth(0.25, 1, k) + 0.15 * Math.sin(t * 0.4)
    const par = 1 - smooth(0.6, 1, p) * 0.6
    camera.position.set(pointer.x * 0.9 * par, y + pointer.y * 0.45 * par, z)
    camera.lookAt(pointer.x * 0.25 * par, y + pointer.y * 0.12 * par, z - 12)
    // fade layers we are about to pass through
    data.layers.forEach((l, i) => {
      const m = mats.current[i]; if (!m) return
      const dist = z - l.z
      const o = i === 0 ? 1 : smooth(0.6, 4.2, dist)
      m.opacity = o; m.visible = o > 0.01
      if (i === 0) m.visible = true
    })
    // lanterns: flicker lights + glows
    for (let i = 0; i < glowCount; i++) {
      const L = lights.current[i]
      const f = 1 + 0.14 * Math.sin(t * 7 + i * 2.3) + 0.08 * Math.sin(t * 13.1 + i * 5.1) + 0.05 * Math.sin(t * 23 + i)
      if (L) L.intensity = (reduced ? 1 : f) * 34
      const g = glows.current[i]
      if (g) { g.scale.setScalar(2.4 * (0.95 + 0.07 * f)); g.material.opacity = 0.55 * smooth(0.6, 4.2, z - lanternZ) }
    }
    if (dust.current && !reduced) {
      const a = dust.current.geometry.attributes.position
      for (let i = 0; i < a.count; i++) {
        let yy = a.getY(i) + dt * (0.25 + (i % 5) * 0.06)
        if (yy > 7) yy = -7
        a.setY(i, yy); a.setX(i, a.getX(i) + Math.sin(t * 0.6 + i) * dt * 0.25)
      }
      a.needsUpdate = true
    }
  })

  if (!data) return null
  return (
    <>
      <ambientLight intensity={0.9} />
      {data.layers.map((l, i) => {
        const H = planeH(l.z), Wd = H * l.aspect
        return (
          <mesh key={l.id} position={[0, 0, l.z]} scale={[Wd, H, 1]} renderOrder={i}>
            {i === 0 ? (
              <meshBasicMaterial ref={(m) => (mats.current[i] = m)} map={l.tex} toneMapped={false} />
            ) : (
              <meshStandardMaterial
                ref={(m) => (mats.current[i] = m)} map={l.tex} emissiveMap={l.tex} emissive="#ffffff" emissiveIntensity={0.62}
                roughness={1} metalness={0} transparent depthWrite={false} toneMapped={false}
              />
            )}
            <planeGeometry />
          </mesh>
        )
      })}
      {data.it && (
        <mesh position={[0, doorY, INTERIOR_Z]} scale={[8, 8, 1]} renderOrder={3}>
          <planeGeometry />
          <meshBasicMaterial map={data.it} toneMapped={false} />
        </mesh>
      )}
      {[1, 3].map((k, i) => spotW[k] && <pointLight key={'l' + k} ref={(r) => (lights.current[i] = r)} position={[spotW[k][0], spotW[k][1], lanternZ + 1.2]} color={spotW[k][2]} distance={26} decay={1.4} intensity={34} />)}
      {spotW.slice(0, glowCount).map(([x, y], i) => (
        <sprite key={i} ref={(r) => (glows.current[i] = r)} position={[x, y, lanternZ + 0.05]} renderOrder={20}>
          <spriteMaterial map={glowTex} blending={THREE.AdditiveBlending} transparent depthWrite={false} toneMapped={false} />
        </sprite>
      ))}
      <points ref={dust} frustumCulled={false} renderOrder={30}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[dustPos, 3]} /></bufferGeometry>
        <pointsMaterial map={glowTex} size={0.22} color="#FFC857" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation toneMapped={false} />
      </points>
    </>
  )
}

export default function BazaarDiorama({ className }) {
  const wrap = useRef(null)
  const inView = useInView(wrap, '100px')
  const reduced = useMemo(prefersReduced, [])
  const mobile = useMemo(() => isCoarse() || innerWidth < 760, [])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced) return
    const move = (e) => { pointer.tx = (e.clientX / innerWidth - 0.5) * 2; pointer.ty = -(e.clientY / innerHeight - 0.5) * 2 }
    const tilt = (e) => {
      if (e.gamma == null) return
      pointer.tx = Math.max(-1, Math.min(1, e.gamma / 25)); pointer.ty = Math.max(-1, Math.min(1, ((e.beta || 45) - 45) / -25))
    }
    addEventListener('pointermove', move, { passive: true })
    addEventListener('deviceorientation', tilt, { passive: true })
    return () => { removeEventListener('pointermove', move); removeEventListener('deviceorientation', tilt) }
  }, [reduced])

  return (
    <div ref={wrap} className={className} style={{ opacity: ready ? 1 : 0, transition: 'opacity .8s' }}>
      <Canvas
        dpr={[1, mobile ? 1.25 : 1.5]}
        frameloop={reduced ? 'demand' : inView ? 'always' : 'never'}
        camera={{ fov: FOV, near: 0.1, far: 140, position: [0, 0, Z0] }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        flat
        onCreated={() => setTimeout(() => setReady(true), 250)}
        aria-label="Illustrated paper-cut spice bazaar"
      >
        <color attach="background" args={['#1E1B5E']} />
        <Scene reduced={reduced} mobile={mobile} />
      </Canvas>
    </div>
  )
}
