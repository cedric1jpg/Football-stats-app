import React from 'react'
import { render, screen } from '@testing-library/react'
import TeamList from '../components/TeamList'

const sample = [
  { id: 1, name: 'Arsenal', league: 'Premier League', attack: 2.5, defense: 1.2, rating: 8, goal_diff: 15 },
  { id: 2, name: 'Real Madrid', league: 'La Liga', attack: 2.8, defense: 1.0, rating: 9, goal_diff: 20 },
]

describe('TeamList', () => {
  it('renders teams', () => {
    render(<TeamList teams={sample} />)
    expect(screen.getByText('Arsenal')).toBeInTheDocument()
    expect(screen.getByText('Real Madrid')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(<TeamList teams={[]} />)
    expect(screen.getByText(/No teams yet/i)).toBeInTheDocument()
  })
})
