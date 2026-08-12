import BloodRequest from '../../models/BloodRequest.js'
import asyncHandler from '../../utils/asyncHandler.js'
import ApiError from '../../utils/ApiError.js'
import ApiResponse from '../../utils/ApiResponse.js'
import logger from '../../utils/logger.js'

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000

// ── Create Blood Request ───────────────────────────────────────────────────
// @route   POST /api/requests
// @access  Private
export const createRequest = asyncHandler(async (req, res) => {
  const {
    patientName, bloodGroupRequired, unitsRequired,
    urgency, hospitalName, hospitalAddress,
    city, state, contactNumber,
  } = req.body

  const expiresAt = new Date(Date.now() + FORTY_EIGHT_HOURS_MS)

  const request = await BloodRequest.create({
    user: req.user._id,
    patientName, bloodGroupRequired, unitsRequired,
    urgency, hospitalName, hospitalAddress,
    city, state, contactNumber, expiresAt,
  })

  logger.audit('BLOOD_REQUEST_CREATED', {
    requestId: request._id,
    userId: req.user._id,
    bloodGroup: bloodGroupRequired,
    urgency,
    city,
  })

  res.status(201).json(new ApiResponse(201, 'Blood request created successfully', request))
})

// ── Get All Active Blood Requests ──────────────────────────────────────────
// @route   GET /api/requests?bloodGroup=O+&city=Mumbai&page=1&limit=10
// @access  Public
export const getRequests = asyncHandler(async (req, res) => {
  const { bloodGroup, city, page = 1, limit = 10 } = req.query

  const query = {
    status: 'Pending',
    expiresAt: { $gt: new Date() },
  }

  if (bloodGroup) query.bloodGroupRequired = bloodGroup
  if (city) query.city = { $regex: city, $options: 'i' }

  const pageNum  = Math.max(1, parseInt(page, 10))
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)))
  const skip     = (pageNum - 1) * limitNum

  const [requests, total] = await Promise.all([
    BloodRequest.find(query)
      .populate('user', 'name')
      .sort({ urgency: -1, createdAt: -1 }) // Critical first, then newest
      .skip(skip)
      .limit(limitNum)
      .lean(),
    BloodRequest.countDocuments(query),
  ])

  res.status(200).json(
    new ApiResponse(200, 'Blood requests fetched successfully', {
      requests,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    }),
  )
})

// ── Get User's Own Requests ────────────────────────────────────────────────
// @route   GET /api/requests/my
// @access  Private
export const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await BloodRequest.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean()

  res.status(200).json(new ApiResponse(200, 'Your blood requests fetched', requests))
})

// ── Fulfill / Close a Request ──────────────────────────────────────────────
// @route   PATCH /api/requests/:id/status
// @access  Private (owner only)
export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  if (!['Fulfilled', 'Expired'].includes(status)) {
    throw ApiError.badRequest('Status must be "Fulfilled" or "Expired"')
  }

  const request = await BloodRequest.findById(req.params.id)

  if (!request) {
    throw ApiError.notFound('Blood request not found')
  }

  if (request.user.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You can only update your own requests')
  }

  request.status = status
  await request.save()

  logger.audit('BLOOD_REQUEST_UPDATED', {
    requestId: request._id,
    userId: req.user._id,
    newStatus: status,
  })

  res.status(200).json(new ApiResponse(200, 'Request status updated', request))
})
