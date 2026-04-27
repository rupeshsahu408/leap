import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { type FeedbackKind, FEEDBACK_KINDS, createFeedback } from '../lib/feedback'

export default function FeedbackNew() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [kind, setKind] = useState<FeedbackKind>('idea')
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [description, setDescription] = useState('')
  const [ask, setAsk] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!user || !profile) return
    if (!title.trim() || !ask.trim()) {
      setError('Title and ask are both required.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const id = await createFeedback({
        kind,
        title,
        description,
        ask,
        link: link.trim() || undefined,
        authorId: user.uid,
        authorName: profile.displayName || 'Founder',
        authorPhotoURL: profile.photoURL,
      })
      navigate(`/feedback/${id}`, { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="px-4 md:px-0 pt-5 md:pt-0 pb-10 space-y-5">
      <Link to="/feedback" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="size-4" /> Back to feedback
      </Link>

      <div>
        <h1 className="font-display text-3xl">Ask for feedback</h1>
        <p className="text-zinc-500 mt-1 text-[15px]">
          Be specific about what kind of help you want — vague asks get vague replies.
        </p>
      </div>

      <Field label="What are you sharing?">
        <div className="grid sm:grid-cols-3 gap-2">
          {FEEDBACK_KINDS.map((k) => (
            <button
              key={k.kind}
              onClick={() => setKind(k.kind)}
              className={`text-left rounded-2xl border p-4 transition ${
                kind === k.kind
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'
              }`}
            >
              <div className="text-2xl">{k.emoji}</div>
              <div className="font-semibold text-sm mt-2">{k.label}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{k.blurb}</div>
            </button>
          ))}
        </div>
      </Field>

      <Field label="Title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={
            kind === 'idea' ? 'A reading habit tracker for parents'
            : kind === 'product' ? 'My open-source CRM for solo consultants'
            : 'New homepage for my newsletter'
          }
          maxLength={140}
          className="input"
        />
      </Field>

      <Field label="Link (optional)">
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://yourthing.com"
          type="url"
          className="input"
        />
      </Field>

      <Field label="Context">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Quick background — what is it, who it's for, what stage you're at."
          rows={4}
          maxLength={1500}
          className="input resize-none"
        />
      </Field>

      <Field label="What feedback do you want?">
        <textarea
          value={ask}
          onChange={(e) => setAsk(e.target.value)}
          placeholder="e.g. Is the value prop clear in 5 seconds? Is $19/mo too expensive for this?"
          rows={3}
          maxLength={500}
          className="input resize-none"
        />
        <p className="text-xs text-zinc-400 mt-1">
          The sharper the question, the better the answer.
        </p>
      </Field>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Link to="/feedback" className="btn btn-ghost">Cancel</Link>
        <button
          onClick={submit}
          disabled={busy}
          className="btn btn-foundry disabled:opacity-40"
        >
          {busy && <Loader2 className="size-4 animate-spin" />} Post request
        </button>
      </div>

      <style>{`
        .input { width: 100%; padding: 0.7rem 0.95rem; border-radius: 0.75rem; border: 1px solid #e4e4e7; background: white; outline: none; transition: border-color .15s, box-shadow .15s; font-size: 14px; }
        .input:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,.15); }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-2">{label}</span>
      {children}
    </label>
  )
}
