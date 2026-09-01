const links = [
  { href: '#about', label: 'About' },
  { href: '#research', label: 'Research' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#landscape', label: 'Landscape' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-inner">
        <a href="#top" className="nav-brand">
          PARISA<span>·</span>DEGHAN<span style={{ color: 'var(--text-faint)' }}> // R&D</span>
        </a>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
