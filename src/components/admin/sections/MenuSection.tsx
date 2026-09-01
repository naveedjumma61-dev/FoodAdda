import Image from 'next/image';
import { Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

import { AdminEmptyState } from '../AdminEmptyState';
import { AdminSectionHeader } from '../AdminSectionHeader';

export interface MenuItemRecord {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  available?: boolean;
  restaurantName?: string;
  restaurantId?: string;
}

interface MenuSectionProps {
  items: MenuItemRecord[];
  onAddItem?: () => void;
  onToggleAvailability?: (id: string, currentStatus: boolean) => void;
  onDeleteItem?: (id: string) => void;
}

export function MenuSection({ items, onAddItem, onToggleAvailability, onDeleteItem }: MenuSectionProps) {
  return (
    <div>
      <AdminSectionHeader
        title="Menu Management"
        subtitle="Update categories, pricing, availability, and inventory"
        action={
          <button
            onClick={onAddItem}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors shadow-soft-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add food
          </button>
        }
      />

      {items.length === 0 ? (
        <AdminEmptyState title="No menu items found" description="Add menu products for a partner restaurant to begin managing inventory." />
      ) : (
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft-sm">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-slate-100 flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500">{item.restaurantName || item.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="text-sm font-black text-slate-900">Rs. {item.price}</span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${item.available === false ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {item.available === false ? 'Unavailable' : 'Available'}
                </span>
                
                <button
                  onClick={() => onToggleAvailability?.(item.id, item.available ?? true)}
                  title="Toggle Item Availability"
                  className="rounded-xl bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {item.available === false ? (
                    <ToggleRight className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 text-rose-600" />
                  )}
                </button>

                {onDeleteItem && (
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    title="Delete Menu Item"
                    className="rounded-xl bg-slate-100 p-2 text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
