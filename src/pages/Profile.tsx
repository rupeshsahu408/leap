import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin, Briefcase, Plus, Rocket, Settings, Grid3x3, BookmarkPlus, LogOut,
} from 'lucide-react'
import { useAuth } from '../lib/auth'
import { fetchStartupsByMember, type Startup } from '../lib/startups'
import StartupCard from '../components/StartupCard'
import Avatar from '../components/Avatar'

export default function Profile() {
  const { profile, user, signOut } = useAuth()
  const [ventures, setVentures] = useState<Startup[] | null>(null)
  const [tab, setTab] = useState<'ventures' | 'about'>('ventures')

  useEffect(() => {
    if (!user) return
    fetchStartupsByMember(user.uid).then(setVentures)
  }, [user])

  if (!profile) return null

  const followers = (profile as { followersCount?: number }).followersCount ?? 0
  const following = (profile as { followingCount?: number }).followingCount ?? 0

  return (
    <div className="pb-6">
      {/* ===== Header (Instagram-style) ===== */}
      <div className="px-4 md:px-0 pt-4 md:pt-0">
        <div className="flex items-center gap-5 md:gap-10">
          <Avatar
            src={profile.photoURL}
            name={profile.displayName}
            size={88}
            ring
            className="md:!p-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold truncate">{profile.displayName}</h1>
              <Link to="/onboarding" className="btn btn-outline !py-1.5 !px-3 text-xs">
                <Settings className="size-3.5" />
                Edit profile
              </Link>
            </div>

            {/* Stats row */}
            <div className="hidden md:flex items-center gap-7 mt-3 text-sm">
              <Stat label="ventures" value={ventures?.length ?? 0} />
              <Stat label="followers" value={followers} />
              <Stat label="following" value={following} />
            </div>
          </div>
        </div>

        {/* Mobile stats row */}
        <div className="md:hidden flex justify-around mt-5 pt-4 border-t border-[var(--color-line)] text-center">
          <Stat label="ventures" value={ventures?.length ?? 0} />
          <Stat label="followers" value={followers} />
          <Stat label="following" value={following} />
        </div>

        {/* Headline + bio + meta */}
        <div className="mt-5 space-y-2 text-[14px]">
          {profile.headline && <div className="font-semibold">{profile.headline}</div>}
          {profile.bio && <p className="text-zinc-700 leading-relaxed whitespace-pre-line">{profile.bio}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-zinc-500 pt-1">
            {profile.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" /> {profile.location}
              </span>
            )}
            {profile.stage && (
              <span className="inline-flex items-center gap-1">
                <Briefcase className="size-3.5" /> {profile.stage}
              </span>
            )}
          </div>
        </div>

        {/* Skills + looking-for chips */}
        {(!!profile.skills?.length || !!profile.lookingFor?.length) && (
          <div className="mt-4 space-y-3">
            {!!profile.skills?.length && (
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs">
                    {s}
                  </span>
                ))}
              </div>
            )}
            {!!profile.lookingFor?.length && (
              <div className="flex flex-wrap gap-1.5">
                {profile.lookingFor.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-full bg-foundry-soft text-zinc-800 text-xs font-medium">
                    Looking for · {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== Tabs ===== */}
      <div className="mt-6 border-t border-[var(--color-line)]">
        <div className="flex justify-around md:justify-start md:gap-12 md:px-2 text-xs uppercase tracking-wider font-semibold">
          <TabButton active={tab === 'ventures'} onClick={() => setTab('ventures')} icon={Grid3x3} label="Ventures" />
          <TabButton active={tab === 'about'} onClick={() => setTab('about')} icon={BookmarkPlus} label="About" />
        </div>
      </div>

      {/* ===== Tab content ===== */}
      <div className="px-4 md:px-0 pt-5">
        {tab === 'ventures' && (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">My ventures</h2>
              <Link
                to="/startups/new"
                className="inline-flex items-center gap-1 text-sm font-semibold text-foundry"
              >
                <Plus className="size-4" /> New
              </Link>
            </div>

            {ventures === null ? (
              <div className="space-y-3">
                {[0, 1].map((i) => (
                  <div key={i} className="card p-4">
                    <div className="h-4 w-1/3 skeleton mb-2" />
                    <div className="h-3 w-2/3 skeleton" />
                  </div>
                ))}
              </div>
            ) : ventures.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="size-12 mx-auto grid place-items-center rounded-2xl bg-foundry-soft text-zinc-800">
                  <Rocket className="size-5" />
                </div>
                <p className="text-sm text-zinc-500 mt-3">
                  You haven't listed a venture yet.
                </p>
                <Link to="/startups/new" className="btn btn-foundry mt-4 inline-flex">
                  <Plus className="size-4" /> Create your first venture
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {ventures.map((s) => (
                  <StartupCard key={s.id} startup={s} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'about' && (
          <div className="card p-5 space-y-3 text-sm">
            {profile.email && (
              <Row label="Email" value={profile.email} />
            )}
            {profile.location && (
              <Row label="Location" value={profile.location} />
            )}
            {profile.stage && (
              <Row label="Stage" value={profile.stage} />
            )}
            {!!profile.skills?.length && (
              <Row label="Skills" value={profile.skills.join(', ')} />
            )}
            {!!profile.lookingFor?.length && (
              <Row label="Looking for" value={profile.lookingFor.join(', ')} />
            )}
          </div>
        )}
      </div>

      {/* ===== Sign out ===== */}
      <div className="px-4 md:px-0 mt-8">
        <button
          onClick={() => signOut()}
          className="text-sm text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-2"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
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
      className={`inline-flex items-center gap-1.5 py-3 border-t-2 -mt-px transition ${
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-zinc-500 shrink-0">{label}</span>
      <span className="text-right text-zinc-800 truncate">{value}</span>
    </div>
  )
}
