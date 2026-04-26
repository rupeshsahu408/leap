import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import DashNav from '../components/DashNav'

interface Enrollment { id: number; course_name: string; progress: number; enrolled_at: string }

const allCourses = [
  { name: 'Full Stack Marketing', icon: '📈', tag: 'Marketing', duration: '12 Weeks', desc: 'Master growth hacking, SEO, paid ads and brand strategy.' },
  { name: 'Product Management', icon: '💻', tag: 'Product', duration: '10 Weeks', desc: 'Build and launch digital products using agile frameworks.' },
  { name: 'Startup Finance & Fundraising', icon: '💰', tag: 'Finance', duration: '8 Weeks', desc: 'Pitch decks, cap tables, VC landscape and term sheets.' },
  { name: 'UX & Brand Strategy', icon: '🎨', tag: 'Design', duration: '8 Weeks', desc: 'Design thinking, prototyping and brand identity systems.' },
  { name: 'Operations & Scale', icon: '🔗', tag: 'Operations', duration: '6 Weeks', desc: 'Build lean processes and scale startup operations.' },
  { name: 'AI for Entrepreneurs', icon: '🤖', tag: 'AI/Tech', duration: '6 Weeks', desc: 'Leverage AI tools to build and operate faster.' },
]

export default function MyCourses() {
  const { token } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [enrolling, setEnrolling] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/courses/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setEnrollments).catch(() => {})
  }, [token])

  const enroll = async (course_name: string) => {
    setEnrolling(course_name)
    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ course_name })
      })
      const data = await res.json()
      if (data.enrollment) setEnrollments(prev => [...prev, data.enrollment])
      else {
        // Already enrolled — refresh list
        const list = await fetch('/api/courses/my', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
        setEnrollments(list)
      }
    } catch { /* ignore */ }
    setEnrolling(null)
  }

  const updateProgress = async (id: number, progress: number) => {
    await fetch(`/api/courses/${id}/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ progress })
    })
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, progress } : e))
  }

  const enrolledNames = new Set(enrollments.map(e => e.course_name))

  return (
    <div className="dash-layout">
      <DashNav />
      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1 className="dash-title">📚 My Courses</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Enroll and track your learning progress</p>
          </div>
        </div>

        {enrollments.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Enrolled Courses</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {enrollments.map(e => (
                <div key={e.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ fontWeight: 700 }}>{e.course_name}</div>
                    <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem' }}>{e.progress}% Complete</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-dark)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
                    <div style={{ height: '100%', width: `${e.progress}%`, background: 'var(--gradient)', borderRadius: 4, transition: 'width 0.4s' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[0, 25, 50, 75, 100].map(p => (
                      <button key={p} onClick={() => updateProgress(e.id, p)}
                        style={{ padding: '5px 14px', borderRadius: 6, background: e.progress === p ? 'var(--gradient)' : 'var(--bg-dark)', border: `1px solid ${e.progress === p ? 'transparent' : 'var(--border)'}`, color: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>All Programs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {allCourses.map(course => {
            const isEnrolled = enrolledNames.has(course.name)
            return (
              <div key={course.name} style={{ background: 'var(--bg-card)', border: `1px solid ${isEnrolled ? 'rgba(108,99,255,0.4)' : 'var(--border)'}`, borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: '2rem' }}>{course.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{course.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>⏱ {course.duration}</div>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 16 }}>{course.desc}</p>
                {isEnrolled ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00ff88', fontWeight: 600, fontSize: '0.85rem' }}>
                    <span>✓</span> Enrolled
                  </div>
                ) : (
                  <button onClick={() => enroll(course.name)} className="btn-primary" disabled={enrolling === course.name}
                    style={{ padding: '10px 20px', fontSize: '0.85rem', width: '100%', opacity: enrolling === course.name ? 0.7 : 1 }}>
                    {enrolling === course.name ? 'Enrolling…' : 'Enroll Free →'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
