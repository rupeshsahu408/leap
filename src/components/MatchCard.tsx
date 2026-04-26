import { Link } from 'react-router-dom'
import type { MatchResult } from '../lib/match'
import Avatar from './Avatar'
import FollowButton from './FollowButton'

export default function MatchCard({ match }: { match: MatchResult }) {
  const { user, score, reasons } = match
  const tierClass =
    score >= 70
      ? 'bg-brand-500 text-white'
      : score >= 40
      ? 'bg-brand-100 text-brand-700'
      : 'bg-zinc-100 text-zinc-600'

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-4">
      <div className="flex items-start gap-3">
        <Link to={`/u/${user.uid}`} className="shrink-0">
          <Avatar src={user.photoURL} name={user.displayName} size={52} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                to={`/u/${user.uid}`}
                className="font-semibold hover:underline truncate block"
              >
                {user.displayName}
              </Link>
              {user.headline && (
                <div className="text-xs text-zinc-500 line-clamp-2 mt-0.5">
                  {user.headline}
                </div>
              )}
            </div>
            <span
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold ${tierClass}`}
            >
              {score}% match
            </span>
          </div>
          {reasons.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {reasons.map((r, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600"
                >
                  {r.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--color-line)]">
        <FollowButton targetUid={user.uid} size="sm" />
        <Link
          to={`/u/${user.uid}`}
          className="px-3 py-1.5 text-xs rounded-full bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 font-medium"
        >
          View profile
        </Link>
      </div>
    </div>
  )
}
