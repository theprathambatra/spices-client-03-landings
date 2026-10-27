import { magicProducts } from './magicProducts.js'

// One constant to rename the brand everywhere.
export const BRAND = 'Kesari'
export const brand = {
  name: BRAND,
  tagline: 'Small-batch Indian spices, ground the week you order.',
  instagram: '@kesarispices',
}

export const FREE_SHIP = 499
export const SHIP_FEE = 49

export const CATEGORIES = [
  { id: 'ground', label: 'Ground', sub: 'Powders', color: '#F2A68E', icon: 'chilli' },
  { id: 'whole', label: 'Whole', sub: 'Sabut masale', color: '#A8F09A', icon: 'cardamom' },
  { id: 'blends', label: 'Blends', sub: 'Ready masalas', color: '#FFC21A', icon: 'bowl' },
  { id: 'chai', label: 'Chai & Milk', sub: 'Kadak mixes', color: '#C9C0F0', icon: 'chai' },
  { id: 'salts', label: 'Salts & Chaat', sub: 'Namak party', color: '#9BE8E0', icon: 'salt' },
  { id: 'rare', label: 'Premium', sub: 'Kesar & rare', color: '#F7BFD0', icon: 'saffron' },
  { id: 'fire', label: 'Fire Zone', sub: 'Heat 3 and up', color: '#FF8A6B', icon: 'flame' },
  { id: 'gift', label: 'Gift Boxes', sub: 'Hampers', color: '#DDD36A', icon: 'gift' },
]

// heat: 0-4, ink = label text on the pouch colour
const P = (id, name, hindi, cat, origin, notes, price, mrp, weight, color, heat, rating, reviews, icon, extra = {}) => ({
  id, name, hindi, cat, origin, notes, price, mrp, weight, color, heat, rating, reviews, icon, ...extra,
})

