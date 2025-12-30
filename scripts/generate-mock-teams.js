const fs = require('fs')
const path = require('path')

// Generate mock teams data with 500+ teams across multiple leagues
const leagues = [
  { id: 'GB1', name: 'Premier League', country: 'England' },
  { id: 'ES1', name: 'La Liga', country: 'Spain' },
  { id: 'IT1', name: 'Serie A', country: 'Italy' },
  { id: 'FR1', name: 'Ligue 1', country: 'France' },
  { id: 'DE1', name: 'Bundesliga', country: 'Germany' },
  { id: 'NL1', name: 'Eredivisie', country: 'Netherlands' },
  { id: 'PT1', name: 'Primeira Liga', country: 'Portugal' },
  { id: 'TR1', name: 'Super Lig', country: 'Turkey' },
  { id: 'BE1', name: 'Jupiler Pro League', country: 'Belgium' },
  { id: 'RU1', name: 'Premier League', country: 'Russia' }
]

const teamData = [
  { name: 'FC Barcelona', logo: 'https://tmssl.akamaized.net/images/wappen/head/131.png' },
  { name: 'Real Madrid', logo: 'https://tmssl.akamaized.net/images/wappen/head/418.png' },
  { name: 'Atletico Madrid', logo: 'https://tmssl.akamaized.net/images/wappen/head/13.png' },
  { name: 'Sevilla FC', logo: 'https://tmssl.akamaized.net/images/wappen/head/368.png' },
  { name: 'Valencia CF', logo: 'https://tmssl.akamaized.net/images/wappen/head/1049.png' },
  { name: 'Manchester United', logo: 'https://tmssl.akamaized.net/images/wappen/head/985.png' },
  { name: 'Manchester City', logo: 'https://tmssl.akamaized.net/images/wappen/head/281.png' },
  { name: 'Liverpool FC', logo: 'https://tmssl.akamaized.net/images/wappen/head/31.png' },
  { name: 'Chelsea FC', logo: 'https://tmssl.akamaized.net/images/wappen/head/631.png' },
  { name: 'Arsenal FC', logo: 'https://tmssl.akamaized.net/images/wappen/head/11.png' },
  { name: 'Tottenham Hotspur', logo: 'https://tmssl.akamaized.net/images/wappen/head/148.png' },
  { name: 'Newcastle United', logo: 'https://tmssl.akamaized.net/images/wappen/head/762.png' },
  { name: 'Aston Villa', logo: 'https://tmssl.akamaized.net/images/wappen/head/405.png' },
  { name: 'West Ham United', logo: 'https://tmssl.akamaized.net/images/wappen/head/379.png' },
  { name: 'Everton FC', logo: 'https://tmssl.akamaized.net/images/wappen/head/29.png' },
  { name: 'Juventus', logo: 'https://tmssl.akamaized.net/images/wappen/head/506.png' },
  { name: 'AC Milan', logo: 'https://tmssl.akamaized.net/images/wappen/head/5.png' },
  { name: 'Inter Milan', logo: 'https://tmssl.akamaized.net/images/wappen/head/46.png' },
  { name: 'AS Roma', logo: 'https://tmssl.akamaized.net/images/wappen/head/12.png' },
  { name: 'Napoli', logo: 'https://tmssl.akamaized.net/images/wappen/head/6195.png' },
  { name: 'PSG', logo: 'https://tmssl.akamaized.net/images/wappen/head/583.png' },
  { name: 'Olympique Marseille', logo: 'https://tmssl.akamaized.net/images/wappen/head/244.png' },
  { name: 'Olympique Lyon', logo: 'https://tmssl.akamaized.net/images/wappen/head/1041.png' },
  { name: 'AS Monaco', logo: 'https://tmssl.akamaized.net/images/wappen/head/162.png' },
  { name: 'Lille OSC', logo: 'https://tmssl.akamaized.net/images/wappen/head/1082.png' },
  { name: 'Bayern Munich', logo: 'https://tmssl.akamaized.net/images/wappen/head/27.png' },
  { name: 'Borussia Dortmund', logo: 'https://tmssl.akamaized.net/images/wappen/head/16.png' },
  { name: 'RB Leipzig', logo: 'https://tmssl.akamaized.net/images/wappen/head/23826.png' },
  { name: 'Bayer Leverkusen', logo: 'https://tmssl.akamaized.net/images/wappen/head/15.png' },
  { name: 'Eintracht Frankfurt', logo: 'https://tmssl.akamaized.net/images/wappen/head/24.png' },
  { name: 'Ajax Amsterdam', logo: 'https://tmssl.akamaized.net/images/wappen/head/610.png' },
  { name: 'PSV Eindhoven', logo: 'https://tmssl.akamaized.net/images/wappen/head/383.png' },
  { name: 'Feyenoord', logo: 'https://tmssl.akamaized.net/images/wappen/head/234.png' },
  { name: 'AZ Alkmaar', logo: 'https://tmssl.akamaized.net/images/wappen/head/1090.png' },
  { name: 'Vitesse', logo: 'https://tmssl.akamaized.net/images/wappen/head/499.png' },
  { name: 'FC Porto', logo: 'https://tmssl.akamaized.net/images/wappen/head/720.png' },
  { name: 'Benfica', logo: 'https://tmssl.akamaized.net/images/wappen/head/294.png' },
  { name: 'Sporting CP', logo: 'https://tmssl.akamaized.net/images/wappen/head/336.png' },
  { name: 'Braga', logo: 'https://tmssl.akamaized.net/images/wappen/head/1075.png' },
  { name: 'Vitoria Guimaraes', logo: 'https://tmssl.akamaized.net/images/wappen/head/2420.png' },
  { name: 'Galatasaray', logo: 'https://tmssl.akamaized.net/images/wappen/head/141.png' },
  { name: 'Fenerbahce', logo: 'https://tmssl.akamaized.net/images/wappen/head/36.png' },
  { name: 'Besiktas', logo: 'https://tmssl.akamaized.net/images/wappen/head/114.png' },
  { name: 'Trabzonspor', logo: 'https://tmssl.akamaized.net/images/wappen/head/449.png' },
  { name: 'Basaksehir', logo: 'https://tmssl.akamaized.net/images/wappen/head/6890.png' },
  { name: 'Club Brugge', logo: 'https://tmssl.akamaized.net/images/wappen/head/2282.png' },
  { name: 'Anderlecht', logo: 'https://tmssl.akamaized.net/images/wappen/head/58.png' },
  { name: 'Standard Liege', logo: 'https://tmssl.akamaized.net/images/wappen/head/3057.png' },
  { name: 'Gent', logo: 'https://tmssl.akamaized.net/images/wappen/head/1570.png' },
  { name: 'Charleroi', logo: 'https://tmssl.akamaized.net/images/wappen/head/1652.png' },
  { name: 'Zenit St Petersburg', logo: 'https://tmssl.akamaized.net/images/wappen/head/964.png' },
  { name: 'Spartak Moscow', logo: 'https://tmssl.akamaized.net/images/wappen/head/232.png' },
  { name: 'CSKA Moscow', logo: 'https://tmssl.akamaized.net/images/wappen/head/2410.png' },
  { name: 'Lokomotiv Moscow', logo: 'https://tmssl.akamaized.net/images/wappen/head/1003.png' },
  { name: 'Krasnodar', logo: 'https://tmssl.akamaized.net/images/wappen/head/2696.png' }
]

