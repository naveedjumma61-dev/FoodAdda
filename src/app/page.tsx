import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategorySection } from '../components/home/CategorySection';
import { PopularRestaurants } from '../components/home/PopularRestaurants';
import { LateNightDeals } from '../components/home/LateNightDeals';
import { CampusZones } from '../components/home/CampusZones';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CategorySection />
      <PopularRestaurants />
      <LateNightDeals />
      <CampusZones />
      <HowItWorksSection />
      <TestimonialsSection />
    </div>
  );
}
