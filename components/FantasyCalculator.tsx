import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Player {
  name: string
  goals: number
  assists: number
  points: number
}

export default function FantasyCalculator() {
  const [players, setPlayers] = useState<Player[]>([
    { name: '', goals: 0, assists: 0, points: 0 },
    { name: '', goals: 0, assists: 0, points: 0 },
    { name: '', goals: 0, assists: 0, points: 0 },
  ])

  const calculatePoints = (goals: number, assists: number) => goals * 6 + assists * 3

  const updatePlayer = (index: number, field: keyof Player, value: string | number) => {
    const newPlayers = [...players]
    newPlayers[index] = { ...newPlayers[index], [field]: value }
    newPlayers[index].points = calculatePoints(newPlayers[index].goals, newPlayers[index].assists)
    setPlayers(newPlayers)
  }

  const addPlayer = () => {
    setPlayers([...players, { name: '', goals: 0, assists: 0, points: 0 }])
  }

  const totalPoints = players.reduce((sum, p) => sum + p.points, 0)
  const chartData = players.filter(p => p.name).map(p => ({ name: p.name, points: p.points }))

  return (
    <div className="card" style={{ padding: 20 }}>
      <h3>🏆 Fantasy Points Calculator</h3>
      <p>Crush your fantasy league! Input your squad's stats.</p>

      {players.map((player, index) => (
        <div key={index} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Player name"
            value={player.name}
            onChange={(e) => updatePlayer(index, 'name', e.target.value)}
            style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid var(--muted)', background: 'transparent' }}
          />
          <input
            type="number"
            placeholder="Goals"
            value={player.goals}
            onChange={(e) => updatePlayer(index, 'goals', parseInt(e.target.value) || 0)}
            style={{ width: 80, padding: 8, borderRadius: 8, border: '1px solid var(--muted)', background: 'transparent' }}
          />
          <input
            type="number"
            placeholder="Assists"
            value={player.assists}
            onChange={(e) => updatePlayer(index, 'assists', parseInt(e.target.value) || 0)}
            style={{ width: 80, padding: 8, borderRadius: 8, border: '1px solid var(--muted)', background: 'transparent' }}
          />
          <span style={{ fontWeight: 700, minWidth: 60 }}>{player.points} pts</span>
        </div>
      ))}

      <button onClick={addPlayer} style={{ padding: '8px 16px', background: 'linear-gradient(90deg,#00f0ff,#7c3aed)', color: '#021226', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
        Add Player
      </button>

      <h4 style={{ marginTop: 20 }}>Total Points: {totalPoints}</h4>

      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="points" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}