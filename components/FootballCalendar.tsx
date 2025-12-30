import React, { useEffect, useState } from 'react'

interface CalendarPeriod {
  period: string
  dates: string[]
  alert: boolean
}

export default function FootballCalendar() {
  const [period, setPeriod] = useState<CalendarPeriod | null>(null)

  useEffect(() => {
    fetch('/api/calendar')
      .then(r => r.json())
      .then(setPeriod)
      .catch(() => setPeriod(null))
  }, [])

  if (!period || !period.alert) return null

  return (
    <div className="period-banner">
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        {period.period === 'Transfer Window' && '⚽ Transfer Window Open — Hot Rumors!'}
        {period.period === 'International Break' && '🌍 International Break — Club Hiatus'}
        {period.period === 'AFCON' && '🏆 AFCON Ongoing'}
        {period.period === 'World Cup' && '🌟 World Cup Time!'}
        {period.period === 'Mid-Season' && '📈 Mid-Season Form'}
      </div>
    </div>
  )
}