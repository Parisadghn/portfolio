import type { ReactNode } from 'react'
import { useReveal } from '../hooks/hooks'

export function Section({ id, kicker, title, intro, children }: {
  id: string
  kicker: string
  title: string
  intro?: string
  children: ReactNode
}) {
  const ref = useReveal<HTMLElement>()
  return (
    <section id={id} ref={ref} className="reveal" aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className="section-head">
          <div className="section-kicker">{kicker}</div>
          <h2 id={`${id}-title`}>{title}</h2>
          {intro && <p>{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

/* Small inline icon set (stroke style, Lucide-like) */
const ico = (paths: ReactNode, vb = '0 0 24 24') => (
  <svg width="22" height="22" viewBox={vb} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {paths}
  </svg>
)

export const Icons = {
  chip: () => ico(<><rect x="7" y="7" width="10" height="10" rx="1" /><path d="M4 9h3M4 15h3M17 9h3M17 15h3M9 4v3M15 4v3M9 17v3M15 17v3" /></>),
  atom: () => ico(<><circle cx="12" cy="12" r="1.5" fill="currentColor" /><ellipse cx="12" cy="12" rx="10" ry="4.2" /><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" /></>),
  sensor: () => ico(<><path d="M12 12v7" /><path d="M8.5 8.5a5 5 0 0 1 7 0" /><path d="M6 6a8.5 8.5 0 0 1 12 0" /><circle cx="12" cy="12" r="1.6" /></>),
  network: () => ico(<><circle cx="5" cy="12" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="19" cy="19" r="2" /><path d="M7 11l10-5M7 13l10 5" /></>),
  code: () => ico(<><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" /></>),
  flask: () => ico(<><path d="M10 3v6l-5.5 9a1.8 1.8 0 0 0 1.6 2.8h11.8a1.8 1.8 0 0 0 1.6-2.8L14 9V3" /><path d="M8.5 3h7" /><path d="M7 15h10" /></>),
  download: () => ico(<><path d="M12 3v12M7 10l5 5 5-5" /><path d="M4 19h16" /></>),
  github: () => ico(<><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></>),
  linkedin: () => ico(<><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 11v5M8 8v.01M12 16v-3a2 2 0 0 1 4 0v3" /></>),
  mail: () => ico(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
  grad: () => ico(<><path d="M12 4L2 9l10 5 10-5-10-5z" /><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" /></>),
}
