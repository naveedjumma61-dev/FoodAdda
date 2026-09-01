'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, X, Plus, Minus, Trash2, Tag, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import Image from 'next/image';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    appliedCoupon,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    restaurantName,
    specialInstructions,
    setInstructions,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  // Free delivery progress calculation (Target: Rs. 999)
  const freeDeliveryThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-soft-lg flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-soft">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Your Food Cart</h3>
                {restaurantName ? (
                  <p className="text-xs text-orange-600 font-medium truncate max-w-[200px]">
                    from {restaurantName}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">Select items to order</p>
                )}
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {items.length > 0 && (
            <div className="bg-amber-50/80 border-b border-amber-100/80 px-5 py-2.5">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {amountNeededForFree === 0 ? (
                    <span className="text-emerald-700 font-bold">🎉 You unlocked FREE Delivery!</span>
                  ) : (
                    <span>Add Rs. {amountNeededForFree} for FREE delivery</span>
                  )}
                </span>
                <span className="text-slate-500 font-normal">{progressPercent}%</span>
              </div>
              <div className="w-full bg-amber-200/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Your Cart is Empty</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Explore delicious student meals from COMSATS & Hostel City spots!
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    router.push('/restaurants');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-soft transition-all"
                >
                  Explore Restaurants
                </button>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-start gap-3">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                      <Image
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                        {item.menuItem.name}
                      </h5>
                      <p className="text-orange-600 font-bold text-xs mt-0.5">
                        Rs. {item.unitPrice * item.quantity}
                        {item.quantity > 1 && (
                          <span className="text-slate-400 font-normal text-[11px] ml-1">
                            (Rs. {item.unitPrice} each)
                          </span>
                        )}
                      </p>

                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          + {item.selectedAddons.map((a) => a.name).join(', ')}
                        </div>
                      )}

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white rounded-md text-slate-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white rounded-md text-slate-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors ml-auto"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Special Instructions */}
                <div className="pt-3">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Special Hostel Delivery Note
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Leave at hostel reception or call when near gate"
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer & Order Summary */}
          {items.length > 0 && (
            <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-4">
              {/* Voucher Code Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code: {appliedCoupon} (-Rs. {discountAmount})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 hover:underline text-[11px] font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Voucher code (try HOSTEL50)"
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 uppercase focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  ) : (
                    <span className="font-semibold text-slate-800">Rs. {deliveryFee}</span>
                  )}
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>- Rs. {discountAmount}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total (Cash on Delivery)</span>
                  <span className="text-orange-600 text-base">Rs. {total}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm shadow-soft flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
