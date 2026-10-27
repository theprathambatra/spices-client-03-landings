# COMPONENTS CATALOG (web-hosted libraries and inspiration sites)

Generated 2026-10-22. Scope: Repo.txt sections 1, 2, 3 (website entries), 4. React Bits, R3F, drei, shadergradient, vanta, liquid-glass, liquid-logo, thinking-orbs and lenis source are handled elsewhere (their clones live in `repos/`).

All local paths are relative to the project root `P = /Users/shaurya_frenzy/Documents/Spices Client-03`. No install scripts from any cloned repo were run. Sources were shallow-cloned (`--depth 1`) and are for copy-paste only.

Stack assumed: React 19 + Vite + Tailwind 4 + `motion` + shadcn-style `cn()` util (`clsx` + `tailwind-merge`). Most libraries are Next.js-first. In Vite, drop `"use client"` (harmless but unneeded), replace `next/image` with `<img>`, and `next/link` with `<a>`.

## 0. Quick index: where to get source

| Library | Local source | Install |
|---|---|---|
| Magic UI | `repos/magicui/apps/www/registry/magicui/<name>.tsx` | `npx shadcn@latest add @magicui/<name>` or `npx shadcn@latest add https://magicui.design/r/<name>.json` |
| Motion Primitives | `repos/motion-primitives/components/core/<name>.tsx` | `npx shadcn@latest add "https://motion-primitives.com/c/<name>.json"` |
| Cult UI | `repos/cult-ui/apps/www/registry/default/ui/<name>.tsx` | `npx shadcn@latest add https://cult-ui.com/r/<name>.json` |
| SmoothUI | `repos/smoothui/packages/smoothui/components/<name>/` (demos: `repos/smoothui/apps/docs/examples/<name>.tsx`) | `npx shadcn@latest add https://smoothui.dev/r/<name>.json` |
| Componentry | `repos/componentry/packages/ui/src/components/<name>.tsx` | `npx shadcn@latest add https://componentry.dev/r/<name>.json` |
| Unlumen UI | `repos/unlumen-ui-docs/registry/primitives/<name>/` plus `repos/unlumen-mirror/<name>/` (registry JSON extracted) | `npx shadcn@latest add https://ui.unlumen.com/r/<name>.json` |
| Watermelon UI | `repos/watermelon-platform/src/data/contents/animated-components/<name>/` and `.../blocks/`, `.../templates/landing-01` | `npx shadcn@latest add https://ui.watermelon.sh/r/<name>.json` |
| Aceternity UI | `repos/aceternity-ui/<name>.tsx` (72 free components pulled from the public registry JSON; the repo itself is not public) | `npx shadcn@latest add https://ui.aceternity.com/registry/<name>.json` |
| Cursify | `repos/cursify/registry/components/cursor/**` and `.../pattern/**` | copy-paste only (no working shadcn URL; `/r/*.json` returns 404) |
| RetroUI (pixel) | `repos/retroui/src/components/*` | `npx pixel-retroui` (npm `pixel-retroui@2.1.0`) |
| Motion | `repos/motion/packages/` | `npm i motion` |
| Anime.js | `repos/animejs/src`, `repos/animejs/examples` | `npm i animejs` |
| Lenis | `repos/lenis` (cloned by the other agent) | `npm i lenis` |
| Skiper UI | not cloneable (see section 9) | `npx shadcn add @skiper-ui/skiperNN` (license key for Pro) |

Registry URL notes: the Aceternity registry index (all ~300 items incl. dependencies) is `https://ui.aceternity.com/registry/index.json`. Registry JSONs of the others are at `<host>/r/registry.json` (Motion Primitives at `/c/registry.json`). Some Aceternity and Unlumen entries are Pro and return 401 without a key (e.g. Aceternity `expandable-card-on-click`, Unlumen `video-slider`, `stacked-feature-cards`, `inline-testimonials`, `team-stack`, `dia-text-reveal`, `horizontal-depth-fade`, `pixel-scroll-transition`).

---

