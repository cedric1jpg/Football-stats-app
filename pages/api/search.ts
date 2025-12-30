import { NextApiRequest, NextApiResponse } from 'next'
import Fuse from 'fuse.js'

type SearchResult = {
  id: number
  name: string
  logo?: string
  league?: string
}

// Fuzzy search endpoint using Fuse.js for better matching
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = String(req.query.q || '').trim()
  if (!q) return res.status(200).json({ results: [] })

  try {
    // Try to use cached teams from the local server instance
    const globalAny: any = global
    const cache = globalAny.__teamsCache
    if (cache && Array.isArray(cache.data?.teams)) {
      const teams = cache.data.teams

      // Set up Fuse.js for fuzzy search
      const fuse = new Fuse(teams, {
        keys: ['name', 'league'],
        threshold: 0.3, // Lower = more strict, higher = more fuzzy
        includeScore: true
      })

      const searchResults = fuse.search(q).slice(0, 10)
      const results: SearchResult[] = searchResults.map(result => {
        const item = result.item as any
        return {
          id: item.id,
          name: item.name,
          logo: item.logo,
          league: item.league
        }
      })

      return res.status(200).json({ results })
    }

    // Fallback: try API-Football if available
    const key = process.env.API_FOOTBALL_KEY
    if (key) {
      const url = `https://v3.football.api-sports.io/teams?search=${encodeURIComponent(q)}`
      const r = await fetch(url, { headers: { 'x-apisports-key': key, Accept: 'application/json' } })
      if (!r.ok) {
        const txt = await r.text().catch(() => '')
        console.error('search proxy error', r.status, txt)
        return res.status(200).json({ results: [] })
      }
      const payload = await r.json()
      const results: SearchResult[] = (payload.response || []).map((item: any) => ({
        id: item.team?.id ?? 0,
        name: item.team?.name ?? 'Unknown',
        logo: item.team?.logo ?? undefined,
        league: item.league?.name ?? undefined,
      }))
      return res.status(200).json({ results })
    }

    return res.status(200).json({ results: [] })
  } catch (err) {
    console.error('search handler error', err)
    return res.status(500).json({ error: 'search failed' })
  }
}
