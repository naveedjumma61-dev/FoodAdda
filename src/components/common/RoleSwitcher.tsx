'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '../../context/OrderContext';
import { User, Bike, ShieldCheck } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { userRole, setUserRole } = useOrder();
  const router = useRouter();

  const handleRoleChange = (role: 'customer' | 'rider' | 'admin') => {
    setUserRole(role);
    if (role === 'customer') {
      router.push('/');
    } else if (role === 'rider') {
      router.push('/rider');
    } else if (role === 'admin') {
      router.push('/admin');
    }
  };

  return (
    <div className="flex items-center p-1 bg-slate-100/90 rounded-full border border-slate-200/80 text-xs font-medium">
      <button
        onClick={() => handleRoleChange('customer')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
          userRole === 'customer'
            ? 'bg-orange-500 text-white shadow-sm font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Student / Customer View"
      >
        <User className="w-3.5 h-3.5" />
        <span>Student</span>
      </button>

      <button
        onClick={() => handleRoleChange('rider')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
          userRole === 'rider'
            ? 'bg-emerald-600 text-white shadow-sm font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Rider Delivery Dashboard View"
      >
        <Bike className="w-3.5 h-3.5" />
        <span>Rider</span>
      </button>

      <button
        onClick={() => handleRoleChange('admin')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
          userRole === 'admin'
            ? 'bg-slate-900 text-white shadow-sm font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Admin Operations View"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Admin</span>
      </button>
    </div>
  );
};
