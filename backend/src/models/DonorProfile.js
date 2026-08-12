import mongoose from 'mongoose'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const donorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one profile per user
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    gender: {
      type: String,
      enum: { values: ['Male', 'Female', 'Other'], message: 'Invalid gender value' },
      required: [true, 'Gender is required'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Donor must be at least 18 years old'],
      max: [65, 'Donor must be 65 years old or younger'],
    },
    bloodGroup: {
      type: String,
      enum: { values: BLOOD_GROUPS, message: 'Invalid blood group' },
      required: [true, 'Blood group is required'],
      index: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number'],
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
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxlength: [300, 'Address cannot exceed 300 characters'],
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
)

// Compound index for the most common search: blood group + city + availability
donorProfileSchema.index({ bloodGroup: 1, city: 1, isAvailable: 1 })

const DonorProfile = mongoose.model('DonorProfile', donorProfileSchema)
export default DonorProfile
