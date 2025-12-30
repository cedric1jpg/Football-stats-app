import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background: 'linear-gradient(135deg, #8B5CF6 0%, #00f0ff 100%)',
        padding: '40px 20px',
        borderRadius: 16,
        textAlign: 'center',
        color: '#fff',
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          fontSize: 24,
        }}
      >
        ⚽
      </motion.div>
      <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 900 }}>
        Football Stats
      </h1>
      <p style={{ fontSize: '1.2rem', margin: '10px 0 20px' }}>
        Unlock the Pulse of Football — Live Scores, Team Ratings & More!
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/leagues" legacyBehavior>
          <a
            style={{
              padding: '12px 24px',
              background: '#fff',
              color: '#8B5CF6',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            Explore Leagues
          </a>
        </Link>
        <button
          onClick={() => {
            // Toggle live scores popup or sidebar
            const event = new CustomEvent('toggleLiveScores')
            window.dispatchEvent(event)
          }}
          style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: 8,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Live Now
        </button>
      </div>
    </motion.div>
  )
}