import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { fetchPeople, type PublicUser } from '../lib/social'
import { rankMatches, type MatchResult } from '../lib/match'
import MatchCard from '../components/MatchCard'

export default function Match() {
  const { user, profile } = useAuth()
  const [people, setPeople] = useState<PublicUser[] | null>(null)

  useEffect(() => {
    if (!user) return
    fetchPeople(user.uid, 200).then(setPeople)
  }, [user])

  const matches = useMemo<MatchResult[] | null>(() => {
    if (!people || !profile) return null
    return rankMatches(profile, people).slice(0, 50)
  }, [people, profile])

  const profileIncomplete =
    !profile?.skills?.length &&
    !profile?.lookingFor?.length &&
    !profile?.stage

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-xl bg-white/20 grid place-items-center backdrop-blur">
            <Sparkles className="size-5" />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl">Find your co-founder</h1>
            <p className="text-sm text-white/85 mt-1.5 leading-relaxed">
              Founders ranked for you based on complementary skills, shared stage, and what you're each looking for.
            </p>
          </div>
        </div>
      </div>

      {profileIncomplete && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 p-4 text-sm">
          Add skills, your stage, and what you're looking for in your{' '}
          <Link to="/profile" className="underline font-medium">profile</Link>{' '}
          to get better matches.
        </div>
      )}

      {matches === null && <Skeleton />}

      {matches && matches.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-8 text-center">
          <div className="size-10 mx-auto grid place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Sparkles className="size-5" />
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            No strong matches yet. As more founders join Foundry, they'll appear here.
          </p>
          <Link
            to="/network"
            className="inline-block mt-4 text-sm font-medium text-brand-600 hover:underline"
          >
            Browse all founders →
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {matches?.map((m) => <MatchCard key={m.user.uid} match={m} />)}
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-2xl border border-[var(--color-line)] bg-white p-4 animate-pulse">
          <div className="flex gap-3">
            <div className="size-12 rounded-full bg-zinc-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 bg-zinc-100 rounded" />
              <div className="h-3 w-2/3 bg-zinc-100 rounded" />
              <div className="flex gap-2 mt-3">
                <div className="h-5 w-20 bg-zinc-100 rounded-full" />
                <div className="h-5 w-24 bg-zinc-100 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
