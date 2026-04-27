import { useEffect, useState } from 'react'
import { Check, UserPlus } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { follow, subscribeIsFollowing, unfollow } from '../lib/social'

type Props = {
  targetUid: string
  size?: 'sm' | 'md'
}

export default function FollowButton({ targetUid, size = 'md' }: Props) {
  const { user, profile } = useAuth()
  const [following, setFollowing] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!user || user.uid === targetUid) return
    return subscribeIsFollowing(user.uid, targetUid, setFollowing)
  }, [user, targetUid])

  if (!user || user.uid === targetUid) return null

  async function toggle() {
    if (!user || busy) return
    setBusy(true)
    try {
      if (following) {
        await unfollow(user.uid, targetUid)
      } else {
        await follow(user.uid, targetUid, {
          name: profile?.displayName || 'Builder',
          photoURL: profile?.photoURL,
        })
      }
    } finally {
      setBusy(false)
    }
  }

  const cls =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs'
      : 'px-4 py-2 text-sm'

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition border ${cls} ${
        following
          ? 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
          : 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
      } disabled:opacity-50`}
    >
      {following ? (
        <>
          <Check className="size-3.5" /> Following
        </>
      ) : (
        <>
          <UserPlus className="size-3.5" /> Follow
        </>
      )}
    </button>
  )
}
