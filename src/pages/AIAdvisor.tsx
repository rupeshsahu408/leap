import { useState, useEffect, useRef, FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import DashNav from '../components/DashNav'

interface Message { role: 'user' | 'ai'; text: string; time: string }

const suggestions = [
  'How do I validate my startup idea?',
  'What funding options exist for early-stage startups in India?',
  'How do I find co-founders with the right skills?',
  'What should my pitch deck include?',
  'How does equity split work between co-founders?',
  'Which incubators should I apply to in India?',
]

export default function AIAdvisor() {
  const { token } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: 'Namaste! Main hun aapka LEAP AI Startup Advisor 🚀\n\nMain aapki help kar sakta hun:\n- **Startup idea validate** karne mein\n- **Funding strategy** banana\n- **Co-founder dhundhne** mein\n- **Pitch deck** banana\n- **Indian startup ecosystem** ke baare mein\n\nKya puchna hai aapko?',
      time: new Date().toLocaleTimeString()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load history
    if (!token) return
    fetch('/api/ai/history', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then((history: {message: string; response: string; created_at: string}[]) => {
        if (history.length > 0) {
          const msgs: Message[] = []
          history.forEach(h => {
            msgs.push({ role: 'user', text: h.message, time: new Date(h.created_at).toLocaleTimeString() })
            msgs.push({ role: 'ai', text: h.response, time: new Date(h.created_at).toLocaleTimeString() })
          })
          setMessages(prev => [...prev, ...msgs])
        }
      }).catch(() => {})
  }, [token])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', text, time: new Date().toLocaleTimeString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: text })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.response || data.error, time: new Date().toLocaleTimeString() }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Connection error. Please try again.', time: new Date().toLocaleTimeString() }])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); send(input) }

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="dash-layout">
      <DashNav />
      <main className="dash-main" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <h1 className="dash-title" style={{ marginBottom: 4 }}>🤖 AI Startup Advisor</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Powered by Gemini AI — Ask anything about building your startup</p>
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Try asking:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => send(s)}
                  style={{ background: '#fff', border: '1px solid var(--border-strong)', borderRadius: 999, padding: '8px 14px', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: msg.role === 'ai' ? 'var(--accent)' : 'var(--bg-soft)', border: msg.role === 'ai' ? 'none' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                {msg.role === 'ai' ? '🤖' : '👤'}
              </div>
              <div style={{ maxWidth: '75%' }}>
                <div style={{
                  background: msg.role === 'user' ? 'var(--accent)' : '#ffffff',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                  borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  padding: '14px 18px',
                  color: msg.role === 'user' ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '0.9rem',
                  lineHeight: 1.65
                }} dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.time}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🤖</div>
              <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px', padding: '14px 18px', display: 'flex', gap: 6, alignItems: 'center' }}>
                {[0,1,2].map(j => (
                  <div key={j} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)' }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 32px', borderTop: '1px solid var(--border)', background: '#ffffff' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask your startup question…"
              style={{ flex: 1, background: '#ffffff', border: '1px solid var(--border-strong)', borderRadius: 12, padding: '14px 18px', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.95rem' }}
              disabled={loading}
            />
            <button type="submit" className="btn-primary" disabled={loading || !input.trim()} style={{ padding: '0 24px', minWidth: 80 }}>
              {loading ? '…' : 'Send →'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
