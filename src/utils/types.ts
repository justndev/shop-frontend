// < ------------- HELPERS ------------- >

export type Locale = "en" | "ru" | "et";
export type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER';
export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'ABORTED' | 'EXPIRED';
export interface TranslatedStrings { en: string; ru?: string; et?: string; }
export interface AuthTokens {
  accessToken: string
  refreshToken: string
}
export interface BackendResponse<T> {
  details: string;
  data: T;
}
// < ------------- ENTITIES ------------- >

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'USER' | 'ADMIN'
  isVerified: boolean
  createdAt: string
}

export interface Product {
  id: string;
  brand: string;
  name: TranslatedStrings;
  slug: string;
  shortDescription: TranslatedStrings;
  description: TranslatedStrings;
  price: number;
  salePrice: number | null;
  stockStatus: StockStatus;
  stock: number;
  images: string[];
  thumbnails: string[];
  category: Category;
  tags: string[];
}

export interface Category {
  id: string;
  name: TranslatedStrings;
  slug: string;
  image?: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: TranslatedStrings;
  createdAt: string;
}

export interface Order {
  id: string;

  userId: string;
  status: OrderStatus;

  totalAmount: number;

  mkTransactionId?: string | null;
  mkPaymentMethod?: string | null;

  deliveryMethod?: string | null;
  deliveryPrice?: number | null;

  contactInfo?: OrderContactInfo | null;

  createdAt: string;

  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;

  productId: string;
  product: Product;

  quantity: number;
}

export interface ShippingMethod {
  id:          string;
  price:       number;
  displayName: string;
}

export interface OrderContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  note?: string;
}

// < -- COMPONENTS -- >

export type AlertType = 'success' | 'error' | 'warning' | 'info';
export interface Alert {
  type: AlertType,
  message: string
}
