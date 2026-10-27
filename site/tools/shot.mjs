// Usage: node tools/shot.mjs <url> <outPrefix>
// Saves desktop (1440) + mobile (390) screenshots at several scroll depths, and prints console errors.
import { chromium } from 'playwright'

const [url, out] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] })

for (const [label, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport })
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  const stops = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9]
  for (const [i, f] of stops.entries()) {
    await page.mouse.wheel(0, 0)
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(height * f))
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${out}-${label}-${i}.png` })
  }
  console.log(`${label}: height=${height}px, errors=${errors.length}`)
  errors.slice(0, 10).forEach((e) => console.log('  ' + e))
  await page.close()
}
await browser.close()
