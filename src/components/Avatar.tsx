type Props = {
  src?: string | null
  name?: string | null
  size?: number
  className?: string
  ring?: boolean
  ringTone?: 'gradient' | 'muted'
}

export default function Avatar({
  src, name, size = 40, className = '', ring = false, ringTone = 'gradient',
}: Props) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? 'F'
  const dim = `${size}px`

  const inner = src ? (
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      className="rounded-full object-cover block"
      style={{ width: dim, height: dim }}
    />
  ) : (
    <div
      className="rounded-full bg-foundry-soft text-zinc-800 grid place-items-center font-semibold"
      style={{ width: dim, height: dim, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  )

  if (!ring) {
    return <div className={`shrink-0 ${className}`}>{inner}</div>
  }

  return (
    <div className={`shrink-0 story-ring ${ringTone === 'muted' ? 'story-ring--muted' : ''} ${className}`}>
      <div className="story-ring-inner">{inner}</div>
    </div>
  )
}
