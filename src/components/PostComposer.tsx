import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { createPost } from '../lib/posts'
import { uploadImage, isCloudinaryConfigured } from '../lib/cloudinary'
import Avatar from './Avatar'

type Props = {
  onPosted?: () => void
  autoFocus?: boolean
  variant?: 'card' | 'plain'
}

export default function PostComposer({ onPosted, autoFocus, variant = 'card' }: Props) {
  const { user, profile } = useAuth()
  const fileInput = useRef<HTMLInputElement>(null)
  const [text, setText] = useState('')
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 8 * 1024 * 1024) {
      setError('Image must be under 8MB')
      return
    }
    setError(null)
    setImage({ file, preview: URL.createObjectURL(file) })
  }

  function clearImage() {
    if (image) URL.revokeObjectURL(image.preview)
    setImage(null)
    if (fileInput.current) fileInput.current.value = ''
  }

  async function submit() {
    if (!user || !profile || (!text.trim() && !image)) return
    setBusy(true)
    setError(null)
    try {
      let imageUrl: string | undefined
      if (image) {
        const uploaded = await uploadImage(image.file)
        imageUrl = uploaded.url
      }
      await createPost({
        authorId: user.uid,
        authorName: profile.displayName || user.displayName || 'Founder',
        authorPhotoURL: profile.photoURL || user.photoURL || undefined,
        authorHeadline: profile.headline,
        text,
        imageUrl,
      })
      setText('')
      clearImage()
      onPosted?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to post')
    } finally {
      setBusy(false)
    }
  }

  const canSubmit = !busy && (text.trim().length > 0 || !!image)

  const wrapperCls =
    variant === 'card'
      ? 'rounded-2xl border border-[var(--color-line)] bg-white p-4 shadow-sm'
      : ''

  return (
    <div className={wrapperCls}>
      <div className="flex gap-3">
        <Avatar src={profile?.photoURL} name={profile?.displayName} size={40} />
        <div className="flex-1 min-w-0">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`What are you building, ${profile?.displayName?.split(' ')[0] ?? 'founder'}?`}
            rows={variant === 'card' ? 2 : 5}
            autoFocus={autoFocus}
            className="w-full resize-none outline-none placeholder:text-zinc-400 text-[15px] leading-snug"
            maxLength={2000}
          />

          {image && (
            <div className="relative mt-3 inline-block">
              <img
                src={image.preview}
                alt=""
                className="rounded-xl max-h-72 border border-[var(--color-line)]"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 size-7 rounded-full bg-black/70 text-white grid place-items-center hover:bg-black"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {error && (
            <p className="mt-2 text-xs text-red-600">{error}</p>
          )}

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--color-line)]">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={!isCloudinaryConfigured || busy}
                title={isCloudinaryConfigured ? 'Add image' : 'Image uploads need Cloudinary setup'}
                className="size-9 grid place-items-center rounded-full text-zinc-500 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ImagePlus className="size-5" />
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                hidden
                onChange={pickImage}
              />
              <span className="text-xs text-zinc-400 ml-1">
                {text.length > 1800 ? `${2000 - text.length} left` : ''}
              </span>
            </div>
            <button
              onClick={submit}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
