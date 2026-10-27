# SYNTHESIS - Reference research for the 5 spice-brand landing pages

Per-site notes live next to this file: `evernuts.md`, `rochirams.md`, `diasporaco.md`, `burlapandbarrel.md` (deep) and `som-drinksom.md`, `ghia.md`, `graza.md`, `flybyjing.md`, `brightland.md`, `tonyschocolonely.md`, `liquiddeath.md`, `piquetea.md`, `bluetokai.md` (brief). Screenshots: `screens/`. Raw HTML/CSS: `raw/`.

Honest caveats: sites were inspected via curl (HTML/CSS/JS chunks), computed styles and Playwright viewport screenshots. Hover micro-interactions and exact scroll-driven timings were inferred from CSS/JS, not recorded on video. Search tools did not surface a ready-made "Awwwards spice/tea Three.js" list, so the extra set mixes one verified Awwwards WebGL food/drink SOTD (SOM) with top Shopify D2C food/bev brands; /zeroz (Awwwards WebGL) was in maintenance mode when crawled.

---

## 1. What Evernuts and Rochi Ram's do that the team loved (specific)

**Shared DNA (both are Indian, both are NOT high-tech):**
- **Product pack is the hero and the colour system.** Every SKU has its own colour; tiles/cards are flat tints of the pouch/label colour (Evernuts: crimson, sunflower, olive, azure, aubergine; Rochi Ram's: apricot yellow, cranberry pink, kiwi green, raisin blue). The grid becomes a rainbow, colour = wayfinding and appetite.
- **One ownable display typeface treatment.** Evernuts: distressed stamped CitrusGothic caps for every heading. Rochi Ram's: Anton poster caps + one word in italic Instrument Serif in an accent colour.
- **Retro-FMCG warmth with modern polish**: sunburst rays / shop awning stripes / arch window; sticker stamps ("100% natural", "100% Real"), tilted tags, price tag floating cards.
- **Short, witty, benefit-first copy** with rhythm ("Spices that speak flavour." / "Bite into the good stuff." / "Eleven jars. Zero shortcuts.").
- **Trust rails everywhere**: free-shipping bar, "no preservatives/no added oil", reviews, marketplace logos (Evernuts), nutrition + 4-icon trust strip (Rochi Ram's).
- **Cultural moment**: Evernuts' illustrated Taj/India Gate/Red Fort/Hawa Mahal skyline above footer; Rochi Ram's Hindi names (Badam, Akhrot, Kismis) and "Grandma was right" soak ritual.
- **Motion is simple but rhythmic**: infinite marquees (Evernuts blue strip; Rochi Ram's Anton Hindi-names band), carousels, reveal-on-scroll. No heavy libraries: speed + clarity.

**Evernuts specifics to emulate**: red/orange sunburst banner with 3 fanned pouches + paper-sticker tags + hand-drawn arrow; 4x2 pastel category tiles with cut-out product bleeding off edge; blob-masked lifestyle photo in a rounded colour panel; "Shop by Purpose" circular icon badges; speech-bubble review cards; marketplace logos; huge sign-off headline over monument illustration; product card = coloured square, size chip, full-width Add to cart.

**Rochi Ram's specifics to emulate**: dark cocoa hero + saffron arch with striped backdrop + rotated circular stamp + floating price card; filter pills (All/Nuts/Dried fruit/Mixes); product card with round red "+" quick add and italic Hindi sub-name; jar-of-the-month feature; "Meet the family" label wall; numbered ritual cards (01/02/03 in giant Anton); full-bleed saffron gifting band; striped awning dividers; "pantry club" newsletter; honest footer.

## 2. Common patterns of premium food/spice D2C sites (across all 15)
1. **Announcement bar** with a threshold promise (free shipping, gift, referral) - 12/15.
2. **Hero = product or lifestyle at huge scale**, 1 headline, 1 CTA, often a moving layer (video: Graza, Liquid Death, Pique; marquee under hero: Ghia, Evernuts, Rochi Ram's).
3. **Claims/USP strip or marquee** directly under hero (No preservatives / Single origin / Fair wages / 0% alcohol).
4. **Press logo bar** (Brightland, Burlap & Barrel) as instant credibility.
5. **Origin & people storytelling**: farm cards, farmer portraits, named regions (Diaspora, Burlap). Indian opportunity: Kerala pepper, Guntur chilli, Lakadong turmeric, Kashmir saffron, Alleppey cardamom on a map.
6. **Colour-coded SKU system and packaging-first imagery** (Evernuts, Rochi Ram's, Ghia, Tony's).
7. **Recipes/rituals** tying spice to a plate (Diaspora, Rochi Ram's soak ritual, Fly By Jing).
8. **Bundles / build-your-own / subscription** (Ghia, Blue Tokai, Burlap Spice Club, Evernuts bundles).
9. **Two-tier type**: loud display + quiet body; mono or serif micro-labels for facts.
10. **Humour and character in copy** (Graza, Liquid Death, Rochi Ram's).
11. **Product card anatomy**: tinted image, badge, name + vernacular/origin line, rating, price + MRP strike, size chip, quick-add.
12. **Tech reality**: 11 of 13 non-WebGL sites are Shopify themes with Swiper/Flickity; only SOM (and /zeroz) use true Three.js/GSAP. => **Real 3D/WebGL is the clear way to out-do every reference, including the client's two favourites.**

---

## 3. FIVE DISTINCT CREATIVE DIRECTIONS

Convention: all fonts are free Google Fonts. Three.js ideas assume `three` + `@react-three/fiber`/vanilla, GSAP + ScrollTrigger + Lenis for scroll. All hero ideas must have a static poster fallback and `prefers-reduced-motion` handling. Product count 25-50 means: category rails + filterable grid, plus a "hero 6" featured.

---
### DIRECTION 1 - "MASALA POP" (bold playful pop; leans STRONGLY into Evernuts)
**Mood:** Sunday-market sticker book, loud, joyful, snackable. Colour = flavour.
**Palette:** cream `#FFF3DC`, chilli red `#E03A2F`, turmeric yellow `#FFC21A`, cardamom green `#2FA36B`, jamun purple `#6B2D8B`, sky `#2BA8E0`, ink `#1A1208`, pink `#FF8FB1`.
**Fonts:** **Bowlby One** (or **Rubik Mono One**) for display + **Rubik Dirt**/**Rubik Wet Paint** for a stamped accent; **Baloo 2** or **Poppins** body; **Caveat Brush** for handwritten tags.
**Sections:** 1) marquee announcement; 2) sunburst hero with fanned pouches + sticker tags; 3) claims marquee ("Hand-ground. Zero fillers. Fresh batch."); 4) **colour-coded category tiles** (pastel, cut-out spice bleeding off edge); 5) "Best sellers" grid, tinted cards + size chips; 6) "Pick your heat" quiz/spice-meter tiles (Mild/Medium/Fire); 7) **Shop by purpose/meal** circular badges (Dal tadka, Biryani, Chai, Sabzi); 8) lifestyle bento gallery (UGC style); 9) speech-bubble reviews; 10) recipe cards; 11) marketplace/retail logos; 12) giant "sign-off" headline over an illustrated Indian-spice-market skyline; 13) newsletter + footer.
**Signature 3D/WebGL hero:**
 - **A. "Pouch Pinball / Pouch Carousel":** three-four glossy stand-up pouches (Three.js, `MeshPhysicalMaterial` with sheen + clearcoat, wrinkle normal map) tilt toward the cursor with spring physics; click a pouch -> it spins 360, the sunburst behind recolours to that SKU's hue and a burst of spice-shaped confetti (instanced meshes: chillies, cardamom pods, star anise) pops out.
 - **B. "Spice Shower":** instanced 3D chilli/peppercorn/turmeric-chunk particles fall with Rapier/cannon-es physics and pile at the bottom of the hero; moving the mouse acts as a spoon that stirs them.
**Motion language:** springy overshoot, stickers "slap" in with rotation, rays slowly spin (CSS conic-gradient), marquees, hover wiggle, colour-wash page transitions between categories. Fast, bouncy (back.out(1.7)).
**References:** Evernuts (primary), Tony's Chocolonely (tilted stickers), Fly By Jing (zigzag divider), Liquid Death (humour), Graza (product naming).

---
### DIRECTION 2 - "THE KIRANA COUNTER" (warm retro-editorial pantry; leans STRONGLY into Rochi Ram's)
**Mood:** Grandma's masala dabba meets a modern magazine. Cocoa, kraft paper, saffron; honest, nostalgic, confident.
**Palette:** cocoa `#2A1710`, kraft `#F3E8D6`, paper `#FBF4E8`, brick red `#C0392B`, saffron `#F2B230`, sage `#DCE4CC`, turmeric tan `#D9B26F`, ink-soft `#5C4436`.
**Fonts:** **Anton** or **Bebas Neue** (poster caps) + **Instrument Serif Italic** (accent word, vernacular sub-names) + **DM Sans** body; **Fraunces** optional for pull-quotes.
**Sections:** 1) bar; 2) sticky nav with awning-stripe logo plate; 3) dark hero: Anton headline w/ italic accent word, saffron arch window with striped backdrop, rotated "100% ground fresh" stamp, floating price card; 4) awning band + **Hindi/regional names marquee** (Haldi / Jeera / Mirch / Elaichi / Laung / Dalchini / Kesar / Hing); 5) **"The Masala Dabba" pantry grid** with filter pills (Whole / Ground / Blends / Salt & Chai); tinted cards, round "+" quick add, vernacular italic names; 6) Spice of the Month feature; 7) trust strip icons; 8) "Meet the family" label wall; 9) **"The Tadka Ritual"** numbered cards 01/02/03 (how to bloom whole spices, Grandma was right); 10) saffron gifting band (Diwali, wedding hampers, corporate); 11) "Join the dabba club" newsletter; 12) striped divider + honest footer with packer/FSSAI details.
**Signature 3D/WebGL hero:**
 - **A. "Spinning Masala Dabba":** the classic round steel 7-compartment **masala dabba** (modelled in Blender -> glTF/Draco) seen top-down in the saffron arch; compartments' lids lift one by one on scroll (GSAP-scrubbed), revealing heaped spice meshes (displacement-mapped piles with instanced grain particles); hovering a compartment tilts the camera and updates the hero copy + CTA to that spice.
 - **B. "Jar Rotisserie":** a row of 3D glass jars (transmission material, labels from real art) on a shelf; scroll pushes the camera along the shelf like walking a kirana aisle, jars rattle subtly on pass.
**Motion language:** unhurried and tactile - 40s marquees, soft fade-up reveals (IntersectionObserver), 0.4s ease-out hover lifts, number count-ups, stamp rotates in. Subtle, no bounce.
**References:** Rochi Ram's (primary), Burlap & Barrel (pile-of-spice photography, label pattern), Brightland (still-life), Blue Tokai (education).

---
### DIRECTION 3 - "MIDNIGHT MASALA" (dark luxury)
**Mood:** A candle-lit spice vault; single-origin saffron as caviar. Quiet, sensual, expensive.
**Palette:** obsidian `#0B0907`, charcoal `#16120E`, antique gold `#C9A24B`, saffron glow `#E8862A`, ember red `#7A1F1A`, bone `#EFE6D4`, smoke `#8C8174`.
**Fonts:** **Cormorant Garamond** (headlines, light, large) + **Cinzel** (small-caps logotype/labels) + **Manrope** body; **Italiana** for numerals.
**Sections:** 1) hero (full-viewport WebGL); 2) one-line manifesto; 3) "The Collection": horizontally scrolled **tasting-note cards** (aroma, heat, origin, pairing) for hero 6 SKUs; 4) full catalogue as a minimal list/table with hover image reveal (cursor-following image); 5) **Origin map** (dark map, gold pins: Alleppey, Guntur, Pampore, Lakadong, Kodagu); 6) process in 4 chapters (harvest, sun-dry, stone-grind, seal) with video plates; 7) chef/press testimonials; 8) gifting vault (wooden box); 9) private "Inner Circle" newsletter; 10) minimal footer.
**Signature 3D/WebGL hero:**
 - **A. "Saffron Nebula":** thousands of crimson saffron-thread instances (thin curved tubes, `InstancedMesh`) drift like embers in volumetric god-rays (postprocessing bloom + noise), then magnetise into the shape of the brand mark / a gold-lidded tin when the user scrolls; cursor = light source (point light follows mouse, specular glints on threads).
 - **B. "Molten Spice Tin":** a hero gold-lidded tin with real reflections (HDR studio env + `MeshPhysicalMaterial` metal), scroll opens the lid and a **volumetric spice-dust plume (GPU particles, curl noise)** rises, colour-grading the whole page from gold to ember per SKU.
**Motion language:** slow, heavy, cinematic - 1.2-1.8s eases (power3.out / expo), parallax depth, text lines masked-reveal, cursor-follow glow, Lenis smooth scroll, fade-through-black transitions. No bounce, no stickers.
**References:** Pique Tea (chiaroscuro still-life, navy+gold), SOM (persistent 3D product, glass cards, mono details), Liquid Death (gold/black), Fly By Jing (heat glow).

---
### DIRECTION 4 - "DARBAR MAXIMALIST" (maximalist Indian heritage)
**Mood:** Mughal miniature painting x truck art x Banarasi brocade. Dense, ornamental, celebratory, wedding-season.
**Palette:** royal indigo `#1E1B5E`, marigold `#F7A614`, rani pink `#D81B76`, emerald `#0E7A57`, vermilion `#D9381E`, ivory `#FFF6E5`, gold `#D4A017`, peacock teal `#0D8E9B`.
**Fonts:** **Playfair Display** or **Rozha One** (display), **Yeseva One** accent, **Cormorant** italics; **Mukta**/**Hind** body with **Tiro Devanagari Hindi/ Yatra One** for Devanagari flourishes (free); **Poppins** UI.
**Sections:** 1) ornate announcement with border; 2) hero framed in a **jaali/arch (toran) frame** with layered paper-cut illustration (elephants, peacocks, spice vines); 3) "Six regions, six spice kingdoms" - **interactive illustrated map** of India with region cards; 4) product shelf as **ornate "thali" tiles** each with a mini-motif border and a story line; 5) **Rasoi Darbar:** tabs by occasion (Shaadi, Diwali, Ramzan, Pongal, Onam) -> curated hampers; 6) pattern-banded story sections (block-print, kantha) with farmer portraits; 7) "Recipes from 28 states" strip; 8) testimonials as wedding-card invitations; 9) hamper builder; 10) newsletter as "Nimantran" (invitation); 11) pattern-heavy footer.
**Signature 3D/WebGL hero:**
 - **A. "Paper-cut Diorama":** 6-8 layered parallax planes (Three.js, depth via z-offset + slight camera orbit on mouse/gyro) of an illustrated spice bazaar - rooftops, arches, elephant, hanging lamps with real glowing point lights; scroll dollies the camera *through* the layers into the shop.
 - **B. "Rotating Thali":** a 3D brass **thali** with 7 katoris filled with different spices (shader-based powder piles, tiny animated steam particles); drag to spin like a lazy susan; clicking a katori zooms to a product.
