import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit as fbLimit,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { UserProfile } from './auth'

export type PublicUser = {
  uid: string
  displayName: string
  photoURL?: string
  headline?: string
  bio?: string
  location?: string
  stage?: string
  skills?: string[]
  lookingFor?: string[]
  username?: string
  currentProject?: string
  niche?: string
  canHelpWith?: string[]
  followersCount?: number
  followingCount?: number
}

export async function fetchUser(uid: string): Promise<PublicUser | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  const d = snap.data() as UserProfile
  return {
    uid: snap.id,
    displayName: d.displayName,
    photoURL: d.photoURL,
    headline: d.headline,
    bio: d.bio,
    location: d.location,
    stage: d.stage,
    skills: d.skills,
    lookingFor: d.lookingFor,
    username: d.username,
    currentProject: d.currentProject,
    niche: d.niche,
    canHelpWith: d.canHelpWith,
    followersCount: (d as PublicUser).followersCount ?? 0,
    followingCount: (d as PublicUser).followingCount ?? 0,
  }
}

export async function fetchPeople(excludeUid: string, max = 100): Promise<PublicUser[]> {
  if (!db) return []
  const q = query(
    collection(db, 'users'),
    where('onboarded', '==', true),
    fbLimit(max),
  )
  const snap = await getDocs(q)
  return snap.docs
    .filter((d) => d.id !== excludeUid)
    .map((d) => {
      const x = d.data() as UserProfile
      return {
        uid: d.id,
        displayName: x.displayName,
        photoURL: x.photoURL,
        headline: x.headline,
        bio: x.bio,
        location: x.location,
        stage: x.stage,
        skills: x.skills,
        lookingFor: x.lookingFor,
        username: x.username,
        currentProject: x.currentProject,
        niche: x.niche,
        canHelpWith: x.canHelpWith,
        followersCount: (x as PublicUser).followersCount ?? 0,
        followingCount: (x as PublicUser).followingCount ?? 0,
      }
    })
}

export function subscribeIsFollowing(
  meUid: string,
  otherUid: string,
  cb: (following: boolean) => void,
): Unsubscribe {
  if (!db) return () => {}
  return onSnapshot(
    doc(db, 'users', meUid, 'following', otherUid),
    (snap) => cb(snap.exists()),
  )
}

export async function follow(
  meUid: string,
  otherUid: string,
  actor?: { name: string; photoURL?: string },
): Promise<void> {
  if (!db || meUid === otherUid) return
  const batch = writeBatch(db)
  batch.set(doc(db, 'users', meUid, 'following', otherUid), {
    createdAt: serverTimestamp(),
  })
  batch.set(doc(db, 'users', otherUid, 'followers', meUid), {
    createdAt: serverTimestamp(),
  })
  batch.update(doc(db, 'users', meUid), { followingCount: increment(1) })
  batch.update(doc(db, 'users', otherUid), { followersCount: increment(1) })
  await batch.commit()
  if (actor) {
    const { notify } = await import('./notifications')
    await notify({
      recipientId: otherUid,
      actorId: meUid,
      actorName: actor.name,
      actorPhotoURL: actor.photoURL,
      kind: 'follow',
    })
  }
}

export async function unfollow(meUid: string, otherUid: string): Promise<void> {
  if (!db || meUid === otherUid) return
  const batch = writeBatch(db)
  batch.delete(doc(db, 'users', meUid, 'following', otherUid))
  batch.delete(doc(db, 'users', otherUid, 'followers', meUid))
  batch.update(doc(db, 'users', meUid), { followingCount: increment(-1) })
  batch.update(doc(db, 'users', otherUid), { followersCount: increment(-1) })
  await batch.commit()
}

export async function fetchFollowing(uid: string): Promise<PublicUser[]> {
  if (!db) return []
  const snap = await getDocs(collection(db, 'users', uid, 'following'))
  const ids = snap.docs.map((d) => d.id)
  const users: PublicUser[] = []
  for (const id of ids) {
    const u = await fetchUser(id)
    if (u) users.push(u)
  }
  return users
}
