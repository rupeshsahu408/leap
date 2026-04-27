import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Loader2, Star, Trash2 } from 'lucide-react'
import { useAuth } from '../lib/auth'
import {
  type FeedbackPost, type FeedbackReview, FEEDBACK_KINDS,
  addReview, deleteFeedback, subscribeFeedbackOne, subscribeReviews,
} from '../lib/feedback'
import { timeAgo } from '../lib/time'
import Avatar from '../components/Avatar'

export default function FeedbackPostPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [item, setItem] = useState<FeedbackPost | null | undefined>(undefined)
  const [reviews, setReviews] = useState<FeedbackReview[]>([])
  const [text, setText] = useState('')
  const [rating, setRating] = useState(4)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => subscribeFeedbackOne(id, setItem), [id])
  useEffect(() => subscribeReviews(id, setReviews), [id])

  if (item === undefined) return <div className="p-6 text-sm text-zinc-500">Loading…</div>
  if (item === null) return (
    <div className="p-6 text-center">
      <p className="text-zinc-500">Feedback not found.</p>
      <Link to="/feedback" className="text-foundry text-sm font-semibold mt-2 inline-block">
        Back to feedback
      </Link>
    </div>
  )

  const meta = FEEDBACK_KINDS.find((k) => k.kind === item.kind)
  const isOwner = user?.uid === item.authorId
  const myReview = reviews.find((r) => r.authorId === user?.uid)

  async function submitReview() {
    if (!user || !profile || !text.trim()) return
    setBusy(true)
    setError(null)
    try {
      await addReview({
        feedbackId: id,
        authorId: user.uid,
        authorName: profile.displayName || 'Founder',
        authorPhotoURL: profile.photoURL,
        text,
        rating,
      })
      setText('')
      setRating(4)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not post review')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this feedback request? Reviews will remain orphaned.')) return
    await deleteFeedback(id)
    navigate('/feedback', { replace: true })
  }

  return (
    <div className="px-4 md:px-0 pt-5 md:pt-0 pb-10 space-y-5">
      <Link to="/feedback" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="size-4" /> Back to feedback
      </Link>

      {/* Request card */}
      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-[12px] text-zinc-500">
          <Link to={`/u/${item.authorId}`} className="inline-flex items-center gap-1.5 hover:text-zinc-900">
            <Avatar src={item.authorPhotoURL} name={item.authorName} size={24} />
            <span className="font-semibold text-zinc-700">{item.authorName}</span>
          </Link>
          <span>·</span>
          <span>{timeAgo(item.createdAt)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-medium">
            {meta?.emoji} {meta?.label}
          </span>
          {isOwner && (
            <button
              onClick={handleDelete}
              className="ml-auto text-zinc-300 hover:text-red-500"
              title="Delete"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>

        <h1 className="font-display text-2xl mt-3">{item.title}</h1>

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-sm text-foundry hover:underline"
          >
            {prettyUrl(item.link)} <ExternalLink className="size-3.5" />
          </a>
        )}

        {item.description && (
          <p className="mt-4 text-zinc-700 leading-relaxed whitespace-pre-line">{item.description}</p>
        )}

        <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-amber-800">Specifically asking for</div>
          <p className="text-sm text-amber-900 mt-1 whitespace-pre-line">{item.ask}</p>
        </div>
      </div>

      {/* Review composer */}
      {!isOwner && !myReview && (
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5 space-y-3">
          <div>
            <div className="text-sm font-semibold mb-2">Your review</div>
            <RatingPicker rating={rating} setRating={setRating} />
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Be specific. What worked, what confused you, what you'd cut."
            rows={4}
            maxLength={2000}
            className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-sm resize-none"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex justify-end">
            <button
              onClick={submitReview}
              disabled={busy || !text.trim()}
              className="btn btn-foundry disabled:opacity-40"
            >
              {busy && <Loader2 className="size-4 animate-spin" />} Post review
            </button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div>
        <h2 className="font-semibold text-sm mb-3">
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </h2>
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-6 text-center text-sm text-zinc-500">
            No reviews yet. Be the first to give honest, useful feedback.
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-[var(--color-line)] bg-white p-4">
                <div className="flex items-center gap-2 text-[12px] text-zinc-500">
                  <Link to={`/u/${r.authorId}`} className="inline-flex items-center gap-1.5 hover:text-zinc-900">
                    <Avatar src={r.authorPhotoURL} name={r.authorName} size={24} />
                    <span className="font-semibold text-zinc-700">{r.authorName}</span>
                  </Link>
                  <span>·</span>
                  <span>{timeAgo(r.createdAt)}</span>
                  <span className="ml-auto inline-flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${i < r.rating ? 'text-amber-400' : 'text-zinc-200'}`}
                        fill="currentColor"
                      />
                    ))}
                  </span>
                </div>
                <p className="text-sm text-zinc-800 mt-2 leading-relaxed whitespace-pre-line">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RatingPicker({ rating, setRating }: { rating: number; setRating: (n: number) => void }) {
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1
        return (
          <button
            key={v}
            type="button"
            onClick={() => setRating(v)}
            className="p-1 hover:scale-110 transition"
            aria-label={`${v} stars`}
          >
            <Star
              className={`size-6 ${v <= rating ? 'text-amber-400' : 'text-zinc-200'}`}
              fill="currentColor"
            />
          </button>
        )
      })}
      <span className="ml-2 text-xs text-zinc-500">{rating}/5</span>
    </div>
  )
}

function prettyUrl(url: string): string {
  try {
    const u = new URL(url)
    return u.host.replace(/^www\./, '') + (u.pathname === '/' ? '' : u.pathname)
  } catch {
    return url
  }
}
