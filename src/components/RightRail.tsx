import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { fetchPeople, type PublicUser } from '../lib/social'
import Avatar from './Avatar'
import FollowButton from './FollowButton'

/**
 * Instagram-style desktop right rail — only visible on lg+.
 * Renders on the side of the feed: current user header + suggested builders + tiny footer.
 */
export default function RightRail() {
  const { user, profile } = useAuth()
  const [people, setPeople] = useState<PublicUser[] | null>(null)

  useEffect(() => {
    if (!user) return
    let alive = true
    fetchPeople(user.uid, 5).then((list) => {
      if (alive) setPeople(list.slice(0, 5))
    })
    return () => { alive = false }
  }, [user])

  return (
    <aside className="hidden lg:block w-[320px] shrink-0 pl-10 pt-2">
      {profile && (
        <Link
          to="/profile"
          className="flex items-center gap-3 group"
        >
          <Avatar src={profile.photoURL} name={profile.displayName} size={56} />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm truncate group-hover:underline">
              {profile.username ? `@${profile.username}` : profile.displayName}
            </div>
            <div className="text-[13px] text-zinc-500 truncate">
              {profile.currentProject
                ? `Building ${profile.currentProject}`
                : profile.displayName}
            </div>
          </div>
          <span className="text-xs font-semibold text-foundry">Switch</span>
        </Link>
      )}

      <div className="mt-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-semibold text-zinc-500">Builders to meet</h3>
          <Link to="/network" className="text-[12px] font-semibold hover:underline">
            See all
          </Link>
        </div>

        {people === null ? (
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-9 rounded-full skeleton" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-1/2 skeleton" />
                  <div className="h-2.5 w-1/3 skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : people.length === 0 ? (
          <div className="text-sm text-zinc-500">
            More builders are joining every day.
          </div>
        ) : (
          <ul className="space-y-3">
            {people.map((p) => (
              <li key={p.uid} className="flex items-center gap-3">
                <Link to={`/u/${p.uid}`} className="shrink-0">
                  <Avatar src={p.photoURL} name={p.displayName} size={36} />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/u/${p.uid}`}
                    className="text-[13px] font-semibold truncate hover:underline block"
                  >
                    {p.displayName}
                  </Link>
                  <div className="text-[12px] text-zinc-500 truncate">
                    {p.headline || 'Builder on Foundry'}
                  </div>
                </div>
                <FollowButton
                  targetUid={p.uid}
                  size="sm"
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 flex items-center gap-2 text-[12px] text-zinc-400">
        <Sparkles className="size-3.5" />
        Built with love by makers, for makers.
      </div>
    </aside>
  )
}
