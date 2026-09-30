import { useEffect, useRef, useState } from 'react'
import { experience } from '../data/content'
import type { GalleryImage } from '../data/content'
import { lotusExperience } from '../data/experience'
import type { LotusProject } from '../data/experience'
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

function ProcessStepper({ steps }: { steps: string[] }) {
  return (
    <ol className="lotus-steps" aria-label="Fabrication flow">
      {steps.map((s, i) => (
        <li key={s}>
          <span className="lotus-step-index" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="lotus-step-label">{s}</span>
          {i < steps.length - 1 && <span className="lotus-step-rail" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  )
}

function Mosaic({ images, onOpen }: { images: GalleryImage[]; onOpen: (index: number) => void }) {
  return (
    <div className="lotus-mosaic" role="group" aria-label="Project photographs — activate to enlarge">
      {images.map((img, i) => (
        <button
          key={img.src}
          type="button"
          className={`lotus-tile tile-${i % 6}`}
          onClick={() => onOpen(i)}
          aria-label={`Enlarge photo ${i + 1} of ${images.length}: ${img.alt}`}
        >
          <img src={img.src} alt={img.alt} loading="lazy" />
          <span className="lotus-tile-veil" aria-hidden="true">
            {img.caption && <span className="lotus-tile-cap">{img.caption}</span>}
            <span className="lotus-tile-zoom">⤢</span>
          </span>
        </button>
      ))}
    </div>
  )
}

function Lightbox({ images, index, onClose, onStep }: { images: GalleryImage[]; index: number; onClose: () => void; onStep: (delta: number) => void }) {
  const img = images[index]
  const closeRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, onStep, closeRef])
  if (!img) return null
  return (
    <div className="lotus-lightbox" role="dialog" aria-modal="true" aria-label={img.alt} onClick={onClose}>
      <div className="lotus-lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <img src={img.src} alt={img.alt} />
        <div className="lotus-lightbox-bar">
          <p>{img.caption ?? img.alt}</p>
          <span className="lotus-lightbox-count">
            {index + 1} / {images.length}
          </span>
        </div>
        <button type="button" ref={(el) => { closeRef.current = el }} className="lotus-lb-btn lotus-lb-close" onClick={onClose} aria-label="Close viewer">
          ✕
        </button>
        <button type="button" className="lotus-lb-btn lotus-lb-prev" onClick={() => onStep(-1)} aria-label="Previous photo">
          ←
        </button>
        <button type="button" className="lotus-lb-btn lotus-lb-next" onClick={() => onStep(1)} aria-label="Next photo">
          →
        </button>
      </div>
    </div>
  )
}

function ShowcaseCard({ project, align }: { project: LotusProject; align: 'left' | 'right' }) {
  const highlights = project.points.slice(0, 4)
  const more = project.points.slice(4)
  const [expanded, setExpanded] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const gallery = project.gallery ?? []
  const bodyId = `lotus-${project.title.replace(/\W+/g, '-').toLowerCase()}`
  return (
    <article className={`lotus-showcase align-${align}`}>
      <div className="lotus-copy">
        <p className="lotus-eyebrow">{project.eyebrow}</p>
        <h3>{project.title}</h3>
        <p className="lotus-lede">{project.lede}</p>
        <dl className="lotus-stats">
          {project.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
        <ul className="lotus-points">
          {(expanded ? project.points : highlights).map((p) => (
            <li key={p}>
              <span className="lotus-tick" aria-hidden="true">
                ✓
              </span>
              {p}
            </li>
          ))}
        </ul>
        {more.length > 0 && (
          <button
            type="button"
            className="lotus-toggle"
            aria-expanded={expanded}
            aria-controls={bodyId}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'Show fewer details' : `Show all ${project.points.length} process notes`}
            <span aria-hidden="true">{expanded ? ' ↑' : ' ↓'}</span>
          </button>
        )}
        <div id={bodyId} hidden={!expanded && more.length > 0} />
        {project.flow && <ProcessStepper steps={project.flow} />}
      </div>
      <div className="lotus-media">
        {gallery.length > 0 && (
          <Mosaic
            images={gallery}
            onOpen={(i) => setLightbox(i)}
          />
        )}
        {lightbox !== null && gallery[lightbox] && (
          <Lightbox
            images={gallery}
            index={lightbox}
            onClose={() => setLightbox(null)}
            onStep={(d) => setLightbox((v) => (v === null ? v : (v + d + gallery.length) % gallery.length))}
          />
        )}
      </div>
    </article>
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

        {/* Lotus IMNS — most substantial role, rendered as full case studies (no click-to-reveal) */}
        <div className="tl-item">
          <div className="tl-head">
            <h3>{lotusExperience.role}</h3>
            <div className="tl-org">{lotusExperience.org}</div>
            <div className="tl-period">{lotusExperience.period}</div>
          </div>
          <p className="tl-summary">{lotusExperience.summary}</p>
          <div className="lotus-stack">
            {lotusExperience.projects.map((p: LotusProject, i: number) => (
              <ShowcaseCard key={p.title} project={p} align={i % 2 === 0 ? 'left' : 'right'} />
            ))}
          </div>
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
