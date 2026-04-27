export type Room = {
  slug: string
  name: string
  emoji: string
  tagline: string
  blurb: string
  accent: string
}

export const ROOMS: Room[] = [
  {
    slug: 'saas',
    name: 'SaaS Builders',
    emoji: '⚡',
    tagline: 'Recurring revenue, day in day out.',
    blurb: 'B2B & B2C SaaS founders. Pricing, churn, onboarding, growth.',
    accent: 'from-amber-400 to-rose-500',
  },
  {
    slug: 'ai',
    name: 'AI Tinkerers',
    emoji: '🧠',
    tagline: 'Wrappers, agents, fine-tunes — all welcome.',
    blurb: 'For builders shipping AI products. Prompts, evals, latency, costs.',
    accent: 'from-violet-400 to-fuchsia-500',
  },
  {
    slug: 'mobile',
    name: 'Indie Mobile',
    emoji: '📱',
    tagline: 'iOS, Android, ASO, App Store reviews.',
    blurb: 'Solo mobile devs and small teams shipping apps to the stores.',
    accent: 'from-sky-400 to-blue-600',
  },
  {
    slug: 'ecommerce',
    name: 'Shopify & DTC',
    emoji: '🛍️',
    tagline: 'Stores, ads, conversion, fulfillment.',
    blurb: 'DTC brands, Shopify hackers, dropshippers, niche stores.',
    accent: 'from-emerald-400 to-teal-600',
  },
  {
    slug: 'devtools',
    name: 'Devtools & Open Source',
    emoji: '🛠️',
    tagline: 'Builders building for builders.',
    blurb: 'CLIs, libraries, APIs, infra. OSS sustainability welcome.',
    accent: 'from-zinc-700 to-zinc-900',
  },
  {
    slug: 'creators',
    name: 'Creators & Newsletters',
    emoji: '✍️',
    tagline: 'Audience-first businesses.',
    blurb: 'Newsletters, podcasts, info-products, paid communities.',
    accent: 'from-orange-400 to-pink-500',
  },
]

export function getRoom(slug?: string | null): Room | undefined {
  if (!slug) return undefined
  return ROOMS.find((r) => r.slug === slug)
}