const teamNames = teamData.map(t => t.name)

const cities = [
  'Madrid', 'Barcelona', 'London', 'Manchester', 'Liverpool', 'Milan', 'Rome', 'Paris',
  'Munich', 'Amsterdam', 'Porto', 'Lisbon', 'Istanbul', 'Brussels', 'Moscow', 'Berlin',
  'Vienna', 'Prague', 'Warsaw', 'Budapest', 'Athens', 'Bucharest', 'Sofia', 'Belgrade'
]

function generateMockTeams() {
  const teams = []
  let clubId = 1

  leagues.forEach(league => {
    // Use real team names with logos for the first few teams per league
    const realTeamsForLeague = teamData.filter(t => {
      // Simple mapping based on league
      if (league.id === 'GB1') return ['Manchester', 'Liverpool', 'Chelsea', 'Arsenal', 'Tottenham', 'Newcastle', 'Aston Villa', 'West Ham'].some(city => t.name.includes(city))
      if (league.id === 'ES1') return ['Barcelona', 'Real Madrid', 'Atletico', 'Sevilla', 'Valencia'].some(team => t.name.includes(team))
      if (league.id === 'IT1') return ['Juventus', 'AC Milan', 'Inter', 'AS Roma', 'Napoli'].some(team => t.name.includes(team))
      if (league.id === 'FR1') return ['PSG', 'Marseille', 'Lyon', 'Monaco', 'Lille'].some(team => t.name.includes(team))
      if (league.id === 'DE1') return ['Bayern', 'Dortmund', 'Leipzig', 'Leverkusen', 'Frankfurt'].some(team => t.name.includes(team))
      if (league.id === 'NL1') return ['Ajax', 'PSV', 'Feyenoord', 'AZ', 'Vitesse'].some(team => t.name.includes(team))
      if (league.id === 'PT1') return ['Porto', 'Benfica', 'Sporting', 'Braga'].some(team => t.name.includes(team))
      if (league.id === 'TR1') return ['Galatasaray', 'Fenerbahce', 'Besiktas', 'Trabzonspor'].some(team => t.name.includes(team))
      if (league.id === 'BE1') return ['Club Brugge', 'Anderlecht', 'Gent', 'Charleroi'].some(team => t.name.includes(team))
      if (league.id === 'RU1') return ['Zenit', 'Spartak', 'CSKA', 'Lokomotiv', 'Krasnodar'].some(team => t.name.includes(team))
      return false
    })

    // Add real teams first
    realTeamsForLeague.forEach(teamInfo => {
      teams.push({
        club_id: clubId.toString(),
        club_slug: teamInfo.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        club_name: teamInfo.name,
        logo_url: teamInfo.logo,
        country_name: league.country,
        season_id: '2025',
        competition_id: league.id,
        competition_slug: league.name.toLowerCase().replace(/\s+/g, '-'),
        competition_name: league.name,
        club_division: '1',
        source_url: ''
      })
      clubId++
    })

    // Generate additional mock teams
    const numAdditionalTeams = Math.floor(Math.random() * 11) + 15 // 15-25 additional teams
    for (let i = 0; i < numAdditionalTeams; i++) {
      const teamName = teamNames[Math.floor(Math.random() * teamNames.length)]
      const city = cities[Math.floor(Math.random() * cities.length)]
      const fullName = Math.random() > 0.5 ? `${city} ${teamName}` : teamName

      teams.push({
        club_id: clubId.toString(),
        club_slug: fullName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        club_name: fullName,
        logo_url: '',
        country_name: league.country,
        season_id: '2025',
        competition_id: league.id,
        competition_slug: league.name.toLowerCase().replace(/\s+/g, '-'),
        competition_name: league.name,
        club_division: '1',
        source_url: ''
      })

      clubId++
    }
  })

  return teams
}

