import ApiError from '../utils/ApiError.js'

/**
 * notFound — Catches any request that didn't match a registered route
 * and forwards a 404 ApiError to the global error handler.
 *
 * Must be placed AFTER all route registrations, BEFORE errorHandler.
 */
const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`))
}

export default notFound
