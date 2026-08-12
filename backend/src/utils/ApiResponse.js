/**
 * ApiResponse — Standardized success response wrapper.
 * Every successful API response follows the same envelope:
 *   { success: true, message, data }
 *
 * Usage in a controller:
 *   res.status(200).json(new ApiResponse(200, 'Fetched', payload))
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message    - Human-readable success message
   * @param {*}      data       - Response payload (object, array, null)
   */
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400
    this.message = message
    if (data !== null && data !== undefined) {
      this.data = data
    }
  }
}

export default ApiResponse
