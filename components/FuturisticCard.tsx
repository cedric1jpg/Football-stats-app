import React from 'react'
import Link from 'next/link'
import styles from '../styles/futuristic.module.css'

type Team = { id: number; name: string; league: string; rating?: number; attack?: number; defense?: number }

function computeRating(team: Team) {
  if (typeof team.rating === 'number') return team.rating
  const attack = team.attack ?? 75
  const defense = team.defense ?? 75
  // weighted average: attack 0.6, defense 0.4
  return Math.round(attack * 0.6 + defense * 0.4)
}

function colorFromId(id: number) {
  // simple deterministic color generator per id
  const hues = [190, 260, 200, 340, 30, 140]
  return `hsl(${hues[id % hues.length]} 90%  fifty%)`.replace('fifty', '45')
}

export default function FuturisticCard({ team }: { team: Team }) {
  const rating = computeRating(team)
  const large = rating > 90

  return (
    <Link href={`/teams/${team.id}`} legacyBehavior>
      <a className={large ? `${styles.card} ${styles.cardBig}` : styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg className={styles.icon} width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{color: colorFromId(team.id)}}>
              <defs>
                <linearGradient id={`g${team.id}`} x1="0" x2="1">
                  <stop offset="0%" stopColor="rgba(0,240,255,0.9)" />
                  <stop offset="100%" stopColor="rgba(124,58,237,0.9)" />
                </linearGradient>
              </defs>
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" fill={`url(#g${team.id})`} />
              <circle cx="8" cy="10" r="2" fill="currentColor" />
              <path d="M2 20c4-2 8-2 12 0 4-2 8-2 8 0" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            </svg>
            <div>
              <div style={{ fontWeight: 800 }}>{team.name}</div>
              <div className={styles.muted}>{team.league}</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className={styles.meter} style={{ fontSize: large ? 64 : undefined }}>{rating}</div>
            <div className={styles.smallMuted}>RATING</div>
          </div>
        </div>
      </a>
    </Link>
  )
}
