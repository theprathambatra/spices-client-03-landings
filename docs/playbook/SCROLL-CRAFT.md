# scroll-craft playbook (Kesari spice store)

How to use the **scroll-craft** skill to plan and build scroll journeys for this
project, and how to feed it images made in **ChatGPT** instead of the paid kie.ai
API it ships with.

**Governing doc:** [`TASTE-SKILL.md`](TASTE-SKILL.md) is the master principle for
every build. scroll-craft contributes the *structure and scroll method* (journey,
grammar, feeling curve, devices, layered depth, asset pipeline, scroll
verification). Wherever the two give different numbers or rules, **TASTE-SKILL.md
wins**; section 1.1 lists every known overlap and the ruling. In particular its
§6 (imagery and ChatGPT prompts), §7 (motion budget), §8 (R3F and scroll scenes),
§9 (declared deviations) and §10 (store UI) are binding here.

**Read alongside:** [`UNLAZY.md`](UNLAZY.md) (acceptance gates),
[`SUPERPOWERS.md`](SUPERPOWERS.md) (build flow), [`../BUILD-BRIEF.md`](../BUILD-BRIEF.md)
(store requirements and the performance floor).

---

## 0. What is installed and where

| Thing | Path |
|---|---|
| Skill (project copy, identical to plugin 0.3.1) | `.claude/skills/scroll-craft/` |
| Plugin copy (`nateherk-design:scroll-craft`) | `~/.claude/plugins/cache/nateherk/nateherk-design/0.3.1/skills/scroll-craft/` |
| Source repo | `repos/scroll-craft/plugins/nateherk-design/skills/scroll-craft/` |
| scroll-craft workspace (resolved via `.git`, created) | `scrollcraft/` |
| Fingerprint registry (seeded, empty) | `scrollcraft/FINGERPRINTS.md` |
| Per-build planning files | `scrollcraft/builds/kesari-vN/` (`BRIEF.md`, `LAYERS.md`) |
| Raw generations and cutouts (originals) | `scrollcraft/builds/kesari-vN/out/` (git-ignored; back it up) |
| Harness output | `scrollcraft/lab/` (git-ignored) |
| Shot list (canonical prompt + asset spec record, per TASTE-SKILL §6) | `.taste-skill/vN/shot-list.md` |
| Delivery images for the site (per TASTE-SKILL §6.3) | `site/public/vN/img/` (served at `/vN/img/...`) |
| Image helper (this playbook) | `docs/playbook/tools/img-pipeline.sh` |

Preflight, run from `site/` so playwright-core resolves:

```bash
cd site && node ../.claude/skills/scroll-craft/scripts/doctor.mjs
```

Current result: node 24, full ffmpeg (486 filters, libwebp, libaom-av1, libsvtav1),
Chrome, playwright-core all **ok**; `KIE_AI_API_KEY` **warn (not set, intended)**.

Invoke with `/scroll-craft`, or ask for a "layered hero", "scrollytelling",
"premium hero", "make the brand a scroll experience", "this looks like a template".

---

## 1. How scroll-craft fits a React + R3F + GSAP + Lenis store

scroll-craft ships a vanilla engine (`engine/scrollcraft.js`) that reads
`data-sc-*` attributes. **We use the method, not the engine, on the live site**:

- The site runs one Lenis instance on `gsap.ticker` (BUILD-BRIEF perf pass;
  TASTE-SKILL §7: lerp 0.1 to 0.14, off for touch and reduced motion). The engine
  runs its own rAF loop, which the perf pass forbids. So every device is built
  with GSAP ScrollTrigger / R3F, using the device kit as vocabulary.
- Pinned, scrubbed stages are built on **taste-skill's scene contract**
  (TASTE-SKILL §8): `section.scene` that is `(hold + 1) × 100svh` tall, a sticky
  100svh stage with `overflow: clip`, a GSAP timeline scrubbed 0 to 1, `is-live`
  while running and `is-rest` for the finished composition (reduced motion, no
  script, phone rest). Two or three scenes per page, one to four screens each, a
  quiet section between them.
- The engine is still useful for a **throwaway static prototype** of a journey
  (`scrollcraft/builds/kesari-vN/index.html` + `scripts/serve.mjs`) to feel pacing
  before writing React. Copy `engine/*` in; never edit it.
- **Keep `data-sc-*` attributes in the React markup as verification hooks.** The
  harness (`scripts/shoot.mjs`) samples inside every `[data-sc-act]`, grades
  contrast and peak opacity on `[data-sc-cue]` (computed opacity, so GSAP fades
  count), sees rail travel on `[data-sc-pan]` (computed transform), wipes on
  `[data-sc-reveal]` (computed clip-path), and reads `[data-sc-verify-state]` for
  bespoke stages such as an R3F hero. They coexist with `section.scene`.
- **The store outranks the film.** BUILD-BRIEF wants products or a clear Shop
  CTA in the first viewport and the bestseller grid within about 1.5 scrolls;
  TASTE-SKILL §7 wants headline, sentence, picture and shop button painted on the
  first frame and nothing above the fold waiting for scroll. So the hero is short,
  the grid follows, and the longer scenes (origin, process, macro, ritual) live
  below the shop. scroll-craft's 8 to 14 viewport-height figure is a pacing
  reference, never a quota.

### 1.1 Where TASTE-SKILL.md overrides scroll-craft

