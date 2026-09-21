import React from 'react';
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Award } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
  onFeaturedPicks: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopNow,
  onFeaturedPicks,
}) => {
  return (
    <section className="relative overflow-hidden">
      {/* 1. Romantic Heart Bokeh Background matching Reference Image 1 */}
      <div className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Background Image with Heart Bokeh */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 transform"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />

        {/* Soft Golden & Rose Warm Light Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65 z-10" />

        {/* Floating Heart Ambient Glows */}
        <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-[#9B3C52]/25 blur-3xl pointer-events-none z-10" />
        <div className="absolute bottom-1/4 right-1/5 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none z-10" />

        {/* Central Hero Content Card */}
        <div className="relative z-20 max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-700">
          {/* Badge matching reference */}
          <div className="inline-flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white text-xs font-semibold tracking-[0.2em] uppercase">
              NEW COLLECTION 2024
            </span>
          </div>

          {/* Heading matching reference: "Adorn Yourself" / "with Elegance" */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-normal text-white tracking-tight leading-[1.1]">
            Adorn Yourself <br />
            <span className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F3A5B8] font-normal tracking-normal inline-block mt-1">
              with Elegance
            </span>
          </h1>

          {/* Subtitle description */}
          <p className="text-white/90 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto">
            Discover our curated collection of premium women's accessories and stunning dresses designed to make you shine.
          </p>

          {/* CTA Buttons side by side matching reference */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onShopNow}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#9B3C52] hover:bg-[#832E41] text-white text-sm font-semibold tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onFeaturedPicks}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/50 hover:border-white text-white hover:bg-white/10 text-sm font-semibold tracking-wide backdrop-blur-xs transition-all duration-200"
            >
              Featured Picks
            </button>
          </div>
        </div>
      </div>

      {/* 2. Trust Badges Strip directly under hero matching Reference Image 1 */}
      <div className="bg-[#9B3C52] text-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Badge 1: Free Shipping */}
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">Free Shipping</p>
              <p className="text-xs text-white/80 mt-0.5">On orders above $50</p>
            </div>
          </div>

          {/* Badge 2: 100% Authentic */}
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">100% Authentic</p>
              <p className="text-xs text-white/80 mt-0.5">Genuine products</p>
            </div>
          </div>

          {/* Badge 3: Secure Payment */}
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">Secure Payment</p>
              <p className="text-xs text-white/80 mt-0.5">100% secure checkout</p>
            </div>
          </div>

          {/* Badge 4: Quality Assured */}
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">Quality Assured</p>
              <p className="text-xs text-white/80 mt-0.5">Premium materials</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
