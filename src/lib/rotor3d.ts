/**
 * Centrifuge rotor — geometry, projection and swing physics kernel.
 *
 * Framework-free on purpose (no React / DOM): the browser viewer and the offline
 * geometry check in Node run exactly the same code.
 *
 * Model space:  x / y = rotor plane,  z = rotor axis (up).
 *              1 model unit ≈ 1 mm at the simulation scale.
 * Camera:      axonometric, orthographic, looking from (+x, +y, +z).
 *                 sx = (x - y) · cos30
 *                 sy = (x + y) · sin30 - z
 *              (screen y grows downwards, so +z is up on screen)
 */

export interface V3 {
  x: number
  y: number
  z: number
}

export interface Face {
  /** "x,y x,y …" — ready for an SVG <polygon points=…> */
  pts: string
  fill: string
  stroke: string
  /** painter's-algorithm key; larger = nearer to the camera */
  depth: number
}

/** A horizontal circle projects to an axis-aligned ellipse in this projection. */
export interface Ring {
  cx: number
  cy: number
  rx: number
  ry: number
}

export interface Scene {
  faces: Face[]
  /** filled horizontal discs (base plate) and outlined ones (chamber envelope) */
  discs: (Ring & { fill: string; stroke: string })[]
  rings: (Ring & { stroke: string; dash: string })[]
  /** projected anchors for the bucket instance labels, in bucket order */
  labels: { x: number; y: number; angle: number }[]
  skeleton: {
    /** rotor axis (Z) */
    axis: [number, number, number, number]
    /** rotor index line, rotates with the rotor */
    rotorIndex: [number, number, number, number]
    /** hinge (pivot) axis of the highlighted bucket — the Angle constraint */
    hinge: [number, number, number, number]
    /** swing sweep of the highlighted bucket, 0° → 90° */
    swingArc: string
    swingOrigin: [number, number]
    /** midpoint of the swing arc — anchor for the θ callout */
    swingMid: [number, number]
  }
  bbox: { minX: number; minY: number; maxX: number; maxY: number }
  /** outer envelope reached by the bucket tips at the current pose */
  tipRadius: number
}

/* ── simulation parameters ─────────────────────────────────────────────
 * PIVOT_RADIUS_M is a *simulation input* (bucket pivot radius from the rotor
 * axis), used for the RCF readout and for the swing equilibrium angle.
 * The visual model is a schematic of the assembly structure read from the
 * .CATProduct — it is not a dimensional replica of the .CATPart solids.
 * -------------------------------------------------------------------- */
export const G0 = 9.80665
export const PIVOT_RADIUS_M = 0.112
export const MAX_RPM = 6000
/** below this the buckets are resting on their stop, hanging straight down */
export const SWING_STOP_DEG = 90

/* ── model dimensions (model units) ── */
const PIVOT_R = 112 // rotor axis → bucket pivot (matches PIVOT_RADIUS_M @ 1 u = 1 mm)
const HUB_R = 36
const HUB_Z0 = 0
const HUB_Z1 = 26
const SHAFT_R = 13
const SHAFT_Z0 = -96
const SHAFT_Z1 = 6
const ARM_U0 = 22
const ARM_U1 = 120
const ARM_HV = 17
const ARM_Z0 = 6
const ARM_Z1 = 18
const CHEEK_U0 = 100
const CHEEK_U1 = 124
const CHEEK_V0 = 17
const CHEEK_V1 = 21.5
const CHEEK_Z0 = -18
const CHEEK_Z1 = 8
const PIVOT_Z = -12
const PIN_R = 5
const PIN_HALF = 22
const BUCKET_R = 15
const BUCKET_IR = 11.2
const BUCKET_D0 = 4
const BUCKET_D1 = 74
const BUCKET_BOTTOM = 4
const CHAMBER_R = 205
const RIM_Z = 40
const PLATE_R = 205
const PLATE_Z = -104

const SEG_TUBE = 12
const SEG_PIN = 8
const SEG_HUB = 16
const SEG_SHAFT = 12

/* ── projection ── */
const C30 = Math.cos(Math.PI / 6)
const S30 = 0.5
/** horizontal circle → ellipse semi-axes per unit radius */
export const ELLIPSE_RX = C30 * Math.SQRT2 // 1.2247
export const ELLIPSE_RY = S30 * Math.SQRT2 // 0.7071

export const VIEW = { scale: 0.62, cx: 260, cy: 208 }

