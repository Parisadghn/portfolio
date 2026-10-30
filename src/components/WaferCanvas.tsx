import { useEffect, useRef, useState } from 'react'

const VERT = `attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`

/**
 * A silicon wafer under a thin film: two-beam interference (4πnd·cosθ/λ) on a tilted disc,
 * so the colours shift with the viewing angle exactly as they do on a real wafer.
 * The die pattern echoes the AFM sensor layout (mass with slots, scribe streets, edge exclusion).
 */
const FRAG = `precision highp float;
uniform vec2 uCenter;
uniform float uR, uTime;
uniform vec3 uTilt;
uniform vec2 uLight;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) { return 0.55 * noise(p) + 0.3 * noise(p * 2.1 + 3.7) + 0.15 * noise(p * 4.3 + 9.1); }

vec3 film(float d, float cosI) {
  float n = 1.9;
  float sinT = sqrt(max(0.0, 1.0 - cosI * cosI)) / n;
  float cosT = sqrt(1.0 - sinT * sinT);
  float ph = 12.566 * n * d * cosT;
  // Each channel averages a band of wavelengths, which gives the soft colours of a real film
  vec3 c = cos(ph / vec3(590.0, 510.0, 430.0)) + cos(ph / vec3(620.0, 535.0, 455.0)) + cos(ph / vec3(650.0, 560.0, 480.0));
  c = 0.5 + c / 6.0;
  // Silicon is never fully dark at a reflectance minimum
  return 0.16 + 0.84 * c;
}

void main() {
  vec2 p = (gl_FragCoord.xy - uCenter) / uR;
  vec3 C = vec3(0.0, 0.0, 3.4);
  vec3 dir = normalize(vec3(p, -3.4));
  float cx = cos(uTilt.x), sx = sin(uTilt.x), cy = cos(uTilt.y), sy = sin(uTilt.y);
  mat3 R = mat3(cy, 0.0, -sy, 0.0, 1.0, 0.0, sy, 0.0, cy) * mat3(1.0, 0.0, 0.0, 0.0, cx, sx, 0.0, -sx, cx);
  vec3 n = R[2];
  vec3 H = C + dir * (-dot(n, C) / dot(n, dir));
  vec2 q = vec2(dot(H, R[0]), dot(H, R[1]));
  float cs = cos(uTilt.z), ss = sin(uTilt.z);
  q = mat2(cs, -ss, ss, cs) * q;

  float r = length(q);
  float sd = min(1.0 - r, q.y + 0.968);       // inside the disc, with the wafer flat
  float inside = smoothstep(0.0, 1.8 / uR, sd);
  float cosI = abs(dot(n, dir));

  // Die grid
  vec2 g = q * vec2(15.0, 21.0);
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  vec2 a = abs(f);
  float field = smoothstep(0.93, 0.895, r) * smoothstep(-0.92, -0.885, q.y);
  float street = smoothstep(0.43, 0.48, max(a.x, a.y));
  float mass = smoothstep(0.03, -0.03, max(max(a.x - 0.30, a.y - 0.4), a.x + a.y - 0.56));
  float slot = max(
    smoothstep(0.03, -0.03, max(abs(a.x - 0.16) - 0.04, abs(f.y + 0.03) - 0.22)),
    smoothstep(0.03, -0.03, max(a.x - 0.2, abs(f.y + 0.31) - 0.035)));

  // Film thickness (nm): deposition non-uniformity plus fast fringes towards the edge
  float d = 120.0 + 260.0 * fbm(q * 0.8 + vec2(uTime * 0.016, -uTime * 0.011)) + 240.0 * r * r;
  d += 420.0 * pow(smoothstep(0.88, 1.0, r), 2.0);
  d += 3.0 * (hash(id) - 0.5);
  d += 14.0 * mass * field;
  vec3 tint = film(d, cosI);

  vec3 refl = reflect(dir, n);
  vec3 L = normalize(vec3(uLight, 1.25));
  float rl = max(dot(refl, L), 0.0);
  float sheen = pow(rl, 2.2);
  vec3 col = tint * (0.5 + 0.8 * sheen);
  col = mix(col, tint * 0.5, slot * field * 0.55);
  col = mix(col, vec3(0.7, 0.72, 0.78) * (0.42 + 0.7 * sheen), street * field * 0.28);
  col += pow(rl, 26.0) * vec3(1.0, 0.97, 0.92) * 0.5;
  col = pow(col, vec3(0.92));
  col = mix(col, vec3(0.86) * (0.3 + sheen), smoothstep(0.011, 0.0, sd) * 0.8);

  float glow = exp(-max(-sd, 0.0) * 5.0) * 0.2;
  vec3 glowCol = film(560.0 + 120.0 * sin(atan(q.y, q.x) * 2.0), 0.8);
  float outside = 1.0 - inside;
  gl_FragColor = vec4(col * inside + glowCol * glow * outside, inside + glow * 0.6 * outside);
}`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null
}

export function WaferCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' })
    const vs = gl && compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = gl && compile(gl, gl.FRAGMENT_SHADER, FRAG)
    const prog = gl && vs && fs ? gl.createProgram() : null
    if (!gl || !prog || !vs || !fs) return setFailed(true)
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return setFailed(true)
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.bindAttribLocation(prog, 0, 'a')
    gl.vertexAttribPointer(gl.getAttribLocation(prog, 'a'), 2, gl.FLOAT, false, 0, 0)
    const u = {
      center: gl.getUniformLocation(prog, 'uCenter'),
      r: gl.getUniformLocation(prog, 'uR'),
      time: gl.getUniformLocation(prog, 'uTime'),
      tilt: gl.getUniformLocation(prog, 'uTilt'),
      light: gl.getUniformLocation(prog, 'uLight'),
    }

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let visible = true
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      // Large and partly off-canvas: to the right on wide screens, behind the name on phones.
      const wide = w > 900
      const radius = (wide ? Math.max(h * 0.58, w * 0.3) : Math.max(w * 0.74, h * 0.36)) * dpr
      gl.uniform1f(u.r, radius)
      gl.uniform2f(u.center, canvas.width * (wide ? 0.76 : 0.62), canvas.height * (wide ? 0.53 : 0.74))
      if (still) draw(0)
    }

    function draw(ms: number) {
      if (!gl) return
      const t = ms / 1000
      pointer.sx += (pointer.x - pointer.sx) * 0.05
      pointer.sy += (pointer.y - pointer.sy) * 0.05
      const scroll = Math.min(window.scrollY / Math.max(canvas!.clientHeight, 1), 1.2)
      gl.uniform1f(u.time, t)
      gl.uniform3f(
        u.tilt,
        0.5 + 0.04 * Math.sin(t * 0.31) + pointer.sy * 0.16 + scroll * 0.35,
        -0.34 + 0.04 * Math.cos(t * 0.23) + pointer.sx * 0.2,
        0.42 + t * 0.018 + scroll * 0.5,
      )
      gl.uniform2f(u.light, -0.5 + pointer.sx * 1.1, 0.75 - pointer.sy * 0.9)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (ms: number) => {
      draw(ms)
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0
    }
    const start = () => {
      if (!still && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop)
    }
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      start()
    })
    io.observe(canvas)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('visibilitychange', start)
    canvas.addEventListener('webglcontextlost', () => setFailed(true))
    resize()
    start()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', start)
    }
  }, [])

  if (failed) return <div className="wafer-fallback" aria-hidden="true" />
  return <canvas className="wafer-canvas" ref={ref} aria-hidden="true" />
}
