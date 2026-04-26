import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Rocket, Search } from 'lucide-react'
import {
  fetchAllStartups,
  STAGES,
  type Startup,
} from '../lib/startups'
import StartupCard from '../components/StartupCard'

export default function Startups() {
  const [list, setList] = useState<Startup[] | null>(null)
  const [q, setQ] = useState('')
  const [stage, setStage] = useState<string>('')

  useEffect(() => {
    fetchAllStartups().then(setList)
  }, [])

  const filtered = useMemo(() => {
    if (!list) return null
    return list.filter((s) => {
      if (stage && s.stage !== stage) return false
      if (q.trim()) {
        const needle = q.trim().toLowerCase()
        const hay = `${s.name} ${s.tagline} ${s.description ?? ''} ${(s.industries ?? []).join(' ')}`.toLowerCase()
        if (!hay.includes(needle)) return false
      }
      return true
    })
  }, [list, q, stage])

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">Ventures</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Discover what other founders are building. List yours to find teammates, beta users, or funding.
          </p>
        </div>
        <Link
          to="/startups/new"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-500 text-white text-sm font-medium hover:bg-brand-600"
        >
          <Plus className="size-4" /> New
        </Link>
      </div>

      <div className="relative">
        <Search className="size-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search startups, industries…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm outline-none focus:border-brand-500"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 -mt-1">
        <FilterChip active={stage === ''} onClick={() => setStage('')}>All</FilterChip>
        {STAGES.map((s) => (
          <FilterChip key={s} active={stage === s} onClick={() => setStage(s)}>
            {s}
          </FilterChip>
        ))}
      </div>

      {filtered === null && <Skeleton />}

      {filtered && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-8 text-center">
          <div className="size-10 mx-auto grid place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Rocket className="size-5" />
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            {q || stage ? 'No startups match your filters.' : 'No ventures yet — be the first to launch.'}
          </p>
          <Link
            to="/startups/new"
            className="inline-block mt-4 text-sm font-medium text-brand-600 hover:underline"
          >
            Create your venture →
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {filtered?.map((s) => <StartupCard key={s.id} startup={s} />)}
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
        active
          ? 'bg-zinc-900 text-white border-zinc-900'
          : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
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
          <div className="size-12 rounded-xl bg-zinc-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 bg-zinc-100 rounded" />
            <div className="h-3 w-2/3 bg-zinc-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
