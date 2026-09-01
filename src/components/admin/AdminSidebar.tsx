import { LucideIcon } from 'lucide-react';

export type AdminSection =
  | 'dashboard'
  | 'orders'
  | 'restaurants'
  | 'menu'
  | 'riders'
  | 'customers'
  | 'reports'
  | 'settings';

export interface AdminSidebarItem {
  id: AdminSection;
  label: string;
  icon: LucideIcon;
  count?: number;
}

interface AdminSidebarProps {
  items: readonly AdminSidebarItem[];
  activeSection: AdminSection;
  onSelect: (section: AdminSection) => void;
}

export function AdminSidebar({ items, activeSection, onSelect }: AdminSidebarProps) {
  return (
    <aside className="w-full lg:w-72 shrink-0 rounded-3xl border border-slate-200 bg-slate-900 p-4 text-white shadow-soft">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-sm font-black text-white">
          HA
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Operations</p>
          <h2 className="text-lg font-black">Admin</h2>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map(({ id, label, icon: Icon, count }) => {
          const isActive = activeSection === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-soft'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </span>
              {typeof count === 'number' && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
