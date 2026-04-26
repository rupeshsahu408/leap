import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import DashNav from '../components/DashNav'

interface Idea {
  id: number
  title: string
  description?: string
  industry?: string
  stage?: string
  ai_feedback?: string
  is_public: boolean
  created_at: string
}

const industries = ['FinTech', 'EdTech', 'HealthTech', 'AgriTech', 'E-Commerce', 'SaaS', 'CleanTech', 'FoodTech', 'Logistics', 'Social', 'Gaming', 'AI/ML', 'Other']
const stages = ['Idea Stage', 'Validation', 'MVP Built', 'Early Revenue', 'Scaling']

export default function Ideas() {
  const { token } = useAuth()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', industry: '', stage: '', is_public: false })
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState<number | null>(null)
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)

  useEffect(() => {
    fetch('/api/ideas/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setIdeas).catch(() => {})
  }, [token])

  const createIdea = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      })
      const idea = await res.json()
      setIdeas(prev => [idea, ...prev])
      setForm({ title: '', description: '', industry: '', stage: '', is_public: false })
      setShowForm(false)
    } catch { /* ignore */ }
    setLoading(false)
  }

  const analyzeWithAI = async (idea: Idea) => {
    setAnalyzing(idea.id)
    try {
      const res = await fetch('/api/ai/analyze-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: idea.title, description: idea.description, industry: idea.industry })
      })
      const data = await res.json()
      if (data.feedback) {
        await fetch(`/api/ideas/${idea.id}/feedback`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ai_feedback: data.feedback })
        })
        setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, ai_feedback: data.feedback } : i))
        setSelectedIdea(prev => prev?.id === idea.id ? { ...prev, ai_feedback: data.feedback } : prev)
      }
    } catch { /* ignore */ }
    setAnalyzing(null)
  }

  const formatFeedback = (text: string) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')

  return (
    <div className="dash-layout">
      <DashNav />
      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1 className="dash-title">💡 My Startup Ideas</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Add your ideas and get AI-powered validation</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(o => !o)}>
            {showForm ? 'Cancel' : '+ Add New Idea'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={createIdea} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, marginBottom: 28 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>New Startup Idea</h3>
            <div className="form-group">
              <label>Idea Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. AI-powered tutor for rural India" required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your idea, target audience, and problem you're solving…" style={{ minHeight: 100 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>Industry</label>
                <select value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}>
                  <option value="">Select industry</option>
                  {industries.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Current Stage</label>
                <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}>
                  <option value="">Select stage</option>
                  {stages.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 20, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={form.is_public} onChange={e => setForm(p => ({ ...p, is_public: e.target.checked }))} />
              Make this idea public (visible to the community)
            </label>
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px 28px' }}>
              {loading ? 'Saving…' : 'Save Idea'}
            </button>
          </form>
        )}

        {/* Idea Modal */}
        {selectedIdea && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={() => setSelectedIdea(null)}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 36, maxWidth: 680, width: '100%', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.3rem' }}>{selectedIdea.title}</h2>
                <button onClick={() => setSelectedIdea(null)} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
              </div>
              {selectedIdea.description && <p style={{ color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.7 }}>{selectedIdea.description}</p>}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                {selectedIdea.industry && <span style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.2)', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 4 }}>{selectedIdea.industry}</span>}
                {selectedIdea.stage && <span style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--cyan)', border: '1px solid rgba(0,212,255,0.2)', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 4 }}>{selectedIdea.stage}</span>}
              </div>

              {selectedIdea.ai_feedback ? (
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>🤖 AI Analysis</h3>
                  <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: formatFeedback(selectedIdea.ai_feedback) }} />
                </div>
              ) : (
                <button onClick={() => analyzeWithAI(selectedIdea)} className="btn-primary" disabled={analyzing === selectedIdea.id}
                  style={{ padding: '12px 24px' }}>
                  {analyzing === selectedIdea.id ? '🤖 Analyzing with AI…' : '🤖 Analyze with AI Advisor'}
                </button>
              )}
            </div>
          </div>
        )}

        {ideas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>💡</div>
            <h3 style={{ fontWeight: 700, marginBottom: 8, color: '#fff' }}>No ideas yet</h3>
            <p>Add your first startup idea and let AI analyze it for you!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {ideas.map(idea => (
              <div key={idea.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(108,99,255,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                onClick={() => setSelectedIdea(idea)}>
                <h3 style={{ fontWeight: 700, marginBottom: 10, fontSize: '1rem' }}>{idea.title}</h3>
                {idea.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 14, lineHeight: 1.6 }}>{idea.description.slice(0, 100)}…</p>}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                  {idea.industry && <span style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.2)', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>{idea.industry}</span>}
                  {idea.stage && <span style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--cyan)', border: '1px solid rgba(0,212,255,0.2)', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>{idea.stage}</span>}
                  {idea.is_public && <span style={{ background: 'rgba(0,255,100,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,100,0.2)', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>Public</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(idea.created_at).toLocaleDateString()}</span>
                  {idea.ai_feedback ? (
                    <span style={{ color: '#00ff88', fontSize: '0.8rem' }}>✓ AI Analyzed</span>
                  ) : (
                    <span style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>Click to analyze →</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
