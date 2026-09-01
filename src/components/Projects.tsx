import { useMemo, useState } from 'react'
import { projects, projectCategories, type Project } from '../data/projects'
import { Section } from './ui'
import { Viz } from './Viz'

function LinkOrPlaceholder({ project }: { project: Project }) {
  if (!project.link) return null
  const isPlaceholder = project.link.startsWith('[')
  return isPlaceholder ? (
    <span className="chip">{project.linkLabel ?? 'Link'}: {project.link}</span>
  ) : (
    <a className="chip chip-accent" href={project.link} target="_blank" rel="noreferrer">
      {project.linkLabel ?? 'Link'} ↗
    </a>
  )
}

export function Projects() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>('All')

  const { flagship, compact } = useMemo(() => {
    const f = projects.filter((p) => filter === 'All' || p.categories.includes(filter as Project['categories'][number]))
    return { flagship: f.filter((p) => p.flagship), compact: f.filter((p) => !p.flagship) }
  }, [filter])

  return (
    <Section
      id="projects"
      kicker="05 · Project Explorer"
      title="Research & Projects"
      intro="Computational, experimental, and applied work. Flagship projects are shown in detail; the full database follows below."
    >
      <div className="filter-bar" role="tablist" aria-label="Filter projects by category">
        {projectCategories.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={filter === c}
            className={`filter-btn ${filter === c ? 'active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flag-grid">
        {flagship.map((p) => (
          <article className="flag-card" key={p.title}>
            {p.viz && (
              <div className="flag-viz">
                <Viz kind={p.viz} />
              </div>
            )}
            <div className="flag-body">
              <h3>{p.title}</h3>
              <p className="flag-desc">{p.description}</p>
              {p.detail && (
                <ul className="flag-detail">
                  {p.detail.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
              <div className="flag-tech">
                {p.tech.map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
                <LinkOrPlaceholder project={p} />
              </div>
            </div>
          </article>
        ))}
      </div>

      {compact.length > 0 && (
        <div className="compact-grid">
          {compact.map((p) => (
            <article className="compact-card" key={p.title}>
              <h4>{p.title}</h4>
              <p>{p.description}</p>
              <div className="compact-cats">
                {p.categories.map((c) => (
                  <span className="mini-chip" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  )
}
