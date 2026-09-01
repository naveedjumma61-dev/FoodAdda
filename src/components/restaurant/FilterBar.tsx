'use client';

import React from 'react';
import { Search, SlidersHorizontal, Star, Clock, Sparkles } from 'lucide-react';
import { FoodCategoryType } from '../../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: FoodCategoryType | 'All';
  onSelectCategory: (cat: FoodCategoryType | 'All') => void;
  sortBy: 'recommended' | 'rating' | 'deliveryTime' | 'minOrder';
  onSortChange: (sort: 'recommended' | 'rating' | 'deliveryTime' | 'minOrder') => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
}

const CATEGORIES: (FoodCategoryType | 'All')[] = [
  'All',
  'Biryani',
  'Burger',
  'Fast Food',
  'Pizza',
  'Tea & Cafe',
  'Juice',
  'Desi Food',
  'Chinese',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  minRating,
  onMinRatingChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search restaurants, biryani, zinger, shawarma, karahi..."
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded-md bg-slate-100"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-3 rounded-2xl shadow-soft-sm text-xs sm:text-sm">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="recommended">Featured / Top Spots</option>
              <option value="rating">Highest Rated (★ 4.5+)</option>
              <option value="deliveryTime">Fastest Delivery (15-20 min)</option>
              <option value="minOrder">Lowest Min Order (Rs.)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-soft font-extrabold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
