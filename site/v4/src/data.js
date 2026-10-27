export const BRAND = 'Kesari'
export const BRAND_HI = 'केसरी'

// cat: whole | ground | blend | salt | rare
export const CATS = [
  { id: 'all', label: 'All spices' },
  { id: 'whole', label: 'Whole spices' },
  { id: 'ground', label: 'Ground' },
  { id: 'blend', label: 'Masala blends' },
  { id: 'salt', label: 'Salts & seeds' },
  { id: 'rare', label: 'Rare harvests' },
]

const P = (id, name, hi, cat, origin, notes, story, price, mrp, weight, color, heat, rating, reviews, extra = {}) => ({
  id, name, hi, cat, origin, notes, story, price, mrp, weight, color, heat, rating, reviews, ...extra,
})

export const products = [
  P('kashmiri-chilli', 'Kashmiri Chilli', 'कश्मीरी मिर्च', 'ground', 'Kashmir', 'Smoky, mild heat, ruby colour', 'The reason your rogan josh blushes.', 249, 299, '100g', '#B3261E', 2, 4.8, 1284, { best: true }),
  P('lakadong-turmeric', 'Lakadong Turmeric', 'लकाडोंग हल्दी', 'ground', 'Meghalaya', '7–9% curcumin, earthy, bright', 'Grown in Jaintia hills, dried on bamboo mats.', 299, 349, '100g', '#E3A21A', 1, 4.9, 2310, { best: true }),
  P('tellicherry-pepper', 'Tellicherry Pepper', 'तेलीचेरी काली मिर्च', 'whole', 'Kerala', 'Bold, citrusy, piney', 'The biggest berries on the vine. Sorted by hand.', 349, 399, '100g', '#2B2420', 3, 4.8, 982, { best: true }),
  P('green-cardamom', 'Green Cardamom', 'हरी इलायची', 'whole', 'Idukki', 'Floral, eucalyptus, sweet', '8mm+ pods. Your chai will ask who sent you.', 449, 520, '50g', '#7A9A3A', 1, 4.9, 1730, { best: true }),
  P('mongra-saffron', 'Mongra Saffron', 'मोंगरा केसर', 'rare', 'Pampore', 'Honeyed, hay-like, intense', 'Grade-1 stigmas, picked at dawn in October.', 899, 1099, '1g', '#C8461E', 0, 4.9, 640, { best: true }),
  P('garam-masala', 'Heirloom Garam Masala', 'गरम मसाला', 'blend', 'House blend', '11 whole spices, slow roasted', 'Dadi’s ratio, our roasting drum.', 279, 329, '100g', '#6B3A1E', 3, 4.9, 3012, { best: true }),
  P('cumin', 'Rajasthani Cumin', 'जीरा', 'whole', 'Rajasthan', 'Nutty, warm, toasty', 'Harvested in Marwar before the dust storms.', 199, 229, '100g', '#8A6A3B', 1, 4.7, 870),
  P('ceylon-cinnamon', 'True Cinnamon', 'दालचीनी', 'whole', 'Kerala', 'Sweet, delicate, citrus', 'Paper-thin quills, not the cassia kind.', 329, 379, '50g', '#A0522D', 1, 4.7, 455),
  P('coriander', 'Sun-dried Coriander', 'धनिया', 'ground', 'Kota', 'Citrusy, light, green', 'Ground cold so the oils stay in.', 169, 199, '200g', '#B59A4A', 0, 4.6, 612),
  P('black-cardamom', 'Smoked Black Cardamom', 'बड़ी इलायची', 'whole', 'Sikkim', 'Campfire, camphor, deep', 'Dried over wood fires in the Himalayas.', 379, 429, '50g', '#4A2E22', 1, 4.8, 318),
  P('king-chilli', 'Bhut Jolokia Flakes', 'भूत जोलोकिया', 'ground', 'Nagaland', 'Fruity first, then fire', 'Warning label included, bravery not.', 399, 449, '50g', '#8E1B10', 5, 4.6, 207),
  P('guntur-chilli', 'Guntur Sannam Chilli', 'गुंटूर मिर्च', 'ground', 'Andhra Pradesh', 'Sharp, bright, clean heat', 'Thin-skinned and proud of it.', 219, 259, '100g', '#C2331B', 4, 4.7, 740),
  P('chaat-masala', 'Chaat Masala', 'चाट मसाला', 'blend', 'Delhi', 'Tangy, funky, amchur-forward', 'Sprinkle on fruit. Argue later.', 189, 219, '100g', '#B88A3E', 1, 4.8, 1120),
  P('chai-masala', 'Kadak Chai Masala', 'चाय मसाला', 'blend', 'Assam', 'Ginger, clove, fennel, pepper', 'For the 4pm window, rain or no rain.', 229, 269, '100g', '#8B5A2B', 1, 4.9, 1890),
  P('biryani-masala', 'Dum Biryani Masala', 'बिरयानी मसाला', 'blend', 'Hyderabad', 'Mace, kewra, shahi jeera', 'Sealed with dough, as the nawabs intended.', 259, 299, '75g', '#9A5B2E', 2, 4.8, 960),
  P('sambar-powder', 'Sambar Powder', 'सांभर पाउडर', 'blend', 'Tamil Nadu', 'Roasted dals, curry leaf, hing', 'Ground fresh every Monday in Madurai.', 199, 239, '200g', '#B5651D', 2, 4.7, 804),
  P('panch-phoron', 'Panch Phoron', 'पंच फोरन', 'blend', 'Bengal', 'Five seeds, one crackle', 'Mustard, nigella, fenugreek, fennel, cumin.', 159, 189, '100g', '#6E6B2E', 1, 4.7, 288),
  P('kala-namak', 'Kala Namak', 'काला नमक', 'salt', 'Rajasthan', 'Sulphurous, savoury, mineral', 'Volcanic salt, kiln-fired. The egg-flavour secret.', 129, 149, '200g', '#5B3C50', 0, 4.6, 511),
  P('rock-salt', 'Himalayan Pink Salt', 'सेंधा नमक', 'salt', 'Khewra', 'Mellow, mineral, soft crunch', 'Hand-chiselled, never boiled.', 149, 179, '500g', '#E9A7A0', 0, 4.7, 423),
  P('mustard', 'Black Mustard Seeds', 'राई', 'salt', 'Bikaner', 'Sharp, nutty, popping', 'Listen for the splutter. That is the cue.', 99, 119, '200g', '#3A2A1C', 1, 4.7, 389),
  P('fennel', 'Lucknowi Saunf', 'सौंफ', 'salt', 'Lucknow', 'Sweet, cooling, anisey', 'Tiny, green, and a post-dinner ritual.', 139, 159, '100g', '#8FA85A', 0, 4.8, 677),
  P('ajwain', 'Ajwain', 'अजवाइन', 'salt', 'Gujarat', 'Thyme-like, sharp, digestive', 'Gujarati grandmas swear by it.', 119, 139, '100g', '#A89C5A', 1, 4.6, 305),
  P('nutmeg-mace', 'Nutmeg & Mace', 'जायफल', 'whole', 'Wayanad', 'Warm, sweet, resinous', 'Two spices, one fruit, zero compromise.', 359, 419, '40g', '#7A4F34', 0, 4.8, 242),
  P('star-anise', 'Star Anise', 'चक्र फूल', 'whole', 'Arunachal', 'Liquorice, sweet, perfumed', 'Eight-pointed, dried in the northeast sun.', 209, 249, '50g', '#6B3A22', 0, 4.7, 266),
  P('hing', 'Asafoetida Hing', 'हींग', 'rare', 'Hathras', 'Pungent, then onion-gold', 'Compounded with rice flour, never with fillers.', 289, 339, '50g', '#C9A24B', 1, 4.8, 530),
  P('kasuri-methi', 'Kasuri Methi', 'कसूरी मेथी', 'rare', 'Nagaur', 'Bitter-sweet, hay, maple', 'Crushed between palms, as is tradition.', 149, 179, '50g', '#6F8B3A', 0, 4.8, 634),
  P('pink-peppercorn', 'Wayanad Wild Pepper', 'जंगली मिर्च', 'rare', 'Wayanad', 'Floral, rose, gentle bite', 'Foraged, not farmed.', 429, 489, '40g', '#C05A74', 2, 4.7, 119),
  P('amchur', 'Amchur Raw Mango', 'अमचूर', 'ground', 'Ratnagiri', 'Sour, fruity, bright', 'Summer mangoes, sun-dried into sour gold.', 169, 199, '100g', '#D8A94A', 0, 4.7, 398),
]

