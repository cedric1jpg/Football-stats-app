import React from 'react'
import { Fixture } from '../types'

interface TimelineProps {
  fixtures: Fixture[]
}

export default function Timeline({ fixtures }: TimelineProps) {
  // defensive: ensure fixtures is an array
  const list = Array.isArray(fixtures) ? fixtures : []

  return (
    <div className="timeline">
      {list.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#888',
          fontStyle: 'italic'
        }}>
          <p>No fixtures available at the moment.</p>
          <p>Check back later for upcoming matches.</p>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {list.map((fixture, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
              padding: '12px',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '8px',
              background: 'rgba(0, 240, 255, 0.05)',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#00f0ff' }}>{fixture.opponent}</div>
                <div style={{ color: '#ccc' }}>{new Date(fixture.date).toLocaleDateString()} - {fixture.venue === 'home' ? 'Home' : 'Away'}</div>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: fixture.score === 'TBD' ? '#888' : '#fff' }}>
                {fixture.score}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}