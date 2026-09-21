import React from 'react';
import { Star, ShoppingBag, Check, Heart } from 'lucide-react';
import { Product, ProductSize } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product, size: ProductSize) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [quickAdded, setQuickAdded] = React.useState(false);

  const availableSizes = (['XS', 'S', 'M', 'L', 'XL', 'One Size'] as ProductSize[]).filter(
    (s) => (product.sizes[s] || 0) > 0
  );

  const totalStock = (Object.values(product.sizes) as number[]).reduce((sum, n) => sum + (n || 0), 0);
  const isLowStock = totalStock > 0 && totalStock <= 6;
  const isOutOfStock = totalStock === 0;

  const handleQuickAddClick = (e: React.MouseEvent, size: ProductSize) => {
    e.stopPropagation();
    onQuickAdd(product, size);
    setQuickAdded(true);
    setTimeout(() => setQuickAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-[#9B3C52]/40 hover:shadow-xl transition-all duration-300 relative"
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 overflow-hidden bg-stone-100">
        <img
          src={product.featuredImage}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#9B3C52] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Bestseller
            </span>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </span>
          )}
          {isLowStock && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Low Stock
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-0.5 rounded-full bg-stone-400 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist button */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
              isWishlisted
                ? 'bg-rose-50 text-[#9B3C52] shadow-sm'
                : 'bg-white/80 text-stone-600 hover:text-[#9B3C52] hover:bg-white'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Quick Size Selector on Hover overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-stone-950/85 via-stone-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
          <p className="text-[10px] uppercase font-bold tracking-widest text-white/90 text-center mb-1.5">
            {quickAdded ? 'Added to Bag!' : 'Quick Add Size'}
          </p>
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {availableSizes.length === 1 && availableSizes[0] === 'One Size' ? (
              <button
                type="button"
                onClick={(e) => handleQuickAddClick(e, 'One Size')}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white text-stone-900 hover:bg-[#9B3C52] hover:text-white transition-all shadow-sm flex items-center gap-1"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Add One Size</span>
              </button>
            ) : (
              (['XS', 'S', 'M', 'L', 'XL'] as ProductSize[]).map((size) => {
                const count = product.sizes[size] || 0;
                const disabled = count === 0;
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={disabled}
                    onClick={(e) => handleQuickAddClick(e, size)}
                    className={`w-7 h-7 rounded-md text-[11px] font-bold transition-all flex items-center justify-center ${
                      disabled
                        ? 'bg-stone-800/60 text-stone-500 line-through cursor-not-allowed'
                        : 'bg-white text-stone-900 hover:bg-[#9B3C52] hover:text-white shadow-sm'
                    }`}
                    title={disabled ? `${size}: Out of stock` : `Add size ${size} (${count} in stock)`}
                  >
                    {size}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Color Swatches */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400">
            {product.category}
          </span>

          <div className="flex items-center gap-1">
            {product.colors.slice(0, 3).map((col) => (
              <span
                key={col.name}
                className="w-2.5 h-2.5 rounded-full border border-stone-300 shadow-2xs"
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[9px] text-stone-400">+{product.colors.length - 3}</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-playfair text-base sm:text-lg font-medium text-stone-950 group-hover:text-[#9B3C52] transition-colors line-clamp-1 leading-snug">
          {product.name}
        </h3>

        {/* Subtitle / Material */}
        <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
          {product.subtitle || product.fabric}
        </p>

        {/* Pricing and Rating */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-stone-950">${product.price}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                ${product.compareAtPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-stone-600">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-[11px]">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-stone-400">({product.reviewsCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