/**
 * Equilibrium swing angle of a swinging bucket: tan θ = ω²r / g.
 * The rotor has a 90° mechanical stop, so the equilibrium saturates there —
 * this is the angle the Angle constraint is driven to (0° → 90°).
 */
export function steadySwingDeg(rpm: number, r: number = PIVOT_RADIUS_M): number {
  const omega = (rpm / 60) * 2 * Math.PI
  const ideal = (Math.atan2(omega * omega * r, G0) * 180) / Math.PI
  return ideal >= 89.5 ? SWING_STOP_DEG : ideal
}

/** true when the buckets are pressed against their 90° mechanical stop */
export function atSwingStop(rpm: number, r: number = PIVOT_RADIUS_M): boolean {
  return steadySwingDeg(rpm, r) >= SWING_STOP_DEG
}

/** relative centrifugal field at the bucket pivot */
export function rcf(rpm: number, r: number = PIVOT_RADIUS_M): number {
  const omega = (rpm / 60) * 2 * Math.PI
  return (omega * omega * r) / G0
}

/** rpm at which the buckets reach `deg` (inverse of steadySwingDeg except at the stop) */
export function rpmForSwingDeg(deg: number, r: number = PIVOT_RADIUS_M): number {
  const theta = (Math.min(deg, 89.9) * Math.PI) / 180
  const omega = Math.sqrt((Math.tan(theta) * G0) / r)
  return (omega * 60) / (2 * Math.PI)
}

/* ── mechanism dynamics ─────────────────────────────────────────────────
 * The rotor slews towards its target speed while each bucket relaxes, with
 * inertia + damping, towards the swing equilibrium of the current speed — so
 * the swing-out transient (and a small overshoot on the stop) is visible.
 * -------------------------------------------------------------------- */
export const RPM_SLEW = 2400 // rpm/s
const K_BASE = 30 // swing stiffness, 1/s²  (ω_n ≈ 5.5 rad/s)
const ZETA = 0.42 // swing damping ratio
const STOP_SLACK = 3 // overshoot allowed before the bucket hits the stop

export interface Sim {
  /** rotor angle, degrees */
  phi: number
  /** actual rotor speed, rpm */
  rpm: number
  /** per-bucket swing angle, degrees */
  a: number[]
  /** per-bucket angular velocity, deg/s */
  v: number[]
  /** simulation clock, s */
  t: number
}

export const initialSim = (buckets = 4): Sim => ({
  phi: 0,
  rpm: 0,
  a: Array(buckets).fill(0),
  v: Array(buckets).fill(0),
  t: 0,
})

const clampN = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

/** One integration step. `rpmTarget` is the drive; `spin` freezes the rotor angle. */
export function advanceSim(s: Sim, dt: number, rpmTarget: number, spin: boolean): Sim {
  const rpm = s.rpm + clampN(rpmTarget - s.rpm, -RPM_SLEW * dt, RPM_SLEW * dt)
  const target = steadySwingDeg(rpm)
  const a = s.a.slice()
  const v = s.v.slice()
  for (let i = 0; i < a.length; i++) {
    const k = K_BASE * (1 + i * 0.015)
    const c = 2 * Math.sqrt(k) * ZETA
    v[i] += (k * (target - a[i]) - c * v[i]) * dt
    a[i] += v[i] * dt
    if (a[i] > SWING_STOP_DEG + STOP_SLACK) {
      a[i] = SWING_STOP_DEG + STOP_SLACK
      if (v[i] > 0) v[i] = 0
    }
    if (a[i] < 0) {
      a[i] = 0
      if (v[i] < 0) v[i] = 0
    }
  }
  const omega = (rpm / 60) * 2 * Math.PI
  const phi = spin ? (s.phi + (omega * dt * 180) / Math.PI) % 360 : s.phi
  return { phi, rpm, a, v, t: s.t + dt }
}

/** true when nothing would change any more — lets the animation loop stop */
export function simSettled(s: Sim, rpmTarget: number): boolean {
  if (Math.abs(s.rpm - rpmTarget) > 1) return false
  const target = steadySwingDeg(rpmTarget)
  return s.a.every((x, i) => Math.abs(s.v[i]) < 0.05 && Math.abs(x - target) < 0.05)
}

/* ── vector helpers ── */
const v3 = (x: number, y: number, z: number): V3 => ({ x, y, z })
const RAD = Math.PI / 180

function norm(v: V3): V3 {
  const l = Math.hypot(v.x, v.y, v.z) || 1
  return v3(v.x / l, v.y / l, v.z / l)
}

function cross(a: V3, b: V3): V3 {
  return v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x)
}

