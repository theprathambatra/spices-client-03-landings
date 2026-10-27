# Kesari — spice D2C landing page variations

Five pitch directions for an Indian spice e-commerce brand, each a shoppable storefront with a Three.js hero.

| # | Direction | Signature 3D |
|---|---|---|
| v1 | Masala Pop (Evernuts energy) | Spice-shower physics hero, poppable pouches, heat-meter chilli |
| v2 | The Kirana Counter (Rochi Ram's energy) | Masala dabba that opens on scroll, kirana jar aisle |
| v3 | Midnight Masala (dark luxury) | Saffron-thread nebula, gold tin with spice-dust plume |
| v4 | Darbar Maximalist (Indian heritage) | Paper-cut bazaar diorama fly-through, spinning brass thali |
| v5 | Spice Lab (futuristic) | 150k-particle spice morph, refraction jar over live ink |

## Run

```bash
cd site
npm install
npm run dev        # http://localhost:5300/
npm run build      # all five pages → site/dist
```

`PAGE=v3 npm run build` builds a single variation. Brand name and catalogue placeholders live in each `vN/src` data file.

Research, playbooks and the build brief are in `docs/`.
