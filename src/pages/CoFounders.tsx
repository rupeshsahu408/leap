import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import DashNav from '../components/DashNav'

interface Person {
  id: number
  name: string
  bio?: string
  skills?: string[]
  location?: string
  stage?: string
  looking_for?: string[]
  role: string
}

interface Request {
  id: number
  from_name: string
  from_bio?: string
  from_skills?: string[]
  message?: string
}

export default function CoFounders() {
  const { token } = useAuth()
  const [people, setPeople] = useState<Person[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [search, setSearch] = useState('')
  const [connecting, setConnecting] = useState<number | null>(null)
  const [connected, setConnected] = useState<Set<number>>(new Set())
  const [activeTab, setActiveTab] = useState<'discover' | 'requests'>('discover')

  useEffect(() => {
    if (!token) return
    const h = { Authorization: `Bearer ${token}` }
    fetch('/api/cofounders', { headers: h }).then(r => r.json()).then(setPeople).catch(() => {})
    fetch('/api/cofounders/requests', { headers: h }).then(r => r.json()).then(setRequests).catch(() => {})
  }, [token])

  const connect = async (id: number) => {
    setConnecting(id)
    try {
      await fetch('/api/cofounders/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ to_user_id: id, message: 'Hi! I would love to connect and explore collaboration.' })
      })
      setConnected(prev => new Set([...prev, id]))
    } catch { /* ignore */ }
    setConnecting(null)
  }

  const handleRequest = async (id: number, status: 'accepted' | 'rejected') => {
    await fetch(`/api/cofounders/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    })
    setRequests(prev => prev.filter(r => r.id !== id))
  }

  const filtered = people.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.bio?.toLowerCase().includes(search.toLowerCase()) ||
    p.skills?.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
    p.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="dash-layout">
      <DashNav />
      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1 className="dash-title">🤝 Find Co-founders</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Connect with entrepreneurs and builders who share your vision</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: '#ffffff', border: '1px solid var(--border)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {([['discover', 'Discover People'], ['requests', `Requests (${requests.length})`]] as [string, string][]).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab as 'discover' | 'requests')}
              style={{ padding: '8px 20px', borderRadius: 8, background: activeTab === tab ? 'var(--accent)' : 'transparent', color: activeTab === tab ? '#ffffff' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'discover' && (
          <>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, skill, location…"
              style={{ width: '100%', background: '#ffffff', border: '1px solid var(--border-strong)', borderRadius: 10, padding: '12px 18px', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.95rem', marginBottom: 24 }}
            />

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
                <p>No people found. Be the first to complete your profile and get discovered!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {filtered.map(person => (
                  <div key={person.id} style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 16, padding: 24, transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 48, height: 48, background: 'var(--accent)', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                        {person.name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{person.name}</div>
                        {person.location && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>📍 {person.location}</div>}
                      </div>
                      <span style={{ marginLeft: 'auto', background: 'var(--accent-soft)', color: 'var(--text-secondary)', border: '1px solid var(--accent-border)', fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{person.role}</span>
                    </div>

                    {person.bio && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 14 }}>{person.bio.slice(0, 120)}{person.bio.length > 120 ? '…' : ''}</p>}

                    {person.skills && person.skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                        {person.skills.slice(0, 4).map((s, i) => (
                          <span key={i} style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 999, padding: '3px 10px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s}</span>
                        ))}
                      </div>
                    )}

                    {person.stage && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 16 }}>Stage: <strong style={{ color: 'var(--text-primary)' }}>{person.stage}</strong></div>}

                    <button
                      onClick={() => connect(person.id)}
                      disabled={connecting === person.id || connected.has(person.id)}
                      className={connected.has(person.id) ? 'btn-outline' : 'btn-primary'}
                      style={{ width: '100%', padding: '10px', fontSize: '0.85rem', opacity: connecting === person.id ? 0.7 : 1 }}>
                      {connected.has(person.id) ? '✓ Request Sent' : connecting === person.id ? 'Sending…' : 'Connect →'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {requests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
                <p>No pending connection requests yet.</p>
              </div>
            ) : requests.map(req => (
              <div key={req.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, background: 'var(--gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                  {req.from_name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{req.from_name}</div>
                  {req.message && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>"{req.message}"</p>}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => handleRequest(req.id, 'accepted')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Accept</button>
                  <button onClick={() => handleRequest(req.id, 'rejected')} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
