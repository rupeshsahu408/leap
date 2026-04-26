import { MapPin, Briefcase } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function Profile() {
  const { profile, signOut } = useAuth()

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
      <h2 className="font-semibold mb-3">{title}</h2>
      {children}
    </div>
  )
}
