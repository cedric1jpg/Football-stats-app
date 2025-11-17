import React from 'react'

type Team = { id: number; name: string; league: string }

export default function TeamList({ teams }: { teams: Team[] }) {
  if (!teams || teams.length === 0) return <div className="subtitle">No teams yet.</div>

  return (
    <div className="grid" style={{ marginTop: 12 }}>
      {teams.map((t) => (
        <div className="team-card" key={t.id}>
          <div className="team-name">{t.name}</div>
          <div className="team-league">{t.league}</div>
        </div>
      ))}
    </div>
  )
}
