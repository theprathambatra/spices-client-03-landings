# Three.js / R3F Playbook for the Spice D2C Landing Pages

Project root `P` = `/Users/shaurya_frenzy/Documents/Spices Client-03`. Everything below was verified against the cloned sources in `P/repos/` (paths are relative to `P/repos/` unless stated). Facts that come from reading source are marked as such; npm versions were checked with `npm view` on 2026-10-22.

---------------------------------------------------------------------------

## 0. Key findings (read this first)

1. **Most of React Bits' backgrounds/animations are now zero-dependency raw WebGL2** (they `getContext('webgl2')` themselves; no three, no ogl). Only a handful use `three`, `ogl` or R3F. Copying them is just "copy the .tsx (+ .css)"; no package install needed. This makes them cheap, but each owns its own `<canvas>`/GL context, so keep to 1-2 per viewport (browsers cap ~16 contexts).
2. **Component source locations** in `react-bits/src/`: `ts-default/` (TypeScript, plain CSS), `ts-tailwind/` (TypeScript + Tailwind), `content/` (JS/JSX default). Each component is a folder `Category/Name/Name.tsx` (+ `Name.css` sometimes). Categories: `Backgrounds`, `Animations`, `Components`, `TextAnimations`, `Micro`.
3. **R3F 9 and drei 10 require React 19** (`react: ^19`). For React 18 you must use R3F 8.17 + drei 9.122 (see section 1).
4. `shadergradient` (`@shadergradient/react`) is an R3F component (peer: `three`, `@react-three/fiber`, `three-stdlib`, `camera-controls`).
5. `liquid-logo` is a Next app; its real shader is `liquid-logo/src/app/hero/liquid-frag.ts` (GLSL ES 3.00 fragment) and the canvas wiring in `liquid-logo/src/hero/canvas.tsx`. The maintained packaged version is `@paper-design/shaders-react` (`LiquidMetal`).
6. `thinking-orbs` is NOT 3D/WebGL: it is a 2D canvas dot-projection engine (`src/engine/*`, ~1,080 lines, only peer dep `react`). Useful as a loader / "AI-concierge" orb / tiny inline spinner.
7. `liquid-glass-js` is vanilla JS (`container.js`, `button.js`) that uses `html2canvas` to snapshot the page and refracts it in a WebGL shader. Heavy and fragile; prefer CSS/SVG glass or drei `MeshTransmissionMaterial` / React Bits `FluidGlass` / `GlassSurface`.
8. `vanta` effects (`vanta/src/vanta.*.js`) are window-global-THREE/p5 based legacy; only worth mining for ideas/shaders (see section 3.8).

---------------------------------------------------------------------------

## 1. Recommended stack (exact packages)

### 1.1 Primary: React 19 + Vite (what React Bits itself ships with)

React Bits' own `react-bits/package.json` is a working, tested combination:

```
react ^19.0.0, react-dom ^19.0.0
three ^0.180.0, @types/three ^0.180.0
@react-three/fiber ^9.3.0   (latest 9.8.2)
@react-three/drei ^10.7.4   (latest 10.7.9)
@react-three/postprocessing ^3.0.4  (latest 3.2.2)  + postprocessing ^6.36.0 (latest 6.39.5)
@react-three/rapier ^2.1.0  (latest 2.2.0)
gsap ^3.13.0 (latest 3.15.0), @gsap/react ^2.1.2
lenis ^1.3.13 (latest 1.3.27)
motion ^12.23.12 (latest 14.5.0; import from "motion/react")
maath ^0.10.8, ogl ^1.0.11, matter-js ^0.20.0, meshline ^3.3.1
vite ^5.3.4
```

Install line (pins three to the proven minor; R3F 9.8 / drei 10.7.9 peer ranges are `three >=0.159`, so any of 0.180 - 0.186 is legal):

```bash
npm i react@^19 react-dom@^19 \
  three@~0.180.0 @react-three/fiber@^9.8.2 @react-three/drei@^10.7.9 \
  @react-three/postprocessing@^3.2.2 postprocessing@^6.39.5 \
  @react-three/rapier@^2.2.0 maath@^0.10.8 \
  gsap@^3.15.0 @gsap/react@^2.1.2 lenis@^1.3.27 motion@^12 \
  three-custom-shader-material@^6.4.0 zustand@^5
npm i -D vite@^6 @vitejs/plugin-react@^4.3 typescript @types/three@~0.180.0 vite-plugin-glsl@^1.6.2
# dev only: leva, r3f-perf, stats-gl (drei <StatsGl/>)
```

Notes:
- Vite 8.3.5 and `@vitejs/plugin-react` 6 exist on npm; Vite 5/6 + plugin-react 4 is the conservative, known-good pair. If scaffolding with the newest `create-vite`, keep its pair as is.
- `lenis/react` provides `<ReactLenis root>` and `useLenis` (verified: `lenis/packages/react/src/provider.tsx`, `use-lenis.ts`). The old `@studio-freight/*` packages are deprecated; use `lenis`.
- GSAP: **all plugins (SplitText, ScrollTrigger, ScrollSmoother, Flip, MorphSVG, DrawSVG, ScrambleText...) are free in the public `gsap` package** (confirmed in the installed `gsap-plugins` skill). Import `gsap/ScrollTrigger`, `gsap/SplitText`, etc. No tokens.
- `three-custom-shader-material` (CSM) lets you inject vertex/fragment chunks into `MeshPhysicalMaterial` (keeps lights, transmission, shadows). Use it for displaced/animated PBR spice materials.
- Drei's `Text`/`Text3D` need `troika-three-text` (bundled with drei) / typeface JSON (use `three/examples/fonts/helvetiker_bold.typeface.json` or `FontData`; for brand type prefer HTML text overlaid on canvas).
- Import addons from `three/addons/...` (not `three/examples/jsm/...`) per the installed R3F skill. React Bits' ModelViewer still uses `three/examples/jsm/loaders/OBJLoader.js`, which Vite resolves fine; just don't copy that style into new code.
- `THREE.Clock` is deprecated in r183; in R3F keep using `useFrame((state, delta) => ...)` and read `state.clock.elapsedTime` (NOT `getElapsedTime()`, per the skill).

### 1.2 Fallback: React 18

```
react@^18.3 react-dom@^18.3
three@~0.170.0 @types/three@~0.170.0
@react-three/fiber@^8.17.10  @react-three/drei@^9.122.0
@react-three/postprocessing@^2.19.1 postprocessing@^6.36
@react-three/rapier@^1.5.0
```
(`shadergradient/packages/shadergradient` devDeps pin `@react-three/fiber ^8.17.10`, confirming 8.17 is the React-18 line.) `@shadergradient/react` and `motion` accept React 18 or 19. Prefer React 19 unless a client constraint forces 18.

### 1.3 Scaffold decisions

- One Vite+React+TS app per landing page (5 apps), or one monorepo with shared `packages/spice-3d`. Put shared recipes (section 4) in a shared folder.
- Tailwind v4 via `@tailwindcss/vite` (what React Bits uses) is fine; React Bits `ts-tailwind/` variants drop straight in.
- Smooth scroll boilerplate (Lenis driving GSAP ScrollTrigger, single RAF):

```tsx
// SmoothScroll.tsx
import { useEffect, useRef } from 'react';
import { ReactLenis, type LenisRef } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    const lenis = lenisRef.current?.lenis;
    lenis?.on('scroll', ScrollTrigger.update);
    return () => { gsap.ticker.remove(update); lenis?.off('scroll', ScrollTrigger.update); };
  }, []);
  return <ReactLenis root options={{ autoRaf: false, lerp: 0.1 }} ref={lenisRef}>{children}</ReactLenis>;
}
```

