import React, { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { Tab } from '@headlessui/react'
import Layout from '../../components/Layout'
import ErrorBoundary from '../../components/ErrorBoundary'
import ShareButton from '../../components/ShareButton'
import html2canvas from 'html2canvas'
import NewsFeed from '../../components/NewsFeed'
import Timeline from '../../components/Timeline'
import TransferCarousel from '../../components/TransferCarousel'
import FormationViz from '../../components/FormationViz'
import PlayerCard from '../../components/PlayerCard'
import BannerSection from '../../components/BannerSection'

const TeamRadar = dynamic(() => import('../../components/TeamRadar'), { ssr: false, loading: () => <div>Loading chart...</div> })

import { Player, Team, NewsItem, Fixture, Transfer } from '../../types'

export default function TeamPage() {
  const router = useRouter()
  const { id } = router.query
  const [team, setTeam] = useState<Team | null>(null)
  const [bannerImages, setBannerImages] = useState<string[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/teams/${id}`)
      .then((r) => r.json())
      .then((data) => {
        // API returns { source, team } — normalize
        if (data && data.team) setTeam(data.team)
        else if (data && data.id) setTeam(data)
        else setTeam(null)
      })
      .catch(() => setTeam(null))

    // Fetch banner images
    fetch(`/api/team-banner/${id}`)
      .then((r) => r.json())
      .then((data) => setBannerImages(data.images || []))
      .catch(() => setBannerImages([]))

    // Fetch news
    fetch(`/api/team-news/${id}`)
      .then((r) => r.json())
      .then(setNews)
      .catch(() => setNews([]))

    // Fetch fixtures
    fetch(`/api/fixtures/${id}`)
      .then((r) => r.json())
      .then(setFixtures)
      .catch(() => setFixtures([]))

    // For transfers, mock or fetch from repo
    // Assuming we add to team API or separate
    setTransfers([]) // Placeholder
  }, [id])

  // Removed screenshot banner to avoid duplication

  if (!team) return (
    <Layout>
      <div style={{ padding: 24 }} className="card">
        <div className="subtitle">Loading or team not found.</div>
      </div>
    </Layout>
  )

  return (
    <>
      <Head>
        <title>{team.name} - Football Stats App</title>
        <meta name="description" content={`View stats for ${team.name} in ${team.league}. Rating: ${team.rating}, Attack: ${team.attack}, Defense: ${team.defense}.`} />
        <meta property="og:title" content={`${team.name} Stats`} />
        <meta property="og:description" content={`Explore ${team.name}'s performance in ${team.league}.`} />
        <meta property="og:type" content="website" />
      </Head>
      <Layout>
        <ErrorBoundary>
        <div className="banner-hero" style={{
          background: 'linear-gradient(135deg, #021226 0%, #0a0a0a 100%)',
          padding: '40px 24px',
          textAlign: 'center',
          borderBottom: '2px solid #00f0ff',
          position: 'relative'
        }}>
          <Link href="/" legacyBehavior>
            <a style={{
              position: 'absolute',
              top: 16,
              left: 16,
              color: '#00f0ff',
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: 600,
              zIndex: 10
            }}>
              ← Back to Home
            </a>
          </Link>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
            <BannerSection images={bannerImages} teamName={team.name} />
          </div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            {team.logo && <img src={team.logo} alt={team.name} style={{ width: 80, height: 80, marginBottom: 16 }} />}
            <h1 style={{ color: '#fff', margin: 0, fontSize: '2.5rem' }}>{team.name}</h1>
            <p style={{ color: '#ccc', margin: 0, fontSize: '1.2rem' }}>{team.league}</p>
          </div>
        </div>
        <div ref={cardRef} style={{ padding: 24 }} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ marginTop: 0 }}>{team.name}</h2>
              <div className="muted">{team.league}</div>
            </div>
            <ShareButton
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/teams/${team.id}`}
              title={`${team.name} Stats`}
              description={`Check out ${team.name}'s stats: Rating ${team.rating}, Attack ${team.attack}, Defense ${team.defense}`}
              screenshotRef={cardRef as unknown as import('react').RefObject<HTMLElement>}
            />
          </div>

          <Tab.Group>
            <Tab.List className="tab-neon" style={{ display: 'flex', gap: '8px', marginTop: '24px', borderBottom: '1px solid #00f0ff' }}>
              <Tab className={({ selected }) => `px-4 py-2 ${selected ? 'bg-cyan-500 text-black' : 'text-cyan-400'}`}>Overview</Tab>
              <Tab className={({ selected }) => `px-4 py-2 ${selected ? 'bg-cyan-500 text-black' : 'text-cyan-400'}`}>Squad</Tab>
              <Tab className={({ selected }) => `px-4 py-2 ${selected ? 'bg-cyan-500 text-black' : 'text-cyan-400'}`}>News</Tab>
              <Tab className={({ selected }) => `px-4 py-2 ${selected ? 'bg-cyan-500 text-black' : 'text-cyan-400'}`}>Fixtures</Tab>
              <Tab className={({ selected }) => `px-4 py-2 ${selected ? 'bg-cyan-500 text-black' : 'text-cyan-400'}`}>Transfers</Tab>
            </Tab.List>
            <Tab.Panels style={{ marginTop: '24px' }}>
              <Tab.Panel>
                <div style={{ display: 'flex', gap: 18, marginTop: 18, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 36, fontWeight: 800 }}>{team.rating ?? Math.round(((Number(team.attack) || 75) * 0.6 + (Number(team.defense) || 75) * 0.4)) }</div>
                    <div className="smallMuted">Overall rating</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>Attack</div>
                    <div>{team.attack ?? '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>Defense</div>
                    <div>{team.defense ?? '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>Points</div>
                    <div>{team.points ?? '—'}</div>
                  </div>
                  <div style={{ marginLeft: 12 }}>
                    <TeamRadar attack={Number(team.attack) || 75} defense={Number(team.defense) || 75} rating={team.rating} />
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <Suspense fallback={<div>Loading formation...</div>}>
                  <FormationViz players={team.players || []} formation={team.formation} />
                </Suspense>
                {team.players && team.players.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <h3 style={{ color: '#00f0ff', marginBottom: '16px' }}>Squad Overview</h3>

                    {/* Group players by position */}
                    {['Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map(position => {
                      const positionPlayers = (team.players || []).filter(p => p.position === position)
                      if (positionPlayers.length === 0) return null

                      return (
                        <div key={position} style={{ marginBottom: '32px' }}>
                          <h4 style={{
                            color: '#fff',
                            marginBottom: '12px',
                            textTransform: 'uppercase',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            letterSpacing: '1px'
                          }}>
                            {position}s ({positionPlayers.length})
                          </h4>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '12px'
                          }}>
                            {positionPlayers
                              .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                              .map((player) => (
                                <PlayerCard
                                  key={player.id}
                                  player={player}
                                  onClick={() => {
                                    // Could open a modal with detailed player stats
                                    console.log('Player clicked:', player.name)
                                  }}
                                />
                              ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Tab.Panel>
              <Tab.Panel>
                <NewsFeed news={news} />
              </Tab.Panel>
              <Tab.Panel>
                <Timeline fixtures={fixtures} />
              </Tab.Panel>
              <Tab.Panel>
                <TransferCarousel transfers={transfers} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </ErrorBoundary>
    </Layout>
    </>
  )
}
