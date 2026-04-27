import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  limit as fbLimit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'

export type Post = {
  id: string
  authorId: string
  authorName: string
  authorPhotoURL?: string
  authorHeadline?: string
  text: string
  imageUrl?: string
  hashtags: string[]
  likeCount: number
  commentCount: number
  roomId?: string          // optional room slug ('saas', 'ai', …) — undefined = general feed
  dailyShipDate?: string   // optional 'YYYY-MM-DD' — set when this is a daily ship reply
  createdAt?: Timestamp
}

export type Comment = {
  id: string
  authorId: string
  authorName: string
  authorPhotoURL?: string
  text: string
  createdAt?: Timestamp
}

export function extractHashtags(text: string): string[] {
  const set = new Set<string>()
  const re = /#([a-zA-Z][a-zA-Z0-9_]{0,30})/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    set.add(m[1].toLowerCase())
  }
  return [...set]
}

type CreatePostInput = {
  authorId: string
  authorName: string
  authorPhotoURL?: string
  authorHeadline?: string
  text: string
  imageUrl?: string
  roomId?: string
  dailyShipDate?: string
}

export async function createPost(input: CreatePostInput): Promise<string> {
  if (!db) throw new Error('Firestore not configured')
  const hashtags = extractHashtags(input.text)
  const ref = await addDoc(collection(db, 'posts'), {
    authorId: input.authorId,
    authorName: input.authorName,
    authorPhotoURL: input.authorPhotoURL ?? null,
    authorHeadline: input.authorHeadline ?? null,
    text: input.text.trim(),
    imageUrl: input.imageUrl ?? null,
    hashtags,
    likeCount: 0,
    commentCount: 0,
    roomId: input.roomId ?? null,
    dailyShipDate: input.dailyShipDate ?? null,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export function subscribeRoomFeed(
  roomId: string,
  cb: (posts: Post[]) => void,
  max = 100,
): Unsubscribe {
  if (!db) return () => {}
  const q = query(
    collection(db, 'posts'),
    where('roomId', '==', roomId),
    fbLimit(max),
  )
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(
      (d) => ({ id: d.id, ...(d.data() as Omit<Post, 'id'>) }),
    )
    list.sort((a, b) => {
      const at = a.createdAt?.toMillis?.() ?? 0
      const bt = b.createdAt?.toMillis?.() ?? 0
      return bt - at
    })
    cb(list)
  })
}

export async function deletePost(postId: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured')
  await deleteDoc(doc(db, 'posts', postId))
}

export function subscribeFeed(
  cb: (posts: Post[]) => void,
  max = 50,
): Unsubscribe {
  if (!db) return () => {}
  const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    fbLimit(max),
  )
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Post, 'id'>) })))
  })
}

export function subscribeUserPosts(
  uid: string,
  cb: (posts: Post[]) => void,
  max = 60,
): Unsubscribe {
  if (!db) return () => {}
  const q = query(
    collection(db, 'posts'),
    where('authorId', '==', uid),
    fbLimit(max),
  )
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(
      (d) => ({ id: d.id, ...(d.data() as Omit<Post, 'id'>) }),
    )
    list.sort((a, b) => {
      const at = a.createdAt?.toMillis?.() ?? 0
      const bt = b.createdAt?.toMillis?.() ?? 0
      return bt - at
    })
    cb(list)
  })
}

export function subscribeFeedByTag(
  tag: string,
  cb: (posts: Post[]) => void,
  max = 100,
): Unsubscribe {
  if (!db) return () => {}
  const q = query(
    collection(db, 'posts'),
    where('hashtags', 'array-contains', tag.toLowerCase()),
    fbLimit(max),
  )
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(
      (d) => ({ id: d.id, ...(d.data() as Omit<Post, 'id'>) }),
    )
    list.sort((a, b) => {
      const at = a.createdAt?.toMillis?.() ?? 0
      const bt = b.createdAt?.toMillis?.() ?? 0
      return bt - at
    })
    cb(list)
  })
}

export function subscribeUserLike(
  postId: string,
  uid: string,
  cb: (liked: boolean) => void,
): Unsubscribe {
  if (!db) return () => {}
  const ref = doc(db, 'posts', postId, 'likes', uid)
  return onSnapshot(ref, (snap) => cb(snap.exists()))
}

export async function toggleLike(postId: string, uid: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured')
  const postRef = doc(db, 'posts', postId)
  const likeRef = doc(db, 'posts', postId, 'likes', uid)
  await runTransaction(db, async (tx) => {
    const likeSnap = await tx.get(likeRef)
    if (likeSnap.exists()) {
      tx.delete(likeRef)
      tx.update(postRef, { likeCount: increment(-1) })
    } else {
      tx.set(likeRef, { createdAt: serverTimestamp() })
      tx.update(postRef, { likeCount: increment(1) })
    }
  })
}

export function subscribeComments(
  postId: string,
  cb: (comments: Comment[]) => void,
  max = 100,
): Unsubscribe {
  if (!db) return () => {}
  const q = query(
    collection(db, 'posts', postId, 'comments'),
    orderBy('createdAt', 'asc'),
    fbLimit(max),
  )
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Comment, 'id'>) })))
  })
}

type AddCommentInput = {
  postId: string
  authorId: string
  authorName: string
  authorPhotoURL?: string
  text: string
}

export async function addComment(input: AddCommentInput): Promise<void> {
  if (!db) throw new Error('Firestore not configured')
  const postRef = doc(db, 'posts', input.postId)
  const commentsRef = collection(db, 'posts', input.postId, 'comments')
  await runTransaction(db, async (tx) => {
    const post = await tx.get(postRef)
    if (!post.exists()) throw new Error('Post not found')
    const newRef = doc(commentsRef)
    tx.set(newRef, {
      authorId: input.authorId,
      authorName: input.authorName,
      authorPhotoURL: input.authorPhotoURL ?? null,
      text: input.text.trim(),
      createdAt: serverTimestamp(),
    })
    tx.update(postRef, { commentCount: increment(1) })
  })
}

export async function getPost(postId: string): Promise<Post | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'posts', postId))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Post, 'id'>) }
}

// Used at user creation to ensure a profile doc; harmless re-export wrapper.
export async function ensureUserDoc(uid: string, data: Record<string, unknown>) {
  if (!db) return
  await setDoc(doc(db, 'users', uid), data, { merge: true })
}