- Scroll -> 3D bridge: never call `setState` per scroll tick. Use a mutable object read in `useFrame`:

```ts
// scrollState.ts
export const scroll = { progress: 0, velocity: 0 };   // 0..1 across a pinned hero
// in the page: ScrollTrigger.create({ trigger:'#hero', start:'top top', end:'+=300%', pin:true,
//   scrub:true, onUpdate:s => { scroll.progress = s.progress; scroll.velocity = s.getVelocity(); } });
// in 3D:  useFrame((_, dt) => { x = damp(x, scroll.progress, 4, dt) })   // maath/easing damp
```

- Keep the Canvas as ONE fixed, full-viewport layer (`position:fixed; inset:0; pointer-events:none`) behind HTML sections, or one per hero section when the page is multi-hero. HTML text always stays real DOM (SEO, accessibility, LCP).

---------------------------------------------------------------------------

## 2. Skills installed (P/.claude/skills/)

Source repos cloned to `repos/threejs-skills` (CloudAI-X/threejs-skills, 13 skills, current-API oriented incl. r182/r183 deprecations, WebGPU/TSL) and `repos/gsap-skills` (greensock/gsap-skills, official, 8 skills). Also cloned for reference only (not copied): `repos/mint-threejs-skills` (game-oriented: app-director, visual-systems, qa-release...) and `repos/claudekit-skills` (`.claude/skills/threejs`). No install scripts were run, `~/.claude` untouched.

Each skill is a folder `P/.claude/skills/<name>/SKILL.md` (+ sometimes extras). Key rules from their "Common Mistakes" sections:

