import { NextApiRequest, NextApiResponse } from 'next'

interface CalendarPeriod {
  period: string
  dates: string[]
  alert: boolean
}

const getCurrentPeriod = (): CalendarPeriod => {
  const now = new Date()
  const year = now.getFullYear()

  // Hardcoded 2025 dates
  const periods = [
    {
      period: 'Transfer Window',
      dates: [`${year}-01-01`, `${year}-01-31`],
      alert: now >= new Date(`${year}-01-01`) && now <= new Date(`${year}-01-31`)
    },
    {
      period: 'Transfer Window',
      dates: [`${year}-06-01`, `${year}-06-10`],
      alert: now >= new Date(`${year}-06-01`) && now <= new Date(`${year}-06-10`)
    },
    {
      period: 'International Break',
      dates: [`${year}-03-18`, `${year}-03-26`],
      alert: now >= new Date(`${year}-03-18`) && now <= new Date(`${year}-03-26`)
    },
    {
      period: 'International Break',
      dates: [`${year}-09-03`, `${year}-09-11`],
      alert: now >= new Date(`${year}-09-03`) && now <= new Date(`${year}-09-11`)
    },
    {
      period: 'International Break',
      dates: [`${year}-10-07`, `${year}-10-15`],
      alert: now >= new Date(`${year}-10-07`) && now <= new Date(`${year}-10-15`)
    },
    {
      period: 'International Break',
      dates: [`${year}-11-11`, `${year}-11-19`],
      alert: now >= new Date(`${year}-11-11`) && now <= new Date(`${year}-11-19`)
    },
    {
      period: 'AFCON',
      dates: [`${year + 1}-01-11`, `${year + 1}-02-08`],
      alert: now >= new Date(`${year + 1}-01-11`) && now <= new Date(`${year + 1}-02-08`)
    },
    {
      period: 'World Cup',
      dates: [`${year + 1}-06-11`, `${year + 1}-07-19`],
      alert: now >= new Date(`${year + 1}-06-11`) && now <= new Date(`${year + 1}-07-19`)
    }
  ]

  const current = periods.find(p => p.alert)
  if (current) return current

  return { period: 'Mid-Season', dates: [], alert: false }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const period = getCurrentPeriod()
  res.status(200).json(period)
}