| Topic | scroll-craft says | Ruling for this project (TASTE-SKILL.md) |
|---|---|---|
| Type between hero planes | headline may pass behind the subject | **Nothing ever covers a headline or statement**, at any scroll position (`covered-text` FAIL). Planes and canvas sit under the type; depth comes from planes moving around and behind the words |
| Eyebrows | at most one per three sections | none (never declarable) |
| Parallax | rates 0.3 to 1.5 (×100 px) | outside a scroll scene: parallax under 8% of the element, scale 0.94 to 1.15, linear. Inside a declared scene, the scene's own numbers apply, so the layered hero is built as a scene |
| Sticky / pinned stages | spans 1.2 to 3.4 | about one screen per step, three screens at most, a line of text on every held screen; two or three scenes per page |
| Reveal rise and stagger | ~14px over ~620ms, stagger 30 to 80ms | rise 12 to 32px, reveals 700 to 900ms with `--ease-expo`, lines 80 to 110ms, items 50 to 90ms, at most four steps; fire once at 85 to 90% of the viewport |
| Kinetic type | lines, words, characters rarely | lines; characters only in a heading of one to three words |
| Sideways rail (`pan`) | pinned lateral travel | a native drag row first; a pinned sideways gallery only for rows under three screens, with keyboard support |
| Grain, dust, glow | grain overlay, edge glow, atmosphere planes | **no grain, vignette, blur, bokeh dust, glows, lens flares, neon** as treatments; glow only inside the canvas or one declared light pool (TASTE-SKILL §9) |
| Image delivery size | up to 2560px | twice the CSS width, capped at about **2400px** (hero 2400x1350; 4:5 split 1440x1800; card 1200x1500) |
| Image ratios | 16:9, 9:16, 3:4 | **4:5 and 16:9 (or 3:2) for 75%+ of pictures**, plus 1:1 for detail crops |
| Pictures per page | 4 to 6 stills | at least four real raster pictures; the canvas never counts toward that floor |
| People | documentary humans allowed | hands at work are fine; no faces that read as "our farmer" or "our customer" |
| Prompt record | `PROMPTS.md` | `.taste-skill/vN/shot-list.md` (one prompt and one asset spec per slot) |
| Delivery folder | build `assets/` | `site/public/vN/img/` |
| Video | kie.ai clips | ChatGPT makes stills; use an honest found clip (`taste.mjs` assets `--video`), a slow drift on a photograph, or a scroll-linked move on the hero picture |
| Preview ports | 4500 | `531N` for variation N (e.g. 5313 for v3); never 5171 to 5175, 5180 or 5300 |

Everything else in scroll-craft (journey, grammars, signature move, fingerprint
gate, feeling curve and peak, layer contracts, clean plates and genuine alpha,
mobile art direction, verification by scrolling) stands.

---

## 2. The planning method, in order

Every scroll page goes through these steps before any code or asset exists.
TASTE-SKILL's run (dealing a direction, the sheet, the copy deck) happens first or
alongside; scroll-craft's artifacts live in `scrollcraft/builds/kesari-vN/`.

### Step 0: Brief and creative authority -> `BRIEF.md`

Ask the client (or record explicit delegation) all eight in one pass, verbatim
answers, no paraphrasing into marketing prose:

1. Vibe in three to five words, plus up to three references from any medium (a
   film, an album, a shop, a magazine; not websites).
2. The scroll journey section by section, in their words.
3. The energy curve: where calm, where intense.
4. How someone should feel stage by stage, and the ONE moment they should remember.
5. One thing this site should do that no site they have seen does (seed of the signature move).
6. How far from premium-minimal: brutalist, maximalist, playful, retro, dense, editorial, premium-minimal.
7. One unbroken world, or distinct scenes? (their call)
8. What assets exist: packshots, footage, brand kit, farm photos. "Nothing" is valid.

If the client delegates ("use your judgment"), head the file
`Self-authored under explicit creative delegation`. If nobody is reachable, head
it `Self-authored, not interviewed` and say so in the report.

`BRIEF.md` must also contain:

- **Feeling curve**: one line per act, emotion first, cause second.
- **The peak**: the sentence a visitor would say to a friend, and which act.
- **Tell-someone sentence**: "It's the site where ___" (an experience, not a device name).
- **Authored silence**, if any, so verification can tell it from dead scroll.

### Step 1: Journey first

Ask only what cannot be defaulted: what this is and who it is for; the one belief
the page installs; the one next action (one label used everywhere; for a store,
something like "Shop the spices", identical in nav, hero and close); what assets
exist. Then write four to seven **beats**. Sections serve beats; a section with no
beat is cut.

Worked example for a spice store (adapt per variation):

```
1  Recognition   the smell of their mother's tadka, the one they never get right
2  Turn          it was never the cooking, it was the spice: stale, cut, coloured
3  Proof         one chilli, macro, the oil still on the skin
4  Range         the shelf: whole, ground, blends, each labelled like a specimen
5  Origin        the field it came from (only an origin the client confirms)
6  Commitment    one pack, one line, the cart
```

The store grid sits between beat 1 and beat 2 on the live page (BUILD-BRIEF);
beat 4 (Range) can *be* the grid if the grammar is Gallery / catalog.

### Step 2: Grammar, signature move, fingerprint gate, feeling curve, score

1. **Pick a grammar** (`references/uniqueness.md §2`): filmic one-shot, chaptered
   editorial, live surface, continuous world, typographic poster, gallery /
   catalog, split stage, rhythmic cutlist. Each one *forbids* things; the forbids
   are the point. Filmic one-shot carries a burden of proof: say why the other
   seven lost. For this project:
   - Gallery / catalog fits a store (nav is an index of objects; every object
     carries the same fact-label schema, e.g. `Kashmiri mirch. Whole. Sun-dried. 100 g.`;
     no persuasion inside labels). It matches TASTE-SKILL §10's even grid.
   - Chaptered editorial fits an origin/heritage direction.
   - Split stage fits "fresh branded spice vs loose market spice", only with real,
     client-confirmed facts.
   - Rhythmic cutlist fits the loud v1 direction.
