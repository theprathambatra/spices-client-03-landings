// Single constant to rename the brand
export const BRAND = 'Kesari'
export const FREE_SHIP = 499
export const SHIP_FEE = 49

export const CATS = ['All', 'Rare', 'Ground', 'Whole', 'Blends', 'Finishing']

// Hero six: the Gold Tin sequence. Each SKU owns a colour (accent + plume).
export const heroSkus = [
  {
    id: 'mongra-saffron', name: 'Mongra Saffron', native: 'कश्मीरी केसर', price: 899, mrp: 1100, weight: '1g',
    aroma: 'Hay, honey, a little iodine', heat: 0, heatLabel: 'None. It warms, never burns.',
    origin: 'Pampore, Kashmir', pairing: 'Kheer, shahi tukda, a very patient biryani',
    line: 'Three red threads from each crocus, picked before sunrise.',
    accent: '#E8862A', a: '#E2400F', b: '#FFB347', spice: '#B3270E',
  },
  {
    id: 'lakadong-turmeric', name: 'Lakadong Turmeric', native: 'लाकाडोंग हल्दी', price: 299, mrp: 360, weight: '100g',
    aroma: 'Warm earth, fresh ginger, dry rain', heat: 1, heatLabel: 'A whisper. Mostly colour.',
    origin: 'Jaintia Hills, Meghalaya', pairing: 'Golden milk, dal tadka, fish in mustard',
    line: '7 to 9 percent curcumin. Your dal will not know what hit it.',
    accent: '#E3A21A', a: '#F2A900', b: '#FFE08A', spice: '#C98A0E',
  },
  {
    id: 'kashmiri-chilli', name: 'Kashmiri Chilli', native: 'कश्मीरी मिर्च', price: 249, mrp: 290, weight: '100g',
    aroma: 'Smoke, dried cherry, warm leather', heat: 2, heatLabel: 'Gentle. All glow, little fire.',
    origin: 'Kashmir valley, via Guntur drying yards', pairing: 'Rogan josh, tandoori marinades, butter chicken',
    line: 'The colour of a good sunset, the temper of a good host.',
    accent: '#D8432F', a: '#B3261E', b: '#FF6A47', spice: '#9C1D14',
  },
  {
    id: 'tellicherry-pepper', name: 'Tellicherry Pepper', native: 'तेलिचेरी काली मिर्च', price: 349, mrp: 400, weight: '100g',
    aroma: 'Citrus peel, pine resin, hot stone', heat: 4, heatLabel: 'Bright, then a long slow hum.',
    origin: 'Wayanad, Kerala', pairing: 'Fresh eggs, aged cheese, a good steak',
    line: 'Only the biggest 4.25mm berries make the cut.',
    accent: '#B8AD9A', a: '#8C8174', b: '#EFE6D4', spice: '#2a221c',
  },
  {
    id: 'green-cardamom', name: 'Green Cardamom', native: 'हरी इलायची', price: 449, mrp: 520, weight: '50g',
    aroma: 'Eucalyptus, rose, clean snow', heat: 0, heatLabel: 'Cool. Almost mentholated.',
    origin: 'Idukki, Kerala', pairing: 'Chai, phirni, anything with cream',
    line: 'Hand-picked, shade-dried, still green. Crack one. Breathe.',
    accent: '#8FB35A', a: '#7FA64A', b: '#DDEBA8', spice: '#5a7a2e',
  },
  {
    id: 'heirloom-garam-masala', name: 'Heirloom Garam Masala', native: 'गरम मसाला', price: 279, mrp: 330, weight: '100g',
    aroma: 'Toasted cumin, clove, black cardamom smoke', heat: 3, heatLabel: 'A slow, generous warmth.',
    origin: 'Blended in Kodagu, Karnataka', pairing: 'Rajma, keema, the last two minutes of any curry',
    line: 'Eleven whole spices, roasted on a wood fire, ground once.',
    accent: '#C9773A', a: '#8A4B1E', b: '#F0A862', spice: '#6B3A1E',
  },
]

const p = (id, name, native, cat, origin, notes, heat, price, mrp, weight, rating, reviews, color, tag) => ({
  id, name, native, cat, origin, notes, heat, price, mrp, weight, rating, reviews, color, tag,
})

