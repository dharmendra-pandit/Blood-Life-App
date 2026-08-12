import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import env from '../config/env.js'

/**
 * protect — Verifies the JWT from the httpOnly cookie.
 * Attaches the authenticated user to req.user.
 */
export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt

  if (!token) {
    throw ApiError.unauthorized('Not authorized — no token provided')
  }

  const decoded = jwt.verify(token, env.JWT_SECRET)
  const user = await User.findById(decoded.userId).select('-password')

  if (!user) {
    throw ApiError.unauthorized('Not authorized — user no longer exists')
  }

  if (!user.isActive) {
    throw ApiError.unauthorized('Not authorized — account is deactivated')
  }

  req.user = user
  next()
})

/**
 * admin — Ensures the authenticated user has the 'admin' role.
 * Must be used AFTER the protect middleware.
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  next(ApiError.forbidden('Not authorized — admin access required'))
}
