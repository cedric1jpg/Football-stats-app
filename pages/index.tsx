import React, { useState } from 'react'
import useSWR from 'swr'
import { useSearchParams } from 'next/navigation'
import Layout from '../components/Layout'
import TeamList from '../components/TeamList'
import FuturisticCard from '../components/FuturisticCard'
import FantasyCalculator from '../components/FantasyCalculator'
import MatchPredictor from '../components/MatchPredictor'
import LiveScores from '../components/LiveScores'
import SearchAutocomplete from '../components/SearchAutocomplete'
import HeroBanner from '../components/HeroBanner'
import PeriodBanner from '../components/PeriodBanner'
import Link from 'next/link'
import { Team } from '../types'

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url)
    const data = await res.json()

    // If the API returns a very small example array (older exported build),
    // fall back to the shipped static `teams.json` in `public/` which is
    // included in static exports and guaranteed to be present.
    const maybeArray = Array.isArray(data) ? data : (data && data.teams) || []
    if (Array.isArray(maybeArray) && maybeArray.length > 0 && maybeArray.length <= 5) {
      try {
        const fallbackRes = await fetch('/teams.json')
        if (fallbackRes.ok) return { source: 'static', teams: await fallbackRes.json(), totalCount: (await fallbackRes.json()).length }
      } catch (e) {
        // ignore and return API response
      }
    }

    return data
  } catch (e) {
    // If the API call fails entirely (serverless disabled), try static teams.json
    try {
      const fallbackRes = await fetch('/teams.json')
      if (fallbackRes.ok) return { source: 'static', teams: await fallbackRes.json(), totalCount: (await fallbackRes.json()).length }
    } catch (_) {}
    throw e
  }
}

export default function Home() {
  const searchParams = useSearchParams()
  const league = searchParams.get('league') || 'all'
  const season = searchParams.get('season') || '2024'
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('teams')
  const [displayedCount, setDisplayedCount] = useState(20)

  const { data, error, isLoading, mutate } = useSWR(
    `/api/teams?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}&top=true`,
    fetcher,
    { revalidateOnFocus: false }
  )

  const teams: Team[] = data?.teams || []
  const totalCount = data?.totalCount || 0
  const filtered = teams.filter((t) =>
    `${t.name} ${t.league}`.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <Layout>

      <HeroBanner />

      <PeriodBanner />

      <div style={{ marginBottom: 12 }}>
        <Link href="/futuristic" legacyBehavior>
          <a
            style={{
              display: 'inline-block',
              padding: '10px 14px',
              background: 'linear-gradient(90deg,#00f0ff,#7c3aed)',
              color: '#021226',
              borderRadius: 10,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 8px 26px rgba(7,20,42,0.6)'
            }}
          >
            Open futuristic UI
          </a>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid var(--muted)' }}>
        {['teams', 'live-scores', 'fantasy', 'predictor', 'dashboard'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '12px 20px',
              background: tab === t ? 'var(--accent)' : 'transparent',
              color: tab === t ? '#021226' : 'var(--text)',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'teams' && (
        <>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <SearchAutocomplete
          teams={teams}
          onSelect={(team) => window.location.href = `/teams/${team.id}`}
        />
        <input
          className="search"
          placeholder="Filter displayed teams..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 200 }}
        />

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label className="smallMuted" style={{ marginRight: 6 }}>Season</label>
          <select value={season} onChange={(e) => window.location.href = `/?league=${league}&season=${e.target.value}`} style={{ padding: 8, borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.04)' }}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          {isLoading ? <span className="smallMuted">Loading teams…</span> : null}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ marginTop: 0 }}>Top Teams</h3>
        <div className="smallMuted">
          Showing {filtered.length} of {totalCount} teams
        </div>
      </div>

      {error ? (
        <div className="card" style={{ padding: 12, marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="subtitle">Error loading teams: {error.message}</div>
            <button onClick={() => mutate()} style={{ marginLeft: 'auto' }}>Retry</button>
          </div>
        </div>
      ) : null}

      {data?.source === 'fallback' ? (
        <div className="card" style={{ marginTop: 12, padding: 12, borderLeft: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontWeight: 700 }}>Using mock data</div>
            <div className="smallMuted">The app is currently showing fallback teams.</div>
          </div>
        </div>
      ) : null}

      {!isLoading && teams.length === 0 && !error ? (
        <div className="subtitle" style={{ marginTop: 12 }}>No teams yet.</div>
      ) : null}

      {/* grid of futuristic cards */}
      <div className="grid" style={{ marginTop: 12 }}>
        {filtered.slice(0, displayedCount).map((t) => (
          <FuturisticCard key={t.id} data={t} type="team" />
        ))}
      </div>

      {filtered.length > displayedCount && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            onClick={() => setDisplayedCount(prev => prev + 20)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(90deg,#00f0ff,#7c3aed)',
              color: '#021226',
              borderRadius: 10,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Load More Teams
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Link href="/teams" legacyBehavior>
          <a
            style={{
              display: 'inline-block',
              padding: '12px 20px',
              background: 'linear-gradient(90deg,#00f0ff,#7c3aed)',
              color: '#021226',
              borderRadius: 10,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 8px 26px rgba(7,20,42,0.6)'
            }}
          >
            View All Teams
          </a>
        </Link>
      </div>

      {/* table view for detail */}
      <TeamList teams={filtered} />
        </>
      )}

      {tab === 'live-scores' && <LiveScores />}

      {tab === 'fantasy' && <FantasyCalculator />}

      {tab === 'predictor' && <MatchPredictor />}

      {tab === 'dashboard' && (
        <div className="card" style={{ padding: 20 }}>
          <h3>🏠 Your Dashboard</h3>
          <p>Personalized watchlist, favorites, and more. (Coming soon with auth)</p>
        </div>
      )}
    </Layout>
  )
}
