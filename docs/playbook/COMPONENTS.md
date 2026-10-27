# COMPONENTS — the verified kit, install paths, and the shader policy

Project root `P = /Users/shaurya_frenzy/Documents/Spices Client-03`. Paths below are relative to `P/site/` unless they start with `repos/` or `docs/`.
Written 2026-10-24. Every claim marked **verified** was executed in this session: the build, screenshots, perf runs and the CLI runs.

**Rule zero: build from `site/kit/` first.** Every kit component has been converted to JSX, adapted to this stack, built, rendered and screenshotted on one page (`kit-lab`), with zero console errors.
Use the CLI (section 3) only for things the kit does not have, and follow its safety rules.

---

## 1. Using the kit (5 lines)

```css
/* v3/src/styles.css (or any page stylesheet) */
@import 'tailwindcss';
@import '../../kit/kit.css';      /* tokens + keyframes the components need; override :root tokens to brand it */
```
```jsx
import { Marquee } from '@kit/marquee/Marquee'          // '@kit' alias is in vite.config.js (and jsconfig.json for editors)
import ProductCard from '@kit/cards/ProductCard'
import { cn } from '@kit/lib/utils'                      // clsx + tailwind-merge, same contract as shadcn's lib/utils
```

- **Theme contract (`kit/kit.css`).** It holds shadcn-named tokens (`--background --foreground --card --muted --muted-foreground --border --primary --primary-foreground --accent --ring`) with cream/chilli/turmeric defaults, plus a `.dark` set. `dark:` follows a `.dark` class and never the OS setting, so a light page cannot flip. The file also carries the Magic UI keyframes (`animate-marquee`, `animate-shimmer-slide`, `animate-spin-around`) and pauses them under `prefers-reduced-motion`. A page brands the kit by overriding the `:root` tokens.
- **Helpers.** `kit/lib/utils.js` provides `cn`. `kit/lib/icons.jsx` has inline SVG arrows and close icons, which replace `@tabler/icons-react`, `lucide-react`, `@radix-ui/react-icons` and `@hugeicons`. `kit/lib/hooks.js` provides `useOutsideClick`, `useMeasure` (a callback-ref stand-in for react-use-measure) and `usePrefersReducedMotion`.
- **Header line.** Every kit file starts with `// Source: <repos path> | License: …`. Every local change is marked inline with `// kit:` comments.
- **Seeing everything.** Run `PAGE=kit-lab npx vite build && npx vite preview --port 5320`, then open `http://localhost:5320/kit-lab/`. Ports 5171–5175, 5180 and 5300 are reserved.

## 2. Kit index

Size is the marginal **gzip** of the component alone. react, motion, gsap, three and R3F are excluded because the site already ships them. `cn` (clsx + tailwind-merge) adds 8.5 KB gz once.
Deps lists packages beyond react, and all of them are already in `package.json`.

### Text
| Component | File | Use it for | Key props | Deps | Cost |
|---|---|---|---|---|---|
| SplitText | `text/SplitText.jsx` | Hero/section headline reveal, per char/word/line | `text tag splitType('chars'/'words'/'lines') effect('rise'/'fade'/'blur'/'flip'/'pop'/'skew'/'wave') delay duration trigger('view') mask textAlign` | gsap SplitText + ScrollTrigger, @gsap/react | 2.9 KB; waits for fonts, one ScrollTrigger |
| BlurText | `text/BlurText.jsx` | Soft blur-in for taglines | `text animateBy('words'/'letters') direction effect('blur'/'zoom'…) delay blur distance trigger loop` | motion | 2.7 KB; IntersectionObserver |
| ShinyText | `text/ShinyText.jsx` | Gold shimmer on one premium phrase ("Single-origin") | `text color shineColor speed angle shineWidth trigger('loop'/'hover'/'view') followPointer pauseOnHover` | none | 2.7 KB; one rAF while visible |
| RotatingText | `text/RotatingText.jsx` | "Made for {dal / biryani / chai}" word swap | `texts rotationInterval effect('slide'/'flip'/'blur'/'scale') splitBy staggerDuration mainClassName splitLevelClassName` | motion | 2.6 KB |
| ScrollReveal | `text/ScrollReveal.jsx` | Brand-story paragraph that sharpens as you scroll | `children baseOpacity blurStrength baseRotation splitBy mode('scrub') textClassName` | gsap ScrollTrigger | 2.3 KB; scrubbed, one span per word |
| TextEffect | `text/TextEffect.jsx` | General headline workhorse (Motion Primitives) | `per('char'/'word'/'line') preset('fade-in-blur'/'blur'/'slide'/'scale'/'fade') as delay trigger` | motion | 1.1 KB |
| TextScramble | `text/TextScramble.jsx` | Batch codes, harvest dates, "lab report" moments | `children duration speed characterSet as trigger onScrambleComplete` (remount via `key` to replay) | motion | 0.5 KB |

