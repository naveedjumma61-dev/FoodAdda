import { ReactNode } from 'react';

interface AdminSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function AdminSectionHeader({ title, subtitle, action }: AdminSectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-xl font-black text-slate-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
