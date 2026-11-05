/**
 * Custom Error Classes for Product API Backend
 * 
 * These error classes are used throughout the application to represent
 * different types of failures with appropriate HTTP status codes:
 * - ValidationError: 400 Bad Request (invalid input)
 * - NotFoundError: 404 Not Found (resource doesn't exist)
 * - MethodNotAllowedError: 405 Method Not Allowed (unsupported HTTP method)
 */

/**
 * ValidationError - Thrown when request input is invalid
 * Maps to HTTP 400 Bad Request
 * 
 * Examples: empty product ID, ID exceeding maximum length, invalid format
 */
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * NotFoundError - Thrown when a requested resource doesn't exist
 * Maps to HTTP 404 Not Found
 * 
 * Examples: product ID not found in data store
 */
export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * MethodNotAllowedError - Thrown when an unsupported HTTP method is used
 * Maps to HTTP 405 Method Not Allowed
 * 
 * Examples: POST to /product-list, DELETE to /product-detail/:id
 */
export class MethodNotAllowedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MethodNotAllowedError';
  }
}
