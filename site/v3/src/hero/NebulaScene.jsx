import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { hero, pointer } from '../scroll'

const vert = /* glsl */ `
attribute vec3 aRest;
attribute vec4 aSeed;
attribute vec3 aTarget;
attribute float aAlong;
uniform float uTime;
uniform float uMag;
uniform float uTS;
uniform float uBase;
varying vec3 vN;
varying vec3 vW;
varying float vAlong;
varying float vSeed;

mat3 rotZ(float a){ float c=cos(a), s=sin(a); return mat3(c,s,0., -s,c,0., 0.,0.,1.); }
mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }
mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }

void main(){
  float t = uTime;
  vec3 c = aRest;
  c.x += sin(t*0.05*(1.0+aSeed.x)+aSeed.y*6.283)*1.3;
  c.y = mod(c.y + t*(0.10+aSeed.z*0.18) + 9.0, 18.0) - 9.0;
  c.z += sin(t*0.07+aSeed.w*6.283)*0.9;

  float part = step(aSeed.z, 0.82);
  float m = clamp(uMag*1.55 - aSeed.x*0.55, 0.0, 1.0) * part;
  m = m*m*m*(m*(m*6.0-15.0)+10.0);
  vec3 tgt = aTarget * vec3(uTS, uTS, 1.0);
  vec3 mid = mix(c, tgt, m);
  vec3 d = tgt - c;
  mid += vec3(-d.y, d.x, 0.0) * 0.18 * sin(m*3.14159) * (aSeed.y-0.35);

  float spin = t*(0.15+aSeed.y*0.35)*(1.0-m);
  float az = mix(aSeed.y*6.283 + spin, (aSeed.w-0.5)*1.3, m);
  float el = mix((aSeed.z-0.5)*2.6 + spin*0.6, 0.0, m);
  float tw = mix(aSeed.x*6.283 + spin*0.8, 0.0, m);

  float len = (0.30 + aSeed.w*0.38) * mix(1.0, 0.42, m);
  vec3 lp = position;
  lp.x *= len;
  lp.yz *= (0.7 + aSeed.x*0.4) * mix(1.0, 0.5, m);
  lp.y += sin(position.x*5.0 + t*0.9 + aSeed.x*30.0)*0.04*len*(1.0-m*0.7);
  mat3 R = rotZ(az) * rotX(el) * rotY(tw);
  float depthScale = uBase;
  vec3 world = mid + R * lp * depthScale;
  vN = normalize(R * normal);
  vW = world;
  vAlong = aAlong;
  vSeed = aSeed.x;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}`

const frag = /* glsl */ `
uniform vec3 uLight;
uniform vec3 uLightCol;
uniform float uTime;
uniform float uMag;
varying vec3 vN;
varying vec3 vW;
varying float vAlong;
varying float vSeed;
void main(){
  vec3 N = normalize(vN);
  if(!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  vec3 Lv = uLight - vW;
  float d = length(Lv);
  vec3 L = Lv / d;
  float att = 1.0 / (1.0 + 0.16*d*d);
  float diff = max(dot(N,L),0.0)*0.7 + 0.3;
  vec3 H = normalize(L+V);
  float spec = pow(max(dot(N,H),0.0), 38.0);
  vec3 body = vec3(0.30, 0.012, 0.012);
  vec3 tip = vec3(1.0, 0.20, 0.035);
  vec3 base = mix(body, tip, smoothstep(0.25, 1.0, vAlong));
  base *= mix(0.55, 1.15, vSeed);
  vec3 col = base * (0.24 + diff*att*3.0);
  col += uLightCol * spec * att * 7.0;
  col += vec3(1.0,0.30,0.06) * pow(vAlong, 7.0) * 0.22 * (0.6+0.4*sin(uTime*0.7+vSeed*40.0));
  float fd = length(cameraPosition - vW);
  col *= smoothstep(30.0, 8.0, fd);
  col *= 1.0 + uMag*1.1;
  col = min(col, vec3(1.7, 1.2, 0.9));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`

