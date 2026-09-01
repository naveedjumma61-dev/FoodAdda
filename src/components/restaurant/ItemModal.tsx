'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MenuItem, MenuItemAddon } from '../../types';
import { useCart } from '../../context/CartContext';
import { X, Plus, Minus, Check, Flame, ShoppingBag } from 'lucide-react';

interface ItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, isOpen, onClose }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<MenuItemAddon[]>([]);
  const [specialNote, setSpecialNote] = useState('');

  if (!isOpen || !item) return null;

  // Handle addon toggling
  const handleToggleAddon = (addon: MenuItemAddon, isSingleSelect: boolean = false, groupOptions?: MenuItemAddon[]) => {
    if (isSingleSelect && groupOptions) {
      const groupIds = groupOptions.map((o) => o.id);
      const filtered = selectedAddons.filter((a) => !groupIds.includes(a.id));
      setSelectedAddons([...filtered, addon]);
    } else {
      const exists = selectedAddons.some((a) => a.id === addon.id);
      if (exists) {
        setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
      } else {
        setSelectedAddons([...selectedAddons, addon]);
      }
    }
  };

  const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = item.price + addonsPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(item, quantity, selectedAddons, specialNote);
    onClose();
    setQuantity(1);
    setSelectedAddons([]);
    setSpecialNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-soft-lg w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Item Image Header */}
        <div className="relative h-52 sm:h-60 w-full bg-slate-100">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 500px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-md"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-orange-500 text-white px-2.5 py-0.5 rounded-md">
                {item.category}
              </span>
              {item.isSpicy && (
                <span className="text-[11px] font-bold bg-red-600/90 text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-white" /> Spicy
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black mt-1 leading-tight">{item.name}</h3>
            <p className="text-orange-300 font-bold text-lg">Rs. {item.price}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {item.description}
          </p>

          {/* Option Groups if available */}
          {item.optionGroups && item.optionGroups.length > 0 ? (
            item.optionGroups.map((group) => (
              <div key={group.id} className="space-y-2.5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {group.name}
                  </h4>
                  {group.required ? (
                    <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Optional</span>
                  )}
                </div>

                <div className="space-y-2">
                  {group.options.map((option) => {
                    const isSelected = selectedAddons.some((a) => a.id === option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleToggleAddon(option, group.required, group.options)}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/50 text-orange-950 shadow-soft-sm font-semibold'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              isSelected
                                ? 'bg-orange-500 border-orange-500 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs sm:text-sm">{option.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          {option.price > 0 ? `+Rs. ${option.price}` : 'Free'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Special Preparation Note (Optional)
              </label>
              <textarea
                rows={2}
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                placeholder="e.g. Extra spicy, less oil, or sauce on the side..."
                className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>
          )}
        </div>

        {/* Footer with Quantity & Add Button */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center bg-white rounded-2xl p-1 border border-slate-200 shadow-sm">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-9 text-center font-bold text-sm text-slate-900">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm shadow-soft flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Order</span>
            </span>
            <span className="bg-orange-600/60 px-2.5 py-1 rounded-xl text-xs font-black">
              Rs. {totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
