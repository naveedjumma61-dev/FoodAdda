'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingBag,
  MapPin,
  User,
  ChevronDown,
  Menu as MenuIcon,
  Flame,
  LogOut,
  ShieldCheck,
  Bike,
  ChevronRight,
} from 'lucide-react';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  onOpenMobileDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileDrawer }) => {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { selectedCampus, selectedHostel, openLocationModal } = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const customerNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Food Categories', href: '/#categories' },
    { name: 'Restaurants', href: '/restaurants' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Track Order', href: '/track' },
  ];

  const roleBadge = user?.role === 'ADMIN'
    ? { label: 'Admin', color: 'bg-slate-900 text-white', icon: ShieldCheck }
    : user?.role === 'RIDER'
    ? { label: 'Rider', color: 'bg-emerald-600 text-white', icon: Bike }
    : null;

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-200/80 shadow-soft-sm">
        {/* Top Mini Notification Bar */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white text-[11px] font-medium py-1.5 px-4 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                ⚡ Campus Express
              </span>
              <span>Delivering hot meals to COMSATS, Abasyn & Hostel City in 15-25 mins!</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Use code <span className="font-bold underline decoration-amber-300">HOSTEL50</span> for Rs. 50 OFF</span>
              <span className="text-orange-200">|</span>
              <span className="text-orange-100">🛵 Campus Food Platform</span>
            </div>
          </div>
        </div>

        {/* Main Desktop Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-200">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                    Hostel<span className="text-orange-500">Adda</span>
                  </span>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md hidden sm:inline-block">
                    CAMPUS
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
                  Your Campus Food, Delivered Fast
                </span>
              </div>
            </Link>

            {/* Campus & Hostel Selector Button */}
            <button
              onClick={openLocationModal}
              className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 transition-all text-left max-w-xs group"
              title="Change Delivery Location"
            >
              <div className="w-7 h-7 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 pr-1">
                <p className="text-[11px] text-slate-500 font-medium leading-none">Deliver to</p>
                <p className="text-xs font-bold text-slate-800 truncate mt-0.5">
                  {selectedCampus.name.split(' ')[0]} • {selectedHostel}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 flex-shrink-0" />
            </button>
          </div>

          {/* Desktop Nav Links — only for customer/public view */}
          {(!user || user.role === 'CUSTOMER') && (
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {customerNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-orange-600 bg-orange-50/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Role-specific nav links for Admin/Rider */}
          {user?.role === 'ADMIN' && (
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/admin" className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">
                Admin Dashboard
              </Link>
            </nav>
          )}
          {user?.role === 'RIDER' && (
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/rider" className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">
                Rider Dashboard
              </Link>
            </nav>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Authenticated User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-bold text-slate-900 leading-none">{user.name.split(' ')[0]}</span>
                    {roleBadge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${roleBadge.color}`}>
                        {roleBadge.label.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-soft border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    {user.role === 'CUSTOMER' && (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>My Orders</span>
                        </Link>
                      </>
                    )}
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    {user.role === 'RIDER' && (
                      <Link
                        href="/rider"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Rider Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in — show Login / Sign Up */
              <>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthOpen(true);
                  }}
                  className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Login</span>
                </button>

                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthOpen(true);
                  }}
                  className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-soft-sm transition-all"
                >
                  <span>Sign Up Free</span>
                </button>
              </>
            )}

            {/* Cart Button — only for customers */}
            {(!user || user.role === 'CUSTOMER') && (
              <button
                onClick={openCart}
                className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-soft hover-glow transition-all"
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-orange-600 text-xs font-black flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Drawer Trigger (Hamburger) */}
            <button
              onClick={onOpenMobileDrawer}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden transition-colors"
              aria-label="Open mobile menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};
