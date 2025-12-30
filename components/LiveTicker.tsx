import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

interface Match {
  league: string
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  date: string
  finished: boolean
  live?: boolean
  competition?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function LiveTicker() {
  const { data, error } = useSWR('/api/livescores', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true
  })

  const matches = data?.matches || []

  if (error || matches.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.9)',
      border: '1px solid #00f0ff',
      borderRadius: '8px',
      padding: '12px',
      maxWidth: '300px',
      boxShadow: '0 4px 12px rgba(0, 240, 255, 0.3)'
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#00f0ff',
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        🏆 Live Scores
      </div>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {matches.slice(0, 5).map((match: Match, index: number) => (
          <div key={index} style={{
            padding: '8px',
            marginBottom: '4px',
            background: match.live ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            borderRadius: '4px',
            border: match.live ? '1px solid #ff4444' : '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              fontSize: '11px',
              color: '#888',
              marginBottom: '2px'
            }}>
              {match.competition || match.league}
              {match.live && <span style={{ color: '#ff4444', marginLeft: '4px' }}>🔴 LIVE</span>}
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ flex: 1, textAlign: 'left' }}>{match.homeTeam}</span>
              <span style={{
                margin: '0 8px',
                fontSize: '14px',
                color: match.finished ? '#fff' : '#00f0ff'
              }}>
                {match.homeScore !== null ? match.homeScore : '-'} : {match.awayScore !== null ? match.awayScore : '-'}
              </span>
              <span style={{ flex: 1, textAlign: 'right' }}>{match.awayTeam}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}