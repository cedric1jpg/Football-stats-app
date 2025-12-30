import React from 'react'

type Props = {
  attack?: number | string
  defense?: number | string
  rating?: number | string
}

// Lightweight SVG radar chart with 3 axes (attack, defense, rating).
// Avoids adding a heavy chart dependency so the project builds without 'recharts'.
export default function TeamRadar({ attack = 75, defense = 75, rating = 75 }: Props) {
  const a = Number(attack) || 0
  const d = Number(defense) || 0
  const r = Number(rating) || 0

  // scale to 0..100 if rating seems 0..10
  const scaleValue = (v: number) => (v <= 10 ? v * 10 : v)
  const va = Math.min(100, Math.max(0, scaleValue(a)))
  const vd = Math.min(100, Math.max(0, scaleValue(d)))
  const vr = Math.min(100, Math.max(0, scaleValue(r)))

  const size = 160
  const cx = size / 2
  const cy = size / 2
  const radius = 58

  // angles for three axes: -90deg (top), 30deg (bottom-right), 210deg (bottom-left)
  const angles = [-90, 30, 210]
  const values = [va, vd, vr]

  const point = (value: number, angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180
    const rScaled = (value / 100) * radius
    return [cx + rScaled * Math.cos(rad), cy + rScaled * Math.sin(rad)]
  }

  const points = values.map((v, i) => point(v, angles[i]))
  const pointsAttr = points.map((p) => p.join(',')).join(' ')

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {/* background grid */}
      {[0.25, 0.5, 0.75, 1].map((f, idx) => {
        const r0 = radius * f
        return (
          <polygon
            key={idx}
            points={[0, 1, 2]
              .map((i) => {
                const rad = (angles[i] * Math.PI) / 180
                const x = cx + r0 * Math.cos(rad)
                const y = cy + r0 * Math.sin(rad)
                return `${x},${y}`
              })
              .join(' ')}
            fill="none"
            stroke={idx === 3 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)'}
            strokeWidth={1}
          />
        )
      })}

      {/* axis lines */}
      {angles.map((ang, i) => {
        const [x, y] = point(100, ang)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      })}

      {/* labels */}
      {['Attack', 'Defense', 'Rating'].map((label, i) => {
        const [x, y] = point(110, angles[i])
        return (
          <text key={i} x={x} y={y} fontSize={9} fill="var(--muted)" textAnchor="middle" dominantBaseline="middle">
            {label}
          </text>
        )
      })}

      {/* value polygon */}
      <polygon points={pointsAttr} fill="rgba(136,132,216,0.12)" stroke="#8884d8" strokeWidth={1.5} />

      {/* small dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={3.2} fill="#8884d8" />
      ))}
    </svg>
  )
}
