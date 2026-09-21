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
} from 'lucide-react';
import { Product, Order, AdminStats, ProductCategory, ProductSize, User } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  currentUser: User | null;
  onExitAdmin: () => void;
  onProductUpdated: () => void;
}

const CATEGORIES: ProductCategory[] = [
  'Dresses',
  'Hair Clips',
  'Hair Bands',
  'Earrings',
];

const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onExitAdmin,
  onProductUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'inventory' | 'orders'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    category: 'Dresses' as ProductCategory,
    price: 150,
    compareAtPrice: 180,
    description: '',
    fabric: '',
    care: '',
    featuredImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 5, S: 8, M: 6, L: 4, XL: 2 },
  });

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, productsData, ordersData] = await Promise.all([
        api.getAdminStats(currentUser?.token),
        api.getProducts(),
        api.getOrders(currentUser?.token),
      ]);
      setStats(statsData);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, [currentUser]);

  // Inventory Quick Adjust
  const handleAdjustInventory = async (product: Product, size: ProductSize, delta: number) => {
    const currentVal = product.sizes[size] || 0;
    const newVal = Math.max(0, currentVal + delta);
    const updatedSizes = { ...product.sizes, [size]: newVal };

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, sizes: updatedSizes } : p))
    );

    try {
      await api.updateProduct(product.id, { sizes: updatedSizes }, currentUser?.token);
      onProductUpdated();
    } catch (err) {
      console.error('Failed to update inventory:', err);
      loadAllAdminData();
    }
  };

  // Order Status Update
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, undefined, currentUser?.token);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (stats) {
        setStats({
          ...stats,
          recentOrders: stats.recentOrders.map((o) => (o.id === orderId ? updated : o)),
        });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Tracking Number Update
  const handleTrackingUpdate = async (orderId: string, trackingNumber: string) => {
    try {
      const updated = await api.updateOrderStatus(orderId, 'Shipped', trackingNumber, currentUser?.token);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err) {
      console.error('Failed to update tracking:', err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this product from the catalogue?')) return;
    try {
      await api.deleteProduct(id, currentUser?.token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      onProductUpdated();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(
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
          currentUser?.token
        );
      } else {
        await api.createProduct(
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
            images: [formData.featuredImage],
            sizes: formData.sizes,
            colors: [{ name: 'Standard', hex: '#1C1917' }],
            tags: ['New Arrival'],
          },
          currentUser?.token
        );
      }

      setShowAddModal(false);
      setEditingProduct(null);
      loadAllAdminData();
      onProductUpdated();
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

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
      sizes: { ...p.sizes },
    });
    setShowAddModal(true);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      subtitle: '',
      category: 'Dresses',
      price: 160,
      compareAtPrice: 195,
      description: 'Handcrafted luxury apparel piece cut from fine natural fibers.',
      fabric: '100% Mulberry Silk / Fine Wool Blend',
      care: 'Dry clean only',
      featuredImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85',
      sizes: { XS: 4, S: 8, M: 6, L: 4, XL: 2 },
    });
    setShowAddModal(true);
  };

  const handleResetCatalogue = async () => {
    if (!window.confirm('Reset catalogue back to initial 12 luxury items?')) return;
    try {
      await api.resetAdminDemo(currentUser?.token);
      loadAllAdminData();
      onProductUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-16">
      {/* Top Admin Header Bar */}
      <div className="bg-[#1C1917] text-white py-4 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#68242A] text-white flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-editorial text-xl font-medium tracking-wider">
                  Vino’z Fashion Atelier
                </h1>
                <span className="px-2 py-0.5 rounded bg-stone-800 text-[10px] uppercase font-bold text-[#CB8D91]">
                  Admin Console
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Logged in as <strong className="text-white">{currentUser?.name || 'Admin'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetCatalogue}
              className="px-3 py-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Reset catalogue to default products"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo Store</span>
            </button>

            <button
              type="button"
              onClick={onExitAdmin}
              className="px-4 py-1.5 rounded-lg bg-[#68242A] hover:bg-[#521c21] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Return to Store
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex space-x-1 sm:space-x-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
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
            className={`py-3.5 px-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-[#68242A] text-[#68242A]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalogue ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`py-3.5 px-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
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
            className={`py-3.5 px-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#68242A] text-[#68242A]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Fulfillment ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* --- TAB 1: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
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
                <p className="text-[11px] text-emerald-700 font-medium mt-1">
                  Active store orders
                </p>
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
                <p className="text-[11px] text-stone-500 mt-1">Customers & guests</p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                    Curated Products
                  </span>
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif-editorial text-2xl font-bold text-stone-900 mt-2">
                  {stats?.totalProducts || 0}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">Across 6 fashion categories</p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                    Low Stock Alerts
                  </span>
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif-editorial text-2xl font-bold text-amber-700 mt-2">
                  {stats?.lowStockCount || 0}
                </p>
                <p className="text-[11px] text-amber-700 font-medium mt-1">
                  Items with total inventory ≤ 8
                </p>
              </div>
            </div>

            {/* Recent Orders in Overview */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="p-5 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="font-serif-editorial text-lg font-semibold text-stone-900">
                    Recent Customer Orders
                  </h3>
                  <p className="text-xs text-stone-500">Latest transactions requiring fulfillment</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#68242A] hover:underline"
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
                      <th className="p-3.5 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {stats?.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/60">
                        <td className="p-3.5 font-mono font-bold text-stone-900">#{order.id}</td>
                        <td className="p-3.5">
                          <p className="font-semibold text-stone-900">{order.customer.fullName}</p>
                          <p className="text-stone-400 text-[11px]">{order.customer.email}</p>
                        </td>
                        <td className="p-3.5">
                          {order.items.map((i) => (
                            <span key={i.productId} className="block truncate max-w-xs text-stone-600">
                              {i.quantity}x {i.name} ({i.size})
                            </span>
                          ))}
                        </td>
                        <td className="p-3.5 font-bold text-stone-900">${order.total.toFixed(2)}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                        <td className="p-3.5 text-right">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as Order['status'])
                            }
                            className="bg-white border border-stone-300 rounded px-2 py-1 text-xs cursor-pointer focus:ring-1 focus:ring-[#68242A]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: PRODUCTS --- */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg py-2 pl-9 pr-3 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#68242A]"
                />
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="px-4 py-2 rounded-lg bg-[#68242A] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#521c21] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Piece</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Product</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Total Inventory</th>
                      <th className="p-3.5">Sizes Breakdown</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {filteredProducts.map((prod) => {
                      const totalStock = (Object.values(prod.sizes) as number[]).reduce((s, n) => s + (n || 0), 0);
                      return (
                        <tr key={prod.id} className="hover:bg-stone-50/60">
                          <td className="p-3.5 flex items-center gap-3">
                            <img
                              src={prod.featuredImage}
                              alt={prod.name}
                              className="w-10 h-13 object-cover object-top rounded bg-stone-100 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-stone-900">{prod.name}</p>
                              <p className="text-stone-400 text-[11px]">{prod.subtitle || prod.fabric}</p>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                              {prod.category}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-stone-900">${prod.price}</td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded font-bold ${
                                totalStock === 0
                                  ? 'bg-rose-100 text-rose-800'
                                  : totalStock <= 6
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {totalStock} in stock
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5 text-[11px]">
                              {SIZES.map((sz) => (
                                <span key={sz} className="text-stone-600">
                                  {sz}: <strong>{prod.sizes[sz] || 0}</strong>
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(prod)}
                              className="p-1.5 text-stone-600 hover:text-stone-950 rounded hover:bg-stone-100"
                              title="Edit product details"
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

        {/* --- TAB 3: INVENTORY MATRIX --- */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="p-4 bg-white rounded-xl border border-stone-200">
              <h3 className="font-serif-editorial text-lg font-semibold text-stone-900">
                Live Inventory Management Matrix
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Quickly adjust stock units per size. Changes update and persist in the database immediately.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Product</th>
                      <th className="p-3.5 text-center">Size XS</th>
                      <th className="p-3.5 text-center">Size S</th>
                      <th className="p-3.5 text-center">Size M</th>
                      <th className="p-3.5 text-center">Size L</th>
                      <th className="p-3.5 text-center">Size XL</th>
                      <th className="p-3.5 text-center">Total Units</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {products.map((prod) => {
                      const totalStock = (Object.values(prod.sizes) as number[]).reduce((s, n) => s + (n || 0), 0);
                      return (
                        <tr key={prod.id} className="hover:bg-stone-50/60">
                          <td className="p-3.5 flex items-center gap-3">
                            <img
                              src={prod.featuredImage}
                              alt={prod.name}
                              className="w-10 h-12 object-cover object-top rounded bg-stone-100 shrink-0"
                            />
                            <div className="max-w-xs">
                              <p className="font-semibold text-stone-900 truncate">{prod.name}</p>
                              <p className="text-stone-400 text-[11px]">${prod.price} • {prod.category}</p>
                            </div>
                          </td>

                          {SIZES.map((sz) => {
                            const count = prod.sizes[sz] || 0;
                            return (
                              <td key={sz} className="p-3.5 text-center">
                                <div className="inline-flex items-center border border-stone-200 rounded-md bg-stone-50 overflow-hidden">
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustInventory(prod, sz, -1)}
                                    className="px-2 py-1 text-stone-600 hover:bg-stone-200 font-bold"
                                  >
                                    -
                                  </button>
                                  <span
                                    className={`px-2.5 text-xs font-bold ${
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

        {/* --- TAB 4: ORDERS --- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="p-5 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="font-serif-editorial text-lg font-semibold text-stone-900">
                    Customer Orders Management
                  </h3>
                  <p className="text-xs text-stone-500">
                    Track customer delivery addresses, items, payments, and update courier tracking
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Order</th>
                      <th className="p-3.5">Customer & Address</th>
                      <th className="p-3.5">Purchased Items</th>
                      <th className="p-3.5">Total & Payment</th>
                      <th className="p-3.5">Fulfillment Status</th>
                      <th className="p-3.5">Tracking Number</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {orders.map((order) => (
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
                          <p className="text-stone-500 text-[11px]">{order.customer.address}, {order.customer.city}</p>
                        </td>

                        <td className="p-3.5 align-top">
                          <div className="space-y-1">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <img
                                  src={it.image}
                                  alt=""
                                  className="w-6 h-8 object-cover rounded"
                                />
                                <span className="text-[11px]">
                                  {it.quantity}x {it.name} ({it.size}) — ${it.unitPrice}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="p-3.5 align-top">
                          <p className="font-bold text-stone-900">${order.total.toFixed(2)}</p>
                          <p className="text-[11px] uppercase font-semibold text-emerald-700">
                            {order.paymentStatus} ({order.paymentMethod})
                          </p>
                        </td>

                        <td className="p-3.5 align-top">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as Order['status'])
                            }
                            className="bg-white border border-stone-300 rounded px-2.5 py-1 text-xs font-semibold cursor-pointer focus:ring-1 focus:ring-[#68242A]"
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
                            placeholder="Add tracking #"
                            defaultValue={order.trackingNumber || ''}
                            onBlur={(e) => {
                              if (e.target.value !== order.trackingNumber) {
                                handleTrackingUpdate(order.id, e.target.value);
                              }
                            }}
                            className="bg-white border border-stone-300 rounded px-2 py-1 text-xs w-36 text-stone-800"
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
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl border border-stone-200 my-6">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-editorial text-2xl font-semibold text-stone-900 mb-4">
              {editingProduct ? 'Edit Atelier Piece' : 'Add New Fashion Piece'}
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
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                    placeholder="e.g. The Milan Silk Gown"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Subtitle / Line</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                    placeholder="e.g. 100% Charmeuse Silk"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as ProductCategory })
                    }
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Compare Price</label>
                  <input
                    type="number"
                    value={formData.compareAtPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, compareAtPrice: Number(e.target.value) })
                    }
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Fabric</label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Care Advice</label>
                  <input
                    type="text"
                    value={formData.care}
                    onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              {/* Initial Size Inventory */}
              <div>
                <label className="block text-stone-600 font-medium mb-1.5">Initial Sizes Inventory</label>
                <div className="grid grid-cols-5 gap-2">
                  {SIZES.map((sz) => (
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
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#68242A] text-white hover:bg-[#521c21] font-semibold"
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