export const products = [
  P('kashmiri-chilli', 'Kashmiri Chilli', 'काश्मीरी मिर्च', 'ground', 'Kashmir', 'Deep red colour, smoky, gentle heat', 249, 299, '100g', '#E03A2F', 2, 4.8, 1284, 'chilli', { badge: 'Best seller', purposes: ['tandoori', 'sabzi'] }),
  P('guntur-fire', 'Guntur Fire Chilli', 'गुंटूर मिर्च', 'ground', 'Guntur', 'Andhra-grade, the one that talks back', 199, 249, '100g', '#C8161D', 4, 4.7, 902, 'chilli', { badge: 'Hot hot hot', purposes: ['pickle', 'sabzi'] }),
  P('lakadong-haldi', 'Lakadong Turmeric', 'लाकाडोंग हल्दी', 'ground', 'Meghalaya', '7-9% curcumin, earthy, sunshine yellow', 299, 349, '100g', '#FFC21A', 0, 4.9, 2310, 'turmeric', { badge: 'Best seller', purposes: ['dal', 'chai'] }),
  P('dhaniya', 'Dhaniya Powder', 'धनिया', 'ground', 'Ramganj Mandi', 'Citrusy, sweet, toasted before grinding', 149, 179, '200g', '#2FA36B', 0, 4.6, 640, 'coriander', { purposes: ['dal', 'sabzi', 'biryani'] }),
  P('jeera-powder', 'Jeera Powder', 'जीरा पाउडर', 'ground', 'Unjha, Gujarat', 'Nutty, warm, smells like a tadka', 169, 199, '100g', '#2BA8E0', 0, 4.7, 755, 'cumin', { purposes: ['dal', 'sabzi'] }),
  P('amchur', 'Amchur Powder', 'आमचूर', 'ground', 'Ratnagiri', 'Sun-dried raw mango, tangy, no sugar', 159, 189, '100g', '#9BC53D', 0, 4.5, 318, 'mango', { purposes: ['sabzi', 'chaat'] }),
  P('hing', 'Hing, Strong', 'हींग', 'ground', 'Hathras', 'Compounded, punchy, one pinch rules', 229, 269, '50g', '#FF8FB1', 1, 4.6, 421, 'hing', { purposes: ['dal'] }),
  P('tellicherry', 'Tellicherry Pepper', 'काली मिर्च', 'whole', 'Wayanad', 'Bold, piney, citrus bite', 349, 399, '100g', '#6B2D8B', 3, 4.9, 1650, 'pepper', { badge: 'Chef pick', purposes: ['biryani', 'tandoori'] }),
  P('green-elaichi', 'Green Cardamom', 'हरी इलायची', 'whole', 'Idukki', 'Floral, eucalyptus, 8mm bold pods', 449, 520, '50g', '#1F8A5B', 0, 4.9, 1976, 'cardamom', { badge: 'Best seller', purposes: ['chai', 'biryani'] }),
  P('badi-elaichi', 'Badi Elaichi', 'बड़ी इलायची', 'whole', 'Sikkim', 'Smoky, camphor, the biryani secret', 329, 379, '50g', '#8A4B2A', 1, 4.6, 402, 'cardamom', { purposes: ['biryani'] }),
  P('jeera-whole', 'Jeera Seeds', 'साबुत जीरा', 'whole', 'Unjha, Gujarat', 'Crackles in ghee within seconds', 189, 219, '100g', '#E8A21A', 0, 4.8, 1120, 'cumin', { purposes: ['dal', 'sabzi'] }),
  P('laung', 'Laung Cloves', 'लौंग', 'whole', 'Kanyakumari', 'Sweet, numbing, full-oil buds', 299, 349, '50g', '#A33A1E', 1, 4.7, 388, 'clove', { purposes: ['chai', 'biryani'] }),
  P('dalchini', 'True Cinnamon', 'दालचीनी', 'whole', 'Kerala', 'Sweet quills, not the cassia kind', 329, 379, '50g', '#D9742B', 0, 4.8, 543, 'cinnamon', { purposes: ['chai', 'biryani'] }),
  P('chakra-phool', 'Star Anise', 'चक्र फूल', 'whole', 'Arunachal', 'Licorice, sweet, whole stars', 279, 329, '50g', '#5B3A8E', 0, 4.5, 214, 'anise', { purposes: ['biryani'] }),
  P('rai', 'Yellow Mustard Seeds', 'राई', 'whole', 'Rajasthan', 'Pops, sputters, nutty finish', 129, 149, '200g', '#D4A017', 1, 4.6, 360, 'seeds', { purposes: ['pickle', 'sabzi'] }),
  P('methi', 'Methi Dana', 'मेथी दाना', 'whole', 'Nagaur', 'Bittersweet, maple-y when toasted', 119, 139, '200g', '#8DB63C', 0, 4.5, 291, 'seeds', { purposes: ['pickle', 'dal'] }),
  P('garam-masala', 'Heirloom Garam Masala', 'गरम मसाला', 'blends', 'House blend', '11 whole spices, slow-roasted', 279, 329, '100g', '#B6491A', 2, 4.9, 3012, 'bowl', { badge: 'Best seller', purposes: ['sabzi', 'dal', 'biryani'] }),
  P('chaat-masala', 'Chaat Masala', 'चाट मसाला', 'blends', 'Delhi-6 style', 'Tangy, funky, a little kala namak', 169, 199, '100g', '#F26B3A', 1, 4.8, 1544, 'bowl', { badge: 'Snack hero', purposes: ['chaat'] }),
  P('biryani-masala', 'Dum Biryani Masala', 'बिरयानी मसाला', 'blends', 'Hyderabad', 'Shahi jeera, mace, kewra whisper', 249, 289, '100g', '#7A1F5C', 2, 4.7, 876, 'bowl', { purposes: ['biryani'] }),
  P('chole-masala', 'Chole Masala', 'छोले मसाला', 'blends', 'Amritsar', 'Anardana, tea-dark colour, dhaba depth', 189, 219, '100g', '#5E3A1B', 2, 4.7, 702, 'bowl', { purposes: ['sabzi'] }),
  P('sambar-powder', 'Sambar Powder', 'सांभर पाउडर', 'blends', 'Tamil Nadu', 'Roasted dals, curry leaf, byadgi', 199, 229, '200g', '#E88A1A', 2, 4.8, 934, 'bowl', { purposes: ['dal'] }),
  P('tandoori-masala', 'Tandoori Masala', 'तंदूरी मसाला', 'blends', 'Punjab', 'Smoky red, dahi-marinade ready', 219, 259, '100g', '#D7263D', 3, 4.7, 611, 'bowl', { purposes: ['tandoori'] }),
  P('pav-bhaji', 'Pav Bhaji Masala', 'पाव भाजी मसाला', 'blends', 'Mumbai', 'Juhu beach in a pouch', 179, 209, '100g', '#FF5E5B', 1, 4.8, 1203, 'bowl', { purposes: ['sabzi'] }),
  P('kadak-chai', 'Kadak Chai Masala', 'चाय मसाला', 'chai', 'Assam + Kerala', 'Ginger, cardamom, black pepper punch', 229, 269, '100g', '#2BA8E0', 1, 4.9, 2188, 'chai', { badge: 'Best seller', purposes: ['chai'] }),
  P('haldi-doodh', 'Haldi Doodh Mix', 'हल्दी दूध', 'chai', 'Meghalaya', 'Golden milk with kesar and pepper', 299, 349, '100g', '#FFB02E', 0, 4.7, 745, 'chai', { purposes: ['chai'] }),
  P('kala-namak', 'Kala Namak', 'काला नमक', 'salts', 'Sambhar Lake', 'Volcanic, eggy, the chaat soul', 99, 119, '200g', '#3D3A5C', 0, 4.8, 877, 'salt', { purposes: ['chaat'] }),
  P('sendha-namak', 'Sendha Namak', 'सेंधा नमक', 'salts', 'Himalayan foothills', 'Rock salt for fasting days and fruit', 119, 139, '500g', '#FF9EB5', 0, 4.6, 402, 'salt', { purposes: ['chaat'] }),
  P('mongra-saffron', 'Mongra Saffron', 'कश्मीरी केसर', 'rare', 'Pampore', 'Grade-1 threads, honey and hay, 1g', 899, 1099, '1g', '#E8501A', 0, 5.0, 986, 'saffron', { badge: 'Rare', purposes: ['chai', 'biryani'] }),
]

