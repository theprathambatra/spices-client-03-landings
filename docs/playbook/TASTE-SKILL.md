# TASTE-SKILL — the operating manual for every Kesari build

taste-skill (install name `design-taste-frontend`, upstream v2.1.4) is the **governing principle of every build in this
project**. It is not a reference to skim: its run is executed in order, its library deals the direction, its inspector
is the gate, and its critique loop is how work is judged. This manual turns the skill into exact steps, commands and
pass criteria for builders working in `site/vN/` (React 19 + Vite + R3F + GSAP). Where this manual and the skill
disagree, the skill wins, except for the deviations declared in section 9.

Project root below is `P` = `/Users/shaurya_frenzy/Documents/Spices Client-03`. Run every command from `P`.

---

## Contents

0. Before you start: read, verify, set up
1. The tools, one command each
2. The run, step by step (inventory → argument → draw → idea → words → build → gate → look → move → report)
3. Querying the library by hand
4. House rules and bans (complete)
5. Copy rules
6. Imagery rules, translated into ChatGPT image prompts
7. Motion budget
8. Three.js / R3F under taste-skill
9. Where the spice brand deliberately deviates, and how to declare it
10. The store UI (cart, product cards, checkout) under taste-skill
11. Pass criteria and the evidence you hand back
12. Appendix: every inspector rule id

---

## 0. Before you start

**Read in full, in this order** (not skim; the hand-back asks you to prove it, section 11):

1. `P/.claude/skills/taste-skill/SKILL.md` (the run, the house rules, the laws)
2. `references/copy.md`, `type.md`, `colour.md`, `layout.md`, `imagery.md` (all twelve sections), `motion.md`,
   `critique.md`, `tells.md`
3. `references/scenes.md` if your page has a scroll scene (a pinned, scrubbed stage)
4. `references/app-screens.md` §8 (forms), §11 (empty/loading/error states), §12 (phone), §13 (house rules for app
   screens): these govern the insides of the cart drawer, checkout, account and order tracking (section 10 here)
5. `references/research.md` when you need a number. Cite it; never invent figures.

**Verify the toolchain** (10 seconds; must print `everything the taste-skill scripts need is in place`):

```bash
node site/tools/taste.mjs doctor
```

It checks Node 22+, that the install is byte-identical to upstream, that the library parses, that every script parses,
that headless Chrome launches through the GPU shim and that WebGL gets a hardware renderer.

**Set up your workspace.** Your working files live in `P/.taste-skill/vN/` (sheet, screenshots, logs). Inspect a
**production preview**, never the dev server:

```bash
cd site && PAGE=vN npx vite build --outDir /tmp/build-vN --emptyOutDir \
  && npx vite preview --outDir /tmp/build-vN --port 531N --strictPort      # run in the background
# then, from P:
TASTE_BASE=http://localhost:531N node site/tools/taste.mjs check vN
```

Ports: 531N for your preview (N = your variation number). **Never** use or kill 5171–5175, 5180 (other client
projects) or 5300 (the user's main dev server); the wrapper refuses them. (`docs/BUILD-BRIEF.md` still says 517N for
dev servers: that is wrong, use 531N.)

**Known upstream gap.** taste-skill 2.1.4 announces a scroll-scene library (`library/scenes.json`,
`assets/scenes/<id>.js|css`, `assets/scenes/demo/`) for 2.2; it is not shipped upstream, so the draw deals no scenes.
Only the shared stage (`assets/scenes/stage.js`, `stage.css`) and the checker (`scenes.mjs`) exist. If your page needs
a scene, build it on the stage per `references/scenes.md` §8 (section 8 here).

---

## 1. The tools, one command each

All taste-skill scripts run through one wrapper, `site/tools/taste.mjs`. It resolves paths, injects the GPU browser
shim (`site/tools/chrome-gpu.sh`: `--enable-gpu --use-angle=metal --ignore-gpu-blocklist`), keeps per-variation
working folders, tees logs, and enforces declared deviations.

| Step | Command (from `P`) | Writes |
| --- | --- | --- |
| Self-test | `node site/tools/taste.mjs doctor` | stdout |
| Deal 3 directions | `node site/tools/taste.mjs draw vN --sector ecommerce --brief "…" --sections … --have product-photo --options 3` | stdout only |
| Deal the full sheet | same, without `--options`, plus `--direction <id>` | `.taste-skill/vN/direction.json` |
| Reprint the sheet | `node site/tools/taste.mjs draw vN --show` | stdout |
| Other blueprints for a role | `node site/tools/taste.mjs draw vN --alternatives pricing` | stdout |
| Redraw one slot (with a reason) | `node site/tools/taste.mjs draw vN --redraw palette` (`hero`, `type`, `photos`, `section:<role>`, `section:<role>=<id>`, `direction`) | updates the sheet |
| A studied site in full | `node site/tools/taste.mjs draw vN --site <id>` | stdout |
| Atmosphere photographs | `node site/tools/taste.mjs draw vN --photos list` / `--photos field-and-farm` / `--photos "chilli drying"` | stdout |
| Search the library | `node site/tools/taste.mjs query <lib> [words] [--where k=v] [--id X] [--full]` (section 3) | stdout |
| Find open pictures | `node site/tools/taste.mjs assets "curcuma longa engraving" --source museums` | stdout |
| Download + credit | `node site/tools/taste.mjs assets --get commons:12345 --to site/public/vN/img` | file + `credits.json` |
| Credit line | `node site/tools/taste.mjs assets --credits --to site/public/vN/img` | stdout |
| Find footage | `node site/tools/taste.mjs assets "spice market" --video` | stdout |
| Lint source | `node site/tools/taste.mjs lint vN` | `.taste-skill/vN/lint.txt` |
| **Inspect (the gate)** | `TASTE_BASE=http://localhost:531N node site/tools/taste.mjs inspect vN` | `.taste-skill/vN/inspect/` |
| **Lint + inspect** | `TASTE_BASE=http://localhost:531N node site/tools/taste.mjs check vN` | both of the above |
| Scroll scenes | `TASTE_BASE=http://localhost:531N node site/tools/taste.mjs scenes vN` | `.taste-skill/vN/scenes/` |
| Audit deployed pages | `node site/tools/taste.mjs audit v1 v2` | `docs/playbook/taste-audit/vN/` |

**The one command to run the inspector:** `TASTE_BASE=http://localhost:531N node site/tools/taste.mjs check vN`
(without `TASTE_BASE` it inspects the deployed `https://spices-client-03-landings.vercel.app/vN/`).

What the inspector does: opens the page in real headless Chrome 155 (hardware WebGL) at 1440×900, 768×1024 and
390×844; measures headlines, type, fonts actually loaded, colours, contrast, rules, shadows, gradients, pictures,
motion, the frame (margins, voids, blank stretches, titles); scrolls screen by screen so reveals fire; reloads with
`prefers-reduced-motion: reduce`; writes:

- `inspect.txt`: the full human report plus the wrapper's **VERDICT** line (after declared deviations)
- `report.json`: every measurement; `verdict.json`: pass/fail, declared and open findings
- `desktop-fold.jpg`, `desktop-page-NN.jpg` (4 screens per sheet), `tablet-*`, `mobile-*` and, with `--film` or
  scenes, `desktop-film-NN.jpg` (the scroll a third of a screen at a time)

