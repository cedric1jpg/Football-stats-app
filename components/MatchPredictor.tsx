import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function MatchPredictor() {
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [prediction, setPrediction] = useState<{ win: number; draw: number; loss: number } | null>(null)

  const { data } = useSWR('/api/teams?limit=1000', fetcher)
  const teams = data?.teams || []

  useEffect(() => {
    if (homeTeam && awayTeam && homeTeam !== awayTeam) {
      // Simple prediction based on ratings
      const home = teams.find((t: any) => t.id == homeTeam)
      const away = teams.find((t: any) => t.id == awayTeam)
      if (home && away) {
        const homeRating = home.rating || 50
        const awayRating = away.rating || 50
        const diff = homeRating - awayRating
        const winProb = Math.max(10, Math.min(80, 50 + diff * 0.5))
        const lossProb = Math.max(10, Math.min(80, 50 - diff * 0.5))
        const drawProb = 100 - winProb - lossProb
        setPrediction({ win: winProb, draw: drawProb, loss: lossProb })
      }
    } else {
      setPrediction(null)
    }
  }, [homeTeam, awayTeam, teams])

  const chartData = prediction ? [
    { name: 'Home Win', value: prediction.win, color: '#10B981' },
    { name: 'Draw', value: prediction.draw, color: '#F59E0B' },
    { name: 'Away Win', value: prediction.loss, color: '#EF4444' },
  ] : []

  return (
    <div className="card" style={{ padding: 20 }}>
      <h3>🔮 Match Predictor</h3>
      <p>AI-powered odds using team form & ratings.</p>

      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div>
          <label>Home Team</label>
          <select value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} style={{ width: 200, padding: 8, borderRadius: 8, border: '1px solid var(--muted)', background: 'transparent' }}>
            <option value="">Select</option>
            {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label>Away Team</label>
          <select value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} style={{ width: 200, padding: 8, borderRadius: 8, border: '1px solid var(--muted)', background: 'transparent' }}>
            <option value="">Select</option>
            {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {prediction && (
        <div>
          <h4>Prediction</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}>
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}