export const sizeMult = { '1g': [1], }

export const regions = [
  { id: 'kashmir', name: 'Kashmir', lonlat: [75.0, 34.2], title: 'The Saffron Valley', hue: '#D81B76', spices: ['Mongra saffron', 'Kashmiri chilli'], line: 'Crocus fields turn the plateau lilac for exactly three weeks every autumn.' },
  { id: 'marwar', name: 'Rajasthan', lonlat: [73.5, 26.6], title: 'The Desert Larder', hue: '#F7A614', spices: ['Cumin', 'Coriander', 'Kala namak'], line: 'Dry heat, deep wells, and spices that taste of sun and sand.' },
  { id: 'gujarat', name: 'Gujarat', lonlat: [71.0, 22.4], title: 'The Seed Coast', hue: '#0D8E9B', spices: ['Ajwain', 'Fennel', 'Sesame'], line: 'Unjha market trades more cumin and fennel than anywhere on earth.' },
  { id: 'northeast', name: 'North-East', lonlat: [92.2, 25.7], title: 'The Hill Kingdoms', hue: '#0E7A57', spices: ['Lakadong turmeric', 'Bhut jolokia', 'Black cardamom'], line: 'Rain-drenched ridges where turmeric hits 9% curcumin.' },
  { id: 'andhra', name: 'Andhra', lonlat: [79.5, 16.2], title: 'The Fire Belt', hue: '#D9381E', spices: ['Guntur chilli', 'Tamarind'], line: 'Guntur dries a third of India’s chillies on its rooftops. Rooftops go red.' },
  { id: 'malabar', name: 'Malabar', lonlat: [76.7, 9.6], title: 'The Pepper Coast', hue: '#1E1B5E', spices: ['Tellicherry pepper', 'Cardamom', 'Cinnamon', 'Nutmeg'], line: 'Where Rome, Portugal and Britain all came looking for the same berry.' },
]

