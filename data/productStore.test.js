/**
 * Unit tests for product data store functions
 * Tests requirements 9.5, 9.6, 9.7
 */

import { describe, test, expect } from 'vitest';
import { getAllProducts, getProductById } from './productStore.js';

describe('Product Data Store', () => {
  describe('getAllProducts()', () => {
    test('should return an array of products', () => {
      const products = getAllProducts();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    });

    test('should return all products with required fields', () => {
      const products = getAllProducts();
      products.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('imageUrl');
        expect(product).toHaveProperty('inStock');
      });
    });
  });

  describe('getProductById()', () => {
    test('should return product when given valid numeric ID', () => {
      const product = getProductById(1);
      expect(product).not.toBeNull();
      expect(product.id).toBe(1);
      expect(product.name).toBe('Wireless Headphones');
    });

    test('should return product when given valid string ID', () => {
      const product = getProductById('2');
      expect(product).not.toBeNull();
      expect(product.id).toBe(2);
      expect(product.name).toBe('Smart Watch');
    });

    test('should return same product for numeric and string versions of same ID', () => {
      const productNumeric = getProductById(3);
      const productString = getProductById('3');
      expect(productNumeric).toEqual(productString);
    });

    test('should return null when product ID does not exist', () => {
      const product = getProductById(999);
      expect(product).toBeNull();
    });

    test('should return null when given non-existent string ID', () => {
      const product = getProductById('nonexistent');
      expect(product).toBeNull();
    });
  });
});
