import React from 'react';
import { Product, ProductSize } from '../types';
import { Star, ShoppingBag, ArrowRight, Heart } from 'lucide-react';

interface FeaturedPicksProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: ProductSize) => void;
  onViewAllProducts: () => void;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
}

export const FeaturedPicks: React.FC<FeaturedPicksProps> = ({
  products,
  onSelectProduct,
  onQuickAdd,
  onViewAllProducts,
  wishlistIds = [],
  onToggleWishlist,
}) => {
  // Select 4 standout featured products
  const featured = products
    .filter((p) => p.isFeatured || p.isBestSeller)
    .slice(0, 4);

  const displayList = featured.length >= 4 ? featured : products.slice(0, 4);

  return (
    <section id="featured-picks" className="py-16 sm:py-20 bg-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching reference image */}
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight">
            Featured Picks
          </h2>
          <p className="text-stone-500 text-sm sm:text-base mt-2">
            Handpicked favorites just for you
          </p>
        </div>

        {/* 4-Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {displayList.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const firstAvailableSize =
              (Object.entries(product.sizes).find(([_, count]) => (count as number) > 0)?.[0] as ProductSize) ||
              'One Size';

            return (
              <div
                key={product.id}
                className="group bg-[#FAF8F5] rounded-2xl overflow-hidden border border-stone-200/80 hover:border-stone-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image & Badges */}
                <div className="relative aspect-4/5 overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onSelectProduct(product)}>
                  <img
                    src={product.featuredImage || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Wishlist toggle */}
                  {onToggleWishlist && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                        isWishlisted
                          ? 'bg-rose-50 text-[#9B3C52] shadow-sm'
                          : 'bg-white/80 text-stone-600 hover:text-[#9B3C52] hover:bg-white'
                      }`}
                      aria-label="Save to wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  )}

                  {/* Quick Add Overlay on hover */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAdd(product, firstAvailableSize);
                      }}
                      className="w-full py-2.5 px-4 bg-stone-900/90 hover:bg-stone-900 text-white text-xs font-semibold rounded-xl backdrop-blur-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Quick Add</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="cursor-pointer" onClick={() => onSelectProduct(product)}>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                      <span className="uppercase tracking-wider">{product.category}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-stone-700 font-medium">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <h3 className="font-playfair text-base font-medium text-stone-900 line-clamp-1 group-hover:text-[#9B3C52] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                      {product.subtitle}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 mt-2 border-t border-stone-200/60 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-stone-950 font-semibold text-base">
                        ${product.price}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          ${product.compareAtPrice}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="text-xs font-medium text-[#9B3C52] hover:text-[#7D2E40] transition-colors flex items-center gap-1"
                    >
                      Details <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Products button matching reference */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onViewAllProducts}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-stone-300 text-stone-800 text-xs uppercase tracking-widest font-semibold hover:border-[#9B3C52] hover:text-[#9B3C52] hover:bg-stone-50 transition-all shadow-xs"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