### Marquees
| Component | File | Use it for | Key props | Deps | Cost |
|---|---|---|---|---|---|
| Marquee | `marquee/Marquee.jsx` | Ingredient/press/certification strip | `reverse pauseOnHover vertical repeat` + `className="[--duration:32s] [--gap:1rem]"` | none (kit.css keyframes) | 0.4 KB; pure CSS, paused under reduced motion |
| ScrollVelocity | `marquee/ScrollVelocity.jsx` | Big spice-name ticker that speeds/skews with scroll | `texts velocity fontSize color skewWithVelocity outlineAlternate pauseOnHover fadeEdges draggable` | motion | 2.4 KB; scroll-driven motion values |

### Buttons
| Component | File | Use it for | Key props | Deps | Cost |
|---|---|---|---|---|---|
| Magnetic | `buttons/Magnetic.jsx` | Pull on the ONE primary CTA | `intensity range actionArea('self'/'parent'/'global') springOptions` | motion | 0.7 KB |
| ShimmerButton | `buttons/ShimmerButton.jsx` | "Shop the harvest" primary CTA | `background shimmerColor shimmerDuration borderRadius` | none (kit.css keyframes) | 0.9 KB; CSS only |

### Cards
| Component | File | Use it for | Key props | Deps | Cost |
|---|---|---|---|---|---|
| Card3D | `cards/Card3D.jsx` (`CardContainer/CardBody/CardItem`) | Featured product with layered depth on hover | `CardItem translateZ rotateX… as` | none | 0.9 KB |
| Tilt | `cards/Tilt.jsx` | Light hover tilt on any card/image | `rotationFactor isRevese springOptions` | motion | 0.5 KB |
| MagicCard | `cards/MagicCard.jsx` | Benefit cards with cursor spotlight border | `mode('gradient'/'orb') gradientColor gradientFrom gradientTo glowFrom glowTo glowBlendMode` | motion | 1.3 KB |
| SpotlightCard | `cards/SpotlightCard.jsx` | Dark premium card with light following the pointer | `spotlightColor intensity spotlightSize shape('circle'/'beam') borderGlow theme('dark'/'light') grain` | none | 2.8 KB |
| ProductCard | `cards/ProductCard.jsx` | Shop grid card: badge, rating, price/discount, wishlist, add-to-cart morph | `image title subtitle price originalPrice currency('₹') locale('en-IN') rating badge onAddToCart onWishlist` | motion | 2.8 KB; reduced-motion aware |

### Carousels and galleries
| Component | File | Use it for | Key props | Deps | Cost |
|---|---|---|---|---|---|
| CircularGallery | `gallery/CircularGallery.jsx` | "Shop by blend" curved catalogue (drag/wheel/keys) | `items[{image,text}] bend textColor font borderRadius scrollEase itemSize snap autoScroll onItemClick openOnClick` | none (raw WebGL2) | 9.3 KB; 1 GL context, pauses off-screen. Pass `font` to avoid its Google-Fonts fetch |
| Carousel + Card | `gallery/AppleCardsCarousel.jsx` | Recipe/story cards that open into a modal | `Carousel items` · `Card card{category,title,src,content} index layout` | motion | 2.2 KB |
| ImageTrail | `gallery/ImageTrail.jsx` | Spice photography trailing the pointer on a hero | `items size rotation threshold lifetime drift stack tilt` | gsap | 1.9 KB; desktop pointer only |
| Lens | `gallery/Lens.jsx` | Macro zoom on powder/whole-spice texture | `zoomFactor lensSize isStatic position lensColor ariaLabel` | motion | 0.9 KB |

