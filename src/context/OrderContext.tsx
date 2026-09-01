'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Order, OrderStatus, DeliveryDetails, CartItem } from '../types';
import { useToast } from './ToastContext';
import { mapDbOrderToFrontend, toDatabaseStatus } from '../lib/orderMapper';

interface OrderContextType {
  orders: Order[];
  activeOrder: Order | null;
  isLoadingOrders: boolean;
  favoriteIds: string[];
  toggleFavorite: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
  createOrder: (
    items: CartItem[],
    restaurantId: string,
    restaurantName: string,
    restaurantLogo: string,
    restaurantPhone: string,
    deliveryDetails: DeliveryDetails,
    subtotal: number,
    deliveryFee: number,
    discount: number,
    voucherCode?: string
  ) => Promise<Order>;
  getOrderById: (orderId: string) => Order | undefined;
  fetchOrderById: (orderId: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  refreshOrders: () => Promise<void>;
  userRole: 'customer' | 'rider' | 'admin';
  setUserRole: (role: 'customer' | 'rider' | 'admin') => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<'customer' | 'rider' | 'admin'>('customer');
  const { showToast } = useToast();

  // Load favorites & initial cache from localStorage on mount
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('hosteladda_favorites');
      if (savedFavs) setFavoriteIds(JSON.parse(savedFavs));
    } catch (e) {
      console.warn('LocalStorage load error in OrderContext', e);
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hosteladda_favorites', JSON.stringify(favoriteIds));
    } catch (e) {
      console.warn(e);
    }
  }, [favoriteIds]);

  // Fetch orders from API
  const refreshOrders = useCallback(async () => {
    try {
      setIsLoadingOrders(true);
      const res = await fetch('/api/orders', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const mappedOrders = data.orders.map((o: any) => mapDbOrderToFrontend(o));
          setOrders(mappedOrders);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not fetch orders from API:', e);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const activeOrder = orders.find((o) => o.status !== 'delivered' && o.status !== 'cancelled') || orders[0] || null;

  const toggleFavorite = (restaurantId: string) => {
    setFavoriteIds((prev) => {
      const isFav = prev.includes(restaurantId);
      if (isFav) {
        showToast('Removed from Favorites', 'Restaurant removed from wishlist.', 'info');
        return prev.filter((id) => id !== restaurantId);
      } else {
        showToast('Added to Favorites ❤️', 'Saved to your favorite spots.', 'success');
        return [...prev, restaurantId];
      }
    });
  };

  const isFavorite = (restaurantId: string) => favoriteIds.includes(restaurantId);

  const createOrder = async (
    items: CartItem[],
    restaurantId: string,
    restaurantName: string,
    restaurantLogo: string,
    restaurantPhone: string,
    deliveryDetails: DeliveryDetails,
    subtotal: number,
    deliveryFee: number,
    discount: number,
    voucherCode?: string
  ): Promise<Order> => {
    // Format items for backend API
    const formattedItems = items.map((item) => ({
      menuItemId: item.menuItem?.id || item.id,
      quantity: item.quantity,
      price: item.unitPrice || item.menuItem?.price || 0,
      name: item.menuItem?.name || 'Food Item',
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          restaurantId,
          items: formattedItems,
          deliveryDetails,
          subtotal,
          deliveryFee,
          discount,
          voucherCode,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.order) {
        const newFrontendOrder = mapDbOrderToFrontend(data.order);
        setOrders((prev) => [newFrontendOrder, ...prev.filter((o) => o.id !== newFrontendOrder.id)]);
        return newFrontendOrder;
      }
    } catch (err) {
      console.warn('Order creation API call failed, generating standard fallback:', err);
    }

    // Fallback if offline/network error
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `STU-${randomSuffix}`;

    const fallbackOrder: Order = {
      id: orderId,
      createdAt: 'Just now',
      status: 'confirmed',
      restaurantId,
      restaurantName,
      restaurantLogo,
      restaurantPhone,
      deliveryDetails,
      items,
      subtotal,
      deliveryFee,
      discount,
      voucherCode,
      total: Math.max(0, subtotal + deliveryFee - discount),
      estimatedDeliveryTime: '20-25 mins',
      rider: {
        name: 'Ali Raza (Campus Rider)',
        phone: '0315-7744332',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        bikeModel: 'Honda CD 70 (Red)',
        plateNumber: 'ICT-RI-8841',
        rating: 4.9,
      },
    };

    setOrders((prev) => [fallbackOrder, ...prev]);
    return fallbackOrder;
  };

  const getOrderById = (orderId: string) => {
    const cleanId = orderId.toUpperCase().replace('#', '');
    return orders.find(
      (o) =>
        o.id.toUpperCase() === cleanId ||
        o.id.toUpperCase() === `STU-${cleanId}` ||
        o.id.toUpperCase() === `HA-${cleanId}`
    );
  };

  const fetchOrderById = async (orderId: string): Promise<Order | null> => {
    // Try from memory first
    const existing = getOrderById(orderId);
    if (existing) return existing;

    try {
      const res = await fetch(`/api/orders/${orderId}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          const mapped = mapDbOrderToFrontend(data.order);
          setOrders((prev) => [mapped, ...prev.filter((o) => o.id !== mapped.id)]);
          return mapped;
        }
      }
    } catch (e) {
      console.warn(`Could not fetch order #${orderId} from API:`, e);
    }
    return null;
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            estimatedDeliveryTime:
              newStatus === 'delivered'
                ? 'Delivered'
                : newStatus === 'out_for_delivery'
                ? '5-10 mins away'
                : '15-20 mins',
          };
        }
        return order;
      })
    );

    // Persist status update to API
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          status: toDatabaseStatus(newStatus),
        }),
      });
    } catch (e) {
      console.warn('Failed to update order status on server:', e);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        isLoadingOrders,
        favoriteIds,
        toggleFavorite,
        isFavorite,
        createOrder,
        getOrderById,
        fetchOrderById,
        updateOrderStatus,
        refreshOrders,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
