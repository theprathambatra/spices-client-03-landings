#!/usr/bin/env node
// taste.mjs — one entry point for every taste-skill script in this project (docs/playbook/TASTE-SKILL.md).
// Run from anywhere; paths, the GPU browser shim, working folders and logs are handled for you.
//
//   node site/tools/taste.mjs doctor                         self-test: node, browser, WebGL, install, library
//   node site/tools/taste.mjs draw <ws> <draw.mjs args>      deal a direction into .taste-skill/<ws>/ (ws = v1..v5 or a name)
//   node site/tools/taste.mjs query <lib> [words] [--where k=v] [--id X] [--full] [--limit N]
//                                                            search the library (directions heroes sections palettes
//                                                            type motions photos sites app)
//   node site/tools/taste.mjs lint [vN | path ...] [--app] [--json]
//   node site/tools/taste.mjs inspect <vN | url | file> [--out DIR] [--allow a,b] [--film] [--app] [--widths ...]
//   node site/tools/taste.mjs scenes <vN | url | file> [scenes.mjs args]
//   node site/tools/taste.mjs check <vN>                     lint + inspect (the gate a builder runs every round)
//   node site/tools/taste.mjs audit [vN ...]                 lint + inspect into docs/playbook/taste-audit/<vN>/ (default all five)
//   node site/tools/taste.mjs assets <assets.mjs args>       open-collection pictures (use --to site/public/<vN>/img)
//
// Targets: "vN" means $TASTE_BASE/vN/ (default https://spices-client-03-landings.vercel.app). For a local
// production preview: TASTE_BASE=http://localhost:531N (vite preview). Ports 5171-5175, 5180 (other client
// projects) and 5300 (the user's main dev server) are refused.
//
// Working files per workspace live in .taste-skill/<ws>/: direction.json (the dealt sheet), inspect/ (screenshots,
// report.json, inspect.txt, verdict.json), scenes/, lint.txt. The inspector reads the sheet's allowances and dealt
// fonts from there automatically.
//
// Deviations: docs/playbook/taste-deviations.json declares, per rule and per variation, the banned devices the brand
// keeps on purpose, each matched to specific elements and with a reason. inspect/check/audit accept a finding only
// when every measured instance matches a declaration; anything else still fails. lint requires every
// `taste-skill-ignore` comment to name a declared deviation id.
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join, resolve, relative, isAbsolute } from 'node:path'
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'

const here = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(here, '../..')
const SITE = join(ROOT, 'site')
const SKILL = join(ROOT, '.claude/skills/taste-skill')
const UPSTREAM = join(ROOT, 'repos/taste-skill/skills/taste-skill')
const AUDIT = join(ROOT, 'docs/playbook/taste-audit')
const DEVIATIONS = join(ROOT, 'docs/playbook/taste-deviations.json')
const WS = (name) => join(ROOT, '.taste-skill', name)
const BASE = (process.env.TASTE_BASE || 'https://spices-client-03-landings.vercel.app').replace(/\/$/, '')
const BANNED_PORTS = /:(517[1-5]|5180|5300)(\/|$)/

const env = { ...process.env, CHROME_PATH: process.env.CHROME_PATH || join(here, 'chrome-gpu.sh') }
const script = (s) => join(SKILL, 'scripts', s)
const isVar = (t) => /^v\d+$/.test(t)
const rel = (p) => relative(process.cwd(), p) || '.'
const die = (msg, code = 2) => { console.error(msg); process.exit(code) }

