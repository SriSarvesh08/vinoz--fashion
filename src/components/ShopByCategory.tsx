import React from 'react';
import { ProductCategory } from '../types';
import { ArrowRight } from 'lucide-react';

interface CategoryItem {
  id: ProductCategory;
  title: string;
  image: string;
  itemCountText?: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'Dresses',
    title: 'Dresses',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    itemCountText: '5 Styles',
  },
  {
    id: 'Earrings',
    title: 'Earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    itemCountText: '5 Styles',
  },
  {
    id: 'Necklaces',
    title: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    itemCountText: '2 Styles',
  },
  {
    id: 'Rings',
    title: 'Rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    itemCountText: '2 Styles',
  },
  {
    id: 'Hair Clips',
    title: 'Hair Clips',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    itemCountText: '5 Styles',
  },
  {
    id: 'Bangles',
    title: 'Bangles',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
    itemCountText: '2 Styles',
  },
  {
    id: 'Chains',
    title: 'Chains',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    itemCountText: '2 Styles',
  },
  {
    id: 'Bracelets',
    title: 'Bracelets',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80',
    itemCountText: '2 Styles',
  },
];

interface ShopByCategoryProps {
  onSelectCategory: (category: ProductCategory) => void;
  activeCategory?: ProductCategory;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  return (
    <section id="shop-by-category" className="py-16 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight">
            Shop by Category
          </h2>
          <p className="text-stone-500 text-sm sm:text-base mt-2">
            Find exactly what you're looking for
          </p>
        </div>

        {/* 8-Card Grid matching reference image */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((item) => {
            const isSelected = activeCategory === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectCategory(item.id)}
                className={`group relative aspect-4/5 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-[#9B3C52] ${
                  isSelected ? 'ring-2 ring-[#9B3C52] scale-[1.02]' : ''
                }`}
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent group-hover:from-black/85 transition-colors duration-300" />

                {/* Subtle Hover Ring Accent */}
                <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 rounded-2xl transition-colors pointer-events-none" />

                {/* Centered Category Title Label */}
                <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                  <h3 className="text-white font-medium text-base sm:text-lg tracking-wide group-hover:translate-y-[-2px] transition-transform duration-300">
                    {item.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] text-white/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                    Explore Collection <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