| Skill | Use it for | Key rules |
|---|---|---|
| `threejs-react-three-fiber` | Any R3F work | Targets fiber 9.8 + React 19 + drei 10.7. Never `requestAnimationFrame`; use `useFrame((s, delta)=>...)`. Never `setState` in useFrame - mutate refs. Use `state.clock.elapsedTime`, not `getElapsedTime()`. Positive `useFrame` priority disables auto-render. `position` must be array/Vector3, not object. `useGLTF` (suspends+caches), never `GLTFLoader` in effects. `<primitive object>` not `scene.add`. `extend({...})` before using addon classes as JSX. `frameloop="demand"` needs `invalidate()` after imperative mutation. `<OrbitControls makeDefault/>` not raw class. `shadows="percentage"` not boolean (PCFSoft deprecated r182). Use `SkeletonUtils.clone` inside `useMemo` for cloned GLTFs. |
| `threejs-shaders` | Custom GLSL / TSL | Always end ShaderMaterial frag with `#include <tonemapping_fragment>` and `#include <colorspace_fragment>` or colours look dark. `ShaderMaterial` always compiles GLSL ES 3.00 (don't set `glslVersion`); `RawShaderMaterial` needs `glslVersion: THREE.GLSL3`. Don't name a uniform `position`; declare `uv1`. `ShaderMaterial` ignores `material.opacity` - add a uniform. On InstancedMesh multiply `instanceMatrix` in your vertex shader. `modelViewMatrix` etc. are auto-declared. Use `opaque_fragment` (not `output_fragment`). |
| `threejs-performance` | Perf | Measure first with `renderer.info` (read AFTER render). Merge static geometry, `InstancedMesh`/`BatchedMesh`, LOD. Transparent overdraw is the real cost on fullscreen layers. Don't disable `frustumCulled` scene-wide; only on shader-displaced meshes. No allocations in the loop (hoist Vector3/Matrix4). `renderer.compileAsync`. Dispose geometries AND textures. Use `layers`/explicit list for raycasts. Use `Timer` not `Clock`. |
| `threejs-fundamentals` | Scene/camera/renderer/tone mapping/cleanup | Fog, cameras, tone mapping, object hierarchy, disposal. |
| `threejs-geometry` | Procedural shapes | Built-ins, `LatheGeometry`, `ExtrudeGeometry`, `TubeGeometry`, instancing, `BufferGeometryUtils.mergeGeometries`, points/lines, 3D text. |
| `threejs-materials` | PBR / physical / transmission | Material choice, env response, node materials/TSL equivalents. |
| `threejs-lighting` | Lights, shadows, env maps | HDR/RoomEnvironment lighting, shadow acne fixes, physical units. |
| `threejs-postprocessing` | Bloom, DOF, custom passes | Always end the chain with `OutputPass`; FXAA after it, SMAA before it; `UnrealBloomPass` resolution = full composer size; use `composer.setSize`. (In R3F use `@react-three/postprocessing`, same ordering principles.) |
| `threejs-textures` | Textures, colour spaces, render targets, KTX2 | `SRGBColorSpace` for colour maps, linear for data maps; texture memory. |
| `threejs-loaders` | glTF/Draco/KTX2/HDR | `three/addons/...` paths; cloning and disposal. |
| `threejs-asset-pipeline` | gltf-transform, gltfjsx | Compress models (Draco/meshopt/KTX2/WebP) when a client does supply real jars/packs. |
| `threejs-animation` | Clips, morphs, procedural motion | Mixer, morph targets, procedural springs. |
| `threejs-interaction` | Raycast, controls, drag | Pointer events, camera controls, gizmos. |
| `gsap-core` | tweens, easing, `gsap.matchMedia()` | Use `gsap.matchMedia()` for responsive + `(prefers-reduced-motion: reduce)` branches. |
| `gsap-timeline` | sequencing | Position parameter, nesting, labels. |
| `gsap-scrolltrigger` | scroll-driven | `ease:"none"` on scrubbed/containerAnimation tweens; create triggers top-to-bottom or set `refreshPriority`; `ScrollTrigger.refresh()` after layout/font changes; `scrollerProxy` only for non-Lenis custom scrollers; pin + `pinSpacing`; `clamp()` start/end. |
| `gsap-react` | `useGSAP` | Always `useGSAP(() => {...}, { scope: ref })`; never selectors without scope; auto-cleanup; no GSAP during SSR; wrap event-handler tweens with `contextSafe`. |
| `gsap-plugins` | SplitText, ScrollSmoother, Flip, Draggable, Observer, MorphSVG, DrawSVG, ScrambleText, CustomEase | All plugins free from `gsap/*`. If using Lenis, do NOT also use ScrollSmoother. |
| `gsap-performance` | jank | Animate transforms/opacity, avoid layout thrash, batch. |
| `gsap-utils`, `gsap-frameworks` | helpers / Vue-Svelte | `mapRange`, `clamp`, `wrap`, `interpolate`; frameworks skill not needed for React. |

Design intent of the stack: **Lenis = scroll feel, GSAP ScrollTrigger = scroll choreography + pinning, R3F = hero scene reading a mutable `scroll` object, motion = DOM micro-interactions/text.** Only one animation owner per element.

---------------------------------------------------------------------------

## 3. Component catalogue

### 3.0 How to use React Bits components
Copy `react-bits/src/ts-default/<Category>/<Name>/` (the `.tsx` and its `.css` if present) into your app. Props are exhaustive and typed (read the `interface *Props` at the top of each file). They all accept `className`/`style`; many take `paused`, `dpr`, `intro`, and `lightMode`/`theme`. Most are `'use client'`.

Dependency key: **GL** = raw WebGL2, no packages. **three** / **ogl** / **R3F** = needs that package. **gsap** / **motion** / **matter** = animation/physics packages. (Determined by scanning imports of every file in `ts-default`.)

### 3.1 Backgrounds (`react-bits/src/ts-default/Backgrounds/<Name>/<Name>.tsx`)

All GL (no package) unless noted. Full list actually present: AcidSquares, AeroShards (DOM), Antigravity, Aurora, Balatro, **Ballpit**, Beams, CRTWarp, ColorBends (**three**), DarkVeil, Dither, DotField, DotGrid, EvilEye (**ogl**), FaultyTerminal, Ferrofluid, FloatingLines, FluxLines, **Galaxy**, GhostFibers, GradientASCII, GradientBlinds, GradientWaves, Grainient, GridDistortion, GridMotion (DOM), GridScan, Hyperspeed (**three**), **Iridescence**, LetterGlitch, LightPillar, LightRays, LightTunnel, Lightfall, Lightning, LineWaves, **LiquidChrome**, LiquidEther, MagicRings, MagnetLines, MicroSlats (**ogl**), **MoltenMetal**, **Orb**, **Particles**, PatternWaves (**ogl**), PixelBlast, PixelSnow, Plasma, PlasmaWave, Prism, PrismaticBurst, Radar, RippleGrid, Scanner, ShapeGrid (DOM), ShapeWaves (DOM), SideRays, **Silk**, SlicedWaves, SoftAurora, **Threads**, Topography, Waves, WebThreads.

Spice-relevant picks:

| Component | Looks like | Key props (from source) | Spice adaptation |
|---|---|---|---|
| `Ballpit` (1213 lines, custom GL + own physics, no three) | Instanced glossy spheres falling into a pit, cursor pushes/grabs them | `count, colors, material('satin'/'matte'/'gloss'/'frosted'/'metal'), minSize,maxSize, gravity, friction, wallBounce, bounce, depth, followCursor, cursorSize, grab, clickEffect:'burst'` | Instant "peppercorn / mustard seed / cardamom pit". Colours `['#1c1410','#2b1d12','#3a2616']` for pepper; `['#d4a017','#b8860b']` for mustard; gloss material. Zero asset cost. Best "easy win" hero. |
| `Galaxy` | Starfield spiral with mouse interaction | see `GalaxyProps` in file | Recolour to saffron/gold = "spice galaxy / cumin star-dust" for a premium dark page. |
| `Silk` | Flowing satin cloth | `color, sheenColor, speed, scale, noiseIntensity, sheen, depth, ripple, wave, clickRipple, lightMode` | Saffron/crimson silk behind hero typography; evokes sari/fabric of Indian markets. |
| `Threads` | Fraying thread lines | `color, accentColor, amplitude, lineCount, thickness, fray, split, taper` | **Saffron threads** hero background without any 3D. |
| `Iridescence` | Oil-slick shimmering shader | `color, speed, amplitude, mouseReact, warp, hueShift, saturation, stir, sheen` | Turn into "spice-oil sheen" (set color to warm amber) for ghee/oil/pickle brand variants. |
| `LiquidChrome` | Molten chrome metal | `color, speed, amplitude, thickness, depth, roughness, interactive, rippleStrength` | Liquid-gold / liquid-copper (turmeric) variant: color `[0.9,0.65,0.1]`. |
| `MoltenMetal` | Glowing lava/metal | `colors, coreColor, colorMode('molten'/'ember'/'frost'), swirl, turbulence, glow, mouseInteraction, flareOnClick` | `ember` mode = red chilli heat page; "Kashmiri chilli" hero. |
| `Particles` | 3D-ish particle cloud, hover repel | `particleCount, particleColors, shape, glow, twinkle, depthOfField, connections, hoverEffect, clickBurst` | Spice dust drifting; set colours to cumin/turmeric/chilli. |
| `Orb` | Glowing sphere | `colors, hue, size, glow, wobble, trail, hoverIntensity` | "Sun / ghee drop / saffron bead" accent; chat concierge. |
| `LiquidEther` | Fluid-sim style background | see file | Coloured fluid wash behind hero (alternative to SplashCursor). |
| `Aurora`, `SoftAurora`, `GradientWaves`, `Grainient`, `DarkVeil` | Soft gradients | colour stops | Cheap atmospheric backdrops for secondary sections; `Grainient` adds film grain. |
| `Hyperspeed` (**three**) | Road light streaks | many presets | Not spice-relevant; skip. |
| `Beams`, `LightRays`, `LightPillar`, `SideRays` | God rays | colour, intensity | Sunlight shafts through a spice-shop door; steam light. |

### 3.2 Animations (`react-bits/src/ts-default/Animations/<Name>/<Name>.tsx`)
Present: AnimatedContent (gsap), **BlobCursor** (three + RoomEnvironment), ClickSpark, Crosshair, CrystalizedBall (ogl), Cubes, CursorGrid, DitherVeil (ogl), ElasticMesh, ElectricBorder, ElectricLogo (ogl), FadeContent (gsap), GhostCursor, GlareHover, GlowCursor, GradualBlur, HalftoneReveal, ImageTrail (gsap), LaserFlow, LogoLoop, Magnet, **MetaBalls**, **MetallicPaint**, Noise, OrbitImages, PixelSwap, PixelTrail, PixelTransition, Ribbons, RippleDistortion (ogl), ScrollExpand, ShapeBlur, **SplashCursor**, StarBorder, StickerPeel, Strands, SwarmCursor, TargetCursor.

| Component | Looks like | Props / notes | Spice adaptation |
|---|---|---|---|
| `SplashCursor` (1038 lines GL fluid sim) | Navier-Stokes ink that follows cursor | `colors:string[], rainbow, intensity, size, force, swirl, trail, momentum, shading, glow, quality('low'/'medium'/'high'), clickSplash, contained, theme, zIndex` | Pass `colors={['#E8A317','#C1272D','#7A1E0E','#F5D142']}` (turmeric/chilli/paprika/saffron) with `rainbow={false}`: **spice-colour fluid cursor** (recipe 7). `quality="low"` on mobile; disable on touch. |
| `MetaBalls` | Gooey metaballs, cursor ball | `color, cursorBallColor, ballCount, clumpFactor, gooeyness, stickiness, variant, clickBurst` | Liquid "oil/ghee/honey drop" sections; ties to pickles and oils. |
| `MetallicPaint` | Liquid chrome applied to text/image silhouette | `imageSrc` or `text, fontFamily, density, softness, dispersion, distortion, edgeBend, mouseTilt, lightMode` | Brand logo as liquid gold (like liquid-logo). Feed SVG/PNG of the logo. |
| `BlobCursor` (**three**) | Refractive blob follows cursor | needs `three` + `RoomEnvironment` | Premium cursor on desktop only. |
| `ImageTrail` (gsap) | Images spawn along mouse path | `items` images | Spice photography trail on a "Shop all" hero. |
| `ScrollExpand` | Media expands on scroll | DOM | Product film expand. |
| `RippleDistortion`, `DitherVeil` (ogl) | Image ripple/dither | ogl | Product-image hover distortion. |
| `HalftoneReveal`, `PixelTransition`, `PixelSwap` | Image reveal/transition | GL/DOM | Section transitions. |
| `Ribbons`, `Strands` | Ribbon/strand trails | GL | Saffron-thread cursor trail. |
| `OrbitImages`, `LogoLoop`, `Magnet`, `GlareHover`, `StickerPeel` | Image orbits, marquee, magnetic buttons, glare, peelable sticker | DOM/CSS | Origin-badge stickers (e.g. "Kerala 2025"), certification logo loop, magnetic CTA. |

### 3.3 Components (`react-bits/src/ts-default/Components/<Name>/<Name>.tsx`)
Present: AccordionGallery(gsap), AnimatedList, BorderGlow, BounceCards, BubbleMenu(gsap), CardNav, CardSwap, Carousel, ChromaGrid, CircularCarousel, **CircularGallery** (GL, 3D-bent image ring), Counter, CurvedInput, DecayCard, DepthCarousel(gsap), Dock, DomeGallery, DriftWall, ElasticSlider, FlexCarousel(ogl), **FlowingMenu**, **FluidGlass** (GL), Folder, FlyingPosters, GlassIcons, GlassSurface, GooeyNav, HoloCard, InfiniteMenu (GL), InfiniteSpiral, **Lanyard** (plain three, no R3F), MagicBento, Masonry, **ModelViewer** (R3F+drei), MorphSlider(gsap+ogl), OptionWheel, PillNav, PixelCard, ProfileCard, ReflectiveCard, ScrollStack, SpecularButton, SpotlightCard, Stack(motion), StaggeredMenu(gsap), Stepper, TiltedCard.

| Component | Notes | Spice adaptation |
|---|---|---|
| `ModelViewer` (R3F, drei `ContactShadows, Environment, useGLTF, useFBX`; also OBJ) | Props: `url, environment, autoRotate, dragRotate, turntable, hoverTilt, float, shadow, intro, fit, tilt...` | Drop-in product viewer if a client supplies a `.glb`; otherwise use procedural jar (recipe 4). |
| `CircularGallery` (GL; props `items, bend, scrollSpeed, itemSize, wave, fadeEdges, snap, autoScroll, onItemClick`) | Curved scroll gallery of images with titles | "Shop by blend" carousel of 25-50 product packs; `onItemClick` -> product page. |
| `InfiniteMenu` (GL) | Sphere of items you rotate | Spice-wheel category picker. |
| `FlowingMenu` | Marquee-on-hover big menu rows (DOM + gsap-free CSS) | Category nav: "Masalas / Chilli / Turmeric / Saffron / Pepper". |
| `FluidGlass` (GL; `text, src, shape(s), refraction, dispersion, frost, interaction`) | Refractive glass lens over text/image | Glass drop over a spice photo; hero. |
| `GlassSurface`, `GlassIcons`, `ReflectiveCard`, `HoloCard`, `SpecularButton`, `SpotlightCard`, `BorderGlow` | Glass/holo UI surfaces | Cards, badges, CTA. |
| `ScrollStack`, `CardSwap`, `Stack`, `TiltedCard`, `MagicBento`, `Masonry`, `DomeGallery`, `FlyingPosters`, `ChromaGrid` | Layout/gallery patterns | Product grids, recipe cards, bento "Why us". |
| `StaggeredMenu`, `BubbleMenu`, `CardNav`, `PillNav`, `Dock`, `GooeyNav` | Nav patterns | Distinct nav per landing page. |

### 3.4 Text animations (`react-bits/src/ts-default/TextAnimations/<Name>/<Name>.tsx`)
Present: ASCIIText(GL), BlurText(motion), CircularText(motion), CountUp(motion), CurvedLoop, DecryptedText(motion), DepthText, EchoText, FallingText(**matter-js**), FoldText(gsap), FuzzyText, GlitchText, GradientText, MaskedHeading(gsap), **ParticleText**, RotatingText(motion), ScrambledText(gsap), **ScrollFloat**(gsap), **ScrollReveal**(gsap), **ScrollVelocity**(motion), **ShinyText**, Shuffle(gsap), SplitFlapText, **SplitText**(gsap + @gsap/react), StrokeText(gsap), TechText, TextCursor, TextLoop(gsap), TextPressure, TextType(gsap), TrueFocus(motion), VariableProximity, WarpText(ogl).

Spice picks: `SplitText`/`MaskedHeading` (hero headline reveals), `ScrollVelocity` (marquee of spice names that skews with scroll), `ShinyText` (gold shimmer on "Single-origin"), `ParticleText` (props `text, intro:'gather'|'rain'|'spiral'|'scan', density, pointerRepel`: **a quick spice-dust-forms-text effect** in 2D canvas with no 3D), `FallingText` (matter-js: words fall like falling spices into a pile), `CountUp` (grams/farms/years stats), `BlurText`, `ScrollFloat`, `ScrollReveal`, `TextPressure`/`VariableProximity` (variable fonts), `CurvedLoop`.

### 3.5 Micro (`Micro/`) - motion-based UI details (BellToggle, FlipCard, SwipeToast, SlideCommit, WarmTooltip, ...); `PaperCrumple` uses three. Use for cart micro-interactions (e.g. `SpringCheck`, `SquishSwitch`, `FlipCard` for recipe/ingredient flips).

### 3.6 thinking-orbs (`thinking-orbs/`)
`src/ThinkingOrb.tsx` renders a `<canvas>` (2D) via `src/engine/*` (core projection in `core.ts`; modes `orbits.ts, lattice.ts (searching globe), morph.ts, braid.ts, ribbon.ts, web.ts, profiles.ts`). Props (`src/types.ts`): `state: 'working'|'searching'|'solving'|'listening'|'connecting'|'weaving'|'composing'|'breathing'|'shaping'`, `size: 64|20`, `theme: 'auto'|'dark'|'light'`. Peer: react >=18 only. Adaptation: page loader / "finding your blend" quiz thinking-state (`searching` = dotted globe, apt for "sourcing from origin"); inline 20px spinner on add-to-cart. Also a good reference for the *dot-sphere projection technique*: project points on a rotating sphere in 2D, size by depth - reusable in canvas for the origins globe fallback.

### 3.7 shadergradient (`shadergradient/packages/shadergradient/src`)
`ShaderGradientCanvas` + `ShaderGradient` (R3F). Props (`types.ts`): `type: 'plane'|'sphere'|'waterPlane'`, `animate:'on'|'off'`, `uTime, uSpeed, uStrength, uDensity, uFrequency, uAmplitude`, `color1/2/3` (hex), `positionX/Y/Z, rotationX/Y/Z`, `cAzimuthAngle, cPolarAngle, cDistance, cameraZoom`, `lightType:'3d'|'env'`, `envPreset:'city'|'dawn'|'lobby'`, `brightness`, `grain:'on'|'off'`, `reflection`, `wireframe`, `range*`, `loop*`. Shaders in `src/shaders/{base,cosmic,defaults,glass,positionMix}/{plane,sphere,waterPlane}/` - GLSL vertex displacement with simplex noise; worth reading `shaders/defaults/plane/vertex.glsl` for the displacement + colour-mix-by-height technique. Usage:

```tsx
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
<ShaderGradientCanvas style={{position:'fixed',inset:0}} pixelDensity={1} fov={45}>
  <ShaderGradient type="waterPlane" color1="#F2A900" color2="#B3261E" color3="#3B1F0B"
    uSpeed={0.15} uStrength={3} uDensity={1.2} grain="on" lightType="env" envPreset="city" brightness={1.1}
    cAzimuthAngle={180} cPolarAngle={80} cDistance={2.8} />
</ShaderGradientCanvas>
```
Spice use: turmeric->chilli->cumin gradient mesh as a molten-spice sea; `type="sphere"` as a spice-orb.

### 3.8 liquid-logo / paper shaders
`liquid-logo/src/app/hero/liquid-frag.ts` (203 lines GLSL3) + `src/hero/canvas.tsx` (255 lines vanilla GL wiring). Uniforms: `u_image_texture, u_time, u_ratio, u_img_ratio, u_patternScale, u_refraction, u_edge, u_patternBlur, u_liquid` (+ colours). Algorithm: take logo alpha mask -> blur it into a "bulge"/edge field (`parse-logo-image.ts` computes mask + blurred distance), run a noisy diagonal stripe pattern through it, offset R/G/B stripe positions by different refraction amounts (chromatic dispersion), mix two colours per channel. Params (`params.ts`): `refraction 0-0.06 (0.015), edge 0-1 (0.4), patternBlur 0-0.05 (0.005), liquid 0-1 (0.07), speed 0-1 (0.3), patternScale 1-10 (2)`. Production option: `npm i @paper-design/shaders-react` (0.0.82; peer React 18||19) and use its `LiquidMetal` with `image` = logo SVG. Adaptation: brand wordmark as liquid gold/copper; tint the two colours to `#F2C14E`/`#7A4B00`.

### 3.9 liquid-glass-js
Vanilla `container.js`, `button.js`; global `html2canvas` required (README: "Zero Dependencies ... except html2canvas for page sampling"). It snapshots `document.body` and refracts in WebGL2 for rounded/circle/pill glass. Pitfalls: snapshot is stale for animated pages, breaks with video/canvas content, heavy. Recommended replacement for "Apple liquid glass" feel: React Bits `GlassSurface`/`FluidGlass`, or in R3F a drei `MeshTransmissionMaterial` lens over your scene (recipe 4), or CSS `backdrop-filter: blur(20px) saturate(1.6)` + SVG `feDisplacementMap` on Chromium.

### 3.10 Vanta (`vanta/src/vanta.*.js`)
Effects: birds, cells, clouds, clouds2, dots, fog, globe, halo, net, rings, ripple, topology, trunk, waves. Needs `window.THREE` (and p5 for cells/topology/trunk); old three API (GPUComputationRenderer in `vendor/`). **Do not install**; mine ideas: `vanta.globe.js` (dotted globe + connecting lines -> origins map), `vanta.birds.js` (GPGPU boid flocking, GPUComputationRenderer pattern; reuse for "swarming saffron threads/flies of cumin"), `vanta.fog.js` (animated fog shader - tadka steam), `vanta.waves.js` (displaced plane mesh).

### 3.11 drei items worth knowing (`drei/src/core/*`)
`Float, Sparkles, Stars, Cloud, Instances/Instance, Points/PointMaterial, MeshTransmissionMaterial, MeshDistortMaterial, MeshWobbleMaterial, MeshRefractionMaterial, MeshReflectorMaterial, ContactShadows, AccumulativeShadows, Environment, Lightformer, Sampler (scatter instances on mesh surface), Trail, Billboard, Text/Text3D, Image, Svg, ScrollControls (use own Lenis instead), PerformanceMonitor, AdaptiveDpr, AdaptiveEvents, Bvh, Preload, useGLTF, useTexture, RoundedBox, Edges, Decal, Caustics, MarchingCubes, shaderMaterial, View/RenderTexture`. `Sampler` + `Instances` is the idiomatic way to cover a mesh (e.g. a spice pile) in instanced grains.

### 3.12 lenis
`lenis/packages/core` (vanilla), `lenis/packages/react` (`ReactLenis`, `useLenis`), also `snap`, `vue`. Options: `lerp, duration, smoothWheel, autoRaf, anchors, syncTouch`. See boilerplate in 1.3. Use `data-lenis-prevent` on any inner scroll area (cart drawer).

---------------------------------------------------------------------------

## 4. Spice hero concepts with implementation recipes

All use procedural geometry only. Common helper imports:
```tsx
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Instances, Instance, Environment, Float, Sparkles, MeshTransmissionMaterial, Points, PointMaterial, shaderMaterial, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { damp } from 'maath/easing';
import { scroll } from './scrollState';
```
Standard canvas: `<Canvas dpr={[1,1.75]} gl={{antialias:true, powerPreference:'high-performance'}} camera={{position:[0,0,8], fov:35}}>`.

### Recipe 1 - Peppercorn / cardamom / chilli-flake explosion on scroll
Concept: a pinned hero starts with a tightly-packed sphere cluster of ~800 black peppercorns (+ green cardamom pods, red chilli flakes); scroll drives an "explosion" outward, the product pack emerges in the centre. Pure GPU-free CPU-light approach: store per-instance rest position, direction, spin; compute position analytically from `scroll.progress` (no physics engine, deterministic, scrubbable both ways).

```tsx
const N = 900;
function Explosion() {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => Array.from({ length: N }, (_, i) => {
    const dir = new THREE.Vector3().randomDirection();
    const r0 = Math.cbrt(Math.random()) * 1.4;                // rest cluster
    return { dir, r0, far: 4 + Math.random() * 9, spin: new THREE.Vector3().randomDirection().multiplyScalar(2 + Math.random() * 4),
             s: 0.06 + Math.random() * 0.07, delay: Math.random() * 0.25 };
  }), []);
  const p = useRef(0);
  useFrame((_, dt) => {
    p.current = THREE.MathUtils.damp(p.current, scroll.progress, 5, dt);
    for (let i = 0; i < N; i++) {
      const d = data[i];
      const t = THREE.MathUtils.smoothstep(p.current, d.delay, d.delay + 0.7);   // per-grain stagger
      const e = 1 - Math.pow(1 - t, 3);                                           // easeOutCubic
      dummy.position.copy(d.dir).multiplyScalar(d.r0 + (d.far - d.r0) * e);
      dummy.position.y -= 3.0 * t * t;                                            // gravity sag late
      dummy.rotation.set(d.spin.x * t * 6, d.spin.y * t * 6, d.spin.z * t * 6);
      dummy.scale.setScalar(d.s);
      dummy.updateMatrix(); mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, N]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial color="#1b1410" roughness={0.45} metalness={0.1} />
    </instancedMesh>
  );
}
```
Variants: vertex-colour per instance via `mesh.setColorAt` (pepper/cardamom/chilli mix); cardamom pod = `new THREE.CapsuleGeometry(0.5,1,6,12)` scaled `[0.6,1,0.6]` with green colour; chilli flake = `new THREE.CircleGeometry(1,5)` with `side:DoubleSide`, flattened, red `#c1121f`. Real physics alternative: `@react-three/rapier` `<InstancedRigidBodies>` with `<Physics gravity={[0,-6,0]}>`; use only after scroll trigger (fall-in of grains onto a plate) and cap at ~300 bodies; on mobile use analytic version. Use `ballpit` (React Bits) when you want 2D-canvas physics without any scene setup.

### Recipe 2 - Turmeric powder particle cloud (GPU Points, curl noise) that forms the logo
Sample target points from the logo (canvas text or SVG rasterised to an offscreen canvas -> alpha > 128 pixels), store as `aTarget`; random cloud as `aStart`; shader mixes by `uProgress` and adds curl-noise swirl weighted by `(1-progress)` plus mouse repulsion.

```tsx
function sampleLogo(text: string, n: number) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 256;
  const g = c.getContext('2d')!; g.fillStyle = '#fff'; g.font = '700 200px "Playfair Display"';
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 512, 128);
  const d = g.getImageData(0, 0, 1024, 256).data, pts: number[] = [];
  for (let y = 0; y < 256; y++) for (let x = 0; x < 1024; x++) if (d[(y*1024+x)*4+3] > 128) pts.push((x-512)/60, -(y-128)/60);
  const out = new Float32Array(n*3);
  for (let i = 0; i < n; i++) { const k = (Math.random()*pts.length/2|0)*2; out.set([pts[k], pts[k+1], (Math.random()-.5)*0.15], i*3); }
  return out;
}
const TurmericMat = shaderMaterial(
  { uTime: 0, uProgress: 0, uMouse: new THREE.Vector3(), uSize: 28, uColA: new THREE.Color('#f2a900'), uColB: new THREE.Color('#c77800') },
  /*glsl*/`
  attribute vec3 aTarget; attribute float aRand;
  uniform float uTime, uProgress, uSize; uniform vec3 uMouse;
  varying float vA; varying float vMix;
  // cheap curl via derivative of 3 offset sin-noise fields (swap for simplex curl for quality)
  vec3 curl(vec3 p){ float e=.1; 
    float n1=sin(p.y*1.7+uTime*.6)+sin(p.z*2.1-uTime*.4), n2=sin(p.z*1.9+uTime*.5)+sin(p.x*2.3+uTime*.3), n3=sin(p.x*1.5-uTime*.5)+sin(p.y*2.2+uTime*.35);
    return vec3(n3-n2, n1-n3, n2-n1); }
  void main(){
    float t = smoothstep(0., 1., clamp(uProgress*1.4 - aRand*.4, 0., 1.));
    vec3 swirl = curl(position*.35 + aRand*10.) * (1.-t) * 1.6;
    vec3 p = mix(position + swirl, aTarget, t);
    vec3 dm = p - uMouse; float f = smoothstep(1.2, 0., length(dm)); p += normalize(dm+1e-4) * f * .6;
    vec4 mv = modelViewMatrix * vec4(p,1.); gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.5+aRand) / -mv.z; vA = .4 + .6*aRand; vMix = aRand;
  }`,
  /*glsl*/`
  uniform vec3 uColA, uColB; varying float vA, vMix;
  void main(){ vec2 c = gl_PointCoord-.5; float d = length(c); if(d>.5) discard;
    float a = smoothstep(.5,.0,d) * vA; gl_FragColor = vec4(mix(uColA,uColB,vMix), a);
    #include <colorspace_fragment> }`
);
extend({ TurmericMat });
// <points frustumCulled={false}><bufferGeometry>...position(start) aTarget aRand...</bufferGeometry>
//   <turmericMat transparent depthWrite={false} blending={THREE.AdditiveBlending} uProgress={...}/></points>
```
Particle count 60k desktop / 15k mobile. For bigger counts or true curl-noise simulation use GPGPU ping-pong (`GPUComputationRenderer` from `three/addons/misc/GPUComputationRenderer.js`; see vanta birds for the pattern). A 2D-only fallback: React Bits `ParticleText`.

### Recipe 3 - Saffron threads drifting
Each thread = a thin red tube following a wavy CatmullRom curve; instance 150 of them as `InstancedMesh` of one thin `TubeGeometry` and animate in the vertex shader (bend + drift) using `onBeforeCompile` or CSM so lighting is kept. Colour gradient: orange-red tip `#e2400f` -> deep crimson body `#8b0a0a`.

