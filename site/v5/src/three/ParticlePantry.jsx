import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { buildTargetsAsync } from './shapes'
import { heroStates } from '../data'
import { isMobile, reduced } from '../lib/util'

const vert = /* glsl */ `
  attribute vec3 aT1; attribute vec3 aT2; attribute vec3 aT3; attribute vec4 aR;
  uniform float uStage, uTime, uSize, uPixel, uFreeze;
  uniform vec3 uMouse; uniform vec3 uShock; uniform vec3 uPal[12];
  varying vec3 vCol; varying float vAlpha;
  #define PI 3.14159265
  vec3 pick(float i, vec3 t0) { return i < 0.5 ? t0 : (i < 1.5 ? aT1 : (i < 2.5 ? aT2 : aT3)); }
  vec3 curl(vec3 p, float t) {
    return vec3(
      sin(p.y * 1.7 + t * .5) + sin(p.z * 2.3 - t * .3) * .6 - cos(p.z * 1.1 + t * .4),
      sin(p.z * 1.9 + t * .4) + sin(p.x * 2.1 + t * .6) * .6 - cos(p.x * 1.3 - t * .3),
      sin(p.x * 1.5 - t * .5) + sin(p.y * 2.6 + t * .2) * .6 - cos(p.y * 1.2 + t * .5));
  }
  vec3 ramp(float s, float g) {
    int b = int(s) * 3;
    return g < .5 ? mix(uPal[b], uPal[b + 1], g * 2.) : mix(uPal[b + 1], uPal[b + 2], g * 2. - 1.);
  }
  void main() {
    float st = clamp(uStage, 0., 2.9999);
    float fi = floor(st), f = st - fi;
    vec3 A = pick(fi, position), B = pick(fi + 1., position);
    float delay = aR.x * .42;
    float t = clamp((f - delay) / .58, 0., 1.);
    t = t * t * (3. - 2. * t);
    vec3 p = mix(A, B, t);
    float k = sin(t * PI);
    p += curl(p * .55 + aR.y * 4., uTime) * k * 1.35;
    p += normalize(p + .001) * k * .5 * aR.z;
    p += (curl(p * 2. + aR.w * 9., uTime * 1.3)) * .012;
    vec4 wp = modelMatrix * vec4(p, 1.);
    // mouse repel
    vec2 d = wp.xy - uMouse.xy; float r = length(d);
    float fm = exp(-r * r * 2.2) * uMouse.z;
    wp.xy += normalize(d + .0001) * fm * .75; wp.z += fm * (aR.z - .5) * 1.5;
    // shockwave ring
    vec2 d2 = wp.xy - uShock.xy; float r2 = length(d2);
    float ring = exp(-pow(r2 - uShock.z * 7., 2.) * 3.) * exp(-uShock.z * 1.6) * step(0., uShock.z);
    wp.xy += normalize(d2 + .0001) * ring * 1.1; wp.z += ring * (aR.y - .5) * 2.;
    vec4 mv = viewMatrix * wp;
    gl_Position = projectionMatrix * mv;
    float sz = uSize * uPixel * (.55 + aR.z * .9) / -mv.z;
    float spark = step(.985, aR.w);
    gl_PointSize = sz * (1. + spark * 1.6 + fm * .8 + ring * 1.2);
    float gA = clamp(A.y * .26 + .5 + (aR.w - .5) * .55 + aR.x * .1, 0., 1.);
    float gB = clamp(B.y * .26 + .5 + (aR.w - .5) * .55 + aR.x * .1, 0., 1.);
    vec3 cA = ramp(fi, gA), cB = ramp(min(fi + 1., 3.), gB);
    vCol = mix(cA, cB, t) + spark * .6 + ring * .5 + fm * .3;
    vAlpha = (.55 + .45 * aR.z) * (1. - k * .25);
  }
`
const frag = /* glsl */ `
  varying vec3 vCol; varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - .5; float d = length(c);
    if (d > .5) discard;
    float a = smoothstep(.5, .05, d) * vAlpha;
    gl_FragColor = vec4(vCol * a, a);
  }
`

