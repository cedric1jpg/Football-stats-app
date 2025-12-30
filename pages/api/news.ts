import type { NextApiRequest, NextApiResponse } from 'next'
import Parser from 'rss-parser'

const parser = new Parser()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const feed = await parser.parseURL('http://feeds.bbci.co.uk/sport/football/rss.xml')
    const items = feed.items.slice(0, 10).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet?.substring(0, 200) + '...',
    }))
    res.status(200).json({ news: items })
  } catch (error) {
    console.error('News fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch news' })
  }
}