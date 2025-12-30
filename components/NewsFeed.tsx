import React from 'react'
import { NewsItem } from '../types'

interface NewsFeedProps {
  news: NewsItem[]
}

export default function NewsFeed({ news }: NewsFeedProps) {
  return (
    <div className="news-feed">
      {news.length === 0 ? (
        <p>No recent news available.</p>
      ) : (
        news.map((item, index) => (
          <div key={index} className="news-card" style={{
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '12px',
            background: 'rgba(0, 240, 255, 0.05)',
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)'
          }}>
            {item.img && <img src={item.img} alt={item.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />}
            <h4 style={{ margin: '0 0 8px 0', color: '#00f0ff' }}>{item.title}</h4>
            <p style={{ margin: '0 0 8px 0', color: '#ccc' }}>{item.snippet}</p>
            <small style={{ color: '#888' }}>{new Date(item.date).toLocaleDateString()}</small>
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#00f0ff', textDecoration: 'none', marginLeft: '8px' }}>Read more</a>
          </div>
        ))
      )}
    </div>
  )
}