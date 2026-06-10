/**
 * Pixi renderer for the hero field simulation.
 *
 * Consumes HeroSim's event stream. The sim ticks at 10Hz (stepped, terminal
 * cadence); rendering and transitions run at full frame rate. The camera is
 * static: the world is contain-fit once (re-fit on resize) and the field
 * grows from the seeded center cluster out to the edges. A DOM overlay gets
 * the same translate+scale so SQL text blocks and the coordinate labels stay
 * registered with the canvas.
 *
 * Cell motion language: births scale in 0.2→1 on the CSS `ease` curve (same
 * curve the coordinate labels use), deaths fade fast, cells blink before
 * splitting or growing a neighbor, and every center dot idles on a slow pulse.
 *
 * Client-only — import dynamically.
 */
import {
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
  Texture,
  type Ticker,
} from 'pixi.js'
import { HeroSim, mulberry32, SIM, type Region, type SimEvent, type Variant } from './sim'

/** sim params plus `speed`, a multiplier on the tick cadence */
export type HeroParams = Record<string, number>

export interface HeroEngine {
  destroy(): void
  setParams(p: HeroParams): void
}

/** world px per grid unit */
const UNIT = 44
const TICK_MS = 100
/** never let unit cells get smaller than this on screen (mobile crops instead) */
const MIN_UNIT_PX = 14

const EXPLOSION_URL = '/img/hero-explosion.png'

const DUR = {
  in: 260,
  inSplit: 180,
  out: 300,
  /** matches signalDelay × TICK_MS so the change lands as the blink ends */
  blink: 300,
}

/** variants with sequenced draw-in get more time to perform it */
const IN_DUR: Partial<Record<Variant, number>> = {
  panels: 650,
  dots: 800,
  flow: 500,
  hatch: 420,
  text: 420,
}

/** variants with a choreographed exit get more time to perform it */
const OUT_DUR: Partial<Record<Variant, number>> = {
  dots: 620,
  panels: 480,
  flow: 380,
  hatch: 380,
}

const C = {
  bg: '#141413',
  cellFill: 0x161614,
  cellStroke: 0x2e2e2a,
  dotGrey: 0xb9b9b3,
  dotMint: 0x86efac,
  green: 0x3ecf8e,
  greenBright: 0x6bf2a6,
  flowTick: 0x72ffa1,
  yellow: 0xffd84d,
  arrow: 0xc9c9c4,
  hatchFill: 0x0f1a13,
  hatchLine: 0x1d3526,
  hatchStroke: 0x2a3a2e,
  textBg: 0x201c08,
  textStroke: 0x39340f,
  panelMint: 0xa8f5c8,
}

const MONO = 'var(--font-mono)'
const PIXI_MONO = 'ui-monospace, Menlo, Monaco, monospace'
const LETTERS = 'SUPABASE'

const SNIPPETS = [
  `SELECT
  id,
  title,
  TS_RANK(search_vector, query)
    AS rank,
  TS_HEADLINE('english', body,
    query, 'MaxWords=20,
    MinWords=10') AS excerpt
FROM articles,
  PLAINTO_TSQUERY('english',
    'query terms here') query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 20;`,
  `WITH RECURSIVE org_tree AS (
  SELECT id, name, parent_id,
    1 AS depth
  FROM departments
  WHERE parent_id IS NULL
  UNION ALL
  SELECT d.id, d.name,
    d.parent_id, t.depth + 1
  FROM departments d
  JOIN org_tree t
    ON t.id = d.parent_id
)
SELECT REPEAT('  ', depth)
  || name AS tree
FROM org_tree;`,
  `SELECT
  occurred_at::date AS day,
  SUM(amount) OVER (
    ORDER BY occurred_at
    ROWS BETWEEN UNBOUNDED
      PRECEDING AND
      CURRENT ROW
  ) AS running_total
FROM orders o
JOIN order_items oi
  ON oi.order_id = o.id;`,
  `SELECT id, content,
  1 - (embedding <=> query)
    AS similarity
FROM documents
WHERE 1 - (embedding <=> query)
  > 0.78
ORDER BY embedding <=> query
LIMIT 12;`,
]

