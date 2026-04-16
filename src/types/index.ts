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

type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK';

export interface TranslatedStrings { en: string; ru?: string; et?: string; }


// < ------------- ENTITIES ------------- >

export interface Category {
  id: string;
  name: TranslatedStrings;
  slug: string;
  image?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice: number | null;
  stockStatus: StockStatus;
  images: string[];
  thumbnails: string[];
  category: Category;
  tags: string[];
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