```tsx
const curve = new THREE.CatmullRomCurve3([[-1,0,0],[-.3,.15,.05],[.3,-.1,-.05],[1,.1,0]].map(a=>new THREE.Vector3(...a)));
const geo = new THREE.TubeGeometry(curve, 24, 0.012, 5, false);     // very low poly
// per-instance matrix random position/rotation; in shader:
// transformed.y += sin(position.x*3.0 + uTime*0.8 + instanceId*1.3) * 0.12 * (1.0 - uSettle);
// drift: modelMatrix translation += vec3(sin(uTime*.1+id), -fract(uTime*.02+id*.37)*6., 0.) wrapped with mod()
```
Alternative with zero 3D: React Bits `Threads` (saffron colours) + `Ribbons`/`Strands`. Add drei `<Sparkles color="#ff9d00" count={60} scale={[6,4,3]} size={3}/>` for pollen glints. Depth of field via postprocessing `<DepthOfField focusDistance={0.02} bokehScale={4}/>` for the drifting hero.

### Recipe 4 - 3D spice jar (glass, transmission) rotating with scroll
Jar profile via `LatheGeometry` (no model needed), lid = cylinder + torus ridges, powder fill = second Lathe (rough, matte). Glass uses `MeshTransmissionMaterial` (needs an Environment). Contents tinted per SKU colour; label as a `CylinderGeometry` partial arc (thetaLength ~ 1.9) with a canvas texture (brand text) or drei `<Decal>`/`<Text>`.

