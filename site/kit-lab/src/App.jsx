import { lazy, useState } from 'react'
import { spices, img } from './data.js'

// text
import SplitText from '@kit/text/SplitText'
import BlurText from '@kit/text/BlurText'
import ShinyText from '@kit/text/ShinyText'
import RotatingText from '@kit/text/RotatingText'
import ScrollReveal from '@kit/text/ScrollReveal'
import { TextEffect } from '@kit/text/TextEffect'
import { TextScramble } from '@kit/text/TextScramble'
// marquee
import { Marquee } from '@kit/marquee/Marquee'
import ScrollVelocity from '@kit/marquee/ScrollVelocity'
// buttons
import { Magnetic } from '@kit/buttons/Magnetic'
import { ShimmerButton } from '@kit/buttons/ShimmerButton'
// cards
import { CardContainer, CardBody, CardItem } from '@kit/cards/Card3D'
import { Tilt } from '@kit/cards/Tilt'
import { MagicCard } from '@kit/cards/MagicCard'
import SpotlightCard from '@kit/cards/SpotlightCard'
import ProductCard from '@kit/cards/ProductCard'
// gallery
import CircularGallery from '@kit/gallery/CircularGallery'
import { Carousel, Card as AppleCard } from '@kit/gallery/AppleCardsCarousel'
import ImageTrail from '@kit/gallery/ImageTrail'
import { Lens } from '@kit/gallery/Lens'
// layout
import { BentoGrid, BentoCard } from '@kit/layout/BentoGrid'
import { GlowingEffect } from '@kit/layout/GlowingEffect'
import { BlurFade } from '@kit/layout/BlurFade'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
  MorphingDialogImage,
} from '@kit/layout/MorphingDialog'
// cursor
import { SmoothCursor } from '@kit/cursor/SmoothCursor'
import ClickSpark from '@kit/cursor/ClickSpark'
// nav
import { StaggeredMenu } from '@kit/nav/StaggeredMenu'
import FlowingMenu from '@kit/nav/FlowingMenu'
import Dock from '@kit/nav/Dock'
// numbers
import { NumberTicker } from '@kit/numbers/NumberTicker'
import { SlidingNumber } from '@kit/numbers/SlidingNumber'
// social
import { AnimatedTestimonials } from '@kit/social/AnimatedTestimonials'
// backgrounds (policy: always through ShaderStage, always lazy)
import ShaderStage from '@kit/backgrounds/ShaderStage'
import { POSTERS, SHADER_COST } from './shaders.js'

const Silk = lazy(() => import('@kit/backgrounds/Silk'))
const Iridescence = lazy(() => import('@kit/backgrounds/Iridescence'))
const Threads = lazy(() => import('@kit/backgrounds/Threads'))
const LiquidChrome = lazy(() => import('@kit/backgrounds/LiquidChrome'))
const MetallicPaint = lazy(() => import('@kit/backgrounds/MetallicPaint'))
const ShaderGradientBg = lazy(() => import('@kit/backgrounds/ShaderGradientBg'))

/* ---------------------------------------------------------------- lab chrome */

function Specimen({ n, name, file, source, deps, dark = false, wide = false, children, note }) {
  return (
    <article
      id={file.replace(/[/.]/g, '-')}
      className={`${wide ? 'lg:col-span-2' : ''} flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card`}
    >
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border px-5 py-3">
        <span className="font-mono text-xs text-muted-foreground tabular-nums">{String(n).padStart(2, '0')}</span>
        <h3 className="font-display text-lg leading-tight text-foreground">{name}</h3>
        <code className="ml-auto font-mono text-[11px] text-muted-foreground">kit/{file}</code>
        <p className="w-full font-mono text-[11px] leading-relaxed text-muted-foreground">
          {source} · deps: {deps}
          {note ? <span className="block text-foreground/70">{note}</span> : null}
        </p>
      </header>
      <div className={`${dark ? 'dark' : ''} relative flex-1 bg-background text-foreground`}>{children}</div>
    </article>
  )
}

function Section({ id, title, kicker, children }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-14 sm:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">{title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{kicker}</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">{children}</div>
    </section>
  )
}

const Pad = ({ className = '', children }) => <div className={`p-6 sm:p-8 ${className}`}>{children}</div>

/* ---------------------------------------------------------------- page */

