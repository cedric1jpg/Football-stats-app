import React, { useEffect, useState } from 'react'

type Team = { id: number; name: string; league: string }

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    fetch('/api/teams')
      .then((r) => r.json())
      .then(setTeams)
      .catch(console.error)
  }, [])

  return (
    <main style={{ padding: 24, fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <h1>Football Stats App</h1>
      <p>Example teams from the API:</p>
      <ul>
        {teams.map((t) => (
          <li key={t.id}>{t.name} — {t.league}</li>
        ))}
      </ul>
    </main>
  )
}
