import mongoose from 'mongoose'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const URGENCY_LEVELS = ['Low', 'Medium', 'High', 'Critical']
const STATUS_VALUES = ['Pending', 'Fulfilled', 'Expired']

const bloodRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      maxlength: [100, 'Patient name cannot exceed 100 characters'],
    },
    bloodGroupRequired: {
      type: String,
      enum: { values: BLOOD_GROUPS, message: 'Invalid blood group' },
      required: [true, 'Blood group is required'],
      index: true,
    },
    unitsRequired: {
      type: Number,
      required: [true, 'Units required is required'],
      min: [1, 'At least 1 unit must be requested'],
      max: [10, 'Cannot request more than 10 units at once'],
    },
    urgency: {
      type: String,
      enum: { values: URGENCY_LEVELS, message: 'Invalid urgency level' },
      default: 'High',
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
      maxlength: [150, 'Hospital name cannot exceed 150 characters'],
    },
    hospitalAddress: {
      type: String,
      required: [true, 'Hospital address is required'],
      trim: true,
      maxlength: [300, 'Hospital address cannot exceed 300 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit contact number'],
    },
    status: {
      type: String,
      enum: { values: STATUS_VALUES, message: 'Invalid status' },
      default: 'Pending',
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
)

// Compound index for the most common query: active pending requests
bloodRequestSchema.index({ status: 1, expiresAt: 1 })

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema)
export default BloodRequest
