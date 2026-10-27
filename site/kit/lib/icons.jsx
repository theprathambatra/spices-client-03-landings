// Source: kit-local inline SVG icons (stroke style matches Tabler/Lucide) — replaces @tabler/icons-react, lucide-react, @radix-ui/react-icons and @hugeicons so the kit adds no icon dependency | License: MIT (this project)
const base = (size, props) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
  ...props,
})

export const ArrowLeftIcon = ({ size = 20, ...p }) => (
  <svg {...base(size, p)}><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></svg>
)
export const ArrowRightIcon = ({ size = 20, ...p }) => (
  <svg {...base(size, p)}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
)
export const ArrowUpRightIcon = ({ size = 20, ...p }) => (
  <svg {...base(size, p)}><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
)
export const XIcon = ({ size = 20, ...p }) => (
  <svg {...base(size, p)}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
)
