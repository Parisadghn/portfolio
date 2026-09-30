import { memo, useEffect, useRef, useState } from 'react'
import { Section } from './ui'
import {
  MAX_RPM,
  PIVOT_RADIUS_M,
  SWING_STOP_DEG,
  advanceSim,
  atSwingStop,
  buildScene,
  initialSim,
  rcf,
  simSettled,
  steadySwingDeg,
  type Sim,
} from '../lib/rotor3d'
import {
  bucketNames,
  bucketSource,
  cadDoc,
  constraintRows,
  designNotes,
  productTree,
  speedPresets,
  type CadNode,
} from '../data/cad'

/** viewBox of the rotor drawing (matches the offline geometry check) */
const VB = { w: 520, h: 420 }
/** rolling transient trace */
const TRACE_LEN = 120
const SAMPLE_DT = 0.08

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
const fmt = (n: number, digits = 1) => n.toFixed(digits)

/** Slider position (0…1000) ↔ rpm. Cubed taper keeps the 0–1000 rpm swing zone draggable. */
const rpmFromPos = (p: number) => Math.round(MAX_RPM * (p / 1000) ** 3)
const posFromRpm = (r: number) => Math.round(1000 * Math.cbrt(clamp(r, 0, MAX_RPM) / MAX_RPM))

