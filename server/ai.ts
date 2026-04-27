import type { Express, Request, Response } from 'express'
import { GoogleGenAI } from '@google/genai'

// Prefer a real GEMINI_API_KEY (works anywhere — Vercel, local, Replit prod).
// Fall back to Replit's managed AI Integrations vars when running inside Replit
// for free, key-less local development.
const useReplitProxy = !process.env.GEMINI_API_KEY && !!process.env.AI_INTEGRATIONS_GEMINI_BASE_URL

const ai = useReplitProxy
  ? new GoogleGenAI({
      apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
      httpOptions: {
        apiVersion: '',
        baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
      },
    })
  : new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const SYSTEM_PROMPT = `You are Foundry's AI Co-founder Advisor — a senior operator who has founded, scaled, and exited multiple startups, advised early-stage founders, and led product at companies like Stripe and Notion.

Voice & style:
- Warm, direct, concrete. Sound like a trusted mentor, not a chatbot.
- Get to the point fast. No filler ("Great question!", "Certainly!", "I'd be happy to help").
- When you give advice, structure it: name the principle in one line, then give 2-4 concrete next steps.
- Ask one sharp clarifying question if the founder's request is too vague to answer well. Otherwise, just answer.
- Use short paragraphs. Use bold only for emphasis on the key idea, not for headings.
- Never invent stats. If you don't know, say so and suggest how the founder could find out.

You can help with:
- Validating an idea (find the riskiest assumption, design a cheap experiment)
- Drafting a one-line pitch, problem statement, or cold outreach
- Choosing what to build next given the founder's stage
- Finding a co-founder, hiring early team, fundraising strategy
- Pricing, positioning, GTM, retention
- Founder psychology — burnout, focus, decision fatigue, dealing with rejection

Avoid generic platitudes. Always tailor to the founder's specific stage, skills, and what they're looking for.`

type ChatMessage = { role: 'user' | 'model'; text: string }

type FounderProfile = {
  displayName?: string
  headline?: string
  stage?: string
  skills?: string[]
  lookingFor?: string[]
  location?: string
  bio?: string
}

function buildContext(profile?: FounderProfile): string {
  if (!profile) return ''
  const lines = [
    profile.displayName && `Name: ${profile.displayName}`,
    profile.headline && `Headline: ${profile.headline}`,
    profile.stage && `Stage: ${profile.stage}`,
    profile.location && `Location: ${profile.location}`,
    profile.skills?.length && `Skills: ${profile.skills.join(', ')}`,
    profile.lookingFor?.length && `Looking for: ${profile.lookingFor.join(', ')}`,
    profile.bio && `Bio: ${profile.bio}`,
  ].filter(Boolean)
  if (!lines.length) return ''
  return `\n\nFounder context (use this to tailor every answer; reference it naturally, don't quote it back verbatim):\n- ${lines.join('\n- ')}`
}

export function registerAdvisorRoutes(app: Express): void {
  app.post('/api/advisor/chat', async (req: Request, res: Response) => {
    const { messages, profile } = (req.body ?? {}) as {
      messages?: ChatMessage[]
      profile?: FounderProfile
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' })
    }

    if (!process.env.GEMINI_API_KEY && !process.env.AI_INTEGRATIONS_GEMINI_BASE_URL) {
      return res
        .status(500)
        .json({ error: 'AI is not configured (missing GEMINI_API_KEY)' })
    }

    const trimmed = messages.slice(-30).map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(m.text ?? '').slice(0, 8000) }],
    }))

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')
    res.flushHeaders?.()

    try {
      const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: trimmed,
        config: {
          maxOutputTokens: 8192,
          systemInstruction: SYSTEM_PROMPT + buildContext(profile),
          temperature: 0.7,
        },
      })

      for await (const chunk of stream) {
        const text = chunk.text || ''
        if (text) {
          res.write(`data: ${JSON.stringify({ delta: text })}\n\n`)
        }
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
    } catch (err) {
      console.error('[advisor] stream error:', err)
      const message = err instanceof Error ? err.message : 'AI error'
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`)
    } finally {
      res.end()
    }
  })
}
