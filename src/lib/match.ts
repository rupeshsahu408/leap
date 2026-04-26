import type { UserProfile } from './auth'
import type { PublicUser } from './social'

export type MatchReasonType =
  | 'skills'
  | 'stage'
  | 'lookingFor'
  | 'location'
  | 'cofounder'

export type MatchReason = {
  type: MatchReasonType
  label: string
}

export type MatchResult = {
  user: PublicUser
  score: number // 0-100
  reasons: MatchReason[]
}

const COFOUNDER_TAGS = ['co-founder', 'cofounder']

function isCofounderInterest(values?: string[]): boolean {
  if (!values) return false
  return values.some((v) => {
    const low = v.toLowerCase()
    return COFOUNDER_TAGS.some((t) => low.includes(t))
  })
}

export function scoreMatch(me: UserProfile, other: PublicUser): MatchResult {
  let score = 0
  const reasons: MatchReason[] = []

  // 1. Complementary skills — points for skills they have you don't.
  const mySkills = new Set((me.skills ?? []).map((s) => s.toLowerCase()))
  const theirSkills = (other.skills ?? []).map((s) => s.toLowerCase())
  const complementary = theirSkills.filter((s) => s && !mySkills.has(s))
  if (complementary.length > 0) {
    const points = Math.min(30, complementary.length * 10)
    score += points
    reasons.push({
      type: 'skills',
      label: `Brings ${complementary.length} skill${complementary.length > 1 ? 's' : ''} you don't list`,
    })
  }

  // 2. Shared stage
  if (me.stage && other.stage && me.stage === other.stage) {
    score += 20
    reasons.push({ type: 'stage', label: `Both at ${me.stage} stage` })
  }

  // 3. Co-founder intent
  const meCo = isCofounderInterest(me.lookingFor)
  const themCo = isCofounderInterest(other.lookingFor)
  if (meCo && themCo) {
    score += 30
    reasons.push({ type: 'cofounder', label: 'Both looking for a co-founder' })
  } else if (themCo) {
    score += 15
    reasons.push({ type: 'cofounder', label: 'Open to a co-founder' })
  }

  // 4. Other "looking for" overlap
  const myLF = new Set((me.lookingFor ?? []).map((s) => s.toLowerCase()))
  const overlap = (other.lookingFor ?? []).filter((l) => {
    const low = l.toLowerCase()
    return myLF.has(low) && !COFOUNDER_TAGS.some((t) => low.includes(t))
  })
  if (overlap.length > 0) {
    score += Math.min(15, overlap.length * 7)
    reasons.push({
      type: 'lookingFor',
      label: `Aligned on ${overlap.slice(0, 2).join(', ')}`,
    })
  }

  // 5. Same location
  if (
    me.location &&
    other.location &&
    me.location.trim().toLowerCase() === other.location.trim().toLowerCase()
  ) {
    score += 10
    reasons.push({ type: 'location', label: `Both in ${me.location}` })
  }

  return {
    user: other,
    score: Math.min(100, score),
    reasons,
  }
}

export function rankMatches(
  me: UserProfile,
  candidates: PublicUser[],
): MatchResult[] {
  return candidates
    .map((c) => scoreMatch(me, c))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
}
