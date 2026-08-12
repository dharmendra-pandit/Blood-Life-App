/**
 * ApiError — Custom error class for operational (expected) API errors.
 * Extends the native Error class with an HTTP statusCode and an
 * isOperational flag so the global error handler can distinguish
 * between expected API errors and unexpected programming bugs.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 401, 404, 500)
   * @param {string} message - Human-readable error message
   * @param {Array}  errors   - Optional array of validation/field errors
   */
  constructor(statusCode, message, errors = []) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true // expected runtime error (not a bug)
    this.errors = errors
    Error.captureStackTrace(this, this.constructor)
  }

  // ── Convenience factories ─────────────────────────────────────────────
  static badRequest(message = 'Bad request', errors = []) {
    return new ApiError(400, message, errors)
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message)
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message)
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message)
  }

  static conflict(message = 'Conflict') {
    return new ApiError(409, message)
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message)
  }
}

export default ApiError