### Layout and reveals
| Component | File | Use it for | Key props | Deps | Cost |
|---|---|---|---|---|---|
| BentoGrid + BentoCard | `layout/BentoGrid.jsx` | "Why our spices" bento | `BentoCard name description href cta background Icon className(col-span)` | none | 1.0 KB |
| GlowingEffect | `layout/GlowingEffect.jsx` | Pointer-tracking border glow on bento/subscribe cards | `disabled={false} spread proximity inactiveZone glow borderWidth colors[4]` | motion | 1.6 KB; one pointermove listener per card |
| BlurFade | `layout/BlurFade.jsx` | Default enter reveal everywhere | `delay duration offset direction inView blur` | motion | 0.5 KB |
| MorphingDialog | `layout/MorphingDialog.jsx` (`Trigger/Container/Content/Image/Title/Subtitle/Description/Close`) | Product card to quick-view morph | `transition` on root; `variants disableLayoutAnimation` on Description | motion | 1.9 KB; portal, Esc and outside-click close |

### Cursors
| Component | File | Use it for | Key props | Deps | Cost |
|---|---|---|---|---|---|
| SmoothCursor | `cursor/SmoothCursor.jsx` | Global premium cursor (mount once at root) | `cursor springConfig` | motion | 1.8 KB; off for touch and reduced motion |
| ClickSpark | `cursor/ClickSpark.jsx` | Tactile burst on CTAs ("tadka crackle") | `sparkColor(string or array) sparkCount sparkRadius shape('line'/'streak'/'dot'/'star') gravity glow ring` | none (canvas 2D) | 3.3 KB |

### Navigation
| Component | File | Use it for | Key props | Deps | Cost |
|---|---|---|---|---|---|
| StaggeredMenu | `nav/StaggeredMenu.jsx` | Full-screen editorial menu | `items[{label,link,ariaLabel}] socialItems logo logoUrl colors accentColor panelBackground panelTextColor menuButtonColor openMenuButtonColor isFixed position` | gsap | 4.4 KB |
| FlowingMenu | `nav/FlowingMenu.jsx` | Category rows with marquee band on hover | `items[{text,link,image,meta}] textColor bgColor marqueeBgColor marqueeTextColor borderColor showArrow showIndex` | none | 5.3 KB |
| Dock | `nav/Dock.jsx` | Magnifying bottom dock (mobile shop bar or app-like nav) | `items[{label,icon,onClick,badge,active,menu}\|{separator:true}] theme('dark'/'light') accentColor badgeColor magnification position autoHide` | none | 8.6 KB |

### Numbers and testimonials
| Component | File | Use it for | Key props | Deps | Cost |
|---|---|---|---|---|---|
| NumberTicker | `numbers/NumberTicker.jsx` | Stats that count up on view | `value startValue decimalPlaces delay locale('en-IN')` | motion | 0.6 KB |
| SlidingNumber | `numbers/SlidingNumber.jsx` | Cart quantity and price that roll | `value padStart decimalSeparator` (no thousands grouping) | motion | 1.0 KB |
| AnimatedTestimonials | `social/AnimatedTestimonials.jsx` | Reviews with stacked photos | `testimonials[{quote,name,designation,src}] autoplay` | motion | 1.3 KB |

