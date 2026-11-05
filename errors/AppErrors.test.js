/**
 * Unit Tests for Custom Error Classes
 * 
 * Tests verify that each error class:
 * - Extends the built-in Error class
 * - Sets the appropriate name property
 * - Preserves the error message
 */

import { describe, it, expect } from 'vitest';
import { ValidationError, NotFoundError, MethodNotAllowedError } from './AppErrors.js';

describe('Custom Error Classes', () => {
  describe('ValidationError', () => {
    it('should create an error with ValidationError name', () => {
      const error = new ValidationError('Invalid input');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Invalid input');
    });

    it('should preserve the error message', () => {
      const message = 'Product ID cannot be empty';
      const error = new ValidationError(message);
      
      expect(error.message).toBe(message);
    });
  });

  describe('NotFoundError', () => {
    it('should create an error with NotFoundError name', () => {
      const error = new NotFoundError('Resource not found');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.name).toBe('NotFoundError');
      expect(error.message).toBe('Resource not found');
    });

    it('should preserve the error message', () => {
      const message = 'Product with ID 999 not found';
      const error = new NotFoundError(message);
      
      expect(error.message).toBe(message);
    });
  });

  describe('MethodNotAllowedError', () => {
    it('should create an error with MethodNotAllowedError name', () => {
      const error = new MethodNotAllowedError('Method not allowed');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(MethodNotAllowedError);
      expect(error.name).toBe('MethodNotAllowedError');
      expect(error.message).toBe('Method not allowed');
    });

    it('should preserve the error message', () => {
      const message = 'Only GET method is allowed';
      const error = new MethodNotAllowedError(message);
      
      expect(error.message).toBe(message);
    });
  });

  describe('Error Stack Traces', () => {
    it('should include stack traces for all error types', () => {
      const validationError = new ValidationError('Test');
      const notFoundError = new NotFoundError('Test');
      const methodNotAllowedError = new MethodNotAllowedError('Test');
      
      expect(validationError.stack).toBeDefined();
      expect(notFoundError.stack).toBeDefined();
      expect(methodNotAllowedError.stack).toBeDefined();
    });
  });
});
