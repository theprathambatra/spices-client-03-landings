import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, MeshTransmissionMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'
import { isMobile, reduced } from '../lib/util'

const QUAD_VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`
const ADVECT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVel, uSrc; uniform float uDt, uDiss, uAspect, uMode, uTime;
  uniform vec4 uS0, uS1; // xy = point, zw = vel (uMode 0) 
  uniform vec3 uCol0, uCol1; uniform float uRad;
  float splat(vec2 uv, vec2 pt){ vec2 d = uv - pt; d.x *= uAspect; return exp(-dot(d, d) / uRad); }
  void main(){
    vec2 vel = texture2D(uVel, vUv).xy;
    vec2 co = vUv - uDt * vel;
    vec4 s = texture2D(uSrc, co);
    // viscosity-ish blur for velocity
    if (uMode < .5) {
      vec2 t = vec2(1./192.);
      s = s * .6 + .1 * (texture2D(uSrc, co + vec2(t.x,0.)) + texture2D(uSrc, co - vec2(t.x,0.)) + texture2D(uSrc, co + vec2(0.,t.y)) + texture2D(uSrc, co - vec2(0.,t.y)));
      // swirl turbulence
      vec2 q = vUv * 5. + uTime * .1;
      float e=.05; float n1=sin(q.x*3.1+uTime*.4)*cos(q.y*2.7-uTime*.3); float n2=sin((q.x+e)*3.1+uTime*.4)*cos(q.y*2.7-uTime*.3); float n3=sin(q.x*3.1+uTime*.4)*cos((q.y+e)*2.7-uTime*.3); s.xy += vec2(n3-n1, -(n2-n1)) / e * .004;
    }
    s *= uDiss;
    float g0 = splat(vUv, uS0.xy), g1 = splat(vUv, uS1.xy);
    if (uMode < .5) { s.xy += uS0.zw * g0 + uS1.zw * g1; }
    else { s += vec4(uCol0 * g0 + uCol1 * g1, (g0 * step(.0001, length(uCol0)) + g1 * step(.0001, length(uCol1)))) * .9; }
    gl_FragColor = s;
  }
`
const DISPLAY_FRAG = /* glsl */ `
  varying vec2 vUv; uniform sampler2D uDye; uniform vec3 uBg;
  void main(){
    vec4 d = texture2D(uDye, vUv);
    float a = clamp(d.a, 0., 3.);
    vec3 col = d.rgb / max(d.a, .001);
    float dens = 1. - exp(-a * 1.7);
    vec3 c = mix(uBg, col, clamp(dens * 1.15, 0., .96));
    // lab contour lines
    float iso = abs(fract(a * 2.2) - .5);
    float line = (1. - smoothstep(.0, .035, iso)) * smoothstep(.04, .2, a) * .22;
    c = mix(c, vec3(.06,.07,.08), line);
    // fine grid
    vec2 g = abs(fract(vUv * vec2(40., 22.)) - .5);
    c -= (1. - smoothstep(0., .02, min(g.x, g.y))) * .025;
    gl_FragColor = vec4(c, 1.);
  }
`