function target(t) {
  if (isVar(t)) return `${BASE}/${t}/`
  if (/^https?:\/\//.test(t)) return t
  const f = resolve(t)
  if (!existsSync(f)) die('No such file: ' + f)
  return f
}
function guard(url) { if (BANNED_PORTS.test(url)) die(`Refusing ${url}: ports 5171-5175 and 5180 belong to other client projects and 5300 is the user's main dev server. Use vite preview on 531N.`) }
function wsName(t) {
  if (isVar(t)) return t
  const m = String(t).match(/\/(v\d+)\/?(?:index\.html)?$/)
  return m ? m[1] : 'page'
}
// run a node script; tee its output to a log file when one is given
function run(file, args, { cwd = ROOT, log } = {}) {
  const r = spawnSync(process.execPath, [file, ...args], { cwd, env, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: log ? ['ignore', 'pipe', 'pipe'] : 'inherit' })
  if (log) {
    const out = (r.stdout || '') + (r.stderr ? '\n' + r.stderr : '')
    process.stdout.write(out)
    mkdirSync(dirname(log), { recursive: true }); writeFileSync(log, out)
  }
  if (r.error) die(String(r.error))
  return r.status ?? 1
}
const flagVal = (args, k) => { const i = args.indexOf('--' + k); return i === -1 ? undefined : args[i + 1] }

// ---------- deviations ----------
function loadDeviations() {
  if (!existsSync(DEVIATIONS)) return []
  let j; try { j = JSON.parse(readFileSync(DEVIATIONS, 'utf8')) } catch (e) { die('docs/playbook/taste-deviations.json is not valid JSON: ' + e.message) }
  const list = Array.isArray(j.deviations) ? j.deviations : []
  for (const d of list) {
    if (!d.id || !d.rule || !d.match || !d.reason) die(`Deviation ${JSON.stringify(d).slice(0, 120)} needs id, rule, match and reason.`)
    try { new RegExp(d.match, 'i') } catch { die(`Deviation ${d.id}: match is not a valid regular expression.`) }
  }
  return list
}
function samplesOf(msg) {
  const i = msg.indexOf(': '); if (i === -1) return []
  const tail = msg.slice(i + 2).replace(/\.$/, '')
  const parts = tail.includes(' | ') ? tail.split(' | ') : tail.split('; ')
  return parts.map((s) => s.trim()).filter(Boolean)
}
// A finding is declared only when every measured instance it lists matches a declaration in scope, and the
// count it reports is no larger than the instances it lists (so nothing unseen hides behind a declaration).
function judgeDeclared(findings, name, devs) {
  const declared = [], open = []
  for (const f of findings) {
    const cands = devs.filter((d) => d.rule === f.id && [].concat(d.scope || '*').some((s) => s === '*' || s === name))
    if (!cands.length) { open.push(f); continue }
    const res = cands.map((d) => new RegExp(d.match, 'i'))
    const samples = samplesOf(f.message)
    const count = Number((f.message.match(/^(\d+)\b/) || [])[1]) || null
    const max = cands.reduce((a, d) => (d.max ? a + d.max : a), 0) || Infinity
    let ok = samples.length ? samples.every((s) => res.some((r) => r.test(s))) : res.some((r) => r.test(f.message))
    if (samples.length && count != null && count > samples.length) ok = false
    if (count != null && count > max) ok = false
    if (ok) declared.push({ ...f, deviation: cands.map((d) => d.id) }); else open.push({ ...f, declaredButUnmatched: cands.map((d) => d.id) })
  }
  return { declared, open }
}

// ---------- commands ----------
const [cmd, ...rest] = process.argv.slice(2)

if (cmd === 'inspect') inspect(rest)
else if (cmd === 'check') { const v = rest[0]; if (!v) die('check <vN>'); const l = lint([v], { log: join(WS(wsName(v)), 'lint.txt') }); const i = inspect(rest, { exit: false }); process.exit(l || i ? 1 : 0) }
else if (cmd === 'audit') {
  const vs = rest.length ? rest : ['v1', 'v2', 'v3', 'v4', 'v5']; let bad = 0
  for (const v of vs) {
    console.log(`\n================ ${v} ================`)
    bad |= lint([v], { log: join(AUDIT, v, 'lint.txt') })
    bad |= inspect([v, '--out', join(AUDIT, v)], { exit: false })
  }
  process.exit(bad ? 1 : 0)
} else if (cmd === 'lint') process.exit(lint(rest))
else if (cmd === 'scenes') {
  const t = rest.shift(); if (!t) die('scenes <vN | url | file>')
  const u = target(t); guard(u)
  if (!rest.includes('--out')) rest.push('--out', join(WS(wsName(t)), 'scenes'))
  process.exit(run(script('scenes.mjs'), [u, ...rest], { cwd: SITE }))
} else if (cmd === 'draw') {
  const ws = rest.shift(); if (!ws || ws.startsWith('--')) die('draw <workspace> <draw.mjs args>   e.g. draw v3 --sector ecommerce --brief "..." --options 3')
  const out = WS(ws); mkdirSync(out, { recursive: true })
  process.exit(run(script('draw.mjs'), [...rest, '--out', out]))
} else if (cmd === 'assets') process.exit(run(script('assets.mjs'), rest))
else if (cmd === 'query') await query(rest)
else if (cmd === 'doctor') await doctor()
else { console.error(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 30).join('\n')); process.exit(2) }