### Backgrounds (only through `ShaderStage`; read section 4 first)
| Component | File | Look | Key props | Deps | Measured cost (see 4.3) |
|---|---|---|---|---|---|
| ShaderStage | `backgrounds/ShaderStage.jsx` | Policy wrapper: poster, lazy mount, gating, fade-in | `shader(lazy) shaderProps poster posterNode allowMobile rootMargin fadeMs` | none | 1.0 KB |
| Silk | `backgrounds/Silk.jsx` | Saffron/chilli satin cloth | `color sheenColor speed scale noiseIntensity rotation sheen ripple wave paused dpr` | none (WebGL2) | 5.3 KB gz · mount 176 ms · GPU p95 3.3 ms |
| Iridescence | `backgrounds/Iridescence.jsx` | Oil/ghee sheen | `color[r,g,b] speed amplitude brightness saturation hueShift mouseReact` | none (WebGL2) | 4.7 KB gz · mount 79 ms · GPU p95 1.5 ms |
| Threads | `backgrounds/Threads.jsx` | Saffron-thread wave lines | `color accentColor amplitude distance lineCount thickness fray enableMouseInteraction` | none (WebGL2) | 4.7 KB gz · mount 115 ms · GPU p95 3.2 ms |
| LiquidChrome | `backgrounds/LiquidChrome.jsx` | Liquid gold/copper | `color speed amplitude interactive rippleStrength roughness maxDevicePixelRatio` | none (WebGL2) | 6.2 KB gz · mount 192 ms · GPU p95 3.1 ms |
| MetallicPaint | `backgrounds/MetallicPaint.jsx` | Liquid-metal wordmark/logo (liquid-logo/paper-shader style) | `text` or `imageSrc`, `fontFamily fontWeight color scale speed mouseTilt` | none (WebGL2) | 6.9 KB gz · mount **240 ms** · +15 MB heap · GPU p95 3.2 ms |
| ShaderGradientBg | `backgrounds/ShaderGradientBg.jsx` | ShaderGradient presets `saffronSea` / `turmericHalo` / `chilliEmber` | `preset paused pixelDensity(1)` + any ShaderGradient prop | @shadergradient/react, three, R3F | **45.6 KB gz** (+236 KB gz if the page has no three/R3F) · 4 long tasks · +13 MB heap · GPU p95 2.9 ms |

### Adaptations and upstream bugs fixed (so nobody re-copies the broken originals)
- **StaggeredMenu (React Bits, Tailwind variant).** Upstream has a stray `import StaggeredMenu …` pasted into the middle of its CSS string (`.staggered-menu-panel { poimport …`), which kills the panel's `position`. Fixed. The kit also added `logo`/`panelBackground`/`panelTextColor` props (upstream hard-coded a React Bits logo path and a white panel), plus `inert` on the closed panel.
- **AppleCardsCarousel (Aceternity).** Upstream had every *closed* card listening for Escape, so Escape anywhere scrolled the carousel. Each card also forced `body{overflow:auto}` on mount. Both now apply only while the card is open. `next/image` props (`fill`, `blurDataURL`) leaked to `<img>` and caused React warnings, so they are stripped. The kit adds aria-labels, `role="dialog"` and `data-lenis-prevent`.
- **AnimatedTestimonials (Aceternity).** Upstream called `Math.random()` per render, so the photo stack jittered on every re-render. Tilts are now stable per photo.
- **SlidingNumber.** `react-use-measure` is only a transitive dependency. The replacement `useMeasure` must use a **callback ref**, because the component swaps the measured node. A ref-object version renders no digits at all; this was caught on the lab screenshots.
- **MagicCard.** The `next-themes` dependency was replaced by a `glowBlendMode` prop. **SmoothCursor** also respects reduced motion and restores the previous body cursor. **NumberTicker** gains `locale` (default `en-IN`, which gives lakh grouping). **GlowingEffect** gains `colors[4]`. **ProductCard** swaps its SmoothButton workspace package for a token-styled button, uses ₹/`en-IN`, adds `subtitle`, and wraps cleanly in a 2-up mobile grid.
- **BentoGrid.** The shadcn `<Button asChild>` and radix icon were replaced by a styled `<a>` and an inline SVG. The colours now use kit tokens.
- **Leftover type-only imports.** Type erasure left `Transition`, `Variant`, `MotionProps`, `MotionStyle` and `SpringOptions` imported from `motion/react`; these were removed because Rollup warns that they are "not exported". **Check for this after converting any TS component.**

