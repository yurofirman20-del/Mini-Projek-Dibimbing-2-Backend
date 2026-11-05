/**
 * Product List Router
 * Handles GET requests to the /product-list endpoint
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 3.7, 7.1, 7.2
 */

import { Router } from 'express';
import { getAllProducts } from '../data/productStore.js';
import { MethodNotAllowedError } from '../errors/AppErrors.js';

const router = Router();

/**
 * GET / - Retrieve all products
 * Returns: 200 with JSON array of all products
 */
router.get('/', (req, res, next) => {
  try {
    const products = getAllProducts();
    res.status(200)
       .type('application/json; charset=utf-8')
       .json(products);
  } catch (error) {
    // Forward any errors to the centralized error handler
    next(error);
  }
});

/**
 * Handle non-GET methods
 * Requirements: 3.7 - Return 405 for non-GET methods
 */
router.all('/', (req, res, next) => {
  const error = new MethodNotAllowedError('Only GET method is allowed');
  next(error);
});

export default router;
