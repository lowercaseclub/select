'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'

// Geometric intercept, ported from MildTomato/select-patterns (TextArtGeo):
// big primitives — triangle, circle, square, hexagon — cut into the row
// field. Shape edges come from signed-distance functions, so the geometry
// stays crisp while drifting and rotating.

interface Slot {
  x: number
  level: number
  color: number
  jit: number
}
interface Seg {
  L: number
  R: number
  tL: number
  tR: number
  birth: number
  dying: boolean
  matched?: boolean
}
interface Row {
  y: number
  rowIdx: number
  slots: Slot[]
  segs: Seg[]
}
interface Ripple {
  x: number
  y: number
  radius: number
  life: number
}
interface Blob {
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  angleSpeed: number
  radiusX: number
  radiusY: number
}

// Locked-in tuning for the hero pattern — originally adjusted live through a
// dev panel, now hardcoded. mode/speed/rowVar/ease/steps drive the row field;
// the rest drive the glyph grid and the intercepting shapes.
type Mode = 'tween' | 'step' | 'slide'
const CONFIG = {
  // P11 preset from the select-patterns playground: dark band with
  // dark-tuned dash/row colors
  palette: {
    bg: '#121212',
    dim: '#1d201e',
    rows: ['#39db77', '#28714e', '#fbd8c6', '#d1e7ff'],
  },
  mode: 'step' as Mode,
  speed: 2,
  rowVar: 0.8,
  ease: 1,
  steps: 6,
  textSize: 1.45,
  showText: false,
  showShapes: true,
  count: 6,
  sizeMul: 1.45,
  speedMul: 0,
  spinMul: 0.1,
  pulseMul: 0.45,
  curveMul: 1,
  rerender: true,
  rerenderSecs: 2,
}

const N_COLORS = 4
const QL = 32
// Density ramp, sparse → dense; per-cell jitter keeps the texture organic
const GLYPHS = ['.', '·', ':', ';', '-', '~', '=', '+', '*', 'x', '#', '%', '@']

// Intercepting geometric primitives — rendered in the same grid as the rows.
// Every parameter is rolled per shape (size, velocity, spin rate/direction,
// character, color, pulse), and shapes that leave the canvas respawn from a
// random edge with a fresh roll — the cast keeps changing.
type Kind = 'circle' | 'square' | 'tri' | 'hex'
interface Shape {
  kind: Kind
  ch: string
  color: number
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  va: number
  R: number
  pulseA: number
  pulseF: number
  ph: number
  curve: number
}

const KINDS: Kind[] = ['circle', 'square', 'tri', 'hex']
const KIND_CHARS: Record<Kind, string[]> = {
  circle: ['o', '*', '0'],
  square: ['#', '%'],
  tri: ['/', '^'],
  hex: ['+', 'x'],
}

function rollShape(W: number, H: number, fromEdge: boolean, pool: Kind[], color: number): Shape {
  const kind = pool[Math.floor(Math.random() * pool.length)]
  const chs = KIND_CHARS[kind]
  const R = H * (0.08 + Math.random() * 0.27)
  const sp = 0.03 + Math.random() * 0.15
  let x: number, y: number, dir: number
  if (fromEdge) {
    const e = Math.floor(Math.random() * 4)
    const t = Math.random()
    if (e === 0) {
      x = -R * 1.4; y = t * H; dir = (Math.random() - 0.5) * 1.6 // left, heading right
    } else if (e === 1) {
      x = W + R * 1.4; y = t * H; dir = Math.PI + (Math.random() - 0.5) * 1.6 // right, heading left
    } else if (e === 2) {
      x = t * W; y = -R * 1.4; dir = Math.PI / 2 + (Math.random() - 0.5) * 1.6 // top, heading down
    } else {
      x = t * W; y = H + R * 1.4; dir = -Math.PI / 2 + (Math.random() - 0.5) * 1.6 // bottom, heading up
    }
  } else {
    x = Math.random() * W
    y = Math.random() * H
    dir = Math.random() * Math.PI * 2
  }
  return {
    kind,
    ch: chs[Math.floor(Math.random() * chs.length)],
    color,
    x,
    y,
    vx: Math.cos(dir) * sp,
    vy: Math.sin(dir) * sp,
    angle: Math.random() * Math.PI * 2,
    va: (0.00008 + Math.random() * 0.00045) * (Math.random() < 0.5 ? -1 : 1),
    R,
    pulseA: 0.04 + Math.random() * 0.12,
    pulseF: 0.0002 + Math.random() * 0.0004,
    ph: Math.random() * Math.PI * 2,
    curve: (Math.random() - 0.5) * 0.0009,
  }
}

