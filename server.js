import express from 'express';
import cors from 'cors';
import productListRouter from './routes/productList.js';
import productDetailRouter from './routes/productDetail.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = 3000;

// Configure CORS middleware with specified options
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Add express.json() middleware for JSON body parsing
app.use(express.json());

// Mount route handlers
app.use('/product-list', productListRouter);
app.use('/product-detail', productDetailRouter);

// Error handler middleware (must be last)
app.use(errorHandler);

export { app };

export function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
    }
  });

  // Startup timeout - terminate if not listening within 5 seconds
  setTimeout(() => {
    if (!server.listening) {
      console.error('Server startup timeout');
      process.exit(1);
    }
  }, 5000);

  return server;
}

// Start server when running file directly (not when imported as a module)
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  startServer();
}