function inspect(args, { exit = true } = {}) {
  args = [...args]
  const t = args.shift(); if (!t) die('inspect <vN | url | file> [--out DIR] [--allow a,b] [--film] [--app]')
  const u = target(t); guard(u)
  const name = wsName(t)
  let out = flagVal(args, 'out')
  if (out) { out = resolve(out); const i = args.indexOf('--out'); args.splice(i, 2) } else out = join(WS(name), 'inspect')
  // the dealt sheet's allowances: picked up by inspect.mjs from <out>/../direction.json; passed explicitly otherwise
  const sheet = join(WS(name), 'direction.json')
  if (existsSync(sheet) && resolve(out, '..') !== WS(name)) {
    try { const a = JSON.parse(readFileSync(sheet, 'utf8')).allow || []; if (a.length) { const i = args.indexOf('--allow'); if (i === -1) args.push('--allow', a.join(',')); else args[i + 1] += ',' + a.join(',') } } catch {}
  }
  if (existsSync(join(SITE, '.taste-skill/direction.json'))) console.error('warning: site/.taste-skill/direction.json exists and would override the workspace sheet; delete it.')
  const status = run(script('inspect.mjs'), [u, '--out', out, ...args], { cwd: SITE, log: join(out, 'inspect.txt') })
  const reportPath = join(out, 'report.json')
  if (!existsSync(reportPath)) { if (exit) process.exit(status || 1); return status || 1 }
  const report = JSON.parse(readFileSync(reportPath, 'utf8'))
  const { declared, open } = judgeDeclared(report.findings, name, loadDeviations())
  const fails = open.filter((f) => f.level === 'FAIL'), warns = open.filter((f) => f.level === 'WARN')
  const lines = []
  if (declared.length) { lines.push('', 'DECLARED DEVIATIONS (docs/playbook/taste-deviations.json; every measured instance matched)'); for (const f of declared) lines.push(`  [${f.id}] ${f.level} → accepted as ${f.deviation.join(', ')}`) }
  const unmatched = open.filter((f) => f.declaredButUnmatched)
  if (unmatched.length) { lines.push('', 'DECLARED BUT NOT COVERED (an instance outside the declaration, or more instances than the meter could list)'); for (const f of unmatched) lines.push(`  [${f.id}] ${f.level}  ${f.message.slice(0, 200)}`) }
  lines.push('', `VERDICT ${name}: ${fails.length} FAIL, ${warns.length} WARN after ${declared.length} declared deviation(s) — ${fails.length ? 'NOT DONE' : 'gate passed; now critique the screenshots (references/critique.md)'}`)
  console.log(lines.join('\n'))
  writeFileSync(join(out, 'verdict.json'), JSON.stringify({ target: u, at: new Date().toISOString(), pass: !fails.length, fails: fails.length, warns: warns.length, declared, open }, null, 1))
  writeFileSync(join(out, 'inspect.txt'), readFileSync(join(out, 'inspect.txt'), 'utf8') + lines.join('\n') + '\n')
  const code = fails.length ? 1 : 0
  if (exit) process.exit(code)
  return code
}

function lint(args, { log } = {}) {
  const flags = args.filter((a) => a.startsWith('--'))
  let paths = args.filter((a) => !a.startsWith('--')).map((p) => (isVar(p) ? join(SITE, p) : resolve(p)))
  if (!paths.length) paths = [join(SITE, 'shared'), ...readdirSync(SITE).filter(isVar).map((v) => join(SITE, v))]
  if (!log && args.filter((a) => !a.startsWith('--')).length === 1 && isVar(args[0])) log = join(WS(args[0]), 'lint.txt')
  const status = run(script('lint.mjs'), [...paths, ...flags], { cwd: ROOT, log })
  // every taste-skill-ignore must name a declared deviation: `/* taste-skill-ignore: <deviation id> */`
  const ids = new Set(loadDeviations().map((d) => d.id)); const bad = []
  const walk = (p) => { const st = statSync(p); if (st.isDirectory()) { for (const f of readdirSync(p)) if (!['node_modules', 'dist', '.taste-skill'].includes(f) && !f.startsWith('.')) walk(join(p, f)) } else if (/\.(html?|css|jsx?|tsx?|mdx)$/.test(p)) readFileSync(p, 'utf8').split('\n').forEach((l, i) => { if (/taste-skill-ignore/.test(l)) { const id = (l.match(/taste-skill-ignore:\s*([\w-]+)/) || [])[1]; if (!id || !ids.has(id)) bad.push(`${relative(ROOT, p)}:${i + 1} ${id ? `names "${id}", which is not declared` : 'gives no deviation id'}`) } }) }
  for (const p of paths) if (existsSync(p)) walk(p)
  if (bad.length) { const msg = `\nUNDECLARED taste-skill-ignore (${bad.length}) — each must read taste-skill-ignore: <id from docs/playbook/taste-deviations.json>\n` + bad.slice(0, 20).map((b) => '  ' + b).join('\n') + '\n'; process.stdout.write(msg); if (log) writeFileSync(log, readFileSync(log, 'utf8') + msg) }
  return status || (bad.length ? 1 : 0)
}

