export const BRAND = 'Kesari'
export const FREE_SHIP = 499

// id, name, vernacular, cat, origin, shu, price, mrp, wt, colour, rating, reviews, radar[heat,sweet,floral,earthy,pungent,citrus], notes, tag
const R = [
  ['kashmiri-chilli','Kashmiri Chilli','कश्मीरी मिर्च','Chillies','Kashmir',2000,249,299,'100g','#B3261E',4.8,1840,[3,3,1,4,2,1],'Smoky, mild heat, deep red colour','Bestseller'],
  ['guntur-sannam','Guntur Sannam','गुंटूर मिर्च','Chillies','Andhra Pradesh',35000,189,229,'100g','#D8341A',4.6,920,[9,1,0,3,7,1],'Fierce, clean, fast burn',''],
  ['byadgi-chilli','Byadgi Chilli','ब्याडगी','Chillies','Karnataka',15000,229,269,'100g','#8E1B14',4.7,610,[5,2,0,5,3,1],'Wrinkled, oily, rich colour',''],
  ['bhut-jolokia','Bhut Jolokia Flakes','भूत झोलोकिया','Chillies','Assam',1000000,399,449,'25g','#FF3B1F',4.5,402,[10,2,1,2,9,1],'Slow-building, fruity inferno','Limited'],
  ['lakadong-turmeric','Lakadong Turmeric','लकडोंग हल्दी','Roots','Meghalaya',0,299,349,'100g','#E3A21A',4.9,2310,[1,2,1,8,3,2],'7–9% curcumin, earthy, bright','Bestseller'],
  ['alleppey-turmeric','Alleppey Finger Turmeric','अलेप्पी हल्दी','Roots','Kerala',0,219,259,'100g','#D68A12',4.6,740,[1,2,1,8,2,2],'Rounded, mellow, golden',''],
  ['dry-ginger','Cochin Dry Ginger','सोंठ','Roots','Kerala',0,249,289,'100g','#C9A66B',4.5,388,[4,2,1,6,6,4],'Hot, woody, lemon edge',''],
  ['amchur','Amchur Powder','आमचूर','Roots','Uttar Pradesh',0,159,189,'100g','#BDA24E',4.4,512,[0,3,1,2,1,9],'Sun-dried green mango, tart',''],
  ['green-cardamom','Green Cardamom','हरी इलायची','Pods & Seeds','Idukki',0,449,529,'50g','#7A9A3A',4.9,1980,[1,7,9,2,3,6],'Floral, eucalyptus, sweet','Bestseller'],
  ['black-cardamom','Black Cardamom','बड़ी इलायची','Pods & Seeds','Sikkim',0,379,429,'50g','#4A3426',4.5,330,[2,2,3,8,5,2],'Campfire smoke, camphor',''],
  ['cumin','Rajasthani Cumin','जीरा','Pods & Seeds','Rajasthan',0,199,239,'100g','#8A6A3B',4.7,1260,[1,2,1,8,3,1],'Nutty, warm, toasty',''],
  ['coriander','Coriander Seed','धनिया','Pods & Seeds','Madhya Pradesh',0,149,179,'100g','#A8944A',4.6,870,[0,3,5,4,1,7],'Citrus, floral, gentle',''],
  ['fennel','Lucknowi Fennel','सौंफ','Pods & Seeds','Uttar Pradesh',0,169,199,'100g','#9DB26B',4.6,640,[0,8,6,2,1,2],'Sweet, aniseed, cooling',''],
  ['ajwain','Ajwain','अजवाइन','Pods & Seeds','Rajasthan',0,159,189,'100g','#8C7B52',4.4,290,[3,0,2,5,8,2],'Thymol sharp, medicinal',''],
  ['mustard','Black Mustard Seed','राई','Pods & Seeds','West Bengal',0,129,149,'100g','#2F2A26',4.5,415,[4,0,0,4,9,1],'Pops, bites, nutty after',''],
  ['fenugreek','Methi Seed','मेथी दाना','Pods & Seeds','Rajasthan',0,119,139,'100g','#B48A2C',4.3,260,[1,4,1,7,2,1],'Maple, bitter, hay',''],
  ['kashmiri-saffron','Mongra Saffron','केसर','Barks & Flowers','Pampore',0,899,1099,'1g','#C8461E',4.9,2890,[0,6,10,3,1,2],'Honeyed, hay-like, intense','Bestseller'],
  ['ceylon-cinnamon','Ceylon Cinnamon','दालचीनी','Barks & Flowers','Kerala',0,329,379,'50g','#A0522D',4.7,780,[2,9,3,3,2,5],'Sweet, delicate, citrus',''],
  ['cassia','Cassia Bark','तेज पत्ता छाल','Barks & Flowers','Meghalaya',0,189,219,'100g','#7A3F22',4.4,230,[3,7,1,5,3,2],'Bold, spicy-sweet',''],
  ['clove','Wayanad Cloves','लौंग','Barks & Flowers','Kerala',0,299,349,'50g','#4B2A1A',4.7,690,[5,4,2,6,8,1],'Numbing, sweet, resinous',''],
  ['star-anise','Star Anise','चक्र फूल','Barks & Flowers','Meghalaya',0,279,319,'50g','#5A3A22',4.6,360,[1,9,4,2,2,1],'Liquorice, warm, aromatic',''],
  ['mace','Mace Blades','जावित्री','Barks & Flowers','Kerala',0,599,699,'25g','#C8793A',4.6,150,[2,6,5,3,3,4],'Nutmeg\'s gilded sibling',''],
  ['tellicherry-pepper','Tellicherry Pepper','काली मिर्च','Peppers','Kerala',0,349,399,'100g','#2B2420',4.8,1540,[6,0,2,3,9,5],'Bold, citrusy, piney','Bestseller'],
  ['long-pepper','Pippali Long Pepper','पिप्पली','Peppers','Assam',0,429,489,'50g','#5A4630',4.3,120,[6,2,2,5,8,1],'Sweet heat, deeply woody',''],
  ['garam-masala','Heirloom Garam Masala','गरम मसाला','Blends','House blend',0,279,329,'100g','#6B3A1E',4.9,3120,[4,5,4,6,5,3],'11 whole spices, slow roasted','Bestseller'],
  ['chaat-masala','Chaat Masala','चाट मसाला','Blends','Delhi blend',0,169,199,'100g','#B88A3E',4.6,980,[3,1,1,3,5,9],'Black salt, amchur, tang',''],
  ['sambar-masala','Sambar Masala','सांभर मसाला','Blends','Tamil Nadu blend',0,189,219,'100g','#A55B1E',4.7,720,[5,1,1,6,4,2],'Toor, curry leaf, hing',''],
  ['chai-masala','Chai Masala','चाय मसाला','Blends','Assam blend',0,219,259,'100g','#8E5A2B',4.8,1430,[3,7,5,3,3,3],'Cardamom-forward, ginger snap',''],
]

