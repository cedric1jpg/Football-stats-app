import { NextApiRequest, NextApiResponse } from 'next'

const teams = [
  { id: 1, name: 'Arsenal', league: 'Premier League' },
  { id: 2, name: 'Manchester City', league: 'Premier League' },
  { id: 3, name: 'Real Madrid', league: 'La Liga' }
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(teams)
}
