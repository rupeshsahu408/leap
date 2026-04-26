import { Sparkles } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function Feed() {
  const { profile } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">
          Welcome, <span className="text-brand-600">{profile?.displayName?.split(' ')[0] ?? 'founder'}</span>.
        </h1>
        <p className="text-zinc-500 mt-1">
          Your feed is being forged. Here's what's coming soon.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="size-10 grid place-items-center rounded-xl bg-brand-50 text-brand-600 shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold mb-1">Phase 1 is live: your profile</h2>
            <p className="text-sm text-zinc-600">
              You're signed in and your profile is saved. Up next: the social
              feed (posts, likes, comments) and discovering other founders.
            </p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {ROADMAP.map((r) => (
          <div key={r.title} className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
            <div className="text-xs font-medium text-brand-600 mb-1">{r.phase}</div>
            <div className="font-semibold mb-1">{r.title}</div>
            <div className="text-sm text-zinc-500">{r.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ROADMAP = [
  { phase: 'Phase 2', title: 'Social feed', desc: 'Posts, likes, comments, hashtags, trending.' },
  { phase: 'Phase 3', title: 'Network & DMs', desc: 'Follow, connect, real-time messaging.' },
  { phase: 'Phase 4', title: 'Startup pages', desc: 'Build a public page for your venture.' },
  { phase: 'Phase 5', title: 'Co-founder match', desc: 'Smart matches based on skills & stage.' },
  { phase: 'Phase 6', title: 'AI advisor', desc: 'Gemini-powered idea & pitch coach.' },
  { phase: 'Phase 7', title: 'Investors', desc: 'Pitch to investors, warm intros.' },
]