```tsx
const jarProfile = [[0,0],[.62,0],[.7,.08],[.72,.2],[.72,1.1],[.66,1.35],[.5,1.45],[.5,1.58],[0,1.58]].map(([x,y])=>new THREE.Vector2(x,y));
function Jar({ powder = '#d99a00' }) {
  const g = useRef<THREE.Group>(null!);
  useFrame((_, dt) => { g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, scroll.progress * Math.PI * 2, 4, dt);
                         g.current.position.y = THREE.MathUtils.damp(g.current.position.y, -scroll.progress * .5, 4, dt); });
  return (
    <group ref={g}>
      <mesh><latheGeometry args={[jarProfile, 64]} />
        <MeshTransmissionMaterial transmission={1} thickness={0.35} roughness={0.05} ior={1.45} chromaticAberration={0.04}
          anisotropicBlur={0.1} samples={6} resolution={512} backside={false} /></mesh>
      <mesh scale={[.93,.78,.93]} position={[0,.06,0]}><latheGeometry args={[jarProfile, 48]} />
        <meshStandardMaterial color={powder} roughness={1} /></mesh>
      <mesh position={[0,1.7,0]}><cylinderGeometry args={[.55,.55,.28,48]} /><meshStandardMaterial color="#111" metalness={.8} roughness={.3} /></mesh>
    </group>
  );
}
// Scene: <Environment preset="studio" /> (or <Environment><Lightformer .../></Environment> for custom softboxes)
//        <ContactShadows position={[0,-.01,0]} opacity={.5} blur={2.5} far={3}/>
```
Perf: `MeshTransmissionMaterial` re-renders the scene to an FBO - use `samples={4-6}`, `resolution={256-512}`, and only one on screen; mobile fallback = `meshPhysicalMaterial transmission={1}` with `thickness`, or plain `opacity .35` glass. Do not use `<Environment preset>` from CDN in production blindly: presets fetch HDRs from external URLs; prefer `<Environment resolution={256}><Lightformer .../></Environment>` (procedural, no download) or `three/addons/environments/RoomEnvironment.js` (what React Bits' BlobCursor uses).

### Recipe 5 - Liquid-gold shader background
Fullscreen quad (or just use React Bits `LiquidChrome`/`MoltenMetal`/`Iridescence` with gold `color`). Own version: domain-warped fbm mapped to a gold ramp with a fake specular from the gradient.

```glsl
// fragment (R3F: <mesh><planeGeometry args={[2,2]}/><shaderMaterial vertexShader="void main(){gl_Position=vec4(position.xy,0.,1.);}" .../></mesh>)
uniform float uTime; uniform vec2 uRes, uMouse;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*n(p);p=p*2.02+7.1;a*=.5;}return s;}
void main(){
  vec2 uv=(gl_FragCoord.xy*2.-uRes)/uRes.y;
  vec2 q=vec2(fbm(uv+uTime*.05),fbm(uv+vec2(5.2,1.3)-uTime*.04));
  vec2 r=vec2(fbm(uv+3.*q+vec2(1.7,9.2)+uTime*.08),fbm(uv+3.*q+vec2(8.3,2.8)));
  float f=fbm(uv+3.*r+(uMouse-.5)*.6);
  vec3 gold=mix(vec3(.28,.14,.01),vec3(.95,.66,.12),smoothstep(.2,.8,f));
  gold=mix(gold,vec3(1.,.9,.55),pow(smoothstep(.6,.95,f),3.));          // highlights
  gl_FragColor=vec4(gold,1.);
  #include <colorspace_fragment>
}
```
Pass `dpr={[1,1]}` and render at half resolution for this layer (or `resolution` scale 0.5) - fbm x3 chains cost fill rate.

### Recipe 6 - Mortar & pestle (procedural)
Mortar: `LatheGeometry` bowl with a thick wall (outer + inner profile closed at rim); pestle: lathe tapered club. Pestle orbits while grinding: `rotation.z` tilt + circular XZ motion tied to scroll; spawn `Points` dust above the bowl that rises with progress.

```tsx
const bowl = [[0,0],[.9,0],[1.25,.25],[1.35,.8],[1.3,1.0],[1.15,1.0],[1.15,.85],[1.05,.45],[.6,.18],[0,.12]].map(a=>new THREE.Vector2(...a));
const pestle = [[0,0],[.18,0],[.2,.4],[.13,1.0],[.16,1.6],[.2,1.7],[0,1.72]].map(a=>new THREE.Vector2(...a));
// <mesh><latheGeometry args={[bowl,96]}/><meshStandardMaterial color="#6b6b68" roughness={.85} bumpMap=noise /></mesh>  (granite look: generate noise CanvasTexture for roughnessMap/bumpMap)
// useFrame: a = scroll.progress*Math.PI*8; pestle.position.set(Math.cos(a)*.35, .9, Math.sin(a)*.35); pestle.rotation.set(Math.sin(a)*.25,0,-Math.cos(a)*.25)
// powder: instanced tiny spheres (Sampler on the inner bowl) whose scale grows with progress -> "ground spice mound".
```
Add `<Sparkles>` or a `Points` plume tinted with the spice colour for powder puffs on each stroke (emit when sin(a) crosses 0).

### Recipe 7 - Spice-colour fluid-simulation cursor
Use the shipped component: `react-bits/src/ts-default/Animations/SplashCursor/SplashCursor.tsx` (+ `.css`).

```tsx
<SplashCursor colors={['#E8A317','#C1272D','#7A1E0E','#F5D142','#2E7D32']} rainbow={false}
  intensity={0.9} force={6000} swirl={25} trail={0.6} quality={isMobile ? 'low' : 'medium'} clickSplash />
```
Mount once at app root at `zIndex` below content, `pointer-events:none`. Dial `theme='light'` for cream pages. Disable on touch and on `prefers-reduced-motion`. Optionally switch palette per product section (pass `colors` from the section the cursor is over via a context + IntersectionObserver).

### Recipe 8 - Spice-origins globe
Sphere with a dotted land mask + glowing pins at Indian origins and arcs to the customer's city. Land mask without downloading a map: ship a small 256x128 equirectangular land-mask PNG in `public/` (generate once from Natural Earth or any free source) and sample it on a Fibonacci sphere; points where `alpha>0.5` become land dots (instanced, ~12k).

```tsx
const pins = [ // [lat, lon, label]
 ['Kerala (pepper, cardamom)',9.9,76.3], ['Guntur (chilli)',16.3,80.4], ['Erode/Sangli (turmeric)',11.3,77.7],
 ['Kashmir Pampore (saffron)',33.9,74.9], ['Unjha (cumin)',23.8,72.4], ['Rajasthan (coriander)',25.0,75.8], ['Lakadong, Meghalaya (turmeric)',25.4,92.1] ];
const toVec = (lat: number, lon: number, r=1) => { const phi=(90-lat)*Math.PI/180, th=(lon+180)*Math.PI/180;
  return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(th), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(th)); };
// Arc: QuadraticBezierLine from drei: start=toVec(a), end=toVec(b), mid=start.clone().add(end).normalize().multiplyScalar(1.5)
// Rotate the globe group so India faces camera; scroll rotates it between pins (damp group.rotation.y to targetLon).
// Pin glow: sprite with additive blending + pulsing scale; HTML labels via drei <Html occlude> (limit to 7).
```
Cheaper 2D alternative: `thinking-orbs` `searching` lattice technique (canvas) or Vanta-style dotted globe shader.

### Recipe 9 - Floating chillies (procedural chilli pods)
Chilli = tube along a curved, tapering path (`TubeGeometry` then taper radius via custom attribute/scale of ring vertices) + a green calyx (small `ConeGeometry`+ torus stem). Glossy red `MeshPhysicalMaterial` `clearcoat:1, roughness:.25`.

```tsx
function chilliGeometry() {
  const c = new THREE.CatmullRomCurve3([[0,0,0],[.15,-.5,0],[.1,-1.0,.05],[-.1,-1.5,.15],[-.35,-1.8,.1]].map(a=>new THREE.Vector3(...a)));
  const g = new THREE.TubeGeometry(c, 32, .16, 12, false);
  const pos = g.attributes.position, seg = 32, rad = 12+1;
  for (let i=0;i<pos.count;i++){ const t = Math.floor(i/rad)/seg; const k = (1-Math.pow(t,1.6))*.95+.05;     // taper to a point
    const p = c.getPointAt(t); pos.setXYZ(i, p.x+(pos.getX(i)-p.x)*k, p.y+(pos.getY(i)-p.y)*k, p.z+(pos.getZ(i)-p.z)*k); }
  g.computeVertexNormals(); return g;
}
// Scatter 25 via <Float speed={1.2} rotationIntensity={1.5} floatIntensity={2}> each with random rotation; instanced via drei <Instances> (shared geo/material).
// "Heat" on hover: raise emissive to #ff2200 and add bloom (@react-three/postprocessing <Bloom luminanceThreshold={.9} mipmapBlur/>), add Sparkles red.
```

### Recipe 10 - Masala dabba (7-spice tin) rotating on scroll
Round steel tin (Lathe), open lid (hinged cylinder) and 7 bowls in a ring; each bowl a half-sphere (`SphereGeometry(…, 0, 2π, 0, π/2)` flipped) filled with a mound = `SphereGeometry` scaled `[1,.45,1]` with a noise-displaced vertex shader (granular look) in turmeric/chilli/cumin/coriander/mustard/garam/fenugreek colours. Scroll rotates the dabba in 1/7 steps (snap with ScrollTrigger `snap: 1/6`) and each step triggers HTML copy for that spice; camera dollies to the active bowl. Granular shading: `normal += (hash(position*80)-.5)*.35` in the fragment (via CSM) and `roughness 1`.

### Recipe 11 - Spice dust reveal (product image dissolves from powder)
For the product pack image (PNG): fullscreen plane with `uTex`, `uProgress`; fragment: `float n = fbm(uv*6.); float m = smoothstep(uProgress-.08, uProgress, n + uv.x*.3); ` discard/blend to spice-colour dust; add a `Points` emitter along the dissolve edge by sampling pixels where `|n - progress| < eps` (pre-sample 20k points into a static buffer and fade by `uProgress`). Scroll-scrubbed via `scroll.progress`. DOM alternative: React Bits `HalftoneReveal`, `PixelTransition`, `ScrollExpand`.

### Recipe 12 - Tadka steam and sparks (hot oil section)
Layer: 1) drei `<Cloud>` (2-3 low-opacity segments, `color="#fff4e0"`, `seed`) or a shader plane with scrolling fbm smoke alpha; 2) `<Sparkles count={80} color="#ffb347" size={4} speed={.6} noise={1}/>`; 3) bloom with `luminanceThreshold={.85}`. Add cumin/mustard seeds as an `InstancedMesh` that "pops" (random impulse `vy`, gravity integrated in `useFrame`, 120 instances, reset when below y=-2). Reference: `vanta/src/vanta.fog.js` for the fog shader.

