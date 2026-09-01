import { useState } from 'react'
import { skillGroups } from '../data/domains'
import { Section } from './ui'

function SkillBox({ title, visible, extra }: { title: string; visible: string[]; extra: string[] }) {
  const [showAll, setShowAll] = useState(false)
  return (
    <div className="skill-box">
      <h3>
        {title}
        {extra.length > 0 && (
          <button type="button" className="skill-toggle" aria-expanded={showAll} onClick={() => setShowAll((s) => !s)}>
            {showAll ? '[ − less ]' : `[ +${extra.length} more ]`}
          </button>
        )}
      </h3>
      <div className="skill-cloud">
        {visible.map((s) => (
          <span className="chip" key={s}>
            {s}
          </span>
        ))}
        {showAll &&
          extra.map((s) => (
            <span className="chip chip-accent extra-anim" key={s}>
              {s}
            </span>
          ))}
      </div>
    </div>
  )
}

export function Skills() {
  return (
    <Section
      id="skills"
      kicker="06 · Toolkit"
      title="Technical Skills"
      intro="Categorized technology matrix — click a category to reveal additional tools."
    >
      <div className="skill-grid">
        {skillGroups.map((g) => (
          <SkillBox key={g.title} {...g} />
        ))}
      </div>
    </Section>
  )
}

import { certifications } from '../data/domains'

export function Certifications() {
  return (
    <Section
      id="certifications"
      kicker="07 · Credentials"
      title="Certifications & Training"
    >
      <div className="cert-wall">
        {certifications.map((c) => (
          <div className="cert-item" key={c.name}>
            <div className="cert-name">{c.name}</div>
            <div className="cert-issuer">{c.issuer}</div>
            {c.date && <div className="cert-date">{c.date}</div>}
          </div>
        ))}
      </div>
    </Section>
  )
}
