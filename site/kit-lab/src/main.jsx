import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './lab.css'
import App from './App.jsx'
import Bench from './Bench.jsx'

// ?bench=<shader>  renders one shader as a fixed page background behind 300vh of content (for tools/perf.mjs)
const bench = new URLSearchParams(location.search).get('bench')

createRoot(document.getElementById('root')).render(<StrictMode>{bench ? <Bench name={bench} /> : <App />}</StrictMode>)
