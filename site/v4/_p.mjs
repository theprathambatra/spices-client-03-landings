import { chromium } from 'playwright'
const [vp0, kill] = process.argv.slice(2)
const browser = await chromium.launch({ args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] })
const viewport = vp0 === 'm' ? { width: 390, height: 844 } : { width: 1440, height: 900 }
const page = await browser.newPage({ viewport, isMobile: vp0 === 'm', hasTouch: vp0 === 'm' })
const cdp = await page.context().newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
if (kill) await page.addInitScript((k) => { addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = k + '{display:none!important}'; document.head.appendChild(st) }) }, kill)
await page.goto('http://localhost:5314/v4/', { waitUntil: 'load' }); await page.waitForTimeout(3500)
const res = await page.evaluate(async () => {
  const H = document.documentElement.scrollHeight - innerHeight
  const out = []; let last = performance.now()
  for (let y = 0; y <= H; y += 120) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 16)); await new Promise((r) => requestAnimationFrame(r)); const n = performance.now(); out.push([y, n - last]); last = n }
  return { H, out }
})
const f = res.out.map((o) => o[1]).sort((a, b) => a - b)
console.log(vp0, kill || 'none', 'avg', Math.round(1000 / (f.reduce((a, b) => a + b) / f.length)), 'p95', Math.round(f[Math.floor(f.length * .95)]), 'H', res.H)
const buckets = {}; res.out.forEach(([y, d]) => { const k = Math.floor(y / 1000); buckets[k] = (buckets[k] || []).concat(d) })
console.log(Object.entries(buckets).map(([k, a]) => k + 'k:' + Math.round(a.reduce((x, y) => x + y) / a.length)).join(' '))
await browser.close()
