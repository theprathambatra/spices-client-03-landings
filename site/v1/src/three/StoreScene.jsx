import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { products, inkOn } from '../brand.js'
import { magicProducts } from '../magicProducts.js'

const INK = '#1A1208'
const CREAM = '#FFF3DC'
const EYE_HEIGHT = 2.25
const WALNUT = '#744426'
const BRASS = '#D8AA55'
const seedRacks = [0, 1, 2, 3].map((n) => magicProducts.filter((p) => p.section === 'seeds').slice(n * 6, n * 6 + 6))
const spiceRacks = [
  products.filter((p) => p.cat === 'ground'),
  products.filter((p) => p.cat === 'whole'),
  products.filter((p) => !['ground', 'whole'].includes(p.cat)),
]
const displayById = Object.fromEntries([...products, ...magicProducts].map((p) => [p.id, p]))
const frontEdit = ['magic-almond', 'magic-trail-mix', 'magic-makhana', 'magic-mix-berries', 'magic-pistachio'].map((id) => displayById[id])
const backEdit = ['kashmiri-chilli', 'lakadong-haldi', 'garam-masala', 'green-elaichi', 'magic-cashew'].map((id) => displayById[id])
const packArtCache = new Map()

const random = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)

function surfaceTexture(kind) {
  const c = document.createElement('canvas')
  c.width = c.height = kind === 'floor' ? 1024 : 512
  const g = c.getContext('2d')
  const r = random(kind === 'floor' ? 1097 : kind === 'wood' ? 5621 : kind === 'stone' ? 443 : 881)
  if (kind === 'floor') {
    g.fillStyle = '#C89469'; g.fillRect(0, 0, 1024, 1024)
    const shades = ['#DDB58D', '#D5AA80', '#E0B78F', '#CFA277', '#DBB189']
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const ox = x * 128, oy = y * 128
      g.fillStyle = shades[Math.floor(r() * shades.length)]
      g.fillRect(ox + 3, oy + 3, 122, 122)
      g.fillStyle = 'rgba(92,54,33,.11)'
      for (let i = 0; i < 45; i++) g.fillRect(ox + 8 + r() * 112, oy + 8 + r() * 112, 1 + r() * 3, 1 + r() * 3)
      g.strokeStyle = 'rgba(255,243,220,.26)'; g.lineWidth = 1
      g.strokeRect(ox + 7, oy + 7, 114, 114)
    }
  } else if (kind === 'wood') {
    g.fillStyle = '#8D5634'; g.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 700; i++) {
      const x = r() * 512, y = r() * 512
      g.strokeStyle = `rgba(${r() < .5 ? '40,20,10' : '238,174,109'},${.02 + r() * .15})`
      g.lineWidth = .4 + r() * 2; g.beginPath(); g.moveTo(x, y)
      g.bezierCurveTo(x + r() * 6, y + 30, x - r() * 6, y + 90, x + r() * 8 - 4, y + 160)
      g.stroke()
    }
  } else if (kind === 'stone') {
    g.fillStyle = '#EEE1CB'; g.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 1350; i++) {
      g.fillStyle = `rgba(${r() < .4 ? '130,83,54' : '255,255,255'},${.08 + r() * .16})`
      g.beginPath(); g.arc(r() * 512, r() * 512, .4 + r() * 2.5, 0, Math.PI * 2); g.fill()
    }
    for (let i = 0; i < 8; i++) {
      const y = r() * 512; g.strokeStyle = 'rgba(150,116,88,.13)'; g.lineWidth = .8 + r() * 2
      g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(130, y - 25, 320, y + 30, 512, y - 8); g.stroke()
    }
  } else {
    g.fillStyle = '#F3E8D7'; g.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 9500; i++) {
      g.fillStyle = `rgba(${r() < .5 ? '129,94,62' : '255,255,255'},${.015 + r() * .07})`
      g.fillRect(r() * 512, r() * 512, .5 + r() * 3, .5 + r() * 3)
    }
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(...(kind === 'floor' ? [3, 4] : kind === 'plaster' ? [3, 2] : [1, 1]))
  t.anisotropy = 8
  return t
}

function posterTexture(title, subtitle, color) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 640
  const g = c.getContext('2d')
  g.fillStyle = '#F8EBD5'; g.fillRect(0, 0, 512, 640)
  g.strokeStyle = color; g.lineWidth = 2; g.strokeRect(26, 26, 460, 588)
  g.fillStyle = color; g.beginPath(); g.arc(256, 275, 150, 0, Math.PI * 2); g.fill()
  g.fillStyle = '#F8EBD5'
  for (let i = 0; i < 7; i++) {
    g.save(); g.translate(256, 275); g.rotate(i * Math.PI * 2 / 7)
    g.beginPath(); g.ellipse(0, -70, 29, 85, .2, 0, Math.PI * 2); g.fill(); g.restore()
  }
  g.fillStyle = INK; g.textAlign = 'center'
  g.font = '900 60px Impact, Arial Black, sans-serif'; g.fillText(title, 256, 523, 430)
  g.font = 'bold 23px Arial, sans-serif'; g.fillText(subtitle, 256, 564, 430)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4
  return t
}

function exteriorTexture() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512
  const g = c.getContext('2d')
  const sky = g.createLinearGradient(0, 0, 0, 512)
  sky.addColorStop(0, '#A9D5DF'); sky.addColorStop(.58, '#DBE6D5'); sky.addColorStop(1, '#E6C89C')
  g.fillStyle = sky; g.fillRect(0, 0, 1024, 512)
  g.fillStyle = 'rgba(255,244,204,.75)'; g.beginPath(); g.arc(788, 92, 58, 0, Math.PI * 2); g.fill()
  g.fillStyle = '#9DB9A7'; g.beginPath(); g.moveTo(0, 355)
  for (let x = 0; x <= 1024; x += 25) g.lineTo(x, 332 + Math.sin(x * .013) * 28 + Math.sin(x * .032) * 13)
  g.lineTo(1024, 512); g.lineTo(0, 512); g.fill()
  g.fillStyle = '#789E87'; g.beginPath(); g.moveTo(0, 427)
  for (let x = 0; x <= 1024; x += 20) g.lineTo(x, 414 + Math.sin(x * .022) * 19)
  g.lineTo(1024, 512); g.lineTo(0, 512); g.fill()
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4
  return t
}

