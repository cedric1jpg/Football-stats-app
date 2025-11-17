import React from 'react'
import Head from 'next/head'
import styles from '../styles/futuristic.module.css'

export default function Futuristic() {
  return (
    <>
      <Head>
        <title>Football Stats — Arena</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href="/futuristic.css" />
      </Head>

      <div className={styles.stage}>
        <nav className={styles.hud}>
          <div className={styles.brand}>FOOTBALL <span className={styles.pulse}>ARENA</span></div>
          <div className={styles.credits}>Player: <strong>Guest</strong></div>
        </nav>

        <header className={styles.hero}>
          <h1>Enter the Arena</h1>
          <p className={styles.lead}>A futuristic look at football teams — collect, strategize, and dominate.</p>

          <div className={styles.controls}>
            <a className={styles.btn + ' ' + styles.btnPrimary} href="/">Back to app</a>
            <a className={styles.btn + ' ' + styles.btnGhost} href="#explore">Explore teams</a>
          </div>
        </header>

        <main id="explore" className={styles.cards}>
          <section className={styles.card + ' ' + styles.cardBig}>
            <div className={styles.meter}>97</div>
            <h3>Galactic FC</h3>
            <p className={styles.muted}>Premier Galactic League</p>
          </section>

          <section className={styles.card}>
            <div className={styles.meter + ' ' + styles.meterSmall}>88</div>
            <h4>Neo United</h4>
            <p className={styles.muted}>Neo-Ligue</p>
          </section>

          <section className={styles.card}>
            <div className={styles.meter + ' ' + styles.meterSmall}>75</div>
            <h4>Solar City</h4>
            <p className={styles.muted}>Sun Conference</p>
          </section>
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
