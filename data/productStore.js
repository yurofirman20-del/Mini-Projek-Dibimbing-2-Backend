/**
 * In-memory product data store
 * Provides product data and access functions for the Product API
 */

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 79.99,
    description: 'High-quality wireless headphones with active noise cancellation technology. Features 30-hour battery life, comfortable over-ear design, and premium sound quality.',
    category: 'Electronics',
    imageUrl: '/images/headphones.jpg',
    inStock: true
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    description: 'Feature-rich smartwatch with fitness tracking, heart rate monitoring, GPS, and smartphone notifications. Water-resistant design perfect for active lifestyles.',
    category: 'Electronics',
    imageUrl: '/images/watch.jpg',
    inStock: true
  },
  {
    id: 3,
    name: 'Laptop Stand',
    price: 34.99,
    description: 'Ergonomic aluminum laptop stand with adjustable height and angle. Improves posture and provides better cooling for your device.',
    category: 'Accessories',
    imageUrl: '/images/stand.jpg',
    inStock: true
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    price: 129.99,
    description: 'RGB mechanical keyboard with custom switches, programmable keys, and durable aluminum frame. Perfect for gaming and productivity.',
    category: 'Electronics',
    imageUrl: '/images/keyboard.jpg',
    inStock: false
  },
  {
    id: 5,
    name: 'USB-C Hub',
    price: 49.99,
    description: 'Multi-port USB-C hub with power delivery support. Includes HDMI, USB 3.0 ports, SD card reader, and ethernet connection.',
    category: 'Accessories',
    imageUrl: '/images/hub.jpg',
    inStock: true
  },
  {
    id: 6,
    name: 'Wireless Mouse',
    price: 24.95,
    description: 'Compact wireless mouse with precise optical tracking and long battery life. Ergonomic design fits comfortably in your hand.',
    category: 'Accessories',
    imageUrl: '/images/mouse.jpg',
    inStock: true
  }
];

/**
 * Get all products from the in-memory store
 * @returns {Array} Array of all product objects
 */
export function getAllProducts() {
  return products;
}

/**
 * Get a single product by ID
 * Supports both string and numeric IDs
 * @param {string|number} id - The product ID to search for
 * @returns {Object|null} The product object if found, null otherwise
 */
export function getProductById(id) {
  // Support both string and numeric IDs by converting both to strings for comparison
  return products.find(p => p.id.toString() === id.toString()) || null;
}
