import { NextApiRequest, NextApiResponse } from 'next'
import { getCache, setCache } from '../../../lib/cache'

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 // 24 hours

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid team id' })
  }

  // Use Transfermarkt logo URL
  const logo = `https://tmssl.akamaized.net/images/wappen/head/${id}.png`

  return res.status(200).json({ logo })
}