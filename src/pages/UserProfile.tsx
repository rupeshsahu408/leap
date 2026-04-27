import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Briefcase, MessageCircle, Grid3x3, Rocket, Sparkles,
} from 'lucide-react'
import { useAuth } from '../lib/auth'
import { fetchUser, type PublicUser } from '../lib/social'
import { ensureConversation } from '../lib/messaging'
import { fetchStartupsByMember, type Startup } from '../lib/startups'
import Avatar from '../components/Avatar'
import FollowButton from '../components/FollowButton'
import StartupCard from '../components/StartupCard'
import PostGrid from '../components/PostGrid'

type Tab = 'posts' | 'projects'

export default function UserProfile() {
  const { uid = '' } = useParams()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState<PublicUser | null | undefined>(undefined)
  const [ventures, setVentures] = useState<Startup[]>([])
  const [tab, setTab] = useState<Tab>('posts')
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    fetchUser(uid).then(setData)
    fetchStartupsByMember(uid).then(setVentures)
  }, [uid])

  if (data === undefined) return (
    <div className="px-4 md:px-0 py-10 text-sm text-zinc-500">Loading…</div>
  )
  if (data === null) return (
    <div className="mx-4 md:mx-0 mt-6 rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-8 text-center text-zinc-500">
      User not found.
    </div>
  )

  const isMe = user?.uid === data.uid
  const projectCount = ventures.length

  async function startMessage() {
    if (!user || !profile || isMe || !data) return
    setOpening(true)
    try {
      const id = await ensureConversation(
        { uid: user.uid, displayName: profile.displayName || 'You', photoURL: profile.photoURL },
        { uid: data.uid, displayName: data.displayName,         photoURL: data.photoURL },
      )
      navigate(`/messages/${id}`)
    } finally {
      setOpening(false)
    }
  }

  return (
    <div className="pb-6">
      {/* Mobile back chip */}
      <div className="md:hidden px-4 pt-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
      </div>

      {/* ===== Header (Instagram-style) ===== */}
      <div className="px-4 md:px-0 pt-3 md:pt-2">
        <div className="flex items-center gap-6 md:gap-12">
          <Avatar
            src={data.photoURL}
            name={data.displayName}
            size={92}
            ring
            className="md:!p-1"
          />
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[20px] md:text-[22px] font-semibold truncate">
                {data.username ? `@${data.username}` : data.displayName}
              </h1>
              {!isMe && (
                <>
                  <FollowButton targetUid={data.uid} size="sm" />
                  <button
                    onClick={startMessage}
                    disabled={opening}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-zinc-700 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 lift"
                  >
                    <MessageCircle className="size-3.5" />
                    {opening ? 'Opening…' : 'Message'}
                  </button>
                </>
              )}
            </div>

            <div className="hidden md:flex items-center gap-7 text-[15px]">
              <Stat label="projects" value={projectCount} />
              <Stat label="followers" value={data.followersCount ?? 0} />
              <Stat label="following" value={data.followingCount ?? 0} />
            </div>

            <div className="hidden md:block">
              <UserBio data={data} />
            </div>
          </div>
        </div>

        {/* Mobile bio */}
        <div className="md:hidden mt-5">
          <UserBio data={data} />
        </div>

        <div className="md:hidden flex justify-around mt-5 pt-4 border-t border-[var(--color-line)] text-center">
          <Stat label="projects" value={projectCount} />
          <Stat label="followers" value={data.followersCount ?? 0} />
          <Stat label="following" value={data.followingCount ?? 0} />
        </div>

        {!isMe && data.canHelpWith && data.canHelpWith.length > 0 && (
          <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-[13px] flex items-start gap-2">
            <Sparkles className="size-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-emerald-900">
              <span className="font-semibold">{data.displayName?.split(' ')[0]}</span> can help with{' '}
              <span className="font-semibold">{data.canHelpWith.slice(0, 3).join(' · ')}</span>. Drop them a message — builders love builders.
            </p>
          </div>
        )}
      </div>

      {/* ===== Tabs ===== */}
      <div className="mt-6 border-t border-[var(--color-line)]">
        <div className="flex justify-around md:justify-center md:gap-12 text-[11px] uppercase tracking-[0.12em] font-semibold">
          <TabButton active={tab === 'posts'}    onClick={() => setTab('posts')}    icon={Grid3x3} label="Posts" />
          <TabButton active={tab === 'projects'} onClick={() => setTab('projects')} icon={Rocket}  label={`Projects ${projectCount ? `· ${projectCount}` : ''}`.trim()} />
        </div>
      </div>

      <div className="px-1 md:px-0 pt-3">
        {tab === 'posts' && (
          <PostGrid
            uid={data.uid}
            emptyTitle={`${data.displayName?.split(' ')[0] ?? 'They'} hasn't posted yet`}
            emptyHint="Be the first to send a kind hello — sometimes that's all it takes."
          />
        )}

        {tab === 'projects' && (
          <div className="px-3 md:px-0 pt-3">
            {ventures.length === 0 ? (
              <div className="card p-8 text-center text-sm text-zinc-500">
                No public projects yet.
              </div>
            ) : (
              <div className="space-y-3">
                {ventures.map((s) => (
                  <StartupCard key={s.id} startup={s} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function UserBio({ data }: { data: PublicUser }) {
  return (
    <div className="space-y-2 text-[14px]">
      {data.headline && <div className="font-semibold">{data.headline}</div>}
      {data.currentProject && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[12px] font-medium">
          <Rocket className="size-3.5" /> Building: {data.currentProject}
        </div>
      )}
      {data.bio && <p className="text-zinc-700 leading-relaxed whitespace-pre-line">{data.bio}</p>}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-zinc-500 pt-1">
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

      {(!!data.skills?.length || !!data.lookingFor?.length || !!data.canHelpWith?.length) && (
        <div className="pt-2 space-y-2">
          {!!data.skills?.length && (
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs">{s}</span>
              ))}
            </div>
          )}
          {!!data.canHelpWith?.length && (
            <div className="flex flex-wrap gap-1.5">
              {data.canHelpWith.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                  Can help · {s}
                </span>
              ))}
            </div>
          )}
          {!!data.lookingFor?.length && (
            <div className="flex flex-wrap gap-1.5">
              {data.lookingFor.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-full bg-foundry-soft text-zinc-800 text-xs font-medium">
                  Looking for · {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col md:flex-row items-center md:gap-1.5">
      <span className="font-semibold">{value}</span>
      <span className="text-zinc-500 text-xs md:text-sm">{label}</span>
    </div>
  )
}

function TabButton({
  active, onClick, icon: Icon, label,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Grid3x3
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 py-3 border-t-2 -mt-px transition tap ${
        active
          ? 'border-zinc-900 text-zinc-900'
          : 'border-transparent text-zinc-400 hover:text-zinc-700'
      }`}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  )
}