async function query(args) {
  const lib = args.shift()
  const LIBS = ['directions', 'heroes', 'sections', 'palettes', 'type', 'motions', 'photos', 'sites', 'app']
  if (!LIBS.includes(lib)) die(`query <${LIBS.join('|')}> [words] [--where key=value] [--id X] [--full] [--limit N]`)
  const opts = {}; const words = []
  for (let i = 0; i < args.length; i++) { const a = args[i]; if (a === '--full') opts.full = true; else if (a.startsWith('--')) opts[a.slice(2)] = args[++i]; else words.push(a.toLowerCase()) }
  const data = JSON.parse(readFileSync(join(SKILL, 'library', lib + '.json'), 'utf8'))
  let rows
  if (lib === 'photos') rows = Object.entries(data.sets).flatMap(([set, s]) => s.photos.map((p) => ({ set, url: `https://picsum.photos/id/${p.id}/1600/1000`, ...p })))
  else if (lib === 'app') rows = [...data.styles.map((x) => ({ kind: 'style', ...x })), ...data.shells.map((x) => ({ kind: 'shell', ...x })), ...data.patterns.map((x) => ({ kind: 'pattern', ...x })), ...Object.entries(data.kinds).map(([id, x]) => ({ kind: 'kind', id, ...x }))]
  else rows = data
  if (opts.id) rows = rows.filter((r) => String(r.id) === opts.id)
  if (opts.where) { const [k, v] = opts.where.split('='); rows = rows.filter((r) => [].concat(r[k] ?? []).some((x) => String(x).toLowerCase().includes(String(v).toLowerCase()))) }
  if (words.length) rows = rows.filter((r) => { const s = JSON.stringify(r).toLowerCase(); return words.every((w) => s.includes(w)) })
  const first = (s, n = 1) => String(s || '').split(/(?<=\.)\s/).slice(0, n).join(' ')
  const famOf = await import(pathToFileURL(script('lib/rules.mjs')).href).then((m) => m.colourFamily).catch(() => null)
  const hsl = (hex) => { const n = parseInt(String(hex).slice(1, 7), 16); const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); const l = (mx + mn) / 2; let h = 0, s = 0; if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60 } return { h: Math.round(h), s, l } }
  const DEFAULT_FACES = /^(Inter|Poppins|Montserrat|Roboto|Open Sans|Space Grotesk|Instrument Serif|Playfair Display|Plus Jakarta Sans|Outfit|Sora|Lato|Nunito|Raleway)$/i
  const line = {
    directions: (r) => `${r.id} — ${r.name} | sectors: ${r.sectors.join(',')} | tones: ${(r.tones || []).join(',')}\n    idea: ${first(r.idea, 2)}`,
    heroes: (r) => `${r.id} — ${r.name} (${r.archetype}) | directions: ${(r.directions || []).join(',')}${(r.needs || []).length ? ' | needs: ' + r.needs.join(',') : ''}\n    ${first(r.blueprint, 2)}`,
    sections: (r) => `${r.id} — [${r.role}] ${r.name} (${r.shape}) | tags: ${(r.tags || []).join(',')}${(r.needs || []).length ? ' | needs: ' + r.needs.join(',') : ''}\n    ${first(r.blueprint, 2)}`,
    palettes: (r) => { const bad = famOf ? [...new Set([r.bg, r.surface, r.accent, ...(r.fields || []).map((f) => f.bg)].filter(Boolean).map((c) => famOf(hsl(c))).filter(Boolean))] : []; return `${r.id} — ${r.name} | tags: ${(r.tags || []).join(',')} | bg ${r.bg} surface ${r.surface} ink ${r.ink} muted ${r.muted} accent ${r.accent}/${r.accentInk}${(r.fields || []).length ? ' | fields ' + r.fields.map((f) => f.bg + '/' + f.ink).join(' ') : ''}${bad.length ? ' | INSPECTOR FLAGS: ' + bad.join(',') : ''}\n    ${first(r.note)}` },
    type: (r) => `${r.id} — ${r.name} (${r.class}) | display ${r.display.family} ${r.display.weights || ''} [${r.display.source}] | text ${r.text.family} ${r.text.weights || ''}${[r.display.family, r.text.family].some((f) => DEFAULT_FACES.test(f)) ? ' | LINT default-font WARN' : ''}\n    ${first(r.note)}`,
    motions: (r) => `${r.id} — ${r.name}\n    ${first(r.description, 2)}`,
    photos: (r) => `${r.set}/${r.id} — ${r.alt} | ${r.tone} tone | ${(r.colours || []).join(',')}${r.calm && r.calm !== 'none' ? ' | calm: ' + r.calm : ''} | ${r.url}`,
    sites: (r) => `${r.id} — ${r.name} (${r.source}, ${r.score}, ${r.kind}) | ${r.archetype}\n    idea: ${first(r.idea)}`,
    app: (r) => `${r.kind}: ${r.id} — ${r.name || ''} ${first(r.idea || r.basis || r.note || r.blueprint || '')}`,
  }[lib]
  const limit = Number(opts.limit) || 25
  console.log(`${rows.length} match(es) in library/${lib}.json${words.length ? ` for "${words.join(' ')}"` : ''}${opts.where ? ` where ${opts.where}` : ''}${rows.length > limit ? ` (showing ${limit}; --limit N for more)` : ''}`)
  for (const r of rows.slice(0, limit)) console.log(opts.full ? JSON.stringify(r, null, 1) : line(r))
}

