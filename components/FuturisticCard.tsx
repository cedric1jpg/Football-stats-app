import React from 'react'
import Link from 'next/link'
import styles from '../styles/futuristic.module.css'

type Team = { id: number; name: string; league: string; rating?: number }

export default function FuturisticCard({ team }: { team: Team }) {
  const rating = team.rating ?? Math.floor(60 + Math.random() * 40)
  const large = rating > 90

  return (
    <Link href={`/teams/${team.id}`} legacyBehavior>
      <a className={large ? `${styles.card} ${styles.cardBig}` : styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg className={styles.icon} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" fill="rgba(0,240,255,0.06)"/>
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