2. **Invent one signature move**: bespoke, coded in the page, unique to this site,
   not a kit parameter. It is also TASTE-SKILL's "one signature move, the only loud
   one". Spice-native seeds: a heat dial that regrades the whole page; a spice that
   grinds as you scroll (an R3F particle field goes coarse to fine); a masala
   builder whose selection carries into the cart as a real bundle; a running
   receipt of spices the visitor lingered on, totalled into a cart at the close.
   A recoloured spotlight or a retuned tilt is not one.
3. **Fingerprint gate**: read `scrollcraft/FINGERPRINTS.md`. The plan must differ
   from **every** row on at least 4 of 6 dimensions (grammar, nav treatment, hero
   device, act-sequence shape, close pattern, signature move). If it fails, change
   the plan, never the log. **Action for this project:** backfill one row per
   existing variation v1 to v5 (from the README table and the shipped code), so the
   five pitches are provably different pages, not re-skins.
4. **Feeling curve before the score.** One line per act. Two adjacent acts with
   the same feeling means one is filler. The peak gets the largest scroll room,
   the best assets, and a quieter act before it (TASTE-SKILL: a quiet section
   between scenes).
5. **Score table**: device per beat, with why.

```
| Beat        | Device                         | Why this one |
|-------------|--------------------------------|--------------|
| Recognition | layered hero (scene, short)    | depth from planes around the type; paints on the first frame; Shop CTA visible |
| (store)     | flow + reveal once             | the grid is information; reveal once, never re-hide |
| Turn        | reveal (wipe)                  | a wipe is a change of state: dull loose powder becomes the real thing |
| Proof       | scene: pin + line reveal       | the frame holds on one macro chilli while two lines rise |
| Range       | native drag row                | lateral reads as "options"; each card a specimen label |
| Origin      | scene: R3F camera move         | the peak: the longest scene on the page, quiet section before it |
| Commitment  | held close + pointer response  | the page stops and responds; one pack, one line, the cart |
```

Checks before building (all must hold):

- The grammar's bans hold.
- Four or more device families; never the same family twice in a row.
- At most two `scrub` acts; at most two or three scenes in total (TASTE-SKILL).
- No two adjacent acts with the same feeling.
- One peak, the largest span by a visible margin, a quieter act before it.
- Every act earns its span; shorter is fine for a store.
- Not the "6 to 7 acts at 13.6 to 13.8 vh" band the author's first builds all hit.

### Step 3: Assets

Section 5 (ChatGPT workflow). One style preamble reused verbatim plus TASTE-SKILL's
closing line; name the calm area in every prompt; look at every image before
using it; layer the hero.

### Step 4: Build

Real semantic HTML: real `<h1>`, real `<p>`, real links, real reading order; text
is never baked into images. Theme via tokens from the TASTE-SKILL sheet. Read
`references/taste.md` and TASTE-SKILL.md §4 before writing markup. scroll-craft
ship-blockers that hold here: no scroll cue or mouse icon, no `01 / 06` counters,
no em dash in visible copy, no invented statistics in counters,
`transform`/`opacity` only (plus `clip-path` for wipes), no full-frame dark overlay
for contrast (scrim only where the text sits, or mask the picture away from the
text), no gradient text, no audio. **Spice-specific trap:** "warm cream ground,
brass accent, espresso text" is the default every food brief falls into; both
skills flag it (`palette-cream`); use it only as a declared, approved deviation.

### Step 5: Verify by scrolling it

Section 6.

### Output

`BRIEF.md` plus a short report: grammar and why the other seven lost; signature
move; fingerprint result against each row; journey; feeling curve and peak; the
feel-check diff; the score table; what was generated; what was verified with
screenshots and what was not. Then append the build's row to
`scrollcraft/FINGERPRINTS.md`.

---

## 3. Layered hero depth (baseline, not polish)

scroll-craft's standing rule: a premium marketing hero is **dimensional**. One
beautiful image with a text fade does not pass. Read `references/hero-depth.md`
and `references/approved-collection.md §2` before planning the hero. Under
TASTE-SKILL the layers never cross the headline, and the hero still paints its
headline, sentence, picture and Shop button on the first frame.

### 3.1 Write the layer contract first (`scrollcraft/builds/kesari-vN/LAYERS.md`)

| Plane | Spice-store example | Movement (scroll) | Contact / occlusion rule |
|---|---|---|---|
| Far environment | the drying yard at dusk, or a dark kitchen wall | smallest; lags ~30% behind the page | clean plate: no ghost of the extracted subject |
| Midground | a stone slab, a brass thali rim, terraced hills | moderate; lags ~15 to 20% | establishes scale; solid below its silhouette |
| Focal subject | the Kesari pouch / jar / tin (alpha cutout) or the R3F model | deliberate travel or slow rotation | stays on its slab: shared contact anchor |
| Near foreground | whole red chillies, bay leaves, a cast-iron edge | strongest restrained travel | cut so it dips where the product sits; never reaches the headline's box |
| Atmosphere (optional) | steam or a thin curl of smoke off a tadka | slow independent drift | separation only; never over the subject or the type; no dust or glow (TASTE-SKILL) |
| Type and controls | real `<h1>`, one sentence, Shop CTA | stable | **top of the stack, in the planned calm area, never covered** |

Write the **opening, midpoint and resolved exit** in plain words. Example:
"Open: pouch on the slab right of centre, chillies low in the foreground,
headline and Shop button in the calm upper left. Midpoint: chillies slide past the
lens, the pouch rises slightly, the far yard recedes. Exit: the slab becomes the
top edge of the product grid."

### 3.2 Motion numbers

Build the hero as a short scene (TASTE-SKILL §8 contract, one screen or less of
hold) so its depth rates are scene-internal; outside scenes TASTE-SKILL's 8% cap
applies. Inside the scene, from `references/devices.md §6`:

- Adjacent planes differ by **10 to 30%** in rate. Reference hero: far lags 31%,
  mid 17%, product 20%, foreground and copy travel with the page.
