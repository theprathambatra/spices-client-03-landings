# Build brief — 5 landing page variations (shared by all builders)

> **Read [SKILL-PLAYBOOK.md](SKILL-PLAYBOOK.md) first.** taste-skill governs every design decision; this brief covers store requirements and verification.

Project root P = `/Users/shaurya_frenzy/Documents/Spices Client-03`. App = `P/site` (Vite 6 multi-page, React 19, JSX).

## Goal
A pitch for an Indian spice D2C brand (25–50 SKUs). Each variation must be a complete, polished, award-level homepage that looks and feels nothing like the other four. Each needs **1–2 signature hero components built with Three.js / React Three Fiber** that make people say "how did they do that", plus at least one more out-of-this-world interactive moment further down the page. Beat Evernuts and Rochi Ram's (the client team's favourites), which are 2D Shopify/Next sites with no WebGL.

## Hard rules
- Work ONLY inside your folder `P/site/vN/` (index.html, src/**). You may read anything else. Do NOT edit `package.json`, `vite.config.js`, `shared/`, other variations, or run `npm install`. If you need data, copy `shared/brand.js` into your folder and extend it (aim for a 24–30 SKU catalogue for the product grid).
- Installed packages (use only these): react 19, react-dom, three 0.180, @react-three/fiber 9, @react-three/drei 10, @react-three/postprocessing 3, postprocessing, @react-three/rapier 2, ogl, gsap 3.15 (all plugins incl. ScrollTrigger, SplitText are free in the `gsap` package), @gsap/react, lenis 1.3 (`lenis/react` available), motion 14 (`motion/react`), maath, clsx, tailwindcss 4 (via `@tailwindcss/vite`: put `@import "tailwindcss";` in your CSS) — or plain CSS, your choice.
- Fonts: Google Fonts `<link>` in your `index.html`. Set a proper `<title>` (brand name + short line).
- No external images unless you verified the exact URL with `curl -sI` returns 200. Prefer procedural 3D, SVG, CSS, and canvas illustration. Product packs/jars can be modelled procedurally or drawn as SVG/CSS. No copying of Evernuts/Rochi Ram's assets or copy.
- Brand placeholder: name **Kesari** (from `shared/brand.js`). Keep it easy to rename (one constant).
- Must work at 390px mobile width (no horizontal scroll) and at 1440px desktop. WebGL: clamp dpr ([1, 1.75]), lighter instance counts on mobile, `prefers-reduced-motion` respected (static or minimal-motion version), pause frameloop when the canvas is offscreen. Max 2 live WebGL contexts in the viewport at once.
- Page must include realistic e-commerce content: announcement bar, nav with cart count, hero, bestsellers/product grid with add-to-cart that updates the cart count (local state is fine), category/filter, story/origin, reviews, gifting or bundles, newsletter, footer. Copy should be witty, specific, Indian-rooted — not generic AI copy.

## Read before building (in this order)
1. `P/docs/research/SYNTHESIS.md` — your direction is defined there (palette, fonts, sections, hero ideas, motion language). Also read the per-site notes it cites for your direction, and look at relevant screenshots in `P/docs/research/screens/` with the Read tool.
2. `P/docs/threejs-playbook.md` — stack notes, component catalogue (React Bits paths under `P/repos/react-bits/src/...`), spice hero recipes, performance rules.
3. `P/docs/SKILLS-INDEX.md` — the digest section at the end. Then read in full: `P/.claude/skills/taste-skill/SKILL.md`, `P/.claude/skills/scroll-craft/SKILL.md`, `P/.claude/skills/unlazy/SKILL.md`, and the threejs-*/gsap-* skills relevant to your hero (`threejs-react-three-fiber`, `threejs-shaders`, `threejs-materials`, `threejs-performance`, `threejs-postprocessing`, `gsap-react`, `gsap-scrolltrigger`, …). Apply them. Where taste-skill's bans conflict with the direction (e.g. gradients for a luxury glow), follow the direction deliberately and with restraint.
4. `P/docs/COMPONENTS-CATALOG.md` — copy/adapt components from `P/repos/` (React Bits, magicui, motion-primitives, cult-ui, aceternity-ui, smoothui, etc.) where they genuinely help. Convert TS to JSX when copying.

## Verify (mandatory, iterate until it's genuinely great)
- Build only your page: `cd P/site && PAGE=vN npx vite build --outDir /tmp/build-vN --emptyOutDir` — must pass with no errors.
- Run your dev server on your own port: `cd P/site && PAGE=vN npx vite --port 531N --strictPort` (background), then `node tools/shot.mjs http://localhost:531N/vN/ /tmp/shots-vN/s` (create the dir first). It saves desktop + mobile screenshots at 7 scroll depths and prints console errors. LOOK at the screenshots with the Read tool, critique them like an Awwwards juror (hierarchy, spacing, type, colour, does the 3D read clearly, is anything empty/broken/overlapping, is mobile good), fix, and re-shoot. Do at least 3 critique-and-fix rounds. Zero console errors. Kill your dev server when done.
- Note: headless screenshots use software WebGL, so they're slower, but the 3D must still render visibly.

## Final reply (concise)
Direction name, the signature components and how they work (1–2 lines each), file list, which repos/skills/components you used, verification results, known limitations.

## ADDED REQUIREMENT — it must be a real, shoppable e-commerce store (not just a brand showcase)
A real consumer must be able to land on this page and shop it. The 3D is the hook; the store is the point.
- **Products visible fast**: on desktop, products or a clear "Shop" CTA within the first viewport; the bestsellers grid within the first ~1.5 scrolls. The 3D hero must never block or delay shopping.
- **Header**: logo, Shop / Categories / Gifting / Recipes / About links, **search** (opens a search overlay with live filtering of products), account icon, wishlist icon, **cart icon with live count**. Sticky. Mobile: hamburger menu drawer.
- **Announcement bar**: free-shipping threshold (e.g. "Free shipping above ₹499") + COD available.
- **Product cards** (consistent anatomy): product visual, name, vernacular/origin line, ★ rating + review count, **price in ₹ with MRP strikethrough and % off**, size/weight selector chips (50g/100g/250g changing the price), badges (Bestseller, New, Low stock), wishlist heart, **Add to cart** button that turns into a −/qty/+ stepper once added.
- **Shop/catalogue section**: 24–30 SKUs, category filter pills/tabs (Whole, Ground, Blends, Premium, Combos), **sort** (Popular, Price low→high, high→low, New), result count.
- **Quick view**: clicking a product opens a modal/drawer product page (larger visual, description, tasting notes, origin, size select, qty, add to cart, "Buy now").
- **Cart drawer**: slides in on add; line items with image, name, size, qty stepper, remove; **free-shipping progress bar**; coupon code field (e.g. FIRST10 works); subtotal, shipping, total; "Checkout" button (can open a simple mocked checkout step or toast). Cart persists in localStorage (wrapped in try/catch).
- **Combos/bundles** section with bundle price vs individual price savings.
- **Trust strip**: FSSAI certified, lab tested, no fillers/preservatives, COD, easy returns, secure payments (UPI/cards). Payment icons in footer.
- **Reviews** with star distribution / verified-buyer tags.
- **Footer**: shop links, help (shipping, returns, FAQ, track order), contact/WhatsApp, newsletter, social, legal (privacy, terms, refund policy).
- Accessible: buttons are buttons, focus states, Esc closes drawers/modals, body scroll lock while open.
Put the store logic in your own folder (e.g. `src/store/cart.jsx` context). Style all of it in your direction's visual language, so the store looks native to the design and not like a template.

## PERFORMANCE PASS (client says every page lags — this is now the top priority)
Measure ONLY on a production build (the dev server is much slower and not representative):
`cd P/site && PAGE=vN npx vite build --outDir /tmp/perf-vN --emptyOutDir && npx vite preview --outDir /tmp/perf-vN --port 531N --strictPort` (background), then `node tools/perf.mjs http://localhost:531N/vN/ vN`. It applies 4x CPU throttling and scrolls the whole page.
**Targets (both desktop and mobile):** avgFps ≥ 55, p95 ≤ 20ms, jankFrames ≤ 2, no long task > 250ms after first load, and the page must still look premium (the 3D must stay the hero; reduce cost, not wow).
Checklist (apply all that are relevant, then measure, iterate):
- Never call React setState per frame or per scroll event. Drive animation with refs, uniforms and GSAP; only set state on discrete changes (e.g. active SKU index changes).
- One Lenis instance driven by gsap.ticker (lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)) — no second rAF loop. Don't animate layout properties (top/left/width/height/filter/box-shadow) on scroll; only transform/opacity.
- Canvas: `dpr={[1, 1.5]}` desktop, `[1, 1.25]` mobile; drei `<PerformanceMonitor>` to step dpr/effects down on drops; `gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}` when using postprocessing (use SMAA or none). Pause offscreen canvases with `frameloop="never"`/IntersectionObserver; never render two full-screen canvases simultaneously; dispose on unmount.
- Cut instance/particle counts until targets are met (often 40–60% fewer looks identical). Simplify geometry segments. Merge static meshes. No realtime shadow maps; use baked/ContactShadows with `frames={1}` or a blob texture.
- Postprocessing: max one Bloom with `mipmapBlur`, `resolutionScale 0.5`; drop it on mobile and when PerformanceMonitor declines.
- MeshTransmissionMaterial is very expensive: `resolution={256}`, `samples={3}`, or replace with MeshPhysicalMaterial `transmission` for small/background jars. Only one transmission object should render per frame.
- Long tasks at load come from building geometry/textures/sampling and shader compile on the main thread: precompute lazily in chunks (requestIdleCallback), cache, reduce sample counts, and call `gl.compile(scene, camera)` (or drei `<Preload all/>`) before revealing; lazy-load the 3D chunk after first paint with a static poster behind it.
- CSS: avoid `backdrop-filter` over large areas, giant animated box-shadows, `mix-blend-mode` over canvases, `filter` animations, and very large fixed elements; add `contain: paint` to heavy sections, `content-visibility: auto` to far-below-the-fold sections.
- Keep pinned scroll sections short (total page height should not be absurd; trim pin lengths).
Report before/after numbers from tools/perf.mjs for desktop and mobile.
Ports 5171–5175 and 5180 belong to the user's other projects — never use or kill them.
