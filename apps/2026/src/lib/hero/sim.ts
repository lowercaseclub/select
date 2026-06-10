/**
 * Hero field simulation — an implicit quadtree over a sparse unit grid.
 *
 * Regions are axis-aligned squares (size 1/2/4/8 units) whose x/y are always
 * multiples of their size, so split/merge are pure map edits and the quadtree
 * never exists as a pointer structure. A birth-leaning cellular automaton
 * grows outward from a seeded 2×2 cluster at the world center, then settles
 * into sparse birth/decay churn whose rates drift on slow sine waves.
 *
 * The alive structure is always one connected component: births require an
 * alive edge-neighbor (pure contagion), and a death is denied when it would
 * split the alive graph in two.
 *
 * The world extent is fixed; the camera never moves. Pure TS — no Pixi.
 */

export type Variant = 'box' | 'hatch' | 'flow' | 'tile' | 'dots' | 'text' | 'panels'

export interface Region {
  id: number
  /** grid units */
  x: number
  y: number
  /** power of two: 1 | 2 | 4 | 8 */
  size: number
  alive: boolean
  variant: Variant | null
  /** ticks since last state change (birth, death, or creation) */
  age: number
}

export interface Bounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export type SimEvent =
  | { type: 'born'; region: Region; fromSplit?: boolean }
  | { type: 'died'; region: Region; variant: Variant }
  /** region object no longer exists (replaced by a split or merge) */
  | { type: 'removed'; id: number }
  /** this cell is about to split or grow a neighbor — blink it */
  | { type: 'signal'; id: number }

export const SIM = {
  block: 8,
  cols: 64,
  rows: 32,
  /** chance an init block of a given size subdivides further */
  initSplitChance: { 8: 0.9, 4: 0.45, 2: 0.15 } as Record<number, number>,

  birthMax: 0.35,
  /** birth never decays below this — keeps equilibrium near the ceiling */
  birthFloor: 0.065,
  birthDecayTau: 240,

  /** growth phase — push the structure's extent to almost full frame first */
  growthHighWater: 0.3,
  /** base birth chance on any frontier contact during growth */
  growthBase: 0.15,
  /** gain for births that extend the structure's bounding box */
  growthFrontierBoost: 0.8,
  /** death multiplier for cells that define the structure's current reach */
  extentGuard: 0.12,
  /** growth ends when the bbox is within this margin (units) of the bounds */
  extentMargin: 1,
  deathRate: 0.02,
  /** alive cells are safe from decay for this many ticks */
  graceTicks: 16,
  agingTau: 220,
  /** neighbor-contagion gain — births only happen on the frontier of the
   * structure, so it grows as one organism */
  contagion: 1.6,

  /** slow sine drift so birth and decay run at visibly varying rates */
  birthWavePeriod: 70,
  birthWaveDepth: 0.35,
  deathWavePeriod: 89,
  deathWaveDepth: 0.3,

  /** homeostat — sparse equilibrium, field mostly black like the reference */
  lowWater: 0.1,
  highWater: 0.18,

  /** never decay below this many alive cells */
  minAlive: 4,

  splitAliveChance: 0.009,
  splitMinAge: 12,
  splitEmptyChance: 0.03,
  mergeChance: 0.015,
  mergeMinAge: 22,

  /** ticks between the blink signal and the actual split/birth */
  signalDelay: 3,
  /** how much slower the structure's center evolves vs its leaves (0..1) */
  centerCalm: 0.4,

  /** mouse trail — cells seeded under the pointer per tick, balancing kills
   * per tick, and the radius (units) around the pointer that those
   * balancing kills never touch */
  seedPerTick: 6,
  seedKillPerTick: 3,
  pointerSafeRadius: 10,
  /** seeded trail cells are split down to this size before being born */
  seedSize: 1,

  /** max concurrent set pieces */
  caps: { text: 3, tile: 8, dots: 5, panels: 6 } as Partial<Record<Variant, number>>,
}

/** variants that read as set pieces — never split while alive */
const SPLIT_EXEMPT: ReadonlySet<Variant> = new Set(['text', 'tile', 'dots', 'panels'])

type WeightTable = readonly (readonly [Variant, number])[]

