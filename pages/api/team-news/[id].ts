import { NextApiRequest, NextApiResponse } from 'next'
import { getCache, setCache } from '../../../lib/cache'

const CACHE_TTL_MS = 1000 * 60 * 30 // 30 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid team ID' })
  }

  try {
    const cacheKey = `news:${id}`
    const cached = await getCache(cacheKey)
    if (cached && Date.now() - (cached.ts || 0) < CACHE_TTL_MS) {
      res.setHeader('x-source', 'cache')
      return res.status(200).json(cached.data)
    }

    // Use NewsAPI for up-to-date news
    const apiKey = process.env.NEWSAPI_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'NewsAPI key not configured' })
    }

    const query = `${id} football OR ${id} soccer`
    const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&apiKey=${apiKey}`)
    const data = await response.json()

    if (data.status !== 'ok') {
      return res.status(500).json({ error: 'NewsAPI error' })
    }

    const newsItems = data.articles.slice(0, 5).map((article: any) => ({
      title: article.title,
      snippet: article.description || '',
      url: article.url,
      date: article.publishedAt,
      img: article.urlToImage || null
    }))

    await setCache(cacheKey, newsItems, CACHE_TTL_MS)
    res.setHeader('x-source', 'api')
    res.status(200).json(newsItems)
  } catch (error) {
    console.error('Error fetching team news:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}