export function Centrifuge() {
  /* The simulation lives in a ref (like the hero canvas) and a bump counter
     re-renders the SVG each frame — avoids allocating per-frame state. */
  const simRef = useRef<Sim>(initialSim())
  const [, bump] = useState(0)
  const [rpmTarget, setRpmTarget] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [frozen, setFrozen] = useState(false)
  const [showNames, setShowNames] = useState(true)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [trace, setTrace] = useState<{ n: number; t: number }[]>([])
  const rootRef = useRef<HTMLDivElement>(null)
  const sampleRef = useRef(0)
  const sim = simRef.current

  /* Auto-play once when the section scrolls into view (unless reduced motion). */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = rootRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          obs.disconnect()
          setRpmTarget(3000)
          setSpinning(true)
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  /* RAF loop: restarts whenever a control changes, stops when everything settles. */
  useEffect(() => {
    if (frozen) return
    if (!spinning && simSettled(simRef.current, 0)) return
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = clamp((now - last) / 1000, 0, 0.033)
      last = now
      const s = advanceSim(simRef.current, dt, spinning ? rpmTarget : 0, spinning)
      simRef.current = s
      if (s.t - sampleRef.current >= SAMPLE_DT) {
        sampleRef.current = s.t
        const point = { n: s.rpm, t: mean(s.a) }
        setTrace((prev) => [...prev.slice(-(TRACE_LEN - 1)), point])
      }
      bump((k) => (k + 1) % 1000000)
      if (spinning || !simSettled(s, 0)) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [spinning, rpmTarget, frozen])

  const omega = (sim.rpm / 60) * 2 * Math.PI
  const swing = mean(sim.a)
  const onStop = atSwingStop(sim.rpm)
  const target = steadySwingDeg(sim.rpm)
  const scene = buildScene({ rotorDeg: sim.phi, bucketDeg: sim.a, highlight: 0 })

  const setSpeed = (rpm: number) => {
    setRpmTarget(rpm)
    if (rpm > 0) setSpinning(true)
  }

  const spinUp = () => {
    if (rpmTarget === 0) setRpmTarget(3000)
    setSpinning(true)
  }

  const reset = () => {
    setSpinning(false)
    setRpmTarget(0)
    simRef.current = initialSim()
    sampleRef.current = 0
    setTrace([])
    bump((k) => k + 1)
  }

  const status = !spinning && sim.rpm < 1
    ? 'AT REST · buckets hanging'
    : onStop
      ? 'BUCKETS ON THE 90° STOP · Angle = 90.0 deg'
      : 'SWINGING · centripetal force outruns gravity'

  const readouts: { label: string; value: string; unit?: string; accent?: boolean }[] = [
    { label: 'rotor speed', value: fmt(sim.rpm, 0), unit: 'rpm', accent: true },
    { label: 'angular speed', value: fmt(omega, 1), unit: 'rad/s' },
    { label: 'rotor angle', value: fmt(sim.phi, 1), unit: 'deg' },
    { label: 'centripetal', value: `${fmt(omega * omega * PIVOT_RADIUS_M, 0)}`, unit: 'm/s²' },
    { label: 'RCF at pivot', value: `${fmt(rcf(sim.rpm), 0)}`, unit: '× g' },
    { label: 'swing θ (mean)', value: fmt(swing, 1), unit: 'deg', accent: true },
    { label: 'swing θ (equilibrium)', value: fmt(target, 1), unit: 'deg' },
    { label: 'bucket tip radius', value: fmt(scene.tipRadius, 0), unit: 'model u' },
  ]

  /** rolling trace: both series scaled into the 300×64 strip */
  const tracePoints = (key: 'n' | 't', scale: number) =>
    trace.map((p, i) => `${fmt((i / (TRACE_LEN - 1)) * 300, 1)},${fmt(58 - (p[key] / scale) * 54, 1)}`).join(' ')

  return (
    <Section
      id="centrifuge"
      kicker="06 · CATIA Mechanism"
      title="Centrifuge rotor — from assembly to running mechanism"
      intro="A 4-place swinging-bucket rotor modelled in CATIA V5: the “+”-shaped header spins and every bucket swings out from 0° to 90°. Drive the speed below — the swing follows the real equilibrium tan θ = ω²r / g until the buckets come to rest on their 90° stop."
    >
      <div className="cad-grid" ref={rootRef}>
        <div className="cad-viewer">
          <div className="cad-svg-wrap">
            <svg
              viewBox={`0 0 ${VB.w} ${VB.h}`}
              role="img"
              aria-label={`Centrifuge rotor: header at ${fmt(sim.phi, 0)} degrees, buckets swung to ${fmt(swing, 1)} degrees`}
            >
              {scene.discs.map((d, i) => (
                <ellipse key={`d${i}`} cx={d.cx} cy={d.cy} rx={d.rx} ry={d.ry} fill={d.fill} stroke={d.stroke} strokeWidth={1} />
              ))}
              {scene.rings.map((r, i) => (
                <ellipse
                  key={`r${i}`}
                  cx={r.cx}
                  cy={r.cy}
                  rx={r.rx}
                  ry={r.ry}
                  fill="none"
                  stroke={r.stroke}
                  strokeWidth={1}
                  strokeDasharray={r.dash || undefined}
                />
              ))}
              {scene.faces.map((f, i) => (
                <polygon key={`f${i}`} points={f.pts} fill={f.fill} stroke={f.stroke} strokeWidth={0.6} strokeLinejoin="round" />
              ))}
              {showSkeleton && (
                <g>
                  <line x1={scene.skeleton.axis[0]} y1={scene.skeleton.axis[1]} x2={scene.skeleton.axis[2]} y2={scene.skeleton.axis[3]} className="cad-axis" />
                  <line x1={scene.skeleton.rotorIndex[0]} y1={scene.skeleton.rotorIndex[1]} x2={scene.skeleton.rotorIndex[2]} y2={scene.skeleton.rotorIndex[3]} className="cad-index" />
                  <line x1={scene.skeleton.hinge[0]} y1={scene.skeleton.hinge[1]} x2={scene.skeleton.hinge[2]} y2={scene.skeleton.hinge[3]} className="cad-hinge" />
                  <polyline points={scene.skeleton.swingArc} className="cad-arc" />
                  <circle cx={scene.skeleton.swingOrigin[0]} cy={scene.skeleton.swingOrigin[1]} r={3} className="cad-pivot" />
                  <text x={scene.skeleton.swingMid[0] + 10} y={scene.skeleton.swingMid[1]} className="cad-label cad-label-accent">
                    θ = {fmt(swing, 1)}°
                  </text>
                  <text x={scene.skeleton.hinge[0] - 4} y={scene.skeleton.hinge[1] - 8} className="cad-label cad-label-violet">
                    hinge · Angle DOF
                  </text>
                  <text x={scene.skeleton.axis[0] + 10} y={scene.skeleton.axis[1] + 16} className="cad-label">
                    rotor axis Z
                  </text>
                </g>
              )}
              {showNames &&
                scene.labels.map((l, i) => (
                  <text key={bucketNames[i]} x={l.x} y={l.y + 4} textAnchor="middle" className={`cad-label ${i === 0 ? 'cad-label-accent' : ''}`}>
                    {bucketNames[i]}
                  </text>
                ))}
            </svg>
            <div className="cad-svg-foot">
              <span className={`cad-state ${onStop ? 'on-stop' : spinning ? 'running' : 'rest'}`}>{status}</span>
            </div>
          </div>

          {/* ── controls ──────────────────────────────────────────── */}
          <div className="cad-controls">
            <div className="cad-btn-row">
              <button type="button" className="btn btn-primary" onClick={spinUp} disabled={spinning}>
                ▶ Spin up
              </button>
              <button type="button" className="btn" onClick={() => setSpinning(false)} disabled={!spinning}>
                ▮ Stop rotor
              </button>
              <button type="button" className="btn" onClick={reset}>
                ↺ Reset
              </button>
              <button
                type="button"
                className={`btn ${frozen ? 'btn-primary' : ''}`}
                onClick={() => setFrozen((f) => !f)}
                aria-pressed={frozen}
              >
                {frozen ? '❙❙ Frozen — resume' : '❙❙ Freeze frame'}
              </button>
            </div>

            <label className="cad-slider">
              <span className="cad-slider-head">
                rotor speed <strong>{fmt(sim.rpm, 0)} rpm</strong>
              </span>
              <input
                type="range"
                min={0}
                max={1000}
                step={1}
                value={posFromRpm(rpmTarget)}
                onChange={(e) => setSpeed(rpmFromPos(Number(e.target.value)))}
                aria-label="Rotor speed in rpm"
              />
              <span className="cad-track-legend">
                <span className="cad-zone" aria-hidden="true" />
                SWING ZONE — the buckets travel 0° → 90° here; the slider is cubically tapered so that range stays
                draggable
              </span>
            </label>

            <div className="cad-presets">
              {speedPresets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className={`chip ${rpmTarget === p.rpm ? 'chip-accent' : ''}`}
                  onClick={() => setSpeed(p.rpm)}
                  title={p.hint}
                >
                  {p.label} · {p.rpm} rpm
                </button>
              ))}
            </div>

            <div className="cad-toggles">
              <label>
                <input type="checkbox" checked={showNames} onChange={(e) => setShowNames(e.target.checked)} /> instance
                names
              </label>
              <label>
                <input type="checkbox" checked={showSkeleton} onChange={(e) => setShowSkeleton(e.target.checked)} /> hinge
                / axis overlay
              </label>
            </div>
          </div>

          {/* ── instrument readout + transient trace ─────────────── */}
          <div className="cad-instruments">
            <dl className="cad-readouts">
              {readouts.map((r) => (
                <div key={r.label} className={r.accent ? 'accent' : ''}>
                  <dt>{r.label}</dt>
                  <dd>
                    {r.value}
                    {r.unit && <span> {r.unit}</span>}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="cad-trace">
              <svg viewBox="0 0 300 64" role="img" aria-label="Rolling trace of rotor speed and bucket swing angle">
                {[0, 1, 2, 3].map((i) => (
                  <line key={i} x1={0} y1={4 + i * 18} x2={300} y2={4 + i * 18} className="cad-grid-line" />
                ))}
                <polyline points={tracePoints('n', MAX_RPM)} className="cad-trace-rpm" />
                <polyline points={tracePoints('t', SWING_STOP_DEG)} className="cad-trace-ang" />
              </svg>
              <div className="cad-trace-legend">
                <span className="cad-legend-ang">θ swing</span>
                <span className="cad-legend-rpm">N speed</span>
                <span className="cad-legend-note">rolling · swing-out transient</span>
              </div>
            </div>
          </div>
        </div>

        <CadDossier />
      </div>

      <ul className="cad-notes">
        {designNotes.map((n) => (
          <li key={n}>{n}</li>
        ))}
        <li>
          The drawing is a schematic of the assembly structure read from the file (instance names, constraints, symmetry
          features) — not a dimensional replica of the .CATPart solids, which are not stored inside a product file.
        </li>
      </ul>
    </Section>
  )
}

/* ── static dossier on the CATProduct (memoised: the SVG re-renders per frame) ── */

function TreeNode({ node, depth }: { node: CadNode; depth: number }) {
  return (
    <li className="cad-node">
      <span className="cad-node-row" style={{ paddingLeft: `${depth * 14}px` }}>
        <span className="cad-node-name">{depth > 0 ? '└ ' : '▣ '}{node.name}</span>
        <span className="cad-node-role">{node.role}</span>
      </span>
      {node.children && (
        <ul>
          {node.children.map((c) => (
            <TreeNode key={c.name} node={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

const CadDossier = memo(function CadDossier() {
  return (
    <aside className="cad-dossier" aria-label="CATIA document dossier">
      <div className="cad-card">
        <h3>Document</h3>
        <dl className="cad-kv">
          <div>
            <dt>application</dt>
            <dd>{cadDoc.app}</dd>
          </div>
          <div>
            <dt>release</dt>
            <dd>{cadDoc.release}</dd>
          </div>
          <div>
            <dt>build date</dt>
            <dd>{cadDoc.build}</dd>
          </div>
          <div>
            <dt>format</dt>
            <dd>{cadDoc.format}</dd>
          </div>
          <div>
            <dt>min. reader</dt>
            <dd>{cadDoc.minRead}</dd>
          </div>
          <div>
            <dt>file</dt>
            <dd>
              {cadDoc.file} · {cadDoc.size}
            </dd>
          </div>
        </dl>
      </div>

      <div className="cad-card">
        <h3>
          Product tree <span className="cad-card-note">as streamed in the file</span>
        </h3>
        <ul className="cad-tree">
          {productTree.map((n) => (
            <TreeNode key={n.name} node={n} depth={0} />
          ))}
        </ul>
      </div>

      <div className="cad-card">
        <h3>
          Constraints <span className="cad-card-note">5 in the assembly</span>
        </h3>
        <ul className="cad-cst">
          {constraintRows.map((c) => (
            <li key={c.name} className={c.driven ? 'driven' : ''}>
              <span className="cad-cst-name">{c.name}</span>
              <span className="cad-cst-type">{c.type}</span>
              <span className="cad-cst-role">{c.role}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="cad-card">
        <h3>
          Bucket instances <span className="cad-card-note">4 arm positions</span>
        </h3>
        <ul className="cad-buckets">
          {bucketSource.map((b) => (
            <li key={b.name}>
              <span className="cad-bk-name">{b.name}</span>
              <span className="cad-bk-src">{b.source}</span>
            </li>
          ))}
        </ul>
        <p className="cad-card-foot">
          Two modelled buckets plus two assembly-symmetry mirrors give the four arms of the “+”. Arm order in the
          drawing is indicative; the real placement comes from the symmetry features in CATIA.
        </p>
      </div>

      <div className="cad-card">
        <h3>
          CATIA preview <span className="cad-card-note">two views from the session</span>
        </h3>
        <div className="cad-previews">
          {cadDoc.previews.map((p) => (
            <figure key={p.src} className="cad-preview-fig">
              <img className="cad-preview" src={p.src} alt={p.alt} loading="lazy" />
              <figcaption>{p.caption}</figcaption>
            </figure>
          ))}
        </div>
        <p className="cad-card-foot">
          Two CATIA V5 screenshots of {cadDoc.file}: the “+” header with the four buckets hanging in the loading
          position and swung out to the 90° stop at running speed.
        </p>
      </div>
    </aside>
  )
})


