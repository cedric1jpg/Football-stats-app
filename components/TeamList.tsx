import React from 'react'
import { Team } from '../types'

export default function TeamList({ teams }: { teams: Team[] }) {
  if (!teams || teams.length === 0) return <div className="subtitle">No teams yet.</div>

  return (
    <div style={{ marginTop: 12 }}>
      <div className="table" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Team</th>
              <th style={{ padding: 8 }}>Attack</th>
              <th style={{ padding: 8 }}>Defense</th>
              <th style={{ padding: 8 }}>Rating</th>
              <th style={{ padding: 8 }}>Points</th>
              <th style={{ padding: 8 }}>Form</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((t) => (
              <tr key={t.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: 10 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {t.logo ? <img src={t.logo} alt={t.name} width={28} height={28} style={{ borderRadius: 6 }} /> : <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(90deg,#0ff,#7c3aed)' }} />}
                    <div>
                      <div style={{ fontWeight: 700 }}>{t.name}</div>
                      <div className="smallMuted">{t.league}</div>
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>{t.attack ?? '—'}</td>
                <td style={{ textAlign: 'center' }}>{t.defense ?? '—'}</td>
                <td style={{ textAlign: 'center', fontWeight: 800 }}>{t.rating ?? '—'}</td>
                <td style={{ textAlign: 'center' }}>{t.points ?? '—'}</td>
                <td style={{ textAlign: 'center' }}>{t.form ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
