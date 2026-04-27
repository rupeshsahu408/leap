import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ImageIcon, MessageCircle } from 'lucide-react'
import { type Post, subscribeUserPosts, subscribeSavedPosts } from '../lib/posts'
import HashtagText from './HashtagText'

type Props = {
  uid: string
  source?: 'authored' | 'saved'
  emptyTitle?: string
  emptyHint?: string
}

/**
 * Instagram-style 3-column post grid for a user. Square tiles.
 * Image posts → photo. Text-only posts → soft tinted square with the text.
 */
export default function PostGrid({
  uid,
  source = 'authored',
  emptyTitle = 'No posts yet',
  emptyHint = 'When this builder shares something, it shows up here.',
}: Props) {
  const [posts, setPosts] = useState<Post[] | null>(null)

  useEffect(() => {
    if (!uid) return
    setPosts(null)
    return source === 'saved'
      ? subscribeSavedPosts(uid, setPosts)
      : subscribeUserPosts(uid, setPosts)
  }, [uid, source])

  if (posts === null) {
    return (
      <div className="grid grid-cols-3 gap-1 md:gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="aspect-square skeleton rounded-sm md:rounded-md" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white py-14 px-6 text-center">
        <div className="size-12 mx-auto rounded-full bg-foundry-soft grid place-items-center text-zinc-700">
          <ImageIcon className="size-5" />
        </div>
        <h3 className="font-semibold mt-3">{emptyTitle}</h3>
        <p className="text-sm text-zinc-500 mt-1 max-w-xs mx-auto">{emptyHint}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-1.5">
      {posts.map((p, idx) => (
        <PostTile key={p.id} post={p} idx={idx} />
      ))}
    </div>
  )
}

function PostTile({ post, idx }: { post: Post; idx: number }) {
  // Soft tinted background for text-only tiles. Cycles a small palette.
  const tints = [
    'from-amber-100 to-rose-100',
    'from-rose-100 to-fuchsia-100',
    'from-violet-100 to-sky-100',
    'from-emerald-100 to-teal-100',
    'from-orange-100 to-yellow-100',
    'from-fuchsia-100 to-pink-100',
  ]
  const tint = tints[idx % tints.length]
  const isShip = !!post.dailyShipDate
  const liked = post.likeCount ?? 0
  const cmts = post.commentCount ?? 0

  return (
    <Link
      to={`/p/${post.id}`}
      className="group relative aspect-square overflow-hidden rounded-sm md:rounded-md bg-white"
      title={post.text || 'Post'}
    >
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt=""
          className="absolute inset-0 size-full object-cover group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${tint} p-2.5 md:p-3 flex`}>
          <p className="text-[11px] md:text-[13px] leading-snug text-zinc-800 line-clamp-6 md:line-clamp-8">
            <HashtagText text={post.text || '…'} />
          </p>
        </div>
      )}

      {isShip && (
        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-white/90 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-amber-700">
          Ship
        </span>
      )}

      {/* Hover overlay (desktop) */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 text-white text-xs font-bold pointer-events-none hidden md:flex">
        <span className="inline-flex items-center gap-1">
          <Heart className="size-4" fill="currentColor" /> {liked}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="size-4" fill="currentColor" /> {cmts}
        </span>
      </div>
    </Link>
  )
}
