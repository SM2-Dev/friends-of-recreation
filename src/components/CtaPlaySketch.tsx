'use client'

import { useEffect, useId, useRef } from 'react'

type Point = [number, number]
type Vec3 = [number, number, number]
type AnimeTimeline = {
  add: (params: object, offset?: number | string) => AnimeTimeline
  pause: () => void
}
type AnimeEngine = {
  timeline: (params?: object) => AnimeTimeline
}

const CX = 100
const CY = 100
const BALL_R = 86
const PANEL_OPACITY = 0.32
const PHI = (1 + Math.sqrt(5)) / 2

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

function scale3(a: Vec3, s: number): Vec3 {
  return [a[0] * s, a[1] * s, a[2] * s]
}

function dot(a: Vec3, b: Vec3) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

function hypot3(a: Vec3) {
  return Math.hypot(a[0], a[1], a[2])
}

function normalize(a: Vec3): Vec3 {
  return scale3(a, 1 / (hypot3(a) || 1))
}

function lerp(a: Vec3, b: Vec3, t: number): Vec3 {
  return add(a, scale3(sub(b, a), t))
}

function dist(a: Vec3, b: Vec3) {
  return hypot3(sub(a, b))
}

function rotateAround(vector: Vec3, axis: Vec3, angle: number): Vec3 {
  const cosine = Math.cos(angle)
  const sine = Math.sin(angle)
  const unit = normalize(axis)
  return add(
    add(scale3(vector, cosine), scale3(cross(unit, vector), sine)),
    scale3(unit, dot(unit, vector) * (1 - cosine)),
  )
}

function alignToZ(points: Vec3[], direction: Vec3): Vec3[] {
  const normal = normalize(direction)
  const axis = cross(normal, [0, 0, 1])
  if (hypot3(axis) < 1e-8) {
    return normal[2] < 0 ? points.map((point) => rotateAround(point, [1, 0, 0], Math.PI)) : points
  }
  const angle = Math.acos(Math.min(1, Math.max(-1, normal[2])))
  return points.map((point) => rotateAround(point, axis, angle))
}

function toPath(points: Point[]) {
  const [start, ...rest] = points
  const body = rest.map((point) => `L ${point[0].toFixed(2)} ${point[1].toFixed(2)}`).join(' ')
  return `M ${start[0].toFixed(2)} ${start[1].toFixed(2)} ${body} Z`
}

function icosahedronVertices(): Vec3[] {
  const points: Vec3[] = []
  for (const signA of [1, -1]) {
    for (const signB of [1, -1]) {
      points.push([0, signA, signB * PHI])
      points.push([signA, signB * PHI, 0])
      points.push([signA * PHI, 0, signB])
    }
  }
  return points
}

function nearestLength(points: Vec3[]) {
  let length = Infinity
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      length = Math.min(length, dist(points[i], points[j]))
    }
  }
  return length
}

