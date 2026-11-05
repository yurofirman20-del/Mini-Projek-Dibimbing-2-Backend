/**
 * Unit Tests for Product List Router
 * 
 * Tests verify the router logic for:
 * - GET requests returning product list
 * - Non-GET methods throwing MethodNotAllowedError
 */

import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import productListRouter from './productList.js';
import { MethodNotAllowedError } from '../errors/AppErrors.js';
import * as productStore from '../data/productStore.js';

describe('Product List Router', () => {
  describe('GET /', () => {
    it('should call getAllProducts and return products array', () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 10.99 },
        { id: 2, name: 'Product 2', price: 20.99 }
      ];

      // Spy on getAllProducts
      vi.spyOn(productStore, 'getAllProducts').mockReturnValue(mockProducts);

      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        type: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis()
      };
      const next = vi.fn();

      // Get the GET handler from the router stack
      const getHandler = productListRouter.stack.find(
        layer => layer.route && layer.route.methods.get
      ).route.stack[0].handle;

      getHandler(req, res, next);

      expect(productStore.getAllProducts).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.type).toHaveBeenCalledWith('application/json; charset=utf-8');
      expect(res.json).toHaveBeenCalledWith(mockProducts);
      expect(next).not.toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it('should forward errors to next middleware', () => {
      const mockError = new Error('Test error');
      
      // Spy on getAllProducts to throw error
      vi.spyOn(productStore, 'getAllProducts').mockImplementation(() => {
        throw mockError;
      });

      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        type: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis()
      };
      const next = vi.fn();

      // Get the GET handler from the router stack
      const getHandler = productListRouter.stack.find(
        layer => layer.route && layer.route.methods.get
      ).route.stack[0].handle;

      getHandler(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();

      vi.restoreAllMocks();
    });
  });

  describe('Non-GET methods', () => {
    it('should have an all handler that throws MethodNotAllowedError', () => {
      const req = { method: 'POST' };
      const res = {};
      const next = vi.fn();

      // Get the all handler from the router stack
      const allHandler = productListRouter.stack.find(
        layer => layer.route && layer.route.methods._all
      ).route.stack[0].handle;

      allHandler(req, res, next);

      expect(next).toHaveBeenCalled();
      const calledError = next.mock.calls[0][0];
      expect(calledError).toBeInstanceOf(MethodNotAllowedError);
      expect(calledError.message).toBe('Only GET method is allowed');
    });
  });
});
