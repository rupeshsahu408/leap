import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Briefcase, Plus, Rocket } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { fetchStartupsByMember, type Startup } from '../lib/startups'
import StartupCard from '../components/StartupCard'

export default function Profile() {
  const { profile, user, signOut } = useAuth()
  const [ventures, setVentures] = useState<Startup[] | null>(null)

  useEffect(() => {
    if (!user) return
    fetchStartupsByMember(user.uid).then(setVentures)
  }, [user])

  if (!profile) return null

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt=""
              className="size-20 rounded-2xl object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="size-20 rounded-2xl bg-brand-100 text-brand-700 grid place-items-center font-semibold text-2xl">
              {profile.displayName?.[0]?.toUpperCase() ?? 'F'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl">{profile.displayName}</h1>
            {profile.headline && (
              <p className="text-zinc-700 mt-1">{profile.headline}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-zinc-500">
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
        </div>

        {profile.bio && (
          <p className="mt-5 text-zinc-700 leading-relaxed">{profile.bio}</p>
        )}
      </div>

      <Section
        title="My ventures"
        action={
          <Link
            to="/startups/new"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
          >
            <Plus className="size-4" /> New
          </Link>
        }
      >
        {ventures === null ? (
          <div className="text-sm text-zinc-400">Loading…</div>
        ) : ventures.length === 0 ? (
          <div className="text-center py-4">
            <div className="size-10 mx-auto grid place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Rocket className="size-5" />
            </div>
            <p className="text-sm text-zinc-500 mt-2">
              You haven't listed a venture yet.
            </p>
            <Link
              to="/startups/new"
              className="inline-block mt-3 text-sm font-medium text-brand-600 hover:underline"
            >
              Create your first venture →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {ventures.map((s) => (
              <StartupCard key={s.id} startup={s} />
            ))}
          </div>
        )}
      </Section>

      {!!profile.skills?.length && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-sm">
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}

      {!!profile.lookingFor?.length && (
        <Section title="Looking for">
          <div className="flex flex-wrap gap-2">
            {profile.lookingFor.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm border border-brand-200">
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}

      <button
        onClick={() => signOut()}
        className="text-sm text-zinc-500 hover:text-zinc-900"
      >
        Sign out
      </button>
    </div>
  )
}

function Section({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}
