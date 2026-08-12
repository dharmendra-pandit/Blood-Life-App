import { Router } from 'express'
import { registerUser, loginUser, logoutUser, getUserProfile } from './auth.controller.js'
import { protect } from '../../middleware/auth.middleware.js'
import { authLimiter } from '../../middleware/rateLimiter.middleware.js'
import { registerValidator, loginValidator } from './auth.validator.js'

const router = Router()

// Public routes — rate limited
router.post('/register', authLimiter, registerValidator, registerUser)
router.post('/login',    authLimiter, loginValidator,    loginUser)

// Private routes
router.post('/logout',  protect, logoutUser)
router.get('/profile',  protect, getUserProfile)

export default router
