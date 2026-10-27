import * as THREE from 'three'
import { BRAND, inr } from '../brand'

const tex = (c, srgb = true) => { const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t }

// the paper label wrapped around each glass jar
export function makeLabel(p) {
  const W = 768, H = 460
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const g = c.getContext('2d')
  g.fillStyle = '#F3E8D6'; g.fillRect(0, 0, W, H)
  // paper grain
  for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(120,80,40,${Math.random() * 0.05})`; g.fillRect(Math.random() * W, Math.random() * H, 2, 2) }
  // awning stripe band
  for (let x = 0; x < W; x += 48) { g.fillStyle = (x / 48) % 2 ? '#F2B230' : '#C62A1F'; g.fillRect(x, 0, 48, 46) }
  for (let x = 0; x < W; x += 48) { g.fillStyle = (x / 48) % 2 ? '#F2B230' : '#C62A1F'; g.beginPath(); g.arc(x + 24, 46, 24, 0, Math.PI); g.fill() }
  // brand plate
  g.fillStyle = '#C62A1F'; g.fillRect(W / 2 - 120, 92, 240, 50)
  g.fillStyle = '#FBF4E8'; g.font = '38px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'
  g.fillText(BRAND.toUpperCase(), W / 2, 119)
  // name in two lines max
  const words = p.name.toUpperCase().split(' ')
  const lines = words.length > 2 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : words.length === 2 ? words : [words[0]]
  const longest = Math.max(...lines.map((l) => l.length))
  const fs = Math.min(104, 560 / (longest * 0.5))
  g.fillStyle = '#2A1710'; g.font = `${fs}px Anton`
  const y0 = lines.length === 1 ? 238 : 212
  lines.forEach((l, i) => g.fillText(l, W / 2, y0 + i * fs * 0.98))
  // hindi / italic
  g.fillStyle = '#C0392B'; g.font = 'italic 52px "Instrument Serif"'
  g.fillText(p.hi, W / 2, lines.length === 1 ? 318 : 214 + lines.length * fs * 0.98 + 18)
  // footer strip
  g.fillStyle = p.fill; g.fillRect(0, H - 56, W, 56)
  g.fillStyle = '#FBF4E8'; g.font = '600 24px "DM Sans"'
  g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 4
  g.fillText(`${p.weight}  ·  GROUND FRESH  ·  ${inr(p.price)}`, W / 2, H - 28)
  return tex(c)
}

export function makeWood(w = 1024, h = 256, base = '#8a5a34', dark = '#4a2a14', seams = 3) {
  const c = document.createElement('canvas'); c.width = w; c.height = h
  const g = c.getContext('2d')
  g.fillStyle = base; g.fillRect(0, 0, w, h)
  for (let i = 0; i < 140; i++) {
    const y = Math.random() * h
    g.strokeStyle = Math.random() > 0.5 ? `rgba(40,20,8,${0.05 + Math.random() * 0.14})` : `rgba(230,170,110,${0.04 + Math.random() * 0.08})`
    g.lineWidth = 0.6 + Math.random() * 2
    g.beginPath(); g.moveTo(0, y)
    for (let x = 0; x <= w; x += 64) g.lineTo(x, y + Math.sin(x * 0.01 + i) * 3 + (Math.random() - 0.5) * 2)
    g.stroke()
  }
  g.fillStyle = dark
  for (let s = 1; s < seams; s++) g.fillRect(0, (h / seams) * s - 1, w, 3)
  return tex(c)
}

export function makeWall() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#3a2218'; g.fillRect(0, 0, 512, 512)
  for (let x = 0; x < 512; x += 128) {
    const gr = g.createLinearGradient(x, 0, x + 128, 0)
    gr.addColorStop(0, 'rgba(0,0,0,.35)'); gr.addColorStop(0.06, 'rgba(255,200,140,.05)'); gr.addColorStop(1, 'rgba(0,0,0,.08)')
    g.fillStyle = gr; g.fillRect(x, 0, 128, 512)
    for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(20,8,2,${Math.random() * 0.15})`; g.lineWidth = 1; const xx = x + 8 + Math.random() * 112; g.beginPath(); g.moveTo(xx, 0); g.lineTo(xx + (Math.random() - 0.5) * 6, 512); g.stroke() }
  }
  const t = tex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t
}

export function makeSpeckle() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#d4d4d4'; g.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 2200; i++) { const v = 120 + Math.random() * 135; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 2.5, 1 + Math.random() * 2.5) }
  const t = tex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 3); return t
}

export function makeGlow() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  gr.addColorStop(0, 'rgba(255,200,110,.55)'); gr.addColorStop(0.5, 'rgba(255,170,70,.18)'); gr.addColorStop(1, 'rgba(255,150,40,0)')
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256)
  return tex(c)
}
