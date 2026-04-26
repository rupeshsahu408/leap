import { useState, FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import DashNav from '../components/DashNav'

const skillOptions = ['Marketing', 'Product', 'Tech/Engineering', 'Sales', 'Finance', 'Design', 'Operations', 'AI/ML', 'Content', 'Legal', 'HR', 'Business Dev']
const stageOptions = ['Idea Stage', 'Validation', 'MVP Built', 'Early Revenue', 'Scaling', 'Looking to join a startup']
const lookingFor = ['Co-founder', 'Mentor', 'Investor', 'Collaborator', 'Team member', 'Advisor']

export default function Profile() {
  const { user, token, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [location, setLocation] = useState(user?.location || '')
  const [linkedin, setLinkedin] = useState('')
  const [stage, setStage] = useState(user?.stage || '')
  const [skills, setSkills] = useState<string[]>(user?.skills || [])
  const [looking, setLooking] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggleSkill = (s: string) => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  const toggleLooking = (s: string) => setLooking(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, bio, skills, location, linkedin, stage, looking_for: looking })
      })
      const updated = await res.json()
      updateUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { /* ignore */ }
    setSaving(false)
  }

  return (
    <div className="dash-layout">
      <DashNav />
      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1 className="dash-title">👤 My Profile</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Complete your profile to get better co-founder matches</p>
          </div>
          {saved && <div style={{ background: 'rgba(0,255,100,0.1)', border: '1px solid rgba(0,255,100,0.3)', borderRadius: 8, padding: '10px 20px', color: '#00ff88', fontWeight: 600 }}>✓ Profile saved!</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 28 }}>
          {/* Avatar card */}
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
              <div style={{ width: 88, height: 88, background: 'var(--gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '2rem', margin: '0 auto 16px' }}>
                {user?.name?.[0]}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{user?.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>{user?.email}</div>
              <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent-border)', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: 4, textTransform: 'uppercase' }}>{user?.role}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={save} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Mumbai, India" />
              </div>
            </div>

            <div className="form-group">
              <label>Bio / About You</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell other entrepreneurs who you are, what you're building, and what excites you…" style={{ minHeight: 100 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>LinkedIn URL</label>
                <input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="linkedin.com/in/yourname" />
              </div>
              <div className="form-group">
                <label>Current Stage</label>
                <select value={stage} onChange={e => setStage(e.target.value)}>
                  <option value="">Select stage</option>
                  {stageOptions.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Your Skills (select all that apply)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {skillOptions.map(s => (
                  <button type="button" key={s} onClick={() => toggleSkill(s)}
                    style={{ padding: '7px 14px', borderRadius: 999, background: skills.includes(s) ? 'var(--accent)' : '#ffffff', border: `1px solid ${skills.includes(s) ? 'var(--accent)' : 'var(--border-strong)'}`, color: skills.includes(s) ? '#ffffff' : 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s', fontWeight: 600 }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Looking For</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {lookingFor.map(s => (
                  <button type="button" key={s} onClick={() => toggleLooking(s)}
                    style={{ padding: '7px 14px', borderRadius: 20, background: looking.includes(s) ? 'rgba(0,212,255,0.2)' : 'var(--bg-dark)', border: `1px solid ${looking.includes(s) ? 'var(--cyan)' : 'var(--border)'}`, color: looking.includes(s) ? 'var(--cyan)' : 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '13px 32px', fontSize: '0.95rem' }}>
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
