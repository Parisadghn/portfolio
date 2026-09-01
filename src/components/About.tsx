import { aboutNarrative } from '../data/domains'
import { Section, Reveal } from './ui'

const evolution = [
  { label: 'Physics', sub: 'QFT · statistical mechanics' },
  { label: 'Computational Science', sub: 'Monte Carlo · HPC · C++' },
  { label: 'Machine Learning', sub: 'deep learning · TinyML · TDA' },
  { label: 'IoT', sub: 'MQTT · LoRa · edge devices' },
  { label: 'Micro/Nano Engineering', sub: 'lithography · MEMS · AFM' },
  { label: 'Intelligent Sensors', sub: 'where hardware meets AI' },
]

export function About() {
  return (
    <Section
      id="about"
      kicker="01 · Research Identity"
      title="From fundamental physics to intelligent sensing systems"
    >
      <div className="about-grid">
        <div className="about-text">
          {aboutNarrative.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <Reveal>
          <div className="evolution" role="list" aria-label="Interdisciplinary evolution">
            {evolution.map((e, i) => (
              <div role="listitem" key={e.label}>
                <div className="evo-node">
                  <span className="evo-dot" style={i === evolution.length - 1 ? { background: 'var(--accent)' } : undefined} />
                  <span className="evo-label">{e.label}</span>
                  <span className="evo-sub">{e.sub}</span>
                </div>
                {i < evolution.length - 1 && <div className="evo-line" />}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
