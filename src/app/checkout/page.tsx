'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  MapPin,
  Building2,
  Phone,
  User,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Banknote,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Order } from '../../types';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    restaurantId,
    restaurantName,
    restaurantLogo,
    subtotal,
    deliveryFee,
    discountAmount,
    appliedCoupon,
    total,
    clearCart,
    specialInstructions,
  } = useCart();

  const { selectedCampus, selectedHostel, roomNumber } = useLocation();
  const { user } = useAuth();
  const { createOrder } = useOrder();
  const { showToast } = useToast();

  // Form states populated from authenticated user or location context
  const [customerName, setCustomerName] = useState(user?.name || 'Student');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '0300-1234567');
  const [campus, setCampus] = useState(user?.campus || selectedCampus.name);
  const [hostel, setHostel] = useState(user?.hostel || selectedHostel);
  const [room, setRoom] = useState(roomNumber || 'Room 214, 2nd Floor');
  const [instructions, setInstructions] = useState(
    specialInstructions || 'Please call once outside hostel turnstile.'
  );
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'easypaisa' | 'jazzcash'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync user details if session loads after mount
  useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.campus) setCampus(user.campus);
      if (user.hostel) setHostel(user.hostel);
    }
  }, [user]);

  // Confirmed Order State for Modal/Screen
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Empty Cart', 'Please add items before placing order.', 'error');
      router.push('/restaurants');
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrder = await createOrder(
        items,
        restaurantId || 'hostel-city-biryani',
        restaurantName || 'Hostel City Biryani',
        restaurantLogo || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80',
        '+92 301 5551201',
        {
          customerName,
          customerPhone,
          campus,
          hostelName: hostel,
          roomNumber: room,
          instructions,
          paymentMethod,
        },
        subtotal,
        deliveryFee,
        discountAmount,
        appliedCoupon || undefined
      );

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.log('Confetti error', e);
      }

      setConfirmedOrder(newOrder);
      clearCart();
      showToast('Order Placed Successfully! 🎉', `Order #${newOrder.id} is confirmed.`, 'success');
    } catch (err) {
      showToast('Order Failed', 'Could not process order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is placed, show confirmation screen
  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 sm:py-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-lg w-full border border-slate-200/80 shadow-soft-lg text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Thank You, {confirmedOrder.deliveryDetails.customerName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Your meal from <strong className="text-slate-800">{confirmedOrder.restaurantName}</strong> is being prepared in the kitchen.
            </p>
          </div>

          {/* Order ID Badge */}
          <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/80 flex items-center justify-between">
            <div className="text-left">
              <p className="text-[11px] text-orange-600 font-bold uppercase">Order Reference</p>
              <p className="text-xl font-mono font-black text-slate-900">{confirmedOrder.id}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500 font-medium">Estimated Time</p>
              <p className="text-sm font-bold text-orange-600">15-25 mins</p>
            </div>
          </div>

          {/* Delivery Summary Details */}
          <div className="text-left text-xs space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Point:</span>
              <span className="font-bold text-slate-800 text-right">
                {confirmedOrder.deliveryDetails.hostelName}, {confirmedOrder.deliveryDetails.roomNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Due:</span>
              <span className="font-black text-orange-600">
                Rs. {confirmedOrder.total} (Cash on Delivery)
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => router.push(`/orders/${confirmedOrder.id}`)}
              className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-sm sm:text-base shadow-soft hover-glow flex items-center justify-center gap-2 transition-all"
            >
              <span>Track Live Delivery</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link
              href="/"
              className="block w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
            >
              Back to Campus Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top bar */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Hostel Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Student & Delivery Information */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft-sm space-y-4">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
                <User className="w-5 h-5 text-orange-500" />
                <span>1. Student Contact Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Muhammad Hamza"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone (for Rider Calls)
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0304-9871234"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Campus & Hostel Location */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft-sm space-y-4">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span>2. Campus Delivery Location</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Campus / University
                  </label>
                  <input
                    type="text"
                    required
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hostel Building / Gate
                    </label>
                    <input
                      type="text"
                      required
                      value={hostel}
                      onChange={(e) => setHostel(e.target.value)}
                      placeholder="e.g. Iqbal Hall (Boys Hostel 3)"
                      className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Room / Floor Number
                    </label>
                    <input
                      type="text"
                      required
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      placeholder="e.g. Room 214, 2nd Floor"
                      className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Call when outside Gate 1, or drop at hostel guard desk"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft-sm space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
                <Banknote className="w-5 h-5 text-emerald-600" />
                <span>3. Payment Method</span>
              </div>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-4 rounded-2xl border-2 border-orange-500 bg-orange-50/40 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                    />
                    <div>
                      <span className="font-bold text-sm text-slate-900">Cash on Delivery (COD)</span>
                      <p className="text-xs text-slate-500">Pay cash or EasyPaisa/JazzCash directly to the rider at hostel gate</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Zero Risk
                  </span>
                </label>
              </div>
            </div>

          </div>

          {/* Order Preview & Action Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft-sm space-y-4">
              <h2 className="text-base font-black text-slate-900">Order Summary</h2>

              {/* Items preview */}
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1 divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="font-bold text-slate-900">
                      Rs. {item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price calculations */}
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hostel Delivery</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    <span className="font-bold text-slate-800">Rs. {deliveryFee}</span>
                  )}
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Voucher ({appliedCoupon})</span>
                    <span>- Rs. {discountAmount}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-black text-slate-900">
                  <span>Total Due</span>
                  <span className="text-orange-600">Rs. {total}</span>
                </div>
              </div>

              {/* Confirm Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-soft hover-glow flex items-center justify-center gap-2 transition-all mt-4"
              >
                {isSubmitting ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <span>Confirm Order (Rs. {total})</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                By confirming, your order will be sent to the kitchen instantly.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
