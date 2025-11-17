import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import TeamList from '../components/TeamList'
import Link from 'next/link'

type Team = { id: number; name: string; league: string }

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('/api/teams')
      .then((r) => r.json())
      .then(setTeams)
      .catch(console.error)
  }, [])

  const filtered = teams.filter((t) =>
    `${t.name} ${t.league}`.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <Layout>
      <div style={{ marginBottom: 12 }}>
        <Link href="/futuristic" legacyBehavior>
          <a
            style={{
              display: 'inline-block',
              padding: '10px 14px',
              background: 'linear-gradient(90deg,#00f0ff,#7c3aed)',
              color: '#021226',
              borderRadius: 10,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 8px 26px rgba(7,20,42,0.6)'
            }}
          >
            Open futuristic UI
          </a>
        </Link>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <input
          className="search"
          placeholder="Search teams or leagues..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <h3 style={{ marginTop: 0 }}>Teams</h3>
      <div className="subtitle">Showing {filtered.length} of {teams.length} teams</div>

      <TeamList teams={filtered} />
    </Layout>
  )
}
