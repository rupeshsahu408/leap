import { Link } from 'react-router-dom'
import { Globe, Rocket } from 'lucide-react'
import type { Startup } from '../lib/startups'

export default function StartupCard({ startup }: { startup: Startup }) {
  return (
    <Link
      to={`/startups/${startup.id}`}
      className="block rounded-2xl border border-[var(--color-line)] bg-white p-4 hover:shadow-md transition"
    >
      <div className="flex items-start gap-3">
        <Logo url={startup.logoURL} name={startup.name} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{startup.name}</div>
          <div className="text-sm text-zinc-600 line-clamp-2 mt-0.5">
            {startup.tagline}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {startup.stage && (
              <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-[11px] font-medium">
                {startup.stage}
              </span>
            )}
            {startup.industries?.slice(0, 2).map((ind) => (
              <span key={ind} className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[11px]">
                {ind}
              </span>
            ))}
            {startup.website && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] text-zinc-500">
                <Globe className="size-3" />
                {prettyHost(startup.website)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

function Logo({ url, name }: { url?: string; name: string }) {
  if (url) {
    return (
      <img
        src={url}
        alt=""
        className="size-12 rounded-xl object-cover bg-zinc-100"
        referrerPolicy="no-referrer"
      />
    )
  }
  return (
    <div className="size-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white grid place-items-center font-bold">
      {name?.[0]?.toUpperCase() ?? <Rocket className="size-5" />}
    </div>
  )
}

function prettyHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
