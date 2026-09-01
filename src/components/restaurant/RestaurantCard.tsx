'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, MapPin, Heart, ArrowRight, Sparkles, Bike } from 'lucide-react';
import { Restaurant } from '../../types';
import { useOrder } from '../../context/OrderContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { isFavorite, toggleFavorite } = useOrder();
  const isFav = isFavorite(restaurant.id);

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-soft-sm hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover Image & Badges */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
          <Image
            src={restaurant.coverImage}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            quality={70}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            {restaurant.isFeatured ? (
              <span className="pointer-events-auto inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                <Sparkles className="w-3 h-3 fill-white" />
                <span>Featured</span>
              </span>
            ) : (
              <span className="pointer-events-auto inline-flex items-center gap-1 bg-black/50 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                <span>{restaurant.campusZone.split('/')[0]}</span>
              </span>
            )}

            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(restaurant.id);
              }}
              className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-rose-500 flex items-center justify-center transition-transform active:scale-90 shadow-sm"
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Bottom on-image badges */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{restaurant.deliveryTime}</span>
            </div>

            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold">{restaurant.rating}</span>
              <span className="text-slate-300 text-[10px]">({restaurant.ratingCount})</span>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white shadow-soft bg-white -mt-8 z-10">
              <Image
                src={restaurant.logo}
                alt={restaurant.name}
                fill
                className="object-cover"
                sizes="44px"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-orange-600 transition-colors truncate">
                {restaurant.name}
              </h3>
              <p className="text-xs text-slate-500 truncate">{restaurant.tagline}</p>
            </div>
          </div>

          {/* Category tags */}
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {restaurant.categories.map((cat) => (
              <span
                key={cat}
                className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Highlights & Min Order */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Bike className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fee: <strong className="text-slate-800">Rs. {restaurant.deliveryFee}</strong></span>
            </div>
            <div className="text-slate-500">
              Min: <strong className="text-slate-800">Rs. {restaurant.minOrder}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="p-4 sm:p-5 pt-0">
        <Link
          href={`/restaurants/${restaurant.id}`}
          className="w-full py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200"
        >
          <span>View Full Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
