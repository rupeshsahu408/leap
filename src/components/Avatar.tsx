type Props = {
  src?: string | null
  name?: string | null
  size?: number
  className?: string
}

export default function Avatar({ src, name, size = 40, className = '' }: Props) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? 'F'
  const dim = `${size}px`
  if (src) {
    return (
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: dim, height: dim }}
      />
    )
  }
  return (
    <div
      className={`rounded-full bg-brand-100 text-brand-700 grid place-items-center font-semibold shrink-0 ${className}`}
      style={{ width: dim, height: dim, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  )
}
