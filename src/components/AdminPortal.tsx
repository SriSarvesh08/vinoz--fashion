import React, { useState, useEffect } from 'react';
import {
  Package,
  Layers,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  Check,
  X,
  Truck,
  DollarSign,
  ShieldCheck,
  ExternalLink,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  LogOut,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Product, Order, AdminStats, ProductCategory, ProductSize, User } from '../types';
import { api } from '../services/api';

interface AdminPortalProps {
  onNavigateToStore: () => void;
  onCatalogueChanged?: () => void;
}

const CATEGORIES: ProductCategory[] = [
  'Dresses',
  'Hair Clips',
  'Hair Bands',
  'Earrings',
];

const DRESS_SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL'];
const ACCESSORY_SIZES: ProductSize[] = ['One Size'];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onNavigateToStore,
  onCatalogueChanged,
}) => {
  // Admin Authentication State
  const [adminUser, setAdminUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('vinoz_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Login Form State
  const [loginUserId, setLoginUserId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Portal Dashboard State
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'inventory' | 'orders'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form Data
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    category: 'Dresses' as ProductCategory,
    price: 180,
    compareAtPrice: 220,
    description: '',
    fabric: '',
    care: '',
    featuredImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 5, S: 8, M: 6, L: 4, XL: 2, 'One Size': 0 } as Record<ProductSize, number>,
  });

  // Load Admin Data when authenticated
  const loadAdminData = async () => {
    if (!adminUser) return;
    setLoading(true);
    try {
      const [statsData, prodsData, ordersData] = await Promise.all([
        api.getAdminStats(adminUser.token),
        api.getProducts(),
        api.getOrders(adminUser.token),
      ]);
      setStats(statsData);
      setProducts(prodsData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadAdminData();
    }
  }, [adminUser]);

  const showNotification = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginUserId.trim() || !loginPassword) {
      setLoginError('Please enter both User ID and password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await api.adminLogin(loginUserId.trim(), loginPassword);
      setAdminUser(res.user);
      localStorage.setItem('vinoz_admin_user', JSON.stringify(res.user));
      showNotification(`Welcome back, ${res.user.name}`);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid User ID or Password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('vinoz_admin_user');
  };

  const handleFillDemoAdmin = () => {
    setLoginUserId('admin');
    setLoginPassword('admin');
    setLoginError('');
  };

  // Inventory adjustment
  const handleAdjustInventory = async (product: Product, size: ProductSize, delta: number) => {
    const currentQty = product.sizes[size] || 0;
    const newQty = Math.max(0, currentQty + delta);
    const updatedSizes = { ...product.sizes, [size]: newQty };

    try {
      const updated = await api.updateProductInventory(product.id, updatedSizes, adminUser?.token);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      if (stats) {
        setStats({
          ...stats,
          totalInventoryUnits: stats.totalInventoryUnits + delta,
        });
      }
      onCatalogueChanged?.();
    } catch (err) {
      console.error('Failed to adjust stock:', err);
    }
  };

  // Order status update
  const handleOrderStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, undefined, adminUser?.token);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      showNotification(`Order #${orderId} status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Order tracking number update
  const handleTrackingUpdate = async (orderId: string, trackingNumber: string) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;
      const updated = await api.updateOrderStatus(orderId, order.status, trackingNumber, adminUser?.token);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      showNotification(`Tracking saved for Order #${orderId}`);
    } catch (err) {
      console.error('Failed to update tracking:', err);
    }
  };

  // Open Add Product Modal
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      subtitle: '',
      category: 'Dresses',
      price: 180,
      compareAtPrice: 220,
      description: 'Handcrafted luxury piece designed for effortless elegance.',
      fabric: '100% Pure Mulberry Silk (19mm Charmeuse)',
      care: 'Dry clean only or gentle hand wash cold with silk detergent',
      featuredImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85',
      sizes: { XS: 4, S: 8, M: 6, L: 4, XL: 2, 'One Size': 0 },
    });
    setShowProductModal(true);
  };

  // Open Edit Product Modal
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      subtitle: p.subtitle,
      category: p.category,
      price: p.price,
      compareAtPrice: p.compareAtPrice || 0,
      description: p.description,
      fabric: p.fabric,
      care: p.care,
      featuredImage: p.featuredImage,
      sizes: {
        XS: p.sizes.XS || 0,
        S: p.sizes.S || 0,
        M: p.sizes.M || 0,
        L: p.sizes.L || 0,
        XL: p.sizes.XL || 0,
        'One Size': p.sizes['One Size'] || 0,
      },
    });
    setShowProductModal(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingProduct) {
        const updated = await api.updateProduct(
          editingProduct.id,
          {
            name: formData.name,
            subtitle: formData.subtitle,
            category: formData.category,
            price: Number(formData.price),
            compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
            description: formData.description,
            fabric: formData.fabric,
            care: formData.care,
            featuredImage: formData.featuredImage,
            sizes: formData.sizes,
          },
          adminUser?.token
        );
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showNotification(`Updated "${updated.name}" successfully!`);
      } else {
        const created = await api.createProduct(
          {
            name: formData.name,
            subtitle: formData.subtitle,
            category: formData.category,
            price: Number(formData.price),
            compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
            description: formData.description,
            fabric: formData.fabric,
            care: formData.care,
            featuredImage: formData.featuredImage,
            sizes: formData.sizes,
          },
          adminUser?.token
        );
        setProducts((prev) => [created, ...prev]);
        showNotification(`Created "${created.name}" successfully!`);
      }
      setShowProductModal(false);
      loadAdminData();
      onCatalogueChanged?.();
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!window.confirm(`Are you sure you want to permanently delete "${prod?.name || 'this item'}"?`)) {
      return;
    }
    try {
      await api.deleteProduct(productId, adminUser?.token);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showNotification('Product removed from catalog');
      onCatalogueChanged?.();
    } catch (err: any) {
      alert(err.message || 'Error deleting product');
    }
  };

  // Reset catalogue demo
  const handleResetDemo = async () => {
    if (!window.confirm('Reset catalog back to Vino’z 12 signature dresses & accessories?')) return;
    try {
      await api.resetAdminDemo(adminUser?.token);
      await loadAdminData();
      onCatalogueChanged?.();
      showNotification('Catalog reset to curated dresses and accessories!');
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: ADMIN LOGIN PORTAL (When not authenticated as Admin)
  // -------------------------------------------------------------
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#141211] flex flex-col justify-between text-stone-200">
        {/* Top Minimal Bar */}
        <header className="border-b border-stone-800 bg-[#1c1917]/90 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#68242A] text-white flex items-center justify-center font-serif font-bold text-sm shadow-md">
              V
            </div>
            <div>
              <span className="font-serif-editorial text-lg tracking-[0.2em] font-medium text-white uppercase block leading-none">
                Vino’z
              </span>
              <span className="text-[9px] tracking-[0.3em] text-[#D49BA0] font-semibold uppercase block mt-0.5">
                Admin Management Website
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToStore}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors border border-stone-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Storefront</span>
          </button>
        </header>

        {/* Login Center Card */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-[#1C1917] border border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-[#68242A]/20 border border-[#68242A]/40 text-[#D49BA0] flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="font-serif-editorial text-2xl sm:text-3xl text-white font-medium">
                Admin Portal Login
              </h1>
              <p className="text-xs text-stone-400">
                Authorized access for inventory management, product catalog, and customer orders.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Admin User ID / Username
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginUserId}
                    onChange={(e) => setLoginUserId(e.target.value)}
                    placeholder="Enter admin user ID (e.g. admin)"
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg py-2.5 pl-9 pr-3 text-white placeholder-stone-500 focus:outline-none focus:border-[#D49BA0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg py-2.5 pl-9 pr-10 text-white placeholder-stone-500 focus:outline-none focus:border-[#D49BA0]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-[#68242A] hover:bg-[#802c34] text-white font-semibold uppercase tracking-wider rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 mt-2"
              >
                {isLoggingIn ? 'Verifying Credentials...' : 'Sign In to Admin Portal'}
              </button>
            </form>

            {/* Demo Credentials Box */}
            <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider">
                  Admin Demo Credentials
                </span>
                <button
                  type="button"
                  onClick={handleFillDemoAdmin}
                  className="text-[10px] text-[#D49BA0] hover:underline font-bold uppercase tracking-wider"
                >
                  Auto-fill Login
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-stone-400">
                <div className="p-1.5 rounded bg-black/40 border border-stone-800">
                  <span className="text-stone-500 block text-[9px] uppercase">User ID:</span>
                  <strong className="text-white">admin</strong>
                </div>
                <div className="p-1.5 rounded bg-black/40 border border-stone-800">
                  <span className="text-stone-500 block text-[9px] uppercase">Password:</span>
                  <strong className="text-white">admin</strong>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer info */}
        <footer className="py-4 text-center text-stone-500 text-xs border-t border-stone-800">
          Vino’z Fashion Administrative Portal • Confidential System
        </footer>
      </div>
    );
  }

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.description.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'All') return true;
    return o.status === orderStatusFilter;
  });

  // -------------------------------------------------------------
  // VIEW 2: AUTHENTICATED ADMIN PORTAL WEBSITE
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F5F2EC] text-stone-900 flex flex-col">
      {/* Toast Notification Banner */}
      {actionSuccessMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1C1917] text-white px-4 py-3 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Top Admin Bar */}
      <header className="bg-[#1C1917] text-white border-b border-stone-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand / Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#68242A] text-white flex items-center justify-center font-bold text-sm shadow-inner">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif-editorial text-lg tracking-wider font-semibold text-white">
                    Vino’z Fashion
                  </h1>
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-[10px] uppercase font-bold text-[#D49BA0] border border-stone-700">
                    Admin Portal
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Logged in as <strong className="text-white">{adminUser.name}</strong> ({adminUser.email})
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleResetDemo}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white text-xs font-medium border border-stone-700 transition-colors"
                title="Reset catalogue to 12 curated dresses and accessories"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
                <span>Reset Demo</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToStore}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#68242A] hover:bg-[#802c34] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                title="Go to customer website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Storefront</span>
              </button>

              <button
                type="button"
                onClick={handleAdminLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-rose-300 text-xs font-medium border border-stone-700 transition-colors"
                title="Log out of admin website"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-[#68242A] text-[#68242A]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`py-3 px-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-[#68242A] text-[#68242A]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'border-[#68242A] text-[#68242A]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Inventory Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#68242A] text-[#68242A]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Shipments ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* ======================= TAB 1: OVERVIEW ======================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                    Gross Revenue
                  </span>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif-editorial text-2xl font-bold text-stone-900 mt-2">
                  ${stats?.totalRevenue.toLocaleString() || '0'} USD
                </p>
                <p className="text-[11px] text-emerald-700 font-medium mt-1">Live customer orders</p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                    Total Orders
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#68242A]/10 text-[#68242A] flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif-editorial text-2xl font-bold text-stone-900 mt-2">
                  {stats?.totalOrders || 0}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">Guest and store checkouts</p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                    Active Catalog
                  </span>
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif-editorial text-2xl font-bold text-stone-900 mt-2">
                  {products.length} Items
                </p>
                <p className="text-[11px] text-stone-500 mt-1">Dresses & accessories</p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                    Low Stock Alerts
                  </span>
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif-editorial text-2xl font-bold text-amber-900 mt-2">
                  {stats?.lowStockCount || 0} Items
                </p>
                <p className="text-[11px] text-amber-700 font-medium mt-1">≤ 2 units in stock</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="p-5 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="font-serif-editorial text-lg font-semibold text-stone-900">
                    Recent Customer Orders
                  </h3>
                  <p className="text-xs text-stone-500">
                    Latest purchases placed on the Vino’z customer storefront
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#68242A] hover:underline font-semibold uppercase tracking-wider"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Total</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50">
                        <td className="p-3.5 font-mono font-bold">#{order.id}</td>
                        <td className="p-3.5">
                          <p className="font-semibold text-stone-900">{order.customer.fullName}</p>
                          <p className="text-stone-400 text-[11px]">{order.customer.email}</p>
                        </td>
                        <td className="p-3.5">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''} (
                          {order.items.map((i) => i.name).slice(0, 1).join(', ')}
                          {order.items.length > 1 ? '...' : ''})
                        </td>
                        <td className="p-3.5 font-bold text-stone-900">${order.total.toFixed(2)}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'Shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'Processing'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-stone-400 text-[11px]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: PRODUCTS ======================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Header and Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter products by name or category..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full text-xs text-stone-800 focus:outline-none"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {['All', ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      categoryFilter === cat
                        ? 'bg-[#68242A] text-white font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="px-4 py-2 bg-[#68242A] hover:bg-[#802c34] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Piece</span>
              </button>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Piece</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Retail Price</th>
                      <th className="p-3.5">Sizes in Stock</th>
                      <th className="p-3.5">Total Inventory</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {filteredProducts.map((prod) => {
                      const totalUnits = (Object.values(prod.sizes) as number[]).reduce((s, n) => s + (n || 0), 0);
                      return (
                        <tr key={prod.id} className="hover:bg-stone-50/60">
                          <td className="p-3.5 flex items-center gap-3">
                            <img
                              src={prod.featuredImage}
                              alt={prod.name}
                              className="w-12 h-14 object-cover rounded-md bg-stone-100 shrink-0"
                            />
                            <div className="max-w-xs">
                              <p className="font-semibold text-stone-900 truncate">{prod.name}</p>
                              <p className="text-stone-400 text-[11px] truncate">{prod.subtitle}</p>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-medium text-[11px]">
                              {prod.category}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-stone-900">${prod.price}</span>
                            {prod.compareAtPrice && (
                              <span className="text-stone-400 line-through ml-1.5 text-[11px]">
                                ${prod.compareAtPrice}
                              </span>
                            )}
                          </td>

                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(prod.sizes).map(([sz, count]) => {
                                if (!count || count === 0) return null;
                                return (
                                  <span
                                    key={sz}
                                    className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-mono"
                                  >
                                    {sz}: {count}
                                  </span>
                                );
                              })}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`font-bold ${
                                totalUnits === 0
                                  ? 'text-rose-600'
                                  : totalUnits <= 5
                                  ? 'text-amber-600'
                                  : 'text-stone-900'
                              }`}
                            >
                              {totalUnits} units
                            </span>
                          </td>

                          <td className="p-3.5 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(prod)}
                              className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 3: INVENTORY ======================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif-editorial text-lg font-semibold text-stone-900">
                  Live Inventory Control Matrix
                </h3>
                <p className="text-xs text-stone-500">
                  Adjust in-stock units per size. Quantities update in the live database instantly.
                </p>
              </div>
              <div className="text-xs text-stone-500 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> 0 = Out of stock
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> ≤ 2 = Low stock
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Piece</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5 text-center">XS</th>
                      <th className="p-3.5 text-center">S</th>
                      <th className="p-3.5 text-center">M</th>
                      <th className="p-3.5 text-center">L</th>
                      <th className="p-3.5 text-center">XL</th>
                      <th className="p-3.5 text-center">One Size</th>
                      <th className="p-3.5 text-center">Total Units</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {products.map((prod) => {
                      const totalStock = (Object.values(prod.sizes) as number[]).reduce((s, n) => s + (n || 0), 0);
                      const allSizesList: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];

                      return (
                        <tr key={prod.id} className="hover:bg-stone-50/60">
                          <td className="p-3.5 flex items-center gap-3">
                            <img
                              src={prod.featuredImage}
                              alt={prod.name}
                              className="w-10 h-12 object-cover rounded bg-stone-100 shrink-0"
                            />
                            <div className="max-w-xs">
                              <p className="font-semibold text-stone-900 truncate">{prod.name}</p>
                              <p className="text-stone-400 text-[11px]">${prod.price}</p>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="text-[11px] text-stone-600">{prod.category}</span>
                          </td>

                          {allSizesList.map((sz) => {
                            const isApplicable =
                              prod.category === 'Dresses'
                                ? sz !== 'One Size'
                                : sz === 'One Size';

                            if (!isApplicable) {
                              return (
                                <td key={sz} className="p-3.5 text-center text-stone-300">
                                  —
                                </td>
                              );
                            }

                            const count = prod.sizes[sz] || 0;
                            return (
                              <td key={sz} className="p-3.5 text-center">
                                <div className="inline-flex items-center border border-stone-200 rounded-md bg-stone-50 overflow-hidden">
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustInventory(prod, sz, -1)}
                                    className="px-2 py-1 text-stone-600 hover:bg-stone-200 font-bold"
                                    title="Decrease stock"
                                  >
                                    -
                                  </button>
                                  <span
                                    className={`px-2 text-xs font-bold ${
                                      count === 0
                                        ? 'text-rose-600'
                                        : count <= 2
                                        ? 'text-amber-600'
                                        : 'text-stone-900'
                                    }`}
                                  >
                                    {count}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustInventory(prod, sz, 1)}
                                    className="px-2 py-1 text-stone-600 hover:bg-stone-200 font-bold"
                                    title="Increase stock"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                            );
                          })}

                          <td className="p-3.5 text-center">
                            <span className="font-bold text-stone-900 text-sm">{totalStock}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 4: ORDERS ======================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Status Filter */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-serif-editorial text-lg font-semibold text-stone-900">
                  Customer Orders & Courier Fulfillment
                </h3>
                <p className="text-xs text-stone-500">
                  Update fulfillment status and add shipping tracking numbers
                </p>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-[#68242A] text-white font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Order</th>
                      <th className="p-3.5">Customer & Shipping Address</th>
                      <th className="p-3.5">Ordered Pieces</th>
                      <th className="p-3.5">Total</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Carrier Tracking #</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/60">
                        <td className="p-3.5 align-top">
                          <p className="font-mono font-bold text-stone-900">#{order.id}</p>
                          <p className="text-[11px] text-stone-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </td>

                        <td className="p-3.5 align-top max-w-xs">
                          <p className="font-semibold text-stone-900">{order.customer.fullName}</p>
                          <p className="text-stone-500 text-[11px]">{order.customer.email}</p>
                          <p className="text-stone-500 text-[11px] mt-1">
                            {order.customer.address}, {order.customer.city}, {order.customer.state}{' '}
                            {order.customer.postalCode}
                          </p>
                        </td>

                        <td className="p-3.5 align-top space-y-1 max-w-xs">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <img
                                src={it.image}
                                alt={it.name}
                                className="w-7 h-8 object-cover rounded bg-stone-100 shrink-0"
                              />
                              <div className="truncate">
                                <span className="font-medium text-stone-900">{it.name}</span>
                                <span className="text-stone-400 text-[10px] ml-1">
                                  ({it.size}, qty {it.quantity})
                                </span>
                              </div>
                            </div>
                          ))}
                        </td>

                        <td className="p-3.5 align-top">
                          <span className="font-bold text-stone-900 text-sm">
                            ${order.total.toFixed(2)}
                          </span>
                          <span className="block text-[10px] text-stone-400 uppercase">
                            {order.paymentMethod.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-3.5 align-top">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleOrderStatusUpdate(order.id, e.target.value as Order['status'])
                            }
                            className="bg-white border border-stone-300 rounded px-2.5 py-1 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#68242A]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="p-3.5 align-top">
                          <input
                            type="text"
                            placeholder="e.g. USPS-9400123"
                            defaultValue={order.trackingNumber || ''}
                            onBlur={(e) => {
                              if (e.target.value !== order.trackingNumber) {
                                handleTrackingUpdate(order.id, e.target.value);
                              }
                            }}
                            className="bg-white border border-stone-300 rounded px-2.5 py-1 text-xs w-40 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#68242A]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Add / Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl border border-stone-200 my-6">
            <button
              type="button"
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-editorial text-2xl font-semibold text-stone-900 mb-4">
              {editingProduct ? 'Edit Catalog Piece' : 'Add New Fashion Piece'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#68242A]"
                    placeholder="e.g. The Milan Mulberry Silk Slip Dress"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Subtitle / Craft Note</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#68242A]"
                    placeholder="e.g. Pure Mulberry Silk • Bias Cut"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as ProductCategory })
                    }
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#68242A]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Retail Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#68242A]"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Compare Price ($)</label>
                  <input
                    type="number"
                    value={formData.compareAtPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, compareAtPrice: Number(e.target.value) })
                    }
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#68242A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#68242A]"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#68242A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Fabric / Material</label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#68242A]"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Care Instructions</label>
                  <input
                    type="text"
                    value={formData.care}
                    onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#68242A]"
                  />
                </div>
              </div>

              {/* Initial Size Inventory */}
              <div>
                <label className="block text-stone-600 font-medium mb-1.5">
                  Initial Stock Quantities
                </label>
                {formData.category === 'Dresses' ? (
                  <div className="grid grid-cols-5 gap-2">
                    {DRESS_SIZES.map((sz) => (
                      <div key={sz}>
                        <span className="block text-center text-[11px] font-bold text-stone-500 mb-0.5">
                          {sz}
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={formData.sizes[sz] || 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sizes: {
                                ...formData.sizes,
                                [sz]: Math.max(0, parseInt(e.target.value, 10) || 0),
                              },
                            })
                          }
                          className="w-full text-center bg-stone-50 border border-stone-300 rounded p-1.5 font-bold"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="max-w-xs">
                    <span className="block text-[11px] font-bold text-stone-500 mb-0.5">
                      One Size (Accessories)
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={formData.sizes['One Size'] || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sizes: {
                            ...formData.sizes,
                            'One Size': Math.max(0, parseInt(e.target.value, 10) || 0),
                          },
                        })
                      }
                      className="w-32 text-center bg-stone-50 border border-stone-300 rounded p-1.5 font-bold"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#68242A] text-white hover:bg-[#802c34] font-semibold"
                >
                  Save Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