export const BUNDLES = [
  { id: 'tadka-kit', name: 'The Tadka Starter Kit', sub: '6 pouches that fix any dal', price: 899, mrp: 1190, color: '#FFC21A', items: ['lakadong-haldi', 'jeera-whole', 'rai', 'hing', 'dhaniya', 'garam-masala'], tag: 'Saves Rs 291' },
  { id: 'biryani-box', name: 'Biryani Night Box', sub: 'Pepper, cardamom, cloves, saffron', price: 1299, mrp: 1590, color: '#6B2D8B', items: ['tellicherry', 'green-elaichi', 'laung', 'mongra-saffron', 'biryani-masala'], tag: 'Dum, not dumb' },
  { id: 'diwali-hamper', name: 'Diwali Dabba Hamper', sub: 'Masala dabba + 7 jars, gift-wrapped', price: 2499, mrp: 3100, color: '#E03A2F', items: ['kashmiri-chilli', 'lakadong-haldi', 'garam-masala', 'kadak-chai', 'green-elaichi', 'mongra-saffron', 'chaat-masala'], tag: 'Gift-ready' },
]

export const PURPOSES = [
  { id: 'dal', label: 'Dal Tadka', color: '#FFC21A' },
  { id: 'biryani', label: 'Biryani', color: '#E03A2F' },
  { id: 'chai', label: 'Chai', color: '#2BA8E0' },
  { id: 'sabzi', label: 'Sabzi', color: '#2FA36B' },
  { id: 'tandoori', label: 'Tandoori', color: '#FF8A6B' },
  { id: 'chaat', label: 'Chaat', color: '#C9C0F0' },
  { id: 'pickle', label: 'Achaar', color: '#F7BFD0' },
]