function labelTexture(title, subtitle, background = '#FFC21A') {
  const c = document.createElement('canvas')
  c.width = 1024; c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = background; g.fillRect(0, 0, 1024, 256)
  g.strokeStyle = INK; g.lineWidth = 16; g.strokeRect(8, 8, 1008, 240)
  g.strokeStyle = 'rgba(26,18,8,.25)'; g.lineWidth = 2; g.strokeRect(29, 29, 966, 198)
  g.fillStyle = INK; g.textAlign = 'center'
  g.font = '900 108px Impact, Arial Black, sans-serif'; g.fillText(title.toUpperCase(), 512, 133, 900)
  g.font = 'bold 35px Arial, sans-serif'; g.fillText(subtitle.toUpperCase(), 512, 204, 850)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function packTexture(product, size) {
  const key = `${product.id}-${size}`
  if (packArtCache.has(key)) return packArtCache.get(key)
  const c = document.createElement('canvas')
  c.width = 384; c.height = 512
  const g = c.getContext('2d')
  const ink = inkOn(product.color)
  g.fillStyle = product.color; g.fillRect(0, 0, 384, 512)
  const sheen = g.createLinearGradient(0, 0, 384, 0)
  sheen.addColorStop(0, 'rgba(255,255,255,.26)'); sheen.addColorStop(.22, 'rgba(255,255,255,0)')
  sheen.addColorStop(.78, 'rgba(0,0,0,0)'); sheen.addColorStop(1, 'rgba(0,0,0,.13)')
  g.fillStyle = sheen; g.fillRect(0, 0, 384, 512)
  g.strokeStyle = ink; g.lineWidth = 8; g.strokeRect(14, 14, 356, 484)
  g.fillStyle = ink; g.fillRect(14, 14, 356, 55)
  g.fillStyle = product.color; g.textAlign = 'center'
  g.font = '900 35px Impact, Arial Black, sans-serif'; g.fillText('KESARI', 192, 55)
  g.fillStyle = CREAM; g.beginPath(); g.arc(192, 200, 103, 0, Math.PI * 2); g.fill()
  g.strokeStyle = ink; g.lineWidth = 4; g.stroke()
  const r = random([...product.name].reduce((n, char) => n * 31 + char.charCodeAt(0), 7) >>> 0)
  for (let i = 0; i < 13; i++) {
    const x = 123 + r() * 138, y = 139 + r() * 122
    g.save(); g.translate(x, y); g.rotate(r() * Math.PI)
    g.fillStyle = i % 3 === 0 ? product.color : i % 3 === 1 ? '#B9834C' : '#79533B'
    g.beginPath(); g.ellipse(0, 0, 8 + r() * 9, 17 + r() * 9, 0, 0, Math.PI * 2); g.fill()
    g.strokeStyle = 'rgba(26,18,8,.35)'; g.lineWidth = 2; g.stroke(); g.restore()
  }
  g.fillStyle = ink; g.font = 'bold 18px Arial, sans-serif'; g.fillText('SMALL BATCH · BIG FLAVOUR', 192, 326, 330)
  const words = product.name.toUpperCase().split(' ')
  const lines = []
  words.forEach((word) => {
    const last = lines.length - 1
    if (last >= 0 && (lines[last] + ' ' + word).length <= 14) lines[last] += ' ' + word
    else lines.push(word)
  })
  const font = lines.some((line) => line.length > 14) ? 32 : 39
  g.font = `900 ${font}px Impact, Arial Black, sans-serif`; g.fillStyle = ink
  lines.slice(0, 2).forEach((line, i) => g.fillText(line, 192, 385 + i * 45, 338))
  g.fillStyle = CREAM; g.strokeStyle = ink; g.lineWidth = 4
  g.beginPath(); g.roundRect(122, 452, 140, 43, 18); g.fill(); g.stroke()
  g.fillStyle = INK; g.font = 'bold 28px Arial, sans-serif'; g.fillText(`${size}g`, 192, 483)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  packArtCache.set(key, t)
  return t
}

function Sign({ title, subtitle, width = 5.2, color = '#FFC21A', position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const map = useMemo(() => labelTexture(title, subtitle, color), [title, subtitle, color])
  useEffect(() => () => map.dispose(), [map])
  const h = width * .25
  return <group position={position} rotation={rotation}>
    <RoundedBox args={[width + .14, h + .14, .13]} radius={.045} smoothness={3} castShadow>
      <meshStandardMaterial color={WALNUT} roughness={.55} />
    </RoundedBox>
    <mesh position={[0, 0, .075]}><planeGeometry args={[width + .04, h + .04]} /><meshStandardMaterial color={BRASS} metalness={.35} roughness={.32} /></mesh>
    <mesh position={[0, 0, .09]}><planeGeometry args={[width, h]} /><meshBasicMaterial map={map} side={THREE.DoubleSide} /></mesh>
  </group>
}

function ProductPack({ product, size, position, onPick, selected }) {
  const packSize = size || parseInt(product.weight, 10)
  const map = useMemo(() => packTexture(product, packSize), [product.id, packSize])
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onPick(product.id, packSize) }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = '' }}>
      {selected && <RoundedBox args={[1.02, 1.29, .22]} radius={.065} smoothness={3} position={[0, 0, -.04]}>
        <meshStandardMaterial color="#FFC21A" emissive="#D49300" emissiveIntensity={.25} />
      </RoundedBox>}
      <RoundedBox args={[.88, 1.12, .22]} radius={.055} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color={product.color} roughness={.7} />
      </RoundedBox>
      <mesh position={[0, 0, .114]} castShadow><planeGeometry args={[.81, 1.02]} /><meshStandardMaterial map={map} roughness={.66} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, .53, .01]} castShadow><boxGeometry args={[.86, .07, .24]} /><meshStandardMaterial color={product.color} roughness={.74} /></mesh>
      <mesh position={[0, -.53, .015]}><boxGeometry args={[.84, .055, .24]} /><meshStandardMaterial color={product.color} roughness={.74} /></mesh>
      {[-.42, .42].map((x) => <mesh key={x} position={[x, 0, .115]}><boxGeometry args={[.018, .98, .012]} /><meshStandardMaterial color={INK} transparent opacity={.22} /></mesh>)}
    </group>
  )
}

