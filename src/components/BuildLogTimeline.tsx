import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../lib/auth'
import {
  type BuildLogEntry, type BuildLogKind, KIND_META,
  addLogEntry, deleteLogEntry, subscribeBuildLog,
} from '../lib/buildLog'
import { timeAgo } from '../lib/time'
import Avatar from './Avatar'

type Props = {
  startupId: string
  canPost: boolean
}

export default function BuildLogTimeline({ startupId, canPost }: Props) {
  const { user, profile } = useAuth()
  const [entries, setEntries] = useState<BuildLogEntry[] | null>(null)
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [kind, setKind] = useState<BuildLogKind>('update')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => subscribeBuildLog(startupId, setEntries), [startupId])

  async function submit() {
    if (!user || !profile || !text.trim()) return
    setBusy(true)
    setError(null)
    try {
      await addLogEntry({
        startupId,
        authorId: user.uid,
        authorName: profile.displayName || 'Founder',
        authorPhotoURL: profile.photoURL,
        text,
        kind,
      })
      setText('')
      setOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not post')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Build log</h2>
        {canPost && !open && (
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1 text-sm text-foundry font-semibold hover:opacity-80"
          >
            <Plus className="size-4" /> Post update
          </button>
        )}
      </div>

      {open && (
        <div className="rounded-2xl border border-[var(--color-line)] bg-zinc-50/40 p-4 mb-5 space-y-3">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(KIND_META) as BuildLogKind[]).map((k) => {
              const meta = KIND_META[k]
              const active = kind === k
              return (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    active
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <span className="mr-1">{meta.emoji}</span>{meta.label}
                </button>
              )
            })}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              kind === 'milestone' ? 'Reached 100 paying users 🥳' :
              kind === 'ship' ? 'Pushed v2.1 with the new editor.' :
              kind === 'learning' ? 'Realised pricing was too low — bumped from $9 to $19.' :
              'Quick update on what changed today…'
            }
            rows={3}
            maxLength={1500}
            className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-sm bg-white resize-none"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <button onClick={() => { setOpen(false); setText(''); setError(null) }} className="btn btn-ghost">
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={busy || !text.trim()}
              className="btn btn-foundry disabled:opacity-40"
            >
              {busy && <Loader2 className="size-4 animate-spin" />} Post
            </button>
          </div>
        </div>
      )}

      {entries === null ? (
        <div className="text-sm text-zinc-500">Loading…</div>
      ) : entries.length === 0 ? (
        <div className="text-sm text-zinc-500">
          No updates yet. {canPost && 'Post the first one to start the log.'}
        </div>
      ) : (
        <ol className="relative pl-5">
          <span className="absolute left-2 top-1 bottom-1 w-px bg-zinc-200" aria-hidden />
          {entries.map((entry) => {
            const meta = KIND_META[entry.kind] ?? KIND_META.update
            const mine = user?.uid === entry.authorId
            return (
              <li key={entry.id} className="relative pb-5 last:pb-0">
                <span className="absolute -left-[14px] top-1.5 size-3.5 rounded-full bg-white border-2 border-amber-400 shadow-sm" />
                <div className="flex items-center gap-2 text-[12px] text-zinc-500 mb-1">
                  <Link to={`/u/${entry.authorId}`} className="inline-flex items-center gap-1.5 hover:text-zinc-900">
                    <Avatar src={entry.authorPhotoURL} name={entry.authorName} size={20} />
                    <span className="font-semibold text-zinc-700">{entry.authorName}</span>
                  </Link>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <span>{meta.emoji}</span>{meta.label}
                  </span>
                  <span>·</span>
                  <span>{timeAgo(entry.createdAt)}</span>
                  {mine && (
                    <button
                      onClick={() => deleteLogEntry(startupId, entry.id)}
                      className="ml-auto p-1 text-zinc-300 hover:text-red-500"
                      title="Delete entry"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[14px] text-zinc-800 leading-relaxed whitespace-pre-line">
                  {entry.text}
                </p>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
