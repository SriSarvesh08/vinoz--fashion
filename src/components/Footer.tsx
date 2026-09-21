import React, { useState } from 'react';
import { Instagram, Phone, Mail, MapPin, Heart, Shield, HelpCircle } from 'lucide-react';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (category: ProductCategory) => void;
  onOpenTrackOrder: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTrackOrder,
}) => {
  const [activeModal, setActiveModal] = useState<'shipping' | 'faq' | null>(null);

  return (
    <footer className="bg-[#18181B] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-Column Grid matching Reference Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-stone-800/80">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <h3 className="font-playfair text-2xl text-white font-normal tracking-wide">
              Vino'z Fashion
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-xs">
              Where Style Meets Elegance. Curated accessories and stunning dresses for the modern woman.
            </p>
            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-[#9B3C52] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Shop
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('All')}
                  className="hover:text-white transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('Dresses')}
                  className="hover:text-white transition-colors"
                >
                  Dresses
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('Earrings')}
                  className="hover:text-white transition-colors"
                >
                  Earrings
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('Necklaces')}
                  className="hover:text-white transition-colors"
                >
                  Necklaces
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('Bangles')}
                  className="hover:text-white transition-colors"
                >
                  Bangles &amp; Bracelets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('Rings')}
                  className="hover:text-white transition-colors"
                >
                  Rings
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('Hair Clips')}
                  className="hover:text-white transition-colors"
                >
                  Hair Clips
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Help
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenTrackOrder}
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('shipping')}
                  className="hover:text-white transition-colors"
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('faq')}
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us matching Reference Image 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-stone-400">
              {/* Phone */}
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#9B3C52] shrink-0 mt-0.5" />
                <div>
                  <a
                    href="tel:+917397064903"
                    className="hover:text-white transition-colors font-medium text-stone-200"
                  >
                    +91 7397064903
                  </a>
                  <p className="text-[11px] text-stone-500">Mon - Sat, 10AM - 6PM</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#9B3C52] shrink-0" />
                <a
                  href="mailto:vinozfashion@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  vinozfashion@gmail.com
                </a>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9B3C52] shrink-0 mt-0.5" />
                <span>Coimbatore, Tamil Nadu 641001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar matching Reference Image 2 */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2024 Vino'z Fashion. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>in India</span>
          </p>
          <p className="flex items-center gap-1.5 text-stone-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secured by Razorpay</span>
          </p>
        </div>
      </div>

      {/* Shipping Policy & FAQ Mini Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white text-stone-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <h3 className="font-playfair text-2xl font-medium mb-3 text-stone-900">
              {activeModal === 'shipping' ? 'Shipping Policy' : 'Frequently Asked Questions'}
            </h3>

            {activeModal === 'shipping' ? (
              <div className="text-xs sm:text-sm text-stone-600 space-y-3 leading-relaxed">
                <p>
                  <strong>Free Express Shipping:</strong> We provide complimentary insured delivery on all orders above $50.
                </p>
                <p>
                  <strong>Processing Time:</strong> Orders placed before 3 PM are packaged with care in signature Vino'z boxes and dispatched within 24 hours.
                </p>
                <p>
                  <strong>Delivery Windows:</strong> Domestic orders typically arrive within 2-4 business days. International delivery takes 5-7 business days.
                </p>
                <p>
                  <strong>Tracking:</strong> You will receive real-time SMS &amp; email tracking updates upon dispatch. You can also track your package anytime using the "Track Order" link above.
                </p>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-stone-600 space-y-4 leading-relaxed">
                <div>
                  <p className="font-semibold text-stone-900">Are all accessories genuine?</p>
                  <p className="mt-1">Yes, our jewelry is crafted using genuine 18K gold vermeil, sterling silver, natural baroque pearls, and hypoallergenic surgical steel.</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-900">How do I track my order?</p>
                  <p className="mt-1">Click the "Track Order" button in the navigation or enter your Order ID and phone number into the tracker banner.</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-900">What payment methods do you accept?</p>
                  <p className="mt-1">We accept all major credit cards, debit cards, UPI, net banking, and PayPal secured by Razorpay 256-bit encryption.</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-stone-900 text-white rounded-full text-xs font-semibold hover:bg-[#9B3C52] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