- Total travel past ~200px stops reading as depth and reads as a bug.
- Body copy never sits on a moving layer.
- Every plane is **solid below its silhouette** (no fade-to-transparent bottoms).
- Hide the section floor's clip line with a ground-coloured band above every plane
  (a solid band or a soft edge in the page ground; no decorative gradient).
- Traps that cost a round each: global `img { max-width: 100% }` shrinks absolute
  planes on phones (planes get `max-width: none` and a fixed width); a
  `transition: transform` on a plane makes it lag the thumb (transition opacity
  only); replacing art under the same filename ships stale bytes to cached phones
  (new art, new name: `hero-near-chillies-v2`).
- Pointer response is optional, additive, gated to `(hover: hover) and
  (pointer: fine)`, never pointer lock, no custom cursor.
- Reduced motion: the finished composition, still layered, no pinned scroll space.
- No preloader: the static `<picture>` hero is the first paint; layer textures or
  the 3D chunk fade in behind it when ready.

### 3.3 Mobile is art-directed separately

Recompose, do not shrink: different crop, subject position, contact pivot, type
size, layer order and travel. On phones the headline usually sits above the
subject. Check 390x844 **and** 360x640. Headline at most two lines.

### 3.4 Acceptance (gate wording for UNLAZY.md)

Distinct layers visibly move at different rates; no duplicate subject, hole,
halo, floating contact point or seam; no layer ever overlaps the headline box; the
opening headline is readable and the scroll produces a clear change; the scene
resolves into the next section; mobile and motion-off states are complete; assets
load and controls work. A passing unit test is not visual proof: say so if visual
verification was not done.

---

## 4. Device variety

Pick per beat (`references/devices.md`). Implementation column is how we build
each in this stack; keep the `data-sc-*` hook on the element. Numbers already
reconciled with TASTE-SKILL §7.

| Device | What the hand does | Build it with | Rules that bite |
|---|---|---|---|
| `scrub` | wheel scrubs a camera move | an R3F camera path inside a scene (preferred), or a found clip's `<video>` driven by a lerped target time | ≤ 2 per page; poster = the clip's own first frame; dense-GOP encode (`encode.sh`); map time across the stage's whole visible life |
| `pin` | frame holds, content advances | scene contract + ScrollTrigger scrub | about one screen per step, ≤ 3 screens; a line of text on every held screen; hero cue present from the first frame; only the last act holds its final cue |
| `pan` | lateral travel | native drag row first; pinned sideways gallery only under three screens, with keyboard support | **measure overflow** (`rail.scrollWidth - innerWidth`); one- or two-word card headings; reduced motion = native scroll region |
| `reveal` | a wipe is a change of state | `clip-path` tween, `--ease-in-out` | use big, not on small elements; `iris` once per page; mind `line-height < 1` clipping glyphs |
| `kinetic` | type assembles | GSAP SplitText `mask: "lines"` | lines 80 to 110ms stagger, ≤ 4 steps; characters only for 1 to 3 word headings; re-split after `document.fonts.ready` |
| `parallax` | layers at different rates | `y` scrub, or R3F layer offsets | under 8% of the element outside scenes; scene-internal rates per 3.2 |
| `count` | numbers land | count-up once on entry | **real numbers only**; a pitch brand has none, so no counters unless the client supplies them |
| `flow` + `in` | ordinary sections, revealed once | ScrollTrigger `once` at 85 to 90% | rise 12 to 32px, 700 to 900ms `--ease-expo`, items 50 to 90ms; never re-hide on scroll up |
| pointer | page responds to presence | `gsap.quickTo` | tilt 5 to 9 deg; magnet on the primary CTA only; all gated to fine pointers; no overshoot easing |
| `drift` | ground colour by chapter | hard cuts at section edges (TASTE-SKILL §7) | header ink follows in 300ms |

Law: **four or more families, never the same twice in a row**, one reason per act.
Embodiment touches (pointer parallax of the world, dwell-triggered detail, one
second-person line) are seasoning: one or two per page.

---

## 5. ChatGPT image workflow (replacing kie.ai)

TASTE-SKILL.md §6 owns the imagery rules and its six prompt templates; this
section adds what scroll-craft's pipeline needs on top: layered hero planes, clean
plates, genuine alpha, alignment, and the post-processing commands.

### 5.1 What scroll-craft's pipeline actually expects

Read from `SKILL.md`, `references/assets.md`, `references/worlds.md`,
`references/hero-depth.md`, `references/approved-collection.md` and `scripts/kie.mjs`:

- **Stills are PNG** in the build's `out/` (originals, never edited in place);
  delivery files are optimized copies elsewhere. Clips, when they exist, get a
  desktop encode, a mobile encode, and a poster that is the clip's own first frame.
- **Aspect ratios** the old generator accepted: 16:9, 9:16, 3:4 (4:5 rejected).
  Returned sizes are only *near* the ratio, so **layout is derived from the file,
  not the requested string**. (Our ratio family comes from TASTE-SKILL: 4:5, 16:9
  or 3:2, 1:1.)
- **Every prompt = style preamble (verbatim) + blank line + scene.** The scene
  names subject, frame, and **where the calm/empty area is**. Never text in the image.
- **The real brand object is passed as a reference** on every prompt that
  includes it, so labels do not drift.
- **Read every image before using it**; reroll rather than fix in CSS.
- **Hero layers need genuine alpha**: a clean background plate with the subject
  removed and the space rebuilt; subject and foreground as true alpha cutouts (a
  rendered checkerboard or white backdrop is not transparency; a magenta plate
  needs keying and spill removal); framing, scale, light and perspective preserved
  across layers; shared contact points; edges inspected on light and dark grounds;
  originals retained; delivery files optimized without losing alpha.
