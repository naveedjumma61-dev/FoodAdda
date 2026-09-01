import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { AdminEmptyState } from '../AdminEmptyState';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { Order, OrderStatus } from '@/types';

interface OrdersSectionProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

export function OrdersSection({ orders, onStatusChange }: OrdersSectionProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.restaurantName.toLowerCase().includes(query) ||
        order.deliveryDetails.customerName.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  return (
    <div>
      <AdminSectionHeader
        title="Orders Management"
        subtitle="Monitor incoming orders and update fulfillment status"
        action={
          <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
            View all
          </button>
        }
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft-sm sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID, restaurant, customer"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-orange-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none"
          >
            <option value="all">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="rider_assigned">Rider assigned</option>
            <option value="out_for_delivery">Out for delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <AdminEmptyState title="No matching orders" description="Try a different search or status filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-y border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Restaurant</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="px-4 py-4 font-mono text-xs font-black text-orange-600">#{order.id}</td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-900">{order.deliveryDetails.customerName}</p>
                      <p className="text-xs text-slate-500">{order.deliveryDetails.hostelName}</p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{order.restaurantName}</td>
                    <td className="px-4 py-4 font-black text-slate-900">Rs. {order.total}</td>
                    <td className="px-4 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`rounded-xl border px-2.5 py-1.5 text-xs font-bold outline-none ${
                          order.status === 'delivered'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : order.status === 'cancelled'
                              ? 'border-rose-200 bg-rose-50 text-rose-700'
                              : order.status === 'out_for_delivery'
                                ? 'border-purple-200 bg-purple-50 text-purple-700'
                                : order.status === 'rider_assigned'
                                  ? 'border-sky-200 bg-sky-50 text-sky-700'
                                  : 'border-orange-200 bg-orange-50 text-orange-700'
                        }`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="rider_assigned">Rider assigned</option>
                        <option value="out_for_delivery">Out for delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
