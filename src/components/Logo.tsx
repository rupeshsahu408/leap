type Variant = 'compact' | 'wordmark' | 'icon'

type Props = {
  small?: boolean
  variant?: Variant
  className?: string
}

export default function Logo({ small = false, variant = 'compact', className = '' }: Props) {
  if (variant === 'wordmark') {
    return (
      <span className={`wordmark ${small ? 'text-2xl' : 'text-3xl'} leading-none ${className}`}>
        Foundry
      </span>
    )
  }

  if (variant === 'icon') {
    return <IconBadge small={small} className={className} />
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <IconBadge small={small} />
      <span className={`wordmark leading-none ${small ? 'text-xl' : 'text-2xl'}`}>
        Foundry
      </span>
    </div>
  )
}

function IconBadge({ small, className = '' }: { small?: boolean; className?: string }) {
  return (
    <div
      className={`grid place-items-center rounded-2xl bg-foundry text-white shadow-sm ${
        small ? 'size-8' : 'size-9'
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" className={small ? 'size-4' : 'size-5'} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 21V3h13" />
        <path d="M5 12h10" />
      </svg>
    </div>
  )
}
