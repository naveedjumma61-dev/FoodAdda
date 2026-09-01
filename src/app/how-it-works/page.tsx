'use client';

import React from 'react';
import Link from 'next/link';
import { HowItWorksSection } from '../../components/home/HowItWorksSection';
import { HelpCircle, ChevronDown, Sparkles, ArrowRight, ShieldCheck, Bike, Clock } from 'lucide-react';

export default function HowItWorksPage() {
  const faqs = [
    {
      q: 'How fast is delivery to COMSATS and Hostel City?',
      a: 'Average delivery takes 15 to 25 minutes. Because our riders operate directly in Chak Shehzad and Hostel City, you do not face regular city traffic delays.',
    },
    {
      q: 'How do I receive my order at the hostel gate?',
      a: 'When the rider arrives at your hostel turnstile or gate, they will call or WhatsApp you. You come down to collect the food package and pay Cash on Delivery or via EasyPaisa/JazzCash.',
    },
    {
      q: 'Can I order late at night during exam weeks?',
      a: 'Yes! We have partner cafes (like Chai Shai, Burger Point, and Campus Cafe) that operate up to 4:00 AM for midnight cravings.',
    },
    {
      q: 'How do I apply student discount vouchers?',
      a: 'In your Cart or Checkout page, type codes like HOSTEL50 or NIGHTOWL in the voucher code box and click Apply.',
    },
    {
      q: 'How can university students join as riders?',
      a: 'Students with a bike or bicycle can earn daily income between classes. Switch to the Rider portal or sign up with your student ID.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Campus Delivery Guide
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            How HostelAdda Works
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The simplest way for Islamabad university students and hostel boarders to get hot meals delivered directly to their doorstep or gate.
          </p>
        </div>

        {/* 3 Step Section */}
        <HowItWorksSection />

        {/* Student FAQs */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft-sm space-y-6">
          <div className="flex items-center gap-2 text-orange-600">
            <HelpCircle className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4 divide-y divide-slate-100">
            {faqs.map((faq, i) => (
              <div key={i} className="pt-4 first:pt-0 space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-8 sm:p-12 text-white shadow-soft text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-black">Hungry in your hostel right now?</h3>
          <p className="text-xs sm:text-sm text-orange-100 max-w-md mx-auto">
            Explore hot biryani, crispy zingers, and midnight karak chai delivered fast.
          </p>
          <div className="pt-2">
            <Link
              href="/restaurants"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm shadow-soft transition-all"
            >
              <span>Explore Restaurants</span>
              <ArrowRight className="w-4 h-4 text-orange-500" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