## 3. Installing anything NOT in the kit

### 3.1 What is set up in `site/`
- `components.json` sets `tsx:false`, so the CLI transpiles TS to JSX. It sends components to `@kit/registry` (that is, `kit/registry/`), points `utils` at `@kit/lib/utils` and CSS at `kit/kit.css`, and declares namespaces for every library (below).
- `jsconfig.json` maps `@kit/*` and `@shared/*`; the shadcn CLI needs this to resolve aliases.
- **Do NOT run `npx shadcn init`.** It was tested in scratch: it adds `radix-ui`, `lucide-react`, `class-variance-authority`, `tw-animate-css`, `@fontsource-variable/geist`, the `cn` package and `shadcn` as a dependency, and writes 129 lines of neutral theme CSS. Everything it would provide is already in `kit/lib/utils.js` and `kit/kit.css`.

### 3.2 Safety rules (each one learned by running it)
1. **The CLI rewrites dependency versions.** `npx shadcn add @react-bits/CountUp-JS-TW` changed `"motion": "^14.5.0"` to `"^12.43.0"` and installed 12.43.0, because React Bits declares `motion@^12`. There is no skip-dependencies flag. Only the designated install agent may run a real `add` in `site/`, and afterwards they must check `git diff package.json` and restore pinned versions.
2. **Every other agent uses the no-write path.** That path is `npx shadcn@latest add <item> --dry-run --view kit/registry/<File>.jsx`. It prints the already-transpiled JSX without touching `package.json` or disk. Paste the output into `kit/`, add the `// Source:` header, swap foreign icons and hooks for `kit/lib`, and add a specimen to `kit-lab`.
3. **Look for `framer-motion`.** Componentry's `letter-cascade` still imports `framer-motion` and pulled it in as a dependency. Rewrite the import to `motion/react` and never add `framer-motion`.
4. **Folder-style items collide under `--path`.** With `--path`, SmoothUI and Unlumen items flatten to `kit/registry/index.jsx` and overwrite each other. The second run *hangs* on an overwrite prompt. Install those without `--path`; they land in `kit/registry/smoothui/<name>/index.jsx` and `kit/registry/unlumen-ui/…`.
5. **Aceternity ignores the aliases.** Its items hard-code `components/ui/<name>.tsx` as their target, so always pass `--path kit/registry`.
6. **Expect extra dependencies.** SmoothUI `magnetic-button` pulls `@radix-ui/react-slot` and `class-variance-authority`. Unlumen `vertical-marquee` pulls `react-tweet`. Aceternity items often list `@tabler/icons-react`. Swap these for `kit/lib/icons.jsx` and `kit/lib/hooks.js` rather than installing them.
7. **Use an explicit `--path`, never the default.** Without it, items land wherever their registry says (`components/ui`, `components/smoothui`, …), and `--overwrite` can clobber `kit/` files.

### 3.3 Per-library commands

All commands run from `site/` and were verified in scratch copies of `site/package.json`. For a no-write preview, append `--dry-run --view <path>`.

