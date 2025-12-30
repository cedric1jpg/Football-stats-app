import { NextApiRequest, NextApiResponse } from 'next'
import { League } from '../../types'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const competitionsPath = path.join(process.cwd(), 'public', 'parsed', 'competitions.json')
    let competitions: any[] = []

    try {
      competitions = JSON.parse(fs.readFileSync(competitionsPath, 'utf8'))
    } catch (e) {
      console.warn('Failed to load competitions data', e)
      return res.status(200).json({ leagues: [] })
    }

    const leagues: League[] = competitions
      .filter((c: any) => c.type === 'League')
      .slice(0, 50)
      .map((c: any) => ({
        id: Number(c.competition_id),
        name: c.competition_name,
        country: c.country_name || 'Unknown',
        type: 'League' as const,
      }))

    return res.status(200).json({ leagues })
  } catch (err) {
    console.error('leagues handler error', err)
    return res.status(500).json({ error: 'Failed to load leagues' })
  }
}