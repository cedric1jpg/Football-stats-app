import React, { useRef } from 'react'
import { TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon } from 'react-share'
import html2canvas from 'html2canvas'

interface ShareButtonProps {
  url: string
  title: string
  description: string
  screenshotRef?: React.RefObject<HTMLElement>
}

export default function ShareButton({ url, title, description, screenshotRef }: ShareButtonProps) {
  const handleScreenshot = async () => {
    if (screenshotRef?.current) {
      const canvas = await html2canvas(screenshotRef.current)
      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = imgData
      link.download = 'football-stats.png'
      link.click()
    }
  }

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <FacebookShareButton url={url}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      {screenshotRef && (
        <button onClick={handleScreenshot} style={{ padding: '8px 12px', background: 'linear-gradient(90deg,#00f0ff,#7c3aed)', color: '#021226', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          📸 Screenshot
        </button>
      )}
    </div>
  )
}