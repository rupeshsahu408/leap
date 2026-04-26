import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Hash } from 'lucide-react'
import { type Post, subscribeFeedByTag } from '../lib/posts'
import PostCard from '../components/PostCard'

export default function Tag() {
  const { tag = '' } = useParams()
  const [posts, setPosts] = useState<Post[] | null>(null)

  useEffect(() => {
    return subscribeFeedByTag(tag, setPosts)
  }, [tag])

  return (
    <div className="space-y-5">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 mb-3"
        >
          <ArrowLeft className="size-4" /> Back to feed
        </Link>
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-xl bg-brand-50 text-brand-600 grid place-items-center">
            <Hash className="size-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl">#{tag}</h1>
            <p className="text-sm text-zinc-500">
              {posts === null ? 'Loading…' : `${posts.length} post${posts.length === 1 ? '' : 's'}`}
            </p>
          </div>
        </div>
      </div>

      {posts && posts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">No posts with #{tag} yet.</p>
        </div>
      )}

      {posts?.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  )
}
