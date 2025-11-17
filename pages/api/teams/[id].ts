import { NextApiRequest, NextApiResponse } from 'next'

const teams = [
  { id: 1, name: 'Arsenal', league: 'Premier League', rating: 89, attack: 88, defense: 84 },
  { id: 2, name: 'Manchester City', league: 'Premier League', rating: 93, attack: 92, defense: 90 },
  { id: 3, name: 'Real Madrid', league: 'La Liga', rating: 91, attack: 90, defense: 86 }
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const num = parseInt(Array.isArray(id) ? id[0] : (id || ''), 10)
  const team = teams.find((t) => t.id === num)
  if (!team) return res.status(404).json({ error: 'Team not found' })
  res.status(200).json(team)
}
