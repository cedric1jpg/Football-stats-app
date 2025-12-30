import React from 'react'
import { motion } from 'framer-motion'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PeriodBanner() {
  const { data } = useSWR('/api/calendar', fetcher)
  const period = data?.period || 'regular'

  const variants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity },
    },
    scale: {
      scale: [1, 1.1, 1],
      transition: { duration: 1, repeat: Infinity },
    },
  }

  if (period === 'international-break') {
    return (
      <motion.div
        variants={variants}
        animate="pulse"
        style={{
          background: 'linear-gradient(90deg, #00f0ff, #7c3aed)',
          color: '#021226',
          padding: '12px 20px',
          borderRadius: 10,
          textAlign: 'center',
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        🌍 International Break — Club Hiatus 🌍
      </motion.div>
    )
  }

  if (period === 'transfer-window') {
    return (
      <motion.div
        variants={variants}
        animate="scale"
        style={{
          background: 'linear-gradient(90deg, #ff6b6b, #ffa500)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 10,
          textAlign: 'center',
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        ⚽ Transfer Window Open — Rumors Flying! ⚽
      </motion.div>
    )
  }

  return null
}