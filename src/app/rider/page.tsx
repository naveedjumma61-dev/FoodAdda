'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mapDbOrderToFrontend, toDatabaseStatus } from '../../lib/orderMapper';
import { Order, OrderStatus } from '../../types';
import {
  Bike,
  MapPin,
  Phone,
  CheckCircle2,
  Package,
  Clock,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function RiderDashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Sync rider availability with profile state
  useEffect(() => {
    if (user?.riderProfile) {
      setIsOnline(user.riderProfile.available !== false && user.riderProfile.active !== false);
    }
  }, [user]);

  // Fetch rider's assigned and active orders from the API
  const fetchRiderOrders = useCallback(async () => {
    try {
      setIsLoadingOrders(true);
      const res = await fetch('/api/orders?role=rider', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const mapped = data.orders.map((o: any) => mapDbOrderToFrontend(o));
          setOrders(mapped);
        }
      }
    } catch (e) {
      console.warn('Failed to load rider orders:', e);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    if (user && (user.role === 'RIDER' || user.role === 'ADMIN')) {
      fetchRiderOrders();
    }
  }, [user, fetchRiderOrders]);

  // Toggle rider availability in PostgreSQL
  const handleToggleOnline = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);

    if (user?.riderProfile?.id) {
      try {
        await fetch(`/api/riders/${user.riderProfile.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            available: nextState,
          }),
        });
      } catch (err) {
        console.warn('Failed to persist rider availability:', err);
      }
    }

    showToast(
      nextState ? 'Rider Online 🟢' : 'Rider Offline 🔴',
      nextState ? 'Ready to accept campus orders.' : 'You will not receive new deliveries.',
      'info'
    );
  };

  // Status progression action for rider
  const handleAction = async (orderId: string, nextStatus: OrderStatus, actionName: string) => {
    setIsUpdatingStatus(true);

    // Optimistically update order status locally
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: nextStatus };
        }
        return order;
      })
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          status: toDatabaseStatus(nextStatus),
        }),
      });

      if (res.ok) {
        showToast('Delivery Updated!', `Marked as: ${actionName}`, 'success');
        // Refresh to sync latest server state
        fetchRiderOrders();
      } else {
        showToast('Update Notice', 'Status updated locally.', 'info');
      }
    } catch (e) {
      console.warn('Network error updating status:', e);
      showToast('Offline Mode', 'Status updated in session.', 'info');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Auth Guard Screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || (user.role !== 'RIDER' && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-100">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-soft text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Rider Access Required</h2>
          <p className="text-xs text-slate-500">
            Please log in with a registered Rider partner account to access the delivery dispatch portal.
          </p>
          <Link
            href="/login?role=rider&redirect=/rider"
            className="block w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft transition-all"
          >
            Rider Login
          </Link>
        </div>
      </div>
    );
  }

  // Active deliveries and completed stats
  const assignedOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const completedOrders = orders.filter((o) => o.status === 'delivered');
  const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.deliveryFee || 70), 0);

  const riderVehicle = user.riderProfile?.vehicleType
    ? `${user.riderProfile.vehicleType} • ${user.riderProfile.plateNumber || 'ICT-R'}`
    : 'Honda CD 70 • Campus Fleet';

  return (
    <div className="min-h-screen bg-slate-100 py-6">
      <div className="max-w-md mx-auto px-4 space-y-5">
        
        {/* Rider Profile Card & Online Toggle */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-soft">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-black text-base">{user.name}</h1>
                <p className="text-xs text-emerald-400 font-semibold">{riderVehicle}</p>
              </div>
            </div>

            {/* Online / Offline switch */}
            <button
              onClick={handleToggleOnline}
              className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 ${
                isOnline ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
              <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>
          </div>

          {/* Real Metrics from PostgreSQL */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
            <div className="bg-slate-800/80 p-2.5 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Assigned</p>
              <p className="text-lg font-black text-orange-400">{assignedOrders.length}</p>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Delivered</p>
              <p className="text-lg font-black text-emerald-400">{completedOrders.length}</p>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Earnings (Fees)</p>
              <p className="text-lg font-black text-white">Rs. {totalEarnings}</p>
            </div>
          </div>
        </div>

        {/* Assigned Orders List Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900">
              Active Deliveries ({assignedOrders.length})
            </h2>
          </div>
          <button
            onClick={fetchRiderOrders}
            className="text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin text-orange-500' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Orders Cards */}
        {assignedOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-soft-sm space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-900">No Pending Deliveries</h3>
            <p className="text-xs text-slate-500">
              {isOnline
                ? 'You are online. New orders will appear here automatically.'
                : 'Turn your status ONLINE to receive incoming campus deliveries.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedOrders.map((order) => {
              const currentStatus = order.status;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 border-2 border-orange-500/80 shadow-soft space-y-4"
                >
                  {/* Order Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[11px] font-mono font-black text-orange-600">
                        Order #{order.id}
                      </span>
                      <h3 className="font-black text-slate-900 text-sm mt-0.5">
                        {order.restaurantName}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-slate-900 bg-orange-50 px-2.5 py-1 rounded-xl">
                        Collect: Rs. {order.total}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Order Items</p>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between font-medium">
                          <span>{item.quantity}x {item.menuItem?.name || 'Food item'}</span>
                          <span className="font-bold text-slate-900">Rs. {item.unitPrice * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pickup & Drop Points */}
                  <div className="space-y-3 text-xs">
                    {/* Pickup Point */}
                    <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Pick Up Restaurant</p>
                        <p className="font-bold text-slate-900">{order.restaurantName}</p>
                        <p className="text-slate-500 text-[11px]">{order.restaurantPhone || 'Hostel City Commercial Area'}</p>
                      </div>
                    </div>

                    {/* Drop-off Point */}
                    <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Customer Drop-off</p>
                        <p className="font-bold text-slate-900">
                          {order.deliveryDetails.customerName} ({order.deliveryDetails.customerPhone})
                        </p>
                        <p className="text-orange-600 font-semibold text-[11px]">
                          {order.deliveryDetails.hostelName} • {order.deliveryDetails.roomNumber}
                        </p>
                        {order.deliveryDetails.instructions && (
                          <p className="text-slate-500 text-[11px] italic mt-0.5">
                            Note: "{order.deliveryDetails.instructions}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Call Button */}
                  {order.deliveryDetails.customerPhone && (
                    <a
                      href={`tel:${order.deliveryDetails.customerPhone}`}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-orange-600" />
                      <span>Call Student ({order.deliveryDetails.customerPhone})</span>
                    </a>
                  )}

                  {/* Action Buttons based on status */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    {currentStatus === 'confirmed' || currentStatus === 'pending' || currentStatus === 'preparing' || currentStatus === 'ready' ? (
                      <button
                        onClick={() => handleAction(order.id, 'rider_assigned', 'Accepted by Rider')}
                        disabled={isUpdatingStatus}
                        className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-soft transition-all"
                      >
                        Accept Delivery Assignment
                      </button>
                    ) : currentStatus === 'rider_assigned' ? (
                      <button
                        onClick={() => handleAction(order.id, 'out_for_delivery', 'Picked Up (Heading to Hostel)')}
                        disabled={isUpdatingStatus}
                        className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 text-white font-extrabold text-xs shadow-soft transition-all flex items-center justify-center gap-1.5"
                      >
                        <Package className="w-4 h-4" />
                        <span>Picked Up from Kitchen (Heading to Hostel)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(order.id, 'delivered', 'Order Delivered & Cash Collected')}
                        disabled={isUpdatingStatus}
                        className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-sm shadow-soft transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Delivered & Cash Collected (Rs. {order.total})</span>
                      </button>
                    )}
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