| Library | Command (verified) | Notes |
|---|---|---|
| React Bits | `npx shadcn@latest add @react-bits/<Name>-JS-TW --path kit/registry` | Variants `-JS-TW` (our stack), `-JS-CSS`, `-TS-TW`, `-TS-CSS`. Source is also in `repos/react-bits/src/tailwind/<Category>/<Name>/`. Downgrades motion (rule 1). |
| React Bits via jsrepo | `npx jsrepo init https://reactbits.dev/r` → `npm i -D jsrepo` → set `paths: { component: './kit/registry' }` in `jsrepo.config.ts` → `npx jsrepo add ShinyText-JS-TW` | Works (jsrepo 3.8.2) but adds a devDependency and a TS config. The shadcn route is preferred. |
| Magic UI | `npx shadcn@latest add @magicui/<name>` | Built-in namespace. Lands in `kit/registry/magicui/`. CSS keyframes are appended to `kit/kit.css`. |
| Aceternity UI | `npx shadcn@latest add @aceternity/<name> --path kit/registry` (or `https://ui.aceternity.com/registry/<name>.json`) | Rule 5. Index of everything is at `https://ui.aceternity.com/registry/index.json`. A local mirror of 72 items is at `repos/aceternity-ui/`. |
| Motion Primitives | `npx shadcn@latest add @motion-primitives/<name> --path kit/registry` (= `https://motion-primitives.com/c/<name>.json`) | Clean; motion only. |
| Cult UI | `npx shadcn@latest add @cult-ui/<name> --path kit/registry` (= `https://cult-ui.com/r/<name>.json`) | Some items need `class-variance-authority`. |
| SmoothUI | `npx shadcn@latest add @smoothui/<name>` (no `--path`, rule 4) | Folder items. `product-card` is already in the kit. |
| Componentry | `npx shadcn@latest add @componentry/<name> --path kit/registry` | Rule 3 (`framer-motion`). Some items need `three` or `ogl`, which are already installed. |
| Unlumen UI | `npx shadcn@latest add @unlumen/<name>` (no `--path`) | Some items are Pro and return 401. Watch for `react-tweet`. |
| Cursify | Copy from `repos/cursify/registry/components/cursor/**` | **No license file**: reimplement rather than copy verbatim. Its `/r/*.json` URLs return 404. |
| ShaderGradient | Already installed (`@shadergradient/react@2.4.20`); use `kit/backgrounds/ShaderGradientBg.jsx` | Use `lightType="3d"` only; `"env"` fetches HDRs from `ruucm.github.io` at runtime. |
| liquid-logo / paper shaders | **Do not copy `repos/liquid-logo`**: it is PolyForm Shield (non-compete). | Use `kit/backgrounds/MetallicPaint.jsx` (React Bits, same technique). |
| Anime.js | `npm i animejs` (install agent only) | Not needed: motion and gsap cover it. |
| Vanta | Do not install | Legacy global-THREE. Mine `repos/vanta/src` for ideas only. |
| liquid-glass-js | Do not install | html2canvas snapshot glass is fragile. Use CSS `backdrop-filter` or React Bits `GlassSurface` via the CLI. |
| thinking-orbs | Copy `repos/thinking-orbs/src` | 2D canvas, React-only peer. Use as a loader or for a "finding your blend" state. |

## 4. Shader background policy (strict)

### 4.1 The rule
A WebGL/shader background is allowed **only if all five** of the following are true. If any one fails, use CSS or an image.

1. **One brand-defining moment.** At most one shader per page, for the hero or one signature feature section (for example a liquid-gold wordmark, a saffron-silk hero or a spice-sea product launch). It is never decoration for ordinary sections (benefits, reviews, FAQ, footer, cards, product grid) and never "ambient texture".
2. **No cheaper equivalent.** First try a CSS gradient or mesh-gradient (layered `radial-gradient`), an SVG `feTurbulence` grain, a WebP/AVIF still, or a short muted `<video>` loop under 1.5 MB. Only motion that reacts (to the pointer or to scroll) or that cannot be faked with a loop qualifies. Write that justification in the section component as a comment.
3. **Within budget** (measured with `tools/perf.mjs`, 4x CPU, and the stress method in 4.3):
   - shader chunk ≤ 10 KB gz (raw WebGL2), or ≤ 50 KB gz if three/R3F already ship on that page;
   - mount long task ≤ 250 ms at 4x CPU, and never on the critical path (lazy, after first paint);
   - scrolling stays at 60 fps with `jankFrames(>50ms)=0` at 4x CPU;
   - GPU p95 ≤ 4 ms per frame at 2880×1800 on the reference Mac (which leaves headroom on weaker integrated GPUs);
   - one live GL context per viewport (the R3F hero counts), two per page at most.
