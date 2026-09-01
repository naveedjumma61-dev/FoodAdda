'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Quote, Heart } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Usman Tariq',
      university: 'COMSATS Islamabad (CS Dept)',
      hostel: 'Liaquat Hall (Boys Hostel 1)',
      comment:
        'During finals week at 2 AM, HostelAdda saved our entire study group. The Biryani from Hostel City arrived piping hot at the hostel gate in 18 minutes!',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
      rating: 5,
    },
    {
      name: 'Areeba Malik',
      university: 'Abasyn University Islamabad',
      hostel: 'Girls Hostel Block A',
      comment:
        'The student discounts and cash on delivery make it super convenient. No hassle with credit cards, and the riders are polite and always on time.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
      rating: 5,
    },
    {
      name: 'Zain Ul Abideen',
      university: 'COMSATS Chak Shehzad (EE)',
      hostel: 'Hostel City Street 5',
      comment:
        'Late night Chai Shai paratha rolls are unbeatable. Having a food delivery service dedicated solely to our campus area is a game changer.',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60',
      rating: 5,
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-amber-300" />
            <span>Loved by 2,000+ Students</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            What Campus Residents Say
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="bg-slate-800/80 rounded-3xl p-6 sm:p-7 border border-slate-700/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-4 border-t border-slate-700/60">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-orange-500/50">
                  <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-[11px] text-orange-400">{rev.university}</p>
                  <p className="text-[10px] text-slate-400">{rev.hostel}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
