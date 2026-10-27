import { Component } from 'react'

export function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}

export default class GLBoundary extends Component {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  componentDidCatch(e) { console.warn('WebGL disabled:', e?.message?.slice(0, 80)) }
  render() { return this.state.err ? this.props.fallback ?? null : this.props.children }
}
