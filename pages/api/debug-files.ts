import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const parsedDir = path.join(process.cwd(), 'public', 'parsed')
  const result: any = { exists: fs.existsSync(parsedDir), files: {} }

  if (result.exists) {
    try {
      const names = fs.readdirSync(parsedDir)
      names.forEach((n) => {
        const p = path.join(parsedDir, n)
        try {
          const stat = fs.statSync(p)
          result.files[n] = { size: stat.size, isFile: stat.isFile() }
        } catch (e) {
          result.files[n] = { error: String((e && e.message) || e) }
        }
      })
    } catch (e) {
      result.error = String((e && e.message) || e)
    }
  }

  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=5')
  return res.status(200).json(result)
}
