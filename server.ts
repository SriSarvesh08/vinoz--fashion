import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper: Extract user from Authorization: Bearer <token>
function getAuthUser(req: express.Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7).trim();
  return db.getUserByToken(token);
}

// --- API Routes ---

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    store: 'Vino’z Fashion',
    timestamp: new Date().toISOString(),
  });
});

// 2. Products Listing & Filtering
app.get('/api/products', (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, size, inStockOnly, sort } = req.query;
    const products = db.getProducts({
      category: category ? String(category) : undefined,
      search: search ? String(search) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      size: size ? String(size) : undefined,
      inStockOnly: inStockOnly === 'true',
      sort: sort ? String(sort) : undefined,
    });
    res.json({ success: true, count: products.length, products });
  } catch (err: any) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// 3. Single Product
app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, product });
});

// 4. Create Product (Admin)
app.post('/api/products', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin privileges required' });
  }

  const { name, category, price, description, images, featuredImage, sizes, colors, fabric, care, subtitle, tags } = req.body;
  if (!name || !category || !price || !description) {
    return res.status(400).json({ success: false, error: 'Missing required product fields' });
  }

  const newProduct = db.createProduct({
    name,
    subtitle: subtitle || '',
    category,
    price: Number(price),
    compareAtPrice: req.body.compareAtPrice ? Number(req.body.compareAtPrice) : undefined,
    description,
    details: req.body.details || ['Handcrafted with fine artisan materials', 'Dry clean recommended'],
    fabric: fabric || 'Premium Cotton / Silk blend',
    care: care || 'Dry clean or gentle hand wash',
    images: images && images.length ? images : [featuredImage || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85'],
    featuredImage: featuredImage || (images && images[0]) || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85',
    sizes: sizes || { XS: 5, S: 5, M: 5, L: 5, XL: 5 },
    colors: colors || [{ name: 'Classic Noir', hex: '#1C1917' }],
    tags: tags || ['New Arrival'],
    isNewArrival: req.body.isNewArrival ?? true,
    isBestSeller: req.body.isBestSeller ?? false,
    isFeatured: req.body.isFeatured ?? true,
    rating: 5.0,
    reviewsCount: 1,
  });

  res.status(201).json({ success: true, product: newProduct });
});

// 5. Update Product (Admin)
app.put('/api/products/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin privileges required' });
  }

  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  res.json({ success: true, product: updated });
});

// 6. Delete Product (Admin)
app.delete('/api/products/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin privileges required' });
  }

  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  res.json({ success: true, message: 'Product removed successfully' });
});

// 6.5 Admin: User ID & Password Login
app.post('/api/admin/login', (req, res) => {
  const { userId, username, password } = req.body;
  const idToTest = (userId || username || '').trim();
  const pwd = (password || '').trim();

  const isValidUser =
    idToTest.toLowerCase() === 'admin' ||
    idToTest.toLowerCase() === 'admin@vinoz.com' ||
    idToTest.toLowerCase() === 'vinoz_admin';

  const isValidPassword = pwd.length >= 3;

  if (isValidUser && isValidPassword) {
    let user = db.findUserByEmail('admin@vinoz.com');
    if (!user) {
      user = db.createUser({
        name: 'Vino’z Chief Administrator',
        email: 'admin@vinoz.com',
        role: 'admin',
      });
    }
    return res.json({
      success: true,
      user,
      token: user.token || 'admin-vinoz-token-secure-99',
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid Admin credentials. Use User ID: "admin" and Password: "admin"',
  });
});

// 7. Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  let user = db.findUserByEmail(email);

  // If email is admin@vinoz.com, grant admin
  if (email.toLowerCase() === 'admin@vinoz.com') {
    if (!user) {
      user = db.createUser({
        name: 'Vinoz Admin',
        email: 'admin@vinoz.com',
        role: 'admin',
      });
    }
    return res.json({
      success: true,
      user,
      token: user.token,
    });
  }

  // Regular user login: create if doesn't exist for effortless demo, or return existing
  if (!user) {
    user = db.createUser({
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: 'customer',
    });
  }

  res.json({
    success: true,
    user,
    token: user.token,
  });
});

// 8. Auth: Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
  }

  const user = db.createUser({
    name,
    email,
    phone,
    role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
  });

  res.status(201).json({
    success: true,
    user,
    token: user.token,
  });
});

// 9. Auth: Me
app.get('/api/auth/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  res.json({ success: true, user });
});

// 10. Orders: List (Admin sees all, user sees their own)
app.get('/api/orders', (req, res) => {
  const user = getAuthUser(req);
  const isAdmin = user?.role === 'admin';
  const orders = db.getOrders(user?.id, isAdmin);
  res.json({ success: true, orders });
});

// 11. Orders: Single
app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, order });
});

// 12. Orders: Place Order (Atomic inventory decrement)
app.post('/api/orders', (req, res) => {
  const user = getAuthUser(req);
  const { customer, items, subtotal, shippingFee, discount, promoCode, total, paymentMethod } = req.body;

  if (!customer || !items || !items.length) {
    return res.status(400).json({ success: false, error: 'Customer info and items are required' });
  }

  const result = db.createOrder({
    userId: user?.id,
    customer,
    items,
    subtotal: Number(subtotal) || 0,
    shippingFee: Number(shippingFee) || 0,
    discount: Number(discount) || 0,
    promoCode: promoCode || undefined,
    total: Number(total) || 0,
    paymentMethod: paymentMethod || 'credit_card',
  });

  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }

  res.status(201).json({ success: true, order: result.order });
});

// 13. Orders: Update Status (Admin)
app.patch('/api/orders/:id/status', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin privileges required' });
  }

  const { status, trackingNumber } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, error: 'Status is required' });
  }

  const updated = db.updateOrderStatus(req.params.id, status, trackingNumber);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  res.json({ success: true, order: updated });
});

// 14. Admin Analytics Stats
app.get('/api/admin/stats', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin privileges required' });
  }

  const stats = db.getAdminStats();
  res.json({ success: true, stats });
});

// 15. Admin Demo Reset
app.post('/api/admin/reset', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin privileges required' });
  }

  db.resetToDemo();
  res.json({ success: true, message: 'Database reset to default luxury catalogue' });
});

// --- Vite Middleware for Development / Static Production Serving ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Vino’z Fashion] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
