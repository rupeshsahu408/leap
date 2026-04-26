import express from 'express'
import { createServer as createViteServer } from 'vite'
import { registerAdvisorRoutes } from './ai'

async function main() {
  const app = express()
  app.use(express.json({ limit: '1mb' }))

  registerAdvisorRoutes(app)

  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      host: true,
      allowedHosts: true,
    },
    appType: 'spa',
  })
  app.use(vite.middlewares)

  const port = Number(process.env.PORT) || 5000
  app.listen(port, '0.0.0.0', () => {
    console.log(`Foundry running on http://0.0.0.0:${port}`)
  })
}

main().catch((err) => {
  console.error('Server failed to start:', err)
  process.exit(1)
})
