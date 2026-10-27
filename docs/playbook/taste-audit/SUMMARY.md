# taste-skill audit of the five pitch pages

Run 2026-10-24: `node site/tools/taste.mjs audit` (lint of local `site/vN/` source + `inspect.mjs` on
https://spices-client-03-landings.vercel.app/vN/ in headless Chrome 155, hardware WebGL via `site/tools/chrome-gpu.sh`,
at 1440, 768 and 390 px plus a reduced-motion pass). All 3D scenes rendered; no console errors. No deviations
declared, so every finding counts. The pitch pages predate taste-skill governance: this is a baseline. Each `vN/`
holds `inspect.txt` (with fixes), `lint.txt`, `report.json`, `verdict.json` and the screenshots.

## Scoreboard

| | v1 Masala Pop | v2 Kirana Counter | v3 Midnight Masala | v4 Darbar Maximalist | v5 Spice Lab |
| --- | --- | --- | --- | --- | --- |
| Inspector | **16 FAIL** · 9 WARN | **13 FAIL** · 11 WARN | **16 FAIL** · 9 WARN | **17 FAIL** · 10 WARN | **16 FAIL** · 8 WARN |
| Lint | 88 FAIL · 5 WARN | 53 FAIL · 15 WARN | 46 FAIL · 29 WARN | 71 FAIL · 2 WARN | 88 FAIL · 38 WARN |
| Hero headline | "TURN UP THE MASALA", 3 lines everywhere | "OPEN THE dabba.", 2 lines | "Three threads from one crocus. Everything else follows.", 3–4 lines | "Step into the Kesari bazaar", 2 lines, a `<p>` | "Every spice, resolved to the particle.", 3 lines |
| Typefaces | 4 | 3 | 3 | 6 | 2 (JetBrains Mono 68%) |
| Font sizes (ceiling 5) | 26 | 24 | 27 | 25 | 22 (down to 7px) |
| Text blocks < 13px | 34 | 37 | 88 | 62 | 155 |
| Real raster pictures (floor 4) | 0 | 0 | 0 | 0 | 0 |
| Moving DOM elements (floor 8 / good 16) | 78 | 103 | 119 | 227 | 10 (warn) |
| Length | 13.6 screens | 14.5 | 21.1 | 14.5 | 17.4 |

Nearest to passing: v2. Furthest: v4.

## What the rules catch on all five
1. **No real pictures** (`few-pictures` FAIL, `no-footage` WARN, all five): WebGL and SVG don't count; 0 of 4.
2. **Canvas over the headline** (`covered-text` all five; `late-title` v1, v3, v4, v5): transparent canvases
   (chillies, threads, particles) stacked above the type. Put the canvas under the type.
3. **Tiny tracked capitals** (`micro-label`, all five: 4 / 28 / 159 / 53 / 46).
4. **Text under 13px** (all five, 34–155 blocks) and **22–27 font sizes** (`size-count` WARN).
5. **Gradients** (all five, 1–41 fills: sunburst rays, awning stripes, radial glows, a violet-to-orange sky, a vignette).
6. **Eyebrows** (all five): "Bestsellers" above headings, "01 / Bestsellers", a FSSAI badge over v1's h1 at 768.
7. **Decorative numbering** (v1, v2, v3, v5): 01/02/03, "[00]", "/ 04", "SPECIMEN 01".
8. **Sideways-scrolling rows on the phone** (`side-scroll` WARN, all five).
9. **Long pins** (WARN): v1's floating "YOUR DABBA (0)" cart and v4's hero title on screen for 12 screens.
10. **Yellow-cream grounds** (`palette-cream` WARN, v1–v4) and **one styled word in headlines**
    (`mixed-font-headline` WARN, v1–v4).

## Per variation
- **v1 (16 FAIL):** 3-line headlines at every width; 110 sticker offset shadows, 10 text-shadows, shadowed buttons;
  4 gradients (conic sunburst, radial, zig-zag); contrast 2.1–2.5:1 (cream on sky blue, ink on purple); 4 faces;
  heat labels as tracked caps; 01–05; FSSAI eyebrow at 768; canvas over the whole headline. Lint: 50 shadows,
  17 gradients, 13 `kicker` classes.
- **v2 (13 FAIL):** 13 eyebrows, 28 tracked labels, 01–03; 4 hairlines, 15 outlined boxes, an 8-card icon-topped
  trust row; 3 gradients; ★ ratings counted as emoji; "HALDI/JEERA/MIRCH" hidden under the jar scene; announcement
  bar 11px from the phone edge. WARN: the h1 "OPEN THE dabba." never says what Kesari sells.
- **v3 (16 FAIL):** hero 3–4 lines; a 26-word manifesto set at 69px (statements ≤ 36px); 159 Cinzel tracked labels;
  88 tiny blocks (down to 9px); 41 gradients; 22 hairlines; "Kashmiri"/"Green" clipped at the top; 640px and 492px
  blank gaps; the threads canvas drawn over the headline. Longest page (21 screens).
- **v4 (17 FAIL):** no visible h1 (the first-screen title is a `<p>`; the real h1 is deeper in the pinned hero behind a
  reveal); under reduced motion the hero text stays invisible; 6 typefaces; 42 offset shadows; 14 gradients; ❖ ★ ❀
  as emoji; an 8-card icon row; 53 tracked labels; title under the diorama; a 3,822px empty middle in the recipes.
- **v5 (16 FAIL):** JetBrains Mono for 68% of text (`mono`); 3–4-line headlines; 17 eyebrows; "[00]"/"/ 04" numbering;
  46 tracked labels incl. coordinates; 56 hairlines, 16 outlined boxes, icon-card rows; 155 tiny blocks (7px);
  `still-page` WARN (10 DOM movers; the motion lives inside WebGL, which isn't counted). The direction is the
  "gallery fashion" taste-skill bans as house style (tells.md §4): it needs a new direction, not fixes.

## What the meter cannot see
Anything inside the canvas (glow, bloom, 3D type legibility); whether there is an idea, a live thing and full
content (the critique loop, which no pitch page has been through). It also flags two store conventions literally:
★ rating glyphs count as emoji (use SVG stars or "4.7 out of 5"), and a sticky cart counts as a long pin
(declarable, TASTE-SKILL.md §9).
