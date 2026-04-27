import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2, Send } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { getRoom } from '../lib/rooms'
import { type Post, createPost, subscribeRoomFeed } from '../lib/posts'
import PostCard from '../components/PostCard'
import Avatar from '../components/Avatar'

export default function Room() {
  const { slug = '' } = useParams()
  const room = getRoom(slug)
  const { user, profile } = useAuth()
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!room) return
    return subscribeRoomFeed(room.slug, setPosts)
  }, [room])

  if (!room) {
    return (
      <div className="px-4 md:px-0 py-10 text-center">
        <h1 className="font-display text-2xl">Room not found</h1>
        <Link to="/rooms" className="text-foundry text-sm font-semibold mt-3 inline-block">
          Back to rooms
        </Link>
      </div>
    )
  }

  async function submit() {
    if (!user || !profile || !text.trim() || !room) return
    setBusy(true)
    setError(null)
    try {
      await createPost({
        authorId: user.uid,
        authorName: profile.displayName || 'Founder',
        authorPhotoURL: profile.photoURL,
        authorHeadline: profile.headline,
        text,
        roomId: room.slug,
      })
      setText('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to post')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="pb-6">
      {/* Banner */}
      <div className={`relative overflow-hidden md:rounded-2xl border-b md:border border-[var(--color-line)] bg-gradient-to-br ${room.accent} text-white px-5 py-7`}>
        <Link
          to="/rooms"
          className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs text-white/80 hover:text-white"
        >
          <ArrowLeft className="size-4" /> Rooms
        </Link>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-3xl">{room.emoji}</span>
          <div>
            <h1 className="font-display text-2xl leading-tight">{room.name}</h1>
            <p className="text-white/85 text-sm">{room.tagline}</p>
          </div>
        </div>
      </div>

      {/* Inline composer */}
      <div className="bg-white md:rounded-2xl md:border md:border-[var(--color-line)] md:mt-4 px-4 py-3">
        <div className="flex gap-2 items-start">
          <Avatar src={profile?.photoURL} name={profile?.displayName} size={36} />
          <div className="flex-1 min-w-0">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Drop a question, win, or update for #${room.slug}…`}
              rows={2}
              maxLength={1500}
              className="w-full px-3 py-2 rounded-xl bg-zinc-100 outline-none text-sm placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-amber-300 resize-none"
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            <div className="flex justify-end mt-2">
              <button
                onClick={submit}
                disabled={busy || !text.trim()}
                className="btn btn-foundry !py-1.5 !px-3 text-sm disabled:opacity-40"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="mt-3 md:mt-4 space-y-3 md:space-y-5">
        {posts === null && (
          <div className="px-4 md:px-0 text-sm text-zinc-500">Loading room…</div>
        )}
        {posts && posts.length === 0 && (
          <div className="mx-4 md:mx-0 rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-8 text-center">
            <span className="text-3xl">{room.emoji}</span>
            <h2 className="mt-2 font-semibold">Quiet in here.</h2>
            <p className="text-sm text-zinc-500 mt-1">{room.blurb}</p>
            <p className="text-sm text-zinc-500 mt-1">Be the first to break the silence.</p>
          </div>
        )}
        {posts?.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  )
}
