import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { subscribeMyConversations, type Conversation } from '../lib/messaging'
import { timeAgo } from '../lib/time'
import Avatar from '../components/Avatar'

export default function Messages() {
  const { user } = useAuth()
  const [convs, setConvs] = useState<Conversation[] | null>(null)

  useEffect(() => {
    if (!user) return
    return subscribeMyConversations(user.uid, setConvs)
  }, [user])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl">Messages</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Chat with founders you've connected with. Real-time, just like the rest of Foundry.
        </p>
      </div>

      {convs === null && (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-[var(--color-line)] bg-white p-4 flex gap-3 animate-pulse">
              <div className="size-12 rounded-full bg-zinc-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/4 bg-zinc-100 rounded" />
                <div className="h-3 w-2/3 bg-zinc-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {convs && convs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-10 text-center">
          <div className="size-10 mx-auto grid place-items-center rounded-xl bg-brand-50 text-brand-600">
            <MessageCircle className="size-5" />
          </div>
          <h2 className="font-semibold mt-3">No conversations yet</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Visit a founder's profile and tap <b>Message</b> to start chatting.
          </p>
          <Link to="/network" className="inline-block mt-4 text-sm font-medium text-brand-600 hover:underline">
            Browse founders →
          </Link>
        </div>
      )}

      <div className="rounded-2xl border border-[var(--color-line)] bg-white overflow-hidden divide-y divide-[var(--color-line)]">
        {convs?.map((c) => {
          const otherUid = c.participantIds.find((id) => id !== user?.uid) ?? ''
          const other = c.participants[otherUid]
          if (!other) return null
          return (
            <Link
              key={c.id}
              to={`/messages/${c.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition"
            >
              <Avatar src={other.photoURL ?? undefined} name={other.displayName} size={44} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-semibold truncate">{other.displayName}</div>
                  <div className="text-xs text-zinc-400 shrink-0">{timeAgo(c.lastMessageAt)}</div>
                </div>
                <div className="text-sm text-zinc-500 truncate">
                  {c.lastMessage || <span className="italic">Say hi…</span>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
