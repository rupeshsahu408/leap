import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { type Post, subscribeFeed } from '../lib/posts'
import PostComposer from '../components/PostComposer'
import PostCard from '../components/PostCard'
import StoryRail from '../components/StoryRail'

export default function Feed() {
  const [posts, setPosts] = useState<Post[] | null>(null)

  useEffect(() => {
    return subscribeFeed(setPosts)
  }, [])

  return (
    <div className="space-y-3 md:space-y-5">
      <StoryRail />

      <div className="px-4 md:px-0">
        <PostComposer />
      </div>

      {posts === null && <FeedSkeleton />}

      {posts && posts.length === 0 && (
        <div className="mx-4 md:mx-0 rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-8 text-center">
          <div className="size-12 mx-auto grid place-items-center rounded-2xl bg-foundry-soft text-zinc-800">
            <Sparkles className="size-5" />
          </div>
          <h2 className="mt-3 font-semibold">Your feed is quiet</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Be the first to share what you're building. Use #hashtags so others can find your post.
          </p>
        </div>
      )}

      <div className="space-y-3 md:space-y-5">
        {posts?.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  )
}

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white md:rounded-2xl md:border md:border-[var(--color-line)] p-4">
          <div className="flex gap-3">
            <div className="size-10 rounded-full skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 skeleton" />
              <div className="h-3 w-1/4 skeleton" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 skeleton" />
            <div className="h-3 w-4/5 skeleton" />
          </div>
        </div>
      ))}
    </div>
  )
}