## 1. Magic UI  (https://magicui.design/)
- **Offers**: ~80 free animated components plus ~170 more registry items (templates, blocks). Built on Tailwind + Motion. Very polished, the safest default.
- **License**: MIT (repo `magicuidesign/magicui`, cloned to `repos/magicui`).
- **Install**: shadcn registry (`@magicui/<name>`), or copy from `repos/magicui/apps/www/registry/magicui/`.
- **Spice-site picks** (all in `repos/magicui/apps/www/registry/magicui/`):
  - Hero text: `text-animate`, `hyper-text`, `morphing-text`, `aurora-text`, `animated-gradient-text`, `line-shadow-text`, `sparkles-text`, `word-rotate`, `typing-animation`, `text-reveal` (scroll), `video-text`, `kinetic-text`, `dia-text-reveal`
  - Marquee: `marquee` (vertical + reverse + pause on hover), `scroll-based-velocity` (scroll-speed-reactive text ticker)
  - Cards: `magic-card` (mouse spotlight), `neon-gradient-card`, `bento-grid`, `glare-hover`, `lens` (magnifier, good for spice close-up zoom)
  - Buttons: `shimmer-button`, `interactive-hover-button`, `ripple-button`, `pulsating-button`, `shiny-button`, `rainbow-button`
  - Backgrounds: `light-rays`, `particles`, `meteors`, `retro-grid`, `warp-background`, `dot-pattern`, `grid-pattern`, `animated-grid-pattern`, `flickering-grid`, `noise-texture`, `ripple`, `floating-3d-particles`
  - Motion helpers: `blur-fade` (best simple scroll-in reveal), `number-ticker`, `border-beam`, `shine-border`, `scroll-progress`, `progressive-blur`, `pixel-image`
  - Cursors: `smooth-cursor`, `pointer`
  - Misc: `hero-video-dialog` (video modal), `dock`, `globe`, `dotted-map` (export origin map), `icon-cloud`, `orbiting-circles`, `highlighter`, `confetti`

## 2. Motion Primitives  (https://motion-primitives.com/)
- **Offers**: 33 small, unstyled-ish Motion primitives. Clean, minimal code, easy to restyle.
- **License**: MIT (`repos/motion-primitives/LICENCE.md`, spelled LICENCE).
- **Install**: `npx shadcn@latest add "https://motion-primitives.com/c/<name>.json"`; source in `repos/motion-primitives/components/core/`.
- **Picks**: `text-effect` (per-char/word/line presets with blur/slide/fade, the hero headline workhorse), `text-roll`, `text-scramble`, `text-shimmer`, `text-loop`, `text-morph`, `in-view` (scroll reveal wrapper), `animated-group` (stagger children), `infinite-slider` (marquee with blur edges, speed-on-hover), `carousel`, `tilt`, `spotlight`, `magnetic`, `cursor`, `glow-effect`, `border-trail`, `image-comparison`, `morphing-dialog` (product card to detail modal, great for spice products), `animated-number`, `sliding-number`, `progressive-blur`, `scroll-progress`, `transition-panel`, `spinning-text` (circular badge text).

## 3. Cult UI  (https://www.cult-ui.com/)
- **Offers**: ~150 components and large illustrated/hero blocks; shader heroes, 3D carousel, textured cards, Apple device mocks.
- **License**: MIT (`repos/cult-ui`).
- **Install**: `npx shadcn@latest add https://cult-ui.com/r/<name>.json`; source `repos/cult-ui/apps/www/registry/default/ui/<name>.tsx` (141 files).
- **Picks**: `three-d-carousel` (3D ring of images), `text-animate`, `gradient-heading`, `typewriter`, `rolling-number`, `texture-card`, `texture-button`, `cosmic-button`, `shift-card`, `cutout-card`, `folded-card`, `organic-card`, `bg-animated-gradient`, `bg-animated-fractal-dot-grid`, `bg-media` (video/image bg), `bg-image-texture`, `texture-overlay` (film grain), `hero-liquid-metal`, `hero-dithering`, `hero-heatmap`, `hero-color-panel`, `hero-static-radial-gradient`, `feature-carousel`, `logo-carousel`, `tweet-grid` (testimonial wall), `fluted-glass`, `distorted-glass`, `dither-image`, `edge-blur`, `family-button`, `dynamic-island`, `hover-video-player`, `squiggle-arrow`, `pixel-heading-*`.

