import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { heroSkus, BRAND } from '../data'
import { tin } from '../scroll'

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

/* ---------- label texture (gold foil on lacquer) ---------- */
function drawLabel(ctx, sku) {
  const W = 1024, H = 512
  ctx.clearRect(0, 0, W, H)
  const gold = '#D9B56A'
  ctx.textAlign = 'center'
  ctx.fillStyle = gold
  ctx.font = '500 30px Cinzel, serif'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '14px'
  ctx.fillText(BRAND.toUpperCase(), W / 2 + 7, 92)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
  ctx.strokeStyle = gold
  ctx.globalAlpha = 0.6
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(W / 2 - 70, 122); ctx.lineTo(W / 2 + 70, 122); ctx.stroke()
  ctx.globalAlpha = 1
  ctx.fillStyle = '#EFE6D4'
  let fs = 82
  ctx.font = `italic 400 ${fs}px "Cormorant Garamond", serif`
  while (ctx.measureText(sku.name).width > 760 && fs > 40) { fs -= 4; ctx.font = `italic 400 ${fs}px "Cormorant Garamond", serif` }
  ctx.fillText(sku.name, W / 2, 232)
  ctx.fillStyle = gold
  ctx.font = '400 38px "Tiro Devanagari Hindi", serif'
  ctx.fillText(sku.native, W / 2, 300)
  ctx.font = '500 22px Cinzel, serif'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '9px'
  ctx.fillStyle = '#B79A5E'
  ctx.fillText(sku.origin.split(',')[0].toUpperCase() + '  ·  ' + sku.weight.toUpperCase(), W / 2 + 4, 392)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
  ctx.fillStyle = sku.accent
  ctx.beginPath(); ctx.arc(W / 2, 442, 11, 0, Math.PI * 2); ctx.fill()
}

/* ---------- procedural geometry ---------- */
function useTinGeometry() {
  return useMemo(() => {
    const bodyPts = [
      [0.0, 0.0], [0.9, 0.0], [0.97, 0.03], [1.0, 0.1], [1.0, 1.62], [0.985, 1.69], [0.94, 1.72], [0.925, 1.66], [0.925, 1.45], [0.0, 1.45],
    ].map(([x, y]) => new THREE.Vector2(x, y))
    const body = new THREE.LatheGeometry(bodyPts, 64)
    const lidPts = [
      [0.0, 0.34], [0.55, 0.335], [0.88, 0.3], [1.0, 0.25], [1.065, 0.2], [1.075, 0.1], [1.06, 0.0], [0.97, 0.0], [0.95, -0.1], [0.9, -0.1], [0.9, -0.02], [0.0, -0.02],
    ].map(([x, y]) => new THREE.Vector2(x, y))
    const lid = new THREE.LatheGeometry(lidPts, 64)
    // spice dune
    const pile = new THREE.SphereGeometry(0.93, 72, 24, 0, Math.PI * 2, 0, Math.PI / 2.6)
    const pa = pile.attributes.position
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i)
      const n = Math.sin(x * 9 + z * 5) * 0.012 + Math.sin(z * 13 - x * 7) * 0.01 + Math.sin(x * 31 + z * 27) * 0.004
      pa.setY(i, y * 0.2 + n)
    }
    pile.computeVertexNormals()
    const label = new THREE.CylinderGeometry(1.004, 1.004, 0.97, 64, 1, true, -Math.PI * 0.31, Math.PI * 0.62)
    const ring = new THREE.CylinderGeometry(1.006, 1.006, 0.05, 96, 1, true)
    const rim = new THREE.TorusGeometry(0.98, 0.022, 12, 96)
    const bead = new THREE.TorusGeometry(0.74, 0.012, 8, 96)
    const bead2 = new THREE.TorusGeometry(0.46, 0.008, 8, 96)
    const knob = new THREE.SphereGeometry(0.11, 32, 16)
    return { body, lid, pile, label, ring, rim, bead, bead2, knob }
  }, [])
}