type Phase = 'in' | 'live' | 'out'

interface CellView {
  id: number
  root: Container
  textEl: HTMLDivElement | null
  /** per-variant inner draw-in, driven with eased progress 0→1 */
  update: ((e: number) => void) | null
  /** per-variant exit choreography, driven with eased progress 0→1 */
  exit: ((e: number) => void) | null
  /** the pulsing center dot, when the variant has one */
  dot: Graphics | null
  phase: Phase
  t: number
  dur: number
  /** ms into the active blink, or -1 when idle */
  blink: number
  microPhase: number
  microPeriod: number
}

/** CSS `ease` — cubic-bezier(0.25, 0.1, 0.25, 1), same curve as the labels */
function cubicBezierEase(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x
  const bx = 3 * (p2x - p1x) - cx
  const ax = 1 - cx - bx
  const cy = 3 * p1y
  const by = 3 * (p2y - p1y) - cy
  const ay = 1 - cy - by
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx
  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 5; i++) {
      const dx = sampleX(t) - x
      const d = sampleDX(t)
      if (Math.abs(dx) < 1e-4 || d === 0) break
      t -= dx / d
    }
    return sampleY(Math.min(1, Math.max(0, t)))
  }
}
const ease = cubicBezierEase(0.25, 0.1, 0.25, 1)
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export async function createHeroEngine(
  host: HTMLElement,
  overlay: HTMLElement,
  opts: { reducedMotion: boolean },
): Promise<HeroEngine> {
  const app = new Application()
  await app.init({
    background: C.bg,
    resizeTo: host as HTMLDivElement,
    antialias: true,
    resolution: Math.min(globalThis.devicePixelRatio || 1, 2),
    autoDensity: true,
  })
  const explosion = (await Assets.load(EXPLOSION_URL)) as Texture
  host.appendChild(app.canvas)
  app.canvas.style.position = 'absolute'
  app.canvas.style.inset = '0'

  const world = new Container()
  app.stage.addChild(world)

  const sim = new HeroSim(Math.floor(Math.random() * 0xffffffff))
  const views = new Map<number, CellView>()
  let snippetIdx = 0
  let elapsed = 0
  let tickMs = TICK_MS

  // Monotonic bbox (units) of everything ever born — drives the coordinate
  // labels that crawl outward as the structure grows.
  const bbox = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  let bboxDirty = false

  const labelTL = makeCoordLabel()
  const labelBR = makeCoordLabel()
  labelBR.style.transform = 'translateX(-100%)'
  overlay.append(labelTL, labelBR)

  function growBBox(r: Region) {
    bbox.minX = Math.min(bbox.minX, r.x)
    bbox.minY = Math.min(bbox.minY, r.y)
    bbox.maxX = Math.max(bbox.maxX, r.x + r.size)
    bbox.maxY = Math.max(bbox.maxY, r.y + r.size)
    bboxDirty = true
  }

  function updateLabels() {
    bboxDirty = false
    if (!Number.isFinite(bbox.minX)) return
    labelTL.textContent = '(0,0)'
    labelTL.style.left = `${bbox.minX * UNIT}px`
    labelTL.style.top = `${bbox.minY * UNIT - 26}px`
    labelTL.style.opacity = '1'
    const w = Math.round((bbox.maxX - bbox.minX) * UNIT)
    const h = Math.round((bbox.maxY - bbox.minY) * UNIT)
    labelBR.textContent = `(${w}, ${h})`
    labelBR.style.left = `${bbox.maxX * UNIT}px`
    labelBR.style.top = `${bbox.maxY * UNIT + 10}px`
    labelBR.style.opacity = '1'
  }

  // Static contain-fit camera; on narrow screens, clamp the scale so cells
  // stay legible and let the edges crop instead.
  let lastW = 0
  let lastH = 0
  function layout() {
    lastW = app.screen.width
    lastH = app.screen.height
    const worldW = (sim.bounds.maxX - sim.bounds.minX) * UNIT
    const worldH = (sim.bounds.maxY - sim.bounds.minY) * UNIT
    const scale = Math.max(
      Math.min(lastW / worldW, lastH / worldH) * 0.94,
      MIN_UNIT_PX / UNIT,
    )
    const px = lastW / 2 - (worldW / 2) * scale
    const py = lastH / 2 - (worldH / 2) * scale
    world.scale.set(scale)
    world.position.set(px, py)
    overlay.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${scale})`
  }

  function buildView(r: Region): CellView {
    const variant = r.variant as Variant
    const s = r.size * UNIT
    const rnd = mulberry32((r.id * 0x9e3779b1) >>> 0)

    const root = new Container()
    root.pivot.set(s / 2, s / 2)
    root.position.set(r.x * UNIT + s / 2, r.y * UNIT + s / 2)
    root.alpha = 0
    root.scale.set(0.2)
    const built = buildVariant(root, variant, s, rnd, explosion)

    let textEl: HTMLDivElement | null = null
    if (variant === 'text') {
      textEl = document.createElement('div')
      textEl.textContent = SNIPPETS[snippetIdx++ % SNIPPETS.length]
      textEl.style.cssText =
        `position:absolute;left:${r.x * UNIT}px;top:${r.y * UNIT}px;` +
        `width:${s}px;height:${s}px;box-sizing:border-box;padding:10px 12px;` +
        `overflow:hidden;white-space:pre;color:#d8c84a;` +
        `font-family:${MONO};font-size:11px;line-height:1.45;` +
        `opacity:0;transition:opacity 0.3s ease;`
      overlay.appendChild(textEl)
    }

    return {
      id: r.id,
      root,
      textEl,
      update: built.update,
      exit: built.exit ?? null,
      dot: built.dot,
      phase: 'in',
      t: 0,
      dur: DUR.in,
      blink: -1,
      microPhase: rnd() * Math.PI * 2,
      microPeriod: 2400 + rnd() * 2600,
    }
  }

  function destroyView(v: CellView) {
    v.textEl?.remove()
    v.root.destroy({ children: true, context: true })
  }

  function dropView(v: CellView) {
    destroyView(v)
    views.delete(v.id)
  }

  function applyEvents(events: SimEvent[], instant = false) {
    for (const e of events) {
      switch (e.type) {
        case 'born': {
          const old = views.get(e.region.id)
          if (old) dropView(old)
          const v = buildView(e.region)
          v.dur =
            IN_DUR[e.region.variant as Variant] ?? (e.fromSplit ? DUR.inSplit : DUR.in)
          views.set(v.id, v)
          world.addChild(v.root)
          growBBox(e.region)
          if (instant) {
            v.phase = 'live'
            v.t = 1
            v.root.alpha = 1
            v.root.scale.set(1)
            v.update?.(1)
          }
          break
        }
        case 'died': {
          const v = views.get(e.region.id)
          if (!v) break
          if (instant) {
            dropView(v)
          } else {
            v.phase = 'out'
            v.t = 0
            v.dur = OUT_DUR[e.variant] ?? DUR.out
          }
          break
        }
        case 'removed': {
          const v = views.get(e.id)
          if (v) dropView(v)
          break
        }
        case 'signal': {
          const v = views.get(e.id)
          if (v && v.phase !== 'out' && v.blink < 0) v.blink = 0
          break
        }
      }
    }
  }

  function stepViews(dms: number) {
    elapsed += dms
    for (const v of views.values()) {
      let alpha = 1
      if (v.phase === 'in') {
        v.t = Math.min(1, v.t + dms / v.dur)
        const e = ease(v.t)
        // scale carries the motion; the fade finishes early
        alpha = Math.min(1, v.t * 2.5)
        v.root.scale.set(0.2 + 0.8 * e)
        v.update?.(e)
        if (v.t >= 1) v.phase = 'live'
        if (v.textEl) v.textEl.style.opacity = '0.92'
      } else if (v.phase === 'out') {
        v.t = Math.min(1, v.t + dms / v.dur)
        const e = ease(v.t)
        if (v.exit) {
          // choreographed exit carries most of the duration; fade at the end
          v.exit(e)
          alpha = e < 0.6 ? 1 : 1 - (e - 0.6) / 0.4
        } else {
          alpha = 1 - e
          v.root.scale.set(1 - 0.15 * e)
        }
        if (v.textEl) v.textEl.style.opacity = '0'
        if (v.t >= 1) {
          dropView(v)
          continue
        }
      } else if (v.dot) {
        // idle micro-animation: the center dot breathes
        v.dot.alpha =
          0.6 + 0.4 * (0.5 + 0.5 * Math.sin((elapsed / v.microPeriod) * Math.PI * 2 + v.microPhase))
      }
      // blink: two quick dips — only ever fired as the pre-change signal
      if (v.blink >= 0) {
        v.blink += dms
        const p = Math.min(1, v.blink / DUR.blink)
        alpha *= 1 - 0.45 * Math.sin(p * Math.PI * 2) ** 2
        if (p >= 1) v.blink = -1
      }
      v.root.alpha = alpha
    }
  }

  applyEvents(sim.init(), opts.reducedMotion)
  layout()
  updateLabels()

  let io: IntersectionObserver | null = null
  let loop: ((ticker: Ticker) => void) | null = null

  if (opts.reducedMotion) {
    // Static composition: simulate well past the growth phase, render once.
    for (let i = 0; i < 220; i++) applyEvents(sim.tick(), true)
    for (const v of views.values()) {
      if (v.textEl) {
        v.textEl.style.transition = 'none'
        v.textEl.style.opacity = '0.92'
      }
    }
    labelTL.style.transition = 'none'
    labelBR.style.transition = 'none'
    updateLabels()
    app.render()
    app.stop()
  } else {
    let acc = 0
    loop = (ticker: Ticker) => {
      const dms = Math.min(ticker.deltaMS, 100)
      acc += dms
      while (acc >= tickMs) {
        acc -= tickMs
        applyEvents(sim.tick())
      }
      stepViews(dms)
      if (bboxDirty) updateLabels()
      if (app.screen.width !== lastW || app.screen.height !== lastH) layout()
    }
    app.ticker.add(loop)

    io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) app.start()
      else app.stop()
    })
    io.observe(host)
  }

  return {
    destroy() {
      io?.disconnect()
      if (loop) app.ticker.remove(loop)
      overlay.replaceChildren()
      // textures stay in the Assets cache (shared across remounts); unload
      // explicitly instead of letting app.destroy nuke cache entries
      app.destroy(true, { children: true, context: true })
      void Assets.unload(EXPLOSION_URL)
    },
    setParams(p: HeroParams) {
      const { speed, ...rest } = p
      if (typeof speed === 'number' && speed > 0) tickMs = TICK_MS / speed
      Object.assign(SIM, rest)
    },
  }
}

