import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '../lib/auth'
import {
  groupStories,
  loadSeenStories,
  markStoriesSeen,
  subscribeActiveStories,
  type Story,
  type StoryGroup,
} from '../lib/stories'
import Avatar from './Avatar'
import StoryViewer from './StoryViewer'
import StoryComposer from './StoryComposer'

export default function StoryRail() {
  const { user, profile } = useAuth()
  const [stories, setStories] = useState<Story[] | null>(null)
  const [seen, setSeen] = useState<Set<string>>(() => loadSeenStories())
  const [viewerStart, setViewerStart] = useState<number | null>(null)
  const [composerOpen, setComposerOpen] = useState(false)

  useEffect(() => {
    return subscribeActiveStories(setStories)
  }, [])

  const groups: StoryGroup[] = useMemo(() => {
    if (!stories) return []
    return groupStories(stories, user?.uid ?? null, seen)
  }, [stories, user?.uid, seen])

  const myGroup = user ? groups.find((g) => g.authorId === user.uid) : undefined
  const otherGroups = user ? groups.filter((g) => g.authorId !== user.uid) : groups

  function openViewer(idx: number) {
    setViewerStart(idx)
  }

  function handleStoryViewed(id: string) {
    if (seen.has(id)) return
    const next = markStoriesSeen([id])
    setSeen(new Set(next))
  }

  if (!user) return null

  return (
    <>
      <div className="bg-white md:rounded-2xl md:border md:border-[var(--color-line)] md:shadow-sm">
        <div className="flex gap-4 px-4 py-3 overflow-x-auto no-scrollbar">
          {/* Your story tile */}
          <button
            onClick={() => {
              if (myGroup) openViewer(groups.findIndex((g) => g.authorId === user.uid))
              else setComposerOpen(true)
            }}
            className="flex flex-col items-center gap-1.5 shrink-0 w-16 group"
            aria-label={myGroup ? 'View your story' : 'Add to your story'}
          >
            <span className="relative">
              <Avatar
                src={profile?.photoURL}
                name={profile?.displayName}
                size={60}
                ring={!!myGroup && myGroup.hasUnseen}
              />
              {!myGroup && (
                <span className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full bg-foundry text-white grid place-items-center ring-2 ring-white">
                  <Plus className="size-3.5" strokeWidth={3} />
                </span>
              )}
            </span>
            <span className="text-[11px] text-zinc-700 truncate max-w-full">
              {myGroup ? 'Your story' : 'Your story'}
            </span>
          </button>

          {/* Loading skeleton */}
          {stories === null && (
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 w-16">
                  <div className="size-[60px] skeleton rounded-full" />
                  <div className="h-2 w-12 skeleton" />
                </div>
              ))}
            </>
          )}

          {/* Other people's stories */}
          {otherGroups.map((g) => {
            const idx = groups.findIndex((x) => x.authorId === g.authorId)
            return (
              <button
                key={g.authorId}
                onClick={() => openViewer(idx)}
                className="flex flex-col items-center gap-1.5 shrink-0 w-16 group"
                aria-label={`View ${g.authorName}'s story`}
              >
                <Avatar
                  src={g.authorPhotoURL}
                  name={g.authorName}
                  size={60}
                  ring={g.hasUnseen}
                  ringTone={g.hasUnseen ? 'gradient' : 'muted'}
                  className="group-active:scale-95 transition"
                />
                <span className="text-[11px] text-zinc-700 truncate max-w-full">
                  {g.authorName?.split(' ')[0]}
                </span>
              </button>
            )
          })}

          {/* Empty hint when no stories at all */}
          {stories && stories.length === 0 && (
            <div className="text-xs text-zinc-500 self-center pl-1">
              Tap your avatar to share the first story.
            </div>
          )}
        </div>
      </div>

      {composerOpen && (
        <StoryComposer
          onClose={() => setComposerOpen(false)}
          onCreated={() => { /* subscription will refresh */ }}
        />
      )}

      {viewerStart !== null && groups[viewerStart] && (
        <StoryViewer
          groups={groups}
          startGroupIndex={viewerStart}
          onClose={() => setViewerStart(null)}
          onStoryViewed={handleStoryViewed}
        />
      )}
    </>
  )
}
