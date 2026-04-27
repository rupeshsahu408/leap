import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { getPost, type Post } from '../lib/posts'
import PostCard from '../components/PostCard'

export default function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null | 'loading' | 'missing'>('loading')

  useEffect(() => {
    if (!id) { setPost('missing'); return }
    setPost('loading')
    getPost(id).then((p) => setPost(p ?? 'missing'))
  }, [id])

  return (
    <div className="ig-shell px-0 md:px-0 max-w-[614px] mx-auto">
      <div className="flex items-center gap-2 px-4 md:px-0 py-3">
        <button
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          className="size-9 grid place-items-center rounded-full hover:bg-zinc-100"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </button>
        <h1 className="font-semibold text-base">Post</h1>
      </div>

      {post === 'loading' && (
        <div className="bg-white md:rounded-2xl md:border md:border-[var(--color-line)] p-6 space-y-4">
          <div className="flex gap-3">
            <div className="size-10 rounded-full skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 skeleton" />
              <div className="h-3 w-1/4 skeleton" />
            </div>
          </div>
          <div className="aspect-square skeleton rounded-xl" />
          <div className="space-y-2">
            <div className="h-3 w-2/3 skeleton" />
            <div className="h-3 w-1/2 skeleton" />
          </div>
        </div>
      )}

      {post === 'missing' && (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-10 text-center mx-4 md:mx-0">
          <h2 className="font-semibold">This post isn't available</h2>
          <p className="text-sm text-zinc-500 mt-1">It may have been deleted by the author.</p>
        </div>
      )}

      {typeof post === 'object' && post !== null && (
        <PostCard post={post} />
      )}
    </div>
  )
}