// -- DOM bits -----------------------------------------------------------------

function makeCoordLabel(): HTMLDivElement {
  const el = document.createElement('div')
  el.style.cssText =
    `position:absolute;white-space:nowrap;color:#8f8f89;` +
    `font-family:${MONO};font-size:12px;line-height:1;opacity:0;` +
    `transition:left 0.6s ease, top 0.6s ease, opacity 0.4s ease;`
  return el
}

// -- cell visuals -------------------------------------------------------------

interface BuiltVariant {
  update: ((e: number) => void) | null
  exit?: (e: number) => void
  dot: Graphics | null
}

/** small pulsing square at the center of a cell — every cell gets one, and
 * it is the exact same size no matter how big the cell is */
const DOT_SIZE = 5
function centerDot(root: Container, s: number, color: number): Graphics {
  const d = DOT_SIZE
  const dot = new Graphics().rect(-d / 2, -d / 2, d, d).fill(color)
  dot.position.set(s / 2, s / 2)
  root.addChild(dot)
  return dot
}

/** diagonal 45° hatch clipped to a w×h rect at (ox,oy), drawn into g */
function hatchLines(g: Graphics, w: number, h: number, step: number, ox = 0, oy = 0) {
  for (let c = -h + step; c < w; c += step) {
    const x0 = Math.max(0, c)
    const x1 = Math.min(w, c + h)
    if (x1 <= x0) continue
    g.moveTo(x0 + ox, x0 - c + oy).lineTo(x1 + ox, x1 - c + oy)
  }
}

