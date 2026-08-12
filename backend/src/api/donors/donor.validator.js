import { body } from 'express-validator'
import ApiError from '../../utils/ApiError.js'
import { validationResult } from 'express-validator'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => `${e.path}: ${e.msg}`)
    throw ApiError.badRequest('Validation failed', messages)
  }
  next()
}

export const donorProfileValidator = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ max: 100 }).withMessage('Full name cannot exceed 100 characters'),

  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),

  body('age')
    .notEmpty().withMessage('Age is required')
    .isInt({ min: 18, max: 65 }).withMessage('Age must be between 18 and 65'),

  body('bloodGroup')
    .notEmpty().withMessage('Blood group is required')
    .isIn(BLOOD_GROUPS).withMessage(`Blood group must be one of: ${BLOOD_GROUPS.join(', ')}`),

  body('mobileNumber')
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[0-9]{10}$/).withMessage('Mobile number must be a valid 10-digit number'),

  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),

  body('state')
    .trim()
    .notEmpty().withMessage('State is required'),

  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ max: 300 }).withMessage('Address cannot exceed 300 characters'),

  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be a boolean'),

  body('lastDonationDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage('lastDonationDate must be a valid date'),

  validate,
]
