'use client';

import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { MobileHeader } from '../components/layout/MobileHeader';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { CartDrawer } from '../components/layout/CartDrawer';
import { LocationModal } from '../components/common/LocationModal';
import { Footer } from '../components/layout/Footer';
import { usePathname } from 'next/navigation';

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Certain views like admin or rider can have dedicated full-screen layout or top nav
  const isDashboardView = pathname === '/admin' || pathname === '/rider';

  return (
    <>
      <Header onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)} />
      <MobileHeader />

      <main className="flex-1 pb-mobile-nav">
        {children}
      </main>

      {!isDashboardView && <Footer />}

      {/* Global Modals & Drawers */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />
      <CartDrawer />
      <LocationModal />
      <MobileBottomNav />
    </>
  );
}
