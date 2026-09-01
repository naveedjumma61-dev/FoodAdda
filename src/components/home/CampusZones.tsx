'use client';

import React from 'react';
import { CAMPUS_LOCATIONS } from '../../data/mockData';
import { MapPin, Navigation, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

export const CampusZones: React.FC = () => {
  const { setCampus, openLocationModal, selectedCampus } = useLocation();

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-wider mb-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>Coverage Areas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Active University & Hostel Hubs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Our campus riders are stationed directly at major gates and hostel clusters in Islamabad for instant delivery.
          </p>
        </div>

        {/* Campus Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAMPUS_LOCATIONS.map((campus) => {
            const isCurrent = selectedCampus.id === campus.id;
            return (
              <div
                key={campus.id}
                className={`bg-white rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-orange-500 shadow-soft ring-2 ring-orange-500/10'
                    : 'border-slate-200/80 hover:border-slate-300 shadow-soft-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    {campus.name}
                  </h3>
                  <p className="text-xs text-orange-600 font-semibold mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{campus.zone}</span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Popular Drops
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {campus.hostels.slice(0, 3).map((h) => (
                        <li key={h} className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                          <span className="truncate">{h}</span>
                        </li>
                      ))}
                      {campus.hostels.length > 3 && (
                        <li className="text-[11px] text-slate-400 font-medium">
                          +{campus.hostels.length - 3} more hostel halls
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => {
                      setCampus(campus);
                      openLocationModal();
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-orange-500 text-white shadow-soft'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{isCurrent ? 'Deliver Here' : 'Select Zone'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