function orderAround(origin: Vec3, points: { idx: number; dir: Vec3 }[]) {
  const normal = normalize(origin)
  const hint: Vec3 = Math.abs(normal[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]
  const tangent = normalize(cross(normal, hint))
  const bitangent = cross(normal, tangent)
  return [...points].sort((left, right) => {
    const a = Math.atan2(dot(left.dir, bitangent), dot(left.dir, tangent))
    const b = Math.atan2(dot(right.dir, bitangent), dot(right.dir, tangent))
    return a - b
  })
}

type BallPatch = {
  path: string
  z: number
}

function buildSoccerBall() {
  const ico = icosahedronVertices()
  const icoEdge = nearestLength(ico)
  const neighbors = ico.map((): number[] => [])
  const icoEdges: [number, number][] = []

  for (let i = 0; i < ico.length; i += 1) {
    for (let j = i + 1; j < ico.length; j += 1) {
      if (Math.abs(dist(ico[i], ico[j]) - icoEdge) > icoEdge * 0.02) continue
      icoEdges.push([i, j])
      neighbors[i].push(j)
      neighbors[j].push(i)
    }
  }

  const trunc: Vec3[] = []
  const edgeVerts: { a: number; b: number; va: number; vb: number }[] = []
  for (const [a, b] of icoEdges) {
    const va = trunc.length
    trunc.push(lerp(ico[a], ico[b], 1 / 3))
    const vb = trunc.length
    trunc.push(lerp(ico[a], ico[b], 2 / 3))
    edgeVerts.push({ a, b, va, vb })
  }

  const pentagons = ico.map((_, vertex) => {
    const corners: { idx: number; dir: Vec3 }[] = []
    for (const edge of edgeVerts) {
      if (edge.a === vertex) corners.push({ idx: edge.va, dir: sub(ico[edge.b], ico[vertex]) })
      if (edge.b === vertex) corners.push({ idx: edge.vb, dir: sub(ico[edge.a], ico[vertex]) })
    }
    return orderAround(ico[vertex], corners).map((corner) => corner.idx)
  })

  const triangles: [number, number, number][] = []
  const seen = new Set<string>()
  for (let i = 0; i < ico.length; i += 1) {
    const ring = neighbors[i]
    for (let a = 0; a < ring.length; a += 1) {
      for (let b = a + 1; b < ring.length; b += 1) {
        const j = ring[a]
        const k = ring[b]
        if (!neighbors[j].includes(k)) continue
        const key = [i, j, k].sort((left, right) => left - right).join('-')
        if (seen.has(key)) continue
        seen.add(key)
        const normal = cross(sub(ico[j], ico[i]), sub(ico[k], ico[i]))
        triangles.push(dot(normal, ico[i]) > 0 ? [i, j, k] : [i, k, j])
      }
    }
  }

  const truncOnEdge = (from: number, to: number) => {
    for (const edge of edgeVerts) {
      if (edge.a === from && edge.b === to) return edge.va
      if (edge.b === from && edge.a === to) return edge.vb
    }
    return 0
  }

  const hexagons = triangles.map(([i, j, k]) => [
    truncOnEdge(i, j),
    truncOnEdge(j, i),
    truncOnEdge(j, k),
    truncOnEdge(k, j),
    truncOnEdge(k, i),
    truncOnEdge(i, k),
  ])

  const front = ico.reduce((best, point, index) => (point[2] > ico[best][2] ? index : best), 0)
  let points = alignToZ(trunc, ico[front])
  const face = pentagons[front].map((index) => points[index])
  const peak = face.reduce((best, point) => (point[1] > best[1] ? point : best), face[0])
  const spin = -Math.atan2(peak[0], peak[1])
  points = points.map((point) => rotateAround(point, [0, 0, 1], spin))

  const radius = hypot3(points[0])
  const fit = (BALL_R * 0.98) / radius
  const project = (index: number): Point => [
    CX + points[index][0] * fit,
    CY - points[index][1] * fit,
  ]

  const facing = (indices: number[]) => {
    const a = points[indices[0]]
    const b = points[indices[1]]
    const c = points[indices[2]]
    const normal = cross(sub(b, a), sub(c, a))
    const outward = dot(normal, a) > 0 ? normal : scale3(normal, -1)
    return outward[2] / (hypot3(outward) || 1) > 0.08
  }

  const depth = (indices: number[]) => indices.reduce((sum, index) => sum + points[index][2], 0) / indices.length

  const patch = (indices: number[]): BallPatch => ({
    path: toPath(indices.map(project)),
    z: depth(indices),
  })

  const pentagonPatches = pentagons.filter(facing).map(patch).sort((left, right) => right.z - left.z)
  const hexagonPatches = hexagons.filter(facing).map(patch).sort((left, right) => right.z - left.z)

  return {
    pentagons: pentagonPatches.map((item) => item.path),
    hexagons: hexagonPatches.map((item) => item.path),
  }
}

function resolveAnime(module: unknown): AnimeEngine {
  const record = module as { default?: { timeline?: unknown }; timeline?: unknown }
  const engine = record.default ?? record
  if (typeof engine.timeline === 'function') {
    return engine as AnimeEngine
  }
  throw new Error('animejs failed to load')
}

const soccer = buildSoccerBall()

/** Decorative line-drawn ball for the donate field. Hidden from assistive tech. */
export function CtaPlaySketch() {
  const rootRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const clipId = `cta-play-clip-${useId().replace(/:/g, '')}`

  useEffect(() => {
    const root = rootRef.current
    const svg = svgRef.current
    if (!root || !svg) return

    const strokes = [...svg.querySelectorAll<SVGGeometryElement>('[data-stroke]')]
    const panels = [...svg.querySelectorAll<SVGPathElement>('[data-panel]')]
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let played = false
    let cancelled = false
    let animation: AnimeTimeline | null = null

    const finish = () => {
      strokes.forEach((element) => {
        element.style.strokeDasharray = 'none'
        element.style.strokeDashoffset = '0'
      })
      panels.forEach((panel) => {
        panel.style.opacity = String(PANEL_OPACITY)
      })
      root.classList.add('is-drawn')
    }

    const play = () => {
      if (played || cancelled) return
      played = true
      if (reduced) {
        finish()
        return
      }

      void import('animejs')
        .then((module) => {
          if (cancelled) return
          const anime = resolveAnime(module)
          const seams = strokes.map((element) => {
            const length = element.getTotalLength()
            element.style.strokeDasharray = `${length}px`
            element.style.strokeDashoffset = `${length}px`
            return { el: element, dash: length }
          })
          const fill = { opacity: 0 }
          panels.forEach((panel) => {
            panel.style.opacity = '0'
          })

          animation = anime.timeline({
            easing: 'easeOutCubic',
            complete: finish,
          })
          seams.forEach((seam, index) => {
            animation?.add(
              {
                targets: seam,
                dash: 0,
                duration: 520,
                update() {
                  seam.el.style.strokeDashoffset = `${Math.max(0, seam.dash)}px`
                },
              },
              index * 42,
            )
          })
          if (panels.length) {
            animation.add(
              {
                targets: fill,
                opacity: PANEL_OPACITY,
                duration: 360,
                update() {
                  panels.forEach((panel) => {
                    panel.style.opacity = String(fill.opacity)
                  })
                },
              },
              '-=220',
            )
          }
        })
        .catch(() => {
          if (!cancelled) finish()
        })
    }

    if (root.getAttribute('data-reveal') === 'in') play()

    const mutations = new MutationObserver(() => {
      if (root.getAttribute('data-reveal') === 'in') play()
    })
    mutations.observe(root, { attributes: true, attributeFilter: ['data-reveal'] })

    return () => {
      cancelled = true
      mutations.disconnect()
      animation?.pause()
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="cta-draw"
      data-reveal="idle"
      ref={rootRef}
    >
      <div className="cta-draw-hop">
        <svg
          className="cta-draw-svg"
          fill="none"
          ref={svgRef}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.15"
          viewBox="0 0 200 200"
        >
          <defs>
            <clipPath id={clipId}>
              <circle cx={CX} cy={CY} r={BALL_R} />
            </clipPath>
          </defs>
          <circle cx={CX} cy={CY} data-stroke r={BALL_R} />
          <g clipPath={`url(#${clipId})`}>
            {soccer.pentagons.map((path) => (
              <path d={path} data-panel fill="currentColor" key={`fill-${path}`} stroke="none" />
            ))}
            {soccer.pentagons.map((path) => (
              <path d={path} data-stroke key={`penta-${path}`} />
            ))}
            {soccer.hexagons.map((path) => (
              <path d={path} data-stroke key={`hexa-${path}`} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
