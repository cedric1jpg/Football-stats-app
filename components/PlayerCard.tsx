import React from 'react'
import { Player } from '../types'

interface PlayerCardProps {
  player: Player
  onClick?: () => void
}

export default function PlayerCard({ player, onClick }: PlayerCardProps) {
  const getPositionColor = (position: string) => {
    if (position?.includes('Goalkeeper')) return '#ff6b6b'
    if (position?.includes('Defender')) return '#4ecdc4'
    if (position?.includes('Midfielder')) return '#45b7d1'
    if (position?.includes('Forward')) return '#f9ca24'
    return '#a4b0be'
  }

  const getRatingColor = (rating?: number) => {
    if (!rating) return '#a4b0be'
    if (rating >= 8) return '#00b894'
    if (rating >= 7) return '#00cec9'
    if (rating >= 6) return '#fdcb6e'
    return '#e17055'
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.1))',
        border: '1px solid rgba(0, 240, 255, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 240, 255, 0.1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 240, 255, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 240, 255, 0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Player Avatar */}
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${getPositionColor(player.position)}, #667eea)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          border: '2px solid rgba(255,255,255,0.3)'
        }}>
          {player.name.charAt(0).toUpperCase()}
        </div>

        {/* Player Info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
            {player.name}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{
              background: getPositionColor(player.position),
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {player.position}
            </span>
            <span style={{ color: '#ccc', fontSize: '14px' }}>
              #{player.number || '—'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#bbb' }}>
            <span>Age: {player.age || '—'}</span>
            <span>Goals: {player.goals}</span>
            <span>Assists: {player.assists}</span>
          </div>
        </div>

        {/* Rating Badge */}
        <div style={{
          background: getRatingColor(player.rating),
          color: '#fff',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          {player.rating ? player.rating.toFixed(1) : '—'}
        </div>
      </div>

      {/* Progress Bars */}
      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#ccc', marginBottom: '4px' }}>
          <span>Goals</span>
          <span>{player.goals}/20</span>
        </div>
        <div style={{
          width: '100%',
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.min((player.goals / 20) * 100, 100)}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #ff6b6b, #feca57)',
            borderRadius: '2px'
          }} />
        </div>
      </div>
    </div>
  )
}