function add(a: V3, b: V3): V3 {
  return v3(a.x + b.x, a.y + b.y, a.z + b.z)
}

function mul(a: V3, k: number): V3 {
  return v3(a.x * k, a.y * k, a.z * k)
}

/* ── geometry builders ──────────────────────────────────────────────── */
type RGB = [number, number, number]
interface Raw {
  p: V3[]
  base: RGB
  cull: boolean
}

function quad(raw: Raw[], base: RGB, a: V3, b: V3, c: V3, d: V3, cull = true) {
  raw.push({ p: [a, b, c, d], base, cull })
}

/** Arbitrary polygon (winding must put the outward normal on the cross product). */
function poly(raw: Raw[], base: RGB, pts: V3[], cull = true) {
  raw.push({ p: pts, base, cull })
}

/** Axis-aligned (in the e1/e2/e3 frame) box. Frame must be right-handed. */
function box(raw: Raw[], o: V3, e1: V3, e2: V3, e3: V3, h1: number, h2: number, h3: number, base: RGB) {
  const s = (i: number, j: number, k: number): V3 =>
    add(add(add(o, mul(e1, i * h1)), mul(e2, j * h2)), mul(e3, k * h3))
  // +e3, -e3, +e1, -e1, +e2, -e2 — winding chosen so every normal points outwards
  quad(raw, base, s(-1, -1, 1), s(1, -1, 1), s(1, 1, 1), s(-1, 1, 1))
  quad(raw, base, s(-1, -1, -1), s(-1, 1, -1), s(1, 1, -1), s(1, -1, -1))
  quad(raw, base, s(1, -1, -1), s(1, 1, -1), s(1, 1, 1), s(1, -1, 1))
  quad(raw, base, s(-1, -1, -1), s(-1, -1, 1), s(-1, 1, 1), s(-1, 1, -1))
  quad(raw, base, s(1, 1, -1), s(-1, 1, -1), s(-1, 1, 1), s(1, 1, 1))
  quad(raw, base, s(-1, -1, -1), s(1, -1, -1), s(1, -1, 1), s(-1, -1, 1))
}

/**
 * Cylinder along an arbitrary axis. `u` must be perpendicular to `axis`;
 * `cross(u, w) === axis` with w = cross(axis, u), i.e. (u, w, axis) right-handed.
 */
function tube(
  raw: Raw[],
  opts: {
    origin: V3
    axis: V3
    u: V3
    r: number
    d0: number
    d1: number
    seg: number
    base: RGB
    /** inner radius of the open end at d0 — draws a hollow bore */
    bore?: number
    /** depth of the bore disc below d0 (fakes a visible wall thickness) */
    boreDrop?: number
    capStart?: boolean
    capEnd?: boolean
  },
) {
  const { origin, axis, u, r, d0, d1, seg, base } = opts
  const w = cross(axis, u)
  const ring = (dist: number, radius: number): V3[] =>
    Array.from({ length: seg }, (_, i) => {
      const a = (i / seg) * Math.PI * 2
      return add(add(origin, mul(axis, dist)), add(mul(u, Math.cos(a) * radius), mul(w, Math.sin(a) * radius)))
    })

  const a0 = ring(d0, r)
  const a1 = ring(d1, r)
  for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg
    quad(raw, base, a0[i], a0[j], a1[j], a1[i])
  }
  if (opts.capStart !== false) poly(raw, base, a0)
  if (opts.capEnd !== false) poly(raw, base, a1.slice().reverse())
  if (opts.bore !== undefined) {
    const bi = ring(d0 + (opts.boreDrop ?? 6), opts.bore)
    raw.push({ p: bi, base: [16, 22, 30], cull: false })
  }
}

/* ── palette & lighting ─────────────────────────────────────────────── */
const STEEL_ARM: RGB = [150, 162, 174]
const STEEL_HUB: RGB = [122, 134, 146]
const STEEL_SHAFT: RGB = [84, 96, 108]
const STEEL_CHEEK: RGB = [136, 148, 160]
const STEEL_BUCKET: RGB = [170, 181, 191]
const STEEL_BUCKET_HL: RGB = [96, 190, 210]
const ACCENT: RGB = [64, 208, 232]
const MARK: RGB = [167, 139, 250]

const LIGHT = norm(v3(0.36, -0.26, 0.9))

const clamp255 = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
const rgbCss = (c: RGB, k = 1) => `rgb(${clamp255(c[0] * k)},${clamp255(c[1] * k)},${clamp255(c[2] * k)})`

