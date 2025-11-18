import React, { useEffect, useState } from 'react'

type Team = {
  id: number
  name: string
  logo?: string
  league?: string
  points?: number
  rating?: number
  played?: number
  gf?: number
  ga?: number
  form?: string
}

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<string | null>(null)
  const [season, setSeason] = useState('2023')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    fetch(`/api/teams?season=${season}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const body = await res.json()
        if (!mounted) return
        setSource(body.source ?? null)
        setTeams(Array.isArray(body.teams) ? body.teams : [])
      })
      .catch((e) => {
        if (!mounted) return
        setError(String(e.message || e))
        setTeams([])
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [season])

  return (
    <main style={{ padding: 20, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Football Stats App</h1>
        <div>
          <label style={{ marginRight: 8 }}>Season:</label>
          <select value={season} onChange={(e) => setSeason(e.target.value)}>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
      </header>

      {loading ? (
        <div>Loading teams…</div>
      ) : error ? (
        <div style={{ color: 'crimson' }}>Error loading teams: {error}</div>
      ) : (
        <>
          {source === 'fallback' && (
            <div style={{ background: '#fff4e5', padding: 12, borderRadius: 6, marginBottom: 12 }}>
              Using mock data (fallback). <a href="/api/teams/debug" target="_blank" rel="noreferrer">View debug payload</a>
            </div>
          )}

          <div style={{ marginBottom: 8 }}>
            Showing {teams.length} team{teams.length !== 1 ? 's' : ''} — Source: {source ?? 'unknown'}
          </div>

          {teams.length === 0 ? (
            <div>No teams yet.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {teams.map((t) => (
                <div key={t.id} style={{ padding: 12, borderRadius: 8, background: '#0f172a', color: 'white', boxShadow: '0 6px 18px rgba(0,0,0,0.4)' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={t.logo || '/favicon.ico'} alt={t.name} style={{ width: 48, height: 48, objectFit: 'contain' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontSize: 12, opacity: 0.8 }}>{t.league ?? 'League'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, fontSize: 13 }}>
                    <div>Pts: <strong>{t.points ?? '-'}</strong></div>
                    <div>Rating: <strong>{t.rating ?? '-'}</strong></div>
                    <div>GF/GA: <strong>{t.gf ?? '-'}/{t.ga ?? '-'}</strong></div>
                  </div>
                  {t.form && <div style={{ marginTop: 8, fontSize: 12 }}>Form: {t.form}</div>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
