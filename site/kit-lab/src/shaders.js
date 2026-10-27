// CSS posters = the static fallback each shader degrades to (reduced motion, Save-Data, phones, low-end devices).
// Match the poster to the shader's first frame so the fade-in reads as "coming alive", not as a swap.
export const POSTERS = {
  silk: 'radial-gradient(120% 90% at 25% 15%, #b8452a 0%, #7a1e0e 38%, #2a0a05 100%)',
  iridescence: 'conic-gradient(from 210deg at 60% 40%, #f2b35a, #d9792b, #f6d58f, #c8461e, #f2b35a)',
  threads: 'linear-gradient(180deg, #120b07 0%, #1f120a 100%)',
  liquidchrome: 'radial-gradient(110% 80% at 40% 30%, #f3d27a 0%, #b9822a 45%, #3d2608 100%)',
  metallic: 'radial-gradient(80% 60% at 50% 50%, #2b1d0e 0%, #0e0a07 100%)',
  shadergradient: 'radial-gradient(120% 90% at 30% 20%, #f2a900 0%, #b3261e 48%, #3b1f0b 100%)',
}

// Measured 2026-10-24 (docs/playbook/COMPONENTS.md has the method and the full table). "mount" = longest main-thread
// task at 4x CPU throttle (tools/perf.mjs); "GPU" = p95 frame time uncapped at 2880x1800 on an Apple M5 Pro.
export const SHADER_COST = {
  silk: 'cost: 5.3 KB gz · mount 176 ms · GPU p95 3.3 ms · 60 fps scrolled (4x CPU)',
  iridescence: 'cost: 4.7 KB gz · mount 79 ms · GPU p95 1.5 ms · 60 fps scrolled (4x CPU)',
  threads: 'cost: 4.7 KB gz · mount 115 ms · GPU p95 3.2 ms · 60 fps scrolled (4x CPU)',
  liquidchrome: 'cost: 6.2 KB gz · mount 192 ms · GPU p95 3.1 ms · 60 fps scrolled (4x CPU)',
  metallic: 'cost: 6.9 KB gz · mount 240 ms · +15 MB heap · GPU p95 3.2 ms · 60 fps scrolled (4x CPU)',
  shadergradient: 'cost: 45.6 KB gz (+236 KB gz if the page has no three/R3F yet) · 4 long tasks · +13 MB heap · GPU p95 2.9 ms',
}
