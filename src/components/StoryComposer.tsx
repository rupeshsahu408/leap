import { useEffect, useRef, useState } from 'react'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { isCloudinaryConfigured, uploadImage } from '../lib/cloudinary'
import { createStory } from '../lib/stories'

type Props = { onClose: () => void; onCreated?: () => void }

export default function StoryComposer({ onClose, onCreated }: Props) {
  const { user, profile } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!file) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    // Auto-open file picker on mount for snappy flow
    if (!file) inputRef.current?.click()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Please pick an image.')
      return
    }
    if (f.size > 8 * 1024 * 1024) {
      setError('Image is too large (max 8 MB).')
      return
    }
    setError(null)
    setFile(f)
  }

  async function handleShare() {
    if (!file || !user || !profile) return
    if (!isCloudinaryConfigured) {
      setError('Image uploads are not configured yet.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const up = await uploadImage(file)
      await createStory({
        authorId: user.uid,
        authorName: profile.displayName || 'Builder',
        authorPhotoURL: profile.photoURL,
        imageUrl: up.url,
        caption: caption.trim() || undefined,
      })
      onCreated?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share story.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-3 animate-fade-in-up"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">
        <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-line)]">
          <h2 className="font-semibold">New story</h2>
          <button
            onClick={onClose}
            className="size-9 grid place-items-center rounded-full hover:bg-zinc-100"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </header>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={pickFile}
        />

        {!preview ? (
          <div className="p-8 text-center">
            <button
              onClick={() => inputRef.current?.click()}
              className="mx-auto flex flex-col items-center gap-3 text-zinc-500 hover:text-zinc-900"
            >
              <span className="size-16 grid place-items-center rounded-2xl bg-zinc-100">
                <ImagePlus className="size-7" />
              </span>
              <span className="text-sm font-medium">Pick a photo</span>
            </button>
          </div>
        ) : (
          <div className="bg-black aspect-[9/16] relative">
            <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-contain" />
            {caption && (
              <div className="absolute bottom-0 left-0 right-0 px-5 py-6 bg-gradient-to-t from-black/70 to-transparent text-white text-[15px] leading-snug">
                {caption}
              </div>
            )}
          </div>
        )}

        <div className="px-4 py-3 border-t border-[var(--color-line)] space-y-3">
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption…"
            maxLength={200}
            className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-line)] text-sm outline-none focus:border-zinc-400"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-between items-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="btn btn-ghost text-sm"
              disabled={submitting}
            >
              {file ? 'Change photo' : 'Pick photo'}
            </button>
            <button
              onClick={handleShare}
              disabled={!file || submitting}
              className="btn bg-foundry text-white hover:opacity-90 disabled:opacity-40 inline-flex items-center gap-2"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Share to story
            </button>
          </div>
          <p className="text-[11px] text-zinc-400">Stories disappear after 24 hours.</p>
        </div>
      </div>
    </div>
  )
}
