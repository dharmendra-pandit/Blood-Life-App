/**
 * asyncHandler — eliminates try/catch boilerplate in every controller.
 * Wraps an async Express route handler and forwards any thrown error
 * to the next() middleware (global error handler).
 *
 * @param {Function} fn - Async route handler (req, res, next)
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler
