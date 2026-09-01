/** Lightweight SVG visual motifs for flagship project cards. Deterministic, no data files. */
const A = '#40d0e8'
const V = '#a78bfa'
const D = '#2c4159'

const wrap = (children: React.ReactNode, label: string) => (
  <svg viewBox="0 0 400 130" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
    {children}
  </svg>
)

/* deterministic pseudo-random */
const prand = (seed: number) => {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

export function Viz({ kind }: { kind: string }) {
  switch (kind) {
    case 'bubbles': {
      const r = prand(7)
      return wrap(
        <>
          {[...Array(12)].map((_, i) => {
            const x = 30 + r() * 340
            const y = 20 + r() * 90
            const rad = 4 + r() * 10
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={rad} fill="rgba(64,208,232,0.08)" stroke={A} strokeWidth="1" />
                <circle cx={x - rad * 0.3} cy={y - rad * 0.3} r={rad * 0.25} fill={A} opacity="0.6" />
              </g>
            )
          })}
          <line x1="0" y1="112" x2="400" y2="112" stroke={D} />
          <path d="M0 108 Q 100 90 200 104 T 400 100" stroke={V} strokeWidth="1" fill="none" strokeDasharray="3 4" />
        </>,
        'Rising bubbles with a theoretical comparison curve',
      )
    }
    case 'graph':
      return wrap(
        <>
          {[[60, 40], [140, 25], [220, 55], [300, 35], [90, 95], [180, 100], [270, 95], [345, 80]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="6" fill="#0a0e14" stroke={A} strokeWidth="1.4" />
          ))}
          {[[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6], [2, 6], [6, 7], [3, 7], [1, 5], [2, 5]].map(([a, b], i) => (
            <line key={i} x1={[60, 140, 220, 300, 90, 180, 270, 345][a]} y1={[40, 25, 55, 35, 95, 100, 95, 80][a]} x2={[60, 140, 220, 300, 90, 180, 270, 345][b]} y2={[40, 25, 55, 35, 95, 100, 95, 80][b]} stroke={D} strokeWidth="1.2" />
          ))}
        </>,
        'Graph network of connected nodes',
      )
    case 'lattice': {
      const r = prand(21)
      return wrap(
        <>
          {[...Array(12)].map((_, i) => {
            const col = i
            const x = 30 + col * 30
            const p = col / 11
            return [...Array(4)].map((__, j) => {
              const y = 30 + j * 24
              const spinUp = r() > 0.25 + p * 0.65
              return <rect key={`${i}-${j}`} x={x} y={y} width="16" height="16" fill={spinUp ? 'rgba(64,208,232,0.55)' : 'rgba(167,139,250,0.35)'} stroke={D} strokeWidth="0.6" />
            })
          })}
          <text x="30" y="18" fill="#5c7186" fontSize="9" fontFamily="monospace">T &lt; Tc</text>
          <text x="290" y="18" fill="#5c7186" fontSize="9" fontFamily="monospace">T &gt; Tc</text>
          <line x1="196" y1="24" x2="196" y2="126" stroke={V} strokeWidth="1" strokeDasharray="4 3" />
          <text x="185" y="128" fill={V} fontSize="9" fontFamily="monospace">Tc</text>
        </>,
        'Ising lattice transitioning from ordered to disordered',
      )
    }
    case 'chart':
      return wrap(
        <>
          {[...Array(6)].map((_, i) => (
            <line key={i} x1="20" y1={20 + i * 16} x2="380" y2={20 + i * 16} stroke={D} strokeWidth="0.5" opacity="0.5" />
          ))}
          <polyline points="20,95 60,80 100,88 140,60 180,68 220,45 260,55 300,32 340,40 380,20" fill="none" stroke={A} strokeWidth="1.6" />
          <polyline points="20,100 60,88 100,94 140,72 180,80 220,58 260,68 300,48 340,55 380,38" fill="none" stroke={V} strokeWidth="1.2" strokeDasharray="4 3" />
        </>,
        'Actual vs predicted time-series chart',
      )
    case 'autoencoder': {
      const layer = (x: number, n: number, color: string) =>
        [...Array(n)].map((_, i) => <circle key={i} cx={x} cy={65 - (n - 1) * 9 + i * 18} r="4.5" fill="#0a0e14" stroke={color} strokeWidth="1.3" />)
      const connect = (x1: number, n1: number, x2: number, n2: number, keyPrefix: string) =>
        [...Array(n1)].flatMap((_, i) =>
          [...Array(n2)].map((__, j) => (
            <line key={`${keyPrefix}${i}${j}`} x1={x1} y1={65 - (n1 - 1) * 9 + i * 18} x2={x2} y2={65 - (n2 - 1) * 9 + j * 18} stroke={D} strokeWidth="0.5" />
          )),
        )
      return wrap(
        <>
          {connect(30, 5, 120, 3, 'a')}
          {connect(120, 3, 200, 2, 'b')}
          {connect(200, 2, 280, 3, 'c')}
          {connect(280, 3, 370, 5, 'd')}
          {layer(30, 5, A)}
          {layer(120, 3, A)}
          {layer(200, 2, V)}
          {layer(280, 3, A)}
          {layer(370, 5, A)}
          <text x="176" y="16" fill={V} fontSize="9" fontFamily="monospace">latent z</text>
        </>,
        'Autoencoder architecture',
      )
    }
    case 'persistence': {
      const r = prand(42)
      return wrap(
        <>
          {[...Array(14)].map((_, i) => (
            <circle key={i} cx={20 + r() * 160} cy={25 + r() * 85} r="2.4" fill={A} opacity="0.85" />
          ))}
          <line x1="210" y1="15" x2="210" y2="112" stroke={D} />
          <line x1="210" y1="112" x2="390" y2="112" stroke={D} />
          {[...Array(7)].map((_, i) => {
            const b = 215 + r() * 120
            const d = b + 15 + r() * 55
            return <circle key={i} cx={(b + d) / 2} cy={112 - (((b + d) / 2 - 210) * 0.85)} r="3" fill="none" stroke={V} strokeWidth="1.3" />
          })}
          <text x="60" y="124" fill="#5c7186" fontSize="9" fontFamily="monospace">point cloud</text>
          <text x="248" y="124" fill="#5c7186" fontSize="9" fontFamily="monospace">birth</text>
          <text x="355" y="124" fill="#5c7186" fontSize="9" fontFamily="monospace">death</text>
        </>,
        'Point cloud and persistence diagram',
      )
    }
    case 'detector':
      return wrap(
        <>
          <circle cx="200" cy="62" r="18" fill="rgba(167,139,250,0.15)" stroke={V} />
          <circle cx="200" cy="62" r="38" fill="none" stroke={A} strokeWidth="1" opacity="0.7" />
          <circle cx="200" cy="62" r="58" fill="none" stroke={A} strokeWidth="0.7" opacity="0.45" />
          {[[240, 38], [250, 78], [160, 24], [140, 98], [230, 102], [155, 52]].map(([x, y], i) => (
            <line key={i} x1="200" y1="62" x2={x} y2={y} stroke={A} strokeWidth="1" />
          ))}
          {[[240, 38], [250, 78], [160, 24], [140, 98], [230, 102], [155, 52]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.5" fill={A} />
          ))}
          <text x="168" y="122" fill="#5c7186" fontSize="9" fontFamily="monospace">event → Rivet</text>
        </>,
        'Particle detector cross-section with collision event',
      )
    case 'equation':
      return wrap(
        <>
          {['data', 'π-groups', 'basis', 'sparse fit'].map((s, i) => (
            <g key={s}>
              <rect x={16 + i * 74} y={30} width={58} height={26} rx={4} fill="#101825" stroke={A} strokeWidth="1.1" />
              <text x={45 + i * 74} y={47} textAnchor="middle" fill={A} fontSize="10" fontFamily="monospace">{s}</text>
              {i < 3 && <line x1={74 + i * 74} y1={43} x2={90 + i * 74} y2={43} stroke={D} strokeWidth="1.3" />}
            </g>
          ))}
          <rect x="70" y="76" width="260" height="30" rx="4" fill="rgba(167,139,250,0.06)" stroke={V} strokeWidth="1.1" />
          <text x="200" y="95" textAnchor="middle" fill={V} fontSize="12" fontFamily="monospace">√(2gh)  ·  A cos(√(k/m) t + φ)</text>
          <text x="16" y="124" fill="#5c7186" fontSize="9" fontFamily="monospace">one-term exact recovery</text>
        </>,
        'Symbolic regression pipeline recovering exact physical equations',
      )
    case 'twin':
      return wrap(
        <>
          {[0, 1, 2].map((ch) => (
            <polyline
              key={ch}
              points={[...Array(40)].map((_, i) => `${10 + i * 9},${28 + ch * 18 + Math.sin(i * 0.55 + ch * 2) * 7}`).join(' ')}
              fill="none"
              stroke={A}
              strokeWidth="1"
              opacity={0.8 - ch * 0.2}
            />
          ))}
          <polyline
            points={[...Array(40)].map((_, i) => `${10 + i * 9},${100 + Math.sin(i * 0.55) * 5 + (i > 26 ? (i - 26) * 2.2 : 0)}`).join(' ')}
            fill="none"
            stroke={V}
            strokeWidth="1.3"
          />
          <text x="10" y="122" fill="#5c7186" fontSize="9" fontFamily="monospace">measured − expected = residual r(t)</text>
        </>,
        'Multivariate sensor channels with a growing digital-twin residual',
      )
    case 'band':
      return wrap(
        <>
          <path d="M20 40 Q 90 78 150 84 L 380 84" fill="none" stroke={A} strokeWidth="1.4" />
          <path d="M20 100 Q 90 112 150 114 L 380 114" fill="none" stroke={A} strokeWidth="1.4" opacity="0.55" />
          <path d="M20 96 L 60 96 Q 110 96 150 74 L 380 58" fill="none" stroke={V} strokeWidth="1.4" strokeDasharray="5 3" />
          <line x1="150" y1="20" x2="150" y2="120" stroke={D} strokeDasharray="3 3" />
          <text x="156" y="30" fill="#5c7186" fontSize="9" fontFamily="monospace">tunneling junction</text>
          <text x="24" y="36" fill="#5c7186" fontSize="9" fontFamily="monospace">source</text>
          <text x="344" y="50" fill="#5c7186" fontSize="9" fontFamily="monospace">drain</text>
        </>,
        'TFET energy-band diagram with source-to-channel tunneling',
      )
    default: {
      /* pipeline */
      const labels = ['PI', 'SNS', 'DSP', 'ML', 'OUT']
      return wrap(
        <>
          {labels.map((s, i) => (
            <g key={s}>
              <rect x={20 + i * 78} y="48" width="52" height="34" rx="4" fill="#101825" stroke={A} strokeWidth="1.2" />
              <text x={46 + i * 78} y="69" textAnchor="middle" fill={A} fontSize="11" fontFamily="monospace">{s}</text>
              {i < 4 && <line x1={72 + i * 78} y1="65" x2={98 + i * 78} y2="65" stroke={D} strokeWidth="1.4" />}
              {i < 4 && (
                <circle cx={85 + i * 78} cy="65" r="2.4" fill={A}>
                  <animate attributeName="opacity" values="1;0.2;1" dur="1.4s" begin={`${i * 0.28}s`} repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ))}
          <text x="20" y="34" fill="#5c7186" fontSize="9" fontFamily="monospace">raspberry pi</text>
          <text x="176" y="34" fill="#5c7186" fontSize="9" fontFamily="monospace">sensors</text>
          <text x="254" y="34" fill="#5c7186" fontSize="9" fontFamily="monospace">processing</text>
          <text x="332" y="34" fill="#5c7186" fontSize="9" fontFamily="monospace">output</text>
        </>,
        'Edge pipeline from sensors to output',
      )
    }
  }
}
