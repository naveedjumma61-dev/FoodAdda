'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Bike,
  ChartColumn,
  Settings as SettingsIcon,
  ShoppingBag,
  Store,
  Users,
  Utensils,
  ShieldCheck,
  ShieldAlert,
  Plus,
  RefreshCw,
  X,
  CheckCircle2,
  Save,
} from 'lucide-react';

import { AdminSidebar, type AdminSection } from '@/components/admin/AdminSidebar';
import { DashboardSection } from '@/components/admin/sections/DashboardSection';
import { MenuSection, type MenuItemRecord } from '@/components/admin/sections/MenuSection';
import { OrdersSection } from '@/components/admin/sections/OrdersSection';
import { RestaurantsSection, type RestaurantRecord } from '@/components/admin/sections/RestaurantsSection';
import { RidersSection, type RiderRecord } from '@/components/admin/sections/RidersSection';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { mapDbOrderToFrontend } from '@/lib/orderMapper';
import type { Order, OrderStatus } from '@/types';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'restaurants', label: 'Restaurants', icon: Store },
  { id: 'menu', label: 'Menu', icon: Utensils },
  { id: 'riders', label: 'Riders', icon: Bike },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'reports', label: 'Reports', icon: ChartColumn },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
] as const;

export default function AdminDashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { orders, updateOrderStatus, refreshOrders } = useOrder();
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  // Database-backed states
  const [restaurants, setRestaurants] = useState<RestaurantRecord[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemRecord[]>([]);
  const [riders, setRiders] = useState<RiderRecord[]>([]);
  const [platformSettings, setPlatformSettings] = useState<any>({
    campusDeliveryFee: 89,
    hostelDeliveryFee: 70,
    campusMinimumOrder: 500,
    hostelMinimumOrder: 300,
    contactPhone: '+92 301 555-ADDA',
    contactEmail: 'support@hosteladda.com',
  });

  const [isLoadingData, setIsLoadingData] = useState(false);

  // Modal States
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isAddRiderOpen, setIsAddRiderOpen] = useState(false);

  // New Restaurant Form State
  const [newRestName, setNewRestName] = useState('');
  const [newRestCategory, setNewRestCategory] = useState('Desi Food');
  const [newRestPhone, setNewRestPhone] = useState('+92 300 1234567');
  const [newRestAddress, setNewRestAddress] = useState('Hostel City, Commercial Area');
  const [newRestZone, setNewRestZone] = useState('COMSATS Gate 1 / Hostel City');
  const [newRestHours, setNewRestHours] = useState('11:00 AM - 03:00 AM');

  // New Menu Item Form State
  const [newMenuRestId, setNewMenuRestId] = useState('');
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuPrice, setNewMenuPrice] = useState('');
  const [newMenuCategory, setNewMenuCategory] = useState('Fast Food');
  const [newMenuDesc, setNewMenuDesc] = useState('');

  // New Rider Form State
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderPhone, setNewRiderPhone] = useState('');
  const [newRiderVehicle, setNewRiderVehicle] = useState('Honda CD 70');
  const [newRiderPlate, setNewRiderPlate] = useState('ICT-RI-0000');

  // Load all live data from APIs
  const fetchAdminData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      // 1. Fetch Restaurants
      const restRes = await fetch('/api/restaurants', { credentials: 'include' });
      if (restRes.ok) {
        const restData = await restRes.json();
        if (restData.success && Array.isArray(restData.restaurants)) {
          setRestaurants(
            restData.restaurants.map((r: any) => ({
              id: r.id,
              name: r.name,
              campusZone: r.location || r.campusZone || 'Campus Delivery Area',
              rating: r.rating || 4.8,
              openingHours: r.openingHours || '10:00 AM - 03:00 AM',
              logo: r.logoImage || r.logo || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80',
              isOpen: r.active !== undefined ? r.active : r.isOpen ?? true,
              phone: r.phone,
              category: r.category,
            }))
          );
        }
      }

      // 2. Fetch Menu Items
      const menuRes = await fetch('/api/menu-items', { credentials: 'include' });
      if (menuRes.ok) {
        const menuData = await menuRes.json();
        if (menuData.success && Array.isArray(menuData.items)) {
          setMenuItems(
            menuData.items.map((i: any) => ({
              id: i.id,
              name: i.name,
              category: i.category,
              price: i.price,
              image: i.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80',
              available: i.available ?? true,
              restaurantName: i.restaurant?.name || 'Partner Restaurant',
              restaurantId: i.restaurantId,
            }))
          );
        }
      }

      // 3. Fetch Riders
      const ridersRes = await fetch('/api/riders', { credentials: 'include' });
      if (ridersRes.ok) {
        const ridersData = await ridersRes.json();
        if (ridersData.success && Array.isArray(ridersData.riders)) {
          setRiders(
            ridersData.riders.map((r: any) => ({
              id: r.id,
              name: r.user?.name || r.name || 'Campus Rider',
              phone: r.phone || r.user?.phone || '0315-7744332',
              zone: r.user?.campus || 'Hostel City & COMSATS Zone',
              bike: `${r.vehicleType || 'Honda CD 70'} (${r.plateNumber || 'Fleet'})`,
              status: r.available === false ? 'Offline' : 'Active (Available)',
              ordersCompleted: r.assignedOrders?.length || 12,
              available: r.available !== false,
            }))
          );
        }
      }

      // 4. Fetch Platform Settings
      const settingsRes = await fetch('/api/settings', { credentials: 'include' });
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData.success && settingsData.settings) {
          setPlatformSettings(settingsData.settings);
        }
      }

      // Refresh orders
      await refreshOrders();
    } catch (e) {
      console.warn('Failed to load admin data:', e);
    } finally {
      setIsLoadingData(false);
    }
  }, [refreshOrders]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchAdminData();
    }
  }, [user, fetchAdminData]);

  // Metric Computations from Real Orders
  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);
  const activeOrdersCount = useMemo(
    () => orders.filter((order) => order.status !== 'delivered' && order.status !== 'cancelled').length,
    [orders]
  );
  const completedOrdersCount = useMemo(
    () => orders.filter((order) => order.status === 'delivered').length,
    [orders]
  );
  const todayOrdersTotal = orders.length;
  const cancelledOrdersCount = useMemo(
    () => orders.filter((order) => order.status === 'cancelled').length,
    [orders]
  );

  // Status Change Handler
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    showToast('Order Status Updated', `Order #${orderId} marked as ${newStatus}.`, 'success');
  };

  // Toggle Restaurant Active/Disabled
  const handleToggleRestaurant = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ active: !currentStatus }),
      });
      if (res.ok) {
        setRestaurants((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isOpen: !currentStatus } : r))
        );
        showToast('Restaurant Updated', `Partner status changed to ${!currentStatus ? 'Active' : 'Disabled'}.`, 'success');
      }
    } catch (err) {
      showToast('Error', 'Could not update restaurant status.', 'error');
    }
  };

  // Toggle Menu Item Availability
  const handleToggleMenu = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/menu-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ available: !currentStatus }),
      });
      if (res.ok) {
        setMenuItems((prev) =>
          prev.map((m) => (m.id === id ? { ...m, available: !currentStatus } : m))
        );
        showToast('Menu Item Updated', `Availability updated.`, 'success');
      }
    } catch (err) {
      showToast('Error', 'Could not update item availability.', 'error');
    }
  };

  // Delete Menu Item
  const handleDeleteMenu = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const res = await fetch(`/api/menu-items/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setMenuItems((prev) => prev.filter((m) => m.id !== id));
        showToast('Menu Item Deleted', 'Item removed from database.', 'info');
      }
    } catch (err) {
      showToast('Error', 'Could not delete item.', 'error');
    }
  };

  // Toggle Rider Status
  const handleToggleRider = async (id: string, currentAvailable: boolean) => {
    try {
      const res = await fetch(`/api/riders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ available: !currentAvailable }),
      });
      if (res.ok) {
        setRiders((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  available: !currentAvailable,
                  status: !currentAvailable ? 'Active (Available)' : 'Offline',
                }
              : r
          )
        );
        showToast('Rider Updated', `Rider set to ${!currentAvailable ? 'Available' : 'Offline'}.`, 'success');
      }
    } catch (err) {
      showToast('Error', 'Could not update rider.', 'error');
    }
  };

  // Create Restaurant Submit
  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newRestName,
          category: newRestCategory,
          phone: newRestPhone,
          address: newRestAddress,
          location: newRestZone,
          openingHours: newRestHours,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Restaurant Added', `${newRestName} registered in database.`, 'success');
        setIsAddRestaurantOpen(false);
        setNewRestName('');
        fetchAdminData();
      } else {
        showToast('Failed', data.error || 'Could not add restaurant.', 'error');
      }
    } catch (e) {
      showToast('Error', 'Network error adding restaurant.', 'error');
    }
  };

  // Create Menu Item Submit
  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetRestId = newMenuRestId || (restaurants[0]?.id || '');
    if (!targetRestId) {
      showToast('Error', 'Please select a restaurant first.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          restaurantId: targetRestId,
          name: newMenuName,
          price: parseFloat(newMenuPrice),
          category: newMenuCategory,
          description: newMenuDesc,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Food Item Created', `${newMenuName} added to menu.`, 'success');
        setIsAddMenuOpen(false);
        setNewMenuName('');
        setNewMenuPrice('');
        setNewMenuDesc('');
        fetchAdminData();
      } else {
        showToast('Failed', data.error || 'Could not add item.', 'error');
      }
    } catch (e) {
      showToast('Error', 'Network error adding menu item.', 'error');
    }
  };

  // Save Settings Submit
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(platformSettings),
      });
      if (res.ok) {
        showToast('Settings Saved', 'Platform fees and limits updated.', 'success');
      }
    } catch (err) {
      showToast('Error', 'Failed to save settings.', 'error');
    }
  };

  // Auth Guard
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-100">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-soft text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Administrator Access Required</h2>
          <p className="text-xs text-slate-500">
            This dashboard is restricted strictly to HostelAdda platform administrators.
          </p>
          <Link
            href="/login?role=admin&redirect=/admin"
            className="block w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-soft transition-all"
          >
            Admin Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="rounded-3xl bg-slate-900 p-6 text-white shadow-soft sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-orange-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  Admin Portal
                </span>
                <span className="text-xs text-slate-400">HostelAdda PostgreSQL Operations</span>
              </div>
              <h1 className="mt-2 text-2xl font-black sm:text-3xl">Operations & Dispatch</h1>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={fetchAdminData}
                disabled={isLoadingData}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin text-orange-400' : ''}`} />
                <span>Sync Database</span>
              </button>
              <button
                onClick={() => setIsAddRestaurantOpen(true)}
                className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-soft transition hover:bg-orange-600"
              >
                Add Restaurant
              </button>
            </div>
          </div>
        </header>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <AdminSidebar items={sidebarItems} activeSection={activeSection} onSelect={setActiveSection} />

          <main className="flex-1 space-y-6">
            {activeSection === 'dashboard' && (
              <DashboardSection
                totalRevenue={totalRevenue}
                todayOrders={todayOrdersTotal}
                activeOrders={activeOrdersCount}
                completedOrders={completedOrdersCount}
                cancelledOrders={cancelledOrdersCount}
                activeRiders={riders.length}
                restaurantsCount={restaurants.length}
              />
            )}

            {activeSection === 'orders' && (
              <OrdersSection orders={orders} onStatusChange={handleStatusChange} />
            )}

            {activeSection === 'restaurants' && (
              <RestaurantsSection
                restaurants={restaurants}
                onAddRestaurant={() => setIsAddRestaurantOpen(true)}
                onToggleStatus={handleToggleRestaurant}
              />
            )}

            {activeSection === 'menu' && (
              <MenuSection
                items={menuItems}
                onAddItem={() => setIsAddMenuOpen(true)}
                onToggleAvailability={handleToggleMenu}
                onDeleteItem={handleDeleteMenu}
              />
            )}

            {activeSection === 'riders' && (
              <RidersSection
                riders={riders}
                onAddRider={() => setIsAddRiderOpen(true)}
                onToggleStatus={handleToggleRider}
              />
            )}

            {activeSection === 'settings' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-soft-sm space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Platform & Delivery Settings</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage campus delivery charges, minimum order limits, and official contact numbers.
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Campus Delivery Fee (PKR)
                      </label>
                      <input
                        type="number"
                        value={platformSettings.campusDeliveryFee}
                        onChange={(e) =>
                          setPlatformSettings({ ...platformSettings, campusDeliveryFee: e.target.value })
                        }
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Hostel Delivery Fee (PKR)
                      </label>
                      <input
                        type="number"
                        value={platformSettings.hostelDeliveryFee}
                        onChange={(e) =>
                          setPlatformSettings({ ...platformSettings, hostelDeliveryFee: e.target.value })
                        }
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Campus Min Order (PKR)
                      </label>
                      <input
                        type="number"
                        value={platformSettings.campusMinimumOrder}
                        onChange={(e) =>
                          setPlatformSettings({ ...platformSettings, campusMinimumOrder: e.target.value })
                        }
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Hostel Min Order (PKR)
                      </label>
                      <input
                        type="number"
                        value={platformSettings.hostelMinimumOrder}
                        onChange={(e) =>
                          setPlatformSettings({ ...platformSettings, hostelMinimumOrder: e.target.value })
                        }
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Support Contact Phone
                    </label>
                    <input
                      type="text"
                      value={platformSettings.contactPhone}
                      onChange={(e) =>
                        setPlatformSettings({ ...platformSettings, contactPhone: e.target.value })
                      }
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-5 py-3 shadow-soft transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Platform Settings</span>
                  </button>
                </form>
              </div>
            )}

            {(activeSection === 'customers' || activeSection === 'reports') && (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-soft-sm space-y-3">
                <h3 className="text-lg font-black text-slate-900">
                  {activeSection === 'customers' ? 'Customer Directory' : 'Analytics & Revenue Reports'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {activeSection === 'customers'
                    ? `Currently tracking ${orders.length} active order customer transactions from registered COMSATS, Abasyn, and Hostel City student accounts.`
                    : `Gross Platform Revenue: Rs. ${totalRevenue.toLocaleString()} across ${orders.length} total completed and active deliveries.`}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add Restaurant Modal */}
      {isAddRestaurantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-soft-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Register Partner Restaurant</h3>
              <button onClick={() => setIsAddRestaurantOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRestaurant} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={newRestName}
                  onChange={(e) => setNewRestName(e.target.value)}
                  placeholder="e.g. Student Biryani & Fast Food"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newRestCategory}
                    onChange={(e) => setNewRestCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="Desi Food">Desi Food</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Burger">Burger</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Contact</label>
                  <input
                    type="text"
                    required
                    value={newRestPhone}
                    onChange={(e) => setNewRestPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Address / Location</label>
                <input
                  type="text"
                  required
                  value={newRestAddress}
                  onChange={(e) => setNewRestAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Campus Delivery Zone</label>
                <input
                  type="text"
                  required
                  value={newRestZone}
                  onChange={(e) => setNewRestZone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-soft transition-all mt-2"
              >
                Register Partner Restaurant
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Menu Item Modal */}
      {isAddMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-soft-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Add Food Item to Menu</h3>
              <button onClick={() => setIsAddMenuOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMenuItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Restaurant</label>
                <select
                  value={newMenuRestId}
                  onChange={(e) => setNewMenuRestId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white"
                >
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.campusZone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  placeholder="e.g. Special Chicken Biryani (Double)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={newMenuPrice}
                    onChange={(e) => setNewMenuPrice(e.target.value)}
                    placeholder="350"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Food Category</label>
                  <select
                    value={newMenuCategory}
                    onChange={(e) => setNewMenuCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="Biryani">Biryani</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Burger">Burger</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Desi Food">Desi Food</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newMenuDesc}
                  onChange={(e) => setNewMenuDesc(e.target.value)}
                  placeholder="Fragrant basmati rice served with raita and fresh salad"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-soft transition-all mt-2"
              >
                Add Menu Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
