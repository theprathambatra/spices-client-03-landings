// One constant to rename the whole brand.
export const BRAND = 'Kesari'
export const FREE_SHIP = 499
export const SHIP_FEE = 49

// kind: category. tint = card colour (label colour), fill = spice colour inside jars.
export const products = [
  { id: 'haldi', name: 'Lakadong Haldi', hi: 'Haldi', cat: 'Ground', price: 299, mrp: 399, weight: '100g', tint: '#F6E094', fill: '#E0A210', origin: 'Meghalaya', notes: '7–9% curcumin · earthy · bright', heat: 0, badge: 'Bestseller' },
  { id: 'kashmiri-mirch', name: 'Kashmiri Mirch', hi: 'Lal Mirch', cat: 'Ground', price: 249, mrp: 329, weight: '100g', tint: '#F2D0DA', fill: '#A82218', origin: 'Kashmir', notes: 'Deep red · gentle heat · no dye', heat: 2, badge: 'Bestseller' },
  { id: 'teja-mirch', name: 'Guntur Teja Mirch', hi: 'Teekhi Mirch', cat: 'Ground', price: 199, mrp: 259, weight: '100g', tint: '#F4C9B8', fill: '#C8321A', origin: 'Andhra Pradesh', notes: 'Proper fire · for the brave', heat: 5, badge: 'Fire' },
  { id: 'jeera', name: 'Rajasthani Jeera', hi: 'Jeera', cat: 'Whole', price: 199, mrp: 269, weight: '100g', tint: '#E8DAC4', fill: '#8A6A3B', origin: 'Unjha, Gujarat', notes: 'Nutty · warm · tadka-ready', heat: 0 },
  { id: 'kali-mirch', name: 'Tellicherry Pepper', hi: 'Kali Mirch', cat: 'Whole', price: 349, mrp: 449, weight: '100g', tint: '#D4DCE4', fill: '#2B2420', origin: 'Wayanad, Kerala', notes: 'Bold · citrusy · piney', heat: 3 },
  { id: 'elaichi', name: 'Alleppey Elaichi', hi: 'Elaichi', cat: 'Whole', price: 449, mrp: 599, weight: '50g', tint: '#E0EAC0', fill: '#7A9A3A', origin: 'Idukki, Kerala', notes: 'Floral · eucalyptus · sweet', heat: 0, badge: 'Chai fave' },
  { id: 'kesar', name: 'Mongra Kesar', hi: 'Kesar', cat: 'Whole', price: 899, mrp: 1199, weight: '1g', tint: '#F6D6B8', fill: '#C8461E', origin: 'Pampore, Kashmir', notes: 'Honeyed · hay-like · intense', heat: 0, badge: 'Heirloom' },
  { id: 'garam-masala', name: 'Heirloom Garam Masala', hi: 'Garam Masala', cat: 'Blends', price: 279, mrp: 369, weight: '100g', tint: '#EBD2BE', fill: '#5E3219', origin: 'House blend', notes: '11 whole spices · slow roasted', heat: 2, badge: 'Bestseller' },
  { id: 'dhania', name: 'Kota Dhania', hi: 'Dhania', cat: 'Ground', price: 149, mrp: 199, weight: '200g', tint: '#E9E3BD', fill: '#B8A055', origin: 'Kota, Rajasthan', notes: 'Citrus · sweet · green-gold', heat: 0 },
  { id: 'rai', name: 'Bikaner Rai', hi: 'Rai', cat: 'Whole', price: 119, mrp: 159, weight: '200g', tint: '#E8DAC4', fill: '#3A281A', origin: 'Bikaner', notes: 'Sharp · pops in hot oil', heat: 2 },
  { id: 'dalchini', name: 'Malabar Dalchini', hi: 'Dalchini', cat: 'Whole', price: 329, mrp: 429, weight: '50g', tint: '#EBD2BE', fill: '#A0522D', origin: 'Kerala', notes: 'Sweet · woody · true cassia', heat: 0 },
  { id: 'laung', name: 'Kanyakumari Laung', hi: 'Laung', cat: 'Whole', price: 299, mrp: 399, weight: '50g', tint: '#E8D0C4', fill: '#4A2A1A', origin: 'Kanyakumari', notes: 'Numbing · sweet · warming', heat: 1 },
  { id: 'hing', name: 'Hathras Hing', hi: 'Hing', cat: 'Ground', price: 249, mrp: 329, weight: '50g', tint: '#F4EBC0', fill: '#CDB57A', origin: 'Hathras, UP', notes: 'Pungent · blooms into onion-garlic', heat: 1 },
  { id: 'kasuri-methi', name: 'Nagaur Kasuri Methi', hi: 'Kasuri Methi', cat: 'Whole', price: 129, mrp: 179, weight: '50g', tint: '#DCE4CC', fill: '#6B8A3A', origin: 'Nagaur', notes: 'Bittersweet · crush over butter chicken', heat: 0 },
  { id: 'ajwain', name: 'Ajwain', hi: 'Ajwain', cat: 'Whole', price: 129, mrp: 169, weight: '100g', tint: '#E8DAC4', fill: '#A08A55', origin: 'Rajasthan', notes: 'Thyme-ish · digestive · parathas', heat: 1 },
  { id: 'saunf', name: 'Lucknowi Saunf', hi: 'Saunf', cat: 'Whole', price: 149, mrp: 199, weight: '100g', tint: '#DCE4CC', fill: '#98A55A', origin: 'Gujarat', notes: 'Sweet · cooling · mukhwas', heat: 0 },
  { id: 'chai-masala', name: 'Adrak Chai Masala', hi: 'Chai Masala', cat: 'Blends', price: 249, mrp: 329, weight: '100g', tint: '#F0D8BA', fill: '#8A5A2E', origin: 'House blend', notes: 'Ginger · cardamom · clove', heat: 1, badge: 'Bestseller' },
  { id: 'kitchen-king', name: 'Kitchen King Masala', hi: 'Sabzi ka Raja', cat: 'Blends', price: 229, mrp: 299, weight: '100g', tint: '#F4C9B8', fill: '#B3541E', origin: 'House blend', notes: 'Every sabzi, sorted', heat: 2 },
  { id: 'chana-masala', name: 'Chana Masala', hi: 'Chole Masala', cat: 'Blends', price: 219, mrp: 289, weight: '100g', tint: '#EBD2BE', fill: '#7A3A1A', origin: 'House blend', notes: 'Amchur · anardana · dark roast', heat: 2 },
  { id: 'pav-bhaji', name: 'Pav Bhaji Masala', hi: 'Pav Bhaji', cat: 'Blends', price: 219, mrp: 289, weight: '100g', tint: '#F2D0DA', fill: '#A82A1A', origin: 'Mumbai blend', notes: 'Butter-ready · Juhu-style', heat: 2 },
  { id: 'sambar', name: 'Sambar Masala', hi: 'Sambar', cat: 'Blends', price: 229, mrp: 299, weight: '100g', tint: '#F6E094', fill: '#C9822A', origin: 'Tamil Nadu', notes: 'Toor-dal best friend', heat: 2 },
  { id: 'biryani', name: 'Biryani Masala', hi: 'Biryani', cat: 'Blends', price: 269, mrp: 349, weight: '100g', tint: '#EBD2BE', fill: '#7A4A2A', origin: 'Hyderabad blend', notes: 'Dum-ready · mace & kewra', heat: 2 },
  { id: 'kala-namak', name: 'Kala Namak', hi: 'Kala Namak', cat: 'Ground', price: 129, mrp: 169, weight: '200g', tint: '#D4DCE4', fill: '#5A3A4A', origin: 'Sambhar Lake', notes: 'Eggy · funky · chaat essential', heat: 0 },
  { id: 'sendha', name: 'Sendha Namak', hi: 'Sendha Namak', cat: 'Ground', price: 149, mrp: 199, weight: '500g', tint: '#F2D0DA', fill: '#E3B8B0', origin: 'Himalayan', notes: 'Rock salt · vrat-friendly', heat: 0 },
  { id: 'chaat', name: 'Chatpata Chaat Masala', hi: 'Chaat Masala', cat: 'Blends', price: 199, mrp: 259, weight: '100g', tint: '#DCE4CC', fill: '#B58A3A', origin: 'House blend', notes: 'Tangy · salty · on everything', heat: 1 },
  { id: 'assam-chai', name: 'Assam CTC Chai', hi: 'Chai Patti', cat: 'Whole', price: 349, mrp: 449, weight: '250g', tint: '#E0EAC0', fill: '#5A2A14', origin: 'Dibrugarh, Assam', notes: 'Malty · strong · dudh-wali chai', heat: 0 },
]
export const hampers = [
  { id: 'hamper-diwali', name: 'The Diwali Dabba', hi: 'Diwali', cat: 'Gift', price: 1799, mrp: 2399, weight: '7 tins', tint: '#F6E094', fill: '#E0A210', notes: 'Steel dabba · 7 spices · kesar · a handwritten card' },
  { id: 'hamper-shaadi', name: 'Shaadi Trousseau Set', hi: 'Shaadi', cat: 'Gift', price: 3499, mrp: 4499, weight: '14 tins', tint: '#F2D0DA', fill: '#A82218', notes: 'For the new kitchen · two dabbas · recipe book' },
  { id: 'hamper-office', name: 'Corporate Chai Crate', hi: 'Daftar', cat: 'Gift', price: 899, mrp: 1199, weight: '3 tins', tint: '#E0EAC0', fill: '#5A2A14', notes: 'Bulk-friendly · logo card · pan-India' },
]

