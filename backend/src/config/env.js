/**
 * Centralized environment variable validation.
 * Crashes on startup with a clear message if any required var is missing.
 */

const required = ['PORT', 'MONGO_URI', 'JWT_SECRET', 'NODE_ENV']

const missing = required.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.error(`[ENV] Fatal: Missing required environment variables: ${missing.join(', ')}`)
  console.error('[ENV] Check your .env file against .env.example')
  process.exit(1)
}

const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
}

export default env
