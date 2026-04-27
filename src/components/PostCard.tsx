import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Sparkles, Trash2,
} from 'lucide-react'
import { useAuth } from '../lib/auth'
import {
  type Post,
  type Comment,
  toggleLike,
  subscribeUserLike,
  subscribeComments,
  addComment,
  deletePost,
  toggleSave,
  subscribeUserSaved,
} from '../lib/posts'
import { postFeedbackPrompt } from '../lib/advisor'
import { timeAgo } from '../lib/time'
import HashtagText from './HashtagText'
import Avatar from './Avatar'

export default function PostCard({ post }: { post: Post }) {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [bursting, setBursting] = useState(false)
  const [popping, setPopping] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const lastTap = useRef(0)

  useEffect(() => {
    if (!user) return
    return subscribeUserLike(post.id, user.uid, setLiked)
  }, [post.id, user])

  useEffect(() => {
    if (!user) return
    return subscribeUserSaved(post.id, user.uid, setSaved)
  }, [post.id, user])

  async function performSave() {
    if (!user) return
    setSaved((v) => !v)
    try {
      await toggleSave(post.id, user.uid)
    } catch {
      setSaved((v) => !v)
    }
  }

  useEffect(() => {
    if (!showComments) return
    return subscribeComments(post.id, setComments)
  }, [showComments, post.id])

  async function performLike(forceLike = false) {
    if (!user) return
    if (forceLike && liked) return
    setLiked((v) => (forceLike ? true : !v))
    setPopping(true)
    setTimeout(() => setPopping(false), 450)
    try {
      if (forceLike) {
        if (!liked) await toggleLike(post.id, user.uid)
      } else {
        await toggleLike(post.id, user.uid)
      }
    } catch {
      setLiked((v) => !v)
    }
  }

  function handleImageTap() {
    const now = Date.now()
    if (now - lastTap.current < 300) {
      lastTap.current = 0
      setBursting(true)
      setTimeout(() => setBursting(false), 900)
      performLike(true)
    } else {
      lastTap.current = now
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
  const canAskAdvisor = isOwner && !!post.text?.trim()
  const longText = (post.text?.length ?? 0) > 180
  const isShip = !!post.dailyShipDate

  function askAdvisor() {
    if (!post.text) return
    navigate('/advisor', { state: { seed: postFeedbackPrompt(post.text) } })
    setShowMenu(false)
  }

  return (
    <article className="bg-white md:rounded-2xl md:border md:border-[var(--color-line)] md:shadow-sm overflow-hidden">
      {/* ===== Header ===== */}
      <header className="flex items-center gap-3 px-4 py-3">
        <Link to={`/u/${post.authorId}`} className="shrink-0">
          <Avatar src={post.authorPhotoURL} name={post.authorName} size={40} ring />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link to={`/u/${post.authorId}`} className="font-semibold text-[14px] hover:underline">
              {post.authorName}
            </Link>
            {isShip && (
              <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                Daily ship
              </span>
            )}
          </div>
          <div className="text-[11px] text-zinc-500 truncate flex items-center gap-1.5">
            {post.authorHeadline && <span className="truncate">{post.authorHeadline}</span>}
            {post.authorHeadline && <span>·</span>}
            <span>{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="size-9 grid place-items-center rounded-full text-zinc-500 hover:bg-zinc-100 tap"
          >
            <MoreHorizontal className="size-5" />
          </button>
          {showMenu && (
            <>
              <button
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setShowMenu(false)}
                aria-label="Close menu"
              />
              <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-[var(--color-line)] bg-white shadow-lg overflow-hidden">
                {canAskAdvisor && (
                  <button
                    onClick={askAdvisor}
                    className="w-full px-3 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-zinc-50"
                  >
                    <Sparkles className="size-4 text-amber-500" />
                    Ask AI Advisor
                  </button>
                )}
                <Link
                  to={`/u/${post.authorId}`}
                  className="w-full px-3 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-zinc-50"
                  onClick={() => setShowMenu(false)}
                >
                  View profile
                </Link>
                {isOwner && (
                  <button
                    onClick={() => { setShowMenu(false); setConfirmDelete(true) }}
                    className="w-full px-3 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="size-4" />
                    Delete post
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ===== Image ===== */}
      {post.imageUrl && (
        <div
          className="relative bg-black/[.02] cursor-pointer select-none"
          onClick={handleImageTap}
        >
          <img
            src={post.imageUrl}
            alt=""
            className="w-full max-h-[640px] object-cover"
            loading="lazy"
            draggable={false}
          />
          {bursting && (
            <Heart
              className="absolute top-1/2 left-1/2 size-28 text-white animate-heart-burst pointer-events-none"
              fill="currentColor"
              style={{ filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.35))' }}
            />
          )}
        </div>
      )}

      {/* ===== Action bar ===== */}
      <footer className="px-4 pt-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => performLike()}
            className="size-10 grid place-items-center rounded-full hover:bg-zinc-100 tap"
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <Heart
              className={`size-6 transition-colors ${liked ? 'text-rose-500' : 'text-zinc-800'} ${
                popping ? 'animate-pop' : ''
              }`}
              fill={liked ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          </button>
          <button
            onClick={() => setShowComments((v) => !v)}
            className="size-10 grid place-items-center rounded-full hover:bg-zinc-100 tap"
            aria-label="Comments"
          >
            <MessageCircle className="size-6 text-zinc-800" strokeWidth={2} />
          </button>
          <button
            onClick={() => navigate(`/u/${post.authorId}`)}
            className="size-10 grid place-items-center rounded-full hover:bg-zinc-100 tap"
            aria-label="Send"
            title="Visit profile to message"
          >
            <Send className="size-6 text-zinc-800" strokeWidth={2} />
          </button>
          <button
            onClick={performSave}
            className="ml-auto size-10 grid place-items-center rounded-full hover:bg-zinc-100 tap"
            aria-label={saved ? 'Unsave' : 'Save'}
            title={saved ? 'Unsave' : 'Save'}
          >
            <Bookmark
              className="size-6 text-zinc-800"
              strokeWidth={2}
              fill={saved ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        {/* Like count */}
        {(post.likeCount ?? 0) > 0 && (
          <div className="px-1 mt-1 text-[14px] font-semibold">
            {post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}
          </div>
        )}

        {/* Caption */}
        {post.text && (
          <div className="px-1 mt-1 text-[14px] leading-snug">
            <Link to={`/u/${post.authorId}`} className="font-semibold mr-1.5 hover:underline">
              {post.authorName}
            </Link>
            <span className={!expanded && longText ? 'line-clamp-3' : ''}>
              <HashtagText text={post.text} />
            </span>
            {longText && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="text-zinc-500 ml-1 hover:text-zinc-700"
              >
                more
              </button>
            )}
          </div>
        )}

        {/* View comments */}
        {(post.commentCount ?? 0) > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="block px-1 mt-1.5 text-[13px] text-zinc-500 hover:text-zinc-700"
          >
            View all {post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}
          </button>
        )}

        <div className="text-[10px] uppercase tracking-wide text-zinc-400 px-1 mt-1.5 pb-3">
          {timeAgo(post.createdAt)}
        </div>
      </footer>

      {/* ===== Comments ===== */}
      {showComments && (
        <div className="border-t border-[var(--color-line)] bg-zinc-50/40 px-4 py-3 space-y-3">
          {comments.length === 0 && (
            <p className="text-sm text-zinc-500">Be the first to comment.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2.5">
              <Avatar src={c.authorPhotoURL} name={c.authorName} size={28} />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] leading-snug">
                  <span className="font-semibold mr-1.5">{c.authorName}</span>
                  <HashtagText text={c.text} />
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">{timeAgo(c.createdAt)}</div>
              </div>
            </div>
          ))}

          <div className="flex gap-2 items-center pt-2">
            <Avatar src={profile?.photoURL} name={profile?.displayName} size={28} />
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Add a comment…"
              className="flex-1 px-0 py-1.5 bg-transparent text-sm outline-none placeholder:text-zinc-400"
              maxLength={500}
            />
            <button
              onClick={handleAddComment}
              disabled={submittingComment || !commentText.trim()}
              className="text-foundry text-sm font-semibold disabled:opacity-30 px-2 py-1.5 tap"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* ===== Delete confirm ===== */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4 animate-fade-in-up"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-lg">Delete this post?</h3>
            <p className="text-sm text-zinc-500 mt-1">This can't be undone.</p>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setConfirmDelete(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn bg-red-600 text-white hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