export interface SceneOptions {
  /** rotor rotation about z, degrees */
  rotorDeg: number
  /** per-bucket swing angle, degrees — 0 hangs straight down, 90 is horizontal */
  bucketDeg: number[]
  /** index of the bucket carrying the angle-constraint annotation */
  highlight?: number
}

/** Projects a model point to viewBox coordinates. */
export function project(p: V3): { x: number; y: number } {
  const { scale, cx, cy } = VIEW
  return {
    x: cx + (p.x - p.y) * C30 * scale,
    y: cy + ((p.x + p.y) * S30 - p.z) * scale,
  }
}

/**
 * Builds the projected, shaded, painter-sorted scene for a single frame.
 * Pure: identical input → identical output.
 */
export function buildScene(o: SceneOptions): Scene {
  const raw: Raw[] = []
  const { scale, cx, cy } = VIEW
  const phi = o.rotorDeg
  const zAxis = v3(0, 0, 1)

  /** horizontal circle → axis-aligned ellipse */
  const ellipse = (radius: number, z: number): Ring => ({
    cx,
    cy: cy - z * scale,
    rx: ELLIPSE_RX * radius * scale,
    ry: ELLIPSE_RY * radius * scale,
  })

  const discs = [{ ...ellipse(PLATE_R, PLATE_Z), fill: 'rgba(15,21,29,0.82)', stroke: 'rgba(64,208,232,0.16)' }]
  const rings = [
    { ...ellipse(CHAMBER_R, RIM_Z), stroke: 'rgba(64,208,232,0.30)', dash: '5 7' },
    { ...ellipse(PLATE_R, PLATE_Z), stroke: 'rgba(64,208,232,0.18)', dash: '' },
  ]

  /* bottom shaft + hub (the "+"-shaped header body) */
  tube(raw, {
    origin: v3(0, 0, SHAFT_Z0),
    axis: zAxis,
    u: v3(1, 0, 0),
    r: SHAFT_R,
    d0: 0,
    d1: SHAFT_Z1 - SHAFT_Z0,
    seg: SEG_SHAFT,
    base: STEEL_SHAFT,
  })
  tube(raw, {
    origin: v3(0, 0, HUB_Z0),
    axis: zAxis,
    u: v3(1, 0, 0),
    r: HUB_R,
    d0: 0,
    d1: HUB_Z1 - HUB_Z0,
    seg: SEG_HUB,
    base: STEEL_HUB,
    bore: 11,
    boreDrop: 4,
  })

  const labels: { x: number; y: number; angle: number }[] = []
  let tipRadius = PIVOT_R

  for (let k = 0; k < 4; k++) {
    const alpha = (phi + k * 90) * RAD
    const er = v3(Math.cos(alpha), Math.sin(alpha), 0)
    const et = v3(-Math.sin(alpha), Math.cos(alpha), 0)
    const isHl = k === (o.highlight ?? 0)

    /* arm — radial box; arm 0 carries a violet index pad so the spin reads clearly */
    box(
      raw,
      add(mul(er, (ARM_U0 + ARM_U1) / 2), v3(0, 0, (ARM_Z0 + ARM_Z1) / 2)),
      er,
      et,
      zAxis,
      (ARM_U1 - ARM_U0) / 2,
      ARM_HV,
      (ARM_Z1 - ARM_Z0) / 2,
      k === 0 ? [166, 152, 182] : STEEL_ARM,
    )
    if (k === 0) {
      box(raw, add(mul(er, 62), v3(0, 0, ARM_Z1 + 3)), er, et, zAxis, 20, 13, 3, MARK)
    }

    /* clevis cheeks that straddle the bucket */
    for (const s of [-1, 1]) {
      box(
        raw,
        add(
          add(mul(er, (CHEEK_U0 + CHEEK_U1) / 2), mul(et, (s * (CHEEK_V0 + CHEEK_V1)) / 2)),
          v3(0, 0, (CHEEK_Z0 + CHEEK_Z1) / 2),
        ),
        er,
        et,
        zAxis,
        (CHEEK_U1 - CHEEK_U0) / 2,
        (CHEEK_V1 - CHEEK_V0) / 2,
        (CHEEK_Z1 - CHEEK_Z0) / 2,
        STEEL_CHEEK,
      )
    }

    /* trunnion pin — physical hinge of the bucket */
    const pivot = add(mul(er, PIVOT_R), v3(0, 0, PIVOT_Z))
    tube(raw, { origin: pivot, axis: et, u: zAxis, r: PIN_R, d0: -PIN_HALF, d1: PIN_HALF, seg: SEG_PIN, base: ACCENT })

    /* bucket — open tube swinging from hanging (0°) towards horizontal (90°) */
    const deg = Math.max(0, Math.min(93, o.bucketDeg[k] ?? 0))
    const th = deg * RAD
    const axis = norm(add(mul(er, Math.sin(th)), mul(zAxis, -Math.cos(th))))
    const dTip = BUCKET_D1 + BUCKET_BOTTOM
    tipRadius = Math.max(tipRadius, PIVOT_R + dTip * Math.sin(th))
    tube(raw, {
      origin: pivot,
      axis,
      u: et,
      r: BUCKET_R,
      d0: BUCKET_D0,
      d1: dTip,
      seg: SEG_TUBE,
      base: isHl ? STEEL_BUCKET_HL : STEEL_BUCKET,
      bore: BUCKET_IR,
      boreDrop: 5,
    })

    labels.push({ ...project(add(pivot, mul(axis, (BUCKET_D0 + dTip) / 2))), angle: deg })
  }

  /* ── project, cull back faces, shade, painter-sort ── */
  const faces: Face[] = []
  for (const f of raw) {
    const n = norm(
      cross(
        v3(f.p[1].x - f.p[0].x, f.p[1].y - f.p[0].y, f.p[1].z - f.p[0].z),
        v3(f.p[2].x - f.p[0].x, f.p[2].y - f.p[0].y, f.p[2].z - f.p[0].z),
      ),
    )
    if (f.cull && n.x + n.y + n.z <= 0.04) continue
    const lit = Math.max(0, n.x * LIGHT.x + n.y * LIGHT.y + n.z * LIGHT.z)
    const parts: string[] = []
    let depth = 0
    for (const p of f.p) {
      const q = project(p)
      parts.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`)
      depth += p.x + p.y + p.z
    }
    faces.push({
      pts: parts.join(' '),
      fill: rgbCss(f.base, 0.42 + 0.66 * lit),
      stroke: rgbCss(f.base, 0.2),
      depth: depth / f.p.length,
    })
  }
  faces.sort((a, b) => a.depth - b.depth)

  /* ── constraint skeleton, named after the real assembly features ── */
  const aHl = (phi + (o.highlight ?? 0) * 90) * RAD
  const erHl = v3(Math.cos(aHl), Math.sin(aHl), 0)
  const etHl = v3(-Math.sin(aHl), Math.cos(aHl), 0)
  const pivotHl = add(mul(erHl, PIVOT_R), v3(0, 0, PIVOT_Z))
  const seg2 = (a: V3, b: V3): [number, number, number, number] => {
    const pa = project(a)
    const pb = project(b)
    return [pa.x, pa.y, pb.x, pb.y]
  }
  const swingPts: string[] = []
  let swingMid: [number, number] = [0, 0]
  for (let i = 0; i <= 16; i++) {
    const t = (i / 16) * (Math.PI / 2) * 0.97
    const q = project(add(pivotHl, mul(add(mul(erHl, Math.sin(t)), v3(0, 0, -Math.cos(t))), 44)))
    swingPts.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`)
    if (i === 8) swingMid = [q.x, q.y]
  }
  const ia = phi * RAD
  const skeleton = {
    axis: seg2(v3(0, 0, PLATE_Z + 10), v3(0, 0, RIM_Z + 30)),
    rotorIndex: seg2(
      v3(Math.cos(ia) * HUB_R, Math.sin(ia) * HUB_R, HUB_Z1 + 1),
      v3(Math.cos(ia) * (ARM_U1 + 6), Math.sin(ia) * (ARM_U1 + 6), ARM_Z1 + 2),
    ),
    hinge: seg2(add(pivotHl, mul(etHl, -(PIN_HALF + 6))), add(pivotHl, mul(etHl, PIN_HALF + 6))),
    swingArc: swingPts.join(' '),
    swingOrigin: [project(pivotHl).x, project(pivotHl).y] as [number, number],
    swingMid,
  }

  /* ── bounds: used by the offline geometry check ── */
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const f of faces) {
    for (const pair of f.pts.split(' ')) {
      const [x, y] = pair.split(',').map(Number)
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }
  }
  for (const d of [...discs, ...rings]) {
    minX = Math.min(minX, d.cx - d.rx)
    maxX = Math.max(maxX, d.cx + d.rx)
    minY = Math.min(minY, d.cy - d.ry)
    maxY = Math.max(maxY, d.cy + d.ry)
  }

  return { faces, discs, rings, labels, skeleton, bbox: { minX, minY, maxX, maxY }, tipRadius }
}
