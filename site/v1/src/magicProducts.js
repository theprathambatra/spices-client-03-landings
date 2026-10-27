// Showroom-only SKUs. Prices are illustrative for this demo storefront.
const seedList = [
  ['Almond', [200, 400], 399, '#D58B52'],
  ['Raisin', [200, 400], 179, '#A97942'],
  ['Walnut', [200, 400], 449, '#A66B43'],
  ['Cashew', [200, 400], 399, '#E0AD64'],
  ['Anjeer', [200, 400], 499, '#B76C77'],
  ['Pistachio', [200, 400], 499, '#8CAB61'],
  ['Black Raisin', [200], 219, '#57435E'],
  ['Trail Mix', [200, 400], 329, '#E78D60'],
  ['Mix Dryfruits', [200, 400], 429, '#B66A42'],
  ['Mix Berries', [200, 400], 399, '#BD5781'],
  ['Mix Seeds', [200, 400], 199, '#91B76B'],
  ['Cranberry', [200], 299, '#C44C62'],
  ['Blueberry', [200], 419, '#586AA8'],
  ['Dried Apricot', [200], 299, '#EF9953'],
  ['Flax Seeds', [200], 129, '#B68A5C'],
  ['Pumpkin Seeds', [200], 219, '#6FA763'],
  ['Watermelon Seeds', [200], 179, '#D59B72'],
  ['Sunflower Seeds', [200], 149, '#E2AE4D'],
  ['Melon Seeds', [200], 199, '#C7A778'],
  ['Basil Seeds', [200], 149, '#5D6E54'],
  ['Dry Dates', [200, 400], 219, '#AE7650'],
  ['Dates', [200, 400], 199, '#845034'],
]

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const make = (name, sizes, base, color, section, icon = 'seeds') => {
  const magicPrices = Object.fromEntries(sizes.map((size, i) => [size, i === 0 ? base : Math.round(base * 1.86 / 10) * 10]))
  return {
    id: `magic-${slug(name)}`, name, sizes, magicPrices, price: base, mrp: base,
    weight: `${sizes[0]}g`, color, icon, section, cat: section,
    notes: 'Choose a pack from the showroom shelf.',
  }
}

export const magicProducts = [
  ...seedList.map(([name, sizes, base, color]) => make(name, sizes, base, color, 'seeds')),
  make('Makhana', [100, 200], 199, '#E8C479', 'makhana', 'bowl'),
]

export const magicById = Object.fromEntries(magicProducts.map((p) => [p.id, p]))
