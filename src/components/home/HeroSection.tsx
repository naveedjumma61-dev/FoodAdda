'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Bike,
  Sparkles,
  Clock,
  ShieldCheck,
  Flame,
  Star,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const { selectedCampus, selectedHostel, openLocationModal } = useLocation();

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 bg-gradient-to-b from-orange-50/70 via-amber-50/30 to-slate-50">
      {/* Background ambient blurs - disabled for performance */}
      {/* <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-orange-300/20 via-amber-200/20 to-orange-400/20 blur-3xl rounded-full pointer-events-none -z-10" /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Campus hotspot pill */}
            <div className="inline-flex items-center gap-2 p-1.5 pr-4 rounded-full bg-white border border-orange-200/80 shadow-soft-sm text-xs font-semibold text-slate-800 animate-fadeIn">
              <span className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                <Flame className="w-3 h-3 fill-white" /> Live in Islamabad
              </span>
              <button
                onClick={openLocationModal}
                className="flex items-center gap-1 text-slate-700 hover:text-orange-600 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>{selectedCampus.name.split(' ')[0]} & Hostels</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Main Headings */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Your Campus Food.{' '}
                <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                  Delivered Fast.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Order pizza, burgers, biryani, juice and your favourite meals from nearby restaurants and hostels with fast delivery to your room or gate.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                href="/restaurants"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-base shadow-soft hover-glow flex items-center justify-center gap-2.5 transition-all"
              >
                <span>Order Food</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/rider"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200 shadow-soft-sm flex items-center justify-center gap-2 transition-all"
              >
                <Bike className="w-5 h-5 text-emerald-600" />
                <span>Become a Rider</span>
              </Link>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 sm:pt-6 border-t border-slate-200/80 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-black text-slate-900">15-25m</p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Avg. Hostel Delivery</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-black text-orange-600">Rs. 0</p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Free Delivery &gt; 999</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-black text-slate-900">35+</p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Campus Food Spots</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Food Showcase Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-soft-lg border-4 border-white bg-slate-900 aspect-[4/3] sm:aspect-[1/1] max-h-[460px]">
                <Image
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=70"
                  alt="Delicious Student Biryani"
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 500px"
                  quality={70}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      #1 Student Craving
                    </span>
                    <span className="text-amber-300 text-xs flex items-center gap-1 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-300" /> 4.9 (840+)
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mt-1">Hostel City Dum Biryani</h3>
                  <p className="text-xs text-slate-300">Double Boti + Zeera Raita • Rs. 300</p>
                </div>
              </div>

              {/* Floating Badge 1: Top Right */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-slate-100 shadow-soft-lg flex items-center gap-3 animate-fadeIn">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">Late Night Active</p>
                  <p className="text-[11px] text-slate-500 font-medium">Deliveries till 4:00 AM</p>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Left */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-slate-100 shadow-soft-lg flex items-center gap-3 animate-fadeIn">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">Cash on Delivery</p>
                  <p className="text-[11px] text-slate-500 font-medium">Pay rider at hostel gate</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
