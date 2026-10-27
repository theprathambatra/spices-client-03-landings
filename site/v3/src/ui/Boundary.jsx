import { Component } from 'react'
// If WebGL is unavailable the store must still work: swallow canvas errors.
export default class Boundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() {}
  render() { return this.state.failed ? null : this.props.children }
}
