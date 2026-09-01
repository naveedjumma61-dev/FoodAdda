'use client';

import React, { useState } from 'react';
import { useLocation } from '../../context/LocationContext';
import { MapPin, Building2, Check, X, Navigation } from 'lucide-react';
import { CampusLocation } from '../../types';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    closeLocationModal,
    selectedCampus,
    selectedHostel,
    roomNumber,
    setCampus,
    setHostel,
    setRoomNumber,
    allCampuses,
  } = useLocation();

  const [tempCampus, setTempCampus] = useState<CampusLocation>(selectedCampus);
  const [tempHostel, setTempHostel] = useState<string>(selectedHostel);
  const [tempRoom, setTempRoom] = useState<string>(roomNumber);

  if (!isLocationModalOpen) return null;

  const handleSave = () => {
    setCampus(tempCampus);
    setHostel(tempHostel);
    setRoomNumber(tempRoom);
    closeLocationModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-soft-lg w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-50/50 to-amber-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-soft">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Choose Delivery Location</h3>
              <p className="text-xs text-slate-500">Fast delivery directly to your campus gate or hostel room</p>
            </div>
          </div>
          <button
            onClick={closeLocationModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Select Campus */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
              1. Select University / Zone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {allCampuses.map((campus) => {
                const isSelected = tempCampus.id === campus.id;
                return (
                  <button
                    key={campus.id}
                    onClick={() => {
                      setTempCampus(campus);
                      setTempHostel(campus.hostels[0] || 'Main Gate');
                    }}
                    className={`text-left p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/40 text-orange-950 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <span className="font-bold text-sm leading-snug">{campus.name}</span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 ml-1">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-orange-500" />
                      {campus.zone}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Hostel / Gate */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
              2. Select Hostel Hall / Gate Point
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {tempCampus.hostels.map((hostel) => {
                const isHostelSelected = tempHostel === hostel;
                return (
                  <button
                    key={hostel}
                    onClick={() => setTempHostel(hostel)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                      isHostelSelected
                        ? 'bg-orange-500 text-white shadow-soft-sm font-semibold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className={`w-4 h-4 ${isHostelSelected ? 'text-white' : 'text-slate-400'}`} />
                      <span>{hostel}</span>
                    </div>
                    {isHostelSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Room / Building details */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              3. Room / Floor Number (Optional)
            </label>
            <input
              type="text"
              value={tempRoom}
              onChange={(e) => setTempRoom(e.target.value)}
              placeholder="e.g. Room 214, 2nd Floor or Reception Desk"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 hidden sm:block">
            Delivering in <span className="font-semibold text-slate-800">15-25 mins</span>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={closeLocationModal}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm shadow-soft transition-all"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
