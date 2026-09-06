import { profile } from '../data/content'
import { Section, Icons } from './ui'

export function Contact() {
  return (
    <Section id="contact" kicker="10 · Contact" title="Let's build something measurable">
      <div className="contact-box">
        <h2>{profile.name}</h2>
        <p style={{ color: 'var(--text-dim)' }}>
          Research & Development | IoT | Scientific Computing | Machine Learning
        </p>
        <div className="contact-lines">
          <a href={`mailto:${profile.email}`}>
            <Icons.mail /> {profile.email}
          </a>
          <span>{profile.location}</span>
          <span style={{ display: 'flex', gap: 18 }}>
            {profile.languages.map((l) => (
              <span key={l.name}>
                <strong style={{ color: 'var(--text)' }}>{l.name}</strong> · {l.level}
              </span>
            ))}
          </span>
        </div>
        <div className="contact-cta">
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>
            <Icons.mail /> Email Me
          </a>
          <a className="btn" href={profile.cvPath} download>
            <Icons.download /> Download Full CV
          </a>
          <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
            <Icons.github /> GitHub
          </a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
            <Icons.linkedin /> LinkedIn
          </a>
        </div>
      </div>
    </Section>
  )
}

export function Footer() {
  return (
    <footer>
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">PARISA DEHGHAN</div>
          <div className="footer-tag">Research • Engineering • Computation</div>
        </div>
        <div className="footer-links">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`}>Email</a>
        </div>
        <div className="footer-tag">© 2026 Parisa Dehghan</div>
      </div>
    </footer>
  )
}