const WEIGHTS: Record<number, WeightTable> = {
  1: [
    ['box', 80],
    ['flow', 8],
    ['hatch', 12],
  ],
  2: [
    ['box', 64],
    ['hatch', 22],
    ['flow', 14],
  ],
  4: [
    ['box', 32],
    ['hatch', 16],
    ['tile', 14],
    ['dots', 12],
    ['panels', 10],
    ['text', 10],
    ['flow', 6],
  ],
  8: [
    ['tile', 30],
    ['text', 18],
    ['panels', 16],
    ['hatch', 14],
    ['dots', 12],
    ['box', 10],
  ],
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const cellKey = (x: number, y: number) => `${x},${y}`

export class HeroSim {
  readonly bounds: Bounds
  readonly regions = new Map<number, Region>()

  /** unit cell -> region id covering it; every cell in bounds is covered */
  private occ = new Map<string, number>()
  private rand: () => number
  private nextId = 1
  private tickCount = 0
  private capCounts = new Map<Variant, number>()
  private events: SimEvent[] = []

  /** seeded 2×2 cluster of 2-unit squares, centered in the world */
  private cluster: Bounds

  /** monotonic bbox of everything ever born */
  private bbox: Bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  /** 'growth' pushes the extent to the frame edges, then 'churn' takes over */
  private phase: 'growth' | 'churn' = 'growth'
  private churnStart = 0

  /** deferred actions — the affected cell blinks first, then the change runs */
  private pending: { ticks: number; kind: 'birth' | 'split'; id: number; lockId?: number }[] = []
  private queuedIds = new Set<number>()
  /** alive cells whose blink promised a change — protected until it lands */
  private locked = new Map<number, number>()

  /** unit cells the pointer crossed since the last tick */
  private seedQueue: { x: number; y: number }[] = []
  /** last known pointer position (units), if the pointer is over the field */
  private pointer: { x: number; y: number } | null = null
  /** every seeded birth owes one death far from the pointer */
  private seedDebt = 0

  constructor(seed = 1) {
    this.rand = mulberry32(seed)
    this.bounds = { minX: 0, minY: 0, maxX: SIM.cols, maxY: SIM.rows }
    const cx = SIM.cols / 2
    const cy = SIM.rows / 2
    this.cluster = { minX: cx - 2, minY: cy - 2, maxX: cx + 2, maxY: cy + 2 }
  }

  /** Build the initial field: all empty except the seeded center cluster. */
  init(): SimEvent[] {
    this.events = []
    let clusterIdx = 0
    const subdivide = (x: number, y: number, size: number) => {
      if (size === 2 && this.insideCluster(x, y, size)) {
        // top-left cluster cell is the hatched one, like the opening frame
        this.birth(this.addRegion(x, y, size), false, clusterIdx++ === 0 ? 'hatch' : 'box')
        return
      }
      const mustSplit = size > 2 && this.intersectsCluster(x, y, size)
      if (size > 1 && (mustSplit || this.rand() < (SIM.initSplitChance[size] ?? 0))) {
        const h = size / 2
        subdivide(x, y, h)
        subdivide(x + h, y, h)
        subdivide(x, y + h, h)
        subdivide(x + h, y + h, h)
      } else {
        this.addRegion(x, y, size)
      }
    }
    for (let bx = this.bounds.minX; bx < this.bounds.maxX; bx += SIM.block) {
      for (let by = this.bounds.minY; by < this.bounds.maxY; by += SIM.block) {
        subdivide(bx, by, SIM.block)
      }
    }
    return this.events
  }

  /** Mark a unit cell crossed by the pointer; it becomes alive next tick. */
  queueSeed(ux: number, uy: number) {
    const x = Math.floor(ux)
    const y = Math.floor(uy)
    if (x < this.bounds.minX || x >= this.bounds.maxX) return
    if (y < this.bounds.minY || y >= this.bounds.maxY) return
    this.seedQueue.push({ x, y })
  }

  setPointer(ux: number, uy: number) {
    this.pointer = { x: ux, y: uy }
  }

  clearPointer() {
    this.pointer = null
  }

  tick(): SimEvent[] {
    this.events = []
    const t = ++this.tickCount

    // Run deferred actions whose blink lead-time has elapsed. A blink is a
    // promise: the queued cell and its signaling neighbor are protected from
    // death/split/merge while pending, so the change always lands.
    const ready = this.pending.filter((p) => --p.ticks <= 0)
    this.pending = this.pending.filter((p) => p.ticks > 0)
    for (const p of ready) {
      this.queuedIds.delete(p.id)
      if (p.lockId !== undefined) this.unlock(p.lockId)
      const r = this.regions.get(p.id)
      if (!r) continue
      if (p.kind === 'birth') {
        if (!r.alive) this.birth(r)
      } else if (r.size > 1) {
        if (!r.alive || (r.variant !== null && !SPLIT_EXEMPT.has(r.variant))) this.split(r)
      }
    }

    // Mouse trail: cells the pointer crossed are split down to trail size
    // and born immediately. Each seeded birth accrues a death debt paid by
    // cells far from the pointer, so the field's sparsity holds.
    if (this.seedQueue.length > 0) {
      const seen = new Set<string>()
      let seeded = 0
      for (const pt of this.seedQueue) {
        if (seeded >= SIM.seedPerTick) break
        const key = cellKey(pt.x, pt.y)
        if (seen.has(key)) continue
        seen.add(key)
        let id = this.occ.get(key)
        let r = id !== undefined ? this.regions.get(id) : undefined
        if (!r || r.alive || this.queuedIds.has(r.id)) continue
        while (r && r.size > SIM.seedSize) {
          this.split(r)
          id = this.occ.get(key)
          r = id !== undefined ? this.regions.get(id) : undefined
        }
        if (!r || r.alive) continue
        this.birth(r)
        this.seedDebt++
        seeded++
      }
      this.seedQueue = []
    }

    // Phase transition: growth ends once the structure spans almost the
    // whole frame; churn develops it from there.
    if (this.phase === 'growth' && this.bboxSpansFrame()) {
      this.phase = 'churn'
      this.churnStart = t
    }
    const growing = this.phase === 'growth'

    // Growth holds birth at max; churn decays it toward its floor. Both
    // rates drift on slow sine waves so the churn comes in visible pulses.
    let birth = growing
      ? SIM.birthMax
      : SIM.birthFloor +
        (SIM.birthMax - SIM.birthFloor) * Math.exp(-(t - this.churnStart) / SIM.birthDecayTau)
    birth *= 1 + SIM.birthWaveDepth * Math.sin((t * 2 * Math.PI) / SIM.birthWavePeriod)
    let death = SIM.deathRate
    death *= 1 + SIM.deathWaveDepth * Math.sin((t * 2 * Math.PI) / SIM.deathWavePeriod + 2)

    // Homeostat on alive area fraction — keeps the field sparse but alive.
    // The growth phase tolerates more density so spread never stalls.
    let aliveArea = 0
    let totalArea = 0
    let aliveCount = 0
    const live = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    for (const r of this.regions.values()) {
      totalArea += r.size * r.size
      if (r.alive) {
        aliveArea += r.size * r.size
        aliveCount++
        live.minX = Math.min(live.minX, r.x)
        live.minY = Math.min(live.minY, r.y)
        live.maxX = Math.max(live.maxX, r.x + r.size)
        live.maxY = Math.max(live.maxY, r.y + r.size)
      }
    }
    const aliveFrac = totalArea > 0 ? aliveArea / totalArea : 0
    // Proportional control: birth fades to zero as density nears the ceiling,
    // so contagion can never saturate the field. Frontier births that push
    // the extent outward bypass the ceiling (densitiy must never stall reach).
    const highWater = growing ? SIM.growthHighWater : SIM.highWater
    const ceiling = highWater * 1.15
    const room = Math.min(1, Math.max(0, (ceiling - aliveFrac) / (ceiling - SIM.lowWater)))
    const birthRaw = birth * (aliveFrac < SIM.lowWater ? 2.2 : 1)
    birth *= aliveFrac < SIM.lowWater ? 2.2 : room
    if (aliveFrac > highWater) death *= 1 + (aliveFrac - highWater) * 8

    // Births, deaths, aging. Leaves (far from the structure's center) evolve
    // at full rate; the center keeps changing, just slower.
    for (const r of [...this.regions.values()]) {
      if (!this.regions.has(r.id)) continue
      r.age++
      const cal = this.centrality(r)
      if (r.alive) {
        // cells defining the structure's reach are heavily death-protected,
        // so the full-frame extent survives the churn
        const guardsExtent =
          r.x === live.minX ||
          r.y === live.minY ||
          r.x + r.size === live.maxX ||
          r.y + r.size === live.maxY
        if (
          aliveCount > SIM.minAlive &&
          r.age > SIM.graceTicks &&
          !this.queuedIds.has(r.id) &&
          !this.locked.has(r.id) &&
          this.rand() <
            death * (1 + r.age / SIM.agingTau) * cal * (guardsExtent ? SIM.extentGuard : 1) &&
          !this.wouldDisconnect(r)
        ) {
          this.kill(r)
          aliveCount--
        }
      } else if (!this.queuedIds.has(r.id)) {
        const f = this.aliveBorderFraction(r)
        if (f > 0) {
          // Growth flattens the neighbor curve (sqrt) so thin frontier
          // tendrils spread as readily as holes fill; extent-pushing births
          // skip the density ceiling entirely. Churn boosts births near the
          // frame border so the structure holds its full reach.
          const reExtends =
            r.x < live.minX ||
            r.y < live.minY ||
            r.x + r.size > live.maxX ||
            r.y + r.size > live.maxY
          let p: number
          if (growing) {
            p = this.extendsBBox(r)
              ? birthRaw * (SIM.growthBase + Math.sqrt(f)) * SIM.growthFrontierBoost
              : birth * (SIM.growthBase + Math.sqrt(f))
          } else if (reExtends) {
            // self-healing reach: births past the live extent skip the
            // density ceiling, so eroded edges grow back
            p = birthRaw * (SIM.growthBase + Math.sqrt(f)) * SIM.growthFrontierBoost
          } else {
            const edge = 1 - Math.min(this.frameDistance(r) / 4, 1)
            p = birth * f * SIM.contagion * cal * (1 + 1.4 * edge)
          }
          if (this.rand() < p) {
            // blink an alive neighbor, lock it so it survives the lead-time,
            // then grow right as the blink lands
            const nbrs = this.aliveNeighborIds(r)
            const src = nbrs.length > 0 ? nbrs[0] : undefined
            if (src !== undefined) {
              this.events.push({ type: 'signal', id: src })
              this.lock(src)
            }
            this.pending.push({ ticks: SIM.signalDelay, kind: 'birth', id: r.id, lockId: src })
            this.queuedIds.add(r.id)
          }
        }
      }
    }

    // Pay the seeding debt: the trail adds density near the pointer, so
    // cells far from it die at replacement rate to keep the field sparse.
    if (this.seedDebt > 0) {
      const candidates: Region[] = []
      for (const r of this.regions.values()) {
        if (!r.alive || r.age <= SIM.graceTicks) continue
        if (this.queuedIds.has(r.id) || this.locked.has(r.id)) continue
        const guardsExtent =
          r.x === live.minX ||
          r.y === live.minY ||
          r.x + r.size === live.maxX ||
          r.y + r.size === live.maxY
        if (guardsExtent) continue
        if (this.pointer) {
          const d = Math.hypot(
            r.x + r.size / 2 - this.pointer.x,
            r.y + r.size / 2 - this.pointer.y,
          )
          if (d < SIM.pointerSafeRadius) continue
        }
        candidates.push(r)
      }
      let pay = Math.min(this.seedDebt, SIM.seedKillPerTick)
      while (pay > 0 && candidates.length > 0 && aliveCount > SIM.minAlive) {
        const i = Math.floor(this.rand() * candidates.length)
        const r = candidates[i]
        candidates.splice(i, 1)
        if (this.wouldDisconnect(r)) continue
        this.kill(r)
        this.seedDebt--
        aliveCount--
        pay--
      }
    }

    // Live subdivision: alive regions refine; coarse empty regions near
    // activity refine so the frontier gains detail as it ages.
    for (const r of [...this.regions.values()]) {
      if (
        !this.regions.has(r.id) ||
        r.size === 1 ||
        this.queuedIds.has(r.id) ||
        this.locked.has(r.id)
      )
        continue
      if (r.alive) {
        if (
          r.age > SIM.splitMinAge &&
          r.variant !== null &&
          !SPLIT_EXEMPT.has(r.variant) &&
          this.rand() < SIM.splitAliveChance * this.centrality(r)
        ) {
          this.events.push({ type: 'signal', id: r.id })
          this.pending.push({ ticks: SIM.signalDelay, kind: 'split', id: r.id })
          this.queuedIds.add(r.id)
        }
      } else if (
        r.size >= 4 &&
        this.rand() < SIM.splitEmptyChance &&
        this.aliveBorderFraction(r) > 0
      ) {
        this.split(r)
      }
    }

    // Merges: 4 settled empty siblings collapse back into their parent.
    for (const r of [...this.regions.values()]) {
      if (!this.regions.has(r.id) || r.alive || r.size >= SIM.block) continue
      if (this.rand() >= SIM.mergeChance) continue
      this.tryMerge(r)
    }

    return this.events
  }

  // -- internals ------------------------------------------------------------

  private insideCluster(x: number, y: number, size: number): boolean {
    const c = this.cluster
    return x >= c.minX && y >= c.minY && x + size <= c.maxX && y + size <= c.maxY
  }

  private intersectsCluster(x: number, y: number, size: number): boolean {
    const c = this.cluster
    return x < c.maxX && x + size > c.minX && y < c.maxY && y + size > c.minY
  }

  private addRegion(x: number, y: number, size: number): Region {
    const r: Region = { id: this.nextId++, x, y, size, alive: false, variant: null, age: 0 }
    this.regions.set(r.id, r)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        this.occ.set(cellKey(x + i, y + j), r.id)
      }
    }
    return r
  }

  private removeRegion(r: Region) {
    this.regions.delete(r.id)
    for (let i = 0; i < r.size; i++) {
      for (let j = 0; j < r.size; j++) {
        this.occ.delete(cellKey(r.x + i, r.y + j))
      }
    }
    if (r.alive && r.variant) this.bumpCap(r.variant, -1)
    this.events.push({ type: 'removed', id: r.id })
  }

  private bumpCap(variant: Variant, delta: number) {
    if (SIM.caps[variant] === undefined) return
    this.capCounts.set(variant, (this.capCounts.get(variant) ?? 0) + delta)
  }

  private birth(r: Region, fromSplit = false, forced?: Variant) {
    r.alive = true
    r.age = 0
    r.variant = forced ?? this.pickVariant(r.size)
    this.bumpCap(r.variant, 1)
    this.bbox.minX = Math.min(this.bbox.minX, r.x)
    this.bbox.minY = Math.min(this.bbox.minY, r.y)
    this.bbox.maxX = Math.max(this.bbox.maxX, r.x + r.size)
    this.bbox.maxY = Math.max(this.bbox.maxY, r.y + r.size)
    this.events.push({ type: 'born', region: r, fromSplit })
  }

  /** units between the region and the nearest frame border */
  private frameDistance(r: Region): number {
    return Math.min(
      r.x - this.bounds.minX,
      r.y - this.bounds.minY,
      this.bounds.maxX - (r.x + r.size),
      this.bounds.maxY - (r.y + r.size),
    )
  }

  /** 1 at the structure's edge, centerCalm at its center */
  private centrality(r: Region): number {
    if (!Number.isFinite(this.bbox.minX)) return 1
    const cx = (this.bbox.minX + this.bbox.maxX) / 2
    const cy = (this.bbox.minY + this.bbox.maxY) / 2
    const rx = Math.max(1, (this.bbox.maxX - this.bbox.minX) / 2)
    const ry = Math.max(1, (this.bbox.maxY - this.bbox.minY) / 2)
    const dx = (r.x + r.size / 2 - cx) / rx
    const dy = (r.y + r.size / 2 - cy) / ry
    const d = Math.min(1, Math.hypot(dx, dy))
    return SIM.centerCalm + (1 - SIM.centerCalm) * d
  }

  private bboxSpansFrame(): boolean {
    const m = SIM.extentMargin
    return (
      this.bbox.maxX - this.bbox.minX >= SIM.cols - 2 * m &&
      this.bbox.maxY - this.bbox.minY >= SIM.rows - 2 * m
    )
  }

  private extendsBBox(r: Region): boolean {
    return (
      r.x < this.bbox.minX ||
      r.y < this.bbox.minY ||
      r.x + r.size > this.bbox.maxX ||
      r.y + r.size > this.bbox.maxY
    )
  }

  private kill(r: Region) {
    const variant = r.variant as Variant
    this.bumpCap(variant, -1)
    r.alive = false
    r.age = 0
    r.variant = null
    this.events.push({ type: 'died', region: r, variant })
  }

  private pickVariant(size: number): Variant {
    const table = WEIGHTS[size] ?? WEIGHTS[1]
    const total = table.reduce((sum, [, w]) => sum + w, 0)
    let roll = this.rand() * total
    let picked: Variant = table[0][0]
    for (const [variant, w] of table) {
      roll -= w
      if (roll <= 0) {
        picked = variant
        break
      }
    }
    const cap = SIM.caps[picked]
    if (cap !== undefined && (this.capCounts.get(picked) ?? 0) >= cap) picked = 'box'
    return picked
  }

  /** Fraction of in-bounds border unit cells that touch an alive region. */
  private aliveBorderFraction(r: Region): number {
    let total = 0
    let alive = 0
    const probe = (x: number, y: number) => {
      if (x < this.bounds.minX || x >= this.bounds.maxX) return
      if (y < this.bounds.minY || y >= this.bounds.maxY) return
      total++
      const id = this.occ.get(cellKey(x, y))
      if (id !== undefined && this.regions.get(id)?.alive) alive++
    }
    for (let i = 0; i < r.size; i++) {
      probe(r.x + i, r.y - 1)
      probe(r.x + i, r.y + r.size)
      probe(r.x - 1, r.y + i)
      probe(r.x + r.size, r.y + i)
    }
    return total > 0 ? alive / total : 0
  }

  /** Distinct alive regions sharing an edge with r. */
  private aliveNeighborIds(r: Region): number[] {
    const ids = new Set<number>()
    const probe = (x: number, y: number) => {
      const id = this.occ.get(cellKey(x, y))
      if (id !== undefined && this.regions.get(id)?.alive) ids.add(id)
    }
    for (let i = 0; i < r.size; i++) {
      probe(r.x + i, r.y - 1)
      probe(r.x + i, r.y + r.size)
      probe(r.x - 1, r.y + i)
      probe(r.x + r.size, r.y + i)
    }
    return [...ids]
  }

  /** Would removing r from the alive graph split it into components? */
  private wouldDisconnect(r: Region): boolean {
    const nbrs = this.aliveNeighborIds(r)
    if (nbrs.length <= 1) return false
    const targets = new Set(nbrs.slice(1))
    const seen = new Set<number>([r.id, nbrs[0]])
    const queue = [nbrs[0]]
    while (queue.length > 0 && targets.size > 0) {
      const reg = this.regions.get(queue.pop() as number)
      if (!reg) continue
      for (const nid of this.aliveNeighborIds(reg)) {
        if (seen.has(nid)) continue
        seen.add(nid)
        targets.delete(nid)
        queue.push(nid)
      }
    }
    return targets.size > 0
  }

  private lock(id: number) {
    this.locked.set(id, (this.locked.get(id) ?? 0) + 1)
  }

  private unlock(id: number) {
    const n = (this.locked.get(id) ?? 0) - 1
    if (n <= 0) this.locked.delete(id)
    else this.locked.set(id, n)
  }

  private split(r: Region) {
    const wasAlive = r.alive
    const h = r.size / 2
    this.removeRegion(r)
    for (const [dx, dy] of [
      [0, 0],
      [h, 0],
      [0, h],
      [h, h],
    ]) {
      // an alive split always yields four alive children — a cell that
      // blinks and subdivides must visibly become 4 cells, never 3
      const child = this.addRegion(r.x + dx, r.y + dy, h)
      if (wasAlive) this.birth(child, true)
    }
  }

  private tryMerge(r: Region) {
    const parentSize = r.size * 2
    // canonical (top-left) child of its parent square only
    const px = Math.floor(r.x / parentSize) * parentSize
    const py = Math.floor(r.y / parentSize) * parentSize
    if (px !== r.x || py !== r.y) return

    const siblings: Region[] = []
    for (const [dx, dy] of [
      [0, 0],
      [r.size, 0],
      [0, r.size],
      [r.size, r.size],
    ]) {
      const id = this.occ.get(cellKey(px + dx, py + dy))
      const sib = id !== undefined ? this.regions.get(id) : undefined
      if (
        !sib ||
        sib.size !== r.size ||
        sib.x !== px + dx ||
        sib.y !== py + dy ||
        sib.alive ||
        sib.age < SIM.mergeMinAge ||
        this.queuedIds.has(sib.id)
      ) {
        return
      }
      siblings.push(sib)
    }
    for (const sib of siblings) this.removeRegion(sib)
    this.addRegion(px, py, parentSize)
  }
}
