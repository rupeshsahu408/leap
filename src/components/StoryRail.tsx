import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { fetchPeople, type PublicUser } from '../lib/social'
import Avatar from './Avatar'

export default function StoryRail() {
  const { user } = useAuth()
  const [people, setPeople] = useState<PublicUser[] | null>(null)

  useEffect(() => {
    if (!user) return
    let alive = true
    fetchPeople(user.uid, 20).then((list) => {
      if (alive) setPeople(list)
    })
    return () => { alive = false }
  }, [user])

  if (!user) return null

  return (
    <div className="bg-white md:rounded-2xl md:border md:border-[var(--color-line)] md:shadow-sm">
      <div className="flex items-center justify-between px-4 pt-3 md:pt-4">
        <h2 className="text-sm font-semibold text-zinc-900">Founders Spotlight</h2>
        <Link to="/network" className="text-xs font-semibold text-foundry hover:opacity-80">
          See all
        </Link>
      </div>

      {people === null ? (
        <div className="flex gap-4 px-4 py-3 overflow-hidden">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="size-16 skeleton rounded-full" />
              <div className="h-2 w-12 skeleton" />
            </div>
          ))}
        </div>
      ) : people.length === 0 ? (
        <div className="px-4 py-4 text-sm text-zinc-500">
          No other founders here yet — share Foundry with friends.
        </div>
      ) : (
        <div className="flex gap-4 px-4 py-3 overflow-x-auto no-scrollbar">
          {people.map((p) => (
            <Link
              key={p.uid}
              to={`/u/${p.uid}`}
              className="flex flex-col items-center gap-1.5 shrink-0 w-16 group"
            >
              <Avatar
                src={p.photoURL}
                name={p.displayName}
                size={60}
                ring
                className="group-active:scale-95 transition"
              />
              <span className="text-[11px] text-zinc-700 truncate max-w-full">
                {p.displayName?.split(' ')[0]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