// ---- combos (priced below the sum of their jars)
const mk = (id, name, hi, items, price, tint, fill, notes, badge) => {
  const mrp = items.reduce((a, k) => a + products.find((p) => p.id === k).price, 0)
  return { id, name, hi, cat: 'Combos', price, mrp, weight: `Set of ${items.length}`, tint, fill, origin: 'Curated set', notes, heat: 0, badge, items, combo: true }
}
export const combos = [
  mk('combo-tadka', 'Tadka Starter Kit', 'Tadka', ['jeera', 'rai', 'hing', 'haldi', 'kashmiri-mirch'], 849, '#F6E094', '#E0A210', 'Five jars for the perfect first tadka', 'Save big'),
  mk('combo-biryani', 'Biryani Night Box', 'Dum Biryani', ['biryani', 'elaichi', 'dalchini', 'laung'], 999, '#EBD2BE', '#7A4A2A', 'Mace, kewra-ready, dum-ready', 'New'),
  mk('combo-chai', 'Chai Wali Combo', 'Cutting Chai', ['chai-masala', 'assam-chai', 'elaichi'], 899, '#E0EAC0', '#5A2A14', 'Strong, malty, dudh-wali', 'Bestseller'),
  mk('combo-roz', 'Roz Ka Khana Combo', 'Roz ka Khana', ['haldi', 'kashmiri-mirch', 'dhania', 'jeera', 'garam-masala'], 899, '#F2D0DA', '#A82218', 'The five jars every kitchen runs on', 'Bestseller'),
]
export const catalogue = [...products, ...combos]
export const byId = Object.fromEntries([...catalogue, ...hampers].map((p) => [p.id, p]))
const NEW = new Set(['biryani', 'kasuri-methi', 'sambar', 'combo-biryani', 'assam-chai'])
const LOW = new Set(['kesar', 'laung', 'hing'])
const PREMIUM = new Set(['kesar', 'elaichi', 'kali-mirch', 'haldi', 'hing', 'dalchini', 'laung'])
catalogue.forEach((p, i) => {
  p.rating = Math.round((4.3 + ((i * 5) % 7) / 10) * 10) / 10
  p.reviews = 140 + ((i * 371) % 2600)
  p.isNew = NEW.has(p.id); p.low = LOW.has(p.id); p.premium = PREMIUM.has(p.id)
  p.pop = (catalogue.length - i) + (p.badge === 'Bestseller' ? 40 : 0)
  p.desc = p.combo ? `${p.notes}. Everything arrives in resealable tins, dated and ground fresh.` : `Small-batch ${p.name.toLowerCase()} from ${p.origin}, stone-ground and sealed the same week. ${p.notes}. Packed in a resealable, light-proof tin with the batch date on the label.`
})
export const categories = ['All', 'Whole', 'Ground', 'Blends', 'Premium', 'Combos']
export const inCat = (p, c) => c === 'All' ? true : c === 'Premium' ? p.premium : p.cat === c

