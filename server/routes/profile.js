import express from 'express'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Update profile
router.put('/', authMiddleware, async (req, res) => {
  const { name, bio, skills, location, linkedin, stage, looking_for } = req.body
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, bio=$2, skills=$3, location=$4, linkedin=$5, stage=$6, looking_for=$7
       WHERE id=$8 RETURNING id, name, email, bio, skills, location, linkedin, stage, looking_for, role`,
      [name, bio, skills, location, linkedin, stage, looking_for, req.user.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get public profile
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, bio, skills, location, stage, looking_for, role, created_at FROM users WHERE id = $1',
      [req.params.id]
    )
    if (!result.rows.length) return res.status(404).json({ error: 'User not found' })
    res.json(result.rows[0])
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
