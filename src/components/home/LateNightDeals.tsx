'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Moon, Sparkles, Tag, ArrowRight, Clock, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const LateNightDeals: React.FC = () => {
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast('Promo Code Copied!', `Use code ${code} at checkout.`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const deals = [
    {
      code: 'NIGHTOWL',
      title: 'Midnight Study Fuel',
      discount: 'Rs. 80 OFF',
      minOrder: 'Min. Rs. 500',
      tag: '10 PM - 4 AM',
      bgColor: 'from-purple-900 via-indigo-900 to-slate-900',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=60',
    },
    {
      code: 'HOSTEL50',
      title: 'Hostel Group Bite',
      discount: 'Rs. 50 OFF',
      minOrder: 'Min. Rs. 300',
      tag: 'All Day Every Day',
      bgColor: 'from-orange-900 via-amber-900 to-slate-900',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=60',
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-purple-600 text-xs font-black uppercase tracking-wider mb-1">
              <Moon className="w-4 h-4 text-purple-600 fill-purple-600" />
              <span>Exam & Study Fuel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Student Deals & Midnight Cravings
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.code}
              className={`relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${deal.bgColor} text-white overflow-hidden shadow-soft flex flex-col justify-between min-h-[200px] border border-white/10`}
            >
              {/* Background food image with low opacity */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none">
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>

              {/* Tag */}
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{deal.tag}</span>
                </span>

                <h3 className="text-2xl sm:text-3xl font-black mt-3">{deal.title}</h3>
                <p className="text-sm text-slate-300 mt-1">
                  Save <strong className="text-amber-300 font-extrabold">{deal.discount}</strong> on orders ({deal.minOrder})
                </p>
              </div>

              {/* Promo code copy chip */}
              <div className="relative z-10 mt-6 flex items-center gap-3">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-2xl">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span className="font-mono font-bold text-sm tracking-wider text-white">
                    {deal.code}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(deal.code)}
                  className="px-4 py-2 rounded-2xl bg-white text-slate-900 hover:bg-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-soft"
                >
                  {copiedCode === deal.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
