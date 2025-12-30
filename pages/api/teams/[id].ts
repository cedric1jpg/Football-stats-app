import type { NextApiRequest, NextApiResponse } from 'next'
import { getCache, setCache } from '../../../lib/cache'
import type { Team, Player } from '../../../types'
import fs from 'fs'
import path from 'path'

const CACHE_TTL_MS = 1000 * 60 * 60 // 1 hour

function parseId(q: string | string[] | undefined) {
  const s = Array.isArray(q) ? q[0] : q || ''
  const n = parseInt(s, 10)
  return Number.isFinite(n) ? n : null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = parseId(req.query.id)
  const season = String(req.query.season || '2025')
  const league = String(req.query.league || 'all')

  if (!id) return res.status(400).json({ error: 'Invalid team id' })

  const cacheKey = `team:${id}:${league}:${season}`
  try {
    const cached = await getCache(cacheKey)
    if (cached && cached.ts && Date.now() - cached.ts < CACHE_TTL_MS) {
      res.setHeader('x-source', 'cache')
      return res.status(200).json({ source: 'cache', team: cached.team, players: cached.players })
    }

    // Load parsed JSON data
    const clubsPath = path.join(process.cwd(), 'public', 'parsed', 'clubs.json')
    const playersPath = path.join(process.cwd(), 'public', 'parsed', 'players.json')

    let clubs: any[] = []
    let allPlayers: any[] = []

    try {
      clubs = JSON.parse(fs.readFileSync(clubsPath, 'utf8'))
      allPlayers = JSON.parse(fs.readFileSync(playersPath, 'utf8'))
    } catch (e) {
      console.warn('Failed to load parsed data', e)
      return res.status(404).json({ error: 'Team not found' })
    }

    const club = clubs.find((c: any) => Number(c.club_id) === id)
    if (!club) return res.status(404).json({ error: 'Team not found' })

    const teamPlayers = allPlayers.filter((p: any) => p.current_club_id == id && p.season === season)
    const players: Player[] = teamPlayers.map((p: any) => ({
      id: Number(p.player_id),
      name: p.player_name,
      age: Number(p.age) || undefined,
      position: p.position,
      team_id: Number(p.current_club_id),
      season: p.season,
      goals: Number(p.goals) || 0,
      assists: Number(p.assists) || 0,
      played: Number(p.minutes_played) || 0,
      rating: Math.round((Number(p.goals) + Number(p.assists) / 2) / (Number(p.minutes_played) || 1) * 10),
    })).sort((a, b) => b.goals - a.goals).slice(0, 10)

    // Calculate team stats
    const gf = teamPlayers.reduce((sum: number, p: any) => sum + (Number(p.goals) || 0), 0)
    const ga = teamPlayers.reduce((sum: number, p: any) => sum + (Number(p.goals_conceded) || 0), 0)
    const goal_diff = gf - ga

    const fwdMidPlayers = teamPlayers.filter((p: any) => ['Midfielder', 'Forward', 'Attacking Midfield', 'Centre-Forward'].includes(p.position))
    const defGkPlayers = teamPlayers.filter((p: any) => ['Goalkeeper', 'Defender', 'Centre-Back', 'Left-Back', 'Right-Back'].includes(p.position))

    const fwdMidContrib = fwdMidPlayers.reduce((sum: number, p: any) => sum + (Number(p.goals) || 0) + (Number(p.assists) || 0), 0)
    const defGkContrib = defGkPlayers.reduce((sum: number, p: any) => sum + (Number(p.goals_conceded) || 0), 0)

    const numFwdMid = fwdMidPlayers.length || 1
    const numDefGk = defGkPlayers.length || 1

    const attack = (fwdMidContrib / numFwdMid) * 0.7 + goal_diff
    const defense = (defGkContrib / numDefGk) * 0.6 - goal_diff / 2

    const rating = Math.round(Math.max(0, Math.min(10, (attack * 0.6 + (10 - defense) * 0.4))))

    const points = Math.round(rating * 3.8) // Simulate points based on rating

    // Derive formation from player positions
    const positionCounts = teamPlayers.reduce((acc: any, p: any) => {
      const pos = p.position
      if (pos?.includes('Defender') || pos?.includes('Back')) acc.def = (acc.def || 0) + 1
      else if (pos?.includes('Midfielder') || pos?.includes('Midfield')) acc.mid = (acc.mid || 0) + 1
      else if (pos?.includes('Forward') || pos?.includes('Striker')) acc.fwd = (acc.fwd || 0) + 1
      else if (pos?.includes('Goalkeeper')) acc.gk = (acc.gk || 0) + 1
      return acc
    }, {})

    // Default to 4-3-3 if can't determine
    const formation = {
      def: Math.min(positionCounts.def || 4, 5),
      mid: Math.min(positionCounts.mid || 3, 5),
      fwd: Math.min(positionCounts.fwd || 3, 4)
    }

    const team: Team = {
      id: Number(club.club_id),
      name: club.club_name,
      country: club.country_name,
      league: club.competition_name,
      attack: attack.toFixed(1),
      defense: defense.toFixed(1),
      rating,
      total_goals: gf,
      total_played: teamPlayers.length,
      goal_diff,
      points,
      formation,
    }

    await setCache(cacheKey, { team, players, ts: Date.now() }, CACHE_TTL_MS)

    res.setHeader('x-source', 'csv')
    return res.status(200).json({ source: 'csv', team, players })
  } catch (err) {
    console.error('teams/[id] handler error', err)
    return res.status(500).json({ error: 'internal error' })
  }
}

