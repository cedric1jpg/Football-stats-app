import React, { useState, useEffect } from 'react'
import Fuse from 'fuse.js'
import { useDebounce } from '../utils/useDebounce'
import { Team } from '../types'

interface SearchAutocompleteProps {
  teams: Team[]
  onSelect: (team: Team) => void
}

export default function SearchAutocomplete({ teams, onSelect }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Team[]>([])
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      setOpen(false)
      return
    }

    const fuse = new Fuse(teams, {
      keys: ['name', 'league'],
      threshold: 0.3,
    })

    const searchResults = fuse.search(debouncedQuery).map(result => result.item).slice(0, 5)
    setResults(searchResults)
    setOpen(searchResults.length > 0)
  }, [debouncedQuery, teams])

  return (
    <div style={{ position: 'relative', minWidth: 220 }}>
      <input
        aria-label="Search teams or leagues"
        placeholder="Search teams (e.g. Arsenal)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '8px 40px 8px 10px', borderRadius: 8, border: '1px solid var(--muted)', width: 220 }}
      />
      {open && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '36px',
            right: 0,
            left: 0,
            background: 'var(--card)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
            borderRadius: 8,
            zIndex: 40,
            maxHeight: 260,
            overflow: 'auto',
          }}
        >
          {results.map((team) => (
            <div
              key={team.id}
              onClick={() => {
                onSelect(team)
                setQuery('')
                setOpen(false)
              }}
              style={{
                padding: '8px 10px',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSelect(team)
                  setQuery('')
                  setOpen(false)
                }
              }}
            >
              {team.logo && <img src={team.logo} alt={`${team.name} logo`} style={{ width: 24, height: 24 }} />}
              <div>
                <div style={{ fontWeight: 600 }}>{team.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{team.league}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}