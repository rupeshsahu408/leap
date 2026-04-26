import { Construction } from 'lucide-react'

type Props = { title: string; phase: string; description: string }

export default function ComingSoon({ title, phase, description }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-10 text-center">
      <div className="size-12 mx-auto grid place-items-center rounded-xl bg-brand-50 text-brand-600">
        <Construction className="size-6" />
      </div>
      <div className="text-xs font-medium text-brand-600 mt-4">{phase}</div>
      <h1 className="font-display text-2xl mt-1">{title}</h1>
      <p className="text-sm text-zinc-500 mt-2 max-w-sm mx-auto">{description}</p>
    </div>
  )
}