**Motion language:** ornamental and rhythmic - pattern borders that draw themselves (SVG stroke-dashoffset), curtain/toran reveals, rotating mandala behind headings, parallax layers, marigold petal particle bursts on add-to-cart.
**References:** Evernuts (monument illustration sign-off, vivid colour), Diaspora Co. (saturated colour, illustration, origin cards), Burlap & Barrel (woven pattern as brand device), Tony's (celebratory imperfection).

---
### DIRECTION 5 - "SPICE LAB / ÅROMA-X" (futuristic, experimental)
**Mood:** Molecular gastronomy meets product-drop culture. Clinical, monochrome with one acid accent; data as decoration.
**Palette:** off-white `#EEF0EA`, graphite `#0F1113`, fog `#B3B8B5`, acid lime `#C6FF3D`, hot chilli signal `#FF3B1F`, cool grey `#6B7177`.
**Fonts:** **Space Grotesk** or **Bricolage Grotesque** (headlines, tight) + **JetBrains Mono** / **IBM Plex Mono** (all labels, prices, specs, buttons) + optional **Syne** ExtraBold for oversized display.
**Sections:** 1) full-viewport WebGL hero with HUD overlays (coordinates, batch #, "scroll to explore"); 2) **"Compound sheet":** spec tables per spice (curcumin %, piperine, SHU heat, moisture, harvest date, batch QR); 3) **Product index** as a dense sortable table/grid with hover thumbnails and a "compare" drawer (works for 25-50 SKUs); 4) interactive **heat-scale / flavour-wheel** radar charts; 5) traceability: scan batch -> farm map + lab report; 6) "Lab notes" (blog/recipes as experiments); 7) drops/subscription ("Monthly Compound"); 8) glass-morphism cart; 9) mono footer.
**Signature 3D/WebGL hero:**
 - **A. "Particle Pantry":** ~200k GPU particles (WebGL2 / three `GPUComputationRenderer` or WebGPU TSL) form the silhouette of a chilli, then on scroll morph (position texture lerp) into turmeric root, cardamom pod, star anise; each state has its own colour-ramp and a mono caption with spec data. Mouse repels particles with a force field; click = shockwave.
 - **B. "Spice Dust Fluid":** full-screen fluid simulation (Navier-Stokes shader, like WebGL fluid demos) in the colour of the spice under the cursor, with the floating 3D hero jar (Three.js, `MeshTransmissionMaterial`) refracting the swirls behind it; selecting a flavour changes the dye colour.
**Motion language:** snappy, precise, linear/cubic-bezier eases, text scramble/decode effects, number tickers, scroll-pinned chapters, glitch-free cut transitions, custom crosshair cursor, magnetic buttons. Fast (0.3-0.6s).
**References:** SOM (Awwwards WebGL SOTD: mono UI, glass cards, persistent 3D), /zeroz (immersive chapters), Graza (mono UI type), Pique Tea (science copy).

---

## 4. How the 5 differ (at a glance)
| # | Name | Mood | Base | Type feel | Hero tech | Closest to client taste |
|---|---|---|---|---|---|---|
| 1 | Masala Pop | loud, playful | cream + rainbow | stamped heavy caps | interactive pouches + spice confetti | Evernuts (strong) |
| 2 | The Kirana Counter | warm, nostalgic | kraft + cocoa + saffron | condensed caps + italic serif | 3D masala dabba / jar aisle | Rochi Ram's (strong) |
| 3 | Midnight Masala | luxe, quiet | black + gold | light serif + small caps | saffron nebula / gold tin | none (new) |
| 4 | Darbar Maximalist | ornate, festive | indigo/marigold/pink | decorative serif | paper-cut diorama / thali | Evernuts monuments + Diaspora |
| 5 | Spice Lab | clinical, experimental | off-white + graphite + acid lime | grotesk + mono | GPU particle morph / fluid | SOM |

## 5. Build notes (apply to all)
- Stack suggestion: Vite/Next + Three.js (or R3F), GSAP ScrollTrigger, Lenis; assets as Draco glTF < 1.5 MB, KTX2 textures; lazy-load canvas after LCP poster image.
- Mobile: swap WebGL for lighter variant (fewer instances, no postprocessing) or poster video; keep tap targets and add-to-cart in the first scroll.
- Content to fake consistently across all 5: ~8 categories, hero 6 SKUs, 25-50 product grid with size chips (50g/100g/250g), vernacular names, heat meter, origin line, rating, price + MRP.
- Always include: free-shipping threshold bar, FSSAI/lab-tested trust strip, reviews, gifting, newsletter - all 15 references do.
