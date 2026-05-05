export interface Vendor {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewsCount?: number;
  deliveryTime: string;
  category: string;
  isFreeDelivery: boolean;
  location: string;
}

export interface Review {
  id: string;
  vendorId: string;
  orderId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FoodItem {
  id: string;
  vendorId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
  vendorName?: string;
}

export interface Order {
  id: string;
  date: string;
  time: string;
  vendorName: string;
  vendorId?: string;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  total: number;
  items: CartItem[];
  estimatedDeliveryTime?: string;
  deliveryPreference?: string;
  address?: string;
  deliveryInstructions?: string;
  reviewed?: boolean;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  image: string;
}
