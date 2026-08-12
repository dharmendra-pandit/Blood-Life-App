import mongoose from 'mongoose'
import asyncHandler from '../../utils/asyncHandler.js'
import ApiResponse from '../../utils/ApiResponse.js'
import env from '../../config/env.js'

// DB Connection states mapping
const DB_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
}

// ── Health Check Controller ───────────────────────────────────────────────
// @route   GET /api/health
// @access  Public
export const getHealthStatus = asyncHandler(async (req, res) => {
  const dbState = DB_STATES[mongoose.connection.readyState] || 'unknown'

  const healthData = {
    status: 'UP',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbState,
      isConnected: mongoose.connection.readyState === 1,
    },
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'API health check successful', healthData))
})
