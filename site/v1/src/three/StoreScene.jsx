import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { products, inkOn } from '../brand.js'
import { magicProducts } from '../magicProducts.js'

const INK = '#1A1208'
const CREAM = '#FFF3DC'
const EYE_HEIGHT = 2.25
const seedRacks = [0, 1, 2, 3].map((n) => magicProducts.filter((p) => p.section === 'seeds').slice(n * 6, n * 6 + 6))
const spiceRacks = [
  products.filter((p) => p.cat === 'ground'),
  products.filter((p) => p.cat === 'whole'),
  products.filter((p) => !['ground', 'whole'].includes(p.cat)),
]

function labelTexture(title, subtitle, background = '#FFC21A') {
  const c = document.createElement('canvas')
  c.width = 768; c.height = 176
  const g = c.getContext('2d')
  g.fillStyle = INK; g.fillRect(0, 0, 768, 176)
  g.fillStyle = background; g.fillRect(12, 12, 744, 152)
  g.fillStyle = INK; g.textAlign = 'center'
  g.font = '900 77px Impact, Arial Black, sans-serif'; g.fillText(title.toUpperCase(), 384, 87, 700)
  g.font = 'bold 29px Arial, sans-serif'; g.fillText(subtitle.toUpperCase(), 384, 137, 680)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function packTexture(product, size) {
  const c = document.createElement('canvas')
  c.width = 320; c.height = 440
  const g = c.getContext('2d')
  const ink = inkOn(product.color)
  g.fillStyle = product.color; g.fillRect(0, 0, 320, 440)
  g.save(); g.translate(160, 208); g.globalAlpha = .13; g.fillStyle = '#ffffff'
  for (let i = 0; i < 14; i++) { g.rotate(Math.PI / 7); g.beginPath(); g.moveTo(0, 0); g.lineTo(-32, -430); g.lineTo(32, -430); g.fill() }
  g.restore()
  g.strokeStyle = INK; g.lineWidth = 15; g.strokeRect(8, 8, 304, 424)
  g.fillStyle = INK; g.fillRect(8, 8, 304, 39)
  g.fillStyle = CREAM; g.textAlign = 'center'
  g.font = '900 26px Impact, Arial Black, sans-serif'; g.fillText('KESARI', 160, 89)
  g.beginPath(); g.arc(160, 157, 43, 0, Math.PI * 2); g.fillStyle = CREAM; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke()
  g.fillStyle = INK; g.font = '900 43px Impact, Arial Black, sans-serif'; g.fillText(product.section === 'seeds' ? '✦' : product.section === 'makhana' ? '●' : '✳', 160, 172)
  const words = product.name.toUpperCase().split(' ')
  const lines = []
  words.forEach((word) => {
    const last = lines.length - 1
    if (last >= 0 && (lines[last] + ' ' + word).length <= 15) lines[last] += ' ' + word
    else lines.push(word)
  })
  const font = lines.some((line) => line.length > 13) ? 30 : 36
  g.font = `900 ${font}px Impact, Arial Black, sans-serif`; g.fillStyle = ink
  lines.slice(0, 3).forEach((line, i) => g.fillText(line, 160, 255 + i * 40, 285))
  g.fillStyle = CREAM; g.strokeStyle = INK; g.lineWidth = 6
  g.beginPath(); g.roundRect(90, 367, 140, 47, 22); g.fill(); g.stroke()
  g.fillStyle = INK; g.font = 'bold 30px Arial, sans-serif'; g.fillText(`${size}g`, 160, 400)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function Sign({ title, subtitle, width = 5.2, color = '#FFC21A', position = [0, 0, 0] }) {
  const map = useMemo(() => labelTexture(title, subtitle, color), [title, subtitle, color])
  useEffect(() => () => map.dispose(), [map])
  return <mesh position={position}><planeGeometry args={[width, width * .229]} /><meshBasicMaterial map={map} side={THREE.DoubleSide} /></mesh>
}

function ProductPack({ product, size, position, onPick, selected }) {
  const packSize = size || parseInt(product.weight, 10)
  const map = useMemo(() => packTexture(product, packSize), [product.id, packSize])
  useEffect(() => () => map.dispose(), [map])
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onPick(product.id, packSize) }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = '' }}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[.88, 1.13, .19]} /><meshStandardMaterial color={selected ? '#FFC21A' : INK} roughness={.7} /></mesh>
      <mesh position={[0, 0, .104]}><planeGeometry args={[.83, 1.08]} /><meshBasicMaterial map={map} /></mesh>
      {selected && <mesh position={[0, 0, -.03]}><boxGeometry args={[1.02, 1.27, .08]} /><meshBasicMaterial color="#FFC21A" /></mesh>}
    </group>
  )
}

