import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

router.post('/advisor', authMiddleware, async (req, res) => {
  const { message } = req.body
  if (!message) return res.status(400).json({ error: 'Message required' })

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const systemPrompt = `You are LEAP AI Advisor — an expert startup mentor and entrepreneurship coach for Indian entrepreneurs. 
Your role is to:
1. Help validate and refine startup ideas
2. Suggest go-to-market strategies for India
3. Explain funding stages (Angel, Seed, Series A/B)
4. Recommend co-founder profiles needed
5. Give actionable advice specific to the Indian startup ecosystem
6. Suggest relevant investors, accelerators (Y Combinator, Sequoia India, Accel, etc.)
7. Help with pitch deck structure

Always be specific, practical, and encouraging. Use simple language. Format responses with clear sections. Keep answers concise but helpful.`

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: 'Namaste! I am your LEAP AI Startup Advisor. I am here to help you build, validate, and grow your startup idea. What would you like to work on today?' }]
        }
      ]
    })

    const result = await chat.sendMessage(message)
    const response = result.response.text()

    // Save to DB
    await pool.query(
      'INSERT INTO ai_conversations (user_id, message, response) VALUES ($1, $2, $3)',
      [req.user.id, message, response]
    )

    res.json({ response })
  } catch (err) {
    console.error('Gemini error:', err.message)
    res.status(500).json({ error: 'AI service error. Please try again.' })
  }
})

// Get conversation history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT message, response, created_at FROM ai_conversations WHERE user_id = $1 ORDER BY created_at ASC LIMIT 50',
      [req.user.id]
    )
    res.json(result.rows)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// Analyze a startup idea
router.post('/analyze-idea', authMiddleware, async (req, res) => {
  const { title, description, industry } = req.body
  if (!title) return res.status(400).json({ error: 'Title required' })

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `Analyze this startup idea for the Indian market:
Title: ${title}
Description: ${description || 'Not provided'}
Industry: ${industry || 'Not specified'}

Provide a structured analysis with:
1. **Idea Score** (1-10) with reasoning
2. **Market Opportunity** in India
3. **Key Strengths** (3 points)
4. **Challenges to Watch** (3 points)
5. **Recommended Next Steps** (actionable)
6. **Funding Readiness** (what stage you can raise at)

Be specific and practical for the Indian startup ecosystem.`

    const result = await model.generateContent(prompt)
    const feedback = result.response.text()
    res.json({ feedback })
  } catch (err) {
    console.error('Gemini error:', err.message)
    res.status(500).json({ error: 'AI analysis failed. Please try again.' })
  }
})

export default router
