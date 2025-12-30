import React from 'react'
import { Transfer } from '../types'

interface TransferCarouselProps {
  transfers: Transfer[]
}

export default function TransferCarousel({ transfers }: TransferCarouselProps) {
  return (
    <div className="transfer-carousel">
      {transfers.length === 0 ? (
        <p>No recent transfers.</p>
      ) : (
        <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', padding: '8px' }}>
          {transfers.map((transfer, index) => (
            <div key={index} style={{
              minWidth: '250px',
              padding: '16px',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '8px',
              background: 'rgba(0, 240, 255, 0.05)',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 'bold', color: '#00f0ff', marginBottom: '8px' }}>{transfer.player}</div>
              <div style={{ color: transfer.type === 'in' ? '#0f0' : '#f00', fontSize: '0.9rem' }}>
                {transfer.type === 'in' ? '→' : '←'} {transfer.from || transfer.to}
              </div>
              {transfer.fee && <div style={{ color: '#ccc', fontSize: '0.8rem' }}>Fee: {transfer.fee}</div>}
              <div style={{ color: '#888', fontSize: '0.8rem' }}>{new Date(transfer.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}