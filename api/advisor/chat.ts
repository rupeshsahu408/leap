import { GoogleGenAI } from '@google/genai'

export const config = { runtime: 'edge' }

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

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return jsonResponse(
      { error: 'GEMINI_API_KEY is not configured on this deployment' },
      500,
    )
  }

  let body: { messages?: ChatMessage[]; profile?: FounderProfile }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return jsonResponse({ error: 'invalid JSON body' }, 400)
  }

  const messages = body.messages
  if (!Array.isArray(messages) || messages.length === 0) {
    return jsonResponse({ error: 'messages array required' }, 400)
  }

  const trimmed = messages.slice(-30).map((m) => ({
    role: m.role === 'model' ? 'model' : 'user',
    parts: [{ text: String(m.text ?? '').slice(0, 8000) }],
  }))

  const ai = new GoogleGenAI({ apiKey })
  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const result = await ai.models.generateContentStream({
          model: 'gemini-2.5-flash',
          contents: trimmed,
          config: {
            maxOutputTokens: 8192,
            systemInstruction: SYSTEM_PROMPT + buildContext(body.profile),
            temperature: 0.7,
          },
        })
        for await (const chunk of result) {
          const text = chunk.text || ''
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ delta: text })}\n\n`),
            )
          }
        }
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`),
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : 'AI error'
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`),
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  })
}