Exit code 0 means no undeclared FAIL. Flags pass through: `--film`, `--widths 1440,390`, `--allow rule` (discouraged,
section 9), `--json`. Lint has no allow flag; see section 9 for `taste-skill-ignore`.

The inspector does not use Playwright; it drives `/Applications/Google Chrome.app` over the DevTools protocol with
Node's built-in WebSocket. (Note for other tools: `site/node_modules/playwright@1.47.2` expects chromium-1134, which is
not in `~/Library/Caches/ms-playwright`, so `tools/shot.mjs`, `audit.mjs` and `perf.mjs` cannot launch as written;
`chromium.launch({ channel: 'chrome' })` would use the installed Chrome.)

---

## 2. The run, step by step

Do these in order. Steps 1–5 take minutes and decide whether the page is any good. Write your notes in
`.taste-skill/vN/notes.md`; the hand-back asks for them.

### Step 1. Read the brief and inventory the subject

Read `docs/BUILD-BRIEF.md` (the store must be shoppable) and your direction notes in `docs/research/SYNTHESIS.md`.
Then find out **what is real**: brand facts the client confirmed, the SKU list (`site/shared/brand.js`), what imagery
truly exists (the user generates images with ChatGPT; nothing else exists yet) and whether a 3D model exists.

Write an **inventory of 8–12 things that belong to this brand and no competitor**. For a spice brand, look for:

- the name and what it means (Kesari is saffron, and the saffron-orange of a Kashmiri sweet; *kesar*);
- origins with real names: Lakadong (Meghalaya) for turmeric, Idukki for cardamom, Byadgi and Kashmir for chillies,
  Tellicherry for pepper, Pampore for saffron; the soil, the drying yards, the hills;
- the numbers: grind-to-ship days, batch size, harvest month, curcumin %, ASTA colour value, SHU heat, grams;
- the constraint: ground the week it ships, one harvest a year, small batches, sold out until the next crop;
- the rituals: the tadka, the morning grind, the sun-drying, the sorting by hand, the masala dabba with its seven tins;
- the printed things of its world: a kirana receipt, a mandi auction slip, a jute sack stencil, a batch label,
  a spice-board price chalkboard, a dabba lid, a harvest calendar.

Facts the client has not confirmed are **sample details** (allowed, listed in your report). Proof is never invented
(section 5).

### Step 2. Write the argument

One line per section: the claim and its proof (`references/copy.md` §1). The claims decide which sections exist and
in what order. Every store section the brief mandates must carry a claim; if it cannot, it is reduced, not padded.

```
1. Kesari grinds your order the week it ships.      → the batch date, live, on the first screen
2. Each spice is named by its farm and harvest.     → the catalogue: origin line on every card
3. You choose the heat.                             → the heat chooser (the live thing)
…
```

Map the store's sections onto the draw's roles (there is no "shop" role):

| Store section | `--sections` role |
| --- | --- |
| Catalogue / bestsellers grid | `list` (or `gallery`) — an archive, the one place a repeated module is right |
| Origin / farm story | `about` or `intro` |
| Grind-to-door process | `how-it-works` |
| Product spotlight / the hero spice | `showcase` |
| Bundles / combos / gifting | `pricing` |
| Reviews | `proof` (or `testimonial`) |
| Recipes | `work` or `gallery` |
| Questions (shipping, storage, COD) | `faq` |
| Newsletter / first-order offer | `cta` |
| Footer | `footer` |

### Step 3. Draw the direction

Deal three, choose the one that can carry an item of your inventory, then deal it in full:

```bash
node site/tools/taste.mjs draw vN --sector ecommerce \
  --brief "Kesari, small-batch Indian spices ground the week they ship, from named farms in Kerala, Meghalaya and Kashmir" \
  --sections showcase,list,how-it-works,about,pricing,proof,faq,cta,footer \
  --have product-photo --options 3

node site/tools/taste.mjs draw vN <same arguments, without --options> --direction <chosen id>
```

- `--sector`: `ecommerce` deals 6 directions (`pinned-poster`, `page-is-the-object`, `hero-object`,
  `specimen-catalogue`, `contact-sheet`, `split-stage`); `physical-product` deals 15. Pick the closest, once.
- `--have product-photo`: pass it, because the user makes product images with ChatGPT (an image tool counts). Do
  **not** pass `photography` or `video` unless the client supplies real shoots or footage; found pictures never count.
- `--tone`: only if the brief clearly asks (quiet, bold, warm, technical, playful, luxury, editorial).
- `--keep palette,type`: only when the brand fixes them. Kesari is a placeholder brand, so deal them. If you keep a
  SYNTHESIS palette or typeface, it becomes a declared deviation (section 9) wherever it breaks a house rule.
- **Adopt the sheet.** Do not blend it with the layout you would have made. Redraw a slot only for a stated reason
  (it contradicts a brand constraint, or needs an asset that does not exist); record every redraw.
- When a dealt section cannot hold the real content: `--alternatives <role>`, then `--redraw section:<role>=<id>`.
- Check the palette against the subject: if its colours fight spice (candy pastels, neon), redraw once; if the subject
  has unmistakable colours of its own (turmeric, Kashmiri chilli, cardamom green), keep the dealt **proportions** and
  take colours from the subject, then say so in the report.
- Write one line in your notes: why this direction, against your inventory. Reprint with `draw vN --show` before each
  section you build.
- Precedence when parts of the sheet disagree: **house rules → direction → type system and palette → hero blueprint →
  section blueprints.** Take geometry from blueprints, everything else from above them. Read every "Adjusted for this
  page" note under each blueprint.

### Step 4. Find the idea and the live thing

Write and fill both blanks from the inventory, not the category:

> On this page, **[something that belongs to Kesari]** becomes **[the device the direction calls for]**.

