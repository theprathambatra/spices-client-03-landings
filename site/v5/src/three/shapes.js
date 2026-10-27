import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const V = (x, y, z = 0) => new THREE.Vector3(x, y, z)

// parametric surface -> indexed BufferGeometry. fn(u,v) -> Vector3, u,v in [0,1]
function surface(fn, nu, nv) {
  const pos = []
  for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) { const p = fn(i / nu, j / nv); pos.push(p.x, p.y, p.z) }
  const idx = []
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
    const a = i * (nv + 1) + j, b = a + 1, c = a + nv + 1, d = c + 1
    idx.push(a, b, c, b, d, c)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  return g
}

// sweep a circle of radius r(t) along a curve
function sweep(points, radius, nu = 60, nv = 20) {
  const curve = new THREE.CatmullRomCurve3(points)
  const fr = curve.computeFrenetFrames(nu, false)
  return surface((u, v) => {
    const k = Math.min(nu, Math.round(u * nu))
    const c = curve.getPointAt(u)
    const a = v * Math.PI * 2
    const r = radius(u, a)
    return c.clone().addScaledVector(fr.normals[k], Math.cos(a) * r).addScaledVector(fr.binormals[k], Math.sin(a) * r)
  }, nu, nv)
}

function ellipsoid(rx, ry, rz, pos = [0, 0, 0]) {
  const g = new THREE.SphereGeometry(1, 28, 18)
  g.scale(rx, ry, rz); g.translate(...pos)
  g.deleteAttribute('normal'); g.deleteAttribute('uv')
  return g
}

function finish(parts, size) {
  const g = mergeGeometries(parts.map((p) => { const q = p.index ? p.toNonIndexed() : p; q.deleteAttribute('normal'); q.deleteAttribute('uv'); return q }))
  g.computeBoundingBox()
  const c = g.boundingBox.getCenter(new THREE.Vector3()), s = g.boundingBox.getSize(new THREE.Vector3())
  g.translate(-c.x, -c.y, -c.z)
  g.scale(size / Math.max(s.x, s.y, s.z), size / Math.max(s.x, s.y, s.z), size / Math.max(s.x, s.y, s.z))
  return g
}

function chilli() {
  const body = sweep([V(0.5, 1.4), V(0.35, 0.9), V(0.05, 0.1), V(-0.3, -0.7), V(-0.8, -1.4), V(-1.5, -1.8)],
    (u) => 0.34 * Math.pow(1 - u, 0.8) * (1 - Math.exp(-u * 22)) * (1 + 0.06 * Math.sin(u * 9)), 70, 22)
  const stem = sweep([V(0.52, 1.35), V(0.6, 1.7), V(0.95, 2.0), V(1.3, 2.05)], (u) => 0.1 * (1 - u * 0.4), 24, 10)
  const calyx = ellipsoid(0.44, 0.13, 0.44, [0.52, 1.36, 0]); calyx.rotateZ(-0.2)
  return finish([body, stem, calyx], 3.9)
}

function turmeric() {
  const ring = (u) => 1 + 0.09 * Math.sin(u * 46) + 0.03 * Math.sin(u * 11)
  const finger = (pts, r) => sweep(pts, (u, a) => r * Math.pow(Math.sin(Math.PI * (0.04 + 0.92 * u)), 0.5) * ring(u) * (1 + 0.05 * Math.sin(a * 3 + u * 5)), 64, 18)
  const f1 = finger([V(-1.6, -0.5), V(-0.6, -0.2), V(0.5, 0.0), V(1.6, 0.35)], 0.5)
  const f2 = finger([V(-0.2, 0.0), V(-0.3, 0.6), V(-0.5, 1.1), V(-0.5, 1.5)], 0.34)
  const f3 = finger([V(0.4, 0.0), V(0.7, -0.5), V(0.95, -0.9), V(1.3, -1.25)], 0.33)
  const f4 = finger([V(-0.6, -0.2), V(-1.0, 0.4), V(-1.5, 0.7)], 0.28)
  const mother = ellipsoid(0.62, 0.52, 0.5, [-0.05, -0.05, 0]); mother.rotateZ(0.2)
  return finish([f1, f2, f3, f4, mother], 3.5)
}

function cardamom() {
  const g = surface((u, v) => {
    const a = v * Math.PI * 2
    const prof = Math.pow(Math.sin(Math.PI * u), 0.62)
    const r = 0.8 * prof * (1 + 0.14 * Math.cos(3 * a)) * (1 + 0.05 * Math.sin(u * 20 + a))
    const y = (u - 0.5) * 3.3
    return V(Math.cos(a) * r, y, Math.sin(a) * r * 0.92)
  }, 64, 36)
  const nub = surface((u, v) => { const a = v * Math.PI * 2, r = 0.09 * (1 - u); return V(Math.cos(a) * r, 1.62 + u * 0.28, Math.sin(a) * r) }, 6, 10)
  const tail = surface((u, v) => { const a = v * Math.PI * 2, r = 0.06 * (1 - u); return V(Math.cos(a) * r, -1.62 - u * 0.2, Math.sin(a) * r) }, 6, 10)
  const out = finish([g, nub, tail], 3.8)
  out.rotateZ(0.35); out.rotateX(0.25)
  return out
}

function anise() {
  const parts = [ellipsoid(0.46, 0.46, 0.2)]
  for (let k = 0; k < 8; k++) {
    const ang = (k / 8) * Math.PI * 2
    const pod = surface((u, v) => {
      const a = v * Math.PI * 2
      const w = 0.4 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.98 + 0.01)), 0.7) * (1 - 0.18 * u)
      const x = 0.25 + u * 1.55
      return V(x, Math.cos(a) * w, Math.sin(a) * w * 0.62 + 0.08 * Math.sin(u * Math.PI))
    }, 22, 14)
    const beak = surface((u, v) => { const a = v * Math.PI * 2, r = 0.05 * (1 - u); return V(1.78 + u * 0.22, Math.cos(a) * r, Math.sin(a) * r) }, 4, 8)
    const m = new THREE.Matrix4().makeRotationZ(ang)
    pod.applyMatrix4(m); beak.applyMatrix4(m)
    parts.push(pod, beak)
  }
  const out = finish(parts, 3.8)
  out.rotateX(-0.45); out.rotateY(0.25)
  return out
}

const tick = () => new Promise((r) => setTimeout(r, 0))
// Build geometry + sample points in small chunks so no single main-thread task is long.
export async function buildTargetsAsync(n, dead = () => false, chunk = 2500) {
  const makers = [chilli, turmeric, cardamom, anise]
  const out = []
  for (const make of makers) {
    const g = make()
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(g)).build()
    const arr = new Float32Array(n * 3), p = new THREE.Vector3()
    await tick()
    for (let i = 0; i < n; i++) {
      sampler.sample(p); arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z
      if (i % chunk === chunk - 1) { await tick(); if (dead()) return null }
    }
    g.dispose()
    out.push(arr)
  }
  return out
}