export default function App() {
  const [cursorOn, setCursorOn] = useState(false)
  const [scrambleKey, setScrambleKey] = useState(0)
  const [qty, setQty] = useState(2)
  const [cartCount, setCartCount] = useState(0)

  return (
    <main className="pb-24">
      {cursorOn && <SmoothCursor />}

      <header className="mx-auto max-w-7xl px-4 pt-16 pb-6 sm:px-8">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">site/kit · verified</p>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] text-foreground sm:text-7xl">Kit Lab</h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground">
          Every component in <code className="font-mono text-sm">site/kit/</code>, rendered with the storefront stack
          (React 19, Tailwind 4, motion, GSAP, raw WebGL2, R3F). Each specimen names its file, upstream source and
          dependencies. Shader backgrounds sit behind <code className="font-mono text-sm">ShaderStage</code> with their
          measured cost. Index and rules: <code className="font-mono text-sm">docs/playbook/COMPONENTS.md</code>.
        </p>
        <nav className="mt-6 flex flex-wrap gap-2 text-sm" aria-label="Sections">
          {['text', 'marquee', 'buttons', 'cards', 'gallery', 'layout', 'cursor', 'nav', 'numbers', 'social', 'backgrounds'].map((s) => (
            <a key={s} href={`#${s}`} className="rounded-full border border-border px-3 py-1 text-foreground hover:bg-muted">
              {s}
            </a>
          ))}
        </nav>
      </header>

      {/* ------------------------------------------------------------ TEXT */}
      <Section id="text" title="Text effects" kicker="Headline reveals, shimmer, rotating words, scramble and scroll-scrubbed reading.">
        <Specimen n={1} name="SplitText" file="text/SplitText.jsx" source="React Bits" deps="gsap (SplitText, ScrollTrigger), @gsap/react">
          <Pad>
            <SplitText
              text="Ground this week, not this year."
              tag="h2"
              className="font-display text-4xl leading-tight sm:text-5xl"
              textAlign="left"
              splitType="chars"
              effect="rise"
              delay={30}
            />
          </Pad>
        </Specimen>

        <Specimen n={2} name="BlurText" file="text/BlurText.jsx" source="React Bits" deps="motion">
          <Pad>
            <BlurText
              text="Single-origin spices, kept like jewels."
              className="font-display text-4xl leading-tight sm:text-5xl"
              animateBy="words"
              direction="top"
              delay={120}
            />
          </Pad>
        </Specimen>

        <Specimen n={3} name="ShinyText" file="text/ShinyText.jsx" source="React Bits" deps="none" dark>
          <Pad className="flex min-h-40 items-center">
            <ShinyText
              text="Mongra saffron · Pampore, Kashmir"
              className="font-display text-3xl sm:text-4xl"
              color="#9c7a45"
              shineColor="#fff1c9"
              speed={2.6}
            />
          </Pad>
        </Specimen>

        <Specimen n={4} name="RotatingText" file="text/RotatingText.jsx" source="React Bits" deps="motion">
          <Pad className="flex min-h-40 items-center">
            <p className="flex flex-wrap items-center gap-x-3 font-display text-3xl sm:text-4xl">
              <span>Made for</span>
              <RotatingText
                texts={['dal tadka', 'biryani', 'masala chai', 'rasam']}
                mainClassName="overflow-hidden rounded-lg bg-primary px-3 py-1 text-primary-foreground"
                splitLevelClassName="overflow-hidden"
                staggerDuration={0.02}
                rotationInterval={2200}
              />
            </p>
          </Pad>
        </Specimen>

        <Specimen n={5} name="TextEffect" file="text/TextEffect.jsx" source="Motion Primitives" deps="motion">
          <Pad>
            <TextEffect per="char" preset="fade-in-blur" as="h2" className="font-display text-4xl sm:text-5xl">
              Lakadong turmeric, 7.4% curcumin.
            </TextEffect>
          </Pad>
        </Specimen>

        <Specimen n={6} name="TextScramble" file="text/TextScramble.jsx" source="Motion Primitives" deps="motion">
          <Pad className="flex min-h-40 flex-col items-start justify-center gap-4">
            <TextScramble key={scrambleKey} as="p" className="font-mono text-2xl tracking-widest uppercase" duration={1.1}>
              Batch 0427 · Harvested Mar 2026
            </TextScramble>
            <button
              type="button"
              onClick={() => setScrambleKey((k) => k + 1)}
              className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-muted"
            >
              Replay
            </button>
          </Pad>
        </Specimen>

        <Specimen n={7} name="ScrollReveal" file="text/ScrollReveal.jsx" source="React Bits" deps="gsap (ScrollTrigger)" wide note="Scrubbed by page scroll: words sharpen as the paragraph crosses the viewport.">
          <Pad>
            <ScrollReveal textClassName="font-display text-2xl leading-snug sm:text-4xl" baseOpacity={0.12} blurStrength={5} baseRotation={2}>
              We buy whole spice straight from the farm that grew it, grind it in small batches the week it ships, and
              print the harvest date on every tin, because flavour is a perishable thing.
            </ScrollReveal>
          </Pad>
        </Specimen>
      </Section>

      {/* ------------------------------------------------------------ MARQUEE */}
      <Section id="marquee" title="Marquees" kicker="Ingredient tickers and press strips; the velocity marquee skews with scroll speed.">
        <Specimen n={8} name="Marquee" file="marquee/Marquee.jsx" source="Magic UI" deps="none (CSS keyframes in kit.css)" wide>
          <Pad className="space-y-2 px-0 sm:px-0">
            <Marquee pauseOnHover className="[--duration:32s]">
              {spices.map((s) => (
                <span key={s.id} className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2">
                  <img src={s.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                  <span className="text-sm whitespace-nowrap">{s.name}</span>
                  <span className="text-xs text-muted-foreground">{s.origin}</span>
                </span>
              ))}
            </Marquee>
            <Marquee reverse className="[--duration:40s]">
              {['FSSAI certified', 'Lab-tested purity', 'No fillers', 'Farm-gate pricing', 'Ground to order', 'Plastic-free tins'].map((t) => (
                <span key={t} className="px-6 font-display text-xl whitespace-nowrap text-muted-foreground">
                  {t} ✦
                </span>
              ))}
            </Marquee>
          </Pad>
        </Specimen>

        <Specimen n={9} name="ScrollVelocity" file="marquee/ScrollVelocity.jsx" source="React Bits" deps="motion" wide dark note="Scroll the page: speed and skew follow scroll velocity.">
          <div className="overflow-hidden py-8">
            <ScrollVelocity
              texts={['Kashmiri chilli ✦ Lakadong turmeric ✦ Tellicherry pepper ✦ ', 'Idukki cardamom ✦ Pampore saffron ✦ Ceylon cinnamon ✦ ']}
              velocity={40}
              className="px-4 font-display"
              fontSize="clamp(2rem, 6vw, 4.5rem)"
              color="#f5ebdd"
              skewWithVelocity={6}
              outlineAlternate
            />
          </div>
        </Specimen>
      </Section>

      {/* ------------------------------------------------------------ BUTTONS */}
      <Section id="buttons" title="Buttons" kicker="Primary CTA shimmer and a magnetic pull for the one action that matters.">
        <Specimen n={10} name="Magnetic" file="buttons/Magnetic.jsx" source="Motion Primitives" deps="motion">
          <Pad className="flex min-h-48 items-center justify-center">
            <Magnetic intensity={0.35} range={140}>
              <button type="button" className="rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background">
                <Magnetic intensity={0.15} range={140} actionArea="global">
                  <span className="inline-block">Build your masala box →</span>
                </Magnetic>
              </button>
            </Magnetic>
          </Pad>
        </Specimen>

        <Specimen n={11} name="ShimmerButton" file="buttons/ShimmerButton.jsx" source="Magic UI" deps="none (CSS keyframes in kit.css)">
          <Pad className="flex min-h-48 items-center justify-center">
            <ShimmerButton background="#7a1e0e" shimmerColor="#f6c76b" className="font-medium shadow-2xl">
              <span className="text-base text-[#fff4e2]">Shop the harvest</span>
            </ShimmerButton>
          </Pad>
        </Specimen>
      </Section>

      {/* ------------------------------------------------------------ CARDS */}
      <Section id="cards" title="Cards" kicker="Depth, tilt and spotlight surfaces, plus a complete add-to-cart product card.">
        <Specimen n={12} name="Card3D (CardContainer/Body/Item)" file="cards/Card3D.jsx" source="Aceternity UI" deps="none">
          <Pad className="flex justify-center">
            <CardContainer containerClassName="py-4">
              <CardBody className="group/card relative h-auto w-[18rem] rounded-xl border border-border bg-card p-5 sm:w-[22rem]">
                <CardItem translateZ="50" className="font-display text-xl">Pampore Mongra Saffron</CardItem>
                <CardItem as="p" translateZ="60" className="mt-1 text-sm text-muted-foreground">
                  Grade A1, hand-separated stigmas. 1 g tin.
                </CardItem>
                <CardItem translateZ="100" className="mt-4 w-full">
                  <img src={img.saffron} alt="Saffron" className="h-56 w-full rounded-xl object-cover group-hover/card:shadow-xl" />
                </CardItem>
                <div className="mt-6 flex items-center justify-between">
                  <CardItem translateZ={20} as="span" className="text-sm font-medium">₹899</CardItem>
                  <CardItem translateZ={20} as="button" className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
                    Add to cart
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </Pad>
        </Specimen>

        <Specimen n={13} name="Tilt" file="cards/Tilt.jsx" source="Motion Primitives" deps="motion">
          <Pad className="flex justify-center">
            <Tilt rotationFactor={8} isRevese className="w-[18rem] sm:w-[22rem]">
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <img src={img.turmeric} alt="Lakadong turmeric" className="h-64 w-full object-cover" />
                <div className="p-4">
                  <p className="font-display text-lg">Lakadong Turmeric</p>
                  <p className="text-sm text-muted-foreground">Meghalaya · 100 g · ₹299</p>
                </div>
              </div>
            </Tilt>
          </Pad>
        </Specimen>

        <Specimen n={14} name="MagicCard" file="cards/MagicCard.jsx" source="Magic UI" deps="motion">
          <Pad className="grid gap-4 sm:grid-cols-2">
            <MagicCard className="rounded-xl" gradientColor="#e3a21a33" gradientFrom="#e3a21a" gradientTo="#b3261e">
              <div className="p-5">
                <p className="font-display text-lg">Farm-gate sourcing</p>
                <p className="mt-1 text-sm text-muted-foreground">Bought from 41 named farms, paid 30% over mandi rate.</p>
              </div>
            </MagicCard>
            <MagicCard mode="orb" className="rounded-xl" glowFrom="#e3a21a" glowTo="#b3261e" glowBlendMode="multiply">
              <div className="p-5">
                <p className="font-display text-lg">Lab-tested</p>
                <p className="mt-1 text-sm text-muted-foreground">Every batch screened for colourants and heavy metals.</p>
              </div>
            </MagicCard>
          </Pad>
        </Specimen>

        <Specimen n={15} name="SpotlightCard" file="cards/SpotlightCard.jsx" source="React Bits" deps="none" dark>
          <Pad>
            <SpotlightCard spotlightColor="rgba(227, 162, 26, 0.35)" className="p-8">
              <p className="font-display text-2xl text-[#f5ebdd]">The Tasting Flight</p>
              <p className="mt-2 text-sm text-[#b39a80]">Six 20 g tins to taste origin side by side. ₹1,190.</p>
            </SpotlightCard>
          </Pad>
        </Specimen>

        <Specimen n={16} name="ProductCard" file="cards/ProductCard.jsx" source="SmoothUI" deps="motion" wide note={`Cart events wired: ${cartCount} added.`}>
          <Pad className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {spices.slice(0, 4).map((s, i) => (
              <ProductCard
                key={s.id}
                image={s.image}
                title={s.name}
                subtitle={`${s.origin} · ${s.weight}`}
                price={s.price}
                originalPrice={i === 1 ? 349 : undefined}
                rating={[4.8, 4.6, 4.9, 4.7][i]}
                badge={['Bestseller', 'Sale', undefined, 'New'][i]}
                onAddToCart={() => setCartCount((c) => c + 1)}
              />
            ))}
          </Pad>
        </Specimen>
      </Section>

      {/* ------------------------------------------------------------ GALLERY */}
      <Section id="gallery" title="Carousels & galleries" kicker="Catalogue browsing, story cards, image trails and a macro lens.">
        <Specimen n={17} name="CircularGallery" file="gallery/CircularGallery.jsx" source="React Bits" deps="none (raw WebGL2)" wide dark note="Drag / wheel / arrow keys. Raw WebGL2, pauses off-screen.">
          <div className="h-[460px]">
            <CircularGallery
              items={spices.map((s) => ({ image: s.image, text: s.name }))}
              bend={2}
              textColor="#f5ebdd"
              font="500 28px 'Iowan Old Style', Georgia, serif"
              borderRadius={0.06}
              scrollEase={0.06}
              openOnClick={false}
            />
          </div>
        </Specimen>

        <Specimen n={18} name="Carousel + Card (Apple cards)" file="gallery/AppleCardsCarousel.jsx" source="Aceternity UI" deps="motion" wide>
          <Carousel
            items={spices.slice(0, 6).map((s, i) => (
              <AppleCard
                key={s.id}
                index={i}
                card={{
                  category: s.origin,
                  title: s.name,
                  src: s.image,
                  content: (
                    <div className="space-y-4 text-muted-foreground">
                      <p className="text-lg">{s.notes}.</p>
                      <p>Use it where it can bloom: in hot ghee for a tadka, or toasted dry and ground just before serving.</p>
                    </div>
                  ),
                }}
              />
            ))}
          />
        </Specimen>

        <Specimen n={19} name="ImageTrail" file="gallery/ImageTrail.jsx" source="React Bits" deps="gsap" note="Move the pointer across the panel.">
          <div className="relative h-[380px] overflow-hidden">
            <p className="pointer-events-none absolute inset-0 grid place-items-center font-display text-3xl text-muted-foreground">
              Move across me
            </p>
            <ImageTrail items={Object.values(img)} size={150} rotation={8} />
          </div>
        </Specimen>

        <Specimen n={20} name="Lens" file="gallery/Lens.jsx" source="Magic UI" deps="motion" note="Hover the photo: macro zoom for texture close-ups.">
          <Pad className="flex justify-center">
            <div className="w-full max-w-sm overflow-hidden rounded-xl">
              <Lens zoomFactor={2.2} lensSize={180} ariaLabel="Zoom into cumin">
                <img src={img.cumin} alt="Rajasthani cumin, close-up" className="h-80 w-full object-cover" />
              </Lens>
            </div>
          </Pad>
        </Specimen>
      </Section>

      {/* ------------------------------------------------------------ LAYOUT */}
      <Section id="layout" title="Layout & reveals" kicker="Bento for the 'why us' story, glow borders, enter reveals and a morphing quick-view.">
        <Specimen n={21} name="BentoGrid + BentoCard" file="layout/BentoGrid.jsx" source="Magic UI" deps="none" wide dark>
          <Pad>
            <BentoGrid className="auto-rows-[16rem] lg:grid-cols-3">
              {[
                { name: 'Single origin', description: 'One farm, one harvest, one tin.', image: img.cardamom, span: 'lg:col-span-2' },
                { name: 'Ground to order', description: 'Milled the week it ships.', image: img.chilli, span: 'lg:col-span-1' },
                { name: 'Lab-tested', description: 'Purity report on every batch.', image: img.pepper, span: 'lg:col-span-1' },
                { name: 'Fair to farmers', description: '30% over mandi rate, always.', image: img.garam, span: 'lg:col-span-2' },
              ].map((c) => (
                <BentoCard
                  key={c.name}
                  name={c.name}
                  description={c.description}
                  href="#layout"
                  cta="Read the story"
                  className={c.span}
                  background={
                    <img
                      src={c.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-70 transition-[opacity,transform] duration-500 group-hover:scale-[1.03] group-hover:opacity-90 [mask-image:linear-gradient(to_top,transparent_10%,#000_75%)]"
                    />
                  }
                />
              ))}
            </BentoGrid>
          </Pad>
        </Specimen>

        <Specimen n={22} name="GlowingEffect" file="layout/GlowingEffect.jsx" source="Aceternity UI" deps="motion" note="Border glow tracks the pointer near the card.">
          <Pad>
            <div className="relative rounded-2xl border border-border p-2">
              <GlowingEffect disabled={false} spread={40} proximity={64} inactiveZone={0.01} glow borderWidth={2} colors={['#e3a21a', '#b3261e', '#7a9a3a', '#c8461e']} />
              <div className="relative rounded-xl bg-card p-6">
                <p className="font-display text-xl">Subscribe & save 15%</p>
                <p className="mt-1 text-sm text-muted-foreground">A fresh tin of your staples every six weeks.</p>
              </div>
            </div>
          </Pad>
        </Specimen>

        <Specimen n={23} name="BlurFade" file="layout/BlurFade.jsx" source="Magic UI" deps="motion">
          <Pad className="grid grid-cols-4 gap-3">
            {spices.map((s, i) => (
              <BlurFade key={s.id} delay={0.06 * i} inView>
                <img src={s.image} alt={s.name} className="aspect-square w-full rounded-lg object-cover" />
              </BlurFade>
            ))}
          </Pad>
        </Specimen>

        <Specimen n={24} name="MorphingDialog" file="layout/MorphingDialog.jsx" source="Motion Primitives" deps="motion" note="Click the card: shared-layout morph into a quick-view.">
          <Pad className="flex justify-center">
            <MorphingDialog transition={{ type: 'spring', bounce: 0.05, duration: 0.3 }}>
              <MorphingDialogTrigger style={{ borderRadius: '14px' }} className="flex w-64 flex-col overflow-hidden border border-border bg-card text-left">
                <MorphingDialogImage src={img.cardamom} alt="Green cardamom pods" className="h-48 w-full object-cover" />
                <div className="px-4 py-3">
                  <MorphingDialogTitle className="font-display text-lg">Green Cardamom</MorphingDialogTitle>
                  <MorphingDialogSubtitle className="text-sm text-muted-foreground">Idukki · 50 g · ₹449</MorphingDialogSubtitle>
                </div>
              </MorphingDialogTrigger>
              <MorphingDialogContainer>
                <MorphingDialogContent style={{ borderRadius: '24px' }} className="pointer-events-auto relative flex w-[min(92vw,520px)] flex-col overflow-hidden border border-border bg-card">
                  <MorphingDialogImage src={img.cardamom} alt="Green cardamom pods" className="h-72 w-full object-cover" />
                  <div className="p-6">
                    <MorphingDialogTitle className="font-display text-2xl">Green Cardamom</MorphingDialogTitle>
                    <MorphingDialogSubtitle className="text-muted-foreground">Idukki · 50 g · ₹449</MorphingDialogSubtitle>
                    <MorphingDialogDescription
                      disableLayoutAnimation
                      variants={{ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 24 } }}
                    >
                      <p className="mt-3 text-sm text-muted-foreground">
                        8 mm bold pods, picked green and shade-dried. Floral, eucalyptus-cool, sweet. Crack two into chai.
                      </p>
                      <button type="button" className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
                        Add to cart
                      </button>
                    </MorphingDialogDescription>
                  </div>
                  <MorphingDialogClose className="text-foreground" />
                </MorphingDialogContent>
              </MorphingDialogContainer>
            </MorphingDialog>
          </Pad>
        </Specimen>
      </Section>

      {/* ------------------------------------------------------------ CURSOR */}
      <Section id="cursor" title="Cursors" kicker="Global smooth cursor (desktop, motion-allowed only) and a click spark for tactile CTAs.">
        <Specimen n={25} name="SmoothCursor" file="cursor/SmoothCursor.jsx" source="Magic UI" deps="motion" note="Mounted at page root; off for touch and prefers-reduced-motion.">
          <Pad className="flex min-h-48 items-center justify-center">
            <button
              type="button"
              aria-pressed={cursorOn}
              onClick={() => setCursorOn((v) => !v)}
              className="rounded-full border border-border px-6 py-3 text-sm hover:bg-muted"
            >
              {cursorOn ? 'Disable smooth cursor' : 'Enable smooth cursor'}
            </button>
          </Pad>
        </Specimen>

        <Specimen n={26} name="ClickSpark" file="cursor/ClickSpark.jsx" source="React Bits" deps="none (canvas 2D)" dark note="Click anywhere in the panel.">
          <ClickSpark sparkColor={['#e3a21a', '#c8461e', '#f6e3bd']} sparkCount={10} sparkRadius={36} shape="streak">
            <div className="grid min-h-48 place-items-center">
              <span className="rounded-full bg-[#e3a21a] px-6 py-3 text-sm font-medium text-[#1f140c]">Crackle like a tadka</span>
            </div>
          </ClickSpark>
        </Specimen>
      </Section>

      {/* ------------------------------------------------------------ NAV */}
      <Section id="nav" title="Navigation" kicker="Full-screen staggered menu, flowing category rows and a magnifying dock.">
        <Specimen n={27} name="StaggeredMenu" file="nav/StaggeredMenu.jsx" source="React Bits" deps="gsap" wide dark note="Contained here (isFixed=false); use isFixed on a real page.">
          <div className="relative h-[520px] overflow-hidden bg-[#0e0a07]">
            <StaggeredMenu
              position="right"
              items={[
                { label: 'Shop', ariaLabel: 'Shop all spices', link: '#gallery' },
                { label: 'Blends', ariaLabel: 'House blends', link: '#gallery' },
                { label: 'Origins', ariaLabel: 'Our farms', link: '#layout' },
                { label: 'Journal', ariaLabel: 'Recipes and stories', link: '#text' },
              ]}
              socialItems={[{ label: 'Instagram', link: 'https://instagram.com' }]}
              logo={<span className="font-display text-2xl text-[#f5ebdd]">Kesari</span>}
              colors={['#e3a21a', '#b3261e']}
              accentColor="#b3261e"
              panelBackground="#fbf6ee"
              panelTextColor="#1f140c"
              menuButtonColor="#f5ebdd"
              openMenuButtonColor="#1f140c"
            />
            <p className="absolute bottom-6 left-8 font-display text-4xl text-[#f5ebdd]/80">Open the menu →</p>
          </div>
        </Specimen>

        <Specimen n={28} name="FlowingMenu" file="nav/FlowingMenu.jsx" source="React Bits" deps="none" wide note="Hover a row: a marquee band follows the cursor.">
          <div className="h-[420px]">
            <FlowingMenu
              items={[
                { text: 'Chilli', link: '#cards', image: img.chilli, meta: '6 origins' },
                { text: 'Turmeric', link: '#cards', image: img.turmeric, meta: '3 origins' },
                { text: 'Pepper', link: '#cards', image: img.pepper, meta: '4 origins' },
                { text: 'Masalas', link: '#cards', image: img.garam, meta: '9 blends' },
              ]}
              textColor="#1f140c"
              bgColor="#fbf6ee"
              marqueeBgColor="#b3261e"
              marqueeTextColor="#fff8ee"
              borderColor="rgba(31,20,12,0.14)"
              showArrow
            />
          </div>
        </Specimen>

        <Specimen n={29} name="Dock" file="nav/Dock.jsx" source="React Bits" deps="none" wide>
          <div className="relative h-48">
            <Dock
              theme="light"
              accentColor="#b3261e"
              badgeColor="#b3261e"
              items={[
                { label: 'Home', icon: <DockGlyph d="M3 11.5 12 4l9 7.5M5 10v10h14V10" />, active: true },
                { label: 'Shop', icon: <DockGlyph d="M6 7h12l-1 13H7L6 7Zm3 0a3 3 0 0 1 6 0" /> },
                { label: 'Origins', icon: <DockGlyph d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" /> },
                { separator: true },
                { label: 'Cart', icon: <DockGlyph d="M3 4h2l2.4 11h10.2L20 7H6.2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />, badge: cartCount || 3 },
              ]}
            />
          </div>
        </Specimen>
      </Section>

      {/* ------------------------------------------------------------ NUMBERS */}
      <Section id="numbers" title="Numbers" kicker="Stats that count up on view (Indian grouping) and a cart quantity that rolls.">
        <Specimen n={30} name="NumberTicker" file="numbers/NumberTicker.jsx" source="Magic UI" deps="motion">
          <Pad className="grid grid-cols-3 gap-4">
            {[
              [41, 'partner farms'],
              [120000, 'tins shipped'],
              [7.4, '% curcumin', 1],
            ].map(([v, label, dp]) => (
              <div key={label}>
                <NumberTicker value={v} decimalPlaces={dp || 0} className="font-display text-3xl sm:text-4xl" />
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </Pad>
        </Specimen>

        <Specimen n={31} name="SlidingNumber" file="numbers/SlidingNumber.jsx" source="Motion Primitives" deps="motion">
          <Pad className="flex min-h-40 items-center gap-6">
            <div className="inline-flex items-center gap-4 rounded-full border border-border px-3 py-2">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(0, q - 1))} className="grid h-9 w-9 place-items-center rounded-full bg-muted text-lg">−</button>
              <span className="font-display text-3xl tabular-nums" aria-live="polite">
                <SlidingNumber value={qty} />
              </span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="grid h-9 w-9 place-items-center rounded-full bg-muted text-lg">+</button>
            </div>
            <div className="flex items-baseline gap-1 font-display text-2xl">
              ₹<SlidingNumber value={qty * 449} />
            </div>
          </Pad>
        </Specimen>
      </Section>

      {/* ------------------------------------------------------------ SOCIAL */}
      <Section id="social" title="Testimonials" kicker="Stacked-photo reviews with word-by-word quote reveal.">
        <Specimen n={32} name="AnimatedTestimonials" file="social/AnimatedTestimonials.jsx" source="Aceternity UI" deps="motion" wide>
          <AnimatedTestimonials
            testimonials={[
              { quote: 'The Kashmiri chilli changed my rogan josh. Colour without the burn, and it smells like the valley.', name: 'Aditi R.', designation: 'Home cook, Pune', src: img.chilli },
              { quote: 'You can taste the harvest date. My garam masala finally tastes like my nani’s.', name: 'Farhan Q.', designation: 'Chef, Hyderabad', src: img.garam },
              { quote: 'Lakadong turmeric is a different spice altogether. Golden milk will never be the same.', name: 'Meera S.', designation: 'Nutritionist, Bengaluru', src: img.turmeric },
            ]}
          />
        </Specimen>
      </Section>

      {/* ------------------------------------------------------------ BACKGROUNDS */}
      <Section
        id="backgrounds"
        title="Shader backgrounds"
        kicker="Policy-gated: poster first, lazy chunk, mounts near view, no GL for reduced motion / Save-Data / phones. Costs measured with tools/perf.mjs at 4x CPU throttle."
      >
        {[
          { n: 33, key: 'silk', name: 'Silk', file: 'backgrounds/Silk.jsx', source: 'React Bits', deps: 'none (raw WebGL2)', C: Silk, props: { color: '#7a1e0e', sheenColor: '#f6c76b', speed: 3, scale: 1, noiseIntensity: 1.2, rotation: 0.2 } },
          { n: 34, key: 'iridescence', name: 'Iridescence', file: 'backgrounds/Iridescence.jsx', source: 'React Bits', deps: 'none (raw WebGL2)', C: Iridescence, props: { color: [1, 0.52, 0.12], speed: 0.5, amplitude: 0.08, brightness: 1.25 } },
          { n: 35, key: 'threads', name: 'Threads', file: 'backgrounds/Threads.jsx', source: 'React Bits', deps: 'none (raw WebGL2)', C: Threads, props: { color: '#e35d1a', accentColor: '#f6c76b', amplitude: 1.2, distance: 0.2, lineCount: 60 } },
          { n: 36, key: 'liquidchrome', name: 'LiquidChrome', file: 'backgrounds/LiquidChrome.jsx', source: 'React Bits', deps: 'none (raw WebGL2)', C: LiquidChrome, props: { color: '#d9a43b', speed: 0.15, amplitude: 0.3, interactive: true } },
          { n: 37, key: 'metallic', name: 'MetallicPaint (liquid-logo style)', file: 'backgrounds/MetallicPaint.jsx', source: 'React Bits (liquid-metal technique; repos/liquid-logo is PolyForm Shield, not copied)', deps: 'none (raw WebGL2)', C: MetallicPaint, props: { text: 'Kesari', fontFamily: "'Iowan Old Style', Georgia, serif", fontWeight: 700, color: '#e3a21a', scale: 0.7 } },
          { n: 38, key: 'shadergradient', name: 'ShaderGradientBg', file: 'backgrounds/ShaderGradientBg.jsx', source: 'ShaderGradient (@shadergradient/react)', deps: '@shadergradient/react, three, @react-three/fiber', C: ShaderGradientBg, props: { preset: 'saffronSea' } },
        ].map(({ n, key, name, file, source, deps, C, props }) => (
          <Specimen key={key} n={n} name={name} file={file} source={source} deps={deps} dark note={SHADER_COST[key]}>
            <ShaderStage shader={C} shaderProps={props} poster={POSTERS[key]} className="aspect-[16/9] w-full">
              <div className="flex aspect-[16/9] items-end p-6">
                <p className="font-display text-2xl text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">{name}</p>
              </div>
            </ShaderStage>
          </Specimen>
        ))}
        <article className="flex flex-col justify-center rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground lg:col-span-2">
          <p className="font-display text-xl text-foreground">ShaderStage (kit/backgrounds/ShaderStage.jsx)</p>
          <p className="mt-2">
            Wraps every tile above. Each tile shows its CSS poster until the shader chunk loads and the canvas fades in. With
            reduced motion, Save-Data, a phone or a low-end device you only see the posters. That is the intended fallback.
          </p>
        </article>
      </Section>
    </main>
  )
}

function DockGlyph({ d }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}