function threadGeometry() {
  const SEG = 9, RAD = 5
  const pos = [], nor = [], along = [], idx = []
  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG
    const x = t - 0.5
    const y = 0.09 * Math.sin(t * 3.4) + 0.05 * t * t
    const r = 0.014 * (0.35 + 0.55 * t + 1.1 * Math.pow(t, 5))
    for (let j = 0; j <= RAD; j++) {
      const a = (j / RAD) * Math.PI * 2
      const ny = Math.cos(a), nz = Math.sin(a)
      pos.push(x, y + ny * r, nz * r)
      nor.push(0.15, ny, nz)
      along.push(t)
    }
  }
  for (let i = 0; i < SEG; i++)
    for (let j = 0; j < RAD; j++) {
      const a = i * (RAD + 1) + j, b = a + RAD + 1
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
  const g = new THREE.InstancedBufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  g.setAttribute('aAlong', new THREE.Float32BufferAttribute(along, 1))
  g.setIndex(idx)
  return g
}

async function sampleWordmark(n) {
  try { await document.fonts.load('500 220px "Cormorant Garamond"') } catch {}
  const W = 1600, H = 420
  const c = document.createElement('canvas')
  c.width = W; c.height = H
  const g = c.getContext('2d', { willReadFrequently: true })
  g.fillStyle = '#fff'
  g.font = '500 300px "Cormorant Garamond", Georgia, serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  if ('letterSpacing' in g) g.letterSpacing = '24px'
  g.fillText('KESARI', W / 2, H / 2 + 14)
  const d = g.getImageData(0, 0, W, H).data
  const pts = []
  for (let y = 0; y < H; y += 2)
    for (let x = 0; x < W; x += 2) if (d[(y * W + x) * 4 + 3] > 128) pts.push(x, y)
  const out = new Float32Array(n * 3)
  const k = 10 / W // wordmark width 10 units
  for (let i = 0; i < n; i++) {
    const q = ((Math.random() * pts.length) / 2 | 0) * 2
    out[i * 3] = (pts[q] - W / 2) * k
    out[i * 3 + 1] = -(pts[q + 1] - H / 2) * k + 0.1
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.35
  }
  return out
}

function Threads({ count, reduced }) {
  const mesh = useRef()
  const { camera, size } = useThree()
  const geo = useMemo(() => {
    const g = threadGeometry()
    const rest = new Float32Array(count * 3), seed = new Float32Array(count * 4), tgt = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      rest.set([(Math.random() - 0.5) * 26, (Math.random() - 0.5) * 18, -9 + Math.random() * 14], i * 3)
      seed.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4)
      tgt.set([(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 2, 0], i * 3)
    }
    g.setAttribute('aRest', new THREE.InstancedBufferAttribute(rest, 3))
    g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 4))
    g.setAttribute('aTarget', new THREE.InstancedBufferAttribute(tgt, 3))
    g.instanceCount = count
    return g
  }, [count])
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 }, uMag: { value: 0 }, uTS: { value: 0.8 }, uBase: { value: 1 },
          uLight: { value: new THREE.Vector3(0, 0, 2) },
          uLightCol: { value: new THREE.Color('#ffb066') },
        },
      }),
    [],
  )
  useEffect(() => {
    let dead = false
    sampleWordmark(count).then((arr) => {
      if (dead) return
      geo.getAttribute('aTarget').array.set(arr)
      geo.getAttribute('aTarget').needsUpdate = true
    })
    return () => { dead = true }
  }, [count, geo])
  useEffect(() => () => { geo.dispose(); mat.dispose() }, [geo, mat])

  const tmp = useMemo(() => new THREE.Vector3(), [])
  const L = useMemo(() => new THREE.Vector3(0, 0, 2), [])
  useFrame((state, dt) => {
    const u = mat.uniforms
    u.uTime.value = reduced ? 20 : state.clock.elapsedTime
    // ease magnetism towards the scroll-driven target for a heavy feel
    u.uMag.value += (hero.p - u.uMag.value) * Math.min(1, dt * 3.2)
    const vw = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * (size.width / size.height)
    u.uTS.value = Math.min(1.1, (vw * 0.8) / 10)
    // cursor = candle
    const idle = performance.now() - pointer.lastMove > 2500 || !pointer.active
    const tt = state.clock.elapsedTime
    const nx = idle ? Math.sin(tt * 0.31) * 0.55 : pointer.x
    const ny = idle ? Math.cos(tt * 0.23) * 0.35 + 0.1 : pointer.y
    tmp.set(nx, ny, 0.5).unproject(camera).sub(camera.position).normalize()
    const dist = (1.4 - camera.position.z) / tmp.z
    tmp.multiplyScalar(dist).add(camera.position)
    L.lerp(tmp, Math.min(1, dt * 4))
    u.uLight.value.copy(L)
  })
  return <instancedMesh ref={mesh} args={[geo, mat, count]} frustumCulled={false} />
}

