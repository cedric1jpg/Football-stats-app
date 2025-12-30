import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PlayerTrends() {
  const [playerId, setPlayerId] = useState('')

  const { data: playersData } = useSWR('/api/players?limit=100', fetcher)
  const players = playersData?.players || []

  // Mock trends data, in real app aggregate from seasons.csv
  const trends = playerId ? [
    { season: '2021', goals: 5, assists: 3 },
    { season: '2022', goals: 8, assists: 5 },
    { season: '2023', goals: 10, assists: 7 },
    { season: '2024', goals: 12, assists: 9 },
  ] : []

  return (
    <div className="card" style={{ padding: 20 }}>
      <h3>📈 Player Trends</h3>
      <div style={{ marginBottom: 20 }}>
        <label>Player</label>
        <select value={playerId} onChange={(e) => setPlayerId(e.target.value)} style={{ width: 200, padding: 8, borderRadius: 8, border: '1px solid var(--muted)', background: 'transparent' }}>
          <option value="">Select</option>
          {players.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {trends.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="goals" stroke="#8884d8" />
            <Line type="monotone" dataKey="assists" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}