4. **Static fallback.** It is mounted only through `ShaderStage` with a `poster`: a CSS gradient that matches the first frame, or a WebP still via `posterNode`. The poster paints first and is the LCP. That poster is what phones (by default), `prefers-reduced-motion`, Save-Data, devices with fewer than 4 cores or less than 4 GB, and browsers without WebGL2 get, so it must look finished on its own.
5. **Accessible and well behaved.** The shader is `aria-hidden`, and real text sits above it with a contrast scrim if needed. Text contrast must pass against the poster *and* the brightest shader frame. It pauses off-screen and in hidden tabs (the kit components and `ShaderGradientBg` already do), and nothing flashes faster than 3 Hz.

**Default to "no".** The lab tiles show every shader at 16:9 to prove they work. That is not a licence to use six; a real page uses zero or one.

### 4.2 How to mount one (the only sanctioned pattern)
```jsx
import { lazy } from 'react'
import ShaderStage from '@kit/backgrounds/ShaderStage'
const Silk = lazy(() => import('@kit/backgrounds/Silk'))   // lazy: the GL code is its own chunk

// Justification (policy 4.1/2): hero cloth reacts to pointer; no CSS/video equivalent. Budget: see COMPONENTS.md 4.3.
<ShaderStage
  shader={Silk}
  shaderProps={{ color: '#7a1e0e', sheenColor: '#f6c76b', speed: 3, noiseIntensity: 1.2 }}
  poster="radial-gradient(120% 90% at 25% 15%, #b8452a 0%, #7a1e0e 38%, #2a0a05 100%)"
  className="absolute inset-0"
/>
```
`allowMobile` exists for a measured exception. Use it only after running the bench with `&force=1` on the target page **and** testing on a real mid-range Android device.

### 4.3 Measured cost (2026-10-24)
**Bench page.** `kit-lab/?bench=<key>` renders one shader as a fixed full-viewport layer behind 300vh of content, which is the worst case the policy allows. `?bench=none` is the baseline, and `&force=1` lets phones run the shader.

**Tools and hardware.**
- `node tools/perf.mjs <url>` was run with 4x CPU throttle. At run time another agent had switched it to `channel: 'chrome'`, so these runs used installed Google Chrome with the Metal GPU flags.
- The GPU columns come from a supplementary script that reuses perf.mjs's 4x CPU throttle. It runs at DPR 2 (2880×1800) with vsync and the frame-rate limit disabled, and samples 6 s of frames.
- Both ran on an Apple M5 Pro (`ANGLE Metal Renderer`). Every run reported 0 console errors.

| Shader | chunk gz | perf.mjs desktop (4x CPU) | perf.mjs phone (policy) | phone `force=1` | GPU p95, uncapped DPR2 | retina capped |
|---|---|---|---|---|---|---|
| none (baseline) | – | 60 fps · p95 17 ms · 0 jank · longest 75 ms · 4 MB | 60 fps · 0 canvases | – | – | 60 fps |
| Iridescence | 4.7 KB | 60 · 0 jank · longest **79 ms** · 4 MB | poster, 0 canvases | 60 · 74 ms · 4 MB | **1.5 ms** (1266 fps) | 60, 0 frames >20 ms |
| Threads | 4.7 KB | 60 · 0 jank · 115 ms · 4 MB | poster | 60 · 78 ms · 5 MB | 3.2 ms (928 fps) | 60, 0 |
| Silk | 5.3 KB | 60 · 0 jank · 176 ms · 5 MB | poster | 60 · 76 ms · 5 MB | 3.3 ms (875 fps) | 60, 0 |
| LiquidChrome | 6.2 KB | 60 · 0 jank · 192 ms · 4 MB | poster | 60 · 74 ms · 4 MB | 3.1 ms (1062 fps) | 60, 0 |
| MetallicPaint | 6.9 KB | 60 · 0 jank · **240 ms** · **19 MB** | poster | 60 · 131 ms · 25 MB | 3.2 ms (1044 fps) | 60, 0 |
| ShaderGradientBg | 45.6 KB (+236 KB w/o three/R3F) | 60 · 0 jank · 103 ms · **4 long tasks** · **17 MB** | poster | 60 · 73 ms · 17 MB | 2.9 ms (1343 fps, DPR 1 internally) | 60, 0 |