- **Generous safe margins**: a label or handle cropped by the frame cannot be
  repaired in CSS. Regenerate incomplete subjects.

### 5.2 Bypassing the kie.ai scripts

| Original step | What to do instead |
|---|---|
| `KIE_AI_API_KEY` in `.env` | Leave unset. `doctor.mjs` reports it as an optional warning only. |
| `node .claude/skills/scroll-craft/scripts/kie.mjs probe` | Do not run. It throws on import without a key (exit 1, before any network call; verified). |
| `kie.mjs still "<prompt>" out/01.png --ar 16:9 --ref x.png` | ChatGPT image generation with the same preamble + scene + TASTE-SKILL closing line; upload the reference image in the chat; download the PNG into `out/`. Aspect handling in 5.4. |
| `kie.mjs shot` (image to video) | ChatGPT does not make video. Use, best first: an R3F camera move or layered scene (no video weight); a slow drift/scale on a photograph; an honest found clip via taste-skill's assets tool (`--video`, ≤ 20s, ≤ 5 MB section / ≤ 10 MB hero, poster required), graded per `assets.md` "Real footage", then `encode.sh`; client footage the same way. A run of separate ChatGPT stills will not scrub smoothly; do not try. |
| `--tail` seam locking | Only for chained clips; not applicable. |
| Credit accounting | Not applicable. Record each prompt, chat and date in the shot list. |

Everything else (`encode.sh`, poster extraction, `serve.mjs`, `shoot.mjs`,
`worldflight-assert.mjs`, `workspace.mjs`) needs no key and runs as documented.
Use the full ffmpeg at `~/.local/bin/ffmpeg`.

### 5.3 Folders and names

```
.taste-skill/v3/shot-list.md     one prompt + one asset spec per picture slot (TASTE-SKILL §6.3);
                                 the style preamble once at the top; which chat produced each file
scrollcraft/builds/kesari-v3/
  BRIEF.md   LAYERS.md           scroll-craft decisions and the hero layer contract
  out/                           raw ChatGPT downloads, upscales, local cutouts (git-ignored, back up)
site/public/v3/img/              delivery files from img-pipeline.sh, served at /v3/img/...
```

Name pattern: `<section>-<role>-<subject>[-p][-vN]`, lowercase kebab.

- hero roles: `key` (full composed frame), `plate` (clean plate), `far`, `mid`,
  `subject`, `near`, `atmos`
- `-p` = the phone composition; `-vN` = replacement art (cache-busting; never
  overwrite a shipped file)
- products: `sku-<slug>-<view>` (e.g. `sku-kashmiri-mirch-front`)
- others: `macro-<subject>`, `life-<moment>`, `origin-<place>`, `og-<page>`

Examples: `hero-key-slab.png`, `hero-plate-slab.png`, `hero-subject-pouch.png`,
`hero-near-chillies.png`, `hero-key-slab-p.png`.

### 5.4 Sizes and aspect ratios

ChatGPT works on three canvases: **square (1:1), landscape (3:2), portrait
(2:3)**. Ask for the shape in words and for the largest size it offers. Exports
have typically been 1024x1024, 1536x1024 and 1024x1536; newer models may return
more. **Always measure** (`sips -g pixelWidth -g pixelHeight file.png`).

