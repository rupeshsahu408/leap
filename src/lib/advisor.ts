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

export function ventureFeedbackPrompt(v: {
  name: string
  tagline?: string
  description?: string
  stage?: string
  lookingFor?: string[]
  industries?: string[]
}): string {
  const lines: string[] = [
    `Give me sharp, actionable feedback on my venture.`,
    ``,
    `**${v.name}**${v.tagline ? ` — ${v.tagline}` : ''}`,
  ]
  if (v.stage) lines.push(`Stage: ${v.stage}`)
  if (v.industries?.length) lines.push(`Industries: ${v.industries.join(', ')}`)
  if (v.lookingFor?.length)
    lines.push(`Looking for: ${v.lookingFor.join(', ')}`)
  if (v.description) lines.push('', v.description.trim())
  lines.push(
    '',
    `Tell me: (1) the riskiest assumption I'm making, (2) the strongest signal in the idea, and (3) one concrete experiment I should run this week to make progress.`,
  )
  return lines.join('\n')
}

export function postFeedbackPrompt(text: string): string {
  return `I just posted this to my founder network. Tell me what's working, what's weak, and one concrete idea I should follow up with next.\n\n"""\n${text.trim()}\n"""`
}
