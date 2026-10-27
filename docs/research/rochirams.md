# Rochi Ram's (https://rochirams.com/) - DEEP ANALYSIS

Nagpur-based nuts and dried fruit, 11 SKUs ("Eleven jars. Zero shortcuts."). Team favourite #2. Brand: "Bite into the good stuff." Packed by RK Cashew Industry.
Screens: `screens/rochirams-00-hero.png` ... `rochirams-07.png`. Raw: `raw/rochirams.com.html`, `raw/roch.css`.

## Tech stack (verified)
- **Next.js (App Router, Turbopack build)** on Cloudflare, **Tailwind CSS v4** (theme tokens `--color-*`). Fonts via `next/font` (self-hosted woff2).
- No GSAP / Lenis / Three.js / framer-motion in chunks. Motion = **pure CSS `@keyframes marquee` (40s linear infinite)**, `pulse`, **IntersectionObserver** scroll reveals, sticky header with shadow-on-scroll, filter pills, hover states. Custom cart ("Cart (0)") - looks like a custom/headless build rather than Shopify.
- Takeaway: it is a **small, hand-built, very disciplined design system**. Page height ~6300px at 1440w.

## Typography (the biggest part of the "look")
- **Anton** (Google Font) - tall condensed poster headline, ALL CAPS, tight leading.
- **Instrument Serif *italic*** (Google Font) - one word per headline swapped into italic serif and colour accent: "BITE INTO THE *good* STUFF.", "ELEVEN JARS. *Zero* SHORTCUTS.", "BRAIN FOOD, *in a jar.*", "MEET THE *family.*", "THE *overnight* RITUAL.", "GIFT THE *whole* HARVEST.", "JOIN THE *pantry club*". This **sans-condensed + italic-serif word** pairing is the signature.
- **DM Sans** body/UI (variable). Letter-spaced small caps eyebrows ("THE PANTRY", "PACKED IN NAGPUR - 100% NATURAL"). Hindi/regional names as italic serif sub-labels under English names (Badam, Akhrot, Pista, Kaju, Anjeer, Khumani, Kali Kismis).

## Palette (from CSS tokens)
| Token | Hex | Use |
|---|---|---|
| cocoa | `#2B1610` | dark header/hero/footer, text |
| cocoa-2 | `#3D2218` | |
| kraft (page bg) | `#F4EADB` | main light background |
| paper | `#FBF4E8` | cards, inputs |
| sand | `#EADBC4` | |
| cream-dim / mute | `#E3D4BF` / `#CDBBA4` | |
| line / line-strong | `#E2D1B8` / `#CDB89C` | hairlines |
| rk (brand red) | `#C62A1F`, dark `#8E1C14` | CTAs, accents, italic word |
| saffron | `#F0B429` | hero arch, gift section, nav cart pill |
| amber | `#B07A12` | |
| olive / sage | `#4D6B2E` / `#DCE4CC` | pistachio/kiwi tile |
| ink-soft / muted / bark | `#5C4436` / `#6B5245` / `#7A5A48` | |
| per-SKU tile tints | `#E8DAC4`, `#F6E094` (apricot), `#F2D0DA` (cranberry), `#E0EAC0`, `#D4DCE4` (raisin blue) | |

## Homepage structure
1. **Top announcement bar** (red `#C62A1F`): "Free shipping on orders over Rs 999 | No preservatives. No added oil. Ever."
2. **Sticky dark-cocoa header**: striped red/yellow **awning-style logo plate** (mimics a shop awning), centered nav (Shop all, Pistachios, Gifting, Nutrition), saffron pill "Cart (0)".
3. **Hero (dark cocoa, 2 columns)**: left - eyebrow with line "PACKED IN NAGPUR - 100% NATURAL", giant cream Anton headline with saffron italic serif "good", paragraph, red pill CTA "Shop the pantry ->" + outline pill "Send a gift box", hairline then 3 micro-facts (11 pantry staples / 250g-1kg resealable jars / Vegan & gluten-free). Right - **saffron arch (window shape) with vertical stripes** (awning echo) holding a huge Breakfast Mix jar, circular red "100% natural" rotated stamp sticker overlapping the arch edge, floating cream price card "BREAKFAST MIX From Rs 280 ~~Rs 1,699~~".
4. **Red/yellow awning-stripe band + infinite marquee** of Hindi names in Anton: PISTA / KAJU / ANJEER / KHUMANI / KISMIS / BADAM / AKHROT (40s loop, slash separators in saffron).
5. **The Pantry (kraft bg)**: eyebrow + headline + **filter pill group** (All / Nuts / Dried fruit / Mixes - dark active state). **4-column grid of 11 product cards.**
6. **Jar of the Month feature (dark)**: jar on rounded kraft panel left; right: "BRAIN FOOD, *in a jar.*", benefits with saffron ticks (2x2), saffron CTA "Shop walnuts - from Rs 450" + 1kg price.
7. **Trust strip (kraft)**: 4 icon-in-dark-circle items (100% natural / Vegan & gluten-free / Resealable jars / Free shipping).
8. **"Meet the family" label wall**: horizontally scrolling row of label crops (each jar's label colour) with names + "from Rs".
9. **"The overnight ritual"**: 3 rounded white cards with giant red Anton numerals 01/02/03 (Almonds, Black raisins, Dry figs) - soak tips + "Shop almonds ->" link. Nutrition/education framed as grandma's tradition.
10. **Gift section (full-bleed saffron)**: "GIFT THE *whole* HARVEST.", Diwali/Christmas/Corporate eyebrow, dark pill + outline pill CTAs, tilted jar image bleeding off.
11. **Newsletter "Join the *pantry club*"**: kraft bg, pill email input + red pill button.
12. **Awning-stripe divider + dark footer**: logo plate, packer address/contact, Shop + Learn link columns, italic serif tagline, allergen caution.

## Product card (the detail the team likely liked)
- Rounded 20px tile, **background tint = label colour of that jar** (sand, apricot yellow, cranberry pink, kiwi green, raisin blue, cashew tan) - jar centered, soft shadow.
- Dark pill badge top-left "SAVE 76%" (saffron text).
- Under image: English name (DM Sans 600) + **round red "+" add button** on the right; beneath it **Hindi name in italic serif**; tiny benefit line ("Raw - Vitamin E - Keto"); hairline; price bold `Rs 350` + strikethrough MRP, right-aligned "from 250g".
- Quick add without leaving the grid.

## Signature interactions
- Endless CSS marquee, striped awning dividers, sticky nav with drop shadow, pill-filter product grid, scroll reveals via IntersectionObserver, hover lifts (Tailwind transitions). Simple but **polished micro-details** (stamp sticker, floating price card, arch).

## Copywriting tone
Warm, witty, desi-modern, short declaratives: "Bite into the good stuff.", "Eleven jars. Zero shortcuts.", "Brain food, in a jar.", "Grandma was right. Soak tonight, eat at sunrise.", "The healthy gift everyone actually opens." Hindi names as flavour, nostalgia + science (omega-3, iron).

## Why it feels premium despite low tech
Strict 4-colour system (cocoa, kraft, red, saffron), one signature type trick, big whitespace, consistent radii, **the shop-awning motif repeated** (logo plate, hero arch stripes, dividers, marquee band), real product-first hero, honest facts, and label-colour-coded tiles.
