import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Truck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onExploreProducts: () => void;
  appliedPromo: string;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onExploreProducts,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const freeShippingThreshold = 100;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 10;

  // Calculate discount
  let discount = 0;
  if (appliedPromo.toUpperCase() === 'VINOZ15') {
    discount = Math.round(subtotal * 0.15);
  } else if (appliedPromo.toUpperCase() === 'FIRST10') {
    discount = Math.round(subtotal * 0.1);
  }

  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyPromo(promoInput.trim());
    if (success) {
      setPromoInput('');
      setPromoError('');
    } else {
      setPromoError('Invalid promotion code. Try VINOZ15 or FIRST10.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-stone-200 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#68242A]" />
              <h2 className="font-serif-editorial text-xl font-semibold text-stone-900">
                Shopping Bag
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                ({cart.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#F4EFE6] px-5 py-3 border-b border-[#EBE4D8] text-xs">
            <div className="flex items-center justify-between font-medium text-stone-800 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#68242A]" />
                {amountToFreeShipping === 0 ? (
                  <span className="text-emerald-800 font-semibold">
                    You unlocked Complimentary Express Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#68242A]">${amountToFreeShipping}</strong> more for
                    Free Delivery
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-[#E0D6C6] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#68242A] h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 mx-auto flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif-editorial text-lg font-medium text-stone-900">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                    Explore our Autumn / Winter capsule to discover artisanal silks and coats.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onExploreProducts();
                  }}
                  className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#68242A] transition-colors"
                >
                  Discover Collections
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs"
                >
                  <img
                    src={item.product.featuredImage}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover object-top rounded-lg bg-stone-100 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-stone-500 mt-0.5 space-x-2">
                        <span>Size: <strong className="text-stone-800">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span>{item.selectedColor}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-stone-950">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-white space-y-3.5">
              {/* Promo Code Form */}
              {appliedPromo ? (
                <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Code <strong>{appliedPromo}</strong> applied (-${discount})</span>
                  </div>
                  <button
                    type="button"
                    onClick={onRemovePromo}
                    className="text-stone-400 hover:text-stone-700 underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromoCode} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. VINOZ15)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs uppercase placeholder-normal text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#68242A]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#68242A] transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && <p className="text-[11px] text-rose-600">{promoError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Vino’z Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? 'Complimentary' : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-100">
                  <span>Total (USD)</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-xl bg-[#68242A] text-white text-xs uppercase tracking-widest font-bold hover:bg-[#521c21] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-stone-400">
                Taxes calculated during checkout • 100% Encrypted Checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