export const REVIEWS = [
  { t: 'TADKA THAT TALKS', b: 'Opened the cumin and my whole flat smelled like my nani\'s kitchen. My roommate asked what I was cooking. I was not cooking yet.', n: 'Ananya R.', c: 'Pune', p: 'Jeera Seeds' },
  { t: 'FINALLY, RED THAT IS RED', b: 'Kashmiri chilli colours the gravy without turning it into a fire drill. Butter chicken got compliments from my in-laws. Rare.', n: 'Karthik S.', c: 'Bengaluru', p: 'Kashmiri Chilli' },
  { t: 'CHAI SNOB APPROVED', b: 'I am insufferable about chai. This masala has real ginger bite and cardamom that stays. Ordered three more.', n: 'Mehul P.', c: 'Ahmedabad', p: 'Kadak Chai Masala' },
  { t: 'THE POUCH IS CUTE?!', b: 'Came for the spices, stayed because the packaging is gorgeous and the zip actually closes. Garam masala is next level.', n: 'Simran K.', c: 'Delhi', p: 'Garam Masala' },
  { t: 'SAFFRON, NOT SAWDUST', b: 'Bloomed in warm milk and the whole cup turned gold in a minute. 1g is small but wow, a little goes ages.', n: 'Dr. Iyer', c: 'Chennai', p: 'Mongra Saffron' },
  { t: 'GUNTUR = GUNTUR', b: 'Warned my family. They did not listen. We all had lassi. 10/10 would suffer again.', n: 'Ravi T.', c: 'Hyderabad', p: 'Guntur Fire Chilli' },
]

export const ORIGINS = [
  { n: '01', place: 'Wayanad, Kerala', spice: 'Black pepper', fact: 'Picked at 3am, before the sun gets opinions.', color: '#6B2D8B' },
  { n: '02', place: 'Guntur, Andhra', spice: 'Chillies', fact: 'Dried on rooftops until they rattle.', color: '#E03A2F' },
  { n: '03', place: 'Lakadong, Meghalaya', spice: 'Turmeric', fact: 'A tribal co-op, 7-9% curcumin, no dye.', color: '#FFC21A' },
  { n: '04', place: 'Pampore, Kashmir', spice: 'Saffron', fact: 'Each thread picked by hand at dawn.', color: '#E8501A' },
  { n: '05', place: 'Idukki, Kerala', spice: 'Cardamom', fact: 'Hand-sorted by pod size. Yes, really.', color: '#2FA36B' },
]

export const rupee = (n) => '₹' + n.toLocaleString('en-IN')

// readable text colour on a hex background
export function inkOn(hex) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#1A1208' : '#FFF8EA'
}

export const NEW_IDS = ['amchur', 'haldi-doodh', 'sendha-namak', 'pav-bhaji', 'sambar-powder']
export const LOW_IDS = ['mongra-saffron', 'badi-elaichi', 'chakra-phool']
products.forEach((p, i) => { p.isNew = NEW_IDS.includes(p.id); p.low = LOW_IDS.includes(p.id); p.order = i })

export const grams = (p) => parseInt(p.weight, 10)
export const sizeLabel = (g) => (g >= 1000 ? g / 1000 + 'kg' : g + 'g')
export function sizesOf(p) {
  const g = grams(p)
  const list = g <= 5 ? [g, g * 2, g * 5] : g === 50 ? [50, 100, 250] : g === 100 ? [50, 100, 250] : g === 200 ? [100, 200, 500] : [250, 500, 1000]
  return list
}
export function priceFor(p, g) {
  if (p.magicPrices) {
    const price = p.magicPrices[g]
    return { price, mrp: price, off: 0 }
  }
  const f = Math.pow(g / grams(p), 0.88)
  const price = Math.round(p.price * f)
  const mrp = Math.round(p.mrp * f)
  return { price, mrp, off: Math.round((1 - price / mrp) * 100) }
}
export const bySlug = Object.fromEntries([...products, ...magicProducts].map((p) => [p.id, p]))
export const desc = (p) => `${p.notes}. Sourced from ${p.origin}, small-batch ${p.cat === 'whole' ? 'cleaned and sorted' : 'stone-ground'} and sealed in a zip pouch within days. No fillers, no colour, no preservatives, ever.`
export const COUPONS = { FIRST10: { pct: 10, label: '10% off your first order' }, POKE10: { pct: 10, label: '10% off, because you poked the pouches' }, MASALA50: { flat: 50, label: 'Flat Rs 50 off', min: 799 } }
