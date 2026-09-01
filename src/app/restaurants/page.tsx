'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RESTAURANTS_DATA, MENU_ITEMS_DATA } from '../../data/mockData';
import { RestaurantCard } from '../../components/restaurant/RestaurantCard';
import { FoodItemCard } from '../../components/restaurant/FoodItemCard';
import { FilterBar } from '../../components/restaurant/FilterBar';
import { FoodCategoryType } from '../../types';
import { Utensils, Search, Sparkles, Filter, Store, ListFilter } from 'lucide-react';

function RestaurantsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as FoodCategoryType | null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategoryType | 'All'>(
    categoryParam || 'All'
  );
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'deliveryTime' | 'minOrder'>(
    'recommended'
  );
  const [minRating, setMinRating] = useState<number>(0);
  const [viewTab, setViewTab] = useState<'restaurants' | 'dishes'>('restaurants');

  const [restaurantsList, setRestaurantsList] = useState(RESTAURANTS_DATA);
  const [dishesList, setDishesList] = useState(MENU_ITEMS_DATA);

  // Fetch real data from PostgreSQL API
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

    fetch('/api/menu-items')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setDishesList(
            data.items.map((item: any) => ({
              id: item.id,
              restaurantId: item.restaurantId,
              restaurantName: item.restaurant?.name || 'Partner Restaurant',
              name: item.name,
              description: item.description || '',
              price: item.price,
              image: item.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
              category: item.category as any || 'Desi Food',
              isPopular: true,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  // Update selected category when query parameter changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Filter restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurantsList.filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        restaurant.featuredDishes.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || restaurant.categories.includes(selectedCategory);

      const matchesRating = restaurant.rating >= minRating;

      return matchesSearch && matchesCategory && matchesRating;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'minOrder') return a.minOrder - b.minOrder;
      if (sortBy === 'deliveryTime') {
        const timeA = parseInt(a.deliveryTime) || 20;
        const timeB = parseInt(b.deliveryTime) || 20;
        return timeA - timeB;
      }
      return 0; // Default recommended
    });
  }, [restaurantsList, searchQuery, selectedCategory, minRating, sortBy]);

  // Filter menu items directly for dish search
  const filteredDishes = useMemo(() => {
    return dishesList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [dishesList, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Top Title Banner */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-soft relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="bg-white/20 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full">
              Explore Campus Menus
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Food Delivery in Islamabad
            </h1>
            <p className="text-xs sm:text-sm text-orange-100">
              Fresh hot deliveries to COMSATS, Abasyn, and Hostel City residential spots.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          minRating={minRating}
          onMinRatingChange={setMinRating}
        />

        {/* View Switcher (Restaurants vs Specific Dishes) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewTab('restaurants')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                viewTab === 'restaurants'
                  ? 'bg-slate-900 text-white shadow-soft-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Restaurants ({filteredRestaurants.length})</span>
            </button>

            <button
              onClick={() => setViewTab('dishes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                viewTab === 'dishes'
                  ? 'bg-slate-900 text-white shadow-soft-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Direct Dishes ({filteredDishes.length})</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 hidden sm:block">
            {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
          </span>
        </div>

        {/* Results Container */}
        {viewTab === 'restaurants' ? (
          filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft-sm space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">No Restaurants Found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search keywords or switching category filters.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-soft"
              >
                Reset All Filters
              </button>
            </div>
          )
        ) : (
          /* Dishes Grid */
          filteredDishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDishes.map((dish) => (
                <FoodItemCard key={dish.id} item={dish} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft-sm space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                <Utensils className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">No Dishes Matching Search</h3>
              <p className="text-xs text-slate-500">
                Check your spelling or explore the full restaurant menus.
              </p>
            </div>
          )
        )}

      </div>
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-bold">Loading Restaurants...</div>}>
      <RestaurantsContent />
    </Suspense>
  );
}

