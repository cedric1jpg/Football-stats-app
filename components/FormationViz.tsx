import React, { useState } from 'react'
import { Player } from '../types'

interface FormationVizProps {
  players: Player[]
  formation?: { def: number; mid: number; fwd: number }
}

export default function FormationViz({ players, formation = { def: 4, mid: 3, fwd: 3 } }: FormationVizProps) {
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null)

  // Generate positions based on formation
  const generatePositions = () => {
    const positions: { x: number; y: number; player?: Player; positionType?: string; initial?: string }[] = []
    const { def, mid, fwd } = formation

    // Goalkeeper
    positions.push({ x: 50, y: 90, initial: 'GK' })

    // Defenders
    const defY = 75
    const defInitials = ['CB', 'LB', 'RB', 'CB', 'LWB', 'RWB'] // Cycle through common defender positions
    for (let i = 0; i < def; i++) {
      positions.push({ x: (100 / (def + 1)) * (i + 1), y: defY, initial: defInitials[i % defInitials.length] })
    }

    // Midfielders
    const midY = 50
    const midInitials = ['CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW'] // Cycle through common midfielder positions
    for (let i = 0; i < mid; i++) {
      positions.push({ x: (100 / (mid + 1)) * (i + 1), y: midY, initial: midInitials[i % midInitials.length] })
    }

    // Forwards
    const fwdY = 25
    const fwdInitials = ['CF', 'LW', 'RW', 'SS', 'ST'] // Cycle through common forward positions
    for (let i = 0; i < fwd; i++) {
      positions.push({ x: (100 / (fwd + 1)) * (i + 1), y: fwdY, initial: fwdInitials[i % fwdInitials.length] })
    }

    return positions
  }

  const positions = generatePositions()

  // Group players by position
  const playersByPosition = {
    Goalkeeper: players.filter(p => p.position === 'Goalkeeper').sort((a, b) => (b.rating || 0) - (a.rating || 0)),
    Defender: players.filter(p => ['Defender', 'Centre-Back', 'Left-Back', 'Right-Back'].includes(p.position || '')).sort((a, b) => (b.rating || 0) - (a.rating || 0)),
    Midfielder: players.filter(p => ['Midfielder', 'Central Midfield', 'Attacking Midfield', 'Defensive Midfield'].includes(p.position || '')).sort((a, b) => (b.rating || 0) - (a.rating || 0)),
    Forward: players.filter(p => ['Forward', 'Centre-Forward', 'Left Winger', 'Right Winger'].includes(p.position || '')).sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  }

  // Assign players to positions based on formation
  positions.forEach((pos, index) => {
    if (index === 0) { // GK
      pos.player = playersByPosition.Goalkeeper[0] || undefined
      pos.positionType = 'Goalkeeper'
    } else if (index <= formation.def) { // Defenders
      pos.player = playersByPosition.Defender[index - 1] || undefined
      pos.positionType = 'Defender'
    } else if (index <= formation.def + formation.mid) { // Midfielders
      pos.player = playersByPosition.Midfielder[index - 1 - formation.def] || undefined
      pos.positionType = 'Midfielder'
    } else { // Forwards
      pos.player = playersByPosition.Forward[index - 1 - formation.def - formation.mid] || undefined
      pos.positionType = 'Forward'
    }
  })

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px', background: '#2d5a27', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Pitch markings */}
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Outer rectangle */}
        <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="#fff" strokeWidth="2" />

        {/* Center line */}
        <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="#fff" strokeWidth="2" />

        {/* Center circle */}
        <circle cx="50%" cy="50%" r="30" fill="none" stroke="#fff" strokeWidth="2" />

        {/* Penalty areas */}
        <rect x="20%" y="5%" width="60%" height="15%" fill="none" stroke="#fff" strokeWidth="2" />
        <rect x="20%" y="80%" width="60%" height="15%" fill="none" stroke="#fff" strokeWidth="2" />

        {/* Goals */}
        <rect x="47%" y="2%" width="6%" height="3%" fill="#fff" />
        <rect x="47%" y="95%" width="6%" height="3%" fill="#fff" />
      </svg>

      {/* Players */}
      {positions.map((pos, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00f0ff, #8B5CF6)',
            border: '3px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontSize: '10px',
            fontWeight: 'bold',
            cursor: pos.player ? 'grab' : 'default',
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
            zIndex: 10
          }}
          draggable={!!pos.player}
          onDragStart={() => setDraggedPlayer(pos.player || null)}
          onDragEnd={() => setDraggedPlayer(null)}
          title={pos.player ? `${pos.player.name} (${pos.player.position})` : `${pos.positionType} position (unassigned)`}
        >
          <div style={{ fontSize: '8px', textAlign: 'center' }}>
            {pos.player ? (
              <>
                <div>{pos.player.number || (index + 1)}</div>
                <div style={{ fontSize: '6px', marginTop: '-2px' }}>
                  {pos.player.name.split(' ').map(n => n[0]).join('.')}
                </div>
              </>
            ) : (
              pos.initial
            )}
          </div>
        </div>
      ))}

      {/* Formation label */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        {formation.def}-{formation.mid}-{formation.fwd}
      </div>
    </div>
  )
}