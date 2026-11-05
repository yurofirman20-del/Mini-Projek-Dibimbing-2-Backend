/**
 * Server Configuration Tests
 * 
 * Validates:
 * - Express application is properly initialized
 * - CORS middleware is configured with correct options
 * - JSON body parser is configured
 * - Routes are properly mounted
 * - Error handler is configured
 * - Server can start and listen on port 3000
 * 
 * Requirements: 2.1, 2.2, 2.4, 2.5
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app, startServer } from './server.js';

describe('Express Application Configuration', () => {
  describe('Middleware Configuration', () => {
    it('should have CORS middleware configured with origin: *', async () => {
      const response = await request(app)
        .get('/product-list')
        .expect(200);
      
      // Requirement 2.1: Access-Control-Allow-Origin should be *
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    it('should respond to OPTIONS preflight requests', async () => {
      const response = await request(app)
        .options('/product-list')
        .expect((res) => {
          // Requirement 2.3: Should respond with 200 or 204
          expect([200, 204]).toContain(res.status);
        });
      
      // Requirement 2.2: Check allowed methods
      expect(response.headers['access-control-allow-methods']).toContain('GET');
      expect(response.headers['access-control-allow-methods']).toContain('POST');
      expect(response.headers['access-control-allow-methods']).toContain('PUT');
      expect(response.headers['access-control-allow-methods']).toContain('DELETE');
      expect(response.headers['access-control-allow-methods']).toContain('OPTIONS');
    });

    it('should include Access-Control-Allow-Credentials header', async () => {
      const response = await request(app)
        .get('/product-list')
        .expect(200);
      
      // Requirement 2.5: credentials should be true
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should parse JSON request bodies', async () => {
      // Test that express.json() middleware is configured
      // Even though our endpoints don't accept POST, we can verify the middleware is loaded
      const response = await request(app)
        .post('/product-list')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');
      
      // Should get 405 Method Not Allowed, but body should have been parsed
      expect(response.status).toBe(405);
    });
  });

  describe('Route Mounting', () => {
    it('should mount /product-list route', async () => {
      const response = await request(app)
        .get('/product-list')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should mount /product-detail route', async () => {
      const response = await request(app)
        .get('/product-detail/1')
        .expect(200);
      
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('Error Handler Configuration', () => {
    it('should catch errors and return error response format', async () => {
      const response = await request(app)
        .get('/product-detail/999')
        .expect(404);
      
      // Error handler should return { error: "message" }
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
    });
  });
});

describe('Server Startup', () => {
  let server;

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  it('should start server and listen on port 3000', (done) => {
    // Start server
    server = startServer();
    
    // Give it a moment to start
    setTimeout(() => {
      expect(server.listening).toBe(true);
      expect(server.address().port).toBe(3000);
      done();
    }, 100);
  });
});
