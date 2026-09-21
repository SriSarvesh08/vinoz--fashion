import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, X, Check } from 'lucide-react';
import { ProductCategory, ProductFilterState, ProductSize } from '../types';

interface CategoryFilterBarProps {
  categories: ProductCategory[];
  filters: ProductFilterState;
  onFilterChange: (updates: Partial<ProductFilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

const ALL_SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const activeFiltersCount =
    (filters.category !== 'All' ? 1 : 0) +
    (filters.selectedSizes.length > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 500 ? 1 : 0) +
    (filters.searchQuery.trim() ? 1 : 0);

  const toggleSize = (size: ProductSize) => {
    const next = filters.selectedSizes.includes(size)
      ? filters.selectedSizes.filter((s) => s !== size)
      : [...filters.selectedSizes, size];
    onFilterChange({ selectedSizes: next });
  };

  return (
    <div className="py-6 border-b border-[#EBE4D8] bg-[#FAF8F5]/80 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pills Row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onFilterChange({ category: cat })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all shrink-0 ${
                  filters.category === cat
                    ? 'bg-[#68242A] text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                activeFiltersCount > 0
                  ? 'border-[#68242A] text-[#68242A] bg-[#68242A]/5'
                  : 'border-stone-300 text-stone-700 hover:border-stone-400 bg-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#68242A] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  onFilterChange({ sortBy: e.target.value as ProductFilterState['sortBy'] })
                }
                className="appearance-none bg-white border border-stone-300 rounded-full px-3.5 py-1.5 pr-8 text-xs font-medium text-stone-700 hover:border-stone-400 focus:outline-none focus:ring-1 focus:ring-[#68242A] cursor-pointer"
              >
                <option value="featured">Sort: Curated Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results Count & Active Filter Tags */}
        <div className="mt-3 flex items-center justify-between text-xs text-stone-500 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-stone-700">
              Showing {totalResults} {totalResults === 1 ? 'piece' : 'curated pieces'}
            </span>

            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 text-[11px]">
                Search: "{filters.searchQuery}"
                <button
                  type="button"
                  onClick={() => onFilterChange({ searchQuery: '' })}
                  className="hover:text-stone-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.selectedSizes.map((sz) => (
              <span
                key={sz}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#68242A]/10 text-[#68242A] text-[11px] font-medium"
              >
                Size: {sz}
                <button
                  type="button"
                  onClick={() => toggleSize(sz)}
                  className="hover:text-stone-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-medium">
                In Stock Only
                <button
                  type="button"
                  onClick={() => onFilterChange({ inStockOnly: false })}
                  className="hover:text-emerald-950"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(filters.minPrice > 0 || filters.maxPrice < 500) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 text-[11px]">
                ${filters.minPrice} - ${filters.maxPrice}
                <button
                  type="button"
                  onClick={() => onFilterChange({ minPrice: 0, maxPrice: 500 })}
                  className="hover:text-stone-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-[11px] font-semibold text-[#68242A] hover:underline ml-1"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {filterDrawerOpen && (
          <div className="mt-4 p-5 bg-white rounded-xl border border-stone-200 shadow-md animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h4 className="font-serif-editorial text-lg font-medium text-stone-900">
                Refine Selection
              </h4>
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Size Selector */}
              <div>
                <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-2">
                  Sizes
                </label>
                <div className="flex items-center gap-2">
                  {ALL_SIZES.map((sz) => {
                    const isSelected = filters.selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-[#68242A] text-white border-[#68242A]'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-2">
                  Price Limit: Up to ${filters.maxPrice}
                </label>
                <input
                  type="range"
                  min="50"
                  max="450"
                  step="10"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
                  className="w-full accent-[#68242A] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>$50</span>
                  <span>$250</span>
                  <span>$450+</span>
                </div>
              </div>

              {/* Availability */}
              <div className="flex flex-col justify-center">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-2">
                  Stock Status
                </label>
                <label className="flex items-center gap-2.5 text-xs text-stone-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
                    className="w-4 h-4 rounded border-stone-300 text-[#68242A] focus:ring-[#68242A]"
                  />
                  <span>Show in-stock pieces only</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
