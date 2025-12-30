import React, { useState } from 'react'
import Link from 'next/link'
import styles from '../styles/futuristic.module.css'
import { Team, Player } from '../types'

function computeRating(data: Team | Player, type: 'team' | 'player') {
  // defensive: data may be undefined/null if called incorrectly — return a safe default
  if (!data) return 0
  if (type === 'team') {
    const team = data as Team
    if (team && typeof (team as any).rating === 'number') return (team as any).rating
    const attack = Number(team.attack ?? 1)
    const defense = Number(team.defense ?? 1)
    const base = Math.round((attack * 20) * 0.6 + ((3 - defense) * 20) * 0.4)
    return Math.max(0, Math.min(100, base))
  } else {
    const player = data as Player | undefined
    // defensive: player or rating might be missing
    if (player && typeof (player as any).rating === 'number') return (player as any).rating
    // fallback: compute a simple rating from goals/assists/played
    const goals = Number(player?.goals ?? 0)
    const assists = Number(player?.assists ?? 0)
    const played = Math.max(1, Number(player?.played ?? 1))
    const score = Math.round(((goals * 4) + (assists * 3)) / played * 10) + 50
    return Math.max(0, Math.min(100, score))
  }
}

function colorFromId(id: number) {
  const hues = [190, 260, 200, 340, 30, 140]
  const h = hues[id % hues.length]
  return `hsl(${h} 90% 45%)`
}

function generatePlaceholder(name: string, id: number, type: 'team' | 'player') {
  const initials = type === 'team' ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const hue = colorFromId(id).match(/hsl\((\d+)/)?.[1] || 190
  const svg = `<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg"><defs><filter id="neon"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="24" cy="24" r="20" fill="hsl(${hue},90%,45%)" stroke="hsl(${hue},90%,65%)" stroke-width="2" filter="url(#neon)"/><text x="24" y="30" text-anchor="middle" fill="white" font-size="16" font-weight="bold">${initials}</text></svg>`
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export default function FuturisticCard(props: { data?: Team | Player; type?: 'team' | 'player'; team?: Team; player?: Player }) {
  // Accept either the newer `{ data, type }` API or older `{ team }` for backwards compatibility
  const data = props.data ?? props.team ?? props.player
  const type: 'team' | 'player' = props.type ?? (props.team ? 'team' : props.player ? 'player' : 'team')
  const rating = computeRating(data as any, type)
  const large = rating > 85
  const glowClass = rating >= 75 ? 'glow-green' : rating >= 60 ? 'glow-yellow' : 'glow-red'
  const [showTooltip, setShowTooltip] = useState(false)
  const hasSparkle = rating > 80

  if (type === 'team') {
    const team = data as Team
    return (
      <div style={{ position: 'relative' }}>
        {hasSparkle && (
          <div style={{
            position: 'absolute',
            top: -5,
            right: -5,
            fontSize: 20,
            animation: 'sparkle 1s infinite',
          }}>
            ✨
          </div>
        )}
        <Link href={`/teams/${team.id}`} legacyBehavior>
          <a
            className={large ? `${styles.card} ${styles.cardBig}` : styles.card}
            aria-label={`Team ${team.name}, rating ${rating}, league ${team.league}`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={glowClass}>
                  <img src={team.logo || generatePlaceholder(team.name, team.id, 'team')} alt={team.name} style={{ width: 40, height: 40, objectFit: 'contain' }} className="neon-glow" loading="lazy" onError={(e) => { e.currentTarget.src = generatePlaceholder(team.name, team.id, 'team') }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800 }}>{team.name}</div>
                  <div className={styles.muted}>{team.league}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className={styles.meter} style={{ fontSize: large ? 48 : 28, fontWeight: 800 }}>{rating}</div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                  <div className="smallMuted">RATING</div>
                  {typeof team.points === 'number' ? <div className="form-badge">{team.points} pts</div> : null}
                </div>
                {team.form ? <div style={{ marginTop: 6, textAlign: 'right' }} className="smallMuted">Form: {team.form}</div> : null}
              </div>
            </div>
          </a>
        </Link>
        {showTooltip && team.quickStats && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--card)',
            padding: '8px 12px',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 10,
            fontSize: 12,
          }}>
            <div>Attack: {team.quickStats.attack}</div>
            <div>Defense: {team.quickStats.defense}</div>
          </div>
        )}
      </div>
    )
  } else {
    const player = data as Player
    return (
      <div className={large ? `${styles.card} ${styles.cardBig}` : styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={glowClass}>
              <img src={player.photo || generatePlaceholder(player.name, player.id, 'player')} alt={player.name} style={{ width: 40, height: 40, objectFit: 'contain' }} className="neon-glow" loading="lazy" onError={(e) => { e.currentTarget.src = generatePlaceholder(player.name, player.id, 'player') }} />
            </div>
            <div>
              <div style={{ fontWeight: 800 }}>{player.name}</div>
              <div className={styles.muted}>{player.position}</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className={styles.meter} style={{ fontSize: large ? 48 : 28, fontWeight: 800 }}>{rating}</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
              <div className="smallMuted">RATING</div>
              <div className="form-badge">{player.goals} goals</div>
            </div>
            <div style={{ marginTop: 6, textAlign: 'right' }} className="smallMuted">Assists: {player.assists}</div>
          </div>
        </div>
      </div>
    )
  }

  // fallback: should never be reached because we return inside each branch,
  // but keep the function tidy by returning null here if execution reaches this point.
  return null as any
}
