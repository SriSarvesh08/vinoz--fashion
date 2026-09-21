import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, Heart, ChevronDown, Menu, X, Package } from 'lucide-react';
import { ProductCategory } from '../types';

interface NavbarProps {
  currentCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenTrackOrder: () => void;
  onGoHome: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const ALL_CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'All', label: 'All Products' },
  { id: 'Dresses', label: 'Dresses' },
  { id: 'Earrings', label: 'Earrings' },
  { id: 'Necklaces', label: 'Necklaces' },
  { id: 'Rings', label: 'Rings' },
  { id: 'Hair Clips', label: 'Hair Clips' },
  { id: 'Bangles', label: 'Bangles' },
  { id: 'Chains', label: 'Chains' },
  { id: 'Bracelets', label: 'Bracelets' },
  { id: 'Hair Bands', label: 'Hair Bands' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenTrackOrder,
  onGoHome,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      {/* 1. Top Announcement Bar - exact match to reference screenshot */}
      <div className="bg-[#9B3C52] text-white text-xs font-normal py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span>Free Shipping above $50 | Premium Quality Guaranteed</span>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-[#9B3C52] rounded-md focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Center / Left Brand Logo */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <button
              type="button"
              onClick={onGoHome}
              className="group focus:outline-none flex flex-col items-center lg:items-start"
            >
              <span className="font-playfair text-2xl sm:text-3xl text-stone-900 tracking-wide font-normal">
                Vino'z Fashion
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#9B3C52] uppercase font-medium mt-0.5">
                WHERE STYLE MEETS ELEGANCE
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              type="button"
              onClick={onGoHome}
              className="text-sm font-medium text-stone-800 hover:text-[#9B3C52] transition-colors"
            >
              Home
            </button>

            {/* Shop Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                onMouseEnter={() => setShopDropdownOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-stone-800 hover:text-[#9B3C52] transition-colors py-2"
              >
                <span>Shop</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {shopDropdownOpen && (
                <div
                  onMouseLeave={() => setShopDropdownOpen(false)}
                  className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {ALL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setShopDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                        currentCategory === cat.id
                          ? 'bg-[#9B3C52]/10 text-[#9B3C52] font-semibold'
                          : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {currentCategory === cat.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9B3C52]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onOpenTrackOrder}
              className="text-sm font-medium text-stone-800 hover:text-[#9B3C52] transition-colors"
            >
              Track Order
            </button>
          </nav>

          {/* Right Action Icons: Search, Wishlist (Heart), Cart (ShoppingBag) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Button / Input */}
            <div className="relative">
              {showSearchBar ? (
                <div className="flex items-center bg-stone-50 border border-stone-300 rounded-full px-3 py-1.5 shadow-xs w-44 sm:w-60 transition-all">
                  <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search dresses, jewelry..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                    className="w-full text-xs text-stone-800 placeholder-stone-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onSearchChange('');
                      setShowSearchBar(false);
                    }}
                    className="text-stone-400 hover:text-stone-600 p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSearchBar(true)}
                  className="p-2 text-stone-700 hover:text-[#9B3C52] transition-colors rounded-full hover:bg-stone-100"
                  aria-label="Search items"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist Heart Icon */}
            <button
              type="button"
              onClick={onOpenWishlist}
              className="p-2 text-stone-700 hover:text-[#9B3C52] transition-colors relative rounded-full hover:bg-stone-100"
              aria-label="Saved Wishlist"
              title="View your saved wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#9B3C52] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag / Cart Icon */}
            <button
              type="button"
              onClick={onOpenCart}
              className="p-2 text-stone-700 hover:text-[#9B3C52] transition-colors relative rounded-full hover:bg-stone-100"
              aria-label="Shopping Cart"
              title="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#9B3C52] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1 pb-3 border-b border-stone-100">
            <button
              type="button"
              onClick={() => {
                onGoHome();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50 rounded-lg"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenTrackOrder();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50 rounded-lg"
            >
              Track Order
            </button>
          </div>

          <div>
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-3 block mb-1">
              Shop Categories
            </span>
            <div className="grid grid-cols-2 gap-1">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                    currentCategory === cat.id
                      ? 'bg-[#9B3C52] text-white font-medium'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