### Recipe 13 - Liquid-gold logo (paper shader / liquid-logo / MetallicPaint)
Fastest path: `react-bits .../Animations/MetallicPaint` with `text` or `imageSrc` of the logo SVG, `color='#d4a017'`, `lightMode` as needed. Or `@paper-design/shaders-react` `LiquidMetal`. Or port `liquid-logo/src/app/hero/liquid-frag.ts` (needs `parse-logo-image.ts` to turn the logo into a blurred alpha/edge texture). Logo must be a high-contrast alpha PNG/SVG with an opaque shape.

### Recipe 14 - Molten spice-sea shader gradient (page-wide)
`ShaderGradient type="waterPlane"` with turmeric/chilli/clove colours, `grain="on"`, `uSpeed 0.1-0.2`. Place in a fixed canvas, fade out with CSS opacity as you scroll past hero (`ShaderGradientCanvas` has `lazyLoad`/`pauseOnOutOfView`-style props; check `ShaderGradientCanvas.tsx` and hooks/`useInView.ts`, which pauses when offscreen).

### Recipe 15 - Circular product carousel (25-50 SKUs)
`CircularGallery` with `items=[{image, text}]` (props verified: `bend, itemSize, itemAspect, gap, wave, fadeEdges, snap, autoScroll, onItemClick, onActiveChange`) for catalogue browsing, or `InfiniteMenu` for sphere browsing. Use pack shots with transparent backgrounds and a consistent canvas size; lazy-mount only when the section is in view.

