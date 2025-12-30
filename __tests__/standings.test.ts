import { mapStandingsToTeams } from '../lib/standings'

describe('mapStandingsToTeams', () => {
  it('maps a minimal standings payload into Team[] with numeric attack/defense and rating', () => {
    const payload = {
      response: [
        {
          league: { name: 'Test League' },
          standings: [
            [
              {
                team: { id: 10, name: 'Test FC', logo: '' },
                all: { played: 4, goals: { for: 8, against: 4 } },
                points: 9,
                form: 'WDLW'
              }
            ]
          ]
        }
      ]
    }

  // replicate the selection logic to inspect which 'standings' array is picked
  const first = payload.response[0]
  const selectedStandings = (first.league && (first.league as any).standings && (first.league as any).standings[0]) || first.standings || []
  // log to help debugging in test output
  // eslint-disable-next-line no-console
  console.log('selectedStandings:', JSON.stringify(selectedStandings, null, 2))

  const teams = mapStandingsToTeams(payload as any, { leagueName: 'Test League', season: '2025' })
    expect(Array.isArray(teams)).toBe(true)
    expect(teams).toHaveLength(1)
    const t = teams[0]
    expect(t.id).toBe(10)
    expect(t.name).toBe('Test FC')
    // attack = gf/played = 8/4 = 2.0
    expect(typeof t.attack).toBe('number')
    expect(t.attack).toBeCloseTo(2.0, 1)
    // defense = ga/played = 4/4 = 1.0
    expect(typeof t.defense).toBe('number')
    expect(t.defense).toBeCloseTo(1.0, 1)
    // rating is numeric 0-10
    expect(typeof t.rating).toBe('number')
    expect(t.rating!).toBeGreaterThanOrEqual(0)
    expect(t.rating!).toBeLessThanOrEqual(10)
  })

  it('maps a larger standings payload and preserves gf/ga/points', () => {
    const payload = {
      response: [
        {
          league: {
            name: 'Premier League',
            standings: [
              [
                {
                  team: { id: 1, name: 'Arsenal', logo: '' },
                  points: 80,
                  all: { played: 38, goals: { for: 85, against: 30 } },
                  form: 'WWLWW'
                },
                {
                  team: { id: 2, name: 'Manchester City', logo: '' },
                  points: 78,
                  all: { played: 38, goals: { for: 82, against: 35 } },
                  form: 'WDWWW'
                }
              ]
            ]
          }
        }
      ]
    }

    const teams = mapStandingsToTeams(payload as any, { leagueName: 'Premier League', season: '2025' })
    expect(teams.length).toBeGreaterThanOrEqual(2)
    const a = teams[0]
    expect(a.name).toBe('Arsenal')
    expect(a.points).toBe(80)
    expect(a.gf).toBe(85)
    expect(a.ga).toBe(30)
    // attack/defense are numeric (per updated types)
    expect(typeof a.attack).toBe('number')
    expect(typeof a.defense).toBe('number')
  })
})
