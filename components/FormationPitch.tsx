import React from 'react'
import { Player } from '../types'

interface FormationPitchProps {
  players: Player[]
  formation?: string
}

export default function FormationPitch({ players, formation = '4-3-3' }: FormationPitchProps) {
  // Parse formation, e.g., "4-3-3" -> [4,3,3]
  const lines = formation.split('-').map(Number)

  // Simple positioning logic
  const positions: { x: number; y: number }[] = []
  let y = 20
  for (const line of lines) {
    const xStep = 100 / (line + 1)
    for (let i = 0; i < line; i++) {
      positions.push({ x: xStep * (i + 1), y })
    }
    y += 20
  }

  return (
    <div className="formation-pitch" style={{ position: 'relative', width: '100%', height: '400px', background: 'green', borderRadius: '8px' }}>
      {/* Pitch lines */}
      <svg width="100%" height="100%" style={{ position: 'absolute' }}>
        <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#fff" strokeWidth="2" />
        <circle cx="50%" cy="50%" r="50" fill="none" stroke="#fff" strokeWidth="2" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#fff" strokeWidth="2" />
      </svg>
      {/* Players */}
      {players.slice(0, positions.length).map((player, index) => {
        const pos = positions[index]
        return (
          <div key={player.id} style={{
            position: 'absolute',
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(0, 240, 255, 0.8)',
            border: '2px solid #00f0ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontSize: '10px',
            fontWeight: 'bold',
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)'
          }}>
            {player.number || index + 1}
          </div>
        )
      })}
    </div>
  )
}