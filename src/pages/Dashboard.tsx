import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DashNav from '../components/DashNav'

export default function Dashboard() {
  const { user, token } = useAuth()
  const [enrollments, setEnrollments] = useState<{course_name: string; progress: number; enrolled_at: string}[]>([])
  const [ideas, setIdeas] = useState<{id: number; title: string; industry: string; created_at: string}[]>([])
  const [requests, setRequests] = useState<{id: number; from_name: string; message: string}[]>([])

  useEffect(() => {
    if (!token) return
    const headers = { Authorization: `Bearer ${token}` }
    fetch('/api/courses/my', { headers }).then(r => r.json()).then(setEnrollments).catch(() => {})
    fetch('/api/ideas/my', { headers }).then(r => r.json()).then(setIdeas).catch(() => {})
    fetch('/api/cofounders/requests', { headers }).then(r => r.json()).then(setRequests).catch(() => {})
  }, [token])

  return (
    <div className="dash-layout">
      <DashNav />
      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Here's your startup journey overview</p>
          </div>
          <Link to="/dashboard/ai-advisor" className="btn-primary">Ask AI Advisor →</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { icon: '📚', label: 'Enrolled Courses', value: enrollments.length },
            { icon: '💡', label: 'Startup Ideas', value: ideas.length },
            { icon: '🤝', label: 'Connection Requests', value: requests.length },
            { icon: '🤖', label: 'AI Sessions', value: '∞' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 20px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Quick Actions */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { to: '/dashboard/ai-advisor', icon: '🤖', label: 'Chat with AI Advisor', desc: 'Get startup advice instantly' },
                { to: '/dashboard/ideas', icon: '💡', label: 'Add New Idea', desc: 'Validate your startup idea' },
                { to: '/dashboard/cofounders', icon: '🤝', label: 'Find Co-founders', desc: 'Connect with builders' },
                { to: '/dashboard/courses', icon: '📚', label: 'Enroll in a Course', desc: 'Learn from industry experts' },
              ].map((a, i) => (
                <Link key={i} to={a.to} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: 10, transition: 'all 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(108,99,255,0.4)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                  <span style={{ fontSize: '1.3rem' }}>{a.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.label}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{a.desc}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Completion */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>Your Profile</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 60, height: 60, background: 'var(--gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>
                {user?.name?.[0]}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user?.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user?.email}</div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.2)', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' }}>{user?.role}</span>
                </div>
              </div>
            </div>
            {!user?.bio && (
              <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 10 }}>Complete your profile to get better co-founder matches!</p>
                <Link to="/dashboard/profile" className="btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>Complete Profile →</Link>
              </div>
            )}
            {requests.length > 0 && (
              <div style={{ background: 'rgba(255,180,0,0.08)', border: '1px solid rgba(255,180,0,0.2)', borderRadius: 10, padding: 14 }}>
                <p style={{ fontSize: '0.85rem', color: '#ffd700', fontWeight: 600 }}>🔔 {requests.length} new co-founder connection request{requests.length > 1 ? 's' : ''}!</p>
                <Link to="/dashboard/cofounders" style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>View requests →</Link>
              </div>
            )}
          </div>
        </div>

        {/* My Ideas */}
        {ideas.length > 0 && (
          <div style={{ marginTop: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Recent Startup Ideas</h3>
              <Link to="/dashboard/ideas" style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}>View all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {ideas.slice(0, 3).map((idea) => (
                <div key={idea.id} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6, fontSize: '0.9rem' }}>{idea.title}</div>
                  {idea.industry && <span style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.2)', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>{idea.industry}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enrolled Courses */}
        {enrollments.length > 0 && (
          <div style={{ marginTop: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>My Enrolled Courses</h3>
              <Link to="/dashboard/courses" style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}>Manage →</Link>
            </div>
            {enrollments.map((e) => (
              <div key={e.course_name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.2rem' }}>📚</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 6 }}>{e.course_name}</div>
                  <div style={{ height: 6, background: 'var(--bg-dark)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${e.progress}%`, background: 'var(--gradient)', borderRadius: 3, transition: 'width 0.3s' }} />
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', minWidth: 35 }}>{e.progress}%</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
