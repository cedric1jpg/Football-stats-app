import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Standing {
  position: number
  team: { name: string; crest?: string }
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

export default function LeaguePage() {
  const router = useRouter()
  const { league } = router.query
  const [standings, setStandings] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!league) return
    fetch(`/api/leagues/${encodeURIComponent(league as string)}/standings?season=2025`)
      .then(r => r.json())
      .then(data => {
        setStandings(data.standings || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [league])

  if (loading) return <Layout><div>Loading league standings...</div></Layout>

  const chartData = standings.slice(0, 10).map(team => ({
    name: team.team.name.length > 10 ? team.team.name.substring(0, 10) + '...' : team.team.name,
    points: team.points
  }))

  return (
    <Layout>
      <div style={{ padding: 24 }}>
        <h1>{league} League Standings</h1>
        <div style={{ marginTop: 24 }}>
          <h2>Points Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="points" fill="#00f0ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginTop: 24 }}>
          <h2>Standings Table</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
                  <th style={{ padding: 12, textAlign: 'center' }}>Pos</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Team</th>
                  <th style={{ padding: 12, textAlign: 'center' }}>MP</th>
                  <th style={{ padding: 12, textAlign: 'center' }}>W</th>
                  <th style={{ padding: 12, textAlign: 'center' }}>D</th>
                  <th style={{ padding: 12, textAlign: 'center' }}>L</th>
                  <th style={{ padding: 12, textAlign: 'center' }}>GF</th>
                  <th style={{ padding: 12, textAlign: 'center' }}>GA</th>
                  <th style={{ padding: 12, textAlign: 'center' }}>GD</th>
                  <th style={{ padding: 12, textAlign: 'center' }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map(team => (
                  <tr key={team.position} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: 12, textAlign: 'center', fontWeight: 'bold' }}>{team.position}</td>
                    <td style={{ padding: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                      {team.team.crest && <img src={team.team.crest} alt={team.team.name} width={24} height={24} style={{ borderRadius: 4 }} />}
                      <div>{team.team.name}</div>
                    </td>
                    <td style={{ padding: 12, textAlign: 'center' }}>{team.playedGames}</td>
                    <td style={{ padding: 12, textAlign: 'center' }}>{team.won}</td>
                    <td style={{ padding: 12, textAlign: 'center' }}>{team.draw}</td>
                    <td style={{ padding: 12, textAlign: 'center' }}>{team.lost}</td>
                    <td style={{ padding: 12, textAlign: 'center' }}>{team.goalsFor}</td>
                    <td style={{ padding: 12, textAlign: 'center' }}>{team.goalsAgainst}</td>
                    <td style={{ padding: 12, textAlign: 'center', color: team.goalDifference > 0 ? '#0f0' : team.goalDifference < 0 ? '#f00' : '#fff' }}>
                      {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center', fontWeight: 'bold', color: '#00f0ff' }}>{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}