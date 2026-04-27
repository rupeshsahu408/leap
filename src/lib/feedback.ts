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
  where,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'

export type FeedbackKind = 'idea' | 'product' | 'landing'

export const FEEDBACK_KINDS: { kind: FeedbackKind; label: string; emoji: string; blurb: string }[] = [
  { kind: 'idea',    label: 'Idea',         emoji: '💡', blurb: 'Validate a concept before you build it.' },
  { kind: 'product', label: 'Product',      emoji: '🚀', blurb: 'Get honest reviews of something you shipped.' },
  { kind: 'landing', label: 'Landing page', emoji: '🎨', blurb: 'Roast my homepage / waitlist page / pricing.' },
]

export type FeedbackPost = {
  id: string
  kind: FeedbackKind
  title: string
  description: string
  ask: string
  link?: string
  imageUrl?: string
  authorId: string
  authorName: string
  authorPhotoURL?: string
  reviewCount: number
  createdAt?: Timestamp
}

export type FeedbackReview = {
  id: string
  authorId: string
  authorName: string
  authorPhotoURL?: string
  text: string
  rating: number   // 1-5
  createdAt?: Timestamp
}

type CreateInput = {
  kind: FeedbackKind
  title: string
  description: string
  ask: string
  link?: string
  imageUrl?: string
  authorId: string
  authorName: string
  authorPhotoURL?: string
}

export async function createFeedback(input: CreateInput): Promise<string> {
  if (!db) throw new Error('Firestore not configured')
  const ref = await addDoc(collection(db, 'feedback'), {
    kind: input.kind,
    title: input.title.trim(),
    description: input.description.trim(),
    ask: input.ask.trim(),
    link: input.link?.trim() || null,
    imageUrl: input.imageUrl ?? null,
    authorId: input.authorId,
    authorName: input.authorName,
    authorPhotoURL: input.authorPhotoURL ?? null,
    reviewCount: 0,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function deleteFeedback(id: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured')
  await deleteDoc(doc(db, 'feedback', id))
}

export function subscribeFeedback(
  cb: (items: FeedbackPost[]) => void,
  kind?: FeedbackKind,
  max = 100,
): Unsubscribe {
  if (!db) return () => {}
  // Single-field query (no composite index needed): order by createdAt for "all",
  // else fetch by kind without server ordering then sort client-side.
  if (!kind) {
    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'), fbLimit(max))
    return onSnapshot(q, (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FeedbackPost, 'id'>) })))
    })
  }
  const q = query(collection(db, 'feedback'), where('kind', '==', kind), fbLimit(max))
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FeedbackPost, 'id'>) }))
    list.sort((a, b) => {
      const at = a.createdAt?.toMillis?.() ?? 0
      const bt = b.createdAt?.toMillis?.() ?? 0
      return bt - at
    })
    cb(list)
  })
}

export async function fetchFeedback(id: string): Promise<FeedbackPost | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'feedback', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<FeedbackPost, 'id'>) }
}

export function subscribeFeedbackOne(
  id: string,
  cb: (item: FeedbackPost | null) => void,
): Unsubscribe {
  if (!db) return () => {}
  return onSnapshot(doc(db, 'feedback', id), (snap) => {
    if (!snap.exists()) cb(null)
    else cb({ id: snap.id, ...(snap.data() as Omit<FeedbackPost, 'id'>) })
  })
}

export function subscribeReviews(
  feedbackId: string,
  cb: (reviews: FeedbackReview[]) => void,
  max = 100,
): Unsubscribe {
  if (!db) return () => {}
  const q = query(
    collection(db, 'feedback', feedbackId, 'reviews'),
    orderBy('createdAt', 'desc'),
    fbLimit(max),
  )
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FeedbackReview, 'id'>) })),
    )
  })
}

type AddReviewInput = {
  feedbackId: string
  authorId: string
  authorName: string
  authorPhotoURL?: string
  text: string
  rating: number
}

export async function addReview(input: AddReviewInput): Promise<void> {
  if (!db) throw new Error('Firestore not configured')
  const fbRef = doc(db, 'feedback', input.feedbackId)
  const reviewsCol = collection(db, 'feedback', input.feedbackId, 'reviews')
  await runTransaction(db, async (tx) => {
    const f = await tx.get(fbRef)
    if (!f.exists()) throw new Error('Feedback post not found')
    const newRef = doc(reviewsCol)
    tx.set(newRef, {
      authorId: input.authorId,
      authorName: input.authorName,
      authorPhotoURL: input.authorPhotoURL ?? null,
      text: input.text.trim(),
      rating: Math.max(1, Math.min(5, input.rating)),
      createdAt: serverTimestamp(),
    })
    tx.update(fbRef, { reviewCount: increment(1) })
  })
}
