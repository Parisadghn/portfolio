import { useEffect, useState } from 'react'
import { heroPanel, heroStats, heroVerbs, profile } from '../data/content'
import { projects } from '../data/projects'
import { Icons } from './ui'
import { WaferCanvas } from './WaferCanvas'

function RotatingVerb() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setI((v) => (v + 1) % heroVerbs.length), 2800)
    return () => window.clearInterval(id)
  }, [])
  return (
    <p className="hero-verb" aria-hidden="true">
      I <em className="iri" key={heroVerbs[i]}>{heroVerbs[i]}</em>
    </p>
  )
}

function Marquee() {
  const items = heroPanel.flatMap((row) => row.items)
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((it, i) => (
          <span key={`${it}-${i}`}>{it}</span>
        ))}
      </div>
    </div>
  )
}

export function Hero() {
  const stats = [...heroStats, { value: `${projects.length}`, label: 'research & engineering projects' }]
  return (
    <>
      <header className="hero" id="top">
        <WaferCanvas />
        <div className="hero-veil" />
        <div className="container hero-inner">
          <div className="hero-eyebrow">{profile.roles}</div>
          <h1>
            <span>Parisa</span>
            <span className="iri">Dehghan</span>
          </h1>
          <RotatingVerb />
          <p className="hero-tagline">{profile.tagline}</p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#projects">
              View projects
            </a>
            <a className="btn" href={profile.cvPath} download>
              <Icons.download /> Download CV
            </a>
            <a className="btn btn-icon" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Icons.github />
            </a>
            <a className="btn btn-icon" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Icons.linkedin />
            </a>
          </div>
          <ul className="hero-stats" aria-label="Highlights">
            {stats.map((s) => (
              <li key={s.label}>
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <Marquee />
      </header>
    </>
  )
}