const SIZE_TABLE = { 1: [1, 2], 50: [50, 100, 250], 100: [50, 100, 250], 200: [100, 200, 500], 250: [100, 250, 500], 500: [250, 500, 1000] }
export function getSizes(p) {
  if (p.combo || p.cat === 'Gift') return [{ label: p.weight, price: p.price, mrp: p.mrp }]
  const base = parseInt(p.weight, 10)
  return (SIZE_TABLE[base] || [base]).map((w) => {
    const r = w / base, f = Math.pow(r, 0.88)
    return { label: (w >= 1000 ? w / 1000 + 'kg' : w + 'g'), price: Math.round((p.price * f) / 1) , mrp: Math.round(p.mrp * f) }
  })
}
export const defaultSize = (p) => getSizes(p).find((s) => s.label === p.weight) || getSizes(p)[0]
export const COUPONS = { FIRST10: { pct: 10, label: '10% off your first order' }, DABBA50: { flat: 50, label: '₹50 off' } }


// the seven katoris of the dabba (ring order + centre last)
export const SPICES = [
  { key: 'haldi', pid: 'haldi', en: 'Turmeric', hi: 'haldi', dev: 'हल्दी', head: ['TURMERIC', 'haldi.'], line: 'Lakadong gold from the hills of Meghalaya. 7–9% curcumin, and it stains everything it loves.', where: 'Meghalaya' },
  { key: 'mirch', pid: 'kashmiri-mirch', en: 'Chilli', hi: 'mirch', dev: 'मिर्च', head: ['KASHMIRI', 'mirch.'], line: 'All the colour, a third of the heat. Sun-dried in Kashmir, never dyed, never apologetic.', where: 'Kashmir' },
  { key: 'jeera', pid: 'jeera', en: 'Cumin', hi: 'jeera', dev: 'जीरा', head: ['CUMIN', 'jeera.'], line: 'The first thing into hot ghee. Nutty, warm, and loud enough to wake the whole building.', where: 'Unjha' },
  { key: 'rai', pid: 'rai', en: 'Mustard', hi: 'rai', dev: 'राई', head: ['MUSTARD', 'rai.'], line: 'Tiny, sharp and dramatic. Listen for the pop — that is the sound of tadka starting.', where: 'Bikaner' },
  { key: 'dhania', pid: 'dhania', en: 'Coriander', hi: 'dhania', dev: 'धनिया', head: ['CORIANDER', 'dhania.'], line: 'Roasted whole, ground the same morning. Citrus, sweetness, and the backbone of every curry.', where: 'Kota' },
  { key: 'garam', pid: 'garam-masala', en: 'Garam Masala', hi: 'masala', dev: 'गरम मसाला', head: ['GARAM', 'masala.'], line: 'Eleven whole spices, slow-roasted till the kitchen smells like a wedding. Add at the very end.', where: 'House blend' },
  { key: 'kesar', pid: 'kesar', en: 'Saffron', hi: 'kesar', dev: 'केसर', head: ['SAFFRON', 'kesar.'], line: 'Mongra threads, hand-picked at dawn in Pampore. A pinch in warm milk, and it is Diwali.', where: 'Pampore' },
]
export const HINDI_NAMES = ['Haldi', 'Jeera', 'Mirch', 'Elaichi', 'Laung', 'Dalchini', 'Kesar', 'Hing', 'Rai', 'Dhania', 'Saunf', 'Ajwain']
export const inr = (n) => '₹' + n.toLocaleString('en-IN')
