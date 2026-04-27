import { useEffect, useMemo, useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import {
  collection, limit as fbLimit, onSnapshot, query, where,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../lib/auth'
import { createPost, type Post } from '../lib/posts'
import { todayKey, prettyDate } from '../lib/daily'
import Avatar from './Avatar'

export default function DailyPrompt() {
  const { user, profile } = useAuth()
  const today = useMemo(() => todayKey(), [])
  const [ships, setShips] = useState<Post[]>([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!db) return
    const q = query(
      collection(db, 'posts'),
      where('dailyShipDate', '==', today),
      fbLimit(60),
    )
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map(
        (d) => ({ id: d.id, ...(d.data() as Omit<Post, 'id'>) }),
      )
      list.sort((a, b) => {
        const at = a.createdAt?.toMillis?.() ?? 0
        const bt = b.createdAt?.toMillis?.() ?? 0
        return bt - at
      })
      setShips(list)
    })
  }, [today])

  const alreadyShipped = !!user && ships.some((s) => s.authorId === user.uid)

  async function submit() {
    if (!user || !profile || !text.trim()) return
    setBusy(true)
    setError(null)
    try {
      await createPost({
        authorId: user.uid,
        authorName: profile.displayName || 'Founder',
        authorPhotoURL: profile.photoURL,
        authorHeadline: profile.headline,
        text: text.trim(),
        dailyShipDate: today,
      })
      setText('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not ship')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white md:rounded-2xl md:border md:border-[var(--color-line)] md:shadow-sm">
      <div className="px-4 pt-4 pb-3 flex items-start gap-3">
        <div className="size-10 rounded-2xl grid place-items-center bg-gradient-to-br from-amber-400 to-rose-500 text-white shrink-0">
          <Sparkles className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
            {prettyDate(today)} · Daily ship
          </div>
          <h2 className="font-display text-[19px] leading-tight">
            What are you shipping today?
          </h2>
          <p className="text-[13px] text-zinc-500 mt-0.5">
            One small win is plenty. A fix, a sentence, a deploy — it all counts.
          </p>
        </div>
      </div>

      <div className="px-4 pb-4">
        {alreadyShipped ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-sm text-emerald-800">
            🎉 You shipped today. Proud of you — see you tomorrow.
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <Avatar src={profile?.photoURL} name={profile?.displayName} size={36} />
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
              placeholder="Today I shipped…"
              className="flex-1 px-3 py-2.5 rounded-xl bg-zinc-100 outline-none text-sm placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-amber-300"
              maxLength={280}
              disabled={busy}
            />
            <button
              onClick={submit}
              disabled={busy || !text.trim()}
              className="size-10 grid place-items-center rounded-xl bg-foundry text-white disabled:opacity-30 tap"
              aria-label="Ship"
            >
              <Send className="size-4" />
            </button>
          </div>
        )}
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

        {ships.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex -space-x-2">
              {ships.slice(0, 6).map((s) => (
                <Avatar
                  key={s.id}
                  src={s.authorPhotoURL}
                  name={s.authorName}
                  size={24}
                  className="ring-2 ring-white"
                />
              ))}
            </div>
            <span className="text-xs text-zinc-500">
              <span className="font-semibold text-zinc-800">{ships.length}</span>
              {' '}{ships.length === 1 ? 'builder' : 'builders'} shipped today
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
