import { Component } from 'react'

// Keeps the store usable if WebGL cannot start (blocked GPU, context limits, old devices).
export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    const g = c.getContext('webgl2') || c.getContext('webgl')
    g?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!g
  } catch { return false }
}

export default class GLBoundary extends Component {
  state = { failed: false, ok: typeof document === 'undefined' ? true : hasWebGL() }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(e) { console.warn('3D disabled:', e?.message) }
  render() {
    if (this.state.failed || !this.state.ok) return this.props.fallback ?? null
    return this.props.children
  }
}