function buildVariant(
  root: Container,
  variant: Variant,
  s: number,
  rnd: () => number,
  explosion: Texture,
): BuiltVariant {
  const g = new Graphics()
  root.addChild(g)

  switch (variant) {
    case 'box': {
      g.rect(0.5, 0.5, s - 1, s - 1).fill(C.cellFill).stroke({ width: 1, color: C.cellStroke })
      return { update: null, dot: centerDot(root, s, rnd() < 0.3 ? C.dotMint : C.dotGrey) }
    }
    case 'hatch': {
      g.rect(0.5, 0.5, s - 1, s - 1).fill(C.hatchFill).stroke({ width: 1, color: C.hatchStroke })
      // the hatch lines wipe in left→right behind a mask, and wipe back out
      const lines = new Graphics()
      hatchLines(lines, s, s, 5)
      lines.stroke({ width: 1, color: C.hatchLine, alpha: 0.9 })
      const wipe = new Graphics().rect(0, 0, s, s).fill(0xffffff)
      lines.mask = wipe
      root.addChild(lines, wipe)
      const update = (e: number) => wipe.scale.set(Math.max(0.001, e), 1)
      const exit = (e: number) => wipe.scale.set(Math.max(0.001, 1 - e), 1)
      return { update, exit, dot: centerDot(root, s, C.greenBright) }
    }
    case 'flow': {
      // rows of green ticks and faint arrows, direction alternating per row;
      // the whole pattern writes itself in left→right behind a mask
      g.rect(0.5, 0.5, s - 1, s - 1).fill(C.cellFill).stroke({ width: 1, color: C.cellStroke })
      const fg = new Graphics()
      const rowH = 15
      const pad = 4
      let dir = rnd() < 0.5 ? 1 : -1
      for (let y = pad; y + rowH <= s - pad; y += rowH) {
        let x = pad + rnd() * 4
        while (x < s - pad - 5) {
          if (rnd() < 0.55) {
            fg.rect(x, y, 2, rowH).fill({ color: C.flowTick, alpha: rnd() < 0.45 ? 0.2 : 1 })
            x += 5
          } else {
            const len = 12
            if (x + len > s - pad) break
            const ay = y + rowH / 2
            const x1 = dir > 0 ? x + len : x
            fg.moveTo(dir > 0 ? x : x + len, ay).lineTo(x1, ay)
            fg.moveTo(x1 - dir * 4, ay - 3)
              .lineTo(x1, ay)
              .lineTo(x1 - dir * 4, ay + 3)
            fg.stroke({ width: 1, color: 0xffffff, alpha: 0.3 })
            x += len + 4
          }
        }
        dir *= -1
      }
      const wipe = new Graphics().rect(0, 0, s, s).fill(0xffffff)
      fg.mask = wipe
      root.addChild(fg, wipe)
      const update = (e: number) => wipe.scale.set(Math.max(0.001, e), 1)
      const exit = (e: number) => wipe.scale.set(Math.max(0.001, 1 - e), 1)
      return { update, exit, dot: centerDot(root, s, C.dotGrey) }
    }
    case 'tile': {
      const sprite = new Sprite(explosion)
      sprite.anchor.set(0.5)
      sprite.position.set(s / 2, s / 2)
      sprite.rotation = Math.floor(rnd() * 4) * (Math.PI / 2)
      sprite.width = (s - 1) * (rnd() < 0.5 ? 1 : -1)
      sprite.height = s - 1
      root.addChildAt(sprite, 0)
      g.rect(0.5, 0.5, s - 1, s - 1).stroke({ width: 1, color: C.cellStroke })
      return { update: null, dot: centerDot(root, s, C.greenBright) }
    }
    case 'dots': {
      g.rect(0.5, 0.5, s - 1, s - 1).fill(C.cellFill).stroke({ width: 1, color: C.cellStroke })
      // yellow nodes labelled with consecutive SUPABASE letters, joined by
      // arrows; spread with rejection sampling so the diagram stays open
      const n = 3 + Math.floor(rnd() * 2)
      const start = Math.floor(rnd() * (LETTERS.length - n + 1))
      const m = Math.max(16, s * 0.16)
      const minDist = s * 0.28
      const pts: { x: number; y: number }[] = []
      for (let i = 0; i < n; i++) {
        let best = { x: m + rnd() * (s - 2 * m), y: m + rnd() * (s - 2 * m) }
        let bestDist = -1
        for (let tries = 0; tries < 12; tries++) {
          const c = { x: m + rnd() * (s - 2 * m), y: m + rnd() * (s - 2 * m) }
          const d = Math.min(...pts.map((p) => Math.hypot(p.x - c.x, p.y - c.y)), Infinity)
          if (d > minDist) {
            best = c
            break
          }
          if (d > bestDist) {
            bestDist = d
            best = c
          }
        }
        pts.push(best)
      }
      const r = clamp(s * 0.045, 4, 8)
      const fontSize = clamp(s * 0.085, 12, 18)
      // each dot+letter lives in its own container so it can pop in on its
      // own beat and collapse to the center on exit
      const nodes: Container[] = []
      for (let i = 0; i < n; i++) {
        const node = new Container()
        const circle = new Graphics().circle(0, 0, r).fill(C.yellow)
        const letter = new Text({
          text: LETTERS[start + i],
          style: { fontFamily: PIXI_MONO, fontSize, fill: C.yellow },
        })
        letter.position.set(r + 5, -fontSize / 2)
        node.addChild(circle, letter)
        node.position.set(pts[i].x, pts[i].y)
        node.alpha = 0
        root.addChild(node)
        nodes.push(node)
      }
      const arrows: Graphics[] = []
      for (let i = 0; i < n - 1; i++) {
        const ag = new Graphics()
        root.addChild(ag)
        arrows.push(ag)
      }
      // draw-in: dots pop one at a time (first 55%), then each arrow draws
      // itself from tail to head (last 45%)
      const update = (e: number) => {
        for (let i = 0; i < n; i++) {
          const le = clamp((e - (i / n) * 0.55) / (0.55 / n), 0, 1)
          nodes[i].alpha = le
          nodes[i].scale.set(0.3 + 0.7 * le)
        }
        for (let i = 0; i < arrows.length; i++) {
          const le = clamp((e - 0.55 - (i / arrows.length) * 0.45) / (0.45 / arrows.length), 0, 1)
          partialArrow(arrows[i], pts[i], pts[i + 1], r, le)
        }
      }
      // exit: arrows vanish first, then the dots collapse into the middle
      const exit = (e: number) => {
        const ae = clamp(e / 0.35, 0, 1)
        for (const ag of arrows) ag.alpha = 1 - ae
        const ce = clamp((e - 0.15) / 0.75, 0, 1)
        for (let i = 0; i < n; i++) {
          nodes[i].position.set(
            pts[i].x + (s / 2 - pts[i].x) * ce,
            pts[i].y + (s / 2 - pts[i].y) * ce,
          )
          nodes[i].scale.set(1 - 0.55 * ce)
        }
      }
      return { update, exit, dot: centerDot(root, s, C.dotGrey) }
    }
    case 'text': {
      g.rect(0.5, 0.5, s - 1, s - 1).fill(C.textBg).stroke({ width: 1, color: C.textStroke })
      // selection-handle squares pop onto the corners one by one
      const handles: Graphics[] = []
      for (const [hx, hy] of [
        [0, 0],
        [s, 0],
        [s, s],
        [0, s],
      ]) {
        const h = new Graphics().rect(-3, -3, 6, 6).fill(C.greenBright)
        h.position.set(hx, hy)
        h.scale.set(0)
        root.addChild(h)
        handles.push(h)
      }
      const update = (e: number) => {
        for (let i = 0; i < handles.length; i++) {
          handles[i].scale.set(clamp((e - 0.4 - i * 0.1) / 0.2, 0, 1))
        }
      }
      const exit = (e: number) => {
        const le = clamp(e / 0.4, 0, 1)
        for (const h of handles) h.scale.set(1 - le)
      }
      return { update, exit, dot: null }
    }
    case 'panels': {
      // overlapping translucent hatched rectangles that drift out from the
      // center as the cell is born — clipped to the cell
      g.rect(0.5, 0.5, s - 1, s - 1).fill(C.hatchFill).stroke({ width: 1, color: C.hatchStroke })
      hatchLines(g, s, s, 10)
      g.stroke({ width: 1, color: C.hatchLine, alpha: 0.5 })

      const mask = new Graphics().rect(0, 0, s, s).fill(0xffffff)
      const holder = new Container()
      holder.mask = mask
      root.addChild(mask, holder)

      const palette = [
        { fill: 0x24372a, alpha: 0.82 },
        { fill: 0x2e4634, alpha: 0.72 },
        { fill: 0x7a7340, alpha: 0.85 },
        { fill: 0x1d2b20, alpha: 0.8 },
      ]
      const n = 3 + Math.floor(rnd() * 2)
      const panels: { gfx: Graphics; tx: number; ty: number }[] = []
      for (let i = 0; i < n; i++) {
        const w = s * (0.35 + rnd() * 0.35)
        const h = s * (0.35 + rnd() * 0.35)
        const pal = palette[(i + Math.floor(rnd() * palette.length)) % palette.length]
        const p = new Graphics()
        p.rect(-w / 2, -h / 2, w, h)
          .fill({ color: pal.fill, alpha: pal.alpha })
          .stroke({ width: 1, color: 0xffffff, alpha: 0.18 })
        hatchLines(p, w, h, 10, -w / 2, -h / 2)
        p.stroke({ width: 1, color: 0xffffff, alpha: 0.12 })
        // mint handle square riding on an edge of the panel
        if (rnd() < 0.8) {
          const hw = 7 + rnd() * 4
          const cx = (rnd() < 0.5 ? -1 : 1) * (w / 2)
          const cy = -h / 2 + rnd() * h
          p.rect(cx - hw / 2, cy - hw / 2, hw, hw).fill(C.panelMint)
        }
        const tx = s / 2 + (rnd() - 0.5) * s * 0.45
        const ty = s / 2 + (rnd() - 0.5) * s * 0.45
        p.position.set(s / 2, s / 2)
        holder.addChild(p)
        panels.push({ gfx: p, tx, ty })
      }
      const dot = centerDot(root, s, C.dotGrey)
      // drift each panel from the center to its resting spot, staggered;
      // on exit they run the same path backwards and swallow themselves
      const update = (e: number) => {
        for (let i = 0; i < panels.length; i++) {
          const delay = i * 0.12
          const le = clamp((e - delay) / (1 - delay), 0, 1)
          const { gfx, tx, ty } = panels[i]
          gfx.alpha = le
          gfx.scale.set(0.4 + 0.6 * le)
          gfx.position.set(s / 2 + (tx - s / 2) * le, s / 2 + (ty - s / 2) * le)
        }
      }
      const exit = (e: number) => update(1 - e)
      return { update, exit, dot }
    }
  }
}

/** redraws g as the first t (0..1) of an arrow from a to b; the head only
 * appears once the shaft has fully drawn */
function partialArrow(
  g: Graphics,
  a: { x: number; y: number },
  b: { x: number; y: number },
  dotR: number,
  t: number,
) {
  g.clear()
  if (t <= 0) return
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  if (len < dotR * 2 + 16) return
  const ux = dx / len
  const uy = dy / len
  // clear the dots and their letters
  const sx = a.x + ux * (dotR + 6)
  const sy = a.y + uy * (dotR + 6)
  const ex = b.x - ux * (dotR + 6)
  const ey = b.y - uy * (dotR + 6)
  g.moveTo(sx, sy).lineTo(sx + (ex - sx) * t, sy + (ey - sy) * t)
  if (t >= 0.999) {
    const head = 5
    g.moveTo(ex - ux * head - uy * head * 0.6, ey - uy * head + ux * head * 0.6).lineTo(ex, ey)
    g.lineTo(ex - ux * head + uy * head * 0.6, ey - uy * head - ux * head * 0.6)
  }
  g.stroke({ width: 1.25, color: C.arrow, alpha: 0.85 })
}
