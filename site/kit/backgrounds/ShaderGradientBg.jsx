// Source: repos/shadergradient/packages/shadergradient/src (ShaderGradientCanvas.tsx + consts.ts canvasProps, re-done as a pausable canvas) wrapping npm @shadergradient/react@2.4.20 | License: MIT (repos/shadergradient/packages/shadergradient/package.json)
//
// Why not <ShaderGradientCanvas>? It unmounts the whole R3F canvas whenever it leaves the viewport, so every
// scroll back recreates the WebGL context and recompiles the shader (a visible hitch). This wrapper mounts once
// and toggles R3F's frameloop instead: 0 GPU work off-screen or in a hidden tab, no recompiles.
// Light is always lightType="3d": "env" fetches HDR files from ruucm.github.io at runtime (network dependency).
import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ShaderGradient } from '@shadergradient/react'
import * as THREE from 'three'

// Same patch ShaderGradientCanvas applies: the package's GLSL still #includes chunks that three removed in r151+.
THREE.ShaderChunk.uv2_pars_vertex = ''
THREE.ShaderChunk.uv2_vertex = ''
THREE.ShaderChunk.uv2_pars_fragment = ''
THREE.ShaderChunk.encodings_fragment = ''

/** Spice palettes tuned on the kit-lab page. Any ShaderGradient prop can be overridden per use. */
export const SPICE_GRADIENTS = {
  // Molten turmeric -> chilli -> clove sea, slow swell. The "brand-defining hero" preset.
  saffronSea: {
    // camera/mesh values from the upstream "Nighty night" waterPlane preset (repos/shadergradient/.../presets.ts)
    type: 'waterPlane',
    shader: 'defaults',
    color1: '#f2a900',
    color2: '#b3261e',
    color3: '#2a1206',
    uSpeed: 0.2,
    uStrength: 1.5,
    uDensity: 1.5,
    uFrequency: 0,
    uAmplitude: 0,
    brightness: 1.1,
    reflection: 0.1,
    cAzimuthAngle: 180,
    cPolarAngle: 80,
    cDistance: 2.8,
    cameraZoom: 9.1,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    rotationX: 50,
    rotationY: 0,
    rotationZ: -60,
  },
  // Soft turmeric halo on cream: light pages, low contrast behind dark type.
  turmericHalo: {
    type: 'plane',
    shader: 'defaults',
    color1: '#e3a21a',
    color2: '#f6e3bd',
    color3: '#c8461e',
    uSpeed: 0.18,
    uStrength: 3.2,
    uDensity: 1.2,
    uFrequency: 5.5,
    uAmplitude: 1,
    brightness: 1.2,
    reflection: 0.1,
    cAzimuthAngle: 180,
    cPolarAngle: 90,
    cDistance: 3.6,
    cameraZoom: 1,
    positionX: -1.4,
    positionY: 0,
    positionZ: 0,
    rotationX: 0,
    rotationY: 10,
    rotationZ: 50,
  },
  // Kashmiri-chilli ember sphere: a contained orb, not a full-bleed wash.
  chilliEmber: {
    type: 'sphere',
    shader: 'defaults',
    color1: '#c1121f',
    color2: '#ff7a00',
    color3: '#2a0a05',
    uSpeed: 0.2,
    uStrength: 0.35,
    uDensity: 0.9,
    uFrequency: 5.5,
    uAmplitude: 3.2,
    brightness: 1.1,
    reflection: 0.1,
    cAzimuthAngle: 180,
    cPolarAngle: 90,
    cDistance: 3.4,
    cameraZoom: 9,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
  },
}

export default function ShaderGradientBg({
  preset = 'saffronSea',
  paused = false,
  pixelDensity = 1, // keep 1: the gradient is soft, DPR 2 quadruples fill cost for no visible gain
  fov = 45,
  className = '',
  style,
  ...overrides
}) {
  const wrapRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' })
    io.observe(el)
    const onVis = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const running = inView && tabVisible && !paused
  const props = { ...SPICE_GRADIENTS[preset], ...overrides }

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={className}
      style={{ width: '100%', height: '100%', position: 'relative', ...style }}
    >
      <Canvas
        dpr={pixelDensity}
        camera={{ fov }}
        linear
        flat
        frameloop={running ? 'always' : 'never'}
        resize={{ offsetSize: true }}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ShaderGradient
          control="props"
          animate={paused ? 'off' : 'on'}
          lightType="3d"
          grain="off"
          {...props}
        />
      </Canvas>
    </div>
  )
}
