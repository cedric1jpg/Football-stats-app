import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

type Team = { id: number; name: string; league: string; rating?: number; attack?: number; defense?: number }

export default function TeamPage() {
  const router = useRouter()
  const { id } = router.query
  const [team, setTeam] = useState<Team | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/teams/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then(setTeam)
      .catch(() => setTeam(null))
  }, [id])

  if (!team) return (
    <Layout>
      <div style={{ padding: 24 }} className="card">
        <div className="subtitle">Loading or team not found.</div>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div style={{ padding: 24 }} className="card">
        <h2 style={{ marginTop: 0 }}>{team.name}</h2>
        <div className="muted">{team.league}</div>
        <div style={{ display: 'flex', gap: 18, marginTop: 18 }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{team.rating ?? '—'}</div>
            <div className="smallMuted">Overall rating</div>
          </div>

          <div>
            <div style={{ fontWeight: 700 }}>Attack</div>
            <div>{team.attack ?? '—'}</div>
          </div>

          <div>
            <div style={{ fontWeight: 700 }}>Defense</div>
            <div>{team.defense ?? '—'}</div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
