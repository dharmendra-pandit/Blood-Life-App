import jwt from 'jsonwebtoken'
import env from '../config/env.js'

/**
 * Generates a JWT and stores it as an httpOnly cookie on the response.
 *
 * @param {Object} res    - Express response object
 * @param {string} userId - MongoDB ObjectId of the user
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  })

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: env.isProduction,          // HTTPS only in production
    sameSite: env.isProduction ? 'strict' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  })

  return token
}

export default generateToken
