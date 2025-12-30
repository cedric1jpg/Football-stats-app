import React, { useEffect, useState } from 'react'

interface Highlight {
  title: string
  url: string
  thumbnail: string
}

interface HighlightsProps {
  team: string
}

export default function Highlights({ team }: HighlightsProps) {
  const [highlights, setHighlights] = useState<Highlight[]>([])

  useEffect(() => {
    // Mock YouTube RSS fetch - in real app, use rss-parser on YouTube RSS
    // For demo, simulate
    setHighlights([
      { title: `${team} vs Opponent - Highlights`, url: 'https://youtube.com/watch?v=example1', thumbnail: 'https://img.youtube.com/vi/example1/0.jpg' },
      { title: `${team} Best Goals`, url: 'https://youtube.com/watch?v=example2', thumbnail: 'https://img.youtube.com/vi/example2/0.jpg' },
      { title: `${team} Recent Match`, url: 'https://youtube.com/watch?v=example3', thumbnail: 'https://img.youtube.com/vi/example3/0.jpg' }
    ])
  }, [team])

  return (
    <div className="highlights">
      <h3>Latest Highlights</h3>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
        {highlights.map((hl, index) => (
          <div key={index} style={{
            minWidth: '200px',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '8px',
            overflow: 'hidden',
            background: 'rgba(0, 240, 255, 0.05)',
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)'
          }}>
            <img src={hl.thumbnail} alt={hl.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
            <div style={{ padding: '8px' }}>
              <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{hl.title}</div>
              <a href={hl.url} target="_blank" rel="noopener noreferrer" style={{ color: '#00f0ff', textDecoration: 'none' }}>Watch</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}