Compose for the crop: put the safe area in the prompt ("keep everything important
inside the middle 84% of the height; the top and bottom 8% will be cropped").

Targets follow TASTE-SKILL §6.1 (twice the CSS width, capped at about 2400px;
4:5 and 16:9 or 3:2 for 75%+ of pictures, 1:1 for details):

| Asset | Generate as | Crop to | Deliver (largest) | Widths for `img-pipeline.sh` |
|---|---|---|---|---|
| Hero layers, desktop (key, plate, far, mid, subject, near, atmos) | landscape 3:2 | 16:9 | 2400x1350 | 960 1440 1920 2400 |
| Hero layers, phone (`-p`), recomposed | portrait 2:3 | 4:5 | 1440x1800 | 720 1080 1440 |
| Split picture | portrait 2:3 | 4:5 | 1440x1800 | 720 1080 1440 |
| Product card (cut-out on a flat field; label under the picture) | portrait 2:3, transparent | 4:5 | 1200x1500 | 400 600 800 1200 |
| Detail crop / macro tile | square | 1:1 | 1200 to 2048 | 600 1200 |
| Three.js texture (seamless) | square | 1:1 | 2048x2048 (power of two) | 1024 2048 |
| Lifestyle / ritual wide | landscape 3:2 | 3:2 | 2400x1600 | 960 1440 2400 |
| Origin band | landscape 3:2 | 16:9 | 2400x1350 (+ a 4:5 `-p`) | 960 1440 1920 2400 |
| Open Graph | landscape 3:2 | 1200x630 | 1200x630 | 1200 |

ChatGPT's native long edge (about 1536px) is below 2400, so desktop heroes and
origin bands need an upscale (5.8 step 3). Far planes are fine with a plain 2x
because depth wants them softer; subjects need an AI upscaler.

### 5.5 Working method in ChatGPT

1. **One chat per shoot** (one per variation). First message: paste the style
   preamble and say "This is the style bible for every image in this chat." Still
   paste the preamble at the top of **every** prompt, and end every prompt with
   TASTE-SKILL's closing line:
   *"Photographic, natural colour, no text, no logos, no watermark, no border, no
   vignette, no added glow, square-cornered frame."*
2. **Generate the hero first**; then attach it to every later prompt with "same
   light, grade and background colour as the attached hero image" (TASTE-SKILL §6.1).
3. **Upload references**: real packshots or label artwork if the client has them.
   Say what to take from each ("match camera height, lens, light direction and
   grade; do not copy any text").
4. **One image per prompt**, shape stated explicitly, calm area named.
5. **Packaging:** generate it **without legible text** and apply the label as
   artwork in code/3D, or supply exact label text and check it letter by letter.
   Mark every product shot "placeholder until the client's shoot".
6. **Download the PNG** at original size into `out/`, log it in the shot list,
   then **look at it**. Reroll cheaply.
7. **Transparency:** ask for "a transparent background (real alpha PNG), no
   backdrop, no checkerboard, no shadow". ChatGPT sometimes paints a checkerboard
   or white instead; `REQUIRE_ALPHA=1 img-pipeline.sh` catches it (exit 4).

### 5.6 Style preambles (one per variation; tune to the dealt TASTE-SKILL sheet)

Each names medium and lens, light (sources counted and placed), grade (three
words), surface texture, and the negative list. No grain, dust, glow or vignette:
those are banned treatments.

**v3 Midnight Masala (low-key photographic)**

> Still-life photography, 85mm lens at f/4 on a full-frame camera. One warm
> tungsten key from the upper left at 45 degrees, a faint cool fill from the
> right, deep natural falloff into a dark ground. Grade: deep charcoal shadows,
> saffron-amber highlights, natural mid-tones. Surfaces: honest stone, real
> spice texture, true material detail. NOT 3D render, NOT CGI, NOT illustration,
> NOT clay, no plastic sheen.

**v1 Masala Pop (hard-light graphic)**

> Studio product photography with a single hard undiffused light from the upper
> right. Crisp high-contrast shadows used as graphic shapes. Saturated seamless
> colour backdrop filling the frame. Shot on digital medium format, sharp
> throughout. Photographic, not rendered, no CGI.

**v2 The Kirana Counter (natural documentary)**

> Documentary photography in a working Indian kirana shop, available daylight
> from a doorway on the left only, 35mm. Worn steel and wood, real stock on real
> shelves. Muted natural grade, no colour cast. Hands at work allowed, no faces,
> nobody looking at camera. Not stock-photo styling, no CGI, no shop signage
> lettering.

**v4 Darbar Maximalist (photographed cut-paper relief).** scroll-craft bans the
clay/low-poly diorama as a default and allows an illustrated world only when the
brand genuinely is one. If v4 keeps its paper-cut bazaar, make it *real material,
photographed*:

> Photograph of a hand-cut layered paper relief, real paper with visible fibres
> and cut edges, five to seven paper layers at real physical depth, one warm
> raking light from the left so every layer casts a soft natural shadow on the one
> behind. Rich jewel colours, matte paper, 50mm lens at f/8, sharp throughout.
> Photographed craft object, NOT 3D render, NOT CGI, NOT clay, NOT vector illustration.

**v5 Spice Lab (macro)**

> Macro photography, 100mm macro lens. Thin plane of focus on the subject,
> one rim light from behind and one soft fill from the front. Visible surface
> detail: oil on chilli skin, crystals in amchur, fibres in a saffron thread.
> Clean dark ground. Photographic realism, no CGI, no illustration.

### 5.7 Prompt templates

Use TASTE-SKILL §6.2's six templates (cut-out on a flat field, ingredient macro,
origin place, process with hands, ritual in use, multiply-ready ingredient) for
ordinary picture slots. The templates below cover what a **layered** hero and a
consistent catalogue additionally need. Format: preamble, blank line, template,
closing line.

**T1 Hero key frame (desktop).** The full composed scene; every layer is derived
from it so alignment is exact.

```
[PREAMBLE]

Landscape image. [An unlabelled kraft stand-up pouch of ground Kashmiri chilli]
standing on [a dark basalt slab], camera slightly above, 15 degrees. Behind it,
[rows of red chillies drying on mats at dusk], far away. Low in the foreground,
[three whole dried chillies] crossing the lower right corner. The pouch sits
right of centre, its base on the lower third. Calm, evenly dark empty area across
the upper left third for a headline and a button. Keep every important element
inside the middle 84% of the height (top and bottom will be cropped to 16:9). The
pouch is complete with generous margin on every side.

[CLOSING LINE]
```

**T2 Hero key frame (phone, `-p`).** Attach T1's approved image.

```
[PREAMBLE]

Portrait image. The same scene as the attached image, same pouch, slab, light
direction, lens and grade, recomposed for a phone: the pouch centred in the lower
half, the chillies entering from the bottom edge, a calm empty area across the top
40% for a headline. Keep everything important inside the middle 84% of the width.

[CLOSING LINE]
```

**T3 Clean plate** (edit of the approved key frame; ChatGPT's region-select edit
keeps the rest of the image steadier than a whole-image prompt):

```
Edit the attached image. Remove [the pouch and the three chillies in front of it]
completely and rebuild what was behind them: [the basalt slab surface, its edge,
the far drying yard], matching texture, perspective, lighting and colour exactly.
Change nothing else: same framing, same size, same colours, same position of
every remaining element. No text.
```

ChatGPT may silently re-render the whole frame. Always run the alignment diff
(5.8 step 6). If the plate drifted, inpaint locally instead (Photoshop Generative
Fill, Photopea or similar) and keep ChatGPT for generation only.

**T4 Subject and foreground cutouts.** Preferred: cut them **out of the key frame
itself** (5.8 step 4), pixel-aligned by construction. Fallback when a separate
generation is unavoidable:

```
[PREAMBLE]

Portrait image. Only [the unlabelled kraft stand-up pouch], alone, at the same
camera angle, lens and light direction as the attached image, complete with
generous empty margin on all sides. Transparent background (real alpha PNG), no
backdrop, no floor, no shadow, no checkerboard pattern.

[CLOSING LINE]
```

A separately generated cutout must be measured and aligned to the plate by hand
(scale, position, contact point), as `hero-depth.md` warns.

**T5 Foreground plane** (the near layer that passes in front of the product):

```
[PREAMBLE]

Landscape image. Only [a loose drift of whole dried red chillies and two bay
leaves] along the bottom edge of the frame, close to the lens, lit from the upper
left. The pile is lowest in the middle (where the product stands behind it) and
rises at both sides, staying in the bottom quarter of the frame. It is solid all
the way down to the bottom edge. Everything above it is empty. Transparent
background (real alpha PNG), no backdrop, no checkerboard.

[CLOSING LINE]
```

**T6 Atmosphere** (optional; steam or smoke only, never dust or glow), on black,
converted to alpha by luminance:

```
[PREAMBLE]

Landscape image. A thin curl of steam rising from [a small iron tadka pan just
out of frame at the lower left], on a pure black background, natural soft light.
Nothing else in the frame: no objects, no surfaces. Fading to clean black at all
edges, clear of the upper left third.

[CLOSING LINE]
```

**T7 Catalogue packshot** (consistency is the whole game; TASTE-SKILL §10 card):

```
[PREAMBLE]

Portrait image. One [unlabelled kraft stand-up pouch, 100 g size, with a clear
window showing whole cumin seeds], front three-quarter view, camera 15 degrees
above, centred, filling 70% of the frame height, generous margin all round, soft
key from the upper left. Transparent background (real alpha PNG), no floor, no
shadow, no props, no checkerboard, no label lettering.

[CLOSING LINE]
```

Generate the first SKU, approve it, then attach it to every following SKU:
"Match the attached image exactly: same camera angle, lens, scale in frame, light
direction and grade. Change only the contents to [whole black peppercorns]."
Cards supply one flat field and one contact shadow treatment for every SKU.

**T8 Three.js texture**

```
[PREAMBLE]

Square image. The surface of [ground Kashmiri chilli powder] filling the frame
evenly edge to edge, one grazing light from the left, no single focal point, no
objects, seamless and tileable on all four edges.

[CLOSING LINE]
```

Check the tile (5.8 step 8) before using it.

**People and places (all templates).** Hands are fine; no faces that read as
"our farmer" or "our customer". Show only origins the client actually sources
from; an unconfirmed origin stays generic ("chilli fields") and is flagged in the
data file. Generated people are never paired with testimonial copy or names.

### 5.8 Post-processing (every command tested on this machine)

`FF=~/.local/bin/ffmpeg` (full build). Work on copies in `out/`; originals stay.

1. **Measure.** `sips -g pixelWidth -g pixelHeight -g hasAlpha out/hero-key-slab.png`
2. **Crop to the target ratio** (centre crops; change the offset term to move the window):
   ```bash
   # 3:2 landscape -> 16:9
   $FF -i in.png -vf "crop=iw:iw*9/16:0:(ih-iw*9/16)/2" out-169.png
   # 2:3 portrait -> 4:5
   $FF -i in.png -vf "crop=iw:iw*5/4:0:(ih-iw*5/4)/2" out-45.png
   ```
   Alpha survives these crops (PNG stays RGBA).
3. **Upscale the key frame before cutting it up.** Subjects and near planes: an
   AI upscaler (Upscayl, a free macOS app using Real-ESRGAN, or Photoshop Super
   Resolution). Far planes only: plain 2x is acceptable:
   `$FF -i in.png -vf "scale=iw*2:ih*2:flags=lanczos" out-2x.png`.
4. **Cut out subject and foreground from the upscaled key frame.** No install
   needed: macOS Preview or Finder Quick Actions "Remove Background". For one
   element among several, crop that region first or refine the mask in Photopea or
   Pixelmator. Optional CLI (downloads a model on first run, nothing installed
   globally): `uvx --from "rembg[cli]" rembg i in.png out.png`.
   Export every cutout **on the full key-frame canvas** (same width and height,
   transparent elsewhere) so layers stack with `inset: 0` and only their transforms
   differ. Transparent pixels cost almost nothing in WebP/AVIF.
5. **Edge QA.** Composite on contrasting grounds and look:
   ```bash
   $FF -f lavfi -i "color=c=magenta:s=2400x1350" -i hero-subject-pouch.png \
     -filter_complex "[0][1]overlay=format=auto" -frames:v 1 qa-magenta.png
   ```
   Repeat with `c=black` and `c=white`. A light halo: erode the alpha by 1px:
   ```bash
   $FF -i cut.png -filter_complex "[0:v]split[c][a];[a]alphaextract,erosion[ae];[c][ae]alphamerge" cut-eroded.png
   ```
6. **Plate alignment check** (the plate may differ from the key frame only where
   the subject was):
   ```bash
   $FF -i hero-key-slab.png -i hero-plate-slab.png \
     -filter_complex "[0][1]blend=all_mode=difference,eq=contrast=4" qa-diff.png
   ```
   Only the subject's footprint should light up in `qa-diff.png`. Glowing slab
   edges or sky mean ChatGPT re-rendered the frame; redo the plate.
7. **Steam/smoke from black to alpha** (luminance becomes opacity; avoids
   `mix-blend-mode` over the WebGL canvas, which the perf pass forbids):
   ```bash
   $FF -i hero-atmos-steam-black.png \
     -filter_complex "[0:v]format=rgb24,split[c][l];[l]format=gray[a];[c][a]alphamerge,format=rgba" hero-atmos-steam.png
   ```
8. **Seamless tile check** for Three.js textures (seams show at the cross):
   ```bash
   $FF -i tex.png -filter_complex "[0:v]split[a][b];[a][b]hstack,split[c][d];[c][d]vstack" qa-tile-2x2.png
   ```
9. **Encode responsive delivery files** (AVIF + WebP, alpha kept, never
   upscales, rejects fake transparency, prints a ready `<picture>`):
   ```bash
   REQUIRE_ALPHA=1 bash docs/playbook/tools/img-pipeline.sh \
     scrollcraft/builds/kesari-v3/out/hero-subject-pouch.png \
     site/public/v3/img hero-subject-pouch 960 1440 1920 2400
   bash docs/playbook/tools/img-pipeline.sh scrollcraft/builds/kesari-v3/out/hero-plate-slab-p.png \
     site/public/v3/img hero-plate-slab-p 720 1080 1440
   ```
   Knobs: `WEBP_Q` (82), `AVIF_CRF` (30; lower is better). Checks: alpha present,
   alpha real (exit 4 on a checkerboard/white "transparency"), corners clear
   (warning only; a foreground plane may bleed off-frame).
10. **Clip posters**, only if a clip exists: the first frame of the *encoded* clip:
    ```bash
    $FF -y -i hero.mp4 -frames:v 1 -vf scale=1600:-2 -c:v libwebp -quality 82 hero-poster.webp
    ```

### 5.9 Wiring into the site

- Static hero planes: one absolutely positioned `<picture>` per plane, all in
  the same aspect box, `max-width: none`, art-directed with
  `<source media="(max-width: 860px)" srcset="...-p-...">`. `width`/`height` on
  every `<img>` (override both or neither), `fetchpriority="high"` on the hero
  picture that paints first, `loading="lazy"` below the fold, a ground-colour
  `background-color` on each container (TASTE-SKILL §6.3).
- R3F planes: load the WebP into drei `useTexture`, `colorSpace = SRGBColorSpace`,
  consistent premultiplied alpha, dispose on unmount; the canvas sits **under** the
  type in the stacking order (TASTE-SKILL §8).
- New art gets a new filename (`-v2`); never overwrite a shipped file.

### 5.10 Cohesion check before any asset ships

Lay the whole set side by side: one light direction, one grade, one treatment for
the page (untouched, greyscale, or multiply-on-a-field), one level of realism, the
brand object identical everywhere, no text in any image. If one image is cooler
than the rest, reroll it; never fix it with a CSS filter.

---

## 6. Verification

Run on the **production preview**, never the dev server. Port `531N` for
variation N (TASTE-SKILL §0); never 5171 to 5175, 5180, or 5300 (the user's main
dev server).

```bash
cd site
PAGE=v3 npx vite build --outDir /tmp/build-v3 --emptyOutDir
npx vite preview --outDir /tmp/build-v3 --port 5313 --strictPort &        # background
curl -s http://localhost:5313/v3/ | grep -o "<title>.*</title>"             # confirm it is YOUR page
node ../.claude/skills/scroll-craft/scripts/shoot.mjs --url http://localhost:5313/v3/ --out ../scrollcraft/lab/v3-desktop
node ../.claude/skills/scroll-craft/scripts/shoot.mjs --url http://localhost:5313/v3/ --out ../scrollcraft/lab/v3-mobile --width 390 --height 844
node ../.claude/skills/scroll-craft/scripts/shoot.mjs --url http://localhost:5313/v3/ --out ../scrollcraft/lab/v3-reduced --reduced-motion
```

- The harness needs `data-sc-act` / `data-sc-cue` / `data-sc-pan` /
  `data-sc-reveal` / `data-sc-verify-state` hooks in the markup (section 1). It
  writes `sheet.png` and `report.json` (dead scroll, frozen clip, cues that never
  peak, contrast measured on the composited page, console errors, failed requests).
- **Read `sheet.png`.** The harness proves things move; it cannot judge
  composition, smoothness or meaning.
- **Lenis:** a screenshot taken mid-glide is not a frame the reader holds; verify
  with reduced motion too.
- **Feel check** (`references/feel.md §6`): scroll cold once, write one word per
  act, then diff against BRIEF.md's curve. Where they disagree, the page is wrong.
- **Pan rails:** measure `rail.scrollWidth - innerWidth` yourself; the harness
  reports a non-overflowing rail as healthy.
- **Real phone:** headless Chrome cannot reproduce iOS video decode, Low Power
  Mode or touch. For any clip, test on a device over LAN (`serve.mjs --lan`, stop it
  after) and ship `references/device-diag.html` with the first mobile fix.
- Then TASTE-SKILL's gate (`taste.mjs check vN`, `scenes vN`) and the perf floor.
  Note: `site/tools/perf.mjs`, `shot.mjs` and `audit.mjs` launch Playwright's
  bundled Chromium, which is not downloaded for the site's Playwright 1.47.2; run
  `npx playwright install chromium` in `site/` or add `channel: 'chrome'` to their
  `launch()` calls.
- Turn every acceptance above into a gate (UNLAZY.md) **before** building.

---

## 7. One-screen checklist

- [ ] `BRIEF.md`: eight answers, feeling curve, peak sentence, tell-someone sentence, authored silence
- [ ] Journey of 4 to 7 beats; the shop grid placed per BUILD-BRIEF
- [ ] Grammar chosen and the other seven argued out; its bans respected
- [ ] One signature move that exists on this site only
- [ ] Fingerprint gate passed against every row (rows for v1 to v5 backfilled)
- [ ] Score table: ≥ 4 families, no repeats in a row, ≤ 2 scrubs, 2 to 3 scenes max, one peak with the largest span
- [ ] `LAYERS.md` contract; opening, midpoint, exit written in words; type never covered
- [ ] One preamble + the TASTE-SKILL closing line on every prompt; shot list complete
- [ ] Every layer cut from the key frame or measured into alignment; plate diff clean
- [ ] Edges checked on magenta, black, white; `REQUIRE_ALPHA=1` passes for cutouts
- [ ] Delivery files in `site/public/vN/img/` via `img-pipeline.sh`; new art, new name
- [ ] Mobile composition authored separately (390x844 and 360x640)
- [ ] Reduced motion = the finished composition, still layered
- [ ] Harness on desktop, mobile, reduced; `sheet.png` read; feel check diffed
- [ ] UNLAZY gates re-verified before reporting; FINGERPRINTS row appended
