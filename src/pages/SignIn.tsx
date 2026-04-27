import { useState } from 'react'
import { useAuth } from '../lib/auth'
import Logo from '../components/Logo'

export default function SignIn() {
  const { signInWithGoogle, configured } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleGoogle() {
    setError(null)
    setBusy(true)
    try {
      await signInWithGoogle()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-zinc-900 via-zinc-900 to-brand-900 text-white">
        <Logo />
        <div className="space-y-6 max-w-md">
          <h1 className="font-display text-5xl leading-tight">
            One small room <br />
            <span className="text-brand-400">for everyone building.</span>
          </h1>
          <p className="text-zinc-300 text-lg">
            Foundry is a hub for solo builders, indie hackers and tiny teams.
            Share what you're shipping today, get sharp feedback, and find the
            handful of people whose journey looks just like yours.
          </p>
          <ul className="space-y-2.5 text-sm text-zinc-300">
            <li className="flex gap-2.5"><span className="text-brand-400">·</span> Daily ship thread — no zero days alone.</li>
            <li className="flex gap-2.5"><span className="text-brand-400">·</span> Niche rooms — SaaS, AI, Mobile, DTC, Devtools.</li>
            <li className="flex gap-2.5"><span className="text-brand-400">·</span> Honest feedback exchange — no "looks great!"</li>
            <li className="flex gap-2.5"><span className="text-brand-400">·</span> Build logs — tell the story behind the launch.</li>
          </ul>
        </div>
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} Foundry. A home for builders.
        </p>
      </div>

      {/* Sign-in panel */}
      <div className="flex flex-col justify-center px-6 py-12 md:px-16">
        <div className="md:hidden mb-10">
          <Logo />
        </div>
        <div className="max-w-sm w-full mx-auto md:mx-0">
          <h2 className="font-display text-3xl mb-2">Welcome in.</h2>
          <p className="text-zinc-500 mb-8">
            Sign in and tell us what you're shipping.
          </p>

          {!configured && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
              Firebase isn't configured yet. Add your Firebase keys to enable
              sign-in.
            </div>
          )}

          <button
            onClick={handleGoogle}
            disabled={busy || !configured}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm font-medium"
          >
            <GoogleIcon />
            {busy ? 'Signing in…' : 'Continue with Google'}
          </button>

          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}

          <p className="mt-8 text-xs text-zinc-400">
            By continuing you agree to our terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.83h5.36c-.23 1.4-1.66 4.1-5.36 4.1-3.23 0-5.86-2.67-5.86-5.96s2.63-5.96 5.86-5.96c1.84 0 3.07.78 3.78 1.46l2.58-2.5C16.79 3.7 14.62 2.7 12 2.7 6.94 2.7 2.85 6.79 2.85 11.85S6.94 21 12 21c6.93 0 9.23-4.86 9.23-7.36 0-.5-.06-.88-.13-1.26H12z" />
    </svg>
  )
}
