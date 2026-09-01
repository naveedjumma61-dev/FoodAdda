export type FoodCategoryType = 
  | 'All'
  | 'Pizza'
  | 'Burger'
  | 'Biryani'
  | 'Fast Food'
  | 'Juice'
  | 'Tea & Cafe'
  | 'Chinese'
  | 'Desi Food';

export interface CategoryInfo {
  id: string;
  name: FoodCategoryType;
  displayName: string;
  image: string;
  itemCount: number;
  badge?: string;
  color?: string;
}

export interface MenuItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemOptionGroup {
  id: string;
  name: string;
  required: boolean;
  options: MenuItemAddon[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: FoodCategoryType;
  isPopular?: boolean;
  isVeg?: boolean;
  isSpicy?: boolean;
  preparationTime?: string;
  calories?: string;
  optionGroups?: MenuItemOptionGroup[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  coverImage: string;
  categories: FoodCategoryType[];
  rating: number;
  ratingCount: number;
  deliveryTime: string; // e.g. "15-25 min"
  distance: string; // e.g. "0.8 km"
  minOrder: number; // in PKR
  deliveryFee: number; // in PKR (0 for free)
  isFeatured?: boolean;
  isOpen: boolean;
  openingHours: string;
  campusZone: string; // e.g. "COMSATS Gate 1 / Hostel City"
  address: string;
  phone: string;
  featuredDishes: string[];
}

export interface CartItem {
  id: string; // unique item cart instance id (item.id + options hash)
  menuItem: MenuItem;
  quantity: number;
  selectedAddons?: MenuItemAddon[];
  specialInstructions?: string;
  unitPrice: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'rider_assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderRider {
  name: string;
  phone: string;
  avatar: string;
  bikeModel: string;
  plateNumber: string;
  rating: number;
}

export interface DeliveryDetails {
  customerName: string;
  customerPhone: string;
  campus: string;
  hostelName: string;
  roomNumber: string;
  instructions?: string;
  paymentMethod: 'cod' | 'easypaisa' | 'jazzcash';
}

export interface Order {
  id: string; // e.g. "STU-10482"
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
  restaurantPhone: string;
  deliveryDetails: DeliveryDetails;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  voucherCode?: string;
  total: number;
  estimatedDeliveryTime: string;
  rider?: OrderRider;
}

export interface CampusLocation {
  id: string;
  name: string;
  zone: string;
  address: string;
  hostels: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  campus: string;
  hostel: string;
  room: string;
  avatar: string;
  studentId: string;
  savedAddresses: {
    id: string;
    title: string;
    campus: string;
    hostel: string;
    room: string;
    isDefault: boolean;
  }[];
  favoriteRestaurantIds: string[];
}
