import { Component } from 'react'

// 3D must never break shopping: if WebGL fails, render the poster instead
export default class GLBoundary extends Component {
  state = { bad: false }
  static getDerivedStateFromError() { return { bad: true } }
  componentDidCatch() {}
  render() { return this.state.bad ? this.props.fallback : this.props.children }
}

export const DabbaPoster = () => (
  <svg className="poster" viewBox="0 0 300 300" aria-hidden="true">
    <ellipse cx="150" cy="262" rx="110" ry="12" fill="#3b1d08" opacity=".3" />
    <circle cx="150" cy="150" r="124" fill="#d8d9d3" stroke="#2A1710" strokeWidth="5" />
    <circle cx="150" cy="150" r="110" fill="none" stroke="#aab0b0" strokeWidth="3" />
    {[[150, 150], ...[0, 1, 2, 3, 4, 5].map((i) => [150 + 62 * Math.sin((i / 6) * 6.283 + 0.52), 150 + 62 * Math.cos((i / 6) * 6.283 + 0.52)])].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="29" fill="#aab0b0" stroke="#2A1710" strokeWidth="3" /><circle cx={x} cy={y} r="22" fill={['#E4501C', '#D9A00F', '#A8201A', '#8F6D3B', '#33231a', '#B09A52', '#5A3017'][i]} /></g>)}
  </svg>
)
