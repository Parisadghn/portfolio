import { useState } from 'react'
import { Section } from './ui'

interface Node {
  id: string
  label: string
  x: number
  y: number
  tech: string[]
}

const nodes: Node[] = [
  { id: 'physics', label: 'PHYSICS', x: 200, y: 60, tech: ['QFT', 'Statistical Mechanics', 'Monte Carlo', 'Stochastic Thermodynamics', 'TDA'] },
  { id: 'math', label: 'MATHEMATICS', x: 200, y: 175, tech: ['Geometry & Topology', 'Linear Algebra', 'Stochastic Processes'] },
  { id: 'sci', label: 'SCIENTIFIC COMPUTING', x: 200, y: 290, tech: ['Python', 'C/C++', 'Fortran', 'COMSOL', 'STAR-CCM+', 'Rivet', 'HPC'] },
  { id: 'ml', label: 'MACHINE LEARNING', x: 200, y: 405, tech: ['TensorFlow', 'Keras', 'GCN', 'LSTM', 'Autoencoder', 'Symbolic Regression', 'TDA', 'Scikit-learn'] },
  { id: 'sensors', label: 'SENSOR SYSTEMS', x: 200, y: 520, tech: ['AFM', 'MEMS', 'SpO₂ / GPS / BP', 'TinyML', 'Raspberry Pi'] },
  { id: 'iot', label: 'IOT', x: 200, y: 635, tech: ['MQTT', 'LoRaWAN', 'Node-RED', 'Node.js', 'SQL'] },
  { id: 'app', label: 'REAL-WORLD APPLICATIONS', x: 200, y: 750, tech: ['Health Monitoring', 'Environmental Monitoring', 'Nanotechnology'] },
  { id: 'fab', label: 'MICRO/NANO FABRICATION', x: 560, y: 520, tech: ['UV Lithography', 'RIE', 'Wet Etching', 'PVD', 'AFM Sensor', 'Silicon Wafer'] },
]

const edges: [string, string][] = [
  ['physics', 'math'],
  ['math', 'sci'],
  ['sci', 'ml'],
  ['ml', 'sensors'],
  ['sensors', 'iot'],
  ['iot', 'app'],
  ['sci', 'fab'],
  ['fab', 'sensors'],
  ['ml', 'app'],
]

const edgeLabels: Record<string, string> = {
  'sci-fab': 'COMSOL ↔ MEMS',
  'ml-app': 'models ↔ products',
  'fab-sensors': 'silicon ↔ devices',
  'physics-math': 'theory',
  'math-sci': 'numerics',
  'sci-ml': 'data',
  'ml-sensors': 'TinyML',
  'sensors-iot': 'telemetry',
  'iot-app': 'deployment',
}

const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]))

export function Landscape() {
  const [active, setActive] = useState<Node | null>(null)

  return (
    <Section
      id="landscape"
      kicker="08 · Signature Map"
      title="Research Landscape"
      intro="How my domains connect — hover or focus a node to explore the technologies behind it."
    >
      <div className="landscape-wrap">
        <svg viewBox="0 0 760 810" role="img" aria-label="Interactive map connecting physics, mathematics, scientific computing, machine learning, sensor systems, IoT, micro/nano fabrication and real-world applications">
          {edges.map(([a, b]) => {
            const na = nodeMap[a]
            const nb = nodeMap[b]
            const mid = { x: (na.x + nb.x) / 2, y: (na.y + nb.y) / 2 }
            const lit = active && (active.id === a || active.id === b)
            const key = `${a}-${b}`
            return (
              <g key={key}>
                <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={lit ? '#40d0e8' : '#1e2b3d'} strokeWidth={lit ? 1.6 : 1} />
                <text x={mid.x + 8} y={mid.y - 4} fill={lit ? '#40d0e8' : '#3a4f68'} fontSize="9" fontFamily="monospace">
                  {edgeLabels[key] ?? ''}
                </text>
              </g>
            )
          })}
          {nodes.map((n) => {
            const lit = active?.id === n.id
            return (
              <g
                key={n.id}
                className="landscape-node"
                tabIndex={0}
                role="button"
                aria-label={`${n.label}: ${n.tech.join(', ')}`}
                onMouseEnter={() => setActive(n)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(n)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((cur) => (cur?.id === n.id ? null : n))}
              >
                <circle cx={n.x} cy={n.y} r={lit ? 14 : 10} fill={lit ? 'rgba(64,208,232,0.25)' : '#101825'} stroke={n.x > 400 ? '#a78bfa' : '#40d0e8'} strokeWidth="1.6" />
                <text x={n.x} y={n.y - 20} textAnchor="middle" fill={lit ? '#ffffff' : '#d8e2ec'} fontSize="11" fontFamily="monospace" letterSpacing="1">
                  {n.label}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="landscape-hint">hover / focus nodes to inspect technologies</div>
        {active && (
          <div className="landscape-tooltip" role="status">
            <strong>{active.label}</strong>
            {active.tech.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
