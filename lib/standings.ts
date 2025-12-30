import { Team } from '../types'

type StandingsPayload = any

export function mapStandingsToTeams(payload: StandingsPayload, opts?: { leagueName?: string; season?: string }): Team[] {
  // Defensive checks
  if (!payload || !Array.isArray(payload.response) || payload.response.length === 0) return []

  // Some API responses nest standings under response[0].league.standings or response[0].league.standings[0]
  const first = payload.response[0]
  let standings: any = (first.league && first.league.standings && first.league.standings[0]) || first.standings || []

  // Some responses may have an extra nesting level (array of arrays). Flatten one level if needed.
  if (Array.isArray(standings) && standings.length > 0 && Array.isArray(standings[0])) {
    standings = standings[0]
  }

  const teams: Team[] = standings.map((row: any, idx: number) => {
    const team = row.team || row
    const played = Number(row.all?.played ?? row.played ?? 0)
    const gf = Number(row.all?.goals?.for ?? row.goalsFor ?? row.gf ?? row.goals_for ?? 0)
    const ga = Number(row.all?.goals?.against ?? row.goalsAgainst ?? row.ga ?? row.goals_against ?? 0)
    const attack = played > 0 ? (gf / played) : 0
    const defense = played > 0 ? (ga / played) : 0

    // Compute a 0-10 rating scaling: higher attack increases, lower defense increases
    // rating = 0-10 approx based on (attack * 6) + ((3 - defense) * 4) scaled
    const rawRating = attack * 6 + (3 - defense) * 4
    const rating = Math.round(Math.max(0, Math.min(10, rawRating)))

    const form = (row.form || '').replace(/,/g, '').toUpperCase()

    return {
      id: Number(team.id ?? (team && team.name ? idx + 1 : idx + 1000)),
      name: String(team.name ?? team.team ?? `Team ${idx + 1}`),
      logo: String(team.logo ?? ''),
      league: opts?.leagueName ?? String(first.league?.name ?? 'Premier League'),
      // store numeric per-match values (one decimal precision)
      attack: Number(attack.toFixed(1)),
      defense: Number(defense.toFixed(1)),
      rating,
      points: Number(row.points ?? row.total ?? 0),
      played: played,
      gf,
      ga,
      goal_diff: gf - ga,
      form: form || undefined,
    } as Team
  })

  return teams
}
