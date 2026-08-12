import User from '../../models/User.js'
import generateToken from '../../utils/generateToken.js'
import asyncHandler from '../../utils/asyncHandler.js'
import ApiError from '../../utils/ApiError.js'
import ApiResponse from '../../utils/ApiResponse.js'
import logger from '../../utils/logger.js'

// ── Register ───────────────────────────────────────────────────────────────
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })
  if (userExists) {
    throw ApiError.conflict('An account with this email already exists')
  }

  const user = await User.create({ name, email, password })

  generateToken(res, user._id)

  logger.audit('USER_REGISTERED', {
    userId: user._id,
    name: user.name,
    email: user.email,
    ip: req.ip,
  })

  res.status(201).json(
    new ApiResponse(201, 'Account created successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }),
  )
})

// ── Login ──────────────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user || !(await user.matchPassword(password))) {
    logger.warn(`Failed login attempt for email: ${email}`, { ip: req.ip })
    throw ApiError.unauthorized('Invalid email or password')
  }

  if (!user.isActive) {
    logger.warn(`Deactivated user login attempt: ${email}`, { userId: user._id })
    throw ApiError.unauthorized('Your account has been deactivated')
  }

  generateToken(res, user._id)

  logger.audit('USER_LOGGED_IN', {
    userId: user._id,
    email: user.email,
    role: user.role,
    ip: req.ip,
  })

  res.status(200).json(
    new ApiResponse(200, 'Logged in successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }),
  )
})

// ── Logout ─────────────────────────────────────────────────────────────────
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  if (req.user) {
    logger.audit('USER_LOGGED_OUT', {
      userId: req.user._id,
      email: req.user.email,
    })
  }

  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'lax',
  })
  res.status(200).json(new ApiResponse(200, 'Logged out successfully'))
})

// ── Get Profile ────────────────────────────────────────────────────────────
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')

  if (!user) {
    throw ApiError.notFound('User not found')
  }

  res.status(200).json(new ApiResponse(200, 'Profile fetched successfully', user))
})
