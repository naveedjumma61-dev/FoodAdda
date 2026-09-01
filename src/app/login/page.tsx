'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  Flame,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Bike,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const roleHint = searchParams.get('role');

  const { login, register, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCampus, setRegCampus] = useState('COMSATS University Islamabad');
  const [regHostel, setRegHostel] = useState('Iqbal Hall (Boys Hostel 3)');


  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success && res.user) {
        showToast('Welcome back!', `Signed in as ${res.user.name}`, 'success');

        // Smart redirect based on role and target
        if (redirectUrl && redirectUrl !== '/') {
          router.push(redirectUrl);
        } else if (res.user.role === 'ADMIN') {
          router.push('/admin');
        } else if (res.user.role === 'RIDER') {
          router.push('/rider');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    } catch {
      setErrorMsg('Failed to connect to authentication service.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        campus: regCampus,
        hostel: regHostel,
      });

      if (res.success && res.user) {
        showToast('Account Created!', 'Welcome to HostelAdda campus food delivery.', 'success');
        if (redirectUrl && redirectUrl !== '/') {
          router.push(redirectUrl);
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMsg(res.message || 'Registration failed. Please check your inputs.');
      }
    } catch {
      setErrorMsg('Network error during registration.');
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, show redirect helper
  if (isAuthenticated && user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-soft text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Already Signed In</h2>
          <p className="text-xs text-slate-500">
            You are logged in as <strong className="text-slate-800">{user.name}</strong> ({user.role}).
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                if (user.role === 'ADMIN') router.push('/admin');
                else if (user.role === 'RIDER') router.push('/rider');
                else router.push('/dashboard');
              }}
              className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-soft transition-all"
            >
              Go to Dashboard
            </button>
            <Link
              href="/"
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 sm:py-16 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-soft-lg overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 p-6 text-white text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-3 shadow-soft">
            <Flame className="w-7 h-7 fill-white text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">HostelAdda Account</h1>
          <p className="text-xs text-slate-300 mt-1">
            {roleHint === 'admin'
              ? 'Administrator access required'
              : roleHint === 'rider'
              ? 'Rider portal login required'
              : 'Campus food delivery for university & hostel students'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-white/10 backdrop-blur rounded-2xl mt-5">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@hosteladda.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:border-orange-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:border-orange-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black text-sm shadow-soft flex items-center justify-center gap-2 transition-all mt-2"
              >
                {loading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Muhammad Hamza"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:border-orange-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="hamza@student.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:border-orange-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:border-orange-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:border-orange-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Campus
                </label>
                <select
                  value={regCampus}
                  onChange={(e) => setRegCampus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:border-orange-500 focus:outline-none bg-white transition-all"
                >
                  <option value="COMSATS University Islamabad">COMSATS University Islamabad (Chak Shehzad)</option>
                  <option value="Abasyn University Islamabad">Abasyn University Islamabad</option>
                  <option value="Hostel City Islamabad">Hostel City Islamabad</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hostel / Hall
                </label>
                <select
                  value={regHostel}
                  onChange={(e) => setRegHostel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:border-orange-500 focus:outline-none bg-white transition-all"
                >
                  <option value="Iqbal Hall (Boys Hostel 3)">Iqbal Hall (Boys Hostel 3)</option>
                  <option value="Jinnah Hall (Boys Hostel 1)">Jinnah Hall (Boys Hostel 1)</option>
                  <option value="Fatima Hall (Girls Hostel 1)">Fatima Hall (Girls Hostel 1)</option>
                  <option value="Hostel City Street 4">Hostel City Street 4</option>
                  <option value="Hostel City Street 7">Hostel City Street 7</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black text-sm shadow-soft flex items-center justify-center gap-2 transition-all mt-3"
              >
                {loading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <span>Create Free Student Account</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
