import { NextApiRequest, NextApiResponse } from 'next'

// Proxy the upstream standings endpoint and return the raw payload for debugging.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const league = String(req.query.league || process.env.API_FOOTBALL_LEAGUE_ID || '39')
  const season = String(req.query.season || process.env.API_FOOTBALL_SEASON || '2025')
  const key = process.env.API_FOOTBALL_KEY

  if (!key) {
    return res.status(400).json({ error: 'API_FOOTBALL_KEY not configured in environment' })
  }

  const url = `https://v3.football.api-sports.io/standings?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`
  try {
    const r = await fetch(url, { headers: { 'x-apisports-key': key, Accept: 'application/json' } })
    const text = await r.text()
    let payload: any = null
    try { payload = JSON.parse(text) } catch (e) { payload = { raw: text } }

    return res.status(r.ok ? 200 : 502).json({ status: r.status, ok: r.ok, url, payload })
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
}
