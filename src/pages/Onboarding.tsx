import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import Logo from '../components/Logo'

const STAGES = [
  'Just an idea',
  'Validating',
  'Building MVP',
  'Launched',
  'Scaling',
  'Looking to join one',
]

const SKILL_SUGGESTIONS = [
  'Product', 'Engineering', 'Design', 'Marketing', 'Sales',
  'Growth', 'Data', 'AI/ML', 'Operations', 'Finance',
]

const LOOKING_FOR = [
  'Co-founder', 'Engineer', 'Designer', 'Marketer',
  'Mentor', 'Investor', 'Customers', 'Just networking',
]

export default function Onboarding() {
  const { user, profile, saveProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [headline, setHeadline] = useState(profile?.headline ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [location, setLocation] = useState(profile?.location ?? '')
  const [stage, setStage] = useState(profile?.stage ?? '')
  const [skills, setSkills] = useState<string[]>(profile?.skills ?? [])
  const [lookingFor, setLookingFor] = useState<string[]>(profile?.lookingFor ?? [])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggle(arr: string[], v: string, set: (a: string[]) => void) {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
  }

  async function finish() {
    setError(null)

    if (!user) {
      setError("You're not signed in. Please refresh and sign in again.")
      return
    }

    setBusy(true)
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Save timed out after 15s. Likely causes: (1) Firestore Database hasn't been created in Firebase Console, (2) Security Rules block writes, or (3) no internet. Open DevTools → Console for the underlying error.",
            ),
          ),
        15000,
      ),
    )

    try {
      await Promise.race([
        saveProfile({
          headline,
          bio,
          location,
          stage,
          skills,
          lookingFor,
          onboarded: true,
        }),
        timeout,
      ])
      navigate('/', { replace: true })
    } catch (e) {
      console.error('[onboarding] saveProfile failed:', e)
      const msg = e instanceof Error ? e.message : 'Could not save profile.'
      // Map Firebase permission errors to a clearer message
      if (/permission|insufficient/i.test(msg)) {
        setError(
          "Firestore rejected the write (Security Rules). In Firebase Console → Firestore Database → Rules, make sure authenticated users can write to /users/{uid}.",
        )
      } else {
        setError(msg)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-line)] bg-white">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <Logo />
          <div className="text-sm text-zinc-500">Step {step} of 3</div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {step === 1 && (
          <section className="animate-fade-in-up space-y-6">
            <div>
              <h1 className="font-display text-3xl mb-1">Tell us about you</h1>
              <p className="text-zinc-500">A short headline + bio so other founders know who you are.</p>
            </div>

            <Field label="Headline">
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Building an AI tutor for kids"
                className="input"
                maxLength={120}
              />
            </Field>

            <Field label="Bio">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What are you working on? What do you care about?"
                rows={4}
                className="input resize-none"
                maxLength={500}
              />
            </Field>

            <Field label="Location">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="input"
              />
            </Field>

            <div className="flex justify-end">
              <button
                disabled={!headline.trim()}
                onClick={() => setStep(2)}
                className="btn-primary"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="animate-fade-in-up space-y-6">
            <div>
              <h1 className="font-display text-3xl mb-1">Where are you in the journey?</h1>
              <p className="text-zinc-500">Pick the stage that fits best.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {STAGES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStage(s)}
                  className={`px-4 py-3 rounded-xl border text-left transition ${
                    stage === s
                      ? 'border-brand-500 bg-brand-50 text-brand-800'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="btn-ghost">Back</button>
              <button disabled={!stage} onClick={() => setStep(3)} className="btn-primary">Continue</button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="animate-fade-in-up space-y-8">
            <div>
              <h1 className="font-display text-3xl mb-1">Your skills & what you need</h1>
              <p className="text-zinc-500">This helps us match you with the right people.</p>
            </div>

            <div>
              <div className="text-sm font-medium mb-3">Your strengths</div>
              <div className="flex flex-wrap gap-2">
                {SKILL_SUGGESTIONS.map((s) => (
                  <Chip key={s} active={skills.includes(s)} onClick={() => toggle(skills, s, setSkills)}>
                    {s}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-3">Looking for</div>
              <div className="flex flex-wrap gap-2">
                {LOOKING_FOR.map((s) => (
                  <Chip key={s} active={lookingFor.includes(s)} onClick={() => toggle(lookingFor, s, setLookingFor)}>
                    {s}
                  </Chip>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="btn-ghost">Back</button>
              <button disabled={busy || skills.length === 0} onClick={finish} className="btn-primary">
                {busy ? 'Saving…' : 'Enter Foundry'}
              </button>
            </div>
          </section>
        )}
      </main>

      <style>{`
        .input { width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; border: 1px solid #e4e4e7; background: white; outline: none; transition: border-color .15s, box-shadow .15s; }
        .input:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,.15); }
        .btn-primary { background: #18181b; color: white; padding: 0.7rem 1.25rem; border-radius: 0.75rem; font-weight: 500; transition: opacity .15s; }
        .btn-primary:hover { opacity: .9; }
        .btn-primary:disabled { opacity: .4; cursor: not-allowed; }
        .btn-ghost { color: #52525b; padding: 0.7rem 1rem; border-radius: 0.75rem; }
        .btn-ghost:hover { background: #f4f4f5; }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-2">{label}</span>
      {children}
    </label>
  )
}

function Chip({
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
      className={`px-3.5 py-1.5 rounded-full text-sm border transition ${
        active
          ? 'bg-brand-500 border-brand-500 text-white'
          : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
      }`}
    >
      {children}
    </button>
  )
}
