import { NextApiRequest, NextApiResponse } from 'next'
import { getCache, setCache } from '../../../../lib/cache'

const CACHE_TTL_MS = 1000 * 60 * 30 // 30 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const season = String(req.query.season || '2025')

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid league ID' })
  }

  const cacheKey = `league-standings:${id}:${season}`
  try {
    const cached = await getCache(cacheKey)
    if (cached && Date.now() - (cached.ts || 0) < CACHE_TTL_MS) {
      return res.status(200).json(cached.data)
    }

    // Try Football-Data.org first for live standings
    const apiKey = process.env.FOOTBALL_DATA_API_KEY || ''
    let standings = []

    if (apiKey) {
      try {
        const response = await fetch(`https://api.football-data.org/v4/competitions/${id}/standings`, {
          headers: { 'X-Auth-Token': apiKey }
        })

        if (response.ok) {
          const data = await response.json()
          standings = data.standings?.[0]?.table || []
        }
      } catch (apiError) {
        console.warn('Football-Data.org API failed:', apiError)
      }
    }

    // If no API data, fall back to CSV data
    if (standings.length === 0) {
      // This would require mapping league IDs to CSV competitions
      // For now, return mock data
      standings = Array.from({ length: 20 }, (_, i) => ({
        position: i + 1,
        team: { name: `Team ${i + 1}`, crest: null },
        playedGames: 10,
        won: Math.floor(Math.random() * 5),
        draw: Math.floor(Math.random() * 3),
        lost: Math.floor(Math.random() * 5),
        points: 30 - i * 2,
        goalsFor: 20 - i,
        goalsAgainst: 15 + i,
        goalDifference: 5 - 2 * i
      }))
    }

    const result = { standings, season, league: id }
    await setCache(cacheKey, result, CACHE_TTL_MS)
    res.status(200).json(result)
  } catch (error) {
    console.error('Error fetching league standings:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}