'use client';

import React from 'react';
import { MapPin, Utensils, Bike, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Pick Your Campus & Hostel',
      description: 'Select your university (COMSATS, Abasyn or Hostel City) and enter your hostel building or gate point.',
      icon: MapPin,
      color: 'bg-orange-500 text-white',
    },
    {
      step: '02',
      title: 'Select Favorite Meals',
      description: 'Choose from student-priced biryani, burgers, shawarma, karahi, and midnight karak chai from top campus cafes.',
      icon: Utensils,
      color: 'bg-amber-500 text-white',
    },
    {
      step: '03',
      title: 'Collect at Gate & Pay COD',
      description: 'Our student rider delivers to your hostel turnstile in 15-25 minutes. Pay cash or EasyPaisa upon arrival.',
      icon: Bike,
      color: 'bg-emerald-500 text-white',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Quick & Simple
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-2">
            How HostelAdda Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Built from scratch for university students who want hot food delivered without leaving the hostel.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative group hover:bg-orange-50/40 hover:border-orange-200 transition-all duration-300 shadow-soft-sm"
              >
                {/* Step number watermark */}
                <div className="text-4xl font-black text-slate-200 group-hover:text-orange-200 transition-colors absolute top-6 right-6">
                  {step.step}
                </div>

                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center shadow-soft mb-6`}>
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
