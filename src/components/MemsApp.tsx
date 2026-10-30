import { useEffect, useRef, useState } from 'react'
import { memsApp } from '../data/mems'
import { Section } from './ui'

const SQRT2 = Math.SQRT2
const WAFER = 350 // µm
const RATE = 1 // µm/min on (100)
const T_MAX = 400 // min

/** Live KOH V-groove: ideal {111} walls at 54.74°, whose tangent is √2. */
function KohDemo() {
  const [time, setTime] = useState(0)
  const [opening, setOpening] = useState(420)
  const [playing, setPlaying] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTime(190)
      return
    }
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true
          setPlaying(true)
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = now - last
      last = now
      setTime((t) => {
        const next = t + dt * 0.03
        if (next >= T_MAX) {
          setPlaying(false)
          return T_MAX
        }
        return next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  const stopAt = opening / SQRT2 // walls meet here
  const depth = Math.min(RATE * time, stopAt, WAFER)
  const floor = Math.max(opening - SQRT2 * depth, 0)
  const through = depth >= WAFER
  const limited = !through && RATE * time >= stopAt

  // drawing scale
  const S = 0.62
  const cx = 320
  const top = 46
  const bottom = top + WAFER * S
  const a = (opening / 2) * S
  const b = (floor / 2) * S
  const yd = top + depth * S
  const pit = `${cx - a},${top} ${cx + a},${top} ${cx + b},${yd} ${cx - b},${yd}`

  const status = through
    ? { text: 'Through the wafer: the etch front has reached the back film.', tone: 'rose' }
    : limited
      ? { text: 'Self-limited: the {111} walls have met in a V, and etching stops.', tone: 'gold' }
      : { text: 'Etching: the (100) floor sinks while the {111} walls hold their angle.', tone: 'teal' }

  return (
    <div className="koh-demo mems-card" ref={root}>
      <div className="koh-head">
        <div>
          <h3>Try the physics</h3>
          <p>Why a KOH pit stops by itself. Drag the sliders; the full simulator solves this for any mask shape.</p>
        </div>
        <button type="button" className="btn koh-play" onClick={() => {
          if (!playing && time >= T_MAX) setTime(0)
          setPlaying((p) => !p)
        }}>
          {playing ? 'Pause' : time >= T_MAX ? 'Replay' : 'Play'}
        </button>
      </div>

      <svg className="koh-svg" viewBox="0 0 640 290" role="img" aria-label={`Silicon wafer cross-section with a ${opening} micrometre mask opening, etched ${depth.toFixed(0)} micrometres deep. ${status.text}`}>
        <defs>
          <linearGradient id="koh-si" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a3a52" />
            <stop offset="1" stopColor="#23233a" />
          </linearGradient>
          <linearGradient id="koh-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2de2be" />
            <stop offset="0.5" stopColor="#9b7cff" />
            <stop offset="1" stopColor="#ff5fa2" />
          </linearGradient>
        </defs>
        <rect x="0" y={top} width="640" height={bottom - top} fill="url(#koh-si)" />
        <polygon points={pit} fill="#0a0a13" />
        <path d={`M${cx - a} ${top} L${cx - b} ${yd} L${cx + b} ${yd} L${cx + a} ${top}`} fill="none" stroke="url(#koh-wall)" strokeWidth="2.4" strokeLinejoin="round" />
        {/* Si3N4 mask on top, film on the back */}
        <rect x="0" y={top - 7} width={cx - a} height="7" fill="#2de2be" />
        <rect x={cx + a} y={top - 7} width={640 - cx - a} height="7" fill="#2de2be" />
        <rect x="0" y={bottom} width="640" height="7" fill="#2de2be" opacity="0.75" />

        <text x="14" y={bottom - 10} className="koh-label">⟨100⟩ silicon, {WAFER} µm</text>
        <text x="14" y={top - 14} className="koh-label koh-label-accent">Si₃N₄ mask</text>
        <text x={cx} y={top - 14} textAnchor="middle" className="koh-label">{opening} µm opening</text>
        {depth > 24 && (
          <>
            <text x={cx - a - 8} y={top + 22} textAnchor="end" className="koh-label koh-label-accent">54.74°</text>
            <line x1={cx} y1={top} x2={cx} y2={yd} stroke="#ffc857" strokeWidth="1.2" strokeDasharray="3 4" />
            <text x={cx + 8} y={top + (yd - top) / 2 + 4} className="koh-label koh-label-gold">{depth.toFixed(0)} µm</text>
          </>
        )}
      </svg>

      <div className="koh-controls">
        <label>
          <span>Etch time <strong>{Math.round(time)} min</strong></span>
          <input type="range" min={0} max={T_MAX} step={1} value={time} onChange={(e) => { setPlaying(false); setTime(+e.target.value) }} />
        </label>
        <label>
          <span>Mask opening <strong>{opening} µm</strong></span>
          <input type="range" min={100} max={700} step={10} value={opening} onChange={(e) => setOpening(+e.target.value)} />
        </label>
      </div>

      <dl className="koh-readout">
        <div><dt>Depth</dt><dd>{depth.toFixed(0)} µm</dd></div>
        <div><dt>Floor width</dt><dd>{floor.toFixed(0)} µm</dd></div>
        <div><dt>V-groove stop</dt><dd>{stopAt > WAFER ? '> wafer' : `${stopAt.toFixed(0)} µm`}</dd></div>
      </dl>
      <p className={`koh-status koh-${status.tone}`} aria-live="polite">{status.text}</p>
      <p className="koh-note">Idealised: {RATE} µm/min on (100), no {'{111}'} undercut. Depth at the stop = opening / √2.</p>
    </div>
  )
}

export function MemsApp() {
  return (
    <Section
      id="mems"
      kicker="02 · Featured Build"
      title={<>A wafer fab that runs in the <em>browser</em></>}
      intro={memsApp.intro}
    >
      <div className="mems-features">
        {memsApp.features.map((f, i) => (
          <article className="mems-card mems-feature" key={f.title}>
            <span className="mems-feature-index" aria-hidden="true">0{i + 1}</span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </article>
        ))}
      </div>

      <ol className="mems-steps" aria-label="Process steps the simulator supports">
        {memsApp.steps.map((s) => (
          <li key={s.name}>
            <strong>{s.name}</strong>
            <span>{s.text}</span>
          </li>
        ))}
      </ol>

      <div className="mems-lower">
        <KohDemo />
        <div className="mems-side">
          <article className="mems-card mems-results">
            <h3>Checked against a real chip</h3>
            <p>The built-in AFM sensor example, run at both quality settings:</p>
            <table>
              <thead>
                <tr><th scope="col">Result</th><th scope="col">Standard</th><th scope="col">Fine</th><th scope="col">Reference</th></tr>
              </thead>
              <tbody>
                {memsApp.results.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    <td className="val">{r.standard}</td>
                    <td className="val">{r.fine}</td>
                    <td>{r.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mems-small">{memsApp.calibration}</p>
          </article>
          <article className="mems-card mems-model">
            <h3>How the model works</h3>
            <p>{memsApp.model}</p>
            <p className="mems-small">{memsApp.limits}</p>
            <div className="mems-stack">
              {memsApp.stack.map((t) => <span className="chip" key={t}>{t}</span>)}
            </div>
          </article>
        </div>
      </div>
    </Section>
  )
}
