# Evernuts (https://www.evernuts.in/) - DEEP ANALYSIS

Indian D2C: dry fruits, spices, seeds, dates, makhana, pasta (130+ SKUs). Team favourite #1.
Screens: `screens/evernuts-00-hero.png` ... `evernuts-10.png`. Raw: `raw/www.evernuts.in.html`, `raw/ev_main.css`.

## Tech stack (verified from HTML/network)
- Platform: **Shopify**, theme **"Minimog - OS 2.0" v5.8.0** (`Shopify.theme.schema_name`), customised by agency FlexyPe (`static.flexype.in`).
- JS: Swiper (product tabs, testimonials, announcement bar), jQuery, theme vendor.js. **No GSAP / Lenis / Three.js / canvas** (0 canvas elements). Motion = theme CSS keyframes (`m-fade-in`, `m-fade-in-up`, `m-fade-in-left/right`), CSS marquee, Swiper sliders.
- Apps: Judge.me reviews, Foxkit upsell/bundles/cart-goal, Fidras consent, Shopify chat, Google Merchant widget, Gokwik-style sticky mobile bar.
- Takeaway: the "wow" is **not tech - it is art direction, packaging colour and copy**. Very cheap to build, very high brand recall.

## Typography
- Display: **CitrusGothic Regular** (custom .otf, hosted in Shopify files) - rough, ink-stamped/distressed condensed gothic, ALL CAPS, used for every section title ("SHOP BY CATEGORY", "OUR BEST SELLERS", "HAPPY CUSTOMERS"). Some titles are tinted blue (#017EAE-ish) for emphasis.
- Body: **Poppins** (Regular/500/600).
- Hero banners are image-baked lettering in a chunky rounded brush/sticker face ("SPICES THAT, SPEAK FLAVOUR.") with a hand-drawn underline.
- Free Google approximations: **Bowlby One / Anton / Bebas Neue + "Rubik Wet Paint"/"Rubik Dirt"** for distressed feel; **Poppins** body.

## Palette (from CSS vars + screenshots)
| Role | Hex |
|---|---|
| Page background (cream) | `#FEF5E4` |
| Brand blue (logo, nav strip, buttons, footer, testimonial cards) | `#017EAE` / `#007FAF`, button `#1A75BD` |
| Brand teal (accent) | `#108474`, `#49A594`, mint `#DFF8EF` |
| Hero red sunburst | ~`#D94A4A` -> `#C23030` rays |
| Orange sunburst banner | ~`#E8501A` |
| Category tile pastels | olive-yellow `#DDD36A`, aqua `#9BE8E0`, salmon `#F2A68E`, lavender `#C9C0F0`, pink `#F7BFD0`, orchid `#C99BE0`, mint `#A8F09A`, rose `#F5707F` |
| Product-card backgrounds | each SKU gets a **flat colour matching its pouch** (crimson, sunflower yellow, olive, azure, teal, aubergine, green, sky) |
| Text | `#000` |

## Homepage structure (section IDs read from HTML + screenshots)
1. **Announcement bar** (blue, rotating Swiper, "Free shipping for all orders from Rs 699+", close X).
2. **Header**: round blue sticker logo left; mega-menu (Dry Fruits, Spices, Dates, Dried Fruits, Seeds, Pasta, Makhana, Signature Flavours, Company); search/account/wishlist/cart icons. Cream background.
3. **Hero banner** (full-width image slide): red radial **sunburst rays** background, three standing pouches fanning (centre one largest, overlapping), left-aligned stacked 2-line headline in white chunky type with underline stroke, tilted "sticker" tags ("100% Real", "Spices") that look like paper labels, hand-drawn dashed arrow, floating ingredients (cinnamon, star anise, splashes), white pill "SHOP NOW". Next hero slide swaps to orange sunburst + almond & raisin pouches ("PURE CRUNCH, PURE ENERGY.").
4. **Scrolling marquee strip** (blue): "Taste the quality. Love the variety. [sparkle] Freshness sealed. Happiness guaranteed."
5. **Shop by Category** - 8 rounded-rectangle tiles in a 4x2 grid, each pastel colour + category name in CitrusGothic left + product/ingredient cut-out bleeding off the right edge.
6. **Overview / brand intro** in a big blue rounded card: heading + copy with bold key claims ("130+ premium...", "in-house cold storage, hygienic handling, lab testing") + irregular blob-masked photo of a smiling woman holding pouches. Tagline: "quality shouldn't be expensive - it should be accessible."
7. **Our Best Sellers** (Swiper tabs): 4-up product cards.
8. **Full-width banner #2** (orange sunburst).
9. **Our Flavour Specials** carousel (flavoured nuts: Black Pepper Cashews, Peri Peri Makhana, Paan Raisins...).
10. **Our Best Spices** carousel (Himalayan Rock Salt, Rajapuri Turmeric, Kashmiri Chilli, Chat Masala, Garam Masala...).
11. **Shop by Purpose**: 5 white circular badges with blue line-icons (Immunity, Energy, Glow, Wellness, Gourmet) on soft drop shadow.
12. **"Evernuts Studio - styled by Evernuts"**: bento/masonry gallery of lifestyle photos (woman in Mughal arch interior, kitchen counters, kids) - Indian homes, warm light.
13. **Where you can find us**: marketplace logos (Flipkart, Snapdeal, Amazon, Blinkit, JioMart, Zepto) - trust/availability.
14. **Happy Customers**: Swiper of blue **speech-bubble cards with a tail** (triangle pointing down), white stars, CitrusGothic review titles ("AMAZING QUALITY"), product thumbnail; inactive slides faded to light blue.
15. **FAQ** (collapsible tabs).
16. **"EVERNUTS ABOUT YOU [heart]"** - giant stamped headline over a **flat illustrated Indian-monument skyline** (Taj Mahal, India Gate, Red Fort, Hawa Mahal) - the emotional sign-off right above footer.
17. **Blue footer**: 4 columns (company, help, shop, Subscribe w/ email input + social circles), sticky chat button, back-to-top blue circle.

## Product card
Square (1:1) image with **flat SKU-coloured background and rounded corners (~12px)**, pouch centred with soft floor shadow; small yellow "BEST SELLER" corner ribbon; title (Poppins 500); Judge.me gold star row + "2 reviews"; price `Rs. 218.00` with strikethrough MRP; **size chip** ("250g", blue filled); full-width blue **Add to cart** button (5px radius). No hover-heavy effects visible; it's information-dense and commerce-first.

## Copywriting tone
Friendly, assurance-led, alliterative slogans: "Spices that speak flavour", "Pure crunch, pure energy", "Goodness you can feel", "Freshness sealed. Happiness guaranteed.", "Evernuts about you". Short, confident, benefit-first; Indian-accessible ("quality shouldn't be expensive").

## What makes it feel "premium"/memorable
- **Colour-coded SKU system**: every pouch has its own hue, the page becomes a rainbow of packaging; colour = navigation.
- **Sunburst/retro-pop hero** with fanned packs and sticker tags: playful, high-energy, instantly reads "Indian FMCG but modern".
- One distinctive typeface (stamped CitrusGothic) used uniformly = ownable.
- Generous product photography on flat colour; consistent rounded corners.
- Cultural illustrated moment (monument skyline) near the footer.
- Trust rails: marketplaces, reviews, lab-test claims.

## Weak spots we can beat
Standard Shopify product grid, no scroll storytelling, no origin/process story, no 3D, no sensory (aroma/heat) cues, small price/size UI.
