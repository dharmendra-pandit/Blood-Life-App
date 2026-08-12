import ApiError from '../utils/ApiError.js'
import env from '../config/env.js'

/**
 * Global error handling middleware.
 * Must be registered LAST in the Express app (after all routes).
 *
 * Handles:
 *   - ApiError (operational errors — known, expected)
 *   - Mongoose ValidationError
 *   - Mongoose duplicate key error (11000)
 *   - JWT errors
 *   - Unexpected/programming errors
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err

  // ── Convert known error types to ApiError ───────────────────────────

  // Malformed JSON syntax in request body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = ApiError.badRequest('Invalid JSON format in request body')
  }

  // Mongoose cast error (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    error = ApiError.badRequest('Validation failed', messages)
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    error = ApiError.conflict(`Duplicate value for ${field}`)
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token — please log in again')
  }
  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired — please log in again')
  }

  // ── Determine final status and message ──────────────────────────────
  const statusCode = error.statusCode || 500
  const message = error.isOperational ? error.message : 'Something went wrong'

  // ── Log unexpected errors ────────────────────────────────────────────
  if (!error.isOperational) {
    console.error('[ERROR]', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    })
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors?.length ? error.errors : undefined,
    ...(env.isDevelopment && !error.isOperational && { stack: err.stack }),
  })
}

export default errorHandler
