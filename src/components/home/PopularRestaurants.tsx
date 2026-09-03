'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RESTAURANTS_DATA } from '../../data/mockData';
import { RestaurantCard } from '../restaurant/RestaurantCard';
import { Restaurant } from '../../types';
import { ArrowRight, Sparkles } from 'lucide-react';

export const PopularRestaurants: React.FC = () => {
  const [restaurantsList, setRestaurantsList] = useState<Restaurant[]>(RESTAURANTS_DATA);

  useEffect(() => {
    fetch('/api/restaurants')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.restaurants) && data.restaurants.length > 0) {
          setRestaurantsList(
            data.restaurants.map((r: any) => ({
              id: r.id,
              name: r.name,
              tagline: r.description || 'Authentic campus meals',
              logo: r.logoImage || r.logo || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80',
              coverImage: r.coverImage || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80',
              categories: [r.category as any || 'Desi Food'],
              rating: r.rating || 4.8,
              ratingCount: 140,
              deliveryTime: '15-25 min',
              distance: '0.8 km',
              minOrder: r.minimumOrder || 250,
              deliveryFee: r.deliveryFee || 40,
              isOpen: r.active !== false,
              openingHours: r.openingHours || '10:00 AM - 03:00 AM',
              campusZone: r.location || 'COMSATS Gate 1 / Hostel City',
              address: r.address || 'Hostel City, Islamabad',
              phone: r.phone || '+92 300 0000000',
              featuredDishes: ['Student Special', 'Biryani', 'Chai'],
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const featured = restaurantsList.slice(0, 6);

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
            <span>Explore All ({restaurantsList.length})</span>
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
