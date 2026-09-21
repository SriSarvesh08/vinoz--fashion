import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Product,
  CartItem,
  ProductCategory,
  ProductFilterState,
  ProductSize,
} from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ShopByCategory } from './components/ShopByCategory';
import { FeaturedPicks } from './components/FeaturedPicks';
import { CategoryPage } from './components/CategoryPage';
import { CustomerTestimonials } from './components/CustomerTestimonials';
import { TrackOrderBanner } from './components/TrackOrderBanner';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPortal } from './components/AdminPortal';
import { OrdersModal } from './components/OrdersModal';
import { WishlistModal } from './components/WishlistModal';
import { Footer } from './components/Footer';
import { SiteSwitcherDock } from './components/SiteSwitcherDock';
import { CheckCircle, PackageOpen } from 'lucide-react';

const CATEGORIES: ProductCategory[] = [
  'All',
  'Dresses',
  'Earrings',
  'Necklaces',
  'Rings',
  'Hair Clips',
  'Bangles',
  'Chains',
  'Bracelets',
  'Hair Bands',
];

export default function App() {
  // Portal Routing: 'store' (Customer Website) vs 'admin' (Admin Management Website)
  const [currentPortal, setCurrentPortal] = useState<'store' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      if (
        window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#admin'
      ) {
        return 'admin';
      }
    }
    return 'store';
  });

  // Active Storefront Page: 'home' vs 'category'
  const [activeView, setActiveView] = useState<'home' | 'category'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/category/') || window.location.hash.startsWith('#category=')) {
        return 'category';
      }
    }
    return 'home';
  });

  // Selected Category for the Category Page
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/category/')) {
        const rawSlug = decodeURIComponent(path.replace('/category/', '')).toLowerCase().replace(/-/g, ' ');
        const match = CATEGORIES.find((c) => c.toLowerCase() === rawSlug);
        if (match) return match;
      }
    }
    return 'All';
  });

  // Listen to browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (
        path.startsWith('/admin') ||
        window.location.hash === '#admin'
      ) {
        setCurrentPortal('admin');
      } else {
        setCurrentPortal('store');
        if (path.startsWith('/category/')) {
          const rawSlug = decodeURIComponent(path.replace('/category/', '')).toLowerCase().replace(/-/g, ' ');
          const match = CATEGORIES.find((c) => c.toLowerCase() === rawSlug);
          if (match) {
            setSelectedCategory(match);
            setActiveView('category');
            return;
          }
        }
        setActiveView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize document title to reflect active website and category
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (currentPortal === 'admin') {
        document.title = "Vino'z Fashion — Admin Management Portal";
      } else if (activeView === 'category' && selectedCategory !== 'All') {
        document.title = `${selectedCategory} Collection — Vino'z Fashion`;
      } else {
        document.title = "Vino'z Fashion — Where Style Meets Elegance";
      }
    }
  }, [currentPortal, activeView, selectedCategory]);

  const navigateTo = (portal: 'store' | 'admin') => {
    setCurrentPortal(portal);
    if (typeof window !== 'undefined') {
      const newPath = portal === 'admin' ? '/admin' : '/';
      window.history.pushState({}, '', newPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Open Dedicated Category Page
  const handleOpenCategoryPage = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setFilters((prev) => ({ ...prev, category: cat }));
    setActiveView('category');
    if (typeof window !== 'undefined') {
      const slug = cat.toLowerCase().replace(/\s+/g, '-');
      window.history.pushState({ category: cat }, '', `/category/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Back to Main Homepage
  const handleBackToHome = () => {
    setActiveView('home');
    setSelectedCategory('All');
    setFilters((prev) => ({ ...prev, category: 'All', searchQuery: '' }));
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Products Catalog State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vinoz_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (Persisted in localStorage)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vinoz_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Storefront Filter State
  const [filters, setFilters] = useState<ProductFilterState>({
    category: 'All',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 500,
    selectedSizes: [],
    inStockOnly: false,
    sortBy: 'featured',
  });

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string>('VINOZ15');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const productSectionRef = useRef<HTMLDivElement>(null);
  const featuredSectionRef = useRef<HTMLDivElement>(null);

  // Sync Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('vinoz_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('vinoz_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle item in Wishlist
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const product = products.find((p) => p.id === productId);
      const name = product ? product.name : 'Piece';
      if (exists) {
        showToast(`Removed "${name}" from your wishlist`);
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved "${name}" to your wishlist`);
        return [...prev, productId];
      }
    });
  };

  // Load Products from Backend API
  const fetchCatalogue = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError('Unable to load collection. Please ensure server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogue();
  }, []);

  // Filter and Sort Logic for Homepage Catalogue
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (filters.category !== 'All' && p.category !== filters.category) {
          return false;
        }
        // Search
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSub = p.subtitle?.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchSub && !matchDesc && !matchTag) return false;
        }
        // Price
        if (p.price > filters.maxPrice || p.price < filters.minPrice) {
          return false;
        }
        // Stock Status
        const totalStock = (Object.values(p.sizes) as number[]).reduce((s, n) => s + (n || 0), 0);
        if (filters.inStockOnly && totalStock === 0) {
          return false;
        }
        // Sizes
        if (filters.selectedSizes.length > 0) {
          const hasSelectedSize = filters.selectedSizes.some(
            (sz) => (p.sizes[sz] || 0) > 0
          );
          if (!hasSelectedSize) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        // Default: featured
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [products, filters]);

  // Wishlist products
  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  // Cart Management
  const handleAddToCart = (
    product: Product,
    size: ProductSize,
    color: string,
    quantity = 1
  ) => {
    const itemKey = `${product.id}-${size}-${color}`;
    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === itemKey);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      } else {
        const newItem: CartItem = {
          id: itemKey,
          productId: product.id,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
          unitPrice: product.price,
        };
        return [...prev, newItem];
      }
    });
    showToast(`Added ${quantity}x ${product.name} to your bag`);
  };

  const handleQuickAdd = (product: Product, size: ProductSize) => {
    const colorName = product.colors[0]?.name || 'Standard';
    handleAddToCart(product, size, colorName, 1);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Promo Handler
  const handleApplyPromo = (code: string) => {
    const upper = code.toUpperCase();
    if (upper === 'VINOZ15' || upper === 'FIRST10') {
      setAppliedPromo(upper);
      showToast(`Promo ${upper} applied!`);
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo('');
  };

  const scrollToCollection = () => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFeatured = () => {
    if (featuredSectionRef.current) {
      featuredSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Total cart items count
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // -------------------------------------------------------------
  // If the user navigates to the Admin Portal website (/admin)
  // -------------------------------------------------------------
  if (currentPortal === 'admin') {
    return (
      <div className="min-h-screen bg-[#121110] text-stone-100 flex flex-col font-sans">
        <AdminPortal
          onNavigateToStore={() => navigateTo('store')}
          onCatalogueChanged={fetchCatalogue}
        />
        <SiteSwitcherDock
          currentPortal="admin"
          onNavigate={navigateTo}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // Otherwise: Render the Customer Storefront Website
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-[#9B3C52] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl border border-stone-800 flex items-center gap-2.5 text-xs animate-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Customer Storefront Navigation */}
      <Navbar
        currentCategory={selectedCategory}
        onSelectCategory={handleOpenCategoryPage}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onGoHome={handleBackToHome}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => {
          setFilters((prev) => ({ ...prev, searchQuery: q }));
          if (q.trim() && productSectionRef.current && activeView === 'home') {
            productSectionRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Conditional: Dedicated Category Page vs Full Home Storefront */}
      {activeView === 'category' ? (
        /* DEDICATED NEW PAGE FOR SELECTED CATEGORY PRODUCTS */
        <main className="flex-1">
          <CategoryPage
            category={selectedCategory}
            allProducts={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onQuickAdd={handleQuickAdd}
            wishlistIds={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onBackToHome={handleBackToHome}
            onSelectCategory={handleOpenCategoryPage}
          />

          {/* Social Proof & Order Tracking Banner */}
          <CustomerTestimonials />
          <TrackOrderBanner onOpenTrackOrder={() => setIsTrackOrderOpen(true)} />
        </main>
      ) : (
        /* FULL HOMEPAGE STOREFRONT */
        <main className="flex-1">
          {/* 1. Hero Banner Section with Heart Bokeh & Trust Badges */}
          <HeroBanner
            onShopNow={() => handleOpenCategoryPage('All')}
            onFeaturedPicks={scrollToFeatured}
          />

          {/* 2. Shop by Category Section - Clicking opens new page for those products */}
          <ShopByCategory
            onSelectCategory={handleOpenCategoryPage}
            activeCategory={selectedCategory}
          />

          {/* 3. Featured Picks Section */}
          <div ref={featuredSectionRef}>
            <FeaturedPicks
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickAdd={handleQuickAdd}
              onViewAllProducts={() => handleOpenCategoryPage('All')}
              wishlistIds={wishlist}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>

          {/* 4. Complete Product Catalogue Section with Filter Controls */}
          <div ref={productSectionRef} className="pt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-4">
                <div>
                  <span className="text-[11px] font-semibold tracking-widest text-[#9B3C52] uppercase">
                    Curated Collection
                  </span>
                  <h2 className="font-playfair text-2xl sm:text-3xl font-normal text-stone-900 mt-1">
                    {filters.category === 'All' ? 'All Products' : filters.category}
                  </h2>
                </div>
                <p className="text-xs text-stone-500">
                  Showing {filteredProducts.length} handcrafted pieces
                </p>
              </div>
            </div>

            <CategoryFilterBar
              categories={CATEGORIES}
              filters={filters}
              onFilterChange={(updates) => setFilters((prev) => ({ ...prev, ...updates }))}
              onResetFilters={() =>
                setFilters({
                  category: 'All',
                  searchQuery: '',
                  minPrice: 0,
                  maxPrice: 500,
                  selectedSizes: [],
                  inStockOnly: false,
                  sortBy: 'featured',
                })
              }
              totalResults={filteredProducts.length}
            />
          </div>

          {/* Product Grid Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-3/4 bg-stone-200" />
                    <div className="p-4 space-y-2.5">
                      <div className="h-3 bg-stone-200 rounded w-1/3" />
                      <div className="h-4 bg-stone-200 rounded w-3/4" />
                      <div className="h-3 bg-stone-200 rounded w-1/2" />
                      <div className="h-4 bg-stone-200 rounded w-1/4 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-16 text-center space-y-4">
                <p className="text-rose-600 font-medium text-sm">{error}</p>
                <button
                  type="button"
                  onClick={fetchCatalogue}
                  className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs uppercase tracking-wider font-semibold"
                >
                  Retry Loading
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 mx-auto flex items-center justify-center text-stone-400">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-playfair text-2xl font-medium text-stone-900">
                    No Pieces Found
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    No accessories or dresses matched your active filters or search terms. Try clearing your filters or exploring our other collections.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      category: 'All',
                      searchQuery: '',
                      minPrice: 0,
                      maxPrice: 500,
                      selectedSizes: [],
                      inStockOnly: false,
                      sortBy: 'featured',
                    })
                  }
                  className="px-6 py-2.5 rounded-full bg-[#9B3C52] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#832E41] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onQuickAdd={handleQuickAdd}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}
          </section>

          {/* 5. What Our Customers Say */}
          <CustomerTestimonials />

          {/* 6. Track Order Banner */}
          <TrackOrderBanner onOpenTrackOrder={() => setIsTrackOrderOpen(true)} />
        </main>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onExploreProducts={() => handleOpenCategoryPage('All')}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleQuickAdd}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Guest Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        appliedPromo={appliedPromo}
        onOrderPlaced={(order) => {
          showToast(`Order #${order.id} placed successfully!`);
          fetchCatalogue();
        }}
        onClearCart={handleClearCart}
      />

      {/* Track Guest Order Modal */}
      <OrdersModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* 7. Footer */}
      <Footer
        onSelectCategory={handleOpenCategoryPage}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* Floating Website Switcher Dock */}
      <SiteSwitcherDock
        currentPortal="store"
        onNavigate={navigateTo}
      />
    </div>
  );
}
