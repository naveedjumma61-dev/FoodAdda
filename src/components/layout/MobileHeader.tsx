'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocation } from '../../context/LocationContext';
import { MapPin, ChevronDown, Search, Flame } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  const { selectedCampus, selectedHostel, openLocationModal } = useLocation();
  const router = useRouter();

  return (
    <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 space-y-2 sticky top-0 z-30 shadow-soft-sm">
      {/* Top row: Brand & Location */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-xl bg-orange-500 flex items-center justify-center text-white">
            <Flame className="w-4 h-4 fill-white" />
          </div>
          <span className="text-base font-extrabold text-slate-900">
            Hostel<span className="text-orange-500">Adda</span>
          </span>
        </Link>

        {/* Location chip */}
        <button
          onClick={openLocationModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/60 text-left max-w-[200px]"
        >
          <MapPin className="w-3 h-3 text-orange-600 flex-shrink-0" />
          <span className="text-xs font-bold text-slate-800 truncate">
            {selectedCampus.name.split(' ')[0]} ({selectedHostel.split(' ')[0]})
          </span>
          <ChevronDown className="w-3 h-3 text-slate-500 flex-shrink-0" />
        </button>
      </div>

      {/* Search Input */}
      <div
        onClick={() => router.push('/restaurants')}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100/90 text-slate-500 text-xs border border-slate-200/60 cursor-pointer"
      >
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <span className="truncate">Search "Biryani", "Zinger", "Chai" or restaurants...</span>
      </div>
    </div>
  );
};
