import { ArrowUpRight, CheckCircle2, Clock3, ShoppingBag, Store, Users } from 'lucide-react';

import { AdminMetricCard } from '../AdminMetricCard';
import { AdminSectionHeader } from '../AdminSectionHeader';

interface DashboardSectionProps {
  totalRevenue: number;
  todayOrders: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  activeRiders: number;
  restaurantsCount: number;
}

export function DashboardSection({
  totalRevenue,
  todayOrders,
  activeOrders,
  completedOrders,
  cancelledOrders,
  activeRiders,
  restaurantsCount,
}: DashboardSectionProps) {
  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Dashboard"
        subtitle="Operations overview across the food delivery network"
        action={
          <button className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800">
            Export report
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard label="Today's orders" value={todayOrders} detail="+18% vs yesterday" icon={ShoppingBag} accent="orange" />
        <AdminMetricCard label="Revenue" value={`Rs. ${totalRevenue.toLocaleString()}`} detail="Cash collected & COD" icon={ArrowUpRight} accent="emerald" />
        <AdminMetricCard label="Active orders" value={activeOrders} detail="In kitchen & on bike" icon={Clock3} accent="amber" />
        <AdminMetricCard label="Completed" value={completedOrders} detail="Delivery success rate" icon={CheckCircle2} accent="emerald" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900">Operations snapshot</h4>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600">Live</span>
          </div>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
              <span>Cancelled</span>
              <strong className="font-black text-slate-900">{cancelledOrders}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
              <span>Active riders</span>
              <strong className="font-black text-slate-900">{activeRiders}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
              <span>Restaurants</span>
              <strong className="font-black text-slate-900">{restaurantsCount}</strong>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900">Operational health</h4>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Stable
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-orange-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-orange-600"><ShoppingBag className="h-4 w-4" /> Orders</div>
              <p className="text-2xl font-black text-slate-900">{todayOrders}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-emerald-600"><Store className="h-4 w-4" /> Restaurants</div>
              <p className="text-2xl font-black text-slate-900">{restaurantsCount}</p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sky-600"><Users className="h-4 w-4" /> Riders</div>
              <p className="text-2xl font-black text-slate-900">{activeRiders}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
