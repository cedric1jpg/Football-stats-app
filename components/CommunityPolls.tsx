import React, { useState } from 'react'

interface Poll {
  question: string
  options: { text: string; votes: number }[]
}

export default function CommunityPolls() {
  const [poll, setPoll] = useState<Poll>({
    question: 'Messi > Ronaldo?',
    options: [
      { text: 'Messi', votes: 45 },
      { text: 'Ronaldo', votes: 55 },
      { text: 'Both legends', votes: 20 },
    ],
  })

  const [voted, setVoted] = useState(false)

  const vote = (index: number) => {
    if (!voted) {
      const newOptions = [...poll.options]
      newOptions[index].votes += 1
      setPoll({ ...poll, options: newOptions })
      setVoted(true)
    }
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0)

  return (
    <div className="card" style={{ padding: 20 }}>
      <h3>🗳️ Community Poll</h3>
      <p>{poll.question}</p>
      {poll.options.map((opt, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <button
            onClick={() => vote(i)}
            disabled={voted}
            style={{
              width: '100%',
              padding: 10,
              background: voted ? '#333' : 'linear-gradient(90deg,#00f0ff,#7c3aed)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: voted ? 'default' : 'pointer',
              textAlign: 'left',
            }}
          >
            {opt.text} ({opt.votes} votes)
          </button>
          {voted && (
            <div style={{ height: 8, background: '#333', borderRadius: 4, marginTop: 4 }}>
              <div
                style={{
                  height: '100%',
                  background: '#8B5CF6',
                  borderRadius: 4,
                  width: `${(opt.votes / totalVotes) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
      ))}
      {voted && <p>Total votes: {totalVotes}</p>}
    </div>
  )
}