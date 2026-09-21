import React, { useState } from 'react';
import { X, Star, Check, AlertCircle, Sparkles, Truck, ShieldCheck, Ruler, Minus, Plus } from 'lucide-react';
import { Product, ProductSize } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: ProductSize, color: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  // Selected state
  const availableSizes = (['XS', 'S', 'M', 'L', 'XL'] as ProductSize[]).filter(
    (s) => (product.sizes[s] || 0) > 0
  );

  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    availableSizes.length > 0 ? availableSizes[0] : 'S'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name || 'Standard'
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const currentSizeStock = product.sizes[selectedSize] || 0;
  const isOutOfStock = currentSizeStock === 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-[#FAF8F5] rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-stone-200 z-10 my-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 hover:text-stone-950 flex items-center justify-center border border-stone-200 shadow-sm transition-colors"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery View */}
          <div className="p-4 sm:p-6 bg-stone-100 flex flex-col justify-between">
            <div className="aspect-3/4 rounded-xl overflow-hidden bg-stone-200 relative shadow-xs">
              <img
                src={product.images[selectedImageIndex] || product.featuredImage}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-all duration-300"
              />

              {product.isBestSeller && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#68242A] text-white text-[10px] uppercase font-bold tracking-widest shadow-sm">
                  Bestseller
                </span>
              )}
            </div>

            {/* Thumbnail Rail */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-18 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#68242A] shadow-xs scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
            <div className="space-y-5">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-widest text-stone-400">
                  {product.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-stone-700 bg-white px-2.5 py-1 rounded-full border border-stone-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{product.rating.toFixed(1)}</span>
                  <span className="text-stone-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-stone-950 leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">{product.subtitle}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-stone-200">
                <span className="text-2xl font-bold text-stone-950">${product.price} USD</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <>
                    <span className="text-sm text-stone-400 line-through">
                      ${product.compareAtPrice}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Save ${(product.compareAtPrice - product.price)}
                    </span>
                  </>
                )}
              </div>

              {/* Color Selection */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-stone-800">Color:</span>
                  <span className="text-stone-500 font-medium">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all relative flex items-center justify-center ${
                        selectedColor === c.name
                          ? 'border-[#68242A] scale-110 shadow-xs'
                          : 'border-stone-300 hover:border-stone-500'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === c.name && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            c.hex.toLowerCase() === '#fdfbf7' || c.hex.toLowerCase() === '#ebe2d5'
                              ? 'text-stone-900'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-stone-800">Select Size:</span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[#68242A] hover:underline font-medium flex items-center gap-1"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {(['XS', 'S', 'M', 'L', 'XL'] as ProductSize[]).map((size) => {
                    const stock = product.sizes[size] || 0;
                    const disabled = stock === 0;
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 rounded-lg text-xs font-bold border transition-all text-center flex flex-col items-center justify-center ${
                          disabled
                            ? 'bg-stone-100 text-stone-300 border-stone-200 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                            : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <span>{size}</span>
                        <span className="text-[9px] font-normal opacity-80">
                          {disabled ? 'Out' : stock <= 3 ? `${stock} left` : 'In stock'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Live Stock Warning Alert */}
                {currentSizeStock > 0 && currentSizeStock <= 3 && (
                  <p className="mt-2 text-xs text-amber-700 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Only {currentSizeStock} left in size {selectedSize} — order soon!</span>
                  </p>
                )}
                {isOutOfStock && (
                  <p className="mt-2 text-xs text-rose-600 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Currently out of stock in size {selectedSize}. Please select another size.</span>
                  </p>
                )}
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-stone-800">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-900">{quantity}</span>
                  <button
                    type="button"
                    disabled={quantity >= currentSizeStock}
                    onClick={() => setQuantity((q) => Math.min(currentSizeStock, q + 1))}
                    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description & Details */}
              <div className="text-xs text-stone-600 leading-relaxed space-y-2 pt-2 border-t border-stone-200">
                <p>{product.description}</p>
                <ul className="list-disc list-inside space-y-1 text-stone-500 pt-1">
                  {product.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-stone-200 space-y-3">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAdd}
                className={`w-full py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-md ${
                  isOutOfStock
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : addedToast
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#68242A] text-white hover:bg-[#521c21]'
                }`}
              >
                {addedToast ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : (
                  <span>
                    Add to Bag — ${(product.price * quantity).toFixed(2)} USD
                  </span>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-stone-400" />
                  <span>Complimentary Shipping Over $100</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                  <span>Hassle-Free 30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal Sub-View */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-60 bg-stone-950/70 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative shadow-2xl border border-stone-200">
            <button
              type="button"
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif-editorial text-xl font-medium text-stone-900 mb-1">
              Women’s Atelier Size Guide
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Measurements are in inches. For a looser silhouette, we recommend sizing up.
            </p>

            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <th className="py-2">Size</th>
                  <th className="py-2">Bust (in)</th>
                  <th className="py-2">Waist (in)</th>
                  <th className="py-2">Hips (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr><td className="py-2 font-bold">XS (0-2)</td><td>32 - 33</td><td>24 - 25</td><td>34 - 35</td></tr>
                <tr><td className="py-2 font-bold">S (4-6)</td><td>34 - 35</td><td>26 - 27</td><td>36 - 37</td></tr>
                <tr><td className="py-2 font-bold">M (8-10)</td><td>36 - 37</td><td>28 - 29</td><td>38 - 40</td></tr>
                <tr><td className="py-2 font-bold">L (12-14)</td><td>38 - 40</td><td>30 - 32</td><td>41 - 43</td></tr>
                <tr><td className="py-2 font-bold">XL (16)</td><td>41 - 43</td><td>33 - 35</td><td>44 - 46</td></tr>
              </tbody>
            </table>

            <button
              type="button"
              onClick={() => setShowSizeGuide(false)}
              className="w-full mt-6 py-2.5 rounded-lg bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
