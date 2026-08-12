import { Router } from 'express'
import {
  createRequest,
  getRequests,
  getMyRequests,
  updateRequestStatus,
} from './request.controller.js'
import { protect } from '../../middleware/auth.middleware.js'
import { createRequestValidator } from './request.validator.js'

const router = Router()

// Public
router.get('/', getRequests)

// Private
router.post('/', protect, createRequestValidator, createRequest)
router.get('/my', protect, getMyRequests)
router.patch('/:id/status', protect, updateRequestStatus)

export default router
