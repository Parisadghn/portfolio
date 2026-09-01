import { useEffect, useRef } from 'react'
import { heroPanel, profile } from '../data/content'
import { Icons } from './ui'

const NODES = [
  { x: 0.1, y: 0.28, label: 'SENSOR' },
  { x: 0.32, y: 0.62, label: 'DATA' },
  { x: 0.54, y: 0.3, label: 'COMPUTE' },
  { x: 0.76, y: 0.62, label: 'ML' },
  { x: 0.93, y: 0.32, label: 'SYSTEM' },
]

interface Particle {
  seg: number
  t: number
  speed: number
}

/** Hero canvas: data particles flowing Sensor → Data → Computation → ML → Intelligent System. */
function useHeroCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const particles: Particle[] = Array.from({ length: 34 }, () => ({
      seg: Math.floor(Math.random() * (NODES.length - 1)),
      t: Math.random(),
      speed: 0.0025 + Math.random() * 0.004,
    }))

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const pos = (i: number) => ({ x: NODES[i].x * w, y: NODES[i].y * h })

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // connections
      ctx.strokeStyle = 'rgba(64, 208, 232, 0.10)'
      ctx.lineWidth = 1
      for (let i = 0; i < NODES.length - 1; i++) {
        const a = pos(i)
        const b = pos(i + 1)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.bezierCurveTo(a.x + 80, a.y, b.x - 80, b.y, b.x, b.y)
        ctx.stroke()
      }

      // nodes
      for (let i = 0; i < NODES.length; i++) {
        const p = pos(i)
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 26)
        g.addColorStop(0, 'rgba(64, 208, 232, 0.25)')
        g.addColorStop(1, 'rgba(64, 208, 232, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, 26, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(64, 208, 232, 0.9)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(92, 113, 134, 0.85)'
        ctx.font = '10px Consolas, monospace'
        ctx.fillText(NODES[i].label, p.x + 10, p.y - 10)
      }

      // flowing particles
      for (const pt of particles) {
        const a = pos(pt.seg)
        const b = pos(pt.seg + 1)
        const t = pt.t
        // point on bezier (same control points as stroke)
        const c1x = a.x + 80
        const c1y = a.y
        const c2x = b.x - 80
        const c2y = b.y
        const mt = 1 - t
        const x = mt * mt * mt * a.x + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t * t * t * b.x
        const y = mt * mt * mt * a.y + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * b.y
        ctx.fillStyle = 'rgba(64, 208, 232, 0.75)'
        ctx.beginPath()
        ctx.arc(x, y, 1.6, 0, Math.PI * 2)
        ctx.fill()
        pt.t += pt.speed
        if (pt.t > 1) {
          pt.t = 0
          pt.seg = (pt.seg + 1) % (NODES.length - 1)
        }
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [canvasRef])
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useHeroCanvas(canvasRef)

  const stop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (profile.cvPath.includes('[')) e.preventDefault()
  }

  return (
    <header className="hero" id="top">
      <canvas id="hero-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="container hero-grid">
        <div>
          <div className="hero-eyebrow">Research & Development Portfolio</div>
          <h1>
            Parisa <span className="accent">Dehghan</span>
          </h1>
          <div className="hero-roles">{profile.roles}</div>
          <p className="hero-tagline">{profile.tagline}</p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#projects">
              View Research & Projects
            </a>
            <a className="btn" href={profile.cvPath} download onClick={stop}>
              <Icons.download /> Download CV
            </a>
            <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
              <Icons.github /> GitHub
            </a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
              <Icons.linkedin /> LinkedIn
            </a>
          </div>
        </div>
        <aside className="spec-panel" aria-label="Technical profile summary">
          {heroPanel.map((row) => (
            <div className="spec-row" key={row.title}>
              <div className="spec-title">{row.title}</div>
              <ul className="spec-items">
                {row.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </aside>
      </div>
    </header>
  )
}
