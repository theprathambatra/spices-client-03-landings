// Mutable bridges between DOM/scroll and the WebGL scenes. Never setState per tick.
import * as THREE from 'three'

export const hero = { p: 0 } // 0..1 across the sticky hero
export const pointer = { x: 0, y: 0, active: false, lastMove: 0 } // ndc
export const tin = {
  open: 0, // 0..1 lid
  idx: 0, // active SKU
  yaw: 0, // extra spin from SKU change
  progress: 0,
  colA: new THREE.Color('#E2400F'),
  colB: new THREE.Color('#FFB347'),
  tColA: new THREE.Color('#E2400F'),
  tColB: new THREE.Color('#FFB347'),
  pulse: 0,
  spinning: false,
}

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
      pointer.active = e.pointerType !== 'touch'
      pointer.lastMove = performance.now()
    },
    { passive: true },
  )
}
