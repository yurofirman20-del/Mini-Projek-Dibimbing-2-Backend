/**
 * Product Detail Router
 * Handles GET requests to /product-detail/:id endpoint
 * 
 * Validates product IDs and retrieves individual product details
 * from the in-memory data store.
 */

import { Router } from 'express';
import { getProductById } from '../data/productStore.js';
import { ValidationError, NotFoundError } from '../errors/AppErrors.js';

const router = Router();

/**
 * GET /product-detail/:id
 * Retrieve a single product by its ID
 * 
 * Path Parameters:
 *   id - Product identifier (string or numeric)
 * 
 * Validation Rules:
 *   - ID cannot be empty, whitespace-only, or null
 *   - ID length must not exceed 255 characters
 *   - Numeric IDs must be in range 1-2147483647
 * 
 * Success Response:
 *   200 OK - Returns product object
 * 
 * Error Responses:
 *   400 Bad Request - Invalid ID format
 *   404 Not Found - Product does not exist
 *   500 Internal Server Error - Processing failure
 */
router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate ID: reject empty/whitespace-only/null
    // Requirements 5.2, 6.1
    if (!id || id.trim().length === 0) {
      throw new ValidationError('Product ID cannot be empty');
    }
    
    // Validate ID length: reject if exceeds 255 characters
    // Requirements 5.2, 5.5
    if (id.length > 255) {
      throw new ValidationError('Product ID exceeds maximum length');
    }
    
    // For numeric IDs: validate range 1-2147483647
    // Requirement 5.2
    if (!isNaN(id)) {
      const numericId = parseInt(id, 10);
      if (numericId < 1 || numericId > 2147483647) {
        throw new ValidationError('Product ID out of valid range');
      }
    }
    
    // Retrieve product from data store
    // Requirement 5.3
    const product = getProductById(id);
    
    // If product not found, throw NotFoundError
    // Requirements 5.4, 6.2
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
    
    // Return product with 200 status
    // Requirements 5.3, 7.1
    res.status(200)
       .type('application/json; charset=utf-8')
       .json(product);
       
  } catch (error) {
    // Forward all errors to centralized error handler
    next(error);
  }
});

export default router;
