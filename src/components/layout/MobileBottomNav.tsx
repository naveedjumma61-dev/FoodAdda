'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, User, Compass, Clock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { orders } = useOrder();

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Search',
      href: '/restaurants',
      icon: Search,
      isActive: pathname === '/restaurants',
    },
    {
      label: 'Orders',
      href: '/orders',
      icon: Clock,
      isActive: pathname.startsWith('/orders') || pathname === '/track',
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    {
      label: 'Profile',
      href: '/dashboard',
      icon: User,
      isActive: pathname === '/dashboard',
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-soft-lg pb-safe">
      <div className="grid grid-cols-4 h-16 items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-all relative ${
                item.isActive
                  ? 'text-orange-500 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${item.isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