Places to look: its output (the ground powder, the colour it leaves on a white plate), its object (the pouch, the dabba,
the jute sack), its name (Kesari as a colour), its place (the drying yard), its ritual (the tadka's 30 seconds), its
artefact (the batch label, the mandi slip), its opposite (spice sold like single-origin coffee or wine).

**Competitor test.** Put the nearest competitor (Rochi Ram's, Evernuts, any masala brand) in the sentence. If it still
works, it is a category idea: "spices are colourful" is every brand; "every pouch carries the week it was ground, and
the page counts down to the next grind" is only this one.

**One live thing**, built from the idea with real content: e.g. the next grind date and the order cut-off, computed
live; a heat chooser that moves through real chillies by SHU; a "build your dabba" that fills seven tins and prices
the bundle; a turmeric picker comparing curcumin %. Rules: real content, works with a thumb on a phone, a plain
no-script fallback, never blocks reading or shopping, one thing (not a playground). It is built in step 6, not added
as motion.

### Step 5. Write the words

Write the whole page as a plain-text copy deck (`.taste-skill/vN/copy.md`) before markup, following section 5.
Do the two-line arithmetic for every headline. Write the **full** content: every SKU with name, origin line, sizes and
prices; every bundle with what it contains and the saving; real answers to real questions.

### Step 6. Build it, still

Build with motion off in your head. Order:

1. **Tokens.** Colour and type roles from the sheet as CSS custom properties (`--bg --surface --ink --muted --accent
   --accent-ink --field-n`, `--step-small … --step-display`, `--margin`, `--gutter`, `--section`, `--radius`, the
   easing and duration tokens). `assets/base.css` is an optional neutral start. No raw hex in components.
2. **The hero exactly as the blueprint describes it**, at 1440 and 390. The big thing big, the small things small.
3. **Each section from its blueprint**, with this content. Neighbours never share a layout. **Carry the idea into
   every section**, the catalogue, bundles, FAQ and footer included.
4. **Imagery** in this order: the brand's own (none yet) → **generated with ChatGPT** (section 6) → real pictures of
   the spice world from open collections (`assets`: botanical engravings of *Curcuma longa*, *Elettaria cardamomum*,
   *Piper nigrum*, *Crocus sativus*; old maps of the Malabar coast; spice-trade engravings; credited in the footer)
   → drawn in code from the subject (one flat graphic language, three levels of detail) → the dealt atmosphere
   photographs (never as a stand-in for the product) → type and colour alone.
   **Floor: at least 4 real raster pictures, usually 6–12; SVG and WebGL canvas do not count.** One moving picture
   where an honest clip exists.
5. **The live thing**, in the section where it proves the claim.
6. **Scroll scenes**, if any (section 8): composition, built now and seen in every look round.
7. **Fullness.** Each desktop screen is a poster: one dominant thing and its content. One deliberate rest per page;
   two near-empty screens fail. Running text in full ink at 16px+.
8. **The frame.** Equal outer margins at every width (16–32px); no section huddled on one side with the other half
   empty; no blank stretch taller than half a screen; sections 120–240px apart on desktop, 72–112px on a phone; one
   `h1` on the first screen that says what this is; a heading on every section.
9. **States and semantics.** Real buttons and links, visible focus, alt text, Esc closes drawers, scroll lock, a phone
   layout that is its own composition.

### Step 7. Gate

```bash
TASTE_BASE=http://localhost:531N node site/tools/taste.mjs check vN          # lint + inspect
TASTE_BASE=http://localhost:531N node site/tools/taste.mjs scenes vN         # only with scroll scenes
```

Fix every FAIL. Treat every WARN as wrong unless you can defend it to a designer in one sentence (write the sentence
in your notes). Never hide things from the meter (no detection tricks, no `data-ui` on things that are not interface
fragments, no `--allow` without a declaration). Re-run until the VERDICT line says 0 FAIL.

### Step 8. Look (the critique loop)

Passing the gate means nothing banned was measured, not that the page is good. Open **every** screenshot the inspector
listed (desktop fold and pages, tablet, mobile; film sheets if any) with the Read tool. Critique with
`references/critique.md`: the fourteen passes (one second then five; squint; cover the logo; edges; space and frame;
type; colour; images; sameness; phone; fullness; substance; collisions; the competitor and the live thing), score
like an Awwwards juror, apply the caps. Write it in exactly this shape, appended to `.taste-skill/vN/critique.md`:

```
ROUND n
Seen in one second: …
Idea (one sentence): …
Live thing: …
Layout words by section: hero=… / catalogue=… / …
Scores: design _ · usability _ · creativity _ · content _ → overall _._
Caps applied: …
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. …
2. …
3. …
```

`overall = 0.4·design + 0.3·usability + 0.2·creativity + 0.1·content`. Real Sites of the Day land at 7.5–8.0. If your
first score is 9, score it again as the juror who did not build it. Caps override the arithmetic (any FAIL → 6.0 max;
a three-line headline, eyebrow, mono, 01/02, decorative gradient, resting shadow or visible hairline → 6.5; fewer than
four real pictures → design 6.5; a page that barely moves → design 7; no live thing → creativity 7.5; competitor test
fails → creativity 7; no clear title → usability 6; anything over a headline → usability 6; blank band from a failed
reveal → usability 5; the full list is in critique.md §3).

Fix in this order (later items cannot rescue earlier ones): idea → hierarchy → composition → typography → imagery →
colour → detail → motion. Fix the top three, rebuild, re-inspect, look again. **Three rounds at most.** If round three
is still under 7.5, say so plainly.

### Step 9. Move

The motion layer (section 7), then inspect once more and check every screenshot for content that failed to appear.

### Step 10. Report

Only when every pass criterion in section 11 is true. Then hand back the evidence in section 11.

---

## 3. Querying the library by hand

`draw` deals; `query` is for understanding what is on the sheet, finding alternatives with a reason, and checking a
palette or typeface against the meter. Do not read the JSON files whole.

| Library | What one entry is | Useful queries |
| --- | --- | --- |
| `directions` (20) | an idea engine: idea, composition, typography, colour, imagery, motion, richness, pitfalls, seenIn | `query directions --where sectors=ecommerce` · `query directions --id specimen-catalogue --full` |
| `heroes` (58) | a measured first-screen blueprint + phone version + headline rule | `query heroes --where directions=hero-object` · `query heroes --where archetype=object-centre` |
| `sections` (185) | a section blueprint: role, shape, tags, blueprint, phone | `query sections --where role=pricing` · `query sections --where role=list type-led` |
| `palettes` (56) | bg, surface, ink, muted, accent, accentInk, fields, note | `query palettes --where tags=earth` · `query palettes warm` (the wrapper flags any colour the inspector would fail) |
| `type` (44) | display + text face, source, weights, settings, scale | `query type --where class=condensed-heavy` (flags lint default-font faces) |
| `motions` (18) | one signature move | `query motions` |
| `photos` (19 sets, picsum/Unsplash) | alt, tone, colours, calm area, url | `query photos --where set=field-and-farm` · `query photos chilli` |
| `sites` (202 studied) | idea, hero, type, colour, imagery, layout, sections, what to take, media, motion | `query sites --where kind=ecommerce` · `draw vN --site <id>` |
| `app` (styles, shells, patterns, kinds) | app-screen styles for dashboards | `query app commerce` (the store's account / order screens) |

Options: free words must all appear; `--where key=value` matches a field (arrays included); `--id`; `--full` prints the
whole entry as JSON; `--limit N`. Raw access when you need it:

```bash
node -e 'const s=require("./.claude/skills/taste-skill/library/sections.json"); console.log(s.filter(x=>x.role==="list").map(x=>x.id+" — "+x.shape).join("\n"))'
```

Signature moves in `motions`: masked-headline, shutter-image, scaling-wordmark, pinned-story, index-preview,
curtain-footer, slow-crossfade, edge-marquee, drag-row, colour-on-scroll, stillness, opening-window, ink-fill,
sheet-over, sideways-gallery, pushed-line, rolling-figures, carried-picture.

---

## 4. House rules and bans (complete)

The inspector measures these on every build. Three places keep their own conventions and are left alone: real code in
`<pre>/<code>`; real tables and form fields (they may have lines); a real interface fragment whose root carries
`data-ui` (cropped fragments only; never a heading or a whole section).

| Rule | Instead |
| --- | --- |
| **Headlines two lines or fewer at every width** (every h1–h6 and the main line of the first screen) | Cut words, then widen the measure, size last |
| **A clear title on the first screen** in the page's one `h1`; a heading on every section | Name with what it is; "Kesari" alone needs a line under it at 18px+ saying what it sells |
| **Equal outer margins**; no section huddled on one side with the other half empty | Close every void with the section's picture, a second column, a list or a figure |
| **No blank stretches** taller than about half a screen | The normal section gap; one deliberate rest per page |
| **Statements are paragraphs**: `<p>`/`<blockquote>`, ≤36px desktop, ≤32px tablet, ≤24px phone, ~25 words, 3 lines (4 on a phone) | Larger is a headline and gets two lines |
| **No eyebrows**: no small label above a heading, no pill badge above the headline, no "New ·" chip | Put it in the heading or first sentence, or drop it |
| **No monospace** outside real code | The text face; `tabular-nums` where numbers align |
| **No index numbering**: no 01/02/03, (001), "Step 2" | Order by position, size or words; a real `<ol>` |
| **No thin rules**: hairlines, 1px outlined boxes, grid lines, crosshairs, crop marks, dashed guides | Space, a tone step, a change of scale, a filled shape, a thick (4px+) bar if a bar is the idea |
| **No gradients**: backgrounds, buttons, text | Flat colour or a real photograph; a neutral scrim (black/ink, 30–55%) under text on a photo is the one exception |
| **No shadows on things at rest; no glows** | A tone step; shadows only on what floats (menu, dialog, drawer) |
| **No assistant palette**: no yellow-cream ground with terracotta/rust/clay; no violet or indigo | The dealt palette; warmth from stone/bone (saturation < 15%), deep green/brown/oxblood ink, photographs, or a full warm field |
| **No tiny uppercase letter-spaced labels** | Sentence case at a readable size |
| **No icon-topped feature cards, no rows of identical cards** | The dealt section blueprint |
| **No glass**: backdrop-blur panels, floating pill navigation | A plain bar: wordmark, 3–5 links, one action |
| **No emoji, gradient blobs, decorative shapes, fake dashboards of grey bars** | A real picture, a real fragment, or nothing |
| **No styled accent word** in a headline (italic, serif, coloured, underlined) | One face, one colour |
| **Two typefaces at most**, usually one | The dealt type system |
| **No text under 13px**; body text 16px+ in full ink (7:1); contrast 4.5:1 body, 3:1 display | The small step at 13–14px for captions and legal only |
| **At least 4 real pictures** (raster photos, archival images, footage); SVG/canvas do not count | Section 6 |
| **The page moves**: ≥8 elements animate on load and scroll (≥16 to clear the warning) | Section 7 |
| **Title readable 1.2s after load**; nothing hidden under reduced motion | No preloader; finished state outside `no-preference` |
| **Nothing lies on top of a headline or statement** at any scroll position | Stack type above canvases and pictures |
| **No sideways page scroll**, no broken images, no text within 16px of the screen edge (12px phone) | Constrain, fix, respect the margin |

Laws of the craft (short form; numbers from the study):

- **Type.** Two or three sizes do the visible work; five is the ceiling; headline ÷ body ≈ 4.3 (top sites 4.7); the
  largest type on strong sites is 8.4vw. Display tracking −0.02 to −0.05em, leading 0.85–1.05. Text 16–20px, leading
  1.45–1.6, 45–75 characters per line. Left-aligned by default; centre one moment at most. Load exactly the faces on
  the sheet; the inspector reports what actually rendered.
- **Space.** One grid, one pair of tight margins (16–32px), large things to the edges; two or three text anchor lines
  on the whole page. Section gaps 120–240px desktop; a gap between sections is clearly larger than any gap inside one.
  Each section a different composition; none a card grid (the catalogue is the archive exception).
- **Colour.** One ground (70–90%), one ink, one accent (<5% of any screen: the action and at most one other thing).
  Surfaces separated by a tone step (2–6 lightness points), never a line or shadow. Section fields change the whole
  ground, edge to edge, hard cut; each field has its own ink. Nothing fades into anything. Dark pages: tinted deep
  ground, soft light ink, `color-scheme: dark`, check `--muted` at 4.5:1.
- **Imagery.** One dominant image beats six small ones; hero media covers half the first screen on 68% of top sites.
  Two crop ratios for 75%+ of pictures; square corners (94%); one treatment for all.
- **Components.** Buttons flat, one fill, square-cornered or fully round, decided once (the 9–16px "soft" radius is
  the weak-site default); one primary per screen. Navigation: wordmark, 3–5 plain links, one action, no bar chrome.
  The footer is a designed close, not a sitemap.

Generated-page tells to avoid (`references/tells.md`): centred headline + subtitle + two buttons + screenshot; the
same fade-up on every block; hover lift on every card; bounce/elastic easing; pulsing dots; "broadsheet cosplay"
(hairlines + zero radius + dense columns); high-contrast serif as the shortcut to "premium"; bento tiles as features;
a distinctive hero followed by stock modules; invented social proof; text where a picture belongs; everything centred;
nine near-equal font sizes; one medium radius on everything. And the avoidance aesthetic: removing every tell and
putting nothing in its place. Fill the space with scale, full content, real pictures or a field of colour.

---

## 5. Copy rules

- **The argument first** (step 2). The order of the argument is the order of the page.
- **Two-line headline arithmetic:** characters per line ≈ line width ÷ (font size × k), k ≈ 0.40 condensed,
  0.50 most grotesks/serifs, 0.58 wide or all-caps. A hero headline of **~32 characters (4–6 words)** survives
  everywhere at a confident size; ~42 if the phone size drops to the mid-30s. Set `max-width` in `ch`,
  `text-wrap: balance`, author the break, check the phone screenshot. Never fix a long headline only by shrinking.
  Section headings: 2–5 words. No orphan word on line two.
- **Shapes that work:** the name; what it is ("Spices ground the week you order"); the claim; the instruction; the
  place or moment. **Avoid:** the mad-lib ("The AI-powered…"), the tricolon ("Fresh. Pure. Bold."), the correction
  ("not just a spice, it's…", "more than…"), "X reimagined", "Welcome to", "Meet", an unasked question, a headline that
  needs its colon, one word styled differently. Sentence case. No full stop unless the voice uses them everywhere.
- **Supporting line:** one sentence, ≤ ~22 words, 32–48px under the headline, says concretely what it is and for whom.
  **One primary action** named for what it does ("Shop the spices", "Build your dabba"), a real button on the first
  screen, one name everywhere. A second action is a text link. At most one arrow, on the primary.
- **Body:** short plain statements; the specific noun and the real number ("ground on Tuesday", "100g pouch", "2.9%
  curcumin") over adjectives. If another brand could print the sentence unchanged, sharpen or cut it.
- **Navigation:** wordmark, up to five single-noun links, one action.
- **First screen answers the first question in large type:** what this is and what to do (shop).
- **Full content:** every SKU, size and price; every bundle and its saving; real FAQ answers. Thin sections lose.
- **Proof is never invented:** no customers, quotes from named people, press logos, user counts, star averages,
  "10,000+ happy kitchens", benchmarks. The brief requires a reviews section for the pitch: build it with **plainly
  sample** content (no real people's names, no real companies), list it in the report as "replace with real reviews
  before launch", and never present totals as facts. Certifications (FSSAI licence, lab tests) are sample until the
  client confirms them.
- **Banned vocabulary** (lint warns): unlock, unleash, supercharge, seamless, elevate, empower, revolutionise,
  game-changer, cutting-edge, next-gen, world-class, best-in-class, all-in-one, effortless, blazing/lightning fast,
  reimagine, delve, tapestry, leverage, synergy, streamline, robust, holistic, turbocharge, "transform the way",
  "take your … to the next level", "say goodbye to", "in today's", "the future of", "built for the modern",
  "not just … it's", "more than a". Buttons: never "Learn more", "Get started", "Click here", "Read more",
  "Discover more", "Explore now", "Submit".
- **Furniture text banned:** locale/time strips, "Est. 2024", coordinates, version stamps, "Scroll" cues, fake photo
  credits, "Available" status dots, strings of words joined by middle dots or slashes, explainer captions that narrate
  the design, "Step 1 / Phase 02" labels, performative labels ("Field notes", "The details", "Our philosophy",
  "Quietly trusted by"). A section heading can simply be "Bundles".
- **Em dashes:** one or two per page; lint warns past four. Use a full stop.
- **Use the number the content has,** not three of everything.
- **Micro-typography:** curly quotes and apostrophes, real ellipsis, en dash for ranges (₹249–₹499), non-breaking
  space between number and unit (`100&nbsp;g`, `₹&nbsp;249`) and before an orphan-prone last word,
  `font-variant-numeric: tabular-nums` on prices and tables, `text-wrap: pretty` on paragraphs, no all-caps over three
  words (caps get +0.02–0.06em tracking), no centred paragraph over three lines, no justified text, no text under 13px.

---

## 6. Imagery rules, translated into ChatGPT image prompts

The user makes every generated image with ChatGPT's image model. taste-skill ranks **generated images second only to
the brand's own**, under strict rules. Your job is to hand the user a **shot list** (a markdown file,
`.taste-skill/vN/shot-list.md`) with one ready-to-paste prompt and one asset spec per picture slot, then place the
returned files.

### 6.1 The rules the prompts must encode

1. **Write each prompt as a photographer's brief:** subject, camera angle, lens feel, light (direction, quality,
   time of day), background, crop ratio, what is in focus, and "no text, no logos, no watermark, no borders".
2. **Generate the hero first**, then make every other picture match its light and grade ("same soft north-window
   light and warm-neutral grade as the hero").
3. **One family.** Same light, same grade, same kind of subject; never a scrapbook of styles. Choose **one
   treatment** for the whole page: untouched (default), all greyscale, or multiply-on-a-field (white seamless
   backgrounds that vanish on a colour field). Never: colour washes, duotone, grain, vignette, blur, tilted polaroids,
   glows, lens flares, bokeh dust, neon.
4. **Two ratios for 75%+ of pictures.** Defaults: **4:5** portrait and **16:9 or 3:2** landscape, plus 1:1 for detail
   crops. Square corners in the composition (no rounded frames, no device mock-ups, no drop shadows).
5. **Size:** deliver twice the CSS display width, capped at ~2400px (a full-bleed hero: 2400×1350 for 16:9; a split
   picture: 1440×1800 for 4:5; a card: 1200×1500). Ask ChatGPT for the largest size it offers in the right ratio, then
   export WebP/AVIF at those sizes.
6. **Plan the calm area.** Any picture that will carry type needs a calm region (sky, a plain wall, the shadow side)
   where the headline sits. Say where in the prompt ("empty, evenly lit area in the left third for a headline").
   Only display text, one line and one action ever go on a picture; body text never.
7. **Product truth.** A generated product shot stands in for the client's real product, so it must look like the
   real pack (shape, colours, size). Pack labels with legible text are unreliable from image models: either supply
   the exact label text and check it letter by letter, or generate the pack **without** legible text and apply the
   label as artwork in code/3D, or crop so labels are not read. Mark every product shot "placeholder until the client's
   shoot" in your report.
8. **No people presented as customers or team.** Hands at work are fine; faces that read as "our farmer" or "our
   customer" are invented proof. If a person appears, they are anonymous and incidental, and it is listed in the
   report.
9. **Honesty for found pictures** (`assets`): a botanical plate or an old map shows the world around Kesari, never
   Kesari's own product, farm or people. Caption from the source ("Curcuma longa, from Köhler's Medizinal-Pflanzen,
   1887"), never tying it to the brand. Credit line in the footer at body size.
10. **Where pictures go** (`imagery.md` §12): about a third of the page is picture, in whole screens (a picture
    either leads its screen, ≥60%, or stays an accent <10%); 3–5 placements per page and no two neighbours the same;
    6–12 pictures. Strongest placements for products: **cut-out object on a flat field** (the highest-scoring placement
    in the study), the split (picture 42–50% wide, full section height, touching the viewport edge), picture held
    while text scrolls, the inset frame that grows (once per page), the uneven mosaic. Do not build a 3D gallery
    (pictures on a WebGL ring/helix/tunnel): it scores lowest on usability.

### 6.2 Prompt templates (fill the brackets; keep the closing line on every prompt)

Closing line for every prompt: *"Photographic, natural colour, no text, no logos, no watermark, no border, no
vignette, no added glow, square-cornered frame."*

- **Hero, cut-out on a flat field (4:5 or 16:9).** "Studio product photograph of [a 100g kraft stand-up pouch of
  ground Lakadong turmeric, matte paper, unlabeled front], standing on a seamless [flat saffron-orange #D9822B] paper
  background that fills the frame edge to edge, soft large window light from the left, gentle natural contact shadow
  only where it touches the floor, a small spill of bright turmeric powder in front, camera at pack height, 85mm,
  everything sharp, [empty right half for a headline]. [closing line]"
- **Ingredient macro as a colour field (16:9).** "Overhead macro photograph filling the whole frame with [whole dried
  Byadgi chillies, deep red, wrinkled skins], even soft daylight, no props, no background visible, sharp edge to
  edge, natural colour. [closing line]"
- **Origin place (16:9, full-bleed band).** "Wide documentary photograph of [cardamom plants under shade trees on a
  misty hillside in Idukki, Kerala, early morning], muted natural colour, overcast soft light, no people, [calm grey
  sky in the top third]. [closing line]"
- **Process with hands (4:5).** "Close documentary photograph of two hands [sorting dried red chillies on a jute
  sack], no face visible, warm late-afternoon side light, shallow depth of field on the hands, natural skin and
  textile texture. [closing line]"
- **Ritual in use (3:2).** "Photograph of [a tadka: mustard seeds and curry leaves crackling in hot ghee in a small
  iron pan], seen from 45 degrees, dark stone counter, single soft light from the back left, steam visible, no
  hands. [closing line]"