function Rack({ items, side, z, title, subtitle, color, onPick, selectedId, columns = 3 }) {
  const left = side === 'left'
  const width = columns === 4 ? 5.7 : 4.7
  const rows = columns === 4 ? 3 : 2
  return (
    <group position={[left ? -9.42 : 9.42, 0, z]} rotation={[0, left ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <mesh position={[0, 2.35, -.32]}><boxGeometry args={[width, 4.7, .18]} /><meshStandardMaterial color="#653D22" /></mesh>
      <mesh position={[0, 2.35, -.425]}><boxGeometry args={[width + .12, 4.82, .07]} /><meshStandardMaterial color={INK} /></mesh>
      {[.65, 1.85, 3.05, 4.25].map((y) => <mesh key={y} position={[0, y, .11]}><boxGeometry args={[width + .2, .16, .8]} /><meshStandardMaterial color="#B76832" roughness={.8} /></mesh>)}
      <Sign title={title} subtitle={subtitle} color={color} width={width - .2} position={[0, 4.73, .16]} />
      {items.map((p, i) => {
        const col = i % columns
        const row = Math.floor(i / columns)
        if (row >= rows) return null
        const step = columns === 4 ? 1.29 : 1.37
        return <ProductPack key={p.id} product={p} position={[(col - (columns - 1) / 2) * step, 1.28 + row * 1.2, .28]} onPick={onPick} selected={selectedId === p.id} />
      })}
    </group>
  )
}

function Plant({ x, z, size = 1 }) {
  return <group position={[x, 0, z]} scale={size}>
    <mesh position={[0, .37, 0]}><cylinderGeometry args={[.32, .42, .7, 8]} /><meshStandardMaterial color="#E03A2F" /></mesh>
    <mesh position={[0, 1.1, 0]}><cylinderGeometry args={[.055, .07, 1.1, 7]} /><meshStandardMaterial color="#245C3C" /></mesh>
    {[0, 1.3, 2.6, 3.9, 5.2].map((a, i) => <mesh key={i} position={[Math.cos(a) * .28, 1.22 + (i % 2) * .25, Math.sin(a) * .28]} rotation={[.4, a, -.5]}>
      <sphereGeometry args={[.3, 8, 6]} /><meshStandardMaterial color={i % 2 ? '#347B4E' : '#66B260'} />
    </mesh>)}
  </group>
}

function TableSet({ x, z }) {
  return <group position={[x, 0, z]}>
    <mesh position={[0, .9, 0]}><cylinderGeometry args={[.85, .85, .13, 12]} /><meshStandardMaterial color="#FFC21A" /></mesh>
    <mesh position={[0, .45, 0]}><cylinderGeometry args={[.12, .22, .82, 8]} /><meshStandardMaterial color={INK} /></mesh>
    <mesh position={[0, .95, 0]}><sphereGeometry args={[.17, 8, 8]} /><meshStandardMaterial color="#E03A2F" /></mesh>
    {[-1, 1].map((s) => <group key={s} position={[s * 1.32, 0, 0]} rotation={[0, s > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <mesh position={[0, .5, 0]}><boxGeometry args={[.7, .12, .66]} /><meshStandardMaterial color="#F7BFD0" /></mesh>
      <mesh position={[0, .92, -.28]}><boxGeometry args={[.7, .8, .12]} /><meshStandardMaterial color="#F7BFD0" /></mesh>
      {[-.23, .23].map((v) => <mesh key={v} position={[v, .22, 0]}><cylinderGeometry args={[.06, .06, .42, 6]} /><meshStandardMaterial color={INK} /></mesh>)}
    </group>)}
  </group>
}

function WallFrame({ x, color }) {
  return <group position={[x, 3.22, -14.02]}>
    <mesh><boxGeometry args={[1.55, 1.75, .13]} /><meshStandardMaterial color={INK} /></mesh>
    <mesh position={[0, 0, .08]}><boxGeometry args={[1.33, 1.53, .06]} /><meshStandardMaterial color={CREAM} /></mesh>
    <mesh position={[0, .13, .123]}><circleGeometry args={[.49, 24]} /><meshBasicMaterial color={color} /></mesh>
    <mesh position={[0, -.34, .135]} rotation={[0, 0, -.3]}><capsuleGeometry args={[.12, .68, 4, 8]} /><meshBasicMaterial color="#2FA36B" /></mesh>
    <mesh position={[.17, -.04, .14]} rotation={[0, 0, .65]}><sphereGeometry args={[.16, 9, 7]} /><meshBasicMaterial color="#65B365" /></mesh>
  </group>
}

function Cashier({ onOpen, paused }) {
  const arm = useRef()
  useFrame((s) => { if (arm.current) arm.current.rotation.z = paused ? -.15 : -.15 + Math.sin(s.clock.elapsedTime * 2) * .16 })
  return <group position={[3.7, 0, -11.2]} onClick={(e) => { e.stopPropagation(); onOpen() }}
    onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
    onPointerOut={() => { document.body.style.cursor = '' }}>
    <mesh position={[0, 1.64, -.15]}><capsuleGeometry args={[.42, .55, 4, 8]} /><meshStandardMaterial color="#2FA36B" /></mesh>
    <mesh position={[0, 2.53, -.02]}><sphereGeometry args={[.44, 12, 10]} /><meshStandardMaterial color="#C98B62" /></mesh>
    <mesh position={[0, 2.78, -.13]}><sphereGeometry args={[.44, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={INK} /></mesh>
    <mesh position={[-.14, 2.55, .37]}><sphereGeometry args={[.036, 6, 6]} /><meshBasicMaterial color={INK} /></mesh>
    <mesh position={[.14, 2.55, .37]}><sphereGeometry args={[.036, 6, 6]} /><meshBasicMaterial color={INK} /></mesh>
    <mesh ref={arm} position={[.47, 2.03, .03]} rotation={[0, 0, -.15]}><capsuleGeometry args={[.12, .52, 4, 8]} /><meshStandardMaterial color="#C98B62" /></mesh>
    <mesh position={[-.49, 1.98, .03]} rotation={[0, 0, -.42]}><capsuleGeometry args={[.12, .52, 4, 8]} /><meshStandardMaterial color="#C98B62" /></mesh>
    <mesh position={[0, .82, .92]}><boxGeometry args={[3.4, 1.35, 1.25]} /><meshStandardMaterial color="#E03A2F" /></mesh>
    <mesh position={[0, .82, 1.56]}><boxGeometry args={[3.05, 1.1, .08]} /><meshStandardMaterial color="#FFC21A" /></mesh>
    <mesh position={[0, 1.57, .9]}><boxGeometry args={[3.6, .18, 1.45]} /><meshStandardMaterial color={INK} /></mesh>
    <Sign title="THE CASHIER" subtitle="TAP TO ADD TO YOUR DABBA" width={3.6} position={[0, 3.5, -.18]} />
  </group>
}

function Room({ onPick, onCashier, selectedId, paused }) {
  const makhana = magicProducts.find((p) => p.section === 'makhana')
  return <>
    <color attach="background" args={['#FFF3DC']} />
    <ambientLight intensity={1.35} />
    <hemisphereLight args={['#FFF5D6', '#80634F', 1.5]} />
    <directionalLight position={[3, 9, 8]} intensity={2.1} />
    <mesh position={[0, -.12, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[21, 29]} /><meshStandardMaterial color="#E8B889" /></mesh>
    <gridHelper args={[20, 20, '#A97450', '#D19B70']} position={[0, -.105, 0]} />
    <mesh position={[-10.25, 2.95, 0]}><boxGeometry args={[.3, 6, 29]} /><meshStandardMaterial color="#F7BFD0" /></mesh>
    <mesh position={[10.25, 2.95, 0]}><boxGeometry args={[.3, 6, 29]} /><meshStandardMaterial color="#9BE8E0" /></mesh>
    <mesh position={[0, 2.95, -14.3]}><boxGeometry args={[20.8, 6, .3]} /><meshStandardMaterial color="#FFE0AE" /></mesh>
    <mesh position={[0, 2.95, 14.3]}><boxGeometry args={[20.8, 6, .3]} /><meshStandardMaterial color="#FFF3DC" /></mesh>
    {[[-10, '#E03A2F'], [10, '#2FA36B']].map(([x, color]) => <mesh key={x} position={[x, .42, 0]}><boxGeometry args={[.38, .84, 29]} /><meshStandardMaterial color={color} /></mesh>)}
    <mesh position={[0, 5.82, 0]}><boxGeometry args={[21, .25, 29]} /><meshStandardMaterial color="#FFC21A" /></mesh>
    {[8, 2, -4, -10].map((z, i) => <Rack key={`seed${z}`} items={seedRacks[i]} side="left" z={z} title={i === 0 ? 'Seeds & nuts' : i === 1 ? 'Dried fruit' : i === 2 ? 'Berries & mixes' : 'Seeds & dates'} subtitle={`Shelf ${i + 1} · tap a pouch`} color={i % 2 ? '#F7BFD0' : '#FFC21A'} onPick={onPick} selectedId={selectedId} />)}
    {[7, 0, -7].map((z, i) => <Rack key={`spice${z}`} items={spiceRacks[i]} side="right" z={z} title={['Powdered', 'Whole', 'Seasoning & herbs'][i]} subtitle={`${spiceRacks[i].length} spices · tap a pouch`} color={['#FFC21A', '#9BE8E0', '#F7BFD0'][i]} onPick={onPick} selectedId={selectedId} columns={4} />)}
    <group position={[-4.5, 0, -13.36]}>
      <mesh position={[0, 2.28, -.18]}><boxGeometry args={[4.7, 4.6, .32]} /><meshStandardMaterial color="#713D21" /></mesh>
      {[.62, 1.8, 3.02].map((y) => <mesh key={y} position={[0, y, .18]}><boxGeometry args={[4.8, .14, .72]} /><meshStandardMaterial color="#B76832" /></mesh>)}
      <Sign title="Makhana" subtitle="100g & 200g" width={4.4} color="#E8C479" position={[0, 4.73, .18]} />
      {[100, 200, 100, 200, 100, 200].map((size, i) => <ProductPack key={i} product={makhana} size={size} position={[(i % 3 - 1) * 1.2, 1.26 + Math.floor(i / 3) * 1.2, .33]} onPick={onPick} selected={selectedId === makhana.id} />)}
    </group>
    <Cashier onOpen={onCashier} paused={paused} />
    <TableSet x={-2.45} z={1.7} /><TableSet x={2.45} z={-1.5} />
    <Plant x={-7.4} z={11} /><Plant x={7.4} z={11} /><Plant x={-7.1} z={-11} size={.8} />
    <WallFrame x={-8} color="#E03A2F" /><WallFrame x={8} color="#FFC21A" />
    <Sign title="KESARI" subtitle="TURN UP THE MASALA" width={5} color="#FFC21A" position={[.9, 5.08, -14.07]} />
    <Sign title="TAKE A WALK" subtitle="PICK A POUCH · ASK THE CASHIER" width={5.1} color="#F7BFD0" position={[0, 4.65, 14.08]} />
    {[[-6.5, '#E03A2F'], [0, '#2FA36B'], [6.5, '#2BA8E0']].map(([x, color]) => <group key={x} position={[x, 5.52, 0]}><mesh><cylinderGeometry args={[.5, .66, .7, 10]} /><meshStandardMaterial color={color} /></mesh><pointLight color="#FFF3DC" intensity={8} distance={8} /></group>)}
  </>
}

const PRESETS = {
  entrance: [0, 11.4, 0], seeds: [-4.3, 6.5, Math.PI / 2],
  powdered: [4.4, 6.5, -Math.PI / 2], whole: [4.4, -.2, -Math.PI / 2],
  seasoning: [4.4, -6.7, -Math.PI / 2], makhana: [-4.4, -7.8, 0], cashier: [3.6, -6, 0],
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
    const valid = (x, z) => Math.abs(x) < 7.75 && z > -9.2 && z < 12.25 &&
      Math.hypot(x + 2.45, z - 1.7) > 1.65 && Math.hypot(x - 2.45, z + 1.5) > 1.65 &&
      !(x > 1.7 && x < 5.7 && z < -7.4)
    if (valid(nx, camera.position.z)) camera.position.x = nx
    if (valid(camera.position.x, nz)) camera.position.z = nz
  })
  return null
}

export default function StoreScene({ controls, look, jump, onPick, onCashier, selectedId, paused, onReady }) {
  return <Canvas dpr={[1, 1.5]} camera={{ position: [0, EYE_HEIGHT, 11.4], fov: 66, near: .05, far: 70 }} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} onCreated={onReady}>
    <CameraWalk controls={controls} look={look} jump={jump} />
    <Room onPick={onPick} onCashier={onCashier} selectedId={selectedId} paused={paused} />
  </Canvas>
}