export const products = [
  p('mongra-saffron', 'Mongra Saffron', 'केसर', 'Rare', 'Pampore, Kashmir', 'Honeyed, hay-like, intense', 0, 899, 1100, '1g', 4.9, 412, '#E2400F', 'Grade I'),
  p('lakadong-turmeric', 'Lakadong Turmeric', 'हल्दी', 'Ground', 'Jaintia Hills, Meghalaya', '7 to 9% curcumin, earthy, bright', 1, 299, 360, '100g', 4.8, 903, '#F2A900', 'Bestseller'),
  p('kashmiri-chilli', 'Kashmiri Chilli', 'कश्मीरी मिर्च', 'Ground', 'Kashmir valley', 'Smoky, mild heat, deep red', 2, 249, 290, '100g', 4.8, 1270, '#B3261E', 'Bestseller'),
  p('tellicherry-pepper', 'Tellicherry Pepper', 'काली मिर्च', 'Whole', 'Wayanad, Kerala', 'Bold, citrusy, piney', 4, 349, 400, '100g', 4.9, 688, '#8C8174', ''),
  p('green-cardamom', 'Green Cardamom', 'हरी इलायची', 'Whole', 'Idukki, Kerala', 'Floral, eucalyptus, sweet', 0, 449, 520, '50g', 4.9, 755, '#7FA64A', 'Bestseller'),
  p('heirloom-garam-masala', 'Heirloom Garam Masala', 'गरम मसाला', 'Blends', 'Kodagu, Karnataka', '11 whole spices, wood-fire roasted', 3, 279, 330, '100g', 4.9, 1104, '#8A4B1E', 'Signature'),
  p('rajasthani-cumin', 'Rajasthani Cumin', 'जीरा', 'Whole', 'Jodhpur, Rajasthan', 'Nutty, warm, toasty', 1, 199, 240, '100g', 4.7, 521, '#8A6A3B', ''),
  p('ceylon-cinnamon', 'True Cinnamon', 'दालचीनी', 'Whole', 'Kozhikode, Kerala', 'Sweet, papery, citrus', 0, 329, 380, '50g', 4.7, 302, '#A0522D', ''),
  p('black-cardamom', 'Smoked Black Cardamom', 'बड़ी इलायची', 'Whole', 'Sikkim', 'Campfire, camphor, resin', 1, 389, 450, '50g', 4.8, 244, '#4a2e1c', 'Small lot'),
  p('clove', 'Wayanad Cloves', 'लौंग', 'Whole', 'Wayanad, Kerala', 'Numbing, sweet, peppery', 3, 299, 350, '50g', 4.7, 276, '#5a3622', ''),
  p('star-anise', 'Star Anise', 'चक्र फूल', 'Whole', 'Arunachal Pradesh', 'Liquorice, warm, perfumed', 1, 279, 320, '50g', 4.6, 188, '#6b3a1e', ''),
  p('nutmeg-mace', 'Nutmeg and Mace', 'जायफल', 'Whole', 'Kottayam, Kerala', 'Woody, sweet, faintly boozy', 1, 359, 410, '40g', 4.8, 201, '#8a5a3a', ''),
  p('coriander', 'Rajasthan Coriander', 'धनिया', 'Ground', 'Kota, Rajasthan', 'Lemony, sweet, floral', 0, 169, 199, '100g', 4.6, 612, '#9a8a3a', ''),
  p('amchur', 'Amchur', 'अमचूर', 'Ground', 'Ratnagiri, Maharashtra', 'Tart, fruity, sun-dried mango', 0, 189, 220, '100g', 4.7, 233, '#b98a3a', ''),
  p('hing', 'Hing, Compounded', 'हींग', 'Ground', 'Hathras, Uttar Pradesh', 'Savoury, sulphurous, then sweet', 1, 329, 380, '25g', 4.8, 347, '#c9a24b', 'Small lot'),
  p('kala-namak', 'Kala Namak', 'काला नमक', 'Finishing', 'Sambhar Lake, Rajasthan', 'Eggy, mineral, funky', 0, 149, 180, '150g', 4.6, 409, '#4d3b4a', ''),
  p('kashmiri-flakes', 'Smoked Chilli Flakes', 'चिली फ्लेक्स', 'Finishing', 'Guntur, Andhra Pradesh', 'Smoky, bright, slow burn', 3, 229, 270, '75g', 4.7, 318, '#a02818', ''),
  p('guntur-sannam', 'Guntur Sannam', 'गुंटूर मिर्च', 'Ground', 'Guntur, Andhra Pradesh', 'Sharp, fruity, proper fire', 5, 219, 260, '100g', 4.8, 540, '#c4301a', 'Fierce'),
  p('chaat-masala', 'Chaat Masala', 'चाट मसाला', 'Blends', 'Delhi blend', 'Tangy, salty, black-salt funk', 1, 199, 240, '100g', 4.8, 701, '#b8742a', ''),
  p('chai-masala', 'Chai Masala', 'चाय मसाला', 'Blends', 'Darjeeling blend', 'Ginger, cardamom, a little clove', 1, 249, 290, '100g', 4.9, 866, '#9c6a3a', 'Winter'),
  p('biryani-masala', 'Hyderabadi Biryani Masala', 'बिरयानी मसाला', 'Blends', 'Hyderabad blend', 'Floral, deep, kewra-kissed', 2, 269, 310, '100g', 4.8, 433, '#7a4a2a', ''),
  p('sambar-powder', 'Sambar Powder', 'सांभर पाउडर', 'Blends', 'Udupi blend', 'Roasted dal, curry leaf, tamarind', 2, 229, 270, '200g', 4.7, 388, '#a8641e', ''),
  p('fennel', 'Lucknowi Fennel', 'सौंफ', 'Whole', 'Lucknow, Uttar Pradesh', 'Candied, anise, green', 0, 179, 210, '100g', 4.6, 197, '#8fa05a', ''),
  p('kalonji', 'Kalonji', 'कलौंजी', 'Whole', 'Madhya Pradesh', 'Oniony, bitter, peppery', 1, 169, 199, '100g', 4.6, 156, '#1d1814', ''),
  p('fenugreek', 'Methi Seeds', 'मेथी', 'Whole', 'Nagaur, Rajasthan', 'Bittersweet, maple, burnt sugar', 1, 149, 180, '100g', 4.6, 211, '#b08a2a', ''),
  p('ajwain', 'Ajwain', 'अजवाइन', 'Whole', 'Neemuch, Madhya Pradesh', 'Thymol, sharp, medicinal-warm', 2, 159, 190, '100g', 4.6, 142, '#8a7a4a', ''),
]

