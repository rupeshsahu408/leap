import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin, Briefcase, Plus, Rocket, Settings, Grid3x3, Heart, Bookmark, Info, LogOut, Share2,
} from 'lucide-react'
import { useAuth } from '../lib/auth'
import { fetchStartupsByMember, type Startup } from '../lib/startups'
import StartupCard from '../components/StartupCard'
import Avatar from '../components/Avatar'
import PostGrid from '../components/PostGrid'

type Tab = 'posts' | 'saved' | 'projects' | 'about'

export default function Profile() {
  const { profile, user, signOut } = useAuth()
  const [ventures, setVentures] = useState<Startup[] | null>(null)
  const [tab, setTab] = useState<Tab>('posts')

  useEffect(() => {
    if (!user) return
    fetchStartupsByMember(user.uid).then(setVentures)
  }, [user])

  if (!profile || !user) return null

  const followers = (profile as { followersCount?: number }).followersCount ?? 0
  const following = (profile as { followingCount?: number }).followingCount ?? 0
  const projectCount = ventures?.length ?? 0

  async function share() {
    const url = `${window.location.origin}/u/${user!.uid}`
    if (navigator.share) {
      try { await navigator.share({ title: profile?.displayName ?? 'Builder', url }) } catch { /* ignore */ }
    } else {
      try { await navigator.clipboard.writeText(url) } catch { /* ignore */ }
    }
  }

  return (
    <div className="pb-6">
      {/* ===== Header (Instagram-style) ===== */}
      <div className="px-4 md:px-0 pt-5 md:pt-2">
        <div className="flex items-center gap-6 md:gap-12">
          <Avatar
            src={profile.photoURL}
            name={profile.displayName}
            size={92}
            ring
            className="md:!p-1"
          />
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[20px] md:text-[22px] font-semibold truncate">
                {profile.username ? `@${profile.username}` : profile.displayName}
              </h1>
              <Link to="/onboarding" className="btn btn-outline !py-1.5 !px-3 text-xs">
                <Settings className="size-3.5" />
                Edit profile
              </Link>
              <button onClick={share} className="btn btn-outline !py-1.5 !px-3 text-xs">
                <Share2 className="size-3.5" /> Share
              </button>
            </div>

            {/* Stats row — desktop */}
            <div className="hidden md:flex items-center gap-7 text-[15px]">
              <Stat label="projects" value={projectCount} />
              <Stat label="followers" value={followers} />
              <Stat label="following" value={following} />
            </div>

            <div className="hidden md:block">
              <ProfileBio profile={profile} />
            </div>
          </div>
        </div>

        {/* Mobile: bio under header */}
        <div className="md:hidden mt-5">
          <ProfileBio profile={profile} />
        </div>

        {/* Mobile stats row */}
        <div className="md:hidden flex justify-around mt-5 pt-4 border-t border-[var(--color-line)] text-center">
          <Stat label="projects" value={projectCount} />
          <Stat label="followers" value={followers} />
          <Stat label="following" value={following} />
        </div>

        {/* Quick CTA — uplifting */}
        <div className="mt-5 rounded-2xl bg-gradient-to-br from-amber-50 via-rose-50 to-violet-50 border border-rose-100 px-4 py-3 text-[13px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base">✨</span>
            <span className="text-zinc-700 truncate">
              Every small ship counts. What are you building today?
            </span>
          </div>
          <Link to="/post" className="btn btn-foundry !py-1.5 !px-3 text-xs shrink-0">
            <Plus className="size-3.5" /> Share
          </Link>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <div className="mt-6 border-t border-[var(--color-line)]">
        <div className="flex justify-around md:justify-center md:gap-12 text-[11px] uppercase tracking-[0.12em] font-semibold">
          <TabButton active={tab === 'posts'}    onClick={() => setTab('posts')}    icon={Grid3x3} label="Posts" />
          <TabButton active={tab === 'saved'}    onClick={() => setTab('saved')}    icon={Bookmark} label="Saved" />
          <TabButton active={tab === 'projects'} onClick={() => setTab('projects')} icon={Rocket}  label={`Projects ${projectCount ? `· ${projectCount}` : ''}`.trim()} />
          <TabButton active={tab === 'about'}    onClick={() => setTab('about')}    icon={Info}    label="About" />
        </div>
      </div>

      {/* ===== Tab content ===== */}
      <div className="px-1 md:px-0 pt-3">
        {tab === 'posts' && (
          <PostGrid
            uid={user.uid}
            emptyTitle="Your grid is waiting"
            emptyHint="Share your first ship and it'll live here forever — start with one tiny win."
          />
        )}

        {tab === 'saved' && (
          <PostGrid
            uid={user.uid}
            source="saved"
            emptyTitle="Nothing saved yet"
            emptyHint="Tap the bookmark on any post to keep it here for later — only you can see this."
          />
        )}

        {tab === 'projects' && (
          <div className="px-3 md:px-0 pt-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">My projects</h2>
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
                <p className="text-sm text-zinc-600 mt-3">
                  Your projects will live here. Add the one you're working on now — even if it's day one.
                </p>
                <Link to="/startups/new" className="btn btn-foundry mt-4 inline-flex">
                  <Plus className="size-4" /> Start a project page
                </Link>
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

        {tab === 'about' && (
          <div className="card p-5 mx-3 md:mx-0 mt-3 space-y-3 text-sm">
            {profile.username && <Row label="Handle" value={`@${profile.username}`} />}
            {profile.email && <Row label="Email" value={profile.email} />}
            {profile.currentProject && <Row label="Building" value={profile.currentProject} />}
            {profile.niche && <Row label="Home room" value={profile.niche} />}
            {profile.location && <Row label="Location" value={profile.location} />}
            {profile.stage && <Row label="Stage" value={profile.stage} />}
            {!!profile.skills?.length && <Row label="Skills" value={profile.skills.join(', ')} />}
            {!!profile.canHelpWith?.length && <Row label="Can help with" value={profile.canHelpWith.join(', ')} />}
            {!!profile.lookingFor?.length && <Row label="Looking for" value={profile.lookingFor.join(', ')} />}
          </div>
        )}
      </div>

      {/* ===== Sign out ===== */}
      <div className="px-4 md:px-0 mt-10">
        <button
          onClick={() => signOut()}
          className="text-sm text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-2"
        >
          <Heart className="size-4 text-rose-400" />
          Take a break · sign out
          <LogOut className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

function ProfileBio({ profile }: { profile: NonNullable<ReturnType<typeof useAuth>['profile']> }) {
  return (
    <div className="space-y-2 text-[14px]">
      {profile.headline && <div className="font-semibold">{profile.headline}</div>}
      {profile.currentProject && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[12px] font-medium">
          <Rocket className="size-3.5" /> Building: {profile.currentProject}
        </div>
      )}
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

      {(!!profile.skills?.length || !!profile.canHelpWith?.length || !!profile.lookingFor?.length) && (
        <div className="pt-2 space-y-2">
          {!!profile.skills?.length && (
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs">{s}</span>
              ))}
            </div>
          )}
          {!!profile.canHelpWith?.length && (
            <div className="flex flex-wrap gap-1.5">
              {profile.canHelpWith.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                  Can help · {s}
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-zinc-500 shrink-0">{label}</span>
      <span className="text-right text-zinc-800 truncate">{value}</span>
    </div>
  )
}
