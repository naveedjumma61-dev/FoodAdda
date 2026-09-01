'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  Home,
  Utensils,
  HelpCircle,
  Clock,
  User,
  Bike,
  ShieldCheck,
  MapPin,
  Flame,
  Heart,
  ChevronRight,
  LogOut,
  LogIn,
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { selectedCampus, selectedHostel, openLocationModal } = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  if (!isOpen) return null;

  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Food Categories', href: '/#categories', icon: Flame },
    { name: 'Restaurants & Cafes', href: '/restaurants', icon: Utensils },
    { name: 'My Orders & History', href: '/orders', icon: Clock },
    { name: 'Track Order by ID', href: '/track', icon: MapPin },
    { name: 'Favorite Restaurants', href: '/dashboard?tab=favorites', icon: Heart },
    { name: 'How It Works', href: '/how-it-works', icon: HelpCircle },
    { name: 'Student Profile', href: '/dashboard', icon: User },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs bg-white shadow-soft-lg flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Flame className="w-5 h-5 fill-white" />
                </div>
                <span className="text-lg font-bold">HostelAdda</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Campus location preview */}
            <div
              onClick={() => {
                onClose();
                openLocationModal();
              }}
              className="mt-4 p-2.5 rounded-xl bg-black/15 flex items-center justify-between cursor-pointer hover:bg-black/25 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-amber-200 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-orange-100 uppercase tracking-wider">Campus Area</p>
                  <p className="text-xs font-bold text-white truncate">
                    {selectedCampus.name.split(' ')[0]} ({selectedHostel.split(' ')[0]})
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-orange-200 flex-shrink-0" />
            </div>
          </div>

          {/* Links list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Role-specific portal links for authenticated Admin/Rider only */}
            {isAuthenticated && user && (
              <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-orange-400" />
                      <span>Admin Dashboard</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                )}
                {user.role === 'RIDER' && (
                  <Link
                    href="/rider"
                    onClick={onClose}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Bike className="w-4 h-4 text-emerald-200" />
                      <span>Rider Dashboard</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-200" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Account section inside drawer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 uppercase">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-soft-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Login / Sign Up</span>
              </Link>
            )}

            <div className="text-center text-[11px] text-slate-400 pt-1">
              <span>WhatsApp: +92 301 555-ADDA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