- **Multiply-ready ingredient (1:1).** "Top-down photograph of [one heap of ground Kashmiri chilli] on pure white
  seamless paper, even shadowless light, isolated, centred with generous white margin. [closing line]"

Match prompts: add "same light, grade and background colour as the attached hero image" and attach the hero.

### 6.3 Asset spec (one row per slot, in the shot list)

| Slot | Placement | Ratio | Deliver (px) | Calm area | Treatment | Alt text (what it shows) |
| --- | --- | --- | --- | --- | --- | --- |
| hero | cut-out on flat field, 55% of first screen | 4:5 | 1440×1800 | right half | untouched | "Kraft pouch of ground turmeric beside a spill of bright yellow powder" |
| … | | | | | | |

Placing them: `width`/`height` (or `aspect-ratio`) on every `<img>`; `fetchpriority="high"` on the hero, `loading="lazy"`
on the rest; a ground-colour `background-color` on each container; `object-fit: cover` with a chosen
`object-position`; a separate portrait crop for the phone where the subject would be lost. Files go in
`site/public/vN/img/` (served as `/vN/img/…`) or are imported from `site/vN/src/assets/`.

**Video:** ChatGPT makes stills. For the one moving picture use an honest found clip (`assets "spice market" --video`,
`"chilli drying" --video`; ≤20s, ≤5MB for a section, ≤10MB hero, poster required, muted loop, paused out of view and
under reduced motion), or a slow scale/drift on a large photograph, or a scroll-linked move on the hero picture.

