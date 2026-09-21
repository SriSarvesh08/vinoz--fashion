import React from 'react';
import { Product, ProductSize } from '../types';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: ProductSize) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#9B3C52] fill-current" />
            <h2 className="font-playfair text-xl font-medium text-stone-900">
              My Wishlist ({wishlistProducts.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-[#9B3C52] flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <p className="font-medium text-stone-800 text-sm">Your wishlist is empty</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Tap the heart on any dress, accessory, or piece you love to save it here.
              </p>
            </div>
          ) : (
            wishlistProducts.map((product) => {
              const firstSize =
                (Object.entries(product.sizes).find(([_, count]) => (count as number) > 0)?.[0] as ProductSize) ||
                'One Size';

              return (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-stone-200 hover:border-stone-300 transition-all bg-[#FAF8F5]/60"
                >
                  <img
                    src={product.featuredImage || product.images[0]}
                    alt={product.name}
                    className="w-16 h-20 object-cover rounded-lg cursor-pointer shrink-0"
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h4
                      className="text-sm font-medium text-stone-900 truncate hover:text-[#9B3C52] cursor-pointer"
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                    >
                      {product.name}
                    </h4>
                    <p className="text-xs font-semibold text-stone-900 mt-1">
                      ${product.price}
                      {product.compareAtPrice && (
                        <span className="text-stone-400 line-through text-[11px] ml-1.5 font-normal">
                          ${product.compareAtPrice}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onAddToCart(product, firstSize)}
                      className="px-3 py-2 bg-stone-900 hover:bg-[#9B3C52] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Add to Cart</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveFromWishlist(product.id)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