### Recipe 16 - Origin-blend quiz concierge
`thinking-orbs` `ThinkingOrb state="searching"` while computing recommendations; swap to `weaving` when "blending", `composing` when presenting the blend. Pair with a MetaBalls "pour" animation.

Each landing page should combine ONE signature 3D hero (recipes 1-4, 8, 10) with ONE ambient layer (5, 7, 12, 14) and DOM typography (SplitText/ScrollVelocity/ShinyText). Avoid stacking more than 2 GL contexts per viewport.

---------------------------------------------------------------------------

## 5. Performance rules (apply to every page)

1. **DPR clamp**: `<Canvas dpr={[1, 1.75]}>` desktop; `[1, 1.25]` on mobile (detect with `matchMedia('(pointer:coarse)')`). Fullscreen shader layers: DPR 1 or half-res. Optionally drive DPR from `<PerformanceMonitor onDecline onIncline>` via React state (skill note: do not combine with `<AdaptiveDpr>` in the same Canvas; `Canvas` re-applies its `dpr` prop on re-render).
2. **Instancing**: any repeated object (grains, chillies, threads, bubbles) is an `InstancedMesh`/drei `Instances` = 1 draw call. Budget: < 100 draw calls, < 500k triangles desktop, < 150k mobile. Use low-poly (`icosahedron detail 1`, `capsule 4 segments`). Merge static geometry with `BufferGeometryUtils.mergeGeometries`.
3. **Points over meshes** for dust (60k points is cheap, 60k meshes is not). Cap point sprite sizes (fill rate); `depthWrite={false}`; `AdditiveBlending` overdraw is the real cost.
4. **`frameloop`**: heroes with continuous motion use `"always"`. Everything else (static product shot) uses `frameloop="demand"` + `invalidate()` (remember to `invalidate` after imperative changes). Mount/unmount or pause canvases off-screen: `useInView`/IntersectionObserver -> `<Canvas frameloop={inView ? 'always' : 'never'}>`; React Bits components expose `paused`.
5. **Suspense + preload**: wrap in `<Suspense fallback={null}>`; `useGLTF.preload`, `useTexture.preload`; show poster image (static WebP of the hero) in HTML under the canvas so LCP is the image, then fade the canvas in on first rendered frame (`onCreated` + CSS opacity transition). Lazy-load the canvas chunk with `React.lazy`/dynamic `import()` after first paint (`requestIdleCallback`).
6. **Mobile fallbacks**: detect with `matchMedia('(max-width:768px), (pointer:coarse)')` and `navigator.hardwareConcurrency <= 4` (or drei `useDetectGPU`/`DetectGPU` `tier < 2`) -> reduce counts (900 -> 250 grains, 60k -> 15k points), disable transmission/bloom/shadows/DOF, `antialias:false`, `powerPreference:'low-power'`, or render the static poster only. Wire `antialias` off when postprocessing `multisampling={0}` handles it.
7. **Postprocessing**: one `EffectComposer` max, `multisampling={0}` or 4, combine effects (Bloom + Vignette + Noise only). Skip on mobile.
8. **Shaders**: no loops > 6 octaves fbm; precision `mediump` OK for backgrounds; avoid dynamic branching; compile once (`useMemo` materials); end every `ShaderMaterial` frag with `#include <tonemapping_fragment>` + `#include <colorspace_fragment>`; add `opacity` uniform manually.
9. **Memory**: dispose geometries/textures/materials you create imperatively (R3F disposes JSX-declared ones on unmount); texture <= 2048 (KTX2 if many); don't create `Vector3`/`Matrix4` in `useFrame`; precompute buffers in `useMemo`.
10. **`prefers-reduced-motion`**: 