---

## 7. Motion budget

A page that does not move reads as a mock-up; the inspector fails it under **8 moving elements** and warns under **16**
(counted from CSS animations, transitions, Web Animations and script-driven transform/opacity changes during load and
one scroll through the page; a playing video counts as 4). **WebGL animation inside a canvas does not count**: the DOM
around the 3D must move too.

The layer has these parts:

1. **One signature move** named on the sheet (`motions` library), done well; it is the only loud one.
2. **An entrance for the parts of every section:** heading, then text, then picture, staggered 60–90ms, rising
   16–32px with opacity (or a line mask), once, when the section's top reaches 85–90% of the viewport. Vary the manner
   with the content (a list row by row, a picture from a mask, a figure counting up once). Never one fade for a whole
   block; never the same fade-up on every block.
3. **Feedback on every control:** press (scale 0.97, 140ms), hover (colour 180ms; moving hovers 300–400ms) behind
   `(hover: hover) and (pointer: fine)`, visible focus. Add-to-cart and the qty stepper answer the hand.
4. **One moving picture:** a found clip as a muted loop with a poster, a slow drift/scale on a photograph, or a
   scroll-linked move on the hero picture.
5. **Scroll scenes** (two or three at most, a quiet section between them; section 8).

Tokens (from `motion.md` §4; put them in `:root`):

