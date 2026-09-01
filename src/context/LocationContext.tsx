'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CampusLocation } from '../types';
import { CAMPUS_LOCATIONS } from '../data/mockData';

interface LocationContextType {
  selectedCampus: CampusLocation;
  selectedHostel: string;
  roomNumber: string;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  setCampus: (campus: CampusLocation) => void;
  setHostel: (hostel: string) => void;
  setRoomNumber: (room: string) => void;
  allCampuses: CampusLocation[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCampus, setSelectedCampus] = useState<CampusLocation>(CAMPUS_LOCATIONS[0]);
  const [selectedHostel, setSelectedHostel] = useState<string>(CAMPUS_LOCATIONS[0].hostels[0]);
  const [roomNumber, setRoomNumber] = useState<string>('Room 204');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedCampusId = localStorage.getItem('hosteladda_campus_id');
      const savedHostel = localStorage.getItem('hosteladda_hostel');
      const savedRoom = localStorage.getItem('hosteladda_room');

      if (savedCampusId) {
        const found = CAMPUS_LOCATIONS.find((c) => c.id === savedCampusId);
        if (found) setSelectedCampus(found);
      }
      if (savedHostel) setSelectedHostel(savedHostel);
      if (savedRoom) setRoomNumber(savedRoom);
    } catch (e) {
      console.warn('LocalStorage not available', e);
    }
  }, []);

  const setCampus = (campus: CampusLocation) => {
    setSelectedCampus(campus);
    setSelectedHostel(campus.hostels[0] || 'Main Gate');
    try {
      localStorage.setItem('hosteladda_campus_id', campus.id);
      localStorage.setItem('hosteladda_hostel', campus.hostels[0] || 'Main Gate');
    } catch (e) {
      console.warn(e);
    }
  };

  const setHostel = (hostel: string) => {
    setSelectedHostel(hostel);
    try {
      localStorage.setItem('hosteladda_hostel', hostel);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSetRoomNumber = (room: string) => {
    setRoomNumber(room);
    try {
      localStorage.setItem('hosteladda_room', room);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        selectedCampus,
        selectedHostel,
        roomNumber,
        isLocationModalOpen,
        openLocationModal: () => setIsLocationModalOpen(true),
        closeLocationModal: () => setIsLocationModalOpen(false),
        setCampus,
        setHostel,
        setRoomNumber: handleSetRoomNumber,
        allCampuses: CAMPUS_LOCATIONS,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