export const products = R.map(([id, name, vern, cat, origin, shu, price, mrp, wt, color, rating, reviews, radar, notes, tag], i) => ({
  id, name, vern, cat, origin, shu, price, mrp, wt, color, rating, reviews, radar, notes, tag,
  sku: 'KL-' + String(i + 1).padStart(3, '0'),
}))
const WHOLE = new Set(['Pods & Seeds', 'Barks & Flowers'])
products.forEach((p, i) => {
  p.kind = p.cat === 'Blends' ? 'Blends' : p.price >= 449 ? 'Premium' : WHOLE.has(p.cat) ? 'Whole' : 'Ground'
  p.isNew = i % 7 === 3
  p.stock = i % 11 === 6 ? 6 : 99
  p.desc = p.name + ' from ' + p.origin + '. ' + p.notes + '. Sourced direct from named growers, lab-assayed per batch and nitrogen-flushed in a resealable pouch.'
})
export const grams = (w) => parseInt(w, 10)
export const sizesFor = (p) => (p.kit ? [p.wt] : p.wt === '1g' ? ['1g', '2g', '5g'] : grams(p.wt) >= 100 ? ['50g', '100g', '250g'] : ['25g', '50g', '100g'])
export const priceFor = (p, size) => {
  if (p.kit) return { price: p.price, mrp: p.mrp }
  const r = grams(size) / grams(p.wt), f = r > 1 ? 0.92 : r < 1 ? 1.12 : 1
  return { price: Math.round(p.price * r * f), mrp: Math.round(p.mrp * r * f) }
}
export const KITS = [
  { id: 'kit-1', n: 'EXP-01', name: 'The Dal Tadka Kit', ids: ['lakadong-turmeric', 'cumin', 'kashmiri-chilli'], price: 599, mrp: 747, note: 'The three that make every dal taste like someone cared.' },
  { id: 'kit-2', n: 'EXP-02', name: 'The Gifting Flight', ids: ['kashmiri-saffron', 'green-cardamom', 'ceylon-cinnamon', 'tellicherry-pepper'], price: 1799, mrp: 2026, note: 'Four heirloom specimens in a lab-case box. Diwali approved.' },
  { id: 'kit-3', n: 'EXP-03', name: 'Biryani Protocol', ids: ['garam-masala', 'kashmiri-saffron', 'star-anise', 'black-cardamom'], price: 1349, mrp: 1556, note: 'Dum-ready. Includes a card with the timing, to the minute.' },
]
export const byId = Object.fromEntries(products.map((p) => [p.id, p]))
KITS.forEach((k) => { byId[k.id] = { ...k, kit: true, origin: k.ids.length + ' pouches', wt: 'Kit', color: byId[k.ids[0]].color, sku: k.n, rating: 4.9, reviews: 310, notes: k.note, radar: [3, 4, 4, 4, 4, 3], vern: 'Bundle', cat: 'Combos', kind: 'Combos', shu: 0, desc: k.note + ' Includes: ' + k.ids.map((i) => byId[i].name).join(', ') + '.' } })
export const kinds = ['All', 'Whole', 'Ground', 'Blends', 'Premium', 'Combos']
export const cats = ['All', ...Array.from(new Set(products.map((p) => p.cat)))]
export const AXES = ['Heat', 'Sweet', 'Floral', 'Earthy', 'Pungent', 'Citrus']