```css
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);     /* entrances, UI under 600ms */
--ease-expo: cubic-bezier(0.16, 1, 0.3, 1);     /* reveals ≥800ms, line rises, openings */
--ease-in-out: cubic-bezier(0.76, 0, 0.24, 1);  /* wipes, drawers, things that travel */
--ease-soft: cubic-bezier(0.33, 1, 0.68, 1);    /* slow scale/drift on photographs */
--ease-exit: cubic-bezier(0.55, 0.055, 0.675, 0.19); /* leaving for good, short */
--t-press: 140ms; --t-hover: 180ms; --t-ui: 240ms; --t-reveal: 800ms; --t-open: 1200ms;
--stagger-line: 90ms; --stagger-item: 70ms;
```

Rules (`motion.md` §10, all of them):

1. **First frame:** headline, sentence, picture and the shop button are in the HTML and painted on the first frame;
   the load sequence starts without waiting for `load`, is settled by **1.2s**, and moves four things at most.
2. **No preloader, no counter, no gate, no custom cursor, no wheel capture / scroll hijack.** Smoothing only through
   Lenis at lerp 0.1–0.14, off for touch and reduced motion (one Lenis on `gsap.ticker`).
3. **Curves:** `--ease-out` under 600ms; `--ease-expo` for reveals ≥800ms; `--ease-in-out` for wipes; `--ease-exit`
   only for exits; `linear` for scroll-linked and loops; plain `ease` for colour. **No overshoot, bounce or elastic
   on interface elements** (GSAP `back.out`, `elastic` included).
4. **Durations:** press 140ms; hover colour 180–200ms; moving hover 300–400ms; menus 240ms; reveals 700–900ms;
   picture openings 1,100–1,300ms; exits 60–70% of the entrance.
5. **Staggers:** lines 80–110ms; list items 50–90ms; characters 20–40ms only in a heading of one to three words;
   four steps at most per sequence.
6. **Reveals** fire once at 85–90% down the viewport, rise 12–32px or from a line mask; nothing in view hidden for more
   than 900ms; nothing above the fold waits for scroll.
7. **Scroll scenes are where the page is bold;** inside a scene its own numbers apply.
8. **Outside scenes, scroll-linked travel stays quiet:** linear, locked to the scrollbar, parallax under 8% of the
   element, scale 0.94–1.15; sticky stages about one screen per step, three screens at most, a line of text on every
   held screen.
9. **One of each:** one signature move, one moving picture, one marquee at most (60–120s per loop, pausable).
10. **Text stays readable:** fills start at 45% ink, dims no lower than 40%, blur ≤8px and gone once settled, nothing
    moves across text being read.
11. **Colour by chapter** as hard cuts at section edges; a fixed header's ink follows in 300ms.
12. **Horizontal motion:** a native drag row first; a pinned sideways gallery only for rows under three screens, with
    keyboard support.
13. **Page to page:** view transitions ≤480ms, off under reduced motion.
14. **Reduced motion:** every hidden start state lives inside `@media (prefers-reduced-motion: no-preference)` under
    an `html.js` class; the reduced page is the finished page; loops stop. Transform, opacity and clip-path only;
    never width/height/top/left/margin/padding.

Recipes to copy (in `motion.md` §6): load sequence in 1.2s, masked line reveal, reveal on scroll (once), image
shutter, press and hover, scroll-linked progress without JS, pinned story, index with preview anchored to the row,
lines that rise on scroll, opening window, held picture with passing captions, sideways gallery, receding hero, page to
page, ink fill, rolling figures, accordion, menu or dialog.

---

## 8. Three.js / R3F under taste-skill

The 3D is the hook; taste-skill decides how it sits on the page. What the meter does with WebGL, measured on the pitch
pages (`docs/playbook/taste-audit/SUMMARY.md`):

- **A canvas counts as hero media** for the focal-point check (it can be the one dominant thing), but **never toward
  the 4-picture floor**. A page whose only imagery is the 3D fails `few-pictures`. Carry real raster pictures as well.
- **A canvas stacked over the headline is a FAIL** (`covered-text`, and `late-title` because the title reads as
  covered). Put the canvas **under** the type in the stacking order (`z-index`), let the 3D frame the words, never
  cross them. Nothing passes over a headline or statement at any scroll position, including flying particles.
- **A fixed, full-screen canvas** hides blank stretches from the DOM (`blank-gap` drops to WARN); check those screens
  in the screenshots yourself.
- **WebGL motion does not count toward the motion floor.** Build the DOM motion layer (section 7) as well.
- **Glow, bloom, emissive light inside the canvas is invisible to the meter** but still governed by the rules:
  declare it (section 9), keep it to the object (embers, a lit saffron thread), never a neon wash.
- **No preloader for the 3D.** The HTML first screen (h1, sentence, shop button, a poster picture of the scene) paints
  at once; the 3D chunk lazy-loads and fades in behind it when ready (`late-title` checks 1.2s after load).
- **No wheel capture, no custom cursor, no 3D gallery** (pictures on a ring/helix/tunnel). Interaction (poke a
  pouch, spin a jar) is the live thing only if it uses real content and has a phone and no-script version.
- **Reduced motion:** a still render of the scene (or a poster) and no autoplay.
- **Scroll scenes** (a scrubbed 3D camera, a pinned product turning): build on the taste-skill stage contract. The
  inspector treats any `section.scene` / `.scene[data-scene]` as a scene and **fails it unless it carries `is-live`**
  (running) or `is-rest` (finished composition); `scenes.mjs` photographs it at 0–100% of its hold. Either load
  `assets/scenes/stage.js` (it needs `window.gsap` and `window.ScrollTrigger`; in Vite set them on `window` from the
  npm imports before `Stage.init()`), or implement the same contract in React: section `(hold + 1) × 100svh` tall,
  a sticky 100svh stage with `overflow: clip`, a GSAP timeline scrubbed 0→1, `is-live` added when running, the finished
  composition under reduced motion / no script / phone rest. Two or three scenes per page, one to four screens each,
  a quiet section between them, a heading (or `aria-label` plus a real heading in the finished composition). Do not
  put `class="scene"` on anything that is not one.

---

## 9. Where the spice brand deliberately deviates, and how to declare it

