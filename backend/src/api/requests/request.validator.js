import { body, validationResult } from 'express-validator'
import ApiError from '../../utils/ApiError.js'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => `${e.path}: ${e.msg}`)
    throw ApiError.badRequest('Validation failed', messages)
  }
  next()
}

export const createRequestValidator = [
  body('patientName')
    .trim()
    .notEmpty().withMessage('Patient name is required')
    .isLength({ max: 100 }).withMessage('Patient name cannot exceed 100 characters'),

  body('bloodGroupRequired')
    .notEmpty().withMessage('Blood group is required')
    .isIn(BLOOD_GROUPS).withMessage(`Blood group must be one of: ${BLOOD_GROUPS.join(', ')}`),

  body('unitsRequired')
    .notEmpty().withMessage('Units required is required')
    .isInt({ min: 1, max: 10 }).withMessage('Units must be between 1 and 10'),

  body('urgency')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid urgency level'),

  body('hospitalName')
    .trim()
    .notEmpty().withMessage('Hospital name is required')
    .isLength({ max: 150 }).withMessage('Hospital name cannot exceed 150 characters'),

  body('hospitalAddress')
    .trim()
    .notEmpty().withMessage('Hospital address is required')
    .isLength({ max: 300 }).withMessage('Hospital address cannot exceed 300 characters'),

  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),

  body('state')
    .trim()
    .notEmpty().withMessage('State is required'),

  body('contactNumber')
    .notEmpty().withMessage('Contact number is required')
    .matches(/^[0-9]{10}$/).withMessage('Contact number must be a valid 10-digit number'),

  validate,
]
