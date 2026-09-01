import { researchDomains } from '../data/domains'
import { Section, Icons, Reveal } from './ui'

const iconFor: Record<string, () => JSX.Element> = {
  fabrication: Icons.chip,
  sensors: Icons.sensor,
  iot: Icons.network,
  ml: Icons.network,
  'sci-comp': Icons.flask,
  physics: Icons.atom,
}

export function ResearchAreas() {
  return (
    <Section
      id="research"
      kicker="02 · Domains"
      title="Research & Engineering"
      intro="Six interconnected domains — spanning the cleanroom, the terminal, and the simulation cluster."
    >
      <div className="domain-grid">
        {researchDomains.map((d, i) => {
          const Icon = iconFor[d.id] ?? Icons.chip
          return (
            <Reveal key={d.id}>
              <article className="domain-card" style={{ transitionDelay: `${(i % 3) * 60}ms` }}>
                <div className="domain-icon">
                  <Icon />
                </div>
                <h3>{d.title}</h3>
                <ul aria-label={`${d.title} topics`}>
                  {d.items.map((it) => (
                    <li className="chip" key={it}>
                      {it}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