function Dust({ count }) {
  const ref = useRef()
  const [geo, mat] = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const p = new Float32Array(count * 3), s = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      p.set([(Math.random() - 0.5) * 22, (Math.random() - 0.5) * 12, -4 + Math.random() * 8], i * 3)
      s[i] = Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    g.setAttribute('aS', new THREE.BufferAttribute(s, 1))
    const m = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPx: { value: 1 } },
      vertexShader: /* glsl */ `
        attribute float aS; uniform float uTime; uniform float uPx; varying float vA;
        void main(){
          vec3 p = position; p.y = mod(p.y + uTime*(0.05+aS*0.1) + 6.0, 12.0) - 6.0; p.x += sin(uTime*0.2+aS*20.)*0.4;
          vec4 mv = modelViewMatrix * vec4(p,1.); gl_Position = projectionMatrix*mv;
          gl_PointSize = (0.9 + aS*2.2) * uPx * (8.0/ -mv.z); vA = 0.25 + 0.75*fract(aS*7.3 + uTime*0.15*aS);
        }`,
      fragmentShader: /* glsl */ `
        varying float vA; void main(){ vec2 c = gl_PointCoord-.5; float d = length(c); if(d>.5) discard;
        gl_FragColor = vec4(vec3(1.0,0.62,0.22)*vA*0.9, smoothstep(.5,.0,d)*vA); }`,
    })
    return [g, m]
  }, [count])
  useFrame((s) => { mat.uniforms.uTime.value = s.clock.elapsedTime; mat.uniforms.uPx.value = s.gl.getPixelRatio() })
  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />
}

function Invalidator() {
  // In reduced-motion mode the loop is demand-driven: redraw when scrolling
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    invalidate()
    const f = () => invalidate()
    window.addEventListener('scroll', f, { passive: true })
    window.addEventListener('pointermove', f, { passive: true })
    return () => { window.removeEventListener('scroll', f); window.removeEventListener('pointermove', f) }
  }, [invalidate])
  return null
}

export default function NebulaScene({ active, mobile, reduced }) {
  const count = mobile ? 1300 : reduced ? 2000 : 3200
  return (
    <Canvas
      dpr={[1, 1.25]}
      frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
      gl={{ antialias: false, stencil: false, powerPreference: 'high-performance', alpha: false }}
      camera={{ position: [0, 0, 9], fov: 40, near: 0.1, far: 60 }}
      aria-hidden="true"
    >
      <color attach="background" args={['#0B0907']} />
      <Threads count={count} reduced={reduced} />
      <Dust count={mobile ? 120 : 320} />
      {reduced && <Invalidator />}
      {!mobile && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={1.15} luminanceThreshold={0.32} luminanceSmoothing={0.35} mipmapBlur radius={0.72} resolutionScale={0.5} />
                    <Vignette eskil={false} offset={0.22} darkness={0.9} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
