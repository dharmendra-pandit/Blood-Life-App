import DonorProfile from '../../models/DonorProfile.js'
import asyncHandler from '../../utils/asyncHandler.js'
import ApiError from '../../utils/ApiError.js'
import ApiResponse from '../../utils/ApiResponse.js'

// ── Setup / Update Donor Profile ───────────────────────────────────────────
// @route   POST /api/donors/profile
// @access  Private
export const setupDonorProfile = asyncHandler(async (req, res) => {
  const {
    fullName, gender, age, bloodGroup, mobileNumber,
    city, state, address, lastDonationDate, isAvailable,
  } = req.body

  // Use findOneAndUpdate with upsert to handle both create and update in one query
  const profile = await DonorProfile.findOneAndUpdate(
    { user: req.user._id },
    {
      $set: {
        user: req.user._id,
        fullName, gender, age, bloodGroup, mobileNumber,
        city, state, address, lastDonationDate, isAvailable,
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  )

  const isNew = profile.createdAt.getTime() === profile.updatedAt.getTime()
  const statusCode = isNew ? 201 : 200
  const message = isNew ? 'Donor profile created successfully' : 'Donor profile updated successfully'

  res.status(statusCode).json(new ApiResponse(statusCode, message, profile))
})

// ── Get Authenticated User's Donor Profile ─────────────────────────────────
// @route   GET /api/donors/profile
// @access  Private
export const getDonorProfile = asyncHandler(async (req, res) => {
  const profile = await DonorProfile.findOne({ user: req.user._id })

  if (!profile) {
    throw ApiError.notFound('Donor profile not found — please create one first')
  }

  res.status(200).json(new ApiResponse(200, 'Donor profile fetched successfully', profile))
})

// ── Get All Available Donors (Public Search) ───────────────────────────────
// @route   GET /api/donors?bloodGroup=O+&city=Mumbai&page=1&limit=10
// @access  Public
export const getDonors = asyncHandler(async (req, res) => {
  const { bloodGroup, city, page = 1, limit = 10 } = req.query

  const query = { isAvailable: true }

  if (bloodGroup) query.bloodGroup = bloodGroup
  if (city) query.city = { $regex: city, $options: 'i' }

  const pageNum  = Math.max(1, parseInt(page, 10))
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10))) // cap at 50
  const skip     = (pageNum - 1) * limitNum

  const [donors, total] = await Promise.all([
    DonorProfile.find(query)
      .populate('user', 'name email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    DonorProfile.countDocuments(query),
  ])

  res.status(200).json(
    new ApiResponse(200, 'Donors fetched successfully', {
      donors,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    }),
  )
})
