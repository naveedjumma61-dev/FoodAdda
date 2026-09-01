'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, MapPin, Phone, Mail, Clock, ShieldCheck, Bike, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-soft">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white">
                  Hostel<span className="text-orange-500">Adda</span>
                </span>
                <span className="text-xs text-slate-400">Your Campus Food, Delivered Fast</span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier hyper-local food delivery startup built exclusively for university students, hostel residents, and campus faculties in Islamabad. Fast hot deliveries right to your hostel turnstile or campus gate.
            </p>

            {/* Quick Badge */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-amber-400 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Open till 4:00 AM</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Campus Verified</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Popular Bites</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/restaurants?category=Biryani" className="hover:text-orange-400 transition-colors">
                  Student Dum Biryani
                </Link>
              </li>
              <li>
                <Link href="/restaurants?category=Burger" className="hover:text-orange-400 transition-colors">
                  Crispy Zinger Burgers
                </Link>
              </li>
              <li>
                <Link href="/restaurants?category=Fast%20Food" className="hover:text-orange-400 transition-colors">
                  Loaded Arabic Shawarma
                </Link>
              </li>
              <li>
                <Link href="/restaurants?category=Pizza" className="hover:text-orange-400 transition-colors">
                  Cheesy Pan Pizza
                </Link>
              </li>
              <li>
                <Link href="/restaurants?category=Tea%20%26%20Cafe" className="hover:text-orange-400 transition-colors">
                  Midnight Karak Chai & Paratha
                </Link>
              </li>
              <li>
                <Link href="/restaurants?category=Juice" className="hover:text-orange-400 transition-colors">
                  Fresh Juices & Milkshakes
                </Link>
              </li>
            </ul>
          </div>

          {/* Delivery Hubs */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Active Hubs</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>COMSATS Islamabad (Chak Shehzad)</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>Abasyn University Campus</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>Hostel City Streets 1-12</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>NARC & Park Road Enclave</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>Tarlai Student Quarters</span>
              </li>
            </ul>
          </div>

          {/* Student Perks & Portals */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/how-it-works" className="hover:text-orange-400 transition-colors">
                  How HostelAdda Works
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-orange-400 transition-colors">
                  Live Order Tracker
                </Link>
              </li>
              <li>
                <Link href="/rider" className="hover:text-orange-400 transition-colors flex items-center gap-1 text-amber-300">
                  <Bike className="w-3.5 h-3.5" />
                  <span>Student Rider App</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-orange-400 transition-colors text-slate-400">
                  Admin Dashboard Portal
                </Link>
              </li>
              <li className="pt-2 text-slate-400">
                <p className="text-[11px] font-semibold text-white">Student Helpline:</p>
                <p className="text-xs text-orange-400 font-bold mt-0.5">+92 301 555-ADDA (2332)</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} HostelAdda Technologies. Built for Pakistan's Student Community.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>EasyPaisa / JazzCash</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
