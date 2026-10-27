import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const ref = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = ref.current
    document.documentElement.classList.add('has-cursor')
    const x = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'expo.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'expo.out' })
    const move = (e) => { x(e.clientX); y(e.clientY); el.style.opacity = 1 }
    const over = (e) => el.classList.toggle('is-hot', !!e.target.closest('a,button,[data-hot],input'))
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over); document.documentElement.classList.remove('has-cursor') }
  }, [])
  return <div ref={ref} className="cursor" aria-hidden="true" />
}
