/**
 * Unit Tests for Error Handler Middleware
 * 
 * Tests verify:
 * - Correct status code mapping for each error type
 * - Error message extraction and truncation
 * - Response format (single "error" field)
 * - Content-Type header setting
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { errorHandler } from './errorHandler.js';
import { ValidationError, NotFoundError, MethodNotAllowedError } from '../errors/AppErrors.js';

describe('errorHandler middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      type: function(contentType) {
        this.contentType = contentType;
        return this;
      },
      json: function(data) {
        this.body = data;
        return this;
      },
      statusCode: null,
      contentType: null,
      body: null
    };
    next = () => {};
  });

  describe('Status Code Mapping', () => {
    it('should return 400 for ValidationError', () => {
      const error = new ValidationError('Invalid input');
      
      errorHandler(error, req, res, next);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid input' });
    });

    it('should return 404 for NotFoundError', () => {
      const error = new NotFoundError('Product not found');
      
      errorHandler(error, req, res, next);
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Product not found' });
    });

    it('should return 405 for MethodNotAllowedError', () => {
      const error = new MethodNotAllowedError('Method not allowed');
      
      errorHandler(error, req, res, next);
      
      expect(res.statusCode).toBe(405);
      expect(res.body).toEqual({ error: 'Method not allowed' });
    });

    it('should return 500 for generic Error', () => {
      const error = new Error('Something went wrong');
      
      errorHandler(error, req, res, next);
      
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Something went wrong' });
    });

    it('should return 500 with default message for Error without message', () => {
      const error = new Error();
      error.message = '';
      
      errorHandler(error, req, res, next);
      
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('Error Message Truncation', () => {
    it('should truncate error messages exceeding 500 characters', () => {
      const longMessage = 'a'.repeat(600);
      const error = new ValidationError(longMessage);
      
      errorHandler(error, req, res, next);
      
      expect(res.body.error.length).toBe(500);
      expect(res.body.error).toBe('a'.repeat(500));
    });

    it('should not truncate error messages under 500 characters', () => {
      const shortMessage = 'This is a short error message';
      const error = new NotFoundError(shortMessage);
      
      errorHandler(error, req, res, next);
      
      expect(res.body.error).toBe(shortMessage);
      expect(res.body.error.length).toBeLessThan(500);
    });

    it('should handle exactly 500 character messages', () => {
      const exactMessage = 'a'.repeat(500);
      const error = new ValidationError(exactMessage);
      
      errorHandler(error, req, res, next);
      
      expect(res.body.error.length).toBe(500);
      expect(res.body.error).toBe(exactMessage);
    });
  });

  describe('Response Format', () => {
    it('should return JSON with single "error" field', () => {
      const error = new ValidationError('Test error');
      
      errorHandler(error, req, res, next);
      
      expect(res.body).toEqual({ error: 'Test error' });
      expect(Object.keys(res.body)).toEqual(['error']);
    });

    it('should set Content-Type to application/json; charset=utf-8', () => {
      const error = new NotFoundError('Not found');
      
      errorHandler(error, req, res, next);
      
      expect(res.contentType).toBe('application/json; charset=utf-8');
    });
  });

  describe('Edge Cases', () => {
    it('should handle error with null message', () => {
      const error = new Error();
      error.message = null;
      
      errorHandler(error, req, res, next);
      
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Internal server error' });
    });

    it('should handle error with undefined message', () => {
      const error = new Error();
      error.message = undefined;
      
      errorHandler(error, req, res, next);
      
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Internal server error' });
    });

    it('should extract message from custom error types', () => {
      const error = new ValidationError('Product ID cannot be empty');
      
      errorHandler(error, req, res, next);
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Product ID cannot be empty');
    });
  });
});
