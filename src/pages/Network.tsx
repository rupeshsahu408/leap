import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Rocket, Search, Sparkles, Users } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { fetchPeople, fetchFollowing, type PublicUser } from '../lib/social'
import UserCard from '../components/UserCard'

type Tab = 'discover' | 'following'

export default function Network() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('discover')
  const [people, setPeople] = useState<PublicUser[] | null>(null)
  const [following, setFollowing] = useState<PublicUser[] | null>(null)
  const [q, setQ] = useState('')

  useEffect(() => {
    if (!user) return
    fetchPeople(user.uid).then(setPeople)
  }, [user])

  useEffect(() => {
    if (!user || tab !== 'following') return
    fetchFollowing(user.uid).then(setFollowing)
  }, [user, tab])

  const list = useMemo(() => {
    const src = tab === 'discover' ? people : following
    if (!src) return null
    if (!q.trim()) return src
    const needle = q.trim().toLowerCase()
    return src.filter(
      (u) =>
        u.displayName?.toLowerCase().includes(needle) ||
        u.headline?.toLowerCase().includes(needle) ||
        u.skills?.some((s) => s.toLowerCase().includes(needle)),
    )
  }, [tab, people, following, q])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl">Network</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Find founders, follow people you want to learn from, and message them directly.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          to="/match"
          className="flex items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-gradient-to-br from-brand-500 to-brand-600 text-white p-4 hover:shadow-md transition"
        >
          <div className="size-10 rounded-xl bg-white/20 grid place-items-center backdrop-blur">
            <Sparkles className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">Co-founder Match</div>
            <div className="text-xs text-white/85">Founders ranked for you.</div>
          </div>
          <span className="text-white/90 text-sm font-medium">Open →</span>
        </Link>
        <Link
          to="/startups"
          className="flex items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-white p-4 hover:shadow-sm transition"
        >
          <div className="size-10 rounded-xl bg-brand-50 text-brand-600 grid place-items-center">
            <Rocket className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">Browse ventures</div>
            <div className="text-xs text-zinc-500">See what others are building.</div>
          </div>
          <span className="text-brand-600 text-sm font-medium">Open →</span>
        </Link>
      </div>

      <div className="flex bg-zinc-100 rounded-xl p-1">
        <TabBtn active={tab === 'discover'} onClick={() => setTab('discover')}>
          Discover
        </TabBtn>
        <TabBtn active={tab === 'following'} onClick={() => setTab('following')}>
          Following
        </TabBtn>
      </div>

      <div className="relative">
        <Search className="size-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, headline, or skill"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm outline-none focus:border-brand-500"
        />
      </div>

      {list === null && <Skeleton />}

      {list && list.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-8 text-center">
          <div className="size-10 mx-auto grid place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Users className="size-5" />
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            {tab === 'following'
              ? "You're not following anyone yet. Switch to Discover."
              : q
              ? 'No founders matched your search.'
              : 'No founders here yet — invite some.'}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {list?.map((u) => <UserCard key={u.uid} user={u} />)}
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
        active ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
      }`}
    >
      {children}
    </button>
  )
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-[var(--color-line)] bg-white p-4 flex gap-3 animate-pulse">
          <div className="size-12 rounded-full bg-zinc-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 bg-zinc-100 rounded" />
            <div className="h-3 w-2/3 bg-zinc-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
