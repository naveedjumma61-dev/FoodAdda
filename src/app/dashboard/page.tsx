'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { RESTAURANTS_DATA } from '../../data/mockData';
import { RestaurantCard } from '../../components/restaurant/RestaurantCard';
import {
  User,
  Clock,
  Heart,
  MapPin,
  Building2,
  Phone,
  Mail,
  GraduationCap,
  ShieldCheck,
  Edit3,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

function CustomerDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as string) || 'profile';

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'favorites' | 'addresses'>(
    (initialTab as any) || 'profile'
  );

  const { user, refreshUser, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { orders, favoriteIds } = useOrder();
  const { showToast } = useToast();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states initialized with live database user
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [campus, setCampus] = useState(user?.campus || 'COMSATS University Islamabad');
  const [hostel, setHostel] = useState(user?.hostel || 'Iqbal Hall (Boys Hostel 3)');

  // Sync state when user session loads
  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      if (user.campus) setCampus(user.campus);
      if (user.hostel) setHostel(user.hostel);
    }
  }, [user]);

  const favoriteRestaurants = RESTAURANTS_DATA.filter((r) =>
    favoriteIds.includes(r.id)
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          phone,
          campus,
          hostel,
        }),
      });

      if (res.ok) {
        await refreshUser();
        setIsEditingProfile(false);
        showToast('Profile Saved! ✨', 'Your campus and contact details were updated in PostgreSQL.', 'success');
      } else {
        showToast('Update Failed', 'Could not save profile details.', 'error');
      }
    } catch (err) {
      showToast('Error', 'Network error while saving profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const navTabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Clock, count: orders.length },
    { id: 'favorites', label: 'Favorites', icon: Heart, count: favoriteRestaurants.length },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: 2 },
  ];

  if (isAuthLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-soft text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Sign In to View Profile</h2>
          <p className="text-xs text-slate-500">
            Please log in to manage your student details, track orders, and view saved favorite restaurants.
          </p>
          <Link
            href="/login?redirect=/dashboard"
            className="block w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-soft transition-all"
          >
            Student Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* User Top Hero Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-soft flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-md">
                  {user.role}
                </span>
                <span className="text-xs text-slate-500 font-mono font-bold">
                  {user.email}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <GraduationCap className="w-4 h-4 text-orange-500" />
                <span>{user.campus || 'COMSATS University Islamabad'} • {user.hostel || 'Hostel City'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('profile');
                setIsEditingProfile(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs flex items-center gap-1.5 transition-colors border border-orange-200"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-soft font-black'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Profile View */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft-sm max-w-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Student Information</h3>
                <p className="text-xs text-slate-500">Live details stored in PostgreSQL account profile</p>
              </div>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Campus</label>
                    <input
                      type="text"
                      required
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hostel / Hall</label>
                    <input
                      type="text"
                      required
                      value={hostel}
                      onChange={(e) => setHostel(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 shadow-soft flex items-center gap-1.5"
                  >
                    {isSaving && <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />}
                    <span>Save to PostgreSQL</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div>
                  <p className="text-slate-400 font-medium">Full Name</p>
                  <p className="font-bold text-slate-900 mt-1">{user.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Phone Number</p>
                  <p className="font-bold text-slate-900 mt-1">{user.phone}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Campus Area</p>
                  <p className="font-bold text-slate-900 mt-1">{user.campus || 'COMSATS University Islamabad'}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Hostel / Room</p>
                  <p className="font-bold text-slate-900 mt-1">{user.hostel || 'Hostel City'}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders View */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-soft-sm max-w-md mx-auto space-y-3">
                <Clock className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-900">No Orders Placed Yet</h3>
                <p className="text-xs text-slate-500">Explore nearby restaurants to order food to your hostel.</p>
                <Link
                  href="/restaurants"
                  className="inline-block px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-soft"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image src={order.restaurantLogo} alt={order.restaurantName} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-xs text-orange-600">#{order.id}</span>
                      <h4 className="font-black text-slate-900 text-sm">{order.restaurantName}</h4>
                      <p className="text-xs text-slate-500">Rs. {order.total} • {order.createdAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 capitalize">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-soft"
                    >
                      <span>Track Live</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Favorites View */}
        {activeTab === 'favorites' && (
          <div>
            {favoriteRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRestaurants.map((res) => (
                  <RestaurantCard key={res.id} restaurant={res} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-md mx-auto space-y-3">
                <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-900">No Favorites Yet</h3>
                <p className="text-xs text-slate-500">Click the heart icon on any restaurant card to save your favorites.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft-sm space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-orange-500" />
                    Primary Hostel Room
                  </span>
                  <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 font-medium">{user.campus || 'COMSATS University Islamabad'}</p>
                <p className="text-xs text-slate-500">{user.hostel || 'Iqbal Hall'} • Room 214</p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 font-medium">
                Active campus delivery point
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-bold">Loading Dashboard...</div>}>
      <CustomerDashboardContent />
    </Suspense>
  );
}
