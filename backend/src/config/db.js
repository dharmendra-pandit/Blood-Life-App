import mongoose from 'mongoose'
import env from './env.js'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI)
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`[DB] Connection failed: ${error.message}`)
    process.exit(1)
  }
}

// Graceful disconnect on app shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('[DB] MongoDB connection closed (SIGINT)')
  process.exit(0)
})

export default connectDB
