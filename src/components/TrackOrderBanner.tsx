import React from 'react';
import { Package } from 'lucide-react';

interface TrackOrderBannerProps {
  onOpenTrackOrder: () => void;
}

export const TrackOrderBanner: React.FC<TrackOrderBannerProps> = ({ onOpenTrackOrder }) => {
  return (
    <section className="bg-[#9B3C52] text-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-2">
          <Package className="w-6 h-6 text-white" />
        </div>
        <h2 className="font-playfair text-3xl sm:text-4xl font-normal tracking-tight text-white">
          Waiting for your beautiful items?
        </h2>
        <p className="text-white/85 text-sm sm:text-base max-w-xl mx-auto">
          Track your order instantly using your Order ID and phone number.
        </p>
        <div className="pt-4">
          <button
            type="button"
            onClick={onOpenTrackOrder}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-[#9B3C52] font-semibold text-sm hover:bg-stone-50 hover:shadow-lg transition-all"
          >
            Track Your Order
          </button>
        </div>
      </div>
    </section>
  );
};
