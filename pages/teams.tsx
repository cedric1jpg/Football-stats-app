import React, { useState, useRef, useEffect } from 'react'
import useSWRInfinite from 'swr/infinite'
import useSWR from 'swr'
import { useSearchParams } from 'next/navigation'
import Layout from '../components/Layout'
import TeamList from '../components/TeamList'
import FuturisticCard from '../components/FuturisticCard'
import { Team } from '../types'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const PAGE_SIZE = 50

export default function TeamsPage() {
  const searchParams = useSearchParams()
  const league = searchParams.get('league') || 'all'
  const season = searchParams.get('season') || '2025'
  const [query, setQuery] = useState('')

  const { data: leaguesData } = useSWR('/api/leagues', fetcher)
  const leagues = leaguesData?.leagues || []

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && (!previousPageData.teams || previousPageData.teams.length === 0)) return null
    return `/api/teams?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}&offset=${pageIndex * PAGE_SIZE}`
  }

  const { data, error, isLoading, size, setSize } = useSWRInfinite(getKey, fetcher, { revalidateOnFocus: false })

  const teams: Team[] = data ? data.flatMap(d => d.teams || []) : []
  const totalCount = data && data[0] ? data[0].totalCount : 0
  const filtered = teams.filter((t) =>
    `${t.name} ${t.league}`.toLowerCase().includes(query.trim().toLowerCase())
  )

  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && teams.length < totalCount && !isLoading) {
          setSize(size + 1)
        }
      },
      { threshold: 1.0 }
    )
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }
    return () => observer.disconnect()
  }, [teams.length, totalCount, isLoading, size, setSize])

  return (
    <Layout>
      <h2>All Teams</h2>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <input
          className="search"
          placeholder="Search teams..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label className="smallMuted" style={{ marginRight: 6 }}>League</label>
          <select
            value={league}
            onChange={(e) => window.location.href = `/teams?league=${e.target.value}&season=${season}`}
            style={{ padding: 8, borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <option value="all">All Leagues</option>
            {leagues.map((l: any) => (
              <option key={l.id} value={l.name}>{l.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label className="smallMuted" style={{ marginRight: 6 }}>Season</label>
          <select
            value={season}
            onChange={(e) => window.location.href = `/teams?league=${league}&season=${e.target.value}`}
            style={{ padding: 8, borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          {isLoading ? <span className="smallMuted">Loading teams…</span> : null}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Teams</h3>
        <div className="smallMuted">
          Showing {filtered.length} of {totalCount} teams
        </div>
      </div>

      {error ? (
        <div className="card" style={{ padding: 12, marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="subtitle">Error loading teams: {error.message}</div>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      ) : null}

      {!isLoading && teams.length === 0 && !error ? (
        <div className="subtitle" style={{ marginTop: 12 }}>No teams yet.</div>
      ) : null}

      {/* grid of futuristic cards */}
      <div className="grid" style={{ marginTop: 12 }}>
        {filtered.map((t) => (
          <FuturisticCard key={t.id} data={t} type="team" />
        ))}
      </div>

      {teams.length < totalCount && (
        <div ref={loadMoreRef} style={{ height: 20, marginTop: 20 }} />
      )}

      {/* table view for detail */}
      <TeamList teams={filtered} />
    </Layout>
  )
}