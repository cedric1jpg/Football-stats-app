import React, { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container">
      <header className="header">
        <div className="logo">FS</div>
        <div>
          <h2 style={{ margin: 0 }}>Football Stats</h2>
          <div style={{ color: 'var(--muted)', fontSize: 12 }}>Lightweight demo — Next.js + TypeScript</div>
        </div>
      </header>

      <div className="card">{children}</div>

      <footer style={{ marginTop: 18, color: 'var(--muted)', fontSize: 13 }}>
        Built with ❤️ — data from /api/teams
      </footer>
    </div>
  )
}
