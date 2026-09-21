import React, { useState, useMemo } from 'react';
import { ProductCategory, Product, ProductSize, ProductFilterState } from '../types';
import { ProductCard } from './ProductCard';
import { ArrowLeft, SlidersHorizontal, ArrowUpDown, Check, X, Sparkles, PackageOpen } from 'lucide-react';

interface CategoryPageProps {
  category: ProductCategory;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: ProductSize) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onBackToHome: () => void;
  onSelectCategory: (cat: ProductCategory) => void;
}

const ALL_CATEGORIES: ProductCategory[] = [
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

const CATEGORY_DESCRIPTIONS: Record<string, { title: string; desc: string; bannerImg?: string }> = {
  Dresses: {
    title: 'Designer & Evening Dresses',
    desc: 'Bespoke evening gowns, cocktail silhouettes, and radiant floral sundresses tailored with premium silk, chiffon, and satin.',
  },
  Earrings: {
    title: 'Fine & Statement Earrings',
    desc: 'Artisanal drop earrings, 18K gold vermeil hoops, sparkling crystal studs, and timeless freshwater pearls.',
  },
  Necklaces: {
    title: 'Pendants & Layered Necklaces',
    desc: 'Luminous gold chains, celestial medallions, natural baroque pearls, and layered diamond-cut chokers.',
  },
  Rings: {
    title: 'Cocktail & Eternity Rings',
    desc: 'Solitaire dazzlers, micro-pavé cubic zirconia bands, and vintage-inspired 18K gold adjustable statement rings.',
  },
  'Hair Clips': {
    title: 'Artisanal Hair Clips & Barretas',
    desc: 'Handcrafted French acetate claw clips, crystal encrusted pins, and pearlescent snap barrettes.',
  },
  Bangles: {
    title: 'Traditional & Modern Bangles',
    desc: 'Intricate temple filigree kadas, sleek rose gold stackable bangles, and engraved gold cuffs.',
  },
  Chains: {
    title: 'Classic & Box Chains',
    desc: 'Pure sterling silver rope chains, Italian herringbone chokers, and 18K yellow gold statement chains.',
  },
  Bracelets: {
    title: 'Tennis & Charm Bracelets',
    desc: 'Glistening tennis bracelets, delicate evil eye charms, and link chain bracelets crafted to perfection.',
  },
  'Hair Bands': {
    title: 'Padded & Embellished Headbands',
    desc: 'Velvet knot crowns, lustrous pearl-encrusted headbands, and silk satin alice bands for effortless beauty.',
  },
  All: {
    title: 'All Products',
    desc: 'Explore the complete Vino’z Fashion collection of high-fashion dresses and luxury fine accessories.',
  },
};

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  allProducts,
  onSelectProduct,
  onQuickAdd,
  wishlistIds,
  onToggleWishlist,
  onBackToHome,
  onSelectCategory,
}) => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Category info
  const info = CATEGORY_DESCRIPTIONS[category] || {
    title: category,
    desc: `Discover our curated collection of luxury ${category.toLowerCase()} crafted with the finest materials.`,
  };

  // Filter products for this specific category
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        if (category !== 'All' && p.category !== category) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.subtitle?.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q);
          if (!match) return false;
        }

        const totalStock = (Object.values(p.sizes) as number[]).reduce((s, n) => s + (n || 0), 0);
        if (inStockOnly && totalStock === 0) return false;

        if (selectedSizes.length > 0) {
          const hasSize = selectedSizes.some((sz) => (p.sizes[sz] || 0) > 0);
          if (!hasSize) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [allProducts, category, searchQuery, inStockOnly, selectedSizes, sortBy]);

  const toggleSize = (size: ProductSize) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setInStockOnly(false);
    setSelectedSizes([]);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters = inStockOnly || selectedSizes.length > 0 || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 animate-in fade-in duration-300">
      {/* Category Header & Breadcrumbs */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-[#9B3C52] transition-colors flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-[#9B3C52] transition-colors"
            >
              Categories
            </button>
            <span>/</span>
            <span className="text-stone-900 font-semibold">{category}</span>
          </div>

          {/* Title & Description */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9B3C52]/10 text-[#9B3C52] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Collection</span>
              </div>
              <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-normal text-stone-900 tracking-tight">
                {info.title}
              </h1>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed pt-1">
                {info.desc}
              </p>
            </div>

            <div className="text-left md:text-right shrink-0">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block">
                Total Designs
              </span>
              <span className="font-playfair text-3xl text-stone-900 font-medium">
                {filteredProducts.length}
              </span>
              <span className="text-xs text-stone-500 ml-1.5">pieces</span>
            </div>
          </div>

          {/* Quick-switch Category Pill Tabs */}
          <div className="mt-8 pt-6 border-t border-stone-100 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all shrink-0 ${
                  category === cat
                    ? 'bg-[#9B3C52] text-white shadow-sm'
                    : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-200 border border-stone-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Left: Quick search and in-stock toggle */}
          <div className="flex items-center gap-4 flex-wrap flex-1">
            <input
              type="text"
              placeholder={`Search in ${category}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#9B3C52] w-48 sm:w-64"
            />

            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`text-xs px-3 py-2 rounded-xl border font-medium flex items-center gap-1.5 transition-colors ${
                inStockOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${inStockOnly ? 'bg-emerald-600' : 'bg-stone-300'}`} />
              <span>In Stock Only</span>
            </button>

            {/* Filter Toggle for mobile */}
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className={`text-xs px-3 py-2 rounded-xl border font-medium flex items-center gap-1.5 transition-colors ${
                selectedSizes.length > 0
                  ? 'bg-[#9B3C52]/10 border-[#9B3C52] text-[#9B3C52]'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sizes ({selectedSizes.length})</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Right: Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-[#9B3C52] text-stone-800 cursor-pointer appearance-none"
              >
                <option value="featured">Featured Picks</option>
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Expandable Size Filter drawer */}
        {filterDrawerOpen && (
          <div className="mt-3 p-4 bg-white rounded-2xl border border-stone-200 shadow-xs animate-in slide-in-from-top-2 duration-150">
            <span className="text-xs font-semibold text-stone-900 block mb-2">Filter by Available Size:</span>
            <div className="flex flex-wrap gap-2">
              {(['XS', 'S', 'M', 'L', 'XL', 'One Size'] as ProductSize[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => toggleSize(sz)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedSizes.includes(sz)
                      ? 'bg-[#9B3C52] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <PackageOpen className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-playfair text-2xl font-medium text-stone-900">
                No Pieces Found
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                No items in the {category} category matched your active filter selections.
              </p>
            </div>
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-6 py-2.5 rounded-full bg-[#9B3C52] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#832E41] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onQuickAdd={onQuickAdd}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
