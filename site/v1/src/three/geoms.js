import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

function paint(g, color) {
  const c = new THREE.Color(color)
  const n = g.attributes.position.count
  const a = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3))
  return g
}

function taperedTube(curve, seg, radial, radius, taper) {
  const g = new THREE.TubeGeometry(curve, seg, radius, radial, false)
  const pos = g.attributes.position
  const ring = radial + 1
  for (let i = 0; i < pos.count; i++) {
    const t = Math.floor(i / ring) / seg
    const p = curve.getPointAt(t)
    const k = taper(t)
    pos.setXYZ(i, p.x + (pos.getX(i) - p.x) * k, p.y + (pos.getY(i) - p.y) * k, p.z + (pos.getZ(i) - p.z) * k)
  }
  g.computeVertexNormals()
  return g
}

// long axis = Y, roughly centred, ~1 unit long
export function chilliGeo(body = '#E8281E', stem = '#2FA36B', split = false) {
  const curve = new THREE.CatmullRomCurve3([
    [0.04, 0.42, 0], [0.11, 0.2, 0], [0.1, -0.08, 0.02], [-0.02, -0.34, 0.02], [-0.2, -0.5, 0],
  ].map((a) => new THREE.Vector3(...a)))
  const tube = taperedTube(curve, 22, 10, 0.12, (t) => (t < 0.08 ? 0.6 + t * 5 : Math.max(0.07, Math.pow(1 - (t - 0.08) / 0.92, 0.75))))
  paint(tube, body)
  const calyx = new THREE.SphereGeometry(0.115, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2)
  calyx.scale(1, 0.5, 1); calyx.rotateZ(-0.2); calyx.translate(0.04, 0.42, 0)
  paint(calyx, stem)
  const stemCurve = new THREE.CatmullRomCurve3([[0.04, 0.42, 0], [0.03, 0.54, 0], [0.09, 0.64, 0]].map((a) => new THREE.Vector3(...a)))
  const st = taperedTube(stemCurve, 6, 6, 0.035, () => 1)
  paint(st, stem)
  if (split) { const sg = mergeGeometries([calyx, st]); tube.translate(0, -0.05, 0); sg.translate(0, -0.05, 0); return { body: tube, stem: sg } }
  const g = mergeGeometries([tube, calyx, st])
  g.translate(0, -0.05, 0)
  return g
}

export function pepperGeo(color = '#3a2218') {
  const g = new THREE.IcosahedronGeometry(0.11, 2)
  const p = g.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const n = 1 + 0.09 * Math.sin(v.x * 70) * Math.sin(v.y * 60 + v.z * 40) + 0.05 * Math.sin(v.z * 50)
    v.multiplyScalar(n); p.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals()
  return paint(g, color)
}

export function cardamomGeo(color = '#7fc23f') {
  const g = new THREE.SphereGeometry(0.1, 14, 12)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i)
    const yn = y / 0.1
    const ang = Math.atan2(z, x)
    const pinch = 1 - 0.4 * Math.pow(Math.abs(yn), 3)
    const ridge = 1 + 0.07 * Math.cos(ang * 3)
    p.setXYZ(i, x * pinch * ridge, y * 1.9, z * pinch * ridge)
  }
  g.computeVertexNormals()
  return paint(g, color)
}

export function aniseGeo(color = '#9a4f22') {
  const s = new THREE.Shape()
  const pts = 8
  for (let i = 0; i < pts * 2; i++) {
    const a = (i / (pts * 2)) * Math.PI * 2
    const r = i % 2 === 0 ? 0.21 : 0.095
    const x = Math.cos(a) * r, y = Math.sin(a) * r
    if (i === 0) s.moveTo(x, y); else s.lineTo(x, y)
  }
  s.closePath()
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.02, bevelSegments: 2 })
  g.translate(0, 0, -0.025)
  g.rotateX(-Math.PI / 2)
  let dome = new THREE.SphereGeometry(0.06, 10, 6).toNonIndexed()
  dome.scale(1, 0.6, 1); dome.translate(0, 0.04, 0)
  const dome2 = dome.clone(); dome2.translate(0, -0.08, 0)
  g.deleteAttribute && 0
  paint(g, color); paint(dome, '#4a230f'); paint(dome2, '#4a230f')
  return mergeGeometries([g, dome, dome2])
}

export function turmericGeo(color = '#ff9d00') {
  const g = new THREE.CapsuleGeometry(0.1, 0.24, 5, 12)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i)
    const bump = 1 + 0.12 * Math.sin(y * 28) + 0.07 * Math.sin(x * 40 + z * 33)
    p.setXYZ(i, x * bump + y * 0.12, y, z * bump)
  }
  g.computeVertexNormals()
  return paint(g, color)
}

// small helper: crimped pillow pouch, returns {front, back}
export function pouchSurface(w, h, bulge) {
  const sx = 56, sy = 36
  const g = new THREE.PlaneGeometry(w, h, sx, sy)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i)
    const u = x / (w / 2)                    // -1..1
    const v = y / h + 0.5                    // 0 bottom .. 1 top
    const edge = Math.pow(Math.max(0, 1 - u * u), 0.5)
    // bottom gusset stays full, tapers to flat seal at the top
    const prof = v > 0.9 ? 0 : v > 0.72 ? Math.pow(1 - (v - 0.72) / 0.18, 1.6) * 0.9 : 0.9 + 0.1 * Math.sin(v * 3.1)
    const bottom = v < 0.04 ? v / 0.04 : 1
    let z = bulge * edge * prof * bottom
    if (v > 0.9) z += 0.012 * Math.sin(x * 55) // crimp ridges
    // pinch the top a little
    const pinch = v > 0.72 ? 1 - 0.07 * ((v - 0.72) / 0.28) : 1
    p.setXYZ(i, x * pinch, y, z)
  }
  g.computeVertexNormals()
  return g
}

export function chilliParts() {
  const full = chilliGeo('#ffffff', '#2FA36B')
  return full
}
