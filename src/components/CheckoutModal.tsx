import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Shield, Truck, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { CartItem, CustomerInfo, Order, PaymentMethod } from '../types';
import { api } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedPromo: string;
  onOrderPlaced: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  appliedPromo,
  onOrderPlaced,
  onClearCart,
}) => {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');

  // Dummy Card Info for UI authenticity
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Discount
  let discount = 0;
  if (appliedPromo.toUpperCase() === 'VINOZ15') {
    discount = Math.round(subtotal * 0.15);
  } else if (appliedPromo.toUpperCase() === 'FIRST10') {
    discount = Math.round(subtotal * 0.1);
  }

  // Shipping
  const standardShipping = subtotal >= 100 ? 0 : 10;
  const shippingFee = deliveryMethod === 'express' ? 15 : standardShipping;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customer.fullName || !customer.email || !customer.address || !customer.city) {
      setErrorMessage('Please fill in all required shipping fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer,
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          size: item.selectedSize,
          color: item.selectedColor,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          image: item.product.featuredImage,
        })),
        subtotal,
        shippingFee,
        discount,
        promoCode: appliedPromo || undefined,
        total: grandTotal,
        paymentMethod,
      };

      const order = await api.placeOrder(orderPayload);
      try {
        const savedIdsRaw = localStorage.getItem('vinoz_order_history');
        const savedIds: string[] = savedIdsRaw ? JSON.parse(savedIdsRaw) : [];
        if (!savedIds.includes(order.id)) {
          localStorage.setItem('vinoz_order_history', JSON.stringify([order.id, ...savedIds]));
        }
      } catch (e) {
        console.error(e);
      }

      setPlacedOrder(order);
      onOrderPlaced(order);
      onClearCart();
      setStep('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please check inventory and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-[#FAF8F5] rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-stone-200 z-10 my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#68242A]" />
            <h2 className="font-serif-editorial text-xl font-semibold text-stone-900">
              {step === 'success' ? 'Order Confirmation' : 'Secure Atelier Checkout'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step: Success Screen */}
        {step === 'success' && placedOrder ? (
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-editorial text-3xl font-medium text-stone-950">
                Thank you for your order
              </h3>
              <p className="text-sm text-stone-600">
                We have received your order <strong className="text-stone-900">#{placedOrder.id}</strong>. 
                A confirmation has been sent to <strong className="text-stone-900">{placedOrder.customer.email}</strong>.
              </p>
            </div>

            {/* Order Brief Box */}
            <div className="max-w-md mx-auto bg-white rounded-xl p-5 border border-stone-200 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">Order Number</span>
                <span className="font-mono font-bold text-stone-900">#{placedOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">Status</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-semibold uppercase text-[10px]">
                  {placedOrder.status}
                </span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">Shipping Address</span>
                <span className="font-medium text-stone-800 text-right">
                  {placedOrder.customer.fullName}<br />
                  {placedOrder.customer.address}, {placedOrder.customer.city}
                </span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 text-sm pt-1">
                <span>Total Paid</span>
                <span>${placedOrder.total.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-stone-900 text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#68242A] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Step: Form Details & Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
            {/* Left: Input Form */}
            <form onSubmit={handleSubmitOrder} className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-stone-200">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Contact & Shipping Address */}
              <div>
                <h3 className="font-serif-editorial text-lg font-semibold text-stone-900 mb-3">
                  1. Shipping Information
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Sophia Laurent"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#68242A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="sophia@example.com"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#68242A]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#68242A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="420 Park Avenue South, Apt 8B"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#68242A]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="New York"
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#68242A]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">State</label>
                      <input
                        type="text"
                        placeholder="NY"
                        value={customer.state}
                        onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#68242A]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Postal Code</label>
                      <input
                        type="text"
                        placeholder="10016"
                        value={customer.postalCode}
                        onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#68242A]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Delivery Options */}
              <div>
                <h3 className="font-serif-editorial text-lg font-semibold text-stone-900 mb-3">
                  2. Delivery Speed
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    onClick={() => setDeliveryMethod('standard')}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      deliveryMethod === 'standard'
                        ? 'border-[#68242A] bg-white ring-1 ring-[#68242A]'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-stone-900">Standard Delivery</p>
                      <p className="text-stone-500 text-[11px]">3 - 5 business days</p>
                    </div>
                    <span className="font-bold text-stone-900">
                      {standardShipping === 0 ? 'FREE' : '$10.00'}
                    </span>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod('express')}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      deliveryMethod === 'express'
                        ? 'border-[#68242A] bg-white ring-1 ring-[#68242A]'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-stone-900">Express Priority</p>
                      <p className="text-stone-500 text-[11px]">1 - 2 business days</p>
                    </div>
                    <span className="font-bold text-stone-900">$15.00</span>
                  </label>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div>
                <h3 className="font-serif-editorial text-lg font-semibold text-stone-900 mb-3">
                  3. Payment Method
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'credit_card'
                          ? 'bg-[#68242A] text-white border-[#68242A]'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'upi'
                          ? 'bg-[#68242A] text-white border-[#68242A]'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <span>UPI / Net</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'cod'
                          ? 'bg-[#68242A] text-white border-[#68242A]'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <span>Pay on Arrival</span>
                    </button>
                  </div>

                  {/* Card input mockup */}
                  {paymentMethod === 'credit_card' && (
                    <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                      <div>
                        <label className="block text-stone-500 text-[11px] mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded p-2 text-stone-800"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-stone-500 text-[11px] mb-1">Expiry</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded p-2 text-stone-800"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-500 text-[11px] mb-1">CVC</label>
                          <input
                            type="text"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded p-2 text-stone-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 rounded-xl bg-[#68242A] text-white text-xs uppercase tracking-widest font-bold hover:bg-[#521c21] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <span>Place Order — ${grandTotal.toFixed(2)} USD</span>
                )}
              </button>
            </form>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-stone-50 space-y-5 flex flex-col justify-between">
              <div>
                <h3 className="font-serif-editorial text-lg font-semibold text-stone-900 mb-3">
                  Bag Summary ({cart.reduce((s, i) => s + i.quantity, 0)})
                </h3>

                {/* Items List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs items-center">
                      <img
                        src={item.product.featuredImage}
                        alt={item.product.name}
                        className="w-12 h-16 object-cover object-top rounded bg-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 truncate">{item.product.name}</p>
                        <p className="text-stone-500 text-[11px]">
                          Size: {item.selectedSize} • {item.selectedColor}
                        </p>
                        <p className="text-stone-500 text-[11px]">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-stone-900">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="mt-5 pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Promo ({appliedPromo})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? 'Complimentary' : `$${shippingFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                    <span>Grand Total (USD)</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 text-[11px] text-stone-500 space-y-1">
                <p className="flex items-center gap-1.5 font-medium text-stone-700">
                  <Shield className="w-3.5 h-3.5 text-[#68242A]" />
                  <span>256-Bit SSL Encrypted Transaction</span>
                </p>
                <p>By placing this order, you agree to Vino’z Fashion Atelier’s Terms of Service and 30-day return policy.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
