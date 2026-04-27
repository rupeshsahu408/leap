import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react'
import Avatar from './Avatar'
import { useAuth } from '../lib/auth'
import { deleteStory, type StoryGroup } from '../lib/stories'
import { timeAgo } from '../lib/time'

type Props = {
  groups: StoryGroup[]
  startGroupIndex: number
  onClose: () => void
  onAdvanceGroup?: (newIndex: number) => void
  onStoryViewed?: (storyId: string) => void
}

const STORY_DURATION_MS = 5000

export default function StoryViewer({
  groups, startGroupIndex, onClose, onAdvanceGroup, onStoryViewed,
}: Props) {
  const { user } = useAuth()
  const [groupIdx, setGroupIdx] = useState(startGroupIndex)
  const [storyIdx, setStoryIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const startRef = useRef<number>(Date.now())
  const elapsedRef = useRef<number>(0)
  const rafRef = useRef<number | null>(null)

  const group = groups[groupIdx]
  const story = group?.stories[storyIdx]
  const isOwner = !!user && !!story && story.authorId === user.uid

  useEffect(() => {
    setStoryIdx(0)
  }, [groupIdx])

  useEffect(() => {
    if (!story) return
    onStoryViewed?.(story.id)
    elapsedRef.current = 0
    startRef.current = Date.now()
    setProgress(0)

    function tick() {
      if (!paused) {
        const now = Date.now()
        elapsedRef.current += now - startRef.current
        startRef.current = now
        const p = Math.min(1, elapsedRef.current / STORY_DURATION_MS)
        setProgress(p)
        if (p >= 1) {
          advance(1)
          return
        }
      } else {
        startRef.current = Date.now()
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id, paused])

  function advance(dir: 1 | -1) {
    if (!group) return
    const next = storyIdx + dir
    if (next >= 0 && next < group.stories.length) {
      setStoryIdx(next)
      return
    }
    const nextGroup = groupIdx + dir
    if (nextGroup >= 0 && nextGroup < groups.length) {
      setGroupIdx(nextGroup)
      onAdvanceGroup?.(nextGroup)
    } else {
      onClose()
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') advance(1)
      else if (e.key === 'ArrowLeft') advance(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIdx, storyIdx])

  async function handleDelete() {
    if (!story) return
    const confirmed = window.confirm('Delete this story?')
    if (!confirmed) return
    try {
      await deleteStory(story.id)
      // If this was the only one in the group, close; otherwise advance forward.
      if (group.stories.length === 1) onClose()
      else advance(1)
    } catch (err) {
      console.error(err)
    }
  }

  if (!group || !story) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black grid place-items-center animate-fade-in-up select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 size-10 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Close stories"
      >
        <X className="size-6" />
      </button>

      {/* Prev/Next desktop arrows */}
      <button
        onClick={() => advance(-1)}
        className="hidden md:grid place-items-center absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 text-white hover:bg-white/20 z-20"
        aria-label="Previous"
      >
        <ChevronLeft className="size-7" />
      </button>
      <button
        onClick={() => advance(1)}
        className="hidden md:grid place-items-center absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 text-white hover:bg-white/20 z-20"
        aria-label="Next"
      >
        <ChevronRight className="size-7" />
      </button>

      {/* Story card */}
      <div
        className="relative w-full h-full md:w-[420px] md:h-[746px] md:rounded-2xl overflow-hidden bg-zinc-900"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
      >
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 px-3 pt-3">
          {group.stories.map((_, i) => {
            const filled = i < storyIdx ? 1 : i === storyIdx ? progress : 0
            return (
              <div
                key={i}
                className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-[width] duration-100 ease-linear"
                  style={{ width: `${filled * 100}%` }}
                />
              </div>
            )
          })}
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-3 px-4 pt-7 pb-3 bg-gradient-to-b from-black/60 to-transparent">
          <Link to={`/u/${story.authorId}`} onClick={onClose}>
            <Avatar src={story.authorPhotoURL} name={story.authorName} size={36} />
          </Link>
          <Link
            to={`/u/${story.authorId}`}
            onClick={onClose}
            className="text-white text-sm font-semibold flex-1 min-w-0 truncate hover:underline"
          >
            {story.authorName}
          </Link>
          <span className="text-white/70 text-xs">{timeAgo(story.createdAt)}</span>
          {isOwner && (
            <button
              onClick={handleDelete}
              className="size-9 grid place-items-center rounded-full text-white/80 hover:bg-white/15"
              aria-label="Delete story"
            >
              <Trash2 className="size-5" />
            </button>
          )}
        </div>

        {/* Image */}
        <img
          src={story.imageUrl}
          alt={story.caption ?? ''}
          className="absolute inset-0 w-full h-full object-contain"
          draggable={false}
        />

        {/* Tap zones */}
        <button
          onClick={() => advance(-1)}
          className="absolute inset-y-0 left-0 w-1/3 z-[5]"
          aria-label="Previous"
        />
        <button
          onClick={() => advance(1)}
          className="absolute inset-y-0 right-0 w-1/3 z-[5]"
          aria-label="Next"
        />

        {/* Caption */}
        {story.caption && (
          <div className="absolute bottom-0 left-0 right-0 z-10 px-5 py-6 bg-gradient-to-t from-black/70 to-transparent text-white text-[15px] leading-snug">
            {story.caption}
          </div>
        )}
      </div>
    </div>
  )
}
