// Usage: node tools/audit.mjs <baseUrl> v1 v2 ... — mobile overflow, console errors, FPS, Esc on mobile menu
import { chromium } from 'playwright'

const [base, ...pages] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] })
for (const p of pages) {
  for (const [label, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport, isMobile: label === 'mobile', hasTouch: label === 'mobile' })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    await page.goto(`${base}/${p}/`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2500)
    const fps = await page.evaluate(() => new Promise((r) => { let n = 0; const t = performance.now(); const f = () => { n++; performance.now() - t < 2000 ? requestAnimationFrame(f) : r(Math.round(n / 2)) }; requestAnimationFrame(f) }))
    const h = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < h; y += 800) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(120) }
    const sw = await page.evaluate(() => document.documentElement.scrollWidth)
    console.log(`${p} ${label}: fps≈${fps} scrollWidth=${sw}/${viewport.width}${sw > viewport.width ? ' OVERFLOW' : ''} height=${h} errors=${errors.length}`)
    errors.slice(0, 3).forEach((e) => console.log('   ' + e.slice(0, 160)))
    await page.close()
  }
}
await browser.close()
