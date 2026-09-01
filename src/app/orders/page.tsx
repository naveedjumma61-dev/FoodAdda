'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useOrder } from '../../context/OrderContext';
import { Clock, MapPin, ChevronRight, ArrowRight, ShoppingBag, CheckCircle2, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrdersListPage() {
  const { orders } = useOrder();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Campus Orders
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track live food deliveries or reorder your favorite hostel meals
            </p>
          </div>

          <Link
            href="/track"
            className="text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-2xl border border-orange-200/80 transition-colors"
          >
            Track by Order #
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft-sm space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">No Orders Yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                You haven't placed any food orders on HostelAdda yet.
              </p>
            </div>
            <Link
              href="/restaurants"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-soft"
            >
              <span>Explore Restaurants</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isLive = order.status !== 'delivered' && order.status !== 'cancelled';
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft-sm hover:shadow-soft transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                      <Image
                        src={order.restaurantLogo}
                        alt={order.restaurantName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-xs text-slate-900">
                          #{order.id}
                        </span>
                        {isLive ? (
                          <span className="text-[10px] font-extrabold uppercase bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                            Delivered
                          </span>
                        )}
                        <span className="text-xs text-slate-400">• {order.createdAt}</span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base truncate">
                        {order.restaurantName}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {order.items.length > 0
                          ? order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')
                          : 'Student Special Combo'}
                      </p>

                      <p className="text-xs font-bold text-orange-600">
                        Total: Rs. {order.total} (COD)
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-soft transition-all"
                    >
                      <span>{isLive ? 'Track Live' : 'View Receipt'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
