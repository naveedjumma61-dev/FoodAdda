import type { Metadata } from 'next';
import '../styles/globals.css';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { LocationProvider } from '../context/LocationContext';
import { CartProvider } from '../context/CartContext';
import { OrderProvider } from '../context/OrderContext';
import { Header } from '../components/layout/Header';
import { MobileHeader } from '../components/layout/MobileHeader';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { CartDrawer } from '../components/layout/CartDrawer';
import { LocationModal } from '../components/common/LocationModal';
import { Footer } from '../components/layout/Footer';
import LayoutClientWrapper from './LayoutClientWrapper';

export const metadata: Metadata = {
  title: 'HostelAdda | Your Campus Food, Delivered Fast',
  description:
    'The premier mobile-first food delivery startup connecting university students, hostel residents, and campus faculties in Islamabad (COMSATS, Abasyn, Hostel City).',
  keywords: 'HostelAdda, food delivery, COMSATS, Abasyn, Hostel City Islamabad, student biryani, midnight delivery',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
        <ToastProvider>
          <AuthProvider>
            <LocationProvider>
              <CartProvider>
                <OrderProvider>
                  <LayoutClientWrapper>
                    {children}
                  </LayoutClientWrapper>
                </OrderProvider>
              </CartProvider>
            </LocationProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
