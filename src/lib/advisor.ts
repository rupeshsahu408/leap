import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  limit as fbLimit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'

export type AdvisorRole = 'user' | 'model'

export type AdvisorMessage = {
  id: string
  role: AdvisorRole
  text: string
  createdAt?: Timestamp
}

export function subscribeAdvisorMessages(
  uid: string,
  cb: (msgs: AdvisorMessage[]) => void,
): Unsubscribe {
  if (!db) return () => {}
  const q = query(
    collection(db, 'users', uid, 'advisor'),
    orderBy('createdAt', 'asc'),
    fbLimit(200),
  )
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => {
        const data = d.data() as Omit<AdvisorMessage, 'id'>
        return { id: d.id, ...data }
      }),
    )
  })
}

export async function appendAdvisorMessage(
  uid: string,
  role: AdvisorRole,
  text: string,
) {
  if (!db) throw new Error('Firestore not configured')
  await addDoc(collection(db, 'users', uid, 'advisor'), {
    role,
    text,
    createdAt: serverTimestamp(),
  })
}

export async function clearAdvisorChat(uid: string) {
  if (!db) return
  const snap = await getDocs(collection(db, 'users', uid, 'advisor'))
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
}
