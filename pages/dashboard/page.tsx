import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { PieChart, Pie, Cell } from 'recharts'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [pollVotes, setPollVotes] = useState<{ [key: string]: number }>({ 'Best Signing': 0, 'Worst Signing': 0 })

  if (status === 'loading') return <Layout><div>Loading...</div></Layout>
  if (!session) {
    router.push('/')
    return null
  }

  const handleVote = (option: string) => {
    setPollVotes(prev => ({ ...prev, [option]: prev[option] + 1 }))
  }

  const pollData = Object.entries(pollVotes).map(([key, value]) => ({ name: key, value }))

  return (
    <Layout>
      <div style={{ padding: 24 }}>
        <h1>Welcome, {session.user?.name}!</h1>
        <div style={{ marginTop: 24 }}>
          <h2>Your Favorite Teams</h2>
          <p>Favorites stored in localStorage (demo)</p>
          {/* In real app, fetch from DB */}
        </div>
        <div style={{ marginTop: 24 }}>
          <h2>Fan Poll: Best Signing for Your Team?</h2>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <button onClick={() => handleVote('Best Signing')} style={{ padding: '8px 16px', background: '#00f0ff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Best Signing
            </button>
            <button onClick={() => handleVote('Worst Signing')} style={{ padding: '8px 16px', background: '#ff0080', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Worst Signing
            </button>
          </div>
          <PieChart width={400} height={400}>
            <Pie data={pollData} cx={200} cy={200} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
              {pollData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#00f0ff' : '#ff0080'} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
    </Layout>
  )
}