function Ink({ color, still, active }) {
  const { gl, camera, pointer, size } = useThree()
  const mesh = useRef()
  const state = useRef({ last: new THREE.Vector2(), has: false, t: 0, flip: 0, lastCol: null })
  const rig = useMemo(() => {
    const res = 192
    const mk = () => new THREE.WebGLRenderTarget(res, res, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false, wrapS: THREE.ClampToEdgeWrapping })
    const vel = [mk(), mk()], dye = [mk(), mk()]
    const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const u = {
      uVel: { value: null }, uSrc: { value: null }, uDt: { value: 0.016 }, uDiss: { value: 0.99 }, uAspect: { value: 1.6 }, uMode: { value: 0 }, uTime: { value: 0 },
      uS0: { value: new THREE.Vector4(-1, -1, 0, 0) }, uS1: { value: new THREE.Vector4(-1, -1, 0, 0) },
      uCol0: { value: new THREE.Vector3() }, uCol1: { value: new THREE.Vector3() }, uRad: { value: 0.0016 },
    }
    const mat = new THREE.ShaderMaterial({ vertexShader: QUAD_VERT, fragmentShader: ADVECT, uniforms: u, depthTest: false })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat)
    quad.frustumCulled = false
    scene.add(quad)
    return { vel, dye, scene, cam, u, flip: 0 }
  }, [])
  useEffect(() => () => { rig.vel.forEach((r) => r.dispose()); rig.dye.forEach((r) => r.dispose()) }, [rig])

  const dyeCol = useMemo(() => new THREE.Color(), [])
  useEffect(() => { dyeCol.set(color) }, [color, dyeCol])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  // fill viewport at z = -2.2
  const dist = camera.position.z + 2.2
  const h = 2 * Math.tan((camera.fov * Math.PI) / 360) * dist
  const w = h * (size.width / size.height)

  useFrame((s, dt) => {
    if (!active) return
    dt = Math.min(dt, 0.05)
    const st = state.current, u = rig.u
    const px = (pointer.x + 1) / 2, py = (pointer.y + 1) / 2
    let sp = new THREE.Vector4(-1, -1, 0, 0)
    const moved = st.has ? Math.hypot(px - st.last.x, py - st.last.y) : 0
    if (st.has && moved > 0.0005) sp.set(px, py, (px - st.last.x) * 55, (py - st.last.y) * 55)
    st.last.set(px, py); st.has = pointer.x !== 0 || pointer.y !== 0
    // idle auto-stirring
    const T = s.clock.elapsedTime
    const idle = still ? new THREE.Vector4(-1, -1, 0, 0) : new THREE.Vector4(0.59 + Math.sin(T * 0.9) * 0.15, 0.5 + Math.cos(T * 1.1) * 0.22, Math.cos(T * 0.7) * 2.4, -Math.sin(T * 0.9) * 2.4)
    u.uS0.value.copy(sp); u.uS1.value.copy(idle)
    tmp.set(dyeCol.r, dyeCol.g, dyeCol.b)
    // colour in sRGB for display
    const c = dyeCol.clone().convertLinearToSRGB()
    u.uCol0.value.set(sp.x > -1 ? c.r * 1.6 : 0, sp.x > -1 ? c.g * 1.6 : 0, sp.x > -1 ? c.b * 1.6 : 0)
    u.uCol1.value.set(c.r * 1.0, c.g * 1.0, c.b * 1.0)
    u.uTime.value = T; u.uDt.value = dt * 1.0; u.uAspect.value = size.width / size.height
    const prev = gl.getRenderTarget()
    const f = rig.flip, n = 1 - f
    // velocity
    u.uMode.value = 0; u.uDiss.value = 0.982; u.uRad.value = 0.0035
    u.uVel.value = rig.vel[f].texture; u.uSrc.value = rig.vel[f].texture
    gl.setRenderTarget(rig.vel[n]); gl.render(rig.scene, rig.cam)
    // dye
    u.uMode.value = 1; u.uDiss.value = 0.9988; u.uRad.value = 0.0045
    u.uVel.value = rig.vel[n].texture; u.uSrc.value = rig.dye[f].texture
    gl.setRenderTarget(rig.dye[n]); gl.render(rig.scene, rig.cam)
    gl.setRenderTarget(prev)
    rig.flip = n
    mesh.current.material.uniforms.uDye.value = rig.dye[n].texture
  })

  return (
    <mesh ref={mesh} position={[0, 0, -2.2]} scale={[w, h, 1]}>
      <planeGeometry />
      <shaderMaterial vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`}
        fragmentShader={DISPLAY_FRAG} uniforms={{ uDye: { value: null }, uBg: { value: new THREE.Vector3(0.933, 0.941, 0.918) } }} />
    </mesh>
  )
}

function labelTexture(spice) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 640
  const g = c.getContext('2d')
  g.fillStyle = '#EEF0EA'; g.fillRect(0, 0, 512, 640)
  g.fillStyle = spice.color; g.fillRect(0, 0, 512, 56); g.fillRect(0, 584, 512, 56)
  g.fillStyle = '#0F1113'
  g.font = '700 30px "JetBrains Mono", monospace'; g.fillText('KESARI/LAB', 36, 112)
  g.font = '500 22px "JetBrains Mono", monospace'; g.fillStyle = '#6B7177'; g.fillText('SINGLE ORIGIN · ' + spice.origin.toUpperCase(), 36, 150)
  g.fillStyle = '#0F1113'; g.font = '700 64px "Space Grotesk", sans-serif'
  const words = spice.name.split(' ')
  words.slice(0, 3).forEach((w, i) => g.fillText(w, 36, 250 + i * 66))
  g.font = '500 22px "JetBrains Mono", monospace'; g.fillStyle = '#6B7177'
  g.fillText(spice.spec, 36, 500); g.fillText('LOT ' + spice.lot, 36, 534)
  g.fillStyle = '#0F1113'; g.fillRect(380, 440, 96, 96)
  g.fillStyle = '#EEF0EA'; for (let i = 0; i < 36; i++) { const x = i % 6, y = (i / 6) | 0; if ((x * 7 + y * 13 + spice.name.length) % 3 === 0) g.fillRect(386 + x * 14.5, 446 + y * 14.5, 12, 12) }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4
  return t
}

function Jar({ spice, mobile, still }) {
  const group = useRef()
  const { pointer, size, gl, scene, camera } = useThree()
  useEffect(() => { gl.compileAsync?.(scene, camera).catch(() => {}) }, [gl, scene, camera])
  const glass = useMemo(() => {
    const o = [[0.0, 0], [0.74, 0], [0.9, 0.06], [0.95, 0.16], [0.95, 1.5], [0.88, 1.68], [0.7, 1.78], [0.64, 1.9], [0.64, 2.02]]
    const inner = o.slice().reverse().map(([x, y]) => [Math.max(0, x - 0.07), y + 0.06 * (y < 0.5 ? 1 : 0.0)])
    inner[0] = [0.57, 2.02]
    const pts = [...o.slice(1), ...inner.slice(0, -1), [0, 0.06]]
    return new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 64)
  }, [])
  const powder = useMemo(() => {
    const p = []
    for (let i = 0; i <= 12; i++) { const x = (i / 12) * 0.84; p.push(new THREE.Vector2(x, 0.1 + 0.95 + 0.12 * Math.cos((x / 0.84) * 1.4) - 0.1 * (x / 0.84) ** 2)) }
    const pts = [new THREE.Vector2(0, 0.1), new THREE.Vector2(0.84, 0.1), ...p.reverse()]
    return new THREE.LatheGeometry(pts, 48)
  }, [])
  const tex = useMemo(() => labelTexture(spice), [spice])
  useEffect(() => () => tex.dispose(), [tex])
  useFrame((s, dt) => {
    if (!group.current || still) return
    group.current.rotation.y += ((pointer.x * 0.5) - group.current.rotation.y) * Math.min(1, dt * 3)
    group.current.rotation.x += ((-pointer.y * 0.18) - group.current.rotation.x) * Math.min(1, dt * 3)
  })
  const sc = size.width < 700 ? 0.7 : 0.82
  const ox = size.width < 900 ? 0 : 0.75
  return (
    <Float speed={still ? 0 : 1.4} rotationIntensity={0.12} floatIntensity={0.5}>
      <group ref={group} scale={sc} position={[ox, -1.05 * sc, 0]}>
        <mesh geometry={glass}>
          <MeshTransmissionMaterial transmission={1} thickness={0.45} roughness={0.04} ior={1.45} chromaticAberration={mobile ? 0.03 : 0.05}
            anisotropicBlur={0.02} distortion={0.1} distortionScale={0.4} temporalDistortion={still ? 0 : 0.08}
            samples={3} resolution={256} backside envMapIntensity={0.6} color="#ffffff" attenuationColor="#ffffff" attenuationDistance={4} />
        </mesh>
        <mesh geometry={powder}><meshStandardMaterial color={spice.color} roughness={0.95} metalness={0} /></mesh>
        {/* lid */}
        <mesh position={[0, 2.12, 0]}><cylinderGeometry args={[0.74, 0.74, 0.34, 56]} /><meshStandardMaterial color="#0F1113" roughness={0.35} metalness={0.6} /></mesh>
        <mesh position={[0, 2.31, 0]}><cylinderGeometry args={[0.7, 0.74, 0.06, 56]} /><meshStandardMaterial color="#C6FF3D" roughness={0.4} metalness={0.2} /></mesh>
        {/* label */}
        <mesh position={[0, 0.82, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.975, 0.975, 0.96, 48, 1, true, -0.95, 1.9]} />
          <meshStandardMaterial map={tex} roughness={0.7} side={THREE.FrontSide} />
        </mesh>
      </group>
    </Float>
  )
}

export default function RefractionJar({ spice, active }) {
  const mobile = useMemo(isMobile, [])
  const still = useMemo(reduced, [])
  return (
    <Canvas dpr={mobile ? [1, 1.25] : [1, 1.5]} frameloop={active ? 'always' : 'demand'} camera={{ position: [0, 0.3, 9.5], fov: 30 }}
      gl={{ antialias: !mobile, powerPreference: 'high-performance' }} style={{ touchAction: 'pan-y' }}>
      <Ink color={spice.color} still={still} active={active} />
      <Jar spice={spice} mobile={mobile} still={still} />
      <Environment resolution={128} frames={1}>
        <color attach="background" args={['#cfd3d0']} />
        <Lightformer form="rect" intensity={1.4} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={0.9} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={0.9} position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={2} color="#C6FF3D" position={[0, 0, -4]} scale={4} />
      </Environment>
      <ambientLight intensity={0.35} />
    </Canvas>
  )
}
