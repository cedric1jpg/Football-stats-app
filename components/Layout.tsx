import React, { ReactNode, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useSession } from 'next-auth/react'
import LiveScores from './LiveScores'
import FootballCalendar from './FootballCalendar'
import LiveTicker from './LiveTicker'

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Layout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ id: number; name: string }[]>([])
  const [open, setOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const { theme, setTheme } = useTheme()

  const { data: leaguesData } = useSWR('/api/leagues', fetcher)
  const leagues = leaguesData?.leagues || []

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search not supported in this browser')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setQuery(transcript)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  useEffect(() => {
    // mark mounted to avoid hydration mismatch for theme-dependent UI
    setMounted(true)

    // determine mobile layout on client only
    const updateMobile = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
    updateMobile()
    window.addEventListener('resize', updateMobile)

    // debounce
    if (timer.current) window.clearTimeout(timer.current)
    if (!query) {
      setResults([])
      setOpen(false)
      return
    }
    // small debounce before firing /api/search
    timer.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const payload = await res.json()
        setResults(payload.results || [])
        setOpen(true)
      } catch (err) {
        console.error('search error', err)
        setResults([])
        setOpen(false)
      }
    }, 300)

    return () => {
      if (timer.current) window.clearTimeout(timer.current)
      window.removeEventListener('resize', updateMobile)
    }
  }, [query])

  return (
    <div className="container">
      <header className="header" style={{ alignItems: 'center' }}>
        <div className="logo">FS</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>Football Stats</h2>
          <div style={{ color: 'var(--muted)', fontSize: 12 }}>Lightweight demo — Next.js + TypeScript</div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
           <button
             onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
             style={{
               padding: '8px',
               borderRadius: 8,
               border: '1px solid var(--muted)',
               background: 'transparent',
               cursor: 'pointer',
               color: 'var(--text)',
             }}
             aria-label="Toggle theme"
           >
             {/* avoid rendering theme-dependent emoji until mounted to prevent hydration errors */}
             {mounted ? (theme === 'dark' ? '☀️' : '🌙') : null}
           </button>

           {session && (
             <a href="/dashboard" style={{ color: 'var(--text)', textDecoration: 'none' }}>Dashboard</a>
           )}

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ color: 'var(--muted)', fontSize: 12 }}>League</label>
            <select
              value={searchParams.get('league') || 'all'}
              onChange={(e) => {
                const league = e.target.value
                const season = searchParams.get('season') || '2025'
                router.push(`/?league=${league}&season=${season}`)
              }}
              style={{ padding: '8px', borderRadius: 8, border: '1px solid var(--muted)', background: 'transparent' }}
            >
              <option value="all">All Leagues</option>
              {leagues.map((l: any) => (
                <option key={l.id} value={l.name}>{l.name}</option>
              ))}
            </select>
          </div>

          <div style={{ position: 'relative', minWidth: 220 }}>
            <input
              aria-label="Search teams or players"
              placeholder="Search teams (e.g. Arsenal)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ padding: '8px 40px 8px 10px', borderRadius: 8, border: '1px solid var(--muted)', width: 220 }}
            />
            <button
              onClick={startVoiceSearch}
              disabled={isListening}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isListening ? 'red' : 'var(--text)',
                fontSize: 16,
              }}
              aria-label="Voice search"
            >
              🎤
            </button>
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
                {results.map((r) => (
                  <a
                    key={r.id}
                    href={`/teams/${r.id}`}
                    style={{ display: 'block', padding: '8px 10px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}
                    onClick={() => {
                      setQuery('')
                      setOpen(false)
                    }}
                  >
                    {r.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <FootballCalendar />

      <LiveTicker />

      <div className="card">{children}</div>

      {/* Mobile Bottom Nav */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--card)',
        borderTop: '1px solid var(--muted)',
        padding: '8px 0',
        display: isMobile ? 'flex' : 'none',
        justifyContent: 'space-around',
        zIndex: 100,
      }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: 24 }}>🏆</button>
        <button style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: 24 }}>⚽</button>
        <button style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: 24 }}>🔮</button>
        <button style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: 24 }}>👤</button>
      </nav>

  <footer style={{ marginTop: 18, marginBottom: isMobile ? '60px' : 0 }}>
        <div className="data-source-badge">
          Powered by salimt/football-datasets
        </div>
      </footer>
    </div>
  )
}