export const origins = [
  { id: 'alleppey', place: 'Alleppey', state: 'Kerala', lon: 76.33, lat: 9.5, spice: 'Green cardamom, cinnamon', note: 'Backwater estates where the air is wet enough to taste. Pods dried in shade for twelve days.', elev: '1,100 m' },
  { id: 'guntur', place: 'Guntur', state: 'Andhra Pradesh', lon: 80.45, lat: 16.3, spice: 'Sannam and Teja chillies', note: 'Red fields as far as you can see, dried on the road itself. Loud, honest, correct.', elev: '33 m' },
  { id: 'pampore', place: 'Pampore', state: 'Kashmir', lon: 74.93, lat: 34.0, spice: 'Mongra saffron', note: 'A plateau of crocus, picked in the blue hour of late October. 160,000 flowers to a kilo.', elev: '1,600 m' },
  { id: 'lakadong', place: 'Lakadong', state: 'Meghalaya', lon: 92.1, lat: 25.3, spice: 'High-curcumin turmeric', note: 'Jaintia Hills turmeric that stains the soil orange. Women-run cooperatives, since 1998.', elev: '1,050 m' },
  { id: 'kodagu', place: 'Kodagu', state: 'Karnataka', lon: 75.74, lat: 12.42, spice: 'Pepper, cloves, garam masala', note: 'Coffee-shaded forest gardens. Where the heirloom blend is roasted on a wood fire.', elev: '1,170 m' },
]

export const chapters = [
  { n: 'I', t: 'Harvest', d: 'Dawn, and only dawn. Saffron closes up in the sun, so the pickers are in the field before it is warm. Each flower gives three threads. Each thread is lifted by a thumb and a finger.', meta: 'Pampore · October · 4:40 am' },
  { n: 'II', t: 'Sun-dry', d: 'No tunnels, no dryers that lie. Turmeric rests on clean cloth, chilli on the roof, cardamom in shade. Moisture is measured, then measured again.', meta: 'Meghalaya · 9 to 12 days' },
  { n: 'III', t: 'Stone-grind', d: 'Slow granite chakki, cool enough to keep the oils in. We grind small, we grind to order, and the mill is washed between every spice.', meta: 'Kodagu · 38 degrees at the stone' },
  { n: 'IV', t: 'Seal', d: 'Nitrogen-flushed, packed in lacquered tins with a wax seal, stamped with the harvest date and the name of the lot. It will smell like itself for two years.', meta: 'Lot-coded · lab tested · FSSAI' },
]

export const voices = [
  { q: 'I have cooked with Kashmiri saffron for twenty years. This is the first Indian saffron I would put in front of a Persian guest without apologising.', who: 'Chef Anahita Dastur', role: 'Head chef, Tarini, Mumbai' },
  { q: 'The Lakadong turmeric changed the colour of my dal and, I suspect, my mood. The tin alone makes the shelf look like a jeweller’s.', who: 'Rohan Mathur', role: 'Food writer, Condé Nast Traveller India' },
  { q: 'A spice company that talks about harvest dates the way wineries talk about vintages. Finally.', who: 'The Gourmet Review', role: 'Best new pantry, 2026' },
]

export const reviews = [
  { n: 'Meenakshi R.', city: 'Chennai', stars: 5, t: 'Opened the cardamom and my whole flat smelled like a Kerala morning. Husband asked if I had started baking.', sku: 'Green Cardamom' },
  { n: 'Arjun K.', city: 'Bengaluru', stars: 5, t: 'The garam masala is the first one that does not taste of dust. Used it on rajma and was forgiven for three previous cooking crimes.', sku: 'Heirloom Garam Masala' },
  { n: 'Fatima S.', city: 'Hyderabad', stars: 5, t: 'Gifted the vault to my mother. She has already hidden it from my aunt.', sku: 'The Vault of Six' },
]

export const vaultSlots = heroSkus.map((s) => ({ id: s.id, name: s.name, color: s.accent, price: s.price }))

products.find((x) => x.id === 'hing').stock = 6
products.find((x) => x.id === 'black-cardamom').stock = 9
