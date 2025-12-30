import type { NextApiRequest, NextApiResponse } from 'next'
import { getCache, setCache } from '../../lib/cache'

const CACHE_TTL_MS = 1000 * 60 * 5 // 5 minutes for live scores

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cacheKey = 'live-scores'
  try {
    const cached = await getCache(cacheKey)
    if (cached && Date.now() - (cached.ts || 0) < CACHE_TTL_MS) {
      return res.status(200).json(cached.data)
    }

    const matches = []

    // Fetch international friendlies from API-Football
    const apiKey = process.env.FOOTBALL_DATA_API_KEY || ''
    if (apiKey) {
      try {
        const today = new Date().toISOString().split('T')[0]
        const response = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${today}&dateTo=${today}`, {
          headers: { 'X-Auth-Token': apiKey }
        })

        if (response.ok) {
          const data = await response.json()
          const internationals = data.matches
            .filter((match: any) => match.competition.type === 'INTERNATIONAL' || match.competition.name.includes('Friendly'))
            .slice(0, 5)
            .map((match: any) => ({
              league: 'International',
              homeTeam: match.homeTeam.name,
              awayTeam: match.awayTeam.name,
              homeScore: match.score.fullTime?.home ?? null,
              awayScore: match.score.fullTime?.away ?? null,
              date: match.utcDate,
              finished: match.status === 'FINISHED',
              live: match.status === 'IN_PLAY',
              competition: match.competition.name
            }))
          matches.push(...internationals)
        }
      } catch (apiError) {
        console.warn('API-Football internationals failed:', apiError)
      }
    }

    // Fallback: Fetch from OpenLigaDB for top leagues
    if (matches.length === 0) {
      const leagues = ['bl1', 'pl', 'pd', 'sa', 'fl1'] // Bundesliga, Premier, La Liga, Serie A, Ligue 1
      const currentYear = new Date().getFullYear()

      for (const league of leagues) {
        try {
          const response = await fetch(`https://www.openligadb.de/api/getmatchdata/${league}/${currentYear}`)
          if (response.ok) {
            const data = await response.json()
            // Get last 5 matches
            const recent = data.slice(-5).map((match: any) => ({
              league: league.toUpperCase(),
              homeTeam: match.team1.teamName,
              awayTeam: match.team2.teamName,
              homeScore: match.matchResults?.[0]?.pointsTeam1 || null,
              awayScore: match.matchResults?.[0]?.pointsTeam2 || null,
              date: match.matchDateTime,
              finished: match.matchIsFinished,
              live: false,
              competition: league.toUpperCase()
            }))
            matches.push(...recent)
          }
        } catch (err) {
          console.error(`Error fetching ${league}:`, err)
        }
      }
    }

    // Sort by date, most recent first
    matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const result = { matches: matches.slice(0, 10) }
    await setCache(cacheKey, result, CACHE_TTL_MS)
    res.status(200).json(result)
  } catch (error) {
    console.error('Live scores error:', error)
    res.status(500).json({ error: 'Failed to fetch live scores' })
  }
}