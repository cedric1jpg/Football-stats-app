import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/futuristic.module.css'
import FuturisticCard from '../components/FuturisticCard'

type Team = { id: number; name: string; league: string; rating?: number; attack?: number; defense?: number }

export default function Futuristic() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loadMs, setLoadMs] = useState<number | null>(null)

  useEffect(() => {
    let t0 = performance.now()
    fetch('/api/teams')
      .then((r) => r.json())
      .then((data) => {
        setTeams(data)
        setLoadMs(Math.round(performance.now() - t0))
        console.log('[futuristic] loaded teams in', Math.round(performance.now() - t0), 'ms')
      })
        .catch((err) => {
          console.warn('[futuristic] teams fetch failed', err)
          // fallback: keep static samples including attack/defense so ratings compute
          setTeams([
            { id: 1, name: 'Galactic FC', league: 'Premier Galactic League', attack: 96, defense: 92 },
            { id: 2, name: 'Neo United', league: 'Neo-Ligue', attack: 86, defense: 80 },
            { id: 3, name: 'Solar City', league: 'Sun Conference', attack: 74, defense: 77 },
          ])
          setLoadMs(null)
        })
  }, [])

  return (
    <>
      <Head>
        <title>Football Stats — Arena</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <div className={styles.stage}>
        <nav className={styles.hud}>
          <div className={styles.brand}>FOOTBALL <span className={styles.pulse}>ARENA</span></div>
          <div className={styles.credits}>Player: <strong>Guest</strong></div>
        </nav>

        <header className={styles.hero}>
          <h1>Enter the Arena</h1>
          <p className={styles.lead}>A futuristic look at football teams — collect, strategize, and dominate.</p>
          <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 8 }}>
            {loadMs === null ? 'offline or slow — using fallback data' : loadMs ? `Loaded in ${loadMs}ms` : ''}
          </div>

          <div className={styles.controls}>
            <a className={styles.btn + ' ' + styles.btnPrimary} href="/">Back to app</a>
            <a className={styles.btn + ' ' + styles.btnGhost} href="#explore">Explore teams</a>
          </div>
        </header>

        <main id="explore" className={styles.cards}>
          {teams.map((t) => (
            <FuturisticCard key={t.id} team={t} />
          ))}
        </main>

        <footer className={styles.footer}>HUD • Live • Neon • v1.0</footer>
      </div>

      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('mousemove', (e) => {
              const x = (e.clientX / window.innerWidth - 0.5) * 20;
              const y = (e.clientY / window.innerHeight - 0.5) * 20;
              document.documentElement.style.setProperty('--mx', x + 'deg');
              document.documentElement.style.setProperty('--my', y + 'deg');
            })
          `,
        }}
      />
    </>
  )
}
