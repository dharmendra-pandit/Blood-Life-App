import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

// Config — must be imported after dotenv
import env from './src/config/env.js'
import connectDB from './src/config/db.js'

// Routes
import healthRoutes from './src/api/health/health.routes.js'
import authRoutes from './src/api/auth/auth.routes.js'
import donorRoutes from './src/api/donors/donor.routes.js'
import requestRoutes from './src/api/requests/request.routes.js'

// Middleware
import { generalLimiter } from './src/middleware/rateLimiter.middleware.js'
import notFound from './src/middleware/notFound.middleware.js'
import errorHandler from './src/middleware/error.middleware.js'

// ── Connect to Database ───────────────────────────────────────────────────
connectDB()

// ── Create App ────────────────────────────────────────────────────────────
const app = express()

// ── Security Middleware ───────────────────────────────────────────────────
app.use(helmet())
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [env.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173']
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('CORS Policy: Origin not allowed'))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
)

// ── General Middleware ────────────────────────────────────────────────────
app.use(morgan(env.isDevelopment ? 'dev' : 'combined'))
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// ── Global Rate Limiter ───────────────────────────────────────────────────
app.use('/api', generalLimiter)

// ── API Routes ────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/donors', donorRoutes)
app.use('/api/requests', requestRoutes)

// ── Error Handling (must be last) ─────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start Server ──────────────────────────────────────────────────────────
const server = app.listen(env.PORT, () => {
  console.log(`\nServer running in [${env.NODE_ENV}] mode on port ${env.PORT}`)
  console.log(`Health check: http://localhost:${env.PORT}/api/health\n`)
})

// ── Process-Level Global Error Handling ──────────────────────────────────
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err.message)
  console.error(err.stack)
  server.close(() => process.exit(1))
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason)
  server.close(() => process.exit(1))
})

// Graceful shutdown on termination signals
const handleShutdown = (signal) => {
  console.log(`\n[INFO] ${signal} signal received. Closing HTTP server...`)
  server.close(() => {
    console.log('[INFO] HTTP server closed.')
    process.exit(0)
  })
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'))
process.on('SIGINT', () => handleShutdown('SIGINT'))

export default app
