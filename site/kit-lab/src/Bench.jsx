// Perf bench: ?bench=<key> renders ONE shader as a fixed full-viewport background behind 300vh of content, which is
// the worst case the policy allows (a page-wide hero/feature layer). ?bench=none is the baseline.
// Add &force=1 to run the shader on phones too (ShaderStage allowMobile) to measure raw mobile cost.
import { lazy } from 'react'
import ShaderStage from '@kit/backgrounds/ShaderStage'
import { POSTERS } from './shaders.js'

const SHADERS = {
  silk: [lazy(() => import('@kit/backgrounds/Silk')), { color: '#7a1e0e', sheenColor: '#f6c76b', speed: 3, noiseIntensity: 1.2, rotation: 0.2 }],
  iridescence: [lazy(() => import('@kit/backgrounds/Iridescence')), { color: [1, 0.52, 0.12], speed: 0.5, amplitude: 0.08, brightness: 1.25 }],
  threads: [lazy(() => import('@kit/backgrounds/Threads')), { color: '#e35d1a', accentColor: '#f6c76b', amplitude: 1.2, distance: 0.2, lineCount: 60 }],
  liquidchrome: [lazy(() => import('@kit/backgrounds/LiquidChrome')), { color: '#d9a43b', speed: 0.15, amplitude: 0.3 }],
  metallic: [lazy(() => import('@kit/backgrounds/MetallicPaint')), { text: 'Kesari', fontFamily: 'Georgia, serif', fontWeight: 700, color: '#e3a21a', scale: 0.7 }],
  shadergradient: [lazy(() => import('@kit/backgrounds/ShaderGradientBg')), { preset: 'saffronSea' }],
}

export default function Bench({ name }) {
  const force = new URLSearchParams(location.search).get('force') === '1'
  const entry = SHADERS[name]
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {entry ? (
        <ShaderStage shader={entry[0]} shaderProps={entry[1]} poster={POSTERS[name]} allowMobile={force} className="!fixed inset-0" />
      ) : null}
      <div className="relative">
        {[0, 1, 2].map((i) => (
          <section key={i} className="flex h-screen items-center px-8">
            <h1 className="font-display text-6xl text-white drop-shadow">bench: {name} · {i + 1}/3</h1>
          </section>
        ))}
      </div>
    </div>
  )
}