function Particles({ stageRef, count, onReady, still }) {
  const ref = useRef()
  const { size, viewport, gl, camera } = useThree()
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0, on: 0, ton: 0 })
  const shock = useRef(-1)
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const ray = useMemo(() => new THREE.Raycaster(), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const [geo, setGeo] = useState(null)

  useEffect(() => {
    let dead = false
    buildTargetsAsync(count, () => dead).then((t) => {
      if (!t || dead) return
      const [t0, t1, t2, t3] = t
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(t0, 3))
      g.setAttribute('aT1', new THREE.BufferAttribute(t1, 3))
      g.setAttribute('aT2', new THREE.BufferAttribute(t2, 3))
      g.setAttribute('aT3', new THREE.BufferAttribute(t3, 3))
      const r = new Float32Array(count * 4)
      for (let i = 0; i < r.length; i++) r[i] = Math.random()
      g.setAttribute('aR', new THREE.BufferAttribute(r, 4))
      g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12)
      setGeo(g); onReady?.()
    })
    return () => { dead = true }
    // eslint-disable-next-line
  }, [count])

  const uniforms = useMemo(() => ({
    uStage: { value: 0 }, uTime: { value: 0 }, uSize: { value: 18 }, uPixel: { value: 1 }, uFreeze: { value: 0 },
    uMouse: { value: new THREE.Vector3(9, 9, 0) }, uShock: { value: new THREE.Vector3(0, 0, -1) },
    uPal: { value: heroStates.flatMap((s) => s.pal.map((c) => new THREE.Vector3(parseInt(c.slice(1, 3), 16) / 255, parseInt(c.slice(3, 5), 16) / 255, parseInt(c.slice(5, 7), 16) / 255))) },
  }), [])

  const material = useMemo(() => new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), [uniforms])
  useEffect(() => () => material.dispose(), [material])

  useEffect(() => {
    const el = gl.domElement
    const rect = () => el.getBoundingClientRect()
    const move = (e) => {
      const r = rect()
      mouse.current.tx = ((e.clientX - r.left) / r.width) * 2 - 1
      mouse.current.ty = -(((e.clientY - r.top) / r.height) * 2 - 1)
      mouse.current.ton = 1
    }
    const leave = () => (mouse.current.ton = 0)
    const down = (e) => {
      move(e)
      shock.current = 0
      const h = world(mouse.current.tx, mouse.current.ty)
      uniforms.uShock.value.set(h.x, h.y, 0)
    }
    const world = (nx, ny) => {
      ray.setFromCamera({ x: nx, y: ny }, camera)
      ray.ray.intersectPlane(plane, hit)
      return hit
    }
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave); el.addEventListener('pointerdown', down)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); el.removeEventListener('pointerdown', down) }
  }, [gl, camera, plane, ray, hit, uniforms])

  useFrame((state, dt) => {
    const u = uniforms
    
    const m = mouse.current
    m.x += (m.tx - m.x) * Math.min(1, dt * 14); m.y += (m.ty - m.y) * Math.min(1, dt * 14)
    m.on += (m.ton - m.on) * Math.min(1, dt * 6)
    ray.setFromCamera({ x: m.x, y: m.y }, camera)
    ray.ray.intersectPlane(plane, hit)
    u.uMouse.value.set(hit.x, hit.y, m.on)
    u.uStage.value += (stageRef.current - u.uStage.value) * Math.min(1, dt * 7)
    if (!still) u.uTime.value = state.clock.elapsedTime
    u.uPixel.value = state.gl.getPixelRatio() * (size.height / 900)
    if (shock.current >= 0) { shock.current += dt; u.uShock.value.z = shock.current; if (shock.current > 3) { shock.current = -1; u.uShock.value.z = -1 } }
    if (ref.current && !still) {
      const mob = size.width < 700
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.45 + m.x * 0.15
      ref.current.rotation.x = m.y * -0.08
      ref.current.position.x = mob ? 0 : viewport.width * 0.05
      ref.current.position.y = mob ? viewport.height * 0.1 : 0
      ref.current.scale.setScalar(mob ? 0.68 : Math.min(0.92, size.height / 800))
    } else if (ref.current) {
      ref.current.position.x = size.width < 700 ? 0 : viewport.width * 0.05
      ref.current.scale.setScalar(size.width < 700 ? 0.68 : Math.min(0.92, size.height / 800))
    }
  })

  if (!geo) return null
  return (
    <points ref={ref} geometry={geo} frustumCulled={false}>
      <primitive object={material} attach="material" />
    </points>
  )
}

export default function ParticlePantry({ stageRef, active, onReady }) {
  const mobile = useMemo(isMobile, [])
  const still = useMemo(reduced, [])
  const count = mobile ? 18000 : 64000
  const [dpr, setDpr] = useState(mobile ? 1.25 : 1.5)
  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 9], fov: 35 }}
      style={{ touchAction: 'pan-y' }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <Particles stageRef={stageRef} count={count} onReady={onReady} still={still} />
    </Canvas>
  )
}
