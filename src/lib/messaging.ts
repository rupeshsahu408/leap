import {
  addDoc,
  collection,
  doc,
  getDoc,
  limit as fbLimit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'

export type Conversation = {
  id: string
  participantIds: string[]
  participants: Record<
    string,
    { displayName: string; photoURL?: string | null }
  >
  lastMessage: string
  lastMessageAt?: Timestamp
  lastMessageBy: string
}

export type Message = {
  id: string
  senderId: string
  text: string
  createdAt?: Timestamp
}

export function conversationId(a: string, b: string): string {
  return [a, b].sort().join('__')
}

type Party = { uid: string; displayName: string; photoURL?: string | null }

export async function ensureConversation(me: Party, other: Party): Promise<string> {
  if (!db) throw new Error('Firestore not configured')
  const id = conversationId(me.uid, other.uid)
  const ref = doc(db, 'conversations', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      participantIds: [me.uid, other.uid].sort(),
      participants: {
        [me.uid]: { displayName: me.displayName, photoURL: me.photoURL ?? null },
        [other.uid]: { displayName: other.displayName, photoURL: other.photoURL ?? null },
      },
      lastMessage: '',
      lastMessageAt: serverTimestamp(),
      lastMessageBy: '',
    })
  }
  return id
}

export function subscribeMyConversations(
  uid: string,
  cb: (conversations: Conversation[]) => void,
): Unsubscribe {
  if (!db) return () => {}
  const q = query(
    collection(db, 'conversations'),
    where('participantIds', 'array-contains', uid),
    fbLimit(100),
  )
  return onSnapshot(q, (snap) => {
    const list: Conversation[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Conversation, 'id'>),
    }))
    list.sort((a, b) => {
      const at = a.lastMessageAt?.toMillis?.() ?? 0
      const bt = b.lastMessageAt?.toMillis?.() ?? 0
      return bt - at
    })
    cb(list)
  })
}

export function subscribeConversation(
  convId: string,
  cb: (c: Conversation | null) => void,
): Unsubscribe {
  if (!db) return () => {}
  return onSnapshot(doc(db, 'conversations', convId), (snap) => {
    if (!snap.exists()) cb(null)
    else cb({ id: snap.id, ...(snap.data() as Omit<Conversation, 'id'>) })
  })
}

export function subscribeMessages(
  convId: string,
  cb: (msgs: Message[]) => void,
  max = 200,
): Unsubscribe {
  if (!db) return () => {}
  const q = query(
    collection(db, 'conversations', convId, 'messages'),
    orderBy('createdAt', 'asc'),
    fbLimit(max),
  )
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, 'id'>) })))
  })
}

export async function sendMessage(
  convId: string,
  senderId: string,
  text: string,
): Promise<void> {
  if (!db) throw new Error('Firestore not configured')
  const trimmed = text.trim()
  if (!trimmed) return
  const messages = collection(db, 'conversations', convId, 'messages')
  await addDoc(messages, {
    senderId,
    text: trimmed,
    createdAt: serverTimestamp(),
  })
  await updateDoc(doc(db, 'conversations', convId), {
    lastMessage: trimmed,
    lastMessageAt: serverTimestamp(),
    lastMessageBy: senderId,
  })
}
