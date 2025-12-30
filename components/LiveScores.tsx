import React from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function LiveScores() {
  const { data } = useSWR('/api/livescores', fetcher, { refreshInterval: 60000 }) // Refresh every minute
  const matches = data?.matches || []

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      background: 'linear-gradient(90deg, #021226, #0a0a0a)',
      borderBottom: '2px solid #00f0ff',
      padding: '10px 16px',
      zIndex: 10,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      boxShadow: '0 2px 10px rgba(0,240,255,0.3)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        <span style={{ fontSize: '18px', color: '#00f0ff' }}>⚽</span>
        <div style={{
          display: 'inline-block',
          animation: 'marquee 25s linear infinite',
          fontWeight: 600,
          color: '#fff'
        }}>
          {matches.length > 0 ? (
            matches.map((m: any, i: number) => (
              <span key={i} style={{ marginRight: 30, fontSize: '14px' }}>
                <span style={{ color: '#7c3aed' }}>{m.league.toUpperCase()}</span>: {m.homeTeam} <span style={{ color: '#00f0ff' }}>{m.homeScore ?? '-'}</span> - <span style={{ color: '#00f0ff' }}>{m.awayScore ?? '-'}</span> {m.awayTeam}
              </span>
            ))
          ) : (
            <span style={{ color: '#ccc' }}>Loading live scores...</span>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}