**How to read this.**
- On this machine every shader holds 60 fps even at 4x CPU, because they are GPU-bound and CPU throttling does not slow the GPU. The real CPU cost is the mount long task and the heap.
- Uncapped GPU frame time is 1.5–3.3 ms on an M5 Pro. A mid-range Android or older Intel iGPU is roughly 10–20x slower, which puts these at 15–60 ms per frame. That is why phones get the poster by default.
- **Cheapest:** Iridescence. **Most expensive:** MetallicPaint (it solves a Poisson field of the text mask on mount, which costs CPU and heap). ShaderGradient costs the most bytes, and is only reasonable on a page that already ships R3F.
- Re-measure after changing a shader's props: `lineCount`, `detail`, `dpr` and `scale` change GPU cost.

### 4.4 Decision shortcuts
| Want | Use |
|---|---|
| Warm gradient wash behind a hero | CSS layered `radial-gradient` + `kit.css` tokens (0 KB). The `POSTERS` in `kit-lab/src/shaders.js` are good starting points. |
| Film grain | SVG `feTurbulence` data-URI overlay (see the `NOISE` constant in `kit/cards/SpotlightCard.jsx`) |
| Moving texture that doesn't react | Muted, looping, `playsinline` AV1/H.264 `<video>` with a poster, or nothing |
| Liquid-gold logo moment | `MetallicPaint` via `ShaderStage`, mounted once, never above the fold on mobile |
| Pointer-reactive cloth/sheen hero | `Silk` / `Iridescence` / `LiquidChrome` via `ShaderStage` |
| 3D spice-sea and the page already has R3F | `ShaderGradientBg preset="saffronSea"` via `ShaderStage` |

## 5. Verification record (this session)
- **Build:** `PAGE=kit-lab npx vite build` passes with no warnings beyond chunk size. The lab bundle is 257 KB gz for the whole gallery; each shader is a separate lazy chunk.
- **Preview and screenshots:** served on port 5320 and captured with Playwright (Chromium, `--enable-gpu --use-angle=metal --ignore-gpu-blocklist`). All 38 specimens were captured at 1440 and 390 width after a slow full-page scroll. Result: **0 console errors and 0 warnings**, all six shaders live on desktop, all six posters on mobile.
- **Interactions exercised:** ImageTrail sweep, Lens hover, GlowingEffect proximity, FlowingMenu hover band, Dock magnify and label, StaggeredMenu open/close, ClickSpark, Magnetic, Card3D tilt, ProductCard add-to-cart (morphs to "Added", fires the callback), SlidingNumber, MorphingDialog open and Esc, Apple card modal open and Esc, SmoothCursor toggle, testimonial next. All passed with 0 errors.
- **Reduced motion** (`reducedMotion: 'reduce'`): all shader tiles stay on their poster with 0 canvases in the backgrounds section, and 0 errors.
- **Mobile:** at 390 px, no horizontal overflow (`scrollWidth == clientWidth`).

## 6. Licenses
| Source | License | Shipping note |
|---|---|---|
| React Bits | MIT + Commons Clause | Fine inside the client's site. Do not resell or redistribute the components as a pack. |
| Magic UI, Motion Primitives, Cult UI, SmoothUI, Componentry | MIT | Keep the header line. |
| Aceternity UI (free items) | Aceternity's free-use terms (no repo license) | Free components only; Pro items return 401. |
| ShaderGradient | MIT | |
| liquid-logo | PolyForm Shield 1.0.0 | Not used; MetallicPaint replaces it. |
| Cursify | none found | Reference only. |
