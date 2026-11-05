/**
 * Integration tests for Product Detail endpoint
 * Verifies GET /product-detail/:id behavior
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import productDetailRouter from './productDetail.js';
import { errorHandler } from '../middleware/errorHandler.js';

// Create test app
const app = express();
app.use('/product-detail', productDetailRouter);
app.use(errorHandler);

describe('Product Detail Endpoint - Task 7.2', () => {
  describe('Successful product retrieval', () => {
    it('should return 200 with product object for valid ID', async () => {
      const response = await request(app)
        .get('/product-detail/1')
        .expect(200)
        .expect('Content-Type', /application\/json/);
      
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('Wireless Headphones');
      expect(response.body.price).toBe(79.99);
    });

    it('should return product with correct Content-Type header', async () => {
      const response = await request(app)
        .get('/product-detail/2')
        .expect(200);
      
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.headers['content-type']).toContain('charset=utf-8');
    });

    it('should handle string IDs correctly', async () => {
      const response = await request(app)
        .get('/product-detail/3')
        .expect(200);
      
      expect(response.body.id).toBe(3);
      expect(response.body.name).toBe('Laptop Stand');
    });
  });

  describe('Product not found scenarios', () => {
    it('should return 404 when product ID does not exist', async () => {
      const response = await request(app)
        .get('/product-detail/999')
        .expect(404)
        .expect('Content-Type', /application\/json/);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Product with ID 999 not found');
    });

    it('should return 404 for non-existent string ID', async () => {
      const response = await request(app)
        .get('/product-detail/nonexistent')
        .expect(404);
      
      expect(response.body.error).toContain('Product with ID nonexistent not found');
    });
  });

  describe('Validation error scenarios', () => {
    it('should return 400 for whitespace-only ID', async () => {
      // Testing with URL-encoded whitespace
      const response = await request(app)
        .get('/product-detail/%20%20%20')
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Product ID cannot be empty');
    });

    it('should return 400 for ID exceeding 255 characters', async () => {
      const longId = 'a'.repeat(256);
      const response = await request(app)
        .get(`/product-detail/${longId}`)
        .expect(400);
      
      expect(response.body.error).toContain('Product ID exceeds maximum length');
    });

    it('should return 400 for numeric ID out of valid range', async () => {
      const response = await request(app)
        .get('/product-detail/0')
        .expect(400);
      
      expect(response.body.error).toContain('Product ID out of valid range');
    });

    it('should return 400 for numeric ID above maximum', async () => {
      const response = await request(app)
        .get('/product-detail/2147483648')
        .expect(400);
      
      expect(response.body.error).toContain('Product ID out of valid range');
    });
  });

  describe('Error response structure', () => {
    it('should return error response with only error field', async () => {
      const response = await request(app)
        .get('/product-detail/999')
        .expect(404);
      
      const keys = Object.keys(response.body);
      expect(keys).toHaveLength(1);
      expect(keys[0]).toBe('error');
    });

    it('should set correct Content-Type for error responses', async () => {
      const response = await request(app)
        .get('/product-detail/999')
        .expect(404);
      
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.headers['content-type']).toContain('charset=utf-8');
    });
  });

  describe('Error forwarding', () => {
    it('should forward errors to error handler via next()', async () => {
      // This test verifies try-catch wraps all logic and forwards to next()
      // If an error occurs and isn't caught, it would result in different behavior
      const response = await request(app)
        .get('/product-detail/999')
        .expect(404);
      
      // If error handling is working, we get proper JSON error response
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
    });
  });
});