function Tin({ mobile, reduced }) {
  const g = useTinGeometry()
  const group = useRef(), lid = useRef(), pileMat = useRef(), ringMat = useRef(), light = useRef(), labelMat = useRef()
  const { size } = useThree()
  const canvas = useMemo(() => Object.assign(document.createElement('canvas'), { width: 1024, height: 512 }), [])
  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [canvas])
  const shown = useRef(-1)
  const col = useMemo(() => new THREE.Color(), [])

  const paint = (i) => {
    drawLabel(canvas.getContext('2d'), heroSkus[i])
    tex.needsUpdate = true
    shown.current = i
  }
  useEffect(() => {
    paint(tin.idx)
    document.fonts?.ready.then(() => paint(tin.idx))
    document.fonts?.load('italic 400 80px "Cormorant Garamond"').then(() => paint(tin.idx))
    document.fonts?.load('500 30px Cinzel').then(() => paint(tin.idx))
    // eslint-disable-next-line
  }, [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const k = Math.min(1, dt * 2.2)
    // plume + spice colours follow the active SKU
    tin.colA.lerp(tin.tColA, k)
    tin.colB.lerp(tin.tColB, k)
    tin.pulse *= Math.exp(-dt * 1.2)
    const sku = heroSkus[tin.idx]
    // label swaps when the tin has turned its back (mid-spin) - or immediately if no spin
    const spinDelta = Math.abs(((tin.yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) - 0)
    if (shown.current !== tin.idx && (!tin.spinning || reduced || (spinDelta > 2.4 && spinDelta < 3.9))) paint(tin.idx)
    col.set(sku.spice)
    pileMat.current.color.lerp(col, k)
    col.set(sku.accent)
    ringMat.current.color.lerp(col, k)
    ringMat.current.emissive.lerp(col, k)

    const o = reduced ? 0.75 : tin.open
    const e1 = easeOut(smooth(0, 0.55, o))
    const e2 = smooth(0.35, 1, o)
    lid.current.position.set(e2 * 1.9, 1.72 + e1 * 1.1 + e2 * 0.15, -e2 * 0.5)
    lid.current.rotation.set(0.1 * e2, 0, -0.62 * e2)
    const desktopX = size.width > 800 ? 2.05 : 0
    group.current.position.x += (desktopX - group.current.position.x) * Math.min(1, dt * 3)
    group.current.position.y = (mobile || size.width <= 800 ? -1.15 : -1.2) + Math.sin(t * 0.5) * 0.03
    group.current.rotation.y = -0.42 + tin.yaw + Math.sin(t * 0.18) * 0.08 + tin.progress * 0.5
    light.current.intensity = (0.4 + o * 5.5 + tin.pulse * 4) * (reduced ? 0.8 : 1)
    light.current.color.copy(tin.colB)
  })

  const lacquer = { color: '#0f0b08', metalness: 0.55, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.1 }
  const gold = { color: '#E0B65C', metalness: 1, roughness: 0.2, envMapIntensity: 1.7, clearcoat: 0.3, clearcoatRoughness: 0.2 }
  return (
    <group ref={group} scale={[1, 1.1, 1]}>
      <mesh geometry={g.body}><meshPhysicalMaterial {...lacquer} side={THREE.DoubleSide} /></mesh>
      <mesh geometry={g.label} position={[0, 0.93, 0]}>
        <meshStandardMaterial ref={labelMat} map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={0.75} transparent metalness={0.3} roughness={0.5} depthWrite={false} polygonOffset polygonOffsetFactor={-1} />
      </mesh>
      <mesh geometry={g.ring} position={[0, 0.3, 0]}><meshStandardMaterial ref={ringMat} color="#E8862A" emissive="#E8862A" emissiveIntensity={0.12} roughness={0.45} metalness={0.5} /></mesh>
      <mesh geometry={g.rim} position={[0, 1.7, 0]} rotation={[Math.PI / 2, 0, 0]}><meshPhysicalMaterial {...gold} /></mesh>
      <mesh geometry={g.pile} position={[0, 1.5, 0]}><meshStandardMaterial ref={pileMat} color="#B3270E" roughness={1} metalness={0} /></mesh>
      <group ref={lid} position={[0, 1.72, 0]}>
        <mesh geometry={g.lid}><meshPhysicalMaterial {...gold} side={THREE.DoubleSide} /></mesh>
        <mesh geometry={g.bead} position={[0, 0.33, 0]} rotation={[Math.PI / 2, 0, 0]}><meshPhysicalMaterial {...gold} roughness={0.15} /></mesh>
        <mesh geometry={g.bead2} position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}><meshPhysicalMaterial {...gold} roughness={0.15} /></mesh>
        <mesh geometry={g.knob} position={[0, 0.38, 0]} scale={[1, 0.7, 1]}><meshPhysicalMaterial {...gold} /></mesh>
      </group>
      <pointLight ref={light} position={[0, 2.4, 0.3]} distance={7} decay={1.6} />
      <Plume mobile={mobile} />
    </group>
  )
}

