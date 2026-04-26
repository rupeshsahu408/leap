import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { type Post, subscribeFeed } from '../lib/posts'
import PostComposer from '../components/PostComposer'
import PostCard from '../components/PostCard'

export default function Feed() {
  const [posts, setPosts] = useState<Post[] | null>(null)

  useEffect(() => {
    return subscribeFeed(setPosts)
  }, [])

  return (
    <div className="space-y-5">
      <PostComposer />

      {posts === null && <FeedSkeleton />}

      {posts && posts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-8 text-center">
          <div className="size-10 mx-auto grid place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Sparkles className="size-5" />
          </div>
          <h2 className="mt-3 font-semibold">No posts yet</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Be the first to share what you're building. Use #hashtags to help others find your post.
          </p>
        </div>
      )}

      {posts?.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  )
}

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-2xl border border-[var(--color-line)] bg-white p-5 animate-pulse">
          <div className="flex gap-3">
            <div className="size-10 rounded-full bg-zinc-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 bg-zinc-100 rounded" />
              <div className="h-3 w-1/4 bg-zinc-100 rounded" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-zinc-100 rounded" />
            <div className="h-3 w-4/5 bg-zinc-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
