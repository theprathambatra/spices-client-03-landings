import { products } from '@shared/brand.js'
import chilli from '../assets/chilli.jpg'
import turmeric from '../assets/turmeric.jpg'
import pepper from '../assets/pepper.jpg'
import cardamom from '../assets/cardamom.jpg'
import saffron from '../assets/saffron.jpg'
import garam from '../assets/garam.jpg'
import cumin from '../assets/cumin.jpg'
import cinnamon from '../assets/cinnamon.jpg'

// Lab-only placeholder photography: procedural powder macros (generated, no network). Swap for real pack shots.
const byId = {
  'kashmiri-chilli': chilli,
  'lakadong-turmeric': turmeric,
  'malabar-pepper': pepper,
  'green-cardamom': cardamom,
  'kashmiri-saffron': saffron,
  'garam-masala': garam,
  cumin,
  cinnamon,
}

export const spices = products.map((p) => ({ ...p, image: byId[p.id] }))
export const img = { chilli, turmeric, pepper, cardamom, saffron, garam, cumin, cinnamon }
