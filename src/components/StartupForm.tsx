import { useRef, useState } from 'react'
import { ImageIcon, Loader2, Trash2 } from 'lucide-react'
import {
  INDUSTRIES,
  LOOKING_FOR,
  STAGES,
  type Stage,
  type StartupInput,
} from '../lib/startups'
import { isCloudinaryConfigured, uploadImage } from '../lib/cloudinary'

type Props = {
  initial?: Partial<StartupInput>
  submitLabel: string
  onSubmit: (data: StartupInput) => Promise<void>
  onCancel?: () => void
}

export default function StartupForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [tagline, setTagline] = useState(initial?.tagline ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [website, setWebsite] = useState(initial?.website ?? '')
  const [stage, setStage] = useState<Stage | ''>(initial?.stage ?? '')
  const [industries, setIndustries] = useState<string[]>(initial?.industries ?? [])
  const [lookingFor, setLookingFor] = useState<string[]>(initial?.lookingFor ?? [])
  const [logoURL, setLogoURL] = useState<string | undefined>(initial?.logoURL)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function toggle(list: string[], val: string, setter: (v: string[]) => void) {
    setter(list.includes(val) ? list.filter((x) => x !== val) : [...list, val])
  }

  async function pickLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!isCloudinaryConfigured) {
      setError('Image uploads not configured.')
      return
    }
    setUploading(true)
    setError('')
    try {
      const up = await uploadImage(file)
      setLogoURL(up.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    if (!name.trim() || !tagline.trim()) {
      setError('Name and tagline are required.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await onSubmit({
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim() || undefined,
        website: website.trim() || undefined,
        logoURL,
        stage: stage || undefined,
        industries,
        lookingFor,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo + name */}
      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5 space-y-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="size-20 rounded-2xl bg-zinc-100 grid place-items-center overflow-hidden hover:ring-2 hover:ring-brand-400 transition"
          >
            {uploading ? (
              <Loader2 className="size-5 animate-spin text-zinc-400" />
            ) : logoURL ? (
              <img src={logoURL} alt="" className="size-full object-cover" />
            ) : (
              <ImageIcon className="size-6 text-zinc-400" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={pickLogo}
          />
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Logo</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-xs px-3 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-50"
                >
                  {logoURL ? 'Change' : 'Upload'}
                </button>
                {logoURL && (
                  <button
                    type="button"
                    onClick={() => setLogoURL(undefined)}
                    className="text-xs px-3 py-1.5 rounded-full text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
                  >
                    <Trash2 className="size-3" /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Field label="Startup name" required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="input"
            placeholder="e.g. Foundry"
          />
        </Field>

        <Field label="Tagline" required help="One line that captures what you're building.">
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            maxLength={120}
            className="input"
            placeholder="The network for entrepreneurs."
          />
        </Field>
      </div>

      {/* Description + link */}
      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5 space-y-4">
        <Field label="About" help="Problem you solve, who it's for, what's special.">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            maxLength={1500}
            className="input resize-none"
            placeholder="Describe what you're building…"
          />
          <div className="text-[11px] text-zinc-400 text-right mt-1">{description.length}/1500</div>
        </Field>

        <Field label="Website">
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            type="url"
            className="input"
            placeholder="https://"
          />
        </Field>
      </div>

      {/* Stage */}
      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <h3 className="font-semibold mb-3">Stage</h3>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStage(stage === s ? '' : s)}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${
                stage === s
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Industries */}
      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <h3 className="font-semibold mb-3">Industries</h3>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              type="button"
              onClick={() => toggle(industries, ind, setIndustries)}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${
                industries.includes(ind)
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Looking for */}
      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <h3 className="font-semibold mb-3">Looking for</h3>
        <div className="flex flex-wrap gap-2">
          {LOOKING_FOR.map((lf) => (
            <button
              key={lf}
              type="button"
              onClick={() => toggle(lookingFor, lf, setLookingFor)}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${
                lookingFor.includes(lf)
                  ? 'bg-brand-50 text-brand-700 border-brand-300'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {lf}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex gap-3 sticky bottom-20 md:static">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="flex-1 px-4 py-3 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 disabled:opacity-50"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 rounded-xl bg-white border border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

function Field({
  label,
  required,
  help,
  children,
}: {
  label: string
  required?: boolean
  help?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-zinc-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </div>
      {children}
      {help && <div className="text-xs text-zinc-500 mt-1">{help}</div>}
    </label>
  )
}
