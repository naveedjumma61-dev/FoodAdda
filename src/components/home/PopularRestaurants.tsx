'use client';

import React from 'react';
import Link from 'next/link';
import { RESTAURANTS_DATA } from '../../data/mockData';
import { RestaurantCard } from '../restaurant/RestaurantCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export const PopularRestaurants: React.FC = () => {
  const featured = RESTAURANTS_DATA.slice(0, 6);

  return (
    <section className="py-14 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-orange-600 text-xs font-black uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>Campus Verified</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Popular Spots Near You
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top-rated food hubs delivering hot to COMSATS, Abasyn, and Hostel City Islamabad
            </p>
          </div>

          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200/80 shadow-soft-sm transition-all"
          >
            <span>Explore All ({RESTAURANTS_DATA.length})</span>
            <ArrowRight className="w-4 h-4 text-orange-500" />
          </Link>
        </div>

        {/* Restaurant Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

      </div>
    </section>
  );
};
