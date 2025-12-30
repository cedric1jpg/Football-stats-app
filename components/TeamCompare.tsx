import React, { useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function TeamCompare() {
  const [team1, setTeam1] = useState('')
  const [team2, setTeam2] = useState('')

  const { data } = useSWR('/api/teams?limit=1000', fetcher)
  const teams = data?.teams || []

  const t1 = teams.find((t: any) => t.id == team1)
  const t2 = teams.find((t: any) => t.id == team2)

  const data1 = t1 ? [
    { subject: 'Attack', A: t1.attack || 0, B: 0 },
    { subject: 'Defense', A: t1.defense || 0, B: 0 },
    { subject: 'Rating', A: t1.rating || 0, B: 0 },
  ] : []

  const data2 = t2 ? [
    { subject: 'Attack', A: 0, B: t2.attack || 0 },
    { subject: 'Defense', A: 0, B: t2.defense || 0 },
    { subject: 'Rating', A: 0, B: t2.rating || 0 },
  ] : []

  return (
    <div className="card" style={{ padding: 20 }}>
      <h3>⚖️ Team Comparison</h3>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div>
          <label>Team 1</label>
          <select value={team1} onChange={(e) => setTeam1(e.target.value)} style={{ width: 200, padding: 8, borderRadius: 8, border: '1px solid var(--muted)', background: 'transparent' }}>
            <option value="">Select</option>
            {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label>Team 2</label>
          <select value={team2} onChange={(e) => setTeam2(e.target.value)} style={{ width: 200, padding: 8, borderRadius: 8, border: '1px solid var(--muted)', background: 'transparent' }}>
            <option value="">Select</option>
            {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {t1 && t2 && (
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar name={t1.name} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Radar name={t2.name} dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}