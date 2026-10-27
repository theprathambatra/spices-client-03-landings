import * as THREE from 'three'

// brushed-steel roughness map: fine circumferential streaks (procedural, no files)
export function makeBrushed() {
  const c = document.createElement('canvas')
  c.width = 256; c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = 'rgb(92,92,92)'
  g.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 700; i++) {
    const y = Math.random() * 256
    const v = 78 + Math.random() * 36
    g.strokeStyle = `rgba(${v},${v},${v},${0.08 + Math.random() * 0.18})`
    g.lineWidth = 0.5 + Math.random() * 1.4
    g.beginPath(); g.moveTo(0, y); g.lineTo(256, y + (Math.random() - 0.5) * 3); g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2, 1)
  t.anisotropy = 4
  return t
}

export const V2 = (arr) => arr.map(([x, y]) => new THREE.Vector2(x, y))

// smooth-ish deterministic noise
export function noise2(x, z, seed = 0) {
  return Math.sin(x * 37.1 + seed) * Math.sin(z * 29.3 + seed * 1.7) + 0.5 * Math.sin(x * 71 + z * 63 + seed * 2.3) + 0.35 * Math.sin(x * 13.7 - z * 17.9 + seed)
}