## 4. SmoothUI  (https://smoothui.dev/docs/components)
- **Offers**: 230+ components (Motion-based) plus landing blocks: `cta-1..3`, `faq-1..4`, `features-1..3`, `footer-1..4`, `header-1..6`, `logo-cloud-1..4`, `pricing-1..3`, `stats-1..2`, `testimonials-1..3`. Heavy on scroll text/image reveals and shader-reveal page transitions.
- **License**: MIT (`repos/smoothui`).
- **Install**: `npx shadcn@latest add https://smoothui.dev/r/<name>.json`; source in `repos/smoothui/packages/smoothui/components/<name>/`.
- **Picks**: `product-card` (ready-made e-commerce card), `reviews-carousel`, `coverflow-carousel`, `photo-stack`, `scrollable-card-stack`, `scroll-reveal-paragraph`, `scroll-image-reveal`, `svg-draw-on-scroll` (draw a spice-trail path on scroll), `kinetic-type-scroll`, `depth-parallax-words`, `parallax-layers`, `per-character-rise`, `reveal-text`, `rolling-text`, `shine-text`, `wave-text`, `perspective-text-3d`, `magnetic-button`, `cursor-follow`, `cursor-image-trail`, `drawing-cursor`, `infinite-slider`, `page-preloader`, `scroll-progress`, `progressive-blur`, `holographic-foil`, `liquid-metal`, `glass-card`, `tilt-card`, `inline-testimonials`, `shader-reveal-*-transition` (WebGL page transitions), `testimonials-1..3`, `stats-1..2`, `logo-cloud-*`.

## 5. Componentry  (https://componentry.dev/)
- **Offers**: 57 high-end effects, many WebGL/canvas (some need `three`/`ogl`).
- **License**: MIT (`repos/componentry`).
- **Install**: `npx shadcn@latest add https://componentry.dev/r/<name>.json`; source `repos/componentry/packages/ui/src/components/<name>.tsx`.
- **Picks**: `kinetic-text-reveal`, `letter-cascade`, `text-repel`, `cursor-driven-particle-typography`, `scroll-choreography`, `scroll-tilted-grid`, `scroll-split-card`, `sticky-scroll-cards`, `scroll-based-velocity`, `spiral-3d-slider`, `wheel-carousel`, `liquid-glass-carousel`, `collection-surfer`, `fisheye-infinite-grid`, `infinite-image-field`, `image-trail`, `pixel-image-trail`, `image-ripple-effect`, `hover-transition`, `grain-gradient`, `silk-aurora`, `aurora-flow`, `liquid-chrome`, `webgl-liquid`, `animated-gradient`, `prism-gradient`, `spectral-ribbon`, `closing-plasma`, `hero-geometric`, `dither-prism-hero`, `magnetic-dock`, `magnet-lines`, `orbit-card-stack`, `layered-stack`, `case-study-flip-stack`.

## 6. Unlumen UI  (https://ui.unlumen.com/components)
- **Offers**: ~100 free components plus a paid tier; docs repo is public.
- **License**: MIT (`repos/unlumen-ui-docs`), some registry items are Pro (401).
- **Install**: `npx shadcn@latest add https://ui.unlumen.com/r/<name>.json`. Source: `repos/unlumen-ui-docs/registry/primitives/<name>/` (partial) and `repos/unlumen-mirror/<name>/` (extracted free ones).
- **Picks (free, mirrored)**: `vertical-marquee`, `scroll-reveal-image`, `orbital-image-wheel`, `hover-feature-cards`, `page-transition`, `text-reveal`, `cursor-image-trail`, `magnetic-button`, `progressive-blur`, `perspective-flow`, `velocity-highlight`, `animated-list`. In repo primitives: `tilt-card`, `shimmering-text`, `scramble-text`, `count-up`, `clipped-circle`.

## 7. Watermelon UI  (https://ui.watermelon.sh/)
- **Offers**: ~590 components (each with a `-base` variant), blocks (hero, bento, cta, faq, feature, footer, pricing, stats, testimonials, navigation...), dashboards, and a full `landing-01` template. Many are app UI (finance, onboarding); useful parts are carousels, disclosure/morph interactions, and blocks.
- **License**: MIT (`repos/watermelon-platform`).
- **Install**: `npx shadcn@latest add https://ui.watermelon.sh/r/<name>.json`. Source: `repos/watermelon-platform/src/data/contents/{animated-components,blocks,templates}/`.
- **Picks**: `radial-carousel`, `carousel-slider`, `minimal-carousel`, `adaptive-slider`, `revealing-cards`, `card-swipe`, `card-split-accordian`, `morphing-button`, `gooey-menu`, `expandable-profile-card`, `collection-grid-disclosure`, blocks under `blocks/hero`, `blocks/bento`, `blocks/testimonials`, `blocks/cta`, `blocks/footer`, and `templates/landing-01` (read for layout structure).

