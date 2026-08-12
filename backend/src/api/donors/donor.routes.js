import { Router } from 'express'
import { setupDonorProfile, getDonorProfile, getDonors } from './donor.controller.js'
import { protect } from '../../middleware/auth.middleware.js'
import { donorProfileValidator } from './donor.validator.js'

const router = Router()

// Public — search donors
router.get('/', getDonors)

// Private — manage own donor profile
router.route('/profile')
  .get(protect, getDonorProfile)
  .post(protect, donorProfileValidator, setupDonorProfile)

export default router
