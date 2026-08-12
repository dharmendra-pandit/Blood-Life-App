import axios from 'axios'

const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

// Response Interceptor for Global API Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network or Server Unreachable
    if (!error.response) {
      console.error('[API ERROR] Network Error or Server Unreachable:', error.message)
      error.customMessage = 'Unable to connect to the server. Please check your internet connection.'
      return Promise.reject(error)
    }

    const { status, data } = error.response

    // Standardize error message from backend
    const serverMessage = data?.message || error.message
    error.customMessage = serverMessage

    switch (status) {
      case 401:
        console.warn('[API 401] Unauthorized access')
        break
      case 403:
        console.warn('[API 403] Access forbidden')
        break
      case 404:
        console.warn('[API 404] Resource not found:', error.config.url)
        break
      case 429:
        console.warn('[API 429] Rate limit exceeded')
        break
      case 500:
      default:
        console.error(`[API ${status}] Server Error:`, serverMessage)
        break
    }

    return Promise.reject(error)
  },
)

export default api