## 8. Aceternity UI  (https://ui.aceternity.com/)
- **Offers**: ~300 components/blocks/templates (about 100 free components; Pro blocks/templates paid, All-Access). Built on Motion + Tailwind (+ Three.js in globe/shader items). Industry-standard "wow" components.
- **License**: components free for use (code is copy-paste, source repo is private); the registry JSON includes full source. Pro templates require a purchase. Treat free component usage as permitted per their site terms.
- **Install**: `npx shadcn@latest add https://ui.aceternity.com/registry/<name>.json`. Local mirror of 72 free components (flat): `repos/aceternity-ui/<name>.tsx` plus `<name>.meta.json` listing npm deps (usually `motion`, `clsx`, `tailwind-merge`, `@tabler/icons-react`, sometimes `three`).
- **Picks (mirrored)**: `apple-cards-carousel` (+ `use-outside-click`), `3d-card`, `3d-marquee`, `3d-pin`, `infinite-moving-cards`, `text-generate-effect`, `text-reveal-card`, `flip-words`, `typewriter-effect`, `colourful-text`, `container-text-flip`, `layout-text-flip`, `encrypted-text`, `text-hover-effect`, `hero-parallax`, `parallax-scroll`, `container-scroll-animation`, `sticky-scroll-reveal`, `tracing-beam`, `macbook-scroll`, `bento-grid`, `glowing-effect`, `card-spotlight`, `wobble-card`, `glare-card`, `comet-card`, `focus-cards`, `card-stack`, `animated-testimonials`, `timeline`, `background-beams`, `background-gradient-animation`, `aurora-background`, `vortex`, `lamp`, `sparkles`, `meteors`, `wavy-background`, `background-ripple-effect`, `dotted-glow-background`, `noise-background`, `moving-border`, `hover-border-gradient`, `magnetic-button`, `stateful-button`, `floating-dock`, `floating-navbar`, `resizable-navbar`, `following-pointer`, `pointer-highlight`, `animated-modal`, `carousel`, `images-slider`, `compare`, `lens`, `link-preview`, `globe`, `world-map`, `layout-grid`, `direction-aware-hover`, `google-gemini-effect`, `canvas-reveal-effect`, `liquid-glass`, `cloud-shader`, `dither-shader`.
- Not mirrored (fetch via `registry/index.json` if needed): background-cubes-grid, ascii-art, scales, text-flipping-board, features/hero section blocks.

## 9. Skiper UI  (https://skiper-ui.com/)
- **Offers**: 106+ components named `skiper1..skiperNN`, one file each, modeled on "Devouring Details" style craft (dynamic island, image cursor trail, Vercel tooltip). About 54+ are paid ($549 lifetime all-access).
- **License**: free tier is shown on the site; Pro requires a license key (`/r/skiper1.json` returns "Missing license key"). Not open source, so not cloned.
- **Install**: `npx shadcn add @skiper-ui/skiper40` (CLI namespace). Use only the free ones; copy from the site viewer. Low priority since equivalents exist in Magic UI/Smooth UI.

## 10. Cursify  (https://cursify.vercel.app/)
- **Offers**: ~30 cursor effects and canvas patterns (by ui-layouts).
- **License**: no license file or `license` field found in the repo; treat as unlicensed, so check with the author before shipping verbatim, or reimplement from these as reference.
- **Install**: copy-paste only from `repos/cursify/registry/components/`.
- **Picks**: cursors `common/magnetic-cursor.tsx`, `smooth-cursor-follower.tsx`, `spotlight-cursor.tsx`, `trail-cursor.tsx`, `fluid-cursor.tsx`, `ripple-cursor.tsx`, `scaling-cursor.tsx`, `text-icon-cursor.tsx`, `threed-cursor.tsx`, `fairydust/`, `blob-cursor/`, `neoncursor/`, `neural-glow/`; patterns `pattern/flowing-ribbons`, `smooth-wavy-canvas`, `interactive-dots`, `dot-particles`, `delicate-ascii-dots`.
- For a spice brand: scaling/magnetic/spotlight cursor for premium feel; fairydust works as a "spice dust" cursor trail.

