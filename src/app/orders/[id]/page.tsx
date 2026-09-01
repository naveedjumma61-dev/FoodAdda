'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useOrder } from '../../../context/OrderContext';
import { useToast } from '../../../context/ToastContext';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  Home,
  Phone,
  MessageSquare,
  MapPin,
  ChevronLeft,
  Share2,
  Sparkles,
  ShieldCheck,
  Building2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderStatus } from '../../../types';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { getOrderById, fetchOrderById, updateOrderStatus } = useOrder();
  const { showToast } = useToast();
  const [loadedOrder, setLoadedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const memoryOrder = getOrderById(orderId);
    if (memoryOrder) {
      setLoadedOrder(memoryOrder);
    } else {
      fetchOrderById(orderId).then((o) => {
        if (o) setLoadedOrder(o);
      });
    }
  }, [orderId, getOrderById, fetchOrderById]);

  const order = loadedOrder || getOrderById(orderId);

  // If order not found, fallback to first mock order
  const activeOrder = order || {
    id: orderId || 'STU-10482',
    createdAt: 'Just now',
    status: 'out_for_delivery' as OrderStatus,
    restaurantId: 'hostel-city-biryani',
    restaurantName: 'Hostel City Biryani & Pulao',
    restaurantLogo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80',
    restaurantPhone: '+92 301 5551201',
    deliveryDetails: {
      customerName: 'Muhammad Hamza',
      customerPhone: '0304-9871234',
      campus: 'COMSATS University Islamabad (Chak Shehzad)',
      hostelName: 'Iqbal Hall (Boys Hostel 3)',
      roomNumber: 'Room 214',
      instructions: 'Please call when reaching turnstile gate.',
      paymentMethod: 'cod' as const,
    },
    items: [],
    subtotal: 750,
    deliveryFee: 40,
    discount: 50,
    total: 740,
    estimatedDeliveryTime: '15-20 mins',
    rider: {
      name: 'Ali Raza',
      phone: '0315-7744332',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      bikeModel: 'Honda CD 70 (Red)',
      plateNumber: 'ICT-RI-8841',
      rating: 4.9,
    },
  };

  const steps = [
    {
      key: 'confirmed',
      title: 'Order Confirmed',
      description: 'Your order was sent to the kitchen',
      icon: CheckCircle2,
    },
    {
      key: 'preparing',
      title: 'Preparing Food',
      description: 'Chefs are cooking your meal fresh',
      icon: ChefHat,
    },
    {
      key: 'rider_assigned',
      title: 'Rider Assigned',
      description: 'Campus rider is at the restaurant',
      icon: Bike,
    },
    {
      key: 'out_for_delivery',
      title: 'Out for Delivery',
      description: 'Rider is on the way to your hostel gate',
      icon: MapPin,
    },
    {
      key: 'delivered',
      title: 'Delivered',
      description: 'Collected at hostel gate & paid',
      icon: Home,
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return 0;
      case 'preparing':
        return 1;
      case 'rider_assigned':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex(activeOrder.status);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    const updated = await fetchOrderById(orderId);
    setIsRefreshing(false);
    if (updated) {
      setLoadedOrder(updated);
      showToast('Status Refreshed', `Latest order status: ${updated.status.replace(/_/g, ' ')}`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>My Orders</span>
          </Link>

          <button
            onClick={handleRefreshStatus}
            className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 px-3.5 py-1.5 rounded-2xl border border-slate-200/80 shadow-soft-sm transition-colors flex items-center gap-1.5"
          >
            <span className={`w-2 h-2 rounded-full ${activeOrder.status === 'delivered' ? 'bg-emerald-500' : 'bg-orange-500 animate-pulse'}`} />
            <span>{isRefreshing ? 'Checking...' : 'Refresh Status'}</span>
          </button>
        </div>

        {/* Order Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase">
                  Live Tracking
                </span>
                <span className="text-xs text-slate-400 font-mono">Order #{activeOrder.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                {activeOrder.restaurantName}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Delivering to: <strong className="text-slate-700">{activeOrder.deliveryDetails.hostelName} ({activeOrder.deliveryDetails.roomNumber})</strong>
              </p>
            </div>

            <div className="bg-orange-500 text-white p-4 rounded-2xl sm:text-right shadow-soft min-w-[160px]">
              <p className="text-[11px] text-orange-100 font-medium">Estimated Arrival</p>
              <p className="text-xl sm:text-2xl font-black">{activeOrder.estimatedDeliveryTime}</p>
            </div>
          </div>

          {/* 5-Step Animated Timeline */}
          <div className="pt-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Delivery Progress
            </h3>

            {/* Desktop Horizontal Stepper */}
            <div className="hidden sm:grid grid-cols-5 gap-2 relative">
              {/* Connecting line */}
              <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 -z-0">
                <div
                  className="h-full bg-orange-500 transition-all duration-700"
                  style={{ width: `${(currentStepIndex / 4) * 100}%` }}
                />
              </div>

              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-orange-500 text-white shadow-soft ring-4 ring-orange-100'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      } ${isCurrent ? 'scale-110 animate-pulseSubtle' : ''}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <p
                      className={`text-xs font-bold mt-2.5 leading-snug ${
                        isCompleted ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 px-1">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Stepper */}
            <div className="sm:hidden space-y-6 relative pl-6 border-l-2 border-slate-200 ml-3">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="relative">
                    <div
                      className={`absolute -left-[35px] top-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                        isCompleted
                          ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isCompleted ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Map Simulation & Rider Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Simulated Live Route Map */}
          <div className="md:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Live Campus Route</span>
              </h3>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live GPS Active
              </span>
            </div>

            {/* Interactive Graphic Map Container */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col justify-between p-4 text-white">
              {/* Abstract Map Background with road lines */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Waypoint 1: Restaurant */}
              <div className="relative z-10 flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl max-w-xs border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                  🍴
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400">Pickup</p>
                  <p className="text-xs font-bold truncate">{activeOrder.restaurantName}</p>
                </div>
              </div>

              {/* Moving Rider Pin */}
              <div className="self-center flex flex-col items-center gap-1 animate-bounce">
                <div className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-soft flex items-center gap-1">
                  <Bike className="w-3 h-3" />
                  <span>Rider on Park Road</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-orange-400 ring-4 ring-orange-500/40" />
              </div>

              {/* Waypoint 2: Destination */}
              <div className="relative z-10 self-end flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl max-w-xs border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                  📍
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400">Hostel Destination</p>
                  <p className="text-xs font-bold truncate">
                    {activeOrder.deliveryDetails.hostelName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rider Contact Card */}
          <div className="md:col-span-5 space-y-4">
            {activeOrder.rider ? (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft-sm space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Assigned Rider
                </h3>

                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <Image
                      src={activeOrder.rider.avatar}
                      alt={activeOrder.rider.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {activeOrder.rider.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {activeOrder.rider.bikeModel} • <span className="font-mono font-bold text-slate-700">{activeOrder.rider.plateNumber}</span>
                    </p>
                    <p className="text-[11px] text-amber-600 font-bold mt-0.5">
                      ★ {activeOrder.rider.rating} Campus Rating
                    </p>
                  </div>
                </div>

                {/* Call & WhatsApp CTAs */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a
                    href={`tel:${activeOrder.rider.phone}`}
                    className="py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-soft transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Rider</span>
                  </a>

                  <button
                    onClick={() => showToast('Connecting Rider', `Opening WhatsApp for ${activeOrder.rider?.name}...`, 'info')}
                    className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ) : null}

            {/* Payment Summary Box */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft-sm space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Payment Method</span>
                <span className="font-bold text-slate-800">Cash on Delivery (COD)</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-800">Rs. {activeOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Charge</span>
                <span className="font-bold text-slate-800">
                  {activeOrder.deliveryFee === 0 ? 'FREE' : `Rs. ${activeOrder.deliveryFee}`}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Total Amount to Pay</span>
                <span className="text-orange-600 font-black">Rs. {activeOrder.total}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
