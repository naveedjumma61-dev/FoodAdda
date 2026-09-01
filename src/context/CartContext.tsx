'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem, MenuItemAddon } from '../types';
import { PROMO_CODES } from '../data/mockData';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  restaurantLogo: string | null;
  restaurantDeliveryFee: number;
  isCartOpen: boolean;
  appliedCoupon: string | null;
  discountAmount: number;
  specialInstructions: string;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (menuItem: MenuItem, quantity?: number, selectedAddons?: MenuItemAddon[], specialInstructions?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setInstructions: (text: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
  const [restaurantDeliveryFee, setRestaurantDeliveryFee] = useState<number>(40);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const { showToast } = useToast();

  // Load from local storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('hosteladda_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setItems(parsed.items || []);
        setRestaurantId(parsed.restaurantId || null);
        setRestaurantName(parsed.restaurantName || null);
        setRestaurantLogo(parsed.restaurantLogo || null);
        setRestaurantDeliveryFee(parsed.restaurantDeliveryFee || 40);
        setAppliedCoupon(parsed.appliedCoupon || null);
        setSpecialInstructions(parsed.specialInstructions || '');
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage', e);
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        'hosteladda_cart',
        JSON.stringify({
          items,
          restaurantId,
          restaurantName,
          restaurantLogo,
          restaurantDeliveryFee,
          appliedCoupon,
          specialInstructions,
        })
      );
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items, restaurantId, restaurantName, restaurantLogo, restaurantDeliveryFee, appliedCoupon, specialInstructions]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce((acc, item) => {
    return acc + item.unitPrice * item.quantity;
  }, 0);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon && PROMO_CODES[appliedCoupon]) {
    const promo = PROMO_CODES[appliedCoupon];
    if (subtotal >= promo.minSubtotal) {
      discountAmount = promo.discount;
    }
  }

  // Free delivery threshold: Rs. 999
  const deliveryFee = subtotal >= 999 || items.length === 0 ? 0 : restaurantDeliveryFee;

  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addItem = (
    menuItem: MenuItem,
    quantity: number = 1,
    selectedAddons: MenuItemAddon[] = [],
    instructions: string = ''
  ) => {
    // If cart has items from another restaurant, reset with confirmation
    if (restaurantId && restaurantId !== menuItem.restaurantId && items.length > 0) {
      if (
        !window.confirm(
          `Your cart contains items from "${restaurantName}". Starting a new order from "${menuItem.restaurantName}" will clear your previous items. Proceed?`
        )
      ) {
        return;
      }
      setItems([]);
    }

    setRestaurantId(menuItem.restaurantId);
    setRestaurantName(menuItem.restaurantName);

    // Calculate item unit price with addons
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    const unitPrice = menuItem.price + addonsPrice;

    // Create unique ID based on item ID and addons selected
    const addonKey = selectedAddons
      .map((a) => a.id)
      .sort()
      .join('-');
    const cartItemId = `${menuItem.id}_${addonKey}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: cartItemId,
            menuItem,
            quantity,
            selectedAddons,
            specialInstructions: instructions,
            unitPrice,
          },
        ];
      }
    });

    showToast(`Added to Cart!`, `${menuItem.name} (Rs. ${unitPrice}) added.`, 'success');
  };

  const removeItem = (cartItemId: string) => {
    setItems((prevItems) => {
      const remaining = prevItems.filter((item) => item.id !== cartItemId);
      if (remaining.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
        setAppliedCoupon(null);
      }
      return remaining;
    });
    showToast('Item Removed', 'Item removed from your cart.', 'info');
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    setAppliedCoupon(null);
    setSpecialInstructions('');
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const promo = PROMO_CODES[cleanCode];

    if (!promo) {
      showToast('Invalid Voucher', 'Promo code not recognized.', 'error');
      return { success: false, message: 'Invalid promo code' };
    }

    if (subtotal < promo.minSubtotal) {
      const msg = `Order must be at least Rs. ${promo.minSubtotal} for this code.`;
      showToast('Minimum Order Required', msg, 'error');
      return { success: false, message: msg };
    }

    setAppliedCoupon(cleanCode);
    showToast('Promo Applied!', `${promo.description}`, 'success');
    return { success: true, message: `Applied ${cleanCode}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo Removed', 'Voucher code removed.', 'info');
  };

  const setInstructions = (text: string) => {
    setSpecialInstructions(text);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        restaurantName,
        restaurantLogo,
        restaurantDeliveryFee,
        isCartOpen,
        appliedCoupon,
        discountAmount,
        specialInstructions,
        totalItems,
        subtotal,
        deliveryFee,
        total,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        setInstructions,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
