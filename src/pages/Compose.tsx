import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import PostComposer from '../components/PostComposer'

export default function Compose() {
  const navigate = useNavigate()
  return (
    <div className="md:max-w-xl md:mx-auto">
      <div className="md:hidden flex items-center gap-2 px-2 py-3 border-b border-[var(--color-line)] bg-white sticky top-14 z-10">
        <button
          onClick={() => navigate(-1)}
          className="size-10 grid place-items-center rounded-full hover:bg-zinc-100 tap"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </button>
        <h1 className="font-semibold text-base">New post</h1>
      </div>

      <div className="px-4 md:px-0 py-4 md:py-0 space-y-4">
        <div className="hidden md:block">
          <h1 className="font-display text-2xl">Share what you're building</h1>
          <p className="text-zinc-500 text-sm mt-1">
            A win, a wall you're stuck on, a tiny demo — anything is welcome here. Add a few #tags so the right people find you.
          </p>
        </div>
        <PostComposer
          autoFocus
          variant="card"
          onPosted={() => navigate('/', { replace: true })}
        />
      </div>
    </div>
  )
}
