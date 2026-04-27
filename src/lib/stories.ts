import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'

export type Story = {
  id: string
  authorId: string
  authorName: string
  authorPhotoURL?: string
  imageUrl: string
  caption?: string
  createdAt?: Timestamp
  expiresAt?: Timestamp
}

export type StoryGroup = {
  authorId: string
  authorName: string
  authorPhotoURL?: string
  stories: Story[]
  hasUnseen: boolean
  latestAt: number
}

const STORY_TTL_MS = 24 * 60 * 60 * 1000

type CreateStoryInput = {
  authorId: string
  authorName: string
  authorPhotoURL?: string
  imageUrl: string
  caption?: string
}

export async function createStory(input: CreateStoryInput): Promise<string> {
  if (!db) throw new Error('Firestore not configured')
  const expires = new Date(Date.now() + STORY_TTL_MS)
  const ref = await addDoc(collection(db, 'stories'), {
    authorId: input.authorId,
    authorName: input.authorName,
    authorPhotoURL: input.authorPhotoURL ?? null,
    imageUrl: input.imageUrl,
    caption: input.caption?.trim() || null,
    createdAt: serverTimestamp(),
    expiresAt: expires,
  })
  return ref.id
}

export async function deleteStory(storyId: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured')
  await deleteDoc(doc(db, 'stories', storyId))
}

/**
 * Subscribe to all currently-active stories (created within the last 24h).
 * Filters expired ones client-side so we don't need a composite index.
 */
export function subscribeActiveStories(
  cb: (stories: Story[]) => void,
): Unsubscribe {
  if (!db) return () => {}
  const cutoff = new Date(Date.now() - STORY_TTL_MS)
  const q = query(collection(db, 'stories'), where('createdAt', '>=', cutoff))
  return onSnapshot(q, (snap) => {
    const list: Story[] = []
    snap.forEach((d) => {
      const data = d.data() as Omit<Story, 'id'>
      list.push({ id: d.id, ...data })
    })
    list.sort((a, b) => {
      const at = a.createdAt?.toMillis?.() ?? 0
      const bt = b.createdAt?.toMillis?.() ?? 0
      return at - bt
    })
    cb(list)
  })
}

/** Group stories by author, newest group first; current user's group always first if present. */
export function groupStories(
  stories: Story[],
  currentUid: string | null,
  seenIds: Set<string>,
): StoryGroup[] {
  const map = new Map<string, StoryGroup>()
  for (const s of stories) {
    const t = s.createdAt?.toMillis?.() ?? 0
    let g = map.get(s.authorId)
    if (!g) {
      g = {
        authorId: s.authorId,
        authorName: s.authorName,
        authorPhotoURL: s.authorPhotoURL,
        stories: [],
        hasUnseen: false,
        latestAt: t,
      }
      map.set(s.authorId, g)
    }
    g.stories.push(s)
    if (t > g.latestAt) g.latestAt = t
    if (!seenIds.has(s.id) && s.authorId !== currentUid) g.hasUnseen = true
  }
  for (const g of map.values()) {
    g.stories.sort((a, b) => {
      const at = a.createdAt?.toMillis?.() ?? 0
      const bt = b.createdAt?.toMillis?.() ?? 0
      return at - bt
    })
  }
  const groups = [...map.values()].sort((a, b) => b.latestAt - a.latestAt)
  if (currentUid) {
    const myIdx = groups.findIndex((g) => g.authorId === currentUid)
    if (myIdx > 0) {
      const [mine] = groups.splice(myIdx, 1)
      groups.unshift(mine)
    }
  }
  return groups
}

/** Local-storage backed "seen story" tracking (so the gradient ring fades after viewing). */
const SEEN_KEY = 'foundry.seenStories.v1'

export function loadSeenStories(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(arr)
  } catch {
    return new Set()
  }
}

export function markStoriesSeen(ids: string[]): Set<string> {
  const seen = loadSeenStories()
  for (const id of ids) seen.add(id)
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen].slice(-500)))
  } catch {
    /* ignore quota errors */
  }
  return seen
}

/** Touch a Firestore doc to ping the storage layer; not currently used but kept for parity. */
export async function pingViewed(storyId: string, uid: string) {
  if (!db) return
  try {
    await setDoc(
      doc(db, 'stories', storyId, 'views', uid),
      { at: serverTimestamp() },
      { merge: true },
    )
  } catch {
    /* viewers are a nice-to-have; ignore failures */
  }
}
