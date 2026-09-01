'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ArrowRight, Clock, ShieldCheck, Flame } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';

export default function TrackSearchPage() {
  const router = useRouter();
  const { orders } = useOrder();
  const { showToast } = useToast();
  const [orderInput, setOrderInput] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderInput.trim().toUpperCase().replace('#', '');
    if (!cleanId) return;

    const exists = orders.find((o) => o.id.toUpperCase() === cleanId || o.id.toUpperCase() === `STU-${cleanId}` || o.id.toUpperCase() === `HA-${cleanId}`);
    
    if (exists) {
      router.push(`/orders/${exists.id}`);
    } else {
      // Default to demo tracking ID
      router.push(`/orders/${cleanId}`);
    }
  };

  return (
    <div className="min-h-[75vh] bg-slate-50 py-12 sm:py-16 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft-lg space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
            <MapPin className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Track Your Campus Order
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Enter your order reference code to watch your rider in real time.
          </p>
        </div>

        {/* Tracker Form */}
        <form onSubmit={handleTrackSubmit} className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              required
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              placeholder="e.g. STU-10482 or HA-10482"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 uppercase font-mono font-bold text-sm sm:text-base focus:border-orange-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-sm sm:text-base shadow-soft hover-glow flex items-center justify-center gap-2 transition-all"
          >
            <span>Track Delivery</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Quick Demo Shortcuts */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Active Demo Orders
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                onClick={() => router.push(`/orders/${o.id}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-xs font-mono font-bold text-slate-700 border border-slate-200 transition-colors"
              >
                #{o.id}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