function Rack({ items, side, z, title, subtitle, color, onPick, selectedId, maps, columns = 3 }) {
  const left = side === 'left'
  const width = columns === 4 ? 5.7 : 4.7
  const faceItems = Array.from({ length: columns * 3 }, (_, i) => items[i % items.length])
  return (
    <group position={[left ? -9.42 : 9.42, 0, z]} rotation={[0, left ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <mesh position={[0, 2.36, -.34]} receiveShadow><boxGeometry args={[width, 4.72, .19]} /><meshStandardMaterial map={maps.wood} roughness={.76} /></mesh>
      {[-1, 1].map((s) => <RoundedBox key={s} args={[.17, 4.67, .75]} radius={.035} smoothness={3} position={[s * (width / 2 - .07), 2.36, .02]} castShadow receiveShadow>
        <meshStandardMaterial map={maps.wood} roughness={.55} />
      </RoundedBox>)}
      <RoundedBox args={[width - .25, .55, .65]} radius={.035} smoothness={3} position={[0, .35, .04]} castShadow receiveShadow>
        <meshStandardMaterial map={maps.wood} roughness={.7} />
      </RoundedBox>
      {[.62, 1.82, 3.02, 4.22].map((y) => <group key={y}>
        <RoundedBox args={[width + .03, .17, .78]} radius={.025} smoothness={3} position={[0, y, .12]} castShadow receiveShadow>
          <meshStandardMaterial map={maps.wood} roughness={.55} />
        </RoundedBox>
        <mesh position={[0, y - .032, .52]}><boxGeometry args={[width - .08, .025, .018]} /><meshStandardMaterial color={BRASS} metalness={.35} roughness={.35} /></mesh>
        {y > .62 && <mesh position={[0, y - .12, .26]}><boxGeometry args={[width - .3, .018, .14]} /><meshBasicMaterial color="#FFE0A0" /></mesh>}
      </group>)}
      <Sign title={title} subtitle={subtitle} color={color} width={width - .18} position={[0, 4.73, .18]} />
      {faceItems.map((p, i) => {
        const col = i % columns
        const row = Math.floor(i / columns)
        const step = columns === 4 ? 1.29 : 1.37
        const size = p.sizes?.[Math.floor(i / items.length) % p.sizes.length]
        return <ProductPack key={`${p.id}-${i}`} product={p} size={size} position={[(col - (columns - 1) / 2) * step, 1.28 + row * 1.2, .31]} onPick={onPick} selected={selectedId === p.id} />
      })}
    </group>
  )
}

function Plant({ x, z, size = 1 }) {
  return <group position={[x, 0, z]} scale={size}>
    <mesh position={[0, .31, 0]} castShadow receiveShadow><cylinderGeometry args={[.34, .27, .62, 16]} /><meshStandardMaterial color="#B96B4D" roughness={.9} /></mesh>
    <mesh position={[0, .59, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[.35, .048, 7, 20]} /><meshStandardMaterial color="#D9825B" roughness={.86} /></mesh>
    <mesh position={[0, .62, 0]}><cylinderGeometry args={[.29, .29, .035, 16]} /><meshStandardMaterial color="#4B3929" roughness={1} /></mesh>
    {[0, 1, 2].map((i) => <mesh key={i} position={[(i - 1) * .09, 1.09 + i * .12, 0]} rotation={[0, 0, (i - 1) * .16]} castShadow>
      <cylinderGeometry args={[.023, .035, .95 + i * .22, 6]} /><meshStandardMaterial color="#315C3B" roughness={1} />
    </mesh>)}
    {Array.from({ length: 10 }, (_, i) => {
      const a = i * 2.399, h = .95 + (i % 5) * .19
      const radius = .24 + (i % 3) * .11
      return <mesh key={i} position={[Math.cos(a) * radius, h, Math.sin(a) * radius]} rotation={[.3 * Math.sin(a), a, -.55 * Math.cos(a)]} scale={[.22, .42, .11]} castShadow>
        <sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={i % 3 ? '#3F7949' : '#6C9B57'} roughness={.82} side={THREE.DoubleSide} />
      </mesh>
    })}
  </group>
}

function TableSet({ x, z, maps }) {
  return <group position={[x, 0, z]}>
    <mesh position={[0, .86, 0]} castShadow receiveShadow><cylinderGeometry args={[.78, .78, .12, 32]} /><meshStandardMaterial map={maps.wood} roughness={.48} /></mesh>
    <mesh position={[0, .8, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.75, .022, 6, 32]} /><meshStandardMaterial color={BRASS} metalness={.45} roughness={.28} /></mesh>
    <mesh position={[0, .4, 0]} castShadow><cylinderGeometry args={[.09, .16, .8, 12]} /><meshStandardMaterial color={INK} metalness={.2} roughness={.48} /></mesh>
    <mesh position={[0, .055, 0]} castShadow><cylinderGeometry args={[.36, .36, .08, 20]} /><meshStandardMaterial color={INK} roughness={.5} /></mesh>
    <mesh position={[0, .94, 0]}><cylinderGeometry args={[.14, .18, .12, 12]} /><meshStandardMaterial color="#F9F0E1" roughness={.35} /></mesh>
    {[0, 2, 4].map((i) => <mesh key={i} position={[Math.sin(i) * .1, 1.12 + i * .02, Math.cos(i) * .08]} rotation={[.3, i, -.4]} scale={[.08, .22, .05]} castShadow>
      <sphereGeometry args={[1, 10, 7]} /><meshStandardMaterial color="#488352" roughness={.85} />
    </mesh>)}
    <mesh position={[.42, .96, .13]} rotation={[-Math.PI / 2, 0, -.3]}><planeGeometry args={[.22, .31]} /><meshStandardMaterial color="#F8EBD5" roughness={.9} side={THREE.DoubleSide} /></mesh>
    {[-1, 1].map((s) => <group key={s} position={[s * 1.32, 0, 0]} rotation={[0, s > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <RoundedBox args={[.7, .11, .66]} radius={.04} smoothness={3} position={[0, .48, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#A75B44" roughness={.78} />
      </RoundedBox>
      <RoundedBox args={[.7, .64, .1]} radius={.045} smoothness={3} position={[0, .87, -.32]} castShadow>
        <meshStandardMaterial color="#B97359" roughness={.78} />
      </RoundedBox>
      {[-.27, .27].map((v) => <group key={v}>
        <mesh position={[v, .23, .22]} castShadow><cylinderGeometry args={[.034, .05, .46, 8]} /><meshStandardMaterial map={maps.wood} roughness={.65} /></mesh>
        <mesh position={[v, .23, -.22]} castShadow><cylinderGeometry args={[.034, .05, .46, 8]} /><meshStandardMaterial map={maps.wood} roughness={.65} /></mesh>
      </group>)}
    </group>)}
  </group>
}

function WallFrame({ x, color, title, subtitle }) {
  const map = useMemo(() => posterTexture(title, subtitle, color), [title, subtitle, color])
  useEffect(() => () => map.dispose(), [map])
  return <group position={[x, 3.2, -14.03]}>
    <RoundedBox args={[1.68, 2.05, .14]} radius={.025} smoothness={3} castShadow><meshStandardMaterial color={WALNUT} roughness={.55} /></RoundedBox>
    <mesh position={[0, 0, .079]}><planeGeometry args={[1.51, 1.88]} /><meshStandardMaterial color={BRASS} metalness={.35} roughness={.37} /></mesh>
    <mesh position={[0, 0, .092]}><planeGeometry args={[1.43, 1.8]} /><meshBasicMaterial map={map} /></mesh>
  </group>
}

function BackDisplay({ onPick, selectedId, maps }) {
  const makhana = magicProducts.find((p) => p.section === 'makhana')
  return <group position={[-4.5, 0, -13.35]}>
    <RoundedBox args={[4.9, 4.6, .35]} radius={.08} smoothness={4} position={[0, 2.3, -.12]} castShadow receiveShadow>
      <meshStandardMaterial map={maps.wood} roughness={.64} />
    </RoundedBox>
    <mesh position={[0, 2.25, .072]}><boxGeometry args={[4.38, 4.05, .02]} /><meshStandardMaterial color="#E2C59B" roughness={.88} /></mesh>
    {[-2.28, 2.28].map((x) => <RoundedBox key={x} args={[.18, 4.55, .61]} radius={.035} smoothness={3} position={[x, 2.28, .24]} castShadow>
      <meshStandardMaterial map={maps.wood} roughness={.58} />
    </RoundedBox>)}
    {[.62, 1.82, 3.02, 4.22].map((y) => <group key={y}>
      <RoundedBox args={[4.7, .15, .66]} radius={.025} smoothness={3} position={[0, y, .3]} castShadow receiveShadow>
        <meshStandardMaterial map={maps.wood} roughness={.58} />
      </RoundedBox>
      <mesh position={[0, y - .02, .64]}><boxGeometry args={[4.5, .022, .015]} /><meshStandardMaterial color={BRASS} metalness={.35} roughness={.35} /></mesh>
    </group>)}
    <Sign title="Makhana" subtitle="100g & 200g" width={4.35} color="#E8C479" position={[0, 4.74, .25]} />
    {[100, 200, 100, 200, 100, 200, 100, 200, 100].map((size, i) => <ProductPack key={i} product={makhana} size={size} position={[(i % 3 - 1) * 1.25, 1.28 + Math.floor(i / 3) * 1.2, .52]} onPick={onPick} selected={selectedId === makhana.id} />)}
  </group>
}

function Cashier({ onOpen, paused, maps }) {
  const arm = useRef()
  useFrame((s) => { if (arm.current) arm.current.rotation.z = paused ? -.2 : -.2 + Math.sin(s.clock.elapsedTime * 1.8) * .13 })
  return <group position={[0, 0, -11.2]} onClick={(e) => { e.stopPropagation(); onOpen() }}
    onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
    onPointerOut={() => { document.body.style.cursor = '' }}>
    {[-.25, .25].map((x) => <mesh key={x} position={[x, .55, -.38]} castShadow><cylinderGeometry args={[.14, .17, 1.08, 12]} /><meshStandardMaterial color="#394747" roughness={.9} /></mesh>)}
    <mesh position={[0, 1.52, -.37]} castShadow><capsuleGeometry args={[.43, .57, 8, 16]} /><meshStandardMaterial color="#276F56" roughness={.88} /></mesh>
    <RoundedBox args={[.7, .86, .08]} radius={.08} smoothness={4} position={[0, 1.48, .06]} castShadow>
      <meshStandardMaterial color="#D6A552" roughness={.8} />
    </RoundedBox>
    {[-.3, .3].map((x) => <mesh key={x} position={[x, 1.92, .05]} rotation={[0, 0, x * .5]}><boxGeometry args={[.075, .47, .08]} /><meshStandardMaterial color="#684424" roughness={.8} /></mesh>)}
    <mesh position={[0, 1.46, .113]}><boxGeometry args={[.43, .035, .015]} /><meshStandardMaterial color={INK} roughness={.8} /></mesh>
    <mesh position={[0, 2.39, -.32]} castShadow><sphereGeometry args={[.41, 22, 16]} /><meshStandardMaterial color="#C68B69" roughness={.8} /></mesh>
    {[-.39, .39].map((x) => <mesh key={x} position={[x, 2.38, -.31]}><sphereGeometry args={[.085, 9, 8]} /><meshStandardMaterial color="#C68B69" roughness={.8} /></mesh>)}
    <mesh position={[0, 2.64, -.39]} castShadow><sphereGeometry args={[.425, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#241813" roughness={.94} /></mesh>
    <mesh position={[-.19, 2.66, .005]} rotation={[0, 0, -.3]}><sphereGeometry args={[.19, 12, 8]} /><meshStandardMaterial color="#241813" roughness={.94} /></mesh>
    {[-.145, .145].map((x) => <group key={x}>
      <mesh position={[x, 2.43, .063]}><sphereGeometry args={[.058, 10, 8]} /><meshStandardMaterial color="#FFF9EC" roughness={.35} /></mesh>
      <mesh position={[x, 2.43, .11]}><sphereGeometry args={[.027, 8, 8]} /><meshStandardMaterial color={INK} roughness={.35} /></mesh>
      <mesh position={[x, 2.53, .052]} rotation={[0, 0, x * .8]}><boxGeometry args={[.12, .025, .025]} /><meshStandardMaterial color={INK} /></mesh>
    </group>)}
    <mesh position={[0, 2.31, .083]}><sphereGeometry args={[.055, 8, 7]} /><meshStandardMaterial color="#A96951" roughness={.9} /></mesh>
    <mesh position={[0, 2.22, .065]} rotation={[0, 0, Math.PI]}><torusGeometry args={[.105, .015, 6, 20, Math.PI]} /><meshStandardMaterial color="#743E38" roughness={.8} /></mesh>
    <group ref={arm} position={[.53, 1.92, -.3]} rotation={[0, 0, -.2]}>
      <mesh position={[.15, -.26, .09]} rotation={[0, 0, .35]} castShadow><capsuleGeometry args={[.13, .47, 6, 10]} /><meshStandardMaterial color="#276F56" roughness={.88} /></mesh>
      <mesh position={[.29, -.55, .18]} castShadow><sphereGeometry args={[.12, 10, 8]} /><meshStandardMaterial color="#C68B69" roughness={.85} /></mesh>
    </group>
    <mesh position={[-.63, 1.68, -.22]} rotation={[0, 0, -.48]} castShadow><capsuleGeometry args={[.13, .45, 6, 10]} /><meshStandardMaterial color="#276F56" roughness={.88} /></mesh>
    <mesh position={[-.8, 1.45, .05]}><sphereGeometry args={[.12, 10, 8]} /><meshStandardMaterial color="#C68B69" roughness={.85} /></mesh>

    <RoundedBox args={[3.48, 1.35, 1.3]} radius={.075} smoothness={4} position={[0, .82, .94]} castShadow receiveShadow>
      <meshStandardMaterial map={maps.wood} roughness={.6} />
    </RoundedBox>
    <mesh position={[0, .15, 1.61]}><boxGeometry args={[3.4, .11, .045]} /><meshStandardMaterial color={INK} roughness={.58} /></mesh>
    {Array.from({ length: 17 }, (_, i) => <mesh key={i} position={[-1.56 + i * .195, .81, 1.601]} castShadow>
      <boxGeometry args={[.055, 1.13, .045]} /><meshStandardMaterial color={i % 2 ? '#A26A43' : '#9B5C37'} roughness={.7} />
    </mesh>)}
    <Sign title="KESARI" subtitle="PICK UP · TURN UP" width={2.12} color="#E8C479" position={[0, .84, 1.64]} />
    <RoundedBox args={[3.72, .16, 1.54]} radius={.045} smoothness={3} position={[0, 1.57, .94]} castShadow receiveShadow>
      <meshStandardMaterial map={maps.stone} roughness={.37} />
    </RoundedBox>
    <mesh position={[0, 1.475, 1.71]}><boxGeometry args={[3.55, .025, .025]} /><meshStandardMaterial color={BRASS} metalness={.45} roughness={.3} /></mesh>
    <group position={[-.92, 1.69, .48]}>
      <RoundedBox args={[.64, .16, .52]} radius={.045} smoothness={3} castShadow><meshStandardMaterial color={INK} roughness={.4} /></RoundedBox>
      <mesh position={[0, .3, -.13]} rotation={[-.14, 0, 0]} castShadow><boxGeometry args={[.58, .51, .055]} /><meshStandardMaterial color="#303932" metalness={.15} roughness={.45} /></mesh>
      <mesh position={[0, .3, -.092]} rotation={[-.14, 0, 0]}><planeGeometry args={[.49, .39]} /><meshBasicMaterial color="#C8E6C6" /></mesh>
    </group>
    <group position={[.98, 1.74, 1.1]} rotation={[0, -.28, 0]}>
      <RoundedBox args={[.28, .1, .45]} radius={.03} smoothness={3} castShadow><meshStandardMaterial color="#282A27" roughness={.46} /></RoundedBox>
      <mesh position={[0, .056, -.08]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[.22, .2]} /><meshBasicMaterial color="#84A4A0" /></mesh>
    </group>
    <Sign title="THE CASHIER" subtitle="TAP TO ADD TO YOUR DABBA" width={3.6} position={[0, 3.72, -.18]} />
  </group>
}

function GlassBay({ width, height, position, rotation = [0, 0, 0], divisions = 2 }) {
  return <group position={position} rotation={rotation}>
    <mesh><boxGeometry args={[width - .1, height - .1, .035]} />
      <meshPhysicalMaterial color="#B7D7D6" transparent opacity={.24} roughness={.13} metalness={.08} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
    {Array.from({ length: divisions + 1 }, (_, i) => <mesh key={i} position={[-width / 2 + i * width / divisions, 0, 0]} castShadow>
      <boxGeometry args={[.085, height, .095]} /><meshStandardMaterial color="#514532" metalness={.22} roughness={.43} />
    </mesh>)}
    {[-height / 2, 0, height / 2].map((y) => <mesh key={y} position={[0, y, 0]} castShadow>
      <boxGeometry args={[width, .085, .095]} /><meshStandardMaterial color="#514532" metalness={.22} roughness={.43} />
    </mesh>)}
    {Array.from({ length: divisions }, (_, i) => <mesh key={`glint${i}`} position={[-width / 2 + (i + .38) * width / divisions, .24, .022]} rotation={[0, 0, -.13]}>
      <planeGeometry args={[.026, height * .67]} /><meshBasicMaterial color="#FFF9E9" transparent opacity={.19} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>)}
  </group>
}

function OutdoorView({ side, map }) {
  return <group>
    <mesh position={[0, 3.5, side * 25]} rotation={[0, side > 0 ? Math.PI : 0, 0]}>
      <planeGeometry args={[36, 12]} /><meshBasicMaterial map={map} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, -.07, side * 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[29, 12]} /><meshStandardMaterial color="#D7C4A3" roughness={.94} />
    </mesh>
    {[-8, -4.8, 5.1, 8].map((x, i) => <group key={x} position={[x, 0, side * (18.5 + i % 2)]}>
      <mesh position={[0, 1.2, 0]} castShadow><cylinderGeometry args={[.1, .16, 2.4, 8]} /><meshStandardMaterial color="#6E5B42" roughness={.95} /></mesh>
      <mesh position={[0, 2.6, 0]} scale={[.82, 1.32, .82]} castShadow><sphereGeometry args={[1, 12, 9]} /><meshStandardMaterial color={i % 2 ? '#658C65' : '#7A9D6D'} roughness={.96} /></mesh>
    </group>)}
    <mesh position={[0, .38, side * 18]}><boxGeometry args={[26, .76, .38]} /><meshStandardMaterial color="#BBA98C" roughness={.89} /></mesh>
  </group>
}

function SideOutdoorView({ side, map }) {
  return <group>
    <mesh position={[side * 22, 3.5, 5]} rotation={[0, side < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <planeGeometry args={[27, 12]} /><meshBasicMaterial map={map} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[side * 15, -.07, 9]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[11, 14]} /><meshStandardMaterial color="#D6C7A8" roughness={.95} />
    </mesh>
    {[10.5, 13.2].map((z) => <group key={z} position={[side * 12.6, 0, z]}>
      <mesh position={[0, .27, 0]}><boxGeometry args={[.75, .55, .75]} /><meshStandardMaterial color="#B97150" roughness={.9} /></mesh>
      <mesh position={[0, 1.35, 0]} castShadow><cylinderGeometry args={[.055, .085, 1.8, 7]} /><meshStandardMaterial color="#536A4C" roughness={.95} /></mesh>
      <mesh position={[0, 2.25, 0]} scale={[.65, 1.05, .65]} castShadow><sphereGeometry args={[1, 12, 9]} /><meshStandardMaterial color="#6D956D" roughness={.94} /></mesh>
    </group>)}
  </group>
}

function EntranceDoor({ onExit }) {
  return <group position={[0, 0, 14.08]} onClick={(e) => { e.stopPropagation(); onExit() }}
    onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
    onPointerOut={() => { document.body.style.cursor = '' }}>
    {[-1.24, 1.24].map((x) => <mesh key={x} position={[x, 2.25, 0]} castShadow>
      <boxGeometry args={[.14, 4.5, .19]} /><meshStandardMaterial color={WALNUT} roughness={.58} />
    </mesh>)}
    <mesh position={[0, 4.49, 0]} castShadow><boxGeometry args={[2.62, .16, .19]} /><meshStandardMaterial color={WALNUT} roughness={.58} /></mesh>
    <mesh position={[0, .055, 0]}><boxGeometry args={[2.62, .11, .36]} /><meshStandardMaterial color={BRASS} metalness={.36} roughness={.33} /></mesh>
    <group position={[-1.17, 0, 0]} rotation={[0, .3, 0]}>
      <mesh position={[1.1, 2.22, 0]}><boxGeometry args={[2.15, 4.34, .04]} />
        <meshPhysicalMaterial color="#BBDDDC" transparent opacity={.29} roughness={.09} metalness={.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {[.05, 2.15].map((x) => <mesh key={x} position={[x, 2.22, 0]} castShadow>
        <boxGeometry args={[.11, 4.35, .15]} /><meshStandardMaterial color={WALNUT} roughness={.55} />
      </mesh>)}
      {[.08, 2.2, 4.34].map((y) => <mesh key={y} position={[1.1, y, 0]} castShadow>
        <boxGeometry args={[2.2, .105, .15]} /><meshStandardMaterial color={WALNUT} roughness={.55} />
      </mesh>)}
      <mesh position={[1.1, 1.02, 0]}><boxGeometry args={[2.04, .4, .07]} /><meshStandardMaterial color="#D4B484" roughness={.74} /></mesh>
      <mesh position={[1.9, 2.2, -.16]} castShadow><boxGeometry args={[.07, .55, .12]} /><meshStandardMaterial color={BRASS} metalness={.46} roughness={.31} /></mesh>
    </group>
    <Sign title="BACK TO THE SITE" subtitle="TAP THE DOOR" width={2.8} color="#FFC21A" position={[0, 5.02, -.07]} rotation={[0, Math.PI, 0]} />
  </group>
}

function DisplayIsland({ z, title, subtitle, accent, items, maps, onPick, selectedId }) {
  return <group position={[0, 0, z]}>
    <RoundedBox args={[3.75, .49, 1.95]} radius={.065} smoothness={3} position={[0, .6, 0]} castShadow receiveShadow>
      <meshStandardMaterial map={maps.wood} roughness={.63} />
    </RoundedBox>
    {[-1.55, 1.55].map((x) => <mesh key={x} position={[x, .2, 0]} castShadow>
      <boxGeometry args={[.15, .55, 1.62]} /><meshStandardMaterial color={WALNUT} roughness={.6} />
    </mesh>)}
    <RoundedBox args={[3.9, .12, 2.04]} radius={.04} smoothness={3} position={[0, .9, 0]} castShadow receiveShadow>
      <meshStandardMaterial map={maps.stone} roughness={.48} />
    </RoundedBox>
    <mesh position={[0, .824, 1.005]}><boxGeometry args={[3.72, .025, .025]} /><meshStandardMaterial color={BRASS} metalness={.39} roughness={.34} /></mesh>
    <RoundedBox args={[3.38, .24, .63]} radius={.025} smoothness={3} position={[0, 1.08, -.39]} castShadow receiveShadow>
      <meshStandardMaterial color={accent} roughness={.74} />
    </RoundedBox>
    <mesh position={[0, 1.05, -.06]}><boxGeometry args={[3.3, .025, .025]} /><meshStandardMaterial color={BRASS} metalness={.4} roughness={.32} /></mesh>
    {items.slice(0, 3).map((p, i) => <ProductPack key={`back${p.id}`} product={p} size={p.sizes?.[0]} position={[(i - 1) * 1.13, 1.79, -.38]} onPick={onPick} selected={selectedId === p.id} />)}
    {items.slice(3, 5).map((p, i) => <ProductPack key={`front${p.id}`} product={p} size={p.sizes?.[0]} position={[(i ? .63 : -.63), 1.51, .49]} onPick={onPick} selected={selectedId === p.id} />)}
    <Sign title={title} subtitle={subtitle} width={2.72} color={accent} position={[0, .57, 1.02]} />
  </group>
}

function Room({ onPick, onCashier, onExit, selectedId, paused }) {
  const maps = useMemo(() => ({ floor: surfaceTexture('floor'), plaster: surfaceTexture('plaster'), wood: surfaceTexture('wood'), stone: surfaceTexture('stone'), outside: exteriorTexture() }), [])
  useEffect(() => () => Object.values(maps).forEach((map) => map.dispose()), [maps])
  return <>
    <color attach="background" args={['#F6E9D5']} />
    <fog attach="fog" args={['#F6E9D5', 30, 58]} />
    <ambientLight intensity={.48} />
    <hemisphereLight args={['#FFF5E0', '#70513B', .9]} />
    <directionalLight position={[-5, 12, 7]} intensity={1.75} color="#FFF2DB" castShadow shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={16} shadow-camera-bottom={-16}
      shadow-camera-near={1} shadow-camera-far={35} shadow-bias={-.0002} shadow-normalBias={.035} />
    {[9, 2, -5, -11].map((z) => <pointLight key={z} position={[0, 5.38, z]} intensity={24} distance={9} decay={2} color="#FFE3AE" />)}
    {[[-7.1, 8], [-7.1, 2], [-7.1, -4], [-7.1, -10], [7.1, 7], [7.1, 0], [7.1, -7]].map(([x, z]) =>
      <pointLight key={`${x}-${z}`} position={[x, 4.65, z]} intensity={12} distance={6.5} decay={2} color="#FFF0D2" />)}
    <OutdoorView side={-1} map={maps.outside} /><OutdoorView side={1} map={maps.outside} />
    <SideOutdoorView side={-1} map={maps.outside} /><SideOutdoorView side={1} map={maps.outside} />

    <mesh position={[0, -.035, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[21, 29]} /><meshStandardMaterial map={maps.floor} bumpMap={maps.floor} bumpScale={.015} roughness={.91} />
    </mesh>
    <RoundedBox args={[2.58, .023, 12.2]} radius={.008} smoothness={2} position={[0, .001, 4.1]} receiveShadow>
      <meshStandardMaterial color="#B26445" roughness={.95} />
    </RoundedBox>
    {[-1.16, 1.16].map((x) => <mesh key={x} position={[x, .016, 4.1]}><boxGeometry args={[.035, .006, 11.8]} /><meshStandardMaterial color="#E4B77A" roughness={.9} /></mesh>)}

    {[-1, 1].map((s) => <group key={s}>
      <mesh position={[s * 10.25, 2.95, -2.2]} receiveShadow><boxGeometry args={[.3, 6, 24.4]} /><meshStandardMaterial map={maps.plaster} bumpMap={maps.plaster} bumpScale={.012} roughness={.98} /></mesh>
      <mesh position={[s * 10.25, .84, 12.2]}><boxGeometry args={[.3, 1.68, 4.2]} /><meshStandardMaterial map={maps.plaster} roughness={.98} /></mesh>
      <mesh position={[s * 10.25, 5.63, 12.2]}><boxGeometry args={[.3, .75, 4.2]} /><meshStandardMaterial map={maps.plaster} roughness={.98} /></mesh>
      <GlassBay width={4.14} height={3.53} position={[s * 10.11, 3.49, 12.2]} rotation={[0, -s * Math.PI / 2, 0]} divisions={2} />
      <mesh position={[s * 10.04, .84, 0]} receiveShadow><boxGeometry args={[.09, 1.68, 28.8]} /><meshStandardMaterial color={s < 0 ? '#D7B298' : '#C4D6BF'} roughness={.83} /></mesh>
      <mesh position={[s * 9.97, 1.71, 0]}><boxGeometry args={[.11, .095, 28.85]} /><meshStandardMaterial map={maps.wood} roughness={.58} /></mesh>
      <mesh position={[s * 9.97, .14, 0]}><boxGeometry args={[.13, .28, 28.85]} /><meshStandardMaterial map={maps.wood} roughness={.58} /></mesh>
      {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[s * 9.98, .87, -13.6 + i * 1.28]}>
        <boxGeometry args={[.085, 1.55, .045]} /><meshStandardMaterial color={s < 0 ? '#BD9279' : '#A4BEA5'} roughness={.86} />
      </mesh>)}
      <mesh position={[s * 10.04, 5.5, 0]}><boxGeometry args={[.14, .18, 28.9]} /><meshStandardMaterial map={maps.wood} roughness={.65} /></mesh>
    </group>)}
    <mesh position={[-6.15, 2.95, -14.3]} receiveShadow><boxGeometry args={[8.5, 6, .3]} /><meshStandardMaterial map={maps.plaster} roughness={.98} /></mesh>
    <mesh position={[8.75, 2.95, -14.3]} receiveShadow><boxGeometry args={[3.3, 6, .3]} /><meshStandardMaterial map={maps.plaster} roughness={.98} /></mesh>
    <mesh position={[0, .85, -14.3]}><boxGeometry args={[3.9, 1.7, .3]} /><meshStandardMaterial map={maps.plaster} roughness={.98} /></mesh>
    <mesh position={[0, 5.3, -14.3]}><boxGeometry args={[3.9, 1.4, .3]} /><meshStandardMaterial map={maps.plaster} roughness={.98} /></mesh>
    <mesh position={[4.53, .85, -14.3]}><boxGeometry args={[5.05, 1.7, .3]} /><meshStandardMaterial map={maps.plaster} roughness={.98} /></mesh>
    <mesh position={[4.53, 5.3, -14.3]}><boxGeometry args={[5.05, 1.4, .3]} /><meshStandardMaterial map={maps.plaster} roughness={.98} /></mesh>
    <mesh position={[0, .84, -14.08]}><boxGeometry args={[20.35, 1.68, .08]} /><meshStandardMaterial color="#E1C5AA" roughness={.86} /></mesh>
    <mesh position={[0, 1.71, -14.02]}><boxGeometry args={[20.5, .095, .1]} /><meshStandardMaterial map={maps.wood} roughness={.62} /></mesh>
    <mesh position={[0, .14, -14.02]}><boxGeometry args={[20.5, .28, .12]} /><meshStandardMaterial map={maps.wood} roughness={.62} /></mesh>
    <GlassBay width={3.86} height={2.91} position={[0, 3.18, -14.04]} divisions={2} />
    <GlassBay width={5.01} height={2.91} position={[4.53, 3.18, -14.04]} divisions={3} />

    <mesh position={[0, 5.68, 14.3]}><boxGeometry args={[20.8, .63, .3]} /><meshStandardMaterial map={maps.plaster} roughness={.98} /></mesh>
    <mesh position={[0, .075, 14.3]}><boxGeometry args={[20.8, .15, .3]} /><meshStandardMaterial map={maps.stone} roughness={.7} /></mesh>
    <GlassBay width={8.88} height={5.28} position={[-5.72, 2.76, 14.1]} divisions={3} />
    <GlassBay width={8.88} height={5.28} position={[5.72, 2.76, 14.1]} divisions={3} />
    <EntranceDoor onExit={onExit} />

    <mesh position={[0, 5.88, 0]} receiveShadow><boxGeometry args={[21, .18, 29]} /><meshStandardMaterial color="#F4E7D1" roughness={.98} /></mesh>
    {[-7.55, -3.75, 3.75, 7.55].map((x) => <mesh key={x} position={[x, 5.7, 0]} castShadow><boxGeometry args={[.15, .23, 28.6]} /><meshStandardMaterial map={maps.wood} roughness={.67} /></mesh>)}
    {[10, 3, -4, -11].map((z) => <group key={z}>
      <mesh position={[0, 5.72, z]}><boxGeometry args={[18.7, .13, .16]} /><meshStandardMaterial map={maps.wood} roughness={.68} /></mesh>
      <mesh position={[0, 5.64, z]}><boxGeometry args={[4.6, .055, .12]} /><meshStandardMaterial color={INK} roughness={.45} /></mesh>
      {[-1.45, 0, 1.45].map((x) => <group key={x} position={[x, 5.57, z]}>
        <mesh castShadow><cylinderGeometry args={[.22, .31, .32, 16]} /><meshStandardMaterial color="#4D3A2B" metalness={.18} roughness={.42} /></mesh>
        <mesh position={[0, -.17, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[.23, 16]} /><meshBasicMaterial color="#FFE9B6" /></mesh>
      </group>)}
    </group>)}
    {[8, 2, -4, -10].map((z, i) => <Rack key={`seed${z}`} items={seedRacks[i]} side="left" z={z} title={i === 0 ? 'Seeds & nuts' : i === 1 ? 'Dried fruit' : i === 2 ? 'Berries & mixes' : 'Seeds & dates'} subtitle={`Shelf ${i + 1} · tap a pouch`} color={i % 2 ? '#F7BFD0' : '#FFC21A'} onPick={onPick} selectedId={selectedId} maps={maps} />)}
    {[7, 0, -7].map((z, i) => <Rack key={`spice${z}`} items={spiceRacks[i]} side="right" z={z} title={['Powdered', 'Whole', 'Seasoning & herbs'][i]} subtitle={`${spiceRacks[i].length} spices · tap a pouch`} color={['#FFC21A', '#9BE8E0', '#F7BFD0'][i]} onPick={onPick} selectedId={selectedId} maps={maps} columns={4} />)}
    <BackDisplay onPick={onPick} selectedId={selectedId} maps={maps} />
    <Cashier onOpen={onCashier} paused={paused} maps={maps} />
    <DisplayIsland z={5.3} title="PANTRY FAVOURITES" subtitle="A LITTLE OF EVERYTHING" accent="#E8C479" items={frontEdit} maps={maps} onPick={onPick} selectedId={selectedId} />
    <DisplayIsland z={-3.45} title="THE TADKA EDIT" subtitle="THE GOOD STUFF, UP FRONT" accent="#F2A68E" items={backEdit} maps={maps} onPick={onPick} selectedId={selectedId} />
    <TableSet x={-5.1} z={1.15} maps={maps} /><TableSet x={5.1} z={-1.35} maps={maps} />
    <Plant x={-7.4} z={11} /><Plant x={7.4} z={11} /><Plant x={-7.1} z={-11} size={.9} /><Plant x={7.15} z={-11.3} size={.8} />
    <WallFrame x={-8} color="#B95F3F" title="GOOD FOOD" subtitle="GOOD COMPANY" />
    <WallFrame x={8} color="#CC9C3D" title="MORE MASALA" subtitle="MORE MEMORIES" />
    <Sign title="KESARI" subtitle="TURN UP THE MASALA" width={4.6} color="#FFC21A" position={[0, 5.08, -14.07]} />
  </>
}

const PRESETS = {
  entrance: [0, 11.4, 0], seeds: [-4.3, 6.5, Math.PI / 2],
  powdered: [4.4, 6.5, -Math.PI / 2], whole: [4.4, -.2, -Math.PI / 2],
  seasoning: [4.4, -6.7, -Math.PI / 2], makhana: [-4.4, -7.8, 0], cashier: [0, -6.3, 0],
}

function CameraWalk({ controls, look, jump }) {
  useEffect(() => { if (!jump) return; const p = PRESETS[jump.key]; if (p) controls.current.teleport = p }, [jump, controls])
  useFrame((state, dt) => {
    const camera = state.camera
    if (controls.current.teleport) {
      const [x, z, yaw] = controls.current.teleport
      camera.position.set(x, EYE_HEIGHT, z); look.current.yaw = yaw; look.current.pitch = 0
      controls.current.teleport = null
    }
    camera.rotation.order = 'YXZ'
    camera.rotation.y = look.current.yaw
    camera.rotation.x = look.current.pitch
    const c = controls.current
    const forward = Number(c.forward) - Number(c.back)
    const sideways = Number(c.right) - Number(c.left)
    if (!forward && !sideways) return
    const mag = Math.hypot(forward, sideways)
    const step = Math.min(dt, .05) * 3.5 / mag
    const a = look.current.yaw
    const nx = camera.position.x + (-Math.sin(a) * forward + Math.cos(a) * sideways) * step
    const nz = camera.position.z + (-Math.cos(a) * forward - Math.sin(a) * sideways) * step
    const valid = (x, z) => Math.abs(x) < 7.75 && z > -9.2 && z < 13.45 &&
      Math.hypot(x + 5.1, z - 1.15) > 1.65 && Math.hypot(x - 5.1, z + 1.35) > 1.65 &&
      !(Math.abs(x) < 2.14 && Math.abs(z - 5.3) < 1.42) &&
      !(Math.abs(x) < 2.14 && Math.abs(z + 3.45) < 1.42) &&
      !(Math.abs(x) < 2.15 && z < -7.7)
    if (valid(nx, camera.position.z)) camera.position.x = nx
    if (valid(camera.position.x, nz)) camera.position.z = nz
  })
  return null
}

export default function StoreScene({ controls, look, jump, onPick, onCashier, onExit, selectedId, paused, onReady }) {
  return <Canvas shadows={{ type: THREE.PCFSoftShadowMap }} dpr={[1, 1.5]} camera={{ position: [0, EYE_HEIGHT, 11.4], fov: 66, near: .05, far: 70 }}
    gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
    onCreated={({ gl }) => { gl.toneMappingExposure = 1.32; onReady?.() }}>
    <CameraWalk controls={controls} look={look} jump={jump} />
    <Room onPick={onPick} onCashier={onCashier} onExit={onExit} selectedId={selectedId} paused={paused} />
  </Canvas>
}