The brand's position: the **3D hero is the point of the pitch**, and the brand may use **glow** (lit spice, embers,
warm light) and **brand-owned colour** that the house rules would otherwise question. Everything else in section 4
holds without exception. A deviation is a decision with a reason, scoped to named elements, never a blanket switch.

### 9.1 What may be declared, and what may not

| Deviation | Inspector / lint rule | Allowed scope |
| --- | --- | --- |
| WebGL hero or product scene | none (a canvas is not a violation) | Every variation, under section 8's constraints |
| Glow / bloom / emissive light **inside the canvas** | none (invisible to the meter) | Declare as record-only (`rule: "canvas-glow"`); restraint: one lit thing, no neon wash |
| One CSS glow behind the 3D object (a radial light pool behind the pouch/jar) | `gradient` (FAIL), lint `gradient` | `max: 1`, matched to that one selector, per variation |
| Brand-owned colours the meter flags (e.g. a Kashmiri-chilli brick red read as terracotta, a jamun purple read as violet) | `palette-terracotta`, `palette-purple`, `palette-claude`, `palette-cream` | Only with `--keep palette`, the colour named in the declaration, per variation |
| A Devanagari face for vernacular names | `font-count` (WARN at 3) | Matched to the Devanagari family name |
| A long sticky cart button / header that stays on screen | `long-pin` (WARN) | Matched to the cart control's text |

**Never declarable** (fix them): headline over two lines, eyebrows and pill badges above headings, monospace labels,
01/02/03 numbering, hairlines and outlined boxes, gradient text, text-shadows, resting shadows on cards and buttons
(including "sticker" offset shadows), glass, emoji, tiny tracked caps, text under 13px, low contrast, fewer than four
real pictures, a still page, anything over a headline, a late title, content hidden under reduced motion, sideways
overflow, overshoot/bounce easing on UI, preloaders, custom cursors, scroll hijack. Where `docs/research/SYNTHESIS.md`
asks for these (sticker shadows, mono labels, back.out springs, conic sunbursts as decoration, Cinzel small-caps
labels), taste-skill overrides SYNTHESIS.

### 9.2 How to declare one

1. Ask the user (or lead) for approval of the specific deviation; record who approved it.
2. Add an entry to `docs/playbook/taste-deviations.json`:

```json
{
 "id": "v3-hero-light-pool",
 "rule": "gradient",
 "scope": ["v3"],
 "match": "div\\.hero-light",
 "max": 1,
 "reason": "One warm light pool behind the 3D saffron jar so the object reads on the dark ground; flat everywhere else.",
 "approved": "Shaurya, 2026-10-24"
}
```

   - `rule`: an inspector or lint rule id (section 12), or a record-only id such as `canvas-glow`.
   - `match`: a case-insensitive regex that **every** instance the inspector lists must match (usually the selector it
     prints, e.g. `div.hero-light → radial-gradient(...)`).
   - `max`: the most instances allowed. The wrapper also refuses a declaration when the meter reports more instances
     than it listed (it lists 3–4), so a deviation can never hide an unseen fifth.
3. In source, mark each flagged line `/* taste-skill-ignore: v3-hero-light-pool */` (or `{/* … */}` in JSX). `lint`
   skips that line, and the wrapper fails any `taste-skill-ignore` that does not name a declared id.
4. Re-run `check vN`. The inspector still prints the raw finding; the wrapper's **DECLARED DEVIATIONS** block shows it
   accepted, and **VERDICT** counts only undeclared FAILs. Anything outside the declaration appears under
   **DECLARED BUT NOT COVERED** and still fails.
5. List every deviation in your report, with its reason.

The inspector's own `--allow <rule>` switches a rule off for the whole page; use it only for a rule that cannot apply
(e.g. `--allow few-pictures` is never acceptable; `--allow scene-not-started` only while a scene is mid-build), and
record it. A dealt sheet's own `allow` list (some directions carry one) is applied automatically.

---

## 10. The store UI under taste-skill

The store is part of the page: the house rules hold around it, and its working controls follow
`references/app-screens.md` for their insides. Concretely:

- **Catalogue grid:** an even grid is right here (an archive; `imagery.md` §12 "Even grid": 2–4 across, equal cells,
  8–16px gaps, one ratio, 4:5 is the commonest, the label **under** the picture, never on a dark gradient over it).
  Phone: two across. It must not be the layout of any neighbouring section. Cards are a tone step (`--surface`), not a
  border and not a shadow; no hover lift on every card (one consistent small response).
- **Card anatomy without tells:** picture; name (h3); origin line in the text face; rating as a plain line
  ("4.7 · 212 reviews", sample until real); price `₹ 249` with MRP `<s>₹ 299</s>` and the saving in words ("16% off")
  in `tabular-nums`; badges ("Bestseller", "Low stock") as a short word in the info line or one small filled tag
  **beside** a value, never a pill above the name and never laid over the picture; size chips as **filled** tone-step
  controls (selected = ink fill), 44px tall on a phone, no 1px outlines; Add to cart as the card's one button,
  becoming a − qty + stepper.
- **Announcement bar:** sentence case at 13px or more, one message at a time or one slow marquee (the page's only one,
  pausable). No tracked capitals, no ✦ ornaments.
- **Header:** wordmark, 3–5 plain links, search, account, wishlist, cart with count, one row; no pill bar, no blur
  panel; it never sits on top of content (check every screenshot). Phone: wordmark + cart + "Menu" text button.
- **Cart drawer, quick view, search overlay, checkout:** they float, so a shadow is allowed on them. The meter treats
  a shadow as floating when the element or one of its four nearest ancestors is `position: fixed`/`sticky`, or sits in
  `dialog`, `[role="dialog"]`, `[role="menu"]`, `[role="tooltip"]` or `[popover]`; give drawers and modals
  `role="dialog"` (they need it for accessibility anyway). A shadow on a product card is still a resting shadow. Inside: labels above fields (14px), filled inputs with a clear focus ring, one filled
  primary ("Checkout"), totals right-aligned in tabular figures, the free-shipping bar at its true ratio with both ends
  labelled ("₹ 320 of ₹ 499"), empty state with one sentence and the next action, errors inside the block that failed.
  Esc closes, focus is trapped and returned, scroll is locked. Never fake a payment form: the checkout button goes
  to `#checkout` or a mocked step, and the report says it must be wired before launch.
- **Trust strip:** never a row of icon-topped cards or icons in tinted squares. One line of plain facts in the text
  face, or each fact folded into the section that proves it (COD and returns in the cart, lab testing in the origin
  story).
- **Reviews:** a distribution at its true ratios, sample text plainly marked for replacement, no avatars of invented
  people, no star rows as decoration.
