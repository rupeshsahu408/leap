import express from 'express'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Get all entrepreneurs to match with
router.get('/', authMiddleware, async (req, res) => {
  const { skill, stage, location } = req.query
  try {
    let query = `SELECT id, name, bio, skills, location, stage, looking_for, role, created_at 
                 FROM users WHERE id != $1`
    const params = [req.user.id]

    if (skill) {
      params.push(`%${skill}%`)
      query += ` AND skills::text ILIKE $${params.length}`
    }
    if (stage) {
      params.push(stage)
      query += ` AND stage = $${params.length}`
    }
    if (location) {
      params.push(`%${location}%`)
      query += ` AND location ILIKE $${params.length}`
    }

    query += ' ORDER BY created_at DESC LIMIT 50'
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Send connection request
router.post('/connect', authMiddleware, async (req, res) => {
  const { to_user_id, message } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO cofounder_requests (from_user_id, to_user_id, message) 
       VALUES ($1, $2, $3) ON CONFLICT (from_user_id, to_user_id) DO NOTHING RETURNING *`,
      [req.user.id, to_user_id, message || '']
    )
    if (!result.rows.length) return res.json({ message: 'Request already sent' })
    res.json({ message: 'Connection request sent!', request: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Get my connection requests
router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cr.*, u.name as from_name, u.bio as from_bio, u.skills as from_skills 
       FROM cofounder_requests cr
       JOIN users u ON cr.from_user_id = u.id
       WHERE cr.to_user_id = $1 AND cr.status = 'pending'`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// Accept/Reject request
router.patch('/requests/:id', authMiddleware, async (req, res) => {
  const { status } = req.body
  try {
    await pool.query(
      'UPDATE cofounder_requests SET status = $1 WHERE id = $2 AND to_user_id = $3',
      [status, req.params.id, req.user.id]
    )
    res.json({ message: `Request ${status}` })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
