// Source: kit-original — enforces the "Shader background policy" in docs/playbook/COMPONENTS.md | License: MIT (this project)
//
// The ONLY sanctioned way to put a WebGL background on a page:
//   const Silk = lazy(() => import('@kit/backgrounds/Silk'))
//   <ShaderStage shader={Silk} shaderProps={{ color: '#7a1e0e' }}
//                poster="radial-gradient(120% 80% at 30% 20%, #c8461e 0%, #3b1f0b 70%)" className="absolute inset-0" />
//
// What it guarantees:
//  1. A static poster (CSS background or image) is painted first and stays underneath: LCP never waits on GL.
//  2. The shader chunk is lazy (pass a React.lazy component) and only mounts once the stage is near the viewport.
//  3. No GL at all for prefers-reduced-motion, Save-Data, <4 cores / <4 GB RAM, no WebGL2, and (by default) phones.
//  4. The canvas fades in over the poster, so a slow first frame never shows as a black box.
//  5. aria-hidden: backgrounds are decoration; real text and CTAs stay in the DOM above it.
import { Suspense, useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'
import { usePrefersReducedMotion } from '../lib/hooks'

/** Cheap capability gate (no throwaway GL context is created). Exported for pages that need the same decision. */
export function canRunShader({ allowMobile = false } = {}) {
  if (typeof window === 'undefined') return false
  const nav = window.navigator || {}
  if (nav.connection && nav.connection.saveData) return false
  if (!allowMobile && window.matchMedia('(max-width: 767px), (pointer: coarse)').matches) return false
  if ((nav.hardwareConcurrency || 8) < 4) return false
  if ((nav.deviceMemory || 8) < 4) return false
  if (!('WebGL2RenderingContext' in window)) return false
  return true
}

export default function ShaderStage({
  shader: Shader,
  shaderProps,
  poster, // CSS background shorthand: gradient(s) and/or url(...) — shown always, under the canvas
  posterNode, // or any node (e.g. <img> / <picture> with the hero still)
  allowMobile = false,
  rootMargin = '200px',
  fadeMs = 900,
  className,
  style,
  children,
}) {
  const ref = useRef(null)
  const reduce = usePrefersReducedMotion()
  const [eligible, setEligible] = useState(false)
  const [near, setNear] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    setEligible(canRunShader({ allowMobile }))
  }, [allowMobile])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  const live = Boolean(Shader) && eligible && near && !reduce

  useEffect(() => {
    if (!live) {
      setShown(false)
      return
    }
    const t = setTimeout(() => setShown(true), 120)
    return () => clearTimeout(t)
  }, [live])

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      style={style}
      data-shader-state={live ? 'live' : 'poster'}
    >
      <div aria-hidden="true" className="absolute inset-0" style={poster ? { background: poster } : undefined}>
        {posterNode}
      </div>
      {live && (
        <div
          aria-hidden="true"
          className="absolute inset-0 transition-opacity ease-out"
          style={{ opacity: shown ? 1 : 0, transitionDuration: `${fadeMs}ms` }}
        >
          <Suspense fallback={null}>
            <Shader {...shaderProps} />
          </Suspense>
        </div>
      )}
      {children ? <div className="relative">{children}</div> : null}
    </div>
  )
}