```ts
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```
If true: render a single static frame (`frameloop="demand"`, call `invalidate()` once, set `scroll.progress` fixed), turn off Lenis (`<ReactLenis options={{ smoothWheel:false }}>` or don't mount), set GSAP via `gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {...})`, pass `paused` to React Bits components, drop SplashCursor entirely.
11. **Context loss & StrictMode**: handle `webglcontextlost` (R3F recovers; for raw GL components rely on remount key). Dev double-mount means effects run twice - the React Bits components handle cleanup; your own raw GL must return a cleanup.
12. **Accessibility/SEO**: canvas `aria-hidden="true"`, real DOM text/CTAs, visible focus states, contrast on top of animated backgrounds (add a scrim `bg-black/30`), no autoplaying flashing > 3 Hz.
13. **Measure**: `renderer.info.render.calls/triangles` (read after render), drei `<StatsGl/>` or `r3f-perf` in dev only; test on a mid Android device and Safari iOS (WebGL2 + float textures supported; avoid huge `gl_PointSize`).
14. **Safari/iOS**: `powerPreference` is ignored; keep fluid sim `quality='low'`; `html2canvas`-based glass (liquid-glass-js) is unreliable - avoid.
15. **Assets**: no network dependencies at runtime for the hero: avoid `<Environment preset>` (CDN-fetched HDR) and external fonts in WebGL text; use `Lightformer`/`RoomEnvironment`, bundled fonts.

---------------------------------------------------------------------------

## 6. Suggested mapping to 5 visually distinct landing pages

| # | Direction | Signature 3D hero | Ambient / UI |
|---|---|---|---|
| 1 | Dark luxe saffron | Recipe 3 saffron threads + Recipe 4 jar (transmission) | `Silk`/`Threads` bg, `ShinyText`, `SplitText`, Lenis |
| 2 | Heat / chilli editorial | Recipe 1 explosion (chilli flakes) + Recipe 9 floating chillies | `MoltenMetal ember`, `ScrollVelocity` marquee, bloom |
| 3 | Golden turmeric tech | Recipe 2 particle logo + Recipe 13 liquid-gold logo | `LiquidChrome` gold, `MetallicPaint`, `GlassSurface` cards |
| 4 | Origins / provenance | Recipe 8 globe + Recipe 6 mortar & pestle | `thinking-orbs searching` loader, `CircularGallery` catalogue |
| 5 | Playful / bold colour | Recipe 10 masala dabba + Ballpit seeds | `SplashCursor` spice-colour, `FallingText`, `FlowingMenu`, `MetaBalls` |

Build order recommendation: scaffold shared `SmoothScroll`, `scrollState`, `useCanvasBudget` (DPR/mobile/reduced-motion), and `Hero3D` wrapper (poster + lazy canvas); then implement each hero as an isolated component with its own mobile fallback.
