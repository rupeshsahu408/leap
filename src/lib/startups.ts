import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit as fbLimit,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'

export const STAGES = ['Idea', 'MVP', 'Beta', 'Launched', 'Revenue', 'Scaling'] as const
export type Stage = (typeof STAGES)[number]

export const INDUSTRIES = [
  'AI/ML',
  'SaaS',
  'Fintech',
  'Health',
  'Education',
  'Climate',
  'Consumer',
  'Marketplace',
  'Devtools',
  'Hardware',
  'Web3',
  'Other',
] as const

export const LOOKING_FOR = [
  'Co-founder',
  'First hires',
  'Advisors',
  'Beta users',
  'Funding',
  'Mentorship',
] as const

export type Startup = {
  id: string
  name: string
  tagline: string
  description?: string
  logoURL?: string
  website?: string
  stage?: Stage
  industries: string[]
  lookingFor: string[]
  ownerId: string
  teamIds: string[]
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export type StartupInput = Omit<Startup, 'id' | 'ownerId' | 'teamIds' | 'createdAt' | 'updatedAt'>

export async function createStartup(input: StartupInput, ownerId: string): Promise<string> {
  if (!db) throw new Error('Firestore not configured')
  const ref = await addDoc(collection(db, 'startups'), {
    ...input,
    ownerId,
    teamIds: [ownerId],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateStartup(id: string, patch: Partial<StartupInput>): Promise<void> {
  if (!db) throw new Error('Firestore not configured')
  await updateDoc(doc(db, 'startups', id), {
    ...patch,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteStartup(id: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured')
  await deleteDoc(doc(db, 'startups', id))
}

export async function fetchStartup(id: string): Promise<Startup | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'startups', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Startup, 'id'>) }
}

export function subscribeStartup(
  id: string,
  cb: (s: Startup | null) => void,
): Unsubscribe {
  if (!db) return () => {}
  return onSnapshot(doc(db, 'startups', id), (snap) => {
    if (!snap.exists()) cb(null)
    else cb({ id: snap.id, ...(snap.data() as Omit<Startup, 'id'>) })
  })
}

export async function fetchAllStartups(max = 100): Promise<Startup[]> {
  if (!db) return []
  const q = query(collection(db, 'startups'), fbLimit(max))
  const snap = await getDocs(q)
  const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Startup, 'id'>) }))
  list.sort((a, b) => {
    const at = a.createdAt?.toMillis?.() ?? 0
    const bt = b.createdAt?.toMillis?.() ?? 0
    return bt - at
  })
  return list
}

export async function fetchStartupsByMember(uid: string): Promise<Startup[]> {
  if (!db) return []
  const q = query(
    collection(db, 'startups'),
    where('teamIds', 'array-contains', uid),
    fbLimit(50),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Startup, 'id'>) }))
}

export async function addTeammate(id: string, uid: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured')
  await updateDoc(doc(db, 'startups', id), {
    teamIds: arrayUnion(uid),
    updatedAt: serverTimestamp(),
  })
}

export async function removeTeammate(id: string, uid: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured')
  await updateDoc(doc(db, 'startups', id), {
    teamIds: arrayRemove(uid),
    updatedAt: serverTimestamp(),
  })
}
