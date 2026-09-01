import { education } from '../data/experience'
import { Section } from './ui'

export function Education() {
  return (
    <Section
      id="education"
      kicker="04 · Education"
      title="Academic foundation"
      intro="Theoretical physics training with a consistently computational focus."
    >
      <div className="edu-grid">
        {education.map((e) => (
          <article className={`edu-card ${e.highlight ? 'highlight' : ''}`} key={e.field}>
            <div className="edu-degree">{e.degree}</div>
            <h3>{e.field}</h3>
            <div className="edu-school">{e.school}</div>
            <div className="edu-meta">
              <span>{e.period}</span>
              <span className="edu-gpa">GPA {e.gpa}</span>
            </div>
            {e.courses.length > 0 && (
              <div className="edu-courses">
                {e.courses.map((c) => (
                  <div className="edu-course" key={c.name}>
                    <span>{c.name}</span>
                    <span className="grade">{c.grade}</span>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </Section>
  )
}
