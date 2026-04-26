import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Trash2 } from 'lucide-react'
import { useAuth } from '../lib/auth'
import {
  type Post,
  type Comment,
  toggleLike,
  subscribeUserLike,
  subscribeComments,
  addComment,
  deletePost,
} from '../lib/posts'
import { timeAgo } from '../lib/time'
import HashtagText from './HashtagText'
import Avatar from './Avatar'

export default function PostCard({ post }: { post: Post }) {
  const { user, profile } = useAuth()
  const [liked, setLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!user) return
    return subscribeUserLike(post.id, user.uid, setLiked)
  }, [post.id, user])

  useEffect(() => {
    if (!showComments) return
    return subscribeComments(post.id, setComments)
  }, [showComments, post.id])

  async function handleLike() {
    if (!user) return
    setLiked((v) => !v) // optimistic
    try {
      await toggleLike(post.id, user.uid)
    } catch {
      setLiked((v) => !v)
    }
  }

  async function handleAddComment() {
    if (!user || !profile || !commentText.trim()) return
    setSubmittingComment(true)
    try {
      await addComment({
        postId: post.id,
        authorId: user.uid,
        authorName: profile.displayName || 'Founder',
        authorPhotoURL: profile.photoURL,
        text: commentText,
      })
      setCommentText('')
    } finally {
      setSubmittingComment(false)
    }
  }

  async function handleDelete() {
    await deletePost(post.id)
  }

  const isOwner = user?.uid === post.authorId

  return (
    <article className="rounded-2xl border border-[var(--color-line)] bg-white shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5">
        <header className="flex items-start gap-3">
          <Avatar src={post.authorPhotoURL} name={post.authorName} size={42} />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-semibold text-[15px]">{post.authorName}</span>
              <span className="text-xs text-zinc-400">· {timeAgo(post.createdAt)}</span>
            </div>
            {post.authorHeadline && (
              <div className="text-xs text-zinc-500 truncate">{post.authorHeadline}</div>
            )}
          </div>
          {isOwner && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-zinc-400 hover:text-red-600 p-1"
              title="Delete post"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </header>

        {post.text && (
          <div className="mt-3 text-[15px] leading-relaxed">
            <HashtagText text={post.text} />
          </div>
        )}
      </div>

      {post.imageUrl && (
        <div className="border-t border-[var(--color-line)] bg-zinc-50">
          <img
            src={post.imageUrl}
            alt=""
            className="w-full max-h-[600px] object-cover"
            loading="lazy"
          />
        </div>
      )}

      <footer className="px-4 sm:px-5 py-2 border-t border-[var(--color-line)] flex items-center gap-1">
        <button
          onClick={handleLike}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm transition ${
            liked ? 'text-rose-600' : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <Heart className={`size-4 ${liked ? 'fill-rose-600' : ''}`} />
          <span>{post.likeCount || 0}</span>
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm text-zinc-600 hover:bg-zinc-100"
        >
          <MessageCircle className="size-4" />
          <span>{post.commentCount || 0}</span>
        </button>
      </footer>

      {showComments && (
        <div className="border-t border-[var(--color-line)] bg-zinc-50/50 px-4 sm:px-5 py-3 space-y-3">
          {comments.length === 0 && (
            <p className="text-sm text-zinc-500">Be the first to comment.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2.5">
              <Avatar src={c.authorPhotoURL} name={c.authorName} size={30} />
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-2xl px-3 py-2 border border-[var(--color-line)]">
                  <div className="text-xs font-semibold">{c.authorName}</div>
                  <div className="text-sm mt-0.5">
                    <HashtagText text={c.text} />
                  </div>
                </div>
                <div className="text-[10px] text-zinc-400 mt-1 ml-3">{timeAgo(c.createdAt)}</div>
              </div>
            </div>
          ))}

          <div className="flex gap-2 items-end pt-2">
            <Avatar src={profile?.photoURL} name={profile?.displayName} size={30} />
            <div className="flex-1 flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Write a comment…"
                className="flex-1 px-3 py-2 rounded-full border border-zinc-200 bg-white text-sm outline-none focus:border-brand-500"
                maxLength={500}
              />
              <button
                onClick={handleAddComment}
                disabled={submittingComment || !commentText.trim()}
                className="px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/40 p-4" onClick={() => setConfirmDelete(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-lg">Delete this post?</h3>
            <p className="text-sm text-zinc-500 mt-1">This can't be undone.</p>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
