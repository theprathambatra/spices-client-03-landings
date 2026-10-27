import { useEffect, useState } from 'react'
import { StoreProvider } from './store'
import SmoothScroll from './ui/SmoothScroll'
import Cursor from './ui/Cursor'
import Header from './Header'
import Hero from './hero/Hero'
import TinSection from './tin/TinSection'
import Manifesto, { Trust } from './Manifesto'
import Shop, { Bestsellers } from './Catalogue'
import OriginMap from './OriginMap'
import { Bundles, Process, Voices, Vault, Inner, Footer } from './Sections'
import { CartDrawer, Checkout, QuickView, Search, Menu, Toast } from './Overlays'
import { BRAND } from './data'

function Loader({ done }) {
  return (
    <div className={`loader ${done ? 'is-done' : ''}`} aria-hidden="true">
      <span>{BRAND}</span><i />
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1300)
    return () => clearTimeout(t)
  }, [])
  return (
    <StoreProvider>
      <SmoothScroll>
        <Loader done={ready} />
        <Header />
        <main>
          <Hero ready={ready} />
          <Bestsellers />
          <Trust />
          <Manifesto />
          <TinSection />
          <Shop />
          <Bundles />
          <OriginMap />
          <Process />
          <Voices />
          <Vault />
          <Inner />
        </main>
        <Footer />
        <CartDrawer />
        <Checkout />
        <QuickView />
        <Search />
        <Menu />
        <Toast />
        <Cursor />
        <div className="grain" aria-hidden="true" />
      </SmoothScroll>
    </StoreProvider>
  )
}