// spec sheets (indicative lab values; the real COA ships with each batch)
export const sheets = [
  { id: 'kashmiri-chilli', lot: 'KS-2409-KCH', harvest: '14 NOV 2025', rows: [
    ['Capsaicinoids (SHU)', 2000, 'SHU', 40000], ['Colour value', 150, 'ASTA', 200], ['Moisture', 8.4, '%', 12], ['Total ash', 6.1, '%', 10], ['Volatile oil', 0.6, '%', 5], ['Aflatoxin B1', 0.8, 'ppb', 5] ] },
  { id: 'lakadong-turmeric', lot: 'KS-2409-LKD', harvest: '02 FEB 2026', rows: [
    ['Curcumin', 7.8, '%', 10], ['Moisture', 8.9, '%', 12], ['Volatile oil', 4.2, '%', 7], ['Total ash', 5.3, '%', 10], ['Lead (Pb)', 0.12, 'ppm', 2.5], ['Colour value (CIE b*)', 62, 'b*', 80] ] },
  { id: 'green-cardamom', lot: 'KS-2410-GCD', harvest: '21 OCT 2025', rows: [
    ['1,8-Cineole', 36, '%', 50], ['α-Terpinyl acetate', 38, '%', 50], ['Essential oil', 7.4, '%', 10], ['Moisture', 10.1, '%', 12], ['Pod size (8mm+)', 92, '%', 100], ['Pesticide screen', 0, 'flags', 5] ] },
  { id: 'tellicherry-pepper', lot: 'KS-2410-TLP', harvest: '09 JAN 2026', rows: [
    ['Piperine', 6.2, '%', 9], ['Volatile oil', 3.1, '%', 5], ['Bulk density', 580, 'g/L', 650], ['Moisture', 10.4, '%', 12], ['Berry size (4.25mm+)', 96, '%', 100], ['Salmonella', 0, 'cfu', 1] ] },
  { id: 'cumin', lot: 'KS-2411-CMN', harvest: '28 MAR 2026', rows: [
    ['Cuminaldehyde', 32, '%', 45], ['Volatile oil', 2.8, '%', 5], ['Moisture', 8.2, '%', 12], ['Purity', 99.2, '%', 100], ['Acid-insoluble ash', 0.6, '%', 1.5], ['Sudan dyes', 0, 'ppb', 1] ] },
  { id: 'kashmiri-saffron', lot: 'KS-2411-MGS', harvest: '30 OCT 2025', rows: [
    ['Crocin (coloring)', 240, 'E1%', 280], ['Safranal (aroma)', 38, 'E1%', 50], ['Picrocrocin (bitter)', 82, 'E1%', 100], ['Moisture', 9.6, '%', 12], ['Floral waste', 0.4, '%', 1], ['ISO 3632 grade', 1, 'cat.', 3] ] },
]

export const heroStates = [
  { key: 'chilli', no: '01', name: 'Kashmiri Chilli', latin: 'Capsicum annuum', spec: [['HEAT', '2,000', 'SHU'], ['CAPSANTHIN', '9.1', 'ASTA'], ['ORIGIN', 'Kashmir', '34.08°N 74.79°E'], ['BATCH', 'KS-2409-KCH', 'Nov 2025']], pal: ['#4a0c06', '#ff3b1f', '#ffd0a0'] },
  { key: 'turmeric', no: '02', name: 'Lakadong Turmeric', latin: 'Curcuma longa', spec: [['CURCUMIN', '7.8', '%'], ['VOLATILE OIL', '4.2', '%'], ['ORIGIN', 'Meghalaya', '25.35°N 92.21°E'], ['BATCH', 'KS-2409-LKD', 'Feb 2026']], pal: ['#6a3a00', '#ffb000', '#fff2a8'] },
  { key: 'cardamom', no: '03', name: 'Idukki Cardamom', latin: 'Elettaria cardamomum', spec: [['1,8-CINEOLE', '36', '%'], ['OIL', '7.4', '%'], ['ORIGIN', 'Idukki', '9.85°N 77.10°E'], ['BATCH', 'KS-2410-GCD', 'Oct 2025']], pal: ['#10300f', '#9be23a', '#f2ffd0'] },
  { key: 'anise', no: '04', name: 'Star Anise', latin: 'Illicium verum', spec: [['ANETHOLE', '88', '%'], ['OIL', '8.1', '%'], ['ORIGIN', 'Garo Hills', '25.51°N 90.22°E'], ['BATCH', 'KS-2411-SAN', 'Dec 2025']], pal: ['#2a1608', '#c6ff3d', '#ffffff'] },
]