// Signed distance functions (negative inside) — iq's classics
function sdShape(kind: Kind, px: number, py: number, r: number): number {
  if (kind === 'circle') return Math.sqrt(px * px + py * py) - r
  if (kind === 'square') return Math.max(Math.abs(px), Math.abs(py)) - r
  if (kind === 'tri') {
    const k = 1.7320508
    px = Math.abs(px) - r
    py = py + r / k
    if (px + k * py > 0) {
      const t = (px - k * py) / 2
      py = (-k * px - py) / 2
      px = t
    }
    px -= Math.max(-2 * r, Math.min(0, px))
    return -Math.sqrt(px * px + py * py) * Math.sign(py)
  }
  // hex
  const kx = -0.866025404, ky = 0.5, kz = 0.577350269
  px = Math.abs(px)
  py = Math.abs(py)
  const d = 2 * Math.min(kx * px + ky * py, 0)
  px -= d * kx
  py -= d * ky
  const dx = px - Math.max(-kz * r, Math.min(kz * r, px)), dy = py - r
  return Math.sign(dy) * Math.sqrt(dx * dx + dy * dy)
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function ramp(dimHex: string, colorHex: string): string[] {
  const dim = hexToRgb(dimHex)
  const c = hexToRgb(colorHex)
  return Array.from({ length: QL + 1 }, (_, q) => {
    const t = q / QL
    return `rgb(${Math.round(dim[0] + (c[0] - dim[0]) * t)},${Math.round(dim[1] + (c[1] - dim[1]) * t)},${Math.round(dim[2] + (c[2] - dim[2]) * t)})`
  })
}

// The palette is fixed, so the dim→color ramps precompute once at module load
const FILLS = CONFIG.palette.rows.map((c) => ramp(CONFIG.palette.dim, c))

export function HeroCanvas({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Colors dealt round-robin from a shuffled deck — no same-color clusters.
  // Starts exhausted (i = length) so the first roll() shuffles it, keeping
  // Math.random out of render.
  const deck = useRef({ order: [0, 1, 2, 3], i: 4 })

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const aborter = new AbortController()
    const { signal } = aborter

    let W = 1
    let H = 1
    let raf = 0
    let running = false
    let last = 0
    let time = 0
    const mouse = { x: -9999, y: -9999 }
    let rows: Row[] = []
    let blobs: Blob[] = []
    let ripples: Ripple[] = []
    let shapes: Shape[] = []
    let CW = 12, CH = 16, FONTS = '11px monospace'
    let regenAcc = 0
    let salt = 0

    const roll = (rw: number, rh: number, fromEdge: boolean) => {
      const d = deck.current
      if (d.i >= d.order.length) {
        d.order.sort(() => Math.random() - 0.5)
        d.i = 0
      }
      return rollShape(rw, rh, fromEdge, KINDS, d.order[d.i++])
    }

    // Glyph sprites: (char, fill) rendered once — fillText per cell per
    // frame is far too slow at this density
    const cache = new Map<string, HTMLCanvasElement>()
    const glyph = (ch: string, fill: string) => {
      const key = ch + '|' + fill + '|' + CW
      let c = cache.get(key)
      if (!c) {
        if (cache.size > 20000) cache.clear()
        const dpr = window.devicePixelRatio || 1
        c = document.createElement('canvas')
        c.width = CW * dpr
        c.height = CH * dpr
        const g = c.getContext('2d')!
        g.scale(dpr, dpr)
        g.font = FONTS
        g.textAlign = 'center'
        g.textBaseline = 'middle'
        g.fillStyle = fill
        g.fillText(ch, CW / 2, CH / 2)
        cache.set(key, c)
      }
      return c
    }

    const resize = () => {
      const ts = CONFIG.textSize
      CW = Math.max(6, Math.round(12 * ts))
      CH = Math.max(8, Math.round(16 * ts))
      FONTS = `${Math.max(6, Math.round(11 * ts))}px monospace`
      cache.clear()
      const dpr = window.devicePixelRatio || 1
      W = Math.max(1, host.clientWidth)
      H = Math.max(1, host.clientHeight)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const nRows = Math.ceil(H / CH) + 1
      const next: Row[] = []
      let prevColor = -1
      for (let r = 0; r < nRows; r++) {
        let seed = ((r + salt * 1013) * 2654435761) >>> 0
        seed ^= seed >>> 15
        seed = Math.imul(seed, 2246822519) >>> 0
        seed ^= seed >>> 13
        const rand = () => {
          seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
          return seed / 4294967296
        }
        const nSlots = Math.ceil(W / CW) + 1
        const slots: Slot[] = []
        let rowColor = Math.floor(rand() * (N_COLORS - 1))
        if (rowColor >= prevColor) rowColor++
        if (rowColor >= N_COLORS) rowColor = 0
        prevColor = rowColor
        let strand = rowColor
        let strandLeft = 0
        for (let i = 0; i < nSlots; i++) {
          if (strandLeft <= 0) {
            strand = rand() < 0.22 ? Math.floor(rand() * N_COLORS) : rowColor
            strandLeft = 6 + Math.floor(rand() * 14)
          }
          slots.push({ x: i * CW, level: 0, color: strand, jit: rand() })
          strandLeft--
        }
        next.push({ y: r * CH + CH / 2, rowIdx: r, slots, segs: [] })
      }
      rows = next
      blobs = [
        { x: W * 0.3, y: H * 0.4, vx: 0.4, vy: 0.28, angle: 0, angleSpeed: 0.004, radiusX: W * 0.55, radiusY: H * 0.58 },
        { x: W * 0.7, y: H * 0.55, vx: -0.3, vy: 0.35, angle: 1.2, angleSpeed: -0.003, radiusX: W * 0.48, radiusY: H * 0.52 },
        { x: W * 0.5, y: H * 0.2, vx: 0.22, vy: -0.42, angle: 2.5, angleSpeed: 0.005, radiusX: W * 0.44, radiusY: H * 0.46 },
        { x: W * 0.18, y: H * 0.72, vx: -0.35, vy: -0.22, angle: 0.8, angleSpeed: -0.004, radiusX: W * 0.5, radiusY: H * 0.54 },
      ]
      // Fresh random cast on resize; replacements roll in from the edges
      shapes = Array.from({ length: CONFIG.count }, () => roll(W, H, false))
    }

    // One sim + render step. `draw: false` advances state without painting
    // (used to settle the static reduced-motion frame cheaply).
    const tick = (now: number, draw: boolean) => {
      const dt = now - (last || now - 16)
      last = now
      const delta = Math.min(dt / 16.667, 4)

      const { mode, speed, rowVar, ease, steps } = CONFIG
      const sd = delta * speed
      time += dt * speed
      for (const b of blobs) {
        b.x += b.vx * sd
        b.y += b.vy * sd
        b.angle += b.angleSpeed * sd
        if (b.x < 0 || b.x > W) b.vx *= -1
        if (b.y < 0 || b.y > H) b.vy *= -1
      }
      ripples = ripples.filter((r) => r.life < 1)
      for (const r of ripples) {
        r.radius += 10 * sd
        r.life += 0.04 * sd
      }
      for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i]
        // Curved paths: each shape's velocity slowly veers at its own rate
        const ca = s.curve * sd * CONFIG.curveMul, cc = Math.cos(ca), cs = Math.sin(ca)
        const nvx = s.vx * cc - s.vy * cs, nvy = s.vx * cs + s.vy * cc
        s.vx = nvx
        s.vy = nvy
        s.x += s.vx * sd * CONFIG.speedMul
        s.y += s.vy * sd * CONFIG.speedMul
        s.angle += s.va * sd * 16.667 * CONFIG.spinMul
        const rr = s.R * CONFIG.sizeMul
        // Fully off-canvas → replaced by a brand new roll entering elsewhere
        if (s.x < -rr * 1.6 || s.x > W + rr * 1.6 || s.y < -rr * 1.6 || s.y > H + rr * 1.6) {
          shapes[i] = roll(W, H, true)
        }
      }

      // Re-render mode: every interval the whole composition re-rolls —
      // new shapes, new row randomization — while motion runs continuously.
      // Skipped under reduced motion (resize would recurse via settle, and a
      // static frame shouldn't re-roll anyway).
      if (CONFIG.rerender && !reducedMotion) {
        regenAcc += dt
        if (regenAcc >= CONFIG.rerenderSecs * 1000) {
          regenAcc = 0
          salt++
          resize()
        }
      } else {
        regenAcc = 0
      }

      const nf = FILLS.length
      if (draw) {
        ctx.fillStyle = CONFIG.palette.bg
        ctx.fillRect(0, 0, W, H)
      }

      const mx = mouse.x
      const my = mouse.y

      const influenceAt = (sx: number, cy: number, cx: number) => {
        let inf = 0
        for (const b of blobs) {
          const dx = sx - b.x
          const dy = cy - b.y
          const cos = Math.cos(b.angle)
          const sin = Math.sin(b.angle)
          const lx = dx * cos + dy * sin
          const ly = -dx * sin + dy * cos
          inf += Math.max(0, 1 - Math.sqrt((lx / b.radiusX) ** 2 + (ly / b.radiusY) ** 2)) ** 2
        }
        inf = Math.min(1, inf)
        const cd = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2)
        inf = Math.min(1, inf + Math.max(0, 1 - cd / 160) ** 2 * 0.7)
        for (const r of ripples) {
          const rd = Math.sqrt((cx - r.x) ** 2 + (cy - r.y) ** 2)
          const df = Math.abs(rd - r.radius)
          if (df < 22) inf = Math.min(1, inf + (1 - df / 22) * (1 - r.life) * 0.9)
        }
        return inf
      }

      const advance = (level: number, target: number) => {
        if (mode === 'step') return Math.round(target * (steps - 1)) / (steps - 1)
        const e = (target > level ? 0.25 : 0.1) * delta * ease
        return level + (target - level) * Math.min(1, e)
      }

      const mEff = shapes.map((s) => ({
        s,
        cos: Math.cos(s.angle),
        sin: Math.sin(s.angle),
        R: s.R * CONFIG.sizeMul * (1 + s.pulseA * CONFIG.pulseMul * Math.sin(time * s.pulseF + s.ph)),
      }))

      for (const row of rows) {
        const rh = (((row.rowIdx * 2654435761) >>> 0) % 1000) / 1000
        const drift =
          mode === 'slide'
            ? Math.sin(time * 0.0014 * (0.4 + 0.6 * rh) + row.rowIdx * 1.7) * (80 + 140 * rh) * rowVar
            : Math.sin(time * 0.0007 * (0.3 + 0.7 * rh) + row.rowIdx * 1.7) * (50 + 90 * rh) * rowVar
        const rowBias = row.rowIdx % 2 === 0 ? 0.0 : 0.22
        const cy = row.y

        if (mode === 'slide') {
          const slots = row.slots
          const targets: { L: number; R: number }[] = []
          let start = -1
          for (let i = 0; i <= slots.length; i++) {
            const cx = i < slots.length ? slots[i].x + CW / 2 : 0
            const on = i < slots.length && influenceAt(cx + drift, cy, cx) > 0.3 + rowBias
            if (on) {
              if (start < 0) start = i
            } else if (start >= 0) {
              targets.push({ L: slots[start].x, R: slots[i - 1].x + CW })
              start = -1
            }
          }
          for (const sg of row.segs) sg.matched = false
          for (const t of targets) {
            const tc = (t.L + t.R) / 2
            let best: Seg | null = null
            let bd = 260
            for (const sg of row.segs) {
              if (sg.matched || sg.dying) continue
              const d = Math.abs((sg.L + sg.R) / 2 - tc)
              if (d < bd) {
                bd = d
                best = sg
              }
            }
            if (best) {
              best.matched = true
              best.tL = t.L
              best.tR = t.R
            } else row.segs.push({ L: tc, R: tc, tL: t.L, tR: t.R, birth: 0, dying: false, matched: true })
          }
          for (const sg of row.segs) {
            if (!sg.matched) sg.dying = true
            sg.birth += (sg.dying ? -0.07 : 0.09) * delta
            if (sg.birth > 1) sg.birth = 1
            const k = Math.min(1, 0.05 * delta * ease)
            sg.L += (sg.tL - sg.L) * k
            sg.R += (sg.tR - sg.R) * k
          }
          row.segs = row.segs.filter((sg) => sg.birth > 0)
          const q = (b: number) => Math.round(Math.max(0, Math.min(1, b)) * (steps - 1)) / (steps - 1)
          for (const slot of row.slots) {
            const cx = slot.x + CW / 2
            let lv = 0
            for (const sg of row.segs) if (cx >= sg.L - 1 && cx <= sg.R + 1) lv = Math.max(lv, q(sg.birth))
            slot.level = lv
          }
        } else {
          for (const slot of row.slots) {
            const cx = slot.x + CW / 2
            const inf = influenceAt(cx + drift, cy, cx)
            const target = Math.max(0, Math.min(1, (inf - (0.3 + rowBias)) / 0.12 + 0.5))
            slot.level = advance(slot.level, target)
          }
        }

        if (!draw) continue

        // Render: level → glyph density + color ramp, jittered per cell
        const ry = cy - CH / 2
        for (const slot of row.slots) {
          // Intercepted: inside a shape, the cell renders the shape's
          // character (same grid, same size) instead of the field glyph
          const scx = slot.x + CW / 2
          let best = 0
          let bm: (typeof mEff)[number] | null = null
          if (CONFIG.showShapes)
            for (const e of mEff) {
              const dx = scx - e.s.x
              const dy = cy - e.s.y
              if (Math.abs(dx) > e.R * 1.7 || Math.abs(dy) > e.R * 1.7) continue
              const lx = dx * e.cos + dy * e.sin
              const ly = -dx * e.sin + dy * e.cos
              const inside = -sdShape(e.s.kind, lx, ly, e.R)
              if (inside > best) {
                best = inside
                bm = e
              }
            }
          if (bm) {
            ctx.drawImage(glyph(bm.s.ch, FILLS[bm.s.color % nf][QL]), slot.x, ry, CW, CH)
            continue
          }
          if (!CONFIG.showText) continue
          const gi = Math.max(0, Math.min(GLYPHS.length - 1, Math.floor(slot.level * (GLYPHS.length - 1) + slot.jit * 1.6 - 0.3)))
          const q = Math.round(slot.level * QL)
          ctx.drawImage(glyph(GLYPHS[gi], FILLS[slot.color % nf][q]), slot.x, ry, CW, CH)
        }
      }
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      tick(now, true)
    }
    const start = () => {
      if (running) return
      running = true
      last = 0
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    // Reduced motion: advance the sim ~1.5s with synthetic timestamps so the
    // field settles into its full pattern, then paint a single static frame.
    let settleT = 0
    const settle = () => {
      last = 0
      for (let i = 0; i < 90; i++) tick((settleT += 16.7), false)
      tick((settleT += 16.7), true)
    }
    const onResize = () => {
      resize()
      if (reducedMotion) settle()
    }

    onResize()
    const ro = new ResizeObserver(onResize)
    ro.observe(host)
    window.addEventListener('resize', onResize, { signal })

    // Dev hook: step the sim with synthetic timestamps — rAF is suspended in
    // hidden/preview tabs, so this is the only way to advance it there
    const devWin = window as Window & { __heroTick?: (ms?: number) => void }
    if (process.env.NODE_ENV === 'development') {
      devWin.__heroTick = (ms = 1000) => {
        const step = 16.7
        const n = Math.max(1, Math.round(ms / step))
        let t = last
        for (let i = 0; i < n - 1; i++) tick((t += step), false)
        tick((t += step), true)
      }
      signal.addEventListener('abort', () => delete devWin.__heroTick)
    }

    if (!reducedMotion) {
      // Pause the loop while the hero is scrolled out of view
      const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
      io.observe(host)
      signal.addEventListener('abort', () => io.disconnect())

      canvas.addEventListener(
        'mousemove',
        (e) => {
          const r = canvas.getBoundingClientRect()
          mouse.x = e.clientX - r.left
          mouse.y = e.clientY - r.top
        },
        { signal },
      )
      canvas.addEventListener(
        'mouseleave',
        () => {
          mouse.x = -9999
          mouse.y = -9999
        },
        { signal },
      )
      canvas.addEventListener(
        'click',
        (e) => {
          const r = canvas.getBoundingClientRect()
          for (let i = 0; i < 2; i++) ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, radius: i * 28, life: 0 })
        },
        { signal },
      )
    }

    return () => {
      stop()
      ro.disconnect()
      aborter.abort()
    }
  }, [])

  return (
    <div
      ref={hostRef}
      className={cn('relative overflow-hidden', className)}
      style={{ background: CONFIG.palette.bg }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
