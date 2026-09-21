import { Product, Order, User, AdminStats, ProductSize, ProductCategory } from '../types';

const API_BASE = '/api';

function getHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Products
  async getProducts(params?: {
    category?: ProductCategory;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: ProductSize;
    inStockOnly?: boolean;
    sort?: string;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());
    if (params?.size) query.append('size', params.size);
    if (params?.inStockOnly) query.append('inStockOnly', 'true');
    if (params?.sort) query.append('sort', params.sort);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch products');
    }
    return data.products;
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch product');
    }
    return data.product;
  },

  async createProduct(
    productData: Partial<Product>,
    token?: string | null
  ): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to create product');
    }
    return data.product;
  },

  async updateProduct(
    id: string,
    updates: Partial<Product>,
    token?: string | null
  ): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update product');
    }
    return data.product;
  },

  async updateProductInventory(
    id: string,
    sizes: Record<string, number>,
    token?: string | null
  ): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ sizes }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update inventory');
    }
    return data.product;
  },

  async deleteProduct(id: string, token?: string | null): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to delete product');
    }
  },

  // Admin Authentication
  async adminLogin(userId: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Invalid Admin User ID or Password');
    }
    return { user: data.user, token: data.token };
  },

  // Auth
  async login(email: string, password?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Login failed');
    }
    return { user: data.user, token: data.token };
  },

  async register(name: string, email: string, phone?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, phone }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Registration failed');
    }
    return { user: data.user, token: data.token };
  },

  async getMe(token: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Not authenticated');
    }
    return data.user;
  },

  // Orders
  async getOrders(token?: string | null): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch orders');
    }
    return data.orders;
  },

  async getOrderById(orderId: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Order not found');
    }
    return data.order;
  },

  async placeOrder(orderPayload: any, token?: string | null): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Order placement failed');
    }
    return data.order;
  },

  async updateOrderStatus(
    orderId: string,
    status: Order['status'],
    trackingNumber?: string,
    token?: string | null
  ): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify({ status, trackingNumber }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update order status');
    }
    return data.order;
  },

  // Admin
  async getAdminStats(token?: string | null): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch admin stats');
    }
    return data.stats;
  },

  async resetAdminDemo(token?: string | null): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/reset`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to reset catalogue');
    }
  },
};
