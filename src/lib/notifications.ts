import {
  addDoc,
  collection,
  doc,
  limit as fbLimit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  getDocs,
  writeBatch,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'

export type NotifKind = 'like' | 'comment' | 'follow'

export type AppNotification = {
  id: string
  recipientId: string
  actorId: string
  actorName: string
  actorPhotoURL?: string
  kind: NotifKind
  postId?: string
  postPreview?: string  // first ~80 chars of caption (or empty for image-only)
  postImage?: string
  commentText?: string
  read: boolean
  createdAt?: Timestamp
}

type CreateInput = {
  recipientId: string
  actorId: string
  actorName: string
  actorPhotoURL?: string
  kind: NotifKind
  postId?: string
  postPreview?: string
  postImage?: string
  commentText?: string
}

/** Add a notification. Always silently swallows when actor === recipient. */
export async function notify(input: CreateInput): Promise<void> {
  if (!db) return
  if (input.actorId === input.recipientId) return
  try {
    await addDoc(collection(db, 'notifications'), {
      recipientId: input.recipientId,
      actorId: input.actorId,
      actorName: input.actorName,
      actorPhotoURL: input.actorPhotoURL ?? null,
      kind: input.kind,
      postId: input.postId ?? null,
      postPreview: input.postPreview ?? null,
      postImage: input.postImage ?? null,
      commentText: input.commentText ?? null,
      read: false,
      createdAt: serverTimestamp(),
    })
  } catch {
    /* notifications are best-effort */
  }
}

export function subscribeNotifications(
  uid: string,
  cb: (n: AppNotification[]) => void,
  max = 60,
): Unsubscribe {
  if (!db) return () => {}
  const q = query(
    collection(db, 'notifications'),
    where('recipientId', '==', uid),
    fbLimit(max),
  )
  return onSnapshot(q, (snap) => {
    const list: AppNotification[] = []
    snap.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as Omit<AppNotification, 'id'>) })
    })
    list.sort((a, b) => {
      const at = a.createdAt?.toMillis?.() ?? 0
      const bt = b.createdAt?.toMillis?.() ?? 0
      return bt - at
    })
    cb(list)
  })
}

export function subscribeUnreadCount(
  uid: string,
  cb: (count: number) => void,
): Unsubscribe {
  if (!db) return () => {}
  const q = query(
    collection(db, 'notifications'),
    where('recipientId', '==', uid),
    where('read', '==', false),
    fbLimit(50),
  )
  return onSnapshot(q, (snap) => cb(snap.size))
}

export async function markAllRead(uid: string): Promise<void> {
  if (!db) return
  const q = query(
    collection(db, 'notifications'),
    where('recipientId', '==', uid),
    where('read', '==', false),
    fbLimit(100),
  )
  const snap = await getDocs(q)
  if (snap.empty) return
  const batch = writeBatch(db)
  snap.forEach((d) => batch.update(d.ref, { read: true }))
  await batch.commit()
}

export async function markRead(id: string): Promise<void> {
  if (!db) return
  await updateDoc(doc(db, 'notifications', id), { read: true })
}

/** Used by sidebar so we don't double-create a notification on a quick re-like. */
export async function recordLikeMarker(postId: string, actorId: string) {
  if (!db) return
  try {
    await setDoc(
      doc(db, 'posts', postId, 'likes', actorId),
      { createdAt: serverTimestamp() },
      { merge: true },
    )
  } catch {
    /* no-op */
  }
}

/** Format a single notification's verb + body for display. */
export function summarize(n: AppNotification): { verb: string; tail?: string } {
  switch (n.kind) {
    case 'like':
      return { verb: 'liked your post', tail: n.postPreview }
    case 'comment':
      return { verb: 'commented:', tail: n.commentText }
    case 'follow':
      return { verb: 'started following you' }
  }
}