async function doctor() {
  let ok = true
  const say = (good, msg) => { console.log(`${good ? 'ok  ' : 'FAIL'} ${msg}`); if (!good) ok = false }
  const major = Number(process.versions.node.split('.')[0])
  say(major >= 22, `node ${process.version} (inspect.mjs and scenes.mjs need 22+ for the built-in WebSocket)`)
  say(existsSync(join(SKILL, 'SKILL.md')), `skill installed at ${relative(ROOT, SKILL)}`)
  if (existsSync(UPSTREAM)) { const d = spawnSync('diff', ['-rq', SKILL, UPSTREAM], { encoding: 'utf8' }); say(d.status === 0, d.status === 0 ? 'install is byte-identical to repos/taste-skill/skills/taste-skill (upstream 2.1.4)' : 'install differs from upstream:\n' + d.stdout) }
  for (const f of readdirSync(join(SKILL, 'library'))) { try { JSON.parse(readFileSync(join(SKILL, 'library', f), 'utf8')); } catch (e) { say(false, `library/${f} invalid JSON: ${e.message}`) } }
  say(true, `library: ${readdirSync(join(SKILL, 'library')).join(', ')}`)
  const scripts = [...readdirSync(join(SKILL, 'scripts')).filter((f) => f.endsWith('.mjs')).map((f) => join(SKILL, 'scripts', f)), ...readdirSync(join(SKILL, 'scripts/lib')).map((f) => join(SKILL, 'scripts/lib', f)), ...['base.js', 'charts.js', 'scenes/stage.js'].map((f) => join(SKILL, 'assets', f))]
  const bad = scripts.filter((f) => spawnSync(process.execPath, ['--check', f]).status !== 0)
  say(!bad.length, `${scripts.length} scripts parse (node --check)${bad.length ? ': broken ' + bad.join(', ') : ''}`)
  say(true, `known upstream gap: library/scenes.json and assets/scenes/<id>.js|css|demo are announced for 2.2 and not shipped; the draw deals no scenes (references/scenes.md §8 says build on the stage)`)
  const { findChrome, Browser } = await import(pathToFileURL(script('lib/cdp.mjs')).href)
  process.env.CHROME_PATH = env.CHROME_PATH
  const exe = findChrome(); say(!!exe, `browser launcher: ${exe}`)
  try {
    const b = await Browser.launch(); const p = await b.newPage({ width: 800, height: 600 })
    const gl = await p.eval(`(() => { const c = document.createElement('canvas'); const g = c.getContext('webgl2') || c.getContext('webgl'); if (!g) return null; const d = g.getExtension('WEBGL_debug_renderer_info'); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER) })()`)
    const ver = await b.send('Browser.getVersion'); await b.close()
    say(!!gl, `headless ${ver.product}: WebGL renderer = ${gl || 'none'}${gl && /swiftshader|software/i.test(gl) ? ' (software; 3D will be slow but renders)' : ''}`)
  } catch (e) { say(false, 'browser launch failed: ' + e.message.split('\n')[0]) }
  const devs = loadDeviations(); say(true, `deviations declared: ${devs.length} (${relative(ROOT, DEVIATIONS)})`)
  console.log(ok ? '\ndoctor: everything the taste-skill scripts need is in place.' : '\ndoctor: fix the FAIL lines above.')
  process.exit(ok ? 0 : 1)
}
