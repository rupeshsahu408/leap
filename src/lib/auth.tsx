import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider, isFirebaseConfigured } from './firebase'

export type UserProfile = {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  headline?: string
  bio?: string
  location?: string
  skills?: string[]
  stage?: string
  lookingFor?: string[]
  onboarded?: boolean
  createdAt?: unknown
  updatedAt?: unknown
}

type AuthCtx = {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  configured: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  saveProfile: (patch: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthCtx | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (!u || !db) {
        setProfile(null)
        setLoading(false)
        return
      }
      const ref = doc(db, 'users', u.uid)
      const snap = await getDoc(ref)
      if (!snap.exists()) {
        const seed: UserProfile = {
          uid: u.uid,
          displayName: u.displayName ?? '',
          email: u.email ?? '',
          photoURL: u.photoURL ?? undefined,
          onboarded: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
        await setDoc(ref, seed)
      }
      const liveUnsub = onSnapshot(ref, (s) => {
        setProfile(s.exists() ? (s.data() as UserProfile) : null)
        setLoading(false)
      })
      return () => liveUnsub()
    })
    return () => unsub()
  }, [])

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      profile,
      loading,
      configured: isFirebaseConfigured,
      signInWithGoogle: async () => {
        if (!auth) throw new Error('Firebase is not configured')
        await signInWithPopup(auth, googleProvider)
      },
      signOut: async () => {
        if (!auth) return
        await fbSignOut(auth)
      },
      saveProfile: async (patch) => {
        if (!db || !user) return
        const ref = doc(db, 'users', user.uid)
        await setDoc(
          ref,
          { ...patch, updatedAt: serverTimestamp() },
          { merge: true },
        )
      },
    }),
    [user, profile, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
