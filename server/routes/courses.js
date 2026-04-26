import express from 'express'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Enroll in course
router.post('/enroll', authMiddleware, async (req, res) => {
  const { course_name } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO course_enrollments (user_id, course_name) 
       VALUES ($1, $2) ON CONFLICT (user_id, course_name) DO NOTHING RETURNING *`,
      [req.user.id, course_name]
    )
    if (!result.rows.length) return res.json({ message: 'Already enrolled' })
    res.json({ message: 'Enrolled successfully!', enrollment: result.rows[0] })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// Get my enrollments
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM course_enrollments WHERE user_id = $1 ORDER BY enrolled_at DESC',
      [req.user.id]
    )
    res.json(result.rows)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// Update progress
router.patch('/:id/progress', authMiddleware, async (req, res) => {
  const { progress } = req.body
  try {
    await pool.query(
      'UPDATE course_enrollments SET progress = $1 WHERE id = $2 AND user_id = $3',
      [progress, req.params.id, req.user.id]
    )
    res.json({ message: 'Progress updated' })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