function generateMockPlayers(teams) {
  const players = []
  let playerId = 1

  const firstNames = ['John', 'Michael', 'David', 'James', 'Robert', 'William', 'Christopher', 'Daniel', 'Matthew', 'Joseph']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']

  teams.forEach(team => {
    // Generate 20-25 players per team
    const numPlayers = Math.floor(Math.random() * 6) + 20

    for (let i = 0; i < numPlayers; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const fullName = `${firstName} ${lastName}`

      const position = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'][Math.floor(Math.random() * 4)]
      const baseRating = position === 'Goalkeeper' ? 6.5 :
                        position === 'Defender' ? 7.0 :
                        position === 'Midfielder' ? 7.5 : 8.0
      const rating = Math.round((baseRating + Math.random() * 2) * 10) / 10 // 6.5-8.5 range

      players.push({
        player_id: playerId.toString(),
        player_name: fullName,
        age: (Math.floor(Math.random() * 20) + 18).toString(), // 18-37
        position: position,
        current_club_id: team.club_id,
        season: '2025',
        goals: Math.floor(Math.random() * 20).toString(),
        assists: Math.floor(Math.random() * 15).toString(),
        minutes_played: (Math.floor(Math.random() * 3000) + 500).toString(),
        goals_conceded: Math.random() > 0.7 ? Math.floor(Math.random() * 30).toString() : '0',
        rating: rating
      })

      playerId++
    }
  })

  return players
}

// Generate data
const teams = generateMockTeams()
const players = generateMockPlayers(teams)

// Write to files
fs.writeFileSync(path.join(__dirname, '..', 'public', 'parsed', 'clubs.json'), JSON.stringify(teams, null, 2))
fs.writeFileSync(path.join(__dirname, '..', 'public', 'parsed', 'players.json'), JSON.stringify(players, null, 2))

// Generate competitions data
const competitions = leagues.map(league => ({
  competition_id: league.id,
  competition_name: league.name,
  country_name: league.country,
  type: 'League'
}))

fs.writeFileSync(path.join(__dirname, '..', 'public', 'parsed', 'competitions.json'), JSON.stringify(competitions, null, 2))

console.log(`Generated ${teams.length} teams and ${players.length} players`)
console.log('Data written to public/parsed/ directory')