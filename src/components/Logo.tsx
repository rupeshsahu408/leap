export default function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`grid place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-sm ${
          small ? 'size-8' : 'size-9'
        }`}
      >
        <svg viewBox="0 0 24 24" className={small ? 'size-4' : 'size-5'} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 21V3h13" />
          <path d="M5 12h10" />
        </svg>
      </div>
      <span className={`font-display font-bold tracking-tight ${small ? 'text-lg' : 'text-xl'}`}>
        Foundry
      </span>
    </div>
  )
}
