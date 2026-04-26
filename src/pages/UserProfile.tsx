import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Briefcase, MessageCircle } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { fetchUser, type PublicUser } from '../lib/social'
import { ensureConversation, conversationId } from '../lib/messaging'
import { fetchStartupsByMember, type Startup } from '../lib/startups'
import Avatar from '../components/Avatar'
import FollowButton from '../components/FollowButton'
import StartupCard from '../components/StartupCard'

export default function UserProfile() {
  const { uid = '' } = useParams()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState<PublicUser | null | undefined>(undefined)
  const [ventures, setVentures] = useState<Startup[]>([])
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    fetchUser(uid).then(setData)
    fetchStartupsByMember(uid).then(setVentures)
  }, [uid])

  if (data === undefined) return <div className="text-sm text-zinc-500">Loading…</div>
  if (data === null) return (
    <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-8 text-center text-zinc-500">
      User not found.
    </div>
  )

  const isMe = user?.uid === data.uid

  async function startMessage() {
    if (!user || !profile || isMe || !data) return
    setOpening(true)
    try {
      const id = await ensureConversation(
        {
          uid: user.uid,
          displayName: profile.displayName || 'You',
          photoURL: profile.photoURL,
        },
        {
          uid: data.uid,
          displayName: data.displayName,
          photoURL: data.photoURL,
        },
      )
      navigate(`/messages/${id}`)
    } finally {
      setOpening(false)
    }
  }

  // shortcut if convo already exists, no need to open
  const previewConvId = user && !isMe ? conversationId(user.uid, data.uid) : null

  return (
    <div className="space-y-5">
      <Link to="/network" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="size-4" /> Back
      </Link>

      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <Avatar src={data.photoURL} name={data.displayName} size={84} />
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl">{data.displayName}</h1>
            {data.headline && <p className="text-zinc-700 mt-1">{data.headline}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-zinc-500">
              {data.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" /> {data.location}
                </span>
              )}
              {data.stage && (
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="size-3.5" /> {data.stage}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span><b>{data.followersCount ?? 0}</b> <span className="text-zinc-500">followers</span></span>
              <span><b>{data.followingCount ?? 0}</b> <span className="text-zinc-500">following</span></span>
            </div>
          </div>
        </div>

        {!isMe && (
          <div className="flex gap-2 mt-5">
            <FollowButton targetUid={data.uid} />
            <button
              onClick={startMessage}
              disabled={opening}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50"
            >
              <MessageCircle className="size-4" />
              {opening ? 'Opening…' : 'Message'}
            </button>
            {previewConvId && (
              <Link
                to={`/messages/${previewConvId}`}
                className="hidden"
                aria-hidden
              />
            )}
          </div>
        )}

        {data.bio && (
          <p className="mt-5 text-zinc-700 leading-relaxed">{data.bio}</p>
        )}
      </div>

      {!!data.skills?.length && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-sm">{s}</span>
            ))}
          </div>
        </Section>
      )}

      {!!data.lookingFor?.length && (
        <Section title="Looking for">
          <div className="flex flex-wrap gap-2">
            {data.lookingFor.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm border border-brand-200">{s}</span>
            ))}
          </div>
        </Section>
      )}

      {ventures.length > 0 && (
        <Section title="Ventures">
          <div className="space-y-3">
            {ventures.map((s) => (
              <StartupCard key={s.id} startup={s} />
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
      <h2 className="font-semibold mb-3">{title}</h2>
      {children}
    </div>
  )
}
