import { NextApiRequest, NextApiResponse } from 'next'
import { Team } from '../../types'
import { getCache, setCache } from '../../lib/cache'
import fs from 'fs'
import path from 'path'

// TTL and cache
const CACHE_TTL_MS = 1000 * 60 * 60 // 1 hour
const globalAny: any = global
if (!globalAny.__teamsCache) globalAny.__teamsCache = { data: null, ts: 0 }

// League code mapping for Football-Data.org
const getLeagueCode = (league: string): string | null => {
  const mappings: { [key: string]: string } = {
    'Premier League': 'PL',
    'Bundesliga': 'BL1',
    'La Liga': 'PD',
    'Serie A': 'SA',
    'Ligue 1': 'FL1',
    'Eredivisie': 'DED',
    'Primeira Liga': 'PPL'
  }
  return mappings[league] || null
}

// Fallback teams
const FALLBACK_TEAMS: Team[] = Array.from({ length: 20 }).map((_, i) => ({
  id: 100 + i,
  name: `Mock Team ${i + 1}`,
  country: 'England',
  league: 'Premier League',
  attack: (1.2 + (i % 10) * 0.1).toFixed(1),
  defense: (1.0 + (i % 9) * 0.08).toFixed(1),
  rating: Math.round(6 + (i % 10) * 0.4),
  total_goals: 60 - i,
  total_played: 38,
  goal_diff: (60 - i) - (40 + i % 10), // Mock goal difference
}))

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const league = String(req.query.league || 'all')
  const season = String(req.query.season || '2025')
  const top = req.query.top === 'true'
  const offset = parseInt(String(req.query.offset || '0'), 10) || 0
  const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : null

  try {
    const now = Date.now()
    const cache = globalAny.__teamsCache
    const cacheKey = `teams:${league}:${season}:${top ? 'top' : 'all'}:${offset}:${limit || 'all'}`
    if (req.query.clear) {
      console.log('[api/teams] manual cache clear requested')
      try {
        await setCache(cacheKey, null)
      } catch (e) {
        console.warn('failed to clear persistent cache', e)
      }
      globalAny.__teamsCache = { data: null, ts: 0 }
    }
    const cached = await getCache(cacheKey)
    if (cached && cached.teams && Date.now() - (cached.ts || 0) < CACHE_TTL_MS) {
      res.setHeader('x-source', 'cache')
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=60')
      return res.status(200).json({ source: 'cache', teams: cached.teams, totalCount: cached.totalCount })
    }

    // Load parsed JSON data
    const clubsPath = path.join(process.cwd(), 'public', 'parsed', 'clubs.json')
    const playersPath = path.join(process.cwd(), 'public', 'parsed', 'players.json')
    const competitionsPath = path.join(process.cwd(), 'public', 'parsed', 'competitions.json')

    let clubs: any[] = []
    let players: any[] = []
    let competitions: any[] = []

    try {
      clubs = JSON.parse(fs.readFileSync(clubsPath, 'utf8'))
      players = JSON.parse(fs.readFileSync(playersPath, 'utf8'))
      competitions = JSON.parse(fs.readFileSync(competitionsPath, 'utf8'))
    } catch (e) {
      console.warn('Failed to load parsed data, returning fallback', e)
      // Provide clearer debug information in the response so we can diagnose
      res.setHeader('x-source', 'parsed-missing')
      const debug = {
        error: String((e && e.message) || e),
        files: {
          clubs: fs.existsSync(clubsPath),
          players: fs.existsSync(playersPath),
          competitions: fs.existsSync(competitionsPath),
        }
      }
      return res.status(200).json({ source: 'fallback', teams: FALLBACK_TEAMS, totalCount: FALLBACK_TEAMS.length, debug })
    }

    // Filter clubs by league and season
    let filteredClubs = clubs
    if (league !== 'all') {
      const comp = competitions.find((c: any) => c.competition_name === league)
      if (comp) {
        filteredClubs = clubs.filter((c: any) => c.competition_id === comp.competition_id)
      }
    }

    // Aggregate team stats from players
    const teamsPromises = filteredClubs.map(async (club: any) => {
      const teamPlayers = players.filter((p: any) => p.current_club_id == club.club_id && p.season === season)
      const gf = teamPlayers.reduce((sum: number, p: any) => sum + (Number(p.goals) || 0), 0)
      const ga = teamPlayers.reduce((sum: number, p: any) => sum + (Number(p.goals_conceded) || 0), 0)
      const goal_diff = gf - ga

      // Position weights
      const fwdMidPlayers = teamPlayers.filter((p: any) => ['Midfielder', 'Forward', 'Attacking Midfield', 'Centre-Forward'].includes(p.position))
      const defGkPlayers = teamPlayers.filter((p: any) => ['Goalkeeper', 'Defender', 'Centre-Back', 'Left-Back', 'Right-Back'].includes(p.position))

      const fwdMidContrib = fwdMidPlayers.reduce((sum: number, p: any) => sum + (Number(p.goals) || 0) + (Number(p.assists) || 0), 0)
      const defGkContrib = defGkPlayers.reduce((sum: number, p: any) => sum + (Number(p.goals_conceded) || 0), 0) // lower better, but we'll invert

      const numFwdMid = fwdMidPlayers.length || 1
      const numDefGk = defGkPlayers.length || 1

      const attack = (fwdMidContrib / numFwdMid) * 0.7 + goal_diff
      const defense = (defGkContrib / numDefGk) * 0.6 - goal_diff / 2

      const rating = Math.round(Math.max(0, Math.min(10, (attack * 0.6 + (10 - defense) * 0.4))))

      // Fetch logo
      let logo = null
      try {
        const logoRes = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/team-logo/${club.club_id}`)
        if (logoRes.ok) {
          const logoData = await logoRes.json()
          logo = logoData.logo
        }
      } catch (e) {
        console.warn('Failed to fetch logo for', club.club_name, e)
      }

      return {
        id: Number(club.club_id),
        name: club.club_name,
        country: club.country_name,
        league: club.competition_name,
        attack: attack.toFixed(1),
        defense: defense.toFixed(1),
        rating,
        total_goals: gf,
        total_played: teamPlayers.length,
        logo,
        goal_diff,
      }
    })

    let teams: Team[] = await Promise.all(teamsPromises)
    teams.sort((a, b) => b.rating - a.rating)

    // Assign points based on ranking (simulating league points)
    teams.forEach((team, index) => {
      team.points = (30 - index * 2) // Decreasing points
    })

    // Merge with Football-Data.org standings if available
    if (league !== 'all') {
      try {
        const leagueCode = getLeagueCode(league)
        if (leagueCode) {
          const standingsRes = await fetch(`https://api.football-data.org/v4/competitions/${leagueCode}/standings`, {
            headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY || '' } // Free tier doesn't require key for basics
          })
          if (standingsRes.ok) {
            const standingsData = await standingsRes.json()
            const apiStandings = standingsData.standings?.[0]?.table || []
            const lastUpdated = new Date(standingsData.competition?.lastUpdated || 0).getTime()

            // Merge if API data is fresher
            if (lastUpdated > now - CACHE_TTL_MS) {
              teams = teams.map(team => {
                const apiTeam = apiStandings.find((t: any) => t.team.name.toLowerCase().includes(team.name.toLowerCase()) || team.name.toLowerCase().includes(t.team.name.toLowerCase()))
                if (apiTeam) {
                  return {
                    ...team,
                    points: apiTeam.points.toString(),
                    rating: Math.round(apiTeam.points / 3), // Rough estimate
                    attack: ((apiTeam.goalsFor / Math.max(apiTeam.playedGames, 1)) * 10).toFixed(1),
                    defense: ((apiTeam.goalsAgainst / Math.max(apiTeam.playedGames, 1)) * -10 + 10).toFixed(1),
                    goal_diff: apiTeam.goalDifference
                  }
                }
                return team
              })
              teams.sort((a, b) => Number(b.points) - Number(a.points))
            }
          }
        }
      } catch (e) {
        console.warn('Failed to fetch Football-Data.org standings', e)
      }
    }

    let finalTeams = teams
    if (top) {
      finalTeams = teams.slice(0, 20)
    } else if (limit) {
      finalTeams = teams.slice(offset, offset + limit)
    }

    if (!teams || teams.length === 0) {
      console.warn('[api/teams] no teams found, returning fallback')
      res.setHeader('x-source', 'fallback')
      return res.status(200).json({ source: 'fallback', teams: FALLBACK_TEAMS, totalCount: FALLBACK_TEAMS.length })
    }

    const lastUpdated = Date.now()
    await setCache(cacheKey, { teams: finalTeams, totalCount: finalTeams.length, ts: lastUpdated }, CACHE_TTL_MS)
    globalAny.__teamsCache = { data: { teams: finalTeams, totalCount: finalTeams.length }, ts: lastUpdated }

    res.setHeader('x-source', 'csv')
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=60')
    return res.status(200).json({ source: 'csv', teams: finalTeams, totalCount: finalTeams.length, lastUpdated })
  } catch (err) {
    console.error('teams handler error', err)
    res.setHeader('x-source', 'error')
    return res.status(200).json({ source: 'fallback', teams: FALLBACK_TEAMS, totalCount: FALLBACK_TEAMS.length })
  }
}