/* ---------- volumetric spice-dust plume ---------- */
const plumeVert = /* glsl */ `
attribute vec4 aSeed;
uniform float uTime, uOpen, uSize, uPx, uH, uPulse;
varying float vA;
varying float vL;
vec3 curl(vec3 p){
  float e = 0.0;
  float a = sin(p.y*1.9 + uTime*0.35) + sin(p.z*2.3 - uTime*0.27);
  float b = sin(p.z*1.7 + uTime*0.31) + sin(p.x*2.1 + uTime*0.22);
  float c = sin(p.x*1.6 - uTime*0.29) + sin(p.y*2.4 + uTime*0.33);
  return vec3(c - b, a - c, b - a);
}
void main(){
  float life = fract(aSeed.x + uTime*(0.045 + aSeed.y*0.05));
  float emit = smoothstep(aSeed.w*0.9, aSeed.w*0.9 + 0.1, uOpen);
  float r = sqrt(aSeed.z) * 0.8;
  float ang = fract(aSeed.w*57.3 + aSeed.x*13.1) * 6.2831;
  vec3 p = vec3(cos(ang)*r, 0.0, sin(ang)*r);
  p.xz *= 1.0 + life*1.0;
  p.y = life * uH * (0.6 + 0.4*aSeed.y);
  vec3 cv = curl(vec3(p.x*0.7, p.y*0.45, p.z*0.7) + aSeed.z*5.0);
  p += cv * (life*life) * 1.15;
  p.x += sin(life*5.0 + aSeed.w*8.0) * life * 0.35;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float fade = smoothstep(0.0, 0.06, life) * (1.0 - smoothstep(0.45, 1.0, life));
  vA = fade * emit * (0.55 + uPulse*0.5);
  vL = life;
  gl_PointSize = uSize * (0.55 + aSeed.y) * (1.0 + life*2.2) * uPx / -mv.z;
}`
const plumeFrag = /* glsl */ `
uniform vec3 uColA, uColB;
varying float vA;
varying float vL;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float s = exp(-d*d*14.0);
  vec3 col = mix(uColB, uColA, smoothstep(0.0, 0.8, vL));
  gl_FragColor = vec4(col * 1.25, s * vA * 0.5);
}`

function Plume({ mobile }) {
  const N = mobile ? 2500 : 5000
  const [geo, mat] = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const seed = new Float32Array(N * 4)
    for (let i = 0; i < N * 4; i++) seed[i] = Math.random()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4))
    const m = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 }, uOpen: { value: 0 }, uSize: { value: mobile ? 56 : 72 }, uPx: { value: 1 }, uH: { value: 3.9 }, uPulse: { value: 0 },
        uColA: { value: tin.colA }, uColB: { value: tin.colB },
      },
      vertexShader: plumeVert, fragmentShader: plumeFrag,
    })
    return [g, m]
  }, [N, mobile])
  useEffect(() => () => { geo.dispose(); mat.dispose() }, [geo, mat])
  useFrame((s) => {
    const u = mat.uniforms
    u.uTime.value = s.clock.elapsedTime
    u.uPx.value = s.gl.getPixelRatio()
    u.uOpen.value = THREE.MathUtils.lerp(u.uOpen.value, Math.max(0, (tin.open - 0.15) / 0.85), 0.06)
    u.uPulse.value = tin.pulse
  })
  return <points geometry={geo} material={mat} position={[0, 1.55, 0]} frustumCulled={false} />
}

function Rig() {
  const { camera, size } = useThree()
  useFrame((s, dt) => {
    const narrow = size.width <= 800
    const target = narrow ? [0, 3.2, 11.5] : [0, 2.2, 8.8]
    camera.position.x += (target[0] + s.pointer.x * 0.25 - camera.position.x) * Math.min(1, dt * 2)
    camera.position.y += (target[1] + s.pointer.y * 0.15 - camera.position.y) * Math.min(1, dt * 2)
    camera.position.z += (target[2] - camera.position.z) * Math.min(1, dt * 2)
    camera.lookAt(narrow ? 0 : 0.9, narrow ? 1.3 : 0.75, 0)
  })
  return null
}

function Invalidator() {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    const f = () => invalidate()
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [invalidate])
  return null
}

export default function TinScene({ active, mobile, reduced }) {
  return (
    <Canvas
      dpr={[1, 1.15]}
      frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
      gl={{ antialias: !mobile, stencil: false, powerPreference: 'high-performance', alpha: true }}
      camera={{ position: [0, 3, 8.8], fov: 32, near: 0.1, far: 50 }}
      aria-hidden="true"
    >
      <Environment resolution={256} frames={1} background={false}>
        <color attach="background" args={['#050403']} />
        <Lightformer form="rect" intensity={5} color="#ffd9a0" position={[-5, 4, 3]} scale={[7, 3, 1]} rotation-y={Math.PI / 3.5} />
        <Lightformer form="rect" intensity={3} color="#fff1da" position={[0, 7, 0]} rotation-x={Math.PI / 2} scale={[9, 5, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#e8862a" position={[6, 1.5, -3]} rotation-y={-Math.PI / 2.4} scale={[6, 1.2, 1]} />
        <Lightformer form="circle" intensity={2} color="#ffffff" position={[0, 2, -7]} scale={4} />
        <Lightformer form="ring" intensity={1.5} color="#ffcf90" position={[3, 3, 5]} scale={3} />
      </Environment>
      <ambientLight intensity={0.12} />
      <spotLight position={[-4, 7, 5]} angle={0.5} penumbra={1} intensity={90} color="#ffd9a8" decay={2} />
      <Tin mobile={mobile} reduced={reduced} />
      <Rig />
      {reduced && <Invalidator />}
      {false && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.7} luminanceThreshold={0.55} luminanceSmoothing={0.4} mipmapBlur radius={0.7} resolutionScale={0.5} />
          <Vignette eskil={false} offset={0.28} darkness={0.7} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
