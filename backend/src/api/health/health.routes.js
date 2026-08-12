import { Router } from 'express'
import { getHealthStatus } from './health.controller.js'

const router = Router()

// @route   GET /api/health
router.get('/', getHealthStatus)

export default router
