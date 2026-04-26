import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { PublicUser } from '../lib/social'
import Avatar from './Avatar'
import FollowButton from './FollowButton'

export default function UserCard({ user }: { user: PublicUser }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-4 flex items-start gap-3">
      <Link to={`/u/${user.uid}`} className="shrink-0">
        <Avatar src={user.photoURL} name={user.displayName} size={48} />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/u/${user.uid}`} className="block hover:underline">
          <div className="font-semibold truncate">{user.displayName}</div>
        </Link>
        {user.headline && (
          <div className="text-sm text-zinc-600 line-clamp-2 mt-0.5">
            {user.headline}
          </div>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-zinc-500">
          {user.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" /> {user.location}
            </span>
          )}
          {user.stage && <span>{user.stage}</span>}
        </div>
      </div>
      <FollowButton targetUid={user.uid} size="sm" />
    </div>
  )
}
