import { Plus, UserCog, ToggleLeft, ToggleRight } from 'lucide-react';

import { AdminEmptyState } from '../AdminEmptyState';
import { AdminSectionHeader } from '../AdminSectionHeader';

export interface RiderRecord {
  id: string;
  name: string;
  phone: string;
  zone: string;
  bike: string;
  status: string;
  ordersCompleted: number;
  available?: boolean;
}

interface RidersSectionProps {
  riders: RiderRecord[];
  onAddRider?: () => void;
  onToggleStatus?: (id: string, currentAvailable: boolean) => void;
}

export function RidersSection({ riders, onAddRider, onToggleStatus }: RidersSectionProps) {
  return (
    <div>
      <AdminSectionHeader
        title="Riders"
        subtitle="Manage rider visibility, assignments, and delivery coverage"
        action={
          <button
            onClick={onAddRider}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-soft-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add rider
          </button>
        }
      />

      {riders.length === 0 ? (
        <AdminEmptyState title="No riders found" description="Register a rider to start assigning delivery jobs." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {riders.map((rider) => (
            <div key={rider.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft-sm">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900">{rider.name}</h4>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${rider.available === false ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>
                  {rider.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p><strong className="text-slate-800">Phone:</strong> {rider.phone}</p>
                <p><strong className="text-slate-800">Zone:</strong> {rider.zone}</p>
                <p><strong className="text-slate-800">Vehicle:</strong> {rider.bike}</p>
                <p><strong className="text-slate-800">Completed Orders:</strong> {rider.ordersCompleted}</p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => onToggleStatus?.(rider.id, rider.available ?? true)}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {rider.available === false ? (
                    <>
                      <ToggleRight className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Set Available</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-3.5 w-3.5 text-slate-500" />
                      <span>Set Offline</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
