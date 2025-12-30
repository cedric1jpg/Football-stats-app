import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface Player {
  id: number
  name: string
  goals: number
  assists: number
}

const topPlayers: Player[] = [
  { id: 1, name: 'Erling Haaland', goals: 20, assists: 5 },
  { id: 2, name: 'Kevin De Bruyne', goals: 5, assists: 15 },
  { id: 3, name: 'Mohamed Salah', goals: 18, assists: 8 },
  { id: 4, name: 'Lionel Messi', goals: 12, assists: 10 },
  { id: 5, name: 'Cristiano Ronaldo', goals: 15, assists: 3 },
  // Add more
]

export default function FantasyPage() {
  const [selected, setSelected] = useState<number[]>([])
  const [pointsData, setPointsData] = useState<{ name: string; points: number }[]>([])
  const [savedTeams, setSavedTeams] = useState<any[]>([])

  useEffect(() => {
    const s = localStorage.getItem('fantasyTeams')
    if (s) setSavedTeams(JSON.parse(s))
  }, [])

  const calculatePoints = () => {
    const players = topPlayers.filter(p => selected.includes(p.id))
    const data = players.map(p => ({
      name: p.name,
      points: p.goals * 6 + p.assists * 3
    }))
    setPointsData(data)
  }

  const saveTeam = () => {
    const team = { players: selected, points: pointsData, date: new Date().toISOString() }
    const newSaved = [...savedTeams, team]
    setSavedTeams(newSaved)
    localStorage.setItem('fantasyTeams', JSON.stringify(newSaved))
  }

  return (
    <Layout>
      <h2>Fantasy Football</h2>
      <p>Select players for your fantasy team. Points: Goals x6, Assists x3.</p>

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h3>Select Players</h3>
          {topPlayers.map(p => (
            <label key={p.id} style={{ display: 'block', margin: '8px 0' }}>
              <input
                type="checkbox"
                checked={selected.includes(p.id)}
                onChange={(e) => {
                  if (e.target.checked) setSelected([...selected, p.id])
                  else setSelected(selected.filter(id => id !== p.id))
                }}
              />
              {p.name} (Goals: {p.goals}, Assists: {p.assists})
            </label>
          ))}
          <button onClick={calculatePoints} style={{ marginTop: 12, padding: '8px 16px', background: 'var(--accent)', border: 'none', color: '#021226' }}>
            Calculate Points
          </button>
          <button onClick={saveTeam} style={{ marginLeft: 12, padding: '8px 16px', background: 'var(--muted)', border: 'none' }}>
            Save Team
          </button>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Points Table</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8 }}>Player</th>
                <th style={{ padding: 8 }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {pointsData.map((p, i) => (
                <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: 8 }}>{p.name}</td>
                  <td style={{ padding: 8 }}>{p.points}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Points Visualization</h3>
          <BarChart width={400} height={300} data={pointsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="points" fill="#00f0ff" />
          </BarChart>
        </div>
      </div>

      <h3>Saved Teams</h3>
      {savedTeams.map((t, i) => (
        <div key={i} style={{ margin: '12px 0', padding: 12, background: 'var(--card)', borderRadius: 8 }}>
          <div>Team {i+1} - {t.date}</div>
          <div>Players: {t.players.length}, Total Points: {t.points.reduce((sum: number, p: any) => sum + p.points, 0)}</div>
        </div>
      ))}
    </Layout>
  )
}