import * as THREE from 'three'
import { BRAND, inkOn } from '../brand.js'

export const LABEL_W = 512
export const LABEL_H = 912

function shade(hex, amt) {
  const c = new THREE.Color(hex)
  const hsl = {}
  c.getHSL(hsl)
  c.setHSL(hsl.h, hsl.s, Math.min(1, Math.max(0, hsl.l + amt)))
  return '#' + c.getHexString()
}

function wrap(ctx, text, maxW) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    const t = line ? line + ' ' + w : w
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w } else line = t
  }
  lines.push(line)
  return lines
}

export function drawFront(ctx, sku) {
  const W = LABEL_W, H = LABEL_H
  const ink = inkOn(sku.color)
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = sku.color
  ctx.fillRect(0, 0, W, H)
  // rays
  ctx.save()
  ctx.translate(W / 2, 330)
  const n = 20
  for (let i = 0; i < n; i++) {
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, 900, (i / n) * Math.PI * 2, ((i + 0.5) / n) * Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = 'rgba(255,255,255,0.13)'
    ctx.fill()
  }
  ctx.restore()
  // crimp strip
  ctx.fillStyle = shade(sku.color, -0.09)
  ctx.fillRect(0, 0, W, 96)
  for (let x = 0; x < W; x += 12) { ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(x, 0, 5, 96) }
  // roundel
  ctx.lineWidth = 8
  ctx.strokeStyle = '#1A1208'
  ctx.fillStyle = '#FFF3DC'
  ctx.beginPath(); ctx.arc(W / 2, 250, 92, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#1A1208'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.font = '40px "Bowlby One", Impact, sans-serif'
  ctx.fillText(BRAND.toUpperCase(), W / 2, 238)
  ctx.font = '700 20px "Baloo 2", sans-serif'
  ctx.fillStyle = sku.color === '#FFC21A' ? '#B3261E' : '#E03A2F'
  ctx.fillText('SPICES  •  SINCE TODAY', W / 2, 282)
  // name
  const name = sku.name.toUpperCase()
  ctx.font = '76px "Bowlby One", Impact, sans-serif'
  let lines = wrap(ctx, name, W - 110)
  let size = 76
  while (lines.length > 3 || Math.max(...lines.map((l) => ctx.measureText(l).width)) > W - 100) {
    size -= 4; ctx.font = `${size}px "Bowlby One", Impact, sans-serif`; lines = wrap(ctx, name, W - 110)
  }
  if (lines.length === 1 && size > 70) { size = 70 }
  const lh = size * 1.02
  let y = 470 - ((lines.length - 1) * lh) / 2
  ctx.font = `${size}px "Bowlby One", Impact, sans-serif`
  for (const l of lines) {
    ctx.fillStyle = ink === '#1A1208' ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.3)'
    ctx.fillText(l, W / 2 + 4, y + 5)
    ctx.fillStyle = ink
    ctx.fillText(l, W / 2, y)
    y += lh
  }
  // hindi
  ctx.font = '700 36px "Baloo 2", sans-serif'
  ctx.fillStyle = ink
  ctx.fillText(sku.hindi, W / 2, y + 22)
  // heat dots
  const dy = 700
  for (let i = 0; i < 4; i++) {
    ctx.beginPath(); ctx.arc(W / 2 - 66 + i * 44, dy, 15, 0, Math.PI * 2)
    ctx.fillStyle = i < Math.max(1, sku.heat) && sku.heat > 0 ? '#FFF3DC' : 'rgba(0,0,0,0.18)'
    ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#1A1208'; ctx.stroke()
  }
  ctx.font = '700 22px "Baloo 2", sans-serif'; ctx.fillStyle = ink
  ctx.fillText(sku.heat === 0 ? 'ZERO FIRE, ALL FLAVOUR' : 'HEAT METER', W / 2, dy + 44)
  // weight pill
  ctx.fillStyle = '#FFF3DC'; ctx.strokeStyle = '#1A1208'; ctx.lineWidth = 6
  const pw = 150, ph = 58, px = W / 2 - pw / 2, py = 780
  ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 29); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#1A1208'; ctx.font = '700 32px "Baloo 2", sans-serif'
  ctx.fillText(sku.weight, W / 2, py + 31)
  // wave bottom
  ctx.fillStyle = shade(sku.color, -0.1)
  ctx.beginPath(); ctx.moveTo(0, H)
  for (let x = 0; x <= W; x += 8) ctx.lineTo(x, H - 26 - Math.sin(x / 26) * 9)
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill()
}

export function makeFrontTexture(sku) {
  const canvas = document.createElement('canvas')
  canvas.width = LABEL_W; canvas.height = LABEL_H
  const ctx = canvas.getContext('2d')
  drawFront(ctx, sku)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  const redraw = () => { drawFront(ctx, sku); tex.needsUpdate = true }
  if (document.fonts) {
    Promise.all([
      document.fonts.load('40px "Bowlby One"'),
      document.fonts.load('700 30px "Baloo 2"'),
    ]).then(redraw).catch(() => {})
  }
  return tex
}

export function makeBackTexture(sku) {
  const canvas = document.createElement('canvas')
  canvas.width = 256; canvas.height = 456
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = shade(sku.color, -0.04); ctx.fillRect(0, 0, 256, 456)
  ctx.fillStyle = 'rgba(255,255,255,0.14)'
  for (let y = 40; y < 456; y += 44) for (let x = (y / 44) % 2 ? 20 : 42; x < 256; x += 44) { ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill() }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function makeBlobTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  gr.addColorStop(0, 'rgba(26,18,8,0.55)'); gr.addColorStop(0.6, 'rgba(26,18,8,0.18)'); gr.addColorStop(1, 'rgba(26,18,8,0)')
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}
