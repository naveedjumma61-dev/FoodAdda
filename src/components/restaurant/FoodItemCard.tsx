'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { Plus, Minus, Flame, Sparkles, SlidersHorizontal } from 'lucide-react';
import { ItemModal } from './ItemModal';

interface FoodItemCardProps {
  item: MenuItem;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({ item }) => {
  const { addItem, items, updateQuantity } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if this item is already in cart (matching base item id)
  const cartMatches = items.filter((cartItem) => cartItem.menuItem.id === item.id);
  const totalInCart = cartMatches.reduce((sum, ci) => sum + ci.quantity, 0);

  const handleAddClick = () => {
    // If item has customizable options, open modal; otherwise quick add 1
    if (item.optionGroups && item.optionGroups.length > 0) {
      setIsModalOpen(true);
    } else {
      addItem(item, 1);
    }
  };

  return (
    <>
      <div className="group bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft-sm hover:shadow-soft transition-all duration-300 flex flex-col sm:flex-row gap-4 justify-between">
        {/* Text Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0 order-2 sm:order-1">
          <div>
            {/* Badges */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {item.isPopular && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" />
                  Popular Hit
                </span>
              )}
              {item.isSpicy && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                  <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                  Spicy
                </span>
              )}
              {item.isVeg && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  🌱 Veg
                </span>
              )}
            </div>

            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-orange-600 transition-colors">
              {item.name}
            </h4>

            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Pricing & Add Button */}
          <div className="flex items-center justify-between mt-3.5 pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-slate-900">
                Rs. {item.price}
              </span>
              {item.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  Rs. {item.originalPrice}
                </span>
              )}
            </div>

            {/* If item has custom options, show Customize button; otherwise dynamic + / - or Add */}
            {item.optionGroups && item.optionGroups.length > 0 ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-soft-sm"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>
            ) : totalInCart > 0 && cartMatches[0] ? (
              <div className="flex items-center bg-orange-50 rounded-xl p-1 border border-orange-200">
                <button
                  onClick={() => updateQuantity(cartMatches[0].id, cartMatches[0].quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center text-orange-600 hover:bg-orange-500 hover:text-white rounded-lg transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 text-xs font-black text-orange-700">
                  {totalInCart}
                </span>
                <button
                  onClick={() => updateQuantity(cartMatches[0].id, cartMatches[0].quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-orange-600 hover:bg-orange-500 hover:text-white rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddClick}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-soft transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>

        {/* Food Image */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="relative w-full sm:w-32 h-36 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 cursor-pointer order-1 sm:order-2"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, 130px"
          />
        </div>
      </div>

      {/* Customization Modal */}
      <ItemModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
