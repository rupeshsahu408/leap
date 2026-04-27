import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Plus, Star } from 'lucide-react'
import {
  type FeedbackKind, type FeedbackPost, FEEDBACK_KINDS, subscribeFeedback,
} from '../lib/feedback'
import { timeAgo } from '../lib/time'
import Avatar from '../components/Avatar'

type Tab = 'all' | FeedbackKind

export default function Feedback() {
  const [tab, setTab] = useState<Tab>('all')
  const [items, setItems] = useState<FeedbackPost[] | null>(null)

  useEffect(() => {
    setItems(null)
    return subscribeFeedback(setItems, tab === 'all' ? undefined : tab)
  }, [tab])

  return (
    <div className="pb-6">
      <header className="px-4 md:px-0 pt-5 md:pt-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-1">
              Feedback exchange
            </div>
            <h1 className="font-display text-3xl">Trade kind, honest feedback.</h1>
            <p className="text-zinc-500 mt-1 text-[15px] max-w-xl">
              Share an idea, product, or landing page. Get real, useful notes — not just "looks great!" Then pay it forward.
            </p>
          </div>
          <Link
            to="/feedback/new"
            className="btn btn-foundry shrink-0 hidden sm:inline-flex"
          >
            <Plus className="size-4" /> Ask
          </Link>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
          <TabPill active={tab === 'all'} onClick={() => setTab('all')} label="All" />
          {FEEDBACK_KINDS.map((k) => (
            <TabPill
              key={k.kind}
              active={tab === k.kind}
              onClick={() => setTab(k.kind)}
              label={`${k.emoji} ${k.label}`}
            />
          ))}
        </div>
      </header>

      <Link
        to="/feedback/new"
        className="sm:hidden mx-4 mt-4 btn btn-foundry w-full justify-center"
      >
        <Plus className="size-4" /> Ask for feedback
      </Link>

      <div className="mt-5 space-y-3 px-4 md:px-0">
        {items === null && (
          <div className="text-sm text-zinc-500">Loading feedback requests…</div>
        )}
        {items && items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-8 text-center">
            <MessageSquare className="size-6 mx-auto text-zinc-300" />
            <h2 className="mt-3 font-semibold">No requests here yet.</h2>
            <p className="text-sm text-zinc-500 mt-1">Be the first to ask for feedback.</p>
          </div>
        )}
        {items?.map((it) => <FeedbackRow key={it.id} item={it} />)}
      </div>
    </div>
  )
}

function TabPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm border transition ${
        active
          ? 'bg-zinc-900 text-white border-zinc-900'
          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
      }`}
    >
      {label}
    </button>
  )
}

function FeedbackRow({ item }: { item: FeedbackPost }) {
  const meta = FEEDBACK_KINDS.find((k) => k.kind === item.kind)
  return (
    <Link
      to={`/feedback/${item.id}`}
      className="block rounded-2xl border border-[var(--color-line)] bg-white p-4 hover:border-zinc-300 transition"
    >
      <div className="flex items-start gap-3">
        <Avatar src={item.authorPhotoURL} name={item.authorName} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[12px] text-zinc-500">
            <span className="font-semibold text-zinc-700">{item.authorName}</span>
            <span>·</span>
            <span>{timeAgo(item.createdAt)}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-medium">
              {meta?.emoji} {meta?.label}
            </span>
          </div>
          <h3 className="font-semibold text-[15px] mt-1 leading-snug">{item.title}</h3>
          {item.ask && (
            <p className="text-[13px] text-zinc-600 mt-1 line-clamp-2">
              <span className="font-semibold text-zinc-700">Ask:</span> {item.ask}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-[12px] text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5" /> {item.reviewCount} {item.reviewCount === 1 ? 'review' : 'reviews'}
            </span>
            {item.link && (
              <span className="truncate max-w-[200px] underline decoration-dotted">
                {prettyUrl(item.link)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
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
