import React, { useState } from 'react'
import BannerSlideshow from './BannerSlideshow'

interface BannerSectionProps {
  images: string[]
  teamName: string
}

export default function BannerSection({ images, teamName }: BannerSectionProps) {
  const [useFallback, setUseFallback] = useState(images.length === 0)

  const handleSlideshowError = () => {
    setUseFallback(true)
  }

  if (useFallback) {
    return <GradientHero teamName={teamName} />
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '300px', overflow: 'hidden', borderRadius: '8px' }}>
      <BannerSlideshow images={images} onError={handleSlideshowError} />
    </div>
  )
}

function GradientHero({ teamName }: { teamName: string }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '300px',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #EC4899 100%)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
        }}>
          {teamName}
        </div>
        <div style={{
          fontSize: '1.2rem',
          opacity: 0.9
        }}>
          StatsFistic - Punch Through Stats
        </div>
      </div>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '50px',
        height: '50px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '15%',
        width: '30px',
        height: '30px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}