export const indiaOutline = [
  [74.0,36.8],[76.5,35.8],[78.0,35.5],[79.5,34.0],[78.8,32.6],[79.0,31.0],[80.2,30.4],[81.0,30.1],[81.9,30.3],[84.0,28.8],[85.5,28.3],[88.1,27.8],[88.0,27.2],[88.9,27.3],[89.8,26.8],[92.0,26.9],[92.7,28.1],[94.5,29.3],[96.1,29.0],[97.3,28.2],[96.2,27.2],[97.0,26.0],[95.2,25.9],[94.6,24.0],[93.4,22.9],[92.6,21.9],[92.2,23.0],[91.6,24.1],[90.5,25.1],[89.8,25.3],[89.0,26.3],[88.4,25.6],[88.2,24.7],[88.1,23.2],[88.7,22.3],[88.2,21.6],[87.0,21.5],[86.8,20.4],[85.4,19.7],[84.0,18.5],[82.3,16.8],[80.3,15.5],[80.1,13.4],[80.3,11.7],[79.8,10.3],[78.9,9.2],[77.5,8.1],[76.5,8.8],[75.7,11.3],[74.8,12.9],[74.0,15.0],[73.3,17.5],[72.8,19.1],[72.7,21.2],[72.2,21.8],[70.0,20.8],[69.0,22.3],[70.0,22.8],[68.2,23.7],[69.6,24.3],[70.8,24.8],[70.3,26.0],[71.0,27.5],[72.5,28.9],[73.5,29.9],[74.5,31.0],[74.6,32.5],[73.8,34.0],[74.5,35.2],
]

export const occasions = [
  {
    id: 'shaadi', label: 'Shaadi', hi: 'शादी', color: '#D81B76', ink: '#FFF6E5',
    title: 'The Shagun Box', tagline: 'For the wedding that needs a gift as grand as its guest list.',
    copy: 'Saffron for the sherbet, cardamom for the kheer, a masala for every rasam of the eight-day affair. Packed in a hand-painted keepsake box with a mauli thread and a blessing card.',
    items: ['mongra-saffron', 'green-cardamom', 'garam-masala', 'biryani-masala', 'fennel'], price: 2299, mrp: 2799, motif: 'kalash',
  },
  {
    id: 'diwali', label: 'Diwali', hi: 'दिवाली', color: '#F7A614', ink: '#1E1B5E',
    title: 'The Diya Box', tagline: 'Light a lamp. Then light the stove.',
    copy: 'Everything for mithai week and the midnight-snack week after: cardamom, saffron, nutmeg and a chai masala for the cousins who stay on. Includes a brass diya.',
    items: ['green-cardamom', 'mongra-saffron', 'nutmeg-mace', 'chai-masala', 'chaat-masala'], price: 1899, mrp: 2299, motif: 'diya',
  },
  {
    id: 'eid', label: 'Eid', hi: 'ईद', color: '#0E7A57', ink: '#FFF6E5',
    title: 'The Dawat Box', tagline: 'For the table that seats forty and still runs short of biryani.',
    copy: 'Dum biryani masala, kewra-friendly saffron, black cardamom and star anise for the nihari. A little attar-scented card tucked in because manners.',
    items: ['biryani-masala', 'mongra-saffron', 'black-cardamom', 'star-anise', 'ceylon-cinnamon'], price: 2099, mrp: 2499, motif: 'crescent',
  },
  {
    id: 'pongal', label: 'Pongal', hi: 'पोंगल', color: '#D9381E', ink: '#FFF6E5',
    title: 'The Pot-Over Box', tagline: 'Let it boil over. That is the whole point.',
    copy: 'Black pepper and cumin for the ven pongal, cardamom for the sakkarai, sambar powder for everything else. Wrapped in a banana-fibre sleeve with a kolam sticker sheet.',
    items: ['tellicherry-pepper', 'cumin', 'green-cardamom', 'sambar-powder', 'hing'], price: 1499, mrp: 1799, motif: 'pot',
  },
  {
    id: 'onam', label: 'Onam', hi: 'ओणम', color: '#0D8E9B', ink: '#FFF6E5',
    title: 'The Sadya Box', tagline: 'Twenty-six dishes. One banana leaf. Zero shortcuts.',
    copy: 'Malabar’s own pepper, cinnamon, nutmeg and cardamom, plus the turmeric that colours the avial. Comes with a pookalam stencil so the whole house joins in.',
    items: ['tellicherry-pepper', 'ceylon-cinnamon', 'nutmeg-mace', 'green-cardamom', 'lakadong-turmeric'], price: 1699, mrp: 1999, motif: 'pookalam',
  },
]

