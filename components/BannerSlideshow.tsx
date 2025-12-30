import React, { useState, useEffect } from 'react'

interface BannerSlideshowProps {
  images: string[]
  onError?: () => void
}

export default function BannerSlideshow({ images, onError }: BannerSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!images || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [images])

  if (!images || images.length === 0) return null

  return (
    <div style={{ position: 'relative', width: '100%', height: '300px', overflow: 'hidden', borderRadius: '8px' }}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Team image ${index + 1}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 1s ease-in-out'
          }}
          onError={(e) => {
            // Hide broken images
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      ))}
      {images.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px'
        }}>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentIndex ? '#00f0ff' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                boxShadow: index === currentIndex ? '0 0 10px rgba(0, 240, 255, 0.5)' : 'none'
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}