'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Store,
  ShieldCheck,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    restaurantName,
    restaurantId,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    appliedCoupon,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    specialInstructions,
    setInstructions,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  const freeDeliveryThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-soft space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Looks like you haven't added any delicious campus food items yet.
            </p>
          </div>
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm shadow-soft transition-all"
          >
            <span>Explore Restaurants</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>

          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Items Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h1 className="text-xl font-black text-slate-900">Your Order Items</h1>
                  {restaurantName && (
                    <p className="text-xs text-orange-600 font-semibold mt-0.5 flex items-center gap-1">
                      <Store className="w-3.5 h-3.5" />
                      <span>Ordering from {restaurantName}</span>
                    </p>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {items.length} {items.length === 1 ? 'dish' : 'dishes'}
                </span>
              </div>

              {/* Free delivery progress meter */}
              <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3.5 mb-5">
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {amountNeededForFree === 0 ? (
                      <span className="text-emerald-700 font-bold">🎉 FREE Delivery Unlocked!</span>
                    ) : (
                      <span>Add Rs. {amountNeededForFree} more for FREE delivery</span>
                    )}
                  </span>
                  <span className="text-slate-500">{progressPercent}%</span>
                </div>
                <div className="w-full bg-amber-200/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                            {item.menuItem.name}
                          </h3>
                          {item.selectedAddons && item.selectedAddons.length > 0 && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              + {item.selectedAddons.map((a) => a.name).join(', ')}
                            </p>
                          )}
                        </div>
                        <p className="font-black text-slate-900 text-sm sm:text-base">
                          Rs. {item.unitPrice * item.quantity}
                        </p>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Note Box */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hostel Delivery Instructions
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Call when outside Gate 1, or drop at hostel guard desk"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Summary & Checkout Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft-sm space-y-5">
              <h2 className="text-lg font-black text-slate-900">Order Summary</h2>

              {/* Voucher Code Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span>Applied: {appliedCoupon} (-Rs. {discountAmount})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Voucher (try HOSTEL50)"
                        className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-2xl border border-slate-200 uppercase focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hostel Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    <span className="font-bold text-slate-900">Rs. {deliveryFee}</span>
                  )}
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Voucher Discount</span>
                    <span>- Rs. {discountAmount}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-3 flex justify-between text-base sm:text-lg font-black text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-orange-600">Rs. {total}</span>
                </div>
              </div>

              {/* Cash On Delivery Assurance */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Payment: <strong>Cash on Delivery</strong> or <strong>EasyPaisa</strong> upon rider arrival.</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-sm sm:text-base shadow-soft hover-glow flex items-center justify-center gap-2 transition-all"
              >
                <span>Place Order (Rs. {total})</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
