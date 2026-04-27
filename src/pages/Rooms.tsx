import { Link } from 'react-router-dom'
import { ROOMS } from '../lib/rooms'

export default function Rooms() {
  return (
    <div className="px-4 md:px-0 pt-5 md:pt-0 pb-6 space-y-5">
      <header>
        <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-1">
          Rooms
        </div>
        <h1 className="font-display text-3xl">Pick a corner. Make some friends.</h1>
        <p className="text-zinc-500 mt-1 text-[15px]">
          Tiny niche-sized rooms. Drop in, drop out, or settle in — whichever feels right today.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-3">
        {ROOMS.map((room) => (
          <Link
            key={room.slug}
            to={`/rooms/${room.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white p-5 hover:border-zinc-300 transition shadow-sm"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${room.accent}`}
              aria-hidden
            />
            <div className="flex items-start gap-3">
              <div
                className={`size-12 rounded-2xl bg-gradient-to-br ${room.accent} grid place-items-center text-white text-2xl shadow-sm shrink-0`}
              >
                {room.emoji}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[15px] group-hover:text-foundry transition">
                  {room.name}
                </div>
                <div className="text-[12.5px] text-zinc-500 mt-0.5 italic">
                  {room.tagline}
                </div>
                <p className="text-[13px] text-zinc-600 mt-2 leading-snug">{room.blurb}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
