import express from 'express'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Create idea
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, industry, stage, is_public } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO startup_ideas (user_id, title, description, industry, stage, is_public) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, title, description, industry, stage, is_public || false]
    )
    res.json(result.rows[0])
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// Get my ideas
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM startup_ideas WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    res.json(result.rows)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// Get public ideas feed
router.get('/feed', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT si.*, u.name as author_name FROM startup_ideas si 
       JOIN users u ON si.user_id = u.id
       WHERE si.is_public = true ORDER BY si.created_at DESC LIMIT 20`
    )
    res.json(result.rows)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// Update idea with AI feedback
router.patch('/:id/feedback', authMiddleware, async (req, res) => {
  const { ai_feedback } = req.body
  try {
    await pool.query(
      'UPDATE startup_ideas SET ai_feedback = $1 WHERE id = $2 AND user_id = $3',
      [ai_feedback, req.params.id, req.user.id]
    )
    res.json({ message: 'Feedback saved' })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
