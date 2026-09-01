import { LucideIcon } from 'lucide-react';

interface AdminMetricCardProps {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  accent: 'orange' | 'emerald' | 'amber' | 'sky';
}

const accentStyles = {
  orange: 'text-orange-500 bg-orange-50',
  emerald: 'text-emerald-600 bg-emerald-50',
  amber: 'text-amber-600 bg-amber-50',
  sky: 'text-sky-600 bg-sky-50',
};

export function AdminMetricCard({ label, value, detail, icon: Icon, accent }: AdminMetricCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</span>
        <div className={`rounded-xl p-2 ${accentStyles[accent]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-[11px] font-semibold text-slate-500">{detail}</p>
    </div>
  );
}
