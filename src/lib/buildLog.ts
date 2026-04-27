import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit as fbLimit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'

export type BuildLogKind = 'update' | 'milestone' | 'learning' | 'ship'

export const KIND_META: Record<BuildLogKind, { label: string; emoji: string }> = {
  update: { label: 'Update', emoji: '📝' },
  ship: { label: 'Ship', emoji: '🚀' },
  milestone: { label: 'Milestone', emoji: '🏆' },
  learning: { label: 'Learning', emoji: '💡' },
}

export type BuildLogEntry = {
  id: string
  startupId: string
  authorId: string
  authorName: string
  authorPhotoURL?: string
  text: string
  kind: BuildLogKind
  createdAt?: Timestamp
}

type AddInput = {
  startupId: string
  authorId: string
  authorName: string
  authorPhotoURL?: string
  text: string
  kind: BuildLogKind
}

export async function addLogEntry(input: AddInput): Promise<string> {
  if (!db) throw new Error('Firestore not configured')
  const ref = await addDoc(collection(db, 'startups', input.startupId, 'log'), {
    authorId: input.authorId,
    authorName: input.authorName,
    authorPhotoURL: input.authorPhotoURL ?? null,
    text: input.text.trim(),
    kind: input.kind,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function deleteLogEntry(startupId: string, entryId: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured')
  await deleteDoc(doc(db, 'startups', startupId, 'log', entryId))
}

export function subscribeBuildLog(
  startupId: string,
  cb: (entries: BuildLogEntry[]) => void,
  max = 100,
): Unsubscribe {
  if (!db) return () => {}
  const q = query(
    collection(db, 'startups', startupId, 'log'),
    orderBy('createdAt', 'desc'),
    fbLimit(max),
  )
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => ({
        id: d.id,
        startupId,
        ...(d.data() as Omit<BuildLogEntry, 'id' | 'startupId'>),
      })),
    )
  })
}
