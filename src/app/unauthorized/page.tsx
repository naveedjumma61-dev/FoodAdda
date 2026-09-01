'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Home, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-soft-lg text-center space-y-6">
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div className="space-y-2">
          <span className="bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
            403 • Access Denied
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Restricted Area
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            You do not have the required permissions to view this portal.
            {user && (
              <span className="block mt-1 font-medium text-slate-700">
                Logged in as: <strong>{user.name}</strong> ({user.role})
              </span>
            )}
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            href="/"
            className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm shadow-soft flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Campus Home</span>
          </Link>

          {user ? (
            <button
              onClick={() => logout()}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with a Different Account</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Login to Your Account</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
