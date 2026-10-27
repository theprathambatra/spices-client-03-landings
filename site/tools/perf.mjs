// Usage: node tools/perf.mjs <url> [label]
// Loads the page with 4x CPU throttling (mid-range laptop), scrolls top→bottom like a user,
// and reports frame times, dropped frames, long tasks and JS heap.
import { chromium } from 'playwright'

const [url, label = url] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'] })
for (const [vp, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport, isMobile: vp === 'mobile', hasTouch: vp === 'mobile' })
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await page.addInitScript(() => {
    window.__long = []
    new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__long.push(e.duration))).observe({ type: 'longtask', buffered: true })
  })
  const t0 = Date.now()
  await page.goto(url, { waitUntil: 'load' })
  const loadMs = Date.now() - t0
  await page.waitForTimeout(3000)
  const res = await page.evaluate(async () => {
    const frames = []
    let last = performance.now(), run = true
    const tick = (t) => { frames.push(t - last); last = t; if (run) requestAnimationFrame(tick) }
    requestAnimationFrame(tick)
    const H = document.documentElement.scrollHeight - innerHeight
    for (let y = 0; y <= H; y += 120) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 16)) }
    await new Promise((r) => setTimeout(r, 500))
    run = false
    frames.sort((a, b) => a - b)
    const avg = frames.reduce((a, b) => a + b, 0) / frames.length
    return {
      avgFps: Math.round(1000 / avg),
      p95ms: Math.round(frames[Math.floor(frames.length * 0.95)]),
      jank: frames.filter((f) => f > 50).length,
      longTasks: window.__long.length,
      longestTask: Math.round(Math.max(0, ...window.__long)),
      heapMB: Math.round((performance.memory?.usedJSHeapSize || 0) / 1e6),
      canvases: document.querySelectorAll('canvas').length,
    }
  })
  console.log(`${label} ${vp}: load=${loadMs}ms avgFps=${res.avgFps} p95=${res.p95ms}ms jankFrames(>50ms)=${res.jank} longTasks=${res.longTasks} longest=${res.longestTask}ms heap=${res.heapMB}MB canvases=${res.canvases}`)
  await page.close()
}
await browser.close()
