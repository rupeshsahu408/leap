import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import authRoutes from './routes/auth.js'
import aiRoutes from './routes/ai.js'
import cofounderRoutes from './routes/cofounders.js'
import courseRoutes from './routes/courses.js'
import profileRoutes from './routes/profile.js'
import ideasRoutes from './routes/ideas.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.BACKEND_PORT || 3001

app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/cofounders', cofounderRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/ideas', ideasRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`LEAP Backend running on port ${PORT}`)
})
