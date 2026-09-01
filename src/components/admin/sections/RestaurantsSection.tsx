import Image from 'next/image';
import { Plus, Pencil, ToggleLeft, ToggleRight } from 'lucide-react';

import { AdminEmptyState } from '../AdminEmptyState';
import { AdminSectionHeader } from '../AdminSectionHeader';

export interface RestaurantRecord {
  id: string;
  name: string;
  campusZone: string;
  rating: number;
  openingHours: string;
  logo: string;
  isOpen?: boolean;
  phone?: string;
  category?: string;
}

interface RestaurantsSectionProps {
  restaurants: RestaurantRecord[];
  onAddRestaurant?: () => void;
  onToggleStatus?: (id: string, currentStatus: boolean) => void;
}

export function RestaurantsSection({ restaurants, onAddRestaurant, onToggleStatus }: RestaurantsSectionProps) {
  return (
    <div>
      <AdminSectionHeader
        title="Restaurants"
        subtitle="View restaurants, manage availability, and update service details"
        action={
          <button
            onClick={onAddRestaurant}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors shadow-soft-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add restaurant
          </button>
        }
      />

      {restaurants.length === 0 ? (
        <AdminEmptyState title="No restaurants yet" description="Add a partner restaurant to begin managing campus delivery." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-slate-100 flex-shrink-0">
                    <Image src={restaurant.logo} alt={restaurant.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{restaurant.name}</h4>
                    <p className="text-xs text-slate-500">{restaurant.campusZone}</p>
                  </div>
                </div>

                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${restaurant.isOpen === false ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {restaurant.isOpen === false ? 'Disabled' : 'Active'}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
                <span>⭐ {restaurant.rating || 4.8}</span>
                <span>{restaurant.openingHours || '10:00 AM - 03:00 AM'}</span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => onToggleStatus?.(restaurant.id, restaurant.isOpen ?? true)}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {restaurant.isOpen === false ? (
                    <>
                      <ToggleRight className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Enable Partner</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-3.5 w-3.5 text-rose-600" />
                      <span>Disable Partner</span>
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
