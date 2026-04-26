import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Pencil, Rocket, Users } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { subscribeStartup, type Startup } from '../lib/startups'
import { fetchUser, type PublicUser } from '../lib/social'
import Avatar from '../components/Avatar'

export default function StartupView() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const [data, setData] = useState<Startup | null | undefined>(undefined)
  const [team, setTeam] = useState<PublicUser[]>([])

  useEffect(() => subscribeStartup(id, setData), [id])

  useEffect(() => {
    if (!data) return
    Promise.all(data.teamIds.map((uid) => fetchUser(uid))).then((results) =>
      setTeam(results.filter((r): r is PublicUser => !!r)),
    )
  }, [data])

  if (data === undefined) return <div className="text-sm text-zinc-500">Loading…</div>
  if (data === null) return (
    <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-8 text-center text-zinc-500">
      Venture not found.
    </div>
  )

  const isOwner = user?.uid === data.ownerId

  return (
    <div className="space-y-5">
      <Link to="/startups" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="size-4" /> Back to ventures
      </Link>

      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {data.logoURL ? (
            <img
              src={data.logoURL}
              alt=""
              className="size-20 rounded-2xl object-cover bg-zinc-100"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="size-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white grid place-items-center text-2xl font-bold">
              {data.name?.[0]?.toUpperCase() ?? <Rocket />}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl">{data.name}</h1>
            <p className="text-zinc-700 mt-1">{data.tagline}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {data.stage && (
                <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-medium">
                  {data.stage}
                </span>
              )}
              {data.industries?.map((ind) => (
                <span key={ind} className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs">
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-5">
          {data.website && (
            <a
              href={data.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800"
            >
              Visit site <ExternalLink className="size-3.5" />
            </a>
          )}
          {isOwner && (
            <Link
              to={`/startups/${id}/edit`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50"
            >
              <Pencil className="size-3.5" /> Edit
            </Link>
          )}
        </div>

        {data.description && (
          <p className="mt-5 text-zinc-700 leading-relaxed whitespace-pre-wrap">
            {data.description}
          </p>
        )}
      </div>

      {!!data.lookingFor?.length && (
        <Section title="Looking for">
          <div className="flex flex-wrap gap-2">
            {data.lookingFor.map((lf) => (
              <span
                key={lf}
                className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm border border-brand-200"
              >
                {lf}
              </span>
            ))}
          </div>
        </Section>
      )}

      <Section
        title="Team"
        icon={<Users className="size-4 text-zinc-400" />}
      >
        {team.length === 0 ? (
          <div className="text-sm text-zinc-500">No team members yet.</div>
        ) : (
          <div className="space-y-2">
            {team.map((u) => (
              <Link
                key={u.uid}
                to={`/u/${u.uid}`}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50"
              >
                <Avatar src={u.photoURL} name={u.displayName} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {u.displayName}
                    {u.uid === data.ownerId && (
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-brand-600 font-semibold">
                        Founder
                      </span>
                    )}
                  </div>
                  {u.headline && (
                    <div className="text-xs text-zinc-500 truncate">{u.headline}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  )
}
