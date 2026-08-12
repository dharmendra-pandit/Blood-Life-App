import rateLimit from 'express-rate-limit'

/**
 * authLimiter — Strict rate limiter for authentication endpoints.
 * Prevents brute-force attacks on login/register.
 * Allows 15 requests per 15-minute window per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,   // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
})

/**
 * generalLimiter — General limiter for all API routes.
 * Allows 100 requests per minute per IP.
 */
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})
