import env from '../config/env.js'

/**
 * Structured Logger utility for backend audit & system logging.
 */
const formatTimestamp = () => new Date().toISOString()

const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] [${formatTimestamp()}] ${message}`, Object.keys(meta).length ? meta : '')
  },

  warn: (message, meta = {}) => {
    console.warn(`[WARN] [${formatTimestamp()}] ${message}`, Object.keys(meta).length ? meta : '')
  },

  error: (message, meta = {}) => {
    console.error(`[ERROR] [${formatTimestamp()}] ${message}`, Object.keys(meta).length ? meta : '')
  },

  /**
   * Audit log for user activities (register, login, logout, data mutations)
   */
  audit: (action, details = {}) => {
    console.log(`\n🔑 [AUDIT] Action: ${action} | Timestamp: ${formatTimestamp()}`)
    console.log(`   Details:`, JSON.stringify(details, null, env.isDevelopment ? 2 : 0))
    console.log('')
  },
}

export default logger
