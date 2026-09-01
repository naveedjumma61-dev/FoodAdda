'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { RESTAURANTS_DATA, MENU_ITEMS_DATA } from '../../../data/mockData';
import { FoodItemCard } from '../../../components/restaurant/FoodItemCard';
import { useCart } from '../../../context/CartContext';
import { useOrder } from '../../../context/OrderContext';
import {
  Star,
  Clock,
  MapPin,
  Heart,
  Bike,
  Phone,
  Info,
  ChevronLeft,
  ShoppingBag,
  Sparkles,
  Search,
  Utensils,
} from 'lucide-react';

export default function RestaurantDetailPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const { totalItems, subtotal, openCart } = useCart();
  const { isFavorite, toggleFavorite } = useOrder();

  const fallbackRestaurant = RESTAURANTS_DATA.find((r) => r.id === restaurantId) || RESTAURANTS_DATA[0];
  const [loadedRestaurant, setLoadedRestaurant] = useState<any>(null);
  const [loadedItems, setLoadedItems] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.restaurant) {
          const r = data.restaurant;
          setLoadedRestaurant({
            id: r.id,
            name: r.name,
            tagline: r.description || 'Authentic campus meals',
            logo: r.logoImage || r.logo || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80',
            coverImage: r.coverImage || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80',
            categories: [r.category || 'Desi Food'],
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
          });

          if (Array.isArray(r.menuItems) && r.menuItems.length > 0) {
            setLoadedItems(
              r.menuItems.map((m: any) => ({
                id: m.id,
                restaurantId: r.id,
                restaurantName: r.name,
                name: m.name,
                description: m.description || '',
                price: m.price,
                image: m.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
                category: m.category || 'Desi Food',
                isPopular: true,
              }))
            );
          }
        }
      })
      .catch(() => {});
  }, [restaurantId]);

  const activeRestaurant = loadedRestaurant || fallbackRestaurant;

  const items = useMemo(() => {
    if (loadedItems.length > 0) return loadedItems;
    return MENU_ITEMS_DATA.filter((i) => i.restaurantId === activeRestaurant.id);
  }, [loadedItems, activeRestaurant]);

  // Extract unique categories available in this restaurant's menu
  const menuCategories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category)));
    return ['All', ...cats];
  }, [items]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchItemQuery, setSearchItemQuery] = useState<string>('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchItemQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchItemQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchItemQuery]);

  const isFav = isFavorite(activeRestaurant.id);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Cover Header Banner */}
      <div className="relative h-64 sm:h-80 w-full bg-slate-900">
        <Image
          src={activeRestaurant.coverImage}
          alt={activeRestaurant.name}
          fill
          priority
          className="object-cover opacity-80"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

        {/* Back navigation & Wishlist */}
        <div className="absolute top-4 left-4 right-4 max-w-7xl mx-auto flex items-center justify-between z-10">
          <Link
            href="/restaurants"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-800 font-bold text-xs shadow-soft backdrop-blur-md transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Restaurants</span>
          </Link>

          <button
            onClick={() => toggleFavorite(activeRestaurant.id)}
            className="w-10 h-10 rounded-2xl bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-soft backdrop-blur-md transition-transform active:scale-95"
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-700'}`} />
          </button>
        </div>

        {/* Bottom Hero Info */}
        <div className="absolute bottom-4 left-4 right-4 max-w-7xl mx-auto text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white shadow-soft bg-white flex-shrink-0">
              <Image
                src={activeRestaurant.logo}
                alt={activeRestaurant.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold uppercase bg-orange-500 text-white px-2.5 py-0.5 rounded-md">
                  Open Now
                </span>
                <span className="text-xs text-orange-200 font-medium">
                  {activeRestaurant.campusZone}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">{activeRestaurant.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">{activeRestaurant.tagline}</p>
            </div>
          </div>

          {/* Key Metrics Chips */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-xs font-bold">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{activeRestaurant.rating}</span>
              <span className="text-slate-400 font-normal">({activeRestaurant.ratingCount}+)</span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-xs font-bold">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>{activeRestaurant.deliveryTime}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-xs font-bold">
              <Bike className="w-4 h-4 text-emerald-400" />
              <span>Fee: Rs. {activeRestaurant.deliveryFee}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Restaurant Info Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span>{activeRestaurant.address}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Hours: {activeRestaurant.openingHours}</span>
            </div>
            <div className="flex items-center gap-1 text-orange-600">
              <Phone className="w-3.5 h-3.5" />
              <span>{activeRestaurant.phone}</span>
            </div>
          </div>
        </div>

        {/* Menu Search & Sticky Category Bar */}
        <div className="sticky top-16 sm:top-20 z-30 bg-slate-50/95 backdrop-blur-md py-3 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 pb-1 sm:pb-0">
              {menuCategories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
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

            {/* Quick search input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchItemQuery}
                onChange={(e) => setSearchItemQuery(e.target.value)}
                placeholder="Search this menu..."
                className="w-full pl-10 pr-4 py-2 bg-white rounded-2xl border border-slate-200/80 text-xs font-medium focus:outline-none focus:border-orange-500 shadow-soft-sm"
              />
            </div>
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="mt-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">
              {selectedCategory === 'All' ? 'Full Menu' : selectedCategory} ({filteredItems.length})
            </h3>
            <span className="text-xs text-slate-400">Priced in PKR • Hot & Fresh</span>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <FoodItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft-sm space-y-3">
              <Utensils className="w-8 h-8 text-orange-400 mx-auto" />
              <h4 className="font-bold text-slate-800 text-base">No items match your search</h4>
              <p className="text-xs text-slate-500">Try searching for other dishes or change category tab.</p>
            </div>
          )}
        </div>

      </div>

      {/* Floating Bottom Cart Bar if items exist */}
      {totalItems > 0 && (
        <div className="fixed bottom-16 md:bottom-6 left-4 right-4 max-w-md mx-auto z-30">
          <button
            onClick={openCart}
            className="w-full bg-slate-900 hover:bg-slate-800 active:bg-black text-white p-4 rounded-2xl shadow-soft-lg flex items-center justify-between transition-all hover-glow border border-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
                {totalItems}
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-300">View Cart</p>
                <p className="text-sm font-black text-white">Rs. {subtotal}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-orange-400 text-xs font-extrabold">
              <span>Checkout Order</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

    </div>
  );
}