export const reviews = [
  { name: 'Meenakshi R.', city: 'Chennai', product: 'Heirloom Garam Masala', line: 'My mother-in-law asked where I got the masala. That is the highest honour in the family.', stars: 5 },
  { name: 'Arjun & Tanvi', city: 'Pune', product: 'Shagun Box', line: 'Gifted to forty guests at our sangeet. Three uncles have already reordered.', stars: 5 },
  { name: 'Faiza Q.', city: 'Lucknow', product: 'Dum Biryani Masala', line: 'Sealed the handi with dough, waited, opened. Neighbours knocked.', stars: 5 },
  { name: 'Rohit S.', city: 'Bengaluru', product: 'Lakadong Turmeric', line: 'Golden milk went from medicine to a treat. The colour is almost rude.', stars: 5 },
  { name: 'Prerna D.', city: 'Jaipur', product: 'Kala Namak', line: 'Chaat tastes like a Chandni Chowk lane. I have stopped eating out.', stars: 4 },
  { name: 'Joseph K.', city: 'Kochi', product: 'Tellicherry Pepper', line: 'Finally, pepper that actually argues back. Fresh and loud.', stars: 5 },
]

export const farmers = [
  { name: 'Abdul Rashid', place: 'Pampore, Kashmir', crop: 'Saffron', line: 'Three weeks of crocus, three generations of hands. We pick before sunrise or not at all.', turban: '#E3A21A', skin: '#C58A5E', beard: true },
  { name: 'Phibalin Dkhar', place: 'Jaintia Hills, Meghalaya', crop: 'Lakadong turmeric', line: 'Our turmeric dries on bamboo above a fire. The smell reaches the next village.', turban: '#D81B76', skin: '#D6A27A', beard: false },
  { name: 'Thomas Mathew', place: 'Idukki, Kerala', crop: 'Cardamom', line: 'Cardamom is picked pod by pod, every twelve days. Impatience is not a thing here.', turban: '#0E7A57', skin: '#A9693F', beard: true },
]

export const states = [
  ['Punjab', 'Rajma masala'], ['Rajasthan', 'Laal maas'], ['Gujarat', 'Undhiyu'], ['Maharashtra', 'Misal pav'], ['Goa', 'Xacuti'],
  ['Karnataka', 'Bisi bele bath'], ['Kerala', 'Fish moilee'], ['Tamil Nadu', 'Chettinad chicken'], ['Andhra', 'Gongura pachadi'], ['Telangana', 'Hyderabadi biryani'],
  ['Odisha', 'Dalma'], ['West Bengal', 'Shorshe ilish'], ['Assam', 'Masor tenga'], ['Bihar', 'Litti chokha'], ['Uttar Pradesh', 'Awadhi korma'],
  ['Madhya Pradesh', 'Bhutte ka kees'], ['Kashmir', 'Rogan josh'], ['Himachal', 'Siddu'], ['Uttarakhand', 'Kafuli'], ['Sikkim', 'Phagshapa'],
  ['Nagaland', 'Smoked pork bamboo'], ['Manipur', 'Eromba'], ['Meghalaya', 'Jadoh'], ['Tripura', 'Mui borok'], ['Mizoram', 'Bai'],
  ['Arunachal', 'Thukpa'], ['Haryana', 'Bajra khichdi'], ['Chhattisgarh', 'Chila'],
]
