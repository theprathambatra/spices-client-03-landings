import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

// compile shaders in parallel (non-blocking) before the first frame renders
export default function Prewarm({ onReady }) {
  const { gl, scene, camera } = useThree()
  useEffect(() => {
    let dead = false
    const done = () => { if (!dead) onReady() }
    const t = setTimeout(() => {
      if (gl.compileAsync) gl.compileAsync(scene, camera).then(done, done); else done()
    }, 50)
    return () => { dead = true; clearTimeout(t) }
  }, [gl, scene, camera, onReady])
  return null
}
