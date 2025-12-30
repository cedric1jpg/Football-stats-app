import { NextApiRequest, NextApiResponse } from 'next'
import { getCache, setCache } from '../../../lib/cache'

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 // 24 hours

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid team ID' })
  }

  try {
    const cacheKey = `banner:${id}`
    const cached = await getCache(cacheKey)
    if (cached && Date.now() - (cached.ts || 0) < CACHE_TTL_MS) {
      return res.status(200).json(cached.data)
    }

    // Fetch team details from TheSportsDB
    const teamResponse = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(id)}`)
    const teamData = await teamResponse.json()

    let team = null
    if (teamData.teams && teamData.teams.length > 0) {
      team = teamData.teams[0]
    }

    const images: string[] = []

    if (team) {
      // Add team badge
      if (team.strTeamBadge) images.push(team.strTeamBadge)
      // Add team jersey
      if (team.strTeamJersey) images.push(team.strTeamJersey)
      // Add team logo
      if (team.strTeamLogo) images.push(team.strTeamLogo)
      // Add fan art
      if (team.strTeamFanart1) images.push(team.strTeamFanart1)
      if (team.strTeamFanart2) images.push(team.strTeamFanart2)
      if (team.strTeamFanart3) images.push(team.strTeamFanart3)
      if (team.strTeamFanart4) images.push(team.strTeamFanart4)
      // Add team banner
      if (team.strTeamBanner) images.push(team.strTeamBanner)

      // Fetch stadium images
      const stadiumName = team.strStadium || team.strStadiumLocation
      if (stadiumName) {
        try {
          const stadiumResponse = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchvenues.php?t=${encodeURIComponent(stadiumName)}`)
          const stadiumData = await stadiumResponse.json()

          if (stadiumData.venues && stadiumData.venues.length > 0) {
            const stadium = stadiumData.venues[0]
            if (stadium.strStadiumThumb) images.push(stadium.strStadiumThumb)
            if (stadium.strStadiumBanner) images.push(stadium.strStadiumBanner)
          }
        } catch (stadiumError) {
          console.warn('Failed to fetch stadium images:', stadiumError)
        }
      }
    }

    // If no images from TheSportsDB, try Unsplash fallback
    if (images.length === 0) {
      try {
        const unsplashKey = process.env.UNSPLASH_ACCESS_KEY
        if (unsplashKey) {
          const stadiumQuery = `${id} stadium aerial 2025`
          const unsplashResponse = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(stadiumQuery)}&per_page=3&orientation=landscape`, {
            headers: { 'Authorization': `Client-ID ${unsplashKey}` }
          })
          const unsplashData = await unsplashResponse.json()

          if (unsplashData.results && unsplashData.results.length > 0) {
            unsplashData.results.forEach((photo: any) => {
              if (photo.urls?.regular) images.push(photo.urls.regular)
            })
          }
        }
      } catch (unsplashError) {
        console.warn('Failed to fetch Unsplash images:', unsplashError)
      }
    }

    // Remove duplicates and filter out null/empty
    const uniqueImages = [...new Set(images.filter(img => img && img.trim()))]

    const result = { images: uniqueImages }
    await setCache(cacheKey, result, CACHE_TTL_MS)
    res.status(200).json(result)
  } catch (error) {
    console.error('Error fetching team images:', error)
    res.status(200).json({ images: [] })
  }
}