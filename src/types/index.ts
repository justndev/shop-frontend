// < -- ENTITIES -- >

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'USER' | 'ADMIN'
  isVerified: boolean
  createdAt: string
}

// < -- HELPERS -- >

export type Tab = 'profile' | 'dashboard' | 'orders ' | 'logout';

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  type: AlertType,
  message: string
}


export interface MediaImage {
  filename: string
  url: string
  size: number
  createdAt: string
}

export interface CartItem {
  id: string
  cartId: string
  productId: string
  product: Product
  quantity: number
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product?: Product
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}



export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "image" | "pdf" | "video" | "other";
  size: number; // bytes
  width?: number;
  height?: number;
  uploadedAt: Date;
  altText: string;
  title: string;
  caption: string;
  description: string;
}


export interface Category {
  id: string
  name: string
  slug: string
  createdAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  stock: number
  isActive: boolean
  images: string[]
  categoryId: string
  category?: Category
  createdAt: string
}