## 11. RetroUI  (https://retroui.io/components)
- **Offers**: pixelated retro/8-bit components (`pixel-retroui`: Accordion, Bubble, Button, Card, Dropdown, Input, Popup, ProgressBar, TextArea).
- **License**: BSD 3-Clause (`repos/retroui`). Local: `repos/retroui/src/components/`.
- **Fit**: poor for a premium spice brand. Only for a deliberate retro/nostalgic variant (e.g. a "vintage spice bazaar" concept). Skip by default.

## 12. Three UI  (https://threeui.com/browse)
- **Offers**: Three.js components, WebGL backgrounds, hero sections, text animation, complete website templates (Kairo, Meridian, RenderLab...). Has an MCP and a pricing page; sources are gated behind purchase ("source-backed variants").
- **License**: commercial/paid. Not cloned. Use for inspiration (browse categories: Landing Pages, Buttons, 3D Assets, Backgrounds, Text Animation, Hero). Rebuild effects with R3F.

## 13. Animmaster Lib  (https://animmasterlib.dev/)
- **Offers**: 300 "PRO-level" components rebuilt from top-tier sites: scroll animations, mouse effects, page transitions, grid animations, sliders, hero animations, WebGL shaders, navigation menus, 3D, physics, SVG. Packs: Junior ~$3, PRO ~$4.99, Premium ~$8 (on-sale prices seen).
- **License**: paid per pack. Not cloned. Use the free previews as reference for GSAP/WebGL patterns (grid, slider, page-transition categories are the most relevant).

## 14. Animos  (https://animos.app/)
- **Offers**: browser tool, 25 animation templates for showcasing designs; export MP4/WebM. Not a code library.
- **Use**: produce short product reveal videos (e.g. pack shots) for hero background video or social. Not part of the code stack.

## 15. Motion  (https://motion.dev/)
- **Offers**: the animation engine (formerly Framer Motion): layout, scroll, gestures, springs. Motion+ (paid) adds extra components; `npx motion-ai` adds AI helper docs.
- **License**: MIT (`repos/motion`). Version at time of writing: `motion@14.5.0`. See cheat sheet.

## 16. Anime.js  (https://animejs.com/)
- **Offers**: v4 modular engine: `animate`, `createTimeline`, `stagger`, `onScroll`, `createDraggable`, `svg` helpers (`morphTo`, `createDrawable`), `splitText`, `createScope` (React cleanup).
- **License**: MIT (`repos/animejs`, examples in `repos/animejs/examples`). `animejs@4.5.0`.

## 17. Lenis templates  (https://lenis.dev/templates)
- Templates page lists Framer/Webflow-style smooth-scroll site templates (clearpath etc.), inspiration only. Library is MIT (`repos/lenis`, `lenis@1.3.27`). See cheat sheet.

