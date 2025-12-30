import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid team ID' })
  }

  try {
    // Mock fixtures data since OpenLigaDB may not have comprehensive data
    // In production, integrate with Football-Data.org fixtures API
    const mockFixtures = [
      {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
        opponent: 'Rival FC',
        score: 'TBD',
        venue: 'home'
      },
      {
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Two weeks
        opponent: 'Away Team',
        score: 'TBD',
        venue: 'away'
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        opponent: 'Previous Opponent',
        score: '2-1',
        venue: 'home'
      },
      {
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        opponent: 'Last Match',
        score: '1-1',
        venue: 'away'
      }
    ]

    // Try to fetch real fixtures from Football-Data.org if available
    try {
      const apiKey = process.env.FOOTBALL_DATA_API_KEY || ''
      if (apiKey) {
        // This would require mapping team IDs to Football-Data.org team IDs
        // For now, return mock data
      }
    } catch (apiError) {
      console.warn('Football-Data.org fixtures API failed, using mock data')
    }

    res.status(200).json(mockFixtures)
  } catch (error) {
    console.error('Error fetching fixtures:', error)
    // Return empty array instead of error to prevent UI breakage
    res.status(200).json([])
  }
}