- **Footer:** a designed close (the name at full width, or the brand's artefact), with help links, contact,
  newsletter, legal and payment marks in the text face at a readable size, on the page's anchor lines; the picture
  credit line at body size.

---

## 11. Pass criteria and the evidence you hand back

### 11.1 Pass criteria (all must be true on the final build)

1. `check vN` prints **`VERDICT vN: 0 FAIL`** on the production preview at 1440, 768 and 390, on the final version.
2. Every remaining **WARN** has a one-sentence defence in your notes, or is fixed.
3. Lint has **0 FAIL** after declared deviations, and every `taste-skill-ignore` names a declared id.
4. You opened **every** screenshot listed after the last change (desktop, tablet, mobile; film and scene sheets if
   any), not only the fold.
5. With scroll scenes: `scenes vN` ran on the final page with exit 0, and you read every sheet (desktop, phone,
   reduced motion).
6. The last critique round is written in the critique.md §4 shape, scores **overall ≥ 7.5** after caps (or the report
   says plainly that it is under and why).
7. A stranger reading the first screen for five seconds can say what this is and what to do; the shop action is a
   real button on the first screen; products or the catalogue are reachable within ~1.5 scrolls.
8. Every section has a heading; margins match on both sides; no stretch of the page is empty.
9. At least four real raster pictures are on the page, from the shot list; every found picture is credited.
10. The idea sentence passes the competitor test, and the live thing works on a phone and without script.

### 11.2 Evidence to hand back (paths, not prose)

```
.taste-skill/vN/notes.md          inventory (8–12 items), the argument, why this direction, the idea sentence + competitor
                                  test, the live thing, every WARN defence, which reference files you read in full
.taste-skill/vN/direction.json    the dealt sheet (direction id + seed); every redraw with its reason in notes.md
.taste-skill/vN/copy.md           the copy deck written before markup
.taste-skill/vN/shot-list.md      ChatGPT prompts + asset specs, one per picture slot (section 6)
.taste-skill/vN/lint.txt          final lint output
.taste-skill/vN/inspect/          final inspect.txt (with VERDICT), report.json, verdict.json, every screenshot
.taste-skill/vN/scenes/           (if scenes) every contact sheet
.taste-skill/vN/critique.md       every round, in the §4 shape, with the final scores
docs/playbook/taste-deviations.json   any deviation you added, approved
```

And in the final reply, briefly: the direction (name, id, seed) and any redraws with reasons; the idea sentence and the
live thing; the final critique scores and what still falls short; every found picture and clip (title, creator,
licence, source, where the credit sits); every generated image and which are placeholders for the client's shoot;
every sample detail to confirm (SKUs, prices, reviews, certifications); every declared deviation. **Do not claim a
check you did not run.**

---

## 12. Appendix: every inspector rule id

Page rules (FAIL unless marked WARN; "F/W" means FAIL above a threshold, WARN below):

| Id | Catches |
| --- | --- |
| `headline-lines` | a headline over two lines at any width (statements: over 36/32/24px) |
| `statement-length` (W) | a large statement over 3 lines (4 on a phone) |
| `hero-words` (W) | hero headline over 10 words |
| `mixed-font-headline` (W) | a headline switching face or italic mid-line |
| `eyebrow` | a small label or pill above a heading |
| `mono` | monospace outside code |
| `numbering` | 01/02/03-style index numbers |
| `micro-label` (F/W) | tiny uppercase tracked labels (3+ fail) |
| `emoji` | emoji in the page |
| `gradient` / `gradient-text` | gradient fills (neutral scrims excepted) / gradient text |
| `shadow` / `text-shadow` / `button-fx` | resting box-shadows / text-shadows / buttons with gradient or glow |
| `hairline` (F/W) | thin rules and dividers (2+ fail) |
| `outlined-box` (F/W) | 1px outlined boxes (3+ fail) |
| `dashed` (W) | dashed or dotted borders |
| `glass` (W) | 2+ backdrop-blur surfaces |
| `icon-cards` / `card-rows` (W) | rows of icon-topped cards / 2+ rows of identical boxed cards |
| `pill-nav` (W) | floating rounded pill navigation |
| `palette-claude` / `palette-terracotta` / `palette-purple` / `palette-cream` (W) | cream + terracotta / terracotta / violet-indigo / yellow cream |
| `default-link` (W) | browser-default link colours |
| `contrast` (F/W) | text under 2.6:1 fails; under 4.5 / 3:1 warns |
| `font-count` (F/W) | 4+ typefaces fail, 3 warn |
| `font-fallback` (W) | a declared face that did not load |
| `font-not-dealt` (W) | the page does not render the dealt faces |
| `size-count` (W) | more than 9 font sizes |
| `body-size` (F/W) | body under 15px fails, under 16px warns |
| `grey-body` (W) | running text under 7:1 |
| `measure` (W) | paragraphs over ~88 characters per line |
| `small-text` (F/W) | text under 13px (4+ fail) |
| `all-centred` (W) | over 72% of text centred |
| `first-action` (W) | no visible button on the first screen |
| `few-pictures` | under 4 real pictures (SVG and canvas do not count) |
| `no-real-pictures` / `no-footage` / `no-poster` (W) | under 2 photographs / no video / a clip without a poster |
| `side-scroll` (W) | rows that scroll sideways past their edge |
| `blend-text` (W) | text in difference/exclusion blend |
| `ui-wrapper` | `data-ui` wrapping a heading or more than 1.5 screens |
| `overflow` | sideways page scroll |
| `broken-image` | an image that failed to load |
| `no-hero` (W) / `focal-point` | no headline in the first screen / no dominant element (type < 4.5vw and no picture ≥ a third) |
| `late-title` | the h1 not readable 1.2s after load |
| `reduced-hidden` | text invisible under reduced motion |
| `covered-text` / `clipped-text` | large text under another element / cut along its top |
| `pinned-over-picture` (W) / `long-pin` (W) | pinned text sliding over pictures / the same large text for 3+ screens |
| `empty-screens` | 2+ desktop screens under 20% filled |
| `still-page` (F/W) | under 8 moving elements fails, under 16 warns |
| `off-centre` (F/W) | unequal outer margins |
| `lopsided` (F/W) | sections with content on one side and the other half empty |
| `empty-middle` (W) | content at both edges and nothing between |
| `blank-gap` (F/W) | stretches of nothing over ~half a screen |
| `no-title` / `small-title` (W) / `many-h1` (W) / `name-only-title` (W) | no h1 on the first screen / h1 under 32px / several h1 / a bare name with nothing saying what it is |
| `untitled-section` (F/W) | sections of text with no heading |
| `hero-void` (W) | one empty block over 28% of the first screen |
| `one-sided-bleed` (W) | display type running off one edge by a sliver |
| `edge-text` (F/W) | text within 16px (12px phone) of the screen edge |
| `ragged-edges` (W) | text starting on too many left edges |
| `scene-not-started` / `scene-not-live` | a `.scene` that never started / rests on desktop |
| `many-scenes` (W) / `scene-heavy` (W) | over 4 scenes / scenes holding over 60% of the page |

App-screen rules (`--app`, for account/order screens if built as an app): `heavy-shadow`, `glass`, `icon-tiles`,
`rainbow-chart`, `placeholder-data`, `sidebar-phone`, `tiny-text`, `app-title-size`, `kpi-size`, `numeric-align`,
`tabular`, `ragged-row`, `panel-void`, `below-fold`, `unused-canvas`, `colour-sprawl`, `no-data-hue`, `heavy-borders`.

Lint rules (source scan): FAIL `mono`, `gradient`, `gradient-text`, `shadow`, `numbering`, `eyebrow`, `micro-label`,
`purple`, `claude-palette`, `emoji`, `lorem`, `hairline`; WARN `numbering` (padStart), `outlined-box`, `glass`, `copy`,
`cta-copy`, `default-font` (Inter, Poppins, Montserrat, Roboto, Open Sans, Space Grotesk, Instrument Serif, Playfair
Display, Plus Jakarta Sans, Outfit, Sora, Lato, Nunito, Raleway), `transition-all`, `ease-in`, `scale-zero`, `h-screen`
(use `svh`/`dvh`), `bounce`, `em-dash` (over 4).
