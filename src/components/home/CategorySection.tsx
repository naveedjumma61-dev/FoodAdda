'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES_DATA } from '../../data/mockData';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';

export const CategorySection: React.FC = () => {
  return (
    <section id="categories" className="py-12 sm:py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 text-orange-600 text-xs font-black uppercase tracking-wider mb-1.5">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>Explore Cravings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Popular Food Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your favourite meal to view active campus menus and live deals
            </p>
          </div>

          <Link
            href="/restaurants"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            <span>View All Restaurants</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Large Food Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-6">
          {CATEGORIES_DATA.map((cat) => (
            <Link
              key={cat.id}
              href={`/restaurants?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-3xl overflow-hidden shadow-soft-sm hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1.5 bg-slate-950 aspect-[4/5] sm:aspect-[3/4] flex flex-col justify-end p-4 sm:p-5 border border-slate-200/60"
            >
              {/* Category Food Image */}
              <Image
                src={cat.image}
                alt={cat.displayName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                quality={70}
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:via-slate-950/30 transition-colors duration-300" />

              {/* Badge on top */}
              {cat.badge && (
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                  <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                    {cat.badge}
                  </span>
                </div>
              )}

              {/* Bottom Details */}
              <div className="relative z-10 text-white space-y-1">
                <h3 className="font-black text-base sm:text-xl tracking-tight leading-tight group-hover:text-orange-400 transition-colors">
                  {cat.displayName}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{cat.itemCount}+ Dishes</span>
                  <div className="w-7 h-7 rounded-full bg-orange-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-x-1 group-hover:translate-x-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
