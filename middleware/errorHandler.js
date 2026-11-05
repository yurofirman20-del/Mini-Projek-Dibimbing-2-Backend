/**
 * Centralized Error Handler Middleware
 * 
 * This middleware catches all errors thrown in route handlers and
 * returns consistent JSON error responses with appropriate HTTP status codes.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 6.3, 7.1, 7.5
 * 
 * Error Response Format (Requirement 8.1, 8.2):
 * {
 *   "error": "Error message string (max 500 characters)"
 * }
 * 
 * Status Code Mapping:
 * - ValidationError → 400 Bad Request
 * - NotFoundError → 404 Not Found
 * - MethodNotAllowedError → 405 Method Not Allowed
 * - All other errors → 500 Internal Server Error
 * 
 * @param {Error} err - The error object thrown by route handlers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function errorHandler(err, req, res, next) {
  // Default to 500 Internal Server Error
  let statusCode = 500;
  let errorMessage = 'Internal server error';
  
  // Map custom error types to appropriate status codes
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = err.message;
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    errorMessage = err.message;
  } else if (err.name === 'MethodNotAllowedError') {
    statusCode = 405;
    errorMessage = err.message;
  } else if (err.message) {
    // Use error message if available, otherwise use default
    errorMessage = err.message;
  }
  
  // Truncate error message to 500 characters (Requirement 8.1)
  if (errorMessage.length > 500) {
    errorMessage = errorMessage.substring(0, 500);
  }
  
  // Send standardized error response with single "error" field (Requirements 8.1, 8.2)
  // Content-Type set to application/json; charset=utf-8 (Requirements 7.1, 7.5)
  res.status(statusCode)
     .type('application/json; charset=utf-8')
     .json({ error: errorMessage });
}
