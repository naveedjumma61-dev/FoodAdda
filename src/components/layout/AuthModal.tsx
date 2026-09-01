'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, ArrowRight, GraduationCap, User, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const CAMPUS_OPTIONS = [
  'COMSATS University Islamabad',
  'Abasyn University Islamabad',
  'Hostel City Islamabad',
  'Chak Shehzad & NARC Enclave',
];

const HOSTEL_OPTIONS = [
  'Iqbal Hall (Boys Hostel 3)',
  'Liaquat Hall (Boys Hostel 1)',
  'Jinnah Hall (Boys Hostel 2)',
  'Fatima Jinnah Hall (Girls Hostel 1)',
  'Abasyn Boys Hostel Block A',
  'Abasyn Girls Hostel',
  'Hostel City Street 3 - Royal Executive Hostel',
  'Hostel City Street 5 - Scholar Boys Hostel',
  'Other / Off-Campus',
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCampus, setRegCampus] = useState('COMSATS University Islamabad');
  const [regHostel, setRegHostel] = useState('Iqbal Hall (Boys Hostel 3)');

  const { login, register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Missing Details', 'Please enter your email and password.', 'error');
      return;
    }
    setIsSubmitting(true);
    const result = await login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (result.success && result.user) {
      showToast('Welcome back! 🎉', `Logged in as ${result.user.name}`, 'success');
      onClose();
      // Redirect based on role
      const role = result.user.role;
      if (role === 'ADMIN') router.push('/admin');
      else if (role === 'RIDER') router.push('/rider');
      else router.push('/dashboard');
    } else {
      showToast('Login Failed', result.message, 'error');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regPassword) {
      showToast('Missing Details', 'Please fill all required fields.', 'error');
      return;
    }
    if (regPassword.length < 6) {
      showToast('Weak Password', 'Password must be at least 6 characters.', 'error');
      return;
    }
    setIsSubmitting(true);
    const result = await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      campus: regCampus,
      hostel: regHostel,
    });
    setIsSubmitting(false);

    if (result.success && result.user) {
      showToast('Account Created! 🎉', `Welcome to HostelAdda, ${result.user.name}!`, 'success');
      onClose();
      router.push('/dashboard');
    } else {
      showToast('Registration Failed', result.message, 'error');
    }
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm bg-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Banner */}
        <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-6 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md mb-3">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">
              {mode === 'login' ? 'Student Login' : 'Create Account'}
            </h3>
            <p className="text-xs text-orange-100 mt-1 max-w-xs mx-auto">
              Campus food delivered to your hostel gate in minutes
            </p>
          </div>
          {/* Mode Tabs */}
          <div className="flex mt-4 bg-white/10 rounded-2xl p-1 gap-1 relative z-10">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'login' ? 'bg-white text-orange-600 shadow-sm' : 'text-white/80 hover:text-white'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'signup' ? 'bg-white text-orange-600 shadow-sm' : 'text-white/80 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-sm pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/10 blur-sm pointer-events-none" />
        </div>

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@university.edu.pk"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`${inputCls} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm shadow-soft flex items-center justify-center gap-2 transition-all disabled:opacity-60 mt-2"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Logging in...</span></>
              ) : (
                <><span>Login to HostelAdda</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === 'signup' && (
          <form onSubmit={handleRegister} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Muhammad Hamza"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@university.edu.pk"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mobile Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0304-9871234"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className={`${inputCls} pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Campus / University</label>
              <select
                value={regCampus}
                onChange={(e) => setRegCampus(e.target.value)}
                className={inputCls}
              >
                {CAMPUS_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Hostel / Residence</label>
              <select
                value={regHostel}
                onChange={(e) => setRegHostel(e.target.value)}
                className={inputCls}
              >
                {HOSTEL_OPTIONS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm shadow-soft flex items-center justify-center gap-2 transition-all disabled:opacity-60 mt-2"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Creating Account...</span></>
              ) : (
                <><span>Create Student Account</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400">
              By signing up, you agree to our student delivery Terms & Conditions.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
