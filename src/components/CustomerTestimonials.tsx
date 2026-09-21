import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  rating: number;
  text: string;
  author: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    rating: 5,
    text: 'The quality of the earrings is amazing! They look even better in person.',
    author: 'Priya S.',
  },
  {
    id: '2',
    rating: 5,
    text: 'Absolutely in love with my new dress. The fabric and fit are perfect.',
    author: 'Anita K.',
  },
  {
    id: '3',
    rating: 5,
    text: 'Fast shipping and beautiful packaging. Will definitely shop here again.',
    author: 'Meera R.',
  },
];

export const CustomerTestimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5] border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-stone-500 text-sm sm:text-base mt-2">
            Don't just take our word for it
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Review Quote */}
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed italic mb-6">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="pt-4 border-t border-stone-100">
                <span className="font-semibold text-stone-900 text-sm tracking-wide">
                  — {t.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
