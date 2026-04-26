import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, Send, RotateCcw, Loader2 } from 'lucide-react'
import { useAuth } from '../lib/auth'
import {
  appendAdvisorMessage,
  clearAdvisorChat,
  subscribeAdvisorMessages,
  type AdvisorMessage,
} from '../lib/advisor'

const SUGGESTIONS = [
  {
    label: 'Validate my idea',
    prompt:
      "I want to validate the idea I'm working on. Ask me one sharp question at a time so we can pressure-test it together.",
  },
  {
    label: 'Draft my one-liner',
    prompt:
      "Help me draft a crisp one-line pitch for what I'm building. Ask me what I need before drafting.",
  },
  {
    label: 'What should I do this week?',
    prompt:
      'Given my stage and what I’m working on, what are the 3 highest-leverage things I should do this week?',
  },
  {
    label: 'How do I find a co-founder?',
    prompt:
      'I’m looking for a co-founder. Walk me through a concrete plan to find the right one in the next 60 days.',
  },
]

export default function Advisor() {
  const { user, profile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const seed: string | undefined = (location.state as { seed?: string } | null)?.seed
  const sentSeedRef = useRef(false)
  const [loaded, setLoaded] = useState(false)
  const [messages, setMessages] = useState<AdvisorMessage[]>([])
  const [text, setText] = useState('')
  const [streaming, setStreaming] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    return subscribeAdvisorMessages(user.uid, (msgs) => {
      setMessages(msgs)
      setLoaded(true)
    })
  }, [user])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length, streaming])

  useEffect(() => {
    if (!seed || sentSeedRef.current || !loaded || !user || busy) return
    sentSeedRef.current = true
    navigate(location.pathname, { replace: true, state: null })
    void send(seed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, loaded, user])

  async function send(rawText: string) {
    const userText = rawText.trim()
    if (!user || !userText || busy) return
    setText('')
    setError('')
    setBusy(true)

    const history = [
      ...messages.map((m) => ({ role: m.role, text: m.text })),
      { role: 'user' as const, text: userText },
    ]

    try {
      await appendAdvisorMessage(user.uid, 'user', userText)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send')
      setBusy(false)
      return
    }

    setStreaming(' ')
    let acc = ''

    try {
      const res = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          profile: profile && {
            displayName: profile.displayName,
            headline: profile.headline,
            stage: profile.stage,
            location: profile.location,
            skills: profile.skills,
            lookingFor: profile.lookingFor,
            bio: profile.bio,
          },
        }),
      })

      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `Server error ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n\n')
        buffer = parts.pop() ?? ''
        for (const part of parts) {
          const line = part.replace(/^data:\s?/, '').trim()
          if (!line) continue
          try {
            const obj = JSON.parse(line)
            if (obj.delta) {
              acc += obj.delta
              setStreaming(acc)
            }
            if (obj.error) throw new Error(obj.error)
          } catch {
            // ignore non-JSON lines
          }
        }
      }

      if (acc) {
        await appendAdvisorMessage(user.uid, 'model', acc)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setStreaming('')
      setBusy(false)
    }
  }

  async function reset() {
    if (!user || busy) return
    if (!confirm('Clear this conversation? This cannot be undone.')) return
    try {
      await clearAdvisorChat(user.uid)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to clear')
    }
  }

  const isEmpty = messages.length === 0 && !streaming

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] md:h-[calc(100vh-6rem)] -mt-6 md:-mt-10">
      <header className="sticky top-0 z-10 bg-[var(--color-bg)]/95 backdrop-blur border-b border-[var(--color-line)] -mx-4 px-4 py-3 flex items-center gap-3">
        <div className="size-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white grid place-items-center shadow-sm">
          <Sparkles className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold leading-tight">AI Advisor</div>
          <div className="text-xs text-zinc-500">
            Personalized for your stage and skills
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={reset}
            disabled={busy}
            className="text-xs text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <RotateCcw className="size-3.5" /> Clear
          </button>
        )}
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-3">
        {isEmpty && (
          <div className="text-center py-8 px-2">
            <div className="size-12 mx-auto rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white grid place-items-center mb-4 shadow-md">
              <Sparkles className="size-6" />
            </div>
            <h2 className="font-display text-2xl">Your AI co-founder advisor</h2>
            <p className="text-sm text-zinc-500 mt-1.5 max-w-md mx-auto">
              Ask anything about your startup — ideas, pitches, fundraising, or
              what to ship next. I tailor every answer to your profile.
            </p>
            <div className="grid sm:grid-cols-2 gap-2 mt-6 max-w-md mx-auto">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => send(s.prompt)}
                  className="text-left text-sm px-4 py-3 rounded-xl bg-white border border-[var(--color-line)] hover:border-brand-300 hover:bg-brand-50/50 transition"
                >
                  <div className="font-medium text-zinc-900">{s.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <Bubble key={m.id} role={m.role} text={m.text} />
        ))}

        {streaming && <Bubble role="model" text={streaming} streaming />}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-[var(--color-bg)] pt-2 pb-2 -mx-4 px-4 border-t border-[var(--color-line)]">
        <div className="flex gap-2 items-end">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(text)
              }
            }}
            placeholder="Ask the advisor anything…"
            rows={1}
            disabled={busy}
            className="flex-1 resize-none px-4 py-2.5 rounded-2xl border border-zinc-200 bg-white text-sm outline-none focus:border-brand-500 max-h-32 disabled:opacity-60"
            maxLength={2000}
          />
          <button
            onClick={() => send(text)}
            disabled={!text.trim() || busy}
            aria-label="Send"
            className="size-11 grid place-items-center rounded-full bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40 transition"
          >
            {busy ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Send className="size-5" />
            )}
          </button>
        </div>
        <div className="text-[10px] text-zinc-400 text-center mt-1.5">
          AI can make mistakes. Verify anything important.
        </div>
      </div>
    </div>
  )
}

function Bubble({
  role,
  text,
  streaming = false,
}: {
  role: 'user' | 'model'
  text: string
  streaming?: boolean
}) {
  const mine = role === 'user'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed ${
          mine
            ? 'bg-brand-500 text-white rounded-br-md'
            : 'bg-white text-zinc-900 border border-[var(--color-line)] rounded-bl-md'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">
          {text || (streaming ? '' : '')}
          {streaming && (
            <span className="inline-block w-1.5 h-4 -mb-0.5 ml-0.5 bg-current opacity-60 animate-pulse rounded-sm" />
          )}
        </div>
      </div>
    </div>
  )
}