## 18. ShaderGradient, Spline AI, Haikei (backgrounds)
- **ShaderGradient** (https://shadergradient.co/): editor for animated 3D gradient (React lib `@shadergradient/react`; repo cloned by other agent at `repos/shadergradient`). Free; use as hero background (warm saffron/turmeric/chili palette).
- **Spline AI** (https://spline.design/ai-generate): browser 3D design with AI generation; export via `@splinetool/react-spline`. Free tier plus paid; heavy runtime. Useful to author a hero object (spice jar/bowl) if no GLB model; prefer exporting a GLB and rendering in R3F for performance.
- **Haikei** (https://haikei.app/): free SVG generator (waves, layered steps, blobs, grids, gradients). No signup. Export SVG for section dividers (wave between hero and product grid) and blob backgrounds. Tool only; no repo.

## 19. Design inspiration sites
- **Refero Styles** (https://styles.refero.design/): 2,000+ real site styles with AI-readable `DESIGN.md` (colors, typography, spacing). Search "earthy terracotta" or "friendly startup". Download a DESIGN.md and feed it to the builder as the style brief.
- **SkeuDesign** (https://www.skeudesign.com/collections): AI skeuomorphic 3D PNG icons; 20 free icons per category, lifetime $29.99. Useful for spice icons (chili, cinnamon, garlic). Check licensing for commercial use before shipping.
- **MotionSites** (https://motionsites.ai/): premium AI website prompts, hero/features sections, animated video backgrounds, MCP. Prompts paste into Claude Code; backgrounds are MP4 loops. Mostly paid.
- **VividSites** (https://www.vividsites.app/): 312 cinematic templates and 112 components (components free), 3D/shader/scroll-film. Use for reference structure of scroll-driven storytelling. Not cloned.

---

## Spice-landing section map (which library for what)

| Section | Go-to libraries |
|---|---|
| Hero headline | Motion Primitives `text-effect`, Magic UI `text-animate`/`hyper-text`, Componentry `kinetic-text-reveal`, Aceternity `text-generate-effect` |
| Hero bg | ShaderGradient, Magic UI `light-rays`/`particles`, Cult `bg-animated-gradient`/`hero-liquid-metal`, Componentry `grain-gradient`/`silk-aurora` |
| Marquees | Magic UI `marquee`, Motion Primitives `infinite-slider`, Unlumen `vertical-marquee`, Aceternity `3d-marquee`/`infinite-moving-cards` |
| Product cards | SmoothUI `product-card`, Aceternity `3d-card`/`glare-card`, Motion Primitives `tilt`/`morphing-dialog`, Magic UI `magic-card` |
| Carousels | Aceternity `apple-cards-carousel`, Cult `three-d-carousel`, Componentry `spiral-3d-slider`/`wheel-carousel`, SmoothUI `coverflow-carousel` |
| Bento | Magic UI `bento-grid`, Aceternity `bento-grid` + `glowing-effect` |
| Cursors | Cursify `magnetic`/`spotlight`, Magic UI `smooth-cursor`, SmoothUI `cursor-image-trail` |
| Scroll reveals | Magic UI `blur-fade`, Motion Primitives `in-view`, SmoothUI `scroll-reveal-paragraph`/`scroll-image-reveal`, Aceternity `container-scroll-animation`/`sticky-scroll-reveal`/`tracing-beam` |
| Buttons | Magic UI `shimmer-button`/`interactive-hover-button`, Cult `texture-button`, Aceternity `moving-border` |
| Testimonials | Aceternity `animated-testimonials`, SmoothUI `reviews-carousel`, Cult `tweet-grid` |

---

## TOP 25 PICKS

Local path columns are under `P`. Commands are `npx shadcn@latest add <url>`.

| # | Component | Section | Source path / command |
|---|---|---|---|
| 1 | Motion Primitives `text-effect` | Hero headline | `repos/motion-primitives/components/core/text-effect.tsx` |
| 2 | Magic UI `blur-fade` | Generic scroll reveal (everywhere) | `repos/magicui/apps/www/registry/magicui/blur-fade.tsx` |
| 3 | Componentry `kinetic-text-reveal` | Hero or brand-story headline | `repos/componentry/packages/ui/src/components/kinetic-text-reveal.tsx` |
| 4 | SmoothUI `scroll-reveal-paragraph` | Brand story / about | `repos/smoothui/packages/smoothui/components/scroll-reveal-paragraph/` |
| 5 | Magic UI `marquee` | Press/logo strip, ingredient ticker | `repos/magicui/apps/www/registry/magicui/marquee.tsx` |
| 6 | Magic UI `scroll-based-velocity` | Big text ticker between sections | `repos/magicui/apps/www/registry/magicui/scroll-based-velocity.tsx` |
| 7 | Motion Primitives `infinite-slider` | Certifications / retailer logos | `repos/motion-primitives/components/core/infinite-slider.tsx` |
| 8 | Aceternity `3d-marquee` | Gallery wall (recipes, UGC) | `repos/aceternity-ui/3d-marquee.tsx` |
| 9 | Aceternity `apple-cards-carousel` | Product range / recipes carousel | `repos/aceternity-ui/apple-cards-carousel.tsx` (+ `use-outside-click.tsx`) |
| 10 | Cult UI `three-d-carousel` | Hero-adjacent product ring | `repos/cult-ui/apps/www/registry/default/ui/three-d-carousel.tsx` |
| 11 | Componentry `spiral-3d-slider` | Signature "wow" product slider | `repos/componentry/packages/ui/src/components/spiral-3d-slider.tsx` |
| 12 | SmoothUI `product-card` | Shop grid | `repos/smoothui/packages/smoothui/components/product-card/` |
| 13 | Aceternity `3d-card` | Featured product, hover depth | `repos/aceternity-ui/3d-card.tsx` |
| 14 | Motion Primitives `morphing-dialog` | Product card to quick view | `repos/motion-primitives/components/core/morphing-dialog.tsx` |
| 15 | Magic UI `magic-card` | Benefit / feature cards | `repos/magicui/apps/www/registry/magicui/magic-card.tsx` |
| 16 | Magic UI `bento-grid` | "Why our spices" bento | `repos/magicui/apps/www/registry/magicui/bento-grid.tsx` |
| 17 | Aceternity `glowing-effect` | Bento card border glow | `repos/aceternity-ui/glowing-effect.tsx` |
| 18 | Aceternity `container-scroll-animation` | Pack-shot scroll reveal | `repos/aceternity-ui/container-scroll-animation.tsx` |
| 19 | Aceternity `sticky-scroll-reveal` | Sourcing / process steps | `repos/aceternity-ui/sticky-scroll-reveal.tsx` |
| 20 | SmoothUI `svg-draw-on-scroll` | Farm-to-jar journey line | `repos/smoothui/packages/smoothui/components/svg-draw-on-scroll/` |
| 21 | Magic UI `shimmer-button` | Primary CTA (Shop now) | `repos/magicui/apps/www/registry/magicui/shimmer-button.tsx` |
| 22 | Magic UI `smooth-cursor` / Cursify `spotlight-cursor` | Global cursor | `repos/magicui/apps/www/registry/magicui/smooth-cursor.tsx`, `repos/cursify/registry/components/cursor/common/spotlight-cursor.tsx` |
| 23 | Cult UI `texture-overlay` + Componentry `grain-gradient` | Hero background (warm grain) | `repos/cult-ui/apps/www/registry/default/ui/texture-overlay.tsx`, `repos/componentry/packages/ui/src/components/grain-gradient.tsx` |
| 24 | Aceternity `animated-testimonials` | Reviews | `repos/aceternity-ui/animated-testimonials.tsx` |
| 25 | Magic UI `number-ticker` | Stats (years, farms, orders) | `repos/magicui/apps/www/registry/magicui/number-ticker.tsx` |

Honorable mentions: Unlumen `vertical-marquee` (`repos/unlumen-mirror/vertical-marquee/`), SmoothUI `page-preloader`, SmoothUI `reviews-carousel`, Cult UI `tweet-grid`, Magic UI `lens` (spice macro zoom), Motion Primitives `tilt`/`spotlight`/`magnetic`.

---

## Animation cheat sheet (React + Vite)

Versions seen on npm 2026-10-22: `motion 14.5.0`, `gsap 3.15.0`, `@gsap/react 2.1.2`, `lenis 1.3.27`, `animejs 4.5.0`, `three 0.186.1`, `@react-three/fiber 9.8.2`, `@react-three/drei 10.7.9`, `react 19.3.1`, `tailwindcss 4.3.3`, `vite 8.3.5`. Pin versions in package.json; verify peer ranges at install (R3F 9 pairs with React 19).

### Motion (import from `motion/react`, not `framer-motion`)
```tsx
import { motion, useScroll, useTransform, useSpring, useInView, stagger, AnimatePresence } from "motion/react";
import { animate, scroll, inView } from "motion";            // vanilla/imperative

// Reveal on enter
<motion.div initial={{opacity:0,y:40,filter:"blur(8px)"}}
  whileInView={{opacity:1,y:0,filter:"blur(0px)"}}
  viewport={{once:true, margin:"-15% 0px"}}
  transition={{duration:.8, ease:[.22,1,.36,1]}} />

// Stagger via variants
const list = {show:{transition:{staggerChildren:.08}}}, item = {hidden:{opacity:0,y:24}, show:{opacity:1,y:0}};

// Scroll-linked (parallax / progress)
const ref = useRef(null);
const {scrollYProgress} = useScroll({target:ref, offset:["start end","end start"]});
const y = useTransform(scrollYProgress,[0,1],["-15%","15%"]);
const smooth = useSpring(scrollYProgress,{stiffness:120,damping:30});
<motion.img style={{y}} />

// Shared-element / layout: <motion.div layout layoutId="card-1" />, wrap exits in <AnimatePresence mode="wait">
```
Tips: animate `transform`/`opacity` only; `useReducedMotion()` to respect prefers-reduced-motion; with Lenis, `useScroll` keeps working because Lenis scrolls the real window.

### Lenis (`lenis`, React bindings `lenis/react`)
```tsx
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
<ReactLenis root options={{ lerp:0.1, duration:1.2, smoothWheel:true }}>{children}</ReactLenis>
useLenis(({scroll,velocity,progress}) => {/* scroll callback */});
// Anchor: lenis.scrollTo("#shop",{offset:-80,duration:1.4}); lenis.stop()/start() for modals
```
GSAP sync (vanilla instance, `autoRaf:false`):
```ts
import Lenis from "lenis"; import gsap from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis({ autoRaf:false });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t*1000));
gsap.ticker.lagSmoothing(0);
```
With `ReactLenis`, use `<ReactLenis root options={{autoRaf:false}} ref={lenisRef}/>` and `gsap.ticker.add(t => lenisRef.current?.lenis?.raf(t*1000))`. Add `data-lenis-prevent` to inner scrollable areas (modals, carts).

### GSAP + ScrollTrigger (`@gsap/react`)
```tsx
import gsap from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger"; import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);   // all plugins are free since GSAP 3.13 (SplitText, ScrollSmoother, etc.)

const root = useRef(null);
useGSAP(() => {
  gsap.from(".reveal", { y:60, opacity:0, stagger:.1, scrollTrigger:{ trigger:".section", start:"top 80%" } });
  gsap.timeline({ scrollTrigger:{ trigger:".pin", start:"top top", end:"+=2000", scrub:1, pin:true } })
      .to(".jar",{ rotate:360, scale:1.4 }).to(".copy",{ opacity:1 }, "<");
}, { scope: root });          // auto-reverts on unmount; use contextSafe() for event handlers
```
SplitText: `SplitText.create(".h1",{type:"lines,words",mask:"lines"})` then animate `split.words`. Horizontal scroll: tween `x:()=>-(el.scrollWidth-innerWidth)` with `pin`, `scrub`, `invalidateOnRefresh:true`. Call `ScrollTrigger.refresh()` after images load. Use `ScrollTrigger.matchMedia`/`gsap.matchMedia()` to disable pinning on mobile.

### Anime.js v4 (`animejs`, named imports only)
```ts
import { animate, createTimeline, stagger, onScroll, splitText, createScope, svg } from "animejs";
animate(".chip", { y:[40,0], opacity:[0,1], delay:stagger(80), duration:800, ease:"outExpo" });
animate(".card", { x:300, autoplay:onScroll({ target:".card", enter:"bottom top", leave:"top bottom", sync:true }) });
const { chars } = splitText("h1", { chars:true }); animate(chars, { y:[20,0], opacity:[0,1], delay:stagger(30) });
animate(svg.createDrawable("path"), { draw:["0 0","0 1"], ease:"inOutQuad" });   // line draw
// React: const scope = createScope({ root }); scope.add(() => animate(...)); cleanup -> scope.revert()
```
Note v4 differs from v3: no default export, `ease` (not `easing`), `onScroll` replaces ScrollObserver naming; check `repos/animejs/examples`.

### R3F scroll sync (3D hero)
Drive 3D from the same scroll value: `useFrame(() => { group.current.rotation.y = lenis.progress * Math.PI*2 })`, or drei `<ScrollControls pages={4} damping={0.2}>` + `useScroll()` (note: ScrollControls creates its own scroll container, so do not combine with Lenis on the same page; for a Lenis site use `lenis.progress`/`useLenis` inside `useFrame` via a ref). Use `frameloop="demand"` for static scenes and `dpr={[1,2]}`.

### Rules of thumb
1. One scroll engine: Lenis for smoothing, ScrollTrigger or Motion `useScroll` for logic.
2. Motion for component/enter/exit/layout; GSAP for pinned, scrubbed, timeline-heavy sections; Anime.js only for SVG/stagger niceties (avoid mixing three engines on one element).
3. Always clean up (`useGSAP`, `scope.revert()`, Motion handles its own).
4. Respect `prefers-reduced-motion`; lazy-load R3F canvas; compress images (AVIF/WebP) and models (Draco/meshopt).
