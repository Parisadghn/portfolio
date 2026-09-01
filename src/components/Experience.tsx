import { useState } from 'react'
import { experience } from '../data/content'
import { lotusExperience } from '../data/experience'
import { Section, Icons } from './ui'

function Flow({ steps }: { steps: string[] }) {
  return (
    <div className="flow" aria-label="Process flow">
      {steps.map((s, i) => (
        <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <span className="flow-arrow" aria-hidden="true">→</span>}
          <span className="flow-step">{s}</span>
        </span>
      ))}
    </div>
  )
}

function Expandable({ title, points, flow }: { title: string; points: string[]; flow?: string[] }) {
  const [open, setOpen] = useState(false)
  const bodyId = `xp-${title.replace(/\W+/g, '-').toLowerCase()}`
  return (
    <div className="xp-card">
      <button
        type="button"
        className="xp-card-btn"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <span className={`xp-caret ${open ? 'open' : ''}`} aria-hidden="true">
          ▸
        </span>
      </button>
      <div className={`xp-body ${open ? 'open' : ''}`} id={bodyId}>
        <ul>
          {points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        {flow && <Flow steps={flow} />}
      </div>
    </div>
  )
}

const IoT_NODES = [
  { label: 'Smart Wristband', kind: 'device' },
  { label: 'GPS · Blood Pressure · SpO₂ · Fall Detection', kind: 'sensors' },
  { label: 'LoRa / MQTT', kind: 'link layer' },
  { label: 'Node.js Backend', kind: 'service' },
  { label: 'Data Validation & Timestamping', kind: 'pipeline' },
  { label: 'SQL Database', kind: 'persistence' },
  { label: 'Web Monitoring Interface', kind: 'UI' },
]

function IoTArchitecture() {
  return (
    <div className="iot-arch" role="img" aria-label="IoT data-flow architecture from smart wristband to web monitoring interface">
      <div className="iot-flow">
        {IoT_NODES.map((n, i) => (
          <div key={n.label} style={{ display: 'contents' }}>
            <div className="iot-node">
              <span>{n.label}</span>
              <span className="node-kind">{n.kind}</span>
            </div>
            {i < IoT_NODES.length - 1 && <div className="iot-link" aria-hidden="true" />}
          </div>
        ))}
      </div>
      <img
        src="images/iot-architecture.png"
        alt="System architecture diagram of the smart health-monitoring IoT platform"
        loading="lazy"
        className="section-img"
        style={{ marginTop: 18 }}
        onError={(e) => {
          ;(e.currentTarget as HTMLImageElement).style.display = 'none'
        }}
      />
    </div>
  )
}

export function Experience() {
  return (
    <Section
      id="experience"
      kicker="03 · Professional Experience"
      title="Where I've built things"
    >
      <div className="timeline">
        {experience.map((item) => (
          <div className={`tl-item ${item.kind === 'teaching' ? 'teaching' : ''}`} key={item.role}>
            <div className="tl-head">
              <h3>{item.role}</h3>
              <div className="tl-org">{item.org}</div>
              <div className="tl-period">{item.period}</div>
            </div>
            <p className="tl-summary">{item.summary}</p>

            {item.kind === 'engineering' && item.org.includes('IoT') && (
              <IoTArchitecture />
            )}

            {item.projects.map((p) => (
              <Expandable key={p.title} title={p.title} points={p.points} flow={p.flow} />
            ))}

            {item.kind === 'teaching' && (
              <div className="xp-card" style={{ borderStyle: 'dashed' }}>
                <div className="xp-body open" style={{ paddingTop: 14 }}>
                  <ul>
                    <li>
                      6-week “Intro to IoT” online course for students aged 8–12 — introducing
                      sensors, connectivity, and simple automations in an accessible, hands-on format.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="tl-tags">
              {item.tags.map((t) => (
                <span className="chip" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Lotus IMNS — most substantial role, rendered last in timeline order (most recent first above) */}
        <div className="tl-item">
          <div className="tl-head">
            <h3>{lotusExperience.role}</h3>
            <div className="tl-org">{lotusExperience.org}</div>
            <div className="tl-period">{lotusExperience.period}</div>
          </div>
          <p className="tl-summary">{lotusExperience.summary}</p>
          {lotusExperience.projects.map((p) => (
            <Expandable key={p.title} title={p.title} points={p.points} flow={p.flow} />
          ))}
          <div className="tl-tags">
            {lotusExperience.tags.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8, color: 'var(--text-faint)' }}>
        <Icons.grad />
        <span className="place-note">
          Teaching & engineering roles shown together — dashed/violet marker marks the teaching role.
        </span>
      </div>
    </Section>
  )
}
