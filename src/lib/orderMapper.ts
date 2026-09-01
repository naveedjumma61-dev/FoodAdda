import { Order, OrderStatus, CartItem, DeliveryDetails } from '@/types';

/**
 * Maps database uppercase OrderStatus enum to frontend lowercase string.
 */
export function toFrontendStatus(dbStatus: string | null | undefined): OrderStatus {
  if (!dbStatus) return 'confirmed';
  const s = dbStatus.toUpperCase();
  switch (s) {
    case 'PENDING':
      return 'pending';
    case 'CONFIRMED':
      return 'confirmed';
    case 'PREPARING':
      return 'preparing';
    case 'READY':
      return 'ready';
    case 'RIDER_ASSIGNED':
      return 'rider_assigned';
    case 'OUT_FOR_DELIVERY':
      return 'out_for_delivery';
    case 'DELIVERED':
      return 'delivered';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return (s.toLowerCase().replace(/\s+/g, '_') as OrderStatus) || 'confirmed';
  }
}

/**
 * Maps frontend lowercase string status to database uppercase OrderStatus enum.
 */
export function toDatabaseStatus(frontendStatus: OrderStatus | string): string {
  if (!frontendStatus) return 'CONFIRMED';
  const s = frontendStatus.toLowerCase();
  switch (s) {
    case 'pending':
      return 'PENDING';
    case 'confirmed':
      return 'CONFIRMED';
    case 'preparing':
      return 'PREPARING';
    case 'ready':
      return 'READY';
    case 'rider_assigned':
      return 'RIDER_ASSIGNED';
    case 'out_for_delivery':
      return 'OUT_FOR_DELIVERY';
    case 'delivered':
      return 'DELIVERED';
    case 'cancelled':
      return 'CANCELLED';
    default:
      return frontendStatus.toUpperCase().replace(/\s+/g, '_');
  }
}

/**
 * Transforms a database Order record (from Prisma with includes) into the frontend Order interface.
 */
export function mapDbOrderToFrontend(dbOrder: any): Order {
  if (!dbOrder) {
    throw new Error('Invalid order data to map');
  }

  // Parse delivery address parts
  const addressParts = (dbOrder.deliveryAddress || '').split(',').map((p: string) => p.trim());
  const hostelName = addressParts[0] || dbOrder.customer?.hostel || 'Hostel City';
  const roomNumber = addressParts[1] || 'Room 101';
  const campus = dbOrder.customer?.campus || 'COMSATS University Islamabad';

  const deliveryDetails: DeliveryDetails = {
    customerName: dbOrder.customer?.name || 'Student',
    customerPhone: dbOrder.customerPhone || dbOrder.customer?.phone || '0300-0000000',
    campus,
    hostelName,
    roomNumber,
    instructions: dbOrder.instructions || undefined,
    paymentMethod: (dbOrder.paymentMethod?.toLowerCase() === 'easypaisa'
      ? 'easypaisa'
      : dbOrder.paymentMethod?.toLowerCase() === 'jazzcash'
      ? 'jazzcash'
      : 'cod') as 'cod' | 'easypaisa' | 'jazzcash',
  };

  // Map order items to CartItem format
  const items: CartItem[] = Array.isArray(dbOrder.orderItems)
    ? dbOrder.orderItems.map((oi: any, idx: number) => ({
        id: oi.id || `item-${idx}`,
        quantity: oi.quantity || 1,
        unitPrice: oi.price || 0,
        menuItem: {
          id: oi.menuItemId || oi.menuItem?.id || `m-${idx}`,
          restaurantId: dbOrder.restaurantId || '',
          restaurantName: dbOrder.restaurant?.name || 'Campus Restaurant',
          name: oi.menuItem?.name || 'Food Item',
          description: oi.menuItem?.description || '',
          price: oi.price || oi.menuItem?.price || 0,
          image: oi.menuItem?.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80',
          category: (oi.menuItem?.category as any) || 'Desi Food',
        },
      }))
    : [];

  // Map rider info if present
  let rider = undefined;
  if (dbOrder.rider) {
    rider = {
      name: dbOrder.rider.user?.name || dbOrder.rider.name || 'Campus Rider',
      phone: dbOrder.rider.phone || dbOrder.rider.user?.phone || '0315-7744332',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      bikeModel: dbOrder.rider.vehicleType || 'Honda CD 70',
      plateNumber: dbOrder.rider.plateNumber || 'ICT-RI-8841',
      rating: 4.9,
    };
  }

  // Format creation time
  let createdAtFormatted = 'Just now';
  if (dbOrder.createdAt) {
    try {
      const date = new Date(dbOrder.createdAt);
      createdAtFormatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      createdAtFormatted = 'Today';
    }
  }

  return {
    id: dbOrder.orderNumber || dbOrder.id,
    createdAt: createdAtFormatted,
    status: toFrontendStatus(dbOrder.status),
    items,
    restaurantId: dbOrder.restaurantId || '',
    restaurantName: dbOrder.restaurant?.name || 'Hostel Adda Partner',
    restaurantLogo: dbOrder.restaurant?.logoImage || dbOrder.restaurant?.coverImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80',
    restaurantPhone: dbOrder.restaurant?.phone || '+92 301 5551201',
    deliveryDetails,
    subtotal: dbOrder.subtotal || 0,
    deliveryFee: dbOrder.deliveryFee || 0,
    discount: dbOrder.discount || 0,
    voucherCode: dbOrder.voucherCode || undefined,
    total: dbOrder.total || 0,
    estimatedDeliveryTime: '20-25 mins',
    rider,
  };
}
