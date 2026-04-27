import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, UserPlus } from 'lucide-react'
import { useAuth } from '../lib/auth'
import {
  markAllRead,
  subscribeNotifications,
  summarize,
  type AppNotification,
} from '../lib/notifications'
import Avatar from '../components/Avatar'
import FollowButton from '../components/FollowButton'
import { timeAgo } from '../lib/time'

export default function Activity() {
  const { user } = useAuth()
  const [items, setItems] = useState<AppNotification[] | null>(null)

  useEffect(() => {
    if (!user) return
    return subscribeNotifications(user.uid, setItems)
  }, [user])

  useEffect(() => {
    if (!user) return
    // Mark everything as read once the page is opened
    const t = setTimeout(() => { void markAllRead(user.uid) }, 800)
    return () => clearTimeout(t)
  }, [user])

  const grouped = groupByBucket(items ?? [])

  return (
    <div className="ig-shell px-4 md:px-0 pt-5 max-w-[640px]">
      <h1 className="font-display text-2xl mb-1">Activity</h1>
      <p className="text-sm text-zinc-500 mb-5">
        Likes, comments and new followers — newest first.
      </p>

      {items === null && <Skeleton />}

      {items && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-10 text-center">
          <div className="size-12 mx-auto grid place-items-center rounded-2xl bg-foundry-soft text-zinc-800">
            <Heart className="size-5" />
          </div>
          <h2 className="mt-3 font-semibold">Nothing to see here yet</h2>
          <p className="text-sm text-zinc-500 mt-1">
            When other builders react to your posts or follow you, it'll show up here.
          </p>
        </div>
      )}

      {grouped.map(({ label, list }) => (
        <section key={label} className="mb-6">
          <h2 className="text-[11px] uppercase tracking-[0.12em] font-semibold text-zinc-500 mb-2">
            {label}
          </h2>
          <ul className="rounded-2xl border border-[var(--color-line)] bg-white divide-y divide-[var(--color-line)] overflow-hidden">
            {list.map((n) => <Row key={n.id} n={n} />)}
          </ul>
        </section>
      ))}
    </div>
  )
}

function Row({ n }: { n: AppNotification }) {
  const { verb, tail } = summarize(n)
  const Icon = n.kind === 'like' ? Heart : n.kind === 'comment' ? MessageCircle : UserPlus
  const iconColor =
    n.kind === 'like' ? 'text-rose-500' : n.kind === 'comment' ? 'text-sky-500' : 'text-emerald-500'
  const dest = n.postId ? `/p/${n.postId}` : `/u/${n.actorId}`

  return (
    <li className={`px-3 py-3 flex items-center gap-3 ${!n.read ? 'bg-amber-50/40' : ''}`}>
      <Link to={`/u/${n.actorId}`} className="relative shrink-0">
        <Avatar src={n.actorPhotoURL} name={n.actorName} size={44} />
        <span className={`absolute -bottom-0.5 -right-0.5 size-5 rounded-full bg-white grid place-items-center ring-2 ring-white ${iconColor}`}>
          <Icon className="size-3" fill="currentColor" />
        </span>
      </Link>
      <Link to={dest} className="flex-1 min-w-0 text-[14px] leading-snug">
        <span className="font-semibold mr-1">{n.actorName}</span>
        <span className="text-zinc-700">{verb}</span>
        {tail && <span className="text-zinc-500 ml-1 truncate">{` ${tail}`}</span>}
        <span className="block text-[11px] text-zinc-400 mt-0.5">{timeAgo(n.createdAt)}</span>
      </Link>
      {n.kind === 'follow' ? (
        <FollowButton targetUid={n.actorId} size="sm" />
      ) : n.postImage ? (
        <Link to={dest} className="shrink-0">
          <img
            src={n.postImage}
            alt=""
            className="size-12 rounded-md object-cover border border-[var(--color-line)]"
          />
        </Link>
      ) : null}
    </li>
  )
}

function groupByBucket(items: AppNotification[]): { label: string; list: AppNotification[] }[] {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  const buckets: Record<string, AppNotification[]> = {
    Today: [],
    'This week': [],
    'This month': [],
    Earlier: [],
  }
  for (const n of items) {
    const t = n.createdAt?.toMillis?.() ?? now
    const age = now - t
    if (age < day) buckets.Today.push(n)
    else if (age < 7 * day) buckets['This week'].push(n)
    else if (age < 30 * day) buckets['This month'].push(n)
    else buckets.Earlier.push(n)
  }
  return Object.entries(buckets)
    .filter(([, list]) => list.length > 0)
    .map(([label, list]) => ({ label, list }))
}

function Skeleton() {
  return (
    <ul className="rounded-2xl border border-[var(--color-line)] bg-white divide-y divide-[var(--color-line)] overflow-hidden">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="px-3 py-3 flex items-center gap-3">
          <div className="size-11 rounded-full skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/3 skeleton" />
            <div className="h-2 w-1/3 skeleton" />
          </div>
          <div className="size-12 rounded-md skeleton" />
        </li>
      ))}
    </ul>
  )
}
